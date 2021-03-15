---
layout: post
title:  "Embedding Mono in a C++ application"
date:   2015-03-30 20:35:12 +0200
categories: mono cpp
---

On this post we will see how it is possible to embed the Mono runtime in a C++ application.

## Why Mono?

Mono can extend the scripting capabilities of your C++ application by providing access to a wide range of languages like C#, F#, Python and Ruby ([full list of supported languages](http://www.mono-project.com/docs/about-mono/languages/)). It offers a safe, managed environment with garbage collection, and better performance than most scripting languages.

## How to include Mono in your project's configuration

1. First of all, download and install Mono from [http://www.mono-project.com/download/](http://www.mono-project.com/download/).
2. Assuming you installed it at `%MONO_ROOT%`, add the folder `%MONO_ROOT%/include/mono-2.0` to your project's include folders.
3. Then, link against the `%MONO_ROOT%/lib/mono-2.0.lib` library.
4. Finally, the `mono-2.0.dll` must be in the DLL search path in order to run your application. This dll is not directly available. In the `%MONO_ROOT%/bin` folder you will find the `libmonoboehm-2.0.dll` and `libmonosgen-2.0.dll`. Copy either (depending on which GC implementation you prefer) on your application's path and rename it to `mono-2.0.dll`.

## A sample C# class

Now, let's assume that we have the following C# class, compiled in an assembly called Example.dll. This will be the class that we will interact with from the C++ host application.

{% highlight c# %}
using System;

namespace Example
{
  public class Entity
  {
    private String name;

    public Entity(String name)
    {
      this.name = name;
      System.Console.WriteLine("Entity " + name + " constructed");
    }

    ~Entity()
    {
      System.Console.WriteLine("Entity " + name + " destructed");
    }

    public void Process()
    {
      throw new NotImplementedException("Not implemented yet");
    }

    public String GetName()
    {
      return name;
    }
  }
}
{% endhighlight %}

## Embedding Mono
### Initialization

The first thing we need to do, is to initialize the Mono runtime and load our assembly:

{% highlight c++ %}
// point to the relevant directories of the Mono installation
mono_set_dirs("./mono/lib",
              "./mono/etc");

// load the default Mono configuration file in 'etc/mono/config'
mono_config_parse(nullptr);

MonoDomain* monoDomain = mono_jit_init_version("embedding_mono_domain",
                                               "v4.0.30319");

// open our Example.dll assembly
MonoAssembly* assembly = mono_domain_assembly_open(monoDomain,
                                                   "Example.dll");
MonoImage* monoImage = mono_assembly_get_image(assembly);
{% endhighlight %}

### Creating C# objects

In order to use the Entity class, we have to construct an instance of it:

{% highlight c++ %}
// find the Entity class in the image
MonoClass* entityClass = mono_class_from_name(monoImage,
                                              "Example",
                                              "Entity");

// allocate memory for one Entity instance
MonoObject* entityInstance = mono_object_new(monoDomain, entityClass);
{% endhighlight %}

The instance is not yet created. The only thing mono_object_new does is to allocate enough memory for one Entity object. In order to instanciate the object, we have to call a constructor.

### Invoking constructor and methods

Constructors and methods are invoked in the same way: first obtain a pointer to the MonoMethod representing the constructor or method, prepare any arguments and finally call mono_runtime_invoke:

{% highlight c++ %}
// find the Entity class constructor method that takes one parameter
MonoMethod* constructorMethod = mono_class_get_method_from_name(entityClass,
                                                                ".ctor",
                                                                1);

// create a MonoString that will be passed to the constructor as an argument
MonoString* name = mono_string_new(mono_domain_get(), "Giorgos");
void* args[1];
args[0] = name;

// finally, invoke the constructor
MonoObject* exception = NULL;
mono_runtime_invoke(constructorMethod, entityInstance, args, &exception);
{% endhighlight %}

> The name ".ctor" is a special name that is used to refer to constructor methods.

At this point, an Entity instance is constructed in the Mono runtime. We can now freely some other Entity methods.

{% highlight c++ %}
// find the Process method that takes zero parameters
MonoMethod* processMethod = mono_class_get_method_from_name(entityClass,
                                                            "Process",
                                                            0);
exception = nullptr;

// invoke the method
// if invoking static methods, then the second argument must be NULL
mono_runtime_invoke(processMethod, entityInstance, nullptr, &exception);

// check for any thrown exception
if(exception)
  {
    std::cout << mono_string_to_utf8(mono_object_to_string(exception, nullptr))
              << std::endl;
  }
{% endhighlight %}


We can also retrieve the result of a method on the host application:

{% highlight c++ %}
// find the GetName method
MonoMethod* getNameMethod = mono_class_get_method_from_name(entityClass,
                                                            "GetName",
                                                            0);
exception = nullptr;
MonoString* ret = (MonoString*) mono_runtime_invoke(getNameMethod, entityInstance, nullptr, &exception);
char* c = mono_string_to_utf8(ret);
std::cout << "Value of 'name' is " << c << std::endl;

// free the memory allocated from mono_string_to_utf8 ()
mono_free(c);
{% endhighlight %}

### Getting/Setting fields

The API also allows us to set/get field values:

{% highlight c++ %}
// find the Id field in the Entity class
MonoClassField* idField = mono_class_get_field_from_name(entityClass, "Id");
int value = 42;

// set the field's value
mono_field_set_value(entityObject, idField, &value);

int result;
mono_field_get_value(entityObject, idField, &result);
std::cout << "Value of 'Id' is " << result << std::endl;
{% endhighlight %}

### Shutting down

When done with Mono we can shut it down in order to release any used resources:

{% highlight c++ %}
// shutdown mono
mono_jit_cleanup(monoDomain);
{% endhighlight %}

> Note that after calling mono_jit_cleanup, you can't reinitialize the runtime in the same process again. This can be annoying in case you have unit tests running in one process and you are initializing/cleaning up per test (I learned this the hard way). In this case, make sure you initialize and cleanup only once per process.

When running the above code you should see the following output:

{% highlight text %}
Entity Giorgos constructed
System.NotImplementedException: Not implemented yet
  at Example.Entity.Process () [0x00000] in <filename unknown>:0
Value of 'Name' is Giorgos
Value of 'Id' is 42
Entity Giorgos destructed
{% endhighlight %}

## Summary

I hope this post can help you in any way. You can find the full source code here.

Check out the Mono documentation for a more detailed info about embedding here.
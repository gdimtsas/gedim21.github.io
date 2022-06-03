---
title: "Embedded Mono: Invoking a C# generic method (Part 2) "
date: 2015-07-09 20:35:12 +0200
header:
  teaser: /assets/images/mono.png
tags: 
  - mono
  - c++
categories: 
  - programming
  - tutorial
---

A while ago I wrote about [how to invoke a C# generic method]({% post_url 2015-04-21-embedding-mono-generic-method-1 %}), by using a helper method in the assembly. In this post, we will see how to invoke generic methods using solely the Mono embedding API. A much preferred alternative, since you don’t pollute your assemblies with helper methods that are used by C++ only.

As before, the TestClass that contains the generic method:

{% highlight c# %}
using System;
 
namespace MonoGenerics
{
  public class TestClass
  {
    public void GenericMethod<T>(T t)
    {
      Console.WriteLine(t);
    }
  }
}
{% endhighlight %}

As is the previous post, we will still use reflection to get a specialized instance of `GenericMethod`, but this time we will do it solely through the embedding API.

The first step is to find the [MethodInfo.MakeGenericMethod](https://msdn.microsoft.com/en-us/library/system.reflection.methodinfo.makegenericmethod(v=vs.100).aspx) method:

{% highlight c++ %}
MonoAssembly* mscorlibAssembly = mono_domain_assembly_open(monoDomain,
                                                           "mono/lib/mono/4.0/mscorlib.dll");

MonoImage* systemImage = mono_assembly_get_image(mscorlibAssembly);

MonoClass* methodInfoClass = mono_class_from_name(systemImage,
                                                  "System.Reflection",
                                                  "MonoMethod");

// find the MethodInfo.MakeGenericMethod(Type[]) method
MonoMethod* makeGenericMethod = mono_class_get_method_from_name(methodInfoClass,
                                                                "MakeGenericMethod",
                                                                1);
{% endhighlight %}

Then, we want to find the `TestClass.GenericMethod` and get an instance of a `MonoReflectionMethod`, that represents the `GenericMethod`. On that instance, we will later call the makeGenericMethod MonoMethod that we got from above.

{% highlight c++ %}
// Our test class, that contains the GenericMethod method, which we want to call
MonoClass* testClass = mono_class_from_name(monoImage,
                                            "MonoGenerics",
                                            "TestClass");

// find GenericMethod method from our TestClass, the method that we want to invoke
MonoMethod* genericMethod = mono_class_get_method_from_name(testClass,
                                                            "GenericMethod",
                                                            1);

MonoReflectionMethod* monoReflectionMethod = mono_method_get_object(monoDomain,
                                                                    genericMethod,
                                                                    testClass);
{% endhighlight %}

The [MethodInfo.MakeGenericMethod](https://msdn.microsoft.com/en-us/library/system.reflection.methodinfo.makegenericmethod(v=vs.100).aspx) method accepts an array of Types as its only parameter. Lets create that array:

{% highlight c++ %}
MonoType* monoType = mono_reflection_type_from_name("System.String", monoImage);
MonoReflectionType* monoReflectionType = mono_type_get_object(monoDomain,
                                                              monoType);

// create an array of Types, that will be the argument to MethodInfo.MakeGenericMethod(Type[])
MonoArray* array = mono_array_new(monoDomain, mono_class_from_mono_type(monoType), 1);
mono_array_set(array, MonoReflectionType*, 0, monoReflectionType);
void* makeGenArgs[1];
makeGenArgs[0] = array;
{% endhighlight %}

Now we have have everything we need to call the MakeGenericMethod; a method definition, an instance to call it against and the method parameters:

{% highlight c++ %}
MonoObject* exception = NULL;
MonoObject* methodInfo = mono_runtime_invoke(makeGenericMethod, monoReflectionMethod, makeGenArgs, &exception);
{% endhighlight %}

We now have a [MethodInfo](https://msdn.microsoft.com/en-us/library/system.reflection.methodinfo(v=vs.100).aspx) instance, that represents the void `GenericMethod(String t)` method. What we need now, is the value of its [MethodHandle](https://msdn.microsoft.com/en-us/library/system.reflection.methodbase.methodhandle(v=vs.100).aspx) property:

{% highlight c++ %}
// get the class definition of the methodInfo instance
MonoClass* monoGenericMethodClass = mono_object_get_class(methodInfo);

// MethodHandle property of MethodInfo class
MonoProperty* methodHandleProperty = mono_class_get_property_from_name(monoGenericMethodClass, "MethodHandle");

// the getter of the above property
MonoMethod* getMethodHandleMethod = mono_property_get_get_method(methodHandleProperty);

// invoke the getter from above
MonoObject* methodHandle = mono_runtime_invoke(getMethodHandleMethod, methodInfo, NULL, &exception);
{% endhighlight %}

All that is left to do is to unbox the methodHandle into a MonoMethod and invoke the latter as usual:

{% highlight c++ %}
MonoMethod* specializedMethod = *(MonoMethod**) mono_object_unbox(methodHandle);

void* args[1];
args[0] = mono_string_new(monoDomain, "Finally!");
MonoObject* testClassInstance = mono_object_new(monoDomain, testClass);
mono_runtime_invoke(specializedMethod, testClassInstance, args, &exception);
{% endhighlight %}

That’s all for this tutorial. Full source code can be found [here](https://gist.github.com/gedim21/8d86ba8e59ac5d8ed0ee).

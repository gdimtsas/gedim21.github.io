---
title: "Embedded Mono: Invoking a C# generic method (Part 1)"
date: 2015-04-21 20:35:12 +0200
header:
  teaser: /assets/images/embedded-mono-generic-method-part-1/teaser.png
tags: 
  - mono
  - c++
categories: 
  - programming
  - tutorial
toc: false
---

On [a previous post]({% post_url 2015-03-30-embedding-mono-in-cpp %}) we saw how to embed the Mono runtime in a C++ application, load some C# classes and invoke methods on them. However, when you want to invoke generic methods, things become slightly more complicated.

(Edit 8/7/2015: Part 2 of this tutorial can be found [here]({% post_url 2015-07-09-embedding-mono-generic-method-2 %}), showing an alternative solution without using C# helper methods)

Let's say we want to invoke the GenericMethod<T>(T t) from the following class:


{% highlight c# %}
using System;
using System.Reflection;

namespace MonoGenerics
{
  public class TestClass
  {
    public void GenericMethod(T t)
    {
      Console.WriteLine(t);
    }
  }
}
{% endhighlight %}

We will initialize Mono, load our assembly, and create an instance of the TestClass class:

{% highlight c++ %}
#include <mono/jit/jit.h>
#include <mono/metadata/mono-config.h>
#include <mono/metadata/assembly.h>
#include <mono/metadata/debug-helpers.h>
#include <string>

int main()
{
  mono_set_dirs("./mono/lib", "./mono/etc");
  mono_config_parse(NULL);

  MonoDomain* monoDomain = mono_jit_init_version("embedding_mono_domain",
                                                 "v4.0.30319");
  MonoAssembly* monoAssembly = mono_domain_assembly_open(monoDomain,
                                                         "MonoGenerics.dll");
  MonoImage* monoImage = mono_assembly_get_image(monoAssembly);
  MonoClass* testClass = mono_class_from_name(monoImage,
                                              "MonoGenerics",
                                              "TestClass");
  MonoObject* testClassInstance = mono_object_new(monoDomain, testClass);
{% endhighlight %}

At this point, we just just need to lookup the GenericMethod method and mono_runtime_invoke it. If we took the usual route and tried this:

{% highlight c++ %}
MonoMethod* genericMethod = mono_class_get_method_from_name(testClass, 
                                                            "GenericMethod", 
                                                            1);
char* name = mono_method_full_name(genericMethod, true);
{% endhighlight %}

we would see that the "name" variable would contain:

{% highlight c++ %}
MonoGenerics.TestClass:GenericMethod<T> (T)
{% endhighlight %}

It may seem this is what we need, but it isn't. If we tried to mono_runtime_invoke this method our application would crash. What we need is a specialized method for the type that we need to pass to the GenericMethod. For example, for a String parameter we need a method of signature:

{% highlight c++ %}
MonoGenerics.TestClass:GenericMethod<string> (string)
{% endhighlight %}

In order to do this, we will facilitate the [MethodInfo.MakeGenericMethod](https://msdn.microsoft.com/en-us/library/system.reflection.methodinfo.makegenericmethod(v=vs.110).aspx) method from the System.Reflection namespace. Let's add the following helper method to our TestClass:

{% highlight c# %}
public static IntPtr MakeGenericMethod(MethodInfo method, Type type)
{
  return method.MakeGenericMethod(type).MethodHandle.Value;
}
{% endhighlight %}

Now on the C++ side we need to lookup this method and invoke it with a MethodInfo for the GenericMethod and a Type for System.String. Its return value will be the specialized GenericMethod method:

{% highlight c++ %}
MonoMethod* helperMethod = mono_class_get_method_from_name(testClass,
                                                           "MakeGenericMethod",
                                                           2);
MonoReflectionMethod* monoReflectionMethod = mono_method_get_object(monoDomain,
                                                                    genericMethod,
                                                                    testClass);

MonoType* monoType = mono_reflection_type_from_name("System.String", 
                                                     monoImage);
MonoReflectionType* monoReflectionType = mono_type_get_object(monoDomain,
                                                              monoType);

void* helperArgs[2];
helperArgs[0] = monoReflectionMethod;
helperArgs[1] = monoReflectionType;

MonoObject* exception = NULL;
MonoObject* boxedResult = mono_runtime_invoke(helperMethod, 
                                              NULL, 
                                              helperArgs, 
                                              NULL);
MonoMethod* specializedMethod = *(MonoMethod**) mono_object_unbox(boxedResult);
char* name = mono_method_full_name(specializedMethod , true);
{% endhighlight %}

If we try the mono_method_full_name on the specializedMethod, we will get:

{% highlight c++ %}
MonoGenerics.TestClass:GenericMethod<string> (string)
{% endhighlight %}


Now finally, we can invoke the GenericMethod using a String as an argument:

{% highlight c++ %}
void* args[1];
args[0] = mono_string_new(monoDomain, "Finally!");
exception = NULL;
mono_runtime_invoke(specializedMethod, testClassInstance, args, &exception);
{% endhighlight %}

## Final notes
* For methods that take more than one template parameter, we can modify MakeGenericMethod to accept an array to Types. For the sake of simplicity this isn't portrayed here, but it's fairly easy to implement.
* It is also possible to implement the MakeGenericMethod method using entirely the mono API, without using any C# code. But that would take a lot of boilerplate code. It's a lot easier to include it as C# code in a utility class.
* Full source code can be found [here](https://gist.github.com/gedim21/c50e46173e9e55083ed4).

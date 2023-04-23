# Juno Tutorial Part 2
## Accessing JavaScript, Imports, Namespaces and Macros

This is part 2 of the Juno Language Tutorial.  To get to part 1, go to (tutorial)[tutorial.md].

---
In the first tutorial, we covered the basics of the language: syntax, quoting, values and symbols, operators, forms, and functions.  Having a this foundation will get you far in the language.  This next part goes into more detail regarding those areas and introduces new concepts.   The objective here is to deepen your understanding of key ideas so that you become a more effective programmer of the Juno language.

☞ This tutorial assumes you are working within the Seedling IDE, with some exceptions.  Many examples will be inefficient to type in at the command line Juno REPL, and you'll want to use the buffers of the IDE to refine and revise your code.  When examples require the command line (server) environment of Deno, the following prompt will be displayed as part of the example:
```
[user] λ-> 
```

---

### Accessing JavaScript

The purpose of Juno is to allow the programmer to combine the power and flexibility of Lisp with JavaScript environments, whether it be the browser, Deno, or other containers.  Naturally then we will need an ability to access JavaScript resources in an efficient manner that integrates the Lisp environment effectively. 

JavaScript resources, objects and functions are accessible for use as they are in regular JavaScript.  For example:
```
(console.log "The current time in milliseconds since 1970 is" (time_in_millis))
```
In the above example we combined the `console` object's `log` method, with a Juno function `time_in_millis`.  Just like in JavaScript, we can access globally accessible object.  Like in JavaScript, the `.` appearing in a symbol denotes that we are interested in a member element of the object.  

We can inspect and access the global scope in the REPL by referencing `globalThis`.  We don't have to reference `globalThis` as a qualifier, as we saw in the above example with `console` object.

Let's make a JavaScript object and see how we can reference it and access its functionality:

```
(defglobal my_date (new Date))
```
You'll see in a REPL a representation of our new Date object as its time value.  Using `object_methods` we can inspect the properties:

```
(object_methods my_date)
```
The methods it provides are returned to the REPL output.
To use a method, we need use the call operator, which ensures that the object's `this` context is the object.  The `->` provides this facility. 
```
(-> my_date `toTimeString)
```
In the above example, we are *calling* my_date's function "toTimeString".  Note that the name of the function is quoted, since it isn't a symbol itself.  If we didn't quote `toTimeString`, the compiler would treat it as a symbol and try to resolve it.  If it couldn't be found, then an error would be thrown.  

We can also pass any number of arguments to the method we are calling:
```
(-> my_date `setMonth 1)
```
The month is now set to February.  

JavaScript resources can be bound into the environment to Lisp symbols, which refer to the external resource.  This is more efficient then references in code to non-bound JavaScript, because the external JavaScript environment is searched last when trying to resolve a symbol.  A symbol is considered to be *external* when there is not a bound symbol within the Juno environment.  Let's take a look at an example:
```
(describe `Date`)
```
```
{
  location: "external",
  type: "Function",
  name: "Date",
  namespace: "EXTERNAL",
  description: "This is not a bound symbol within the Juno Environment.  If it is to be used, it is recommended to c..."
}
```
To make a bound symbol to `Date` within the Juno Environment by simply defining it:
```
(defglobal Date Date)
```
Now if we were to describe it we see it is in our environment.
```
{ namespace: "user"
  name: "Date"
  type: "Function"
  requires: []
  externals: ["Date"]
  source_name: "anonymous" }
```
The `externals` key indicates that the symbol references an external symbol, the JavaScript date function.

### Imports 

#### From the Juno REPL with Deno

Often we will want to import third-party libraries or code from source locations.  We can use the `import` macro to do so.  In Juno, the `import` call can work on either Lisp or JavaScript or TypeScript sources (if using Deno on the server).  For example:
```
[user] λ-> (import (readline_mod) "https://deno.land/x/readline/mod.ts")
```
This statement will load the readline library, and create a symbol called `readline_mod` which will be used to access it.  Since this is TypeScript, we need to look at it on the server:
```
[user] λ-> readline_mod
Module { readline: [AsyncGeneratorFunction: readline] }
```
Of course, JavaScript modules can also be imported from file system location, if permissions allow:
```
[user] λ-> (import (my_library) "/absolute/path/to/library.js")
```
We can also import lisp as well:
```
[user] λ-> (import "tests/compiler-tests.lisp")
```
Note that in this case we do not need to provide a symbol.  Instead, the lisp code is evaluated in the import, and the directives in the file determine the placement and construction of symbols.

#### Imports within the Browser Environment

Importing Lisp code into the browser is fairly straightforward when connected to a server and the Seedling services are running.  If you are in Seedling, you will need to specify the service path for file access `/files/` as a prefix into the Juno root folder: 

```
(import "/files/tests/seedling-tasks.juno")
```
This will behave like the import for Lisp on the command line Juno REPL, setting up any symbols, environmental structures, and initializations if necessary.  

We can also embed local JavaScript resources in our browser environment. These can be embedded into `<script>` tags as modules.  This can be done via the `File->Browser Environment->Import Local File` menu item, which will prompt you for the file and the symbol name to bind the newly imported module to. 

You can embed a JavaScript module via the REPL if you have the source text of the module already in memory. This might be from a Seedling buffer location or referenced via a symbol.

```
(embed_js `p5js p5js_text `p5)
```
This above will create a `<script>` tag with an id of `p5js` and bound to the symbol `p5`.

To see more on this subject see the `load_files` help via `(? load_files)`.


### Namespaces

When we covered the concept of global symbols and their scope in the first tutorial, it was stated that global symbols can be referenced from any context within the Environment in which they exist.  The term global implies that the there is one broad, global view which encompasses the whole "world" of symbols.  In actuality, there are multiple global scopes in a 2 level hierarchy, where, like lexical closures, the lower scopes can `see` the upper scope or `core` scope.   Each one of these scopes has a global space, or *toplevel*.   Symbols, and their values, can be organized into different scopes, which are called *namespaces*.

A namespace in Juno is a distinct toplevel scope that is a child of the "core", or root environment.  The child inherits certain common mechanisms from the parent, such as the compiler, the core library, and will defer to the core environment for any resolution of symbols that do not exist in the child namespace environment.  When a function or closure is defined in a namespace, it will be able to reference other symbols in the namespace it is defined in without the qualifier syntax.  If a referenced symbol is not found in the local namespace, the `core` environment's namespace is searched, and if the referenced symbol is found, the value the `core` symbol refers to will be returned to the caller.  If it is not found, a `ReferenceError` will be returned.

To get a list of defined namespaces, the function `namespaces` will return an array of namespace identifiers.

```
[user] λ-> (namespaces)
[ "http", "sys", "user", "core" ]
```

In the above, there are a total of four namespaces defined. 

Symbols can be written as *fully-qualified* by using a `/` to indicate that the requested symbol is to be found in the explicitly named namespace.  An example of a fully qualified symbol is `io/rebuild_env` where the symbol `rebuild_env` is to be found in the `io` namespace.  In the case of fully qualified symbols, there is not an implicit search path.  The resolution of the symbol will be directly to the prescribed namespace and symbol. If the function `io/load` was specifiedm even if a `load` symbol is in the currently active namespace or the `core` namespace, if the symbol `load` is not found in `io`, a ReferenceError will be returned.  Think of fully-qualified symbols being akin to absolute path specifiers.

A namespace can be defined with the `contained` options set to `true`, in which case the defined namespace will not be able to reference any other namespaces accept for itself and `core`, even if the symbol is fully-qualified.  This helps to ensure that boundaries are maintained between dependencies.

Within a running *Juno image*, which is defined as the `core` namespace plus all child namespaces, there is always a designated namespace that serves as a starting point for resolution of non-qualified symbols, called the current namespace.  This namespace represents the point at which symbol resolution should occur for certain activities, and for defining any new non-qualified symbols.  This starting namespace can be accessed by the function `current_namespace`.  By default, the current namespace on start up is `user`, which is a child of `core`.  The `user` namespace is uncontained, and so can access symbols in other namespaces by fully qualifying the namespace of the desired symbol.  

Specifically, the `(current_namespace)` value is referenced by specific functions in core that need to operate on or reference non-qualified symbols in a child namespace:

1. Imports of Lisp files that have not yet declared a namespace declaration.
2. Macro expansion
3. Dependency analysis 

When a symbol or form is compiled, it is assigned to a namespace, which is typically the value of `current_namespace` if the symbols are non-qualified.  If there is a toplevel declaration to the compiler that the form or expression is to be assigned a specific namespace, the compiler will target the specified namespace instead.  In each namespace, there is a value `*namespace*`, which reflects what namespace the function has been installed to.  Often this is different from the value returned from `current_namespace`.  Functions and scopes can determine what namespace they are assigned by referencing the value global namespace value `*namespace*`.   

The command line Juno REPL is tied to the `current_namespace` value.  If the namespace is changed via `set_namespace` command, or `use_ns` macro, the current target namespace will be changed, and this will be reflected in the name before the input prompt.  In this situation, there is only one connection to the system via the console.  

There are also situations where there will be multiple connections to the running Juno image.  In this case, each connection will have its own context, and may be connected to different namespaces. In the Seedling IDE, and with remote REPL-like connections, there is a designated namespace for the connection, which may be different from the image-wide `current_namespace` value.  The IDE will display the namespace to which it is currently connected to via the title line of the specific control.  Requests for compilation will be presented to the connected namespace, and symbol resolution will be from the child namespace, and secondarily, from  `core`.  

However, when a function bound within core must resolve non-qualfied symbols from a child namespace, the value from `current_namespace` will be consulted.  

#### The Compilation/Evaluation Cycle

When a Juno S-expression is to be evaluated, the text or JSON is presented to an `Environment` object.  Each `Environment` facilitates a namespace, either the `core` or a child.  The `Environment` object is the entry point for evaluation and interaction with Juno resources.  As mentioned above, each REPL connection can talk to a different Environment.  The symbol, `Environment` resolves to the current Environment that the REPL is connected to.  The `Environment` method `evaluate_local` is passed the S-expression and passes the S-expression and a reference to itself to the compiler, which will perform the translation from Juno to JavaScript and perform symbol resolution as required.  In most cases, global symbol references are compiled to dynamically resolve at runtime, such that if the dependency were to change, the changes would be reflected in the compiled code.  Once the S-expression has been turned into a JavaScript text, it is returned to the calling `Environment` object (or namespace), and a new JavaScript `Function` or `AsyncFunction` is created.  If the S-expression is determined to require global dependencies, the `Environment` object will be passed to the new JavaScript function and the function called, and the results returned.  The S-expression is always eventually evaluated within a JavaScript `Function` or `AsyncFunction` object. 

#### Using Namespaces

To get a list of all symbols in your current namespace, use the following:

`(symbols)`

This function will return an array of all global symbols in the namespace you are in.  To find all symbols in a specific namespace, prefix it with the namespace to be inspected, followed by a forward slash, and then the `symbols` function:

`(core/symbols)`


The function `defns` can be used to create a new namespace. 
```
(defns `tutorial)
```
By default, if the namespace exists already, an `EvalError` will be thrown.  Specifying true for the `options` argument key `ignore_if_exists` will suppress an error response, and do nothing if the namespace already exists.  


We have created a new namespace, but we aren't using it yet by default in our REPL session.  To switch our REPL session to the new namespace, use the `use_ns` macro:
```
(use_ns tutorial)
```
Note that with `use_ns` the namespace isn't quoted.  

Our REPL session will indicate via the via the label on the REPL control's top bar if in Seedling, or via the prompt if using the Juno command line REPL.

```
[tutorial] λ->
```

The namespace comes preloaded with a certain set of baseline symbols which can be accessed via the `symbols` function:
```
[
  "meta_for_symbol",    "describe",
  "undefine",           "*namespace*",
  "pend_load",          "symbols",
  "set_global",         "get_global",
  "symbol_definition",  "compile",
  "env_log",            "evaluate_local",
  "evaluate",           "eval_struct",
  "set_compiler",       "clone",
  "eval",               "add_escape_encoding",
  "get_outside_global", "as_lisp",
  "lisp_writer",        "clone_to_new",
  "save_env",           "null",
  "compiler"
]
```
Remember, though, that in addition to the above *local* symbols, the namespace can also access the `core` symbols as well implicitly, since the unqualified symbol search path starts in our `tutorial`, or child namespace, and then checks `core`.   Any symbols for other namespaces must be fully qualified, or local bindings created.

For example, if we had the `html` namespace loaded and wanted to use the symbols from that namespace in our `tutorial` namespace, we would use the `use_unique_symbols` function to bind any symbols that aren't already defined in our `tutorial` namespace:
```
(use_unique_symbols "html")
```
The number of symbols imported into our namespace is returned.  Now if we look at our available symbols via `symbols`, we will see that our namespace is populated with the symbols from the namespace "html".

We can use them without qualification:
```
(div { } "Hello World")
```
In the Seedling REPL , this will return an `HTMLDivElement` object.  We also could of directly referenced the `div` symbol in `html` via a fully qualified reference, `html/div`, but, by doing so, we are creating multiple points of hard dependencies in our code.  If the source of our symbols were to change, this would require many source changes because all the qualified symbols would have to be changed.  Therefore, in general, it is preferred to use a binding function like above to produce dependent bindings that can easily re-sourced due to dependency changes.

If we don't wish to bind all missing symbols from a source namespace to our target namespace, we can use the macro `use_symbols`, which is the underlying mechanisms used by the `use_unique_symbols` function to selectively bind symbols from source namespaces to a target namespace.

```
(use_symbols html [ button label ] )
```


#### Symbol Initializers

If we describe the imported symbol `div` we will see:

```
{   eval_when: {}
    initializer: ["\"=:pend_load\""
                  "html"
                  "tutorial"
                  "div"
                  "\"=:html/div\""]
    name: "div"
    namespace: "tutorial"
    require_ns: "html"
    requires: ["html/div"]
    type: "Function" }
```
The above indicates that the symbol is dependent on the `html` namespace being loaded.  The dependency is documented in the `require_ns` value, and that the `html/div` is a requirement for our symbol.  If we were to serialize the our environment, when being restored our `tutorial` namespace will be loaded after the `html` namespace.

When we The `initializer` key in the symbol's metadata indicates that when our `tutorial` namespace is being initialized, it will 
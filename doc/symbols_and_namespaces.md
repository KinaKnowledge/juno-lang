## Semantics - Symbols and Namespaces
----

### Symbols

  

### Namespaces

Juno allows for the segregation of symbols and their values via the concept of *namespaces*.  A namespace in Juno is a distinct toplevel scope that is a child of the "core", or root environment.  The child inherits certain common mechanisms from the parent, such as the compiler, the core library, and will defer to the core environment for any resolution of symbols that do not exist in the child namespace environment.  When a function or closure is defined in a namespace, it will be able to reference other symbols in the namespace it is defined in without the qualifier syntax.  If a referenced symbol is not found in the local namespace, the `core` environment's namespace is searched, and if the referenced symbol is found, the value the `core` symbol refers to will be returned to the caller.  If it is not found, a `ReferenceError` will be returned.

To get a list of defined namespaces, the function `namespaces` will return an array of namespace identifiers.

```Clojure
[user] λ-> (namespaces)
[ "user", "core" ]
```

Symbols can be written as **fully-qualified** by using a `/` to indicate that the requested symbol is to be found in the explicitly named namespace.  An example of a fully qualified symbol is `io/rebuild_env` where the symbol `rebuild_env` is to be found in the `io` namespace.  In the case of fully qualified symbols, there is not an implicit search path, so even if a `load` symbol is in the currently active namespace or the `core` namespace, it will not be referenced.  In this case, if the symbol `load` is not found in `io`, a ReferenceError will be returned.  A namespace can be defined with the `contained` options set to `true`, in which case the defined namespace will not be able to reference any other namespaces accept for itself and `core`, even if the symbol is fully-qualified.  This helps to ensure that boundaries are maintained between dependencies.

At all times, there is a currently active namespace, whose identifier can be accessed by calling the function `current_namespace`.   By default the currently active namespace is `user`, which is a child of `core`.  The `user` namespace is unconstrained, and so can access symbols in other namespaces by fully qualifying the namespace of the desired symbol.  When a form is compiled, it is assigned to a namespace, which is typically the value of `current_namespace`.  If there is a toplevel declaration to the compiler that the form or expression is to be assigned a specific namespace, the compiler will target the specified namespace instead.  In each namespace, there is a value \*namespace*, which reflects where the code has been compiled in.  Often this is different from the value returned from `current_namespace`.  Functions and scopes can determine what namespace they are assigned by referencing the value global namespace value `*namespace*`.  The following example illustrates the difference between `*namespace*` and `current_namespace`.


Discuss: Namespaces are really scope spaces, because they are minimum environments themselves.  They could be saved off as a saved scope, to be resurrected again by loading them in.  [ Note to self: we need to implement the saving of core and/or it's children to a serialized structure. ] For example, when serialized out, the output JSON would look just like a environment.js with an optional boot up, reinitialization function, and with all the state saved.  Things like the compiler would have to be rebound if it's eval is to be used, but that is precisely why the environment doesn't by default carry a compiler embedded in it.  The embedded rehydrate (tm) function would be called to initialize itself, and boom, back in business, plugged into it's new world.  The rehydrated JSON would have to be given a compiler perhaps if so configured (or stripped), and could be a resource for the parent environment and it's own environment running asynchronously.  The control is ultimately with the loader which by use of filtering macros can remove or implement functionality such as the compiler and the initialization function. This is not designed as a security mechanism, but as a way to craft information systems dynamically and to be synergistic in design to the DOM, which itself is a tree.  



If you are coming to Juno from outside the Lisp world, say from the Javascript world, the notion of how a variable is represented in the language is a bit different.  In fact, this is one of the key differences between a lisp family language and Javascript.  In Javascript, a variable is declared in the source code and it is the specific means in which to refer to a mutable or immutable value over the course of it's scope.  Once in execution, the code cannot not refer to the symbolic names explicitly - there is no semantic way to reflect on the symbolic names, only the values. 


(footnote: Javascript can be constructed in the source code to occur, via `Function` and `eval`.  Some restrictions apply: operations like saving context is harder.  This is handy for saving work and information in a structured way.  Introspection and composability are more natural when things like language templates can be built.  And working with the DOM, itself a tree structure is more natural.)



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

Symbols can be written as **fully-qualified** by using a `/` to indicate that the requested symbol is to be found in the explicitly named namespace.  An example of a fully qualified symbol is `io/load` where the symbol `load` is to be found in the `io` namespace.  In the case of fully qualified symbols, there is not an implicit search path, so even if a `load` symbol is in the currently active namespace or the `core` namespace, it will not be referenced.  In this case, if the symbol `load` is not found in `io`, a ReferenceError will be returned.  A namespace can be defined with the `contained` options set to `true`, in which case the defined namespace will not be able to reference any other namespaces accept for itself and `core`, even if the symbol is fully-qualified.  This helps to ensure that boundaries are maintained between dependencies.

At all times, there is a currently active namespace, whose identifier can be accessed by calling the function `current_namespace`.   By default the currently active namespace is `user`, which is a child of `core`.  The `user` namespace is unconstrained, and so can access symbols in other namespaces by fully qualifying the namespace of the desired symbol.  When a form is compiled, it is assigned to a namespace, which is typically the value of `current_namespace`.  If there is a toplevel declaration to the compiler that the form or expression is to be assigned a specific namespace, the compiler will target the specified namespace instead.  In each namespace, there is a value \*namespace*, which reflects where the code has been compiled in.  Often this is different from the value returned from `current_namespace`.  Functions and scopes can determine what namespace they are assigned by referencing the value global namespace value `*namespace*`.  The following example illustrates the difference between `*namespace*` and `current_namespace`.



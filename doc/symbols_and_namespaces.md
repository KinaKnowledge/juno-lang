## Semantics - Symbols and Namespaces
----

### Symbols

In Juno, symbols are names that reference values within the environment.  Symbols are used to keep track of, access and manipulate values.  For example, a symbol named `birthdate` would reference a value of type `Date`.  Wherever `birthdate` is referenced, the value is used in place of the word `birthdate`.  We don't necessarily care about *what* the birthdate is.  We do care that it is a Date and can use the symbol in place of whatever specific Date it might be referring to.  Symbols are distinct from the thing that is being referenced, and can be repointed to other things.  They don't intrinsically have a type assignment, but point to values, which have a type assignment.  Symbols can also be defined as a name, but be unassigned to a value.  In this case the value is `undefined`.  Symbols can also be assigned the `nil` value, which means that they are defined but aren't assigned anything.  Note that this is distinct from `undefined` in a semantic sense.  Symbols must be explicitly set to `nil`, whereas if a symbol is `undefined`, it may be allocated, but not assigned anything explicit.  Typically, in Juno, if a symbol is `undefined` it may mean there in an issue somewhere.  Juno won't let a symbol be allocated without an initial value and the compiler will consider it an error if the assignment is missing it's value component. 

Symbols have a distinct representation in JSON form.  In JSON, the binding marker `=:` is prefixed to a string, as in `"=:birthdate"`, whereas in Juno notation, the word `birthdate` without quotes around it signifies that it is a symbol.

#### Scope

When symbols are created, they are assigned a specific scope in which they can be referenced.  There are two main types of scopes in Juno, global and lexical.  Simply, global symbols can be referenced across the Environment in which they have been assigned.  Once a global symbol is defined in an Environment, it will be accessible in the Environment until it is either deleted by an `undefine` operation, the Environment is destroyed, or it is *shadowed* by a lexical symbol which has the same name as the global symbol.  Per unenforced convention, global variables in Juno are surrounded by a the `*` character, such as in `*env_config*`.

In the following example, the symbol `*my_data*` is allocated and assigned a value at the global level:

```Clojure
(defglobal *my_data* [ 0 20 15 19 8 239 85 ])
```

The symbol `*my_data*` is now able to be referenced from anywhere in the local Environment.

Global values can also be created as constants, using the `defconst` operator.  Like globals, they follow a naming convention where the name is wrapped in the `+` character, as in `+root_folder+`.  Here is an example of defining a global constant:

```Clojure
(defconst +root_folder+ "/home/hal/my_data")
```

When they are described they are marked as a constant:
```
{ namespace: "user"
  name: "+root_folder+"
  type: "String"
  requires: []
  source_name: "anonymous"
  constant: true }
```

If an attempt is made to change the value a TypeError is thrown indicating that an attempt was made to change a constant.  This is an error:

`(setq +root_folder+ "/new_folder")`

A TypeError will be thrown.


### Namespaces

Juno allows for the segregation of symbols and their values via the concept of *namespaces*.  A namespace in Juno is a distinct toplevel scope that is a child of the "core", or root environment.  The child inherits certain common mechanisms from the parent, such as the compiler, the core library, and will defer to the core environment for any resolution of symbols that do not exist in the child namespace environment.  When a function or closure is defined in a namespace, it will be able to reference other symbols in the namespace it is defined in without the qualifier syntax.  If a referenced symbol is not found in the local namespace, the `core` environment's namespace is searched, and if the referenced symbol is found, the value the `core` symbol refers to will be returned to the caller.  If it is not found, a `ReferenceError` will be returned.

To get a list of defined namespaces, the function `namespaces` will return an array of namespace identifiers.

```Clojure
[user] λ-> (namespaces)
[ "user", "core" ]
```

Symbols can be written as **fully-qualified** by using a `/` to indicate that the requested symbol is to be found in the explicitly named namespace.  An example of a fully qualified symbol is `io/rebuild_env` where the symbol `rebuild_env` is to be found in the `io` namespace.  In the case of fully qualified symbols, there is not an implicit search path, so even if a `load` symbol is in the currently active namespace or the `core` namespace, it will not be referenced.  In this case, if the symbol `load` is not found in `io`, a ReferenceError will be returned.  A namespace can be defined with the `contained` options set to `true`, in which case the defined namespace will not be able to reference any other namespaces accept for itself and `core`, even if the symbol is fully-qualified.  This helps to ensure that boundaries are maintained between dependencies.

At all times, there is a currently active namespace, whose identifier can be accessed by calling the function `current_namespace`.   By default the currently active namespace is `user`, which is a child of `core`.  The `user` namespace is unconstrained, and so can access symbols in other namespaces by fully qualifying the namespace of the desired symbol.  When a form is compiled, it is assigned to a namespace, which is typically the value of `current_namespace`.  If there is a toplevel declaration to the compiler that the form or expression is to be assigned a specific namespace, the compiler will target the specified namespace instead.  In each namespace, there is a value \*namespace*, which reflects where the code has been compiled in.  Often this is different from the value returned from `current_namespace`.  Functions and scopes can determine what namespace they are assigned by referencing the value global namespace value `*namespace*`.  The following example illustrates the difference between `*namespace*` and `current_namespace`.

To get a list of all symbols in your current namespace, use the following:

`(symbols)`

This function will return an array of all global symbols in the namespace you are in.  To find all symbols in a specific namespace, prefix it with the namespace to be inspected, followed by a forward slash, and then the `symbols` function:

`(core/symbols)`




Discuss: Namespaces are really scope spaces, because they are minimum environments themselves.  They could be saved off as a saved scope, to be resurrected again by loading them in.  [ Note to self: we need to implement the saving of core and/or it's children to a serialized structure. ] For example, when serialized out, the output JSON would look just like a environment.js with an optional boot up, reinitialization function, and with all the state saved.  Things like the compiler would have to be rebound if it's eval is to be used, but that is precisely why the environment doesn't by default carry a compiler embedded in it.  The embedded rehydrate (tm) function would be called to initialize itself, and boom, back in business, plugged into it's new world.  The rehydrated JSON would have to be given a compiler perhaps if so configured (or stripped), and could be a resource for the parent environment and it's own environment running asynchronously.  The control is ultimately with the loader which by use of filtering macros can remove or implement functionality such as the compiler and the initialization function. This is not designed as a security mechanism, but as a way to craft information systems dynamically and to be synergistic in design to the DOM, which itself is a tree.  



If you are coming to Juno from outside the Lisp world, say from the Javascript world, the notion of how a variable is represented in the language is a bit different.  In fact, this is one of the key differences between a lisp family language and Javascript.  In Javascript, a variable is declared in the source code and it is the specific means in which to refer to a mutable or immutable value over the course of it's scope.  Once in execution, the code cannot not refer to the symbolic names explicitly - there is no semantic way to reflect on the symbolic names, only the values. 


(footnote: Javascript can be constructed in the source code to occur, via `Function` and `eval`.  Some restrictions apply: operations like saving context is harder.  This is handy for saving work and information in a structured way.  Introspection and composability are more natural when things like language templates can be built.  And working with the DOM, itself a tree structure is more natural.)



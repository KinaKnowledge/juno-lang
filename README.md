Juno 
====

Juno is a self-hosted Lisp dialect that compiles to JavaScript.  It combines fast execution and ease of use with features such as a macro facility modeled on Common Lisp and the ability to save and restore the running image.  Juno provides a Lisp computing environment for JavaScript platforms: the browser, Deno or Node (ala V8), or similar, without requiring any dependencies except the JavaScript container itself. 

The language has a browser-based IDE called Seedling that brings the ability to save the running state (the Lisp "image") locally or remotely, build applications within it, bundle and export those applications as standalone HTML documents, and interact with the local environment and remote Juno environments.  It is recommended to use the IDE to get familiar with the language, and what it can do.  The IDE itself is written in Juno, and similar to Emacs, provides a fully hackable environment, described in itself, that you can shape to your own needs.

### Links
[Online Example Environment](environments/welcome.html) | [Latest Release](releases) | [Documentation/API](doc)

### Quick Start Instructions

After cloning the repository, or downloading a release, to get started with the command line, make sure you have Deno installed, which is a dependency for running Juno at this point.

From the project root directory the environment can be started by entering:
```
deno run js/juno.js
```
This will start the environment with minimal permissions.  For accessing restricted resources you will be prompted for access permissions.  To run the Juno IDE you will need read, write, net and run permissions:

```
deno run --allow-read --allow-write --allow-net --allow-run js/juno.js
```

Alternatively, you can use `--allow-all` for full access.

The above will load into the REPL with a ready to go environment.

To use the Seedling IDE for the Juno language, start the Seedling services:

```
(http/start)
```

Point your preferred browser to the URL: [https://localhost:56432/env/seedling.html](https://localhost:56432/env/seedling.html).

In Linux and macOS, the init script `lib/juno` can be invoked without an image, which will load an empty environment with only the core symbols and an empty `user` namespace:
```
lib/juno 
```

The `bin/` directory contains any compiled executables.  To make a compiled executable for your operating platform from the currently running image:
```
shell$ deno run --allow-run js/juno.js

Juno 2023.01.18.12.50  (c) 2022, Kina, LLC
[user] λ-> (sys/compile_executable)
{ success: true, emitted: "bin/juno" }
[user] λ-> (exit)

shell$ bin/juno
```

For more information on building images and compilation, see [Building Images](doc/building_images.md).

For more information on how to use the language see [Language Tutorial](doc/tutorial.md).


## About Juno

Juno as a Lisp straddles two worlds.  It is built to easily leverage JavaScript environments and libraries with the composability and expressiveness of Lisp.  JavaScript is preserved in terms of logical operators, the native types, exceptions, asynchronous functions, arrow functions, Promises, import/export, generators and the like.  Juno doesn't have different language constructs, and this makes it easy to access and work with JavaScript libraries and functions.  In fact you can inline javascript code as part of your Lisp forms.

As a Lisp, where possible, Juno follows Common Lisp naming conventions such as `defun` or `defmacro`.  There are some exceptions, such as the predicate names, which by convention end with a question mark (?).  Ultimately the code being produced is JavaScript, and so certain design decisions have been made in order to better fit into the JavaScript world.  For example, there are no `CONS` cells and therefore no classical list traversal.  However, the lack of these structures doesn't meaningfully impact the user or design experience.  Instead, arrays act as the primary sequence container.  The `push` function appends to an array, vs. prepending to a list.  The operators `first` and `rest` take the place of `CAR` and `CDR`.  Juno is case sensitive and uses `snake_case` idiomatically.  You can use hyphenated names, but these will be sanitized for JavaScript language rules with underscores replacing the hyphens.  Here is an example of Juno:

```clojure
;; Define the factorial function
(defun factorial (n)
  (cond
    (== n 1)
    1
    else
    (* n (factorial (- n 1))))
  { usage: [n:number]
    description: "Given a value n, returns the factorial of n."
    tags: [`math `example]
  })
```

----


Juno is both a Lisp dialect and environment.  The lisp engine works on JSON as an input and manipulates the tree as a JSON representation, and returns a JSON structure as output.  This means the Object { } structure is a first class citizen.  Therefore this is completely legal out of the box:

```clojure
(setq record
      { name: (name user)
        date: (new Date)
        tasks: [  "Take Walk"
                  "Eat Dinner"
                  "Write Documentation" ] })
```

The above code example is in the Juno Lisp format, which allows for a broader syntax then JSON allows, but yet can be easily transformed into JSON (stripping the comments and adding commas).  The Juno reader operates on the above syntax and transforms it into a JSON structure that is then compiled and evaluated.  The response is returned in JSON form.  

The above is transformed into the following JSON structure:

```
[
  "=:setq",
  "=:record",
  {
    name: [ "=:name", "=:user" ],
    date: [ "=:new", "=:Date" ],
    tasks: [ "Take Walk", "Eat Dinner", "Write Documentation" ]
  }
]
```
The JSON is then evaluated, meaning it is transformed into JavaScript by the compiler, and evaluated within an anonymous function.  Below is the above statement, as emitted by the compiler as part of a broader block of code:

```javascript
record={
       name:await name(user),date:new Date(),tasks:["Take Walk","Eat Dinner","Write Documentation"]
       }
```

### Why JSON?

JSON is a simple, structured, well supported format for structuring data.  Useful in storing and in transport of serialized data.  It is used for APIs at the operating system level as well as application interfaces, documents and business data.  Being *of that structure*, having homoiconicity, allows for a fluid interplay between stored (essentially quoted) data and processing of data streams.  JSON itself has enough structure to it to represent S-expressions, [ ], and it adds { }, which allows for keyed data representation.  This is great for adding structured metadata to function definitions, for example, which then itself is queryable.  There are some distinct JSON limitations too.  For example, you can't embed comments in a true out-of-band fashion.  This detracts from JSON being ideal as a direct source format, but there are ways to preserve the utility of being able to fit into JSON as a code and data representation and gain the functionality of a robust source format.


### Juno Notation

Nobody wants to sit and write JSON all day because it is tedious and inefficient.  It is better to use a more human friendly and readable format.  The Juno notation is a simple modification to JSON. In this notation commas are considered whitespace (like Clojure), the semicolon prefixes comments, parenthesis and brackets are interchangable by default, and the | operator signifies a long string |.  The reader, which itself is written in Juno notation, parses this form into a JSON structure.

| Notation | Meaning         | In JSON
| -------- | --------------- | -------
| (        | Array Start     | [ 
| )        | Array End       | ] 
| ;        | Comment         | 
| \|       | Multi Line String | " " 
| ,        | Whitespace      | space 

The Juno reader prepends any unquoted text with "=:", the binding prefix, which indicates to the compiler that the value is to be considered a symbolic reference.

Everything else is the same, and therefore, JSON can be embdedded directly in Juno notation.  This makes it easy to wrap JSON structures with functions and use them as templates, data sources or for other purposes.  The reader can be extended to support other extensions in the Juno notation style, by adding an entry to it's readtable object.

Another nice benefit of using a JSON tree as a source structure, is the ease with which Document Object Model (DOM) structures can be established and manipulated, without having to weld multiple languages together.  For example, the following shows the standard way Juno constructs DOM structures, where tags are represented as function calls with tag attributes being represented by optional objects as the first argument of the tag function.

Web Assembly text format is also s-expressions.

```Clojure
(detail { class: `standard }
  (summary "A simple way to embed HTML into documents")
  (paragraph { class: `intro-style } 
             (content_for "Embeding HTML")))
```

Because this is standard Juno notation it can be placed anywhere in your source, and the programmer doesn't have to wrangle with multiple source formats in the same concern.

When [JavaScript was being conceived](https://web.archive.org/web/20200227184037/https://speakingjs.com/es5/ch04.html) at Netscape, Brendan Eich was to write it in a Scheme based language, which can easily work with HTML. HTML is technically a simple Lisp with XML notation, since all tag elements evaluate as a DOM result and are a list structure inside each other.  Instead, an alternative approach was chosen.  A Java-like language was developed to align with Sun Microsystem's Java and Netscape's decision to include embedded Java "applets".  Nevertheless, if the DOM is considered the center of the browser, a Scheme-like language fits beautifully around the DOM, and could be seamlessly embedded, providing an elegant way to naturally extend the declarative nature of HTML with custom tags, macros and imperative logic.  This is one of Juno's aims: to provide a lisp centered on the Browser and browser-like run-times such as [Deno](https://deno.land).  Of course, Juno can be used outside of this context as well.


Saving "images" of the Lisp environment has been around for a while. Juno shares this ability. This enables a way of working that is different than a typical development approach: 
  - Build up your environment, work with it, and save it as an image from time to time
  - Per project basis - holds data structures, code, like a big ram disk attached to lisp processing
  - Embed a web server, repl or both
  - Compile in with V8 to executable 
  - RAM is cheap - load it up, virtual memory is under-utilized
  - Add features to use the embedded or accessed information
  - Add a Domain Specific Language that makes working with the model or information easier
  - Deliver the model and information via HTML and/or JSON services.
  - Perhaps you just have a browser.  Build your data structure, save it off from time to time as an HTML file.  When you are ready to work on it again, open the HTML file again.
  - Save your browser based environment image to javascript

### Getting Familiar with the Juno Language

Juno is like other Lisps that use lexical scoping and follows the syntax of Common Lisp where possible and is oriented around functions and closures and is homoiconic in which code and data are represented in the same form.  These are called *S-expressions*, short for symbolic expression.  S-expressions can be in the form of a singular value, called an *atom*, defined as *x*, or a composite value defined as `(x . y)` where *x* and *y* are S-expressions themselves.  

Other types of programming languages have notions of *statements*, which act on the environment in some fashion, such as modifying values or evaluating a condition but don't have a return value, and *expressions*, which generally return a value.  The specific language syntax determines where expressions and statements can be used.  

In Lisp, a most basic S-expression is called an `atom`, which is any object that is not a composite type, such as an array or object.  Since Juno doesn't have the traditional cons-cells that traditional Lisps such as Common Lisp have, the distinction is not as crisp.  Nevertheless, they are analogous to the basic values in Juno, which mirror the JSON primitives:

```
true false 12345 "majordomo" `majordomo
```

By themselves, atoms are only so useful, but provide the logical and semantic foundations for more complex S-expressions. 

#### Quoting

Note the last example above has a back-tick mark, which is considered *quoting*.  Quoting  turns off evaluation and returns the value as a literal.  In Juno, as data is represented in JSON, the is returned as a string.   Atoms, when quoted, return themselves.  We can test this by evaluating them using the `==` operator in the Juno REPL:

```
[user] λ-> (== `1234 1234)
true
[user] λ-> (== `true true)
true
[user] λ-> (== `false false)
true
[user] λ-> (== `majordomo "majordomo")
true
[user] λ-> (== `Date Date)
false
```

As you can see, the final example above isn't an atom.  This is because a quoted Date resolves to the literal "Date" and the symbol Date resolves to the JavaScript `Date` function.  This can be shown by:

```
[user] λ-> (subtype Date)
Function
[user] λ-> (subtype `Date)
String
```

We can also quote S-expressions that are composite in form, where multiple S-expressions are part of the same quoted form.  In this case, we can construct a data structure via a quoted S-expression:

```
[user] λ-> `("Mary" "Jones" (123 "Main Street"))
[ "Mary", "Jones", [ 123, "Main Street" ] ]
```

The above quoted S-expression resolved to a nested array structure.

In Juno you can also quote object forms:

```
[user] λ-> `{ first_name: "Mary" last_name: "Jones" address: [ 123 "Main Street" ] }
{ first_name: "Mary", last_name: "Jones", address: [ 123, "Main Street" ] }
```

What happens in the above cases when the above two examples are not quoted?

```
[user] λ-> ("Mary" "Jones" (123 "Main Street"))
[ "Mary", "Jones", [ 123, "Main Street" ] ]
```

```
[user] λ-> { first_name: "Mary" last_name: "Jones" address: [ 123 "Main Street" ] }
{ first_name: "Mary", last_name: "Jones", address: [ 123, "Main Street" ] }
```

It's the same output.  However there is a difference in what happened in under the hood.  In the latter cases, we submitted the input for evaluation, which means that the code was compiled and evaluated.  However, since the constructions were full of atoms, the result was the same.  

Note that the back-tick form is shorthand for:

```
(quote ...)
```

so our first expression could be re-written to be:

```
[user] λ-> (quote ("Mary" "Jones" (123 "Main Street")))
[ "Mary", "Jones", [ 123, "Main Street" ] ]
```

#### Operators

In programs, we wish to perform operations on our data, and in Lisp, this is done via operators.  Operators act on data and are the first element in an array, which is the basic composite element in Juno, and therefore require parenthesis or brackets.  

Let's take a look at some simple operations, which demonstrate operations:

```
[user] λ-> (+ 2 2)
4
[user] λ-> (log "Hello World")
2023-04-20 08:39:25  Hello World
null
[user] λ-> (contains? "Hello" ["Hello" "World"])
true
```

In each expression above, the first element in the provided array is the operator and the rest of the elements are the *arguments*.  In Lisp this is called a *form*.  

In the first example, the `+` operator added together 2 and 2 and returned the numeric value 4.  In the second, we logged "Hello World" to console.  The `log` function returns nil.  In the third, we called the `contains?` function, which examines the contents of an array for a provided value.  If found, it returns true, otherwise it would return false.  

As a rule, if the first value of an array is determined to be a function, special operator, or a macro, the array is treated as a form.  It is therefore evaluated and the result returned.  If the first element is not determined to be an operator, then the result is returned as an array structure.  Typically this is determined at compile time.  However, there are instances where this must be determined at runtime.  If you are sure that a specific form will always contain an operator at runtime in the first position, then it can be stated to the compiler via a `declare` directive.  

Let's take that last example one step further by adding a conditional operator:
```
[user] λ-> (if (contains? "Hello" ["Hello" "World"]) "Greetings" "Goodbye")
Greetings
```
In the above, the conditional `if` expression returned the "Greetings" string since the `contains?` form returned true.  If it returned false, the "Goodbye" string would of been returned.

Note that in Juno notation, it is idiomatic, but not required, to use brackets on arrays that don't contain operators, and parenthesis on arrays that do.  Therefore, we wrote the `contains?` form with parenthesis and the `["Hello" "World"]`` array with brackets.  Forms typically can take up multiple lines which make for easier reading.  The newline character is considered whitespace and is ignored.

```
(if (contains? "Hello" ["Hello" "World"])
    "Greetings"
    "Goodbye")
```

The above S-expression contains multiple S-expressions in a *nested* form.  The evaluation occurs depth first, left to right.  In the above, the `"Hello"` is first evaluated, and the `["Hello" "World"]` arguments are evaluated second.  Then, once the arguments have been evaluated, the `contains?` function is called with the two arguments, and returns true or false. Next, the `if` operator is called with the result of the `contains?` call.  The `if` operator is actually known as a `special` operator, because the forms that are dependedent on the true/false test aren't evaluated until the outcome of the test form is known.  Special operators are crucial to the language and each has a their own rules on how they behave and act on the Lisp environment.  If `if` was not a special form, then both the true and the false forms would be evaluated prior to calling the `if`, which would not be correct.  Therefore, the branching logic is evaluated only after the test logic and we gain conditional flow control.  

Nested S-expressions are very useful and allow us to express complicated logical structures including conditional flows.  S-expressions can be very useful for allowing the concise notation of logic that isn't polluted by the constraints of a language syntax.  For example, in the following snippet from a function, the `if` S-expression returns a value based on previously passed options to the function (which is not shown):

```
(let
  ((tag_name (if (is_function? options.tagname_for_element)
                 (-> options `tagname_for_element element)
                 element.tagName))
   (ns (if (is_string? options.use_ns)
           (+ options.use_ns "/")
           ""))
   ...
```

#### Types and Values

Types in Juno are aligned with types in JavaScript.  If you are familiar with JavaScript, that knowledge carries over into the Juno Lisp world. 

> In JavaScript, a truthy value is a value that is considered true when encountered in a Boolean context. All values are truthy unless they are defined as falsy. 

From [MDN](https://developer.mozilla.org/en-US/docs/Glossary/Truthy).  

There is one difference between Juno and Javascript and that is the number 0.  In Juno, the value 0 is considered to be `true` when evaluated with `if`, `and*` or `or*`.  However, using 0 in a regular `and` or `or` expression (which leverages the `&&` and `||`` JavaScript operators respectively) will resolve to false.  This is due to legacy compatibility needs.  In practice it is not something that causes heartache, but it is something to be aware of.  

In the following listing, the values on the left, and their respective types are all considered true.

```
{}         object true
[]         array  true
0          Number true
"0"        String true
"false"    String true
Infinity   Number true
3.14       Number true
-0.0       Number true
(new Date) Date   true
```

False (or falsy) values are as as follows:

```
false      Boolean   false
nil        null      false
undefined  undefined false
NaN        Number    false
""         String    false
```

In Juno, the term `nil` refers to the JavaScript `null` value.  Note that a *directly quoted* `nil` is not the same as an unquoted `nil` and therefore it doesn't resolve to itself. A quoted nil is not evaluated, and be returned as the string `"nil"`.  However, if prefixed with the binding sequence, `=:` as a directly quoted string:

```
`=:nil
```

will return the `null` value, and therefore the expression:

```
(== `=:nil nil)
```

will be true.  When the term `nil` appears in quoted forms, it will resolve to nil:

```
[user] λ-> `(list a b nil)
[ "=:list", "=:a", "=:b", "=:nil" ]
```

The JavaScript `null` value is equal to `nil`:

```
[user] λ-> (== null nil)
true
```

In Juno there is no proper `list` construct implemented as a linked list and cons cells.  Arrays are used instead, and serve as the principal building block of structures in Juno.  All programs will contain an array somewhere if there is going to be evaluation.  JavaScript Objects of {} are also used as a basic structure to hold values, but there is no 'operator' position innate to them.  They have keys and values, and the values follow the rules of evaluation.  However, the keys are not evaluated, and are taken as quoted literals.  

Value types can be tested for with a functions called `predicates`, which are defined as functions that examine the value or values passed to them and returning a boolean `true` or `false` value.   In Juno they are typically post-fixed with a '?' mark.  In Juno the core language contains the following predicate functions:

```
blank?
contains?
ends_with?
first_is_upper_case?
has_items?
has_the_keys?
is_array?
is_date?
is_element?
is_error?
is_even?
is_function?
is_lower?
is_nil?
is_number?
is_object_or_function?
is_object?
is_odd?
is_reference?
is_regex?
is_served?
is_set?
is_string?
is_symbol?
is_upper?
is_value?
range_overlap?
starts_with?
```

We used the predicate function `contains?` in one of the prior example.  We can use predicate functions to test for values:

```
[user] λ-> (is_array? [])
true
[user] λ-> (is_array? {})
false
```

In the above the predicate `is_array?` returned `true` when testing against an array, and false when testing against an Object. What about the reverse?

```
[user] λ-> (is_object? {})
true
[user] λ-> (is_object? [])
true
```

So arrays are considered objects, but objects are not arrays.  What about functions?  The `is_object?` is a predicate function, let's test it:

```
[user] λ-> (is_object? is_object?)
true
```

So functions are objects as well.  What about atoms?

```
[user] λ-> (is_object? `atom)
false
```

Atoms are not considered objects.  What happens when we try to test a special operator?

```
[user] λ-> (is_object? defglobal)
Syntax Error:  {
  error: "ReferenceError",
  message: "defglobal is not defined",
  expanded_source: "(is_object? defglobal)\n",
  compiled: [AsyncFunction (anonymous)]
}
```

Specials are unique in that they are not a traditional function, but are implemented by the compiler.  The special `defglobal` defines a global variable in the environment, but cannot be tested directly.  Let's look at what `is_object?` is doing internally.  

```
(new Function "x" "{ return x instanceof Object }")
```

It uses the `instanceof` JavaScript operator to perform the test.  For more on `instanceof` see the  [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) documentation.

Another way to test for types is to use `type` or `subtype` functions.  
```
[user] λ-> (type {})
object
[user] λ-> (type [])
array
[user] λ-> (type false)
boolean
[user] λ-> (type 123)
number
[user] λ-> (type "majordomo")
string
[user] λ-> (type is_object?)
function
[user] λ-> (type (new Date))
object
```

Type gives a higher level indicator of the type of value something is.  It's useful for determining if something is of one of the basic types: array, object, a boolean, a number, a string or a function.  As you can see, even though we created a new Date object, it still returned `object`.  

The `subtype` will go further and name the actual type.  Let's try the Date example again:
```
[user] λ-> (subtype (new Date))
Date
```

The subtype returned the specific type of thing it might be.  You can use subtype with the primitives as well and get the same answers as type, but you will get the formal types:

```
[user] λ-> (subtype "hello!")
String
[user] λ-> (subtype [])
array
[user] λ-> (subtype {})
object
[user] λ-> (subtype is_object?)
Function
[user] λ-> (subtype defun)
AsyncFunction
```
Let's look at that last one with `type`, and we can see the distinction between `type` and `subtype`.  With `subtype` we can tell if a function is asynchronous or synchronous whereas type just tells us whether it is a function or not.
```
[user] λ-> (type defun)
function
```

### Variables and Symbols

Most programs will require some form of value storage, and then keeping a handle or reference to that stored value.  In Juno, the term *symbol* fulfills this role.

Symbols are names that reference values within the environment.  Symbols are used to keep track of, access and manipulate values.  For example, a symbol named `birthdate` would reference a value of type `Date`.  Wherever `birthdate` is referenced, the value is used in place of the word `birthdate`.  We don't necessarily care about *what* the birthdate is.  We do care that it is a Date and can use the symbol in place of whatever specific Date it might be referring to.  Symbols are distinct from the thing that is being referenced, and can be repointed to other things.  They don't intrinsically have a type assignment, but point to values, which have a type assignment.  Symbols can also be defined as a name, but be unassigned to a value.  In this case the value is `undefined`.  Symbols can also be assigned the `nil` value, which means that they are defined but aren't assigned anything.  Note that this is distinct from `undefined` in a semantic sense.  Symbols must be explicitly set to `nil`, whereas if a symbol is `undefined`, it may be allocated, but not assigned anything explicit.  Typically, in Juno, if a symbol is `undefined` it may mean there in an issue somewhere.  Juno won't let a symbol be allocated without an initial value and the compiler will consider it an error if the assignment is missing it's value component. 

Symbols have a distinct representation in JSON form.  In JSON, the binding marker `=:` is prefixed to a string, as in `"=:birthdate"`, whereas in Juno notation, the word `birthdate` without quotes around it signifies that it is a symbol.

We can define symbols at the REPL by using the `defglobal` operator.

```
[user] λ-> (defglobal my_pi 3.1415927)
3.1415927
```

We can retrieve this value by referencing the unquoted symbol name: 

```
[user] λ-> my_pi
3.1415927
```
We can use our newly defined symbol in forms and S-expressions:
```
[user] λ-> (Math.pow (* my_pi 5) 2)
246.74011731733225
```
We can use our symbol wherever we need to reference our value.
```
[user] λ-> (subtype my_pi)
Number
```
Another item about symbols is that they contain metadata, which we can see when we use the `describe` function.  Notice that since we don't want the symbol evaluated, we quote it when providing it to `describe`.

```
[user] λ-> (describe `my_pi)
{
  namespace: "user",
  name: "my_pi",
  type: "Number",
  requires: [],
  externals: [],
  source_name: "anonymous"
}
```
Describe will return an object that *describes* properties of our defined symbol. This is called the symbol's *metadata*.

We can use describe to find out *the what, where and why* of a symbol.  We can add our own metadata to our symbol when we define it as part of our system's documentation.  Lets make another symbol, π, and add a description to it.

```
[user] λ-> (defglobal π 3.1415927 { description: "The ratio of the circumference of any circle to the diameter of that circle." })
3.1415927
[user] λ-> (describe `π)
{
  namespace: "user",
  name: "π",
  type: "Number",
  description: "The ratio of the circumference of any circle to the diameter of that circle.",
  source_name: "anonymous"
}
[user] λ-> (Math.pow (* π 5) 2)
246.74011731733225
```

Our description is now part of the symbol's metadata.

The ability to store metadata as part of a symbol's definition provides a structured way of documenting what things are around for.  All global symbols will have metadata, and most global symbols have descriptive metadata.  Try ```(describe `let)```.  You will see the metadata for the symbol `let`.



#### Scope

When symbols are created, they are assigned a specific scope in which they can be referenced.  There are two main types of scopes in Juno, global and lexical.  Simply, global symbols can be referenced across the Environment in which they have been assigned.  Once a global symbol is defined in an Environment, it will be accessible in the Environment until it is either deleted by an `undefine` operation, the Environment is destroyed, or it is *shadowed* by a lexical symbol which has the same name as the global symbol.  Per unenforced convention, global variables in Juno are surrounded by a the `*` character, such as in `*env_config*`.

In the following example, the symbol `*my_data*` is allocated and assigned a value at the global level:

```
(defglobal *my_data* [ 0 20 15 19 8 239 85 ])
```

The symbol `*my_data*` is now able to be referenced from anywhere in the local Environment.

Global values can also be created as constants, using the `defconst` operator.  Like globals, they follow a naming convention where the name is wrapped in the `+` character, as in `+root_folder+`.  Here is an example of defining a global constant:

```
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


### Going Further

If you would like to learn more about Juno 
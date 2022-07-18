Juno 
====

Juno is a self-hosted Lisp dialect that compiles to Javascript.  It combines fast execution and ease of use with features such as a macro facility modeled on Common Lisp and the ability to save and restore the running image.  Juno provides a native Lisp computing environment for Javascript platforms: the browser, Deno or Node (ala V8), or similar.

### Links
Latest Release
Documentation
API


## About Juno

Juno as a Lisp straddles two worlds.  It is built to easily leverage Javascript environments and libraries with the composability and expressiveness of Lisp.  Javascript is preserved in terms of logical operators, the native types, exceptions, asynchronous functions, arrow functions, Promises, import/export, generators and the like.  Juno doesn't have different language constructs, and this makes it easy to access and work with Javascript libraries and functions.  In fact you can inline javascript code as part of your Lisp forms.

As a Lisp, where possible, Juno follows Common Lisp naming conventions such as `defun` or `defmacro`.  There are some exceptions, such as the predicate names, which by convention end with a question mark (?).  Ultimately the code being produced is Javascript, and so certain design decisions have been made in order to better fit into the Javascript world.  For example, there are no `CONS` cells and therefore no classical list traversal.  However, the lack of these structures doesn't meaningfully impact the user or design experience.  Instead, arrays act as the primary sequence container.  The `push` function appends to an array, vs. prepending to a list.  The operators `first` and `rest` take the place of `CAR` and `CDR`.  Juno is case sensitive and uses `snake_case` idiomatically.  You can use hyphenated names, but these will be sanitized for Javascript language rules with underscores replacing the hyphens.  Here is an example of Juno:

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

If you are coming to Juno from outside the Lisp world, say from the Javascript world, the notion of how a variable is represented in the language is a bit different.  In fact, this is one of the key differences between a lisp family language and Javascript.  In Javascript, a variable is declared in the source code and it is the specific means in which to refer to a mutable or immutable value over the course of it's scope.  Once in execution, the code cannot not refer to the symbolic names explicitly - there is no semantic way to reflect on the symbolic names, only the values. 


(footnote: Javascript can be constructed in the source code to occur, via `Function` and `eval`.  Some restrictions apply(tm): operations like saving context is harder.  This is handy for saving work and information in a structured way.  Introspection and composability are more natural when things like language templates can be built.  And working with the DOM, itself a tree structure is more natural.)     



Juno is a Lisp dialect and environment.  The lisp engine works on JSON as an input and manipulates the tree as a JSON representation, and returns a JSON structure as output.  This means the Object { } structure is a first class citizen.  Therefore this is completely legal out of the box:

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
The JSON is then evaluated, meaning it is transformed into Javascript by the compiler, and evaluated within an anonymous function.  Below is the above statement, as emitted by the compiler as part of a broader block of code:

```javascript
record={
       name:await name(user),date:new Date(),tasks:["Take Walk","Eat Dinner","Write Documentation"]
       }
```

### Why JSON?

JSON is a simple, structured, well supported format for structuring data.  Useful in storing and in transport of serialized data.  It is used for APIs at the operating system level as well as application interfaces, documents and business data.  Being *of that structure*, having homoiconicity, allows for a fluid interplay between stored (essentially quoted) data and processing of data streams.  JSON itself has enough structure to it to represent S-expressions, [ ], and it adds { }, which allows for keyed data representation.  This is great for adding structured metadata to function definitions, for example, which then itself is queryable.

### Juno Notation

But nobody wants to sit and write JSON all day, because it is tedious and inefficient.  It is better to use a more human friendly and readable format, the Juno notation, which is a simple modification to JSON in which commas are considered whitespace (like Clojure), the semicolon prefixes comments, parenthesis and brackets are interchangable by default, and the | operator signifies a long string |.  The reader, which itself is written in Juno notation, parses this form into a JSON structure.

| Notation | Meaning         | In JSON
| -------- | --------------- | -------
| (        | Array Start     | [ 
| )        | Array End       | ] 
| ;        | Comment         | 
| \|       | Multi Line String | " " 
| ,        | Whitespace      | space 

Everything else is the same, and therefore, JSON can be embdedded directly in Juno notation.  This makes it easy to wrap JSON structures with functions and use them as templates, data sources or for other purposes.  The reader can be extended to support other extensions in the Juno notation style, by adding an entry to it's readtable object.



Discuss: Namespaces are really scope spaces, because they are minimum environments themselves.  They could be saved off as a saved scope, to be resurrected again by loading them in.  [ Note to self: we need to implement the saving of core and/or it's children to a serialized structure. ] For example, when serialized out, the output JSON would look just like a environment.js with an optional boot up, reinitialization function, and with all the state saved.  Things like the compiler would have to be rebound if it's eval is to be used, but that is precisely why the environment doesn't by default carry a compiler embedded in it.  The embedded rehydrate (tm) function would be called to initialize itself, and boom, back in business, plugged into it's new world.  The rehydrated JSON would have to be given a compiler perhaps if so configured (or stripped), and could be a resource for the parent environment and it's own environment running asynchronously.  The control is ultimately with the loader which by use of filtering macros can remove or implement functionality such as the compiler and the initialization function. This is not designed as a security mechanism, but as a way to craft information systems dynamically and to be synergistic in design to the DOM, which itself is a tree.  

Another nice benefit of using a JSON tree as a source structure, is the ease with which Document Object Model (DOM) structures can be established and manipulated, without having to weld multiple languages together.  For example, the following shows the standard way Juno constructs DOM structures, where tags are represented as function calls with tag attributes being represented by optional objects as the first argument of the tag function.

Web Assembly text format is also s-expressions.

```Clojure
(detail { class: `standard }
  (summary "A simple way to embed HTML into documents")
  (paragraph { class: `intro-style } 
             (content_for "Embeding HTML")))
```

Because this is standard Juno notation it can be placed anywhere in your source, and the programmer doesn't have to wrangle with multiple source formats in the same concern.

When [Javascript was being conceived](https://web.archive.org/web/20200227184037/https://speakingjs.com/es5/ch04.html) at Netscape, Brendan Eich was to write it in a Scheme based language, which can easily work with HTML. HTML is technically a simple Lisp with XML notation, since all tag elements evaluate as a DOM result and are a list structure inside each other.  Instead, an alternative approach was chosen.  A Java-like language was developed to align with Sun Microsystem's Java and Netscape's decision to include embedded Java "applets".  Nevertheless, if the DOM is considered the center of the browser, a Scheme-like language fits beautifully around the DOM, and could be seamlessly embedded, providing an elegant way to naturally extend the declarative nature of HTML with custom tags, macros and imperative logic.  This is one of Juno's aims: to provide a lisp centered on the Browser and browser-like run-times such as [Deno](https://deno.land).  Of course, Juno can be used outside of this context as well.



Notes:
Need to figure out the rules of saving environments and doing so with bound symbols to native code.  If exported these symbols need a way to "rebind" to the native functions on load.  If they symbol is bound to a native code function, when exported the source isn't the source of the bound function, but the quoted binding operation, so when reloaded the symbol can be rebound (if possible) to the same native function.  So how do we know when and how to capture symbol bindings?  If a global is defined to a bound symbol, the definition should store the source to the binding.  The initializer function would rebind the globals when rehydrated.

On Import for binding a global function at compile time:
1. compiler notices bind is called.  (So we need a special?)
   a. If it a static binding at compile time, can know because the token structure.
	   1. defglobal must capture the quoted source for rebinding later when the 
	      environment is rehydrated.
		  
   b. If it is dynamic based on a variable name, this cannot be rebound because 
      the value is dependent on a specific runtime condition or state.
  


		

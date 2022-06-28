Juno 
----

Juno is a self-hosted Lisp with zero dependencies that compiles to Javascript.  It aims to provide fast execution and ease of use, while facilitating features such as a macro facility modeled on Common Lisp.  Juno provides a browser-native Lisp computing environment, which can extend into other similar environments, such as Deno.

This dialect of Lisp straddles two worlds: Javascript features and conventions, and the composability and expressiveness of Lisp.  Javascript is preserved in terms of logical operators, the native types, exceptions, asynchronous functions, arrow functions, Promises, import/export, and generators.  Since Juno doesn't have different language constructs, this makes it easy to access and work with Javascript libraries and functions.  In fact you can inline javascript code if you so desired as part of your Lisp forms.

As a Lisp, where possible, Juno follows Common Lisp naming conventions such as `defun` or `defmacro`.  Since ultimately the code being produced is Javascript, there are some differences as well.  For example, Juno uses `snake_case` vs. `hyphenated-case` as in Lisp because hyphens can't be part of variable names.  You can use hyphenated names, but these will be sanitized for the Javascript world and harder to follow along in the debugger/inspection environment.


Topics


## About Juno

Juno is a JSON based lisp.  The lisp engine works on JSON as an input and manipulates the tree as a JSON representation, and returns a JSON structure as output.  This means the Object { } structure is a first class citizen.  Therefore this is completely legal out of the box:

```clojure
(setq record
      { `name: (name user)
	    `date: (new Date)
	    `tasks: [  "Take Walk"
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

But nobody wants to sit and write JSON all day, because it is tedious and inefficient.  It is better to use a more human friendly and readable format, the Juno notation, which is a simple modification to JSON in which commas are considered whitespace like Clojure, the semicolon prefixes comments, parenthesis and brackets are interchangable by default, and the | operator signifies a long string |.  The reader, which itself is written in Juno notation, parses this form into a JSON structure.

| Notation | Meaning         | In JSON
| -------- | --------------- | -------
| (        | Array Start     | [      
| )        | Array End       | ] 
| ;        | Comment         | 
| \|       | Multi Line String | " " 
| ,        | Whitespace      | space 

Everything else is the same, and therefore, JSON can be embdedded directly in Juno notation.  This makes it easy to wrap JSON structures with functions and use them as templates, data sources or for other purposes.  The reader can be extended to support other extensions in the Juno notation style, by adding an entry to it's readtable object.

Another nice benefit of using a JSON tree as a source structure, is the ease of which DOM structures can be established and manipulated, without having to weld multiple language styles together.  For example, here is a simple HTML:

```Clojure
(detail { `class: `standard }
  (summary "A simple way to embed HTML into documents")
  (paragraph { `class: `intro-style } 
             (content_for "Embeding HTML")))
```
		         


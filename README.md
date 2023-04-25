Juno 
====

Juno is a self-hosted Lisp dialect that compiles to JavaScript.  It combines fast execution and ease of use with features such as a macro facility modeled on Common Lisp and the ability to save and restore the running image.  Juno provides a Lisp computing environment for JavaScript platforms: the browser, Deno or Node (ala V8), or similar, without requiring any dependencies except the JavaScript container itself. 

The language has a browser-based IDE called Seedling that brings the ability to save the running state (the Lisp "image") locally or remotely, build applications within it, bundle and export those applications as standalone HTML documents, and interact with the local environment and remote Juno environments.  It is recommended to use the IDE to get familiar with the language, and what it can do.  The IDE itself is written in Juno, and similar to Emacs, provides a fully hackable environment, described in itself, that you can shape to your own needs.

### Links
[Example Workspace](https://kinadata.com/welcome.html) | [Documentation/API](doc/)

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

For more information on how to use the language see [Language Tutorial](doc/tutorial.md).

For more information on building images and compilation, see [Building Images](doc/building_images.md).



## About Juno

Juno as a Lisp straddles two worlds.  It is built to easily leverage JavaScript environments and libraries with the composability and expressiveness of Lisp.  JavaScript is preserved in terms of logical operators, the native types, exceptions, asynchronous functions, arrow functions, Promises, import/export, generators and the like.  Juno doesn't have different language constructs, and this makes it easy to access and work with JavaScript libraries and functions.  In fact you can inline JavaScript code as part of your Lisp forms.

As a Lisp, where possible, Juno follows Common Lisp naming conventions such as `defun` or `defmacro`.  There are some exceptions, such as the predicate names, which by convention end with a question mark (?).  Ultimately the code being produced is JavaScript, and so certain design decisions have been made in order to better fit into the JavaScript world.  For example, there are no `CONS` cells and therefore no classical list traversal.  However, the lack of these structures doesn't meaningfully impact the user or design experience.  Instead, arrays act as the primary sequence container.  The `push` function appends to an array, vs. prepending to a list.  The operators `first` and `rest` take the place of `CAR` and `CDR`.  Juno is case sensitive and uses `snake_case` idiomatically.  You can use hyphenated names, but these will be sanitized for JavaScript language rules with underscores replacing the hyphens.  Here is an example of Juno:

```
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

```
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

```
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
  - Save your browser based environment image to JavaScript


-------

### Next Steps

To get familiar with the Juno language, see the [language tutorial](doc/tutorial.md). 



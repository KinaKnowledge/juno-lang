;; Environment -- Facilitates and organizes the lisp top level and resources
;; Author: Alex Nygren

;; Copyright (c) 2022-2023, Kina, LLC

;; Permission is hereby granted, free of charge, to any person obtaining a copy
;; of this software and associated documentation files (the "Software"), to deal
;; in the Software without restriction, including without limitation the rights
;; to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
;; copies of the Software, and to permit persons to whom the Software is
;; furnished to do so, subject to the following conditions:

;; The above copyright notice and this permission notice shall be included in all
;; copies or substantial portions of the Software.

;; THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
;; IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
;; FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
;; AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
;; LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
;; OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
;; SOFTWARE.

;; ======

;; The "world" that is the scope of the compiler and the compiled code.
;; Faciliates dynamic scope, lisp globals, definitions and other properties.
;; It is the interface the top level function calls into as the compiler
;; is accessed via an environment object.  

;; Use evaluate(lisp_text) to compile and evaluate lisp text and forms from
;; javascript.

;; Options are as follows:
;; parent_environment - if this instance is to be a namespace other than "core"
;;                      this should be set with the calling environment object.

;; namespace - if given a parent_environment we need to have an addressable
;;             name.  This must be set if using the parent_environment option.

;; env - if given an environment object using the env key, the returned
;;       environment instance will have be a clone of the provided environment.
;;       This is used when exporting an environment image.

;; inlines - object that contains operator keys and function values that
;;           return arrays: (fn (args) [`javascript `tokens ].. see inlines
;;           below for the specifics.

;; log_errors - boolean (default false) if true, the environment itself
;;           will log any errors to the console, otherwise it will either
;;           re-throw the error or return it depending on catch_errors.

;; catch_errors - boolean (default is false) - if true, errors will be
;;           caught and returned, and not thrown, otherwise the error
;;           will be re-thrown.

;; We need some global types since Javascript eval() isn't used in Juno



(set_prop globalThis
   `subtype subtype
   `check_true check_true
   `clone clone
   `lisp_writer lisp_writer
   `get_next_environment_id get_next_environment_id
   `LispSyntaxError LispSyntaxError)

(if (== "undefined" (typeof dlisp_environment_count))
    (set_prop globalThis
       `dlisp_environment_count
       0))


;; We can't immediately define a macro for the below because we don't have
;; an environment yet to place it.  So when we want to save the current
;; environment, we will splice directly into the JSON representation
;; of this file.
;; defexternal places the symbol and the associated value on on globalThis,
;; instead of inside the environment (which doesn't exist at this point).

(defexternal dlisp_env
   (fn (opts)
      (progn
         ;(console.log "dlisp_env: initializing: " (clone opts))
         ;; State to the compiler that we do not want to be passed an Environment
         ;; by declaring that this is toplevel.
         
         (declare (toplevel true)
                  (include subtype get_object_path get_outside_global)
                  (local clone get_next_environment_id check_true))
         
         ;; NOTICE:
         ;; We do not have access to the Environment things at this point, so we are
         ;; very limited until after (define_env)...
         ;; ------ Start Limited --------------------------------------------
         (= opts
            (if (== opts undefined)
                {}
                opts))
         
         ;; Construct the environment
         ;; Are we the core, or are we a namespace off of the core?
         
         (defvar namespace (or opts.namespace "core"))
         (defvar in_boot true)  ;; this is true while we are initializing the environment
         
         ;; Define a holding tank for symbols that reference yet unloaded namespaces...
         ;; while in boot mode
         ;; once the namespace is loaded the symbols are initiailzed
         ;; key->array of symbols per namespace
         (defvar pending_loads {})
         
         (defvar parent_environment (if (== namespace "core")
                                        nil
                                        opts.parent_environment))
         
         ;; The currently active namespace
         ;; If we are a child env, it should always equal our name
         ;; otherwise if we are the core, then this points to the
         ;; current namespace accessed by current_namespace
         ;; in the core environment.
         
         (defvar active_namespace namespace)
         
         (defvar contained (or opts.contained false))
         
         ;; Set up our initial skeleton..
         
         (defvar Environment
            { ;; once we have built the environment, if there are any inclusions we will merge them in
              ;; to global_ctx since they will have the potential to refer to things that have yet
              ;; to be defined to the compiler..
              
              `global_ctx: {
                             `scope: {}
                             `name:  namespace
                             }
              `build_version: (or opts.env_version
                                 (javascript DLISP_ENV_VERSION))
              `definitions: (or opts.definitions
                               {
                                 
                                 })
              `declarations: (or opts.declarations
                                {
                                  `safety: {
                                             `level: 2
                                             }
                                  })
              })
         
         (if (== "undefined" (typeof Element))
             (set_prop globalThis
                `Element
                (function () false)))
         
         (defvar id  (get_next_environment_id))
         
         ;; if we have a namespace other than core we should
         ;; have a parent environment
         
         (set_prop Environment
            `context
            Environment.global_ctx)
         
         ;; no compiler until it is provided.
         (defvar unset_compiler  (fn () (throw EvalError (+ "compiler must be set for "  namespace ))))
         (defvar compiler unset_compiler)
         
         
         (defvar compiler_operators (new Set))
         (defvar special_identity (fn (v)
                                     v))
         
         ;; ------- End Limited Zone --------------------------------
         
         ;; the define_env macro populates global_ctx scope object to local values in our
         ;; closure
         
         
         (define_env
            (MAX_SAFE_INTEGER 9007199254740991)
            (LispSyntaxError globalThis.LispSyntaxError)
            (sub_type subtype
               {
                 `description: "Returns a string the determined actual type of the provided value."
                 `usage: ["value:*"]
                 `tags: ["type" "class" "prototype" "typeof" "instanceof"]
                 })
            (__VERBOSITY__ 0
                           {
                             `description: "Set __VERBOSITY__ to a positive integer for verbose console output of system activity."
                             `tags: ["debug" "compiler" "environment" "global"]
                             })
            
            (int parseInt
               { `usage: "value:string|number"
                 `description: "Convenience method for parseInt, should be used in map vs. directly calling parseInt, which will not work directly"
                 `tags: ["conversion" "number"]
                 })
            
            (float parseFloat
               { `usage: "value:string|number"
                 `description: "Convenience method for parseFloat, should be used in map vs. directly calling parseFloat, which will not work directly"
                 `tags: ["conversion" "number"]
                 })
            
            (values (new Function "...args"
                         "{
                         let acc = [];
                         for (let _i in args) {
                                let value = args[_i];
                                let type = subtype(value);
                                if (value instanceof Set)  {
                                     acc = acc.concat(Array.from(value));
                                     } else if (type==='array') {
                                      acc = acc.concat(value);
                                      } else if (type==='object') {
                                       acc = acc.concat(Object.values(value))
                                       } else {
                                        acc = acc.concat(value);
                                        }
                                }
                         return acc;
                         }")
                    {
                      `description: (+ "Given a container, returns a list containing the values of each supplied argument. Note that for objects, only the values are returned, not the keys. "
                                       "If given multiple values, the returned value is a concatentation of all containers provided in the arguments.")
                      `usage:[ "arg0:*" "argn:*"]
                      `tags: [ `array `container `object `keys `elements ]
                      })
            
            (pairs (new Function "obj"
                        "{
                        if (subtype(obj)==='array') {
                             let rval = [];
                             for (let i = 0; i < obj.length; i+=2) {
                                    rval.push([obj[i],obj[i+1]]);
                                    }
                             return rval;
                             } else {
                              let keys = Object.keys(obj);
                              let rval = keys.reduce(function(acc,x,i) {
                                                               acc.push([x,obj[x]])
                                                               return acc;
                                                               },[]);
                              return rval;
                              }
                        }")
                   {
                     `description: "Given a passed object or array, returns a list containing a 2 element list for each key/value pair of the supplied object."
                     `tags: ["array" "container" "object" ]
                     `usage: ["obj:object"]
                     })
            
            (keys (new Function "obj"
                       "{  return Object.keys(obj);  }")
                  {
                    `description: "Given an object, returns the keys of the object."
                    `tags: ["object" "values" "keys" "indexes" "container" ]
                    `usage: ["obj:object"]
                    })
            
            (take (new Function "place" "{ return place.shift() }")
                  {
                    `description: "Takes the first value off the list, and returns the value."
                    `tags: ["array" "container" "mutate" "first"]
                    `usage: ["place:container"]
                    })
            
            (prepend (new Function "place" "thing" "{ return place.unshift(thing) }")
                     {
                       `description: "Places the value argument onto the first of the list (unshift) and returns the list."
                       `tags: ["array" "mutate" "container" ]
                       `usage: ["place:array" "thing:*"]
                       })
            
            (first (new Function "x" "{ return x[0] }")
                   {
                     `description: "Given an array, returns the first element in the array."
                     `usage: ["x:array"]
                     `tags: ["array" "container" "elements" ]
                     })
            
            (last (new Function "x" "{ return x[x.length - 1] }")
                  {
                    `description: "Given an array, returns the last element in the array."
                    `usage: ["x:array"]
                    `tags: ["array" "container" "elements" "end"]
                    })
            
            (length (new Function "obj"
                         "{
                         if(obj instanceof Array) {
                             return obj.length;
                             } else if (obj instanceof Set) {
                              return obj.size;
                              } else if ((obj === undefined)||(obj===null)) {
                               return 0;
                               } else if (typeof obj==='object') {
                                return Object.keys(obj).length;
                                } else if (typeof obj==='string') {
                                 return obj.length;
                                 }
                         return 0;
                         }")
                    {
                      `description: (+ "Returns the length of the supplied type (array, object, set, string, number). "
                                       "If the supplied value is nil or a non-container type, returns 0.")
                      `tags: ["size" "elements" "container" "dimension" "array" "set" "string" "number" ]
                      `usage: ["thing:container"]
                      })
            
            (conj (new Function "...args"
                       "{   let list = [];
                       if (args[0] instanceof Array) {
                            list = args[0];
                            } else {
                             list = [args[0]];
                             }
                       args.slice(1).map(function(x) {
                                          list = list.concat(x);
                                          });
                       return list;
                       }")
                  {
                    `description: (+ "Conjoins or concatenates things (typically arrays) together and returns an array. "
                                     "Examples:<br>"
                                     "(conj [ 1 2 ] [ 3 4 ]) => [ 1 2 3 4 ]<br>"
                                     "(conj [ 1 2 ] 3 4 ) => [ 1 2 3 4 ]<br>"
                                     "(conj 1 2 [ 3 4 ]) => [ 1 2 3 4 ]<br>"
                                     "(conj { `abc: 123 } [ 2 3]) => [ { abc: 123 }, 2, 3 ]<br>"
                                     "(conj [ 1 2 3 [ 4 ]] [ 5 6 [ 7 ]]) => [ 1 2 3 [ 4 ] 5 6 [ 7 ] ]")
                    `tags: [`elements `concat `array `conjoin `append]
                    `usage: ["arg0:*" "argN:*"]
                    })
            
            
            
            (reverse (new Function "container" "{ return container.slice(0).reverse() }")
                     { "usage": ["container:list"]
                               "description": "Returns a copy of the passed list as reversed.  The original is not changed."
                               `tags: ["list" "sort" "order"]
                               })
            
            (map (new AsyncFunction "lambda" "array_values"
                      "{ try {
                      let rval = [],
                      tl = array_values.length;
                      for (let i = 0; i < array_values.length; i++) {
                             rval.push(await lambda.apply(this,[array_values[i], i, tl]));
                             }
                      return rval;
                      } catch (ex) {
                       if (lambda === undefined || lambda === null) {
                             throw new ReferenceError(\"map: lambda argument (position 0) is undefined or nil\")
                             } else if (array_values === undefined || array_values === null) {
                              throw new ReferenceError(\"map: container argument (position 1) is undefined or nil\")
                              } else if (!(lambda instanceof Function)) {
                               throw new ReferenceError(\"map: lambda argument must be a function: received: \"+ typeof lambda)
                               } else if (!(array_values instanceof Array)) {
                                throw new ReferenceError(\"map: invalid array argument, received: \" + typeof array_values)
                                } else {
                                 // something else just pass on the error
                                 throw ex;
                                 }
                       }
                 }")
            {
              `description: (+ "Provided a function as a first argument, map calls the function "
                               "(item, current_index, total_length) with each element from the second argument, which should be a list. Returns a new list containing the return values resulting from evaluating.")
              `tags: [`array `container `elements `iteration ]
              `usage: [ "lambda:function" "elements:array"]
              })
         
         (bind (new Function "func,this_arg"
                    "{ return func.bind(this_arg) }")
               {
                 `description: "Given a function and a this value, the bind function returns a new function that has its this keyword set to the provided value in this_arg."
                 `usage: [ "func:function" "this_arg:*" ]
                 `tags: [ `bind `this `function ]
                 })
         
         
         (to_object (new Function "array_values"
                         "{
                         let obj={}
                         array_values.forEach((pair)=>{
                                                 obj[pair[0]]=pair[1]
                                                 });
                         return obj;
                         }")
                    {
                      `description: (+ "Given an array of pairs in the form of [[key value] [key value] ...], constructs an "
                                       "object with the first array element of the pair as the key and the second "
                                       "element as the value. A single object is returned.")
                      `usage: ["paired_array:array"]
                      `tags: ["conversion" "object" "array" "list" "pairs"]
                      })
         
         (to_array (fn (container)
                      (cond
                         (is_array? container)
                         container
                         (is_set? container)
                         (do
                            (defvar acc [])
                            (-> container `forEach (fn (v)
                                                      (push acc v)))
                            acc)
                         (is_string? container)
                         (split_by "" container)
                         (is_object? container)
                         (pairs container)
                         else
                         [container]))
                   {
                     `description: (+ "Given a container of type Array, Set, Object, or a string, "
                                      "it will convert the members of the container to an array form, "
                                      "and return a new array with the values of the provided container. "
                                      "In the case of an object, the keys and values will be contained in "
                                      "paired arrays in the returned array.  A string will be split into "
                                      "individual characters. If provided a different "
                                      "type other than the listed values above, the value will be placed "
                                      "in an array as a single element.")
                     `usage:["container:*"]
                     `tags: [ "array" "conversion" "set" "object" "string" "pairs"]
                     })
         
         (slice (function (target from to)
                   (cond
                      to
                      (-> target `slice from to)
                      from
                      (-> target `slice from)
                      else
                      (throw SyntaxError "slice requires 2 or 3 arguments")))
                {
                  `description: "Given an array, with a starting index and an optional ending index, slice returns a new array containing the elements in the range of provided indices."
                  `usage: ["target:array" "from:number" "to:number"]
                  `tags: ["array" "slicing" "dimensions" "subset"]
                  })
         
         (rest (function (x)
                  (cond
                     (instanceof x Array)
                     (-> x `slice 1)
                     (is_string? x)
                     (-> x `substr 1)
                     else
                     nil))
               {
                 `description: "Returns a new array containing the elements in the 2nd through last position (the tail) of the provided array."
                 `usage: ["x:array"]
                 `tags: ["array" "subset" "slice" "tail" "end"]
                 })
         
         (second  (new Function "x" "{ return x[1] }")
                 {
                   `description: "Returns the second element in the provided array (the element at index 1)"
                   `tags: ["array" "subset" "element" "first" ]
                   `usage: ["x:array"]
                   })
         (third (new Function "x" "{ return x[2] }")
                {
                  `description: "Returns the third element in the provided array (the element at index 2)"
                  `tags: ["array" "subset" "element" "first" ]
                  `usage: ["x:array"]
                  })
         
         (chop  (new Function "x" "{ if (x instanceof Array) { return x.slice(0, x.length-1) } else { return x.substr(0,x.length-1) } }")
               {
                 `description: "Returns a new container containing all items except the last item.  This function takes either an array or a string."
                 `usage: ["container:array|string"]
                 `tags: ["array" "slice" "subset" "first" "string"]
                 })
         
         (chomp (new Function "x" "{ return x.substr(x.length-1) }")
                {
                  `description: "Given a string returns a new string containing all characters except the last character."
                  `usage: ["x:string"]
                  `tags: [`slice `subset `string ]
                  })
         
         (not (new Function "x" "{ if (check_true(x)) { return false } else { return true } }")
              {
                `description: "Returns the logical opposite of the given value.  If given a truthy value, a false is returned.  If given a falsey value, true is returned."
                `usage: ["x:*"]
                `tags: ["logic" "not" "inverse"]
                })
         
         (push  (new Function "place" "thing" "{ return place.push(thing) }")
               {
                 `description: "Given an array as a place, and an arbitrary value, appends (pushes) the value to the end of the array."
                 `usage: ["place:array" "thing:*"]
                 `tags: ["array" "mutate" "append" "concat" "pop"]
                 })
         
         (pop  (new Function "place" "{ return place.pop() }")
              {
                `description: "Given an array as an arguments, removes the last value from the given array and returns it."
                `usage: ["place:array"]
                `tags: ["array" "mutate" "take" "remove" "push"]
                })
         
         (list  (fn (`& args) args)
               { `description: "Given a set of arbitrary arguments, returns an array containing the provided arguments. If no arguments are provided, returns an empty array."
                 `usage: ["arg0:*" "argN:*"]
                 `tags: [ "array" "container" "elements" ]
                 })
         
         (flatten (new Function "x" "{ return x.flat(999999999999) } ")
                  {
                    `description: "Given a nested array structure, returns a flattened version of the array"
                    `usage: ["x:array"]
                    `tags: [ `array `container `flat `tree ]
                    })
         
         (jslambda (function (`& args)
                      (apply Function (flatten args)))
                   {
                     `description: (+ "Proxy for Javascript Function.  Given a set of string based arguments, all but the last are considered arguments to the "
                                      "function to be defined.  The last argument is considered the body of the function and should be provided as a string of "
                                      "javascript. Returns a javascript function. <br>"
                                      "(jslambda (`a `b) \"{ return a+b }\")<br>"
                                      "(jslambda () \"{ return new Date() }\")" )
                     `usage: ["argument_list:array" "argn:string"]
                     `tags: [ `javascript `embed `function ]
                     })
         
         (join (function (`& args)
                  (cond
                     (== args.length 1)
                     (-> args.0 `join "")
                     else
                     (-> args.1 `join args.0)))
               {
                 `description: (+ "Given an optional joining string and an array of strings, returns a string containing the "
                                  "elements of the array interlaced with the optional joining string.<br>"
                                  "(join \",\" [ \"red\" \"fox\" ]) -> \"red,fox\"<br>"
                                  "(join [\"red\" \"fox\"]) -> redfox")
                 `tags: ["array" "combine" "split" "string" "text" ]
                 `usage: ["joining_string?:string" "container:array"]
                 })
         (lowercase (function (x)
                       (-> x `toLowerCase))
                    {
                      `description: "Given a string, converts all capital characters to lowercase characters."
                      `tags: ["string" "text" "uppercase" "case" "convert" ]
                      `usage: ["text:string"]
                      })
         
         (uppercase (function (x)
                       (-> x `toUpperCase))
                    {
                      `description: "Given a string, converts all capital characters to uppercase characters."
                      `tags: ["string" "text" "lowercase" "case" "convert" ]
                      `usage: ["text:string"]
                      })
         
         (log (function (`& args)
                 (apply console.log args))
              {
                `description: (+ "log is a shorthand call for console.log by default, and serves to provide a base "
                                 "abstraction for logging.  Log behavior can be changed by redefining log to "
                                 "better suit the environmental context.  For example, writing log output to a file "
                                 "or HTML container.")
                `usage: ["args0:*" "argsN:*"]
                `tags: ["logging" "console" "output" ]
                })
         
         (split (new Function "container" "token" "{ return container.split(token) }")
                {
                  `description: (+ "Given a string to partition and a string for a splitting token, return an array whose elements "
                                   "are the text found between each splitting token. <br>"
                                   "(split \"red,fox\" \",\") => [ \"red\" \"fox\" ]")
                  `tags: ["partition" "join" "separate" "string" "array" ]
                  `usage: ["string_to_split:string" "split_token:string" ]
                  })
         
         (split_by (new Function "token" "container" "{ return container.split(token) }")
                   {
                     `description: (+ "Given a string for a splitting token and a string to partition, return an array whose elements "
                                      "are the text found between each splitting token. <br>"
                                      "(split_by \",\" \"red,fox\") => [ \"red\" \"fox\" ]")
                     `tags: ["partition" "join" "separate" "string" "array" ]
                     `usage: ["split_token:string" "string_to_split:string" ]
                     })
         
         (is_object? (new Function "x" "{ return x instanceof Object }")
                     {
                       `description: "for the given value x, returns true if x is an Javascript object type."
                       `usage: ["arg:value"]
                       `tags: ["type" "condition" "subtype" "value" "what" ]
                       })
         
         (is_array? (new Function "x" "{ return x instanceof Array }")
                    {
                      `description: "for the given value x, returns true if x is an array."
                      `usage: ["arg:value"]
                      `tags: ["type" "condition" "subtype" "value" "what" ]
                      })
         
         (is_number? (function (x)
                        (== (subtype x) "Number"))
                     {
                       `description: "for the given value x, returns true if x is a number."
                       `usage: ["arg:value"]
                       `tags: ["type" "condition" "subtype" "value" "what" "function"]
                       })
         
         (is_function? (function (x)
                          (instanceof x Function))
                       {
                         `description: "for the given value x, returns true if x is a function."
                         `usage: ["arg:value"]
                         `tags: ["type" "condition" "subtype" "value" "what" "function"]
                         })
         
         (is_set? (new Function "x" "{ return x instanceof Set }")
                  {
                    `description: "for the given value x, returns true if x is a set."
                    `usage: ["arg:value"]
                    `tags: ["type" "condition" "subtype" "value" "what" ]
                    })
         
         (is_element? (new Function "x" "{ return x instanceof Element }")
                      {
                        `description: "for the given value x, returns true if x is an Element object"
                        `usage: ["arg:value"]
                        `tags: ["type" "condition" "subtype" "value" "what" ]
                        })
         
         (is_string? (function (x)
                        (or (instanceof x String)
                            (== (typeof x) "string")))
                     {
                       `description: "for the given value x, returns true if x is a String object"
                       `usage: ["arg:value"]
                       `tags: ["type" "condition" "subtype" "value" "what" ]
                       })
         
         (is_nil? (function (x)
                     (== x nil))
                  {
                    `description: "for the given value x, returns true if x is exactly equal to nil."
                    `usage: ["arg:value"]
                    `tags: ["type" "condition" "subtype" "value" "what" ]
                    })
         
         (is_regex? (function (x)
                       (== (sub_type x) "RegExp"))
                    {
                      `description: "for the given value x, returns true if x is a Javascript regex object"
                      `usage: ["arg:value"]
                      `tags: ["type" "condition" "subtype" "value" "what" ]
                      })
         
         (is_date? (function (x)
                      (== (sub_type x) "Date"))
                   {
                     `description: "for the given value x, returns true if x is a Date object."
                     `usage: ["arg:value"]
                     `tags: ["type" "condition" "subtype" "value" "what" ]
                     })
         
         (ends_with? (new Function "val" "text" "{ if (text instanceof Array) { return text[text.length-1]===val } else if (subtype(text)=='String') { return text.endsWith(val) } else { return false }}")
                     {
                       `description: "for a given string or array, checks to see if it ends with the given start_value.  Non string args return false."
                       `usage: ["end_value:value" "collection:array|string" ]
                       `tags: ["string" "text" "list" "array" "filter" "reduce"]
                       })
         (starts_with? (new Function "val" "text" "{ if (text instanceof Array) { return text[0]===val } else if (subtype(text)=='String') { return text.startsWith(val) } else { return false }}")
                       {
                         "description": "for a given string or array, checks to see if it starts with the given start_value.  Non string args return false."
                         "usage": ["start_value:value" "collection:array|string" ]
                         "tags": ["string" "text" "list" "array" "filter" "reduce" "begin"]
                         })
         (delete_prop (new Function "obj" "...args"
                           "{
                           if (args.length == 1) {
                                return delete obj[args[0]];
                                } else {
                                 while (args.length > 0) {
                                         let prop = args.shift();
                                         delete obj[prop];
                                         }
                                 }
                           return obj;
                           }")
                      {
                        `description: (+ "Removes the key or keys of the provided object, and returns the modified object.<br>Example:<br>"
                                         "(defglobal foo { abc: 123 def: 456 ghi: 789 })<br>"
                                         "(delete_prop foo `abc `def) => { ghi: 789 }<br>")
                        `usage: ["obj:objects" "key0:string" "keyN?:string"]
                        `tags: [ `delete `keys `object `remove `remove_prop `mutate ]
                        })
         (blank? (function (val)
                    (or (eq val nil)
                        (and (is_string? val)
                             (== val ""))))
                 {
                   `description: "Given a value, if it is equal (via eq) to nil or to \"\" (an empty string), returns true, otherwise false."
                   `usage: ["val:*"]
                   `tags: ["string" "empty" "text" ]
                   })
         
         (contains? (new Function "value" "container"
                         "{ if (!value && !container) { return false }
                         else if (container === null) { throw new TypeError(\"contains?: passed nil/undefined container value\"); }
                                            else if (container instanceof Array) return container.includes(value);
                                            else if (container instanceof Set) return container.has(value);
                                            else if ((container instanceof String) || typeof container === \"string\") {
                                                     if (subtype(value) === \"Number\") return container.indexOf(\"\"+value)>-1;
                                                     else return container.indexOf(value)>-1;
                                                     }
                                            else throw new TypeError(\"contains?: passed invalid container type: \"+subtype(container)) }")
                         {
                           `description: (+ "Given a target value and container value (array, set, or string), checks if the container has the value. "
                                            "If it is found, true is returned, otherwise false if returned.  ")
                           `tags: ["string" "array" "set" "has" "includes" "indexOf" ]
                           `usage: ["value:*" "container:array|set|string"]
                           })
                    
         (make_set (function (vals)
                      (if (instanceof vals Array)
                          (new Set vals)
                          (let
                             ((`vtype (sub_type vals)))
                             (cond
                                (== vtype "Set")
                                (new Set vals)
                                (== vtype "object")
                                (new Set (values vals))))))
                   {
                     `description: (+ "If given an array, a new Set is returned containing the elements of the array. "
                                      "If given an object, a new Set is returned containing the values of the object, and the keys are discarded. "
                                      "If given a set, new Set is created and returend  from the values of the old set.")
                     `usage: ["vals:array|object|set"]
                     `tags: [`array `set `object `values `convert ]
                     })
         
         (meta_for_symbol (function (quoted_symbol search_mode)
                             (when (is_string? quoted_symbol)
                                ;; if we have been given a string, get any local data we have in our global context
                                (defvar local_data (or (prop Environment.global_ctx.scope quoted_symbol)
                                                       (prop Environment.definitions quoted_symbol)))
                                (defvar acc [])
                                (if search_mode
                                   (progn
                                      (when local_data
                                         (push acc
                                            (+ { `namespace: namespace
                                                 `name: quoted_symbol
                                                 `type: (subtype local_data) }
                                              ;; include any symbols we need
                                              (aif (prop Environment.definitions quoted_symbol)
                                                   it
                                                   {}))))
                                      (when parent_environment
                                         (reduce_sync (info (-> (-> parent_environment `meta_for_symbol quoted_symbol true) `flat 1))
                                            (push acc info)))
                                      (when (> (length (keys children)) 0)  ;; we don't have a parent, but we have children
                                         (reduce_sync (`details (reduce_sync (`child_data (pairs children))
                                                                   (when (not (== child_data.0 (current_namespace)))
                                                                      (-> child_data.1 `meta_for_symbol quoted_symbol))))
                                            (push acc details)))
                                      acc)
                                   (progn
                                      (= quoted_symbol (if (starts_with? (quote "=:") quoted_symbol)
                                                           (-> quoted_symbol `substr 2)
                                                           quoted_symbol))
                                      (aif (prop Environment.definitions quoted_symbol)
                                           (+ { `namespace: namespace
                                                `type: (sub_type local_data)
                                                `name: quoted_symbol }
                                             it)
                                           nil)))))
                          {
                            `description: (+ "Given a quoted symbol and a boolean indicating whether or not all namespaces should be searched, returns "
                                             "the meta data associated with the symbol for each environment.  If search mode is requested, the value returned "
                                             "is an array, since there can be symbols with the same name in different environments. If no values are found "
                                             "an empty array is returned.  If not in search mode, meta_for_symbol searches the current namespace "
                                             "only, and if a matching symbol is found, returns an object with all found metadata, otherwise nil is returned.")
                            
                            `usage: ["quoted_symbol:string" "search_mode:boolean"]
                            `tags: [`describe `meta `help `definition `symbol `metadata ]
                            })
         
         
         (describe (fn (quoted_symbol search_mode)
                      (progn
                         (defvar internal_results (meta_for_symbol quoted_symbol true))
                         (if (and (is_array? internal_results)
                                  internal_results.0)
                             (if search_mode
                                internal_results          ;; if we found something internal, return all results
                                (first internal_results)) ;; we are interested in the first result onlu
                             (if (or (contains? "*" quoted_symbol)
                                     (contains? "?" quoted_symbol))
                                 nil
                                 (progn
                                    (defvar external_results (get_outside_global quoted_symbol))
                                    (if external_results
                                       (progn
                                          (defvar detail
                                             {
                                               `location: "external"
                                               `type: (subtype external_results)
                                               `name: quoted_symbol
                                               `namespace: "EXTERNAL"
                                               `description: (+  "This is not a bound symbol within the Juno Environment.  "
                                                                "If it is to be used, it is recommended to create a reference to it with "
                                                                "`(defglobal " quoted_symbol " " quoted_symbol " { `description: \"...\" })`")
                                               })
                                          (if search_mode
                                             [ detail ]
                                             detail))
                                       nil))))))
                   {
                     `description: "Given a quoted symbol returns the relevant metadata pertinent to the current namespace context."
                     `usage: ["quoted_symbol:string" "search_mode:boolean"]
                     `tags: [ `meta `help `definition `symbol `metadata `info `meta_for_symbol ]
                     })
         
         (undefine (function (quoted_symbol)
                      (if (is_string? quoted_symbol)
                          (let
                             ((`namespace_identity (split_by "/" quoted_symbol))   ;;  split..namespace_identity may only have 1 component though
                              (`parent_call nil)
                              (`child_call nil)
                              (`target_symbol nil))
                             (declare (function parent_call))
                             (cond
                                (or (and (== namespace_identity.length 1)
                                         (prop Environment.global_ctx.scope namespace_identity.0))
                                    (and (> namespace_identity.length 1)
                                         (== namespace_identity.0 namespace)))
                                ;; it's not qualified and in our local environment
                                (progn
                                   (= target_symbol (if (> namespace_identity.length 1)
                                                        namespace_identity.1
                                                        namespace_identity.0))
                                   (delete_prop Environment.definitions target_symbol)
                                   (if (prop Environment.global_ctx.scope target_symbol)
                                       (delete_prop Environment.global_ctx.scope target_symbol)
                                       false))
                                
                                (and (> namespace_identity.length 1)
                                     parent_environment)
                                (progn
                                   (setq parent_call (-> parent_environment `get_global "undefine"))
                                   (parent_call quoted_symbol))
                                
                                (and (> namespace_identity.length 1)
                                     (prop children namespace_identity.0))
                                ;; child namespace, send it there
                                (progn
                                   (setq child_call (-> (prop children namespace_identity.0) `get_global "undefine"))
                                   (child_call quoted_symbol))
                                
                                else
                                false))
                          (throw SyntaxError "undefine requires a quoted symbol")))
                   {
                     `description: (+ "Given a quoted symbol removes the symbol and any definition information from the namespace. "
                                      "If the namespace is fully-qualified, then the symbol will be removed from the specified namespace "
                                      "instead of the currently active namespace. If the symbol is successfully removed, the function "
                                      "will return true, otherwise if it is not found, false will be returned.  Note that if the "
                                      "specified symbol is non-qualified, but exists in a different, accessible namespace, but the "
                                      "symbol isn't present in the current namespace, the symbol will not be deleted.  The environment "
                                      "is not searched and therefore symbols have to be explicitly fully-qualified for any effect "
                                      "of this function outside the current namespace.")
                     `usage: ["quoted_symbol:string"]
                     `tags: [ `symbol `delete `remove `unintern `reference `value ]
                     })
         
         (eval_exp (fn (expression)
                      (do
                         (expression)))
                   {
                     `description: (+ "Evaluates the given expression and returns the value.")
                     `usage: ["expression:*"]
                     `tags: [ `eval `evaluation `expression ]
                     })
         
         (indirect_new (function (`& args)
                          (javascript |
                             {
                               let targetClass = args[0];
                               if (subtype(targetClass)==="String") {
                                    let tmpf=new Function("{ return "+targetClass+" }");
                                    targetClass = tmpf();
                                    }
                               if (args.length==1) {
                                    let f = function(Class) {
                                                      return new (Function.prototype.bind.apply(Class, args));
                                                      }
                                    let rval = f.apply(this,[targetClass]);
                                    return rval;
                                    } else {
                                     let f = function(Class) {
                                                       return new (Function.prototype.bind.apply(Class, args));
                                                       }
                                     let rval = f.apply(this,[targetClass].concat(args.slice(1)));
                                     return rval;
                                     }
                               } | ))
                       {
                         `description: (+ "Used by the compiler for implementation of the new operator and shouldn't be directly called by "
                                          "user programs.  The new operator should be called instead.")
                         `usage: ["arg0:*" "argsN:*"]
                         `tags: [ `system `compiler `internal ]
                         })
         
         (range (function (`& args)
                   (let
                      ((`from_to (if args.1
                                     [ (float args.0) (float args.1) ]
                                     [ 0 (float args.0) ]))
                       (`step (if args.2
                                  (float args.2)
                                  1))
                       (`idx from_to.0)
                       (`acc []))
                      (assert (> step 0) "range: step must be > 0")
                      (assert (>= from_to.1 from_to.0) "range: lower bound must be greater or equal than upper bound")
                      (while (< idx from_to.1)
                         (do
                            (push acc idx)
                            (inc idx step)))
                      acc))
                {
                  `usage: ["start_or_end:number" "end:number" "step:number"]
                  `description: (+ "Range has a variable form depending on the amount of arguments provided to the function when "
                                   "calling it. If provided one argument, range will produce an array from 0 up to, but not including "
                                   "the provided value. If given two arguments, the first argument will be the starging value and "
                                   "the last value will be used as the upper bounding value, returning an array with elements starting "
                                   "at the start value and up to, but not including the bounding value. If given a third value, the "
                                   "value will be interpreted as the step value, and the returned array will contain values that "
                                   "increment by the step amount.  Range will throw an error if a negative range is specified. "
                                   "<br><br>Examples:<br>"
                                   "(range 5) -> [ 0 1 2 3 4 ]<br>"
                                   "(range 10 15) -> [ 10 11 12 13 14 ]<br>"
                                   "(range 10 20) -> [ 10 12 14 16 18 ]<br>"
                                   "(range -5 0) -> [ -5 -4 -3 -2 -1 ]<br>"
                                   "(range -3 3) -> [ -3, -2, -1, 0, 1, 2 ]<br>")
                  
                  })
         
         
         (add (new Function "...args"
                   "{
                   let acc;
                   if (typeof args[0]===\"number\") {
                        acc = 0;
                        } else if (args[0] instanceof Array) {
                         return args[0].concat(args.slice(1));
                         } else if (typeof args[0]==='object') {
                          let rval = {};
                          for (let i in args) {
                                 if (typeof args[i] === 'object') {
                                      for (let k in args[i]) {
                                             rval[k] = args[i][k];
                                             }
                                      }
                                 }
                          return rval;
                          } else {
                           acc = \"\";
                           }
                   for (let i in args) {
                          acc += args[i];
                          }
                   return acc;
                   }")
              {
                `description: (+ "Add is an overloaded function that, based on the first argument provided, determines how to \'add\' the arguments. "
                                 "If provided a number as a first argument, then it will assume the rest of the arguments are numbers and add them "
                                 "to the first, returning the numerical sum of the arguments. If an object, it will merge the keys of the provided "
                                 "arguments, returning a combined object.  Be aware that if merging objects, if arguments that have the same keys "
                                 "the argument who appears last with the key will prevail.  If called with an array as a first argument, the "
                                 "subsequent arguments will be added to the first via 'concat'.  If strings, the strings will be joined into a "
                                 "single string and returned.<br>"
                                 "(add 1 2 3) => 6<br>"
                                 "(add { `abc: 123 `def: 345 } { `def: 456 }) => { abc: 123, def: 456 }"
                                 "(add [ 1 2 3 ] [ 4 5 6] 7) => [ 1, 2, 3, [ 4, 5, 6 ], 7 ]<br>"
                                 "(add \"abc\" \"def\") => \"abcdef\"<br><br>"
                                 "Note that add doesn't typically need to explicily called.  The compiler will try and determine the best "
                                 "way to handle adding based on the arguments to be added, so the + operator should be used instead, since "
                                 "it gives the compiler an opportunity to inline if possible.")
                `usage: [ "arg0:*" "argN:*" ]
                `tags: [ `add `+ `sum `number `addition `merge `join `concat ]
                })
         
         (merge_objects (new Function "x"
                             "{
                             let rval = {};
                             for (let i in x) {
                                    if (typeof i === 'object') {
                                         for (let k in x[i]) {
                                                rval[k] = x[i][k];
                                                }
                                         }
                                    }
                             return rval;
                             }")
                        {
                          `description: (+ "Merge objects takes an array of objects and returns an object whose keys and values are "
                                           "the sum of the provided objects (same behavior as add with objects).  If objects have the "
                                           "same keys, the last element in the array with the duplicate key will be used to provide the "
                                           "value for that key.")
                          `usage: ["objects:array"]
                          `tags: [ `add `merge `keys `values `objects `value ]
                          })
         
         (index_of (new Function "value" "container"
                        (+ "{ return container.indexOf(value) }"))
                   {
                     `description: "Given a value and an array container, returns the index of the value in the array, or -1 if not found."
                     `usage: ["value:number|string|boolean" "container:array" ]
                     `tags: [ `find `position `index `array `contains ]
                     })
         
         (resolve_path (new Function "path,obj"
                            "{
                            if (typeof path==='string') {
                                 path = path.split(\".\");
                                 }
                            let s=obj;
                            return path.reduce(function(prev, curr) {
                                                         return prev ? prev[curr] : undefined
                                                         }, obj || {})
                            }")
                       {
                         `description: (+ "Given a path and a tree structure, which can be either an array or an object, "
                                          "traverse the tree structure and return the value at the path if it exists, otherwise "
                                          "undefined is returned.<br>"
                                          "(resolve_path [ 2 1 ] [ 1 2 [ 3 4 5 ] 6 7]) => 4)")
                         `usage: [ "path:array" "tree_structure:array|object" ]
                         `tags: [ `find `position `index `path `array `tree `contains `set_path ]
                         })
         
         
         
         (min_value (new Function "elements" "{ return Math.min(...elements); }")
                    {
                      `description: "Returns the minimum value in the provided array of numbers."
                      `usage: ["elements:array"]
                      `tags: [ `min `max_value `array `elements `minimum `number ]
                      })
         (max_value (new Function "elements" "{ return Math.max(...elements); }")
                    {
                      `description: "Returns the maximum value in the provided array of numbers."
                      `usage: ["elements:array"]
                      `tags: [ `min `max_value `array `elements `minimum `number ]
                      })
         
         (interlace (fn (`& args)
                       (let
                          ((min_length  (min_value (map length args)))
                           (rlength_args (range (length args)))
                           (rval []))
                          (for_each (`i (range min_length))
                             (for_each (`j rlength_args)
                                (push rval (prop (prop args j) i))))
                          rval))
                    { `usage: ["list0:array" "list1:array" "listn?:array"]
                             `description: "Returns a list containing a consecutive values from each list, in argument order.  I.e. list0.0 list1.0 listn.0 list0.1 list1.1 listn.1 ..."
                             `tags: ["list","array","join" "merge"]
                             })
         
         (trim (function (x)
                  (-> x `trim))
               {
                 `description: "Removes leading and trailing spaces from the provided string value."
                 `usage: ["value:string"]
                 `tags: ["string" "spaces" "clean" "squeeze" "leading" "trailing" "space"]
                 })
         
         (assert (function (assertion_form failure_message)
                    (if assertion_form
                       assertion_form
                       (throw EvalError (or failure_message "assertion failure"))))
                 {
                   `description: "If the evaluated assertion form is true, the result is returned, otherwise an EvalError is thrown with the optionally provided failure message."
                   `usage:["form:*" "failure_message:string?"]
                   `tags:["true" "error" "check" "debug" "valid" "assertion"]
                   })
         
         
         (unquotify (fn (val)
                       (let
                          ((dval val))
                          (if (starts_with? "\"" dval)
                              (= dval (-> dval `substr 1 (- dval.length 2))))
                          (if (starts_with? "=:" dval)
                              (= dval (-> dval `substr 2)))
                          dval))
                    {
                      `description: "Removes binding symbols and quotes from a supplied value.  For use in compile time function such as macros."
                      `usage: ["val:string"]
                      `tags:["macro" "quote" "quotes" "desym"]
                      })
         
         (or_args (fn (argset)
                     (let
                        ((is_true false))
                        (for_each (`elem argset)
                           (if elem
                              (do
                                 (= is_true true)
                                 (break))))
                        is_true))
                  {
                    `description: "Provided an array of values, returns true if any of the values are true, otherwise will return false."
                    `usage: ["argset:array"]
                    `tags: [ "or" "true" "false" "array" "logic" ]
                    })
         
         
         (special_operators (fn ()
                               (make_set (compiler [] { `special_operators: true `env: Environment }))))
         
         (defclog (fn (opts)
                     (let
                        ((`style (+ "padding: 5px;"
                                    (if opts.background
                                       (+ "background: " opts.background ";")
                                       "")
                                    (if opts.color
                                       (+ "color: " opts.color ";"))
                                    "")))
                        (fn (`& args)
                           (apply console.log (+ "%c" (if opts.prefix
                                                          opts.prefix
                                                          (take args)))
                                  (conj [ style ]
                                        args)))))
            {
              `description: (+ "Given a description object, containing specific keys, returns a customized console logging "
                               "function implements the given requested properties.<br>Options<br>"
                               "prefix:string:The prefix to log prior to any supplied user arguments.<br>"
                               "color:string:The text color to use on the prefix (or initial argument if no prefix)<br>"
                               "background:string:The background coloe to use on the prefix (or initial argument if no prefix)<br>")
              `usage: ["options:object"]
              `tags: ["log" "logging" "console" "utility"]
              })
         
         
         (NOT_FOUND (new ReferenceError "not found"))
         
         (check_external_env_default (if (== namespace "core") true false))
         (*namespace* namespace)
         ;; handle dependency loads between namespaces
         (pending_ns_loads {})  ;; object to store dependencies by namespace as they are rehydrated
         (pend_load (fn (from_namespace target_namespace symbol initializer)
                       (progn
                          (when (eq nil (prop pending_ns_loads from_namespace))
                             (set_prop pending_ns_loads from_namespace []))
                          (push (prop pending_ns_loads from_namespace)
                                { `symbol: symbol
                                  `source_ns: from_namespace
                                  `target_ns: target_namespace
                                  `initializer: [(quote quote) initializer]
                                  }
                                )
                          initializer))
                    {
                      `description: (+ "When used as an initializer wrapper via the use_symbols macro, the wrapped "
                                       "initializer will not be loaded until the from_namespace is loaded to ensure "
                                       "that the wrapped initializer won't fail due to not yet loaded dependencies.")
                      `usage: ["from_namespace:string" "target_namespace:string" "symbol:string" "initializer:array"]
                      `tags: [ `symbol `definitions `namespace `scope `dependency `dependencies `require ]
                      })
         (load_pends (fn (from_namespace)
                        (when (prop pending_ns_loads from_namespace)
                           (defvar acc [])
                           (setq acc
                              (for_each (`load_instruction (prop pending_ns_loads from_namespace))
                                 `(use_symbols ,#load_instruction.source_ns [ ,#load_instruction.symbol ] ,#load_instruction.target_ns)))
                           (console.log "load_pends: " from_namespace "->" acc)
                           (eval acc)
                           true)))
         (symbols (fn (opts)
                     (cond
                        (eq nil opts)
                        (keys Environment.global_ctx.scope)
                        opts.unique
                        (progn
                           (defvar no_includes (make_set (conj [ "meta_for_symbol", "describe", "undefine", "*namespace*",
                                                                "pend_load", "symbols", "set_global", "get_global", "symbol_definition",
                                                                "compile", "env_log", "evaluate_local", "evaluate", "eval_struct",
                                                                "set_compiler", "clone", "eval", "add_escape_encoding",
                                                                "get_outside_global", "as_lisp", "lisp_writer", "clone_to_new",
                                                                "save_env", "null", "compiler" ] built_ins)))
                           (reduce (sym (keys Environment.global_ctx.scope))
                              (if (-> no_includes `has sym)
                                  nil
                                  sym)))))
                  {
                    `description: (+ "Returns an array of the defined global symbols for the local environment.  "
                                     "If opts.unique is true, only symbols that are not part of the built ins are "
                                     "included.")
                    `usage: ["opts:object"]
                    `tags: [`symbol `names `definitions `values `scope]
                    })
         (set_global
            (function (refname value meta is_constant target_namespace contained_req)
               (progn
                  (cond (not (== (typeof refname) "string"))
                     (throw TypeError "reference name must be a string type")
                     (or (== Environment value)
                         (== Environment.global_ctx value)
                         (== Environment.global_ctx.scope value))
                     (do
                        ;(debug)
                        (throw EvalError "cannot set the environment scope as a global value")))
                  
                  (when (resolve_path [ refname `constant ] Environment.definitions)
                     (throw TypeError (+ "Assignment to constant variable " refname )))
                  
                  ;; we need to determine what we've been given.  We could have:
                  ;; 1. refname by itself, with no name space, so we need to check
                  ;;    if it is us, and if it is not, hand it up to our parent
                  ;; 2. fully/qualified refname - nead to split and then check
                  ;; 3. refname and target_namespace - if us we deal with or
                  ;;    send onwards if not us.
                  
                  (defvar namespace_identity (if target_namespace
                                                 [target_namespace refname]
                                                 (split_by "/" refname)))
                  
                  (cond
                     ;; check if we already have an explicit namespace and it isn't us,
                     ;; send it to our parent to deal with..
                     
                     (and parent_environment
                        (> namespace_identity.length 1)
                        (not (== namespace namespace_identity.0)))
                     (-> parent_environment `set_global namespace_identity.1 value meta is_constant namespace_identity.0 (or contained contained_req))
                     
                     ;; not us but we are the core, so we need to send it to the appropriate namespace
                     
                     (and (> namespace_identity.length 1)
                          (not (== namespace_identity.0 namespace)))
                     (do
                        (if (and (prop children namespace_identity.0)   ;; do we have the requested namespace?
                                 (not contained_req))                   ;; can we access it?
                            (-> (prop children namespace_identity.0)       ;; dispatch it there..
                                `set_global
                                namespace_identity.1 value meta is_constant namespace_identity.0)
                            ;; no such namespace so it is an error...
                            (throw EvalError (+ "namespace " namespace_identity.0 " doesn't exist"))))
                     else
                     ;; it's on us...
                     (try
                        (progn
                           (defvar comps (get_object_path (if (== 1 namespace_identity.length)
                                                              namespace_identity.0
                                                              namespace_identity.1)))
                           (set_prop Environment.global_ctx.scope
                              comps.0
                              value)
                           (if (and (is_object? meta)
                                    (not (is_array? meta)))
                               (do
                                  (when is_constant
                                     (set_prop meta
                                        `constant
                                        true))
                                  (set_prop Environment.definitions
                                     comps.0
                                     meta))
                               (when is_constant
                                  (set_prop Environment.definitions
                                     comps.0
                                     {
                                       `constant: true
                                       })))
                           (prop Environment.global_ctx.scope comps.0))
                        (catch Error (e)
                           (progn
                              (defvar message (+ "Error: set_global: " *namespace* "symbol name: " refname ": " e.message))
                              (console.error message())
                              (set_prop e
                                 `message
                                 message)
                              (throw e))))))))
         
         (get_global
            (function (refname value_if_not_found suppress_check_external_env target_namespace path_comps contained_req)
               (cond
                  (not (== (typeof refname) "string"))
                  (throw TypeError "reference name must be a string type")
                  
                  (== refname "Environment")
                  Environment
                  
                  (-> compiler_operators `has refname)
                  special_identity
                  
                  else
                  (let
                     ((`namespace_identity (if target_namespace
                                               [target_namespace refname]  ;; already has been split or explicitly specified, so use it
                                               (split_by "/" refname)))    ;; otherwise split..namespace_identity may only have 1 component though
                      (`comps (or path_comps
                                  (get_object_path (if (== 1 namespace_identity.length)
                                                       namespace_identity.0
                                                       namespace_identity.1))))
                      (`refval nil)
                      (`symbol_name nil)
                      ;; shadow the environments scope check if the suppress_check_external_env is set to true
                      ;; this is useful when we have reference names that are not legal js reference names
                      
                      (`check_external_env (if suppress_check_external_env
                                               false
                                               check_external_env_default)))
                     
                     (cond
                        ;; given a fully qualified name, if not us, pass it up
                        (and parent_environment
                           (> namespace_identity.length 1)
                           (not (== namespace_identity.0 namespace)))
                        ;; pass it up...note that if we are a contained environment, our request will turn contained to true
                        (-> parent_environment `get_global namespace_identity.1 value_if_not_found suppress_check_external_env namespace_identity.0 comps (or contained
                                                                                                                                                              contained_req))
                        
                        ;; we are at the root (core) but it is not us, so we need to see if we have a namespace that alignes and if so, call it's get_global specifically
                        (and (> namespace_identity.length 1)
                             (not (== namespace_identity.0 namespace)))
                        (do
                           (if (and (prop children namespace_identity.0)
                                    (not contained_req))                   ;; can we access it?
                               (-> (prop children namespace_identity.0)
                                   `get_global
                                   namespace_identity.1 value_if_not_found suppress_check_external_env namespace_identity.0 comps)
                               (do
                                  (if contained_req
                                     (throw EvalError "calling non-core namespace from a contained namespace")
                                     (throw EvalError (+ "namespace " namespace_identity.0 " doesn't exist"))))))
                        else
                        (do
                           
                           ;; search path is to first check the global Lisp Environment
                           ;; and if the check_external_env flag is true, then go to the
                           ;; external JS environment.
                           
                           (= refval (prop Environment.global_ctx.scope comps.0))
                           
                           (if (and (== undefined refval)             ;; if we didn't find anything here, and if the refname was
                                    (== namespace_identity.length 1)  ;; non-qualified we need to check upward
                                    parent_environment)               ;; if possible..
                               (do
                                  (defvar rval (-> parent_environment `get_global refname value_if_not_found suppress_check_external_env nil comps (or contained contained_req)))
                                  rval)
                               (do
                                  ;; this is us
                                  (if (and (== undefined refval)
                                           check_external_env)
                                      (= refval (if check_external_env
                                                    (or (get_outside_global comps.0)
                                                        NOT_FOUND)
                                                    NOT_FOUND)))
                                  
                                  ;; based on the value of refval, return the value
                                  
                                  (cond
                                     (and (== NOT_FOUND refval)
                                          (not (== undefined value_if_not_found)))
                                     value_if_not_found
                                     
                                     (== NOT_FOUND refval)
                                     (do
                                        (throw ReferenceError (+ "symbol not found: " (if (> namespace_identity.length 1)
                                                                                          (+ namespace "/" namespace_identity.1)
                                                                                          (+ namespace "/" namespace_identity.0)))))
                                     
                                     
                                     (== comps.length 1)
                                     refval
                                     
                                     (> comps.length 1)
                                     (do
                                        (resolve_path (rest comps) refval))
                                     
                                     else
                                     (do
                                        (console.warn "get_global: condition fall through: " comps)
                                        NOT_FOUND))))))))))
         
         (symbol_definition (fn (symname target_namespace)
                               (let
                                  ((namespace_identity (if target_namespace
                                                           [ target_namespace symname ]
                                                           (if (> (length symname) 2)
                                                               (split_by "/" symname)
                                                               [symname] ))))
                                  ;(console.log "symbol_definition: " symname namespace_identity)
                                  (cond
                                     (== namespace_identity.length 1)
                                     ;; not fully qualified
                                     (aif (prop Environment.definitions symname)
                                          it ;; we have it here so return it
                                          (if parent_environment
                                             (-> parent_environment `symbol_definition symname)))
                                     
                                     (== namespace_identity.0  namespace)
                                     (prop Environment.definitions symname)
                                     
                                     parent_environment
                                     (-> parent_environment `symbol_definition namespace_identity.1 namespace_identity.0)
                                     
                                     (== namespace_identity.length 2)
                                     (-> (prop children namespace_identity.0) `symbol_definition namespace_identity.1)
                                     else
                                     undefined)))
                            {
                              `description: (+ "Given a symbol name and an optional namespace, either as a fully qualified path "
                                               "or via the target_namespace argument, returns definition information about the "
                                               "retquested symbol.  "
                                               "Used primarily by the compiler to find metadata for a specific symbol during compilation.")
                              `usage: ["symname:string" "namespace:string"]
                              `tags: ["compiler" "symbols" "namespace" "search" "context" "environment"]
                              })
         
         (compile (fn (json_expression opts)
                     (let
                        ((opts (+ {
                                    `env: Environment
                                    }
                                 opts
                                 {
                                   `meta: (if (and opts opts.meta)
                                              true
                                              false)
                                   }))
                         (out nil))
                        
                        (= out
                           (compiler json_expression opts))
                        (cond
                           (and (is_array? out)
                                out.0.ctype
                                (== out.0.ctype "FAIL"))
                           out
                           opts.meta
                           out
                           else
                           out.1)))
            {
              `description: (+ "Compiles the given JSON or quoted lisp and returns a string containing "
                               "the lisp form or expression as javascript.<br>"
                               "If passed the option { meta: true } , an array is returned containing compilation metadata "
                               "in element 0 and the compiled code in element 1.")
              `usage: ["json_expression:*" "opts:object"]
              `tags:["macro" "quote" "quotes" "desym" "compiler"]
              })
         
         (env_log (defclog { `prefix: (+ namespace ":") `background: "#B0F0C0" })
                  {
                    `description: "The environment logging function used by the environment."
                    `usage: ["arg0:*" "argN:*"]
                    })
         
         ;; evaluate_local facilitates the evaluation cycle for the specific
         ;; environment (namespace): compilation, binding, and then calling
         ;; the bound function.
         
         (evaluate_local (fn (expression ctx opts)
                            (let
                               ((opts (or opts
                                          {}))
                                (compiled nil)
                                (error_data nil)
                                (requires nil)
                                (precompiled_assembly nil)
                                (result nil))
                               ;;(debug)
                               ;;(console.log "evaluate_local [ " namespace "] :" Environment.context.name)
                               (if opts.compiled_source
                                  (= compiled expression)
                                  (try
                                     (= compiled
                                        (compiler (if opts.json_in
                                                      expression
                                                      (-> Environment `read_lisp expression { `source_name: opts.source_name }))
                                                  {
                                                    `env: Environment
                                                    `ctx: ctx
                                                    `throttle: opts.throttle
                                                    `formatted_output: true
                                                    `source_name: opts.source_name
                                                    `throw_on_error: opts.throw_on_error
                                                    `on_final_token_assembly: (fn (val)
                                                                                 (= precompiled_assembly val))
                                                    `error_report: (or opts.error_report nil)
                                                    `quiet_mode: (or opts.quiet_mode false) }))
                                     (catch Error (`e)
                                        (do
                                           (when opts.throw_on_error
                                              (throw e))
                                           (when (instanceof e LispSyntaxError)
                                              (set_prop e
                                                 `message
                                                 (JSON.parse e.message)))
                                           (cond
                                              (instanceof e LispSyntaxError)
                                              (= error_data (+ { `error: "LispSyntaxError"  }
                                                               e.message))
                                              else
                                              (= error_data
                                                 {
                                                   `error: (sub_type e)
                                                   `message:  e.message
                                                   `stack: e.stack
                                                   `form: (cond
                                                             (and (is_string? expression)
                                                                  (> expression.length 100))
                                                             (+ (-> expression `substr 0 100) "...")
                                                             else
                                                             (as_lisp expression))
                                                   `parent_forms: []
                                                   `source_name: opts.source_name
                                                   `invalid: true
                                                   }))
                                           (if opts.error_report
                                              (opts.error_report error_data)
                                              (console.error "Compilation Error: " error_data))
                                           (= compiled [ { `error: true } nil  ])))))
                               
                               (cond
                                  (eq nil compiled)
                                  ;; we got nothing back - for now note it and return nil
                                  ;; if we had an error it should of been reported
                                  nil
                                  (== compiled.0.ctype "FAIL")
                                  (progn
                                     (when opts.error_report
                                        (opts.error_report compiled.1))
                                     (cond
                                        (instanceof compiled.1 Error)
                                        (throw compiled.1)
                                        (instanceof compiled.1.0 Error)
                                        (throw compiled.1.0)
                                        
                                        (and (is_object? compiled.1.0)
                                             (== compiled.1.0.error "SyntaxError"))
                                        (progn
                                           (defvar new_error (new SyntaxError compiled.1.0.message))
                                           (set_prop new_error
                                              `from compiled.1.0)
                                           (throw new_error))
                                        else
                                        compiled.1))
                                  
                                  
                                  (and compiled.0.namespace
                                     (not (== compiled.0.namespace namespace))
                                     parent_environment)
                                  ;; not us and if we are a child, pass it up to our parent to deal with
                                  (-> parent_environment `evaluate_local compiled ctx (+ {}
                                                                                         opts
                                                                                         { `compiled_source: true }))
                                  (and compiled.0.namespace
                                     (not (== compiled.0.namespace namespace)))
                                  
                                  ;; not us, but we are a root as we have no parent, so do we
                                  ;; have a child namespace that matches?
                                  
                                  (if (prop children compiled.0.namespace)
                                      (-> (prop children compiled.0.namespace) `evaluate_local compiled ctx (+ {}
                                                opts
                                                { `compiled_source: true }))
                                      (throw EvalError (+ "unknown namespace " compiled.0.namespace " assignment")))
                                  
                                  else
                                  ;; this is us or no namespace designated
                                  (do
                                     (if opts.on_compilation_complete
                                        (opts.on_compilation_complete compiled))
                                     (try
                                        (do
                                           (when (and (is_array? compiled)
                                                      (is_object? compiled.0)
                                                      compiled.0.ctype
                                                      (not (is_string? compiled.0.ctype)))
                                              (set_prop compiled.0
                                                 `ctype
                                                 (subtype compiled.0.ctype)))
                                           (= result
                                              (cond
                                                 compiled.error  ;; compiler error
                                                 (throw (new compiled.error compiled.message))
                                                 
                                                 (and compiled.0.ctype
                                                    (or (contains? "block" compiled.0.ctype)
                                                        (== compiled.0.ctype "assignment")
                                                        (== compiled.0.ctype "__!NOT_FOUND!__")))
                                                 (if (compiled.0.has_lisp_globals)
                                                     (do
                                                        (set_prop compiled
                                                           
                                                           1
                                                           (new AsyncFunction "Environment" (+ "{ " compiled.1 "}")))
                                                        
                                                        (compiled.1 Environment))
                                                     (do
                                                        (set_prop compiled
                                                           1
                                                           (new AsyncFunction  (+ "{" compiled.1 "}")))
                                                        (compiled.1)))
                                                 
                                                 (and compiled.0.ctype
                                                    (or (== "AsyncFunction" compiled.0.ctype)
                                                        (== "statement" compiled.0.ctype)
                                                        (== "objliteral" compiled.0.ctype)))
                                                 (do
                                                    (if (compiled.0.has_lisp_globals)
                                                        (do
                                                           ;(console.log "env: compiled text: " (+ "{ return " compiled.1 "} "))
                                                           (set_prop compiled
                                                              1
                                                              (new AsyncFunction "Environment" (+ "{ return " compiled.1 "} ")))
                                                           (compiled.1 Environment))
                                                        (do
                                                           (set_prop compiled
                                                              1
                                                              (new AsyncFunction (+ "{ return " compiled.1 "}")))
                                                           (compiled.1))))
                                                 
                                                 (and compiled.0.ctype
                                                    (== "Function" compiled.0.ctype))
                                                 (do
                                                    (if (compiled.0.has_lisp_globals)
                                                        (do
                                                           (set_prop compiled
                                                              1
                                                              (new Function "Environment" (+ "{ return " compiled.1 "} ")))
                                                           (compiled.1 Environment))
                                                        (do
                                                           (set_prop compiled
                                                              1
                                                              (new Function (+ "{ return " compiled.1 "}")))
                                                           (compiled.1))))
                                                 else ;; this is a simple expression
                                                 compiled.1)))
                                        (catch Error (e)
                                           (do
                                              (when true ;(== (sub_type e) "SyntaxError")
                                                 (defvar details
                                                    {
                                                      `error: e.name
                                                      `message: e.message
                                                      `expanded_source: (pretty_print (detokenize precompiled_assembly))
                                                      `compiled: compiled.1
                                                      })
                                                 ;(log "Syntax Error: " details)
                                                 (set_prop e
                                                    `details
                                                    details))
                                              
                                              (when (or opts.log_errors
                                                        (> Environment.context.scope.__VERBOSITY__  4))
                                                 (if e.details
                                                    (env_log "caught error: " e.details)
                                                    (env_log "caught error: " e.name e.message e)))
                                              (if (and false (== (sub_type e) "SyntaxError")
                                                       (or opts.log_errors
                                                          (> Environment.context.scope.__VERBOSITY__  4)))
                                                  (console.log compiled.1))
                                              (when opts.error_report
                                                 (opts.error_report (if e.details
                                                                        e.details
                                                                        {
                                                                          `error: e.name
                                                                          `message: e.message
                                                                          `form: nil
                                                                          `parent_forms: nil
                                                                          `invalid: true
                                                                          `text: e.stack
                                                                          })))
                                              (= result e)
                                              (if (or (not opts.catch_errors)
                                                      (and ctx ctx.in_try))
                                                  (progn
                                                     (throw result))))))
                                     result)))))
         
         (evaluate (fn (expression ctx opts)
                      (progn
                         (cond
                            ;true
                            ;(evaluate_local expression ctx opts)
                            (== namespace active_namespace)
                            (evaluate_local expression ctx opts)  ;; we by default use evaluate local
                            ;parent_environment
                            ;(-> parent_environment `evaluate expression ctx opts)
                            (== namespace "core")
                            (-> (prop children active_namespace)
                                `evaluate
                                expression ctx opts))))) ;; otherwise evaluate using the active namespace
         
         (eval_struct (fn (lisp_struct ctx opts)
                         (let
                            ((rval nil))
                            ;(env_log "eval_struct ->" (clone lisp_struct) ctx opts)
                            (if (is_function? lisp_struct)
                                (= rval (lisp_struct))
                                (= rval (evaluate lisp_struct
                                                  ctx
                                                  (+ {
                                                       `json_in: true
                                                       }
                                                    (or opts {})))))
                            ;(env_log "eval_struct <-" (clone rval))
                            rval))))
         
         ;; these are selected names which we don't need to propogate to children
         ;; however, anything that operates on the toplevel context needs to remain
         ;; so get_global, undefine, set_global, etc.
         
         (defvar built_ins
            ["MAX_SAFE_INTEGER","LispSyntaxError","sub_type","__VERBOSITY__","int","float",
             "values","pairs","keys","take","prepend","first","last","length","conj","reverse",
             "map","bind","to_object","to_array","slice","rest","second","third","chop","chomp",
             "not","push","pop","list","flatten","jslambda","join","lowercase","uppercase","log",
             "split","split_by","is_object?","is_array?", "is_number?", "is_function?", "is_set?",
             "is_element?", "is_string?", "is_nil?", "is_regex?", "is_date?", "ends_with?", "starts_with?",
             "blank?","contains?","make_set", "eval_exp", "indirect_new", "get_import_entry"
             "range", "add", "merge_objects", "index_of", "resolve_path", "delete_prop", "load_pends",
             "min_value","max_value","interlace","trim","assert","unquotify","or_args", "pending_ns_loads",
             "special_operators","defclog","NOT_FOUND","check_external_env_default" "built_ins"
             "reader"])
         
         (set_prop Environment.global_ctx.scope
            `built_ins
            built_ins)
         
       
         ;; This will allow us to swap out compiler functions for when we are using potentially
         ;; multiple compilers, for example in the development of the compiler.
         
         (defvar set_compiler (fn (compiler_function)
                                 (let
                                    ((new_ops (compiler_function [] { `special_operators: true `env: Environment })))
                                    (if (is_set? new_ops)
                                        (do
                                           (= compiler_operators
                                              new_ops)
                                           (= compiler compiler_function)
                                           (set_prop Environment.global_ctx.scope
                                              "compiler"
                                              compiler)
                                           
                                           (register_feature "compiler"))
                                        (do
                                           (console.error "Invalid compiler function: invalid operators returned. Not installing.")
                                           (throw EvalError "Invalid compiler function")))
                                    compiler)))
         
         (set_prop Environment.global_ctx.scope
            `set_compiler
            set_compiler)
         
         (set_prop Environment.global_ctx.scope
            `clone
            (fn (val)
               (if (== val Environment)
                   Environment
                   (clone val 0 Environment))))
         
         ;; Expose our global setters/getters for the dynamic and top level contexts
         
         (set_prop Environment
            `get_global get_global
            `set_global set_global
            `symbol_definition symbol_definition
            `namespace namespace)
         
         
         
         
         
         ;; If we have child environments (namespaces) we need to know about them
         ;; because we need to be able to manage them and we need to be able to
         ;; set our current evaluation path to the correct environment as the
         ;; entry point.
         ;; container for the child environments
         
         (defvar children (or opts.children {}))
         
         ;; container for declarations pertaining to our child environments
         
         (defvar children_declarations (or opts.children_declarations {}))
         
         ;; now bring any includes from the options...
         ;; the nil value of included_globals is replaced with the save_env
         ;; function
         
         
         
         ;; when included_globals has a populated value (which it gets from save_env)
         ;; the definitions get reintegrated into this environment
         
         
         
         ;; the core namespace has special responsibilities, namely to manage
         ;; the namespaces and the overall configuration, which is available
         ;; via the *env_config* object
         
         (when (== namespace "core")
            
            (when (not (prop Environment.global_ctx.scope
                             `*env_config*))
               (set_prop Environment.global_ctx.scope
                  `*env_config*
                  { `export: { `save_path: "js/juno.js"
                               `default_namespace: "core"
                               `include_source: false }
                    `features: []
                    `build: (javascript DLISP_ENV_VERSION)
                    `imports: {} })
               (set_prop Environment.definitions
                  `*env_config*
                  {
                    `description: (+ "The *env_config* symbol provides a central place to store "
                                     "metadata and settings relating to the configuration and " 
                                     "contents of the Juno environment.  There should be one "
                                     "`*env_config*` per instance and it should be in the "
                                     "`core` namespace.")
                    }))
            
            ;; returns the current namespace
            
            (defvar current_namespace (function ()
                                         (progn
                                            active_namespace)))
            
            (defvar create_namespace (fn (name options defer_initialization)
                                        (cond
                                           (not (is_string? name))
                                           (throw TypeError "namespace name must be a string")
                                           (prop children name)
                                           (throw EvalError "namespace already exists")
                                           else
                                           (let
                                              ((options (or options {}))
                                               (child_env (dlisp_env { `parent_environment: Environment `namespace: name `contained: options.contained `defer_initialization: defer_initialization})))
                                              (if child_env.evaluate   ;; we got an legit env back
                                                 (do
                                                    (-> child_env `set_compiler compiler) ;; we all share a single compiler by default
                                                    (set_prop children
                                                       name
                                                       child_env)
                                                    (set_prop children_declarations
                                                       name
                                                       {})
                                                    (-> child_env `evaluate_local "(for_each (sym built_ins) (delete_prop Environment.context.scope sym))")
                                                    (-> child_env `evaluate_local "(for_each (sym built_ins) (delete_prop Environment.definitions sym))")
                                                    (if options.contained
                                                       (set_prop (prop children_declarations name)
                                                                 `contained true))
                                                    (set_prop (prop children_declarations name)
                                                              `serialize_with_image
                                                              (if (== false options.serialize_with_image)
                                                                  false
                                                                  true))
                                                    
                                                    
                                                    name)
                                                 (do
                                                    (console.error "ENV: couldn't create the child environment. Received: " child_env)
                                                    (throw EvalError (+ "unable to create namespace " name))))))))
            
            (defvar set_namespace (fn (name)
                                     (cond
                                        (not (is_string? name))
                                        (throw TypeError "namespace name must be a string")
                                        (and (not (== "core" name))
                                             (eq nil (prop children name)))
                                        (throw EvalError (+ "namespace " name " doesn't exist"))
                                        else
                                        (do
                                           (if (== name "core")
                                               (do
                                                  (= active_namespace "core"))
                                               (do
                                                  (= active_namespace name)
                                                  ))  ;; point the evaluate function at the right environment
                                           name))))
            
            (defvar delete_namespace (fn (name)
                                        (cond
                                           (not (is_string? name))
                                           (throw TypeError "namespace name must be a string")
                                           (== "core" name)
                                           (throw EvalError "core namespace cannot be removed")
                                           (eq nil (prop children name))
                                           (throw EvalError (+ "namespace " name "doesn't exist"))
                                           (== name (current_namespace))
                                           (throw EvalError "namespace is the current namespace")
                                           else
                                           (do
                                              (remove_prop children name)
                                              (for_each (`k (or (resolve_path [ `global_ctx `scope `*env_config* `imports] Environment) []))
                                                 (when (starts_with? k name)
                                                    (remove_prop Environment.global_ctx.*env_config*.imports k)))
                                              name))))
            
            
            ;; if we are in core, set up the active namespace
            
            (set_prop Environment.global_ctx.scope
               "create_namespace" create_namespace
               "set_namespace" set_namespace
               "delete_namespace" delete_namespace
               "namespaces" (function () (+ (keys children) "core"))
               "current_namespace" current_namespace))
         
         (defvar get_namespace_handle (function (name)
                                         (progn
                                            (cond
                                               (== namespace name)
                                               Environment  ;; just return us
                                               (== namespace "core")
                                               (if (and (is_string? name)
                                                        (prop children name))
                                                   (prop children name))
                                               parent_environment
                                               (-> parent_environment `get_namespace_handle name)
                                               else
                                               (throw "invalid namespace handle requested")))))
         
         
         ;; included_globals nil value will be replaced in the JSON tree
         ;; with values from this environment upon saving the image. It
         ;; is then used to rehydrate the values on restart
         
         (defvar included_globals nil)
         (defvar imps nil)
         (defvar rehydrated_children false)
         
         (when (and included_globals
                    (== namespace "core"))
            
            ;; evaluate the inserted code...
            (try
               (= included_globals (included_globals))
               (catch Error (e)
                  (console.error "ERROR: "e)))
            
            ;; if not already defined by the environment itself, merge the
            ;; provided names and values into the global context.
            
            ;(console.log "core: importing symbols: " (prop included_globals `symbols))
            
            (when (resolve_path [ `symbols `compiler ] included_globals)
               (set_prop Environment.global_ctx.scope
                  `compiler
                  (resolve_path [ `symbols `compiler ] included_globals))
               ;; unofficially set the compiler, but we will complete the setting of it once
               ;; the remainder of the functions have been embedded
               ;;(debug)
               (= compiler Environment.global_ctx.scope.compiler))
            
            ;; load the exported config
            (when (is_object? (prop included_globals `config))
               (set_prop Environment.global_ctx.scope
                  "*env_config*"
                  included_globals.config))
            
            
            ;; bind any static imports for the core namespace
            ;; that may be needed as dependencies
            
            
            
            (when (is_object? (prop included_globals `imports))
               (= imps (prop included_globals `imports))
               (when imps
                  (for_each (imp_source (values imps))
                     (progn
                        (cond
                           (== imp_source.namespace namespace)  ;; only for core at this point..
                           (progn
                              (set_prop Environment.global_ctx.scope
                                 imp_source.symbol
                                 imp_source.initializer)))))))
            
            ;; Next setup the symbols and their values in core global scope...
            
            (when (is_object? (prop included_globals `symbols))
               (for_each (symset (pairs included_globals.symbols))
                  (when (eq nil (prop Environment.global_ctx.scope symset.0))
                     ;    (== symset.0 "*env_config*"))
                     (set_prop Environment.global_ctx.scope
                        symset.0
                        symset.1))))
            
            ;; Then, setup their definitions..
            
            (when (is_object? (prop included_globals `definitions))
               (for_each (symset (pairs included_globals.definitions))
                  (when (eq nil (prop Environment.definitions symset.0))
                     (set_prop Environment.definitions
                        symset.0
                        symset.1))))
            
            ;; Any declarations for core..
            
            (when (is_object? (prop included_globals `declarations))
               (for_each (symset (pairs included_globals.declarations))
                  (when (eq nil (prop Environment.declarations symset.0))
                     (set_prop Environment.declarations
                        symset.0
                        (quotel symset.1)))))
            
            ;; if we have a compiler, set the environment to use it.
            
            (when (prop Environment.global_ctx.scope `compiler)
               (set_compiler (prop Environment.global_ctx.scope `compiler)))
            
            ;; next for any child namespaces (environments), create them..
            
            (when (is_object? (prop included_globals `children))
               (= rehydrated_children true)
               (for_each (childset (pairs included_globals.children))
                  (do
                     (create_namespace childset.0
                        (if (prop included_globals.children_declarations childset.0)
                            (prop included_globals.children_declarations childset.0)
                            {})
                        true)))))
         
         
         ;; clone_to_new: an earlier experiment in working with environments...
         ;; may not be required but keeping it for now until analysis can be done.
         
         (defvar clone_to_new (fn (options)
                                 (let
                                    ((new_env nil)
                                     (my_children nil)
                                     (my_children_declarations nil))
                                    
                                    (env_log namespace "cloning: # children: " (length children))
                                    (= new_env
                                       (dlisp_env { `env: (clone Environment)
                                                         `children: (clone children)
                                                         `children_declarations: (clone children_declarations) }))
                                    (env_log namespace "constructed: " (->  new_env `id))
                                    new_env)))
         
         
         ;; facilate the exportation (serialization to JSON) of symbols from the environment..
         ;; note that there will be a lot of Javascript embedded in the produced output
         ;; since any callable code must be in JS form.
         
         (defvar export_symbol_set
            (fn (options)
               (reduce (symset (pairs (clone Environment.global_ctx.scope)))
                  (do
                     ;(console.log namespace "/" symset.0 "->" symset.1)
                     (cond
                        (and options options.no_compiler
                           (== symset.0 "compiler"))
                        nil
                        (starts_with? "$" symset.0)  ;; any values starting with $ do not get exported
                        nil
                        (== (resolve_path [ symset.0 `serialize_with_image ] Environment.definitions) false )
                        nil
                        (and options options.do_not_include
                           (contains? symset.0 options.do_not_include))
                        nil
                        (== symset.0 "*env_skeleton*")
                        [ symset.0 [(quote quotel) (prop Environment.global_ctx.scope "*env_skeleton*") ]]
                        
                        (resolve_path [ symset.0 `initializer ] Environment.definitions)
                        (do
                           [symset.0
                            [(quote quotel) "placeholder"]])
                        
                        (is_regex? symset.1)
                        [symset.0  `(javascript ,#(+ "/" (+ symset.1.source) "/" symset.1.flags))]
                        (is_date? symset.1)
                        [symset.0  `(javascript ,#(+ "new Date(\"" (+ (-> symset.1 `toJSON) "\")")))]
                        ;[symset.0  `(new RegExp ,#(+ symset.1.source) ,#symset.1.flags)]
                        (== nil symset.1)
                        [symset.0 (quote nil)]
                        (== undefined symset.1)
                        [symset.0 (quote undefined)]
                        (is_string? symset.1)
                        (progn
                           ;                      (console.log "symset: " symset.0 (env_encode_string symset.1))
                           ;[symset.0 symset.1])
                           [symset.0 (env_encode_string symset.1)])
                        else
                        [symset.0 symset.1])))))
         
         ;; This routine saves the environment image into effectively a Javascript
         ;; file or Lisp file...
         
         (defvar save_env
            (fn (options)
               (let
                  ((new_env nil)
                   (my_children nil)
                   (env_constructor nil)
                   (dcomps (date_components (new Date)))
                   (options (or options {}))
                   (version_tag (if (not (blank? opts.version_tag))
                                    opts.version_tag
                                    (join "." [ dcomps.year dcomps.month dcomps.day dcomps.hour dcomps.minute ])))
                   (build_time (formatted_date (new Date)))
                   (build_headers [])
                   (child_env nil)
                   (want_buffer (or options.want_buffer false))
                   (comp_buffer nil)
                   (sorted_dependencies (sort_dependencies))
                   (child_export_order nil)
                   (preserve_imports (if (and options
                                              (== options.preserve_imports false))
                                         false
                                         true))
                   (include_source false)
                   (exports [])
                   (src (if (-> Environment `get_global "*env_skeleton*" nil)
                            (clone (-> Environment `get_global "*env_skeleton*"))
                            (reader (read_text_file  "./src/environment.lisp"))))
                   (target_insertion_path nil)  ;; where we inject our context into the source tree
                   (output_path nil))
                  ;(env_log "sorted_dependencies: " sorted_dependencies)
                  (when (prop Environment.global_ctx.scope "*env_skeleton*")
                     (register_feature "*env_skeleton*"))
                  ;; construct our form by doing surgery on ourselves..
                  
                  (= target_insertion_path (first (findpaths (quote included_globals) src)))
                  
                  (if (not (is_array? target_insertion_path))
                      (throw EvalError "Unable to find the first included_globals symbol"))
                  
                  (= target_insertion_path (conj (chop target_insertion_path) [ 2 ])) ;; move one forward to the value position
                  
                  
                  (when options.include_source
                     (= include_source true))
                  
                  (env_log  "cloning: # children: " (length children))
                  (env_log  "preserve_imports: " preserve_imports)
                  (= exports (export_symbol_set (if options.do_not_include
                                                    { do_not_include: options.do_not_include })))
                  (= child_export_order (reduce (cname sorted_dependencies.namespaces)
                                           (unless (== cname "core")
                                              [cname (prop children cname)])))
                  (env_log "save_env: child_export_order: " (each child_export_order `0))
                  
                  (= my_children
                     (to_object
                        (reduce (child child_export_order)
                           (if (resolve_path [ child.0 "serialize_with_image" ] children_declarations)
                               (progn
                                  (env_log "checking " namespace "checking for: " (+ child.0"/*on_serialization*"))
                                  (when (is_symbol? (+ child.0"/*on_serialization*"))
                                     (-> child.1 `evaluate (+ "(" child.0 "/*on_serialization*)")))
                                  (= child_env (-> child.1
                                                   `compile
                                                   (-> child.1 `export_symbol_set (+ {} 
                                                                                     (if options.do_not_include 
                                                                                        { do_not_include: (let
                                                                                                             ((comps nil))
                                                                                                             (reduce (symbol options.do_not_include)
                                                                                                                (progn
                                                                                                                   (cond
                                                                                                                      (contains? "/" symbol)
                                                                                                                      (progn
                                                                                                                         (= comps (split_by "/" symbol))
                                                                                                                         (if (== comps.0 child.0)
                                                                                                                             comps.1))
                                                                                                                      else
                                                                                                                      symbol))))
                                                                                                             
                                                                                     } {})
                                                                                     { `no_compiler: true }))
                                                   { `throw_on_error: true  }))
                                  ;(= child_env (-> child.1
                                  ;                `export_symbol_set { `no_compiler: true }))
                                  [child.0  [ [(quote quotel) child.1.definitions]  [(quote quotel) `(javascript ,#child_env) ]]])))))
                  
                  
                  
                  ;; now embed our compiled existing context into the source tree...
                  (set_path target_insertion_path src
                     `(fn ()
                         ,#(to_object
                              [[`definitions  [(quotel quote) (if options.do_not_include
                                                       (to_object
                                                          (reduce (defset (pairs Environment.definitions))
                                                             (if (not (contains? defset.0 options.do_not_include))
                                                                 [defset.0 defset.1])))
                                                       (clone Environment.definitions))
                                               ]]
                               [`declarations (clone Environment.declarations)]
                               [`config ;(clone (prop Environment.global_ctx.scope "*env_config*")) ]
                                (let
                                   ((exp_conf (clone (prop Environment.global_ctx.scope "*env_config*"))))
                                   (when (not preserve_imports)
                                      (set_prop exp_conf
                                         `imports
                                         {}))
                                   (when options.features
                                      (set_prop exp_conf
                                         `features
                                         options.features))
                                   exp_conf) ]
                               [`imports      (if preserve_imports
                                                  (to_object
                                                     (for_each (imp_source (values (or (resolve_path ["*env_config*" "imports"] Environment.global_ctx.scope) {})))
                                                        [ imp_source.symbol { `initializer: `(javascript "new function () { return " ,#imp_source.symbol " }")
                                                                                           `symbol: imp_source.symbol
                                                                                           `namespace: imp_source.namespace
                                                                                           } ]))
                                                  {}) ]
                               [`symbols      [(quote javascript) (compile (to_object exports) { `throw_on_error: true } ) ]]
                               [ `children_declarations `(fn () ,#(clone children_declarations)) ]
                               [ `child_load_order (each child_export_order `0) ]
                               [ `children    my_children ]])))
                  
                  
                  
                  (= output_path (if options.want_buffer
                                     nil
                                     (or options.save_as
                                        (resolve_path ["*env_config*" "export" "save_path" ] Environment.global_ctx.scope))))
                  
                  ;; if our output path is a function, call it to get an actual name...
                  (if (is_function? output_path)
                      (= output_path (output_path)))
                  
                  (if (and (not (is_string? output_path))
                           output_path)
                      (throw EvalError "invalid name for target for saving the environment.  Must be a string or function"))
                  
                  (cond
                     (or want_buffer
                        (and output_path
                           (ends_with? ".js" output_path)))
                     (do
                        (push build_headers
                           (+ "// Build Time: " build_time))
                        (push build_headers
                           (+ "// Version: " version_tag))
                        (push build_headers
                           (+ "export const DLISP_ENV_VERSION='" version_tag "';"))
                        (env_log "saving to: " output_path)
                        (compile_buffer src "init_dlisp"
                           {
                             `namespace: namespace
                             `toplevel: true
                             `include_boilerplate: false
                             `verbose: false
                             `bundle: true
                             `want_buffer: want_buffer
                             `imports: (if preserve_imports
                                          (resolve_path ["*env_config*" "imports" ] Environment.global_ctx.scope))
                             `js_headers: [(show check_true)
                                           (show get_next_environment_id)
                                           (show get_outside_global)
                                           (show subtype)
                                           (show lisp_writer)
                                           (show clone)
                                           (show LispSyntaxError)]
                             
                             `bundle_options: { default_namespace: (resolve_path ["*env_config*" "export" "default_namespace" ] Environment.global_ctx.scope)
                                                 }
                             
                             `output_file: output_path
                             `include_source: (or options.include_source
                                                 (resolve_path ["*env_config*" "export" "include_source" ] Environment.global_ctx.scope))
                             `toplevel: true
                             `build_headers: build_headers
                             }))
                     (and output_path
                        (ends_with? ".lisp" output_path))
                     (write_text_file output_path (JSON.stringify src nil 4))
                     else
                     src))))
         
         
         
         
         
         
         ;; In the compiler context, we have access to the existing environment,
         ;; bring the needed functions in and rebuild them in the current scope.
         
         (declare (local lisp_writer)
                  (include reader add_escape_encoding
                           do_deferred_splice safe_access embed_compiled_quote))
         
         
         (defvar as_lisp (function (obj depth max_depth)
                            (lisp_writer obj depth max_depth Environment)))
         (defvar read_lisp reader)
         
         (set_prop Environment.global_ctx.scope
            `eval eval_exp
            `reader reader
            `add_escape_encoding add_escape_encoding
            `get_outside_global get_outside_global
            `as_lisp lisp_writer
            `lisp_writer lisp_writer
            `clone_to_new clone_to_new
            `save_env save_env
            `null null)
         
         
         (when (== namespace "core")
            (set_prop Environment.global_ctx.scope
               `namespace_declarations
               (function ()
                  children_declarations)
               `set_namespace_declaration
               (function (namespace key value)
                  (set_path  [namespace key ] children_declarations value))))
         
         ;; inline functions for more efficient comxpiled code...
         ;; instead of calling functions these serve to inline inside
         ;; of the produced javascript tree
         ;; add your own with the inline option:
         ;; format is: { operator: (fn (args) [ `js `to `be `inserted ]) }
         ;; Return an array of tokens to be directly inserted into the tree
         ;; the inline function must add spaces.
         
         (defvar inlines
            (if parent_environment
               (+ {}
                  parent_environment.inlines
                  (if opts.inlines
                     opts.inlines
                     {}))
               (+  {}
                  (if opts.inlines
                     opts.inlines
                     {})
                  {
                    `pop: (fn (args)
                             ["(" args.0 ")" "." "pop()"])
                    `push: (fn (args)
                              ["(" args.0 ")" ".push" "(" args.1 ")"])
                    `chomp: (fn (args)
                               ["(" args.0 ")" ".substr" "(" 0 "," "(" args.0 ".length" "-" 1 ")" ")" ])
                    `join: (fn (args)
                              (if (== args.length 1)
                                  ["(" args.0 ")" ".join" "('')"]
                                  ["(" args.1 ")" ".join" "(" args.0 ")" ]))
                    `take: (fn (args)
                              ["(" args.0 ")" ".shift" "()" ])
                    `prepend: (fn (args)
                                 [ "(" args.0 ")" ".unshift" "(" args.1 ")"])
                    
                    `trim: (fn (args)
                              [ "(" args.0 ")" ".trim()"])
                    
                    
                    `lowercase: (fn (args)
                                   ["(" args.0 ")" ".toLowerCase()"])
                    `uppercase: (fn (args)
                                   ["(" args.0 ")" ".toUpperCase()"])
                    `islice: (fn (args)
                                (cond
                                   (== args.length 3)
                                   [ "(" args.0 ")" ".slice(" args.1 "," args.2 ")"]
                                   (== args.length 2)
                                   [ "(" args.0 ")" ".slice(" args.1 ")"]
                                   else
                                   (throw SyntaxError "slice requires 2 or 3 arguments")))
                    `split_by: (fn (args)
                                  [ "(" args.1 ")" ".split" "(" args.0 ")"])
                    `bindf: (fn (args)
                               [   args.0 ".bind(" args.1 ")"])
                    `is_array?: (fn (args)
                                   [ "(" args.0 " instanceof Array" ")"])
                    `is_object?: (fn (args)
                                    [ "(" args.0 " instanceof Object" ")" ])
                    `is_string?: (fn (args)
                                    [ "(" args.0 " instanceof String || typeof " args.0 "===" "'string'" ")"])
                    `is_function?: (fn (args)
                                      [ args.0 " instanceof Function"])
                    `is_element?: (fn (args)
                                     [ args.0 " instanceof Element"])
                    `log: (fn (args)
                             ["console.log" "(" (map (fn (val idx tl)
                                                        (if (< idx (- tl 1))
                                                            [val ","]
                                                            [val]))
                                                     args) ")"])
                    `reverse: (fn (args)
                                 ["("args.0 ")" ".slice(0).reverse()"])
                    
                    `int: (fn (args)
                             (cond
                                (== args.length 1)
                                ["parseInt(" args.0 ")"]
                                (== args.length 2)
                                ["parseInt(" args.0 "," args.1 ")"]
                                else
                                (throw "SyntaxError" (+ "invalid number of arguments to int: received " args.length))))
                    `float: (fn (args)
                               ["parseFloat(" args.0 ")"])
                    
                    })))
         
         ;; Finally the interface that is exposed to compiler and the compiled code...
         
         (set_prop Environment
            `eval eval_struct
            `identify subtype
            `meta_for_symbol meta_for_symbol
            `set_compiler set_compiler
            `read_lisp reader
            `as_lisp as_lisp
            `symbols symbols
            `inlines inlines
            `clone_to_new clone_to_new
            `export_symbol_set export_symbol_set
            `save_env save_env
            `special_operators special_operators
            `definitions Environment.definitions
            `declarations Environment.declarations
            `get_namespace_handle get_namespace_handle
            `compile compile
            `evaluate evaluate
            `evaluate_local evaluate_local
            `do_deferred_splice do_deferred_splice
            `id (fn () id)
            `set_check_external_env (fn (state)
                                       (do
                                          (= check_external_env_default
                                             state)
                                          check_external_env_default))
            `check_external_env (fn ()
                                   check_external_env_default))
         
         ;; two initializations - one for the system and one for the user
         
         
         (setq in_boot false)
         
         (defvar sys_init (prop Environment.global_ctx.scope "*system_initializer*"))
         (defvar init (prop Environment.global_ctx.scope "*initializer*"))
         
         ;(console.log "env: " namespace ": initializer: " init "system: " sys_init)
         ;; set the default namespace if we have been given one and we have children..
         (when (and opts.default_namespace
                    (not (== compiler unset_compiler))
                    (prop children opts.default_namespace))
            (set_namespace opts.default_namespace))
         
         
         
         (when (== namespace "core")
            ;(console.log "core: rehydrated_children: " rehydrated_children)
            
            (defvar env_ready (prop Environment.global_ctx.scope "*on_environment_ready*"))
                                        
            (for_each (symname (keys Environment.definitions))
               (progn
                  (aif (and (not (and included_globals
                                      (prop included_globals.imports symname)))
                            (resolve_path [ symname `initializer ] Environment.definitions))
                       (progn
                          (try
                             (set_prop Environment.global_ctx.scope
                                symname
                                (eval_struct it {} { `throw_on_error: true } ))
                             (catch Error (e)
                                (progn
                                   (console.error "core environment cannot initialize: " symname "error:" e))))))))
            ;; call the system initializer
            
            (when sys_init
               (eval sys_init))
            ;(when included_globals
               ;(console.log "about to rehydrate children.." included_globals.child_load_order))
            ;; once the namespaces are created, set any static imports they have
            ;; and evaluate the child
            (when (and rehydrated_children
                       (is_object? (prop included_globals `children)))
               (debug)
               ;(console.log "env: child load order: " included_globals.child_load_order)
               (for_each (childname (or included_globals.child_load_order []))
                  (when (prop included_globals.children childname)
                     ;(console.log "env: loading namespace: " childname)
                     (defvar childset [ childname (prop included_globals.children childname) ])
                     (defvar childenv (prop children childset.0))
                     (defvar imported_defs childset.1.0)
                     (when (is_object? (prop included_globals `imports))
                        (=  imps (prop included_globals `imports))
                        (when imps
                           (for_each (imp_source (values imps))
                              (progn
                                 (if (prop children imp_source.namespace)
                                     (progn
                                        (set_global (+ "" imp_source.namespace "/" imp_source.symbol)
                                                    imp_source.initializer))) ))))
                     (try
                        (progn
                           (set_prop childset.1
                              1
                              (-> childenv `eval childset.1.1 { `throw_on_error: true }))
                           ;(console.log "env: child symbols rehydrated: " childset)
                           (for_each (symset childset.1.1)
                              (when (eq nil (resolve_path [ childset.0 `context `scope symset.0 ] children))
                                 ;; the child env is already compiled at this point
                                 (when (prop imported_defs symset.0)
                                    (set_path [ childset.0 `definitions symset.0 ] children
                                              (prop imported_defs symset.0)))
                                 ;; if we have an initializer for the symbol in the definition, we need to eval it and place
                                 ;; the result scope that contains the symbol
                                 (aif (resolve_path [ childset.0 `definitions symset.0 `initializer ] children)
                                      (progn
                                         (try
                                            (set_path [ childset.0 `context `scope symset.0 ] children
                                                      (-> childenv `eval it ))
                                            (catch Error (e)
                                               (console.error "env: unable to evaluate: symbol: " symset.0 e))))
                                      (if (is_string? symset.1)
                                          (set_path [ childset.0 `context `scope symset.0 ] children
                                                    (eval symset.1))
                                          (set_path [ childset.0 `context `scope symset.0 ] children
                                                    symset.1))))))
                        (catch Error (e)
                           (console.error "env: unable to load namespace: " (clone childset)))))))
            
            
            ;; call the user initializer
            (when init
               (eval init))
            
            
            ;; we will have deferred initializations of the namespaces
            ;; if there were any children in the export, so do these now
            
            (debug)
            (for_each (child (values children))
               (progn
                  (-> child `evaluate_local
                     (+ "(try (progn (debug) (if (prop Environment.global_ctx.scope `*system_initializer*) (eval (prop Environment.global_ctx.scope `*system_initializer*))) (if (prop Environment.global_ctx.scope `*initializer*) (eval  (prop Environment.global_ctx.scope `*initializer*)))) (catch Error (e) (progn (console.error *namespace* \"ERROR on initialization:\" e))))")
                     nil
                     { log_errors: true })))
            ;(console.log "core: initialized children, starting env_ready if exists")
            (if (not opts.no_start_on_ready)
                (when env_ready
                   (eval env_ready))))
         
         
         Environment)))




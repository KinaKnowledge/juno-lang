;; Environment -- Facilitates and organizes the lisp top level and resources
;; Author: Alex Nygren

;; Copyright (c) 2022, Kina, LLC

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


;; We need some global types since Javascript eval() isn't used in Juno

(set_prop globalThis
          `subtype subtype
          `check_true check_true
          `clone clone
          `lisp_writer lisp_writer
          `LispSyntaxError LispSyntaxError)

(if (== "undefined" (typeof dlisp_environment_count))
  (set_prop globalThis
            `dlisp_environment_count
            0))


;; We can't immediately define a macro for the below because we don't have
;; an environment yet to place it.  So when we want to save the current
;; environment, we will splice directly into the JSON representation
;; of this file.  

(defexternal dlisp_env
  (fn (opts)
    (progn
     
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
          `version: (javascript DLISP_ENV_VERSION)
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
         
         
         
         (reverse (new Function "container" "{ return container.slice(0).reverse }")
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
       
         (meta_for_symbol (fn (quoted_symbol search_mode)
                               (when (is_string? quoted_symbol)
                                 ;; if we have been given a string, get any local data we have in our global context
                                 (defvar local_data (prop Environment.global_ctx.scope quoted_symbol))
                                 (if search_mode                                                                          
                                   (cond
                                     local_data
                                     [ (+ { `namespace: namespace
                                            `name: quoted_symbol
                                           `type: (subtype local_data) }
                                          ;; include any symbols we need
                                          (aif (prop Environment.definitions quoted_symbol)
                                               it
                                               {})) ]
                                     parent_environment
                                     (-> (-> parent_environment `meta_for_symbol quoted_symbol true) `flat 1)
                                     
                                     (> (length (keys children)) 0)  ;; we don't have a parent, but we have children
                                     (reduce (`details (for_each (`child_data (pairs children))
                                                                 (-> child_data.1 `meta_for_symbol quoted_symbol)))
                                             details))
                                   (do
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
                      (do
                        (defvar external_results (get_outside_global quoted_symbol))
                        (if external_results
                          {
                           `location: "external"
                           `type: (subtype external_results)
                           }
                          nil))))))
                          
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
			       (throw SyntaxError "undefine requires a quoted symbol"))))
         
         (eval_exp (fn (expression)
                     (do 
                       (console.log "EVAL:",expression)
                       (expression))))
         
         (indirect_new (new Function "...args"
                            "{
                                    let targetClass = args[0];
                                    if (subtype(targetClass)===\"String\") {
                                        let tmpf=new Function(\"{ return \"+targetClass+\" }\");
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
                                    }}"))
         
         (range (function (`& args)
                          (let
                              ((`from_to (if args.1
                                           [ (int args.0) (int args.1) ]
                                           [ 0 (int args.0) ]))
                               (`step (if args.2
                                        (float args.2)
                                        1))
                               (`idx from_to.0)
                               (`acc []))
                            (while (< idx from_to.1)
                              (do
                                (push acc idx)
                                (inc idx step)))
                            acc)))
         
         
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
                             }"))
         
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
                                 }"))
         
         (index_of (new Function "value" "container"
                        (+ "{ return container.indexOf(value) }")))
         (resolve_path (new Function "path,obj" 
                            "{
                                        if (typeof path==='string') {
                                            path = path.split(\".\");
                                        }
                                        let s=obj;
                                        return path.reduce(function(prev, curr) {
                                            return prev ? prev[curr] : undefined
                                        }, obj || {})
                                    }"))
         
         
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
                                    }"))
         
         (min_value (new Function "elements" "{ return Math.min(...elements); }"))
         (max_value (new Function "elements" "{ return Math.max(...elements); }"))
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
                         (-> x `trim)))
         
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
                      is_true)))
         
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
                                     args))))))

     
         (NOT_FOUND (new ReferenceError "not found"))
       
         (check_external_env_default (if (== namespace "core") true false))
         (*namespace* namespace)
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
                       (do
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
                         (prop Environment.global_ctx.scope comps.0))))))
         
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
                          ;; pass it up...note that is we are a contained environment, our request will turn contained to true
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
                              (throw EvalError (+ "namespace " namespace_identity.0 " doesn't exist"))))
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
                                       value_if_not_found)
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
                   `tags:["macro" "quote" "quotes" "desym"]
                   })
         
         (env_log (defclog { `prefix: (+ "env" id) `background: "#B0F0C0" }))
         
         (evaluate_local (fn (expression ctx opts)
                           (let
                               ((opts (or opts
                                          {}))
                                (compiled nil)
                                (error_data nil)
                                (result nil))
			     ;(debug)
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
                                               `formatted_output: true
                                               `source_name: opts.source_name
                                               `throw_on_error: opts.throw_on_error
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
                                        ;(console.log "env: <- compiled: " (clone compiled))
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
                                       (env_log "caught error: " e.name e.message)
                                       (when opts.error_report
                                         (opts.error_report {
                                                             `error: e.name
                                                             `message: e.message
                                                             `form: nil
                                                             `parent_forms: nil
                                                             `invalid: true
                                                             `text: e.stack
                                                             }))
                                        ;(env_log "<- ERROR: " (-> e `toString))
                                       (= result e)
                                       (if (and ctx ctx.in_try)
                                         (throw result)))))
                                        ;(env_log "<-" result)
                                 result)))))
       
	 (evaluate (fn (expression ctx opts)
		       (progn			 
			 (if (== namespace active_namespace)
			     (evaluate_local expression ctx opts)  ;; we by default use evaluate local
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
	"blank?","contains?","make_set", "eval_exp", "indirect_new",
        "range", "add", "merge_objects", "index_of", "resolve_path", "delete_prop",
	"min_value","max_value","interlace","trim","assert","unquotify","or_args",
	"special_operators","defclog","NOT_FOUND","check_external_env_default" "built_ins"])

     (set_prop Environment.global_ctx.scope
	       `built_ins
	       built_ins)
     
     ;; This will allow us to swap out compiler functions for when we are using potentially
     ;; multiple compilers, for example in the development of the compiler.
     
     (defvar set_compiler (fn (compiler_function)
                            (do 
                             (= compiler compiler_function)			     
                              (= compiler_operators
                                 (compiler [] { `special_operators: true `env: Environment }))
                              (set_prop Environment.global_ctx.scope
                                        "compiler"
                                        compiler)
                              (register_feature "compiler")
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
                    `imports: {} }))

       ;; returns the current namespace 

       (defvar current_namespace (function ()
                                           active_namespace))
       
       (defvar create_namespace (fn (name options)
                                  (cond
                                    (not (is_string? name))
                                    (throw TypeError "namespace name must be a string")
                                    (prop children name)
                                    (throw EvalError "namespace already exists")
                                    else                                  
                                    (let
                                        ((options (or options {}))
                                         (child_env (dlisp_env { `parent_environment: Environment `namespace: name `contained: options.contained })))
                                      
                                      (if child_env.evaluate   ;; we got an legit env back 
                                        (do
                                          (-> child_env `set_compiler compiler) ;; we all share a single compiler by default
                                          (set_prop children
                                                    name
                                                    child_env)
                                          (set_prop children_declarations
                                                    name
                                                    {})
					  (-> child_env `evaluate "(for_each (sym built_ins) (delete_prop Environment.context.scope sym))")
                                          (-> child_env `evaluate "(for_each (sym built_ins) (delete_prop Environment.definitions sym))")
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
         
     (defvar included_globals nil)
     (when (and included_globals
		(== namespace "core"))
       ;; evaluate it
       
       (= included_globals (included_globals))
       
       ;; if not already defined by the environment itself, merge the
       ;; provided names and values into the global context.
       ;(console.log "importing symbols: " (prop included_globals `symbols))
       (when (is_object? (prop included_globals `symbols))
         (for_each (symset (pairs included_globals.symbols))
                   (when (or (eq nil (prop Environment.global_ctx.scope symset.0))
                             (== symset.0 "*env_config*"))
                     (set_prop Environment.global_ctx.scope
                               symset.0
                               symset.1))))

       (when (is_object? (prop included_globals `definitions))         
         (for_each (symset (pairs included_globals.definitions))
                   (when (eq nil (prop Environment.definitions symset.0))                   
                     (set_prop Environment.definitions
                               symset.0
                               symset.1))))
       
       (when (is_object? (prop included_globals `declarations))
         (for_each (symset (pairs included_globals.declarations))
                   (when (eq nil (prop Environment.declarations symset.0))
                     (set_prop Environment.declarations
                               symset.0
                               (quotel symset.1)))))

       ;; if we have a compiler embedded, use it
     
       (when (prop Environment.global_ctx.scope `compiler)         
	 (set_compiler (prop Environment.global_ctx.scope `compiler)))

       (when (is_object? (prop included_globals `children))
         (for_each (childset (pairs included_globals.children))
	           (do	       
	             (create_namespace childset.0
				       (if (prop included_globals.children_declarations childset.0)
				         (prop included_globals.children_declarations childset.0)
				         {}))))
         
         (for_each (childset (pairs included_globals.children))
	           (do                     
                     ;(console.log "installing child symbols: " childset.0)
                     
                     (defvar childenv (prop children childset.0))
                     
                     (set_prop childset
                               1
                               (-> childenv `eval childset.1))
                                          
	             (for_each (symset childset.1)
			       (when (eq nil (resolve_path [ childset.0 `context `scope symset.0 ] children))
                                 ;; the child env is already compiled at this point
                                 
                                 ;(console.log childset.0 ": " symset.0 symset.1)                          
			         (set_path [ childset.0 `context `scope symset.0 ] children					  
				           symset.1)))
                     ))))

     
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
     
     (defvar export_symbol_set
       (fn (options)
	   (reduce (symset (pairs (clone Environment.global_ctx.scope)))
                   (do
		    ;(console.log "export_symbol_set: [" namespace "]: " symset.0 symset.1)
                    (cond
		     (and options options.no_compiler
			  (== symset.0 "compiler"))
		     nil
		     (starts_with? "$" symset.0)  ;; any values starting with $ do not get exported
		     nil
		     (== symset.0 "*env_skeleton*")
                     [ symset.0 [(quote quotel) (prop Environment.global_ctx.scope "*env_skeleton*") ]]
                     (resolve_path [ symset.0 `initializer ] Environment.definitions)
                     [symset.0 (resolve_path [ symset.0 `initializer ] Environment.definitions)]
                     (== nil symset.1)
                     [symset.0 (quote nil)]
                     (== undefined symset.1)
                     [symset.0 (quote undefined)]
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
              (version_tag (if (not (blank? opts.version_tag))
                             opts.version_tag
                             (join "." [ dcomps.year dcomps.month dcomps.day dcomps.hour dcomps.minute ])))
              (build_time (formatted_date (new Date)))
              (build_headers [])
              (child_env nil)
              (include_source false)
              (exports [])
              (src (if (prop Environment.global_ctx.scope "*env_skeleton*")
                     (clone (prop Environment.global_ctx.scope "*env_skeleton*"))
		     (reader (read_text_file  "./src/environment.lisp"))))
              (target_insertion_path nil)  ;; where we inject our context into the source tree                               
              (output_path nil))			       

           (when (prop Environment.global_ctx.scope "*env_skeleton*")
             (register_feature "*env_skeleton*"))
           ;; construct our form by doing surgery on ourselves..
           
           (= target_insertion_path (first (findpaths (quote included_globals) src)))
           
           (if (not (is_array? target_insertion_path))
             (throw EvalError "Unable to find the first included_globals symbol"))

           (= target_insertion_path (conj (chop target_insertion_path) [ 2 ])) ;; move one forward to the value position
           
           (= options (or options {}))
           (when options.include_source
             (= include_source true))
           
           (env_log namespace "cloning: # children: " (length children))                           

	   (= exports (export_symbol_set))
	   
	   (= my_children
	      (to_object
               (reduce (child (pairs children))
                       (if (resolve_path [ child.0 "serialize_with_image" ] children_declarations)
                         (progn
                          (= child_env (-> child.1
                                           `compile
                                           (-> child.1 `export_symbol_set { `no_compiler: true })
                                           { `throw_on_error: true `meta: true }))                                            
                          [child.0  `(quote (javascript ,#child_env.1))])))))
           
                                        ;[(quote let)
                                        ;  [[(quote Environment) [(quote prop) (quote children) child.0]]]
                                        ;  [(quote javascript) child_env.1]]])))))
	   
	   
           ;; now embed our compiled existing context into the source tree...			    
           (set_path target_insertion_path src
		     `(fn ()
                        ,#(to_object
                           [[`definitions  [(quotel quote) (clone Environment.definitions)]]
			    [`declarations (clone Environment.declarations)]
                            [`symbols      [(quote javascript) (compile (to_object exports) { `throw_on_error: true } ) ]]
			    [ `children_declarations `(fn () ,#(clone children_declarations)) ]
                            [ `children    my_children ]])))

           
           
           (= output_path (or options.save_as
                              (resolve_path ["*env_config*" "export" "save_path" ] Environment.global_ctx.scope)))
           ;; if our output path is a function, call it to get an actual name...
           (if (is_function? output_path)
             (= output_path (output_path)))
           
           (if (and (not (is_string? output_path))
                    output_path)
             (throw EvalError "invalid name for target for saving the environment.  Must be a string or function"))
           
           (cond
             (and output_path
                  (ends_with? ".js" output_path))
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
     
     
     (defvar as_lisp lisp_writer)
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

    
       
     ;; inline functions for more efficient compiled code...
     
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
               `inlines inlines
               `clone_to_new clone_to_new
	       `export_symbol_set export_symbol_set
	       `save_env save_env
               `special_operators special_operators
               `definitions Environment.definitions
               `declarations Environment.declarations
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

     ;; get the core/*initializer*...
     (defvar init (prop Environment.global_ctx.scope "*initializer*"))

     ;; set the default namespace if we have been given one and we have children..
     (when (and opts.default_namespace
	        (not (== compiler unset_compiler))	
		(prop children opts.default_namespace))
       (set_namespace opts.default_namespace))

     ;; call the initializer     
     (when init 
       (eval init))
     
     Environment)))




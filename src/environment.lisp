;; Environment - (c) 2022 Kina, LLC 
;; Author: Alex Nygren

;; **

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


(defexternal dlisp_env 
  (fn (opts)
    (progn
     
     ;; State to the compiler that we do not want to be passed an Environment
     ;; by declaring that this is toplevel.
     
     (declare (toplevel true)
              (include subtype get_object_path get_outside_global)
              (local clone get_next_environment_id))

     ;; NOTICE:
     ;; We do not have access to the Environment things at this point, so we are
     ;; very limited until after (define_env)...
     ;; ------ Start Limited --------------------------------------------
     
     (if (eq undefined opts)
       (= opts {}))
     
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
       (if opts.env
         ;; if we have been given an established env we would use that
         opts.env 
         {
          `global_ctx:{
                       `scope: {}
                       `name:  namespace              
                       }
          `version: (javascript DLISP_ENV_VERSION)
          `definitions: {
                         
                         }
          `declarations: { 
                          `safety: {
                                    `level: 2
                                    }                        
                          }       
          }))
          
     
     (defvar id  (get_next_environment_id))

     ;; if we have a namespace other than core we should
     ;; have a parent environment
              
     (set_prop Environment
               `context
               Environment.global_ctx)
     
     (defvar compiler (fn () (throw EvalError "compiler must be set")))
     
     (defvar compiler_operators (new Set))
     (defvar special_identity (fn (v)
                                v))

     ;; ------- End Limited Zone --------------------------------
     
     ;; the define_env macro populates global_ctx scope object to local values in our
     ;; closure
     
     
     (define_env% (if opts.env
                    opts.env
                    nil)
         (MAX_SAFE_INTEGER 9007199254740991)
         (LispSyntaxError globalThis.LispSyntaxError)
         (sub_type subtype)
                                        ;(*namespace* namespace)
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
                            }"))
         
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
                                }"))
         
         (keys (new Function "obj"
                    "{  return Object.keys(obj);  }"))
         
         (take (new Function "place" "{ return place.shift() }"))
         
         (prepend (new Function "place" "thing" "{ return place.unshift(thing) }"))
         
         (first (new Function "x" "{ return x[0] }"))
         
         (last (new Function "x" "{ return x[x.length - 1] }"))
         
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
                            }"))
         
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
                            }"))
         
         
         
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
                              }"))
         
         (bind (new Function "func,this_arg"
                    "{ return func.bind(this_arg) }"))
         
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
                    `tags: ["list" "array" "conversion" "set" "object" "string" "pairs"]
                    })
         
         (slice (function (target from to)
                          (cond
                            to
                            (-> target `slice from to)
                            from
                            (-> target `slice from)
                            else
                            (throw SyntaxError "slice requires 2 or 3 arguments"))))
         (rest (function (x)
                         (cond 
                           (instanceof x Array)
                           (-> x `slice 1)
                           (is_string? x)
                           (-> x `substr 1)
                           else
                           nil)))
         
         (second  (new Function "x" "{ return x[1] }"))
         (third (new Function "x" "{ return x[2] }"))
         
         (chop  (new Function "x" "{ if (x instanceof Array) { return x.slice(0, x.length-1) } else { return x.substr(0,x.length-1) } }"))
         
         (chomp (new Function "x" "{ return x.substr(x.length-1) }"))
         
         (not   (new Function "x" "{ if (check_true(x)) { return false } else { return true } }"))
         
         (push  (new Function "place" "thing" "{ return place.push(thing) }"))
         
         (pop   (new Function "place" "{ return place.pop() }"))
         
         (list  (fn (`& args) args))
         
         (flatten (new Function "x" "{ return x.flat(999999999999) } "))
         
         (jslambda (function (`& args)
                             (apply Function (flatten args))))
         
         (join (function (`& args)
                         (cond
                           (== args.length 1)
                           (-> args.0 `join "")
                           else
                           (-> args.1 `join args.0))))
         (lowercase (function (x)
                              (-> x `toLowerCase)))
         
         (uppercase (function (x)
                              (-> x `toUpperCase)))
         
         (log (function (`& args)
                        (apply console.log args)))
         (split (new Function "container" "token" "{ return container.split(token) }"))
         
         (split_by (new Function "token" "container" "{ return container.split(token) }"))
         
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
                                    (== val "")))))
         (contains? (new Function "value" "container"
                         "{ if (!value && !container) { return false }
                           else if (container === null) { throw new TypeError(\"contains?: passed nil/undefined container value\"); }
                           else if ((container instanceof String) || typeof container === \"string\") {
                                if (subtype(value) === \"Number\") return container.indexOf(\"\"+value)>-1;
                                else return container.indexOf(value)>-1;
                           }
                           else if (container instanceof Array) return container.includes(value);
                           else if (container instanceof Set) return container.has(value);
                           else throw new TypeError(\"contains?: passed invalid container type: \"+subtype(container)) }"))
         
         (make_set (function (vals)
                             (if (instanceof vals Array)
                               (new Set vals)
                               (let
                                   ((`vtype (sub_type vals)))
                                 (cond
                                   (== vtype "Set")
                                   (new Set vals)
                                   (== vtype "object")
                                   (new Set (values vals)))))))
       
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
                                                        (-> quoted_symbol `substr 2)))
                                     (aif (prop Environment.definitions quoted_symbol)
                                          (+ { `namespace: namespace
                                               `type: (sub_type local_data)
                                               `name: quoted_symbol }
                                             it)))))))
       
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
                             (if (prop Environment.global_ctx.scope quoted_symbol)
                               (progn
                                (delete_prop Environment.definitions quoted_symbol)
                                (delete_prop Environment.global_ctx.scope quoted_symbol))                              
                               false)))
         
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
                             (debug)
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
                                  (== NOT_FOUND refval)
                                  (or value_if_not_found
                                      NOT_FOUND)
                                  
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
                                                       (split_by "/" symname))))
                              (cond (== namespace_identity.length 1)
                                    ;; not fully qualified
                                    (aif (prop Environment.definitions symname)
                                         it
                                         (if parent_environment
                                           (-> parent_environment `symbol_definition symname)))
                                    (== namespace_identity.0  namespace)
                                    (prop Environment.definitions symname)
                                    parent_environment
                                    (-> parent_environment `symbol_definition namespace_identity.1 namespace_identity.0)
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
                                   `meta: false
                                   }))
                         (out nil))
                      (if (is_function? json_expression)
                        (throw SyntaxError "compile: non-JSON value (function) received as input"))
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
                             (debug)                            
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
                   (if (== namespace active_namespace)
                     (evaluate_local expression ctx opts)  ;; we by default use evaluate local
                     (-> (prop children active_namespace)
                         `evaluate
                         expression ctx opts)))) ;; otherwise evaluate using the active namespace
       
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

     
     
     ;; If we have child environments (namespaces) we need to know about them
     ;; because we need to be able to manage them and we need to be able to
     ;; set our current evaluation path to the correct environment as the
     ;; entry point.

     ;; container for the child environments
     (defvar children (or opts.children {}))
     
     ;; container for declarations pertaining to our child environments
     (defvar children_declarations (or opts.children_declarations {})) 
     
     (when (== namespace "core")     
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
                                                    `name
                                                    {})
                                          (if options.contained
                                            (set_prop children_declarations.name
                                                      `contained true))
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
                                      name))))
            
       ;; if we are in core, set up the active namespace
       
       (set_prop Environment.global_ctx.scope
                 "create_namespace" create_namespace
                 "set_namespace" set_namespace
                 "delete_namespace" delete_namespace                
                 "namespaces" (function () (+ (keys children) "core"))                 
                 "current_namespace" current_namespace))

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
                           
                           
     
     ;; Expose our global setters/getters for the dynamic and top level contexts
     
     (set_prop Environment
               `get_global get_global
               `set_global set_global
               `symbol_definition symbol_definition              
               `namespace namespace)
          
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
               `clone_to_new clone_to_new)
     
     
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
     
     Environment)))

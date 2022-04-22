(defexternal 
     dlisp_env 
     (fn (opts)
        (progn
          
          ;; State to the compiler that we do not want to be passed an Environment
          ;; by declaring that this is toplevel.
          
          (declare (toplevel true)
                   (include subtype)
                   (local get_object_path get_outside_global))
          
          ;; Construct the environment
          (defvar
                Environment
                  {
                    `global_ctx:{
                        `scope:{
                        }
                    }
                    `definitions: {
                        
                    }
                    `declarations: { 
                      `safety: {
                          `level: 2
                      }
                    }
                   `externs:{}
                  })
                    
         ; (defvar Environment this.Environment)
          (defvar id  (get_next_environment_id))
          
          (if (eq undefined opts)
              (= opts {}))
          
          (set_prop Environment
                    `context
                    Environment.global_ctx)
         
          (defvar compiler (fn () true))
          
          
         
          (define_env 
                  (MAX_SAFE_INTEGER 9007199254740991)
                  (sub_type subtype)
                  (int parseInt)
                  (float parseFloat)
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
                  (reverse (new Function "container" "{ return container.slice(0).reverse }"))      
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
                                    }"))
                                
                  (slice (fn (target from to)
                             (cond
                                 to
                                 (-> target `slice from to)
                                 from
                                 (-> target `slice from)
                                 else
                                 (throw SyntaxError "slice requires 2 or 3 arguments"))))
                  (rest (fn (x)
                          (cond 
                            (instanceof x Array)
                            (-> x `slice 1)
                            (is_string? x)
                            (-> x `substr 1)
                            else
                            nil)))
                        
                  (second  (new Function "x" "{ return x[1] }"))
                  (third (new Function "x" "{ return x[2] }"))
                           
                  (chop  (new Function "x" "{ return x.substr(x.length-1) }"))
                 
                  (not   (new Function "x" "{ if (x) { return false } else { return true } }"))
                 
                  (push  (new Function "place" "thing" "{ return place.push(thing) }"))
                 
                  (pop   (new Function "place" "{ return place.pop() }"))
                 
                  (list  (fn (`& args) args))
                 
                  (flatten (new Function "x" "{ return x.flat(999999999999) } "))
                 
                  (jslambda (fn (`& args)
                               (apply Function (flatten args))))
                           
                  (join (fn (`& args)
                            (cond
                               (== args.length 1)
                               (-> args `join "")
                               else
                               (-> args.1 `join args.0))))
                           
                  (log (fn (`& args)
                           (apply console.log args)))
                  (split (new Function "container" "token" "{ return container.split(token) }"))
                 
                  (split_by (new Function "token" "container" "{ return container.split(token) }"))
                 
                  (is_object? (new Function "x" "{ return x instanceof Object }"))
                  (is_array? (new Function "x" "{ return x instanceof Array }"))
                  (is_number? (fn (x)
                                  (== (subtype x) "Number")))
                  (is_function? (fn (x)
                                    (instanceof x Function)))
                  (is_set? (new Function "x" "{ return x instanceof Set }"))
                  (is_element? (new Function "x" "{ return x instanceof Element }"))
                  (is_string? (fn (x)
                                  (or (instanceof x String) 
                                      (== (typeof x) "string"))))
                  (is_nil? (fn (x)
                               (== x nil)))
                           
                  (ends_with? (new Function "val" "text" "{ if (text instanceof Array) { return text[text.length-1]===val } else if (subtype(text)=='String') { return text.endsWith(val) } else { return false }}"))
                  (starts_with? (new Function "val" "text" "{ if (text instanceof Array) { return text[0]===val } else if (subtype(text)=='String') { return text.startsWith(val) } else { return false }}"))
                  
                  (blank? (fn (val)
                              (or (eq val nil)
                                  (and (is_string? val)
                                       (== val "")))))
                                  
                  (contains? (fn (value container)
                               (cond
                                 (and (not value)
                                      (not container))
                                 false
                                 (eq container nil)
                                 (throw TypeError "contains?: passed nil/undefined container value")
                                 (is_string? container)
                                 (if (is_number? value)
                                     (> (-> container `indexOf (+ "" value)) -1)
                                     (> (-> container `indexOf value) -1))
                                 (is_array? container)
                                 (-> container `includes value)
                                 (is_set? container)
                                 (-> container `has value)
                                 else
                                 (throw TypeError (+ "contains?: passed invalid container type: " (sub_type container))))))
                             
                  (make_set (fn (vals)
                               (if (instanceof vals Array)
                                   (new Set vals)
                                   (let
                                      ((`vtype (sub_type vals)))
                                     (cond
                                       (== vtype "Set")
                                       (new Set vals)
                                       (== vtype "object")
                                       (new Set (values vals)))))))
               
                  (describe 
                    (fn (quoted_symbol)
                        (let
                          ((`not_found { `not_found: true })
                           (`location (cond (prop Environment.global_ctx.scope quoted_symbol)
                                            "global"
                                            (not (== not_found (get_outside_global quoted_symbol not_found)))
                                            "external"
                                            else
                                            nil)))
                        
                          (+ {
                             `type: (cond
                                      (== location "global")
                                      (sub_type (prop Environment.global_ctx.scope quoted_symbol))
                                      (== location "external")
                                      (sub_type (get_outside_global quoted_symbol))
                                      else
                                     "undefined")
                             `location: location
                             }
                             (if (prop Environment.definitions quoted_symbol)
                                 (prop Environment.definitions quoted_symbol)
                                 {})))))
                           
                  (undefine (fn (quoted_symbol)
                                (if (prop Environment.global_ctx.scope quoted_symbol)
                                    (delete_prop Environment.global_ctx.scope quoted_symbol)
                                    false)))
                           
                  (eval_exp (fn (expression)
                                (do 
                                  (console.log "EVAL:",expression)
                                  (expression))))
                            
                  (range (fn (`& args)
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
                            
                  (index_of (new Function "value,container"
                                        "{ let searcher = (v) => v == value; return container.findIndex(searcher);}"))
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
      
                  (trim (fn (x)
                            (-> x `trim)))
                        
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
                  (check_external_env_default true)
         
                  (set_global 
                      (fn (refname value meta)
                           (do
                            (if (not (== (typeof refname) "string"))
                                (throw TypeError "reference name must be a string type"))
                            (log "Environment: set_global: " refname value)
                             (set_prop Environment.global_ctx.scope 
                                       refname
                                       value)
                             (if (and (is_object? meta)
                                      (not (is_array? meta)))
                                 (set_prop Environment.definitions
                                           refname
                                           meta))
                             (prop Environment.global_ctx.scope refname))))
                  
                  (get_global 
                      (fn (refname value_if_not_found suppress_check_external_env)
                           (cond 
                               (not (== (typeof refname) "string"))
                               (throw TypeError "reference name must be a string type")
                               (== refname "Environment")
                               Environment
                               else
                                (let
                                    ((`comps (get_object_path refname))
                                     (`refval nil)
                                     
                                     ;; shadow the environments scope check if the suppress_check_external_env is set to true
                                     ;; this is useful when we have reference names that are not legal js reference names
                                     
                                     (`check_external_env (if suppress_check_external_env
                                                              false
                                                              check_external_env_default)))
                                     
                                      ;; search path is to first check the global Lisp Environment
                                      ;; and if the check_external_env flag is true, then go to the
                                      ;; external JS environment.
                                      
                                  (= refval (or (prop Environment.global_ctx.scope comps.0)
                                                (if check_external_env
                                                    (or (prop Environment.externs comps.0)
                                                        (get_outside_global comps.0)
                                                        NOT_FOUND)
                                                    NOT_FOUND)))
                                  
                                  (when (not (prop Environment.global_ctx.scope comps.0))
                                    (console.log "get_global: [external reference]:" (if (prop Environment.externs comps.0) "[cached]" "") refname ))
                                  ;; based on the value of refval, return the value
                                  (when (== undefined (prop Environment.externs comps.0))
                                     (set_prop Environment.externs
                                               comps.0
                                               refval))
                                        
                                        
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
                                          NOT_FOUND))))))
                  
                  (compile (fn (json_expression opts)
                               (compiler json_expression { `env: Environment })))
                  (env_log (defclog { `prefix: (+ "env" id) `background: "#B0F0C0" }))
                  (evaluate (fn (expression ctx opts)
                             (let
                                 ((opts (or opts
                                             {}))
                                  (compiled nil)
                                  (result nil))
                               (env_log "-> expression: " expression) 
                               (env_log "-> ctx: " (sub_type ctx) ctx)
                               ;(debug)
                               (= compiled
                                  (compiler (if opts.json_in
                                                expression
                                                (-> Environment `read_lisp expression))
                                            {   `env: Environment 
                                                `ctx: ctx 
                                                `formatted_output: true 
                                                `error_report: (or opts.error_report nil)
                                                `quiet_mode: (or opts.quiet_mode false) }))
                                            
                               (env_log "<- compiled:" compiled)
                               (if opts.on_compilation_complete
                                   (opts.on_compilation_complete compiled))
                               (console.log "env: <- compiled: " (clone compiled))
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
                                                    (console.log "env: compiled text: " (+ "{ return " compiled.1 "} "))     
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
                                            (when opts.error_report
                                                  (opts.error_report {
                                                                  `error: e.name
                                                                  `message: e.message
                                                                  `form: nil
                                                                  `parent_forms: nil
                                                                  `invalid: true
                                                                  `text: e.stack
                                                                  }))
                                            (env_log "<- ERROR: " (-> e `toString))
                                            (= result e)
                                            (if (and ctx ctx.in_try)
                                                (throw result)))))
                               (env_log "<-" result)
                               result)))
                           
              (eval_struct (fn (lisp_struct ctx opts)
                                (if (is_function? lisp_struct)
                                    (lisp_struct)
                                    (evaluate lisp_struct ctx (+ {
                                                                 `json_in: true
                                                                 }
                                                                 (or opts {})))))))
          
         
          (defvar meta_for_symbol (fn (quoted_symbol)
                                    (do
                                         (if (starts_with? (quote "=:") quoted_symbol)
                                             (prop Environment.definitions (-> quoted_symbol `substr 2))
                                             (prop Environment.definitions quoted_symbol)))))
          
          (defvar set_compiler
              (fn (compiler_function)
                   (do 
                       (= compiler compiler_function)
                       (set_prop Environment.global_ctx.scope
                                 "compiler"
                                 compiler))))
          
          (set_prop Environment
                    `get_global get_global
                    `set_global set_global)
          
          
          ;; In the compiler context, we have access to the existing environment,
          ;; bring the needed functions in and rebuild them in the current scope.
                
          (declare (local lisp_writer)
                   (include reader add_escape_encoding get_outside_global get_object_path 
                            do_deferred_splice safe_access embed_compiled_quote))        
          
          (defvar as_lisp lisp_writer)
          (defvar read_lisp reader)
          
          (set_prop Environment.global_ctx.scope
                    `eval eval_exp
                    `reader reader
                    `add_escape_encoding add_escape_encoding
                    `as_lisp lisp_writer
                    `lisp_writer lisp_writer)
         
          (defvar inlines  (+  {} 
                               (if opts.inlines
                                   opts.inlines
                                   {})
                               {   `pop: (fn (args)
                                             [args.0 "." "pop()"])
                                   `push: (fn (args)
                                              [ args.0 ".push" "(" args.1 ")"])
                                   `chop: (fn (args)
                                              [ args.0 ".substr" "(" 0 "," "(" args.0 ".length" "-" 1 ")" ")" ])
                                   `join: (fn (args)
                                              (if (== args.length 1) 
                                                  [ args.0 ".join" "()"]
                                                  [ args.1 ".join" "(" args.0 ")" ]))
                                   `take: (fn (args)
                                              [ args.0 ".shift" "()" ])
                                   `prepend: (fn (args)
                                                 [ args.0 ".unshift" "(" args.1 ")"])
                                   ;`flatten: (fn (args)
                                    ;             [ args.0 ".flat()"] )
                                   `trim: (fn (args)
                                              [ args.0 ".trim()"])
                                   
                                   `slice: (fn (args)
                                               (cond 
                                                 (== args.length 3)
                                                 [ args.0 ".slice(" args.1 "," args.2 ")"]
                                                 (== args.length 2)
                                                 [ args.0 ".slice(" args.1 ")"]
                                                 else
                                                 (throw SyntaxError "slice requires 2 or 3 arguments")))
                                   `split_by: (fn (args)
                                                  [ args.1 ".split" "(" args.0 ")"])
                                   `bind: (fn (args)
                                              [ args.0 ".bind(" args.1 ")"])
                                   `is_array?: (fn (args)
                                                   [ args.0 " instanceof Array" ])
                                   `is_object?: (fn (args)
                                                    [ args.0 " instanceof Object"])
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
                                                 [args.0 ".slice(0).reverse()"])
                                    
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
                               
                               }))
                           
          (set_prop Environment
                     `eval eval_struct
                     `identify subtype
                     `meta_for_symbol meta_for_symbol
                     `set_compiler set_compiler
                     `read_lisp reader
                     `as_lisp as_lisp
                     `inlines inlines
                     `definitions Environment.definitions
                     `declarations Environment.declarations
                     `compile compile
                     `evaluate evaluate
                     `do_deferred_splice do_deferred_splice
                     `id (fn () id)
                     `set_check_external_env (fn (state)
                                                 (do 
                                                  (= check_external_env_default
                                                     state)
                                                  check_external_env_default))
                     `check_external_env (fn ()
                                             check_external_env_default))
          
          
          (console.log "ENVIRONMENT: ", Environment) 
          ;(bind_function Environment this)
          Environment)))

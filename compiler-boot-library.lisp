
;; Once the Alpha Environment is brought up this file should be imported into it

;; Initial build of environment
;; Build all forms in the starter environment
;; up to random_int

;; add_escape_encoding is used for quoting purposes and providing escaped
;; double quotes to quoted lisp in compiled Javascript

(defglobal `add_escape_encoding 
  (fn (text)
    (if (is_string? text)
        (let
            ((`chars (split_by "" text))
             (`acc []))
            (for_each (`c chars)
               (cond 
                 (and (== (-> c `charCodeAt 0) 34)) 
                 (do 
                    (push acc (String.fromCharCode 92))
                    (push acc c))
                 else
                   (push acc c)))
            (join "" acc))
        text)))
    
    
(defglobal get_outside_global get_outside_global)      
 
;; This function will be executed at the time of the compile of code.
;; if called, it will be called with the arguments in the place of the
;; argument list of the defmacro function.

;; The result of the evaluation is returned to the compiler and used
;; as a replacement for the calling form.

;; Therefore the goal is to return a quoted form that will be spliced
;; into the tree at the point of the original calling form.

;; When this function is called, it will have the values assigned to the
;; values in the let.  

(defglobal defmacro
    (fn (name arg_list `& body)
        (let ;; capture the arguments
            ((macro_name name)
             (macro_args arg_list)
             (macro_body body)
             (source_details 
                         {
                            `eval_when: { `compile_time: true  }
                            `name: (if (starts_with? "=:" name)
                                       (-> name `substr 2)
                                       name)
                            `macro: true
                            `fn_args: (as_lisp macro_args)
                            `fn_body: (add_escape_encoding (as_lisp macro_body))
                          }))
                         
         ;; next run through the steps of registering a macro
         ;; which is essentially a compile time function that 
         ;; transforms the body forms with the provided arguments
         ;; and returns the new form
         (do 
             `(defglobal ,#macro_name 
                  (fn ,#macro_args
                      ,@macro_body)
                  (quote ,#source_details)))))
         {
             `eval_when: { `compile_time: true }
         })
     


(defglobal `read_lisp
    reader)


(defmacro desym (val)
    (let
        ((strip (fn (v)
                    (+ "" (as_lisp v)))))
      (cond 
            (is_string? val)
            (strip val)
            (is_array? val)
            (for_each (`v val)
               (strip v))
            else
            val)))

(defglobal unquotify 
  (fn (val)
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
      


(defmacro when (condition `& mbody) 
     `(if ,#condition
          (do
              ,@mbody)))


(defmacro defexternal (name value meta)
   `(let
       ((symname (desym ,@name)))
    (do 
       (set_prop globalThis
             symname
             ,#value)
       (prop globalThis
             symname))))  
         
(defmacro `defun (name args body meta)
    (let
        ((fn_name name)
         (fn_args args)
         (fn_body body)
         (source_details 
                     (+
                         {
                            `name: (unquotify name)
                            `fn_args: (as_lisp fn_args)
                            `fn_body: (add_escape_encoding (as_lisp fn_body))
                          }
                         (if meta 
                             meta
                             {}))))
     `(do
         (defglobal ,#fn_name
             (fn ,#fn_args
                 ,#fn_body)
              (quote ,#source_details)))))
  

  
(defmacro macroexpand (form)
    (let
       ((macro_name (-> (prop form 0) `substr 2))
        (macro_func (-> Environment `get_global macro_name))
        (expansion (apply macro_func (-> form `slice 1))))
      ((quote quote)
           expansion)))
       


;(defexternal get_outside_global 
 ;            (fn (refname)
  ;                (let
   ;                 ((`fval (new Function "refname"
    ;                   (+ "{ try { if (typeof " refname " === 'undefined') { return undefined } else { return  " refname " } } catch (ex) { return undefined }}"))))
     ;               (fval refname))))
                
(defun `get_object_path (refname)
    (let
        ((`chars (split_by "" refname))
         (`comps [])
         (`mode 0)
         (`name_acc []))
        (for_each (`c chars)
          (do
            (cond
                (and (== c ".")
                     (== mode 0))
                (do 
                    (push comps
                          (join "" name_acc))
                    (= name_acc []))
                (and (== mode 0)
                     (== c "["))
                (do
                   (= mode 1)
                   (push comps
                         (join "" name_acc))
                   (= name_acc []))
                (and (== mode 1)
                     (== c "]"))
                         
                (do
                   (= mode 0)
                   (push comps
                         (join "" name_acc))
                   (= name_acc []))
                else
                (push name_acc c))))
        (if (> (length name_acc) 0)
            (push comps (join "" name_acc)))
        comps))


             


(defun `do_deferred_splice (tree)
    (let
        ((`rval nil)
         (`idx 0)
         (`tval nil)
         (`deferred_operator (join "" [`= `$ `& `!])))
       ;(console.log "do_deferred_splice: ->" (clone tree))
        (cond
            (is_array? tree)
            (do
               (= rval [])
               (while (< idx tree.length)
                 (do
                    (= tval (prop tree idx))
                    (if (== tval deferred_operator)
                        (do 
                            (inc idx)
                            (= tval (prop tree idx))
                            ;(log "got deferred_operator for: " tval)
                            (= rval (-> rval `concat (do_deferred_splice tval))))
                        (push rval (do_deferred_splice tval)))
                    (inc idx)))
                rval)
            (is_object? tree)
            (do 
                (= rval {})
                (for_each (`pset (pairs tree))
                   (do
                       (set_prop rval
                                 pset.0
                                 (do_deferred_splice pset.1))))
               rval)
            else
            tree)))

(defmacro define (`& defs)
    (let
        ((acc [(quote progl)])
         (symname nil))
     
     (for_each (`defset defs)
        (do
            (push acc [(quote defvar) defset.0 defset.1])
            (= symname defset.0)
            (push acc [(quote set_prop) (quote Environment.global_ctx.scope) (+ "" (as_lisp symname)) symname])
            (when (is_object? defset.2)
                  (push acc ([(quote set_prop) (quote Environment.definitions)
                                       (+ "" (as_lisp symname) "")
                                       defset.2])))))
     acc))
 
(defmacro define_env (`& defs)
    (let
        ((acc [(quote progl)])
         (symname nil))
     
     (for_each (`defset defs)
        (do
            (push acc [(quote defvar) defset.0 defset.1])
            (= symname defset.0)
            (push acc [(quote set_prop) (quote Environment.global_ctx.scope) (+ "" (as_lisp symname)) symname])
            (when (is_object? defset.2)
                  (push acc ([(quote set_prop) (quote Environment.definitions)
                                       (+ "" (as_lisp symname) "")
                                       defset.2])))))
     acc))

(defun `type (x)
    (cond
        (== nil x) "null"
        (== undefined x) "undefined"
        (instanceof x Array) "array"
        else
        (typeof x))
    {
        `usage:["value:*"]
        `description: "returns the type of value that has been passed.  Deprecated, and the sub_type function should be used."
        `tags:["types","value","what"]
    })


(defun destructure_list (elems)
      (let
          ((idx 0)
           (acc [])
           (structure elems)
           (follow_tree (fn (elems _path_prefix)
                            (cond
                                (is_array? elems)
                                (map (fn (elem idx)
                                        (follow_tree elem (+ _path_prefix idx)))
                                     elems)
                                (is_object? elems)
                                (for_each (`pset (pairs elems))
                                    (follow_tree pset.1 (+ _path_prefix pset.0)))
                                else ;; not container, simple values record the final path in our acculumlator
                                (push acc _path_prefix)))))
        (follow_tree structure [])
        
        acc))


(defmacro destructuring_bind (bind_vars expression `& forms)
      (let
          ((binding_vars bind_vars)
           (paths (destructure_list binding_vars))
           (bound_expression expression)
           (allocations [])
           (acc [(quote let)]))
          (for_each (`idx (range (length paths)))
             (do 
                 (push allocations 
                    [ (resolve_path (prop paths idx) binding_vars) (cond 
                                                                      (is_object? expression) 
                                                                      (resolve_path (prop paths idx) expression)
                                                                      else
                                                                      (join "." (conj [ expression ] (prop paths idx)))) ])))
          (push acc
                allocations)
          (= acc (conj acc
                       forms))
          acc))
  
  

  
(defglobal defmacro
   (fn (name lambda_list `& forms)
        (let ;; capture the arguments
            ((macro_name name)
             (macro_args lambda_list)
             (macro_body forms)
             (final_form (last forms))
             (macro_meta (if (and (is_object? final_form)
                                  (not (blank? final_form.description))
                                  (not (blank? final_form.usage)))
                             (pop forms)))
             (complex_lambda_list (or_args (for_each (`elem lambda_list)
                                                (> (length (flatten (destructure_list elem))) 0))))
                                     
             (source_details 
                         (+ {
                                `eval_when: { `compile_time: true  }
                                `name: (if (starts_with? "=:" name)
                                           (-> name `substr 2)
                                           name)
                                `macro: true
                                `fn_args: (as_lisp macro_args)
                                `fn_body: (add_escape_encoding (as_lisp macro_body))
                            }
                            (if macro_meta
                                macro_meta
                                {}))))
        
         ;; next run through the steps of registering a macro
         ;; which is essentially a compile time function that 
         ;; transforms the body forms with the provided arguments
         ;; and returns the new form
         ;; add a destructuring_bind if we have a complex lambda list
         
         (if complex_lambda_list
          `(defglobal ,#macro_name 
                  (fn (`& args)
                      (destructuring_bind ,#macro_args 
                                          args
                                          ,@macro_body))
                  (quote ,#source_details))
              
          `(defglobal ,#macro_name 
                  (fn ,#macro_args
                      ,@macro_body)
                  (quote ,#source_details)))))
          
          
    {
        `eval_when: { `compile_time: true }
    })  


;; Build Alpha environment (code below) at this point on bring up, then compile from defmacro above through to the Alpha environment 


(defmacro defun (name lambda_list body meta)
    (let
        ((fn_name name)
         (fn_args lambda_list)
         (fn_body body)
         (fn_meta meta)
         (complex_lambda_list (or_args 
                                   (for_each (`elem lambda_list)
                                        (> (length (flatten (destructure_list elem))) 0))))
                                     
         (source_details 
                     (+
                         {
                            `name: (unquotify name)
                            `fn_args: (as_lisp fn_args)
                            `fn_body: (add_escape_encoding (as_lisp fn_body))
                          }
                         (if fn_meta 
                             (do 
                                 (if fn_meta.description
                                     (set_prop fn_meta
                                               `description
                                                fn_meta.description))
                                  fn_meta)
                             {}))))
    
        (if complex_lambda_list
          `(defglobal ,#fn_name 
                  (fn (`& args)
                      (destructuring_bind ,#fn_args 
                                          args
                                          ,#fn_body))
                  (quote ,#source_details))
         `(defglobal ,#fn_name
             (fn ,#fn_args
                 ,#fn_body)
              (quote ,#source_details))))
    {
     `description: (+ "Defines a top level function in the current environment.  Given a name, lambda_list,"
                      "body, and a meta data description, builds, compiles and installs the function in the"
                      "environment under the provided name.  The body isn't an explicit progn, and must be"
                      "within a block structure, such as progn, let or do.")
     `usage: ["name:string" "lambda_list:array" "body:array" "meta:object"]
     `tags: ["function" "lambda" "define" "environment"]
     
     })
  
(defmacro reduce ((elem item_list) form)
    `(let
        ((__collector [])
         (__result nil)
         (__action (fn (,@elem)
                         ,#form)))
      (declare (function __action))                     
      (for_each (__item ,#item_list)
         (do
             (= __result (__action __item))
             (if __result
                 (push __collector __result))))
      __collector)
  {
      "description":"Provided a first argument as a list which contains a binding variable name and a list, returns a list of all non-null return values that result from the evaluation of the second list."
      "usage":[['binding-elem:symbol','values:list'],["form:list"]]
      `tags: [`filter `remove `select `list `array]
  })
     

(defun is_nil? (`value)
        (== nil value)
        {
        `description: "for the given value x, returns true if x is exactly equal to nil."
        `usage: ["arg:value"]
        `tags: ["type" "condition" "subtype" "value" "what" ]
        })

 (defun is_regex? (x)
       (== (sub_type x) "RegExp")
       {
        `description: "for the given value x, returns true if x is a Javascript regex object"
        `usage: ["arg:value"]
        `tags: ["type" "condition" "subtype" "value" "what" ]
        })
 
(defglobal bind_function bind) 
 
(defmacro is_reference? (val)
  (and (is_string? val)
       (> (length val) 2)
       (starts_with? (quote "=:") val))) 
    
(defun `scan_str (regex search_string)
     (let
        ((`result      nil)
         (`last_result nil)
         (`totals  [])
         (`strs    (+ "" search_string)))
         (if (is_regex? regex)
            (while (and (= result (-> regex `exec strs ))
                        result.0
                        (not (== result.0 last_result.0)))
               (do 
                   (= last_result result)
                   (push totals (to_object
                                (map (fn (v)
                                     [v (prop result v)])
                                 (keys result))))))
            (throw (new ReferenceError (+ "scan_str: invalid RegExp provided: " regex))))
         totals)
        {`description: (+ "Using a provided regex and a search string, performs a regex " 
                          "exec using the provided regex argument on the string argument. " 
                          "Returns an array of results or an empty array, with matched " 
                          "text, index, and any capture groups.")
         `usage:["regex:RegExp" "text:string"]
         `tags:["regex" "string" "match" "exec" "array"] })
     
(defun remove_prop (obj key)
      (when (not (== undefined (prop obj key)))
              (let
                  ((`val (prop obj key)))
                  (delete_prop obj key)
                  val))
       {
         `usage: ["obj:object" "key:*"]
         `description: "Similar to delete, but returns the removed value if the key exists, otherwise returned undefined."
         `tags: ["object" "key" "value" "mutate"]
       })     

(defun object_methods (obj)
    (let
        ((`properties (new Set))
         (`current_obj  obj))
     (while current_obj
        (do
            (map (fn (item)
                     (-> properties `add item))
                 (Object.getOwnPropertyNames current_obj))
            (= current_obj (Object.getPrototypeOf current_obj))))
    (-> (Array.from (-> properties `keys))
        `filter (fn (item)
                    (is_function? item))))
    {
     `description: "Given a instantiated object, get all methods (functions) that the object and it's prototype chain contains."
     `usage: ["obj:object"]
     `tags: [`object `methods `functions `introspection `keys]
     })         
 
(defun expand_dot_accessor (val ctx)
  (let
      ((`comps (split_by "." val))
       (`find_in_ctx (fn (the_ctx)
                         (cond
                           (prop the_ctx.scope reference)
                           (prop the_ctx.scope reference)
                           the_ctx.parent
                           (find_in_ctx the_ctx.parent))))
       (`reference (take comps))
       (`val_type (find_in_ctx ctx))) ;; contains the named reference, comps now will have the path components
    
                                        ;(log "expand_dot_accessor: " val reference val_type comps)
    (cond
      (== 0 comps.length)
      reference
      (and (is_object? val_type)
           (contains? comps.0 (object_methods val_type))
           (not (-> val_type `propertyIsEnumerable comps.0)))
      val  ;; direct reference to a special property
      else 
      (join ""
            (conj [ reference ]
                  (flatten (for_each (`comp comps)
                                     (if (is_number? comp)
                                         [ "[" comp "]" ]
                                         [ "[\"" comp "\"]" ])))))))) 
 
(defun splice_in_return (js_tree _ctx _depth)
    (cond
      (is_array? js_tree)
      (let
          ((`idx 0)
           (`ntree [])
           (`_ctx (or _ctx {}))
           (`next_val nil)
           (`flattened (flatten js_tree)))
         (console.log "splice_in_return: started")
          (for_each (`comp flattened)
             (do 
               (= next_val (prop flattened (+ idx 1)))
               ;(console.log "splice_in_return: " (or _depth 0) "comp:" (clone comp) "next_val: " (clone next_val))
               (cond
                 (is_array? comp)
                 (push ntree (splice_in_return comp _ctx (+ (or _depth 0) 1)))
                  ;; only splice in if the next element isn't a return, throw, or another block
                 (and (is_object? comp)
                      (== comp.mark "rval")
                      (and (not (== "return" next_val))
                           (not (== "throw" next_val))
                           (not (and (is_object? next_val)
                                     (contains? "block" (or next_val.ctype ""))))))
                                                             
                                       
                 (do 
                     ;(console.log "splice_in_return: splicing return at: " comp)
                     (push ntree " ")
                     (push ntree "return")
                     (push ntree " "))
                 else
                 (push ntree comp))
                (inc idx)))
              
          ntree)
      else
      js_tree))

(defun color_for_number (num saturation brightness)
        (common.colorForNumber (Math.abs num) saturation brightness)
        {
            `usage:["number:number" "saturation:float" "brightness:float"]
            `description:"Given an arbitrary integer, a saturation between 0 and 1 and a brightness between 0 and 1, return an RGB color string"
            `tags:["ui" "color" "view"]
        })
 
(defun `flatten_ctx (ctx _var_table)
  (let
      ((`var_table (or _var_table (new Object)))
       (`ctx_keys (keys var_table)))
    (when ctx.scope
      (for_each (`k (keys ctx.scope))
                (when (not (contains? k ctx_keys))
                  (set_prop var_table
                            k
                            (prop ctx.scope k))))
      (when ctx.parent
        (flatten_ctx ctx.parent var_table))
      var_table))) 
             
(defmacro ifa (test thenclause elseclause)
    `(let 
          ((it ,#test))
         (if it ,#thenclause ,#elseclause))
  {
      `description: "Similar to if, the ifa macro is anaphoric in binding, where the it value is defined as the return value of the test form. Use like if, but the it reference is bound within the bodies of the thenclause or elseclause."
      `usage: ["test:*" "thenclause:*" "elseclause:*"]
      `tags: ["cond" "it" "if" "anaphoric"]
  })              
  
(defun identify_symbols (quoted_form _state)
    (let
        ((acc [])
         (_state (if _state
                     _state
                     {
                         
                     })))
        (debug)
        (cond
            (is_array? quoted_form)
            (do
                (for_each (`elem quoted_form)
                   (push acc
                         (identify_symbols elem _state))))
            (and (is_string? quoted_form)
                 (starts_with? "=:" quoted_form))
            (push acc
                 { `name: (as_lisp quoted_form)
                   `where: (describe (as_lisp quoted_form)) })
            (is_object? quoted_form)
            (for_each (`elem (values quoted_form))
                (push acc
                      (identify_symbols elem _state))))
        [(quote quote) acc]))
                       
(defmacro unless (condition `& forms)
    `(if (not ,#condition)
         (do 
             ,@forms))
     {
       `description: "opposite of if, if the condition is false then the forms are evaluated"
       `usage: ["condition:array" "forms:array"]
     })
 
(defun `random_int (`& `args)
       (let
            ((`top 0)
             (`bottom 0))
            (if (> (length args) 1)
                (do 
                    (= top (parseInt args.1))
                    (= bottom (parseInt args.0))
                )
                (= top (parseInt args.0))
            )
            (parseInt (+ (* (Math.random)(- top bottom)) bottom))
       )
       {
           "description":"Returns a random integer between 0 and the argument.  If two arguments are provided then returns an integer between the first argument and the second argument."
           "usage":["arg1:number","arg2?:number"]
           "tags":["rand" "number" "integer" ]
       })

(defun symbol_tree (quoted_form _state _current_path)
    (let
        ((acc [])
         (_state (if _state
                     _state
                     {
                        `symbols:{}
                     }))
         (_current_path (or _current_path [])))
        (declare (array _current_path))
        (cond
            (is_array? quoted_form)
            (do
                (map (fn (elem idx)
                         (do 
                            (ifa (symbol_tree elem _state (+ _current_path idx))
                                 (push acc it))))
                     quoted_form)
                 acc)
            (and (is_string? quoted_form)
                 (starts_with? "=:" quoted_form))
            (do 
                (unquotify quoted_form))
                
                
            (is_object? quoted_form)
            (do (for_each (`pset (pairs quoted_form))
                    (ifa (symbol_tree pset.1 _state (+ _current_path [ pset.1 ]))
                         (push acc it)))
                acc)))
    {
        `description: "Given a quoted form as input, isolates the symbols of the form in a tree structure so dependencies can be seen."
        `usage: ["quoted_form:quote"]
        `tags: ["structure" "development" "analysis"]
    })  

(defun resolve_multi_path (path obj not_found)
  (do 
      (debug)
    (cond
    (is_object? obj)
    (cond
      
      (and (== (length path) 1)
          (== "*" (first path)))
	  (or obj
	      not_found)
	  (== (length path) 1)
      (or (prop obj (first path))
           not_found)
      (and (is_array? obj)
           (== "*" (first path)))
      (for_each (val obj)
         (resolve_multi_path (rest path) val not_found))
     
	  (and (is_object? obj)
	       (== "*" (first path)))
	  (for_each (val (values obj))
	    (resolve_multi_path (rest path) val not_found))
	  
	  
	  
	  (> (length path) 1)
	  (resolve_multi_path (rest path) (prop obj (first path)) not_found))
	 else
	 not_found))
   {
       `tags: ["path" "wildcard" "tree" "structure"]
       `usage:["path:array" "obj:object" "not_found:?*"]
       `description:  "Given a list containing a path to a value in a nested array, return the value at the given path. If the value * is in the path, the path value is a wild card if the passed object structure at the path position is a vector or list."
   })

(defun except_nil (`items)
        (do 
            (defvar `acc [])           
            (if (not (eq (sub_type items) "array"))
                (setq items (list items))
            )
            (for_each (`value items)
                  (if (not (eq nil value))
                      (push acc value)))
            acc)
                        
        {
         "description":"Takes the passed list or set and returns a new list that doesn't contain any undefined or nil values.  Unlike no_empties, false values and blank strings will pass through."
         "usage":["items:list|set"]
         "tags": ["filter" "nil" "undefined" "remove" "no_empties"]
        }
    )

(defun each (items property)
       (cond 
           (eq (sub_type property) `String)
               (except_nil
                   (for_each (`item (or items []))
                     (do 
                         (when item 
                               (prop item property)))))
         
           (eq (sub_type property) `array)
               (reduce (`item items)
                 (do 
                    (defvar `nl []) 
                    (for_each (`p property)
                        (cond 
                            (is_array? p)
                            (push nl (resolve_path p item))
                            (is_function? p)
                            (push nl (p item))
                            else
                            (push nl (prop item p)))
                    )
                    nl
                 )
               )
            (eq (sub_type property) `AsyncFunction)
                (reduce (`item items)
                 (property item))
            
            (eq (sub_type property) `Function)
                (reduce (`item items)
                 (property item))
             
           else
             (throw Error "each: strings, arrays, and functions can be provided for the property name or names to extract")
       )
       {
           `description: (+ "Provided a list of items, provide a property name or " 
                            "a list of property names to be extracted and returned from the source array as a new list."
                            "If property is an array, and contains values that are arrays, those arrays will be treated as a path.")
           `usage: ["items:list" "property:string|list|function|AsyncFunction"]
           `tags: ["pluck" "element" "only" "list" "object" "property"]
       }
    )

(defun replace (`& args)
    (if (< args.length 3)
        (throw SyntaxError "Invalid syntax for replace: requires at least three arguments, target value or regex, the replacement value, and at least one value (object list or string)")
        (try
            (let
                ((target args.0)
                 (replacement args.1)
                 (work_values (slice args 2))
                 (value_type nil)
                 (sr_val nil)
                 (arg_value_type (subtype args.2))
                 (rval []))
             (for_each (value work_values)
                (do
                   (= value_type (subtype value))
                   (when (== value_type `number)
                      (= value_type `string)
                      (= value (+ "" value)))
                   (cond
                       (== value_type `string)
                       (push rval (-> value `replace target replacement))
                       
                       (== value_type `array)
                       (for_each (`elem value)
                          (push rval
                                (replace target replacement elem)))
                       
                       (== value_type `object)
                       (do
                           (= sr_val {})
                           (for_each (`k (keys value))
                               (when (-> value `hasOwnProperty k)
                                  (set_prop sr_val
                                            k
                                            (replace target replacement (prop value k)))))
                           (= rval (-> rval `concat sr_val))))))
             (if (and (not (== arg_value_type `array))
                      (not (== arg_value_type `object)))
                 (first rval)
                 rval))
             (catch Error (`e)
                    (console.error (+ "replace: " e))))))

(defun cl_encode_string (text)
  (if (is_string? text)
      (let
          ((`escaped (replace (new RegExp "\n" `g) 
                              (+ (String.fromCharCode 92) "n") text))
           (`nq (split_by (String.fromCharCode 34) escaped))
           (`step1 (join (+ (String.fromCharCode 92) (String.fromCharCode 34)) nq))
           (`snq (split_by (String.fromCharCode 39) step1)))
          ;(join (+ (String.fromCharCode 92) (String.fromCharCode 39)) snq))
         step1)
      text))

(defun `path_to_js_syntax (comps)
    (if (is_array? comps)
        (if (> comps.length 1)
            (join ""     
                  (map (fn (comp idx)
                           (if (== idx 0)
                               comp
                               (cond
                                   (and (isNaN (int comp))
                                        (starts_with? "\"" comp))
                                   (+ "[" comp "]")
                                   (isNaN (int comp))
                                   (+ "." comp)
                                   else
                                   (+ "[" "'" comp "'" "]"))))
                                   
                              ; (+ "[" (if (isNaN (int comp))
                               ;           (+ "'" comp "'")
                                ;          comp) "]")))
                       comps))
            comps.0)
        (throw TypeError (+ "path_to_js_syntax: need array - given " (sub_type comps)))))





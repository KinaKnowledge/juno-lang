
;; Once the Alpha Environment is brought up this file should be imported into it

;; Initial build of environment
;; Build all forms in the starter environment
;; up to random_int

;; add_escape_encoding is used for quoting purposes and providing escaped
;; double quotes to quoted lisp in compiled Javascript


(do
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

(defglobal true? check_true)

   
         

(defglobal if_compile_time_defined 
    (fn (quoted_symbol exists_form not_exists_form)
        (if (== (prop (describe quoted_symbol)
                      `location)
                   nil)
           not_exists_form
           exists_form))
     {
         `description: "If the provided quoted symbol is a defined symbol at compilation time, the exists_form will be compiled, otherwise the not_exists_form will be compiled."
         `tags: ["compile" "defined" "global" "symbol" "reference"]
         `usage:["quoted_symbol:string" "exists_form:*" "not_exists_form:*"]
         `eval_when:{ `compile_time: true }
     })
       

;; Convenience function with embedded quoting for the compiler

(defglobal embed_compiled_quote  
  (fn (type tmp_name tval)
    (cond
        (== type 0)
        [(quote "=:(") (quote "=:let") (quote "=:(") (quote "=:(")  tmp_name (+  (quote "=:") (as_lisp tval)) (quote "=:)") (quote "=:)") (+ (quote "=:") tmp_name) ]
        (== type 1)
        [ (quote "=$&!") (quote "=:'") (quote "=:+") (quote "=:await") (quote "=:Environment.as_lisp")  (quote "=:(")  tval (quote "=:)") (quote "=:+") (quote "=:'") ]
        (== type 2)
        [(quote "=:(") (quote "=:let") (quote "=:(") (quote "=:(")  tmp_name (+  (quote "=:") (as_lisp tval)) (quote "=:)") (quote "=:)") (+ (quote "=:") tmp_name) ]
        (== type 3)
        [(quote "=:'") (quote "=:+") (quote "=:await") (quote "=:Environment.as_lisp") (quote "=:(") tval (quote "=:)") (quote "=:+") (quote "=:'") ]
        (== type 4)
        (quote "=:)"))))
     
     

 
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
                            ;`fn_body: (as_lisp macro_body)
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
        
(defmacro desym_ref (val)
   `(+ "" (as_lisp ,#val)))
 


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
                            ;`fn_body: (add_escape_encoding (as_lisp fn_body))
                          }
                         (if meta 
                             meta
                             {}))))
     `(do
         (defglobal ,#fn_name
             (fn ,#fn_args
                 ,#fn_body)
              (quote ,#source_details)))))
  
(defun macroexpand (quoted_form)
    (let
       ((macro_name (-> quoted_form.0 `substr 2))
        (macro_func (-> Environment `get_global macro_name))
        (expansion (if (is_function? macro_func)
                       (apply macro_func (-> quoted_form `slice 1))
                       quoted_form)))
    expansion)
   {
     `description: "Given a quoted form, will perform the macro expansion and return the expanded form."
     `usage: ["quoted_form:*"]
     `tags:["macro" "expansion" "debug" "compile" "compilation"]
   })
  
(defmacro macroexpand_nq (form)
    (let
       ((macro_name (-> (prop form 0) `substr 2))
        (macro_func (-> Environment `get_global macro_name))
        (expansion (if (is_function? macro_func)
                       (apply macro_func (-> form `slice 1))
                       form)))
      ((quote quote)
           expansion)))
       

(defmacro check_type (thing type_name error_string)
    (if error_string
        `(if (not (== (sub_type ,#thing) ,#type_name))
             (throw TypeError ,#error_string))
        `(if (not (== (sub_type ,#thing) ,#type_name))
             (throw TypeError (+ "invalid type: required " ,#type_name " but got " (sub_type ,#thing)))))
    {
     `description: "If the type of thing (ascertained by sub_type) are not of the type type_name, will throw a TypeError with the optional error_string as the error message."
     `usage:["thing:*" "type_name:string" "error_string:string"]
     `tags:["types" "validation" "type" "assert"]
     })
         

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
        (declare (include length))
                 
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
     acc)
   {
    `usage: ["declaration:array" "declaration:array*"]
    `description: (+ "Given 1 or more declarations in the form of (symbol value ?metadata), " 
                     "creates a symbol in global scope referencing the provided value.  If a "
                     "metadata object is provided, this is stored as a the symbol's metadata.")
    `tags: ["symbol" "reference" "definition" "metadata" "environment"]
                     
    })
 
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
                                ;`fn_body: (as_lisp macro_body)
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
                            ;`fn_body: (as_lisp fn_body)
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
  `(and (is_string? ,#val)
       (> (length ,#val) 2)
       (starts_with? (quote "=:") ,#val))) 
    
(defun `scan_str (regex search_string)
     (let
        ((`result      nil)
         (`last_result nil)
         (`totals  [])
         (`strs    (+ "" search_string)))
         (if (is_regex? regex)
            (do 
                (= regex.lastIndex 0)
                (while (and (do 
                               (= result (-> regex `exec strs ))
                                true)
                             result
                            (if last_result
                                (not (== result.0 last_result.0))
                                true))
               (do 
                   (= last_result result)
                   (push totals (to_object
                                (map (fn (v)
                                     [v (prop result v)])
                                 (keys result)))))))
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
 







(defun getf_ctx (ctx name _value)
    (if (and ctx (is_string? name))
        (cond
           (not (== undefined (prop ctx.scope name)))
           (if (not (== _value undefined))
               (do 
                   (set_prop ctx.scope
                             name
                             _value)
                   _value)
               (prop ctx.scope name))
           ctx.parent
           (getf_ctx ctx.parent name _value)
           else
           undefined)
       (throw "invalid call to get_ctx: missing argument/s")))

(defun setf_ctx (ctx name value)
    (let
        ((`found_val (getf_ctx ctx name value)))
        (if (== found_val undefined)
            (set_prop ctx.scope
                      name
                      value))
        value))
                  
        
(defun set_path (path obj value)
    (let
        ((`fpath (clone path))
         (`idx (pop fpath))
         (`rpath fpath)
         (`target_obj nil))
     (= target_obj (resolve_path rpath obj))
     ;(console.log "set_path: " rpath "target: " target_obj " idx: " idx (prop target_obj idx))
     (if target_obj
         (do (set_prop target_obj
                   idx
                   value))
             ;(console.log "set_path: value set: " (resolve_path path obj)))
         (throw RangeError (+ "set_path: invalid path: " path)))))

(defun minmax (container)
    (let
       ((value_found false)
        (smallest MAX_SAFE_INTEGER)
        (biggest (* -1 MAX_SAFE_INTEGER)))
       (if (and container (is_array? container) (> (length container) 0))
          (do 
              (for_each (`value container)
                (and (is_number? value) 
                  (do 
                    (= value_found true)
                    (= smallest (Math.min value smallest))
                    (= biggest (Math.max value biggest)))))
              (if value_found [ smallest biggest] 
                  nil))
          nil)
        ))


(defun gen_multiples (len multiple?)
  (let
      ((`val 100)
       (`acc [val])
       (`mult (or multiple? 10)))
     (for_each (`r (range len))
        (push acc (= val (* val mult))))
    (reverse acc)))

(defun path_multiply (path multiple?)
  (let
      ((`acc 0)
       (`multiples (gen_multiples (length path) multiple?)))
      (for_each (`pset (pairs (interlace path multiples)))
          (= acc (+ acc (* pset.0 pset.1))))
      acc))
  
(defglobal splice_in_return_a 
  (fn (js_tree _ctx _depth _path)
  (cond
     (is_array? js_tree)
     (let
         ((`idx -1)
          (`ntree [])
          (`_depth (or _depth 0))
          (`_path (or _path []))
          (`root _path)
          (`if_links {})
          (`function_block? (if (== _depth 0)
                                true
                                false))
          (`last_path nil)
          (`new_ctx (fn (ctx)
                        {
                          `parent: ctx 
                          `scope:{
                              `level:(if ctx.scope.level
                                         (+ ctx.scope.level 1)
                                         0)
                              `viable_return_points: []
                              `base_path: (clone _path)
                              `potential_return_points: []
                              `return_found: false
                              `if_links: {}
                          }
                        }))
          (`_ctx (or _ctx (new_ctx nil)))
          (`splice_log (defclog { `prefix:(+ "splice_return [" _ctx.scope.level "]") `color: "black" `background: "#20F0F0"  }))
          (`next_val nil))
     
      
         
      ;(if (== _depth 0)
      ;    (splice_log "->" (clone js_tree)))
      
      (for_each (`comp js_tree)
          (do
              (inc idx)
              (= last_path (conj _path [idx]))
              (cond
                  (is_array? comp)
                  (push ntree (splice_in_return_a comp _ctx (+ _depth 1) (conj _path [idx])))
                  (or (is_string? comp)
                      (is_number? comp)
                      (is_function? comp))
                  (push ntree comp)
                  (is_object? comp)
                  (cond
                    (is_function? comp.ctype)
                    (do 
                        ;(splice_log "FUNCTION TYPE: " comp.ctype)
                        (push ntree comp))
                    (or (== comp.ctype "AsyncFunction")
                        (== comp.ctype "Function"))
                    (do 
                        (= _path  [])
                        (= _ctx (new_ctx _ctx))
                        (= function_block? true)
                        ;(splice_log "start return point encountered: " comp (getf_ctx _ctx `base_path))
                        
                        (push ntree comp))
                        
                    (== comp.mark "rval")
                    (do 
                        ;(splice_log "potential return: " (getf_ctx _ctx `level) "if_id: " comp.if_id comp (conj _path [idx]) (clone (slice js_tree idx)))
                        (push (getf_ctx _ctx `potential_return_points)
                                        {
                                          `path: (conj _path [idx])
                                          `type: comp.mark
                                          `block_step: comp.block_step
                                          `if_id: comp.if_id
                                          `source: (JSON.stringify (clone (slice js_tree idx)))
                                          `lambda_step: comp.lambda_step
                                         } )
                        (when (and comp.if_id 
                                   (eq nil (prop (getf_ctx _ctx `if_links) comp.if_id)))
                            (set_prop (getf_ctx _ctx `if_links)
                                      comp.if_id
                                      []))
                        (when comp.if_id
                              (push (prop (getf_ctx _ctx `if_links) comp.if_id)
                                    (last (getf_ctx _ctx `potential_return_points))))
                        (push ntree comp))
                    (== comp.mark "forced_return")
                    (do 
                        (push (getf_ctx _ctx `viable_return_points)
                              {
                                `path: (conj _path [idx])
                                `if_id: comp.if_id
                                `block_step: comp.block_step
                                `lambda_step: comp.lambda_step
                                `source: (JSON.stringify (clone (slice js_tree idx)))
                                `type: comp.mark
                               })
                        ;(splice_log "force_return: at level:" (getf_ctx _ctx `level) "if_id: " comp.if_id comp (conj _path [idx]) (clone (slice js_tree idx)))
                        (when (and comp.if_id 
                                   (eq nil (prop (getf_ctx _ctx `if_links) comp.if_id)))
                            (set_prop (getf_ctx _ctx `if_links)
                                      comp.if_id
                                      []))
                        (when comp.if_id
                              (push (prop (getf_ctx _ctx `if_links) comp.if_id)
                                    (last (getf_ctx _ctx `viable_return_points))))
                        (push ntree comp))
                    (== comp.mark "final-return")
                    (do 
                        ;(splice_log "final block return for level:" (getf_ctx _ctx `level) "if_id: " comp.if_id comp (conj _path [idx]) (clone (slice js_tree idx)))
                        (push (getf_ctx _ctx `viable_return_points)
                              {
                                `path: (conj _path [idx])
                                `type: comp.mark
                                `lambda_step: comp.lambda_step
                                `block_step: comp.block_step
                                `source: (JSON.stringify (clone (slice js_tree idx)))
                                `if_id: comp.if_id
                               })
                        (when (and comp.if_id 
                                   (eq nil (prop (getf_ctx _ctx `if_links) comp.if_id)))
                            (set_prop (getf_ctx _ctx `if_links)
                                      comp.if_id
                                      []))
                        (when comp.if_id
                              (push (prop (getf_ctx _ctx `if_links) comp.if_id)
                                    (last (getf_ctx _ctx `viable_return_points)))
                              (push (getf_ctx _ctx `potential_return_points)
                              {
                                `path: (conj _path [idx])
                                `type: comp.mark
                                `lambda_step: comp.lambda_step
                                `block_step: comp.block_step
                                `source: (JSON.stringify (clone (slice js_tree idx)))
                                `if_id: comp.if_id
                               }))
                        (setf_ctx _ctx `return_found true)
                        (push ntree comp))
                    else
                    (push ntree comp))
                  else
                  (push ntree comp))))
      (when function_block?
           (let
               ((`viables (reverse (or (getf_ctx _ctx `viable_return_points) [])))
                (`potentials (reverse (or (getf_ctx _ctx `potential_return_points) [])))
                (`base_path (getf_ctx _ctx `base_path))
                (`base_addr nil)
                (`final_viable_path (and viables
                                         (first viables)
                                         (prop (first viables) `path)))
                (`max_viable 0)
                (`plength 0)
                (`if_paths [])
                (`max_path_segment_length nil)
                (`final_return_found (getf_ctx _ctx `return_found)))
                
              ;(splice_log "<return must be by here> found?" final_return_found "level: "  _ctx.scope.level "root: " root  "base_path: " base_path "last_path: " last_path)
              ;(splice_log "viable_return_points: " (clone viables))
              ;(splice_log "potential_return_points: " (clone potentials))
              ;(splice_log "tree to operate on: " (clone js_tree))
              ;(splice_log "if_links: " (clone (getf_ctx _ctx `if_links)))
              ;; we do change the indices because we will replace the marker objects
              ;; rule: for all viables, insert return statement at point of path
              ;; rule: for all potentials, ONLY if NO viables, insert return point
            
              (for_each (`v viables)
                 (do 
                     (set_path v.path ntree { `mark: "return_point" } )
                     
                     ;(splice_log "set viable: " (clone (resolve_path (chop v.path) ntree)))
                     ))
            
              
             ;(splice_log "removing potentials: base_path: " base_path "max_viable: " max_viable (length final_viable_path) final_viable_path)
             
              (for_each (`p potentials)
                 (do 
                     (= plength (Math.min (length p.path) (length final_viable_path)))
                     (defvar `ppath (slice p.path 0 plength))
                     (defvar `vpath (if final_viable_path 
                                        (slice final_viable_path 0 plength)
                                        []))
                     (= max_path_segment_length (Math.max 8
                                                          (+ 1 (prop (minmax ppath) 1))
                                                          (+ 1 (prop (minmax vpath) 1))))
                     ;(splice_log p "max_path_segment_length: " max_path_segment_length "ppath: " ppath " vpath: " vpath 
                      ;           (path_multiply ppath max_path_segment_length) ">" (path_multiply vpath max_path_segment_length)
                       ;          (> (path_multiply ppath max_path_segment_length) (path_multiply vpath max_path_segment_length)))
                     (if (or (> (path_multiply ppath max_path_segment_length)
                                (path_multiply vpath max_path_segment_length))
                             (and (== p.block_step 0)
                                  (== p.lambda_step 0))
                             (== 0 (length viables)))
                        (do 
                            ;(splice_log "set potential to return at" ppath "versus final viable: " vpath p.if_id)
                            (set_path p.path ntree { `mark: "return_point" })
                            (when (and p.if_id
                                       (prop (getf_ctx _ctx `if_links) p.if_id))
                                  (for_each (`pinfo (prop (getf_ctx _ctx `if_links) p.if_id))
                                     (do
                                       (when (== undefined (prop if_paths (as_lisp pinfo.path)))
                                         (set_prop if_paths (as_lisp pinfo.path) true)
                                         (set_path pinfo.path ntree { `mark: "return_point" } )
                                         ;(splice_log "if adjust on: " pinfo.if_id pinfo.path pinfo)
                                         )))
                                  ))
                         (do 
                           (when (and (== undefined (prop if_paths (as_lisp p.path)))
                                      (not (== p.type "final-return")))
                                (set_path p.path ntree { `mark: "ignore" } )
                                ;(splice_log "if adjust off: " p.if_id p.path p)
                                )))
                     ))
           ))
              
          
      ;(if (== _depth 0)
      ;    (splice_log "<-" (clone ntree)))
      
      
      ntree)
     else
     js_tree)))
                  
(defun splice_in_return_b (js_tree _ctx _depth)
    (cond
      (is_array? js_tree)
      (let
          ((`idx 0)
           (`ntree [])
           (`_ctx (or _ctx {}))
           (`next_val nil)
           (`flattened (flatten js_tree)))
         ;(console.log "splice_in_return_b (fixed): started" (clone js_tree))
          (for_each (`comp flattened)
             (do 
               (= next_val (prop flattened (+ idx 1)))
               ;(console.log "splice_in_return: " (or _depth 0) "comp:" (clone comp) "next_val: " (clone next_val))
               (cond
                 (is_array? comp)
                 (push ntree (splice_in_return_b comp _ctx (+ (or _depth 0) 1)))
                  ;; only splice in if the next element isn't a return, throw, or another block
                 (and (is_object? comp)
                      (== comp.mark "return_point")
                      (and (not (== "return" next_val))
                           (not (== "throw" next_val))
                           (not (== "yield" next_val))
                           (not (and (is_object? next_val)
                                     (is_string? next_val.ctype)
                                     (contains? "block" (or next_val.ctype ""))))))
                                                             
                                       
                 (do 
                     ;(console.log "splice_in_return_b: splicing return at: " comp idx (prop flattened (- idx 1)) (prop flattened (+ idx 1)))
                     (push ntree " ")
                     (push ntree "return")
                     (push ntree " "))
                 else
                 (push ntree comp))
                (inc idx)))
              
          ntree)
      else
      js_tree))                       
       
(defun map_range (n from_range to_range)
            (+ to_range.0
               (* (/ (- n from_range.0)
                     (- from_range.1 from_range.0))
                  (- to_range.1 to_range.0)))
        { `usage: ["n:number" "from_range:array" "to_range:array"]
          `tags:  ["range" "scale" "conversion"]
          `description: (+ "Given an initial number n, and two numeric ranges, maps n from the first range " 
                           "to the second range, returning the value of n as scaled into the second range. ") })

(defglobal HSV_to_RGB (new Function "h, s, v" "{
        var r, g, b, i, f, p, q, t;
        if (arguments.length === 1) {
            s = h.s, v = h.v, h = h.h;
        }
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        }
    }"))

(defun color_for_number (num saturation brightness)
    (let
        ((h (Math.abs (parseInt num)))
         (pos (% 8 h))
         (color_key [0 4 1 5 2 6 3 7])
         (rgb nil)
         (v (prop color_key pos)))
       (declare (number v h)
                (object rgb))
       (= h (map_range (% 360 (* 28 h)) [0 360] [0.0 1.0]))
       (= v (map_range (v [0 7] [0.92 1])))
       (= rgb (HSV_to_RGB h saturation brightness))
       (+ "#" (-> (-> rgb.r `toString 16) `padStart 2 "0")
              (-> (-> rgb.g `toString 16) `padStart 2 "0")
              (-> (-> rgb.b `toString 16) `padStart 2 "0")))
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
 
(defun random_int (`& `args)
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


(defun resolve_multi_path (path obj not_found)
  (do 
    ;(console.log "path: " path " obj: " obj)
    (cond
    (is_object? obj)
    (cond
      (and (== (length path) 1)
          (== "*" (first path)))
	  (or obj
	      not_found)
	  (and (== (length path) 1)
	       (is_object? (prop obj (first path))))
      (or (prop obj (first path))
           not_found)
      (and (== (length path) 1)
           (not (is_object? (prop obj (first path))))
           (not (eq nil (prop obj (first path)))))
      (prop obj (first path))
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

(defun symbol_tree (quoted_form _state _current_path )
    (let
        ((acc [])
         (allocators {
                `let: [[1 `* 0]]
                `defun: [[1] [2 `*]]
                })
         (uop nil)
         (get_allocations (fn ()
                             (do
                              (= sym_paths (prop allocators (unquotify quoted_form.0)))
                              (when sym_paths
                                 (for_each (sym_path sym_paths)
                                    (do
                                        (= fval (resolve_multi_path sym_path quoted_form))
                                        (console.log "Fval is: " fval "sym_path: " sym_path "current_path: " _current_path " " quoted_form)
                                        (= uop (unquotify quoted_form.0))
                                        (if (is_array? fval)
                                          (for_each (`s fval)
                                            (do
                                              (= s (unquotify s))
                                              (when (eq nil (prop _state.definitions fval))
                                                    (set_prop _state.definitions
                                                              s
                                                              []))
                                              (push (prop _state.definitions s)
                                                   { `path: _current_path `op: uop })))
                                           (do 
                                               (when (eq nil (prop _state.definitions fval))
                                                    (set_prop _state.definitions
                                                              fval
                                                              []))
                                               (push (prop _state.definitions fval)
                                                     { `path: _current_path `op: uop })))))))))
         (idx -1)
         (fval nil)
         (sym_paths nil)
         (is_root (if (eq _state undefined)
                      true
                      false))
         (_state (if _state
                     _state
                     {
                        `definitions:{}
                     }))
         (_current_path (or _current_path [])))
        (declare (array _current_path))
        (console.log "symbol_tree: quoted_form: " quoted_form _current_path)
        (get_allocations)
        (cond
            (is_array? quoted_form)
            (do
                (map (fn (elem idx)
                         (do 
                            (ifa (symbol_tree elem _state (conj  _current_path idx))
                                 (push acc it))))
                     quoted_form)
                 (if is_root 
                     (+ { `tree: acc }
                        _state)
                     acc))
            (and (is_string? quoted_form)
                 (starts_with? "=:" quoted_form))
            (do 
                (unquotify quoted_form))
                
                
            (is_object? quoted_form)
            (do 
                (for_each (`pset (pairs quoted_form))
                    (ifa (symbol_tree pset.1 _state (conj _current_path [ pset.1 ]))
                         (push acc it)))
                (if is_root 
                     (+ { `tree: acc }
                        _state)
                     acc))))
    {
        `description: "Given a quoted form as input, isolates the symbols of the form in a tree structure so dependencies can be seen."
        `usage: ["quoted_form:quote"]
        `tags: ["structure" "development" "analysis"]
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
           (or (is_string? property)
               (is_number? property))
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
                            (push nl (prop item p))))
                    nl))
            (eq (sub_type property) `AsyncFunction)
                (reduce (`item items)
                 (property item))
            
            (eq (sub_type property) `Function)
                (reduce (`item items)
                 (property item))
             
           else
             (throw TypeError (+ "each: strings, arrays, and functions can be provided for the property name or names to extract - received: " (sub_type property))))
       {
           `description: (+ "Provided a list of items, provide a property name or " 
                            "a list of property names to be extracted and returned from the source array as a new list."
                            "If property is an array, and contains values that are arrays, those arrays will be treated as a path.")
           `usage: ["items:list" "property:string|list|function|AsyncFunction"]
           `tags: ["pluck" "element" "only" "list" "object" "property"]
       })

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
                   (when (== value_type `Number)
                      (= value_type `String)
                      (= value (+ "" value)))
                   (cond
                       (== value_type `String)
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
           (`escaped (replace (new RegExp "\r" `g) 
                              (+ (String.fromCharCode 92) "r") escaped))
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

(defun first_is_upper_case? (str_val)
    (progn
       (defvar rval (-> str_val `match (new RegExp "^[A-Z]")))
       (if (and rval rval.0)
           true
           false)))
       
(defun safe_access_2 (token ctx sanitizer_fn)
    (let
        ((comps nil)
         (acc [])
         (acc_full [])
         (pos nil)
         (rval nil))
     (= comps (split_by "." token.name))
     (if (== comps.length 1)
         token.name
         (do 
             ;(debug)
             (set_prop comps
                       0
                       (sanitizer_fn comps.0))
             (while (> comps.length 0)
                (do 
                    (push acc
                          (take comps))
                    (if (> comps.length 0)
                        (push acc_full
                              (join "" ["check_true(" (expand_dot_accessor (join "." acc) ctx) ")"]))
                        (push acc_full
                          (expand_dot_accessor (join "." acc) ctx)))))
                          
             (= rval (flatten ["(" (join " && " acc_full) ")" ]))
             rval))))

(defun safe_access(token ctx sanitizer_fn)
    (let
        ((comps nil)
         (acc [])
         (acc_full [])
         (pos nil)
         (rval nil))
     (= comps (split_by "." token.name))
     (if (== comps.length 1)
         token.name
         (do 
             ;(debug)
             (set_prop comps
                       0
                       (sanitizer_fn comps.0))
             (while (> comps.length 0)
                (do 
                    (push acc
                          (take comps))
                    (push acc_full
                          (expand_dot_accessor (join "." acc) ctx))))
             (= rval (flatten ["(" (join " && " acc_full) ")" ]))
             rval))))

(defmacro compile_to_js (quoted_form) 
    `(-> Environment `compile ,#quoted_form)
    {
        `description: (+ "Given a quoted form, returns an array with two elements, element 0 is the compilation metadata, "
                         "and element 1 is the output Javascript as a string.")
        `usage: ["quoted_form:*"]
        `tags: ["compilation" "source" "javascript" "environment"]
    })

(defmacro `evaluate_compiled_source (compiled_source)
 `(-> Environment `evaluate ,#compiled_source nil { `compiled_source: true })
     {
         `description:(+ "The macro evaluate_compiled_source takes the direct output of the compiler, "
                         "which can be captured using the macro compile_to_js, and performs the "
                         "evaluation of the compiled source, thereby handling the second half of the "
                         "compile then evaluate cycle.  This call will return the results of "
                         "the evaluation of the compiled code assembly.")
         `usage: ["compiled_souce:array"]
         `tags: ["compilation" "compile" "eval" "pre-compilation"] })
     
(defun form_structure (quoted_form max_depth)
      (let
          ((idx 0)
           (acc [])
           (max_depth (or max_depth MAX_SAFE_INTEGER))
           (structure quoted_form)
           (follow_tree (fn (elems acc _depth)
                            (cond
                                (and (or (is_array? elems)
                                         (is_object? elems))
                                     (>= _depth max_depth))
                                (if (is_array? elems)
                                    `array
                                    `object)
                                (is_array? elems)
                                (map (fn (elem idx)
                                                   (follow_tree elem [] (+ _depth 1)))
                                               elems)
                                
                                (is_object? elems)
                                (do 
                                  (for_each (`pset (pairs elems))
                                        (follow_tree pset.1 [] (+ _depth 1))))
                                   
                                else ;; not container, simple values record the final path in our acculumlator
                                (cond
                                   (and (is_string? elems)
                                        (starts_with? "=:" elems))
                                   `symbol
                                   (is_number? elems)
                                   `number
                                   (is_string? elems)
                                   `string
                                   (or (== elems true)
                                       (== elems false))
                                   `boolean
                                   else
                                   elems)))))
        (follow_tree structure [] 0))
    {
     `description: (+ "Given a form and an optional max_depth positive number, " 
                      "traverses the passed JSON form and produces a nested array structure that contains"
                      "the contents of the form classified as either a \"symbol\", \"number\", \"string\", \"boolean\", \"array\", \"object\", or the elem itself. "
                      "The returned structure will mirror the passed structure in form, except with the leaf contents "
                      "being replaced with generalized categorizations.")
     `tags: ["validation" "compilation" "structure"]
     `usage: ["quoted_form:*" "max_depth:?number"]
     })



(defun validate_form_structure (validation_rules quoted_form)
    (let
        ((results {
                  `valid: []
                  `invalid: []
                  `rule_count: (length validation_rules)
                  `all_passed: false
                   })
         (`all_valid nil)
         (target nil))
        (for_each (`rule (or validation_rules []))
          (do
           (when (and (is_array? rule)
                     (> rule.length 1)
                     (is_array? rule.0)
                     (is_array? rule.1))
              (= all_valid true)
              (= target (resolve_path rule.0 quoted_form))
              (for_each (`validation rule.1)
                  (when (not (validation target))
                      (= all_valid false)
                      (break)))
              (if all_valid
                  (push results.valid
                        (or rule.2 rule.0))
                  (push results.invalid
                        (or rule.2 rule.0))))))
      (set_prop results
                `all_passed
                (== (length results.valid) results.rule_count))
      results)
  {
    `description: (+ "Given a validation rule structure and a quoted form to analyze returns an object with "
                     "two keys, valid and invalid, which are arrays containing the outcome of the rule "
                     "evaluation, a rule_count key containing the total rules passed, and an all_passed key"
                     "which will be set to true if all rules passed, otherwise it will fail."
                     "If the rule evaluates successfully, valid is populated with the rule path, " 
                     "otherwise the rule path is placed in the invalid array.<br><br>"
                     "Rule structure is as follows:<br><code>"
                     "[ [path [validation validation ...] \"rule_name\"] [path [validation ...] \"rule_name\"] ]<br>"
                     "</code>"
                     "where path is an array with the index path and "
                     "validation is a single argument lambda (fn (v) v) that must either " 
                     "return true or false. If true, the validation is considered correct, " 
                     "false for incorrect.  The result of the rule application will be put in the valid array, " 
                     "otherwise the result will be put in invalid.")
    `tags: ["validation" "rules" "form" "structure"]
    `usage: ["validation_rules:array" "quoted_form:*"]
      })


(defglobal *compiler_syntax_rules* 
     { 
      `compile_let:  [ [[0 1 `val] (list is_array?) "let allocation section"]
                       [[0 2] (list (fn (v) (not (== v undefined)))) "let missing block"]]
      `compile_cond: [ [[0] (list (fn (v) (== (% (length (rest v)) 2) 0))) "cond: odd number of arguments" ]]
      })

(defun compiler_source_chain (cpath tree sources)
      (if (and (is_array? cpath)
               tree)
          (let
              ((sources (or sources []))
               (source nil))
            (= cpath (chop cpath))
            (= source (as_lisp (resolve_path cpath tree)))
            (if (> source.length 80)
                (= source (+ (-> source `substr 0 80) "...")))
            ;(console.log "compiler_source_chain: cpath: " cpath "source: " source "tree: " tree sources)
            (when (not (blank? source))
              (push sources source))
            (if (and (> cpath.length 0)
                     (< sources.length 2))
                (compiler_source_chain cpath tree sources))
            sources)))
            

(defun compiler_syntax_validation (validator_key tokens errors ctx tree)
  (let
      ((validation_results nil)
       (syntax_error nil)
       (cpath nil)
       (rules (prop *compiler_syntax_rules* validator_key)))
    (if rules
        (if_compile_time_defined `validate_form_structure
          (do
            ;(console.log "compiler_syntax_validation: " validator_key " -> tokens: " tokens "tree: " tree)
            ;(debug)
            (= validation_results (validate_form_structure rules [ tokens ]))
            (= cpath (cond
                         (is_array? tokens)
                         (chop tokens.0.path)
                         (is_object? tokens)
                         tokens.path))
            ;(console.log "compiler_syntax_validation: <- " validation_results)
            (when (not validation_results.all_passed)
               (for_each (`problem (or validation_results.invalid []))
                  (push errors  {     `error: "SyntaxError"
                                      `message:  problem
                                      `form: (if (> (length cpath) 0)
                                                 (as_lisp (resolve_path cpath tree))
                                                 "")
                                      `parent_forms: (compiler_source_chain cpath tree)
                                      `invalid: true
                                   }))
               (= syntax_error (new SyntaxError "invalid syntax"))
               (set_prop syntax_error
                    `handled true)
               ;(console.error "ERROR: " syntax_error)
               (throw syntax_error)
               )))
        (console.log "compiler_syntax_validation: no rules for: " validator_key " -> tokens: " tokens "tree: " tree ))
    validation_results))

(defun symbols ()
    (keys Environment.context.scope)
    {
        `description: "Returns an array of all defined symbols in the current evironment."
        `usage: []
        `tags: [`symbol `env `environment `global `globals ]
    })

(defun describe_all ()    
    (apply add   
      (for_each (s (symbols))
        (to_object [[s (describe s)]])))
    {
        `description: "Returns an object with all defined symbols as the keys and their corresponding descriptions."
        `usage: []
        `tags: [`env `environment `symbol `symbols `global `globals ]
    })

(defun is_value? (val)
    (if (== val "")
        true
        (if (== val undefined)
            false
            (if (isNaN val)
                true
                (if val
                    true
                    false))))
    {
     `description: "Returns true for anything that is not nil or undefined."
     `usage: ["val:*"]
     `tags: [`if `value `truthy `false `true ]
     })
 
(defun and* (`& vals)
   (when (> vals.length 0)
       (defvar rval true)
       (for_each (`v vals)
          (when (not (is_value? v))
             (= rval false)
             (break)))
        rval)
    {
        `description: (+ "Similar to and, but unlike and, values that " 
                         "are \"\" (blank) or NaN are considered to be true."  
                         "Uses is_value? to determine if the value should be considered to be true."
                         "Returns true if the given arguments all are considered a value, " 
                         "otherwise false.  If no arguments are provided, returns undefined.")
        `usage: ["val0:*" "val1:*" "val2:*" ]
        `tags: ["truth" "and" "logic" "truthy"]
    })

(defun or* (`& vals)
   (when (> vals.length 0)
       (defvar rval false)
       (for_each (`v vals)
          (when (is_value? v)
             (= rval true)
             (break)))
        rval)
    {
        `description: (+ "Similar to or, but unlike or, values that " 
                         "are \"\" (blank) or NaN are considered to be true."  
                         "Uses is_value? to determine if the value should be considered to be true."
                         "Returns true if the given arguments all are considered a value, " 
                         "otherwise false.  If no arguments are provided, returns undefined.")
        `usage: ["val0:*" "val1:*" "val2:*" ]
        `tags: ["truth" "or" "logic" "truthy"]
    })

(defun either (`& args)
   (let
      ((rval nil))
      (for_each (`arg args)
         (do 
             (= rval arg)
             (when (and (not (== undefined arg))
                  (not (== nil arg)))
             (break))))
      rval)
  {
      `description: (+ "Similar to or, but unlike or, returns the first non nil " 
                       "or undefined value in the argument list whereas or returns " 
                       "the first truthy value.")
      `usage: ["values:*"]
      `tags: ["nil" "truthy" "logic" "or" "undefined"]
  })       
            
       
(defmacro is_symbol? (symbol_to_find)
    (if (starts_with? "=:" symbol_to_find)
        `(not (== (typeof ,#symbol_to_find) "undefined"))
        `(not (instanceof (-> Environment `get_global ,#symbol_to_find) ReferenceError)))
             
          { 
            `usage: ["symbol:string|*"]
            `description: (+ "If provided a quoted symbol, will return true if the symbol can be found " 
                             "in the global context,  or false if it cannot be found.  " 
                             "If a non quoted symbol is provided to this macro, if the symbol is defined and "
                             "refers to a defined value, returns true, otherwise false.")
    
            `tags: ["context" "env" "def"]
           })

(defun get_function_args (f)
    (let
        ((r (new RegExp |^[a-zA-Z_]+ [a-zA-Z ]*\\(([a-zA-Z 0-9_,\\.\\n]*)\\)| `gm))
         (s (-> f `toString))
         (r (scan_str r s)))
      (when (and (> r.length 0)
                 (is_object? r.0))
        (map (fn (v)
                 (if (ends_with? "\n" v)
                     (chop v)
                     v))
                 (split_by "," (or (second r.0) "")))))
    {
      `description: "Given a javascript function, return a list of arg names for that function"
      `usage: ["function:function"]
      `tags: [ "function" "introspect" "introspection" "arguments"]
     })              
)

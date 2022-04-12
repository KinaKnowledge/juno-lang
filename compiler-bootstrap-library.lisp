;; Bootstrap Library 

;; Use for STEP 2: Post reader installation


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
    
(defglobal `embed_compiled_quote  
  (fn (type tmp_name tval)
    (cond
        (== type 0)
        [(quote "=:(") (quote "=:let") (quote "=:(") (quote "=:(")  tmp_name (+  (quote "=:") (as_lisp tval)) (quote "=:)") (quote "=:)") (+ (quote "=:") tmp_name) ]
        (== type 1)
        [ (quote "=$&!") (quote "=:'") (quote "=:+") (quote "=:await") (quote "=:Environment.as_lisp")  (quote "=:(")  tval (quote "=:)") (quote "=:+") (quote "=:'") ]
        (== type 2)
        [(quote "=:(") (quote "=:let") (quote "=:(") (quote "=:(")  tmp_name (+  (quote "=:") (as_lisp tval)) (quote "=:)") (quote "=:)") (+ (quote "=:") tmp_name) ]
        (== type 3)
        [(quote "=:'") (quote "=:+") (quote "=:await") (quote "=:Environment.as_lisp") (quote "=:(") tval (quote "=:)") (quote "=:+") (quote "=:'") ]))) 
    

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
 
(defglobal get_outside_global get_outside_global)      


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

(defun `object_methods (obj)
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
 
(defun `expand_dot_accessor (val ctx)
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


(defun `safe_access (token ctx sanitizer_fn)
    (let
        ((`comps nil)
         (`acc [])
         (`acc_full [])
         (`pos nil))
     (= comps (split_by "." token.name))
     (if (== comps.length 1)
         token.name
         (do 
             (set_prop comps
                       0
                       (sanitizer_fn comps.0))
             (while (> comps.length 0)
                (do 
                    (push acc
                          (take comps))
                    (push acc_full
                          (expand_dot_accessor (join "." acc) ctx))))
             (flatten ["(" (join "&&" acc_full) ")" ])))))    


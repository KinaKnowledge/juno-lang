
;; Once the Alpha Environment is brought up this file should be imported into it

;; Initial build of environment
;; Build all forms in the starter environment
;; up to random_int

;; add_escape_encoding is used for quoting purposes and providing escaped
;; double quotes to quoted lisp in compiled Javascript

;; **
   

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
          `description: "simple defmacro for bootstrapping and is replaced by the more sophisticated form."
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
            val))
  {
   `description: "Given a value or arrays of values, return the provided symbol in it's literal, quoted form, e.g. (desym myval) => \"myval\""
   `usage: ["val:string|array"]
   `tags: [`symbol `reference `literal `desymbolize `dereference `deref `desym_ref]
   })
        
(defmacro desym_ref (val)
  `(+ "" (as_lisp ,#val))
  {
   `description: (+ "Given a value will return the a string containing the desymbolized value or values. "
                    "Example: <br>"
                    "(defglobal myvar \"foo\")<br>"
                    "(defglobal myarr [ (quote myvar) ])<br>"
                    "(desym_ref myarr) => (myvar)<br>"
                    "(desym_ref myarr.0) => myvar<br>"
                    "(subtype (desym_ref myarr.0)) => \"String\"")
   `usage: ["val:*"]
   `tags: ["symbol" "reference" "syntax" "dereference" "desym" "desym_ref" ]
   })
 
(defmacro deref (val)
  `(let
      ((mval ,#val))
    (if (and (is_string? mval)
             (starts_with? "=:" mval))
      (-> mval `substr 2)
      mval))
  {
   `description: (+ "If the value that the symbol references is a binding value, aka starting with '=:', then return the symbol value "
                    "instead of the value that is referenced by the symbol. This is useful in macros where a value in a form is "
                    "to be used for it's symbolic name vs. it's referenced value, which may be undefined if the symbol being "
                    "de-referenced is not bound to any value. <br>"
                    "Example:<br>"
                    "Dereference the symbolic value being held in array element 0:<br>"
                    "(defglobal myvar \"foo\")<br>"
                    "(defglobal myarr [ (quote myvar) ])<br>"
                    "(deref my_array.0) => \"my_var\"<br>"
                    "(deref my_array) => [ \"=:my_var\" ]<br>"
                    "<br>In the last example, the input to deref isn't a string and so it returns the value as is.  See also desym_ref.")
   `tags: ["symbol" "reference" "syntax" "dereference" "desym" "desym_ref" ]
   `usage: ["symbol:string"]
                    
   })

(defmacro when (condition `& mbody) 
     `(if ,#condition
          (do
            ,@mbody))
  {
   `description: (+ "Similar to if, but the body forms are evaluated in an implicit progn, if the condition form or expression is true. "
                    "The function when will return the last form value.  There is no evaluation of the body if the conditional expression "
                    "is false.")
   `usage: ["condition:*" "body:*"]
   `tags: ["if" "condition" "logic" "true" "progn" "conditional"]                    
   })


(defmacro if_compile_time_defined (quoted_symbol exists_form not_exists_form)
  (if  (describe quoted_symbol)
    exists_form       
    (or not_exists_form []))       
     {
         `description: "If the provided quoted symbol is a defined symbol at compilation time, the exists_form will be compiled, otherwise the not_exists_form will be compiled."
         `tags: ["compile" "defined" "global" "symbol" "reference"]
         `usage:["quoted_symbol:string" "exists_form:*" "not_exists_form:*"]         
     })

(defmacro defexternal (name value)
   `(let
       ((symname (desym ,@name)))
    (do 
       (set_prop globalThis
             symname
             ,#value)
       (prop globalThis
             symname)))
  {
   `description: "Given a name and a value, defexternal will add a globalThis property with the symbol name thereby creating a global variable in the javascript environment."
   `tags: [ `global `javascript `globalThis `value ]
   `usage: ["name:string" "value:*"]
   })
         
(defmacro defun (name args body meta)
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
           (quote ,#source_details))))
  {
   `description: "simple defun for bootstrapping and is replaced by the more sophisticated during bootstrapping"
   })

(defmacro defun_sync (name args body meta)
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
             (function ,#fn_args
                 ,#fn_body)
           (quote ,#source_details))))
  {
   `description: (+ "Creates a top level synchronous function as opposed to the default via defun, which creates an asynchronous top level function."                    
                    "Doesn't support destructuring bind in the lambda list (args). "
                    "Given a name, an argument list, a body and symbol metadata, will establish a top level synchronous function.  If the name is "
                    "fully qualified, the function will be compiled in the current namespace (and it's lexical environment) and placed in the "
                    "specified namespace."
                    )
   `usage: ["name:string" "args:array" "body:*" "meta:object" ]
   `tags: ["define" "function" "synchronous" "toplevel" ]
   })
  
(defun macroexpand (quoted_form)
    (let
       ((macro_name (-> quoted_form.0 `substr 2))
        (macro_func (-> Environment `get_global macro_name))
        (expansion (if (and (is_function? macro_func)
                            (resolve_path [ macro_name `eval_when `compile_time ] Environment.definitions))
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
       expansion))
  {
   `description: "[Deprecated] - use macroexpand.  The nq form takes a non quoted form and returns the expansion. Used primarily during early development."
   `usage: ["form:*"]
   `tags: ["macro" "deprecated" "expansion" "debug" "compile" "compilation"]
   `deprecated: true
   })
       

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
         

              

(defun_sync get_object_path (refname)
  (if (or (> (-> refname `indexOf ".") -1)
          (> (-> refname `indexOf "[") -1))
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
                  (when (> name_acc.length 0)
                    (push comps
                          (join "" name_acc)))
                    (= name_acc []))
                (and (== mode 0)
                     (== c "["))
                (do
                  (= mode 1)
                  (when (> name_acc.length 0)
                    (push comps
                         (join "" name_acc)))
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
        (if (> name_acc.length 0)
            (push comps (join "" name_acc)))
        comps)
    [ refname ])
  {
   `description: "get_object_path is used by the compiler to take a string based notation in the form of p[a][b] or p.a.b and returns an array of the components."
   `tags: [ `compiler ]
   `usage: ["refname:string"]
   })
             


(defun do_deferred_splice (tree)
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
            tree))
  {
   `description: "Internally used by the compiler to facilitate splice operations on arrays."
   `usage: ["tree:*"]
   `tags: [`compiler `build ]
   })




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


 

;; Defines a global binding to a (presumably) native function
;; This macro facilitates the housekeeping with keeping track
;; of the source form used (and stored in the environment) so
;; that save_env can capture the source bindings and recreate
;; it in the initializer function on rehydration...


(defmacro defbinding (`& args)
  (let
      ((binding nil)
       (acc [(quote list)]))
    
    (for_each (bind_set args)
              (do
                (cond
                  (and (is_array? bind_set)
                       (or (== bind_set.length 2);; Include the metadata
                           (== bind_set.length 3))
                       (is_array? bind_set.1)
                       (== bind_set.1.length 2))
                  (do                    
                    (= binding [(quote quote) [(quote bind) bind_set.1.0 bind_set.1.1 ]])
                    (push acc [ (quote defglobal) (+ *namespace* "/" (deref bind_set.0)) [(quote bind) bind_set.1.0 bind_set.1.1]
                           (if (is_object? bind_set.2)
                             (+ {} bind_set.2
                                { `initializer: binding })
                             { `initializer: binding }) ]))
                             
                  else
                  (throw SyntaxError "defbinding received malform arguments"))))    
    acc)
  {
   description: (+ "Defines a global binding to a potentially native function.  This macro "
                   "facilitates the housekeeping by keeping track of the source form "
                   "used (and stored in the environment) so that the save environment "
                   "facility can capture the source bindings and recreate it in the initializer "
                   "function on rehydration.<br>"
                   "The macro can take an arbitrary amount of binding arguments, with the form: "
                   "(symbol_name (fn_to_bind_to this))")
   usage: ["binding_set0:array" "binding_setN:array"]
   tags: ["toplevel" "global" "bind" "environment" "initialize" ]
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
            (if (is_object? defset.2)
              (push acc ([(quote set_prop) (quote Environment.definitions)
                          (+ "" (as_lisp symname) "")
                          (+ { `core_lang: true } defset.2) ]))
              (push acc ([(quote set_prop) (quote Environment.definitions)
                          (+ "" (as_lisp symname) "")
                          { `core_lang: true } ] )))))
     acc)
  {
   `description: (+ "define_env is a macro used to provide a dual definition on the top level: it creates a symbol via defvar in the "
                    "constructed scope as well as placing a reference to the defined symbol in the scope object.")
   `usage: ["definitions:array"]
   `tags: ["environment" "core" "build"]
   })


(defun type (x)
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
        
        acc)
  {
   `description: "Destructure list takes a nested array and returns the paths of each element in the provided array."
   `usage: ["elems:array"]
   `tags: ["destructuring" "path" "array" "nested" "tree"]
   })


(defmacro destructuring_bind (bind_vars expression `& forms)  
      (let
          ((binding_vars bind_vars)
           (paths (destructure_list binding_vars))
           (bound_expression expression)
           (allocations [])
           (acc [(quote let)]))
	(assert (and (is_array? bind_vars)
		     (is_value? expression)
		     (is_value? forms))
		"destructuring_bind: requires 3 arguments")
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
          acc)
  {
   `description: (+ "The macro destructuring_bind binds the variable symbols specified in bind_vars to the corresponding "
                    "values in the tree structure resulting from the evaluation of the provided expression.  The bound "
                    "variables are then available within the provided forms, which are then evaluated.  Note that "
                    "destructuring_bind only supports destructuring arrays. Destructuring objects is not supported.")
   `usage: ["bind_vars:array" "expression:array" "forms:*"]
   `tags: [`destructure `array `list `bind `variables `allocation `symbols ]
   })

(defun_sync split_by_recurse (token container)  
    (cond
      (is_string? container)
      (split_by token container)
      (is_array? container)
      (map (fn (elem)
             (split_by_recurse token elem))
           container))
  {
   `usage: ["token:string" "container:string|array"]
   `description: (+ "Like split_by, splits the provided container at "
                    "each token, returning an array of the split "
                    "items.  If the container is an array, the function "
                    "will recursively split the strings in the array "
                    "and return an array containing the split values "
                    "of that array.  The final returned array may contain "
                    "strings and arrays.")
   `tags: [ `split `nested `recursion `array `string ]
   })


;; Rebuild defmacro to use destructuring 
  
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
     `description: (+ "Defines the provided name as a compile time macro function in the current namespace environment. "
                      "The parameters in the lambda list are destructured and bound to the provided names which are then "
                      "available in the macro function.  The forms are used as the basis for the function with the final "
                      "form expected to return a quoted form which is then as the expansion of the macro by the compiler. "
                      "The body of forms are explicitly placed in a progn block.  Like with functions and defglobal, "
                      "if the final argument to defmacro is an object, this will be used for the metadata associated with "
                      "with the bound symbol provided as name.<br>Example:<br>"
| (defmacro unless (condition `& forms)
    `(if (not ,#condition)
       (do 
         ,@forms))
    {
     `description: "opposite of if, if the condition is false then the forms are evaluated"
     `usage: ["condition:array" "forms:array"]
     `tags: ["if" "not" "ifnot" "logic" "conditional"]
     }) |
                      "<br>"
                      "In the above example the macro unless is defined.  Passed arguments must be explicitly "
                      "unquoted or an error may be thrown because the arguments condition and forms *may* not be "
                      "defined in the final compilation environment.  Note that if the symbols used by the macro "
                      "are defined in the final compilation scope, that this may cause unexpected behavior due to "
                      "the form being placed into the compilation tree and then acting on those symbols. <br>"
                      "Be aware that if a macro being defined returns an object (not an array) you should explicitly "
                      "add the final metadata form to explictly ensure appropriate interpretation of the argument "
                      "positions.<br><br>"
                      "Since a macro is a function that is defined to operate at compile time vs. run time, the "
                      "rules of declare apply.  Declaration operate normally and should be the first form in "
                      "the block, or if using let, the first form after the allocation block of the let.")
     `usage: ["name:symbol" "lambda_list:array" "forms:array" "meta?:object"]
     `tags: [ `macro `define `compile `function ]
    })  



;; Recreate the defun function now that we have destructuring installed


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
     `usage: ["name:string:required" "lambda_list:array:required" "body:array:required" "meta:object"]
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
 
(defglobal bind_function bind
  {
   `description: "Reference bind and so has the exact same behavior.  Used for Kina legacy code. See bind description."
   })
 
(defmacro is_reference? (val)
  `(and (is_string? ,#val)
       (> (length ,#val) 2)
       (starts_with? (quote "=:") ,#val))
  {
   `description: (+ "Returns true if the quoted value is a binding string; in JSON notation this would be a string starting with \"=:\". "
                    "Note that this function doesn't check if the provided value is a defined symbol, but only if it has been "
                    "described in the JSON structure as a bounding string.")
   `usage: ["val:string"]
   `tags: ["reference" "JSON" "binding" "symbol" ] 
   }) 
    
(defun scan_str (regex search_string)
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
         `description: (+ "If the provided key exists, removes the key from the provided object, "
                          "and returns the removed value if the key exists, otherwise returned undefined.")
         `tags: ["object" "key" "value" "mutate" "delete_prop" "remove" ]
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
                                         [ "[\"" comp "\"]" ])))))))
  {
   `description: "Used for compilation. Expands dotted notation of a.b.0.1 to a[\"b\"][0][1]"
   `usage: ["val:string" "ctx:object"]
   `tags: [`compiler `system ]
   })
 
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
        (throw "invalid call to getf_ctx: missing argument/s"))
  {
   `description: "Used for compilation. Given a context structure, provides a utility function for retrieving a context value based on a provided identifier."
   `usage: ["tree:array" "name:string"]
   `tags: [`compiler `system ]
   })

(defun setf_ctx (ctx name value)
    (let
        ((`found_val (getf_ctx ctx name value)))
        (if (== found_val undefined)
            (set_prop ctx.scope
                      name
                      value))
        value)
  {
   `description: "Used for compilation. Given a context structure, provides a utility function for setting a context place with value."
   `usage: ["tree:array" "name:string" "value:*" ]
   `tags: [`compiler `system ]
   })
                  
        
(defun set_path (path obj value)
    (let
        ((`fpath (clone path))
         (`idx (pop fpath))
         (`rpath fpath)
         (`target_obj nil))
     (= target_obj (resolve_path rpath obj))
     (if target_obj
         (do (set_prop target_obj
                   idx
                   value))
           
         (throw RangeError (+ "set_path: invalid path: " path))))
  {
   `description: (+ "Given a path value as an array, a tree structure, and a value, "
                    "sets the value within the tree at the path value, potentially overriding any existing value at that path.<br><br>"
                    "(defglobal foo [ 0 2 [ { `foo: [ 1 4 3 ] `bar: [ 0 1 2 ] } ] 3 ])<br>"
                    "(set_path [ 2 0 `bar 1 ] foo 10) => [ 0 10 2 ]<br>"
                    "foo => [ 0 2 [ { foo: [ 1 4 3 ] bar: [ 0 10 2 ] } ] 3 ]")
   `tags: [ "resolve_path" "path" "set" "tree" "mutate" ]
   `usage: [ "path:array" "tree:array|object" "value:*" ]
   })

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
       )
  {
   `description: (+ "Given an array container with numeric values, returns an array with smallest "
                    "and largest values in the given array [ min, max ]<br>"
                    "(minmax [ 2 0 1 3]) -> [ 0 3 ]")
   `usage: [ "container:array" ]
   `tags: ["min" "max" "array" "number" "range" ]
   })


(defun gen_multiples (len multiple?)
  (let
      ((`val 100)
       (`acc [val])
       (`mult (or multiple? 10)))
     (for_each (`r (range len))
        (push acc (= val (* val mult))))
     (reverse acc))
  {
   `description: "Internal compiler use. utility function for return splices."
   `usage: ["tree:array"]
   `tags: [`compiler `system ]
   })

(defun path_multiply (path multiple?)
  (let
      ((`acc 0)
       (`multiples (gen_multiples (length path) multiple?)))
      (for_each (`pset (pairs (interlace path multiples)))
          (= acc (+ acc (* pset.0 pset.1))))
      acc)
  {
   `description: "Internal compiler use. utility function for return splices."
   `usage: ["tree:array"]
   `tags: [`compiler `system ]
   })

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
 ;      (if (== _depth 0)
;	   (splice_log "->" js_tree))
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
                        ;;(splice_log "FUNCTION TYPE: " comp.ctype)
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
			  ;; if we don't have the if statement registered, add an array to contain the statements associated
			  ;; with this if statement..
                            (set_prop (getf_ctx _ctx `if_links)
                                      comp.if_id
                                      []))
                        (when comp.if_id
			  ;; register the potential return point..
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
		(`last_return_score nil)
                (`plength 0)
		(`rscore 0)
                (`if_paths [])
                (`max_path_segment_length nil)
                (`final_return_found (getf_ctx _ctx `return_found)))
                
             ; (splice_log "<return must be by here> found?" final_return_found "level: "  _ctx.scope.level "root: " root  "base_path: " base_path "last_path: " last_path)
             ; (splice_log "viable_return_points: " (as_tree viables))
             ; (splice_log "potential_return_points: " (as_tree potentials))
             ; (splice_log "tree to operate on: " (clone js_tree))
             ; (splice_log "if_links: " (as_tree (getf_ctx _ctx `if_links)))
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
		   
		     (if (eq nil last_return_score)			
			 (= last_return_score (path_multiply vpath max_path_segment_length)))

		     (= rscore (path_multiply vpath max_path_segment_length))
                    ; (splice_log p "max_path_segment_length: " max_path_segment_length "ppath: " ppath " vpath: " vpath 
                     ;            (path_multiply ppath max_path_segment_length) ">" rscore
                      ;           (> (path_multiply ppath max_path_segment_length) rscore)
		;		 "last_return_score:  " last_return_score (> (path_multiply ppath max_path_segment_length) last_return_score))
		     
                     (if (or (> (path_multiply ppath max_path_segment_length)
                                last_return_score) ;;(path_multiply vpath max_path_segment_length))
                             (and (== p.block_step 0)
                                  (== p.lambda_step 0))
                             (== 0 (length viables)))
                        (do 
                        ;    (splice_log "set potential to return at" ppath "versus final viable: " vpath p.if_id)
                            (set_path p.path ntree { `mark: "return_point" })
			    (= last_return_score (Math.max (path_multiply ppath max_path_segment_length)
							   last_return_score))
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
                               ; (splice_log "if adjust off: " p.if_id p.path p)
                                )))))))
      ntree)
     else
     js_tree))
  {
   `description: "For use in the compiler.  identifies proper placement of the return keyword in the assembled JS tree."
   `usage: ["tree:array"]
   `tags: [`compiler `system ]
   })


                  
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
      js_tree)
  {
   `description: "For use in the compiler.  Based on output of splice_in_return_a, handles placement of the return keyword in the assembled JS tree."
   `usage: ["tree:array"]
   `tags: [`compiler `system ]
   })                       

(defmacro aif (test_expr eval_when_true eval_when_false)
  `(let
       ((it ,#test_expr))   ;; capture the result of the if in `it and make it available in scope
     (if it
       ,#eval_when_true
         ,#eval_when_false))
  {
   `description: (+ "Anaphoric If - This macro defines a scope in which the symbol `it is used "
                    "to store the evaluation of the test form or expression.  It is then available "
                    "in the eval_when_true form and, if provided, the eval_when_false expression.")
   `usage: ["test_expression:*" "eval_when_true:*" "eval_when_false:*?"]
   `tags: [ `conditional `logic `anaphoric `if `it ]
   })

(defmacro ifa (test thenclause elseclause)
    `(let 
          ((it ,#test))
         (if it ,#thenclause ,#elseclause))
  {
      `description: "Similar to if, the ifa macro is anaphoric in binding, where the it value is defined as the return value of the test form. Use like if, but the it reference is bound within the bodies of the thenclause or elseclause."
      `usage: ["test:*" "thenclause:*" "elseclause:*"]
      `tags: ["cond" "it" "if" "anaphoric"]
  })  


(defun map_range (n from_range to_range)
            (+ to_range.0
               (* (/ (- n from_range.0)
                     (- from_range.1 from_range.0))
                  (- to_range.1 to_range.0)))
        { `usage: ["n:number" "from_range:array" "to_range:array"]
          `tags:  ["range" "scale" "conversion"]
          `description: (+ "Given an initial number n, and two numeric ranges, maps n from the first range " 
                           "to the second range, returning the value of n as scaled into the second range. ") })



(defun range_inc (start end step)
        (if end
            (range start (+ end 1) step)
            (range (+ start 1)))
        {
         `description: (+ "Similar to range, but is end inclusive: [start end] returning an array containing values from start, including end. " 
                          "vs. the regular range function that returns [start end).  "
                          "If just 1 argument is provided, the function returns an array starting from 0, up to and including the provided value.")
         `usage: ["start:number" "end?:number" "step?:number"]
         `tags:  ["range" "iteration" "loop"]
         })

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
 
(defun flatten_ctx (ctx _var_table)
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
      var_table))
  {
   `description: "Internal usage by the compiler, flattens the hierarchical context structure to a single level. Shadowing rules apply."
   `usage: ["ctx_object:object"]
   `tags: ["system" "compiler"]
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
      `tags: ["if" "not" "ifnot" "logic" "conditional"]
     })

(defmacro use_quoted_initializer (`& forms)
  (let
      ((insert_initializer (fn (form)
			       ;; the final form must be in the form of a (defglobal name value) or (defglobal name value { }) (defglobal name value (quote { } ))
			       ;; the def- macros should all expand out into this architypal form..
			       ;; if the meta isn't provided the metadata will be appended in.
			       (progn
				 (defvar meta (prop form 3))
				 (if (eq nil (prop form 3))
				     (= meta
					(set_prop form
						  3
						  {})))
				 				  
				 (cond
				  (and (is_array? meta)
				       (is_object? (resolve_path [ 3 1 ] form)))
				  (do
				   (set_path [ 3 1 `initializer ] form [(quote quote) form.2 ])				   
				   form)
				  (is_object? meta)
				  (do
				   (do
				      (set_prop form.3					   
						`initializer [(quote quote) form.2 ])				      
				      form))
				  else
				  (do
				      (warn "use_quoted_initializer: cannot quote " (if (is_string? form.2) form.2 form " - cannot find meta form. Check calling syntax."))
				      form)
				     )))))
   
    (for_each (form forms)
	      (do
	       ;; make sure we are working with the form in it's expanded state.
	       ;; this macro should be the calling form to defun, etc..
	       (= form (macroexpand form))
               (if (and (is_array? form)
			(== form.0 (quote defglobal)))
		   (do		    
		    (insert_initializer form))
		 form))))
  {
    `description: | 
use_quoted_initializer is a macro that preserves the source form in the symbol definition object. 
When the environment is saved, any source forms that wish to be preserved through the 
serialization process should be in the body of this macro.  This is a necessity for global 
objects that hold callable functions, or functions or structures that require initializers,
such as things that connect or use environmental resources.
|
    `usage: ["forms:array"]
    `tags: [`compilation `save_env `export `source `use `compiler `compile ]

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
               (console.error (+ "replace: " e)))))
  {
   `description: (+ "Given at least 3 arguments, finds the first  argument, and replaces with the second argument, operating on the third plus argument.  "
                    "This function will act to replace and find values in strings, arrays and objects.  When replacing values in strings, be aware that "
                    "only the first matching value will be replaced.  To replace ALL values in strings, use a RegExp with the `g flag set, such as "
                    "(new RegExp \"Target String\" `g).  For example, the following replaces all target values in the target string:<br>"
                    "(replace (new RegExp \"Indiana\" `g) \"Illinois\" \"The address of the location in Indiana has now been changed to 123 Main Street, Townville, Indiana.\")")
   `usage: ["target:string|regexp" "replacement:string|number" "container:string|array|object"]
   `tags: ["replace" "find" "change" "edit" "string" "array" "object"]
   })

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

(defun path_to_js_syntax (comps)
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
        (throw TypeError (+ "path_to_js_syntax: need array - given " (sub_type comps))))
  {
   `description: "Used by the compiler, converts an array containing the components of a path to Javascript syntax, which is then returned as a string."
   `usage: ["comps:array"]
   `tags: ["compiler" "path" "js" "javascript"]
   })

(defun first_is_upper_case? (str_val)
    (progn
       (defvar rval (-> str_val `match (new RegExp "^[A-Z]")))
       (if (and rval rval.0)
           true
           false))
  {
   `description: "Returns true if the first character of the provided string is an uppercase value in the range [A-Z]. "
   `tags: ["string" "case" "uppercase" "capitalized"]
   })
       
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
         `usage: ["compiled_source:array"]
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


(use_quoted_initializer
 (defglobal *compiler_syntax_rules*
   { 
    `compile_let:  [ [[0 1 `val] (list is_array?) "let allocation section"]
                    [[0 2] (list (fn (v) (not (== v undefined)))) "let missing block"]]
    `compile_cond: [ [[0] (list (fn (v) (== (% (length (rest v)) 2) 0))) "cond: odd number of arguments" ]]
    `compile_assignment: [[[0 1] (list (fn (v) (not (== v undefined)))) "assignment is missing target and values"]
                          [[0 2] (list (fn (v) (not (== v undefined)))) "assignment is missing value"]]
    }))


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
                                      `source_name: (getf_ctx ctx "__SOURCE_NAME__")
                                      `form: (first (compiler_source_chain cpath tree))
                                      `parent_forms: (rest (compiler_source_chain cpath tree))
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
     `description: "Returns true for anything that is not nil or undefined or false."
     `usage: ["val:*"]
     `tags: [`if `value `truthy `false `true ]
     })

(defun sort (elems options)
  (let
      ((opts (or (and (is_object? options)
                          options)
                 {}))
       (sort_fn nil)
       (sort_fn_inner nil)
       (keyed false)
       (reverser   (if opts.reversed
                     -1
                     1))
       (comparitor (cond
                     (is_function? opts.comparitor)
                     opts.comparitor                     
                     else
                     ;; we don't know what the elements can be so we need to have some detection work done
                     ;; for efficiency supply an explicit comparitor function for the elements.
                     (function (a b)
                               (cond
                                 (is_string? a)
                                 (if (is_string? b)
                                   (* reverser (-> a `localeCompare b))
                                   (* reverser (-> a `localeCompare (+ "" b))))
                                 
                                 (is_string? b)
                                 (* reverser (-> (+ "" a) `localeCompare b))

                                 opts.reversed
                                 (- b a)
                                 else
                                 (- a b)))))                                                                                           
       (key_path_a "aval")
       (key_path_b "bval"))
    
    ;; confirm we have an array for elements 
    (assert (is_array? elems) "sort: elements must be an array")
    (assert (== (subtype comparitor) "Function") (+ "sort: invalid comparitor provided : " (subtype comparitor) " - must be a synchronous function, or evaluate to a synchronous function."))
    
    (assert (or (and opts.comparitor (not opts.reversed))
                (and (not opts.comparitor) opts.reversed)
                (and (not opts.comparitor) (not opts.reversed)))
            "sort: comparitor option cannot be combined with reversed option")
    

    ;; build up our structures so we can create a fast sort lambda
    (cond
      (is_string? opts.key)
      (do
        (= keyed true)
        (= key_path_a (path_to_js_syntax (get_object_path (+ "aval." opts.key))))
        (= key_path_b (path_to_js_syntax (get_object_path (+ "bval." opts.key)))))
      (is_array? opts.key)
      (do
        (= keyed true)
        (= key_path_a (path_to_js_syntax (conj ["aval"] opts.key)))
        (= key_path_b (path_to_js_syntax (conj ["bval"] opts.key)))))
  
    (= sort_fn_inner (new Function "aval" "bval" "comparitor" (+ "return comparitor( " key_path_a "," key_path_b ")")))
    (= sort_fn (function (aval bval)
                         (sort_fn_inner aval bval comparitor)))
    (-> elems `sort sort_fn))
  {
   `description: (+ "Given an array of elements, and an optional options object, returns a new sorted array."
                    "With no options provided, the elements are sorted in ascending order.  If the key "
                    "reversed is set to true in options, then the elements are reverse sorted. "
                    "<br>"
                    "An optional synchronous function can be provided (defined by the comparitor key) which is expected to take "
                    "two values and return the difference between them as can be used by the sort method of "
                    "JS Array.  Additionally a key value can be provided as either a string (separated by dots) or as an array "
                    "which will be used to bind (destructure) the a and b values to be compared to nested values in the elements "
                    "of the array."
                    "<br>"
                    "<br>"
                    "Options:<br>"
                    "reversed:boolean:if true, the elements are reverse sorted.  Note that if a comparitor function is provided, then "
                    "this key cannot be present, as the comparitor should deal with the sorting order.<br>"
                    "key:string|array:A path to the comparison values in the provided elements. If a string, it is provided as period "
                    "separated values.  If it is an array, each component of the array is a successive path value in the element to be "
                    "sorted. <br>"
                    "comparitor:function:A synchronous function that is to be provided for comparison of two elements.  It should take "
                    "two arguments, and return the difference between the arguments, either a positive or negative.")
   `usage: ["elements:array" "options:object?"]
   `tags: [`array `sorting `order `reverse `comparison `objects]                    
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
  `(not (or (== (typeof ,#symbol_to_find) "undefined")
            (== (-> Environment `get_global ,#symbol_to_find ReferenceError) ReferenceError)))

  {
   `usage: ["symbol:string|*"]
   `description: (+ "If provided a quoted symbol, will return true if the symbol can be found "
                    "in the local or global contexts.")

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

(defun findpaths (value structure)
  (let
      ((acc [])  ;; the accumulator for our results      
       (search (fn (struct _cpath)  ;; the recursion routine
                 (cond
                   (is_array? struct)
                   (map (fn (elem idx)
                          (cond                               
                            (is_object? elem)
                            (search elem (conj _cpath [ idx ]))
                            
                               ;; simple value do comparison
                            (== elem value)
                            (push acc (conj _cpath [ idx ]))))
                        struct)
                   (is_object? struct)
                   (map (fn (pset)
                          (cond
                            (is_object? pset.1)
                            (search pset.1 (conj _cpath [ pset.0 ])) ;; path with key

                            (== pset.1 value)
                            (push acc (conj _cpath [ pset.1 ]))))
                        (pairs struct))

                   (== struct value)
                   (push acc _cpath)))))
    (search structure [])
    acc))


   

 (defglobal warn
   (defclog { `prefix: "⚠️  "  })
   {
    `description: "Prefixes a warning symbol prior to the arguments to the console.  Otherwise the same as console.log."
    `usage:["args0:*" "argsN:*" ]
    `tags: ["log" "warning" "error" "signal" "output" "notify" "defclog"]
    `initializer: (quote [ "=:defclog", { prefix: "⚠️  " } ])
    })

 (defglobal success
   (defclog { `color: `green `prefix: "✓  " })
   {
    `description: "Prefixes a green checkmark symbol prior to the arguments to the console.  Otherwise the same as console.log."
    `usage:["args0:*" "argsN:*" ]
    `tags: ["log" "warning" "notify" "signal" "output" "ok" "success" "defclog"]
    `initializer: (quote [ "=:defclog", { color: "green", prefix: "✓  " } ])
    })

(defmacro in_background (`& forms)
  `(new Promise
	(fn (resolve reject)
	    (progn
	      (resolve true)
	      ,@forms)))
  {
  `description: (+ "Given a form or forms, evaluates the forms in the background, with "
		   "the function returning true immediately prior to starting the forms.")
  `usage: ["forms:*"]
  `tags: ["eval" "background" "promise" "evaluation"]
  })

(defun set_compiler (compiler_function)
    (progn
        (-> Environment `set_compiler compiler_function)
        compiler_function)
    {
        `description: (+ "Given a compiled compiler function, installs the provided function as the "
                         "environment's compiler, and returns the compiler function.")
        `usage: ["compiler_function:function"]
        `tags:["compilation" "environment" "compiler"]
    })

(defun show (thing)
    (cond
      (is_function? thing)
      (-> thing `toString)
      else
      thing)
    { `usage: ["thing:function"]
    `description: "Given a name to a compiled function, returns the source of the compiled function.  Otherwise just returns the passed argument."
    `tags:["compile" "source" "javascript" "js" "display" ]
    
     })

(defmacro export_symbols (`& args)
  (let
      ((acc [ quote [javascript `export "{"]])
       (numargs (length args))
       (idx 0))
    (for_each (symname args)
              (do
                (cond
                  (and (is_array? symname)
                       (== symname.length 2))
                  (do
                    (push acc (deref symname.0))
                    (push acc " as ")
                    (push acc (deref symname.1)))
                  (is_string? symname)
                  (push acc (deref symname))
                  else
                  (throw SyntaxError "Invalid argument for export"))
                (inc idx)
                (if (< idx numargs)
                  (push acc ", "))))
    (push acc "}"))
    {
     `usage: ["arg0:string|array","argN:string|array"]
     `description: (+ "The export_symbols macro facilitates the Javascript module export functionality.  "
                      "To make available defined lisp symbols from the current module the export_symbols "
                      "macro is called with it's arguments being either the direct symbols or, if an "
                      "argument is an array, the first is the defined symbol within the lisp environment "
                      "or current module and the second element in the array is the name to be exported "
                      "as.  For example: <br> "
                      "(export lisp_symbol1 lisp_symbol2) ;; exports lisp_symbol1 and lisp_symbol2 directly. <br>"
                      "(export (lisp_symbol1 external_name)) ;; exports lisp_symbol1 as 'external_name`. <br>"
                      "(export (initialize default) symbol2) ;; exports initialize as default and symbol2 as itself.")
     `tags: ["env" "enviroment" "module" "export" "import" "namespace" "scope"]                      
     }
    acc)

(defun register_feature (feature)
  (if (not (contains? feature *env_config*.features))
      (do
         (push *env_config*.features feature)
         true)
    false)
  {
  `description: "Adds the provided string to the *env_config* features.  Features are used to mark what functionality is present in the environment."
  `tags: ["environment" "modules" "libraries" "namespaces"]
  `usage: ["feature:string"]
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

(defun uniq (values handle_complex_types)
     (let
         ((s (new Set)))
         (if handle_complex_types
             (do
                 (map (fn (x)
                      (-> s `add (JSON.stringify x)))
                  (or values
                      []))
                 
                 (map (fn (x)
                          (JSON.parse x))
                          (to_array s)))
             (do 
                 (map (fn (x)
                      (-> s `add x))
                      (or values
                          []))
                (to_array s))))
    { `description: (+ "Given a list of values, returns a new list with unique, deduplicated values. "
                       "If the values list contains complex types such as objects or arrays, set the "
                       "handle_complex_types argument to true so they are handled appropriately. ")
      `usage: ["values:list" "handle_complex_types:boolean"]
      `tags: ["list" "dedup" "duplicates" "unique" "values"] })

(defmacro time_in_millis ()
        `(Date.now)
        { "usage":[]
          "tags":["time" "milliseconds" "number" "integer" "date"]
          "description":"Returns the current time in milliseconds as an integer" })

(defun defns (name options)
  (if (and options
           options.ignore_if_exists
           (is_string? name)
           (contains? name (namespaces)))
     name   ;; just return
     (create_namespace name options)) ;; try and make it 
  {
    usage: ["name:string" "options:object"]
    description: (+ "Given a name and an optional options object, creates a new namespace "
                    "identified by the name argument.  If the options object is provided, the following keys are available:"
                    "<br>"
                    "ignore_if_exists:boolean:If set to true, if the namespace is already defined, do not return an error "
                    "and instead just return with the name of the requested namespace. Any other options are ignored and "
                    "the existing namespace isn't altered."
                    "contained:boolean:If set to true, the newly defined namespace will not have visibility to other namespaces "
                    "beyond 'core' and itself.  Any fully qualified symbols that reference other non-core namespaces will "
                    "fail."
                    "serialize_with_image:boolean:If set to false, if the environment is saved, the namespace will not be "
                    "included in the saved image file.  Default is true.")
    tags: ["namespace" "environment" "define" "scope" "context"]
   })

(defmacro use_ns (name)
  `(set_namespace (desym ,#name))
  {
   `usage: [ "name:symbol" ]
   `description: "Sets the current namespace to the provided name.  Returns the name of the new namespace if succesful, otherwise an Eval error is thrown"
   `tags: ["namespace" "environment" "scope" "change" "set"]
   })

 (defun bind_and_call (target_object this_object method `& args)
        (do
            (defvar boundf (bind (prop target_object method) this_object))
            (if boundf
                (apply boundf args)
                (throw "unable to bind target_object")))
        {
            `usage:["target_object:object" "this_object:object" "method:string" "args0:*" "argsn:*"]
            `description: "Binds the provided method of the target object with the this_object context, and then calls the object method with the optional provided arguments."
            `tags:["bind" "object" "this" "context" "call"]
        })


                       
(defglobal document (new Object))
(defun save_locally (fname data content_type)
     (if (prop window `document)
       (let
           ((blob (new Blob [ data ] { type: content_type }))
            (elem (-> (prop window `document) `createElement `a))
            (dbody (prop document `body)))
         (declare (object dbody))
         (set_prop elem
                   `href
                   (-> window.URL `createObjectURL blob)
                   `download
                   fname)
         (-> dbody `appendChild elem)
         (-> elem `click)
         (-> dbody `removeChild elem)
         true)
       false)
     {
      `description: (+ "Provided a filename, a data buffer, and a MIME type, such as \"text/javascript\", "
                       "triggers a browser download of the provided data with the filename.  Depending "
                       "on the browser configuration, the data will be saved to the configured "
                       "user download directory, or prompt the user for a save location. ")
      `usage: [ "filename:string" "data:*" "content_type:string" ]
      `tags: [ "save" "download" "browser" ]
      })
(undefine `document)


(defun fetch_text (url)
  (let
      ((resp (fetch url)))
    (if resp.ok
      (-> resp `text)
      (throw EvalError (+ "unable to fetch " url ": " resp.status ": " resp.statusText))))
  {
   `description: (+ "Given a url, returns the text content of that url. "
                    "This function is a helper function for the import macro.")
   `usage: [ "url:string" ]
   `tags: [`fetch `text `string ]
   })

;; The import macro handles loading and storage depending on the source

(defmacro import (`& args)
  (let
      ((filespec (last args))
       (is_url? (contains? "://" filespec))       
       (js_mode nil)       
       (url_comps nil)
       (js_mod nil)
       (load_fn nil)
       (target_symbols (if (> args.length 1)
			   args.0))
       (target_path nil)                              
       (acc []))
    (cond
      ;; are we using network resources?
      (or is_url?
	  (not (eq nil location)))
      (progn
	(setq load_fn `fetch_text)   ;; we will use fetch to GET the resource
	(setq url_comps (cond
			   is_url?
			   (new URL filespec)
			   (starts_with? "/" filespec)
			   (new URL (+ "" (prop location `origin) filespec))
			   else
			   (new URL (+ "" (prop location `href) "/" filespec))))
	(setq target_path url_comps.pathname))
      (is_symbol? "read_text_file")
      (progn
	(setq load_fn `read_text_file)
	(setq target_path filespec))
      else
      (throw EvalError (+ "unable to handle import of " filespec)))      
     (cond
	(or (ends_with? ".lisp" target_path)
	    (ends_with? ".juno" target_path))

	`(evaluate (,#(+ "=:" load_fn) ,#filespec)
		   nil
		   (to_object [[ `source_name ,#filespec]
                               [ `throw_on_error true ]]))

	(ends_with? ".json" target_path)
	`(evaluate (JSON.parse (,#(+ "=:" load_fn) ,#filespec))
		   nil
		   (to_object [[`json_in true]
                               [`source_name ,#filespec ]
                               [`throw_on_error true]]))
	
	(or (ends_with? ".js" target_path)
	    (and (is_symbol? `Deno)
		 (ends_with? ".ts" target_path)))
	(progn
	  (cond
	   (== (length target_symbols) 0)
	   (throw SyntaxError "imports of javascript sources require binding symbols as the first argument")
	   (is_array? target_symbols)
	   (progn
	     (push acc
		   `(defglobal ,#target_symbols.0 (dynamic_import ,#filespec)))
	     (push acc
		   `(set_path [ `imports (+ ,#*namespace* "/" (desym ,#target_symbols.0)) ] *env_config* (to_object [[`symbol (desym ,#target_symbols.0) ] [ `namespace ,#*namespace* ] [ `location ,#filespec ]])))
	     (push acc
		   `(when (prop ,#target_symbols.0 `initializer)
		      (-> ,#target_symbols.0 `initializer Environment)))
	     (push acc target_symbols.0)
	   `(iprogn
	      ,@acc))))
	
	else
	(throw EvalError "invalid extension: needs to be .lisp, .js, .json or .juno")))
  { `description: (+ "Load the contents of the specified source file (including path) into the Lisp environment "
		     "in the current namespace.<br>"
		     "If the file is a Lisp source, it will be evaluated as part of the load and the final result returned."
		     "If the file is a JS source, it will be loaded into the environment and a handle returned."
		     "When importing non-Lisp sources (javascript or typescript), import requires a binding symbol in an array "
		     "as the first argument.<br"		     
		     "The allowed extensions are .lisp, .js, .json, .juno, and if the JS platform is Deno, "
		     ".ts is allowed.  Otherwise an EvalError will be thrown due to a non-handled file type."
		     "Examples:<br>"
		     "Lisp/JSON: (import \"tests/compiler_tests.lisp\")<br>"
		     "JS/TS: (import (logger) \"https://deno.land/std@0.148.0/log/mod.ts\"")
		     
   `tags: [`compile `read `io `file `get `fetch `load ]
   `usage: ["binding_symbols:array" "filename:string"] 
   })

(defglobal system_date_format
       {
          `weekday: "long"
          `year: "numeric",
          `month: "2-digit",
          `day: "2-digit",
          `hour: "numeric",
          `minute: "numeric",
          `second: "numeric",
          `fractionalSecondDigits: 3,
          `hourCycle: "h24"
          `hour12: false,
          `timeZoneName: "short"
        }
  {
   `description: (+ "The system date format structure that is used by the system_date_formatter."
                    "If modified, the system_date_formatter, which is a Intl.DateTimeFormat object "
                    "should be reinitialized by calling (new Intl.DateTimeFormat [] system_date_format).")
   `tags: ["time" "date" "system"]
   })
    
    (defglobal system_date_formatter
        (new Intl.DateTimeFormat [] system_date_format)
	{
	 `initializer: `(new Intl.DateTimeFormat [] ,#system_date_format)
         `tags: ["time" "date" "system"]
         `description: "The instantiation of the system_date_format.  See system_date_format for additional information."
	})

    (defun tzoffset ()
        (* 60 (-> (new Date) `getTimezoneOffset))
        {
             `description: "Returns the number of seconds the local timezone is offset from GMT"
             `usage: []
             `tags: ["time" "date" "timezone"]
        })

     
    (defun date_components (date_value date_formatter)
            (if (is_date? date_value)
                (to_object
                  (map (fn (x)
                         [x.type x.value])
                         (if date_formatter
                             (bind_and_call date_formatter date_formatter `formatToParts date_value)
                             (bind_and_call system_date_formatter system_date_formatter `formatToParts date_value))))
                nil)
              {
               `usage: ["date_value:Date" "date_formatter:DateTimeFormat?"] 
               `description: "Given a date value, returns an object containing a the current time information broken down by time component. Optionally pass a Intl.DateTimeFormat object as a second argument."
               `tags: ["date" "time" "object" "component"]
               })
        
    (defun formatted_date (dval date_formatter)
            (let
                ((`comps (date_components dval date_formatter)))
                (if comps
                    (if date_formatter
                        (join "" (values comps)) 
                        (+ "" comps.year "-" comps.month "-" comps.day " " comps.hour ":" comps.minute ":" comps.second))
                    nil))
                ;(-> dval `toString "yyyy-MM-d HH:mm:ss")
            {
             `usage: ["dval:Date" "date_formatter:DateTimeFormat?"]
             `description: "Given a date object, return a formatted string in the form of: \"yyyy-MM-d HH:mm:ss\".  Optionally pass a Intl.DateTimeFormat object as a second argument."
             `tags:["date" "format" "time" "string"]
             })

  (defglobal *LANGUAGE* {})

  (defun dtext (default_text)
        (or
          (prop *LANGUAGE* default_text)
          default_text)
       { `usage: ["text:string" "key:string?"]
         `description: (+ "Given a default text string and an optional key, if a key "  
                          "exists in the global object *LANGUAGE*, return the text associated with the key. "
                          "If no key is provided, attempts to find the default text as a key in the *LANGUAGE* object. "
                          "If that is a nil entry, returns the default text.")
         `tags: ["text" "multi-lingual" "language" "translation" "translate"]
        })

  (defun nth (idx collection)
        (cond 
              (is_array? idx)
              (map (lambda (v) (nth v collection)) idx)
              (and (is_number? idx) (< idx 0) (>= (length collection) (* -1 idx)))
              (prop collection (+ (length collection) idx))
              (and (is_number? idx) (< idx 0) (< (length collection) (* -1 idx)))
              undefined
              else
              (prop collection idx))
        {
           "description":(+ "Based on the index or index list passed as the first argument, " 
                            "and a collection as a second argument, return the specified values " 
                            "from the collection. If an index value is negative, the value "
                            "retrieved will be at the offset starting from the end of the array, "
                            "i.e. -1 will return the last value in the array.")
           "tags":["filter" "select" "pluck" "object" "list" "key" "array"]
           "usage":["idx:string|number|array","collection:list|object"]
         })

true
 

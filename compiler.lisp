
;; DLisp to Javascript Compiler
;; (c) 2022 Kina




;; in the console

;; var { subtype,lisp_writer,clone } = await import("/lisp_writer.js?id=98")

(defglobal `as_lisp
    lisp_writer)

(defmacro `is_reference? (val)
  (and (is_string? val)
       (> (length val) 2)
       (starts_with? (quote "=:") val)))

(defglobal is_reference?
    (fn (val) 
        `(and (is_string? (quotem ,@val))
              (> (length (quotem ,@val)) 2)
              (starts_with? (quote "=:") ,@val)))
    {`eval_when:{ `compile_time: true }})

(defglobal ise?
    (fn (val) 
        (starts_with? (quote "=:") ,@val))
    {`eval_when:{ `compile_time: true }})

(defglobal `Error Error)
(defglobal `TypeError TypeError)
(defglobal `SyntaxError SyntaxError)
(defglobal `null nil)

;; ## will cause a problem

(defglobal `get_outside_global
   (fn (refname)
      (let
        ((`fval (new Function "refname"
           (+ "{ if (typeof " refname " === 'undefined') { return undefined } else { return  " refname " } }"))))
        (fval refname))))

;; returns the first component of an object accessor 

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
          
;; given an array with a path, converts it to JS syntax and returns a string     
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

(defun `cl_encode_string (text)
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


;; Use the host lisp's reader until the reader is constructed...

;; the reader (read_lisp) takes lisp text and converts it into
;; json structures.  

(defun `read_lisp (text)
  (if text
      (do 
       (defvar `tokens (tokenize_lisp text))
       (if tokens
           (tokens_to_json  tokens)
           tokens))
      text) )


;; Given a compiled js tree structure, searches for return markers,
;; and if found, splices in a "return" string in it's place

(defun `splice_in_return (js_tree _ctx _depth)
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
 
  
(defun `add_escape_encoding (text)
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
        text))  
;; Establish an environment counter for identification of environments
((new Function "{ globalThis.environment_counter = 0 }"))

;; and a function that handles the incrementing and returning of the next value
((new Function "get_next_environment_id=function () { globalThis.environment_counter++; return globalThis.environment_counter; }"))        
    
    

;; The flatten_ctx function takes a heirarchical scope structure,
;; and flattens to a single dictionary structure, with local shadowing
;; enforced.

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

(defun `do_deferred_splice (tree)
    (let
        ((`rval nil)
         (`idx 0)
         (`tval nil)
         (`deferred_operator (quote "=$&!")))
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



;; Global Javascript Symbols - the compiler wont by default look for these globals
;; in the Environmentf

(defglobal `external_symbols [`AbortController `AbortSignal `AggregateError `Array `ArrayBuffer
                              `Atomics `BigInt `BigInt64Array `BigUint64Array `Blob `Boolean 
                              `ByteLengthQueuingStrategy `CloseEvent `CountQueuingStrategy 
                              `Crypto `CryptoKey `CustomEvent `DOMException `DataView `Date 
                              `Error `ErrorEvent `EvalError `Event `EventTarget `File `FileReader 
                              `FinalizationRegistry `Float32Array `Float64Array `FormData 
                              `Function `Headers `Infinity `Int16Array `Int32Array `Int8Array 
                              `Intl `JSON `Location `Map `Math `MessageChannel `MessageEvent 
                              `MessagePort `NaN `Navigator `Number `Object `Performance 
                              `PerformanceEntry `PerformanceMark `PerformanceMeasure `ProgressEvent 
                              `Promise `Proxy `RangeError `ReadableByteStreamController
                              `ReadableStream `ReadableStreamDefaultController 
                              `ReadableStreamDefaultReader `ReferenceError `Reflect 
                              `RegExp `Request `Response `Set `SharedArrayBuffer `Storage 
                              `String `SubtleCrypto `Symbol `SyntaxError `TextDecoder 
                              `TextDecoderStream `TextEncoder `TextEncoderStream `TransformStream 
                              `TypeError `URIError `URL `URLSearchParams `Uint16Array 
                              `Uint32Array `Uint8Array `Uint8ClampedArray `WeakMap `WeakRef 
                              `WeakSet `WebAssembly `WebSocket `Window `Worker `WritableStream 
                              `WritableStreamDefaultController `WritableStreamDefaultWriter
                              `__defineGetter__ `__defineSetter__ `__lookupGetter__ 
                              `__lookupSetter__ `_error `addEventListener `alert `atob `btoa 
                              `clearInterval `clearTimeout `close `closed `confirm `console 
                              `constructor `crypto `decodeURI `decodeURIComponent `dispatchEvent 
                              `encodeURI `encodeURIComponent `escape `eval `fetch `getParent
                              `globalThis `hasOwnProperty `isFinite `isNaN `isPrototypeOf `localStorage
                              `location `navigator `onload `onunload `parseFloat `parseInt 
                              `performance `prompt `propertyIsEnumerable `queueMicrotask
                              `removeEventListener `self `sessionStorage `setInterval
                              `setTimeout `structuredClone `toLocaleString `toString 
                              `undefined `unescape `valueOf `window])

;; The compiler functions takes a JSON structure of lisp forms,
;; (presumably the output of the lisp reader), and emits a
;; Javascript representation as text.

;; The compiler takes an Environment, which is an object that
;; is the "root closure".  The environment contains information
;; on global definitions, compilation declarations, and provides
;; evaluation functions.

;; The function returns an array with two elements, the first
;; element is an instruction marker, which is an object that
;; contains various keys which describe, in semantic terms, the
;; returned compiled source, which is the second element in
;; the array.

;; The format described above complies with the internal mechanics
;; of the compilation mechanism, where each specialized compilation
;; function returns an array, where the first element is, in most cases,
;; an instruction signal providing context for WHAT type of compiled
;; output is being returned by the specialized compilation function.

;; [ { INSTRUCTION OBJECT } STATEMENTS ]
;; [ { `ctype: "block" }     "{" "let" [...] "}" ]


;; Options:

;; error_report (fn (errors)) - called with the accumulated compilation errors
;; quiet_mode boolean - if true, logging isn't verbose at all 
;;                      (this will be inversed once the compiler is more stablized)
;; env - environment object to use for the compilation environment





(defun `compiler (quoted_lisp opts)
  (let
      ((`tree quoted_lisp)
       (`op nil)
       (`Environment (or opts.env env))
       (`build_environment_mode (or opts.build_environment false))
       (`env_ref (if build_environment_mode
                     "this"
                     "Environment"))
       (`operator nil)
       (`break_out "__BREAK__FLAG__")
       (`tokens [])
       (`tokenized nil)
       (`log log)
       (`errors [])
       (`warnings [])
       (`blk_counter 0)
       (`ctx nil)
       (`output nil)
       (`log console.log)
       (`defclog (fn (opts)
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
                                                     args))
                                               
                                                       ) )))
       (`quiet_mode (if opts.quiet_mode
                        (do
                         (= log console.log)
                         true)
                        false))
       (`error_log (defclog { `prefix: "Compile Error" `background: "#CA3040" `color: "white" } ))
       (`assembly [])
       (`async_function_type_placeholder (fn () true))
       (`function_type_placeholder (function () true))

        ;; Type Markers are a type of instruction object.

       ;; Type markers are objects that are placed as the first value in a statement
       ;; assembly, typically.  The describe what type of thing is following them in 
       ;; the returned tree.  They used to provide the proper context to the receiving
       ;; assembly, so that the receiving assembly can determine how to syntactically
       ;; place them so to ensure compliance with JS syntax rules.
       ;; Often they are hand constructed in the assembly directly as opposed to calling
       ;; this function.  This is because they are easier to identify in the code at a glance
       ;; and co-exist with other signal keys, such as comments or debugging information.
       
       ;; They are processed and discarded, along with all other complex objects when
       ;; the final assembly is flattened and emitted as JS code.

     
       (`type_marker (fn (type)
                         (set_prop 
                          (new Object)
                          `ctype type
                          `args [])
                         ))
              
       (`return_marker (fn ()
                           { `mark: "rval" }))
       (`entry_signature nil)
       (`temp_fn_asn_template [{"type":"special","val":"=:defvar","ref":true,"name":"defvar"},{"type":"literal","val":"\"\"","ref":false,"name":""},{"type":"arr","val":[{"type":"special","val":"=:fn","ref":true,"name":"fn"},{"type":"arr","val":[],"ref":false,"name":"=:nil"},{"type":"arr","val":[],"ref":false,"name":"=:nil"}],"ref":false,"name":"=:nil"}])
       (`anon_fn_template (-> temp_fn_asn_template `slice 2))
       (`build_fn_with_assignment (fn (tmp_var_name body args)
                                      (let
                                          ((`tmp_template (clone temp_fn_asn_template)))
                                        
                                        (set_prop tmp_template.1
                                                  `name
                                                  tmp_var_name
                                                  `val
                                                  tmp_var_name)
                                        (when (is_array? args)
                                          (set_prop tmp_template.2.val.1
                                                    `val 
                                                    args))
                                        (set_prop tmp_template.2.val.2
                                                  `val
                                                  body)
                                        tmp_template)))
       
       (`build_anon_fn (fn (body args)
                           (let
                               ((`tmp_template (clone anon_fn_template)))
                             (when (is_array? args)
                               (set_prop tmp_template.0.val.1
                                         `val
                                         args))
                             (set_prop tmp_template.0.val.2
                                       `val
                                       body)
                             tmp_template)))


       ;; For optimizations, keep track of referenced global
       ;; symbols.  If defined with the constant attribute,
       ;; they can be declared in an outer closure for speed of
       ;; reference, or if building an environment, the code
       ;; inlined to the declaring symbol (since one cannot
       ;; assume that there is a defined environment yet).
                                                
       (`referenced_global_symbols {})

       ;; A compilation lexical context is established where we
       ;; can store state about declared varables, compilation states,
       ;; and source, etc..

       ;; The new_ctx function creates a new contextual scope which can be a
       ;; root scope if parent is nil, or a contained scope if passed another
       ;; context.
       
       (`new_ctx (fn (parent)
                     (let
                         ((`ctx_obj (new Object)))
                       (set_prop ctx_obj
                                 `scope (new Object)
                                 `parent parent
                                 `ambiguous (new Object)
                                 `defs [])
                       (when parent.source
                         (set_prop ctx_obj
                                   `source
                                   parent.source))
                       (when parent.defvar_eval
                         (set_prop ctx_obj
                                   `defvar_eval
                                   true))
                       (when parent.in_lambda
                         (set_prop ctx_obj
                                   `in_lambda
                                   true))
                       (when parent.hard_quote_mode
                         (set_prop ctx_obj
                                   `hard_quote_mode
                                   true))
                       (when parent.block_step
                         (set_prop ctx_obj
                                   `block_step
                                   parent.block_step))
                       (when parent.block_id
                         (set_prop ctx_obj
                                   `block_id
                                   parent.block_id))
                       (when parent.suppress_return
                         (set_prop ctx_obj
                                   `suppress_return
                                   parent.suppress_return))            
                       (when parent.in_try
                         (set_prop ctx_obj
                                   `in_try
                                   (prop parent `in_try)))
                       (when parent.return_point
                         (set_prop ctx_obj
                                   `return_point
                                   (+ parent.return_point 1)))
                       ctx_obj)))

      
       
       (`set_ctx_log (if opts.quiet_mode
                         log
                         (defclog { `prefix: "set_ctx" `background: `darkgreen `color: `white } )))

       
       ;; given a ctype value, returns a type value 
       ;; for the ctype.  
       (`map_ctype_to_value (fn (ctype value)
                                (cond 
                                  (== ctype "Function")
                                  Function
                                  (== ctype "AsyncFunction")
                                  AsyncFunction
                                  (== ctype "Number")
                                  Number
                                  (== ctype "expression")
                                  Expression 
                                  (and (is_string? ctype)
                                       (contains? "block" ctype))
                                  AsyncFunction
                                  (== ctype "array")
                                  Array
                                  (== ctype "Boolean")
                                  Boolean
                                  (== ctype "nil")
                                  NilType
                                  else
                                  value)))
       ;; sets a value in the current compilation context
       (`map_value_to_ctype (fn (value)
                                (cond
                                  (== Function value)
                                  "Function"
                                  (== AsyncFunction value)
                                  "AsyncFunction"
                                  (== Number value)
                                  "Number"
                                  (== Expression value)
                                  "Expression"
                                  (== Array value)
                                  "array"
                                  (== Boolean value)
                                  "Boolean"
                                  (== NilType value)
                                  "nil"
                                  else
                                  value)))
       (`set_ctx (fn (ctx name value)
                     (do 
                      (set_ctx_log "set_ctx:  ref:" name "type: " (sub_type value) "val: " (clone value))
                      
                                        ;(= name (sanitize_js_ref_name name))
                      (if (and (is_array? value)
                               value.0.ctype)
                          (set_prop ctx.scope
                                    name
                                    (cond
                                      (== value.0.ctype "Function")
                                      Function
                                      (== value.0.ctype "AsyncFunction")
                                      AsyncFunction
                                      (== value.0.ctype "expression")
                                      Expression
                                      else
                                      value.0.ctype))
                          (set_prop ctx.scope
                                    name
                                    value)))))

       ;; Retrieves a value from the current compilation context

       (`get_ctx_val (fn (ctx name)
                         (let
                             ((`ref_name nil))
                           (cond 
                             (is_nil? name)
                             (throw TypeError (+ "get_ctx_val: nil identifier passed: " (sub_type name)))
                             (is_number? name)
                             name
                             (is_function? name)
                             (throw (+ "get_ctx_val: invalid identifier passed: " (sub_type name)))
                             else
                             (do
                              (if (starts_with? (quote "=:") name)
                                  (= ref_name (-> name `substr 2))
                                  (= ref_name name))
                              (= ref_name (first (get_object_path ref_name)))
                               (cond
                                 (prop op_lookup ref_name)
                                 AsyncFunction
                                 (not (== undefined (prop ctx.scope ref_name)))
                                 (prop ctx.scope ref_name)
                                 ctx.parent
                                 (get_ctx ctx.parent ref_name)))))))
       
       (`is_ambiguous? (fn (ctx name)
                           (let
                             ((`ref_name nil))
                             (cond
                               (is_nil? ctx)
                               (throw TypeError (+ "is_ambiguous?: nil ctx passed"))
                               (is_nil? name)
                               (throw TypeError (+ "is_ambiguous?: nil reference name passed"))
                               (not (is_string? name))
                               (throw TypeError (+ "is_ambiguous?: reference name given is a " (sub_type name) ", requires a string"))
                               else
                               (do
                                  (if (starts_with? (quote "=:") name)
                                      (= ref_name (-> name `substr 2))
                                      (= ref_name name))
                                  (= ref_name (first (get_object_path ref_name)))
                                  (cond
                                      (prop ctx.ambiguous ref_name)
                                      true
                                      ctx.parent
                                      (is_ambiguous? ctx.parent ref_name)))))))
                                  
       (`set_ambiguous (fn (ctx name)
                           (set_prop ctx.ambiguous
                                     name
                                     true)))
                                 
       (`unset_ambiguous (fn (ctx name)
                           (delete_prop ctx.ambiguous
                                     name)))                        
                                
       (`invalid_js_ref_chars "+?-&^#!*[]~{}|")
       (`invalid_js_ref_chars_regex (new RegExp "[+?\\-&^#!*()\\[\\]~]" `g))
       
       (`check_invalid_js_ref (fn (symname)
                                  (cond
                                    (not (is_string? symname))
                                    false
                                    (is_reference? symname)
                                    (> (length (scan_str invalid_js_ref_chars_regex (-> symname `substr 2))) 0)
                                    else
                                    (> (length (scan_str invalid_js_ref_chars_regex symname)) 0))))
       
       (`sanitize_js_ref_name (fn (symname)
                                  (cond 
                                    (not (is_string? symname))
                                    symname
                                    else
                                    (let
                                        ((`text_chars (split_by "" symname))
                                         (`acc []))
                                      
                                      
                                      (for_each (`t text_chars)
                                                (cond (== t "+")
                                                      (push acc "_plus_")
                                                      (== t "?")
                                                      (push acc "_ques_")
                                                      (== t "-")
                                                      (push acc "_dash_")
                                                      (== t "&")
                                                      (push acc "_amper_")
                                                      (== t "^")
                                                      (push acc "_carot_")
                                                      (== t "#")
                                                      (push acc "_hash_")
                                                      (== t "!")
                                                      (push acc "_exclaim_")
                                                      (== t "*")
                                                      (push acc "_star_")
                                                      (== t "~")
                                                      (push acc "_tilde_")
                                                      (== t "|")
                                                      (push acc "_pipe_")
                                                      (contains? t "(){}")
                                                      (throw SyntaxError (+ "Invalid character in symbol: " symname))
                                                      else
                                                      (push acc t)))
                                      (join "" acc)))))
                                    
       ;; find_in_context - returns the contextual details about where and what
       ;; a symbol or reference refers to, or the literal value itself.
       
       (`find_in_context (fn (ctx name)
                             (let
                                 ((`symname (cond (and (is_string? name)
                                                       (> (length name) 2)
                                                       (starts_with? (quote "=:") name))
                                                  (-> name `substr 2)
                                                  (is_string? name)
                                                  name
                                                  else
                                                  nil))
                                        ;(`cannot_be_js_global (check_invalid_js_ref symname))
                                  (`ref (and symname (is_reference? name)))
                                  (`is_literal? (or (is_number? name)
                                                    (and (not ref) (is_string? name))
                                                    (and ref (== "nil" symname))
                                                    (and ref (== "null" symname))
                                                    (and ref (== "undefined" symname))
                                                    (and ref (== "else" symname))
                                                    (and ref (== "catch" symname))
                                                    (== true name)
                                                    (== false name)))  ;; literals 
                                        ;(`nada (log "find_in_context: symname: " symname "ref: " ref "is_literal?" is_literal?))
                                  (`special (and ref symname (contains? symname (conj ["unquotem" "quotem"] (keys op_lookup)))))
                                  (`local (and (not special)
                                               (not is_literal?)
                                               symname 
                                               ref
                                               (get_ctx_val ctx symname)))
                                  (`global (and (not special) 
                                                (not is_literal?)
                                                ref
                                                symname 
                                                (get_lisp_ctx symname))) ;(prop Environment.context.scope symname)))
                                  (`val (cond is_literal?
                                          name
                                          (is_array? name)
                                          name
                                          (is_object? name)
                                          name
                                          special
                                          name
                                          local
                                          local
                                          (and global
                                               (not (== global NOT_FOUND)
                                                    ))
                                          global
                                          (== symname name)
                                          name)))
                               
                               {   `type: (cond (is_array? name)
                                                "arr"
                                                (is_object? name)
                                                (sub_type name)
                                                special
                                                "special"
                                                is_literal?
                                                "literal"
                                                local
                                                (sub_type local)
                                                global
                                                (sub_type global)
                                                (and ref symname)
                                                "unbound"
                                                else
                                                (do
                                                 (error_log "find_in_context: unknown type: " name)
                                                 "??")
                                                )
                               `name: (cond (and symname
                                                 ref)
                                            (sanitize_js_ref_name symname)
                                            (and false is_literal?
                                                 (is_string? val))
                                            (sanitize_js_ref_name name)
                                            is_literal?
                                            (if ref (sanitize_js_ref_name name)
                                                name)
                                            else
                                            nil)
                               `val: val
                               `ref: (if ref true false)
                               `local: (or local nil)
                               `global: (or (and global
                                                 (not (== NOT_FOUND global)))
                                            nil)
                               })))
       
       
       (`get_ctx (fn (ctx name)
                     (let
                         ((`ref_name nil))
                                        ;(log "get_ctx: " (sub_type name) name)
                       (cond 
                         (is_nil? name)
                         (throw SyntaxError (+ "get_ctx: nil identifier passed: " (sub_type name)))
                         (is_number? name)
                         name
                         (is_function? name)
                         (throw SyntaxError (+ "get_ctx: invalid identifier passed: " (sub_type name)))
                         else
                         (do
                          (= ref_name (first (get_object_path name)))
                          
                          (cond
                            (not (== undefined (prop ctx.scope ref_name)))
                            (prop ctx.scope ref_name)
                            ctx.parent
                            (get_ctx ctx.parent ref_name)))))))
                                        ; else
                                        ;(find_in_context (+ (quote "=:") name))))) ;; external context
       
       (`get_source_chain (fn (ctx sources)
                              (if ctx
                                  (let
                                      ((`sources (or sources [])))
                                    (when ctx.source
                                      (push sources ctx.source))
                                    (if ctx.parent
                                        (get_source_chain ctx.parent sources)
                                        sources)))))
       (`NOT_FOUND  "__!NOT_FOUND!__")
       (`NOT_FOUND_THING (fn () true))
       (`get_lisp_ctx (fn (name)
                          (if (not (is_string? name))
                              (throw Error "Compiler Error: get_lisp_ctx passed a non string identifier")
                              (let
                                  ((`comps (get_object_path name))
                                   (`cannot_be_js_global (check_invalid_js_ref comps.0))
                                   (`ref_name (take comps))
                                   (`ref_type (or (prop root_ctx.defined_lisp_globals ref_name)
                                                  (-> Environment `get_global ref_name NOT_FOUND_THING cannot_be_js_global))))
                                
                                
                                (log "get_lisp_ctx: symbol name:" ref_name "type:" (if (== NOT_FOUND_THING ref_type) "[NOT FOUND]" ref_type) "extern_safe:" (not cannot_be_js_global)  "found in external env:" (not (== NOT_FOUND_THING ref_type)))
                                (when (and (not (== NOT_FOUND_THING ref_type))
                                           (not (contains? ref_name standard_types))
                                    (set_prop referenced_global_symbols
                                              ref_name
                                              ref_type)))
                                ;(log "get_lisp_ctx: found in Environment? " (-> Environment `get_global ref_name NOT_FOUND_THING cannot_be_js_global))
                                ;(log "    root_ctx: " (clone root_ctx))
                                (cond 
                                  (== NOT_FOUND_THING ref_type)
                                  (do 
                                    (log "get_lisp_ctx: returning undefined for " name)      
                                    undefined ); ref_type
                                  (== comps.length 0)
                                  (do 
                                      ;(log "get_lisp_ctx: [basic reference]" name " returning: " ref_type)
                                      ref_type)
                                  
                                  (and (== comps.length 1)
                                       (is_object? ref_type)
                                       (contains? comps.0 (object_methods ref_type)))
                                  (prop ref_type comps.0)
                                  
                                  (is_object? ref_type)
                                  (resolve_path comps ref_type)
                                  
                                  else
                                  (do
                                   (log "get_lisp_ctx: symbol not found: " name ref_name ref_type cannot_be_js_global)
                                   (console.error "compile: get_lisp_ctx: symbol not found: " name)
                                   ;(error_log "get_lisp_ctx: unhandled name structure: " name)
                                   undefined)
                                   ;(throw SyntaxError (+ "get_lisp_ctx: unhandled name structure: " name))
                                   )))))
       
       
       (`get_val (fn (token ctx)
                     (do
                                        (log "get_val: ->" token ctx)
                      (cond
                        token.ref
                        (do 
                            (log "get_val: sanitized reference: " (sanitize_js_ref_name (expand_dot_accessor token.name ctx)))
                            (sanitize_js_ref_name (expand_dot_accessor token.name ctx)))
                        else
                        token.val))))
       (`has_lisp_globals false)
       (`root_ctx   (new_ctx (or opts.ctx)))
       (`lisp_global_ctx_handle Environment.context)
       (`tokenize_object (fn (obj)
                             (do
                              ;(log "tokenize_object: " (keys obj) (as_lisp obj))
                              (if  (== (JSON.stringify obj) "{}")
                                   (do 
                                        ;(log "tokenize_object: returning {}")
                                    { `type: "object" `ref: false `val: "{}" `name: "{}" `__token__:true })
                                   (for_each (`pset (pairs obj))
                                             (do
                                        ;(log "pset: " pset)
                                              {`type: `keyval `val: (tokenize pset) `ref: false `name: (desym pset.0) `__token__:true }))))))
                                        ;{`type: `value `val:(tokenize pset.1) `ref: (is_reference? pset.1) `name: (desym pset.1) } ])))) )
       
       
       (`tokenize_quote (fn (args)
                            (do
                                        ;(log "tokenize_quote->" args)
                                        ;(console.log "tokenize_quote->" args)
                             (cond
                               (== args.0 (quote "=:quote"))
                               {`type: `arr `__token__:true `source: (as_lisp args) `val: (conj [ { `type: `special `val: (quote "=:quote") `ref: true `name: "quote" `__token__:true } ] (-> args `slice 1)) `ref: (is_reference? args) `name: nil  }
                               (== args.0 (quote "=:quotem"))
                               {`type: `arr `__token__:true `source: (as_lisp args) 
                               `val: (conj [ { `type: `special `val: (quote "=:quotem") `ref: true `name: "quotem" `__token__:true } ] (-> args `slice 1)) `ref: (is_reference? args) `name: nil  }
                               else
                               {`type: `arr `__token__:true `source: (as_lisp args) 
                               `val: (conj [ { `type: `special `val: (quote "=:quotel") `ref: true `name: "quotel" `__token__:true } ] (-> args `slice 1)) `ref: (is_reference? args) `name: nil  }))))
       ;; pass 1: build up a structure containing categorizations of the code to be compiled.
       
       (`tokenize   (fn (args ctx)
                        (let
                            ((`argtype nil)
                             (`rval nil)
                             (`qval nil)
                             (`argdetails nil)
                             (`argvalue nil)
                                        ;(`tstate (or tstate { `in_quotem: false } ))
                             (`is_ref nil))
                          (log "tokenize:" (sub_type args) args)
                          (when (is_array? args)
                            (= args (compile_time_eval ctx args)))   ;; check to see this is an eval_when compile function, and evaluate it if so.
                          (cond 
                            (or (is_string? args)
                                (is_number? args)
                                (or (== args true) (== args false)))
                            (first (tokenize [ args ] ctx))
                            (and (is_array? args)
                                 (or (== args.0 (quote "=:quotem"))
                                     (== args.0 (quote "=:quote"))
                                     (== args.0 (quote "=:quotel"))))
                            (do
                                        ;(log "tokenize -> " args)
                             (= rval (tokenize_quote args))
                             ;(console.log "tokenize: A: returning quote/m:" rval)
                             rval)
                            (and (not (is_array? args))
                                 (is_object? args))
                            (first (tokenize [args]))
                            else
                            (do
                             
                             ;(log "tokenize:<-" (sub_type args) args)
                             (for_each (`arg args)
                              (do
                               (= argdetails (find_in_context ctx arg))
                               
                               ;(log "tokenize: argdetails: " (clone argdetails))
                                (= argvalue argdetails.val)
                                (= argtype argdetails.type)
                                
                                (= is_ref argdetails.ref)
                                        ;(log "tokenize: " arg argtype argvalue)
                                        ;(console.log "tokenize->: " arg)
                                (cond
                                  (== (sub_type arg) "array")
                                  {`type: `arr `__token__:true `source: (as_lisp arg) `val: (tokenize arg ctx) `ref: is_ref `name: nil  }
                                  (== argtype "Function")
                                  {`type: `fun `__token__:true `val: arg `ref: is_ref `name: (desym arg)}
                                  (== argtype "AsyncFunction")
                                  {`type: `asf `__token__:true `val: arg `ref: is_ref `name: (desym arg)}
                                  (== argtype "array")
                                  {`type: `array `__token__:true `val: arg `ref: is_ref `name: (desym arg)}
                                  (== argtype "Number")
                                  {`type: `num `__token__:true `val: argvalue `ref: is_ref  `name: (desym arg)}
                                  (and (== argtype "String") is_ref)
                                  {`type: `arg `__token__:true `val: argvalue `ref: is_ref `name: (desym arg) `global: argdetails.global `local: argdetails.local }
                                  (== argtype "String")
                                  {`type: `literal `__token__:true `val:  argvalue `ref: is_ref `name: (desym arg) `global: argdetails.global}
                                  (is_object? arg)
                                  (do 
                                   {`type: `objlit `__token__:true `val: (tokenize_object arg) `ref: is_ref `name: nil})
                                  (and (== argtype "literal") is_ref (== (desym arg) "nil"))
                                  {`type: `null `__token__:true `val: null `ref: true `name: "null"}
                                  (and (== argtype "unbound") is_ref (eq nil argvalue))
                                  {`type: "arg" `__token__:true `val: arg `ref: true `name: (desym arg)}
                                  (and (== argtype "unbound") is_ref)
                                  {`type: (sub_type argvalue) `__token__:true `val: argvalue `ref: true `name: (sanitize_js_ref_name (desym arg))}
                                  
                                        ;(== argtype "Boolean")
                                        ;{`type: `bool `__token__:true `val: argvalue `ref: false `name: arg}
                                  else
                                  {`type: argtype `__token__:true `val: argvalue `ref: is_ref `name: (desym arg) `global: argdetails.global `local: argdetails.local}))))))))
       ;; checks to see if the first argument to the passed array is 
       ;; a compile time function, as registered in the environment's definitions 
       ;; structure 
       (`comp_time_log (defclog { `prefix: "compile_time_eval" `background: "#C0C0C0" `color: "darkblue" }))
       (`compile_time_eval 
         (fn (ctx lisp_tree)
             (if (and (is_array? lisp_tree)
                      (is_reference? lisp_tree.0)
                      ;; is this a compile time function?  Check the definition in our environment..
                      (resolve_path [ `definitions (-> lisp_tree.0 `substr 2) `eval_when `compile_time] Environment ))
                 (let
                     ((`ntree nil))
                   (comp_time_log "->" lisp_tree "to function: " (-> lisp_tree `slice 1))
                   (try
                      (= ntree (apply (-> env `get_global (-> lisp_tree.0 `substr 2)) (-> lisp_tree `slice 1)))
                      (catch Error (`e)
                        (do
                         (console.error "precompilation error: " e)
                         )))
                   (if (eq nil ntree)
                       (comp_time_log "unable to perform compilation time operation")
                       (do
                         (comp_time_log "applied:" ntree)
                       
                         (= ntree (do_deferred_splice ntree))
                         (comp_time_log "<- lisp: ", (as_lisp (clone ntree)))
                         (comp_time_log "<-", (clone ntree))))
                   ntree)
                 
                 lisp_tree)))
       (`infix_ops   (fn (tokens ctx opts)
                         (let
                             ((`op_translation {
                                               `or: "||"
                                               `and: "&&"
                                               })
                              (`math_op (prop (first tokens) `name))
                              (`math_op (or (prop op_translation math_op) math_op))
                              (`idx 0)
                              (`stmts nil)
                              (`is_overloaded false)
                              (`token nil)
                              (`add_operand (fn ()
                                                (when (and (> idx 1)
                                                           (< idx (- tokens.length 0)))
                                                  (push acc math_op))))
                              (`acc [{"ctype":"expression"}]))
                           (when (and (or (== tokens.1.type `objlit)
                                          (== tokens.1.type `arr))
                                      (== math_op `+))
                             (= is_overloaded true))
                           
                           (log "infix +>" math_op is_overloaded (rest tokens))
                           (if is_overloaded
                               (do
                                (set_prop tokens
                                          0
                                          { `type: "function"
                                          `val: (+ (quote "=:") `add)
                                          `name: "add"
                                          `ref: true })
                                (= stmts (compile tokens ctx))
                                (log  "infix (overloaded +): <-" stmts)
                                (= stmts (wrap_assignment_value stmts))
                                ;; BACKTOHERE
                                (log  "infix <- " stmts)
                                stmts)
                                
                               (do
                                (push acc "(")
                                (while (< idx (- tokens.length 1))
                                 (do
                                  (inc idx)
                                  (= token (prop tokens idx))
                                   (add_operand)
                                   (push acc (wrap_assignment_value (compile token ctx)))
                                   
                                   (log "infix <- " token (last acc))))
                                 (push acc ")")
                                acc)))))
       
       (`compile_set_prop (fn (tokens ctx)
                              (let
                                  ((`acc [])
                                   (`wrapper [])
                                   (`stmt nil)
                                   (`token (second tokens))
                                   (`target_reference (gen_temp_name "target_obj"))
                                   (`complicated (is_complex? token.val))
                                   (`target (if complicated
                                                (compile_wrapper_fn token.val ctx)
                                                (compile token ctx)))
                                   (`idx 1))
                                (log "compile_set_prop: tokens: " tokens)
                                (log "compile_set_prop: target: " target) 
                                (for_each (`t ["await" " " "async" " " "function" "()" "{" "let" " " target_reference "=" target ";" ] )
                                          (push wrapper t))
                                (while (< idx (- tokens.length 1))
                                       (do
                                        (inc idx)
                                        (push acc target_reference)
                                         (= token (prop tokens idx))
                                         (log "compile_set_prop: " target_reference  idx "token: " token)
                                         (push acc "[")
                                         (= stmt (wrap_assignment_value (compile token ctx)))
                                         (push acc stmt)
                                         (push acc "]")
                                         (inc idx)
                                         (push acc "=")
                                         (= token (prop tokens idx))
                                         (if (eq nil token)
                                             (throw Error "set_prop: odd number of arguments"))
                                         (= stmt (wrap_assignment_value (compile token ctx)))
                                         (push acc stmt)
                                         ;(if (is_complex? token.val)
                                          ;   (push acc (compile_wrapper_fn token.val ctx))
                                           ;  (push acc (compile token ctx)))
                                         (push acc ";")))
                                
                                (push wrapper acc)
                                (push wrapper "return")
                                (push wrapper " ")
                                (push wrapper target_reference)
                                (push wrapper ";")
                                (push wrapper "}")
                                (push wrapper "()")
                                (log "compile_set_prop: " (join "" (flatten wrapper)))
                                wrapper)))
       
       
       (`compile_prop  (fn (tokens ctx)
                           (let
                               ((`acc [])
                                (`target (wrap_assignment_value (compile (second tokens) ctx)))
                                (`idx_key (wrap_assignment_value (compile (prop tokens 2) ctx))))
                             [ "(" target ")" "[" idx_key "]"])))
       
       (`compile_elem (fn (token ctx)
                          (let
                              ((`rval nil))
                            (log "compile_elem: -> complex?" (is_complex? token.val) token)
                            (if (is_complex? token.val)
                                (= rval (compile_wrapper_fn token ctx))
                                (= rval (compile token ctx)))
                            (when (not (is_array? rval))
                              (= rval [ rval ]))
                            (log "compile_elem: <-" (join "" (flatten rval)))
                            rval)))
       (`inline_log (if opts.quiet_mode
                        log
                        (defclog { `prefix: "compile_inline:" `background: "#404880" `color: "white" } )))
       (`compile_inline (fn (tokens ctx)
                            (let
                                ((`rval nil)
                                 (`stmt nil)
                                 (`has_literal? false)
                                 (`args []))
                              (inline_log "->" tokens)
                                        ;(for_each (`token (-> tokens `slice 1))
                                        ;   (do
                                        ;      (inline_log "compiling: " token)
                                        ;     (when false;(== token.type "arr")
                                        ;(== token.type "literal")
                              
                                        ;      (= has_literal? true))))
                              
                              
                              
                              
                              (inline_log "has_literal?" has_literal?)
                              (inline_log tokens.0.name  args (prop Environment.inlines tokens.0.name))
                              (if has_literal?
                                  (compile_scoped_reference tokens ctx)
                                  (do
                                   (for_each (`token (-> tokens `slice 1))
                                             (do
                                              (inline_log "compiling: " token)
                                              (= stmt (compile_elem token ctx))
                                               (push args stmt)))
                                   
                                   (if (prop Environment.inlines tokens.0.name)
                                       (= rval ((prop Environment.inlines tokens.0.name)
                                                args))
                                       (throw ReferenceError (+ "no source for named lib function " tokens.0.name)))
                                    ;; join together to a unit expression
                                    (= rval (flatten rval))
                                    (inline_log "<-" rval)
                                   rval)))))
       
       
       (`compile_push (fn (tokens ctx)
                          (let
                              ((`acc [])
                               (`place (compile_elem tokens.1 ctx))
                               (`thing (compile_elem tokens.2 ctx)))
                            [ place ".push" "(" thing ")"])))
       
       
       (`compile_list 
         (fn (tokens ctx)
             (let
                 ((`acc [])
                  (`contents nil))
               (log "compile_list: -> " tokens)
               (= contents (compile_wrapper_fn (-> tokens `slice 1) ctx))
                                        ;(push_as_arg_list acc contents)
               (log "compile_list: <- " contents)
               contents)))
       (`compile_typeof
         (fn (tokens ctx)
             ["typeof" " " (compile_elem tokens.1 ctx) ]))
       (`compile_instanceof 
         (fn (tokens ctx)
             (let
                 ((`acc []))
               (log "compile_instanceof: -> " tokens)
               (if (and (is_array? tokens)
                        (== tokens.length 3))
                   [ "("
                   (if (is_complex? tokens.1)
                       (compile_wrapper_fn tokens.1 ctx)
                       (compile tokens.1 ctx))
                   
                   " "
                   "instanceof"
                   " "
                   (if (is_complex? tokens.1)
                       (compile_wrapper_fn tokens.2 ctx)
                       (compile tokens.2 ctx)) 
                   ")"]
                   (throw SyntaxError "instanceof requires 2 arguments")))))
       
       (`compile_compare (fn (tokens ctx)
                             (let
                                 ((`acc [{ `ctype: "expression" } ])
                                  (`ops {
                                        `eq: "=="
                                        `==: "==="
                                        `<:   "<"
                                        `>:  ">"
                                        `gt: ">"
                                        `lt: "<"
                                        `<=: "<="
                                        `>=: ">="
                                        })
                                  (`operator (prop ops 
                                                   (prop (first tokens) `name)))
                                  
                                  (`left (prop tokens 1))
                                  (`right (prop tokens 2)))
                               (log "compile_compare: " operator left right)
                               (push acc "(")
                               (push acc (compile left ctx))
                               (push acc operator)
                               (push acc (compile right ctx))
                               (push acc ")")
                               acc)))
       
       (`compile_assignment (fn (tokens ctx)
                                (let
                                    ((`acc [])
                                     (`assignment_operator (prop (first tokens) `name))
                                     (`token (second tokens))
                                     (`assignment_value nil)
                                     (`assignment_type nil)
                                     (`wrap_as_function? nil)
                                     (`target (cond
                                                token.ref
                                                token.name
                                                else
                                                (throw Error "assignment: invalid target: " token.name)))
                                     (`target_details (get_declaration_details ctx token.name))
                                     (`target_location_compile_time (cond
                                                                      target_details.is_argument
                                                                      "local"
                                                                      target_details.declared_global
                                                                      "global"
                                                                      else
                                                                      "local")))
                                  
                                  (log "compile_assignment: -> " tokens)
                                  (log "compile_assignment: target_details: " target_details)
                                  (log "compile_assignment: " assignment_operator target "location:" target_location_compile_time)
                                  
                                  (unset_ambiguous ctx target)
                                  
                                  (set_prop ctx
                                            `in_assignment true)
                                  (= assignment_value (compile tokens.2 ctx))
                                  
                                  (if (and (is_array? assignment_value)
                                           (is_object? assignment_value.0)
                                           assignment_value.0.ctype)
                                      (do 
                                         (= assignment_type
                                            (map_ctype_to_value assignment_value.0.ctype assignment_value)))
                                                 
                                      (do
                                         (console.warn "compile_assignment: undeclared assignment type: " target)
                                         (set_ambiguous ctx target)
                                         (= assignment_type
                                            UnknownType)))
                                              
                                           
                                  (log "compile_assignment: target is: " target " type: " assignment_type " value: " (clone assignment_value))
                                  (= assignment_value (wrap_assignment_value assignment_value))
                                   
                                   
                                  
                                  ;(set_ctx ctx
                                   ;        target
                                    ;       assignment_value)
                                  
                                  
                                  
                                  (if (== target_location_compile_time "local")
                                      (do
                                       (set_ctx ctx
                                                target
                                                assignment_type)
                                       (push acc target)
                                       (push acc "=")
                                        (push acc assignment_value))
                                      (do
                                       (for_each (`t [{ `ctype: "statement"} "await" " " "Environment" "." "set_global" "(" "\"" target "\"" "," assignment_value ")"])
                                                 (push acc t))))
                                  
                                  
                                 
                                  
                                  
                                  (set_prop ctx
                                            `in_assignment false)
                                  
                                  (if (== target_location_compile_time "local")
                                      (set_ctx ctx
                                               target
                                               assignment_type))
                                  
                                  
                                  
                                        ;(push acc assignment_value)
                                  
                                  ;(push acc ";")
                                  (log "compile_assignment: <-" acc)
                                  acc)))
       (`needs_return? (fn (stmts ctx)
                           (if (> (length stmts) 0)
                               (let
                                   ((`final_stmt (last stmts))
                                    (`inst nil)
                                    (`clog (if opts.quiet_mode
                                               log
                                               (defclog { `prefix: (+ "needs_return (" ctx.block_id ")") `background: "#C0C0C0" `color: `darkgreen } )))
                                    (`flattened nil))
                                 (clog "-> " stmts)
                                 (clog "block_step:" ctx.block_step)
                                 (clog "final -> " final_stmt)
                                 (cond 
                                   (eq nil final_stmt)
                                   (do
                                    (clog "empty stmts: " stmts)
                                    false)
                                   (and (not (is_array? final_stmt))
                                        (not (== "}" final_stmt)))
                                   true
                                        ;(and (is_object? (first stmts))
                                        ;    (contains? "block" (prop (first stmts) `ctype)))
                                        ;false
                                   else
                                   (do
                                    (map (fn (stmt idx)
                                             (clog "idx:" idx " stmt ->" stmt))
                                         stmts)
                                    (= flattened (flatten final_stmt))
                                     (clog "first flattened:" (first flattened) (sub_type flattened) )
                                     ;; check for instructions on the last statment
                                     ;; if there is a comment present, then check for the second
                                     (cond  
                                       (and (is_object? (first flattened))
                                            (prop (first flattened) `ctype))
                                       (= inst (first flattened))
                                       (and (is_string? (first flattened))
                                            (starts_with? "/*" (first flattened))
                                            (is_object? (second flattened))
                                            (prop (second flattened) `ctype))
                                       (= inst (second flattened)))
                                     
                                     (clog "inst: " inst (not (contains? (first flattened) ["__BREAK__FLAG__" "let" "{" "if" "return" "throw"])) (join "" flattened))
                                     
                                     (cond
                                       (and inst
                                            (== inst.ctype) "objliteral")
                                       true
                                       (and inst
                                            (or (== inst.ctype "ifblock")
                                                (== inst.ctype "letblock")
                                                (== inst.ctype "block")
                                                (== inst.ctype "assignment")
                                                (== inst.ctype "return")))
                                       false
                                       (and (== (first flattened) "{"))
                                        ;(contains? (second flattened) ["__BREAK__FLAG__" "let" "if" "return" "throw"]))
                                       false
                                       (contains? (first flattened) ["__BREAK__FLAG__" "let" "if" "return" "throw"])
                                       false
                                       (eq nil (first flattened))
                                       false
                                       else
                                       (do
                                        (clog "- returning true")
                                        true)))))
                               false)))
       (`compile_block (fn (tokens ctx block_options)
                           (let
                               ((`acc [])
                                (`block_id (or (and block_options.name
                                                    (+ block_options.name (inc blk_counter)))
                                               (inc blk_counter)))
                                (`clog (if quiet_mode
                                           log
                                           (defclog { `prefix: (+ "compile_block (" block_id "):") 
                                             `background: (color_for_number (random_int 10000) (+ 0.3 (/ (random_int 3) 10)) 0.5) `color: "white"})))
                                (`ctx (new_ctx ctx)) ;; get a local reference
                                (`token nil)
                                (`last_stmt nil)
                                (`return_last ctx.return_last_value)
                                (`stmt nil)
                                (`stmts [])
                                (`idx 0))
                             (when tokens.1.source
                               (set_prop ctx
                                         `source
                                         tokens.1.source))
                             
                             (set_prop ctx
                                       `block_id
                                       block_id)
                             (clog "start: return_point:" ctx.return_point "return_last:" return_last  "num_steps: " (- tokens.length 1) tokens)
                             (when (not block_options.no_scope_boundary)
                               (push acc "{"))
                                        ;(when true ; block_options.new_scope
                                        ;     (= ctx (new_ctx ctx)))
                                        ;(when ctx.source (push acc { `comment: (+ "" ctx.source " " ) }))
                                        ;(push stmts { `comment: (+ "block start  block_id: " (or ctx.block_id "") "  block_step: " ctx.block_step " total steps: " (- tokens.length 1) " return_point: " ctx.return_point) })      
                             (while (< idx (- tokens.length 1))
                                    (do
                                     (inc idx)
                                     
                                     (= token (prop tokens idx))
                                      (when (== idx (- tokens.length 1))
                                        (set_prop ctx
                                                  `final_block_statement
                                                  true))
                                      (set_prop ctx
                                                `block_step 
                                                (- tokens.length 1 idx))
                                      (clog "step start:  block_step:" ctx.block_step "source:" token.source)
                                      (if (and (== token.type "arr")
                                               (== token.val.0.name "return"))
                                          (do 
                                        ;(clog "return_point:" ctx.return_point idx "..compiling a return")
                                        ;(push acc { `comment: (+ "return: block_id: " (or ctx.block_id "") "  block_step: " ctx.block_step ) })      

                                           (push stmts (compile_return token.val ctx))
                                           (= stmt []))
                                          (do 
                                           (clog "compiling standard token -> " token)
                                           
                                           
                                           (= stmt (compile token ctx)))
                                          )
                                      
                                        ;(push stmts { `comment: (+ "block_id: " (or ctx.block_id "") "  block_step: " ctx.block_step " source: " ctx.source) })      
                                      
                                      (clog "return_point: " ctx.return_point "block_step:" ctx.block_step "rtn?:" return_last "stmnt: " stmt (length stmt))
                                      (cond 
                                        (and (== stmt.0 break_out)
                                             (== stmt.1 "=")
                                             (== stmt.2 "true"))
                                        (do
                                         (clog "return_point: " ctx.return_point "block_step:" ctx.block_step  "break out:" stmt)
                                         ;; essentially no op
                                         true)
                                        
                                        else
                                        true) ;; disabled due to return issue
                                        
                                      (clog "in block:<-" stmt)
                                      (when (and (> ctx.block_step 0)
                                                 (is_object? (first stmt))
                                                 (prop (first stmt) `ctype)
                                                 (== (prop (first stmt) `ctype) "AsyncFunction"))
                                        (push stmts "await")
                                        (push stmts " "))
                                      (push stmts stmt)
                                      (when (< idx (- tokens.length 1))
                                        (push stmts ";"))))
                             ;; Now depending on the last value in the stmts array, insert a return
                             (clog "compile_block: suppress_return set: " ctx.suppress_return)
                             (when (and (not ctx.suppress_return)
                                        (or 
                                         (and ;return_last 
                                          (needs_return? stmts ctx))
                                         (and (> idx 1)
                                              (needs_return? stmts ctx))))
                               (clog  "needs return statement: block_step:" ctx.block_step)
                               
                               
                               (= last_stmt (pop stmts))
                               (clog "block_step:" ctx.block_step "last stmt: " last_stmt)
                               
                               (push stmts
                                     "return")
                               (push stmts " ")
                               (push stmts last_stmt))
                             
                                        ;(when ctx.source (push acc { `comment: (+ "" ctx.source " " ) }))  
                             (push acc stmts)
                             (when (not block_options.no_scope_boundary)
                               (push acc "}"))
                             (clog "end: block_step: " ctx.block_step (flatten acc))
                             (prepend acc { `ctype: "block" } )
                             acc)))
       
       (`Expression (new Function "" "{ return \"expression\" }"))
       (`Statement (new Function "" "{ return \"statement\" }"))
       (`NilType (new Function "" "{ return \"nil\" }"))
       (`UnknownType (new Function "" " { return \"unknown\"} "))
       (`compile_defvar (fn (tokens ctx )
                            (let
                                ((`target (sanitize_js_ref_name tokens.1.name))
                                 (`wrap_as_function? nil)
                                 (`ctx_details nil)
                                 (`check_needs_wrap 
                                   (fn (stmts)
                                       (let
                                           ((`fst (+ "" (or (and (is_array? stmts)
                                                                 (first stmts)
                                                                 (is_object? (first stmts))
                                                                 (prop (first stmts) `ctype))
                                                            ""))))
                                         (log "compile_defvar: check_needs_return: " fst (sub_type fst))
                                         (cond
                                           (contains? "block" fst)
                                           true
                                           else
                                           false))))
                                 (`assignment_value nil))
                              
                              (log "compile_defvar: ->" tokens)
                              (= assignment_value
                                 (do 
                                  (flatten [(compile tokens.2 ctx)])))
                              (log "compile_defvar: compile returned:" assignment_value)
                              (= wrap_as_function? (check_needs_wrap assignment_value))
                              
                              (log "compile_defvar: target: " target "wrap?" wrap_as_function? "assignment:" assignment_value)
                              
                              (= ctx_details (get_declaration_details ctx target))
                              (log "compile_defvar: ctx_details:" ctx_details)
                              (if (and (is_array? assignment_value)
                                       (is_object? assignment_value.0)
                                       assignment_value.0.ctype)
                                  (do 
                                   (set_ctx ctx
                                            target
                                            (map_ctype_to_value assignment_value.0.ctype assignment_value))
                                            
                                   
                                   (when wrap_as_function?
                                         (= assignment_value [ { `ctype: "AsyncFunction" } "await" " " "(" "async" " " "function" " " "()" assignment_value ")" "()" ])))
                                  
                                  (set_ctx ctx
                                           target
                                           assignment_value))
                              (log "compile_defvar: assignment_value: " assignment_value)
                              (if ctx.defvar_eval
                                  (do
                                   (remove_prop ctx
                                                `defvar_eval)
                                   [{ `ctype: "assignment"  } "let" " " target "=" assignment_value "()" ";"])
                                  [{ `ctype: "assignment"  } (if (and ctx_details.is_argument
                                                                      (==  ctx_details.levels_up 1))
                                                                 ""
                                                                 "let ") 
                                  "" target "=" assignment_value ";"]))))
       ;; checks to see what has been declared during compilation and returns where
       ;; it only checks for declarations that have occurred during the compile phase
       
       (`get_declaration_details (fn (ctx symname _levels_up)                         
                                     (cond 
                                       (and (prop ctx.scope symname)
                                            (prop ctx `lambda_scope))
                                       { `name: symname 
                                       `is_argument: true 
                                       `levels_up: (or _levels_up 0) 
                                       `value: (prop ctx.scope symname)
                                       `declared_global: (if (prop root_ctx.defined_lisp_globals symname) true false) }
                                       (prop ctx.scope symname)
                                       { `name: symname 
                                       `is_argument: false 
                                       `levels_up: (or _levels_up 0) 
                                       `value: (prop ctx.scope symname) 
                                       `declared_global: (if (prop root_ctx.defined_lisp_globals symname) true false) }
                                       
                                       (and (eq (prop ctx `parent) nil)
                                            (prop root_ctx.defined_lisp_globals symname))
                                       { `name: symname 
                                       `is_argument: false 
                                       `levels_up: (or _levels_up 0) 
                                       `value: (prop ctx.scope symname)
                                       `declared_global: true }
                                       ctx.parent
                                       (get_declaration_details ctx.parent symname (or (and _levels_up (+ _levels_up 1)) 1))
                                       (not (== NOT_FOUND_THING (-> Environment `get_global symname NOT_FOUND_THING)))
                                       { `name: symname
                                       `is_argument: false
                                       `levels_up: (or _levels_up 0)
                                       `value: (-> Environment `get_global symname)
                                       `declared_global: true })))
       
       (`wrap_assignment_value (fn (stmts)
                                  (let
                                     ((`fst (+ "" (or (and (is_array? stmts)
                                                           (first stmts)
                                                           (is_object? (first stmts))
                                                           (prop (first stmts) `ctype)
                                                           (cond
                                                               (is_string? (prop (first stmts) `ctype))
                                                               (prop (first stmts) `ctype)
                                                               else
                                                               (sub_type (prop (first stmts) `ctype))))
                                                      ""))))
                                        
                                     (log "wrap_assignment_value: check_needs_return: " fst (sub_type fst))
                                     (cond
                                       (== "ifblock" fst)
                                       [{`ctype: "AsyncFunction" }  "await" " " "(" "async" " " "function" " " "()" " " "{" " " (splice_in_return stmts) " " "}" ")" "()" ]
                                       (contains? "block" fst)
                                       [{`ctype: "AsyncFunction" }  "await" " " "(" "async" " " "function" " " "()" " "  " " stmts " "  ")" "()" ]
                                       else
                                       stmts))))
       (`compile_let (fn (tokens ctx)
                         (let
                             ((`acc [])
                              (`ctx (new_ctx ctx))
                              (`clog (if quiet_mode
                                         log
                                         (defclog { `prefix: (+ "compile_let: " (or ctx.block_id "")) `background: (color_for_number (random_int 10000) 0.2 0.8) `color: "black"})))
                              (`token nil)
                              (`assignment_value nil)
                              (`assignment_type nil)
                              (`reference_name nil)
                              (`alloc_set nil)
                              (`ctx_details nil)
                              (`allocations tokens.1.val)
                              (`block (-> tokens `slice 2))
                              (`idx -1))
                           (clog "compile_let ->: " (prop tokens.1 `val))
                           (set_prop ctx
                                     `return_last_value
                                     true)
                           (push acc "{")
                           (when ctx.source (push acc { `comment: (+ "let start " ctx.source " " ) }))
                           
                           ;; let must be two pass, because we need to know all the symbol names being defined in the 
                           ;; allocation block because let allows us to refer to symbol names out of order, similar to
                           ;; let* in Common Lisp.  
                           
                           ;; First pass: build symbols in context for the left hand side of the allocation forms
                           ;; set them to functions
                           
                           (while (< idx (- allocations.length 1))
                              (do
                                  (inc idx)
                                  (= alloc_set (prop (prop allocations idx) `val))
                                  (= reference_name (sanitize_js_ref_name alloc_set.0.name))
                                  (= ctx_details (get_declaration_details ctx reference_name))
                                  ;; if it isn't an argument to a potential parent lambda, set the ctx 
                                  (if (not (and ctx_details.is_argument
                                                (== ctx_details.levels_up 1)))
                                        
                                   ;; set a placeholder for the reference
                                      (set_ctx ctx
                                               reference_name 
                                               AsyncFunction)) ;; assume callable for recursion
                                  (clog "set ctx placeholder for " reference_name ": " (get_ctx ctx reference_name) (clone ctx))))
                                  
                                  
                           ;; reset our index to the top of the allocation list
                           (= idx -1)
                           
                           (while (< idx (- allocations.length 1))
                                  (do
                                    (inc idx)
                                    (= alloc_set (prop (prop allocations idx) `val))
                                    (clog "compiling: alloc_set:" (is_complex? alloc_set.1) alloc_set)
                                    (= reference_name (sanitize_js_ref_name alloc_set.0.name))
                                    (= ctx_details (get_declaration_details ctx reference_name))
                                    
                                    ;(clog "compiling: reference_name:" reference_name)
                                    ;(clog "ctx_details:" (clone ctx_details))
                                    ;; set a placeholder for the reference
                                    ;(set_ctx ctx
                                     ;        reference_name 
                                      ;       AsyncFunction) ;; assume callable for recursion
                                    ;(clog "ctx set for " reference_name ": " (get_ctx ctx reference_name) (clone ctx))
                                    (cond
                                      (is_array? alloc_set.1.val)
                                      (do
                                       (set_prop ctx
                                                 `in_assignment
                                                 true)
                                       (= assignment_value (compile alloc_set.1 ctx))
                                       ;(clog "<- compiled stmt: " (clone assignment_value))
                                       
                                       (set_prop ctx 
                                                  `in_assignment
                                                  false))
                                      else
                                      (do 
                                       (clog "compiling simple assignment valu for " reference_name  ": " alloc_set.1)
                                       (= assignment_value (compile alloc_set.1 ctx))
                                       
                                       ;(clog "setting simple assignment value for" reference_name ": <- " (clone assignment_value))
                                       ))
                                   
                                   
                                    
                                    (if (and (is_array? assignment_value)
                                             (is_object? assignment_value.0)
                                              assignment_value.0.ctype)
                                         (do 
                                           (set_ctx ctx
                                                    reference_name
                                                    (map_ctype_to_value assignment_value.0.ctype assignment_value)))
                                         (do 
                                             (console.warn "compile_assignment: undeclared assignment type: " reference_name)
                                             (set_ctx ctx
                                                      reference_name
                                                      assignment_value)))
                                           
                                           
                                     (= assignment_value (wrap_assignment_value assignment_value))
                                    ;
                                    (clog "set context for " reference_name " assignment value: " (clone assignment_value))
                                    (cond
                                      (and (is_array? assignment_value)
                                           (is_object? (first assignment_value))
                                           (prop (first assignment_value) `ctype))
                                      (= assignment_type (take assignment_value))
                                      (prop op_lookup alloc_set.1.val.0.name)
                                      (= assignment_type Function)
                                      else
                                      (= assignment_type (sub_type assignment_value)))
                                        ;(set_ctx ctx
                                        ;        reference_name (or assignment_type.ctype
                                        ;                          assignment_type))
                                    
                                        ;(log "compile_let: compiling: ref:" reference_name "=" (join "" (flatten assignment_value)))
                                    (if (and ctx_details.is_argument
                                             (== ctx_details.levels_up 1))
                                        true   ;; test for whether or now we need to declare it without getting in trouble with JS
                                        (do 
                                         (push acc "let")   ;; depending on block status, this may be let for a scoped {}
                                         (push acc " ")))
                                    (push acc reference_name)
                                    (push acc "=")
                                    (push acc assignment_value)
                                    (push acc ";"))) ;/*LET*/")))
                           (clog "assignments complete:" (join "" (flatten acc)))
                           (push acc (compile_block (conj ["PLACEHOLDER"]
                                                          block)
                                                    ctx
                                                    {
                                                    `no_scope_boundary: true
                                                    }))
                           (push acc "}")
                           (clog "return_point: " ctx.return_point)
                           (clog "<-" (flatten acc))
                           (console.log "compile_let: <-" acc)
                           (if (== ctx.return_point 1)
                               acc
                               (do
                                (prepend acc { `ctype: "letblock" })
                                acc)))))
       (`fn_log (defclog { `prefix: "compile_fn" `background: "black" `color: `lightblue }))
       (`compile_fn (fn (tokens ctx fn_opts)
                        (let
                            ((`acc [])
                             (`idx -1)
                             (`arg nil)
                             (`ctx (new_ctx ctx))
                             (`fn_args tokens.1.val)
                             (`body tokens.2)
                             (`type_mark nil)
                             (`nbody nil))
                          
                          (set_prop ctx
                                    `return_last_value
                                    true)
                          (set_prop ctx
                                    `return_point
                                    0)
                          (set_prop ctx
                                    `in_lambda
                                    true)         
                          (set_prop ctx
                                    `lambda_scope
                                    true)
                          (if fn_opts.synchronous
                              (do
                               (= type_mark (type_marker `Function))
                               (push acc type_mark))
                              (do
                               (= type_mark (type_marker `AsyncFunction))  
                               (push acc type_mark)
                                (push acc "async")
                                (push acc " ")))  ;; async by default
                          (fn_log "->" tokens)
                          (set_prop type_mark
                                    `args
                                    [])       
                          (push acc "function")
                          (push acc "(")
                          (while (< idx (- fn_args.length 1))
                                 (do
                                  (inc idx)
                                  (= arg (prop fn_args idx))
                                   (fn_log "argument: " arg)                                  
                                   (if (== arg.name "&")
                                       (do
                                         (inc idx)
                                         (= arg (prop fn_args idx))
                                         (when (eq nil arg)
                                           (throw SyntaxError "Missing argument symbol after &"))
                                         (log "compile_fn: & rest args: " arg)  
                                         (set_ctx ctx
                                                  arg.name
                                                  "?arg")
                                         (set_prop arg
                                                   `name 
                                                   (+ "..." arg.name)))
                                       (do
                                         (set_ctx ctx
                                                  arg.name
                                                  "?arg")))
                                   (push acc
                                         arg.name)
                                   (push type_mark.args  ;; add to our type marker details
                                         arg.name)
                                   (when (< idx (- fn_args.length 1))
                                     (push acc ","))))
                          (push acc ")")
                          (push acc " ")
                          
                          (fn_log "body: is_block?" (is_block? body.val) body)
                          (set_prop ctx
                                    `return_last_value
                                    true)
                          
                          (cond 
                            (== body.val.0.name `let)
                            (do 
                             
                             (push acc (compile body.val
                                                ctx)))
                            (== body.val.0.name `do)
                            (do 
                             (fn_log "do block: " body.val)
                             (push acc (compile_block body.val
                                                      ctx)))
                            
                            else  ;; make a pseudo-block
                            (do 
                             
                             (= nbody [{
                                `type: "special",
                                `val: (quote "=:do"),
                                `ref: true,
                                `name: "do"
                                }
                                body])
                             (set_prop ctx
                              `return_last_value
                              true)
                              (fn_log "nbody: " nbody)
                              (push acc (compile_block nbody
                                                       ctx))))
                              
                          (fn_log "<-" (clone acc))
                          acc)))
                      
        (`compile_jslambda (fn (tokens ctx)
                               (let
                                   ((`acc [])
                                    (`fn_args tokens.1.val)
                                    (`body tokens.2.val)
                                    (`idx -1)
                                    (`quoted_body [])
                                    (`arg nil)
                                    (`type_mark (type_marker `Function)))
                                    
                                  (push acc type_mark)
                                  (for_each (`t ["new" " " "Function" "("])
                                    (push acc t))
                                  
                                  (while (< idx (- fn_args.length 1))
                                      (do
                                        (inc idx)
                                        (= arg (prop fn_args idx))
                                        (set_ctx ctx
                                                  arg.name
                                                  "?arg")
                                        (push acc
                                            (+ "\"" arg.name "\""))
                                        (push type_mark.args  ;; add to our type marker details
                                             arg.name)
                                        (push acc ",")))
                                  (push acc "\"")
                                  ;; escape all quotes in the lambda body as it is a string we are passing
                                  (for_each (`c (split_by "" body))
                                   (do
                                     (when (not (== c "\n")
                                                (== c "\r"))
                                         (when (== c "\"")
                                            (push quoted_body (String.fromCharCode 92)))
                                          (push quoted_body c))))
                                  (push acc (join "" (flatten quoted_body)))
                                  (push acc "\"")
                                  (push acc ")")
                                 (console.log "compile_jslambda: " acc)
                                 (log "compile_jslambda: <-" (flatten acc))
                                  acc)))
                                   
                                        
                      
       (`var_counter 0)
       ;; the complicated form conversions
       (`gen_temp_name (fn (arg)
                           (+ "dl_" (or arg "") "_tmp_" (inc var_counter))))
       (`cond_log     (if opts.quiet_mode
                          log
                          (defclog { `prefix: "compile_cond" `color: "white" `background: "darkblue"})))
       (`compile_cond (fn (tokens ctx)
                          [{ `ctype: "AsyncFunction" }  "await" " " "async" " " "function" "()" "{" (compile_cond_inner tokens ctx) "}()"]))
       (`compile_cond_inner 
         (fn (tokens ctx)
             (let
                 ((`acc [])
                  (`prebuild [])
                  (`conditions [])
                  (`stmts nil)
                  (`fst nil)
                  (`inject_return false)
                  (`block_stmts nil)
                  (`needs_braces? false)
                  (`check_needs_return 
                    (fn (stmts)
                        (do
                         (= fst (+ "" (or (and (is_array? stmts)
                                               (first stmts)
                                               (is_object? (first stmts))
                                               (prop (first stmts) `ctype))
                                          "")))
                         (cond_log "check_needs_return: " fst (sub_type fst))
                          (cond
                            (contains? "block" fst)
                            (do 
                             (if (== fst "ifblock")
                                 (= needs_braces? true)
                                 (= needs_braces? false))
                             false)
                            (== (first stmts) "throw")
                            (do 
                             (= needs_braces? true)
                             false)
                            else
                            (do 
                             (= needs_braces? true)
                             true)))))
                  (`idx 0)
                  (`condition nil)
                  (`condition_block nil)
                  (`condition_tokens (-> tokens `slice 1)))
               (cond_log "compile_cond: condition_tokens: " condition_tokens)
               (cond 
                 (not (== (% condition_tokens.length 2) 0))
                 (throw SyntaxError "cond: Invalid syntax: missing condition block")
                 (== condition_tokens.length 0)
                 (throw SyntaxError "cond: Invalid syntax: no conditions provided"))
               
               (while (< idx condition_tokens.length)
                      (do
                       (= inject_return false)
                       (= condition (prop condition_tokens idx))
                        (inc idx)
                        (= condition_block (prop condition_tokens idx))
                        (cond_log idx "condition:" condition)
                        (cond_log idx "  c block:" condition_block)
                        
                        (when (> idx 2)
                          (push acc " ")
                          (push acc "else")
                          (push acc " "))
                        (when (not (== condition.name "else"))
                          (push acc "if")
                          (push acc " ")
                          (push acc "("))
                        
                        
                        (cond 
                          (is_form? condition)
                          (do 
                           (= stmts (compile condition ctx))
                           (cond_log "<- condition (form): " stmts)
                            
                            (push acc " ")
                            (push acc stmts))
                          (== condition.name "else")
                          (cond_log "else block")
                          else 
                          (do 
                           (= stmts (compile condition ctx))
                           (cond_log "<- condition: " stmts)
                            (push acc stmts)))
                        (when (not (== condition.name "else"))
                          (push acc ")"))
                        (push acc " ")
                        ;; now compile the conditions
                        (= stmts (compile condition_block ctx))
                        (cond_log "<-condition block" stmts)
                        (when (check_needs_return stmts)
                          (= inject_return true))
                        (cond_log "cond block needs return?" inject_return  "needs braces?" needs_braces?)
                        (when needs_braces?
                          (push acc "{")
                          (push acc " "))
                        (when inject_return
                          (push acc "return")
                          (push acc " "))
                        (if (== condition_block.type "arr")
                            (do 
                             
                             (push acc stmts))
                            (do 
                             (cond_log "compile_cond: simple condition_block")
                             (push acc stmts)))
                        (when needs_braces?
                          (push acc "}"))
                        (cond_log "compile_cond: acc: " acc)
                        (inc idx)))
               
               acc)))
       
       (`compile_if (fn (tokens ctx)
                        (let
                            ((`acc [])
                             (`stmts nil)
                             (`fst nil)
                             (`if_log (if opts.quiet_mode
                                          log
                                          (defclog { `prefix: (+ "compile_if (" ctx.block_id ")") `background: "#10A0A0" `color: `white })))  
                             (`inject_return false)
                             (`block_stmts nil)
                             (`in_suppress? ctx.suppress_return)
                             (`test_form tokens.1)
                             (`if_true tokens.2)
                             (`compiled_test nil)
                             (`compiled_true nil)
                             (`compiled_false nil)
                             (`if_false tokens.3)
                             (`needs_braces? false)
                             (`check_needs_return 
                               (fn (stmts)
                                   (do
                                    (= fst (+ "" (or (and (is_array? stmts)
                                                          (first stmts)
                                                          (is_object? (first stmts))
                                                          (prop (first stmts) `ctype))
                                                     "")))
                                    (if_log "check_needs_return: " fst (sub_type fst))
                                     (cond
                                       (contains? "block" fst)
                                       (do 
                                        (if (== fst "ifblock")
                                            (= needs_braces? true)
                                            (= needs_braces? false))
                                        false)
                                       (== (first stmts) "throw")
                                       (do 
                                        (= needs_braces? false)
                                        false)
                                       (and (== ctx.block_step 0)
                                            (< ctx.return_point 3))
                                       (do 
                                        (if_log "end of block-> block_step 0, return_point < 2")
                                        (= needs_braces? true)
                                        true)
                                       (and (== ctx.block_step 0)
                                            (> ctx.return_point 2))
                                       (do 
                                        (if_log "end of block-> block_step 0, return_point > 1")
                                        (= needs_braces? true)
                                        true)
                                       (> ctx.block_step 0)
                                       (do 
                                        (= needs_braces? true)
                                        false)
                                       else
                                       (do 
                                        (if_log "check_needs_return: " ctx.block_step  "defaulting to true")
                                        (= needs_braces? true)
                                        true))))))
                          
                          (if_log "start: block_id: " ctx.block_id "block_step:" ctx.block_step "return_point:" ctx.return_point tokens)
                          (if_log "test_form: " test_form.source test_form)
                          (if_log "if_true: " if_true.source if_true)
                          (if_log "if_false: " if_false.source if_false)
                                        ;(if (not ctx.return_point)
                          (push acc { `ctype: "ifblock" })
                          (when ctx.source (push acc { `comment: (+ "" ctx.source " " ) }))
                                        ;(push acc { `comment: (+ "start_if:" ctx.source " ") })
                                        ;(push acc { `comment: (+ "block_id: " (or ctx.block_id "") "  block_step: " ctx.block_step ) })
                          (= compiled_test (compile_elem test_form ctx))
                          (when (> ctx.block_step 0)
                            (set_prop ctx
                                      `suppress_return
                                      true))
                          (if_log "compiled_test:" compiled_test)
                                        ;(push acc (+ "/* if start: block_id: " ctx.block_id " block_step: " ctx.block_step " */"))
                          (if (and (is_object? (first compiled_test))
                                   (prop (first compiled_test) `ctype)
                                   (contains? "unction" (prop (first compiled_test) `ctype)))
                              (for_each (`t ["if" " " "(" "await" " " compiled_test "()" ")"])
                                        (push acc t))
                              (for_each (`t ["if" " " "("  compiled_test ")"])
                                        (push acc t)))
                          
                          
                          (= compiled_true (compile if_true ctx))
                          (= inject_return (check_needs_return compiled_true))
                          
                          (if_log "if_true <- inject_return?" inject_return "stmt:" compiled_true)
                          
                          (when needs_braces?
                            (push acc "{")
                            (push acc " "))
                          (push acc (return_marker))
                          (when inject_return
                            (push acc "return")
                            (push acc " "))
                          (push acc compiled_true)
                          (when needs_braces?
                            (push acc "}"))
                          (when if_false
                            (= compiled_false (compile if_false ctx))
                            (= inject_return (check_needs_return compiled_false))
                            (if_log "if_false <-" compiled_false)
                            (push acc " " )
                            (push acc "else")
                            (push acc " ")
                            (when needs_braces?
                              (push acc "{")
                              (push acc " "))
                            (push acc (return_marker))
                            (when inject_return
                              (push acc "return")
                              (push acc " "))
                            (push acc compiled_false)
                            (when needs_braces?
                              (push acc "}")))
                          
                          (if_log "<-" (flatten acc))
                          (set_prop ctx
                                    `suppress_return
                                    in_suppress?)
                          acc)))                     
       (`cwrap_log (if quiet_mode
                       log
                       (defclog { `color: "darkgreen;" })))
       (`compile_wrapper_fn (fn (tokens ctx opts)
                                (let
                                    ((`acc [])
                                     (`ctx ctx)
                                     (`needs_await true))
                                  (cwrap_log "compile_wrapper_fn: tokens: block?" (is_block? tokens) "form?" (is_form? tokens) tokens)
                                  (cond
                                    (and (is_object? tokens)
                                         (not (is_array? tokens))
                                         (not (== tokens.type "arr")))
                                    (do 
                                     (= needs_await false)
                                     (cwrap_log "compile_wrapper_fn: simple form - just compiling")
                                      (= acc [(compile tokens ctx)]))
                                    
                                    (is_block? tokens)
                                    (do
                                     (cwrap_log "compile_wrapper_fn: wrapping block in anon func" tokens)
                                     (= ctx (new ctx))
                                      (set_prop ctx
                                                `return_point
                                                1)
                                      (= acc ["(" "async" " " "function" "()" "{" (compile tokens ctx) "}" ")""()"]))
                                    (and (is_object? tokens)
                                         (== tokens.val.0.name "if"))
                                    (do 
                                     (= ctx (new ctx))
                                     (set_prop ctx
                                      `return_point
                                      1)
                                      (for_each (`t ["(" "async" " " "function" "()" "{" (splice_in_return (compile_if tokens.val ctx)) "}" ")" "()" ])
                                                (push acc t)))
                                    (is_array? tokens)
                                    (do
                                     (cwrap_log "compile_wrapper_fn: tokens is array:" tokens)
                                     (= acc (compile_block_to_anon_fn tokens ctx)))
                                    (and (is_object? tokens)
                                         tokens.val
                                         (== tokens.type "arr"))
                                    (do 
                                     
                                     (= acc (compile_block_to_anon_fn tokens.val ctx))))
                                  (cwrap_log "compile_wrapper_fn: <- " (join "" (flatten acc)))
                                        ; (when needs_await 
                                        ;(push acc "await")
                                        ;(push acc " "))
                                  (if needs_await 
                                      ["await" " " acc]
                                      [acc]))))
       
       (`compile_block_to_anon_fn (fn (tokens ctx opts)
                                      (let
                                          ((`acc [])
                                           (`ctx (new_ctx ctx)))
                                        (set_prop ctx
                                                  `return_point
                                                  0)
                                        (log "compile_block_to_anon_fn: tokens: block?" (is_block? tokens) "return_point: " ctx.return_point tokens)
                                        (cond
                                          (is_block? tokens)
                                          (do
                                           (set_prop ctx
                                                     `return_last_value
                                                     true)
                                           (set_prop ctx
                                            `return_point
                                            0)
                                        ;(push acc "/* compile_block_to_anon_fn (block) */")
                                            (for_each (`t ["(" "async" " " "function" "()" (splice_in_return (compile_block tokens ctx)) ")" "()" ])
                                                      (push acc t)))
                                          (== tokens.0.name "let")
                                          (do 
                                           (set_prop ctx
                                                     `return_last_value
                                                     true)
                                           (set_prop ctx
                                            `return_point
                                            0)
                                            (for_each (`t ["(" "async" " " "function" "()" (splice_in_return (compile tokens ctx)) ")" "()"])
                                                      (push acc t)))
                                          else
                                          (do
                                        ;(push acc "/* compile_block_to_anon_fn */")
                                           (set_prop ctx
                                                     `return_last_value
                                                     true)
                                           (set_prop ctx
                                            `return_point
                                            0)
                                            (for_each (`t ["(" "async" " " "function" "()" "{" " " "return"  " "(compile tokens ctx) " " "}" ")" "()"  ])
                                                      (push acc t))))
                                        (log "compile_block_to_anon_fn: <-" (flatten acc))
                                        acc)))
       (`make_do_block (fn (tokens)
                           (let
                               ((`preamble  (clone { "type": "arr"
                                                   "ref": false
                                                   "name": nil
                                                   "val": [] }))
                                (`place preamble.val))
                             (push place
                                   {
                                   "type": "special",
                                   "val": (quote "=:do")
                                   "ref": true,
                                   "name": "do"
                                   })
                             
                             (cond (is_array? tokens)
                                   (for_each (`token tokens)
                                             (push place token))
                                   else
                                   (for_each (`token [ tokens ])
                                             (push place token)))
                             preamble)))
       
       (`push_as_arg_list (fn (place args)
                              (do 
                               (map (fn (v i t)
                                        (do
                                         (push place v)
                                         (when (<= i (- t 2))
                                           (push place ","))))
                                    args)
                               place)))
       (`compile_new (fn (tokens ctx)
                         (let
                             ((`acc [])
                              (`prebuild [])
                              (`target_type tokens.1.name)
                              (`complex? false)
                              (`rval_ref nil)
                              (`new_arg_name nil)
                              (`args [])
                              (`ctx (new_ctx ctx))
                              (`new_opts (-> tokens `slice 2)))
                           (log "compile_new: target_type: " target_type)
                           (for_each (`opt_token (or new_opts []))
                                     (do
                                      (log "compile_new: opt_token: complex?"  (is_complex? opt_token.val) opt_token)
                                      (if (is_complex? opt_token.val)
                                          (do
                                           (push args (compile_wrapper_fn opt_token ctx)))
                                          (do 
                                           (push args (compile opt_token ctx))))))
                           (log "compile_new: complex: " complex? "args: " args)
                           (if complex?     
                               (do
                                (= rval_ref (gen_temp_name "rval_new"))
                                (prepend prebuild [ "{" " " "let" " " rval_ref ";/*NEW2*/" ])
                                 (for_each (`t ["return" " " "new" " " target_type "("])
                                           (push prebuild t))
                                 (push_as_arg_list prebuild args)
                                 (push prebuild ")")
                                 (push prebuild " ")
                                 (push prebuild "}")
                                 (for_each (`arg ["(" "async" " " "function" "()" " " prebuild "()" ")"])
                                           (push acc arg)))
                               (do
                                (for_each (`arg ["new" " " target_type "("])
                                          (push acc arg))
                                (push_as_arg_list acc args)
                                 (push acc ")")))
                           (log "compile_new: <-" (join "" (flatten acc)))
                           acc)))
       
       
       (`compile_val_mod (fn (tokens ctx)
                             (let
                                 ((`target_location (cond 
                                                      (get_ctx ctx tokens.1.name)
                                                      "local"
                                                      (get_lisp_ctx tokens.1.name)
                                                      "global"))
                                  (`target tokens.1.name)
                                  (`operation (cond
                                                (and (== target_location "local")
                                                     (== tokens.0.name "inc"))
                                                "+="
                                                (and (== target_location "local")
                                                     (== tokens.0.name "dec"))
                                                "-="
                                                (== tokens.0.name "inc")
                                                "+"
                                                else
                                                "-"))
                                  (`mod_source nil)
                                  (`how_much (or (and tokens.2
                                                      (compile tokens.2 ctx)) 
                                                 1)))
                               (log "compile_val_mod: " target operation target_location tokens)
                               (if (== target_location "global")
                                   (do
                                    (= has_lisp_globals true)
                                    (= mod_source (+ "(" operation " " target " " how_much ")"))
                                    ["await" " " "Environment.set_global(\"" target "\","
                                     (compile (tokenize (read_lisp mod_source)
                                                        ctx)
                                              ctx) ")"])
                                   [target operation how_much]))))                         
       
       (`try_log (if opts.quiet_mode
                     log
                     (defclog { `prefix: "compile_try"  `background: "violet" `color: `black })))                           
       (`compile_try (fn (tokens ctx)
                         [ { `ctype: "AsyncFunction" } "await" " " "(" "async" " " "function" "()" "{" (splice_in_return (compile_try_inner tokens ctx)) "}" ")" "()" ]))
       
       (`compile_try_inner
         (fn (tokens ctx)
             (let
                 ((`acc [])
                  (`try_block tokens.1.val)
                  (`catch_block nil)
                  (`the_exception_ref (gen_temp_name "exception"))
                  (`exception_ref nil)
                  (`orig_ctx ctx)
                  (`fst nil)
                  (`needs_braces? false)
                  (`check_needs_return 
                    (fn (stmts)
                        (do
                         (= fst (or (and (is_array? stmts)
                                         (first stmts)
                                         (is_object? (first stmts))
                                         (prop (first stmts) `ctype))
                                    ""))
                         (try_log "check_needs_return: " fst (sub_type fst))
                          (cond
                            (contains? "block" fst)
                            (do 
                             (when (== fst "ifblock")
                               (= needs_braces? true))
                             false)
                            else
                            (do 
                             (= needs_braces? true)
                             true)))))
                  (`insert_catch_block 
                    (fn (err_data stmts)
                        (let
                            ((`complete false))
                          (when (== err_data.idx 0)
                            (for_each (`t [" " "catch" "(" the_exception_ref ")" " " "{" " "  ] )
                                      (push acc t)))
                          (when (== err_data.error_type "Error")
                            (= base_error_caught true))
                          (when (or (== err_data.error_type "Error") ;; catches all
                                    (== err_data.idx (- err_data.total_catches 1))) ;; final one
                            (= complete true))
                          
                          (when (>  err_data.idx 0)
                            (for_each (`t [" " "else" " " ])
                                      (push acc t)))
                          (for_each (`t [" " "if" " " "(" the_exception_ref " " "instanceof" " " err_data.error_type ")" " " "{" " " "let" " " err_data.error_ref "=" the_exception_ref ";" " " ] )
                                    (push acc t))
                                        ;(when err_data.needs_braces
                                        ; (push acc "{" )
                                        ;(push acc (+ "/* br " err_data.idx " */")))
                          (when err_data.insert_return
                            (push acc " ")
                            (push acc "return")
                            (push acc " "))
                          (push acc stmts)
                          
                          (push acc "}")
                          (when (and (== err_data.idx (- err_data.total_catches 1))
                                     (not base_error_caught))
                            (for_each (`t [ " " "else" " " "throw" " " the_exception_ref ";"])
                                      (push acc t)))
                          (when complete
                            (for_each (`t [" " "}"])
                                      (push acc t)))
                          complete)))
                  
                  (`insert_return? false)
                  (`complete? false)
                  (`ctx (new_ctx ctx))
                  (`stmts nil)
                  (`idx 0)
                  (`base_error_caught false)
                  (`catches (-> tokens `slice 2)))
               (try_log "->" tokens)
               (try_log "complex?: " (is_complex? try_block) "try block:"  try_block)
               (try_log "catches: " catches)
               (when (== (length catches) 0)
                 (throw SyntaxError "try: missing catch form"))
               (set_prop ctx
                         `return_last_value
                         true)
               (set_prop ctx
                         `in_try
                         true)
               (= stmts (compile try_block ctx))
                                        ;(= insert_return? (check_needs_return stmts))
               
               (try_log "compiled try block: " stmts)
               (try_log "try block needs return?: " insert_return? "needs braces?" needs_braces?)
               (if (is_complex? try_block)
                                        ;(contains? try_block.0.name ["do" "progn" "let"])
                                        ;(== try_block.1.type "arr"))
                   
                   (for_each (`t ["try" " " "/* TRY COMPLEX */ "   stmts " " ])
                             (push acc t))
                   (for_each (`t ["try" " " "/* TRY SIMPLE */ " "{" " "  stmts " " "}"])
                             (push acc t)))
               (try_log "compiled try:" (flatten acc))
               (while (< idx catches.length)
                      (do 
                       (= catch_block (prop (prop catches idx) `val))
                       (try_log "catch block tokens:" catch_block)
                        (try_log "catch block:" catch_block.3)
                        (set_ctx ctx
                                 catch_block.2.val.0.name
                                 (new catch_block.1.name))
                        (= stmts (compile catch_block.3 ctx))
                        (= insert_return? (check_needs_return stmts))
                                        ;(= stmts (compile_block_to_anon_fn catch_block.3.val ctx))
                        (try_log "compiled catch block:" stmts)
                        (try_log "block needs return?" insert_return? "needs_braces?" needs_braces?)
                        (= complete?
                           (insert_catch_block { `insert_return: insert_return? 
                                               `needs_braces: needs_braces?
                                               `error_type: catch_block.1.name
                                               `error_ref: catch_block.2.val.0.name
                                               `idx: idx
                                               `total_catches: catches.length
                                               } stmts))
                        (if complete?
                            (== idx catches.length))  ;; break out
                        (inc idx)))
               
               
               
               (try_log "<-" (join "" (flatten acc)))
               acc
               )))
       
      
                              
       (`compile_throw (fn (tokens ctx)
                           (let
                               ((`acc [])
                                (`error_message nil)
                                (`error_instance nil))
                             (log "compile_throw: tokens:" tokens)
                             (cond
                               (and (is_array? tokens)
                                    (== tokens.length 3))
                               (do
                                (= error_instance (compile tokens.1 ctx))
                                (= error_message (compile tokens.2 ctx)))
                               (and (is_array? tokens)
                                    (== tokens.length 2))
                               (do
                                (= error_message (compile tokens.1 ctx))
                                (= error_instance "Error"))
                               else
                               (throw SyntaxError "Invalid Throw Syntax"))
                             (for_each (`t [ "throw" " " "new" " " error_instance "(" error_message ")" ";"])
                                       (push acc t))
                             (log "compile_throw: <-" (join "" (flatten acc)))
                             acc)))
       
       
       (`compile_break (fn (tokens ctx)
                           [break_out "=" "true" ";" "return"]))
       (`compile_return (fn (tokens ctx)
                            (let
                                ((`acc [])
                                 (`return_val_reference (gen_temp_name "return"))
                                 (`return_value nil))
                              (log "compile_return:" "block?" (is_block? tokens.1.val) ctx)
                              (push acc
                                    { `ctype: "return" })
                              (if (is_block? tokens.1.val)
                                  (do
                                   (for_each (`t ["let" " " return_val_reference "=" (compile tokens.1.val ctx) ";" "return" " " return_val_reference ";"])
                                             (push acc t)))
                                  (do 
                                   (for_each (`t [ "return" " " (compile tokens.1 ctx) ";" ])
                                             (push acc t))))
                              
                              (log "compile_return: " acc)
                              
                              acc)))
       
       (`compile_apply (fn (tokens ctx)
                           (let
                               ((`acc [])
                                (`fn_ref tokens.1)
                                (`complex? false)
                                (`args_ref (gen_temp_name "apply_args"))
                                (`function_ref (gen_temp_name "apply_fn"))
                                (`target_argument_ref nil)
                                (`target_arg nil)
                                (`preceding_arg_ref nil)
                                (`compiled_fun_resolver nil)
                                (`args (-> tokens `slice 2)))
                             (when (and args (== args.length 1))
                               (= args (first args)))
                             (log "compile_apply: tokens: " tokens)
                             (log "compile_apply: function:" "is_form:" (is_form? fn_ref) fn_ref)
                             (log "compile_apply: args: " args)
                             
                             
                             (if (is_form? fn_ref)
                                 (do
                                  (console.log "compile_apply: build: " (build_anon_fn fn_ref.val))
                                  (= compiled_fun_resolver (compile (prop (build_anon_fn fn_ref.val) `0)  ctx))
                                   (console.log "compile_apply: build: " compiled_fun_resolver)    
                                   (for_each (`t ["let" " " function_ref "=" compiled_fun_resolver ])
                                             (push acc t))
                                        ;(push acc (compile (build_fn_with_assignment function_ref fn_ref.val) ctx))
                                   (push acc "()")
                                   (push acc ";"))
                                 (= function_ref (compile fn_ref ctx))) 
                             (log "compile_apply: function_ref: " function_ref)
                             
                             ;; now handle the arguments 
                             ;; Dlisp allows for multiple arguments to apply, with the last argument must be an array.
                             ;; In this case, we are going to need to unshift the preceding arguments into the final argument (which must be an array)
                             
                             (if (is_array? args)
                                 (do           
                                  (= target_argument_ref (gen_temp_name "target_arg"))
                                  (= target_arg (pop args)) ;; take the last argument
                                   (for_each (`t [ "let" " " target_argument_ref "=" "[]" ".concat" "(" (compile target_arg ctx) ")" ";"])
                                             (push acc t))
                                   (for_each (`t [ "if" "(" "!" target_argument_ref " " "instanceof" " " "Array" ")" "{" "throw" " " "new" " " "TypeError" "(" "\"Invalid final argument to apply - an array is required\"" ")" "}" ])
                                             (push acc t))
                                   (for_each (`token args)
                                             (do
                                              (= preceding_arg_ref (gen_temp_name "pre_arg"))
                                              (if (is_form? token)
                                                  (do
                                                   (for_each (`t [ "let" " " preceding_arg_ref "=" (compile token.val ctx) ";" ])
                                                             (push acc t)))
                                                  (= preceding_arg_ref (compile token ctx)))
                                               (push acc
                                                     [ target_argument_ref ".unshift" "(" preceding_arg_ref ")" ";" ])))
                                   ;; now we have our arguments placed into the front of the final array 
                                   ;; now call the functions apply method and return it
                                   (for_each (`t ["return" " " "await" " " function_ref "." "apply" "(" "this" "," target_argument_ref ")"])
                                             (push acc t)))
                                 
                                 
                                 ;; otherwise - just one arg (which presumably is an array) and so just construct the JS statement
                                 (do
                                  (if (is_form? args)
                                      (do 
                                       (for_each (`t [ "let" " " args_ref "=" (compile args.val ctx) ";" ])
                                                 (push acc t))
                                       (= complex? true)))
                                  (log "compile_apply: complex? " complex?)       
                                   (for_each (`t ["return" " " "await" " " function_ref "." "apply" "(" "this" ])
                                             (push acc t))
                                   (when args
                                     (push acc ",")
                                     (if complex?
                                         (push acc args_ref)
                                         (push acc (compile args ctx))))
                                   (push acc ")")))
                             ["(" "async" " " "function" "()" "{" acc "}" ")" "()"])))
       
       (`compile_call (fn (tokens ctx)
                          (let
                              ((`acc [])
                               (`target nil)
                               (`idx -1)
                               (`method nil))
                            (log "compile_call: " tokens)
                            (when (< tokens.length 3)
                              (throw SyntaxError (+ "call: missing arguments, requires at least 2")))
                            (if (is_block? tokens.1.val)
                                (= target (compile_wrapper_fn tokens.1.val ctx))
                                (= target (compile tokens.1 ctx)))
                            (if (is_complex? tokens.2)
                                (= method (compile_wrapper_fn tokens.2 ctx))
                                (= method (compile tokens.2 ctx)))
                            (cond
                              (== tokens.length 3)
                              (for_each (`t ["await" " " target "[" method "]" "()"])
                                        (push acc t))
                              else
                              (do 
                               (for_each (`t ["await" " " target"[" method "]" "." "call" "(" target])
                                         (push acc t))
                               (for_each (`token (-> tokens `slice 3))
                                (do
                                 (log "compile_call: argument: " (is_complex? token) token)
                                 (push acc ",")
                                  (if (is_complex? token)
                                      (push acc (compile_wrapper_fn token ctx))
                                      (push acc (compile token ctx)))))
                                (push acc ")")))
                            (log "compile_call: <-" (join "" (flatten acc)))
                            acc)))
       
       
       
       (`check_needs_wrap (fn (stmts)
                              (let
                                  ((`fst (+ "" (or (and (is_array? stmts)
                                                        (first stmts)
                                                        (is_object? (first stmts))
                                                        (not (is_function? (prop (first stmts) `ctype)))
                                                        (prop (first stmts) `ctype))
                                                   ""))))
                                (log "check_needs_wrap: fst:" stmts)
                                (log "check_needs_wrap: fst:" fst)
                                
                                (cond
                                  (contains? "block" fst)
                                  true
                                  else
                                  false))))
       (`compile_set_global 
         (fn (tokens ctx)
             (let
                 ((`target (sanitize_js_ref_name tokens.1.name))
                  (`wrap_as_function? nil)
                  (`acc nil)
                  (`clog (if opts.quiet_mode
                             log
                             (defclog { `prefix: "compile_set_global" `color: `white `background: "#205020" })))
                  (`metavalue nil)
                  (`assignment_value nil))
               (= has_lisp_globals true) ; ensure that we are passed the environment for this assembly       
               (clog "->" tokens)
               (clog "setting up global reference for: " target)
               ;; setup the reference in the globals as an assumed function type
               (set_prop root_ctx.defined_lisp_globals
                              target
                              AsyncFunction)
               (when tokens.3
                 (= metavalue
                    (if (is_complex? tokens.3)
                        (compile_wrapper_fn tokens.3 ctx)
                        (compile tokens.3 ctx))))
               (= assignment_value
                  (do 
                   (flatten [(compile tokens.2 ctx)])))
               
               (= wrap_as_function? (check_needs_wrap assignment_value))
               (if (and (is_object? assignment_value.0)
                        assignment_value.0.ctype)
                   (do 
                    (set_prop root_ctx.defined_lisp_globals
                              target
                              (cond (== assignment_value.0.ctype "Function")
                                Function
                                (== assignment_value.0.ctype "AsyncFunction")
                                AsyncFunction
                                (== assignment_value.0.ctype "Number")
                                Number
                                (== assignment_value.0.ctype "expression")
                                Expression 
                                else
                                assignment_value))
                    (when wrap_as_function?
                      (= assignment_value [ "await" " " "(" "async" " " "function" " " "()" (splice_in_return assignment_value) ")" "()" ])))
                   
                   (set_prop root_ctx.defined_lisp_globals
                             target
                             assignment_value))
               
               (clog "compile_set_global: assignment_value: " assignment_value)
               (= acc [{ `ctype: "statement"} "await" " " "Environment" "." "set_global" "(" """\"" tokens.1.name "\"" "," assignment_value (if metavalue "," "") (if metavalue metavalue "") ")" ])
               (clog "<-" acc)
               acc)))
       
       (`is_token? (fn (t)
                       (or (and (is_object? t)
                                t.__token__)
                           (and (is_array? t)
                                (is_object? t.0)
                                t.0.__token__))))
       
       (`compile_quote (fn (lisp_struct ctx)
                           (let
                               ((`acc [])
                                (`ctx (new_ctx ctx)))
                                        ;(`is_arr? (is_array? lisp_struct.1)))
                             (log "compile_quote: " (JSON.stringify lisp_struct))
                             (console.log "compile_quote" (clone lisp_struct))
                             (set_prop ctx
                                       `hard_quote_mode
                                       true)
                             (= acc (compile_quotem lisp_struct ctx))
                             acc)))
       
       (`compile_quotel (fn (lisp_struct ctx)
                           (let
                               ((`acc []))
                                
                                        ;(`is_arr? (is_array? lisp_struct.1)))
                             (log "compile_quotel:-> " (JSON.stringify lisp_struct))
                            
                             (= acc (JSON.stringify lisp_struct.1))
                             (log "compile_quotel: <-" (JSON.stringify lisp_struct.1))
                             [acc])))
       
       
       
       (`wrap_and_run (fn (js_code ctx)
                          (let
                              ((`assembly nil)
                               (`result nil)
                               (`fst nil)
                               (`needs_braces? false)
                               (`run_log (if opts.quiet_mode
                                             log
                                             (defclog { `prefix: "wrap_and_run" `background: "#703030" `color: "white" } )))
                               (`needs_return?
                                 (do
                                  (= fst (+ "" (or (and (is_array? js_code)
                                                        (first js_code)
                                                        (is_object? (first js_code))
                                                        (prop (first js_code) `ctype))
                                                   "")))
                                  (run_log "checking if return is required: fst: " fst  js_code)
                                   (cond
                                     (contains? "block" fst)
                                     (do 
                                      (if (== fst "ifblock")
                                          (= needs_braces? true)
                                          (= needs_braces? false))
                                      false)
                                     (== (first js_code) "throw")
                                     (do 
                                      (= needs_braces? false)
                                      false)
                                     else
                                     (do 
                                      (= needs_braces? true)
                                      true))))
                               (`assembled (join "" (reduce (`v (flatten [js_code]))
                                                            (if (not (is_object? v))
                                                                v)))))
                               
                            (run_log "current ctx: " (clone (flatten_ctx ctx)))
                            (= assembled (+ (if needs_braces? "{" "")
                                            (if needs_return? " return " "")
                                            assembled
                                            (if needs_braces? "}" "")))
                            (run_log "-> " assembled)
                            
                            (= assembly (new AsyncFunction "Environment" assembled))
                            (= result (assembly Environment))
                            (run_log "<-" result)
                            result)))            
       
       (`follow_log (if opts.quiet_mode
                        log
                        (defclog { `prefix: "follow_tree" `background: "#603060" `color: "white" } )))
       (`follow_tree (fn (tree ctx)
                       (let
                           ((`meta nil)
                            (`tlength 0)
                            (`idx 0)
                            (`tval nil)
                            (`tmp_name nil)
                            (`check_return_tree 
                                    (fn (stmts)
                                        (let
                                            ((`fst (if (and (is_array? ntree)
                                                            (is_object? ntree.0)
                                                            (prop ntree.0 `ctype))
                                                       (prop (first ntree) `ctype)
                                                       nil))
                                             (`rval nil))
                                            (= rval 
                                             (cond
                                                (== fst nil)
                                                stmts
                                                (== fst "Boolean")
                                                (+ "" stmts.1)
                                                (== fst "nil")
                                                "null"
                                                (== fst "Number")
                                                stmts.1
                                                (== fst "undefined")
                                                "undefined"
                                                else
                                                stmts))
                                            (follow_log "check_return_tree: " fst " returning: " (sub_type rval) (clone rval))
                                            rval)))
                            (`result nil)
                            (`subacc [])
                            (`ntree nil))
                         (follow_log "->" (clone tree))
                         (cond
                           (is_array? tree)
                           (do
                            (= tlength tree.length)
                            (follow_log "array with " tlength "elements")
                            (while (< idx tlength)
                             (do 
                              (= tval (prop tree idx))
                              (follow_log "in_lambda:" ctx.in_lambda "idx: " idx "tval:" (clone tval) (== tval (quote "=$,@")))
                               (cond 
                                 (or (== tval (quote "=$,@"))
                                     )
                                 (do
                                  (inc idx)
                                  (= tval (prop tree idx))
                                  (follow_log "splice operation: idx now:" idx  "tval:" (clone tval))
                                   
                                   ;; the theory of the splice
                                   
                                   ;; in quotem mode, if a ,@ is encountered, whatever thing that follows it or members of thing
                                   ;; become elements in the current list at the position of the ,@ symbol ( "=$,@" in JSON).
                                   ;; This is implemented by serializing the JSON into lisp text and embedding it in a call to
                                   ;; to the reader, where when the piece of code is activated, it is rehydrated as JSON and then
                                   ;; compiled in the present environment top level context.  
                                   
                                   
                                   
                                   (if (not (eq undefined tval))
                                       (do 
                                        (if ctx.in_lambda
                                            (do 
                                             (= ntree [])
                                             (if (is_object? tval)
                                                 (do
                                                  (= tmp_name (gen_temp_name "tval"))
                                                  (for_each (`t (flatten [(quote "=:(") (quote "=:let") (quote "=:(") (quote "=:(")  tmp_name (+  (quote "=:") (as_lisp tval)) (quote "=:)") (quote "=:)") (+ (quote "=:") tmp_name) ]))
                                                   (push ntree t)))
                                                 
                                                 (do 
                                                     (follow_log "splice: building deferred compilation (serializing tval to lisp)")
                                                     
                                                     (for_each (`t (flatten [ (quote "=$&!") (quote "=:'") (quote "=:+") (quote "=:await") (quote "=:Environment.as_lisp")  (quote "=:(")  tval (quote "=:)") (quote "=:+") (quote "=:'") ]))
                                                           (push subacc t))))
                                              (follow_log "splice operation: subacc: " (clone subacc) (as_lisp subacc))
                                              (if (is_object? tval)
                                                  (do 
                                                   (push ntree (quote "=:)"))
                                                   (= ntree (compile (tokenize tval ctx) ctx))
                                                   (= ntree (check_return_tree ntree))
                                                    (follow_log "spliced: <-" ntree)
                                                    
                                                    (= ntree (wrap_and_run ntree ctx)))
                                                  (do
                                                      (follow_log "not compiling, tval is simple value:" (clone tval))
                                                      )))
                                            
                                            
                                            (do 
                                             (follow_log "not in lambda: tokenizing, compiling: " (clone tval))
                                             (= ntree (compile (tokenize tval ctx) ctx))
                                             (= ntree (check_return_tree ntree))
                                             
                                             (follow_log "compiled ntree <-" (clone ntree))
                                             (when (is_object? ntree)
                                                 (follow_log "spliced: evaluating: " (clone ntree))
                                                 (= ntree (wrap_and_run ntree ctx)))))
                                        
                                        (follow_log "spliced-evaled: appending " (clone ntree) " to subacc: " (clone subacc))
                                        
                                        (= subacc (-> subacc `concat ntree))
                                        (follow_log "spliced-evaled subacc: lisp:" (as_lisp subacc))
                                        (follow_log "spliced-evaled subacc: json:" (clone subacc)))
                                           
                                       (throw SyntaxError "invalid splice operator position")))
                                 (and (not ctx.hard_quote_mode)
                                      (or (== tval (quote "=:##"))
                                          (== tval (quote "=:unquotem"))))
                                
                                 (do
                                  (inc idx)
                                  (= tval (prop tree idx))
                                  (follow_log "insert-operation (non-splice): idx now:" idx  "tval:" (clone tval))
                                   (if (not (eq undefined tval))
                                       (do 
                                        (if ctx.in_lambda
                                            (do
                                             (follow_log "in_lambda: non splice: " tval )   
                                             (= ntree [])
                                              (if (is_object? tval)
                                                  (do
                                                   (= tmp_name (gen_temp_name "tval"))
                                                   (for_each (`t (flatten [(quote "=:(") (quote "=:let") (quote "=:(") (quote "=:(")  tmp_name (+  (quote "=:") (as_lisp tval)) (quote "=:)") (quote "=:)") (+ (quote "=:") tmp_name) ]))
                                                    (push ntree t)))
                                                  ;(push ntree tval))
                                                  ;(push ntree (+ "\"+await Environment.as_lisp(" tval ")+\"")))
                                                  (for_each (`t (flatten [(quote "=:'") (quote "=:+") (quote "=:await") (quote "=:Environment.as_lisp") (quote "=:(") tval (quote "=:)") (quote "=:+") (quote "=:'") ]))
                                                            (push ntree t)))
                                              

                                              (when (is_object? tval)
                                                (push ntree (quote "=:)"))
                                                (follow_log "to compile: " (clone tval) (as_lisp tval) "ctx:" (clone ctx))
                                                
                                                (= ntree (compile (tokenize tval ctx) ctx))
                                                (follow_log "compiled ntree: " ntree)
                                                (follow_log "evaluating: " (clone ntree) (clone ctx))
                                                (= ntree (wrap_and_run ntree ctx)))
            ;(push subacc ntree) ;; this is original
                                              (= subacc (-> subacc `concat ntree))
                                              (follow_log "subacc: " (JSON.stringify subacc) (as_lisp subacc)))
                                              
                                            
                                            (do 
                                              (follow_log "not in lambda: non splice: compiling: " tval)
                                              (= ntree (compile (tokenize tval ctx) ctx))
                                             
                                              (= ntree (check_return_tree ntree))
                                              (follow_log "post compile:" ntree)
                                              (= ntree (wrap_and_run ntree ctx))
                                              (follow_log "evaled: " (clone ntree))
                                              
                                              (push subacc ntree))))
                                       (throw SyntaxError "invalid unquotem operator position")))
                                 else
                                 (do (follow_tree "calling follow_tree: " tval)
                                     (= tval (follow_tree tval ctx))
                                      (follow_log "pushing to subacc: " tval)
                                     (push subacc tval)))
                               (inc idx)))
                             (follow_log "<-" (clone subacc))
                            subacc)
                           (or (is_number? tree)
                               (is_string? tree)
                               (== false  tree)
                               (== true tree)
                               (== null tree)
                               (== undefined tree))
                           tree
                           (and (is_object? tree)
                                (not (is_function? tree)))
                           (do 
                               (for_each (`k (keys tree))
                                     (set_prop tree
                                        k (follow_tree (prop tree k) ctx)))
                                tree)
                           (is_function? tree)
                           tree))))
                       
       (`quotem_log (if opts.quiet_mode
                        log
                        (defclog {`prefix: "compile_quotem" `background: "#503090" `color: "white" } )))
                    
       (`compile_quotem (fn (lisp_struct ctx)
                            (let
                                ((`acc [])
                                 (`pcm nil)
                                 (`encoded nil)
                                 (`rval nil)
                                 (`is_arr? (is_array? lisp_struct.1)))
                              (= has_lisp_globals true)
                              (quotem_log " ->" (JSON.stringify lisp_struct))
                              (= pcm (follow_tree lisp_struct.1 ctx))
                              (quotem_log "post follow_tree: " (clone pcm))
                              (= encoded (-> env `as_lisp pcm))
                              (quotem_log "as lisp: " encoded)
                              (= encoded (add_escape_encoding encoded))
                              (quotem_log "encoded: " encoded)
                              (for_each (`t ["await" " " "Environment.do_deferred_splice" "(" "await" " " "Environment.read_lisp" "(" "'" encoded "'" ")" ")"]) ;; add_escape_encoding was here surrounding (lisp_writer ..)
                                  (push acc t))
                              (quotem_log "<-  " (join "" acc))
                              (quotem_log "<- " acc)
                              acc)))
       
       
       (`unq_log (if opts.quiet_mode
                     log
                     (defclog {`prefix: "compile_unquotem" `background: "#505060" `color: "white" } )))
       (`compile_unquotem (fn (lisp_struct ctx)
                              (let
                                  ((`acc []))
                                (unq_log "->" lisp_struct)
                                (push acc 
                                      (compile lisp_struct.1 ctx))
                                (unq_log "<-" acc)
                                acc)))
       
       
       ;; evalq is special - it expects a non-tokenized tree as input
       ;; will tokenize it,
       ;; effectively this is the entry point
       
       (`evalq_log (if opts.quiet_mode
                       log
                       (defclog {`prefix: "compile_evalq" `background: "#505060" `color: "white" } )))
       (`compile_evalq
         (fn (lisp_struct ctx)
             (let
                 ((`acc [])
                  (`tokens nil)
                  (`is_arr? (is_array? lisp_struct.1)))
               
               (evalq_log "lisp ->" lisp_struct)
               (evalq_log "is_array?" is_arr? "ctx:" ctx)
               (console.log "compile_evalq ->" lisp_struct)
               (= tokens (if is_arr?
                             (tokenize lisp_struct.1  ctx )
                             (pop (tokenize [ lisp_struct.1 ] ctx))))
               ;; tokenize the argument
               (evalq_log "tokenized: " tokens)
               
               (= acc [(compile tokens ctx) ]) ;; pass the current ctx in
               (when is_arr? 
                 (= acc ["async" " " "function" "()" ["{" "return" " " acc "}"]]))
               (evalq_log "<-" (join "" (flatten acc)))
               (console.log "compile_evalq <-" acc)
               acc)))
       
       (`eval_log (if opts.quiet_mode
                      log
                      (defclog {`prefix: "compile_eval" `background: "#705030" `color: "white" } )))
       
       ;; eval takes the output of evalq and evaluates the returned function, and returns the
       ;; results 
       
       (`compile_eval
         (fn (tokens ctx)
             (let
                 ((`assembly nil)
                  (`type_mark nil)
                  (`acc [])
                  (`result nil))
               (eval_log "->" (clone tokens))
               ;(console.log "compile_eval: -> " (clone tokens))
               (eval_log "to compile:" tokens.1.val)
               (= assembly (compile tokens.1.val ctx))
               (eval_log "assembly:" (clone assembly))
               ;(console.log "compile_eval: assembly:" assembly)
               (= has_lisp_globals true)
               (= result [ "Environment" "." "eval" "(""async" " " "function" "()" ["{" "return" " " assembly "}" "()"    ")" ]])
                                                                                   ; "," (JSON.stringify ctx) ")" ]])
                                        ;(= result [ "async" " " "function" "()" ["{" "return" " " assembly "}" "()"  ]])

               (eval_log "result of eval: " (clone result))
               
               result)))
       
       (`compile_debug (fn (tokens ctx)
                           [{ `ctype: "block" } "debugger" ";"]))
       (`compile_for_each
         (fn (tokens ctx)
             [{ `ctype: "AsyncFunction"} "await" " " "(" "async" " " "function" "()" " " "{" 
             (compile_for_each_inner tokens ctx)
             " " "}" ")" "()"";" ]))
       (`compile_for_each_inner 
         (fn (tokens ctx)
             (let
                 ((`acc [])
                  (`idx 0)
                  (`ctx (new_ctx ctx))
                  (`idx_iter (gen_temp_name "iter"))
                  (`idx_iters [])
                  (`element_list (gen_temp_name "elements"))
                  (`body_function_ref (gen_temp_name "for_body"))
                  (`collector_ref (gen_temp_name "array"))
                  
                  (`prebuild [])
                  (`for_args tokens.1.val)
                  (`iterator_ref for_args.0) 
                  (`elements (last for_args))
                  (`iter_count (if for_args
                                   (- for_args.length 1)
                                   0))
                  (`for_body tokens.2)
                  (`body_is_block? (is_block? for_body.val)))
               (log "compile_for_each: tokens: " tokens)
               (log "compile_for_each: # of iters: " iter_count)
               (log "compile_for_each: args: " for_args)
               (log "compile_for_each: elements: " elements)
               (log "for_body: body is block?" (is_block? for_body) for_body)
               (when (< iter_count 1)
                 
                 (throw SyntaxError "Invalid for_each arguments"))
               
               (for_each (`iter_idx (range iter_count))
                         (do
                          (push idx_iters (prop for_args iter_idx))
                          (set_ctx ctx
                           (prop (last idx_iters) `name)
                           "?arg")))
               
               (log "compile_for_each: idx_iters: " idx_iters)
               (set_ctx ctx collector_ref "?arg")
                                        ;(when for_args.1.ref
                                        ;     (set_ctx ctx for_args.1.name "?arg"))
               (set_ctx ctx element_list "arg")
               (when (not body_is_block?)
                 ;; we need to make it a block for our function
                 (= for_body (make_do_block for_body))
                 (log "compile_for_each: for_body is now block:" for_body))
               (= prebuild (build_fn_with_assignment body_function_ref
                                                     for_body.val
                                                     idx_iters))
               
                                        ; [iterator_ref]))
               (set_prop ctx
                         `return_last_value
                         true)
               (log "for_each prebuild tokens:" prebuild)
               
               (push acc (compile prebuild ctx))
               (log "for_each: prebuild:" (last acc))
               (for_each (`t ["let" " " collector_ref "=" "[]" "," element_list "=" (compile elements ctx) ";" ])
                         (push acc t))
               (for_each (`t [ "let" " " break_out "=" "false" ";"])
                         (push acc t))
               
               (set_ctx ctx body_function_ref AsyncFunction)
               ;; for the simplest, fastest scenario, one binding variable to the list
               (cond
                 (and (== for_args.length 2) ;; simplest (for_each (`i my_array) ...
                      (not (is_array? for_args.1)))
                 (do 
                  (set_ctx ctx idx_iter Number)
                  (for_each (`t ["for" "(" "let" " "  idx_iter " " "in" " " element_list ")" " " "{" ])
                   (push acc t))
                   
                   (for_each (`t [ collector_ref "." "push" "(" "await" " " body_function_ref "(" element_list "[" idx_iter "]" ")" ")" ";" ])
                             (push acc t))
                   (for_each (`t ["if" "(" break_out ")" " " "{" " " collector_ref "." "pop" "()" ";" "break" ";" "}"])
                             (push acc t))
                   
                   (push acc "}")))
               
                                        ;(push acc ";")     
               (push acc "return")
               (push acc " ")
               (push acc collector_ref)
               (push acc ";")
               acc)))
       
       
       (`compile_while
         (fn (tokens ctx)
             (let
                 ((`acc [])
                  (`idx 0)
                  (`ctx (new_ctx ctx))
                  (`test_condition tokens.1)
                  (`test_condition_ref (gen_temp_name "test_condition"))
                  (`body tokens.2)
                  (`body_ref (gen_temp_name "body_ref"))
                  
                                        ;(`rval_ref (gen_temp_name "return_val"))
                  (`prebuild []))
               (log "compile_while: tokens: " tokens)
               (log "compile_while: test_condition: " test_condition.source)
               (set_ctx ctx
                        break_out
                        true)
               ;(push acc
                ;     (+ "/* while: block_id: " ctx.block_id  " block_step:" ctx.block_step " */"))    
               (push prebuild (compile (build_fn_with_assignment test_condition_ref test_condition.val) ctx))
               (push prebuild (compile (build_fn_with_assignment body_ref body.val) ctx))
               (for_each (`t [ "let" " " break_out "=" "false" ";"])
                         (push prebuild t))
               (for_each (`t [ "while" "(" "await" " " test_condition_ref "()" ")" " " "{"  "await" " " body_ref "()" ";" " " "if" "(" break_out ")" " " "{" " " "break" ";" "}" "}" " " "" ";"])
                         (push prebuild t))
               (for_each (`t [ "await" " " "(" "async" " " "function" "()" "{" " " prebuild "}" ")" "()" ])
                         (push acc t))
               (log "compile_while: prebuild: " prebuild)
               
               acc)))
       
       (`declare_log (if opts.quiet_mode
                         log
                        (defclog { `prefix: "DECLARE" `color: "white" `background: "black" })))
       (`compile_declare (fn (tokens ctx)
                             (let
                                 ((`expressions (rest tokens))
                                  (`targeted nil)
                                  (`declaration nil))
                                 (declare_log "->" (clone expressions))
                                 (for_each (`exp expressions)
                                    (do
                                        (= declaration exp.val.0.name)
                                        (= targeted (rest exp.val))
                                        (declare_log "declaration: " declaration "targeted: " (each targeted `name))
                                        (cond
                                            (== declaration "toplevel")
                                            (do
                                                (= env_ref "self")))))
                                 [])))
       (`get_scoped_type (fn (name)
                             (let
                                 ((`rtype (get_ctx ctx name)))
                               (if (== undefined rtype)
                                   (sub_type (get_lisp_ctx name))
                                   (sub_type rtype)))))
       
       (`compile_scoped_reference
         (fn (tokens ctx)
             (let
                 ((`acc [])
                  (`idx 0)
                  (`ref_type nil)
                  (`rval nil)
                  (`stmt nil)
                  (`sr_log (defclog { `prefix: (+ "compile_scoped_reference (" (or ctx.block_id "-") "):") `background: "steelblue" `color: `white}))
                  (`val nil)
                  (`call_type (cond 
                                (not tokens.0.ref)
                                "literal"
                                (get_ctx ctx tokens.0.name)
                                "local"
                                (get_lisp_ctx tokens.0.name)
                                "lisp"))
                  (`check_statement (fn (stmt)
                                        (if (check_needs_wrap stmt)
                                            (do 
                                             (sr_log "check_statement: needs wrap: " stmt.0.ctype stmt)
                                              ;; since we wrapped it in a function - make sure we have a 
                                              ;; return value established 
                                             (= stmt (splice_in_return stmt))
                                             (if (== stmt.0.ctype "ifblock")
                                                [{ `ctype: "AsyncFunction" } "await" " " "(" "async" " " "function" "()" " " "{" " " stmt " " "}" " " ")" "()"]
                                                [{ `ctype: "AsyncFunction" } "await" " " "(" "async" " " "function" "()" " " stmt " " ")" "()"]))
                                           
                                            stmt)))
                  (`token nil))
               (sr_log "->" (clone tokens))
               (sr_log "source ->" ctx.source)
               
               (cond 
                 (== call_type "lisp")
                 (= ref_type (get_lisp_ctx tokens.0.name))
                 (== call_type "local")
                 (= ref_type (get_ctx ctx tokens.0.name))
                 else
                 (= ref_type "?arg"))
               (sr_log "where/what->" call_type "/" ref_type "for symbol: " tokens.0.name)
               (cond (== ref_type AsyncFunction)
                     (= ref_type "AsyncFunction")
                     (== ref_type Expression)
                     (= ref_type "?arg" )
                     (== ref_type Function)
                     (= ref_type "Function")
                     (== ref_type Array)
                     (= ref_type "Array")
                     (== ref_type NilType)
                     (= ref_type "nil")
                     (== ref_type Number)
                     (= ref_type "?arg")
                     (== ref_type String)
                     (= ref_type "String")
                     (== ref_type "?arg")
                     true
                     else
                     (= ref_type (sub_type ref_type)))
               
               
               (sr_log "call_type: " call_type "decoded ref_type: " ref_type)
               (sr_log "call:" tokens.0.name (if (== "lisp" call_type) (get_lisp_ctx tokens.0.name) "local"))
               (= rval
                  (cond
                    
                    
                    (== ref_type "AsyncFunction")
                    (do
                     (push acc "await")
                     (push acc " ")
                      (push acc (if (== call_type `lisp)
                                    (compile_lisp_scoped_reference tokens.0.name)
                                    tokens.0.name))
                      (push acc "(")
                      (while (< idx (- tokens.length 1))
                             (do
                              (inc idx)
                              (= token (prop tokens idx))
                               (= stmt (compile token ctx))
                               (sr_log "<- (AsyncFunction) compiled stmt: " stmt)
                               (= stmt (check_statement stmt))
                               (push acc stmt)
                               (when (< idx (- tokens.length 1))
                                 (push acc ","))))
                      (push acc ")")
                     acc)
                    (== ref_type "Function")
                    (do
                     (push acc (if (== call_type `lisp)
                                   (compile_lisp_scoped_reference tokens.0.name)
                                   tokens.0.name))
                     (push acc "(")
                      (while (< idx (- tokens.length 1))
                             (do
                              (inc idx)
                              (= token (prop tokens idx))
                               (= stmt (compile token ctx))
                               (sr_log "<- (function) compiled_smt: " stmt)
                               (= stmt (check_statement stmt))
                               (push acc stmt)
                               (when (< idx (- tokens.length 1))
                                 (push acc ","))))
                      (push acc ")")
                     acc)
                    
                    (and 
                         (== call_type "local")
                         (or (== ref_type "Number")
                             (== ref_type "String")
                             (== ref_type "Boolean")))
                    (do
                        (sr_log "<- local scoped reference is: " tokens.0.name)
                        (push acc tokens.0.name)
                        acc)
                    
                    (and (== call_type "local")
                         (not (== ref_type "?arg"))
                         (is_array? tokens))
                    (do
                     (= val (get_ctx_val ctx tokens.0.name))
                     (sr_log "<- local scope: val is: " val)
                      (push acc val)
                     acc)
                    
                    
                    
                    (and (== ref_type "?arg")
                         (is_array? tokens))
                    (do 
                     (sr_log "compiling array: " tokens)
                     (push acc "[")
                     (while (< idx tokens.length)
                            (do 
                              (= token (prop tokens idx))
                              (push acc (compile token ctx))
                               
                               (when (< idx (- tokens.length 1))
                                 (push acc ","))
                               (inc idx)))
                      (push acc "]")
                     acc)
                    (== ref_type "?arg")
                    (do
                     (sr_log "arg reference: <-" tokens.0.name)
                     (push acc tokens.0.name)
                     acc)
                    (== ref_type "undefined")
                    (do
                     (sr_log "unknown reference: " tokens.0.name)
                     (throw ReferenceError (+ "unknown reference: " tokens.0.name)))
                    (== call_type `lisp)
                    (do 
                     (sr_log "is lisp scoped: " tokens.0.name )
                     (compile_lisp_scoped_reference tokens.0.name))
                    else
                    (do 
                     (sr_log "warning unknown type in local ctx:" tokens.0.name ref_type)
                     (push acc tokens.0.name)
                     acc)))
               ;; add the ctype to the front
               (when false
                   (cond
                       (or (== ref_type "AsyncFunction")
                           (== ref_type "Function"))
                       (prepend acc { `ctype: ref_type })))
               (sr_log "<-" acc)
               acc)));(flatten acc))))
       
       (`compile_lisp_scoped_reference
         (fn (refname)
             (let
                 ((`refval (get_lisp_ctx refname))
                  (`reftype (sub_type refval))
                  (`basename (get_object_path refname)))
                (log "compile_lisp_scoped_reference: " refname reftype refval basename)
               
               ;; if the refval isn't changed when is a string, we could have collisions 
               ;; because the compiler/evaluator uses the contents of refval in the ctype
               ;; object key to determine how to handle, so things like "block" or "Function"
               ;; will cause problems
               
               (when (and (== reftype "String")
                          (not (== refval undefined)))
                          ;(not (== refval "__!NOT_FOUND!__")))
                 (= refval "text"))  
               ;(log "compile_lisp_scoped_reference: " refname reftype refval)         
               (cond
                 (contains? basename.0 standard_types)   ;; Certain standard types are automatically available everywhere and are not specific to the lisp environment
                 refname
                 
                 
                 (and refval
                      (not (== refval undefined)))
                      ;(not (== refval "__!NOT_FOUND!__")))
                 (do
                  (= has_lisp_globals true)
                  [{ `ctype: refval } "(" "await" " " env_ref "." "get_global" "(\"" refname  "\")" ")"])
                 else
                 (do
                  ;(log "compile_lisp_scoped_reference: ERROR: unknown reference: " refname)
                  (throw ReferenceError (+ "unknown lisp reference: " refname)))))))
              
       (`standard_types [`AbortController `AbortSignal `AggregateError `Array `ArrayBuffer
                          `Atomics `BigInt `BigInt64Array `BigUint64Array `Blob `Boolean 
                          `ByteLengthQueuingStrategy `CloseEvent `CountQueuingStrategy 
                          `Crypto `CryptoKey `CustomEvent `DOMException `DataView `Date 
                          `Error `ErrorEvent `EvalError `Event `EventTarget `File `FileReader 
                          `FinalizationRegistry `Float32Array `Float64Array `FormData 
                          `Function `Headers `Infinity `Int16Array `Int32Array `Int8Array 
                          `Intl `JSON `Location `Map `Math `MessageChannel `MessageEvent 
                          `MessagePort `NaN `Navigator `Number `Object `Performance 
                          `PerformanceEntry `PerformanceMark `PerformanceMeasure `ProgressEvent 
                          `Promise `Proxy `RangeError `ReadableByteStreamController
                          `ReadableStream `ReadableStreamDefaultController 
                          `ReadableStreamDefaultReader `ReferenceError `Reflect 
                          `RegExp `Request `Response `Set `SharedArrayBuffer `Storage 
                          `String `SubtleCrypto `Symbol `SyntaxError `TextDecoder 
                          `TextDecoderStream `TextEncoder `TextEncoderStream `TransformStream 
                          `TypeError `URIError `URL `URLSearchParams `Uint16Array 
                          `Uint32Array `Uint8Array `Uint8ClampedArray `WeakMap `WeakRef 
                          `WeakSet `WebAssembly `WebSocket `Window `Worker `WritableStream 
                          `WritableStreamDefaultController `WritableStreamDefaultWriter
                          `__defineGetter__ `__defineSetter__ `__lookupGetter__ 
                          `__lookupSetter__ `_error `addEventListener `alert `atob `btoa 
                          `clearInterval `clearTimeout `close `closed `confirm `console 
                          `constructor `crypto `decodeURI `decodeURIComponent `dispatchEvent 
                          `encodeURI `encodeURIComponent `escape `eval `fetch `getParent
                          `globalThis `hasOwnProperty `isFinite `isNaN `isPrototypeOf `localStorage
                          `location `navigator `null `onload `onunload `parseFloat `parseInt 
                          `performance `prompt `propertyIsEnumerable `queueMicrotask
                          `removeEventListener `self `sessionStorage `setInterval
                          `setTimeout `structuredClone `this `toLocaleString `toString 
                          `undefined `unescape `valueOf `window 
                          ;; DLisp mandatory defined globals
                          `AsyncFunction
                          `Environment `Expression `get_next_environment_id `clone `subtype `lisp_writer `do_deferred_splice
                          ])
       (`is_error nil)
       
       (`is_block? (fn (tokens)
                       (and (contains? tokens.0.name ["do" "progn"]))))
                                        ;(== tokens.1.type "arr"))))
                                        ;(== (prop op_lookup tokens.0.name) compile_block)))
       (`is_complex? (fn (tokens)
                         (let
                             ((`rval (or (is_block? tokens)
                                         (and (== tokens.type "arr") 
                                              (is_block? tokens.val))
                                         (== tokens.val.0.name "if")
                                         (== tokens.val.0.name "let"))))
                                        ;(log "IS_COMPLEX?: " rval "IS_BLOCK?: " (contains? tokens.0.name ["do" "progn" "let"]) tokens)
                           rval
                           )))
       (`is_form? (fn (token)
                      (or (is_array? token.val )
                          (is_block? token.val))))
       
       (`op_lookup  { "+": infix_ops
                    "*": infix_ops
                    "/": infix_ops
                    "-": infix_ops
                    "**": infix_ops
                    "%": infix_ops
                    "<<": infix_ops
                    ">>": infix_ops 
                    "and": infix_ops
                    "or": infix_ops
                    "apply": compile_apply
                    "call": compile_call
                    "->": compile_call
                    "set_prop": compile_set_prop
                    "prop": compile_prop
                    "=": compile_assignment
                    "==": compile_compare
                    "eq": compile_compare
                    ">": compile_compare
                    "<": compile_compare
                    "<=": compile_compare
                    ">=": compile_compare
                    "return": compile_return
                    "new": compile_new
                    "do": compile_block
                    "progn": compile_block
                    "break": compile_break
                    "inc": compile_val_mod
                    "dec": compile_val_mod
                    "try": compile_try
                    "throw": compile_throw
                    "let": compile_let
                    "defvar": compile_defvar
                    "while": compile_while
                    "for_each": compile_for_each
                    "if": compile_if
                    "cond": compile_cond
                    "fn": compile_fn  
                    "defglobal": compile_set_global
                    "list": compile_list
                    "function": (fn (tokens ctx)
                                    (compile_fn tokens ctx { `synchronous: true }))
                    "quotem": compile_quotem
                    "quote": compile_quote
                    "quotel": compile_quotel
                    "evalq": compile_evalq
                    "eval": compile_eval
                    "jslambda": compile_jslambda
                    "instanceof": compile_instanceof
                    "typeof": compile_typeof
                    "unquotem": compile_unquotem
                    "debug": compile_debug
                    "declare": compile_declare
                    
                    })
       (`comp_log (if quiet_mode
                      log
                      (defclog { `background: "LightSkyblue" `color: "#000000" } )))
       
       (`last_source nil)
       (`compile_obj_literal 
         (fn (tokens ctx)
             (let
                 ((`acc [])
                  (`idx -1)
                  (`stmt nil)
                  (`has_valid_key_literals true)
                  (`token nil)
                  (`key nil)
                  (`tmp_name nil)
                  (`ctx (new_ctx ctx))
                  (`check_statement (fn (stmt)
                                        (if (check_needs_wrap stmt)
                                            (do 
                                             (comp_log "check_statement: needs wrap: " stmt.0.ctype (== stmt.0.ctype "ifblock") stmt)
                                             (if (== stmt.0.ctype "ifblock")
                                                 [{ `ctype: "AsyncFunction" `marker: "ifblock"} "await" " " "(" "async" " " "function" "()" " " "{" (splice_in_return stmt) "}" " " ")" "()"]
                                                 [{ `ctype: "AsyncFunction" } "await" " " "(" "async" " " "function" "()" " " stmt " " ")" "()"]))
                                            stmt)))
                  (`kvpair nil)
                  (`total_length (- tokens.val.length 1)))
               (log "compile_obj_literal: ->" tokens)
               (console.log "compile_obj_literal: -> " tokens)
                                        ;(log "                ctx:" ctx)
               (set_prop ctx
                         `in_obj_literal
                         true)
               ;; scan the keys to ensure that they are valid
               ;; if not we will have to build the object from setters 
               ;; vs literals
               
               (for_each (`token (or tokens.val []))
                         (when (and (== token.type "keyval") 
                                    (check_invalid_js_ref token.name))
                           (= has_valid_key_literals false)
                           (break)))
               (if has_valid_key_literals
                   (if (== tokens.val.name "{}")
                       [{ `ctype: "objliteral" } "new Object()"]
                       (do
                        (push acc "{")
                        (while (< idx total_length)
                         (do
                          (inc idx)
                          (= kvpair (prop tokens.val idx))
                           (log "compile_obj_literal:" idx total_length  "kvpair: " kvpair)
                                        ;(log "compile_obj_literal:" idx "is_block?" (is_block? kvpair.val.1) kvpair.val.1.val`)
                           (= key (get_val kvpair.val.0 ctx))
                           (when (and (== key.length 1)
                                      (== (-> key `charCodeAt) 34))
                              (= key "'\"'"))
                           (log "compile_obj_literal:" idx "key->" key "token_value:" kvpair.val.0)
                           (push acc key)
                           
                           (push acc ":")
                           (= stmt (compile_elem kvpair.val.1 ctx))
                           (log "compile_obj_literal:" idx total_length "<-val" stmt)
                           (= stmt (check_statement stmt))
                           (push acc stmt)
                                        ;(if (is_block? kvpair.val.1.val)
                                        ;   (compile_wrapper_fn kvpair.val.1 ctx)
                                        ;  (compile kvpair.val.1 ctx)))
                           (when (< idx total_length)
                             (push acc ","))))
                         ;; key - kvpair[0]: push in the literal identifier
                         
                         (push acc "}")
                         (log "compile_obj_literal: <-" (flatten acc))
                        [{ `ctype: "objliteral" } acc]))
                   (do
                    (log "compile_obj_literal: keys have invalid js chars")
                    (= tmp_name (gen_temp_name "obj"))
                     (for_each (`t [{ `ctype:`statement }  "await" " " "(" " ""async" " " "function" "()" "{" "let" " " tmp_name "=" "new" " " "Object" "()" ";"])
                               (push acc t))
                     (while (< idx total_length)
                            (do
                             (inc idx)
                             (= kvpair (prop tokens.val idx))
                              (log "compile_obj_literal:" idx total_length  "kvpair: " kvpair)
                              (for_each (`t [tmp_name "[" "\"" (cl_encode_string (get_val kvpair.val.0 ctx)) "\"" "]" "=" (compile_elem kvpair.val.1 ctx) ";"])
                                        (push acc t))))
                     
                     (for_each (`t ["return" " " tmp_name ";" "}" ")" "()"])
                               (push acc t))
                     (log "compile_obj_literal: <-" (flatten acc))
                    acc)))))
                
       (`is_literal? (fn (val)
                         (or (is_number? val)
                             (is_string? val)
                             (== false val)
                             (== true val))))
       (`comp_warn (defclog { `prefix: "compile: [warn]:" `background: "#fcffc8" `color: "brown" } ))
       (`compile (fn (tokens ctx _cdepth)
                     (if is_error
                         is_error   ;; unwind 
                       (do
                         (defvar `rval (compile_inner tokens ctx _cdepth))
                         (if   (and (is_array? rval)
                                    (is_object? rval.0)
                                    (prop rval.0 `ctype))
                               (comp_log (+ "compile:" _cdepth " <- ") "return type: " (as_lisp rval.0))
                               (do 
                                   (comp_warn "<-"  _cdepth   "unknown/undeclared type returned: " (clone rval))))
                         rval))))
                         
       (`compile_inner
         (fn (tokens ctx _cdepth)
             (let
                 ((`operator_type nil)
                  (`op_token nil)
                  (`rcv nil)
                  (`_cdepth (or _cdepth 100))
                  (`acc [])
                  (`tmp_name nil)
                  (`refval nil)
                  (`check_statement (fn (stmt)
                                        (if (check_needs_wrap stmt)
                                            (do 
                                             (comp_log "check_statement: needs wrap: " stmt.0.ctype (== stmt.0.ctype "ifblock") stmt)
                                             (if (== stmt.0.ctype "ifblock")
                                                 [{ `ctype: "AsyncFunction" `marker: "ifblock"} "await" " " "(" "async" " " "function" "()" " " "{" (splice_in_return stmt) "}" " " ")" "()"]
                                                 [{ `ctype: "AsyncFunction" } "await" " " "(" "async" " " "function" "()" " " stmt " " ")" "()"]))
                                            stmt)))
                  (`ref nil))
               (set_prop
                ctx
                `source 
                (cond tokens.source
                  tokens.source
                  tokens.0.source
                  tokens.0.source
                  tokens.1.source
                  tokens.1.source
                  else
                  ctx.source))
               (comp_log (+ "compile:" _cdepth " start:") ctx.source)
               (comp_log (+ "compile:" _cdepth ":->") tokens)
                                        ;(console.log "compile: ->: " (clone tokens))
               
               
               (try
                (if (eq nil ctx)
                    (do
                     (error_log "compile: nil ctx: " tokens)
                     (throw "compile: nil ctx"))
                    (cond
                      (or (is_number? tokens)
                          (is_string? tokens)
                          (== (sub_type tokens) "Boolean"))
                      tokens          ;; just return the literal value
                      (and (is_array? tokens)
                           tokens.0.ref
                           (not (== (get_ctx ctx tokens.0.name) UnknownType))
                           (or (prop op_lookup tokens.0.name)
                               ;(== "function" (typeof (get_ctx ctx tokens.0.name)))
                               (== Function (get_ctx ctx tokens.0.name))
                               (== AsyncFunction (get_ctx ctx tokens.0.name))
                               (== "function" (typeof (prop root_ctx.defined_lisp_globals tokens.0.name)))
                               (is_function? (get_lisp_ctx tokens.0.name))
                                  
                               ;tokens.0.val
                               ))
                      (do
                       (= op_token (first tokens))
                       (= operator (prop op_token `name))
                        (= operator_type (prop op_token `val))
                        (= ref (prop op_token `ref))
                        (= op (prop op_lookup operator))
                        (comp_log (+ "compile: " _cdepth " (form):") operator (if (prop Environment.inlines operator) "lib_function" op) tokens)
                        (comp_log "    ctx: " (clone ctx))
                        (cond 
                          op
                          (op tokens ctx)
                          (prop Environment.inlines operator)
                          (compile_inline tokens ctx)
                          else
                                        ;(or (get_ctx ctx operator)
                                        ;   (get_lisp_ctx operator))
                          (compile_scoped_reference tokens ctx))) 
                                        ;else
                                        ;(do
                                        ;   ["NOCOMPILE" (map (fn (v)
                                        ;                        (if v.ref
                                        ;                           (prop v `name)
                                        ;                          (prop v `val)))
                                        ;                 tokens)])))
                      (and (is_object? tokens)
                           (== tokens.type "objlit"))
                      (do
                                        ;(comp_log "compile: object: " tokens)
                       (compile_obj_literal tokens ctx))
                      
                      
                      (is_array? tokens)
                      (do
                       (comp_log (+ "compile: " _cdepth " [array_literal]:") "->" tokens)
                       (cond
                         ;; simple case, just an empty array, return js equiv     
                         (== tokens.length 0)
                         [{ `ctype: "array" `is_literal: true } "[]" ]
                         else
                         (let
                             ((`is_operation false)
                              (`symbolic_replacements [])
                              (`compiled_values []))
                           
                           ;; in this case we need to compile the contents of the array
                           ;; and then based on the results of the compilation determine
                           ;; if it is an evaluation (first element of the array is a
                           ;; function or operator) or a non operation.  If the former
                           ;; it must be evaluated and returned or if the latter, returned
                           ;; as an array of values.
                           (comp_log (+ "compile: " _cdepth " [array_literal]:") "passing to compile tokens.0" tokens.0)
                           ;; the first element is the operator 
                           (= rcv (compile tokens.0 ctx (+ _cdepth 1)))
                           (comp_log (+ "compile: " _cdepth " [array_literal]:") "<- stmt" rcv)
                           
                           ;; compiled values will hold the compiled contents
                           
                           (for_each (`t (rest tokens))
                                     (push compiled_values
                                           (compile t ctx (+ _cdepth 1))))
                           
                           ;; next we need to go through and find any blocks 
                           ;; that need to be wrapped in a temp variable so we don't 
                           ;; end up writing them out twice due to the array construction
                           ;; but we also need to preserve the order of evaluation of each array element
                           ;; from first to last.

                           (map (fn (`compiled_element idx)
                                    (let
                                        ((`inst (if (and (is_object? compiled_element.0)     ;; get the instructive metadata from the compiled structure
                                                         (prop compiled_element.0 `ctype))
                                                    (prop compiled_element.0 `ctype)
                                                    nil)))
                                      (cond 
                                        (or (== inst "block")
                                            (== inst "letblock"))
                                        (do
                                          (comp_log (+ "compile: " _cdepth " [array_literal]:" ) "received raw block back at pos " idx "...need to wrap it but keep structural return value as an array")
                                          ;; the argument offset, the temp variable name and the wrapped function are made available
                                          (push symbolic_replacements
                                                [ idx (gen_temp_name "array_arg") 
                                                  [ { `ctype: "AsyncFunction"} "(" "async" " " "function" "()" " " compiled_element " " ")"]]))
                                        (== inst "ifblock")
                                        (do 
                                           (comp_log (+ "compile: " _cdepth " [array_literal]:" ) "received raw if block back at pos " idx "...need to wrap it but keep structural return value as an array")
                                           (push symbolic_replacements
                                                 [ idx (gen_temp_name "array_arg") 
                                                   [{ `ctype: "AsyncFunction"} "(" "async" " " "function" "()" " " "{" (splice_in_return compiled_element)  "}" " " ")"]])))))
                                
                                compiled_values)
                           
                           ;; next layout the code, and substitute in compiled_values the references to the functions
                           ;; in the compiled_values array
                           
                           (comp_log (+ "compile: " _cdepth " [array_literal]:") "# of symbolic_replacements: " symbolic_replacements.length)
                           (comp_log (+ "compile: " _cdepth " [array_literal]:") (if (is_array? rcv)
                                                                                     rcv.0.ctype
                                                                                     "NO CTYPE RETURNED"))
                           (for_each (`elem symbolic_replacements)
                                     (do
                                      ;; create the function 
                                      (for_each (`t ["let" " " elem.1 "=" elem.2 ";"])
                                                (push acc t))
                                      ;; splice in the reference
                                      (-> compiled_values `splice elem.0 1 ["await" " " elem.1 "()"])))
                           
                           
                           ;; if we have symbolic replacements, we need to generate a block
                           ;; and return that since we have to more processing in place 
                           
                           (when (> symbolic_replacements.length 0)
                             (prepend acc "{")
                             (prepend acc { `ctype: "block" }))
                           
                           
                           
                           (cond 
                             (or (and (is_object? rcv.0)
                                      (is_function? rcv.0.ctype))
                                 (and (is_object? rcv.0)
                                      (not (is_array? rcv.0))
                                      (contains? "unction" rcv.0.ctype)))
                             (do
                               (comp_log (+ "compile: " _cdepth " [array_literal]:") " requires evaluation:" (clone rcv))
                               (= is_operation true)
                               (for_each (`t ["(" rcv ")" "(" ])
                                         (push acc t))
                               (push_as_arg_list acc compiled_values)
                               (push acc ")"))
                             
                             
                             
                             (or (and (is_string? rcv)
                                      (get_declaration_details ctx rcv))
                                 (and (is_array? rcv)
                                      (is_object? rcv.0)
                                      (and rcv.0.ctype
                                           (and (not (contains? "unction" rcv.0.ctype))
                                                (not (== "string" rcv.0.ctype))
                                                (not (== "nil" rcv.0.ctype))
                                                (not (== "Number" rcv.0.ctype))
                                                (not (== "undefined" rcv.0.ctype))
                                                (not (== "objliteral" rcv.0.ctype))
                                                (not (== "Boolean" rcv.0.ctype))
                                                (not (== "array") rcv.0.ctype)))))
                                                
                                           
                             
                                 
                              ;; an ambiguity which results in a performance penalty because we need 
                              ;; create a function that checks the first symbol in the array is a function
                              ;; if the first symbol in the array is a reference.
                              (do
                              (comp_log (+ "compile: " _cdepth " [array_literal]:") "ambiguity: compiled: " (clone rcv))
                              (= tmp_name (gen_temp_name "array_op_rval"))
                              
                              (if (and (is_object? rcv.0)
                                       (contains?  "block" (or rcv.0.ctype "")))
                                  (do
                                   (comp_log (+ "compile: " _cdepth " [array_literal]:" ) "received raw block back...need to wrap it but keep structural return value as an array")
                                   (= rcv (check_statement rcv))))
                               
                               (comp_log (+ "compile: " _cdepth " [array_literal]:") "ambiguous, requires a runtime check" (clone rcv))
                               (when (> symbolic_replacements.length 0)
                                 ;; this means it is a block and we need to return the last value
                                 ;; in this case it is the 
                                 (push acc { `ctype: "block" })
                                 (push acc "return")
                                 (push acc " "))
                               
                               (for_each (`t ["await" " " "(" "async" " " "function" "()" "{" "let" " " tmp_name "=" rcv ";" " "  "if" " " "(" tmp_name " " "instanceof" " " "Function" ")" "{"
                                             "return" " " "await" " " tmp_name "(" ])
                                         (push acc t))
                               (push_as_arg_list acc compiled_values)
                                        ; (for_each (`t (rest tokens))
                                        ;   (do 
                                        ;      (= rcv (compile t ctx (+ _cdepth 1)))
                                        ;     (= rcv (check_statement rcv))
                                        ;    rcv
                                        ;   )))
                               (for_each (`t [")" " " "}" " " "else" " " "{" "return" "[" tmp_name ])
                                         (push acc t))
                               
                               (when (> (length (rest tokens)) 0)
                                 (push acc ",")
                                 (push_as_arg_list acc compiled_values)) 
                                        ; (for_each (`t (rest tokens))
                                        ;          (do
                                        ;             (= rcv (compile t ctx (+ _cdepth 1)))
                                        ;            (= rcv (check_statement rcv))
                                        ;           rcv))))
                               (for_each (`t ["]" "}" "}" ")" "()"])
                                         (push acc t)))
                             else   
                             (do
                              
                              (comp_log (+ "compile: " _cdepth " [array_literal]:") "not evaluating" rcv)
                              (when (> symbolic_replacements.length 0)
                                (push acc "return")
                                (push acc " "))
                               (push acc "[")
                               (= rcv (check_statement rcv))
                               (push acc rcv)
                               (when (> (length (rest tokens)) 0)
                                 (push acc ",")
                                 (push_as_arg_list acc compiled_values)) 
                               
                                        ; (for_each (`t (rest tokens))
                                        ;        (do
                                        ;           (= rcv (compile t ctx (+ _cdepth 1)))
                                        ;          (= rcv (check_statement rcv))
                                        ;         rcv))
                               (push acc "]")))
                                        ;(comp_log (+ "compile: " _cdepth " [array_literal]:") "is_operation: " is_operation "first rcv: ", rcv.0 "sub_type rcv.0: ", (sub_type rcv.0))
                           (when (> symbolic_replacements.length 0)
                             (push acc "}"))
                           (comp_log (+ "compile: " _cdepth " [array_literal]:") "<-" acc)
                           ;(console.log (+ "compile: " _cdepth " [array_literal]: <-") acc)
                           
                           acc)))
                      
                      
                      
                      (and (is_object? tokens)
                           (is_array? tokens.val)
                           tokens.type)
                      (do 
                       (comp_log (+ "compile: " _cdepth " token.val is array:") tokens)
                       (set_prop ctx
                        `source
                        tokens.source)
                        (= rcv (compile tokens.val ctx (+ _cdepth 1)))
                        (comp_log (+ "compile: " _cdepth " token.val is array:<-") rcv)
                        
                       rcv)
                      
                      
                      ; Simple compilations ----
                      (or (and (is_object? tokens)
                               tokens.val
                               tokens.type)
                          (== tokens.type "literal")
                          (== tokens.type "arg")
                          (== tokens.type "null"))
                      (do 
                       (comp_log (+ "compile: " _cdepth " singleton: ") tokens)
                       (comp_log "    ctx: " (clone ctx))
                        (cond
                          (and (not tokens.ref)
                               (== tokens.type "arr"))
                          (compile tokens.val ctx (+ _cdepth 1))
                          
                          (or (== tokens.type "null")
                              (and (== tokens.type "literal")
                                   (== tokens.name "null")
                                   tokens.ref))
                          [ { `ctype: "nil" } "null" ]
                          (and (== tokens.type "literal")
                               (== tokens.name "undefined")
                               tokens.ref)
                          [ { `ctype: "undefined" } "undefined" ]
                          (not tokens.ref)
                          (if (and (== tokens.type "literal")
                                   (is_string? tokens.val))
                              (do 
                                        ;(comp_log (+ "compile: " _cdepth " singleton:") "is a literal")
                               [ { `ctype: "string" } (+ "\"" (cl_encode_string tokens.val) "\"") ])
                              
                               [{ `ctype: (sub_type tokens.val)  } tokens.val ])  ;; straight value
                          
                          (and tokens.ref 
                               (prop op_lookup tokens.name))
                          tokens.name
                          
                          (and tokens.ref 
                               (do
                                   (defvar `snt_name (sanitize_js_ref_name tokens.name))
                                   (defvar `snt_value (get_ctx ctx snt_name))
                                   (comp_log (+ "compile: " _cdepth " singleton: ") "local ref?" snt_name snt_value)
                                   (or snt_value
                                       (== false snt_value))))
                                   ;(== false (get_ctx ctx tokens.name))))
                          (do 
                            (= refval snt_value) ;(get_ctx ctx (sanitize_js_ref_name tokens.name)))
                            (when (== refval "?arg")
                              (= refval snt_name)) ;tokens.name))
                            (comp_log "compile: singleton: found local context: " refval "literal?" (is_literal? refval))
                                        ;(comp_log "compile: singleton: get_declaration_details: " (get_declaration_details ctx tokens.name))
                            (if (== tokens.type "literal")
                               refval
                               (get_val tokens ctx)))
                          
                          (get_lisp_ctx tokens.name)
                          (compile_lisp_scoped_reference tokens.name ctx)
                          
                          else
                          (do (comp_log "compile: unknown reference: " tokens.name)
                              (throw ReferenceError (+ "compile: unknown reference: " tokens.name)))))
                      else
                      (do 
                       (error_log "compile: invalid compilation structure:",tokens)
                       (console.error "Compile passed invalid compilation structure")
                        (console.error (clone tokens))
                        (console.error "CTX:" (clone ctx))
                        (throw SyntaxError "compile passed invalid compilation structure"))
                      ))
                (catch Error (`e)
                       (do
                        (setq is_error {
                              `error: e.name
                              `message: e.message
                              `form: ctx.source
                              `parent_forms: (get_source_chain ctx)
                              `invalid: true
                              `text: (as_lisp (if (is_array? tokens)
                                                  (map (fn (v)
                                                           v.val) 
                                                       tokens)
                                                  tokens.val))
                              })
                        (push errors
                           (clone is_error))
                        (error_log is_error)
                        (console.error "compilation",is_error)
                         ))))))
       (`final_token_assembly nil)
       (`main_log (if opts.quiet_mode
                      log
                      (defclog { `prefix: "compiler:" `background: "darkblue" `color: "white" } )))
       (`assemble_output
         (fn (js_tree)
             (let
                 ((`text [])
                  (`in_quotes false)
                  (`escaped 0)
                  (`escape_char (String.fromCharCode 92))
                  (`format_depth [])
                  (`last_t nil)
                  (`insert_indent 
                    (fn ()
                        (do 
                         (push text "\n")
                         (for_each (`spacer format_depth)
                          (push text spacer)))))
                  (`process_output_token 
                    (fn (t)
                        (do 
                         (= escaped (Math.max 0 (- escaped 1)))
                         (cond
                           (and (== t "\"")
                                (== escaped 0)
                                in_quotes)
                           (do
                            (= in_quotes false)
                            (push text t))
                           (and (== t "\"")
                                (== escaped 0))
                           (do 
                            (= in_quotes true)
                            (push text t))
                           (== t escape_char)
                           (do 
                            (== escaped 2)
                            (push text t))
                           
                           
                           (and (not in_quotes)
                                (== t "{"))
                           (do 
                            (push text t)
                            (push format_depth "    ")
                             (insert_indent))
                           (and (not in_quotes)
                                (starts_with? "}" t))
                           (do 
                            
                            (pop format_depth)
                            (insert_indent)
                             (push text t))
                           (and (not in_quotes)
                                (== t ";"))
                           (do 
                            (push text t)
                            (insert_indent))
                           (and false (not in_quotes)
                                (starts_with? "/*" t))
                           (do 
                            (push text t)
                            (insert_indent))
                           
                           else
                           (do 
                            (push text t))))))
                  
                  
                  (`assemble (fn (js_tokens)
                              (for_each (`t js_tokens)
                                        (cond 
                                          (is_array? t)
                                          (do 
                                           (assemble t))
                                          (is_object? t)
                                          (do
                                           (when t.comment
                                             (push text (+ "/* " t.comment " */"))
                                             (insert_indent)))
                                          
                                        ;(log "assemble: descriptor encountered:" t)
                                          else
                                          (do 
                                           (if opts.formatted_output
                                               (process_output_token t)
                                               (push text t))))))))
               (do 
                (assemble (flatten [js_tree]))
                (join "" text))))))
    
    
    
    ;; setup key values in the context for flow control operations 
    ;; break - the looping constructs will return down the stack if
    ;;         the special reference __BREAK__FLAG__ is true for their
    ;;         parent context
    
    (set_ctx root_ctx
             break_out
             false)
    (set_prop root_ctx
              `defined_lisp_globals
              {})
    ;(console.clear)
   
    (main_log "Starting tokenization..." (clone tree))
    
    (= output
       (cond
         opts.only_tokens
         (tokenize tree root_ctx)  
         
         is_error
         [{ `ctype: `CompileError } is_error]
         
         
         else
         (do
            (try 
               (do
                   (= final_token_assembly (tokenize tree root_ctx)))
                (catch Error (`e)
                    (console.error "pre-compilation: " e.message)))
            
            (if (eq nil final_token_assembly)
              (do  
                  (= is_error (new Error "Pre-Compilation Error"))
                  (error_log "pre-compilation error")
                  (console.error "pre-compilation error")
                  is_error)
              (do
                  (main_log "final token assembly:" final_token_assembly)
                  (= assembly (compile final_token_assembly
                                       root_ctx
                                       0))))
           (if is_error
               (error_log "compilation" (clone is_error))
               (main_log "no compilation errors"))
           (main_log "globals:" has_lisp_globals " constructed assembly:" (clone assembly))
           (main_log "assembly: " (assemble_output assembly))
           (cond 
             (and (not is_error)
                  assembly
                  (is_object? (first assembly))
                  (prop (first assembly) `ctype)
                  (or (not (is_string? (prop (first assembly) `ctype)))
                      (let
                          ((`val (prop (first assembly) `ctype)))
                        (and (not (== val "assignment"))
                             (not (contains? "block" val))
                             (not (contains? "unction" val))))))
             
             
             (set_prop assembly.0
                       `ctype
                       "statement")
             (and (is_string? (first assembly))
                  (== (first assembly) "throw"))
             (= assembly
                [ { `ctype: `block } assembly])
             (and (not is_error)
                  (or (not (is_object? (first assembly)))
                      (not (prop (first assembly) `ctype))))
             (= assembly
                [ { `ctype: `statement } assembly]))
           ;; if we are compiling with the root_environment option as true
           ;; we don't have a pre-existing environment, because we are
           ;; compiling the environment.
           (when opts.root_environment
                (= has_lisp_globals false))
           (if is_error
               (do 
                (error_log "compiler: is an error: " is_error)
                is_error)
               (if (is_object? (first assembly))
                   [(+ { `has_lisp_globals: has_lisp_globals }
                       (take assembly))
                   (assemble_output assembly)]
                   [{`has_lisp_globals: has_lisp_globals } (assemble_output assembly)])))))
    (main_log "<-" (clone output))
    (main_log "referenced global symbols:" (clone referenced_global_symbols))
    (when (> errors.length 0)
       (map (fn (x)
                (error_log x))
            errors))
    (when opts.error_report
          (opts.error_report errors))
    output))




                                        ;(run_tests { `table: true })

;; make_environment returns a closure that serves as the global environment
;; in which all evaluations occur.  It contains the global values 
;; and provides facilities for the compiler 

(do   ;; put in do to rebuild global env when rebuilding the function
 (defglobal `make_environment 
     (fn (opts)
         (let
             ((`check_external_env true)
              (`self this)
              (`get_global (fn (refname value_if_not_found suppress_check_external_env)
                               (if (not (== (typeof refname) "string"))
                                   (throw TypeError "reference name must be a string type")
                                    (let
                                        ((`comps (get_object_path refname))
                                         (`refval nil)
                                         
                                         ;; shadow the environments scope check if the suppress_check_external_env is set to true
                                         ;; this is useful when we have reference names that are not legal js reference names
                                         
                                         (`check_external_env (if suppress_check_external_env
                                                                  false
                                                                  check_external_env)))
                                         
                                          ;; search path is to first check the global Lisp Environment
                                          ;; and if the check_external_env flag is true, then go to the
                                          ;; external JS environment.
                                          
                                      (= refval (or (prop global_ctx.scope comps.0)
                                                    (if check_external_env
                                                        (or (get_outside_global comps.0)
                                                            NOT_FOUND)
                                                        NOT_FOUND)))
                                      
                                      (when (not (prop global_ctx.scope comps.0))
                                        (console.log "get_global: [external reference]:" refname))
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
                                              NOT_FOUND))))))
                                      
              (`interface {
                   `get_global: get_global
              })
              (`Environment interface)
              (`id (get_next_environment_id))
              
              ;; Definitions contains metadata about defined symbols in this
              ;; envuronment
              ;; definitions are accessed via the symbol name and returns an object 
              ;; describing attributes of the symbol
              ;;
              ;; eval_when: an object of specifiers as to what situations to evaluate the contents the symbol refers to (`compile_time `exec_time) when true
              (`definitions { })
              
              
              ;; the root context 
              (`global_ctx {
                   ;; standard library
                       `scope:{
                           `MAX_SAFE_INTEGER: 9007199254740991
                           `Set: Set
                           `null: null
                           `nil: null
                           `Array: Array
                           `Number: Number
                           `Object: Object
                           `String: String
                           `Function: Function
                           `AsyncFunction: AsyncFunction
                           `Error: Error
                           `SyntaxError: SyntaxError
                           `ReferenceError: ReferenceError
                           `TypeError: TypeError
                           `RangeError: RangeError
                           `URIError: URIError 
                           `EvalError: EvalError
                           `Date: Date
                           `JSON: JSON
                           `lisp_writer: lisp_writer
                           `as_lisp: lisp_writer
                           `Math: Math
                           `fetch: fetch
                           `get_next_environment_id: get_next_environment_id
                           `null: null
                           `Intl: Intl
                           `isNaN: isNaN
                           `console: console
                           `compiler: compiler
                           `btoa: btoa
                           `atob: atob
                           `undefined: undefined
                           `b64encode: btoa
                           `log: console.log
                           `b64decode: atob
                           `parseInt: parseInt
                           `int: parseInt
                           `parseFloat: parseFloat
                           `float: parseFloat
                           `Environment: Environment
                           `compiler: compiler
                           `sub_type: subtype
                           `values: (new Function "...args"
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
                           `pairs: (new Function "obj"
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
                           `keys: (new Function "obj"
                                      "{  return Object.keys(obj);  }")
                           `take: (new Function "place" "{ return place.shift() }")
                           
                           `prepend: (new Function "place" "thing" "{ return place.unshift(thing) }")
                           `first: (new Function "x" "{ return x[0] }")
                           `last:  (new Function "x" "{ return x[x.length - 1] }")
                           `slice: (fn (target from to)
                                       (cond
                                         to
                                         (-> target `slice from to)
                                         from
                                         (-> target `slice from)
                                         else
                                         (throw SyntaxError "slice requires 2 or 3 arguments")))
                           `rest: (fn (x)
                                      (cond 
                                        (instanceof x Array)
                                        (-> x `slice 1)
                                        (is_string? x)
                                        (-> x `substr 1)
                                        else
                                        nil))
                           `second: (new Function "x" "{ return x[1] }")
                           `third: (new Function "x" "{ return x[2] }")
                           
                           `chop:  (new Function "x" "{ return x.substr(x.length-1) }")
                           `not:   (new Function "x" "{ if (x) { return false } else { return true } }")
                           `push:  (new Function "place" "thing" "{ return place.push(thing) }")
                          
                           `pop: (new Function "place" "{ return place.pop() }")
                           `list: (fn (`& args)
                                      args)
                           `flatten: (new Function "x" "{ return x.flat() } ")
                           `jslambda: (fn (`& args)
                                          (apply Function (flatten args)))
                           `join: (fn (`& args)
                                      (cond
                                        (== args.length 1)
                                        (-> args `join "")
                                        else
                                        (-> args.1 `join args.0)))
                           `log: (fn (`& args)
                                     (apply console.log args))
                           `split: (new Function "container" "token" "{ return container.split(token) }")
                           `split_by: (new Function "token" "container" "{ return container.split(token) }")
                           
                           `is_object?: (new Function "x" "{ return x instanceof Object }")
                           `is_array?:  (new Function "x" "{ return x instanceof Array }")
                           `is_number?: (fn (x)
                                            (== (sub_type x) "Number"))
                           `is_function?: (fn (x)
                                              (instanceof x Function))
                           `is_set?:     (new Function "x" "{ return x instanceof Set }")
                           `is_element?: (new Function "x" "{ return x instanceof Element }")
                           `is_string?:  (fn (x)
                                            (or (instanceof x String) 
                                                (== (typeof x) "string")))
                           `ends_with?:   (new Function "val" "text" "{ if (val instanceof Array) { return text[text.length-1]===val } else { return text.endsWith(val) } }")
                           `starts_with?: (new Function "val" "text" "{ if (val instanceof Array) { return text[0]===val } else { return text.startsWith(val) } }")
                                          
                           `blank?: (fn (val)
                                        (or (eq val nil)
                                            (and (is_string? val)
                                                 (== val ""))))
                           `contains?: (fn (value container)
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
                                             (-> container `includes? value)
                                             (is_set? container)
                                             (-> container `has value)
                                             else
                                             (throw TypeError (+ "contains?: passed invalid container type: " (sub_type container)))))
                           `make_set: (fn (vals)
                                          (if (instanceof vals Array)
                                              (new Set vals)
                                              (let
                                                  ((`vtype (sub_type vals)))
                                                (cond
                                                  (== vtype "Set")
                                                  (new Set vals)
                                                  (== vtype "object")
                                                  (new Set (values vals))))))
                           
                           `describe: (fn (quoted_symbol)
                                          (let
                                              ((`not_found { `not_found: true })
                                               (`location (cond (prop global_ctx.scope quoted_symbol)
                                                                "global"
                                                                (not (== not_found (get_outside_global quoted_symbol not_found)))
                                                                "external"
                                                                else
                                                                nil)))
                                            
                                            (+ {
                                               `type: (cond
                                                        (== location "global")
                                                        (sub_type (prop global_ctx.scope quoted_symbol))
                                                        (== location "external")
                                                        (sub_type (get_outside_global quoted_symbol))
                                                        else
                                                        "undefined")
                                               `location: location
                                               }
                                               (if (prop definitions quoted_symbol)
                                                   (prop definitions quoted_symbol)
                                                   {}))))
                           
                           `undefine: (fn (quoted_symbol)
                                          (if (prop global_ctx.scope quoted_symbol)
                                              (delete_prop global_ctx.scope quoted_symbol)
                                              false))
                           
                           `eval: (fn (expression)
                                      (do 
                                       (console.log "EVAL:",expression)
                                       (expression)))
                           `range: (fn (`& args)
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
                                         acc))
                           `conj: (new Function "...args"
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
                           `add: (new Function "...args"
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
                           `merge_objects: (new Function "x"
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
                           `index_of: (new Function "value,container"
                                           "{ let searcher = (v) => v == value; return container.findIndex(searcher);}")
                           `resolve_path: (new Function "path,obj" 
                                               "{
                                                    if (typeof path==='string') {
                                                        path = path.split(\".\");
                                                    }
                                                    let s=obj;
                                                    return path.reduce(function(prev, curr) {
                                                        return prev ? prev[curr] : undefined
                                                    }, obj || {})
                                                }")
                           `delete_prop: (new Function "obj" "...args"
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
                           `length: (new Function "obj"
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
                           `trim: (fn (x)
                                      (-> x `trim))
                           `map: (new AsyncFunction "lambda" "array_values" 
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
                           `to_object: (new Function "array_values"
                                            "{
                                                  let obj={}
                                                  array_values.forEach((pair)=>{
                                                         obj[pair[0]]=pair[1]
                                                  });
                                                  return obj;
                                                }")
                           `bind: (new Function "func,this_arg"
                                       "{ return func.bind(this_arg) }")
                           `defclog: (fn (opts)
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
                                                                         args))
                                                                   
                                                                           ) ))
                           }
                       })
              
              ;; inlines are optimizations that are placed in the assembled code 
              ;; however, since they mimicing functions, they must have a function
              ;; analog, so apply and references to the function itself work as expected
              (`inlines (+ {} 
                           (if opts.inlines
                               opts.inlines
                               {})
                           { ;`first: (fn (args)
                                        ;           [args.0 "[" 0 "]" ])
                                        ;`last: (fn (args)
                                        ;           [args.0 "[" args.0 ".length" "-" 1 "]" ])
                               `pop: (fn (args)
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
                               `flatten: (fn (args)
                                             [ args.0 ".flat()"] )
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
              (`NOT_FOUND (new ReferenceError "not found"))
              
                                               
              
                                      
              (`set_global (fn (refname value meta)
                               (do
                                (if (not (== (typeof refname) "string"))
                                    (throw TypeError "reference name must be a string type"))
                                (log "Environment: set_global: " refname value)
                                 (set_prop global_ctx.scope 
                                           refname
                                           value)
                                 (if (and (is_object? meta)
                                          (not (is_array? meta)))
                                     (set_prop definitions
                                               refname
                                               meta))
                                 (prop global_ctx.scope refname)
                                 )))
              (`type_marker (fn (type)
                                (set_prop 
                                 (new Object)
                                 `ctype type)
                                ))
              
              (`last_exception nil)
              (`meta_for_symbol (fn (quoted_symbol)
                                    (do
                                     (log "env: meta_for_symbol: symbol: " quoted_symbol)
                                     (if (starts_with? (quote "=:") quoted_symbol)
                                         (prop definitions (-> quoted_symbol `substr 2))
                                         (prop definitions quoted_symbol)))))
              
              
              (`compile (fn (json_expression opts)
                            (compiler json_expression { `env: interface })))
              (`env_log (defclog { `prefix: (+ "env" id) `background: "#B0F0C0" }))
              (`evaluate (fn (expression ctx opts)
                             (let
                                 ((`opts (or opts
                                             {}))
                                  (`compiled nil)
                                  (`result nil))
                               (env_log "-> expression: " expression) 
                               (env_log "-> ctx: " (sub_type ctx) ctx)
                               (= compiled
                                  (compiler (if opts.json_in
                                                expression
                                                (-> interface `read_lisp expression))
                                            { `env: interface 
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
                                 (= last_exception nil)
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
                                         
                                         (compiled.1 interface))
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
                                          (compiled.1 interface))
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
                                          (compiled.1 interface))
                                         (do 
                                          (set_prop compiled
                                                    1
                                                    (new Function (+ "{ return " compiled.1 "}")))
                                          (compiled.1))))
                                    else ;; this is a simple expression
                                    compiled.1)))
                                (catch Error (`e)
                                       (= last_exception e)))
                               (if last_exception
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
                                    (env_log "<- ERROR: " (-> last_exception `toString))
                                    (= result last_exception)
                                     (= last_exception nil)
                                     (if ctx.in_try
                                         (throw result)))
                                   (env_log "<-" result))
                               result)))
              (`eval_struct (fn (lisp_struct ctx opts)
                                (if (is_function? lisp_struct)
                                    (lisp_struct)
                                    (evaluate lisp_struct ctx (+ {
                                                                 `json_in: true
                                                                 }
                                                                 (or opts {})))))))
           
                                        ;(= library (jslambda () "{ return import('/dlisp_init.js'); }"))
                                        ;(library)
           
           (set_prop interface
                     `get_global get_global
                     `set_global set_global
                     `inlines inlines
                     `eval eval_struct
                     `identify subtype
                     `context global_ctx
                     `meta_for_symbol meta_for_symbol
                     `read_lisp read_lisp
                     `as_lisp as_lisp
                     `definitions definitions
                     `compile compile
                     `evaluate evaluate
                     `do_deferred_splice do_deferred_splice
                     `as_lisp (fn (v)
                                  (as_lisp v))
                     `id (fn () id)
                     `set_check_external_env (fn (state)
                                                 (do 
                                                  (= check_external_env
                                                     state)
                                                  check_external_env))
                     `check_external_env (fn ()
                                             check_external_env))
           interface)))
 
 ;; Global environment for dev purposes
 
 (defglobal `env (make_environment))
  (-> env `evaluate "(defglobal `developer developer)")
  (-> env `evaluate (+ "(defglobal `client (-> developer `getInstanceById " client.id "))"))
                                        ;(-> env `evaluate "(defglobal `log (bind client.log client))")
  (-> env `evaluate "(defglobal `restore_cl_evaluator (fn () (set_prop client `alternateCommandLisp nil)))")
  (-> env `evaluate "(defglobal when
                       (fn (condition `& mbody) 
                               (do
                                  `(if ,#condition
                                       (do
                                           ,@mbody))))
                        {`eval_when:{ `compile_time: true }})")
  )



(defun `dlisp_tab ()
  (let
      ((`result nil)
       (`compiled nil)
       (`view nil)
       (`lisp_view (div { `style: "height: calc(100% - 10px);" }))
       (`js_code_view (div { `style: "height: calc(100% - 10px);" } ))
       (`js_code_editor
         (controls/code_editor { `parent: js_code_view `javascript_mode: true }))
       (`success false)
       (`lisp_code_editor (controls/code_editor {
                                                `parent: lisp_view
                                                }))
       (`output_view (div { `style: "height: calc(100% - 10px)" } ))
       (`output_editor
         (controls/code_editor {
                               `parent: output_view
                               }))
       (`messages_view (div { `style: "height: calc(100% - 10px)" } "Messages"))
       (`messages_editor
         (controls/code_editor { `parent: messages_view }))
       (`compile_button (button { `class: "MenuButton2" } "Compile"))
       (`evaluate_button (button { `class: "MenuButton2" } "Evaluate"))
       (`evaluate_js_button (button { `class: "MenuButton2" } "Evaluate JS"))
       (`controls [ compile_button  evaluate_button evaluate_js_button ])
       (`control_view (div { `style: "display: flex; margin: 5px;" } 
                           controls))
       
       (`compile (fn (eval_code?)
                     (do
                      ;(set_disabled compile_button evaluate_button evaluate_js_button)
                      (clear_log)
                      (console.clear)
                      
                      (notify "Running")
                       (try
                        (do 
                            (if eval_code?
                                (= result
                                   (-> env `evaluate (-> lisp_code_editor.editor `getValue)
                                       nil
                                       { `error_report: (fn (errors)
                                                            (display_errors errors))
                                         `on_compilation_complete: (fn (compiled_code)
                                                                       (disp_comp_results compiled_code)) }))
                                (= compiled (compiler (-> env `read_lisp (-> lisp_code_editor.editor `getValue))
                                                      { `formatted_output: true `js_out: true })))
                           (disp_comp_results compiled)
                           (-> output_editor.editor `setValue (cond
                                                                  (== result undefined)
                                                                  "[undefined]"
                                                                  (== result nil)
                                                                  "[nil]"
                                                                  (is_function? result)
                                                                  (-> result `toString)
                                                                  else
                                                                  (JSON.stringify result nil 4)))
                           (-> output_editor.editor `gotoLine 0 0))        
                        (catch Error (`e)
                               (do
                                (log (+ "COMPILE ERROR:" e)))))
                       
                       (set_enabled compile_button evaluate_button evaluate_js_button))))
       (`resize_observer
         nil)
       (`display_errors
           (fn (errors)
               (do
                   (-> messages_editor.editor `setValue (JSON.stringify errors nil 4))
                   (-> messages_editor.editor `gotoLine 0 0))))
       (`disp_comp_results
         (fn (compiled)
             (cond
               (and compiled
                    (== compiled.length 2))
               
               (do 
                   (console.log "dlisp_tab: compiled text: " compiled.1)
                   (-> js_code_editor.editor `setValue 
                       compiled.1)
                   (-> js_code_editor.editor `gotoLine 0 0))
               
               compiled
               (do 
                   (console.log "dlisp_tab: compiled text: " compiled)
                   (-> js_code_editor.editor `setValue
                       compiled)
                   (-> js_code_editor.editor `gotoLine 0 0)))))
       (`qview 
         (quad_view [ lisp_view
                    js_code_view
                    messages_view
                    output_view ]
                    { `on_size_adjust: (fn ()
                                           (do
                                            (-> js_code_editor.editor `resize)
                                             (-> lisp_code_editor.editor `resize))) }
                    )))
    (= view
       (div { `style: "height: calc(100% - 10px); overflow: hidden;"}
            control_view
            qview.view))
    
    (-> lisp_code_editor.editor.commands `addCommand
        {
        `name: "exec"
        `bindKey: { `win: "Shift-Enter" `linux: "Shift-Enter" `mac: "Shift-Enter" }
        `exec: compile
        })
    (attach_event_listener compile_button `click
                           compile)
    
    (attach_event_listener evaluate_button `click
                           (fn (e)
                               (compile true)))
    (attach_event_listener evaluate_js_button `click
                           (fn (e)
                               (let
                                   ((`f (new AsyncFunction "Environment" 
                                             (-> js_code_editor.editor `getValue)))
                                    (`result (f env)))
                                   (-> output_editor.editor `setValue (cond
                                                                  (== result undefined)
                                                                  "[undefined]"
                                                                  (== result nil)
                                                                  "[nil]"
                                                                  (is_function? result)
                                                                  (-> result `toString)
                                                                  else
                                                                  (JSON.stringify result nil 4)))  )))    
                                   
                                         
    
    (setTimeout (fn ()
                    (do 
                     (-> qview `set_vertical_position (- window.innerWidth (/ window.innerWidth 2)))
                     (-> qview `set_horizontal_position (- window.innerHeight (/ window.innerHeight 3)) (- window.innerHeight (/ window.innerHeight 2)))))
                
                1000)
    view))

(defun `dlisp_tabs ()
   (do
       (tab ["Dlisp 1" (dlisp_tab)] true)
       (sleep 1)
       (tab ["Dlisp 2" (dlisp_tab)] true)
       (sleep 1)
       (tab ["Dlisp 3" (dlisp_tab)] true)
       (sleep 1)
       (tab ["Dlisp 4" (dlisp_tab)] true)
       (sleep 1)
       (tab ["Dlisp 5" (dlisp_tab)] true)))


                                        ;(show_test_dialog)
(do
 
 (defun `show_test_dialog (test_number)
   (let
       ((`test_detail (or (prop compiler_tests test_number)
                          ["" [] undefined "No Test"]))
        (`result nil)
        (`compiled nil)
        (`setup_code (prop test_detail 5)))
     (dialog_window 
      (let
          ((`view (div { `style: "height: 700px; width: 700px;" } ))
           (`test_output (div { `style: "height: 50px"} "Test Output" ))
           
           (`test_code_view 
             (if setup_code
                 (div { `style: "height: 200px;" } )
                 (div { `style: "height: 200px;" } )))
           (`js_code_view 
             (div { `style: "height: 300px;" } ))
           (`js_code_editor
             (controls/code_editor { `parent: js_code_view `javascript_mode: true }))
           (`setup_code_view 
             (when setup_code
               (div { `style: "margin-top: 4px; height: 50px;" } )))
           (`success false)
           (`test_code_editor (controls/code_editor {
                                                    `parent: test_code_view
                                                    }))
           (`run_test_button (button { `class: "MenuButton2" `style: "background: darkblue; color: white;" } "Run Test"))
           (`compile_button (button { `class: "MenuButton2" } "Compile Only"))
           (`setup_code_editor 
             (when setup_code
               (controls/code_editor {
                                     `parent: setup_code_view
                                     })))
           (`disp_comp_results
             (fn (compiled)
                 (cond
                   (and compiled
                        (== compiled.length 2))
                   
                   (-> js_code_editor.editor `setValue 
                       compiled.1)
                   
                   compiled
                   (-> js_code_editor.editor `setValue
                       (as_lisp compiled)))))
           (`compile (fn (eval_code?)
                         (do
                          (set_disabled compile_button run_test_button)
                          (clear_log)
                           (try
                            (if eval_code?
                                (-> env `evaluate (-> test_code_editor.editor `getValue)
                                    nil
                                    { `on_compilation_complete: (fn (compiled_code)
                                                                    (disp_comp_results compiled_code)) })
                                (= compiled (compiler (read_lisp (-> test_code_editor.editor `getValue))
                                                      { `formatted_output: true `js_out: true })))
                            
                            (catch Error (`e)
                                   (do
                                    (log (+ "COMPILE ERROR:" e)))))
                           (disp_comp_results compiled)
                           (set_enabled compile_button run_test_button)))))
        
        (-> view `append (div { } "Test Code"))
        (-> view `append test_code_view)
        (-> view `append (div { } "Compiled Code"))
        (-> view `append js_code_view)
        
        (-> test_code_editor.editor.commands `addCommand
            {
            `name: "exec"
            `bindKey: { `win: "Shift-Enter" `linux: "Shift-Enter" `mac: "Shift-Enter" }
            `exec: compile
            }) 
        (log "TEST DETAIL: " test_detail)
        (when setup_code
          (-> view `append (div { } "Setup Code"))
          (-> view `append setup_code_view))
        (-> view `append run_test_button)
        (-> view `append compile_button)
        (-> view `append test_output)
        
        (try 
         (do 
          (-> test_code_editor.editor `setValue test_detail.0)
          (when setup_code (-> setup_code_editor.editor `setValue test_detail.5))
           (= success true))
         (catch Error (`e)
                (log (+ "Error: " e))))
        (when (not success)
          (-> test_code_editor.editor `setValue (+ ";; No test found! ??")))
        (-> test_code_editor.session `setUseWrapMode false)      
        (-> test_code_editor.editor `setReadOnly false)
        (when setup_code_editor
          (-> setup_code_editor.editor `setReadOnly false)
          (-> setup_code_editor.session `setUseWrapMode false))
        (attach_event_listener compile_button
                               `click
                               compile)
        (if test_number             
            (attach_event_listener run_test_button
                                   `click
                                   (fn (e)
                                       (do
                                        (set_disabled compile_button run_test_button)
                                        (try
                                         
                                         (= compiled (compiler (read_lisp (-> test_code_editor.editor `getValue))
                                                               { `formatted_output: true `js_out: true }))
                                         
                                         (catch Error (`e)
                                                (do
                                                 (log (+ "COMPILE ERROR:" e)))))
                                         (try
                                          (= result (first (run_tests test_number (+ { `test_code: (-> test_code_editor.editor `getValue) }
                                                                                     (if setup_code
                                                                                         { `setup_code:  (-> setup_code_editor.editor `getValue) }
                                                                                         {})))))
                                          (catch Error (`e)
                                                 (do
                                                  (log (+ "ERROR: " e)))))
                                         (log "COMPILED: " compiled)
                                         (cond
                                           (and compiled
                                                (== compiled.length 2))
                                           (-> js_code_editor.editor `setValue 
                                               compiled.1)
                                           compiled
                                           (-> js_code_editor.editor `setValue
                                               (as_lisp compiled)))
                                         
                                         (log "RESULT: " result)
                                         (set_enabled compile_button run_test_button)
                                         (-> test_output
                                             `replaceChildren
                                             (table { `style: "width: 100%" } 
                                                    (thead
                                                     (th "Pass?") (th "Result") (th "Expected"))
                                                    (tbody
                                                     (tr
                                                      (td result.2)
                                                      (td (as_lisp result.3))
                                                      (td (as_lisp result.4)))))))))
            (attach_event_listener run_test_button
                                   `click
                                   (fn (e)
                                       (do 
                                        (set_disabled compile_button run_test_button)
                                        (compile true)
                                         (set_enabled compile_button run_test_button)))))
        
        
        (setTimeout (fn ()
                        (do 
                         (-> test_code_editor.editor `resize)
                         (-> test_code_editor.editor `moveCursorTo 0 0)
                          (-> test_code_editor.editor `clearSelection))
                        (when setup_code_editor
                          (-> setup_code_editor.editor `resize)
                          (-> setup_code_editor.editor `moveCursorTo 0 0)
                          (-> setup_code_editor.editor `clearSelection)))
                    100)
        view)
      {
      `title: (+ "Test " (or test_number "") ": " test_detail.3)
      `width: 730
      })))
 


 
 (defun `test_code (test_number)
   (prop (prop compiler_tests test_number) 0))
  (defun `cc () (do (clear_log) (console.clear)))
  (defun `run_tests (test_numbers opts)
    (let
        ((`results nil)
         (`clog (defclog { `background: "black" `color: "white" } ))
         (`test_function nil)
         (`tests compiler_tests)  ;; shadow if we slice a certain subset
         (`test_output nil)
         (`tester compiler)
         (`quiet_mode true)
         (`env (if opts.new_env
                   (make_environment)
                   env))
         (`idx -1)
         (`andf (fn (args)
                    (let
                        ((`rval true))
                      (for_each (`a (or args []))
                                (when (not a)
                                  (= rval false)
                                  (break)))
                      rval))))
      
      (clear_log)
      
      (clog "run_tests" "STARTING TESTS" (-> env `id))
      (cond 
        (and (eq opts nil)
             (is_object? test_numbers))
        (= opts test_numbers)
        (and (is_object? opts)
             (is_array? test_numbers))
        (do 
         (= tests (nth test_numbers tests)))
        (and (not (is_object? test_numbers))
             (is_number? test_numbers))
        (do 
         (= quiet_mode false)
         (= tests (nth [ test_numbers ] tests))))
      
      (= results
         (for_each (`test tests)
                   (do
                    (defvar `result nil)
                    (= test_output nil)
                     (inc idx)
                     (clog "START TEST:      " idx test.3)
                     (clog "TEST EXPRESSION: " idx (or opts.test_code
                                                       (as_lisp test.0)))
                     (sleep 0.01)
                     (when (or opts.setup_code test.5)
                       (-> env `evaluate (or opts.setup_code
                                             test.5)))  ;; environmental setup
                     (if test.4
                         (= tester (fn (v)
                                       (-> env `evaluate v)))
                         (= tester 
                                        ;(fn (source)
                                        ;   (-> env `evaluate source nil { `env: env `quiet_mode: true }))))
                            (bind_function env.evaluate env)))
                     (= result (do 
                                (= test_function
                                   (try 
                                    (tester (or opts.test_code test.0) nil { `env: env `quiet_mode: quiet_mode })
                                    (catch Error (`e)
                                           e)))
                                (clog "run_tests: test function:" (sub_type test_function) test_function )
                                 (console.log "test_function: " test_function)
                                 (cond 
                                   (and (is_object? test_function)
                                        test_function.message)
                                   
                                   (+ "FAIL: [COMPILE]: " (as_lisp test_function))
                                   (is_function? test_function)
                                   (do 
                                    (log "running function: " test.1)
                                    (= test_output
                                     (try
                                      (if (> test.1.length 0) 
                                          (apply test_function test.1)
                                          (test_function))
                                      (catch Error (`e)
                                             e)))
                                     (log "test output: " test_output))
                                   else  ;; non function - don't try and evaluate it
                                   (do (log "run_tests: non function returned: " test_function)
                                       (= test_output test_function)))
                                 (clog "TEST OUTPUT:" (sub_type test_function) test_output )
                                 (if (and (is_object? test_output)
                                          test_output.message)
                                     (+ "FAIL: [EXEC]:" (+ "compiler returned: " (as_lisp test_function) "->" (as_lisp test_output.message)))
                                     test_output)))
                     (console.log "run_tests: output: " result)                   
                    [ idx
                     (or test.3 (as_lisp test.0))
                     (== (as_lisp result) (as_lisp test.2))
                     (as_lisp result)
                     (as_lisp test.2)])))
      (cond opts.summary
            (andf (each results `1))
            opts.table
            (render_view (controls/table2 results
                                          {
                                          `on_row_click: (fn (value position)
                                                             (show_test_dialog value.0))
                                          `read_only: true
                                          `title: (if (not (== false (andf (each results `2))))
                                                      "PASS"
                                                      "FAIL")
                                          `columns:[
                                          {`name: "Test #" `width: 50 }
                                          {`name: "Test Name" `width: 300 }
                                          {`name: "Pass" `width: 50 }
                                          {`name: "Received"  `width: 200}
                                          {`name: "Expected"  `width: 50} ]
                                          `row_style_callback: (fn (row_data data_offset viewport_row_offset)
                                                                   { `columns: [nil, nil, (if (== row_data.2 true) { `style: "background: #50FF5020;" } { `style: "background: #FF505020;" }) ] })
                                          
                                          }))
            else
            results)))
  (defun `tcq (test_num)
    (do 
     (clear_log)
     (display [(test_code test_num)
      (compiler (read_lisp (test_code test_num))) { `only_code: true })]))
  )         


;; reader test
(defun `run_reader_tests ()
  (let
      ((`results [])
       (`reader_output nil)
       (`read_lisp_output nil)
       (`test_result nil)
       (`idx -1)
       (`andf (fn (args)
                    (let
                        ((`rval true))
                      (for_each (`a (or args []))
                                (when (not a)
                                  (= rval false)
                                  (break)))
                      rval))))
    (for_each (`test compiler_tests)
        (do
            (inc idx)
            (log "RUNNING TEST: " test.3 test.0)
            (sleep 0.01)
            (= reader_output (reader test.0))
            (= read_lisp_output (read_lisp test.0))
            (= test_result (== (JSON.stringify reader_output) (JSON.stringify  read_lisp_output)))
            (push results
                  [idx
                   (or test.3 (as_lisp test.0))
                   test_result
                   reader_output
                   read_lisp_output])
            (when (not test_result)
                  (console.log "FAIL TEST:", test reader_output read_lisp_output))))
                  
    
    (render_view (controls/table2 results
                                  {
                                   `on_row_click: (fn (value position)
                                                             (show_test_dialog value.0))
                                   `read_only: true
                                   `title: (if (not (== false (andf (each results `2))))
                                              "PASS"
                                              "FAIL")
                                   `columns:[
                                          {`name: "Test #" `width: 50 }
                                          {`name: "Test Name" `width: 300 }
                                          {`name: "Pass" `width: 50 }
                                          {`name: "Reader"  `width: 200}
                                          {`name: "Read Lisp"  `width: 200} ]
                                   `row_style_callback: (fn (row_data data_offset viewport_row_offset)
                                                           { `columns: [nil, nil, (if (== row_data.2 true) { `style: "background: #50FF5020;" } { `style: "background: #FF505020;" }) ] })
                                   }
                                      
                                   ))))

;(run_reader_tests)

(defglobal `compiler_tests
    [[ "true" 
    []
    true
    "primitive compilation: true"
                                        ;`(fn (source opts) (compiler (read_lisp source) opts))
    ]
    [ "false" 
    []
    false
    "primitive compilation: false"
    ]
    [ "nil" 
    []
    null
    "primitive compilation: nil"
    ]
    [ "undefined" 
    []
    undefined
    "primitive compilation: undefined"
    ]
    [ "123" 
    []
    123
    "primitive compilation: positive number"
    ]
    [ "-1" 
    []
    -1
    "primitive compilation: negative number"
    ]
    [ "3.14"
    []
    3.14
    "primitive compilation: floating point"
    ]
    [ "\"Hello\""
    []
    "Hello"
    "primitive compilation: string"
    ]
    ["\"undefined\""
     []
     "undefined"
     "String (double quoted) values - undefined"
     ]
    ["\"null\""
     []
     "null"
     "String (double quoted) values - nil"
     ]
    [ "{}"
    []
    `{}
    "primitive compilation: object"
    ]
    [ "[]"
    []
    `[]
    "primitive compilation: array"
    ]
    [ "(fn ()
           true)"
    []
    true
    "function definition with single statement"
    ]
    ["(quotel \"\\\"Hello\\\" 'world'\")"
     []
     "\"Hello\" 'world'"
     "quote literal: single quote and double quotes"]
    ["(quote \"\\\"Hello\\\" 'world'\")"
     []
     "\"Hello\" 'world'"
     "quote: single quote and double quotes"]
    ["(quotem \"\\\"Hello\\\" 'world'\")"
     []
     "\"Hello\" 'world'"
     "quote macro: single quote and double quotes"]
    [ "(fn ()
            (+ 1 2))"
    []
    3
    "function definition with single expression"
    ]
    [ "(+ { `abc: 123 } { `def: 456 })"
    []
    `{"abc":123 "def":456}
    "overloaded add: objects - no key overlap"
    ]
    [ "(+ { `abc: 123 } { `def: 456 } { `abc: 789 })"
    []
    `{"abc":789 "def":456}
    "overloaded add: objects - key overlap precedence"
    ]
    [ "(+ [ 1 2 3] [ 4 5 6 ])"
    []
    `[1 2 3 [ 4 5 6]]
    "overloaded add: array"
    ] 
    [ "(+ \"abc\" \"def\")"
    []
    "abcdef"
    "overloaded add: string"
    ]
    [ "(fn (a b)
            (== a b))"
    [2 2]
    true
    "equality with =="]
    [ "(fn (a b)
            (== a b))"
    [undefined nil]
    false
    "non-equality with == (js ===)"]
    ["(fn (a b)
            (eq a b))"
    [undefined nil]
    true
    "equality with eq (js ==) "]
    ["(fn (a b)
            (eq a b))"
    [nil false]
    false
    "non-equality with eq (js ==) "]
    ["(fn ()
           (or false undefined 1 true))"
    []
    1
    "or - true with 1"]
    ["(fn ()
           (or nil false undefined true))"
    []
    true
    "or - true with nil, false, undefined, true"]
    ["(fn ()
           (or false nil))"
    []
    nil
    "or - false with false and nil"]
    ["(fn ()
           (or false))"
    []
    false
    "or - one argument: false"]
    ["(fn ()
           (and true 1 []))"
    []
    `[]
    "and - true with true, 1 and empty array"]
    ["(fn ()
           (and true false nil))"
    []
    false
    "and - false with true undefined false and nil"]
    ["(fn ()
           (and true))"
    []
    true
    "and - one argument: true"]
    ["(fn ()
           (and nil))"
    []
    nil
    "and - one argument: nil"]
    ["(fn (arg)
           (and 1 true (or false
                           arg)))"
    [true]
    true
    "and,or nested - return true"]
    ["(fn (arg)
           (and 1 true (or false
                           arg)))"
    [false]
    false
    "and,or nested - return false"]
    [ "(fn (a1 a2)
                 (/ (+ a1 a2) 2))"
    [5 10]
    7.5 "nested arithmetic 1"]
    [ "(fn (a1 a2)
                 (* -1 
                    (/ (- a1 a2) 2)
                     4))"
    [4 5]
    2 "nested arithmetic 2"]
    
    ["(fn (a)
           (if (< a 2)
              (- a 1)
              (+ a 1)))"
    [1]
    0
    "if with simple form, simple if true and if false"
    ]
    ["(fn ()
            (do 
              (+ 1 2)))"
    []
    3
    "single statement in block"
    ]
    [ "(fn ()
            (do 
                (+ 4 4)
                (+ 2 2)))"
    []
    4
    "multiple statements in block"
    ]
    [ "(fn ()
            (let
                ((`a 0))
                (inc a)))"
    []
    1
    "increment scoped reference"
    ]
    [ "(fn ()
            (let
                ((`a 0))
                (dec a)))"
    
    []
    -1
    "decrement scoped reference"
    ]
    
    [ "(fn () (eval `(+ 2 2)))"
    []
    4
    "eval back quoted form"
    ]
    [ "(is_array? [])"
    []
    true
    "inline compilation array"
    ]
    [ "(is_object? {})"
    []
    true
    "inline compilation object - true"
    ]
    [ "(is_object? 123)"
    []
    false
    "inline compilation object - false"
    ]
    ["\"block\""
    []
    "block"
    "compilation instruction collision avoidance"
    nil
    "(defglobal block \"block\")"
    ]
    ["(undefine `block)"
    []
    true
    "undefine symbol to valid reference"
    "(defglobal block \"block\")"
    ]
    ["(undefine `block)"
    []
    false
    "undefine symbol to invalid reference"
    ]
    [ "(fn (val)
              (do 
                  (if (< val 0)
                      (do 
                          (log \"this is a negative\")
                          (return (+ \"\" val \" is a negative number.\")))
                      (do 
                          (log \"another item\")
                          (if (> val 0)
                                (return \"positive\"))
                          true))
                  (return \"something else!\")
                  (log \"never here!\")))"
    [-1]
    "-1 is a negative number." "return from block - positive with form"]
    [ "(fn (val)
              (do 
                  (if (< val 0)
                      (do 
                          (log \"this is a negative\")
                          (return (+ \"\" val \" is a negative number.\")))
                      (do 
                          (log \"another item\")
                          (if (> val 0)
                                (return \"positive\"))
                          true))
                  (return \"something else!\")
                  (log \"never here!\")))"
    [1]
    "positive" "return from block - nested if with blocks"]
    [ "(fn (val)
              (do 
                  (if (< val 0)
                      (do 
                          (log \"this is a negative\")
                          (return (+ \"\" val \" is a negative number.\")))
                      (do 
                          (log \"another item\")
                          (if (> val 0)
                                (return \"positive\"))
                          true))
                  (return \"something else!\")
                  (log \"never here!\")))"
    [0]
    "something else!"
    "return from block - default return"]
    [ "(fn (c d)
              (for_each (`a (range c) )
                (for_each (`b (range d))
                        (* a b))))"
    [5 3]
    `((0 0 0) (0 1 2) (0 2 4) (0 3 6) (0 4 8))
    "nested for each looping"]
    [ "(fn (func c target)
             (apply func c target))"
    (list + 1 [2 3 4 5] )
    15 
    "apply with multiple args"
    ]
    [ "(fn ()
           (apply last [[ 1 2 3 4 ]]))"
    []
    4
    "apply to a global function"]
    [ "(apply is_string? [\"hello\"])"
    []
    true
    "apply to an inline function"]
    [ "(fn ()
         (do (defvar `s (new Set))
             (call s `add 1)
             (-> s `add 2)
             (-> s `has 2)))"
    
    []
    true
    "simple call"]
    [ "(fn ()
            (let ((i 1)) 
               i))"
    []
    1
    "let with simple assigment - numeric"]
    [ "(fn ()
            (let ((`i {})) 
               i))"
    []
    `{}
    "let with simple assigment - object literal"]
    [ "(fn ()
            (let ((`i [])) 
               i))"
    []
    `[]
    "let with simple assigment - array literal"]
    
    [ "(fn () (let ((log console.log)) (log \"hello\") (log (sub_type log)) (typeof log))"
    []
    `function
    "let type detection on assignment"
    ]
    
    [ "(fn ()
            (let ((i 0) 
                  (j (+ i 1)))
              j))"
    []
    1
    "let with sequential assignment dependency"]
    [ "(fn ()
            (let ((i 2) 
                  (j (let
                         ((`t (+ i 10)))
                         (if (> t 11)
                             true
                             false))))
                         
              j))"
    []
    true
    "nested lets with if conditions"]
    [ "(fn ()
            (let ((i 2) 
                  (j (let
                         ((`t (+ i 10)))
                         (cond (> t 11)
                             true
                             else
                             false))))
                         
              j))"
    []
    true
    "nested lets with cond"]
    [ "(fn ()
            (let ((i 5)
                  (tfn (fn (v)
                           (if (== v 1)
                               1
                               (* v (tfn (- v 1)))))))
              (tfn i)))"
    []
    120
    "let with recursion"]
    
    [ "(let ((`x 1) (`y 2)) (+ x y))"
    []
    3
    "evaluation of anonymous let block"
    ]
    [ "(do (defvar `abc 123) abc)"
    []
    123
    "evaluation of anon block multi forms"
    ]
    [ "(+ 4 4)"
    []
    8
    "evaluation of anon block single form"
    ]
    [ "(fn ()
            (do
                (defvar abc 0)
                (inc abc)))"
    []
    1
    "defvar in local scope"]
    [ "(fn ()
            MAX_SAFE_INTEGER)"
    []
    9007199254740991
    "global scope get"]
    [ "(fn ()
            (do
                (defvar run_tests 0)
                (inc run_tests)))"
    []
    1
    "global scope shadow"]
    [ "(defglobal `test_set1 1000)"
    []
    1000
    "global scope set - simple"
    ]
    [ "(fn ()
            (do
                (defglobal `test_set1 1010)
                test_set1))"
    []
    1010
    "global scope set from inside lambda"
    ]
    [ "(fn (v)
            (do
                (defglobal `test_set2 (fn (val)
                                         (* val 10)))
                (test_set2 v)))"
    [5]
    50
    "global scope set - lambda"
    nil
    "(undefine `test_set2)"
    ]
    [ "(fn (v)
           (inc test_set1 v))"
    [5]
    1015
    "global scope increment - lambda"
    
    ]
    [ "(do
         (defglobal `abc { `abc: 123} )
         (= abc 123)
         abc)"
    []
    123
    "Set a global variable with an assignment operation"]
    [ "(defglobal `sayit 
           (fn (x)
            (if (>= x 0)
                (if (>= x 100)
                    (if (>= x 1000)
                        (do
                            (log \"x is greater or equal to 1000!\")
                            \"x is greater than or equal to 1000!\")
                        (do
                            (log \"x is not greater 1000..but larger than or equal to 100\")
                            \"x is not greater than or equal to 1000..but between 100 and 999\"))
                   \"x is less than or equal to 100 but greater than or equal to 0\")
               \"x is less than 0\")))"
    [1050]
    "x is greater than or equal to 1000!"
    "nested if statements in compiled code - deepest true evaluation"]
    [ "(sayit 300)"
    []
    "x is not greater than or equal to 1000..but between 100 and 999"
    "nested if statements in compiled code - deepest false evaluation"]  
    [ "(sayit 50)"
    []
    "x is less than or equal to 100 but greater than or equal to 0"
    "nested if statements in compiled code - middle false evaluation"]
    [ "(sayit -1)"
    []
    "x is less than 0"
    "nested if statements in compiled code - top false evaluation"]
    ["(do
          (defglobal `po10A
            (fn (x)
                (if (>= x 0)
                    (if (>= x 100)
                        (if (>= x 1000)
                            1000
                            100)
                        0)
                    -100)))
         [(po10A -1) (po10A 10) (po10A 200) (po10A 1020)])"
    []
    `(-100 0 100 1000)
    "Nested simple ifs"]
    
    [ "(fn (a)
              (for_each (`r (range a)) 
                 (do 
                     (if (> r 5)
                         (break))
                     (* r a))))"
    [10]
    `[0 10 20 30 40 50]
    "for_each with break"]
    [ "(fn (f)
              (let
                  ((`i 0))
              (while (< i f)
                 (do 
                     (if (> i 10)
                         (break))
                     (inc i)))
              i))"
    [20]
    11 "while with local inc and break"]
    ["(fn ()
          (for_each (`a [ 0 1 2 3 ])
             a))"
    []
    `[0,1,2,3]
    "for_each with iteration over a literal array"
    ]
    [ "(fn ()
                  (try
                      (throw TypeError \"ERROR MESSAGE\")
                      (catch TypeError (e)
                        (do
                            (log \"Caught IT: \" e)
                            \"ERROR 1\"))
                      (catch Error (e)
                        (do
                            (log \"Caught ERROR IT: \" e)
                            \"ERROR 2\"))))"
    []
    "ERROR 1" "multiple catches on a try - TypeError"]
    [ "(fn ()
                  (try
                      (throw Error \"ERROR MESSAGE\")
                      (catch TypeError (e)
                        (do
                            (log \"Caught IT: \" e)
                            \"ERROR 1\"))
                      (catch Error (e)
                        (do
                            (log \"Caught ERROR IT: \" e)
                            \"ERROR 2\"))))"
    []
    "ERROR 2" "multiple catches on a try - Error"]
    
    [ "(fn ()
              (try
                (let
                  ((`i 5))
                   (while (> i 0)
                      (do
                        (dec i)
                        (try
                            (if (== i 3)
                               (throw Error \"i is 3!\"))
                            (catch SyntaxError (e)
                              (do
                                  (throw Error (+ \"SyntaxError caught: \" e.message))))))))
                (catch Error (`e)
                   (do
                       e.message))))"
    []
    "i is 3!"
    "nested try catch hierarchy - outermost catch"]
    
    
    [ "(fn ()
              (try
                (let
                  ((`i 5))
                   (while (> i 0)
                      (do
                        (dec i)
                        (try
                            (if (== i 3)
                               (throw SyntaxError \"i is 3!\"))
                            (catch SyntaxError (e)
                              (do
                                  (throw Error (+ \"SyntaxError caught: \" e.message))))))))
                (catch Error (`e)
                   (do
                       e.message))))"
    []
    "SyntaxError caught: i is 3!"
    "nested try catch hierarchy - inner catch"]
    
    [ "(fn () (+ \"\" (new Date 2022 2)))"
    []
    "Tue Mar 01 2022 00:00:00 GMT-0500 (Eastern Standard Time)"
    "new with simple arguments"
    ]
    [ "(fn (y) (+ \"\" (new Date (do (+ 1 y))
                               2)))"
    [2019]
    "Sun Mar 01 2020 00:00:00 GMT-0500 (Eastern Standard Time)"
    "new with a complex argument and simple argument."
    ]
    [ "(fn (x)
           (cond
               (> (+ x 50) 100)
               (do 
                  \"condition 1\")
               (< x 0)
               \"condition 2\"
               else
               (do
                   (log \"Condition: else\")
                   \"condition: else\")))"
    [51]
    "condition 1"
    "first condition with a form eval"]
    [ "(fn (x)
           (cond
               (> (+ x 50) 100)
               (do 
                  \"condition 1\")
               (< x 0)
               \"condition 2\"
               else
               (do
                   (log \"Condition: else\")
                   \"condition: else\")))"
    [-1]
    "condition 2"
    "alt condition with a form eval"]
    [ "(fn (x)
           (cond
               (> (+ x 50) 100)
               (do 
                  \"condition 1\")
               (< x 0)
               \"condition 2\"
               else
               (do
                   (log \"Condition: else\")
                   \"condition: else\")))"
    [10]
    "condition: else"
    "final else condition block"]
    [ "(fn (target from to)
                          (cond
                              to
                              (-> target `slice from to)
                              from
                              (-> target `slice from)
                              else
                              (throw SyntaxError \"slice requires 2 or 3 arguments\")))"
    `[ [0 1 2 3 4] 1 3 ]
    `[1 2]
    "cond with compiled throw condition"
    nil
    ]
    [ "(fn (target from to)
                          (cond
                              to
                              (do 
                                  (console.log \"to is:\" to)
                                  (-> target `slice from to))
                              from
                              (do 
                                  (console.log \"from is:\" from)
                                  (-> target `slice from))
                              else
                              (do (throw SyntaxError \"slice requires 2 or 3 arguments\"))))"
    `[ [0 1 2 3 4] 1 4 ]
    `[1 2 3]
    "cond with compiled throw condition in block"
    nil
    ]
    ["(fn ()
            (let
                ((obj {})
                 (`block [\"abc\" 123])
                 (`key (first block))
                 (idx 0))
                (cond
                  (eq nil key)
                  (throw SyntaxError (+ \"blank or nil key: \" key))
                  key
                  (do
                      (inc idx)
                      (set_prop obj
                                key
                                (prop block idx))))
                obj))"
    []
    {`abc:123}
    "cond with throw in first block"
    ]
    [ "(fn (abc)
             { 
               `name: \"Bob\"
               `birthdate: (+ \"\" (new Date 2010 6 1))
               `form: (do
                          (= abc (* abc 10))
                          (+ abc 10))
                      })"
    [10]
    {"name":"Bob" "birthdate":"Thu Jul 01 2010 00:00:00 GMT-0400 (Eastern Daylight Time)" "form":110}
    "object literal with evaluated values"]
    
    [ "(do `(list ,@(1 2 3)))"
    []
    `(list 1 2 3)
    "splice operator"
    ]
    
    [ "(do (quotem (list ,#(+ 1 2 3))))"
    []
    `(list 6)
    "unquotem operations"
    ]
    
    [ "(list 1 2 3 (quote (list 3 4 ,@(5 6) (+ 100 2) `(list 3 1 (quotem 5)))))"
    []
    `(1 2 3 (list 3 4 "=$,@" (5 6) (+ 100 2) (quotem (list 3 1 (quotem 5)))))
    "quote"
    ]
    
    [ "`((,#a b) (unquotem c) ,@d)"
    []
    `[[5 b] [2] 1 2]
    "full compilation of back quote/unquotem operations"
    nil
    "(do
         (defglobal `a 5)
         (defglobal `c 2)
         (defglobal `d (list 1 2)))"
    ]
    [ "`(list ,#(list 1 2))"
    []
    `(list (1 2))
    "quotem operations with ,#"]
    [ "`(list ,@(list 1 2))"
    []
    `(list 1 2)
    "quotem operations with splice operator"]
    [ "(quotem (unquotem true))"
    []
    [true]
    "quotem/unquotem true statement"]
    [ "(fn () (quotem (unquotem true)))"
    []
    [true]
    "quotem/unquotem true statement in function"]
    [ "(quotem (unquotem false))"
    []
    [false]
    "quotem/unquotem true statement in function"]
    [ "(fn () (quotem (unquotem false)))"
    []
    [false]
    "quotem/unquotem false statement in function"]
    [ "(quotem (unquotem (do (console.log \"hello\") true)))"
    []
    [true]
    "quotem/unquotem block"]           
    [ "(eval (eval (eval (fn () (list 1 2 3 (quotem (list 3 4 ,@(5 6) (+ 100 2) `(list 3 1 (quotem 5)))))))))"
    []
    `(1 2 3 (3 4 5 6 102 (3 1 5)))
    
    "quotem/unquotem eval sequence"

    ]
    
    [ "(fn ()
             (let
                ((`x 1)
                 (`y 2)
                 (`source `(+ x y)))
                source))"
    []
    `(+ x y)
    "let returning quoted closure"
    ]
    [ "(fn ()
         (try 
          (let
            ((`x 1)
             (`y 2)
             (`source (eval `(+ x y))))
           source)
           (catch Error (`e)
              (do 
                  e.message))))"
    []
    "FAIL: [EXEC]:compiler returned: lambda->\"compile: unknown reference: x\""
    "let returning quoted closure then eval"
    nil
    "(-> env `set_check_external_env false)"
    ]
    [ "(let
         ((`x 1)
          (`y 2)
          (`source (fn () (+ x y))))
         source)"
    []
    3
    "let returning function accessing lexical scope"
    
    ]
    [  "(fn (a1 `& r)
        (do
            [a1 r]))"
    ["Not Inside" "Inside" "the" "array"]
    `["Not Inside" ["Inside" "the" "array"]]
    "function with rest args"]
    [  "(fn (place property value)
               (set_prop place property value))"
    [{} "name" "Bob"]
    `{ `name: "Bob" }
    "Simple set property"]
    [  "(fn ()
            (set_prop {}
                      \"name\" \"Bob\"
                      \"place\" \"Anywhere\"
                      \"age\" 42))"
    []
    `{"name":"Bob" "place":"Anywhere" "age":42}
    "Multiple set property on obj literal"]
    [ "(fn ()
            (set_prop (new Object)
                      \"name\" \"Bob\"
                      \"place\" \"Anywhere\"
                      \"age\" 42))"
    []
    `{"name":"Bob" "place":"Anywhere" "age":42}
    "Multiple set property on newly instantiated object"]
    [ "(fn ()
            (let
                ((`abc { `name: \"Alvin\" }))
                (set_prop abc
                      \"name\" \"Bob\"
                      \"place\" \"Anywhere\"
                      \"age\" 42)))"
    []
    `{"name":"Bob" "place":"Anywhere" "age":42}
    "Multiple set property on obj in scope"]
    
    [  "(fn ()
            (let
                ((`abc { `name: \"Alvin\" }))
                (prop abc `name)))"
    []
    "Alvin"
    "Get property of object"]
    [  "(fn ()
            (let
                ((`abc { `name: \"Alvin\" }))
                abc.name))"
    []
    "Alvin"
    "Get static property of object"]
    [  "(fn ()
            (let
                ((`abc { `name: \"Alvin\" }))
                 (prop abc (+ \"n\" \"ame\"))))"
    []
    "Alvin"
    "Get property of object via expression"]
    
    [  "(fn ()
            (let
                ((`n (new Number 123)))
             (instanceof n Number)))"
    []
    true
    "instanceof simple"]
    [ "(fn ()
            (let
                ((`n (new Number 123))
                 (`s (new String (+ \"abc\" 123))))
                (and (instanceof n Number) (instanceof s String))))"
    []
    true
    "compound instance of"
    ]
    [ "(fn () (and (instanceof {} Object) (instanceof [] Array)))"
    []
    true
    "instanceof object types"
    ]
    [ "(fn () (and (instanceof {} Number) (instanceof [] Array)))"
    []
    false
    "not instanceof"
    ]
    [ "(fn () (let ((a [])) (push a (new Number 123)) (push a (new String (+ \"A\" 123))) a))"
    []
    `(Number String)
    "compile arguments"
    ]
    [ "(fn () [ (typeof \"Alex\") (typeof 123) (typeof false) (typeof {}) (typeof []) ])"
    []
    `["string" "number" "boolean" "object" "object"]
    "typeof"
    ]
    [ "(do
           (defglobal \"when2\"
               (fn (condition `& mbody) 
                       (do
                          `(if ,#condition
                               (do
                                   ,@mbody))))
                {`eval_when:{ `compile_time: true }})
            (describe `when2))"
    []
    `{"type":"AsyncFunction" "location":"global" "eval_when":{"compile_time":true}}
    "register compile time function"
    ]
    [ "(when2 (> 4 0) \"positive number\")"
    []
    "positive number"
    "compile time function - positive"
    ]
    
    [ "(do (defglobal wtest (fn (v) (when2 (> v 0) \"positive\"))) (wtest 3))"
    []
    "positive"
    "lambda ref compile time function - positive"]
    
    [ "(do 
           (defglobal wtest 
               (fn (v) 
                   (let
                       ((a []))
                      (when2 (> v 0) 
                         (inc v)
                         (push a v)
                         a)))) 
           (wtest 3))"
    []
    `[4]
    "lambda ref compile time function - block insertion"]
    [ "(wtest 0)"
    []
    undefined
    "compile time function - neg condition"
    ]

    ["(do
          (defglobal `sp
            (fn (a1 `& r)
                    (do
                        `[,@a1 ,@r])))
          (sp \"A1\" \"B1\" \"B2\" \"B3\")"
     []
     `["A1" "B1" "B2" "B3"]
     "Quoted splice of array with multiple elements into list"
     ]

    ["(let
        ((`let_scope_var 2)
         (`my_lambda (fn (x)
                         (do
                             (= x (* x let_scope_var))
                             (inc let_scope_var)
                             x))))
        [(my_lambda 5) (my_lambda 6) (my_lambda 7)])"
      []
      `[10 18 28]
      "Modification of closure values"
    ]
    ["`(do 
          {
             `this_is_quoted: true
          })"
      []
      `[do {"this_is_quoted":true}]
      "Quoted object integrity"
     ]

    ["(progn (defvar `abc (make_set [ 1 2 3])) (call abc `has 1))"
    []
    true
    "make_set then call - has item true"
    ]
    ["(progn (defvar `abc (make_set [ 1 2 3])) (call abc `has 5))"
    []
    false
    "make_set then call - not has item"
    ]
    ["(conj [[1 2 3]] [[4 5 6] [7 8 9]])"
    []
    `[[1 2 3] [4 5 6] [7 8 9]]
    "conj - conjoin nested array"
    ]
    ["(conj [1 2 3] [4 5 6] [7 8 9])"
    []
    `[1 2 3 4 5 6 7 8 9]
    "conj - conjoin array"
    ]
    ["(conj { `abc: 123} { `def: 123} )"
    []
    `({"abc":123} {"def":123})
    "conj - conjoin multiple objects"]
    ["(index_of 3 (list 1 2 3 4 5))"
    []
    2
    "index_of numeric value in array - found"]
    ["(index_of \"Alex\" [\"John\" \"Ralph\" \"Larry\" \"Alex\" \"Alvin\"])"
    []
    3
    "index_of string value in array - found"]
    ["(index_of \"Nope\" [\"John\" \"Ralph\" \"Larry\" \"Alex\" \"Alvin\"])"
    []
    -1
    "index_of value in array - not found"]
    
    ["(do (defglobal `abc [1 2 3 4]) (slice abc 1))"
    []
    [2 3 4]
    "slice - 1 argument"]
    ["(do (defglobal `abc [1 2 3 4]) (slice abc 2 4))"
    []
    [3 4]
    "slice - 2 argument"]
    ["(do (defglobal `abc {\"abc\":123} {\"def\":123}) (delete_prop abc `def) abc)"
    []
    `{ `abc: 123 }
    "validate delete property on object"]
    ["(do (defglobal `abc {\"abc\":123} {\"def\":123}) (delete_prop abc `def))"
    []
    true
    "delete_prop return val true on 1 arg"]
    ["(do (defglobal `abc {\"abc\":123} {\"def\":123} {\"ghi\":456}) (delete_prop abc `def `ghi))"
    []
    `{`abc: 123}
    "delete_prop return val true on 1 arg"]
    
    ["(parseFloat \"3.14159\")"
    []
    3.14159
    "convert from string to float parseFloat"]
    ["(float \"3.14159\")"
    []
    3.14159
    "convert from string to float: float"]
    ["(int \"17\")"
    []
    17
    "convert from string to integer"]
    
    ["[(length [0 1 2 ]) (length \"Hello\") (length nil) (length undefined) (length { `abc: 123 `def: 456}) (length false) (length true)]"
    []
    `[3 5 0 0 2 0 0]
    "length function"]
    ["(resolve_path [`record 0 `name ] { `abc: 123 `record: [{ `def: 456 `name: \"Larry\"}]})"
    []
    "Larry"
    "resolve_path: success"
    ]
    ["(resolve_path [`record 1 `name ] { `abc: 123 `record: [{ `def: 456 `name: \"Larry\"}]})"
    []
    undefined
    "resolve_path: failure"
    ]
    ["(fn () (let ((place [])) (push place 1) (push place 2) (pop place)))"
    []
    2
    "pushes then pop"
    ]
    ["(fn () (let ((place [])) (push place 1) (push place 2) (take place)))"
    []
    1
    "pushes then take"
    ]
    ["(fn () (let ((place [])) (prepend place 1) (prepend place 2) (take place)))"
    []
    2
    "prepends then take"
    ]
    
    ["+invalid_js_chars+"
    []
    "+invalid?"
    "handle invalid js chars global"
    nil
    "(defglobal +invalid_js_chars+ \"+invalid?\")"
    ]
    ["(let
           ((`is_true? (> 3 1))
            (`+text+   \"+hello?\"))
           [is_true? +text+])"
    []
    [true  "+hello?"]
    "handle invalid js chars local scoped"
    ]
    ["(do
         (defvar `is_true (> 3 1))
         (defvar `+text   \"hello?\")
         [is_true +text])"
    []
    [true "hello?"]
    "multiple block and return array"
    ]
    ["(let ((`a 5) (`b (fn (val) (* val 4)))) [true (b a)])"
    []
    [true 20]
    "let block with fn and array return"]
    ["(let ((`a 5) (`b (fn (val) (* val 4)))) { `state: true  `value: (b a)})"
    []
    {`state: true `value: 20 }
    "let block with fn and object return"]
    ["(fn (opts)
         (do 
          (defvar opts (or opts {}))
          opts))"
    []
    {}
    "in-scope arg value redefinition via defvar"]
    ["(fn (opts)
         (let 
            ((opts (or opts {})))
            opts))"
    []
    {}
    "in-scope arg value redefinition via let"]
    ["(fn (opts)
         (let 
            ((opts (or opts {})))
            opts))"
    [{ `testing: true }]
    { `testing: true }
    "in-scope arg value redefinition - use arg vs default"]
    ["(map (fn (x) [(+ x 1) (+ x 2)]) (range 10))"
    []
    `((1 2) (2 3) (3 4) (4 5) (5 6) (6 7) (7 8) (8 9) (9 10) (10 11))
    "function returning array values after ops"]
    ["(let
         ((fact (fn (x)
                    (if (== x 1)
                        1
                        (* x (fact (- x 1)))))))
         (fact 5))"
    []
    120
    "Recursive factorial calculation via let"
    ]
    ["\"(+ 32 2)\""
    []
    "(+ 32 2)"
    "properly handle parenthesis appearing in strings"]
    ["(let ((stop false)) stop)"  
    []
    false
    "Global shadowing with untrue value - false"
    ]
    ["(let ((stop nil)) stop)"  
    []
    nil
    "Global shadowing with untrue value - nil"
    ]
    ["(defglobal `ctest
        (fn (val)
            (let
                ((`text (split_by \"\" val))
                 (`c nil)
                 (`word_acc [])
                 (`acc []))
                (for_each (`pos (range (length text)))
                  (do
                      (= c (prop text pos))
                      (if (== c \" \")
                         (do
                             (push acc (join \"\" word_acc))
                             (= word_acc []))
                         (do
                             (push word_acc c)))
                      (log \"word_acc:\" c)))
                (if (> word_acc.length 0)
                    (push acc (join \"\" word_acc)))
            acc)))"
    ["1234 ABC"]
    `("1234" "ABC")
    "mid block if return suppression"
    ]
    ["[(is_number? (float \"1.23\"))
         (is_number? \"Nope\")
         (is_number? [])
         (is_number? {})
         (is_number? nil)]"
    []
    `[true false false false false]
    "is_number? validation"]
    ["[(is_string? \"Hello\")
         (is_string? [])
         (is_string? 1.234)
         (is_string? nil)
         (is_string? {})]"
    []
    `[true false false false false]
    "is_string? validation"]
    ["[(is_array? [])
         (is_array? \"My String\")
         (is_array? 1.234)
         (is_array? nil)
         (is_array? {})]"
    []
    `[true false false false false]
    "is_array? validation"]
    ["[(is_object? {})
         (is_object? [])
         (is_object? \"My String\")
         (is_object? 1.234)
         (is_object? nil)
         ]"
    []
    `[true true false false false]
    "is_object? validation"]
    ["[(do { `abc: { `def: 100 }})]"
    []
    `[{"abc":{"def":100}}]
    "Block in operator position of args"
    ]
    ["[123 (do true { `abc: { `def: 100 }})]"
    []
    `[123 {"abc":{"def":100}} ]
    "Block in non-operator position of array"]
    ["[(do (if true true false)) 1 2 (fn (v) (+ 1 v)) [ (if true true false) ] (do { `abc: { `def: 100 }}) ]"
    []
    `(true 1 2 lambda (true) {"abc":{"def":100}})
    "Blocks, lambdas and embedded objects and array in array"]
    ["{
        `name:(do
                 (+ \"Two\" \" \" \"Words\"))
        `things: (let
                    ((`m []))
                    (while (< m.length 10)
                       (do
                           (push m m.length)))
                    m)
        `ifblock: (if (> 5 2)
                      (do
                          (* 5 2))
                      false)
        `condblock: (cond
                        (== false true)
                        \"not here\"
                        else
                        \"here\")
         }"
    []
    `{"name":"Two Words" "things":(0 1 2 3 4 5 6 7 8 9) "ifblock":10 "condblock":"here"}
    "Object with values of different block types"]
    ["[ (do
            (+ \"Two\" \" \" \"Words\"))
           (let
              ((`m []))
               (while (< m.length 10)
                   (do
                       (push m m.length)))
                m)
            (if (> 5 2)
              (do
                  (* 5 2))
              false)
           (cond
            (== false true)
            \"not here\"
            else
            \"here\")]"
    []
    `("Two Words" (0 1 2 3 4 5 6 7 8 9) 10 "here")
    "Array with values of different block types"]
    ["(fn (word_acc)
          (let
              ((`word (join \"\" word_acc))
               (`word_as_number (float word)))
              (cond
                  (== \"true\" word)
                  true
                  (== \"false\" word)
                  false
                  (== \":\" word)
                  word
                  (isNaN word_as_number)
                  (do 
                      (if (== word \"=:\")
                          (do 
                              \"=:\")
                          (+ \"=:\" word))) ;; since not in quotes, return a reference 
                  (is_number? word_as_number)
                  word_as_number
                  else
                  (do 
                      (log \"what is this?\" word word_acc)
                      word))))"
    [["A" "B" "C"]]
    (quote ABC)
    "Cond with embedded if"]
    ["(do 
    (defglobal `test_fn
        (fn (meta)
            (let
                ((source_details 
                     (+
                         {
                            `arguments: [ \"a:1\" \"a:2\"]
                            `body: `(do
                                        true)
                         }
                         (if meta meta
                             {}))))
                source_details)))
    (test_fn { `other: \"things\" }))"
     []
     (quote {"arguments":("a:1" "a:2") "body":(do true) "other":"things"})
     "If statement returns appropriately from inner let"
     ]
    ]
    )

                                        



(defglobal `null nil)

(defglobal `tci (to_object
                 (map (fn (v i)
                          [i (if (is_string? v.0)
                                 v.0
                                 (as_lisp v.0))])
                      compiler_tests)))
(defun `tc (idx)
  (prop tci idx))

(defun `cl (text)
  (-> env `evaluate text))
(defun `compile (text opts)
  (let
      ((`rval nil)
       (`clog (defclog { `prefix: "output" `background: "#734080" `color: `white })))
    (cc)
    (= rval (compiler (read_lisp text) 
                      { `env: env `js_out: true  `formatted_output: true }))
    
    (clog text)
    (clog (take rval))
    
    (first rval)))

(defglobal `original_evaluator client.evaluateText)
(defglobal `last_input nil)



(defun `use_dlisp_as_evaluator ()
  (do
   (cl "(defglobal `display (fn (arg) (-> client.display `set arg)))")
   (cl "(defglobal `display_data (fn () (-> client.display `get)))")
    (cl "(defglobal `log (bind client.log client))")
    (cl "(defglobal `original_evaluator client.evaluateText")
    (cl "(defglobal `restore_evaluator (fn () (set_prop client `evaluateText original_evaluator)))")
    (set_prop client
              `evaluateText
              (fn (text options)
                  (let
                      ((`rval nil))
                    (defglobal `last_input text)
                    (= rval (cl text))
                    (if (and rval
                             rval.render)
                        (rval.render)
                        (display rval)))))))


(defun `use_dlisp_command_line ()
  (do
   (cl "(defglobal `display (fn (arg) (-> client.display `set arg)))")
   (cl "(defglobal `display_data (fn () (-> client.display `get)))")
    (cl "(defglobal `log (bind client.log client))")
    (cl "(defglobal `clear_log (fn () (client.client_context `trimLog 0)))")
    (cl "(defglobal `restore (fn () (set_prop client `alternateCommandLisp nil)))")
    (set_prop client
              `alternateCommandLisp
              (fn (text options)
                  (let
                      ((`rval nil))
                    (defglobal `last_input text)
                    (= rval (cl text))
                    (if (and rval
                             rval.render)
                        (rval.render)
                        rval))))))

(defglobal `dlisp use_dlisp_command_line)


;; TESTS WILL NOT PASS UNTIL THE READER is compiled 

;; We need to bring up the reader next, but in case of bugs in our reader, keep the old read_lisp handy

(set_prop env
          `old_read_lisp
          env.read_lisp)
      
(dlisp_tabs)
                                        

;; -------------------------------------------------

;; These two functions allow us to use the reader function (below) for DLisp
;; with the JEVAL instance if we choose to do so.  Note that the reader must be
;; compiled first 


(defun `read_lisp (text)
  (reader text))


(defun `read_lisp (text)
  (if text
      (do 
       (defvar `tokens (tokenize_lisp text))
       (if tokens
           (tokens_to_json  tokens)
           tokens))
      text))


;; ------ DLISP CODE BEGIN HERE ---------------------------------

;; We need to bring up a reader, which is what takes lisp text into a tree form,
;; in this case represented as JSON structures that are then compiled into
;; a javascript form for evaluation.



;; Compile the reader in a DLisp instance, from which we then set the compiled reader function
;; as the reader for the environment.

(defglobal `reader (fn (text opts)
        (let
            ((`output_structure [])
             (`idx -1)
             (`opts (or opts {}))
             (`len (- (length text) 1))
             (`in_buffer (split_by "" text))
             (`in_code 0)
             (`in_quotes 1)
             (`in_long_text 2)
             (`in_comment 3)
             (`in_single_quote 4)
             (`mode in_code)  ;; start out in code
             (`read_table {
                           "(":[")" (fn (block)
                                       (do ;(log "got_paren_block:" block)
                                           block))]
                           "[":["]" (fn (block)
                                        (do ;(log "got_bracket_block:" block)
                                            block))]
                           "{":["}" (fn (block)
                                         (let
                                             ((`obj (new Object))
                                              (`idx -1)
                                              (`key_mode 0)
                                              (`need_colon 1)
                                              (`value_mode 2)
                                              (`key nil)
                                              (`value nil)
                                              (`cpos nil)
                                              (`state key_mode)
                                              (`block_length (- (length block) 1)))
                                           ;(console.log "handle_brace->" block)
                                            ;(log "handle_brace->" (JSON.stringify block))
                                           (while (< idx block_length)
                                                  (do
                                                   (inc idx) ; move to next position - assumption we positioned for the key
                                                   (= key (prop block idx))  ;; get the value
                                                   (when (and (is_array? key)
                                                              (== key.length 2)
                                                              (== key.0 (quotel "=:quotem"))
                                                              (is_string? key.1))
                                                        (= key key.1))
                                                    (if (and (is_string? key)
                                                             (starts_with? "=:" key))
                                                        (= key (-> key `substr 2)))
                                                    (cond
                                                      (blank? key)
                                                      (throw SyntaxError (+ "blank or nil key: " (prop block idx)))
                                                      (is_number? key)
                                                      (do
                                                       (inc idx)
                                                       (set_prop obj
                                                        key
                                                        (prop block idx)))
                                                      (and (is_string? key)
                                                           (contains? ":" key)
                                                           (not (ends_with? ":" key)))
                                                      (do
                                                       (= cpos (-> key `indexOf ":"))
                                                       (= value (-> key `substr (+ cpos 1)))
                                                        (= key (-> key `substr 0 cpos))
                                                        (set_prop obj
                                                                  key
                                                                  value))
                                                      else
                                                      (do 
                                                          (inc idx)         ;; and move to the value 
                                                          ;(log "key: " key key.length "value:" (prop block idx))
                                                          
                                                        (if (ends_with? ":" key)
                                                            (= key (chop key)) ;; remove the colon
                                                            (do                ;; otherwise the next value must be a colon 
                                                             (if (== (prop block idx) ":")
                                                                 (inc idx) ;; it is, move past it       ;; <<---- BUG: will insert return
                                                                 (throw SyntaxError (+ "missing colon in object key: " key)))))
                                                        (set_prop obj
                                                                  key
                                                                  (prop block idx))))))
                                           obj))]
                                              
                           "\"":["\"" (fn (block)
                                          (do 
                                              ;(log "got quote block:" block)
                                              ["quotes" block]))]
                          
                                              })
             (`get_char (fn (pos)
                            (prop in_buffer pos)))
             (`handle_escape_char (fn (c)
                                      (let
                                          ((`ccode (-> c `charCodeAt 0)))
                                        (cond
                                          (== ccode 34)   ;; backslash
                                          c
                                          (== ccode 92)
                                          c
                                          (== c "t")
                                          9
                                          (== c "n")
                                          10
                                          (== c "r")
                                          13
                                          (== c "f")
                                          12 ;; formfeed
                                          (== c "b")
                                          8 ;; backspace
                                          else  ;; just return the character
                                          c))))
             
             (`process_word (fn (word_acc backtick_mode)
                                (let
                                    ((`word (join "" word_acc))
                                     (`word_as_number (parseFloat word)))
                                  ;(log "process_word: " word word_as_number backtick_mode)
                                  (cond
                                    (== "true" word)
                                    true
                                    (== "false" word)
                                    false
                                    (== ":" word)
                                    word
                                    (== ",@" word)
                                    (quotel "=$,@")
                                    (or (== ",#" word)
                                        (== "##" word))
                                    (quotel "=:##")
                                    
                                    (== "=$,@" word)
                                    (quotel "=$,@")
                                    
                                    (== (quotel "=:##") word)
                                    (quotel "=:##")
                                    
                                    (isNaN word_as_number)
                                    (do 
                                     ;(log "process_word: returning: " word)
                                     (cond 
                                           (== word (quotel "=:"))
                                           (do 
                                              (quotel "=:"))
                                           (== backtick_mode 1)
                                           word
                                           else 
                                           (+ (quotel "=:") word))) ;; since not in quotes, return a reference 
                                    (is_number? word_as_number)
                                    word_as_number
                                    else
                                    (do 
                                     (log "reader: what is this?" word word_acc)
                                     word)))))
             
             (`registered_stop_char nil)
             (`handler_stack [])
             (`handler nil)
             (`c nil)
             (`next_c nil)
             (`depth 0)
             (`stop false)
             (`read_block (fn (_depth _prefix_op)
                              (let
                                  ((`acc [])
                                   (`word_acc [])
                                   (`backtick_mode 0)
                                   (`escape_mode 0)
                                   (`last_c nil)
                                   (`block_return nil))
                                (when _prefix_op
                                  (push acc
                                        _prefix_op))
                                ;(debug)
                                (while (and (not stop)
                                            (< idx len))
                                       (do 
                                        (inc idx)
                                        (= escape_mode (Math.max 0 (- escape_mode 1)))
                                         (= c (get_char idx))
                                         (= next_c (get_char (+ idx 1)))
                                         
                                         ;(log _depth "C->" c next_c mode escape_mode (clone acc) (clone word_acc) handler_stack.length)
                                         
                                         ;; read until the end or are stopped via debugger
                                         ;; we have a few special cases that facilitate the transformation
                                         ;; into a JSON structure as well as comments
                                         
                                         ;; consult the read table and accumulate chunks into blocks
                                         ;; once done with the block pass to the read table handler if it exists.
                                         
                                         (cond 
                                           (and (== c "\n")
                                                (== mode in_comment))
                                           (do 
                                               (= mode in_code)
                                               (break))
                                           
                                           (and (> mode 0)
                                                ;(== escape_mode 0)
                                                (== 92 (-> c `charCodeAt 0)))
                                           (do 
                                            (= escape_mode 2))
                                        
                                           (and (> mode 0)
                                                (== escape_mode 1))
                                           (do 
                                               ;(console.log "escape mode - handling the escape character")
                                               (push word_acc (handle_escape_char c)))
                                           
                                           (and (== mode in_long_text)
                                                (== escape_mode 0)
                                                (== c "|"))
                                           (do 
                                               (push acc (join "" word_acc))
                                               (= word_acc [])
                                               (= mode in_code)
                                               (break))
                                           
                                           (and (== mode in_quotes)
                                                (== escape_mode 0)
                                                (== c "\""))
                                           (do
                                            (= acc (+ (join "" word_acc)))
                                            (= word_acc [])
                                            (= mode in_code)
                                            (break))
                                           
                                           (and (== mode in_single_quote)
                                                (== escape_mode 0)
                                                (== c "\'"))
                                           (do
                                            (= acc (+ (join "" word_acc)))
                                            (= word_acc [])
                                            (= mode in_code)
                                            (break))
                                           
                                           (and (== c "|")
                                                (== mode in_code))
                                           (do 
                                             (if (> word_acc.length 0)
                                                 (do 
                                                   (push acc (process_word word_acc))
                                                   (= word_acc [  ])))
                                             (= mode in_long_text)
                                             (= block_return (read_block (+ _depth 1)))
                                             (when (== backtick_mode 1)
                                               (= block_return [(quotel "=:quotem") block_return])
                                               (= backtick_mode 0))
                                             (push acc block_return))
                                         
                                           (and (== c "\"")
                                                (== escape_mode 0)
                                                (== mode in_code))
                                           (do 
                                            (if (> word_acc.length 0)
                                                (do 
                                                 (push acc (process_word word_acc))
                                                 (= word_acc [  ])))
                                            (= mode in_quotes)
                                            (= block_return (read_block (+ _depth 1)))
                                            (when (== backtick_mode 1)
                                               ;(= block_return [(quote "=:quotem") block_return])
                                               (= backtick_mode 0))
                                            (push acc block_return))
                                          
                                           (and (== c "\'")
                                                (== escape_mode 0)
                                                (== mode in_code))
                                           (do 
                                            (if (> word_acc.length 0)
                                                (do 
                                                 (push acc (process_word word_acc))
                                                 (= word_acc [  ])))
                                            (= mode in_single_quote)
                                            (= block_return (read_block (+ _depth 1)))
                                            (when (== backtick_mode 1)
                                               ;(= block_return [(quote "=:quotem") block_return])
                                               (= backtick_mode 0))
                                            (push acc block_return))
                                           
                                           
                                           
                                           (== mode in_comment)
                                           false ;; just discard the character
                                           
                                           (and (== c ";")
                                                (== mode in_code))
                                           (do
                                               (if (> word_acc.length 0)
                                                (do 
                                                 (push acc (process_word word_acc))
                                                 (= word_acc [  ])))
                                            (= mode in_comment)
                                            (read_block (+ _depth 1))) ;; read the block but just discard the contents since it is a comment.
                                           
                                           ;; at depth+1, we read until we encounter a block end character
                                           ;; which terminates the present block, or if we encounter another
                                           ;; block begin character, we start a new block that is nested in
                                           ;; in the present block.  
                                           
                                           (and (== mode in_code)
                                                (> (length handler_stack) 0)
                                                (== c (prop (last handler_stack) 0)))
                                           (do
                                             ;(log _depth "at block end, getting last handler from handler stack")
                                             ;; break out and return the accumulator which will be handled by 
                                             ;; the calling level 
                                             (break))
                                            
                                            
                                           
                                           ;; start block read
                                           (and (== mode in_code)
                                                (prop read_table c)
                                                (first (prop read_table c)))
                                           (do 
                                             ;(log _depth "new handler key: " c "pushing into handler_stack.." (prop read_table c))
                                            
                                             (push handler_stack 
                                                  (prop read_table c))
                                              
                                             (if (> word_acc.length 0)
                                                 (do 
                                                     (push acc (process_word word_acc backtick_mode))
                                                     (= backtick_mode 0)
                                                     (= word_acc [])))
                                             
                                             ;; now read the block until the block complete character is encountered...
                                             (= block_return (read_block (+ _depth 1)))
                                             ;(log _depth "<- block return: " block_return)
                                             ;; handle the returned block that was read with the handler
                                             (= handler (prop (pop handler_stack) 1))
                                             
                                             (= block_return 
                                                   (handler block_return))
                                               
                                             ;; TODO  
                                             ;(when (== c "}")
                                             ;   (= backtick_mode 0))
                                             ;(log _depth "received handler return: " block_return)
                                             
                                             ;; if the block is undefined, do not add it to the accumulator, other add the block structure
                                             ;; to the accumulator and discard the block complete character
                                             
                                             (when (not (== undefined block_return))
                                                (when (== backtick_mode 1)
                                                      (= block_return [(quotel "=:quotem") block_return])
                                                      (= backtick_mode 0))
                                                (push acc block_return)))
                                             
                                            
                                           
                                           (and (== mode in_code)
                                                (== c "`"))
                                           (do 
                                            (if (> word_acc.length 0)
                                                (do 
                                                    (push acc (process_word word_acc))
                                                    (= word_acc [])))
                                            (= backtick_mode 1))
                                            
                                           (and (== mode in_code)
                                                (== c ":")
                                                (== word_acc.length 0)
                                                (> acc.length 0)
                                                (is_string? (last acc)))
                                            (push acc
                                                 (+ (pop acc) ":"))
                                           
                                           (and (== mode in_code)
                                                (== last_c ",")
                                                (or (== c "#")
                                                    (== c "@")))
                                           (do
                                               ;(log "special operator: " (+ last_c c))
                                               (push word_acc c)
                                               (push acc (process_word word_acc))
                                               (= word_acc []))
                                           
                                           (and (== mode in_code)
                                                (or (== c " ")
                                                    (== (-> c `charCodeAt 0) 10)
                                                    (== (-> c `charCodeAt 0) 9)
                                                    (and (== c ",")
                                                         (not (== next_c "@"))
                                                         (not (== next_c "#")))))
                                                    
                                           (do 
                                               ;(when opts.debug (log "whitespace:" c))
                                           (if (> word_acc.length 0)
                                               (do 
                                                (if (== backtick_mode 1)
                                                    (do 
                                                        (push acc (process_word word_acc backtick_mode))
                                                        (= backtick_mode 0))
                                                    (push acc (process_word word_acc)))
                                                (= word_acc []))))
                                            
                                           (and (== mode in_code)
                                                (== (-> c `charCodeAt 0) 13))
                                            false ;; discard it as whitespace 
                                            else
                                           (do 
                                            ;(when opts.debug (log "++word_acc:" c))
                                            (push word_acc c)))
                                      (= last_c c)))
                                (if (> word_acc.length 0)
                                    (do 
                                     ;(log "outside of loop: pushing into acc, backtick_mode:",backtick_mode, word_acc)
                                     (push acc (process_word word_acc backtick_mode))
                                     
                                        ;(push acc (join "" word_acc))
                                     (= word_acc [])))
                                ;(log _depth "read_block: <-"  acc)
                                acc))))
          (console.log "read->" in_buffer )
          (= output_structure (read_block 0))
          (console.log "read<-" output_structure)
          ;(when opts.debug (console.log "read<-" (first output_structure)))
          (first output_structure))))

;; set the read_lisp function to our compiled reader function:

(do 
(set_prop Environment 
          `read_lisp
          reader)
(set_prop Environment
          `as_lisp
          globalThis.lisp_writer))

;; next run tests on the reader - not always necessary for the boot up 

(defglobal `run_reader_tests 
    (fn ()
      (let
          ((`results [])
           (`reader_output nil)
           (`read_lisp_output nil)
           (`test_result nil)
           (`idx -1)
           (`andf (fn (args)
                        (let
                            ((`rval true))
                          (for_each (`a (or args []))
                                    (when (not a)
                                      (= rval false)
                                      (break)))
                          rval))))
        (for_each (`test compiler_tests)
            (do
                (inc idx)
                (log "RUNNING TEST: " test.3 test.0)
                (debug)                
                (= reader_output (reader test.0))
                (= read_lisp_output (-> Environment `read_lisp test.0))
                (= test_result (== (JSON.stringify reader_output) (JSON.stringify  read_lisp_output)))
                (push results
                      [idx
                       (or test.3 (as_lisp test.0))
                       test_result
                       reader_output
                       read_lisp_output])
                (when (not test_result)
                      (console.log "FAIL TEST:", test reader_output read_lisp_output))))
        (log "results: " results)
        (log "summup: " (andf (map (fn (result)
                                       result.2)
                                   results)))
        results)))


;; lay out the ground work for macro definition 

(defglobal `desym
    (fn (val)
        `(let
             ((v (quote ,@val)))
           (if (and (is_string? v)
                    (starts_with? (quote "=:") v))
               (-> v `substr 2)
               v)))
    {
    `eval_when:{ `compile_time: true } 
    })

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
    
    

;; This function will be executed at the time of the compile of code.
;; if called, it will be called with the arguments in the place of the
;; argument list of the defmacro function.

;; The result of the evaluation is returned to the compiler and used
;; as a replacement for the calling form.

;; Therefore the goal is to return a quoted form that will be spliced
;; into the tree at the point of the original calling form.

;; When this function is called, it will have the values assigned to the
;; values in the let.  

(defglobal `defmacro
    (fn (name arg_list `& body)
        (let ;; capture the arguments
            ((macro_name name)
             (macro_args arg_list)
             (macro_body body)
             (source_details {
                               `arguments: macro_args
                               `body: macro_body
                              }))
         
         ;; next run through the steps of registering a macro
         ;; which is essentially a compile time function that 
         ;; transforms the body forms with the provided arguments
         ;; and returns the new form
         (do 
              `(defglobal ,#macro_name 
                  (fn ,#macro_args
                      ,@macro_body)
                  {
                     `eval_when:{ `compile_time: true }
                     `macro: true
                     `source: (quote ,#source_details)
                               
                  }))))
         {
             `eval_when: { `compile_time: true }
         })

(defglobal `read_lisp
    reader)

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
                            `name: name
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
  

  
  
(defglobal `get_outside_global
   (fn (refname)
      (let
        ((`fval (new Function "refname"
           (+ "{ if (typeof " refname " === 'undefined') { return undefined } else { return  " refname " } }"))))
        (fval refname)))) 

(defun `get_outside_global (refname)
      (let
        ((`fval (new Function "refname"
           (+ "{ if (typeof " refname " === 'undefined') { return undefined } else { return  " refname " } }"))))
        (fval refname)))

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
  
(defun `tester (a b)
    (let
        ((`read_table { "\"":["\"" (fn (block)
                                          (do 
                                              ["quotes" block]))]
                                       }))
       read_table))
   
   
              
(defglobal `ifa2
    (fn (test then elseclause)
      `(let ((it ,#test))
         (if it ,#then ,#elseclause)))
      { `eval_when: { `compile_time: true }})         
          
(defmacro `ifa (test then elseclause)
    `(let ((it ,#test))
          (if it ,#then ,#elseclause)))
 
 (ifa (> 5 2)
     (log "it is: " it)
     (log "nope: it is: " it))

 

(defglobal `transformer
    (fn (arg1 `& args)
        (let
            ((arga arg1)
             (rest_of_them args))
             
         (console.log "===TESTER==>arga: ",arga)
         (console.log "===TESTER==>args: ",rest_of_them)
         
        {
            `arg1: arg1
            ;`rest: `( ,@(conj [`quote] rest_of_them))
            `rest:  (quotem ,@(rest_of_them))
         }))
    {
        `eval_when:{ `compile_time: true }
        })
    
         


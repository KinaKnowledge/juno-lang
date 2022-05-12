
;; DLisp to Javascript Compiler
;; (c) 2022 Kina




;; in the console:

;; var { get_next_environment_id, check_true, get_outside_global, subtype,lisp_writer, clone } = await import("/lisp_writer.js?id=94534")

;; To load the previously compiled compiler and environment (in the console):

;; var { get_next_environment_id, check_true, get_outside_global, subtype,lisp_writer, clone } = await import("/lisp_writer.js?id=94534")
;; globalThis.subtype=subtype
;; globalThis.check_true=check_true

;; var { init_dlisp } = await import("./environment.js");
;; var { init_compiler } = await import("./compiler.js");
;; await init_dlisp()
;; var env=await dlisp_env()
;; var { environment_boot } = await import("./environment_boot.js")
;; await environment_boot(env);
;; await init_compiler(env)
;; var cca = await env.get_global("compiler")
;; await env.set_compiler(cca)
;; var env_alpha = env  

;; Next compile the below and evaluate to open a tab

; (tab ["Alpha A" (dlisp_tab env_alpha) ] true)




(import `Boot.Compiler-Tests)  

(defglobal `as_lisp
    lisp_writer)

(defmacro quotel (val)
    (quote val))

(defmacro declare (values)
    true)

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

(defun `get_outside_global_deprecated (refname)
      (let
        ((`fval (new Function "refname"
           (+ "{ try { if (typeof " refname " === 'undefined') { return undefined } else { return  " refname " } } catch (ex) { return undefined; } }"))))
        (fval refname)))
    
    
(defglobal `get_outside_global get_outside_global)

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
    
    
(defmacro `desym_ref (val)
    (desym val))

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
             (join " " (flatten ["(" (join " && " acc_full) ")" ]))))))


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
           (`escaped (replace (new RegExp "\r" `g) 
                              (+ (String.fromCharCode 92) "r") escaped))
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




(defun `defclog (opts)
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





(defun `getf_ctx (ctx name _value)
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

(defun `setf_ctx (ctx name value)
    (let
        ((`found_val (getf_ctx ctx name value)))
        (if (== found_val undefined)
            (set_prop ctx.scope
                      name
                      value))
        value))
                  
        
(defun `set_path (path obj value)
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

(defun `gen_multiples (len multiple?)
  (let
      ((`val 100)
       (`acc [val])
       (`mult (or multiple? 10)))
     (for_each (`r (range len))
        (push acc (= val (* val mult))))
    (reverse acc)))

(defun `path_multiply (path multiple?)
  (let
      ((`acc 0)
       (`multiples (gen_multiples (length path) multiple?)))
      (for_each (`pset (pairs (interlace path multiples)))
          (= acc (+ acc (* pset.0 pset.1))))
      acc))

(defun `splice_in_return_a (js_tree _ctx _depth _path)
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
      (splice_log "->" (clone js_tree))
      
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
                        (splice_log "FUNCTION TYPE: " comp.ctype)
                        (push ntree comp))
                    (or (== comp.ctype "AsyncFunction")
                        (== comp.ctype "Function"))
                    (do 
                        (= _path  [])
                        (= _ctx (new_ctx _ctx))
                        (= function_block? true)
                        (splice_log "start return point encountered: " comp (getf_ctx _ctx `base_path))
                        
                        (push ntree comp))
                        
                    (== comp.mark "rval")
                    (do 
                        (splice_log "potential return: " (getf_ctx _ctx `level) "if_id: " comp.if_id comp (conj _path [idx]) (clone (slice js_tree idx)))
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
                        (splice_log "force_return: at level:" (getf_ctx _ctx `level) "if_id: " comp.if_id comp (conj _path [idx]) (clone (slice js_tree idx)))
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
                        (splice_log "final block return for level:" (getf_ctx _ctx `level) "if_id: " comp.if_id comp (conj _path [idx]) (clone (slice js_tree idx)))
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
                (`final_viable_path (prop (first viables) `path))
                (`max_viable 0)
                (`plength 0)
                (`if_paths [])
                (`max_path_segment_length nil)
                (`final_return_found (getf_ctx _ctx `return_found)))
                
              (splice_log "<return must be by here> found?" final_return_found "level: "  _ctx.scope.level "root: " root  "base_path: " base_path "last_path: " last_path)
              (splice_log "viable_return_points: " (clone viables))
              (splice_log "potential_return_points: " (clone potentials))
              (splice_log "tree to operate on: " (clone js_tree))
              (splice_log "if_links: " (clone (getf_ctx _ctx `if_links)))
              ;; we do change the indices because we will replace the marker objects
              ;; rule: for all viables, insert return statement at point of path
              ;; rule: for all potentials, ONLY if NO viables, insert return point
            
              (for_each (`v viables)
                 (do 
                     (set_path v.path ntree { `mark: "return_point" } )
                     
                     (splice_log "set viable: " (clone (resolve_path (chop v.path) ntree)))))
            
              
             (splice_log "removing potentials: base_path: " base_path "max_viable: " max_viable (length final_viable_path) final_viable_path)
             
              (for_each (`p potentials)
                 (do 
                     (= plength (Math.min (length p.path) (length final_viable_path)))
                     ;(= base_addr (slice final_viable_path 0 plength))
                     (defvar `ppath (slice p.path 0 plength))
                     (defvar `vpath (if final_viable_path 
                                        (slice final_viable_path 0 plength)
                                        []))
                     (= max_path_segment_length (Math.max 8
                                                          (+ 1 (prop (minmax ppath) 1))
                                                          (+ 1 (prop (minmax vpath) 1))))
                     (splice_log p "max_path_segment_length: " max_path_segment_length "ppath: " ppath " vpath: " vpath 
                                 (path_multiply ppath max_path_segment_length) ">" (path_multiply vpath max_path_segment_length)
                                 (> (path_multiply ppath max_path_segment_length) (path_multiply vpath max_path_segment_length)))
                     (if (or (> (path_multiply ppath max_path_segment_length)
                                (path_multiply vpath max_path_segment_length))
                             (and (== p.block_step 0)
                                  (== p.lambda_step 0))
                             (== 0 (length viables)))
                        (do 
                            (splice_log "set potential to return at" ppath "versus final viable: " vpath p.if_id)
                            (set_path p.path ntree { `mark: "return_point" })
                            (when (and p.if_id
                                       (prop (getf_ctx _ctx `if_links) p.if_id))
                                  (for_each (`pinfo (prop (getf_ctx _ctx `if_links) p.if_id))
                                     (do
                                       (when (== undefined (prop if_paths (as_lisp pinfo.path)))
                                         (set_prop if_paths (as_lisp pinfo.path) true)
                                         (set_path pinfo.path ntree { `mark: "return_point" } )
                                         (splice_log "if adjust on: " pinfo.if_id pinfo.path pinfo))))
                                  ))
                         (do 
                           (when (and (== undefined (prop if_paths (as_lisp p.path)))
                                      (not (== p.type "final-return")))
                                (set_path p.path ntree { `mark: "ignore" } )
                                (splice_log "if adjust off: " p.if_id p.path p))))
                     ))
           ))
              
          
      (if (== _depth 0)
          (splice_log "<-" (clone ntree)))
      
      
      ntree)
     else
     js_tree))
                  
(defun `splice_in_return_b (js_tree _ctx _depth)
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
          

  
(defun `add_escape_encoding (text)
    (if (is_string? text)
        (let
            ((`chars (split_by "" text))
             (`acc []))
            (for_each (`c chars)
               (cond 
                 (== (-> c `charCodeAt 0) 34)
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


;; stub macro for boot strappin 

(defmacro `if_compile_time_defined (a b)
    false)



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
                              `undefined `unescape `valueOf `window `check_true])





(defun `load_compiler_code ()
    (get_attachment (unpack (first (retrieve { `no_meta: true `index_0: "Compiler" `type: `Function } )))))


(-> JEVAL `evaluate "(eval (compile_lisp (load_compiler_code)))")



(import `Compiler-Test-Functions)


(defun `make_start_env ()  
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
              
              (`declarations { 
                  `safety: {
                      `level: 2
                  }
              })
              
              ;; the root context 
              (`global_ctx {
                   ;; standard library
                       `scope:{
                           `MAX_SAFE_INTEGER: 9007199254740991
                           `DEBUG_LEVEL: 0
                           `check_true: check_true
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
                                             (-> container `includes value)
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
                                   
                           `indirect_new: (new Function "...args"
                                                "{
                                                    let targetClass = args[0];
                                                    if (args.length==1) {
                                                        return new targetClass()
                                                    } else {
                                                        let f = function(Class) {
                                                            return new (Function.prototype.bind.apply(Class, args));
                                                        }
                                                        let rval = f.apply(this,[targetClass].concat(args.slice(1)));
                                                        return rval;
                                                    }}")
                           `or_args: (fn (argset)
                                           (let
                                              ((is_true false))
                                              (for_each (`elem argset)
                                                (if elem
                                                    (do
                                                      (= is_true true)
                                                      (break))))
                                              is_true))
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
                                            {   `env: interface 
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
                                         (is_string? compiled.0.ctype)
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
                                                          `error: last_exception.name
                                                          `message: last_exception.message
                                                          `form: nil
                                                          `parent_forms: nil
                                                          `invalid: true
                                                          `text: last_exception.stack
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
                     `declarations declarations
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
  
  ;; for recovery purposes...
  (set_prop env
          `old_read_lisp
          env.read_lisp)
  env
  ))




;(defun `get_compiler_tests ()
 ;   (defglobal `compiler_tests
  ;      (get_attachment (unpack (first (retrieve { `no_meta: true `index_0: `Boot.Compiler-Tests }))))))


(defun `reader_lib ()
    (get_attachment (unpack (first (retrieve { `no_meta: true `index_0: "Compiler-Reader" `type: `Function } )))))

(defun `bootstrap_a ()
    (get_attachment (unpack (first (retrieve { `no_meta: true `index_0: "Compiler-Bootstrap-Library" `type: `Function} )))))

(defun `bootstrap_b ()
    (get_attachment (unpack (first (retrieve { `no_meta: true `index_0: "Compiler-Boot-Library"`type: `Function } )))))

(defun `alpha_environment ()
    (get_attachment (unpack (first (retrieve { `no_meta: true `index_0: "Environment" `type: `Function } )))))


(defun `run_compiler_tests (environment)
  (do
    (import `Boot.Compiler-Tests)
    (when (not environment)
        (make_start_env)
        (log "ENV ID: " env)
        (sleep 0.1)  ;; for screen updates for logging
        (-> env `evaluate (reader_lib))
    
        (-> env `evaluate "(do 
                                (set_prop Environment 
                                          `read_lisp
                                          reader)
                                (set_prop Environment
                                          `as_lisp
                                          globalThis.lisp_writer))")
        (log "reader installed")
        (sleep 0.1))  

    (defvar `test_results (run_tests { `table: true `env: (or environment env) }))
    (tab [(if environment
              "Compiler-Tests - Env"
              "Compiler Tests - Start Env")
        test_results.view]
       true)))


(defglobal DEBUG_LEVEL 0)
(defglobal check_true check_true)
;; now make the environment 

(defun `init_bootstrap (run_tests? no_tabs? )
  (do
    (-> JEVAL `evaluate "(eval (compile_lisp (load_compiler_code)))")
    (import `Boot.Compiler-Tests)
    (make_start_env)
    (log "ENV ID: " env)
    (sleep 0.1)  ;; for screen updates for logging
    (-> env `evaluate (reader_lib))
    
    (-> env `evaluate "(do 
                            (set_prop Environment 
                                      `read_lisp
                                      reader)
                            (set_prop Environment
                                      `as_lisp
                                      globalThis.lisp_writer))")
    (log "reader installed")
    (sleep 0.1)  
    (when run_tests?
          (defvar `test_results (run_tests { `table: true `env: env }))
          (tab ["Compiler Tests - Start Env"
                test_results.view]
               true)
          (sleep 1))
    (log "starting bootstrap environment")
    (sleep 0.1)  
    (-> env `evaluate (bootstrap_a))
    ;; ok 
    (log "Building alpha environment")
    (sleep 0.1)
    (-> env `evaluate (alpha_environment))
    
    (defglobal `env_alpha (dlisp_env))
    (sleep 0.1)
    (-> env_alpha `set_compiler compiler)
    
    (when (not no_tabs?)
        (log "Loading Compiler Boot Library")
        (sleep 0.1)
        (-> env_alpha `evaluate (bootstrap_b))
        (-> env_alpha `evaluate (+ "(defglobal `client (-> developer `getInstanceById " client.id "))"))
        (log "Loading Alpha Environment")
       
        ;; open a new tab
        (defvar `cmp_editor (dlisp_tab env_alpha))
       
        (tab ["Alpha 1" cmp_editor.view ] true)
        (sleep 1)
        (-> cmp_editor `set (+ "(progn\n " (load_compiler_code) "\n  (-> Environment `set_compiler compiler))\n" ))
        (sleep 0.1)
        (-> cmp_editor `compile)
        (sleep 1)
        ;; now recompile with the rebuilt compiler
        (-> cmp_editor `compile)
        (sleep 1)
        (defvar `cmp_editor2 (dlisp_tab env_alpha))
        (tab ["Alpha 2" cmp_editor2 ] true)
        (sleep 1)
        (-> cmp_editor2 `set "(-> Environment `set_compiler compiler)")
        (sleep 0.1)
        ;(-> cmp_editor2 `compile)
        (sleep 1)
        (tab ["Alpha 3" (dlisp_tab env_alpha) ] true)
        (sleep 1)
        (tab ["Alpha 4" (dlisp_tab env_alpha) ] true)
        (sleep 1)
        (tab ["Alpha 5" (dlisp_tab env_alpha) ] true)
        (log "Complete")
        )))
    
(log "Run (init_bootstrap true) to initialize and build compiler environment (true will run the tests).")


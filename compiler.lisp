;; DLisp λ to Javascript Compiler
;; (c) 2022 Kina

;; **

;; Author: Alex Nygren

;; var { check_true, get_outside_global, subtype,lisp_writer,clone } = await import("/lisp_writer.js?id=942024")


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

;; error_report (fn (errors)) - when compilation is completed, this function is called
;;                              with the accumulated compilation errors and warnings
;; env - environment object to use for the compilation environment



(defglobal `compiler 
  (fn (quoted_lisp opts)
    (let
	((`get_global opts.env.get_global)
	 (`Environment opts.env))      
     (let
      ((`tree quoted_lisp)  ;; the JSON source
       
       ;; when we are compiling forms that are compile time manipulated by functions, 
       ;; expanded_tree will hold the tree structure that is the result of those
       ;; macro expansions
       
            
       (`expanded_tree (clone tree))
       (`op nil)
      
       (`default_safety_level (or Environment.declarations.safety.level 1))
       ;(`nada (console.log "COMPILER: " Environment  " Safety Level: " default_safety_level))  ;  "INPUT: ->" (clone tree)))
       
       (`build_environment_mode (or opts.build_environment false))
       (`env_ref (if build_environment_mode
                     ""
                     "Environment."))
       (`operator nil)
       (`break_out "__BREAK__FLAG__")
       (`tokens [])
       (`tokenized nil)
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
       (`temp_fn_asn_template [{"type":"special","val":(quotel "=:defvar"),"ref":true,"name":"defvar"},{"type":"literal","val":"\"\"","ref":false,"name":""},{"type":"arr","val":[{"type":"special","val":(quotel "=:fn"),"ref":true,"name":"fn"},{"type":"arr","val":[],"ref":false,"name":"=:nil"},{"type":"arr","val":[],"ref":false,"name":"=:nil"}],"ref":false,"name":"=:nil"}])
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
                                 `source ""
                                 `parent parent
                                 `ambiguous (new Object)
                                 `declared_types (new Object)
                                 `defs [])
                      (when parent
                       (when parent.source
                         (set_prop ctx_obj
                                   `source
                                   parent.source))
                       (when parent.defvar_eval
                         (set_prop ctx_obj
                                   `defvar_eval
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
                                   (+ parent.return_point 1))))
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
                                  UnknownType
                                  (== ctype "array")
                                  Array
                                  (== ctype "Boolean")
                                  Boolean
                                  (== ctype "nil")
                                  NilType
                                  (is_function? ctype)
                                  ctype
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
                                  (== Object value)
                                  "Object"
                                  else
                                  value)))
       (`set_ctx (fn (ctx name value)
                     (do
                      (defvar `sanitized_name (sanitize_js_ref_name name))
                      ;(set_ctx_log "set_ctx:  ref:" sanitized_name "type: " (sub_type value) "val: " (clone value))
                      
                                        ;(= name (sanitize_js_ref_name name))
                      (if (and (is_array? value)
                               value.0.ctype)
                          (set_prop ctx.scope
                                    sanitized_name
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
                                    sanitized_name
                                    value)))))

       ;; Retrieves a value from the current compilation context
       
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
       ;; preferred entry point                  
       (`get_ctx_val (fn (ctx name)
                         (let
                             ((`ref_name nil)
                              (`declared_type_value nil))
                           (when (eq nil ctx)
                                 (console.error "get_ctx_val: undefined/nil ctx passed."))
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
                              (= ref_name (sanitize_js_ref_name name))
                              ;; we need to check an explicit declarations regarding the
                              ;; reference.  They override an inferred type value.  If 
                              ;; we don't find a declaration, then get it from the
                              ;; inferred scope.
                              ;; do it with the full path 
                              (= declared_type_value (get_declarations ctx ref_name))
                              (if declared_type_value.type
                                  declared_type_value.type
                                  (do
                                    (= ref_name (first (get_object_path ref_name)))
                                    (cond
                                      (prop op_lookup ref_name)
                                      AsyncFunction
                                      (not (== undefined (prop ctx.scope ref_name)))
                                      (prop ctx.scope ref_name)
                                      ctx.parent
                                      (get_ctx ctx.parent ref_name)))))))))
       
       
       (`get_declarations (fn (ctx name _tagged)
                         (let
                             ((`ref_name nil)
                              (`oname name)
                              (`name (if _tagged
                                         name
                                         (sanitize_js_ref_name name))))
                           (cond 
                             (not (is_object? ctx))
                             (throw TypeError (+ "get_declarations: invalid ctx passed"))
                             (is_nil? name)
                             (throw TypeError (+ "get_declarations: nil identifier passed: " (sub_type oname)))
                             (is_number? name)
                             name
                             (is_function? name)
                             (throw (+ "get_declarations: invalid identifier passed: " (sub_type oname)))
                             else
                             (when (is_string? name)
                              (if (starts_with? (quote "=:") name)
                                  (= ref_name (-> name `substr 2))
                                  (= ref_name name))
                              ;(console.log "get_declarations: refname: " ref_name oname (prop ctx.declared_types ref_name))
                              ;(= ref_name (first (get_object_path ref_name)))
                               (cond
                                 (prop op_lookup ref_name)
                                 nil
                                 (not (== undefined (prop ctx.declared_types ref_name)))
                                 (prop ctx.declared_types ref_name)
                                 ctx.parent
                                 (get_declarations ctx.parent ref_name true)))))))
       
       (`set_declaration (fn (ctx name declaration_type value)
                             (let
                                 ((`sname (sanitize_js_ref_name name))
                                  (`dec_struct (get_declarations ctx sname)))
                                 (when (blank? dec_struct)
                                     (= dec_struct {
                                                    `type:undefined
                                                    `inlined: false
                                                    }))
                                 (set_prop dec_struct
                                           declaration_type
                                           value)
                                 (set_prop ctx.declared_types
                                           sname
                                           dec_struct)
                                 (prop ctx.declared_types
                                       sname))))
       
       

       
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
                                
       (`invalid_js_ref_chars "+?-%&^#!*[]~{}|")
       (`invalid_js_ref_chars_regex (new RegExp "[\\%\\+\\[\\>\\?\\<\\\\}\\{&\\#\\^\\=\\~\\*\\!\\)\\(\\-]+" `g))
       
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
                                                      (== t "~")
                                                      (push acc "_percent_")
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
       (`source_chain (fn (cpath tree sources)
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
                                                 (< sources.length 4))
                                            (source_chain cpath tree sources))
                                        sources))))
       (`source_from_tokens (fn (tokens tree collect_parents?)
                               (let
                                   ()
                                   ;(console.log "source_from_tokens: tokens: " (clone tokens) "tree: " (clone tree) "expanded_tree: " (clone expanded_tree))
                                   ;(debug)
                                   (cond
                                       (and tokens.path
                                            collect_parents?)
                                       (source_chain tokens.path tree)
                                       tokens.path
                                       (as_lisp (resolve_path tokens.path tree))
                                       (and (is_array? tokens)
                                            tokens.0.path
                                            collect_parents?)
                                       (source_chain tokens.0.path tree)
                                       (and (is_array? tokens)
                                            tokens.0.path)
                                       (as_lisp (resolve_path (chop tokens.0.path) tree))
                                       (and (== undefined tokens)
                                            (not (== undefined tree)))
                                       (as_lisp tree)
                                       else
                                       (do
                                           (console.warn "source_from_tokens: unable to determine source path from: " (clone tokens))
                                           
                                           "")))))                                                                                                                                                                                   
       (`NOT_FOUND  "__!NOT_FOUND!__")
       (`THIS_REFERENCE (fn () "this"))
       (`NOT_FOUND_THING (fn () true))
       (`get_lisp_ctx_log (if opts.quiet_mode
                              log
                              (defclog { `prefix: "get_lisp_ctx"  `color: "darkgreen"  `background: "#A0A0A0"} )))
       (`get_lisp_ctx (fn (name)
                          (if (not (is_string? name))
                              (throw Error "Compiler Error: get_lisp_ctx passed a non string identifier")
                              (let
                                  ((`comps (get_object_path name))
                                   (`cannot_be_js_global (check_invalid_js_ref comps.0))
                                   (`ref_name (take comps))
                                   (`ref_type (if (== ref_name "this")
                                                      THIS_REFERENCE
                                                      (progn
							(defvar `global_ref (prop root_ctx.defined_lisp_globals ref_name))
							(if (or (eq undefined global_ref)
								(== global_ref "statement"))
							    (-> Environment `get_global ref_name NOT_FOUND_THING cannot_be_js_global)
							    global_ref)))))
                                
                                
                                ;(get_lisp_ctx_log "symbol name:" ref_name "type:" (if (== NOT_FOUND_THING ref_type) "[NOT FOUND]" ref_type) "extern_safe:" (not cannot_be_js_global)  "found in external env:" (not (== NOT_FOUND_THING ref_type)))
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
                                    ;(get_lisp_ctx_log "returning undefined for " name)      
                                    undefined ); ref_type
                                  (== ref_type THIS_REFERENCE)
                                  ref_type
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
                                  
                                  (and (== (typeof ref_type) "object")
                                       (contains? comps.0 (-> Object `keys ref_type)))
                                  (do 
                                      (while (or (eq ref_type undefined) 
                                                 (> comps.length 0))
                                        (= ref_type (prop ref_type (take comps))))
                                      ref_type)
                                  
                                  else
                                  (do
                                   (get_lisp_ctx_log "symbol not found: " name ref_name ref_type cannot_be_js_global)
                                   ;(console.error "compile: get_lisp_ctx: symbol not found: " name)
                                   ;(error_log "get_lisp_ctx: unhandled name structure: " name)
                                   undefined)
                                   ;(throw SyntaxError (+ "get_lisp_ctx: unhandled name structure: " name))
                                   )))))
       
       
       (`get_val (fn (token ctx)
                     (do
                      (cond
                        token.ref
                        (do 
                            (defvar `comps (split_by "." token.name))
                            ;(log "get_val: " (safe_access token ctx sanitize_js_ref_name))
                            (if (and (> (safety_level ctx) 1)
                                     (> comps.length 1))
                                (safe_access token ctx sanitize_js_ref_name)
                                (sanitize_js_ref_name (expand_dot_accessor token.name ctx))))
                        else
                        token.val))))
       (`has_lisp_globals false)
       (`root_ctx   (new_ctx (or opts.ctx)))
       (`lisp_global_ctx_handle Environment.context)
       (`tokenize_object (fn (obj ctx _path)
                             (do
                              (= _path (or _path []))
                              ;(log "tokenize_object: " (keys obj) (as_lisp obj))
                              (if  (== (JSON.stringify obj) "{}")
                                   (do 
                                        ;(log "tokenize_object: returning {}")
                                    { `type: "object" `ref: false `val: "{}" `name: "{}" `__token__:true  `path: _path})
                                   (for_each (`pset (pairs obj))
                                             (do
                                        ;(log "pset: " pset)
                                              {`type: `keyval `val: (tokenize pset ctx `path: (+ _path pset.0)) `ref: false `name: (desym_ref pset.0) `__token__:true }))))))
                                        ;{`type: `value `val:(tokenize pset.1) `ref: (is_reference? pset.1) `name: (desym pset.1) } ])))) )
       
       
       (`tokenize_quote (fn (args _path)
                            (do
                                        ;(log "tokenize_quote->" args)
                                        ;(console.log "tokenize_quote->" args)
                             (cond
                               (== args.0 (quote "=:quote"))
                               {`type: `arr `__token__:true `source: (as_lisp args) `val: (conj [ { `type: `special `val: (quote "=:quote") `ref: true `name: "quote" `__token__:true } ] (-> args `slice 1)) `ref: (is_reference? args) `name: nil  `path: _path}
                               (== args.0 (quote "=:quotem"))
                               {`type: `arr `__token__:true `source: (as_lisp args) 
                               `val: (conj [ { `type: `special `val: (quote "=:quotem") `ref: true `name: "quotem" `__token__:true } ] (-> args `slice 1)) `ref: (is_reference? args) `name: nil `path: _path }
                               else
                               {`type: `arr `__token__:true `source: (as_lisp args) 
                               `val: (conj [ { `type: `special `val: (quote "=:quotel") `ref: true `name: "quotel" `__token__:true } ] (-> args `slice 1)) `ref: (is_reference? args) `name: nil `path: _path }))))
       ;; pass 1: build up a structure containing categorizations of the code to be compiled.
       
       (`tokenize   (fn (args ctx _path)
                        (let
                            ((`argtype nil)
                             (`rval nil)
                             (`ctx ctx)
                             (`_path (or _path []))
                             (`qval nil)
                             (`idx -1)
                             (`tobject nil)
                             (`argdetails nil)
                             (`argvalue nil)
                                        ;(`tstate (or tstate { `in_quotem: false } ))
                             (`is_ref nil))
                          ;(log "tokenize:" (sub_type args) args)
                          (when (eq nil ctx)
                                (console.error "tokenize: nil ctx passed: " (clone args))
                                (throw ReferenceError "nil/undefined ctx passed to tokenize"))
                          (when (is_array? args)
                            ;; check to see this is an eval_when compile function, and evaluate it if so.
                            (= args (compile_time_eval ctx args))
                            (cond
                                (> _path.length 1)
                                (do
                                   (= tobject (resolve_path (chop _path) expanded_tree))
                                   (when tobject
                                       (set_prop tobject
                                                 (last _path)
                                                 args)))
                                (== _path.length 1)
                                (do 
                                    (set_prop expanded_tree
                                              (first _path)
                                              args))
                                else
                                (= expanded_tree args)))   
                          (cond 
                            (or (is_string? args)
                                (is_number? args)
                                (or (== args true) (== args false)))
                            (first (tokenize [ args ] ctx _path))
                            (and (is_array? args)
                                 (or (== args.0 (quote "=:quotem"))
                                     (== args.0 (quote "=:quote"))
                                     (== args.0 (quote "=:quotel"))))
                            (do
                                        ;(log "tokenize -> " args)
                             (= rval (tokenize_quote args _path))
                             ;(console.log "tokenize: A: returning quote/m:" rval)
                             rval)
                            (and (is_array? args)				
                                 (not (get_ctx_val ctx `__IN_LAMBDA__))
                                 (== args.0 (quote "=:iprogn")))				 
                            (do			     
                                (= rval (compile_toplevel args ctx))
                                (tokenize rval ctx _path))
                            (and (not (is_array? args))
                                 (is_object? args))
                            (first (tokenize [args] ctx (+ _path 0)))
                            else
                            (do
                             (when (or (== args.0 (quote "=:fn"))
                                       (== args.0 (quote "=:function"))
                                       (== args.0 (quote "=:=>")))
                                 (= ctx (new_ctx ctx))
                                 (set_ctx ctx
                                          `__IN_LAMBDA__
                                          true))
                             ;(log "tokenize:<-" (sub_type args) args)
                             (for_each (`arg args)
                              (do
                               (inc idx)
                               (= argdetails (find_in_context ctx arg))
                               
                               ;(log "tokenize: argdetails: " (clone argdetails))
                                (= argvalue argdetails.val)
                                (= argtype argdetails.type)
                                
                                (= is_ref argdetails.ref)
                                        ;(log "tokenize: " arg argtype argvalue)
                                        ;(console.log "tokenize->: " arg)
                                (cond
                                  (== (sub_type arg) "array")
                                  {`type: `arr `__token__:true  `val: (tokenize arg ctx (+ _path idx)) `ref: is_ref `name: nil `path: (+ _path idx) }
                                  (== argtype "Function")
                                  {`type: `fun `__token__:true `val: arg `ref: is_ref `name: (desym_ref arg) `path: (+ _path idx)}
                                  (== argtype "AsyncFunction")
                                  {`type: `asf `__token__:true `val: arg `ref: is_ref `name: (desym_ref arg) `path: (+ _path idx)}
                                  (== argtype "array")
                                  {`type: `array `__token__:true `val: arg `ref: is_ref `name: (desym_ref arg) `path: (+ _path idx)}
                                  (== argtype "Number")
                                  {`type: `num `__token__:true `val: argvalue `ref: is_ref  `name: (desym_ref arg)`path: (+ _path idx)}
                                  (and (== argtype "String") is_ref)
                                  {`type: `arg `__token__:true `val: argvalue `ref: is_ref `name: (clean_quoted_reference (desym_ref arg)) `global: argdetails.global `local: argdetails.local `path: (+ _path idx) }
                                  (== argtype "String")
                                  {`type: `literal `__token__:true `val:  argvalue `ref: is_ref `name: (clean_quoted_reference (desym_ref arg)) `global: argdetails.global `path: (+ _path idx)}
                                  (is_object? arg)
                                  (do 
                                   {`type: `objlit `__token__:true  `val: (tokenize_object arg ctx (+ _path idx)) `ref: is_ref `name: nil `path: (+ _path idx)})
                                  (and (== argtype "literal") is_ref (== (desym_ref arg) "nil"))
                                  {`type: `null `__token__:true `val: null `ref: true `name: "null" `path: (+ _path idx)}
                                  (and (== argtype "unbound") is_ref (eq nil argvalue))
                                  {`type: "arg" `__token__:true `val: arg `ref: true `name: (clean_quoted_reference (desym_ref arg)) `path: (+ _path idx)}
                                  (and (== argtype "unbound") is_ref)
                                  {`type: (sub_type argvalue) `__token__:true `val: argvalue `ref: true `name: (clean_quoted_reference (sanitize_js_ref_name (desym_ref arg))) `path: (+ _path idx)}
                                  
                                        ;(== argtype "Boolean")
                                        ;{`type: `bool `__token__:true `val: argvalue `ref: false `name: arg}
                                  else
                                  {`type: argtype `__token__:true  `val: argvalue `ref: is_ref `name: (clean_quoted_reference (desym_ref arg)) `global: argdetails.global `local: argdetails.local `path: (+ _path idx)}))))))))
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
                     ((`ntree nil)		      
                      (`precompile_function (-> Environment `get_global (-> lisp_tree.0 `substr 2))))

		   
                   ;(comp_time_log "->" (-> lisp_tree.0 `substr 2) lisp_tree "to function: " (-> lisp_tree `slice 1))
                   ;(comp_time_log "Environment ID: " (-> Environment `id) "precompile function to use: " precompile_function)
                   
                   (try
                      (= ntree (apply precompile_function (-> lisp_tree `slice 1)))
                      
                      (catch Error (`e)
                        (do
                         ;(console.error "precompilation error: " e)
                         (set_prop e
                                   `handled true)
                         (push errors
                               {  `error: e.name
                                  `message: e.message
                                  `form: (source_chain [0] [lisp_tree])
                                  `parent_forms: []
                                  `invalid: true
                               })
                         (throw e)
                         )))
                   (if (eq nil ntree)
                       (push warnings (+ "compile time function " (-> lisp_tree.0 `substr 2) " returned nil"))
                       (do
                         ;(comp_time_log "applied:" ntree)						  
			(= ntree (do_deferred_splice ntree))			
		        (when (not (== (JSON.stringify ntree)
				       (JSON.stringify lisp_tree)))
			    ;(console.log "expanding all macros: " (as_lisp ntree))
			    (= ntree (compile_time_eval ctx ntree)))
			(when (verbosity ctx)
                          (comp_time_log (-> lisp_tree.0 `substr 2) "<- lisp: ", (as_lisp ntree)))))
                         ;(comp_time_log (-> lisp_tree.0 `substr 2) "<-", (clone ntree))))
                   ntree)
                 
                 lisp_tree)))
       (`infix_ops   (fn (tokens ctx opts)
                         (let
                             ((`op_translation {
                                               `or: "||"
                                               `and: "&&"
                                               })
                              (`ctx (new_ctx ctx))
                              ;(`nada (log "infix_ops: ->" tokens ctx opts))
                              (`math_op_a (prop (first tokens) `name))
                              (`math_op (or (prop op_translation math_op_a) math_op_a))
                              (`idx 0)
                              (`stmts nil)
                              (`declaration (if (is_string? tokens.1.name)
                                                (get_declarations ctx tokens.1.name (not tokens.1.ref))
                                                nil))
                              
                              (`symbol_ctx_val (if (and tokens.1.ref (is_string? tokens.1.name))
                                                   (get_ctx_val ctx tokens.1.name)))
                              (`is_overloaded false)
                              (`token nil)
                              (`add_operand (fn ()
                                                (when (and (> idx 1)
                                                           (< idx (- tokens.length 0)))
                                                  (push acc math_op))))
                              (`acc [{"ctype":"expression"}]))
                           (set_ctx ctx
                                    `__COMP_INFIX_OPS__
                                    true)
                           ;(log "infix + declaration: " declaration " ctx value: " )
                           (when (and (or (== declaration.type Array)
                                          (== declaration.type Object)
                                          (== symbol_ctx_val `objliteral)                     
                                          (== symbol_ctx_val Expression)
                                          (== symbol_ctx_val ArgumentType)
                                          (== tokens.1.type `objlit)
                                          (== tokens.1.type `arr))
                                      (== math_op `+))
                             (= is_overloaded true))
                           
                           ;(log "infix +> op:" math_op "overloaded: " is_overloaded (rest tokens))
                           (if is_overloaded
                               (do
                                (set_prop tokens
                                          0
                                          { `type: "function"
                                          `val: (+ (quote "=:") `add)
                                          `name: "add"
                                          `ref: true })
                                (= stmts (compile tokens ctx))
                                ;(log  "infix (overloaded +): <-" stmts)
                                (= stmts (wrap_assignment_value stmts))
                                ;; BACKTOHERE
                                ;(log  "infix <- " stmts)
                                stmts)
                                
                               (do
                                (push acc "(")
                                (while (< idx (- tokens.length 1))
                                 (do
                                  (inc idx)
                                  (= token (prop tokens idx))
                                   (add_operand)
                                   (push acc (wrap_assignment_value (compile token ctx)))))
                                   
                                   ; (log "infix <- " token (last acc))
                                     
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
                                ;(log "compile_set_prop: tokens: " tokens)
                                ;(log "compile_set_prop: target: " target) 
                                (for_each (`t ["await" " " "async" " " "function" "()" "{" "let" " " target_reference "=" target ";" ] )
                                          (push wrapper t))
                                (while (< idx (- tokens.length 1))
                                       (do
                                        (inc idx)
                                        (push acc target_reference)
                                         (= token (prop tokens idx))
                                         ;(log "compile_set_prop: " target_reference  idx "token: " token)
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
                                ;(log "compile_set_prop: " (join "" (flatten wrapper)))
                                wrapper)))
       
       
       (`compile_prop  (fn (tokens ctx)
                           (let
                               ((`acc [])
                                (`target (wrap_assignment_value (compile (second tokens) ctx)))
                                (`target_val nil)
                                (`idx_key (wrap_assignment_value (compile (prop tokens 2) ctx))))
                                
                            ;(log "compile_prop: target: " target)
                            ;(log "compile_prop: idx_key: " idx_key)
                            (if (> (safety_level ctx) 1)
                                (do
                                    (= target_val (gen_temp_name "targ"))
                                    ["await" " " "(" "async" " " "function" "()" "{" 
                                                                                   "let" " " target_val "=" target ";" 
                                                                                   "if" " " "(" target_val ")" "{" " " "return" "(" target_val ")" "[" idx_key "]" "}" " " "}" ")" "()" ])
                                [ "(" target ")" "[" idx_key "]"]))))
       
       (`compile_elem (fn (token ctx)
                          (let
                              ((`rval nil)
                               (`check_needs_wrap 
                                       (fn (stmts)
                                           (let
                                               ((`fst (or (and (is_array? stmts)
                                                               (first stmts)
                                                               (is_object? (first stmts))
                                                               (prop (first stmts) `ctype)
                                                               (cond
                                                                   (is_string? (prop (first stmts) `ctype))
                                                                   (prop (first stmts) `ctype)
                                                                   else
                                                                   (sub_type (prop (first stmts) `ctype))))
                                                          )))
                                             ;(inline_log "check_needs_return: " fst (sub_type fst))
                                             (cond
                                               (contains? "block" fst)
                                               true
                                               else
                                               false)))))
                            ;(log "compile_elem: -> complex?" (is_complex? token.val) token)
                            (if (is_complex? token.val)
                                (= rval (compile_wrapper_fn token ctx))
                                (= rval (compile token ctx)))
                            (when (not (is_array? rval))
                              (= rval [ rval ]))
                            ;(log "compile_elem: <-" (flatten rval))
                            rval)))
       (`inline_log (if opts.quiet_mode
                        log
                        (defclog { `prefix: "compile_inline:" `background: "#404880" `color: "white" } )))
       (`compile_inline (fn (tokens ctx)
                            (let
                                ((`rval nil)
                                 (`stmt nil)
                                 (`inline_fn nil)
                                 (`has_literal? false)
                                 (`wrap_style 0)
                                 (`args []))
                              ;(inline_log "->" tokens)
                            
                              ;; compile the arguments first to determine if they are candidates
                              ;; for inline opportunities
                              
                              (for_each (`token (-> tokens `slice 1))
                                 (do
                                     ;(inline_log "compiling: " token)
                                     (= stmt (wrap_assignment_value (compile token ctx)))
                                     (push args stmt)))
                                     ;(= wrap_style (check_needs_wrap stmt))
                                     ;(cond 
                                     ;    (== wrap_style 1)
                                     ;    (push args [ { `ctype: "AsyncFunction" } "await" " " "(" "async" " " "function" " " "()" "{" (splice_in_return stmt) "}" ")" "()" ])
                                     ;    (== wrap_style 2)
                                     ;    (push args [ { `ctype: "AsyncFunction" } "await" " " "(" "async" " " "function" " " "()" stmt ")" "()" ])
                                     ;    else
                                     ;    (push args stmt))
                                     ;(inline_log "compiled arg: <-" (last args))))
                              (when (verbosity)
                                    (inline_log "args: " args))
                              (if (prop Environment.inlines tokens.0.name)
                                  (do 
                                      (= inline_fn (prop Environment.inlines tokens.0.name))
                                      (= rval (inline_fn
                                                    args)))
                                  (throw ReferenceError (+ "no source for named lib function " tokens.0.name)))
                              
                              ;(= rval (flatten rval))
                              ;(inline_log "<-" rval)
                              rval)))
                             
       
       (`compile_push (fn (tokens ctx)
                          (let
                              ((`acc [])
                               (`place (compile_elem tokens.1 ctx))
                               (`thing (compile_elem tokens.2 ctx)))
                            [ place ".push" "(" thing ")"])))
       
       
       (`compile_list 
         (fn (tokens ctx)
             (let
                 ((`acc ["["])
                  (`compiled_values []))
                  
               (for_each (`t (-> tokens `slice 1))
                  (push compiled_values (wrap_assignment_value (compile t ctx))))
               
               (push_as_arg_list acc compiled_values)
               (push acc "]")
               acc)))
       (`compile_typeof
         (fn (tokens ctx)
             (do 
                 ;(log "compile_typeof: " (clone tokens))
                 (if (== tokens.1.type "arg")
                     ["typeof" " " tokens.1.name ]
                     ["typeof" " " (compile_elem tokens.1 ctx) ]))))
       (`compile_instanceof 
         (fn (tokens ctx)
             (let
                 ((`acc []))
               ;(log "compile_instanceof: -> " tokens)
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
                                  (`ctx (new_ctx ctx))
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
                               (set_ctx ctx
                                        `__COMP_INFIX_OPS__
                                        true)
                               ;(log "compile_compare: " operator left right)
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
                                     (`target (sanitize_js_ref_name 
                                              (cond
                                                token.ref
                                                token.name
                                                else
                                                (throw Error (+ "assignment: invalid target: " token.name)))))
                                     (`target_details (get_declaration_details ctx target))
                                     (`target_location_compile_time (cond
                                                                      target_details.is_argument
                                                                      "local"
                                                                      target_details.declared_global
                                                                      "global"
                                                                      else
                                                                      "local")))
                                  
                                  ;(log "compile_assignment: -> " tokens)
                                  ;(log "compile_assignment: target_details: " target_details)
                                  ;(log "compile_assignment: " assignment_operator target "location:" target_location_compile_time)
                                  
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
                                         ;(console.warn "compile_assignment: undeclared assignment type: " target)
                                         (set_ambiguous ctx target)
                                         (= assignment_type
                                            UnknownType)))
                                              
                                           
                                  ;(log "compile_assignment: target is: " target " type: " assignment_type " value: " (clone assignment_value))
                                  (= assignment_value (wrap_assignment_value assignment_value))
                                   
                                   
                                  
                                  ;(set_ctx ctx
                                   ;        target
                                    ;       assignment_value)
                                  
                                  ;(push acc (if (== (get_ctx_val ctx "__LAMBDA_STEP__") 0)
                                   ;              { `mark: "final-return" }
                                    ;            (return_marker)))
                                  
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
                                  ;(log "compile_assignment: <-" acc)
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
                                 
                                 (cond 
                                   (eq nil final_stmt)
                                   (do
                                    false)
                                   (and (not (is_array? final_stmt))
                                        (not (== "}" final_stmt)))
                                   true
                                        
                                   else
                                   (do
                                    ;(map (fn (stmt idx)
                                     ;        (clog "idx:" idx " stmt ->" stmt))
                                      ;   stmts)
                                    (= flattened (flatten final_stmt))
                                     ;(clog "first flattened:" (first flattened) (sub_type flattened) )
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
                                     
                                     ;(clog "inst: " inst (not (contains? (first flattened) ["__BREAK__FLAG__" "let" "{" "if" "return" "throw"])) (join "" flattened))
                                     
                                    (cond
                                       (and inst
                                            (== inst.ctype "objliteral"))
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
                                        ;(clog "- returning true")
                                        true)))))
                               false)))
                           
       ;; In the top-level mode, if the form is a progn form, each of its body forms is sequentially processed
       ;; as a top level form in the same processing mode.  Otherwise, they are compiled as, and evaluated as a
       ;; unit in a lambda.  
       (`top_level_log (defclog { `prefix: "top-level" `color: `darkgreen `background: "#300010" } ))
       (`compile_toplevel 
                       (fn (lisp_tree ctx block_options)
                           (if (get_ctx_val ctx `__IN_LAMBDA__)
                               (throw EvalError "Compiler attempt to compile top-level in lambda (most likely a bug)")
                               (do
                                 (let
                                     ((`idx 0)
                                      (`rval nil)
                                      (`tokens nil)
                                      (`stmt nil)
                                      (`num_non_return_statements (- (length lisp_tree) 2))
                                      (`ctx (if block_options.no_scope_boundary
                                                ctx
                                                (new_ctx ctx))))
                                     (while (< idx num_non_return_statements)
                                        (do
                                          (inc idx)
                                          ;; since we have the source lisp tree, first tokenize each statement and 
                                          ;; then compile and then evaluate it.
                                          (if (verbosity ctx)
                                              (progn
						(console.log "")
						(top_level_log (+ "" idx "/" num_non_return_statements) "->" (as_lisp (prop lisp_tree idx)))))
                                          (= tokens (tokenize (prop lisp_tree idx) ctx))
                                          
                                          (= stmt (compile tokens ctx))
                                          
                                          
                                             
                                          (= rval (wrap_and_run stmt ctx { `bind_mode: true }))
                                          (when (verbosity ctx)
					      (top_level_log (+ "" idx "/" num_non_return_statements) "compiled <- " (as_lisp stmt))
					      (top_level_log (+ "" idx "/" num_non_return_statements) "<-" (as_lisp rval)))					  
                                          ))
                                   ;; return the last statement for standard compilation.
				   
                                   (prop lisp_tree (+ idx 1)))))))
       (`compile_block (fn (tokens ctx block_options)
                           (let
                               ((`acc [])
                                (`block_id (or (and block_options.name
                                                    (+ block_options.name (inc blk_counter)))
                                               (inc blk_counter)))
                                (`clog (if quiet_mode
                                           log
                                           (defclog { `prefix: (+ "compile_block (" block_id "):") 
                                             `background: "#404080" `color: "white"})))
                                (`ctx (if block_options.no_scope_boundary
                                          ctx
                                          (new_ctx ctx))) ;; get a local reference
                                (`token nil)
                                (`last_stmt nil)
                                (`return_last ctx.return_last_value)
                                (`stmt nil)
                                (`stmt_ctype nil)
                                (`lambda_block false)
                                (`stmts [])
                                (`idx 0))
                             (when (eq nil ctx)
                                   (throw ReferenceError "undefined ctx passed to compile block"))
                             (when tokens.1.source
                               (set_prop ctx
                                         `source
                                         tokens.1.source))
                             
                             (set_prop ctx
                                       `block_id
                                       block_id)
                            
                             (when (== (get_ctx_val ctx `__LAMBDA_STEP__) -1)
                                   (= lambda_block true)
                                   (setf_ctx ctx `__LAMBDA_STEP__
                                            (- tokens.length 1)))

                             (when (not block_options.no_scope_boundary)
                               (push acc "{"))
                               
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
                                            
                                      (when lambda_block
                                           (set_ctx ctx "__LAMBDA_STEP__" 
                                                    (- tokens.length 1 idx)))
                                                
                                      ;(clog "step start: lambda_step:" (get_ctx_val ctx `__LAMBDA_STEP__) "source:" token.source)
                                      (if (and (== token.type "arr")
                                               (== token.val.0.name "return"))
                                          (do 
                                        ;(clog "return_point:" ctx.return_point idx "..compiling a return")
                                        ;(push acc { `comment: (+ "return: block_id: " (or ctx.block_id "") "  block_step: " ctx.block_step ) })      

                                           (push stmts (compile_return token.val ctx))
                                           (= stmt []))
                                          (do 
                                           ;(clog "compiling standard token -> " token)
                                           
                                           (if (and (== token.val.0.name "declare")
                                                    block_options.ignore_declarations)
                                                (= stmt { `ignored: "declare" } )
                                                (= stmt (compile token ctx)))))
                                      
                                      (cond 
                                        (and (== stmt.0 break_out)
                                             (== stmt.1 "=")
                                             (== stmt.2 "true"))
                                        (do
                                         ;(clog "return_point: " ctx.return_point "block_step:" ctx.block_step  "break out:" stmt)
                                         ;; essentially no op
                                         true)
                                        
                                        else
                                        true) ;; disabled due to return issue
                                        
                                      ;(clog "in block:<-" stmt)
                                      (assert (not (== stmt undefined)) "compile_block: returned stmt is undefined")
                                      (= stmt_ctype (and (> ctx.block_step 0)
                                                         (is_object? (first stmt))
                                                         (prop (first stmt) `ctype)))
                                                 
                                      (cond 
                                        (== stmt_ctype "no_return")
                                        (push stmts stmt); do nothing... 
                                        (== stmt_ctype "AsyncFunction")
                                        (do 
                                            ;(push stmts "await")
                                            ;(push stmts " ")
                                            ;(clog "async function: [adding potential return marker] " stmt)
                                             (push stmts { `mark: "block<-async" })
                                            (push stmts stmt))
                                        (== stmt_ctype "block")
                                        (do 
                                            ;(push stmts { `mark: "wrap-block" })
                                            (push stmts (wrap_assignment_value stmt)))
                                        else
                                        (do 
                                            (push stmts { `mark: "standard" })
                                            (push stmts stmt)))
                                      (when (< idx (- tokens.length 1))
                                        (push stmts ";"))))
                                    
                             ;; Now depending on the last value in the stmts array, insert a return
                             ;(clog "compile_block: suppress_return set: " ctx.suppress_return "if block:" (get_ctx_val ctx `__IF_BLOCK__))
                             (cond (and (not block_options.suppress_return)
                                        (not ctx.suppress_return)
                                        
                                        (or (needs_return? stmts ctx)
                                            ;(not (get_ctx_val ctx `__IF_BLOCK__))
                                            (and (> idx 1)
                                                  (needs_return? stmts ctx))))
                                (do
                                  ;(clog  "needs return statement: block_step:" ctx.block_step)
                                   
                                   
                                   (= last_stmt (pop stmts))
                                   ;(clog "block_step:" ctx.block_step "last stmt: " (clone last_stmt))
                                   ; TODO - 
                                   (when (not (== last_stmt.0.mark "no_return"))
                                     (push stmts
                                           { `mark: "final-return" `if_id: (get_ctx_val ctx `__IF_BLOCK__) `block_step: ctx.block_step `lambda_step: (get_ctx_val ctx `__LAMBDA_STEP__) } )
                                   ;(push stmts
                                    ;     "return")
                                      (push stmts " "))
                                   (push stmts last_stmt))
                               
                                (or (needs_return? stmts ctx)
                                    (and (> idx 1)
                                         (needs_return? stmts ctx)))
                                (do
                                   (= last_stmt (pop stmts))
                                   ;(clog "block_step:" ctx.block_step "last stmt: " (clone last_stmt))
                                   ; TODO -
                                   (push stmts
                                         { `mark: "block-end"  `if_id: (get_ctx_val ctx `__IF_BLOCK__) `block_step: ctx.block_step `lambda_step: (get_ctx_val ctx `__LAMBDA_STEP__)} )
                                   (push stmts " ")
                                   (push stmts last_stmt)  
                                   ;(clog "HERE: block_step:" ctx.block_step "last stmt: " (last stmts))
                                    ))
                             
                                       
                             (push acc stmts)
                             (when (not block_options.no_scope_boundary)
                               (push acc "}"))
                             ;(clog "end: block_step: " ctx.block_step acc)
                             (prepend acc { `ctype: "block" } )
                             ;(clog "<-" (clone acc))
                             acc)))
       
       (`Expression (new Function "" "{ return \"expression\" }"))
       (`Statement (new Function "" "{ return \"statement\" }"))
       (`NilType (new Function "" "{ return \"nil\" }"))
       (`UnknownType (new Function "" " { return \"unknown\"} "))
       (`ArgumentType (new Function "" " { return \"argument\" }"))
       (`compile_defvar (fn (tokens ctx )
                            (let
                                ((`target (clean_quoted_reference (sanitize_js_ref_name tokens.1.name)))
                                 (`wrap_as_function? nil)
                                 (`ctx_details nil)
                                 (`assignment_type nil)
                                 (`check_needs_wrap 
                                   (fn (stmts)
                                       (let
                                           ((`fst (or (and (is_array? stmts)
							   (first stmts)
							   (is_object? (first stmts))
							   (prop (first stmts) `ctype)
							   (cond
							     (is_string? (prop (first stmts) `ctype))
							     (prop (first stmts) `ctype)
							     else
							     (sub_type (prop (first stmts) `ctype))))
                                                      "")))
                                         ;(log "compile_defvar: check_needs_return: " fst (sub_type fst))
                                         (cond
                                           (contains? "block" fst)
                                           true
                                           else
                                           false))))
                                 (`assignment_value nil))
                              
                              ;(log "compile_defvar: ->" tokens)
                              (= assignment_value
                                 (do 
                                  (compile tokens.2 ctx)))
                              ;(log "compile_defvar: compile returned:" assignment_value)
                              ;(= wrap_as_function? (check_needs_wrap assignment_value))
                              
                              ;(log "compile_defvar: target: " target "wrap?" wrap_as_function? "assignment:" assignment_value)
                              
                              (= ctx_details (get_declaration_details ctx target))
                              (= assignment_type (+ {} ctx_details
                                                    (get_declarations ctx target)))
                              
                              ;(console.log "compile_defvar: assignment_type:" assignment_type "is a function?" (is_function? assignment_type.value))
                              (cond 
                                 (and (is_array? assignment_value)
                                      (is_object? assignment_value.0)
                                       assignment_value.0.ctype)
                                  (do 
                                   (set_ctx ctx
                                            target
                                            (map_ctype_to_value assignment_value.0.ctype assignment_value))
                                            
                                   (= assignment_value (wrap_assignment_value assignment_value)))
                                   
                                  (is_function? assignment_type.value)
                                  (set_ctx ctx
                                           target
                                           assignment_type.value)
                                  else
                                  (set_ctx ctx
                                           target
                                           assignment_value))
                              ;(log "compile_defvar: assignment_value: " assignment_value)
                              (if ctx.defvar_eval
                                  (do
                                    (delete_prop ctx
                                                 `defvar_eval)
                                    [{ `ctype: "assignment"  } "let" " " target "=" assignment_value "()" ";"])
                                  
                                  [ { `ctype: "assignment"  } 
                                    (if (and ctx_details.is_argument
                                             (==  ctx_details.levels_up 1))
                                         ""
                                         "let ") 
                                  "" target "=" (list assignment_value) ";"]))))
       ;; checks to see what has been declared during compilation and returns where
       ;; it only checks for declarations that have occurred during the compile phase
       
       (`get_declaration_details (fn (ctx symname _levels_up)                         
                                     (cond 
                                       (and (prop ctx.scope symname)
                                            (prop ctx `lambda_scope))
                                       {   
                                           `name: symname 
                                           `is_argument: true 
                                           `levels_up: (or _levels_up 0) 
                                           ;`declarations: (get_declarations ctx symname)
                                           `value: (prop ctx.scope symname)
                                           `declared_global: (if (prop root_ctx.defined_lisp_globals symname) true false) }
                                   
                                       (prop ctx.scope symname)
                                       {   
                                           `name: symname 
                                           `is_argument: false 
                                           `levels_up: (or _levels_up 0) 
                                           `value: (prop ctx.scope symname) 
                                           `declarations: (get_declarations ctx symname)
                                           `declared_global: (if (prop root_ctx.defined_lisp_globals symname) true false) }
                                       
                                       (and (eq (prop ctx `parent) nil)
                                            (prop root_ctx.defined_lisp_globals symname))
                                       {   
                                           `name: symname 
                                           `is_argument: false 
                                           `levels_up: (or _levels_up 0) 
                                           `value: (prop ctx.scope symname)
                                           `declarations: (get_declarations ctx symname)
                                           `declared_global: true }
                                   
                                       ctx.parent
                                       (get_declaration_details ctx.parent symname (or (and _levels_up (+ _levels_up 1)) 1))
                                       
                                       (not (== NOT_FOUND_THING (-> Environment `get_global symname NOT_FOUND_THING)))
                                       { 
                                            `name: symname
                                            `is_argument: false
                                            `levels_up: (or _levels_up 0)
                                            `value: (-> Environment `get_global symname)
                                            ;`declarations: (get_declarations ctx symname)
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
                                        
                                     ;(log "wrap_assignment_value: check_needs_return: " fst (sub_type fst))
                                     (cond
                                       (== "ifblock" fst)
                                       [{`ctype: "AsyncFunction" } {`mark: "wrap_assignment_value"}  "await" " " "(" "async" " " "function" " " "()" " " "{" " " stmts " " "}" ")" "()" ]
                                       (contains? "block" fst)
                                       [{`ctype: "AsyncFunction" } {`mark: "wrap_assignment_value"} "await" " " "(" "async" " " "function" " " "()" " "  " " stmts " "  ")" "()" ]
                                       else
                                       stmts))))
       
        

       (`clean_quoted_reference 
                        (fn (name)
                            (cond
                              (and (is_string? name)
                                   (starts_with? "\"" name)
                                   (ends_with? "\"" name))
                              (-> (-> name `substr 1)
                                  `substr 0 (- (length name) 2))
                              else
                              name)))
                                 
        (`compile_let (fn (tokens ctx)
                         (let
                             ((`acc [])
                              (`ctx (new_ctx ctx))
                              (`clog (if quiet_mode
                                         log
                                         (defclog { `prefix: (+ "compile_let: " (or ctx.block_id "")) `background: "#B0A0F0" `color: "black"})))
                              (`token nil)
                              (`declarations_handled false)
                              (`assignment_value nil)
                              (`block_declarations {})
                              (`my_tokens tokens)
                              (`assignment_type nil)
                              (`stmt nil)
                              (`def_idx nil)
                              (`redefinitions {})  ;; maps symbols that are already defined in scope to tmp variables in a JS block...
                                                   ;; which are then redefined with local shadowing: ALREADY DEFINED SYMBOL->TEMP_SYMBOL
                              (`need_sub_block false)
                              (`assignments {})                     
                              (`reference_name nil)
                              (`shadowed_globals {})
                              (`alloc_set nil)
                              (`sub_block_count 0)
                              (`ctx_details nil)
                              (`structure_validation_rules [ [[1 `val] (list is_array?) "allocation section"]
                                                             [[2] (list (fn (v) (not (== v undefined)))) "block"]])
                              
                              (`validation_results nil)
                              (`allocations tokens.1.val)
                              (`block (-> tokens `slice 2))
                              (`syntax_error nil)
                              (`idx -1))
                           ;; validate the let structure if we have the functionality
                           
                           (compiler_syntax_validation `compile_let tokens errors ctx tree)
                                
                           ;(clog "->: " (prop tokens.1 `val))
                           (set_prop ctx
                                     `return_last_value
                                     true)
                           
                           ;; start the main block 
                           (push acc "{")
                           (inc sub_block_count)
                           
                           ;;(when ctx.source (push acc { `comment: (+ "let start " ctx.source " " ) }))
                           
                           ;; let must be two pass, because we need to know all the symbol names being defined in the 
                           ;; allocation block because let allows us to refer to symbol names out of order, similar to
                           ;; let* in Common Lisp.  
                           
                           ;(clog "block: " (clone block))
                           
                           ;; Check declaration details if they exist in the first form of the block form
                           
                           (when (== block.0.val.0.name "declare")
                              (= declarations_handled true)
                              (push acc (compile_declare block.0.val ctx)))
                              
                           ;; In let allocation forms, we need to check each allocated symbol's (AS) assignment
                           ;; form for the symbol name in enclosing scope, because any operations that are
                           ;; performed as part of the symbol value assignment are actually references to
                           ;; the previously allocated closure symbol (CS).  The local AS symbol will be assigned 
                           ;; the computed value of the assignment form and should shadow the CS.
                            
                           ;; However, in JS scope rules the right hand side is referencing AS 
                           ;; symbol, not the CS bound symbol, and so a Reference Error will occur.  Therefore
                           ;; we need a strategy for evaluating assignment value form with the CS, and then
                           ;; providing the value to the AS, which is just being allocated. 
                           ;; NOTE that this situation doesn't apply to function arguments enclosing the let block, 
                           ;; which are considered local to the allocaton, and not in a closure.  The compiler 
                           ;; doesn't reallocate those function arguments.
                            
                           ;; Approach:
                           ;; 1. We need to detect if the allocated symbol is already allocated in a closure,
                           ;;    but we don't care if it is a global symbol because these use dynamic 
                           ;;    lookup, (get_global), or if it is an enclosing function argument.  
                           ;; 2. If it is in the closure already, then we need allocate to a temp name
                           ;;    in a higher block { } and then introduce a new subblock where the AS
                           ;;    is actually allocated and assigned the value from the temp variable.
                           ;; 3. We will need to keep track of the number of subblocks we introduce in
                           ;;    the let to allow for shadowing because we will need to close them
                           ;;    after our let block as completed.
                           
                           ;; First pass: build symbols in context for the left hand side of the allocation forms
                           ;; set them to AsyncFunction, unless we have a declaration already for it 
                           ;; from declare...
                           
                           
                           (while (< idx (- allocations.length 1))
                              (do
                                  (inc idx)
                                  (= alloc_set (prop (prop allocations idx) `val))
                                  (= reference_name (clean_quoted_reference (sanitize_js_ref_name alloc_set.0.name)))
                                  
                                  (= ctx_details (get_declaration_details ctx reference_name))
                                  (when ctx_details
                                        ;(console.log "declaration details for: " reference_name (clone ctx_details))
                                        ;; already declared..
                                        (when (and (not ctx_details.is_argument)
                                                   (> ctx_details.levels_up 1))
                                              (= need_sub_block true)
                                              (if (prop redefinitions reference_name)
                                                  (push (prop redefinitions reference_name)
                                                        (gen_temp_name reference_name))
                                                  (set_prop redefinitions
                                                            reference_name
                                                            [0 (gen_temp_name reference_name)]))
                                              (when (and ctx_details.declared_global
                                                         (not ctx_details.is_argument))
                                                  (set_prop shadowed_globals
                                                            alloc_set.0.name
                                                            true))))
                                                   
                                              
                                            
                                              
                                  ;; if it isn't an argument to a potential parent lambda, set the ctx 
                                  (when (not ctx_details.is_argument)
                                   ;; set a placeholder for the reference
                                      (set_ctx ctx
                                               reference_name 
                                               AsyncFunction)))) ;; assume callable for recursion

                                  
                           ;; reset our index to the top of the allocation list
                           (= idx -1)
                           
                           ;; build all the right hand side allocations.  When the allocation value is to be
                           ;; assigned to a shadowed symbol in local scope, we need to make a function in an
                           ;; enclosing block that can be called in the right order to assign the value to the 
                           ;; shadowed variable.  By putting the function in an enclosing scope, we can access
                           ;; the CS value.
                           
                           (while (< idx (- allocations.length 1))
                                  (do
                                    (inc idx)
                                    (= stmt [])
                                    (= alloc_set (prop (prop allocations idx) `val))
                                    
                                    (= reference_name (clean_quoted_reference (sanitize_js_ref_name alloc_set.0.name)))
                                    (= ctx_details (get_declaration_details ctx reference_name))
                                    ;(console.log "compiling:" reference_name " ctx_details:" ctx_details)
                                    
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
                                      
                                      ;; local shadow of a globally declared variable
                                      (and (is_string? alloc_set.1.name)
                                           (prop Environment.context.scope alloc_set.1.name)
                                           (not ctx_details.is_argument)
                                           (prop shadowed_globals alloc_set.0.name))
                                                  
                                      (do
                                          (= assignment_value [{`ctype: ctx_details.value } "await" " " "Environment.get_global" "(" "\"" alloc_set.0.name "\"" ")" ]))
                                      else
                                      (do 
                                       ;(clog "compiling simple assignment value for " reference_name  ": " alloc_set.1)
                                       (= assignment_value (compile alloc_set.1 ctx))
                                       
                                       ;(clog "setting simple assignment value for" reference_name ": <- " (clone assignment_value))
                                       ))
                                   
                                    
                                    
                                    (cond 
                                       (and (is_array? assignment_value)
                                            (is_object? assignment_value.0)
                                              assignment_value.0.ctype)
                                        (do 
                                           (set_ctx ctx
                                                    reference_name
                                                    (map_ctype_to_value assignment_value.0.ctype assignment_value)))
                                        (and (is_array? assignment_value)
                                             (is_array? assignment_value.0)
                                             assignment_value.0.0.ctype)
                                        (do 
                                           (set_ctx ctx
                                                    reference_name
                                                    (map_ctype_to_value assignment_value.0.0.ctype assignment_value))) 
                                        else 
                                         (do 
                                             ;(push warnings (+ "undeclared type assignment:" reference_name))
                                             (set_ctx ctx
                                                      reference_name
                                                      assignment_value)))
                                           
                                           
                                     (= assignment_value (wrap_assignment_value assignment_value))
                                     (when ctx_details.is_argument
                                           (set_prop block_declarations
                                                     reference_name
                                                     true)) ;; if this is an argument to this function, we don't want to redeclare it below or we will error..
                                     (= def_idx nil)            
                                     (cond
                                         (and (prop redefinitions reference_name)
                                              (first (prop redefinitions reference_name)))
                                         (do 
                                             (= def_idx (first (prop redefinitions reference_name)))
                                             (inc def_idx)
                                             (set_prop (prop redefinitions reference_name)
                                                       0
                                                       def_idx)
                                                  
                                             (for_each (`t ["let" " " (prop (prop redefinitions reference_name) def_idx) "=" " " "async" " " "function" "()" "{" "return" " " assignment_value "}" ";"])
                                                (push acc t)))
                                         ;; if the name isn't shadowing declare it, so it can be used if referenced by others
                                         (not (prop block_declarations reference_name))
                                         (do 
                                             (for_each (`t ["let" " " reference_name ";" ])
                                                (push acc t))
                                             (set_prop block_declarations reference_name true)))
                                     (when (not (prop assignments reference_name))
                                           (set_prop assignments
                                                     reference_name
                                                     []))
                                     (push (prop assignments
                                                  reference_name) 
                                           (if def_idx
                                               ["await" " " (prop (prop redefinitions reference_name) def_idx) "()" ";" ]
                                               assignment_value))))
                                           
                           (when need_sub_block                    
                               (for_each (`pset (pairs redefinitions))
                                 (do
                                   (for_each (`redef pset.1)
                                     (take (prop redefinitions pset.0))))))
                                 
                           ;(clog "redefinitions: " (clone redefinitions))     
                           (when need_sub_block
                             (push acc "{")
                             (inc sub_block_count))
                         
                           (= idx -1)
                           (while (< idx (- allocations.length 1))
                                (do
                                    (inc idx)
                                    (= def_idx nil)
                                    
                                    (= stmt [])
                                    (= alloc_set (prop (prop allocations idx) `val)) 
                                    (= reference_name (clean_quoted_reference (sanitize_js_ref_name alloc_set.0.name)))
                                    (= ctx_details (get_declaration_details ctx reference_name))
                                    ;(clog "assignments: " reference_name (clone (prop assignments reference_name)) (clone assignments))
                                    (= assignment_value (take (prop assignments reference_name)))
                                    
                                    ;(clog "set declaration for " reference_name "is arg?" ctx_details " already declared?" (prop block_declarations reference_name) " assignment value: " (clone assignment_value))
                                    
                                    ;(= assignment_type ctx_details.value)
                                    ;(clog "assignment: " reference_name "->" assignment_type "ctx_details: " (clone ctx_details))
                                    ;; test for whether or now we need to declare it without getting in trouble with JS
                                    (cond
                                       (prop block_declarations reference_name)
                                       true    ;; already declared in the above block or in this block
                                       else
                                       (do 
                                         (push stmt "let")   ;; depending on block status, this may be let for a scoped {}
                                         (push stmt " ")))
                                    (push stmt reference_name)
                                    (set_prop block_declarations reference_name true) ;; mark that we have already declared so that if it is redeclared we don't try and declare in JS again
                                    (push stmt "=")
                                    (push stmt assignment_value)
                                    (push stmt ";")
                                    
                                    (push acc stmt))) ;/*LET*/")))
                           ;(clog "assignments complete:" (clone acc))
                           (push acc (compile_block (conj ["PLACEHOLDER"]
                                                          block)
                                                    ctx
                                                    {
                                                    `no_scope_boundary: true
                                                    `ignore_declarations: declarations_handled
                                                    }))
                           (for_each (`i (range sub_block_count))
                            (push acc "}"))
                           ;(clog "return_point: " ctx.return_point)
                           ;(clog "<-" (clone acc))
                           ;(console.log "compile_let: <-" acc)
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
                          
                          (set_ctx ctx
                                   `__IN_LAMBDA__
                                   true)
                          (set_ctx ctx
                                   `__LAMBDA_STEP__
                                   -1)   ;; define the lambda step here as -1, when hit the first block, set it to the countdown to 0
                          (set_prop ctx
                                    `lambda_scope
                                    true)
                          (set_prop ctx
                                    `suppress_return false)
                          (cond 
                             fn_opts.synchronous
                             (do
                               (= type_mark (type_marker `Function))
                               (push acc type_mark))
                             fn_opts.arrow
                             (do
                               (= type_mark (type_marker `Function))
                               (push acc type_mark))
                             fn_opts.generator
                             (do
                                 (= type_mark (type_marker `GeneratorFunction))
                                 (push acc type_mark)
                                 (push acc "async")
                                 (push acc " "))
                             else
                              (do
                               (= type_mark (type_marker `AsyncFunction))  
                               (push acc type_mark)
                                (push acc "async")
                                (push acc " ")))  ;; async by default
                          ;(fn_log "->" tokens)
                          (set_prop type_mark
                                    `args
                                    [])       
                          (cond 
                            fn_opts.arrow
                            false
                            fn_opts.generator
                            (push acc "function*")
                            else
                            (push acc "function"))
                          (push acc "(")
                          (while (< idx (- fn_args.length 1))
                                 (do
                                  (inc idx)
                                  (= arg (prop fn_args idx))
                                   ;(fn_log "argument: " arg)                                  
                                   (if (== arg.name "&")
                                       (do
                                         (inc idx)
                                         (= arg (prop fn_args idx))
                                         (when (eq nil arg)
                                           (throw SyntaxError "Missing argument symbol after &"))
                                         ;(log "compile_fn: & rest args: " arg)  
                                         (set_ctx ctx
                                                  arg.name
                                                  ArgumentType)
                                         (set_prop arg
                                                   `name 
                                                   (+ "..." arg.name)))
                                       (do
                                         (set_ctx ctx
                                                  arg.name
                                                  ArgumentType)))
                                   (push acc
                                         (sanitize_js_ref_name arg.name))
                                   (push type_mark.args  ;; add to our type marker details
                                         (sanitize_js_ref_name arg.name))
                                   (when (< idx (- fn_args.length 1))
                                     (push acc ","))))
                          (push acc ")")
                          (push acc " ")
                          (when fn_opts.arrow
                                (push acc "=>"))
                          ;(fn_log "body: is_block?" (is_block? body.val) body)
                          (if fn_opts.generator
                              (set_prop ctx
                                    `return_last_value
                                    false)
                              (set_prop ctx
                                    `return_last_value
                                    true))
                          
                          (cond 
                            (== body.val.0.name `let)
                            (do 
                             ;(fn_log "let block: " body.val)
                             ;(push acc { `mark: "rval" })
                             (push acc (compile body.val
                                                ctx
                                                )))
                            (== body.val.0.name `do)
                            (do 
                             ;(fn_log "do block: " body.val)
                             (push acc (compile_block body.val
                                                      ctx
                                                      )))
                            
                            else  ;; make a pseudo-block
                            (do 
                             ;(fn_log "making pseudo-block: " body)
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
                              ;(fn_log "nbody: " nbody)
                              (push acc { `mark: "nbody" } )
                              (push acc (compile_block nbody
                                                       ctx
                                                       ))))
                          
                              
                         ;(fn_log "<-" (clone acc))
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
                                                  ArgumentType)
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
                                 ;(console.log "compile_jslambda: " acc)
                                 ;(log "compile_jslambda: <-" (flatten acc))
                                  acc)))
                                   
                                        
        
       (`compile_yield (fn (tokens ctx)
                           (let
                               ((`acc [{`mark: "no_return" }])
                                (`expr nil))
                               (push acc "yield")
                               (push acc " ")
                               (= expr
                                 (do 
                                  (compile tokens.1 ctx)))
                               (push acc (wrap_assignment_value expr))
                               (push acc ";")
                               acc)))
                         
       (`var_counter 0)
       ;; the complicated form conversions
       (`gen_temp_name (fn (arg)
                           (+ "__" (or arg "") "__" (inc var_counter))))
       
       (`if_id 0)
       
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
                  
                  (`ctx (new_ctx ctx))    ;; we are in a function wrapper
                  (`inject_return false)
                  (`block_stmts nil)
                  
                  (`needs_braces? false)
                  (`check_needs_return 
                    (fn (stmts)
                        (do
                         (= fst (+ "" (or (and (is_array? stmts)
                                                           (first stmts)
                                                           (is_object? (first stmts))
                                                           (prop (first stmts) `ctype)
                                                           (cond
                                                               (is_string? (prop (first stmts) `ctype))
                                                               (prop (first stmts) `ctype)
                                                               else
                                                               (sub_type (prop (first stmts) `ctype))))
                                                      "")))
                         ;(cond_log "check_needs_return: " fst (sub_type fst))
                          (cond
                            (== fst "ifblock")
                            (do
                                ;(cond_log "check_needs_return: is an ifblock which needs braces!")
                                (= needs_braces? true)
                                false)
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
              (compiler_syntax_validation `compile_cond tokens errors ctx tree)
               ;(cond_log "->" condition_tokens)
               ;(console.log "compile_cond: " (clone tokens))
               (cond 
                 (not (== (% condition_tokens.length 2) 0))
                 (throw SyntaxError "cond: Invalid syntax: missing condition block")
                 (== condition_tokens.length 0)
                 (throw SyntaxError "cond: Invalid syntax: no conditions provided"))
               (set_ctx ctx
                        `__LAMBDA_STEP__
                         -1)
               (while (< idx condition_tokens.length)
                      (do
                       (= inject_return false)
                       (= condition (prop condition_tokens idx))
                        (inc idx)
                        (= condition_block (prop condition_tokens idx))
                       ; (cond_log idx (get_ctx_val ctx `__LAMBDA_STEP__)  "condition:" condition)
                        ;(cond_log idx (get_ctx_val ctx `__LAMBDA_STEP__) "  c block:" condition_block)
                        
                        (when (> idx 2)
                          (push acc " ")
                          (push acc "else")
                          (push acc " "))
                        (when (not (== condition.name "else"))
                          (push acc {`ctype: "ifblock" `stype:"cond" } )
                          (push acc "if")
                          (push acc " ")
                          (push acc "("))
                        
                        
                        (cond 
                          (is_form? condition)
                          (do 
                            (= stmts (compile condition ctx))
                            ;(cond_log "<- condition (form): " stmts)
                            (push acc "check_true")
                            (push acc "(")
                            (push acc " ")
                            (push acc stmts)
                            (push acc ")"))
                          (== condition.name "else")
                          true
                          ;(cond_log "else block")
                          else 
                          (do 
                            (= stmts (compile condition ctx))
                            (push acc "check_true")
                            ;(cond_log "<- condition (not form): " stmts)
                            (push acc "(")
                            (push acc stmts)
                            (push acc ")")))
                        (when (not (== condition.name "else"))
                          (push acc ")"))
                        (push acc " ")
                        ;; now compile the conditions
                        ;(set_ctx ctx
                         ;    `__LAMBDA_STEP__
                          ;   -1)
                        (= stmts (compile condition_block ctx))
                        ;(cond_log "<-condition block" stmts)
                        (when (check_needs_return stmts)
                          (= inject_return true)) ; true
                        ;(cond_log "cond block needs return?" inject_return  "needs braces?" needs_braces?)
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
                             ;(cond_log "compile_cond: simple condition_block")
                             (push acc stmts)))
                        (when needs_braces?
                          (push acc "}"))
                        ;(cond_log "compile_cond: acc: " acc)
                        (inc idx)))
               
               acc)))
       
       
       (`compile_if (fn (tokens ctx)
                        (let
                            ((`acc [])
                             (`stmts nil)
                             (`fst nil)
                             (`if_id (inc if_id))
                             (`if_log (if opts.quiet_mode
                                          log
                                          (defclog { `prefix: (+ "compile_if (" if_id ")") `background: "#10A0A0" `color: `white })))  
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
                                                           (prop (first stmts) `ctype)
                                                           (cond
                                                               (is_string? (prop (first stmts) `ctype))
                                                               (prop (first stmts) `ctype)
                                                               else
                                                               (sub_type (prop (first stmts) `ctype))))
                                                      "")))
                                    ;(if_log "check_needs_return: " fst (sub_type fst))
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
                                        ;(if_log "end of block-> block_step 0, return_point < 3")
                                        (= needs_braces? true)
                                        false)  ;;true
                                       (and (== ctx.block_step 0)
                                            (> ctx.return_point 2))
                                       (do 
                                        ;(if_log "end of block-> block_step 0, return_point > 2")
                                        (= needs_braces? true)
                                        false) ;; true
                                       (> ctx.block_step 0)
                                       (do 
                                        (= needs_braces? true)
                                        false)
                                       else
                                       (do 
                                        ;(if_log "check_needs_return: " ctx.block_step  "defaulting to true")
                                        (= needs_braces? true)
                                        false))))))   ;; true
                          (if (== ctx.block_step undefined)
                              (set_prop ctx
                                        `block_step
                                        0))
                          ;(if_log "start: block_id: " ctx.block_id "block_step:" ctx.block_step "__LAMBDA_STEP__:" (and ctx (get_ctx_val ctx "__LAMBDA_STEP__")) tokens)
                          (when (eq nil ctx)
                                (throw ReferenceError "undefined/nil ctx passed to compile_if"))
                          ;(if_log "test_form: " test_form.source test_form)
                          ;(if_log "if_true: " if_true.source if_true)
                          ;(if_log "if_false: " if_false.source if_false)
                                        ;(if (not ctx.return_point)
                          (push acc { `ctype: "ifblock" })
                          
                          ;(if_log "starting test compilation")
                          (= compiled_test (compile_elem test_form ctx))
                          ;(if_log "test compilation complete")
                          (set_ctx ctx
                                     `__IF_BLOCK__
                                     if_id)
                          (when (> ctx.block_step 0)
                            
                            (set_prop ctx
                                      `suppress_return
                                      true))
                         ; (if_log "compiled_test:" compiled_test)
                                        ;(push acc (+ "/* if start: block_id: " ctx.block_id " block_step: " ctx.block_step " */"))
                          (if (and (is_object? (first compiled_test))
                                   (prop (first compiled_test) `ctype)
                                   (is_string? (prop (first compiled_test) `ctype))
                                   (contains? "unction" (prop (first compiled_test) `ctype)))
                              (for_each (`t ["if" " " "(check_true (" "await" " " compiled_test "()" "))"])
                                        (push acc t))
                              (for_each (`t ["if" " " "(check_true ("  compiled_test "))"])
                                        (push acc t)))
                          
                          ;(if_log "starting compile if true: " (clone if_true))
                          (= compiled_true (compile if_true ctx))
                          ;(if_log "if true compilation complete: " (clone compiled_true))
                          (= inject_return (check_needs_return compiled_true))
                          
                         ; (if_log "if_true <- __LAMBDA_STEP__: " (get_ctx_val ctx "__LAMBDA_STEP__") "stmt:" (clone compiled_true))
                          
                          (when needs_braces?
                            (push acc "{")
                            (push acc " "))
                          (push acc (if (and false (== (get_ctx_val ctx "__LAMBDA_STEP__") 0)
                                             (== ctx.block_step 0))
                                        { `mark: "final-return" `if_id: if_id }
                                        { `mark: `rval `if_id: if_id `block_step: ctx.block_step `lambda_step: (Math.max 0 (get_ctx_val ctx "__LAMBDA_STEP__"))}))
                          (when inject_return
                            (push acc "return")
                            (push acc " "))
                          (push acc compiled_true)
                          (when needs_braces?
                            (push acc "}"))
                          (when if_false
                            ;(if_log "starting compile false: " (clone if_false))
                            (= compiled_false (compile if_false ctx))
                            ;(if_log "if false compilation complete: " (clone compiled_false))
                            (= inject_return (check_needs_return compiled_false))
                            ;(if_log "if_false <-  __LAMBDA_STEP__: " (get_ctx_val ctx "__LAMBDA_STEP__") "stmt:" (clone compiled_false))
                            (push acc " " )
                            (push acc "else")
                            (push acc " ")
                            (when needs_braces?
                              (push acc "{")
                              (push acc " "))
                            (push acc (if (and false (== (get_ctx_val ctx "__LAMBDA_STEP__") 0))
                                          { `mark: "final-return" }
                                          { `mark: `rval `if_id: if_id `block_step: ctx.block_step `lambda_step: (Math.max 0 (get_ctx_val ctx "__LAMBDA_STEP__"))} ))
                            (when inject_return
                              (push acc "return")
                              (push acc " "))
                            (push acc compiled_false)
                            (when needs_braces?
                              (push acc "}")))
                          
                          (set_ctx ctx
                                     `__IF_BLOCK__
                                     undefined)
                          ;(if_log "<-" (clone acc))
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
                                  ;(cwrap_log "compile_wrapper_fn: tokens: block?" (is_block? tokens) "form?" (is_form? tokens) tokens)
                                  (cond
                                    (and (is_object? tokens)
                                         (not (is_array? tokens))
                                         (not (== tokens.type "arr")))
                                    (do 
                                     (= needs_await false)
                                     ;(cwrap_log "compile_wrapper_fn: simple form - just compiling")
                                      (= acc [(compile tokens ctx)]))
                                    
                                    (is_block? tokens)
                                    (do
                                     ;(cwrap_log "compile_wrapper_fn: wrapping block in anon func" tokens)
                                     (= ctx (new_ctx ctx))
                                      (set_prop ctx
                                                `return_point
                                                1)
                                      (= acc ["(" "async" " " "function" "()" "{" (compile tokens ctx) "}" ")""()"]))
                                    (and (is_object? tokens)
                                         (== tokens.val.0.name "if"))
                                    (do 
                                     (= ctx (new_ctx ctx))
                                     (set_prop ctx
                                      `return_point
                                      1)
                                      (for_each (`t ["(" "async" " " "function" "()" "{" (compile_if tokens.val ctx) "}" ")" "()" ])
                                                (push acc t)))
                                    (is_array? tokens)
                                    (do
                                     ;(cwrap_log "compile_wrapper_fn: tokens is array:" tokens)
                                     (= acc (compile_block_to_anon_fn tokens ctx)))
                                    (and (is_object? tokens)
                                         tokens.val
                                         (== tokens.type "arr"))
                                    (do 
                                     
                                     (= acc (compile_block_to_anon_fn tokens.val ctx))))
                                  ;(cwrap_log "compile_wrapper_fn: <- " (join "" (flatten acc)))
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
                                        ;(log "compile_block_to_anon_fn: tokens: block?" (is_block? tokens) "return_point: " ctx.return_point tokens)
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
                                            (for_each (`t ["(" "async" " " "function" "()" (compile_block tokens ctx) ")" "()" ])
                                                      (push acc t)))
                                          (== tokens.0.name "let")
                                          (do 
                                           (set_prop ctx
                                                     `return_last_value
                                                     true)
                                           (set_prop ctx
                                            `return_point
                                            0)
                                            (for_each (`t ["(" "async" " " "function" "()" (compile tokens ctx) ")" "()"])
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
                                        ;(log "compile_block_to_anon_fn: <-" (flatten acc))
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
                              (`target_type (clean_quoted_reference (sanitize_js_ref_name tokens.1.name)))
                              (`comps (get_object_path target_type))
                              (`type_details (get_declaration_details ctx target_type))
                              (`root_type_details (if (> comps.length 1)
                                                      (get_declaration_details ctx comps.0)
                                                      nil))
                              (`target_return_type nil)
                              (`new_arg_name nil)
                              (`args [])
                              (`ctx (new_ctx ctx))
                              
                              (`new_opts (-> tokens `slice 2)))
                           (when (> comps.length 1)
                              (= target_type (path_to_js_syntax comps)))
                          
                           ;(log "compile_new: target_type: " target_type comps)
                           ;(log "compile_new: type details: " type_details)
                           ;(when (> comps.length 1)
                           ;      (log "compile_new: root type details: " root_type_details))
                             
                           (for_each (`opt_token (or new_opts []))
                                     (do
                                      ;(log "compile_new: option_token:" opt_token)
                                      (push args (wrap_assignment_value (compile opt_token ctx)))))
                                      
                           ;(log "compile_new: args: " args)
                           
                           (cond
                               (and (not (eq nil type_details.value))
                                    (is_function? type_details.value))
                               (do
                                   (for_each (`arg ["new" " " target_type "("])
                                             (push acc arg))
                                   (push_as_arg_list acc args)
                                   (push acc ")"))
                               (and (eq nil type_details.value)
                                    (not (eq nil root_type_details.value)))
                               (do
                                   (for_each (`arg ["(" "await" " " "Environment.get_global" "(" "\"" "indirect_new" "\"" ")" ")" "(" target_type ])
                                       (push acc arg))
                                   (when (> args.length 0)
                                       (push acc ",")
                                       (push_as_arg_list acc args))
                                   (push acc ")")))
                               
                           (= target_return_type
                               (or (get_ctx_val ctx target_type)
                                   (prop (or (get_declarations ctx target_type) {})
                                         `type)
                                   (get_outside_global target_type)
                                   UnknownType))
                                   
                                   
                               
                           (prepend acc
                                    { `ctype: target_return_type })
                           ;(log "compile_new: <-" (clone acc))
                           acc)))
       
       
       (`compile_val_mod (fn (tokens ctx)
                             (let
                                 ((`target_location (cond 
                                                      (get_ctx ctx tokens.1.name)
                                                      "local"
                                                      (get_lisp_ctx tokens.1.name)
                                                      "global"))
                                  (`target tokens.1.name)
                                  (`in_infix (get_ctx_val ctx "__COMP_INFIX_OPS__"))
                                  (`operation (if in_infix
                                                  (cond
                                                    (== tokens.0.name "inc")
                                                    "+"
                                                    (== tokens.0.name "dec")
                                                    "-"
                                                    else
                                                    (throw (+ "Invalid value modification operator: " tokens.0.name)))
                                                  (cond
                                                         
                                                    (and (== target_location "local")
                                                         (== tokens.0.name "inc"))
                                                    "+="
                                                    (and (== target_location "local")
                                                         (== tokens.0.name "dec"))
                                                    "-="
                                                    (== tokens.0.name "inc")
                                                    "+"
                                                    else
                                                    "-")))
                                  (`mod_source nil)
                                  (`how_much (or (and tokens.2
                                                      (compile tokens.2 ctx)) 
                                                 1)))
                               ;(log "compile_val_mod: " target operation target_location tokens)
                               (cond 
                                  (== target_location "global")
                                  (do
                                    (= has_lisp_globals true)
                                    (= mod_source (+ "(" operation " " target " " how_much ")"))
                                    ["await" " " "Environment.set_global(\"" target "\","
                                     (compile (tokenize (read_lisp mod_source)
                                                        ctx)
                                              ctx) ")"])
                                  
                                  in_infix
                                  (do 
                                     ["(" target "=" target operation how_much ")"])
                                 
                                  else
                                   [target operation how_much]))))                       
       
       (`try_log (if opts.quiet_mode
                     log
                     (defclog { `prefix: "compile_try"  `background: "violet" `color: `black })))                           
       (`compile_try (fn (tokens ctx)
                         [ { `ctype: "AsyncFunction" } "await" " " "(" "async" " " "function" "()" "{"  (compile_try_inner tokens ctx) "}" ")" "()" ]))
       
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
                         (= fst (+ "" (or (and (is_array? stmts)
                                                           (first stmts)
                                                           (is_object? (first stmts))
                                                           (prop (first stmts) `ctype)
                                                           (cond
                                                               (is_string? (prop (first stmts) `ctype))
                                                               (prop (first stmts) `ctype)
                                                               else
                                                               (sub_type (prop (first stmts) `ctype))))
                                                      "")))
                         ;(try_log "check_needs_return: " fst (sub_type fst))
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
               ;(try_log "->" tokens)
               ;(try_log "__LAMBDA_STEP__:" (get_ctx_val ctx "__LAMBDA_STEP__")
               ;                          "try block:"  try_block)
               ;(try_log "catches: " catches)
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
               
               (if (and stmts.0.ctype
                        (or (== stmts.0.ctype AsyncFunction)
                            (== stmts.0.ctype Function)))
                    (prepend stmts "await"))
                
               ;(try_log "compiled try block: " (clone stmts))
               ;(try_log "try block at lambda step: " (get_ctx_val ctx "__LAMBDA_STEP__") "needs braces?" needs_braces?)
              ;(if insert_return?
               ;    (= stmts (splice_in_return stmts)))
               (if (is_complex? try_block)
                                        ;(contains? try_block.0.name ["do" "progn" "let"])
                                        ;(== try_block.1.type "arr"))
                   
                   (for_each (`t ["try" " " "/* TRY COMPLEX */ "   stmts " " ])
                             (push acc t))
                   (for_each (`t ["try" " " "/* TRY SIMPLE */ " "{" " "  (if (== (get_ctx_val ctx "__LAMBDA_STEP__") 0)
                                                                             { `mark: "final-return"  }
                                                                             { `mark: "rval" })  stmts " " "}"])
                             (push acc t)))
               ;(try_log "compiled try:" (clone acc))
               (while (< idx catches.length)
                      (do 
                       (= catch_block (prop (prop catches idx) `val))
                       ;(try_log "catch block tokens:" catch_block)
                        ;(try_log "catch block:" catch_block.3)
                        (set_ctx ctx
                                 catch_block.2.val.0.name
                                 (new catch_block.1.name))
                        (= stmts (compile catch_block.3 ctx))
                        (= insert_return? (check_needs_return stmts))
                                        ;(= stmts (compile_block_to_anon_fn catch_block.3.val ctx))
                        ;(try_log "compiled catch block:" stmts)
                        ;(try_log "block needs return?" insert_return? "needs_braces?" needs_braces?)
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
               
               
               
               ;(try_log "<-"  (clone acc))
               acc
               )))
       
      
                              
       (`compile_throw (fn (tokens ctx)
                           (let
                               ((`acc [])
                                (`error_message nil)
                                (`mode 1)
                                (`error_instance nil))
                             ;(log "compile_throw: tokens:" tokens)
                             (cond
                               (and (is_array? tokens)
                                    (== tokens.length 2)
                                    tokens.1.ref)
                               (do 
                                   (= mode 0)
                                   (= error_instance (compile tokens.1 ctx)))
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
                           
                             (if (== mode 0)
                                 (for_each (`t [ "throw" " " error_instance ";" ])
                                    (push acc t))
                                 (for_each (`t [ "throw" " " "new" " " error_instance "(" error_message ")" ";"])
                                           (push acc t)))
                                       
                             ;(log "compile_throw: <-" (join "" (flatten acc)))
                             acc)))
       
       
       (`compile_break (fn (tokens ctx)
                           [break_out "=" "true" ";" "return"]))
       (`compile_return (fn (tokens ctx)
                            (let
                                ((`acc [])
                                 (`return_val_reference (gen_temp_name "return"))
                                 (`return_value nil))
                              ;(log "compile_return:" "block?" (is_block? tokens.1.val) ctx)
                              (push acc
                                    { `mark: "forced_return" })
                              (if (is_block? tokens.1.val)
                                  (do
                                   (for_each (`t ["let" " " return_val_reference "=" (compile tokens.1.val ctx) ";" "return" " " return_val_reference ";"])
                                             (push acc t)))
                                  (do 
                                   (for_each (`t [ "return" " " (compile tokens.1 ctx) ";" ])
                                             (push acc t))))
                              
                              ;(log "compile_return: " acc)
                              
                              acc)))
       (`apply_log (if opts.quiet_mode
                       log
                       (defclog { `prefix: "compile_apply" `background: "sienna" `color: "white" })))
       (`compile_apply (fn (tokens ctx)
                           (let
                               ((`acc [])
                                (`fn_ref tokens.1)
                                (`complex? false)
                                (`args_ref (gen_temp_name "apply_args"))
                                (`function_ref (gen_temp_name "apply_fn"))
                                (`target_argument_ref nil)
                                (`target_arg nil)
                                (`ctype nil)
                                (`preceding_arg_ref nil)
                                (`requires_await false)
                                (`compiled_fun_resolver nil)
                                (`args (-> tokens `slice 2)))
                             (when (and args (== args.length 1))
                               (= args (first args)))
                             ;(apply_log " -> " tokens)
                             ;(apply_log "function:" (clone fn_ref) "args:" (clone args))
                             (= function_ref (compile fn_ref ctx))
                             ;(apply_log "compiled function:" (clone function_ref))
                             (when fn_ref.ref
                                 (= ctype (get_declaration_details ctx fn_ref.name)))
                             ;(apply_log "function type: " ctype)
                             (when (is_function? ctype.value)
                                 (= requires_await true))
                             ;(apply_log "compile_apply: function_ref: " (clone function_ref))
                             (= function_ref (wrap_assignment_value function_ref))
                             ;(apply_log "compile_apply: compiled: function: " (clone function_ref))
                             ;; now handle the arguments 
                             ;; Dlisp allows for multiple arguments to apply, with the last argument must be an array.
                             ;; In this case, we are going to need to unshift the preceding arguments into the final argument (which must be an array)
                             
                             (if (is_array? args)
                                 (do           
                                  ;(apply_log "args is_array?" args)
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
                                                   (for_each (`t [ "let" " " preceding_arg_ref "=" (wrap_assignment_value (compile token.val ctx)) ";" ])
                                                             (push acc t)))
                                                  (= preceding_arg_ref (wrap_assignment_value (compile token ctx))))
                                               (push acc
                                                     [ target_argument_ref ".unshift" "(" preceding_arg_ref ")" ";" ])))
                                   ;; now we have our arguments placed into the front of the final array 
                                   ;; now call the functions apply method and return it
                                   (for_each (`t ["return" " "  "(" function_ref ")" "." "apply" "(" "this" "," target_argument_ref ")"])
                                             (push acc t)))
                                 
                                 
                                 ;; otherwise - just one arg (which presumably is an array) and so just construct the JS statement
                                 (do
                                     ;(apply_log "args is not an array - just one arg")
                                  (if (is_form? args)
                                      (do 
                                       (for_each (`t [ "let" " " args_ref "=" (wrap_assignment_value (compile args.val ctx)) ";" ])
                                                 (push acc t))
                                       (= complex? true)))
                                  ;(apply_log "arguments <- " (clone acc))
                                   (for_each (`t [ "return" " " "(" " " function_ref ")" "." "apply" "(" "this" ])
                                             (push acc t))
                                   (when args
                                     (push acc ",")
                                     (if complex?
                                         (push acc args_ref)
                                         (push acc (wrap_assignment_value (compile args ctx)))))
                                   (push acc ")")))
                             ;(apply_log "<-" ["(" "async" " " "function" "()" "{" (clone acc) "}" ")" "()"])
                             ;(apply_log "<-" ["(" "async" " " "function" "()" "{" (clone acc) "}" ")" "()"])
                             ["await" " " "(" "async" " " "function" "()" "{" acc "}" ")" "()"])))
       
       (`compile_call (fn (tokens ctx)
                          (let
                              ((`simple_target? (if (== tokens.1.ref true)
                                                    true
                                                    false))
                               (`simple_method? (if (== tokens.2.type "literal")
                                                    true
                                                    false)))
                             ;(console.log "compile_call: simple_target: " simple_target? "simple_method?" simple_method?)
                             (cond
                                 (and simple_target?
                                      simple_method?)
                                 (compile_call_inner tokens ctx { `type: 0 })
                                 simple_target?
                                 (compile_call_inner tokens ctx { `type: 0 })
                                 else
                                 [{ `ctype: "AsyncFunction"} "await" " " "(" "async" " " "function" "()" " " "{" 
                                             (compile_call_inner tokens ctx { `type: 2 })
                                             " " "}" ")" "()" ]))))
       (`compile_call_inner (fn (tokens ctx opts)
                          (let
                              ((`acc [])
                               (`target nil)
                               (`idx -1)
                               (`add_args (fn ()
                                              (for_each (`token (-> tokens `slice 3))
                                                (do
                                                 (push acc ",")
                                                 (push acc (wrap_assignment_value (compile token ctx)))))))
                               (`method nil))
                            ;(log "compile_call: " tokens)
                            (when (< tokens.length 3)
                              (throw SyntaxError (+ "call: missing arguments, requires at least 2")))
                            ;(console.log "compile_call: ->" (clone tokens))
                            
                            (= target (wrap_assignment_value (compile tokens.1 ctx)))
                            (= method (wrap_assignment_value (compile tokens.2 ctx)))
                            
                            ;(console.log "compile_call: target: " target)
                            ;(console.log "compile_call: method: " method)
                            (cond 
                                (or (== opts.type 0)
                                    (== opts.type 1))
                                (do
                                    (cond 
                                          (== tokens.length 3)
                                          (for_each (`t ["await" " " target "[" method "]" "()"])
                                            (push acc t))
                                          else
                                          (do 
                                              (for_each (`t ["await" " " target "[" method "]" ".call" "(" target ])
                                                 (push acc t))
                                              (add_args)
                                              (push acc ")"))))
                                (== opts.type 2)
                                (do 
                                    (for_each (`t ["{" " " "let" " " "__call_target__" "="  target "," " " "__call_method__" "=" method ";" ])
                                        (push acc t))
                                    (cond
                                      (== tokens.length 3)
                                      (for_each (`t [ "return" " " "await" " " "__call_target__"  "[" "__call_method__" "]" "()"])
                                                (push acc t))
                                      else
                                      (do 
                                       (for_each (`t [ "return" " " "await" " " "__call_target__"   "[" "__call_method__" "]" "." "call" "(" "__call_target__"])
                                                 (push acc t))
                                        (add_args)
                                        (push acc ")")))
                            
                           
                                    (push acc "}")))
                            ;(log "compile_call: <-" (join "" (flatten acc)))
                            acc)))
       
       
       (`check_needs_wrap (fn (stmts)
                              (let
                                  ((`fst (or (and (is_array? stmts)
						  (first stmts)
						  (is_object? (first stmts))
						  (not (is_function? (prop (first stmts) `ctype)))
						  (prop (first stmts) `ctype)
						  (cond
						    (is_string? (prop (first stmts) `ctype))
						    (prop (first stmts) `ctype)
						    else
						    (sub_type (prop (first stmts) `ctype))))
                                                   "")))
                                ;(log "check_needs_wrap: fst:" stmts)
                               ; (log "check_needs_wrap: fst:" fst)
                                
                                (cond
                                  (contains? "block" fst)
                                  true
                                  else
                                  false))))
       
       ;; Import code from export...
       
       (`compile_import 
            (fn (tokens ctx)
                (let
                    ((`symbol_tokens tokens.1)
                     (`symbols [])
                     (`from_tokens nil)
                     (`from_place nil)
                     (`acc []))
                 (= symbol_tokens tokens.1)
                 (= from_tokens tokens.2)
                 (console.log "compile_import: ->" (clone tokens))
                 (push acc { `ctype: "statement" })
                 (push acc "import")
                 (push acc " ")
                 
                 (= from_place (compile from_tokens ctx))
                 
                 (console.log "compile_import: compiled symbols:    " symbols)
                 (console.log "compile_import: compiled from place: " from_place)
                 (cond
                     (is_array? symbol_tokens.val )
                     (do
                         (for_each (`s symbol_tokens.val)
                            (push symbols (compile s ctx)))      
                         (for_each (`t (flatten ["{" " " symbols " " "}" " " "from" " " from_place ]))
                            (push acc t))))
                     
                (console.log "compile_import: <- " (clone acc))
                acc)))
       
       (`compile_javascript
           (fn (tokens ctx)
               (let
                   ((`acc [])
                    (`text nil))
                   (for_each (`t (or (rest tokens) []))
                     (do 
                         (cond
                             t.ref
                             (push acc t.name)
                             (is_array? t.val)
                             (push acc (compile t ctx))
                             else
                             (push acc t.val))))
                acc)))
       ;; (dynamic_import source_location)   
       
       (`compile_dynamic_import 
            (fn (tokens ctx)
                (let
                    ((`from_tokens nil)
                     (`from_place nil)
                     (`acc []))
                 (= from_tokens tokens.1)
                 ;(console.log "compile_dynamic_import: ->" (clone tokens))
                 (push acc { `ctype: "statement" })
                 (= from_place (compile from_tokens ctx))
                 ;(console.log "compile_import: compiled from place: " from_place)
                 (for_each (`t (flatten ["await" " " "import" " " "(" from_place ")"]))
                    (push acc t))
                ;(console.log "compile_import: <- " (clone acc))
                acc)))
                     
       (`compile_set_global 
         (fn (tokens ctx)
             (let
                 ((`target tokens.1.name)
                  (`wrap_as_function? nil)
                  (`acc nil)
                  (`clog (if opts.quiet_mode
                             log
                             (defclog { `prefix: "compile_set_global" `color: `blue `background: "#205020" })))
                  (`metavalue nil)
                  (`assignment_value nil))
               (= has_lisp_globals true) ; ensure that we are passed the environment for this assembly       
               ;(clog "->" tokens)
               ;(clog "setting up global reference for: " target)
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
                   (compile tokens.2 ctx)))
               
               (= wrap_as_function? (check_needs_wrap assignment_value))
               (cond 
                   (and (is_object? assignment_value.0)
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
                                assignment_value.0.ctype))		    
                    (when wrap_as_function?
                      (= assignment_value [ "await" " " "(" "async" " " "function" " " "()" assignment_value ")" "()" ])))
                   
                   else
                   (do 
                       (if (and (is_array? assignment_value)
                                (== assignment_value.0 "await"))
                           (set_prop root_ctx.defined_lisp_globals
                                     target
                                     AsyncFunction)
                           (set_prop root_ctx.defined_lisp_globals
                                     target
                                     assignment_value))))
               
               (when (verbosity ctx)
		 (clog "target: " (as_lisp target))
		 (clog "assignment_value: " (as_lisp assignment_value)))
                 
               (= acc [{ `ctype: "statement" } (if (== Function (prop root_ctx.defined_lisp_globals target))
                                                   ""
                                                   "await") 
                                               " " "Environment" "." "set_global" "(" """\"" tokens.1.name "\"" "," assignment_value (if metavalue "," "") (if metavalue metavalue "") ")" ])
               
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
                             ;(log "compile_quote: " (JSON.stringify lisp_struct))
                             ;(console.log "compile_quote" (clone lisp_struct))
                             (set_prop ctx
                                       `hard_quote_mode
                                       true)
                             (= acc (compile_quotem lisp_struct ctx))
                             acc)))
       
       (`compile_quotel (fn (lisp_struct ctx)
                           (let
                               ((`acc []))
                             (= acc (JSON.stringify lisp_struct.1))
                             [acc])))
       
       
       
       (`wrap_and_run (fn (js_code ctx run_opts)
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
                                  (when (is_function? fst)
                                        (= fst (sub_type fst)))
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
                                
                               (`assembled nil))
                            (= assembled (splice_in_return_b (splice_in_return_a js_code)))
                            (= assembled (assemble_output assembled))
                           
                            (= assembled (+ (if needs_braces? "{" "")
                                            (if needs_return? " return " "")
                                            assembled
                                            (if needs_braces? "}" "")))
                          
                            (= assembly (new AsyncFunction "Environment" assembled))
                            (when run_opts.bind_mode
                                (= assembly (bind_function assembly Environment)))
                            (= result (assembly Environment))
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
                                            ;(follow_log "check_return_tree: " fst " returning: " (sub_type rval) (clone rval))
                                            rval)))
                            (`result nil)
                            (`subacc [])
                            (`ntree nil))
                         ;(follow_log "->" (clone tree))
                         (when (eq nil ctx)
                               (throw ReferenceError "follow_tree received nil/undefined ctx"))
                         (cond
                           (is_array? tree)
                           (do
                            (= tlength tree.length)
                            ;(follow_log "array with " tlength "elements")
                            (while (< idx tlength)
                             (do 
                              (= tval (prop tree idx))
                              ;(follow_log "in_lambda:" (get_ctx_val ctx `__IN_LAMBDA__) "idx: " idx "tval:" (clone tval) (== tval (quote "=$,@")))
                               (cond 
                                 (== tval (quote "=$,@"))                                     
                                 (do
                                  (inc idx)
                                  (= tval (prop tree idx))
                                  ;(follow_log "splice operation: idx now:" idx  "tval:" (clone tval))
                                   
                                   ;; the theory of the splice
                                   
                                   ;; in quotem mode, if a ,@ is encountered, whatever thing that follows it or members of thing
                                   ;; become elements in the current list at the position of the ,@ symbol ( "=$,@" in JSON).
                                   ;; This is implemented by serializing the JSON into lisp text and embedding it in a call to
                                   ;; to the reader, where when the piece of code is activated, it is rehydrated as JSON and then
                                   ;; compiled in the present environment top level context.  
                                   
                                   
                                   
                                   (if (not (eq undefined tval))
                                       (do 
                                        (if (get_ctx_val ctx `__IN_LAMBDA__)
                                            (do 
                                             (= ntree [])
                                             (if (is_object? tval)
                                                 (do
                                                  (= tmp_name (gen_temp_name "tval"))
                                                  
                                                  (for_each (`t (flatten (embed_compiled_quote 0 tmp_name tval)))
                                                   (push ntree t)))
                                                 
                                                 (do 
                                                     (for_each (`t (flatten (embed_compiled_quote 1 tmp_name tval)))
                                                           (push subacc t))))
                                              ;(follow_log "splice operation: subacc: " (clone subacc) (as_lisp subacc))
                                              (if (is_object? tval)
                                                  (do 
                                                   (push ntree (embed_compiled_quote 4))
                                                   (= ntree (compile (tokenize tval ctx) ctx))
                                                   (= ntree (check_return_tree ntree))
                                                    ;(follow_log "spliced: <-" ntree)
                                                    
                                                    (= ntree (wrap_and_run ntree ctx)))
                                                  (do
                                                      ;(follow_log "not compiling, tval is simple value:" (clone tval))
                                                      )))
                                            
                                            
                                            (do 
                                             ;(follow_log "not in lambda: tokenizing, compiling: " (clone tval))
                                             (= ntree (compile (tokenize tval ctx) ctx))
                                             (= ntree (check_return_tree ntree))
                                             
                                             (when (is_object? ntree)
                                                 (= ntree (wrap_and_run ntree ctx)))))
                                        

                                        (= subacc (-> subacc `concat ntree)))
                                       (throw SyntaxError "invalid splice operator position")))
                                 (and (not ctx.hard_quote_mode)
                                      (or (== tval (quote "=:##"))
                                          (== tval (quote "=:unquotem"))))
                                
                                 (do
                                  (inc idx)
                                  (= tval (prop tree idx))
                                  ;(follow_log "insert-operation (non-splice): idx now:" idx  "tval:" (clone tval))
                                   (if (not (eq undefined tval))
                                       (do 
                                        (if (get_ctx_val ctx `__IN_LAMBDA__)
                                            (do
                                             ;(follow_log "in_lambda: non splice: " tval )   
                                             (= ntree [])
                                              (if (is_object? tval)
                                                  (do
                                                   (= tmp_name (gen_temp_name "tval"))
                                                  
                                                   (for_each (`t (flatten (embed_compiled_quote 2 tmp_name tval)))
                                                    (push ntree t)))
                                                  
                                                  (for_each (`t (flatten (embed_compiled_quote 3 tmp_name tval)))
                                                            (push ntree t)))
                                              

                                              (when (is_object? tval)
                                                (push ntree (embed_compiled_quote 4))
                                                ;(follow_log "to compile: " (clone tval) (as_lisp tval) "ctx:" (clone ctx))
                                                
                                                (= ntree (compile (tokenize tval ctx) ctx))
                                                ;(follow_log "compiled ntree: " ntree)
                                                ;(follow_log "evaluating: " (clone ntree) (clone ctx))
                                                (= ntree (wrap_and_run ntree ctx)))
            ;(push subacc ntree) ;; this is original
                                              (= subacc (-> subacc `concat ntree)))
                                              ;(follow_log "subacc: " (JSON.stringify subacc) (as_lisp subacc)))
                                              
                                            
                                            (do 
                                              ;(follow_log "not in lambda: non splice: compiling: " tval)
                                              (= ntree (compile (tokenize tval ctx) ctx))
                                             
                                              (= ntree (check_return_tree ntree))
                                              ;(follow_log "post compile:" ntree)
                                              (= ntree (wrap_and_run ntree ctx))
                                             ; (follow_log "evaled: " (clone ntree))
                                              
                                              (push subacc ntree))))
                                       (throw SyntaxError "invalid unquotem operator position")))
                                 else
                                 (do 
                                     ;(follow_log "calling follow_tree: " tval)
                                     (= tval (follow_tree tval ctx))
                                     ;(follow_log "pushing to subacc: " tval)
                                     (push subacc tval)))
                               (inc idx)))
                             ;(follow_log "<-" (clone subacc))
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
                              ;(quotem_log " ->" (JSON.stringify lisp_struct))
                              (if (contains? lisp_struct.1 [ (+ "=" ":" "(") (+ "=" ":" ")") (+ "=" ":" "'") (+ "=" ":") ])
                                  (+ "\"" lisp_struct.1 "\"")
                                  (do
                                     (= pcm (follow_tree lisp_struct.1 ctx))
                                     ;(quotem_log "post follow_tree: " (clone pcm))
                                     (cond
                                       (is_string? pcm)
                                       (do 
                                          (for_each (`t [ (+ "`" pcm "`") ])
                                             (push acc t)))
                                       (is_number? pcm)
                                       (push acc pcm)
                                       (or (== pcm false) (== pcm true))
                                       (push acc pcm)
                                       else
                                       (do 
                                          (= encoded (-> Environment `as_lisp pcm))
                                          (= encoded (add_escape_encoding encoded))
                                          (for_each (`t ["await" " " "Environment.do_deferred_splice" "(" "await" " " "Environment.read_lisp" "(" "'" encoded "'" ")" ")"]) ;; add_escape_encoding was here surrounding (lisp_writer ..)
                                              (push acc t))))
                                      ;(quotem_log "<-  " (join "" acc))
                                      acc)))))
       
       
       (`unq_log (if opts.quiet_mode
                     log
                     (defclog {`prefix: "compile_unquotem" `background: "#505060" `color: "white" } )))
       (`compile_unquotem (fn (lisp_struct ctx)
                              (let
                                  ((`acc []))
                                ;(unq_log "->" lisp_struct)
                                (push acc 
                                      (compile lisp_struct.1 ctx))
                                ;(unq_log "<-" acc)
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
               
               ;(evalq_log "lisp ->" lisp_struct)
               ;(evalq_log "is_array?" is_arr? "ctx:" ctx)
               ;(console.log "compile_evalq ->" lisp_struct)
               (= tokens (if is_arr?
                             (tokenize lisp_struct.1  ctx )
                             (pop (tokenize [ lisp_struct.1 ] ctx))))
               ;; tokenize the argument
               ;(evalq_log "tokenized: " tokens)
               
               (= acc [(compile tokens ctx) ]) ;; pass the current ctx in
               (when is_arr? 
                 (= acc ["async" " " "function" "()" ["{" "return" " " acc "}"]]))
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
               ;(eval_log "->" (clone tokens))
               ;(console.log "compile_eval: -> " (clone tokens))
               ;(eval_log "to compile:" tokens.1.val)
               (= assembly (compile tokens.1.val ctx))
               (when (verbosity ctx)
		 (eval_log "assembly:" (clone assembly)))
               ;(console.log "compile_eval: assembly:" assembly)
               (= has_lisp_globals true)
               (= result [ "Environment" "." "eval" "(" "await" " "  "async" " " "function" "()" ["{" "return" " " assembly "}" "()"    ")" ]])
	       
               result)))
       
       (`compile_debug (fn (tokens ctx)
                           [{ `ctype: "statement" } "debugger" ";"]))
       (`compile_for_each
         (fn (tokens ctx)
             [{ `ctype: "AsyncFunction"} "await" " " "(" "async" " " "function" "()" " " "{" 
             (compile_for_each_inner tokens ctx)
             " " "}" ")" "()" ]))
       (`compile_for_each_inner 
         (fn (tokens ctx)
             (let
                 ((`acc [])
                  (`idx 0)
                  (`stmts [])
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
               ;(log "compile_for_each: tokens: " tokens)
               ;(log "compile_for_each: # of iters: " iter_count)
               ;(log "compile_for_each: args: " for_args)
               ;(log "compile_for_each: elements: " elements)
               ;(log "for_body: body is block?" (is_block? for_body) for_body)
               (when (< iter_count 1)
                 
                 (throw SyntaxError "Invalid for_each arguments"))
               
               (for_each (`iter_idx (range iter_count))
                         (do
                          (push idx_iters (prop for_args iter_idx))
                          (set_ctx ctx
                           (clean_quoted_reference (prop (last idx_iters) `name))
                           ArgumentType)))
               
               ;(log "compile_for_each: idx_iters: " idx_iters)
               (set_ctx ctx collector_ref ArgumentType)
                                        ;(when for_args.1.ref
                                        ;     (set_ctx ctx for_args.1.name ArgumentType))
               (set_ctx ctx element_list "arg")
               (when (not body_is_block?)
                 ;; we need to make it a block for our function
                 (= for_body (make_do_block for_body)))
                 
               (= prebuild (build_fn_with_assignment body_function_ref
                                                     for_body.val
                                                     idx_iters))
               
                                        ; [iterator_ref]))
               (set_prop ctx
                         `return_last_value
                         true)
               ;(log "for_each prebuild tokens:" prebuild)
               
               
               (push acc (compile prebuild ctx))
               ;(log "for_each: prebuild:" (clone (last acc)))
               (for_each (`t ["let" " " collector_ref "=" "[]" "," element_list "=" (wrap_assignment_value (compile elements ctx)) ";" ])
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
               ;(log "compile_for_each <-" acc)
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
               ;(log "compile_while: tokens: " tokens)
               ;(log "compile_while: test_condition: " test_condition.source)
               (set_ctx ctx
                        break_out
                        true)
               ;(push acc
                ;     (+ "/* while: block_id: " ctx.block_id  " block_step:" ctx.block_step " */"))    
               (if test_condition.ref
                   (push prebuild (compile (build_fn_with_assignment test_condition_ref test_condition.name) ctx))
                   (push prebuild (compile (build_fn_with_assignment test_condition_ref test_condition.val) ctx)))
               ;(log "compile_while: test_condition:",(clone prebuild))
               (push prebuild (compile (build_fn_with_assignment body_ref body.val) ctx))
               (for_each (`t [ "let" " " break_out "=" "false" ";"])
                         (push prebuild t))
               (for_each (`t [ "while" "(" "await" " " test_condition_ref "()" ")" " " "{"  "await" " " body_ref "()" ";" " " "if" "(" break_out ")" " " "{" " " "break" ";" "}" "}" " " "" ";"])
                         (push prebuild t))
               (for_each (`t [ "await" " " "(" "async" " " "function" "()" "{" " " prebuild "}" ")" "()" ])
                         (push acc t))
               ;(log "compile_while: prebuild: " prebuild)
               ;(log "compile_while: <-" (clone acc))
               acc)))
           
       (`compile_for_with
         (fn (tokens ctx)
             [{ `ctype: "AsyncFunction"} "await" " " "(" "async" " " "function" "()" " " "{" 
             (compile_for_with_inner tokens ctx)
             " " "}" ")" "()" ]))
       (`compile_for_with_inner 
         (fn (tokens ctx)
             (let
                 ((`acc [])
                  (`idx 0)
                  (`stmts [])
                  (`ctx (new_ctx ctx))
                  (`iter_ref (gen_temp_name "iter"))
                  (`idx_iters [])
                  (`generator_expression (gen_temp_name "elements"))
                  (`body_function_ref (gen_temp_name "for_body"))
                  
                  
                  (`prebuild [])
                  (`for_args tokens.1.val)
                  (`iterator_ref for_args.0) 
                  (`elements (last for_args))
                  (`iter_count (if for_args
                                   (- for_args.length 1)
                                   0))
                  (`for_body tokens.2)
                  (`body_is_block? (is_block? for_body.val)))
               ;(log "compile_for_with: tokens: " tokens)
               ;(log "compile_for_with: # of iters: " iter_count)
               ;(log "compile_for_with: args: " for_args)
               ;(log "compile_for_with: elements: " elements)
               ;(log "for_body: body is block?" (is_block? for_body) for_body)
               (when (< iter_count 1)
                 
                 (throw SyntaxError "Invalid for_each arguments"))
               
               (for_each (`iter_ref (range iter_count))
                         (do
                          (push idx_iters (prop for_args iter_ref))
                          (set_ctx ctx
                           (clean_quoted_reference (prop (last idx_iters) `name))
                           ArgumentType)))
               
               ;(log "compile_for_with: idx_iters: " idx_iters)
               
                                        ;(when for_args.1.ref
                                        ;     (set_ctx ctx for_args.1.name ArgumentType))
               (set_ctx ctx generator_expression "arg")
               (when (not body_is_block?)
                 ;; we need to make it a block for our function
                 (= for_body (make_do_block for_body)))
                 
               (= prebuild (build_fn_with_assignment body_function_ref
                                                     for_body.val
                                                     idx_iters))
               
                                        ; [iterator_ref]))
               (set_prop ctx
                         `return_last_value
                         true)
               
               (push acc (compile prebuild ctx))
               
               ;(for_each (`t ["let" " " generator_expression "=" (wrap_assignment_value (compile elements ctx)) ";" ])
                ;         (push acc t))
               (for_each (`t [ "let" " " break_out "=" "false" ";"])
                         (push acc t))
               
               (set_ctx ctx body_function_ref AsyncFunction)
               ;; for the simplest, fastest scenario, one binding variable to the list
               (cond
                 (and (== for_args.length 2) ;; simplest (for_each (`i my_array) ...
                      (not (is_array? for_args.1)))
                 (do 
                  ;(set_ctx ctx idx_iter Number)
                  (for_each (`t ["for" " " "await" " " "(" "const" " "  iter_ref " " "of" " " (wrap_assignment_value (compile elements ctx)) ")" " " "{" ])
                   (push acc t))
                   
                   (for_each (`t [ "await" " " body_function_ref "(" iter_ref ")"  ";" ])
                             (push acc t))
                   (for_each (`t ["if" "(" break_out ")" " "  "break" ";"])
                             (push acc t))
                   
                   (push acc "}")))
               
               acc)))       

       ;; checking the compiler context is fairly expensive so unless verbosity is declared or set globally,
       ;; the verbosity function is set to silence.  After the initialization block, global verbosity is
       ;; checked, and if on, verbosity is set to check_verbosity.
       
       (`silence (fn ()
		     false))
       (`verbosity silence)
       (`check_verbosity (fn (ctx)
			     (or (get_ctx ctx "__VERBOSITY__")
				 (-> Environment `get_global "__VERBOSITY__"))))
                       
       (`declare_log (if opts.quiet_mode
                         log
                        (defclog { `prefix: "DECLARE" `color: "white" `background: "black" })))
       (`compile_declare (fn (tokens ctx)
                             (let
                                 ((`expressions (rest tokens))
                                  (`targeted nil)
                                  (`acc [])
                                  (`source nil)
                                  (`details nil)
                                  (`sanitized_name nil)
                                  (`declaration nil)
                                  (`dec_struct nil))
                                 ;(declare_log "->" (clone expressions))
                                 (for_each (`exp expressions)
                                    (do
                                        (= declaration exp.val.0.name)
                                        (= targeted (rest exp.val))
				      (when (verbosity ctx)
					(declare_log "declaration: " declaration "targeted: " (each targeted `name) targeted))
                                        (cond
                                            (== declaration "toplevel")
                                            (do
                                               (set_prop opts
                                                         `root_environment
                                                         targeted.0)
                                               (if opts.root_environment
                                                   (= env_ref "")
                                                   (= env_ref "Environment.")))
                                            (== declaration "include")
                                            (do 
                                               (for_each (`name (each targeted `name))
                                                 (do
                                                     (= sanitized_name (sanitize_js_ref_name name))
                                                     (= dec_struct (get_declaration_details ctx name))
                                                     ;(declare_log "current_declaration for " name ": " (if dec_struct.value (-> dec_struct.value `toString) "NOT FOUND") (clone dec_struct))
                                                     (when (and dec_struct)
                                                              ;(not (dec_struct.is_argument)))
                                                             ;; this is a global so we just produce a reference for this 
                                                             (for_each (`t [ "let" " " sanitized_name "=" ])
                                                                (push acc t))
                                                             (cond
                                                                 (and (is_function? dec_struct.value)
                                                                      (prop (prop Environment.definitions name)
                                                                            `fn_body))
                                                                 (do
                                                                     (= details (prop Environment.definitions name))
                                                                     (= source (+ "(fn " details.fn_args " " details.fn_body ")"))
                                                                     ;(declare_log "source: " source)
                                                                     (= source (compile (tokenize (read_lisp source) ctx) ctx 1000))
                                                                     ;(declare_log "compiled: " source)
                                                                     (push acc source)
                                                                     (set_ctx ctx name AsyncFunction))
                                                                 (is_function? dec_struct.value)
                                                                 (do 
                                                                     (push acc (-> (-> dec_struct.value `toString) `replace "\n" ""))
                                                                     (set_ctx ctx name AsyncFunction))
                                                                 else
                                                                 (do 
                                                                     (push acc (-> dec_struct.value `toString))
                                                                     (set_ctx ctx name ArgumentType))
                                                                     )
                                                              (push acc ";"))
                                                     (set_declaration ctx name `inlined true)
                                                     (if (and (== "undefined" (prop (get_declarations ctx name) `type))
                                                              (is_function? dec_struct.value))
                                                        (set_declaration ctx name `type Function)))))
                                            (== declaration "verbose")
                                            (do 
                                                (defvar `verbosity_level (parseInt (first (each targeted `name))))
                                                (if (not (isNaN verbosity_level))
                                                   (do
                                                    (if (> verbosity_level 0)
                                                        (set_ctx ctx "__VERBOSITY__" verbosity_level)
                                                        (do 
							 (declare_log "verbosity: turned off")
							 (= verbosity silence)
							 (set_ctx ctx "__VERBOSITY__" nil)))
						    (= verbosity check_verbosity)
                                                    (declare_log "compiler: verbosity set: " (verbosity ctx)))
                                                   (push warnings
                                                         "invalid verbosity declaration, expected number, received " (first (each targeted `name)))))
                                            (== declaration "local")
                                            (for_each (`name (each targeted `name))
                                                 (do
                                                     (= dec_struct (get_declaration_details ctx name))
                                                     ;(declare_log "local: declaration_details: " dec_struct)
                                                     (set_ctx ctx name dec_struct.value)))
                                            (== declaration "function")
                                            (do					      
                                               (for_each (`name (each targeted `name))
                                                  (set_declaration ctx name `type Function)))
                                            (== declaration "array")
                                            (do
                                               (for_each (`name (each targeted `name))
                                                  (set_declaration ctx name `type Array)))
                                            (== declaration "number")
                                            (do
                                               (for_each (`name (each targeted `name))
                                                  (set_declaration ctx name `type Number)))
                                            (== declaration "string")
                                            (do
                                               (for_each (`name (each targeted `name))
                                                  (set_declaration ctx name `type String)))
                                            (== declaration "boolean")
                                            (do
                                               (for_each (`name (each targeted `name))
                                                  (set_declaration ctx name `type Boolean)))
                                            (== declaration "regexp")
                                            (do
                                               (for_each (`name (each targeted `name))
                                                  (set_declaration ctx name `type RegExp)))
                                            (== declaration "object")
                                            (do
                                               (for_each (`name (each targeted `name))
                                                  (set_declaration ctx name `type Object)))
                                            (== declaration "optimize")
                                            (do 
                                                ;(declare_log "optimizations: " targeted)
                                                (for_each (`factor (each targeted `val))
                                                  (do 
                                                      ;(declare_log "optimization: " (each factor `name))
                                                      (= factor (each factor `name))
                                                      (cond
                                                          (== factor.0 "safety")
                                                          (set_declaration ctx "__SAFETY__" `level factor.1))
                                                      ;(declare_log "safety set: " (safety_level ctx))  
                                                      ))
                                                
                                                ))))
                                            
                                 ;(declare_log "<-" (clone acc))
                                 acc)))
       (`safety_level (fn (ctx)
                          (when ctx
                              (defvar `safety (get_declarations ctx "__SAFETY__"))
                              (if safety
                                  safety.level
                                  default_safety_level))))
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
                                             ;(sr_log "check_statement: needs wrap: " stmt.0.ctype stmt)
                                              ;; since we wrapped it in a function - make sure we have a 
                                              ;; return value established 
                                             
                                             (if (== stmt.0.ctype "ifblock")
                                                [{ `ctype: "AsyncFunction" } "await" " " "(" "async" " " "function" "()" " " "{" " " stmt " " "}" " " ")" "()"]
                                                [{ `ctype: "AsyncFunction" } "await" " " "(" "async" " " "function" "()" " " stmt " " ")" "()"]))
                                           
                                            stmt)))
                  (`token nil))
               ;(sr_log "->" (clone tokens))
               
               
               (cond 
                 (== call_type "lisp")
                 (= ref_type (get_lisp_ctx tokens.0.name))
                 (== call_type "local")
                 (= ref_type (get_ctx ctx tokens.0.name))
                 else
                 (= ref_type ArgumentType))
               (when (verbosity ctx)
                     (sr_log "where/what->" call_type "/" ref_type "for symbol: " tokens.0.name))
               (cond (== ref_type AsyncFunction)
                     (= ref_type "AsyncFunction")
                     (== ref_type Expression)
                     (= ref_type ArgumentType )
                     (== ref_type Function)
                     (= ref_type "Function")
                     (== ref_type Array)
                     (= ref_type "Array")
                     (== ref_type NilType)
                     (= ref_type "nil")
                     (== ref_type Number)
                     (= ref_type ArgumentType)
                     (== ref_type String)
                     (= ref_type "String")
                     (== ref_type ArgumentType)
                     true
                     else
                     (= ref_type (sub_type ref_type)))
               
               
               ;(sr_log "call_type: " call_type "decoded ref_type: " ref_type)
               ;(sr_log "call:" tokens.0.name (if (== "lisp" call_type) (get_lisp_ctx tokens.0.name) "local"))
               (= rval
                  (cond
                    (== ref_type "AsyncFunction")
                    (do
                     (push acc "await")
                     (push acc " ")
                      (push acc (if (== call_type `lisp)
                                    (compile_lisp_scoped_reference tokens.0.name ctx)
                                    tokens.0.name))
                      (push acc "(")
                      (while (< idx (- tokens.length 1))
                             (do
                              (inc idx)
                              (= token (prop tokens idx))
                               (= stmt (compile token ctx))
                               ;(sr_log "<- (AsyncFunction) compiled stmt: " stmt)
                               (= stmt (check_statement stmt))
                               (push acc stmt)
                               (when (< idx (- tokens.length 1))
                                 (push acc ","))))
                      (push acc ")")
                     acc)
                    (== ref_type "Function")
                    (do
                     (push acc "await")  ;; we don't know if the function returns a promise so we need to hedge our bets..
                     (push acc " ")
                     (push acc (if (== call_type `lisp)
                                   (compile_lisp_scoped_reference tokens.0.name ctx)
                                   tokens.0.name))
                     (push acc "(")
                      (while (< idx (- tokens.length 1))
                             (do
                              (inc idx)
                              (= token (prop tokens idx))
                               (= stmt (compile token ctx))
                               ;(sr_log "<- (function) compiled_smt: " stmt)
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
                        ;(sr_log "<- local scoped reference is: " tokens.0.name)
                        (push acc tokens.0.name)
                        acc)
                    
                    (and (== call_type "local")
                         (not (== ref_type ArgumentType))
                         (is_array? tokens))
                    (do
                     (= val (get_ctx_val ctx tokens.0.name))
                     ;(sr_log "<- local scope: val is: " val)
                      (push acc val)
                     acc)
                    
                    
                    
                    (and (== ref_type ArgumentType)
                         (is_array? tokens))
                    (do 
                     ;(sr_log "compiling array: " tokens)
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
                    (== ref_type ArgumentType)
                    (do
                     ;(sr_log "arg reference: <-" tokens.0.name)
                     (push acc tokens.0.name)
                     acc)
                    (== ref_type "undefined")
                    (do
                     ;(sr_log "unknown reference: " tokens.0.name)
                     (throw ReferenceError (+ "unknown reference: " tokens.0.name)))
                    (== call_type `lisp)
                    (do 
                     ;(sr_log "is lisp scoped: " tokens.0.name )
                     (compile_lisp_scoped_reference tokens.0.name ctx))
                    else
                    (do 
                     ;(sr_log "warning unknown type in local ctx:" tokens.0.name ref_type)
                     (push acc tokens.0.name)
                     acc)))
               ;; add the ctype to the front
               (when false
                   (cond
                       (or (== ref_type "AsyncFunction")
                           (== ref_type "Function"))
                       (prepend acc { `ctype: ref_type })))
               ;(sr_log "<-" acc)
               acc)));(flatten acc))))
       
       (`compile_lisp_scoped_reference
         (fn (refname ctx)
             (let
                 ((`refval (get_lisp_ctx refname))
                  (`reftype (sub_type refval))
                  (`declarations nil)
                  (`basename (get_object_path refname)))
               
               ;; if the function has been 'included' in local scope via 
               ;; a declare clause, then we need to santize the name as it
               ;; will be accessible via the sanitized js name vs. the global
               ;; unsanitized name, which could contain illegal characters 
               ;; in JS.
               
               (= declarations (+ {} 
                                  (get_declarations ctx refname)
                                  (get_declaration_details ctx refname)))
               ;(console.log "compile_lisp_scoped_reference: declarations: " declarations)
               (when declarations.inlined
                  (= refname (sanitize_js_ref_name refname)))
               
               
               ;; if the refval isn't changed when is a string, we could have collisions 
               ;; because the compiler/evaluator uses the contents of refval in the ctype
               ;; object key to determine how to handle, so things like "block" or "Function"
               ;; will cause problems
               
               (when (and (== reftype "String")
                          (not (== refval undefined)))
                          ;(not (== refval "__!NOT_FOUND!__")))
                 (= refval "text"))  
                
                ;(when (verbosity ctx) 
                 ;     (console.log "compile_lisp_scoped_reference: " refname reftype refval))
                    
               (cond
                 (contains? basename.0 standard_types)   ;; Certain standard types are automatically available everywhere and are not specific to the lisp environment
                 refname
                 
                 declarations.inlined
                 refname ;; it's been placed in source, so don't get the global, use the inlined reference
                 
                 (not (== refval undefined))
                 ;(contains? basename.0 (keys Environment.context.scope))    
                      ;(not (== refval "__!NOT_FOUND!__")))
                 (do
                  (= has_lisp_globals true)
                  [{ `ctype: (if (and (not (is_function? refval)) (is_object? refval)) "object" refval) } "(" "await" " " env_ref "get_global" "(\"" refname  "\")" ")"])
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
                          `Environment `Expression `get_next_environment_id `subtype `lisp_writer `do_deferred_splice
                          ])
       (`is_error nil)
      
       (`is_block? (fn (tokens)
                       (and (contains? tokens.0.name ["do" "progn"]))))
                                       
       (`is_complex? (fn (tokens)
                         (let
                             ((`rval (or (is_block? tokens)
                                         (and (== tokens.type "arr") 
                                              (is_block? tokens.val))
                                         (== tokens.val.0.name "if")
                                         (== tokens.val.0.name "let"))))
                             
                           rval)))
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
                    "setq": compile_assignment
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
                    "progl": (fn (tokens ctx)
                                 (compile_block tokens ctx { `no_scope_boundary: true `suppress_return:true }))
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
                    "lambda": compile_fn
                    "function*": (fn (tokens ctx)
                                     (compile_fn tokens ctx { `generator: true }))
                    "defglobal": compile_set_global
                    "list": compile_list
                    "function": (fn (tokens ctx)
                                    (compile_fn tokens ctx { `synchronous: true }))
                    "=>": (fn (tokens ctx)
                              (compile_fn tokens ctx { `arrow: true }))
                    "yield": compile_yield
                    "for_with": compile_for_with
                    "quotem": compile_quotem
                    "quote": compile_quote
                    "quotel": compile_quotel
                    "evalq": compile_evalq
                    "eval": compile_eval
                    "jslambda": compile_jslambda
                    "javascript": compile_javascript
                    "instanceof": compile_instanceof
                    "typeof": compile_typeof
                    "unquotem": compile_unquotem
                    "debug": compile_debug
                    "declare": compile_declare
                    "import" : compile_import
                    "dynamic_import" : compile_dynamic_import
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
                                             ;(comp_log "check_statement: needs wrap: " stmt.0.ctype (== stmt.0.ctype "ifblock") stmt)
                                             (if (== stmt.0.ctype "ifblock")
                                                 [{ `ctype: "AsyncFunction" `marker: "ifblock"} "await" " " "(" "async" " " "function" "()" " " "{" stmt "}" " " ")" "()"]
                                                 [{ `ctype: "AsyncFunction" } "await" " " "(" "async" " " "function" "()" " " stmt " " ")" "()"]))
                                            stmt)))
                  (`kvpair nil)
                  (`total_length (- tokens.val.length 1)))
               ;(log "compile_obj_literal: ->" tokens)
                           
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
                           ;(log "valid_key_literals: compile_obj_literal:" idx total_length  "kvpair: " kvpair)
                                        ;(log "compile_obj_literal:" idx "is_block?" (is_block? kvpair.val.1) kvpair.val.1.val`)
                           (= key (get_val kvpair.val.0 ctx))
                           (when
                              (and (== key.length 1)
                                      (== (-> key `charCodeAt) 34))
                              (= key "'\"'"))
                            
                           ;(log "compile_obj_literal:" idx "key->" key "token_value:" kvpair.val.0)
                           (push acc key)
                           
                           (push acc ":")
                           (set_ctx ctx
                                    `__LAMBDA_STEP__
                                    -1)
                           (= stmt (compile_elem kvpair.val.1 ctx))
                           ;(log "compile_obj_literal:" idx total_length "<-val" stmt)
                           (= stmt (check_statement stmt))
                           (push acc stmt)
                                        ;(if (is_block? kvpair.val.1.val)
                                        ;   (compile_wrapper_fn kvpair.val.1 ctx)
                                        ;  (compile kvpair.val.1 ctx)))
                           (when (< idx total_length)
                             (push acc ","))))
                         ;; key - kvpair[0]: push in the literal identifier
                         
                         (push acc "}")
                         ;(log "compile_obj_literal: <-" (flatten acc))
                        [{ `ctype: "objliteral" } acc]))
                   (do
                    ;(log "compile_obj_literal: keys have invalid js chars")
                    (= tmp_name (gen_temp_name "obj"))
                     (for_each (`t [{ `ctype:`statement }  "await" " " "(" " ""async" " " "function" "()" "{" "let" " " tmp_name "=" "new" " " "Object" "()" ";"])
                               (push acc t))
                     (while (< idx total_length)
                            (do
                             (inc idx)
                             (= kvpair (prop tokens.val idx))
                              ;(log "compile_obj_literal:" idx total_length  "kvpair: " kvpair)
                              (for_each (`t [tmp_name "[" "\"" (cl_encode_string (get_val kvpair.val.0 ctx)) "\"" "]" "=" (compile_elem kvpair.val.1 ctx) ";"])
                                        (push acc t))))
                     
                     (for_each (`t ["return" " " tmp_name ";" "}" ")" "()"])
                               (push acc t))
                     ;(log "compile_obj_literal: <-" (flatten acc))
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
                         (if false
                             (if  (and  (is_array? rval)
                                        (is_object? rval.0)
                                        (prop rval.0 `ctype))
                                   true ;(comp_log (+ "compile:" _cdepth " <- ") "return type: " (as_lisp rval.0))
                                   (do 				        
				     (comp_warn "<-"  (or _cdepth "-")   "unknown/undeclared type returned: " (as_lisp rval))
				     (comp_warn "  "  (or _cdepth "-")   "for given: "  (source_from_tokens tokens expanded_tree)))))
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
                                             ;(comp_log "check_statement: needs wrap: " stmt.0.ctype (== stmt.0.ctype "ifblock") stmt)
                                             (if (== stmt.0.ctype "ifblock")
                                                 [{ `ctype: "AsyncFunction" `marker: "ifblock"} "await" " " "(" "async" " " "function" "()" " " "{" stmt "}" " " ")" "()"]
                                                 [{ `ctype: "AsyncFunction" } "await" " " "(" "async" " " "function" "()" " " stmt " " ")" "()"]))
                                            stmt)))
                  (`ref nil))
               
               
               ;(comp_log (+ "compile:" _cdepth ":->") tokens)
                                       
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
                        ;(if (verbosity ctx)
                         ;   (comp_log (+ "compile: " _cdepth " (form):") operator (if (prop Environment.inlines operator) "lib_function" op) tokens))
                        ;(comp_log "    ctx: " (clone ctx))
                        (cond 
                          op
                          (op tokens ctx)
                          (prop Environment.inlines operator)
                          (compile_inline tokens ctx)
                          else                                        
                          (compile_scoped_reference tokens ctx))) 
                                        
                      (and (is_object? tokens)
                           (== tokens.type "objlit"))
                      (do
                                        ;(comp_log "compile: object: " tokens)
                       (compile_obj_literal tokens ctx))
                      
                      
                      (is_array? tokens)
                      (do
                       ;(console.log (+ "compile: " _cdepth " [array_literal]:") "->" tokens)
                       (cond
                         ;; simple case, just an empty array, return js equiv     
                         (== tokens.length 0)
                         [{ `ctype: "array" `is_literal: true } "[]" ]
                         else
                         (let
                             ((`is_operation false)
                              (`declared_type nil)
                              (`nctx nil)
                              (`symbolic_replacements [])
                              (`compiled_values []))
                           
                           ;; in this case we need to compile the contents of the array
                           ;; and then based on the results of the compilation determine
                           ;; if it is an evaluation (first element of the array is a
                           ;; function or operator) or a non operation.  If the former
                           ;; it must be evaluated and returned or if the latter, returned
                           ;; as an array of values.
                           ;(comp_log (+ "compile: " _cdepth " [array_literal]:") "passing to compile tokens.0" tokens.0)
                           ;; the first element is the operator 
                           (= rcv (compile tokens.0 ctx (+ _cdepth 1)))
                           ;(comp_log (+ "compile: " _cdepth " [array_literal]:") "<- stmt" rcv)
                           
                           
                           (when (and tokens.0.ref (is_string? tokens.0.val))
                                 (= declared_type (get_declarations ctx tokens.0.name)))
                                 ;(= declared_type (get_declarations ctx tokens.0.name))  ;if passing rcv, already compiled so don't sanitize it in declarations
                                 ;(comp_log (+ "compile: " _cdepth " [array_literal]:") "declared_type: " declared_type (== declared_type.type Function)))
                                      
                           
                           ;; compiled values will hold the compiled contents
                           
                           (for_each (`t (rest tokens))
                                (do      
                                     
                                     (if (not (get_ctx_val ctx `__IN_LAMBDA__))
                                         (set_ctx ctx
                                                  `__LAMBDA_STEP__
                                                  0))
                                     ;(comp_log (+ "compile: " _cdepth " [array_literal]:") "-> stmt" t)
                                     (push compiled_values
                                           (compile t ctx (+ _cdepth 1)))))
                           
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
                                      ;(comp_log (+ "compile: " _cdepth " [array_literal]:") idx (clone compiled_element))
                                      (cond 
                                        (or (== inst "block")
                                            (== inst "letblock"))
                                        (do
                                          ;(comp_log (+ "compile: " _cdepth " [array_literal]:" ) "received raw block back at pos " idx "...need to wrap it but keep structural return value as an array")
                                          ;; the argument offset, the temp variable name and the wrapped function are made available
                                           
                                          (push symbolic_replacements
                                                [ idx (gen_temp_name "array_arg") 
                                                  [ { `ctype: "AsyncFunction"} "(" "async" " " "function" "()" " " compiled_element " " ")"]]))
                                        (== inst "ifblock")
                                        (do 
                                           ;(comp_log (+ "compile: " _cdepth " [array_literal]:" ) "received raw if block back at pos " idx "...need to wrap it but keep structural return value as an array")
                                           (push symbolic_replacements
                                                 [ idx (gen_temp_name "array_arg") 
                                                   [{ `ctype: "AsyncFunction"} "(" "async" " " "function" "()" " " "{" compiled_element  "}" " " ")"]])))))
                                
                                compiled_values)
                           
                           ;; next layout the code, and substitute in compiled_values the references to the functions
                           ;; in the compiled_values array
                           
                           ;(comp_log (+ "compile: " _cdepth " [array_literal]:") "# of symbolic_replacements: " symbolic_replacements.length)
                           ;(comp_log (+ "compile: " _cdepth " [array_literal]:") (if (is_array? rcv)
                            ;                                                         rcv.0.ctype
                             ;                                                        "NO CTYPE RETURNED"))
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
                             (or (== declared_type.type Function)
                                 (and (is_object? rcv.0)
                                      (is_function? rcv.0.ctype))
                                 (and (is_object? rcv.0)
                                      (not (is_array? rcv.0))
                                      (is_string? rcv.0.ctype)
                                      (contains? "unction" rcv.0.ctype)))
                             (do
                               ;(comp_log (+ "compile: " _cdepth " [array_literal]:") " requires evaluation:" (clone rcv))
                               (= is_operation true)
                               (for_each (`t ["(" rcv ")" "(" ])
                                         (push acc t))
                               (push_as_arg_list acc compiled_values)
                               (push acc ")"))
                             
                             
                             
                              (and (eq nil declared_type.type)
                                 (or (== tokens.0.type "arg")
                                     (and (is_string? rcv)
                                          (get_declaration_details ctx rcv))
                                     (and (is_array? rcv)
                                          (is_object? rcv.0)
                                          (is_string? rcv.0.ctype)
                                          (and rcv.0.ctype
                                               (and (not (contains? "unction" rcv.0.ctype))
                                                    (not (== "string" rcv.0.ctype))
                                                    (not (== "String" rcv.0.ctype))
                                                    (not (== "nil" rcv.0.ctype))
                                                    (not (== "Number" rcv.0.ctype))
                                                    (not (== "undefined" rcv.0.ctype))
                                                    (not (== "objliteral" rcv.0.ctype))
                                                    (not (== "Boolean" rcv.0.ctype))
                                                    (not (== "array" rcv.0.ctype)))))))  ;; TODO - RUNTESTS HERE MODIFIED
                                                
                                           
                             
                                 
                              ;; an ambiguity which results in a performance penalty because we need 
                              ;; create a function that checks the first symbol in the array is a function
                              ;; if the first symbol in the array is a reference.
                              (do
                                  ;(comp_log (+ "compile: " _cdepth " [array_literal]:") "ambiguity: compiled: " (clone rcv))
                                  (= tmp_name (gen_temp_name "array_op_rval"))
                              
                                  (if (and (is_object? rcv.0)
                                           (is_string? rcv.0.ctype)
                                           (contains?  "block" (or rcv.0.ctype "")))
                                      (do
                                       ;(comp_log (+ "compile: " _cdepth " [array_literal]:" ) "received raw block back...need to wrap it but keep structural return value as an array")
                                       (= rcv (check_statement rcv))))
                               
                                   ;(comp_log (+ "compile: " _cdepth " [array_literal]:") "ambiguous, requires a runtime check" (clone rcv))
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
                              
                              ;(comp_log (+ "compile: " _cdepth " [array_literal]:") "not evaluating" rcv)
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
                                        
                           (when (> symbolic_replacements.length 0)
                             (push acc "}"))
                           ;(comp_log (+ "compile: " _cdepth " [array_literal]:") "<-" acc)
                           acc)))
                      
                      
                      
                      (and (is_object? tokens)
                           (is_array? tokens.val)
                           tokens.type)
                      (do 
                       ;(comp_log (+ "compile: " _cdepth " token.val is array:") tokens)
                        (set_prop ctx
                                  `source
                                  tokens.source)
                        (= rcv (compile tokens.val ctx (+ _cdepth 1)))
                        ;(comp_log (+ "compile: " _cdepth " token.val is array:<-") rcv)
                        
                       rcv)
                      
                      
                      ; Simple compilations ----
                      (or (and (is_object? tokens)
                               (check_true tokens.val)
                               tokens.type)
                          (== tokens.type "literal")
                          (== tokens.type "arg")
                          (== tokens.type "null"))
                      (do 
                       ;(comp_log (+ "compile: " _cdepth " singleton: ") tokens)
                       ;(comp_log "    ctx: " (clone ctx))
                       (defvar `snt_name nil)
                       (defvar `snt_value nil)
                       
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
                               [ { `ctype: "string" } (+ "\"" (cl_encode_string tokens.val) "\"") ])
                              
                               [{ `ctype: (sub_type tokens.val)  } tokens.val ])  ;; straight value
                          
                          (and tokens.ref
                               opts.root_environment)
                           (do 
                              (path_to_js_syntax (split_by "." (sanitize_js_ref_name tokens.name))))
                              
                           
                          (and tokens.ref 
                               (prop op_lookup tokens.name))
			  tokens.name
					;(throw SyntaxError (+ "compiler operator " tokens.name " referenced as a value."))
                          
                          
                          (and tokens.ref
                               (do
                                   (= snt_name (sanitize_js_ref_name tokens.name))
                                   (= snt_value (get_ctx ctx snt_name))
                                   ;(comp_log (+ "compile: " _cdepth " singleton: ") "local ref?" snt_name snt_value "declarations?: ")
                                   (or snt_value
                                       (== 0 snt_value)
                                       (== false snt_value))))
                                   ;(== false (get_ctx ctx tokens.name))))
                          (do 
                            (= refval snt_value) ;(get_ctx ctx (sanitize_js_ref_name tokens.name)))
                            (when (== refval ArgumentType)
                              (= refval snt_name)) ;tokens.name))
                            ;(comp_log "compile: singleton: found local context: " refval "literal?" (is_literal? refval))
                                        ;(comp_log "compile: singleton: get_declaration_details: " (get_declaration_details ctx tokens.name))
                            (cond 
                                  (== tokens.type "literal")
                                  refval
                                  else
                                  (get_val tokens ctx)))
                          
                          (contains? tokens.name standard_types)
                          tokens.name
                          ;; check global scope
                          (not (== undefined (get_lisp_ctx tokens.name)))
                          (compile_lisp_scoped_reference tokens.name ctx)
                                                   
                          
                          else
                          (do ;(comp_log "compile: unknown reference: " tokens.name)
                              (throw ReferenceError (+ "compile: unknown reference: " tokens.name)))))
                      else
                      (do 
                       
                        (throw SyntaxError "compile passed invalid compilation structure"))
                      ))
                (catch Error (`e)
                       (do
                        (setq is_error {
                              `error: e.name
                              `message: e.message
                              `form: (source_from_tokens tokens expanded_tree)
                              `parent_forms: (source_from_tokens tokens expanded_tree true)
                              `invalid: true
                              })
                        (if (not e.handled)
                            (push errors
                               (clone is_error)))))))))
       (`final_token_assembly nil)
       (`main_log (if opts.quiet_mode
                      log
                      (defclog { `prefix: "compiler:" `background: "green" `color: "black" } )))
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
                                           (when (and t.comment
                                                      opts.include_source)
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
    
    (declare (optimize (safety 2))
             (include length first second map do_deferred_splice
                      not sub_type last flatten add subtype
                      is_nil? is_number? starts_with? 
                      cl_encode_string contains?)
             (local check_true clone))
            
      
    
   
    (if (eq nil Environment)
        (throw EvalError "Compiler: No environment passed in options."))

    ;; if verbosity is set in the global context, set our verbosity function...
    ;; to be active.
       
    (when (-> Environment `get_global "__VERBOSITY__")
      (let
	  ((`verbosity_level (-> Environment `get_global "__VERBOSITY__")))	   
	(when (> verbosity_level 0)	     
	  (= verbosity check_verbosity))))
       

       
    
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
       
    (set_ctx root_ctx
             `__LAMBDA_STEP__
              -1) 
    
    (= output
       (cond
         opts.special_operators
         (make_set (keys op_lookup))
         
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
                    (= is_error e)))
                    
            
            (cond 
              (instanceof is_error SyntaxError)
              (do (push errors
                       is_error)
                  is_error)
              is_error
              is_error
              (eq nil final_token_assembly)
              (do  
                  (= is_error (new EvalError "Pre-Compilation Error"))
                  is_error)
              else
              (do
                  ;; we have tokenized and processed the input tree, now compile...
                  
                  (= assembly (compile final_token_assembly
                                       root_ctx
                                       0))
                  (= assembly (splice_in_return_a assembly))
                  (= assembly (splice_in_return_b assembly))))
           ;(if is_error
            ;   (error_log "compilation" (clone is_error)))
               
           (when opts.root_environment
                 (= has_lisp_globals false))
           ;(main_log "globals:" has_lisp_globals " constructed assembly:" (clone assembly))
           ;(main_log "assembly: " (assemble_output assembly))
           (when (and assembly.0.ctype
                     (is_function? assembly.0.ctype))
               (set_prop assembly.0
                         `ctype
                         (map_value_to_ctype assembly.0.ctype)))          
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
             (and assembly
                  (is_string? (first assembly))
                  (== (first assembly) "throw"))
             (= assembly
                [ { `ctype: `block } assembly])
             (and (not is_error)
                  assembly
                  (or (not (is_object? (first assembly)))
                      (not (prop (first assembly) `ctype))))
             (= assembly
                [ { `ctype: `statement } assembly])
	     is_error
	     is_error
	     (eq nil assembly)
	     (= assembly []))
           ;; if we are compiling with the root_environment option as true
           ;; we don't have a pre-existing environment, because we are
           ;; compiling the environment.
           (when opts.root_environment
                (= has_lisp_globals false))
           (if is_error
               (do 
                ;(error_log "compiler: is an error: " is_error)
                [ { `ctype: "FAIL" }  errors])
               (if (is_object? (first assembly))
                   [(+ { `has_lisp_globals: has_lisp_globals }
                       (take assembly))
                   (assemble_output assembly)]
                   [{`has_lisp_globals: has_lisp_globals } (assemble_output assembly)])))))
    ;(main_log "<-" (clone output))
    ;(when (> errors.length 0)
    ;  (main_log "ERRORS:" (clone errors)))
    (when opts.error_report
          (opts.error_report { `errors: errors `warnings: warnings}))
          
               
    output))))

;; DLisp to Javascript Compiler
;; (c) 2022 Kina

;; **

;; Author: Alex Nygren

;; var { check_true, get_outside_global, subtype,lisp_writer,clone } = await import("/lisp_writer.js?id=942024")


;; The compiler functions takes a JSON structure of lisp forms,
;; (presumably the output of the lisp reader), and emits a
;; Javascript representation as text.

;; The compiler takes an Environment, which is an object that
;; provides a global context.  The environment contains information
;; on global definitions, compilation declarations, and provides
;; evaluation functions and external API access.

;; The function returns an array with two elements, the first
;; element is an instruction marker, which is an object that
;; contains keys which describe, in semantic terms, the
;; returned compiled source, which is the second element in
;; the array.

;; The format described above complies with the internal mechanics
;; of the compilation mechanism, where each specialized compilation
;; function returns an array, where the first element is, in most cases,
;; an instruction signal providing context for WHAT type of compiled
;; output is being returned by the specialized compilation functions.

;; [ { INSTRUCTION OBJECT } STATEMENTS ]
;; [ { `ctype: "block" }     "{" "let" [...] "}" ]


;; Keys:

;; error_report (fn (errors)) - when compilation is completed, this function is called
;;                              with the accumulated compilation errors and warnings
;;
;; env - environment object to use for the compilation environment
;; 
;; root_environment - if true, indicates that this is the Environment object being compiled
;;                    and therefore the Environment is implicit, vs. passed in and
;;                    referenced.
;; only_tokens - if true, return only the tokenized JSON tree
;;
;; formatted_output - if true, the output code is formatted (somewaht) vs. a long text
;;                    stream.
;;
;; include_source - if true attach the source form as comments for the compiled expressions.
;;
;; source_name - represents the location (file,uri) of the lisp form the compiler is
;;               working with.  When provided it is referenced in thrown Errors.
;; throw_on_error - if true, instead of returning a fail structure, throw an Error
;;                  
;; show_hints - if true, the compiler will emit messages of where optimizations/declarations
;;              could help the code be more efficient.  Note that this can be turned
;;              on by a global __VERBOSITY__ level > 3.
;;
;; special_operators - when true, return the list of the compiler's special operators

;; *on_compiler_eval_error* - when evaluations are required to occur in the compiler, and an error
;;                            is thrown, if this function value is present in the compiler namespace, 
;;                            it will be called with (*on_compiler_eval_error* thrown_error assembled_js)

;; Note that this source was originally written in an earlier version of this lisp,
;; which needed symbols to be quoted explicitly in certain form types, principally when
;; they are being initially defined, such as in let.  This is no longer the case
;; and the rules have been relaxed.  Once this compiler reached a consistently
;; self hosted stage, the relaxed rules have been allowed, but in most cases
;; the older quoted declarations are used for consistency.

(defglobal `compiler 
   (fn (quoted_lisp opts)
      (progn
         (defvar Environment opts.env)
         (defvar get_global opts.env.get_global)
         ;(console.log "compiler: options: " (clone opts))
         (let
            ((tree quoted_lisp)  ;; the JSON source provided
             
             ;; when we are compiling forms that are compile time manipulated by functions,
             ;; expanded_tree will hold the tree structure that is the result of those
             ;; macro expansions
             
             (expanded_tree (clone tree))
             (op nil)
             
             (default_safety_level (or Environment.declarations.safety.level 1))
             (source_name (or opts.source_name "anonymous"))
             (build_environment_mode (or opts.build_environment false))
             (env_ref (if build_environment_mode
                           ""
                           "Environment."))
             (operator nil)
             (break_out "__BREAK__FLAG__")
             (tokens [])
             (tokenized nil)
             (target_namespace nil)  ;; if nil the current namespace environment will be used - set with declare at the top level
             (errors [])
             (external_dependencies {})
             (first_level_setup [])
             (needs_first_level true)
             (throttle_level opts.throttle)
             (signal_error (fn (message)
                               (new LispSyntaxError message)))
             (warnings [])
             (blk_counter 0)
             (ctx nil)
             (output nil)
             (log console.log)
             (defclog (fn (opts)
                          (let
                             ((style (+ "padding: 5px;"
                                         (if opts.background
                                            (+ "background: " opts.background ";")
                                            "")
                                         (if opts.color
                                            (+ "color: " opts.color ";"))
                                         "")))
                             (declare (string style))
                             (fn (`& args)
                                (apply console.log (+ "%c" (if opts.prefix
                                                               opts.prefix
                                                               (take args)))
                                       (conj [ style ]
                                             args))))))
             (quiet_mode (if opts.quiet_mode
                              (do
                                 (= log console.log)
                                 true)
                              false))
             (show_hints nil)
             (error_log (defclog { `prefix: "Compile Error" `background: "#CA3040" `color: "white" } ))
             (dynamic_references? false)
             (assembly []) ;; the output structure that holds the compiled code
             
             (async_function_type_placeholder (fn () true))
             (function_type_placeholder (function () true))
             
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
             
             
             (type_marker (fn (type)
                              (set_prop
                                 (new Object)
                                 `ctype type
                                 `args [])
                              ))
             
             (return_marker (fn ()
                                { `mark: "rval" }))
             (entry_signature nil)
             
             ;; TODO: Need to add pathing to the following structure, or instead, deprecate and use a
             ;; more direct approach.  Relevant to build_fn_with_assignment and build_anon_fn
             
             (temp_fn_asn_template [{"type":"special","val":(quotel "=:defvar"),"ref":true,"name":"defvar"},{"type":"literal","val":"\"\"","ref":false,"name":""},{"type":"arr","val":[{"type":"special","val":(quotel "=:fn"),"ref":true,"name":"fn"},{"type":"arr","val":[],"ref":false,"name":"=:nil"},{"type":"arr","val":[],"ref":false,"name":"=:nil"}],"ref":false,"name":"=:nil"}])
             (anon_fn_template (-> temp_fn_asn_template `slice 2))
             (build_fn_with_assignment (fn (tmp_var_name body args ctx)
                                           (let
                                              ((tmp_template (clone temp_fn_asn_template)))
                                              ;; [ 2 0 ] path to fn keyword
                                              
                                              (when (in_sync? ctx)
                                                 
                                                 (set_prop tmp_template.2.val.0
                                                    `val
                                                    (quotel "=:function"))
                                                 (set_prop tmp_template.2.val.0
                                                    `name
                                                    "function"))
                                              
                                              
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
             ;; to do: remove
             (build_anon_fn (fn (body args)
                                (let
                                   ((tmp_template (clone anon_fn_template)))
                                   (when (verbosity ctx)
                                      (console.log "build_anon_function: -> body: " body)
                                      (console.log "build_anon_function: -> args: " args))
                                   (when (is_array? args)
                                      (set_prop tmp_template.0.val.1
                                         `val
                                         args))
                                   (set_prop tmp_template.0.val.2
                                      `val
                                      body)
                                   tmp_template)))
             
             
             ;; the types of statements that return completion types
             (completion_types [ `return `throw `yield ])
             
             ;; For optimizations, and dependency tracking, keep track 
             ;; of referenced global symbols.  If defined with the constant attribute,
             ;; they can be declared in an outer closure for speed of
             ;; reference, or if building an environment, the code
             ;; inlined to the declaring symbol (since one cannot
             ;; assume that there is a defined environment yet).
             
             (referenced_global_symbols (new Set))
             
             ;; external accessible JS references 
             ;; will be returned for dependency tracking
             
             (referenced_externals (new Set))
             
             ;; A compilation lexical context is established where we
             ;; can store state about declared varables, compilation states,
             ;; and source, etc..
             
             ;; The new_ctx function creates a new contextual scope which can be a
             ;; root scope if parent is nil, or a contained scope if passed another
             ;; context.
             
             (new_ctx (function (parent)
                          (let
                             ((ctx_obj (new Object)))
                             (set_prop ctx_obj
                                `scope (new Object)
                                `source source_name
                                `parent parent
                                `ambiguous (new Object)
                                `declared_types (new Object)
                                `defs [])
                             (when parent
                                
                                (set_prop ctx_obj.scope
                                   `namespace
                                   parent.scope.namespace)
                                (when parent.defvar_eval             ;; TODO - REMOVE NOT USED
                                   (set_prop ctx_obj
                                      `defvar_eval
                                      true))
                                (when parent.has_first_level
                                   (set_prop ctx_obj
                                      `has_first_level
                                      true))
                                (when parent.block_step
                                   (set_prop ctx_obj
                                      `block_step
                                      parent.block_step))
                                (when parent.block_id
                                   (set_prop ctx_obj
                                      `block_id
                                      parent.block_id))
                                (when parent.sub_block_step
                                   (set_prop ctx_obj
                                      `sub_block_step
                                      parent.sub_block_step))
                                (when false ; parent.return_point
                                   (set_prop ctx_obj
                                      `return_point
                                      (+ parent.return_point 1))))
                             ctx_obj)))
             
             
             
             (set_ctx_log (if opts.quiet_mode
                               log
                               (defclog { `prefix: "set_ctx" `background: `darkgreen `color: `white } )))
             
             ;; given a ctype value, returns a type value
             ;; for the ctype.
             (map_ctype_to_value (fn (ctype value)
                                     (cond
                                        (== ctype "Function")
                                        Function
                                        (== ctype "AsyncFunction")
                                        AsyncFunction
                                        ;(== ctype "Number")
                                        ;Number
                                        (== ctype "expression")
                                        Expression
                                        (and (is_string? ctype)
                                             (contains? "block" ctype))
                                        UnknownType
                                        (== ctype "array")
                                        Array
                                        ;(== ctype "Boolean")
                                        ;Boolean
                                        (== ctype "nil")
                                        NilType
                                        (is_function? ctype)
                                        ctype
                                        else
                                        value)))
             
             
             (map_value_to_ctype (fn (value)
                                     (cond
                                        (== Function value)
                                        "Function"
                                        (== AsyncFunction value)
                                        "AsyncFunction"
                                        (== NumberType value)
                                        "NumberType"
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
             
             ;; Spaghetti stack (aka saguaro stack) is implemented
             ;; to represent lexical references in the block and functional scopes..
             
             ;; Sets a value in the current compilation context
             
             (set_ctx (fn (ctx name value)
                          (do
                             (defvar `sanitized_name (sanitize_js_ref_name name))
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
                                       value))
                                 (set_prop ctx.scope
                                    sanitized_name
                                    value)))))
             
             ;; Retrieves a value from the current compilation context - no santization
             
             (get_ctx (fn (ctx name)
                          (let
                             ((ref_name nil))
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
             
             ;; preferred entry point - sanitizes
             (get_ctx_val (fn (ctx name)
                              (let
                                 ((ref_name nil)
                                  (declared_type_value nil))
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
                                       (cond
                                          declared_type_value.declared_global
                                          undefined
                                          declared_type_value.type
                                          declared_type_value.type
                                          else
                                          (do
                                             (= ref_name (first (get_object_path ref_name)))
                                             (cond
                                                (prop op_lookup ref_name)
                                                AsyncFunction
                                                (not (== undefined (prop ctx.scope ref_name)))
                                                (prop ctx.scope ref_name)
                                                ctx.parent
                                                (get_ctx ctx.parent ref_name)))))))))
             
             ;; Symbols at the current scope can be declared to be a certain type, which assists
             ;; with compilation optimization, especially with regard to whether something is
             ;; a function or not.
             
             ;; The declare compiler directive (declare ...) is the lisp method. Internal
             ;; compiler functions use the following functions to manipulate
             ;; the declarations.
             
             (get_declarations (fn (ctx name _tagged)
                                   (let
                                      ((ref_name nil)
                                       (oname name)
                                       (root_name nil)
                                       (name (if _tagged
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
                                            (cond
                                               (prop op_lookup ref_name)
                                               nil
                                               (not (== undefined (prop ctx.declared_types ref_name)))
                                               (prop ctx.declared_types ref_name)
                                               ctx.parent
                                               (get_declarations ctx.parent ref_name true)))))))
             
             (set_declaration (fn (ctx name declaration_type value)
                                  (let
                                     ((sname (sanitize_js_ref_name name))
                                      (dec_struct (get_declarations ctx sname)))
                                     (when (blank? dec_struct)
                                        (= dec_struct {
                                                        `type:undefined
                                                        `inlined: false
                                                        }))
                                     (cond
                                        (and (== declaration_type "location")
                                             (== value "global"))
                                        (do
                                           (= has_lisp_globals true)
                                           (if (== undefined (prop dec_struct `type))
                                               (throw SyntaxError "global declaration must be after declaration of type for symbol"))
                                           (set_prop dec_struct
                                              `declared_global
                                              true)
                                           (set_prop root_ctx.defined_lisp_globals
                                              name
                                              (prop dec_struct `type)))
                                        else
                                        (do
                                           (set_prop dec_struct
                                              declaration_type
                                              value)
                                           (set_prop ctx.declared_types
                                              sname
                                              dec_struct)
                                           (prop ctx.declared_types
                                              sname))))))
             
             ;; If a variable isn't declared, it can cause ambiguity in knowing
             ;; the value it represents after being assigned to by a function.
             ;; Therefore any implicit type inferences can be marked ambigous
             ;; at points by the compiler.
             
             
             (is_ambiguous? (fn (ctx name)
                                (let
                                   ((ref_name nil))
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
             
             (set_ambiguous (fn (ctx name)
                                (set_prop ctx.ambiguous
                                   name
                                   true)))
             
             (unset_ambiguous (fn (ctx name)
                                  (delete_prop ctx.ambiguous
                                     name)))
             
             ;; Lisp symbol names can be broader in allowable symbols then JS, so we need to be able
             ;; to deal with managing this mismatch...
             
             (invalid_js_ref_chars "+?-%&^#!*[]~{}/|")
             (invalid_js_ref_chars_regex (new RegExp "[/\\%\\+\\[\\>\\?\\<\\\\}\\{&\\#\\^\\=\\~\\*\\!\\)\\(\\-]+" `g))
             
             (check_invalid_js_ref (fn (symname)
                                       (cond
                                          (not (is_string? symname))
                                          false
                                          (is_reference? symname)
                                          (> (length (scan_str invalid_js_ref_chars_regex (-> symname `substr 2))) 0)
                                          else
                                          (> (length (scan_str invalid_js_ref_chars_regex symname)) 0))))
             
             ;; Ensure that allowed lisp symbols are transformed into allowed Javascript representations
             (sanitize_js_ref_name sanitize_js_ref_name)
             
             ;; find_in_context - returns the contextual details about where and what
             ;; a symbol or reference refers to, or the literal value itself.
             
             (find_in_context (fn (ctx name)
                                  (let
                                     ((symname (cond (and (is_string? name)
                                                           (> (length name) 2)
                                                           (starts_with? (quote "=:") name))
                                                   (-> name `substr 2)
                                                   (is_string? name)
                                                   name
                                                   else
                                                   (do
                                                      (when (== name nil)
                                                         (= name (quote nil)))
                                                      "null")))
                                      ;; does it start with "=:"?
                                      (ref (and symname (is_reference? name)))
                                      
                                      ;; Rules for determining if a thing coming in from the JSON is
                                      ;; considered a literal vs a symbol
                                      
                                      (is_literal? (or (is_number? name)
                                                        (and (not ref) (is_string? name))
                                                        (== "nil" symname)
                                                        (== "null" symname)
                                                        (and ref (== "undefined" symname))
                                                        (and ref (== "else" symname))
                                                        (and ref (== "catch" symname))
                                                        (== true name)
                                                        (== false name)))  ;; literals
                                      
                                      ;; is it one of our built in opcodes?
                                      (special (and ref symname (contains? symname (conj ["unquotem" "quotem"] (keys op_lookup)))))
                                      
                                      ;; to be local is to be declared within the scope of compilation..
                                      (local (and (not special)
                                                   (not is_literal?)
                                                   symname
                                                   ref
                                                   (get_ctx_val ctx symname)))
                                      
                                      ;; a global is one which is found either in the passed Environment global context,
                                      ;; or one that is external to the lisp altogether, found somewhere in globalThis.
                                      (global (and (not special)
                                                    (not is_literal?)
                                                    ref
                                                    symname
                                                    (get_lisp_ctx ctx symname)))
                                      
                                      ;; ok - how are going to represent it's value?
                                      (val (cond is_literal?
                                               name
                                               (is_array? name)
                                               name
                                               (is_object? name)
                                               name
                                               special
                                               name
                                               local
                                               local
                                               (and (not (== global undefined))
                                                    (not (== global NOT_FOUND)
                                                         ))
                                               global
                                               ;(== global nil)
                                               ;global
                                               (== symname name)
                                               name)))
                                     
                                     ;; put together the return structure..
                                     ;; what type of thing is it? a string description...
                                     {   `type: (cond (is_array? name)
                                                   "arr"    ;; TODO - change this to be "Array"
                                                   (is_element? name)
                                                   "dom"
                                                   (is_object? name)
                                                   (sub_type name)
                                                   special
                                                   "special"
                                                   is_literal?
                                                   "literal"
                                                   local
                                                   (sub_type local)
                                                   (not (eq undefined global))
                                                   (sub_type global)
                                                   (and ref symname)
                                                   "unbound"
                                                   (== name undefined)
                                                   "literal"
                                                   else
                                                   (do
                                                      (error_log "find_in_context: unknown type: " name)
                                                      (debug)  ;; ok..what did we miss?
                                                      "??"))
                                             
                                             ;; what are we going to call it?
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
                                             `val: (if (== val undefined)
                                                       "=:undefined"
                                                       val)
                                             `ref: (if ref true false)
                                             `local: (or local nil)
                                             `global: (or (and (not (== undefined global))
                                                               (not (== NOT_FOUND global)))
                                                          nil)
                                             })))
             ;; returns the original back trace from the token structure
             ;; which means that it is source code after all macro expansions
             
             (source_chain (fn (cpath tree sources)
                               (if (and (is_array? cpath)
                                        tree)
                                   (let
                                      ((sources (or sources []))
                                       (source nil))
                                      (= cpath (chop cpath))
                                      (= source (as_lisp (resolve_path cpath tree)))
                                      (if (> source.length 80)
                                          (= source (+ (-> source `substr 0 80) "...")))
                                      (when (not (blank? source))
                                         (push sources source))
                                      (if (and (> cpath.length 0)
                                               (< sources.length 4))
                                          (source_chain cpath tree sources))
                                      sources))))
             
             ;; When we need to go the original tree to retrieve the
             ;; JSON source component, such as for error reporting
             ;; this function takes the path value from the tokens
             ;; and returns the value from the source tree.
             
             (source_from_tokens (fn (tokens tree collect_parents?)
                                     (let
                                        ()
                                        (cond
                                           (and tokens.path
                                              collect_parents?)
                                           (source_chain tokens.path tree)
                                           (is_string? tree)
                                           (as_lisp tree)
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
                                              (when (verbosity ctx)
                                                 (console.warn "source_from_tokens: unable to determine source path from: " (clone tokens)))
                                              "")))))
             (source_comment    (fn (tokens){ `comment: (source_from_tokens tokens expanded_tree) }))
             
             
             ;; the signal from the passed environment when an item is not found
             
             (NOT_FOUND         "__!NOT_FOUND!__")
             
             (THIS_REFERENCE    (fn () "this"))
             
             ;; internal compiler representation of the meaning something wasn't found
             
             (NOT_FOUND_THING   (fn () true))
             
             (get_lisp_ctx_log (if opts.quiet_mode
                                    log
                                    (defclog { `prefix: "get_lisp_ctx"  `color: "darkgreen"  `background: "#A0A0A0"} )))
             
             
             ;; used to get or find a lisp global in the environment...
             ;; or an "external" reference, such as a globalThis thing.
             
             (get_lisp_ctx (fn (ctx name)
                               (if (not (is_string? name))
                                   (throw Error "Compiler Error: get_lisp_ctx passed a non string identifier")
                                   (let
                                      ((comps (get_object_path name))
                                       (cannot_be_js_global (check_invalid_js_ref comps.0))
                                       (ref_name (take comps))
                                       (ref_type (if (== ref_name "this")
                                                      THIS_REFERENCE
                                                      (progn
                                                         (defvar `global_ref (prop root_ctx.defined_lisp_globals ref_name))
                                                         (if (or (eq undefined global_ref)
                                                                 (== global_ref "statement"))
                                                             (-> Environment `get_global ref_name NOT_FOUND_THING cannot_be_js_global)
                                                             global_ref)))))
                                      
                                      
                                      (cond 
                                         (and (not (== NOT_FOUND_THING ref_type))
                                              (not (contains? ref_name standard_types)))
                                         (progn
                                            (-> referenced_global_symbols
                                               `add ref_name)
                                            (aif (get_ctx ctx `__GLOBALS__)
                                                 (-> it `add ref_name)))
                                         (and (not (== NOT_FOUND_THING ref_type))
                                              (-> externals `has ref_name))
                                         (progn
                                            (-> referenced_externals `add ref_name)
                                            (aif (get_ctx ctx `__EXTERNALS__)
                                                 (progn
                                                    (-> it `add ref_name)))))
                                      
                                      ;(when (verbosity root_ctx)
                                       ;  (get_lisp_ctx_log "name: " name "type: " (sub_type ref_type) "not found: " (== NOT_FOUND_THING ref_type)  "components: " comps))
                                      (cond
                                         (== NOT_FOUND_THING ref_type)
                                         undefined
                                         (== ref_type THIS_REFERENCE)
                                         ref_type
                                         (== comps.length 0)
                                         ref_type
                                         (and (== comps.length 1)
                                              (is_object? ref_type)
                                              (contains? comps.0 (object_methods ref_type)))
                                         (prop ref_type comps.0)
                                         
                                         (and (is_function? ref_type)
                                              (is_ambiguous? root_ctx ref_name))
                                         ref_type
                                        
                                         (is_array? ref_type)
                                         ref_type
                                         
                                         (== ref_type "array")
                                         []
                                         (and (== comps.length 1)
                                              (is_object? ref_type))
                                         (progn
                                            (defvar v (prop ref_type comps.0))
                                            (if v
                                                v
                                               ref_type))
                                         (is_object? ref_type)
                                         (or (resolve_path comps ref_type)
                                             ref_type)
                                         
                                         (and (== (typeof ref_type) "object")
                                              (contains? comps.0 (-> Object `keys ref_type)))
                                         (do
                                            (while (or (eq ref_type undefined)
                                                       (> comps.length 0))
                                               (= ref_type (prop ref_type (take comps))))
                                            ref_type)
                                         
                                         (== ref_type "objliteral")
                                         ref_type
                                         else
                                         (do
                                            (debug)
                                            (get_lisp_ctx_log "symbol not found: " name ref_name ref_type cannot_be_js_global)
                                            undefined)
                                         )))))
             
             ;; internally used to get a local value in a compilation scope..
             
             (get_val (fn (token ctx)
                          (do
                             (cond
                                token.ref
                                (do
                                   (defvar `comps (split_by "." token.name))
                                  
                                   (defvar `ref_name
                                      (if (and (> (safety_level ctx) 1)
                                               (> comps.length 1))
                                          (safe_access token ctx sanitize_js_ref_name)
                                          (sanitize_js_ref_name (expand_dot_accessor token.name ctx))))
                                    (when (verbosity ctx)
                                       (log "get_val: reference: " (safe_access token ctx sanitize_js_ref_name) ref_name ":" (get_ctx ctx ref_name)))
                                   (cond
                                      (and (get_ctx ctx "__IN_QUOTEM__")
                                           (not (get_ctx ctx "__IN_LAMBDA__")))
                                      (get_ctx ctx ref_name)  ;; get the value from the context now instead of returning the bound symbol
                                      (and false (get_ctx ctx "__IN_QUOTEM__")
                                           (get_ctx ctx "__IN_LAMBDA__"))
                                      (+ "await ctx_access(\"" ref_name "\")")
                                      else
                                      ref_name))
                                else
                                token.val))))
             
             ;; if the compiler determines that what it has been asked to compile
             ;; references something in the environment, this is set to true
             ;; It is returned in the metadata by the compiler to signal that
             ;; the code will require an environment object to be passed
             ;; to it explicitly.
             
             ;; Typically the function is wrapped in a closure that has
             ;; the environment bound in, and then the compiler produced
             ;; function is called with the bound environment.
             
             (has_lisp_globals false)
             
             ;; The global context for everything inside a compilation.
             ;; This can be passed in with the parameters object (opts)
             ;; to allow for specific functions or values to be
             ;; included in the code or to be referenced by the code
             ;; distinct from the passed environment, which is
             ;; passed in separately and is kept distinct from the root
             ;; compiler context.
             
             (root_ctx   (new_ctx (or opts.ctx)))
             
             ;; Tokenization starts here, as the first pass.  The tree is read, each
             ;; JSON element is categorized and tagged.
             ;; Note that as part of this pass, if a form is encountered with an
             ;; operator that refers to an eval_when: compile_time function,
             ;; that function will be called, and the results of the compilation
             ;; are tokenized instead, effectively replacing the form.
             
             ;; This is how defmacro and the macro facilty are actualized.
             
             (tokenize_object (fn (obj ctx _path)
                                  (do
                                     (defvar ser nil)
                                        (progn
                                           (try
                                              (= ser (JSON.stringify obj))
                                              ;(= ser (JSON.stringify obj))
                                              (catch TypeError (e)
                                                 (do
                                                    (console.warn "compiler: cannot tokenize: ", obj, e)
                                                    (= ser "{}")
                                                    ;(throw e)
                                                    )))
                                           
                                           (= _path (or _path []))
                                           (if  (== ser "{}")
                                               (do
                                                  ;(console.log "substiting " ser "an empty object for " obj)
                                                  { `type: "object" `ref: false `val: "{}" `name: "{}" `__token__:true  `path: _path})
                                               (for_each (pset (pairs obj))
                                                  (do
                                                     {`type: `keyval `val: (tokenize pset ctx `path: (+ _path pset.0)) `ref: false `name: (desym_ref pset.0) `__token__:true })))))))
             
             (tokenize_quote (fn (args _path)
                                 (do
                                    (cond
                                       (== args.0 (quote "=:quote"))
                                       {`type: `arr `__token__:true `source: (as_lisp args) `val: (conj [ { `type: `special `val: (quote "=:quote") `ref: true `name: "quote" `__token__:true } ] (-> args `slice 1)) `ref: (is_reference? args) `name: nil  `path: _path}
                                       (== args.0 (quote "=:quotem"))
                                       {`type: `arr `__token__:true `source: (as_lisp args)
                                               `val: (conj [ { `type: `special `path: (conj _path [0]) `val: (quote "=:quotem") `ref: true `name: "quotem" `__token__:true } ] (-> args `slice 1)) `ref: (is_reference? args) `name: nil `path: _path }
                                       else
                                       {`type: `arr `__token__:true `source: (as_lisp args)
                                               `val: (conj [ { `type: `special `val: (quote "=:quotel") `ref: true `name: "quotel" `__token__:true } ] (-> args `slice 1)) `ref: (is_reference? args) `name: nil `path: _path }))))
             
             ;; The entry point to this recursive process
             ;; Build up a structure containing categorizations of the code to be compiled...
             
             (tokenize   (fn (args ctx _path _suppress_comptime_eval)
                             (let
                                ((argtype nil)
                                 (rval nil)
                                 (ctx ctx)
                                 (_path (or _path []))
                                 (qval nil)
                                 (idx -1)
                                 (tobject nil)
                                 (argdetails nil)
                                 (argvalue nil)
                                 (is_ref nil))
                                (declare (array args))
                                (when (eq nil ctx)
                                   (console.error "tokenize: nil ctx passed: " (clone args))
                                   (throw ReferenceError "nil/undefined ctx passed to tokenize"))
                                (when (and (is_array? args)
                                           (not _suppress_comptime_eval))
                                   
                                   ;; check to see this is an eval_when compile function, and evaluate it if so.
                                   (= args (compile_time_eval ctx args _path))
                                   
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
                                   (first (tokenize [ args ] ctx _path true))
                                   
                                   (and (is_array? args)
                                        (or (== args.0 (quote "=:quotem"))
                                            (== args.0 (quote "=:quote"))
                                            (== args.0 (quote "=:quotel"))))
                                   (do
                                      (= rval (tokenize_quote args _path))
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
                                      
                                      (for_each (arg args)
                                         (do
                                            (inc idx)
                                            (try
                                               (= argdetails (find_in_context ctx arg))
                                               (catch LispSyntaxError (e)
                                                  (progn
                                                     (setq is_error {
                                                                      `error: e.name
                                                                      `source_name: source_name
                                                                      `message: e.message
                                                                      `form: (resolve_path _path expanded_tree)
                                                                      `parent_forms: (or (and (chop _path)
                                                                                              (resolve_path (chop _path) expanded_tree))
                                                                                         [])
                                                                      `invalid: true
                                                                      })
                                                     (set_prop e
                                                        `details is_error
                                                        `handled true)
                                                     (console.error is_error)
                                                     (debug)
                                                     (throw e))))
                                            
                                            (= argvalue argdetails.val)
                                            (= argtype argdetails.type)
                                            
                                            (= is_ref argdetails.ref)
                                            (cond
                                               (== (sub_type arg) "array")
                                               {`type: `arr `__token__:true  `val: (tokenize arg ctx (+ _path idx)) `ref: is_ref `name: nil `path: (+ _path idx) }
                                               (== argtype "Function")
                                               {`type: `fun `__token__:true `val: arg `ref: is_ref `name: (desym_ref arg) `global: argdetails.global `path: (+ _path idx)}
                                               (== argtype "AsyncFunction")
                                               {`type: `asf `__token__:true `val: arg `ref: is_ref `name: (desym_ref arg) `global: argdetails.global `path: (+ _path idx)}
                                               (== argtype "array")
                                               {`type: `array `__token__:true `val: arg `ref: is_ref `name: (desym_ref arg) `global: argdetails.global  `path: (+ _path idx)}
                                               (== argtype "Number")
                                               {`type: `num `__token__:true `val: argvalue `ref: is_ref  `name: (desym_ref arg) `global: argdetails.global `path: (+ _path idx)}
                                               (and (== argtype "String") is_ref)
                                               {`type: `arg `__token__:true `val: argvalue `ref: is_ref `name: (clean_quoted_reference (desym_ref arg)) `global: argdetails.global `local: argdetails.local `path: (+ _path idx) }
                                               (== argtype "String")
                                               {`type: `literal `__token__:true `val:  argvalue `ref: is_ref `name: (clean_quoted_reference (desym_ref arg)) `global: argdetails.global `path: (+ _path idx)}
                                               (== argtype "dom")  ;; we cannot compile DOM elements directly - they must be reproduced on initiation
                                               {`type: `null `__token__:true `val: null `ref: is_ref `name: (clean_quoted_reference (desym_ref arg)) `global: argdetails.global `path: (+ _path idx)}
                                               (is_object? arg)
                                               (do
                                                  {`type: `objlit `__token__:true  `val: (tokenize_object arg ctx (+ _path idx)) `ref: is_ref `name: nil `path: (+ _path idx)})
                                               (and (== argtype "literal") is_ref (== (desym_ref arg) "nil"))
                                               {`type: `null `__token__:true `val: null `ref: true `name: "null" `path: (+ _path idx)}
                                               (and (== argtype "unbound") is_ref (eq nil argvalue))
                                               {`type: "arg" `__token__:true `val: arg `ref: true `name: (clean_quoted_reference (desym_ref arg)) `global: argdetails.global  `path: (+ _path idx)}
                                               (and (== argtype "unbound") is_ref)
                                               {`type: (sub_type argvalue) `__token__:true `val: argvalue `ref: true `name: (clean_quoted_reference (sanitize_js_ref_name (desym_ref arg)))  `path: (+ _path idx)}
                                               else
                                               {`type: argtype `__token__:true  `val: argvalue `ref: is_ref `name: (clean_quoted_reference (desym_ref arg)) `global: argdetails.global `local: argdetails.local `path: (+ _path idx)}))))))))
             
             ;; checks to see if the first argument to the passed array is
             ;; a compile time function, as registered in the environment's definitions
             ;; structure
             
             (comp_time_log (defclog { `prefix: "compile_time_eval" `background: "#C0C0C0" `color: "darkblue" }))
             (compile_time_eval
                (fn (ctx lisp_tree path)
                   (if (and (is_array? lisp_tree)
                            (is_reference? lisp_tree.0)
                            ;; is this a compile time function?  Check the definition in our environment..
                            (aif (-> Environment `symbol_definition (-> lisp_tree.0 `substr 2))
                                 (resolve_path [ `eval_when `compile_time ] it)))
                       
                       (let
                          ((ntree nil)
                           (precompile_function (-> Environment `get_global (-> lisp_tree.0 `substr 2))))
                          (when (verbosity ctx)
                             (comp_time_log path "->" (-> lisp_tree.0 `substr 2) lisp_tree "to function: " (-> lisp_tree `slice 1)) )
                          (try
                             (= ntree (apply precompile_function (-> lisp_tree `slice 1)))
                             
                             (catch Error (e)
                                (do
                                   (set_prop e
                                      `handled true)
                                   (push errors
                                      {
                                        `error: e.name
                                        `message: e.message
                                        `source_name: source_name
                                        `precompilation: true
                                        `form: lisp_tree
                                        `parent_forms: []
                                        `invalid: true
                                        `stack: e.stack
                                        })
                                   (throw e))))
                          (if (eq nil ntree)
                              (push warnings (+ "compile time function " (-> lisp_tree.0 `substr 2) " returned nil"))
                              (do
                                 (= ntree (do_deferred_splice ntree))
                                 (when (not (== (JSON.stringify ntree)
                                                (JSON.stringify lisp_tree)))
                                    (= ntree (compile_time_eval ctx ntree path)))
                                 (when (verbosity ctx)
                                    (comp_time_log (-> lisp_tree.0 `substr 2) "<- lisp: ", (as_lisp ntree)))))
                          ntree)
                       
                       lisp_tree)))
             
             ;; Handles prefix to infix transformations
             
             (infix_ops   (fn (tokens ctx opts)
                              (let
                                 ((op_translation {
                                                     `or: "||"
                                                     `and: "&&"
                                                     })
                                  (ctx (new_ctx ctx))
                                  (math_op_a (prop (first tokens) `name))
                                  (math_op (or (prop op_translation math_op_a) math_op_a))
                                  (idx 0)
                                  (stmts nil)
                                  (declaration (if (is_string? tokens.1.name)
                                                    (get_declarations ctx tokens.1.name (not tokens.1.ref))
                                                    nil))
                                  
                                  (symbol_ctx_val (if (and tokens.1.ref (is_string? tokens.1.name))
                                                       (get_ctx_val ctx tokens.1.name)))
                                  (is_overloaded false)
                                  (token nil)
                                  (add_operand (fn ()
                                                   (when (and (> idx 1)
                                                              (< idx (- tokens.length 0)))
                                                      (push acc math_op)
                                                      (push acc " "))))
                                  (acc [{"ctype":"expression"}]))
                                 
                                 (set_ctx ctx
                                          `__COMP_INFIX_OPS__
                                          true)
                                 (when (and (is_array? symbol_ctx_val)
                                            symbol_ctx_val.0.ctype)
                                    (= symbol_ctx_val symbol_ctx_val.0.ctype))
                                 
                                 (when (and (or (== declaration.type Array)
                                                (== declaration.type Object)
                                                (== symbol_ctx_val `objliteral)
                                                (== symbol_ctx_val Expression)
                                                (== symbol_ctx_val ArgumentType)
                                                (== tokens.1.type `objlit)
                                                (== tokens.1.type `arr))
                                            (== math_op `+))
                                    (= is_overloaded true))
                                 
                                 (if is_overloaded
                                    (do
                                       (set_prop tokens
                                          0
                                          { `type: "function"
                                            `val: (+ (quote "=:") `add)
                                            `name: "add"
                                            `ref: true })
                                       (set_prop ctx
                                          `block_step 0)
                                       (= stmts (compile_wrapper_fn tokens ctx))
                                       stmts)
                                    
                                    (do
                                       (push acc "(")
                                       (while (< idx (- tokens.length 1))
                                          (do
                                             (inc idx)
                                             (= token (prop tokens idx))
                                             (add_operand)
                                             (set_prop ctx
                                                `block_step 0)
                                             (push acc (compile_wrapper_fn token ctx))))
                                       (push acc ")")
                                       acc)))))
             
             
             ;; The compile_* series of functions perform the various implementations of the
             ;; language features.  Each take the tokens, and the current context structure and
             ;; return arrays containing javascript tokens.  The returned arrays can be nested
             ;; but the nesting is completely flattened when the javascript tokens are assembled
             ;; into the final output text.
             
             (compile_set_prop (fn (tokens ctx)
                                   (let
                                      ((acc [])
                                       (wrapper [])
                                       (stmt nil)
                                       (preamble (calling_preamble ctx))
                                       (token (second tokens))
                                       (ctx (new_ctx ctx))
                                       (complicated (is_complex? token.val))
                                       (target (if complicated
                                                    (compile_wrapper_fn token.val ctx)
                                                    (compile token ctx)))
                                       (target_reference (gen_temp_name "target_obj"))
                                       (idx 1))
                                      (declare (string preamble.0 preamble.1))
                                      
                                      (if (== token.name "this")
                                          (progn
                                             (push acc "this.")
                                             (push acc tokens.2.name)
                                             (push acc "=")
                                             (push acc (compile_wrapper_fn tokens.3 ctx))
                                             acc)
                                          (progn
                                             (set_new_completion_scope ctx)
                                             (for_each (t [ preamble.0 " " preamble.1 " " preamble.3  "function" "()" "{" ])
                                                (push wrapper t))
                                             (if (not (is_string? target))
                                                 (for_each (t [ "let" " " target_reference "=" target ";" ] )
                                                    (push wrapper t))
                                                 (do
                                                    (= target_reference target)))
                                             (while (< idx (- tokens.length 1))
                                                (do
                                                   (inc idx)
                                                   (push acc target_reference)
                                                   (= token (prop tokens idx))
                                                   (push acc "[")
                                                   (= stmt (compile_as_call token ctx))
                                                   (push acc stmt)
                                                   (push acc "]")
                                                   (inc idx)
                                                   (push acc "=")
                                                   (= token (prop tokens idx))
                                                   (if (eq nil token)
                                                       (throw SyntaxError "set_prop: odd number of arguments"))
                                                   (= stmt (compile_wrapper_fn token ctx))
                                                   (push acc stmt)
                                                   (push acc ";")))
                                             
                                             (push wrapper acc)
                                             (push wrapper "return")
                                             (push wrapper " ")
                                             (push wrapper target_reference)
                                             (push wrapper ";")
                                             (push wrapper "}")
                                             (push wrapper preamble.4)
                                             (push wrapper "()")
                                             wrapper)))))
             
             
             (compile_prop  (fn (tokens ctx)
                                (if (not (== tokens.length 3))
                                    (do
                                       (throw SyntaxError "prop requires exactly 2 arguments"))
                                    (let
                                       ((acc [])
                                        (target (compile_wrapper_fn (second tokens) ctx))
                                        (target_val nil)
                                        (preamble (calling_preamble ctx))
                                        (idx_key (compile_wrapper_fn (prop tokens 2) ctx)))
                                       (declare (string preamble.0))
                                       (if (> (safety_level ctx) 1)
                                           (cond
                                              (is_string? target)
                                              (do
                                                 [ target "[" idx_key "]" ])
                                              else
                                              (do
                                                 (= target_val (gen_temp_name "targ"))
                                                 [preamble.0 " " "(" preamble.1 " " "function" "()" "{"
                                                  "let" " " target_val "=" target ";"
                                                  "if" " " "(" target_val ")" "{" " " "return" "(" target_val ")" "[" idx_key "]" "}" " " "}" ")" "()" ]))
                                           [ "(" target ")" "[" idx_key "]"])))))
             
             (compile_elem (fn (token ctx)
                               (let
                                  ((rval nil))
                                  (console.warn "compile_elem - deprecated: check call: " token)
                                  (if (or (is_complex? token.val)
                                          (and (is_array? token.val)
                                               (== token.val.0.name "if")))
                                      (= rval (compile_wrapper_fn token ctx))
                                      (= rval (compile token ctx)))
                                  (when (not (is_array? rval))
                                     (= rval [ rval ]))
                                  rval)))
             
             (inline_log (if opts.quiet_mode
                              log
                              (defclog { `prefix: "compile_inline:" `background: "#404880" `color: "white" } )))
             
             
             ;; Inlines are JS phrases that are used for efficient coding of Javascript
             ;; operations. If an inline is registered for the operator name in the
             ;; Environment, the compiler will use it in instead of a call to a
             ;; function.  They typically have a function analog, otherwise apply
             ;; and other mechanisms will fail because there is no corresponding function.
             
             ;; Inline Example: (lowercase mystring) expands to "(mystring).toLowerCase()' in JS
             ;; All inlines should have a corresponding global function definition.
             
             ;; Most of the compile_* functions are essentially inline generators of
             ;; varying sophistication.
             
             (compile_inline (fn (tokens ctx)
                                 (let
                                    ((rval nil)
                                     (stmt nil)
                                     (inline_fn nil)
                                     (has_literal? false)
                                     (wrap_style 0)
                                     (args []))
                                    
                                    ;; compile the arguments first to determine if they are candidates
                                    ;; for inline opportunities
                                    
                                    (for_each (token (-> tokens `slice 1))
                                       (do
                                          (= stmt (compile_wrapper_fn token ctx) ctx)
                                          (push args stmt)))
                                    (when (verbosity)
                                       (inline_log "args: " args))
                                    (if (prop Environment.inlines tokens.0.name)
                                        (do
                                           (= inline_fn (prop Environment.inlines tokens.0.name))
                                           (= rval (inline_fn
                                                      args ctx)))
                                        (throw ReferenceError (+ "no source for named lib function " tokens.0.name)))
                                    rval)))
             
             (compile_push (fn (tokens ctx)
                               (let
                                  ((acc [])
                                   (place (compile_wrapper_fn tokens.1 ctx))
                                   (thing (compile_wrapper_fn tokens.2 ctx)))
                                  [ place ".push" "(" thing ")"])))
             
             
             ;; Javascript doesn't have true Lisp linked list structures
             ;; as a native feature.  When a (list ...) form is compiled
             ;; underneath it is really an array.  In practice in this
             ;; lisp, it really doesn't matter, and the car,cdr concepts
             ;; are not missed.
             
             ;; Something fun to try would be to make an implementation
             ;; of linked lists in WebAssembly..
             
             ;; So compile_list just compiles each argument and returns
             ;; an array with those values.
             
             (compile_list  (fn (tokens ctx)
                                (let
                                   ((acc ["["])
                                    (compiled_values []))
                                   (aif (get_ctx_val ctx "assignment_for")
                                        (set_declaration ctx it `type Array))
                                   (for_each (t (-> tokens `slice 1))
                                      (push compiled_values
                                         (compile_wrapper_fn t ctx)))
                                   
                                   (push_as_arg_list acc compiled_values)
                                   (push acc "]")
                                   acc)))
             
             (compile_typeof  (fn (tokens ctx)
                                  (do
                                     (defvar local_details (if tokens.1.ref
                                                               (get_ctx_val ctx tokens.1.name)
                                                               nil))
                                     (defvar fully_qualified (if (and tokens.1.name
                                                                      (contains? "/" tokens.1.name))
                                                                 true
                                                                 false))
                                     (when (verbosity ctx)
                                        (console.log "compile_typeof -> " tokens))
                                     (when (< tokens.length 2)
                                        (throw SyntaxError "typeof requires 1 argument"))
                                     (cond
                                        (and tokens.1.ref
                                           local_details)
                                        ["typeof" " " (compile tokens.1 ctx)]
                                        (and tokens.1.ref
                                           (get_lisp_ctx ctx tokens.1.name))
                                        ["typeof" " " (compile tokens.1 ctx)]
                                        tokens.1.ref                                    ;; defer any not found errors
                                        ["(" "typeof" " " "(" "function" "() { let __tval=" (compile_lisp_scoped_reference tokens.1.name ctx true) "; if (__tval === ReferenceError) return undefined; else return __tval; }" ")()" ")" ]
                                        else
                                        ["typeof" " " (compile_wrapper_fn tokens.1 ctx) ]))))
             
             (compile_instanceof  (fn (tokens ctx)
                                      (let
                                         ((acc []))
                                         
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
                                             (throw SyntaxError
                                                "instanceof requires 2 arguments")))))
             
             
             ;; Comparisons between values for various built in operators
             
             (compile_compare (fn (tokens ctx)
                                  (let
                                     ((acc [{ `ctype: "expression" } ])
                                      (ctx (new_ctx ctx))
                                      (ops {
                                              `eq: "=="
                                              `==: "==="
                                              `<:   "<"
                                              `>:  ">"
                                              `gt: ">"
                                              `lt: "<"
                                              `<=: "<="
                                              `>=: ">="
                                              })
                                      (operator (prop ops
                                                       (prop (first tokens) `name)))
                                      
                                      (left (prop tokens 1))
                                      (right (prop tokens 2)))
                                     (when (< tokens.length 3)
                                        (throw SyntaxError "comparison operation requires 2 arguments"))
                                     (set_ctx ctx
                                              `__COMP_INFIX_OPS__
                                              true)
                                     
                                     (push acc "(")
                                     (push acc (compile left ctx))
                                     (push acc operator)
                                     (push acc (compile right ctx))
                                     (push acc ")")
                                     acc)))
             (assignment_log (defclog { color: "red" background: "black" prefix: "compile_assignment" }))
             (compile_assignment
                (fn (tokens ctx)
                   (let
                      ((acc [])
                       (token (second tokens))
                       (assignment_value (if (< tokens.length 3)
                                              (throw SyntaxError "assignment is missing a value argument")
                                              nil))
                       (assignment_type nil)
                       (wrap_as_function? nil)
                       (preamble (calling_preamble ctx))
                       (comps [])
                       (sanitized (if (and token.ref
                                            token.name)
                                       (sanitize_js_ref_name token.name)
                                       (throw SyntaxError (+ "assignment: missing assignment symbol"))))
                       (target_details (cond
                                           (get_ctx ctx sanitized)
                                           "local"
                                           (get_lisp_ctx ctx token.name)
                                           "global"
                                           else
                                           (progn
                                              (aif (get_declaration_details ctx token.name)
                                                   (cond
                                                      it.is_argument
                                                      "local"
                                                      it.declared_global
                                                      "global"
                                                      it
                                                      "local")))))
                       (target (if (== target_details "local")
                                    sanitized
                                    token.name)))
                      (declare (string preamble.0))
                      
                      
                      (= comps (split_by "." target))
                      
                      (if (== undefined target_details)
                          (throw ReferenceError (+ "assignment to undeclared symbol: " token.name)))
                      (if (> comps.length 1)
                          (throw SyntaxError (+ "invalid assignment to an object property, use set_prop instead: " target)))
                      (when (and (== tokens.2.type "arr")
                                 (== tokens.2.val.0.type "special")
                                 (== tokens.2.val.0.name "defvar"))
                         (throw SyntaxError "cannot assign result of the allocation operator defvar"))
                      
                      (unset_ambiguous ctx target)
                     
                      (set_prop ctx
                         `in_assignment true)
                      (when (verbosity ctx)
                         (assignment_log "identifier: " sanitized " where:" target_details
                                         "ctx: " ctx)
                         (assignment_log "value tokens: " tokens.2))
                      (= assignment_value (compile_wrapper_fn tokens.2 ctx))
                      (when (verbosity ctx)
                         (assignment_log "assignment value: " assignment_value))
                      (if (and (is_array? assignment_value)
                               (is_object? assignment_value.0)
                               assignment_value.0.ctype)
                          (do
                             (= assignment_type
                                (map_ctype_to_value assignment_value.0.ctype assignment_value)))
                          (do
                             (set_ambiguous ctx target)
                             (= assignment_type
                                UnknownType)))
                      (if (== target_details "local")
                          (do
                             (set_ctx ctx
                                      target
                                      assignment_type)
                             (push acc target)
                             (push acc "=")
                             (push acc assignment_value))
                          (do
                             (for_each (t [{ `ctype: "statement"} preamble.0 " " "Environment" "." "set_global" "(" "\"" target "\"" "," assignment_value ")"])
                                (push acc t))))
                      
                      (set_prop ctx
                         `in_assignment false)
                      
                      (if (== target_details "local")
                          (set_ctx ctx
                                   target
                                   assignment_type))
                      
                      acc)))
             
             ;; In the top-level mode, if the form is a progn form, each of its body forms is sequentially processed
             ;; as a top level form in the same processing mode.  Otherwise, they are compiled and evaluated as a
             ;; unit in a lambda.
             
             (top_level_log (defclog { `prefix: "top-level" `color: `darkgreen `background: "#300010" } ))
             (compile_toplevel
                (fn (lisp_tree ctx block_options)
                   (if (get_ctx_val ctx `__IN_LAMBDA__)
                       (throw EvalError "Compiler attempt to compile top-level in lambda (most likely a bug)")
                       (do
                          (let
                             ((idx 0)
                              (rval nil)
                              (tokens nil)
                              (stmt nil)
                              (base_ctx ctx)
                              (num_non_return_statements (- (length lisp_tree) 2))
                              (ctx (if block_options.no_scope_boundary
                                        ctx
                                        (new_ctx ctx))))
                             (while (< idx num_non_return_statements)
                                (do
                                   (inc idx)
                                   ;; since we are in a top level mode we need to reset the has_first_level flag
                                   ;; or we will get reference errors on subsequent compilations for __GG__
                                   
                                   (= ctx (new_ctx ctx))
                                   (set_new_completion_scope ctx)
                                   (set_ctx ctx `__TOP_LEVEL__ true)
                                   
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
             
             
             ;; detemines if to place a return on the final statement in the statement list
             ;; call after each block (root or sub)
             (check_statement_completion (fn (ctx stmts)
                                             (let
                                                ((stmt (if (eq nil stmts)
                                                           (throw "compiler error: check_statement_completion: received undefined/nil statement array.")
                                                           (last stmts)))
                                                 (cmp_rec (get_ctx ctx `__COMPLETION_SCOPE__))
                                                 (clog (if quiet_mode
                                                            log
                                                            (defclog { `prefix: (+ "check_statement_completion (bid: " ctx.block_id " cid: " cmp_rec.id  "):")
                                                                  `background: "#704080" `color: "white"})))
                                                 )  ;; get the completion scope record from context...
                                                ;; check to see if it is the final root block step..
                                                ;; and doesn't already contain a completion structure..if it does mark it
                                                
                                                (when (verbosity ctx)
                                                   (clog "check_statement_completion: lambda_step: " (get_ctx ctx `__LAMBDA_STEP__)))
                                                (if  (and (== ctx.block_step 0)
                                                          (not (contains? stmt.0.ctype ["block" "ifblock" "tryblock" "letblock"]))
                                                          (not (contains? stmt.0.completion completion_types))
                                                          (not (== cmp_rec.scope_type `arrow))
                                                          (not (== cmp_rec.scope_type `generator))
                                                          (not (== stmt.0.0 "yield")))
                                                    
                                                    (do
                                                       (when (verbosity ctx) (clog "rule 1" (clone cmp_rec) (clone stmts)))
                                                       (pop stmts) ;; remove the last statement - we already have it
                                                       (assert cmp_rec "compiler error: check_statement_completion unable to find completion_scope record in context")
                                                       (if (and (is_object? stmt.0)
                                                                (not (is_array? stmt.0)))
                                                           (do
                                                              (set_prop stmt.0
                                                                 `completion
                                                                 "return")
                                                              (if (== stmt.0.ctype "__JS__")
                                                                  (push stmts
                                                                     [ stmt ])
                                                                  (push stmts
                                                                     [ stmt.0 "return " (rest stmt) ]))
                                                              (when (verbosity ctx) (clog "added return rule 1A"))
                                                              (push cmp_rec.completion_records
                                                                 {
                                                                   `block_id: ctx.block_id
                                                                   `block_step: ctx.block_step
                                                                   `type: "return"
                                                                   `stmt: (last stmts)
                                                                   }))
                                                           
                                                           (do
                                                              (if (and (not (== cmp_rec.scope_type `arrow))
                                                                       (not (== cmp_rec.scope_type `generator)))
                                                                  (push stmts
                                                                     [ { `completion: "return" } "return " stmt]))
                                                              (when (verbosity ctx) (clog "added return rule 1B"))
                                                              (push cmp_rec.completion_records
                                                                 {
                                                                   `block_id: ctx.block_id
                                                                   `type: "return"
                                                                   `block_step: ctx.block_step
                                                                   `stmt: (last stmts)
                                                                   })))
                                                       stmts)
                                                    (do
                                                       stmts)))))
             
             (compile_block (fn (tokens ctx block_options)
                                (let
                                   ((acc [])
                                    (block_id (or (and block_options.name
                                                        (+ block_options.name (inc blk_counter)))
                                                   (inc blk_counter)))
                                    (clog (if quiet_mode
                                               log
                                               (defclog { `prefix: (+ "compile_block (" block_id "):")
                                                                  `background: "#404080" `color: "white"})))
                                    (ctx (if block_options.force_no_new_ctx ;;block_options.no_scope_boundary
                                              ctx
                                              (new_ctx ctx))) ;; get a local reference
                                    (token nil)
                                    (block_type `sub)
                                    (last_stmt nil)
                                    (is_first_level false)
                                    (return_last ctx.return_last_value)
                                    (stmt nil)
                                    (subacc [])
                                    (completion_scope (get_ctx ctx `__COMPLETION_SCOPE__))
                                    (stmt_ctype nil)
                                    (lambda_block false)
                                    (stmts [])
                                    (idx 0))
                                   (when (eq nil ctx)
                                      (throw ReferenceError "undefined ctx passed to compile block"))
                                   
                                   (when needs_first_level
                                      (= is_first_level true)
                                      (= needs_first_level false))  ;; set a rapid way to determine this since we only do this once per compilation
                                   
                                   (when opts.include_source
                                      (when (and tokens.path
                                                 (> tokens.path.length 0))
                                         (push acc
                                            (source_comment tokens))))
                                   (set_prop ctx
                                      `block_id
                                      block_id)
                                   (when (verbosity ctx)
                                      (clog "source ->" (if (and (is_array? tokens)
                                                                 (== tokens.0 "PLACEHOLDER"))
                                                            (source_from_tokens tokens.1 expanded_tree)
                                                            (source_from_tokens tokens expanded_tree)))
                                      (clog "tokens:" tokens)
                                      (clog "block_options: " (clone block_options) "ctx: " (clone ctx))
                                      (clog "initial_completion_scope: " (clone completion_scope)))
                                   (assert completion_scope "block called with no completion scope")
                                   (assert (is_object? completion_scope) "block called with an invalid completion scope")
                                   (if completion_scope.root_block_id
                                      (do
                                         (set_ctx ctx
                                                  `__IN_SUB_BLOCK__
                                                  true))
                                      (do
                                         (set_prop completion_scope
                                            `root_block_id
                                            block_id)
                                         (= block_type "root")
                                         (set_ctx ctx
                                                  `__IN_SUB_BLOCK__
                                                  false)))
                                   
                                   (when block_options.no_scope_boundary
                                      (set_prop ctx
                                         `no_scope_boundary
                                         true))
                                   
                                   (when (== (get_ctx_val ctx `__LAMBDA_STEP__) -1)
                                      (= lambda_block true)
                                      (setf_ctx ctx `__LAMBDA_STEP__
                                         (- tokens.length 1)))
                                   
                                   ;(when (not block_options.no_scope_boundary)
                                   ;  (push acc "{"))
                                   
                                   (when is_first_level
                                      (push acc first_level_setup ))
                                   (set_prop ctx
                                      `final_block_statement
                                      false)
                                   ;; run through the block statements
                                   (while (< idx (- tokens.length 1))
                                      (do
                                         (inc idx)
                                         (= subacc [])
                                         (= token (prop tokens idx))
                                         
                                         (when (== idx (- tokens.length 1))
                                            (set_prop ctx
                                               `final_block_statement
                                               true))
                                         (if (== block_type "root")
                                             (set_prop ctx
                                                `block_step
                                                (- tokens.length 1 idx)))
                                         (set_prop ctx
                                            `sub_block_step
                                            (- tokens.length 1 idx))
                                         
                                         (when lambda_block
                                            (set_ctx ctx "__LAMBDA_STEP__"
                                                     (- tokens.length 1 idx)))
                                         
                                         (when (verbosity ctx)
                                            (clog "sbs: " (- tokens.length 1 idx) block_type "block step: " ctx.block_step (source_from_tokens token expanded_tree) token))
                                         ;; get the compiled statement
                                         
                                         (cond
                                            (and (== block_type "root")
                                                 (== token.type "arr")
                                                 (== token.val.0.name "return"))
                                            (do
                                               (= stmt (compile_return token.val ctx)))
                                            
                                            (and (== token.val.0.name "declare")
                                                 block_options.ignore_declarations)
                                            (= stmt { `ignored: "declare" } )
                                            
                                            (and (> (- tokens.length 1 idx) 0)
                                                 (== token.val.0.type "special")
                                                 (or (== token.val.0.name "if")
                                                     (== token.val.0.name "try")))
                                            (let
                                               ((subctx (new_ctx ctx)))
                                               (set_prop subctx
                                                  `block_step
                                                  (- tokens.length 1 idx))
                                               (if (== token.val.0.name "if")
                                                   (= stmt (compile_if token.val subctx))
                                                   (= stmt (compile_try token.val subctx))))
                                            
                                            (and (> (- tokens.length 1 idx) 0)
                                                 (== token.val.0.type "special")
                                                 (contains? token.val.0.name [ "progn" "do" "let" ]))
                                            (progn 
                                               (when (verbosity ctx)
                                                  (clog "candidate problem: compiling wrapper"))
                                               (= stmt (compile_wrapper_fn token ctx)))
                                            ;; compile the statement
                                            else
                                            (= stmt (compile token ctx)))
                                         
                                         ;; now assess the statement
                                         ;; pull the statement type record, which should be the first record of the stmt array
                                         (when (== stmt undefined)
                                            (if is_error
                                               (= stmt [ { `ctype: Error } "ERROR_STATE" ])
                                               (throw EvalError "compile_block: returned stmt is undefined")))
                                         
                                         ;; add the statement to the statement block list
                                         
                                         (push stmts stmt)
                                         (when (< idx (- tokens.length 1))
                                            (push stmts ";"))))
                                   
                                   ;; Now depending on the last value in the stmts array, insert a return
                                   
                                   ;; if are a subblock, but the root block_step is 0, meaning we are at
                                   ;; the end of the block, check the last statement for a completion type value
                                   (check_statement_completion ctx stmts)
                                   (push acc stmts)
                                   (when (not block_options.no_scope_boundary)
                                      (prepend acc "{")
                                      (push acc "}"))
                                   
                                   (prepend acc { `ctype: "block" `block_id: block_id `block_options: block_options } )
                                   
                                   acc)))
             
             ;; Various type signifiers...
             
             (Expression (new Function "" "{ return \"expression\" }"))
             (Statement (new Function "" "{ return \"statement\" }"))
             (NumberType (new Function "" "{ return \"number\" }"))
             (StringType (new Function "" "{ return \"string\" }"))
             (NilType (new Function "" "{ return \"nil\" }"))
             (UnknownType (new Function "" " { return \"unknown\"} "))
             (ArgumentType (new Function "" " { return \"argument\" }"))
             
             (compile_defvar (fn (tokens ctx opts)
                                 (let
                                    ((target (clean_quoted_reference (sanitize_js_ref_name tokens.1.name)))
                                     (wrap_as_function? nil)
                                     (ctx_details nil)
                                     (ctx ctx)
                                     (allocation_type (if opts.constant
                                                           "const"
                                                           "let"))
                                     (assignment_type nil)
                                     (assignment_value nil))
                                    
                                    ;(console.log "defvar: target: " (is_complex? tokens.2) target (clone ctx) "tokens: " tokens)
                                    (when (< tokens.length 2)
                                       (throw SyntaxError (+ "defvar requires 2 arguments, received " (- tokens.length 1))))
                                    (when (and ctx.final_block_statement
                                               (not ctx.no_scope_boundary))
                                       (throw SyntaxError "defvar has no effect at end of block scope"))
                                    (= assignment_value
                                       (do
                                          (compile_wrapper_fn tokens.2 ctx)))
                                    
                                    (= ctx_details (get_declaration_details ctx target))
                                    (= assignment_type (+ {} ctx_details
                                                          (get_declarations ctx target)))
                                    (cond
                                       (and (is_array? assignment_value)
                                            (is_object? assignment_value.0)
                                            assignment_value.0.ctype)
                                       (do
                                          (set_ctx ctx
                                                   target
                                                   (map_ctype_to_value assignment_value.0.ctype assignment_value)))
                                       
                                       (is_function? assignment_type.value)
                                       (set_ctx ctx
                                                target
                                                assignment_type.value)
                                       else
                                       (set_ctx ctx
                                                target
                                                assignment_value))
                                    
                                    (if ctx.defvar_eval
                                       (do
                                          (delete_prop ctx
                                             `defvar_eval)
                                          [{ `ctype: "assignment"  } allocation_type " " target "=" assignment_value "()" ";"])
                                       
                                       [ { `ctype: "assignment"  }
                                          (if (and ctx_details.is_argument
                                                   (==  ctx_details.levels_up 1))
                                              ""
                                              (+ allocation_type " "))
                                          "" target "=" (list assignment_value) ";"]))))
             
             
             ;; checks to see what has been declared during compilation and returns where
             ;; it only checks for declarations that have occurred during the compile phase
             
             (get_declaration_details (fn (ctx symname _levels_up)
                                          (progn
                                             
                                             (cond
                                                (and (prop ctx.scope symname)
                                                     (prop ctx `lambda_scope))
                                                {
                                                  `name: symname
                                                  `is_argument: true
                                                  `levels_up: (or _levels_up 0)
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
                                                  
                                                  `declared_global: true }))))
             
             (clean_quoted_reference
                (fn (name)
                   (cond
                      (and (is_string? name)
                           (starts_with? "\"" name)
                           (ends_with? "\"" name))
                      (-> (-> name `substr 1)
                          `substr 0 (- (length name) 2))
                      else
                      name)))
             
             (compile_let (fn (tokens ctx)
                              (let
                                 ((acc [])
                                  (ctx (new_ctx ctx))
                                  (clog (if quiet_mode
                                             log
                                             (defclog { `prefix: (+ "compile_let: " (or ctx.block_id "")) `background: "#B0A0F0" `color: "black"})))
                                  (token nil)
                                  (declarations_handled false)
                                  (assignment_value nil)
                                  (suppress_return nil)
                                  (block_declarations {})
                                  (my_tokens tokens)
                                  (assignment_type nil)
                                  (stmt nil)
                                  (def_idx nil)
                                  (redefinitions {})  ;; maps symbols that are already defined in scope to tmp variables in a JS block...
                                  ;; which are then redefined with local shadowing: ALREADY DEFINED SYMBOL->TEMP_SYMBOL
                                  (need_sub_block false)
                                  (assignments {})
                                  (reference_name nil)
                                  (shadowed_globals {})
                                  (alloc_set nil)
                                  (is_first_level false)
                                  (sub_block_count 0)
                                  (ctx_details nil)
                                  (preamble (calling_preamble ctx))
                                  (structure_validation_rules [ [[1 `val] (list is_array?) "allocation section"]
                                                                [[2] (list (fn (v) (not (== v undefined)))) "block"]])
                                  
                                  (validation_results nil)
                                  (allocations tokens.1.val)
                                  (block (-> tokens `slice 2))
                                  (syntax_error nil)
                                  (idx -1))
                                 
                                 (declare (string preamble.0 preamble.1 preamble.2))
                                 
                                 ;; validate the let structure if we have the functionality
                                 
                                 (if (not (is_array? allocations))
                                     (throw SyntaxError "let: missing/malformed allocation section"))
                                 
                                 (if (== block.length 0)
                                     (throw SyntaxError "let: missing block"))
                                 
                                 (set_prop ctx
                                    `return_last_value
                                    true)
                                 
                                 (set_ctx ctx `__LOCAL_SCOPE__
                                          true)
                                 
                                 
                                 (when (verbosity ctx)
                                    (clog "->" (source_from_tokens tokens expanded_tree))
                                    (clog "ctx: " (clone ctx)))
                                 ;; start the main block
                                 (push acc "{")
                                 (inc sub_block_count)
                                 
                                 ;; let must be two pass, because we need to know all the symbol names being defined in the
                                 ;; allocation block because let allows us to refer to symbol names out of order, similar to
                                 ;; let* in Common Lisp.
                                 
                                 ;; Check declaration details if they exist in the first form of the block form
                                 
                                 (when (== block.0.val.0.name "declare")
                                    (= declarations_handled true)
                                    (push acc (compile_declare block.0.val ctx)))
                                 
                                 (when needs_first_level                       ;; if we are on the first level, do some setup for aliases for easier code reading, etc..
                                    (= is_first_level true)
                                    (= needs_first_level false)
                                    (when is_first_level
                                       (push acc first_level_setup)))
                                 
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
                                       (assert (and (is_string? reference_name)
                                                    (> (length reference_name) 0))
                                               (+ "Invalid reference name: " alloc_set.0.name))
                                       (= ctx_details (get_declaration_details ctx reference_name))
                                       (when ctx_details
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
                                       
                                       (cond
                                          (is_array? alloc_set.1.val)
                                          (do
                                             (set_prop ctx
                                                `in_assignment
                                                true)
                                             (set_ctx ctx
                                                      `assignment_for
                                                      reference_name)
                                             (= assignment_value (compile_wrapper_fn alloc_set.1 ctx))
                                             (set_ctx ctx
                                                      `assignment_for
                                                      nil)
                                             (set_prop ctx
                                                `in_assignment
                                                false))
                                          
                                          ;; local shadow of a globally declared variable
                                          (and (is_string? alloc_set.1.name)
                                               (not ctx_details.is_argument)
                                               alloc_set.1.ref
                                               (not (== (-> Environment `get_global alloc_set.1.name NOT_FOUND_THING) NOT_FOUND_THING))
                                               (prop shadowed_globals alloc_set.0.name))
                                          
                                          (do
                                             (= assignment_value [{`ctype: ctx_details.value } "await" " " env_ref  "get_global" "(" "\"" alloc_set.1.name "\"" ")" ]))
                                          else
                                          (do
                                             (set_ctx ctx
                                                      `assignment_for
                                                      reference_name)
                                             (= assignment_value (compile_wrapper_fn alloc_set.1 ctx ))
                                             (set_ctx ctx
                                                      `assignment_for
                                                      nil)
                                             (when (verbosity ctx)
                                                (clog "setting simple assignment value for" reference_name ": <- " (clone assignment_value)))))
                                       
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
                                             (set_ctx ctx
                                                      reference_name
                                                      assignment_value)))
                                       
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
                                             
                                             (for_each (t ["let" " " (prop (prop redefinitions reference_name) def_idx) "=" " " preamble.1 " " "function" "()" "{" "return" " " assignment_value "}" ";"])
                                                (push acc t)))
                                          ;; if the name isn't shadowing declare it, so it can be used if referenced by others
                                          (not (prop block_declarations reference_name))
                                          (do
                                             (for_each (t ["let" " " reference_name ";" ])
                                                (push acc t))
                                             (set_prop block_declarations reference_name true)))
                                       (when (not (prop assignments reference_name))
                                          (set_prop assignments
                                             reference_name
                                             []))
                                       (push (prop assignments
                                                   reference_name)
                                             (if def_idx
                                                [preamble.0 " " (prop (prop redefinitions reference_name) def_idx) "()" ";" ]
                                                assignment_value))))
                                 
                                 (when need_sub_block
                                    (for_each (pset (pairs redefinitions))
                                       (do
                                          (for_each (redef pset.1)
                                             (take (prop redefinitions pset.0))))))
                                 
                                 
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
                                       
                                       (= assignment_value (take (prop assignments reference_name)))
                                       
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
                                       (push acc stmt)))
                                 
                                 
                                 (push acc (compile_block (conj ["PLACEHOLDER"]
                                                                block)
                                                          ctx
                                                          {
                                                            `no_scope_boundary: true
                                                            `suppress_return: suppress_return
                                                            `ignore_declarations: declarations_handled
                                                            }))
                                 (for_each (i (range sub_block_count))
                                    (push acc "}"))
                                 
                                 (if false ; (== ctx.return_point 1)
                                    acc
                                    (do
                                       (prepend acc { `ctype: "letblock" `block_step: ctx.parent.block_step })
                                       acc)))))
             
             
             (in_sync? (fn (ctx)
                           (get_ctx ctx "__SYNCF__")))
             (await? (fn (ctx)
                         (if (in_sync? ctx)
                             ""
                             "await")))
             (calling_preamble (fn (ctx)
                                   (if (in_sync? ctx)
                                       ["" "" { `ctype: "Function" `block_step: 0 } "(" ")" ]
                                       ["await" "async" { `ctype: "AsyncFunction" `block_step: 0 } "" "" ])))
             (fn_log (defclog { `prefix: "compile_fn" `background: "black" `color: `lightblue }))
             (comp_scope_log (defclog { `prefix: "set_new_completion_scope" `background: "#A000A0" `color: `white }))
             (completion_scope_id 0)
             (set_new_completion_scope (fn (ctx)
                                           (let
                                              ((completion_scope {
                                                                   id: (inc completion_scope_id)
                                                                   root_block_id: nil
                                                                   completion_records: []
                                                                   is_top: false
                                                                   }))
                                              (set_ctx ctx
                                                       `__COMPLETION_SCOPE__
                                                       completion_scope)
                                              (set_ctx ctx
                                                       `__COMP_INFIX_OPS__
                                                       nil)
                                              (when (verbosity ctx)
                                                 (comp_scope_log "-> id: " completion_scope.id  completion_scope (clone ctx)))
                                              completion_scope)))
             (compile_fn (fn (tokens ctx fn_opts)
                             (let
                                ((acc [])
                                 (idx -1)
                                 (arg nil)
                                 (ctx (new_ctx ctx))
                                 (fn_args tokens.1.val)
                                 (body tokens.2)
                                 (external_declarations tokens.3)
                                 (type_mark nil)
                                 (source (if (verbosity ctx)
                                              (source_from_tokens tokens expanded_tree)
                                              nil))
                                 (completion_scope nil)
                                 (nbody nil))
                                
                                (set_prop ctx.scope
                                   `__SOURCE__ source)
                                (when (verbosity ctx)
                                   (fn_log "->" source (clone ctx) (clone fn_opts)))
                                   
                                (= completion_scope (set_new_completion_scope ctx))
                                (when (eq undefined body)
                                   (throw SyntaxError "Invalid function call syntax"))
                                
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
                                      (set_ctx ctx "__SYNCF__" true)
                                      (set_prop completion_scope
                                         `in_sync
                                         true)
                                      (push acc type_mark))
                                   fn_opts.arrow
                                   (do
                                      (= type_mark (type_marker `Function))
                                      (push acc type_mark))
                                   fn_opts.generator
                                   (do
                                      (set_ctx ctx "__SYNCF__" true)
                                      (= type_mark (type_marker `GeneratorFunction))
                                      (push acc type_mark)
                                      ;(push acc "async")
                                      (push acc " "))
                                   else
                                   (do
                                      (= type_mark (type_marker `AsyncFunction))
                                      (push acc type_mark)
                                      
                                      (push acc "async")
                                      (push acc " ")))  ;; async by default
                                
                                
                                (set_prop type_mark
                                   `args
                                   [])
                                (cond
                                   fn_opts.arrow
                                   (set_prop completion_scope
                                      `scope_type
                                      `arrow)
                                   fn_opts.generator
                                   (do
                                      (push acc "function*")
                                      (set_prop completion_scope
                                         `scope_type
                                         `generator))
                                   else
                                   (do
                                      (set_prop completion_scope
                                         `scope_type
                                         `function)
                                      (push acc "function")))
                                
                                (push acc "(")
                                (while (< idx (- fn_args.length 1))
                                   (do
                                      (inc idx)
                                      (= arg (prop fn_args idx))
                                      
                                      (if (== arg.name "&")
                                          (do
                                             (inc idx)
                                             (= arg (prop fn_args idx))
                                             (when (eq nil arg)
                                                (throw SyntaxError "Missing argument symbol after &"))
                                             
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
                                
                                (if (or fn_opts.generator
                                        fn_opts.arrow)
                                    (set_prop ctx
                                       `return_last_value
                                       false)
                                    (set_prop ctx
                                       `return_last_value
                                       true))
                                
                                (cond
                                   (== body.val.0.name `let)
                                   (do
                                      (when (verbosity ctx)
                                         (fn_log "calling compile: block is a let"))
                                      (push acc (compile body.val
                                                   ctx)))
                                   (contains? body.val.0.name [ `do `progn `progl ])
                                   (do
                                      (when (verbosity ctx)
                                         (fn_log "calling compile_block due to: " body.val.0.name))
                                      (push acc (compile_block body.val
                                                               ctx
                                                               )))
                                   
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
                                      (push acc { `mark: "nbody"  } )
                                      (when (verbosity ctx)
                                         (fn_log "calling compile_block after making a psuedo-block"))
                                      (push acc (compile_block nbody
                                                               ctx))))
                                ;; validate completion records
                                (cond
                                   (and (not fn_opts.arrow)
                                        (not fn_opts.generator)
                                        (== completion_scope.completion_records.length 0))
                                   (progn
                                      (console.error "internal compile error: no completion records for callable")
                                      (console.log "error provoking source: " (source_from_tokens tokens expanded_tree true))
                                      (console.log "output: " acc)
                                      (defvar internal_syntax_error (new SyntaxError "internal compile error: no completion records for callable"))
                                      (throw internal_syntax_error))
                                   else
                                   ;; do validation check here
                                   true)  ;; stub
                                acc)))
             
             (compile_jslambda (fn (tokens ctx)
                                   (let
                                      ((acc [])
                                       (fn_args tokens.1.val)
                                       (body (compile tokens.2.val ctx))
                                       (idx -1)
                                       (quoted_body [])
                                       (arg nil)
                                       (type_mark (type_marker `Function)))
                                      
                                      (push acc type_mark)
                                      (for_each (t ["new" " " "Function" "("])
                                         (push acc t))
                                      
                                      (when (not (is_string? body))
                                         (throw SyntaxError (+ "Invalid jslambda body, need string, got: " (subtype body))))
                                      
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
                                      (for_each (c (split_by "" body))
                                         (do
                                            (when (not (== c "\n")
                                                       (== c "\r"))
                                               (when (== c "\"")
                                                  (push quoted_body (String.fromCharCode 92)))
                                               (push quoted_body c))))
                                      (push acc (join "" (flatten quoted_body)))
                                      (push acc "\"")
                                      (push acc ")")
                                      acc)))
             
             
             
             (compile_yield (fn (tokens ctx)
                                (let
                                   ((acc [])
                                    (expr nil)
                                    (cmp_rec (get_ctx ctx `__COMPLETION_SCOPE__)))
                                   (push acc [ "yield" " " (compile_wrapper_fn tokens.1 ctx) ";" ])
                                   
                                   (push cmp_rec.completion_records
                                      {
                                        `block_id: ctx.block_id
                                        `block_step: ctx.block_step
                                        `type: "yield"
                                        `stmt: (last acc)
                                        })
                                   acc)))
             
             
             (var_counter 0)
             ;; the complicated form conversions
             (gen_temp_name (fn (arg)
                                (+ "__" (or arg "") "__" (inc var_counter))))
             
             (if_id 0)
             
             (compile_cond (fn (tokens ctx)
                               (let
                                  ((preamble (calling_preamble ctx))
                                   (ctx (new_ctx ctx)))
                                  (declare (string preamble.2))
                                  (set_new_completion_scope ctx)
                                  [preamble.2  preamble.0 " " preamble.1 " " preamble.3 "function" "()" "{" (compile_cond_inner tokens ctx) "} " preamble.4 "()"])))
             
             (compile_cond_inner
                (fn (tokens ctx)
                   (let
                      ((acc [])
                       (conditions [])
                       (block_step ctx.block_step)
                       (condition_tokens (-> tokens `slice 1))
                       (idx -2)
                       (preamble (calling_preamble ctx))
                       (compile_condition (fn (cond_test cond_block)
                                             (let
                                                ((stmts [])
                                                 (compiled_test nil)
                                                 (stmt nil))
                                                (if (== cond_test.name "else")
                                                    (if (>= idx 2)
                                                        (push stmts
                                                           " else "))
                                                    (progn
                                                       (if (>= idx 2)
                                                           (push stmts
                                                              " else "))
                                                       (= compiled_test (compile_wrapper_fn cond_test ctx))
                                                       (if (and (is_object? (first compiled_test))
                                                                (prop (first compiled_test) `ctype)
                                                                (is_string? (prop (first compiled_test) `ctype))
                                                                (contains? "unction" (prop (first compiled_test) `ctype)))
                                                           (push stmts ["if" " " "(check_true (" preamble.0 " " compiled_test "()" ")) "])
                                                           (push stmts ["if" " " "(check_true ("  compiled_test ")) "]))))
                                                
                                                ;; now push into stmts the statement/block if the condition is true
                                                (= stmt (compile_block (ensure_block cond_block) ctx))
                                                (push stmts stmt)
                                                stmts))))
                      
                      
                      (declare (string preamble.0 preamble.1 preamble.2))
                      (if (eq nil block_step)  ;; if we are not in a block make a pseudo-block
                          (= acc (compile_block (ensure_block tokens) ctx))
                          (progn
                             (cond
                                (not (== (% condition_tokens.length 2) 0))
                                (throw LispSyntaxError "cond: Invalid syntax: missing condition block")
                                (== condition_tokens.length 0)
                                (throw LispSyntaxError "cond: Invalid syntax: no conditions provided"))
                             (while (< idx (- condition_tokens.length 2))
                                (do
                                   (inc idx 2)
                                   (push acc
                                      (compile_condition (prop condition_tokens idx)
                                                         (prop condition_tokens (+ idx 1))))))))
                      acc)))
             
             (ensure_block (fn (tokens)
                               (if (and (is_array? tokens)
                                        (== "special" tokens.0.type)
                                        (contains? tokens.0.name ["do" "progn"]))
                                   tokens
                                   [ "PLACEHOLDER"  tokens ])))
             
             (compile_if (fn (tokens ctx)
                             (let
                                ((acc [])
                                 (subacc [])
                                 (stmts nil)
                                 (test_form tokens.1)
                                 (if_true tokens.2)
                                 (if_false tokens.3)
                                 (compiled_test nil)
                                 (compiled_true nil)
                                 (compiled_false nil)
                                 (block_step ctx.block_step)
                                 (preamble (calling_preamble ctx)))
                                (declare (string preamble.0 preamble.1 preamble.2))
                                
                                (if (eq nil block_step)  ;; if we are not in a block make a pseudo-block
                                    (= acc (compile_block (ensure_block tokens) ctx))
                                    (progn
                                       (push acc { `ctype: "ifblock" `block_step: ctx.block_step `block_id: ctx.block_id })
                                       (= compiled_test (compile test_form ctx))
                                       (if (and (is_object? (first compiled_test))
                                                (prop (first compiled_test) `ctype)
                                                (is_string? (prop (first compiled_test) `ctype))
                                                (contains? "unction" (prop (first compiled_test) `ctype)))
                                           (for_each (t ["if" " " "(check_true (" preamble.0 " " compiled_test "()" "))"])
                                              (push subacc t))
                                           (for_each (t ["if" " " "(check_true ("  compiled_test "))"])
                                              (push subacc t)))
                                       ;; place the test in the accumulator
                                       (push acc subacc)
                                       (= subacc [])
                                       
                                       ;; next we have the if true or false
                                       ;; if the if_true/if_false are not explicit blocks make them
                                       
                                       (= compiled_true (compile_block (ensure_block if_true) ctx))
                                       
                                       (push acc compiled_true)
                                       (when if_false
                                          (push acc " ")
                                          (push acc "else")
                                          (push acc " ")
                                          (= compiled_false (compile_block (ensure_block if_false) ctx))
                                          (push acc compiled_false))))
                                acc)))
             
             
             (compile_as_call (fn (tokens ctx)
                                  (compile_wrapper_fn tokens ctx { `force: true })))
             (rwfnlog (defclog { `prefix: "compile_wrapper_fn" `background: "black" color: `yellow }))
             (compile_wrapper_fn (fn (tokens ctx opts)
                                     (let
                                        ((acc [])
                                         (ctx ctx)
                                         (preamble (calling_preamble ctx))
                                         (needs_await true))
                                        
                                        (declare (string preamble.0))
                                        
                                        (cond
                                           (and (is_object? tokens)
                                                (not (is_array? tokens))
                                                (not (== tokens.type "arr")))
                                           (do
                                              (= needs_await false)
                                              (= acc (compile tokens ctx)))
                                           
                                           (and (is_object? tokens)
                                                (== tokens.val.0.type "fun"))
                                           
                                           (do
                                              (= needs_await false)
                                              (= acc (compile tokens ctx)))
                                           
                                           opts.force
                                           (do
                                              (= ctx (new_ctx ctx))
                                              (when (verbosity ctx)
                                                 (rwfnlog "compile_wrapper_fn: -> "(source_from_tokens tokens expanded_tree))
                                                 (rwfnlog "compile_wrapper_fn: " opts "ctx: " (clone ctx)))
                                              (set_new_completion_scope ctx)
                                              (= acc (compile_block_to_anon_fn tokens ctx opts)))
                                           
                                           (is_block? tokens)
                                           (do
                                              
                                              (= ctx (new_ctx ctx))
                                              ;(when (verbosity ctx)
                                               ;  (rwfnlog "compile_wrapper_fn: -> "(source_from_tokens tokens expanded_tree))
                                                ; (rwfnlog "compile_wrapper_fn: " opts "ctx: " (clone ctx)))
                                              (set_new_completion_scope ctx)
                                              (set_prop ctx
                                                 `block_step
                                                 0)
                                              
                                              (= acc [preamble.2 "(" preamble.1 " " "function" "()" "{" (compile tokens ctx) "}" ")""()"]))
                                           (and (is_object? tokens)
                                                (== tokens.val.0.type "special")
                                                (or (== tokens.val.0.name "if")
                                                    (and (== tokens.val.0.name "throw")
                                                         (get_ctx ctx "__COMP_INFIX_OPS__"))))
                                           (do
                                              (= ctx (new_ctx ctx))
                                              ;(when (verbosity ctx)
                                              ;   (rwfnlog "compile_wrapper_fn: -> "(source_from_tokens tokens expanded_tree))
                                              ;   (rwfnlog "compile_wrapper_fn: " opts "ctx: " (clone ctx)))
                                              (set_new_completion_scope ctx)
                                              (set_prop ctx
                                                 `block_step
                                                 0)
                                              (for_each (t [preamble.2 "(" preamble.1 " " "function" "()" "{" (compile_if tokens.val ctx) "}" ")" "()" ])
                                                 (push acc t)))
                                           (and (is_array? tokens)
                                                (or (== tokens.0.type "fun")
                                                    (== tokens.0.type "asf")
                                                    (== tokens.0.type "function")))
                                           (do
                                              (= needs_await false)
                                              (= acc (compile tokens ctx)))
                                           
                                           (is_array? tokens)
                                           (do
                                              (= ctx (new_ctx ctx))
                                              (when (verbosity ctx)
                                                 (rwfnlog "compile_wrapper_fn: -> "(source_from_tokens tokens expanded_tree))
                                                 (rwfnlog "compile_wrapper_fn: " opts "ctx: " (clone ctx)))
                                              (set_new_completion_scope ctx)
                                              (= acc (compile_block_to_anon_fn tokens ctx opts)))
                                           
                                           (and (is_object? tokens)
                                                (== tokens.type "arr")
                                                (or (== tokens.val.length 0)
                                                    (== tokens.val.0.type "literal")
                                                    (or (== tokens.val.0.type "arg")
                                                        (and (== tokens.val.0.type "special")
                                                             (not (contains? tokens.val.0.name [ "if" "try" "do" "progn" "let" "cond" ]))))))
                                           ;;(contains? tokens.val.0.name [ "or" "and" "==" "fn" "function" "function*" "lambda" "<" ">" ">=" "%" "*" "-" "+" "<<" ">>" "prop" "set_prop" "for_each" "while" "new" ]))))
                                           (progn
                                              (= needs_await false)
                                              (= acc (compile tokens ctx)))
                                           (and (is_object? tokens)
                                                tokens.val
                                                (== tokens.type "arr"))
                                           ;(== tokens.val.0.type "special")
                                           ;(contains? tokens.val.0.name ["do" "progn" "lets" "try" "throw"]))
                                           (do
                                              (= ctx (new_ctx ctx))
                                              (when (verbosity ctx)
                                                 (rwfnlog "compile_wrapper_fn: -> "(source_from_tokens tokens expanded_tree))
                                                 (rwfnlog "compile_wrapper_fn: " opts "ctx: " (clone ctx)))
                                              (set_new_completion_scope ctx)
                                              (= acc (compile_block_to_anon_fn tokens.val ctx opts)))
                                           else
                                           (= acc (compile tokens ctx)))
                                        (if needs_await
                                           [preamble.0 " " acc]
                                           acc))))
             
             (compile_block_to_anon_fn (fn (tokens ctx opts)
                                           (let
                                              ((acc [])
                                               (preamble (calling_preamble ctx))
                                               (ctx (new_ctx ctx)))
                                              (set_prop ctx
                                                 `return_point
                                                 0)
                                              (set_prop ctx
                                                 `block_step
                                                 0)
                                              (cond
                                                 (is_block? tokens)
                                                 (do
                                                    (set_prop ctx
                                                       `return_last_value
                                                       true)
                                                    (set_prop ctx
                                                       `return_point
                                                       0)
                                                    
                                                    (for_each (t ["(" preamble.1 " " "function" "()" (compile_block tokens ctx) ")" "()" ])
                                                       (push acc t)))
                                                 
                                                 (and (== tokens.0.name "let")
                                                      (== tokens.0.type "special"))
                                                 (do
                                                    (set_prop ctx
                                                       `return_last_value
                                                       true)
                                                    (set_prop ctx
                                                       `return_point
                                                       0)
                                                    (for_each (t ["(" preamble.1 " " "function" "()" (compile tokens ctx) ")" "()"])
                                                       (push acc t)))
                                                 (and (== tokens.0.type "special")
                                                      (or (== tokens.0.name "if")
                                                          (== tokens.0.name "try")))
                                                 (do
                                                    (for_each (t ["(" preamble.1 " " "function" "() { " (compile tokens ctx) "})" "()"])
                                                       (push acc t)))
                                                 else
                                                 (do
                                                    (set_prop ctx
                                                       `return_last_value
                                                       true)
                                                    (set_prop ctx
                                                       `return_point
                                                       0)
                                                    (for_each (t ["(" preamble.1 " " "function" "()" "{" " " "return"  " " (compile tokens ctx) " " "}" ")" "()"  ])
                                                       (push acc t))))
                                              acc)))
             (make_do_block (fn (tokens)
                                (let
                                   ((preamble  (clone { "type": "arr"
                                                         "ref": false
                                                         "name": nil
                                                         "val": [] }))
                                    (place preamble.val))
                                   (push place
                                      {
                                        "type": "special",
                                        "val": (quote "=:do")
                                        "ref": true,
                                        "name": "do"
                                        })
                                   
                                   (cond (is_array? tokens)
                                      (for_each (token tokens)
                                         (push place token))
                                      else
                                      (for_each (token [ tokens ])
                                         (push place token)))
                                   preamble)))
             
             (push_as_arg_list (fn (place args)
                                   (do
                                      (map (fn (v i t)
                                              (do
                                                 (push place v)
                                                 (when (<= i (- t 2))
                                                    (push place ","))))
                                           args)
                                      place)))
             
             
             (compile_new (fn (tokens ctx)
                              (let
                                 ((acc [])
                                  (prebuild [])
                                  (target_type (clean_quoted_reference (sanitize_js_ref_name tokens.1.name)))
                                  (comps (get_object_path target_type))
                                  (type_details (get_declaration_details ctx target_type))
                                  (root_type_details (if (> comps.length 1)
                                                          (get_declaration_details ctx comps.0)
                                                          nil))
                                  (target_return_type nil)
                                  (new_arg_name nil)
                                  (args [])
                                  (ctx (new_ctx ctx))
                                  (preamble (calling_preamble ctx))
                                  (new_opts (-> tokens `slice 2)))
                                 (when (> comps.length 1)
                                    (= target_type (path_to_js_syntax comps)))
                                 
                                 (for_each (opt_token (or new_opts []))
                                    (do
                                       (push args (compile_wrapper_fn opt_token ctx) ctx)))
                                 
                                 (cond
                                    (and (not (eq nil type_details.value))
                                         type_details.declared_global)
                                    (do
                                       (for_each (arg ["new" " "  (compile tokens.1 ctx)  "(" ])
                                          (push acc arg))
                                       (push_as_arg_list acc args)
                                       (push acc ")"))
                                    
                                    (and (not (eq nil type_details.value))
                                         (is_function? type_details.value))
                                    (do
                                       (for_each (arg ["new" " " target_type "("])
                                          (push acc arg))
                                       (push_as_arg_list acc args)
                                       (push acc ")"))
                                    (and (eq nil type_details.value)
                                         (not (eq nil root_type_details.value)))
                                    (do
                                       (for_each (arg ["(" preamble.0 " " env_ref "get_global" "(" "\"" "indirect_new" "\"" ")" ")" "(" target_type ])
                                          (push acc arg))
                                       (when (> args.length 0)
                                          (push acc ",")
                                          (push_as_arg_list acc args))
                                       (push acc ")"))
                                    else
                                    (do
                                       (for_each (arg ["new" " "  tokens.1.name  "(" ])
                                          (push acc arg))
                                       (push_as_arg_list acc args)
                                       (push acc ")")))
                                 
                                 
                                 
                                 (= target_return_type
                                    (or (get_ctx_val ctx target_type)
                                        (prop (or (get_declarations ctx target_type) {})
                                              `type)
                                        (get_outside_global target_type)
                                        UnknownType))
                                 (cond
                                    (get_declarations ctx target_type)
                                    (prepend acc
                                       { `ctype: (get_declarations ctx target_type) })
                                    
                                    (or (== tokens.1.name "Function") 
                                        (== tokens.1.name "AsyncFunction"))
                                    (prepend acc
                                       { `ctype: target_return_type })
                                    
                                    false
                                     (prepend acc 
                                        { `ctype: UnknownType }))
                                 
                                 ;(console.log "compiler: new: " tokens.1.name ": " (first acc))
                                 
                                 acc)))
             
             
             (compile_val_mod (fn (tokens ctx)
                                  (let
                                     ((target (or tokens.1.name
                                                   (progn
                                                      (throw SyntaxError
                                                         (+ tokens.0.name
                                                            " requires at least one argument indicating the symbol which value is to be modified")))))
                                      (sanitized (if (and tokens.1.ref
                                                           tokens.1.name)
                                                      (sanitize_js_ref_name tokens.1.name)
                                                      (+ tokens.0.name
                                                         " requires at least one argument indicating the symbol which value is to be modified")))
                                      (target_details (cond
                                                          (get_ctx ctx sanitized)
                                                          "local"
                                                          (get_lisp_ctx ctx tokens.1.name)
                                                          "global"
                                                          else
                                                          (progn
                                                             (aif (get_declaration_details ctx tokens.1.name)
                                                                  (cond
                                                                     it.is_argument
                                                                     "local"
                                                                     it.declared_global
                                                                     "global"
                                                                     it
                                                                     "local")))))
                                      
                                      (comps (split_by "." target))
                                      (in_infix (get_ctx_val ctx "__COMP_INFIX_OPS__"))
                                      (operation (if in_infix
                                                      (cond
                                                         (== tokens.0.name "inc")
                                                         "+"
                                                         (== tokens.0.name "dec")
                                                         "-"
                                                         else
                                                         (throw SyntaxError (+ "Invalid value modification operator: " tokens.0.name)))
                                                      (cond
                                                         
                                                         (and (== target_details "local")
                                                              (== tokens.0.name "inc"))
                                                         "+="
                                                         (and (== target_details "local")
                                                              (== tokens.0.name "dec"))
                                                         "-="
                                                         (== tokens.0.name "inc")
                                                         "+"
                                                         else
                                                         "-")))
                                      (mod_source nil)
                                      (how_much (or (and tokens.2
                                                          (compile_wrapper_fn tokens.2 ctx))
                                                     1)))
                                     
                                     (if (== undefined target_details)
                                         (throw ReferenceError (+ "unknown symbol: " comps.0)))
                                     (cond
                                        (== target_details "global")
                                        (do
                                           (= has_lisp_globals true)
                                           ["(" "await" " " env_ref "set_global(\"" target "\","
                                            "await" " " env_ref "get_global(\"" target "\")" " " operation " " how_much "))"])
                                        in_infix
                                        (do
                                           ["(" target "=" target operation how_much ")"])
                                        
                                        else
                                        [sanitized operation how_much]))))
             
             (compile_try
                (fn (tokens ctx)
                   ;; when ctx block step is nil, this means that try was called directly from
                   ;; the top level, and needs to be in an explicit block that would contain
                   ;; both the try block and the catch blocks.
                   (if (eq nil ctx.block_step)
                       (compile_block (ensure_block tokens) ctx)
                       (compile_try_inner tokens ctx))))
             
             (compile_try_inner
                (fn (tokens ctx)
                   (let
                      ((acc [])
                       (try_block (cond
                                     (and tokens.1
                                        (eq nil tokens.1.val))
                                     tokens.1
                                     (== tokens.1.type "objlit")
                                     tokens.1
                                     tokens.1
                                     tokens.1.val))
                       (compiled_try_block nil)
                       (catch_block nil)
                       (idx -1)
                       (exception_ref (gen_temp_name "exception"))
                       (base_error_caught false)
                       (catch_stmts [])
                       (catches (-> tokens `slice 2))
                       (compile_catch (fn (catch_block)
                                         (let
                                            ((throwable_type catch_block.1.name)
                                             (throwable_ref catch_block.2.val.0.name)
                                             (catch_statements catch_block.3)
                                             (stmts nil)
                                             (subacc [])
                                             (ctx (new_ctx ctx)))
                                            (set_ctx ctx
                                                     throwable_ref
                                                     (new catch_block.1.name))
                                            (when (== throwable_type "Error")
                                               (= base_error_caught true))
                                            (= stmts (compile_block (ensure_block catch_statements) ctx))
                                            (if (> idx 0)
                                                (push subacc [" " "else" " "]))
                                            (push subacc
                                               ["if (" exception_ref " instanceof " throwable_type ") " "{" "let " throwable_ref "=" exception_ref ";" stmts "}"])
                                            (when (and (== idx (- catches.length 1))
                                                       (not base_error_caught))
                                               (push subacc [" " "else" " "])
                                               (push subacc [ { `completion: `throw } "throw" " " exception_ref ";"]))
                                            
                                            subacc))))
                      ;; check syntax
                      (cond
                         (< tokens.length 2)
                         (throw SyntaxError "invalid try form: missing try block")
                         (or (eq nil catches)
                             (< catches.length 1))
                         (throw SyntaxError "invalid catch block: missing catch"))
                      
                      (= compiled_try_block (compile_block (ensure_block try_block) ctx))
                      (push acc { `ctype: "tryblock" })
                      (push acc [ "try" " " compiled_try_block ])
                      (push catch_stmts [ " " "catch" " " "(" exception_ref ")" " " ])
                      (push catch_stmts "{")
                      (while (< idx (- catches.length 1))
                         (do
                            (inc idx)
                            (= catch_block (prop (prop catches idx) `val))
                            (if (is_array? catch_block)
                                (push catch_stmts (compile_catch catch_block))
                                (throw SyntaxError "invalid catch form"))))
                      (push catch_stmts "}")
                      (push acc catch_stmts)
                      acc)))
             
             (compile_throw (fn (tokens ctx)
                                (let
                                   ((acc [])
                                    (error_message nil)
                                    (mode 1)
                                    (cmp_rec (get_ctx ctx `__COMPLETION_SCOPE__))
                                    (error_instance nil))
                                   (assert cmp_rec "compiler error: throw unable to find completion scope in context")
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
                                       (for_each (t [ { `completion: "throw" } "throw" " " error_instance ";" ])
                                          (push acc t))
                                       (for_each (t [ { `completion: "throw" } "throw" " " "new" " " error_instance "(" error_message ")" ";"])
                                          (push acc t)))
                                   (push cmp_rec.completion_records
                                      {
                                        `block_id: ctx.block_id
                                        `type: "throw"
                                        `block_step: ctx.block_step
                                        `stmt: acc
                                        })
                                   
                                   acc)))
             
             
             (compile_break (fn (tokens ctx)
                                [break_out "=" "true" ";" "return"]))
             (compile_return (fn (tokens ctx)
                                 (let
                                    ((acc [])
                                     (return_val_reference (gen_temp_name "return"))
                                     (return_value nil)
                                     (cmp_rec (get_ctx ctx `__COMPLETION_SCOPE__)))
                                    
                                    (assert cmp_rec "compiler error: compile_return: no completion scope record found")
                                    
                                    (if (is_block? tokens.1.val)
                                        (do
                                           (push acc ["let" " " return_val_reference "=" (compile tokens.1.val ctx) ";"])
                                           (push acc [ { `completion: "return" }  "return" " " return_val_reference ";"]))
                                        (do
                                           (for_each (t [ "return" " " (compile tokens.1 ctx) ";" ])
                                              (push acc t))))
                                    (push cmp_rec.completion_records
                                       {
                                         `block_id: ctx.block_id
                                         `block_step: ctx.block_step
                                         `type: "return"
                                         `stmt: (last acc)
                                         })
                                    acc)))
             
             (apply_log (if opts.quiet_mode
                             log
                             (defclog { `prefix: "compile_apply" `background: "sienna" `color: "white" })))
             
             (compile_apply (fn (tokens ctx)
                                (let
                                   ((acc [])
                                    (fn_ref tokens.1)
                                    (complex? false)
                                    (args_ref (gen_temp_name "apply_args"))
                                    (function_ref (gen_temp_name "apply_fn"))
                                    (target_argument_ref nil)
                                    (target_arg nil)
                                    (ctype nil)
                                    (preceding_arg_ref nil)
                                    (preamble (calling_preamble ctx))
                                    (requires_await false)
                                    (ctx (new_ctx ctx))
                                    (compiled_fun_resolver nil)
                                    (args (-> tokens `slice 2)))
                                   (declare (string preamble.0))
                                   (set_new_completion_scope ctx)
                                   (when (and args (== args.length 1))
                                      (= args (first args)))
                                   
                                   (= function_ref (compile_wrapper_fn fn_ref ctx))
                                   
                                   (when fn_ref.ref
                                      (= ctype (get_declaration_details ctx fn_ref.name)))
                                   
                                   (when (is_function? ctype.value)
                                      (= requires_await true))
                                   
                                   ;; now handle the arguments
                                   
                                   ;; Dlisp allows for multiple arguments to apply, with the last argument must be an array.
                                   ;; In this case, we are going to need to unshift the preceding arguments into the final argument (which must be an array)
                                   
                                   (if (is_array? args)
                                       (do
                                          (= target_argument_ref (gen_temp_name "target_arg"))
                                          (= target_arg (pop args)) ;; take the last argument
                                          (for_each (t [ "let" " " target_argument_ref "=" "[]" ".concat" "(" (compile target_arg ctx) ")" ";"])
                                             (push acc t))
                                          (for_each (t [ "if" "(" "!" target_argument_ref " " "instanceof" " " "Array" ")" "{" "throw" " " "new" " " "TypeError" "(" "\"Invalid final argument to apply - an array is required\"" ")" "}" ])
                                             (push acc t))
                                          (for_each (token args)
                                             (do
                                                (= preceding_arg_ref (gen_temp_name "pre_arg"))
                                                
                                                (if (is_form? token)
                                                    (do
                                                       (for_each (t [ "let" " " preceding_arg_ref "="  (compile_wrapper_fn token ctx) ";" ])
                                                          (push acc t)))
                                                    (= preceding_arg_ref (compile_wrapper_fn token ctx)))
                                                (push acc
                                                   [ target_argument_ref ".unshift" "(" preceding_arg_ref ")" ";" ])))
                                          ;; now we have our arguments placed into the front of the final array
                                          ;; now call the functions apply method and return it
                                          (for_each (t ["return" " "  "(" function_ref ")" "." "apply" "(" "this" "," target_argument_ref ")"])
                                             (push acc t)))
                                       
                                       ;; otherwise - just one arg (which presumably is an array) and so just construct the JS statement
                                       (do
                                          (if (is_form? args)
                                              (do
                                                 (for_each (t [ "let" " " args_ref "="  (compile_wrapper_fn args.val ctx) ";" ])
                                                    (push acc t))
                                                 (= complex? true)))
                                          
                                          (for_each (t [ "return" " " "(" " " function_ref ")" "." "apply" "(" "this" ])
                                             (push acc t))
                                          (when args
                                             (push acc ",")
                                             (if complex?
                                                (push acc args_ref)
                                                (push acc (compile_wrapper_fn args ctx) ctx)))
                                          (push acc ")")))
                                   
                                   [ preamble.0 " " "(" preamble.1 " " "function" "()" "{" acc "}" ")" "()"])))
             
             (compile_call (fn (tokens ctx)
                               (let
                                  ((preamble (calling_preamble ctx))
                                   (dbg_level (debug_level ctx))
                                   (simple_target? (if (and (== dbg_level 0)
                                                            (== tokens.1.ref true))
                                                        true
                                                        false))
                                   (simple_method? (if (== tokens.2.type "literal")
                                                        true
                                                        false))
                                   (ctx ctx)
                                   (compiled nil))
                                  (declare (string preamble.2))
                                  (= compiled 
                                     (cond
                                        (and simple_target?
                                           simple_method?)
                                        (compile_call_inner tokens ctx { `type: 0 `preamble: preamble })
                                        simple_target?
                                        (compile_call_inner tokens ctx { `type: 0 `preamble: preamble })
                                        else
                                        (do
                                           (= ctx (new_ctx ctx))
                                           (set_new_completion_scope ctx)
                                           (if (== dbg_level 0)
                                               [preamble.2 preamble.0 " " "(" preamble.1 " " "function" "()" " " "{"
                                                (compile_call_inner tokens ctx { `type: 2 `preamble: preamble `debug_level: dbg_level })
                                                " " "}" ")" "()" ]
                                               [preamble.2 preamble.0 " " "(" preamble.1 " " "function" "()" " " "{" "try" "{"
                                                (compile_call_inner tokens ctx { `type: 2 `preamble: preamble `debug_level: dbg_level })
                                                " " "} catch (e) { Environment.get_global(\"log_error\",console.error)(\"call: \"+e.message, " (JSON.stringify (source_from_tokens tokens expanded_tree)) "); throw e; }"  "}" ")" "()" ]
                                               ))))
                                  compiled)))
             (compile_call_inner (fn (tokens ctx opts)
                                     (let
                                        ((acc [])
                                         (target nil)
                                         (idx -1)
                                         (preamble opts.preamble)
                                         (add_args (fn ()
                                                       (for_each (token (-> tokens `slice 3))
                                                          (do
                                                             (push acc ",")
                                                             (push acc (compile_wrapper_fn token ctx))))))
                                         (method nil))
                                        
                                        (when (< tokens.length 3)
                                           (throw SyntaxError (+ "call: missing arguments, requires at least 2")))
                                        
                                        (= target (compile_wrapper_fn tokens.1 ctx))
                                        (= method (compile_wrapper_fn tokens.2 ctx))
                                        
                                        (cond
                                           (or (== opts.type 0)
                                               (== opts.type 1))
                                           (do
                                              (cond
                                                 (== tokens.length 3)
                                                 (for_each (t [preamble.0 " " target "[" method "]" "()"])
                                                    (push acc t))
                                                 else
                                                 (do
                                                    (for_each (t [preamble.0 " " target "[" method "]" ".call" "(" target ])
                                                       (push acc t))
                                                    (add_args)
                                                    (push acc ")"))))
                                           (== opts.type 2)
                                           (do
                                              (for_each (t ["{" " " "let" " " "__call_target__" "="  target "," " " "__call_method__" "=" method ";" ])
                                                 (push acc t))
                                              (cond
                                                 (== tokens.length 3)
                                                 (for_each (t [ "return" " " preamble.0 " " "__call_target__"  "[" "__call_method__" "]" "()"])
                                                    (push acc t))
                                                 else
                                                 (do
                                                    (for_each (t [ "return" " " preamble.0 " " "__call_target__"   "[" "__call_method__" "]" "." "call" "(" "__call_target__"])
                                                       (push acc t))
                                                    (add_args)
                                                    (push acc ")")))
                                              (push acc "}")))
                                        acc)))
             
             
             (check_needs_wrap (fn (stmts)
                                   (let
                                      ((fst (or (and (is_array? stmts)
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
                                      (console.warn "DEPRECATION: check_needs_wrap called: " stmts)
                                      (cond
                                         (contains? "block" fst)
                                         true
                                         else
                                         false))))
             
             ;; Import code from exports
             ;; static import
             ;; really used when exporting files
             
             (compile_import
                (fn (tokens ctx)
                   (let
                      ((symbol_tokens tokens.1)
                       (symbols [])
                       (from_tokens nil)
                       (from_place nil)
                       (acc []))
                      (if (< tokens.length 3)
                          (throw SyntaxError "import requires exactly two arguments"))
                      (= symbol_tokens tokens.1)
                      (= from_tokens tokens.2)
                      
                      ;(console.log "compile_import: ->" (clone symbol_tokens))
                      (= from_place (compile from_tokens ctx))
                      (push acc { `ctype: "statement" `meta: { `imported_from: from_place }})
                      (push acc "import")
                      (push acc " ")
                      ;(console.log "compile_import: compiled symbols:    " symbols)
                      ;(console.log "compile_import: compiled from place: " from_place)
                      (cond
                         (is_array? symbol_tokens.val )
                         (do
                            (for_each (s symbol_tokens.val)
                               (push symbols s.name))
                            (for_each (t (flatten ["{" " " symbols " " "}" " " "from" " " from_place ]))
                               (push acc t)))
                         else
                         (throw SyntaxError "import requires an array of imported symbols as a second argument"))
                      
                      ;(console.log "compile_import: <- " (clone acc))
                      acc)))
             ;; dynamic import
             ;; (dynamic_import source_location)
             
             (compile_dynamic_import
                (fn (tokens ctx)
                   (let
                      ((from_tokens nil)
                       (preamble (calling_preamble ctx))
                       (from_place nil)
                       (can_be_static false)
                       (metaval nil)
                       (imported_from nil)
                       (acc []))
                      (declare (string preamble.0))
                      (= from_tokens tokens.1)
                      (= from_place (compile_wrapper_fn from_tokens ctx))
                      
                      (= imported_from (if (is_array? from_place)
                                           from_place.1
                                           from_place))
                      (when (and (is_string? imported_from)
                                 (starts_with? "\"" imported_from)
                                 (ends_with? "\"" imported_from))
                         (= can_be_static true)
                         (= imported_from (-> imported_from `substr 1 (- imported_from.length 2))))
                      
                      (set_prop external_dependencies
                         imported_from
                         true)
                      (= metaval (if can_be_static ;; place holder
                                     { `initializer: (quote (javascript "undefined" )) }
                                     {}))
                      (push acc { `ctype: "statement"  `meta: metaval })
                      
                      (for_each (t (flatten [preamble.0 " " "import" " " "(" from_place ")"]))
                         (push acc t))
                      acc)))
             
             ;; The javascript operator allows direct embedding of
             ;; javascript characters in the compilation stream
             ;; and they can access the local or closure values
             ;; globals have to be explicitly received from Environment.get_global
             
             ;; (let
             ;;    ((abc 123))
             ;;   (javascript |
             ;;      abc = abc * 10 |)
             ;;    abc)
             
             (compile_javascript
                (fn (tokens ctx)
                   (let
                      ((acc [ { `ctype: "__JS__" } ])
                       (text nil))
                      (for_each (t (or (rest tokens) []))
                         (do
                            (cond
                               t.ref
                               (push acc t.name)
                               (is_array? t.val)
                               (push acc (compile t ctx))
                               else
                               (push acc t.val))))
                      
                      acc)))
             
             (compile_set_global
                (fn (tokens ctx opts)
                   (let
                      ((target tokens.1.name)
                       (wrap_as_function? nil)
                       (ctx (new_ctx ctx))
                       (global_dependencies nil)
                       (external_dependencies nil)
                       (preamble (calling_preamble ctx))
                       (source_meta nil)
                       (acc nil)
                       (clog (if opts.quiet_mode
                                  log
                                  (defclog { `prefix: "compile_set_global" `color: `blue `background: "#205020" })))
                       (metavalue nil)
                       (assignment_value nil))
                      (declare (string preamble.0))
                      
                      (cond
                         (eq nil tokens.1)
                         (throw SyntaxError "set global directive missing assignment target and assignment value")
                         (eq nil tokens.2)
                         (throw SyntaxError "set global directive missing assignment value"))
                      
                      (= has_lisp_globals true) ; ensure that we are passed the environment for this assembly
                      
                      (set_ctx ctx `__GLOBALS__ (new Set))  ;; reset our globals scope so we capture any dependencies for this global
                      ;(set_ctx ctx `__EXTERNALS__ (new Set)) ;; and externals
                      
                      ;; setup the reference in the globals as an assumed function type
                      (set_prop root_ctx.defined_lisp_globals
                         target
                         AsyncFunction)
                      
                      (= assignment_value
                         (do
                            (compile_wrapper_fn tokens.2 ctx)))
                      
                      (= global_dependencies (to_array (get_ctx ctx `__GLOBALS__)))
                      (= external_dependencies (to_array (get_ctx ctx `__EXTERNALS__)))
                      
                      (when true; 
                         (cond
                            (eq nil tokens.3)
                            (push tokens (tokenize { `requires: global_dependencies `externals: external_dependencies `source_name: source_name } ctx))
                            (is_object? tokens.3.val.val.1) ; (resolve_path [ `val `val 1 ] tokens.3))
                            (progn
                               (set_prop tokens.3.val.val.1
                                  `requires
                                  global_dependencies)
                               (set_prop tokens.3.val.val.1
                                  `externals
                                  external_dependencies)
                               (set_prop tokens.3.val.val.1
                                  `source_name
                                  source_name))
                               
                            (and (is_array? tokens.3.val)
                                 (== tokens.3.type "objlit"))
                            (do
                               (when (> global_dependencies.length 0)
                                  (= global_dependencies (tokenize { `requires: global_dependencies  } ctx))
                                  (push tokens.3.val
                                     global_dependencies.val.0))
                               (when (> external_dependencies.length 0)
                                  (= external_dependencies (tokenize { `requires: external_dependencies  } ctx))
                                  (push tokens.3.val
                                     external_dependencies.val.0))
                               (= source_meta (tokenize { `source_name: source_name } ctx))
                               (push tokens.3.val
                                  source_meta.val.0)
                               )))
                      
                      (when tokens.3
                         (= metavalue
                            (if (is_complex? tokens.3)
                                (compile_wrapper_fn tokens.3 ctx)
                                (compile tokens.3 ctx))))
                      
                      (cond
                         (and (is_object? assignment_value.0)
                              assignment_value.0.ctype)
                         (do
                            (when assignment_value.0.meta
                               (if (not metavalue)
                                   (do
                                      (= metavalue (quote_tree assignment_value.0.meta ctx)))))
                            
                            (set_prop root_ctx.defined_lisp_globals
                               target
                               (cond (== assignment_value.0.ctype "Function")
                                  Function
                                  (== assignment_value.0.ctype "AsyncFunction")
                                  AsyncFunction
                                  (== assignment_value.0.ctype "Number")
                                  NumberType
                                  (== assignment_value.0.ctype "expression")
                                  Expression
                                  else
                                  assignment_value.0.ctype)))
                         else
                         (do
                            (if (and (is_array? assignment_value)
                                     (== assignment_value.0 "await"))
                                (do
                                   (set_prop root_ctx.defined_lisp_globals
                                      target
                                      AsyncFunction)
                                   (set_ambiguous root_ctx target))
                                (set_prop root_ctx.defined_lisp_globals
                                   target
                                   assignment_value))))
                      
                      (when (verbosity ctx)
                         (clog "target: " (as_lisp target))
                         (clog "assignment_value: " (as_lisp assignment_value)))
                      
                      (= acc [{ `ctype: "statement" } (if (or (== Function (prop root_ctx.defined_lisp_globals target))
                                                          (in_sync? ctx))
                                       ""
                                       "await")
                                " " "Environment" "." "set_global"
                                "(" """\"" tokens.1.name "\"" ","
                                assignment_value
                                (if (or metavalue opts.constant) "," "")
                                (if metavalue
                                   metavalue
                                   (if opts.constant
                                      "null"
                                      ""))
                                (if opts.constant "," "") (if opts.constant "true" "")
                                ")" ])
                      acc)))
             
             (is_token? (fn (t)
                            (or (and (is_object? t)
                                     t.__token__)
                                (and (is_array? t)
                                     (is_object? t.0)
                                     t.0.__token__))))
             
             (compile_quote (fn (lisp_struct ctx)
                                (let
                                   ((acc [])
                                    (ctx (new_ctx ctx)))
                                   (= acc (compile_quotem lisp_struct ctx))
                                   acc)))
             
             (compile_quotel (fn (lisp_struct ctx)
                                 (let
                                    ((acc []))
                                    (= acc (JSON.stringify lisp_struct.1))
                                    [acc])))
             
             (wrap_and_run (fn (js_code ctx run_opts)
                               (let
                                  ((assembly nil)
                                   (result nil)
                                   (fst nil)
                                   (ctype nil)
                                   (comp_meta nil)
                                   (needs_braces? false)
                                   (in_quotem (get_ctx ctx "__IN_QUOTEM__"))
                                   (run_log (if opts.quiet_mode
                                                 log
                                                 (defclog { `prefix: "wrap_and_run" `background: "#703030" `color: "white" } )))
                                   (needs_return?
                                      (do
                                         (= ctype (if (and (is_array? js_code)
                                                           (first js_code)
                                                           (is_object? (first js_code))
                                                           (prop (first js_code) `ctype))
                                                      (prop (first js_code) `ctype)))
                                         (if (and (== (typeof ctype) "object")
                                                  (not (is_object? ctype)))
                                             (= fst "")
                                             (= fst (+ "" (or ctype
                                                              ""))))
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
                                   
                                   (assembled nil))
                                  (declare (boolean needs_return?))
                                  
                                  
                                  (= assembled js_code)
                                  ;; is this our env's namespace or not?
                                  ;; if not send it to the right namespace for execution
                                  (try
                                     (if (and target_namespace
                                              (is_object? assembled.0)
                                              (not (== target_namespace Environment.namespace)))
                                         (do
                                            (= comp_meta (first assembled))
                                            (set_prop comp_meta
                                               `namespace
                                               target_namespace)
                                            (when (and (verbosity ctx)
                                                       comp_meta.namespace)
                                               (run_log "specified namespace: " comp_meta.namespace))
                                            (= result (-> Environment `evaluate_local [comp_meta (assemble_output assembled)] ctx { `compiled_source: true }))
                                            (when (verbosity ctx)
                                               (run_log "<- " result))
                                            result)
                                         ;; this is in our own environment
                                         (do
                                            (= assembled (assemble_output assembled))
                                            (= assembled (+ (if needs_braces? "{" "")
                                                            (if needs_return? " return " "")
                                                            assembled
                                                            (if needs_braces? "}" "")))
                                            (when (verbosity ctx)
                                               (run_log "assembled: " assembled))
                                            (try
                                               (= assembly (new AsyncFunction "Environment"  assembled))
                                               (catch Error (e)
                                                  (progn
                                                     (console.error "compiler: wrap_and_run: caught error on constructing new async_function")
                                                     (console.error "compiler: wrap_and_run: " assembled)
                                                     (throw e))))
                                            (when run_opts.bind_mode
                                               (= assembly (bind_function assembly Environment)))
                                            
                                            ;(if ctx_access
                                            ; (= result (assembly Environment ctx_access))
                                            (= result (assembly Environment))
                                            (when (verbosity ctx)
                                               (run_log "<- " result))
                                            result))
                                     (catch Error (e)
                                        (progn
                                           (console.log "compiler: wrap_and_run: caught error on evaluation: " e.message)
                                           (if (is_function? (resolve_path [ `context `scope `*on_compiler_eval_error* ] Environment))
                                               (= result ((resolve_path [ `context `scope `*on_compiler_eval_error* ] Environment) e assembled))
                                               (throw e)) ; else just raise it up
                                           result))))))
             
             ;; quote_tree
             ;; convert the hierarchical tree to a flattened, serializable
             ;; javascript representation which when evaluated
             ;; returns the quoted appropriate structure
             ;; when unquote operations are encountered, turn back on
             ;; compilation and store the result in the position
             ;; of the tree element
             
             (quote_tree (fn (lisp_tree ctx _acc)
                             (let
                                ((acc (or _acc []))
                                 (mode 0)
                                 (in_concat false)
                                 (in_lambda? false )) ;(get_ctx ctx "__IN_LAMBDA__")))
                                ;(console.log "quote_tree: " lisp_tree)
                                (cond
                                   (is_array? lisp_tree)
                                   (do
                                      (push acc
                                         "[")
                                      
                                      ;; build out the serialized representation of JS...
                                      
                                      (map (fn (elem i t)
                                              (if (== mode 1)
                                                  (do
                                                     (= mode 0))
                                                  (do
                                                     ;; check for special operators, splice and unquotem
                                                     ;; if they do exist, the next element is compiled and
                                                     ;; placed in the appropriate position in the accumulator.
                                                     ;; essentially we switch back to compile mode as we
                                                     ;; process the tree.
                                                     
                                                     (cond
                                                        
                                                        ;; unquotem and ,# operators - place the resulting operation
                                                        ;; directly in the tree
                                                        
                                                        (or (== (quote "=:##") elem)
                                                            (== (quote "=:unquotem") elem))
                                                        (do
                                                           (if in_concat
                                                              (push acc
                                                                 (compile_wrapper_fn (tokenize [ (prop lisp_tree (+ i 1)) ] ctx) ctx))
                                                              (push acc
                                                                 (compile_wrapper_fn (tokenize (prop lisp_tree (+ i 1)) ctx) ctx)))
                                                           ;; skip the next element since we compiled it
                                                           (= mode 1))
                                                        
                                                        ;; splice operation - take the resulting compilation operation
                                                        ;; and concatenate to the array if the result is an array
                                                        
                                                        (== (quote "=$,@") elem)
                                                        (do
                                                           (if (not in_concat)
                                                               (push acc
                                                                  "].concat("))
                                                           (push acc
                                                              (compile_wrapper_fn (tokenize (prop lisp_tree (+ i 1)) ctx) ctx))
                                                           (= in_concat true)
                                                           (= mode 1))   ;; and suppress the next element since we just processed it
                                                        
                                                        
                                                        ;; normal quoted element
                                                        else
                                                        (do
                                                           (if in_concat
                                                              (quote_tree [ elem ] ctx acc)  ;; the concat function expects an array so if we don't put wrapper it will splice
                                                              (quote_tree elem ctx acc))))
                                                     
                                                     (if (< i (- t 1))
                                                         (push acc ",")))))
                                           lisp_tree)
                                      
                                      ;; if we have gone to concatenate mode, close with a paren
                                      ;; otherwise close with a bracket
                                      
                                      ;; remove any trailing commas
                                      (if (== "," (last acc))
                                          (pop acc))
                                      (if in_concat
                                         (push acc
                                            ")")
                                         (push acc
                                            "]")))
                                   (is_object? lisp_tree)
                                   (do
                                      (push acc
                                         "{ ")
                                      (map (fn (k i t)
                                              (do
                                                 (push acc (JSON.stringify k))
                                                 (push acc ":")
                                                 (quote_tree (prop lisp_tree k) ctx acc)
                                                 (if (< i (- t 1))
                                                     (push acc ","))))
                                           (keys lisp_tree))
                                      (push acc
                                         "}"))
                                   (is_string? lisp_tree)
                                   (push acc (JSON.stringify lisp_tree))
                                   (is_nil? lisp_tree)
                                   (push acc (JSON.stringify nil))
                                   (== undefined lisp_tree)
                                   (push acc (JSON.stringify undefined))
                                   else
                                   (push acc (JSON.stringify lisp_tree)))
                                acc)))
             
             (quotem_log (if opts.quiet_mode
                              log
                              (defclog {`prefix: "compile_quotem" `background: "#503090" `color: "white" } )))
             
             (compile_quotem (fn (lisp_struct ctx)
                                 (let
                                    ((acc [])
                                     (ctx (new_ctx ctx))
                                     (quoted_js nil))
                                    (set_ctx ctx "__IN_QUOTEM__" true)
                                    (when (verbosity ctx)
                                       (quotem_log "->" (if (get_ctx ctx "__IN_LAMBDA__") "[IN LAMBDA]" "") (JSON.stringify lisp_struct.1)))
                                    
                                    ;; enter quote mode->
                                    (if (get_ctx ctx "__IN_LAMBDA__")
                                        (do
                                           ;; quote_tree (follow_tree2) returns a series of JS tokens, not a lisp tree
                                           ;; once it is this form it can be attached to the compilation structure
                                           ;; since all the compile_ functions are expected to return javascript
                                           ;; tokens.
                                           (= quoted_js (quote_tree lisp_struct.1 ctx)))
                                        (= quoted_js (quote_tree lisp_struct.1 ctx)))
                                    
                                    (when (verbosity ctx)
                                       (quotem_log "<-" (as_lisp quoted_js)))
                                    quoted_js)))
             
             (compile_unquotem (fn (lisp_struct ctx)
                                   (let
                                      ((acc []))
                                      (push acc
                                         (compile lisp_struct.1 ctx))
                                      acc)))
             
             (eval_log (if opts.quiet_mode
                            log
                            (defclog {`prefix: "compile_eval" `background: "#705030" `color: "white" } )))
             
             ;; eval takes the output of evalq and evaluates the returned function, and returns the
             ;; results
             
             (compile_eval
                (fn (tokens ctx)
                   (let
                      ((assembly nil)
                       (type_mark nil)
                       (acc [])
                       (preamble (calling_preamble ctx))
                       (result nil)
                       (eval_opts nil)
                       (ctx (new_ctx ctx)))
                      (set_new_completion_scope ctx)
                      (when tokens.2
                         (= eval_opts (compile tokens.2 ctx)))
                      (= assembly (compile tokens.1 ctx))
                      (when (verbosity ctx)
                         (eval_log "assembly:" (clone assembly)))
                      (= has_lisp_globals true)
                      (= result [ "(" "await" " " "Environment" "." "eval" "(" preamble.0 " " preamble.1 " " "function" "()" ["{" "return" " " assembly "}" "()" ",null" (if eval_opts [ ", " eval_opts]  "")    ")" ")" ]])
                      result)))
             
             (compile_debug (fn (tokens ctx)
                                [{ `ctype: "statement" } "debugger" ";"]))
             
             (compile_for_each
                (fn (tokens ctx)
                   (let
                      ((preamble (calling_preamble ctx))
                       (ctx (new_ctx ctx)))
                      (declare (string preamble.0 preamble.1))
                      ;(when (verbosity ctx)
                       ;  (console.log "compile_for_each: -> " (source_from_tokens tokens expanded_tree)))
                      (set_new_completion_scope ctx)
                      [preamble.2 preamble.0 " " "(" preamble.1 " " "function" "()" " " "{"
                       (compile_for_each_inner tokens ctx preamble)
                       " " "}" ")" "()" ])))
             
             (compile_for_each_inner
                (fn (tokens ctx preamble)
                   (let
                      ((acc [])
                       (idx 0)
                       (stmts [])
                       (idx_iter (gen_temp_name "iter"))
                       (idx_iters [])
                       (element_list (gen_temp_name "elements"))
                       (body_function_ref (gen_temp_name "for_body"))
                       (collector_ref (gen_temp_name "array"))
                       (prebuild [])
                       (for_args tokens.1.val)
                       (iterator_ref for_args.0)
                       (elements (last for_args))
                       (iter_count (if for_args
                                        (- for_args.length 1)
                                        0))
                       (for_body tokens.2)
                       (body_is_block? (is_block? for_body.val)))
                      (when (< iter_count 1)
                         
                         (throw SyntaxError "Invalid for_each arguments"))
                      
                      (for_each (iter_idx (range iter_count))
                         (do
                            (push idx_iters (prop for_args iter_idx))
                            (set_ctx ctx
                                     (clean_quoted_reference (prop (last idx_iters) `name))
                                     ArgumentType)))
                      
                      
                      (set_ctx ctx collector_ref ArgumentType)
                      (set_ctx ctx
                               `__LAMBDA_STEP__
                               -1)
                      (set_ctx ctx element_list "arg")
                      (when (not body_is_block?)
                         ;; we need to make it a block for our function
                         (= for_body (make_do_block for_body)))
                      
                      (= prebuild (build_fn_with_assignment body_function_ref
                                                            for_body.val
                                                            idx_iters
                                                            ctx))
                      
                      (set_prop ctx
                         `return_last_value
                         true)
                      
                      (push acc (compile prebuild ctx))
                      
                      (for_each (t ["let" " " collector_ref "=" "[]" "," element_list "="  (compile_wrapper_fn elements ctx) ";" ])
                         (push acc t))
                      (for_each (t [ "let" " " break_out "=" "false" ";"])
                         (push acc t))
                      (if (blank? preamble.0)
                          (set_ctx ctx body_function_ref Function)
                          (set_ctx ctx body_function_ref AsyncFunction))
                      ;; for the simplest, fastest scenario, one binding variable to the list
                      (cond
                         (and (== for_args.length 2) ;; simplest (for_each (i my_array) ...
                              (not (is_array? for_args.1)))
                         (do
                            (set_ctx ctx idx_iter NumberType)
                            (for_each (t ["for" "(" "let" " "  idx_iter " " "in" " " element_list ")" " " "{" ])
                               (push acc t))
                            
                            (for_each (t [ collector_ref "." "push" "(" preamble.0 " " body_function_ref "(" element_list "[" idx_iter "]" ")" ")" ";" ])
                               (push acc t))
                            (for_each (t ["if" "(" break_out ")" " " "{" " " collector_ref "." "pop" "()" ";" "break" ";" "}"])
                               (push acc t))
                            
                            (push acc "}")))
                      
                      (push acc "return")
                      (push acc " ")
                      (push acc collector_ref)
                      (push acc ";")
                      acc)))
             
             
             (compile_while
                (fn (tokens ctx)
                   (let
                      ((acc [])
                       (idx 0)
                       (ctx (new_ctx ctx))
                       (preamble (calling_preamble ctx))
                       (test_condition tokens.1)
                       (complex_test? (not test_condition.ref))
                       (test_condition_ref (gen_temp_name "test_condition"))
                       (body tokens.2)
                       (body_ref (gen_temp_name "body_ref"))
                       (prebuild []))
                      
                      (declare (string preamble.0 preamble.1))
                      (when (verbosity ctx)
                         (console.log "compile_while: " (source_from_tokens tokens expanded_tree)))
                      (set_new_completion_scope ctx)
                      (set_ctx ctx
                               break_out
                               true)
                      
                      ;(compile (build_fn_with_assignment test_condition_ref test_condition.name nil ctx) ctx))
                      (when complex_test?
                         (push prebuild (compile (build_fn_with_assignment test_condition_ref test_condition.val nil ctx) ctx)))
                      
                      (push prebuild (compile (build_fn_with_assignment body_ref body.val nil ctx) ctx))
                      
                      
                      (for_each (t [ "let" " " break_out "=" "false" ";"])
                         (push prebuild t))
                      
                      (if complex_test?
                         (for_each (t [ "while" "(" preamble.0 " " test_condition_ref "()" ")" " " "{" " " preamble.0 " " body_ref "()" ";" " " "if" "(" break_out ")" " " "{" " " "break" ";" "}" "}" " " "" ";"])
                            (push prebuild t))
                         (for_each (t [ "while" "(" (compile test_condition ctx) ")" " {" " " preamble.0 " " body_ref "()" ";" " " "if" "(" break_out ")" " " "{" " " "break" ";" "}" "}" " " "" ";"])
                            (push prebuild t)))
                      (for_each (t [ preamble.0 " " "(" preamble.1 " " "function" "()" "{" " " prebuild "}" ")" "()" ])
                         (push acc t))
                      acc)))
             
             (compile_for_with
                (fn (tokens ctx preamble)
                   (let
                      ((preamble (calling_preamble ctx))
                       (ctx (new_ctx ctx)))
                      (declare (string preamble.2 preamble.0 preamble.1))
                      (set_new_completion_scope ctx)
                      [preamble.2 preamble.0 " " "(" preamble.1 " " "function" "()" " " "{"
                       (compile_for_with_inner tokens ctx preamble)
                       " " "}" ")" "()" ])))
             
             (compile_for_with_inner
                (fn (tokens ctx preamble)
                   (let
                      ((acc [])
                       (idx 0)
                       (stmts [])
                       (iter_ref (gen_temp_name "iter"))
                       (idx_iters [])
                       (generator_expression (gen_temp_name "elements"))
                       (body_function_ref (gen_temp_name "for_body"))
                       (prebuild [])
                       (for_args tokens.1.val)
                       (iterator_ref for_args.0)
                       (elements (last for_args))
                       (iter_count (if for_args
                                        (- for_args.length 1)
                                        0))
                       (for_body tokens.2)
                       (body_is_block? (is_block? for_body.val)))
                      
                      (when (< iter_count 1)
                         
                         (throw SyntaxError "Invalid for_each arguments"))
                      
                      (for_each (iter_ref (range iter_count))
                         (do
                            (push idx_iters (prop for_args iter_ref))
                            (set_ctx ctx
                                     (clean_quoted_reference (prop (last idx_iters) `name))
                                     ArgumentType)))
                      
                      
                      (set_ctx ctx generator_expression "arg")
                      (when (not body_is_block?)
                         ;; we need to make it a block for our function
                         (= for_body (make_do_block for_body)))
                      
                      (= prebuild (build_fn_with_assignment body_function_ref
                                                            for_body.val
                                                            idx_iters
                                                            ctx))
                      
                      (set_prop ctx
                         `block_step
                         0)
                      
                      (set_prop ctx
                         `return_last_value
                         true)
                      
                      (push acc (compile prebuild ctx))
                      
                      (for_each (t [ "let" " " break_out "=" "false" ";"])
                         (push acc t))
                      
                      (set_ctx ctx body_function_ref AsyncFunction)
                      ;; for the simplest, fastest scenario, one binding variable to the list
                      (cond
                         (and (== for_args.length 2) ;; simplest (for_each (i my_array) ...
                              (not (is_array? for_args.1)))
                         (do
                            (for_each (t ["for" " " preamble.0 " " "(" "const" " "  iter_ref " " "of" " "  (compile_wrapper_fn elements ctx) ")" " " "{" ])
                               (push acc t))
                            
                            (for_each (t [ preamble.0 " " body_function_ref "(" iter_ref ")"  ";" ])
                               (push acc t))
                            (for_each (t ["if" "(" break_out ")" " "  "break" ";"])
                               (push acc t))
                            
                            (push acc "}")))
                      
                      acc)))
             
             ;; checking the compiler context is fairly expensive so unless verbosity is declared or set globally,
             ;; the verbosity function is set to silence.  After the initialization block, global verbosity is
             ;; checked, and if on, verbosity is set to check_verbosity.
             
             (silence (fn ()
                          false))
             (verbosity silence)
             (check_verbosity (fn (ctx)
                                  (-> Environment `get_global "__VERBOSITY__")))
             
             (declare_log (if opts.quiet_mode
                               log
                               (defclog { `prefix: "DECLARE" `color: "white" `background: "black" })))
             (compile_declare (fn (tokens ctx)
                                  (let
                                     ((expressions (rest tokens))
                                      (targeted nil)
                                      (acc [])
                                      (source nil)
                                      (details nil)
                                      (sanitized_name nil)
                                      (declaration nil)
                                      (dec_struct nil))
                                     
                                     (for_each (exp expressions)
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
                                                 (for_each (name (each targeted `name))
                                                    (do
                                                       (= sanitized_name (sanitize_js_ref_name name))
                                                       (= dec_struct (get_declaration_details ctx name))
                                                       
                                                       (when dec_struct
                                                          ;; this is a global so we just produce a reference for this
                                                          (for_each (t [ "let" " " sanitized_name "=" ])
                                                             (push acc t))
                                                          (cond
                                                             (and (is_function? dec_struct.value)
                                                                  (prop (prop Environment.definitions name)
                                                                        `fn_body))
                                                             (do
                                                                (= details (prop Environment.definitions name))
                                                                (= source (+ "(fn " details.fn_args " " details.fn_body ")"))
                                                                
                                                                (= source (compile (tokenize (read_lisp source) ctx) ctx 1000))
                                                                
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
                                                            (do
                                                               (set_ctx ctx "__VERBOSITY__" verbosity_level)
                                                               (declare_log "compiler: verbosity set: " (get_ctx ctx "__VERBOSITY__")))
                                                            (do
                                                               (declare_log "verbosity: turned off")
                                                               (= verbosity silence)
                                                               (set_ctx ctx "__VERBOSITY__" nil)))
                                                        (= verbosity check_verbosity)
                                                        (declare_log "compiler: verbosity set: " (verbosity ctx)))
                                                     (push warnings
                                                        "invalid verbosity declaration, expected number, received " (first (each targeted `name)))))
                                              (== declaration "local")
                                              (for_each (name (each targeted `name))
                                                 (do
                                                    (= dec_struct (get_declaration_details ctx name))
                                                    (set_ctx ctx name dec_struct.value)))
                                              (== declaration "function")
                                              (do
                                                 (for_each (name (each targeted `name))
                                                    (set_declaration ctx name `type Function)))
                                              (== declaration "fn")
                                              (do
                                                 (for_each (name (each targeted `name))
                                                    (set_declaration ctx name `type AsyncFunction)))
                                              (== declaration "array")
                                              (do
                                                 (for_each (name (each targeted `name))
                                                    (set_declaration ctx name `type Array)))
                                              (== declaration "number")
                                              (do
                                                 (for_each (name (each targeted `name))
                                                    (set_declaration ctx name `type NumberType)))
                                              (== declaration "string")
                                              (do
                                                 (for_each (name (each targeted `name))
                                                    (set_declaration ctx name `type StringType)))
                                              (== declaration "boolean")
                                              (do
                                                 (for_each (name (each targeted `name))
                                                    (set_declaration ctx name `type Boolean)))
                                              (== declaration "regexp")
                                              (do
                                                 (for_each (name (each targeted `name))
                                                    (set_declaration ctx name `type RegExp)))
                                              (== declaration "object")
                                              (do
                                                 (for_each (name (each targeted `name))
                                                    (set_declaration ctx name `type Object)))
                                              (== declaration "global")
                                              (do
                                                 (for_each (name (each targeted `name))
                                                    (set_declaration ctx name `location "global")))
                                              (== declaration "optimize")
                                              (do
                                                 (for_each (factor (each targeted `val))
                                                    (do
                                                       (= factor (each factor `name))
                                                       (cond
                                                          (== factor.0 "safety")
                                                          (set_declaration ctx "__SAFETY__" `level factor.1)
                                                          (== factor.0 "debug")
                                                          (progn
                                                             (set_declaration ctx "__DEBUG__" `level (parseInt factor.1)))))))
                                              (== declaration "namespace")
                                              (do
                                                 (when (not (== targeted.length 1))
                                                    (throw SyntaxError "namespace declaration requires exactly 1 value"))
                                                 (when (get_ctx ctx "__IN_LAMBDA__")
                                                    (throw SyntaxError "namespace compiler declaration must be toplevel"))
                                                 (setq target_namespace targeted.0.name)
                                                 ;; reset our environment pointer
                                                 (setq Environment
                                                    (-> Environment `get_namespace_handle targeted.0.name)))
                                              
                                              
                                              else
                                              (do
                                                 (push warnings
                                                    (+ "unknown declaration directive: " declaration))
                                                 (warn (+ "compiler: unknown declaration directive: " declaration))))))
                                     acc)))
             
             (safety_level (fn (ctx)
                               (when ctx
                                  (defvar `safety (get_declarations ctx "__SAFETY__"))
                                  (if safety
                                     safety.level
                                     default_safety_level))))
             (debug_level (fn (ctx)
                             (if ctx
                                (aif (get_declarations ctx "__DEBUG__")
                                     it.level
                                    0)
                                0)))
             (get_scoped_type (fn (name)
                                  (let
                                     ((rtype (get_ctx ctx name)))
                                     (if (== undefined rtype)
                                         (sub_type (get_lisp_ctx ctx name))
                                         (sub_type rtype)))))
             
             (compile_scoped_reference
                (fn (tokens ctx)
                   (let
                      ((acc [])
                       (idx 0)
                       (ref_type nil)
                       (rval nil)
                       (stmt nil)
                       (preamble (calling_preamble ctx))
                       (sr_log (defclog { `prefix: (+ "compile_scoped_reference (" (or ctx.block_id "-") "):") `background: "steelblue" `color: `white}))
                       (val nil)
                       (call_type (cond
                                      (not tokens.0.ref)
                                      "literal"
                                      (get_ctx_val ctx tokens.0.name)
                                      "local"
                                      (get_lisp_ctx ctx tokens.0.name)
                                      "lisp"))
                       (token nil))
                      (declare (string preamble.0 preamble.1 preamble.2))
                      (cond
                         (== call_type "lisp")
                         (= ref_type (get_lisp_ctx ctx tokens.0.name))
                         (== call_type "local")
                         (= ref_type (get_ctx_val ctx tokens.0.name))
                         else
                         (= ref_type ArgumentType))
                      
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
                         (== ref_type NumberType)
                         (= ref_type ArgumentType)
                         (== ref_type StringType)
                         (= ref_type "StringType")
                         (== ref_type ArgumentType)
                         true
                         else
                         (= ref_type (sub_type ref_type)))
                      (when (verbosity ctx)
                         (sr_log "SYMBOL: " tokens.0.name "  found as:" call_type " of type:" ref_type "sanitized as: "  (if (== "local" call_type) (+ " local sanitized to: " (sanitize_js_ref_name tokens.0.name)))))
                      (= rval
                         (cond
                            (== ref_type "AsyncFunction")
                            (do
                               (push acc preamble.0)
                               (push acc " ")
                               (push acc (if (== call_type `lisp)
                                             (compile_lisp_scoped_reference tokens.0.name ctx)
                                             (sanitize_js_ref_name tokens.0.name)))
                               (push acc "(")
                               (while (< idx (- tokens.length 1))
                                  (do
                                     (inc idx)
                                     (= token (prop tokens idx))
                                     (= stmt (compile_wrapper_fn token ctx {}))
                                     (push acc stmt)
                                     (when (< idx (- tokens.length 1))
                                        (push acc ","))))
                               (push acc ")")
                               acc)
                            (== ref_type "Function")
                            (do
                               (push acc preamble.0)
                               (push acc " ")
                               (push acc (if (== call_type `lisp)
                                             (compile_lisp_scoped_reference tokens.0.name ctx)
                                             (sanitize_js_ref_name tokens.0.name)))
                               (push acc "(")
                               (while (< idx (- tokens.length 1))
                                  (do
                                     (inc idx)
                                     (= token (prop tokens idx))
                                     (= stmt (compile_wrapper_fn token ctx {}))
                                     (push acc stmt)
                                     (when (< idx (- tokens.length 1))
                                        (push acc ","))))
                               (push acc ")")
                               acc)
                            
                            (and
                               (== call_type "local")
                               (or (== ref_type "NumberType")
                                   (== ref_type "StringType")
                                   (== ref_type "Boolean")))
                            (do
                               ;(sr_log "<- local scoped reference is: " tokens.0.name)
                               (push acc tokens.0.name)
                               acc)
                            
                            (and (== call_type "local")
                                 (not (== ref_type ArgumentType))
                                 (is_array? tokens))
                            (do
                               (when (verbosity ctx)
                                  (sr_log "<- local, get_ctx_val returns: " (get_ctx_val ctx tokens.0.name) "local: " (get_ctx ctx tokens.0.name) "ctx: " (clone ctx)))
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
             
             (compile_lisp_scoped_reference
                (fn (refname ctx defer_not_found)
                   (let
                      ((refval (get_lisp_ctx ctx refname))
                       (reftype (sub_type refval))
                       (declarations nil)
                       (preamble (calling_preamble ctx))
                       (basename (get_object_path refname)))
                      
                      (declare (string preamble.0))
                      
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
                      
                      (when (and (or (== reftype "StringType")
                                     (== reftype "String"))
                                 (not (== refval undefined)))
                         ;(not (== refval "__!NOT_FOUND!__")))
                         (= refval "text"))
                      
                      
                      (cond
                         (contains? basename.0 standard_types)   ;; Certain standard types are automatically available everywhere and are not specific to the lisp environment
                         refname
                         
                         declarations.inlined
                         refname ;; it's been placed in source, so don't get the global, use the inlined reference
                         
                         (not (== refval undefined))
                         
                         (do
                            (= has_lisp_globals true)
                            [{ `ctype: (if (and (not (is_function? refval)) (is_object? refval)) "object" refval) } "(" preamble.0 " " env_ref "get_global" "(\"" refname  "\")" ")"])
                         
                         ;; this will allow for a non-exception event, for example in a typeof situation where you want to check the type of something at runtime
                         ;; that may not exist at compile time
                         defer_not_found
                         [ "(" env_ref "get_global" "(\"" refname  "\", ReferenceError)" ")"]
                         else
                         (do
                            (throw ReferenceError (+ "unknown lisp reference: " refname)))))))
             
             
             ;; DLisp mandatory defined globals plus the current global set
             (standard_types (let
                                 ((all_vals (make_set
                                                      (uniq (conj [`AsyncFunction `check_true `LispSyntaxError `dlisp_environment_count `clone `super `Class
                                                                   `Environment `Expression `get_next_environment_id `subtype `lisp_writer `do_deferred_splice ]
                                                                  (object_methods globalThis))))))
                                 (-> all_vals `delete "length") ;; length sometimes seems to be a globalThis value, so we need to remove it, otherwise it will screw us up..
                                 all_vals))
             (externals (make_set (object_methods globalThis)))
             
             (is_error nil)
             
             (is_block? (fn (tokens)
                            (and (== tokens.0.type "special")
                                 (contains? tokens.0.name ["do" "progn"]))))
             
             (is_complex? (fn (tokens)
                              (let
                                 ((rval (or (is_block? tokens)
                                            (and (== tokens.type "arr")
                                                 (is_block? tokens.val))
                                            (and (== tokens.0.type "special")
                                                 (or (== tokens.0.name "let")
                                                     (== tokens.val.0.name "if")
                                                     (== tokens.val.0.name "let"))))))
                                 
                                 rval)))
             
             (is_form? (fn (token)
                           (or (is_array? token.val )
                               (is_block? token.val))))
             
             (op_lookup  { "+": infix_ops
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
                                        (compile_block tokens ctx { `no_scope_boundary: true `suppress_return:true `force_no_new_ctx: true }))
                            "break": compile_break
                            "inc": compile_val_mod
                            "dec": compile_val_mod
                            "try": compile_try
                            "throw": compile_throw
                            "let": compile_let
                            "defvar": compile_defvar
                            "defconst": (fn (tokens ctx)
                                           (if (get_ctx ctx `__LOCAL_SCOPE__)
                                               (compile_defvar tokens ctx { `constant: true })
                                               (compile_set_global tokens ctx { `constant: true })))
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
                            "eval": compile_eval
                            "jslambda": compile_jslambda
                            "javascript": compile_javascript
                            "instanceof": compile_instanceof
                            "typeof": compile_typeof
                            "unquotem": compile_unquotem
                            "debug": compile_debug
                            "declare": compile_declare
                            "static_import" : compile_import
                            "dynamic_import" : compile_dynamic_import
                            })
             (comp_log (if quiet_mode
                            log
                            (defclog { `background: "LightSkyblue" `color: "#000000" } )))
             
             (last_source nil)
             
                                        
             (compile_obj_literal
                (fn (tokens ctx)
                   (let
                      ((acc [])
                       (idx -1)
                       (stmt nil)
                       (has_valid_key_literals true)
                       (token nil)
                       (preamble (calling_preamble ctx))
                       (key nil)
                       (output_val nil)
                       (tmp_name nil)
                       (ctx (new_ctx ctx))
                       (kvpair nil)
                       (total_length (- tokens.val.length 1)))
                      
                      (declare (string preamble.0 preamble.1 preamble.2 tmp_nam))
                      
                      (set_prop ctx
                         `in_obj_literal
                         true)
                      ;; scan the keys to ensure that they are valid
                      ;; if not we will have to build the object from setters
                      ;; vs literals
                      ;(console.log "comp obj literal: " tokens)
                      (for_each (token (or tokens.val []))
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
                                      
                                      (= key (get_val kvpair.val.0 ctx))
                                      (when (and (== key.length 1)
                                                 (== (-> key `charCodeAt) 34))
                                         (= key "'\"'"))
                                      
                                      (push acc key)
                                      
                                      (push acc ":")
                                      (set_ctx ctx
                                               `__LAMBDA_STEP__
                                               -1)
                                      (= stmt (compile_wrapper_fn kvpair.val.1 ctx))
                                     
                                      (assert stmt "compile: obj literal value returned invalid/undefined value.")
                                      (push acc stmt)
                                      (when (< idx total_length)
                                         (push acc ","))))
                                
                                ;; key - kvpair[0]: push in the literal identifier
                                
                                (push acc "}")
                                [{ `ctype: "objliteral" } acc]))
                         (do
                            (= tmp_name (gen_temp_name "obj"))
                            
                            (for_each (t [{ `ctype:`statement }  preamble.0 " " "(" " " preamble.1 " " "function" "()" "{" "let" " " tmp_name "=" "new" " " "Object" "()" ";"])
                               (push acc t))
                            (while (< idx total_length)
                               (do
                                  (inc idx)
                                  (= kvpair (prop tokens.val idx))
                                  (= output_val (or (compile_wrapper_fn kvpair.val.1 ctx) "null"))
                                  ;(console.log "kvpair:val:"  (cl_encode_string (get_val kvpair.val.0 ctx)) "=" output_val)
                                  ;;(if (== kvpair.val.0 "streams")
                                  (try 
                                     (+ "" output_val)  ;; detect if this is a special object, such as a module, which are hard to directly detect
                                     (catch Error (e)
                                        (progn
                                           
                                           (= output_val "null"))))
                                  (for_each (t [tmp_name "[" "\"" (cl_encode_string (get_val kvpair.val.0 ctx)) "\"" "]" "=" output_val ";"])
                                     (push acc t))))
                            
                            (for_each (t ["return" " " tmp_name ";" "}" ")" "()"])
                               (push acc t))
                            
                            acc)))))
             
             (is_literal? (fn (val)
                              (or (is_number? val)
                                  (is_string? val)
                                  (== false val)
                                  (== true val))))
             (comp_warn (defclog { `prefix: "compile: [warn]:" `background: "#fcffc8" `color: "brown" } ))
             ;; main entry wrapper for the compilation function - all call this, not compile_inner
             (compile (fn (tokens ctx _cdepth)
                          (if is_error
                             is_error  ;; unwind
                             (progn
                                (defvar _dbg_level (debug_level ctx))
                                (defvar rval (compile_inner tokens ctx _cdepth _dbg_level))
                                (if is_error
                                   (do
                                      (if opts.throw_on_error
                                         (do
                                            (defvar error (new Error is_error.error))
                                            (for_each (pset (pairs is_error))
                                               (set_prop error
                                                  pset.0
                                                  pset.1))
                                            (throw error)))))
                                (when (and (> _dbg_level 1)
                                           (is_object? (first rval))
                                           (> (length rval) 2))
                                   (set_prop (first rval) `source_comment (truncate 100 (source_from_tokens tokens expanded_tree) "...")))
                                rval))))
             ;; main recursive structure
             (compile_inner
                (fn (tokens ctx _cdepth _dbg_level)
                   (let
                      ((operator_type nil)
                       (op_token nil)
                       (rcv nil)
                       (op nil)
                       (_cdepth (or _cdepth 100))
                       (acc [])
                       (preamble (calling_preamble ctx))
                       (tmp_name nil)
                       (refval nil)
                       (ref nil))
                      (declare (array preamble)
                               (string preamble.0 preamble.1 preamble.2 tmp_name)
                               (function op))
                      (when throttle_level
                         (if (is_number? throttle_level)
                             (sleep (* 0.001 throttle_level))))
                      (when (verbosity ctx)
                         (comp_log (+ "compile: " _cdepth "->") (clone tokens) (clone ctx)))
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
                                         (== Function (get_ctx_val ctx tokens.0.name))
                                         (== AsyncFunction (get_ctx_val ctx tokens.0.name))
                                         (== "function" (typeof (prop root_ctx.defined_lisp_globals tokens.0.name)))
                                         (and (is_function? (get_lisp_ctx ctx tokens.0.name))
                                              (not (get_ctx_val ctx tokens.0.name)))))
                                (do
                                   (= op_token (first tokens))
                                   (= operator (prop op_token `name))
                                   (= operator_type (prop op_token `val))
                                   (= ref (prop op_token `ref))
                                   (= op (prop op_lookup operator))
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
                                   (compile_obj_literal tokens ctx))
                                
                                (is_array? tokens)
                                (do
                                   (cond
                                      ;; simple case, just an empty array, return js equiv
                                      (== tokens.length 0)
                                      [{ `ctype: "array" `is_literal: true } "[]" ]
                                      else
                                      (let
                                         ((is_operation false)
                                          (declared_type nil)
                                          (prefix "")
                                          (ctx (new_ctx ctx))
                                          (symbolic_replacements [])
                                          (compiled_values []))
                                         
                                         (when (verbosity ctx)
                                            (comp_log (+ "compile: " _cdepth " array: ") "compiling: " (source_from_tokens tokens tokens expanded_tree)))
                                         (set_new_completion_scope ctx)
                                         
                                         ;; in this case we need to compile the contents of the array
                                         ;; and then based on the results of the compilation determine
                                         ;; if it is an evaluation (first element of the array is a
                                         ;; function or operator) or a non operation.  If the former
                                         ;; it must be evaluated and returned or if the latter, returned
                                         ;; as an array of values.
                                         
                                         ;; the first element is the operator potentially...
                                         (when (and tokens.0.ref (is_string? tokens.0.val))
                                            (= declared_type (get_declarations ctx tokens.0.name)))
                                         
                                         (= rcv (compile tokens.0 ctx (+ _cdepth 1)))
                                         
                                         (when (verbosity ctx)
                                            (comp_log (+ "compile: " _cdepth " array: ") "potential operator: " tokens.0.name "declarations: " declared_type))
                                         
                                         ;; compiled values will hold the compiled contents
                                         
                                         (for_each (t (rest tokens))
                                            (do
                                               
                                               (if (not (get_ctx_val ctx `__IN_LAMBDA__))
                                                   (set_ctx ctx
                                                            `__LAMBDA_STEP__
                                                            0))
                                               
                                               (push compiled_values
                                                  (compile_wrapper_fn t ctx))))
                                         
                                         ;; next we need to go through and find any blocks
                                         ;; that need to be wrapped in a temp variable so we don't
                                         ;; end up writing them out twice due to the array construction
                                         ;; but we also need to preserve the order of evaluation of each array element
                                         ;; from first to last.
                                         
                                         ;; TODO: review below map block if superfluous due to using compiled_wrapper_fn already
                                         
                                         (map (fn (compiled_element idx)
                                                 (let
                                                    ((inst (cond
                                                               (and (is_object? compiled_element.0)     ;; get the instructive metadata from the compiled structure
                                                                    (prop compiled_element.0 `ctype))
                                                               (prop compiled_element.0 `ctype)
                                                               (== compiled_element.0 "{")
                                                               "block"
                                                               else
                                                               nil)))
                                                    (cond
                                                       (or (== inst "block")
                                                           (== inst "letblock"))
                                                       (do
                                                          ;; the argument offset, the temp variable name and the wrapped function are made available
                                                          (push symbolic_replacements
                                                             [ idx (gen_temp_name "array_arg")
                                                                  [ preamble.2 "(" preamble.1 " " "function" "()" " " compiled_element " " ")"]]))
                                                       
                                                       (== inst "ifblock")
                                                       (do
                                                          (push symbolic_replacements
                                                             [ idx (gen_temp_name "array_arg")
                                                                  [preamble.2 "(" preamble.1 " " "function" "()" " " "{" compiled_element  "}" " " ")"]])))))
                                              
                                              compiled_values)
                                         
                                         ;; next layout the code, and substitute in compiled_values the references to the functions
                                         ;; in the compiled_values array
                                         
                                         (for_each (elem symbolic_replacements)
                                            (do
                                               ;; create the function
                                               (for_each (t ["let" " " elem.1 "=" elem.2 ";"])
                                                  (push acc t))
                                               ;; splice in the reference
                                               (-> compiled_values `splice elem.0 1 [preamble.0 " " elem.1 "()"])))
                                         
                                         
                                         ;; if we have symbolic replacements, we need to generate a block
                                         ;; and return that since we have to more processing in place
                                         
                                         (when (> symbolic_replacements.length 0)
                                            (prepend acc "{")
                                            (prepend acc { `ctype: "block" }))
                                         
                                         (cond
                                            (or (== declared_type.type Function)
                                                (== declared_type.type AsyncFunction)
                                                (and (is_object? rcv.0)
                                                     (is_function? rcv.0.ctype))
                                                (and (is_object? rcv.0)
                                                     (not (is_array? rcv.0))
                                                     (is_string? rcv.0.ctype)
                                                     (contains? "unction" rcv.0.ctype)))
                                            (do
                                               (if (== declared_type.type AsyncFunction)
                                                   (= prefix "await ")
                                                   (= prefix ""))
                                               (= is_operation true)
                                               (for_each (t [ prefix "(" rcv ")" "(" ])
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
                                                                  (not (contains? "block" rcv.0.ctype))
                                                                  (not (== "string" rcv.0.ctype))
                                                                  (not (== "StringType" rcv.0.ctype))
                                                                  (not (== "nil" rcv.0.ctype))
                                                                  (not (== "NumberType" rcv.0.ctype))
                                                                  (not (== "undefined" rcv.0.ctype))
                                                                  (not (== "objliteral" rcv.0.ctype))
                                                                  (not (== "Boolean" rcv.0.ctype))
                                                                  (not (== "array" rcv.0.ctype)))))))  ;; TODO - RUNTESTS HERE MODIFIED
                                            
                                            
                                            ;; an ambiguity which results in a performance penalty because we need
                                            ;; create a function that checks the first symbol in the array is a function
                                            ;; if the first symbol in the array is a reference.
                                            
                                            (do ;; tell the user of this opportunity if they want to know...
                                               (when show_hints
                                                  (comp_warn "value ambiguity - use declare to clarify: " (source_from_tokens tokens expanded_tree true) " "
                                                             (as_lisp rcv)))
                                               (= tmp_name (gen_temp_name "array_op_rval"))
                                               
                                               (when (> symbolic_replacements.length 0)
                                                  ;; this means it is a block and we need to return the last value
                                                  (push acc { `ctype: "block" })
                                                  (push acc "return")
                                                  (push acc " "))
                                               
                                               (for_each (t [preamble.0 " " "(" preamble.1 " " "function" "()" "{" "let" " " tmp_name "=" rcv ";" " "  "if" " " "(" tmp_name " " "instanceof" " " "Function" ")" "{"
                                                              "return" " " preamble.0 " " tmp_name "(" ])
                                                  (push acc t))
                                               (push_as_arg_list acc compiled_values)
                                               (for_each (t [")" " " "}" " " "else" " " "{" "return" " " "[" tmp_name ])
                                                  (push acc t))
                                               
                                               (when (> (length (rest tokens)) 0)
                                                  (push acc ",")
                                                  (push_as_arg_list acc compiled_values))
                                               (for_each (t ["]" "}" "}" ")" "()"])
                                                  (push acc t)))
                                            
                                            (and (eq nil declared_type.type)
                                                 (or (and (is_array? rcv)
                                                          (is_object? rcv.0)
                                                          (is_string? rcv.0.ctype)
                                                          (contains?  "block" rcv.0.ctype))))
                                            (do
                                               (when (> symbolic_replacements.length 0)
                                                  (push acc "return")
                                                  (push acc " "))
                                               (push acc "[")
                                               (push acc [ "(" preamble.0 " " "(" preamble.1 " " "function" "() {" rcv "})" "()" ")" ])
                                               (when (> (length (rest tokens)) 0)
                                                  (push acc ",")
                                                  (push_as_arg_list acc compiled_values))
                                               (push acc "]"))
                                            else
                                            (
                                             (when (> symbolic_replacements.length 0)
                                                (push acc "return")
                                                (push acc " "))
                                             (push acc "[")
                                             (push acc rcv)
                                             (when (> (length (rest tokens)) 0)
                                                (push acc ",")
                                                (push_as_arg_list acc compiled_values))
                                             (push acc "]")))
                                         
                                         (when (> symbolic_replacements.length 0)
                                            (push acc "}"))
                                         
                                         acc)))
                                
                                ;; token's value is an array, so just call
                                ;; compile again with the token value which
                                ;; move through the code above..
                                
                                (and (is_object? tokens)
                                     (is_array? tokens.val)
                                     tokens.type)
                                (do
                                   (set_prop ctx
                                      `source
                                      tokens.source)
                                   (when (verbosity ctx)
                                      (comp_log (+ "compile: " _cdepth ": ") "tokens.val is array type: calling compile with: " tokens.val "ctx:" (clone ctx)))
                                   (= rcv (compile tokens.val ctx (+ _cdepth 1)))
                                   (when (verbosity ctx)
                                      (comp_log (+ "compile: " _cdepth ": ") "<-" rcv))
                                   rcv)
                                
                                ;; Simple compilations --------
                                
                                (or (and (is_object? tokens)
                                         (not (== undefined tokens.val)) ;(check_true tokens.val)
                                         tokens.type)
                                    (== tokens.type "literal")
                                    (== tokens.type "arg")
                                    (== tokens.type "null"))
                                (do
                                   (defvar `snt_name nil)
                                   (defvar `snt_value nil)
                                   (when (verbosity ctx)
                                      (comp_log (+ "compile: " _cdepth ":" ) "simple value compile: " (clone tokens)))
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
                                          [ { `ctype: "string" } (+ "\"" (cl_encode_string tokens.val) "\"") ]
                                          (if (is_number? tokens.val)
                                              [{ `ctype: "NumberType" } tokens.val ]   ;; Number is also a function that can be used so we use NumberType to represent literal numbers
                                              [{ `ctype: (sub_type tokens.val)  } tokens.val ]))  ;; straight value
                                      
                                      (and tokens.ref
                                         opts.root_environment)
                                      (do
                                         (path_to_js_syntax (split_by "." (sanitize_js_ref_name tokens.name))))
                                      
                                      (and tokens.ref
                                         (prop op_lookup tokens.name))
                                      tokens.name
                                      
                                      (and tokens.ref
                                         (do
                                            (= snt_name (sanitize_js_ref_name tokens.name))
                                            (= snt_value (get_ctx_val ctx snt_name))
                                            (when (verbosity ctx)
                                               (comp_log "compile: singleton: " "name: " tokens.name " sanitized: " snt_name "found locally as:" snt_value))
                                            
                                            (not (== snt_value undefined))))
                                      ;(or snt_value
                                      ;   (== 0 snt_value)
                                      ;  (== false snt_value))))
                                      (do
                                         (= refval snt_value)
                                         (when (== refval ArgumentType)
                                            (= refval snt_name))
                                         (cond
                                            (== tokens.type "literal")
                                            refval
                                            else
                                            (get_val tokens ctx)))
                                      
                                      (contains? tokens.name standard_types)
                                      tokens.name
                                      ;; check global scope
                                      (not (== undefined (get_lisp_ctx ctx tokens.name)))
                                      (do
                                         (when (verbosity ctx)
                                            (comp_log "compile: singleton: found global: " tokens.name))
                                         (compile_lisp_scoped_reference tokens.name ctx))
                                      
                                      
                                      else
                                      (do
                                         (when (verbosity)
                                            (comp_log "compile: resolver fall through:" tokens.name "-  not found globally or in local context"))
                                         (throw ReferenceError (+ "compile: unknown/not found reference: " tokens.name)))))
                                else
                                (do
                                   
                                   (throw SyntaxError "compile passed invalid compilation structure"))))
                         (catch Error (e)
                            (do
                               (when (and is_error
                                          e.handled)
                                  (throw e))
                               (setq is_error {
                                                `error: e.name
                                                `source_name: source_name
                                                `message: e.message
                                                `form: (source_from_tokens tokens expanded_tree)
                                                `parent_forms: (source_from_tokens tokens expanded_tree true)
                                                `invalid: true
                                                })
                               (if (not e.handled)
                                   (do (push errors
                                             is_error)
                                      (set_prop e `handled true)))
                               (set_prop e
                                  `details
                                  is_error)
                               (if opts.throw_on_error
                                  (throw e))))))))
             (final_token_assembly nil)
             (main_log (if opts.quiet_mode
                            log
                            (defclog { `prefix: "compiler:" `background: "green" `color: "black" } )))
             (assemble_output (fn (js_tree suppress_join)
                                  (let
                                     ((text [])
                                      (in_quotes false)
                                      (escaped 0)
                                      (escape_char (String.fromCharCode 92))
                                      (format_depth [])
                                      (last_t nil)
                                      (insert_indent
                                         (fn ()
                                            (do
                                               (push text "\n")
                                               (for_each (spacer format_depth)
                                                  (push text spacer)))))
                                      (process_output_token
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
                                      
                                      (assemble (fn (js_tokens)
                                                    (for_each (t js_tokens)
                                                       (cond
                                                          (is_array? t)
                                                          (do
                                                             (assemble t))
                                                          (== "object" (typeof t))
                                                          (do
                                                             (if t.source_comment
                                                                (push text (+ "/* " t.source_comment " */")))
                                                             (if t.comment
                                                                        ;opts.include_source)
                                                                (progn 
                                                                   (push text (+ "/* " t.comment " */"))
                                                                   (insert_indent))))
                                                          (is_function? t)
                                                          (do
                                                             (cond
                                                                (and t.name (contains? t.name standard_types))
                                                                (push text t.name)
                                                                (ends_with? "{ [native code] }" (-> t `toString))
                                                                (do
                                                                   (throw ReferenceError (+ "cannot capture source of: " t.name)))
                                                                else
                                                                (push text t)))
                                                          else
                                                          (do
                                                             (if opts.formatted_output
                                                                (process_output_token t)
                                                                (push text t))))))))
                                     (do
                                        (assemble (flatten [js_tree]))
                                        (if suppress_join
                                           text
                                           (do
                                              ;(console.log (join "" text))
                                              (join "" text))))))))
           
            (declare (optimize (safety 2))
                     (include length first second map do_deferred_splice
                              not sub_type last flatten add subtype
                              is_nil? is_number? starts_with? uniq object_methods conj
                              cl_encode_string contains?)
                     (function error_log comp_time_log inline_log clog
                        run_log quotem_log top_level_log eval_log
                        declare_log opts.error_report comp_warn
                        sr_log comp_log)
                     (local check_true clone))
            
            ;; We need an environment object in order to find and set
            ;; resources.  If one isn't passed, throw an error.
            
            (if (eq nil Environment)
                (throw EvalError "Compiler: No environment passed in options."))
            
            ;; showing of hints can be turned on via a compiler option passed
            ;; 'show_hints' or by a verbosity setting 4 or higher
            
            (when opts.show_hints
               (= show_hints true))
            
            ;; if verbosity is set in the global context, set our verbosity function...
            ;; to be active.
            
            (when (-> Environment `get_global "__VERBOSITY__")
               (let
                  ((verbosity_level (-> Environment `get_global "__VERBOSITY__")))
                  (cond
                     (> verbosity_level 4)
                     (progn
                        (= verbosity check_verbosity)
                        (= show_hints true))
                     (> verbosity_level 3)
                     (= show_hints true))))
            ;; setup key values in the context for flow control operations
            ;; break - the looping constructs will return down the stack if
            ;;         the special reference __BREAK__FLAG__ is true for their
            ;;         parent context
            
            (when (verbosity ctx)
               (main_log "namespace set to: " Environment.namespace)
               (when opts.fully_qualified_globals
                  (main_log "fully qualified globals")))
            
            (set_ctx root_ctx
                     break_out
                     false)
            (set_prop root_ctx
               `defined_lisp_globals
               {})
            
            (set_ctx root_ctx
                     `__COMPLETION_SCOPE__
                     {
                       id: completion_scope_id
                       root_block_id: nil
                       completion_records: []
                       is_top: true
                       })
            (set_ctx root_ctx
                     `__GLOBALS__
                     (new Set))
            (set_ctx root_ctx
                     `__EXTERNALS__
                     (new Set))
            (set_ctx root_ctx
                     `__SOURCE_NAME__
                     source_name)
            
            (set_ctx root_ctx
                     `__LAMBDA_STEP__
                     -1)
            (when (verbosity ctx)
               (main_log "root_ctx: " root_ctx))
            ;; generate the output.
            (= output
               (cond
                  opts.special_operators
                  (do
                     ;(console.log "compiler returning special ops")
                     (make_set (keys op_lookup)))
                  
                  opts.only_tokens
                  (tokenize tree root_ctx)
                  
                  is_error
                  [{ `ctype: `CompileError } is_error]
                  
                  else
                  (do
                     (try
                        (do ;; dynamic references are experimental
                           (when (and (not opts.root_environment)
                                    (== first_level_setup.length 0)
                                    (is_object? opts.ctx.scope))
                              (= dynamic_references? false)
                              (for_each (pset (pairs opts.ctx.scope))
                                  (destructuring_bind (name value)
                                     pset
                                     (set_ctx root_ctx name value)
                                     (push first_level_setup
                                        ["let " (sanitize_js_ref_name name) "=" (compile (tokenize value root_ctx) root_ctx 101) ";" ]))))
                               
                               
                           (= final_token_assembly (tokenize tree root_ctx)))
                        (catch Error (e)
                           (= is_error e)))
                     (cond
                        (and is_error opts.throw_on_error)
                        (throw is_error)
                        (instanceof is_error SyntaxError)
                        (do (push errors
                                  is_error)
                           is_error)
                        is_error
                        (do
                           (push errors is_error)
                           is_error)
                        
                        (eq nil final_token_assembly)
                        (do
                           (= is_error (new EvalError "Pre-Compilation Error"))
                           (push errors is_error))
                        else
                        (do
                           ;; we have tokenized and processed the input tree, now compile...
                           ;; if we have a call out for this call it, as this is useful
                           ;; for collection of the processed source in case of compilation errors
                           
                           (if opts.on_final_token_assembly
                              (-> opts `on_final_token_assembly final_token_assembly))
                           (= assembly (compile final_token_assembly
                                          root_ctx
                                          0))
                           
                           (when (and is_error
                                      opts.throw_on_error)
                              (throw is_error))
                           (when (not is_error)
                              (when (is_array? assembly)
                                 (check_statement_completion root_ctx assembly)))
                           assembly))
                     
                     
                     ;; if we are compiling with the root_environment option as true
                     ;; we don't have a pre-existing environment, because we are
                     ;; compiling the environment.
                     (when opts.root_environment
                        (= has_lisp_globals false))
                     
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
                                    ((val (prop (first assembly) `ctype)))
                                    (and (not (== val "assignment"))
                                         (not (contains? "block" val))
                                         (not (contains? "unction" val))))))
                        (progn
                           (set_prop assembly.0
                           `ctype
                           "statement"))
                        (and assembly
                           (is_string? (first assembly))
                           (== (first assembly) "throw"))
                        (= assembly
                           [ { `ctype: `block } assembly])
                        (and (not is_error)
                             assembly
                             (or (not (is_object? (first assembly)))
                                 (not (prop (first assembly) `ctype))))
                        (progn
                           (if dynamic_references?
                              (= assembly [ { `ctype: `block } ["{" first_level_setup ";" "return " assembly "};" ]])
                              (= assembly
                                 [ { `ctype: `statement } assembly])))
                        is_error
                        is_error
                        (eq nil assembly)
                        (= assembly []))
                     
                     (if is_error
                        (do
                           [ { `ctype: "FAIL" }  errors])
                        (if (is_object? (first assembly))
                            [(+ { `has_lisp_globals: has_lisp_globals `requires: (to_array referenced_global_symbols) `externals: (to_array referenced_externals) }
                                (take assembly))
                             (assemble_output assembly)]
                            [{`has_lisp_globals: has_lisp_globals `requires: (to_array referenced_global_symbols) `externals: (to_array referenced_externals)} 
                                                 (assemble_output assembly)])))))
            
            (when (and (is_object? (first output))
                       target_namespace)
               (set_prop (first output)
                         `namespace
                         target_namespace))
            
            (when opts.error_report
               (opts.error_report { `errors: errors `warnings: warnings}))
            output))))

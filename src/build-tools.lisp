;; Part of Juno Core Language
;; These utilities help with building the environment and saving the environment image

(declare (namespace `core))

(defun compile_buffer (input_buffer export_function_name options)
   (let
      ((output_filename options.output_file)
       (opts (+ {}
                (or options {})
                { want_buffer: (if (or options.want_buffer
                                       (eq nil output_filename))
                                   true
                                   false) }))
       (export_function_name (or export_function_name "initializer"))
       (segments [])
       (export_segment [])
       (include_boilerplate (if (== false opts.include_boilerplate)
                                false
                                true))
       (start_time (time_in_millis))
       (compile_time nil)
       (write_file true)
       (import_headers (if (is_object? options.imports)
                           (map (fn (import_set idx)
                                   (let
                                      ((target import_set.1.symbol)
                                       (imp_details import_set.1.location))
                                      [ (+ "import * as " (+ target "_module") " from '" imp_details "'\n"
                                           "export const " target "=" (+ target "_module") ";") ]
                                      ))
                                (pairs options.imports))
                           []))
       (include_source (if opts.include_source
                           true
                           false))
       (compiled nil) ; holds the compilation output
       (invalid_js_ref_chars "+?-%&^#!*[]~{}|")
       (invalid_js_ref_chars_regex (new RegExp "[\\%\\+\\[\\>\\?\\<\\\\}\\{&\\#\\^\\=\\~\\*\\!\\)\\(\\-]+"))
       (boilerplate "const { get_next_environment_id, check_true, get_outside_global, subtype, lisp_writer, clone, LispSyntaxError } = await import(\"./lisp_writer.js\");")
       (compiled_js nil))
      
      ;; check the export name for being valid...
      
      (when (> (length (scan_str invalid_js_ref_chars_regex export_function_name)) 0)
         (throw SyntaxError (+ "export function name contains an invalid JS character: " export_function_name ", cannot contain: " invalid_js_ref_chars)))
      
      ;; add any build headers first
      
      (push segments
         (+ "// Source: " options.input_filename "  "))
      
      (when (> import_headers.length 0)
         (for_each (`static_import import_headers)
            (push segments static_import))
         (push segments "\n"))
      
      (when (is_array? opts.build_headers)
         (for_each (`header opts.build_headers)
            (push segments header))
         (push segments "\n"))
      (push segments "\n")
      ;; add the boilerplate dependencies..
      (if include_boilerplate
         (push segments boilerplate))
      
      ;; add any user included  dependencies
      (when (is_array? opts.js_headers)
         (for_each (`header opts.js_headers)
            (push segments header))
         (push segments "\n"))
      
      
      (when (or (== export_function_name "init_dlisp")
                opts.toplevel)
         (push segments "if (typeof AsyncFunction === \"undefined\") {\n  globalThis.AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;\n}"))
      
      (if (and (is_array? input_buffer)
               (== input_buffer.0 (quotel "=:iprogn")))
          (set_prop input_buffer
             0
             (quote "=:progn")))
      
      (when opts.verbose (console.log "input_buffer: " input_buffer))
      ;; now compile the json
      
      (= compiled (compiler input_buffer (+ { env: Environment `formatted_output: true `include_source: include_source `source_name: (or opts.input_filename "anonymous") } opts)))
      (= compile_time (+ (-> (/ (- (time_in_millis) start_time) 1000) `toFixed 3) "s"))
      (cond
         compiled.error
         (throw (new compiled.error compiled.message))
         (and compiled.0.ctype
            (== compiled.0.ctype "FAIL"))
         (progn
            (= write_file false)
            (warn compiled.1))
         (and compiled.0.ctype
            (or (contains? "block" compiled.0.ctype)
                (== compiled.0.ctype "assignment")
                (== compiled.0.ctype "__!NOT_FOUND!__")))
         (if (compiled.0.has_lisp_globals)
             (do
                (push segments
                   (+ "export async function " export_function_name "(Environment)  {"))
                (push segments compiled.1)
                (push segments "}"))
             (do
                (push segments
                   (+ "export async function " export_function_name "() {"))
                (push segments compiled.1)
                (push segments "}")))
         
         (and compiled.0.ctype
            (or (== "AsyncFunction" compiled.0.ctype)
                (== "statement" compiled.0.ctype)
                (== "objliteral" compiled.0.ctype)))
         (do
            (if (compiled.0.has_lisp_globals)
                (do
                   (push segments
                      (+ "export async function " export_function_name "(Environment) {"))
                   (push segments
                      (+ "  return " compiled.1 "} ")))
                (do
                   (push segments
                      (+ "export async function " export_function_name "() {"))
                   (push segments
                      (+ "  return " compiled.1 "} ")))))
         (and compiled.0.ctype
            (== "Function" compiled.0.ctype))
         (do
            (if (compiled.0.has_lisp_globals)
                (do
                   (push segments
                      (+ "export function " export_function_name "(Environment) {"))
                   (push segments
                      (+ "  return " compiled.1 "}")))
                (do
                   (push segments
                      (+ "export function " export_function_name "() {"))
                   (push segments (+ "  return " compiled.1 " } ")))))
         else
         (progn
            (console.log "warning: unhandled return: " compiled)
            (= write_file false)))
      
      (when opts.bundle
         (push segments
            (+ "await init_dlisp();"))
         (push segments
            (+ "let env = await dlisp_env(" (if opts.bundle_options (JSON.stringify opts.bundle_options) "")  ");")))
      (when (is_array? opts.exports)
         (push export_segment "export { ")
         (map (fn (exp,i,len)
                 (progn
                    (cond
                       (and (is_array? exp)
                            (== exp.length 2))
                       (do
                          (push export_segment exp.0)
                          (push export_segment " as ")
                          (push export_segment exp.1))
                       (is_string? exp)
                       (push export_segment exp)
                       else
                       (throw SyntaxError (+ "Invalid export format: " exp)))
                    (when (< i (- len 1))
                       (push export_segment ","))))
              opts.exports)
         (push segments (join "" export_segment)))
      
      
      (cond
         (and write_file
            (not opts.want_buffer))
         (progn
            (write_text_file output_filename (join "\n" segments))
            (success (+ "[" compile_time "] compiled: ") (or opts.input_filename opts.namespace "anonymous") "->"  output_filename)
            output_filename)
         ;; if write_file is true - this is a proxy for a successful compilation but we just want the buffer
         (and write_file
            opts.want_buffer)
         (join "\n" segments)
         else
         (progn
            (warn "cannot compile: " (or opts.input_filename opts.namespace "anonymous"))
            nil)))
   {
     `description: (+ "Given an input lisp file, and an optional initalizer function name and options "
                      "object, compile the lisp file into a javascript file. The options object will "
                      "allow the specification of an output path and filename, given by the key "
                      "output_file.  If the initializer function isn't specified it is named "
                      "initializer, which when used with load, will be automatically called "
                      "one the file is loaded.  Otherwise the initializer function should be "
                      "called when after dynamically importing, using dynamic_import. If the "
                      "options object is to be used, with a default initializer, nil should be "
                      "used as a placeholder for the initializer_function name.<br><br>"
                      
                      "Options are as follows:<br><br>"
                      "js_headers: array: If provided, this is an array of strings that represent"
                      "lines to be inserted at the top of the file."
                      "include_source: boolean: If provided will append the block forms and "
                      "expressions within the text as comments."
                      "output_file: string: If provided the path and filename of the compiled "
                      "javascript file to be produced."
                      "include_boilerplate: boolean: If set to false explicity, the boilerplate"
                      "code will be not be included in the build."
                      "<br><br>"
                      "NOTE: this function's API is unstable and subject to change due to "
                      "the early phase of this language.")
     `usage: ["input_file:string" "initializer_function:string?" "options:object?"]
     `tags: ["compile" "environment" "building" "javascript" "lisp" "file" "export" ]
     })

(defun compile_file (lisp_file export_function_name options)
   (let
      ((input_components (path.parse lisp_file))
       (input_filename (path.basename lisp_file))
       (input_buffer nil))
      (= input_buffer (read_text_file lisp_file ))
      
      ;; convert to JSON for the compiler if lisp
      (if (== input_components.ext ".lisp")
          (= input_buffer (read_lisp input_buffer { `implicit_progn: false  `source_name: input_filename }  )))
      
      (compile_buffer input_buffer export_function_name (+ {} { `input_filename: input_filename `source_name: input_filename} (if options options {})))))



;; Rebuilds the environment as a series of JS files
;; from the source 

(defun rebuild_env (opts)
   (let
      ((issues [])
       (source_dir (or opts.source_dir
                       "./src"))
       (output_dir (or opts.output_dir
                       "./js"))
       (dcomps (date_components (new Date)))
       (version_tag (if (not (blank? opts.version_tag))
                        opts.version_tag
                        (join "." [ dcomps.year dcomps.month dcomps.day dcomps.hour dcomps.minute ])))
       (build_time (formatted_date (new Date)))
       (build_headers [])
       (include_source (or opts.include_source false))
       (source_path (fn (filename)
                       (join path.sep [ source_dir filename ])))
       (output_path (fn (filename)
                       (join path.sep [ output_dir filename ]))))
      
      (console.log "Environment Build Time: " build_time  "In Namespace: " *namespace*)
      (console.log "Version Tag: " version_tag)
      (console.log "Source Directory: " source_dir)
      (console.log "Output Directory: " output_dir)
      
      (push build_headers
         (+ "// Build Time: " build_time))
      (push build_headers
         (+ "// Version: " version_tag))
      
      (push build_headers
         (+ "export const DLISP_ENV_VERSION='" version_tag "';"))
      
      ;; reload the reader as this is compiled directly into the environment itself
      
      (defglobal reader (load (source_path "reader.lisp")))
      (success "reloaded reader")
      
      ;; compile the various core sources
      
      (compile_file (source_path "compiler.lisp") "init_compiler"
                    { `output_file: (output_path "compiler.js")
                                   `include_source: include_source
                                   `build_headers: build_headers })
      
      
      (compile_file (source_path "reader.lisp") nil
                    { `output_file: (output_path "reader.js")
                                   `include_source: include_source
                                   `build_headers: build_headers })
      
      (compile_file (source_path "repl.lisp") nil
                    { `output_file: (output_path "repl.js")
                                   `include_source: include_source
                                   `build_headers: build_headers })
      
      (compile_file (source_path "environment.lisp") "init_dlisp"
                    { `output_file: (output_path "environment.js")
                                   `include_source: include_source
                                   `toplevel: true
                                   `build_headers: build_headers })
      (compile_file (source_path "core.lisp") "environment_boot"
                    { `output_file: (output_path "core.js")
                                   `include_source: include_source
                                   `build_headers: build_headers })
      (compile_file (source_path "core-ext.lisp") "load_core"
                    { `output_file: (output_path "core-ext.js")
                                   `include_source: include_source
                                   `build_headers: build_headers })
      (compile_file (source_path "base-io.lisp") nil
                    { `output_file: (output_path "base-io.js")
                                   `include_source: include_source
                                   `build_headers: build_headers })
      (success "complete")
      true)
   {
     `description: (+ "Builds the lisp environment from the Lisp sources and produces the Javascript output files "
                      "necessary for initializing the environment. Options: <br>"
                      "source_dir:string:The directory of the Lisp sources, the default is './src'.<br>"
                      "output_dir:string:The directory to where the output Javascript files are placed.  The default is './js'.<br>"
                      "include_source:boolean:If true, the compiler will include comments of the lisp source (not fully supported yet).<br>"
                      "version_tag:string:A string based label signifying the text to use as the version.  If not specified, the version "
                      "tag uses the format year.month.day.hour.minute.<br>")
     `usage: [ "options:object?" ]
     `tags: [ "compile" "export" "build" "environment" "javascript" ]
     })


(register_feature "build-tools")


;; return true as the last value so the console output isn't overwhelmed.
true

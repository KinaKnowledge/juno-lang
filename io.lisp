
(if (not (is_symbol? Deno))
    (throw "IO requires Deno"))

(defglobal read_text_file
    (bind Deno.readTextFile Deno)
    {
    `description: (+ "Given an accessible filename including " 
		     "path with read permissions returns the file contents as a string.")
    `usage:["filename:string" "options:object" ]
    `tags:["file" "read" "text" "input" "io"]
    })

(defglobal path (dynamic_import "https://deno.land/std@0.110.0/path/mod.ts"))




(defun load (filename)       
  (let
       ((fname filename)
	(js_mod nil)
	(comps (path.parse fname)))
    
     (cond
       (== comps.ext ".lisp")
       (evaluate (read_text_file fname))
       (== comps.ext ".js")
       (progn
	 (= js_mod (dynamic_import fname))
	 (if js_mod.initializer
	     (js_mod.initializer Environment)
	     (throw EvalError "load: unable to find function named initializer in export, use dynamic_import for this.")))
       (== comps.ext ".json")
       (evaluate (JSON.parse (read_text_file fname)) { `json_in: true })))
  { `description: (+ "Compile and load the contents of the specified lisp filename (including path) into the Lisp environment. "
		     "The file contents are expected to be Lisp source code in text format.")
  `tags: [`compile `read `io `file ]
  `usage: ["filename:string"] 
  })


(defglobal write_text_file
    (bind Deno.writeTextFile Deno)
    {
    `description: (+ "Given a string path to a filename, an argument containing "
		     "the string of text to be written, and an optional options argument "
		     "write the file to the filesystem.<br><br>."
		     "The WriteFileOptions corresponds to the Deno WriteFileOptions interface")
    `usage:["filepath:string" "textdata:string" "options:WriteFileOptions"]
    `tags:[ `file `write `io `text `string ]
    })

(defmacro with_fs_events ((event_binding location) body)
  `(let
       ((watcher (-> Deno `watchFs ,#location)))
     (declare (object watcher))
     (for_with (,#event_binding watcher)
	 (progn
	       ,#body)))
  {
  `description: (+ "This function sets up a watcher scope for events on a filesystem. "
		   "The symbol passed to the event_binding is bound to new events that occur "
		   "at the provided location.  Once an event occurs, the body forms are executed.")
  `usage: ["event_binding:symbol" "location:string" "body:array"]
  `tags: ["file" "filesystem" "events" "io" "watch"]
  })

(defun compile_file (lisp_file export_function_name options)
  (let
      ((input_components (path.parse lisp_file))
       (input_filename (path.basename lisp_file))
       (output_filename (or options.output_file
			    (+ (if (== input_components.dir "")
				   "."
				   input_components.dir)
			       path.sep
			       input_components.name
			       ".js")))
       (opts (or options {}))
       (export_function_name (or export_function_name "initializer"))
       (segments [])
       (write_file true)
       (compiled nil) ; holds the compilation output
       (input_buffer nil)
       (invalid_js_ref_chars "+?-%&^#!*[]~{}|")
       (invalid_js_ref_chars_regex (new RegExp "[\\%\\+\\[\\>\\?\\<\\\\}\\{&\\#\\^\\=\\~\\*\\!\\)\\(\\-]+"))
       (boilerplate "var { get_next_environment_id, check_true, get_outside_global, subtype, lisp_writer, clone } = await import(\"./lisp_writer.js\");")
       (compiled_js nil))

    ;; check the export name for being valid...

    (when (> (length (scan_str invalid_js_ref_chars_regex export_function_name)) 0)
      (throw SyntaxError (+ "export function name contains an invalid JS character: " export_function_name ", cannot contain: " invalid_js_ref_chars)))

    ;; add any build headers first 

    (push segments
	  (+ "// Source: " input_filename "  "))
   
    (when (is_array? opts.build_headers)
      (for_each (`header opts.build_headers)
		(push segments header))
      (push segments "\n"))
    (push segments "\n")
    ;; add the boilerplate dependencies.. 
    (push segments boilerplate)

    ;; add any user included  dependencies    
    (when (is_array? opts.js_headers)
      (for_each (`header opts.js_headers)
		(push segments header))
      (push segments "\n"))

    
    (when (or (== input_components.name "environment")
	      (== export_function_name "init_dlisp")
	      opts.toplevel)
      (push segments "if (typeof AsyncFunction === \"undefined\") {\n  globalThis.AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;\n}"))

    (= input_buffer (read_text_file lisp_file))
    
    
    ;; convert to JSON for the compiler if lisp
    
    (if (== input_components.ext ".lisp")
	(= input_buffer (read_lisp input_buffer { `implicit_progn: false } )))

    
    (if (and (is_array? input_buffer)
	     (== input_buffer.0 (quotel "=:iprogn")))
	(set_prop input_buffer
		  0
		  (quote "=:progn")))
    ;(console.log "compiling: " input_buffer)
    
    
    ;; now compile the json

    (= compiled (compiler input_buffer (+ { env: Environment `formatted_output: true } opts)))
   
    (cond
      compiled.error
      (throw (new compiled.error compiled.message))
      (and compiled.0.ctype
	   (== compiled.0.ctype "FAIL"))
      (progn
	(= write_file false)
	(console.log compiled.1))
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

    (if write_file
	(progn
	  (write_text_file output_filename (join "\n" segments))
	  (console.log "compiled input file " lisp_file "->"  output_filename)
	  output_filename)
	(progn
	  (console.log "input file " lisp_file " not compiled.")
	  nil))))


(defun rebuild_env (opts)
  (let
      ((issues [])
       (source_dir (or opts.source_dir
		       "."))
       (output_dir (or opts.output_dir
		      "."))
       (dcomps (date_components (new Date)))
       (version_tag (if (not (blank? opts.version_tag))
			opts.version_tag
			(join "." [ dcomps.year dcomps.month dcomps.day dcomps.hour dcomps.minute ])))
       (build_time (formatted_date (new Date)))
       (build_headers [])
       (source_path (fn (filename)
			    (join path.sep [ source_dir filename ])))
       (output_path (fn (filename)
			(join path.sep [ output_dir filename ]))))

    (console.log "Environment Build Time: " build_time)
    (console.log "Version Tag: " version_tag)
    (console.log "Source Directory: " source_dir)
    (console.log "Output Directory: " output_dir)

    (push build_headers
	  (+ "// Build Time: " build_time))
    (push build_headers
	  (+ "// Version: " version_tag))
    
    (push build_headers
	  (+ "export const DLISP_ENV_VERSION='" version_tag "';"))
    
    
    (load (source_path "reader.lisp"))
    (compile_file (source_path "compiler.lisp") "init_compiler" { `output_file: (output_path "compiler.js")  `build_headers: build_headers })
    (compile_file (source_path "environment.lisp") "init_dlisp" { `output_file: (output_path "environment.js") `build_headers: build_headers })
    (compile_file (source_path "compiler-boot-library.lisp") "environment_boot" { `output_file: (output_path "environment_boot.js") `build_headers: build_headers })
    (compile_file (source_path "core.lisp") "load_core" { `output_file: (output_path "core.js") `build_headers: build_headers })
    (compile_file (source_path "io.lisp") nil { `output_file: (output_path "io.js") `build_headers: build_headers })
    (console.log "complete")
    true
    ))




;; return true as the last value so the console output isn't overwhelmed.
true


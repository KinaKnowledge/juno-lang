;; JUNO Simple Read Eval Print Loop (REPL)
;; Establishes a REPL mechanism that can be bound to an input and output stream

(defun repl (instream outstream opts)
   (let
      ((buffer nil)
       (lines [])
       (bytes_read 1)
       (read_buf (new Uint8Array 1024))
       (raw_mode (either opts.raw
                         (resolve_path [ `repl `raw_mode ] *env_config*)
                         false))
       (use_console (or opts.use_console false))
       (clean_input true)
       (instream (or instream Deno.stdin))
       (outstream (or outstream Deno.stdout))
       (td (new TextDecoder))
       (te (new TextEncoder))
       (prompt_text (cond
                       (is_function? opts.prompt)
                       opts.prompt
                       (is_string? opts.prompt)
                       (function () opts.prompt)
                       else
                       (function () (+ "[" (current_namespace) "] λ-> "))))
       (prompt (fn ()
                  (-> te `encode (prompt_text))))
       (last_exception nil)
       (subprompt_text (cond
                          (is_function? opts.subprompt)
                          opts.subprompt
                          (is_string? opts.prompt)
                          (function () opts.prompt)
                          else
                          (fn ()
                             (+ "     "
                                (join "" (map (fn (v) " " )  (range (+ 2 (length (current_namespace))))))
                                (join "" (map (fn (v) " ") (range_inc (or last_exception.depth 1))))))))
       (subprompt (fn ()
                     (-> te `encode (subprompt_text))))
       
       (sigint_message (-> te `encode (either opts.sigint_message "\nsigint: input canceled. type ctrl-d to exit.\n")))
       (write (function (stream output)
			(-> stream `writeSync output)))
       (l nil)
       (chunk (new Uint8Array 1024))
       (sigint_handler (function ()
                          (progn
                             (write outstream sigint_message)
                             (= lines [])
                             (write outstream prompt))))
       (output_processor (cond
                            (and opts
                               opts.output_processor
                               (is_function? opts.output_processor))
                            opts.output_processor
                            (resolve_path [ `repl `output_processor ] *env_config*)
                            (resolve_path [ `repl `output_processor ] *env_config*)
                            else
                            (fn (value)
                               (JSON.stringify value nil 2))))
       (return_stack []))
      
      (declare (function write)
               (include not))
      (defglobal *repl_run* true)
      (defglobal $ nil)
      (defglobal $$ nil)
      (defglobal $$$ nil)
      (if (== outstream Deno.stdout)
          (console.log "\nJuno" Environment.build_version " (c) 2023-2025 Kina, LLC"))
      (try
         (Deno.addSignalListener `SIGINT sigint_handler)
         (catch Error (e)
            (warn "Unable to install sigint handler.")))
      (if (not raw_mode)
          (write outstream (prompt)))
      (try
         (while (> bytes_read 0)
            (progn
               (= bytes_read (-> Deno.stdin `read chunk))
               ;; we need to truncate the line read to the actual byte count
               (= l (-> (-> td `decode chunk) `substring 0 bytes_read))              
               (try
                  (progn
                     (= clean_input true)
                     (try
                        (reader (join "\n" (add lines l)) { `verbose: false } ) ;; this will throw an exception if we cannot read all lines correctly
                        (catch LispSyntaxError (e)
                           (progn
                              (when opts.simple
                                 (throw e))
                              (= clean_input false)
                              (= last_exception (JSON.parse e.message))
                              (defglobal *last_exception* last_exception)
                              (cond
                                 (not (== last_exception.type "premature end"))
                                 (progn
                                    (warn (+ last_exception.message ", position: " last_exception.position "\n    -->" last_exception.local_text "<--"))
                                    (= lines [])
                                    (when (not raw_mode)
                                       (write outstream (prompt))))
                                 else
                                 (progn
                                    (push lines l)
                                    (when (not raw_mode)
                                       (write outstream
                                              (subprompt))))))))
                     (when clean_input
                        (= buffer (join "\n" (add lines l))) ;; ..otherwise build the buffer and present to be evaluated
                        
                        (prepend return_stack
                           (-> Environment `evaluate buffer))
                        ;(console.log (JSON.stringify (first return_stack) nil 4))
                        (if use_console
                           (console.log (first return_stack))
                           (progn
                              (write outstream (-> te `encode (output_processor (first return_stack))))
                              (write outstream (-> te `encode "\n"))))
                        
                        (when (not raw_mode)
                           (write outstream (prompt)))
                        (= lines [])
                        (when (> return_stack.length 3)
                           (pop return_stack))
                        
                        (when (or (== (first return_stack) Environment)
                                  (== (first return_stack) Environment.global_ctx)
                                  (== (first return_stack) (prop Environment.global_ctx *namespace*))
                                  (== (first return_stack) (prop (prop Environment.global_ctx *namespace*) `scope)))
                           (set_prop return_stack 0 nil))
                        
                        (= $ (first return_stack))
                        (= $$ (second return_stack))
                        (= $$$ return_stack.2)))
                  (catch Error (e)
                     (progn
                        (if (resolve_path [ `repl `backtrace ] *env_config*)
                            (console.error "[ERROR] " e)
                            (if e.details
                               (console.error "[ERROR]: " e.details)
                               (console.error "[ERROR]: " e.message)))
                        (when (not raw_mode)
                           (write outstream (prompt))))))))
         (catch Error (e)
            (console.error "REPL: " e)))
      true)
   {
     `description: (+ "Implements a Read-Eval-Print for Juno.  This function takes "
                      "an input stream, an output stream, and an optional options object "
                      "and starts up a continuously running loop that waits for input "
                      "and, once a fully closed expression is received, evaluates it "
                      "and returns the result on the output stream.  The options object "
                      "will affect the behavior of the REPL: <br><br>"
                      "raw:boolean:false:If raw mode is true, no prompt will be emitted "
                      "into the output stream.<br>"
                      "prompt:function|string:the prompt to display when the REPL is ready "
                      "for input.  If no values are given the default prompt is displayed "
                      "which contains the current namespace and an arrow to indicate "
                      "ready for input.<br>"
                      "subprompt:function|string::When a form isn't complete, and the user "
                      "has pressed return, the subprompt is displayed until the form is closed.<br>"
                      "sigint_message:string:If the SIGINT signal is received, the prompt for the "
                      "REPL to display.<br>"
                      "output_processor:function::The function to call when the REPL has received output "
                      "from the evaluation process.  This function can be used to encode or otherwise "
                      "package the return value for consumption by the output stream.<br>"
                      "use_console:boolean:false:If true, the output is sent to the console, as opposed "
                      "to the direct output stream. <br>")
     `usage: ["input:stream" "output:stream" "options:object"]
     `tags: [ `repl `eval `read `output ]
     })

(when (not (prop *env_config* `repl))
   (set_prop *env_config* `repl {}))

(defun set_repl (key value)
   (set_path [ `repl key ] *env_config* value)
   {
     `description: "Given a configuration key and a value, sets the provided REPL config key to the value."
     `usage: ["key:string" "value:*"]
     `tags: ["repl" "config" ]
     })

(defun repl_config ()
   (+ {
        backtrace: false
        raw_mode: false
        output_processor: false
        }
        (or (resolve_path [ `repl ] *env_config*) {}))
   {
     `description: (+ "Returns the environment configuration options that are "
                      "available for the repl and their current settings.")
     `tags: [ `repl `config ]
     `usage: []
     })

(register_feature `repl)





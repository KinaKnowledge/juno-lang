(defun repl (instream outstream opts)
  (let
      ((buffer nil)
       (lines [])
       (generator readline)
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
                                  (+ "     " (join "" (map (fn (v) " " )  (range (+ 2 (length (current_namespace)))))) (join "" (map (fn (v) " ") (range_inc (or last_exception.depth 1))))))))
       (subprompt (fn ()
                    (-> te `encode (subprompt_text))))
                        
       (sigint_message (-> te `encode (either opts.sigint_message "\nsigint: input canceled. type ctrl-d to exit.\n")))
       (write writeAllSync)
       
       (sigint_handler (function ()
			         (progn
			          (write outstream sigint_message)
                                  (= lines [])
			          (write outstream prompt))))
       (return_stack []))
    (declare (function write))        
    (defglobal $ nil)
    (defglobal $$ nil)
    (defglobal $$$ nil)
    (if (== outstream Deno.stdout)
	(console.log "\nJuno" Environment.version " (c) 2022, Kina, LLC"))
    (try
      (Deno.addSignalListener `SIGINT sigint_handler)
      (catch Error (e)
	(warn "Unable to install sigint handler.")))
    (write outstream (prompt))
    (try      
      (for_with (`l (generator instream))
	        (progn		
		 (= l (-> td `decode l))			
		 (try
		   (progn
		    (reader (join "\n" (add lines l)) { `verbose: false } ) ;; this will throw an exception if we cannot read all lines correctly
		    (= buffer (join "\n" (add lines l))) ;; ..otherwise build the buffer and present to be evaluated
		    
		    (prepend return_stack
			     (-> Environment `evaluate buffer))
		    (console.log (first return_stack))
		    (write outstream  (prompt))
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
		    (= $$$ return_stack.2))
		   (catch LispSyntaxError (e)
		     (progn                      
                      (= last_exception (JSON.parse e.message))
                      (defglobal *last_exception* last_exception)
		      (cond
                        (not (== last_exception.type "premature end"))
                        (progn
                         (warn (+ last_exception.message ", position: " last_exception.position "\n    -->" last_exception.local_text "<--"))
                         (= lines [])
                         (write outstream (prompt)))
                        else
                        (progn                         
			 (push lines l)                         
			 (writeAllSync outstream
                                       (subprompt))
                         ))))
		   (catch Error (e)
		     (console.error "ERROR: " e)))
	         
		 ))
      (catch Error (e)
	(console.error "REPL: " e)))))





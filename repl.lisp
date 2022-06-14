(defun repl (instream outstream opts)
  (let
      ((buffer nil)
       (lines [])
       (generator readline)
       (instream (or instream Deno.stdin))
       (outstream (or outstream Deno.stdout))
       (td (new TextDecoder))
       (te (new TextEncoder))
       (prompt_text (either opts.prompt "λ-> "))
       (prompt nil)
       (subprompt_text (either opts.subprompt "     "))
       (sigint_message (-> te `encode (either opts.sigint_message "\nsigint: type Ctrl-D to exit.\n")))
       (write writeAllSync)
       
       (sigint_handler (function ()
			   (progn
			     (write outstream sigint_message)
			     (write outstream prompt))))
       (return_stack []))
    (declare (function write))
    (= prompt (-> te `encode prompt_text))
    (defglobal $ nil)
    (defglobal $$ nil)
    (defglobal $$$ nil)
    (try
     (Deno.addSignalListener `SIGINT sigint_handler)
     (catch Error (e)
	    (warn "Unable to install sigint handler.")))
    (write outstream prompt)
    (try

    (for_with (`l (generator instream))
	      (progn		
		(= l (-> td `decode l))			
		(try
		 (progn
		   (reader (join "\n" (add lines l))) ;; this will throw an exception if we cannot read all lines correctly
		   (= buffer (join "\n" (add lines l))) ;; ..otherwise build the buffer and present to be evaluated
		   
		   (prepend return_stack
			 (-> Environment `evaluate buffer))
		   (console.log (first return_stack))
		   (write outstream  prompt)
		   (= lines [])
		   (when (> return_stack.length 3)
		     (pop return_stack))
		   
		   (when (or (== (first return_stack) Environment)
			   (== (first return_stack) Environment.global_ctx)
			   (== (first return_stack) Environment.global_ctx.scope))
		       (set_prop return_stack 0 nil))
		       
		   (= $ (first return_stack))
		   (= $$ (second return_stack))
		   (= $$$ return_stack.2))
		  (catch SyntaxError (e)
			 (progn
			   (push lines l)
			   ;(console.log "++: " lines)
			   (writeAllSync outstream (-> te `encode "     "))
			   ))
		  (catch Error (e)
			 (console.error "ERROR: " e)))
	
		))
    (catch Error (e)
	   (console.error "REPL: " e)))))
		 
		   
		  
		  

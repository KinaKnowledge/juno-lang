(defun repl ()
  (let
      ((buffer nil)
       (lines [])
       (generator readline)
       (stdin Deno.stdin)
       (stdout Deno.stdout)
       (write writeAllSync)       
       (return_stack []))
    (defglobal $ nil)
    (defglobal $$ nil)
    (defglobal $$$ nil)
    (write stdout (-> te `encode "-> "))
    (try
    (for_with (`l (generator stdin))
	      (progn		
		(= l (-> td `decode l))			
		(try
		 (progn
		   (reader (join "\n" (add lines l))) ;; this will throw an exception if we cannot read all lines correctly
		   (= buffer (join "\n" (add lines l))) ;; ..otherwise build the buffer and present to be evaluated
		   
		   (push return_stack
			 (-> Environment `evaluate buffer))
		   (console.log (last return_stack))
		   (write stdout (-> te `encode "-> "))
		   (= lines [])
		   (when (> return_stack.length 3)
		     (take return_stack))
		   (= $ return_stack.2)
		   (= $$ return_stack.1)
		   (= $$$ return_stack.0))
		  (catch SyntaxError (e)
			 (progn
			   (push lines l)
			   ;(console.log "++: " lines)
			   (writeAllSync Deno.stdout (-> te `encode "**   "))
			   ))
		  (catch Error (e)
			 (console.error "ERROR: " e)))
	
		))
    (catch Error (e)
	   (console.error "REPL: " e)))))
		 
		   
		  
		  

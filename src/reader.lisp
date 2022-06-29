;; Compiler Reader
;; (c) 2022 Kina, LLC
;; -----------------------------
;; **
;; 
;; The reader function reads a string of lisp code and returns
;; a JSON structure representation.

;; text is the text to be read as input to the reader.  It can contain
;; one or more valid lisp forms or expressions.  If there are multiple
;; expressions at the top level, the entire series of expressions are
;; wrapped in an implicit progn (iprogn) structure in the returned
;; JSON form.

;; Options and Environmental Settings

;; If the global __VERBOSITY__ setting is set to 7 or above, the reader
;; will log to the console a character by character representation of
;; the internal read state.

;; Options is an object passed as an optional secod argument with the following
;; allowed keys

;; source_name - a string that represents the source location (file path, uri)
;;               of the text buffer being passed.  Otherwise the text
;;               buffer is considered anonymous.  This provided value is included
;;               in any errors thrown during the process of reading
;;               the file.



(defglobal `reader
  (fn (text opts)
    (cond
      (eq undefined text)
      (throw EvalError (+ "reader: received undefined, text must be a string."))
      (not (is_string?  text))
      (throw EvalError (+ "reader: received " (sub_type text) ": text must be a string."))
      else	  
      (let
	  ((`output_structure [])
	   (`idx -1)
	   (`line_number 1)
	   (`column_number 0)
           (`source_name (if opts.source_name
                           opts.source_name
                           "anonymous"))
	   (`opts (or opts {}))
	   (`len (- (length text) 1))
	   (`debugmode (cond
                         opts.verbose
                         true
                         (== opts.verbose false)
                         false                         
                         (> __VERBOSITY__ 6)
			 true
                         else
			 false))
	   (`in_buffer (split_by "" text))
	   (`in_code 0)
	   (`in_quotes 1)
	   (`in_long_text 2)
	   (`in_comment 3)
           (`in_single_quote 4)
           (`reading_object false)
           (`mode in_code)  ;; start out in code
           
	   (`local_text (fn ()
			  (let
			      ((`start (Math.max 0 (- idx 10)))
			       (`end   (Math.min (length in_buffer) (+ idx 10))))
                            (join "" (slice in_buffer start end)))))
	   (`position (fn (offset)
			(+ "line: " line_number " column: " (if offset
                                                              (+ column_number offset)
                                                              column_number))))
	   
	   
	  
	   (`read_table (+ {}
			   (if opts.read_table_entries
			       opts.read_table_entries
			       {})
			   {                             
                         "(":[")" (fn (block)
				    (do 
				      block))]                         
			 "[":["]" (fn (block)
				    (do 
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
                                      (= reading_object false)
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
						   (starts_with? "=:" key)
						   (> (length key) 2))
					    (= key (-> key `substr 2)))
					  (cond
					    (blank? key)
                                            (error "missing object key"
                                                   (+ "blank or nil key: " (prop block idx)))					    
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
                                              (= value (process_word (split_by "" value) 0))
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
                                                    (error "missing colon"
                                                           (+ "expected colon for: " key)))))
					      (set_prop obj
							key
							(prop block idx))))))
				      obj))
                              (fn ()
                                (do                                  
                                  (= reading_object true)))]
			 
			 "\"":["\"" (fn (block)
				      (do 
					;(log "got quote block:" block)
					["quotes" block]))]
			 
			 }))
	   (`get_char (fn (pos)
			(prop in_buffer pos)))
           (`error (fn (type message offset)                    
                     (throw LispSyntaxError {
                                                         `message: message
                                                         `position: (position offset)
                                                         `pos: { `line: line_number `column: (+ column_number (or offset 0)) }
                                                         `depth: depth
                                                         `local_text: (local_text)
                                                         `source_name: source_name
                                                         `type: type
                                                         })))
	   (`handle_escape_char (fn (c)
				  (let
				      ((`ccode (-> c `charCodeAt 0)))
				    (cond
				      (== ccode 34)   ;; backslash
				      c
				      (== ccode 92)
				      c
				      (== c "t")
				      (String.fromCharCode 9)
				      (== c "n")
				      (String.fromCharCode 10) ;"\n" ; 10; (String.fromCharCode 10)
				      (== c "r")
				      (String.fromCharCode 13)
				      (== c "f")
				      c; (string.fromCharCode 12) ;; formfeed
				      (== c "b")
				      c ;(string.fromCharCode 8) ;; backspace
				      else  ;; just return the character
				      c))))
	   
	   (`process_word (fn (word_acc backtick_mode)
			    (let
				((`word (join "" word_acc))
				 (`word_as_number (Number word))) ;(parseFloat word)))
                              (when debugmode
				(log "process_word: " word word_as_number backtick_mode))
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
                                    (and (== backtick_mode 0)
                                         (ends_with? ")" word))
                                    (error "trailing character"
                                           "unexpected trailing parenthesis" )
                                    (and (== backtick_mode 0)
                                         (ends_with? "]" word))
                                    (error "trailing character"
                                           "unexpected trailing bracket")
				    (contains? word [(quotel "=:(") (quotel "=:)") (quotel "=:'")])
				    (do
				      word)
				    (== backtick_mode 1)
				    word
				    else 
				    (+ (quotel "=:") word))) ;; since not in quotes, return a reference 
				(is_number? word_as_number)
				word_as_number
				else
				(do 
				  (log "reader: " (position) " what is this?" word word_acc (local_text))
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
			    (= depth _depth)
			    (while (and (not stop)
					(< idx len))
			      (do 
				(inc idx)
				
				(= escape_mode (Math.max 0 (- escape_mode 1)))
				(= c (get_char idx))
				(= next_c (get_char (+ idx 1)))
				(when (== c "\n")
                                  (inc line_number)
                                  (= column_number 0))
				
				(when debugmode
				  (console.log _depth "C->" c next_c mode escape_mode (clone acc) (clone word_acc) handler_stack.length))
				
				;; read until the end or are stopped via debugger
				;; we have a few special cases that facilitate the transformation
				;; into a JSON structure as well as comments
				
				;; consult the read table and accumulate chunks into blocks
				;; once done with the block pass to the read table handler if it exists.
				
				(cond 				  
				  (and (== next_c undefined)
                                       (not (== (prop (last handler_stack) 0) undefined))				       
				       (or (not (== c (prop (last handler_stack) 0)))
					   (> handler_stack.length 1)))
                                  (error "premature end"
                                         (+ "premature end: expected: " (prop (last handler_stack) 0)))				  
				  (and (== next_c undefined)
				       (== mode in_quotes)
				       (not (== (-> c `charCodeAt) 34)))
				  (error "premature end"
                                         "premature end: expected: \"")
				  (and (== next_c undefined)
				       (== mode in_long_text)
				       (not (== c "|")))
				  (error "premature end"
                                         "premature end: expected: |")
                                  (and (== mode in_code)
                                       (== _depth 1)
                                       (== next_c ")")
                                       (== c ")"))
                                           
                                  (do
                                    (error "trailing character"
                                           "unexpected trailing parenthesis")))
                                      
				(cond 
				  (and (== c "\n")
				       (== mode in_comment))
				  (do 
				    (= mode in_code)
				    (break))
				  
				  
				  ;; when in in_long_text mode, duplicate the \ because the extra backslash will be 
				  ;; removed in the process of compilation as it goes through the unquoting process.
				  
				  (and (== 92 (-> c `charCodeAt 0))
				       (== mode in_long_text))
				  (do 
				    (push word_acc c)
				    (push word_acc c))
				  
				  ;; DISABLED: condition where we have an escaped backslash - we need to store it
				  (and  
				   (> mode 0)
				   (== escape_mode 1)
				   (== 92 (-> c `charCodeAt 0))) 
				  (do 
				    (push word_acc c))
				  
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
					;(push acc (join "" word_acc))
				    (= acc (+ (join "" word_acc)))
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
                                    (when (prop (prop read_table c) 2)
                                      (= handler (prop (prop read_table c) 2))
                                      (handler)
                                      (= handler nil))

                                    (push handler_stack 
					  (prop read_table c))
                                    
				    (if (> word_acc.length 0)
				      (do 
					(push acc (process_word word_acc backtick_mode))
					(= backtick_mode 0)
					(= word_acc [])))
				    
				    ;; now read the block until the block complete character is encountered...
				    (= block_return (read_block (+ _depth 1)))
				    
				    ;; handle the returned block that was read with the handler
				    (= handler (prop (pop handler_stack) 1))
				    
				    (= block_return 
				       (handler block_return))
                                    
				    ;; if the block is undefined, do not add it to the accumulator, otherwise add the block structure
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
				  
				  (and 
                                       (== mode in_code)
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
				(inc column_number)
				(= last_c c)))
			    (if (> word_acc.length 0)
			      (do 
					;(log "outside of loop: pushing into acc, backtick_mode:",backtick_mode, word_acc)
				(push acc (process_word word_acc backtick_mode))
				
                                        ;(push acc (join "" word_acc))
				(= word_acc [])))
			    
			    acc))))
	
	
	(when debugmode
	  (console.log "read->" in_buffer ))
	(= output_structure (read_block 0))
	(when debugmode
	  (console.log "read<-" (clone output_structure)))
	        
	(if (and (is_array? output_structure)
		 (> (length output_structure) 1))
	  (do 
	    (prepend output_structure
		     (quotel "=:iprogn"))
					;(console.log "read (multiple forms) <-" output_structure)
	    (first [output_structure]))
					;(when opts.debug (console.log "read<-" (first output_structure)))
	  (first output_structure))))))


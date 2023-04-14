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
;; symbol_receiver - function that if present will be called prior to returning
;;               the processed structure which will contain an object with 
;;               symbol information within it.
;; suppress_throw_on_error - by default the behaviour is to throw an exception 
;;                           when an error is encountered.  This suppresses it 
;;                           and if the on_error function is present, it will be
;;                           called..otherwise error is ignored
;; pause_time - Pause between multiple form reads for a certain amount of time
;;              to prevent non-responsiveness on slower machine.  This value
;;              is specified in seconds or fractions of seconds

(defglobal `reader
   (fn (text opts)
      (cond
         (eq undefined text)
         (throw EvalError (+ "reader: received undefined, text must be a string."))
         (not (is_string?  text))
         (throw EvalError (+ "reader: received " (sub_type text) ": text must be a string."))
         else
         (let
            ((output_structure [])
             (idx -1)
             (error_collector [])
             (symbol_collector {})
             (throw_on_error (not opts.suppress_throw_on_error))
             (line_number 0)
             (column_number 0)
             (source_name (if opts.source_name
                               opts.source_name
                               "anonymous"))
             (opts (or opts {}))
             (len (- (length text) 1))
             (debugmode (cond
                            opts.verbose
                            true
                            (== opts.verbose false)
                            false
                            (> __VERBOSITY__ 6)
                            true
                            else
                            false))
             (in_buffer (split_by "" text))
             (in_code 0)
             (in_quotes 1)
             (in_long_text 2)
             (in_comment 3)
             (in_single_quote 4)
             (reading_object false)
             (mode in_code)  ;; start out in code
             (symbol_start nil)
             (pause_time (if (is_number? opts.pause_time)
                             opts.pause_time
                             nil))
             (cpath [])
             (ctx {
                     scope:{ op_chain:[] 
                     }
                     parent: nil
                     })
             (last_final_column_num 0)
             (symbol_receiver (if (is_function? opts.symbol_receiver)
                                   opts.symbol_receiver))
             (add_symbol (fn (symbol _ctx)
                             ;; since called when a symbol is already read, we have... 
                             ;; to subtract the length of the symbol to get the start col
                             (when (not (ends_with? ":" symbol))
                                (let
                                   ((ccol (if (== column_number 0)
                                              (- last_final_column_num symbol.length) ;; use the previous column number since we just had a line feed
                                              (- column_number symbol.length)))
                                    (cline (if (== column_number 0)
                                               (- line_number 1)
                                               line_number))
                                    (real_sym (first (split_by "." symbol))))
                                   (if (eq nil (prop symbol_collector real_sym))
                                       (set_prop symbol_collector
                                          real_sym [[cline ccol (if _ctx (getf_ctx _ctx `op_chain) nil) (but_last cpath)]])
                                       (push (prop symbol_collector real_sym)
                                             [cline ccol (if _ctx (getf_ctx _ctx `op_chain) nil) (but_last cpath)]))))))
             (local_text (fn ()
                             (let
                                ((start (Math.max 0 (- idx 10)))
                                 (end   (Math.min (length in_buffer) (+ idx 10))))
                                (join "" (slice in_buffer start end)))))
             (position (fn (offset)
                           (+ "line: " line_number
                              " column: " (if offset
                                             (+ column_number offset)
                                             column_number))))
             (read_table
                (+ {}
                   (if opts.read_table_entries
                      opts.read_table_entries
                      {})
                   {
                     "(":[")" (fn (block _ctx)
                                 (do
                                    block))]
                     "[":["]" (fn (block _ctx)
                                 (do
                                    block))]
                     "{":["}" (fn (block _ctx)
                                 (let
                                    ((obj (new Object))
                                     (idx -1)
                                     (key_mode 0)
                                     (need_colon 1)
                                     (value_mode 2)
                                     (key nil)
                                     (value nil)
                                     (cpos nil)
                                     (state key_mode)
                                     (block_length (- (length block) 1)))
                                    (= reading_object false)
                                    ;(log "obj block: " block)
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
                                          ;(log "block value: " (prop block (+ idx 1)))
                                          
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
                                                (= value (process_word (split_by "" value) 0 _ctx ))
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
                                                           (inc idx) ;; it is, move past it
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
             (get_char (fn (pos)
                           (prop in_buffer pos)))
             (error (fn (type message offset)
                        (progn
                           ;(log "reader: throw_on_error: " throw_on_error message)
                           (if throw_on_error
                              (throw LispSyntaxError {
                                                       `message: message
                                                       `position: (position offset)
                                                       `pos: { `line: line_number `column: (+ column_number (or offset 0)) }
                                                       `depth: depth
                                                       `local_text: (local_text)
                                                       `source_name: source_name
                                                       `type: type
                                                       })
                              (when (is_function? opts.on_error)
                                 (opts.on_error
                                    {
                                      `message: message
                                      `position: (position offset)
                                      `pos: { `line: line_number `column: (+ column_number (or offset 0)) }
                                      `depth: depth
                                      `local_text: (local_text)
                                      `source_name: source_name
                                      `type: type
                                      }))))))
             (handle_escape_char (fn (c)
                                     (let
                                        ((ccode (-> c `charCodeAt 0)))
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
             
             (process_word (fn (word_acc backtick_mode _ctx)
                               (let
                                  ((word (join "" word_acc))
                                   (word_as_number (Number word))) ;(parseFloat word)))
                                  (when debugmode
                                     (console.log "process_word: " word word_as_number backtick_mode))
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
                                           (progn
                                              (error "trailing character"
                                                  "unexpected trailing parenthesis 2" )
                                              "")
                                           (and (== backtick_mode 0)
                                                (ends_with? "]" word))
                                           (progn
                                              (error "trailing character"
                                                     "unexpected trailing bracket 2")
                                              "")
                                           (contains? word [(quotel "=:(") (quotel "=:)") (quotel "=:'")])
                                           (do
                                              word)
                                           (== backtick_mode 1)
                                           word
                                           else
                                           (progn
                                              (when symbol_receiver (add_symbol word _ctx))
                                              (+ (quotel "=:") word)))) ;; since not in quotes, return a symbol
                                     (is_number? word_as_number)
                                     word_as_number
                                     else
                                     (do
                                        (log "reader: " (position) " what is this?" word word_acc (local_text))
                                        word)))))
             
             (registered_stop_char nil)
             (handler_stack [])
             (handler nil)
             (c nil)
             (next_c nil)
             (depth 0)
             (stop false)
             (read_block (fn (_depth _ctx)
                             (let
                                ((acc [])
                                 (word_acc [])
                                 (operator nil)
                                 (old_ctx nil)
                                 (backtick_mode 0)
                                 (escape_mode 0)
                                 (last_c nil)
                                 (_ctx _ctx)
                                 (block_return nil))
                                (= depth _depth)
                                (if pause_time
                                   (sleep pause_time))
                                (while (and (not stop)
                                            (< idx len))
                                   (do
                                      (inc idx)
                                      
                                      (= escape_mode (Math.max 0 (- escape_mode 1)))
                                      (= c (get_char idx))
                                      (= next_c (get_char (+ idx 1)))
                                      (when (== c "\n")
                                         (inc line_number)
                                         (= last_final_column_num column_number)
                                         (= column_number 0))
                                      
                                      (when debugmode
                                         (console.log _depth "  " c " " next_c " " mode "" escape_mode " " (as_lisp acc) (as_lisp word_acc) acc.length (join "." cpath)))
                                      
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
                                         
                                         (and (> mode 0)
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
                                                   (push acc (process_word word_acc nil _ctx))
                                                   (= word_acc [  ])))
                                            (= mode in_long_text)
                                            (= block_return (read_block (+ _depth 1) _ctx))
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
                                                   (push acc (process_word word_acc nil _ctx))
                                                   (= word_acc [  ])))
                                            (= mode in_quotes)
                                            (= block_return (read_block (+ _depth 1) _ctx))
                                            (when (== backtick_mode 1)
                                               (= backtick_mode 0))
                                            (push acc block_return))
                                         
                                         (and (== c "\'")
                                              (== escape_mode 0)
                                              (== mode in_code))
                                         (do
                                            (if (> word_acc.length 0)
                                                (do
                                                   (push acc (process_word word_acc nil _ctx))
                                                   (= word_acc [  ])))
                                            (= mode in_single_quote)
                                            (= block_return (read_block (+ _depth 1) _ctx))
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
                                                   (push acc (process_word word_acc nil _ctx))
                                                   (= word_acc [  ])))
                                            (= mode in_comment)
                                            (read_block (+ _depth 1) _ctx)) ;; read the block but just discard the contents since it is a comment.
                                         
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
                                                   (push acc (process_word word_acc backtick_mode _ctx))
                                                   (= backtick_mode 0)
                                                   (= word_acc [])))
                                            (= old_ctx _ctx)
                                            (= _ctx (new_ctx _ctx))
                                            (push cpath 0)
                                            ;; now read the block until the block complete character is encountered...
                                            (= block_return (read_block (+ _depth 1) _ctx))
                                            
                                            ;; handle the returned block that was read with the handler
                                            (= handler (prop (pop handler_stack) 1))
                                            
                                            (= block_return
                                               (handler block_return _ctx))
                                            (pop cpath)
                                            (= _ctx old_ctx)
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
                                                   (push acc (process_word word_acc nil _ctx))
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
                                            (push acc (process_word word_acc nil _ctx))
                                            (= word_acc []))
                                         
                                         (and (== mode in_code)
                                              (or (== c " ")
                                                  (== (-> c `charCodeAt 0) 10)
                                                  (== (-> c `charCodeAt 0) 9)
                                                  (and (== c ",")
                                                       (not (== next_c "@"))
                                                       (not (== next_c "#")))))
                                         
                                         (do
                                            (if (and (== acc.length 0)
                                                       (> word_acc.length 0))
                                                (progn
                                                   (set_prop _ctx.scope 
                                                      `op_chain
                                                      (conj (getf_ctx _ctx `op_chain) (join "" word_acc)))))
                                            (if (> word_acc.length 0)
                                                (do
                                                   (if (== backtick_mode 1)
                                                       (do
                                                          (push acc (process_word word_acc backtick_mode _ctx))
                                                          (= backtick_mode 0))
                                                       (push acc (process_word word_acc nil _ctx)))
                                                   (= word_acc [])))
                                            (pop cpath)  ;; update our path
                                            (push cpath (length acc))
                                            )
                                         
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
                                       (push acc (process_word word_acc backtick_mode _ctx))
                                       
                                       ;(push acc (join "" word_acc))
                                       (= word_acc [])))
                                
                                acc))))
            
            
            (when debugmode
               (console.log "read->" in_buffer )
               (console.log "D  CHAR NC " " M" "ESC" "ACC" "WORDACC" "ACCL"))
            
            (= output_structure (read_block 0 ctx))
            ;(log output_structure)
            (when debugmode
               (console.log "read<-" (clone output_structure)))
            (when opts.symbol_receiver
               (opts.symbol_receiver { `source_name: source_name
                                       `symbols: symbol_collector }))
            (if (and (is_array? output_structure)
                     (> (length output_structure) 1))
                (do
                   (prepend output_structure
                      (quotel "=:iprogn"))
                   ;(console.log "read (multiple forms) <-" output_structure)
                   (first [output_structure]))
                ;(when opts.debug (console.log "read<-" (first output_structure)))
                (first output_structure)))))
   {
     `description: (+ "<br><br>The reader function is responsible for reading text based input in Juno "
                      "notation form or serialized JSON and producing a JSON output structure that can "
                      "be read by the compiler.  <br>Text, provided as a string, is parsed by the "
                      "reader.  It can contain one or more valid lisp forms or expressions.  If there "
                      "are multiple expressions at the top level, the entire series of expressions "
                      "are wrapped in an implicit `progn` (`iprogn`) structure in the returned JSON "
                      "form.\n<br>Binding symbols are signified in the emitted JSON structure as "
                      "strings, indicated by a `=:` prefix.  Comments within the Juno notation are "
                      "removed and do not appear in the JSON output structure.<br><br>#### Options and "
                      "Environmental Settings    <br><br>If the global `__VERBOSITY__` setting is set "
                      "to 7 or above, the reader will log to the console a character by character "
                      "representation of the internal read state.  <br>The first argument to the "
                      "reader is expected to be a string, containing the text to be read and "
                      "processed.  The second argument is an optional object that contains parameters "
                      "for modifying the behavior of the reader.<br><br>#### Options "
                      "<br><br>source_name:string - a string that represents the source location (file "
                      "path, uri) of the text buffer being passed.  Otherwise the text buffer is "
                      "considered anonymous.  This provided value is included in any errors thrown "
                      "during the process of reading the file.<br>symbol_receiver:function -a "
                      "provided function that if present will be called with a single argument "
                      "containing an object with symbol locations within it.  The provided function "
                      "will be called prior to the reader returning the processed structure which will "
                      "contain an object with symbol information within it.   <br>The function will "
                      "receive a single argument with the following structure:```{ \n  source_name: "
                      "options.source_name\n  symbols: {\n    symbol_a:[[line_offset column_offset]\n    "
                      "         [line_offset column_offset]]\n    symbol_b:[[line_offset "
                      "column_offset]] \n}```<br><br>suppress_throw_on_error:boolean -If true, when an "
                      "error is encountered an exception will not be thrown, as is the default "
                      "behavior.  The reader will try to slog onward, however parsing may be impacted "
                      "depending on the error encountered.<br>on_error:function -If "
                      "suppress_throw_on_error is true, this function can be provided as a callback, "
                      "which will receive a single argument with the error information as an object "
                      "containing the details of the problem.  <br>The object will be contain the "
                      "following structure:```{\n  message: \"Error message text\"\n  position: \"line: ### "
                      "column: ###\"\n  pos: { line: line_number column: column_number }\n  depth: depth "
                      "in tree\n  local_text: \"The text immediately surrounding the error\"\n "
                      "source_name: options.source_name\n  type: \"Error Type\"\n}```<br> ")

     `usage:["text:string" "options:?object"]
     `tags: ["reader" "juno" "read" "lisp" "input" "eval" "evaluate" "parse"]
     })


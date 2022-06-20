;; Help Information for the repl
;; Defines the help command


;; 

(defglobal help_file
  {
   `top: |
   The help system provides information about a topic, tag, or specific symbol.

   The help system is accessed by calling the help function, followed by an
   operator, such as `tag, `symbol `source, and then arbitrary quoted words
   representing symbols, tags or names to query for.  The syntax is:

   (help `operator `symbol1 `symbol2 ...)
   
   To search for a specific tag, provide the keyword `tag, (shorthand: `#)
   followed by any quoted tagged topics.  The system will look through the
   available definitions and return definitions matching the provided tags.

   For example, the following searches for all definitions that have been
   tagged with `regex or `filter:

      (help `# `regex `filter)

   Any definitions found that contain the provided tags regex or filter are
   returned and described.

   To find information out about a particular symbol or definition, provide
   the operator `symbol (shorthand: `sym).  For example to return the details
   of the function last_sunday:

       (help `symbol `last_sunday)

   The help system will then display the defined details and any metadata
   about that symbol.

   If only two arguments are provided, such as (help `sort), the help system
   will first check to see if a specific symbol matches the provided argument,
   and if found return that.  If there is no exact match to a symbol, the
   help system will search the tags and metadata, and if results are found,
   will return those.

   To see this help text, use (help).
   
   |
   })


(defun find_tags (tags)
  (let
      ((acc {}))
    (assert (is_array? tags) "tags must be an array")
    (for_each (`definition Environment.definitions)
        (do
          (for_each (`tag tags)
              (do
                (cond
                  (and (contains? tag (or definition.tags []))
                       (blank? (prop acc definition.name)))
                  (set_prop acc
                            definition.name
                            (describe definition.name)))))))
    (reduce (`v 
             (map (fn (v)
                    (progn
                     (if (and v.description
                              (> v.description.length 50))
                       (set_prop v
                                 `description
                                 (+ (-> v.description `substr 0 49) "...")))
                                        ;(set_prop v
                                        ;         `tags
                                        ;        (join ", " v.tags)) 
                     (reorder_keys [`name `type  `description ] v)))                        
                  (each (sort (pairs acc)
                              { `key: [0] })
                        `1)))
            (if v.name
              v))))

(defun word_wrap (text max_cols tab_size)
  (let
      ((max_cols (or max_cols 80))
       (tab_size (or tab_size 5))       
       (words (progn
               (assert (is_string? text) "text must be a string.")
               (let
                   ((ptext (replace (new RegExp "\n" `g) " \n " text)))
                 (= ptext (replace (new RegExp "<br>" `g) " \n " ptext))
                 (split_by " " ptext))))
       (line [])
       (lines [])
       (subword nil)
       (specials nil)
       (num_cols 0)
       (over_length? (fn (word)
                       (cond
                         (== word "\t")
                         (> (+ num_cols tab_size) max_cols)
                         (== word "")  ;; a space since we split by spaces
                         (> (+ num_cols 1) max_cols)
                         else                         
                         (> (+ num_cols (+ 1 word.length 1)) max_cols))))
       (next_line (fn ()
                    (do
                      (push lines (join " " line))
                      (= line [])
                      (= num_cols 0))))
       (add_word (fn (word)
                   (do
                     (cond
                       (== word "\n")
                       (next_line)                       
                       (over_length? word)                       
                       (next_line))                     
                     (push line word)
                     (inc num_cols (+ (length word) 1))))))
                       
                      
    (for_each (`word words)
              (add_word word))
    (when (> line.length 0)
      (next_line))
    lines))

(defglobal help_log (defclog { `color: "green" `prefix: "help"}))

(defun show_help (topic)
  (if (prop help_file topic)
    (console.log (prop help_file topic))
    (help_log "unknown help topic:" topic)))

(defun describe_usage (usage)
  (progn
   (assert (is_array? usage))
   (for_each (`desc usage)
      (progn
       (= desc (cond
                 (is_string? desc)
                 (split_by ":" desc)
                 (is_array? desc)
                 [desc.0 (as_lisp desc.1)]))
       
       (cond
         (and (is_array? desc)
              (> desc.length 1))
          (+ { `argument: desc.0 }          

             (if (ends_with? "?" desc.1)
               { `type: (chop desc.1) }
               { `type: desc.1 })
          
             (if (ends_with? "?" desc.1)
               { `required: false }
               { `required: true } ))
         (is_array? desc)
         { `argument: desc.0 
           `type: "? (no information)" 
          `required: nil }         
         else
         { `argument: desc  `type: "? (check definition)"  `required: nil })))))
            
(defun show_finding (finding)
  (let
      ((field (fn (name value size)
                (+ "" (-> name `padEnd (or size 12)) " " value))))
       
    (log)
    (when finding.fn_args
    (log (field "USAGE" (as_lisp (conj (list (+ "=:" finding.name)) (read_lisp finding.fn_args))))))
    (log (field "TYPE" (-> finding.type `padEnd 30)) (if finding.macro "MACRO" ""))  
    (log (field "NAME" finding.name))       

  
  
  
  (log (field "LOCATION" finding.location))
  (when (and finding.usage (> finding.usage.length 0))
    (console.table (describe_usage finding.usage)))
  (when finding.tags
    (log (field "TAGS" (join ", " finding.tags))))
  (when finding.description
    (log "")
    (log (join "\n" (word_wrap finding.description)))
    (log ""))))



(defun help (`& args)
  (let
      ((findings []))
    (declare (array args))
    
  (cond
    (== args.length 0)
    (show_help `top)

    (or (== args.0 "#")
        (== args.0 "tag"))
    (if (blank? args.1)
      (help_log "Please provide a tag or tags as an additional argument, such as: (help" args.0 "string)")
      (progn
       (= findings (find_tags (-> args `slice 1)))
       findings))

    (or (== args.0 "symbol")
        (starts_with? "sym" args.0))
    (if (blank? args.1)
      (help_log "Please provide a symbol name as an additional argument, such as (help" args.0 "to_array)")
      (progn
       (= findings (describe args.1))
       (show_finding findings)))
       

    (and (is_string? args.0)
         (is_symbol? args.0))
    
    (show_finding (describe args.0))    

    (is_string? args.0)
    (progn
     (= findings (find_tags [ args.0 ]))
     (console.table findings))

    (is_function? args.0)
    (do (for_each (`symbol (keys Environment.context.scope))
                  (if (== (prop Environment.context.scope symbol) args.0)
                    (progn
                     (show_finding (describe symbol))
                     (break))))
        nil)

    else
    (progn
     (help_log "I am not sure how to process this request.  Try (help) to get started."))))

  {
   `description: (+ "Provides information for the REPL user or otherwise to find information on a resource "
                    "such as a function or topic.")
   `usage: ["topic_or_name:string|symbol?"]
   `tags: [ `help `info `information `assist `documentation `docs ]
   })

(defglobal ? help
  {
   `description: "Alias for the help command.  See help."
   `usage: ["topic_or_name:string|symbol?"]
   `tags: [ `help `info `information `assist `documentation `docs]
   })



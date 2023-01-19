;; Help Information for the repl
;; Defines the help command


;; 

(defun_sync decorative_usage (symbol_data namespace suppress_type)
  (let
      ((val (if (is_string? symbol_data)
                (cond
                   (starts_with? "(" symbol_data)
                   (-> symbol_data `substr 1)
                   (starts_with? "[" symbol_data)
                   (-> symbol_data `substr 1)
                   else
                   symbol_data)
                symbol_data.name))
       (show_type (function ()
                     (span { `style: "margin-left: 15px; font-style: italic" 
                             `class: (+ "juno-type-" (lowercase (or description.type "")))
                             }
                         (cond 
                            description.macro
                            "Macro"
                            description.type
                            (if suppress_type [] 
                                description.type)))))
       (metadata (if (and (is_object? symbol_data)
                          namespace
                          (not symbol_data.require_ns))
                     [list symbol_data]
                     (meta_for_symbol (trim val) true)))
       
       (description (if (is_object? symbol_data)
                        symbol_data
                        (if namespace
                           (first (reduce_sync (v metadata)
                                     (when (== v.namespace namespace)
                                        v)))
                           (first (or metadata [])))))
       (view nil)
       (is_symbol_binding (if (and description.require_ns
                                   (is_array? description.initializer)
                                   (== description.initializer.0 (quote pend_load)))
                              true
                              false))
       (rval nil))
     
      (when (and is_symbol_binding
                 (is_object? description))
       (set_prop description
          `usage
          (prop (first (reduce_sync (v metadata)
                                    (when (== v.namespace description.require_ns)
                                       v)))
                `usage)))
      (= rval
         (cond
            (is_array? description.usage)
            (div { `style: "display: inline-block"} "("
                 (flatten [(span { `class: "juno-operator-name" `style: "font-weight: bold;" } val)
                           (for_each (arg description.usage)
                              (destructuring_bind (arg_name arg_type arg_needed)
                                 (split_by ":" arg)
                                 (= arg_type (or arg_type ""))
                                 (span { `class: (+ "juno-type-" (if (starts_with? "?" arg_type)
                                                                     (lowercase (or (chop_front arg_type) ""))
                                                                     (lowercase arg_type))
                                                    " juno-arg-name") `title: arg_type
                                                `style: (if (== arg_needed "required") "text-decoration: underline" "") } arg_name ":" arg_type)
                                 ))])
                 ")" (show_type))
            (is_string? description.fn_args)
            (div { `style: "display: inline-block"} "("
                 (span { `class: "juno-operator-name" `style: "font-weight: bold;" } val)
                 (for_each (arg_name (split_by " " (chop (rest description.fn_args))))
                    (span { `class: "juno-arg-name" } arg_name))
                 ")" (show_type))
            
            else
            nil))
      rval)
  {
    `usage: ["symbol:string|object" "namespace:?string" "suppress_type:?boolean"]
    `description: (+ "Given a symbol name as a string or an object metadata value (as from describe), returns a DOM element of the usage information.  "
                     "If the usage metadata is defined for the symbol it will use that, otherwise "
                     "if the symbol is a function and has fn_args defined, that content will be returned "
                     "in a DOM element.  Used by the editor to display usage information. ")
    `tags: [ `usage `editor `formatting `help `assist ]
    })

(defun unpack_description (description options)
   (let
      ((header_size_lookup [nil h1 h2 h3 h4 h5 h6])
       (regex_list [{ name: "code"
                       regex: (new RegExp "(`[a-zA-z0-9*?_%!\\-@\\$\\(\\)]+`)" `g)
                       exec: (fn (value full_regex_result)
                                (progc
                                   (defvar rval (code {} (-> value `substr 1 (- (length value) 2))))
                                   ;(log "code: value: " (-> value `substr 1 (- (length value) 2)) "rval: "  (as_lisp (element_to_lisp rval)))
                                   rval))}
                    { name: "table" 
                      regex: (new RegExp "(^[`a-zA-Z\\(\\)0-9?_*\\-]+):([`*a-z\\(\\) A-Z0-9]+)[ ]*-[ ]*(.+)")
                      exec: (fn (match_text tbl_row)
                               (progn
                                  ;(log "table: " match_text)
                                  (if options.edit_mode
                                     [(+ tbl_row.1 ":" tbl_row.2 "-") (process_regex tbl_row.3)]
                                     (when (not (blank? match_text))
                                        (div { `style: "display: flex; align-items: flex-end; flex-wrap: wrap; gap: 16px; border-bottom: 1px solid var(--main-accent-line);" }
                                             (div { `style: "align-self: flex-start; font-weight: bold; padding: 5px; flex-grow: 0; flex-basis: 100px;" } tbl_row.1)
                                             (div { `style: "align-self: flex-start; font-weight: bold; padding: 5px; flex-grow: 0; flex-basis: 100px;" } tbl_row.2)
                                             (div { `style: "align-self: flex-start; padding: 5px; flex-grow: 1; flex-basis: 400px;"} (process_regex tbl_row.3))))))) }
                     { name: "header" 
                       regex: (new RegExp "^([#]{1,6})[ ]+(.+)")
                       exec: (fn (value full_regex_result)
                                (progn
                                   (defvar header_section (first full_regex_result)) ;; pull it out of the array to make it easier to work with
                                   (defvar header_tag (or (prop header_size_lookup (length (prop full_regex_result 1)))
                                                     h5))
                                   (header_tag
                                      (prop full_regex_result `2)))) }
                     { name: "link"
                       regex: (new RegExp "(\\\\b(https?|ftp|file):\\\\/\\\\/[-A-Z0-9+&@#\\\/%?=~_|!:,.;]*[-A-Z0-9+&@#\\\\/%=~_|])" `ig)
                       exec: (fn (value full_regex_match)
                                (progn
                                   ;(log "link match: " value full_regex_match)
                                   (if value
                                      (a { `_target: "_blank" `href: value }
                                         value)
                                      "BAD LINK"))) }
                     { name: "horizontal_line" 
                       regex: (new RegExp "^(---[ ]*)$" `g)
                       exec: (fn (value)
                                (progn
                                   (hr))) }
                      ])
       (pre_section nil)
       (process_regex (fn (text_section)
                         (let
                            ((results [])
                             (replacement nil)
                             (ctext text_section)
                             (idx ctext.length)
                             (overlap_key nil)
                             (overlap_struct nil)
                             (split_list [])
                             (action_list [])
                             (overlaps {})
                             (acc [])
                             (comps nil))
                            ;(log "process_regex: -> " text_section)
                            (for_each (cmd regex_list)
                               (progn
                                  (= comps (scan_str cmd.regex ctext))
                                  (for_each (comp comps)
                                     (push split_list 
                                        { comp: comp
                                          pos: comp.index
                                          length: comp.0.length
                                          cmd: cmd
                                           }))))
                            ;; now we have a list of the changes to be made to the text chunk 
                            ;(log "split_list: " split_list)
                            (for_each (r1 split_list)
                               (for_each (r2 split_list)
                                  (unless (== r1 r2)
                                      (if (> r1.length r2.length)
                                          (= overlap_struct [[r1.pos (+ r1.pos r1.length)] [r2.pos (+ r2.pos r2.length)]])
                                          (= overlap_struct [[r2.pos (+ r2.pos r2.length)] [r1.pos (+ r1.pos r1.length)]]))
                                      (unless (prop overlaps (as_lisp overlap_struct))
                                         (when (apply range_overlap? overlap_struct)
                                            (set_prop overlaps
                                               (as_lisp overlap_struct)
                                               { 
                                                 parent: (if (> r1.length r2.length)
                                                             r1
                                                             r2)
                                                 child: (if (> r1.length r2.length)
                                                             r2
                                                             r1)
                                                 }))))))
                            (= action_list (reduce (action split_list)
                                              (progn
                                                 (defvar remove false)
                                                 (for_each (v (values overlaps))
                                                    (if (and (== action.pos v.child.pos)
                                                             (== action.length v.child.length))
                                                       (= remove true)))
                                                 (unless remove
                                                    action))))
                                              
                            (= split_list (reverse (sort action_list { `key: [`pos] })))
                            (if (> split_list.length 0)
                                (progn
                                   (for_each (action split_list)
                                      (progn
                                         (defvar end_of_insert (+ action.pos action.comp.0.length)) ;; point of the ctext buffer *after* the splice
                                         (defvar diff (- idx end_of_insert))   ;; text remaining from the end of the match to the idx point(which starts at the end of the ctext segment)
                                         ;(log "*" action.pos end_of_insert idx)
                                         (push acc (-> ctext `substr  end_of_insert diff)) ;; push that into our accumulator (it will be in reverse order)
                                         (push acc (-> action.cmd `exec action.comp.0 action.comp))
                                         (= idx action.pos)))  ;; update our tail end
                                   ;; if we have any remaining text, push it in to the accumulator as it will have no edits
                                   (when (> idx 0)
                                      ;(log "idx is greater than 0: " idx (-> ctext `substr 0 idx))
                                      (push acc (-> ctext `substr 0 idx))))
                                   (push acc text_section)) ;; nothing to update
                            (reverse acc))))
       (desc (progn
                (defvar tmp (eval (or description "")))
                (cond 
                   (is_element? tmp)
                   tmp
                   (and (is_object? tmp)
                        (not (is_array? tmp))
                        (is_string? tmp.description))
                   tmp.description
                   (is_string? tmp)
                   tmp
                   else  ;; not for us
                   tmp)))
       (rr (new RegExp "<-" `g))
       (subsections [])
       (segments (if (is_string? desc)
                     (split_by "```" desc)
                     []))
       (table_section nil)
       (idx -1)
       (header_section nil)
       (header_tag nil)
       (header_size_lookup [nil h1 h2 h3 h4 h5 h6]) ;; pos 0 will never be found, hence nil
       (current_seg 0)
       (total_segs (length segments)))
      (if (is_string? desc)
         (div (+ { `class: "juno-editable" }
                 (if options.edit_mode
                    { `contenteditable: true }
                    {}))
              (for_each (segment segments)
                 (progn
                    (inc idx)
                    (if (== 1 (% idx 2))
                        (pre segment)
                        (for_each (section (split_by "<br>" segment))
                           (progn
                              ;(log (hr))
                              ;(log "unpack_description: section: " section)
                              (div (process_regex section))))))))
         desc))
   {
     ;usage: ["text:string" "options:object"]
     description: (+ "<br><br>Provided a text string as a primary argument, the function will convert "
                     "the text content to a DOM element structure based on a set of default rules, or "
                     "user provided rules.  A DOM element will be returned which can be placed in the "
                     "DOM.<br><br>#### Options   <br><br>This function takes the following "
                     "options:<br>edit_mode:boolean -If true, the returned DOM element will be "
                     "editable; a `contenteditable` attribute will be placed in element "
                     "returned.<br>regex_list:array -If provided, each segment of text that is not "
                     "allocated to a `PRE` element will be evaluated by the regex rules.  When a "
                     "match is found, the associated exec function of the rule will be called with "
                     "the form `(fn (value full_regex_result))` where the `value` is the matched text "
                     "value, and the `full_regex_result` is the full returned regex structure from "
                     "the `scan_str` function.  The return value of the function, typically an "
                     "Element type will replace the matched text.    ")
     })

(defun format_help (meta_obj options)
   (let
      ((is_symbol_binding (if (and meta_obj.require_ns
                                   (is_array? meta_obj.initializer)
                                   (== meta_obj.initializer.0 (quote pend_load)))
                              true
                              false))
       (imported_usage (first (if is_symbol_binding
                                  (reduce  (v (meta_for_symbol meta_obj.name true))
                                     (when (== v.namespace meta_obj.require_ns)
                                        v))
                                  [])))
       (elem nil))
      
     
      (when imported_usage
         (set_prop meta_obj
            `usage
            (prop imported_usage `usage))
         (set_prop meta_obj
            `tags
            (prop imported_usage `tags)))
            
            
      (= elem
         (div { `command: (+ "" meta_obj.name)  `style: "width: calc(100% - 20px); padding-bottom: 5px;" }
              (h3 (span { `style: "color: var(--namespace-color); " } meta_obj.namespace ) "/" meta_obj.name
                  (if meta_obj.macro
                     (span { `style: "float: right; margin-right: 20px; " } "Macro")
                     (span { `title: "Type" `style: "float: right" `class: (+ "juno-type-" (lowercase meta_obj.type)) } meta_obj.type)))
              (hr { `class: "LightHR" })
              (cond
                 (and (contains? `unction meta_obj.type)
                      meta_obj.usage)
                 [(h4 "Usage")
                  (decorative_usage meta_obj meta_obj.namespace true)]
                 (contains? `unction meta_obj.type)
                 [(h4 "Arguments")
                  meta_obj.fn_args]
                 else
                 [])
              (if (or meta_obj.description
                      is_symbol_binding)
                  [(h4 "Description")
                   (if is_symbol_binding
                      (p
                         (div { } "This is a bound symbol into " (span { `style: "color: var(--namespace-color); " }  meta_obj.require_ns)
                              " to " (join " " meta_obj.requires) ".  For more information refer to the core/use_symbols macro and to " (join " " meta_obj.requires) ".")
                         (br))
                      (unpack_description meta_obj.description))]
                  [])
              
              (if meta_obj.tags
                 [(h4 "Tags")
                  (for_each (`sym meta_obj.tags)
                     (span { `tabindex: 0 `class: "juno-tag" `style: "" } sym ))]
                 [])
              (if meta_obj.requires
                 [(h3 "Requires")
                  (div {  } 
                       (for_each (`sym (sort meta_obj.requires))
                          (span { `tabindex: 0 `class: (+ "juno-type-" (lowercase (or (prop (describe sym) `type) "")) " juno-requires") `style: "display: inline-block;" } sym )))]
                 [])
              ))
      (cond
         (is_function? options.on_click)
         (attach_event_listener elem
            `click
            (fn (e)
               (-> options `on_click e))))
      elem)
   {
     `description: (+ "Render object definitions to html.  Given a path "
                      "to Environment.definitions, or the output of the "
                      "describe function, returns a DOM element.  If options "
                      "is provided, the if the value for the key 'on_click' "
                      "is a function, when the produced element is clicked "
                      "the click event will be passed to the on_click function "
                      "provided.")
     `usage: ["meta_obj:object" "options:?object"]
     `tags: [`help `? `usage `info `man `manual ]
     })


(defmacro ? (symname)
   `(let
       ((results (describe ,#(if (starts_with? "=:" symname)
                                 (-> symname `substr 2)
                                 symname) true)))
       (for_each (`meta_obj (or results []))
          (format_help meta_obj)
          ))
   {
       `description: "Given a quoted symbol as an argument, the function returns a formatted manual page for the provided symbol."
       `usage: ["name:quoted_symbol"]
       `tags:["help" "assistance" "man" "usage" "info"]
   })


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
       (console.table findings)
       (length findings)))

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

(defmacro ? (symname)
   `(let
       ((results (describe ,#(if (starts_with? "=:" symname)
                                 (-> symname `substr 2)
                                 symname) true)))
       (for_each (`meta_obj (or results []))
          (help meta_obj)
          ))
   {
       `description: "Given a quoted symbol as an argument, the function returns a formatted manual page for the provided symbol."
       `usage: ["name:quoted_symbol"]
       `tags:["help" "assistance" "man" "usage" "info"]
   })

(console.log "\nHelp loaded. Enter (help) for more information.")



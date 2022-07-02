; Kina Server - main boot library
; (c) 2019 Kina, LLC
; All Rights Reserved
 

 
; this must be included in the dlisp environment boot up/initialization 
 
     
(do  

    ; set up the core environment...
    
    (defmacro if_undefined (value replacer)
        `(if (== undefined ,#value)
            ,#replacer
            ,#value)
        { "description":"If the first value is undefined, return the second value"
          "usage":["value:*" "replacer:*"]})


    (defun str (`& `args) 
        (join " " args)
        {
            `description: "Joins arguments into a single string separated by spaces and returns a single string."
            `usage:["arg0:string" "argn:string"]
            `tags:["string" "join" "text"]
        })
       
    
    (if (is_symbol? `d3)
         (defglobal `d3 d3))
        
    
    (defglobal `COPY_DATA nil)
    
    (if (is_symbol? `uuid)
        (defglobal uuid uuid
        {
            `description: "Generates and returns a string that is a newly generated uuid."
            `usage:[]
            `tags:["id" "unique" "crypto"]
        }))
    
  (defun assert (assertion_form failure_message)
      (if assertion_form
          assertion_form
         (throw EvalError (or failure_message "assertion failure")))
         {
             `description: "If the evaluated assertion form is true, the result is returned, otherwise an EvalError is thrown with the optionally provided failure message."
             `usage:["form:*" "failure_message:string?"]
             `tags:["true" "error" "check" "debug" "valid" "assertion"]
         })


    (defun bind_and_call (target_object this_object method `& args)
        (do
            (defvar boundf (bind (prop target_object method) this_object))
            (if boundf
                (apply boundf args)
                (throw "unable to bind target_object")))
        {
            `usage:["target_object:object" "this_object:object" "method:string" "args0:*" "argsn:*"]
            `desciption: "Binds the provided method of the target object with the this_object context, and then calls the object method with the optional provided arguments."
            `tags:["bind" "object" "this" "context" "call"]
        })

    (defmacro on_nil (nil_form value)
      `(let
           ((v ,#value))
            (if (eq v nil)
                ,#nil_form
                v))
       {
        `usage: ["nil_form:form" "value:*"]
        `description: "If the value argument is not nil or not undefined, return the value, otherwise evaluate the provided nil_form and return the results of the evaluation of the nil_form."
        `tags: ["condition" "nil" "eval" "undefined"]
        })


     (defmacro on_empty (on_empty_form value)
      `(let
           ((v ,#value))
            (if (or (eq v nil)
                    (and (is_array? v)
                         (== 0 (length v)))
                    (and (is_object? v)
                         (== (length v) 0)))
                ,#on_empty_form
                v))
       {
        `usage: ["empty_form:form" "value:*"]
        `description: "If the value argument is not an empty array, an empty object, nil or undefined, return the value, otherwise evaluate the provided empty_form and return the results of the evaluation of the empty_form."
        `tags: ["condition" "empty" "list" "array" "object" "eval" "undefined"]
        })

    (defmacro sum (vals)
      `(apply add ,#vals)
       {
          `description: (+ "Given an array of values, add up the contents of the array in an applied add operation.  "
                           "If these are numbers, they will be added arithmetically.  "
                           "If given strings, they will be joined together (appended). "
                           "If given a first value of an array, all subsequent values will be added into the array. "
                           "If given an array of objects, all the keys/values will be merged and a single object retuned.")
          `usage: ["vals:array"]
          `tags: ["add" "join" "summation" "numbers"]
                           
                
       })

    (defun options_and_args (arg_array)
         (do 
             (cond 
                   (and arg_array (is_array? arg_array))
                   (do 
                       (if (== (type arg_array.0) "object")
                           ; first arg is an optional option, take it and return the remaining
                           [arg_array.0 (slice arg_array 1)]
                           ; return nil for the first arg since it is not an options object
                           [nil arg_array]))
                   else
                   ; not an array, so just return it
                   [nil arg_array]))
    { `usage: ["arg_array:array"] 
      `tags:  ["arguments" "options"]
      `description: (+ "Given an array of values, returns an array containing two values.  " 
                       "If the value at position 0 in the provided array is an non nil object, " 
                       "it will be in the position 0 of the returned value and the remaining " 
                       "values will be in position 1 of the returned array." 
                       "If the value at position 0 in the provided array is not an object type," 
                       "the value in position 0 of the returned array will be nil and " 
                       "all values will be placed in the returned array in position 1."  ) })

   (defun enum (value_list)
        (do 
            (defvar `e (new Object))
            (defvar `i -1)
            (assert (is_array? value_list) "Value_list must be an array")
            (for_each (`v value_list)
                (set_prop e
                          v (inc i)))
            e)
        { `usage: ["value_list:array"] 
          `description: "Given a list of string values, returns an object with each value in the list corresponding to a numerical value."
          `tags:["enumeration" "values"]
        })

    (defmacro time_in_millis ()
        `(Date.now)
        { "usage":[]
          "tags":["time" "milliseconds" "number" "integer" "date"]
          "description":"Returns the current time in milliseconds as an integer" })
    
    (defun gen_id (prefix)
           (+ "" prefix "_" (time_in_millis ))
           { `usage: ["prefix:string"] 
             `tags: [`web `html `identification ]
             `description: "Given a prefix returns a element safe unique id" } )
    
    
    (defun nth (idx collection)
        (cond 
              (is_array? idx)
              (map (lambda (v) (nth v collection)) idx)
              (and (is_number? idx) (< idx 0) (>= (length collection) (* -1 idx)))
              (prop collection (+ (length collection) idx))
              (and (is_number? idx) (< idx 0) (< (length collection) (* -1 idx)))
              undefined
              else
              (prop collection idx))
        {
           "description":(+ "Based on the index or index list passed as the first argument, " 
                            "and a collection as a second argument, return the specified values " 
                            "from the collection. If an index value is negative, the value "
                            "retrieved will be at the offset starting from the end of the array, "
                            "i.e. -1 will return the last value in the array.")
           "tags":["filter" "select" "pluck" "object" "list" "key" "array"]
           "usage":["idx:string|number|array","collection:list|object"]
         })
    
    (defun macros ()
        (reduce (`v (pairs Environment.definitions))
           (if v.1.macro 
              v.0))        
        { `usage: [] 
          `description: "Returns the list of currently defined macros.  This function takes no arguments." 
          `tags: ["environment" "macro" "defined" ]} )

    (defmacro pluck (fields data)
        `(each ,#data ,#fields)
        {
         `description: "Similar to the 'each' commmand, given the set of desired fields as a first argument, and the data as the second argument, return only the specified fields from the supplied list of data"
         `usage: ["fields:string|array" "data:array"]
         `tags: ["list" "each" "filter" "only" "object"]
         })
     
    (defun objects_from_list (key_path objects)
      (let
         ((obj  (new Object))
          (path (if (is_array? key_path)
                    key_path
                    [ key_path ])))
        (for_each (`o objects)
         (set_prop obj
             (resolve_path path o)
             o))
            obj)
        { `usage: ["key_path:string|array" "objects:array"]
          `description: "Given a path (string or array), and an array of object values, the function returns a new object with keys named via the value at the given path, and the object as the value."
          `tags: ["list" "object" "conversion" "transform"] } )
   
   
   (defun pairs_from_list (value_list size)
        (let 
             ((container [])
             (size      (or size 2))
             (mod_size  (- size 1))
             (pset      [])
             (count     0))
             
            (for_each (`item value_list)
               (do 
                   (push pset item)
                   (if (== mod_size (% count size))
                       (do 
                           (push container pset)
                           (= pset [])))
                   (inc count)))
             (if (> (length pset) 0)
                 (push container pset))
             container)
        { `usage: ["value:list","size?:number"]
          `description: "Given a list, segment the passed list into sub list (default in pairs) or as otherwise specified in the optional size" 
          `tags: ["list" "pairs" "collect"]
        } )
   
   (defun reorder_keys (key_list obj)
      (let 
           ((objkeys (keys obj))
            (rval    (new Object))
            (values (nth key_list obj )))
        
            (to_object
               (pairs_from_list 
                  (interlace 
                     key_list
                     values ))))
      { `description: "Given a list of keys, returns a new object that has the keys in the order of the provided key list."
        `usage: ["key_list:array" "obj:object"] 
        `tags: ["list" "object" "key" "order" ] })
   
   (defun only (fields data)
        (cond 
            (is_array? data)
            (map (fn (v)
                     (reorder_keys fields v))
                 data)
            (is_object? data)
            (reorder_keys fields data)
            else
            data
            )
    {`usage: ["fields:array" "data:array|object"]
     `description: "Given an array of objects, or a single object, return objects only containing the specified keys and the corresponging value."
     `tags: ["pluck" "filter" "select" "object" "each" "list" "objects" "keys" ]
     }) 
     
    (defun sleep (seconds)
       (new Promise 
            (fn (resolve)
                (setTimeout (lambda() (resolve true)) (* seconds 1000))))
        {"usage":["seconds:number"]
         "tags":["time" "timing" "pause" "control"]
         "description":"Pauses execution for the number of seconds provided to the function." }) 
     
    (if_compile_time_defined `Library
        (do
            (defun post (url values)
                   (Library.doPost url values)
                   {
                     `usage: ["url:string","values:object"]
                     `description:"Posts the supplied values to the supplied URL and returns the result provided by the server."
                    })
            
            (defun get (url values)
               (Library.doGet url values)
               {
                 `usage: ["url:string","values:object"]
                 `description:"Performs an HTTP(S) get with the supplied values to the supplied URL and returns the result provided by the server."
                })
            true)
        nil)


    
    (defun from_universal_time (seconds)
      (let
          ((d (new Date 0))
           (ue (- seconds 2208988800)))
         (-> d
            `setUTCSeconds ue)
       d)
      {
        `description: "Given a universal_time_value (i.e. seconds from Jan 1 1900) returns a Date object."
        `usage: ["seconds:number"]
        `tags: ["date" "time" "universal" "1900"]
      })
    
    
    
    
   (defmacro += (symbol `& args)
        `(= ,@symbol (+ ,#symbol ,@args))
        { `usage: ["symbol:*" "arg0:*" "argn?:*"] 
          `description: "Appends in place the arguments to the symbol, adding the values of the arguments to the end." 
          `tags: ["append" "mutate" "text" "add" "number"]
        })
    
    
    (defun minmax (container)
        (do 
            (defvar `value_found false)
            (defvar `smallest MAX_SAFE_INTEGER)
            (defvar `biggest (* -1 MAX_SAFE_INTEGER))
            (if (and container (is_array? container) (> (length container) 0))
              (do 
                  (for_each (`value container)
                    (and (is_number? value) 
                      (do 
                        (= value_found true)
                        (= smallest (Math.min value smallest))
                        (= biggest (Math.max value biggest)))))
                  (if value_found [ smallest biggest] 
                      nil))
              nil)
            )
        { `usage: ["container:array"] 
          `description: "Given an array of numbers returns an array containing the smallest and the largest values found in the provided array. "
          `tags: ["list" "number" "range" "value"]})

    
     (defun minmax_index (container)
        (do 
            (defvar `value_found false)
            (defvar `idx_small nil)
            (defvar `idx_largest nil)
            (defvar `idx 0)
            (defvar `smallest MAX_SAFE_INTEGER)
            (defvar `biggest (* -1 MAX_SAFE_INTEGER))
            (if (and container (is_array? container) (> (length container) 0))
              (do 
                  (for_each (`value container)
                    (do
                        (and (is_number? value) 
                          (do 
                           (= value_found true)
                           (when (< value smallest)
                                 (= smallest value)
                                 (= idx_small idx))
                           (when (> value biggest)
                                 (= biggest value)
                                 (= idx_largest idx))
                            (inc idx)))))
                  (if value_found [ idx_small idx_largest] 
                      nil))
              nil)
            )
        { `usage: ["container:array"] 
          `description: "Given an array of numbers returns an array containing the indexes of the smallest and the largest values found in the provided array."
          `tags: ["list" "number" "range" "value" "index"] })
      
  (defun invert_pairs (value)
        (if (is_array? value)
          (map (fn (v)
                   [v.1 v.0])
               value)
          (throw Error "invert_pairs passed a non-array value"))
     {
       `description: "Given an array value containing pairs of value, as in [[1 2] [3 4]], invert the positions to be: [[2 1] [4 3]]"
       `usage:["value:array"]
       `tags:["array" "list" "invert" "flip" "reverse" "swap"]
      })
  
  (defun object_methods (obj)
    (let
        ((`properties (new Set))
         (`current_obj  obj))
     (while current_obj
        (do
            (map (fn (item)
                     (-> properties `add item))
                 (Object.getOwnPropertyNames current_obj))
            (= current_obj (Object.getPrototypeOf current_obj))))
    (-> (Array.from (-> properties `keys))
        `filter (fn (item)
                    (is_function? item))))
    {
     `description: "Given a instantiated object, get all methods (functions) that the object and it's prototype chain contains."
     `usage: ["obj:object"]
     `tags: [`object `methods `functions `introspection `keys]
     })    

  (defun noop (val)
      val
      { `usage: ["val:*"]
        `description: "No operation, just returns the value.  To be used as a placeholder operation, such as in apply_operator_list." 
        `tags: ["apply" "value"]
      } )

  (defun apply_list_to_list (operator list1 list2)
    (map (fn (val idx)
             (operator val (prop list1 (% idx (length list1)))))
         list2)
    {  `usage: ["operator:function" "modifier_list:array" "target_list:array"]
       `description: (+ "Given an operator (function), a list of values to be applied (modifier list), and a list of source values (the target), "
                        "returns a new list (array) that contains the result of calling the operator function with "
                        "each value from the target list with the values from the modifier list. The operator function is called "
                        "with <code>(operator source_value modifer_value)</code>.")
       `tags: ["map" "list" "array" "apply" "range" "index"]
    } ) 
     
  (defun apply_operator_list (modifier_list target_list)
    (map (fn (val idx)
             (do
                 (defvar `op (-> Environment `eval (+ "=:" (prop modifier_list (% idx (length modifier_list))))))
                 (op val )))
         target_list)
    {  `usage: ["operator_list:array" "target_list:array"]
       `description: (+ "<p>Note: Deprecated.Given a list containing quoted functions (modifier list), and a list of source values (the target), "
                        "returns a new list (array) that contains the result of calling the relative index of the modifier functions with "
                        "the value from the relative index from the target list. The modifiers are applied in the following form: "
                        "<code>(modifier_function target_value)</code>.</p>"
                        "<p>If the modifer_list is shorter than the target list, the modifer_list index cycles back to 0 (modulus).</p>")
       `tags: ["map" "list" "array" "apply" "range" "index"]
       `example: (quote (apply_operator_list (`first `+) ["John" "Smith"]))
       `deprecated: true
    } )

    
    
   (defun range_overlap? (range_a range_b)
        (and (<= range_a.0 range_a.1)
             (<= range_b.0 range_b.1)
            (if (or  (and (<= range_a.0 range_b.0)
                          (<= range_b.0 range_a.1))
                     (and (>= range_a.0 range_b.0)
                          (<= range_a.0 range_b.1)))
                true
                false))
        { `description: "Given two ranges in the form of [low_val high_val], returns true if they overlap, otherwise false.  The results are undefined if the range values are not ordered from low to high." 
          `usage: ["range_a:array" "range_b:array"]
          `tags:  ["range" "iteration" "loop"] } )
 
   (defun remaining_in_range (value check_range)
        (cond (and (<= value check_range.1) (>= value check_range.0))
              (- check_range.1 value)
              else 
              nil)
        { `usage: ["value:number" "check_range:array"]
          `description: "Given a value, and an array containing a start and end value, returns the remaining amount of positions in the given range.  If the value isn't in range, the function will return nil."
          `tags:  ["range" "iteration" "loop"] } )


    
    (defun range_inc (start end step)
        (if end
            (range start (+ end 1) step)
            (range (+ start 1)))
        {
         `description: (+ "Givin"
                          "Similar to range, but is end inclusive: [start end] returning an array containing values from start, including end. " 
                          "vs. the regular range function that returns [start end).  "
                          "If just 1 argument is provided, the function returns an array starting from 0, up to and including the provided value.")
         `usage: ["start:number" "end?:number" "step?:number"]
         `tags:  ["range" "iteration" "loop"]
         })
    
   
    (defun form_id (name)
        (replace (new RegExp "\W" `g)  "_" 
                 (replace (new RegExp "[+?':]" `g) "sssymss1"
                    (replace "!" "sexcs1"
                    (replace "<" "slts1"
                     (replace ">" "sgts1"
                        (join "_" (split (lowercase name) " ")))))))
        {
            `usage:["name:string"]
            `description:"Given a standard string returns a compliant HTML ID suitable for forms."
        }
    )

   (defun from_key (value sep? ignore?)
        (if (is_string? value)
              (do 
                (if ignore?
                    (return value))
                (= sep? (or sep? "_"))
                (dtext (join " "
                   (map (fn (v)
                        (+ ""
                           (-> (-> v `charAt 0)
                               `toUpperCase)
                           (-> v `slice 1)))
                       (split_by sep? value)))))
            value)
        {   
         `usage: ["value:string" "separator?:string"]
         `description: (+ "Takes a key formatted value such as \"last_name\" and returns a \"prettier\" string that contains spaces " 
                       "in place of the default separator, '_' and each word's first letter is capitalized. " 
                       "An optional separator argument can be provided to use an alternative separator token.<br>E.G. last_name becomes \"Last Name\".")
         `tags: ["string" "split" "key" "hash" "record" "form" "ui"]
        })
                       
    (defun from_key1 (v)
        (from_key v)
        {
         `description: "Useful for calling with map, since this function prevents the other values being passed as arguments by map from being passed to the from_key function."
         `tags: ["map" "function" "key" "pretty" "ui" "to_key"]
         `usage: ["value:string"]
         })                   

   
        
   (defun to_key (value sep? ignore?)
      (if (is_string? value)
         (do    
            (if ignore?
                (return value))
            (= sep? "_")
            
            (defvar `tokens (map (fn (v)
                                    (+ "" (lowercase v)))
                                 (split_by " " value)))
            (defvar `rv (join sep?
                            tokens))
            rv)
           (do 
              
               value))
       {   
         `usage: ["value:string" "separator?:string"]
         `description: (+ "Takes a value such as \"Last Name\" and returns a string that has the spaces removed and the characters replaced " 
                           "by the default separator, '_'.  Each word is converted to lowercase characters as well." 
                           "An optional separator argument can be provided to use an alternative separator token.<br>E.G. \"Last Name\" becomes \"last_name\".")
         `tags: ["string" "split" "key" "hash" "record" "form" "ui"]
        }) 
    
     (defun is_date? (x)
       (== (sub_type x) "Date")
       {
        `description: "for the given value x, returns true if x is a Date object."
        `usage: ["arg:value"]
        `tags: ["type" "condition" "subtype" "value" "what" ]
        })
    
    (defun is_nil? (`value)
        (== nil value)
        {
        `description: "for the given value x, returns true if x is exactly equal to nil."
        `usage: ["arg:value"]
        `tags: ["type" "condition" "subtype" "value" "what" ]
        })
    
    
    ;; From Underscore.js (MIT License) - integrated snippet reproduces the isObject logic used by that library
    (defglobal is_object_or_function?
        (new Function ("obj") "var type = typeof obj; return type === 'function' || type === 'object' && !!obj;"))
    
   
    (defun extend (target_object source_object)
       (if (and (is_object? target_object)
                (is_object? source_object))
           (do 
               (for_each (`pset (pairs source_object))
                  (set_prop target_object
                            pset.0
                            pset.1))
               target_object)
           target_object)
       {
           `description: "Given a target object and a source object, add the keys and values of the source object to the target object."
           `usage: ["target_object:object" "source_object:object"]
           `tags: ["object" "extension" "keys" "add" "values"]
       })
    
    
    (defun no_empties (`items)
        (do 
            (defvar `item_type (sub_type items))
            (if (not (eq item_type "array"))
                (setq items (list items)))
            
            (reduce (`value items)
                  (cond 
                        (eq nil value)
                            false
                        (eq "" value)
                            false
                        else
                            value)))
        {
         "description":"Takes the passed list or set and returns a new list that doesn't contain any undefined, nil or empty values"
         "usage":["items:list|set"]
         "tags": ["filter" "nil" "undefined" "remove" "except_nil"]
        } )

    (defun first_with (prop_list data_value)
        (let
           ((`rval nil)
            (`found false))     
            (for_each (`p prop_list)
                (do 
                    (= rval (prop data_value p))
                    (when (not (eq nil rval))
                       (= found true)
                       (break))))
           (if found
               rval             
               nil))
        {
         `usage: ["property_list:array" "data:object|array"]
         `description: "Given a list of properties or indexes and a data value, sequentially looks through the property list and returns the first non-null result."
         `tags: ["list" "array" "index" "properties" "search" "find"]
         })

    
    (defun fixed (v p)
        (if p
              (-> (parseFloat v) `toFixed p)
              (-> (parseFloat v )`toFixed 3))
        { `description: "Given a floating point value and an optional precision value, return a string corresponding to the desired precision.  If precision is left out, defaults to 3."
          `usage: ["value:number" "precision?:number"]
          `tags: ["format" "conversion"]
        })

    (defun except_nil (`items)
        (do 
            (defvar `acc [])           
            (if (not (== (sub_type items) "array"))
                (setq items (list items)))
            (for_each (`value items)
                  (if (not (eq nil value))
                      (push acc value)))
            acc)
                        
        {
         "description":"Takes the passed list or set and returns a new list that doesn't contain any undefined or nil values.  Unlike no_empties, false values and blank strings will pass through."
         "usage":["items:list|set"]
         "tags": ["filter" "nil" "undefined" "remove" "no_empties"]
        })


    (defun hide (value)
         undefined)
    
    (defun array_to_object (input_array) 
       (let 
           ((count 0)
            (output (clone {}))
            (working_array  (clone input_array)))
             
            (while (> (length working_array) 0)
                (do
                    (defvar `v1 (take working_array))
                    (defvar `v1t (type v1))
                    (cond 
                        (== v1t `object)
                        (= output (add (output v1)))
    
                        else
                          (set_prop output v1 (take working_array)))))
            output)
        {
            "usage":["list_to_process:array"]
            "tags":["list" "array" "object" "convert"]
            "description":"Takes the provided list and returns an object with the even indexed items as keys and odd indexed items as values."
        })

    (defun split_text_in_array (split_element input_array)
           (do 
               (defvar output [])
               (for_each (`item input_array)
                    (do
                        (cond 
                          (is_string? item)
                          (push output (split item split_element))
                          else
                          (push output [nil item]))))
                output)
           {
               `usage: ["split_element:text" "input_array:array"]
               `tags: ["text" "string" "split" "separate" "parse"]
               "description":"Takes the provided array, and split_element, and returns an array of arrays which contain the split text strings of the input list."
           })
    
    (defun words_and_quotes (text)
        (if (not (eq text nil))
            (map (fn (x i)
                     (if (== 0 (% i 2))
                         (join " "
                             (no_empties
                              (split_by 
                                 " "
                                 (trim x))))
                        x))
                (split_by "\"" text ))
            [])
        {
         `description: "Given a text string, separates the words and quoted words, returning quoted words as their isolated string."
         `tags: ["text" "string" "split" "separate" "parse"]
         `usage: ["text:string"]
         })
     
    (defun split_words (text_string)
         (no_empties
           (map (fn (x i)
                         (if (== 0 (% i 2))
                                 (no_empties
                                  (split_by 
                                     " "
                                     (trim x)))
                            [x]))
                (words_and_quotes text_string)))
         {
          `description: "Like words and quotes, splits the text string into words and quoted words, but the unquoted words are split by spaces.  Both the unquoted words and the quoted words inhabit their own array."
          `usage: ["text:string"]
          `tags: ["text" "string" "split" "separate" "words" "parse" ]
          })
  
     (defun from_style_text (text)
        (let 
             ((`semi_reg   (RegExp ";\\n " `g))
              (`colon_reg  (RegExp ": " `g)))
              (no_empties
                (map (fn (x)
                         [(trim x.0) x.1])
                            
                 (map (fn (v)
                       (split_by ":"   (replace colon_reg ":" v)))
                  (flatten 
                      (map (fn (v)
                                 (split_by ";" (replace semi_reg ";" v)))
                         (words_and_quotes text)))))))
              { 
               `usage: ["text:string"]
               `description: "Given a string or text in the format of an Element style attribute: \"css_attrib:value; css_attrib2:value\", split into pairs containing attribute name and value."
               `tags:["text" "css" "style" "pairs" "string" "array" "list" "ui" "html"]
              })
   

    (defun remove_if (f container)
        (reduce (`v container)
            (if (not (f v)) v))
            { `usage: ["f:function" "container:array" ]
              `tags: ["collections" "reduce" "filter" "where" "list" "array" "reduce"]
              `description: "Given a function with a single argument, if that function returns true, the value will excluded from the returned array.  Opposite of filter."})
            

    (defun filter (f container)
        (reduce (`v container)
            (if (f v) v))
        { `usage: ["f:function" "container:array" ]
          `tags: ["collections" "reduce" "reject" "where" "list" "array" "reduce"]
          `description: "Given a function with a single argument, if that function returns true, the value will included in the returned array, otherwise it will not.  Opposite of reject."})


     (defun max_value (v)
        (let 
             ((m  0))
            (check_type v `array "argument is not an array")
            (for_each (`x v)
                      (if (not (isNaN x))
                          (= m (Math.max x m))))
                m)
        { `usage: ["values:list"]
          `description: "Given an array of numbers, returns the largest value found.  Any non-numbers in the array are ignored.  If there are no numbers in the list, 0 is returned."  } )
    
    (defun min_value (v)
        (let 
             ((m  MAX_SAFE_INTEGER))
            (check_type v `array "argument is not an array")
            (for_each (`x v)
                      (if (not (isNaN x))
                          (= m (Math.min x m))))
            (if (== m MAX_SAFE_INTEGER)
                0
                m))
        { `usage: ["values:list"]
          `description: "Given an array of numbers, returns the smallest value found.  Any non-numbers in the array are ignored.  If there are no numbers in the list, 0 is returned."  } )
    
    
    (defglobal system_date_formatter
        (new Intl.DateTimeFormat [] {
          `weekday: "long"
          `year: "numeric",
          `month: "2-digit",
          `day: "2-digit",
          `hour: "numeric",
          `minute: "numeric",
          `second: "numeric",
          `fractionalSecondDigits: 3,
          `hourCycle: "h24"
          `hour12: false,
          `timeZoneName: "short"
        }))

    (defun tzoffset ()
        (* 60 (-> (new Date) `getTimezoneOffset))
        {
             `description: "Returns the number of seconds the local timezone is offset from GMT"
             `usage: []
             `tags: ["time" "date" "timezone"]
        })

     
    (defun date_components (date_value date_formatter)
            (if (is_date? date_value)
                (to_object
                  (map (fn (x)
                         [x.type x.value])
                         (if date_formatter
                             (bind_and_call date_formatter date_formatter `formatToParts date_value)
                             (bind_and_call system_date_formatter system_date_formatter `formatToParts date_value))))
                nil)
              {
               `usage: ["date_value:Date" "date_formatter:DateTimeFormat?"] 
               `description: "Given a date value, returns an object containing a the current time information broken down by time component. Optionally pass a Intl.DateTimeFormat object as a second argument."
               `tags: ["date" "time" "object" "component"]
               })
        
    (defun formatted_date (dval date_formatter)
            (let
                ((`comps (date_components dval date_formatter)))
                (if comps
                    (if date_formatter
                        (join "" (values comps)) 
                        (+ "" comps.year "-" comps.month "-" comps.day " " comps.hour ":" comps.minute ":" comps.second))
                    nil))
                ;(-> dval `toString "yyyy-MM-d HH:mm:ss")
            {
             `usage: ["dval:Date" "date_formatter:DateTimeFormat?"]
             `description: "Given a date object, return a formatted string in the form of: \"yyyy-MM-d HH:mm:ss\".  Optionally pass a Intl.DateTimeFormat object as a second argument."
             `tags:["date" "format" "time" "string"]
             })

         
    (defun add_days (date_obj num_days)
        (do
           (-> date_obj `setDate (+ (-> date_obj `getDate) num_days))
           date_obj)
       {
            `usage: ["date_obj:Date" "num_days:number"]
            `description: "Given a date object and the number of days (either positive or negative) modifies the given date object to the appropriate date value, and returns the date object."  
            `tags: ["date" "time" "duration" "days" "add"]
       })
           
    (defun day_of_week (dval)
        (-> dval `getDay)
        {
         `description: "Given a date object, returns the day of the week for that date object"
         `usage: ["date:Date"]
         `tags: ["time","week" "date" "day"]
         })
    
    (defun add_hours (date_obj hours)
        (do (-> date_obj `setHours hours)
            date_obj)
        {
            `usage: ["date_obj:Date" "hours:number"]
            `description: "Given a date object and the number of hours (either positive or negative) modifies the given date object to the appropriate date value, and returns the date object."  
            `tags: ["date" "time" "duration" "hours" "add"]
       })
    
    (defun clear_time (date_obj)
        (do (-> date_obj `setHours 0 0 0 0)
            date_obj)
        {
            `usage: ["date_obj:Date"]
            `description: "Given a date object, modifies the date object by clearing the time value and leaving the date value.  Returns the date object."  
            `tags: ["date" "time" "duration" "midnight" "add"]
       })
             
    (defun yesterday ()
            (let
                ((`d1 (new Date))
                 (`d2 (new Date)))
                [ (clear_time (add_days d1 -1))
                  (add_hours (clear_time (add_days d2 -1)) 24)])
        {
         `description: "This function returns an array with two Date values.  The first, in index 0, is the start of the prior day (yesterday midnight), and the second is 24 hours later, i.e. midnight from last night."
         `usage: []
         `tags: ["time" "date" "range" "prior" "hours" "24"]
         })
    
    (defun next_sunday (dval)
        (do
            (defvar `dv (or dval (new Date)))
            (clear_time 
                (add_days dv (- 7 
                        (day_of_week dv)))))
        {
         `usage:["date:Date?"]
         `description: "Called with no arguments returns a date representing the upcoming sunday at midnight, 12:00 AM.  If given a date, returns the next sunday from the given date."
         `tags: ["time" "date" "range" "next" "week" "24"]
         })
                     
    (defun last_sunday (dval)
        (do
            (defvar `dv (or dval (new Date)))
            (clear_time 
                (add_days dv (* -1 (day_of_week dv)))))
        {
         `usage:["date:Date?"]
         `description: "Called with no arguments returns a date representing the prior sunday at midnight, 12:00 AM.  If given a date, returns the prior sunday from the given date."
         `tags: ["time" "date" "range" "prior" "week" "24"]
         })
                                 
    
    (defun day_before_yesterday ()
            (let
                ((`d1 (clear_time (add_days (new Date) -2)))
                 (`d2 (clear_time (add_days (new Date) -1))))
                [ d1 d2])
           {
            `description: "This function returns an array with two Date values.  The first, in index 0, is the start of the day before yesterday (midnight), and the second is 24 later."
            `usage: []
            `tags: ["time" "date" "range" "prior" "hours" "24"]
            })
     
    
    
    (defun last_week ()
       (let
            ((`d1 (new Date))
             (`d2 (new Date)))
         
         
            [ (clear_time (add_days (next_sunday)
                               -14))
              (last_sunday)
              ])
       {
        `description: "This function returns an array with two Date values.  The first, in index 0, is the start of the prior week at midnight, and the second is 7 days later, at midnight."
        `usage: []
        `tags: ["time" "date" "range" "prior" "hours" "24"]
        })
    
    (defun midnight-to-midnight (dval)
        (let
            ((`d1 (clear_time (new Date dval)))
             (`d2 (clear_time (new Date dval))))
            [ d1
              (add_hours d2 24)])
   {
    `description: "This function returns an array with two Date values.  The first, in index 0, is the start of the prior day (yesterday midnight), and the second is 24 hours later, i.e. midnight from last night."
    `usage: ["val:Date"]
    `tags: ["time" "date" "range" "prior" "hours" "24"]
    })

    
 (defun date_to_string (date_val str_layout)
    (let
        ((`split_regex (new RegExp "([\\.:\\ T/, \\-]+)" `g)) ;(new RegExp "([\\.:\\- T/,]+)" `g))
         (`comps (or (and (is_string? str_layout)
                         (split_by split_regex str_layout))
                     []))
         (`t_flag nil)
         (`construction [])
         (`t_sep nil)
         (`acc [])
         (`date_comps nil)
         (`formatter nil)
         (`add_formatter (fn (key value)
                             (do
                                 (cond
                                     (== key "fractionalSecondDigits")
                                     (push construction "fractionalSecond")
                                     (== key "hour24")
                                     (do 
                                         (push construction "hour")
                                         (set_prop format_desc
                                                   "hourCycle"
                                                   "h24")
                                         (= key "hour"))
                                     else
                                     (push construction key))
                                 (set_prop format_desc
                                           key
                                           value))))
         (`format_desc (new Object)))
        (for_each (`c comps)
            (cond
                (== c "yyyy")
                (add_formatter "year" "numeric")
                (== c "yy")
                (add_formatter "year" "2-digit")
                (== c "dd")
                (add_formatter "day" "2-digit")
                (== c "d")
                (add_formatter "day" "numeric")
                (== c "MM")
                (add_formatter "month" "2-digit")
                (== c "M")
                (add_formatter "month" "numeric")
                (== c "HH")
                (add_formatter "hour24" "2-digit")
                (== c "H")
                (add_formatter "hour24" "numeric")
                (== c "h")
                (add_formatter "hour" "2-digit")
                (== c "h")
                (add_formatter "hour" "numeric")
                (== c "mm")
                (add_formatter "minute" "2-digit")
                (== c "m")
                (add_formatter "minute" "numeric")
                (== c "s")
                (add_formatter "second" "numeric")
                (== c "ss")
                (add_formatter "second" "2-digit")
                (== c "sss")
                (add_formatter "fractionalSecondDigits" 3)
                (== c "TZ")
                (add_formatter "timeZoneName" `short)
                (== c "D")
                (add_formatter "weekday" `narrow)
                (== c "DD")
                (add_formatter "weekday" `short)
                (== c "DDD")
                (add_formatter "weekday" `long)
                else
                (push construction c)))
       
        (= formatter (new Intl.DateTimeFormat [] format_desc))    
        (= date_comps
           (date_components date_val formatter))
       
       (join ""
            (for_each (`key construction)
                (or (prop date_comps key)   ;; either it is in the date components as a value 
                    key)))) ;; or it is a separator, and so just use the key
        
    {
        `description: (+ "Given a date value and a formatted template string, return a string representation of the date based on the formatted template string."
                         "<br>"
                         "E.g. (date_to_string (new Date) \"yyyy-MM-dd HH:mm:ss\")<br>"
                         "<table>"
                         "<tr><td>" "yyyy" "</td><td>" "Four position formatted year, e.g. 2021"  "</td></tr>"
                         "<tr><td>" "yy" "</td><td>" "Two position formatted year, e.g. 21"  "</td></tr>"
                         "<tr><td>" "dd" "</td><td>" "Two position formatted day of month, e.g. 03"  "</td></tr>"
                         "<tr><td>" "d" "</td><td>"  "1 position numeric day of month, e.g. 3"  "</td></tr>"
                         "<tr><td>" "MM" "</td><td>" "Two position formatted month number, e.g. 06"  "</td></tr>"
                         "<tr><td>" "M" "</td><td>"  "One or two position formatted month number, e.g. 6 or 10"  "</td></tr>"
                         "<tr><td>" "HH" "</td><td>" "Two position formatted 24 hour number, e.g. 08"  "</td></tr>"
                         "<tr><td>" "H" "</td><td>"  "One position formatted 24 hour, e.g 8" "</td></tr>"
                         "<tr><td>" "hh" "</td><td>" "Two position formatted 12 hour clock, e.g. 08"  "</td></tr>"
                         "<tr><td>" "h" "</td><td>"  "One position formatted 12 hour clock, e.g 8" "</td></tr>"
                         "<tr><td>" "mm" "</td><td>"  "Minutes with 2 position width, eg. 05" "</td></tr>"
                         "<tr><td>" "m" "</td><td>"  "Minutes with 1 or 2 positions, e.g 5 or 15." "</td></tr>"
                         "<tr><td>" "ss" "</td><td>"  "Seconds with 2 positions, e.g 03 or 25." "</td></tr>"
                         "<tr><td>" "s" "</td><td>"  "Seconds with 1 or 2 positions, e.g 3 or 25." "</td></tr>"
                         "<tr><td>" "sss" "</td><td>"  "Milliseconds with 3 digits, such as 092 or 562." "</td></tr>"
                         "<tr><td>" "TZ" "</td><td>"  "Include timezone abbreviated, e.g. GMT+1." "</td></tr>"
                         "<tr><td>" "D" "</td><td>"  "Weekday abbreviated to 1 position, such as T for Tuesday or Thursday, or W for Wednesday (in certain locales)" "</td></tr>"
                         "<tr><td>" "DD" "</td><td>"  "Weekday shortened to 3 positions, such as Fri for Friday." "</td></tr>"
                         "<tr><td>" "DDD" "</td><td>"  "Full name of weekday, such as Saturday." "</td></tr>"
                         "</table>")
        `usage: ["date_val:Date" "formatted_string:string"]
        `tags: [`time `date `string `text `format `formatted]
                             
    })
       
    
    
    
    (defun is_even? (x)
       (== 0 (% x 2))
       {
        "usage":["value:number"]
        "description": "If the argument passed is an even number, return true, else returns false."
        "tags":["list" "filter" "modulus" "odd" "number"]
        })
        
   (defun is_odd? (x)
       (== 1 (% x 2))
       {
        "usage":["value:number"]
        "description": "If the argument passed is an odd number, return true, else returns false."
        "tags":["list" "filter" "modulus" "even" "number"]
        })
   

    (defun set_path_value (root path value)
        (if (is_array? path)
            (let 
              ((idx (last path))
               (parent (resolve_path (chop path) root)))
               (if parent
                   (set_prop parent idx value))
               parent)
            (do 
                root))
    {`description: "Given an object (the root), a path array, and a value to set, sets the value at the path point in the root object."
     `usage:["root:object" "path:list" "value:*"]
     `tags:["object" "path" "resolve" "assign" ]
     })
              
              
    (defun has_items? (value)
       (if (and (not (== nil value)) (> (length value) 0))
           true
           false)
       {
        "usage":["value:list"]
        "description":"Returns true if the list provided has a length greater than one, or false if the list is 0 or nil"
        "tags":["list" "values" "contains" ]
        })
    
    
    
    (defglobal match_all_js 
        (jslambda (`regex_str `search_string)
          "let rval=[];let regex=new RegExp(regex_str,'g'); while ((m = regex.exec(search_string)) !== null) {rval.push(m);  if (m.index === regex.lastIndex) {  regex.lastIndex++; }  } return rval;" ))

    (defun match_all (regex_str search_string)
        (match_all_js regex_str search_string)
        {
         `usage:["regex_str:string" "search_string:string"]
         `description:"Given a regex expression as a string, and the string to search through, returns all matched items via matchAll."
         `tags:["match" "regex" "string" "find" "scan"]
         })

    ;(defun `index_of (`search_value `container)
    ;       (_.indexOf container search_value)
     ;      {
      ;      "usage":["search_value:string","container:list"]
       ;     "description":"Returns the index at which value can be found in the list, or -1 if the value isn't present in the provided list."
        ;    })
    
   
         
    (defun chop_front (container amount)
        (let 
            ((amount (or amount 1)))
            (cond 
                  (is_string? container)
                    (-> container `substr amount)
                  (is_array? container)
                    (-> container `slice amount )
                  else 
                    (throw Error "chop: container must be a string or array")
                ))
            {
             `usage: ["container:array|string","amount:integer"]
             `mutates: false
             `tags: ["text" "string" "list" "reduce"]
             `description: "Given a string or array, returns a new container with the first value removed from the provided container.  An optional amount can be provided to remove more than one value from the container."
             })

    
    
    (if_compile_time_defined `client
      (if client.logc
       (defglobal log client.logc)))
    
    ;; TODO: rename to read_lisp
    (defun compile_lisp (text)
        (if text
            (reader text)
           text) 
          {"usage":["text:string"]
           "description":"Given an input string of lisp text, returns a JSON structure ready for evaluation." })
    
 
    
    (defun has_the_keys? (key_list obj)
        (let 
            ((`is_fit   true))
            (do 
                (for_each (`item key_list)
                 (setq is_fit (and (or (resolve_path item obj) false) is_fit)))
                is_fit))
            {
             "usage":["key_list:list" "object_to_check:object"]
             "description":"Given a provided key_list, validate that each listed key or dotted-path-notation value exist in the object."
             "example":[
                        [`(has_the_keys? ["type" "values.sub_transaction_id" ] { `type: "Transaction" `group: "Receivables" `values:{ `sub_transaction_id: 1242424 } } ) true ]]
             })
    
    


   (defun demarked_number (value separator precision no_show_sign)
        (let 
            ((abs_value (Math.abs value))
             (vf (Math.floor abs_value))
             (comps (reverse (split (+ "" vf) "")))
             (l (length comps))
             (sep (or separator ","))
             (prec (or (if (eq nil precision) 2) precision)) ;; default precision of 2
             (sign  (if (and (< value 0) (not no_show_sign)) "-" "")))
            
            (if (> l 3)
                (for_each (`p (reverse (range 3 l 3)))
                        (-> comps `splice p 0 sep)))
                    
            (+ sign (join "" (reverse comps)) (chop_front (-> (% abs_value vf) `toFixed prec))))
        
        { `usage:["value:number" "separator:string" "precision:number" "no_show_sign:boolean"]
            `description: (+ "Given a numeric value, a separator string, such as \",\" and a precision value " 
                             "for the fractional-part or mantissa of the value, the demarked_number function will return a string with a formatted value. "
                             "Default value for precision is 2 if not provided."
                             "If no_show_sign is true, there will be no negative sign returned, which can be useful for alternative formatting.  See compile_format.")
            `tags: ["format" "conversion" "currency"]})
 
    (defmacro measure_time (`& forms)
        `(let 
            ((end nil)
             (rval nil)
             (start (time_in_millis)))
           (= rval
              (do
                 ,@forms))
        {
         `time: (- (time_in_millis) start) 
         `result:   rval 
         })
            { `usage: ["form:list"]
             `tags: ["time" "measurement" "debug" "timing"]
             `description: "Given a form as input, returns an object containing time taken to evaluate the form in milliseconds with the key time and a result key with the evaluation results." } )
        
   (defun compare_list_ends (l1 l2)
        (let 
             ((long_short (if (> (length l1) (length l2))
                            (list l1 l2)
                            (list l2 l1)))
              (long       (reverse long_short.0))
              (short      (reverse long_short.1))
              (match_count 
                          0)
              (idx        0)
              (matcher   (fn (val)
                             (do 
                                 (if (== val (prop long idx))
                                       (inc match_count))
                                 (= idx (+ idx 1))))))
                
            (map matcher short)
            (if (== match_count (length short))
                true
                false))
            { `usage: ["array1:array","array2:array"]
              `tags: ["comparision" "values" "list" "array" ]
              `description: "Compares the ends of the provided flat arrays, where the shortest list must match completely the tail end of the longer list. Returns true if the comparison matches, false if they don't."
             } )
         

    ; -- Color Format Conversions ----------

       (defglobal hsv_to_rgb 
        (new Function "h" "s" "v" "{
        var r, g, b, i, f, p, q, t;
        if (arguments.length === 1) {
            s = h.s, v = h.v, h = h.h;
        }
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return {
            r: r,
            g: g,
            b: b
        }
    }")
      {  `usage: ["hsv_values:array"]
         `description: (+ "Takes an array with three values corresponding to hue, saturation and brightness. " 
                          "Each value should be between 0 and 1.  "
                          "The function returns an array with three values corresponding to red, green and blue.")
         `tags: ["colors" "graphics" "rgb" "conversion"]
        })
   
    (defun rgb_to_text (rgb)
        (join ""
          (for_each (`v rgb)
            (do 
              (defvar vs (-> (Math.round (* v 255)) `toString 16))
              (if (== (length vs) 1)
                  (+ "0" vs)
                  vs))))
        {`usage:      ["rgb_values:array"]
         `description: (+ "Given an array with 3 values ranging from 0 to 1, corresponding to the \"red\",\"green\",\"blue\" values of the described color, ", 
                          "the function returns a string in the form of FFFFFF.")
         `tags: ["colors" "graphics"]
        })

    
    (defun text_to_rgb (rgb_string)
        (if rgb_string 
            ((/ (parseInt (join (nth [0 1] rgb_string)) 16) 255)
             (/ (parseInt (join (nth [2 3] rgb_string)) 16) 255)
             (/ (parseInt (join (nth [4 5] rgb_string)) 16) 255))
            nil)
         {`usage: ["rgb_string:string"]
          `description:"Given an RGB hex color string in the form of \"FFFFFF\", returns an array containing [ red green blue ] in the set [ 0 1 ]."
          `tags: ["colors" "graphics"]
         })

    (defun rgb_to_hsv (rgb)
        (if rgb
            (let 
                 ((computedH 0)
                  (computedS 0)
                  (computedV 0)
                  (r         rgb.0)
                  (g         rgb.1)
                  (b         rgb.2)
                  (minRGB    (Math.min r (Math.min g b)))
                  (maxRGB    (Math.max r (Math.max g b)))
                  (d         nil)
                  (h         nil))
                    (if (== minRGB maxRGB)
                        (return [ 0 0 minRGB ]))
                    (= d (cond 
                            (== r minRGB)
                               (- g b)
                            (== b minRGB)
                                (- r g)
                            else 
                                (- b r)))
                    (= h (cond 
                            (== r minRGB)
                                3
                            (== b minRGB)
                                1
                            else 
                                5))
                    (console.log "")
                    (= computedH (/ (* 60 (- h (/ d(- maxRGB minRGB)))) 360 ))
                    (= computedS (/ (- maxRGB minRGB) maxRGB))
                    (= computedV maxRGB)
                    [ computedH computedS computedV ]))
                 { `description: (+ "Takes an array with three values corresponding to red, green and blue: [red green blue]." 
                                    "Each value should be between 0 and 1 (i.e the set [0 1]) "
                                    "The function returns an array with three values corresponding to [hue saturation value] in the set [0 1].")
                   `usage: ["rgb_values:array"]
                   `tags: ["colors" "graphics" "rgb" "conversion" "hsv"] })
    
    (defun tint_rgb (rgb tint_factor)
        (if (and rgb tint_factor)
                (for_each (`c rgb)
                    (do 
                        (= c (* 255 c))
                        (/ (+ c 
                              (* (- 255 c )
                                 tint_factor))
                            255)))
            rgb)
        { `description: (+ "Given an array containing three values between 0 and 1 corresponding to red, " 
                           "green and blue, apply the provided tint factor to the color and return the result as an rgb array."
                           "The provided tint factor should be in the range 0 (for no tint) to 1 (full tint).")
          `usage: ["rgb_value:array" "tint_factor:number"]
          `tags: ["colors" "graphics"]
        } )


    (defun shade_rgb (rgb shade_factor)
        (if (and rgb shade_factor)
            (for_each (`c rgb)
                (do 
                    (= c (* 255 c))
                    (/ (* c 
                          (- 1 shade_factor))
                        255)))
            rgb)
        { `description: (+ "Given an array containing three values between 0 and 1 corresponding to red, " 
                           "green and blue, apply the provided tint factor to the color and return the result as an rgb array."
                           "The provided tint factor should be in the range 0 (for no tint) to 1 (full tint).")
          `usage: ["rgb_value:array" "tint_factor:number"]
          `tags: ["colors" "graphics"] 
        } )
    
    (defun modify_color_ts (rgb factor)
        (if (<= 0 factor)
            (tint_rgb rgb (Math.abs factor))
            (shade_rgb rgb (Math.abs factor)))
        { `description: (+ "Given an array containing three values between 0 and 1 corresponding to red, " 
                           "green and blue, apply the provided factor to the color and return the result as an rgb array."
                           "The provided factor should be in the range -1 to 1: -1 to 0 applies shade to the color and 0 to 1 applies tinting to the color.")
          `usage: ["rgb_value:array" "tint_factor:number"]
          `tags: ["colors" "graphics"] 
        }) 

   (defun is_lower? (v)
      (do
        (defvar `c (-> v `charCodeAt 0))
        (and (> c 96) (< c 123)))
    { 
     `usage: ["value:string"]
     `description: "Given a string as an argument, returns true if the first character of the string is a lowercase character value (ASCII), and false otherwise."
     `tags: [`text `string `lowercase `uppercase]
    })

    (defun is_upper? (v)
        (do
            (defvar `c (-> v `charCodeAt 0))
            (and (> c 64) (< c 91)))
        { 
         `usage: ["value:string"]
         `description: "Given a string as an argument, returns true if the first character of the string is an uppercase character value (ASCII), and false otherwise."
         `tags: [`text `string `lowercase `uppercase]
        })
    
  (defun camel_case_to_lower (val)
        (do
         (defvar `last_upper 0)
         (join "" 
          (map (fn (v i)
               (cond
                   (and (> i 0) (is_upper? v) (== 0 last_upper))
                     (do 
                         (= last_upper 1)
                         (+ "_" (lowercase v)))
                   (and (> i 0) (is_upper? v) (> last_upper 0))
                     (do 
                         (= last_upper 2)
                         (lowercase v))
                   (and (== i 0) (is_upper? v))
                        (lowercase v)
                   (is_lower? v)
                     (do 
                        (cond (== last_upper 2)
                            (do 
                               (= last_upper 0)      
                               (+ "_" (lowercase v)))
                            else
                           (do 
                               (= last_upper 0)
                               (lowercase v))))
                  else 
                    (do 
                        (= last_upper 0)
                        v)) ; something else
                  )
            (split val ""))))
        {`usage: []
         `description: "Given a camel case string such as camelCase, returns the equivalent lowercase/underscore: camel_case."
         `tags:[`text `string `conversion `lowercase `uppercase]
        })
    
  (defun scan_list (regex container)
      (do 
        (defvar expr regex)
        (when (not (== (sub_type regex) "RegExp"))
              (= expr (new RegExp regex)))
        (defvar cnt 0)
        (defvar results [])
        (defvar r nil)
        (for_each (item (or container []))
            (do
                (= r 
                   (if (is_string? item)
                    (-> item `match expr)
                    (-> (+ "" item) `match expr)))
                (if r (push results cnt))
                (inc cnt)))
           results)
       { `description: (+ "Scans a list for the provided regex expression and returns the indexes in the list where it is found.  "
                          "The provided regex expression can be a plain string or a RegExp object.") 
         `usage: ["regex:string" "container:list"]
         `tags: ["search" "index" "list" "regex" "array" "string"]
       })
  
    (defglobal *LANGUAGE* {})

    (defun dtext (default_text)
        (or
          (prop *LANGUAGE* default_text)
          default_text)
       { `usage: ["text:string" "key:string?"]
         `description: (+ "Given a default text string and an optional key, if a key "  
                          "exists in the global object *LANGUAGE*, return the text associated with the key. "
                          "If no key is provided, attempts to find the default text as a key in the *LANGUAGE* object. "
                          "If that is a nil entry, returns the default text.")
         `tags: ["text" "multi-lingual" "language" "translation" "translate"]
        })
    
    (defun gather_up_prop (key values)
       (cond 
         (is_array? values)
            (no_empties
                (map
                    (fn (v)
                        (cond (is_array? v)
                              (gather_up_prop key v)
                              (is_object? v)
                              (prop v key)
                              ))
                    values))
         (is_object? values)
         (prop values key))
    { 
     `usage: ["key:string" "values:array|object"]
     `description: "Given a key and an object or array of objects, return all the values associated with the provided key."
     `tags: ["key" "property" "objects" "iteration"]
     })

(defun sum_up_prop (key values)
       (sum
           (flatten (gather_up_prop key values)))
    { 
     `usage: ["key:string" "values:array|object"]
     `description: "Given a key and an object or array of objects, return the total sum amount of the given key."
     `tags: ["sum" "key" "property" "objects" "iteration"]
     })
   
 (defun scan_for (non_nil_prop list_of_objects)
    (do 
        (defvar rval nil)
        (for_each (val (or list_of_objects []))
            (when (and val
                       (prop val non_nil_prop))
                (= rval (prop val non_nil_prop))
                (break)))
        rval)
    {
     `description: "Given a property name and a list of objects, find the first object with the non-nil property value specified by non_nil_prop. Returns the value of the non-nil property."
     `usage: ["non_nil_prop:string" "list_of_objects:array"]
     `tags: ["find" "scan" "object" "list" "array" "value"]
     })
 
 (defun make_sort_buckets ()
  (let
      ((buckets (new Object))
       (push_to (fn (category thing)
                     (let
                         ((`place nil))
                     (if (eq nil category)
                         buckets
                         (do
                             (= place (prop buckets category))
                             (if place
                                (push place thing)
                                (set_prop buckets
                                          category
                                          [ thing ]))
                             thing))))))
      push_to)
  {
      `usage: []
      `description: (+ "Called with no arguments, this function returns a function that when called with a "
                       "category and a value, will store that value under the category name in an array, "
                       "which acts as an accumulator of items for that category.  In this mode, the function "
                       "returns the passed item to be stored.<br><br>"
                       "When the returned function is called with no arguments, the function returns the "
                       "object containing all passed categories as its keys, with the values being the accumulated"
                       "items passed in previous calls.")
      `tags: ["objects" "accumulator" "values" "sorting" "categorize" "categorization" "buckets"]
  })
 
 
 
 (defglobal bytes_from_int_16
    (jslambda (`x)
             "{ let bytes = []; let i = 2; do { bytes[(1 - --i)] = x & (255); x = x>>8; } while ( i ) return bytes;}" ))
         

(defglobal int_16_from_bytes
    (jslambda (`x `y)
              " { let val = 0;  val +=y; val = val << 8; val +=x; return val; }"))

(defun truncate (len value trailer)
    (let
      ((trailer  (or trailer "")))
     (cond
       (is_string? value)
       (if (> value.length len)
           (+ (-> value `substr 0 len) trailer)
           value)
       (is_array? value)
       (-> value `slice 0 len)
       else
       value))
    {
     `description: (+ "Given a length and a string or an array, return the value "
                      "with a length no more than then the provided value. If "
                      "the value is a string an optional trailer string can be "
                      "provided that will be appeneded to the truncated string.")
     `usage: ["len:number" "value:array|string" "trailer:string?"]
     `tags: ["array" "string" "length" "max" "min"]})

(defun uniq (values handle_complex_types)
     (let
         ((s (new Set)))
         (if handle_complex_types
             (do
                 (map (fn (x)
                      (-> s `add (JSON.stringify x)))
                  (or values
                      []))
                 
                 (map (fn (x)
                          (JSON.parse x))
                          (to_array s)))
             (do 
                 (map (fn (x)
                      (-> s `add x))
                      (or values
                          []))
                (to_array s))))
    { `description: (+ "Given a list of values, returns a new list with unique, deduplicated values. "
                       "If the values list contains complex types such as objects or arrays, set the "
                       "handle_complex_types argument to true so they are handled appropriately. ")
      `usage: ["values:list" "handle_complex_types:boolean"]
      `tags: ["list" "dedup" "duplicates" "unique" "values"] })
 

  
 
(defun parse_csv (csv_data options)
    (let 
         ((lbuffer nil)
          (sepval  (or options.separator
                                ","))
          (sepval_r (new RegExp sepval `g))
          (fixer_r  (new RegExp "!SEPVAL!" `g))
          (interruptions  (or options.interruptions
                               false))
          (line nil)
          (count 0)
          (tmp nil)
          (rval   nil)
          (match_list nil)
          (lines  (cond 
                       (is_array? csv_data)
                       csv_data
                       (is_string? csv_data)
                       (split_by "\n" (replace (new RegExp "[\r]+" `g) "" csv_data)))
                       else
                       [])
          (total_lines
                   lines.length))
        (if interruptions
            (sleep 0.1))
        (for_each (`v lines)
            (do  
              (when interruptions
                    (inc count)
                    (when (== (% count 1000) 0)
                          (sleep 0.1)
                          (if options.notifier 
                              (options.notifier (/ count total_lines) count total_lines))))
                          ; go to the back of the even queue
              (= match_list (reverse (scan_str (new RegExp "\"([A-Za-z0-9, \.  :;]+)\"" `g ) v)))
              (= line
                      (if (> match_list.length 0)
                          (do
                              (= rval [])
                              (for_each (`m match_list)
                                (do 
                                    (push rval [m.index (replace sepval_r "!SEPVAL!" (prop m "1")) (prop m "1")  ])
                                                  )  )
                              (= tmp v)
                              (for_each (`r rval)
                                  (do 
                                      
                                      (= tmp (+ "" (-> tmp `substr 0 r.0)
                                                r.1
                                                (-> tmp `substr (+ 2 r.0
                                                                    (length r.2)))))))
                                    
                              tmp    
                              )
                            v))
              
              (for_each (`segment (split_by sepval line))
                 (replace fixer_r sepval segment)))
            ))
    {`description: (+ "Given a text file of CSV data and an optional options value, parse and return a JSON structure of the CSV data as nested arrays."
                      "<br>"
                      "Options can contain the following values:<br>"
                      "<table><tr><td>separator</td><td>A text value for the separator to use.  "  
                      "The default is a comma.</td></tr><tr><td>interruptions</td><td>If set to true, "  
                      "will pause regularly during processing for 1/10th of a second to allow other event queue activities to occur.</td>" 
                      "</tr><tr><td>notifier</td><td>If interruptions is true, notifier will be triggered with " 
                      "the progress of work as a percentage of completion (0 - 1), the current count and the total rows.</td></tr></table>")
                        
                            
     `usage: ["csv_data:string" "options:object?"]
     `tags:["parse" "list" "values" "table" "tabular" "csv" ]
     
     })
   
    
(defun to_csv (`rows delimiter)
  (do
    (defvar quote_quoter (new RegExp "\"" `g))
    (join "\n"
       (for_each (`row rows)
           (join (if delimiter
                     delimiter
                     ",") 
                 (map (fn (v)
                       (if (and (is_string? v)
                                (or (contains? " " (+ "" v ""))
                                    (contains? delimiter v) 
                                    (contains? "\"" v)))
                            (+ "\""  (replace quote_quoter "\"\"" v) "\"")
                            (+ "" v "")))
                            row)))))
    {
     `description: (+ "Given a list of rows, which are expected to be lists themselves, " 
                      "join the contents of the rows together via , and then join the rows " 
                      "together into a csv buffer using a newline, then returned as a string.")
     `usage: ["rows:list" "delimiter:string"]
     `tags: ["csv" "values" "report" "comma" "serialize" "list"]
     })
 


            
 (defun squeeze (s)
    (replace (new RegExp " " `g) "" s)
    {
     `usage: ["string_value:string"]
     `description: "Returns a string that has all spaces removed from the supplied string value."
     `tags: ["text" "space" "trim" "remove"]
     })
 
 (defun ensure_keys (keylist obj default_value)
    (let
       ((default_value (if (== undefined default_value) nil default_value)))
      (when (eq nil obj)
         (= obj (new Object)))
      (for_each (`key keylist)
         (when (== undefined (prop obj key))
           (set_prop obj
                      key
                      default_value)))
        obj)
    {
     `description: (+ "Given a list of key values, an object (or nil) and an optional default value to be " 
                      "assigned each key, ensures that the object returned has the specified keys (if not already set) set to either "
                      "the specified default value, or nil.")
     `usage: ["keylist" "obj:object" "default_value:*?"]
     `tags: [`object `keys `values `required `key ]
     })
 
 
 (defglobal show_time_in_words (new Function "seconds" "options" 
            "options=options||{}\n        if (options['longForm']==null) {\n            if (seconds<2) return \"now\";\n            if (seconds<61) return parseInt(seconds)+\" secs\";\n            if ((seconds>61)&&(seconds<120)) return \"1 min\";\n            if (seconds<3601) {\n                // less than an hour\n                return parseInt(seconds/60)+\" mins\";\n            }\n        } else if (options['longForm']==true) {\n            if (seconds<61) return parseInt(seconds)+\" seconds\";\n            if ((seconds>61)&&(seconds<120)) return \"1 minute\";\n            if (seconds<3601) {\n                // less than an hour\n                return parseInt(seconds / 60) + \" minutes\";\n            }\n        }\n\n        if (seconds<86400) {\n            return parseInt(seconds/3600)+\" hours\";\n        }\n        if (seconds<172801) {\n            return parseInt(seconds/86400)+\" day\";\n        }\n        if (seconds < 31536000) {\n            return parseInt(seconds/86400)+\" days\";\n        }\n        if (seconds < (2 * 31536000)) {\n            return \"1 year\";\n        }\n        return parseInt(seconds/31536000)+\" years\";\n ")
        {
           `description: (+ "Given an integer value representing seconds of a time duration, return a string " 
                            "representing the time in words, such as 2 mins.  If the key longForm is set to " 
                            "true in options return full words instead of contracted forms.  For example min vs. minute.")
           `usage: ["seconds:integer" "options:object"]
           `tags: ["time" "date" "format" "string" "elapsed"]
         })
 
 (defun ago (dval)
        (show_time_in_words (/ (- (-> (new Date) `getTime) (-> dval `getTime)) 1000))
        {
         `usage: ["dval:Date"]
         `description: "Given a date object, return a formatted string in English with the amount of time elapsed from the provided date."
         `tags:["date" "format" "time" "string" "elapsed"]
         })
     
 (defun lifespan (dval)
        (show_time_in_words (/ (- (-> dval `getTime) (-> (new Date) `getTime)) 1000))
        {
         `usage: ["dval:Date"]
         `description: "Given a date object, return a formatted string in English with the amount of time until the specified date."
         `tags:["date" "format" "time" "string" "elapsed"]
         })

  (defun show (thing)
    (cond
      (is_function? thing)
      (-> thing `toString)
      else
      thing)
    { `usage: ["thing:function"]
    `description: "Given a name to a compiled function, returns the source of the compiled function.  Otherwise just returns the passed argument."
    `tags:["compile" "source" "javascript" "js" "display" ]
    
    })

 

  
    true
)




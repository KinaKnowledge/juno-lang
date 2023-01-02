(declare (namespace `core))

(if_compile_time_defined `document
   ;; In the browser
   (progn
      (defun save_locally (fname data content_type)
         (if (prop window `document)
             (let
                ((blob (new Blob [ data ] { type: content_type }))
                 (elem (-> window.document `createElement `a)))
                (set_prop elem
                   `href
                   (-> window.URL `createObjectURL blob)
                   `download
                   fname)
                (-> document.body `appendChild elem)
                (-> elem `click)
                (-> document.body `removeChild elem)
                true)
             false)
         {
           `description: (+ "Provided a filename, a data buffer, and a MIME type, such as \"text/javascript\", "
                            "triggers a browser download of the provided data with the filename.  Depending "
                            "on the browser configuration, the data will be saved to the configured "
                            "user download directory, or prompt the user for a save location. ")
           `usage: [ "filename:string" "data:*" "content_type:string" ]
           `tags: [ "save" "download" "browser" ]
           })
      (defun write_text_file (fname data content_type)
         (save_locally fname data (or content_type "text/plain")))
      true)
   nil)

(if_compile_time_defined `Deno
   (progn
      (import (path) "https://deno.land/std@0.110.0/path/mod.ts")
      (map register_feature ["io" "Deno"])
      (defbinding
         (read_text_file (Deno.readTextFile Deno)
                         {
                           `description: (+ "Given an accessible filename including "
                                            "path with read permissions returns the file contents as a string.")
                           `usage:["filename:string" "options:object" ]
                           `tags:["file" "read" "text" "input" "io"]
                           })
         
         
         (write_text_file (Deno.writeTextFile Deno)
                          {
                            `description: (+ "Given a string path to a filename, an argument containing "
                                             "the string of text to be written, and an optional options argument "
                                             "write the file to the filesystem.<br><br>."
                                             "The WriteFileOptions corresponds to the Deno WriteFileOptions interface")
                            `usage:["filepath:string" "textdata:string" "options:WriteFileOptions"]
                            `tags:[ `file `write `io `text `string ]
                            }))
      
      (defun load (filename)
         (let
            ((fname filename)
             (js_mod nil)
             (comps (path.parse fname)))
            
            (cond
               (== comps.ext ".lisp")
               (evaluate (read_text_file fname) nil { `source_name: fname })
               (== comps.ext ".js")
               (progn
                  (= js_mod (dynamic_import fname))
                  (if js_mod.initializer
                     (js_mod.initializer Environment)
                     (throw EvalError "load: unable to find function named initializer in export, use dynamic_import for this.")))
               (== comps.ext ".json")
               (evaluate (JSON.parse (read_text_file fname)) nil { `json_in: true `source_name: fname })))
         { `description: (+ "Compile and load the contents of the specified lisp filename (including path) into the Lisp environment. "
                            "The file contents are expected to be Lisp source code in text format.")
                        `tags: [`compile `read `io `file ]
                        `usage: ["filename:string"]
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
      
      true))


(if_compile_time_defined
 `Deno
  (iprogn
   (defglobal read_text_file
       (bind Deno.readTextFile Deno)
       {
       `description: (+ "Given an accessible filename including " 
			"path with read permissions returns the file contents as a string.")
       `usage:["filename:string" "options:object" ]
       `tags:["file" "read" "text" "input" "io"]
       })
   
     (defmacro load (filename)       
	 `(evaluate (read_text_file ,#filename))
       { `description: (+ "Compile and load the contents of the specified lisp filename (including path) into the Lisp environment. "
			  "The file contents are expected to be Lisp source code in text format.")
       `tags: [`compile `read `io `file ]
       `usage: ["filename:string"] 
       })
   
   (defglobal write_text_file
       (bind Deno.writeTextFile Deno)
       {
       `description: (+ "Given a string path to a filename, an argument containing "
			"the string of text to be written, and an optional options argument "
			"write the file to the filesystem.<br><br>."
			"The WriteFileOptions corresponds to the Deno WriteFileOptions interface")
       `usage:["filepath:string" "textdata:string" "options:WriteFileOptions"]
       `tags:[ `file `write `io `text `string ]
       })

   
   
   

   )
    false) ;; end compile time define

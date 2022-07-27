(declare (namespace "core"))
(set_namespace "core")
(when (contains? "tests" (namespaces))
  (delete_namespace "tests"))
(defglobal *core_symbols* (core/symbols))
(when (not (contains? "io" *env_config*.features))
  (import "src/io.lisp"))
(set_path [ `export `default_namespace ] *env_config* "user")
(defglobal core/*env_skeleton*  (reader (read_text_file "./src/environment.lisp")))
(progn
  (defvar no_includes (reduce (`sym (core/symbols))
			      (if (not (contains? sym *core_symbols*))
				  sym
				nil)))
  (setq no_includes
	(conj no_includes
	      ["repl" "Deno" "read_text_file" "path" "readline" "readline_mod" "streams"]))
  (console.log "NOT INCLUDING: ")
  (console.table (sort no_includes))
  (core/save_env { save_as: "js/juno_browser.js"
		   do_not_include: no_includes }))
		   

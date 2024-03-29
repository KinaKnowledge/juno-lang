(declare (namespace "core"))
(set_namespace "core")
(when (contains? "tests" (namespaces))
  (delete_namespace "tests"))
(when (not (contains? "io" *env_config*.features))
  (import "src/base-io.lisp"))
(when (not (contains? "build-tools" *env_config*.features))
  (import "src/build-tools.lisp"))

(set_path [ `export `default_namespace ] *env_config* "user")
(defglobal core/*env_skeleton*  (reader (read_text_file "./src/environment.lisp")))

(defun core/*initializer* () (progn (repl nil nil { `use_console: true })))
(core/save_env)

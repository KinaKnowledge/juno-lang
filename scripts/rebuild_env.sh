#!/usr/bin/env bash

cat <<EOI | lib/juno
(import "src/base-io.lisp")
(import "src/build-tools.lisp")
(rebuild_env)
EOI

cat <<EOI | lib/juno
(import "src/base-io.lisp")
(import "src/build-tools.lisp")
(import "working/save_env.lisp")
EOI

echo "verifying juno.js"
cat <<EOI | lib/juno js/juno
  *env_config*
EOI


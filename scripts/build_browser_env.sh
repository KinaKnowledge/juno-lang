#!/usr/bin/env bash

cat <<EOI | lib/juno
(import "src/core-ext.lisp")
(import "pkg/save_browser_env.juno")
EOI

#!/usr/bin/env bash
# Seedling Environment Build 
# (c) 2023 Kina
# MIT License

cat <<EOI | lib/juno
(import "src/core-ext.lisp")
(import "pkg/save_browser_env.juno")
EOI


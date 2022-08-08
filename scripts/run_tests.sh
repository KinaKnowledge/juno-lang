#!/usr/bin/env bash

echo "Running compiler tests.."
cat <<EOI | lib/juno
(import "src/base-io.lisp")
(import "tests/package.juno")
(tests/report_tests)
EOI


#!/usr/bin/env pwsh
# Seedling Environment Build for Powershell
# (c) 2023 Kina
# MIT License

echo '(import "src/core-ext.lisp")' | Out-File ${Home}/.temp-lisp
echo '(import "pkg/save_browser_env.juno")' | Out-File ${Home}/.temp-lisp -Append
Get-Content "${Home}/.temp-lisp" | & deno run --allow-all js/juno.js

$RCODE=$LASTEXITCODE

# clean up

if (Test-Path -Path "${Home}/.temp-lisp" -PathType Leaf) {
   Remove-Item -Path "${Home}/.temp-lisp"    
}

exit $RCODE


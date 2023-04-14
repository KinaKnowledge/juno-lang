#!/usr/bin/env pwsh
# Juno Environment Build for PowerShell
# (c) 2023 Kina
# MIT License


if ($Env:OS -ne "Windows_NT") {
    Write-Output "Juno Rebuild Environment - Use scripts/rebuild_env.sh on Unix-like systems."
    exit 1
}


if (Test-Path -Path "BUILD_DATE.txt" -PathType Leaf) {
    Remove-Item -Path "BUILD_DATE.txt"
}


# Rebuild the core environment
echo '(import "src/base-io.lisp")' | Out-File ${Home}/.temp-lisp
echo '(import "src/build-tools.lisp")' | Out-File ${Home}/.temp-lisp -Append
echo '(rebuild_env)' | Out-File ${Home}/.temp-lisp -Append
Get-Content "${Home}/.temp-lisp" | & deno run --allow-all js/startup_deno.js

# Run Tests
echo '(import "src/base-io.lisp")' | Out-File ${Home}/.temp-lisp
echo '(import "tests/package.juno")' | Out-File ${Home}/.temp-lisp -Append
echo '(tests/report_tests)' | Out-File ${Home}/.temp-lisp -Append
Get-Content "${Home}/.temp-lisp" | & deno run --allow-all js/startup_deno.js

# Build Binary Version for the Architecture
echo '(try (progn (declare (function save_environment) (global save_environment)) (import "src/base-io.lisp") (import "src/build-tools.lisp") (import "src/core-ext.lisp") (import "pkg/server_env.juno") (import "pkg/lz-string.juno")  (import "pkg/sys.juno")  (import "pkg/save_env.juno") (log "loaded: " (namespaces) *env_config*) (save_environment { compile: true emit_as: "bin/build.tmp" } ) (exit 0)) (catch Error (e) (progn (console.error e) (exit 1))))'|Out-File ${Home}/.temp-lisp
Get-Content "${Home}/.temp-lisp" | & deno run --allow-all js/startup_deno.js

if ($LASTEXITCODE -gt 0) {
    echo "Build failed.  Stopping."
    exit 1
} 


# write the build date 
echo '*env_config*' | Out-File ${Home}/.temp-lisp
echo '(write_text_file "./BUILD_DATE.txt" (prop *env_config* "build"))' | Out-File ${Home}/.temp-lisp -Append
Get-Content "${Home}/.temp-lisp" | & deno run --allow-all js/juno.js



if ($Env:OS -eq "Windows_NT") {
    $SYSTEM="windows"
    if ((Get-CimInstance Win32_operatingsystem).OSArchitecture -eq "64-bit") {
        $MACHINE="x86_64"
    } else {
        $MACHINE="x86"
    }
} else {
    $SYSTEM=(uname -s|tr '[:upper:]' '[:lower:]')
    $MACHINE=(uname -m|tr '[:upper:]' '[:lower:]')
}

# Clean up our temp
if (Test-Path -Path "${Home}/.temp-lisp" -PathType Leaf) {
   Remove-Item -Path "${Home}/.temp-lisp"    
}


# Finish up and write the correct binary name

$BINNAME="bin/juno.$MACHINE.$SYSTEM.exe"
Write-Output ""
Write-Output "Binary name is to be: $BINNAME"

if (Test-Path -Path "BUILD_DATE.txt" -PathType Leaf) {
    if (Test-Path -Path "bin/build.tmp.exe") {
        Move-Item -Path "bin/build.tmp.exe" -Destination $BINNAME
        if ($LASTEXITCODE -eq 0) {
            Write-Output "Completed - binary at: $BINNAME"
        } else {
            Write-Output "Error: Could not create the file: $BINAME.  Build incomplete."
            exit 1
        }
    } else {
         Write-Output "Error: The final binary file wan't found. Build incomplete."
         exit 1
    }
} else {
    Write-Output "Error: cannot find the BUILD_DATE.txt file - this indicates a build issue.  Build incomplete."
    exit 1
}

exit 0



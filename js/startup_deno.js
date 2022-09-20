// DLisp Environment Setup for Deno environments
// (c) 2022 Kina, LLC

// This code assumes a fully compiled environment is already made and available in Javascript


import { get_next_environment_id, check_true, get_outside_global, subtype, lisp_writer, clone, LispSyntaxError } from "./lisp_writer.js";

import { init_dlisp } from "./environment.js"

// initialize and establish dlisp_env in global
await init_dlisp()

// ..construct the environment
var env=await dlisp_env()

// get the core language installed..
// import the precompiled js...
import { environment_boot } from "./core.js"
// and install it in our environment...
await environment_boot(env);

// import and install the compiler 
import { init_compiler } from "./compiler.js"
await init_compiler(env)

// setting the compiler allows us to change out to different
// compiler versions.

var cca = await env.get_global("compiler")
await env.set_compiler(cca)

// Ready - call env.evaluate("(my_lisp form)") beyond this point for compilation and evaluation of lisp forms

// setup a simple repl from stdin

let opts={
  throw_on_error: true
}

try {
  debugger;
  await env.evaluate("(defglobal read_text_file (bind Deno.readTextFile Deno))",null, opts)
  debugger
  //await env.evaluate("(defun load-file (filename) (progn (evaluate (read_text_file filename))))",null, opts)
  
  await env.evaluate ("(import \"./src/repl.lisp\")",null, opts)
  //await env.evaluate ("(import \"./doc/help.lisp\")")
  await env.evaluate ("(create_namespace `user)")
  await env.evaluate ("(set_namespace `user)")
  //await env.evaluate ("(import \"tests/package.juno\")")
} catch (error) {
  console.error("initialization error: ",error);
  Deno.exit(1);
}

try {  
  await env.evaluate("(repl Deno.stdin Deno.stdout { `raw: false `use_console: true `simple: true } )",null, opts); // and call it..
} catch (error) {
  console.error("repl error",error);
}


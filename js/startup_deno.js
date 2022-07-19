// DLisp Environment Setup for Deno environments
// (c) 2022 Kina, LLC

// This code assumes a fully compiled environment is already made and available in Javascript


import { get_next_environment_id, check_true, get_outside_global, subtype, lisp_writer, clone, LispSyntaxError } from "./lisp_writer.js";

import { init_dlisp } from "./environment.js"
import { init_compiler } from "./compiler.js"
import { load_core } from "./core.js"
import { initializer } from "./io.js"

await init_dlisp()
var env=await dlisp_env()
import { environment_boot } from "./environment_boot.js"

await environment_boot(env);
await init_compiler(env)
await load_core(env)
var cca = await env.get_global("compiler")
await env.set_compiler(cca)

await initializer(env);
// Ready - call env.evaluate("(my_lisp form)") beyond this point for compilation and evaluation of lisp forms

// setup a simple repl from stdin


let opts={
  throw_on_error: true
}

//import { readline } from "https://deno.land/x/readline/mod.ts";
//import { writeAllSync } from "https://deno.land/std/streams/conversion.ts";

//await env.set_global("readline",readline);
//await env.set_global("writeAllSync",writeAllSync);
try {
  
  await env.evaluate("(defglobal read_text_file (bind Deno.readTextFile Deno))",null, opts)
  await env.evaluate("(defun load-file (filename) (progn (evaluate (read_text_file filename))))",null, opts)
  
 // await env.evaluate ("(load-file \"./tests/compiler-tests-1.lisp\")",null, opts)
 // await env.evaluate ("(load-file \"./tests/test_harness.lisp\")",null,opts)
  await env.evaluate ("(load-file \"./src/repl.lisp\")",null, opts)
  await env.evaluate ("(load \"./doc/help.lisp\")")
  await env.evaluate ("(create_namespace `user)")
  await env.evaluate ("(set_namespace `user)")
  await env.evaluate ("(import \"tests/package.juno\")")
} catch (error) {
  console.error("initialization error: ",error);
  Deno.exit(1);
}

try {  
  await env.evaluate("(repl Deno.stdin Deno.stdout)",null, opts); // and call it..
} catch (error) {
  console.error("repl error",error);
}


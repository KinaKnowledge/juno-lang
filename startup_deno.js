// DLisp Environment Setup for Deno environments
// (c) 2022 Kina, LLC

// This code assumes a fully compiled environment is already made and available in Javascript

//var { get_next_environment_id, check_true, get_outside_global, subtype, lisp_writer, clone } = await import("./lisp_writer.js");
import { get_next_environment_id, check_true, get_outside_global, subtype, lisp_writer, clone } from "./lisp_writer.js";
globalThis.subtype=subtype
globalThis.check_true=check_true
globalThis.clone=clone
globalThis.get_next_environment_id=get_next_environment_id

var { init_dlisp } = await import("./environment.js");
var { init_compiler } = await import("./compiler.js");
var { load_core } = await import("./core.js");

await init_dlisp()
var env=await dlisp_env()
var { environment_boot } = await import("./environment_boot.js")
await environment_boot(env);
await init_compiler(env)
await load_core(env)
var cca = await env.get_global("compiler")
await env.set_compiler(cca)

// Ready - call env.evaluate("(my_lisp form)") beyond this point for compilation and evaluation of lisp forms

// setup a simple repl from stdin

console.log("\nDLisp",env.version," (c) 2022 Kina, LLC");


import { readline } from "https://deno.land/x/readline/mod.ts";
import { writeAllSync } from "https://deno.land/std/streams/conversion.ts";

await env.set_global("readline",readline);
await env.set_global("writeAllSync",writeAllSync);

await env.evaluate("(defglobal read_text_file (bind Deno.readTextFile Deno))")
await env.evaluate("(defun load-file (filename) (progn (evaluate (read_text_file filename))))")
// await env.set_global("__VERBOSITY__",6);

//await env.evaluate("(load-file \"io.lisp\")")
await env.evaluate("(defglobal init_io (dynamic_import \"./io.js\"))")
await env.evaluate("(init_io.initializer Environment)");
await env.evaluate ("(load-file \"./tests/compiler-tests-1.lisp\")")
await env.evaluate ("(load-file \"./tests/test_harness.lisp\")")
await env.evaluate ("(load-file \"repl.lisp\")")
//await env.evaluate(repl); // compile and load the repl
await env.evaluate("(repl Deno.stdin Deno.stdout)"); // and call it..


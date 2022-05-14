// DLisp Environment Setup for Deno environments
// (c) 2022 Kina, LLC

// This code assumes a fully compiled environment is already made and available in Javascript

//var { get_next_environment_id, check_true, get_outside_global, subtype, lisp_writer, clone } = await import("./lisp_writer.js");
import { get_next_environment_id, check_true, get_outside_global, subtype, lisp_writer, clone } from "./lisp_writer.js";
globalThis.subtype=subtype
globalThis.check_true=check_true

var { init_dlisp } = await import("./environment.js");
var { init_compiler } = await import("./compiler.js");

await init_dlisp()
var env=await dlisp_env()
var { environment_boot } = await import("./environment_boot.js")
await environment_boot(env);
await init_compiler(env)
var cca = await env.get_global("compiler")
await env.set_compiler(cca)

// Ready - call env.evaluate("(my_lisp form)") beyond this point for compilation and evaluation of lisp forms

// setup a simple repl from stdin

console.log("DLisp 2.0 (c) 2022 Kina, LLC");

//let readline = await import("https://deno.land/x/readline/mod.ts");
// readline.readline is AsyncGeneratorFunction

import { readline } from "https://deno.land/x/readline/mod.ts";
// console.log("readline: ",readline.readline);
const repl = Deno.readTextFileSync("repl.lisp");
const te = new TextDecoder();


// const freader=async function* () { return readline(Deno.stdin) };
// await env.set_global("freader",freader);
// console.log(await env.evaluate("(defglobal freader freader)"));
await env.set_global("te",te)
await env.set_global("readline",readline)

await env.evaluate(repl);

//await env.evaluate("(defglobal te te)");
await env.evaluate("(repl)");

//let lines=[];
//for await (const line of readline(Deno.stdin)) {
//      console.log(await env.evaluate(new TextDecoder().decode(line)));


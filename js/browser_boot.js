
addEventListener('DOMContentLoaded', async function() {
  try {    
    console.log("Starting browser boot..")   
    let pkg=await env.evaluate("core/html_package");   
    await env.evaluate(pkg);
    console.log("initializing browser_repl_package");
    //await env.evaluate('(set_namespace "core")');
    await env.evaluate('(eval (reader (clone browser_repl_package)))');
    await env.evaluate('(console.log *namespace* (current_namespace))');
    //await env.evaluate('(eval core/browser_workspace)');
    globalThis.env = env;
  } catch (ex) {
    console.error(ex);
  }
});

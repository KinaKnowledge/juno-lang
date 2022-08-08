
addEventListener('DOMContentLoaded', async function() {
  try {
    //await env.set_global('html_lib',html_lib)
    //await env.set_global('browser_workspace',browser_workspace);
    console.log("Starting browser boot..")
    console.log(await env.evaluate("(sort (core/symbols))"))
    let pkg=await env.evaluate("core/html_package");
    console.log("pkg: ",pkg);
    await env.evaluate(pkg);
    //await env.evaluate('(console.log html_lib)')
    await env.evaluate('(html_lib)');
    await env.evaluate('(eval browser_repl_package)');
    await env.evaluate('(eval browser_workspace)');
    globalThis.env = env;
  } catch (ex) {
    console.error(ex);
  }
});

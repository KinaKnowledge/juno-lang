
addEventListener('DOMContentLoaded', async function() {
  try {
    await env.set_global('html_lib',html_lib)
    await env.set_global('browser_workspace',browser_workspace);
    await env.evaluate('(eval html_lib)');
    await env.evaluate('(eval browser_workspace)');
    globalThis.env = env;
  } catch (ex) {
    console.error(ex);
  }
});

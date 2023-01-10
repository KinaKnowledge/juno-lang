### Building Images

To export Lisp images to a consolidated javascript file which contains the current global state and assets:

For Deno:
1. Check the `*env_config*.export` object for details of where the javascript export will be placed and named, as well as the default namespace to be in on start up:
```
{
  save_path:"js/juno.js"
  default_namespace:"user"
  include_source:false
}
```
2. Import the save_env package which, upon import kick off the save process:
`(import "pkg/save_env.juno")`
3. The consolidated JS file will be written, which can be started up by calling from the command line:
`lib/juno js/juno.js`

To build a full executable from the consolidated image call the compile function from the command line:
`lib/juno --compile my_binary_name js/juno.js`

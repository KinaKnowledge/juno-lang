### Building and Exporting Lisp Images

The system can serialize its current state to JSON or Javascript which can then be saved and de-serialized into an operational image at a later point in time.  This is done using the `save_env` or `save_environment` functions.  Defaults for the serialization process are taking from the `*env_config*` of the core environment.  The settings can be modified by passing in specific options at the time of the call, or changing the *env_config* object settings.

There are some considerations to keep in mind when performing this process.  There likely are certain objects that need to be re-initialized to a starting value when the deserialization process is performed.  To implement this, when each namespace is restarted, a namespace local function named `*initializer*` is called once the namespace environment has initialized.  In this function, the correct values can be reestablished and objects instantiated. Note that namespaces are deserialized according to their symbolic dependencies to other namespaces.  Once all namespaces have been rebuilt, then the core environment calls the `core/on_environment_ready` function, which can be used to start your application.  By default, if nothing is specified, the REPL is started.

#### Server Environments and the REPL process

To export Lisp images to a consolidated javascript file which contains the current global state and assets:

##### For Deno:
1. Check the `*env_config*.export` object for details of where the javascript export will be placed and named, as well as the default namespace to be in on start up:
```
{
  save_path:"js/juno.js"
  default_namespace:"user"
  include_source:false
}
```
2. Import the save_env package which makes sure any needed dependencies are in place and installs a helper function called `save_environment`:
`(import "pkg/save_env.juno")`

3. To save the current state to the save_path listed in `*env_config*` above, enter: `(save_environment)`.  This will initiate the export process with the defaults. 
4. The consolidated JS file will be written, which can be started up by calling from the command line:
```
lib/juno js/juno.js`
```

or:
```
deno run js/juno.js
```

When called with the lib/juno script, full permissions are granted.  By calling from Deno directly, as in the second example above, the permissions can be specified using the --allow-* flags in Deno.

5. Optionally, to build a full executable from the consolidated image built in step 4, call the compile function from the command line:
```
lib/juno --compile my_binary_name js/juno.js
```

This will emit a binary executable named `my_binary_name`.  The binary will be compatible with the system architecture that it is compiled on.

Alternatively, to build an executable from within Juno, make sure the `sys` package is loaded. The feature `system` will be present in `*env_config*.features` if it is.  To load it:
```
(import "pkg/sys.juno")
```

Then type:
```
(sys/compile_executable { `emit_as: "bin/my_binary_name" })
```
Note that this will compile with all permissions that are currently allowed.  To restrict permissions to a specific allowances:

```
(sys/compile_executable { `emit_as: "bin/file_reader" `permissions: [ "read" ] })
```
In this case, when the executable is started, only the `read` value will have the `granted` value.

The `save_environment` call can also emit an exported image as an executable by including the `compile` flag:
```
(save_environment { `compile: true `emit_as: "bin/my_executable" })
```


##### Some Examples:

To save to a different file name: 
```
(save_environment { `save_as: "path/to/save.js" })
```

To specify a on_environment_ready function at time of save:
```
(save_environment { `on_environment_ready: (fn () (user/my_start_function 321 "ABC")) } )
```


#### Browser Environments

The Seedling IDE environment provides menu facilities to save the *full IDE environment state* as a named file, or an individual *named layout*, where a subset of functionality is exported as an application, generating a smaller HTML file.  This is useful when you don't need or want to distribute the full IDE because the intended end users will not be modifying and changing the underlying application code.  In this case, you might not need an editing environment, or all the controls beyond those in use.  

##### How to Save The Full State

To initiate an full image export from the browser, visit the menu items under *File->Browser Environment*.  If your Seedling Environment is being hosted by a Juno server environment, you can select *Bundle Application To Host* and, after selecting a name, the current environment image will be saved to the remote system and accessible via the `/env/name-of-environment.html` path. To build and download the saved image as opposed to storing it on the server, click `Bundle Application and Download`.  This will download the application to the configured downloads folder of the browser you are running in.  If at a later time you want to run the saved image from a server, just copy the application to the `/environments` folder of the hosting Juno server environment.

##### How to Save A Named Layout

Named layouts can also be exported via the IDE quite simply.  Once you are satisfied with your control or set of controls, create a named layout and then export the layout.  To create a named layout, select *Layout->New Named Layout*, which will be populated with the controls in the current layout.  The named layout will become active.  Next, visit *Layout->Export Layout* where the layout to be exported will be the named layout you just created.  This will bring up the export panel, where you can choose to *Export* the layout.  Once the layout has been exported it will be available in the /environments folder, and accessible under `/env/name-of-your-layout.html` if you in a server environment.  

##### Saving Browser Environment Details

In browser environments, the process works similarly to the server environment, but there are some differences and variations, depending if the page has been served or is a local file.  The function  `save_image` is used to emit an HTML page which serves as the container for the various resources referenced by the environment.  Additionally, the helper function `save_control_image` is useful to save the application state of the controls - it performs the serialization of the controls to a global JSON structure, `*serialized_controls*`.  It also opens the newly saved image to another browser tab for review if the environment is being served vs. a locally loaded page. Like the server environments, each `*initializer*` function is called, and if there is a `core/on_environment_ready` function, it will be called when complete.  In the Seedling Application, the `*initializer*` is set to restart the saved application state in `*serialized_controls*`. 

To initiate an full image export from the browser, the user can either select the menu item under File->Save Environment, or from the REPL, type `(save_control_image true)`.  The `true` argument will popup a request to provide another name besides the default listed in `*env_config*.export`.

If the page is currently being served, the `save_image` results will be uploaded to the `/environments` folder. 

If the environment is local, the browser will download the new .html file to the locally configured download folder.  

All generated HTML files are self contained, and so if placed into an /environments folder, it can be served normally.  It is not dependent on server resources to run, which allows for greater transportability.



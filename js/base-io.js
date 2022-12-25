// Source: base-io.lisp  
// Build Time: 2022-12-25 06:54:40
// Version: 2022.12.25.06.54
export const DLISP_ENV_VERSION='2022.12.25.06.54';




var { get_next_environment_id, check_true, get_outside_global, subtype, lisp_writer, clone, LispSyntaxError } = await import("./lisp_writer.js");
export async function initializer(Environment)  {
{
    ;
    null;
    {
        (await Environment.get_global("path"));
        await (await Environment.get_global("map"))((await Environment.get_global("register_feature")),["io","Deno"]);
        [await Environment.set_global("core/read_text_file",await (await Environment.get_global("bind"))(Deno.readTextFile,Deno),{
            description:("Given an accessible filename including "+ "path with read permissions returns the file contents as a string."),usage:["filename:string","options:object"],tags:["file","read","text","input","io"],initializer:await (async function(){
                 return ["=:bind","=:Deno.readTextFile","=:Deno"] 
            })(),requires:["bind"]
        }),await Environment.set_global("core/write_text_file",await (await Environment.get_global("bind"))(Deno.writeTextFile,Deno),{
            description:("Given a string path to a filename, an argument containing "+ "the string of text to be written, and an optional options argument "+ "write the file to the filesystem.<br><br>."+ "The WriteFileOptions corresponds to the Deno WriteFileOptions interface"),usage:["filepath:string","textdata:string","options:WriteFileOptions"],tags:["file","write","io","text","string"],initializer:await (async function(){
                 return ["=:bind","=:Deno.writeTextFile","=:Deno"] 
            })(),requires:["bind"]
        })];
        await Environment.set_global("load",async function(filename) {
            let fname;
            let js_mod;
            let comps;
            fname=filename;
            js_mod=null;
            comps=await (await Environment.get_global("path.parse"))(fname);
            return await async function(){
                if (check_true (((comps && comps["ext"])===".lisp"))) {
                    return await (await Environment.get_global("evaluate"))(await (async function(){
                         return await (await Environment.get_global("read_text_file"))(fname) 
                    })(),null,{
                        source_name:fname
                    })
                } else if (check_true (((comps && comps["ext"])===".js"))) {
                    {
                        js_mod=await import (fname);
                        if (check_true ((js_mod && js_mod["initializer"]))){
                            return await (async function(){
                                let __array_op_rval__2=(js_mod && js_mod["initializer"]);
                                 if (__array_op_rval__2 instanceof Function){
                                    return await __array_op_rval__2(Environment) 
                                } else {
                                    return [__array_op_rval__2,Environment]
                                }
                            })()
                        } else {
                            throw new EvalError("load: unable to find function named initializer in export, use dynamic_import for this.");
                            
                        }
                    }
                } else if (check_true (((comps && comps["ext"])===".json"))) {
                    return await (await Environment.get_global("evaluate"))(await JSON.parse(await (async function(){
                         return await (await Environment.get_global("read_text_file"))(fname) 
                    })()),null,{
                        json_in:true
                    })
                }
            } ()
        },{ "name":"load","fn_args":"(filename)","description":["=:+","Compile and load the contents of the specified lisp filename (including path) into the Lisp environment. ","The file contents are expected to be Lisp source code in text format."],"tags":["compile","read","io","file"],"usage":["filename:string"],"requires":["path","evaluate","read_text_file"]
    });
    await Environment.set_global("with_fs_events",async function(...args) {
        let event_binding;
        let location;
        let body;
        event_binding=(args && args["0"] && args["0"]["0"]);
        location=(args && args["0"] && args["0"]["1"]);
        body=(args && args["1"]);
        return ["=:let",[["=:watcher",["=:->","=:Deno","watchFs",location]]],["=:declare",["=:object","=:watcher"]],["=:for_with",[event_binding,"=:watcher"],["=:progn",body]]]
    },{ "eval_when":{ "compile_time":true
},"name":"with_fs_events","macro":true,"fn_args":"[(event_binding location) body]","description":["=:+","This function sets up a watcher scope for events on a filesystem. ","The symbol passed to the event_binding is bound to new events that occur ","at the provided location.  Once an event occurs, the body forms are executed."],"usage":["event_binding:symbol","location:string","body:array"],"tags":["file","filesystem","events","io","watch"]
});
return true
}
}
}
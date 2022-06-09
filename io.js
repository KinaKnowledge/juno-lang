var { get_next_environment_id, check_true, get_outside_global, subtype, lisp_writer, clone } = await import("./lisp_writer.js");
export async function initializer(Environment)  {
{
    if (check_true (await (await Environment.get_global("not"))(await (await Environment.get_global("not"))((typeof (await Environment.get_global("Deno"))==="undefined")))))throw new Error("IO requires Deno");
    ;
    await Environment.set_global("read_text_file",await (await Environment.get_global("bind"))((await Environment.get_global("Deno.readTextFile")),(await Environment.get_global("Deno"))),{
        description:("Given an accessible filename including "+"path with read permissions returns the file contents as a string."),usage:["filename:string","options:object"],tags:["file","read","text","input","io"]
    });
    await Environment.set_global("path",await import ("https://deno.land/std@0.110.0/path/mod.ts"));
    await Environment.set_global("load",async function(filename) {
        let fname;
        let js_mod;
        let comps;
        fname=filename;
        js_mod=null;
        comps=await (await Environment.get_global("path.parse"))(fname);
         return  await async function(){
            if (check_true( ((comps && comps["ext"])===".lisp"))) {
                 return await (await Environment.get_global("evaluate"))(await (await Environment.get_global("read_text_file"))(fname))
            } else if (check_true( ((comps && comps["ext"])===".js"))) {
                js_mod=await import (fname);
                if (check_true ((js_mod && js_mod["initializer"]))){
                      return await (async function(){
                        let __array_op_rval__1=(js_mod && js_mod["initializer"]);
                         if (__array_op_rval__1 instanceof Function){
                            return await __array_op_rval__1(Environment) 
                        } else {
                            return[__array_op_rval__1,Environment]
                        }
                    })()
                } else throw new EvalError("load: unable to find function named initializer in export, use dynamic_import for this.");
                
            } else if (check_true( ((comps && comps["ext"])===".json"))) {
                 return await (await Environment.get_global("evaluate"))(await JSON.parse(await (await Environment.get_global("read_text_file"))(fname)),{
                    json_in:true
                })
            }
        }()
    },await Environment.do_deferred_splice(await Environment.read_lisp('{\"name\":\"load\" \"fn_args\":\"(filename)\" \"description\":(+ \"Compile and load the contents of the specified lisp filename (including path) into the Lisp environment. \" \"The file contents are expected to be Lisp source code in text format.\") \"tags\":(\"compile\" \"read\" \"io\" \"file\") \"usage\":(\"filename:string\")}')));
    await Environment.set_global("write_text_file",await (await Environment.get_global("bind"))((await Environment.get_global("Deno.writeTextFile")),(await Environment.get_global("Deno"))),{
        description:("Given a string path to a filename, an argument containing "+"the string of text to be written, and an optional options argument "+"write the file to the filesystem.<br><br>."+"The WriteFileOptions corresponds to the Deno WriteFileOptions interface"),usage:["filepath:string","textdata:string","options:WriteFileOptions"],tags:["file","write","io","text","string"]
    });
    await Environment.set_global("compile_file",async function(lisp_file,export_function_name,options) {
        let input_components;
        let input_filename;
        let output_filename;
        let opts;
        let segments;
        let write_file;
        let compiled;
        let input_buffer;
        let invalid_js_ref_chars;
        let invalid_js_ref_chars_regex;
        let boilerplate;
        let compiled_js;
        input_components=await (await Environment.get_global("path.parse"))(lisp_file);
        input_filename=await (await Environment.get_global("path.basename"))(lisp_file);
        output_filename=((options && options["output_file"])||await (await Environment.get_global("add"))(await (async function() {
             if (check_true (((input_components && input_components["dir"])===""))){
                  return "."
            } else {
                  return (input_components && input_components["dir"])
            } 
        } )(),(await Environment.get_global("path.sep")),(input_components && input_components["name"]),".js"));
        opts=(options||new Object());
        export_function_name=(export_function_name||"initializer");
        segments=[];
        write_file=true;
        compiled=null;
        input_buffer=null;
        invalid_js_ref_chars="+?-%&^#!*[]~{}|";
        invalid_js_ref_chars_regex=new RegExp("[%+[>?<\}{&#^=~*!)(-]+");
        boilerplate="var { get_next_environment_id, check_true, get_outside_global, subtype, lisp_writer, clone } = await import(\"./lisp_writer.js\");";
        compiled_js=null;
        if (check_true ((await (await Environment.get_global("length"))(await (await Environment.get_global("scan_str"))(invalid_js_ref_chars_regex,export_function_name))>0))){
            throw new SyntaxError(("export function name contains an invalid JS character: "+export_function_name+", cannot contain: "+invalid_js_ref_chars));
            
        };
        (segments).push(boilerplate);
        if (check_true ((((input_components && input_components["name"])==="environment")||(export_function_name==="init_dlisp")||(opts && opts["toplevel"])))){
             (segments).push("if (typeof AsyncFunction === \"undefined\") {\n  globalThis.AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;\n}")
        };
        input_buffer=await (await Environment.get_global("read_text_file"))(lisp_file);
        if (check_true (((input_components && input_components["ext"])===".lisp"))){
             input_buffer=await (await Environment.get_global("read_lisp"))(input_buffer,{
                implicit_progn:false
            })
        };
        if (check_true (((input_buffer instanceof Array)&&((input_buffer && input_buffer["0"])==="=:iprogn")))){
             await async function(){
                let __target_obj__2=input_buffer;
                __target_obj__2[0]=`=:progn`;
                return __target_obj__2;
                
            }()
        };
        compiled=await (await Environment.get_global("compiler"))(input_buffer,await (await Environment.get_global("add"))({
            env:Environment,formatted_output:true
        },opts));
        await async function(){
            if (check_true((compiled && compiled["error"]))) {
                 throw new Error((await Environment.get_global("indirect_new"))(compiled.error,(compiled && compiled["message"])));
                
            } else if (check_true( ((compiled && compiled["0"] && compiled["0"]["ctype"])&&((compiled && compiled["0"] && compiled["0"]["ctype"])==="FAIL")))) {
                write_file=false;
                 return  await console.log((compiled && compiled["1"]))
            } else if (check_true( ((compiled && compiled["0"] && compiled["0"]["ctype"])&&(await (await Environment.get_global("contains?"))("block",(compiled && compiled["0"] && compiled["0"]["ctype"]))||((compiled && compiled["0"] && compiled["0"]["ctype"])==="assignment")||((compiled && compiled["0"] && compiled["0"]["ctype"])==="__!NOT_FOUND!__"))))) {
                 if (check_true (await (async function(){
                    let __array_op_rval__3=(compiled && compiled["0"] && compiled["0"]["has_lisp_globals"]);
                     if (__array_op_rval__3 instanceof Function){
                        return await __array_op_rval__3() 
                    } else {
                        return[__array_op_rval__3]
                    }
                })())){
                    (segments).push(("export async function "+export_function_name+"(Environment)  {"));
                    (segments).push((compiled && compiled["1"]));
                     (segments).push("}")
                } else {
                    (segments).push(("export async function "+export_function_name+"() {"));
                    (segments).push((compiled && compiled["1"]));
                     (segments).push("}")
                }
            } else if (check_true( ((compiled && compiled["0"] && compiled["0"]["ctype"])&&(("AsyncFunction"===(compiled && compiled["0"] && compiled["0"]["ctype"]))||("statement"===(compiled && compiled["0"] && compiled["0"]["ctype"]))||("objliteral"===(compiled && compiled["0"] && compiled["0"]["ctype"])))))) {
                if (check_true (await (async function(){
                    let __array_op_rval__4=(compiled && compiled["0"] && compiled["0"]["has_lisp_globals"]);
                     if (__array_op_rval__4 instanceof Function){
                        return await __array_op_rval__4() 
                    } else {
                        return[__array_op_rval__4]
                    }
                })())){
                    (segments).push(("export async function "+export_function_name+"(Environment) {"));
                     return  (segments).push(("  return "+(compiled && compiled["1"])+"} "))
                } else {
                    (segments).push(("export async function "+export_function_name+"() {"));
                     return  (segments).push(("  return "+(compiled && compiled["1"])+"} "))
                }
            } else if (check_true( ((compiled && compiled["0"] && compiled["0"]["ctype"])&&("Function"===(compiled && compiled["0"] && compiled["0"]["ctype"]))))) {
                if (check_true (await (async function(){
                    let __array_op_rval__5=(compiled && compiled["0"] && compiled["0"]["has_lisp_globals"]);
                     if (__array_op_rval__5 instanceof Function){
                        return await __array_op_rval__5() 
                    } else {
                        return[__array_op_rval__5]
                    }
                })())){
                    (segments).push(("export function "+export_function_name+"(Environment) {"));
                     return  (segments).push(("  return "+(compiled && compiled["1"])+"}"))
                } else {
                    (segments).push(("export function "+export_function_name+"() {"));
                     return  (segments).push(("  return "+(compiled && compiled["1"])+" } "))
                }
            } else  {
                await console.log("warning: unhandled return: ",compiled);
                 return  write_file=false
            }
        }();
        if (check_true (write_file)){
            await (await Environment.get_global("write_text_file"))(output_filename,(segments).join("\n"));
            await console.log("compiled input file ",lisp_file,"->",output_filename);
             return  output_filename
        } else {
            await console.log("input file ",lisp_file," not compiled.");
             return  null
        }
    },await Environment.do_deferred_splice(await Environment.read_lisp('{\"name\":\"compile_file\" \"fn_args\":\"(lisp_file export_function_name options)\"}')));
     return  true
}
}
// Source: io.lisp  
// Build Time: 2022-07-30 10:29:56
// Version: 2022.07.30.10.29
export const DLISP_ENV_VERSION='2022.07.30.10.29';




var { get_next_environment_id, check_true, get_outside_global, subtype, lisp_writer, clone, LispSyntaxError } = await import("./lisp_writer.js");
export async function initializer(Environment)  {
{
    ;
    if (check_true (await (await Environment.get_global("not"))(await (await Environment.get_global("not"))(((typeof "Deno"==="undefined")||(await Environment["get_global"].call(Environment,"Deno",ReferenceError)===ReferenceError))))))throw new Error("IO requires Deno");
    ;
    (await Environment.get_global("path"));
    await (await Environment.get_global("map"))((await Environment.get_global("register_feature")),["io","Deno"]);
    [await Environment.set_global("core/read_text_file",await (await Environment.get_global("bind"))(Deno.readTextFile,Deno),{
        description:("Given an accessible filename including "+"path with read permissions returns the file contents as a string."),usage:["filename:string","options:object"],tags:["file","read","text","input","io"],initializer:["=:bind","=:Deno.readTextFile","=:Deno"]
    }),await Environment.set_global("core/write_text_file",await (await Environment.get_global("bind"))(Deno.writeTextFile,Deno),{
        description:("Given a string path to a filename, an argument containing "+"the string of text to be written, and an optional options argument "+"write the file to the filesystem.<br><br>."+"The WriteFileOptions corresponds to the Deno WriteFileOptions interface"),usage:["filepath:string","textdata:string","options:WriteFileOptions"],tags:["file","write","io","text","string"],initializer:["=:bind","=:Deno.writeTextFile","=:Deno"]
    })];
    await Environment.set_global("load",async function(filename) {
        let fname;
        let js_mod;
        let comps;
        fname=filename;
        js_mod=null;
        comps=await (await Environment.get_global("path.parse"))(fname);
         return  await async function(){
            if (check_true( ((comps && comps["ext"])===".lisp"))) {
                 return await (await Environment.get_global("evaluate"))(await (await Environment.get_global("read_text_file"))(fname),null,{
                    source_name:fname
                })
            } else if (check_true( ((comps && comps["ext"])===".js"))) {
                js_mod=await import (fname);
                if (check_true ((js_mod && js_mod["initializer"]))){
                      return await (async function(){
                        let __array_op_rval__2=(js_mod && js_mod["initializer"]);
                         if (__array_op_rval__2 instanceof Function){
                            return await __array_op_rval__2(Environment) 
                        } else {
                            return[__array_op_rval__2,Environment]
                        }
                    })()
                } else throw new EvalError("load: unable to find function named initializer in export, use dynamic_import for this.");
                
            } else if (check_true( ((comps && comps["ext"])===".json"))) {
                 return await (await Environment.get_global("evaluate"))(await JSON.parse(await (await Environment.get_global("read_text_file"))(fname)),null,{
                    json_in:true
                })
            }
        } ()
    },{ "name":"load","fn_args":"(filename)","description":["=:+","Compile and load the contents of the specified lisp filename (including path) into the Lisp environment. ","The file contents are expected to be Lisp source code in text format."],"tags":["compile","read","io","file"],"usage":["filename:string"]
});
await Environment.set_global("with_fs_events",async function(...args) {
    let event_binding;
    let location;
    let body;
    event_binding=(args && args["0"] && args["0"]["0"]);
    location=(args && args["0"] && args["0"]["1"]);
    body=(args && args["1"]);
     return  ["=:let",[["=:watcher",["=:->","=:Deno","watchFs",location]]],["=:declare",["=:object","=:watcher"]],["=:for_with",[event_binding,"=:watcher"],["=:progn",body]]]
},{ "eval_when":{ "compile_time":true
},"name":"with_fs_events","macro":true,"fn_args":"((event_binding location) body)","description":["=:+","This function sets up a watcher scope for events on a filesystem. ","The symbol passed to the event_binding is bound to new events that occur ","at the provided location.  Once an event occurs, the body forms are executed."],"usage":["event_binding:symbol","location:string","body:array"],"tags":["file","filesystem","events","io","watch"]
});
await Environment.set_global("compile_buffer",async function(input_buffer,export_function_name,options) {
    let output_filename;
    let opts;
    let segments;
    let export_segment;
    let include_boilerplate;
    let start_time;
    let compile_time;
    let write_file;
    let include_source;
    let compiled;
    let invalid_js_ref_chars;
    let invalid_js_ref_chars_regex;
    let boilerplate;
    let compiled_js;
    output_filename=((options && options["output_file"])||await (async function ()  {
        throw new EvalError("compile_buffer requires output_file be set in the options");
        
    } )());
    opts=(options||new Object());
    export_function_name=(export_function_name||"initializer");
    segments=[];
    export_segment=[];
    include_boilerplate=await (async function () {
         if (check_true ((false===(opts && opts["include_boilerplate"])))){
              return false
        } else {
              return true
        } 
    })();
    start_time=await Date.now();
    compile_time=null;
    write_file=true;
    include_source=await (async function () {
         if (check_true ((opts && opts["include_source"]))){
              return true
        } else {
              return false
        } 
    })();
    compiled=null;
    invalid_js_ref_chars="+?-%&^#!*[]~{}|";
    invalid_js_ref_chars_regex=new RegExp("[\%\+\[\>\?\<\\}\{&\#\^\=\~\*\!\)\(\-]+");
    boilerplate="var { get_next_environment_id, check_true, get_outside_global, subtype, lisp_writer, clone, LispSyntaxError } = await import(\"./lisp_writer.js\");";
    compiled_js=null;
    if (check_true ((await (await Environment.get_global("length"))(await (await Environment.get_global("scan_str"))(invalid_js_ref_chars_regex,export_function_name))>0))){
        throw new SyntaxError(("export function name contains an invalid JS character: "+export_function_name+", cannot contain: "+invalid_js_ref_chars));
        
    };
    (segments).push(("// Source: "+(options && options["input_filename"])+"  "));
    if (check_true (((opts && opts["build_headers"]) instanceof Array))){
        await (async function() {
            let __for_body__5=async function(header) {
                 return  (segments).push(header)
            };
            let __array__6=[],__elements__4=(opts && opts["build_headers"]);
            let __BREAK__FLAG__=false;
            for(let __iter__3 in __elements__4) {
                __array__6.push(await __for_body__5(__elements__4[__iter__3]));
                if(__BREAK__FLAG__) {
                     __array__6.pop();
                    break;
                    
                }
            }return __array__6;
             
        })();
         (segments).push("\n")
    };
    (segments).push("\n");
    if (check_true (include_boilerplate)){
         (segments).push(boilerplate)
    };
    if (check_true (((opts && opts["js_headers"]) instanceof Array))){
        await (async function() {
            let __for_body__9=async function(header) {
                 return  (segments).push(header)
            };
            let __array__10=[],__elements__8=(opts && opts["js_headers"]);
            let __BREAK__FLAG__=false;
            for(let __iter__7 in __elements__8) {
                __array__10.push(await __for_body__9(__elements__8[__iter__7]));
                if(__BREAK__FLAG__) {
                     __array__10.pop();
                    break;
                    
                }
            }return __array__10;
             
        })();
         (segments).push("\n")
    };
    if (check_true (((export_function_name==="init_dlisp")||(opts && opts["toplevel"])))){
         (segments).push("if (typeof AsyncFunction === \"undefined\") {\n  globalThis.AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;\n}")
    };
    if (check_true (((input_buffer instanceof Array)&&((input_buffer && input_buffer["0"])==="=:iprogn")))){
         await async function(){
            input_buffer[0]="=:progn";
            return input_buffer;
            
        }()
    };
    if (check_true ((opts && opts["verbose"]))){
         await console.log("input_buffer: ",input_buffer)
    };
    compiled=await (await Environment.get_global("compiler"))(input_buffer,await (await Environment.get_global("add"))({
        env:Environment,formatted_output:true,include_source:include_source,source_name:((opts && opts["input_filename"])||"anonymous")
    },opts));
    compile_time=await (await Environment.get_global("add"))(await (async function() {
        {
             let __call_target__=((await Date.now()-start_time)/1000), __call_method__="toFixed";
            return await __call_target__[__call_method__].call(__call_target__,3)
        } 
    })(),"s");
    await async function(){
        if (check_true((compiled && compiled["error"]))) {
             throw new Error((await Environment.get_global("indirect_new"))(compiled.error,(compiled && compiled["message"])));
            
        } else if (check_true( ((compiled && compiled["0"] && compiled["0"]["ctype"])&&((compiled && compiled["0"] && compiled["0"]["ctype"])==="FAIL")))) {
            write_file=false;
             return  await (await Environment.get_global("warn"))((compiled && compiled["1"]))
        } else if (check_true( ((compiled && compiled["0"] && compiled["0"]["ctype"])&&(await (await Environment.get_global("contains?"))("block",(compiled && compiled["0"] && compiled["0"]["ctype"]))||((compiled && compiled["0"] && compiled["0"]["ctype"])==="assignment")||((compiled && compiled["0"] && compiled["0"]["ctype"])==="__!NOT_FOUND!__"))))) {
             if (check_true (await (async function(){
                let __array_op_rval__12=(compiled && compiled["0"] && compiled["0"]["has_lisp_globals"]);
                 if (__array_op_rval__12 instanceof Function){
                    return await __array_op_rval__12() 
                } else {
                    return[__array_op_rval__12]
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
                let __array_op_rval__13=(compiled && compiled["0"] && compiled["0"]["has_lisp_globals"]);
                 if (__array_op_rval__13 instanceof Function){
                    return await __array_op_rval__13() 
                } else {
                    return[__array_op_rval__13]
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
                let __array_op_rval__14=(compiled && compiled["0"] && compiled["0"]["has_lisp_globals"]);
                 if (__array_op_rval__14 instanceof Function){
                    return await __array_op_rval__14() 
                } else {
                    return[__array_op_rval__14]
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
    } ();
    if (check_true ((opts && opts["bundle"]))){
        (segments).push(("await init_dlisp();"));
         (segments).push(("let env = await dlisp_env("+await (async function () {
             if (check_true ((opts && opts["bundle_options"]))){
                  return await JSON.stringify((opts && opts["bundle_options"]))
            } else {
                  return ""
            } 
        })()+");"))
    };
    if (check_true (((opts && opts["exports"]) instanceof Array))){
        (export_segment).push("export { ");
        await (await Environment.get_global("map"))(async function(exp,i,len) {
            {
                await async function(){
                    if (check_true( ((exp instanceof Array)&&((exp && exp.length)===2)))) {
                        (export_segment).push((exp && exp["0"]));
                        (export_segment).push(" as ");
                         return  (export_segment).push((exp && exp["1"]))
                    } else if (check_true( (exp instanceof String || typeof exp==='string'))) {
                         return (export_segment).push(exp)
                    } else  {
                         throw new SyntaxError(("Invalid export format: "+exp));
                        
                    }
                } ();
                if (check_true ((i<(len-1)))){
                     return  (export_segment).push(",")
                }
            }
        },(opts && opts["exports"]));
         (segments).push((export_segment).join(""))
    };
    if (check_true (write_file)){
        await (await Environment.get_global("write_text_file"))(output_filename,(segments).join("\n"));
        await (await Environment.get_global("success"))(("["+compile_time+"] compiled: "),((opts && opts["input_filename"])||(opts && opts["namespace"])||"anonymous"),"->",output_filename);
         return  output_filename
    } else {
        await (await Environment.get_global("warn"))("cannot compile: ",((opts && opts["input_filename"])||(opts && opts["namespace"])||"anonymous"));
         return  null
    }
},{ "name":"compile_buffer","fn_args":"(input_buffer export_function_name options)","description":["=:+","Given an input lisp file, and an optional initalizer function name and options ","object, compile the lisp file into a javascript file. The options object will ","allow the specification of an output path and filename, given by the key ","output_file.  If the initializer function isn't specified it is named ","initializer, which when used with load, will be automatically called ","one the file is loaded.  Otherwise the initializer function should be ","called when after dynamically importing, using dynamic_import. If the ","options object is to be used, with a default initializer, nil should be ","used as a placeholder for the initializer_function name.<br><br>","Options are as follows:<br><br>","js_headers: array: If provided, this is an array of strings that represent","lines to be inserted at the top of the file.","include_source: boolean: If provided will append the block forms and ","expressions within the text as comments.","output_file: string: If provided the path and filename of the compiled ","javascript file to be produced.","include_boilerplate: boolean: If set to false explicity, the boilerplate","code will be not be included in the build.","<br><br>","NOTE: this function's API is unstable and subject to change due to ","the early phase of this language."],"usage":["input_file:string","initializer_function:string?","options:object?"],"tags":["compile","environment","building","javascript","lisp","file","export"]
});
await Environment.set_global("compile_file",async function(lisp_file,export_function_name,options) {
    let input_components;
    let input_filename;
    let input_buffer;
    input_components=await (await Environment.get_global("path.parse"))(lisp_file);
    input_filename=await (await Environment.get_global("path.basename"))(lisp_file);
    input_buffer=null;
    input_buffer=await (await Environment.get_global("read_text_file"))(lisp_file);
    if (check_true (((input_components && input_components["ext"])===".lisp"))){
         input_buffer=await (await Environment.get_global("read_lisp"))(input_buffer,{
            implicit_progn:false,source_name:input_filename
        })
    };
     return  await (await Environment.get_global("compile_buffer"))(input_buffer,export_function_name,await (await Environment.get_global("add"))(new Object(),{
        input_filename:input_filename
    },await (async function() {
         if (check_true (options)){
              return options
        } else {
              return new Object()
        } 
    } )()))
},{ "name":"compile_file","fn_args":"(lisp_file export_function_name options)"
});
await Environment.set_global("rebuild_env",async function(opts) {
    let issues;
    let source_dir;
    let output_dir;
    let dcomps;
    let version_tag;
    let build_time;
    let build_headers;
    let include_source;
    let source_path;
    let output_path;
    issues=[];
    source_dir=((opts && opts["source_dir"])||"./src");
    output_dir=((opts && opts["output_dir"])||"./js");
    dcomps=await (await Environment.get_global("date_components"))(new Date());
    version_tag=await (async function () {
         if (check_true (await (await Environment.get_global("not"))(await (await Environment.get_global("blank?"))((opts && opts["version_tag"]))))){
              return (opts && opts["version_tag"])
        } else {
              return (await (async function(){
                let __array_op_rval__15=(dcomps && dcomps["year"]);
                 if (__array_op_rval__15 instanceof Function){
                    return await __array_op_rval__15((dcomps && dcomps["month"]),(dcomps && dcomps["day"]),(dcomps && dcomps["hour"]),(dcomps && dcomps["minute"])) 
                } else {
                    return[__array_op_rval__15,(dcomps && dcomps["month"]),(dcomps && dcomps["day"]),(dcomps && dcomps["hour"]),(dcomps && dcomps["minute"])]
                }
            })()).join(".")
        } 
    })();
    build_time=await (await Environment.get_global("formatted_date"))(new Date());
    build_headers=[];
    include_source=((opts && opts["include_source"])||false);
    source_path=async function(filename) {
         return  (await (async function(){
            let __array_op_rval__16=source_dir;
             if (__array_op_rval__16 instanceof Function){
                return await __array_op_rval__16(filename) 
            } else {
                return[__array_op_rval__16,filename]
            }
        })()).join((await Environment.get_global("path.sep")))
    };
    output_path=async function(filename) {
         return  (await (async function(){
            let __array_op_rval__17=output_dir;
             if (__array_op_rval__17 instanceof Function){
                return await __array_op_rval__17(filename) 
            } else {
                return[__array_op_rval__17,filename]
            }
        })()).join((await Environment.get_global("path.sep")))
    };
    await console.log("Environment Build Time: ",build_time);
    await console.log("Version Tag: ",version_tag);
    await console.log("Source Directory: ",source_dir);
    await console.log("Output Directory: ",output_dir);
    (build_headers).push(("// Build Time: "+build_time));
    (build_headers).push(("// Version: "+version_tag));
    (build_headers).push(("export const DLISP_ENV_VERSION='"+version_tag+"';"));
    await (await Environment.get_global("load"))(await source_path("reader.lisp"));
    await (await Environment.get_global("success"))("reloaded reader");
    await (await Environment.get_global("compile_file"))(await source_path("compiler.lisp"),"init_compiler",{
        output_file:await output_path("compiler.js"),include_source:include_source,build_headers:build_headers
    });
    await (await Environment.get_global("compile_file"))(await source_path("reader.lisp"),null,{
        output_file:await output_path("reader.js"),include_source:include_source,build_headers:build_headers
    });
    await (await Environment.get_global("compile_file"))(await source_path("environment.lisp"),"init_dlisp",{
        output_file:await output_path("environment.js"),include_source:include_source,toplevel:true,build_headers:build_headers
    });
    await (await Environment.get_global("compile_file"))(await source_path("compiler-boot-library.lisp"),"environment_boot",{
        output_file:await output_path("environment_boot.js"),include_source:include_source,build_headers:build_headers
    });
    await (await Environment.get_global("compile_file"))(await source_path("core.lisp"),"load_core",{
        output_file:await output_path("core.js"),include_source:include_source,build_headers:build_headers
    });
    await (await Environment.get_global("compile_file"))(await source_path("io.lisp"),null,{
        output_file:await output_path("io.js"),include_source:include_source,build_headers:build_headers
    });
    await (await Environment.get_global("success"))("complete");
     return  true
},{ "name":"rebuild_env","fn_args":"(opts)","description":["=:+","Builds the lisp environment from the Lisp sources and produces the Javascript output files ","necessary for initializing the environment. Options: <br>","source_dir:string:The directory of the Lisp sources, the default is './src'.<br>","output_dir:string:The directory to where the output Javascript files are placed.  The default is './js'.<br>","include_source:boolean:If true, the compiler will include comments of the lisp source (not fully supported yet).<br>","version_tag:string:A string based label signifying the text to use as the version.  If not specified, the version ","tag uses the format year.month.day.hour.minute.<br>"],"usage":["options:object?"],"tags":["compile","export","build","environment","javascript"]
});
 return  true
}
}
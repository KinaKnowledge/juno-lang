// Source: environment.lisp  
// Build Time: 2022-07-04 08:47:37
// Version: 2022.07.04.08.47
export const DLISP_ENV_VERSION='2022.07.04.08.47';




var { get_next_environment_id, check_true, get_outside_global, subtype, lisp_writer, clone, LispSyntaxError } = await import("./lisp_writer.js");
if (typeof AsyncFunction === "undefined") {
  globalThis.AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
}
export async function init_dlisp(Environment)  {
{
    let symname;
    symname="dlisp_env";
    {
        await async function(){
            globalThis[symname]=async function(opts) {
                {
                    let subtype=function subtype(value) {  if (value === null) return "null";  else if (value === undefined) return "undefined";  else if (value instanceof Array) return "array";  else if (value.constructor && value.constructor!=null && value.constructor.name!=='Object') {    return value.constructor.name;  }  return typeof value;};
                    let get_object_path=function(refname) {        if (check_true ((( refname["indexOf"].call(refname,".")>-1)||( refname["indexOf"].call(refname,"[")>-1)))){
            let chars;
            let comps;
            let mode;
            let name_acc;
            chars=(refname).split("");
            comps=[];
            mode=0;
            name_acc=[];
             ( function() {
                let __for_body__12=function(c) {
                     return    (function(){
                        if (check_true( ((c===".")&&(mode===0)))) {
                            (comps).push((name_acc).join(""));
                             return  name_acc=[]
                        } else if (check_true( ((mode===0)&&(c==="[")))) {
                            mode=1;
                            (comps).push((name_acc).join(""));
                             return  name_acc=[]
                        } else if (check_true( ((mode===1)&&(c==="]")))) {
                            mode=0;
                            (comps).push((name_acc).join(""));
                             return  name_acc=[]
                        } else  {
                             return (name_acc).push(c)
                        }
                    } )()
                };
                let __array__13=[],__elements__11=chars;
                let __BREAK__FLAG__=false;
                for(let __iter__10 in __elements__11) {
                    __array__13.push( __for_body__12(__elements__11[__iter__10]));
                    if(__BREAK__FLAG__) {
                         __array__13.pop();
                        break;
                        
                    }
                }return __array__13;
                 
            })();
            if (check_true (((name_acc && name_acc.length)>0))){
                 (comps).push((name_acc).join(""))
            };
             return  comps
        } else {
              return  ( function(){
                let __array_op_rval__14=refname;
                 if (__array_op_rval__14 instanceof Function){
                    return  __array_op_rval__14() 
                } else {
                    return[__array_op_rval__14]
                }
            })()
        }
    };
                    let get_outside_global=function get_outside_global(refname) {  try {    let tfn = new Function("{ if (typeof " + refname + " === 'undefined') { return undefined } else { return "+refname+" } }");    return tfn();  } catch (ex) {    return undefined;  }};
                    ;
                    if (check_true ((undefined==opts))){
                         opts=new Object()
                    };
                    let namespace=(opts.namespace||"core");
                    ;
                    let parent_environment=await (async function () {
                         if (check_true ((namespace==="core"))){
                              return null
                        } else {
                              return opts.parent_environment
                        } 
                    })();
                    ;
                    let active_namespace=namespace;
                    ;
                    let Environment={
                        global_ctx:{
                            scope:new Object(),name:namespace
                        },version:DLISP_ENV_VERSION,definitions:new Object(),declarations:{
                            safety:{
                                level:2
                            }
                        }
                    };
                    ;
                    let id=await get_next_environment_id();
                    ;
                    await async function(){
                        Environment["context"]=Environment.global_ctx;
                        return Environment;
                        
                    }();
                    let compiler=async function() {
                         return  true
                    };
                    ;
                    let compiler_operators=new Set();
                    ;
                    let special_identity=async function(v) {
                         return  v
                    };
                    ;
                    let MAX_SAFE_INTEGER=9007199254740991;
                    ;
                    await async function(){
                        Environment.global_ctx.scope["MAX_SAFE_INTEGER"]=MAX_SAFE_INTEGER;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let LispSyntaxError=globalThis.LispSyntaxError;
                    ;
                    await async function(){
                        Environment.global_ctx.scope["LispSyntaxError"]=LispSyntaxError;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let sub_type=subtype;
                    ;
                    await async function(){
                        Environment.global_ctx.scope["sub_type"]=sub_type;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let __VERBOSITY__=0;
                    ;
                    await async function(){
                        Environment.global_ctx.scope["__VERBOSITY__"]=__VERBOSITY__;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["__VERBOSITY__"]={
                            description:"Set __VERBOSITY__ to a positive integer for verbose console output of system activity.",tags:["debug","compiler","environment","global"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let int=parseInt;
                    ;
                    await async function(){
                        Environment.global_ctx.scope["int"]=int;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["int"]={
                            usage:"value:string|number",description:"Convenience method for parseInt, should be used in map vs. directly calling parseInt, which will not work directly",tags:["conversion","number"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let float=parseFloat;
                    ;
                    await async function(){
                        Environment.global_ctx.scope["float"]=float;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["float"]={
                            usage:"value:string|number",description:"Convenience method for parseFloat, should be used in map vs. directly calling parseFloat, which will not work directly",tags:["conversion","number"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let values=new Function("...args","{\n                                let acc = [];\n                                for (let _i in args) {\n                                    let value = args[_i];\n                                    let type = subtype(value);\n                                    if (value instanceof Set)  {\n                                        acc = acc.concat(Array.from(value));\n                                    } else if (type==='array') {\n                                        acc = acc.concat(value);\n                                    } else if (type==='object') {\n                                        acc = acc.concat(Object.values(value))\n                                    } else {\n                                        acc = acc.concat(value);\n                                    }\n                                }\n                                return acc;\n                            }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["values"]=values;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let pairs=new Function("obj","{\n                                    if (subtype(obj)==='array') {\n                                        let rval = [];\n                                        for (let i = 0; i < obj.length; i+=2) {\n                                            rval.push([obj[i],obj[i+1]]);\n                                        }\n                                        return rval;\n                                    } else {\n                                        let keys = Object.keys(obj);\n                                        let rval = keys.reduce(function(acc,x,i) {\n                                            acc.push([x,obj[x]])\n                                            return acc;\n                                        },[]);\n                                        return rval;\n                                    }\n                                }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["pairs"]=pairs;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let keys=new Function("obj","{  return Object.keys(obj);  }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["keys"]=keys;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let take=new Function("place","{ return place.shift() }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["take"]=take;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let prepend=new Function("place","thing","{ return place.unshift(thing) }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["prepend"]=prepend;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let first=new Function("x","{ return x[0] }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["first"]=first;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let last=new Function("x","{ return x[x.length - 1] }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["last"]=last;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let length=new Function("obj","{\n                                if(obj instanceof Array) {\n                                    return obj.length;\n                                } else if (obj instanceof Set) {\n                                    return obj.size;\n                                } else if ((obj === undefined)||(obj===null)) {\n                                    return 0;\n                                } else if (typeof obj==='object') {\n                                    return Object.keys(obj).length;\n                                } else if (typeof obj==='string') {\n                                    return obj.length;\n                                } \n                                return 0;\n                            }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["length"]=length;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let conj=new Function("...args","{   let list = [];\n                                if (args[0] instanceof Array) {\n                                    list = args[0];\n                                } else {\n                                    list = [args[0]];\n                                }\n                                args.slice(1).map(function(x) {\n                                    list = list.concat(x);\n                                });\n                                return list;\n                            }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["conj"]=conj;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let reverse=new Function("container","{ return container.slice(0).reverse }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["reverse"]=reverse;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["reverse"]={
                            usage:["container:list"],description:"Returns a copy of the passed list as reversed.  The original is not changed.",tags:["list","sort","order"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let map=new AsyncFunction("lambda","array_values","{ try {\n                                        let rval = [],\n                                                tl = array_values.length;\n                                        for (let i = 0; i < array_values.length; i++) {\n                                            rval.push(await lambda.apply(this,[array_values[i], i, tl]));\n                                         }\n                                        return rval;\n                                    } catch (ex) {           \n                                              if (lambda === undefined || lambda === null) {\n                                                    throw new ReferenceError(\"map: lambda argument (position 0) is undefined or nil\")\n                                              } else if (array_values === undefined || array_values === null) {\n                                                    throw new ReferenceError(\"map: container argument (position 1) is undefined or nil\")\n                                              } else if (!(lambda instanceof Function)) {\n                                                    throw new ReferenceError(\"map: lambda argument must be a function: received: \"+ typeof lambda)\n                                              } else if (!(array_values instanceof Array)) {\n                                                    throw new ReferenceError(\"map: invalid array argument, received: \" + typeof array_values)\n                                              } else {\n                                                    // something else just pass on the error\n                                                throw ex;\n                                              }\n                                    }\n                              }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["map"]=map;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let bind=new Function("func,this_arg","{ return func.bind(this_arg) }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["bind"]=bind;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let to_object=new Function("array_values","{\n                                      let obj={}\n                                      array_values.forEach((pair)=>{\n                                             obj[pair[0]]=pair[1]\n                                      });\n                                      return obj;\n                                    }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["to_object"]=to_object;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["to_object"]={
                            description:("Given an array of pairs in the form of [[key value] [key value] ...], constructs an "+"object with the first array element of the pair as the key and the second "+"element as the value. A single object is returned."),usage:["paired_array:array"],tags:["conversion","object","array","list","pairs"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let to_array=async function(container) {
                         return  await async function(){
                            if (check_true( (container instanceof Array))) {
                                 return container
                            } else if (check_true( await (await get_global("is_set?"))(container))) {
                                let acc=[];
                                ;
                                await container["forEach"].call(container,async function(v) {
                                     return  (acc).push(v)
                                });
                                 return  acc
                            } else if (check_true( (container instanceof String || typeof container==='string'))) {
                                 return (container).split("")
                            } else if (check_true( (container instanceof Object))) {
                                 return await pairs(container)
                            } else  {
                                 return await (async function(){
                                    let __array_op_rval__27=container;
                                     if (__array_op_rval__27 instanceof Function){
                                        return await __array_op_rval__27() 
                                    } else {
                                        return[__array_op_rval__27]
                                    }
                                })()
                            }
                        } ()
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["to_array"]=to_array;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["to_array"]={
                            description:("Given a container of type Array, Set, Object, or a string, "+"it will convert the members of the container to an array form, "+"and return a new array with the values of the provided container. "+"In the case of an object, the keys and values will be contained in "+"paired arrays in the returned array.  A string will be split into "+"individual characters. If provided a different "+"type other than the listed values above, the value will be placed "+"in an array as a single element."),usage:["container:*"],tags:["list","array","conversion","set","object","string","pairs"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let slice=function(target,from,to) {
                         return    (function(){
                            if (check_true(to)) {
                                 return  target["slice"].call(target,from,to)
                            } else if (check_true(from)) {
                                 return  target["slice"].call(target,from)
                            } else  {
                                 throw new SyntaxError("slice requires 2 or 3 arguments");
                                
                            }
                        } )()
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["slice"]=slice;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let rest=function(x) {
                         return    (function(){
                            if (check_true( (x instanceof Array))) {
                                 return  x["slice"].call(x,1)
                            } else if (check_true( (x instanceof String || typeof x==='string'))) {
                                 return  x["substr"].call(x,1)
                            } else  {
                                 return null
                            }
                        } )()
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["rest"]=rest;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let second=new Function("x","{ return x[1] }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["second"]=second;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let third=new Function("x","{ return x[2] }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["third"]=third;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let chop=new Function("x","{ if (x instanceof Array) { return x.slice(0, x.length-1) } else { return x.substr(0,x.length-1) } }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["chop"]=chop;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let chomp=new Function("x","{ return x.substr(x.length-1) }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["chomp"]=chomp;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let not=new Function("x","{ if (check_true(x)) { return false } else { return true } }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["not"]=not;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let push=new Function("place","thing","{ return place.push(thing) }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["push"]=push;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let pop=new Function("place","{ return place.pop() }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["pop"]=pop;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let list=async function(...args) {
                         return  args
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["list"]=list;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let flatten=new Function("x","{ return x.flat(999999999999) } ");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["flatten"]=flatten;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let jslambda=function(...args) {
                         return   ( function(){
                            let __apply_args__41= flatten(args);
                            return ( Function).apply(this,__apply_args__41)
                        })()
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["jslambda"]=jslambda;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let join=function(...args) {
                         return    (function(){
                            if (check_true( (args.length===1))) {
                                 return  args['0']["join"].call(args['0'],"")
                            } else  {
                                 return  args['1']["join"].call(args['1'],args['0'])
                            }
                        } )()
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["join"]=join;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let lowercase=function(x) {
                         return   x["toLowerCase"]()
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["lowercase"]=lowercase;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let uppercase=function(x) {
                         return   x["toUpperCase"]()
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["uppercase"]=uppercase;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let log=function(...args) {
                         return   ( function(){
                            return ( console.log).apply(this,args)
                        })()
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["log"]=log;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let split=new Function("container","token","{ return container.split(token) }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["split"]=split;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let split_by=new Function("token","container","{ return container.split(token) }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["split_by"]=split_by;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let is_object_ques_=new Function("x","{ return x instanceof Object }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["is_object?"]=is_object_ques_;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["is_object?"]={
                            description:"for the given value x, returns true if x is an Javascript object type.",usage:["arg:value"],tags:["type","condition","subtype","value","what"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let is_array_ques_=new Function("x","{ return x instanceof Array }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["is_array?"]=is_array_ques_;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["is_array?"]={
                            description:"for the given value x, returns true if x is an array.",usage:["arg:value"],tags:["type","condition","subtype","value","what"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let is_number_ques_=function(x) {
                         return  ( subtype(x)==="Number")
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["is_number?"]=is_number_ques_;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["is_number?"]={
                            description:"for the given value x, returns true if x is a number.",usage:["arg:value"],tags:["type","condition","subtype","value","what","function"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let is_function_ques_=function(x) {
                         return  (x instanceof Function)
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["is_function?"]=is_function_ques_;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["is_function?"]={
                            description:"for the given value x, returns true if x is a function.",usage:["arg:value"],tags:["type","condition","subtype","value","what","function"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let is_set_ques_=new Function("x","{ return x instanceof Set }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["is_set?"]=is_set_ques_;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["is_set?"]={
                            description:"for the given value x, returns true if x is a set.",usage:["arg:value"],tags:["type","condition","subtype","value","what"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let is_element_ques_=new Function("x","{ return x instanceof Element }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["is_element?"]=is_element_ques_;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["is_element?"]={
                            description:"for the given value x, returns true if x is an Element object",usage:["arg:value"],tags:["type","condition","subtype","value","what"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let is_string_ques_=function(x) {
                         return  ((x instanceof String)||(typeof x==="string"))
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["is_string?"]=is_string_ques_;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["is_string?"]={
                            description:"for the given value x, returns true if x is a String object",usage:["arg:value"],tags:["type","condition","subtype","value","what"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let is_nil_ques_=function(x) {
                         return  (x===null)
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["is_nil?"]=is_nil_ques_;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["is_nil?"]={
                            description:"for the given value x, returns true if x is exactly equal to nil.",usage:["arg:value"],tags:["type","condition","subtype","value","what"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let is_regex_ques_=function(x) {
                         return  ( sub_type(x)==="RegExp")
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["is_regex?"]=is_regex_ques_;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["is_regex?"]={
                            description:"for the given value x, returns true if x is a Javascript regex object",usage:["arg:value"],tags:["type","condition","subtype","value","what"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let is_date_ques_=function(x) {
                         return  ( sub_type(x)==="Date")
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["is_date?"]=is_date_ques_;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["is_date?"]={
                            description:"for the given value x, returns true if x is a Date object.",usage:["arg:value"],tags:["type","condition","subtype","value","what"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let ends_with_ques_=new Function("val","text","{ if (text instanceof Array) { return text[text.length-1]===val } else if (subtype(text)=='String') { return text.endsWith(val) } else { return false }}");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["ends_with?"]=ends_with_ques_;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["ends_with?"]={
                            description:"for a given string or array, checks to see if it ends with the given start_value.  Non string args return false.",usage:["end_value:value","collection:array|string"],tags:["string","text","list","array","filter","reduce"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let starts_with_ques_=new Function("val","text","{ if (text instanceof Array) { return text[0]===val } else if (subtype(text)=='String') { return text.startsWith(val) } else { return false }}");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["starts_with?"]=starts_with_ques_;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["starts_with?"]={
                            description:"for a given string or array, checks to see if it starts with the given start_value.  Non string args return false.",usage:["start_value:value","collection:array|string"],tags:["string","text","list","array","filter","reduce","begin"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let blank_ques_=function(val) {
                         return  ((val==null)||((val instanceof String || typeof val==='string')&&(val==="")))
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["blank?"]=blank_ques_;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let contains_ques_=new Function("value","container","{ if (!value && !container) { return false }\n                           else if (container === null) { throw new TypeError(\"contains?: passed nil/undefined container value\"); }\n                           else if ((container instanceof String) || typeof container === \"string\") {\n                                if (subtype(value) === \"Number\") return container.indexOf(\"\"+value)>-1;\n                                else return container.indexOf(value)>-1;\n                           }\n                           else if (container instanceof Array) return container.includes(value);\n                           else if (container instanceof Set) return container.has(value);\n                           else throw new TypeError(\"contains?: passed invalid container type: \"+subtype(container)) }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["contains?"]=contains_ques_;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let make_set=function(vals) {
                        if (check_true ((vals instanceof Array))){
                              return new Set(vals)
                        } else {
                            let vtype;
                            vtype= sub_type(vals);
                             return    (function(){
                                if (check_true( (vtype==="Set"))) {
                                     return new Set(vals)
                                } else if (check_true( (vtype==="object"))) {
                                     return new Set( values(vals))
                                }
                            } )()
                        }
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["make_set"]=make_set;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let describe=async function(quoted_symbol) {
                        let not_found;
                        let location;
                        let result;
                        not_found={
                            not_found:true
                        };
                        location=await async function(){
                            if (check_true( Environment.global_ctx.scope[quoted_symbol])) {
                                 return "global"
                            } else if (check_true( await not((undefined===await get_outside_global(quoted_symbol))))) {
                                 return "external"
                            } else  {
                                 return null
                            }
                        } ();
                        result=null;
                        result=await (await get_global("add"))({
                            type:await async function(){
                                if (check_true( (location==="global"))) {
                                     return await sub_type(Environment.global_ctx.scope[quoted_symbol])
                                } else if (check_true( (location==="external"))) {
                                     return await sub_type(await get_outside_global(quoted_symbol))
                                } else  {
                                     return "undefined"
                                }
                            } (),location:location,name:quoted_symbol
                        },await (async function() {
                             if (check_true (Environment.definitions[quoted_symbol])){
                                  return Environment.definitions[quoted_symbol]
                            } else {
                                  return new Object()
                            } 
                        } )());
                        if (check_true (result.description)){
                             await async function(){
                                result["description"]=await Environment["eval"].call(Environment,result.description);
                                return result;
                                
                            }()
                        };
                         return  result
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["describe"]=describe;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let undefine=function(quoted_symbol) {
                        if (check_true (Environment.global_ctx.scope[quoted_symbol])){
                             ( get_global("delete_prop"))(Environment.definitions,quoted_symbol);
                             return   ( get_global("delete_prop"))(Environment.global_ctx.scope,quoted_symbol)
                        } else {
                              return false
                        }
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["undefine"]=undefine;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let eval_exp=async function(expression) {
                        await console.log("EVAL:",expression);
                         return  await (async function(){
                            let __array_op_rval__82=expression;
                             if (__array_op_rval__82 instanceof Function){
                                return await __array_op_rval__82() 
                            } else {
                                return[__array_op_rval__82]
                            }
                        })()
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["eval_exp"]=eval_exp;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let indirect_new=new Function("...args","{\n                                    let targetClass = args[0];\n                                    if (subtype(targetClass)===\"String\") {\n                                        let tmpf=new Function(\"{ return \"+targetClass+\" }\");\n                                        targetClass = tmpf();\n                                    }\n                                    if (args.length==1) {\n                                        let f = function(Class) {\n                                            return new (Function.prototype.bind.apply(Class, args));\n                                        }\n                                        let rval = f.apply(this,[targetClass]);\n                                        return rval;\n                                    } else {\n                                        let f = function(Class) {\n                                            return new (Function.prototype.bind.apply(Class, args));\n                                        }\n                                        let rval = f.apply(this,[targetClass].concat(args.slice(1)));\n                                        return rval;\n                                    }}");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["indirect_new"]=indirect_new;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let range=function(...args) {
                        let from_to;
                        let step;
                        let idx;
                        let acc;
                        from_to= ( function () {
                             if (check_true (args['1'])){
                                  return [parseInt(args['0']),parseInt(args['1'])]
                            } else {
                                  return [0,parseInt(args['0'])]
                            } 
                        })();
                        step= ( function () {
                             if (check_true (args['2'])){
                                  return parseFloat(args['2'])
                            } else {
                                  return 1
                            } 
                        })();
                        idx=from_to['0'];
                        acc=[];
                         ( function(){
                             let __test_condition__85=function() {
                                 return  (idx<from_to['1'])
                            };
                            let __body_ref__86=function() {
                                (acc).push(idx);
                                 return  idx+=step
                            };
                            let __BREAK__FLAG__=false;
                            while( __test_condition__85()) {
                                 __body_ref__86();
                                 if(__BREAK__FLAG__) {
                                     break;
                                    
                                }
                            } ;
                            
                        })();
                         return  acc
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["range"]=range;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let add=new Function("...args","{\n                                let acc;\n                                if (typeof args[0]===\"number\") {\n                                    acc = 0;\n                                } else if (args[0] instanceof Array) {\n                                    return args[0].concat(args.slice(1));\n                                } else if (typeof args[0]==='object') {\n                                   let rval = {};\n                                   for (let i in args) {\n                                        if (typeof args[i] === 'object') {\n                                            for (let k in args[i]) {\n                                                rval[k] = args[i][k];\n                                            }\n                                        }\n                                   }\n                                   return rval;\n                                } else {\n                                    acc = \"\";\n                                }\n                                for (let i in args) {\n                                    acc += args[i];\n                                }\n                                return acc;\n                             }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["add"]=add;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let merge_objects=new Function("x","{\n                                    let rval = {};\n                                    for (let i in x) {\n                                        if (typeof i === 'object') {\n                                            for (let k in x[i]) {\n                                                rval[k] = x[i][k];\n                                            }\n                                        }\n                                    }\n                                    return rval;\n                                 }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["merge_objects"]=merge_objects;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let index_of=new Function("value","container",("{ return container.indexOf(value) }"));
                    ;
                    await async function(){
                        Environment.global_ctx.scope["index_of"]=index_of;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let resolve_path=new Function("path,obj","{\n                                        if (typeof path==='string') {\n                                            path = path.split(\".\");\n                                        }\n                                        let s=obj;\n                                        return path.reduce(function(prev, curr) {\n                                            return prev ? prev[curr] : undefined\n                                        }, obj || {})\n                                    }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["resolve_path"]=resolve_path;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let delete_prop=new Function("obj","...args","{\n                                        if (args.length == 1) {\n                                            return delete obj[args[0]];\n                                        } else {\n                                            while (args.length > 0) {\n                                                let prop = args.shift();\n                                                delete obj[prop];\n                                            }\n                                        }\n                                        return obj;\n                                    }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["delete_prop"]=delete_prop;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let min_value=new Function("elements","{ return Math.min(...elements); }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["min_value"]=min_value;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let max_value=new Function("elements","{ return Math.max(...elements); }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["max_value"]=max_value;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let interlace=async function(...args) {
                        let min_length;
                        let rlength_args;
                        let rval;
                        min_length=await min_value(await map(length,args));
                        rlength_args=await range(await length(args));
                        rval=[];
                        await (async function() {
                            let __for_body__97=async function(i) {
                                 return  await (async function() {
                                    let __for_body__101=async function(j) {
                                         return  (rval).push(await (async function(){
                                            let __targ__103=args[j];
                                            if (__targ__103){
                                                 return(__targ__103)[i]
                                            } 
                                        })())
                                    };
                                    let __array__102=[],__elements__100=rlength_args;
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__99 in __elements__100) {
                                        __array__102.push(await __for_body__101(__elements__100[__iter__99]));
                                        if(__BREAK__FLAG__) {
                                             __array__102.pop();
                                            break;
                                            
                                        }
                                    }return __array__102;
                                     
                                })()
                            };
                            let __array__98=[],__elements__96=await range(min_length);
                            let __BREAK__FLAG__=false;
                            for(let __iter__95 in __elements__96) {
                                __array__98.push(await __for_body__97(__elements__96[__iter__95]));
                                if(__BREAK__FLAG__) {
                                     __array__98.pop();
                                    break;
                                    
                                }
                            }return __array__98;
                             
                        })();
                         return  rval
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["interlace"]=interlace;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["interlace"]={
                            usage:["list0:array","list1:array","listn?:array"],description:"Returns a list containing a consecutive values from each list, in argument order.  I.e. list0.0 list1.0 listn.0 list0.1 list1.1 listn.1 ...",tags:["list","array","join","merge"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let trim=function(x) {
                         return   x["trim"]()
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["trim"]=trim;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let assert=function(assertion_form,failure_message) {
                        if (check_true (assertion_form)){
                              return assertion_form
                        } else throw new EvalError((failure_message||"assertion failure"));
                        
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["assert"]=assert;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["assert"]={
                            description:"If the evaluated assertion form is true, the result is returned, otherwise an EvalError is thrown with the optionally provided failure message.",usage:["form:*","failure_message:string?"],tags:["true","error","check","debug","valid","assertion"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let unquotify=async function(val) {
                        let dval;
                        dval=val;
                        if (check_true (await (await get_global("starts_with?"))("\"",dval))){
                             dval=await dval["substr"].call(dval,1,(dval.length-2))
                        };
                        if (check_true (await (await get_global("starts_with?"))("=:",dval))){
                             dval=await dval["substr"].call(dval,2)
                        };
                         return  dval
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["unquotify"]=unquotify;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["unquotify"]={
                            description:"Removes binding symbols and quotes from a supplied value.  For use in compile time function such as macros.",usage:["val:string"],tags:["macro","quote","quotes","desym"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let or_args=async function(argset) {
                        let is_true;
                        is_true=false;
                        await (async function() {
                            let __for_body__113=async function(elem) {
                                if (check_true (elem)){
                                    is_true=true;
                                    __BREAK__FLAG__=true;
                                    return
                                }
                            };
                            let __array__114=[],__elements__112=argset;
                            let __BREAK__FLAG__=false;
                            for(let __iter__111 in __elements__112) {
                                __array__114.push(await __for_body__113(__elements__112[__iter__111]));
                                if(__BREAK__FLAG__) {
                                     __array__114.pop();
                                    break;
                                    
                                }
                            }return __array__114;
                             
                        })();
                         return  is_true
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["or_args"]=or_args;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let special_operators=async function() {
                         return  await make_set(await compiler([],{
                            special_operators:true,env:Environment
                        }))
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["special_operators"]=special_operators;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let defclog=async function(opts) {
                        let style;
                        style=("padding: 5px;"+await (async function () {
                             if (check_true (opts.background)){
                                  return ("background: "+opts.background+";")
                            } else {
                                  return ""
                            } 
                        })()+await (async function () {
                             if (check_true (opts.color)){
                                  return ("color: "+opts.color+";")
                            } 
                        })()+"");
                         return  async function(...args) {
                             return  await (async function(){
                                let __target_arg__119=[].concat(await conj(await (async function(){
                                    let __array_op_rval__120=style;
                                     if (__array_op_rval__120 instanceof Function){
                                        return await __array_op_rval__120() 
                                    } else {
                                        return[__array_op_rval__120]
                                    }
                                })(),args));
                                if(!__target_arg__119 instanceof Array){
                                    throw new TypeError("Invalid final argument to apply - an array is required")
                                }let __pre_arg__121=("%c"+await (async function () {
                                     if (check_true (opts.prefix)){
                                          return opts.prefix
                                    } else {
                                          return (args).shift()
                                    } 
                                })());
                                __target_arg__119.unshift(__pre_arg__121);
                                return (console.log).apply(this,__target_arg__119)
                            })()
                        }
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["defclog"]=defclog;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let NOT_FOUND=new ReferenceError("not found");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["NOT_FOUND"]=NOT_FOUND;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let check_external_env_default=await (async function () {
                         if (check_true ((namespace==="core"))){
                              return true
                        } else {
                              return false
                        } 
                    })();
                    ;
                    await async function(){
                        Environment.global_ctx.scope["check_external_env_default"]=check_external_env_default;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let _star_namespace_star_=namespace;
                    ;
                    await async function(){
                        Environment.global_ctx.scope["*namespace*"]=_star_namespace_star_;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let set_global=function(refname,value,meta,is_constant,target_namespace) {
                        {
                              (function(){
                                if (check_true(  not((typeof refname==="string")))) {
                                     throw new TypeError("reference name must be a string type");
                                    
                                } else if (check_true( ((Environment===value)||(Environment.global_ctx===value)||(Environment.global_ctx.scope===value)))) {
                                     throw new EvalError("cannot set the environment scope as a global value");
                                    
                                }
                            } )();
                            if (check_true ( resolve_path( ( function(){
                                let __array_op_rval__126=refname;
                                 if (__array_op_rval__126 instanceof Function){
                                    return  __array_op_rval__126("constant") 
                                } else {
                                    return[__array_op_rval__126,"constant"]
                                }
                            })(),Environment.definitions))){
                                throw new TypeError(("Assignment to constant variable "+refname));
                                
                            };
                            let namespace_identity= ( function () {
                                 if (check_true (target_namespace)){
                                      return  ( function(){
                                        let __array_op_rval__127=target_namespace;
                                         if (__array_op_rval__127 instanceof Function){
                                            return  __array_op_rval__127(refname) 
                                        } else {
                                            return[__array_op_rval__127,refname]
                                        }
                                    })()
                                } else {
                                      return (refname).split("/")
                                } 
                            })();
                            ;
                             return    (function(){
                                if (check_true( (parent_environment&&(namespace_identity.length>1)&& not((namespace===namespace_identity['0']))))) {
                                     return  parent_environment["set_global"].call(parent_environment,namespace_identity['1'],value,meta,is_constant,namespace_identity['0'])
                                } else if (check_true( ((namespace_identity.length>1)&& not((namespace_identity['0']===namespace))))) {
                                    if (check_true (children[namespace_identity['0']])){
                                          return  ( function() {
                                            {
                                                 let __call_target__=children[namespace_identity['0']], __call_method__="set_global";
                                                return  __call_target__[__call_method__].call(__call_target__,namespace_identity['1'],value,meta,is_constant,namespace_identity['0'])
                                            } 
                                        })()
                                    } else throw new EvalError(("namespace "+namespace_identity['0']+" doesn't exist"));
                                    
                                } else  {
                                    let comps= get_object_path( ( function() {
                                         if (check_true ((1===namespace_identity.length))){
                                              return namespace_identity['0']
                                        } else {
                                              return namespace_identity['1']
                                        } 
                                    } )());
                                    ;
                                      (function(){
                                        Environment.global_ctx.scope[comps['0']]=value;
                                        return Environment.global_ctx.scope;
                                        
                                    })();
                                    if (check_true (((meta instanceof Object)&& not((meta instanceof Array))))){
                                        if (check_true (is_constant)){
                                               (function(){
                                                meta["constant"]=true;
                                                return meta;
                                                
                                            })()
                                        };
                                           (function(){
                                            Environment.definitions[comps['0']]=meta;
                                            return Environment.definitions;
                                            
                                        })()
                                    } else {
                                         if (check_true (is_constant)){
                                               (function(){
                                                Environment.definitions[comps['0']]={
                                                    constant:true
                                                };
                                                return Environment.definitions;
                                                
                                            })()
                                        }
                                    };
                                     return  Environment.global_ctx.scope[namespace_identity['1']]
                                }
                            } )()
                        }
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["set_global"]=set_global;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let get_global=function(refname,value_if_not_found,suppress_check_external_env,target_namespace,path_comps) {
                         return    (function(){
                            if (check_true(  not((typeof refname==="string")))) {
                                 throw new TypeError("reference name must be a string type");
                                
                            } else if (check_true( (refname==="Environment"))) {
                                 return Environment
                            } else if (check_true(  compiler_operators["has"].call(compiler_operators,refname))) {
                                 return special_identity
                            } else  {
                                let namespace_identity;
                                let comps;
                                let refval;
                                let symbol_name;
                                let check_external_env;
                                namespace_identity= ( function () {
                                     if (check_true (target_namespace)){
                                          return  ( function(){
                                            let __array_op_rval__133=target_namespace;
                                             if (__array_op_rval__133 instanceof Function){
                                                return  __array_op_rval__133(refname) 
                                            } else {
                                                return[__array_op_rval__133,refname]
                                            }
                                        })()
                                    } else {
                                          return (refname).split("/")
                                    } 
                                })();
                                comps=(path_comps|| get_object_path( ( function() {
                                     if (check_true ((1===namespace_identity.length))){
                                          return namespace_identity['0']
                                    } else {
                                          return namespace_identity['1']
                                    } 
                                } )()));
                                refval=null;
                                symbol_name=null;
                                check_external_env= ( function () {
                                     if (check_true (suppress_check_external_env)){
                                          return false
                                    } else {
                                          return check_external_env_default
                                    } 
                                })();
                                 return    (function(){
                                    if (check_true( (parent_environment&&(namespace_identity.length>1)&& not((namespace_identity['0']===namespace))))) {
                                         return  parent_environment["get_global"].call(parent_environment,namespace_identity['1'],value_if_not_found,suppress_check_external_env,namespace_identity['0'],comps)
                                    } else if (check_true( ((namespace_identity.length>1)&& not((namespace_identity['0']===namespace))))) {
                                        if (check_true (children[namespace_identity['0']])){
                                              return  ( function() {
                                                {
                                                     let __call_target__=children[namespace_identity['0']], __call_method__="get_global";
                                                    return  __call_target__[__call_method__].call(__call_target__,namespace_identity['1'],value_if_not_found,suppress_check_external_env,namespace_identity['0'],comps)
                                                } 
                                            })()
                                        } else throw new EvalError(("namespace "+namespace_identity['0']+" doesn't exist"));
                                        
                                    } else  {
                                        refval=Environment.global_ctx.scope[comps['0']];
                                        if (check_true (((undefined===refval)&&(namespace_identity.length===1)&&parent_environment))){
                                            let rval= parent_environment["get_global"].call(parent_environment,refname,value_if_not_found,suppress_check_external_env,null,comps);
                                            ;
                                             return  rval
                                        } else {
                                            if (check_true (((undefined===refval)&&check_external_env))){
                                                 refval= ( function () {
                                                     if (check_true (check_external_env)){
                                                          return ( get_outside_global(comps['0'])||NOT_FOUND)
                                                    } else {
                                                          return NOT_FOUND
                                                    } 
                                                })()
                                            };
                                             return    (function(){
                                                if (check_true( (NOT_FOUND===refval))) {
                                                     return (value_if_not_found||NOT_FOUND)
                                                } else if (check_true( (comps.length===1))) {
                                                     return refval
                                                } else if (check_true( (comps.length>1))) {
                                                     return   resolve_path( rest(comps),refval)
                                                } else  {
                                                     console.warn("get_global: condition fall through: ",comps);
                                                     return  NOT_FOUND
                                                }
                                            } )()
                                        }
                                    }
                                } )()
                            }
                        } )()
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["get_global"]=get_global;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let symbol_definition=async function(symname,target_namespace) {
                        let namespace_identity;
                        namespace_identity=await (async function () {
                             if (check_true (target_namespace)){
                                  return await (async function(){
                                    let __array_op_rval__135=target_namespace;
                                     if (__array_op_rval__135 instanceof Function){
                                        return await __array_op_rval__135(symname) 
                                    } else {
                                        return[__array_op_rval__135,symname]
                                    }
                                })()
                            } else {
                                  return (symname).split("/")
                            } 
                        })();
                         return  await async function(){
                            if (check_true( (namespace_identity.length===1))) {
                                let it;
                                it=Environment.definitions[symname];
                                if (check_true (it)){
                                      return it
                                } else {
                                     if (check_true (parent_environment)){
                                          return await parent_environment["symbol_definition"].call(parent_environment,symname)
                                    }
                                }
                            } else if (check_true( (namespace_identity['0']===namespace))) {
                                 return Environment.definitions[symname]
                            } else if (check_true(parent_environment)) {
                                 return await parent_environment["symbol_definition"].call(parent_environment,namespace_identity['1'],namespace_identity['0'])
                            } else  {
                                 return undefined
                            }
                        } ()
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["symbol_definition"]=symbol_definition;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let compile=async function(json_expression,opts) {
                        let out;
                        opts=await add({
                            env:Environment
                        },opts,{
                            meta:false
                        });
                        out=null;
                        if (check_true (json_expression instanceof Function))throw new SyntaxError("compile: non-JSON value (function) received as input");
                        ;
                        out=await compiler(json_expression,opts);
                         return  await async function(){
                            if (check_true( ((out instanceof Array)&&out['0'].ctype&&(out['0'].ctype==="FAIL")))) {
                                 return out
                            } else if (check_true(opts.meta)) {
                                 return out
                            } else  {
                                 return out['1']
                            }
                        } ()
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["compile"]=compile;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["compile"]={
                            description:("Compiles the given JSON or quoted lisp and returns a string containing "+"the lisp form or expression as javascript.<br>"+"If passed the option { meta: true } , an array is returned containing compilation metadata "+"in element 0 and the compiled code in element 1."),usage:["json_expression:*","opts:object"],tags:["macro","quote","quotes","desym"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let env_log=await defclog({
                        prefix:("env"+id),background:"#B0F0C0"
                    });
                    ;
                    await async function(){
                        Environment.global_ctx.scope["env_log"]=env_log;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let evaluate_local=async function(expression,ctx,opts) {
                        let compiled;
                        let error_data;
                        let result;
                        opts=(opts||new Object());
                        compiled=null;
                        error_data=null;
                        result=null;
                        if (check_true (opts.compiled_source)){
                             compiled=expression
                        } else {
                             await (async function(){
                                try /* TRY SIMPLE */ {
                                      return compiled=await compiler(await (async function() {
                                         if (check_true (opts.json_in)){
                                              return expression
                                        } else {
                                              return await Environment["read_lisp"].call(Environment,expression,{
                                                source_name:opts.source_name
                                            })
                                        } 
                                    } )(),{
                                        env:Environment,ctx:ctx,formatted_output:true,source_name:opts.source_name,throw_on_error:opts.throw_on_error,error_report:(opts.error_report||null),quiet_mode:(opts.quiet_mode||false)
                                    }) 
                                } catch(__exception__140) {
                                      if (__exception__140 instanceof Error) {
                                         let e=__exception__140;
                                         {
                                            if (check_true (opts.throw_on_error)){
                                                throw e;
                                                
                                            };
                                            if (check_true ((e instanceof LispSyntaxError))){
                                                 await async function(){
                                                    e["message"]=await JSON.parse(e.message);
                                                    return e;
                                                    
                                                }()
                                            };
                                            await async function(){
                                                if (check_true( (e instanceof LispSyntaxError))) {
                                                     return error_data=await add({
                                                        error:"LispSyntaxError"
                                                    },e.message)
                                                } else  {
                                                     return error_data={
                                                        error:await sub_type(e),message:e.message,stack:e.stack,form:await async function(){
                                                            if (check_true( ((expression instanceof String || typeof expression==='string')&&(expression.length>100)))) {
                                                                 return await add(await expression["substr"].call(expression,0,100),"...")
                                                            } else  {
                                                                 return await (await get_global("as_lisp"))(expression)
                                                            }
                                                        } (),parent_forms:[],source_name:opts.source_name,invalid:true
                                                    }
                                                }
                                            } ();
                                            if (check_true (opts.error_report)){
                                                  return await (async function(){
                                                    let __array_op_rval__142=opts.error_report;
                                                     if (__array_op_rval__142 instanceof Function){
                                                        return await __array_op_rval__142(error_data) 
                                                    } else {
                                                        return[__array_op_rval__142,error_data]
                                                    }
                                                })()
                                            } else {
                                                  return await console.error("Compilation Error: ",error_data)
                                            };
                                             compiled=[{
                                                error:true
                                            },null]
                                        }
                                    } 
                                }
                            })()
                        };
                        if (check_true (opts.on_compilation_complete)){
                             await (async function(){
                                let __array_op_rval__143=opts.on_compilation_complete;
                                 if (__array_op_rval__143 instanceof Function){
                                    return await __array_op_rval__143(compiled) 
                                } else {
                                    return[__array_op_rval__143,compiled]
                                }
                            })()
                        };
                        await (async function(){
                            try /* TRY COMPLEX */ {
                                 return  result=await async function(){
                                    if (check_true(compiled.error)) {
                                         throw new Error((await get_global("indirect_new"))(compiled.error,compiled.message));
                                        
                                    } else if (check_true( (compiled['0'].ctype&&(await (await get_global("contains?"))("block",compiled['0'].ctype)||(compiled['0'].ctype==="assignment")||(compiled['0'].ctype==="__!NOT_FOUND!__"))))) {
                                         if (check_true (await (async function(){
                                            let __array_op_rval__145=compiled['0'].has_lisp_globals;
                                             if (__array_op_rval__145 instanceof Function){
                                                return await __array_op_rval__145() 
                                            } else {
                                                return[__array_op_rval__145]
                                            }
                                        })())){
                                            await async function(){
                                                compiled[1]=new AsyncFunction("Environment",("{ "+compiled['1']+"}"));
                                                return compiled;
                                                
                                            }();
                                             return  await (async function(){
                                                let __array_op_rval__147=compiled['1'];
                                                 if (__array_op_rval__147 instanceof Function){
                                                    return await __array_op_rval__147(Environment) 
                                                } else {
                                                    return[__array_op_rval__147,Environment]
                                                }
                                            })()
                                        } else {
                                            await async function(){
                                                compiled[1]=new AsyncFunction(("{"+compiled['1']+"}"));
                                                return compiled;
                                                
                                            }();
                                             return  await (async function(){
                                                let __array_op_rval__149=compiled['1'];
                                                 if (__array_op_rval__149 instanceof Function){
                                                    return await __array_op_rval__149() 
                                                } else {
                                                    return[__array_op_rval__149]
                                                }
                                            })()
                                        }
                                    } else if (check_true( (compiled['0'].ctype&&(("AsyncFunction"===compiled['0'].ctype)||("statement"===compiled['0'].ctype)||("objliteral"===compiled['0'].ctype))))) {
                                        if (check_true (await (async function(){
                                            let __array_op_rval__150=compiled['0'].has_lisp_globals;
                                             if (__array_op_rval__150 instanceof Function){
                                                return await __array_op_rval__150() 
                                            } else {
                                                return[__array_op_rval__150]
                                            }
                                        })())){
                                            await async function(){
                                                compiled[1]=new AsyncFunction("Environment",("{ return "+compiled['1']+"} "));
                                                return compiled;
                                                
                                            }();
                                             return  await (async function(){
                                                let __array_op_rval__152=compiled['1'];
                                                 if (__array_op_rval__152 instanceof Function){
                                                    return await __array_op_rval__152(Environment) 
                                                } else {
                                                    return[__array_op_rval__152,Environment]
                                                }
                                            })()
                                        } else {
                                            await async function(){
                                                compiled[1]=new AsyncFunction(("{ return "+compiled['1']+"}"));
                                                return compiled;
                                                
                                            }();
                                             return  await (async function(){
                                                let __array_op_rval__154=compiled['1'];
                                                 if (__array_op_rval__154 instanceof Function){
                                                    return await __array_op_rval__154() 
                                                } else {
                                                    return[__array_op_rval__154]
                                                }
                                            })()
                                        }
                                    } else if (check_true( (compiled['0'].ctype&&("Function"===compiled['0'].ctype)))) {
                                        if (check_true (await (async function(){
                                            let __array_op_rval__155=compiled['0'].has_lisp_globals;
                                             if (__array_op_rval__155 instanceof Function){
                                                return await __array_op_rval__155() 
                                            } else {
                                                return[__array_op_rval__155]
                                            }
                                        })())){
                                            await async function(){
                                                compiled[1]=new Function("Environment",("{ return "+compiled['1']+"} "));
                                                return compiled;
                                                
                                            }();
                                             return  await (async function(){
                                                let __array_op_rval__157=compiled['1'];
                                                 if (__array_op_rval__157 instanceof Function){
                                                    return await __array_op_rval__157(Environment) 
                                                } else {
                                                    return[__array_op_rval__157,Environment]
                                                }
                                            })()
                                        } else {
                                            await async function(){
                                                compiled[1]=new Function(("{ return "+compiled['1']+"}"));
                                                return compiled;
                                                
                                            }();
                                             return  await (async function(){
                                                let __array_op_rval__159=compiled['1'];
                                                 if (__array_op_rval__159 instanceof Function){
                                                    return await __array_op_rval__159() 
                                                } else {
                                                    return[__array_op_rval__159]
                                                }
                                            })()
                                        }
                                    } else  {
                                         return compiled['1']
                                    }
                                } ()
                            }  catch(__exception__144) {
                                  if (__exception__144 instanceof Error) {
                                     let e=__exception__144;
                                     {
                                        await env_log("caught error: ",e.name,e.message);
                                        if (check_true (opts.error_report)){
                                             await (async function(){
                                                let __array_op_rval__160=opts.error_report;
                                                 if (__array_op_rval__160 instanceof Function){
                                                    return await __array_op_rval__160({
                                                        error:e.name,message:e.message,form:null,parent_forms:null,invalid:true,text:e.stack
                                                    }) 
                                                } else {
                                                    return[__array_op_rval__160,{
                                                        error:e.name,message:e.message,form:null,parent_forms:null,invalid:true,text:e.stack
                                                    }]
                                                }
                                            })()
                                        };
                                        result=e;
                                        if (check_true ((ctx&&ctx.in_try)))throw result;
                                        
                                    }
                                } 
                            }
                        })();
                         return  result
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["evaluate_local"]=evaluate_local;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let evaluate=async function(expression,ctx,opts) {
                        if (check_true ((namespace===active_namespace))){
                              return await evaluate_local(expression,ctx,opts)
                        } else {
                              return await (async function() {
                                {
                                     let __call_target__=children[active_namespace], __call_method__="evaluate";
                                    return await __call_target__[__call_method__].call(__call_target__,expression,ctx,opts)
                                } 
                            })()
                        }
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["evaluate"]=evaluate;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let eval_struct=async function(lisp_struct,ctx,opts) {
                        let rval;
                        rval=null;
                        if (check_true (lisp_struct instanceof Function)){
                             rval=await (async function(){
                                let __array_op_rval__163=lisp_struct;
                                 if (__array_op_rval__163 instanceof Function){
                                    return await __array_op_rval__163() 
                                } else {
                                    return[__array_op_rval__163]
                                }
                            })()
                        } else {
                             rval=await evaluate(lisp_struct,ctx,await add({
                                json_in:true
                            },(opts||new Object())))
                        };
                         return  rval
                    };
                    ;
                     await async function(){
                        Environment.global_ctx.scope["eval_struct"]=eval_struct;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let meta_for_symbol=async function(quoted_symbol) {
                        if (check_true (await (await get_global("starts_with?"))("=:",quoted_symbol))){
                              return Environment.definitions[await quoted_symbol["substr"].call(quoted_symbol,2)]
                        } else {
                              return Environment.definitions[quoted_symbol]
                        }
                    };
                    ;
                    let set_compiler=async function(compiler_function) {
                        compiler=compiler_function;
                        compiler_operators=await (async function(){
                            let __array_op_rval__165=compiler;
                             if (__array_op_rval__165 instanceof Function){
                                return await __array_op_rval__165([],{
                                    special_operators:true,env:Environment
                                }) 
                            } else {
                                return[__array_op_rval__165,[],{
                                    special_operators:true,env:Environment
                                }]
                            }
                        })();
                        await async function(){
                            Environment.global_ctx.scope["compiler"]=compiler;
                            return Environment.global_ctx.scope;
                            
                        }();
                         return  compiler
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["set_compiler"]=set_compiler;
                        return Environment.global_ctx.scope;
                        
                    }();
                    await async function(){
                        Environment.global_ctx.scope["clone"]=async function(val) {
                            if (check_true ((val===Environment))){
                                  return Environment
                            } else {
                                  return await clone(val,0,Environment)
                            }
                        };
                        return Environment.global_ctx.scope;
                        
                    }();
                    let children=new Object();
                    ;
                    if (check_true ((namespace==="core"))){
                        let current_namespace=function() {
                             return  active_namespace
                        };
                        ;
                        let create_namespace=async function(name) {
                             return  await async function(){
                                if (check_true( await not((name instanceof String || typeof name==='string')))) {
                                     throw new TypeError("namespace name must be a string");
                                    
                                } else if (check_true( children[name])) {
                                     throw new EvalError("namespace already exists");
                                    
                                } else  {
                                    let child_env;
                                    child_env=await (await get_global("dlisp_env"))({
                                        parent_environment:Environment,namespace:name
                                    });
                                    if (check_true (child_env.evaluate)){
                                        await child_env["set_compiler"].call(child_env,compiler);
                                        await async function(){
                                            children[name]=child_env;
                                            return children;
                                            
                                        }();
                                         return  name
                                    } else {
                                        await console.error("ENV: couldn't create the child environment. Received: ",child_env);
                                        throw new EvalError(("unable to create namespace "+name));
                                        
                                    }
                                }
                            } ()
                        };
                        ;
                        let set_namespace=async function(name) {
                             return  await async function(){
                                if (check_true( await not((name instanceof String || typeof name==='string')))) {
                                     throw new TypeError("namespace name must be a string");
                                    
                                } else if (check_true( (await not(("core"===name))&&(null==children[name])))) {
                                     throw new EvalError(("namespace "+name+" doesn't exist"));
                                    
                                } else  {
                                    if (check_true ((name==="core"))){
                                         active_namespace="core"
                                    } else {
                                         active_namespace=name
                                    };
                                     return  name
                                }
                            } ()
                        };
                        ;
                         await async function(){
                            Environment.global_ctx.scope["create_namespace"]=create_namespace;
                            Environment.global_ctx.scope["set_namespace"]=set_namespace;
                            Environment.global_ctx.scope["namespaces"]=function() {
                                 return   add( keys(children),"core")
                            };
                            Environment.global_ctx.scope["current_namespace"]=current_namespace;
                            return Environment.global_ctx.scope;
                            
                        }()
                    };
                    await async function(){
                        Environment["get_global"]=get_global;
                        Environment["set_global"]=set_global;
                        Environment["symbol_definition"]=symbol_definition;
                        Environment["namespace"]=namespace;
                        return Environment;
                        
                    }();
                    let reader=async function(text,opts) {    const __GG__=Environment.get_global;     return  await async function(){
        if (check_true( (undefined==text))) {
             throw new EvalError(("reader: received undefined, text must be a string."));
            
        } else if (check_true( await (await Environment.get_global("not"))((text instanceof String || typeof text==='string')))) {
             throw new EvalError(("reader: received "+await (await Environment.get_global("sub_type"))(text)+": text must be a string."));
            
        } else  {
            let output_structure;
            let idx;
            let line_number;
            let column_number;
            let source_name;
            let len;
            let debugmode;
            let in_buffer;
            let in_code;
            let in_quotes;
            let in_long_text;
            let in_comment;
            let in_single_quote;
            let reading_object;
            let mode;
            let local_text;
            let position;
            let read_table;
            let get_char;
            let error;
            let handle_escape_char;
            let process_word;
            let registered_stop_char;
            let handler_stack;
            let handler;
            let c;
            let next_c;
            let depth;
            let stop;
            let read_block;
            output_structure=[];
            idx=-1;
            line_number=1;
            column_number=0;
            source_name=await (async function () {
                 if (check_true ((opts && opts["source_name"]))){
                      return (opts && opts["source_name"])
                } else {
                      return "anonymous"
                } 
            })();
            opts=(opts||new Object());
            len=(await (await Environment.get_global("length"))(text)-1);
            debugmode=await async function(){
                if (check_true((opts && opts["verbose"]))) {
                     return true
                } else if (check_true( ((opts && opts["verbose"])===false))) {
                     return false
                } else if (check_true( ((await Environment.get_global("__VERBOSITY__"))>6))) {
                     return true
                } else  {
                     return false
                }
            } ();
            in_buffer=(text).split("");
            in_code=0;
            in_quotes=1;
            in_long_text=2;
            in_comment=3;
            in_single_quote=4;
            reading_object=false;
            mode=in_code;
            local_text=async function() {
                let start;
                let end;
                start=await Math.max(0,(idx-10));
                end=await Math.min(await (await Environment.get_global("length"))(in_buffer),(idx+10));
                 return  (await (await Environment.get_global("slice"))(in_buffer,start,end)).join("")
            };
            position=async function(offset) {
                 return  ("line: "+line_number+" column: "+await (async function () {
                     if (check_true (offset)){
                          return (column_number+offset)
                    } else {
                          return column_number
                    } 
                })())
            };
            read_table=await (await Environment.get_global("add"))(new Object(),await (async function() {
                 if (check_true ((opts && opts["read_table_entries"]))){
                      return (opts && opts["read_table_entries"])
                } else {
                      return new Object()
                } 
            } )(),await ( async function(){
                let __obj__1=new Object();
                __obj__1["("]=[")",async function(block) {
                     return  block
                }];
                __obj__1["["]=["]",async function(block) {
                     return  block
                }];
                __obj__1["{"]=["}",async function(block) {
                    let obj;
                    let __idx__2= async function(){
                        return -1
                    };
                    let key_mode;
                    let need_colon;
                    let value_mode;
                    let key;
                    let value;
                    let cpos;
                    let state;
                    let block_length;
                    {
                        obj=new Object();
                        let idx=await __idx__2();
                        ;
                        key_mode=0;
                        need_colon=1;
                        value_mode=2;
                        key=null;
                        value=null;
                        cpos=null;
                        state=key_mode;
                        block_length=(await (await Environment.get_global("length"))(block)-1);
                        reading_object=false;
                        await (async function(){
                             let __test_condition__3=async function() {
                                 return  (idx<block_length)
                            };
                            let __body_ref__4=async function() {
                                (idx=idx+1);
                                key=block[idx];
                                if (check_true (((key instanceof Array)&&((key && key.length)===2)&&((key && key["0"])==="=:quotem")&&((key && key["1"]) instanceof String || typeof (key && key["1"])==='string')))){
                                     key=(key && key["1"])
                                };
                                if (check_true (((key instanceof String || typeof key==='string')&&await (await Environment.get_global("starts_with?"))("=:",key)&&(await (await Environment.get_global("length"))(key)>2)))){
                                     key=await key["substr"].call(key,2)
                                };
                                 return  await async function(){
                                    if (check_true( await (await Environment.get_global("blank?"))(key))) {
                                         return await error("missing object key",("blank or nil key: "+block[idx]))
                                    } else if (check_true( await (await Environment.get_global("is_number?"))(key))) {
                                        (idx=idx+1);
                                         return  await async function(){
                                            obj[key]=block[idx];
                                            return obj;
                                            
                                        }()
                                    } else if (check_true( ((key instanceof String || typeof key==='string')&&await (await Environment.get_global("contains?"))(":",key)&&await (await Environment.get_global("not"))(await (await Environment.get_global("ends_with?"))(":",key))))) {
                                        cpos=await key["indexOf"].call(key,":");
                                        value=await key["substr"].call(key,(cpos+1));
                                        key=await key["substr"].call(key,0,cpos);
                                        value=await process_word((value).split(""),0);
                                         return  await async function(){
                                            obj[key]=value;
                                            return obj;
                                            
                                        }()
                                    } else  {
                                        (idx=idx+1);
                                        if (check_true (await (await Environment.get_global("ends_with?"))(":",key))){
                                             key=await (await Environment.get_global("chop"))(key)
                                        } else {
                                            if (check_true ((block[idx]===":"))){
                                                 (idx=idx+1)
                                            } else {
                                                 await error("missing colon",("expected colon for: "+key))
                                            }
                                        };
                                         return  await async function(){
                                            obj[key]=block[idx];
                                            return obj;
                                            
                                        }()
                                    }
                                } ()
                            };
                            let __BREAK__FLAG__=false;
                            while(await __test_condition__3()) {
                                await __body_ref__4();
                                 if(__BREAK__FLAG__) {
                                     break;
                                    
                                }
                            } ;
                            
                        })();
                         return  obj
                    }
                },async function() {
                     return  reading_object=true
                }];
                __obj__1["\""]=["\"",async function(block) {
                     return  ["quotes",block]
                }];
                return __obj__1;
                
            })());
            get_char=async function(pos) {
                 return  in_buffer[pos]
            };
            error=async function(type,message,offset) {
                throw new (await Environment.get_global("LispSyntaxError"))({
                    message:message,position:await position(offset),pos:{
                        line:line_number,column:(column_number+(offset||0))
                    },depth:depth,local_text:await local_text(),source_name:source_name,type:type
                });
                
            };
            handle_escape_char=async function(c) {
                let ccode;
                ccode=await c["charCodeAt"].call(c,0);
                 return  await async function(){
                    if (check_true( (ccode===34))) {
                         return c
                    } else if (check_true( (ccode===92))) {
                         return c
                    } else if (check_true( (c==="t"))) {
                         return await String.fromCharCode(9)
                    } else if (check_true( (c==="n"))) {
                         return await String.fromCharCode(10)
                    } else if (check_true( (c==="r"))) {
                         return await String.fromCharCode(13)
                    } else if (check_true( (c==="f"))) {
                         return c
                    } else if (check_true( (c==="b"))) {
                         return c
                    } else  {
                         return c
                    }
                } ()
            };
            process_word=async function(word_acc,backtick_mode) {
                let word;
                let word_as_number;
                word=(word_acc).join("");
                word_as_number=await Number(word);
                if (check_true (debugmode)){
                     console.log("process_word: ",word,word_as_number,backtick_mode)
                };
                 return  await async function(){
                    if (check_true( ("true"===word))) {
                         return true
                    } else if (check_true( ("false"===word))) {
                         return false
                    } else if (check_true( (":"===word))) {
                         return word
                    } else if (check_true( (",@"===word))) {
                         return "=$,@"
                    } else if (check_true( ((",#"===word)||("##"===word)))) {
                         return "=:##"
                    } else if (check_true( ("=$,@"===word))) {
                         return "=$,@"
                    } else if (check_true( ("=:##"===word))) {
                         return "=:##"
                    } else if (check_true( await isNaN(word_as_number))) {
                         return  await async function(){
                            if (check_true( (word==="=:"))) {
                                 return  "=:"
                            } else if (check_true( ((backtick_mode===0)&&await (await Environment.get_global("ends_with?"))(")",word)))) {
                                 return await error("trailing character","unexpected trailing parenthesis")
                            } else if (check_true( ((backtick_mode===0)&&await (await Environment.get_global("ends_with?"))("]",word)))) {
                                 return await error("trailing character","unexpected trailing bracket")
                            } else if (check_true( await (await Environment.get_global("contains?"))(word,["=:(","=:)","=:'"]))) {
                                 return  word
                            } else if (check_true( (backtick_mode===1))) {
                                 return word
                            } else  {
                                 return await (await Environment.get_global("add"))("=:",word)
                            }
                        } ()
                    } else if (check_true( await (await Environment.get_global("is_number?"))(word_as_number))) {
                         return word_as_number
                    } else  {
                        console.log("reader: ",await position()," what is this?",word,word_acc,await local_text());
                         return  word
                    }
                } ()
            };
            registered_stop_char=null;
            handler_stack=[];
            handler=null;
            c=null;
            next_c=null;
            depth=0;
            stop=false;
            read_block=async function(_depth,_prefix_op) {
                let acc;
                let word_acc;
                let backtick_mode;
                let escape_mode;
                let last_c;
                let block_return;
                acc=[];
                word_acc=[];
                backtick_mode=0;
                escape_mode=0;
                last_c=null;
                block_return=null;
                if (check_true (_prefix_op)){
                     (acc).push(_prefix_op)
                };
                depth=_depth;
                await (async function(){
                     let __test_condition__8=async function() {
                         return  (await (await Environment.get_global("not"))(stop)&&(idx<len))
                    };
                    let __body_ref__9=async function() {
                        idx+=1;
                        escape_mode=await Math.max(0,(escape_mode-1));
                        c=await get_char(idx);
                        next_c=await get_char((idx+1));
                        if (check_true ((c==="\n"))){
                            line_number+=1;
                             column_number=0
                        };
                        if (check_true (debugmode)){
                             await console.log(_depth,"C->",c,next_c,mode,escape_mode,await (await Environment.get_global("clone"))(acc),await (await Environment.get_global("clone"))(word_acc),(handler_stack && handler_stack.length))
                        };
                        await async function(){
                            if (check_true( ((next_c===undefined)&&await (await Environment.get_global("not"))((await (async function(){
                                let __targ__10=await (await Environment.get_global("last"))(handler_stack);
                                if (__targ__10){
                                     return(__targ__10)[0]
                                } 
                            })()===undefined))&&(await (await Environment.get_global("not"))((c===await (async function(){
                                let __targ__11=await (await Environment.get_global("last"))(handler_stack);
                                if (__targ__11){
                                     return(__targ__11)[0]
                                } 
                            })()))||((handler_stack && handler_stack.length)>1))))) {
                                 return await error("premature end",("premature end: expected: "+await (async function(){
                                    let __targ__12=await (await Environment.get_global("last"))(handler_stack);
                                    if (__targ__12){
                                         return(__targ__12)[0]
                                    } 
                                })()))
                            } else if (check_true( ((next_c===undefined)&&(mode===in_quotes)&&await (await Environment.get_global("not"))((await c["charCodeAt"]()===34))))) {
                                 return await error("premature end","premature end: expected: \"")
                            } else if (check_true( ((next_c===undefined)&&(mode===in_long_text)&&await (await Environment.get_global("not"))((c==="|"))))) {
                                 return await error("premature end","premature end: expected: |")
                            } else if (check_true( ((mode===in_code)&&(_depth===1)&&(next_c===")")&&(c===")")))) {
                                 return  await error("trailing character","unexpected trailing parenthesis")
                            }
                        } ();
                        await async function(){
                            if (check_true( ((c==="\n")&&(mode===in_comment)))) {
                                mode=in_code;
                                __BREAK__FLAG__=true;
                                return
                            } else if (check_true( ((92===await c["charCodeAt"].call(c,0))&&(mode===in_long_text)))) {
                                (word_acc).push(c);
                                 return  (word_acc).push(c)
                            } else if (check_true( ((mode>0)&&(escape_mode===1)&&(92===await c["charCodeAt"].call(c,0))))) {
                                 return  (word_acc).push(c)
                            } else if (check_true( ((mode>0)&&(92===await c["charCodeAt"].call(c,0))))) {
                                 return  escape_mode=2
                            } else if (check_true( ((mode>0)&&(escape_mode===1)))) {
                                 return  (word_acc).push(await handle_escape_char(c))
                            } else if (check_true( ((mode===in_long_text)&&(escape_mode===0)&&(c==="|")))) {
                                acc=await (await Environment.get_global("add"))((word_acc).join(""));
                                word_acc=[];
                                mode=in_code;
                                __BREAK__FLAG__=true;
                                return
                            } else if (check_true( ((mode===in_quotes)&&(escape_mode===0)&&(c==="\"")))) {
                                acc=await (await Environment.get_global("add"))((word_acc).join(""));
                                word_acc=[];
                                mode=in_code;
                                __BREAK__FLAG__=true;
                                return
                            } else if (check_true( ((mode===in_single_quote)&&(escape_mode===0)&&(c==="'")))) {
                                acc=await (await Environment.get_global("add"))((word_acc).join(""));
                                word_acc=[];
                                mode=in_code;
                                __BREAK__FLAG__=true;
                                return
                            } else if (check_true( ((c==="|")&&(mode===in_code)))) {
                                if (check_true (((word_acc && word_acc.length)>0))){
                                    (acc).push(await process_word(word_acc));
                                     word_acc=[]
                                };
                                mode=in_long_text;
                                block_return=await read_block(await (await Environment.get_global("add"))(_depth,1));
                                if (check_true ((backtick_mode===1))){
                                    block_return=["=:quotem",block_return];
                                     backtick_mode=0
                                };
                                 return  (acc).push(block_return)
                            } else if (check_true( ((c==="\"")&&(escape_mode===0)&&(mode===in_code)))) {
                                if (check_true (((word_acc && word_acc.length)>0))){
                                    (acc).push(await process_word(word_acc));
                                     word_acc=[]
                                };
                                mode=in_quotes;
                                block_return=await read_block(await (await Environment.get_global("add"))(_depth,1));
                                if (check_true ((backtick_mode===1))){
                                     backtick_mode=0
                                };
                                 return  (acc).push(block_return)
                            } else if (check_true( ((c==="'")&&(escape_mode===0)&&(mode===in_code)))) {
                                if (check_true (((word_acc && word_acc.length)>0))){
                                    (acc).push(await process_word(word_acc));
                                     word_acc=[]
                                };
                                mode=in_single_quote;
                                block_return=await read_block(await (await Environment.get_global("add"))(_depth,1));
                                if (check_true ((backtick_mode===1))){
                                     backtick_mode=0
                                };
                                 return  (acc).push(block_return)
                            } else if (check_true( (mode===in_comment))) {
                                 return false
                            } else if (check_true( ((c===";")&&(mode===in_code)))) {
                                if (check_true (((word_acc && word_acc.length)>0))){
                                    (acc).push(await process_word(word_acc));
                                     word_acc=[]
                                };
                                mode=in_comment;
                                 return  await read_block(await (await Environment.get_global("add"))(_depth,1))
                            } else if (check_true( ((mode===in_code)&&(await (await Environment.get_global("length"))(handler_stack)>0)&&(c===await (async function(){
                                let __targ__13=await (await Environment.get_global("last"))(handler_stack);
                                if (__targ__13){
                                     return(__targ__13)[0]
                                } 
                            })())))) {
                                __BREAK__FLAG__=true;
                                return
                            } else if (check_true( ((mode===in_code)&&read_table[c]&&await (await Environment.get_global("first"))(read_table[c])))) {
                                if (check_true (await (async function(){
                                    let __targ__14=read_table[c];
                                    if (__targ__14){
                                         return(__targ__14)[2]
                                    } 
                                })())){
                                    handler=await (async function(){
                                        let __targ__15=read_table[c];
                                        if (__targ__15){
                                             return(__targ__15)[2]
                                        } 
                                    })();
                                    await (async function(){
                                        let __array_op_rval__16=handler;
                                         if (__array_op_rval__16 instanceof Function){
                                            return await __array_op_rval__16() 
                                        } else {
                                            return[__array_op_rval__16]
                                        }
                                    })();
                                     handler=null
                                };
                                (handler_stack).push(read_table[c]);
                                if (check_true (((word_acc && word_acc.length)>0))){
                                    (acc).push(await process_word(word_acc,backtick_mode));
                                    backtick_mode=0;
                                     word_acc=[]
                                };
                                block_return=await read_block(await (await Environment.get_global("add"))(_depth,1));
                                handler=await (async function(){
                                    let __targ__17=(handler_stack).pop();
                                    if (__targ__17){
                                         return(__targ__17)[1]
                                    } 
                                })();
                                block_return=await (async function(){
                                    let __array_op_rval__18=handler;
                                     if (__array_op_rval__18 instanceof Function){
                                        return await __array_op_rval__18(block_return) 
                                    } else {
                                        return[__array_op_rval__18,block_return]
                                    }
                                })();
                                if (check_true (await (await Environment.get_global("not"))((undefined===block_return)))){
                                    if (check_true ((backtick_mode===1))){
                                        block_return=["=:quotem",block_return];
                                         backtick_mode=0
                                    };
                                     return  (acc).push(block_return)
                                }
                            } else if (check_true( ((mode===in_code)&&(c==="`")))) {
                                if (check_true (((word_acc && word_acc.length)>0))){
                                    (acc).push(await process_word(word_acc));
                                     word_acc=[]
                                };
                                 return  backtick_mode=1
                            } else if (check_true( ((mode===in_code)&&(c===":")&&((word_acc && word_acc.length)===0)&&((acc && acc.length)>0)&&(await (await Environment.get_global("last"))(acc) instanceof String || typeof await (await Environment.get_global("last"))(acc)==='string')))) {
                                 return (acc).push(await (await Environment.get_global("add"))((acc).pop(),":"))
                            } else if (check_true( ((mode===in_code)&&(last_c===",")&&((c==="#")||(c==="@"))))) {
                                (word_acc).push(c);
                                (acc).push(await process_word(word_acc));
                                 return  word_acc=[]
                            } else if (check_true( ((mode===in_code)&&((c===" ")||(await c["charCodeAt"].call(c,0)===10)||(await c["charCodeAt"].call(c,0)===9)||((c===",")&&await (await Environment.get_global("not"))((next_c==="@"))&&await (await Environment.get_global("not"))((next_c==="#"))))))) {
                                if (check_true (((word_acc && word_acc.length)>0))){
                                    if (check_true ((backtick_mode===1))){
                                        (acc).push(await process_word(word_acc,backtick_mode));
                                         backtick_mode=0
                                    } else {
                                         (acc).push(await process_word(word_acc))
                                    };
                                     return  word_acc=[]
                                }
                            } else if (check_true( ((mode===in_code)&&(await c["charCodeAt"].call(c,0)===13)))) {
                                 return false
                            } else  {
                                 return  (word_acc).push(c)
                            }
                        } ();
                        column_number+=1;
                         return  last_c=c
                    };
                    let __BREAK__FLAG__=false;
                    while(await __test_condition__8()) {
                        await __body_ref__9();
                         if(__BREAK__FLAG__) {
                             break;
                            
                        }
                    } ;
                    
                })();
                if (check_true (((word_acc && word_acc.length)>0))){
                    (acc).push(await process_word(word_acc,backtick_mode));
                     word_acc=[]
                };
                 return  acc
            };
            if (check_true (debugmode)){
                 await console.log("read->",in_buffer)
            };
            output_structure=await read_block(0);
            if (check_true (debugmode)){
                 await console.log("read<-",await (await Environment.get_global("clone"))(output_structure))
            };
            if (check_true (((output_structure instanceof Array)&&(await (await Environment.get_global("length"))(output_structure)>1)))){
                (output_structure).unshift("=:iprogn");
                 return  await (await Environment.get_global("first"))(await (async function(){
                    let __array_op_rval__19=output_structure;
                     if (__array_op_rval__19 instanceof Function){
                        return await __array_op_rval__19() 
                    } else {
                        return[__array_op_rval__19]
                    }
                })())
            } else {
                  return await (await Environment.get_global("first"))(output_structure)
            }
        }
    } ()
};
                    let add_escape_encoding=async function(text) {        if (check_true ((text instanceof String || typeof text==='string'))){            let chars;            let acc;            chars=(text).split("");            acc=[];            await (async function() {                let __for_body__3=async function(c) {                     return  await async function(){                        if (check_true( ((await c["charCodeAt"].call(c,0)===34)))) {                            (acc).push(await String.fromCharCode(92));                             return  (acc).push(c)                        } else  {                             return (acc).push(c)                        }                    } ()                };                let __array__4=[],__elements__2=chars;                let __BREAK__FLAG__=false;                for(let __iter__1 in __elements__2) {                    __array__4.push(await __for_body__3(__elements__2[__iter__1]));
                    if(__BREAK__FLAG__) {
                         __array__4.pop();
                        break;
                        
                    }
                }return __array__4;
                 
            })();
             return  (acc).join("")
        } else {
              return text
        }
    };
                    let do_deferred_splice=async function(tree) {    let rval;
    let idx;
    let tval;
    let deferred_operator;
    rval=null;
    idx=0;
    tval=null;
    deferred_operator=(["=","$","&","!"]).join("");
     return  await async function(){
        if (check_true( (tree instanceof Array))) {
            rval=[];
            await (async function(){
                 let __test_condition__15=async function() {
                     return  (idx<(tree && tree.length))
                };
                let __body_ref__16=async function() {
                    tval=tree[idx];
                    if (check_true ((tval===deferred_operator))){
                        idx+=1;
                        tval=tree[idx];
                         rval=await rval["concat"].call(rval,await do_deferred_splice(tval))
                    } else {
                         (rval).push(await do_deferred_splice(tval))
                    };
                     return  idx+=1
                };
                let __BREAK__FLAG__=false;
                while(await __test_condition__15()) {
                    await __body_ref__16();
                     if(__BREAK__FLAG__) {
                         break;
                        
                    }
                } ;
                
            })();
             return  rval
        } else if (check_true( (tree instanceof Object))) {
            rval=new Object();
            await (async function() {
                let __for_body__19=async function(pset) {
                     return  await async function(){
                        rval[(pset && pset["0"])]=await do_deferred_splice((pset && pset["1"]));
                        return rval;
                        
                    }()
                };
                let __array__20=[],__elements__18=await (await Environment.get_global("pairs"))(tree);
                let __BREAK__FLAG__=false;
                for(let __iter__17 in __elements__18) {
                    __array__20.push(await __for_body__19(__elements__18[__iter__17]));
                    if(__BREAK__FLAG__) {
                         __array__20.pop();
                        break;
                        
                    }
                }return __array__20;
                 
            })();
             return  rval
        } else  {
             return tree
        }
    } ()
};
                    let safe_access=async function(token,ctx,sanitizer_fn) {    let comps;
    let acc;
    let acc_full;
    let pos;
    let rval;
    comps=null;
    acc=[];
    acc_full=[];
    pos=null;
    rval=null;
    comps=((token && token.name)).split(".");
    if (check_true (((comps && comps.length)===1))){
          return (token && token.name)
    } else {
        await async function(){
            comps[0]=await (async function(){
                let __array_op_rval__207=sanitizer_fn;
                 if (__array_op_rval__207 instanceof Function){
                    return await __array_op_rval__207((comps && comps["0"])) 
                } else {
                    return[__array_op_rval__207,(comps && comps["0"])]
                }
            })();
            return comps;
            
        }();
        await (async function(){
             let __test_condition__208=async function() {
                 return  ((comps && comps.length)>0)
            };
            let __body_ref__209=async function() {
                (acc).push((comps).shift());
                 return  (acc_full).push(await (await Environment.get_global("expand_dot_accessor"))((acc).join("."),ctx))
            };
            let __BREAK__FLAG__=false;
            while(await __test_condition__208()) {
                await __body_ref__209();
                 if(__BREAK__FLAG__) {
                     break;
                    
                }
            } ;
            
        })();
        rval=await (await Environment.get_global("flatten"))(["(",(acc_full).join(" && "),")"]);
         return  rval
    }
};
                    ;
                    let as_lisp=lisp_writer;
                    ;
                    let read_lisp=reader;
                    ;
                    await async function(){
                        Environment.global_ctx.scope["eval"]=eval_exp;
                        Environment.global_ctx.scope["reader"]=reader;
                        Environment.global_ctx.scope["add_escape_encoding"]=add_escape_encoding;
                        Environment.global_ctx.scope["get_outside_global"]=get_outside_global;
                        Environment.global_ctx.scope["as_lisp"]=lisp_writer;
                        Environment.global_ctx.scope["lisp_writer"]=lisp_writer;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let inlines=await add(new Object(),await (async function() {
                         if (check_true (opts.inlines)){
                              return opts.inlines
                        } else {
                              return new Object()
                        } 
                    } )(),await ( async function(){
                        let __obj__173=new Object();
                        __obj__173["pop"]=async function(args) {
                             return  ["(",args['0'],")",".","pop()"]
                        };
                        __obj__173["push"]=async function(args) {
                             return  ["(",args['0'],")",".push","(",args['1'],")"]
                        };
                        __obj__173["chomp"]=async function(args) {
                             return  ["(",args['0'],")",".substr","(",0,",","(",args['0'],".length","-",1,")",")"]
                        };
                        __obj__173["join"]=async function(args) {
                            if (check_true ((args.length===1))){
                                  return ["(",args['0'],")",".join","('')"]
                            } else {
                                  return ["(",args['1'],")",".join","(",args['0'],")"]
                            }
                        };
                        __obj__173["take"]=async function(args) {
                             return  ["(",args['0'],")",".shift","()"]
                        };
                        __obj__173["prepend"]=async function(args) {
                             return  ["(",args['0'],")",".unshift","(",args['1'],")"]
                        };
                        __obj__173["trim"]=async function(args) {
                             return  ["(",args['0'],")",".trim()"]
                        };
                        __obj__173["lowercase"]=async function(args) {
                             return  ["(",args['0'],")",".toLowerCase()"]
                        };
                        __obj__173["uppercase"]=async function(args) {
                             return  ["(",args['0'],")",".toUpperCase()"]
                        };
                        __obj__173["islice"]=async function(args) {
                             return  await async function(){
                                if (check_true( (args.length===3))) {
                                     return ["(",args['0'],")",".slice(",args['1'],",",args['2'],")"]
                                } else if (check_true( (args.length===2))) {
                                     return ["(",args['0'],")",".slice(",args['1'],")"]
                                } else  {
                                     throw new SyntaxError("slice requires 2 or 3 arguments");
                                    
                                }
                            } ()
                        };
                        __obj__173["split_by"]=async function(args) {
                             return  ["(",args['1'],")",".split","(",args['0'],")"]
                        };
                        __obj__173["bindf"]=async function(args) {
                             return  await (async function(){
                                let __array_op_rval__174=args['0'];
                                 if (__array_op_rval__174 instanceof Function){
                                    return await __array_op_rval__174(".bind(",args['1'],")") 
                                } else {
                                    return[__array_op_rval__174,".bind(",args['1'],")"]
                                }
                            })()
                        };
                        __obj__173["is_array?"]=async function(args) {
                             return  ["(",args['0']," instanceof Array",")"]
                        };
                        __obj__173["is_object?"]=async function(args) {
                             return  ["(",args['0']," instanceof Object",")"]
                        };
                        __obj__173["is_string?"]=async function(args) {
                             return  ["(",args['0']," instanceof String || typeof ",args['0'],"===","'string'",")"]
                        };
                        __obj__173["is_function?"]=async function(args) {
                             return  await (async function(){
                                let __array_op_rval__175=args['0'];
                                 if (__array_op_rval__175 instanceof Function){
                                    return await __array_op_rval__175(" instanceof Function") 
                                } else {
                                    return[__array_op_rval__175," instanceof Function"]
                                }
                            })()
                        };
                        __obj__173["is_element?"]=async function(args) {
                             return  await (async function(){
                                let __array_op_rval__176=args['0'];
                                 if (__array_op_rval__176 instanceof Function){
                                    return await __array_op_rval__176(" instanceof Element") 
                                } else {
                                    return[__array_op_rval__176," instanceof Element"]
                                }
                            })()
                        };
                        __obj__173["log"]=async function(args) {
                             return  ["console.log","(",await map(async function(val,idx,tl) {
                                if (check_true ((idx<(tl-1)))){
                                      return await (async function(){
                                        let __array_op_rval__177=val;
                                         if (__array_op_rval__177 instanceof Function){
                                            return await __array_op_rval__177(",") 
                                        } else {
                                            return[__array_op_rval__177,","]
                                        }
                                    })()
                                } else {
                                      return await (async function(){
                                        let __array_op_rval__178=val;
                                         if (__array_op_rval__178 instanceof Function){
                                            return await __array_op_rval__178() 
                                        } else {
                                            return[__array_op_rval__178]
                                        }
                                    })()
                                }
                            },args),")"]
                        };
                        __obj__173["reverse"]=async function(args) {
                             return  ["(",args['0'],")",".slice(0).reverse()"]
                        };
                        __obj__173["int"]=async function(args) {
                             return  await async function(){
                                if (check_true( (args.length===1))) {
                                     return ["parseInt(",args['0'],")"]
                                } else if (check_true( (args.length===2))) {
                                     return ["parseInt(",args['0'],",",args['1'],")"]
                                } else  {
                                     throw new "SyntaxError"(("invalid number of arguments to int: received "+args.length));
                                    
                                }
                            } ()
                        };
                        __obj__173["float"]=async function(args) {
                             return  ["parseFloat(",args['0'],")"]
                        };
                        return __obj__173;
                        
                    })());
                    ;
                    await async function(){
                        Environment["eval"]=eval_struct;
                        Environment["identify"]=subtype;
                        Environment["meta_for_symbol"]=meta_for_symbol;
                        Environment["set_compiler"]=set_compiler;
                        Environment["read_lisp"]=reader;
                        Environment["as_lisp"]=as_lisp;
                        Environment["inlines"]=inlines;
                        Environment["special_operators"]=special_operators;
                        Environment["definitions"]=Environment.definitions;
                        Environment["declarations"]=Environment.declarations;
                        Environment["compile"]=compile;
                        Environment["evaluate"]=evaluate;
                        Environment["do_deferred_splice"]=do_deferred_splice;
                        Environment["id"]=async function() {
                             return  id
                        };
                        Environment["set_check_external_env"]=async function(state) {
                            check_external_env_default=state;
                             return  check_external_env_default
                        };
                        Environment["check_external_env"]=async function() {
                             return  check_external_env_default
                        };
                        return Environment;
                        
                    }();
                     return  Environment
                }
            };
            return globalThis;
            
        }();
         return  globalThis[symname]
    }
}
}
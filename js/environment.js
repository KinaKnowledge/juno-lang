// Source: environment.lisp  
// Build Time: 2023-01-10 14:02:53
// Version: 2023.01.10.14.02
export const DLISP_ENV_VERSION='2023.01.10.14.02';




var { get_next_environment_id, check_true, get_outside_global, subtype, lisp_writer, clone, LispSyntaxError } = await import("./lisp_writer.js");
if (typeof AsyncFunction === "undefined") {
  globalThis.AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
}
export async function init_dlisp(Environment)  {
{
    await async function(){
        globalThis["subtype"]=subtype;
        globalThis["check_true"]=check_true;
        globalThis["clone"]=clone;
        globalThis["lisp_writer"]=lisp_writer;
        globalThis["LispSyntaxError"]=LispSyntaxError;
        return globalThis;
        
    }();
    if (check_true (("undefined"===typeof dlisp_environment_count))){
        await async function(){
            globalThis["dlisp_environment_count"]=0;
            return globalThis;
            
        }()
    };
    {
        let symname;
        symname=await (async function(){
             return "dlisp_env" 
        })();
        {
            await async function(){
                globalThis[symname]=async function(opts) {
                    let subtype=function subtype(value) {  if (value === null) return "null";
  else if (value === undefined) return "undefined";
  else if (value instanceof Array) return "array";
  else if (value.constructor && value.constructor!=null && value.constructor.name!=='Object') {
    return value.constructor.name;
  }
  return typeof value;
};
                    let get_object_path=function(refname) {        if (check_true ((( refname["indexOf"].call(refname,".")>-1)|| ( refname["indexOf"].call(refname,"[")>-1)))){
            {
                let chars;
                let comps;
                let mode;
                let name_acc;
                chars=(refname).split("");
                comps=[];
                mode=0;
                name_acc=[];
                 ( function() {
                    let __for_body__14=function(c) {
                        return   (function(){
                            if (check_true (((c===".")&& (mode===0)))) {
                                {
                                    if (check_true (((name_acc && name_acc.length)>0))){
                                        {
                                            (comps).push((name_acc).join(""))
                                        }
                                    };
                                    return name_acc=[]
                                }
                            } else if (check_true (((mode===0)&& (c==="[")))) {
                                {
                                    mode=1;
                                    if (check_true (((name_acc && name_acc.length)>0))){
                                        {
                                            (comps).push((name_acc).join(""))
                                        }
                                    };
                                    return name_acc=[]
                                }
                            } else if (check_true (((mode===1)&& (c==="]")))) {
                                {
                                    mode=0;
                                    (comps).push((name_acc).join(""));
                                    return name_acc=[]
                                }
                            } else {
                                return (name_acc).push(c)
                            }
                        } )()
                    };
                    let __array__15=[],__elements__13=chars;
                    let __BREAK__FLAG__=false;
                    for(let __iter__12 in __elements__13) {
                        __array__15.push( __for_body__14(__elements__13[__iter__12]));
                        if(__BREAK__FLAG__) {
                             __array__15.pop();
                            break;
                            
                        }
                    }return __array__15;
                     
                })();
                if (check_true (((name_acc && name_acc.length)>0))){
                    (comps).push((name_acc).join(""))
                };
                return comps
            }
        } else {
            return  ( function(){
                let __array_op_rval__16=refname;
                 if (__array_op_rval__16 instanceof Function){
                    return  __array_op_rval__16() 
                } else {
                    return [__array_op_rval__16]
                }
            })()
        }
    };
                    let get_outside_global=function get_outside_global(refname) {  try {    let tfn = new Function("{ if (typeof " + refname + " === 'undefined') { return undefined } else { return "+refname+" } }");    return tfn();  } catch (ex) {    return undefined;  }};
                    ;
                    opts=await (async function(){
                        if (check_true ((opts===undefined))){
                            return new Object()
                        } else {
                            return opts
                        }
                    })();
                    let namespace=(opts.namespace|| "core");
                    ;
                    let in_boot=true;
                    ;
                    let pending_loads=new Object();
                    ;
                    let parent_environment=await (async function(){
                        if (check_true ((namespace==="core"))){
                            return null
                        } else {
                            return opts.parent_environment
                        }
                    })();
                    ;
                    let active_namespace=namespace;
                    ;
                    let contained=(opts.contained|| false);
                    ;
                    let Environment={
                        global_ctx:{
                            scope:new Object(),name:namespace
                        },build_version:DLISP_ENV_VERSION,definitions:(opts.definitions|| new Object()),declarations:(opts.declarations|| {
                            safety:{
                                level:2
                            }
                        })
                    };
                    ;
                    if (check_true (("undefined"===typeof Element))){
                        await async function(){
                            globalThis["Element"]=function() {
                                return false
                            };
                            return globalThis;
                            
                        }()
                    };
                    let id=await (async function(){
                        let __array_op_rval__5=get_next_environment_id;
                         if (__array_op_rval__5 instanceof Function){
                            return await __array_op_rval__5() 
                        } else {
                            return [__array_op_rval__5]
                        }
                    })();
                    ;
                    await async function(){
                        Environment["context"]=Environment.global_ctx;
                        return Environment;
                        
                    }();
                    let unset_compiler=async function() {
                        throw new EvalError(("compiler must be set for "+ namespace));
                        
                    };
                    ;
                    let compiler=unset_compiler;
                    ;
                    let compiler_operators=new Set();
                    ;
                    let special_identity=async function(v) {
                        return v
                    };
                    ;
                    let MAX_SAFE_INTEGER=9007199254740991;
                    ;
                    await async function(){
                        Environment.global_ctx.scope["MAX_SAFE_INTEGER"]=MAX_SAFE_INTEGER;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["MAX_SAFE_INTEGER"]={
                            core_lang:true
                        };
                        return Environment.definitions;
                        
                    }()];
                    let LispSyntaxError=globalThis.LispSyntaxError;
                    ;
                    await async function(){
                        Environment.global_ctx.scope["LispSyntaxError"]=LispSyntaxError;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["LispSyntaxError"]={
                            core_lang:true
                        };
                        return Environment.definitions;
                        
                    }()];
                    let sub_type=subtype;
                    ;
                    await async function(){
                        Environment.global_ctx.scope["sub_type"]=sub_type;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["sub_type"]={
                            core_lang:true,description:"Returns a string the determined actual type of the provided value.",usage:["value:*"],tags:["type","class","prototype","typeof","instanceof"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let __VERBOSITY__=0;
                    ;
                    await async function(){
                        Environment.global_ctx.scope["__VERBOSITY__"]=__VERBOSITY__;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["__VERBOSITY__"]={
                            core_lang:true,description:"Set __VERBOSITY__ to a positive integer for verbose console output of system activity.",tags:["debug","compiler","environment","global"]
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
                            core_lang:true,usage:"value:string|number",description:"Convenience method for parseInt, should be used in map vs. directly calling parseInt, which will not work directly",tags:["conversion","number"]
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
                            core_lang:true,usage:"value:string|number",description:"Convenience method for parseFloat, should be used in map vs. directly calling parseFloat, which will not work directly",tags:["conversion","number"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let values=new Function("...args","{\n                         let acc = [];\n                         for (let _i in args) {\n                                let value = args[_i];\n                                let type = subtype(value);\n                                if (value instanceof Set)  {\n                                     acc = acc.concat(Array.from(value));\n                                     } else if (type==='array') {\n                                      acc = acc.concat(value);\n                                      } else if (type==='object') {\n                                       acc = acc.concat(Object.values(value))\n                                       } else {\n                                        acc = acc.concat(value);\n                                        }\n                                }\n                         return acc;\n                         }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["values"]=values;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["values"]={
                            core_lang:true,description:("Given a container, returns a list containing the values of each supplied argument. Note that for objects, only the values are returned, not the keys. "+ "If given multiple values, the returned value is a concatentation of all containers provided in the arguments."),usage:["arg0:*","argn:*"],tags:["array","container","object","keys","elements"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let pairs=new Function("obj","{\n                        if (subtype(obj)==='array') {\n                             let rval = [];\n                             for (let i = 0; i < obj.length; i+=2) {\n                                    rval.push([obj[i],obj[i+1]]);\n                                    }\n                             return rval;\n                             } else {\n                              let keys = Object.keys(obj);\n                              let rval = keys.reduce(function(acc,x,i) {\n                                                               acc.push([x,obj[x]])\n                                                               return acc;\n                                                               },[]);\n                              return rval;\n                              }\n                        }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["pairs"]=pairs;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["pairs"]={
                            core_lang:true,description:"Given a passed object or array, returns a list containing a 2 element list for each key/value pair of the supplied object.",tags:["array","container","object"],usage:["obj:object"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let keys=new Function("obj","{  return Object.keys(obj);  }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["keys"]=keys;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["keys"]={
                            core_lang:true,description:"Given an object, returns the keys of the object.",tags:["object","values","keys","indexes","container"],usage:["obj:object"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let take=new Function("place","{ return place.shift() }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["take"]=take;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["take"]={
                            core_lang:true,description:"Takes the first value off the list, and returns the value.",tags:["array","container","mutate","first"],usage:["place:container"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let prepend=new Function("place","thing","{ return place.unshift(thing) }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["prepend"]=prepend;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["prepend"]={
                            core_lang:true,description:"Places the value argument onto the first of the list (unshift) and returns the list.",tags:["array","mutate","container"],usage:["place:array","thing:*"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let first=new Function("x","{ return x[0] }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["first"]=first;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["first"]={
                            core_lang:true,description:"Given an array, returns the first element in the array.",usage:["x:array"],tags:["array","container","elements"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let last=new Function("x","{ return x[x.length - 1] }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["last"]=last;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["last"]={
                            core_lang:true,description:"Given an array, returns the last element in the array.",usage:["x:array"],tags:["array","container","elements","end"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let length=new Function("obj","{\n                         if(obj instanceof Array) {\n                             return obj.length;\n                             } else if (obj instanceof Set) {\n                              return obj.size;\n                              } else if ((obj === undefined)||(obj===null)) {\n                               return 0;\n                               } else if (typeof obj==='object') {\n                                return Object.keys(obj).length;\n                                } else if (typeof obj==='string') {\n                                 return obj.length;\n                                 }\n                         return 0;\n                         }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["length"]=length;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["length"]={
                            core_lang:true,description:("Returns the length of the supplied type (array, object, set, string, number). "+ "If the supplied value is nil or a non-container type, returns 0."),tags:["size","elements","container","dimension","array","set","string","number"],usage:["thing:container"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let conj=new Function("...args","{   let list = [];\n                       if (args[0] instanceof Array) {\n                            list = args[0];\n                            } else {\n                             list = [args[0]];\n                             }\n                       args.slice(1).map(function(x) {\n                                          list = list.concat(x);\n                                          });\n                       return list;\n                       }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["conj"]=conj;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["conj"]={
                            core_lang:true,description:("Conjoins or concatenates things (typically arrays) together and returns an array. "+ "Examples:<br>"+ "(conj [ 1 2 ] [ 3 4 ]) => [ 1 2 3 4 ]<br>"+ "(conj [ 1 2 ] 3 4 ) => [ 1 2 3 4 ]<br>"+ "(conj 1 2 [ 3 4 ]) => [ 1 2 3 4 ]<br>"+ "(conj { `abc: 123 } [ 2 3]) => [ { abc: 123 }, 2, 3 ]<br>"+ "(conj [ 1 2 3 [ 4 ]] [ 5 6 [ 7 ]]) => [ 1 2 3 [ 4 ] 5 6 [ 7 ] ]"),tags:["elements","concat","array","conjoin","append"],usage:["arg0:*","argN:*"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let reverse=new Function("container","{ return container.slice(0).reverse() }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["reverse"]=reverse;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["reverse"]={
                            core_lang:true,usage:["container:list"],description:"Returns a copy of the passed list as reversed.  The original is not changed.",tags:["list","sort","order"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let map=new AsyncFunction("lambda","array_values","{ try {\n                      let rval = [],\n                      tl = array_values.length;\n                      for (let i = 0; i < array_values.length; i++) {\n                             rval.push(await lambda.apply(this,[array_values[i], i, tl]));\n                             }\n                      return rval;\n                      } catch (ex) {\n                       if (lambda === undefined || lambda === null) {\n                             throw new ReferenceError(\"map: lambda argument (position 0) is undefined or nil\")\n                             } else if (array_values === undefined || array_values === null) {\n                              throw new ReferenceError(\"map: container argument (position 1) is undefined or nil\")\n                              } else if (!(lambda instanceof Function)) {\n                               throw new ReferenceError(\"map: lambda argument must be a function: received: \"+ typeof lambda)\n                               } else if (!(array_values instanceof Array)) {\n                                throw new ReferenceError(\"map: invalid array argument, received: \" + typeof array_values)\n                                } else {\n                                 // something else just pass on the error\n                                 throw ex;\n                                 }\n                       }\n                 }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["map"]=map;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["map"]={
                            core_lang:true,description:("Provided a function as a first argument, map calls the function "+ "(item, current_index, total_length) with each element from the second argument, which should be a list. Returns a new list containing the return values resulting from evaluating."),tags:["array","container","elements","iteration"],usage:["lambda:function","elements:array"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let bind=new Function("func,this_arg","{ return func.bind(this_arg) }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["bind"]=bind;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["bind"]={
                            core_lang:true,description:"Given a function and a this value, the bind function returns a new function that has its this keyword set to the provided value in this_arg.",usage:["func:function","this_arg:*"],tags:["bind","this","function"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let to_object=new Function("array_values","{\n                         let obj={}\n                         array_values.forEach((pair)=>{\n                                                 obj[pair[0]]=pair[1]\n                                                 });\n                         return obj;\n                         }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["to_object"]=to_object;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["to_object"]={
                            core_lang:true,description:("Given an array of pairs in the form of [[key value] [key value] ...], constructs an "+ "object with the first array element of the pair as the key and the second "+ "element as the value. A single object is returned."),usage:["paired_array:array"],tags:["conversion","object","array","list","pairs"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let to_array=async function(container) {
                        return await async function(){
                            if (check_true ((container instanceof Array))) {
                                return container
                            } else if (check_true (await (await get_global("is_set?"))(container))) {
                                {
                                    let acc=[];
                                    ;
                                    await container["forEach"].call(container,async function(v) {
                                        return (acc).push(v)
                                    });
                                    return acc
                                }
                            } else if (check_true ((container instanceof String || typeof container==='string'))) {
                                return (container).split("")
                            } else if (check_true ((container instanceof Object))) {
                                return await pairs(container)
                            } else {
                                return await (async function(){
                                    let __array_op_rval__45=container;
                                     if (__array_op_rval__45 instanceof Function){
                                        return await __array_op_rval__45() 
                                    } else {
                                        return [__array_op_rval__45]
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
                            core_lang:true,description:("Given a container of type Array, Set, Object, or a string, "+ "it will convert the members of the container to an array form, "+ "and return a new array with the values of the provided container. "+ "In the case of an object, the keys and values will be contained in "+ "paired arrays in the returned array.  A string will be split into "+ "individual characters. If provided a different "+ "type other than the listed values above, the value will be placed "+ "in an array as a single element."),usage:["container:*"],tags:["array","conversion","set","object","string","pairs"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let slice=function(target,from,to) {
                        return   (function(){
                            if (check_true (to)) {
                                return  target["slice"].call(target,from,to)
                            } else if (check_true (from)) {
                                return  target["slice"].call(target,from)
                            } else {
                                throw new SyntaxError("slice requires 2 or 3 arguments");
                                
                            }
                        } )()
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["slice"]=slice;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["slice"]={
                            core_lang:true,description:"Given an array, with a starting index and an optional ending index, slice returns a new array containing the elements in the range of provided indices.",usage:["target:array","from:number","to:number"],tags:["array","slicing","dimensions","subset"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let rest=function(x) {
                        return   (function(){
                            if (check_true ((x instanceof Array))) {
                                return  x["slice"].call(x,1)
                            } else if (check_true ((x instanceof String || typeof x==='string'))) {
                                return  x["substr"].call(x,1)
                            } else {
                                return null
                            }
                        } )()
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["rest"]=rest;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["rest"]={
                            core_lang:true,description:"Returns a new array containing the elements in the 2nd through last position (the tail) of the provided array.",usage:["x:array"],tags:["array","subset","slice","tail","end"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let second=new Function("x","{ return x[1] }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["second"]=second;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["second"]={
                            core_lang:true,description:"Returns the second element in the provided array (the element at index 1)",tags:["array","subset","element","first"],usage:["x:array"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let third=new Function("x","{ return x[2] }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["third"]=third;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["third"]={
                            core_lang:true,description:"Returns the third element in the provided array (the element at index 2)",tags:["array","subset","element","first"],usage:["x:array"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let chop=new Function("x","{ if (x instanceof Array) { return x.slice(0, x.length-1) } else { return x.substr(0,x.length-1) } }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["chop"]=chop;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["chop"]={
                            core_lang:true,description:"Returns a new container containing all items except the last item.  This function takes either an array or a string.",usage:["container:array|string"],tags:["array","slice","subset","first","string"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let chomp=new Function("x","{ return x.substr(x.length-1) }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["chomp"]=chomp;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["chomp"]={
                            core_lang:true,description:"Given a string returns a new string containing all characters except the last character.",usage:["x:string"],tags:["slice","subset","string"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let not=new Function("x","{ if (check_true(x)) { return false } else { return true } }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["not"]=not;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["not"]={
                            core_lang:true,description:"Returns the logical opposite of the given value.  If given a truthy value, a false is returned.  If given a falsey value, true is returned.",usage:["x:*"],tags:["logic","not","inverse"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let push=new Function("place","thing","{ return place.push(thing) }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["push"]=push;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["push"]={
                            core_lang:true,description:"Given an array as a place, and an arbitrary value, appends (pushes) the value to the end of the array.",usage:["place:array","thing:*"],tags:["array","mutate","append","concat","pop"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let pop=new Function("place","{ return place.pop() }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["pop"]=pop;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["pop"]={
                            core_lang:true,description:"Given an array as an arguments, removes the last value from the given array and returns it.",usage:["place:array"],tags:["array","mutate","take","remove","push"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let list=async function(...args) {
                        return args
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["list"]=list;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["list"]={
                            core_lang:true,description:"Given a set of arbitrary arguments, returns an array containing the provided arguments. If no arguments are provided, returns an empty array.",usage:["arg0:*","argN:*"],tags:["array","container","elements"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let flatten=new Function("x","{ return x.flat(999999999999) } ");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["flatten"]=flatten;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["flatten"]={
                            core_lang:true,description:"Given a nested array structure, returns a flattened version of the array",usage:["x:array"],tags:["array","container","flat","tree"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let jslambda=function(...args) {
                        return  ( function(){
                            let __apply_args__70= flatten(args);
                            return ( Function).apply(this,__apply_args__70)
                        })()
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["jslambda"]=jslambda;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["jslambda"]={
                            core_lang:true,description:("Proxy for Javascript Function.  Given a set of string based arguments, all but the last are considered arguments to the "+ "function to be defined.  The last argument is considered the body of the function and should be provided as a string of "+ "javascript. Returns a javascript function. <br>"+ "(jslambda (`a `b) \"{ return a+b }\")<br>"+ "(jslambda () \"{ return new Date() }\")"),usage:["argument_list:array","argn:string"],tags:["javascript","embed","function"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let join=function(...args) {
                        return   (function(){
                            if (check_true ((args.length===1))) {
                                return  args['0']["join"].call(args['0'],"")
                            } else {
                                return  args['1']["join"].call(args['1'],args['0'])
                            }
                        } )()
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["join"]=join;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["join"]={
                            core_lang:true,description:("Given an optional joining string and an array of strings, returns a string containing the "+ "elements of the array interlaced with the optional joining string.<br>"+ "(join \",\" [ \"red\" \"fox\" ]) -> \"red,fox\"<br>"+ "(join [\"red\" \"fox\"]) -> redfox"),tags:["array","combine","split","string","text"],usage:["joining_string?:string","container:array"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let lowercase=function(x) {
                        return  x["toLowerCase"]()
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["lowercase"]=lowercase;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["lowercase"]={
                            core_lang:true,description:"Given a string, converts all capital characters to lowercase characters.",tags:["string","text","uppercase","case","convert"],usage:["text:string"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let uppercase=function(x) {
                        return  x["toUpperCase"]()
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["uppercase"]=uppercase;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["uppercase"]={
                            core_lang:true,description:"Given a string, converts all capital characters to uppercase characters.",tags:["string","text","lowercase","case","convert"],usage:["text:string"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let log=function(...args) {
                        return  ( function(){
                            return ( console.log).apply(this,args)
                        })()
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["log"]=log;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["log"]={
                            core_lang:true,description:("log is a shorthand call for console.log by default, and serves to provide a base "+ "abstraction for logging.  Log behavior can be changed by redefining log to "+ "better suit the environmental context.  For example, writing log output to a file "+ "or HTML container."),usage:["args0:*","argsN:*"],tags:["logging","console","output"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let split=new Function("container","token","{ return container.split(token) }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["split"]=split;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["split"]={
                            core_lang:true,description:("Given a string to partition and a string for a splitting token, return an array whose elements "+ "are the text found between each splitting token. <br>"+ "(split \"red,fox\" \",\") => [ \"red\" \"fox\" ]"),tags:["partition","join","separate","string","array"],usage:["string_to_split:string","split_token:string"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let split_by=new Function("token","container","{ return container.split(token) }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["split_by"]=split_by;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["split_by"]={
                            core_lang:true,description:("Given a string for a splitting token and a string to partition, return an array whose elements "+ "are the text found between each splitting token. <br>"+ "(split_by \",\" \"red,fox\") => [ \"red\" \"fox\" ]"),tags:["partition","join","separate","string","array"],usage:["split_token:string","string_to_split:string"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let is_object_ques_=new Function("x","{ return x instanceof Object }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["is_object?"]=is_object_ques_;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["is_object?"]={
                            core_lang:true,description:"for the given value x, returns true if x is an Javascript object type.",usage:["arg:value"],tags:["type","condition","subtype","value","what"]
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
                            core_lang:true,description:"for the given value x, returns true if x is an array.",usage:["arg:value"],tags:["type","condition","subtype","value","what"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let is_number_ques_=function(x) {
                        return ( subtype(x)==="Number")
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["is_number?"]=is_number_ques_;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["is_number?"]={
                            core_lang:true,description:"for the given value x, returns true if x is a number.",usage:["arg:value"],tags:["type","condition","subtype","value","what","function"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let is_function_ques_=function(x) {
                        return (x instanceof Function)
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["is_function?"]=is_function_ques_;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["is_function?"]={
                            core_lang:true,description:"for the given value x, returns true if x is a function.",usage:["arg:value"],tags:["type","condition","subtype","value","what","function"]
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
                            core_lang:true,description:"for the given value x, returns true if x is a set.",usage:["arg:value"],tags:["type","condition","subtype","value","what"]
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
                            core_lang:true,description:"for the given value x, returns true if x is an Element object",usage:["arg:value"],tags:["type","condition","subtype","value","what"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let is_string_ques_=function(x) {
                        return ((x instanceof String)|| (typeof x==="string"))
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["is_string?"]=is_string_ques_;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["is_string?"]={
                            core_lang:true,description:"for the given value x, returns true if x is a String object",usage:["arg:value"],tags:["type","condition","subtype","value","what"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let is_nil_ques_=function(x) {
                        return (x===null)
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["is_nil?"]=is_nil_ques_;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["is_nil?"]={
                            core_lang:true,description:"for the given value x, returns true if x is exactly equal to nil.",usage:["arg:value"],tags:["type","condition","subtype","value","what"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let is_regex_ques_=function(x) {
                        return ( sub_type(x)==="RegExp")
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["is_regex?"]=is_regex_ques_;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["is_regex?"]={
                            core_lang:true,description:"for the given value x, returns true if x is a Javascript regex object",usage:["arg:value"],tags:["type","condition","subtype","value","what"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let is_date_ques_=function(x) {
                        return ( sub_type(x)==="Date")
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["is_date?"]=is_date_ques_;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["is_date?"]={
                            core_lang:true,description:"for the given value x, returns true if x is a Date object.",usage:["arg:value"],tags:["type","condition","subtype","value","what"]
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
                            core_lang:true,description:"for a given string or array, checks to see if it ends with the given start_value.  Non string args return false.",usage:["end_value:value","collection:array|string"],tags:["string","text","list","array","filter","reduce"]
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
                            core_lang:true,description:"for a given string or array, checks to see if it starts with the given start_value.  Non string args return false.",usage:["start_value:value","collection:array|string"],tags:["string","text","list","array","filter","reduce","begin"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let delete_prop=new Function("obj","...args","{\n                           if (args.length == 1) {\n                                return delete obj[args[0]];\n                                } else {\n                                 while (args.length > 0) {\n                                         let prop = args.shift();\n                                         delete obj[prop];\n                                         }\n                                 }\n                           return obj;\n                           }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["delete_prop"]=delete_prop;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["delete_prop"]={
                            core_lang:true,description:("Removes the key or keys of the provided object, and returns the modified object.<br>Example:<br>"+ "(defglobal foo { abc: 123 def: 456 ghi: 789 })<br>"+ "(delete_prop foo `abc `def) => { ghi: 789 }<br>"),usage:["obj:objects","key0:string","keyN?:string"],tags:["delete","keys","object","remove","remove_prop","mutate"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let blank_ques_=function(val) {
                        return ((val==null)|| ((val instanceof String || typeof val==='string')&& (val==="")))
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["blank?"]=blank_ques_;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["blank?"]={
                            core_lang:true,description:"Given a value, if it is equal (via eq) to nil or to \"\" (an empty string), returns true, otherwise false.",usage:["val:*"],tags:["string","empty","text"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let contains_ques_=new Function("value","container","{ if (!value && !container) { return false }\n                         else if (container === null) { throw new TypeError(\"contains?: passed nil/undefined container value\"); }\n                                            else if (container instanceof Array) return container.includes(value);\n                                            else if (container instanceof Set) return container.has(value);\n                                            else if ((container instanceof String) || typeof container === \"string\") {\n                                                     if (subtype(value) === \"Number\") return container.indexOf(\"\"+value)>-1;\n                                                     else return container.indexOf(value)>-1;\n                                                     }\n                                            else throw new TypeError(\"contains?: passed invalid container type: \"+subtype(container)) }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["contains?"]=contains_ques_;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["contains?"]={
                            core_lang:true,description:("Given a target value and container value (array, set, or string), checks if the container has the value. "+ "If it is found, true is returned, otherwise false if returned.  "),tags:["string","array","set","has","includes","indexOf"],usage:["value:*","container:array|set|string"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let make_set=function(vals) {
                        if (check_true ((vals instanceof Array))){
                            return new Set(vals)
                        } else {
                            {
                                let vtype;
                                vtype= sub_type(vals);
                                return   (function(){
                                    if (check_true ((vtype==="Set"))) {
                                        return new Set(vals)
                                    } else if (check_true ((vtype==="object"))) {
                                        return new Set( values(vals))
                                    }
                                } )()
                            }
                        }
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["make_set"]=make_set;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["make_set"]={
                            core_lang:true,description:("If given an array, a new Set is returned containing the elements of the array. "+ "If given an object, a new Set is returned containing the values of the object, and the keys are discarded. "+ "If given a set, new Set is created and returend  from the values of the old set."),usage:["vals:array|object|set"],tags:["array","set","object","values","convert"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let meta_for_symbol=function(quoted_symbol,search_mode) {
                        if (check_true ((quoted_symbol instanceof String || typeof quoted_symbol==='string'))){
                            {
                                let local_data=(Environment.global_ctx.scope[quoted_symbol]|| Environment.definitions[quoted_symbol]);
                                ;
                                let acc=[];
                                ;
                                if (check_true (search_mode)){
                                    {
                                        if (check_true (local_data)){
                                            {
                                                (acc).push( ( get_global("add"))({
                                                    namespace:namespace,name:quoted_symbol,type: subtype(local_data)
                                                }, ( function(){
                                                    let it;
                                                    it=Environment.definitions[quoted_symbol];
                                                    if (check_true (it)){
                                                        return it
                                                    } else {
                                                        return new Object()
                                                    }
                                                })()))
                                            }
                                        };
                                        if (check_true (parent_environment)){
                                            {
                                                {
                                                    let __collector;
                                                    let __result;
                                                    let __action;
                                                    __collector=[];
                                                    __result=null;
                                                    __action=function(info) {
                                                        return (acc).push(info)
                                                    };
                                                    ;
                                                     ( function() {
                                                        let __for_body__122=function(__item) {
                                                            __result= __action(__item);
                                                            if (check_true (__result)){
                                                                return (__collector).push(__result)
                                                            }
                                                        };
                                                        let __array__123=[],__elements__121= ( function() {
                                                            {
                                                                 let __call_target__= parent_environment["meta_for_symbol"].call(parent_environment,quoted_symbol,true), __call_method__="flat";
                                                                return  __call_target__[__call_method__].call(__call_target__,1)
                                                            } 
                                                        })();
                                                        let __BREAK__FLAG__=false;
                                                        for(let __iter__120 in __elements__121) {
                                                            __array__123.push( __for_body__122(__elements__121[__iter__120]));
                                                            if(__BREAK__FLAG__) {
                                                                 __array__123.pop();
                                                                break;
                                                                
                                                            }
                                                        }return __array__123;
                                                         
                                                    })();
                                                    __collector
                                                }
                                            }
                                        };
                                        if (check_true (( length( keys(children))>0))){
                                            {
                                                {
                                                    let __collector;
                                                    let __result;
                                                    let __action;
                                                    __collector=[];
                                                    __result=null;
                                                    __action=function(details) {
                                                        return (acc).push(details)
                                                    };
                                                    ;
                                                     ( function() {
                                                        let __for_body__126=function(__item) {
                                                            __result= __action(__item);
                                                            if (check_true (__result)){
                                                                return (__collector).push(__result)
                                                            }
                                                        };
                                                        let __array__127=[],__elements__125= ( function(){
                                                            let ____collector__128=  function(){
                                                                return []
                                                            };
                                                            let ____result__129=  function(){
                                                                return null
                                                            };
                                                            let ____action__130=  function(){
                                                                return function(child_data) {
                                                                    if (check_true ( not((child_data['0']=== ( get_global("current_namespace"))())))){
                                                                        {
                                                                            return  child_data['1']["meta_for_symbol"].call(child_data['1'],quoted_symbol)
                                                                        }
                                                                    }
                                                                }
                                                            };
                                                            {
                                                                let __collector= ____collector__128();
                                                                ;
                                                                let __result= ____result__129();
                                                                ;
                                                                let __action= ____action__130();
                                                                ;
                                                                ;
                                                                 ( function() {
                                                                    let __for_body__133=function(__item) {
                                                                        __result= __action(__item);
                                                                        if (check_true (__result)){
                                                                            return (__collector).push(__result)
                                                                        }
                                                                    };
                                                                    let __array__134=[],__elements__132= pairs(children);
                                                                    let __BREAK__FLAG__=false;
                                                                    for(let __iter__131 in __elements__132) {
                                                                        __array__134.push( __for_body__133(__elements__132[__iter__131]));
                                                                        if(__BREAK__FLAG__) {
                                                                             __array__134.pop();
                                                                            break;
                                                                            
                                                                        }
                                                                    }return __array__134;
                                                                     
                                                                })();
                                                                return __collector
                                                            }
                                                        })();
                                                        let __BREAK__FLAG__=false;
                                                        for(let __iter__124 in __elements__125) {
                                                            __array__127.push( __for_body__126(__elements__125[__iter__124]));
                                                            if(__BREAK__FLAG__) {
                                                                 __array__127.pop();
                                                                break;
                                                                
                                                            }
                                                        }return __array__127;
                                                         
                                                    })();
                                                    __collector
                                                }
                                            }
                                        };
                                        return acc
                                    }
                                } else {
                                    {
                                        quoted_symbol= ( function(){
                                            if (check_true ( starts_with_ques_( ( function(){
                                                 return "=:" 
                                            })(),quoted_symbol))){
                                                return  quoted_symbol["substr"].call(quoted_symbol,2)
                                            } else {
                                                return quoted_symbol
                                            }
                                        })();
                                        {
                                            let it;
                                            it=Environment.definitions[quoted_symbol];
                                            if (check_true (it)){
                                                return  ( get_global("add"))({
                                                    namespace:namespace,type: sub_type(local_data),name:quoted_symbol
                                                },it)
                                            } else {
                                                return null
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["meta_for_symbol"]=meta_for_symbol;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["meta_for_symbol"]={
                            core_lang:true,description:("Given a quoted symbol and a boolean indicating whether or not all namespaces should be searched, returns "+ "the meta data associated with the symbol for each environment.  If search mode is requested, the value returned "+ "is an array, since there can be symbols with the same name in different environments. If no values are found "+ "an empty array is returned.  If not in search mode, meta_for_symbol searches the current namespace "+ "only, and if a matching symbol is found, returns an object with all found metadata, otherwise nil is returned."),usage:["quoted_symbol:string","search_mode:boolean"],tags:["describe","meta","help","definition","symbol","metadata"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let describe=async function(quoted_symbol,search_mode) {
                        let internal_results=await meta_for_symbol(quoted_symbol,true);
                        ;
                        if (check_true (((internal_results instanceof Array)&& internal_results['0']))){
                            if (check_true (search_mode)){
                                return internal_results
                            } else {
                                return await first(internal_results)
                            }
                        } else {
                            {
                                let external_results=await get_outside_global(quoted_symbol);
                                ;
                                if (check_true (external_results)){
                                    return {
                                        location:"external",type:await subtype(external_results)
                                    }
                                } else {
                                    return null
                                }
                            }
                        }
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["describe"]=describe;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["describe"]={
                            core_lang:true,description:"Given a quoted symbol returns the relevant metadata pertinent to the current namespace context.",usage:["quoted_symbol:string","search_mode:boolean"],tags:["meta","help","definition","symbol","metadata","info","meta_for_symbol"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let undefine=function(quoted_symbol) {
                        if (check_true ((quoted_symbol instanceof String || typeof quoted_symbol==='string'))){
                            {
                                let namespace_identity;
                                let parent_call;
                                let child_call;
                                let target_symbol;
                                namespace_identity=(quoted_symbol).split("/");
                                parent_call=null;
                                child_call=null;
                                target_symbol=null;
                                ;
                                return   (function(){
                                    if (check_true ((((namespace_identity.length===1)&& Environment.global_ctx.scope[namespace_identity['0']])|| ((namespace_identity.length>1)&& (namespace_identity['0']===namespace))))) {
                                        {
                                            target_symbol= ( function(){
                                                if (check_true ((namespace_identity.length>1))){
                                                    return namespace_identity['1']
                                                } else {
                                                    return namespace_identity['0']
                                                }
                                            })();
                                             delete_prop(Environment.definitions,target_symbol);
                                            if (check_true (Environment.global_ctx.scope[target_symbol])){
                                                return  delete_prop(Environment.global_ctx.scope,target_symbol)
                                            } else {
                                                return false
                                            }
                                        }
                                    } else if (check_true (((namespace_identity.length>1)&& parent_environment))) {
                                        {
                                            parent_call= parent_environment["get_global"].call(parent_environment,"undefine");
                                            return (parent_call)(quoted_symbol)
                                        }
                                    } else if (check_true (((namespace_identity.length>1)&& children[namespace_identity['0']]))) {
                                        {
                                            child_call= ( function() {
                                                {
                                                     let __call_target__=children[namespace_identity['0']], __call_method__="get_global";
                                                    return  __call_target__[__call_method__].call(__call_target__,"undefine")
                                                } 
                                            })();
                                            return  child_call(quoted_symbol)
                                        }
                                    } else {
                                        return false
                                    }
                                } )()
                            }
                        } else {
                            throw new SyntaxError("undefine requires a quoted symbol");
                            
                        }
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["undefine"]=undefine;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["undefine"]={
                            core_lang:true,description:("Given a quoted symbol removes the symbol and any definition information from the namespace. "+ "If the namespace is fully-qualified, then the symbol will be removed from the specified namespace "+ "instead of the currently active namespace. If the symbol is successfully removed, the function "+ "will return true, otherwise if it is not found, false will be returned.  Note that if the "+ "specified symbol is non-qualified, but exists in a different, accessible namespace, but the "+ "symbol isn't present in the current namespace, the symbol will not be deleted.  The environment "+ "is not searched and therefore symbols have to be explicitly fully-qualified for any effect "+ "of this function outside the current namespace."),usage:["quoted_symbol:string"],tags:["symbol","delete","remove","unintern","reference","value"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let eval_exp=async function(expression) {
                        return await (async function(){
                            let __array_op_rval__141=expression;
                             if (__array_op_rval__141 instanceof Function){
                                return await __array_op_rval__141() 
                            } else {
                                return [__array_op_rval__141]
                            }
                        })()
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["eval_exp"]=eval_exp;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["eval_exp"]={
                            core_lang:true,description:("Evaluates the given expression and returns the value."),usage:["expression:*"],tags:["eval","evaluation","expression"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let indirect_new=function(...args) {
                        
                                        {
                                          let targetClass = args[0];
                                          if (subtype(targetClass)==="String") {
                                               let tmpf=new Function("{ return "+targetClass+" }");
                                               targetClass = tmpf();
                                               }
                                          if (args.length==1) {
                                               let f = function(Class) {
                                                                 return new (Function.prototype.bind.apply(Class, args));
                                                                 }
                                               let rval = f.apply(this,[targetClass]);
                                               return rval;
                                               } else {
                                                let f = function(Class) {
                                                                  return new (Function.prototype.bind.apply(Class, args));
                                                                  }
                                                let rval = f.apply(this,[targetClass].concat(args.slice(1)));
                                                return rval;
                                                }
                                          } 
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["indirect_new"]=indirect_new;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["indirect_new"]={
                            core_lang:true,description:("Used by the compiler for implementation of the new operator and shouldn't be directly called by "+ "user programs.  The new operator should be called instead."),usage:["arg0:*","argsN:*"],tags:["system","compiler","internal"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let range=function(...args) {
                        let from_to;
                        let step;
                        let idx;
                        let acc;
                        from_to= ( function(){
                            if (check_true (args['1'])){
                                return [parseInt(args['0']),parseInt(args['1'])]
                            } else {
                                return [0,parseInt(args['0'])]
                            }
                        })();
                        step= ( function(){
                            if (check_true (args['2'])){
                                return parseFloat(args['2'])
                            } else {
                                return 1
                            }
                        })();
                        idx=from_to['0'];
                        acc=[];
                         ( get_global("assert"))((step>0),"range: step must be > 0");
                         ( get_global("assert"))((from_to['1']>=from_to['0']),"range: lower bound must be greater or equal than upper bound");
                         ( function(){
                             let __test_condition__146=function() {
                                return (idx<from_to['1'])
                            };
                            let __body_ref__147=function() {
                                (acc).push(idx);
                                return idx+=step
                            };
                            let __BREAK__FLAG__=false;
                            while( __test_condition__146()) {
                                  __body_ref__147();
                                 if(__BREAK__FLAG__) {
                                     break;
                                    
                                }
                            } ;
                            
                        })();
                        return acc
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["range"]=range;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["range"]={
                            core_lang:true,usage:["start_or_end:number","end:number","step:number"],description:("Range has a variable form depending on the amount of arguments provided to the function when "+ "calling it. If provided one argument, range will produce an array from 0 up to, but not including "+ "the provided value. If given two arguments, the first argument will be the starging value and "+ "the last value will be used as the upper bounding value, returning an array with elements starting "+ "at the start value and up to, but not including the bounding value. If given a third value, the "+ "value will be interpreted as the step value, and the returned array will contain values that "+ "increment by the step amount.  Range will throw an error if a negative range is specified. "+ "For negative ranges see neg_range."+ "<br><br>Examples:<br>"+ "(range 5) -> [ 0 1 2 3 4 ]<br>"+ "(range 10 15) -> [ 10 11 12 13 14 ]<br>"+ "(range 10 20) -> [ 10 12 14 16 18 ]<br>"+ "(range -5 0) -> [ -5 -4 -3 -2 -1 ]<br>"+ "(range -3 3) -> [ -3, -2, -1, 0, 1, 2 ]<br>")
                        };
                        return Environment.definitions;
                        
                    }()];
                    let add=new Function("...args","{\n                              let acc;\n                              if (typeof args[0]===\"number\") {\n                                   acc = 0;\n                                   } else if (args[0] instanceof Array) {\n                                    return args[0].concat(args.slice(1));\n                                    } else if (typeof args[0]==='object') {\n                                     let rval = {};\n                                     for (let i in args) {\n                                            if (typeof args[i] === 'object') {\n                                                 for (let k in args[i]) {\n                                                        rval[k] = args[i][k];\n                                                        }\n                                                 }\n                                            }\n                                     return rval;\n                                     } else {\n                                      acc = \"\";\n                                      }\n                              for (let i in args) {\n                                     acc += args[i];\n                                     }\n                              return acc;\n                              }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["add"]=add;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["add"]={
                            core_lang:true,description:("Add is an overloaded function that, based on the first argument provided, determines how to 'add' the arguments. "+ "If provided a number as a first argument, then it will assume the rest of the arguments are numbers and add them "+ "to the first, returning the numerical sum of the arguments. If an object, it will merge the keys of the provided "+ "arguments, returning a combined object.  Be aware that if merging objects, if arguments that have the same keys "+ "the argument who appears last with the key will prevail.  If called with an array as a first argument, the "+ "subsequent arguments will be added to the first via 'concat'.  If strings, the strings will be joined into a "+ "single string and returned.<br>"+ "(add 1 2 3) => 6<br>"+ "(add { `abc: 123 `def: 345 } { `def: 456 }) => { abc: 123, def: 456 }"+ "(add [ 1 2 3 ] [ 4 5 6] 7) => [ 1, 2, 3, [ 4, 5, 6 ], 7 ]<br>"+ "(add \"abc\" \"def\") => \"abcdef\"<br><br>"+ "Note that add doesn't typically need to explicily called.  The compiler will try and determine the best "+ "way to handle adding based on the arguments to be added, so the + operator should be used instead, since "+ "it gives the compiler an opportunity to inline if possible."),usage:["arg0:*","argN:*"],tags:["add","+","sum","number","addition","merge","join","concat"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let merge_objects=new Function("x","{\n                                        let rval = {};\n                                        for (let i in x) {\n                                               if (typeof i === 'object') {\n                                                    for (let k in x[i]) {\n                                                           rval[k] = x[i][k];\n                                                           }\n                                                    }\n                                               }\n                                        return rval;\n                                        }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["merge_objects"]=merge_objects;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["merge_objects"]={
                            core_lang:true,description:("Merge objects takes an array of objects and returns an object whose keys and values are "+ "the sum of the provided objects (same behavior as add with objects).  If objects have the "+ "same keys, the last element in the array with the duplicate key will be used to provide the "+ "value for that key."),usage:["objects:array"],tags:["add","merge","keys","values","objects","value"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let index_of=new Function("value","container",("{ return container.indexOf(value) }"));
                    ;
                    await async function(){
                        Environment.global_ctx.scope["index_of"]=index_of;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["index_of"]={
                            core_lang:true,description:"Given a value and an array container, returns the index of the value in the array, or -1 if not found.",usage:["value:number|string|boolean","container:array"],tags:["find","position","index","array","contains"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let resolve_path=new Function("path,obj","{\n                                       if (typeof path==='string') {\n                                            path = path.split(\".\");\n                                            }\n                                       let s=obj;\n                                       return path.reduce(function(prev, curr) {\n                                                                    return prev ? prev[curr] : undefined\n                                                                    }, obj || {})\n                                       }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["resolve_path"]=resolve_path;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["resolve_path"]={
                            core_lang:true,description:("Given a path and a tree structure, which can be either an array or an object, "+ "traverse the tree structure and return the value at the path if it exists, otherwise "+ "undefined is returned.<br>"+ "(resolve_path [ 2 1 ] [ 1 2 [ 3 4 5 ] 6 7]) => 4)"),usage:["path:array","tree_structure:array|object"],tags:["find","position","index","path","array","tree","contains","set_path"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let min_value=new Function("elements","{ return Math.min(...elements); }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["min_value"]=min_value;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["min_value"]={
                            core_lang:true,description:"Returns the minimum value in the provided array of numbers.",usage:["elements:array"],tags:["min","max_value","array","elements","minimum","number"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let max_value=new Function("elements","{ return Math.max(...elements); }");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["max_value"]=max_value;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["max_value"]={
                            core_lang:true,description:"Returns the maximum value in the provided array of numbers.",usage:["elements:array"],tags:["min","max_value","array","elements","minimum","number"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let interlace=async function(...args) {
                        let min_length;
                        let rlength_args;
                        let rval;
                        min_length=await min_value(await (async function(){
                             return await map(length,args) 
                        })());
                        rlength_args=await range(await length(args));
                        rval=[];
                        await (async function() {
                            let __for_body__164=async function(i) {
                                return await (async function() {
                                    let __for_body__168=async function(j) {
                                        return (rval).push(await (async function(){
                                            let __targ__170=args[j];
                                            if (__targ__170){
                                                 return(__targ__170)[i]
                                            } 
                                        })())
                                    };
                                    let __array__169=[],__elements__167=rlength_args;
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__166 in __elements__167) {
                                        __array__169.push(await __for_body__168(__elements__167[__iter__166]));
                                        if(__BREAK__FLAG__) {
                                             __array__169.pop();
                                            break;
                                            
                                        }
                                    }return __array__169;
                                     
                                })()
                            };
                            let __array__165=[],__elements__163=await range(min_length);
                            let __BREAK__FLAG__=false;
                            for(let __iter__162 in __elements__163) {
                                __array__165.push(await __for_body__164(__elements__163[__iter__162]));
                                if(__BREAK__FLAG__) {
                                     __array__165.pop();
                                    break;
                                    
                                }
                            }return __array__165;
                             
                        })();
                        return rval
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["interlace"]=interlace;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["interlace"]={
                            core_lang:true,usage:["list0:array","list1:array","listn?:array"],description:"Returns a list containing a consecutive values from each list, in argument order.  I.e. list0.0 list1.0 listn.0 list0.1 list1.1 listn.1 ...",tags:["list","array","join","merge"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let trim=function(x) {
                        return  x["trim"]()
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["trim"]=trim;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["trim"]={
                            core_lang:true,description:"Removes leading and trailing spaces from the provided string value.",usage:["value:string"],tags:["string","spaces","clean","squeeze","leading","trailing","space"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let assert=function(assertion_form,failure_message) {
                        if (check_true (assertion_form)){
                            return assertion_form
                        } else {
                            throw new EvalError((failure_message|| "assertion failure"));
                            
                        }
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["assert"]=assert;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["assert"]={
                            core_lang:true,description:"If the evaluated assertion form is true, the result is returned, otherwise an EvalError is thrown with the optionally provided failure message.",usage:["form:*","failure_message:string?"],tags:["true","error","check","debug","valid","assertion"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let unquotify=async function(val) {
                        let dval;
                        dval=val;
                        if (check_true (await starts_with_ques_("\"",dval))){
                            dval=await dval["substr"].call(dval,1,(dval.length- 2))
                        };
                        if (check_true (await starts_with_ques_("=:",dval))){
                            dval=await dval["substr"].call(dval,2)
                        };
                        return dval
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["unquotify"]=unquotify;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["unquotify"]={
                            core_lang:true,description:"Removes binding symbols and quotes from a supplied value.  For use in compile time function such as macros.",usage:["val:string"],tags:["macro","quote","quotes","desym"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let or_args=async function(argset) {
                        let is_true;
                        is_true=false;
                        await (async function() {
                            let __for_body__181=async function(elem) {
                                if (check_true (elem)){
                                    {
                                        is_true=true;
                                        return __BREAK__FLAG__=true;
                                        return
                                    }
                                }
                            };
                            let __array__182=[],__elements__180=argset;
                            let __BREAK__FLAG__=false;
                            for(let __iter__179 in __elements__180) {
                                __array__182.push(await __for_body__181(__elements__180[__iter__179]));
                                if(__BREAK__FLAG__) {
                                     __array__182.pop();
                                    break;
                                    
                                }
                            }return __array__182;
                             
                        })();
                        return is_true
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["or_args"]=or_args;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["or_args"]={
                            core_lang:true,description:"Provided an array of values, returns true if any of the values are true, otherwise will return false.",usage:["argset:array"],tags:["or","true","false","array","logic"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let special_operators=async function() {
                        return await make_set(await (async function(){
                             return await compiler([],{
                                special_operators:true,env:Environment
                            }) 
                        })())
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["special_operators"]=special_operators;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["special_operators"]={
                            core_lang:true
                        };
                        return Environment.definitions;
                        
                    }()];
                    let defclog=async function(opts) {
                        let style;
                        style=("padding: 5px;"+ await (async function(){
                            if (check_true (opts.background)){
                                return ("background: "+ opts.background+ ";")
                            } else {
                                return ""
                            }
                        })()+ await (async function(){
                            if (check_true (opts.color)){
                                return ("color: "+ opts.color+ ";")
                            }
                        })()+ "");
                        return async function(...args) {
                            return await (async function(){
                                let __target_arg__189=[].concat(await conj(await (async function(){
                                    let __array_op_rval__190=style;
                                     if (__array_op_rval__190 instanceof Function){
                                        return await __array_op_rval__190() 
                                    } else {
                                        return [__array_op_rval__190]
                                    }
                                })(),args));
                                if(!__target_arg__189 instanceof Array){
                                    throw new TypeError("Invalid final argument to apply - an array is required")
                                }let __pre_arg__191=("%c"+ await (async function(){
                                    if (check_true (opts.prefix)){
                                        return opts.prefix
                                    } else {
                                        return (args).shift()
                                    }
                                })());
                                __target_arg__189.unshift(__pre_arg__191);
                                return (console.log).apply(this,__target_arg__189)
                            })()
                        }
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["defclog"]=defclog;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["defclog"]={
                            core_lang:true,description:("Given a description object, containing specific keys, returns a customized console logging "+ "function implements the given requested properties.<br>Options<br>"+ "prefix:string:The prefix to log prior to any supplied user arguments.<br>"+ "color:string:The text color to use on the prefix (or initial argument if no prefix)<br>"+ "background:string:The background coloe to use on the prefix (or initial argument if no prefix)<br>"),usage:["options:object"],tags:["log","logging","console","utility"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let NOT_FOUND=new ReferenceError("not found");
                    ;
                    await async function(){
                        Environment.global_ctx.scope["NOT_FOUND"]=NOT_FOUND;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["NOT_FOUND"]={
                            core_lang:true
                        };
                        return Environment.definitions;
                        
                    }()];
                    let check_external_env_default=await (async function(){
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
                    [await async function(){
                        Environment.definitions["check_external_env_default"]={
                            core_lang:true
                        };
                        return Environment.definitions;
                        
                    }()];
                    let _star_namespace_star_=namespace;
                    ;
                    await async function(){
                        Environment.global_ctx.scope["*namespace*"]=_star_namespace_star_;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["*namespace*"]={
                            core_lang:true
                        };
                        return Environment.definitions;
                        
                    }()];
                    let pending_ns_loads=new Object();
                    ;
                    await async function(){
                        Environment.global_ctx.scope["pending_ns_loads"]=pending_ns_loads;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["pending_ns_loads"]={
                            core_lang:true
                        };
                        return Environment.definitions;
                        
                    }()];
                    let pend_load=async function(from_namespace,target_namespace,symbol,initializer) {
                        if (check_true ((null==pending_ns_loads[from_namespace]))){
                            {
                                await async function(){
                                    pending_ns_loads[from_namespace]=[];
                                    return pending_ns_loads;
                                    
                                }()
                            }
                        };
                        (pending_ns_loads[from_namespace]).push({
                            symbol:symbol,source_ns:from_namespace,target_ns:target_namespace,initializer:await (async function(){
                                 return ["=:quote",initializer] 
                            })()
                        });
                        return initializer
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["pend_load"]=pend_load;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["pend_load"]={
                            core_lang:true,description:("When used as an initializer wrapper via the use_symbols macro, the wrapped "+ "initializer will not be loaded until the from_namespace is loaded to ensure "+ "that the wrapped initializer won't fail due to not yet loaded dependencies."),usage:["from_namespace:string","target_namespace:string","symbol:string","initializer:array"],tags:["symbol","definitions","namespace","scope","dependency","dependencies","require"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let load_pends=async function(from_namespace) {
                        if (check_true (pending_ns_loads[from_namespace])){
                            {
                                let acc=[];
                                ;
                                acc=await (async function() {
                                    let __for_body__207=async function(load_instruction) {
                                        return ["=:use_symbols",load_instruction.source_ns,[load_instruction.symbol],load_instruction.target_ns]
                                    };
                                    let __array__208=[],__elements__206=pending_ns_loads[from_namespace];
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__205 in __elements__206) {
                                        __array__208.push(await __for_body__207(__elements__206[__iter__205]));
                                        if(__BREAK__FLAG__) {
                                             __array__208.pop();
                                            break;
                                            
                                        }
                                    }return __array__208;
                                     
                                })();
                                await console.log("load_pends: ",from_namespace,"->",acc);
                                (await Environment.eval(await async function(){
                                    return acc
                                }(),null));
                                return true
                            }
                        }
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["load_pends"]=load_pends;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["load_pends"]={
                            core_lang:true
                        };
                        return Environment.definitions;
                        
                    }()];
                    let symbols=async function(opts) {
                        return await async function(){
                            if (check_true ((null==opts))) {
                                return await keys(Environment.global_ctx.scope)
                            } else if (check_true (opts.unique)) {
                                {
                                    let no_includes=await make_set(await conj(["meta_for_symbol","describe","undefine","*namespace*","pend_load","symbols","set_global","get_global","symbol_definition","compile","env_log","evaluate_local","evaluate","eval_struct","set_compiler","clone","eval","add_escape_encoding","get_outside_global","as_lisp","lisp_writer","clone_to_new","save_env","null","compiler"],built_ins));
                                    ;
                                    {
                                        let __collector;
                                        let __result;
                                        let __action;
                                        __collector=[];
                                        __result=null;
                                        __action=async function(sym) {
                                            if (check_true (await no_includes["has"].call(no_includes,sym))){
                                                return null
                                            } else {
                                                return sym
                                            }
                                        };
                                        ;
                                        await (async function() {
                                            let __for_body__213=async function(__item) {
                                                __result=await __action(__item);
                                                if (check_true (__result)){
                                                    return (__collector).push(__result)
                                                }
                                            };
                                            let __array__214=[],__elements__212=await keys(Environment.global_ctx.scope);
                                            let __BREAK__FLAG__=false;
                                            for(let __iter__211 in __elements__212) {
                                                __array__214.push(await __for_body__213(__elements__212[__iter__211]));
                                                if(__BREAK__FLAG__) {
                                                     __array__214.pop();
                                                    break;
                                                    
                                                }
                                            }return __array__214;
                                             
                                        })();
                                        return __collector
                                    }
                                }
                            }
                        } ()
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["symbols"]=symbols;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["symbols"]={
                            core_lang:true,description:("Returns an array of the defined global symbols for the local environment.  "+ "If opts.unique is true, only symbols that are not part of the built ins are "+ "included."),usage:["opts:object"],tags:["symbol","names","definitions","values","scope"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let set_global=function(refname,value,meta,is_constant,target_namespace,contained_req) {
                          (function(){
                            if (check_true ( not((typeof refname==="string")))) {
                                throw new TypeError("reference name must be a string type");
                                
                            } else if (check_true (((Environment===value)|| (Environment.global_ctx===value)|| (Environment.global_ctx.scope===value)))) {
                                {
                                    throw new EvalError("cannot set the environment scope as a global value");
                                    
                                }
                            }
                        } )();
                        if (check_true ( resolve_path( ( function(){
                            let __array_op_rval__217=refname;
                             if (__array_op_rval__217 instanceof Function){
                                return  __array_op_rval__217("constant") 
                            } else {
                                return [__array_op_rval__217,"constant"]
                            }
                        })(),Environment.definitions))){
                            {
                                throw new TypeError(("Assignment to constant variable "+ refname));
                                
                            }
                        };
                        let namespace_identity= ( function(){
                            if (check_true (target_namespace)){
                                return  ( function(){
                                    let __array_op_rval__218=target_namespace;
                                     if (__array_op_rval__218 instanceof Function){
                                        return  __array_op_rval__218(refname) 
                                    } else {
                                        return [__array_op_rval__218,refname]
                                    }
                                })()
                            } else {
                                return (refname).split("/")
                            }
                        })();
                        ;
                        return   (function(){
                            if (check_true ((parent_environment&& (namespace_identity.length>1)&&  not((namespace===namespace_identity['0']))))) {
                                return  parent_environment["set_global"].call(parent_environment,namespace_identity['1'],value,meta,is_constant,namespace_identity['0'],(contained|| contained_req))
                            } else if (check_true (((namespace_identity.length>1)&&  not((namespace_identity['0']===namespace))))) {
                                {
                                    if (check_true ((children[namespace_identity['0']]&&  not(contained_req)))){
                                        return  ( function() {
                                            {
                                                 let __call_target__=children[namespace_identity['0']], __call_method__="set_global";
                                                return  __call_target__[__call_method__].call(__call_target__,namespace_identity['1'],value,meta,is_constant,namespace_identity['0'])
                                            } 
                                        })()
                                    } else {
                                        throw new EvalError(("namespace "+ namespace_identity['0']+ " doesn't exist"));
                                        
                                    }
                                }
                            } else {
                                {
                                    let comps= get_object_path( ( function(){
                                        if (check_true ((1===namespace_identity.length))){
                                            return namespace_identity['0']
                                        } else {
                                            return namespace_identity['1']
                                        }
                                    })());
                                    ;
                                      (function(){
                                        Environment.global_ctx.scope[comps['0']]=value;
                                        return Environment.global_ctx.scope;
                                        
                                    })();
                                    if (check_true (((meta instanceof Object)&&  not((meta instanceof Array))))){
                                        {
                                            if (check_true (is_constant)){
                                                {
                                                      (function(){
                                                        meta["constant"]=true;
                                                        return meta;
                                                        
                                                    })()
                                                }
                                            };
                                              (function(){
                                                Environment.definitions[comps['0']]=meta;
                                                return Environment.definitions;
                                                
                                            })()
                                        }
                                    } else {
                                        if (check_true (is_constant)){
                                            {
                                                  (function(){
                                                    Environment.definitions[comps['0']]={
                                                        constant:true
                                                    };
                                                    return Environment.definitions;
                                                    
                                                })()
                                            }
                                        }
                                    };
                                    return Environment.global_ctx.scope[comps['0']]
                                }
                            }
                        } )()
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["set_global"]=set_global;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["set_global"]={
                            core_lang:true
                        };
                        return Environment.definitions;
                        
                    }()];
                    let get_global=function(refname,value_if_not_found,suppress_check_external_env,target_namespace,path_comps,contained_req) {
                        return   (function(){
                            if (check_true ( not((typeof refname==="string")))) {
                                throw new TypeError("reference name must be a string type");
                                
                            } else if (check_true ((refname==="Environment"))) {
                                return Environment
                            } else if (check_true ( compiler_operators["has"].call(compiler_operators,refname))) {
                                return special_identity
                            } else {
                                {
                                    let namespace_identity;
                                    let comps;
                                    let refval;
                                    let symbol_name;
                                    let check_external_env;
                                    namespace_identity= ( function(){
                                        if (check_true (target_namespace)){
                                            return  ( function(){
                                                let __array_op_rval__225=target_namespace;
                                                 if (__array_op_rval__225 instanceof Function){
                                                    return  __array_op_rval__225(refname) 
                                                } else {
                                                    return [__array_op_rval__225,refname]
                                                }
                                            })()
                                        } else {
                                            return (refname).split("/")
                                        }
                                    })();
                                    comps=(path_comps||  get_object_path( ( function(){
                                        if (check_true ((1===namespace_identity.length))){
                                            return namespace_identity['0']
                                        } else {
                                            return namespace_identity['1']
                                        }
                                    })()));
                                    refval=null;
                                    symbol_name=null;
                                    check_external_env= ( function(){
                                        if (check_true (suppress_check_external_env)){
                                            return false
                                        } else {
                                            return check_external_env_default
                                        }
                                    })();
                                    return   (function(){
                                        if (check_true ((parent_environment&& (namespace_identity.length>1)&&  not((namespace_identity['0']===namespace))))) {
                                            return  parent_environment["get_global"].call(parent_environment,namespace_identity['1'],value_if_not_found,suppress_check_external_env,namespace_identity['0'],comps,(contained|| contained_req))
                                        } else if (check_true (((namespace_identity.length>1)&&  not((namespace_identity['0']===namespace))))) {
                                            {
                                                if (check_true ((children[namespace_identity['0']]&&  not(contained_req)))){
                                                    return  ( function() {
                                                        {
                                                             let __call_target__=children[namespace_identity['0']], __call_method__="get_global";
                                                            return  __call_target__[__call_method__].call(__call_target__,namespace_identity['1'],value_if_not_found,suppress_check_external_env,namespace_identity['0'],comps)
                                                        } 
                                                    })()
                                                } else {
                                                    {
                                                        throw new EvalError(("namespace "+ namespace_identity['0']+ " doesn't exist"));
                                                        
                                                    }
                                                }
                                            }
                                        } else {
                                            {
                                                refval=Environment.global_ctx.scope[comps['0']];
                                                if (check_true (((undefined===refval)&& (namespace_identity.length===1)&& parent_environment))){
                                                    {
                                                        let rval= parent_environment["get_global"].call(parent_environment,refname,value_if_not_found,suppress_check_external_env,null,comps,(contained|| contained_req));
                                                        ;
                                                        return rval
                                                    }
                                                } else {
                                                    {
                                                        if (check_true (((undefined===refval)&& check_external_env))){
                                                            refval= ( function(){
                                                                if (check_true (check_external_env)){
                                                                    return ( get_outside_global(comps['0'])|| NOT_FOUND)
                                                                } else {
                                                                    return NOT_FOUND
                                                                }
                                                            })()
                                                        };
                                                        return   (function(){
                                                            if (check_true (((NOT_FOUND===refval)&&  not((undefined===value_if_not_found))))) {
                                                                return value_if_not_found
                                                            } else if (check_true ((NOT_FOUND===refval))) {
                                                                {
                                                                    throw new ReferenceError(("symbol not found: "+  ( function(){
                                                                        if (check_true ((namespace_identity.length>1))){
                                                                            return  add(namespace,"/",namespace_identity['1'])
                                                                        } else {
                                                                            return  add(namespace,"/",namespace_identity['0'])
                                                                        }
                                                                    })()));
                                                                    
                                                                }
                                                            } else if (check_true ((comps.length===1))) {
                                                                return refval
                                                            } else if (check_true ((comps.length>1))) {
                                                                {
                                                                    return  resolve_path( rest(comps),refval)
                                                                }
                                                            } else {
                                                                {
                                                                     console.warn("get_global: condition fall through: ",comps);
                                                                    return NOT_FOUND
                                                                }
                                                            }
                                                        } )()
                                                    }
                                                }
                                            }
                                        }
                                    } )()
                                }
                            }
                        } )()
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["get_global"]=get_global;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["get_global"]={
                            core_lang:true
                        };
                        return Environment.definitions;
                        
                    }()];
                    let symbol_definition=async function(symname,target_namespace) {
                        let namespace_identity;
                        namespace_identity=await (async function(){
                            if (check_true (target_namespace)){
                                return await (async function(){
                                    let __array_op_rval__228=target_namespace;
                                     if (__array_op_rval__228 instanceof Function){
                                        return await __array_op_rval__228(symname) 
                                    } else {
                                        return [__array_op_rval__228,symname]
                                    }
                                })()
                            } else {
                                if (check_true ((await length(symname)>2))){
                                    return (symname).split("/")
                                } else {
                                    return await (async function(){
                                        let __array_op_rval__229=symname;
                                         if (__array_op_rval__229 instanceof Function){
                                            return await __array_op_rval__229() 
                                        } else {
                                            return [__array_op_rval__229]
                                        }
                                    })()
                                }
                            }
                        })();
                        return await async function(){
                            if (check_true ((namespace_identity.length===1))) {
                                {
                                    let it;
                                    it=Environment.definitions[symname];
                                    if (check_true (it)){
                                        return it
                                    } else {
                                        if (check_true (parent_environment)){
                                            return await parent_environment["symbol_definition"].call(parent_environment,symname)
                                        }
                                    }
                                }
                            } else if (check_true ((namespace_identity['0']===namespace))) {
                                return Environment.definitions[symname]
                            } else if (check_true (parent_environment)) {
                                return await parent_environment["symbol_definition"].call(parent_environment,namespace_identity['1'],namespace_identity['0'])
                            } else if (check_true ((namespace_identity.length===2))) {
                                return await (async function() {
                                    {
                                         let __call_target__=children[namespace_identity['0']], __call_method__="symbol_definition";
                                        return await __call_target__[__call_method__].call(__call_target__,namespace_identity['1'])
                                    } 
                                })()
                            } else {
                                return undefined
                            }
                        } ()
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["symbol_definition"]=symbol_definition;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["symbol_definition"]={
                            core_lang:true,description:("Given a symbol name and an optional namespace, either as a fully qualified path "+ "or via the target_namespace argument, returns definition information about the "+ "retquested symbol.  "+ "Used primarily by the compiler to find metadata for a specific symbol during compilation."),usage:["symname:string","namespace:string"],tags:["compiler","symbols","namespace","search","context","environment"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let compile=async function(json_expression,opts) {
                        let out;
                        opts=await add({
                            env:Environment
                        },opts,{
                            meta:await (async function(){
                                if (check_true ((opts&& opts.meta))){
                                    return true
                                } else {
                                    return false
                                }
                            })()
                        });
                        out=null;
                        out=await (async function(){
                             return await compiler(json_expression,opts) 
                        })();
                        return await async function(){
                            if (check_true (((out instanceof Array)&& out['0'].ctype&& (out['0'].ctype==="FAIL")))) {
                                return out
                            } else if (check_true (opts.meta)) {
                                return out
                            } else {
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
                            core_lang:true,description:("Compiles the given JSON or quoted lisp and returns a string containing "+ "the lisp form or expression as javascript.<br>"+ "If passed the option { meta: true } , an array is returned containing compilation metadata "+ "in element 0 and the compiled code in element 1."),usage:["json_expression:*","opts:object"],tags:["macro","quote","quotes","desym","compiler"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let env_log=await (async function(){
                         return await defclog({
                            prefix:("env"+ id),background:"#B0F0C0"
                        }) 
                    })();
                    ;
                    await async function(){
                        Environment.global_ctx.scope["env_log"]=env_log;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["env_log"]={
                            core_lang:true,description:"The environment logging function used by the environment.",usage:["arg0:*","argN:*"]
                        };
                        return Environment.definitions;
                        
                    }()];
                    let evaluate_local=async function(expression,ctx,opts) {
                        let compiled;
                        let error_data;
                        let requires;
                        let precompiled_assembly;
                        let result;
                        opts=(opts|| new Object());
                        compiled=null;
                        error_data=null;
                        requires=null;
                        precompiled_assembly=null;
                        result=null;
                        if (check_true (opts.compiled_source)){
                            compiled=expression
                        } else {
                            try {
                                compiled=await (async function(){
                                     return await compiler(await (async function(){
                                        if (check_true (opts.json_in)){
                                            return expression
                                        } else {
                                            return await Environment["read_lisp"].call(Environment,expression,{
                                                source_name:opts.source_name
                                            })
                                        }
                                    })(),{
                                        env:Environment,ctx:ctx,formatted_output:true,source_name:opts.source_name,throw_on_error:opts.throw_on_error,on_final_token_assembly:async function(val) {
                                            return precompiled_assembly=val
                                        },error_report:(opts.error_report|| null),quiet_mode:(opts.quiet_mode|| false)
                                    }) 
                                })()
                            } catch (__exception__236) {
                                if (__exception__236 instanceof Error) {
                                    let e=__exception__236;
                                    {
                                        {
                                            if (check_true (opts.throw_on_error)){
                                                {
                                                    throw e;
                                                    
                                                }
                                            };
                                            if (check_true ((e instanceof LispSyntaxError))){
                                                {
                                                    await async function(){
                                                        e["message"]=await JSON.parse(e.message);
                                                        return e;
                                                        
                                                    }()
                                                }
                                            };
                                            await async function(){
                                                if (check_true ((e instanceof LispSyntaxError))) {
                                                    return error_data=await add({
                                                        error:"LispSyntaxError"
                                                    },e.message)
                                                } else {
                                                    error_data={
                                                        error:await sub_type(e),message:e.message,stack:e.stack,form:await (async function(){
                                                             return await async function(){
                                                                if (check_true (((expression instanceof String || typeof expression==='string')&& (expression.length>100)))) {
                                                                    return await add(await expression["substr"].call(expression,0,100),"...")
                                                                } else {
                                                                    return await (await get_global("as_lisp"))(expression)
                                                                }
                                                            } () 
                                                        })(),parent_forms:[],source_name:opts.source_name,invalid:true
                                                    }
                                                }
                                            } ();
                                            if (check_true (opts.error_report)){
                                                await (async function(){
                                                    let __array_op_rval__238=opts.error_report;
                                                     if (__array_op_rval__238 instanceof Function){
                                                        return await __array_op_rval__238(error_data) 
                                                    } else {
                                                        return [__array_op_rval__238,error_data]
                                                    }
                                                })()
                                            } else {
                                                await console.error("Compilation Error: ",error_data)
                                            };
                                            compiled=await (async function(){
                                                 return [{
                                                    error:true
                                                },null] 
                                            })()
                                        }
                                    }
                                }
                            }
                        };
                        return await async function(){
                            if (check_true ((null==compiled))) {
                                return null
                            } else if (check_true ((compiled['0'].ctype==="FAIL"))) {
                                {
                                    if (check_true (opts.error_report)){
                                        {
                                            await (async function(){
                                                let __array_op_rval__239=opts.error_report;
                                                 if (__array_op_rval__239 instanceof Function){
                                                    return await __array_op_rval__239(compiled['1']) 
                                                } else {
                                                    return [__array_op_rval__239,compiled['1']]
                                                }
                                            })()
                                        }
                                    };
                                    return await async function(){
                                        if (check_true ((compiled['1'] instanceof Error))) {
                                            throw compiled['1'];
                                            
                                        } else if (check_true ((compiled['1']['0'] instanceof Error))) {
                                            throw compiled['1']['0'];
                                            
                                        } else if (check_true (((compiled['1']['0'] instanceof Object)&& (compiled['1']['0'].error==="SyntaxError")))) {
                                            {
                                                let new_error=new SyntaxError(compiled['1']['0'].message);
                                                ;
                                                await async function(){
                                                    new_error["from"]=compiled['1']['0'];
                                                    return new_error;
                                                    
                                                }();
                                                throw new_error;
                                                
                                            }
                                        } else {
                                            return compiled['1']
                                        }
                                    } ()
                                }
                            } else if (check_true ((compiled['0'].namespace&& await not((compiled['0'].namespace===namespace))&& parent_environment))) {
                                return await parent_environment["evaluate_local"].call(parent_environment,compiled,ctx,await add(new Object(),opts,{
                                    compiled_source:true
                                }))
                            } else if (check_true ((compiled['0'].namespace&& await not((compiled['0'].namespace===namespace))))) {
                                if (check_true (children[compiled['0'].namespace])){
                                    return await (async function() {
                                        {
                                             let __call_target__=children[compiled['0'].namespace], __call_method__="evaluate_local";
                                            return await __call_target__[__call_method__].call(__call_target__,compiled,ctx,await add(new Object(),opts,{
                                                compiled_source:true
                                            }))
                                        } 
                                    })()
                                } else {
                                    throw new EvalError(("unknown namespace "+ compiled['0'].namespace+ " assignment"));
                                    
                                }
                            } else {
                                {
                                    if (check_true (opts.on_compilation_complete)){
                                        await (async function(){
                                            let __array_op_rval__241=opts.on_compilation_complete;
                                             if (__array_op_rval__241 instanceof Function){
                                                return await __array_op_rval__241(compiled) 
                                            } else {
                                                return [__array_op_rval__241,compiled]
                                            }
                                        })()
                                    };
                                    try {
                                        if (check_true (((compiled instanceof Array)&& (compiled['0'] instanceof Object)&& compiled['0'].ctype&& await not((compiled['0'].ctype instanceof String || typeof compiled['0'].ctype==='string'))))){
                                            {
                                                await async function(){
                                                    compiled['0']["ctype"]=await subtype(compiled['0'].ctype);
                                                    return compiled['0'];
                                                    
                                                }()
                                            }
                                        };
                                        result=await (async function(){
                                             return await async function(){
                                                if (check_true (compiled.error)) {
                                                    throw new Error((await get_global("indirect_new"))(compiled.error,compiled.message));
                                                    
                                                } else if (check_true ((compiled['0'].ctype&& (await contains_ques_("block",compiled['0'].ctype)|| (compiled['0'].ctype==="assignment")|| (compiled['0'].ctype==="__!NOT_FOUND!__"))))) {
                                                    if (check_true (await (async function(){
                                                        let __array_op_rval__244=compiled['0'].has_lisp_globals;
                                                         if (__array_op_rval__244 instanceof Function){
                                                            return await __array_op_rval__244() 
                                                        } else {
                                                            return [__array_op_rval__244]
                                                        }
                                                    })())){
                                                        {
                                                            await async function(){
                                                                compiled[1]=new AsyncFunction("Environment",("{ "+ compiled['1']+ "}"));
                                                                return compiled;
                                                                
                                                            }();
                                                            return await (async function(){
                                                                let __array_op_rval__246=compiled['1'];
                                                                 if (__array_op_rval__246 instanceof Function){
                                                                    return await __array_op_rval__246(Environment) 
                                                                } else {
                                                                    return [__array_op_rval__246,Environment]
                                                                }
                                                            })()
                                                        }
                                                    } else {
                                                        {
                                                            await async function(){
                                                                compiled[1]=new AsyncFunction(("{"+ compiled['1']+ "}"));
                                                                return compiled;
                                                                
                                                            }();
                                                            return await (async function(){
                                                                let __array_op_rval__248=compiled['1'];
                                                                 if (__array_op_rval__248 instanceof Function){
                                                                    return await __array_op_rval__248() 
                                                                } else {
                                                                    return [__array_op_rval__248]
                                                                }
                                                            })()
                                                        }
                                                    }
                                                } else if (check_true ((compiled['0'].ctype&& (("AsyncFunction"===compiled['0'].ctype)|| ("statement"===compiled['0'].ctype)|| ("objliteral"===compiled['0'].ctype))))) {
                                                    {
                                                        if (check_true (await (async function(){
                                                            let __array_op_rval__249=compiled['0'].has_lisp_globals;
                                                             if (__array_op_rval__249 instanceof Function){
                                                                return await __array_op_rval__249() 
                                                            } else {
                                                                return [__array_op_rval__249]
                                                            }
                                                        })())){
                                                            {
                                                                await async function(){
                                                                    compiled[1]=new AsyncFunction("Environment",("{ return "+ compiled['1']+ "} "));
                                                                    return compiled;
                                                                    
                                                                }();
                                                                return await (async function(){
                                                                    let __array_op_rval__251=compiled['1'];
                                                                     if (__array_op_rval__251 instanceof Function){
                                                                        return await __array_op_rval__251(Environment) 
                                                                    } else {
                                                                        return [__array_op_rval__251,Environment]
                                                                    }
                                                                })()
                                                            }
                                                        } else {
                                                            {
                                                                await async function(){
                                                                    compiled[1]=new AsyncFunction(("{ return "+ compiled['1']+ "}"));
                                                                    return compiled;
                                                                    
                                                                }();
                                                                return await (async function(){
                                                                    let __array_op_rval__253=compiled['1'];
                                                                     if (__array_op_rval__253 instanceof Function){
                                                                        return await __array_op_rval__253() 
                                                                    } else {
                                                                        return [__array_op_rval__253]
                                                                    }
                                                                })()
                                                            }
                                                        }
                                                    }
                                                } else if (check_true ((compiled['0'].ctype&& ("Function"===compiled['0'].ctype)))) {
                                                    {
                                                        if (check_true (await (async function(){
                                                            let __array_op_rval__254=compiled['0'].has_lisp_globals;
                                                             if (__array_op_rval__254 instanceof Function){
                                                                return await __array_op_rval__254() 
                                                            } else {
                                                                return [__array_op_rval__254]
                                                            }
                                                        })())){
                                                            {
                                                                await async function(){
                                                                    compiled[1]=new Function("Environment",("{ return "+ compiled['1']+ "} "));
                                                                    return compiled;
                                                                    
                                                                }();
                                                                return await (async function(){
                                                                    let __array_op_rval__256=compiled['1'];
                                                                     if (__array_op_rval__256 instanceof Function){
                                                                        return await __array_op_rval__256(Environment) 
                                                                    } else {
                                                                        return [__array_op_rval__256,Environment]
                                                                    }
                                                                })()
                                                            }
                                                        } else {
                                                            {
                                                                await async function(){
                                                                    compiled[1]=new Function(("{ return "+ compiled['1']+ "}"));
                                                                    return compiled;
                                                                    
                                                                }();
                                                                return await (async function(){
                                                                    let __array_op_rval__258=compiled['1'];
                                                                     if (__array_op_rval__258 instanceof Function){
                                                                        return await __array_op_rval__258() 
                                                                    } else {
                                                                        return [__array_op_rval__258]
                                                                    }
                                                                })()
                                                            }
                                                        }
                                                    }
                                                } else {
                                                    return compiled['1']
                                                }
                                            } () 
                                        })()
                                    } catch (__exception__242) {
                                        if (__exception__242 instanceof Error) {
                                            let e=__exception__242;
                                            {
                                                {
                                                    if (check_true ((await sub_type(e)==="SyntaxError"))){
                                                        {
                                                            let details={
                                                                error:e.name,message:e.message,expanded_source:await (await get_global("pretty_print"))(await (async function(){
                                                                     return await (await get_global("detokenize"))(precompiled_assembly) 
                                                                })()),compiled:compiled['1']
                                                            };
                                                            ;
                                                            console.log("Syntax Error: ",details);
                                                            await async function(){
                                                                e["details"]=details;
                                                                return e;
                                                                
                                                            }()
                                                        }
                                                    };
                                                    if (check_true ((opts.log_errors|| (Environment.context.scope.__VERBOSITY__>4)))){
                                                        {
                                                            if (check_true (e.details)){
                                                                await env_log("caught error: ",e.details)
                                                            } else {
                                                                await env_log("caught error: ",e.name,e.message,e)
                                                            }
                                                        }
                                                    };
                                                    if (check_true ((false&& (await sub_type(e)==="SyntaxError")&& (opts.log_errors|| (Environment.context.scope.__VERBOSITY__>4))))){
                                                        await console.log(compiled['1'])
                                                    };
                                                    if (check_true (opts.error_report)){
                                                        {
                                                            await (async function(){
                                                                let __array_op_rval__260=opts.error_report;
                                                                 if (__array_op_rval__260 instanceof Function){
                                                                    return await __array_op_rval__260(await (async function(){
                                                                        if (check_true (e.details)){
                                                                            return e.details
                                                                        } else {
                                                                            return {
                                                                                error:e.name,message:e.message,form:null,parent_forms:null,invalid:true,text:e.stack
                                                                            }
                                                                        }
                                                                    })()) 
                                                                } else {
                                                                    return [__array_op_rval__260,await (async function(){
                                                                        if (check_true (e.details)){
                                                                            return e.details
                                                                        } else {
                                                                            return {
                                                                                error:e.name,message:e.message,form:null,parent_forms:null,invalid:true,text:e.stack
                                                                            }
                                                                        }
                                                                    })()]
                                                                }
                                                            })()
                                                        }
                                                    };
                                                    result=e;
                                                    if (check_true ((await not(opts.catch_errors)|| (ctx&& ctx.in_try)))){
                                                        {
                                                            throw result;
                                                            
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    };
                                    return result
                                }
                            }
                        } ()
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["evaluate_local"]=evaluate_local;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["evaluate_local"]={
                            core_lang:true
                        };
                        return Environment.definitions;
                        
                    }()];
                    let evaluate=async function(expression,ctx,opts) {
                        return await async function(){
                            if (check_true ((namespace===active_namespace))) {
                                return await evaluate_local(expression,ctx,opts)
                            } else if (check_true ((namespace==="core"))) {
                                return await (async function() {
                                    {
                                         let __call_target__=children[active_namespace], __call_method__="evaluate";
                                        return await __call_target__[__call_method__].call(__call_target__,expression,ctx,opts)
                                    } 
                                })()
                            }
                        } ()
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["evaluate"]=evaluate;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["evaluate"]={
                            core_lang:true
                        };
                        return Environment.definitions;
                        
                    }()];
                    let eval_struct=async function(lisp_struct,ctx,opts) {
                        let rval;
                        rval=null;
                        if (check_true (lisp_struct instanceof Function)){
                            rval=await (async function(){
                                let __array_op_rval__265=lisp_struct;
                                 if (__array_op_rval__265 instanceof Function){
                                    return await __array_op_rval__265() 
                                } else {
                                    return [__array_op_rval__265]
                                }
                            })()
                        } else {
                            rval=await (async function(){
                                 return await evaluate(lisp_struct,ctx,await add({
                                    json_in:true
                                },(opts|| new Object()))) 
                            })()
                        };
                        return rval
                    };
                    ;
                    await async function(){
                        Environment.global_ctx.scope["eval_struct"]=eval_struct;
                        return Environment.global_ctx.scope;
                        
                    }();
                    [await async function(){
                        Environment.definitions["eval_struct"]={
                            core_lang:true
                        };
                        return Environment.definitions;
                        
                    }()];
                    let built_ins=["MAX_SAFE_INTEGER","LispSyntaxError","sub_type","__VERBOSITY__","int","float","values","pairs","keys","take","prepend","first","last","length","conj","reverse","map","bind","to_object","to_array","slice","rest","second","third","chop","chomp","not","push","pop","list","flatten","jslambda","join","lowercase","uppercase","log","split","split_by","is_object?","is_array?","is_number?","is_function?","is_set?","is_element?","is_string?","is_nil?","is_regex?","is_date?","ends_with?","starts_with?","blank?","contains?","make_set","eval_exp","indirect_new","get_import_entry","range","add","merge_objects","index_of","resolve_path","delete_prop","load_pends","min_value","max_value","interlace","trim","assert","unquotify","or_args","pending_ns_loads","special_operators","defclog","NOT_FOUND","check_external_env_default","built_ins","reader"];
                    ;
                    await async function(){
                        Environment.global_ctx.scope["built_ins"]=built_ins;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let set_compiler=async function(compiler_function) {
                        let new_ops;
                        new_ops=await (async function(){
                            let __array_op_rval__269=compiler_function;
                             if (__array_op_rval__269 instanceof Function){
                                return await __array_op_rval__269([],{
                                    special_operators:true,env:Environment
                                }) 
                            } else {
                                return [__array_op_rval__269,[],{
                                    special_operators:true,env:Environment
                                }]
                            }
                        })();
                        if (check_true (await is_set_ques_(new_ops))){
                            {
                                compiler_operators=new_ops;
                                compiler=compiler_function;
                                await async function(){
                                    Environment.global_ctx.scope["compiler"]=compiler;
                                    return Environment.global_ctx.scope;
                                    
                                }();
                                await (await get_global("register_feature"))("compiler")
                            }
                        } else {
                            {
                                await console.error("Invalid compiler function: invalid operators returned. Not installing.");
                                throw new EvalError("Invalid compiler function");
                                
                            }
                        };
                        return compiler
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
                    await async function(){
                        Environment["get_global"]=get_global;
                        Environment["set_global"]=set_global;
                        Environment["symbol_definition"]=symbol_definition;
                        Environment["namespace"]=namespace;
                        return Environment;
                        
                    }();
                    let children=(opts.children|| new Object());
                    ;
                    let children_declarations=(opts.children_declarations|| new Object());
                    ;
                    if (check_true ((namespace==="core"))){
                        {
                            if (check_true (await not(Environment.global_ctx.scope["*env_config*"]))){
                                {
                                    await async function(){
                                        Environment.global_ctx.scope["*env_config*"]={
                                            export:{
                                                save_path:"js/juno.js",default_namespace:"core",include_source:false
                                            },features:[],build:DLISP_ENV_VERSION,imports:new Object()
                                        };
                                        return Environment.global_ctx.scope;
                                        
                                    }()
                                }
                            };
                            let current_namespace=function() {
                                return active_namespace
                            };
                            ;
                            let create_namespace=async function(name,options,defer_initialization) {
                                return await async function(){
                                    if (check_true (await not((name instanceof String || typeof name==='string')))) {
                                        throw new TypeError("namespace name must be a string");
                                        
                                    } else if (check_true (children[name])) {
                                        throw new EvalError("namespace already exists");
                                        
                                    } else {
                                        {
                                            let child_env;
                                            options=(options|| new Object());
                                            child_env=await (async function(){
                                                 return await dlisp_env({
                                                    parent_environment:Environment,namespace:name,contained:options.contained,defer_initialization:defer_initialization
                                                }) 
                                            })();
                                            if (check_true (child_env.evaluate)){
                                                {
                                                    await child_env["set_compiler"].call(child_env,compiler);
                                                    await async function(){
                                                        children[name]=child_env;
                                                        return children;
                                                        
                                                    }();
                                                    await async function(){
                                                        children_declarations[name]=new Object();
                                                        return children_declarations;
                                                        
                                                    }();
                                                    await child_env["evaluate_local"].call(child_env,"(for_each (sym built_ins) (delete_prop Environment.context.scope sym))");
                                                    await child_env["evaluate_local"].call(child_env,"(for_each (sym built_ins) (delete_prop Environment.definitions sym))");
                                                    if (check_true (options.contained)){
                                                        await async function(){
                                                            let __target_obj__277=children_declarations[name];
                                                            __target_obj__277["contained"]=true;
                                                            return __target_obj__277;
                                                            
                                                        }()
                                                    };
                                                    await async function(){
                                                        let __target_obj__278=children_declarations[name];
                                                        __target_obj__278["serialize_with_image"]=await (async function(){
                                                            if (check_true ((false===options.serialize_with_image))){
                                                                return false
                                                            } else {
                                                                return true
                                                            }
                                                        })();
                                                        return __target_obj__278;
                                                        
                                                    }();
                                                    return name
                                                }
                                            } else {
                                                {
                                                    await console.error("ENV: couldn't create the child environment. Received: ",child_env);
                                                    throw new EvalError(("unable to create namespace "+ name));
                                                    
                                                }
                                            }
                                        }
                                    }
                                } ()
                            };
                            ;
                            let set_namespace=async function(name) {
                                return await async function(){
                                    if (check_true (await not((name instanceof String || typeof name==='string')))) {
                                        throw new TypeError("namespace name must be a string");
                                        
                                    } else if (check_true ((await not(("core"===name))&& (null==children[name])))) {
                                        throw new EvalError(("namespace "+ name+ " doesn't exist"));
                                        
                                    } else {
                                        {
                                            if (check_true ((name==="core"))){
                                                {
                                                    active_namespace="core"
                                                }
                                            } else {
                                                {
                                                    active_namespace=name
                                                }
                                            };
                                            return name
                                        }
                                    }
                                } ()
                            };
                            ;
                            let delete_namespace=async function(name) {
                                return await async function(){
                                    if (check_true (await not((name instanceof String || typeof name==='string')))) {
                                        throw new TypeError("namespace name must be a string");
                                        
                                    } else if (check_true (("core"===name))) {
                                        throw new EvalError("core namespace cannot be removed");
                                        
                                    } else if (check_true ((null==children[name]))) {
                                        throw new EvalError(("namespace "+ name+ "doesn't exist"));
                                        
                                    } else if (check_true ((name===await current_namespace()))) {
                                        throw new EvalError("namespace is the current namespace");
                                        
                                    } else {
                                        {
                                            await (await get_global("remove_prop"))(children,name);
                                            await (async function() {
                                                let __for_body__281=async function(k) {
                                                    if (check_true (await starts_with_ques_(k,name))){
                                                        {
                                                            return await (await get_global("remove_prop"))(Environment.global_ctx._star_env_config_star_.imports,k)
                                                        }
                                                    }
                                                };
                                                let __array__282=[],__elements__280=(await resolve_path(["global_ctx","scope","*env_config*","imports"],Environment)|| []);
                                                let __BREAK__FLAG__=false;
                                                for(let __iter__279 in __elements__280) {
                                                    __array__282.push(await __for_body__281(__elements__280[__iter__279]));
                                                    if(__BREAK__FLAG__) {
                                                         __array__282.pop();
                                                        break;
                                                        
                                                    }
                                                }return __array__282;
                                                 
                                            })();
                                            return name
                                        }
                                    }
                                } ()
                            };
                            ;
                            await async function(){
                                Environment.global_ctx.scope["create_namespace"]=create_namespace;
                                Environment.global_ctx.scope["set_namespace"]=set_namespace;
                                Environment.global_ctx.scope["delete_namespace"]=delete_namespace;
                                Environment.global_ctx.scope["namespaces"]=function() {
                                    return  add( keys(children),"core")
                                };
                                Environment.global_ctx.scope["current_namespace"]=current_namespace;
                                return Environment.global_ctx.scope;
                                
                            }()
                        }
                    };
                    let get_namespace_handle=function(name) {
                        return   (function(){
                            if (check_true ((namespace===name))) {
                                return Environment
                            } else if (check_true ((namespace==="core"))) {
                                if (check_true (((name instanceof String || typeof name==='string')&& children[name]))){
                                    return children[name]
                                }
                            } else if (check_true (parent_environment)) {
                                return  parent_environment["get_namespace_handle"].call(parent_environment,name)
                            } else {
                                throw new Error("invalid namespace handle requested");
                                
                            }
                        } )()
                    };
                    ;
                    let included_globals=null;
                    ;
                    let imps=null;
                    ;
                    let rehydrated_children=false;
                    ;
                    if (check_true ((included_globals&& (namespace==="core")))){
                        {
                            try {
                                included_globals=await (async function(){
                                    let __array_op_rval__285=included_globals;
                                     if (__array_op_rval__285 instanceof Function){
                                        return await __array_op_rval__285() 
                                    } else {
                                        return [__array_op_rval__285]
                                    }
                                })()
                            } catch (__exception__284) {
                                if (__exception__284 instanceof Error) {
                                    let e=__exception__284;
                                    {
                                        await console.error("ERROR: ",e)
                                    }
                                }
                            };
                            if (check_true (await resolve_path(["symbols","compiler"],included_globals))){
                                {
                                    await async function(){
                                        Environment.global_ctx.scope["compiler"]=await resolve_path(["symbols","compiler"],included_globals);
                                        return Environment.global_ctx.scope;
                                        
                                    }();
                                    compiler=Environment.global_ctx.scope.compiler
                                }
                            };
                            if (check_true ((included_globals["config"] instanceof Object))){
                                {
                                    await async function(){
                                        Environment.global_ctx.scope["*env_config*"]=included_globals.config;
                                        return Environment.global_ctx.scope;
                                        
                                    }()
                                }
                            };
                            if (check_true ((included_globals["imports"] instanceof Object))){
                                {
                                    imps=included_globals["imports"];
                                    if (check_true (imps)){
                                        {
                                            await (async function() {
                                                let __for_body__290=async function(imp_source) {
                                                    return await async function(){
                                                        if (check_true ((imp_source.namespace===namespace))) {
                                                            {
                                                                return await async function(){
                                                                    Environment.global_ctx.scope[imp_source.symbol]=imp_source.initializer;
                                                                    return Environment.global_ctx.scope;
                                                                    
                                                                }()
                                                            }
                                                        }
                                                    } ()
                                                };
                                                let __array__291=[],__elements__289=await values(imps);
                                                let __BREAK__FLAG__=false;
                                                for(let __iter__288 in __elements__289) {
                                                    __array__291.push(await __for_body__290(__elements__289[__iter__288]));
                                                    if(__BREAK__FLAG__) {
                                                         __array__291.pop();
                                                        break;
                                                        
                                                    }
                                                }return __array__291;
                                                 
                                            })()
                                        }
                                    }
                                }
                            };
                            if (check_true ((included_globals["symbols"] instanceof Object))){
                                {
                                    await (async function() {
                                        let __for_body__295=async function(symset) {
                                            if (check_true ((null==Environment.global_ctx.scope[symset['0']]))){
                                                {
                                                    return await async function(){
                                                        Environment.global_ctx.scope[symset['0']]=symset['1'];
                                                        return Environment.global_ctx.scope;
                                                        
                                                    }()
                                                }
                                            }
                                        };
                                        let __array__296=[],__elements__294=await pairs(included_globals.symbols);
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__293 in __elements__294) {
                                            __array__296.push(await __for_body__295(__elements__294[__iter__293]));
                                            if(__BREAK__FLAG__) {
                                                 __array__296.pop();
                                                break;
                                                
                                            }
                                        }return __array__296;
                                         
                                    })()
                                }
                            };
                            if (check_true ((included_globals["definitions"] instanceof Object))){
                                {
                                    await (async function() {
                                        let __for_body__300=async function(symset) {
                                            if (check_true ((null==Environment.definitions[symset['0']]))){
                                                {
                                                    return await async function(){
                                                        Environment.definitions[symset['0']]=symset['1'];
                                                        return Environment.definitions;
                                                        
                                                    }()
                                                }
                                            }
                                        };
                                        let __array__301=[],__elements__299=await pairs(included_globals.definitions);
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__298 in __elements__299) {
                                            __array__301.push(await __for_body__300(__elements__299[__iter__298]));
                                            if(__BREAK__FLAG__) {
                                                 __array__301.pop();
                                                break;
                                                
                                            }
                                        }return __array__301;
                                         
                                    })()
                                }
                            };
                            if (check_true ((included_globals["declarations"] instanceof Object))){
                                {
                                    await (async function() {
                                        let __for_body__305=async function(symset) {
                                            if (check_true ((null==Environment.declarations[symset['0']]))){
                                                {
                                                    return await async function(){
                                                        Environment.declarations[symset['0']]=await (async function(){
                                                             return "=:symset.1" 
                                                        })();
                                                        return Environment.declarations;
                                                        
                                                    }()
                                                }
                                            }
                                        };
                                        let __array__306=[],__elements__304=await pairs(included_globals.declarations);
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__303 in __elements__304) {
                                            __array__306.push(await __for_body__305(__elements__304[__iter__303]));
                                            if(__BREAK__FLAG__) {
                                                 __array__306.pop();
                                                break;
                                                
                                            }
                                        }return __array__306;
                                         
                                    })()
                                }
                            };
                            if (check_true (Environment.global_ctx.scope["compiler"])){
                                {
                                    await set_compiler(Environment.global_ctx.scope["compiler"])
                                }
                            };
                            if (check_true ((included_globals["children"] instanceof Object))){
                                {
                                    rehydrated_children=true;
                                    await (async function() {
                                        let __for_body__310=async function(childset) {
                                            return await (await get_global("create_namespace"))(childset['0'],await (async function(){
                                                if (check_true (included_globals.children_declarations[childset['0']])){
                                                    return included_globals.children_declarations[childset['0']]
                                                } else {
                                                    return new Object()
                                                }
                                            })(),true)
                                        };
                                        let __array__311=[],__elements__309=await pairs(included_globals.children);
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__308 in __elements__309) {
                                            __array__311.push(await __for_body__310(__elements__309[__iter__308]));
                                            if(__BREAK__FLAG__) {
                                                 __array__311.pop();
                                                break;
                                                
                                            }
                                        }return __array__311;
                                         
                                    })()
                                }
                            }
                        }
                    };
                    let clone_to_new=async function(options) {
                        let new_env;
                        let my_children;
                        let my_children_declarations;
                        new_env=null;
                        my_children=null;
                        my_children_declarations=null;
                        await env_log(namespace,"cloning: # children: ",await length(children));
                        new_env=await (async function(){
                             return await dlisp_env({
                                env:await (async function(){
                                     return await clone(Environment) 
                                })(),children:await (async function(){
                                     return await clone(children) 
                                })(),children_declarations:await (async function(){
                                     return await clone(children_declarations) 
                                })()
                            }) 
                        })();
                        await env_log(namespace,"constructed: ",await new_env["id"]());
                        return new_env
                    };
                    ;
                    let export_symbol_set=async function(options) {
                        let __collector;
                        let __result;
                        let __action;
                        __collector=[];
                        __result=null;
                        __action=async function(symset) {
                            return await async function(){
                                if (check_true ((options&& options.no_compiler&& (symset['0']==="compiler")))) {
                                    return null
                                } else if (check_true (await starts_with_ques_("$",symset['0']))) {
                                    return null
                                } else if (check_true ((await resolve_path(await (async function(){
                                    let __array_op_rval__312=symset['0'];
                                     if (__array_op_rval__312 instanceof Function){
                                        return await __array_op_rval__312("serialize_with_image") 
                                    } else {
                                        return [__array_op_rval__312,"serialize_with_image"]
                                    }
                                })(),Environment.definitions)===false))) {
                                    return null
                                } else if (check_true ((options&& options.do_not_include&& await contains_ques_(symset['0'],options.do_not_include)))) {
                                    return null
                                } else if (check_true ((symset['0']==="*env_skeleton*"))) {
                                    return await (async function(){
                                        let __array_op_rval__313=symset['0'];
                                         if (__array_op_rval__313 instanceof Function){
                                            return await __array_op_rval__313(await (async function(){
                                                 return ["=:quotel",Environment.global_ctx.scope["*env_skeleton*"]] 
                                            })()) 
                                        } else {
                                            return [__array_op_rval__313,await (async function(){
                                                 return ["=:quotel",Environment.global_ctx.scope["*env_skeleton*"]] 
                                            })()]
                                        }
                                    })()
                                } else if (check_true (await resolve_path(await (async function(){
                                    let __array_op_rval__314=symset['0'];
                                     if (__array_op_rval__314 instanceof Function){
                                        return await __array_op_rval__314("initializer") 
                                    } else {
                                        return [__array_op_rval__314,"initializer"]
                                    }
                                })(),Environment.definitions))) {
                                    {
                                        return await (async function(){
                                            let __array_op_rval__315=symset['0'];
                                             if (__array_op_rval__315 instanceof Function){
                                                return await __array_op_rval__315(await (async function(){
                                                     return ["=:quotel","placeholder"] 
                                                })()) 
                                            } else {
                                                return [__array_op_rval__315,await (async function(){
                                                     return ["=:quotel","placeholder"] 
                                                })()]
                                            }
                                        })()
                                    }
                                } else if (check_true ((null===symset['1']))) {
                                    return await (async function(){
                                        let __array_op_rval__316=symset['0'];
                                         if (__array_op_rval__316 instanceof Function){
                                            return await __array_op_rval__316(await (async function(){
                                                 return "=:nil" 
                                            })()) 
                                        } else {
                                            return [__array_op_rval__316,await (async function(){
                                                 return "=:nil" 
                                            })()]
                                        }
                                    })()
                                } else if (check_true ((undefined===symset['1']))) {
                                    return await (async function(){
                                        let __array_op_rval__317=symset['0'];
                                         if (__array_op_rval__317 instanceof Function){
                                            return await __array_op_rval__317(await (async function(){
                                                 return "=:undefined" 
                                            })()) 
                                        } else {
                                            return [__array_op_rval__317,await (async function(){
                                                 return "=:undefined" 
                                            })()]
                                        }
                                    })()
                                } else if (check_true ((symset['1'] instanceof String || typeof symset['1']==='string'))) {
                                    {
                                        return await (async function(){
                                            let __array_op_rval__318=symset['0'];
                                             if (__array_op_rval__318 instanceof Function){
                                                return await __array_op_rval__318(await (async function(){
                                                     return await (await get_global("env_encode_string"))(symset['1']) 
                                                })()) 
                                            } else {
                                                return [__array_op_rval__318,await (async function(){
                                                     return await (await get_global("env_encode_string"))(symset['1']) 
                                                })()]
                                            }
                                        })()
                                    }
                                } else {
                                    return await (async function(){
                                        let __array_op_rval__319=symset['0'];
                                         if (__array_op_rval__319 instanceof Function){
                                            return await __array_op_rval__319(symset['1']) 
                                        } else {
                                            return [__array_op_rval__319,symset['1']]
                                        }
                                    })()
                                }
                            } ()
                        };
                        ;
                        await (async function() {
                            let __for_body__322=async function(__item) {
                                __result=await __action(__item);
                                if (check_true (__result)){
                                    return (__collector).push(__result)
                                }
                            };
                            let __array__323=[],__elements__321=await pairs(await (async function(){
                                 return await clone(Environment.global_ctx.scope) 
                            })());
                            let __BREAK__FLAG__=false;
                            for(let __iter__320 in __elements__321) {
                                __array__323.push(await __for_body__322(__elements__321[__iter__320]));
                                if(__BREAK__FLAG__) {
                                     __array__323.pop();
                                    break;
                                    
                                }
                            }return __array__323;
                             
                        })();
                        return __collector
                    };
                    ;
                    let save_env=async function(options) {
                        let new_env;
                        let my_children;
                        let env_constructor;
                        let dcomps;
                        let version_tag;
                        let build_time;
                        let build_headers;
                        let child_env;
                        let want_buffer;
                        let comp_buffer;
                        let sorted_dependencies;
                        let child_export_order;
                        let preserve_imports;
                        let include_source;
                        let exports;
                        let src;
                        let target_insertion_path;
                        let output_path;
                        new_env=null;
                        my_children=null;
                        env_constructor=null;
                        dcomps=await (async function(){
                             return await (await get_global("date_components"))(new Date()) 
                        })();
                        options=(options|| new Object());
                        version_tag=await (async function(){
                            if (check_true (await not(await blank_ques_(opts.version_tag)))){
                                return opts.version_tag
                            } else {
                                return (await (async function(){
                                    let __array_op_rval__324=dcomps.year;
                                     if (__array_op_rval__324 instanceof Function){
                                        return await __array_op_rval__324(dcomps.month,dcomps.day,dcomps.hour,dcomps.minute) 
                                    } else {
                                        return [__array_op_rval__324,dcomps.month,dcomps.day,dcomps.hour,dcomps.minute]
                                    }
                                })()).join(".")
                            }
                        })();
                        build_time=await (async function(){
                             return await (await get_global("formatted_date"))(new Date()) 
                        })();
                        build_headers=[];
                        child_env=null;
                        want_buffer=(options.want_buffer|| false);
                        comp_buffer=null;
                        sorted_dependencies=await (async function(){
                             return await (await get_global("sort_dependencies"))() 
                        })();
                        child_export_order=null;
                        preserve_imports=await (async function(){
                            if (check_true ((options&& (options.preserve_imports===false)))){
                                return false
                            } else {
                                return true
                            }
                        })();
                        include_source=false;
                        exports=[];
                        src=await (async function(){
                            if (check_true (await Environment["get_global"].call(Environment,"*env_skeleton*",null))){
                                return await clone(await Environment["get_global"].call(Environment,"*env_skeleton*"))
                            } else {
                                return await (await get_global("reader"))(await (async function(){
                                     return await (await get_global("read_text_file"))("./src/environment.lisp") 
                                })())
                            }
                        })();
                        target_insertion_path=null;
                        output_path=null;
                        if (check_true (Environment.global_ctx.scope["*env_skeleton*"])){
                            {
                                await (await get_global("register_feature"))("*env_skeleton*")
                            }
                        };
                        target_insertion_path=await first(await (async function(){
                             return await (await get_global("findpaths"))(await (async function(){
                                 return "=:included_globals" 
                            })(),src) 
                        })());
                        if (check_true (await not((target_insertion_path instanceof Array)))){
                            throw new EvalError("Unable to find the first included_globals symbol");
                            
                        };
                        target_insertion_path=await conj(await chop(target_insertion_path),[2]);
                        if (check_true (options.include_source)){
                            {
                                include_source=true
                            }
                        };
                        await env_log(namespace,"cloning: # children: ",await length(children));
                        await env_log(namespace,"preserve_imports: ",preserve_imports);
                        exports=await export_symbol_set(await (async function(){
                            if (check_true (options.do_not_include)){
                                return {
                                    do_not_include:options.do_not_include
                                }
                            }
                        })());
                        child_export_order=await (async function(){
                            let __collector;
                            let __result;
                            let __action;
                            __collector=[];
                            __result=null;
                            __action=async function(cname) {
                                if (check_true (await not((cname==="core")))){
                                    {
                                        return await (async function(){
                                            let __array_op_rval__325=cname;
                                             if (__array_op_rval__325 instanceof Function){
                                                return await __array_op_rval__325(children[cname]) 
                                            } else {
                                                return [__array_op_rval__325,children[cname]]
                                            }
                                        })()
                                    }
                                }
                            };
                            ;
                            await (async function() {
                                let __for_body__328=async function(__item) {
                                    __result=await __action(__item);
                                    if (check_true (__result)){
                                        return (__collector).push(__result)
                                    }
                                };
                                let __array__329=[],__elements__327=sorted_dependencies.namespaces;
                                let __BREAK__FLAG__=false;
                                for(let __iter__326 in __elements__327) {
                                    __array__329.push(await __for_body__328(__elements__327[__iter__326]));
                                    if(__BREAK__FLAG__) {
                                         __array__329.pop();
                                        break;
                                        
                                    }
                                }return __array__329;
                                 
                            })();
                            return __collector
                        })();
                        await console.log("save_env: child_export_order: ",await (async function(){
                             return await (await get_global("each"))(child_export_order,0) 
                        })());
                        my_children=await to_object(await (async function(){
                            let __collector;
                            let __result;
                            let __action;
                            __collector=[];
                            __result=null;
                            __action=async function(child) {
                                if (check_true (await resolve_path(await (async function(){
                                    let __array_op_rval__330=child['0'];
                                     if (__array_op_rval__330 instanceof Function){
                                        return await __array_op_rval__330("serialize_with_image") 
                                    } else {
                                        return [__array_op_rval__330,"serialize_with_image"]
                                    }
                                })(),children_declarations))){
                                    {
                                        child_env=await child['1']["compile"].call(child['1'],await child['1']["export_symbol_set"].call(child['1'],await add(new Object(),{
                                            no_compiler:true
                                        })),{
                                            throw_on_error:true
                                        });
                                        return await (async function(){
                                            let __array_op_rval__331=child['0'];
                                             if (__array_op_rval__331 instanceof Function){
                                                return await __array_op_rval__331(await (async function(){
                                                     return [["=:quotel",child['1'].definitions],await (async function(){
                                                         return ["=:quotel",await (async function(){
                                                             return ["=:javascript",child_env] 
                                                        })()] 
                                                    })()] 
                                                })()) 
                                            } else {
                                                return [__array_op_rval__331,await (async function(){
                                                     return [["=:quotel",child['1'].definitions],await (async function(){
                                                         return ["=:quotel",await (async function(){
                                                             return ["=:javascript",child_env] 
                                                        })()] 
                                                    })()] 
                                                })()]
                                            }
                                        })()
                                    }
                                }
                            };
                            ;
                            await (async function() {
                                let __for_body__334=async function(__item) {
                                    __result=await __action(__item);
                                    if (check_true (__result)){
                                        return (__collector).push(__result)
                                    }
                                };
                                let __array__335=[],__elements__333=child_export_order;
                                let __BREAK__FLAG__=false;
                                for(let __iter__332 in __elements__333) {
                                    __array__335.push(await __for_body__334(__elements__333[__iter__332]));
                                    if(__BREAK__FLAG__) {
                                         __array__335.pop();
                                        break;
                                        
                                    }
                                }return __array__335;
                                 
                            })();
                            return __collector
                        })());
                        await (await get_global("set_path"))(target_insertion_path,src,await (async function(){
                             return ["=:fn",[],await to_object(await (async function(){
                                 return [["definitions",await (async function(){
                                     return ["=:quote",await (async function(){
                                        if (check_true (options.do_not_include)){
                                            return await to_object(await (async function(){
                                                let __collector;
                                                let __result;
                                                let __action;
                                                __collector=[];
                                                __result=null;
                                                __action=async function(defset) {
                                                    if (check_true (await not(await contains_ques_(defset['0'],options.do_not_include)))){
                                                        return await (async function(){
                                                            let __array_op_rval__336=defset['0'];
                                                             if (__array_op_rval__336 instanceof Function){
                                                                return await __array_op_rval__336(defset['1']) 
                                                            } else {
                                                                return [__array_op_rval__336,defset['1']]
                                                            }
                                                        })()
                                                    }
                                                };
                                                ;
                                                await (async function() {
                                                    let __for_body__339=async function(__item) {
                                                        __result=await __action(__item);
                                                        if (check_true (__result)){
                                                            return (__collector).push(__result)
                                                        }
                                                    };
                                                    let __array__340=[],__elements__338=await pairs(Environment.definitions);
                                                    let __BREAK__FLAG__=false;
                                                    for(let __iter__337 in __elements__338) {
                                                        __array__340.push(await __for_body__339(__elements__338[__iter__337]));
                                                        if(__BREAK__FLAG__) {
                                                             __array__340.pop();
                                                            break;
                                                            
                                                        }
                                                    }return __array__340;
                                                     
                                                })();
                                                return __collector
                                            })())
                                        } else {
                                            return await clone(Environment.definitions)
                                        }
                                    })()] 
                                })()],["declarations",await (async function(){
                                     return await clone(Environment.declarations) 
                                })()],["config",await (async function(){
                                    let exp_conf;
                                    exp_conf=await (async function(){
                                         return await clone(Environment.global_ctx.scope["*env_config*"]) 
                                    })();
                                    if (check_true (await not(preserve_imports))){
                                        {
                                            await async function(){
                                                exp_conf["imports"]=new Object();
                                                return exp_conf;
                                                
                                            }()
                                        }
                                    };
                                    if (check_true (options.features)){
                                        {
                                            await async function(){
                                                exp_conf["features"]=options.features;
                                                return exp_conf;
                                                
                                            }()
                                        }
                                    };
                                    return exp_conf
                                })()],["imports",await (async function(){
                                    if (check_true (preserve_imports)){
                                        return await to_object(await (async function() {
                                            let __for_body__345=async function(imp_source) {
                                                return await (async function(){
                                                    let __array_op_rval__347=imp_source.symbol;
                                                     if (__array_op_rval__347 instanceof Function){
                                                        return await __array_op_rval__347({
                                                            initializer:await (async function(){
                                                                 return ["=:javascript","new function () { return ",imp_source.symbol," }"] 
                                                            })(),symbol:imp_source.symbol,namespace:imp_source.namespace
                                                        }) 
                                                    } else {
                                                        return [__array_op_rval__347,{
                                                            initializer:await (async function(){
                                                                 return ["=:javascript","new function () { return ",imp_source.symbol," }"] 
                                                            })(),symbol:imp_source.symbol,namespace:imp_source.namespace
                                                        }]
                                                    }
                                                })()
                                            };
                                            let __array__346=[],__elements__344=await values((await resolve_path(["*env_config*","imports"],Environment.global_ctx.scope)|| new Object()));
                                            let __BREAK__FLAG__=false;
                                            for(let __iter__343 in __elements__344) {
                                                __array__346.push(await __for_body__345(__elements__344[__iter__343]));
                                                if(__BREAK__FLAG__) {
                                                     __array__346.pop();
                                                    break;
                                                    
                                                }
                                            }return __array__346;
                                             
                                        })())
                                    } else {
                                        return new Object()
                                    }
                                })()],["symbols",await (async function(){
                                     return ["=:javascript",await compile(await to_object(exports),{
                                        throw_on_error:true
                                    })] 
                                })()],["children_declarations",await (async function(){
                                     return ["=:fn",[],await clone(children_declarations)] 
                                })()],["child_load_order",await (async function(){
                                     return await (await get_global("each"))(child_export_order,0) 
                                })()],["children",my_children]] 
                            })())] 
                        })());
                        output_path=await (async function(){
                            if (check_true (options.want_buffer)){
                                return null
                            } else {
                                return (options.save_as|| await resolve_path(["*env_config*","export","save_path"],Environment.global_ctx.scope))
                            }
                        })();
                        if (check_true (output_path instanceof Function)){
                            output_path=await (async function(){
                                let __array_op_rval__348=output_path;
                                 if (__array_op_rval__348 instanceof Function){
                                    return await __array_op_rval__348() 
                                } else {
                                    return [__array_op_rval__348]
                                }
                            })()
                        };
                        if (check_true ((await not((output_path instanceof String || typeof output_path==='string'))&& output_path))){
                            throw new EvalError("invalid name for target for saving the environment.  Must be a string or function");
                            
                        };
                        return await async function(){
                            if (check_true ((want_buffer|| (output_path&& await ends_with_ques_(".js",output_path))))) {
                                {
                                    (build_headers).push(("// Build Time: "+ build_time));
                                    (build_headers).push(("// Version: "+ version_tag));
                                    (build_headers).push(("export const DLISP_ENV_VERSION='"+ version_tag+ "';"));
                                    await env_log("saving to: ",output_path);
                                    return await (await get_global("compile_buffer"))(src,"init_dlisp",{
                                        namespace:namespace,toplevel:true,include_boilerplate:false,verbose:false,bundle:true,want_buffer:want_buffer,imports:await (async function(){
                                            if (check_true (preserve_imports)){
                                                return await resolve_path(["*env_config*","imports"],Environment.global_ctx.scope)
                                            }
                                        })(),js_headers:await (async function(){
                                             return [await (await get_global("show"))(check_true),await (async function(){
                                                 return await (await get_global("show"))(get_next_environment_id) 
                                            })(),await (async function(){
                                                 return await (await get_global("show"))(get_outside_global) 
                                            })(),await (async function(){
                                                 return await (await get_global("show"))(subtype) 
                                            })(),await (async function(){
                                                 return await (await get_global("show"))(lisp_writer) 
                                            })(),await (async function(){
                                                 return await (await get_global("show"))(clone) 
                                            })(),await (async function(){
                                                 return await (await get_global("show"))(LispSyntaxError) 
                                            })()] 
                                        })(),bundle_options:{
                                            default_namespace:await resolve_path(["*env_config*","export","default_namespace"],Environment.global_ctx.scope)
                                        },output_file:output_path,include_source:(options.include_source|| await resolve_path(["*env_config*","export","include_source"],Environment.global_ctx.scope)),build_headers:build_headers
                                    })
                                }
                            } else if (check_true ((output_path&& await ends_with_ques_(".lisp",output_path)))) {
                                return await (await get_global("write_text_file"))(output_path,await JSON.stringify(src,null,4))
                            } else {
                                return src
                            }
                        } ()
                    };
                    ;
                    let reader=async function(text,opts) {    return await async function(){
        if (check_true ((undefined==text))) {
            throw new EvalError(("reader: received undefined, text must be a string."));
            
        } else if (check_true (await (await Environment.get_global("not"))((text instanceof String || typeof text==='string')))) {
            throw new EvalError(("reader: received "+ await (await Environment.get_global("sub_type"))(text)+ ": text must be a string."));
            
        } else {
            {
                let output_structure;
                let idx;
                let error_collector;
                let symbol_collector;
                let throw_on_error;
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
                let symbol_start;
                let last_final_column_num;
                let symbol_receiver;
                let add_symbol;
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
                error_collector=[];
                symbol_collector=new Object();
                throw_on_error=await (await Environment.get_global("not"))((opts && opts["suppress_throw_on_error"]));
                line_number=0;
                column_number=0;
                source_name=await (async function(){
                    if (check_true ((opts && opts["source_name"]))){
                        return (opts && opts["source_name"])
                    } else {
                        return "anonymous"
                    }
                })();
                opts=(opts|| new Object());
                len=(await (await Environment.get_global("length"))(text)- 1);
                debugmode=await (async function(){
                     return await async function(){
                        if (check_true ((opts && opts["verbose"]))) {
                            return true
                        } else if (check_true (((opts && opts["verbose"])===false))) {
                            return false
                        } else if (check_true (((await Environment.get_global("__VERBOSITY__"))>6))) {
                            return true
                        } else {
                            return false
                        }
                    } () 
                })();
                in_buffer=(text).split("");
                in_code=0;
                in_quotes=1;
                in_long_text=2;
                in_comment=3;
                in_single_quote=4;
                reading_object=false;
                mode=in_code;
                symbol_start=null;
                last_final_column_num=0;
                symbol_receiver=await (async function(){
                    if (check_true ((opts && opts["symbol_receiver"]) instanceof Function)){
                        return (opts && opts["symbol_receiver"])
                    }
                })();
                add_symbol=async function(symbol) {
                    if (check_true (await (await Environment.get_global("not"))(await (await Environment.get_global("ends_with?"))(":",symbol)))){
                        {
                            {
                                let ccol;
                                let cline;
                                let real_sym;
                                ccol=await (async function(){
                                    if (check_true ((column_number===0))){
                                        return (last_final_column_num- (symbol && symbol.length))
                                    } else {
                                        return (column_number- (symbol && symbol.length))
                                    }
                                })();
                                cline=await (async function(){
                                    if (check_true ((column_number===0))){
                                        return (line_number- 1)
                                    } else {
                                        return line_number
                                    }
                                })();
                                real_sym=await (await Environment.get_global("first"))((symbol).split("."));
                                if (check_true ((null==symbol_collector[real_sym]))){
                                    return await async function(){
                                        symbol_collector[real_sym]=await (async function(){
                                             return [await (async function(){
                                                let __array_op_rval__2=cline;
                                                 if (__array_op_rval__2 instanceof Function){
                                                    return await __array_op_rval__2(ccol) 
                                                } else {
                                                    return [__array_op_rval__2,ccol]
                                                }
                                            })()] 
                                        })();
                                        return symbol_collector;
                                        
                                    }()
                                } else {
                                    return (symbol_collector[real_sym]).push(await (async function(){
                                        let __array_op_rval__3=cline;
                                         if (__array_op_rval__3 instanceof Function){
                                            return await __array_op_rval__3(ccol) 
                                        } else {
                                            return [__array_op_rval__3,ccol]
                                        }
                                    })())
                                }
                            }
                        }
                    }
                };
                local_text=async function() {
                    let start;
                    let end;
                    start=await Math.max(0,(idx- 10));
                    end=await Math.min(await (await Environment.get_global("length"))(in_buffer),(idx+ 10));
                    return (await (await Environment.get_global("slice"))(in_buffer,start,end)).join("")
                };
                position=async function(offset) {
                    return ("line: "+ line_number+ " column: "+ await (async function(){
                        if (check_true (offset)){
                            return (column_number+ offset)
                        } else {
                            return column_number
                        }
                    })())
                };
                read_table=await (await Environment.get_global("add"))(new Object(),await (async function(){
                    if (check_true ((opts && opts["read_table_entries"]))){
                        return (opts && opts["read_table_entries"])
                    } else {
                        return new Object()
                    }
                })(),await ( async function(){
                    let __obj__4=new Object();
                    __obj__4["("]=[")",async function(block) {
                        return block
                    }];
                    __obj__4["["]=["]",async function(block) {
                        return block
                    }];
                    __obj__4["{"]=["}",async function(block) {
                        let obj;
                        let __idx__5= async function(){
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
                            let idx=await __idx__5();
                            ;
                            key_mode=0;
                            need_colon=1;
                            value_mode=2;
                            key=null;
                            value=null;
                            cpos=null;
                            state=key_mode;
                            block_length=(await (await Environment.get_global("length"))(block)- 1);
                            reading_object=false;
                            await (async function(){
                                 let __test_condition__6=async function() {
                                    return (idx<block_length)
                                };
                                let __body_ref__7=async function() {
                                    idx+=1;
                                    key=block[idx];
                                    if (check_true (((key instanceof Array)&& ((key && key.length)===2)&& ((key && key["0"])==="=:quotem")&& ((key && key["1"]) instanceof String || typeof (key && key["1"])==='string')))){
                                        {
                                            key=(key && key["1"])
                                        }
                                    };
                                    if (check_true (((key instanceof String || typeof key==='string')&& await (await Environment.get_global("starts_with?"))("=:",key)&& (await (await Environment.get_global("length"))(key)>2)))){
                                        key=await key["substr"].call(key,2)
                                    };
                                    return await async function(){
                                        if (check_true (await (await Environment.get_global("blank?"))(key))) {
                                            return await error("missing object key",("blank or nil key: "+ block[idx]))
                                        } else if (check_true (await (await Environment.get_global("is_number?"))(key))) {
                                            {
                                                idx+=1;
                                                return await async function(){
                                                    obj[key]=block[idx];
                                                    return obj;
                                                    
                                                }()
                                            }
                                        } else if (check_true (((key instanceof String || typeof key==='string')&& await (await Environment.get_global("contains?"))(":",key)&& await (await Environment.get_global("not"))(await (await Environment.get_global("ends_with?"))(":",key))))) {
                                            {
                                                cpos=await key["indexOf"].call(key,":");
                                                value=await key["substr"].call(key,(cpos+ 1));
                                                key=await key["substr"].call(key,0,cpos);
                                                value=await process_word((value).split(""),0);
                                                return await async function(){
                                                    obj[key]=value;
                                                    return obj;
                                                    
                                                }()
                                            }
                                        } else {
                                            {
                                                idx+=1;
                                                if (check_true (await (await Environment.get_global("ends_with?"))(":",key))){
                                                    key=await (await Environment.get_global("chop"))(key)
                                                } else {
                                                    {
                                                        if (check_true ((block[idx]===":"))){
                                                            idx+=1
                                                        } else {
                                                            await error("missing colon",("expected colon for: "+ key))
                                                        }
                                                    }
                                                };
                                                return await async function(){
                                                    obj[key]=block[idx];
                                                    return obj;
                                                    
                                                }()
                                            }
                                        }
                                    } ()
                                };
                                let __BREAK__FLAG__=false;
                                while(await __test_condition__6()) {
                                     await __body_ref__7();
                                     if(__BREAK__FLAG__) {
                                         break;
                                        
                                    }
                                } ;
                                
                            })();
                            return obj
                        }
                    },async function() {
                        return reading_object=true
                    }];
                    __obj__4["\""]=["\"",async function(block) {
                        return ["quotes",block]
                    }];
                    return __obj__4;
                    
                })());
                get_char=async function(pos) {
                    return in_buffer[pos]
                };
                error=async function(type,message,offset) {
                    if (check_true (throw_on_error)){
                        throw new LispSyntaxError({
                            message:message,position:await position(offset),pos:{
                                line:line_number,column:(column_number+ (offset|| 0))
                            },depth:depth,local_text:await local_text(),source_name:source_name,type:type
                        });
                        
                    } else {
                        if (check_true ((opts && opts["on_error"]) instanceof Function)){
                            {
                                return await (async function(){
                                    let __array_op_rval__11=(opts && opts["on_error"]);
                                     if (__array_op_rval__11 instanceof Function){
                                        return await __array_op_rval__11({
                                            message:message,position:await position(offset),pos:{
                                                line:line_number,column:(column_number+ (offset|| 0))
                                            },depth:depth,local_text:await local_text(),source_name:source_name,type:type
                                        }) 
                                    } else {
                                        return [__array_op_rval__11,{
                                            message:message,position:await position(offset),pos:{
                                                line:line_number,column:(column_number+ (offset|| 0))
                                            },depth:depth,local_text:await local_text(),source_name:source_name,type:type
                                        }]
                                    }
                                })()
                            }
                        }
                    }
                };
                handle_escape_char=async function(c) {
                    let ccode;
                    ccode=await c["charCodeAt"].call(c,0);
                    return await async function(){
                        if (check_true ((ccode===34))) {
                            return c
                        } else if (check_true ((ccode===92))) {
                            return c
                        } else if (check_true ((c==="t"))) {
                            return await String.fromCharCode(9)
                        } else if (check_true ((c==="n"))) {
                            return await String.fromCharCode(10)
                        } else if (check_true ((c==="r"))) {
                            return await String.fromCharCode(13)
                        } else if (check_true ((c==="f"))) {
                            return c
                        } else if (check_true ((c==="b"))) {
                            return c
                        } else {
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
                        {
                            await console.log("process_word: ",word,word_as_number,backtick_mode)
                        }
                    };
                    return await async function(){
                        if (check_true (("true"===word))) {
                            return true
                        } else if (check_true (("false"===word))) {
                            return false
                        } else if (check_true ((":"===word))) {
                            return word
                        } else if (check_true ((",@"===word))) {
                            return "=$,@"
                        } else if (check_true (((",#"===word)|| ("##"===word)))) {
                            return "=:##"
                        } else if (check_true (("=$,@"===word))) {
                            return "=$,@"
                        } else if (check_true (("=:##"===word))) {
                            return "=:##"
                        } else if (check_true (await isNaN(word_as_number))) {
                            {
                                return await async function(){
                                    if (check_true ((word==="=:"))) {
                                        {
                                            return "=:"
                                        }
                                    } else if (check_true (((backtick_mode===0)&& await (await Environment.get_global("ends_with?"))(")",word)))) {
                                        {
                                            await error("trailing character","unexpected trailing parenthesis 2");
                                            return ""
                                        }
                                    } else if (check_true (((backtick_mode===0)&& await (await Environment.get_global("ends_with?"))("]",word)))) {
                                        {
                                            await error("trailing character","unexpected trailing bracket 2");
                                            return ""
                                        }
                                    } else if (check_true (await (await Environment.get_global("contains?"))(word,await (async function(){
                                         return ["=:(",await (async function(){
                                             return "=:)" 
                                        })(),await (async function(){
                                             return "=:'" 
                                        })()] 
                                    })()))) {
                                        {
                                            return word
                                        }
                                    } else if (check_true ((backtick_mode===1))) {
                                        return word
                                    } else {
                                        {
                                            if (check_true (symbol_receiver)){
                                                {
                                                    await add_symbol(word)
                                                }
                                            };
                                            return await (await Environment.get_global("add"))(await (async function(){
                                                 return "=:" 
                                            })(),word)
                                        }
                                    }
                                } ()
                            }
                        } else if (check_true (await (await Environment.get_global("is_number?"))(word_as_number))) {
                            return word_as_number
                        } else {
                            {
                                console.log("reader: ",await position()," what is this?",word,word_acc,await local_text());
                                return word
                            }
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
                        {
                            (acc).push(_prefix_op)
                        }
                    };
                    depth=_depth;
                    await (async function(){
                         let __test_condition__12=async function() {
                            return (await (await Environment.get_global("not"))(stop)&& (idx<len))
                        };
                        let __body_ref__13=async function() {
                            idx+=1;
                            escape_mode=await Math.max(0,(escape_mode- 1));
                            c=await get_char(idx);
                            next_c=await get_char((idx+ 1));
                            if (check_true ((c==="\n"))){
                                {
                                    line_number+=1;
                                    last_final_column_num=column_number;
                                    column_number=0
                                }
                            };
                            if (check_true (debugmode)){
                                {
                                    await console.log(_depth,"  ",c," ",next_c," ",mode,"",escape_mode," ",await (await Environment.get_global("as_lisp"))(acc),await (await Environment.get_global("as_lisp"))(word_acc),(handler_stack && handler_stack.length))
                                }
                            };
                            await async function(){
                                if (check_true (((next_c===undefined)&& await (await Environment.get_global("not"))((await (async function(){
                                    let __targ__14=await (await Environment.get_global("last"))(handler_stack);
                                    if (__targ__14){
                                         return(__targ__14)[0]
                                    } 
                                })()===undefined))&& (await (await Environment.get_global("not"))((c===await (async function(){
                                    let __targ__15=await (await Environment.get_global("last"))(handler_stack);
                                    if (__targ__15){
                                         return(__targ__15)[0]
                                    } 
                                })()))|| ((handler_stack && handler_stack.length)>1))))) {
                                    return await error("premature end",("premature end: expected: "+ await (async function(){
                                        let __targ__16=await (await Environment.get_global("last"))(handler_stack);
                                        if (__targ__16){
                                             return(__targ__16)[0]
                                        } 
                                    })()))
                                } else if (check_true (((next_c===undefined)&& (mode===in_quotes)&& await (await Environment.get_global("not"))((await c["charCodeAt"]()===34))))) {
                                    await error("premature end","premature end: expected: \"")
                                } else if (check_true (((next_c===undefined)&& (mode===in_long_text)&& await (await Environment.get_global("not"))((c==="|"))))) {
                                    await error("premature end","premature end: expected: |")
                                } else if (check_true (((mode===in_code)&& (_depth===1)&& (next_c===")")&& (c===")")))) {
                                    {
                                        await error("trailing character","unexpected trailing parenthesis")
                                    }
                                }
                            } ();
                            await async function(){
                                if (check_true (((c==="\n")&& (mode===in_comment)))) {
                                    {
                                        mode=in_code;
                                        return __BREAK__FLAG__=true;
                                        return
                                    }
                                } else if (check_true (((92===await c["charCodeAt"].call(c,0))&& (mode===in_long_text)))) {
                                    {
                                        (word_acc).push(c);
                                        (word_acc).push(c)
                                    }
                                } else if (check_true (((mode>0)&& (escape_mode===1)&& (92===await c["charCodeAt"].call(c,0))))) {
                                    {
                                        (word_acc).push(c)
                                    }
                                } else if (check_true (((mode>0)&& (92===await c["charCodeAt"].call(c,0))))) {
                                    {
                                        escape_mode=2
                                    }
                                } else if (check_true (((mode>0)&& (escape_mode===1)))) {
                                    {
                                        (word_acc).push(await handle_escape_char(c))
                                    }
                                } else if (check_true (((mode===in_long_text)&& (escape_mode===0)&& (c==="|")))) {
                                    {
                                        acc=await (await Environment.get_global("add"))((word_acc).join(""));
                                        word_acc=[];
                                        mode=in_code;
                                        __BREAK__FLAG__=true;
                                        return
                                    }
                                } else if (check_true (((mode===in_quotes)&& (escape_mode===0)&& (c==="\"")))) {
                                    {
                                        acc=await (await Environment.get_global("add"))((word_acc).join(""));
                                        word_acc=[];
                                        mode=in_code;
                                        __BREAK__FLAG__=true;
                                        return
                                    }
                                } else if (check_true (((mode===in_single_quote)&& (escape_mode===0)&& (c==="'")))) {
                                    {
                                        acc=await (await Environment.get_global("add"))((word_acc).join(""));
                                        word_acc=[];
                                        mode=in_code;
                                        __BREAK__FLAG__=true;
                                        return
                                    }
                                } else if (check_true (((c==="|")&& (mode===in_code)))) {
                                    {
                                        if (check_true (((word_acc && word_acc.length)>0))){
                                            {
                                                (acc).push(await process_word(word_acc));
                                                word_acc=[]
                                            }
                                        };
                                        mode=in_long_text;
                                        block_return=await read_block(await (await Environment.get_global("add"))(_depth,1));
                                        if (check_true ((backtick_mode===1))){
                                            {
                                                block_return=await (async function(){
                                                     return ["=:quotem",block_return] 
                                                })();
                                                backtick_mode=0
                                            }
                                        };
                                        (acc).push(block_return)
                                    }
                                } else if (check_true (((c==="\"")&& (escape_mode===0)&& (mode===in_code)))) {
                                    {
                                        if (check_true (((word_acc && word_acc.length)>0))){
                                            {
                                                (acc).push(await process_word(word_acc));
                                                word_acc=[]
                                            }
                                        };
                                        mode=in_quotes;
                                        block_return=await read_block(await (await Environment.get_global("add"))(_depth,1));
                                        if (check_true ((backtick_mode===1))){
                                            {
                                                backtick_mode=0
                                            }
                                        };
                                        (acc).push(block_return)
                                    }
                                } else if (check_true (((c==="'")&& (escape_mode===0)&& (mode===in_code)))) {
                                    {
                                        if (check_true (((word_acc && word_acc.length)>0))){
                                            {
                                                (acc).push(await process_word(word_acc));
                                                word_acc=[]
                                            }
                                        };
                                        mode=in_single_quote;
                                        block_return=await read_block(await (await Environment.get_global("add"))(_depth,1));
                                        if (check_true ((backtick_mode===1))){
                                            {
                                                backtick_mode=0
                                            }
                                        };
                                        (acc).push(block_return)
                                    }
                                } else if (check_true ((mode===in_comment))) {
                                    false
                                } else if (check_true (((c===";")&& (mode===in_code)))) {
                                    {
                                        if (check_true (((word_acc && word_acc.length)>0))){
                                            {
                                                (acc).push(await process_word(word_acc));
                                                word_acc=[]
                                            }
                                        };
                                        mode=in_comment;
                                        await read_block(await (await Environment.get_global("add"))(_depth,1))
                                    }
                                } else if (check_true (((mode===in_code)&& (await (await Environment.get_global("length"))(handler_stack)>0)&& (c===await (async function(){
                                    let __targ__17=await (await Environment.get_global("last"))(handler_stack);
                                    if (__targ__17){
                                         return(__targ__17)[0]
                                    } 
                                })())))) {
                                    {
                                        __BREAK__FLAG__=true;
                                        return
                                    }
                                } else if (check_true (((mode===in_code)&& read_table[c]&& await (await Environment.get_global("first"))(read_table[c])))) {
                                    {
                                        if (check_true (await (async function(){
                                            let __targ__18=read_table[c];
                                            if (__targ__18){
                                                 return(__targ__18)[2]
                                            } 
                                        })())){
                                            {
                                                handler=await (async function(){
                                                    let __targ__19=read_table[c];
                                                    if (__targ__19){
                                                         return(__targ__19)[2]
                                                    } 
                                                })();
                                                await (async function(){
                                                    let __array_op_rval__20=handler;
                                                     if (__array_op_rval__20 instanceof Function){
                                                        return await __array_op_rval__20() 
                                                    } else {
                                                        return [__array_op_rval__20]
                                                    }
                                                })();
                                                handler=null
                                            }
                                        };
                                        (handler_stack).push(read_table[c]);
                                        if (check_true (((word_acc && word_acc.length)>0))){
                                            {
                                                (acc).push(await process_word(word_acc,backtick_mode));
                                                backtick_mode=0;
                                                word_acc=[]
                                            }
                                        };
                                        block_return=await read_block(await (await Environment.get_global("add"))(_depth,1));
                                        handler=await (async function(){
                                            let __targ__21=(handler_stack).pop();
                                            if (__targ__21){
                                                 return(__targ__21)[1]
                                            } 
                                        })();
                                        block_return=await (async function(){
                                            let __array_op_rval__22=handler;
                                             if (__array_op_rval__22 instanceof Function){
                                                return await __array_op_rval__22(block_return) 
                                            } else {
                                                return [__array_op_rval__22,block_return]
                                            }
                                        })();
                                        if (check_true (await (await Environment.get_global("not"))((undefined===block_return)))){
                                            {
                                                if (check_true ((backtick_mode===1))){
                                                    {
                                                        block_return=await (async function(){
                                                             return ["=:quotem",block_return] 
                                                        })();
                                                        backtick_mode=0
                                                    }
                                                };
                                                (acc).push(block_return)
                                            }
                                        }
                                    }
                                } else if (check_true (((mode===in_code)&& (c==="`")))) {
                                    {
                                        if (check_true (((word_acc && word_acc.length)>0))){
                                            {
                                                (acc).push(await process_word(word_acc));
                                                word_acc=[]
                                            }
                                        };
                                        backtick_mode=1
                                    }
                                } else if (check_true (((mode===in_code)&& (c===":")&& ((word_acc && word_acc.length)===0)&& ((acc && acc.length)>0)&& (await (await Environment.get_global("last"))(acc) instanceof String || typeof await (await Environment.get_global("last"))(acc)==='string')))) {
                                    (acc).push(await (await Environment.get_global("add"))((acc).pop(),":"))
                                } else if (check_true (((mode===in_code)&& (last_c===",")&& ((c==="#")|| (c==="@"))))) {
                                    {
                                        (word_acc).push(c);
                                        (acc).push(await process_word(word_acc));
                                        word_acc=[]
                                    }
                                } else if (check_true (((mode===in_code)&& ((c===" ")|| (await c["charCodeAt"].call(c,0)===10)|| (await c["charCodeAt"].call(c,0)===9)|| ((c===",")&& await (await Environment.get_global("not"))((next_c==="@"))&& await (await Environment.get_global("not"))((next_c==="#"))))))) {
                                    {
                                        if (check_true (((word_acc && word_acc.length)>0))){
                                            {
                                                if (check_true ((backtick_mode===1))){
                                                    {
                                                        (acc).push(await process_word(word_acc,backtick_mode));
                                                        backtick_mode=0
                                                    }
                                                } else {
                                                    (acc).push(await process_word(word_acc))
                                                };
                                                word_acc=[]
                                            }
                                        }
                                    }
                                } else if (check_true (((mode===in_code)&& (await c["charCodeAt"].call(c,0)===13)))) {
                                    false
                                } else {
                                    {
                                        (word_acc).push(c)
                                    }
                                }
                            } ();
                            column_number+=1;
                            return last_c=c
                        };
                        let __BREAK__FLAG__=false;
                        while(await __test_condition__12()) {
                             await __body_ref__13();
                             if(__BREAK__FLAG__) {
                                 break;
                                
                            }
                        } ;
                        
                    })();
                    if (check_true (((word_acc && word_acc.length)>0))){
                        {
                            (acc).push(await process_word(word_acc,backtick_mode));
                            word_acc=[]
                        }
                    };
                    return acc
                };
                if (check_true (debugmode)){
                    {
                        await console.log("read->",in_buffer);
                        await console.log("D  CHAR NC "," M","ESC","ACC","WORDACC","HS")
                    }
                };
                output_structure=await read_block(0);
                if (check_true (debugmode)){
                    {
                        await console.log("read<-",await (async function(){
                             return await clone(output_structure) 
                        })())
                    }
                };
                if (check_true ((opts && opts["symbol_receiver"]))){
                    {
                        await (async function(){
                            let __array_op_rval__23=(opts && opts["symbol_receiver"]);
                             if (__array_op_rval__23 instanceof Function){
                                return await __array_op_rval__23({
                                    source_name:source_name,symbols:symbol_collector
                                }) 
                            } else {
                                return [__array_op_rval__23,{
                                    source_name:source_name,symbols:symbol_collector
                                }]
                            }
                        })()
                    }
                };
                if (check_true (((output_structure instanceof Array)&& (await (await Environment.get_global("length"))(output_structure)>1)))){
                    {
                        (output_structure).unshift(await (async function(){
                             return "=:iprogn" 
                        })());
                        return await (await Environment.get_global("first"))(await (async function(){
                            let __array_op_rval__24=output_structure;
                             if (__array_op_rval__24 instanceof Function){
                                return await __array_op_rval__24() 
                            } else {
                                return [__array_op_rval__24]
                            }
                        })())
                    }
                } else {
                    return await (await Environment.get_global("first"))(output_structure)
                }
            }
        }
    } ()
};
                    let add_escape_encoding=async function(text) {        if (check_true ((text instanceof String || typeof text==='string'))){            let chars;            let acc;            chars=(text).split("");            acc=[];            await (async function() {                let __for_body__3=async function(c) {                     return  await async function(){                        if (check_true( ((await c["charCodeAt"].call(c,0)===34)))) {                            (acc).push(await String.fromCharCode(92));                             return  (acc).push(c)                        } else  {                             return (acc).push(c)                        }                    } ()                };                let __array__4=[],__elements__2=chars;                let __BREAK__FLAG__=false;                for(let __iter__1 in __elements__2) {                    __array__4.push(await __for_body__3(__elements__2[__iter__1]));                    if(__BREAK__FLAG__) {                         __array__4.pop();                        break;                                            }                }return __array__4;                             })();             return  (acc).join("")        } else {              return text        }    };
                    let do_deferred_splice=async function(tree) {    let rval;
    let idx;
    let tval;
    let deferred_operator;
    rval=null;
    idx=0;
    tval=null;
    deferred_operator=(["=","$","&","!"]).join("");
    return await async function(){
        if (check_true ((tree instanceof Array))) {
            {
                rval=[];
                await (async function(){
                     let __test_condition__17=async function() {
                        return (idx<(tree && tree.length))
                    };
                    let __body_ref__18=async function() {
                        tval=tree[idx];
                        if (check_true ((tval===deferred_operator))){
                            {
                                idx+=1;
                                tval=tree[idx];
                                rval=await rval["concat"].call(rval,await (async function(){
                                     return await do_deferred_splice(tval) 
                                })())
                            }
                        } else {
                            (rval).push(await (async function(){
                                 return await do_deferred_splice(tval) 
                            })())
                        };
                        return idx+=1
                    };
                    let __BREAK__FLAG__=false;
                    while(await __test_condition__17()) {
                         await __body_ref__18();
                         if(__BREAK__FLAG__) {
                             break;
                            
                        }
                    } ;
                    
                })();
                return rval
            }
        } else if (check_true ((tree instanceof Object))) {
            {
                rval=new Object();
                await (async function() {
                    let __for_body__21=async function(pset) {
                        return await async function(){
                            rval[(pset && pset["0"])]=await (async function(){
                                 return await do_deferred_splice((pset && pset["1"])) 
                            })();
                            return rval;
                            
                        }()
                    };
                    let __array__22=[],__elements__20=await (await Environment.get_global("pairs"))(tree);
                    let __BREAK__FLAG__=false;
                    for(let __iter__19 in __elements__20) {
                        __array__22.push(await __for_body__21(__elements__20[__iter__19]));
                        if(__BREAK__FLAG__) {
                             __array__22.pop();
                            break;
                            
                        }
                    }return __array__22;
                     
                })();
                return rval
            }
        } else {
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
        {
            await async function(){
                comps[0]=await (async function(){
                    let __array_op_rval__188=sanitizer_fn;
                     if (__array_op_rval__188 instanceof Function){
                        return await __array_op_rval__188((comps && comps["0"])) 
                    } else {
                        return [__array_op_rval__188,(comps && comps["0"])]
                    }
                })();
                return comps;
                
            }();
            await (async function(){
                 let __test_condition__189=async function() {
                    return ((comps && comps.length)>0)
                };
                let __body_ref__190=async function() {
                    (acc).push((comps).shift());
                    return (acc_full).push(await (async function(){
                         return await (await Environment.get_global("expand_dot_accessor"))((acc).join("."),ctx) 
                    })())
                };
                let __BREAK__FLAG__=false;
                while(await __test_condition__189()) {
                     await __body_ref__190();
                     if(__BREAK__FLAG__) {
                         break;
                        
                    }
                } ;
                
            })();
            rval=await (await Environment.get_global("flatten"))(["(",(acc_full).join(" && "),")"]);
            return rval
        }
    }
};
                    ;
                    let as_lisp=function(obj,depth,max_depth) {
                        return  lisp_writer(obj,depth,max_depth,Environment)
                    };
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
                        Environment.global_ctx.scope["clone_to_new"]=clone_to_new;
                        Environment.global_ctx.scope["save_env"]=save_env;
                        Environment.global_ctx.scope["null"]=null;
                        return Environment.global_ctx.scope;
                        
                    }();
                    let inlines=await (async function(){
                        if (check_true (parent_environment)){
                            return await add(new Object(),parent_environment.inlines,await (async function(){
                                if (check_true (opts.inlines)){
                                    return opts.inlines
                                } else {
                                    return new Object()
                                }
                            })())
                        } else {
                            return await add(new Object(),await (async function(){
                                if (check_true (opts.inlines)){
                                    return opts.inlines
                                } else {
                                    return new Object()
                                }
                            })(),await ( async function(){
                                let __obj__350=new Object();
                                __obj__350["pop"]=async function(args) {
                                    return ["(",args['0'],")",".","pop()"]
                                };
                                __obj__350["push"]=async function(args) {
                                    return ["(",args['0'],")",".push","(",args['1'],")"]
                                };
                                __obj__350["chomp"]=async function(args) {
                                    return ["(",args['0'],")",".substr","(",0,",","(",args['0'],".length","-",1,")",")"]
                                };
                                __obj__350["join"]=async function(args) {
                                    if (check_true ((args.length===1))){
                                        return ["(",args['0'],")",".join","('')"]
                                    } else {
                                        return ["(",args['1'],")",".join","(",args['0'],")"]
                                    }
                                };
                                __obj__350["take"]=async function(args) {
                                    return ["(",args['0'],")",".shift","()"]
                                };
                                __obj__350["prepend"]=async function(args) {
                                    return ["(",args['0'],")",".unshift","(",args['1'],")"]
                                };
                                __obj__350["trim"]=async function(args) {
                                    return ["(",args['0'],")",".trim()"]
                                };
                                __obj__350["lowercase"]=async function(args) {
                                    return ["(",args['0'],")",".toLowerCase()"]
                                };
                                __obj__350["uppercase"]=async function(args) {
                                    return ["(",args['0'],")",".toUpperCase()"]
                                };
                                __obj__350["islice"]=async function(args) {
                                    return await async function(){
                                        if (check_true ((args.length===3))) {
                                            return ["(",args['0'],")",".slice(",args['1'],",",args['2'],")"]
                                        } else if (check_true ((args.length===2))) {
                                            return ["(",args['0'],")",".slice(",args['1'],")"]
                                        } else {
                                            throw new SyntaxError("slice requires 2 or 3 arguments");
                                            
                                        }
                                    } ()
                                };
                                __obj__350["split_by"]=async function(args) {
                                    return ["(",args['1'],")",".split","(",args['0'],")"]
                                };
                                __obj__350["bindf"]=async function(args) {
                                    return await (async function(){
                                        let __array_op_rval__351=args['0'];
                                         if (__array_op_rval__351 instanceof Function){
                                            return await __array_op_rval__351(".bind(",args['1'],")") 
                                        } else {
                                            return [__array_op_rval__351,".bind(",args['1'],")"]
                                        }
                                    })()
                                };
                                __obj__350["is_array?"]=async function(args) {
                                    return ["(",args['0']," instanceof Array",")"]
                                };
                                __obj__350["is_object?"]=async function(args) {
                                    return ["(",args['0']," instanceof Object",")"]
                                };
                                __obj__350["is_string?"]=async function(args) {
                                    return ["(",args['0']," instanceof String || typeof ",args['0'],"===","'string'",")"]
                                };
                                __obj__350["is_function?"]=async function(args) {
                                    return await (async function(){
                                        let __array_op_rval__352=args['0'];
                                         if (__array_op_rval__352 instanceof Function){
                                            return await __array_op_rval__352(" instanceof Function") 
                                        } else {
                                            return [__array_op_rval__352," instanceof Function"]
                                        }
                                    })()
                                };
                                __obj__350["is_element?"]=async function(args) {
                                    return await (async function(){
                                        let __array_op_rval__353=args['0'];
                                         if (__array_op_rval__353 instanceof Function){
                                            return await __array_op_rval__353(" instanceof Element") 
                                        } else {
                                            return [__array_op_rval__353," instanceof Element"]
                                        }
                                    })()
                                };
                                __obj__350["log"]=async function(args) {
                                    return ["console.log","(",await (async function(){
                                         return await map(async function(val,idx,tl) {
                                            if (check_true ((idx<(tl- 1)))){
                                                return await (async function(){
                                                    let __array_op_rval__354=val;
                                                     if (__array_op_rval__354 instanceof Function){
                                                        return await __array_op_rval__354(",") 
                                                    } else {
                                                        return [__array_op_rval__354,","]
                                                    }
                                                })()
                                            } else {
                                                return await (async function(){
                                                    let __array_op_rval__355=val;
                                                     if (__array_op_rval__355 instanceof Function){
                                                        return await __array_op_rval__355() 
                                                    } else {
                                                        return [__array_op_rval__355]
                                                    }
                                                })()
                                            }
                                        },args) 
                                    })(),")"]
                                };
                                __obj__350["reverse"]=async function(args) {
                                    return ["(",args['0'],")",".slice(0).reverse()"]
                                };
                                __obj__350["int"]=async function(args) {
                                    return await async function(){
                                        if (check_true ((args.length===1))) {
                                            return ["parseInt(",args['0'],")"]
                                        } else if (check_true ((args.length===2))) {
                                            return ["parseInt(",args['0'],",",args['1'],")"]
                                        } else {
                                            throw new "SyntaxError"(("invalid number of arguments to int: received "+ args.length));
                                            
                                        }
                                    } ()
                                };
                                __obj__350["float"]=async function(args) {
                                    return ["parseFloat(",args['0'],")"]
                                };
                                return __obj__350;
                                
                            })())
                        }
                    })();
                    ;
                    await async function(){
                        Environment["eval"]=eval_struct;
                        Environment["identify"]=subtype;
                        Environment["meta_for_symbol"]=meta_for_symbol;
                        Environment["set_compiler"]=set_compiler;
                        Environment["read_lisp"]=reader;
                        Environment["as_lisp"]=as_lisp;
                        Environment["symbols"]=symbols;
                        Environment["inlines"]=inlines;
                        Environment["clone_to_new"]=clone_to_new;
                        Environment["export_symbol_set"]=export_symbol_set;
                        Environment["save_env"]=save_env;
                        Environment["special_operators"]=special_operators;
                        Environment["definitions"]=Environment.definitions;
                        Environment["declarations"]=Environment.declarations;
                        Environment["get_namespace_handle"]=get_namespace_handle;
                        Environment["compile"]=compile;
                        Environment["evaluate"]=evaluate;
                        Environment["evaluate_local"]=evaluate_local;
                        Environment["do_deferred_splice"]=do_deferred_splice;
                        Environment["id"]=async function() {
                            return id
                        };
                        Environment["set_check_external_env"]=async function(state) {
                            check_external_env_default=state;
                            return check_external_env_default
                        };
                        Environment["check_external_env"]=async function() {
                            return check_external_env_default
                        };
                        return Environment;
                        
                    }();
                    in_boot=false;
                    let sys_init=Environment.global_ctx.scope["*system_initializer*"];
                    ;
                    let init=Environment.global_ctx.scope["*initializer*"];
                    ;
                    if (check_true ((opts.default_namespace&& await not((compiler===unset_compiler))&& children[opts.default_namespace]))){
                        {
                            await (await get_global("set_namespace"))(opts.default_namespace)
                        }
                    };
                    if (check_true ((namespace==="core"))){
                        {
                            await (async function() {
                                let __for_body__359=async function(symname) {
                                    {
                                        let it;
                                        it=(await not((included_globals&& included_globals.imports[symname]))&& await resolve_path(await (async function(){
                                            let __array_op_rval__361=symname;
                                             if (__array_op_rval__361 instanceof Function){
                                                return await __array_op_rval__361("initializer") 
                                            } else {
                                                return [__array_op_rval__361,"initializer"]
                                            }
                                        })(),Environment.definitions));
                                        if (check_true (it)){
                                            {
                                                try {
                                                    return await async function(){
                                                        Environment.global_ctx.scope[symname]=await (async function(){
                                                             return await eval_struct(it,new Object(),{
                                                                throw_on_error:true
                                                            }) 
                                                        })();
                                                        return Environment.global_ctx.scope;
                                                        
                                                    }()
                                                } catch (__exception__362) {
                                                    if (__exception__362 instanceof Error) {
                                                        let e=__exception__362;
                                                        {
                                                            {
                                                                return await console.error("core environment cannot initialize: ",symname,"error:",e)
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        } else {
                                            return 
                                        }
                                    }
                                };
                                let __array__360=[],__elements__358=await keys(Environment.definitions);
                                let __BREAK__FLAG__=false;
                                for(let __iter__357 in __elements__358) {
                                    __array__360.push(await __for_body__359(__elements__358[__iter__357]));
                                    if(__BREAK__FLAG__) {
                                         __array__360.pop();
                                        break;
                                        
                                    }
                                }return __array__360;
                                 
                            })();
                            if (check_true (sys_init)){
                                {
                                    (await Environment.eval(await async function(){
                                        return sys_init
                                    }(),null))
                                }
                            };
                            if (check_true ((rehydrated_children&& (included_globals["children"] instanceof Object)))){
                                {
                                    await (async function() {
                                        let __for_body__366=async function(childname) {
                                            if (check_true (included_globals.children[childname])){
                                                {
                                                    let childset=await (async function(){
                                                        let __array_op_rval__368=childname;
                                                         if (__array_op_rval__368 instanceof Function){
                                                            return await __array_op_rval__368(included_globals.children[childname]) 
                                                        } else {
                                                            return [__array_op_rval__368,included_globals.children[childname]]
                                                        }
                                                    })();
                                                    ;
                                                    let childenv=children[childset['0']];
                                                    ;
                                                    let imported_defs=childset['1']['0'];
                                                    ;
                                                    if (check_true ((included_globals["imports"] instanceof Object))){
                                                        {
                                                            imps=included_globals["imports"];
                                                            if (check_true (imps)){
                                                                {
                                                                    await (async function() {
                                                                        let __for_body__371=async function(imp_source) {
                                                                            if (check_true (children[imp_source.namespace])){
                                                                                {
                                                                                    return await set_global((""+ imp_source.namespace+ "/"+ imp_source.symbol),imp_source.initializer)
                                                                                }
                                                                            }
                                                                        };
                                                                        let __array__372=[],__elements__370=await values(imps);
                                                                        let __BREAK__FLAG__=false;
                                                                        for(let __iter__369 in __elements__370) {
                                                                            __array__372.push(await __for_body__371(__elements__370[__iter__369]));
                                                                            if(__BREAK__FLAG__) {
                                                                                 __array__372.pop();
                                                                                break;
                                                                                
                                                                            }
                                                                        }return __array__372;
                                                                         
                                                                    })()
                                                                }
                                                            }
                                                        }
                                                    };
                                                    try {
                                                        await async function(){
                                                            childset['1'][1]=await childenv["eval"].call(childenv,childset['1']['1'],{
                                                                throw_on_error:true
                                                            });
                                                            return childset['1'];
                                                            
                                                        }();
                                                        return await (async function() {
                                                            let __for_body__377=async function(symset) {
                                                                if (check_true ((null==await resolve_path(await (async function(){
                                                                    let __array_op_rval__379=childset['0'];
                                                                     if (__array_op_rval__379 instanceof Function){
                                                                        return await __array_op_rval__379("context","scope",symset['0']) 
                                                                    } else {
                                                                        return [__array_op_rval__379,"context","scope",symset['0']]
                                                                    }
                                                                })(),children)))){
                                                                    {
                                                                        if (check_true (imported_defs[symset['0']])){
                                                                            {
                                                                                await (await get_global("set_path"))(await (async function(){
                                                                                    let __array_op_rval__380=childset['0'];
                                                                                     if (__array_op_rval__380 instanceof Function){
                                                                                        return await __array_op_rval__380("definitions",symset['0']) 
                                                                                    } else {
                                                                                        return [__array_op_rval__380,"definitions",symset['0']]
                                                                                    }
                                                                                })(),children,imported_defs[symset['0']])
                                                                            }
                                                                        };
                                                                        {
                                                                            let it;
                                                                            it=await resolve_path(await (async function(){
                                                                                let __array_op_rval__381=childset['0'];
                                                                                 if (__array_op_rval__381 instanceof Function){
                                                                                    return await __array_op_rval__381("definitions",symset['0'],"initializer") 
                                                                                } else {
                                                                                    return [__array_op_rval__381,"definitions",symset['0'],"initializer"]
                                                                                }
                                                                            })(),children);
                                                                            if (check_true (it)){
                                                                                {
                                                                                    try {
                                                                                        return await (await get_global("set_path"))(await (async function(){
                                                                                            let __array_op_rval__383=childset['0'];
                                                                                             if (__array_op_rval__383 instanceof Function){
                                                                                                return await __array_op_rval__383("context","scope",symset['0']) 
                                                                                            } else {
                                                                                                return [__array_op_rval__383,"context","scope",symset['0']]
                                                                                            }
                                                                                        })(),children,await childenv["eval"].call(childenv,it))
                                                                                    } catch (__exception__382) {
                                                                                        if (__exception__382 instanceof Error) {
                                                                                            let e=__exception__382;
                                                                                            {
                                                                                                return await console.error("env: unable to evaluate: symbol: ",symset['0'],e)
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            } else {
                                                                                return await (await get_global("set_path"))(await (async function(){
                                                                                    let __array_op_rval__384=childset['0'];
                                                                                     if (__array_op_rval__384 instanceof Function){
                                                                                        return await __array_op_rval__384("context","scope",symset['0']) 
                                                                                    } else {
                                                                                        return [__array_op_rval__384,"context","scope",symset['0']]
                                                                                    }
                                                                                })(),children,symset['1'])
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            };
                                                            let __array__378=[],__elements__376=childset['1']['1'];
                                                            let __BREAK__FLAG__=false;
                                                            for(let __iter__375 in __elements__376) {
                                                                __array__378.push(await __for_body__377(__elements__376[__iter__375]));
                                                                if(__BREAK__FLAG__) {
                                                                     __array__378.pop();
                                                                    break;
                                                                    
                                                                }
                                                            }return __array__378;
                                                             
                                                        })()
                                                    } catch (__exception__373) {
                                                        if (__exception__373 instanceof Error) {
                                                            let e=__exception__373;
                                                            {
                                                                return await console.error("env: unable to load namespace: ",await (async function(){
                                                                     return await clone(childset) 
                                                                })())
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        };
                                        let __array__367=[],__elements__365=(included_globals.child_load_order|| []);
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__364 in __elements__365) {
                                            __array__367.push(await __for_body__366(__elements__365[__iter__364]));
                                            if(__BREAK__FLAG__) {
                                                 __array__367.pop();
                                                break;
                                                
                                            }
                                        }return __array__367;
                                         
                                    })()
                                }
                            };
                            if (check_true (init)){
                                {
                                    (await Environment.eval(await async function(){
                                        return init
                                    }(),null))
                                }
                            };
                            await (async function() {
                                let __for_body__387=async function(child) {
                                    return await child["evaluate_local"].call(child,("(progn (debug) (console.log \"child running initialization..\" *namespace*) (if (prop Environment.global_ctx.scope `*system_initializer*) (eval *system_initializer*)) (if (prop Environment.global_ctx.scope `*initializer*) (eval *initializer*)))"),null,{
                                        log_errors:true
                                    })
                                };
                                let __array__388=[],__elements__386=children;
                                let __BREAK__FLAG__=false;
                                for(let __iter__385 in __elements__386) {
                                    __array__388.push(await __for_body__387(__elements__386[__iter__385]));
                                    if(__BREAK__FLAG__) {
                                         __array__388.pop();
                                        break;
                                        
                                    }
                                }return __array__388;
                                 
                            })()
                        }
                    };
                    return Environment
                };
                return globalThis;
                
            }();
            return globalThis[symname]
        }
    }
}
}
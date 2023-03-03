// Source: core-ext.lisp  
// Build Time: 2023-03-03 06:25:22
// Version: 2023.03.03.06.25
export const DLISP_ENV_VERSION='2023.03.03.06.25';




const { get_next_environment_id, check_true, get_outside_global, subtype, lisp_writer, clone, LispSyntaxError } = await import("./lisp_writer.js");
export async function load_core(Environment)  {
{
    ;
    await Environment.set_global("if_undefined",async function(value,replacer) {
        return ["=:if",["=:==","=:undefined",value],replacer,value]
    },{ "eval_when":{ "compile_time":true
},"name":"if_undefined","macro":true,"fn_args":"(value replacer)","description":"If the first value is undefined, return the second value","usage":["value:*","replacer:*"],"requires":[],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("str",async function(...args) {
    args=await (await Environment.get_global("slice"))(args,0);
    return (args).join(" ")
},{ "name":"str","fn_args":"[\"&\" \"args\"]","description":"Joins arguments into a single string separated by spaces and returns a single string.","usage":["arg0:string","argn:string"],"tags":["string","join","text"],"requires":["slice","join"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("COPY_DATA",null,{
    requires:[],externals:["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],source_name:"core-ext.lisp"
});
if (check_true (await (await Environment.get_global("not"))(((typeof "uuid"==="undefined")|| (await Environment["get_global"].call(Environment,"uuid",ReferenceError)===ReferenceError))))){
    await Environment.set_global("uuid",(await Environment.get_global("uuid")),{
        description:"Generates and returns a string that is a newly generated uuid.",usage:[],tags:["id","unique","crypto"],requires:["uuid"],requires:["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],source_name:"core-ext.lisp"
    })
};
await Environment.set_global("on_nil",async function(nil_form,value) {
    return ["=:let",[["=:v",value]],["=:if",["=:eq","=:v","=:nil"],nil_form,"=:v"]]
},{ "eval_when":{ "compile_time":true
},"name":"on_nil","macro":true,"fn_args":"(nil_form value)","usage":["nil_form:form","value:*"],"description":"If the value argument is not nil or not undefined, return the value, otherwise evaluate the provided nil_form and return the results of the evaluation of the nil_form.","tags":["condition","nil","eval","undefined"],"requires":[],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("on_empty",async function(on_empty_form,value) {
    return ["=:let",[["=:v",value]],["=:if",["=:or",["=:eq","=:v","=:nil"],["=:and",["=:is_array?","=:v"],["=:==",0,["=:length","=:v"]]],["=:and",["=:is_object?","=:v"],["=:==",["=:length","=:v"],0]]],on_empty_form,"=:v"]]
},{ "eval_when":{ "compile_time":true
},"name":"on_empty","macro":true,"fn_args":"(on_empty_form value)","usage":["empty_form:form","value:*"],"description":"If the value argument is not an empty array, an empty object, nil or undefined, return the value, otherwise evaluate the provided empty_form and return the results of the evaluation of the empty_form.","tags":["condition","empty","list","array","object","eval","undefined"],"requires":[],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("sum",async function(vals) {
    return ["=:apply","=:add",vals]
},{ "eval_when":{ "compile_time":true
},"name":"sum","macro":true,"fn_args":"(vals)","description":["=:+","Given an array of values, add up the contents of the array in an applied add operation.  ","If these are numbers, they will be added arithmetically.  ","If given strings, they will be joined together (appended). ","If given a first value of an array, all subsequent values will be added into the array. ","If given an array of objects, all the keys/values will be merged and a single object retuned."],"usage":["vals:array"],"tags":["add","join","summation","numbers"],"requires":[],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("options_and_args",async function(arg_array) {
    return await async function(){
        if (check_true ((arg_array&& (arg_array instanceof Array)))) {
            {
                if (check_true ((await (await Environment.get_global("type"))((arg_array && arg_array["0"]))==="object"))){
                    return await (async function(){
                        let __array_op_rval__1=(arg_array && arg_array["0"]);
                         if (__array_op_rval__1 instanceof Function){
                            return await __array_op_rval__1(await (await Environment.get_global("slice"))(arg_array,1)) 
                        } else {
                            return [__array_op_rval__1,await (await Environment.get_global("slice"))(arg_array,1)]
                        }
                    })()
                } else {
                    return [null,arg_array]
                }
            }
        } else {
            return [null,arg_array]
        }
    } ()
},{ "name":"options_and_args","fn_args":"(arg_array)","usage":["arg_array:array"],"tags":["arguments","options"],"description":["=:+","Given an array of values, returns an array containing two values.  ","If the value at position 0 in the provided array is an non nil object, ","it will be in the position 0 of the returned value and the remaining ","values will be in position 1 of the returned array.","If the value at position 0 in the provided array is not an object type,","the value in position 0 of the returned array will be nil and ","all values will be placed in the returned array in position 1."],"requires":["is_array?","type","slice","null"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("enum",async function(value_list) {
    let e=new Object();
    ;
    let i=-1;
    ;
    await (await Environment.get_global("assert"))((value_list instanceof Array),"Value_list must be an array");
    await (async function() {
        let __for_body__4=async function(v) {
            return await async function(){
                e[v]=i+=1;
                return e;
                
            }()
        };
        let __array__5=[],__elements__3=value_list;
        let __BREAK__FLAG__=false;
        for(let __iter__2 in __elements__3) {
            __array__5.push(await __for_body__4(__elements__3[__iter__2]));
            if(__BREAK__FLAG__) {
                 __array__5.pop();
                break;
                
            }
        }return __array__5;
         
    })();
    return e
},{ "name":"enum","fn_args":"(value_list)","usage":["value_list:array"],"description":"Given a list of string values, returns an object with each value in the list corresponding to a numerical value.","tags":["enumeration","values"],"requires":["assert","is_array?"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("gen_id",async function(prefix) {
    return (""+ prefix+ "_"+ await Date.now())
},{ "name":"gen_id","fn_args":"(prefix)","usage":["prefix:string"],"tags":["web","html","identification"],"description":"Given a prefix returns a element safe unique id","requires":[],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("macros",async function() {
    let __collector;
    let __result;
    let __action;
    __collector=[];
    __result=null;
    __action=async function(v) {
        if (check_true ((v && v["1"] && v["1"]["macro"]))){
            return (v && v["0"])
        }
    };
    ;
    await (async function() {
        let __for_body__9=async function(__item) {
            __result=await __action(__item);
            if (check_true (__result)){
                return (__collector).push(__result)
            }
        };
        let __array__10=[],__elements__8=await (await Environment.get_global("pairs"))(Environment.definitions);
        let __BREAK__FLAG__=false;
        for(let __iter__7 in __elements__8) {
            __array__10.push(await __for_body__9(__elements__8[__iter__7]));
            if(__BREAK__FLAG__) {
                 __array__10.pop();
                break;
                
            }
        }return __array__10;
         
    })();
    return __collector
},{ "name":"macros","fn_args":"[]","usage":[],"description":"Returns the list of currently defined macros.  This function takes no arguments.","tags":["environment","macro","defined"],"requires":["push","pairs"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("pluck",async function(fields,data) {
    return ["=:each",data,fields]
},{ "eval_when":{ "compile_time":true
},"name":"pluck","macro":true,"fn_args":"(fields data)","description":"Similar to the 'each' commmand, given the set of desired fields as a first argument, and the data as the second argument, return only the specified fields from the supplied list of data","usage":["fields:string|array","data:array"],"tags":["list","each","filter","only","object"],"requires":[],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("objects_from_list",async function(key_path,objects) {
    let obj;
    let __path__11= async function(){
        return await (async function(){
            if (check_true ((key_path instanceof Array))){
                return key_path
            } else {
                return await (async function(){
                    let __array_op_rval__12=key_path;
                     if (__array_op_rval__12 instanceof Function){
                        return await __array_op_rval__12() 
                    } else {
                        return [__array_op_rval__12]
                    }
                })()
            }
        })()
    };
    {
        obj=new Object();
        let path=await __path__11();
        ;
        await (async function() {
            let __for_body__15=async function(o) {
                return await async function(){
                    obj[await (await Environment.get_global("resolve_path"))(path,o)]=o;
                    return obj;
                    
                }()
            };
            let __array__16=[],__elements__14=objects;
            let __BREAK__FLAG__=false;
            for(let __iter__13 in __elements__14) {
                __array__16.push(await __for_body__15(__elements__14[__iter__13]));
                if(__BREAK__FLAG__) {
                     __array__16.pop();
                    break;
                    
                }
            }return __array__16;
             
        })();
        return obj
    }
},{ "name":"objects_from_list","fn_args":"(key_path objects)","usage":["key_path:string|array","objects:array"],"description":"Given a path (string or array), and an array of object values, the function returns a new object with keys named via the value at the given path, and the object as the value.","tags":["list","object","conversion","transform"],"requires":["is_array?","resolve_path"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("pairs_from_list",async function(value_list,size) {
    let container;
    let mod_size;
    let pset;
    let count;
    container=[];
    size=(size|| 2);
    mod_size=(size- 1);
    pset=[];
    count=0;
    await (async function() {
        let __for_body__20=async function(item) {
            (pset).push(item);
            if (check_true ((mod_size===(count% size)))){
                {
                    (container).push(pset);
                    pset=[]
                }
            };
            return count+=1
        };
        let __array__21=[],__elements__19=value_list;
        let __BREAK__FLAG__=false;
        for(let __iter__18 in __elements__19) {
            __array__21.push(await __for_body__20(__elements__19[__iter__18]));
            if(__BREAK__FLAG__) {
                 __array__21.pop();
                break;
                
            }
        }return __array__21;
         
    })();
    if (check_true ((await (await Environment.get_global("length"))(pset)>0))){
        (container).push(pset)
    };
    return container
},{ "name":"pairs_from_list","fn_args":"(value_list size)","usage":["value:list","size?:number"],"description":"Given a list, segment the passed list into sub list (default in pairs) or as otherwise specified in the optional size","tags":["list","pairs","collect"],"requires":["push","length"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("reorder_keys",async function(key_list,obj) {
    let objkeys;
    let rval;
    let __values__22= async function(){
        return await (async function(){
             return await (await Environment.get_global("nth"))(key_list,obj) 
        })()
    };
    {
        objkeys=await (await Environment.get_global("keys"))(obj);
        rval=new Object();
        let values=await __values__22();
        ;
        return await (await Environment.get_global("to_object"))(await (await Environment.get_global("pairs_from_list"))(await (async function(){
             return await (await Environment.get_global("interlace"))(key_list,values) 
        })()))
    }
},{ "name":"reorder_keys","fn_args":"(key_list obj)","description":"Given a list of keys, returns a new object that has the keys in the order of the provided key list.","usage":["key_list:array","obj:object"],"tags":["list","object","key","order"],"requires":["keys","nth","to_object","pairs_from_list","interlace"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("only",async function(fields,data) {
    return await async function(){
        if (check_true ((data instanceof Array))) {
            return await (await Environment.get_global("map"))(async function(v) {
                return await (await Environment.get_global("reorder_keys"))(fields,v)
            },data)
        } else if (check_true ((data instanceof Object))) {
            return await (await Environment.get_global("reorder_keys"))(fields,data)
        } else {
            return data
        }
    } ()
},{ "name":"only","fn_args":"(fields data)","usage":["fields:array","data:array|object"],"description":"Given an array of objects, or a single object, return objects only containing the specified keys and the corresponging value.","tags":["pluck","filter","select","object","each","list","objects","keys"],"requires":["is_array?","map","reorder_keys","is_object?"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("sleep",async function(seconds) {
    return new Promise(async function(resolve) {
        return await setTimeout(async function() {
            return await (async function(){
                let __array_op_rval__23=resolve;
                 if (__array_op_rval__23 instanceof Function){
                    return await __array_op_rval__23(true) 
                } else {
                    return [__array_op_rval__23,true]
                }
            })()
        },(seconds* 1000))
    })
},{ "name":"sleep","fn_args":"(seconds)","usage":["seconds:number"],"tags":["time","timing","pause","control"],"description":"Pauses execution for the number of seconds provided to the function.","requires":[],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
null;
{
     Environment.set_global("from_universal_time",function(seconds) {
        let d;
        let ue;
        d=new Date(0);
        ue=(seconds- 2208988800);
         d["setUTCSeconds"].call(d,ue);
        return d
    },{ "name":"from_universal_time","fn_args":"(seconds)","description":"Given a universal_time_value (i.e. seconds from Jan 1 1900) returns a Date object.","usage":["seconds:number"],"tags":["date","time","universal","1900"],"requires":[],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
})
};
await Environment.set_global("+=",async function(...args) {
    let symbol;
    symbol=(args && args["0"]);
    args=await (await Environment.get_global("slice"))(args,1);
    return ["=:=",].concat(symbol,[["=:+",symbol,].concat(args)])
},{ "eval_when":{ "compile_time":true
},"name":"+=","macro":true,"fn_args":"(symbol \"&\" args)","usage":["symbol:*","arg0:*","argn?:*"],"description":"Appends in place the arguments to the symbol, adding the values of the arguments to the end.","tags":["append","mutate","text","add","number"],"requires":["slice"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("minmax",async function(container) {
    let value_found=false;
    ;
    let smallest=(await Environment.get_global("MAX_SAFE_INTEGER"));
    ;
    let biggest=(-1* (await Environment.get_global("MAX_SAFE_INTEGER")));
    ;
    if (check_true ((container&& (container instanceof Array)&& (await (await Environment.get_global("length"))(container)>0)))){
        {
            await (async function() {
                let __for_body__26=async function(value) {
                    return (await (await Environment.get_global("is_number?"))(value)&& await (async function(){
                        value_found=true;
                        smallest=await Math.min(value,smallest);
                        return biggest=await Math.max(value,biggest)
                    })())
                };
                let __array__27=[],__elements__25=container;
                let __BREAK__FLAG__=false;
                for(let __iter__24 in __elements__25) {
                    __array__27.push(await __for_body__26(__elements__25[__iter__24]));
                    if(__BREAK__FLAG__) {
                         __array__27.pop();
                        break;
                        
                    }
                }return __array__27;
                 
            })();
            if (check_true (value_found)){
                return await (async function(){
                    let __array_op_rval__28=smallest;
                     if (__array_op_rval__28 instanceof Function){
                        return await __array_op_rval__28(biggest) 
                    } else {
                        return [__array_op_rval__28,biggest]
                    }
                })()
            } else {
                return null
            }
        }
    } else {
        return null
    }
},{ "name":"minmax","fn_args":"(container)","usage":["container:array"],"description":"Given an array of numbers returns an array containing the smallest and the largest values found in the provided array. ","tags":["list","number","range","value"],"requires":["MAX_SAFE_INTEGER","is_array?","length","is_number?"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("minmax_index",async function(container) {
    let value_found=false;
    ;
    let idx_small=null;
    ;
    let idx_largest=null;
    ;
    let idx=0;
    ;
    let smallest=(await Environment.get_global("MAX_SAFE_INTEGER"));
    ;
    let biggest=(-1* (await Environment.get_global("MAX_SAFE_INTEGER")));
    ;
    if (check_true ((container&& (container instanceof Array)&& (await (await Environment.get_global("length"))(container)>0)))){
        {
            await (async function() {
                let __for_body__31=async function(value) {
                    return (await (await Environment.get_global("is_number?"))(value)&& await (async function(){
                        value_found=true;
                        if (check_true ((value<smallest))){
                            {
                                smallest=value;
                                idx_small=idx
                            }
                        };
                        if (check_true ((value>biggest))){
                            {
                                biggest=value;
                                idx_largest=idx
                            }
                        };
                        return idx+=1
                    })())
                };
                let __array__32=[],__elements__30=container;
                let __BREAK__FLAG__=false;
                for(let __iter__29 in __elements__30) {
                    __array__32.push(await __for_body__31(__elements__30[__iter__29]));
                    if(__BREAK__FLAG__) {
                         __array__32.pop();
                        break;
                        
                    }
                }return __array__32;
                 
            })();
            if (check_true (value_found)){
                return await (async function(){
                    let __array_op_rval__33=idx_small;
                     if (__array_op_rval__33 instanceof Function){
                        return await __array_op_rval__33(idx_largest) 
                    } else {
                        return [__array_op_rval__33,idx_largest]
                    }
                })()
            } else {
                return null
            }
        }
    } else {
        return null
    }
},{ "name":"minmax_index","fn_args":"(container)","usage":["container:array"],"description":"Given an array of numbers returns an array containing the indexes of the smallest and the largest values found in the provided array.","tags":["list","number","range","value","index"],"requires":["MAX_SAFE_INTEGER","is_array?","length","is_number?"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("invert_pairs",async function(value) {
    if (check_true ((value instanceof Array))){
        return await (await Environment.get_global("map"))(async function(v) {
            return await (async function(){
                let __array_op_rval__34=(v && v["1"]);
                 if (__array_op_rval__34 instanceof Function){
                    return await __array_op_rval__34((v && v["0"])) 
                } else {
                    return [__array_op_rval__34,(v && v["0"])]
                }
            })()
        },value)
    } else {
        throw new Error("invert_pairs passed a non-array value");
        
    }
},{ "name":"invert_pairs","fn_args":"(value)","description":"Given an array value containing pairs of value, as in [[1 2] [3 4]], invert the positions to be: [[2 1] [4 3]]","usage":["value:array"],"tags":["array","list","invert","flip","reverse","swap"],"requires":["is_array?","map"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("noop",async function(val) {
    return val
},{ "name":"noop","fn_args":"(val)","usage":["val:*"],"description":"No operation, just returns the value.  To be used as a placeholder operation, such as in apply_operator_list.","tags":["apply","value"],"requires":[],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("apply_list_to_list",async function(operator,list1,list2) {
    return await (await Environment.get_global("map"))(async function(val,idx) {
        return await (async function(){
            let __array_op_rval__35=operator;
             if (__array_op_rval__35 instanceof Function){
                return await __array_op_rval__35(val,list1[(idx% await (await Environment.get_global("length"))(list1))]) 
            } else {
                return [__array_op_rval__35,val,list1[(idx% await (await Environment.get_global("length"))(list1))]]
            }
        })()
    },list2)
},{ "name":"apply_list_to_list","fn_args":"(operator list1 list2)","usage":["operator:function","modifier_list:array","target_list:array"],"description":["=:+","Given an operator (function), a list of values to be applied (modifier list), and a list of source values (the target), ","returns a new list (array) that contains the result of calling the operator function with ","each value from the target list with the values from the modifier list. The operator function is called ","with <code>(operator source_value modifer_value)</code>."],"tags":["map","list","array","apply","range","index"],"requires":["map","length"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("apply_operator_list",async function(modifier_list,target_list) {
    return await (await Environment.get_global("map"))(async function(val,idx) {
        let op=await Environment["eval"].call(Environment,("=:"+ modifier_list[(idx% await (await Environment.get_global("length"))(modifier_list))]));
        ;
        return await (async function(){
            let __array_op_rval__36=op;
             if (__array_op_rval__36 instanceof Function){
                return await __array_op_rval__36(val) 
            } else {
                return [__array_op_rval__36,val]
            }
        })()
    },target_list)
},{ "name":"apply_operator_list","fn_args":"(modifier_list target_list)","usage":["operator_list:array","target_list:array"],"description":["=:+","<p>Note: Deprecated.Given a list containing quoted functions (modifier list), and a list of source values (the target), ","returns a new list (array) that contains the result of calling the relative index of the modifier functions with ","the value from the relative index from the target list. The modifiers are applied in the following form: ","<code>(modifier_function target_value)</code>.</p>","<p>If the modifer_list is shorter than the target list, the modifer_list index cycles back to 0 (modulus).</p>"],"tags":["map","list","array","apply","range","index"],"example":["=:quote",["=:apply_operator_list",["first","+"],["John","Smith"]]],"deprecated":true,"requires":["map","length"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("range_overlap?",async function(range_a,range_b) {
    return (((range_a && range_a["0"])<=(range_a && range_a["1"]))&& ((range_b && range_b["0"])<=(range_b && range_b["1"]))&& await (async function(){
        if (check_true (((((range_a && range_a["0"])<=(range_b && range_b["0"]))&& ((range_b && range_b["0"])<=(range_a && range_a["1"])))|| (((range_a && range_a["0"])>=(range_b && range_b["0"]))&& ((range_a && range_a["0"])<=(range_b && range_b["1"])))))){
            return true
        } else {
            return false
        }
    })())
},{ "name":"range_overlap?","fn_args":"(range_a range_b)","description":"Given two ranges in the form of [low_val high_val], returns true if they overlap, otherwise false.  The results are undefined if the range values are not ordered from low to high.","usage":["range_a:array","range_b:array"],"tags":["range","iteration","loop"],"requires":[],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("remaining_in_range",async function(value,check_range) {
    return await async function(){
        if (check_true (((value<=(check_range && check_range["1"]))&& (value>=(check_range && check_range["0"]))))) {
            return ((check_range && check_range["1"])- value)
        } else {
            return null
        }
    } ()
},{ "name":"remaining_in_range","fn_args":"(value check_range)","usage":["value:number","check_range:array"],"description":"Given a value, and an array containing a start and end value, returns the remaining amount of positions in the given range.  If the value isn't in range, the function will return nil.","tags":["range","iteration","loop"],"requires":[],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("form_id",async function(name) {
    return await (await Environment.get_global("replace"))(new RegExp("W","g"),"_",await (await Environment.get_global("replace"))(new RegExp("[+?':]","g"),"sssymss1",await (await Environment.get_global("replace"))("!","sexcs1",await (await Environment.get_global("replace"))("<","slts1",await (await Environment.get_global("replace"))(">","sgts1",(await (await Environment.get_global("split"))((name).toLowerCase()," ")).join("_"))))))
},{ "name":"form_id","fn_args":"(name)","usage":["name:string"],"description":"Given a standard string returns a compliant HTML ID suitable for forms.","requires":["replace","join","split","lowercase"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
{
     Environment.set_global("from_key",function(value,sep_ques_,ignore_ques_) {
        if (check_true ((value instanceof String || typeof value==='string'))){
            {
                if (check_true (ignore_ques_)){
                    return value;
                    
                };
                sep_ques_=(sep_ques_|| "_");
                return  ( Environment.get_global("dtext"))(( ( function() {
                    let __for_body__40=function(v) {
                        return (""+  ( function() {
                            {
                                 let __call_target__= v["charAt"].call(v,0), __call_method__="toUpperCase";
                                return  __call_target__[__call_method__]()
                            } 
                        })()+  v["slice"].call(v,1))
                    };
                    let __array__41=[],__elements__39=(value).split(sep_ques_);
                    let __BREAK__FLAG__=false;
                    for(let __iter__38 in __elements__39) {
                        __array__41.push( __for_body__40(__elements__39[__iter__38]));
                        if(__BREAK__FLAG__) {
                             __array__41.pop();
                            break;
                            
                        }
                    }return __array__41;
                     
                })()).join(" "))
            }
        } else {
            return value
        }
    },{ "name":"from_key","fn_args":"(value sep? ignore?)","usage":["value:string","separator?:string"],"description":["=:+","Takes a key formatted value such as \"last_name\" and returns a \"prettier\" string that contains spaces ","in place of the default separator, '_' and each word's first letter is capitalized. ","An optional separator argument can be provided to use an alternative separator token.<br>E.G. last_name becomes \"Last Name\"."],"tags":["string","split","key","hash","record","form","ui"],"requires":["is_string?","dtext","join","split_by"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
})
};
{
     Environment.set_global("from_key1",function(v) {
        return  ( Environment.get_global("from_key"))(v)
    },{ "name":"from_key1","fn_args":"(v)","description":"Useful for calling with map, since this function prevents the other values being passed as arguments by map from being passed to the from_key function.","tags":["map","function","key","pretty","ui","to_key"],"usage":["value:string"],"requires":["from_key"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
})
};
{
     Environment.set_global("to_key",function(value,sep_ques_,ignore_ques_) {
        if (check_true ((value instanceof String || typeof value==='string'))){
            {
                if (check_true (ignore_ques_)){
                    return value;
                    
                };
                sep_ques_="_";
                let tokens= ( function() {
                    let __for_body__45=function(v) {
                        return (""+ (v).toLowerCase())
                    };
                    let __array__46=[],__elements__44=(value).split(" ");
                    let __BREAK__FLAG__=false;
                    for(let __iter__43 in __elements__44) {
                        __array__46.push( __for_body__45(__elements__44[__iter__43]));
                        if(__BREAK__FLAG__) {
                             __array__46.pop();
                            break;
                            
                        }
                    }return __array__46;
                     
                })();
                ;
                let rv=(tokens).join(sep_ques_);
                ;
                return rv
            }
        } else {
            {
                return value
            }
        }
    },{ "name":"to_key","fn_args":"(value sep? ignore?)","usage":["value:string","separator?:string"],"description":["=:+","Takes a value such as \"Last Name\" and returns a string that has the spaces removed and the characters replaced ","by the default separator, '_'.  Each word is converted to lowercase characters as well.","An optional separator argument can be provided to use an alternative separator token.<br>E.G. \"Last Name\" becomes \"last_name\"."],"tags":["string","split","key","hash","record","form","ui"],"requires":["is_string?","lowercase","split_by","join"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
})
};
await Environment.set_global("is_date?",async function(x) {
    return (await (await Environment.get_global("sub_type"))(x)==="Date")
},{ "name":"is_date?","fn_args":"(x)","description":"for the given value x, returns true if x is a Date object.","usage":["arg:value"],"tags":["type","condition","subtype","value","what"],"requires":["sub_type"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("is_nil?",async function(value) {
    return (null===value)
},{ "name":"is_nil?","fn_args":"[\"value\"]","description":"for the given value x, returns true if x is exactly equal to nil.","usage":["arg:value"],"tags":["type","condition","subtype","value","what"],"requires":[],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
 Environment.set_global("is_object_or_function?",new Function(["obj"],"var type = typeof obj; return type === 'function' || type === 'object' && !!obj;"),{
    requires:[],externals:["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],source_name:"core-ext.lisp"
});
await Environment.set_global("extend",async function(target_object,source_object) {
    if (check_true (((target_object instanceof Object)&& (source_object instanceof Object)))){
        {
            await (async function() {
                let __for_body__49=async function(pset) {
                    return await async function(){
                        target_object[(pset && pset["0"])]=(pset && pset["1"]);
                        return target_object;
                        
                    }()
                };
                let __array__50=[],__elements__48=await (await Environment.get_global("pairs"))(source_object);
                let __BREAK__FLAG__=false;
                for(let __iter__47 in __elements__48) {
                    __array__50.push(await __for_body__49(__elements__48[__iter__47]));
                    if(__BREAK__FLAG__) {
                         __array__50.pop();
                        break;
                        
                    }
                }return __array__50;
                 
            })();
            return target_object
        }
    } else {
        return target_object
    }
},{ "name":"extend","fn_args":"(target_object source_object)","description":"Given a target object and a source object, add the keys and values of the source object to the target object.","usage":["target_object:object","source_object:object"],"tags":["object","extension","keys","add","values"],"requires":["is_object?","pairs"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("no_empties",async function(items) {
    let item_type=await (await Environment.get_global("sub_type"))(items);
    ;
    if (check_true (await (await Environment.get_global("not"))((item_type=="array")))){
        items=[items]
    };
    {
        let __collector;
        let __result;
        let __action;
        __collector=[];
        __result=null;
        __action=async function(value) {
            return await async function(){
                if (check_true ((null==value))) {
                    return false
                } else if (check_true ((""==value))) {
                    return false
                } else {
                    return value
                }
            } ()
        };
        ;
        await (async function() {
            let __for_body__54=async function(__item) {
                __result=await __action(__item);
                if (check_true (__result)){
                    return (__collector).push(__result)
                }
            };
            let __array__55=[],__elements__53=items;
            let __BREAK__FLAG__=false;
            for(let __iter__52 in __elements__53) {
                __array__55.push(await __for_body__54(__elements__53[__iter__52]));
                if(__BREAK__FLAG__) {
                     __array__55.pop();
                    break;
                    
                }
            }return __array__55;
             
        })();
        return __collector
    }
},{ "name":"no_empties","fn_args":"[\"items\"]","description":"Takes the passed list or set and returns a new list that doesn't contain any undefined, nil or empty values","usage":["items:list|set"],"tags":["filter","nil","undefined","remove","except_nil"],"requires":["sub_type","not","push"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("first_with",async function(prop_list,data_value) {
    let rval;
    let found;
    rval=null;
    found=false;
    await (async function() {
        let __for_body__58=async function(p) {
            rval=data_value[p];
            if (check_true (await (await Environment.get_global("not"))((null==rval)))){
                {
                    found=true;
                    return __BREAK__FLAG__=true;
                    return
                }
            }
        };
        let __array__59=[],__elements__57=prop_list;
        let __BREAK__FLAG__=false;
        for(let __iter__56 in __elements__57) {
            __array__59.push(await __for_body__58(__elements__57[__iter__56]));
            if(__BREAK__FLAG__) {
                 __array__59.pop();
                break;
                
            }
        }return __array__59;
         
    })();
    if (check_true (found)){
        return rval
    } else {
        return null
    }
},{ "name":"first_with","fn_args":"(prop_list data_value)","usage":["property_list:array","data:object|array"],"description":"Given a list of properties or indexes and a data value, sequentially looks through the property list and returns the first non-null result.","tags":["list","array","index","properties","search","find"],"requires":["not"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("fixed",async function(v,p) {
    if (check_true (p)){
        return await (async function() {
            {
                 let __call_target__=await parseFloat(v), __call_method__="toFixed";
                return await __call_target__[__call_method__].call(__call_target__,p)
            } 
        })()
    } else {
        return await (async function() {
            {
                 let __call_target__=await parseFloat(v), __call_method__="toFixed";
                return await __call_target__[__call_method__].call(__call_target__,3)
            } 
        })()
    }
},{ "name":"fixed","fn_args":"(v p)","description":"Given a floating point value and an optional precision value, return a string corresponding to the desired precision.  If precision is left out, defaults to 3.","usage":["value:number","precision?:number"],"tags":["format","conversion"],"requires":[],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("except_nil",async function(items) {
    let acc=[];
    ;
    if (check_true (await (await Environment.get_global("not"))((await (await Environment.get_global("sub_type"))(items)==="array")))){
        items=[items]
    };
    await (async function() {
        let __for_body__62=async function(value) {
            if (check_true (await (await Environment.get_global("not"))((null==value)))){
                return (acc).push(value)
            }
        };
        let __array__63=[],__elements__61=items;
        let __BREAK__FLAG__=false;
        for(let __iter__60 in __elements__61) {
            __array__63.push(await __for_body__62(__elements__61[__iter__60]));
            if(__BREAK__FLAG__) {
                 __array__63.pop();
                break;
                
            }
        }return __array__63;
         
    })();
    return acc
},{ "name":"except_nil","fn_args":"[\"items\"]","description":"Takes the passed list or set and returns a new list that doesn't contain any undefined or nil values.  Unlike no_empties, false values and blank strings will pass through.","usage":["items:list|set"],"tags":["filter","nil","undefined","remove","no_empties"],"requires":["not","sub_type","push"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("hide",async function(value) {
    return undefined
},{ "name":"hide","fn_args":"(value)","requires":[],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("array_to_object",async function(input_array) {
    let count;
    let output;
    let working_array;
    count=0;
    output=await (async function(){
         return await clone(new Object()) 
    })();
    working_array=await (async function(){
         return await clone(input_array) 
    })();
    await (async function(){
         let __test_condition__64=async function() {
            return (await (await Environment.get_global("length"))(working_array)>0)
        };
        let __body_ref__65=async function() {
            let v1=(working_array).shift();
            ;
            let v1t=await (async function(){
                 return await (await Environment.get_global("type"))(v1) 
            })();
            ;
            return await async function(){
                if (check_true ((v1t==="object"))) {
                    return output=await (await Environment.get_global("add"))(await (async function(){
                        let __array_op_rval__66=output;
                         if (__array_op_rval__66 instanceof Function){
                            return await __array_op_rval__66(v1) 
                        } else {
                            return [__array_op_rval__66,v1]
                        }
                    })())
                } else {
                    return await async function(){
                        output[v1]=(working_array).shift();
                        return output;
                        
                    }()
                }
            } ()
        };
        let __BREAK__FLAG__=false;
        while(await __test_condition__64()) {
             await __body_ref__65();
             if(__BREAK__FLAG__) {
                 break;
                
            }
        } ;
        
    })();
    return output
},{ "name":"array_to_object","fn_args":"(input_array)","usage":["list_to_process:array"],"tags":["list","array","object","convert"],"description":"Takes the provided list and returns an object with the even indexed items as keys and odd indexed items as values.","requires":["length","take","type","add"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("split_text_in_array",async function(split_element,input_array) {
    let output=[];
    ;
    await (async function() {
        let __for_body__70=async function(item) {
            return await async function(){
                if (check_true ((item instanceof String || typeof item==='string'))) {
                    return (output).push(await (await Environment.get_global("split"))(item,split_element))
                } else {
                    return (output).push(await (async function(){
                         return [null,item] 
                    })())
                }
            } ()
        };
        let __array__71=[],__elements__69=input_array;
        let __BREAK__FLAG__=false;
        for(let __iter__68 in __elements__69) {
            __array__71.push(await __for_body__70(__elements__69[__iter__68]));
            if(__BREAK__FLAG__) {
                 __array__71.pop();
                break;
                
            }
        }return __array__71;
         
    })();
    return output
},{ "name":"split_text_in_array","fn_args":"(split_element input_array)","usage":["split_element:text","input_array:array"],"tags":["text","string","split","separate","parse"],"description":"Takes the provided array, and split_element, and returns an array of arrays which contain the split text strings of the input list.","requires":["is_string?","push","split","null"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("words_and_quotes",async function(text) {
    if (check_true (await (await Environment.get_global("not"))((text==null)))){
        return await (await Environment.get_global("map"))(async function(x,i) {
            if (check_true ((0===(i% 2)))){
                return (await (await Environment.get_global("no_empties"))(((x).trim()).split(" "))).join(" ")
            } else {
                return x
            }
        },(text).split("\""))
    } else {
        return []
    }
},{ "name":"words_and_quotes","fn_args":"(text)","description":"Given a text string, separates the words and quoted words, returning quoted words as their isolated string.","tags":["text","string","split","separate","parse"],"usage":["text:string"],"requires":["not","map","join","no_empties","split_by","trim"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("split_words",async function(text_string) {
    return await (await Environment.get_global("no_empties"))(await (async function(){
         return await (await Environment.get_global("map"))(async function(x,i) {
            if (check_true ((0===(i% 2)))){
                return await (await Environment.get_global("no_empties"))(((x).trim()).split(" "))
            } else {
                return await (async function(){
                    let __array_op_rval__72=x;
                     if (__array_op_rval__72 instanceof Function){
                        return await __array_op_rval__72() 
                    } else {
                        return [__array_op_rval__72]
                    }
                })()
            }
        },await (await Environment.get_global("words_and_quotes"))(text_string)) 
    })())
},{ "name":"split_words","fn_args":"(text_string)","description":"Like words and quotes, splits the text string into words and quoted words, but the unquoted words are split by spaces.  Both the unquoted words and the quoted words inhabit their own array.","usage":["text:string"],"tags":["text","string","split","separate","words","parse"],"requires":["no_empties","map","split_by","trim","words_and_quotes"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("from_style_text",async function(text) {
    let semi_reg;
    let colon_reg;
    semi_reg=await RegExp(";\n ","g");
    colon_reg=await RegExp(": ","g");
    return await (await Environment.get_global("no_empties"))(await (async function(){
         return await (await Environment.get_global("map"))(async function(x) {
            return [((x && x["0"])).trim(),(x && x["1"])]
        },await (async function(){
             return await (await Environment.get_global("map"))(async function(v) {
                return (await (await Environment.get_global("replace"))(colon_reg,":",v)).split(":")
            },await (await Environment.get_global("flatten"))(await (async function(){
                 return await (await Environment.get_global("map"))(async function(v) {
                    return (await (await Environment.get_global("replace"))(semi_reg,";",v)).split(";")
                },await (await Environment.get_global("words_and_quotes"))(text)) 
            })())) 
        })()) 
    })())
},{ "name":"from_style_text","fn_args":"(text)","usage":["text:string"],"description":"Given a string or text in the format of an Element style attribute: \"css_attrib:value; css_attrib2:value\", split into pairs containing attribute name and value.","tags":["text","css","style","pairs","string","array","list","ui","html"],"requires":["no_empties","map","trim","split_by","replace","flatten","words_and_quotes"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("sha1",async function(text) {
    if (check_true ((text instanceof String || typeof text==='string'))){
        {
            let buffer;
            let hash;
            let hexcodes;
            let view;
            buffer=await (async function() {
                {
                     let __call_target__=new TextEncoder("utf-8"), __call_method__="encode";
                    return await __call_target__[__call_method__].call(__call_target__,text)
                } 
            })();
            hash=await crypto.subtle["digest"].call(crypto.subtle,"SHA-1",buffer);
            hexcodes=[];
            view=new DataView(hash);
            await (async function() {
                let __for_body__75=async function(i) {
                    return (hexcodes).push(await (async function() {
                        {
                             let __call_target__=await (async function() {
                                {
                                     let __call_target__=await view["getUint8"].call(view,i), __call_method__="toString";
                                    return await __call_target__[__call_method__].call(__call_target__,16)
                                } 
                            })(), __call_method__="padStart";
                            return await __call_target__[__call_method__].call(__call_target__,2,0)
                        } 
                    })())
                };
                let __array__76=[],__elements__74=await (await Environment.get_global("range"))((view && view["byteLength"]));
                let __BREAK__FLAG__=false;
                for(let __iter__73 in __elements__74) {
                    __array__76.push(await __for_body__75(__elements__74[__iter__73]));
                    if(__BREAK__FLAG__) {
                         __array__76.pop();
                        break;
                        
                    }
                }return __array__76;
                 
            })();
            return (hexcodes).join("")
        }
    } else {
        throw new TypeError(("sha1: requires a single string as an argument - got "+ await subtype(text)));
        
    }
},{ "name":"sha1","fn_args":"(text)","description":"Given a text string as input, returns a SHA-1 hash digest string of the given input.","usage":["text:string"],"tags":["digest","crypto","hash","comparison"],"requires":["is_string?","push","range","join"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("remove_if",async function(f,container) {
    let __collector;
    let __result;
    let __action;
    __collector=[];
    __result=null;
    __action=async function(v) {
        if (check_true (await (await Environment.get_global("not"))(await (async function(){
            let __array_op_rval__77=f;
             if (__array_op_rval__77 instanceof Function){
                return await __array_op_rval__77(v) 
            } else {
                return [__array_op_rval__77,v]
            }
        })()))){
            return v
        }
    };
    ;
    await (async function() {
        let __for_body__80=async function(__item) {
            __result=await __action(__item);
            if (check_true (__result)){
                return (__collector).push(__result)
            }
        };
        let __array__81=[],__elements__79=container;
        let __BREAK__FLAG__=false;
        for(let __iter__78 in __elements__79) {
            __array__81.push(await __for_body__80(__elements__79[__iter__78]));
            if(__BREAK__FLAG__) {
                 __array__81.pop();
                break;
                
            }
        }return __array__81;
         
    })();
    return __collector
},{ "name":"remove_if","fn_args":"(f container)","usage":["f:function","container:array"],"tags":["collections","reduce","filter","where","list","array","reduce"],"description":"Given a function with a single argument, if that function returns true, the value will excluded from the returned array.  Opposite of filter.","requires":["not","push"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("filter",async function(f,container) {
    let __collector;
    let __result;
    let __action;
    __collector=[];
    __result=null;
    __action=async function(v) {
        if (check_true (await (async function(){
            let __array_op_rval__82=f;
             if (__array_op_rval__82 instanceof Function){
                return await __array_op_rval__82(v) 
            } else {
                return [__array_op_rval__82,v]
            }
        })())){
            return v
        }
    };
    ;
    await (async function() {
        let __for_body__85=async function(__item) {
            __result=await __action(__item);
            if (check_true (__result)){
                return (__collector).push(__result)
            }
        };
        let __array__86=[],__elements__84=container;
        let __BREAK__FLAG__=false;
        for(let __iter__83 in __elements__84) {
            __array__86.push(await __for_body__85(__elements__84[__iter__83]));
            if(__BREAK__FLAG__) {
                 __array__86.pop();
                break;
                
            }
        }return __array__86;
         
    })();
    return __collector
},{ "name":"filter","fn_args":"(f container)","usage":["f:function","container:array"],"tags":["collections","reduce","reject","where","list","array","reduce"],"description":"Given a function with a single argument, if that function returns true, the value will included in the returned array, otherwise it will not.  Opposite of reject.","requires":["push"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("max_value",async function(v) {
    let m;
    m=0;
    if (check_true (await (await Environment.get_global("not"))((await (await Environment.get_global("sub_type"))(v)==="array")))){
        throw new TypeError("argument is not an array");
        
    };
    await (async function() {
        let __for_body__89=async function(x) {
            if (check_true (await (await Environment.get_global("not"))(await isNaN(x)))){
                return m=await Math.max(x,m)
            }
        };
        let __array__90=[],__elements__88=v;
        let __BREAK__FLAG__=false;
        for(let __iter__87 in __elements__88) {
            __array__90.push(await __for_body__89(__elements__88[__iter__87]));
            if(__BREAK__FLAG__) {
                 __array__90.pop();
                break;
                
            }
        }return __array__90;
         
    })();
    return m
},{ "name":"max_value","fn_args":"(v)","usage":["values:list"],"description":"Given an array of numbers, returns the largest value found.  Any non-numbers in the array are ignored.  If there are no numbers in the list, 0 is returned.","requires":["not","sub_type"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("min_value",async function(v) {
    let m;
    m=(await Environment.get_global("MAX_SAFE_INTEGER"));
    if (check_true (await (await Environment.get_global("not"))((await (await Environment.get_global("sub_type"))(v)==="array")))){
        throw new TypeError("argument is not an array");
        
    };
    await (async function() {
        let __for_body__93=async function(x) {
            if (check_true (await (await Environment.get_global("not"))(await isNaN(x)))){
                return m=await Math.min(x,m)
            }
        };
        let __array__94=[],__elements__92=v;
        let __BREAK__FLAG__=false;
        for(let __iter__91 in __elements__92) {
            __array__94.push(await __for_body__93(__elements__92[__iter__91]));
            if(__BREAK__FLAG__) {
                 __array__94.pop();
                break;
                
            }
        }return __array__94;
         
    })();
    if (check_true ((m===(await Environment.get_global("MAX_SAFE_INTEGER"))))){
        return 0
    } else {
        return m
    }
},{ "name":"min_value","fn_args":"(v)","usage":["values:list"],"description":"Given an array of numbers, returns the smallest value found.  Any non-numbers in the array are ignored.  If there are no numbers in the list, 0 is returned.","requires":["MAX_SAFE_INTEGER","not","sub_type"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("add_days",async function(date_obj,num_days) {
    await date_obj["setDate"].call(date_obj,await (await Environment.get_global("add"))(await date_obj["getDate"](),num_days));
    return date_obj
},{ "name":"add_days","fn_args":"(date_obj num_days)","usage":["date_obj:Date","num_days:number"],"description":"Given a date object and the number of days (either positive or negative) modifies the given date object to the appropriate date value, and returns the date object.","tags":["date","time","duration","days","add"],"requires":["add"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("day_of_week",async function(dval) {
    return await dval["getDay"]()
},{ "name":"day_of_week","fn_args":"(dval)","description":"Given a date object, returns the day of the week for that date object","usage":["date:Date"],"tags":["time","week","date","day"],"requires":[],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("add_hours",async function(date_obj,hours) {
    await date_obj["setHours"].call(date_obj,hours);
    return date_obj
},{ "name":"add_hours","fn_args":"(date_obj hours)","usage":["date_obj:Date","hours:number"],"description":"Given a date object and the number of hours (either positive or negative) modifies the given date object to the appropriate date value, and returns the date object.","tags":["date","time","duration","hours","add"],"requires":[],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("clear_time",async function(date_obj) {
    await date_obj["setHours"].call(date_obj,0,0,0,0);
    return date_obj
},{ "name":"clear_time","fn_args":"(date_obj)","usage":["date_obj:Date"],"description":"Given a date object, modifies the date object by clearing the time value and leaving the date value.  Returns the date object.","tags":["date","time","duration","midnight","add"],"requires":[],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("yesterday",async function() {
    let d1;
    let d2;
    d1=new Date();
    d2=new Date();
    return [await (await Environment.get_global("clear_time"))(await (await Environment.get_global("add_days"))(d1,-1)),await (await Environment.get_global("add_hours"))(await (await Environment.get_global("clear_time"))(await (await Environment.get_global("add_days"))(d2,-1)),24)]
},{ "name":"yesterday","fn_args":"[]","description":"This function returns an array with two Date values.  The first, in index 0, is the start of the prior day (yesterday midnight), and the second is 24 hours later, i.e. midnight from last night.","usage":[],"tags":["time","date","range","prior","hours","24"],"requires":["clear_time","add_days","add_hours"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("next_sunday",async function(dval) {
    let dv=(dval|| new Date());
    ;
    return await (await Environment.get_global("clear_time"))(await (await Environment.get_global("add_days"))(dv,(7- await (await Environment.get_global("day_of_week"))(dv))))
},{ "name":"next_sunday","fn_args":"(dval)","usage":["date:Date?"],"description":"Called with no arguments returns a date representing the upcoming sunday at midnight, 12:00 AM.  If given a date, returns the next sunday from the given date.","tags":["time","date","range","next","week","24"],"requires":["clear_time","add_days","day_of_week"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("last_sunday",async function(dval) {
    let dv=(dval|| new Date());
    ;
    return await (await Environment.get_global("clear_time"))(await (await Environment.get_global("add_days"))(dv,(-1* await (await Environment.get_global("day_of_week"))(dv))))
},{ "name":"last_sunday","fn_args":"(dval)","usage":["date:Date?"],"description":"Called with no arguments returns a date representing the prior sunday at midnight, 12:00 AM.  If given a date, returns the prior sunday from the given date.","tags":["time","date","range","prior","week","24"],"requires":["clear_time","add_days","day_of_week"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("day_before_yesterday",async function() {
    let d1;
    let d2;
    d1=await (await Environment.get_global("clear_time"))(await (await Environment.get_global("add_days"))(new Date(),-2));
    d2=await (await Environment.get_global("clear_time"))(await (await Environment.get_global("add_days"))(new Date(),-1));
    return await (async function(){
        let __array_op_rval__95=d1;
         if (__array_op_rval__95 instanceof Function){
            return await __array_op_rval__95(d2) 
        } else {
            return [__array_op_rval__95,d2]
        }
    })()
},{ "name":"day_before_yesterday","fn_args":"[]","description":"This function returns an array with two Date values.  The first, in index 0, is the start of the day before yesterday (midnight), and the second is 24 later.","usage":[],"tags":["time","date","range","prior","hours","24"],"requires":["clear_time","add_days"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("last_week",async function() {
    let d1;
    let d2;
    d1=new Date();
    d2=new Date();
    return [await (await Environment.get_global("clear_time"))(await (await Environment.get_global("add_days"))(await (await Environment.get_global("next_sunday"))(),-14)),await (await Environment.get_global("last_sunday"))()]
},{ "name":"last_week","fn_args":"[]","description":"This function returns an array with two Date values.  The first, in index 0, is the start of the prior week at midnight, and the second is 7 days later, at midnight.","usage":[],"tags":["time","date","range","prior","hours","24"],"requires":["clear_time","add_days","next_sunday","last_sunday"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("midnight-to-midnight",async function(dval) {
    let d1;
    let d2;
    d1=await (await Environment.get_global("clear_time"))(new Date(dval));
    d2=await (await Environment.get_global("clear_time"))(new Date(dval));
    return await (async function(){
        let __array_op_rval__96=d1;
         if (__array_op_rval__96 instanceof Function){
            return await __array_op_rval__96(await (await Environment.get_global("add_hours"))(d2,24)) 
        } else {
            return [__array_op_rval__96,await (await Environment.get_global("add_hours"))(d2,24)]
        }
    })()
},{ "name":"midnight-to-midnight","fn_args":"(dval)","description":"This function returns an array with two Date values.  The first, in index 0, is the start of the prior day (yesterday midnight), and the second is 24 hours later, i.e. midnight from last night.","usage":["val:Date"],"tags":["time","date","range","prior","hours","24"],"requires":["clear_time","add_hours"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("date_to_string",async function(date_val,str_layout) {
    let split_regex;
    let comps;
    let t_flag;
    let construction;
    let t_sep;
    let acc;
    let date_comps;
    let formatter;
    let add_formatter;
    let format_desc;
    split_regex=new RegExp("([\.:\ T/, \-]+)","g");
    comps=(((str_layout instanceof String || typeof str_layout==='string')&& (str_layout).split(split_regex))|| []);
    t_flag=null;
    construction=[];
    t_sep=null;
    acc=[];
    date_comps=null;
    formatter=null;
    add_formatter=async function(key,value) {
        await async function(){
            if (check_true ((key==="fractionalSecondDigits"))) {
                return (construction).push("fractionalSecond")
            } else if (check_true ((key==="hour24"))) {
                {
                    (construction).push("hour");
                    await async function(){
                        format_desc["hourCycle"]="h24";
                        return format_desc;
                        
                    }();
                    key="hour"
                }
            } else {
                (construction).push(key)
            }
        } ();
        return await async function(){
            format_desc[key]=value;
            return format_desc;
            
        }()
    };
    format_desc=new Object();
    await (async function() {
        let __for_body__101=async function(c) {
            return await async function(){
                if (check_true ((c==="yyyy"))) {
                    return await add_formatter("year","numeric")
                } else if (check_true ((c==="yy"))) {
                    return await add_formatter("year","2-digit")
                } else if (check_true ((c==="dd"))) {
                    return await add_formatter("day","2-digit")
                } else if (check_true ((c==="d"))) {
                    return await add_formatter("day","numeric")
                } else if (check_true ((c==="MM"))) {
                    return await add_formatter("month","2-digit")
                } else if (check_true ((c==="M"))) {
                    return await add_formatter("month","numeric")
                } else if (check_true ((c==="HH"))) {
                    return await add_formatter("hour24","2-digit")
                } else if (check_true ((c==="H"))) {
                    return await add_formatter("hour24","numeric")
                } else if (check_true ((c==="h"))) {
                    return await add_formatter("hour","2-digit")
                } else if (check_true ((c==="h"))) {
                    return await add_formatter("hour","numeric")
                } else if (check_true ((c==="mm"))) {
                    return await add_formatter("minute","2-digit")
                } else if (check_true ((c==="m"))) {
                    return await add_formatter("minute","numeric")
                } else if (check_true ((c==="s"))) {
                    return await add_formatter("second","numeric")
                } else if (check_true ((c==="ss"))) {
                    return await add_formatter("second","2-digit")
                } else if (check_true ((c==="sss"))) {
                    return await add_formatter("fractionalSecondDigits",3)
                } else if (check_true ((c==="TZ"))) {
                    return await add_formatter("timeZoneName","short")
                } else if (check_true ((c==="D"))) {
                    return await add_formatter("weekday","narrow")
                } else if (check_true ((c==="DD"))) {
                    return await add_formatter("weekday","short")
                } else if (check_true ((c==="DDD"))) {
                    return await add_formatter("weekday","long")
                } else {
                    return (construction).push(c)
                }
            } ()
        };
        let __array__102=[],__elements__100=comps;
        let __BREAK__FLAG__=false;
        for(let __iter__99 in __elements__100) {
            __array__102.push(await __for_body__101(__elements__100[__iter__99]));
            if(__BREAK__FLAG__) {
                 __array__102.pop();
                break;
                
            }
        }return __array__102;
         
    })();
    formatter=new Intl.DateTimeFormat([],format_desc);
    date_comps=await (async function(){
         return await (await Environment.get_global("date_components"))(date_val,formatter) 
    })();
    return (await (async function() {
        let __for_body__105=async function(key) {
            return (date_comps[key]|| key)
        };
        let __array__106=[],__elements__104=construction;
        let __BREAK__FLAG__=false;
        for(let __iter__103 in __elements__104) {
            __array__106.push(await __for_body__105(__elements__104[__iter__103]));
            if(__BREAK__FLAG__) {
                 __array__106.pop();
                break;
                
            }
        }return __array__106;
         
    })()).join("")
},{ "name":"date_to_string","fn_args":"(date_val str_layout)","description":["=:+","Given a date value and a formatted template string, return a string representation of the date based on the formatted template string.","<br>","E.g. (date_to_string (new Date) \"yyyy-MM-dd HH:mm:ss\")<br>","<table>","<tr><td>","yyyy","</td><td>","Four position formatted year, e.g. 2021","</td></tr>","<tr><td>","yy","</td><td>","Two position formatted year, e.g. 21","</td></tr>","<tr><td>","dd","</td><td>","Two position formatted day of month, e.g. 03","</td></tr>","<tr><td>","d","</td><td>","1 position numeric day of month, e.g. 3","</td></tr>","<tr><td>","MM","</td><td>","Two position formatted month number, e.g. 06","</td></tr>","<tr><td>","M","</td><td>","One or two position formatted month number, e.g. 6 or 10","</td></tr>","<tr><td>","HH","</td><td>","Two position formatted 24 hour number, e.g. 08","</td></tr>","<tr><td>","H","</td><td>","One position formatted 24 hour, e.g 8","</td></tr>","<tr><td>","hh","</td><td>","Two position formatted 12 hour clock, e.g. 08","</td></tr>","<tr><td>","h","</td><td>","One position formatted 12 hour clock, e.g 8","</td></tr>","<tr><td>","mm","</td><td>","Minutes with 2 position width, eg. 05","</td></tr>","<tr><td>","m","</td><td>","Minutes with 1 or 2 positions, e.g 5 or 15.","</td></tr>","<tr><td>","ss","</td><td>","Seconds with 2 positions, e.g 03 or 25.","</td></tr>","<tr><td>","s","</td><td>","Seconds with 1 or 2 positions, e.g 3 or 25.","</td></tr>","<tr><td>","sss","</td><td>","Milliseconds with 3 digits, such as 092 or 562.","</td></tr>","<tr><td>","TZ","</td><td>","Include timezone abbreviated, e.g. GMT+1.","</td></tr>","<tr><td>","D","</td><td>","Weekday abbreviated to 1 position, such as T for Tuesday or Thursday, or W for Wednesday (in certain locales)","</td></tr>","<tr><td>","DD","</td><td>","Weekday shortened to 3 positions, such as Fri for Friday.","</td></tr>","<tr><td>","DDD","</td><td>","Full name of weekday, such as Saturday.","</td></tr>","</table>"],"usage":["date_val:Date","formatted_string:string"],"tags":["time","date","string","text","format","formatted"],"requires":["is_string?","split_by","push","date_components","join"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("is_even?",async function(x) {
    return (0===(x% 2))
},{ "name":"is_even?","fn_args":"(x)","usage":["value:number"],"description":"If the argument passed is an even number, return true, else returns false.","tags":["list","filter","modulus","odd","number"],"requires":[],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("is_odd?",async function(x) {
    return (1===(x% 2))
},{ "name":"is_odd?","fn_args":"(x)","usage":["value:number"],"description":"If the argument passed is an odd number, return true, else returns false.","tags":["list","filter","modulus","even","number"],"requires":[],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("set_path_value",async function(root,path,value) {
    if (check_true ((path instanceof Array))){
        {
            let idx;
            let parent;
            idx=await (await Environment.get_global("last"))(path);
            parent=await (await Environment.get_global("resolve_path"))(await (await Environment.get_global("chop"))(path),root);
            if (check_true (parent)){
                await async function(){
                    parent[idx]=value;
                    return parent;
                    
                }()
            };
            return parent
        }
    } else {
        {
            return root
        }
    }
},{ "name":"set_path_value","fn_args":"(root path value)","description":"Given an object (the root), a path array, and a value to set, sets the value at the path point in the root object.","usage":["root:object","path:list","value:*"],"tags":["object","path","resolve","assign"],"requires":["is_array?","last","resolve_path","chop"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("has_items?",async function(value) {
    if (check_true ((await (await Environment.get_global("not"))((null===value))&& (await (await Environment.get_global("length"))(value)>0)))){
        return true
    } else {
        return false
    }
},{ "name":"has_items?","fn_args":"(value)","usage":["value:list"],"description":"Returns true if the list provided has a length greater than one, or false if the list is 0 or nil","tags":["list","values","contains"],"requires":["not","length"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
 Environment.set_global("match_all_js",new Function("regex_str","search_string","let rval=[];let regex=new RegExp(regex_str,'g'); while ((m = regex.exec(search_string)) !== null) {rval.push(m);  if (m.index === regex.lastIndex) {  regex.lastIndex++; }  } return rval;"),{
    requires:[],externals:["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],source_name:"core-ext.lisp"
});
await Environment.set_global("match_all",async function(regex_str,search_string) {
    return await (await Environment.get_global("match_all_js"))(regex_str,search_string)
},{ "name":"match_all","fn_args":"(regex_str search_string)","usage":["regex_str:string","search_string:string"],"description":"Given a regex expression as a string, and the string to search through, returns all matched items via matchAll.","tags":["match","regex","string","find","scan"],"requires":["match_all_js"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
{
     Environment.set_global("chop_front",function(container,amount) {
        amount=(amount|| 1);
        return   (function(){
            if (check_true ((container instanceof String || typeof container==='string'))) {
                return  container["substr"].call(container,amount)
            } else if (check_true ((container instanceof Array))) {
                return  container["slice"].call(container,amount)
            } else {
                throw new Error("chop: container must be a string or array");
                
            }
        } )()
    },{ "name":"chop_front","fn_args":"(container amount)","usage":["container:array|string","amount:integer"],"mutates":false,"tags":["text","string","list","reduce"],"description":"Given a string or array, returns a new container with the first value removed from the provided container.  An optional amount can be provided to remove more than one value from the container.","requires":["is_string?","is_array?"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
})
};
[];
await Environment.set_global("compile_lisp",async function(text) {
    if (check_true (text)){
        return await (await Environment.get_global("reader"))(text)
    } else {
        return text
    }
},{ "name":"compile_lisp","fn_args":"(text)","usage":["text:string"],"description":"Given an input string of lisp text, returns a JSON structure ready for evaluation.","requires":["reader"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("has_the_keys?",async function(key_list,obj) {
    let is_fit;
    is_fit=true;
    {
        await (async function() {
            let __for_body__110=async function(item) {
                return is_fit=((await (await Environment.get_global("resolve_path"))(item,obj)|| false)&& is_fit)
            };
            let __array__111=[],__elements__109=key_list;
            let __BREAK__FLAG__=false;
            for(let __iter__108 in __elements__109) {
                __array__111.push(await __for_body__110(__elements__109[__iter__108]));
                if(__BREAK__FLAG__) {
                     __array__111.pop();
                    break;
                    
                }
            }return __array__111;
             
        })();
        return is_fit
    }
},{ "name":"has_the_keys?","fn_args":"(key_list obj)","usage":["key_list:list","object_to_check:object"],"description":"Given a provided key_list, validate that each listed key or dotted-path-notation value exist in the object.","example":[[["=:quotem",["=:has_the_keys?",["type","values.sub_transaction_id"],{ "type":"Transaction","group":"Receivables","values":{ "sub_transaction_id":1242424
}
}]],true]],"requires":["resolve_path"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("demarked_number",async function(value,separator,precision,no_show_sign) {
    let abs_value;
    let vf;
    let comps;
    let l;
    let sep;
    let prec;
    let sign;
    abs_value=await Math.abs(value);
    vf=await Math.floor(abs_value);
    comps=(await (await Environment.get_global("split"))((""+ vf),"")).slice(0).reverse();
    l=await (await Environment.get_global("length"))(comps);
    sep=(separator|| ",");
    prec=(await (async function(){
        if (check_true ((null==precision))){
            return 2
        }
    })()|| precision);
    sign=await (async function(){
        if (check_true (((value<0)&& await (await Environment.get_global("not"))(no_show_sign)))){
            return "-"
        } else {
            return ""
        }
    })();
    if (check_true ((l>3))){
        await (async function() {
            let __for_body__114=async function(p) {
                return await comps["splice"].call(comps,p,0,sep)
            };
            let __array__115=[],__elements__113=(await (await Environment.get_global("range"))(3,l,3)).slice(0).reverse();
            let __BREAK__FLAG__=false;
            for(let __iter__112 in __elements__113) {
                __array__115.push(await __for_body__114(__elements__113[__iter__112]));
                if(__BREAK__FLAG__) {
                     __array__115.pop();
                    break;
                    
                }
            }return __array__115;
             
        })()
    };
    return (sign+ ((comps).slice(0).reverse()).join("")+ await (await Environment.get_global("chop_front"))(await (async function() {
        {
             let __call_target__=(abs_value% vf), __call_method__="toFixed";
            return await __call_target__[__call_method__].call(__call_target__,prec)
        } 
    })()))
},{ "name":"demarked_number","fn_args":"(value separator precision no_show_sign)","usage":["value:number","separator:string","precision:number","no_show_sign:boolean"],"description":["=:+","Given a numeric value, a separator string, such as \",\" and a precision value ","for the fractional-part or mantissa of the value, the demarked_number function will return a string with a formatted value. ","Default value for precision is 2 if not provided.","If no_show_sign is true, there will be no negative sign returned, which can be useful for alternative formatting.  See compile_format."],"tags":["format","conversion","currency"],"requires":["reverse","split","length","not","range","join","chop_front"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("measure_time",async function(...args) {
    let forms;
    forms=await (await Environment.get_global("slice"))(args,0);
    return ["=:let",[["=:end","=:nil"],["=:rval","=:nil"],["=:start",["=:time_in_millis"]]],["=:=","=:rval",["=:do",].concat(forms)],{ "time":["=:-",["=:time_in_millis"],"=:start"],"result":"=:rval"
}]
},{ "eval_when":{ "compile_time":true
},"name":"measure_time","macro":true,"fn_args":"[\"&\" forms]","usage":["form:list"],"tags":["time","measurement","debug","timing"],"description":"Given a form as input, returns an object containing time taken to evaluate the form in milliseconds with the key time and a result key with the evaluation results.","requires":["slice"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("compare_list_ends",async function(l1,l2) {
    let long_short;
    let long;
    let short;
    let match_count;
    let idx;
    let matcher;
    long_short=await (async function(){
        if (check_true ((await (await Environment.get_global("length"))(l1)>await (await Environment.get_global("length"))(l2)))){
            return [l1,l2]
        } else {
            return [l2,l1]
        }
    })();
    long=((long_short && long_short["0"])).slice(0).reverse();
    short=((long_short && long_short["1"])).slice(0).reverse();
    match_count=0;
    idx=0;
    matcher=async function(val) {
        if (check_true ((val===long[idx]))){
            match_count+=1
        };
        return idx=(idx+ 1)
    };
    await (await Environment.get_global("map"))(matcher,short);
    if (check_true ((match_count===await (await Environment.get_global("length"))(short)))){
        return true
    } else {
        return false
    }
},{ "name":"compare_list_ends","fn_args":"(l1 l2)","usage":["array1:array","array2:array"],"tags":["comparision","values","list","array"],"description":"Compares the ends of the provided flat arrays, where the shortest list must match completely the tail end of the longer list. Returns true if the comparison matches, false if they don't.","requires":["length","reverse","map"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
 Environment.set_global("hsv_to_rgb",new Function("h","s","v","{\n        var r, g, b, i, f, p, q, t;\n        if (arguments.length === 1) {\n            s = h.s, v = h.v, h = h.h;\n        }\n        i = Math.floor(h * 6);\n        f = h * 6 - i;\n        p = v * (1 - s);\n        q = v * (1 - f * s);\n        t = v * (1 - (1 - f) * s);\n        switch (i % 6) {\n            case 0: r = v, g = t, b = p; break;\n            case 1: r = q, g = v, b = p; break;\n            case 2: r = p, g = v, b = t; break;\n            case 3: r = p, g = q, b = v; break;\n            case 4: r = t, g = p, b = v; break;\n            case 5: r = v, g = p, b = q; break;\n        }\n        return {\n            r: r,\n            g: g,\n            b: b\n        }\n    }"),{
    usage:["hsv_values:array"],description:("Takes an array with three values corresponding to hue, saturation and brightness. "+ "Each value should be between 0 and 1.  "+ "The function returns an array with three values corresponding to red, green and blue."),tags:["colors","graphics","rgb","conversion"],requires:["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],source_name:"core-ext.lisp"
});
await Environment.set_global("rgb_to_text",async function(rgb) {
    return (await (async function() {
        let __for_body__118=async function(v) {
            let vs=await (async function() {
                {
                     let __call_target__=await Math.round((v* 255)), __call_method__="toString";
                    return await __call_target__[__call_method__].call(__call_target__,16)
                } 
            })();
            ;
            if (check_true ((await (await Environment.get_global("length"))(vs)===1))){
                return ("0"+ vs)
            } else {
                return vs
            }
        };
        let __array__119=[],__elements__117=rgb;
        let __BREAK__FLAG__=false;
        for(let __iter__116 in __elements__117) {
            __array__119.push(await __for_body__118(__elements__117[__iter__116]));
            if(__BREAK__FLAG__) {
                 __array__119.pop();
                break;
                
            }
        }return __array__119;
         
    })()).join("")
},{ "name":"rgb_to_text","fn_args":"(rgb)","usage":["rgb_values:array"],"description":["=:+","Given an array with 3 values ranging from 0 to 1, corresponding to the \"red\",\"green\",\"blue\" values of the described color, ","the function returns a string in the form of FFFFFF."],"tags":["colors","graphics"],"requires":["join","length"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("text_to_rgb",async function(rgb_string) {
    if (check_true (rgb_string)){
        return await (async function(){
            let __array_op_rval__120=(await parseInt((await (async function(){
                 return await (await Environment.get_global("nth"))([0,1],rgb_string) 
            })()).join(''),16)/ 255);
             if (__array_op_rval__120 instanceof Function){
                return await __array_op_rval__120((await parseInt((await (async function(){
                     return await (await Environment.get_global("nth"))([2,3],rgb_string) 
                })()).join(''),16)/ 255),(await parseInt((await (async function(){
                     return await (await Environment.get_global("nth"))([4,5],rgb_string) 
                })()).join(''),16)/ 255)) 
            } else {
                return [__array_op_rval__120,(await parseInt((await (async function(){
                     return await (await Environment.get_global("nth"))([2,3],rgb_string) 
                })()).join(''),16)/ 255),(await parseInt((await (async function(){
                     return await (await Environment.get_global("nth"))([4,5],rgb_string) 
                })()).join(''),16)/ 255)]
            }
        })()
    } else {
        return null
    }
},{ "name":"text_to_rgb","fn_args":"(rgb_string)","usage":["rgb_string:string"],"description":"Given an RGB hex color string in the form of \"FFFFFF\", returns an array containing [ red green blue ] in the set [ 0 1 ].","tags":["colors","graphics"],"requires":["join","nth"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("rgb_to_hsv",async function(rgb) {
    if (check_true (rgb)){
        {
            let computedH;
            let computedS;
            let computedV;
            let r;
            let g;
            let b;
            let minRGB;
            let maxRGB;
            let d;
            let h;
            computedH=0;
            computedS=0;
            computedV=0;
            r=(rgb && rgb["0"]);
            g=(rgb && rgb["1"]);
            b=(rgb && rgb["2"]);
            minRGB=await Math.min(r,await Math.min(g,b));
            maxRGB=await Math.max(r,await Math.max(g,b));
            d=null;
            h=null;
            if (check_true ((minRGB===maxRGB))){
                return [0,0,minRGB];
                
            };
            d=await (async function(){
                 return await async function(){
                    if (check_true ((r===minRGB))) {
                        return (g- b)
                    } else if (check_true ((b===minRGB))) {
                        return (r- g)
                    } else {
                        return (b- r)
                    }
                } () 
            })();
            h=await (async function(){
                 return await async function(){
                    if (check_true ((r===minRGB))) {
                        return 3
                    } else if (check_true ((b===minRGB))) {
                        return 1
                    } else {
                        return 5
                    }
                } () 
            })();
            await console.log("");
            computedH=((60* (h- (d/ (maxRGB- minRGB))))/ 360);
            computedS=((maxRGB- minRGB)/ maxRGB);
            computedV=maxRGB;
            return await (async function(){
                let __array_op_rval__122=computedH;
                 if (__array_op_rval__122 instanceof Function){
                    return await __array_op_rval__122(computedS,computedV) 
                } else {
                    return [__array_op_rval__122,computedS,computedV]
                }
            })()
        }
    }
},{ "name":"rgb_to_hsv","fn_args":"(rgb)","description":["=:+","Takes an array with three values corresponding to red, green and blue: [red green blue].","Each value should be between 0 and 1 (i.e the set [0 1]) ","The function returns an array with three values corresponding to [hue saturation value] in the set [0 1]."],"usage":["rgb_values:array"],"tags":["colors","graphics","rgb","conversion","hsv"],"requires":[],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("tint_rgb",async function(rgb,tint_factor) {
    if (check_true ((rgb&& tint_factor))){
        return await (async function() {
            let __for_body__125=async function(c) {
                c=(255* c);
                return (await (await Environment.get_global("add"))(c,((255- c)* tint_factor))/ 255)
            };
            let __array__126=[],__elements__124=rgb;
            let __BREAK__FLAG__=false;
            for(let __iter__123 in __elements__124) {
                __array__126.push(await __for_body__125(__elements__124[__iter__123]));
                if(__BREAK__FLAG__) {
                     __array__126.pop();
                    break;
                    
                }
            }return __array__126;
             
        })()
    } else {
        return rgb
    }
},{ "name":"tint_rgb","fn_args":"(rgb tint_factor)","description":["=:+","Given an array containing three values between 0 and 1 corresponding to red, ","green and blue, apply the provided tint factor to the color and return the result as an rgb array.","The provided tint factor should be in the range 0 (for no tint) to 1 (full tint)."],"usage":["rgb_value:array","tint_factor:number"],"tags":["colors","graphics"],"requires":["add"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("shade_rgb",async function(rgb,shade_factor) {
    if (check_true ((rgb&& shade_factor))){
        return await (async function() {
            let __for_body__129=async function(c) {
                c=(255* c);
                return ((c* (1- shade_factor))/ 255)
            };
            let __array__130=[],__elements__128=rgb;
            let __BREAK__FLAG__=false;
            for(let __iter__127 in __elements__128) {
                __array__130.push(await __for_body__129(__elements__128[__iter__127]));
                if(__BREAK__FLAG__) {
                     __array__130.pop();
                    break;
                    
                }
            }return __array__130;
             
        })()
    } else {
        return rgb
    }
},{ "name":"shade_rgb","fn_args":"(rgb shade_factor)","description":["=:+","Given an array containing three values between 0 and 1 corresponding to red, ","green and blue, apply the provided tint factor to the color and return the result as an rgb array.","The provided tint factor should be in the range 0 (for no tint) to 1 (full tint)."],"usage":["rgb_value:array","tint_factor:number"],"tags":["colors","graphics"],"requires":[],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("modify_color_ts",async function(rgb,factor) {
    if (check_true ((0<=factor))){
        return await (await Environment.get_global("tint_rgb"))(rgb,await Math.abs(factor))
    } else {
        return await (await Environment.get_global("shade_rgb"))(rgb,await Math.abs(factor))
    }
},{ "name":"modify_color_ts","fn_args":"(rgb factor)","description":["=:+","Given an array containing three values between 0 and 1 corresponding to red, ","green and blue, apply the provided factor to the color and return the result as an rgb array.","The provided factor should be in the range -1 to 1: -1 to 0 applies shade to the color and 0 to 1 applies tinting to the color."],"usage":["rgb_value:array","tint_factor:number"],"tags":["colors","graphics"],"requires":["tint_rgb","shade_rgb"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("is_lower?",async function(v) {
    let c=await v["charCodeAt"].call(v,0);
    ;
    return ((c>96)&& (c<123))
},{ "name":"is_lower?","fn_args":"(v)","usage":["value:string"],"description":"Given a string as an argument, returns true if the first character of the string is a lowercase character value (ASCII), and false otherwise.","tags":["text","string","lowercase","uppercase"],"requires":[],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("is_upper?",async function(v) {
    let c=await v["charCodeAt"].call(v,0);
    ;
    return ((c>64)&& (c<91))
},{ "name":"is_upper?","fn_args":"(v)","usage":["value:string"],"description":"Given a string as an argument, returns true if the first character of the string is an uppercase character value (ASCII), and false otherwise.","tags":["text","string","lowercase","uppercase"],"requires":[],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("camel_case_to_lower",async function(val) {
    let last_upper=0;
    ;
    return (await (async function(){
         return await (await Environment.get_global("map"))(async function(v,i) {
            return await async function(){
                if (check_true (((i>0)&& await (await Environment.get_global("is_upper?"))(v)&& (0===last_upper)))) {
                    {
                        last_upper=1;
                        return ("_"+ (v).toLowerCase())
                    }
                } else if (check_true (((i>0)&& await (await Environment.get_global("is_upper?"))(v)&& (last_upper>0)))) {
                    {
                        last_upper=2;
                        return (v).toLowerCase()
                    }
                } else if (check_true (((i===0)&& await (await Environment.get_global("is_upper?"))(v)))) {
                    return (v).toLowerCase()
                } else if (check_true (await (await Environment.get_global("is_lower?"))(v))) {
                    {
                        return await async function(){
                            if (check_true ((last_upper===2))) {
                                {
                                    last_upper=0;
                                    return ("_"+ (v).toLowerCase())
                                }
                            } else {
                                {
                                    last_upper=0;
                                    return (v).toLowerCase()
                                }
                            }
                        } ()
                    }
                } else {
                    {
                        last_upper=0;
                        return v
                    }
                }
            } ()
        },await (await Environment.get_global("split"))(val,"")) 
    })()).join("")
},{ "name":"camel_case_to_lower","fn_args":"(val)","usage":[],"description":"Given a camel case string such as camelCase, returns the equivalent lowercase/underscore: camel_case.","tags":["text","string","conversion","lowercase","uppercase"],"requires":["join","map","is_upper?","lowercase","is_lower?","split"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("scan_list",async function(regex,container) {
    let expr=regex;
    ;
    if (check_true (await (await Environment.get_global("not"))((await (await Environment.get_global("sub_type"))(regex)==="RegExp")))){
        {
            expr=new RegExp(regex)
        }
    };
    let cnt=0;
    ;
    let results=[];
    ;
    let r=null;
    ;
    await (async function() {
        let __for_body__133=async function(item) {
            r=await (async function(){
                if (check_true ((item instanceof String || typeof item==='string'))){
                    return await item["match"].call(item,expr)
                } else {
                    return await (async function() {
                        {
                             let __call_target__=(""+ item), __call_method__="match";
                            return await __call_target__[__call_method__].call(__call_target__,expr)
                        } 
                    })()
                }
            })();
            if (check_true (r)){
                (results).push(cnt)
            };
            return cnt+=1
        };
        let __array__134=[],__elements__132=(container|| []);
        let __BREAK__FLAG__=false;
        for(let __iter__131 in __elements__132) {
            __array__134.push(await __for_body__133(__elements__132[__iter__131]));
            if(__BREAK__FLAG__) {
                 __array__134.pop();
                break;
                
            }
        }return __array__134;
         
    })();
    return results
},{ "name":"scan_list","fn_args":"(regex container)","description":["=:+","Scans a list for the provided regex expression and returns the indexes in the list where it is found.  ","The provided regex expression can be a plain string or a RegExp object."],"usage":["regex:string","container:list"],"tags":["search","index","list","regex","array","string"],"requires":["not","sub_type","is_string?","push"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("gather_up_prop",async function(key,values) {
    return await async function(){
        if (check_true ((values instanceof Array))) {
            return await (await Environment.get_global("no_empties"))(await (async function(){
                 return await (await Environment.get_global("map"))(async function(v) {
                    return await async function(){
                        if (check_true ((v instanceof Array))) {
                            return await (await Environment.get_global("gather_up_prop"))(key,v)
                        } else if (check_true ((v instanceof Object))) {
                            return v[key]
                        }
                    } ()
                },values) 
            })())
        } else if (check_true ((values instanceof Object))) {
            return values[key]
        }
    } ()
},{ "name":"gather_up_prop","fn_args":"(key values)","usage":["key:string","values:array|object"],"description":"Given a key and an object or array of objects, return all the values associated with the provided key.","tags":["key","property","objects","iteration"],"requires":["is_array?","no_empties","map","gather_up_prop","is_object?"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("sum_up_prop",async function(key,values) {
    return await (await Environment.get_global("sum"))(await (await Environment.get_global("flatten"))(await (await Environment.get_global("gather_up_prop"))(key,values)))
},{ "name":"sum_up_prop","fn_args":"(key values)","usage":["key:string","values:array|object"],"description":"Given a key and an object or array of objects, return the total sum amount of the given key.","tags":["sum","key","property","objects","iteration"],"requires":["sum","flatten","gather_up_prop"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("scan_for",async function(non_nil_prop,list_of_objects) {
    let rval=null;
    ;
    await (async function() {
        let __for_body__137=async function(val) {
            if (check_true ((val&& val[non_nil_prop]))){
                {
                    rval=val[non_nil_prop];
                    return __BREAK__FLAG__=true;
                    return
                }
            }
        };
        let __array__138=[],__elements__136=(list_of_objects|| []);
        let __BREAK__FLAG__=false;
        for(let __iter__135 in __elements__136) {
            __array__138.push(await __for_body__137(__elements__136[__iter__135]));
            if(__BREAK__FLAG__) {
                 __array__138.pop();
                break;
                
            }
        }return __array__138;
         
    })();
    return rval
},{ "name":"scan_for","fn_args":"(non_nil_prop list_of_objects)","description":"Given a property name and a list of objects, find the first object with the non-nil property value specified by non_nil_prop. Returns the value of the non-nil property.","usage":["non_nil_prop:string","list_of_objects:array"],"tags":["find","scan","object","list","array","value"],"requires":[],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("make_sort_buckets",async function() {
    let buckets;
    let push_to;
    buckets=new Object();
    push_to=async function(category,thing) {
        let place;
        place=null;
        if (check_true ((null==category))){
            return buckets
        } else {
            {
                place=buckets[category];
                if (check_true (place)){
                    (place).push(thing)
                } else {
                    await async function(){
                        buckets[category]=await (async function(){
                            let __array_op_rval__140=thing;
                             if (__array_op_rval__140 instanceof Function){
                                return await __array_op_rval__140() 
                            } else {
                                return [__array_op_rval__140]
                            }
                        })();
                        return buckets;
                        
                    }()
                };
                return thing
            }
        }
    };
    return push_to
},{ "name":"make_sort_buckets","fn_args":"[]","usage":[],"description":["=:+","Called with no arguments, this function returns a function that when called with a ","category and a value, will store that value under the category name in an array, ","which acts as an accumulator of items for that category.  In this mode, the function ","returns the passed item to be stored.<br><br>","When the returned function is called with no arguments, the function returns the ","object containing all passed categories as its keys, with the values being the accumulated","items passed in previous calls."],"tags":["objects","accumulator","values","sorting","categorize","categorization","buckets"],"requires":["push"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
 Environment.set_global("bytes_from_int_16",new Function("x","{ let bytes = []; let i = 2; do { bytes[(1 - --i)] = x & (255); x = x>>8; } while ( i ) return bytes;}"),{
    requires:[],externals:["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],source_name:"core-ext.lisp"
});
 Environment.set_global("int_16_from_bytes",new Function("x","y"," { let val = 0;  val +=y; val = val << 8; val +=x; return val; }"),{
    requires:[],externals:["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],source_name:"core-ext.lisp"
});
await Environment.set_global("truncate",async function(len,value,trailer) {
    trailer=(trailer|| "");
    return await async function(){
        if (check_true ((value instanceof String || typeof value==='string'))) {
            if (check_true (((value && value.length)>len))){
                return await (await Environment.get_global("add"))(await value["substr"].call(value,0,len),trailer)
            } else {
                return value
            }
        } else if (check_true ((value instanceof Array))) {
            return await value["slice"].call(value,0,len)
        } else {
            return value
        }
    } ()
},{ "name":"truncate","fn_args":"(len value trailer)","description":["=:+","Given a length and a string or an array, return the value ","with a length no more than then the provided value. If ","the value is a string an optional trailer string can be ","provided that will be appeneded to the truncated string."],"usage":["len:number","value:array|string","trailer:string?"],"tags":["array","string","length","max","min"],"requires":["is_string?","add","is_array?"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("parse_csv",async function(csv_data,options) {
    let lbuffer;
    let sepval;
    let sepval_r;
    let fixer_r;
    let interruptions;
    let line;
    let count;
    let tmp;
    let rval;
    let match_list;
    let lines;
    let total_lines;
    lbuffer=null;
    sepval=((options && options["separator"])|| ",");
    sepval_r=new RegExp(sepval,"g");
    fixer_r=new RegExp("!SEPVAL!","g");
    interruptions=((options && options["interruptions"])|| false);
    line=null;
    count=0;
    tmp=null;
    rval=null;
    match_list=null;
    lines=await (async function(){
         return await async function(){
            if (check_true ((csv_data instanceof Array))) {
                return csv_data
            } else if (check_true ((csv_data instanceof String || typeof csv_data==='string'))) {
                return (await (await Environment.get_global("replace"))(new RegExp("[\r]+","g"),"",csv_data)).split("\n")
            }
        } () 
    })();
    total_lines=(lines && lines.length);
    if (check_true (interruptions)){
        await (await Environment.get_global("sleep"))(0.1)
    };
    return await (async function() {
        let __for_body__143=async function(v) {
            if (check_true (interruptions)){
                {
                    count+=1;
                    if (check_true (((count% 1000)===0))){
                        {
                            await (await Environment.get_global("sleep"))(0.1);
                            if (check_true ((options && options["notifier"]))){
                                await (async function(){
                                    let __array_op_rval__145=(options && options["notifier"]);
                                     if (__array_op_rval__145 instanceof Function){
                                        return await __array_op_rval__145((count/ total_lines),count,total_lines) 
                                    } else {
                                        return [__array_op_rval__145,(count/ total_lines),count,total_lines]
                                    }
                                })()
                            }
                        }
                    }
                }
            };
            match_list=(await (await Environment.get_global("scan_str"))(new RegExp("\"([A-Za-z0-9, .  :;]+)\"","g"),v)).slice(0).reverse();
            line=await (async function(){
                if (check_true (((match_list && match_list.length)>0))){
                    {
                        rval=[];
                        await (async function() {
                            let __for_body__148=async function(m) {
                                return (rval).push(await (async function(){
                                    let __array_op_rval__150=(m && m["index"]);
                                     if (__array_op_rval__150 instanceof Function){
                                        return await __array_op_rval__150(await (await Environment.get_global("replace"))(sepval_r,"!SEPVAL!",m["1"]),m["1"]) 
                                    } else {
                                        return [__array_op_rval__150,await (await Environment.get_global("replace"))(sepval_r,"!SEPVAL!",m["1"]),m["1"]]
                                    }
                                })())
                            };
                            let __array__149=[],__elements__147=match_list;
                            let __BREAK__FLAG__=false;
                            for(let __iter__146 in __elements__147) {
                                __array__149.push(await __for_body__148(__elements__147[__iter__146]));
                                if(__BREAK__FLAG__) {
                                     __array__149.pop();
                                    break;
                                    
                                }
                            }return __array__149;
                             
                        })();
                        tmp=v;
                        await (async function() {
                            let __for_body__153=async function(r) {
                                return tmp=(""+ await tmp["substr"].call(tmp,0,(r && r["0"]))+ (r && r["1"])+ await tmp["substr"].call(tmp,(2+ (r && r["0"])+ await (await Environment.get_global("length"))((r && r["2"])))))
                            };
                            let __array__154=[],__elements__152=rval;
                            let __BREAK__FLAG__=false;
                            for(let __iter__151 in __elements__152) {
                                __array__154.push(await __for_body__153(__elements__152[__iter__151]));
                                if(__BREAK__FLAG__) {
                                     __array__154.pop();
                                    break;
                                    
                                }
                            }return __array__154;
                             
                        })();
                        return tmp
                    }
                } else {
                    return v
                }
            })();
            return await (async function() {
                let __for_body__157=async function(segment) {
                    return await (await Environment.get_global("replace"))(fixer_r,sepval,segment)
                };
                let __array__158=[],__elements__156=(line).split(sepval);
                let __BREAK__FLAG__=false;
                for(let __iter__155 in __elements__156) {
                    __array__158.push(await __for_body__157(__elements__156[__iter__155]));
                    if(__BREAK__FLAG__) {
                         __array__158.pop();
                        break;
                        
                    }
                }return __array__158;
                 
            })()
        };
        let __array__144=[],__elements__142=lines;
        let __BREAK__FLAG__=false;
        for(let __iter__141 in __elements__142) {
            __array__144.push(await __for_body__143(__elements__142[__iter__141]));
            if(__BREAK__FLAG__) {
                 __array__144.pop();
                break;
                
            }
        }return __array__144;
         
    })()
},{ "name":"parse_csv","fn_args":"(csv_data options)","description":["=:+","Given a text file of CSV data and an optional options value, parse and return a JSON structure of the CSV data as nested arrays.","<br>","Options can contain the following values:<br>","<table><tr><td>separator</td><td>A text value for the separator to use.  ","The default is a comma.</td></tr><tr><td>interruptions</td><td>If set to true, ","will pause regularly during processing for 1/10th of a second to allow other event queue activities to occur.</td>","</tr><tr><td>notifier</td><td>If interruptions is true, notifier will be triggered with ","the progress of work as a percentage of completion (0 - 1), the current count and the total rows.</td></tr></table>"],"usage":["csv_data:string","options:object?"],"tags":["parse","list","values","table","tabular","csv"],"requires":["is_array?","is_string?","split_by","replace","sleep","reverse","scan_str","push","length"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("to_csv",async function(rows,delimiter) {
    let quote_quoter=new RegExp("\"","g");
    ;
    return (await (async function() {
        let __for_body__161=async function(row) {
            return (await (async function(){
                 return await (await Environment.get_global("map"))(async function(v) {
                    if (check_true (((v instanceof String || typeof v==='string')&& (await (await Environment.get_global("contains?"))(" ",(""+ v+ ""))|| await (await Environment.get_global("contains?"))(delimiter,v)|| await (await Environment.get_global("contains?"))("\"",v))))){
                        return ("\""+ await (await Environment.get_global("replace"))(quote_quoter,"\"\"",v)+ "\"")
                    } else {
                        return (""+ v+ "")
                    }
                },row) 
            })()).join(await (async function(){
                if (check_true (delimiter)){
                    return delimiter
                } else {
                    return ","
                }
            })())
        };
        let __array__162=[],__elements__160=rows;
        let __BREAK__FLAG__=false;
        for(let __iter__159 in __elements__160) {
            __array__162.push(await __for_body__161(__elements__160[__iter__159]));
            if(__BREAK__FLAG__) {
                 __array__162.pop();
                break;
                
            }
        }return __array__162;
         
    })()).join("\n")
},{ "name":"to_csv","fn_args":"[\"rows\" delimiter]","description":["=:+","Given a list of rows, which are expected to be lists themselves, ","join the contents of the rows together via , and then join the rows ","together into a csv buffer using a newline, then returned as a string."],"usage":["rows:list","delimiter:string"],"tags":["csv","values","report","comma","serialize","list"],"requires":["join","map","is_string?","contains?","replace"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("squeeze",async function(s) {
    return await (await Environment.get_global("replace"))(new RegExp(" ","g"),"",s)
},{ "name":"squeeze","fn_args":"(s)","usage":["string_value:string"],"description":"Returns a string that has all spaces removed from the supplied string value.","tags":["text","space","trim","remove"],"requires":["replace"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("ensure_keys",async function(keylist,obj,default_value) {
    default_value=await (async function(){
        if (check_true ((undefined===default_value))){
            return null
        } else {
            return default_value
        }
    })();
    if (check_true ((null==obj))){
        {
            obj=new Object()
        }
    };
    await (async function() {
        let __for_body__165=async function(key) {
            if (check_true ((undefined===obj[key]))){
                {
                    return await async function(){
                        obj[key]=default_value;
                        return obj;
                        
                    }()
                }
            }
        };
        let __array__166=[],__elements__164=keylist;
        let __BREAK__FLAG__=false;
        for(let __iter__163 in __elements__164) {
            __array__166.push(await __for_body__165(__elements__164[__iter__163]));
            if(__BREAK__FLAG__) {
                 __array__166.pop();
                break;
                
            }
        }return __array__166;
         
    })();
    return obj
},{ "name":"ensure_keys","fn_args":"(keylist obj default_value)","description":["=:+","Given a list of key values, an object (or nil) and an optional default value to be ","assigned each key, ensures that the object returned has the specified keys (if not already set) set to either ","the specified default value, or nil."],"usage":["keylist","obj:object","default_value:*?"],"tags":["object","keys","values","required","key"],"requires":[],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
 Environment.set_global("show_time_in_words",new Function("seconds","options","options=options||{}\n        if (options['longForm']==null) {\n            if (seconds<2) return \"now\";\n            if (seconds<61) return parseInt(seconds)+\" secs\";\n            if ((seconds>61)&&(seconds<120)) return \"1 min\";\n            if (seconds<3601) {\n                // less than an hour\n                return parseInt(seconds/60)+\" mins\";\n            }\n        } else if (options['longForm']==true) {\n            if (seconds<61) return parseInt(seconds)+\" seconds\";\n            if ((seconds>61)&&(seconds<120)) return \"1 minute\";\n            if (seconds<3601) {\n                // less than an hour\n                return parseInt(seconds / 60) + \" minutes\";\n            }\n        }\n\n        if (seconds<86400) {\n            return parseInt(seconds/3600)+\" hours\";\n        }\n        if (seconds<172801) {\n            return parseInt(seconds/86400)+\" day\";\n        }\n        if (seconds < 31536000) {\n            return parseInt(seconds/86400)+\" days\";\n        }\n        if (seconds < (2 * 31536000)) {\n            return \"1 year\";\n        }\n        return parseInt(seconds/31536000)+\" years\";\n "),{
    description:("Given an integer value representing seconds of a time duration, return a string "+ "representing the time in words, such as 2 mins.  If the key longForm is set to "+ "true in options return full words instead of contracted forms.  For example min vs. minute."),usage:["seconds:integer","options:object"],tags:["time","date","format","string","elapsed"],requires:["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],source_name:"core-ext.lisp"
});
await Environment.set_global("ago",async function(dval) {
    return await (await Environment.get_global("show_time_in_words"))(((await (async function() {
        {
             let __call_target__=new Date(), __call_method__="getTime";
            return await __call_target__[__call_method__]()
        } 
    })()- await dval["getTime"]())/ 1000))
},{ "name":"ago","fn_args":"(dval)","usage":["dval:Date"],"description":"Given a date object, return a formatted string in English with the amount of time elapsed from the provided date.","tags":["date","format","time","string","elapsed"],"requires":["show_time_in_words"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("lifespan",async function(dval) {
    return await (await Environment.get_global("show_time_in_words"))(((await dval["getTime"]()- await (async function() {
        {
             let __call_target__=new Date(), __call_method__="getTime";
            return await __call_target__[__call_method__]()
        } 
    })())/ 1000))
},{ "name":"lifespan","fn_args":"(dval)","usage":["dval:Date"],"description":"Given a date object, return a formatted string in English with the amount of time until the specified date.","tags":["date","format","time","string","elapsed"],"requires":["show_time_in_words"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await Environment.set_global("show",async function(thing) {
    return await async function(){
        if (check_true (thing instanceof Function)) {
            return await thing["toString"]()
        } else {
            return thing
        }
    } ()
},{ "name":"show","fn_args":"(thing)","usage":["thing:function"],"description":"Given a name to a compiled function, returns the source of the compiled function.  Otherwise just returns the passed argument.","tags":["compile","source","javascript","js","display"],"requires":["is_function?"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
{
     Environment.set_global("rotate_right",function(array_obj) {
        (array_obj).unshift((array_obj).pop());
        return array_obj
    },{ "name":"rotate_right","fn_args":"(array_obj)","description":["=:+","Given an array, takes the element at the last ","position (highest index), removes it and places ","it at the front (index 0) and returns the array. "],"usage":["array_obj:array"],"tags":["array","rotation","shift","right"],"requires":["prepend","pop"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
})
};
{
     Environment.set_global("rotate_left",function(array_obj) {
        (array_obj).push((array_obj).shift());
        return array_obj
    },{ "name":"rotate_left","fn_args":"(array_obj)","description":["=:+","Given an array, takes the element at the first ","position (index 0), removes it and places ","it at the front (highest index) and returns the array. "],"usage":["array_obj:array"],"tags":["array","rotation","shift","left"],"requires":["push","take"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
})
};
{
     Environment.set_global("interpolate",function(from,to,steps) {
        let cur;
        let step_size;
        let tmp;
        let acc;
        cur=from;
        step_size=1;
        tmp=0;
        acc=[];
         ( Environment.get_global("assert"))(( ( Environment.get_global("is_number?"))(from)&&  ( Environment.get_global("is_number?"))(to)&&  ( Environment.get_global("is_number?"))(steps)),"interpolate: all arguments must be numbers");
         ( Environment.get_global("assert"))(( Math.abs((from- to))>0),"interpolate: from and to numbers cannot be the same");
         ( Environment.get_global("assert"))((steps>1),"interpolate: steps must be greater than 1");
        step_size=((to- from)/ (steps- 1));
        if (check_true ((to>from))){
            {
                 ( function(){
                     let __test_condition__168=function() {
                        return (cur<=to)
                    };
                    let __body_ref__169=function() {
                        (acc).push(cur);
                        return cur=(cur+ step_size)
                    };
                    let __BREAK__FLAG__=false;
                    while( __test_condition__168()) {
                          __body_ref__169();
                         if(__BREAK__FLAG__) {
                             break;
                            
                        }
                    } ;
                    
                })();
                if (check_true (((acc && acc.length)<steps))){
                    (acc).push(to)
                }
            }
        } else {
            {
                 ( function(){
                     let __test_condition__170=function() {
                        return (cur>=to)
                    };
                    let __body_ref__171=function() {
                        (acc).push(cur);
                        return cur=(cur+ step_size)
                    };
                    let __BREAK__FLAG__=false;
                    while( __test_condition__170()) {
                          __body_ref__171();
                         if(__BREAK__FLAG__) {
                             break;
                            
                        }
                    } ;
                    
                })();
                if (check_true (((acc && acc.length)<steps))){
                    (acc).push(to)
                }
            }
        };
        return acc
    },{ "name":"interpolate","fn_args":"(from to steps)","description":"Returns an array of length steps which has ascending or descending values inclusive of from and to.","usage":["from:number","to:number","steps:number"],"tags":["range","interpolation","fill"],"requires":["assert","is_number?","push"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
})
};
await Environment.set_global("unload_core_ext",async function() {
    let count;
    let core_handle;
    count=0;
    core_handle=await Environment["get_namespace_handle"].call(Environment,"core");
    await (async function() {
        let __for_body__174=async function(def) {
            if (check_true (((def && def["source_name"])==="src/core-ext.lisp"))){
                {
                    console.log(("(undefine `"+ (def && def.name)+ ")"));
                    if (check_true (await core_handle["evaluate_local"].call(core_handle,("(undefine `"+ (def && def.name)+ ")")))){
                        return count+=1
                    }
                }
            }
        };
        let __array__175=[],__elements__173=(core_handle && core_handle["definitions"]);
        let __BREAK__FLAG__=false;
        for(let __iter__172 in __elements__173) {
            __array__175.push(await __for_body__174(__elements__173[__iter__172]));
            if(__BREAK__FLAG__) {
                 __array__175.pop();
                break;
                
            }
        }return __array__175;
         
    })();
    console.log(("removed "+ count+ " definitions."));
    return count
},{ "name":"unload_core_ext","fn_args":"[]","requires":["log"],"externals":["ReferenceError","Object","Date","Promise","setTimeout","Math","Error","RegExp","Function","parseFloat","clone","TextEncoder","crypto","DataView","TypeError","subtype","isNaN","Intl","parseInt","console"],"source_name":"core-ext.lisp"
});
await (await Environment.get_global("register_feature"))("core-ext");
return true
}
}
// Source: compiler.lisp  
// Build Time: 2024-01-23 05:28:51
// Version: 2024.01.23.05.28
export const DLISP_ENV_VERSION='2024.01.23.05.28';




const { get_next_environment_id, check_true, get_outside_global, subtype, lisp_writer, clone, LispSyntaxError } = await import("./lisp_writer.js");
export async function init_compiler(Environment) {
  return await Environment.set_global("compiler",async function(quoted_lisp,opts) {
    let Environment=(opts && opts["env"]);
    ;
    let get_global=(opts && opts["env"] && opts["env"]["get_global"]);
    ;
    {
        let length=function anonymous(obj) {
{
                         if(obj instanceof Array) {
                             return obj.length;
                             } else if (obj instanceof Set) {
                              return obj.size;
                              } else if ((obj === undefined)||(obj===null)) {
                               return 0;
                               } else if (typeof obj==='object') {
                                return Object.keys(obj).length;
                                } else if (typeof obj==='string') {
                                 return obj.length;
                                 }
                         return 0;
                         }
};
        let first=function anonymous(x) {
{ return x[0] }
};
        let second=function anonymous(x) {
{ return x[1] }
};
        let map=async function anonymous(lambda,array_values) {
{ try {
                      let rval = [],
                      tl = array_values.length;
                      for (let i = 0; i < array_values.length; i++) {
                             rval.push(await lambda.apply(this,[array_values[i], i, tl]));
                             }
                      return rval;
                      } catch (ex) {
                       if (lambda === undefined || lambda === null) {
                             throw new ReferenceError("map: lambda argument (position 0) is undefined or nil")
                             } else if (array_values === undefined || array_values === null) {
                              throw new ReferenceError("map: container argument (position 1) is undefined or nil")
                              } else if (!(lambda instanceof Function)) {
                               throw new ReferenceError("map: lambda argument must be a function: received: "+ typeof lambda)
                               } else if (!(array_values instanceof Array)) {
                                throw new ReferenceError("map: invalid array argument, received: " + typeof array_values)
                                } else {
                                 // something else just pass on the error
                                 throw ex;
                                 }
                       }
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
    return await async function(){
        if (check_true ((tree instanceof Array))) {
            {
                rval=[];
                await (async function(){
                     let __test_condition__26=async function() {
                        return (idx<(tree && tree.length))
                    };
                    let __body_ref__27=async function() {
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
                    while(await __test_condition__26()) {
                         await __body_ref__27();
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
                    let __for_body__30=async function(pset) {
                        return await async function(){
                            rval[(pset && pset["0"])]=await (async function(){
                                 return await do_deferred_splice((pset && pset["1"])) 
                            })();
                            return rval;
                            
                        }()
                    };
                    let __array__31=[],__elements__29=await (await Environment.get_global("pairs"))(tree);
                    let __BREAK__FLAG__=false;
                    for(let __iter__28 in __elements__29) {
                        __array__31.push(await __for_body__30(__elements__29[__iter__28]));
                        if(__BREAK__FLAG__) {
                             __array__31.pop();
                            break;
                            
                        }
                    }return __array__31;
                     
                })();
                return rval
            }
        } else {
            return tree
        }
    } ()
};
        let not=function anonymous(x) {
{ if (check_true(x)) { return false } else { return true } }
};
        let sub_type=function subtype(value) {  if (value === null) return "null";  else if (value === undefined) return "undefined";
  else if (value instanceof Array) return "array";
  else if (value.constructor && value.constructor!=null && value.constructor.name!=='Object') {
    return value.constructor.name;
  }
  return typeof value;
};
        let last=function anonymous(x) {
{ return x[x.length - 1] }
};
        let flatten=function anonymous(x) {
{ return x.flat(999999999999) } 
};
        let add=function anonymous(...args) {
{
                   let acc;
                   if (typeof args[0]==="number") {
                        acc = 0;
                        } else if (args[0] instanceof Array) {
                         return args[0].concat(args.slice(1));
                         } else if (typeof args[0]==='object') {
                          let rval = {};
                          for (let i in args) {
                                 if (typeof args[i] === 'object') {
                                      for (let k in args[i]) {
                                             rval[k] = args[i][k];
                                             }
                                      }
                                 }
                          return rval;
                          } else {
                           acc = "";
                           }
                   for (let i in args) {
                          acc += args[i];
                          }
                   return acc;
                   }
};
        let subtype=function subtype(value) {  if (value === null) return "null";
  else if (value === undefined) return "undefined";
  else if (value instanceof Array) return "array";
  else if (value.constructor && value.constructor!=null && value.constructor.name!=='Object') {
    return value.constructor.name;
  }
  return typeof value;
};
        let is_nil_ques_=async function(value) {    return (null===value)
};
        let is_number_ques_=function(x) {                        return ( subtype(x)==="Number")
                    };
        let starts_with_ques_=function anonymous(val,text) {
{ if (text instanceof Array) { return text[0]===val } else if (subtype(text)=='String') { return text.startsWith(val) } else { return false }}
};
        let uniq=async function(values) {    let s;
    s=new Set();
    await (await Environment.get_global("map"))(async function(x) {
        return await s["add"].call(s,x)
    },(values|| []));
    return await (await Environment.get_global("to_array"))(s)
};
        let object_methods=async function(obj) {    let properties;
    let current_obj;
    properties=new Set();
    current_obj=obj;
    await (async function(){
         let __body_ref__274=async function() {
            await (await Environment.get_global("map"))(async function(item) {
                return await properties["add"].call(properties,item)
            },await Object.getOwnPropertyNames(current_obj));
            return current_obj=await Object.getPrototypeOf(current_obj)
        };
        let __BREAK__FLAG__=false;
        while(current_obj) { await __body_ref__274();
         if(__BREAK__FLAG__) {
             break;
            
        }
    } ;
    
})();
return await (async function() {
    {
         let __call_target__=await Array.from(await properties["keys"]()), __call_method__="filter";
        return await __call_target__[__call_method__].call(__call_target__,async function(item) {
            return item instanceof Function
        })
    } 
})()
};
        let conj=function anonymous(...args) {
{   let list = [];
                       if (args[0] instanceof Array) {
                            list = args[0];
                            } else {
                             list = [args[0]];
                             }
                       args.slice(1).map(function(x) {
                                          list = list.concat(x);
                                          });
                       return list;
                       }
};
        let cl_encode_string=async function(text) {    if (check_true ((text instanceof String || typeof text==='string'))){
        {
            let escaped;
            let nq;
            let step1;
            let snq;
            escaped=await (await Environment.get_global("replace"))(new RegExp("\n","g"),await (await Environment.get_global("add"))(await String.fromCharCode(92),"n"),text);
            escaped=await (await Environment.get_global("replace"))(new RegExp("\r","g"),await (await Environment.get_global("add"))(await String.fromCharCode(92),"r"),escaped);
            nq=(escaped).split(await String.fromCharCode(34));
            step1=(nq).join(await (await Environment.get_global("add"))(await String.fromCharCode(92),await String.fromCharCode(34)));
            snq=(step1).split(await String.fromCharCode(39));
            return step1
        }
    } else {
        return text
    }
};
        let contains_ques_=function anonymous(value,container) {
{ if (!value && !container) { return false }
                         else if (container === null) { throw new TypeError("contains?: passed nil/undefined container value"); }
                                            else if (container instanceof Array) return container.includes(value);
                                            else if (container instanceof Set) return container.has(value);
                                            else if ((container instanceof String) || typeof container === "string") {
                                                     if (subtype(value) === "Number") return container.indexOf(""+value)>-1;
                                                     else return container.indexOf(value)>-1;
                                                     }
                                            else throw new TypeError("contains?: passed invalid container type: "+subtype(container)) }
};
        let tree;
        let expanded_tree;
        let op;
        let default_safety_level;
        let source_name;
        let build_environment_mode;
        let env_ref;
        let operator;
        let break_out;
        let tokens;
        let tokenized;
        let target_namespace;
        let errors;
        let external_dependencies;
        let first_level_setup;
        let needs_first_level;
        let throttle_level;
        let signal_error;
        let warnings;
        let blk_counter;
        let ctx;
        let output;
        let __log__1= async function(){
            return await Environment.get_global("console.log")
        };
        let __defclog__2= async function(){
            return async function(opts) {
                let style;
                style=("padding: 5px;"+ await (async function(){
                    if (check_true ((opts && opts["background"]))){
                        return ("background: "+ (opts && opts["background"])+ ";")
                    } else {
                        return ""
                    }
                })()+ await (async function(){
                    if (check_true ((opts && opts["color"]))){
                        return ("color: "+ (opts && opts["color"])+ ";")
                    }
                })()+ "");
                ;
                return async function(...args) {
                    return await (async function(){
                        let __target_arg__9=[].concat(await conj([style],args));
                        if(!__target_arg__9 instanceof Array){
                            throw new TypeError("Invalid final argument to apply - an array is required")
                        }let __pre_arg__10=("%c"+ await (async function(){
                            if (check_true ((opts && opts["prefix"]))){
                                return (opts && opts["prefix"])
                            } else {
                                return (args).shift()
                            }
                        })());
                        __target_arg__9.unshift(__pre_arg__10);
                        return (console.log).apply(this,__target_arg__9)
                    })()
                }
            }
        };
        let quiet_mode;
        let show_hints;
        let error_log;
        let dynamic_references_ques_;
        let assembly;
        let async_function_type_placeholder;
        let function_type_placeholder;
        let type_marker;
        let return_marker;
        let entry_signature;
        let temp_fn_asn_template;
        let anon_fn_template;
        let build_fn_with_assignment;
        let build_anon_fn;
        let completion_types;
        let referenced_global_symbols;
        let referenced_externals;
        let __new_ctx__3= async function(){
            return function(parent) {
                let ctx_obj;
                ctx_obj=new Object();
                  (function(){
                    ctx_obj["scope"]=new Object();
                    ctx_obj["source"]=source_name;
                    ctx_obj["parent"]=parent;
                    ctx_obj["ambiguous"]=new Object();
                    ctx_obj["declared_types"]=new Object();
                    ctx_obj["defs"]=[];
                    return ctx_obj;
                    
                })();
                if (check_true (parent)){
                    {
                          (function(){
                            let __target_obj__22=(ctx_obj && ctx_obj["scope"]);
                            __target_obj__22["namespace"]=(parent && parent["scope"] && parent["scope"]["namespace"]);
                            return __target_obj__22;
                            
                        })();
                        if (check_true ((parent && parent["defvar_eval"]))){
                            {
                                  (function(){
                                    ctx_obj["defvar_eval"]=true;
                                    return ctx_obj;
                                    
                                })()
                            }
                        };
                        if (check_true ((parent && parent["has_first_level"]))){
                            {
                                  (function(){
                                    ctx_obj["has_first_level"]=true;
                                    return ctx_obj;
                                    
                                })()
                            }
                        };
                        if (check_true ((parent && parent["block_step"]))){
                            {
                                  (function(){
                                    ctx_obj["block_step"]=(parent && parent["block_step"]);
                                    return ctx_obj;
                                    
                                })()
                            }
                        };
                        if (check_true ((parent && parent["block_id"]))){
                            {
                                  (function(){
                                    ctx_obj["block_id"]=(parent && parent["block_id"]);
                                    return ctx_obj;
                                    
                                })()
                            }
                        };
                        if (check_true ((parent && parent["sub_block_step"]))){
                            {
                                  (function(){
                                    ctx_obj["sub_block_step"]=(parent && parent["sub_block_step"]);
                                    return ctx_obj;
                                    
                                })()
                            }
                        };
                        if (check_true (false)){
                            {
                                  (function(){
                                    ctx_obj["return_point"]= add((parent && parent["return_point"]),1);
                                    return ctx_obj;
                                    
                                })()
                            }
                        }
                    }
                };
                return ctx_obj
            }
        };
        let set_ctx_log;
        let map_ctype_to_value;
        let map_value_to_ctype;
        let set_ctx;
        let get_ctx;
        let get_ctx_val;
        let get_declarations;
        let set_declaration;
        let is_ambiguous_ques_;
        let set_ambiguous;
        let unset_ambiguous;
        let invalid_js_ref_chars;
        let invalid_js_ref_chars_regex;
        let check_invalid_js_ref;
        let __sanitize_js_ref_name__4= async function(){
            return await Environment.get_global("sanitize_js_ref_name")
        };
        let find_in_context;
        let source_chain;
        let source_from_tokens;
        let source_comment;
        let NOT_FOUND;
        let THIS_REFERENCE;
        let NOT_FOUND_THING;
        let get_lisp_ctx_log;
        let get_lisp_ctx;
        let get_val;
        let has_lisp_globals;
        let root_ctx;
        let tokenize_object;
        let tokenize_quote;
        let tokenize;
        let comp_time_log;
        let compile_time_eval;
        let infix_ops;
        let compile_set_prop;
        let compile_prop;
        let compile_elem;
        let inline_log;
        let compile_inline;
        let compile_push;
        let compile_list;
        let compile_typeof;
        let compile_instanceof;
        let compile_compare;
        let assignment_log;
        let compile_assignment;
        let top_level_log;
        let compile_toplevel;
        let check_statement_completion;
        let compile_block;
        let Expression;
        let Statement;
        let NumberType;
        let StringType;
        let NilType;
        let UnknownType;
        let ArgumentType;
        let compile_defvar;
        let get_declaration_details;
        let clean_quoted_reference;
        let compile_let;
        let in_sync_ques_;
        let await_ques_;
        let calling_preamble;
        let fn_log;
        let comp_scope_log;
        let completion_scope_id;
        let set_new_completion_scope;
        let compile_fn;
        let compile_jslambda;
        let compile_yield;
        let var_counter;
        let gen_temp_name;
        let if_id;
        let compile_cond;
        let compile_cond_inner;
        let ensure_block;
        let compile_if;
        let compile_as_call;
        let rwfnlog;
        let compile_wrapper_fn;
        let compile_block_to_anon_fn;
        let make_do_block;
        let push_as_arg_list;
        let compile_new;
        let compile_val_mod;
        let compile_try;
        let compile_try_inner;
        let compile_throw;
        let compile_break;
        let compile_return;
        let apply_log;
        let compile_apply;
        let compile_call;
        let compile_call_inner;
        let check_needs_wrap;
        let compile_import;
        let compile_dynamic_import;
        let compile_javascript;
        let compile_set_global;
        let is_token_ques_;
        let compile_quote;
        let compile_quotel;
        let wrap_and_run;
        let quote_tree;
        let quotem_log;
        let compile_quotem;
        let compile_unquotem;
        let eval_log;
        let compile_eval;
        let compile_debug;
        let compile_for_each;
        let compile_for_each_inner;
        let compile_while;
        let compile_for_with;
        let compile_for_with_inner;
        let silence;
        let verbosity;
        let check_verbosity;
        let declare_log;
        let compile_declare;
        let safety_level;
        let debug_level;
        let get_scoped_type;
        let compile_scoped_reference;
        let compile_lisp_scoped_reference;
        let standard_types;
        let externals;
        let is_error;
        let is_block_ques_;
        let is_complex_ques_;
        let is_form_ques_;
        let op_lookup;
        let comp_log;
        let last_source;
        let compile_obj_literal;
        let is_literal_ques_;
        let comp_warn;
        let __compile__5= async function(){
            return async function(tokens,ctx,_cdepth) {
                if (check_true (is_error)){
                    return is_error
                } else {
                    {
                        let _dbg_level=await debug_level(ctx);
                        ;
                        let rval=await compile_inner(tokens,ctx,_cdepth,_dbg_level);
                        ;
                        if (check_true (is_error)){
                            {
                                if (check_true ((opts && opts["throw_on_error"]))){
                                    {
                                        let error=new Error((is_error && is_error["error"]));
                                        ;
                                        await (async function() {
                                            let __for_body__587=async function(pset) {
                                                return await async function(){
                                                    error[(pset && pset["0"])]=(pset && pset["1"]);
                                                    return error;
                                                    
                                                }()
                                            };
                                            let __array__588=[],__elements__586=await (await Environment.get_global("pairs"))(is_error);
                                            let __BREAK__FLAG__=false;
                                            for(let __iter__585 in __elements__586) {
                                                __array__588.push(await __for_body__587(__elements__586[__iter__585]));
                                                if(__BREAK__FLAG__) {
                                                     __array__588.pop();
                                                    break;
                                                    
                                                }
                                            }return __array__588;
                                             
                                        })();
                                        throw error;
                                        
                                    }
                                }
                            }
                        };
                        if (check_true (((_dbg_level>1)&& (await first(rval) instanceof Object)&& (await length(rval)>2)))){
                            {
                                await async function(){
                                    let __target_obj__590=await first(rval);
                                    __target_obj__590["source_comment"]=await (async function(){
                                         return await (await Environment.get_global("truncate"))(100,await source_from_tokens(tokens,expanded_tree),"...") 
                                    })();
                                    return __target_obj__590;
                                    
                                }()
                            }
                        };
                        return rval
                    }
                }
            }
        };
        let compile_inner;
        let final_token_assembly;
        let main_log;
        let assemble_output;
        {
            tree=quoted_lisp;
            expanded_tree=await (async function(){
                 return await (async function(){
                    let __array_op_rval__6=clone;
                     if (__array_op_rval__6 instanceof Function){
                        return await __array_op_rval__6(tree) 
                    } else {
                        return [__array_op_rval__6,tree]
                    }
                })() 
            })();
            op=null;
            default_safety_level=((Environment && Environment["declarations"] && Environment["declarations"]["safety"] && Environment["declarations"]["safety"]["level"])|| 1);
            source_name=((opts && opts["source_name"])|| "anonymous");
            build_environment_mode=((opts && opts["build_environment"])|| false);
            env_ref=await (async function(){
                if (check_true (build_environment_mode)){
                    return ""
                } else {
                    return "Environment."
                }
            })();
            operator=null;
            break_out="__BREAK__FLAG__";
            tokens=[];
            tokenized=null;
            target_namespace=null;
            errors=[];
            external_dependencies=new Object();
            first_level_setup=[];
            needs_first_level=true;
            throttle_level=(opts && opts["throttle"]);
            signal_error=async function(message) {
                return new LispSyntaxError(message)
            };
            warnings=[];
            blk_counter=0;
            ctx=null;
            output=null;
            let log=await __log__1();
            ;
            let defclog=await __defclog__2();
            ;
            quiet_mode=await (async function(){
                if (check_true ((opts && opts["quiet_mode"]))){
                    {
                        log=console.log;
                        return true
                    }
                } else {
                    return false
                }
            })();
            show_hints=null;
            error_log=await (async function(){
                 return await defclog({
                    prefix:"Compile Error",background:"#CA3040",color:"white"
                }) 
            })();
            dynamic_references_ques_=false;
            assembly=[];
            async_function_type_placeholder=async function() {
                return true
            };
            function_type_placeholder=function() {
                return true
            };
            type_marker=async function(type) {
                return await async function(){
                    let __target_obj__11=new Object();
                    __target_obj__11["ctype"]=type;
                    __target_obj__11["args"]=[];
                    return __target_obj__11;
                    
                }()
            };
            return_marker=async function() {
                return {
                    mark:"rval"
                }
            };
            entry_signature=null;
            temp_fn_asn_template=await (async function(){
                 return [{
                    type:"special",val:await (async function(){
                         return "=:defvar" 
                    })(),ref:true,name:"defvar"
                },{
                    type:"literal",val:"\"\"",ref:false,name:""
                },{
                    type:"arr",val:await (async function(){
                         return [{
                            type:"special",val:await (async function(){
                                 return "=:fn" 
                            })(),ref:true,name:"fn"
                        },{
                            type:"arr",val:[],ref:false,name:null
                        },{
                            type:"arr",val:[],ref:false,name:null
                        }] 
                    })(),ref:false,name:null
                }] 
            })();
            anon_fn_template=await temp_fn_asn_template["slice"].call(temp_fn_asn_template,2);
            build_fn_with_assignment=async function(tmp_var_name,body,args,ctx) {
                let tmp_template;
                tmp_template=await (async function(){
                     return await (async function(){
                        let __array_op_rval__12=clone;
                         if (__array_op_rval__12 instanceof Function){
                            return await __array_op_rval__12(temp_fn_asn_template) 
                        } else {
                            return [__array_op_rval__12,temp_fn_asn_template]
                        }
                    })() 
                })();
                if (check_true (await in_sync_ques_(ctx))){
                    {
                        await async function(){
                            let __target_obj__13=(tmp_template && tmp_template["2"] && tmp_template["2"]["val"] && tmp_template["2"]["val"]["0"]);
                            __target_obj__13["val"]=await (async function(){
                                 return "=:function" 
                            })();
                            return __target_obj__13;
                            
                        }();
                        await async function(){
                            let __target_obj__14=(tmp_template && tmp_template["2"] && tmp_template["2"]["val"] && tmp_template["2"]["val"]["0"]);
                            __target_obj__14["name"]="function";
                            return __target_obj__14;
                            
                        }()
                    }
                };
                await async function(){
                    let __target_obj__15=(tmp_template && tmp_template["1"]);
                    __target_obj__15["name"]=tmp_var_name;
                    __target_obj__15["val"]=tmp_var_name;
                    return __target_obj__15;
                    
                }();
                if (check_true ((args instanceof Array))){
                    {
                        await async function(){
                            let __target_obj__16=(tmp_template && tmp_template["2"] && tmp_template["2"]["val"] && tmp_template["2"]["val"]["1"]);
                            __target_obj__16["val"]=args;
                            return __target_obj__16;
                            
                        }()
                    }
                };
                await async function(){
                    let __target_obj__17=(tmp_template && tmp_template["2"] && tmp_template["2"]["val"] && tmp_template["2"]["val"]["2"]);
                    __target_obj__17["val"]=body;
                    return __target_obj__17;
                    
                }();
                return tmp_template
            };
            build_anon_fn=async function(body,args) {
                let tmp_template;
                tmp_template=await (async function(){
                     return await (async function(){
                        let __array_op_rval__18=clone;
                         if (__array_op_rval__18 instanceof Function){
                            return await __array_op_rval__18(anon_fn_template) 
                        } else {
                            return [__array_op_rval__18,anon_fn_template]
                        }
                    })() 
                })();
                if (check_true (await verbosity(ctx))){
                    {
                        await console.log("build_anon_function: -> body: ",body);
                        await console.log("build_anon_function: -> args: ",args)
                    }
                };
                if (check_true ((args instanceof Array))){
                    {
                        await async function(){
                            let __target_obj__19=(tmp_template && tmp_template["0"] && tmp_template["0"]["val"] && tmp_template["0"]["val"]["1"]);
                            __target_obj__19["val"]=args;
                            return __target_obj__19;
                            
                        }()
                    }
                };
                await async function(){
                    let __target_obj__20=(tmp_template && tmp_template["0"] && tmp_template["0"]["val"] && tmp_template["0"]["val"]["2"]);
                    __target_obj__20["val"]=body;
                    return __target_obj__20;
                    
                }();
                return tmp_template
            };
            completion_types=["return","throw","yield"];
            referenced_global_symbols=new Set();
            referenced_externals=new Set();
            let new_ctx=await __new_ctx__3();
            ;
            set_ctx_log=await (async function(){
                if (check_true ((opts && opts["quiet_mode"]))){
                    return log
                } else {
                    return await defclog({
                        prefix:"set_ctx",background:"darkgreen",color:"white"
                    })
                }
            })();
            map_ctype_to_value=async function(ctype,value) {
                return await async function(){
                    if (check_true ((ctype==="Function"))) {
                        return Function
                    } else if (check_true ((ctype==="AsyncFunction"))) {
                        return AsyncFunction
                    } else if (check_true ((ctype==="expression"))) {
                        return Expression
                    } else if (check_true (((ctype instanceof String || typeof ctype==='string')&& await contains_ques_("block",ctype)))) {
                        return UnknownType
                    } else if (check_true ((ctype==="array"))) {
                        return Array
                    } else if (check_true ((ctype==="nil"))) {
                        return NilType
                    } else if (check_true (ctype instanceof Function)) {
                        return ctype
                    } else {
                        return value
                    }
                } ()
            };
            map_value_to_ctype=async function(value) {
                return await async function(){
                    if (check_true ((Function===value))) {
                        return "Function"
                    } else if (check_true ((AsyncFunction===value))) {
                        return "AsyncFunction"
                    } else if (check_true ((NumberType===value))) {
                        return "NumberType"
                    } else if (check_true ((Expression===value))) {
                        return "Expression"
                    } else if (check_true ((Array===value))) {
                        return "array"
                    } else if (check_true ((Boolean===value))) {
                        return "Boolean"
                    } else if (check_true ((NilType===value))) {
                        return "nil"
                    } else if (check_true ((Object===value))) {
                        return "Object"
                    } else {
                        return value
                    }
                } ()
            };
            set_ctx=async function(ctx,name,value) {
                let sanitized_name=await sanitize_js_ref_name(name);
                ;
                if (check_true (((value instanceof Array)&& (value && value["0"] && value["0"]["ctype"])))){
                    return await async function(){
                        let __target_obj__29=(ctx && ctx["scope"]);
                        __target_obj__29[sanitized_name]=await (async function(){
                             return await async function(){
                                if (check_true (((value && value["0"] && value["0"]["ctype"])==="Function"))) {
                                    return Function
                                } else if (check_true (((value && value["0"] && value["0"]["ctype"])==="AsyncFunction"))) {
                                    return AsyncFunction
                                } else if (check_true (((value && value["0"] && value["0"]["ctype"])==="expression"))) {
                                    return Expression
                                } else {
                                    return value
                                }
                            } () 
                        })();
                        return __target_obj__29;
                        
                    }()
                } else {
                    return await async function(){
                        let __target_obj__30=(ctx && ctx["scope"]);
                        __target_obj__30[sanitized_name]=value;
                        return __target_obj__30;
                        
                    }()
                }
            };
            get_ctx=async function(ctx,name) {
                let ref_name;
                ref_name=null;
                return await async function(){
                    if (check_true (await (async function(){
                         return await is_nil_ques_(name) 
                    })())) {
                        throw new SyntaxError(("get_ctx: nil identifier passed: "+ await sub_type(name)));
                        
                    } else if (check_true (await is_number_ques_(name))) {
                        return name
                    } else if (check_true (name instanceof Function)) {
                        throw new SyntaxError(("get_ctx: invalid identifier passed: "+ await sub_type(name)));
                        
                    } else {
                        {
                            ref_name=await first(await (await Environment.get_global("get_object_path"))(name));
                            return await async function(){
                                if (check_true (await not((undefined===await (async function(){
                                    let __targ__31=(ctx && ctx["scope"]);
                                    if (__targ__31){
                                         return(__targ__31)[ref_name]
                                    } 
                                })())))) {
                                    return await (async function(){
                                        let __targ__32=(ctx && ctx["scope"]);
                                        if (__targ__32){
                                             return(__targ__32)[ref_name]
                                        } 
                                    })()
                                } else if (check_true ((ctx && ctx["parent"]))) {
                                    return await get_ctx((ctx && ctx["parent"]),ref_name)
                                }
                            } ()
                        }
                    }
                } ()
            };
            get_ctx_val=async function(ctx,name) {
                let ref_name;
                let declared_type_value;
                ref_name=null;
                declared_type_value=null;
                if (check_true ((null==ctx))){
                    {
                        await console.error("get_ctx_val: undefined/nil ctx passed.")
                    }
                };
                return await async function(){
                    if (check_true (await (async function(){
                         return await is_nil_ques_(name) 
                    })())) {
                        throw new TypeError(("get_ctx_val: nil identifier passed: "+ await sub_type(name)));
                        
                    } else if (check_true (await is_number_ques_(name))) {
                        return name
                    } else if (check_true (name instanceof Function)) {
                        throw new Error(("get_ctx_val: invalid identifier passed: "+ await sub_type(name)));
                        
                    } else {
                        {
                            if (check_true (await starts_with_ques_(await (async function(){
                                 return "=:" 
                            })(),name))){
                                ref_name=await name["substr"].call(name,2)
                            } else {
                                ref_name=name
                            };
                            ref_name=await sanitize_js_ref_name(name);
                            declared_type_value=await get_declarations(ctx,ref_name);
                            return await async function(){
                                if (check_true ((declared_type_value && declared_type_value["declared_global"]))) {
                                    return undefined
                                } else if (check_true ((declared_type_value && declared_type_value["type"]))) {
                                    return (declared_type_value && declared_type_value["type"])
                                } else {
                                    {
                                        ref_name=await first(await (await Environment.get_global("get_object_path"))(ref_name));
                                        return await async function(){
                                            if (check_true (op_lookup[ref_name])) {
                                                return AsyncFunction
                                            } else if (check_true (await not((undefined===await (async function(){
                                                let __targ__33=(ctx && ctx["scope"]);
                                                if (__targ__33){
                                                     return(__targ__33)[ref_name]
                                                } 
                                            })())))) {
                                                return await (async function(){
                                                    let __targ__34=(ctx && ctx["scope"]);
                                                    if (__targ__34){
                                                         return(__targ__34)[ref_name]
                                                    } 
                                                })()
                                            } else if (check_true ((ctx && ctx["parent"]))) {
                                                return await get_ctx((ctx && ctx["parent"]),ref_name)
                                            }
                                        } ()
                                    }
                                }
                            } ()
                        }
                    }
                } ()
            };
            get_declarations=async function(ctx,name,_tagged) {
                let ref_name;
                let oname;
                let root_name;
                ref_name=null;
                oname=name;
                root_name=null;
                name=await (async function(){
                    if (check_true (_tagged)){
                        return name
                    } else {
                        return await sanitize_js_ref_name(name)
                    }
                })();
                return await async function(){
                    if (check_true (await not((ctx instanceof Object)))) {
                        throw new TypeError(("get_declarations: invalid ctx passed"));
                        
                    } else if (check_true (await (async function(){
                         return await is_nil_ques_(name) 
                    })())) {
                        throw new TypeError(("get_declarations: nil identifier passed: "+ await sub_type(oname)));
                        
                    } else if (check_true (await is_number_ques_(name))) {
                        return name
                    } else if (check_true (name instanceof Function)) {
                        throw new Error(("get_declarations: invalid identifier passed: "+ await sub_type(oname)));
                        
                    } else {
                        if (check_true ((name instanceof String || typeof name==='string'))){
                            {
                                if (check_true (await starts_with_ques_(await (async function(){
                                     return "=:" 
                                })(),name))){
                                    ref_name=await name["substr"].call(name,2)
                                } else {
                                    ref_name=name
                                };
                                return await async function(){
                                    if (check_true (op_lookup[ref_name])) {
                                        return null
                                    } else if (check_true (await not((undefined===await (async function(){
                                        let __targ__35=(ctx && ctx["declared_types"]);
                                        if (__targ__35){
                                             return(__targ__35)[ref_name]
                                        } 
                                    })())))) {
                                        return await (async function(){
                                            let __targ__36=(ctx && ctx["declared_types"]);
                                            if (__targ__36){
                                                 return(__targ__36)[ref_name]
                                            } 
                                        })()
                                    } else if (check_true ((ctx && ctx["parent"]))) {
                                        return await get_declarations((ctx && ctx["parent"]),ref_name,true)
                                    }
                                } ()
                            }
                        }
                    }
                } ()
            };
            set_declaration=async function(ctx,name,declaration_type,value) {
                let sname;
                let dec_struct;
                sname=await sanitize_js_ref_name(name);
                dec_struct=await get_declarations(ctx,sname);
                if (check_true (await (await Environment.get_global("blank?"))(dec_struct))){
                    {
                        dec_struct={
                            type:undefined,inlined:false
                        }
                    }
                };
                return await async function(){
                    if (check_true (((declaration_type==="location")&& (value==="global")))) {
                        {
                            has_lisp_globals=true;
                            if (check_true ((undefined===dec_struct["type"]))){
                                throw new SyntaxError("global declaration must be after declaration of type for symbol");
                                
                            };
                            await async function(){
                                dec_struct["declared_global"]=true;
                                return dec_struct;
                                
                            }();
                            return await async function(){
                                let __target_obj__38=(root_ctx && root_ctx["defined_lisp_globals"]);
                                __target_obj__38[name]=dec_struct["type"];
                                return __target_obj__38;
                                
                            }()
                        }
                    } else {
                        {
                            await async function(){
                                dec_struct[declaration_type]=value;
                                return dec_struct;
                                
                            }();
                            await async function(){
                                let __target_obj__40=(ctx && ctx["declared_types"]);
                                __target_obj__40[sname]=dec_struct;
                                return __target_obj__40;
                                
                            }();
                            return await (async function(){
                                let __targ__41=(ctx && ctx["declared_types"]);
                                if (__targ__41){
                                     return(__targ__41)[sname]
                                } 
                            })()
                        }
                    }
                } ()
            };
            is_ambiguous_ques_=async function(ctx,name) {
                let ref_name;
                ref_name=null;
                return await async function(){
                    if (check_true (await (async function(){
                         return await is_nil_ques_(ctx) 
                    })())) {
                        throw new TypeError(("is_ambiguous?: nil ctx passed"));
                        
                    } else if (check_true (await (async function(){
                         return await is_nil_ques_(name) 
                    })())) {
                        throw new TypeError(("is_ambiguous?: nil reference name passed"));
                        
                    } else if (check_true (await not((name instanceof String || typeof name==='string')))) {
                        throw new TypeError(("is_ambiguous?: reference name given is a "+ await sub_type(name)+ ", requires a string"));
                        
                    } else {
                        {
                            if (check_true (await starts_with_ques_(await (async function(){
                                 return "=:" 
                            })(),name))){
                                ref_name=await name["substr"].call(name,2)
                            } else {
                                ref_name=name
                            };
                            ref_name=await first(await (await Environment.get_global("get_object_path"))(ref_name));
                            return await async function(){
                                if (check_true (await (async function(){
                                    let __targ__42=(ctx && ctx["ambiguous"]);
                                    if (__targ__42){
                                         return(__targ__42)[ref_name]
                                    } 
                                })())) {
                                    return true
                                } else if (check_true ((ctx && ctx["parent"]))) {
                                    return await is_ambiguous_ques_((ctx && ctx["parent"]),ref_name)
                                }
                            } ()
                        }
                    }
                } ()
            };
            set_ambiguous=async function(ctx,name) {
                return await async function(){
                    let __target_obj__43=(ctx && ctx["ambiguous"]);
                    __target_obj__43[name]=true;
                    return __target_obj__43;
                    
                }()
            };
            unset_ambiguous=async function(ctx,name) {
                return await (await Environment.get_global("delete_prop"))((ctx && ctx["ambiguous"]),name)
            };
            invalid_js_ref_chars="+?-%&^#!*[]~{}/|";
            invalid_js_ref_chars_regex=new RegExp("[/\%\+\[\>\?\<\\}\{&\#\^\=\~\*\!\)\(\-]+","g");
            check_invalid_js_ref=async function(symname) {
                return await async function(){
                    if (check_true (await not((symname instanceof String || typeof symname==='string')))) {
                        return false
                    } else if (check_true (((symname instanceof String || typeof symname==='string')&& (await length(symname)>2)&& await starts_with_ques_(await (async function(){
                         return "=:" 
                    })(),symname)))) {
                        return (await length(await (await Environment.get_global("scan_str"))(invalid_js_ref_chars_regex,await symname["substr"].call(symname,2)))>0)
                    } else {
                        return (await length(await (await Environment.get_global("scan_str"))(invalid_js_ref_chars_regex,symname))>0)
                    }
                } ()
            };
            let sanitize_js_ref_name=await __sanitize_js_ref_name__4();
            ;
            find_in_context=async function(ctx,name) {
                let symname;
                let ref;
                let __is_literal_ques___44= async function(){
                    return (await is_number_ques_(name)|| (await not(ref)&& (name instanceof String || typeof name==='string'))|| ("nil"===symname)|| ("null"===symname)|| (ref&& ("undefined"===symname))|| (ref&& ("else"===symname))|| (ref&& ("catch"===symname))|| (true===name)|| (false===name))
                };
                let special;
                let local;
                let global;
                let val;
                {
                    symname=await (async function(){
                         return await async function(){
                            if (check_true (((name instanceof String || typeof name==='string')&& (await length(name)>2)&& await starts_with_ques_(await (async function(){
                                 return "=:" 
                            })(),name)))) {
                                return await name["substr"].call(name,2)
                            } else if (check_true ((name instanceof String || typeof name==='string'))) {
                                return name
                            } else {
                                {
                                    if (check_true ((name===null))){
                                        {
                                            name=await (async function(){
                                                 return "=:nil" 
                                            })()
                                        }
                                    };
                                    return "null"
                                }
                            }
                        } () 
                    })();
                    ref=(symname&& ((name instanceof String || typeof name==='string')&& (await length(name)>2)&& await starts_with_ques_(await (async function(){
                         return "=:" 
                    })(),name)));
                    let is_literal_ques_=await __is_literal_ques___44();
                    ;
                    special=(ref&& symname&& await contains_ques_(symname,await conj(["unquotem","quotem"],await (await Environment.get_global("keys"))(op_lookup))));
                    local=(await not(special)&& await not(is_literal_ques_)&& symname&& ref&& await get_ctx_val(ctx,symname));
                    global=(await not(special)&& await not(is_literal_ques_)&& ref&& symname&& await get_lisp_ctx(ctx,symname));
                    val=await (async function(){
                         return await async function(){
                            if (check_true (is_literal_ques_)) {
                                return name
                            } else if (check_true ((name instanceof Array))) {
                                return name
                            } else if (check_true ((name instanceof Object))) {
                                return name
                            } else if (check_true (special)) {
                                return name
                            } else if (check_true (local)) {
                                return local
                            } else if (check_true ((await not((global===undefined))&& await not((global===NOT_FOUND))))) {
                                return global
                            } else if (check_true ((symname===name))) {
                                return name
                            }
                        } () 
                    })();
                    return {
                        type:await (async function(){
                             return await async function(){
                                if (check_true ((name instanceof Array))) {
                                    return "arr"
                                } else if (check_true (name instanceof Element)) {
                                    return "dom"
                                } else if (check_true ((name instanceof Object))) {
                                    return await sub_type(name)
                                } else if (check_true (special)) {
                                    return "special"
                                } else if (check_true (is_literal_ques_)) {
                                    return "literal"
                                } else if (check_true (local)) {
                                    return await sub_type(local)
                                } else if (check_true (await not((undefined==global)))) {
                                    return await sub_type(global)
                                } else if (check_true ((ref&& symname))) {
                                    return "unbound"
                                } else if (check_true ((name===undefined))) {
                                    return "literal"
                                } else {
                                    {
                                        await error_log("find_in_context: unknown type: ",name);
                                        debugger;
                                        ;
                                        return "??"
                                    }
                                }
                            } () 
                        })(),name:await (async function(){
                             return await async function(){
                                if (check_true ((symname&& ref))) {
                                    return await sanitize_js_ref_name(symname)
                                } else if (check_true ((false&& is_literal_ques_&& (val instanceof String || typeof val==='string')))) {
                                    return await sanitize_js_ref_name(name)
                                } else if (check_true (is_literal_ques_)) {
                                    if (check_true (ref)){
                                        return await sanitize_js_ref_name(name)
                                    } else {
                                        return name
                                    }
                                } else {
                                    return null
                                }
                            } () 
                        })(),val:await (async function(){
                            if (check_true ((val===undefined))){
                                return undefined
                            } else {
                                return val
                            }
                        })(),ref:await (async function(){
                            if (check_true (ref)){
                                return true
                            } else {
                                return false
                            }
                        })(),local:(local|| null),global:((await not((undefined===global))&& await not((NOT_FOUND===global)))|| null)
                    }
                }
            };
            source_chain=async function(cpath,tree,sources) {
                if (check_true (((cpath instanceof Array)&& tree))){
                    {
                        let source;
                        sources=(sources|| []);
                        source=null;
                        cpath=await (await Environment.get_global("chop"))(cpath);
                        source=await (await Environment.get_global("as_lisp"))(await (await Environment.get_global("resolve_path"))(cpath,tree));
                        if (check_true (((source && source.length)>80))){
                            source=await add(await source["substr"].call(source,0,80),"...")
                        };
                        if (check_true (await not(await (await Environment.get_global("blank?"))(source)))){
                            {
                                (sources).push(source)
                            }
                        };
                        if (check_true ((((cpath && cpath.length)>0)&& ((sources && sources.length)<4)))){
                            await source_chain(cpath,tree,sources)
                        };
                        return sources
                    }
                }
            };
            source_from_tokens=async function(tokens,tree,collect_parents_ques_) {
                return await async function(){
                    if (check_true (((tokens && tokens["path"])&& collect_parents_ques_))) {
                        return await source_chain((tokens && tokens["path"]),tree)
                    } else if (check_true ((tree instanceof String || typeof tree==='string'))) {
                        return await (await Environment.get_global("as_lisp"))(tree)
                    } else if (check_true ((tokens && tokens["path"]))) {
                        return await (await Environment.get_global("as_lisp"))(await (await Environment.get_global("resolve_path"))((tokens && tokens["path"]),tree))
                    } else if (check_true (((tokens instanceof Array)&& (tokens && tokens["0"] && tokens["0"]["path"])&& collect_parents_ques_))) {
                        return await source_chain((tokens && tokens["0"] && tokens["0"]["path"]),tree)
                    } else if (check_true (((tokens instanceof Array)&& (tokens && tokens["0"] && tokens["0"]["path"])))) {
                        return await (await Environment.get_global("as_lisp"))(await (await Environment.get_global("resolve_path"))(await (await Environment.get_global("chop"))((tokens && tokens["0"] && tokens["0"]["path"])),tree))
                    } else if (check_true (((undefined===tokens)&& await not((undefined===tree))))) {
                        return await (await Environment.get_global("as_lisp"))(tree)
                    } else {
                        {
                            if (check_true (await verbosity(ctx))){
                                {
                                    await console.warn("source_from_tokens: unable to determine source path from: ",await (async function(){
                                         return await (async function(){
                                            let __array_op_rval__45=clone;
                                             if (__array_op_rval__45 instanceof Function){
                                                return await __array_op_rval__45(tokens) 
                                            } else {
                                                return [__array_op_rval__45,tokens]
                                            }
                                        })() 
                                    })())
                                }
                            };
                            return ""
                        }
                    }
                } ()
            };
            source_comment=async function(tokens) {
                return {
                    comment:await source_from_tokens(tokens,expanded_tree)
                }
            };
            NOT_FOUND="__!NOT_FOUND!__";
            THIS_REFERENCE=async function() {
                return "this"
            };
            NOT_FOUND_THING=async function() {
                return true
            };
            get_lisp_ctx_log=await (async function(){
                if (check_true ((opts && opts["quiet_mode"]))){
                    return log
                } else {
                    return await defclog({
                        prefix:"get_lisp_ctx",color:"darkgreen",background:"#A0A0A0"
                    })
                }
            })();
            get_lisp_ctx=async function(ctx,name) {
                if (check_true (await not((name instanceof String || typeof name==='string')))){
                    throw new Error("Compiler Error: get_lisp_ctx passed a non string identifier");
                    
                } else {
                    {
                        let comps;
                        let cannot_be_js_global;
                        let ref_name;
                        let ref_type;
                        comps=await (await Environment.get_global("get_object_path"))(name);
                        cannot_be_js_global=await check_invalid_js_ref((comps && comps["0"]));
                        ref_name=(comps).shift();
                        ref_type=await (async function(){
                            if (check_true ((ref_name==="this"))){
                                return THIS_REFERENCE
                            } else {
                                {
                                    let global_ref=await (async function(){
                                        let __targ__46=(root_ctx && root_ctx["defined_lisp_globals"]);
                                        if (__targ__46){
                                             return(__targ__46)[ref_name]
                                        } 
                                    })();
                                    ;
                                    if (check_true (((undefined==global_ref)|| (global_ref==="statement")))){
                                        return await Environment["get_global"].call(Environment,ref_name,NOT_FOUND_THING,cannot_be_js_global)
                                    } else {
                                        return global_ref
                                    }
                                }
                            }
                        })();
                        await async function(){
                            if (check_true ((await not((NOT_FOUND_THING===ref_type))&& await not(await contains_ques_(ref_name,standard_types))))) {
                                {
                                    await referenced_global_symbols["add"].call(referenced_global_symbols,ref_name);
                                    {
                                        let it;
                                        it=await get_ctx(ctx,"__GLOBALS__");
                                        if (check_true (it)){
                                            return await it["add"].call(it,ref_name)
                                        } else {
                                            return 
                                        }
                                    }
                                }
                            } else if (check_true ((await not((NOT_FOUND_THING===ref_type))&& await externals["has"].call(externals,ref_name)))) {
                                {
                                    await referenced_externals["add"].call(referenced_externals,ref_name);
                                    {
                                        let it;
                                        it=await get_ctx(ctx,"__EXTERNALS__");
                                        if (check_true (it)){
                                            {
                                                return await it["add"].call(it,ref_name)
                                            }
                                        } else {
                                            return 
                                        }
                                    }
                                }
                            }
                        } ();
                        return await async function(){
                            if (check_true ((NOT_FOUND_THING===ref_type))) {
                                return undefined
                            } else if (check_true ((ref_type===THIS_REFERENCE))) {
                                return ref_type
                            } else if (check_true (((comps && comps.length)===0))) {
                                return ref_type
                            } else if (check_true ((((comps && comps.length)===1)&& (ref_type instanceof Object)&& await contains_ques_((comps && comps["0"]),await (async function(){
                                 return await object_methods(ref_type) 
                            })())))) {
                                return ref_type[(comps && comps["0"])]
                            } else if (check_true ((ref_type instanceof Function&& await is_ambiguous_ques_(root_ctx,ref_name)))) {
                                return ref_type
                            } else if (check_true ((ref_type instanceof Array))) {
                                return ref_type
                            } else if (check_true ((ref_type==="array"))) {
                                return []
                            } else if (check_true ((((comps && comps.length)===1)&& (ref_type instanceof Object)))) {
                                {
                                    let v=ref_type[(comps && comps["0"])];
                                    ;
                                    if (check_true (v)){
                                        return v
                                    } else {
                                        return ref_type
                                    }
                                }
                            } else if (check_true ((ref_type instanceof Object))) {
                                return (await (await Environment.get_global("resolve_path"))(comps,ref_type)|| ref_type)
                            } else if (check_true (((typeof ref_type==="object")&& await contains_ques_((comps && comps["0"]),await Object["keys"].call(Object,ref_type))))) {
                                {
                                    await (async function(){
                                         let __test_condition__47=async function() {
                                            return ((ref_type==undefined)|| ((comps && comps.length)>0))
                                        };
                                        let __body_ref__48=async function() {
                                            return ref_type=ref_type[(comps).shift()]
                                        };
                                        let __BREAK__FLAG__=false;
                                        while(await __test_condition__47()) {
                                             await __body_ref__48();
                                             if(__BREAK__FLAG__) {
                                                 break;
                                                
                                            }
                                        } ;
                                        
                                    })();
                                    return ref_type
                                }
                            } else if (check_true ((ref_type==="objliteral"))) {
                                return ref_type
                            } else {
                                {
                                    debugger;
                                    ;
                                    await (async function(){
                                        let __array_op_rval__49=get_lisp_ctx_log;
                                         if (__array_op_rval__49 instanceof Function){
                                            return await __array_op_rval__49("symbol not found: ",name,ref_name,ref_type,cannot_be_js_global) 
                                        } else {
                                            return [__array_op_rval__49,"symbol not found: ",name,ref_name,ref_type,cannot_be_js_global]
                                        }
                                    })();
                                    return undefined
                                }
                            }
                        } ()
                    }
                }
            };
            get_val=async function(token,ctx) {
                return await async function(){
                    if (check_true ((token && token["ref"]))) {
                        {
                            let comps=((token && token.name)).split(".");
                            ;
                            let ref_name=await (async function(){
                                if (check_true (((await safety_level(ctx)>1)&& ((comps && comps.length)>1)))){
                                    return await (await Environment.get_global("safe_access"))(token,ctx,sanitize_js_ref_name)
                                } else {
                                    return await sanitize_js_ref_name(await (async function(){
                                         return await (await Environment.get_global("expand_dot_accessor"))((token && token.name),ctx) 
                                    })())
                                }
                            })();
                            ;
                            if (check_true (await verbosity(ctx))){
                                {
                                    console.log("get_val: reference: ",await (async function(){
                                         return await (await Environment.get_global("safe_access"))(token,ctx,sanitize_js_ref_name) 
                                    })(),ref_name,":",await get_ctx(ctx,ref_name))
                                }
                            };
                            return await async function(){
                                if (check_true ((await get_ctx(ctx,"__IN_QUOTEM__")&& await not(await get_ctx(ctx,"__IN_LAMBDA__"))))) {
                                    return await get_ctx(ctx,ref_name)
                                } else if (check_true ((false&& await get_ctx(ctx,"__IN_QUOTEM__")&& await get_ctx(ctx,"__IN_LAMBDA__")))) {
                                    return ("await ctx_access(\""+ ref_name+ "\")")
                                } else {
                                    return ref_name
                                }
                            } ()
                        }
                    } else {
                        return (token && token["val"])
                    }
                } ()
            };
            has_lisp_globals=false;
            root_ctx=await (async function(){
                 return await new_ctx(((opts && opts["ctx"]))) 
            })();
            tokenize_object=async function(obj,ctx,_path) {
                let ser=null;
                ;
                {
                    try {
                        ser=await JSON.stringify(obj)
                    } catch (__exception__50) {
                        if (__exception__50 instanceof TypeError) {
                            let e=__exception__50;
                            {
                                {
                                    await console.warn("compiler: cannot tokenize: ",obj,e);
                                    ser="{}"
                                }
                            }
                        } else throw __exception__50;
                        
                    };
                    _path=(_path|| []);
                    if (check_true ((ser==="{}"))){
                        {
                            return {
                                type:"object",ref:false,val:"{}",name:"{}",__token__:true,path:_path
                            }
                        }
                    } else {
                        return await (async function() {
                            let __for_body__53=async function(pset) {
                                return {
                                    type:"keyval",val:await tokenize(pset,ctx,"path:",await add(_path,(pset && pset["0"]))),ref:false,name:(""+ await (await Environment.get_global("as_lisp"))((pset && pset["0"]))),__token__:true
                                }
                            };
                            let __array__54=[],__elements__52=await (await Environment.get_global("pairs"))(obj);
                            let __BREAK__FLAG__=false;
                            for(let __iter__51 in __elements__52) {
                                __array__54.push(await __for_body__53(__elements__52[__iter__51]));
                                if(__BREAK__FLAG__) {
                                     __array__54.pop();
                                    break;
                                    
                                }
                            }return __array__54;
                             
                        })()
                    }
                }
            };
            tokenize_quote=async function(args,_path) {
                return await async function(){
                    if (check_true (((args && args["0"])==="=:quote"))) {
                        return {
                            type:"arr",__token__:true,source:await (await Environment.get_global("as_lisp"))(args),val:await conj(await (async function(){
                                 return [{
                                    type:"special",val:await (async function(){
                                         return "=:quote" 
                                    })(),ref:true,name:"quote",__token__:true
                                }] 
                            })(),await args["slice"].call(args,1)),ref:((args instanceof String || typeof args==='string')&& (await length(args)>2)&& await starts_with_ques_(await (async function(){
                                 return "=:" 
                            })(),args)),name:null,path:_path
                        }
                    } else if (check_true (((args && args["0"])==="=:quotem"))) {
                        return {
                            type:"arr",__token__:true,source:await (await Environment.get_global("as_lisp"))(args),val:await conj(await (async function(){
                                 return [{
                                    type:"special",path:await conj(_path,[0]),val:await (async function(){
                                         return "=:quotem" 
                                    })(),ref:true,name:"quotem",__token__:true
                                }] 
                            })(),await args["slice"].call(args,1)),ref:((args instanceof String || typeof args==='string')&& (await length(args)>2)&& await starts_with_ques_(await (async function(){
                                 return "=:" 
                            })(),args)),name:null,path:_path
                        }
                    } else {
                        return {
                            type:"arr",__token__:true,source:await (await Environment.get_global("as_lisp"))(args),val:await conj(await (async function(){
                                 return [{
                                    type:"special",val:await (async function(){
                                         return "=:quotel" 
                                    })(),ref:true,name:"quotel",__token__:true
                                }] 
                            })(),await args["slice"].call(args,1)),ref:((args instanceof String || typeof args==='string')&& (await length(args)>2)&& await starts_with_ques_(await (async function(){
                                 return "=:" 
                            })(),args)),name:null,path:_path
                        }
                    }
                } ()
            };
            tokenize=async function(args,ctx,_path,_suppress_comptime_eval) {
                let argtype;
                let rval;
                let qval;
                let idx;
                let tobject;
                let argdetails;
                let argvalue;
                let is_ref;
                argtype=null;
                rval=null;
                ctx=ctx;
                _path=(_path|| []);
                qval=null;
                idx=-1;
                tobject=null;
                argdetails=null;
                argvalue=null;
                is_ref=null;
                ;
                if (check_true ((null==ctx))){
                    {
                        await console.error("tokenize: nil ctx passed: ",await (async function(){
                             return await (async function(){
                                let __array_op_rval__55=clone;
                                 if (__array_op_rval__55 instanceof Function){
                                    return await __array_op_rval__55(args) 
                                } else {
                                    return [__array_op_rval__55,args]
                                }
                            })() 
                        })());
                        throw new ReferenceError("nil/undefined ctx passed to tokenize");
                        
                    }
                };
                if (check_true (((args instanceof Array)&& await not(_suppress_comptime_eval)))){
                    {
                        args=await compile_time_eval(ctx,args,_path);
                        await async function(){
                            if (check_true (((_path && _path.length)>1))) {
                                {
                                    tobject=await (await Environment.get_global("resolve_path"))(await (await Environment.get_global("chop"))(_path),expanded_tree);
                                    if (check_true (tobject)){
                                        {
                                            return await async function(){
                                                tobject[await last(_path)]=args;
                                                return tobject;
                                                
                                            }()
                                        }
                                    }
                                }
                            } else if (check_true (((_path && _path.length)===1))) {
                                {
                                    await async function(){
                                        expanded_tree[await first(_path)]=args;
                                        return expanded_tree;
                                        
                                    }()
                                }
                            } else {
                                expanded_tree=args
                            }
                        } ()
                    }
                };
                return await async function(){
                    if (check_true (((args instanceof String || typeof args==='string')|| await is_number_ques_(args)|| ((args===true)|| (args===false))))) {
                        return await first(await tokenize([args],ctx,_path,true))
                    } else if (check_true (((args instanceof Array)&& (((args && args["0"])==="=:quotem")|| ((args && args["0"])==="=:quote")|| ((args && args["0"])==="=:quotel"))))) {
                        {
                            rval=await tokenize_quote(args,_path);
                            return rval
                        }
                    } else if (check_true (((args instanceof Array)&& await not(await get_ctx_val(ctx,"__IN_LAMBDA__"))&& ((args && args["0"])==="=:iprogn")))) {
                        {
                            rval=await compile_toplevel(args,ctx);
                            return await tokenize(rval,ctx,_path)
                        }
                    } else if (check_true ((await not((args instanceof Array))&& (args instanceof Object)))) {
                        return await first(await tokenize([args],ctx,await add(_path,0)))
                    } else {
                        {
                            if (check_true ((((args && args["0"])==="=:fn")|| ((args && args["0"])==="=:function")|| ((args && args["0"])==="=:=>")))){
                                {
                                    ctx=await (async function(){
                                         return await new_ctx(ctx) 
                                    })();
                                    await set_ctx(ctx,"__IN_LAMBDA__",true)
                                }
                            };
                            return await (async function() {
                                let __for_body__60=async function(arg) {
                                    idx+=1;
                                    try {
                                        argdetails=await find_in_context(ctx,arg)
                                    } catch (__exception__62) {
                                        if (__exception__62 instanceof LispSyntaxError) {
                                            let e=__exception__62;
                                            {
                                                {
                                                    is_error={
                                                        error:(e && e["name"]),source_name:source_name,message:(e && e.message),form:await (await Environment.get_global("resolve_path"))(_path,expanded_tree),parent_forms:((await (await Environment.get_global("chop"))(_path)&& await (await Environment.get_global("resolve_path"))(await (await Environment.get_global("chop"))(_path),expanded_tree))|| []),invalid:true
                                                    };
                                                    await async function(){
                                                        e["details"]=is_error;
                                                        e["handled"]=true;
                                                        return e;
                                                        
                                                    }();
                                                    await console.error(is_error);
                                                    debugger;
                                                    ;
                                                    throw e;
                                                    
                                                }
                                            }
                                        } else throw __exception__62;
                                        
                                    };
                                    argvalue=(argdetails && argdetails["val"]);
                                    argtype=(argdetails && argdetails["type"]);
                                    is_ref=(argdetails && argdetails["ref"]);
                                    return await async function(){
                                        if (check_true ((await sub_type(arg)==="array"))) {
                                            return {
                                                type:"arr",__token__:true,val:await tokenize(arg,ctx,await add(_path,idx)),ref:is_ref,name:null,path:await add(_path,idx)
                                            }
                                        } else if (check_true ((argtype==="Function"))) {
                                            return {
                                                type:"fun",__token__:true,val:arg,ref:is_ref,name:(""+ await (await Environment.get_global("as_lisp"))(arg)),global:(argdetails && argdetails["global"]),path:await add(_path,idx)
                                            }
                                        } else if (check_true ((argtype==="AsyncFunction"))) {
                                            return {
                                                type:"asf",__token__:true,val:arg,ref:is_ref,name:(""+ await (await Environment.get_global("as_lisp"))(arg)),global:(argdetails && argdetails["global"]),path:await add(_path,idx)
                                            }
                                        } else if (check_true ((argtype==="array"))) {
                                            return {
                                                type:"array",__token__:true,val:arg,ref:is_ref,name:(""+ await (await Environment.get_global("as_lisp"))(arg)),global:(argdetails && argdetails["global"]),path:await add(_path,idx)
                                            }
                                        } else if (check_true ((argtype==="Number"))) {
                                            return {
                                                type:"num",__token__:true,val:argvalue,ref:is_ref,name:(""+ await (await Environment.get_global("as_lisp"))(arg)),global:(argdetails && argdetails["global"]),path:await add(_path,idx)
                                            }
                                        } else if (check_true (((argtype==="String")&& is_ref))) {
                                            return {
                                                type:"arg",__token__:true,val:argvalue,ref:is_ref,name:await clean_quoted_reference((""+ await (await Environment.get_global("as_lisp"))(arg))),global:(argdetails && argdetails["global"]),local:(argdetails && argdetails["local"]),path:await add(_path,idx)
                                            }
                                        } else if (check_true ((argtype==="String"))) {
                                            return {
                                                type:"literal",__token__:true,val:argvalue,ref:is_ref,name:await clean_quoted_reference((""+ await (await Environment.get_global("as_lisp"))(arg))),global:(argdetails && argdetails["global"]),path:await add(_path,idx)
                                            }
                                        } else if (check_true ((argtype==="dom"))) {
                                            return {
                                                type:"null",__token__:true,val:null,ref:is_ref,name:await clean_quoted_reference((""+ await (await Environment.get_global("as_lisp"))(arg))),global:(argdetails && argdetails["global"]),path:await add(_path,idx)
                                            }
                                        } else if (check_true ((arg instanceof Object))) {
                                            {
                                                return {
                                                    type:"objlit",__token__:true,val:await tokenize_object(arg,ctx,await add(_path,idx)),ref:is_ref,name:null,path:await add(_path,idx)
                                                }
                                            }
                                        } else if (check_true (((argtype==="literal")&& is_ref&& ((""+ await (await Environment.get_global("as_lisp"))(arg))==="nil")))) {
                                            return {
                                                type:"null",__token__:true,val:null,ref:true,name:"null",path:await add(_path,idx)
                                            }
                                        } else if (check_true (((argtype==="unbound")&& is_ref&& (null==argvalue)))) {
                                            return {
                                                type:"arg",__token__:true,val:arg,ref:true,name:await clean_quoted_reference((""+ await (await Environment.get_global("as_lisp"))(arg))),global:(argdetails && argdetails["global"]),path:await add(_path,idx)
                                            }
                                        } else if (check_true (((argtype==="unbound")&& is_ref))) {
                                            return {
                                                type:await sub_type(argvalue),__token__:true,val:argvalue,ref:true,name:await clean_quoted_reference(await sanitize_js_ref_name((""+ await (await Environment.get_global("as_lisp"))(arg)))),path:await add(_path,idx)
                                            }
                                        } else {
                                            return {
                                                type:argtype,__token__:true,val:argvalue,ref:is_ref,name:await clean_quoted_reference((""+ await (await Environment.get_global("as_lisp"))(arg))),global:(argdetails && argdetails["global"]),local:(argdetails && argdetails["local"]),path:await add(_path,idx)
                                            }
                                        }
                                    } ()
                                };
                                let __array__61=[],__elements__59=args;
                                let __BREAK__FLAG__=false;
                                for(let __iter__58 in __elements__59) {
                                    __array__61.push(await __for_body__60(__elements__59[__iter__58]));
                                    if(__BREAK__FLAG__) {
                                         __array__61.pop();
                                        break;
                                        
                                    }
                                }return __array__61;
                                 
                            })()
                        }
                    }
                } ()
            };
            comp_time_log=await (async function(){
                 return await defclog({
                    prefix:"compile_time_eval",background:"#C0C0C0",color:"darkblue"
                }) 
            })();
            compile_time_eval=async function(ctx,lisp_tree,path) {
                if (check_true (((lisp_tree instanceof Array)&& (((lisp_tree && lisp_tree["0"]) instanceof String || typeof (lisp_tree && lisp_tree["0"])==='string')&& (await length((lisp_tree && lisp_tree["0"]))>2)&& await starts_with_ques_(await (async function(){
                     return "=:" 
                })(),(lisp_tree && lisp_tree["0"])))&& await (async function(){
                    let it;
                    it=await Environment["symbol_definition"].call(Environment,await (lisp_tree && lisp_tree["0"])["substr"].call((lisp_tree && lisp_tree["0"]),2));
                    if (check_true (it)){
                        return await (await Environment.get_global("resolve_path"))(["eval_when","compile_time"],it)
                    } else {
                        return 
                    }
                })()))){
                    {
                        let ntree;
                        let precompile_function;
                        ntree=null;
                        precompile_function=await Environment["get_global"].call(Environment,await (lisp_tree && lisp_tree["0"])["substr"].call((lisp_tree && lisp_tree["0"]),2));
                        if (check_true (await verbosity(ctx))){
                            {
                                await comp_time_log(path,"->",await (lisp_tree && lisp_tree["0"])["substr"].call((lisp_tree && lisp_tree["0"]),2),lisp_tree,"to function: ",await lisp_tree["slice"].call(lisp_tree,1))
                            }
                        };
                        try {
                            ntree=await (async function(){
                                let __apply_args__65=await (async function(){
                                     return await lisp_tree["slice"].call(lisp_tree,1) 
                                })();
                                return ( precompile_function).apply(this,__apply_args__65)
                            })()
                        } catch (__exception__64) {
                            if (__exception__64 instanceof Error) {
                                let e=__exception__64;
                                {
                                    {
                                        await async function(){
                                            e["handled"]=true;
                                            return e;
                                            
                                        }();
                                        (errors).push({
                                            error:(e && e.name),message:(e && e.message),source_name:source_name,precompilation:true,form:lisp_tree,parent_forms:[],invalid:true,stack:(e && e.stack)
                                        });
                                        throw e;
                                        
                                    }
                                }
                            }
                        };
                        if (check_true ((null==ntree))){
                            (warnings).push(("compile time function "+ await (lisp_tree && lisp_tree["0"])["substr"].call((lisp_tree && lisp_tree["0"]),2)+ " returned nil"))
                        } else {
                            {
                                ntree=await (async function(){
                                     return await do_deferred_splice(ntree) 
                                })();
                                if (check_true (await not((await JSON.stringify(ntree)===await JSON.stringify(lisp_tree))))){
                                    {
                                        ntree=await compile_time_eval(ctx,ntree,path)
                                    }
                                };
                                if (check_true (await verbosity(ctx))){
                                    {
                                        await comp_time_log(await (lisp_tree && lisp_tree["0"])["substr"].call((lisp_tree && lisp_tree["0"]),2),"<- lisp: ",await (await Environment.get_global("as_lisp"))(ntree))
                                    }
                                }
                            }
                        };
                        return ntree
                    }
                } else {
                    return lisp_tree
                }
            };
            infix_ops=async function(tokens,ctx,opts) {
                let op_translation;
                let math_op_a;
                let math_op;
                let idx;
                let stmts;
                let declaration;
                let symbol_ctx_val;
                let is_overloaded;
                let token;
                let add_operand;
                let acc;
                op_translation={
                    or:"||",and:"&&"
                };
                ctx=await (async function(){
                     return await new_ctx(ctx) 
                })();
                math_op_a=await (async function(){
                    let __targ__68=await first(tokens);
                    if (__targ__68){
                         return(__targ__68)["name"]
                    } 
                })();
                math_op=(op_translation[math_op_a]|| math_op_a);
                idx=0;
                stmts=null;
                declaration=await (async function(){
                    if (check_true (((tokens && tokens["1"] && tokens["1"]["name"]) instanceof String || typeof (tokens && tokens["1"] && tokens["1"]["name"])==='string'))){
                        return await get_declarations(ctx,(tokens && tokens["1"] && tokens["1"]["name"]),await not((tokens && tokens["1"] && tokens["1"]["ref"])))
                    } else {
                        return null
                    }
                })();
                symbol_ctx_val=await (async function(){
                    if (check_true (((tokens && tokens["1"] && tokens["1"]["ref"])&& ((tokens && tokens["1"] && tokens["1"]["name"]) instanceof String || typeof (tokens && tokens["1"] && tokens["1"]["name"])==='string')))){
                        return await get_ctx_val(ctx,(tokens && tokens["1"] && tokens["1"]["name"]))
                    }
                })();
                is_overloaded=false;
                token=null;
                add_operand=async function() {
                    if (check_true (((idx>1)&& (idx<((tokens && tokens.length)- 0))))){
                        {
                            (acc).push(math_op);
                            return (acc).push(" ")
                        }
                    }
                };
                acc=await (async function(){
                     return [{
                        ctype:"expression"
                    }] 
                })();
                await set_ctx(ctx,"__COMP_INFIX_OPS__",true);
                if (check_true (((symbol_ctx_val instanceof Array)&& (symbol_ctx_val && symbol_ctx_val["0"] && symbol_ctx_val["0"]["ctype"])))){
                    {
                        symbol_ctx_val=(symbol_ctx_val && symbol_ctx_val["0"] && symbol_ctx_val["0"]["ctype"])
                    }
                };
                if (check_true (((((declaration && declaration["type"])===Array)|| ((declaration && declaration["type"])===Object)|| (symbol_ctx_val==="objliteral")|| (symbol_ctx_val===Expression)|| (symbol_ctx_val===ArgumentType)|| ((tokens && tokens["1"] && tokens["1"]["type"])==="objlit")|| ((tokens && tokens["1"] && tokens["1"]["type"])==="arr"))&& (math_op==="+")))){
                    {
                        is_overloaded=true
                    }
                };
                if (check_true (is_overloaded)){
                    {
                        await async function(){
                            tokens[0]={
                                type:"function",val:await add(await (async function(){
                                     return "=:" 
                                })(),"add"),name:"add",ref:true
                            };
                            return tokens;
                            
                        }();
                        await async function(){
                            ctx["block_step"]=0;
                            return ctx;
                            
                        }();
                        stmts=await compile_wrapper_fn(tokens,ctx);
                        return stmts
                    }
                } else {
                    {
                        (acc).push("(");
                        await (async function(){
                             let __test_condition__71=async function() {
                                return (idx<((tokens && tokens.length)- 1))
                            };
                            let __body_ref__72=async function() {
                                idx+=1;
                                token=tokens[idx];
                                await add_operand();
                                await async function(){
                                    ctx["block_step"]=0;
                                    return ctx;
                                    
                                }();
                                return (acc).push(await compile_wrapper_fn(token,ctx))
                            };
                            let __BREAK__FLAG__=false;
                            while(await __test_condition__71()) {
                                 await __body_ref__72();
                                 if(__BREAK__FLAG__) {
                                     break;
                                    
                                }
                            } ;
                            
                        })();
                        (acc).push(")");
                        return acc
                    }
                }
            };
            compile_set_prop=async function(tokens,ctx) {
                let acc;
                let wrapper;
                let stmt;
                let preamble;
                let token;
                let complicated;
                let target;
                let target_reference;
                let idx;
                acc=[];
                wrapper=[];
                stmt=null;
                preamble=await calling_preamble(ctx);
                token=await second(tokens);
                ctx=await (async function(){
                     return await new_ctx(ctx) 
                })();
                complicated=await is_complex_ques_((token && token["val"]));
                target=await (async function(){
                    if (check_true (complicated)){
                        return await compile_wrapper_fn((token && token["val"]),ctx)
                    } else {
                        return await compile(token,ctx)
                    }
                })();
                target_reference=await gen_temp_name("target_obj");
                idx=1;
                ;
                if (check_true (((token && token["name"])==="this"))){
                    {
                        (acc).push("this.");
                        (acc).push((tokens && tokens["2"] && tokens["2"]["name"]));
                        (acc).push("=");
                        (acc).push(await compile_wrapper_fn((tokens && tokens["3"]),ctx));
                        return acc
                    }
                } else {
                    {
                        await set_new_completion_scope(ctx);
                        await (async function() {
                            let __for_body__76=async function(t) {
                                return (wrapper).push(t)
                            };
                            let __array__77=[],__elements__75=[(preamble && preamble["0"])," ",(preamble && preamble["1"])," ",(preamble && preamble["3"]),"function","()","{"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__74 in __elements__75) {
                                __array__77.push(await __for_body__76(__elements__75[__iter__74]));
                                if(__BREAK__FLAG__) {
                                     __array__77.pop();
                                    break;
                                    
                                }
                            }return __array__77;
                             
                        })();
                        if (check_true (await not((target instanceof String || typeof target==='string')))){
                            await (async function() {
                                let __for_body__80=async function(t) {
                                    return (wrapper).push(t)
                                };
                                let __array__81=[],__elements__79=["let"," ",target_reference,"=",target,";"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__78 in __elements__79) {
                                    __array__81.push(await __for_body__80(__elements__79[__iter__78]));
                                    if(__BREAK__FLAG__) {
                                         __array__81.pop();
                                        break;
                                        
                                    }
                                }return __array__81;
                                 
                            })()
                        } else {
                            {
                                target_reference=target
                            }
                        };
                        await (async function(){
                             let __test_condition__82=async function() {
                                return (idx<((tokens && tokens.length)- 1))
                            };
                            let __body_ref__83=async function() {
                                idx+=1;
                                (acc).push(target_reference);
                                token=tokens[idx];
                                (acc).push("[");
                                stmt=await compile_as_call(token,ctx);
                                (acc).push(stmt);
                                (acc).push("]");
                                idx+=1;
                                (acc).push("=");
                                token=tokens[idx];
                                if (check_true ((null==token))){
                                    throw new SyntaxError("set_prop: odd number of arguments");
                                    
                                };
                                stmt=await compile_wrapper_fn(token,ctx);
                                (acc).push(stmt);
                                return (acc).push(";")
                            };
                            let __BREAK__FLAG__=false;
                            while(await __test_condition__82()) {
                                 await __body_ref__83();
                                 if(__BREAK__FLAG__) {
                                     break;
                                    
                                }
                            } ;
                            
                        })();
                        (wrapper).push(acc);
                        (wrapper).push("return");
                        (wrapper).push(" ");
                        (wrapper).push(target_reference);
                        (wrapper).push(";");
                        (wrapper).push("}");
                        (wrapper).push((preamble && preamble["4"]));
                        (wrapper).push("()");
                        return wrapper
                    }
                }
            };
            compile_prop=async function(tokens,ctx) {
                if (check_true (await not(((tokens && tokens.length)===3)))){
                    {
                        throw new SyntaxError("prop requires exactly 2 arguments");
                        
                    }
                } else {
                    {
                        let acc;
                        let target;
                        let target_val;
                        let preamble;
                        let idx_key;
                        acc=[];
                        target=await compile_wrapper_fn(await second(tokens),ctx);
                        target_val=null;
                        preamble=await calling_preamble(ctx);
                        idx_key=await compile_wrapper_fn(tokens[2],ctx);
                        ;
                        if (check_true ((await safety_level(ctx)>1))){
                            return await async function(){
                                if (check_true ((target instanceof String || typeof target==='string'))) {
                                    {
                                        return await (async function(){
                                            let __array_op_rval__84=target;
                                             if (__array_op_rval__84 instanceof Function){
                                                return await __array_op_rval__84("[",idx_key,"]") 
                                            } else {
                                                return [__array_op_rval__84,"[",idx_key,"]"]
                                            }
                                        })()
                                    }
                                } else {
                                    {
                                        target_val=await gen_temp_name("targ");
                                        return [(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()","{","let"," ",target_val,"=",target,";","if"," ","(",target_val,")","{"," ","return","(",target_val,")","[",idx_key,"]","}"," ","}",")","()"]
                                    }
                                }
                            } ()
                        } else {
                            return ["(",target,")","[",idx_key,"]"]
                        }
                    }
                }
            };
            compile_elem=async function(token,ctx) {
                let rval;
                rval=null;
                await console.warn("compile_elem - deprecated: check call: ",token);
                if (check_true ((await is_complex_ques_((token && token["val"]))|| (((token && token["val"]) instanceof Array)&& ((token && token["val"] && token["val"]["0"] && token["val"]["0"]["name"])==="if"))))){
                    rval=await compile_wrapper_fn(token,ctx)
                } else {
                    rval=await (async function(){
                         return await compile(token,ctx) 
                    })()
                };
                if (check_true (await not((rval instanceof Array)))){
                    {
                        rval=await (async function(){
                            let __array_op_rval__85=rval;
                             if (__array_op_rval__85 instanceof Function){
                                return await __array_op_rval__85() 
                            } else {
                                return [__array_op_rval__85]
                            }
                        })()
                    }
                };
                return rval
            };
            inline_log=await (async function(){
                if (check_true ((opts && opts["quiet_mode"]))){
                    return log
                } else {
                    return await defclog({
                        prefix:"compile_inline:",background:"#404880",color:"white"
                    })
                }
            })();
            compile_inline=async function(tokens,ctx) {
                let rval;
                let stmt;
                let inline_fn;
                let has_literal_ques_;
                let wrap_style;
                let args;
                rval=null;
                stmt=null;
                inline_fn=null;
                has_literal_ques_=false;
                wrap_style=0;
                args=[];
                await (async function() {
                    let __for_body__88=async function(token) {
                        stmt=await compile_wrapper_fn(token,ctx);
                        return (args).push(stmt)
                    };
                    let __array__89=[],__elements__87=await tokens["slice"].call(tokens,1);
                    let __BREAK__FLAG__=false;
                    for(let __iter__86 in __elements__87) {
                        __array__89.push(await __for_body__88(__elements__87[__iter__86]));
                        if(__BREAK__FLAG__) {
                             __array__89.pop();
                            break;
                            
                        }
                    }return __array__89;
                     
                })();
                if (check_true (await verbosity())){
                    {
                        await inline_log("args: ",args)
                    }
                };
                if (check_true (await (async function(){
                    let __targ__90=(Environment && Environment["inlines"]);
                    if (__targ__90){
                         return(__targ__90)[(tokens && tokens["0"] && tokens["0"]["name"])]
                    } 
                })())){
                    {
                        inline_fn=await (async function(){
                            let __targ__91=(Environment && Environment["inlines"]);
                            if (__targ__91){
                                 return(__targ__91)[(tokens && tokens["0"] && tokens["0"]["name"])]
                            } 
                        })();
                        rval=await (async function(){
                            let __array_op_rval__92=inline_fn;
                             if (__array_op_rval__92 instanceof Function){
                                return await __array_op_rval__92(args,ctx) 
                            } else {
                                return [__array_op_rval__92,args,ctx]
                            }
                        })()
                    }
                } else {
                    throw new ReferenceError(("no source for named lib function "+ (tokens && tokens["0"] && tokens["0"]["name"])));
                    
                };
                return rval
            };
            compile_push=async function(tokens,ctx) {
                let acc;
                let place;
                let thing;
                acc=[];
                place=await compile_wrapper_fn((tokens && tokens["1"]),ctx);
                thing=await compile_wrapper_fn((tokens && tokens["2"]),ctx);
                return await (async function(){
                    let __array_op_rval__93=place;
                     if (__array_op_rval__93 instanceof Function){
                        return await __array_op_rval__93(".push","(",thing,")") 
                    } else {
                        return [__array_op_rval__93,".push","(",thing,")"]
                    }
                })()
            };
            compile_list=async function(tokens,ctx) {
                let acc;
                let compiled_values;
                acc=["["];
                compiled_values=[];
                await (async function(){
                    let it;
                    it=await get_ctx_val(ctx,"assignment_for");
                    if (check_true (it)){
                        return await set_declaration(ctx,it,"type",Array)
                    } else {
                        return 
                    }
                })();
                await (async function() {
                    let __for_body__96=async function(t) {
                        return (compiled_values).push(await compile_wrapper_fn(t,ctx))
                    };
                    let __array__97=[],__elements__95=await tokens["slice"].call(tokens,1);
                    let __BREAK__FLAG__=false;
                    for(let __iter__94 in __elements__95) {
                        __array__97.push(await __for_body__96(__elements__95[__iter__94]));
                        if(__BREAK__FLAG__) {
                             __array__97.pop();
                            break;
                            
                        }
                    }return __array__97;
                     
                })();
                await push_as_arg_list(acc,compiled_values);
                (acc).push("]");
                return acc
            };
            compile_typeof=async function(tokens,ctx) {
                let local_details=await (async function(){
                    if (check_true ((tokens && tokens["1"] && tokens["1"]["ref"]))){
                        return await get_ctx_val(ctx,(tokens && tokens["1"] && tokens["1"]["name"]))
                    } else {
                        return null
                    }
                })();
                ;
                let fully_qualified=await (async function(){
                    if (check_true (((tokens && tokens["1"] && tokens["1"]["name"])&& await contains_ques_("/",(tokens && tokens["1"] && tokens["1"]["name"]))))){
                        return true
                    } else {
                        return false
                    }
                })();
                ;
                if (check_true (await verbosity(ctx))){
                    {
                        await console.log("compile_typeof -> ",tokens)
                    }
                };
                if (check_true (((tokens && tokens.length)<2))){
                    {
                        throw new SyntaxError("typeof requires 1 argument");
                        
                    }
                };
                return await async function(){
                    if (check_true (((tokens && tokens["1"] && tokens["1"]["ref"])&& local_details))) {
                        return ["typeof"," ",await (async function(){
                             return await compile((tokens && tokens["1"]),ctx) 
                        })()]
                    } else if (check_true (((tokens && tokens["1"] && tokens["1"]["ref"])&& await get_lisp_ctx(ctx,(tokens && tokens["1"] && tokens["1"]["name"]))))) {
                        return ["typeof"," ",await (async function(){
                             return await compile((tokens && tokens["1"]),ctx) 
                        })()]
                    } else if (check_true ((tokens && tokens["1"] && tokens["1"]["ref"]))) {
                        return ["(","typeof"," ","(","function","() { let __tval=",await compile_lisp_scoped_reference((tokens && tokens["1"] && tokens["1"]["name"]),ctx,true),"; if (__tval === ReferenceError) return undefined; else return __tval; }",")()",")"]
                    } else {
                        return ["typeof"," ",await compile_wrapper_fn((tokens && tokens["1"]),ctx)]
                    }
                } ()
            };
            compile_instanceof=async function(tokens,ctx) {
                let acc;
                acc=[];
                if (check_true (((tokens instanceof Array)&& ((tokens && tokens.length)===3)))){
                    return ["(",await (async function(){
                        if (check_true (await is_complex_ques_((tokens && tokens["1"])))){
                            return await compile_wrapper_fn((tokens && tokens["1"]),ctx)
                        } else {
                            return await compile((tokens && tokens["1"]),ctx)
                        }
                    })()," ","instanceof"," ",await (async function(){
                        if (check_true (await is_complex_ques_((tokens && tokens["1"])))){
                            return await compile_wrapper_fn((tokens && tokens["2"]),ctx)
                        } else {
                            return await compile((tokens && tokens["2"]),ctx)
                        }
                    })(),")"]
                } else {
                    throw new SyntaxError("instanceof requires 2 arguments");
                    
                }
            };
            compile_compare=async function(tokens,ctx) {
                let acc;
                let ops;
                let __operator__98= async function(){
                    return ops[await (async function(){
                        let __targ__100=await first(tokens);
                        if (__targ__100){
                             return(__targ__100)["name"]
                        } 
                    })()]
                };
                let left;
                let right;
                {
                    acc=await (async function(){
                         return [{
                            ctype:"expression"
                        }] 
                    })();
                    ctx=await (async function(){
                         return await new_ctx(ctx) 
                    })();
                    ops=await ( async function(){
                        let __obj__99=new Object();
                        __obj__99["eq"]="==";
                        __obj__99["=="]="===";
                        __obj__99["<"]="<";
                        __obj__99[">"]=">";
                        __obj__99["gt"]=">";
                        __obj__99["lt"]="<";
                        __obj__99["<="]="<=";
                        __obj__99[">="]=">=";
                        return __obj__99;
                        
                    })();
                    let operator=await __operator__98();
                    ;
                    left=tokens[1];
                    right=tokens[2];
                    if (check_true (((tokens && tokens.length)<3))){
                        {
                            throw new SyntaxError("comparison operation requires 2 arguments");
                            
                        }
                    };
                    await set_ctx(ctx,"__COMP_INFIX_OPS__",true);
                    (acc).push("(");
                    (acc).push(await (async function(){
                         return await compile(left,ctx) 
                    })());
                    (acc).push(operator);
                    (acc).push(await (async function(){
                         return await compile(right,ctx) 
                    })());
                    (acc).push(")");
                    return acc
                }
            };
            assignment_log=await (async function(){
                 return await defclog({
                    color:"red",background:"black",prefix:"compile_assignment"
                }) 
            })();
            compile_assignment=async function(tokens,ctx) {
                let acc;
                let token;
                let assignment_value;
                let assignment_type;
                let wrap_as_function_ques_;
                let preamble;
                let comps;
                let sanitized;
                let target_details;
                let target;
                acc=[];
                token=await second(tokens);
                assignment_value=await (async function(){
                    if (check_true (((tokens && tokens.length)<3))){
                        throw new SyntaxError("assignment is missing a value argument");
                        
                    } else {
                        return null
                    }
                })();
                assignment_type=null;
                wrap_as_function_ques_=null;
                preamble=await calling_preamble(ctx);
                comps=[];
                sanitized=await (async function(){
                    if (check_true (((token && token["ref"])&& (token && token["name"])))){
                        return await sanitize_js_ref_name((token && token["name"]))
                    } else {
                        throw new SyntaxError(("assignment: missing assignment symbol"));
                        
                    }
                })();
                target_details=await (async function(){
                     return await async function(){
                        if (check_true (await get_ctx(ctx,sanitized))) {
                            return "local"
                        } else if (check_true (await get_lisp_ctx(ctx,(token && token["name"])))) {
                            return "global"
                        } else {
                            {
                                {
                                    let it;
                                    it=await get_declaration_details(ctx,(token && token["name"]));
                                    if (check_true (it)){
                                        return await async function(){
                                            if (check_true ((it && it["is_argument"]))) {
                                                return "local"
                                            } else if (check_true ((it && it["declared_global"]))) {
                                                return "global"
                                            } else if (check_true (it)) {
                                                return "local"
                                            }
                                        } ()
                                    } else {
                                        return 
                                    }
                                }
                            }
                        }
                    } () 
                })();
                target=await (async function(){
                    if (check_true ((target_details==="local"))){
                        return sanitized
                    } else {
                        return (token && token["name"])
                    }
                })();
                ;
                comps=(target).split(".");
                if (check_true ((undefined===target_details))){
                    throw new ReferenceError(("assignment to undeclared symbol: "+ (token && token["name"])));
                    
                };
                if (check_true (((comps && comps.length)>1))){
                    throw new SyntaxError(("invalid assignment to an object property, use set_prop instead: "+ target));
                    
                };
                if (check_true ((((tokens && tokens["2"] && tokens["2"]["type"])==="arr")&& ((tokens && tokens["2"] && tokens["2"]["val"] && tokens["2"]["val"]["0"] && tokens["2"]["val"]["0"]["type"])==="special")&& ((tokens && tokens["2"] && tokens["2"]["val"] && tokens["2"]["val"]["0"] && tokens["2"]["val"]["0"]["name"])==="defvar")))){
                    {
                        throw new SyntaxError("cannot assign result of the allocation operator defvar");
                        
                    }
                };
                await unset_ambiguous(ctx,target);
                await async function(){
                    ctx["in_assignment"]=true;
                    return ctx;
                    
                }();
                if (check_true (await verbosity(ctx))){
                    {
                        await (async function(){
                            let __array_op_rval__102=assignment_log;
                             if (__array_op_rval__102 instanceof Function){
                                return await __array_op_rval__102("identifier: ",sanitized," where:",target_details,"ctx: ",ctx) 
                            } else {
                                return [__array_op_rval__102,"identifier: ",sanitized," where:",target_details,"ctx: ",ctx]
                            }
                        })();
                        await (async function(){
                            let __array_op_rval__103=assignment_log;
                             if (__array_op_rval__103 instanceof Function){
                                return await __array_op_rval__103("value tokens: ",(tokens && tokens["2"])) 
                            } else {
                                return [__array_op_rval__103,"value tokens: ",(tokens && tokens["2"])]
                            }
                        })()
                    }
                };
                assignment_value=await compile_wrapper_fn((tokens && tokens["2"]),ctx);
                if (check_true (await verbosity(ctx))){
                    {
                        await (async function(){
                            let __array_op_rval__104=assignment_log;
                             if (__array_op_rval__104 instanceof Function){
                                return await __array_op_rval__104("assignment value: ",assignment_value) 
                            } else {
                                return [__array_op_rval__104,"assignment value: ",assignment_value]
                            }
                        })()
                    }
                };
                if (check_true (((assignment_value instanceof Array)&& ((assignment_value && assignment_value["0"]) instanceof Object)&& (assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])))){
                    {
                        assignment_type=await map_ctype_to_value((assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"]),assignment_value)
                    }
                } else {
                    {
                        await set_ambiguous(ctx,target);
                        assignment_type=UnknownType
                    }
                };
                if (check_true ((target_details==="local"))){
                    {
                        await set_ctx(ctx,target,assignment_type);
                        (acc).push(target);
                        (acc).push("=");
                        (acc).push(assignment_value)
                    }
                } else {
                    {
                        await (async function() {
                            let __for_body__107=async function(t) {
                                return (acc).push(t)
                            };
                            let __array__108=[],__elements__106=await (async function(){
                                 return [{
                                    ctype:"statement"
                                },(preamble && preamble["0"])," ","Environment",".","set_global","(","\"",target,"\"",",",assignment_value,")"] 
                            })();
                            let __BREAK__FLAG__=false;
                            for(let __iter__105 in __elements__106) {
                                __array__108.push(await __for_body__107(__elements__106[__iter__105]));
                                if(__BREAK__FLAG__) {
                                     __array__108.pop();
                                    break;
                                    
                                }
                            }return __array__108;
                             
                        })()
                    }
                };
                await async function(){
                    ctx["in_assignment"]=false;
                    return ctx;
                    
                }();
                if (check_true ((target_details==="local"))){
                    await set_ctx(ctx,target,assignment_type)
                };
                return acc
            };
            top_level_log=await (async function(){
                 return await defclog({
                    prefix:"top-level",color:"darkgreen",background:"#300010"
                }) 
            })();
            compile_toplevel=async function(lisp_tree,ctx,block_options) {
                if (check_true (await get_ctx_val(ctx,"__IN_LAMBDA__"))){
                    throw new EvalError("Compiler attempt to compile top-level in lambda (most likely a bug)");
                    
                } else {
                    {
                        {
                            let idx;
                            let rval;
                            let __tokens__110= async function(){
                                return null
                            };
                            let stmt;
                            let base_ctx;
                            let num_non_return_statements;
                            {
                                idx=0;
                                rval=null;
                                let tokens=await __tokens__110();
                                ;
                                stmt=null;
                                base_ctx=ctx;
                                num_non_return_statements=(await length(lisp_tree)- 2);
                                ctx=await (async function(){
                                    if (check_true ((block_options && block_options["no_scope_boundary"]))){
                                        return ctx
                                    } else {
                                        return await new_ctx(ctx)
                                    }
                                })();
                                await (async function(){
                                     let __test_condition__111=async function() {
                                        return (idx<num_non_return_statements)
                                    };
                                    let __body_ref__112=async function() {
                                        idx+=1;
                                        ctx=await (async function(){
                                             return await new_ctx(ctx) 
                                        })();
                                        await set_new_completion_scope(ctx);
                                        await set_ctx(ctx,"__TOP_LEVEL__",true);
                                        if (check_true (await verbosity(ctx))){
                                            {
                                                await console.log("");
                                                await top_level_log((""+ idx+ "/"+ num_non_return_statements),"->",await (await Environment.get_global("as_lisp"))(lisp_tree[idx]))
                                            }
                                        };
                                        tokens=await tokenize(lisp_tree[idx],ctx);
                                        stmt=await (async function(){
                                             return await compile(tokens,ctx) 
                                        })();
                                        rval=await wrap_and_run(stmt,ctx,{
                                            bind_mode:true
                                        });
                                        if (check_true (await verbosity(ctx))){
                                            {
                                                await top_level_log((""+ idx+ "/"+ num_non_return_statements),"compiled <- ",await (await Environment.get_global("as_lisp"))(stmt));
                                                return await top_level_log((""+ idx+ "/"+ num_non_return_statements),"<-",await (await Environment.get_global("as_lisp"))(rval))
                                            }
                                        }
                                    };
                                    let __BREAK__FLAG__=false;
                                    while(await __test_condition__111()) {
                                         await __body_ref__112();
                                         if(__BREAK__FLAG__) {
                                             break;
                                            
                                        }
                                    } ;
                                    
                                })();
                                return lisp_tree[(idx+ 1)]
                            }
                        }
                    }
                }
            };
            check_statement_completion=async function(ctx,stmts) {
                let stmt;
                let cmp_rec;
                let clog;
                stmt=await (async function(){
                    if (check_true ((null==stmts))){
                        throw new Error("compiler error: check_statement_completion: received undefined/nil statement array.");
                        
                    } else {
                        return await last(stmts)
                    }
                })();
                cmp_rec=await get_ctx(ctx,"__COMPLETION_SCOPE__");
                clog=await (async function(){
                    if (check_true (quiet_mode)){
                        return log
                    } else {
                        return await defclog({
                            prefix:("check_statement_completion (bid: "+ (ctx && ctx["block_id"])+ " cid: "+ (cmp_rec && cmp_rec["id"])+ "):"),background:"#704080",color:"white"
                        })
                    }
                })();
                if (check_true (await verbosity(ctx))){
                    {
                        await clog("check_statement_completion: lambda_step: ",await get_ctx(ctx,"__LAMBDA_STEP__"))
                    }
                };
                if (check_true ((((ctx && ctx["block_step"])===0)&& await not(await contains_ques_((stmt && stmt["0"] && stmt["0"]["ctype"]),["block","ifblock","tryblock","letblock"]))&& await not(await contains_ques_((stmt && stmt["0"] && stmt["0"]["completion"]),completion_types))&& await not(((cmp_rec && cmp_rec["scope_type"])==="arrow"))&& await not(((cmp_rec && cmp_rec["scope_type"])==="generator"))&& await not(((stmt && stmt["0"] && stmt["0"]["0"])==="yield"))))){
                    {
                        if (check_true (await verbosity(ctx))){
                            {
                                await clog("rule 1",await (async function(){
                                     return await (async function(){
                                        let __array_op_rval__113=clone;
                                         if (__array_op_rval__113 instanceof Function){
                                            return await __array_op_rval__113(cmp_rec) 
                                        } else {
                                            return [__array_op_rval__113,cmp_rec]
                                        }
                                    })() 
                                })(),await (async function(){
                                     return await (async function(){
                                        let __array_op_rval__114=clone;
                                         if (__array_op_rval__114 instanceof Function){
                                            return await __array_op_rval__114(stmts) 
                                        } else {
                                            return [__array_op_rval__114,stmts]
                                        }
                                    })() 
                                })())
                            }
                        };
                        (stmts).pop();
                        await (await Environment.get_global("assert"))(cmp_rec,"compiler error: check_statement_completion unable to find completion_scope record in context");
                        if (check_true ((((stmt && stmt["0"]) instanceof Object)&& await not(((stmt && stmt["0"]) instanceof Array))))){
                            {
                                await async function(){
                                    let __target_obj__115=(stmt && stmt["0"]);
                                    __target_obj__115["completion"]="return";
                                    return __target_obj__115;
                                    
                                }();
                                if (check_true (((stmt && stmt["0"] && stmt["0"]["ctype"])==="__JS__"))){
                                    (stmts).push(await (async function(){
                                        let __array_op_rval__116=stmt;
                                         if (__array_op_rval__116 instanceof Function){
                                            return await __array_op_rval__116() 
                                        } else {
                                            return [__array_op_rval__116]
                                        }
                                    })())
                                } else {
                                    (stmts).push(await (async function(){
                                        let __array_op_rval__117=(stmt && stmt["0"]);
                                         if (__array_op_rval__117 instanceof Function){
                                            return await __array_op_rval__117("return ",await (await Environment.get_global("rest"))(stmt)) 
                                        } else {
                                            return [__array_op_rval__117,"return ",await (await Environment.get_global("rest"))(stmt)]
                                        }
                                    })())
                                };
                                if (check_true (await verbosity(ctx))){
                                    {
                                        await clog("added return rule 1A")
                                    }
                                };
                                ((cmp_rec && cmp_rec["completion_records"])).push({
                                    block_id:(ctx && ctx["block_id"]),block_step:(ctx && ctx["block_step"]),type:"return",stmt:await last(stmts)
                                })
                            }
                        } else {
                            {
                                if (check_true ((await not(((cmp_rec && cmp_rec["scope_type"])==="arrow"))&& await not(((cmp_rec && cmp_rec["scope_type"])==="generator"))))){
                                    (stmts).push(await (async function(){
                                         return [{
                                            completion:"return"
                                        },"return ",stmt] 
                                    })())
                                };
                                if (check_true (await verbosity(ctx))){
                                    {
                                        await clog("added return rule 1B")
                                    }
                                };
                                ((cmp_rec && cmp_rec["completion_records"])).push({
                                    block_id:(ctx && ctx["block_id"]),type:"return",block_step:(ctx && ctx["block_step"]),stmt:await last(stmts)
                                })
                            }
                        };
                        return stmts
                    }
                } else {
                    {
                        return stmts
                    }
                }
            };
            compile_block=async function(tokens,ctx,block_options) {
                let acc;
                let block_id;
                let clog;
                let token;
                let block_type;
                let last_stmt;
                let is_first_level;
                let return_last;
                let stmt;
                let subacc;
                let completion_scope;
                let stmt_ctype;
                let lambda_block;
                let stmts;
                let idx;
                acc=[];
                block_id=(((block_options && block_options.name)&& await add((block_options && block_options.name),(blk_counter=blk_counter+1)))|| (blk_counter=blk_counter+1));
                clog=await (async function(){
                    if (check_true (quiet_mode)){
                        return log
                    } else {
                        return await defclog({
                            prefix:("compile_block ("+ block_id+ "):"),background:"#404080",color:"white"
                        })
                    }
                })();
                ctx=await (async function(){
                    if (check_true ((block_options && block_options["force_no_new_ctx"]))){
                        return ctx
                    } else {
                        return await new_ctx(ctx)
                    }
                })();
                token=null;
                block_type="sub";
                last_stmt=null;
                is_first_level=false;
                return_last=(ctx && ctx["return_last_value"]);
                stmt=null;
                subacc=[];
                completion_scope=await get_ctx(ctx,"__COMPLETION_SCOPE__");
                stmt_ctype=null;
                lambda_block=false;
                stmts=[];
                idx=0;
                if (check_true ((null==ctx))){
                    {
                        throw new ReferenceError("undefined ctx passed to compile block");
                        
                    }
                };
                if (check_true (needs_first_level)){
                    {
                        is_first_level=true;
                        needs_first_level=false
                    }
                };
                if (check_true ((opts && opts["include_source"]))){
                    {
                        if (check_true (((tokens && tokens["path"])&& ((tokens && tokens["path"] && tokens["path"]["length"])>0)))){
                            {
                                (acc).push(await source_comment(tokens))
                            }
                        }
                    }
                };
                await async function(){
                    ctx["block_id"]=block_id;
                    return ctx;
                    
                }();
                if (check_true (await verbosity(ctx))){
                    {
                        await clog("source ->",await (async function(){
                            if (check_true (((tokens instanceof Array)&& ((tokens && tokens["0"])==="PLACEHOLDER")))){
                                return await source_from_tokens((tokens && tokens["1"]),expanded_tree)
                            } else {
                                return await source_from_tokens(tokens,expanded_tree)
                            }
                        })());
                        await clog("tokens:",tokens);
                        await clog("block_options: ",await (async function(){
                             return await (async function(){
                                let __array_op_rval__119=clone;
                                 if (__array_op_rval__119 instanceof Function){
                                    return await __array_op_rval__119(block_options) 
                                } else {
                                    return [__array_op_rval__119,block_options]
                                }
                            })() 
                        })(),"ctx: ",await (async function(){
                             return await (async function(){
                                let __array_op_rval__120=clone;
                                 if (__array_op_rval__120 instanceof Function){
                                    return await __array_op_rval__120(ctx) 
                                } else {
                                    return [__array_op_rval__120,ctx]
                                }
                            })() 
                        })());
                        await clog("initial_completion_scope: ",await (async function(){
                             return await (async function(){
                                let __array_op_rval__121=clone;
                                 if (__array_op_rval__121 instanceof Function){
                                    return await __array_op_rval__121(completion_scope) 
                                } else {
                                    return [__array_op_rval__121,completion_scope]
                                }
                            })() 
                        })())
                    }
                };
                await (await Environment.get_global("assert"))(completion_scope,"block called with no completion scope");
                await (await Environment.get_global("assert"))((completion_scope instanceof Object),"block called with an invalid completion scope");
                if (check_true ((completion_scope && completion_scope["root_block_id"]))){
                    {
                        await set_ctx(ctx,"__IN_SUB_BLOCK__",true)
                    }
                } else {
                    {
                        await async function(){
                            completion_scope["root_block_id"]=block_id;
                            return completion_scope;
                            
                        }();
                        block_type="root";
                        await set_ctx(ctx,"__IN_SUB_BLOCK__",false)
                    }
                };
                if (check_true ((block_options && block_options["no_scope_boundary"]))){
                    {
                        await async function(){
                            ctx["no_scope_boundary"]=true;
                            return ctx;
                            
                        }()
                    }
                };
                if (check_true ((await get_ctx_val(ctx,"__LAMBDA_STEP__")===-1))){
                    {
                        lambda_block=true;
                        await (await Environment.get_global("setf_ctx"))(ctx,"__LAMBDA_STEP__",((tokens && tokens.length)- 1))
                    }
                };
                if (check_true (is_first_level)){
                    {
                        (acc).push(first_level_setup)
                    }
                };
                await async function(){
                    ctx["final_block_statement"]=false;
                    return ctx;
                    
                }();
                await (async function(){
                     let __test_condition__125=async function() {
                        return (idx<((tokens && tokens.length)- 1))
                    };
                    let __body_ref__126=async function() {
                        idx+=1;
                        subacc=[];
                        token=tokens[idx];
                        if (check_true ((idx===((tokens && tokens.length)- 1)))){
                            {
                                await async function(){
                                    ctx["final_block_statement"]=true;
                                    return ctx;
                                    
                                }()
                            }
                        };
                        if (check_true ((block_type==="root"))){
                            await async function(){
                                ctx["block_step"]=((tokens && tokens.length)- 1- idx);
                                return ctx;
                                
                            }()
                        };
                        await async function(){
                            ctx["sub_block_step"]=((tokens && tokens.length)- 1- idx);
                            return ctx;
                            
                        }();
                        if (check_true (lambda_block)){
                            {
                                await set_ctx(ctx,"__LAMBDA_STEP__",((tokens && tokens.length)- 1- idx))
                            }
                        };
                        if (check_true (await verbosity(ctx))){
                            {
                                await clog("sbs: ",((tokens && tokens.length)- 1- idx),block_type,"block step: ",(ctx && ctx["block_step"]),await source_from_tokens(token,expanded_tree),token)
                            }
                        };
                        await async function(){
                            if (check_true (((block_type==="root")&& ((token && token["type"])==="arr")&& ((token && token["val"] && token["val"]["0"] && token["val"]["0"]["name"])==="return")))) {
                                {
                                    return stmt=await compile_return((token && token["val"]),ctx)
                                }
                            } else if (check_true ((((token && token["val"] && token["val"]["0"] && token["val"]["0"]["name"])==="declare")&& (block_options && block_options["ignore_declarations"])))) {
                                stmt={
                                    ignored:"declare"
                                }
                            } else if (check_true (((((tokens && tokens.length)- 1- idx)>0)&& ((token && token["val"] && token["val"]["0"] && token["val"]["0"]["type"])==="special")&& (((token && token["val"] && token["val"]["0"] && token["val"]["0"]["name"])==="if")|| ((token && token["val"] && token["val"]["0"] && token["val"]["0"]["name"])==="try"))))) {
                                {
                                    let subctx;
                                    subctx=await (async function(){
                                         return await new_ctx(ctx) 
                                    })();
                                    await async function(){
                                        subctx["block_step"]=((tokens && tokens.length)- 1- idx);
                                        return subctx;
                                        
                                    }();
                                    if (check_true (((token && token["val"] && token["val"]["0"] && token["val"]["0"]["name"])==="if"))){
                                        stmt=await compile_if((token && token["val"]),subctx)
                                    } else {
                                        stmt=await compile_try((token && token["val"]),subctx)
                                    }
                                }
                            } else if (check_true (((((tokens && tokens.length)- 1- idx)>0)&& ((token && token["val"] && token["val"]["0"] && token["val"]["0"]["type"])==="special")&& await contains_ques_((token && token["val"] && token["val"]["0"] && token["val"]["0"]["name"]),["progn","do","let"])))) {
                                {
                                    if (check_true (await verbosity(ctx))){
                                        {
                                            await clog("candidate problem: compiling wrapper")
                                        }
                                    };
                                    stmt=await compile_wrapper_fn(token,ctx)
                                }
                            } else {
                                stmt=await (async function(){
                                     return await compile(token,ctx) 
                                })()
                            }
                        } ();
                        if (check_true ((stmt===undefined))){
                            {
                                if (check_true (is_error)){
                                    stmt=await (async function(){
                                         return [{
                                            ctype:Error
                                        },"ERROR_STATE"] 
                                    })()
                                } else {
                                    throw new EvalError("compile_block: returned stmt is undefined");
                                    
                                }
                            }
                        };
                        (stmts).push(stmt);
                        if (check_true ((idx<((tokens && tokens.length)- 1)))){
                            {
                                return (stmts).push(";")
                            }
                        }
                    };
                    let __BREAK__FLAG__=false;
                    while(await __test_condition__125()) {
                         await __body_ref__126();
                         if(__BREAK__FLAG__) {
                             break;
                            
                        }
                    } ;
                    
                })();
                await check_statement_completion(ctx,stmts);
                (acc).push(stmts);
                if (check_true (await not((block_options && block_options["no_scope_boundary"])))){
                    {
                        (acc).unshift("{");
                        (acc).push("}")
                    }
                };
                (acc).unshift({
                    ctype:"block",block_id:block_id,block_options:block_options
                });
                return acc
            };
            Expression=new Function("","{ return \"expression\" }");
            Statement=new Function("","{ return \"statement\" }");
            NumberType=new Function("","{ return \"number\" }");
            StringType=new Function("","{ return \"string\" }");
            NilType=new Function("","{ return \"nil\" }");
            UnknownType=new Function(""," { return \"unknown\"} ");
            ArgumentType=new Function(""," { return \"argument\" }");
            compile_defvar=async function(tokens,ctx,opts) {
                let target;
                let wrap_as_function_ques_;
                let ctx_details;
                let allocation_type;
                let assignment_type;
                let assignment_value;
                target=await clean_quoted_reference(await sanitize_js_ref_name((tokens && tokens["1"] && tokens["1"]["name"])));
                wrap_as_function_ques_=null;
                ctx_details=null;
                ctx=ctx;
                allocation_type=await (async function(){
                    if (check_true ((opts && opts["constant"]))){
                        return "const"
                    } else {
                        return "let"
                    }
                })();
                assignment_type=null;
                assignment_value=null;
                if (check_true (((tokens && tokens.length)<2))){
                    {
                        throw new SyntaxError(("defvar requires 2 arguments, received "+ ((tokens && tokens.length)- 1)));
                        
                    }
                };
                if (check_true (((ctx && ctx["final_block_statement"])&& await not((ctx && ctx["no_scope_boundary"]))))){
                    {
                        throw new SyntaxError("defvar has no effect at end of block scope");
                        
                    }
                };
                assignment_value=await (async function(){
                    return await compile_wrapper_fn((tokens && tokens["2"]),ctx)
                })();
                ctx_details=await get_declaration_details(ctx,target);
                assignment_type=await add(new Object(),ctx_details,await get_declarations(ctx,target));
                await async function(){
                    if (check_true (((assignment_value instanceof Array)&& ((assignment_value && assignment_value["0"]) instanceof Object)&& (assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])))) {
                        {
                            return await set_ctx(ctx,target,await map_ctype_to_value((assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"]),assignment_value))
                        }
                    } else if (check_true ((assignment_type && assignment_type["value"]) instanceof Function)) {
                        await set_ctx(ctx,target,(assignment_type && assignment_type["value"]))
                    } else {
                        await set_ctx(ctx,target,assignment_value)
                    }
                } ();
                if (check_true ((ctx && ctx["defvar_eval"]))){
                    {
                        await (await Environment.get_global("delete_prop"))(ctx,"defvar_eval");
                        return [{
                            ctype:"assignment"
                        },allocation_type," ",target,"=",assignment_value,"()",";"]
                    }
                } else {
                    return [{
                        ctype:"assignment"
                    },await (async function(){
                        if (check_true (((ctx_details && ctx_details["is_argument"])&& ((ctx_details && ctx_details["levels_up"])===1)))){
                            return ""
                        } else {
                            return (allocation_type+ " ")
                        }
                    })(),"",target,"=",[assignment_value],";"]
                }
            };
            get_declaration_details=async function(ctx,symname,_levels_up) {
                return await async function(){
                    if (check_true ((await (async function(){
                        let __targ__131=(ctx && ctx["scope"]);
                        if (__targ__131){
                             return(__targ__131)[symname]
                        } 
                    })()&& ctx["lambda_scope"]))) {
                        return {
                            name:symname,is_argument:true,levels_up:(_levels_up|| 0),value:await (async function(){
                                let __targ__132=(ctx && ctx["scope"]);
                                if (__targ__132){
                                     return(__targ__132)[symname]
                                } 
                            })(),declared_global:await (async function(){
                                if (check_true (await (async function(){
                                    let __targ__133=(root_ctx && root_ctx["defined_lisp_globals"]);
                                    if (__targ__133){
                                         return(__targ__133)[symname]
                                    } 
                                })())){
                                    return true
                                } else {
                                    return false
                                }
                            })()
                        }
                    } else if (check_true (await (async function(){
                        let __targ__134=(ctx && ctx["scope"]);
                        if (__targ__134){
                             return(__targ__134)[symname]
                        } 
                    })())) {
                        return {
                            name:symname,is_argument:false,levels_up:(_levels_up|| 0),value:await (async function(){
                                let __targ__135=(ctx && ctx["scope"]);
                                if (__targ__135){
                                     return(__targ__135)[symname]
                                } 
                            })(),declarations:await get_declarations(ctx,symname),declared_global:await (async function(){
                                if (check_true (await (async function(){
                                    let __targ__136=(root_ctx && root_ctx["defined_lisp_globals"]);
                                    if (__targ__136){
                                         return(__targ__136)[symname]
                                    } 
                                })())){
                                    return true
                                } else {
                                    return false
                                }
                            })()
                        }
                    } else if (check_true (((ctx["parent"]==null)&& await (async function(){
                        let __targ__137=(root_ctx && root_ctx["defined_lisp_globals"]);
                        if (__targ__137){
                             return(__targ__137)[symname]
                        } 
                    })()))) {
                        return {
                            name:symname,is_argument:false,levels_up:(_levels_up|| 0),value:await (async function(){
                                let __targ__138=(ctx && ctx["scope"]);
                                if (__targ__138){
                                     return(__targ__138)[symname]
                                } 
                            })(),declarations:await get_declarations(ctx,symname),declared_global:true
                        }
                    } else if (check_true ((ctx && ctx["parent"]))) {
                        return await get_declaration_details((ctx && ctx["parent"]),symname,((_levels_up&& await add(_levels_up,1))|| 1))
                    } else if (check_true (await not((NOT_FOUND_THING===await Environment["get_global"].call(Environment,symname,NOT_FOUND_THING))))) {
                        return {
                            name:symname,is_argument:false,levels_up:(_levels_up|| 0),value:await Environment["get_global"].call(Environment,symname),declared_global:true
                        }
                    }
                } ()
            };
            clean_quoted_reference=async function(name) {
                return await async function(){
                    if (check_true (((name instanceof String || typeof name==='string')&& await starts_with_ques_("\"",name)&& await (await Environment.get_global("ends_with?"))("\"",name)))) {
                        return await (async function() {
                            {
                                 let __call_target__=await name["substr"].call(name,1), __call_method__="substr";
                                return await __call_target__[__call_method__].call(__call_target__,0,(await length(name)- 2))
                            } 
                        })()
                    } else {
                        return name
                    }
                } ()
            };
            compile_let=async function(tokens,ctx) {
                let acc;
                let clog;
                let token;
                let declarations_handled;
                let assignment_value;
                let suppress_return;
                let block_declarations;
                let my_tokens;
                let assignment_type;
                let stmt;
                let def_idx;
                let redefinitions;
                let need_sub_block;
                let assignments;
                let reference_name;
                let shadowed_globals;
                let alloc_set;
                let is_first_level;
                let sub_block_count;
                let ctx_details;
                let preamble;
                let structure_validation_rules;
                let validation_results;
                let allocations;
                let block;
                let syntax_error;
                let idx;
                acc=[];
                ctx=await (async function(){
                     return await new_ctx(ctx) 
                })();
                clog=await (async function(){
                    if (check_true (quiet_mode)){
                        return log
                    } else {
                        return await defclog({
                            prefix:("compile_let: "+ ((ctx && ctx["block_id"])|| "")),background:"#B0A0F0",color:"black"
                        })
                    }
                })();
                token=null;
                declarations_handled=false;
                assignment_value=null;
                suppress_return=null;
                block_declarations=new Object();
                my_tokens=tokens;
                assignment_type=null;
                stmt=null;
                def_idx=null;
                redefinitions=new Object();
                need_sub_block=false;
                assignments=new Object();
                reference_name=null;
                shadowed_globals=new Object();
                alloc_set=null;
                is_first_level=false;
                sub_block_count=0;
                ctx_details=null;
                preamble=await calling_preamble(ctx);
                structure_validation_rules=await (async function(){
                     return [[[1,"val"],[(await Environment.get_global("is_array?"))],"allocation section"],await (async function(){
                         return [[2],[async function(v) {
                            return await not((v===undefined))
                        }],"block"] 
                    })()] 
                })();
                validation_results=null;
                allocations=(tokens && tokens["1"] && tokens["1"]["val"]);
                block=await tokens["slice"].call(tokens,2);
                syntax_error=null;
                idx=-1;
                ;
                if (check_true (await not((allocations instanceof Array)))){
                    throw new SyntaxError("let: missing/malformed allocation section");
                    
                };
                if (check_true (((block && block.length)===0))){
                    throw new SyntaxError("let: missing block");
                    
                };
                await async function(){
                    ctx["return_last_value"]=true;
                    return ctx;
                    
                }();
                await set_ctx(ctx,"__LOCAL_SCOPE__",true);
                if (check_true (await verbosity(ctx))){
                    {
                        await clog("->",await source_from_tokens(tokens,expanded_tree));
                        await clog("ctx: ",await (async function(){
                             return await (async function(){
                                let __array_op_rval__140=clone;
                                 if (__array_op_rval__140 instanceof Function){
                                    return await __array_op_rval__140(ctx) 
                                } else {
                                    return [__array_op_rval__140,ctx]
                                }
                            })() 
                        })())
                    }
                };
                (acc).push("{");
                sub_block_count+=1;
                if (check_true (((block && block["0"] && block["0"]["val"] && block["0"]["val"]["0"] && block["0"]["val"]["0"]["name"])==="declare"))){
                    {
                        declarations_handled=true;
                        (acc).push(await compile_declare((block && block["0"] && block["0"]["val"]),ctx))
                    }
                };
                if (check_true (needs_first_level)){
                    {
                        is_first_level=true;
                        needs_first_level=false;
                        if (check_true (is_first_level)){
                            {
                                (acc).push(first_level_setup)
                            }
                        }
                    }
                };
                await (async function(){
                     let __test_condition__141=async function() {
                        return (idx<((allocations && allocations.length)- 1))
                    };
                    let __body_ref__142=async function() {
                        idx+=1;
                        alloc_set=await (async function(){
                            let __targ__143=allocations[idx];
                            if (__targ__143){
                                 return(__targ__143)["val"]
                            } 
                        })();
                        reference_name=await clean_quoted_reference(await sanitize_js_ref_name((alloc_set && alloc_set["0"] && alloc_set["0"]["name"])));
                        await (await Environment.get_global("assert"))(((reference_name instanceof String || typeof reference_name==='string')&& (await length(reference_name)>0)),("Invalid reference name: "+ (alloc_set && alloc_set["0"] && alloc_set["0"]["name"])));
                        ctx_details=await get_declaration_details(ctx,reference_name);
                        if (check_true (ctx_details)){
                            {
                                if (check_true ((await not((ctx_details && ctx_details["is_argument"]))&& ((ctx_details && ctx_details["levels_up"])>1)))){
                                    {
                                        need_sub_block=true;
                                        if (check_true (redefinitions[reference_name])){
                                            (redefinitions[reference_name]).push(await gen_temp_name(reference_name))
                                        } else {
                                            await async function(){
                                                redefinitions[reference_name]=[0,await gen_temp_name(reference_name)];
                                                return redefinitions;
                                                
                                            }()
                                        };
                                        if (check_true (((ctx_details && ctx_details["declared_global"])&& await not((ctx_details && ctx_details["is_argument"]))))){
                                            {
                                                await async function(){
                                                    shadowed_globals[(alloc_set && alloc_set["0"] && alloc_set["0"]["name"])]=true;
                                                    return shadowed_globals;
                                                    
                                                }()
                                            }
                                        }
                                    }
                                }
                            }
                        };
                        if (check_true (await not((ctx_details && ctx_details["is_argument"])))){
                            {
                                return await set_ctx(ctx,reference_name,AsyncFunction)
                            }
                        }
                    };
                    let __BREAK__FLAG__=false;
                    while(await __test_condition__141()) {
                         await __body_ref__142();
                         if(__BREAK__FLAG__) {
                             break;
                            
                        }
                    } ;
                    
                })();
                idx=-1;
                await (async function(){
                     let __test_condition__146=async function() {
                        return (idx<((allocations && allocations.length)- 1))
                    };
                    let __body_ref__147=async function() {
                        idx+=1;
                        stmt=[];
                        alloc_set=await (async function(){
                            let __targ__148=allocations[idx];
                            if (__targ__148){
                                 return(__targ__148)["val"]
                            } 
                        })();
                        reference_name=await clean_quoted_reference(await sanitize_js_ref_name((alloc_set && alloc_set["0"] && alloc_set["0"]["name"])));
                        ctx_details=await get_declaration_details(ctx,reference_name);
                        await async function(){
                            if (check_true (((alloc_set && alloc_set["1"] && alloc_set["1"]["val"]) instanceof Array))) {
                                {
                                    await async function(){
                                        ctx["in_assignment"]=true;
                                        return ctx;
                                        
                                    }();
                                    await set_ctx(ctx,"assignment_for",reference_name);
                                    assignment_value=await compile_wrapper_fn((alloc_set && alloc_set["1"]),ctx);
                                    await set_ctx(ctx,"assignment_for",null);
                                    return await async function(){
                                        ctx["in_assignment"]=false;
                                        return ctx;
                                        
                                    }()
                                }
                            } else if (check_true ((((alloc_set && alloc_set["1"] && alloc_set["1"]["name"]) instanceof String || typeof (alloc_set && alloc_set["1"] && alloc_set["1"]["name"])==='string')&& await not((ctx_details && ctx_details["is_argument"]))&& (alloc_set && alloc_set["1"] && alloc_set["1"]["ref"])&& await not((await Environment["get_global"].call(Environment,(alloc_set && alloc_set["1"] && alloc_set["1"]["name"]),NOT_FOUND_THING)===NOT_FOUND_THING))&& shadowed_globals[(alloc_set && alloc_set["0"] && alloc_set["0"]["name"])]))) {
                                {
                                    assignment_value=await (async function(){
                                         return [{
                                            ctype:(ctx_details && ctx_details["value"])
                                        },"await"," ",env_ref,"get_global","(","\"",(alloc_set && alloc_set["1"] && alloc_set["1"]["name"]),"\"",")"] 
                                    })()
                                }
                            } else {
                                {
                                    await set_ctx(ctx,"assignment_for",reference_name);
                                    assignment_value=await compile_wrapper_fn((alloc_set && alloc_set["1"]),ctx);
                                    await set_ctx(ctx,"assignment_for",null);
                                    if (check_true (await verbosity(ctx))){
                                        {
                                            await clog("setting simple assignment value for",reference_name,": <- ",await (async function(){
                                                 return await (async function(){
                                                    let __array_op_rval__151=clone;
                                                     if (__array_op_rval__151 instanceof Function){
                                                        return await __array_op_rval__151(assignment_value) 
                                                    } else {
                                                        return [__array_op_rval__151,assignment_value]
                                                    }
                                                })() 
                                            })())
                                        }
                                    }
                                }
                            }
                        } ();
                        await async function(){
                            if (check_true (((assignment_value instanceof Array)&& ((assignment_value && assignment_value["0"]) instanceof Object)&& (assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])))) {
                                {
                                    return await set_ctx(ctx,reference_name,await map_ctype_to_value((assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"]),assignment_value))
                                }
                            } else if (check_true (((assignment_value instanceof Array)&& ((assignment_value && assignment_value["0"]) instanceof Array)&& (assignment_value && assignment_value["0"] && assignment_value["0"]["0"] && assignment_value["0"]["0"]["ctype"])))) {
                                {
                                    await set_ctx(ctx,reference_name,await map_ctype_to_value((assignment_value && assignment_value["0"] && assignment_value["0"]["0"] && assignment_value["0"]["0"]["ctype"]),assignment_value))
                                }
                            } else {
                                {
                                    await set_ctx(ctx,reference_name,assignment_value)
                                }
                            }
                        } ();
                        if (check_true ((ctx_details && ctx_details["is_argument"]))){
                            {
                                await async function(){
                                    block_declarations[reference_name]=true;
                                    return block_declarations;
                                    
                                }()
                            }
                        };
                        def_idx=null;
                        await async function(){
                            if (check_true ((redefinitions[reference_name]&& await first(redefinitions[reference_name])))) {
                                {
                                    def_idx=await first(redefinitions[reference_name]);
                                    def_idx+=1;
                                    await async function(){
                                        let __target_obj__153=redefinitions[reference_name];
                                        __target_obj__153[0]=def_idx;
                                        return __target_obj__153;
                                        
                                    }();
                                    return await (async function() {
                                        let __for_body__156=async function(t) {
                                            return (acc).push(t)
                                        };
                                        let __array__157=[],__elements__155=["let"," ",await (async function(){
                                            let __targ__158=redefinitions[reference_name];
                                            if (__targ__158){
                                                 return(__targ__158)[def_idx]
                                            } 
                                        })(),"="," ",(preamble && preamble["1"])," ","function","()","{","return"," ",assignment_value,"}",";"];
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__154 in __elements__155) {
                                            __array__157.push(await __for_body__156(__elements__155[__iter__154]));
                                            if(__BREAK__FLAG__) {
                                                 __array__157.pop();
                                                break;
                                                
                                            }
                                        }return __array__157;
                                         
                                    })()
                                }
                            } else if (check_true (await not(block_declarations[reference_name]))) {
                                {
                                    await (async function() {
                                        let __for_body__161=async function(t) {
                                            return (acc).push(t)
                                        };
                                        let __array__162=[],__elements__160=["let"," ",reference_name,";"];
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__159 in __elements__160) {
                                            __array__162.push(await __for_body__161(__elements__160[__iter__159]));
                                            if(__BREAK__FLAG__) {
                                                 __array__162.pop();
                                                break;
                                                
                                            }
                                        }return __array__162;
                                         
                                    })();
                                    await async function(){
                                        block_declarations[reference_name]=true;
                                        return block_declarations;
                                        
                                    }()
                                }
                            }
                        } ();
                        if (check_true (await not(assignments[reference_name]))){
                            {
                                await async function(){
                                    assignments[reference_name]=[];
                                    return assignments;
                                    
                                }()
                            }
                        };
                        return (assignments[reference_name]).push(await (async function(){
                            if (check_true (def_idx)){
                                return [(preamble && preamble["0"])," ",await (async function(){
                                    let __targ__165=redefinitions[reference_name];
                                    if (__targ__165){
                                         return(__targ__165)[def_idx]
                                    } 
                                })(),"()",";"]
                            } else {
                                return assignment_value
                            }
                        })())
                    };
                    let __BREAK__FLAG__=false;
                    while(await __test_condition__146()) {
                         await __body_ref__147();
                         if(__BREAK__FLAG__) {
                             break;
                            
                        }
                    } ;
                    
                })();
                if (check_true (need_sub_block)){
                    {
                        await (async function() {
                            let __for_body__168=async function(pset) {
                                return await (async function() {
                                    let __for_body__172=async function(redef) {
                                        return (redefinitions[(pset && pset["0"])]).shift()
                                    };
                                    let __array__173=[],__elements__171=(pset && pset["1"]);
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__170 in __elements__171) {
                                        __array__173.push(await __for_body__172(__elements__171[__iter__170]));
                                        if(__BREAK__FLAG__) {
                                             __array__173.pop();
                                            break;
                                            
                                        }
                                    }return __array__173;
                                     
                                })()
                            };
                            let __array__169=[],__elements__167=await (await Environment.get_global("pairs"))(redefinitions);
                            let __BREAK__FLAG__=false;
                            for(let __iter__166 in __elements__167) {
                                __array__169.push(await __for_body__168(__elements__167[__iter__166]));
                                if(__BREAK__FLAG__) {
                                     __array__169.pop();
                                    break;
                                    
                                }
                            }return __array__169;
                             
                        })()
                    }
                };
                if (check_true (need_sub_block)){
                    {
                        (acc).push("{");
                        sub_block_count+=1
                    }
                };
                idx=-1;
                await (async function(){
                     let __test_condition__174=async function() {
                        return (idx<((allocations && allocations.length)- 1))
                    };
                    let __body_ref__175=async function() {
                        idx+=1;
                        def_idx=null;
                        stmt=[];
                        alloc_set=await (async function(){
                            let __targ__176=allocations[idx];
                            if (__targ__176){
                                 return(__targ__176)["val"]
                            } 
                        })();
                        reference_name=await clean_quoted_reference(await sanitize_js_ref_name((alloc_set && alloc_set["0"] && alloc_set["0"]["name"])));
                        ctx_details=await get_declaration_details(ctx,reference_name);
                        assignment_value=(assignments[reference_name]).shift();
                        await async function(){
                            if (check_true (block_declarations[reference_name])) {
                                return true
                            } else {
                                {
                                    (stmt).push("let");
                                    (stmt).push(" ")
                                }
                            }
                        } ();
                        (stmt).push(reference_name);
                        await async function(){
                            block_declarations[reference_name]=true;
                            return block_declarations;
                            
                        }();
                        (stmt).push("=");
                        (stmt).push(assignment_value);
                        (stmt).push(";");
                        return (acc).push(stmt)
                    };
                    let __BREAK__FLAG__=false;
                    while(await __test_condition__174()) {
                         await __body_ref__175();
                         if(__BREAK__FLAG__) {
                             break;
                            
                        }
                    } ;
                    
                })();
                (acc).push(await compile_block(await conj(["PLACEHOLDER"],block),ctx,{
                    no_scope_boundary:true,suppress_return:suppress_return,ignore_declarations:declarations_handled
                }));
                await (async function() {
                    let __for_body__180=async function(i) {
                        return (acc).push("}")
                    };
                    let __array__181=[],__elements__179=await (await Environment.get_global("range"))(sub_block_count);
                    let __BREAK__FLAG__=false;
                    for(let __iter__178 in __elements__179) {
                        __array__181.push(await __for_body__180(__elements__179[__iter__178]));
                        if(__BREAK__FLAG__) {
                             __array__181.pop();
                            break;
                            
                        }
                    }return __array__181;
                     
                })();
                if (check_true (false)){
                    return acc
                } else {
                    {
                        (acc).unshift({
                            ctype:"letblock",block_step:(ctx && ctx["parent"] && ctx["parent"]["block_step"])
                        });
                        return acc
                    }
                }
            };
            in_sync_ques_=async function(ctx) {
                return await get_ctx(ctx,"__SYNCF__")
            };
            await_ques_=async function(ctx) {
                if (check_true (await in_sync_ques_(ctx))){
                    return ""
                } else {
                    return "await"
                }
            };
            calling_preamble=async function(ctx) {
                if (check_true (await in_sync_ques_(ctx))){
                    return ["","",{
                        ctype:"Function",block_step:0
                    },"(",")"]
                } else {
                    return ["await","async",{
                        ctype:"AsyncFunction",block_step:0
                    },"",""]
                }
            };
            fn_log=await (async function(){
                 return await defclog({
                    prefix:"compile_fn",background:"black",color:"lightblue"
                }) 
            })();
            comp_scope_log=await (async function(){
                 return await defclog({
                    prefix:"set_new_completion_scope",background:"#A000A0",color:"white"
                }) 
            })();
            completion_scope_id=0;
            set_new_completion_scope=async function(ctx) {
                let completion_scope;
                completion_scope={
                    id:completion_scope_id+=1,root_block_id:null,completion_records:[],is_top:false
                };
                await set_ctx(ctx,"__COMPLETION_SCOPE__",completion_scope);
                await set_ctx(ctx,"__COMP_INFIX_OPS__",null);
                if (check_true (await verbosity(ctx))){
                    {
                        await (async function(){
                            let __array_op_rval__183=comp_scope_log;
                             if (__array_op_rval__183 instanceof Function){
                                return await __array_op_rval__183("-> id: ",(completion_scope && completion_scope["id"]),completion_scope,await (async function(){
                                     return await (async function(){
                                        let __array_op_rval__182=clone;
                                         if (__array_op_rval__182 instanceof Function){
                                            return await __array_op_rval__182(ctx) 
                                        } else {
                                            return [__array_op_rval__182,ctx]
                                        }
                                    })() 
                                })()) 
                            } else {
                                return [__array_op_rval__183,"-> id: ",(completion_scope && completion_scope["id"]),completion_scope,await (async function(){
                                     return await (async function(){
                                        let __array_op_rval__182=clone;
                                         if (__array_op_rval__182 instanceof Function){
                                            return await __array_op_rval__182(ctx) 
                                        } else {
                                            return [__array_op_rval__182,ctx]
                                        }
                                    })() 
                                })()]
                            }
                        })()
                    }
                };
                return completion_scope
            };
            compile_fn=async function(tokens,ctx,fn_opts) {
                let acc;
                let idx;
                let arg;
                let fn_args;
                let body;
                let external_declarations;
                let type_mark;
                let source;
                let completion_scope;
                let nbody;
                acc=[];
                idx=-1;
                arg=null;
                ctx=await (async function(){
                     return await new_ctx(ctx) 
                })();
                fn_args=(tokens && tokens["1"] && tokens["1"]["val"]);
                body=(tokens && tokens["2"]);
                external_declarations=(tokens && tokens["3"]);
                type_mark=null;
                source=await (async function(){
                    if (check_true (await verbosity(ctx))){
                        return await source_from_tokens(tokens,expanded_tree)
                    } else {
                        return null
                    }
                })();
                completion_scope=null;
                nbody=null;
                await async function(){
                    let __target_obj__184=(ctx && ctx["scope"]);
                    __target_obj__184["__SOURCE__"]=source;
                    return __target_obj__184;
                    
                }();
                if (check_true (await verbosity(ctx))){
                    {
                        await (async function(){
                            let __array_op_rval__187=fn_log;
                             if (__array_op_rval__187 instanceof Function){
                                return await __array_op_rval__187("->",source,await (async function(){
                                     return await (async function(){
                                        let __array_op_rval__185=clone;
                                         if (__array_op_rval__185 instanceof Function){
                                            return await __array_op_rval__185(ctx) 
                                        } else {
                                            return [__array_op_rval__185,ctx]
                                        }
                                    })() 
                                })(),await (async function(){
                                     return await (async function(){
                                        let __array_op_rval__186=clone;
                                         if (__array_op_rval__186 instanceof Function){
                                            return await __array_op_rval__186(fn_opts) 
                                        } else {
                                            return [__array_op_rval__186,fn_opts]
                                        }
                                    })() 
                                })()) 
                            } else {
                                return [__array_op_rval__187,"->",source,await (async function(){
                                     return await (async function(){
                                        let __array_op_rval__185=clone;
                                         if (__array_op_rval__185 instanceof Function){
                                            return await __array_op_rval__185(ctx) 
                                        } else {
                                            return [__array_op_rval__185,ctx]
                                        }
                                    })() 
                                })(),await (async function(){
                                     return await (async function(){
                                        let __array_op_rval__186=clone;
                                         if (__array_op_rval__186 instanceof Function){
                                            return await __array_op_rval__186(fn_opts) 
                                        } else {
                                            return [__array_op_rval__186,fn_opts]
                                        }
                                    })() 
                                })()]
                            }
                        })()
                    }
                };
                completion_scope=await set_new_completion_scope(ctx);
                if (check_true ((undefined==body))){
                    {
                        throw new SyntaxError("Invalid function call syntax");
                        
                    }
                };
                await async function(){
                    ctx["return_point"]=0;
                    return ctx;
                    
                }();
                await set_ctx(ctx,"__IN_LAMBDA__",true);
                await set_ctx(ctx,"__LAMBDA_STEP__",-1);
                await async function(){
                    ctx["lambda_scope"]=true;
                    return ctx;
                    
                }();
                await async function(){
                    ctx["suppress_return"]=false;
                    return ctx;
                    
                }();
                await async function(){
                    if (check_true ((fn_opts && fn_opts["synchronous"]))) {
                        {
                            type_mark=await type_marker("Function");
                            await set_ctx(ctx,"__SYNCF__",true);
                            await async function(){
                                completion_scope["in_sync"]=true;
                                return completion_scope;
                                
                            }();
                            return (acc).push(type_mark)
                        }
                    } else if (check_true ((fn_opts && fn_opts["arrow"]))) {
                        {
                            type_mark=await type_marker("Function");
                            (acc).push(type_mark)
                        }
                    } else if (check_true ((fn_opts && fn_opts["generator"]))) {
                        {
                            await set_ctx(ctx,"__SYNCF__",true);
                            type_mark=await type_marker("GeneratorFunction");
                            (acc).push(type_mark);
                            (acc).push(" ")
                        }
                    } else {
                        {
                            type_mark=await type_marker("AsyncFunction");
                            (acc).push(type_mark);
                            (acc).push("async");
                            (acc).push(" ")
                        }
                    }
                } ();
                await async function(){
                    type_mark["args"]=[];
                    return type_mark;
                    
                }();
                await async function(){
                    if (check_true ((fn_opts && fn_opts["arrow"]))) {
                        return await async function(){
                            completion_scope["scope_type"]="arrow";
                            return completion_scope;
                            
                        }()
                    } else if (check_true ((fn_opts && fn_opts["generator"]))) {
                        {
                            (acc).push("function*");
                            await async function(){
                                completion_scope["scope_type"]="generator";
                                return completion_scope;
                                
                            }()
                        }
                    } else {
                        {
                            await async function(){
                                completion_scope["scope_type"]="function";
                                return completion_scope;
                                
                            }();
                            (acc).push("function")
                        }
                    }
                } ();
                (acc).push("(");
                await (async function(){
                     let __test_condition__196=async function() {
                        return (idx<((fn_args && fn_args.length)- 1))
                    };
                    let __body_ref__197=async function() {
                        idx+=1;
                        arg=fn_args[idx];
                        if (check_true (((arg && arg.name)==="&"))){
                            {
                                idx+=1;
                                arg=fn_args[idx];
                                if (check_true ((null==arg))){
                                    {
                                        throw new SyntaxError("Missing argument symbol after &");
                                        
                                    }
                                };
                                await set_ctx(ctx,(arg && arg.name),ArgumentType);
                                await async function(){
                                    arg["name"]=("..."+ (arg && arg.name));
                                    return arg;
                                    
                                }()
                            }
                        } else {
                            {
                                await set_ctx(ctx,(arg && arg.name),ArgumentType)
                            }
                        };
                        (acc).push(await sanitize_js_ref_name((arg && arg.name)));
                        ((type_mark && type_mark["args"])).push(await sanitize_js_ref_name((arg && arg.name)));
                        if (check_true ((idx<((fn_args && fn_args.length)- 1)))){
                            {
                                return (acc).push(",")
                            }
                        }
                    };
                    let __BREAK__FLAG__=false;
                    while(await __test_condition__196()) {
                         await __body_ref__197();
                         if(__BREAK__FLAG__) {
                             break;
                            
                        }
                    } ;
                    
                })();
                (acc).push(")");
                (acc).push(" ");
                if (check_true ((fn_opts && fn_opts["arrow"]))){
                    {
                        (acc).push("=>")
                    }
                };
                if (check_true (((fn_opts && fn_opts["generator"])|| (fn_opts && fn_opts["arrow"])))){
                    await async function(){
                        ctx["return_last_value"]=false;
                        return ctx;
                        
                    }()
                } else {
                    await async function(){
                        ctx["return_last_value"]=true;
                        return ctx;
                        
                    }()
                };
                await async function(){
                    if (check_true (((body && body["val"] && body["val"]["0"] && body["val"]["0"]["name"])==="let"))) {
                        {
                            if (check_true (await verbosity(ctx))){
                                {
                                    await (async function(){
                                        let __array_op_rval__201=fn_log;
                                         if (__array_op_rval__201 instanceof Function){
                                            return await __array_op_rval__201("calling compile: block is a let") 
                                        } else {
                                            return [__array_op_rval__201,"calling compile: block is a let"]
                                        }
                                    })()
                                }
                            };
                            return (acc).push(await (async function(){
                                 return await compile((body && body["val"]),ctx) 
                            })())
                        }
                    } else if (check_true (await contains_ques_((body && body["val"] && body["val"]["0"] && body["val"]["0"]["name"]),["do","progn","progl"]))) {
                        {
                            if (check_true (await verbosity(ctx))){
                                {
                                    await (async function(){
                                        let __array_op_rval__202=fn_log;
                                         if (__array_op_rval__202 instanceof Function){
                                            return await __array_op_rval__202("calling compile_block due to: ",(body && body["val"] && body["val"]["0"] && body["val"]["0"]["name"])) 
                                        } else {
                                            return [__array_op_rval__202,"calling compile_block due to: ",(body && body["val"] && body["val"]["0"] && body["val"]["0"]["name"])]
                                        }
                                    })()
                                }
                            };
                            (acc).push(await compile_block((body && body["val"]),ctx))
                        }
                    } else {
                        {
                            nbody=await (async function(){
                                 return [{
                                    type:"special",val:await (async function(){
                                         return "=:do" 
                                    })(),ref:true,name:"do"
                                },body] 
                            })();
                            await async function(){
                                ctx["return_last_value"]=true;
                                return ctx;
                                
                            }();
                            (acc).push({
                                mark:"nbody"
                            });
                            if (check_true (await verbosity(ctx))){
                                {
                                    await (async function(){
                                        let __array_op_rval__204=fn_log;
                                         if (__array_op_rval__204 instanceof Function){
                                            return await __array_op_rval__204("calling compile_block after making a psuedo-block") 
                                        } else {
                                            return [__array_op_rval__204,"calling compile_block after making a psuedo-block"]
                                        }
                                    })()
                                }
                            };
                            (acc).push(await compile_block(nbody,ctx))
                        }
                    }
                } ();
                await async function(){
                    if (check_true ((await not((fn_opts && fn_opts["arrow"]))&& await not((fn_opts && fn_opts["generator"]))&& ((completion_scope && completion_scope["completion_records"] && completion_scope["completion_records"]["length"])===0)))) {
                        {
                            await console.error("internal compile error: no completion records for callable");
                            await console.log("error provoking source: ",await source_from_tokens(tokens,expanded_tree,true));
                            await console.log("output: ",acc);
                            let internal_syntax_error=new SyntaxError("internal compile error: no completion records for callable");
                            ;
                            throw internal_syntax_error;
                            
                        }
                    } else {
                        true
                    }
                } ();
                return acc
            };
            compile_jslambda=async function(tokens,ctx) {
                let acc;
                let fn_args;
                let body;
                let idx;
                let quoted_body;
                let arg;
                let type_mark;
                acc=[];
                fn_args=(tokens && tokens["1"] && tokens["1"]["val"]);
                body=await (async function(){
                     return await compile((tokens && tokens["2"] && tokens["2"]["val"]),ctx) 
                })();
                idx=-1;
                quoted_body=[];
                arg=null;
                type_mark=await type_marker("Function");
                (acc).push(type_mark);
                await (async function() {
                    let __for_body__207=async function(t) {
                        return (acc).push(t)
                    };
                    let __array__208=[],__elements__206=["new"," ","Function","("];
                    let __BREAK__FLAG__=false;
                    for(let __iter__205 in __elements__206) {
                        __array__208.push(await __for_body__207(__elements__206[__iter__205]));
                        if(__BREAK__FLAG__) {
                             __array__208.pop();
                            break;
                            
                        }
                    }return __array__208;
                     
                })();
                if (check_true (await not((body instanceof String || typeof body==='string')))){
                    {
                        throw new SyntaxError(("Invalid jslambda body, need string, got: "+ await subtype(body)));
                        
                    }
                };
                await (async function(){
                     let __test_condition__209=async function() {
                        return (idx<((fn_args && fn_args.length)- 1))
                    };
                    let __body_ref__210=async function() {
                        idx+=1;
                        arg=fn_args[idx];
                        await set_ctx(ctx,(arg && arg.name),ArgumentType);
                        (acc).push(("\""+ (arg && arg.name)+ "\""));
                        ((type_mark && type_mark["args"])).push((arg && arg.name));
                        return (acc).push(",")
                    };
                    let __BREAK__FLAG__=false;
                    while(await __test_condition__209()) {
                         await __body_ref__210();
                         if(__BREAK__FLAG__) {
                             break;
                            
                        }
                    } ;
                    
                })();
                (acc).push("\"");
                await (async function() {
                    let __for_body__213=async function(c) {
                        if (check_true (await not((c==="\n"),(c==="\r")))){
                            {
                                if (check_true ((c==="\""))){
                                    {
                                        (quoted_body).push(await String.fromCharCode(92))
                                    }
                                };
                                return (quoted_body).push(c)
                            }
                        }
                    };
                    let __array__214=[],__elements__212=(body).split("");
                    let __BREAK__FLAG__=false;
                    for(let __iter__211 in __elements__212) {
                        __array__214.push(await __for_body__213(__elements__212[__iter__211]));
                        if(__BREAK__FLAG__) {
                             __array__214.pop();
                            break;
                            
                        }
                    }return __array__214;
                     
                })();
                (acc).push((await flatten(quoted_body)).join(""));
                (acc).push("\"");
                (acc).push(")");
                return acc
            };
            compile_yield=async function(tokens,ctx) {
                let acc;
                let expr;
                let cmp_rec;
                acc=[];
                expr=null;
                cmp_rec=await get_ctx(ctx,"__COMPLETION_SCOPE__");
                (acc).push(["yield"," ",await compile_wrapper_fn((tokens && tokens["1"]),ctx),";"]);
                ((cmp_rec && cmp_rec["completion_records"])).push({
                    block_id:(ctx && ctx["block_id"]),block_step:(ctx && ctx["block_step"]),type:"yield",stmt:await last(acc)
                });
                return acc
            };
            var_counter=0;
            gen_temp_name=async function(arg) {
                return ("__"+ (arg|| "")+ "__"+ (var_counter=var_counter+1))
            };
            if_id=0;
            compile_cond=async function(tokens,ctx) {
                let preamble;
                preamble=await calling_preamble(ctx);
                ctx=await (async function(){
                     return await new_ctx(ctx) 
                })();
                ;
                await set_new_completion_scope(ctx);
                return [(preamble && preamble["2"]),(preamble && preamble["0"])," ",(preamble && preamble["1"])," ",(preamble && preamble["3"]),"function","()","{",await compile_cond_inner(tokens,ctx),"} ",(preamble && preamble["4"]),"()"]
            };
            compile_cond_inner=async function(tokens,ctx) {
                let acc;
                let conditions;
                let block_step;
                let condition_tokens;
                let idx;
                let preamble;
                let compile_condition;
                acc=[];
                conditions=[];
                block_step=(ctx && ctx["block_step"]);
                condition_tokens=await tokens["slice"].call(tokens,1);
                idx=-2;
                preamble=await calling_preamble(ctx);
                compile_condition=async function(cond_test,cond_block) {
                    let stmts;
                    let compiled_test;
                    let stmt;
                    stmts=[];
                    compiled_test=null;
                    stmt=null;
                    if (check_true (((cond_test && cond_test.name)==="else"))){
                        if (check_true ((idx>=2))){
                            (stmts).push(" else ")
                        }
                    } else {
                        {
                            if (check_true ((idx>=2))){
                                (stmts).push(" else ")
                            };
                            compiled_test=await compile_wrapper_fn(cond_test,ctx);
                            if (check_true (((await first(compiled_test) instanceof Object)&& await (async function(){
                                let __targ__215=await first(compiled_test);
                                if (__targ__215){
                                     return(__targ__215)["ctype"]
                                } 
                            })()&& (await (async function(){
                                let __targ__216=await first(compiled_test);
                                if (__targ__216){
                                     return(__targ__216)["ctype"]
                                } 
                            })() instanceof String || typeof await (async function(){
                                let __targ__216=await first(compiled_test);
                                if (__targ__216){
                                     return(__targ__216)["ctype"]
                                } 
                            })()==='string')&& await contains_ques_("unction",await (async function(){
                                let __targ__217=await first(compiled_test);
                                if (__targ__217){
                                     return(__targ__217)["ctype"]
                                } 
                            })())))){
                                (stmts).push(["if"," ","(check_true (",(preamble && preamble["0"])," ",compiled_test,"()",")) "])
                            } else {
                                (stmts).push(["if"," ","(check_true (",compiled_test,")) "])
                            }
                        }
                    };
                    stmt=await compile_block(await ensure_block(cond_block),ctx);
                    (stmts).push(stmt);
                    return stmts
                };
                ;
                if (check_true ((null==block_step))){
                    acc=await compile_block(await ensure_block(tokens),ctx)
                } else {
                    {
                        await async function(){
                            if (check_true (await not((((condition_tokens && condition_tokens.length)% 2)===0)))) {
                                throw new LispSyntaxError("cond: Invalid syntax: missing condition block");
                                
                            } else if (check_true (((condition_tokens && condition_tokens.length)===0))) {
                                throw new LispSyntaxError("cond: Invalid syntax: no conditions provided");
                                
                            }
                        } ();
                        await (async function(){
                             let __test_condition__218=async function() {
                                return (idx<((condition_tokens && condition_tokens.length)- 2))
                            };
                            let __body_ref__219=async function() {
                                idx+=2;
                                return (acc).push(await compile_condition(condition_tokens[idx],condition_tokens[(idx+ 1)]))
                            };
                            let __BREAK__FLAG__=false;
                            while(await __test_condition__218()) {
                                 await __body_ref__219();
                                 if(__BREAK__FLAG__) {
                                     break;
                                    
                                }
                            } ;
                            
                        })()
                    }
                };
                return acc
            };
            ensure_block=async function(tokens) {
                if (check_true (((tokens instanceof Array)&& ("special"===(tokens && tokens["0"] && tokens["0"]["type"]))&& await contains_ques_((tokens && tokens["0"] && tokens["0"]["name"]),["do","progn"])))){
                    return tokens
                } else {
                    return ["PLACEHOLDER",tokens]
                }
            };
            compile_if=async function(tokens,ctx) {
                let acc;
                let subacc;
                let stmts;
                let test_form;
                let if_true;
                let if_false;
                let compiled_test;
                let compiled_true;
                let compiled_false;
                let block_step;
                let preamble;
                acc=[];
                subacc=[];
                stmts=null;
                test_form=(tokens && tokens["1"]);
                if_true=(tokens && tokens["2"]);
                if_false=(tokens && tokens["3"]);
                compiled_test=null;
                compiled_true=null;
                compiled_false=null;
                block_step=(ctx && ctx["block_step"]);
                preamble=await calling_preamble(ctx);
                ;
                if (check_true ((null==block_step))){
                    acc=await compile_block(await ensure_block(tokens),ctx)
                } else {
                    {
                        (acc).push({
                            ctype:"ifblock",block_step:(ctx && ctx["block_step"]),block_id:(ctx && ctx["block_id"])
                        });
                        compiled_test=await (async function(){
                             return await compile(test_form,ctx) 
                        })();
                        if (check_true (((await first(compiled_test) instanceof Object)&& await (async function(){
                            let __targ__220=await first(compiled_test);
                            if (__targ__220){
                                 return(__targ__220)["ctype"]
                            } 
                        })()&& (await (async function(){
                            let __targ__221=await first(compiled_test);
                            if (__targ__221){
                                 return(__targ__221)["ctype"]
                            } 
                        })() instanceof String || typeof await (async function(){
                            let __targ__221=await first(compiled_test);
                            if (__targ__221){
                                 return(__targ__221)["ctype"]
                            } 
                        })()==='string')&& await contains_ques_("unction",await (async function(){
                            let __targ__222=await first(compiled_test);
                            if (__targ__222){
                                 return(__targ__222)["ctype"]
                            } 
                        })())))){
                            await (async function() {
                                let __for_body__225=async function(t) {
                                    return (subacc).push(t)
                                };
                                let __array__226=[],__elements__224=["if"," ","(check_true (",(preamble && preamble["0"])," ",compiled_test,"()","))"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__223 in __elements__224) {
                                    __array__226.push(await __for_body__225(__elements__224[__iter__223]));
                                    if(__BREAK__FLAG__) {
                                         __array__226.pop();
                                        break;
                                        
                                    }
                                }return __array__226;
                                 
                            })()
                        } else {
                            await (async function() {
                                let __for_body__229=async function(t) {
                                    return (subacc).push(t)
                                };
                                let __array__230=[],__elements__228=["if"," ","(check_true (",compiled_test,"))"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__227 in __elements__228) {
                                    __array__230.push(await __for_body__229(__elements__228[__iter__227]));
                                    if(__BREAK__FLAG__) {
                                         __array__230.pop();
                                        break;
                                        
                                    }
                                }return __array__230;
                                 
                            })()
                        };
                        (acc).push(subacc);
                        subacc=[];
                        compiled_true=await compile_block(await ensure_block(if_true),ctx);
                        (acc).push(compiled_true);
                        if (check_true (if_false)){
                            {
                                (acc).push(" ");
                                (acc).push("else");
                                (acc).push(" ");
                                compiled_false=await compile_block(await ensure_block(if_false),ctx);
                                (acc).push(compiled_false)
                            }
                        }
                    }
                };
                return acc
            };
            compile_as_call=async function(tokens,ctx) {
                return await compile_wrapper_fn(tokens,ctx,{
                    force:true
                })
            };
            rwfnlog=await (async function(){
                 return await defclog({
                    prefix:"compile_wrapper_fn",background:"black",color:"yellow"
                }) 
            })();
            compile_wrapper_fn=async function(tokens,ctx,opts) {
                let acc;
                let preamble;
                let needs_await;
                acc=[];
                ctx=ctx;
                preamble=await calling_preamble(ctx);
                needs_await=true;
                ;
                await async function(){
                    if (check_true (((tokens instanceof Object)&& await not((tokens instanceof Array))&& await not(((tokens && tokens["type"])==="arr"))))) {
                        {
                            needs_await=false;
                            return acc=await (async function(){
                                 return await compile(tokens,ctx) 
                            })()
                        }
                    } else if (check_true (((tokens instanceof Object)&& ((tokens && tokens["val"] && tokens["val"]["0"] && tokens["val"]["0"]["type"])==="fun")))) {
                        {
                            needs_await=false;
                            acc=await (async function(){
                                 return await compile(tokens,ctx) 
                            })()
                        }
                    } else if (check_true ((opts && opts["force"]))) {
                        {
                            ctx=await (async function(){
                                 return await new_ctx(ctx) 
                            })();
                            if (check_true (await verbosity(ctx))){
                                {
                                    await (async function(){
                                        let __array_op_rval__231=rwfnlog;
                                         if (__array_op_rval__231 instanceof Function){
                                            return await __array_op_rval__231("compile_wrapper_fn: -> ",await source_from_tokens(tokens,expanded_tree)) 
                                        } else {
                                            return [__array_op_rval__231,"compile_wrapper_fn: -> ",await source_from_tokens(tokens,expanded_tree)]
                                        }
                                    })();
                                    await (async function(){
                                        let __array_op_rval__233=rwfnlog;
                                         if (__array_op_rval__233 instanceof Function){
                                            return await __array_op_rval__233("compile_wrapper_fn: ",opts,"ctx: ",await (async function(){
                                                 return await (async function(){
                                                    let __array_op_rval__232=clone;
                                                     if (__array_op_rval__232 instanceof Function){
                                                        return await __array_op_rval__232(ctx) 
                                                    } else {
                                                        return [__array_op_rval__232,ctx]
                                                    }
                                                })() 
                                            })()) 
                                        } else {
                                            return [__array_op_rval__233,"compile_wrapper_fn: ",opts,"ctx: ",await (async function(){
                                                 return await (async function(){
                                                    let __array_op_rval__232=clone;
                                                     if (__array_op_rval__232 instanceof Function){
                                                        return await __array_op_rval__232(ctx) 
                                                    } else {
                                                        return [__array_op_rval__232,ctx]
                                                    }
                                                })() 
                                            })()]
                                        }
                                    })()
                                }
                            };
                            await set_new_completion_scope(ctx);
                            acc=await compile_block_to_anon_fn(tokens,ctx,opts)
                        }
                    } else if (check_true (await is_block_ques_(tokens))) {
                        {
                            ctx=await (async function(){
                                 return await new_ctx(ctx) 
                            })();
                            await set_new_completion_scope(ctx);
                            await async function(){
                                ctx["block_step"]=0;
                                return ctx;
                                
                            }();
                            acc=await (async function(){
                                let __array_op_rval__235=(preamble && preamble["2"]);
                                 if (__array_op_rval__235 instanceof Function){
                                    return await __array_op_rval__235("(",(preamble && preamble["1"])," ","function","()","{",await (async function(){
                                         return await compile(tokens,ctx) 
                                    })(),"}",")","()") 
                                } else {
                                    return [__array_op_rval__235,"(",(preamble && preamble["1"])," ","function","()","{",await (async function(){
                                         return await compile(tokens,ctx) 
                                    })(),"}",")","()"]
                                }
                            })()
                        }
                    } else if (check_true (((tokens instanceof Object)&& ((tokens && tokens["val"] && tokens["val"]["0"] && tokens["val"]["0"]["type"])==="special")&& (((tokens && tokens["val"] && tokens["val"]["0"] && tokens["val"]["0"]["name"])==="if")|| (((tokens && tokens["val"] && tokens["val"]["0"] && tokens["val"]["0"]["name"])==="throw")&& await get_ctx(ctx,"__COMP_INFIX_OPS__")))))) {
                        {
                            ctx=await (async function(){
                                 return await new_ctx(ctx) 
                            })();
                            await set_new_completion_scope(ctx);
                            await async function(){
                                ctx["block_step"]=0;
                                return ctx;
                                
                            }();
                            await (async function() {
                                let __for_body__239=async function(t) {
                                    return (acc).push(t)
                                };
                                let __array__240=[],__elements__238=await (async function(){
                                    let __array_op_rval__241=(preamble && preamble["2"]);
                                     if (__array_op_rval__241 instanceof Function){
                                        return await __array_op_rval__241("(",(preamble && preamble["1"])," ","function","()","{",await compile_if((tokens && tokens["val"]),ctx),"}",")","()") 
                                    } else {
                                        return [__array_op_rval__241,"(",(preamble && preamble["1"])," ","function","()","{",await compile_if((tokens && tokens["val"]),ctx),"}",")","()"]
                                    }
                                })();
                                let __BREAK__FLAG__=false;
                                for(let __iter__237 in __elements__238) {
                                    __array__240.push(await __for_body__239(__elements__238[__iter__237]));
                                    if(__BREAK__FLAG__) {
                                         __array__240.pop();
                                        break;
                                        
                                    }
                                }return __array__240;
                                 
                            })()
                        }
                    } else if (check_true (((tokens instanceof Array)&& (((tokens && tokens["0"] && tokens["0"]["type"])==="fun")|| ((tokens && tokens["0"] && tokens["0"]["type"])==="asf")|| ((tokens && tokens["0"] && tokens["0"]["type"])==="function"))))) {
                        {
                            needs_await=false;
                            acc=await (async function(){
                                 return await compile(tokens,ctx) 
                            })()
                        }
                    } else if (check_true ((tokens instanceof Array))) {
                        {
                            ctx=await (async function(){
                                 return await new_ctx(ctx) 
                            })();
                            if (check_true (await verbosity(ctx))){
                                {
                                    await (async function(){
                                        let __array_op_rval__242=rwfnlog;
                                         if (__array_op_rval__242 instanceof Function){
                                            return await __array_op_rval__242("compile_wrapper_fn: -> ",await source_from_tokens(tokens,expanded_tree)) 
                                        } else {
                                            return [__array_op_rval__242,"compile_wrapper_fn: -> ",await source_from_tokens(tokens,expanded_tree)]
                                        }
                                    })();
                                    await (async function(){
                                        let __array_op_rval__244=rwfnlog;
                                         if (__array_op_rval__244 instanceof Function){
                                            return await __array_op_rval__244("compile_wrapper_fn: ",opts,"ctx: ",await (async function(){
                                                 return await (async function(){
                                                    let __array_op_rval__243=clone;
                                                     if (__array_op_rval__243 instanceof Function){
                                                        return await __array_op_rval__243(ctx) 
                                                    } else {
                                                        return [__array_op_rval__243,ctx]
                                                    }
                                                })() 
                                            })()) 
                                        } else {
                                            return [__array_op_rval__244,"compile_wrapper_fn: ",opts,"ctx: ",await (async function(){
                                                 return await (async function(){
                                                    let __array_op_rval__243=clone;
                                                     if (__array_op_rval__243 instanceof Function){
                                                        return await __array_op_rval__243(ctx) 
                                                    } else {
                                                        return [__array_op_rval__243,ctx]
                                                    }
                                                })() 
                                            })()]
                                        }
                                    })()
                                }
                            };
                            await set_new_completion_scope(ctx);
                            acc=await compile_block_to_anon_fn(tokens,ctx,opts)
                        }
                    } else if (check_true (((tokens instanceof Object)&& ((tokens && tokens["type"])==="arr")&& (((tokens && tokens["val"] && tokens["val"]["length"])===0)|| ((tokens && tokens["val"] && tokens["val"]["0"] && tokens["val"]["0"]["type"])==="literal")|| (((tokens && tokens["val"] && tokens["val"]["0"] && tokens["val"]["0"]["type"])==="arg")|| (((tokens && tokens["val"] && tokens["val"]["0"] && tokens["val"]["0"]["type"])==="special")&& await not(await contains_ques_((tokens && tokens["val"] && tokens["val"]["0"] && tokens["val"]["0"]["name"]),["if","try","do","progn","let","cond"])))))))) {
                        {
                            needs_await=false;
                            acc=await (async function(){
                                 return await compile(tokens,ctx) 
                            })()
                        }
                    } else if (check_true (((tokens instanceof Object)&& (tokens && tokens["val"])&& ((tokens && tokens["type"])==="arr")))) {
                        {
                            ctx=await (async function(){
                                 return await new_ctx(ctx) 
                            })();
                            if (check_true (await verbosity(ctx))){
                                {
                                    await (async function(){
                                        let __array_op_rval__245=rwfnlog;
                                         if (__array_op_rval__245 instanceof Function){
                                            return await __array_op_rval__245("compile_wrapper_fn: -> ",await source_from_tokens(tokens,expanded_tree)) 
                                        } else {
                                            return [__array_op_rval__245,"compile_wrapper_fn: -> ",await source_from_tokens(tokens,expanded_tree)]
                                        }
                                    })();
                                    await (async function(){
                                        let __array_op_rval__247=rwfnlog;
                                         if (__array_op_rval__247 instanceof Function){
                                            return await __array_op_rval__247("compile_wrapper_fn: ",opts,"ctx: ",await (async function(){
                                                 return await (async function(){
                                                    let __array_op_rval__246=clone;
                                                     if (__array_op_rval__246 instanceof Function){
                                                        return await __array_op_rval__246(ctx) 
                                                    } else {
                                                        return [__array_op_rval__246,ctx]
                                                    }
                                                })() 
                                            })()) 
                                        } else {
                                            return [__array_op_rval__247,"compile_wrapper_fn: ",opts,"ctx: ",await (async function(){
                                                 return await (async function(){
                                                    let __array_op_rval__246=clone;
                                                     if (__array_op_rval__246 instanceof Function){
                                                        return await __array_op_rval__246(ctx) 
                                                    } else {
                                                        return [__array_op_rval__246,ctx]
                                                    }
                                                })() 
                                            })()]
                                        }
                                    })()
                                }
                            };
                            await set_new_completion_scope(ctx);
                            acc=await compile_block_to_anon_fn((tokens && tokens["val"]),ctx,opts)
                        }
                    } else {
                        acc=await (async function(){
                             return await compile(tokens,ctx) 
                        })()
                    }
                } ();
                if (check_true (needs_await)){
                    return [(preamble && preamble["0"])," ",acc]
                } else {
                    return acc
                }
            };
            compile_block_to_anon_fn=async function(tokens,ctx,opts) {
                let acc;
                let preamble;
                acc=[];
                preamble=await calling_preamble(ctx);
                ctx=await (async function(){
                     return await new_ctx(ctx) 
                })();
                await async function(){
                    ctx["return_point"]=0;
                    return ctx;
                    
                }();
                await async function(){
                    ctx["block_step"]=0;
                    return ctx;
                    
                }();
                await async function(){
                    if (check_true (await is_block_ques_(tokens))) {
                        {
                            await async function(){
                                ctx["return_last_value"]=true;
                                return ctx;
                                
                            }();
                            await async function(){
                                ctx["return_point"]=0;
                                return ctx;
                                
                            }();
                            return await (async function() {
                                let __for_body__254=async function(t) {
                                    return (acc).push(t)
                                };
                                let __array__255=[],__elements__253=["(",(preamble && preamble["1"])," ","function","()",await compile_block(tokens,ctx),")","()"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__252 in __elements__253) {
                                    __array__255.push(await __for_body__254(__elements__253[__iter__252]));
                                    if(__BREAK__FLAG__) {
                                         __array__255.pop();
                                        break;
                                        
                                    }
                                }return __array__255;
                                 
                            })()
                        }
                    } else if (check_true ((((tokens && tokens["0"] && tokens["0"]["name"])==="let")&& ((tokens && tokens["0"] && tokens["0"]["type"])==="special")))) {
                        {
                            await async function(){
                                ctx["return_last_value"]=true;
                                return ctx;
                                
                            }();
                            await async function(){
                                ctx["return_point"]=0;
                                return ctx;
                                
                            }();
                            await (async function() {
                                let __for_body__260=async function(t) {
                                    return (acc).push(t)
                                };
                                let __array__261=[],__elements__259=["(",(preamble && preamble["1"])," ","function","()",await (async function(){
                                     return await compile(tokens,ctx) 
                                })(),")","()"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__258 in __elements__259) {
                                    __array__261.push(await __for_body__260(__elements__259[__iter__258]));
                                    if(__BREAK__FLAG__) {
                                         __array__261.pop();
                                        break;
                                        
                                    }
                                }return __array__261;
                                 
                            })()
                        }
                    } else if (check_true ((((tokens && tokens["0"] && tokens["0"]["type"])==="special")&& (((tokens && tokens["0"] && tokens["0"]["name"])==="if")|| ((tokens && tokens["0"] && tokens["0"]["name"])==="try"))))) {
                        {
                            await (async function() {
                                let __for_body__264=async function(t) {
                                    return (acc).push(t)
                                };
                                let __array__265=[],__elements__263=["(",(preamble && preamble["1"])," ","function","() { ",await (async function(){
                                     return await compile(tokens,ctx) 
                                })(),"})","()"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__262 in __elements__263) {
                                    __array__265.push(await __for_body__264(__elements__263[__iter__262]));
                                    if(__BREAK__FLAG__) {
                                         __array__265.pop();
                                        break;
                                        
                                    }
                                }return __array__265;
                                 
                            })()
                        }
                    } else {
                        {
                            await async function(){
                                ctx["return_last_value"]=true;
                                return ctx;
                                
                            }();
                            await async function(){
                                ctx["return_point"]=0;
                                return ctx;
                                
                            }();
                            await (async function() {
                                let __for_body__270=async function(t) {
                                    return (acc).push(t)
                                };
                                let __array__271=[],__elements__269=["(",(preamble && preamble["1"])," ","function","()","{"," ","return"," ",await (async function(){
                                     return await compile(tokens,ctx) 
                                })()," ","}",")","()"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__268 in __elements__269) {
                                    __array__271.push(await __for_body__270(__elements__269[__iter__268]));
                                    if(__BREAK__FLAG__) {
                                         __array__271.pop();
                                        break;
                                        
                                    }
                                }return __array__271;
                                 
                            })()
                        }
                    }
                } ();
                return acc
            };
            make_do_block=async function(tokens) {
                let preamble;
                let place;
                preamble=await (async function(){
                     return await (async function(){
                        let __array_op_rval__272=clone;
                         if (__array_op_rval__272 instanceof Function){
                            return await __array_op_rval__272({
                                type:"arr",ref:false,name:null,val:[]
                            }) 
                        } else {
                            return [__array_op_rval__272,{
                                type:"arr",ref:false,name:null,val:[]
                            }]
                        }
                    })() 
                })();
                place=(preamble && preamble["val"]);
                (place).push({
                    type:"special",val:await (async function(){
                         return "=:do" 
                    })(),ref:true,name:"do"
                });
                await async function(){
                    if (check_true ((tokens instanceof Array))) {
                        return await (async function() {
                            let __for_body__275=async function(token) {
                                return (place).push(token)
                            };
                            let __array__276=[],__elements__274=tokens;
                            let __BREAK__FLAG__=false;
                            for(let __iter__273 in __elements__274) {
                                __array__276.push(await __for_body__275(__elements__274[__iter__273]));
                                if(__BREAK__FLAG__) {
                                     __array__276.pop();
                                    break;
                                    
                                }
                            }return __array__276;
                             
                        })()
                    } else {
                        await (async function() {
                            let __for_body__279=async function(token) {
                                return (place).push(token)
                            };
                            let __array__280=[],__elements__278=await (async function(){
                                let __array_op_rval__281=tokens;
                                 if (__array_op_rval__281 instanceof Function){
                                    return await __array_op_rval__281() 
                                } else {
                                    return [__array_op_rval__281]
                                }
                            })();
                            let __BREAK__FLAG__=false;
                            for(let __iter__277 in __elements__278) {
                                __array__280.push(await __for_body__279(__elements__278[__iter__277]));
                                if(__BREAK__FLAG__) {
                                     __array__280.pop();
                                    break;
                                    
                                }
                            }return __array__280;
                             
                        })()
                    }
                } ();
                return preamble
            };
            push_as_arg_list=async function(place,args) {
                await map(async function(v,i,t) {
                    (place).push(v);
                    if (check_true ((i<=(t- 2)))){
                        {
                            return (place).push(",")
                        }
                    }
                },args);
                return place
            };
            compile_new=async function(tokens,ctx) {
                let acc;
                let prebuild;
                let target_type;
                let comps;
                let type_details;
                let root_type_details;
                let target_return_type;
                let new_arg_name;
                let args;
                let preamble;
                let new_opts;
                acc=[];
                prebuild=[];
                target_type=await clean_quoted_reference(await sanitize_js_ref_name((tokens && tokens["1"] && tokens["1"]["name"])));
                comps=await (await Environment.get_global("get_object_path"))(target_type);
                type_details=await get_declaration_details(ctx,target_type);
                root_type_details=await (async function(){
                    if (check_true (((comps && comps.length)>1))){
                        return await get_declaration_details(ctx,(comps && comps["0"]))
                    } else {
                        return null
                    }
                })();
                target_return_type=null;
                new_arg_name=null;
                args=[];
                ctx=await (async function(){
                     return await new_ctx(ctx) 
                })();
                preamble=await calling_preamble(ctx);
                new_opts=await tokens["slice"].call(tokens,2);
                if (check_true (((comps && comps.length)>1))){
                    {
                        target_type=await (async function(){
                             return await (await Environment.get_global("path_to_js_syntax"))(comps) 
                        })()
                    }
                };
                await (async function() {
                    let __for_body__284=async function(opt_token) {
                        return (args).push(await compile_wrapper_fn(opt_token,ctx))
                    };
                    let __array__285=[],__elements__283=(new_opts|| []);
                    let __BREAK__FLAG__=false;
                    for(let __iter__282 in __elements__283) {
                        __array__285.push(await __for_body__284(__elements__283[__iter__282]));
                        if(__BREAK__FLAG__) {
                             __array__285.pop();
                            break;
                            
                        }
                    }return __array__285;
                     
                })();
                await async function(){
                    if (check_true ((await not((null==(type_details && type_details["value"])))&& (type_details && type_details["declared_global"])))) {
                        {
                            await (async function() {
                                let __for_body__288=async function(arg) {
                                    return (acc).push(arg)
                                };
                                let __array__289=[],__elements__287=["new"," ",await (async function(){
                                     return await compile((tokens && tokens["1"]),ctx) 
                                })(),"("];
                                let __BREAK__FLAG__=false;
                                for(let __iter__286 in __elements__287) {
                                    __array__289.push(await __for_body__288(__elements__287[__iter__286]));
                                    if(__BREAK__FLAG__) {
                                         __array__289.pop();
                                        break;
                                        
                                    }
                                }return __array__289;
                                 
                            })();
                            await push_as_arg_list(acc,args);
                            return (acc).push(")")
                        }
                    } else if (check_true ((await not((null==(type_details && type_details["value"])))&& (type_details && type_details["value"]) instanceof Function))) {
                        {
                            await (async function() {
                                let __for_body__292=async function(arg) {
                                    return (acc).push(arg)
                                };
                                let __array__293=[],__elements__291=["new"," ",target_type,"("];
                                let __BREAK__FLAG__=false;
                                for(let __iter__290 in __elements__291) {
                                    __array__293.push(await __for_body__292(__elements__291[__iter__290]));
                                    if(__BREAK__FLAG__) {
                                         __array__293.pop();
                                        break;
                                        
                                    }
                                }return __array__293;
                                 
                            })();
                            await push_as_arg_list(acc,args);
                            (acc).push(")")
                        }
                    } else if (check_true (((null==(type_details && type_details["value"]))&& await not((null==(root_type_details && root_type_details["value"])))))) {
                        {
                            await (async function() {
                                let __for_body__296=async function(arg) {
                                    return (acc).push(arg)
                                };
                                let __array__297=[],__elements__295=["(",(preamble && preamble["0"])," ",env_ref,"get_global","(","\"","indirect_new","\"",")",")","(",target_type];
                                let __BREAK__FLAG__=false;
                                for(let __iter__294 in __elements__295) {
                                    __array__297.push(await __for_body__296(__elements__295[__iter__294]));
                                    if(__BREAK__FLAG__) {
                                         __array__297.pop();
                                        break;
                                        
                                    }
                                }return __array__297;
                                 
                            })();
                            if (check_true (((args && args.length)>0))){
                                {
                                    (acc).push(",");
                                    await push_as_arg_list(acc,args)
                                }
                            };
                            (acc).push(")")
                        }
                    } else {
                        {
                            await (async function() {
                                let __for_body__300=async function(arg) {
                                    return (acc).push(arg)
                                };
                                let __array__301=[],__elements__299=["new"," ",(tokens && tokens["1"] && tokens["1"]["name"]),"("];
                                let __BREAK__FLAG__=false;
                                for(let __iter__298 in __elements__299) {
                                    __array__301.push(await __for_body__300(__elements__299[__iter__298]));
                                    if(__BREAK__FLAG__) {
                                         __array__301.pop();
                                        break;
                                        
                                    }
                                }return __array__301;
                                 
                            })();
                            await push_as_arg_list(acc,args);
                            (acc).push(")")
                        }
                    }
                } ();
                target_return_type=(await get_ctx_val(ctx,target_type)|| await (async function(){
                    let __targ__302=(await get_declarations(ctx,target_type)|| new Object());
                    if (__targ__302){
                         return(__targ__302)["type"]
                    } 
                })()|| await (await Environment.get_global("get_outside_global"))(target_type)|| UnknownType);
                await async function(){
                    if (check_true (await get_declarations(ctx,target_type))) {
                        return (acc).unshift({
                            ctype:await get_declarations(ctx,target_type)
                        })
                    } else if (check_true ((((tokens && tokens["1"] && tokens["1"]["name"])==="Function")|| ((tokens && tokens["1"] && tokens["1"]["name"])==="AsyncFunction")))) {
                        (acc).unshift({
                            ctype:target_return_type
                        })
                    } else if (check_true (false)) {
                        (acc).unshift({
                            ctype:UnknownType
                        })
                    }
                } ();
                return acc
            };
            compile_val_mod=async function(tokens,ctx) {
                let target;
                let sanitized;
                let target_details;
                let comps;
                let in_infix;
                let operation;
                let mod_source;
                let how_much;
                target=((tokens && tokens["1"] && tokens["1"]["name"])|| await (async function(){
                    throw new SyntaxError(await add((tokens && tokens["0"] && tokens["0"]["name"])," requires at least one argument indicating the symbol which value is to be modified"));
                    
                })());
                sanitized=await (async function(){
                    if (check_true (((tokens && tokens["1"] && tokens["1"]["ref"])&& (tokens && tokens["1"] && tokens["1"]["name"])))){
                        return await sanitize_js_ref_name((tokens && tokens["1"] && tokens["1"]["name"]))
                    } else {
                        return await add((tokens && tokens["0"] && tokens["0"]["name"])," requires at least one argument indicating the symbol which value is to be modified")
                    }
                })();
                target_details=await (async function(){
                     return await async function(){
                        if (check_true (await get_ctx(ctx,sanitized))) {
                            return "local"
                        } else if (check_true (await get_lisp_ctx(ctx,(tokens && tokens["1"] && tokens["1"]["name"])))) {
                            return "global"
                        } else {
                            {
                                {
                                    let it;
                                    it=await get_declaration_details(ctx,(tokens && tokens["1"] && tokens["1"]["name"]));
                                    if (check_true (it)){
                                        return await async function(){
                                            if (check_true ((it && it["is_argument"]))) {
                                                return "local"
                                            } else if (check_true ((it && it["declared_global"]))) {
                                                return "global"
                                            } else if (check_true (it)) {
                                                return "local"
                                            }
                                        } ()
                                    } else {
                                        return 
                                    }
                                }
                            }
                        }
                    } () 
                })();
                comps=(target).split(".");
                in_infix=await get_ctx_val(ctx,"__COMP_INFIX_OPS__");
                operation=await (async function(){
                    if (check_true (in_infix)){
                        return await async function(){
                            if (check_true (((tokens && tokens["0"] && tokens["0"]["name"])==="inc"))) {
                                return "+"
                            } else if (check_true (((tokens && tokens["0"] && tokens["0"]["name"])==="dec"))) {
                                return "-"
                            } else {
                                throw new SyntaxError(("Invalid value modification operator: "+ (tokens && tokens["0"] && tokens["0"]["name"])));
                                
                            }
                        } ()
                    } else {
                        return await async function(){
                            if (check_true (((target_details==="local")&& ((tokens && tokens["0"] && tokens["0"]["name"])==="inc")))) {
                                return "+="
                            } else if (check_true (((target_details==="local")&& ((tokens && tokens["0"] && tokens["0"]["name"])==="dec")))) {
                                return "-="
                            } else if (check_true (((tokens && tokens["0"] && tokens["0"]["name"])==="inc"))) {
                                return "+"
                            } else {
                                return "-"
                            }
                        } ()
                    }
                })();
                mod_source=null;
                how_much=(((tokens && tokens["2"])&& await compile_wrapper_fn((tokens && tokens["2"]),ctx))|| 1);
                if (check_true ((undefined===target_details))){
                    throw new ReferenceError(("unknown symbol: "+ (comps && comps["0"])));
                    
                };
                return await async function(){
                    if (check_true ((target_details==="global"))) {
                        {
                            has_lisp_globals=true;
                            return ["(","await"," ",env_ref,"set_global(\"",target,"\",","await"," ",env_ref,"get_global(\"",target,"\")"," ",operation," ",how_much,"))"]
                        }
                    } else if (check_true (in_infix)) {
                        {
                            return ["(",target,"=",target,operation,how_much,")"]
                        }
                    } else {
                        return await (async function(){
                            let __array_op_rval__303=sanitized;
                             if (__array_op_rval__303 instanceof Function){
                                return await __array_op_rval__303(operation,how_much) 
                            } else {
                                return [__array_op_rval__303,operation,how_much]
                            }
                        })()
                    }
                } ()
            };
            compile_try=async function(tokens,ctx) {
                if (check_true ((null==(ctx && ctx["block_step"])))){
                    return await compile_block(await ensure_block(tokens),ctx)
                } else {
                    return await compile_try_inner(tokens,ctx)
                }
            };
            compile_try_inner=async function(tokens,ctx) {
                let acc;
                let try_block;
                let compiled_try_block;
                let catch_block;
                let idx;
                let exception_ref;
                let base_error_caught;
                let catch_stmts;
                let catches;
                let compile_catch;
                acc=[];
                try_block=await (async function(){
                     return await async function(){
                        if (check_true (((tokens && tokens["1"])&& (null==(tokens && tokens["1"] && tokens["1"]["val"]))))) {
                            return (tokens && tokens["1"])
                        } else if (check_true (((tokens && tokens["1"] && tokens["1"]["type"])==="objlit"))) {
                            return (tokens && tokens["1"])
                        } else if (check_true ((tokens && tokens["1"]))) {
                            return (tokens && tokens["1"] && tokens["1"]["val"])
                        }
                    } () 
                })();
                compiled_try_block=null;
                catch_block=null;
                idx=-1;
                exception_ref=await gen_temp_name("exception");
                base_error_caught=false;
                catch_stmts=[];
                catches=await tokens["slice"].call(tokens,2);
                compile_catch=async function(catch_block) {
                    let throwable_type;
                    let throwable_ref;
                    let catch_statements;
                    let stmts;
                    let subacc;
                    throwable_type=(catch_block && catch_block["1"] && catch_block["1"]["name"]);
                    throwable_ref=(catch_block && catch_block["2"] && catch_block["2"]["val"] && catch_block["2"]["val"]["0"] && catch_block["2"]["val"]["0"]["name"]);
                    catch_statements=(catch_block && catch_block["3"]);
                    stmts=null;
                    subacc=[];
                    ctx=await (async function(){
                         return await new_ctx(ctx) 
                    })();
                    await set_ctx(ctx,throwable_ref,(await Environment.get_global("indirect_new"))(catch_block['1'].name));
                    if (check_true ((throwable_type==="Error"))){
                        {
                            base_error_caught=true
                        }
                    };
                    stmts=await compile_block(await ensure_block(catch_statements),ctx);
                    if (check_true ((idx>0))){
                        (subacc).push([" ","else"," "])
                    };
                    (subacc).push(["if (",exception_ref," instanceof ",throwable_type,") ","{","let ",throwable_ref,"=",exception_ref,";",stmts,"}"]);
                    if (check_true (((idx===((catches && catches.length)- 1))&& await not(base_error_caught)))){
                        {
                            (subacc).push([" ","else"," "]);
                            (subacc).push(await (async function(){
                                 return [{
                                    completion:"throw"
                                },"throw"," ",exception_ref,";"] 
                            })())
                        }
                    };
                    return subacc
                };
                await async function(){
                    if (check_true (((tokens && tokens.length)<2))) {
                        throw new SyntaxError("invalid try form: missing try block");
                        
                    } else if (check_true (((null==catches)|| ((catches && catches.length)<1)))) {
                        throw new SyntaxError("invalid catch block: missing catch");
                        
                    }
                } ();
                compiled_try_block=await compile_block(await ensure_block(try_block),ctx);
                (acc).push({
                    ctype:"tryblock"
                });
                (acc).push(["try"," ",compiled_try_block]);
                (catch_stmts).push([" ","catch"," ","(",exception_ref,")"," "]);
                (catch_stmts).push("{");
                await (async function(){
                     let __test_condition__304=async function() {
                        return (idx<((catches && catches.length)- 1))
                    };
                    let __body_ref__305=async function() {
                        idx+=1;
                        catch_block=await (async function(){
                            let __targ__306=catches[idx];
                            if (__targ__306){
                                 return(__targ__306)["val"]
                            } 
                        })();
                        if (check_true ((catch_block instanceof Array))){
                            return (catch_stmts).push(await compile_catch(catch_block))
                        } else {
                            throw new SyntaxError("invalid catch form");
                            
                        }
                    };
                    let __BREAK__FLAG__=false;
                    while(await __test_condition__304()) {
                         await __body_ref__305();
                         if(__BREAK__FLAG__) {
                             break;
                            
                        }
                    } ;
                    
                })();
                (catch_stmts).push("}");
                (acc).push(catch_stmts);
                return acc
            };
            compile_throw=async function(tokens,ctx) {
                let acc;
                let error_message;
                let mode;
                let cmp_rec;
                let error_instance;
                acc=[];
                error_message=null;
                mode=1;
                cmp_rec=await get_ctx(ctx,"__COMPLETION_SCOPE__");
                error_instance=null;
                await (await Environment.get_global("assert"))(cmp_rec,"compiler error: throw unable to find completion scope in context");
                await async function(){
                    if (check_true (((tokens instanceof Array)&& ((tokens && tokens.length)===2)&& (tokens && tokens["1"] && tokens["1"]["ref"])))) {
                        {
                            mode=0;
                            return error_instance=await (async function(){
                                 return await compile((tokens && tokens["1"]),ctx) 
                            })()
                        }
                    } else if (check_true (((tokens instanceof Array)&& ((tokens && tokens.length)===3)))) {
                        {
                            error_instance=await (async function(){
                                 return await compile((tokens && tokens["1"]),ctx) 
                            })();
                            error_message=await (async function(){
                                 return await compile((tokens && tokens["2"]),ctx) 
                            })()
                        }
                    } else if (check_true (((tokens instanceof Array)&& ((tokens && tokens.length)===2)))) {
                        {
                            error_message=await (async function(){
                                 return await compile((tokens && tokens["1"]),ctx) 
                            })();
                            error_instance="Error"
                        }
                    } else {
                        throw new SyntaxError("Invalid Throw Syntax");
                        
                    }
                } ();
                if (check_true ((mode===0))){
                    await (async function() {
                        let __for_body__309=async function(t) {
                            return (acc).push(t)
                        };
                        let __array__310=[],__elements__308=await (async function(){
                             return [{
                                completion:"throw"
                            },"throw"," ",error_instance,";"] 
                        })();
                        let __BREAK__FLAG__=false;
                        for(let __iter__307 in __elements__308) {
                            __array__310.push(await __for_body__309(__elements__308[__iter__307]));
                            if(__BREAK__FLAG__) {
                                 __array__310.pop();
                                break;
                                
                            }
                        }return __array__310;
                         
                    })()
                } else {
                    await (async function() {
                        let __for_body__313=async function(t) {
                            return (acc).push(t)
                        };
                        let __array__314=[],__elements__312=await (async function(){
                             return [{
                                completion:"throw"
                            },"throw"," ","new"," ",error_instance,"(",error_message,")",";"] 
                        })();
                        let __BREAK__FLAG__=false;
                        for(let __iter__311 in __elements__312) {
                            __array__314.push(await __for_body__313(__elements__312[__iter__311]));
                            if(__BREAK__FLAG__) {
                                 __array__314.pop();
                                break;
                                
                            }
                        }return __array__314;
                         
                    })()
                };
                ((cmp_rec && cmp_rec["completion_records"])).push({
                    block_id:(ctx && ctx["block_id"]),type:"throw",block_step:(ctx && ctx["block_step"]),stmt:acc
                });
                return acc
            };
            compile_break=async function(tokens,ctx) {
                return await (async function(){
                    let __array_op_rval__315=break_out;
                     if (__array_op_rval__315 instanceof Function){
                        return await __array_op_rval__315("=","true",";","return") 
                    } else {
                        return [__array_op_rval__315,"=","true",";","return"]
                    }
                })()
            };
            compile_return=async function(tokens,ctx) {
                let acc;
                let return_val_reference;
                let return_value;
                let cmp_rec;
                acc=[];
                return_val_reference=await gen_temp_name("return");
                return_value=null;
                cmp_rec=await get_ctx(ctx,"__COMPLETION_SCOPE__");
                await (await Environment.get_global("assert"))(cmp_rec,"compiler error: compile_return: no completion scope record found");
                if (check_true (await is_block_ques_((tokens && tokens["1"] && tokens["1"]["val"])))){
                    {
                        (acc).push(["let"," ",return_val_reference,"=",await (async function(){
                             return await compile((tokens && tokens["1"] && tokens["1"]["val"]),ctx) 
                        })(),";"]);
                        (acc).push(await (async function(){
                             return [{
                                completion:"return"
                            },"return"," ",return_val_reference,";"] 
                        })())
                    }
                } else {
                    {
                        await (async function() {
                            let __for_body__318=async function(t) {
                                return (acc).push(t)
                            };
                            let __array__319=[],__elements__317=["return"," ",await (async function(){
                                 return await compile((tokens && tokens["1"]),ctx) 
                            })(),";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__316 in __elements__317) {
                                __array__319.push(await __for_body__318(__elements__317[__iter__316]));
                                if(__BREAK__FLAG__) {
                                     __array__319.pop();
                                    break;
                                    
                                }
                            }return __array__319;
                             
                        })()
                    }
                };
                ((cmp_rec && cmp_rec["completion_records"])).push({
                    block_id:(ctx && ctx["block_id"]),block_step:(ctx && ctx["block_step"]),type:"return",stmt:await last(acc)
                });
                return acc
            };
            apply_log=await (async function(){
                if (check_true ((opts && opts["quiet_mode"]))){
                    return log
                } else {
                    return await defclog({
                        prefix:"compile_apply",background:"sienna",color:"white"
                    })
                }
            })();
            compile_apply=async function(tokens,ctx) {
                let acc;
                let fn_ref;
                let complex_ques_;
                let args_ref;
                let function_ref;
                let target_argument_ref;
                let target_arg;
                let ctype;
                let preceding_arg_ref;
                let preamble;
                let requires_await;
                let compiled_fun_resolver;
                let args;
                acc=[];
                fn_ref=(tokens && tokens["1"]);
                complex_ques_=false;
                args_ref=await gen_temp_name("apply_args");
                function_ref=await gen_temp_name("apply_fn");
                target_argument_ref=null;
                target_arg=null;
                ctype=null;
                preceding_arg_ref=null;
                preamble=await calling_preamble(ctx);
                requires_await=false;
                ctx=await (async function(){
                     return await new_ctx(ctx) 
                })();
                compiled_fun_resolver=null;
                args=await tokens["slice"].call(tokens,2);
                ;
                await set_new_completion_scope(ctx);
                if (check_true ((args&& ((args && args.length)===1)))){
                    {
                        args=await first(args)
                    }
                };
                function_ref=await compile_wrapper_fn(fn_ref,ctx);
                if (check_true ((fn_ref && fn_ref["ref"]))){
                    {
                        ctype=await get_declaration_details(ctx,(fn_ref && fn_ref["name"]))
                    }
                };
                if (check_true ((ctype && ctype["value"]) instanceof Function)){
                    {
                        requires_await=true
                    }
                };
                if (check_true ((args instanceof Array))){
                    {
                        target_argument_ref=await gen_temp_name("target_arg");
                        target_arg=(args).pop();
                        await (async function() {
                            let __for_body__322=async function(t) {
                                return (acc).push(t)
                            };
                            let __array__323=[],__elements__321=["let"," ",target_argument_ref,"=","[]",".concat","(",await (async function(){
                                 return await compile(target_arg,ctx) 
                            })(),")",";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__320 in __elements__321) {
                                __array__323.push(await __for_body__322(__elements__321[__iter__320]));
                                if(__BREAK__FLAG__) {
                                     __array__323.pop();
                                    break;
                                    
                                }
                            }return __array__323;
                             
                        })();
                        await (async function() {
                            let __for_body__326=async function(t) {
                                return (acc).push(t)
                            };
                            let __array__327=[],__elements__325=["if","(","!",target_argument_ref," ","instanceof"," ","Array",")","{","throw"," ","new"," ","TypeError","(","\"Invalid final argument to apply - an array is required\"",")","}"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__324 in __elements__325) {
                                __array__327.push(await __for_body__326(__elements__325[__iter__324]));
                                if(__BREAK__FLAG__) {
                                     __array__327.pop();
                                    break;
                                    
                                }
                            }return __array__327;
                             
                        })();
                        await (async function() {
                            let __for_body__330=async function(token) {
                                preceding_arg_ref=await gen_temp_name("pre_arg");
                                if (check_true (await is_form_ques_(token))){
                                    {
                                        await (async function() {
                                            let __for_body__334=async function(t) {
                                                return (acc).push(t)
                                            };
                                            let __array__335=[],__elements__333=["let"," ",preceding_arg_ref,"=",await compile_wrapper_fn(token,ctx),";"];
                                            let __BREAK__FLAG__=false;
                                            for(let __iter__332 in __elements__333) {
                                                __array__335.push(await __for_body__334(__elements__333[__iter__332]));
                                                if(__BREAK__FLAG__) {
                                                     __array__335.pop();
                                                    break;
                                                    
                                                }
                                            }return __array__335;
                                             
                                        })()
                                    }
                                } else {
                                    preceding_arg_ref=await compile_wrapper_fn(token,ctx)
                                };
                                return (acc).push(await (async function(){
                                    let __array_op_rval__336=target_argument_ref;
                                     if (__array_op_rval__336 instanceof Function){
                                        return await __array_op_rval__336(".unshift","(",preceding_arg_ref,")",";") 
                                    } else {
                                        return [__array_op_rval__336,".unshift","(",preceding_arg_ref,")",";"]
                                    }
                                })())
                            };
                            let __array__331=[],__elements__329=args;
                            let __BREAK__FLAG__=false;
                            for(let __iter__328 in __elements__329) {
                                __array__331.push(await __for_body__330(__elements__329[__iter__328]));
                                if(__BREAK__FLAG__) {
                                     __array__331.pop();
                                    break;
                                    
                                }
                            }return __array__331;
                             
                        })();
                        await (async function() {
                            let __for_body__339=async function(t) {
                                return (acc).push(t)
                            };
                            let __array__340=[],__elements__338=["return"," ","(",function_ref,")",".","apply","(","this",",",target_argument_ref,")"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__337 in __elements__338) {
                                __array__340.push(await __for_body__339(__elements__338[__iter__337]));
                                if(__BREAK__FLAG__) {
                                     __array__340.pop();
                                    break;
                                    
                                }
                            }return __array__340;
                             
                        })()
                    }
                } else {
                    {
                        if (check_true (await is_form_ques_(args))){
                            {
                                await (async function() {
                                    let __for_body__343=async function(t) {
                                        return (acc).push(t)
                                    };
                                    let __array__344=[],__elements__342=["let"," ",args_ref,"=",await compile_wrapper_fn((args && args["val"]),ctx),";"];
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__341 in __elements__342) {
                                        __array__344.push(await __for_body__343(__elements__342[__iter__341]));
                                        if(__BREAK__FLAG__) {
                                             __array__344.pop();
                                            break;
                                            
                                        }
                                    }return __array__344;
                                     
                                })();
                                complex_ques_=true
                            }
                        };
                        await (async function() {
                            let __for_body__347=async function(t) {
                                return (acc).push(t)
                            };
                            let __array__348=[],__elements__346=["return"," ","("," ",function_ref,")",".","apply","(","this"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__345 in __elements__346) {
                                __array__348.push(await __for_body__347(__elements__346[__iter__345]));
                                if(__BREAK__FLAG__) {
                                     __array__348.pop();
                                    break;
                                    
                                }
                            }return __array__348;
                             
                        })();
                        if (check_true (args)){
                            {
                                (acc).push(",");
                                if (check_true (complex_ques_)){
                                    (acc).push(args_ref)
                                } else {
                                    (acc).push(await compile_wrapper_fn(args,ctx))
                                }
                            }
                        };
                        (acc).push(")")
                    }
                };
                return [(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()","{",acc,"}",")","()"]
            };
            compile_call=async function(tokens,ctx) {
                let preamble;
                let dbg_level;
                let simple_target_ques_;
                let simple_method_ques_;
                let compiled;
                preamble=await calling_preamble(ctx);
                dbg_level=await debug_level(ctx);
                simple_target_ques_=await (async function(){
                    if (check_true (((dbg_level===0)&& ((tokens && tokens["1"] && tokens["1"]["ref"])===true)))){
                        return true
                    } else {
                        return false
                    }
                })();
                simple_method_ques_=await (async function(){
                    if (check_true (((tokens && tokens["2"] && tokens["2"]["type"])==="literal"))){
                        return true
                    } else {
                        return false
                    }
                })();
                ctx=ctx;
                compiled=null;
                ;
                compiled=await (async function(){
                     return await async function(){
                        if (check_true ((simple_target_ques_&& simple_method_ques_))) {
                            return await compile_call_inner(tokens,ctx,{
                                type:0,preamble:preamble
                            })
                        } else if (check_true (simple_target_ques_)) {
                            return await compile_call_inner(tokens,ctx,{
                                type:0,preamble:preamble
                            })
                        } else {
                            {
                                ctx=await (async function(){
                                     return await new_ctx(ctx) 
                                })();
                                await set_new_completion_scope(ctx);
                                if (check_true ((dbg_level===0))){
                                    return [(preamble && preamble["2"]),(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ","{",await compile_call_inner(tokens,ctx,{
                                        type:2,preamble:preamble,debug_level:dbg_level
                                    })," ","}",")","()"]
                                } else {
                                    return [(preamble && preamble["2"]),(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ","{","try","{",await compile_call_inner(tokens,ctx,{
                                        type:2,preamble:preamble,debug_level:dbg_level
                                    })," ","} catch (e) { Environment.get_global(\"log_error\",console.error)(\"call: \"+e.message, ",await JSON.stringify(await source_from_tokens(tokens,expanded_tree)),"); throw e; }","}",")","()"]
                                }
                            }
                        }
                    } () 
                })();
                return compiled
            };
            compile_call_inner=async function(tokens,ctx,opts) {
                let acc;
                let target;
                let idx;
                let preamble;
                let add_args;
                let method;
                acc=[];
                target=null;
                idx=-1;
                preamble=(opts && opts["preamble"]);
                add_args=async function() {
                    return await (async function() {
                        let __for_body__351=async function(token) {
                            (acc).push(",");
                            return (acc).push(await compile_wrapper_fn(token,ctx))
                        };
                        let __array__352=[],__elements__350=await tokens["slice"].call(tokens,3);
                        let __BREAK__FLAG__=false;
                        for(let __iter__349 in __elements__350) {
                            __array__352.push(await __for_body__351(__elements__350[__iter__349]));
                            if(__BREAK__FLAG__) {
                                 __array__352.pop();
                                break;
                                
                            }
                        }return __array__352;
                         
                    })()
                };
                method=null;
                if (check_true (((tokens && tokens.length)<3))){
                    {
                        throw new SyntaxError(("call: missing arguments, requires at least 2"));
                        
                    }
                };
                target=await compile_wrapper_fn((tokens && tokens["1"]),ctx);
                method=await compile_wrapper_fn((tokens && tokens["2"]),ctx);
                await async function(){
                    if (check_true ((((opts && opts["type"])===0)|| ((opts && opts["type"])===1)))) {
                        {
                            return await async function(){
                                if (check_true (((tokens && tokens.length)===3))) {
                                    return await (async function() {
                                        let __for_body__355=async function(t) {
                                            return (acc).push(t)
                                        };
                                        let __array__356=[],__elements__354=await (async function(){
                                            let __array_op_rval__357=(preamble && preamble["0"]);
                                             if (__array_op_rval__357 instanceof Function){
                                                return await __array_op_rval__357(" ",target,"[",method,"]","()") 
                                            } else {
                                                return [__array_op_rval__357," ",target,"[",method,"]","()"]
                                            }
                                        })();
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__353 in __elements__354) {
                                            __array__356.push(await __for_body__355(__elements__354[__iter__353]));
                                            if(__BREAK__FLAG__) {
                                                 __array__356.pop();
                                                break;
                                                
                                            }
                                        }return __array__356;
                                         
                                    })()
                                } else {
                                    {
                                        await (async function() {
                                            let __for_body__360=async function(t) {
                                                return (acc).push(t)
                                            };
                                            let __array__361=[],__elements__359=await (async function(){
                                                let __array_op_rval__362=(preamble && preamble["0"]);
                                                 if (__array_op_rval__362 instanceof Function){
                                                    return await __array_op_rval__362(" ",target,"[",method,"]",".call","(",target) 
                                                } else {
                                                    return [__array_op_rval__362," ",target,"[",method,"]",".call","(",target]
                                                }
                                            })();
                                            let __BREAK__FLAG__=false;
                                            for(let __iter__358 in __elements__359) {
                                                __array__361.push(await __for_body__360(__elements__359[__iter__358]));
                                                if(__BREAK__FLAG__) {
                                                     __array__361.pop();
                                                    break;
                                                    
                                                }
                                            }return __array__361;
                                             
                                        })();
                                        await add_args();
                                        return (acc).push(")")
                                    }
                                }
                            } ()
                        }
                    } else if (check_true (((opts && opts["type"])===2))) {
                        {
                            await (async function() {
                                let __for_body__365=async function(t) {
                                    return (acc).push(t)
                                };
                                let __array__366=[],__elements__364=["{"," ","let"," ","__call_target__","=",target,","," ","__call_method__","=",method,";"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__363 in __elements__364) {
                                    __array__366.push(await __for_body__365(__elements__364[__iter__363]));
                                    if(__BREAK__FLAG__) {
                                         __array__366.pop();
                                        break;
                                        
                                    }
                                }return __array__366;
                                 
                            })();
                            await async function(){
                                if (check_true (((tokens && tokens.length)===3))) {
                                    return await (async function() {
                                        let __for_body__369=async function(t) {
                                            return (acc).push(t)
                                        };
                                        let __array__370=[],__elements__368=["return"," ",(preamble && preamble["0"])," ","__call_target__","[","__call_method__","]","()"];
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__367 in __elements__368) {
                                            __array__370.push(await __for_body__369(__elements__368[__iter__367]));
                                            if(__BREAK__FLAG__) {
                                                 __array__370.pop();
                                                break;
                                                
                                            }
                                        }return __array__370;
                                         
                                    })()
                                } else {
                                    {
                                        await (async function() {
                                            let __for_body__373=async function(t) {
                                                return (acc).push(t)
                                            };
                                            let __array__374=[],__elements__372=["return"," ",(preamble && preamble["0"])," ","__call_target__","[","__call_method__","]",".","call","(","__call_target__"];
                                            let __BREAK__FLAG__=false;
                                            for(let __iter__371 in __elements__372) {
                                                __array__374.push(await __for_body__373(__elements__372[__iter__371]));
                                                if(__BREAK__FLAG__) {
                                                     __array__374.pop();
                                                    break;
                                                    
                                                }
                                            }return __array__374;
                                             
                                        })();
                                        await add_args();
                                        (acc).push(")")
                                    }
                                }
                            } ();
                            (acc).push("}")
                        }
                    }
                } ();
                return acc
            };
            check_needs_wrap=async function(stmts) {
                let fst;
                fst=(((stmts instanceof Array)&& await first(stmts)&& (await first(stmts) instanceof Object)&& await not(await (async function(){
                    let __targ__375=await first(stmts);
                    if (__targ__375){
                         return(__targ__375)["ctype"]
                    } 
                })() instanceof Function)&& await (async function(){
                    let __targ__376=await first(stmts);
                    if (__targ__376){
                         return(__targ__376)["ctype"]
                    } 
                })()&& await (async function(){
                     return await async function(){
                        if (check_true ((await (async function(){
                            let __targ__377=await first(stmts);
                            if (__targ__377){
                                 return(__targ__377)["ctype"]
                            } 
                        })() instanceof String || typeof await (async function(){
                            let __targ__377=await first(stmts);
                            if (__targ__377){
                                 return(__targ__377)["ctype"]
                            } 
                        })()==='string'))) {
                            return await (async function(){
                                let __targ__378=await first(stmts);
                                if (__targ__378){
                                     return(__targ__378)["ctype"]
                                } 
                            })()
                        } else {
                            return await sub_type(await (async function(){
                                let __targ__379=await first(stmts);
                                if (__targ__379){
                                     return(__targ__379)["ctype"]
                                } 
                            })())
                        }
                    } () 
                })())|| "");
                await console.warn("DEPRECATION: check_needs_wrap called: ",stmts);
                return await async function(){
                    if (check_true (await contains_ques_("block",fst))) {
                        return true
                    } else {
                        return false
                    }
                } ()
            };
            compile_import=async function(tokens,ctx) {
                let symbol_tokens;
                let __symbols__380= async function(){
                    return []
                };
                let from_tokens;
                let from_place;
                let acc;
                {
                    symbol_tokens=(tokens && tokens["1"]);
                    let symbols=await __symbols__380();
                    ;
                    from_tokens=null;
                    from_place=null;
                    acc=[];
                    if (check_true (((tokens && tokens.length)<3))){
                        throw new SyntaxError("import requires exactly two arguments");
                        
                    };
                    symbol_tokens=(tokens && tokens["1"]);
                    from_tokens=(tokens && tokens["2"]);
                    from_place=await (async function(){
                         return await compile(from_tokens,ctx) 
                    })();
                    (acc).push({
                        ctype:"statement",meta:{
                            imported_from:from_place
                        }
                    });
                    (acc).push("import");
                    (acc).push(" ");
                    await async function(){
                        if (check_true (((symbol_tokens && symbol_tokens["val"]) instanceof Array))) {
                            {
                                await (async function() {
                                    let __for_body__383=async function(s) {
                                        return (symbols).push((s && s.name))
                                    };
                                    let __array__384=[],__elements__382=(symbol_tokens && symbol_tokens["val"]);
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__381 in __elements__382) {
                                        __array__384.push(await __for_body__383(__elements__382[__iter__381]));
                                        if(__BREAK__FLAG__) {
                                             __array__384.pop();
                                            break;
                                            
                                        }
                                    }return __array__384;
                                     
                                })();
                                return await (async function() {
                                    let __for_body__387=async function(t) {
                                        return (acc).push(t)
                                    };
                                    let __array__388=[],__elements__386=await flatten(["{"," ",symbols," ","}"," ","from"," ",from_place]);
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
                        } else {
                            throw new SyntaxError("import requires an array of imported symbols as a second argument");
                            
                        }
                    } ();
                    return acc
                }
            };
            compile_dynamic_import=async function(tokens,ctx) {
                let from_tokens;
                let preamble;
                let from_place;
                let can_be_static;
                let metaval;
                let imported_from;
                let acc;
                from_tokens=null;
                preamble=await calling_preamble(ctx);
                from_place=null;
                can_be_static=false;
                metaval=null;
                imported_from=null;
                acc=[];
                ;
                from_tokens=(tokens && tokens["1"]);
                from_place=await compile_wrapper_fn(from_tokens,ctx);
                imported_from=await (async function(){
                    if (check_true ((from_place instanceof Array))){
                        return (from_place && from_place["1"])
                    } else {
                        return from_place
                    }
                })();
                if (check_true (((imported_from instanceof String || typeof imported_from==='string')&& await starts_with_ques_("\"",imported_from)&& await (await Environment.get_global("ends_with?"))("\"",imported_from)))){
                    {
                        can_be_static=true;
                        imported_from=await imported_from["substr"].call(imported_from,1,((imported_from && imported_from.length)- 2))
                    }
                };
                await async function(){
                    external_dependencies[imported_from]=true;
                    return external_dependencies;
                    
                }();
                metaval=await (async function(){
                    if (check_true (can_be_static)){
                        return {
                            initializer:await (async function(){
                                 return ["=:javascript","undefined"] 
                            })()
                        }
                    } else {
                        return new Object()
                    }
                })();
                (acc).push({
                    ctype:"statement",meta:metaval
                });
                await (async function() {
                    let __for_body__392=async function(t) {
                        return (acc).push(t)
                    };
                    let __array__393=[],__elements__391=await flatten([(preamble && preamble["0"])," ","import"," ","(",from_place,")"]);
                    let __BREAK__FLAG__=false;
                    for(let __iter__390 in __elements__391) {
                        __array__393.push(await __for_body__392(__elements__391[__iter__390]));
                        if(__BREAK__FLAG__) {
                             __array__393.pop();
                            break;
                            
                        }
                    }return __array__393;
                     
                })();
                return acc
            };
            compile_javascript=async function(tokens,ctx) {
                let acc;
                let text;
                acc=await (async function(){
                     return [{
                        ctype:"__JS__"
                    }] 
                })();
                text=null;
                await (async function() {
                    let __for_body__396=async function(t) {
                        return await async function(){
                            if (check_true ((t && t["ref"]))) {
                                return (acc).push((t && t.name))
                            } else if (check_true (((t && t["val"]) instanceof Array))) {
                                return (acc).push(await (async function(){
                                     return await compile(t,ctx) 
                                })())
                            } else {
                                return (acc).push((t && t["val"]))
                            }
                        } ()
                    };
                    let __array__397=[],__elements__395=(await (await Environment.get_global("rest"))(tokens)|| []);
                    let __BREAK__FLAG__=false;
                    for(let __iter__394 in __elements__395) {
                        __array__397.push(await __for_body__396(__elements__395[__iter__394]));
                        if(__BREAK__FLAG__) {
                             __array__397.pop();
                            break;
                            
                        }
                    }return __array__397;
                     
                })();
                return acc
            };
            compile_set_global=async function(tokens,ctx,opts) {
                let target;
                let wrap_as_function_ques_;
                let global_dependencies;
                let __external_dependencies__398= async function(){
                    return null
                };
                let preamble;
                let source_meta;
                let acc;
                let clog;
                let metavalue;
                let assignment_value;
                {
                    target=(tokens && tokens["1"] && tokens["1"]["name"]);
                    wrap_as_function_ques_=null;
                    ctx=await (async function(){
                         return await new_ctx(ctx) 
                    })();
                    global_dependencies=null;
                    let external_dependencies=await __external_dependencies__398();
                    ;
                    preamble=await calling_preamble(ctx);
                    source_meta=null;
                    acc=null;
                    clog=await (async function(){
                        if (check_true ((opts && opts["quiet_mode"]))){
                            return log
                        } else {
                            return await defclog({
                                prefix:"compile_set_global",color:"blue",background:"#205020"
                            })
                        }
                    })();
                    metavalue=null;
                    assignment_value=null;
                    ;
                    await async function(){
                        if (check_true ((null==(tokens && tokens["1"])))) {
                            throw new SyntaxError("set global directive missing assignment target and assignment value");
                            
                        } else if (check_true ((null==(tokens && tokens["2"])))) {
                            throw new SyntaxError("set global directive missing assignment value");
                            
                        }
                    } ();
                    has_lisp_globals=true;
                    await set_ctx(ctx,"__GLOBALS__",new Set());
                    await async function(){
                        let __target_obj__399=(root_ctx && root_ctx["defined_lisp_globals"]);
                        __target_obj__399[target]=AsyncFunction;
                        return __target_obj__399;
                        
                    }();
                    assignment_value=await (async function(){
                        return await compile_wrapper_fn((tokens && tokens["2"]),ctx)
                    })();
                    global_dependencies=await (async function(){
                         return await (await Environment.get_global("to_array"))(await get_ctx(ctx,"__GLOBALS__")) 
                    })();
                    external_dependencies=await (async function(){
                         return await (await Environment.get_global("to_array"))(await get_ctx(ctx,"__EXTERNALS__")) 
                    })();
                    if (check_true (true)){
                        {
                            await async function(){
                                if (check_true ((null==(tokens && tokens["3"])))) {
                                    return (tokens).push(await tokenize({
                                        requires:global_dependencies,externals:external_dependencies,source_name:source_name
                                    },ctx))
                                } else if (check_true (((tokens && tokens["3"] && tokens["3"]["val"] && tokens["3"]["val"]["val"] && tokens["3"]["val"]["val"]["1"]) instanceof Object))) {
                                    {
                                        await async function(){
                                            let __target_obj__400=(tokens && tokens["3"] && tokens["3"]["val"] && tokens["3"]["val"]["val"] && tokens["3"]["val"]["val"]["1"]);
                                            __target_obj__400["requires"]=global_dependencies;
                                            return __target_obj__400;
                                            
                                        }();
                                        await async function(){
                                            let __target_obj__401=(tokens && tokens["3"] && tokens["3"]["val"] && tokens["3"]["val"]["val"] && tokens["3"]["val"]["val"]["1"]);
                                            __target_obj__401["externals"]=external_dependencies;
                                            return __target_obj__401;
                                            
                                        }();
                                        await async function(){
                                            let __target_obj__402=(tokens && tokens["3"] && tokens["3"]["val"] && tokens["3"]["val"]["val"] && tokens["3"]["val"]["val"]["1"]);
                                            __target_obj__402["source_name"]=source_name;
                                            return __target_obj__402;
                                            
                                        }()
                                    }
                                } else if (check_true ((((tokens && tokens["3"] && tokens["3"]["val"]) instanceof Array)&& ((tokens && tokens["3"] && tokens["3"]["type"])==="objlit")))) {
                                    {
                                        if (check_true (((global_dependencies && global_dependencies.length)>0))){
                                            {
                                                global_dependencies=await tokenize({
                                                    requires:global_dependencies
                                                },ctx);
                                                ((tokens && tokens["3"] && tokens["3"]["val"])).push((global_dependencies && global_dependencies["val"] && global_dependencies["val"]["0"]))
                                            }
                                        };
                                        if (check_true (((external_dependencies && external_dependencies.length)>0))){
                                            {
                                                external_dependencies=await tokenize({
                                                    requires:external_dependencies
                                                },ctx);
                                                ((tokens && tokens["3"] && tokens["3"]["val"])).push((external_dependencies && external_dependencies["val"] && external_dependencies["val"]["0"]))
                                            }
                                        };
                                        source_meta=await tokenize({
                                            source_name:source_name
                                        },ctx);
                                        ((tokens && tokens["3"] && tokens["3"]["val"])).push((source_meta && source_meta["val"] && source_meta["val"]["0"]))
                                    }
                                }
                            } ()
                        }
                    };
                    if (check_true ((tokens && tokens["3"]))){
                        {
                            metavalue=await (async function(){
                                if (check_true (await is_complex_ques_((tokens && tokens["3"])))){
                                    return await compile_wrapper_fn((tokens && tokens["3"]),ctx)
                                } else {
                                    return await compile((tokens && tokens["3"]),ctx)
                                }
                            })()
                        }
                    };
                    await async function(){
                        if (check_true ((((assignment_value && assignment_value["0"]) instanceof Object)&& (assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])))) {
                            {
                                if (check_true ((assignment_value && assignment_value["0"] && assignment_value["0"]["meta"]))){
                                    {
                                        if (check_true (await not(metavalue))){
                                            {
                                                metavalue=await quote_tree((assignment_value && assignment_value["0"] && assignment_value["0"]["meta"]),ctx)
                                            }
                                        }
                                    }
                                };
                                return await async function(){
                                    let __target_obj__403=(root_ctx && root_ctx["defined_lisp_globals"]);
                                    __target_obj__403[target]=await (async function(){
                                         return await async function(){
                                            if (check_true (((assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])==="Function"))) {
                                                return Function
                                            } else if (check_true (((assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])==="AsyncFunction"))) {
                                                return AsyncFunction
                                            } else if (check_true (((assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])==="Number"))) {
                                                return NumberType
                                            } else if (check_true (((assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])==="expression"))) {
                                                return Expression
                                            } else {
                                                return (assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])
                                            }
                                        } () 
                                    })();
                                    return __target_obj__403;
                                    
                                }()
                            }
                        } else {
                            {
                                if (check_true (((assignment_value instanceof Array)&& ((assignment_value && assignment_value["0"])==="await")))){
                                    {
                                        await async function(){
                                            let __target_obj__404=(root_ctx && root_ctx["defined_lisp_globals"]);
                                            __target_obj__404[target]=AsyncFunction;
                                            return __target_obj__404;
                                            
                                        }();
                                        await set_ambiguous(root_ctx,target)
                                    }
                                } else {
                                    await async function(){
                                        let __target_obj__405=(root_ctx && root_ctx["defined_lisp_globals"]);
                                        __target_obj__405[target]=assignment_value;
                                        return __target_obj__405;
                                        
                                    }()
                                }
                            }
                        }
                    } ();
                    if (check_true (await verbosity(ctx))){
                        {
                            await clog("target: ",await (await Environment.get_global("as_lisp"))(target));
                            await clog("assignment_value: ",await (await Environment.get_global("as_lisp"))(assignment_value))
                        }
                    };
                    acc=await (async function(){
                         return [{
                            ctype:"statement"
                        },await (async function(){
                            if (check_true (((Function===await (async function(){
                                let __targ__406=(root_ctx && root_ctx["defined_lisp_globals"]);
                                if (__targ__406){
                                     return(__targ__406)[target]
                                } 
                            })())|| await in_sync_ques_(ctx)))){
                                return ""
                            } else {
                                return "await"
                            }
                        })()," ","Environment",".","set_global","(","","\"",(tokens && tokens["1"] && tokens["1"]["name"]),"\"",",",assignment_value,await (async function(){
                            if (check_true ((metavalue|| (opts && opts["constant"])))){
                                return ","
                            } else {
                                return ""
                            }
                        })(),await (async function(){
                            if (check_true (metavalue)){
                                return metavalue
                            } else {
                                if (check_true ((opts && opts["constant"]))){
                                    return "null"
                                } else {
                                    return ""
                                }
                            }
                        })(),await (async function(){
                            if (check_true ((opts && opts["constant"]))){
                                return ","
                            } else {
                                return ""
                            }
                        })(),await (async function(){
                            if (check_true ((opts && opts["constant"]))){
                                return "true"
                            } else {
                                return ""
                            }
                        })(),")"] 
                    })();
                    return acc
                }
            };
            is_token_ques_=async function(t) {
                return (((t instanceof Object)&& (t && t["__token__"]))|| ((t instanceof Array)&& ((t && t["0"]) instanceof Object)&& (t && t["0"] && t["0"]["__token__"])))
            };
            compile_quote=async function(lisp_struct,ctx) {
                let acc;
                acc=[];
                ctx=await (async function(){
                     return await new_ctx(ctx) 
                })();
                acc=await compile_quotem(lisp_struct,ctx);
                return acc
            };
            compile_quotel=async function(lisp_struct,ctx) {
                let acc;
                acc=[];
                acc=await JSON.stringify((lisp_struct && lisp_struct["1"]));
                return await (async function(){
                    let __array_op_rval__407=acc;
                     if (__array_op_rval__407 instanceof Function){
                        return await __array_op_rval__407() 
                    } else {
                        return [__array_op_rval__407]
                    }
                })()
            };
            wrap_and_run=async function(js_code,ctx,run_opts) {
                let __assembly__408= async function(){
                    return null
                };
                let result;
                let fst;
                let ctype;
                let comp_meta;
                let needs_braces_ques_;
                let in_quotem;
                let run_log;
                let needs_return_ques_;
                let assembled;
                {
                    let assembly=await __assembly__408();
                    ;
                    result=null;
                    fst=null;
                    ctype=null;
                    comp_meta=null;
                    needs_braces_ques_=false;
                    in_quotem=await get_ctx(ctx,"__IN_QUOTEM__");
                    run_log=await (async function(){
                        if (check_true ((opts && opts["quiet_mode"]))){
                            return log
                        } else {
                            return await defclog({
                                prefix:"wrap_and_run",background:"#703030",color:"white"
                            })
                        }
                    })();
                    needs_return_ques_=await (async function(){
                        ctype=await (async function(){
                            if (check_true (((js_code instanceof Array)&& await first(js_code)&& (await first(js_code) instanceof Object)&& await (async function(){
                                let __targ__409=await first(js_code);
                                if (__targ__409){
                                     return(__targ__409)["ctype"]
                                } 
                            })()))){
                                return await (async function(){
                                    let __targ__410=await first(js_code);
                                    if (__targ__410){
                                         return(__targ__410)["ctype"]
                                    } 
                                })()
                            }
                        })();
                        if (check_true (((typeof ctype==="object")&& await not((ctype instanceof Object))))){
                            fst=""
                        } else {
                            fst=(""+ (ctype|| ""))
                        };
                        if (check_true (fst instanceof Function)){
                            {
                                fst=await sub_type(fst)
                            }
                        };
                        return await async function(){
                            if (check_true (await contains_ques_("block",fst))) {
                                {
                                    if (check_true ((fst==="ifblock"))){
                                        needs_braces_ques_=true
                                    } else {
                                        needs_braces_ques_=false
                                    };
                                    return false
                                }
                            } else if (check_true ((await first(js_code)==="throw"))) {
                                {
                                    needs_braces_ques_=false;
                                    return false
                                }
                            } else {
                                {
                                    needs_braces_ques_=true;
                                    return true
                                }
                            }
                        } ()
                    })();
                    assembled=null;
                    ;
                    assembled=js_code;
                    try {
                        if (check_true ((target_namespace&& ((assembled && assembled["0"]) instanceof Object)&& await not((target_namespace===(Environment && Environment["namespace"])))))){
                            {
                                comp_meta=await first(assembled);
                                await async function(){
                                    comp_meta["namespace"]=target_namespace;
                                    return comp_meta;
                                    
                                }();
                                if (check_true ((await verbosity(ctx)&& (comp_meta && comp_meta["namespace"])))){
                                    {
                                        await run_log("specified namespace: ",(comp_meta && comp_meta["namespace"]))
                                    }
                                };
                                result=await Environment["evaluate_local"].call(Environment,await (async function(){
                                    let __array_op_rval__413=comp_meta;
                                     if (__array_op_rval__413 instanceof Function){
                                        return await __array_op_rval__413(await assemble_output(assembled)) 
                                    } else {
                                        return [__array_op_rval__413,await assemble_output(assembled)]
                                    }
                                })(),ctx,{
                                    compiled_source:true
                                });
                                if (check_true (await verbosity(ctx))){
                                    {
                                        await run_log("<- ",result)
                                    }
                                };
                                return result
                            }
                        } else {
                            {
                                assembled=await assemble_output(assembled);
                                assembled=await add(await (async function(){
                                    if (check_true (needs_braces_ques_)){
                                        return "{"
                                    } else {
                                        return ""
                                    }
                                })(),await (async function(){
                                    if (check_true (needs_return_ques_)){
                                        return " return "
                                    } else {
                                        return ""
                                    }
                                })(),assembled,await (async function(){
                                    if (check_true (needs_braces_ques_)){
                                        return "}"
                                    } else {
                                        return ""
                                    }
                                })());
                                if (check_true (await verbosity(ctx))){
                                    {
                                        await run_log("assembled: ",assembled)
                                    }
                                };
                                try {
                                    assembly=new AsyncFunction("Environment",assembled)
                                } catch (__exception__414) {
                                    if (__exception__414 instanceof Error) {
                                        let e=__exception__414;
                                        {
                                            {
                                                await console.error("compiler: wrap_and_run: caught error on constructing new async_function");
                                                await console.error("compiler: wrap_and_run: ",assembled);
                                                throw e;
                                                
                                            }
                                        }
                                    }
                                };
                                if (check_true ((run_opts && run_opts["bind_mode"]))){
                                    {
                                        assembly=await (await Environment.get_global("bind_function"))(assembly,Environment)
                                    }
                                };
                                result=await (async function(){
                                    let __array_op_rval__415=assembly;
                                     if (__array_op_rval__415 instanceof Function){
                                        return await __array_op_rval__415(Environment) 
                                    } else {
                                        return [__array_op_rval__415,Environment]
                                    }
                                })();
                                if (check_true (await verbosity(ctx))){
                                    {
                                        await run_log("<- ",result)
                                    }
                                };
                                return result
                            }
                        }
                    } catch (__exception__411) {
                        if (__exception__411 instanceof Error) {
                            let e=__exception__411;
                            {
                                {
                                    await console.log("compiler: wrap_and_run: caught error on evaluation: ",(e && e.message));
                                    if (check_true (await (await Environment.get_global("resolve_path"))(["context","scope","*on_compiler_eval_error*"],Environment) instanceof Function)){
                                        result=await (async function(){
                                             return [await (await Environment.get_global("resolve_path"))(["context","scope","*on_compiler_eval_error*"],Environment),e,assembled] 
                                        })()
                                    } else {
                                        throw e;
                                        
                                    };
                                    return result
                                }
                            }
                        }
                    }
                }
            };
            quote_tree=async function(lisp_tree,ctx,_acc) {
                let acc;
                let mode;
                let in_concat;
                let in_lambda_ques_;
                acc=(_acc|| []);
                mode=0;
                in_concat=false;
                in_lambda_ques_=false;
                await async function(){
                    if (check_true ((lisp_tree instanceof Array))) {
                        {
                            (acc).push("[");
                            await map(async function(elem,i,t) {
                                if (check_true ((mode===1))){
                                    {
                                        return mode=0
                                    }
                                } else {
                                    {
                                        await async function(){
                                            if (check_true ((("=:##"===elem)|| ("=:unquotem"===elem)))) {
                                                {
                                                    if (check_true (in_concat)){
                                                        (acc).push(await compile_wrapper_fn(await tokenize(await (async function(){
                                                             return [lisp_tree[await add(i,1)]] 
                                                        })(),ctx),ctx))
                                                    } else {
                                                        (acc).push(await compile_wrapper_fn(await tokenize(lisp_tree[await add(i,1)],ctx),ctx))
                                                    };
                                                    return mode=1
                                                }
                                            } else if (check_true (("=$,@"===elem))) {
                                                {
                                                    if (check_true (await not(in_concat))){
                                                        (acc).push("].concat(")
                                                    };
                                                    (acc).push(await compile_wrapper_fn(await tokenize(lisp_tree[await add(i,1)],ctx),ctx));
                                                    in_concat=true;
                                                    return mode=1
                                                }
                                            } else {
                                                {
                                                    if (check_true (in_concat)){
                                                        return await quote_tree(await (async function(){
                                                            let __array_op_rval__416=elem;
                                                             if (__array_op_rval__416 instanceof Function){
                                                                return await __array_op_rval__416() 
                                                            } else {
                                                                return [__array_op_rval__416]
                                                            }
                                                        })(),ctx,acc)
                                                    } else {
                                                        return await quote_tree(elem,ctx,acc)
                                                    }
                                                }
                                            }
                                        } ();
                                        if (check_true ((i<(t- 1)))){
                                            return (acc).push(",")
                                        }
                                    }
                                }
                            },lisp_tree);
                            if (check_true ((","===await last(acc)))){
                                (acc).pop()
                            };
                            if (check_true (in_concat)){
                                return (acc).push(")")
                            } else {
                                return (acc).push("]")
                            }
                        }
                    } else if (check_true ((lisp_tree instanceof Object))) {
                        {
                            (acc).push("{ ");
                            await map(async function(k,i,t) {
                                (acc).push(await JSON.stringify(k));
                                (acc).push(":");
                                await quote_tree(lisp_tree[k],ctx,acc);
                                if (check_true ((i<(t- 1)))){
                                    return (acc).push(",")
                                }
                            },await (await Environment.get_global("keys"))(lisp_tree));
                            (acc).push("}")
                        }
                    } else if (check_true ((lisp_tree instanceof String || typeof lisp_tree==='string'))) {
                        (acc).push(await JSON.stringify(lisp_tree))
                    } else if (check_true (await (async function(){
                         return await is_nil_ques_(lisp_tree) 
                    })())) {
                        (acc).push(await JSON.stringify(null))
                    } else if (check_true ((undefined===lisp_tree))) {
                        (acc).push(await JSON.stringify(undefined))
                    } else {
                        (acc).push(await JSON.stringify(lisp_tree))
                    }
                } ();
                return acc
            };
            quotem_log=await (async function(){
                if (check_true ((opts && opts["quiet_mode"]))){
                    return log
                } else {
                    return await defclog({
                        prefix:"compile_quotem",background:"#503090",color:"white"
                    })
                }
            })();
            compile_quotem=async function(lisp_struct,ctx) {
                let acc;
                let quoted_js;
                acc=[];
                ctx=await (async function(){
                     return await new_ctx(ctx) 
                })();
                quoted_js=null;
                await set_ctx(ctx,"__IN_QUOTEM__",true);
                if (check_true (await verbosity(ctx))){
                    {
                        await quotem_log("->",await (async function(){
                            if (check_true (await get_ctx(ctx,"__IN_LAMBDA__"))){
                                return "[IN LAMBDA]"
                            } else {
                                return ""
                            }
                        })(),await JSON.stringify((lisp_struct && lisp_struct["1"])))
                    }
                };
                if (check_true (await get_ctx(ctx,"__IN_LAMBDA__"))){
                    {
                        quoted_js=await quote_tree((lisp_struct && lisp_struct["1"]),ctx)
                    }
                } else {
                    quoted_js=await quote_tree((lisp_struct && lisp_struct["1"]),ctx)
                };
                if (check_true (await verbosity(ctx))){
                    {
                        await quotem_log("<-",await (await Environment.get_global("as_lisp"))(quoted_js))
                    }
                };
                return quoted_js
            };
            compile_unquotem=async function(lisp_struct,ctx) {
                let acc;
                acc=[];
                (acc).push(await (async function(){
                     return await compile((lisp_struct && lisp_struct["1"]),ctx) 
                })());
                return acc
            };
            eval_log=await (async function(){
                if (check_true ((opts && opts["quiet_mode"]))){
                    return log
                } else {
                    return await defclog({
                        prefix:"compile_eval",background:"#705030",color:"white"
                    })
                }
            })();
            compile_eval=async function(tokens,ctx) {
                let __assembly__417= async function(){
                    return null
                };
                let type_mark;
                let acc;
                let preamble;
                let result;
                let eval_opts;
                {
                    let assembly=await __assembly__417();
                    ;
                    type_mark=null;
                    acc=[];
                    preamble=await calling_preamble(ctx);
                    result=null;
                    eval_opts=null;
                    ctx=await (async function(){
                         return await new_ctx(ctx) 
                    })();
                    await set_new_completion_scope(ctx);
                    if (check_true ((tokens && tokens["2"]))){
                        {
                            eval_opts=await (async function(){
                                 return await compile((tokens && tokens["2"]),ctx) 
                            })()
                        }
                    };
                    assembly=await (async function(){
                         return await compile((tokens && tokens["1"]),ctx) 
                    })();
                    if (check_true (await verbosity(ctx))){
                        {
                            await eval_log("assembly:",await (async function(){
                                 return await (async function(){
                                    let __array_op_rval__418=clone;
                                     if (__array_op_rval__418 instanceof Function){
                                        return await __array_op_rval__418(assembly) 
                                    } else {
                                        return [__array_op_rval__418,assembly]
                                    }
                                })() 
                            })())
                        }
                    };
                    has_lisp_globals=true;
                    result=["(","await"," ","Environment",".","eval","(",(preamble && preamble["0"])," ",(preamble && preamble["1"])," ","function","()",["{","return"," ",assembly,"}","()",",null",await (async function(){
                        if (check_true (eval_opts)){
                            return [", ",eval_opts]
                        } else {
                            return ""
                        }
                    })(),")",")"]];
                    return result
                }
            };
            compile_debug=async function(tokens,ctx) {
                return [{
                    ctype:"statement"
                },"debugger",";"]
            };
            compile_for_each=async function(tokens,ctx) {
                let preamble;
                preamble=await calling_preamble(ctx);
                ctx=await (async function(){
                     return await new_ctx(ctx) 
                })();
                ;
                await set_new_completion_scope(ctx);
                return await (async function(){
                    let __array_op_rval__419=(preamble && preamble["2"]);
                     if (__array_op_rval__419 instanceof Function){
                        return await __array_op_rval__419((preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ","{",await compile_for_each_inner(tokens,ctx,preamble)," ","}",")","()") 
                    } else {
                        return [__array_op_rval__419,(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ","{",await compile_for_each_inner(tokens,ctx,preamble)," ","}",")","()"]
                    }
                })()
            };
            compile_for_each_inner=async function(tokens,ctx,preamble) {
                let acc;
                let idx;
                let stmts;
                let idx_iter;
                let idx_iters;
                let element_list;
                let body_function_ref;
                let collector_ref;
                let prebuild;
                let for_args;
                let iterator_ref;
                let elements;
                let iter_count;
                let for_body;
                let body_is_block_ques_;
                acc=[];
                idx=0;
                stmts=[];
                idx_iter=await gen_temp_name("iter");
                idx_iters=[];
                element_list=await gen_temp_name("elements");
                body_function_ref=await gen_temp_name("for_body");
                collector_ref=await gen_temp_name("array");
                prebuild=[];
                for_args=(tokens && tokens["1"] && tokens["1"]["val"]);
                iterator_ref=(for_args && for_args["0"]);
                elements=await last(for_args);
                iter_count=await (async function(){
                    if (check_true (for_args)){
                        return ((for_args && for_args.length)- 1)
                    } else {
                        return 0
                    }
                })();
                for_body=(tokens && tokens["2"]);
                body_is_block_ques_=await is_block_ques_((for_body && for_body["val"]));
                if (check_true ((iter_count<1))){
                    {
                        throw new SyntaxError("Invalid for_each arguments");
                        
                    }
                };
                await (async function() {
                    let __for_body__422=async function(iter_idx) {
                        (idx_iters).push(for_args[iter_idx]);
                        return await set_ctx(ctx,await clean_quoted_reference(await (async function(){
                            let __targ__424=await last(idx_iters);
                            if (__targ__424){
                                 return(__targ__424)["name"]
                            } 
                        })()),ArgumentType)
                    };
                    let __array__423=[],__elements__421=await (await Environment.get_global("range"))(iter_count);
                    let __BREAK__FLAG__=false;
                    for(let __iter__420 in __elements__421) {
                        __array__423.push(await __for_body__422(__elements__421[__iter__420]));
                        if(__BREAK__FLAG__) {
                             __array__423.pop();
                            break;
                            
                        }
                    }return __array__423;
                     
                })();
                await set_ctx(ctx,collector_ref,ArgumentType);
                await set_ctx(ctx,"__LAMBDA_STEP__",-1);
                await set_ctx(ctx,element_list,"arg");
                if (check_true (await not(body_is_block_ques_))){
                    {
                        for_body=await make_do_block(for_body)
                    }
                };
                prebuild=await build_fn_with_assignment(body_function_ref,(for_body && for_body["val"]),idx_iters,ctx);
                await async function(){
                    ctx["return_last_value"]=true;
                    return ctx;
                    
                }();
                (acc).push(await (async function(){
                     return await compile(prebuild,ctx) 
                })());
                await (async function() {
                    let __for_body__428=async function(t) {
                        return (acc).push(t)
                    };
                    let __array__429=[],__elements__427=["let"," ",collector_ref,"=","[]",",",element_list,"=",await compile_wrapper_fn(elements,ctx),";"];
                    let __BREAK__FLAG__=false;
                    for(let __iter__426 in __elements__427) {
                        __array__429.push(await __for_body__428(__elements__427[__iter__426]));
                        if(__BREAK__FLAG__) {
                             __array__429.pop();
                            break;
                            
                        }
                    }return __array__429;
                     
                })();
                await (async function() {
                    let __for_body__432=async function(t) {
                        return (acc).push(t)
                    };
                    let __array__433=[],__elements__431=["let"," ",break_out,"=","false",";"];
                    let __BREAK__FLAG__=false;
                    for(let __iter__430 in __elements__431) {
                        __array__433.push(await __for_body__432(__elements__431[__iter__430]));
                        if(__BREAK__FLAG__) {
                             __array__433.pop();
                            break;
                            
                        }
                    }return __array__433;
                     
                })();
                if (check_true (await (await Environment.get_global("blank?"))((preamble && preamble["0"])))){
                    await set_ctx(ctx,body_function_ref,Function)
                } else {
                    await set_ctx(ctx,body_function_ref,AsyncFunction)
                };
                await async function(){
                    if (check_true ((((for_args && for_args.length)===2)&& await not(((for_args && for_args["1"]) instanceof Array))))) {
                        {
                            await set_ctx(ctx,idx_iter,NumberType);
                            await (async function() {
                                let __for_body__436=async function(t) {
                                    return (acc).push(t)
                                };
                                let __array__437=[],__elements__435=["for","(","let"," ",idx_iter," ","in"," ",element_list,")"," ","{"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__434 in __elements__435) {
                                    __array__437.push(await __for_body__436(__elements__435[__iter__434]));
                                    if(__BREAK__FLAG__) {
                                         __array__437.pop();
                                        break;
                                        
                                    }
                                }return __array__437;
                                 
                            })();
                            await (async function() {
                                let __for_body__440=async function(t) {
                                    return (acc).push(t)
                                };
                                let __array__441=[],__elements__439=await (async function(){
                                    let __array_op_rval__442=collector_ref;
                                     if (__array_op_rval__442 instanceof Function){
                                        return await __array_op_rval__442(".","push","(",(preamble && preamble["0"])," ",body_function_ref,"(",element_list,"[",idx_iter,"]",")",")",";") 
                                    } else {
                                        return [__array_op_rval__442,".","push","(",(preamble && preamble["0"])," ",body_function_ref,"(",element_list,"[",idx_iter,"]",")",")",";"]
                                    }
                                })();
                                let __BREAK__FLAG__=false;
                                for(let __iter__438 in __elements__439) {
                                    __array__441.push(await __for_body__440(__elements__439[__iter__438]));
                                    if(__BREAK__FLAG__) {
                                         __array__441.pop();
                                        break;
                                        
                                    }
                                }return __array__441;
                                 
                            })();
                            await (async function() {
                                let __for_body__445=async function(t) {
                                    return (acc).push(t)
                                };
                                let __array__446=[],__elements__444=["if","(",break_out,")"," ","{"," ",collector_ref,".","pop","()",";","break",";","}"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__443 in __elements__444) {
                                    __array__446.push(await __for_body__445(__elements__444[__iter__443]));
                                    if(__BREAK__FLAG__) {
                                         __array__446.pop();
                                        break;
                                        
                                    }
                                }return __array__446;
                                 
                            })();
                            return (acc).push("}")
                        }
                    }
                } ();
                (acc).push("return");
                (acc).push(" ");
                (acc).push(collector_ref);
                (acc).push(";");
                return acc
            };
            compile_while=async function(tokens,ctx) {
                let acc;
                let idx;
                let preamble;
                let test_condition;
                let complex_test_ques_;
                let test_condition_ref;
                let body;
                let body_ref;
                let prebuild;
                acc=[];
                idx=0;
                ctx=await (async function(){
                     return await new_ctx(ctx) 
                })();
                preamble=await calling_preamble(ctx);
                test_condition=(tokens && tokens["1"]);
                complex_test_ques_=await not((test_condition && test_condition["ref"]));
                test_condition_ref=await gen_temp_name("test_condition");
                body=(tokens && tokens["2"]);
                body_ref=await gen_temp_name("body_ref");
                prebuild=[];
                ;
                if (check_true (await verbosity(ctx))){
                    {
                        await console.log("compile_while: ",await source_from_tokens(tokens,expanded_tree))
                    }
                };
                await set_new_completion_scope(ctx);
                await set_ctx(ctx,break_out,true);
                if (check_true (complex_test_ques_)){
                    {
                        (prebuild).push(await (async function(){
                             return await compile(await build_fn_with_assignment(test_condition_ref,(test_condition && test_condition["val"]),null,ctx),ctx) 
                        })())
                    }
                };
                (prebuild).push(await (async function(){
                     return await compile(await build_fn_with_assignment(body_ref,(body && body["val"]),null,ctx),ctx) 
                })());
                await (async function() {
                    let __for_body__449=async function(t) {
                        return (prebuild).push(t)
                    };
                    let __array__450=[],__elements__448=["let"," ",break_out,"=","false",";"];
                    let __BREAK__FLAG__=false;
                    for(let __iter__447 in __elements__448) {
                        __array__450.push(await __for_body__449(__elements__448[__iter__447]));
                        if(__BREAK__FLAG__) {
                             __array__450.pop();
                            break;
                            
                        }
                    }return __array__450;
                     
                })();
                if (check_true (complex_test_ques_)){
                    await (async function() {
                        let __for_body__453=async function(t) {
                            return (prebuild).push(t)
                        };
                        let __array__454=[],__elements__452=["while","(",(preamble && preamble["0"])," ",test_condition_ref,"()",")"," ","{"," ",(preamble && preamble["0"])," ",body_ref,"()",";"," ","if","(",break_out,")"," ","{"," ","break",";","}","}"," ","",";"];
                        let __BREAK__FLAG__=false;
                        for(let __iter__451 in __elements__452) {
                            __array__454.push(await __for_body__453(__elements__452[__iter__451]));
                            if(__BREAK__FLAG__) {
                                 __array__454.pop();
                                break;
                                
                            }
                        }return __array__454;
                         
                    })()
                } else {
                    await (async function() {
                        let __for_body__457=async function(t) {
                            return (prebuild).push(t)
                        };
                        let __array__458=[],__elements__456=["while","(",await (async function(){
                             return await compile(test_condition,ctx) 
                        })(),")"," {"," ",(preamble && preamble["0"])," ",body_ref,"()",";"," ","if","(",break_out,")"," ","{"," ","break",";","}","}"," ","",";"];
                        let __BREAK__FLAG__=false;
                        for(let __iter__455 in __elements__456) {
                            __array__458.push(await __for_body__457(__elements__456[__iter__455]));
                            if(__BREAK__FLAG__) {
                                 __array__458.pop();
                                break;
                                
                            }
                        }return __array__458;
                         
                    })()
                };
                await (async function() {
                    let __for_body__461=async function(t) {
                        return (acc).push(t)
                    };
                    let __array__462=[],__elements__460=[(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()","{"," ",prebuild,"}",")","()"];
                    let __BREAK__FLAG__=false;
                    for(let __iter__459 in __elements__460) {
                        __array__462.push(await __for_body__461(__elements__460[__iter__459]));
                        if(__BREAK__FLAG__) {
                             __array__462.pop();
                            break;
                            
                        }
                    }return __array__462;
                     
                })();
                return acc
            };
            compile_for_with=async function(tokens,ctx,preamble) {
                preamble=await calling_preamble(ctx);
                ctx=await (async function(){
                     return await new_ctx(ctx) 
                })();
                ;
                await set_new_completion_scope(ctx);
                return [(preamble && preamble["2"]),(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ","{",await compile_for_with_inner(tokens,ctx,preamble)," ","}",")","()"]
            };
            compile_for_with_inner=async function(tokens,ctx,preamble) {
                let acc;
                let idx;
                let stmts;
                let iter_ref;
                let idx_iters;
                let generator_expression;
                let body_function_ref;
                let prebuild;
                let for_args;
                let iterator_ref;
                let elements;
                let iter_count;
                let for_body;
                let body_is_block_ques_;
                acc=[];
                idx=0;
                stmts=[];
                iter_ref=await gen_temp_name("iter");
                idx_iters=[];
                generator_expression=await gen_temp_name("elements");
                body_function_ref=await gen_temp_name("for_body");
                prebuild=[];
                for_args=(tokens && tokens["1"] && tokens["1"]["val"]);
                iterator_ref=(for_args && for_args["0"]);
                elements=await last(for_args);
                iter_count=await (async function(){
                    if (check_true (for_args)){
                        return ((for_args && for_args.length)- 1)
                    } else {
                        return 0
                    }
                })();
                for_body=(tokens && tokens["2"]);
                body_is_block_ques_=await is_block_ques_((for_body && for_body["val"]));
                if (check_true ((iter_count<1))){
                    {
                        throw new SyntaxError("Invalid for_each arguments");
                        
                    }
                };
                await (async function() {
                    let __for_body__465=async function(iter_ref) {
                        (idx_iters).push(for_args[iter_ref]);
                        return await set_ctx(ctx,await clean_quoted_reference(await (async function(){
                            let __targ__467=await last(idx_iters);
                            if (__targ__467){
                                 return(__targ__467)["name"]
                            } 
                        })()),ArgumentType)
                    };
                    let __array__466=[],__elements__464=await (await Environment.get_global("range"))(iter_count);
                    let __BREAK__FLAG__=false;
                    for(let __iter__463 in __elements__464) {
                        __array__466.push(await __for_body__465(__elements__464[__iter__463]));
                        if(__BREAK__FLAG__) {
                             __array__466.pop();
                            break;
                            
                        }
                    }return __array__466;
                     
                })();
                await set_ctx(ctx,generator_expression,"arg");
                if (check_true (await not(body_is_block_ques_))){
                    {
                        for_body=await make_do_block(for_body)
                    }
                };
                prebuild=await build_fn_with_assignment(body_function_ref,(for_body && for_body["val"]),idx_iters,ctx);
                await async function(){
                    ctx["block_step"]=0;
                    return ctx;
                    
                }();
                await async function(){
                    ctx["return_last_value"]=true;
                    return ctx;
                    
                }();
                (acc).push(await (async function(){
                     return await compile(prebuild,ctx) 
                })());
                await (async function() {
                    let __for_body__472=async function(t) {
                        return (acc).push(t)
                    };
                    let __array__473=[],__elements__471=["let"," ",break_out,"=","false",";"];
                    let __BREAK__FLAG__=false;
                    for(let __iter__470 in __elements__471) {
                        __array__473.push(await __for_body__472(__elements__471[__iter__470]));
                        if(__BREAK__FLAG__) {
                             __array__473.pop();
                            break;
                            
                        }
                    }return __array__473;
                     
                })();
                await set_ctx(ctx,body_function_ref,AsyncFunction);
                await async function(){
                    if (check_true ((((for_args && for_args.length)===2)&& await not(((for_args && for_args["1"]) instanceof Array))))) {
                        {
                            await (async function() {
                                let __for_body__476=async function(t) {
                                    return (acc).push(t)
                                };
                                let __array__477=[],__elements__475=["for"," ",(preamble && preamble["0"])," ","(","const"," ",iter_ref," ","of"," ",await compile_wrapper_fn(elements,ctx),")"," ","{"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__474 in __elements__475) {
                                    __array__477.push(await __for_body__476(__elements__475[__iter__474]));
                                    if(__BREAK__FLAG__) {
                                         __array__477.pop();
                                        break;
                                        
                                    }
                                }return __array__477;
                                 
                            })();
                            await (async function() {
                                let __for_body__480=async function(t) {
                                    return (acc).push(t)
                                };
                                let __array__481=[],__elements__479=await (async function(){
                                    let __array_op_rval__482=(preamble && preamble["0"]);
                                     if (__array_op_rval__482 instanceof Function){
                                        return await __array_op_rval__482(" ",body_function_ref,"(",iter_ref,")",";") 
                                    } else {
                                        return [__array_op_rval__482," ",body_function_ref,"(",iter_ref,")",";"]
                                    }
                                })();
                                let __BREAK__FLAG__=false;
                                for(let __iter__478 in __elements__479) {
                                    __array__481.push(await __for_body__480(__elements__479[__iter__478]));
                                    if(__BREAK__FLAG__) {
                                         __array__481.pop();
                                        break;
                                        
                                    }
                                }return __array__481;
                                 
                            })();
                            await (async function() {
                                let __for_body__485=async function(t) {
                                    return (acc).push(t)
                                };
                                let __array__486=[],__elements__484=["if","(",break_out,")"," ","break",";"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__483 in __elements__484) {
                                    __array__486.push(await __for_body__485(__elements__484[__iter__483]));
                                    if(__BREAK__FLAG__) {
                                         __array__486.pop();
                                        break;
                                        
                                    }
                                }return __array__486;
                                 
                            })();
                            return (acc).push("}")
                        }
                    }
                } ();
                return acc
            };
            silence=async function() {
                return false
            };
            verbosity=silence;
            check_verbosity=async function(ctx) {
                return await Environment["get_global"].call(Environment,"__VERBOSITY__")
            };
            declare_log=await (async function(){
                if (check_true ((opts && opts["quiet_mode"]))){
                    return log
                } else {
                    return await defclog({
                        prefix:"DECLARE",color:"white",background:"black"
                    })
                }
            })();
            compile_declare=async function(tokens,ctx) {
                let expressions;
                let targeted;
                let acc;
                let source;
                let details;
                let sanitized_name;
                let declaration;
                let dec_struct;
                expressions=await (await Environment.get_global("rest"))(tokens);
                targeted=null;
                acc=[];
                source=null;
                details=null;
                sanitized_name=null;
                declaration=null;
                dec_struct=null;
                await (async function() {
                    let __for_body__489=async function(exp) {
                        declaration=(exp && exp["val"] && exp["val"]["0"] && exp["val"]["0"]["name"]);
                        targeted=await (await Environment.get_global("rest"))((exp && exp["val"]));
                        if (check_true (await (async function(){
                            let __array_op_rval__491=verbosity;
                             if (__array_op_rval__491 instanceof Function){
                                return await __array_op_rval__491(ctx) 
                            } else {
                                return [__array_op_rval__491,ctx]
                            }
                        })())){
                            {
                                await declare_log("declaration: ",declaration,"targeted: ",await (async function(){
                                     return await (await Environment.get_global("each"))(targeted,"name") 
                                })(),targeted)
                            }
                        };
                        return await async function(){
                            if (check_true ((declaration==="toplevel"))) {
                                {
                                    await async function(){
                                        opts["root_environment"]=(targeted && targeted["0"]);
                                        return opts;
                                        
                                    }();
                                    if (check_true ((opts && opts["root_environment"]))){
                                        return env_ref=""
                                    } else {
                                        return env_ref="Environment."
                                    }
                                }
                            } else if (check_true ((declaration==="include"))) {
                                {
                                    return await (async function() {
                                        let __for_body__495=async function(name) {
                                            sanitized_name=await sanitize_js_ref_name(name);
                                            dec_struct=await get_declaration_details(ctx,name);
                                            if (check_true (dec_struct)){
                                                {
                                                    await (async function() {
                                                        let __for_body__499=async function(t) {
                                                            return (acc).push(t)
                                                        };
                                                        let __array__500=[],__elements__498=["let"," ",sanitized_name,"="];
                                                        let __BREAK__FLAG__=false;
                                                        for(let __iter__497 in __elements__498) {
                                                            __array__500.push(await __for_body__499(__elements__498[__iter__497]));
                                                            if(__BREAK__FLAG__) {
                                                                 __array__500.pop();
                                                                break;
                                                                
                                                            }
                                                        }return __array__500;
                                                         
                                                    })();
                                                    await async function(){
                                                        if (check_true (((dec_struct && dec_struct["value"]) instanceof Function&& await (async function(){
                                                            let __targ__502=await (async function(){
                                                                let __targ__501=(Environment && Environment["definitions"]);
                                                                if (__targ__501){
                                                                     return(__targ__501)[name]
                                                                } 
                                                            })();
                                                            if (__targ__502){
                                                                 return(__targ__502)["fn_body"]
                                                            } 
                                                        })()))) {
                                                            {
                                                                details=await (async function(){
                                                                    let __targ__503=(Environment && Environment["definitions"]);
                                                                    if (__targ__503){
                                                                         return(__targ__503)[name]
                                                                    } 
                                                                })();
                                                                source=("(fn "+ (details && details["fn_args"])+ " "+ (details && details["fn_body"])+ ")");
                                                                source=await (async function(){
                                                                     return await compile(await tokenize(await (async function(){
                                                                         return await (await Environment.get_global("read_lisp"))(source) 
                                                                    })(),ctx),ctx,1000) 
                                                                })();
                                                                (acc).push(source);
                                                                return await set_ctx(ctx,name,AsyncFunction)
                                                            }
                                                        } else if (check_true ((dec_struct && dec_struct["value"]) instanceof Function)) {
                                                            {
                                                                (acc).push(await (async function() {
                                                                    {
                                                                         let __call_target__=await (dec_struct && dec_struct["value"])["toString"](), __call_method__="replace";
                                                                        return await __call_target__[__call_method__].call(__call_target__,"\n","")
                                                                    } 
                                                                })());
                                                                await set_ctx(ctx,name,AsyncFunction)
                                                            }
                                                        } else {
                                                            {
                                                                (acc).push(await (dec_struct && dec_struct["value"])["toString"]());
                                                                await set_ctx(ctx,name,ArgumentType)
                                                            }
                                                        }
                                                    } ();
                                                    (acc).push(";")
                                                }
                                            };
                                            await set_declaration(ctx,name,"inlined",true);
                                            if (check_true ((("undefined"===await (async function(){
                                                let __targ__504=await get_declarations(ctx,name);
                                                if (__targ__504){
                                                     return(__targ__504)["type"]
                                                } 
                                            })())&& (dec_struct && dec_struct["value"]) instanceof Function))){
                                                return await set_declaration(ctx,name,"type",Function)
                                            }
                                        };
                                        let __array__496=[],__elements__494=await (async function(){
                                             return await (await Environment.get_global("each"))(targeted,"name") 
                                        })();
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__493 in __elements__494) {
                                            __array__496.push(await __for_body__495(__elements__494[__iter__493]));
                                            if(__BREAK__FLAG__) {
                                                 __array__496.pop();
                                                break;
                                                
                                            }
                                        }return __array__496;
                                         
                                    })()
                                }
                            } else if (check_true ((declaration==="verbose"))) {
                                {
                                    let verbosity_level=await parseInt(await first(await (async function(){
                                         return await (await Environment.get_global("each"))(targeted,"name") 
                                    })()));
                                    ;
                                    if (check_true (await not(await isNaN(verbosity_level)))){
                                        {
                                            if (check_true ((verbosity_level>0))){
                                                {
                                                    await set_ctx(ctx,"__VERBOSITY__",verbosity_level);
                                                    await declare_log("compiler: verbosity set: ",await get_ctx(ctx,"__VERBOSITY__"))
                                                }
                                            } else {
                                                {
                                                    await declare_log("verbosity: turned off");
                                                    verbosity=silence;
                                                    await set_ctx(ctx,"__VERBOSITY__",null)
                                                }
                                            };
                                            verbosity=check_verbosity;
                                            return await declare_log("compiler: verbosity set: ",await (async function(){
                                                let __array_op_rval__505=verbosity;
                                                 if (__array_op_rval__505 instanceof Function){
                                                    return await __array_op_rval__505(ctx) 
                                                } else {
                                                    return [__array_op_rval__505,ctx]
                                                }
                                            })())
                                        }
                                    } else {
                                        return (warnings).push("invalid verbosity declaration, expected number, received ")
                                    }
                                }
                            } else if (check_true ((declaration==="local"))) {
                                return await (async function() {
                                    let __for_body__508=async function(name) {
                                        dec_struct=await get_declaration_details(ctx,name);
                                        return await set_ctx(ctx,name,(dec_struct && dec_struct["value"]))
                                    };
                                    let __array__509=[],__elements__507=await (async function(){
                                         return await (await Environment.get_global("each"))(targeted,"name") 
                                    })();
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__506 in __elements__507) {
                                        __array__509.push(await __for_body__508(__elements__507[__iter__506]));
                                        if(__BREAK__FLAG__) {
                                             __array__509.pop();
                                            break;
                                            
                                        }
                                    }return __array__509;
                                     
                                })()
                            } else if (check_true ((declaration==="function"))) {
                                {
                                    return await (async function() {
                                        let __for_body__512=async function(name) {
                                            return await set_declaration(ctx,name,"type",Function)
                                        };
                                        let __array__513=[],__elements__511=await (async function(){
                                             return await (await Environment.get_global("each"))(targeted,"name") 
                                        })();
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__510 in __elements__511) {
                                            __array__513.push(await __for_body__512(__elements__511[__iter__510]));
                                            if(__BREAK__FLAG__) {
                                                 __array__513.pop();
                                                break;
                                                
                                            }
                                        }return __array__513;
                                         
                                    })()
                                }
                            } else if (check_true ((declaration==="fn"))) {
                                {
                                    return await (async function() {
                                        let __for_body__516=async function(name) {
                                            return await set_declaration(ctx,name,"type",AsyncFunction)
                                        };
                                        let __array__517=[],__elements__515=await (async function(){
                                             return await (await Environment.get_global("each"))(targeted,"name") 
                                        })();
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__514 in __elements__515) {
                                            __array__517.push(await __for_body__516(__elements__515[__iter__514]));
                                            if(__BREAK__FLAG__) {
                                                 __array__517.pop();
                                                break;
                                                
                                            }
                                        }return __array__517;
                                         
                                    })()
                                }
                            } else if (check_true ((declaration==="array"))) {
                                {
                                    return await (async function() {
                                        let __for_body__520=async function(name) {
                                            return await set_declaration(ctx,name,"type",Array)
                                        };
                                        let __array__521=[],__elements__519=await (async function(){
                                             return await (await Environment.get_global("each"))(targeted,"name") 
                                        })();
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__518 in __elements__519) {
                                            __array__521.push(await __for_body__520(__elements__519[__iter__518]));
                                            if(__BREAK__FLAG__) {
                                                 __array__521.pop();
                                                break;
                                                
                                            }
                                        }return __array__521;
                                         
                                    })()
                                }
                            } else if (check_true ((declaration==="number"))) {
                                {
                                    return await (async function() {
                                        let __for_body__524=async function(name) {
                                            return await set_declaration(ctx,name,"type",NumberType)
                                        };
                                        let __array__525=[],__elements__523=await (async function(){
                                             return await (await Environment.get_global("each"))(targeted,"name") 
                                        })();
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__522 in __elements__523) {
                                            __array__525.push(await __for_body__524(__elements__523[__iter__522]));
                                            if(__BREAK__FLAG__) {
                                                 __array__525.pop();
                                                break;
                                                
                                            }
                                        }return __array__525;
                                         
                                    })()
                                }
                            } else if (check_true ((declaration==="string"))) {
                                {
                                    return await (async function() {
                                        let __for_body__528=async function(name) {
                                            return await set_declaration(ctx,name,"type",StringType)
                                        };
                                        let __array__529=[],__elements__527=await (async function(){
                                             return await (await Environment.get_global("each"))(targeted,"name") 
                                        })();
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__526 in __elements__527) {
                                            __array__529.push(await __for_body__528(__elements__527[__iter__526]));
                                            if(__BREAK__FLAG__) {
                                                 __array__529.pop();
                                                break;
                                                
                                            }
                                        }return __array__529;
                                         
                                    })()
                                }
                            } else if (check_true ((declaration==="boolean"))) {
                                {
                                    return await (async function() {
                                        let __for_body__532=async function(name) {
                                            return await set_declaration(ctx,name,"type",Boolean)
                                        };
                                        let __array__533=[],__elements__531=await (async function(){
                                             return await (await Environment.get_global("each"))(targeted,"name") 
                                        })();
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__530 in __elements__531) {
                                            __array__533.push(await __for_body__532(__elements__531[__iter__530]));
                                            if(__BREAK__FLAG__) {
                                                 __array__533.pop();
                                                break;
                                                
                                            }
                                        }return __array__533;
                                         
                                    })()
                                }
                            } else if (check_true ((declaration==="regexp"))) {
                                {
                                    return await (async function() {
                                        let __for_body__536=async function(name) {
                                            return await set_declaration(ctx,name,"type",RegExp)
                                        };
                                        let __array__537=[],__elements__535=await (async function(){
                                             return await (await Environment.get_global("each"))(targeted,"name") 
                                        })();
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__534 in __elements__535) {
                                            __array__537.push(await __for_body__536(__elements__535[__iter__534]));
                                            if(__BREAK__FLAG__) {
                                                 __array__537.pop();
                                                break;
                                                
                                            }
                                        }return __array__537;
                                         
                                    })()
                                }
                            } else if (check_true ((declaration==="object"))) {
                                {
                                    return await (async function() {
                                        let __for_body__540=async function(name) {
                                            return await set_declaration(ctx,name,"type",Object)
                                        };
                                        let __array__541=[],__elements__539=await (async function(){
                                             return await (await Environment.get_global("each"))(targeted,"name") 
                                        })();
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__538 in __elements__539) {
                                            __array__541.push(await __for_body__540(__elements__539[__iter__538]));
                                            if(__BREAK__FLAG__) {
                                                 __array__541.pop();
                                                break;
                                                
                                            }
                                        }return __array__541;
                                         
                                    })()
                                }
                            } else if (check_true ((declaration==="global"))) {
                                {
                                    return await (async function() {
                                        let __for_body__544=async function(name) {
                                            return await set_declaration(ctx,name,"location","global")
                                        };
                                        let __array__545=[],__elements__543=await (async function(){
                                             return await (await Environment.get_global("each"))(targeted,"name") 
                                        })();
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__542 in __elements__543) {
                                            __array__545.push(await __for_body__544(__elements__543[__iter__542]));
                                            if(__BREAK__FLAG__) {
                                                 __array__545.pop();
                                                break;
                                                
                                            }
                                        }return __array__545;
                                         
                                    })()
                                }
                            } else if (check_true ((declaration==="optimize"))) {
                                {
                                    return await (async function() {
                                        let __for_body__548=async function(factor) {
                                            factor=await (async function(){
                                                 return await (await Environment.get_global("each"))(factor,"name") 
                                            })();
                                            return await async function(){
                                                if (check_true (((factor && factor["0"])==="safety"))) {
                                                    return await set_declaration(ctx,"__SAFETY__","level",(factor && factor["1"]))
                                                } else if (check_true (((factor && factor["0"])==="debug"))) {
                                                    {
                                                        return await set_declaration(ctx,"__DEBUG__","level",await parseInt((factor && factor["1"])))
                                                    }
                                                }
                                            } ()
                                        };
                                        let __array__549=[],__elements__547=await (async function(){
                                             return await (await Environment.get_global("each"))(targeted,"val") 
                                        })();
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__546 in __elements__547) {
                                            __array__549.push(await __for_body__548(__elements__547[__iter__546]));
                                            if(__BREAK__FLAG__) {
                                                 __array__549.pop();
                                                break;
                                                
                                            }
                                        }return __array__549;
                                         
                                    })()
                                }
                            } else if (check_true ((declaration==="namespace"))) {
                                {
                                    if (check_true (await not(((targeted && targeted.length)===1)))){
                                        {
                                            throw new SyntaxError("namespace declaration requires exactly 1 value");
                                            
                                        }
                                    };
                                    if (check_true (await get_ctx(ctx,"__IN_LAMBDA__"))){
                                        {
                                            throw new SyntaxError("namespace compiler declaration must be toplevel");
                                            
                                        }
                                    };
                                    target_namespace=(targeted && targeted["0"] && targeted["0"]["name"]);
                                    return Environment=await Environment["get_namespace_handle"].call(Environment,(targeted && targeted["0"] && targeted["0"]["name"]))
                                }
                            } else {
                                {
                                    (warnings).push(("unknown declaration directive: "+ declaration));
                                    return await (await Environment.get_global("warn"))(("compiler: unknown declaration directive: "+ declaration))
                                }
                            }
                        } ()
                    };
                    let __array__490=[],__elements__488=expressions;
                    let __BREAK__FLAG__=false;
                    for(let __iter__487 in __elements__488) {
                        __array__490.push(await __for_body__489(__elements__488[__iter__487]));
                        if(__BREAK__FLAG__) {
                             __array__490.pop();
                            break;
                            
                        }
                    }return __array__490;
                     
                })();
                return acc
            };
            safety_level=async function(ctx) {
                if (check_true (ctx)){
                    {
                        let safety=await get_declarations(ctx,"__SAFETY__");
                        ;
                        if (check_true (safety)){
                            return (safety && safety["level"])
                        } else {
                            return default_safety_level
                        }
                    }
                }
            };
            debug_level=async function(ctx) {
                if (check_true (ctx)){
                    {
                        let it;
                        it=await get_declarations(ctx,"__DEBUG__");
                        if (check_true (it)){
                            return (it && it["level"])
                        } else {
                            return 0
                        }
                    }
                } else {
                    return 0
                }
            };
            get_scoped_type=async function(name) {
                let rtype;
                rtype=await get_ctx(ctx,name);
                if (check_true ((undefined===rtype))){
                    return await sub_type(await get_lisp_ctx(ctx,name))
                } else {
                    return await sub_type(rtype)
                }
            };
            compile_scoped_reference=async function(tokens,ctx) {
                let acc;
                let idx;
                let ref_type;
                let rval;
                let stmt;
                let preamble;
                let sr_log;
                let val;
                let call_type;
                let token;
                acc=[];
                idx=0;
                ref_type=null;
                rval=null;
                stmt=null;
                preamble=await calling_preamble(ctx);
                sr_log=await (async function(){
                     return await defclog({
                        prefix:("compile_scoped_reference ("+ ((ctx && ctx["block_id"])|| "-")+ "):"),background:"steelblue",color:"white"
                    }) 
                })();
                val=null;
                call_type=await (async function(){
                     return await async function(){
                        if (check_true (await not((tokens && tokens["0"] && tokens["0"]["ref"])))) {
                            return "literal"
                        } else if (check_true (await get_ctx_val(ctx,(tokens && tokens["0"] && tokens["0"]["name"])))) {
                            return "local"
                        } else if (check_true (await get_lisp_ctx(ctx,(tokens && tokens["0"] && tokens["0"]["name"])))) {
                            return "lisp"
                        }
                    } () 
                })();
                token=null;
                ;
                await async function(){
                    if (check_true ((call_type==="lisp"))) {
                        return ref_type=await get_lisp_ctx(ctx,(tokens && tokens["0"] && tokens["0"]["name"]))
                    } else if (check_true ((call_type==="local"))) {
                        ref_type=await get_ctx_val(ctx,(tokens && tokens["0"] && tokens["0"]["name"]))
                    } else {
                        ref_type=ArgumentType
                    }
                } ();
                await async function(){
                    if (check_true ((ref_type===AsyncFunction))) {
                        return ref_type="AsyncFunction"
                    } else if (check_true ((ref_type===Expression))) {
                        ref_type=ArgumentType
                    } else if (check_true ((ref_type===Function))) {
                        ref_type="Function"
                    } else if (check_true ((ref_type===Array))) {
                        ref_type="Array"
                    } else if (check_true ((ref_type===NilType))) {
                        ref_type="nil"
                    } else if (check_true ((ref_type===NumberType))) {
                        ref_type=ArgumentType
                    } else if (check_true ((ref_type===StringType))) {
                        ref_type="StringType"
                    } else if (check_true ((ref_type===ArgumentType))) {
                        true
                    } else {
                        ref_type=await sub_type(ref_type)
                    }
                } ();
                if (check_true (await (async function(){
                    let __array_op_rval__550=verbosity;
                     if (__array_op_rval__550 instanceof Function){
                        return await __array_op_rval__550(ctx) 
                    } else {
                        return [__array_op_rval__550,ctx]
                    }
                })())){
                    {
                        await sr_log("SYMBOL: ",(tokens && tokens["0"] && tokens["0"]["name"]),"  found as:",call_type," of type:",ref_type,"sanitized as: ",await (async function(){
                            if (check_true (("local"===call_type))){
                                return (" local sanitized to: "+ await sanitize_js_ref_name((tokens && tokens["0"] && tokens["0"]["name"])))
                            }
                        })())
                    }
                };
                rval=await (async function(){
                     return await async function(){
                        if (check_true ((ref_type==="AsyncFunction"))) {
                            {
                                (acc).push((preamble && preamble["0"]));
                                (acc).push(" ");
                                (acc).push(await (async function(){
                                    if (check_true ((call_type==="lisp"))){
                                        return await compile_lisp_scoped_reference((tokens && tokens["0"] && tokens["0"]["name"]),ctx)
                                    } else {
                                        return await sanitize_js_ref_name((tokens && tokens["0"] && tokens["0"]["name"]))
                                    }
                                })());
                                (acc).push("(");
                                await (async function(){
                                     let __test_condition__551=async function() {
                                        return (idx<((tokens && tokens.length)- 1))
                                    };
                                    let __body_ref__552=async function() {
                                        idx+=1;
                                        token=tokens[idx];
                                        stmt=await compile_wrapper_fn(token,ctx,new Object());
                                        (acc).push(stmt);
                                        if (check_true ((idx<((tokens && tokens.length)- 1)))){
                                            {
                                                return (acc).push(",")
                                            }
                                        }
                                    };
                                    let __BREAK__FLAG__=false;
                                    while(await __test_condition__551()) {
                                         await __body_ref__552();
                                         if(__BREAK__FLAG__) {
                                             break;
                                            
                                        }
                                    } ;
                                    
                                })();
                                (acc).push(")");
                                return acc
                            }
                        } else if (check_true ((ref_type==="Function"))) {
                            {
                                (acc).push((preamble && preamble["0"]));
                                (acc).push(" ");
                                (acc).push(await (async function(){
                                    if (check_true ((call_type==="lisp"))){
                                        return await compile_lisp_scoped_reference((tokens && tokens["0"] && tokens["0"]["name"]),ctx)
                                    } else {
                                        return await sanitize_js_ref_name((tokens && tokens["0"] && tokens["0"]["name"]))
                                    }
                                })());
                                (acc).push("(");
                                await (async function(){
                                     let __test_condition__553=async function() {
                                        return (idx<((tokens && tokens.length)- 1))
                                    };
                                    let __body_ref__554=async function() {
                                        idx+=1;
                                        token=tokens[idx];
                                        stmt=await compile_wrapper_fn(token,ctx,new Object());
                                        (acc).push(stmt);
                                        if (check_true ((idx<((tokens && tokens.length)- 1)))){
                                            {
                                                return (acc).push(",")
                                            }
                                        }
                                    };
                                    let __BREAK__FLAG__=false;
                                    while(await __test_condition__553()) {
                                         await __body_ref__554();
                                         if(__BREAK__FLAG__) {
                                             break;
                                            
                                        }
                                    } ;
                                    
                                })();
                                (acc).push(")");
                                return acc
                            }
                        } else if (check_true (((call_type==="local")&& ((ref_type==="NumberType")|| (ref_type==="StringType")|| (ref_type==="Boolean"))))) {
                            {
                                (acc).push((tokens && tokens["0"] && tokens["0"]["name"]));
                                return acc
                            }
                        } else if (check_true (((call_type==="local")&& await not((ref_type===ArgumentType))&& (tokens instanceof Array)))) {
                            {
                                if (check_true (await (async function(){
                                    let __array_op_rval__555=verbosity;
                                     if (__array_op_rval__555 instanceof Function){
                                        return await __array_op_rval__555(ctx) 
                                    } else {
                                        return [__array_op_rval__555,ctx]
                                    }
                                })())){
                                    {
                                        await sr_log("<- local, get_ctx_val returns: ",await get_ctx_val(ctx,(tokens && tokens["0"] && tokens["0"]["name"])),"local: ",await get_ctx(ctx,(tokens && tokens["0"] && tokens["0"]["name"])),"ctx: ",await (async function(){
                                             return await (async function(){
                                                let __array_op_rval__556=clone;
                                                 if (__array_op_rval__556 instanceof Function){
                                                    return await __array_op_rval__556(ctx) 
                                                } else {
                                                    return [__array_op_rval__556,ctx]
                                                }
                                            })() 
                                        })())
                                    }
                                };
                                val=await get_ctx_val(ctx,(tokens && tokens["0"] && tokens["0"]["name"]));
                                (acc).push(val);
                                return acc
                            }
                        } else if (check_true (((ref_type===ArgumentType)&& (tokens instanceof Array)))) {
                            {
                                (acc).push("[");
                                await (async function(){
                                     let __test_condition__557=async function() {
                                        return (idx<(tokens && tokens.length))
                                    };
                                    let __body_ref__558=async function() {
                                        token=tokens[idx];
                                        (acc).push(await (async function(){
                                             return await compile(token,ctx) 
                                        })());
                                        if (check_true ((idx<((tokens && tokens.length)- 1)))){
                                            {
                                                (acc).push(",")
                                            }
                                        };
                                        return idx+=1
                                    };
                                    let __BREAK__FLAG__=false;
                                    while(await __test_condition__557()) {
                                         await __body_ref__558();
                                         if(__BREAK__FLAG__) {
                                             break;
                                            
                                        }
                                    } ;
                                    
                                })();
                                (acc).push("]");
                                return acc
                            }
                        } else if (check_true ((ref_type===ArgumentType))) {
                            {
                                (acc).push((tokens && tokens["0"] && tokens["0"]["name"]));
                                return acc
                            }
                        } else if (check_true ((ref_type==="undefined"))) {
                            {
                                throw new ReferenceError(("unknown reference: "+ (tokens && tokens["0"] && tokens["0"]["name"])));
                                
                            }
                        } else if (check_true ((call_type==="lisp"))) {
                            {
                                return await compile_lisp_scoped_reference((tokens && tokens["0"] && tokens["0"]["name"]),ctx)
                            }
                        } else {
                            {
                                (acc).push((tokens && tokens["0"] && tokens["0"]["name"]));
                                return acc
                            }
                        }
                    } () 
                })();
                if (check_true (false)){
                    {
                        await async function(){
                            if (check_true (((ref_type==="AsyncFunction")|| (ref_type==="Function")))) {
                                return (acc).unshift({
                                    ctype:ref_type
                                })
                            }
                        } ()
                    }
                };
                return acc
            };
            compile_lisp_scoped_reference=async function(refname,ctx,defer_not_found) {
                let refval;
                let reftype;
                let declarations;
                let preamble;
                let basename;
                refval=await get_lisp_ctx(ctx,refname);
                reftype=await sub_type(refval);
                declarations=null;
                preamble=await calling_preamble(ctx);
                basename=await (await Environment.get_global("get_object_path"))(refname);
                ;
                declarations=await add(new Object(),await get_declarations(ctx,refname),await get_declaration_details(ctx,refname));
                if (check_true ((declarations && declarations["inlined"]))){
                    {
                        refname=await sanitize_js_ref_name(refname)
                    }
                };
                if (check_true ((((reftype==="StringType")|| (reftype==="String"))&& await not((refval===undefined))))){
                    {
                        refval="text"
                    }
                };
                return await async function(){
                    if (check_true (await contains_ques_((basename && basename["0"]),standard_types))) {
                        return refname
                    } else if (check_true ((declarations && declarations["inlined"]))) {
                        return refname
                    } else if (check_true (await not((refval===undefined)))) {
                        {
                            has_lisp_globals=true;
                            return [{
                                ctype:await (async function(){
                                    if (check_true ((await not(refval instanceof Function)&& (refval instanceof Object)))){
                                        return "object"
                                    } else {
                                        return refval
                                    }
                                })()
                            },"(",(preamble && preamble["0"])," ",env_ref,"get_global","(\"",refname,"\")",")"]
                        }
                    } else if (check_true (defer_not_found)) {
                        return ["(",env_ref,"get_global","(\"",refname,"\", ReferenceError)",")"]
                    } else {
                        {
                            throw new ReferenceError(("unknown lisp reference: "+ refname));
                            
                        }
                    }
                } ()
            };
            standard_types=await (async function(){
                let all_vals;
                all_vals=await (await Environment.get_global("make_set"))(await (async function(){
                     return await uniq(await conj(["AsyncFunction","check_true","LispSyntaxError","dlisp_environment_count","clone","super","Class","Environment","Expression","get_next_environment_id","subtype","lisp_writer","do_deferred_splice"],await (async function(){
                         return await object_methods(globalThis) 
                    })())) 
                })());
                await all_vals["delete"].call(all_vals,"length");
                return all_vals
            })();
            externals=await (await Environment.get_global("make_set"))(await (async function(){
                 return await object_methods(globalThis) 
            })());
            is_error=null;
            is_block_ques_=async function(tokens) {
                return (((tokens && tokens["0"] && tokens["0"]["type"])==="special")&& await contains_ques_((tokens && tokens["0"] && tokens["0"]["name"]),["do","progn"]))
            };
            is_complex_ques_=async function(tokens) {
                let rval;
                rval=(await is_block_ques_(tokens)|| (((tokens && tokens["type"])==="arr")&& await is_block_ques_((tokens && tokens["val"])))|| (((tokens && tokens["0"] && tokens["0"]["type"])==="special")&& (((tokens && tokens["0"] && tokens["0"]["name"])==="let")|| ((tokens && tokens["val"] && tokens["val"]["0"] && tokens["val"]["0"]["name"])==="if")|| ((tokens && tokens["val"] && tokens["val"]["0"] && tokens["val"]["0"]["name"])==="let"))));
                return rval
            };
            is_form_ques_=async function(token) {
                return (((token && token["val"]) instanceof Array)|| await is_block_ques_((token && token["val"])))
            };
            op_lookup=await ( async function(){
                let __obj__559=new Object();
                __obj__559["+"]=infix_ops;
                __obj__559["*"]=infix_ops;
                __obj__559["/"]=infix_ops;
                __obj__559["-"]=infix_ops;
                __obj__559["**"]=infix_ops;
                __obj__559["%"]=infix_ops;
                __obj__559["<<"]=infix_ops;
                __obj__559[">>"]=infix_ops;
                __obj__559["and"]=infix_ops;
                __obj__559["or"]=infix_ops;
                __obj__559["apply"]=compile_apply;
                __obj__559["call"]=compile_call;
                __obj__559["->"]=compile_call;
                __obj__559["set_prop"]=compile_set_prop;
                __obj__559["prop"]=compile_prop;
                __obj__559["="]=compile_assignment;
                __obj__559["setq"]=compile_assignment;
                __obj__559["=="]=compile_compare;
                __obj__559["eq"]=compile_compare;
                __obj__559[">"]=compile_compare;
                __obj__559["<"]=compile_compare;
                __obj__559["<="]=compile_compare;
                __obj__559[">="]=compile_compare;
                __obj__559["return"]=compile_return;
                __obj__559["new"]=compile_new;
                __obj__559["do"]=compile_block;
                __obj__559["progn"]=compile_block;
                __obj__559["progl"]=async function(tokens,ctx) {
                    return await compile_block(tokens,ctx,{
                        no_scope_boundary:true,suppress_return:true,force_no_new_ctx:true
                    })
                };
                __obj__559["break"]=compile_break;
                __obj__559["inc"]=compile_val_mod;
                __obj__559["dec"]=compile_val_mod;
                __obj__559["try"]=compile_try;
                __obj__559["throw"]=compile_throw;
                __obj__559["let"]=compile_let;
                __obj__559["defvar"]=compile_defvar;
                __obj__559["defconst"]=async function(tokens,ctx) {
                    if (check_true (await get_ctx(ctx,"__LOCAL_SCOPE__"))){
                        return await compile_defvar(tokens,ctx,{
                            constant:true
                        })
                    } else {
                        return await compile_set_global(tokens,ctx,{
                            constant:true
                        })
                    }
                };
                __obj__559["while"]=compile_while;
                __obj__559["for_each"]=compile_for_each;
                __obj__559["if"]=compile_if;
                __obj__559["cond"]=compile_cond;
                __obj__559["fn"]=compile_fn;
                __obj__559["lambda"]=compile_fn;
                __obj__559["function*"]=async function(tokens,ctx) {
                    return await compile_fn(tokens,ctx,{
                        generator:true
                    })
                };
                __obj__559["defglobal"]=compile_set_global;
                __obj__559["list"]=compile_list;
                __obj__559["function"]=async function(tokens,ctx) {
                    return await compile_fn(tokens,ctx,{
                        synchronous:true
                    })
                };
                __obj__559["=>"]=async function(tokens,ctx) {
                    return await compile_fn(tokens,ctx,{
                        arrow:true
                    })
                };
                __obj__559["yield"]=compile_yield;
                __obj__559["for_with"]=compile_for_with;
                __obj__559["quotem"]=compile_quotem;
                __obj__559["quote"]=compile_quote;
                __obj__559["quotel"]=compile_quotel;
                __obj__559["eval"]=compile_eval;
                __obj__559["jslambda"]=compile_jslambda;
                __obj__559["javascript"]=compile_javascript;
                __obj__559["instanceof"]=compile_instanceof;
                __obj__559["typeof"]=compile_typeof;
                __obj__559["unquotem"]=compile_unquotem;
                __obj__559["debug"]=compile_debug;
                __obj__559["declare"]=compile_declare;
                __obj__559["static_import"]=compile_import;
                __obj__559["dynamic_import"]=compile_dynamic_import;
                return __obj__559;
                
            })();
            comp_log=await (async function(){
                if (check_true (quiet_mode)){
                    return log
                } else {
                    return await defclog({
                        background:"LightSkyblue",color:"#000000"
                    })
                }
            })();
            last_source=null;
            compile_obj_literal=async function(tokens,ctx) {
                let acc;
                let idx;
                let stmt;
                let has_valid_key_literals;
                let token;
                let preamble;
                let key;
                let output_val;
                let tmp_name;
                let kvpair;
                let total_length;
                acc=[];
                idx=-1;
                stmt=null;
                has_valid_key_literals=true;
                token=null;
                preamble=await calling_preamble(ctx);
                key=null;
                output_val=null;
                tmp_name=null;
                ctx=await (async function(){
                     return await new_ctx(ctx) 
                })();
                kvpair=null;
                total_length=((tokens && tokens["val"] && tokens["val"]["length"])- 1);
                ;
                await async function(){
                    ctx["in_obj_literal"]=true;
                    return ctx;
                    
                }();
                await (async function() {
                    let __for_body__563=async function(token) {
                        if (check_true ((((token && token["type"])==="keyval")&& await check_invalid_js_ref((token && token.name))))){
                            {
                                has_valid_key_literals=false;
                                return __BREAK__FLAG__=true;
                                return
                            }
                        }
                    };
                    let __array__564=[],__elements__562=((tokens && tokens["val"])|| []);
                    let __BREAK__FLAG__=false;
                    for(let __iter__561 in __elements__562) {
                        __array__564.push(await __for_body__563(__elements__562[__iter__561]));
                        if(__BREAK__FLAG__) {
                             __array__564.pop();
                            break;
                            
                        }
                    }return __array__564;
                     
                })();
                if (check_true (has_valid_key_literals)){
                    if (check_true (((tokens && tokens["val"] && tokens["val"]["name"])==="{}"))){
                        return [{
                            ctype:"objliteral"
                        },"new Object()"]
                    } else {
                        {
                            (acc).push("{");
                            await (async function(){
                                 let __test_condition__565=async function() {
                                    return (idx<total_length)
                                };
                                let __body_ref__566=async function() {
                                    idx+=1;
                                    kvpair=await (async function(){
                                        let __targ__567=(tokens && tokens["val"]);
                                        if (__targ__567){
                                             return(__targ__567)[idx]
                                        } 
                                    })();
                                    key=await get_val((kvpair && kvpair["val"] && kvpair["val"]["0"]),ctx);
                                    if (check_true ((((key && key.length)===1)&& (await key["charCodeAt"]()===34)))){
                                        {
                                            key="'\"'"
                                        }
                                    };
                                    (acc).push(key);
                                    (acc).push(":");
                                    await set_ctx(ctx,"__LAMBDA_STEP__",-1);
                                    stmt=await compile_wrapper_fn((kvpair && kvpair["val"] && kvpair["val"]["1"]),ctx);
                                    await (await Environment.get_global("assert"))(stmt,"compile: obj literal value returned invalid/undefined value.");
                                    (acc).push(stmt);
                                    if (check_true ((idx<total_length))){
                                        {
                                            return (acc).push(",")
                                        }
                                    }
                                };
                                let __BREAK__FLAG__=false;
                                while(await __test_condition__565()) {
                                     await __body_ref__566();
                                     if(__BREAK__FLAG__) {
                                         break;
                                        
                                    }
                                } ;
                                
                            })();
                            (acc).push("}");
                            return [{
                                ctype:"objliteral"
                            },acc]
                        }
                    }
                } else {
                    {
                        tmp_name=await gen_temp_name("obj");
                        await (async function() {
                            let __for_body__570=async function(t) {
                                return (acc).push(t)
                            };
                            let __array__571=[],__elements__569=await (async function(){
                                 return [{
                                    ctype:"statement"
                                },(preamble && preamble["0"])," ","("," ",(preamble && preamble["1"])," ","function","()","{","let"," ",tmp_name,"=","new"," ","Object","()",";"] 
                            })();
                            let __BREAK__FLAG__=false;
                            for(let __iter__568 in __elements__569) {
                                __array__571.push(await __for_body__570(__elements__569[__iter__568]));
                                if(__BREAK__FLAG__) {
                                     __array__571.pop();
                                    break;
                                    
                                }
                            }return __array__571;
                             
                        })();
                        await (async function(){
                             let __test_condition__572=async function() {
                                return (idx<total_length)
                            };
                            let __body_ref__573=async function() {
                                idx+=1;
                                kvpair=await (async function(){
                                    let __targ__574=(tokens && tokens["val"]);
                                    if (__targ__574){
                                         return(__targ__574)[idx]
                                    } 
                                })();
                                output_val=(await compile_wrapper_fn((kvpair && kvpair["val"] && kvpair["val"]["1"]),ctx)|| "null");
                                try {
                                    (""+ output_val)
                                } catch (__exception__575) {
                                    if (__exception__575 instanceof Error) {
                                        let e=__exception__575;
                                        {
                                            {
                                                output_val="null"
                                            }
                                        }
                                    }
                                };
                                return await (async function() {
                                    let __for_body__578=async function(t) {
                                        return (acc).push(t)
                                    };
                                    let __array__579=[],__elements__577=await (async function(){
                                        let __array_op_rval__580=tmp_name;
                                         if (__array_op_rval__580 instanceof Function){
                                            return await __array_op_rval__580("[","\"",await (async function(){
                                                 return await cl_encode_string(await get_val((kvpair && kvpair["val"] && kvpair["val"]["0"]),ctx)) 
                                            })(),"\"","]","=",output_val,";") 
                                        } else {
                                            return [__array_op_rval__580,"[","\"",await (async function(){
                                                 return await cl_encode_string(await get_val((kvpair && kvpair["val"] && kvpair["val"]["0"]),ctx)) 
                                            })(),"\"","]","=",output_val,";"]
                                        }
                                    })();
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__576 in __elements__577) {
                                        __array__579.push(await __for_body__578(__elements__577[__iter__576]));
                                        if(__BREAK__FLAG__) {
                                             __array__579.pop();
                                            break;
                                            
                                        }
                                    }return __array__579;
                                     
                                })()
                            };
                            let __BREAK__FLAG__=false;
                            while(await __test_condition__572()) {
                                 await __body_ref__573();
                                 if(__BREAK__FLAG__) {
                                     break;
                                    
                                }
                            } ;
                            
                        })();
                        await (async function() {
                            let __for_body__583=async function(t) {
                                return (acc).push(t)
                            };
                            let __array__584=[],__elements__582=["return"," ",tmp_name,";","}",")","()"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__581 in __elements__582) {
                                __array__584.push(await __for_body__583(__elements__582[__iter__581]));
                                if(__BREAK__FLAG__) {
                                     __array__584.pop();
                                    break;
                                    
                                }
                            }return __array__584;
                             
                        })();
                        return acc
                    }
                }
            };
            is_literal_ques_=async function(val) {
                return (await is_number_ques_(val)|| (val instanceof String || typeof val==='string')|| (false===val)|| (true===val))
            };
            comp_warn=await (async function(){
                 return await defclog({
                    prefix:"compile: [warn]:",background:"#fcffc8",color:"brown"
                }) 
            })();
            let compile=await __compile__5();
            ;
            compile_inner=async function(tokens,ctx,_cdepth,_dbg_level) {
                let operator_type;
                let op_token;
                let rcv;
                let __op__591= async function(){
                    return null
                };
                let acc;
                let preamble;
                let tmp_name;
                let refval;
                let ref;
                {
                    operator_type=null;
                    op_token=null;
                    rcv=null;
                    let op=await __op__591();
                    ;
                    _cdepth=(_cdepth|| 100);
                    acc=[];
                    preamble=await calling_preamble(ctx);
                    tmp_name=null;
                    refval=null;
                    ref=null;
                    ;
                    if (check_true (throttle_level)){
                        {
                            if (check_true (await is_number_ques_(throttle_level))){
                                await (await Environment.get_global("sleep"))((0.001* throttle_level))
                            }
                        }
                    };
                    if (check_true (await (async function(){
                        let __array_op_rval__592=verbosity;
                         if (__array_op_rval__592 instanceof Function){
                            return await __array_op_rval__592(ctx) 
                        } else {
                            return [__array_op_rval__592,ctx]
                        }
                    })())){
                        {
                            await comp_log(("compile: "+ _cdepth+ "->"),await (async function(){
                                 return await (async function(){
                                    let __array_op_rval__593=clone;
                                     if (__array_op_rval__593 instanceof Function){
                                        return await __array_op_rval__593(tokens) 
                                    } else {
                                        return [__array_op_rval__593,tokens]
                                    }
                                })() 
                            })(),await (async function(){
                                 return await (async function(){
                                    let __array_op_rval__594=clone;
                                     if (__array_op_rval__594 instanceof Function){
                                        return await __array_op_rval__594(ctx) 
                                    } else {
                                        return [__array_op_rval__594,ctx]
                                    }
                                })() 
                            })())
                        }
                    };
                    try {
                        if (check_true ((null==ctx))){
                            {
                                await error_log("compile: nil ctx: ",tokens);
                                throw new Error("compile: nil ctx");
                                
                            }
                        } else {
                            return await async function(){
                                if (check_true ((await is_number_ques_(tokens)|| (tokens instanceof String || typeof tokens==='string')|| (await sub_type(tokens)==="Boolean")))) {
                                    return tokens
                                } else if (check_true (((tokens instanceof Array)&& (tokens && tokens["0"] && tokens["0"]["ref"])&& await not((await get_ctx(ctx,(tokens && tokens["0"] && tokens["0"]["name"]))===UnknownType))&& (op_lookup[(tokens && tokens["0"] && tokens["0"]["name"])]|| (Function===await get_ctx_val(ctx,(tokens && tokens["0"] && tokens["0"]["name"])))|| (AsyncFunction===await get_ctx_val(ctx,(tokens && tokens["0"] && tokens["0"]["name"])))|| ("function"===typeof await (async function(){
                                    let __targ__596=(root_ctx && root_ctx["defined_lisp_globals"]);
                                    if (__targ__596){
                                         return(__targ__596)[(tokens && tokens["0"] && tokens["0"]["name"])]
                                    } 
                                })())|| (await get_lisp_ctx(ctx,(tokens && tokens["0"] && tokens["0"]["name"])) instanceof Function&& await not(await get_ctx_val(ctx,(tokens && tokens["0"] && tokens["0"]["name"])))))))) {
                                    {
                                        op_token=await first(tokens);
                                        operator=op_token["name"];
                                        operator_type=op_token["val"];
                                        ref=op_token["ref"];
                                        op=op_lookup[operator];
                                        return await async function(){
                                            if (check_true (op)) {
                                                return (op)(tokens,ctx)
                                            } else if (check_true (await (async function(){
                                                let __targ__597=(Environment && Environment["inlines"]);
                                                if (__targ__597){
                                                     return(__targ__597)[operator]
                                                } 
                                            })())) {
                                                return await compile_inline(tokens,ctx)
                                            } else {
                                                return await compile_scoped_reference(tokens,ctx)
                                            }
                                        } ()
                                    }
                                } else if (check_true (((tokens instanceof Object)&& ((tokens && tokens["type"])==="objlit")))) {
                                    {
                                        return await compile_obj_literal(tokens,ctx)
                                    }
                                } else if (check_true ((tokens instanceof Array))) {
                                    {
                                        return await async function(){
                                            if (check_true (((tokens && tokens.length)===0))) {
                                                return [{
                                                    ctype:"array",is_literal:true
                                                },"[]"]
                                            } else {
                                                {
                                                    let is_operation;
                                                    let declared_type;
                                                    let prefix;
                                                    let symbolic_replacements;
                                                    let compiled_values;
                                                    is_operation=false;
                                                    declared_type=null;
                                                    prefix="";
                                                    ctx=await (async function(){
                                                         return await new_ctx(ctx) 
                                                    })();
                                                    symbolic_replacements=[];
                                                    compiled_values=[];
                                                    if (check_true (await (async function(){
                                                        let __array_op_rval__598=verbosity;
                                                         if (__array_op_rval__598 instanceof Function){
                                                            return await __array_op_rval__598(ctx) 
                                                        } else {
                                                            return [__array_op_rval__598,ctx]
                                                        }
                                                    })())){
                                                        {
                                                            await comp_log(("compile: "+ _cdepth+ " array: "),"compiling: ",await source_from_tokens(tokens,tokens,expanded_tree))
                                                        }
                                                    };
                                                    await set_new_completion_scope(ctx);
                                                    if (check_true (((tokens && tokens["0"] && tokens["0"]["ref"])&& ((tokens && tokens["0"] && tokens["0"]["val"]) instanceof String || typeof (tokens && tokens["0"] && tokens["0"]["val"])==='string')))){
                                                        {
                                                            declared_type=await get_declarations(ctx,(tokens && tokens["0"] && tokens["0"]["name"]))
                                                        }
                                                    };
                                                    rcv=await (async function(){
                                                         return await compile((tokens && tokens["0"]),ctx,await add(_cdepth,1)) 
                                                    })();
                                                    if (check_true (await (async function(){
                                                        let __array_op_rval__599=verbosity;
                                                         if (__array_op_rval__599 instanceof Function){
                                                            return await __array_op_rval__599(ctx) 
                                                        } else {
                                                            return [__array_op_rval__599,ctx]
                                                        }
                                                    })())){
                                                        {
                                                            await comp_log(("compile: "+ _cdepth+ " array: "),"potential operator: ",(tokens && tokens["0"] && tokens["0"]["name"]),"declarations: ",declared_type)
                                                        }
                                                    };
                                                    await (async function() {
                                                        let __for_body__602=async function(t) {
                                                            if (check_true (await not(await get_ctx_val(ctx,"__IN_LAMBDA__")))){
                                                                await set_ctx(ctx,"__LAMBDA_STEP__",0)
                                                            };
                                                            return (compiled_values).push(await compile_wrapper_fn(t,ctx))
                                                        };
                                                        let __array__603=[],__elements__601=await (await Environment.get_global("rest"))(tokens);
                                                        let __BREAK__FLAG__=false;
                                                        for(let __iter__600 in __elements__601) {
                                                            __array__603.push(await __for_body__602(__elements__601[__iter__600]));
                                                            if(__BREAK__FLAG__) {
                                                                 __array__603.pop();
                                                                break;
                                                                
                                                            }
                                                        }return __array__603;
                                                         
                                                    })();
                                                    await map(async function(compiled_element,idx) {
                                                        let inst;
                                                        inst=await (async function(){
                                                             return await async function(){
                                                                if (check_true ((((compiled_element && compiled_element["0"]) instanceof Object)&& await (async function(){
                                                                    let __targ__604=(compiled_element && compiled_element["0"]);
                                                                    if (__targ__604){
                                                                         return(__targ__604)["ctype"]
                                                                    } 
                                                                })()))) {
                                                                    return await (async function(){
                                                                        let __targ__605=(compiled_element && compiled_element["0"]);
                                                                        if (__targ__605){
                                                                             return(__targ__605)["ctype"]
                                                                        } 
                                                                    })()
                                                                } else if (check_true (((compiled_element && compiled_element["0"])==="{"))) {
                                                                    return "block"
                                                                } else {
                                                                    return null
                                                                }
                                                            } () 
                                                        })();
                                                        return await async function(){
                                                            if (check_true (((inst==="block")|| (inst==="letblock")))) {
                                                                {
                                                                    return (symbolic_replacements).push(await (async function(){
                                                                        let __array_op_rval__606=idx;
                                                                         if (__array_op_rval__606 instanceof Function){
                                                                            return await __array_op_rval__606(await gen_temp_name("array_arg"),[(preamble && preamble["2"]),"(",(preamble && preamble["1"])," ","function","()"," ",compiled_element," ",")"]) 
                                                                        } else {
                                                                            return [__array_op_rval__606,await gen_temp_name("array_arg"),[(preamble && preamble["2"]),"(",(preamble && preamble["1"])," ","function","()"," ",compiled_element," ",")"]]
                                                                        }
                                                                    })())
                                                                }
                                                            } else if (check_true ((inst==="ifblock"))) {
                                                                {
                                                                    return (symbolic_replacements).push(await (async function(){
                                                                        let __array_op_rval__607=idx;
                                                                         if (__array_op_rval__607 instanceof Function){
                                                                            return await __array_op_rval__607(await gen_temp_name("array_arg"),[(preamble && preamble["2"]),"(",(preamble && preamble["1"])," ","function","()"," ","{",compiled_element,"}"," ",")"]) 
                                                                        } else {
                                                                            return [__array_op_rval__607,await gen_temp_name("array_arg"),[(preamble && preamble["2"]),"(",(preamble && preamble["1"])," ","function","()"," ","{",compiled_element,"}"," ",")"]]
                                                                        }
                                                                    })())
                                                                }
                                                            }
                                                        } ()
                                                    },compiled_values);
                                                    await (async function() {
                                                        let __for_body__610=async function(elem) {
                                                            await (async function() {
                                                                let __for_body__614=async function(t) {
                                                                    return (acc).push(t)
                                                                };
                                                                let __array__615=[],__elements__613=["let"," ",(elem && elem["1"]),"=",(elem && elem["2"]),";"];
                                                                let __BREAK__FLAG__=false;
                                                                for(let __iter__612 in __elements__613) {
                                                                    __array__615.push(await __for_body__614(__elements__613[__iter__612]));
                                                                    if(__BREAK__FLAG__) {
                                                                         __array__615.pop();
                                                                        break;
                                                                        
                                                                    }
                                                                }return __array__615;
                                                                 
                                                            })();
                                                            return await compiled_values["splice"].call(compiled_values,(elem && elem["0"]),1,[(preamble && preamble["0"])," ",(elem && elem["1"]),"()"])
                                                        };
                                                        let __array__611=[],__elements__609=symbolic_replacements;
                                                        let __BREAK__FLAG__=false;
                                                        for(let __iter__608 in __elements__609) {
                                                            __array__611.push(await __for_body__610(__elements__609[__iter__608]));
                                                            if(__BREAK__FLAG__) {
                                                                 __array__611.pop();
                                                                break;
                                                                
                                                            }
                                                        }return __array__611;
                                                         
                                                    })();
                                                    if (check_true (((symbolic_replacements && symbolic_replacements.length)>0))){
                                                        {
                                                            (acc).unshift("{");
                                                            (acc).unshift({
                                                                ctype:"block"
                                                            })
                                                        }
                                                    };
                                                    await async function(){
                                                        if (check_true ((((declared_type && declared_type["type"])===Function)|| ((declared_type && declared_type["type"])===AsyncFunction)|| (((rcv && rcv["0"]) instanceof Object)&& (rcv && rcv["0"] && rcv["0"]["ctype"]) instanceof Function)|| (((rcv && rcv["0"]) instanceof Object)&& await not(((rcv && rcv["0"]) instanceof Array))&& ((rcv && rcv["0"] && rcv["0"]["ctype"]) instanceof String || typeof (rcv && rcv["0"] && rcv["0"]["ctype"])==='string')&& await contains_ques_("unction",(rcv && rcv["0"] && rcv["0"]["ctype"])))))) {
                                                            {
                                                                if (check_true (((declared_type && declared_type["type"])===AsyncFunction))){
                                                                    prefix="await "
                                                                } else {
                                                                    prefix=""
                                                                };
                                                                is_operation=true;
                                                                await (async function() {
                                                                    let __for_body__618=async function(t) {
                                                                        return (acc).push(t)
                                                                    };
                                                                    let __array__619=[],__elements__617=await (async function(){
                                                                        let __array_op_rval__620=prefix;
                                                                         if (__array_op_rval__620 instanceof Function){
                                                                            return await __array_op_rval__620("(",rcv,")","(") 
                                                                        } else {
                                                                            return [__array_op_rval__620,"(",rcv,")","("]
                                                                        }
                                                                    })();
                                                                    let __BREAK__FLAG__=false;
                                                                    for(let __iter__616 in __elements__617) {
                                                                        __array__619.push(await __for_body__618(__elements__617[__iter__616]));
                                                                        if(__BREAK__FLAG__) {
                                                                             __array__619.pop();
                                                                            break;
                                                                            
                                                                        }
                                                                    }return __array__619;
                                                                     
                                                                })();
                                                                await push_as_arg_list(acc,compiled_values);
                                                                return (acc).push(")")
                                                            }
                                                        } else if (check_true (((null==(declared_type && declared_type["type"]))&& (((tokens && tokens["0"] && tokens["0"]["type"])==="arg")|| ((rcv instanceof String || typeof rcv==='string')&& await get_declaration_details(ctx,rcv))|| ((rcv instanceof Array)&& ((rcv && rcv["0"]) instanceof Object)&& ((rcv && rcv["0"] && rcv["0"]["ctype"]) instanceof String || typeof (rcv && rcv["0"] && rcv["0"]["ctype"])==='string')&& ((rcv && rcv["0"] && rcv["0"]["ctype"])&& (await not(await contains_ques_("unction",(rcv && rcv["0"] && rcv["0"]["ctype"])))&& await not(await contains_ques_("block",(rcv && rcv["0"] && rcv["0"]["ctype"])))&& await not(("string"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&& await not(("StringType"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&& await not(("nil"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&& await not(("NumberType"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&& await not(("undefined"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&& await not(("objliteral"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&& await not(("Boolean"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&& await not(("array"===(rcv && rcv["0"] && rcv["0"]["ctype"])))))))))) {
                                                            {
                                                                if (check_true (show_hints)){
                                                                    {
                                                                        await comp_warn("value ambiguity - use declare to clarify: ",await source_from_tokens(tokens,expanded_tree,true)," ",await (await Environment.get_global("as_lisp"))(rcv))
                                                                    }
                                                                };
                                                                tmp_name=await gen_temp_name("array_op_rval");
                                                                if (check_true (((symbolic_replacements && symbolic_replacements.length)>0))){
                                                                    {
                                                                        (acc).push({
                                                                            ctype:"block"
                                                                        });
                                                                        (acc).push("return");
                                                                        (acc).push(" ")
                                                                    }
                                                                };
                                                                await (async function() {
                                                                    let __for_body__623=async function(t) {
                                                                        return (acc).push(t)
                                                                    };
                                                                    let __array__624=[],__elements__622=[(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()","{","let"," ",tmp_name,"=",rcv,";"," ","if"," ","(",tmp_name," ","instanceof"," ","Function",")","{","return"," ",(preamble && preamble["0"])," ",tmp_name,"("];
                                                                    let __BREAK__FLAG__=false;
                                                                    for(let __iter__621 in __elements__622) {
                                                                        __array__624.push(await __for_body__623(__elements__622[__iter__621]));
                                                                        if(__BREAK__FLAG__) {
                                                                             __array__624.pop();
                                                                            break;
                                                                            
                                                                        }
                                                                    }return __array__624;
                                                                     
                                                                })();
                                                                await push_as_arg_list(acc,compiled_values);
                                                                await (async function() {
                                                                    let __for_body__627=async function(t) {
                                                                        return (acc).push(t)
                                                                    };
                                                                    let __array__628=[],__elements__626=[")"," ","}"," ","else"," ","{","return"," ","[",tmp_name];
                                                                    let __BREAK__FLAG__=false;
                                                                    for(let __iter__625 in __elements__626) {
                                                                        __array__628.push(await __for_body__627(__elements__626[__iter__625]));
                                                                        if(__BREAK__FLAG__) {
                                                                             __array__628.pop();
                                                                            break;
                                                                            
                                                                        }
                                                                    }return __array__628;
                                                                     
                                                                })();
                                                                if (check_true ((await length(await (await Environment.get_global("rest"))(tokens))>0))){
                                                                    {
                                                                        (acc).push(",");
                                                                        await push_as_arg_list(acc,compiled_values)
                                                                    }
                                                                };
                                                                return await (async function() {
                                                                    let __for_body__631=async function(t) {
                                                                        return (acc).push(t)
                                                                    };
                                                                    let __array__632=[],__elements__630=["]","}","}",")","()"];
                                                                    let __BREAK__FLAG__=false;
                                                                    for(let __iter__629 in __elements__630) {
                                                                        __array__632.push(await __for_body__631(__elements__630[__iter__629]));
                                                                        if(__BREAK__FLAG__) {
                                                                             __array__632.pop();
                                                                            break;
                                                                            
                                                                        }
                                                                    }return __array__632;
                                                                     
                                                                })()
                                                            }
                                                        } else if (check_true (((null==(declared_type && declared_type["type"]))&& (((rcv instanceof Array)&& ((rcv && rcv["0"]) instanceof Object)&& ((rcv && rcv["0"] && rcv["0"]["ctype"]) instanceof String || typeof (rcv && rcv["0"] && rcv["0"]["ctype"])==='string')&& await contains_ques_("block",(rcv && rcv["0"] && rcv["0"]["ctype"]))))))) {
                                                            {
                                                                if (check_true (((symbolic_replacements && symbolic_replacements.length)>0))){
                                                                    {
                                                                        (acc).push("return");
                                                                        (acc).push(" ")
                                                                    }
                                                                };
                                                                (acc).push("[");
                                                                (acc).push(["(",(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","() {",rcv,"})","()",")"]);
                                                                if (check_true ((await length(await (await Environment.get_global("rest"))(tokens))>0))){
                                                                    {
                                                                        (acc).push(",");
                                                                        await push_as_arg_list(acc,compiled_values)
                                                                    }
                                                                };
                                                                return (acc).push("]")
                                                            }
                                                        } else {
                                                            return [(await (async function() {if (check_true (((symbolic_replacements && symbolic_replacements.length)>0))){
                                                                {
                                                                    (acc).push("return");
                                                                    return (acc).push(" ")
                                                                }
                                                            }
                                                        })()),(acc).push("["),(acc).push(rcv),await (async function(){
                                                            if (check_true ((await length(await (await Environment.get_global("rest"))(tokens))>0))){
                                                                {
                                                                    (acc).push(",");
                                                                    return await push_as_arg_list(acc,compiled_values)
                                                                }
                                                            }
                                                        })(),(acc).push("]")]
                                                    }
                                                } ();
                                                if (check_true (((symbolic_replacements && symbolic_replacements.length)>0))){
                                                    {
                                                        (acc).push("}")
                                                    }
                                                };
                                                return acc
                                            }
                                        }
                                    } ()
                                }
                            } else if (check_true (((tokens instanceof Object)&& ((tokens && tokens["val"]) instanceof Array)&& (tokens && tokens["type"])))) {
                                {
                                    await async function(){
                                        ctx["source"]=(tokens && tokens["source"]);
                                        return ctx;
                                        
                                    }();
                                    if (check_true (await (async function(){
                                        let __array_op_rval__634=verbosity;
                                         if (__array_op_rval__634 instanceof Function){
                                            return await __array_op_rval__634(ctx) 
                                        } else {
                                            return [__array_op_rval__634,ctx]
                                        }
                                    })())){
                                        {
                                            await comp_log(("compile: "+ _cdepth+ ": "),"tokens.val is array type: calling compile with: ",(tokens && tokens["val"]),"ctx:",await (async function(){
                                                 return await (async function(){
                                                    let __array_op_rval__635=clone;
                                                     if (__array_op_rval__635 instanceof Function){
                                                        return await __array_op_rval__635(ctx) 
                                                    } else {
                                                        return [__array_op_rval__635,ctx]
                                                    }
                                                })() 
                                            })())
                                        }
                                    };
                                    rcv=await (async function(){
                                         return await compile((tokens && tokens["val"]),ctx,await add(_cdepth,1)) 
                                    })();
                                    if (check_true (await (async function(){
                                        let __array_op_rval__636=verbosity;
                                         if (__array_op_rval__636 instanceof Function){
                                            return await __array_op_rval__636(ctx) 
                                        } else {
                                            return [__array_op_rval__636,ctx]
                                        }
                                    })())){
                                        {
                                            await comp_log(("compile: "+ _cdepth+ ": "),"<-",rcv)
                                        }
                                    };
                                    return rcv
                                }
                            } else if (check_true ((((tokens instanceof Object)&& await not((undefined===(tokens && tokens["val"])))&& (tokens && tokens["type"]))|| ((tokens && tokens["type"])==="literal")|| ((tokens && tokens["type"])==="arg")|| ((tokens && tokens["type"])==="null")))) {
                                {
                                    let snt_name=null;
                                    ;
                                    let snt_value=null;
                                    ;
                                    if (check_true (await (async function(){
                                        let __array_op_rval__637=verbosity;
                                         if (__array_op_rval__637 instanceof Function){
                                            return await __array_op_rval__637(ctx) 
                                        } else {
                                            return [__array_op_rval__637,ctx]
                                        }
                                    })())){
                                        {
                                            await comp_log(("compile: "+ _cdepth+ ":"),"simple value compile: ",await (async function(){
                                                 return await (async function(){
                                                    let __array_op_rval__638=clone;
                                                     if (__array_op_rval__638 instanceof Function){
                                                        return await __array_op_rval__638(tokens) 
                                                    } else {
                                                        return [__array_op_rval__638,tokens]
                                                    }
                                                })() 
                                            })())
                                        }
                                    };
                                    return await async function(){
                                        if (check_true ((await not((tokens && tokens["ref"]))&& ((tokens && tokens["type"])==="arr")))) {
                                            return await compile((tokens && tokens["val"]),ctx,await add(_cdepth,1))
                                        } else if (check_true ((((tokens && tokens["type"])==="null")|| (((tokens && tokens["type"])==="literal")&& ((tokens && tokens.name)==="null")&& (tokens && tokens["ref"]))))) {
                                            return [{
                                                ctype:"nil"
                                            },"null"]
                                        } else if (check_true ((((tokens && tokens["type"])==="literal")&& ((tokens && tokens.name)==="undefined")&& (tokens && tokens["ref"])))) {
                                            return [{
                                                ctype:"undefined"
                                            },"undefined"]
                                        } else if (check_true (await not((tokens && tokens["ref"])))) {
                                            if (check_true ((((tokens && tokens["type"])==="literal")&& ((tokens && tokens["val"]) instanceof String || typeof (tokens && tokens["val"])==='string')))){
                                                return [{
                                                    ctype:"string"
                                                },("\""+ await (async function(){
                                                     return await cl_encode_string((tokens && tokens["val"])) 
                                                })()+ "\"")]
                                            } else {
                                                if (check_true (await is_number_ques_((tokens && tokens["val"])))){
                                                    return [{
                                                        ctype:"NumberType"
                                                    },(tokens && tokens["val"])]
                                                } else {
                                                    return [{
                                                        ctype:await sub_type((tokens && tokens["val"]))
                                                    },(tokens && tokens["val"])]
                                                }
                                            }
                                        } else if (check_true (((tokens && tokens["ref"])&& (opts && opts["root_environment"])))) {
                                            {
                                                return await (await Environment.get_global("path_to_js_syntax"))((await sanitize_js_ref_name((tokens && tokens.name))).split("."))
                                            }
                                        } else if (check_true (((tokens && tokens["ref"])&& op_lookup[(tokens && tokens.name)]))) {
                                            return (tokens && tokens.name)
                                        } else if (check_true (((tokens && tokens["ref"])&& await (async function(){
                                            snt_name=await sanitize_js_ref_name((tokens && tokens.name));
                                            snt_value=await get_ctx_val(ctx,snt_name);
                                            if (check_true (await (async function(){
                                                let __array_op_rval__639=verbosity;
                                                 if (__array_op_rval__639 instanceof Function){
                                                    return await __array_op_rval__639(ctx) 
                                                } else {
                                                    return [__array_op_rval__639,ctx]
                                                }
                                            })())){
                                                {
                                                    await comp_log("compile: singleton: ","name: ",(tokens && tokens.name)," sanitized: ",snt_name,"found locally as:",snt_value)
                                                }
                                            };
                                            return await not((snt_value===undefined))
                                        })()))) {
                                            {
                                                refval=snt_value;
                                                if (check_true ((refval===ArgumentType))){
                                                    {
                                                        refval=snt_name
                                                    }
                                                };
                                                return await async function(){
                                                    if (check_true (((tokens && tokens["type"])==="literal"))) {
                                                        return refval
                                                    } else {
                                                        return await get_val(tokens,ctx)
                                                    }
                                                } ()
                                            }
                                        } else if (check_true (await contains_ques_((tokens && tokens.name),standard_types))) {
                                            return (tokens && tokens.name)
                                        } else if (check_true (await not((undefined===await get_lisp_ctx(ctx,(tokens && tokens.name)))))) {
                                            {
                                                if (check_true (await (async function(){
                                                    let __array_op_rval__640=verbosity;
                                                     if (__array_op_rval__640 instanceof Function){
                                                        return await __array_op_rval__640(ctx) 
                                                    } else {
                                                        return [__array_op_rval__640,ctx]
                                                    }
                                                })())){
                                                    {
                                                        await comp_log("compile: singleton: found global: ",(tokens && tokens.name))
                                                    }
                                                };
                                                return await compile_lisp_scoped_reference((tokens && tokens.name),ctx)
                                            }
                                        } else {
                                            {
                                                if (check_true (await (async function(){
                                                    let __array_op_rval__641=verbosity;
                                                     if (__array_op_rval__641 instanceof Function){
                                                        return await __array_op_rval__641() 
                                                    } else {
                                                        return [__array_op_rval__641]
                                                    }
                                                })())){
                                                    {
                                                        await comp_log("compile: resolver fall through:",(tokens && tokens.name),"-  not found globally or in local context")
                                                    }
                                                };
                                                throw new ReferenceError(("compile: unknown/not found reference: "+ (tokens && tokens.name)));
                                                
                                            }
                                        }
                                    } ()
                                }
                            } else {
                                {
                                    throw new SyntaxError("compile passed invalid compilation structure");
                                    
                                }
                            }
                        } ()
                    }
                } catch (__exception__595) {
                    if (__exception__595 instanceof Error) {
                        let e=__exception__595;
                        {
                            {
                                if (check_true ((is_error&& (e && e["handled"])))){
                                    {
                                        throw e;
                                        
                                    }
                                };
                                is_error={
                                    error:(e && e.name),source_name:source_name,message:(e && e.message),form:await source_from_tokens(tokens,expanded_tree),parent_forms:await source_from_tokens(tokens,expanded_tree,true),invalid:true
                                };
                                if (check_true (await not((e && e["handled"])))){
                                    {
                                        (errors).push(is_error);
                                        await async function(){
                                            e["handled"]=true;
                                            return e;
                                            
                                        }()
                                    }
                                };
                                await async function(){
                                    e["details"]=is_error;
                                    return e;
                                    
                                }();
                                if (check_true ((opts && opts["throw_on_error"]))){
                                    throw e;
                                    
                                }
                            }
                        }
                    }
                }
            }
        };
        final_token_assembly=null;
        main_log=await (async function(){
            if (check_true ((opts && opts["quiet_mode"]))){
                return log
            } else {
                return await defclog({
                    prefix:"compiler:",background:"green",color:"black"
                })
            }
        })();
        assemble_output=async function(js_tree,suppress_join) {
            let text;
            let in_quotes;
            let escaped;
            let escape_char;
            let format_depth;
            let last_t;
            let insert_indent;
            let process_output_token;
            let assemble;
            text=[];
            in_quotes=false;
            escaped=0;
            escape_char=await String.fromCharCode(92);
            format_depth=[];
            last_t=null;
            insert_indent=async function() {
                (text).push("\n");
                return await (async function() {
                    let __for_body__646=async function(spacer) {
                        return (text).push(spacer)
                    };
                    let __array__647=[],__elements__645=format_depth;
                    let __BREAK__FLAG__=false;
                    for(let __iter__644 in __elements__645) {
                        __array__647.push(await __for_body__646(__elements__645[__iter__644]));
                        if(__BREAK__FLAG__) {
                             __array__647.pop();
                            break;
                            
                        }
                    }return __array__647;
                     
                })()
            };
            process_output_token=async function(t) {
                escaped=await Math.max(0,(escaped- 1));
                return await async function(){
                    if (check_true (((t==="\"")&& (escaped===0)&& in_quotes))) {
                        {
                            in_quotes=false;
                            return (text).push(t)
                        }
                    } else if (check_true (((t==="\"")&& (escaped===0)))) {
                        {
                            in_quotes=true;
                            return (text).push(t)
                        }
                    } else if (check_true ((t===escape_char))) {
                        {
                            (escaped===2);
                            return (text).push(t)
                        }
                    } else if (check_true ((await not(in_quotes)&& (t==="{")))) {
                        {
                            (text).push(t);
                            (format_depth).push("    ");
                            return await insert_indent()
                        }
                    } else if (check_true ((await not(in_quotes)&& await starts_with_ques_("}",t)))) {
                        {
                            (format_depth).pop();
                            await insert_indent();
                            return (text).push(t)
                        }
                    } else if (check_true ((await not(in_quotes)&& (t===";")))) {
                        {
                            (text).push(t);
                            return await insert_indent()
                        }
                    } else if (check_true ((false&& await not(in_quotes)&& await starts_with_ques_("/*",t)))) {
                        {
                            (text).push(t);
                            return await insert_indent()
                        }
                    } else {
                        {
                            return (text).push(t)
                        }
                    }
                } ()
            };
            assemble=async function(js_tokens) {
                return await (async function() {
                    let __for_body__650=async function(t) {
                        return await async function(){
                            if (check_true ((t instanceof Array))) {
                                {
                                    return await assemble(t)
                                }
                            } else if (check_true (("object"===typeof t))) {
                                {
                                    if (check_true ((t && t["source_comment"]))){
                                        (text).push(("/* "+ (t && t["source_comment"])+ " */"))
                                    };
                                    if (check_true ((t && t["comment"]))){
                                        {
                                            (text).push(("/* "+ (t && t["comment"])+ " */"));
                                            return await insert_indent()
                                        }
                                    }
                                }
                            } else if (check_true (t instanceof Function)) {
                                {
                                    return await async function(){
                                        if (check_true (((t && t.name)&& await contains_ques_((t && t.name),standard_types)))) {
                                            return (text).push((t && t.name))
                                        } else if (check_true (await (await Environment.get_global("ends_with?"))("{ [native code] }",await t["toString"]()))) {
                                            {
                                                throw new ReferenceError(("cannot capture source of: "+ (t && t.name)));
                                                
                                            }
                                        } else {
                                            return (text).push(t)
                                        }
                                    } ()
                                }
                            } else {
                                {
                                    if (check_true ((opts && opts["formatted_output"]))){
                                        return await process_output_token(t)
                                    } else {
                                        return (text).push(t)
                                    }
                                }
                            }
                        } ()
                    };
                    let __array__651=[],__elements__649=js_tokens;
                    let __BREAK__FLAG__=false;
                    for(let __iter__648 in __elements__649) {
                        __array__651.push(await __for_body__650(__elements__649[__iter__648]));
                        if(__BREAK__FLAG__) {
                             __array__651.pop();
                            break;
                            
                        }
                    }return __array__651;
                     
                })()
            };
            {
                await assemble(await flatten(await (async function(){
                    let __array_op_rval__652=js_tree;
                     if (__array_op_rval__652 instanceof Function){
                        return await __array_op_rval__652() 
                    } else {
                        return [__array_op_rval__652]
                    }
                })()));
                if (check_true (suppress_join)){
                    return text
                } else {
                    {
                        return (text).join("")
                    }
                }
            }
        };
        ;
        if (check_true ((null==Environment))){
            throw new EvalError("Compiler: No environment passed in options.");
            
        };
        if (check_true ((opts && opts["show_hints"]))){
            {
                show_hints=true
            }
        };
        if (check_true (await Environment["get_global"].call(Environment,"__VERBOSITY__"))){
            {
                {
                    let verbosity_level;
                    verbosity_level=await Environment["get_global"].call(Environment,"__VERBOSITY__");
                    await async function(){
                        if (check_true ((verbosity_level>4))) {
                            {
                                verbosity=check_verbosity;
                                return show_hints=true
                            }
                        } else if (check_true ((verbosity_level>3))) {
                            show_hints=true
                        }
                    } ()
                }
            }
        };
        if (check_true (await (async function(){
            let __array_op_rval__653=verbosity;
             if (__array_op_rval__653 instanceof Function){
                return await __array_op_rval__653(ctx) 
            } else {
                return [__array_op_rval__653,ctx]
            }
        })())){
            {
                await (async function(){
                    let __array_op_rval__654=main_log;
                     if (__array_op_rval__654 instanceof Function){
                        return await __array_op_rval__654("namespace set to: ",(Environment && Environment["namespace"])) 
                    } else {
                        return [__array_op_rval__654,"namespace set to: ",(Environment && Environment["namespace"])]
                    }
                })();
                if (check_true ((opts && opts["fully_qualified_globals"]))){
                    {
                        await (async function(){
                            let __array_op_rval__655=main_log;
                             if (__array_op_rval__655 instanceof Function){
                                return await __array_op_rval__655("fully qualified globals") 
                            } else {
                                return [__array_op_rval__655,"fully qualified globals"]
                            }
                        })()
                    }
                }
            }
        };
        await set_ctx(root_ctx,break_out,false);
        await async function(){
            root_ctx["defined_lisp_globals"]=new Object();
            return root_ctx;
            
        }();
        await set_ctx(root_ctx,"__COMPLETION_SCOPE__",{
            id:completion_scope_id,root_block_id:null,completion_records:[],is_top:true
        });
        await set_ctx(root_ctx,"__GLOBALS__",new Set());
        await set_ctx(root_ctx,"__EXTERNALS__",new Set());
        await set_ctx(root_ctx,"__SOURCE_NAME__",source_name);
        await set_ctx(root_ctx,"__LAMBDA_STEP__",-1);
        if (check_true (await (async function(){
            let __array_op_rval__657=verbosity;
             if (__array_op_rval__657 instanceof Function){
                return await __array_op_rval__657(ctx) 
            } else {
                return [__array_op_rval__657,ctx]
            }
        })())){
            {
                await (async function(){
                    let __array_op_rval__658=main_log;
                     if (__array_op_rval__658 instanceof Function){
                        return await __array_op_rval__658("root_ctx: ",root_ctx) 
                    } else {
                        return [__array_op_rval__658,"root_ctx: ",root_ctx]
                    }
                })()
            }
        };
        output=await (async function(){
             return await async function(){
                if (check_true ((opts && opts["special_operators"]))) {
                    {
                        return await (await Environment.get_global("make_set"))(await (await Environment.get_global("keys"))(op_lookup))
                    }
                } else if (check_true ((opts && opts["only_tokens"]))) {
                    return await tokenize(tree,root_ctx)
                } else if (check_true (is_error)) {
                    return [{
                        ctype:"CompileError"
                    },is_error]
                } else {
                    {
                        try {
                            if (check_true ((await not((opts && opts["root_environment"]))&& ((first_level_setup && first_level_setup.length)===0)&& ((opts && opts["ctx"] && opts["ctx"]["scope"]) instanceof Object)))){
                                {
                                    dynamic_references_ques_=false;
                                    await (async function() {
                                        let __for_body__662=async function(pset) {
                                            {
                                                let name;
                                                let value;
                                                name=(pset && pset["0"]);
                                                value=(pset && pset["1"]);
                                                await set_ctx(root_ctx,name,value);
                                                return (first_level_setup).push(["let ",await sanitize_js_ref_name(name),"=",await (async function(){
                                                     return await compile(await tokenize(value,root_ctx),root_ctx,101) 
                                                })(),";"])
                                            }
                                        };
                                        let __array__663=[],__elements__661=await (await Environment.get_global("pairs"))((opts && opts["ctx"] && opts["ctx"]["scope"]));
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__660 in __elements__661) {
                                            __array__663.push(await __for_body__662(__elements__661[__iter__660]));
                                            if(__BREAK__FLAG__) {
                                                 __array__663.pop();
                                                break;
                                                
                                            }
                                        }return __array__663;
                                         
                                    })()
                                }
                            };
                            final_token_assembly=await tokenize(tree,root_ctx)
                        } catch (__exception__659) {
                            if (__exception__659 instanceof Error) {
                                let e=__exception__659;
                                {
                                    is_error=e
                                }
                            }
                        };
                        await async function(){
                            if (check_true ((is_error&& (opts && opts["throw_on_error"])))) {
                                throw is_error;
                                
                            } else if (check_true ((is_error instanceof SyntaxError))) {
                                {
                                    (errors).push(is_error);
                                    return is_error
                                }
                            } else if (check_true (is_error)) {
                                {
                                    (errors).push(is_error);
                                    return is_error
                                }
                            } else if (check_true ((null==final_token_assembly))) {
                                {
                                    is_error=new EvalError("Pre-Compilation Error");
                                    return (errors).push(is_error)
                                }
                            } else {
                                {
                                    if (check_true ((opts && opts["on_final_token_assembly"]))){
                                        await opts["on_final_token_assembly"].call(opts,final_token_assembly)
                                    };
                                    assembly=await (async function(){
                                         return await compile(final_token_assembly,root_ctx,0) 
                                    })();
                                    if (check_true ((is_error&& (opts && opts["throw_on_error"])))){
                                        {
                                            throw is_error;
                                            
                                        }
                                    };
                                    if (check_true (await not(is_error))){
                                        {
                                            if (check_true ((assembly instanceof Array))){
                                                {
                                                    await check_statement_completion(root_ctx,assembly)
                                                }
                                            }
                                        }
                                    };
                                    return assembly
                                }
                            }
                        } ();
                        if (check_true ((opts && opts["root_environment"]))){
                            {
                                has_lisp_globals=false
                            }
                        };
                        if (check_true (((assembly && assembly["0"] && assembly["0"]["ctype"])&& (assembly && assembly["0"] && assembly["0"]["ctype"]) instanceof Function))){
                            {
                                await async function(){
                                    let __target_obj__664=(assembly && assembly["0"]);
                                    __target_obj__664["ctype"]=await map_value_to_ctype((assembly && assembly["0"] && assembly["0"]["ctype"]));
                                    return __target_obj__664;
                                    
                                }()
                            }
                        };
                        await async function(){
                            if (check_true ((await not(is_error)&& assembly&& (await first(assembly) instanceof Object)&& await (async function(){
                                let __targ__665=await first(assembly);
                                if (__targ__665){
                                     return(__targ__665)["ctype"]
                                } 
                            })()&& (await not((await (async function(){
                                let __targ__666=await first(assembly);
                                if (__targ__666){
                                     return(__targ__666)["ctype"]
                                } 
                            })() instanceof String || typeof await (async function(){
                                let __targ__666=await first(assembly);
                                if (__targ__666){
                                     return(__targ__666)["ctype"]
                                } 
                            })()==='string'))|| await (async function(){
                                let val;
                                val=await (async function(){
                                    let __targ__667=await first(assembly);
                                    if (__targ__667){
                                         return(__targ__667)["ctype"]
                                    } 
                                })();
                                return (await not((val==="assignment"))&& await not(await contains_ques_("block",val))&& await not(await contains_ques_("unction",val)))
                            })())))) {
                                {
                                    return await async function(){
                                        let __target_obj__668=(assembly && assembly["0"]);
                                        __target_obj__668["ctype"]="statement";
                                        return __target_obj__668;
                                        
                                    }()
                                }
                            } else if (check_true ((assembly&& (await first(assembly) instanceof String || typeof await first(assembly)==='string')&& (await first(assembly)==="throw")))) {
                                return assembly=await (async function(){
                                     return [{
                                        ctype:"block"
                                    },assembly] 
                                })()
                            } else if (check_true ((await not(is_error)&& assembly&& (await not((await first(assembly) instanceof Object))|| await not(await (async function(){
                                let __targ__669=await first(assembly);
                                if (__targ__669){
                                     return(__targ__669)["ctype"]
                                } 
                            })()))))) {
                                {
                                    if (check_true (dynamic_references_ques_)){
                                        return assembly=await (async function(){
                                             return [{
                                                ctype:"block"
                                            },["{",first_level_setup,";","return ",assembly,"};"]] 
                                        })()
                                    } else {
                                        return assembly=await (async function(){
                                             return [{
                                                ctype:"statement"
                                            },assembly] 
                                        })()
                                    }
                                }
                            } else if (check_true (is_error)) {
                                return is_error
                            } else if (check_true ((null==assembly))) {
                                return assembly=[]
                            }
                        } ();
                        if (check_true (is_error)){
                            {
                                return [{
                                    ctype:"FAIL"
                                },errors]
                            }
                        } else {
                            if (check_true ((await first(assembly) instanceof Object))){
                                return [await add({
                                    has_lisp_globals:has_lisp_globals,requires:await (async function(){
                                         return await (await Environment.get_global("to_array"))(referenced_global_symbols) 
                                    })(),externals:await (async function(){
                                         return await (await Environment.get_global("to_array"))(referenced_externals) 
                                    })()
                                },(assembly).shift()),await assemble_output(assembly)]
                            } else {
                                return [{
                                    has_lisp_globals:has_lisp_globals,requires:await (async function(){
                                         return await (await Environment.get_global("to_array"))(referenced_global_symbols) 
                                    })(),externals:await (async function(){
                                         return await (await Environment.get_global("to_array"))(referenced_externals) 
                                    })()
                                },await assemble_output(assembly)]
                            }
                        }
                    }
                }
            } () 
        })();
        if (check_true (((await first(output) instanceof Object)&& target_namespace))){
            {
                await async function(){
                    let __target_obj__670=await first(output);
                    __target_obj__670["namespace"]=target_namespace;
                    return __target_obj__670;
                    
                }()
            }
        };
        if (check_true ((opts && opts["error_report"]))){
            {
                await opts.error_report({
                    errors:errors,warnings:warnings
                })
            }
        };
        return output
    }
}
},{
    requires:["take","is_array?","is_string?","is_function?","get_object_path","is_object?","blank?","delete_prop","scan_str","keys","is_element?","chop","as_lisp","resolve_path","push","split_by","safe_access","expand_dot_accessor","pairs","pop","assert","rest","setf_ctx","prepend","ends_with?","range","join","path_to_js_syntax","get_outside_global","to_array","bind_function","each","read_lisp","warn","make_set","truncate","sleep"],externals:["clone","LispSyntaxError","console","Object","Set","Function","AsyncFunction","Array","Boolean","SyntaxError","TypeError","RegExp","Error","JSON","ReferenceError","EvalError","subtype","String","parseInt","isNaN","globalThis","Math","check_true"],source_name:"compiler.lisp"
})} 
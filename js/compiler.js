// Source: compiler.lisp  
// Build Time: 2022-08-17 09:27:24
// Version: 2022.08.17.09.27
export const DLISP_ENV_VERSION='2022.08.17.09.27';




var { get_next_environment_id, check_true, get_outside_global, subtype, lisp_writer, clone, LispSyntaxError } = await import("./lisp_writer.js");
export async function init_compiler(Environment) {
  return await Environment.set_global("compiler",async function(quoted_lisp,opts) {
    {
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
            let is_nil_ques_=async function(value) {     return  (null===value)
};
            let is_number_ques_=function(x) {                             return  ( subtype(x)==="Number")
                        };
            let starts_with_ques_=function anonymous(val,text) {
{ if (text instanceof Array) { return text[0]===val } else if (subtype(text)=='String') { return text.startsWith(val) } else { return false }}
};
            let uniq=async function(values,handle_complex_types) {    let s;
    s=new Set();
    if (check_true (handle_complex_types)){
        await (await Environment.get_global("map"))(async function(x) {
             return  await s["add"].call(s,await JSON.stringify(x))
        },(values|| []));
         return  await (await Environment.get_global("map"))(async function(x) {
             return  await JSON.parse(x)
        },await (await Environment.get_global("to_array"))(s))
    } else {
        await (await Environment.get_global("map"))(async function(x) {
             return  await s["add"].call(s,x)
        },(values|| []));
         return  await (await Environment.get_global("to_array"))(s)
    }
};
            let object_methods=async function(obj) {    let properties;
    let current_obj;
    properties=new Set();
    current_obj=obj;
    await (async function(){
         let __test_condition__270=async function() {
             return  current_obj
        };
        let __body_ref__271=async function() {
            await (await Environment.get_global("map"))(async function(item) {
                 return  await properties["add"].call(properties,item)
            },await Object.getOwnPropertyNames(current_obj));
             return  current_obj=await Object.getPrototypeOf(current_obj)
        };
        let __BREAK__FLAG__=false;
        while(await __test_condition__270()) {
            await __body_ref__271();
             if(__BREAK__FLAG__) {
                 break;
                
            }
        } ;
        
    })();
     return  await (async function() {
        {
             let __call_target__=await Array.from(await properties["keys"]()), __call_method__="filter";
            return await __call_target__[__call_method__].call(__call_target__,async function(item) {
                 return  item instanceof Function
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
        let escaped;
        let nq;
        let step1;
        let snq;
        escaped=await (await Environment.get_global("replace"))(new RegExp("\n","g"),await (await Environment.get_global("add"))(await String.fromCharCode(92),"n"),text);
        escaped=await (await Environment.get_global("replace"))(new RegExp("\r","g"),await (await Environment.get_global("add"))(await String.fromCharCode(92),"r"),escaped);
        nq=(escaped).split(await String.fromCharCode(34));
        step1=(nq).join(await (await Environment.get_global("add"))(await String.fromCharCode(92),await String.fromCharCode(34)));
        snq=(step1).split(await String.fromCharCode(39));
         return  step1
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
            let signal_error;
            let warnings;
            let blk_counter;
            let ctx;
            let output;
            let __log__1= async function(){
                return await Environment.get_global("log")
            };
            let __defclog__2= async function(){
                return async function(opts) {
                    let style;
                    style=("padding: 5px;"+ await (async function () {
                         if (check_true ((opts && opts["background"]))){
                              return ("background: "+ (opts && opts["background"])+ ";")
                        } else {
                              return ""
                        } 
                    })()+ await (async function () {
                         if (check_true ((opts && opts["color"]))){
                              return ("color: "+ (opts && opts["color"])+ ";")
                        } 
                    })()+ "");
                    ;
                     return  async function(...args) {
                         return  await (async function(){
                            let __target_arg__6=[].concat(await conj([style],args));
                            if(!__target_arg__6 instanceof Array){
                                throw new TypeError("Invalid final argument to apply - an array is required")
                            }let __pre_arg__7=("%c"+ await (async function () {
                                 if (check_true ((opts && opts["prefix"]))){
                                      return (opts && opts["prefix"])
                                } else {
                                      return (args).shift()
                                } 
                            })());
                            __target_arg__6.unshift(__pre_arg__7);
                            return (console.log).apply(this,__target_arg__6)
                        })()
                    }
                }
            };
            let quiet_mode;
            let show_hints;
            let error_log;
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
            let referenced_global_symbols;
            let new_ctx;
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
            let sanitize_js_ref_name;
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
            let compile_assignment;
            let needs_return_ques_;
            let top_level_log;
            let compile_toplevel;
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
            let wrap_assignment_value;
            let clean_quoted_reference;
            let compile_let;
            let in_sync_ques_;
            let await_ques_;
            let calling_preamble;
            let fn_log;
            let compile_fn;
            let compile_jslambda;
            let compile_yield;
            let var_counter;
            let gen_temp_name;
            let if_id;
            let cond_log;
            let compile_cond;
            let compile_cond_inner;
            let compile_if;
            let compile_wrapper_fn;
            let compile_block_to_anon_fn;
            let make_do_block;
            let push_as_arg_list;
            let compile_new;
            let compile_val_mod;
            let try_log;
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
            let get_scoped_type;
            let compile_scoped_reference;
            let compile_lisp_scoped_reference;
            let standard_types;
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
            let __compile__3= async function(){
                return async function(tokens,ctx,_cdepth) {
                    if (check_true (is_error)){
                          return is_error
                    } else {
                        let rval=await compile_inner(tokens,ctx,_cdepth);
                        ;
                        if (check_true (is_error)){
                            if (check_true ((opts && opts["throw_on_error"]))){
                                let error=new Error((is_error && is_error["error"]));
                                ;
                                await (async function() {
                                    let __for_body__618=async function(pset) {
                                         return  await async function(){
                                            error[(pset && pset["0"])]=(pset && pset["1"]);
                                            return error;
                                            
                                        }()
                                    };
                                    let __array__619=[],__elements__617=await (await Environment.get_global("pairs"))(is_error);
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__616 in __elements__617) {
                                        __array__619.push(await __for_body__618(__elements__617[__iter__616]));
                                        if(__BREAK__FLAG__) {
                                             __array__619.pop();
                                            break;
                                            
                                        }
                                    }return __array__619;
                                     
                                })();
                                throw error;
                                
                            }
                        };
                         return  rval
                    }
                }
            };
            let compile_inner;
            let final_token_assembly;
            let main_log;
            let assemble_output;
            {
                tree=quoted_lisp;
                expanded_tree=await clone(tree);
                op=null;
                default_safety_level=((Environment && Environment["declarations"] && Environment["declarations"]["safety"] && Environment["declarations"]["safety"]["level"])|| 1);
                source_name=((opts && opts["source_name"])|| "anonymous");
                build_environment_mode=((opts && opts["build_environment"])|| false);
                env_ref=await (async function () {
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
                signal_error=async function(message) {
                     return  new LispSyntaxError(message)
                };
                warnings=[];
                blk_counter=0;
                ctx=null;
                output=null;
                let log=await __log__1();
                ;
                let defclog=await __defclog__2();
                ;
                quiet_mode=await (async function () {
                     if (check_true ((opts && opts["quiet_mode"]))){
                        log=console.log;
                         return  true
                    } else {
                          return false
                    } 
                })();
                show_hints=null;
                error_log=await defclog({
                    prefix:"Compile Error",background:"#CA3040",color:"white"
                });
                assembly=[];
                async_function_type_placeholder=async function() {
                     return  true
                };
                function_type_placeholder=function() {
                     return  true
                };
                type_marker=async function(type) {
                     return  await async function(){
                        let __target_obj__8=new Object();
                        __target_obj__8["ctype"]=type;
                        __target_obj__8["args"]=[];
                        return __target_obj__8;
                        
                    }()
                };
                return_marker=async function() {
                     return  {
                        mark:"rval"
                    }
                };
                entry_signature=null;
                temp_fn_asn_template=[{
                    type:"special",val:"=:defvar",ref:true,name:"defvar"
                },{
                    type:"literal",val:"\"\"",ref:false,name:""
                },{
                    type:"arr",val:[{
                        type:"special",val:"=:fn",ref:true,name:"fn"
                    },{
                        type:"arr",val:[],ref:false,name:null
                    },{
                        type:"arr",val:[],ref:false,name:null
                    }],ref:false,name:null
                }];
                anon_fn_template=await temp_fn_asn_template["slice"].call(temp_fn_asn_template,2);
                build_fn_with_assignment=async function(tmp_var_name,body,args,ctx) {
                    let tmp_template;
                    tmp_template=await clone(temp_fn_asn_template);
                    if (check_true (await (async function(){
                        let __array_op_rval__9=in_sync_ques_;
                         if (__array_op_rval__9 instanceof Function){
                            return await __array_op_rval__9(ctx) 
                        } else {
                            return[__array_op_rval__9,ctx]
                        }
                    })())){
                        await async function(){
                            let __target_obj__10=(tmp_template && tmp_template["2"] && tmp_template["2"]["val"] && tmp_template["2"]["val"]["0"]);
                            __target_obj__10["val"]="=:function";
                            return __target_obj__10;
                            
                        }();
                         await async function(){
                            let __target_obj__11=(tmp_template && tmp_template["2"] && tmp_template["2"]["val"] && tmp_template["2"]["val"]["0"]);
                            __target_obj__11["name"]="function";
                            return __target_obj__11;
                            
                        }()
                    };
                    await async function(){
                        let __target_obj__12=(tmp_template && tmp_template["1"]);
                        __target_obj__12["name"]=tmp_var_name;
                        __target_obj__12["val"]=tmp_var_name;
                        return __target_obj__12;
                        
                    }();
                    if (check_true ((args instanceof Array))){
                         await async function(){
                            let __target_obj__13=(tmp_template && tmp_template["2"] && tmp_template["2"]["val"] && tmp_template["2"]["val"]["1"]);
                            __target_obj__13["val"]=args;
                            return __target_obj__13;
                            
                        }()
                    };
                    await async function(){
                        let __target_obj__14=(tmp_template && tmp_template["2"] && tmp_template["2"]["val"] && tmp_template["2"]["val"]["2"]);
                        __target_obj__14["val"]=body;
                        return __target_obj__14;
                        
                    }();
                     return  tmp_template
                };
                build_anon_fn=async function(body,args) {
                    let tmp_template;
                    tmp_template=await clone(anon_fn_template);
                    if (check_true (await verbosity(ctx))){
                        await console.log("build_anon_function: -> body: ",body);
                         await console.log("build_anon_function: -> args: ",args)
                    };
                    if (check_true ((args instanceof Array))){
                         await async function(){
                            let __target_obj__15=(tmp_template && tmp_template["0"] && tmp_template["0"]["val"] && tmp_template["0"]["val"]["1"]);
                            __target_obj__15["val"]=args;
                            return __target_obj__15;
                            
                        }()
                    };
                    await async function(){
                        let __target_obj__16=(tmp_template && tmp_template["0"] && tmp_template["0"]["val"] && tmp_template["0"]["val"]["2"]);
                        __target_obj__16["val"]=body;
                        return __target_obj__16;
                        
                    }();
                     return  tmp_template
                };
                referenced_global_symbols=new Object();
                new_ctx=async function(parent) {
                    let ctx_obj;
                    ctx_obj=new Object();
                    await async function(){
                        ctx_obj["scope"]=new Object();
                        ctx_obj["source"]="";
                        ctx_obj["parent"]=parent;
                        ctx_obj["ambiguous"]=new Object();
                        ctx_obj["declared_types"]=new Object();
                        ctx_obj["defs"]=[];
                        return ctx_obj;
                        
                    }();
                    if (check_true (parent)){
                        await async function(){
                            let __target_obj__18=(ctx_obj && ctx_obj["scope"]);
                            __target_obj__18["namespace"]=(parent && parent["scope"] && parent["scope"]["namespace"]);
                            return __target_obj__18;
                            
                        }();
                        if (check_true ((parent && parent["defvar_eval"]))){
                             await async function(){
                                ctx_obj["defvar_eval"]=true;
                                return ctx_obj;
                                
                            }()
                        };
                        if (check_true ((parent && parent["has_first_level"]))){
                             await async function(){
                                ctx_obj["has_first_level"]=true;
                                return ctx_obj;
                                
                            }()
                        };
                        if (check_true ((parent && parent["block_step"]))){
                             await async function(){
                                ctx_obj["block_step"]=(parent && parent["block_step"]);
                                return ctx_obj;
                                
                            }()
                        };
                        if (check_true ((parent && parent["block_id"]))){
                             await async function(){
                                ctx_obj["block_id"]=(parent && parent["block_id"]);
                                return ctx_obj;
                                
                            }()
                        };
                        if (check_true ((parent && parent["suppress_return"]))){
                             await async function(){
                                ctx_obj["suppress_return"]=(parent && parent["suppress_return"]);
                                return ctx_obj;
                                
                            }()
                        };
                        if (check_true ((parent && parent["in_try"]))){
                             await async function(){
                                ctx_obj["in_try"]=parent["in_try"];
                                return ctx_obj;
                                
                            }()
                        };
                        if (check_true ((parent && parent["return_point"]))){
                             await async function(){
                                ctx_obj["return_point"]=await add((parent && parent["return_point"]),1);
                                return ctx_obj;
                                
                            }()
                        }
                    };
                     return  ctx_obj
                };
                set_ctx_log=await (async function () {
                     if (check_true ((opts && opts["quiet_mode"]))){
                          return log
                    } else {
                          return await defclog({
                            prefix:"set_ctx",background:"darkgreen",color:"white"
                        })
                    } 
                })();
                map_ctype_to_value=async function(ctype,value) {
                     return  await async function(){
                        if (check_true( (ctype==="Function"))) {
                             return Function
                        } else if (check_true( (ctype==="AsyncFunction"))) {
                             return AsyncFunction
                        } else if (check_true( (ctype==="expression"))) {
                             return Expression
                        } else if (check_true( ((ctype instanceof String || typeof ctype==='string')&& await contains_ques_("block",ctype)))) {
                             return UnknownType
                        } else if (check_true( (ctype==="array"))) {
                             return Array
                        } else if (check_true( (ctype==="nil"))) {
                             return NilType
                        } else if (check_true( ctype instanceof Function)) {
                             return ctype
                        } else  {
                             return value
                        }
                    } ()
                };
                map_value_to_ctype=async function(value) {
                     return  await async function(){
                        if (check_true( (Function===value))) {
                             return "Function"
                        } else if (check_true( (AsyncFunction===value))) {
                             return "AsyncFunction"
                        } else if (check_true( (NumberType===value))) {
                             return "NumberType"
                        } else if (check_true( (Expression===value))) {
                             return "Expression"
                        } else if (check_true( (Array===value))) {
                             return "array"
                        } else if (check_true( (Boolean===value))) {
                             return "Boolean"
                        } else if (check_true( (NilType===value))) {
                             return "nil"
                        } else if (check_true( (Object===value))) {
                             return "Object"
                        } else  {
                             return value
                        }
                    } ()
                };
                set_ctx=async function(ctx,name,value) {
                    let sanitized_name=await sanitize_js_ref_name(name);
                    ;
                    if (check_true (((value instanceof Array)&& (value && value["0"] && value["0"]["ctype"])))){
                          return await async function(){
                            let __target_obj__26=(ctx && ctx["scope"]);
                            __target_obj__26[sanitized_name]=await async function(){
                                if (check_true( ((value && value["0"] && value["0"]["ctype"])==="Function"))) {
                                     return Function
                                } else if (check_true( ((value && value["0"] && value["0"]["ctype"])==="AsyncFunction"))) {
                                     return AsyncFunction
                                } else if (check_true( ((value && value["0"] && value["0"]["ctype"])==="expression"))) {
                                     return Expression
                                } else  {
                                     return value
                                }
                            } ();
                            return __target_obj__26;
                            
                        }()
                    } else {
                          return await async function(){
                            let __target_obj__27=(ctx && ctx["scope"]);
                            __target_obj__27[sanitized_name]=value;
                            return __target_obj__27;
                            
                        }()
                    }
                };
                get_ctx=async function(ctx,name) {
                    let ref_name;
                    ref_name=null;
                     return  await async function(){
                        if (check_true( await is_nil_ques_(name))) {
                             throw new SyntaxError(("get_ctx: nil identifier passed: "+ await sub_type(name)));
                            
                        } else if (check_true( await is_number_ques_(name))) {
                             return name
                        } else if (check_true( name instanceof Function)) {
                             throw new SyntaxError(("get_ctx: invalid identifier passed: "+ await sub_type(name)));
                            
                        } else  {
                            ref_name=await first(await (await Environment.get_global("get_object_path"))(name));
                             return  await async function(){
                                if (check_true( await not((undefined===await (async function(){
                                    let __targ__28=(ctx && ctx["scope"]);
                                    if (__targ__28){
                                         return(__targ__28)[ref_name]
                                    } 
                                })())))) {
                                     return await (async function(){
                                        let __targ__29=(ctx && ctx["scope"]);
                                        if (__targ__29){
                                             return(__targ__29)[ref_name]
                                        } 
                                    })()
                                } else if (check_true((ctx && ctx["parent"]))) {
                                     return await get_ctx((ctx && ctx["parent"]),ref_name)
                                }
                            } ()
                        }
                    } ()
                };
                get_ctx_val=async function(ctx,name) {
                    let ref_name;
                    let declared_type_value;
                    ref_name=null;
                    declared_type_value=null;
                    if (check_true ((null==ctx))){
                         await console.error("get_ctx_val: undefined/nil ctx passed.")
                    };
                     return  await async function(){
                        if (check_true( await is_nil_ques_(name))) {
                             throw new TypeError(("get_ctx_val: nil identifier passed: "+ await sub_type(name)));
                            
                        } else if (check_true( await is_number_ques_(name))) {
                             return name
                        } else if (check_true( name instanceof Function)) {
                             throw new Error(("get_ctx_val: invalid identifier passed: "+ await sub_type(name)));
                            
                        } else  {
                            if (check_true (await starts_with_ques_("=:",name))){
                                 ref_name=await name["substr"].call(name,2)
                            } else {
                                 ref_name=name
                            };
                            ref_name=await sanitize_js_ref_name(name);
                            declared_type_value=await get_declarations(ctx,ref_name);
                             return  await async function(){
                                if (check_true((declared_type_value && declared_type_value["declared_global"]))) {
                                     return undefined
                                } else if (check_true((declared_type_value && declared_type_value["type"]))) {
                                     return (declared_type_value && declared_type_value["type"])
                                } else  {
                                    ref_name=await first(await (await Environment.get_global("get_object_path"))(ref_name));
                                     return  await async function(){
                                        if (check_true( op_lookup[ref_name])) {
                                             return AsyncFunction
                                        } else if (check_true( await not((undefined===await (async function(){
                                            let __targ__30=(ctx && ctx["scope"]);
                                            if (__targ__30){
                                                 return(__targ__30)[ref_name]
                                            } 
                                        })())))) {
                                             return await (async function(){
                                                let __targ__31=(ctx && ctx["scope"]);
                                                if (__targ__31){
                                                     return(__targ__31)[ref_name]
                                                } 
                                            })()
                                        } else if (check_true((ctx && ctx["parent"]))) {
                                             return await get_ctx((ctx && ctx["parent"]),ref_name)
                                        }
                                    } ()
                                }
                            } ()
                        }
                    } ()
                };
                get_declarations=async function(ctx,name,_tagged) {
                    let ref_name;
                    let oname;
                    ref_name=null;
                    oname=name;
                    name=await (async function () {
                         if (check_true (_tagged)){
                              return name
                        } else {
                              return await sanitize_js_ref_name(name)
                        } 
                    })();
                     return  await async function(){
                        if (check_true( await not((ctx instanceof Object)))) {
                             throw new TypeError(("get_declarations: invalid ctx passed"));
                            
                        } else if (check_true( await is_nil_ques_(name))) {
                             throw new TypeError(("get_declarations: nil identifier passed: "+ await sub_type(oname)));
                            
                        } else if (check_true( await is_number_ques_(name))) {
                             return name
                        } else if (check_true( name instanceof Function)) {
                             throw new Error(("get_declarations: invalid identifier passed: "+ await sub_type(oname)));
                            
                        } else  {
                             if (check_true ((name instanceof String || typeof name==='string'))){
                                if (check_true (await starts_with_ques_("=:",name))){
                                     ref_name=await name["substr"].call(name,2)
                                } else {
                                     ref_name=name
                                };
                                 return  await async function(){
                                    if (check_true( op_lookup[ref_name])) {
                                         return null
                                    } else if (check_true( await not((undefined===await (async function(){
                                        let __targ__32=(ctx && ctx["declared_types"]);
                                        if (__targ__32){
                                             return(__targ__32)[ref_name]
                                        } 
                                    })())))) {
                                         return await (async function(){
                                            let __targ__33=(ctx && ctx["declared_types"]);
                                            if (__targ__33){
                                                 return(__targ__33)[ref_name]
                                            } 
                                        })()
                                    } else if (check_true((ctx && ctx["parent"]))) {
                                         return await get_declarations((ctx && ctx["parent"]),ref_name,true)
                                    }
                                } ()
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
                         dec_struct={
                            type:undefined,inlined:false
                        }
                    };
                     return  await async function(){
                        if (check_true( ((declaration_type==="location")&& (value==="global")))) {
                            has_lisp_globals=true;
                            if (check_true ((undefined===dec_struct["type"])))throw new SyntaxError("global declaration must be after declaration of type for symbol");
                            ;
                            await async function(){
                                dec_struct["declared_global"]=true;
                                return dec_struct;
                                
                            }();
                             return  await async function(){
                                let __target_obj__35=(root_ctx && root_ctx["defined_lisp_globals"]);
                                __target_obj__35[name]=dec_struct["type"];
                                return __target_obj__35;
                                
                            }()
                        } else  {
                            await async function(){
                                dec_struct[declaration_type]=value;
                                return dec_struct;
                                
                            }();
                            await async function(){
                                let __target_obj__37=(ctx && ctx["declared_types"]);
                                __target_obj__37[sname]=dec_struct;
                                return __target_obj__37;
                                
                            }();
                             return  await (async function(){
                                let __targ__38=(ctx && ctx["declared_types"]);
                                if (__targ__38){
                                     return(__targ__38)[sname]
                                } 
                            })()
                        }
                    } ()
                };
                is_ambiguous_ques_=async function(ctx,name) {
                    let ref_name;
                    ref_name=null;
                     return  await async function(){
                        if (check_true( await is_nil_ques_(ctx))) {
                             throw new TypeError(("is_ambiguous?: nil ctx passed"));
                            
                        } else if (check_true( await is_nil_ques_(name))) {
                             throw new TypeError(("is_ambiguous?: nil reference name passed"));
                            
                        } else if (check_true( await not((name instanceof String || typeof name==='string')))) {
                             throw new TypeError(("is_ambiguous?: reference name given is a "+ await sub_type(name)+ ", requires a string"));
                            
                        } else  {
                            if (check_true (await starts_with_ques_("=:",name))){
                                 ref_name=await name["substr"].call(name,2)
                            } else {
                                 ref_name=name
                            };
                            ref_name=await first(await (await Environment.get_global("get_object_path"))(ref_name));
                             return  await async function(){
                                if (check_true( await (async function(){
                                    let __targ__39=(ctx && ctx["ambiguous"]);
                                    if (__targ__39){
                                         return(__targ__39)[ref_name]
                                    } 
                                })())) {
                                     return true
                                } else if (check_true((ctx && ctx["parent"]))) {
                                     return await (async function(){
                                        let __array_op_rval__40=is_ambiguous_ques_;
                                         if (__array_op_rval__40 instanceof Function){
                                            return await __array_op_rval__40((ctx && ctx["parent"]),ref_name) 
                                        } else {
                                            return[__array_op_rval__40,(ctx && ctx["parent"]),ref_name]
                                        }
                                    })()
                                }
                            } ()
                        }
                    } ()
                };
                set_ambiguous=async function(ctx,name) {
                     return  await async function(){
                        let __target_obj__41=(ctx && ctx["ambiguous"]);
                        __target_obj__41[name]=true;
                        return __target_obj__41;
                        
                    }()
                };
                unset_ambiguous=async function(ctx,name) {
                     return  await (await Environment.get_global("delete_prop"))((ctx && ctx["ambiguous"]),name)
                };
                invalid_js_ref_chars="+?-%&^#!*[]~{}/|";
                invalid_js_ref_chars_regex=new RegExp("[/\%\+\[\>\?\<\\}\{&\#\^\=\~\*\!\)\(\-]+","g");
                check_invalid_js_ref=async function(symname) {
                     return  await async function(){
                        if (check_true( await not((symname instanceof String || typeof symname==='string')))) {
                             return false
                        } else if (check_true( ((symname instanceof String || typeof symname==='string')&& (await length(symname)>2)&& await starts_with_ques_("=:",symname)))) {
                             return (await length(await (await Environment.get_global("scan_str"))(invalid_js_ref_chars_regex,await symname["substr"].call(symname,2)))>0)
                        } else  {
                             return (await length(await (await Environment.get_global("scan_str"))(invalid_js_ref_chars_regex,symname))>0)
                        }
                    } ()
                };
                sanitize_js_ref_name=async function(symname) {
                     return  await async function(){
                        if (check_true( await not((symname instanceof String || typeof symname==='string')))) {
                             return symname
                        } else  {
                            let text_chars;
                            let acc;
                            text_chars=(symname).split("");
                            acc=[];
                            await (async function() {
                                let __for_body__44=async function(t) {
                                     return  await async function(){
                                        if (check_true( (t==="+"))) {
                                             return (acc).push("_plus_")
                                        } else if (check_true( (t==="?"))) {
                                             return (acc).push("_ques_")
                                        } else if (check_true( (t==="-"))) {
                                             return (acc).push("_")
                                        } else if (check_true( (t==="&"))) {
                                             return (acc).push("_amper_")
                                        } else if (check_true( (t==="^"))) {
                                             return (acc).push("_carot_")
                                        } else if (check_true( (t==="#"))) {
                                             return (acc).push("_hash_")
                                        } else if (check_true( (t==="!"))) {
                                             return (acc).push("_exclaim_")
                                        } else if (check_true( (t==="*"))) {
                                             return (acc).push("_star_")
                                        } else if (check_true( (t==="~"))) {
                                             return (acc).push("_tilde_")
                                        } else if (check_true( (t==="~"))) {
                                             return (acc).push("_percent_")
                                        } else if (check_true( (t==="|"))) {
                                             return (acc).push("_pipe_")
                                        } else if (check_true( await contains_ques_(t,"(){}"))) {
                                             throw new SyntaxError(("Invalid character in symbol: "+ symname));
                                            
                                        } else  {
                                             return (acc).push(t)
                                        }
                                    } ()
                                };
                                let __array__45=[],__elements__43=text_chars;
                                let __BREAK__FLAG__=false;
                                for(let __iter__42 in __elements__43) {
                                    __array__45.push(await __for_body__44(__elements__43[__iter__42]));
                                    if(__BREAK__FLAG__) {
                                         __array__45.pop();
                                        break;
                                        
                                    }
                                }return __array__45;
                                 
                            })();
                             return  (acc).join("")
                        }
                    } ()
                };
                find_in_context=async function(ctx,name) {
                    let symname;
                    let ref;
                    let __is_literal_ques___46= async function(){
                        return (await is_number_ques_(name)|| (await not(ref)&& (name instanceof String || typeof name==='string'))|| ("nil"===symname)|| ("null"===symname)|| (ref&& ("undefined"===symname))|| (ref&& ("else"===symname))|| (ref&& ("catch"===symname))|| (true===name)|| (false===name))
                    };
                    let special;
                    let local;
                    let global;
                    let val;
                    {
                        symname=await async function(){
                            if (check_true( ((name instanceof String || typeof name==='string')&& (await length(name)>2)&& await starts_with_ques_("=:",name)))) {
                                 return await name["substr"].call(name,2)
                            } else if (check_true( (name instanceof String || typeof name==='string'))) {
                                 return name
                            } else  {
                                if (check_true ((name===null))){
                                     name="=:nil"
                                };
                                 return  "null"
                            }
                        } ();
                        ref=(symname&& ((name instanceof String || typeof name==='string')&& (await length(name)>2)&& await starts_with_ques_("=:",name)));
                        let is_literal_ques_=await __is_literal_ques___46();
                        ;
                        special=(ref&& symname&& await contains_ques_(symname,await conj(["unquotem","quotem"],await (await Environment.get_global("keys"))(op_lookup))));
                        local=(await not(special)&& await not(is_literal_ques_)&& symname&& ref&& await get_ctx_val(ctx,symname));
                        global=(await not(special)&& await not(is_literal_ques_)&& ref&& symname&& await get_lisp_ctx(symname));
                        val=await async function(){
                            if (check_true(is_literal_ques_)) {
                                 return name
                            } else if (check_true( (name instanceof Array))) {
                                 return name
                            } else if (check_true( (name instanceof Object))) {
                                 return name
                            } else if (check_true(special)) {
                                 return name
                            } else if (check_true(local)) {
                                 return local
                            } else if (check_true( (await not((global===undefined))&& await not((global===NOT_FOUND))))) {
                                 return global
                            } else if (check_true( (symname===name))) {
                                 return name
                            }
                        } ();
                         return  {
                            type:await async function(){
                                if (check_true( (name instanceof Array))) {
                                     return "arr"
                                } else if (check_true( name instanceof Element)) {
                                     return "dom"
                                } else if (check_true( (name instanceof Object))) {
                                     return await sub_type(name)
                                } else if (check_true(special)) {
                                     return "special"
                                } else if (check_true(is_literal_ques_)) {
                                     return "literal"
                                } else if (check_true(local)) {
                                     return await sub_type(local)
                                } else if (check_true( await not((undefined==global)))) {
                                     return await sub_type(global)
                                } else if (check_true( (ref&& symname))) {
                                     return "unbound"
                                } else if (check_true( (name===undefined))) {
                                     return "literal"
                                } else  {
                                    (error_log)("find_in_context: unknown type: ",name);
                                    debugger;
                                    ;
                                     return  "??"
                                }
                            } (),name:await async function(){
                                if (check_true( (symname&& ref))) {
                                     return await sanitize_js_ref_name(symname)
                                } else if (check_true( (false&& is_literal_ques_&& (val instanceof String || typeof val==='string')))) {
                                     return await sanitize_js_ref_name(name)
                                } else if (check_true(is_literal_ques_)) {
                                     if (check_true (ref)){
                                          return await sanitize_js_ref_name(name)
                                    } else {
                                          return name
                                    }
                                } else  {
                                     return null
                                }
                            } (),val:await (async function(){
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
                            })(),local:(local|| null),global:((global&& await not((NOT_FOUND===global)))|| null)
                        }
                    }
                };
                source_chain=async function(cpath,tree,sources) {
                    if (check_true (((cpath instanceof Array)&& tree))){
                        let source;
                        sources=(sources|| []);
                        source=null;
                        cpath=await (await Environment.get_global("chop"))(cpath);
                        source=await (await Environment.get_global("as_lisp"))(await (await Environment.get_global("resolve_path"))(cpath,tree));
                        if (check_true (((source && source.length)>80))){
                             source=await add(await source["substr"].call(source,0,80),"...")
                        };
                        if (check_true (await not(await (await Environment.get_global("blank?"))(source)))){
                             (sources).push(source)
                        };
                        if (check_true ((((cpath && cpath.length)>0)&& ((sources && sources.length)<4)))){
                             await source_chain(cpath,tree,sources)
                        };
                         return  sources
                    }
                };
                source_from_tokens=async function(tokens,tree,collect_parents_ques_) {
                     return  await async function(){
                        if (check_true( ((tokens && tokens["path"])&& collect_parents_ques_))) {
                             return await source_chain((tokens && tokens["path"]),tree)
                        } else if (check_true( (tree instanceof String || typeof tree==='string'))) {
                             return await (await Environment.get_global("as_lisp"))(tree)
                        } else if (check_true((tokens && tokens["path"]))) {
                             return await (await Environment.get_global("as_lisp"))(await (await Environment.get_global("resolve_path"))((tokens && tokens["path"]),tree))
                        } else if (check_true( ((tokens instanceof Array)&& (tokens && tokens["0"] && tokens["0"]["path"])&& collect_parents_ques_))) {
                             return await source_chain((tokens && tokens["0"] && tokens["0"]["path"]),tree)
                        } else if (check_true( ((tokens instanceof Array)&& (tokens && tokens["0"] && tokens["0"]["path"])))) {
                             return await (await Environment.get_global("as_lisp"))(await (await Environment.get_global("resolve_path"))(await (await Environment.get_global("chop"))((tokens && tokens["0"] && tokens["0"]["path"])),tree))
                        } else if (check_true( ((undefined===tokens)&& await not((undefined===tree))))) {
                             return await (await Environment.get_global("as_lisp"))(tree)
                        } else  {
                            if (check_true (await verbosity(ctx))){
                                 await console.warn("source_from_tokens: unable to determine source path from: ",await clone(tokens))
                            };
                             return  ""
                        }
                    } ()
                };
                source_comment=async function(tokens) {
                     return  {
                        comment:await source_from_tokens(tokens,expanded_tree)
                    }
                };
                NOT_FOUND="__!NOT_FOUND!__";
                THIS_REFERENCE=async function() {
                     return  "this"
                };
                NOT_FOUND_THING=async function() {
                     return  true
                };
                get_lisp_ctx_log=await (async function () {
                     if (check_true ((opts && opts["quiet_mode"]))){
                          return log
                    } else {
                          return await defclog({
                            prefix:"get_lisp_ctx",color:"darkgreen",background:"#A0A0A0"
                        })
                    } 
                })();
                get_lisp_ctx=async function(name) {
                    if (check_true (await not((name instanceof String || typeof name==='string'))))throw new Error("Compiler Error: get_lisp_ctx passed a non string identifier");
                     else {
                        let comps;
                        let cannot_be_js_global;
                        let ref_name;
                        let ref_type;
                        comps=await (await Environment.get_global("get_object_path"))(name);
                        cannot_be_js_global=await check_invalid_js_ref((comps && comps["0"]));
                        ref_name=(comps).shift();
                        ref_type=await (async function () {
                             if (check_true ((ref_name==="this"))){
                                  return THIS_REFERENCE
                            } else {
                                let global_ref=await (async function(){
                                    let __targ__47=(root_ctx && root_ctx["defined_lisp_globals"]);
                                    if (__targ__47){
                                         return(__targ__47)[ref_name]
                                    } 
                                })();
                                ;
                                if (check_true (((undefined==global_ref)|| (global_ref==="statement")))){
                                      return await Environment["get_global"].call(Environment,ref_name,NOT_FOUND_THING,cannot_be_js_global)
                                } else {
                                      return global_ref
                                }
                            } 
                        })();
                        if (check_true ((await not((NOT_FOUND_THING===ref_type))&& await not(await contains_ques_(ref_name,standard_types))&& await async function(){
                            referenced_global_symbols[ref_name]=ref_type;
                            return referenced_global_symbols;
                            
                        }()))){
                            
                        };
                         return  await async function(){
                            if (check_true( (NOT_FOUND_THING===ref_type))) {
                                 return undefined
                            } else if (check_true( (ref_type===THIS_REFERENCE))) {
                                 return ref_type
                            } else if (check_true( ((comps && comps.length)===0))) {
                                 return ref_type
                            } else if (check_true( (((comps && comps.length)===1)&& (ref_type instanceof Object)&& await contains_ques_((comps && comps["0"]),await object_methods(ref_type))))) {
                                 return ref_type[(comps && comps["0"])]
                            } else if (check_true( (ref_type instanceof Function&& await (async function(){
                                let __array_op_rval__49=is_ambiguous_ques_;
                                 if (__array_op_rval__49 instanceof Function){
                                    return await __array_op_rval__49(root_ctx,ref_name) 
                                } else {
                                    return[__array_op_rval__49,root_ctx,ref_name]
                                }
                            })()))) {
                                 return ref_type
                            } else if (check_true( (ref_type instanceof Object))) {
                                 return await (await Environment.get_global("resolve_path"))(comps,ref_type)
                            } else if (check_true( ((typeof ref_type==="object")&& await contains_ques_((comps && comps["0"]),await Object["keys"].call(Object,ref_type))))) {
                                await (async function(){
                                     let __test_condition__50=async function() {
                                         return  ((ref_type==undefined)|| ((comps && comps.length)>0))
                                    };
                                    let __body_ref__51=async function() {
                                         return  ref_type=ref_type[(comps).shift()]
                                    };
                                    let __BREAK__FLAG__=false;
                                    while(await __test_condition__50()) {
                                        await __body_ref__51();
                                         if(__BREAK__FLAG__) {
                                             break;
                                            
                                        }
                                    } ;
                                    
                                })();
                                 return  ref_type
                            } else if (check_true( (ref_type==="objliteral"))) {
                                 return ref_type
                            } else  {
                                await (async function(){
                                    let __array_op_rval__52=get_lisp_ctx_log;
                                     if (__array_op_rval__52 instanceof Function){
                                        return await __array_op_rval__52("symbol not found: ",name,ref_name,ref_type,cannot_be_js_global) 
                                    } else {
                                        return[__array_op_rval__52,"symbol not found: ",name,ref_name,ref_type,cannot_be_js_global]
                                    }
                                })();
                                 return  undefined
                            }
                        } ()
                    }
                };
                get_val=async function(token,ctx) {
                     return  await async function(){
                        if (check_true((token && token["ref"]))) {
                            let comps=((token && token.name)).split(".");
                            ;
                            if (check_true (await verbosity(ctx))){
                                 console.log("get_val: reference: ",await (await Environment.get_global("safe_access"))(token,ctx,sanitize_js_ref_name))
                            };
                            let ref_name=await (async function () {
                                 if (check_true (((await safety_level(ctx)>1)&& ((comps && comps.length)>1)))){
                                      return await (await Environment.get_global("safe_access"))(token,ctx,sanitize_js_ref_name)
                                } else {
                                      return await sanitize_js_ref_name(await (await Environment.get_global("expand_dot_accessor"))((token && token.name),ctx))
                                } 
                            })();
                            ;
                             return  await async function(){
                                if (check_true( (await get_ctx(ctx,"__IN_QUOTEM__")&& await not(await get_ctx(ctx,"__IN_LAMBDA__"))))) {
                                     return await get_ctx(ctx,ref_name)
                                } else if (check_true( (false&& await get_ctx(ctx,"__IN_QUOTEM__")&& await get_ctx(ctx,"__IN_LAMBDA__")))) {
                                     return ("await ctx_access(\""+ ref_name+ "\")")
                                } else  {
                                     return ref_name
                                }
                            } ()
                        } else  {
                             return (token && token["val"])
                        }
                    } ()
                };
                has_lisp_globals=false;
                root_ctx=await new_ctx(((opts && opts["ctx"])));
                tokenize_object=async function(obj,ctx,_path) {
                    let ser=null;
                    ;
                    await (async function(){
                        try /* TRY SIMPLE */ {
                             ser=await JSON.stringify(obj) 
                        } catch(__exception__53) {
                              if (__exception__53 instanceof Error) {
                                 let e=__exception__53;
                                 {
                                    await console.warn("compiler: cannot serialize: ",obj);
                                    await console.error(e);
                                     return  ser=""
                                }
                            } 
                        }
                    })();
                    _path=(_path|| []);
                    if (check_true ((ser==="{}"))){
                         return  {
                            type:"object",ref:false,val:"{}",name:"{}",__token__:true,path:_path
                        }
                    } else {
                          return await (async function() {
                            let __for_body__56=async function(pset) {
                                 return  {
                                    type:"keyval",val:await tokenize(pset,ctx,"path:",await add(_path,(pset && pset["0"]))),ref:false,name:(""+ await (await Environment.get_global("as_lisp"))((pset && pset["0"]))),__token__:true
                                }
                            };
                            let __array__57=[],__elements__55=await (await Environment.get_global("pairs"))(obj);
                            let __BREAK__FLAG__=false;
                            for(let __iter__54 in __elements__55) {
                                __array__57.push(await __for_body__56(__elements__55[__iter__54]));
                                if(__BREAK__FLAG__) {
                                     __array__57.pop();
                                    break;
                                    
                                }
                            }return __array__57;
                             
                        })()
                    }
                };
                tokenize_quote=async function(args,_path) {
                     return  await async function(){
                        if (check_true( ((args && args["0"])==="=:quote"))) {
                             return {
                                type:"arr",__token__:true,source:await (await Environment.get_global("as_lisp"))(args),val:await conj([{
                                    type:"special",val:"=:quote",ref:true,name:"quote",__token__:true
                                }],await args["slice"].call(args,1)),ref:((args instanceof String || typeof args==='string')&& (await length(args)>2)&& await starts_with_ques_("=:",args)),name:null,path:_path
                            }
                        } else if (check_true( ((args && args["0"])==="=:quotem"))) {
                             return {
                                type:"arr",__token__:true,source:await (await Environment.get_global("as_lisp"))(args),val:await conj([{
                                    type:"special",path:await conj(_path,[0]),val:"=:quotem",ref:true,name:"quotem",__token__:true
                                }],await args["slice"].call(args,1)),ref:((args instanceof String || typeof args==='string')&& (await length(args)>2)&& await starts_with_ques_("=:",args)),name:null,path:_path
                            }
                        } else  {
                             return {
                                type:"arr",__token__:true,source:await (await Environment.get_global("as_lisp"))(args),val:await conj([{
                                    type:"special",val:"=:quotel",ref:true,name:"quotel",__token__:true
                                }],await args["slice"].call(args,1)),ref:((args instanceof String || typeof args==='string')&& (await length(args)>2)&& await starts_with_ques_("=:",args)),name:null,path:_path
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
                        await console.error("tokenize: nil ctx passed: ",await clone(args));
                        throw new ReferenceError("nil/undefined ctx passed to tokenize");
                        
                    };
                    if (check_true (((args instanceof Array)&& await not(_suppress_comptime_eval)))){
                        args=await compile_time_eval(ctx,args,_path);
                         await async function(){
                            if (check_true( ((_path && _path.length)>1))) {
                                tobject=await (await Environment.get_global("resolve_path"))(await (await Environment.get_global("chop"))(_path),expanded_tree);
                                if (check_true (tobject)){
                                     await async function(){
                                        tobject[await last(_path)]=args;
                                        return tobject;
                                        
                                    }()
                                }
                            } else if (check_true( ((_path && _path.length)===1))) {
                                 await async function(){
                                    expanded_tree[await first(_path)]=args;
                                    return expanded_tree;
                                    
                                }()
                            } else  {
                                 return expanded_tree=args
                            }
                        } ()
                    };
                     return  await async function(){
                        if (check_true( ((args instanceof String || typeof args==='string')|| await is_number_ques_(args)|| ((args===true)|| (args===false))))) {
                             return await first(await tokenize([args],ctx,_path,true))
                        } else if (check_true( ((args instanceof Array)&& (((args && args["0"])==="=:quotem")|| ((args && args["0"])==="=:quote")|| ((args && args["0"])==="=:quotel"))))) {
                            rval=await tokenize_quote(args,_path);
                             return  rval
                        } else if (check_true( ((args instanceof Array)&& await not(await get_ctx_val(ctx,"__IN_LAMBDA__"))&& ((args && args["0"])==="=:iprogn")))) {
                            rval=await compile_toplevel(args,ctx);
                             return  await tokenize(rval,ctx,_path)
                        } else if (check_true( (await not((args instanceof Array))&& (args instanceof Object)))) {
                             return await first(await tokenize([args],ctx,await add(_path,0)))
                        } else  {
                            if (check_true ((((args && args["0"])==="=:fn")|| ((args && args["0"])==="=:function")|| ((args && args["0"])==="=:=>")))){
                                ctx=await new_ctx(ctx);
                                 await set_ctx(ctx,"__IN_LAMBDA__",true)
                            };
                             return  await (async function() {
                                let __for_body__62=async function(arg) {
                                    idx+=1;
                                    argdetails=await find_in_context(ctx,arg);
                                    argvalue=(argdetails && argdetails["val"]);
                                    argtype=(argdetails && argdetails["type"]);
                                    is_ref=(argdetails && argdetails["ref"]);
                                     return  await async function(){
                                        if (check_true( (await sub_type(arg)==="array"))) {
                                             return {
                                                type:"arr",__token__:true,val:await tokenize(arg,ctx,await add(_path,idx)),ref:is_ref,name:null,path:await add(_path,idx)
                                            }
                                        } else if (check_true( (argtype==="Function"))) {
                                             return {
                                                type:"fun",__token__:true,val:arg,ref:is_ref,name:(""+ await (await Environment.get_global("as_lisp"))(arg)),path:await add(_path,idx)
                                            }
                                        } else if (check_true( (argtype==="AsyncFunction"))) {
                                             return {
                                                type:"asf",__token__:true,val:arg,ref:is_ref,name:(""+ await (await Environment.get_global("as_lisp"))(arg)),path:await add(_path,idx)
                                            }
                                        } else if (check_true( (argtype==="array"))) {
                                             return {
                                                type:"array",__token__:true,val:arg,ref:is_ref,name:(""+ await (await Environment.get_global("as_lisp"))(arg)),path:await add(_path,idx)
                                            }
                                        } else if (check_true( (argtype==="Number"))) {
                                             return {
                                                type:"num",__token__:true,val:argvalue,ref:is_ref,name:(""+ await (await Environment.get_global("as_lisp"))(arg)),path:await add(_path,idx)
                                            }
                                        } else if (check_true( ((argtype==="String")&& is_ref))) {
                                             return {
                                                type:"arg",__token__:true,val:argvalue,ref:is_ref,name:await clean_quoted_reference((""+ await (await Environment.get_global("as_lisp"))(arg))),global:(argdetails && argdetails["global"]),local:(argdetails && argdetails["local"]),path:await add(_path,idx)
                                            }
                                        } else if (check_true( (argtype==="String"))) {
                                             return {
                                                type:"literal",__token__:true,val:argvalue,ref:is_ref,name:await clean_quoted_reference((""+ await (await Environment.get_global("as_lisp"))(arg))),global:(argdetails && argdetails["global"]),path:await add(_path,idx)
                                            }
                                        } else if (check_true( (argtype==="dom"))) {
                                             return {
                                                type:"null",__token__:true,val:null,ref:is_ref,name:await clean_quoted_reference((""+ await (await Environment.get_global("as_lisp"))(arg))),global:(argdetails && argdetails["global"]),path:await add(_path,idx)
                                            }
                                        } else if (check_true( (arg instanceof Object))) {
                                             return  {
                                                type:"objlit",__token__:true,val:await tokenize_object(arg,ctx,await add(_path,idx)),ref:is_ref,name:null,path:await add(_path,idx)
                                            }
                                        } else if (check_true( ((argtype==="literal")&& is_ref&& ((""+ await (await Environment.get_global("as_lisp"))(arg))==="nil")))) {
                                             return {
                                                type:"null",__token__:true,val:null,ref:true,name:"null",path:await add(_path,idx)
                                            }
                                        } else if (check_true( ((argtype==="unbound")&& is_ref&& (null==argvalue)))) {
                                             return {
                                                type:"arg",__token__:true,val:arg,ref:true,name:await clean_quoted_reference((""+ await (await Environment.get_global("as_lisp"))(arg))),path:await add(_path,idx)
                                            }
                                        } else if (check_true( ((argtype==="unbound")&& is_ref))) {
                                             return {
                                                type:await sub_type(argvalue),__token__:true,val:argvalue,ref:true,name:await clean_quoted_reference(await sanitize_js_ref_name((""+ await (await Environment.get_global("as_lisp"))(arg)))),path:await add(_path,idx)
                                            }
                                        } else  {
                                             return {
                                                type:argtype,__token__:true,val:argvalue,ref:is_ref,name:await clean_quoted_reference((""+ await (await Environment.get_global("as_lisp"))(arg))),global:(argdetails && argdetails["global"]),local:(argdetails && argdetails["local"]),path:await add(_path,idx)
                                            }
                                        }
                                    } ()
                                };
                                let __array__63=[],__elements__61=args;
                                let __BREAK__FLAG__=false;
                                for(let __iter__60 in __elements__61) {
                                    __array__63.push(await __for_body__62(__elements__61[__iter__60]));
                                    if(__BREAK__FLAG__) {
                                         __array__63.pop();
                                        break;
                                        
                                    }
                                }return __array__63;
                                 
                            })()
                        }
                    } ()
                };
                comp_time_log=await defclog({
                    prefix:"compile_time_eval",background:"#C0C0C0",color:"darkblue"
                });
                compile_time_eval=async function(ctx,lisp_tree,path) {
                    if (check_true (((lisp_tree instanceof Array)&& (((lisp_tree && lisp_tree["0"]) instanceof String || typeof (lisp_tree && lisp_tree["0"])==='string')&& (await length((lisp_tree && lisp_tree["0"]))>2)&& await starts_with_ques_("=:",(lisp_tree && lisp_tree["0"])))&& await (async function ()  {
                        let it;
                        it=await Environment["symbol_definition"].call(Environment,await (lisp_tree && lisp_tree["0"])["substr"].call((lisp_tree && lisp_tree["0"]),2));
                        if (check_true (it)){
                              return await (await Environment.get_global("resolve_path"))(["eval_when","compile_time"],it)
                        } else {
                              return 
                        }
                    } )()))){
                        let ntree;
                        let precompile_function;
                        ntree=null;
                        precompile_function=await Environment["get_global"].call(Environment,await (lisp_tree && lisp_tree["0"])["substr"].call((lisp_tree && lisp_tree["0"]),2));
                        if (check_true (await verbosity(ctx))){
                             (comp_time_log)(path,"->",await (lisp_tree && lisp_tree["0"])["substr"].call((lisp_tree && lisp_tree["0"]),2),lisp_tree,"to function: ",await lisp_tree["slice"].call(lisp_tree,1))
                        };
                        await (async function(){
                            try /* TRY SIMPLE */ {
                                  return ntree=await (async function(){
                                    let __apply_args__65=await lisp_tree["slice"].call(lisp_tree,1);
                                    return ( precompile_function).apply(this,__apply_args__65)
                                })() 
                            } catch(__exception__64) {
                                  if (__exception__64 instanceof Error) {
                                     let e=__exception__64;
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
                        })();
                        if (check_true ((null==ntree))){
                             (warnings).push(("compile time function "+ await (lisp_tree && lisp_tree["0"])["substr"].call((lisp_tree && lisp_tree["0"]),2)+ " returned nil"))
                        } else {
                            ntree=await do_deferred_splice(ntree);
                            if (check_true (await not((await JSON.stringify(ntree)===await JSON.stringify(lisp_tree))))){
                                 ntree=await compile_time_eval(ctx,ntree,path)
                            };
                            if (check_true (await verbosity(ctx))){
                                 (comp_time_log)(await (lisp_tree && lisp_tree["0"])["substr"].call((lisp_tree && lisp_tree["0"]),2),"<- lisp: ",await (await Environment.get_global("as_lisp"))(ntree))
                            }
                        };
                         return  ntree
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
                    ctx=await new_ctx(ctx);
                    math_op_a=await (async function(){
                        let __targ__68=await first(tokens);
                        if (__targ__68){
                             return(__targ__68)["name"]
                        } 
                    })();
                    math_op=(op_translation[math_op_a]|| math_op_a);
                    idx=0;
                    stmts=null;
                    declaration=await (async function () {
                         if (check_true (((tokens && tokens["1"] && tokens["1"]["name"]) instanceof String || typeof (tokens && tokens["1"] && tokens["1"]["name"])==='string'))){
                              return await get_declarations(ctx,(tokens && tokens["1"] && tokens["1"]["name"]),await not((tokens && tokens["1"] && tokens["1"]["ref"])))
                        } else {
                              return null
                        } 
                    })();
                    symbol_ctx_val=await (async function () {
                         if (check_true (((tokens && tokens["1"] && tokens["1"]["ref"])&& ((tokens && tokens["1"] && tokens["1"]["name"]) instanceof String || typeof (tokens && tokens["1"] && tokens["1"]["name"])==='string')))){
                              return await get_ctx_val(ctx,(tokens && tokens["1"] && tokens["1"]["name"]))
                        } 
                    })();
                    is_overloaded=false;
                    token=null;
                    add_operand=async function() {
                        if (check_true (((idx>1)&& (idx<((tokens && tokens.length)- 0))))){
                            (acc).push(math_op);
                             return  (acc).push(" ")
                        }
                    };
                    acc=[{
                        ctype:"expression"
                    }];
                    await set_ctx(ctx,"__COMP_INFIX_OPS__",true);
                    if (check_true (((symbol_ctx_val instanceof Array)&& (symbol_ctx_val && symbol_ctx_val["0"] && symbol_ctx_val["0"]["ctype"])))){
                         symbol_ctx_val=(symbol_ctx_val && symbol_ctx_val["0"] && symbol_ctx_val["0"]["ctype"])
                    };
                    if (check_true (((((declaration && declaration["type"])===Array)|| ((declaration && declaration["type"])===Object)|| (symbol_ctx_val==="objliteral")|| (symbol_ctx_val===Expression)|| (symbol_ctx_val===ArgumentType)|| ((tokens && tokens["1"] && tokens["1"]["type"])==="objlit")|| ((tokens && tokens["1"] && tokens["1"]["type"])==="arr"))&& (math_op==="+")))){
                         is_overloaded=true
                    };
                    if (check_true (is_overloaded)){
                        await async function(){
                            tokens[0]={
                                type:"function",val:await add("=:","add"),name:"add",ref:true
                            };
                            return tokens;
                            
                        }();
                        stmts=await compile(tokens,ctx);
                        stmts=await wrap_assignment_value(stmts,ctx);
                         return  stmts
                    } else {
                        (acc).push("(");
                        await (async function(){
                             let __test_condition__70=async function() {
                                 return  (idx<((tokens && tokens.length)- 1))
                            };
                            let __body_ref__71=async function() {
                                idx+=1;
                                token=tokens[idx];
                                await add_operand();
                                 return  (acc).push(await wrap_assignment_value(await compile(token,ctx),ctx))
                            };
                            let __BREAK__FLAG__=false;
                            while(await __test_condition__70()) {
                                await __body_ref__71();
                                 if(__BREAK__FLAG__) {
                                     break;
                                    
                                }
                            } ;
                            
                        })();
                        (acc).push(")");
                         return  acc
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
                    complicated=await (async function(){
                        let __array_op_rval__72=is_complex_ques_;
                         if (__array_op_rval__72 instanceof Function){
                            return await __array_op_rval__72((token && token["val"])) 
                        } else {
                            return[__array_op_rval__72,(token && token["val"])]
                        }
                    })();
                    target=await (async function () {
                         if (check_true (complicated)){
                              return await compile_wrapper_fn((token && token["val"]),ctx)
                        } else {
                              return await compile(token,ctx)
                        } 
                    })();
                    target_reference=await gen_temp_name("target_obj");
                    idx=1;
                    ;
                    await (async function() {
                        let __for_body__75=async function(t) {
                             return  (wrapper).push(t)
                        };
                        let __array__76=[],__elements__74=[(preamble && preamble["0"])," ",(preamble && preamble["1"])," ",(preamble && preamble["3"]),"function","()","{"];
                        let __BREAK__FLAG__=false;
                        for(let __iter__73 in __elements__74) {
                            __array__76.push(await __for_body__75(__elements__74[__iter__73]));
                            if(__BREAK__FLAG__) {
                                 __array__76.pop();
                                break;
                                
                            }
                        }return __array__76;
                         
                    })();
                    if (check_true (await not((target instanceof String || typeof target==='string')))){
                         await (async function() {
                            let __for_body__79=async function(t) {
                                 return  (wrapper).push(t)
                            };
                            let __array__80=[],__elements__78=["let"," ",target_reference,"=",target,";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__77 in __elements__78) {
                                __array__80.push(await __for_body__79(__elements__78[__iter__77]));
                                if(__BREAK__FLAG__) {
                                     __array__80.pop();
                                    break;
                                    
                                }
                            }return __array__80;
                             
                        })()
                    } else {
                         target_reference=target
                    };
                    await (async function(){
                         let __test_condition__81=async function() {
                             return  (idx<((tokens && tokens.length)- 1))
                        };
                        let __body_ref__82=async function() {
                            idx+=1;
                            (acc).push(target_reference);
                            token=tokens[idx];
                            (acc).push("[");
                            stmt=await wrap_assignment_value(await compile(token,ctx),ctx);
                            (acc).push(stmt);
                            (acc).push("]");
                            idx+=1;
                            (acc).push("=");
                            token=tokens[idx];
                            if (check_true ((null==token)))throw new SyntaxError("set_prop: odd number of arguments");
                            ;
                            stmt=await wrap_assignment_value(await compile(token,ctx),ctx);
                            (acc).push(stmt);
                             return  (acc).push(";")
                        };
                        let __BREAK__FLAG__=false;
                        while(await __test_condition__81()) {
                            await __body_ref__82();
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
                     return  wrapper
                };
                compile_prop=async function(tokens,ctx) {
                    if (check_true (await not(((tokens && tokens.length)===3)))){
                        throw new SyntaxError("prop requires exactly 2 arguments");
                        
                    } else {
                        let acc;
                        let target;
                        let target_val;
                        let preamble;
                        let idx_key;
                        acc=[];
                        target=await wrap_assignment_value(await compile(await second(tokens),ctx),ctx);
                        target_val=null;
                        preamble=await calling_preamble(ctx);
                        idx_key=await wrap_assignment_value(await compile(tokens[2],ctx),ctx);
                        ;
                        if (check_true ((await safety_level(ctx)>1))){
                              return await async function(){
                                if (check_true( (target instanceof String || typeof target==='string'))) {
                                     return  await (async function(){
                                        let __array_op_rval__83=target;
                                         if (__array_op_rval__83 instanceof Function){
                                            return await __array_op_rval__83("[",idx_key,"]") 
                                        } else {
                                            return[__array_op_rval__83,"[",idx_key,"]"]
                                        }
                                    })()
                                } else  {
                                    target_val=await gen_temp_name("targ");
                                     return  [(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()","{","let"," ",target_val,"=",target,";","if"," ","(",target_val,")","{"," ","return","(",target_val,")","[",idx_key,"]","}"," ","}",")","()"]
                                }
                            } ()
                        } else {
                              return ["(",target,")","[",idx_key,"]"]
                        }
                    }
                };
                compile_elem=async function(token,ctx) {
                    let rval;
                    rval=null;
                    if (check_true ((await (async function(){
                        let __array_op_rval__84=is_complex_ques_;
                         if (__array_op_rval__84 instanceof Function){
                            return await __array_op_rval__84((token && token["val"])) 
                        } else {
                            return[__array_op_rval__84,(token && token["val"])]
                        }
                    })()|| (((token && token["val"]) instanceof Array)&& ((token && token["val"] && token["val"]["0"] && token["val"]["0"]["name"])==="if"))))){
                         rval=await compile_wrapper_fn(token,ctx)
                    } else {
                         rval=await compile(token,ctx)
                    };
                    if (check_true (await not((rval instanceof Array)))){
                         rval=await (async function(){
                            let __array_op_rval__85=rval;
                             if (__array_op_rval__85 instanceof Function){
                                return await __array_op_rval__85() 
                            } else {
                                return[__array_op_rval__85]
                            }
                        })()
                    };
                     return  rval
                };
                inline_log=await (async function () {
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
                            stmt=await wrap_assignment_value(await compile(token,ctx),ctx);
                             return  (args).push(stmt)
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
                         (inline_log)("args: ",args)
                    };
                    if (check_true (await (async function(){
                        let __targ__90=(Environment && Environment["inlines"]);
                        if (__targ__90){
                             return(__targ__90)[(tokens && tokens["0"] && tokens["0"]["name"])]
                        } 
                    })())){
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
                                return[__array_op_rval__92,args,ctx]
                            }
                        })()
                    } else throw new ReferenceError(("no source for named lib function "+ (tokens && tokens["0"] && tokens["0"]["name"])));
                    ;
                     return  rval
                };
                compile_push=async function(tokens,ctx) {
                    let acc;
                    let place;
                    let thing;
                    acc=[];
                    place=await compile_elem((tokens && tokens["1"]),ctx);
                    thing=await compile_elem((tokens && tokens["2"]),ctx);
                     return  await (async function(){
                        let __array_op_rval__93=place;
                         if (__array_op_rval__93 instanceof Function){
                            return await __array_op_rval__93(".push","(",thing,")") 
                        } else {
                            return[__array_op_rval__93,".push","(",thing,")"]
                        }
                    })()
                };
                compile_list=async function(tokens,ctx) {
                    let acc;
                    let compiled_values;
                    acc=["["];
                    compiled_values=[];
                    await (async function() {
                        let __for_body__96=async function(t) {
                             return  (compiled_values).push(await wrap_assignment_value(await compile(t,ctx),ctx))
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
                     return  acc
                };
                compile_typeof=async function(tokens,ctx) {
                    let local_details=await (async function () {
                         if (check_true ((tokens && tokens["1"] && tokens["1"]["ref"]))){
                              return await get_ctx_val(ctx,(tokens && tokens["1"] && tokens["1"]["name"]))
                        } else {
                              return null
                        } 
                    })();
                    ;
                    let fully_qualified=await (async function () {
                         if (check_true (((tokens && tokens["1"] && tokens["1"]["name"])&& await contains_ques_("/",(tokens && tokens["1"] && tokens["1"]["name"]))))){
                              return true
                        } else {
                              return false
                        } 
                    })();
                    ;
                    if (check_true (await verbosity(ctx))){
                         await console.log("compile_typeof -> ",tokens)
                    };
                    if (check_true (((tokens && tokens.length)<2))){
                        throw new SyntaxError("typeof requires 1 argument");
                        
                    };
                     return  await async function(){
                        if (check_true( ((tokens && tokens["1"] && tokens["1"]["ref"])&& local_details))) {
                             return ["typeof"," ",await compile((tokens && tokens["1"]),ctx)]
                        } else if (check_true( ((tokens && tokens["1"] && tokens["1"]["ref"])&& await get_lisp_ctx((tokens && tokens["1"] && tokens["1"]["name"]))))) {
                             return ["typeof"," ",await compile((tokens && tokens["1"]),ctx)]
                        } else if (check_true((tokens && tokens["1"] && tokens["1"]["ref"]))) {
                             return ["(","typeof"," ","(","function","() { let __tval=",await compile_lisp_scoped_reference((tokens && tokens["1"] && tokens["1"]["name"]),ctx,true),"; if (__tval === ReferenceError) return undefined; else return __tval; }",")()",")"]
                        } else  {
                             return ["typeof"," ",await compile_elem((tokens && tokens["1"]),ctx)]
                        }
                    } ()
                };
                compile_instanceof=async function(tokens,ctx) {
                    let acc;
                    acc=[];
                    if (check_true (((tokens instanceof Array)&& ((tokens && tokens.length)===3)))){
                        let __array_arg__100=(async function() {
                            if (check_true (await (async function(){
                                let __array_op_rval__98=is_complex_ques_;
                                 if (__array_op_rval__98 instanceof Function){
                                    return await __array_op_rval__98((tokens && tokens["1"])) 
                                } else {
                                    return[__array_op_rval__98,(tokens && tokens["1"])]
                                }
                            })())){
                                  return await compile_wrapper_fn((tokens && tokens["1"]),ctx)
                            } else {
                                  return await compile((tokens && tokens["1"]),ctx)
                            }
                        } );
                        let __array_arg__101=(async function() {
                            if (check_true (await (async function(){
                                let __array_op_rval__99=is_complex_ques_;
                                 if (__array_op_rval__99 instanceof Function){
                                    return await __array_op_rval__99((tokens && tokens["1"])) 
                                } else {
                                    return[__array_op_rval__99,(tokens && tokens["1"])]
                                }
                            })())){
                                  return await compile_wrapper_fn((tokens && tokens["2"]),ctx)
                            } else {
                                  return await compile((tokens && tokens["2"]),ctx)
                            }
                        } );
                        return ["(",await __array_arg__100()," ","instanceof"," ",await __array_arg__101(),")"]
                    } else throw new SyntaxError("instanceof requires 2 arguments");
                    
                };
                compile_compare=async function(tokens,ctx) {
                    let acc;
                    let ops;
                    let __operator__102= async function(){
                        return ops[await (async function(){
                            let __targ__104=await first(tokens);
                            if (__targ__104){
                                 return(__targ__104)["name"]
                            } 
                        })()]
                    };
                    let left;
                    let right;
                    {
                        acc=[{
                            ctype:"expression"
                        }];
                        ctx=await new_ctx(ctx);
                        ops=await ( async function(){
                            let __obj__103=new Object();
                            __obj__103["eq"]="==";
                            __obj__103["=="]="===";
                            __obj__103["<"]="<";
                            __obj__103[">"]=">";
                            __obj__103["gt"]=">";
                            __obj__103["lt"]="<";
                            __obj__103["<="]="<=";
                            __obj__103[">="]=">=";
                            return __obj__103;
                            
                        })();
                        let operator=await __operator__102();
                        ;
                        left=tokens[1];
                        right=tokens[2];
                        if (check_true (((tokens && tokens.length)<3))){
                            throw new SyntaxError("comparison operation requires 2 arguments");
                            
                        };
                        await set_ctx(ctx,"__COMP_INFIX_OPS__",true);
                        (acc).push("(");
                        (acc).push(await compile(left,ctx));
                        (acc).push(operator);
                        (acc).push(await compile(right,ctx));
                        (acc).push(")");
                         return  acc
                    }
                };
                compile_assignment=async function(tokens,ctx) {
                    let acc;
                    let assignment_operator;
                    let token;
                    let assignment_value;
                    let assignment_type;
                    let wrap_as_function_ques_;
                    let preamble;
                    let target;
                    let target_details;
                    let target_location_compile_time;
                    acc=[];
                    assignment_operator=await (async function(){
                        let __targ__105=await first(tokens);
                        if (__targ__105){
                             return(__targ__105)["name"]
                        } 
                    })();
                    token=await second(tokens);
                    assignment_value=null;
                    assignment_type=null;
                    wrap_as_function_ques_=null;
                    preamble=await calling_preamble(ctx);
                    target=await sanitize_js_ref_name(await async function(){
                        if (check_true((token && token["ref"]))) {
                             return (token && token["name"])
                        } else  {
                             throw new SyntaxError(("assignment: invalid target: "+ (token && token["name"])));
                            
                        }
                    } ());
                    target_details=await get_declaration_details(ctx,target);
                    target_location_compile_time=await async function(){
                        if (check_true((target_details && target_details["is_argument"]))) {
                             return "local"
                        } else if (check_true((target_details && target_details["declared_global"]))) {
                             return "global"
                        } else  {
                             return "local"
                        }
                    } ();
                    ;
                    await (await Environment.get_global("compiler_syntax_validation"))("compile_assignment",tokens,errors,ctx,expanded_tree);
                    await unset_ambiguous(ctx,target);
                    await async function(){
                        ctx["in_assignment"]=true;
                        return ctx;
                        
                    }();
                    assignment_value=await compile((tokens && tokens["2"]),ctx);
                    if (check_true (((assignment_value instanceof Array)&& ((assignment_value && assignment_value["0"]) instanceof Object)&& (assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])))){
                         assignment_type=await map_ctype_to_value((assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"]),assignment_value)
                    } else {
                        await set_ambiguous(ctx,target);
                         assignment_type=UnknownType
                    };
                    assignment_value=await wrap_assignment_value(assignment_value,ctx);
                    if (check_true ((target_location_compile_time==="local"))){
                        await set_ctx(ctx,target,assignment_type);
                        (acc).push(target);
                        (acc).push("=");
                         (acc).push(assignment_value)
                    } else {
                         await (async function() {
                            let __for_body__109=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__110=[],__elements__108=[{
                                ctype:"statement"
                            },(preamble && preamble["0"])," ","Environment",".","set_global","(","\"",target,"\"",",",assignment_value,")"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__107 in __elements__108) {
                                __array__110.push(await __for_body__109(__elements__108[__iter__107]));
                                if(__BREAK__FLAG__) {
                                     __array__110.pop();
                                    break;
                                    
                                }
                            }return __array__110;
                             
                        })()
                    };
                    await async function(){
                        ctx["in_assignment"]=false;
                        return ctx;
                        
                    }();
                    if (check_true ((target_location_compile_time==="local"))){
                         await set_ctx(ctx,target,assignment_type)
                    };
                     return  acc
                };
                needs_return_ques_=async function(stmts,ctx) {
                    if (check_true ((await length(stmts)>0))){
                        let final_stmt;
                        let inst;
                        let clog;
                        let flattened;
                        final_stmt=await last(stmts);
                        inst=null;
                        clog=await (async function () {
                             if (check_true ((opts && opts["quiet_mode"]))){
                                  return log
                            } else {
                                  return await defclog({
                                    prefix:("needs_return ("+ (ctx && ctx["block_id"])+ ")"),background:"#C0C0C0",color:"darkgreen"
                                })
                            } 
                        })();
                        flattened=null;
                         return  await async function(){
                            if (check_true( (null==final_stmt))) {
                                 return  false
                            } else if (check_true( (await not((final_stmt instanceof Array))&& await not(("}"===final_stmt))))) {
                                 return true
                            } else  {
                                flattened=await flatten(final_stmt);
                                await async function(){
                                    if (check_true( ((await first(flattened) instanceof Object)&& await (async function(){
                                        let __targ__112=await first(flattened);
                                        if (__targ__112){
                                             return(__targ__112)["ctype"]
                                        } 
                                    })()))) {
                                         return inst=await first(flattened)
                                    } else if (check_true( ((await first(flattened) instanceof String || typeof await first(flattened)==='string')&& await starts_with_ques_("/*",await first(flattened))&& (await second(flattened) instanceof Object)&& await (async function(){
                                        let __targ__113=await second(flattened);
                                        if (__targ__113){
                                             return(__targ__113)["ctype"]
                                        } 
                                    })()))) {
                                         return inst=await second(flattened)
                                    }
                                } ();
                                 return  await async function(){
                                    if (check_true( (inst&& ((inst && inst["ctype"])==="objliteral")))) {
                                         return true
                                    } else if (check_true( (inst&& (((inst && inst["ctype"])==="ifblock")|| ((inst && inst["ctype"])==="letblock")|| ((inst && inst["ctype"])==="block")|| ((inst && inst["ctype"])==="assignment")|| ((inst && inst["ctype"])==="return"))))) {
                                         return false
                                    } else if (check_true( ((await first(flattened)==="{")))) {
                                         return false
                                    } else if (check_true( await contains_ques_(await first(flattened),["__BREAK__FLAG__","let","if","return","throw"]))) {
                                         return false
                                    } else if (check_true( (null==await first(flattened)))) {
                                         return false
                                    } else  {
                                         return  true
                                    }
                                } ()
                            }
                        } ()
                    } else {
                          return false
                    }
                };
                top_level_log=await defclog({
                    prefix:"top-level",color:"darkgreen",background:"#300010"
                });
                compile_toplevel=async function(lisp_tree,ctx,block_options) {
                    if (check_true (await get_ctx_val(ctx,"__IN_LAMBDA__")))throw new EvalError("Compiler attempt to compile top-level in lambda (most likely a bug)");
                     else {
                        {
                            let idx;
                            let rval;
                            let __tokens__114= async function(){
                                return null
                            };
                            let stmt;
                            let num_non_return_statements;
                            {
                                idx=0;
                                rval=null;
                                let tokens=await __tokens__114();
                                ;
                                stmt=null;
                                num_non_return_statements=(await length(lisp_tree)- 2);
                                ctx=await (async function () {
                                     if (check_true ((block_options && block_options["no_scope_boundary"]))){
                                          return ctx
                                    } else {
                                          return await new_ctx(ctx)
                                    } 
                                })();
                                await (async function(){
                                     let __test_condition__115=async function() {
                                         return  (idx<num_non_return_statements)
                                    };
                                    let __body_ref__116=async function() {
                                        idx+=1;
                                        await set_ctx(ctx,"__TOP_LEVEL__",true);
                                        if (check_true (await verbosity(ctx))){
                                            await console.log("");
                                             (top_level_log)((""+ idx+ "/"+ num_non_return_statements),"->",await (await Environment.get_global("as_lisp"))(lisp_tree[idx]))
                                        };
                                        tokens=await tokenize(lisp_tree[idx],ctx);
                                        stmt=await compile(tokens,ctx);
                                        rval=await wrap_and_run(stmt,ctx,{
                                            bind_mode:true
                                        });
                                        if (check_true (await verbosity(ctx))){
                                            (top_level_log)((""+ idx+ "/"+ num_non_return_statements),"compiled <- ",await (await Environment.get_global("as_lisp"))(stmt));
                                             return  (top_level_log)((""+ idx+ "/"+ num_non_return_statements),"<-",await (await Environment.get_global("as_lisp"))(rval))
                                        }
                                    };
                                    let __BREAK__FLAG__=false;
                                    while(await __test_condition__115()) {
                                        await __body_ref__116();
                                         if(__BREAK__FLAG__) {
                                             break;
                                            
                                        }
                                    } ;
                                    
                                })();
                                 return  lisp_tree[(idx+ 1)]
                            }
                        }
                    }
                };
                compile_block=async function(tokens,ctx,block_options) {
                    let acc;
                    let block_id;
                    let clog;
                    let token;
                    let last_stmt;
                    let is_first_level;
                    let return_last;
                    let stmt;
                    let stmt_ctype;
                    let lambda_block;
                    let stmts;
                    let idx;
                    acc=[];
                    block_id=(((block_options && block_options.name)&& await add((block_options && block_options.name),(blk_counter=blk_counter+1)))|| (blk_counter=blk_counter+1));
                    clog=await (async function () {
                         if (check_true (quiet_mode)){
                              return log
                        } else {
                              return await defclog({
                                prefix:("compile_block ("+ block_id+ "):"),background:"#404080",color:"white"
                            })
                        } 
                    })();
                    ctx=await (async function () {
                         if (check_true ((block_options && block_options["no_scope_boundary"]))){
                              return ctx
                        } else {
                              return await new_ctx(ctx)
                        } 
                    })();
                    token=null;
                    last_stmt=null;
                    is_first_level=false;
                    return_last=(ctx && ctx["return_last_value"]);
                    stmt=null;
                    stmt_ctype=null;
                    lambda_block=false;
                    stmts=[];
                    idx=0;
                    if (check_true ((null==ctx))){
                        throw new ReferenceError("undefined ctx passed to compile block");
                        
                    };
                    if (check_true (needs_first_level)){
                        is_first_level=true;
                        await set_ctx(ctx,"has_first_level",true);
                         needs_first_level=false
                    };
                    if (check_true ((opts && opts["include_source"]))){
                        if (check_true (((tokens && tokens["path"])&& ((tokens && tokens["path"] && tokens["path"]["length"])>0)))){
                             (acc).push(await source_comment(tokens))
                        }
                    };
                    await async function(){
                        ctx["block_id"]=block_id;
                        return ctx;
                        
                    }();
                    if (check_true ((await get_ctx_val(ctx,"__LAMBDA_STEP__")===-1))){
                        lambda_block=true;
                         await (await Environment.get_global("setf_ctx"))(ctx,"__LAMBDA_STEP__",((tokens && tokens.length)- 1))
                    };
                    if (check_true (await not((block_options && block_options["no_scope_boundary"])))){
                         (acc).push("{")
                    };
                    if (check_true (is_first_level)){
                         (acc).push(first_level_setup)
                    };
                    await (async function(){
                         let __test_condition__118=async function() {
                             return  (idx<((tokens && tokens.length)- 1))
                        };
                        let __body_ref__119=async function() {
                            idx+=1;
                            token=tokens[idx];
                            if (check_true ((idx===((tokens && tokens.length)- 1)))){
                                 await async function(){
                                    ctx["final_block_statement"]=true;
                                    return ctx;
                                    
                                }()
                            };
                            await async function(){
                                ctx["block_step"]=((tokens && tokens.length)- 1- idx);
                                return ctx;
                                
                            }();
                            if (check_true (lambda_block)){
                                 await set_ctx(ctx,"__LAMBDA_STEP__",((tokens && tokens.length)- 1- idx))
                            };
                            if (check_true ((((token && token["type"])==="arr")&& ((token && token["val"] && token["val"]["0"] && token["val"]["0"]["name"])==="return")))){
                                (stmts).push(await compile_return((token && token["val"]),ctx));
                                 stmt=[]
                            } else {
                                if (check_true ((((token && token["val"] && token["val"]["0"] && token["val"]["0"]["name"])==="declare")&& (block_options && block_options["ignore_declarations"])))){
                                     stmt={
                                        ignored:"declare"
                                    }
                                } else {
                                     stmt=await compile(token,ctx)
                                }
                            };
                            await async function(){
                                if (check_true( (((stmt && stmt["0"])===break_out)&& ((stmt && stmt["1"])==="=")&& ((stmt && stmt["2"])==="true")))) {
                                     return  true
                                } else  {
                                     return true
                                }
                            } ();
                            await (await Environment.get_global("assert"))(await not((stmt===undefined)),"compile_block: returned stmt is undefined");
                            stmt_ctype=(((ctx && ctx["block_step"])>0)&& (await first(stmt) instanceof Object)&& await (async function(){
                                let __targ__122=await first(stmt);
                                if (__targ__122){
                                     return(__targ__122)["ctype"]
                                } 
                            })());
                            await async function(){
                                if (check_true( (stmt_ctype==="no_return"))) {
                                     return (stmts).push(stmt)
                                } else if (check_true( (stmt_ctype==="AsyncFunction"))) {
                                    (stmts).push({
                                        mark:"block<-async"
                                    });
                                     return  (stmts).push(stmt)
                                } else if (check_true( (stmt_ctype==="block"))) {
                                     return  (stmts).push(await wrap_assignment_value(stmt,ctx))
                                } else  {
                                    (stmts).push({
                                        mark:"standard"
                                    });
                                     return  (stmts).push(stmt)
                                }
                            } ();
                            if (check_true ((idx<((tokens && tokens.length)- 1)))){
                                 return  (stmts).push(";")
                            }
                        };
                        let __BREAK__FLAG__=false;
                        while(await __test_condition__118()) {
                            await __body_ref__119();
                             if(__BREAK__FLAG__) {
                                 break;
                                
                            }
                        } ;
                        
                    })();
                    await async function(){
                        if (check_true( (await not((block_options && block_options["suppress_return"]))&& await not((ctx && ctx["suppress_return"]))&& (await (async function(){
                            let __array_op_rval__123=needs_return_ques_;
                             if (__array_op_rval__123 instanceof Function){
                                return await __array_op_rval__123(stmts,ctx) 
                            } else {
                                return[__array_op_rval__123,stmts,ctx]
                            }
                        })()|| ((idx>1)&& await (async function(){
                            let __array_op_rval__124=needs_return_ques_;
                             if (__array_op_rval__124 instanceof Function){
                                return await __array_op_rval__124(stmts,ctx) 
                            } else {
                                return[__array_op_rval__124,stmts,ctx]
                            }
                        })()))))) {
                            last_stmt=(stmts).pop();
                            if (check_true (await not(((last_stmt && last_stmt["0"] && last_stmt["0"]["mark"])==="no_return")))){
                                (stmts).push({
                                    mark:"final-return",if_id:await get_ctx_val(ctx,"__IF_BLOCK__"),block_step:(ctx && ctx["block_step"]),lambda_step:await get_ctx_val(ctx,"__LAMBDA_STEP__")
                                });
                                 (stmts).push(" ")
                            };
                             return  (stmts).push(last_stmt)
                        } else if (check_true( (await (async function(){
                            let __array_op_rval__125=needs_return_ques_;
                             if (__array_op_rval__125 instanceof Function){
                                return await __array_op_rval__125(stmts,ctx) 
                            } else {
                                return[__array_op_rval__125,stmts,ctx]
                            }
                        })()|| ((idx>1)&& await (async function(){
                            let __array_op_rval__126=needs_return_ques_;
                             if (__array_op_rval__126 instanceof Function){
                                return await __array_op_rval__126(stmts,ctx) 
                            } else {
                                return[__array_op_rval__126,stmts,ctx]
                            }
                        })())))) {
                            last_stmt=(stmts).pop();
                            (stmts).push({
                                mark:"block-end",if_id:await get_ctx_val(ctx,"__IF_BLOCK__"),block_step:(ctx && ctx["block_step"]),lambda_step:await get_ctx_val(ctx,"__LAMBDA_STEP__")
                            });
                            (stmts).push(" ");
                             return  (stmts).push(last_stmt)
                        }
                    } ();
                    (acc).push(stmts);
                    if (check_true (await not((block_options && block_options["no_scope_boundary"])))){
                         (acc).push("}")
                    };
                    (acc).unshift({
                        ctype:"block"
                    });
                     return  acc
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
                    let __check_needs_wrap__127= async function(){
                        return async function(stmts) {
                            let fst;
                            fst=(((stmts instanceof Array)&& await first(stmts)&& (await first(stmts) instanceof Object)&& await (async function(){
                                let __targ__128=await first(stmts);
                                if (__targ__128){
                                     return(__targ__128)["ctype"]
                                } 
                            })()&& await async function(){
                                if (check_true( (await (async function(){
                                    let __targ__129=await first(stmts);
                                    if (__targ__129){
                                         return(__targ__129)["ctype"]
                                    } 
                                })() instanceof String || typeof await (async function(){
                                    let __targ__129=await first(stmts);
                                    if (__targ__129){
                                         return(__targ__129)["ctype"]
                                    } 
                                })()==='string'))) {
                                     return await (async function(){
                                        let __targ__130=await first(stmts);
                                        if (__targ__130){
                                             return(__targ__130)["ctype"]
                                        } 
                                    })()
                                } else  {
                                     return await sub_type(await (async function(){
                                        let __targ__131=await first(stmts);
                                        if (__targ__131){
                                             return(__targ__131)["ctype"]
                                        } 
                                    })())
                                }
                            } ())|| "");
                             return  await async function(){
                                if (check_true( await contains_ques_("block",fst))) {
                                     return true
                                } else  {
                                     return false
                                }
                            } ()
                        }
                    };
                    let assignment_value;
                    {
                        target=await clean_quoted_reference(await sanitize_js_ref_name((tokens && tokens["1"] && tokens["1"]["name"])));
                        wrap_as_function_ques_=null;
                        ctx_details=null;
                        allocation_type=await (async function () {
                             if (check_true ((opts && opts["constant"]))){
                                  return "const"
                            } else {
                                  return "let"
                            } 
                        })();
                        assignment_type=null;
                        let check_needs_wrap=await __check_needs_wrap__127();
                        ;
                        assignment_value=null;
                        assignment_value=await (async function ()  {
                             return  await compile((tokens && tokens["2"]),ctx)
                        } )();
                        ctx_details=await get_declaration_details(ctx,target);
                        assignment_type=await add(new Object(),ctx_details,await get_declarations(ctx,target));
                        await async function(){
                            if (check_true( ((assignment_value instanceof Array)&& ((assignment_value && assignment_value["0"]) instanceof Object)&& (assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])))) {
                                await set_ctx(ctx,target,await map_ctype_to_value((assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"]),assignment_value));
                                 return  assignment_value=await wrap_assignment_value(assignment_value,ctx)
                            } else if (check_true( (assignment_type && assignment_type["value"]) instanceof Function)) {
                                 return await set_ctx(ctx,target,(assignment_type && assignment_type["value"]))
                            } else  {
                                 return await set_ctx(ctx,target,assignment_value)
                            }
                        } ();
                        if (check_true ((ctx && ctx["defvar_eval"]))){
                            await (await Environment.get_global("delete_prop"))(ctx,"defvar_eval");
                             return  [{
                                ctype:"assignment"
                            },allocation_type," ",target,"=",assignment_value,"()",";"]
                        } else {
                            let __array_arg__132=(async function() {
                                if (check_true (((ctx_details && ctx_details["is_argument"])&& ((ctx_details && ctx_details["levels_up"])===1)))){
                                      return ""
                                } else {
                                      return (allocation_type+ " ")
                                }
                            } );
                            return [{
                                ctype:"assignment"
                            },await __array_arg__132(),"",target,"=",[assignment_value],";"]
                        }
                    }
                };
                get_declaration_details=async function(ctx,symname,_levels_up) {
                     return  await async function(){
                        if (check_true( (await (async function(){
                            let __targ__133=(ctx && ctx["scope"]);
                            if (__targ__133){
                                 return(__targ__133)[symname]
                            } 
                        })()&& ctx["lambda_scope"]))) {
                             return {
                                name:symname,is_argument:true,levels_up:(_levels_up|| 0),value:await (async function(){
                                    let __targ__134=(ctx && ctx["scope"]);
                                    if (__targ__134){
                                         return(__targ__134)[symname]
                                    } 
                                })(),declared_global:await (async function(){
                                    if (check_true (await (async function(){
                                        let __targ__135=(root_ctx && root_ctx["defined_lisp_globals"]);
                                        if (__targ__135){
                                             return(__targ__135)[symname]
                                        } 
                                    })())){
                                          return true
                                    } else {
                                          return false
                                    }
                                })()
                            }
                        } else if (check_true( await (async function(){
                            let __targ__136=(ctx && ctx["scope"]);
                            if (__targ__136){
                                 return(__targ__136)[symname]
                            } 
                        })())) {
                             return {
                                name:symname,is_argument:false,levels_up:(_levels_up|| 0),value:await (async function(){
                                    let __targ__137=(ctx && ctx["scope"]);
                                    if (__targ__137){
                                         return(__targ__137)[symname]
                                    } 
                                })(),declarations:await get_declarations(ctx,symname),declared_global:await (async function(){
                                    if (check_true (await (async function(){
                                        let __targ__138=(root_ctx && root_ctx["defined_lisp_globals"]);
                                        if (__targ__138){
                                             return(__targ__138)[symname]
                                        } 
                                    })())){
                                          return true
                                    } else {
                                          return false
                                    }
                                })()
                            }
                        } else if (check_true( ((ctx["parent"]==null)&& await (async function(){
                            let __targ__139=(root_ctx && root_ctx["defined_lisp_globals"]);
                            if (__targ__139){
                                 return(__targ__139)[symname]
                            } 
                        })()))) {
                             return {
                                name:symname,is_argument:false,levels_up:(_levels_up|| 0),value:await (async function(){
                                    let __targ__140=(ctx && ctx["scope"]);
                                    if (__targ__140){
                                         return(__targ__140)[symname]
                                    } 
                                })(),declarations:await get_declarations(ctx,symname),declared_global:true
                            }
                        } else if (check_true((ctx && ctx["parent"]))) {
                             return await get_declaration_details((ctx && ctx["parent"]),symname,((_levels_up&& await add(_levels_up,1))|| 1))
                        } else if (check_true( await not((NOT_FOUND_THING===await Environment["get_global"].call(Environment,symname,NOT_FOUND_THING))))) {
                             return {
                                name:symname,is_argument:false,levels_up:(_levels_up|| 0),value:await Environment["get_global"].call(Environment,symname),declared_global:true
                            }
                        }
                    } ()
                };
                wrap_assignment_value=async function(stmts,ctx) {
                    let fst;
                    let preamble;
                    fst=(""+ (((stmts instanceof Array)&& await first(stmts)&& (await first(stmts) instanceof Object)&& await (async function(){
                        let __targ__141=await first(stmts);
                        if (__targ__141){
                             return(__targ__141)["ctype"]
                        } 
                    })()&& await async function(){
                        if (check_true( (await (async function(){
                            let __targ__142=await first(stmts);
                            if (__targ__142){
                                 return(__targ__142)["ctype"]
                            } 
                        })() instanceof String || typeof await (async function(){
                            let __targ__142=await first(stmts);
                            if (__targ__142){
                                 return(__targ__142)["ctype"]
                            } 
                        })()==='string'))) {
                             return await (async function(){
                                let __targ__143=await first(stmts);
                                if (__targ__143){
                                     return(__targ__143)["ctype"]
                                } 
                            })()
                        } else  {
                             return await sub_type(await (async function(){
                                let __targ__144=await first(stmts);
                                if (__targ__144){
                                     return(__targ__144)["ctype"]
                                } 
                            })())
                        }
                    } ())|| ""));
                    preamble=await calling_preamble(ctx);
                    ;
                     return  await async function(){
                        if (check_true( ("ifblock"===fst))) {
                             return [(preamble && preamble["2"]),{
                                mark:"wrap_assignment_value"
                            },(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function"," ","()"," ","{"," ",stmts," ","}",")","()"]
                        } else if (check_true( await contains_ques_("block",fst))) {
                             return [(preamble && preamble["2"]),{
                                mark:"wrap_assignment_value"
                            },(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function"," ","()"," "," ",stmts," ",")","()"]
                        } else  {
                             return stmts
                        }
                    } ()
                };
                clean_quoted_reference=async function(name) {
                     return  await async function(){
                        if (check_true( ((name instanceof String || typeof name==='string')&& await starts_with_ques_("\"",name)&& await (await Environment.get_global("ends_with?"))("\"",name)))) {
                             return await (async function() {
                                {
                                     let __call_target__=await name["substr"].call(name,1), __call_method__="substr";
                                    return await __call_target__[__call_method__].call(__call_target__,0,(await length(name)- 2))
                                } 
                            })()
                        } else  {
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
                    ctx=await new_ctx(ctx);
                    clog=await (async function () {
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
                    structure_validation_rules=[[[1,"val"],[(await Environment.get_global("is_array?"))],"allocation section"],[[2],[async function(v) {
                         return  await not((v===undefined))
                    }],"block"]];
                    validation_results=null;
                    allocations=(tokens && tokens["1"] && tokens["1"]["val"]);
                    block=await tokens["slice"].call(tokens,2);
                    syntax_error=null;
                    idx=-1;
                    ;
                    await (await Environment.get_global("compiler_syntax_validation"))("compile_let",tokens,errors,ctx,expanded_tree);
                    await async function(){
                        ctx["return_last_value"]=true;
                        return ctx;
                        
                    }();
                    await set_ctx(ctx,"local_scope",true);
                    (acc).push("{");
                    sub_block_count+=1;
                    if (check_true (((block && block["0"] && block["0"]["val"] && block["0"]["val"]["0"] && block["0"]["val"]["0"]["name"])==="declare"))){
                        declarations_handled=true;
                         (acc).push(await compile_declare((block && block["0"] && block["0"]["val"]),ctx))
                    };
                    if (check_true (needs_first_level)){
                        is_first_level=true;
                        await set_ctx(ctx,"has_first_level",true);
                        needs_first_level=false;
                        if (check_true (is_first_level)){
                             (acc).push(first_level_setup)
                        }
                    };
                    await (async function(){
                         let __test_condition__146=async function() {
                             return  (idx<((allocations && allocations.length)- 1))
                        };
                        let __body_ref__147=async function() {
                            idx+=1;
                            alloc_set=await (async function(){
                                let __targ__148=allocations[idx];
                                if (__targ__148){
                                     return(__targ__148)["val"]
                                } 
                            })();
                            reference_name=await clean_quoted_reference(await sanitize_js_ref_name((alloc_set && alloc_set["0"] && alloc_set["0"]["name"])));
                            await (await Environment.get_global("assert"))(((reference_name instanceof String || typeof reference_name==='string')&& (await length(reference_name)>0)),("Invalid reference name: "+ (alloc_set && alloc_set["0"] && alloc_set["0"]["name"])));
                            ctx_details=await get_declaration_details(ctx,reference_name);
                            if (check_true (ctx_details)){
                                if (check_true ((await not((ctx_details && ctx_details["is_argument"]))&& ((ctx_details && ctx_details["levels_up"])>1)))){
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
                                         await async function(){
                                            shadowed_globals[(alloc_set && alloc_set["0"] && alloc_set["0"]["name"])]=true;
                                            return shadowed_globals;
                                            
                                        }()
                                    }
                                }
                            };
                            if (check_true (await not((ctx_details && ctx_details["is_argument"])))){
                                 return  await set_ctx(ctx,reference_name,AsyncFunction)
                            }
                        };
                        let __BREAK__FLAG__=false;
                        while(await __test_condition__146()) {
                            await __body_ref__147();
                             if(__BREAK__FLAG__) {
                                 break;
                                
                            }
                        } ;
                        
                    })();
                    idx=-1;
                    await (async function(){
                         let __test_condition__151=async function() {
                             return  (idx<((allocations && allocations.length)- 1))
                        };
                        let __body_ref__152=async function() {
                            idx+=1;
                            stmt=[];
                            alloc_set=await (async function(){
                                let __targ__153=allocations[idx];
                                if (__targ__153){
                                     return(__targ__153)["val"]
                                } 
                            })();
                            reference_name=await clean_quoted_reference(await sanitize_js_ref_name((alloc_set && alloc_set["0"] && alloc_set["0"]["name"])));
                            if (check_true (("check_external_env"===reference_name))){
                                 debugger;
                                
                            };
                            ctx_details=await get_declaration_details(ctx,reference_name);
                            await async function(){
                                if (check_true( ((alloc_set && alloc_set["1"] && alloc_set["1"]["val"]) instanceof Array))) {
                                    await async function(){
                                        ctx["in_assignment"]=true;
                                        return ctx;
                                        
                                    }();
                                    assignment_value=await compile((alloc_set && alloc_set["1"]),ctx);
                                     return  await async function(){
                                        ctx["in_assignment"]=false;
                                        return ctx;
                                        
                                    }()
                                } else if (check_true( (((alloc_set && alloc_set["1"] && alloc_set["1"]["name"]) instanceof String || typeof (alloc_set && alloc_set["1"] && alloc_set["1"]["name"])==='string')&& await not((ctx_details && ctx_details["is_argument"]))&& (alloc_set && alloc_set["1"] && alloc_set["1"]["ref"])&& await not((await Environment["get_global"].call(Environment,(alloc_set && alloc_set["1"] && alloc_set["1"]["name"]),NOT_FOUND_THING)===NOT_FOUND_THING))&& shadowed_globals[(alloc_set && alloc_set["0"] && alloc_set["0"]["name"])]))) {
                                     return  assignment_value=[{
                                        ctype:(ctx_details && ctx_details["value"])
                                    },"await"," ",env_ref,"get_global","(","\"",(alloc_set && alloc_set["0"] && alloc_set["0"]["name"]),"\"",")"]
                                } else  {
                                    assignment_value=await compile((alloc_set && alloc_set["1"]),ctx);
                                    if (check_true (await verbosity(ctx))){
                                         return  (clog)("setting simple assignment value for",reference_name,": <- ",await clone(assignment_value))
                                    }
                                }
                            } ();
                            await async function(){
                                if (check_true( ((assignment_value instanceof Array)&& ((assignment_value && assignment_value["0"]) instanceof Object)&& (assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])))) {
                                     return  await set_ctx(ctx,reference_name,await map_ctype_to_value((assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"]),assignment_value))
                                } else if (check_true( ((assignment_value instanceof Array)&& ((assignment_value && assignment_value["0"]) instanceof Array)&& (assignment_value && assignment_value["0"] && assignment_value["0"]["0"] && assignment_value["0"]["0"]["ctype"])))) {
                                     return  await set_ctx(ctx,reference_name,await map_ctype_to_value((assignment_value && assignment_value["0"] && assignment_value["0"]["0"] && assignment_value["0"]["0"]["ctype"]),assignment_value))
                                } else  {
                                     return  await set_ctx(ctx,reference_name,assignment_value)
                                }
                            } ();
                            assignment_value=await wrap_assignment_value(assignment_value,ctx);
                            if (check_true ((ctx_details && ctx_details["is_argument"]))){
                                 await async function(){
                                    block_declarations[reference_name]=true;
                                    return block_declarations;
                                    
                                }()
                            };
                            def_idx=null;
                            await async function(){
                                if (check_true( (redefinitions[reference_name]&& await first(redefinitions[reference_name])))) {
                                    def_idx=await first(redefinitions[reference_name]);
                                    def_idx+=1;
                                    await async function(){
                                        let __target_obj__157=redefinitions[reference_name];
                                        __target_obj__157[0]=def_idx;
                                        return __target_obj__157;
                                        
                                    }();
                                     return  await (async function() {
                                        let __for_body__160=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__161=[],__elements__159=["let"," ",await (async function(){
                                            let __targ__162=redefinitions[reference_name];
                                            if (__targ__162){
                                                 return(__targ__162)[def_idx]
                                            } 
                                        })(),"="," ",(preamble && preamble["1"])," ","function","()","{","return"," ",assignment_value,"}",";"];
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__158 in __elements__159) {
                                            __array__161.push(await __for_body__160(__elements__159[__iter__158]));
                                            if(__BREAK__FLAG__) {
                                                 __array__161.pop();
                                                break;
                                                
                                            }
                                        }return __array__161;
                                         
                                    })()
                                } else if (check_true( await not(block_declarations[reference_name]))) {
                                    await (async function() {
                                        let __for_body__165=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__166=[],__elements__164=["let"," ",reference_name,";"];
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__163 in __elements__164) {
                                            __array__166.push(await __for_body__165(__elements__164[__iter__163]));
                                            if(__BREAK__FLAG__) {
                                                 __array__166.pop();
                                                break;
                                                
                                            }
                                        }return __array__166;
                                         
                                    })();
                                     return  await async function(){
                                        block_declarations[reference_name]=true;
                                        return block_declarations;
                                        
                                    }()
                                }
                            } ();
                            if (check_true (await not(assignments[reference_name]))){
                                 await async function(){
                                    assignments[reference_name]=[];
                                    return assignments;
                                    
                                }()
                            };
                             return  (assignments[reference_name]).push(await (async function () {
                                 if (check_true (def_idx)){
                                      return [(preamble && preamble["0"])," ",await (async function(){
                                        let __targ__169=redefinitions[reference_name];
                                        if (__targ__169){
                                             return(__targ__169)[def_idx]
                                        } 
                                    })(),"()",";"]
                                } else {
                                      return assignment_value
                                } 
                            })())
                        };
                        let __BREAK__FLAG__=false;
                        while(await __test_condition__151()) {
                            await __body_ref__152();
                             if(__BREAK__FLAG__) {
                                 break;
                                
                            }
                        } ;
                        
                    })();
                    if (check_true (need_sub_block)){
                         await (async function() {
                            let __for_body__172=async function(pset) {
                                 return  await (async function() {
                                    let __for_body__176=async function(redef) {
                                         return  (redefinitions[(pset && pset["0"])]).shift()
                                    };
                                    let __array__177=[],__elements__175=(pset && pset["1"]);
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__174 in __elements__175) {
                                        __array__177.push(await __for_body__176(__elements__175[__iter__174]));
                                        if(__BREAK__FLAG__) {
                                             __array__177.pop();
                                            break;
                                            
                                        }
                                    }return __array__177;
                                     
                                })()
                            };
                            let __array__173=[],__elements__171=await (await Environment.get_global("pairs"))(redefinitions);
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
                    if (check_true (need_sub_block)){
                        (acc).push("{");
                         sub_block_count+=1
                    };
                    idx=-1;
                    await (async function(){
                         let __test_condition__178=async function() {
                             return  (idx<((allocations && allocations.length)- 1))
                        };
                        let __body_ref__179=async function() {
                            idx+=1;
                            def_idx=null;
                            stmt=[];
                            alloc_set=await (async function(){
                                let __targ__180=allocations[idx];
                                if (__targ__180){
                                     return(__targ__180)["val"]
                                } 
                            })();
                            reference_name=await clean_quoted_reference(await sanitize_js_ref_name((alloc_set && alloc_set["0"] && alloc_set["0"]["name"])));
                            ctx_details=await get_declaration_details(ctx,reference_name);
                            assignment_value=(assignments[reference_name]).shift();
                            await async function(){
                                if (check_true( block_declarations[reference_name])) {
                                     return true
                                } else  {
                                    (stmt).push("let");
                                     return  (stmt).push(" ")
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
                             return  (acc).push(stmt)
                        };
                        let __BREAK__FLAG__=false;
                        while(await __test_condition__178()) {
                            await __body_ref__179();
                             if(__BREAK__FLAG__) {
                                 break;
                                
                            }
                        } ;
                        
                    })();
                    (acc).push(await compile_block(await conj(["PLACEHOLDER"],block),ctx,{
                        no_scope_boundary:true,ignore_declarations:declarations_handled
                    }));
                    await (async function() {
                        let __for_body__184=async function(i) {
                             return  (acc).push("}")
                        };
                        let __array__185=[],__elements__183=await (await Environment.get_global("range"))(sub_block_count);
                        let __BREAK__FLAG__=false;
                        for(let __iter__182 in __elements__183) {
                            __array__185.push(await __for_body__184(__elements__183[__iter__182]));
                            if(__BREAK__FLAG__) {
                                 __array__185.pop();
                                break;
                                
                            }
                        }return __array__185;
                         
                    })();
                    if (check_true (((ctx && ctx["return_point"])===1))){
                          return acc
                    } else {
                        (acc).unshift({
                            ctype:"letblock"
                        });
                         return  acc
                    }
                };
                in_sync_ques_=async function(ctx) {
                     return  await get_ctx(ctx,"__SYNCF__")
                };
                await_ques_=async function(ctx) {
                    if (check_true (await (async function(){
                        let __array_op_rval__186=in_sync_ques_;
                         if (__array_op_rval__186 instanceof Function){
                            return await __array_op_rval__186(ctx) 
                        } else {
                            return[__array_op_rval__186,ctx]
                        }
                    })())){
                          return ""
                    } else {
                          return "await"
                    }
                };
                calling_preamble=async function(ctx) {
                    if (check_true (await (async function(){
                        let __array_op_rval__187=in_sync_ques_;
                         if (__array_op_rval__187 instanceof Function){
                            return await __array_op_rval__187(ctx) 
                        } else {
                            return[__array_op_rval__187,ctx]
                        }
                    })())){
                          return ["","",{
                            ctype:"Function"
                        },"(",")"]
                    } else {
                          return ["await","async",{
                            ctype:"AsyncFunction"
                        },"",""]
                    }
                };
                fn_log=await defclog({
                    prefix:"compile_fn",background:"black",color:"lightblue"
                });
                compile_fn=async function(tokens,ctx,fn_opts) {
                    let acc;
                    let idx;
                    let arg;
                    let fn_args;
                    let body;
                    let external_declarations;
                    let type_mark;
                    let nbody;
                    acc=[];
                    idx=-1;
                    arg=null;
                    ctx=await new_ctx(ctx);
                    fn_args=(tokens && tokens["1"] && tokens["1"]["val"]);
                    body=(tokens && tokens["2"]);
                    external_declarations=(tokens && tokens["3"]);
                    type_mark=null;
                    nbody=null;
                    await async function(){
                        ctx["return_last_value"]=true;
                        return ctx;
                        
                    }();
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
                        if (check_true((fn_opts && fn_opts["synchronous"]))) {
                            type_mark=await type_marker("Function");
                            await set_ctx(ctx,"__SYNCF__",true);
                             return  (acc).push(type_mark)
                        } else if (check_true((fn_opts && fn_opts["arrow"]))) {
                            type_mark=await type_marker("Function");
                             return  (acc).push(type_mark)
                        } else if (check_true((fn_opts && fn_opts["generator"]))) {
                            type_mark=await type_marker("GeneratorFunction");
                            (acc).push(type_mark);
                            (acc).push("async");
                             return  (acc).push(" ")
                        } else  {
                            type_mark=await type_marker("AsyncFunction");
                            (acc).push(type_mark);
                            (acc).push("async");
                             return  (acc).push(" ")
                        }
                    } ();
                    await async function(){
                        type_mark["args"]=[];
                        return type_mark;
                        
                    }();
                    await async function(){
                        if (check_true((fn_opts && fn_opts["arrow"]))) {
                             return false
                        } else if (check_true((fn_opts && fn_opts["generator"]))) {
                             return (acc).push("function*")
                        } else  {
                             return (acc).push("function")
                        }
                    } ();
                    (acc).push("(");
                    await (async function(){
                         let __test_condition__193=async function() {
                             return  (idx<((fn_args && fn_args.length)- 1))
                        };
                        let __body_ref__194=async function() {
                            idx+=1;
                            arg=fn_args[idx];
                            if (check_true (((arg && arg.name)==="&"))){
                                idx+=1;
                                arg=fn_args[idx];
                                if (check_true ((null==arg))){
                                    throw new SyntaxError("Missing argument symbol after &");
                                    
                                };
                                await set_ctx(ctx,(arg && arg.name),ArgumentType);
                                 await async function(){
                                    arg["name"]=("..."+ (arg && arg.name));
                                    return arg;
                                    
                                }()
                            } else {
                                 await set_ctx(ctx,(arg && arg.name),ArgumentType)
                            };
                            (acc).push(await sanitize_js_ref_name((arg && arg.name)));
                            ((type_mark && type_mark["args"])).push(await sanitize_js_ref_name((arg && arg.name)));
                            if (check_true ((idx<((fn_args && fn_args.length)- 1)))){
                                 return  (acc).push(",")
                            }
                        };
                        let __BREAK__FLAG__=false;
                        while(await __test_condition__193()) {
                            await __body_ref__194();
                             if(__BREAK__FLAG__) {
                                 break;
                                
                            }
                        } ;
                        
                    })();
                    (acc).push(")");
                    (acc).push(" ");
                    if (check_true ((fn_opts && fn_opts["arrow"]))){
                         (acc).push("=>")
                    };
                    if (check_true ((fn_opts && fn_opts["generator"]))){
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
                        if (check_true( ((body && body["val"] && body["val"]["0"] && body["val"]["0"]["name"])==="let"))) {
                             return  (acc).push(await compile((body && body["val"]),ctx))
                        } else if (check_true( ((body && body["val"] && body["val"]["0"] && body["val"]["0"]["name"])==="do"))) {
                             return  (acc).push(await compile_block((body && body["val"]),ctx))
                        } else  {
                            nbody=[{
                                type:"special",val:"=:do",ref:true,name:"do"
                            },body];
                            await async function(){
                                ctx["return_last_value"]=true;
                                return ctx;
                                
                            }();
                            (acc).push({
                                mark:"nbody"
                            });
                             return  (acc).push(await compile_block(nbody,ctx))
                        }
                    } ();
                     return  acc
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
                    body=await compile((tokens && tokens["2"] && tokens["2"]["val"]),ctx);
                    idx=-1;
                    quoted_body=[];
                    arg=null;
                    type_mark=await type_marker("Function");
                    (acc).push(type_mark);
                    await (async function() {
                        let __for_body__201=async function(t) {
                             return  (acc).push(t)
                        };
                        let __array__202=[],__elements__200=["new"," ","Function","("];
                        let __BREAK__FLAG__=false;
                        for(let __iter__199 in __elements__200) {
                            __array__202.push(await __for_body__201(__elements__200[__iter__199]));
                            if(__BREAK__FLAG__) {
                                 __array__202.pop();
                                break;
                                
                            }
                        }return __array__202;
                         
                    })();
                    if (check_true (await not((body instanceof String || typeof body==='string')))){
                        throw new SyntaxError(("Invalid jslambda body, need string, got: "+ await subtype(body)));
                        
                    };
                    await (async function(){
                         let __test_condition__203=async function() {
                             return  (idx<((fn_args && fn_args.length)- 1))
                        };
                        let __body_ref__204=async function() {
                            idx+=1;
                            arg=fn_args[idx];
                            await set_ctx(ctx,(arg && arg.name),ArgumentType);
                            (acc).push(("\""+ (arg && arg.name)+ "\""));
                            ((type_mark && type_mark["args"])).push((arg && arg.name));
                             return  (acc).push(",")
                        };
                        let __BREAK__FLAG__=false;
                        while(await __test_condition__203()) {
                            await __body_ref__204();
                             if(__BREAK__FLAG__) {
                                 break;
                                
                            }
                        } ;
                        
                    })();
                    (acc).push("\"");
                    await (async function() {
                        let __for_body__207=async function(c) {
                            if (check_true (await not((c==="\n"),(c==="\r")))){
                                if (check_true ((c==="\""))){
                                     (quoted_body).push(await String.fromCharCode(92))
                                };
                                 return  (quoted_body).push(c)
                            }
                        };
                        let __array__208=[],__elements__206=(body).split("");
                        let __BREAK__FLAG__=false;
                        for(let __iter__205 in __elements__206) {
                            __array__208.push(await __for_body__207(__elements__206[__iter__205]));
                            if(__BREAK__FLAG__) {
                                 __array__208.pop();
                                break;
                                
                            }
                        }return __array__208;
                         
                    })();
                    (acc).push((await flatten(quoted_body)).join(""));
                    (acc).push("\"");
                    (acc).push(")");
                     return  acc
                };
                compile_yield=async function(tokens,ctx) {
                    let acc;
                    let expr;
                    acc=[{
                        mark:"no_return"
                    }];
                    expr=null;
                    (acc).push("yield");
                    (acc).push(" ");
                    expr=await (async function ()  {
                         return  await compile((tokens && tokens["1"]),ctx)
                    } )();
                    (acc).push(await wrap_assignment_value(expr,ctx));
                    (acc).push(";");
                     return  acc
                };
                var_counter=0;
                gen_temp_name=async function(arg) {
                     return  ("__"+ (arg|| "")+ "__"+ (var_counter=var_counter+1))
                };
                if_id=0;
                cond_log=await (async function () {
                     if (check_true ((opts && opts["quiet_mode"]))){
                          return log
                    } else {
                          return await defclog({
                            prefix:"compile_cond",color:"white",background:"darkblue"
                        })
                    } 
                })();
                compile_cond=async function(tokens,ctx) {
                    let preamble;
                    preamble=await calling_preamble(ctx);
                    ;
                     return  [(preamble && preamble["2"]),(preamble && preamble["0"])," ",(preamble && preamble["1"])," ",(preamble && preamble["3"]),"function","()","{",await compile_cond_inner(tokens,ctx),"} ",(preamble && preamble["4"]),"()"]
                };
                compile_cond_inner=async function(tokens,ctx) {
                    let acc;
                    let prebuild;
                    let conditions;
                    let stmts;
                    let fst;
                    let inject_return;
                    let block_stmts;
                    let needs_braces_ques_;
                    let check_needs_return;
                    let idx;
                    let condition;
                    let condition_block;
                    let condition_tokens;
                    acc=[];
                    prebuild=[];
                    conditions=[];
                    stmts=null;
                    fst=null;
                    ctx=await new_ctx(ctx);
                    inject_return=false;
                    block_stmts=null;
                    needs_braces_ques_=false;
                    check_needs_return=async function(stmts) {
                        fst=(""+ (((stmts instanceof Array)&& await first(stmts)&& (await first(stmts) instanceof Object)&& await (async function(){
                            let __targ__209=await first(stmts);
                            if (__targ__209){
                                 return(__targ__209)["ctype"]
                            } 
                        })()&& await async function(){
                            if (check_true( (await (async function(){
                                let __targ__210=await first(stmts);
                                if (__targ__210){
                                     return(__targ__210)["ctype"]
                                } 
                            })() instanceof String || typeof await (async function(){
                                let __targ__210=await first(stmts);
                                if (__targ__210){
                                     return(__targ__210)["ctype"]
                                } 
                            })()==='string'))) {
                                 return await (async function(){
                                    let __targ__211=await first(stmts);
                                    if (__targ__211){
                                         return(__targ__211)["ctype"]
                                    } 
                                })()
                            } else  {
                                 return await sub_type(await (async function(){
                                    let __targ__212=await first(stmts);
                                    if (__targ__212){
                                         return(__targ__212)["ctype"]
                                    } 
                                })())
                            }
                        } ())|| ""));
                         return  await async function(){
                            if (check_true( (fst==="ifblock"))) {
                                needs_braces_ques_=true;
                                 return  false
                            } else if (check_true( await contains_ques_("block",fst))) {
                                if (check_true ((fst==="ifblock"))){
                                     needs_braces_ques_=true
                                } else {
                                     needs_braces_ques_=false
                                };
                                 return  false
                            } else if (check_true( (await first(stmts)==="throw"))) {
                                needs_braces_ques_=true;
                                 return  false
                            } else  {
                                needs_braces_ques_=true;
                                 return  true
                            }
                        } ()
                    };
                    idx=0;
                    condition=null;
                    condition_block=null;
                    condition_tokens=await tokens["slice"].call(tokens,1);
                    ;
                    await (await Environment.get_global("compiler_syntax_validation"))("compile_cond",tokens,errors,ctx,expanded_tree);
                    await async function(){
                        if (check_true( await not((((condition_tokens && condition_tokens.length)% 2)===0)))) {
                             throw new SyntaxError("cond: Invalid syntax: missing condition block");
                            
                        } else if (check_true( ((condition_tokens && condition_tokens.length)===0))) {
                             throw new SyntaxError("cond: Invalid syntax: no conditions provided");
                            
                        }
                    } ();
                    await set_ctx(ctx,"__LAMBDA_STEP__",-1);
                    await (async function(){
                         let __test_condition__213=async function() {
                             return  (idx<(condition_tokens && condition_tokens.length))
                        };
                        let __body_ref__214=async function() {
                            inject_return=false;
                            condition=condition_tokens[idx];
                            idx+=1;
                            condition_block=condition_tokens[idx];
                            if (check_true ((idx>2))){
                                (acc).push(" ");
                                (acc).push("else");
                                 (acc).push(" ")
                            };
                            if (check_true (await not(((condition && condition.name)==="else")))){
                                (acc).push({
                                    ctype:"ifblock",stype:"cond"
                                });
                                (acc).push("if");
                                (acc).push(" ");
                                 (acc).push("(")
                            };
                            await async function(){
                                if (check_true( await (async function(){
                                    let __array_op_rval__215=is_form_ques_;
                                     if (__array_op_rval__215 instanceof Function){
                                        return await __array_op_rval__215(condition) 
                                    } else {
                                        return[__array_op_rval__215,condition]
                                    }
                                })())) {
                                    stmts=await compile(condition,ctx);
                                    (acc).push("check_true");
                                    (acc).push("(");
                                    (acc).push(" ");
                                    (acc).push(stmts);
                                     return  (acc).push(")")
                                } else if (check_true( ((condition && condition.name)==="else"))) {
                                     return true
                                } else  {
                                    stmts=await compile(condition,ctx);
                                    (acc).push("check_true");
                                    (acc).push("(");
                                    (acc).push(stmts);
                                     return  (acc).push(")")
                                }
                            } ();
                            if (check_true (await not(((condition && condition.name)==="else")))){
                                 (acc).push(")")
                            };
                            (acc).push(" ");
                            stmts=await compile(condition_block,ctx);
                            if (check_true (await check_needs_return(stmts))){
                                 inject_return=true
                            };
                            if (check_true (needs_braces_ques_)){
                                (acc).push("{");
                                 (acc).push(" ")
                            };
                            if (check_true (inject_return)){
                                (acc).push("return");
                                 (acc).push(" ")
                            };
                            if (check_true (((condition_block && condition_block["type"])==="arr"))){
                                 (acc).push(stmts)
                            } else {
                                 (acc).push(stmts)
                            };
                            if (check_true (needs_braces_ques_)){
                                 (acc).push("}")
                            };
                             return  idx+=1
                        };
                        let __BREAK__FLAG__=false;
                        while(await __test_condition__213()) {
                            await __body_ref__214();
                             if(__BREAK__FLAG__) {
                                 break;
                                
                            }
                        } ;
                        
                    })();
                     return  acc
                };
                compile_if=async function(tokens,ctx) {
                    let acc;
                    let stmts;
                    let fst;
                    let __if_id__216= async function(){
                        return if_id+=1
                    };
                    let inject_return;
                    let block_stmts;
                    let in_suppress_ques_;
                    let test_form;
                    let if_true;
                    let compiled_test;
                    let compiled_true;
                    let compiled_false;
                    let if_false;
                    let preamble;
                    let needs_braces_ques_;
                    let check_needs_return;
                    {
                        acc=[];
                        stmts=null;
                        fst=null;
                        let if_id=await __if_id__216();
                        ;
                        inject_return=false;
                        block_stmts=null;
                        in_suppress_ques_=(ctx && ctx["suppress_return"]);
                        test_form=(tokens && tokens["1"]);
                        if_true=(tokens && tokens["2"]);
                        compiled_test=null;
                        compiled_true=null;
                        compiled_false=null;
                        if_false=(tokens && tokens["3"]);
                        preamble=await calling_preamble(ctx);
                        needs_braces_ques_=false;
                        check_needs_return=async function(stmts) {
                            fst=(""+ (((stmts instanceof Array)&& await first(stmts)&& (await first(stmts) instanceof Object)&& await (async function(){
                                let __targ__217=await first(stmts);
                                if (__targ__217){
                                     return(__targ__217)["ctype"]
                                } 
                            })()&& await async function(){
                                if (check_true( (await (async function(){
                                    let __targ__218=await first(stmts);
                                    if (__targ__218){
                                         return(__targ__218)["ctype"]
                                    } 
                                })() instanceof String || typeof await (async function(){
                                    let __targ__218=await first(stmts);
                                    if (__targ__218){
                                         return(__targ__218)["ctype"]
                                    } 
                                })()==='string'))) {
                                     return await (async function(){
                                        let __targ__219=await first(stmts);
                                        if (__targ__219){
                                             return(__targ__219)["ctype"]
                                        } 
                                    })()
                                } else  {
                                     return await sub_type(await (async function(){
                                        let __targ__220=await first(stmts);
                                        if (__targ__220){
                                             return(__targ__220)["ctype"]
                                        } 
                                    })())
                                }
                            } ())|| ""));
                             return  await async function(){
                                if (check_true( await contains_ques_("block",fst))) {
                                    if (check_true ((fst==="ifblock"))){
                                         needs_braces_ques_=true
                                    } else {
                                         needs_braces_ques_=false
                                    };
                                     return  false
                                } else if (check_true( (await first(stmts)==="throw"))) {
                                    needs_braces_ques_=false;
                                     return  false
                                } else if (check_true( (((ctx && ctx["block_step"])===0)&& ((ctx && ctx["return_point"])<3)))) {
                                    needs_braces_ques_=true;
                                     return  false
                                } else if (check_true( (((ctx && ctx["block_step"])===0)&& ((ctx && ctx["return_point"])>2)))) {
                                    needs_braces_ques_=true;
                                     return  false
                                } else if (check_true( ((ctx && ctx["block_step"])>0))) {
                                    needs_braces_ques_=true;
                                     return  false
                                } else  {
                                    needs_braces_ques_=true;
                                     return  false
                                }
                            } ()
                        };
                        ;
                        if (check_true (((ctx && ctx["block_step"])===undefined))){
                             await async function(){
                                ctx["block_step"]=0;
                                return ctx;
                                
                            }()
                        };
                        if (check_true ((null==ctx))){
                            throw new ReferenceError("undefined/nil ctx passed to compile_if");
                            
                        };
                        (acc).push({
                            ctype:"ifblock"
                        });
                        compiled_test=await compile_elem(test_form,ctx);
                        await set_ctx(ctx,"__IF_BLOCK__",if_id);
                        if (check_true (((ctx && ctx["block_step"])>0))){
                             await async function(){
                                ctx["suppress_return"]=true;
                                return ctx;
                                
                            }()
                        };
                        if (check_true (((await first(compiled_test) instanceof Object)&& await (async function(){
                            let __targ__223=await first(compiled_test);
                            if (__targ__223){
                                 return(__targ__223)["ctype"]
                            } 
                        })()&& (await (async function(){
                            let __targ__224=await first(compiled_test);
                            if (__targ__224){
                                 return(__targ__224)["ctype"]
                            } 
                        })() instanceof String || typeof await (async function(){
                            let __targ__224=await first(compiled_test);
                            if (__targ__224){
                                 return(__targ__224)["ctype"]
                            } 
                        })()==='string')&& await contains_ques_("unction",await (async function(){
                            let __targ__225=await first(compiled_test);
                            if (__targ__225){
                                 return(__targ__225)["ctype"]
                            } 
                        })())))){
                             await (async function() {
                                let __for_body__228=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__229=[],__elements__227=["if"," ","(check_true (",(preamble && preamble["0"])," ",compiled_test,"()","))"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__226 in __elements__227) {
                                    __array__229.push(await __for_body__228(__elements__227[__iter__226]));
                                    if(__BREAK__FLAG__) {
                                         __array__229.pop();
                                        break;
                                        
                                    }
                                }return __array__229;
                                 
                            })()
                        } else {
                             await (async function() {
                                let __for_body__232=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__233=[],__elements__231=["if"," ","(check_true (",compiled_test,"))"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__230 in __elements__231) {
                                    __array__233.push(await __for_body__232(__elements__231[__iter__230]));
                                    if(__BREAK__FLAG__) {
                                         __array__233.pop();
                                        break;
                                        
                                    }
                                }return __array__233;
                                 
                            })()
                        };
                        compiled_true=await compile(if_true,ctx);
                        inject_return=await check_needs_return(compiled_true);
                        if (check_true (needs_braces_ques_)){
                            (acc).push("{");
                             (acc).push(" ")
                        };
                        (acc).push(await (async function () {
                             if (check_true ((false&& (await get_ctx_val(ctx,"__LAMBDA_STEP__")===0)&& ((ctx && ctx["block_step"])===0)))){
                                  return {
                                    mark:"final-return",if_id:if_id
                                }
                            } else {
                                  return {
                                    mark:"rval",if_id:if_id,block_step:(ctx && ctx["block_step"]),lambda_step:await Math.max(0,await get_ctx_val(ctx,"__LAMBDA_STEP__"))
                                }
                            } 
                        })());
                        if (check_true (inject_return)){
                            (acc).push("return");
                             (acc).push(" ")
                        };
                        (acc).push(compiled_true);
                        if (check_true (needs_braces_ques_)){
                             (acc).push("}")
                        };
                        if (check_true (if_false)){
                            compiled_false=await compile(if_false,ctx);
                            inject_return=await check_needs_return(compiled_false);
                            (acc).push(" ");
                            (acc).push("else");
                            (acc).push(" ");
                            if (check_true (needs_braces_ques_)){
                                (acc).push("{");
                                 (acc).push(" ")
                            };
                            (acc).push(await (async function () {
                                 if (check_true ((false&& (await get_ctx_val(ctx,"__LAMBDA_STEP__")===0)))){
                                      return {
                                        mark:"final-return"
                                    }
                                } else {
                                      return {
                                        mark:"rval",if_id:if_id,block_step:(ctx && ctx["block_step"]),lambda_step:await Math.max(0,await get_ctx_val(ctx,"__LAMBDA_STEP__"))
                                    }
                                } 
                            })());
                            if (check_true (inject_return)){
                                (acc).push("return");
                                 (acc).push(" ")
                            };
                            (acc).push(compiled_false);
                            if (check_true (needs_braces_ques_)){
                                 (acc).push("}")
                            }
                        };
                        await set_ctx(ctx,"__IF_BLOCK__",undefined);
                        await async function(){
                            ctx["suppress_return"]=in_suppress_ques_;
                            return ctx;
                            
                        }();
                         return  acc
                    }
                };
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
                        if (check_true( ((tokens instanceof Object)&& await not((tokens instanceof Array))&& await not(((tokens && tokens["type"])==="arr"))))) {
                            needs_await=false;
                             return  acc=[await compile(tokens,ctx)]
                        } else if (check_true( await (async function(){
                            let __array_op_rval__235=is_block_ques_;
                             if (__array_op_rval__235 instanceof Function){
                                return await __array_op_rval__235(tokens) 
                            } else {
                                return[__array_op_rval__235,tokens]
                            }
                        })())) {
                            ctx=await new_ctx(ctx);
                            await async function(){
                                ctx["return_point"]=1;
                                return ctx;
                                
                            }();
                             return  acc=["(",(preamble && preamble["1"])," ","function","()","{",await compile(tokens,ctx),"}",")","()"]
                        } else if (check_true( ((tokens instanceof Object)&& ((tokens && tokens["val"] && tokens["val"]["0"] && tokens["val"]["0"]["name"])==="if")))) {
                            ctx=await new_ctx(ctx);
                            await async function(){
                                ctx["return_point"]=1;
                                return ctx;
                                
                            }();
                             return  await (async function() {
                                let __for_body__240=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__241=[],__elements__239=["(",(preamble && preamble["1"])," ","function","()","{",await compile_if((tokens && tokens["val"]),ctx),"}",")","()"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__238 in __elements__239) {
                                    __array__241.push(await __for_body__240(__elements__239[__iter__238]));
                                    if(__BREAK__FLAG__) {
                                         __array__241.pop();
                                        break;
                                        
                                    }
                                }return __array__241;
                                 
                            })()
                        } else if (check_true( (tokens instanceof Array))) {
                             return  acc=await compile_block_to_anon_fn(tokens,ctx)
                        } else if (check_true( ((tokens instanceof Object)&& (tokens && tokens["val"])&& ((tokens && tokens["type"])==="arr")))) {
                             return  acc=await compile_block_to_anon_fn((tokens && tokens["val"]),ctx)
                        }
                    } ();
                    if (check_true (needs_await)){
                          return [(preamble && preamble["0"])," ",acc]
                    } else {
                          return await (async function(){
                            let __array_op_rval__242=acc;
                             if (__array_op_rval__242 instanceof Function){
                                return await __array_op_rval__242() 
                            } else {
                                return[__array_op_rval__242]
                            }
                        })()
                    }
                };
                compile_block_to_anon_fn=async function(tokens,ctx,opts) {
                    let acc;
                    let preamble;
                    acc=[];
                    preamble=await calling_preamble(ctx);
                    ctx=await new_ctx(ctx);
                    await async function(){
                        ctx["return_point"]=0;
                        return ctx;
                        
                    }();
                    await async function(){
                        if (check_true( await (async function(){
                            let __array_op_rval__244=is_block_ques_;
                             if (__array_op_rval__244 instanceof Function){
                                return await __array_op_rval__244(tokens) 
                            } else {
                                return[__array_op_rval__244,tokens]
                            }
                        })())) {
                            await async function(){
                                ctx["return_last_value"]=true;
                                return ctx;
                                
                            }();
                            await async function(){
                                ctx["return_point"]=0;
                                return ctx;
                                
                            }();
                             return  await (async function() {
                                let __for_body__249=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__250=[],__elements__248=["(",(preamble && preamble["1"])," ","function","()",await compile_block(tokens,ctx),")","()"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__247 in __elements__248) {
                                    __array__250.push(await __for_body__249(__elements__248[__iter__247]));
                                    if(__BREAK__FLAG__) {
                                         __array__250.pop();
                                        break;
                                        
                                    }
                                }return __array__250;
                                 
                            })()
                        } else if (check_true( ((tokens && tokens["0"] && tokens["0"]["name"])==="let"))) {
                            await async function(){
                                ctx["return_last_value"]=true;
                                return ctx;
                                
                            }();
                            await async function(){
                                ctx["return_point"]=0;
                                return ctx;
                                
                            }();
                             return  await (async function() {
                                let __for_body__255=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__256=[],__elements__254=["(",(preamble && preamble["1"])," ","function","()",await compile(tokens,ctx),")","()"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__253 in __elements__254) {
                                    __array__256.push(await __for_body__255(__elements__254[__iter__253]));
                                    if(__BREAK__FLAG__) {
                                         __array__256.pop();
                                        break;
                                        
                                    }
                                }return __array__256;
                                 
                            })()
                        } else  {
                            await async function(){
                                ctx["return_last_value"]=true;
                                return ctx;
                                
                            }();
                            await async function(){
                                ctx["return_point"]=0;
                                return ctx;
                                
                            }();
                             return  await (async function() {
                                let __for_body__261=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__262=[],__elements__260=["(",(preamble && preamble["1"])," ","function","()","{"," ","return"," ",await compile(tokens,ctx)," ","}",")","()"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__259 in __elements__260) {
                                    __array__262.push(await __for_body__261(__elements__260[__iter__259]));
                                    if(__BREAK__FLAG__) {
                                         __array__262.pop();
                                        break;
                                        
                                    }
                                }return __array__262;
                                 
                            })()
                        }
                    } ();
                     return  acc
                };
                make_do_block=async function(tokens) {
                    let preamble;
                    let place;
                    preamble=await clone({
                        type:"arr",ref:false,name:null,val:[]
                    });
                    place=(preamble && preamble["val"]);
                    (place).push({
                        type:"special",val:"=:do",ref:true,name:"do"
                    });
                    await async function(){
                        if (check_true( (tokens instanceof Array))) {
                             return await (async function() {
                                let __for_body__265=async function(token) {
                                     return  (place).push(token)
                                };
                                let __array__266=[],__elements__264=tokens;
                                let __BREAK__FLAG__=false;
                                for(let __iter__263 in __elements__264) {
                                    __array__266.push(await __for_body__265(__elements__264[__iter__263]));
                                    if(__BREAK__FLAG__) {
                                         __array__266.pop();
                                        break;
                                        
                                    }
                                }return __array__266;
                                 
                            })()
                        } else  {
                             return await (async function() {
                                let __for_body__269=async function(token) {
                                     return  (place).push(token)
                                };
                                let __array__270=[],__elements__268=await (async function(){
                                    let __array_op_rval__271=tokens;
                                     if (__array_op_rval__271 instanceof Function){
                                        return await __array_op_rval__271() 
                                    } else {
                                        return[__array_op_rval__271]
                                    }
                                })();
                                let __BREAK__FLAG__=false;
                                for(let __iter__267 in __elements__268) {
                                    __array__270.push(await __for_body__269(__elements__268[__iter__267]));
                                    if(__BREAK__FLAG__) {
                                         __array__270.pop();
                                        break;
                                        
                                    }
                                }return __array__270;
                                 
                            })()
                        }
                    } ();
                     return  preamble
                };
                push_as_arg_list=async function(place,args) {
                    await map(async function(v,i,t) {
                        (place).push(v);
                        if (check_true ((i<=(t- 2)))){
                             return  (place).push(",")
                        }
                    },args);
                     return  place
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
                    root_type_details=await (async function () {
                         if (check_true (((comps && comps.length)>1))){
                              return await get_declaration_details(ctx,(comps && comps["0"]))
                        } else {
                              return null
                        } 
                    })();
                    target_return_type=null;
                    new_arg_name=null;
                    args=[];
                    ctx=await new_ctx(ctx);
                    preamble=await calling_preamble(ctx);
                    new_opts=await tokens["slice"].call(tokens,2);
                    if (check_true (((comps && comps.length)>1))){
                         target_type=await (await Environment.get_global("path_to_js_syntax"))(comps)
                    };
                    await (async function() {
                        let __for_body__274=async function(opt_token) {
                             return  (args).push(await wrap_assignment_value(await compile(opt_token,ctx),ctx))
                        };
                        let __array__275=[],__elements__273=(new_opts|| []);
                        let __BREAK__FLAG__=false;
                        for(let __iter__272 in __elements__273) {
                            __array__275.push(await __for_body__274(__elements__273[__iter__272]));
                            if(__BREAK__FLAG__) {
                                 __array__275.pop();
                                break;
                                
                            }
                        }return __array__275;
                         
                    })();
                    await async function(){
                        if (check_true( (await not((null==(type_details && type_details["value"])))&& (type_details && type_details["declared_global"])))) {
                            await (async function() {
                                let __for_body__278=async function(arg) {
                                     return  (acc).push(arg)
                                };
                                let __array__279=[],__elements__277=["new"," ",await compile((tokens && tokens["1"]),ctx),"("];
                                let __BREAK__FLAG__=false;
                                for(let __iter__276 in __elements__277) {
                                    __array__279.push(await __for_body__278(__elements__277[__iter__276]));
                                    if(__BREAK__FLAG__) {
                                         __array__279.pop();
                                        break;
                                        
                                    }
                                }return __array__279;
                                 
                            })();
                            await push_as_arg_list(acc,args);
                             return  (acc).push(")")
                        } else if (check_true( (await not((null==(type_details && type_details["value"])))&& (type_details && type_details["value"]) instanceof Function))) {
                            await (async function() {
                                let __for_body__282=async function(arg) {
                                     return  (acc).push(arg)
                                };
                                let __array__283=[],__elements__281=["new"," ",target_type,"("];
                                let __BREAK__FLAG__=false;
                                for(let __iter__280 in __elements__281) {
                                    __array__283.push(await __for_body__282(__elements__281[__iter__280]));
                                    if(__BREAK__FLAG__) {
                                         __array__283.pop();
                                        break;
                                        
                                    }
                                }return __array__283;
                                 
                            })();
                            await push_as_arg_list(acc,args);
                             return  (acc).push(")")
                        } else if (check_true( ((null==(type_details && type_details["value"]))&& await not((null==(root_type_details && root_type_details["value"])))))) {
                            await (async function() {
                                let __for_body__286=async function(arg) {
                                     return  (acc).push(arg)
                                };
                                let __array__287=[],__elements__285=["(",(preamble && preamble["0"])," ",env_ref,"get_global","(","\"","indirect_new","\"",")",")","(",target_type];
                                let __BREAK__FLAG__=false;
                                for(let __iter__284 in __elements__285) {
                                    __array__287.push(await __for_body__286(__elements__285[__iter__284]));
                                    if(__BREAK__FLAG__) {
                                         __array__287.pop();
                                        break;
                                        
                                    }
                                }return __array__287;
                                 
                            })();
                            if (check_true (((args && args.length)>0))){
                                (acc).push(",");
                                 await push_as_arg_list(acc,args)
                            };
                             return  (acc).push(")")
                        }
                    } ();
                    target_return_type=(await get_ctx_val(ctx,target_type)|| await (async function(){
                        let __targ__288=(await get_declarations(ctx,target_type)|| new Object());
                        if (__targ__288){
                             return(__targ__288)["type"]
                        } 
                    })()|| await (await Environment.get_global("get_outside_global"))(target_type)|| UnknownType);
                    (acc).unshift({
                        ctype:target_return_type
                    });
                     return  acc
                };
                compile_val_mod=async function(tokens,ctx) {
                    let target_location;
                    let target;
                    let in_infix;
                    let operation;
                    let mod_source;
                    let how_much;
                    target_location=await async function(){
                        if (check_true( await get_ctx(ctx,(tokens && tokens["1"] && tokens["1"]["name"])))) {
                             return "local"
                        } else if (check_true( await get_lisp_ctx((tokens && tokens["1"] && tokens["1"]["name"])))) {
                             return "global"
                        }
                    } ();
                    target=(tokens && tokens["1"] && tokens["1"]["name"]);
                    in_infix=await get_ctx_val(ctx,"__COMP_INFIX_OPS__");
                    operation=await (async function () {
                         if (check_true (in_infix)){
                              return await async function(){
                                if (check_true( ((tokens && tokens["0"] && tokens["0"]["name"])==="inc"))) {
                                     return "+"
                                } else if (check_true( ((tokens && tokens["0"] && tokens["0"]["name"])==="dec"))) {
                                     return "-"
                                } else  {
                                     throw new Error(("Invalid value modification operator: "+ (tokens && tokens["0"] && tokens["0"]["name"])));
                                    
                                }
                            } ()
                        } else {
                              return await async function(){
                                if (check_true( ((target_location==="local")&& ((tokens && tokens["0"] && tokens["0"]["name"])==="inc")))) {
                                     return "+="
                                } else if (check_true( ((target_location==="local")&& ((tokens && tokens["0"] && tokens["0"]["name"])==="dec")))) {
                                     return "-="
                                } else if (check_true( ((tokens && tokens["0"] && tokens["0"]["name"])==="inc"))) {
                                     return "+"
                                } else  {
                                     return "-"
                                }
                            } ()
                        } 
                    })();
                    mod_source=null;
                    how_much=(((tokens && tokens["2"])&& await compile((tokens && tokens["2"]),ctx))|| 1);
                     return  await async function(){
                        if (check_true( (target_location==="global"))) {
                            has_lisp_globals=true;
                             return  ["(","await"," ",env_ref,"set_global(\"",target,"\",","await"," ",env_ref,"get_global(\"",target,"\")"," ",operation," ",how_much,"))"]
                        } else if (check_true(in_infix)) {
                             return  ["(",target,"=",target,operation,how_much,")"]
                        } else  {
                             return await (async function(){
                                let __array_op_rval__289=target;
                                 if (__array_op_rval__289 instanceof Function){
                                    return await __array_op_rval__289(operation,how_much) 
                                } else {
                                    return[__array_op_rval__289,operation,how_much]
                                }
                            })()
                        }
                    } ()
                };
                try_log=await (async function () {
                     if (check_true ((opts && opts["quiet_mode"]))){
                          return log
                    } else {
                          return await defclog({
                            prefix:"compile_try",background:"violet",color:"black"
                        })
                    } 
                })();
                compile_try=async function(tokens,ctx) {
                    let preamble;
                    preamble=await calling_preamble(ctx);
                    ;
                     return  [(preamble && preamble["2"]),(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()","{",await compile_try_inner(tokens,ctx),"}",")","()"]
                };
                compile_try_inner=async function(tokens,ctx) {
                    let acc;
                    let try_block;
                    let catch_block;
                    let the_exception_ref;
                    let exception_ref;
                    let orig_ctx;
                    let fst;
                    let needs_braces_ques_;
                    let check_needs_return;
                    let insert_catch_block;
                    let insert_return_ques_;
                    let complete_ques_;
                    let stmts;
                    let idx;
                    let base_error_caught;
                    let catches;
                    acc=[];
                    try_block=(tokens && tokens["1"] && tokens["1"]["val"]);
                    catch_block=null;
                    the_exception_ref=await gen_temp_name("exception");
                    exception_ref=null;
                    orig_ctx=ctx;
                    fst=null;
                    needs_braces_ques_=false;
                    check_needs_return=async function(stmts) {
                        fst=(""+ (((stmts instanceof Array)&& await first(stmts)&& (await first(stmts) instanceof Object)&& await (async function(){
                            let __targ__290=await first(stmts);
                            if (__targ__290){
                                 return(__targ__290)["ctype"]
                            } 
                        })()&& await async function(){
                            if (check_true( (await (async function(){
                                let __targ__291=await first(stmts);
                                if (__targ__291){
                                     return(__targ__291)["ctype"]
                                } 
                            })() instanceof String || typeof await (async function(){
                                let __targ__291=await first(stmts);
                                if (__targ__291){
                                     return(__targ__291)["ctype"]
                                } 
                            })()==='string'))) {
                                 return await (async function(){
                                    let __targ__292=await first(stmts);
                                    if (__targ__292){
                                         return(__targ__292)["ctype"]
                                    } 
                                })()
                            } else  {
                                 return await sub_type(await (async function(){
                                    let __targ__293=await first(stmts);
                                    if (__targ__293){
                                         return(__targ__293)["ctype"]
                                    } 
                                })())
                            }
                        } ())|| ""));
                         return  await async function(){
                            if (check_true( await contains_ques_("block",fst))) {
                                if (check_true ((fst==="ifblock"))){
                                     needs_braces_ques_=true
                                };
                                 return  false
                            } else  {
                                needs_braces_ques_=true;
                                 return  true
                            }
                        } ()
                    };
                    insert_catch_block=async function(err_data,stmts) {
                        let complete;
                        complete=false;
                        if (check_true (((err_data && err_data["idx"])===0))){
                             await (async function() {
                                let __for_body__296=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__297=[],__elements__295=[" ","catch","(",the_exception_ref,")"," ","{"," "];
                                let __BREAK__FLAG__=false;
                                for(let __iter__294 in __elements__295) {
                                    __array__297.push(await __for_body__296(__elements__295[__iter__294]));
                                    if(__BREAK__FLAG__) {
                                         __array__297.pop();
                                        break;
                                        
                                    }
                                }return __array__297;
                                 
                            })()
                        };
                        if (check_true (((err_data && err_data["error_type"])==="Error"))){
                             base_error_caught=true
                        };
                        if (check_true ((((err_data && err_data["error_type"])==="Error")|| ((err_data && err_data["idx"])===((err_data && err_data["total_catches"])- 1))))){
                             complete=true
                        };
                        if (check_true (((err_data && err_data["idx"])>0))){
                             await (async function() {
                                let __for_body__300=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__301=[],__elements__299=[" ","else"," "];
                                let __BREAK__FLAG__=false;
                                for(let __iter__298 in __elements__299) {
                                    __array__301.push(await __for_body__300(__elements__299[__iter__298]));
                                    if(__BREAK__FLAG__) {
                                         __array__301.pop();
                                        break;
                                        
                                    }
                                }return __array__301;
                                 
                            })()
                        };
                        await (async function() {
                            let __for_body__304=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__305=[],__elements__303=[" ","if"," ","(",the_exception_ref," ","instanceof"," ",(err_data && err_data["error_type"]),")"," ","{"," ","let"," ",(err_data && err_data["error_ref"]),"=",the_exception_ref,";"," "];
                            let __BREAK__FLAG__=false;
                            for(let __iter__302 in __elements__303) {
                                __array__305.push(await __for_body__304(__elements__303[__iter__302]));
                                if(__BREAK__FLAG__) {
                                     __array__305.pop();
                                    break;
                                    
                                }
                            }return __array__305;
                             
                        })();
                        if (check_true ((err_data && err_data["insert_return"]))){
                            (acc).push(" ");
                            (acc).push("return");
                             (acc).push(" ")
                        };
                        (acc).push(stmts);
                        (acc).push("}");
                        if (check_true ((((err_data && err_data["idx"])===((err_data && err_data["total_catches"])- 1))&& await not(base_error_caught)))){
                             await (async function() {
                                let __for_body__308=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__309=[],__elements__307=[" ","else"," ","throw"," ",the_exception_ref,";"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__306 in __elements__307) {
                                    __array__309.push(await __for_body__308(__elements__307[__iter__306]));
                                    if(__BREAK__FLAG__) {
                                         __array__309.pop();
                                        break;
                                        
                                    }
                                }return __array__309;
                                 
                            })()
                        };
                        if (check_true (complete)){
                             await (async function() {
                                let __for_body__312=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__313=[],__elements__311=[" ","}"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__310 in __elements__311) {
                                    __array__313.push(await __for_body__312(__elements__311[__iter__310]));
                                    if(__BREAK__FLAG__) {
                                         __array__313.pop();
                                        break;
                                        
                                    }
                                }return __array__313;
                                 
                            })()
                        };
                         return  complete
                    };
                    insert_return_ques_=false;
                    complete_ques_=false;
                    ctx=await new_ctx(ctx);
                    stmts=null;
                    idx=0;
                    base_error_caught=false;
                    catches=await tokens["slice"].call(tokens,2);
                    if (check_true ((await length(catches)===0))){
                        throw new SyntaxError("try: missing catch form");
                        
                    };
                    await async function(){
                        ctx["return_last_value"]=true;
                        return ctx;
                        
                    }();
                    await async function(){
                        ctx["in_try"]=true;
                        return ctx;
                        
                    }();
                    stmts=await compile(try_block,ctx);
                    if (check_true (((stmts && stmts["0"] && stmts["0"]["ctype"])&& (((stmts && stmts["0"] && stmts["0"]["ctype"])===AsyncFunction)|| ((stmts && stmts["0"] && stmts["0"]["ctype"])===Function))))){
                         (stmts).unshift("await")
                    };
                    if (check_true (await (async function(){
                        let __array_op_rval__316=is_complex_ques_;
                         if (__array_op_rval__316 instanceof Function){
                            return await __array_op_rval__316(try_block) 
                        } else {
                            return[__array_op_rval__316,try_block]
                        }
                    })())){
                         await (async function() {
                            let __for_body__319=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__320=[],__elements__318=["try"," ","/* TRY COMPLEX */ ",stmts," "];
                            let __BREAK__FLAG__=false;
                            for(let __iter__317 in __elements__318) {
                                __array__320.push(await __for_body__319(__elements__318[__iter__317]));
                                if(__BREAK__FLAG__) {
                                     __array__320.pop();
                                    break;
                                    
                                }
                            }return __array__320;
                             
                        })()
                    } else {
                         await (async function() {
                            let __for_body__323=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__324=[],__elements__322=await (async function ()  {
                                let __array_arg__325=(async function() {
                                    if (check_true ((await get_ctx_val(ctx,"__LAMBDA_STEP__")===0))){
                                          return {
                                            mark:"final-return"
                                        }
                                    } else {
                                          return {
                                            mark:"rval"
                                        }
                                    }
                                } );
                                return ["try"," ","/* TRY SIMPLE */ ","{"," ",await __array_arg__325(),stmts," ","}"]
                            } )();
                            let __BREAK__FLAG__=false;
                            for(let __iter__321 in __elements__322) {
                                __array__324.push(await __for_body__323(__elements__322[__iter__321]));
                                if(__BREAK__FLAG__) {
                                     __array__324.pop();
                                    break;
                                    
                                }
                            }return __array__324;
                             
                        })()
                    };
                    await (async function(){
                         let __test_condition__326=async function() {
                             return  (idx<(catches && catches.length))
                        };
                        let __body_ref__327=async function() {
                            catch_block=await (async function(){
                                let __targ__328=catches[idx];
                                if (__targ__328){
                                     return(__targ__328)["val"]
                                } 
                            })();
                            await set_ctx(ctx,(catch_block && catch_block["2"] && catch_block["2"]["val"] && catch_block["2"]["val"]["0"] && catch_block["2"]["val"]["0"]["name"]),(await Environment.get_global("indirect_new"))(catch_block['1'].name));
                            stmts=await compile((catch_block && catch_block["3"]),ctx);
                            insert_return_ques_=await check_needs_return(stmts);
                            complete_ques_=await insert_catch_block({
                                insert_return:insert_return_ques_,needs_braces:needs_braces_ques_,error_type:(catch_block && catch_block["1"] && catch_block["1"]["name"]),error_ref:(catch_block && catch_block["2"] && catch_block["2"]["val"] && catch_block["2"]["val"]["0"] && catch_block["2"]["val"]["0"]["name"]),idx:idx,total_catches:(catches && catches.length)
                            },stmts);
                            if (check_true (complete_ques_)){
                                 (idx===(catches && catches.length))
                            };
                             return  idx+=1
                        };
                        let __BREAK__FLAG__=false;
                        while(await __test_condition__326()) {
                            await __body_ref__327();
                             if(__BREAK__FLAG__) {
                                 break;
                                
                            }
                        } ;
                        
                    })();
                     return  acc
                };
                compile_throw=async function(tokens,ctx) {
                    let acc;
                    let error_message;
                    let mode;
                    let error_instance;
                    acc=[];
                    error_message=null;
                    mode=1;
                    error_instance=null;
                    await async function(){
                        if (check_true( ((tokens instanceof Array)&& ((tokens && tokens.length)===2)&& (tokens && tokens["1"] && tokens["1"]["ref"])))) {
                            mode=0;
                             return  error_instance=await compile((tokens && tokens["1"]),ctx)
                        } else if (check_true( ((tokens instanceof Array)&& ((tokens && tokens.length)===3)))) {
                            error_instance=await compile((tokens && tokens["1"]),ctx);
                             return  error_message=await compile((tokens && tokens["2"]),ctx)
                        } else if (check_true( ((tokens instanceof Array)&& ((tokens && tokens.length)===2)))) {
                            error_message=await compile((tokens && tokens["1"]),ctx);
                             return  error_instance="Error"
                        } else  {
                             throw new SyntaxError("Invalid Throw Syntax");
                            
                        }
                    } ();
                    if (check_true ((mode===0))){
                         await (async function() {
                            let __for_body__331=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__332=[],__elements__330=["throw"," ",error_instance,";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__329 in __elements__330) {
                                __array__332.push(await __for_body__331(__elements__330[__iter__329]));
                                if(__BREAK__FLAG__) {
                                     __array__332.pop();
                                    break;
                                    
                                }
                            }return __array__332;
                             
                        })()
                    } else {
                         await (async function() {
                            let __for_body__335=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__336=[],__elements__334=["throw"," ","new"," ",error_instance,"(",error_message,")",";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__333 in __elements__334) {
                                __array__336.push(await __for_body__335(__elements__334[__iter__333]));
                                if(__BREAK__FLAG__) {
                                     __array__336.pop();
                                    break;
                                    
                                }
                            }return __array__336;
                             
                        })()
                    };
                     return  acc
                };
                compile_break=async function(tokens,ctx) {
                     return  await (async function(){
                        let __array_op_rval__337=break_out;
                         if (__array_op_rval__337 instanceof Function){
                            return await __array_op_rval__337("=","true",";","return") 
                        } else {
                            return[__array_op_rval__337,"=","true",";","return"]
                        }
                    })()
                };
                compile_return=async function(tokens,ctx) {
                    let acc;
                    let return_val_reference;
                    let return_value;
                    acc=[];
                    return_val_reference=await gen_temp_name("return");
                    return_value=null;
                    (acc).push({
                        mark:"forced_return"
                    });
                    if (check_true (await (async function(){
                        let __array_op_rval__338=is_block_ques_;
                         if (__array_op_rval__338 instanceof Function){
                            return await __array_op_rval__338((tokens && tokens["1"] && tokens["1"]["val"])) 
                        } else {
                            return[__array_op_rval__338,(tokens && tokens["1"] && tokens["1"]["val"])]
                        }
                    })())){
                         await (async function() {
                            let __for_body__341=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__342=[],__elements__340=["let"," ",return_val_reference,"=",await compile((tokens && tokens["1"] && tokens["1"]["val"]),ctx),";","return"," ",return_val_reference,";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__339 in __elements__340) {
                                __array__342.push(await __for_body__341(__elements__340[__iter__339]));
                                if(__BREAK__FLAG__) {
                                     __array__342.pop();
                                    break;
                                    
                                }
                            }return __array__342;
                             
                        })()
                    } else {
                         await (async function() {
                            let __for_body__345=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__346=[],__elements__344=["return"," ",await compile((tokens && tokens["1"]),ctx),";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__343 in __elements__344) {
                                __array__346.push(await __for_body__345(__elements__344[__iter__343]));
                                if(__BREAK__FLAG__) {
                                     __array__346.pop();
                                    break;
                                    
                                }
                            }return __array__346;
                             
                        })()
                    };
                     return  acc
                };
                apply_log=await (async function () {
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
                    compiled_fun_resolver=null;
                    args=await tokens["slice"].call(tokens,2);
                    ;
                    if (check_true ((args&& ((args && args.length)===1)))){
                         args=await first(args)
                    };
                    function_ref=await compile(fn_ref,ctx);
                    if (check_true ((fn_ref && fn_ref["ref"]))){
                         ctype=await get_declaration_details(ctx,(fn_ref && fn_ref["name"]))
                    };
                    if (check_true ((ctype && ctype["value"]) instanceof Function)){
                         requires_await=true
                    };
                    function_ref=await wrap_assignment_value(function_ref,ctx);
                    if (check_true ((args instanceof Array))){
                        target_argument_ref=await gen_temp_name("target_arg");
                        target_arg=(args).pop();
                        await (async function() {
                            let __for_body__349=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__350=[],__elements__348=["let"," ",target_argument_ref,"=","[]",".concat","(",await compile(target_arg,ctx),")",";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__347 in __elements__348) {
                                __array__350.push(await __for_body__349(__elements__348[__iter__347]));
                                if(__BREAK__FLAG__) {
                                     __array__350.pop();
                                    break;
                                    
                                }
                            }return __array__350;
                             
                        })();
                        await (async function() {
                            let __for_body__353=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__354=[],__elements__352=["if","(","!",target_argument_ref," ","instanceof"," ","Array",")","{","throw"," ","new"," ","TypeError","(","\"Invalid final argument to apply - an array is required\"",")","}"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__351 in __elements__352) {
                                __array__354.push(await __for_body__353(__elements__352[__iter__351]));
                                if(__BREAK__FLAG__) {
                                     __array__354.pop();
                                    break;
                                    
                                }
                            }return __array__354;
                             
                        })();
                        await (async function() {
                            let __for_body__357=async function(token) {
                                preceding_arg_ref=await gen_temp_name("pre_arg");
                                if (check_true (await (async function(){
                                    let __array_op_rval__359=is_form_ques_;
                                     if (__array_op_rval__359 instanceof Function){
                                        return await __array_op_rval__359(token) 
                                    } else {
                                        return[__array_op_rval__359,token]
                                    }
                                })())){
                                     await (async function() {
                                        let __for_body__362=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__363=[],__elements__361=["let"," ",preceding_arg_ref,"=",await wrap_assignment_value(await compile((token && token["val"]),ctx),ctx),";"];
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__360 in __elements__361) {
                                            __array__363.push(await __for_body__362(__elements__361[__iter__360]));
                                            if(__BREAK__FLAG__) {
                                                 __array__363.pop();
                                                break;
                                                
                                            }
                                        }return __array__363;
                                         
                                    })()
                                } else {
                                     preceding_arg_ref=await wrap_assignment_value(await compile(token,ctx))
                                };
                                 return  (acc).push(await (async function(){
                                    let __array_op_rval__364=target_argument_ref;
                                     if (__array_op_rval__364 instanceof Function){
                                        return await __array_op_rval__364(".unshift","(",preceding_arg_ref,")",";") 
                                    } else {
                                        return[__array_op_rval__364,".unshift","(",preceding_arg_ref,")",";"]
                                    }
                                })())
                            };
                            let __array__358=[],__elements__356=args;
                            let __BREAK__FLAG__=false;
                            for(let __iter__355 in __elements__356) {
                                __array__358.push(await __for_body__357(__elements__356[__iter__355]));
                                if(__BREAK__FLAG__) {
                                     __array__358.pop();
                                    break;
                                    
                                }
                            }return __array__358;
                             
                        })();
                         await (async function() {
                            let __for_body__367=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__368=[],__elements__366=["return"," ","(",function_ref,")",".","apply","(","this",",",target_argument_ref,")"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__365 in __elements__366) {
                                __array__368.push(await __for_body__367(__elements__366[__iter__365]));
                                if(__BREAK__FLAG__) {
                                     __array__368.pop();
                                    break;
                                    
                                }
                            }return __array__368;
                             
                        })()
                    } else {
                        if (check_true (await (async function(){
                            let __array_op_rval__369=is_form_ques_;
                             if (__array_op_rval__369 instanceof Function){
                                return await __array_op_rval__369(args) 
                            } else {
                                return[__array_op_rval__369,args]
                            }
                        })())){
                            await (async function() {
                                let __for_body__372=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__373=[],__elements__371=["let"," ",args_ref,"=",await wrap_assignment_value(await compile((args && args["val"]),ctx),ctx),";"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__370 in __elements__371) {
                                    __array__373.push(await __for_body__372(__elements__371[__iter__370]));
                                    if(__BREAK__FLAG__) {
                                         __array__373.pop();
                                        break;
                                        
                                    }
                                }return __array__373;
                                 
                            })();
                             complex_ques_=true
                        };
                        await (async function() {
                            let __for_body__376=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__377=[],__elements__375=["return"," ","("," ",function_ref,")",".","apply","(","this"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__374 in __elements__375) {
                                __array__377.push(await __for_body__376(__elements__375[__iter__374]));
                                if(__BREAK__FLAG__) {
                                     __array__377.pop();
                                    break;
                                    
                                }
                            }return __array__377;
                             
                        })();
                        if (check_true (args)){
                            (acc).push(",");
                            if (check_true (complex_ques_)){
                                 (acc).push(args_ref)
                            } else {
                                 (acc).push(await wrap_assignment_value(await compile(args,ctx),ctx))
                            }
                        };
                         (acc).push(")")
                    };
                     return  [(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()","{",acc,"}",")","()"]
                };
                compile_call=async function(tokens,ctx) {
                    let preamble;
                    let simple_target_ques_;
                    let simple_method_ques_;
                    preamble=await calling_preamble(ctx);
                    simple_target_ques_=await (async function () {
                         if (check_true (((tokens && tokens["1"] && tokens["1"]["ref"])===true))){
                              return true
                        } else {
                              return false
                        } 
                    })();
                    simple_method_ques_=await (async function () {
                         if (check_true (((tokens && tokens["2"] && tokens["2"]["type"])==="literal"))){
                              return true
                        } else {
                              return false
                        } 
                    })();
                    ;
                     return  await async function(){
                        if (check_true( (simple_target_ques_&& simple_method_ques_))) {
                             return await compile_call_inner(tokens,ctx,{
                                type:0,preamble:preamble
                            })
                        } else if (check_true(simple_target_ques_)) {
                             return await compile_call_inner(tokens,ctx,{
                                type:0,preamble:preamble
                            })
                        } else  {
                             return [(preamble && preamble["2"]),(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ","{",await compile_call_inner(tokens,ctx,{
                                type:2,preamble:preamble
                            })," ","}",")","()"]
                        }
                    } ()
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
                         return  await (async function() {
                            let __for_body__380=async function(token) {
                                (acc).push(",");
                                 return  (acc).push(await wrap_assignment_value(await compile(token,ctx),ctx))
                            };
                            let __array__381=[],__elements__379=await tokens["slice"].call(tokens,3);
                            let __BREAK__FLAG__=false;
                            for(let __iter__378 in __elements__379) {
                                __array__381.push(await __for_body__380(__elements__379[__iter__378]));
                                if(__BREAK__FLAG__) {
                                     __array__381.pop();
                                    break;
                                    
                                }
                            }return __array__381;
                             
                        })()
                    };
                    method=null;
                    if (check_true (((tokens && tokens.length)<3))){
                        throw new SyntaxError(("call: missing arguments, requires at least 2"));
                        
                    };
                    target=await wrap_assignment_value(await compile((tokens && tokens["1"]),ctx),ctx);
                    method=await wrap_assignment_value(await compile((tokens && tokens["2"]),ctx),ctx);
                    await async function(){
                        if (check_true( (((opts && opts["type"])===0)|| ((opts && opts["type"])===1)))) {
                             return  await async function(){
                                if (check_true( ((tokens && tokens.length)===3))) {
                                     return await (async function() {
                                        let __for_body__384=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__385=[],__elements__383=await (async function(){
                                            let __array_op_rval__386=(preamble && preamble["0"]);
                                             if (__array_op_rval__386 instanceof Function){
                                                return await __array_op_rval__386(" ",target,"[",method,"]","()") 
                                            } else {
                                                return[__array_op_rval__386," ",target,"[",method,"]","()"]
                                            }
                                        })();
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__382 in __elements__383) {
                                            __array__385.push(await __for_body__384(__elements__383[__iter__382]));
                                            if(__BREAK__FLAG__) {
                                                 __array__385.pop();
                                                break;
                                                
                                            }
                                        }return __array__385;
                                         
                                    })()
                                } else  {
                                    await (async function() {
                                        let __for_body__389=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__390=[],__elements__388=await (async function(){
                                            let __array_op_rval__391=(preamble && preamble["0"]);
                                             if (__array_op_rval__391 instanceof Function){
                                                return await __array_op_rval__391(" ",target,"[",method,"]",".call","(",target) 
                                            } else {
                                                return[__array_op_rval__391," ",target,"[",method,"]",".call","(",target]
                                            }
                                        })();
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__387 in __elements__388) {
                                            __array__390.push(await __for_body__389(__elements__388[__iter__387]));
                                            if(__BREAK__FLAG__) {
                                                 __array__390.pop();
                                                break;
                                                
                                            }
                                        }return __array__390;
                                         
                                    })();
                                    await add_args();
                                     return  (acc).push(")")
                                }
                            } ()
                        } else if (check_true( ((opts && opts["type"])===2))) {
                            await (async function() {
                                let __for_body__394=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__395=[],__elements__393=["{"," ","let"," ","__call_target__","=",target,","," ","__call_method__","=",method,";"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__392 in __elements__393) {
                                    __array__395.push(await __for_body__394(__elements__393[__iter__392]));
                                    if(__BREAK__FLAG__) {
                                         __array__395.pop();
                                        break;
                                        
                                    }
                                }return __array__395;
                                 
                            })();
                            await async function(){
                                if (check_true( ((tokens && tokens.length)===3))) {
                                     return await (async function() {
                                        let __for_body__398=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__399=[],__elements__397=["return"," ",(preamble && preamble["0"])," ","__call_target__","[","__call_method__","]","()"];
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__396 in __elements__397) {
                                            __array__399.push(await __for_body__398(__elements__397[__iter__396]));
                                            if(__BREAK__FLAG__) {
                                                 __array__399.pop();
                                                break;
                                                
                                            }
                                        }return __array__399;
                                         
                                    })()
                                } else  {
                                    await (async function() {
                                        let __for_body__402=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__403=[],__elements__401=["return"," ",(preamble && preamble["0"])," ","__call_target__","[","__call_method__","]",".","call","(","__call_target__"];
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__400 in __elements__401) {
                                            __array__403.push(await __for_body__402(__elements__401[__iter__400]));
                                            if(__BREAK__FLAG__) {
                                                 __array__403.pop();
                                                break;
                                                
                                            }
                                        }return __array__403;
                                         
                                    })();
                                    await add_args();
                                     return  (acc).push(")")
                                }
                            } ();
                             return  (acc).push("}")
                        }
                    } ();
                     return  acc
                };
                check_needs_wrap=async function(stmts) {
                    let fst;
                    fst=(((stmts instanceof Array)&& await first(stmts)&& (await first(stmts) instanceof Object)&& await not(await (async function(){
                        let __targ__404=await first(stmts);
                        if (__targ__404){
                             return(__targ__404)["ctype"]
                        } 
                    })() instanceof Function)&& await (async function(){
                        let __targ__405=await first(stmts);
                        if (__targ__405){
                             return(__targ__405)["ctype"]
                        } 
                    })()&& await async function(){
                        if (check_true( (await (async function(){
                            let __targ__406=await first(stmts);
                            if (__targ__406){
                                 return(__targ__406)["ctype"]
                            } 
                        })() instanceof String || typeof await (async function(){
                            let __targ__406=await first(stmts);
                            if (__targ__406){
                                 return(__targ__406)["ctype"]
                            } 
                        })()==='string'))) {
                             return await (async function(){
                                let __targ__407=await first(stmts);
                                if (__targ__407){
                                     return(__targ__407)["ctype"]
                                } 
                            })()
                        } else  {
                             return await sub_type(await (async function(){
                                let __targ__408=await first(stmts);
                                if (__targ__408){
                                     return(__targ__408)["ctype"]
                                } 
                            })())
                        }
                    } ())|| "");
                     return  await async function(){
                        if (check_true( await contains_ques_("block",fst))) {
                             return true
                        } else  {
                             return false
                        }
                    } ()
                };
                compile_import=async function(tokens,ctx) {
                    let symbol_tokens;
                    let __symbols__409= async function(){
                        return []
                    };
                    let from_tokens;
                    let from_place;
                    let acc;
                    {
                        symbol_tokens=(tokens && tokens["1"]);
                        let symbols=await __symbols__409();
                        ;
                        from_tokens=null;
                        from_place=null;
                        acc=[];
                        if (check_true (((tokens && tokens.length)<3)))throw new SyntaxError("import requires exactly two arguments");
                        ;
                        symbol_tokens=(tokens && tokens["1"]);
                        from_tokens=(tokens && tokens["2"]);
                        from_place=await compile(from_tokens,ctx);
                        (acc).push({
                            ctype:"statement",meta:{
                                imported_from:from_place
                            }
                        });
                        (acc).push("import");
                        (acc).push(" ");
                        await async function(){
                            if (check_true( ((symbol_tokens && symbol_tokens["val"]) instanceof Array))) {
                                await (async function() {
                                    let __for_body__412=async function(s) {
                                         return  (symbols).push((s && s.name))
                                    };
                                    let __array__413=[],__elements__411=(symbol_tokens && symbol_tokens["val"]);
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__410 in __elements__411) {
                                        __array__413.push(await __for_body__412(__elements__411[__iter__410]));
                                        if(__BREAK__FLAG__) {
                                             __array__413.pop();
                                            break;
                                            
                                        }
                                    }return __array__413;
                                     
                                })();
                                 return  await (async function() {
                                    let __for_body__416=async function(t) {
                                         return  (acc).push(t)
                                    };
                                    let __array__417=[],__elements__415=await flatten(["{"," ",symbols," ","}"," ","from"," ",from_place]);
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__414 in __elements__415) {
                                        __array__417.push(await __for_body__416(__elements__415[__iter__414]));
                                        if(__BREAK__FLAG__) {
                                             __array__417.pop();
                                            break;
                                            
                                        }
                                    }return __array__417;
                                     
                                })()
                            } else  {
                                 throw new SyntaxError("import requires an array of imported symbols as a second argument");
                                
                            }
                        } ();
                         return  acc
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
                    from_place=await compile(from_tokens,ctx);
                    imported_from=await (async function () {
                         if (check_true ((from_place instanceof Array))){
                              return (from_place && from_place["1"])
                        } else {
                              return from_place
                        } 
                    })();
                    if (check_true (((imported_from instanceof String || typeof imported_from==='string')&& await starts_with_ques_("\"",imported_from)&& await (await Environment.get_global("ends_with?"))("\"",imported_from)))){
                        can_be_static=true;
                         imported_from=await imported_from["substr"].call(imported_from,1,((imported_from && imported_from.length)- 2))
                    };
                    await async function(){
                        external_dependencies[imported_from]=true;
                        return external_dependencies;
                        
                    }();
                    metaval=await (async function () {
                         if (check_true (can_be_static)){
                              return {
                                initializer:["=:javascript","undefined"]
                            }
                        } else {
                              return new Object()
                        } 
                    })();
                    (acc).push({
                        ctype:"statement",meta:metaval
                    });
                    await (async function() {
                        let __for_body__421=async function(t) {
                             return  (acc).push(t)
                        };
                        let __array__422=[],__elements__420=await flatten([(preamble && preamble["0"])," ","import"," ","(",from_place,")"]);
                        let __BREAK__FLAG__=false;
                        for(let __iter__419 in __elements__420) {
                            __array__422.push(await __for_body__421(__elements__420[__iter__419]));
                            if(__BREAK__FLAG__) {
                                 __array__422.pop();
                                break;
                                
                            }
                        }return __array__422;
                         
                    })();
                     return  acc
                };
                compile_javascript=async function(tokens,ctx) {
                    let acc;
                    let text;
                    acc=[];
                    text=null;
                    await (async function() {
                        let __for_body__425=async function(t) {
                             return  await async function(){
                                if (check_true((t && t["ref"]))) {
                                     return (acc).push((t && t.name))
                                } else if (check_true( ((t && t["val"]) instanceof Array))) {
                                     return (acc).push(await compile(t,ctx))
                                } else  {
                                     return (acc).push((t && t["val"]))
                                }
                            } ()
                        };
                        let __array__426=[],__elements__424=(await (await Environment.get_global("rest"))(tokens)|| []);
                        let __BREAK__FLAG__=false;
                        for(let __iter__423 in __elements__424) {
                            __array__426.push(await __for_body__425(__elements__424[__iter__423]));
                            if(__BREAK__FLAG__) {
                                 __array__426.pop();
                                break;
                                
                            }
                        }return __array__426;
                         
                    })();
                     return  acc
                };
                compile_set_global=async function(tokens,ctx,opts) {
                    let target;
                    let wrap_as_function_ques_;
                    let preamble;
                    let acc;
                    let clog;
                    let metavalue;
                    let assignment_value;
                    target=(tokens && tokens["1"] && tokens["1"]["name"]);
                    wrap_as_function_ques_=null;
                    preamble=await calling_preamble(ctx);
                    acc=null;
                    clog=await (async function () {
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
                    has_lisp_globals=true;
                    await async function(){
                        let __target_obj__427=(root_ctx && root_ctx["defined_lisp_globals"]);
                        __target_obj__427[target]=AsyncFunction;
                        return __target_obj__427;
                        
                    }();
                    if (check_true ((tokens && tokens["3"]))){
                         metavalue=await (async function () {
                             if (check_true (await (async function(){
                                let __array_op_rval__428=is_complex_ques_;
                                 if (__array_op_rval__428 instanceof Function){
                                    return await __array_op_rval__428((tokens && tokens["3"])) 
                                } else {
                                    return[__array_op_rval__428,(tokens && tokens["3"])]
                                }
                            })())){
                                  return await compile_wrapper_fn((tokens && tokens["3"]),ctx)
                            } else {
                                  return await compile((tokens && tokens["3"]),ctx)
                            } 
                        })()
                    };
                    assignment_value=await (async function ()  {
                         return  await compile((tokens && tokens["2"]),ctx)
                    } )();
                    wrap_as_function_ques_=await check_needs_wrap(assignment_value);
                    await async function(){
                        if (check_true( (((assignment_value && assignment_value["0"]) instanceof Object)&& (assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])))) {
                            if (check_true ((assignment_value && assignment_value["0"] && assignment_value["0"]["meta"]))){
                                if (check_true (await not(metavalue))){
                                     metavalue=await quote_tree((assignment_value && assignment_value["0"] && assignment_value["0"]["meta"]),ctx)
                                }
                            };
                            await async function(){
                                let __target_obj__429=(root_ctx && root_ctx["defined_lisp_globals"]);
                                __target_obj__429[target]=await async function(){
                                    if (check_true( ((assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])==="Function"))) {
                                         return Function
                                    } else if (check_true( ((assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])==="AsyncFunction"))) {
                                         return AsyncFunction
                                    } else if (check_true( ((assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])==="Number"))) {
                                         return NumberType
                                    } else if (check_true( ((assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])==="expression"))) {
                                         return Expression
                                    } else  {
                                         return (assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])
                                    }
                                } ();
                                return __target_obj__429;
                                
                            }();
                            if (check_true (wrap_as_function_ques_)){
                                 return  assignment_value=[(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function"," ","()",assignment_value,")","()"]
                            }
                        } else  {
                            if (check_true (((assignment_value instanceof Array)&& ((assignment_value && assignment_value["0"])==="await")))){
                                await async function(){
                                    let __target_obj__430=(root_ctx && root_ctx["defined_lisp_globals"]);
                                    __target_obj__430[target]=AsyncFunction;
                                    return __target_obj__430;
                                    
                                }();
                                 return  await set_ambiguous(root_ctx,target)
                            } else {
                                  return await async function(){
                                    let __target_obj__431=(root_ctx && root_ctx["defined_lisp_globals"]);
                                    __target_obj__431[target]=assignment_value;
                                    return __target_obj__431;
                                    
                                }()
                            }
                        }
                    } ();
                    if (check_true (await verbosity(ctx))){
                        (clog)("target: ",await (await Environment.get_global("as_lisp"))(target));
                         (clog)("assignment_value: ",await (await Environment.get_global("as_lisp"))(assignment_value))
                    };
                    acc=await (async function ()  {
                        let __array_arg__434=(async function() {
                            if (check_true (((Function===await (async function(){
                                let __targ__432=(root_ctx && root_ctx["defined_lisp_globals"]);
                                if (__targ__432){
                                     return(__targ__432)[target]
                                } 
                            })())|| await (async function(){
                                let __array_op_rval__433=in_sync_ques_;
                                 if (__array_op_rval__433 instanceof Function){
                                    return await __array_op_rval__433(ctx) 
                                } else {
                                    return[__array_op_rval__433,ctx]
                                }
                            })()))){
                                  return ""
                            } else {
                                  return "await"
                            }
                        } );
                        let __array_arg__435=(async function() {
                            if (check_true ((metavalue|| (opts && opts["constant"])))){
                                  return ","
                            } else {
                                  return ""
                            }
                        } );
                        let __array_arg__436=(async function() {
                            if (check_true (metavalue)){
                                  return metavalue
                            } else {
                                 if (check_true ((opts && opts["constant"]))){
                                      return "null"
                                } else {
                                      return ""
                                }
                            }
                        } );
                        let __array_arg__437=(async function() {
                            if (check_true ((opts && opts["constant"]))){
                                  return ","
                            } else {
                                  return ""
                            }
                        } );
                        let __array_arg__438=(async function() {
                            if (check_true ((opts && opts["constant"]))){
                                  return "true"
                            } else {
                                  return ""
                            }
                        } );
                        return [{
                            ctype:"statement"
                        },await __array_arg__434()," ","Environment",".","set_global","(","","\"",(tokens && tokens["1"] && tokens["1"]["name"]),"\"",",",assignment_value,await __array_arg__435(),await __array_arg__436(),await __array_arg__437(),await __array_arg__438(),")"]
                    } )();
                     return  acc
                };
                is_token_ques_=async function(t) {
                     return  (((t instanceof Object)&& (t && t["__token__"]))|| ((t instanceof Array)&& ((t && t["0"]) instanceof Object)&& (t && t["0"] && t["0"]["__token__"])))
                };
                compile_quote=async function(lisp_struct,ctx) {
                    let acc;
                    acc=[];
                    ctx=await new_ctx(ctx);
                    acc=await compile_quotem(lisp_struct,ctx);
                     return  acc
                };
                compile_quotel=async function(lisp_struct,ctx) {
                    let acc;
                    acc=[];
                    acc=await JSON.stringify((lisp_struct && lisp_struct["1"]));
                     return  await (async function(){
                        let __array_op_rval__439=acc;
                         if (__array_op_rval__439 instanceof Function){
                            return await __array_op_rval__439() 
                        } else {
                            return[__array_op_rval__439]
                        }
                    })()
                };
                wrap_and_run=async function(js_code,ctx,run_opts) {
                    let __assembly__440= async function(){
                        return null
                    };
                    let result;
                    let fst;
                    let ctype;
                    let comp_meta;
                    let needs_braces_ques_;
                    let in_quotem;
                    let run_log;
                    let __needs_return_ques___441= async function(){
                        return await (async function ()  {
                            ctype=await (async function () {
                                 if (check_true (((js_code instanceof Array)&& await first(js_code)&& (await first(js_code) instanceof Object)&& await (async function(){
                                    let __targ__442=await first(js_code);
                                    if (__targ__442){
                                         return(__targ__442)["ctype"]
                                    } 
                                })()))){
                                      return await (async function(){
                                        let __targ__443=await first(js_code);
                                        if (__targ__443){
                                             return(__targ__443)["ctype"]
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
                                 fst=await sub_type(fst)
                            };
                             return  await async function(){
                                if (check_true( await contains_ques_("block",fst))) {
                                    if (check_true ((fst==="ifblock"))){
                                         needs_braces_ques_=true
                                    } else {
                                         needs_braces_ques_=false
                                    };
                                     return  false
                                } else if (check_true( (await first(js_code)==="throw"))) {
                                    needs_braces_ques_=false;
                                     return  false
                                } else  {
                                    needs_braces_ques_=true;
                                     return  true
                                }
                            } ()
                        } )()
                    };
                    let assembled;
                    {
                        let assembly=await __assembly__440();
                        ;
                        result=null;
                        fst=null;
                        ctype=null;
                        comp_meta=null;
                        needs_braces_ques_=false;
                        in_quotem=await get_ctx(ctx,"__IN_QUOTEM__");
                        run_log=await (async function () {
                             if (check_true ((opts && opts["quiet_mode"]))){
                                  return log
                            } else {
                                  return await defclog({
                                    prefix:"wrap_and_run",background:"#703030",color:"white"
                                })
                            } 
                        })();
                        let needs_return_ques_=await __needs_return_ques___441();
                        ;
                        assembled=null;
                        ;
                        if (check_true ((false&& await not((opts && opts["root_environment"]))&& ((first_level_setup && first_level_setup.length)===0)&& has_lisp_globals))){
                             (first_level_setup).push(["const __GG__=",env_ref,"get_global",";"])
                        };
                        assembled=await (await Environment.get_global("splice_in_return_b"))(await (await Environment.get_global("splice_in_return_a"))(js_code));
                        if (check_true ((target_namespace&& ((assembled && assembled["0"]) instanceof Object)&& await not((target_namespace===(Environment && Environment["namespace"])))))){
                            comp_meta=await first(assembled);
                            await async function(){
                                comp_meta["namespace"]=target_namespace;
                                return comp_meta;
                                
                            }();
                            if (check_true ((await verbosity(ctx)&& (comp_meta && comp_meta["namespace"])))){
                                 (run_log)("specified namespace: ",(comp_meta && comp_meta["namespace"]))
                            };
                            result=await Environment["evaluate_local"].call(Environment,await (async function(){
                                let __array_op_rval__445=comp_meta;
                                 if (__array_op_rval__445 instanceof Function){
                                    return await __array_op_rval__445(await assemble_output(assembled)) 
                                } else {
                                    return[__array_op_rval__445,await assemble_output(assembled)]
                                }
                            })(),ctx,{
                                compiled_source:true
                            });
                            if (check_true (await verbosity(ctx))){
                                 (run_log)("<- ",result)
                            };
                             return  result
                        } else {
                            assembled=await assemble_output(assembled);
                            assembled=await add(await (async function() {
                                 if (check_true (needs_braces_ques_)){
                                      return "{"
                                } else {
                                      return ""
                                } 
                            } )(),await (async function() {
                                 if (check_true (needs_return_ques_)){
                                      return " return "
                                } else {
                                      return ""
                                } 
                            } )(),assembled,await (async function() {
                                 if (check_true (needs_braces_ques_)){
                                      return "}"
                                } else {
                                      return ""
                                } 
                            } )());
                            if (check_true (await verbosity(ctx))){
                                 (run_log)("assembled: ",assembled)
                            };
                            await (async function(){
                                try /* TRY SIMPLE */ {
                                      return assembly=new AsyncFunction("Environment",assembled) 
                                } catch(__exception__446) {
                                      if (__exception__446 instanceof Error) {
                                         let e=__exception__446;
                                         {
                                            debugger;
                                            ;
                                            throw e;
                                            
                                        }
                                    } 
                                }
                            })();
                            if (check_true ((run_opts && run_opts["bind_mode"]))){
                                 assembly=await (await Environment.get_global("bind_function"))(assembly,Environment)
                            };
                            result=await (async function(){
                                let __array_op_rval__447=assembly;
                                 if (__array_op_rval__447 instanceof Function){
                                    return await __array_op_rval__447(Environment) 
                                } else {
                                    return[__array_op_rval__447,Environment]
                                }
                            })();
                            if (check_true (await verbosity(ctx))){
                                 (run_log)("<- ",result)
                            };
                             return  result
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
                        if (check_true( (lisp_tree instanceof Array))) {
                            (acc).push("[");
                            await map(async function(elem,i,t) {
                                if (check_true ((mode===1))){
                                     return  mode=0
                                } else {
                                    await async function(){
                                        if (check_true( (("=:##"===elem)|| ("=:unquotem"===elem)))) {
                                            if (check_true (in_concat)){
                                                 (acc).push(await compile_wrapper_fn(await tokenize([lisp_tree[await add(i,1)]],ctx),ctx))
                                            } else {
                                                 (acc).push(await compile_wrapper_fn(await tokenize(lisp_tree[await add(i,1)],ctx),ctx))
                                            };
                                             return  mode=1
                                        } else if (check_true( ("=$,@"===elem))) {
                                            if (check_true (await not(in_concat))){
                                                 (acc).push("].concat(")
                                            };
                                            (acc).push(await compile_wrapper_fn(await tokenize(lisp_tree[await add(i,1)],ctx),ctx));
                                            in_concat=true;
                                             return  mode=1
                                        } else  {
                                            if (check_true (in_concat)){
                                                  return await quote_tree(await (async function(){
                                                    let __array_op_rval__448=elem;
                                                     if (__array_op_rval__448 instanceof Function){
                                                        return await __array_op_rval__448() 
                                                    } else {
                                                        return[__array_op_rval__448]
                                                    }
                                                })(),ctx,acc)
                                            } else {
                                                  return await quote_tree(elem,ctx,acc)
                                            }
                                        }
                                    } ();
                                    if (check_true ((i<(t- 1)))){
                                          return (acc).push(",")
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
                        } else if (check_true( (lisp_tree instanceof Object))) {
                            (acc).push("{ ");
                            await map(async function(k,i,t) {
                                (acc).push(await JSON.stringify(k));
                                (acc).push(":");
                                await quote_tree(lisp_tree[k],ctx,acc);
                                if (check_true ((i<(t- 1)))){
                                      return (acc).push(",")
                                }
                            },await (await Environment.get_global("keys"))(lisp_tree));
                             return  (acc).push("}")
                        } else if (check_true( (lisp_tree instanceof String || typeof lisp_tree==='string'))) {
                             return (acc).push(await JSON.stringify(lisp_tree))
                        } else  {
                             return (acc).push(lisp_tree)
                        }
                    } ();
                     return  acc
                };
                quotem_log=await (async function () {
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
                    ctx=await new_ctx(ctx);
                    quoted_js=null;
                    await set_ctx(ctx,"__IN_QUOTEM__",true);
                    if (check_true (await verbosity(ctx))){
                        {
                            let __array_arg__449=(async function() {
                                if (check_true (await get_ctx(ctx,"__IN_LAMBDA__"))){
                                      return "[IN LAMBDA]"
                                } else {
                                      return ""
                                }
                            } );
                            (quotem_log)("->",await __array_arg__449(),await JSON.stringify((lisp_struct && lisp_struct["1"])))
                        }
                    };
                    if (check_true (await get_ctx(ctx,"__IN_LAMBDA__"))){
                         quoted_js=await quote_tree((lisp_struct && lisp_struct["1"]),ctx)
                    } else {
                         quoted_js=await quote_tree((lisp_struct && lisp_struct["1"]),ctx)
                    };
                    if (check_true (await verbosity(ctx))){
                         (quotem_log)("<-",await (await Environment.get_global("as_lisp"))(quoted_js))
                    };
                     return  quoted_js
                };
                compile_unquotem=async function(lisp_struct,ctx) {
                    let acc;
                    acc=[];
                    (acc).push(await compile((lisp_struct && lisp_struct["1"]),ctx));
                     return  acc
                };
                eval_log=await (async function () {
                     if (check_true ((opts && opts["quiet_mode"]))){
                          return log
                    } else {
                          return await defclog({
                            prefix:"compile_eval",background:"#705030",color:"white"
                        })
                    } 
                })();
                compile_eval=async function(tokens,ctx) {
                    let __assembly__450= async function(){
                        return null
                    };
                    let type_mark;
                    let acc;
                    let preamble;
                    let result;
                    {
                        let assembly=await __assembly__450();
                        ;
                        type_mark=null;
                        acc=[];
                        preamble=await calling_preamble(ctx);
                        result=null;
                        assembly=await compile((tokens && tokens["1"]),ctx);
                        if (check_true (await verbosity(ctx))){
                             (eval_log)("assembly:",await clone(assembly))
                        };
                        has_lisp_globals=true;
                        result=["(","await"," ","Environment",".","eval","(",(preamble && preamble["0"])," ",(preamble && preamble["1"])," ","function","()",["{","return"," ",assembly,"}","()",")",")"]];
                         return  result
                    }
                };
                compile_debug=async function(tokens,ctx) {
                     return  [{
                        ctype:"statement"
                    },"debugger",";"]
                };
                compile_for_each=async function(tokens,ctx) {
                    let preamble;
                    preamble=await calling_preamble(ctx);
                    ;
                     return  await (async function(){
                        let __array_op_rval__451=(preamble && preamble["2"]);
                         if (__array_op_rval__451 instanceof Function){
                            return await __array_op_rval__451((preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ","{",await compile_for_each_inner(tokens,ctx,preamble)," ","}",")","()") 
                        } else {
                            return[__array_op_rval__451,(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ","{",await compile_for_each_inner(tokens,ctx,preamble)," ","}",")","()"]
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
                    ctx=await new_ctx(ctx);
                    idx_iter=await gen_temp_name("iter");
                    idx_iters=[];
                    element_list=await gen_temp_name("elements");
                    body_function_ref=await gen_temp_name("for_body");
                    collector_ref=await gen_temp_name("array");
                    prebuild=[];
                    for_args=(tokens && tokens["1"] && tokens["1"]["val"]);
                    iterator_ref=(for_args && for_args["0"]);
                    elements=await last(for_args);
                    iter_count=await (async function () {
                         if (check_true (for_args)){
                              return ((for_args && for_args.length)- 1)
                        } else {
                              return 0
                        } 
                    })();
                    for_body=(tokens && tokens["2"]);
                    body_is_block_ques_=await (async function(){
                        let __array_op_rval__452=is_block_ques_;
                         if (__array_op_rval__452 instanceof Function){
                            return await __array_op_rval__452((for_body && for_body["val"])) 
                        } else {
                            return[__array_op_rval__452,(for_body && for_body["val"])]
                        }
                    })();
                    if (check_true ((iter_count<1))){
                        throw new SyntaxError("Invalid for_each arguments");
                        
                    };
                    await (async function() {
                        let __for_body__455=async function(iter_idx) {
                            (idx_iters).push(for_args[iter_idx]);
                             return  await set_ctx(ctx,await clean_quoted_reference(await (async function(){
                                let __targ__457=await last(idx_iters);
                                if (__targ__457){
                                     return(__targ__457)["name"]
                                } 
                            })()),ArgumentType)
                        };
                        let __array__456=[],__elements__454=await (await Environment.get_global("range"))(iter_count);
                        let __BREAK__FLAG__=false;
                        for(let __iter__453 in __elements__454) {
                            __array__456.push(await __for_body__455(__elements__454[__iter__453]));
                            if(__BREAK__FLAG__) {
                                 __array__456.pop();
                                break;
                                
                            }
                        }return __array__456;
                         
                    })();
                    await set_ctx(ctx,collector_ref,ArgumentType);
                    await set_ctx(ctx,element_list,"arg");
                    if (check_true (await not(body_is_block_ques_))){
                         for_body=await make_do_block(for_body)
                    };
                    prebuild=await build_fn_with_assignment(body_function_ref,(for_body && for_body["val"]),idx_iters,ctx);
                    await async function(){
                        ctx["return_last_value"]=true;
                        return ctx;
                        
                    }();
                    (acc).push(await compile(prebuild,ctx));
                    await (async function() {
                        let __for_body__461=async function(t) {
                             return  (acc).push(t)
                        };
                        let __array__462=[],__elements__460=["let"," ",collector_ref,"=","[]",",",element_list,"=",await wrap_assignment_value(await compile(elements,ctx),ctx),";"];
                        let __BREAK__FLAG__=false;
                        for(let __iter__459 in __elements__460) {
                            __array__462.push(await __for_body__461(__elements__460[__iter__459]));
                            if(__BREAK__FLAG__) {
                                 __array__462.pop();
                                break;
                                
                            }
                        }return __array__462;
                         
                    })();
                    await (async function() {
                        let __for_body__465=async function(t) {
                             return  (acc).push(t)
                        };
                        let __array__466=[],__elements__464=["let"," ",break_out,"=","false",";"];
                        let __BREAK__FLAG__=false;
                        for(let __iter__463 in __elements__464) {
                            __array__466.push(await __for_body__465(__elements__464[__iter__463]));
                            if(__BREAK__FLAG__) {
                                 __array__466.pop();
                                break;
                                
                            }
                        }return __array__466;
                         
                    })();
                    if (check_true (await (await Environment.get_global("blank?"))((preamble && preamble["0"])))){
                         await set_ctx(ctx,body_function_ref,Function)
                    } else {
                         await set_ctx(ctx,body_function_ref,AsyncFunction)
                    };
                    await async function(){
                        if (check_true( (((for_args && for_args.length)===2)&& await not(((for_args && for_args["1"]) instanceof Array))))) {
                            await set_ctx(ctx,idx_iter,NumberType);
                            await (async function() {
                                let __for_body__469=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__470=[],__elements__468=["for","(","let"," ",idx_iter," ","in"," ",element_list,")"," ","{"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__467 in __elements__468) {
                                    __array__470.push(await __for_body__469(__elements__468[__iter__467]));
                                    if(__BREAK__FLAG__) {
                                         __array__470.pop();
                                        break;
                                        
                                    }
                                }return __array__470;
                                 
                            })();
                            await (async function() {
                                let __for_body__473=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__474=[],__elements__472=await (async function(){
                                    let __array_op_rval__475=collector_ref;
                                     if (__array_op_rval__475 instanceof Function){
                                        return await __array_op_rval__475(".","push","(",(preamble && preamble["0"])," ",body_function_ref,"(",element_list,"[",idx_iter,"]",")",")",";") 
                                    } else {
                                        return[__array_op_rval__475,".","push","(",(preamble && preamble["0"])," ",body_function_ref,"(",element_list,"[",idx_iter,"]",")",")",";"]
                                    }
                                })();
                                let __BREAK__FLAG__=false;
                                for(let __iter__471 in __elements__472) {
                                    __array__474.push(await __for_body__473(__elements__472[__iter__471]));
                                    if(__BREAK__FLAG__) {
                                         __array__474.pop();
                                        break;
                                        
                                    }
                                }return __array__474;
                                 
                            })();
                            await (async function() {
                                let __for_body__478=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__479=[],__elements__477=["if","(",break_out,")"," ","{"," ",collector_ref,".","pop","()",";","break",";","}"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__476 in __elements__477) {
                                    __array__479.push(await __for_body__478(__elements__477[__iter__476]));
                                    if(__BREAK__FLAG__) {
                                         __array__479.pop();
                                        break;
                                        
                                    }
                                }return __array__479;
                                 
                            })();
                             return  (acc).push("}")
                        }
                    } ();
                    (acc).push("return");
                    (acc).push(" ");
                    (acc).push(collector_ref);
                    (acc).push(";");
                     return  acc
                };
                compile_while=async function(tokens,ctx) {
                    let acc;
                    let idx;
                    let preamble;
                    let test_condition;
                    let test_condition_ref;
                    let body;
                    let body_ref;
                    let prebuild;
                    acc=[];
                    idx=0;
                    ctx=await new_ctx(ctx);
                    preamble=await calling_preamble(ctx);
                    test_condition=(tokens && tokens["1"]);
                    test_condition_ref=await gen_temp_name("test_condition");
                    body=(tokens && tokens["2"]);
                    body_ref=await gen_temp_name("body_ref");
                    prebuild=[];
                    ;
                    await set_ctx(ctx,break_out,true);
                    if (check_true ((test_condition && test_condition["ref"]))){
                         (prebuild).push(await compile(await build_fn_with_assignment(test_condition_ref,(test_condition && test_condition["name"]),null,ctx),ctx))
                    } else {
                         (prebuild).push(await compile(await build_fn_with_assignment(test_condition_ref,(test_condition && test_condition["val"]),null,ctx),ctx))
                    };
                    (prebuild).push(await compile(await build_fn_with_assignment(body_ref,(body && body["val"]),null,ctx),ctx));
                    await (async function() {
                        let __for_body__482=async function(t) {
                             return  (prebuild).push(t)
                        };
                        let __array__483=[],__elements__481=["let"," ",break_out,"=","false",";"];
                        let __BREAK__FLAG__=false;
                        for(let __iter__480 in __elements__481) {
                            __array__483.push(await __for_body__482(__elements__481[__iter__480]));
                            if(__BREAK__FLAG__) {
                                 __array__483.pop();
                                break;
                                
                            }
                        }return __array__483;
                         
                    })();
                    await (async function() {
                        let __for_body__486=async function(t) {
                             return  (prebuild).push(t)
                        };
                        let __array__487=[],__elements__485=["while","(",(preamble && preamble["0"])," ",test_condition_ref,"()",")"," ","{",(preamble && preamble["0"])," ",body_ref,"()",";"," ","if","(",break_out,")"," ","{"," ","break",";","}","}"," ","",";"];
                        let __BREAK__FLAG__=false;
                        for(let __iter__484 in __elements__485) {
                            __array__487.push(await __for_body__486(__elements__485[__iter__484]));
                            if(__BREAK__FLAG__) {
                                 __array__487.pop();
                                break;
                                
                            }
                        }return __array__487;
                         
                    })();
                    await (async function() {
                        let __for_body__490=async function(t) {
                             return  (acc).push(t)
                        };
                        let __array__491=[],__elements__489=[(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()","{"," ",prebuild,"}",")","()"];
                        let __BREAK__FLAG__=false;
                        for(let __iter__488 in __elements__489) {
                            __array__491.push(await __for_body__490(__elements__489[__iter__488]));
                            if(__BREAK__FLAG__) {
                                 __array__491.pop();
                                break;
                                
                            }
                        }return __array__491;
                         
                    })();
                     return  acc
                };
                compile_for_with=async function(tokens,ctx,preamble) {
                    preamble=await calling_preamble(ctx);
                    ;
                     return  [(preamble && preamble["2"]),(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ","{",await compile_for_with_inner(tokens,ctx,preamble)," ","}",")","()"]
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
                    ctx=await new_ctx(ctx);
                    iter_ref=await gen_temp_name("iter");
                    idx_iters=[];
                    generator_expression=await gen_temp_name("elements");
                    body_function_ref=await gen_temp_name("for_body");
                    prebuild=[];
                    for_args=(tokens && tokens["1"] && tokens["1"]["val"]);
                    iterator_ref=(for_args && for_args["0"]);
                    elements=await last(for_args);
                    iter_count=await (async function () {
                         if (check_true (for_args)){
                              return ((for_args && for_args.length)- 1)
                        } else {
                              return 0
                        } 
                    })();
                    for_body=(tokens && tokens["2"]);
                    body_is_block_ques_=await (async function(){
                        let __array_op_rval__492=is_block_ques_;
                         if (__array_op_rval__492 instanceof Function){
                            return await __array_op_rval__492((for_body && for_body["val"])) 
                        } else {
                            return[__array_op_rval__492,(for_body && for_body["val"])]
                        }
                    })();
                    if (check_true ((iter_count<1))){
                        throw new SyntaxError("Invalid for_each arguments");
                        
                    };
                    await (async function() {
                        let __for_body__495=async function(iter_ref) {
                            (idx_iters).push(for_args[iter_ref]);
                             return  await set_ctx(ctx,await clean_quoted_reference(await (async function(){
                                let __targ__497=await last(idx_iters);
                                if (__targ__497){
                                     return(__targ__497)["name"]
                                } 
                            })()),ArgumentType)
                        };
                        let __array__496=[],__elements__494=await (await Environment.get_global("range"))(iter_count);
                        let __BREAK__FLAG__=false;
                        for(let __iter__493 in __elements__494) {
                            __array__496.push(await __for_body__495(__elements__494[__iter__493]));
                            if(__BREAK__FLAG__) {
                                 __array__496.pop();
                                break;
                                
                            }
                        }return __array__496;
                         
                    })();
                    await set_ctx(ctx,generator_expression,"arg");
                    if (check_true (await not(body_is_block_ques_))){
                         for_body=await make_do_block(for_body)
                    };
                    prebuild=await build_fn_with_assignment(body_function_ref,(for_body && for_body["val"]),idx_iters,ctx);
                    await async function(){
                        ctx["return_last_value"]=true;
                        return ctx;
                        
                    }();
                    (acc).push(await compile(prebuild,ctx));
                    await (async function() {
                        let __for_body__501=async function(t) {
                             return  (acc).push(t)
                        };
                        let __array__502=[],__elements__500=["let"," ",break_out,"=","false",";"];
                        let __BREAK__FLAG__=false;
                        for(let __iter__499 in __elements__500) {
                            __array__502.push(await __for_body__501(__elements__500[__iter__499]));
                            if(__BREAK__FLAG__) {
                                 __array__502.pop();
                                break;
                                
                            }
                        }return __array__502;
                         
                    })();
                    await set_ctx(ctx,body_function_ref,AsyncFunction);
                    await async function(){
                        if (check_true( (((for_args && for_args.length)===2)&& await not(((for_args && for_args["1"]) instanceof Array))))) {
                            await (async function() {
                                let __for_body__505=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__506=[],__elements__504=["for"," ",(preamble && preamble["0"])," ","(","const"," ",iter_ref," ","of"," ",await wrap_assignment_value(await compile(elements,ctx),ctx),")"," ","{"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__503 in __elements__504) {
                                    __array__506.push(await __for_body__505(__elements__504[__iter__503]));
                                    if(__BREAK__FLAG__) {
                                         __array__506.pop();
                                        break;
                                        
                                    }
                                }return __array__506;
                                 
                            })();
                            await (async function() {
                                let __for_body__509=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__510=[],__elements__508=await (async function(){
                                    let __array_op_rval__511=(preamble && preamble["0"]);
                                     if (__array_op_rval__511 instanceof Function){
                                        return await __array_op_rval__511(" ",body_function_ref,"(",iter_ref,")",";") 
                                    } else {
                                        return[__array_op_rval__511," ",body_function_ref,"(",iter_ref,")",";"]
                                    }
                                })();
                                let __BREAK__FLAG__=false;
                                for(let __iter__507 in __elements__508) {
                                    __array__510.push(await __for_body__509(__elements__508[__iter__507]));
                                    if(__BREAK__FLAG__) {
                                         __array__510.pop();
                                        break;
                                        
                                    }
                                }return __array__510;
                                 
                            })();
                            await (async function() {
                                let __for_body__514=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__515=[],__elements__513=["if","(",break_out,")"," ","break",";"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__512 in __elements__513) {
                                    __array__515.push(await __for_body__514(__elements__513[__iter__512]));
                                    if(__BREAK__FLAG__) {
                                         __array__515.pop();
                                        break;
                                        
                                    }
                                }return __array__515;
                                 
                            })();
                             return  (acc).push("}")
                        }
                    } ();
                     return  acc
                };
                silence=async function() {
                     return  false
                };
                verbosity=silence;
                check_verbosity=async function(ctx) {
                     return  (await get_ctx(ctx,"__VERBOSITY__")|| await Environment["get_global"].call(Environment,"__VERBOSITY__"))
                };
                declare_log=await (async function () {
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
                        let __for_body__518=async function(exp) {
                            declaration=(exp && exp["val"] && exp["val"]["0"] && exp["val"]["0"]["name"]);
                            targeted=await (await Environment.get_global("rest"))((exp && exp["val"]));
                            if (check_true (await (async function(){
                                let __array_op_rval__520=verbosity;
                                 if (__array_op_rval__520 instanceof Function){
                                    return await __array_op_rval__520(ctx) 
                                } else {
                                    return[__array_op_rval__520,ctx]
                                }
                            })())){
                                 (declare_log)("declaration: ",declaration,"targeted: ",await (await Environment.get_global("each"))(targeted,"name"),targeted)
                            };
                             return  await async function(){
                                if (check_true( (declaration==="toplevel"))) {
                                    await async function(){
                                        opts["root_environment"]=(targeted && targeted["0"]);
                                        return opts;
                                        
                                    }();
                                    if (check_true ((opts && opts["root_environment"]))){
                                          return env_ref=""
                                    } else {
                                          return env_ref="Environment."
                                    }
                                } else if (check_true( (declaration==="include"))) {
                                     return  await (async function() {
                                        let __for_body__524=async function(name) {
                                            sanitized_name=await sanitize_js_ref_name(name);
                                            dec_struct=await get_declaration_details(ctx,name);
                                            if (check_true (dec_struct)){
                                                await (async function() {
                                                    let __for_body__528=async function(t) {
                                                         return  (acc).push(t)
                                                    };
                                                    let __array__529=[],__elements__527=["let"," ",sanitized_name,"="];
                                                    let __BREAK__FLAG__=false;
                                                    for(let __iter__526 in __elements__527) {
                                                        __array__529.push(await __for_body__528(__elements__527[__iter__526]));
                                                        if(__BREAK__FLAG__) {
                                                             __array__529.pop();
                                                            break;
                                                            
                                                        }
                                                    }return __array__529;
                                                     
                                                })();
                                                await async function(){
                                                    if (check_true( ((dec_struct && dec_struct["value"]) instanceof Function&& await (async function(){
                                                        let __targ__531=await (async function(){
                                                            let __targ__530=(Environment && Environment["definitions"]);
                                                            if (__targ__530){
                                                                 return(__targ__530)[name]
                                                            } 
                                                        })();
                                                        if (__targ__531){
                                                             return(__targ__531)["fn_body"]
                                                        } 
                                                    })()))) {
                                                        details=await (async function(){
                                                            let __targ__532=(Environment && Environment["definitions"]);
                                                            if (__targ__532){
                                                                 return(__targ__532)[name]
                                                            } 
                                                        })();
                                                        source=("(fn "+ (details && details["fn_args"])+ " "+ (details && details["fn_body"])+ ")");
                                                        source=await compile(await tokenize(await (await Environment.get_global("read_lisp"))(source),ctx),ctx,1000);
                                                        (acc).push(source);
                                                         await set_ctx(ctx,name,AsyncFunction)
                                                    } else if (check_true( (dec_struct && dec_struct["value"]) instanceof Function)) {
                                                        (acc).push(await (async function() {
                                                            {
                                                                 let __call_target__=await (dec_struct && dec_struct["value"])["toString"](), __call_method__="replace";
                                                                return await __call_target__[__call_method__].call(__call_target__,"\n","")
                                                            } 
                                                        })());
                                                         await set_ctx(ctx,name,AsyncFunction)
                                                    } else  {
                                                        (acc).push(await (dec_struct && dec_struct["value"])["toString"]());
                                                         await set_ctx(ctx,name,ArgumentType)
                                                    }
                                                } ();
                                                 (acc).push(";")
                                            };
                                            await set_declaration(ctx,name,"inlined",true);
                                            if (check_true ((("undefined"===await (async function(){
                                                let __targ__533=await get_declarations(ctx,name);
                                                if (__targ__533){
                                                     return(__targ__533)["type"]
                                                } 
                                            })())&& (dec_struct && dec_struct["value"]) instanceof Function))){
                                                  return await set_declaration(ctx,name,"type",Function)
                                            }
                                        };
                                        let __array__525=[],__elements__523=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__522 in __elements__523) {
                                            __array__525.push(await __for_body__524(__elements__523[__iter__522]));
                                            if(__BREAK__FLAG__) {
                                                 __array__525.pop();
                                                break;
                                                
                                            }
                                        }return __array__525;
                                         
                                    })()
                                } else if (check_true( (declaration==="verbose"))) {
                                    let verbosity_level=await parseInt(await first(await (await Environment.get_global("each"))(targeted,"name")));
                                    ;
                                    if (check_true (await not(await isNaN(verbosity_level)))){
                                        if (check_true ((verbosity_level>0))){
                                             await set_ctx(ctx,"__VERBOSITY__",verbosity_level)
                                        } else {
                                            (declare_log)("verbosity: turned off");
                                            verbosity=silence;
                                             await set_ctx(ctx,"__VERBOSITY__",null)
                                        };
                                        verbosity=check_verbosity;
                                         return  (declare_log)("compiler: verbosity set: ",await (async function(){
                                            let __array_op_rval__534=verbosity;
                                             if (__array_op_rval__534 instanceof Function){
                                                return await __array_op_rval__534(ctx) 
                                            } else {
                                                return[__array_op_rval__534,ctx]
                                            }
                                        })())
                                    } else {
                                         (warnings).push("invalid verbosity declaration, expected number, received ")
                                    }
                                } else if (check_true( (declaration==="local"))) {
                                     return await (async function() {
                                        let __for_body__537=async function(name) {
                                            dec_struct=await get_declaration_details(ctx,name);
                                             return  await set_ctx(ctx,name,(dec_struct && dec_struct["value"]))
                                        };
                                        let __array__538=[],__elements__536=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__535 in __elements__536) {
                                            __array__538.push(await __for_body__537(__elements__536[__iter__535]));
                                            if(__BREAK__FLAG__) {
                                                 __array__538.pop();
                                                break;
                                                
                                            }
                                        }return __array__538;
                                         
                                    })()
                                } else if (check_true( (declaration==="function"))) {
                                     return  await (async function() {
                                        let __for_body__541=async function(name) {
                                             return  await set_declaration(ctx,name,"type",Function)
                                        };
                                        let __array__542=[],__elements__540=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__539 in __elements__540) {
                                            __array__542.push(await __for_body__541(__elements__540[__iter__539]));
                                            if(__BREAK__FLAG__) {
                                                 __array__542.pop();
                                                break;
                                                
                                            }
                                        }return __array__542;
                                         
                                    })()
                                } else if (check_true( (declaration==="fn"))) {
                                     return  await (async function() {
                                        let __for_body__545=async function(name) {
                                             return  await set_declaration(ctx,name,"type",AsyncFunction)
                                        };
                                        let __array__546=[],__elements__544=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__543 in __elements__544) {
                                            __array__546.push(await __for_body__545(__elements__544[__iter__543]));
                                            if(__BREAK__FLAG__) {
                                                 __array__546.pop();
                                                break;
                                                
                                            }
                                        }return __array__546;
                                         
                                    })()
                                } else if (check_true( (declaration==="array"))) {
                                     return  await (async function() {
                                        let __for_body__549=async function(name) {
                                             return  await set_declaration(ctx,name,"type",Array)
                                        };
                                        let __array__550=[],__elements__548=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__547 in __elements__548) {
                                            __array__550.push(await __for_body__549(__elements__548[__iter__547]));
                                            if(__BREAK__FLAG__) {
                                                 __array__550.pop();
                                                break;
                                                
                                            }
                                        }return __array__550;
                                         
                                    })()
                                } else if (check_true( (declaration==="number"))) {
                                     return  await (async function() {
                                        let __for_body__553=async function(name) {
                                             return  await set_declaration(ctx,name,"type",NumberType)
                                        };
                                        let __array__554=[],__elements__552=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__551 in __elements__552) {
                                            __array__554.push(await __for_body__553(__elements__552[__iter__551]));
                                            if(__BREAK__FLAG__) {
                                                 __array__554.pop();
                                                break;
                                                
                                            }
                                        }return __array__554;
                                         
                                    })()
                                } else if (check_true( (declaration==="string"))) {
                                     return  await (async function() {
                                        let __for_body__557=async function(name) {
                                             return  await set_declaration(ctx,name,"type",StringType)
                                        };
                                        let __array__558=[],__elements__556=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__555 in __elements__556) {
                                            __array__558.push(await __for_body__557(__elements__556[__iter__555]));
                                            if(__BREAK__FLAG__) {
                                                 __array__558.pop();
                                                break;
                                                
                                            }
                                        }return __array__558;
                                         
                                    })()
                                } else if (check_true( (declaration==="boolean"))) {
                                     return  await (async function() {
                                        let __for_body__561=async function(name) {
                                             return  await set_declaration(ctx,name,"type",Boolean)
                                        };
                                        let __array__562=[],__elements__560=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__559 in __elements__560) {
                                            __array__562.push(await __for_body__561(__elements__560[__iter__559]));
                                            if(__BREAK__FLAG__) {
                                                 __array__562.pop();
                                                break;
                                                
                                            }
                                        }return __array__562;
                                         
                                    })()
                                } else if (check_true( (declaration==="regexp"))) {
                                     return  await (async function() {
                                        let __for_body__565=async function(name) {
                                             return  await set_declaration(ctx,name,"type",RegExp)
                                        };
                                        let __array__566=[],__elements__564=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__563 in __elements__564) {
                                            __array__566.push(await __for_body__565(__elements__564[__iter__563]));
                                            if(__BREAK__FLAG__) {
                                                 __array__566.pop();
                                                break;
                                                
                                            }
                                        }return __array__566;
                                         
                                    })()
                                } else if (check_true( (declaration==="object"))) {
                                     return  await (async function() {
                                        let __for_body__569=async function(name) {
                                             return  await set_declaration(ctx,name,"type",Object)
                                        };
                                        let __array__570=[],__elements__568=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__567 in __elements__568) {
                                            __array__570.push(await __for_body__569(__elements__568[__iter__567]));
                                            if(__BREAK__FLAG__) {
                                                 __array__570.pop();
                                                break;
                                                
                                            }
                                        }return __array__570;
                                         
                                    })()
                                } else if (check_true( (declaration==="global"))) {
                                     return  await (async function() {
                                        let __for_body__573=async function(name) {
                                             return  await set_declaration(ctx,name,"location","global")
                                        };
                                        let __array__574=[],__elements__572=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__571 in __elements__572) {
                                            __array__574.push(await __for_body__573(__elements__572[__iter__571]));
                                            if(__BREAK__FLAG__) {
                                                 __array__574.pop();
                                                break;
                                                
                                            }
                                        }return __array__574;
                                         
                                    })()
                                } else if (check_true( (declaration==="optimize"))) {
                                     return  await (async function() {
                                        let __for_body__577=async function(factor) {
                                            factor=await (await Environment.get_global("each"))(factor,"name");
                                             return  await async function(){
                                                if (check_true( ((factor && factor["0"])==="safety"))) {
                                                     return await set_declaration(ctx,"__SAFETY__","level",(factor && factor["1"]))
                                                }
                                            } ()
                                        };
                                        let __array__578=[],__elements__576=await (await Environment.get_global("each"))(targeted,"val");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__575 in __elements__576) {
                                            __array__578.push(await __for_body__577(__elements__576[__iter__575]));
                                            if(__BREAK__FLAG__) {
                                                 __array__578.pop();
                                                break;
                                                
                                            }
                                        }return __array__578;
                                         
                                    })()
                                } else if (check_true( (declaration==="namespace"))) {
                                    if (check_true (await not(((targeted && targeted.length)===1)))){
                                        throw new SyntaxError("namespace declaration requires exactly 1 value");
                                        
                                    };
                                    if (check_true (await get_ctx(ctx,"__IN_LAMBDA__"))){
                                        throw new SyntaxError("namespace compiler declaration must be toplevel");
                                        
                                    };
                                    target_namespace=(targeted && targeted["0"] && targeted["0"]["name"]);
                                     return  Environment=await Environment["get_namespace_handle"].call(Environment,(targeted && targeted["0"] && targeted["0"]["name"]))
                                } else  {
                                    (warnings).push(("unknown declaration directive: "+ declaration));
                                     return  await (await Environment.get_global("warn"))(("compiler: unknown declaration directive: "+ declaration))
                                }
                            } ()
                        };
                        let __array__519=[],__elements__517=expressions;
                        let __BREAK__FLAG__=false;
                        for(let __iter__516 in __elements__517) {
                            __array__519.push(await __for_body__518(__elements__517[__iter__516]));
                            if(__BREAK__FLAG__) {
                                 __array__519.pop();
                                break;
                                
                            }
                        }return __array__519;
                         
                    })();
                     return  acc
                };
                safety_level=async function(ctx) {
                    if (check_true (ctx)){
                        let safety=await get_declarations(ctx,"__SAFETY__");
                        ;
                        if (check_true (safety)){
                              return (safety && safety["level"])
                        } else {
                              return default_safety_level
                        }
                    }
                };
                get_scoped_type=async function(name) {
                    let rtype;
                    rtype=await get_ctx(ctx,name);
                    if (check_true ((undefined===rtype))){
                          return await sub_type(await get_lisp_ctx(name))
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
                    let check_statement;
                    let token;
                    acc=[];
                    idx=0;
                    ref_type=null;
                    rval=null;
                    stmt=null;
                    preamble=await calling_preamble(ctx);
                    sr_log=await defclog({
                        prefix:("compile_scoped_reference ("+ ((ctx && ctx["block_id"])|| "-")+ "):"),background:"steelblue",color:"white"
                    });
                    val=null;
                    call_type=await async function(){
                        if (check_true( await not((tokens && tokens["0"] && tokens["0"]["ref"])))) {
                             return "literal"
                        } else if (check_true( await get_ctx_val(ctx,(tokens && tokens["0"] && tokens["0"]["name"])))) {
                             return "local"
                        } else if (check_true( await get_lisp_ctx((tokens && tokens["0"] && tokens["0"]["name"])))) {
                             return "lisp"
                        }
                    } ();
                    check_statement=async function(stmt) {
                        if (check_true (await check_needs_wrap(stmt))){
                            if (check_true (((stmt && stmt["0"] && stmt["0"]["ctype"])==="ifblock"))){
                                  return [(preamble && preamble["2"]),(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ","{"," ",stmt," ","}"," ",")","()"]
                            } else {
                                  return [(preamble && preamble["2"]),(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ",stmt," ",")","()"]
                            }
                        } else {
                              return stmt
                        }
                    };
                    token=null;
                    ;
                    await async function(){
                        if (check_true( (call_type==="lisp"))) {
                             return ref_type=await get_lisp_ctx((tokens && tokens["0"] && tokens["0"]["name"]))
                        } else if (check_true( (call_type==="local"))) {
                             return ref_type=await get_ctx_val(ctx,(tokens && tokens["0"] && tokens["0"]["name"]))
                        } else  {
                             return ref_type=ArgumentType
                        }
                    } ();
                    await async function(){
                        if (check_true( (ref_type===AsyncFunction))) {
                             return ref_type="AsyncFunction"
                        } else if (check_true( (ref_type===Expression))) {
                             return ref_type=ArgumentType
                        } else if (check_true( (ref_type===Function))) {
                             return ref_type="Function"
                        } else if (check_true( (ref_type===Array))) {
                             return ref_type="Array"
                        } else if (check_true( (ref_type===NilType))) {
                             return ref_type="nil"
                        } else if (check_true( (ref_type===NumberType))) {
                             return ref_type=ArgumentType
                        } else if (check_true( (ref_type===StringType))) {
                             return ref_type="StringType"
                        } else if (check_true( (ref_type===ArgumentType))) {
                             return true
                        } else  {
                             return ref_type=await sub_type(ref_type)
                        }
                    } ();
                    if (check_true (await (async function(){
                        let __array_op_rval__579=verbosity;
                         if (__array_op_rval__579 instanceof Function){
                            return await __array_op_rval__579(ctx) 
                        } else {
                            return[__array_op_rval__579,ctx]
                        }
                    })())){
                        {
                            let __array_arg__580=(async function() {
                                if (check_true (("local"===call_type))){
                                      return (" local sanitized to: "+ await sanitize_js_ref_name((tokens && tokens["0"] && tokens["0"]["name"])))
                                }
                            } );
                            (sr_log)("SYMBOL: ",(tokens && tokens["0"] && tokens["0"]["name"]),"  found as:",call_type," of type:",ref_type,"sanitized as: ",await __array_arg__580())
                        }
                    };
                    rval=await async function(){
                        if (check_true( (ref_type==="AsyncFunction"))) {
                            (acc).push((preamble && preamble["0"]));
                            (acc).push(" ");
                            (acc).push(await (async function () {
                                 if (check_true ((call_type==="lisp"))){
                                      return await compile_lisp_scoped_reference((tokens && tokens["0"] && tokens["0"]["name"]),ctx)
                                } else {
                                      return await sanitize_js_ref_name((tokens && tokens["0"] && tokens["0"]["name"]))
                                } 
                            })());
                            (acc).push("(");
                            await (async function(){
                                 let __test_condition__581=async function() {
                                     return  (idx<((tokens && tokens.length)- 1))
                                };
                                let __body_ref__582=async function() {
                                    idx+=1;
                                    token=tokens[idx];
                                    stmt=await compile(token,ctx);
                                    stmt=await check_statement(stmt);
                                    (acc).push(stmt);
                                    if (check_true ((idx<((tokens && tokens.length)- 1)))){
                                         return  (acc).push(",")
                                    }
                                };
                                let __BREAK__FLAG__=false;
                                while(await __test_condition__581()) {
                                    await __body_ref__582();
                                     if(__BREAK__FLAG__) {
                                         break;
                                        
                                    }
                                } ;
                                
                            })();
                            (acc).push(")");
                             return  acc
                        } else if (check_true( (ref_type==="Function"))) {
                            (acc).push((preamble && preamble["0"]));
                            (acc).push(" ");
                            (acc).push(await (async function () {
                                 if (check_true ((call_type==="lisp"))){
                                      return await compile_lisp_scoped_reference((tokens && tokens["0"] && tokens["0"]["name"]),ctx)
                                } else {
                                      return await sanitize_js_ref_name((tokens && tokens["0"] && tokens["0"]["name"]))
                                } 
                            })());
                            (acc).push("(");
                            await (async function(){
                                 let __test_condition__583=async function() {
                                     return  (idx<((tokens && tokens.length)- 1))
                                };
                                let __body_ref__584=async function() {
                                    idx+=1;
                                    token=tokens[idx];
                                    stmt=await compile(token,ctx);
                                    stmt=await check_statement(stmt);
                                    (acc).push(stmt);
                                    if (check_true ((idx<((tokens && tokens.length)- 1)))){
                                         return  (acc).push(",")
                                    }
                                };
                                let __BREAK__FLAG__=false;
                                while(await __test_condition__583()) {
                                    await __body_ref__584();
                                     if(__BREAK__FLAG__) {
                                         break;
                                        
                                    }
                                } ;
                                
                            })();
                            (acc).push(")");
                             return  acc
                        } else if (check_true( ((call_type==="local")&& ((ref_type==="NumberType")|| (ref_type==="StringType")|| (ref_type==="Boolean"))))) {
                            (acc).push((tokens && tokens["0"] && tokens["0"]["name"]));
                             return  acc
                        } else if (check_true( ((call_type==="local")&& await not((ref_type===ArgumentType))&& (tokens instanceof Array)))) {
                            val=await get_ctx_val(ctx,(tokens && tokens["0"] && tokens["0"]["name"]));
                            (acc).push(val);
                             return  acc
                        } else if (check_true( ((ref_type===ArgumentType)&& (tokens instanceof Array)))) {
                            (acc).push("[");
                            await (async function(){
                                 let __test_condition__585=async function() {
                                     return  (idx<(tokens && tokens.length))
                                };
                                let __body_ref__586=async function() {
                                    token=tokens[idx];
                                    (acc).push(await compile(token,ctx));
                                    if (check_true ((idx<((tokens && tokens.length)- 1)))){
                                         (acc).push(",")
                                    };
                                     return  idx+=1
                                };
                                let __BREAK__FLAG__=false;
                                while(await __test_condition__585()) {
                                    await __body_ref__586();
                                     if(__BREAK__FLAG__) {
                                         break;
                                        
                                    }
                                } ;
                                
                            })();
                            (acc).push("]");
                             return  acc
                        } else if (check_true( (ref_type===ArgumentType))) {
                            (acc).push((tokens && tokens["0"] && tokens["0"]["name"]));
                             return  acc
                        } else if (check_true( (ref_type==="undefined"))) {
                            throw new ReferenceError(("unknown reference: "+ (tokens && tokens["0"] && tokens["0"]["name"])));
                            
                        } else if (check_true( (call_type==="lisp"))) {
                             return  await compile_lisp_scoped_reference((tokens && tokens["0"] && tokens["0"]["name"]),ctx)
                        } else  {
                            (acc).push((tokens && tokens["0"] && tokens["0"]["name"]));
                             return  acc
                        }
                    } ();
                    if (check_true (false)){
                         await async function(){
                            if (check_true( ((ref_type==="AsyncFunction")|| (ref_type==="Function")))) {
                                 return (acc).unshift({
                                    ctype:ref_type
                                })
                            }
                        } ()
                    };
                     return  acc
                };
                compile_lisp_scoped_reference=async function(refname,ctx,defer_not_found) {
                    let refval;
                    let reftype;
                    let declarations;
                    let preamble;
                    let basename;
                    refval=await get_lisp_ctx(refname);
                    reftype=await sub_type(refval);
                    declarations=null;
                    preamble=await calling_preamble(ctx);
                    basename=await (await Environment.get_global("get_object_path"))(refname);
                    ;
                    declarations=await add(new Object(),await get_declarations(ctx,refname),await get_declaration_details(ctx,refname));
                    if (check_true ((declarations && declarations["inlined"]))){
                         refname=await sanitize_js_ref_name(refname)
                    };
                    if (check_true ((((reftype==="StringType")|| (reftype==="String"))&& await not((refval===undefined))))){
                         refval="text"
                    };
                     return  await async function(){
                        if (check_true( await contains_ques_((basename && basename["0"]),standard_types))) {
                             return refname
                        } else if (check_true((declarations && declarations["inlined"]))) {
                             return refname
                        } else if (check_true( await not((refval===undefined)))) {
                            has_lisp_globals=true;
                            if (check_true (await (async function(){
                                let __array_op_rval__587=verbosity;
                                 if (__array_op_rval__587 instanceof Function){
                                    return await __array_op_rval__587(ctx) 
                                } else {
                                    return[__array_op_rval__587,ctx]
                                }
                            })())){
                                 await console.log("compile_lisp_scoped_reference: has_first_level? ",await get_ctx(ctx,"has_first_level"),": ",refname)
                            };
                            if (check_true ((false&& await get_ctx(ctx,"has_first_level")&& await not((opts && opts["root_environment"]))))){
                                  return [{
                                    ctype:await (async function(){
                                        if (check_true ((await not(refval instanceof Function)&& (refval instanceof Object)))){
                                              return "object"
                                        } else {
                                              return refval
                                        }
                                    })()
                                },"(",(preamble && preamble["0"])," ","__GG__","(\"",refname,"\")",")"]
                            } else {
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
                        } else if (check_true(defer_not_found)) {
                             return ["(",env_ref,"get_global","(\"",refname,"\", ReferenceError)",")"]
                        } else  {
                            throw new ReferenceError(("unknown lisp reference: "+ refname));
                            
                        }
                    } ()
                };
                standard_types=await (async function ()  {
                    let all_vals;
                    all_vals=await (await Environment.get_global("make_set"))(await uniq(await conj(["AsyncFunction","check_true","LispSyntaxError","dlisp_environment_count","clone","Environment","Expression","get_next_environment_id","subtype","lisp_writer","do_deferred_splice"],await object_methods(globalThis))));
                    await all_vals["delete"].call(all_vals,"length");
                     return  all_vals
                } )();
                is_error=null;
                is_block_ques_=async function(tokens) {
                     return  (await contains_ques_((tokens && tokens["0"] && tokens["0"]["name"]),["do","progn"]))
                };
                is_complex_ques_=async function(tokens) {
                    let rval;
                    rval=(await (async function(){
                        let __array_op_rval__588=is_block_ques_;
                         if (__array_op_rval__588 instanceof Function){
                            return await __array_op_rval__588(tokens) 
                        } else {
                            return[__array_op_rval__588,tokens]
                        }
                    })()|| (((tokens && tokens["type"])==="arr")&& await (async function(){
                        let __array_op_rval__589=is_block_ques_;
                         if (__array_op_rval__589 instanceof Function){
                            return await __array_op_rval__589((tokens && tokens["val"])) 
                        } else {
                            return[__array_op_rval__589,(tokens && tokens["val"])]
                        }
                    })())|| ((tokens && tokens["val"] && tokens["val"]["0"] && tokens["val"]["0"]["name"])==="if")|| ((tokens && tokens["val"] && tokens["val"]["0"] && tokens["val"]["0"]["name"])==="let"));
                     return  rval
                };
                is_form_ques_=async function(token) {
                     return  (((token && token["val"]) instanceof Array)|| await (async function(){
                        let __array_op_rval__590=is_block_ques_;
                         if (__array_op_rval__590 instanceof Function){
                            return await __array_op_rval__590((token && token["val"])) 
                        } else {
                            return[__array_op_rval__590,(token && token["val"])]
                        }
                    })())
                };
                op_lookup=await ( async function(){
                    let __obj__591=new Object();
                    __obj__591["+"]=infix_ops;
                    __obj__591["*"]=infix_ops;
                    __obj__591["/"]=infix_ops;
                    __obj__591["-"]=infix_ops;
                    __obj__591["**"]=infix_ops;
                    __obj__591["%"]=infix_ops;
                    __obj__591["<<"]=infix_ops;
                    __obj__591[">>"]=infix_ops;
                    __obj__591["and"]=infix_ops;
                    __obj__591["or"]=infix_ops;
                    __obj__591["apply"]=compile_apply;
                    __obj__591["call"]=compile_call;
                    __obj__591["->"]=compile_call;
                    __obj__591["set_prop"]=compile_set_prop;
                    __obj__591["prop"]=compile_prop;
                    __obj__591["="]=compile_assignment;
                    __obj__591["setq"]=compile_assignment;
                    __obj__591["=="]=compile_compare;
                    __obj__591["eq"]=compile_compare;
                    __obj__591[">"]=compile_compare;
                    __obj__591["<"]=compile_compare;
                    __obj__591["<="]=compile_compare;
                    __obj__591[">="]=compile_compare;
                    __obj__591["return"]=compile_return;
                    __obj__591["new"]=compile_new;
                    __obj__591["do"]=compile_block;
                    __obj__591["progn"]=compile_block;
                    __obj__591["progl"]=async function(tokens,ctx) {
                         return  await compile_block(tokens,ctx,{
                            no_scope_boundary:true,suppress_return:true
                        })
                    };
                    __obj__591["break"]=compile_break;
                    __obj__591["inc"]=compile_val_mod;
                    __obj__591["dec"]=compile_val_mod;
                    __obj__591["try"]=compile_try;
                    __obj__591["throw"]=compile_throw;
                    __obj__591["let"]=compile_let;
                    __obj__591["defvar"]=compile_defvar;
                    __obj__591["defconst"]=async function(tokens,ctx) {
                        if (check_true (await get_ctx(ctx,"local_scope"))){
                              return await compile_defvar(tokens,ctx,{
                                constant:true
                            })
                        } else {
                              return await compile_set_global(tokens,ctx,{
                                constant:true
                            })
                        }
                    };
                    __obj__591["while"]=compile_while;
                    __obj__591["for_each"]=compile_for_each;
                    __obj__591["if"]=compile_if;
                    __obj__591["cond"]=compile_cond;
                    __obj__591["fn"]=compile_fn;
                    __obj__591["lambda"]=compile_fn;
                    __obj__591["function*"]=async function(tokens,ctx) {
                         return  await compile_fn(tokens,ctx,{
                            generator:true
                        })
                    };
                    __obj__591["defglobal"]=compile_set_global;
                    __obj__591["list"]=compile_list;
                    __obj__591["function"]=async function(tokens,ctx) {
                         return  await compile_fn(tokens,ctx,{
                            synchronous:true
                        })
                    };
                    __obj__591["=>"]=async function(tokens,ctx) {
                         return  await compile_fn(tokens,ctx,{
                            arrow:true
                        })
                    };
                    __obj__591["yield"]=compile_yield;
                    __obj__591["for_with"]=compile_for_with;
                    __obj__591["quotem"]=compile_quotem;
                    __obj__591["quote"]=compile_quote;
                    __obj__591["quotel"]=compile_quotel;
                    __obj__591["eval"]=compile_eval;
                    __obj__591["jslambda"]=compile_jslambda;
                    __obj__591["javascript"]=compile_javascript;
                    __obj__591["instanceof"]=compile_instanceof;
                    __obj__591["typeof"]=compile_typeof;
                    __obj__591["unquotem"]=compile_unquotem;
                    __obj__591["debug"]=compile_debug;
                    __obj__591["declare"]=compile_declare;
                    __obj__591["static_import"]=compile_import;
                    __obj__591["dynamic_import"]=compile_dynamic_import;
                    return __obj__591;
                    
                })();
                comp_log=await (async function () {
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
                    let tmp_name;
                    let check_statement;
                    let kvpair;
                    let total_length;
                    acc=[];
                    idx=-1;
                    stmt=null;
                    has_valid_key_literals=true;
                    token=null;
                    preamble=await calling_preamble(ctx);
                    key=null;
                    tmp_name=null;
                    ctx=await new_ctx(ctx);
                    check_statement=async function(stmt) {
                        if (check_true (await check_needs_wrap(stmt))){
                            if (check_true (((stmt && stmt["0"] && stmt["0"]["ctype"])==="ifblock"))){
                                  return [await add(new Object(),(preamble && preamble["2"]),{
                                    marker:"ifblock"
                                }),(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ","{",stmt,"}"," ",")","()"]
                            } else {
                                  return [(preamble && preamble["2"]),(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ",stmt," ",")","()"]
                            }
                        } else {
                              return stmt
                        }
                    };
                    kvpair=null;
                    total_length=((tokens && tokens["val"] && tokens["val"]["length"])- 1);
                    ;
                    await async function(){
                        ctx["in_obj_literal"]=true;
                        return ctx;
                        
                    }();
                    await (async function() {
                        let __for_body__595=async function(token) {
                            if (check_true ((((token && token["type"])==="keyval")&& await check_invalid_js_ref((token && token.name))))){
                                has_valid_key_literals=false;
                                __BREAK__FLAG__=true;
                                return
                            }
                        };
                        let __array__596=[],__elements__594=((tokens && tokens["val"])|| []);
                        let __BREAK__FLAG__=false;
                        for(let __iter__593 in __elements__594) {
                            __array__596.push(await __for_body__595(__elements__594[__iter__593]));
                            if(__BREAK__FLAG__) {
                                 __array__596.pop();
                                break;
                                
                            }
                        }return __array__596;
                         
                    })();
                    if (check_true (has_valid_key_literals)){
                         if (check_true (((tokens && tokens["val"] && tokens["val"]["name"])==="{}"))){
                              return [{
                                ctype:"objliteral"
                            },"new Object()"]
                        } else {
                            (acc).push("{");
                            await (async function(){
                                 let __test_condition__597=async function() {
                                     return  (idx<total_length)
                                };
                                let __body_ref__598=async function() {
                                    idx+=1;
                                    kvpair=await (async function(){
                                        let __targ__599=(tokens && tokens["val"]);
                                        if (__targ__599){
                                             return(__targ__599)[idx]
                                        } 
                                    })();
                                    key=await get_val((kvpair && kvpair["val"] && kvpair["val"]["0"]),ctx);
                                    if (check_true ((((key && key.length)===1)&& (await key["charCodeAt"]()===34)))){
                                         key="'\"'"
                                    };
                                    (acc).push(key);
                                    (acc).push(":");
                                    await set_ctx(ctx,"__LAMBDA_STEP__",-1);
                                    stmt=await compile_elem((kvpair && kvpair["val"] && kvpair["val"]["1"]),ctx);
                                    stmt=await check_statement(stmt);
                                    (acc).push(stmt);
                                    if (check_true ((idx<total_length))){
                                         return  (acc).push(",")
                                    }
                                };
                                let __BREAK__FLAG__=false;
                                while(await __test_condition__597()) {
                                    await __body_ref__598();
                                     if(__BREAK__FLAG__) {
                                         break;
                                        
                                    }
                                } ;
                                
                            })();
                            (acc).push("}");
                             return  [{
                                ctype:"objliteral"
                            },acc]
                        }
                    } else {
                        tmp_name=await gen_temp_name("obj");
                        debugger;
                        ;
                        await (async function() {
                            let __for_body__602=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__603=[],__elements__601=[{
                                ctype:"statement"
                            },(preamble && preamble["0"])," ","("," ",(preamble && preamble["1"])," ","function","()","{","let"," ",tmp_name,"=","new"," ","Object","()",";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__600 in __elements__601) {
                                __array__603.push(await __for_body__602(__elements__601[__iter__600]));
                                if(__BREAK__FLAG__) {
                                     __array__603.pop();
                                    break;
                                    
                                }
                            }return __array__603;
                             
                        })();
                        await (async function(){
                             let __test_condition__604=async function() {
                                 return  (idx<total_length)
                            };
                            let __body_ref__605=async function() {
                                idx+=1;
                                kvpair=await (async function(){
                                    let __targ__606=(tokens && tokens["val"]);
                                    if (__targ__606){
                                         return(__targ__606)[idx]
                                    } 
                                })();
                                 return  await (async function() {
                                    let __for_body__609=async function(t) {
                                         return  (acc).push(t)
                                    };
                                    let __array__610=[],__elements__608=await (async function(){
                                        let __array_op_rval__611=tmp_name;
                                         if (__array_op_rval__611 instanceof Function){
                                            return await __array_op_rval__611("[","\"",await cl_encode_string(await get_val((kvpair && kvpair["val"] && kvpair["val"]["0"]),ctx)),"\"","]","=",await compile_elem((kvpair && kvpair["val"] && kvpair["val"]["1"]),ctx),";") 
                                        } else {
                                            return[__array_op_rval__611,"[","\"",await cl_encode_string(await get_val((kvpair && kvpair["val"] && kvpair["val"]["0"]),ctx)),"\"","]","=",await compile_elem((kvpair && kvpair["val"] && kvpair["val"]["1"]),ctx),";"]
                                        }
                                    })();
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__607 in __elements__608) {
                                        __array__610.push(await __for_body__609(__elements__608[__iter__607]));
                                        if(__BREAK__FLAG__) {
                                             __array__610.pop();
                                            break;
                                            
                                        }
                                    }return __array__610;
                                     
                                })()
                            };
                            let __BREAK__FLAG__=false;
                            while(await __test_condition__604()) {
                                await __body_ref__605();
                                 if(__BREAK__FLAG__) {
                                     break;
                                    
                                }
                            } ;
                            
                        })();
                        await (async function() {
                            let __for_body__614=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__615=[],__elements__613=["return"," ",tmp_name,";","}",")","()"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__612 in __elements__613) {
                                __array__615.push(await __for_body__614(__elements__613[__iter__612]));
                                if(__BREAK__FLAG__) {
                                     __array__615.pop();
                                    break;
                                    
                                }
                            }return __array__615;
                             
                        })();
                         return  acc
                    }
                };
                is_literal_ques_=async function(val) {
                     return  (await is_number_ques_(val)|| (val instanceof String || typeof val==='string')|| (false===val)|| (true===val))
                };
                comp_warn=await defclog({
                    prefix:"compile: [warn]:",background:"#fcffc8",color:"brown"
                });
                let compile=await __compile__3();
                ;
                compile_inner=async function(tokens,ctx,_cdepth) {
                    let operator_type;
                    let op_token;
                    let rcv;
                    let __op__621= async function(){
                        return null
                    };
                    let acc;
                    let preamble;
                    let tmp_name;
                    let refval;
                    let check_statement;
                    let ref;
                    {
                        operator_type=null;
                        op_token=null;
                        rcv=null;
                        let op=await __op__621();
                        ;
                        _cdepth=(_cdepth|| 100);
                        acc=[];
                        preamble=await calling_preamble(ctx);
                        tmp_name=null;
                        refval=null;
                        check_statement=async function(stmt) {
                            if (check_true (await check_needs_wrap(stmt))){
                                if (check_true (((stmt && stmt["0"] && stmt["0"]["ctype"])==="ifblock"))){
                                      return [await add(new Object(),(preamble && preamble["2"]),{
                                        marker:"ifblock"
                                    }),(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ","{",stmt,"}"," ",")","()"]
                                } else {
                                      return [(preamble && preamble["2"]),(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ",stmt," ",")","()"]
                                }
                            } else {
                                  return stmt
                            }
                        };
                        ref=null;
                        ;
                         return  await (async function(){
                            try /* TRY SIMPLE */ {
                                 if (check_true ((null==ctx))){
                                    (error_log)("compile: nil ctx: ",tokens);
                                    throw new Error("compile: nil ctx");
                                    
                                } else {
                                      return await async function(){
                                        if (check_true( (await is_number_ques_(tokens)|| (tokens instanceof String || typeof tokens==='string')|| (await sub_type(tokens)==="Boolean")))) {
                                             return tokens
                                        } else if (check_true( ((tokens instanceof Array)&& (tokens && tokens["0"] && tokens["0"]["ref"])&& await not((await get_ctx(ctx,(tokens && tokens["0"] && tokens["0"]["name"]))===UnknownType))&& (op_lookup[(tokens && tokens["0"] && tokens["0"]["name"])]|| (Function===await get_ctx(ctx,(tokens && tokens["0"] && tokens["0"]["name"])))|| (AsyncFunction===await get_ctx(ctx,(tokens && tokens["0"] && tokens["0"]["name"])))|| ("function"===typeof await (async function(){
                                            let __targ__623=(root_ctx && root_ctx["defined_lisp_globals"]);
                                            if (__targ__623){
                                                 return(__targ__623)[(tokens && tokens["0"] && tokens["0"]["name"])]
                                            } 
                                        })())|| await get_lisp_ctx((tokens && tokens["0"] && tokens["0"]["name"])) instanceof Function)))) {
                                            op_token=await first(tokens);
                                            operator=op_token["name"];
                                            operator_type=op_token["val"];
                                            ref=op_token["ref"];
                                            op=op_lookup[operator];
                                             return  await async function(){
                                                if (check_true(op)) {
                                                     return (op)(tokens,ctx)
                                                } else if (check_true( await (async function(){
                                                    let __targ__624=(Environment && Environment["inlines"]);
                                                    if (__targ__624){
                                                         return(__targ__624)[operator]
                                                    } 
                                                })())) {
                                                     return await compile_inline(tokens,ctx)
                                                } else  {
                                                     return await compile_scoped_reference(tokens,ctx)
                                                }
                                            } ()
                                        } else if (check_true( ((tokens instanceof Object)&& ((tokens && tokens["type"])==="objlit")))) {
                                             return  await compile_obj_literal(tokens,ctx)
                                        } else if (check_true( (tokens instanceof Array))) {
                                             return  await async function(){
                                                if (check_true( ((tokens && tokens.length)===0))) {
                                                     return [{
                                                        ctype:"array",is_literal:true
                                                    },"[]"]
                                                } else  {
                                                    let is_operation;
                                                    let declared_type;
                                                    let prefix;
                                                    let nctx;
                                                    let symbolic_replacements;
                                                    let compiled_values;
                                                    is_operation=false;
                                                    declared_type=null;
                                                    prefix="";
                                                    nctx=null;
                                                    symbolic_replacements=[];
                                                    compiled_values=[];
                                                    rcv=await compile((tokens && tokens["0"]),ctx,await add(_cdepth,1));
                                                    if (check_true (((tokens && tokens["0"] && tokens["0"]["ref"])&& ((tokens && tokens["0"] && tokens["0"]["val"]) instanceof String || typeof (tokens && tokens["0"] && tokens["0"]["val"])==='string')))){
                                                         declared_type=await get_declarations(ctx,(tokens && tokens["0"] && tokens["0"]["name"]))
                                                    };
                                                    if (check_true (await (async function(){
                                                        let __array_op_rval__625=verbosity;
                                                         if (__array_op_rval__625 instanceof Function){
                                                            return await __array_op_rval__625(ctx) 
                                                        } else {
                                                            return[__array_op_rval__625,ctx]
                                                        }
                                                    })())){
                                                         (comp_log)(("compile: "+ _cdepth+ " array: "),"potential operator: ",(tokens && tokens["0"] && tokens["0"]["name"]),"declarations: ",declared_type)
                                                    };
                                                    await (async function() {
                                                        let __for_body__628=async function(t) {
                                                            if (check_true (await not(await get_ctx_val(ctx,"__IN_LAMBDA__")))){
                                                                 await set_ctx(ctx,"__LAMBDA_STEP__",0)
                                                            };
                                                             return  (compiled_values).push(await compile(t,ctx,await add(_cdepth,1)))
                                                        };
                                                        let __array__629=[],__elements__627=await (await Environment.get_global("rest"))(tokens);
                                                        let __BREAK__FLAG__=false;
                                                        for(let __iter__626 in __elements__627) {
                                                            __array__629.push(await __for_body__628(__elements__627[__iter__626]));
                                                            if(__BREAK__FLAG__) {
                                                                 __array__629.pop();
                                                                break;
                                                                
                                                            }
                                                        }return __array__629;
                                                         
                                                    })();
                                                    await map(async function(compiled_element,idx) {
                                                        let inst;
                                                        inst=await async function(){
                                                            if (check_true( (((compiled_element && compiled_element["0"]) instanceof Object)&& await (async function(){
                                                                let __targ__630=(compiled_element && compiled_element["0"]);
                                                                if (__targ__630){
                                                                     return(__targ__630)["ctype"]
                                                                } 
                                                            })()))) {
                                                                 return await (async function(){
                                                                    let __targ__631=(compiled_element && compiled_element["0"]);
                                                                    if (__targ__631){
                                                                         return(__targ__631)["ctype"]
                                                                    } 
                                                                })()
                                                            } else if (check_true( ((compiled_element && compiled_element["0"])==="{"))) {
                                                                 return "block"
                                                            } else  {
                                                                 return null
                                                            }
                                                        } ();
                                                         return  await async function(){
                                                            if (check_true( ((inst==="block")|| (inst==="letblock")))) {
                                                                 return  (symbolic_replacements).push(await (async function(){
                                                                    let __array_op_rval__632=idx;
                                                                     if (__array_op_rval__632 instanceof Function){
                                                                        return await __array_op_rval__632(await gen_temp_name("array_arg"),[(preamble && preamble["2"]),"(",(preamble && preamble["1"])," ","function","()"," ",compiled_element," ",")"]) 
                                                                    } else {
                                                                        return[__array_op_rval__632,await gen_temp_name("array_arg"),[(preamble && preamble["2"]),"(",(preamble && preamble["1"])," ","function","()"," ",compiled_element," ",")"]]
                                                                    }
                                                                })())
                                                            } else if (check_true( (inst==="ifblock"))) {
                                                                 return  (symbolic_replacements).push(await (async function(){
                                                                    let __array_op_rval__633=idx;
                                                                     if (__array_op_rval__633 instanceof Function){
                                                                        return await __array_op_rval__633(await gen_temp_name("array_arg"),[(preamble && preamble["2"]),"(",(preamble && preamble["1"])," ","function","()"," ","{",compiled_element,"}"," ",")"]) 
                                                                    } else {
                                                                        return[__array_op_rval__633,await gen_temp_name("array_arg"),[(preamble && preamble["2"]),"(",(preamble && preamble["1"])," ","function","()"," ","{",compiled_element,"}"," ",")"]]
                                                                    }
                                                                })())
                                                            }
                                                        } ()
                                                    },compiled_values);
                                                    await (async function() {
                                                        let __for_body__636=async function(elem) {
                                                            await (async function() {
                                                                let __for_body__640=async function(t) {
                                                                     return  (acc).push(t)
                                                                };
                                                                let __array__641=[],__elements__639=["let"," ",(elem && elem["1"]),"=",(elem && elem["2"]),";"];
                                                                let __BREAK__FLAG__=false;
                                                                for(let __iter__638 in __elements__639) {
                                                                    __array__641.push(await __for_body__640(__elements__639[__iter__638]));
                                                                    if(__BREAK__FLAG__) {
                                                                         __array__641.pop();
                                                                        break;
                                                                        
                                                                    }
                                                                }return __array__641;
                                                                 
                                                            })();
                                                             return  await compiled_values["splice"].call(compiled_values,(elem && elem["0"]),1,[(preamble && preamble["0"])," ",(elem && elem["1"]),"()"])
                                                        };
                                                        let __array__637=[],__elements__635=symbolic_replacements;
                                                        let __BREAK__FLAG__=false;
                                                        for(let __iter__634 in __elements__635) {
                                                            __array__637.push(await __for_body__636(__elements__635[__iter__634]));
                                                            if(__BREAK__FLAG__) {
                                                                 __array__637.pop();
                                                                break;
                                                                
                                                            }
                                                        }return __array__637;
                                                         
                                                    })();
                                                    if (check_true (((symbolic_replacements && symbolic_replacements.length)>0))){
                                                        (acc).unshift("{");
                                                         (acc).unshift({
                                                            ctype:"block"
                                                        })
                                                    };
                                                    await async function(){
                                                        if (check_true( (((declared_type && declared_type["type"])===Function)|| ((declared_type && declared_type["type"])===AsyncFunction)|| (((rcv && rcv["0"]) instanceof Object)&& (rcv && rcv["0"] && rcv["0"]["ctype"]) instanceof Function)|| (((rcv && rcv["0"]) instanceof Object)&& await not(((rcv && rcv["0"]) instanceof Array))&& ((rcv && rcv["0"] && rcv["0"]["ctype"]) instanceof String || typeof (rcv && rcv["0"] && rcv["0"]["ctype"])==='string')&& await contains_ques_("unction",(rcv && rcv["0"] && rcv["0"]["ctype"])))))) {
                                                            if (check_true (((declared_type && declared_type["type"])===AsyncFunction))){
                                                                 prefix="await "
                                                            } else {
                                                                 prefix=""
                                                            };
                                                            is_operation=true;
                                                            await (async function() {
                                                                let __for_body__644=async function(t) {
                                                                     return  (acc).push(t)
                                                                };
                                                                let __array__645=[],__elements__643=await (async function(){
                                                                    let __array_op_rval__646=prefix;
                                                                     if (__array_op_rval__646 instanceof Function){
                                                                        return await __array_op_rval__646("(",rcv,")","(") 
                                                                    } else {
                                                                        return[__array_op_rval__646,"(",rcv,")","("]
                                                                    }
                                                                })();
                                                                let __BREAK__FLAG__=false;
                                                                for(let __iter__642 in __elements__643) {
                                                                    __array__645.push(await __for_body__644(__elements__643[__iter__642]));
                                                                    if(__BREAK__FLAG__) {
                                                                         __array__645.pop();
                                                                        break;
                                                                        
                                                                    }
                                                                }return __array__645;
                                                                 
                                                            })();
                                                            await push_as_arg_list(acc,compiled_values);
                                                             return  (acc).push(")")
                                                        } else if (check_true( ((null==(declared_type && declared_type["type"]))&& (((tokens && tokens["0"] && tokens["0"]["type"])==="arg")|| ((rcv instanceof String || typeof rcv==='string')&& await get_declaration_details(ctx,rcv))|| ((rcv instanceof Array)&& ((rcv && rcv["0"]) instanceof Object)&& ((rcv && rcv["0"] && rcv["0"]["ctype"]) instanceof String || typeof (rcv && rcv["0"] && rcv["0"]["ctype"])==='string')&& ((rcv && rcv["0"] && rcv["0"]["ctype"])&& (await not(await contains_ques_("unction",(rcv && rcv["0"] && rcv["0"]["ctype"])))&& await not(("string"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&& await not(("StringType"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&& await not(("nil"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&& await not(("NumberType"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&& await not(("undefined"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&& await not(("objliteral"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&& await not(("Boolean"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&& await not(("array"===(rcv && rcv["0"] && rcv["0"]["ctype"])))))))))) {
                                                            if (check_true (show_hints)){
                                                                 (comp_warn)("value ambiguity - use declare to clarify: ",await source_from_tokens(tokens,expanded_tree,true)," ",await (await Environment.get_global("as_lisp"))(rcv))
                                                            };
                                                            tmp_name=await gen_temp_name("array_op_rval");
                                                            if (check_true ((((rcv && rcv["0"]) instanceof Object)&& ((rcv && rcv["0"] && rcv["0"]["ctype"]) instanceof String || typeof (rcv && rcv["0"] && rcv["0"]["ctype"])==='string')&& await contains_ques_("block",((rcv && rcv["0"] && rcv["0"]["ctype"])|| ""))))){
                                                                 rcv=await check_statement(rcv)
                                                            };
                                                            if (check_true (((symbolic_replacements && symbolic_replacements.length)>0))){
                                                                (acc).push({
                                                                    ctype:"block"
                                                                });
                                                                (acc).push("return");
                                                                 (acc).push(" ")
                                                            };
                                                            await (async function() {
                                                                let __for_body__649=async function(t) {
                                                                     return  (acc).push(t)
                                                                };
                                                                let __array__650=[],__elements__648=[(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()","{","let"," ",tmp_name,"=",rcv,";"," ","if"," ","(",tmp_name," ","instanceof"," ","Function",")","{","return"," ",(preamble && preamble["0"])," ",tmp_name,"("];
                                                                let __BREAK__FLAG__=false;
                                                                for(let __iter__647 in __elements__648) {
                                                                    __array__650.push(await __for_body__649(__elements__648[__iter__647]));
                                                                    if(__BREAK__FLAG__) {
                                                                         __array__650.pop();
                                                                        break;
                                                                        
                                                                    }
                                                                }return __array__650;
                                                                 
                                                            })();
                                                            await push_as_arg_list(acc,compiled_values);
                                                            await (async function() {
                                                                let __for_body__653=async function(t) {
                                                                     return  (acc).push(t)
                                                                };
                                                                let __array__654=[],__elements__652=[")"," ","}"," ","else"," ","{","return","[",tmp_name];
                                                                let __BREAK__FLAG__=false;
                                                                for(let __iter__651 in __elements__652) {
                                                                    __array__654.push(await __for_body__653(__elements__652[__iter__651]));
                                                                    if(__BREAK__FLAG__) {
                                                                         __array__654.pop();
                                                                        break;
                                                                        
                                                                    }
                                                                }return __array__654;
                                                                 
                                                            })();
                                                            if (check_true ((await length(await (await Environment.get_global("rest"))(tokens))>0))){
                                                                (acc).push(",");
                                                                 await push_as_arg_list(acc,compiled_values)
                                                            };
                                                             return  await (async function() {
                                                                let __for_body__657=async function(t) {
                                                                     return  (acc).push(t)
                                                                };
                                                                let __array__658=[],__elements__656=["]","}","}",")","()"];
                                                                let __BREAK__FLAG__=false;
                                                                for(let __iter__655 in __elements__656) {
                                                                    __array__658.push(await __for_body__657(__elements__656[__iter__655]));
                                                                    if(__BREAK__FLAG__) {
                                                                         __array__658.pop();
                                                                        break;
                                                                        
                                                                    }
                                                                }return __array__658;
                                                                 
                                                            })()
                                                        } else  {
                                                            let __array_arg__659=(async function() {
                                                                if (check_true ((await length(await (await Environment.get_global("rest"))(tokens))>0))){
                                                                    (acc).push(",");
                                                                     await push_as_arg_list(acc,compiled_values)
                                                                }
                                                            } );
                                                            return await (async function(){
                                                                let __array_op_rval__660=await (async function() {
                                                                    if (check_true (((symbolic_replacements && symbolic_replacements.length)>0))){
                                                                        (acc).push("return");
                                                                         (acc).push(" ")
                                                                    }
                                                                } )();
                                                                 if (__array_op_rval__660 instanceof Function){
                                                                    return await __array_op_rval__660((acc).push("["),rcv=await check_statement(rcv),(acc).push(rcv),await __array_arg__659(),(acc).push("]")) 
                                                                } else {
                                                                    return[__array_op_rval__660,(acc).push("["),rcv=await check_statement(rcv),(acc).push(rcv),await __array_arg__659(),(acc).push("]")]
                                                                }
                                                            })()
                                                        }
                                                    } ();
                                                    if (check_true (((symbolic_replacements && symbolic_replacements.length)>0))){
                                                         (acc).push("}")
                                                    };
                                                     return  acc
                                                }
                                            } ()
                                        } else if (check_true( ((tokens instanceof Object)&& ((tokens && tokens["val"]) instanceof Array)&& (tokens && tokens["type"])))) {
                                            await async function(){
                                                ctx["source"]=(tokens && tokens["source"]);
                                                return ctx;
                                                
                                            }();
                                            rcv=await compile((tokens && tokens["val"]),ctx,await add(_cdepth,1));
                                             return  rcv
                                        } else if (check_true( (((tokens instanceof Object)&& await not((undefined===(tokens && tokens["val"])))&& (tokens && tokens["type"]))|| ((tokens && tokens["type"])==="literal")|| ((tokens && tokens["type"])==="arg")|| ((tokens && tokens["type"])==="null")))) {
                                            let snt_name=null;
                                            ;
                                            let snt_value=null;
                                            ;
                                             return  await async function(){
                                                if (check_true( (await not((tokens && tokens["ref"]))&& ((tokens && tokens["type"])==="arr")))) {
                                                     return await compile((tokens && tokens["val"]),ctx,await add(_cdepth,1))
                                                } else if (check_true( (((tokens && tokens["type"])==="null")|| (((tokens && tokens["type"])==="literal")&& ((tokens && tokens.name)==="null")&& (tokens && tokens["ref"]))))) {
                                                     return [{
                                                        ctype:"nil"
                                                    },"null"]
                                                } else if (check_true( (((tokens && tokens["type"])==="literal")&& ((tokens && tokens.name)==="undefined")&& (tokens && tokens["ref"])))) {
                                                     return [{
                                                        ctype:"undefined"
                                                    },"undefined"]
                                                } else if (check_true( await not((tokens && tokens["ref"])))) {
                                                     if (check_true ((((tokens && tokens["type"])==="literal")&& ((tokens && tokens["val"]) instanceof String || typeof (tokens && tokens["val"])==='string')))){
                                                          return [{
                                                            ctype:"string"
                                                        },("\""+ await cl_encode_string((tokens && tokens["val"]))+ "\"")]
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
                                                } else if (check_true( ((tokens && tokens["ref"])&& (opts && opts["root_environment"])))) {
                                                     return  await (await Environment.get_global("path_to_js_syntax"))((await sanitize_js_ref_name((tokens && tokens.name))).split("."))
                                                } else if (check_true( ((tokens && tokens["ref"])&& op_lookup[(tokens && tokens.name)]))) {
                                                     return (tokens && tokens.name)
                                                } else if (check_true( ((tokens && tokens["ref"])&& await (async function ()  {
                                                    snt_name=await sanitize_js_ref_name((tokens && tokens.name));
                                                    snt_value=await get_ctx_val(ctx,snt_name);
                                                    if (check_true (await (async function(){
                                                        let __array_op_rval__662=verbosity;
                                                         if (__array_op_rval__662 instanceof Function){
                                                            return await __array_op_rval__662(ctx) 
                                                        } else {
                                                            return[__array_op_rval__662,ctx]
                                                        }
                                                    })())){
                                                         (comp_log)("compile: singleton: ","name: ",(tokens && tokens.name)," sanitized: ",snt_name,"found locally as:",snt_value)
                                                    };
                                                     return  await not((snt_value===undefined))
                                                } )()))) {
                                                    refval=snt_value;
                                                    if (check_true ((refval===ArgumentType))){
                                                         refval=snt_name
                                                    };
                                                     return  await async function(){
                                                        if (check_true( ((tokens && tokens["type"])==="literal"))) {
                                                             return refval
                                                        } else  {
                                                             return await get_val(tokens,ctx)
                                                        }
                                                    } ()
                                                } else if (check_true( await contains_ques_((tokens && tokens.name),standard_types))) {
                                                     return (tokens && tokens.name)
                                                } else if (check_true( await not((undefined===await get_lisp_ctx((tokens && tokens.name)))))) {
                                                    if (check_true (await (async function(){
                                                        let __array_op_rval__663=verbosity;
                                                         if (__array_op_rval__663 instanceof Function){
                                                            return await __array_op_rval__663(ctx) 
                                                        } else {
                                                            return[__array_op_rval__663,ctx]
                                                        }
                                                    })())){
                                                         (comp_log)("compile: singleton: found global: ",(tokens && tokens.name))
                                                    };
                                                     return  await compile_lisp_scoped_reference((tokens && tokens.name),ctx)
                                                } else  {
                                                    throw new ReferenceError(("compile: unknown reference: "+ (tokens && tokens.name)));
                                                    
                                                }
                                            } ()
                                        } else  {
                                            throw new SyntaxError("compile passed invalid compilation structure");
                                            
                                        }
                                    } ()
                                } 
                            } catch(__exception__622) {
                                  if (__exception__622 instanceof Error) {
                                     let e=__exception__622;
                                     {
                                        if (check_true ((is_error&& (e && e["handled"])))){
                                            throw e;
                                            
                                        };
                                        is_error={
                                            error:(e && e.name),source_name:source_name,message:(e && e.message),form:await source_from_tokens(tokens,expanded_tree),parent_forms:await source_from_tokens(tokens,expanded_tree,true),invalid:true
                                        };
                                        if (check_true (await not((e && e["handled"])))){
                                            (errors).push(is_error);
                                             await async function(){
                                                e["handled"]=true;
                                                return e;
                                                
                                            }()
                                        };
                                        await async function(){
                                            e["details"]=is_error;
                                            return e;
                                            
                                        }();
                                        if (check_true ((opts && opts["throw_on_error"])))throw e;
                                        
                                    }
                                } 
                            }
                        })()
                    }
                };
                final_token_assembly=null;
                main_log=await (async function () {
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
                         return  await (async function() {
                            let __for_body__668=async function(spacer) {
                                 return  (text).push(spacer)
                            };
                            let __array__669=[],__elements__667=format_depth;
                            let __BREAK__FLAG__=false;
                            for(let __iter__666 in __elements__667) {
                                __array__669.push(await __for_body__668(__elements__667[__iter__666]));
                                if(__BREAK__FLAG__) {
                                     __array__669.pop();
                                    break;
                                    
                                }
                            }return __array__669;
                             
                        })()
                    };
                    process_output_token=async function(t) {
                        escaped=await Math.max(0,(escaped- 1));
                         return  await async function(){
                            if (check_true( ((t==="\"")&& (escaped===0)&& in_quotes))) {
                                in_quotes=false;
                                 return  (text).push(t)
                            } else if (check_true( ((t==="\"")&& (escaped===0)))) {
                                in_quotes=true;
                                 return  (text).push(t)
                            } else if (check_true( (t===escape_char))) {
                                (escaped===2);
                                 return  (text).push(t)
                            } else if (check_true( (await not(in_quotes)&& (t==="{")))) {
                                (text).push(t);
                                (format_depth).push("    ");
                                 return  await insert_indent()
                            } else if (check_true( (await not(in_quotes)&& await starts_with_ques_("}",t)))) {
                                (format_depth).pop();
                                await insert_indent();
                                 return  (text).push(t)
                            } else if (check_true( (await not(in_quotes)&& (t===";")))) {
                                (text).push(t);
                                 return  await insert_indent()
                            } else if (check_true( (false&& await not(in_quotes)&& await starts_with_ques_("/*",t)))) {
                                (text).push(t);
                                 return  await insert_indent()
                            } else  {
                                 return  (text).push(t)
                            }
                        } ()
                    };
                    assemble=async function(js_tokens) {
                         return  await (async function() {
                            let __for_body__672=async function(t) {
                                 return  await async function(){
                                    if (check_true( (t instanceof Array))) {
                                         return  await assemble(t)
                                    } else if (check_true( ("object"===typeof t))) {
                                        if (check_true (((t && t["comment"])&& (opts && opts["include_source"])))){
                                            (text).push(("/* "+ (t && t["comment"])+ " */"));
                                             return  await insert_indent()
                                        }
                                    } else if (check_true( t instanceof Function)) {
                                         return  await async function(){
                                            if (check_true( ((t && t.name)&& await contains_ques_((t && t.name),standard_types)))) {
                                                 return (text).push((t && t.name))
                                            } else if (check_true( await (await Environment.get_global("ends_with?"))("{ [native code] }",await t["toString"]()))) {
                                                throw new ReferenceError(("cannot capture source of: "+ (t && t.name)));
                                                
                                            } else  {
                                                 return (text).push(t)
                                            }
                                        } ()
                                    } else  {
                                        if (check_true ((opts && opts["formatted_output"]))){
                                              return await process_output_token(t)
                                        } else {
                                              return (text).push(t)
                                        }
                                    }
                                } ()
                            };
                            let __array__673=[],__elements__671=js_tokens;
                            let __BREAK__FLAG__=false;
                            for(let __iter__670 in __elements__671) {
                                __array__673.push(await __for_body__672(__elements__671[__iter__670]));
                                if(__BREAK__FLAG__) {
                                     __array__673.pop();
                                    break;
                                    
                                }
                            }return __array__673;
                             
                        })()
                    };
                    {
                        await assemble(await flatten(await (async function(){
                            let __array_op_rval__674=js_tree;
                             if (__array_op_rval__674 instanceof Function){
                                return await __array_op_rval__674() 
                            } else {
                                return[__array_op_rval__674]
                            }
                        })()));
                        if (check_true (suppress_join)){
                              return text
                        } else {
                              return (text).join("")
                        }
                    }
                };
                ;
                if (check_true ((null==Environment)))throw new EvalError("Compiler: No environment passed in options.");
                ;
                if (check_true ((opts && opts["show_hints"]))){
                     show_hints=true
                };
                if (check_true (await Environment["get_global"].call(Environment,"__VERBOSITY__"))){
                    {
                        let verbosity_level;
                        verbosity_level=await Environment["get_global"].call(Environment,"__VERBOSITY__");
                         await async function(){
                            if (check_true( (verbosity_level>4))) {
                                verbosity=check_verbosity;
                                 show_hints=true
                            } else if (check_true( (verbosity_level>3))) {
                                 return show_hints=true
                            }
                        } ()
                    }
                };
                if (check_true (await (async function(){
                    let __array_op_rval__675=verbosity;
                     if (__array_op_rval__675 instanceof Function){
                        return await __array_op_rval__675(ctx) 
                    } else {
                        return[__array_op_rval__675,ctx]
                    }
                })())){
                    await (async function(){
                        let __array_op_rval__676=main_log;
                         if (__array_op_rval__676 instanceof Function){
                            return await __array_op_rval__676("namespace set to: ",(Environment && Environment["namespace"])) 
                        } else {
                            return[__array_op_rval__676,"namespace set to: ",(Environment && Environment["namespace"])]
                        }
                    })();
                    if (check_true ((opts && opts["fully_qualified_globals"]))){
                         await (async function(){
                            let __array_op_rval__677=main_log;
                             if (__array_op_rval__677 instanceof Function){
                                return await __array_op_rval__677("fully qualified globals") 
                            } else {
                                return[__array_op_rval__677,"fully qualified globals"]
                            }
                        })()
                    }
                };
                await set_ctx(root_ctx,break_out,false);
                await async function(){
                    root_ctx["defined_lisp_globals"]=new Object();
                    return root_ctx;
                    
                }();
                await set_ctx(root_ctx,"__SOURCE_NAME__",source_name);
                await set_ctx(root_ctx,"__LAMBDA_STEP__",-1);
                output=await async function(){
                    if (check_true((opts && opts["special_operators"]))) {
                         return await (await Environment.get_global("make_set"))(await (await Environment.get_global("keys"))(op_lookup))
                    } else if (check_true((opts && opts["only_tokens"]))) {
                         return await tokenize(tree,root_ctx)
                    } else if (check_true(is_error)) {
                         return [{
                            ctype:"CompileError"
                        },is_error]
                    } else  {
                        await (async function(){
                            try /* TRY COMPLEX */ {
                                 return  final_token_assembly=await tokenize(tree,root_ctx)
                            }  catch(__exception__679) {
                                  if (__exception__679 instanceof Error) {
                                     let e=__exception__679;
                                      return is_error=e
                                } 
                            }
                        })();
                        await async function(){
                            if (check_true( (is_error&& (opts && opts["throw_on_error"])))) {
                                 throw is_error;
                                
                            } else if (check_true( (is_error instanceof SyntaxError))) {
                                (errors).push(is_error);
                                 return  is_error
                            } else if (check_true(is_error)) {
                                (errors).push(is_error);
                                 return  is_error
                            } else if (check_true( (null==final_token_assembly))) {
                                is_error=new EvalError("Pre-Compilation Error");
                                 return  (errors).push(is_error)
                            } else  {
                                assembly=await compile(final_token_assembly,root_ctx,0);
                                if (check_true ((is_error&& (opts && opts["throw_on_error"])))){
                                    throw is_error;
                                    
                                };
                                if (check_true ((false&& await not((opts && opts["root_environment"]))&& ((first_level_setup && first_level_setup.length)===0)&& has_lisp_globals))){
                                     (first_level_setup).push(["const __GG__=",env_ref,"get_global",";"])
                                };
                                assembly=await (await Environment.get_global("splice_in_return_a"))(assembly);
                                 return  assembly=await (await Environment.get_global("splice_in_return_b"))(assembly)
                            }
                        } ();
                        if (check_true ((opts && opts["root_environment"]))){
                             has_lisp_globals=false
                        };
                        if (check_true (((assembly && assembly["0"] && assembly["0"]["ctype"])&& (assembly && assembly["0"] && assembly["0"]["ctype"]) instanceof Function))){
                             await async function(){
                                let __target_obj__680=(assembly && assembly["0"]);
                                __target_obj__680["ctype"]=await map_value_to_ctype((assembly && assembly["0"] && assembly["0"]["ctype"]));
                                return __target_obj__680;
                                
                            }()
                        };
                        await async function(){
                            if (check_true( (await not(is_error)&& assembly&& (await first(assembly) instanceof Object)&& await (async function(){
                                let __targ__681=await first(assembly);
                                if (__targ__681){
                                     return(__targ__681)["ctype"]
                                } 
                            })()&& (await not((await (async function(){
                                let __targ__682=await first(assembly);
                                if (__targ__682){
                                     return(__targ__682)["ctype"]
                                } 
                            })() instanceof String || typeof await (async function(){
                                let __targ__682=await first(assembly);
                                if (__targ__682){
                                     return(__targ__682)["ctype"]
                                } 
                            })()==='string'))|| await (async function ()  {
                                let val;
                                val=await (async function(){
                                    let __targ__683=await first(assembly);
                                    if (__targ__683){
                                         return(__targ__683)["ctype"]
                                    } 
                                })();
                                 return  (await not((val==="assignment"))&& await not(await contains_ques_("block",val))&& await not(await contains_ques_("unction",val)))
                            } )())))) {
                                 return await async function(){
                                    let __target_obj__684=(assembly && assembly["0"]);
                                    __target_obj__684["ctype"]="statement";
                                    return __target_obj__684;
                                    
                                }()
                            } else if (check_true( (assembly&& (await first(assembly) instanceof String || typeof await first(assembly)==='string')&& (await first(assembly)==="throw")))) {
                                 return assembly=[{
                                    ctype:"block"
                                },assembly]
                            } else if (check_true( (await not(is_error)&& assembly&& (await not((await first(assembly) instanceof Object))|| await not(await (async function(){
                                let __targ__685=await first(assembly);
                                if (__targ__685){
                                     return(__targ__685)["ctype"]
                                } 
                            })()))))) {
                                 return assembly=[{
                                    ctype:"statement"
                                },assembly]
                            } else if (check_true(is_error)) {
                                 return is_error
                            } else if (check_true( (null==assembly))) {
                                 return assembly=[]
                            }
                        } ();
                        if (check_true (is_error)){
                             return  [{
                                ctype:"FAIL"
                            },errors]
                        } else {
                             if (check_true ((await first(assembly) instanceof Object))){
                                  return [await add({
                                    has_lisp_globals:has_lisp_globals
                                },(assembly).shift()),await assemble_output(assembly)]
                            } else {
                                  return [{
                                    has_lisp_globals:has_lisp_globals
                                },await assemble_output(assembly)]
                            }
                        }
                    }
                } ();
                if (check_true (((await first(output) instanceof Object)&& target_namespace))){
                     await async function(){
                        let __target_obj__686=await first(output);
                        __target_obj__686["namespace"]=target_namespace;
                        return __target_obj__686;
                        
                    }()
                };
                if (check_true ((opts && opts["error_report"]))){
                     ((opts && opts["error_report"]))({
                        errors:errors,warnings:warnings
                    })
                };
                 return  output
            }
        }
    }
})} 
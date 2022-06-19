// Source: compiler.lisp  
// Build Time: 2022-06-19 06:04:09
// Version: 2022.06.19.06.04
export const DLISP_ENV_VERSION='2022.06.19.06.04';




var { get_next_environment_id, check_true, get_outside_global, subtype, lisp_writer, clone } = await import("./lisp_writer.js");
export async function init_compiler(Environment) {
  return await Environment.set_global("compiler",async function(quoted_lisp,opts) {
    let __get_global__1= async function(){
        return (opts && opts["env"] && opts["env"]["get_global"])
    };
    let __Environment__2= async function(){
        return (opts && opts["env"])
    };
    {
        let get_global=await __get_global__1();
        ;
        let Environment=await __Environment__2();
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
            let do_deferred_splice=async function(tree) {        let rval;
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
                     let __test_condition__27=async function() {
                         return  (idx<(tree && tree.length))
                    };
                    let __body_ref__28=async function() {
                        tval=await (async function(){
                            let __targ__29=tree;
                            if (__targ__29){
                                 return(__targ__29)[idx]
                            } 
                        })();
                        if (check_true ((tval===deferred_operator))){
                            idx+=1;
                            tval=await (async function(){
                                let __targ__30=tree;
                                if (__targ__30){
                                     return(__targ__30)[idx]
                                } 
                            })();
                             rval=await rval["concat"].call(rval,await do_deferred_splice(tval))
                        } else {
                             (rval).push(await do_deferred_splice(tval))
                        };
                         return  idx+=1
                    };
                    let __BREAK__FLAG__=false;
                    while(await __test_condition__27()) {
                        await __body_ref__28();
                         if(__BREAK__FLAG__) {
                             break;
                            
                        }
                    } ;
                    
                })();
                 return  rval
            } else if (check_true( (tree instanceof Object))) {
                rval=new Object();
                await (async function() {
                    let __for_body__33=async function(pset) {
                         return  await async function(){
                            let __target_obj__35=rval;
                            __target_obj__35[(pset && pset["0"])]=await do_deferred_splice((pset && pset["1"]));
                            return __target_obj__35;
                            
                        }()
                    };
                    let __array__34=[],__elements__32=await (await Environment.get_global("pairs"))(tree);
                    let __BREAK__FLAG__=false;
                    for(let __iter__31 in __elements__32) {
                        __array__34.push(await __for_body__33(__elements__32[__iter__31]));
                        if(__BREAK__FLAG__) {
                             __array__34.pop();
                            break;
                            
                        }
                    }return __array__34;
                     
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
            let sub_type=function subtype(value) {  if (value === null) return "null";  else if (value === undefined) return "undefined";  else if (value instanceof Array) return "array";  else if (value.constructor && value.constructor!=null && value.constructor.name!=='Object') {
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
            let subtype=function subtype(value) {  if (value === null) return "null";  else if (value === undefined) return "undefined";  else if (value instanceof Array) return "array";  else if (value.constructor && value.constructor!=null && value.constructor.name!=='Object') {
    return value.constructor.name;
  }
  return typeof value;
};
            let is_nil_ques_=async function(value) {         return  (null===value)
    };
            let is_number_ques_=function(x) {                         return  ( subtype(x)==="Number")
                    };
            let starts_with_ques_=function anonymous(val,text) {
{ if (text instanceof Array) { return text[0]===val } else if (subtype(text)=='String') { return text.startsWith(val) } else { return false }}
};
            let cl_encode_string=async function(text) {        if (check_true ((text instanceof String || typeof text==='string'))){
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
            let contains_ques_=function(value,container) {                         return    (function(){
                            if (check_true( ( not(value)&& not(container)))) {
                                 return false
                            } else if (check_true( (container==null))) {
                                 throw new TypeError("contains?: passed nil/undefined container value");
                                
                            } else if (check_true( (container instanceof String || typeof container==='string'))) {
                                 if (check_true ( ( get_global("is_number?"))(value))){
                                      return ( container["indexOf"].call(container,(""+value))>-1)
                                } else {
                                      return ( container["indexOf"].call(container,value)>-1)
                                }
                            } else if (check_true( (container instanceof Array))) {
                                 return  container["includes"].call(container,value)
                            } else if (check_true(  ( get_global("is_set?"))(container))) {
                                 return  container["has"].call(container,value)
                            } else  {
                                 throw new TypeError(("contains?: passed invalid container type: "+ sub_type(container)));
                                
                            }
                        } )()
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
            let errors;
            let warnings;
            let blk_counter;
            let ctx;
            let output;
            let __log__3= async function(){
                return console.log
            };
            let __defclog__4= async function(){
                return async function(opts) {
                    let style;
                    style=("padding: 5px;"+await (async function () {
                         if (check_true ((opts && opts["background"]))){
                              return ("background: "+(opts && opts["background"])+";")
                        } else {
                              return ""
                        } 
                    })()+await (async function () {
                         if (check_true ((opts && opts["color"]))){
                              return ("color: "+(opts && opts["color"])+";")
                        } 
                    })()+"");
                     return  async function(...args) {
                         return  await (async function(){
                            let __target_arg__8=[].concat(await (await Environment.get_global("conj"))(await (async function(){
                                let __array_op_rval__9=style;
                                 if (__array_op_rval__9 instanceof Function){
                                    return await __array_op_rval__9() 
                                } else {
                                    return[__array_op_rval__9]
                                }
                            })(),args));
                            if(!__target_arg__8 instanceof Array){
                                throw new TypeError("Invalid final argument to apply - an array is required")
                            }let __pre_arg__10=("%c"+await (async function () {
                                 if (check_true ((opts && opts["prefix"]))){
                                      return (opts && opts["prefix"])
                                } else {
                                      return (args).shift()
                                } 
                            })());
                            __target_arg__8.unshift(__pre_arg__10);
                            return (console.log).apply(this,__target_arg__8)
                        })()
                    }
                }
            };
            let quiet_mode;
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
            let lisp_global_ctx_handle;
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
            let cwrap_log;
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
            let compile_javascript;
            let compile_dynamic_import;
            let compile_set_global;
            let is_token_ques_;
            let compile_quote;
            let compile_quotel;
            let wrap_and_run;
            let follow_log;
            let follow_tree;
            let quotem_log;
            let compile_quotem;
            let unq_log;
            let compile_unquotem;
            let evalq_log;
            let compile_evalq;
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
            let __compile__5= async function(){
                return async function(tokens,ctx,_cdepth) {
                    if (check_true (is_error)){
                          return is_error
                    } else {
                        let rval=await compile_inner(tokens,ctx,_cdepth);
                        ;
                        if (check_true (false)){
                             if (check_true (((rval instanceof Array)&&((rval && rval["0"]) instanceof Object)&&await (async function(){
                                let __targ__720=(rval && rval["0"]);
                                if (__targ__720){
                                     return(__targ__720)["ctype"]
                                } 
                            })()))){
                                 true
                            } else {
                                await (async function(){
                                    let __array_op_rval__721=comp_warn;
                                     if (__array_op_rval__721 instanceof Function){
                                        return await __array_op_rval__721("<-",(_cdepth||"-"),"unknown/undeclared type returned: ",await (await Environment.get_global("as_lisp"))(rval)) 
                                    } else {
                                        return[__array_op_rval__721,"<-",(_cdepth||"-"),"unknown/undeclared type returned: ",await (await Environment.get_global("as_lisp"))(rval)]
                                    }
                                })();
                                 await (async function(){
                                    let __array_op_rval__722=comp_warn;
                                     if (__array_op_rval__722 instanceof Function){
                                        return await __array_op_rval__722("  ",(_cdepth||"-"),"for given: ",await source_from_tokens(tokens,expanded_tree)) 
                                    } else {
                                        return[__array_op_rval__722,"  ",(_cdepth||"-"),"for given: ",await source_from_tokens(tokens,expanded_tree)]
                                    }
                                })()
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
                default_safety_level=((Environment && Environment["declarations"] && Environment["declarations"]["safety"] && Environment["declarations"]["safety"]["level"])||1);
                source_name=((opts && opts["source_name"])||"anonymous");
                build_environment_mode=((opts && opts["build_environment"])||false);
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
                errors=[];
                warnings=[];
                blk_counter=0;
                ctx=null;
                output=null;
                let log=await __log__3();
                ;
                let defclog=await __defclog__4();
                ;
                quiet_mode=await (async function () {
                     if (check_true ((opts && opts["quiet_mode"]))){
                        log=console.log;
                         return  true
                    } else {
                          return false
                    } 
                })();
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
                        let __target_obj__11=new Object();
                        __target_obj__11["ctype"]=type;
                        __target_obj__11["args"]=[];
                        return __target_obj__11;
                        
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
                        let __array_op_rval__12=in_sync_ques_;
                         if (__array_op_rval__12 instanceof Function){
                            return await __array_op_rval__12(ctx) 
                        } else {
                            return[__array_op_rval__12,ctx]
                        }
                    })())){
                        await async function(){
                            let __target_obj__13=(tmp_template && tmp_template["2"] && tmp_template["2"]["val"] && tmp_template["2"]["val"]["0"]);
                            __target_obj__13["val"]="=:function";
                            return __target_obj__13;
                            
                        }();
                         await async function(){
                            let __target_obj__14=(tmp_template && tmp_template["2"] && tmp_template["2"]["val"] && tmp_template["2"]["val"]["0"]);
                            __target_obj__14["name"]="function";
                            return __target_obj__14;
                            
                        }()
                    };
                    await async function(){
                        let __target_obj__15=(tmp_template && tmp_template["1"]);
                        __target_obj__15["name"]=tmp_var_name;
                        __target_obj__15["val"]=tmp_var_name;
                        return __target_obj__15;
                        
                    }();
                    if (check_true ((args instanceof Array))){
                         await async function(){
                            let __target_obj__16=(tmp_template && tmp_template["2"] && tmp_template["2"]["val"] && tmp_template["2"]["val"]["1"]);
                            __target_obj__16["val"]=args;
                            return __target_obj__16;
                            
                        }()
                    };
                    await async function(){
                        let __target_obj__17=(tmp_template && tmp_template["2"] && tmp_template["2"]["val"] && tmp_template["2"]["val"]["2"]);
                        __target_obj__17["val"]=body;
                        return __target_obj__17;
                        
                    }();
                     return  tmp_template
                };
                build_anon_fn=async function(body,args) {
                    let tmp_template;
                    tmp_template=await clone(anon_fn_template);
                    if (check_true ((args instanceof Array))){
                         await async function(){
                            let __target_obj__18=(tmp_template && tmp_template["0"] && tmp_template["0"]["val"] && tmp_template["0"]["val"]["1"]);
                            __target_obj__18["val"]=args;
                            return __target_obj__18;
                            
                        }()
                    };
                    await async function(){
                        let __target_obj__19=(tmp_template && tmp_template["0"] && tmp_template["0"]["val"] && tmp_template["0"]["val"]["2"]);
                        __target_obj__19["val"]=body;
                        return __target_obj__19;
                        
                    }();
                     return  tmp_template
                };
                referenced_global_symbols=new Object();
                new_ctx=async function(parent) {
                    let ctx_obj;
                    ctx_obj=new Object();
                    await async function(){
                        let __target_obj__20=ctx_obj;
                        __target_obj__20["scope"]=new Object();
                        __target_obj__20["source"]="";
                        __target_obj__20["parent"]=parent;
                        __target_obj__20["ambiguous"]=new Object();
                        __target_obj__20["declared_types"]=new Object();
                        __target_obj__20["defs"]=[];
                        return __target_obj__20;
                        
                    }();
                    if (check_true (parent)){
                        if (check_true ((parent && parent["source"]))){
                             await async function(){
                                let __target_obj__21=ctx_obj;
                                __target_obj__21["source"]=(parent && parent["source"]);
                                return __target_obj__21;
                                
                            }()
                        };
                        if (check_true ((parent && parent["defvar_eval"]))){
                             await async function(){
                                let __target_obj__22=ctx_obj;
                                __target_obj__22["defvar_eval"]=true;
                                return __target_obj__22;
                                
                            }()
                        };
                        if (check_true ((parent && parent["hard_quote_mode"]))){
                             await async function(){
                                let __target_obj__23=ctx_obj;
                                __target_obj__23["hard_quote_mode"]=true;
                                return __target_obj__23;
                                
                            }()
                        };
                        if (check_true ((parent && parent["block_step"]))){
                             await async function(){
                                let __target_obj__24=ctx_obj;
                                __target_obj__24["block_step"]=(parent && parent["block_step"]);
                                return __target_obj__24;
                                
                            }()
                        };
                        if (check_true ((parent && parent["block_id"]))){
                             await async function(){
                                let __target_obj__25=ctx_obj;
                                __target_obj__25["block_id"]=(parent && parent["block_id"]);
                                return __target_obj__25;
                                
                            }()
                        };
                        if (check_true ((parent && parent["suppress_return"]))){
                             await async function(){
                                let __target_obj__26=ctx_obj;
                                __target_obj__26["suppress_return"]=(parent && parent["suppress_return"]);
                                return __target_obj__26;
                                
                            }()
                        };
                        if (check_true ((parent && parent["in_try"]))){
                             await async function(){
                                let __target_obj__27=ctx_obj;
                                __target_obj__27["in_try"]=await (async function(){
                                    let __targ__28=parent;
                                    if (__targ__28){
                                         return(__targ__28)["in_try"]
                                    } 
                                })();
                                return __target_obj__27;
                                
                            }()
                        };
                        if (check_true ((parent && parent["return_point"]))){
                             await async function(){
                                let __target_obj__29=ctx_obj;
                                __target_obj__29["return_point"]=await add((parent && parent["return_point"]),1);
                                return __target_obj__29;
                                
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
                        } else if (check_true( (ctype==="Number"))) {
                             return Number
                        } else if (check_true( (ctype==="expression"))) {
                             return Expression
                        } else if (check_true( ((ctype instanceof String || typeof ctype==='string')&&await contains_ques_("block",ctype)))) {
                             return UnknownType
                        } else if (check_true( (ctype==="array"))) {
                             return Array
                        } else if (check_true( (ctype==="Boolean"))) {
                             return Boolean
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
                        } else if (check_true( (Number===value))) {
                             return "Number"
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
                    if (check_true (((value instanceof Array)&&(value && value["0"] && value["0"]["ctype"])))){
                          return await async function(){
                            let __target_obj__30=(ctx && ctx["scope"]);
                            __target_obj__30[sanitized_name]=await async function(){
                                if (check_true( ((value && value["0"] && value["0"]["ctype"])==="Function"))) {
                                     return Function
                                } else if (check_true( ((value && value["0"] && value["0"]["ctype"])==="AsyncFunction"))) {
                                     return AsyncFunction
                                } else if (check_true( ((value && value["0"] && value["0"]["ctype"])==="expression"))) {
                                     return Expression
                                } else  {
                                     return (value && value["0"] && value["0"]["ctype"])
                                }
                            } ();
                            return __target_obj__30;
                            
                        }()
                    } else {
                          return await async function(){
                            let __target_obj__31=(ctx && ctx["scope"]);
                            __target_obj__31[sanitized_name]=value;
                            return __target_obj__31;
                            
                        }()
                    }
                };
                get_ctx=async function(ctx,name) {
                    let ref_name;
                    ref_name=null;
                     return  await async function(){
                        if (check_true( await is_nil_ques_(name))) {
                             throw new SyntaxError(("get_ctx: nil identifier passed: "+await sub_type(name)));
                            
                        } else if (check_true( await is_number_ques_(name))) {
                             return name
                        } else if (check_true( name instanceof Function)) {
                             throw new SyntaxError(("get_ctx: invalid identifier passed: "+await sub_type(name)));
                            
                        } else  {
                            ref_name=await first(await (await Environment.get_global("get_object_path"))(name));
                             return  await async function(){
                                if (check_true( await not((undefined===await (async function(){
                                    let __targ__32=(ctx && ctx["scope"]);
                                    if (__targ__32){
                                         return(__targ__32)[ref_name]
                                    } 
                                })())))) {
                                     return await (async function(){
                                        let __targ__33=(ctx && ctx["scope"]);
                                        if (__targ__33){
                                             return(__targ__33)[ref_name]
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
                             throw new TypeError(("get_ctx_val: nil identifier passed: "+await sub_type(name)));
                            
                        } else if (check_true( await is_number_ques_(name))) {
                             return name
                        } else if (check_true( name instanceof Function)) {
                             throw new Error(("get_ctx_val: invalid identifier passed: "+await sub_type(name)));
                            
                        } else  {
                            if (check_true (await starts_with_ques_("=:",name))){
                                 ref_name=await name["substr"].call(name,2)
                            } else {
                                 ref_name=name
                            };
                            ref_name=await sanitize_js_ref_name(name);
                            declared_type_value=await get_declarations(ctx,ref_name);
                            if (check_true ((declared_type_value && declared_type_value["type"]))){
                                  return (declared_type_value && declared_type_value["type"])
                            } else {
                                ref_name=await first(await (await Environment.get_global("get_object_path"))(ref_name));
                                 return  await async function(){
                                    if (check_true( await (async function(){
                                        let __targ__34=op_lookup;
                                        if (__targ__34){
                                             return(__targ__34)[ref_name]
                                        } 
                                    })())) {
                                         return AsyncFunction
                                    } else if (check_true( await not((undefined===await (async function(){
                                        let __targ__35=(ctx && ctx["scope"]);
                                        if (__targ__35){
                                             return(__targ__35)[ref_name]
                                        } 
                                    })())))) {
                                         return await (async function(){
                                            let __targ__36=(ctx && ctx["scope"]);
                                            if (__targ__36){
                                                 return(__targ__36)[ref_name]
                                            } 
                                        })()
                                    } else if (check_true((ctx && ctx["parent"]))) {
                                         return await get_ctx((ctx && ctx["parent"]),ref_name)
                                    }
                                } ()
                            }
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
                             throw new TypeError(("get_declarations: nil identifier passed: "+await sub_type(oname)));
                            
                        } else if (check_true( await is_number_ques_(name))) {
                             return name
                        } else if (check_true( name instanceof Function)) {
                             throw new Error(("get_declarations: invalid identifier passed: "+await sub_type(oname)));
                            
                        } else  {
                             if (check_true ((name instanceof String || typeof name==='string'))){
                                if (check_true (await starts_with_ques_("=:",name))){
                                     ref_name=await name["substr"].call(name,2)
                                } else {
                                     ref_name=name
                                };
                                 return  await async function(){
                                    if (check_true( await (async function(){
                                        let __targ__37=op_lookup;
                                        if (__targ__37){
                                             return(__targ__37)[ref_name]
                                        } 
                                    })())) {
                                         return null
                                    } else if (check_true( await not((undefined===await (async function(){
                                        let __targ__38=(ctx && ctx["declared_types"]);
                                        if (__targ__38){
                                             return(__targ__38)[ref_name]
                                        } 
                                    })())))) {
                                         return await (async function(){
                                            let __targ__39=(ctx && ctx["declared_types"]);
                                            if (__targ__39){
                                                 return(__targ__39)[ref_name]
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
                            type:"undefined",inlined:false
                        }
                    };
                    await async function(){
                        let __target_obj__40=dec_struct;
                        __target_obj__40[declaration_type]=value;
                        return __target_obj__40;
                        
                    }();
                    await async function(){
                        let __target_obj__41=(ctx && ctx["declared_types"]);
                        __target_obj__41[sname]=dec_struct;
                        return __target_obj__41;
                        
                    }();
                     return  await (async function(){
                        let __targ__42=(ctx && ctx["declared_types"]);
                        if (__targ__42){
                             return(__targ__42)[sname]
                        } 
                    })()
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
                             throw new TypeError(("is_ambiguous?: reference name given is a "+await sub_type(name)+", requires a string"));
                            
                        } else  {
                            if (check_true (await starts_with_ques_("=:",name))){
                                 ref_name=await name["substr"].call(name,2)
                            } else {
                                 ref_name=name
                            };
                            ref_name=await first(await (await Environment.get_global("get_object_path"))(ref_name));
                             return  await async function(){
                                if (check_true( await (async function(){
                                    let __targ__43=(ctx && ctx["ambiguous"]);
                                    if (__targ__43){
                                         return(__targ__43)[ref_name]
                                    } 
                                })())) {
                                     return true
                                } else if (check_true((ctx && ctx["parent"]))) {
                                     return await (async function(){
                                        let __array_op_rval__44=is_ambiguous_ques_;
                                         if (__array_op_rval__44 instanceof Function){
                                            return await __array_op_rval__44((ctx && ctx["parent"]),ref_name) 
                                        } else {
                                            return[__array_op_rval__44,(ctx && ctx["parent"]),ref_name]
                                        }
                                    })()
                                }
                            } ()
                        }
                    } ()
                };
                set_ambiguous=async function(ctx,name) {
                     return  await async function(){
                        let __target_obj__45=(ctx && ctx["ambiguous"]);
                        __target_obj__45[name]=true;
                        return __target_obj__45;
                        
                    }()
                };
                unset_ambiguous=async function(ctx,name) {
                     return  await (await Environment.get_global("delete_prop"))((ctx && ctx["ambiguous"]),name)
                };
                invalid_js_ref_chars="+?-%&^#!*[]~{}|";
                invalid_js_ref_chars_regex=new RegExp("[\%\+\[\>\?\<\\}\{&\#\^\=\~\*\!\)\(\-]+","g");
                check_invalid_js_ref=async function(symname) {
                     return  await async function(){
                        if (check_true( await not((symname instanceof String || typeof symname==='string')))) {
                             return false
                        } else if (check_true( ((symname instanceof String || typeof symname==='string')&&(await length(symname)>2)&&await starts_with_ques_("=:",symname)))) {
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
                                let __for_body__48=async function(t) {
                                     return  await async function(){
                                        if (check_true( (t==="+"))) {
                                             return (acc).push("_plus_")
                                        } else if (check_true( (t==="?"))) {
                                             return (acc).push("_ques_")
                                        } else if (check_true( (t==="-"))) {
                                             return (acc).push("_dash_")
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
                                             throw new SyntaxError(("Invalid character in symbol: "+symname));
                                            
                                        } else  {
                                             return (acc).push(t)
                                        }
                                    } ()
                                };
                                let __array__49=[],__elements__47=text_chars;
                                let __BREAK__FLAG__=false;
                                for(let __iter__46 in __elements__47) {
                                    __array__49.push(await __for_body__48(__elements__47[__iter__46]));
                                    if(__BREAK__FLAG__) {
                                         __array__49.pop();
                                        break;
                                        
                                    }
                                }return __array__49;
                                 
                            })();
                             return  (acc).join("")
                        }
                    } ()
                };
                find_in_context=async function(ctx,name) {
                    let symname;
                    let ref;
                    let __is_literal_ques___50= async function(){
                        return (await is_number_ques_(name)||(await not(ref)&&(name instanceof String || typeof name==='string'))||(ref&&("nil"===symname))||(ref&&("null"===symname))||(ref&&("undefined"===symname))||(ref&&("else"===symname))||(ref&&("catch"===symname))||(true===name)||(false===name))
                    };
                    let special;
                    let local;
                    let global;
                    let val;
                    {
                        symname=await async function(){
                            if (check_true( ((name instanceof String || typeof name==='string')&&(await length(name)>2)&&await starts_with_ques_("=:",name)))) {
                                 return await name["substr"].call(name,2)
                            } else if (check_true( (name instanceof String || typeof name==='string'))) {
                                 return name
                            } else  {
                                 return null
                            }
                        } ();
                        ref=(symname&&((name instanceof String || typeof name==='string')&&(await length(name)>2)&&await starts_with_ques_("=:",name)));
                        let is_literal_ques_=await __is_literal_ques___50();
                        ;
                        special=(ref&&symname&&await contains_ques_(symname,await (await Environment.get_global("conj"))(["unquotem","quotem"],await (await Environment.get_global("keys"))(op_lookup))));
                        local=(await not(special)&&await not(is_literal_ques_)&&symname&&ref&&await get_ctx_val(ctx,symname));
                        global=(await not(special)&&await not(is_literal_ques_)&&ref&&symname&&await get_lisp_ctx(symname));
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
                            } else if (check_true( (global&&await not((global===NOT_FOUND))))) {
                                 return global
                            } else if (check_true( (symname===name))) {
                                 return name
                            }
                        } ();
                         return  {
                            type:await async function(){
                                if (check_true( (name instanceof Array))) {
                                     return "arr"
                                } else if (check_true( (name instanceof Object))) {
                                     return await sub_type(name)
                                } else if (check_true(special)) {
                                     return "special"
                                } else if (check_true(is_literal_ques_)) {
                                     return "literal"
                                } else if (check_true(local)) {
                                     return await sub_type(local)
                                } else if (check_true(global)) {
                                     return await sub_type(global)
                                } else if (check_true( (ref&&symname))) {
                                     return "unbound"
                                } else  {
                                    await (async function(){
                                        let __array_op_rval__51=error_log;
                                         if (__array_op_rval__51 instanceof Function){
                                            return await __array_op_rval__51("find_in_context: unknown type: ",name) 
                                        } else {
                                            return[__array_op_rval__51,"find_in_context: unknown type: ",name]
                                        }
                                    })();
                                     return  "??"
                                }
                            } (),name:await async function(){
                                if (check_true( (symname&&ref))) {
                                     return await sanitize_js_ref_name(symname)
                                } else if (check_true( (false&&is_literal_ques_&&(val instanceof String || typeof val==='string')))) {
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
                            } (),val:val,ref:await (async function() {
                                if (check_true (ref)){
                                      return true
                                } else {
                                      return false
                                }
                            } )(),local:(local||null),global:((global&&await not((NOT_FOUND===global)))||null)
                        }
                    }
                };
                source_chain=async function(cpath,tree,sources) {
                    if (check_true (((cpath instanceof Array)&&tree))){
                        let source;
                        sources=(sources||[]);
                        source=null;
                        cpath=await (await Environment.get_global("chop"))(cpath);
                        source=await (await Environment.get_global("as_lisp"))(await (await Environment.get_global("resolve_path"))(cpath,tree));
                        if (check_true (((source && source.length)>80))){
                             source=await add(await source["substr"].call(source,0,80),"...")
                        };
                        if (check_true (await not(await (await Environment.get_global("blank?"))(source)))){
                             (sources).push(source)
                        };
                        if (check_true ((((cpath && cpath.length)>0)&&((sources && sources.length)<4)))){
                             await source_chain(cpath,tree,sources)
                        };
                         return  sources
                    }
                };
                source_from_tokens=async function(tokens,tree,collect_parents_ques_) {
                     return  await async function(){
                        if (check_true( ((tokens && tokens["path"])&&collect_parents_ques_))) {
                             return await source_chain((tokens && tokens["path"]),tree)
                        } else if (check_true((tokens && tokens["path"]))) {
                             return await (await Environment.get_global("as_lisp"))(await (await Environment.get_global("resolve_path"))((tokens && tokens["path"]),tree))
                        } else if (check_true( ((tokens instanceof Array)&&(tokens && tokens["0"] && tokens["0"]["path"])&&collect_parents_ques_))) {
                             return await source_chain((tokens && tokens["0"] && tokens["0"]["path"]),tree)
                        } else if (check_true( ((tokens instanceof Array)&&(tokens && tokens["0"] && tokens["0"]["path"])))) {
                             return await (await Environment.get_global("as_lisp"))(await (await Environment.get_global("resolve_path"))(await (await Environment.get_global("chop"))((tokens && tokens["0"] && tokens["0"]["path"])),tree))
                        } else if (check_true( ((undefined===tokens)&&await not((undefined===tree))))) {
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
                                    let __targ__52=(root_ctx && root_ctx["defined_lisp_globals"]);
                                    if (__targ__52){
                                         return(__targ__52)[ref_name]
                                    } 
                                })();
                                ;
                                if (check_true (((undefined==global_ref)||(global_ref==="statement")))){
                                      return await Environment["get_global"].call(Environment,ref_name,NOT_FOUND_THING,cannot_be_js_global)
                                } else {
                                      return global_ref
                                }
                            } 
                        })();
                        if (check_true ((await not((NOT_FOUND_THING===ref_type))&&await not(await contains_ques_(ref_name,standard_types))&&await async function(){
                            let __target_obj__53=referenced_global_symbols;
                            __target_obj__53[ref_name]=ref_type;
                            return __target_obj__53;
                            
                        }()))){
                            
                        };
                         return  await async function(){
                            if (check_true( (NOT_FOUND_THING===ref_type))) {
                                 return  undefined
                            } else if (check_true( (ref_type===THIS_REFERENCE))) {
                                 return ref_type
                            } else if (check_true( ((comps && comps.length)===0))) {
                                 return  ref_type
                            } else if (check_true( (((comps && comps.length)===1)&&(ref_type instanceof Object)&&await contains_ques_((comps && comps["0"]),await (await Environment.get_global("object_methods"))(ref_type))))) {
                                 return await (async function(){
                                    let __targ__54=ref_type;
                                    if (__targ__54){
                                         return(__targ__54)[(comps && comps["0"])]
                                    } 
                                })()
                            } else if (check_true( (ref_type instanceof Object))) {
                                 return await (await Environment.get_global("resolve_path"))(comps,ref_type)
                            } else if (check_true( ((typeof ref_type==="object")&&await contains_ques_((comps && comps["0"]),await Object["keys"].call(Object,ref_type))))) {
                                await (async function(){
                                     let __test_condition__55=async function() {
                                         return  ((ref_type==undefined)||((comps && comps.length)>0))
                                    };
                                    let __body_ref__56=async function() {
                                         return  ref_type=await (async function(){
                                            let __targ__57=ref_type;
                                            if (__targ__57){
                                                 return(__targ__57)[(comps).shift()]
                                            } 
                                        })()
                                    };
                                    let __BREAK__FLAG__=false;
                                    while(await __test_condition__55()) {
                                        await __body_ref__56();
                                         if(__BREAK__FLAG__) {
                                             break;
                                            
                                        }
                                    } ;
                                    
                                })();
                                 return  ref_type
                            } else  {
                                await (async function(){
                                    let __array_op_rval__58=get_lisp_ctx_log;
                                     if (__array_op_rval__58 instanceof Function){
                                        return await __array_op_rval__58("symbol not found: ",name,ref_name,ref_type,cannot_be_js_global) 
                                    } else {
                                        return[__array_op_rval__58,"symbol not found: ",name,ref_name,ref_type,cannot_be_js_global]
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
                            if (check_true (((await safety_level(ctx)>1)&&((comps && comps.length)>1)))){
                                  return await (await Environment.get_global("safe_access"))(token,ctx,sanitize_js_ref_name)
                            } else {
                                  return await sanitize_js_ref_name(await (await Environment.get_global("expand_dot_accessor"))((token && token.name),ctx))
                            }
                        } else  {
                             return (token && token["val"])
                        }
                    } ()
                };
                has_lisp_globals=false;
                root_ctx=await new_ctx(((opts && opts["ctx"])));
                lisp_global_ctx_handle=(Environment && Environment["context"]);
                tokenize_object=async function(obj,ctx,_path) {
                    _path=(_path||[]);
                    if (check_true ((await JSON.stringify(obj)==="{}"))){
                         return  {
                            type:"object",ref:false,val:"{}",name:"{}",__token__:"true",path:_path
                        }
                    } else {
                          return await (async function() {
                            let __for_body__61=async function(pset) {
                                 return  {
                                    type:"keyval",val:await tokenize(pset,ctx,"path:",await add(_path,(pset && pset["0"]))),ref:false,name:(""+await (await Environment.get_global("as_lisp"))((pset && pset["0"]))),__token__:"true"
                                }
                            };
                            let __array__62=[],__elements__60=await (await Environment.get_global("pairs"))(obj);
                            let __BREAK__FLAG__=false;
                            for(let __iter__59 in __elements__60) {
                                __array__62.push(await __for_body__61(__elements__60[__iter__59]));
                                if(__BREAK__FLAG__) {
                                     __array__62.pop();
                                    break;
                                    
                                }
                            }return __array__62;
                             
                        })()
                    }
                };
                tokenize_quote=async function(args,_path) {
                     return  await async function(){
                        if (check_true( ((args && args["0"])===`=:quote`))) {
                             return {
                                type:"arr",__token__:"true",source:await (await Environment.get_global("as_lisp"))(args),val:await (await Environment.get_global("conj"))([{
                                    type:"special",val:`=:quote`,ref:true,name:"quote",__token__:"true"
                                }],await args["slice"].call(args,1)),ref:((args instanceof String || typeof args==='string')&&(await length(args)>2)&&await starts_with_ques_("=:",args)),name:null,path:_path
                            }
                        } else if (check_true( ((args && args["0"])===`=:quotem`))) {
                             return {
                                type:"arr",__token__:"true",source:await (await Environment.get_global("as_lisp"))(args),val:await (await Environment.get_global("conj"))([{
                                    type:"special",val:`=:quotem`,ref:true,name:"quotem",__token__:"true"
                                }],await args["slice"].call(args,1)),ref:((args instanceof String || typeof args==='string')&&(await length(args)>2)&&await starts_with_ques_("=:",args)),name:null,path:_path
                            }
                        } else  {
                             return {
                                type:"arr",__token__:"true",source:await (await Environment.get_global("as_lisp"))(args),val:await (await Environment.get_global("conj"))([{
                                    type:"special",val:`=:quotel`,ref:true,name:"quotel",__token__:"true"
                                }],await args["slice"].call(args,1)),ref:((args instanceof String || typeof args==='string')&&(await length(args)>2)&&await starts_with_ques_("=:",args)),name:null,path:_path
                            }
                        }
                    } ()
                };
                tokenize=async function(args,ctx,_path) {
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
                    _path=(_path||[]);
                    qval=null;
                    idx=-1;
                    tobject=null;
                    argdetails=null;
                    argvalue=null;
                    is_ref=null;
                    if (check_true ((null==ctx))){
                        await console.error("tokenize: nil ctx passed: ",await clone(args));
                        throw new ReferenceError("nil/undefined ctx passed to tokenize");
                        
                    };
                    if (check_true ((args instanceof Array))){
                        args=await compile_time_eval(ctx,args);
                         await async function(){
                            if (check_true( ((_path && _path.length)>1))) {
                                tobject=await (await Environment.get_global("resolve_path"))(await (await Environment.get_global("chop"))(_path),expanded_tree);
                                if (check_true (tobject)){
                                     await async function(){
                                        let __target_obj__63=tobject;
                                        __target_obj__63[await last(_path)]=args;
                                        return __target_obj__63;
                                        
                                    }()
                                }
                            } else if (check_true( ((_path && _path.length)===1))) {
                                 await async function(){
                                    let __target_obj__64=expanded_tree;
                                    __target_obj__64[await first(_path)]=args;
                                    return __target_obj__64;
                                    
                                }()
                            } else  {
                                 return expanded_tree=args
                            }
                        } ()
                    };
                     return  await async function(){
                        if (check_true( ((args instanceof String || typeof args==='string')||await is_number_ques_(args)||((args===true)||(args===false))))) {
                             return await first(await tokenize(await (async function(){
                                let __array_op_rval__65=args;
                                 if (__array_op_rval__65 instanceof Function){
                                    return await __array_op_rval__65() 
                                } else {
                                    return[__array_op_rval__65]
                                }
                            })(),ctx,_path))
                        } else if (check_true( ((args instanceof Array)&&(((args && args["0"])===`=:quotem`)||((args && args["0"])===`=:quote`)||((args && args["0"])===`=:quotel`))))) {
                            rval=await tokenize_quote(args,_path);
                             return  rval
                        } else if (check_true( ((args instanceof Array)&&await not(await get_ctx_val(ctx,"__IN_LAMBDA__"))&&((args && args["0"])===`=:iprogn`)))) {
                            rval=await compile_toplevel(args,ctx);
                             return  await tokenize(rval,ctx,_path)
                        } else if (check_true( (await not((args instanceof Array))&&(args instanceof Object)))) {
                             return await first(await tokenize(await (async function(){
                                let __array_op_rval__66=args;
                                 if (__array_op_rval__66 instanceof Function){
                                    return await __array_op_rval__66() 
                                } else {
                                    return[__array_op_rval__66]
                                }
                            })(),ctx,await add(_path,0)))
                        } else  {
                            if (check_true ((((args && args["0"])===`=:fn`)||((args && args["0"])===`=:function`)||((args && args["0"])===`=:=>`)))){
                                ctx=await new_ctx(ctx);
                                 await set_ctx(ctx,"__IN_LAMBDA__",true)
                            };
                             return  await (async function() {
                                let __for_body__69=async function(arg) {
                                    idx+=1;
                                    argdetails=await find_in_context(ctx,arg);
                                    argvalue=(argdetails && argdetails["val"]);
                                    argtype=(argdetails && argdetails["type"]);
                                    is_ref=(argdetails && argdetails["ref"]);
                                     return  await async function(){
                                        if (check_true( (await sub_type(arg)==="array"))) {
                                             return {
                                                type:"arr",__token__:"true",val:await tokenize(arg,ctx,await add(_path,idx)),ref:is_ref,name:null,path:await add(_path,idx)
                                            }
                                        } else if (check_true( (argtype==="Function"))) {
                                             return {
                                                type:"fun",__token__:"true",val:arg,ref:is_ref,name:(""+await (await Environment.get_global("as_lisp"))(arg)),path:await add(_path,idx)
                                            }
                                        } else if (check_true( (argtype==="AsyncFunction"))) {
                                             return {
                                                type:"asf",__token__:"true",val:arg,ref:is_ref,name:(""+await (await Environment.get_global("as_lisp"))(arg)),path:await add(_path,idx)
                                            }
                                        } else if (check_true( (argtype==="array"))) {
                                             return {
                                                type:"array",__token__:"true",val:arg,ref:is_ref,name:(""+await (await Environment.get_global("as_lisp"))(arg)),path:await add(_path,idx)
                                            }
                                        } else if (check_true( (argtype==="Number"))) {
                                             return {
                                                type:"num",__token__:"true",val:argvalue,ref:is_ref,name:(""+await (await Environment.get_global("as_lisp"))(arg)),path:await add(_path,idx)
                                            }
                                        } else if (check_true( ((argtype==="String")&&is_ref))) {
                                             return {
                                                type:"arg",__token__:"true",val:argvalue,ref:is_ref,name:await clean_quoted_reference((""+await (await Environment.get_global("as_lisp"))(arg))),global:(argdetails && argdetails["global"]),local:(argdetails && argdetails["local"]),path:await add(_path,idx)
                                            }
                                        } else if (check_true( (argtype==="String"))) {
                                             return {
                                                type:"literal",__token__:"true",val:argvalue,ref:is_ref,name:await clean_quoted_reference((""+await (await Environment.get_global("as_lisp"))(arg))),global:(argdetails && argdetails["global"]),path:await add(_path,idx)
                                            }
                                        } else if (check_true( (arg instanceof Object))) {
                                             return  {
                                                type:"objlit",__token__:"true",val:await tokenize_object(arg,ctx,await add(_path,idx)),ref:is_ref,name:null,path:await add(_path,idx)
                                            }
                                        } else if (check_true( ((argtype==="literal")&&is_ref&&((""+await (await Environment.get_global("as_lisp"))(arg))==="nil")))) {
                                             return {
                                                type:"null",__token__:"true",val:null,ref:true,name:"null",path:await add(_path,idx)
                                            }
                                        } else if (check_true( ((argtype==="unbound")&&is_ref&&(null==argvalue)))) {
                                             return {
                                                type:"arg",__token__:"true",val:arg,ref:true,name:await clean_quoted_reference((""+await (await Environment.get_global("as_lisp"))(arg))),path:await add(_path,idx)
                                            }
                                        } else if (check_true( ((argtype==="unbound")&&is_ref))) {
                                             return {
                                                type:await sub_type(argvalue),__token__:"true",val:argvalue,ref:true,name:await clean_quoted_reference(await sanitize_js_ref_name((""+await (await Environment.get_global("as_lisp"))(arg)))),path:await add(_path,idx)
                                            }
                                        } else  {
                                             return {
                                                type:argtype,__token__:"true",val:argvalue,ref:is_ref,name:await clean_quoted_reference((""+await (await Environment.get_global("as_lisp"))(arg))),global:(argdetails && argdetails["global"]),local:(argdetails && argdetails["local"]),path:await add(_path,idx)
                                            }
                                        }
                                    } ()
                                };
                                let __array__70=[],__elements__68=args;
                                let __BREAK__FLAG__=false;
                                for(let __iter__67 in __elements__68) {
                                    __array__70.push(await __for_body__69(__elements__68[__iter__67]));
                                    if(__BREAK__FLAG__) {
                                         __array__70.pop();
                                        break;
                                        
                                    }
                                }return __array__70;
                                 
                            })()
                        }
                    } ()
                };
                comp_time_log=await defclog({
                    prefix:"compile_time_eval",background:"#C0C0C0",color:"darkblue"
                });
                compile_time_eval=async function(ctx,lisp_tree) {
                    if (check_true (((lisp_tree instanceof Array)&&(((lisp_tree && lisp_tree["0"]) instanceof String || typeof (lisp_tree && lisp_tree["0"])==='string')&&(await length((lisp_tree && lisp_tree["0"]))>2)&&await starts_with_ques_("=:",(lisp_tree && lisp_tree["0"])))&&await (await Environment.get_global("resolve_path"))(["definitions",await (lisp_tree && lisp_tree["0"])["substr"].call((lisp_tree && lisp_tree["0"]),2),"eval_when","compile_time"],Environment)))){
                        let ntree;
                        let precompile_function;
                        ntree=null;
                        precompile_function=await Environment["get_global"].call(Environment,await (lisp_tree && lisp_tree["0"])["substr"].call((lisp_tree && lisp_tree["0"]),2));
                        await (async function(){
                            try /* TRY SIMPLE */ {
                                  return ntree=await (async function(){
                                    let __apply_args__72=await lisp_tree["slice"].call(lisp_tree,1);
                                    return ( precompile_function).apply(this,__apply_args__72)
                                })() 
                            } catch(__exception__71) {
                                  if (__exception__71 instanceof Error) {
                                     let e=__exception__71;
                                     {
                                        await async function(){
                                            let __target_obj__74=e;
                                            __target_obj__74["handled"]=true;
                                            return __target_obj__74;
                                            
                                        }();
                                        (errors).push({
                                            error:(e && e.name),message:(e && e.message),form:await source_chain([0],await (async function(){
                                                let __array_op_rval__75=lisp_tree;
                                                 if (__array_op_rval__75 instanceof Function){
                                                    return await __array_op_rval__75() 
                                                } else {
                                                    return[__array_op_rval__75]
                                                }
                                            })()),parent_forms:[],invalid:true
                                        });
                                        throw e;
                                        
                                    }
                                } 
                            }
                        })();
                        if (check_true ((null==ntree))){
                             (warnings).push(("compile time function "+await (lisp_tree && lisp_tree["0"])["substr"].call((lisp_tree && lisp_tree["0"]),2)+" returned nil"))
                        } else {
                            ntree=await do_deferred_splice(ntree);
                            if (check_true (await not((await JSON.stringify(ntree)===await JSON.stringify(lisp_tree))))){
                                 ntree=await compile_time_eval(ctx,ntree)
                            };
                            if (check_true (await verbosity(ctx))){
                                 await (async function(){
                                    let __array_op_rval__76=comp_time_log;
                                     if (__array_op_rval__76 instanceof Function){
                                        return await __array_op_rval__76(await (lisp_tree && lisp_tree["0"])["substr"].call((lisp_tree && lisp_tree["0"]),2),"<- lisp: ",await (await Environment.get_global("as_lisp"))(ntree)) 
                                    } else {
                                        return[__array_op_rval__76,await (lisp_tree && lisp_tree["0"])["substr"].call((lisp_tree && lisp_tree["0"]),2),"<- lisp: ",await (await Environment.get_global("as_lisp"))(ntree)]
                                    }
                                })()
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
                        let __targ__77=await first(tokens);
                        if (__targ__77){
                             return(__targ__77)["name"]
                        } 
                    })();
                    math_op=(await (async function(){
                        let __targ__78=op_translation;
                        if (__targ__78){
                             return(__targ__78)[math_op_a]
                        } 
                    })()||math_op_a);
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
                         if (check_true (((tokens && tokens["1"] && tokens["1"]["ref"])&&((tokens && tokens["1"] && tokens["1"]["name"]) instanceof String || typeof (tokens && tokens["1"] && tokens["1"]["name"])==='string')))){
                              return await get_ctx_val(ctx,(tokens && tokens["1"] && tokens["1"]["name"]))
                        } 
                    })();
                    is_overloaded=false;
                    token=null;
                    add_operand=async function() {
                        if (check_true (((idx>1)&&(idx<((tokens && tokens.length)-0))))){
                             return  (acc).push(math_op)
                        }
                    };
                    acc=[{
                        ctype:"expression"
                    }];
                    await set_ctx(ctx,"__COMP_INFIX_OPS__",true);
                    if (check_true (((((declaration && declaration["type"])===Array)||((declaration && declaration["type"])===Object)||(symbol_ctx_val==="objliteral")||(symbol_ctx_val===Expression)||(symbol_ctx_val===ArgumentType)||((tokens && tokens["1"] && tokens["1"]["type"])==="objlit")||((tokens && tokens["1"] && tokens["1"]["type"])==="arr"))&&(math_op==="+")))){
                         is_overloaded=true
                    };
                    if (check_true (is_overloaded)){
                        await async function(){
                            let __target_obj__79=tokens;
                            __target_obj__79[0]={
                                type:"function",val:await add("=:","add"),name:"add",ref:true
                            };
                            return __target_obj__79;
                            
                        }();
                        stmts=await compile(tokens,ctx);
                        stmts=await wrap_assignment_value(stmts,ctx);
                         return  stmts
                    } else {
                        (acc).push("(");
                        await (async function(){
                             let __test_condition__80=async function() {
                                 return  (idx<((tokens && tokens.length)-1))
                            };
                            let __body_ref__81=async function() {
                                idx+=1;
                                token=await (async function(){
                                    let __targ__82=tokens;
                                    if (__targ__82){
                                         return(__targ__82)[idx]
                                    } 
                                })();
                                await add_operand();
                                 return  (acc).push(await wrap_assignment_value(await compile(token,ctx),ctx))
                            };
                            let __BREAK__FLAG__=false;
                            while(await __test_condition__80()) {
                                await __body_ref__81();
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
                    let target_reference;
                    let complicated;
                    let target;
                    let idx;
                    acc=[];
                    wrapper=[];
                    stmt=null;
                    preamble=await calling_preamble(ctx);
                    token=await second(tokens);
                    target_reference=await gen_temp_name("target_obj");
                    complicated=await (async function(){
                        let __array_op_rval__83=is_complex_ques_;
                         if (__array_op_rval__83 instanceof Function){
                            return await __array_op_rval__83((token && token["val"])) 
                        } else {
                            return[__array_op_rval__83,(token && token["val"])]
                        }
                    })();
                    target=await (async function () {
                         if (check_true (complicated)){
                              return await compile_wrapper_fn((token && token["val"]),ctx)
                        } else {
                              return await compile(token,ctx)
                        } 
                    })();
                    idx=1;
                    await (async function() {
                        let __for_body__86=async function(t) {
                             return  (wrapper).push(t)
                        };
                        let __array__87=[],__elements__85=await (async function(){
                            let __array_op_rval__88=(preamble && preamble["0"]);
                             if (__array_op_rval__88 instanceof Function){
                                return await __array_op_rval__88(" ",(preamble && preamble["1"])," ",(preamble && preamble["3"]),"function","()","{","let"," ",target_reference,"=",target,";") 
                            } else {
                                return[__array_op_rval__88," ",(preamble && preamble["1"])," ",(preamble && preamble["3"]),"function","()","{","let"," ",target_reference,"=",target,";"]
                            }
                        })();
                        let __BREAK__FLAG__=false;
                        for(let __iter__84 in __elements__85) {
                            __array__87.push(await __for_body__86(__elements__85[__iter__84]));
                            if(__BREAK__FLAG__) {
                                 __array__87.pop();
                                break;
                                
                            }
                        }return __array__87;
                         
                    })();
                    await (async function(){
                         let __test_condition__89=async function() {
                             return  (idx<((tokens && tokens.length)-1))
                        };
                        let __body_ref__90=async function() {
                            idx+=1;
                            (acc).push(target_reference);
                            token=await (async function(){
                                let __targ__91=tokens;
                                if (__targ__91){
                                     return(__targ__91)[idx]
                                } 
                            })();
                            (acc).push("[");
                            stmt=await wrap_assignment_value(await compile(token,ctx),ctx);
                            (acc).push(stmt);
                            (acc).push("]");
                            idx+=1;
                            (acc).push("=");
                            token=await (async function(){
                                let __targ__92=tokens;
                                if (__targ__92){
                                     return(__targ__92)[idx]
                                } 
                            })();
                            if (check_true ((null==token)))throw new Error("set_prop: odd number of arguments");
                            ;
                            stmt=await wrap_assignment_value(await compile(token,ctx),ctx);
                            (acc).push(stmt);
                             return  (acc).push(";")
                        };
                        let __BREAK__FLAG__=false;
                        while(await __test_condition__89()) {
                            await __body_ref__90();
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
                    let acc;
                    let target;
                    let target_val;
                    let preamble;
                    let idx_key;
                    acc=[];
                    target=await wrap_assignment_value(await compile(await second(tokens),ctx),ctx);
                    target_val=null;
                    preamble=await calling_preamble(ctx);
                    idx_key=await wrap_assignment_value(await compile(await (async function(){
                        let __targ__93=tokens;
                        if (__targ__93){
                             return(__targ__93)[2]
                        } 
                    })(),ctx),ctx);
                    if (check_true ((await safety_level(ctx)>1))){
                        target_val=await gen_temp_name("targ");
                         return  await (async function(){
                            let __array_op_rval__94=(preamble && preamble["0"]);
                             if (__array_op_rval__94 instanceof Function){
                                return await __array_op_rval__94(" ","(",(preamble && preamble["1"])," ","function","()","{","let"," ",target_val,"=",target,";","if"," ","(",target_val,")","{"," ","return","(",target_val,")","[",idx_key,"]","}"," ","}",")","()") 
                            } else {
                                return[__array_op_rval__94," ","(",(preamble && preamble["1"])," ","function","()","{","let"," ",target_val,"=",target,";","if"," ","(",target_val,")","{"," ","return","(",target_val,")","[",idx_key,"]","}"," ","}",")","()"]
                            }
                        })()
                    } else {
                          return ["(",target,")","[",idx_key,"]"]
                    }
                };
                compile_elem=async function(token,ctx) {
                    let rval;
                    let __check_needs_wrap__95= async function(){
                        return async function(stmts) {
                            let fst;
                            fst=(((stmts instanceof Array)&&await first(stmts)&&(await first(stmts) instanceof Object)&&await (async function(){
                                let __targ__96=await first(stmts);
                                if (__targ__96){
                                     return(__targ__96)["ctype"]
                                } 
                            })()&&await async function(){
                                if (check_true( (await (async function(){
                                    let __targ__97=await first(stmts);
                                    if (__targ__97){
                                         return(__targ__97)["ctype"]
                                    } 
                                })() instanceof String || typeof await (async function(){
                                    let __targ__97=await first(stmts);
                                    if (__targ__97){
                                         return(__targ__97)["ctype"]
                                    } 
                                })()==='string'))) {
                                     return await (async function(){
                                        let __targ__98=await first(stmts);
                                        if (__targ__98){
                                             return(__targ__98)["ctype"]
                                        } 
                                    })()
                                } else  {
                                     return await sub_type(await (async function(){
                                        let __targ__99=await first(stmts);
                                        if (__targ__99){
                                             return(__targ__99)["ctype"]
                                        } 
                                    })())
                                }
                            } ()));
                             return  await async function(){
                                if (check_true( await contains_ques_("block",fst))) {
                                     return true
                                } else  {
                                     return false
                                }
                            } ()
                        }
                    };
                    {
                        rval=null;
                        let check_needs_wrap=await __check_needs_wrap__95();
                        ;
                        if (check_true (await (async function(){
                            let __array_op_rval__100=is_complex_ques_;
                             if (__array_op_rval__100 instanceof Function){
                                return await __array_op_rval__100((token && token["val"])) 
                            } else {
                                return[__array_op_rval__100,(token && token["val"])]
                            }
                        })())){
                             rval=await compile_wrapper_fn(token,ctx)
                        } else {
                             rval=await compile(token,ctx)
                        };
                        if (check_true (await not((rval instanceof Array)))){
                             rval=await (async function(){
                                let __array_op_rval__101=rval;
                                 if (__array_op_rval__101 instanceof Function){
                                    return await __array_op_rval__101() 
                                } else {
                                    return[__array_op_rval__101]
                                }
                            })()
                        };
                         return  rval
                    }
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
                        let __for_body__104=async function(token) {
                            stmt=await wrap_assignment_value(await compile(token,ctx),ctx);
                             return  (args).push(stmt)
                        };
                        let __array__105=[],__elements__103=await tokens["slice"].call(tokens,1);
                        let __BREAK__FLAG__=false;
                        for(let __iter__102 in __elements__103) {
                            __array__105.push(await __for_body__104(__elements__103[__iter__102]));
                            if(__BREAK__FLAG__) {
                                 __array__105.pop();
                                break;
                                
                            }
                        }return __array__105;
                         
                    })();
                    if (check_true (await verbosity())){
                         await (async function(){
                            let __array_op_rval__106=inline_log;
                             if (__array_op_rval__106 instanceof Function){
                                return await __array_op_rval__106("args: ",args) 
                            } else {
                                return[__array_op_rval__106,"args: ",args]
                            }
                        })()
                    };
                    if (check_true (await (async function(){
                        let __targ__107=(Environment && Environment["inlines"]);
                        if (__targ__107){
                             return(__targ__107)[(tokens && tokens["0"] && tokens["0"]["name"])]
                        } 
                    })())){
                        inline_fn=await (async function(){
                            let __targ__108=(Environment && Environment["inlines"]);
                            if (__targ__108){
                                 return(__targ__108)[(tokens && tokens["0"] && tokens["0"]["name"])]
                            } 
                        })();
                         rval=await (async function(){
                            let __array_op_rval__109=inline_fn;
                             if (__array_op_rval__109 instanceof Function){
                                return await __array_op_rval__109(args) 
                            } else {
                                return[__array_op_rval__109,args]
                            }
                        })()
                    } else throw new ReferenceError(("no source for named lib function "+(tokens && tokens["0"] && tokens["0"]["name"])));
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
                        let __array_op_rval__110=place;
                         if (__array_op_rval__110 instanceof Function){
                            return await __array_op_rval__110(".push","(",thing,")") 
                        } else {
                            return[__array_op_rval__110,".push","(",thing,")"]
                        }
                    })()
                };
                compile_list=async function(tokens,ctx) {
                    let acc;
                    let compiled_values;
                    acc=["["];
                    compiled_values=[];
                    await (async function() {
                        let __for_body__113=async function(t) {
                             return  (compiled_values).push(await wrap_assignment_value(await compile(t,ctx),ctx))
                        };
                        let __array__114=[],__elements__112=await tokens["slice"].call(tokens,1);
                        let __BREAK__FLAG__=false;
                        for(let __iter__111 in __elements__112) {
                            __array__114.push(await __for_body__113(__elements__112[__iter__111]));
                            if(__BREAK__FLAG__) {
                                 __array__114.pop();
                                break;
                                
                            }
                        }return __array__114;
                         
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
                    if (check_true (((tokens && tokens["1"] && tokens["1"]["ref"])&&local_details))){
                          return ["typeof"," ",(tokens && tokens["1"] && tokens["1"]["name"])]
                    } else {
                          return ["typeof"," ",await compile_elem((tokens && tokens["1"]),ctx)]
                    }
                };
                compile_instanceof=async function(tokens,ctx) {
                    let acc;
                    acc=[];
                    if (check_true (((tokens instanceof Array)&&((tokens && tokens.length)===3)))){
                        let __array_arg__117=(async function() {
                            if (check_true (await (async function(){
                                let __array_op_rval__115=is_complex_ques_;
                                 if (__array_op_rval__115 instanceof Function){
                                    return await __array_op_rval__115((tokens && tokens["1"])) 
                                } else {
                                    return[__array_op_rval__115,(tokens && tokens["1"])]
                                }
                            })())){
                                  return await compile_wrapper_fn((tokens && tokens["1"]),ctx)
                            } else {
                                  return await compile((tokens && tokens["1"]),ctx)
                            }
                        } );
                        let __array_arg__118=(async function() {
                            if (check_true (await (async function(){
                                let __array_op_rval__116=is_complex_ques_;
                                 if (__array_op_rval__116 instanceof Function){
                                    return await __array_op_rval__116((tokens && tokens["1"])) 
                                } else {
                                    return[__array_op_rval__116,(tokens && tokens["1"])]
                                }
                            })())){
                                  return await compile_wrapper_fn((tokens && tokens["2"]),ctx)
                            } else {
                                  return await compile((tokens && tokens["2"]),ctx)
                            }
                        } );
                        return ["(",await __array_arg__117()," ","instanceof"," ",await __array_arg__118(),")"]
                    } else throw new SyntaxError("instanceof requires 2 arguments");
                    
                };
                compile_compare=async function(tokens,ctx) {
                    let acc;
                    let ops;
                    let __operator__119= async function(){
                        return await (async function(){
                            let __targ__122=ops;
                            if (__targ__122){
                                 return(__targ__122)[await (async function(){
                                    let __targ__121=await first(tokens);
                                    if (__targ__121){
                                         return(__targ__121)["name"]
                                    } 
                                })()]
                            } 
                        })()
                    };
                    let left;
                    let right;
                    {
                        acc=[{
                            ctype:"expression"
                        }];
                        ctx=await new_ctx(ctx);
                        ops=await ( async function(){
                            let __obj__120=new Object();
                            __obj__120["eq"]="==";
                            __obj__120["=="]="===";
                            __obj__120["<"]="<";
                            __obj__120[">"]=">";
                            __obj__120["gt"]=">";
                            __obj__120["lt"]="<";
                            __obj__120["<="]="<=";
                            __obj__120[">="]=">=";
                            return __obj__120;
                            
                        })();
                        let operator=await __operator__119();
                        ;
                        left=await (async function(){
                            let __targ__123=tokens;
                            if (__targ__123){
                                 return(__targ__123)[1]
                            } 
                        })();
                        right=await (async function(){
                            let __targ__124=tokens;
                            if (__targ__124){
                                 return(__targ__124)[2]
                            } 
                        })();
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
                        let __targ__125=await first(tokens);
                        if (__targ__125){
                             return(__targ__125)["name"]
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
                             throw new Error(("assignment: invalid target: "+(token && token["name"])));
                            
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
                    await unset_ambiguous(ctx,target);
                    await async function(){
                        let __target_obj__126=ctx;
                        __target_obj__126["in_assignment"]=true;
                        return __target_obj__126;
                        
                    }();
                    assignment_value=await compile((tokens && tokens["2"]),ctx);
                    if (check_true (((assignment_value instanceof Array)&&((assignment_value && assignment_value["0"]) instanceof Object)&&(assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])))){
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
                            let __for_body__129=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__130=[],__elements__128=[{
                                ctype:"statement"
                            },(preamble && preamble["0"])," ","Environment",".","set_global","(","\"",target,"\"",",",assignment_value,")"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__127 in __elements__128) {
                                __array__130.push(await __for_body__129(__elements__128[__iter__127]));
                                if(__BREAK__FLAG__) {
                                     __array__130.pop();
                                    break;
                                    
                                }
                            }return __array__130;
                             
                        })()
                    };
                    await async function(){
                        let __target_obj__131=ctx;
                        __target_obj__131["in_assignment"]=false;
                        return __target_obj__131;
                        
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
                                    prefix:("needs_return ("+(ctx && ctx["block_id"])+")"),background:"#C0C0C0",color:"darkgreen"
                                })
                            } 
                        })();
                        flattened=null;
                         return  await async function(){
                            if (check_true( (null==final_stmt))) {
                                 return  false
                            } else if (check_true( (await not((final_stmt instanceof Array))&&await not(("}"===final_stmt))))) {
                                 return true
                            } else  {
                                flattened=await flatten(final_stmt);
                                await async function(){
                                    if (check_true( ((await first(flattened) instanceof Object)&&await (async function(){
                                        let __targ__132=await first(flattened);
                                        if (__targ__132){
                                             return(__targ__132)["ctype"]
                                        } 
                                    })()))) {
                                         return inst=await first(flattened)
                                    } else if (check_true( ((await first(flattened) instanceof String || typeof await first(flattened)==='string')&&await starts_with_ques_("/*",await first(flattened))&&(await second(flattened) instanceof Object)&&await (async function(){
                                        let __targ__133=await second(flattened);
                                        if (__targ__133){
                                             return(__targ__133)["ctype"]
                                        } 
                                    })()))) {
                                         return inst=await second(flattened)
                                    }
                                } ();
                                 return  await async function(){
                                    if (check_true( (inst&&((inst && inst["ctype"])==="objliteral")))) {
                                         return true
                                    } else if (check_true( (inst&&(((inst && inst["ctype"])==="ifblock")||((inst && inst["ctype"])==="letblock")||((inst && inst["ctype"])==="block")||((inst && inst["ctype"])==="assignment")||((inst && inst["ctype"])==="return"))))) {
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
                            let __tokens__134= async function(){
                                return null
                            };
                            let stmt;
                            let num_non_return_statements;
                            {
                                idx=0;
                                rval=null;
                                let tokens=await __tokens__134();
                                ;
                                stmt=null;
                                num_non_return_statements=(await length(lisp_tree)-2);
                                ctx=await (async function () {
                                     if (check_true ((block_options && block_options["no_scope_boundary"]))){
                                          return ctx
                                    } else {
                                          return await new_ctx(ctx)
                                    } 
                                })();
                                await (async function(){
                                     let __test_condition__135=async function() {
                                         return  (idx<num_non_return_statements)
                                    };
                                    let __body_ref__136=async function() {
                                        idx+=1;
                                        if (check_true (await verbosity(ctx))){
                                            await console.log("");
                                             await (async function(){
                                                let __array_op_rval__138=top_level_log;
                                                 if (__array_op_rval__138 instanceof Function){
                                                    return await __array_op_rval__138((""+idx+"/"+num_non_return_statements),"->",await (await Environment.get_global("as_lisp"))(await (async function(){
                                                        let __targ__137=lisp_tree;
                                                        if (__targ__137){
                                                             return(__targ__137)[idx]
                                                        } 
                                                    })())) 
                                                } else {
                                                    return[__array_op_rval__138,(""+idx+"/"+num_non_return_statements),"->",await (await Environment.get_global("as_lisp"))(await (async function(){
                                                        let __targ__137=lisp_tree;
                                                        if (__targ__137){
                                                             return(__targ__137)[idx]
                                                        } 
                                                    })())]
                                                }
                                            })()
                                        };
                                        tokens=await tokenize(await (async function(){
                                            let __targ__139=lisp_tree;
                                            if (__targ__139){
                                                 return(__targ__139)[idx]
                                            } 
                                        })(),ctx);
                                        stmt=await compile(tokens,ctx);
                                        rval=await wrap_and_run(stmt,ctx,{
                                            bind_mode:true
                                        });
                                        if (check_true (await verbosity(ctx))){
                                            await (async function(){
                                                let __array_op_rval__140=top_level_log;
                                                 if (__array_op_rval__140 instanceof Function){
                                                    return await __array_op_rval__140((""+idx+"/"+num_non_return_statements),"compiled <- ",await (await Environment.get_global("as_lisp"))(stmt)) 
                                                } else {
                                                    return[__array_op_rval__140,(""+idx+"/"+num_non_return_statements),"compiled <- ",await (await Environment.get_global("as_lisp"))(stmt)]
                                                }
                                            })();
                                             return  await (async function(){
                                                let __array_op_rval__141=top_level_log;
                                                 if (__array_op_rval__141 instanceof Function){
                                                    return await __array_op_rval__141((""+idx+"/"+num_non_return_statements),"<-",await (await Environment.get_global("as_lisp"))(rval)) 
                                                } else {
                                                    return[__array_op_rval__141,(""+idx+"/"+num_non_return_statements),"<-",await (await Environment.get_global("as_lisp"))(rval)]
                                                }
                                            })()
                                        }
                                    };
                                    let __BREAK__FLAG__=false;
                                    while(await __test_condition__135()) {
                                        await __body_ref__136();
                                         if(__BREAK__FLAG__) {
                                             break;
                                            
                                        }
                                    } ;
                                    
                                })();
                                 return  await (async function(){
                                    let __targ__142=lisp_tree;
                                    if (__targ__142){
                                         return(__targ__142)[(idx+1)]
                                    } 
                                })()
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
                    let return_last;
                    let stmt;
                    let stmt_ctype;
                    let lambda_block;
                    let stmts;
                    let idx;
                    acc=[];
                    block_id=(((block_options && block_options.name)&&await add((block_options && block_options.name),(blk_counter=blk_counter+1)))||(blk_counter=blk_counter+1));
                    clog=await (async function () {
                         if (check_true (quiet_mode)){
                              return log
                        } else {
                              return await defclog({
                                prefix:("compile_block ("+block_id+"):"),background:"#404080",color:"white"
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
                    return_last=(ctx && ctx["return_last_value"]);
                    stmt=null;
                    stmt_ctype=null;
                    lambda_block=false;
                    stmts=[];
                    idx=0;
                    if (check_true ((null==ctx))){
                        throw new ReferenceError("undefined ctx passed to compile block");
                        
                    };
                    if (check_true ((opts && opts["include_source"]))){
                        if (check_true (((tokens && tokens["path"])&&((tokens && tokens["path"] && tokens["path"]["length"])>0)))){
                             (acc).push(await source_comment(tokens))
                        }
                    };
                    await async function(){
                        let __target_obj__143=ctx;
                        __target_obj__143["block_id"]=block_id;
                        return __target_obj__143;
                        
                    }();
                    if (check_true ((await get_ctx_val(ctx,"__LAMBDA_STEP__")===-1))){
                        lambda_block=true;
                         await (await Environment.get_global("setf_ctx"))(ctx,"__LAMBDA_STEP__",((tokens && tokens.length)-1))
                    };
                    if (check_true (await not((block_options && block_options["no_scope_boundary"])))){
                         (acc).push("{")
                    };
                    await (async function(){
                         let __test_condition__144=async function() {
                             return  (idx<((tokens && tokens.length)-1))
                        };
                        let __body_ref__145=async function() {
                            idx+=1;
                            token=await (async function(){
                                let __targ__146=tokens;
                                if (__targ__146){
                                     return(__targ__146)[idx]
                                } 
                            })();
                            if (check_true ((idx===((tokens && tokens.length)-1)))){
                                 await async function(){
                                    let __target_obj__147=ctx;
                                    __target_obj__147["final_block_statement"]=true;
                                    return __target_obj__147;
                                    
                                }()
                            };
                            await async function(){
                                let __target_obj__148=ctx;
                                __target_obj__148["block_step"]=((tokens && tokens.length)-1-idx);
                                return __target_obj__148;
                                
                            }();
                            if (check_true (lambda_block)){
                                 await set_ctx(ctx,"__LAMBDA_STEP__",((tokens && tokens.length)-1-idx))
                            };
                            if (check_true ((((token && token["type"])==="arr")&&((token && token["val"] && token["val"]["0"] && token["val"]["0"]["name"])==="return")))){
                                (stmts).push(await compile_return((token && token["val"]),ctx));
                                 stmt=[]
                            } else {
                                if (check_true ((((token && token["val"] && token["val"]["0"] && token["val"]["0"]["name"])==="declare")&&(block_options && block_options["ignore_declarations"])))){
                                     stmt={
                                        ignored:"declare"
                                    }
                                } else {
                                     stmt=await compile(token,ctx)
                                }
                            };
                            await async function(){
                                if (check_true( (((stmt && stmt["0"])===break_out)&&((stmt && stmt["1"])==="=")&&((stmt && stmt["2"])==="true")))) {
                                     return  true
                                } else  {
                                     return true
                                }
                            } ();
                            await (await Environment.get_global("assert"))(await not((stmt===undefined)),"compile_block: returned stmt is undefined");
                            stmt_ctype=(((ctx && ctx["block_step"])>0)&&(await first(stmt) instanceof Object)&&await (async function(){
                                let __targ__149=await first(stmt);
                                if (__targ__149){
                                     return(__targ__149)["ctype"]
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
                            if (check_true ((idx<((tokens && tokens.length)-1)))){
                                 return  (stmts).push(";")
                            }
                        };
                        let __BREAK__FLAG__=false;
                        while(await __test_condition__144()) {
                            await __body_ref__145();
                             if(__BREAK__FLAG__) {
                                 break;
                                
                            }
                        } ;
                        
                    })();
                    await async function(){
                        if (check_true( (await not((block_options && block_options["suppress_return"]))&&await not((ctx && ctx["suppress_return"]))&&(await (async function(){
                            let __array_op_rval__150=needs_return_ques_;
                             if (__array_op_rval__150 instanceof Function){
                                return await __array_op_rval__150(stmts,ctx) 
                            } else {
                                return[__array_op_rval__150,stmts,ctx]
                            }
                        })()||((idx>1)&&await (async function(){
                            let __array_op_rval__151=needs_return_ques_;
                             if (__array_op_rval__151 instanceof Function){
                                return await __array_op_rval__151(stmts,ctx) 
                            } else {
                                return[__array_op_rval__151,stmts,ctx]
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
                            let __array_op_rval__152=needs_return_ques_;
                             if (__array_op_rval__152 instanceof Function){
                                return await __array_op_rval__152(stmts,ctx) 
                            } else {
                                return[__array_op_rval__152,stmts,ctx]
                            }
                        })()||((idx>1)&&await (async function(){
                            let __array_op_rval__153=needs_return_ques_;
                             if (__array_op_rval__153 instanceof Function){
                                return await __array_op_rval__153(stmts,ctx) 
                            } else {
                                return[__array_op_rval__153,stmts,ctx]
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
                NilType=new Function("","{ return \"nil\" }");
                UnknownType=new Function(""," { return \"unknown\"} ");
                ArgumentType=new Function(""," { return \"argument\" }");
                compile_defvar=async function(tokens,ctx) {
                    let target;
                    let wrap_as_function_ques_;
                    let ctx_details;
                    let assignment_type;
                    let __check_needs_wrap__154= async function(){
                        return async function(stmts) {
                            let fst;
                            fst=(((stmts instanceof Array)&&await first(stmts)&&(await first(stmts) instanceof Object)&&await (async function(){
                                let __targ__155=await first(stmts);
                                if (__targ__155){
                                     return(__targ__155)["ctype"]
                                } 
                            })()&&await async function(){
                                if (check_true( (await (async function(){
                                    let __targ__156=await first(stmts);
                                    if (__targ__156){
                                         return(__targ__156)["ctype"]
                                    } 
                                })() instanceof String || typeof await (async function(){
                                    let __targ__156=await first(stmts);
                                    if (__targ__156){
                                         return(__targ__156)["ctype"]
                                    } 
                                })()==='string'))) {
                                     return await (async function(){
                                        let __targ__157=await first(stmts);
                                        if (__targ__157){
                                             return(__targ__157)["ctype"]
                                        } 
                                    })()
                                } else  {
                                     return await sub_type(await (async function(){
                                        let __targ__158=await first(stmts);
                                        if (__targ__158){
                                             return(__targ__158)["ctype"]
                                        } 
                                    })())
                                }
                            } ())||"");
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
                        assignment_type=null;
                        let check_needs_wrap=await __check_needs_wrap__154();
                        ;
                        assignment_value=null;
                        assignment_value=await (async function ()  {
                             return  await compile((tokens && tokens["2"]),ctx)
                        } )();
                        ctx_details=await get_declaration_details(ctx,target);
                        assignment_type=await add(new Object(),ctx_details,await get_declarations(ctx,target));
                        await async function(){
                            if (check_true( ((assignment_value instanceof Array)&&((assignment_value && assignment_value["0"]) instanceof Object)&&(assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])))) {
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
                            },"let"," ",target,"=",assignment_value,"()",";"]
                        } else {
                            let __array_arg__159=(async function() {
                                if (check_true (((ctx_details && ctx_details["is_argument"])&&((ctx_details && ctx_details["levels_up"])===1)))){
                                      return ""
                                } else {
                                      return "let "
                                }
                            } );
                            return [{
                                ctype:"assignment"
                            },await __array_arg__159(),"",target,"=",[assignment_value],";"]
                        }
                    }
                };
                get_declaration_details=async function(ctx,symname,_levels_up) {
                     return  await async function(){
                        if (check_true( (await (async function(){
                            let __targ__160=(ctx && ctx["scope"]);
                            if (__targ__160){
                                 return(__targ__160)[symname]
                            } 
                        })()&&await (async function(){
                            let __targ__161=ctx;
                            if (__targ__161){
                                 return(__targ__161)["lambda_scope"]
                            } 
                        })()))) {
                             return {
                                name:symname,is_argument:true,levels_up:(_levels_up||0),value:await (async function(){
                                    let __targ__162=(ctx && ctx["scope"]);
                                    if (__targ__162){
                                         return(__targ__162)[symname]
                                    } 
                                })(),declared_global:await (async function() {
                                    if (check_true (await (async function(){
                                        let __targ__163=(root_ctx && root_ctx["defined_lisp_globals"]);
                                        if (__targ__163){
                                             return(__targ__163)[symname]
                                        } 
                                    })())){
                                          return true
                                    } else {
                                          return false
                                    }
                                } )()
                            }
                        } else if (check_true( await (async function(){
                            let __targ__164=(ctx && ctx["scope"]);
                            if (__targ__164){
                                 return(__targ__164)[symname]
                            } 
                        })())) {
                             return {
                                name:symname,is_argument:false,levels_up:(_levels_up||0),value:await (async function(){
                                    let __targ__165=(ctx && ctx["scope"]);
                                    if (__targ__165){
                                         return(__targ__165)[symname]
                                    } 
                                })(),declarations:await get_declarations(ctx,symname),declared_global:await (async function() {
                                    if (check_true (await (async function(){
                                        let __targ__166=(root_ctx && root_ctx["defined_lisp_globals"]);
                                        if (__targ__166){
                                             return(__targ__166)[symname]
                                        } 
                                    })())){
                                          return true
                                    } else {
                                          return false
                                    }
                                } )()
                            }
                        } else if (check_true( ((await (async function(){
                            let __targ__167=ctx;
                            if (__targ__167){
                                 return(__targ__167)["parent"]
                            } 
                        })()==null)&&await (async function(){
                            let __targ__168=(root_ctx && root_ctx["defined_lisp_globals"]);
                            if (__targ__168){
                                 return(__targ__168)[symname]
                            } 
                        })()))) {
                             return {
                                name:symname,is_argument:false,levels_up:(_levels_up||0),value:await (async function(){
                                    let __targ__169=(ctx && ctx["scope"]);
                                    if (__targ__169){
                                         return(__targ__169)[symname]
                                    } 
                                })(),declarations:await get_declarations(ctx,symname),declared_global:true
                            }
                        } else if (check_true((ctx && ctx["parent"]))) {
                             return await get_declaration_details((ctx && ctx["parent"]),symname,((_levels_up&&await add(_levels_up,1))||1))
                        } else if (check_true( await not((NOT_FOUND_THING===await Environment["get_global"].call(Environment,symname,NOT_FOUND_THING))))) {
                             return {
                                name:symname,is_argument:false,levels_up:(_levels_up||0),value:await Environment["get_global"].call(Environment,symname),declared_global:true
                            }
                        }
                    } ()
                };
                wrap_assignment_value=async function(stmts,ctx) {
                    let fst;
                    let preamble;
                    fst=(""+(((stmts instanceof Array)&&await first(stmts)&&(await first(stmts) instanceof Object)&&await (async function(){
                        let __targ__170=await first(stmts);
                        if (__targ__170){
                             return(__targ__170)["ctype"]
                        } 
                    })()&&await async function(){
                        if (check_true( (await (async function(){
                            let __targ__171=await first(stmts);
                            if (__targ__171){
                                 return(__targ__171)["ctype"]
                            } 
                        })() instanceof String || typeof await (async function(){
                            let __targ__171=await first(stmts);
                            if (__targ__171){
                                 return(__targ__171)["ctype"]
                            } 
                        })()==='string'))) {
                             return await (async function(){
                                let __targ__172=await first(stmts);
                                if (__targ__172){
                                     return(__targ__172)["ctype"]
                                } 
                            })()
                        } else  {
                             return await sub_type(await (async function(){
                                let __targ__173=await first(stmts);
                                if (__targ__173){
                                     return(__targ__173)["ctype"]
                                } 
                            })())
                        }
                    } ())||""));
                    preamble=await calling_preamble(ctx);
                     return  await async function(){
                        if (check_true( ("ifblock"===fst))) {
                             return await (async function(){
                                let __array_op_rval__174=(preamble && preamble["2"]);
                                 if (__array_op_rval__174 instanceof Function){
                                    return await __array_op_rval__174({
                                        mark:"wrap_assignment_value"
                                    },(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function"," ","()"," ","{"," ",stmts," ","}",")","()") 
                                } else {
                                    return[__array_op_rval__174,{
                                        mark:"wrap_assignment_value"
                                    },(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function"," ","()"," ","{"," ",stmts," ","}",")","()"]
                                }
                            })()
                        } else if (check_true( await contains_ques_("block",fst))) {
                             return await (async function(){
                                let __array_op_rval__175=(preamble && preamble["2"]);
                                 if (__array_op_rval__175 instanceof Function){
                                    return await __array_op_rval__175({
                                        mark:"wrap_assignment_value"
                                    },(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function"," ","()"," "," ",stmts," ",")","()") 
                                } else {
                                    return[__array_op_rval__175,{
                                        mark:"wrap_assignment_value"
                                    },(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function"," ","()"," "," ",stmts," ",")","()"]
                                }
                            })()
                        } else  {
                             return stmts
                        }
                    } ()
                };
                clean_quoted_reference=async function(name) {
                     return  await async function(){
                        if (check_true( ((name instanceof String || typeof name==='string')&&await starts_with_ques_("\"",name)&&await (await Environment.get_global("ends_with?"))("\"",name)))) {
                             return await (async function() {
                                {
                                     let __call_target__=await name["substr"].call(name,1), __call_method__="substr";
                                    return await __call_target__[__call_method__].call(__call_target__,0,(await length(name)-2))
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
                                prefix:("compile_let: "+((ctx && ctx["block_id"])||"")),background:"#B0A0F0",color:"black"
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
                    await (await Environment.get_global("compiler_syntax_validation"))("compile_let",tokens,errors,ctx,tree);
                    await async function(){
                        let __target_obj__176=ctx;
                        __target_obj__176["return_last_value"]=true;
                        return __target_obj__176;
                        
                    }();
                    (acc).push("{");
                    sub_block_count+=1;
                    if (check_true (((block && block["0"] && block["0"]["val"] && block["0"]["val"]["0"] && block["0"]["val"]["0"]["name"])==="declare"))){
                        declarations_handled=true;
                         (acc).push(await compile_declare((block && block["0"] && block["0"]["val"]),ctx))
                    };
                    await (async function(){
                         let __test_condition__177=async function() {
                             return  (idx<((allocations && allocations.length)-1))
                        };
                        let __body_ref__178=async function() {
                            idx+=1;
                            alloc_set=await (async function(){
                                let __targ__180=await (async function(){
                                    let __targ__179=allocations;
                                    if (__targ__179){
                                         return(__targ__179)[idx]
                                    } 
                                })();
                                if (__targ__180){
                                     return(__targ__180)["val"]
                                } 
                            })();
                            reference_name=await clean_quoted_reference(await sanitize_js_ref_name((alloc_set && alloc_set["0"] && alloc_set["0"]["name"])));
                            ctx_details=await get_declaration_details(ctx,reference_name);
                            if (check_true (ctx_details)){
                                if (check_true ((await not((ctx_details && ctx_details["is_argument"]))&&((ctx_details && ctx_details["levels_up"])>1)))){
                                    need_sub_block=true;
                                    if (check_true (await (async function(){
                                        let __targ__181=redefinitions;
                                        if (__targ__181){
                                             return(__targ__181)[reference_name]
                                        } 
                                    })())){
                                         (await (async function(){
                                            let __targ__182=redefinitions;
                                            if (__targ__182){
                                                 return(__targ__182)[reference_name]
                                            } 
                                        })()).push(await gen_temp_name(reference_name))
                                    } else {
                                         await async function(){
                                            let __target_obj__183=redefinitions;
                                            __target_obj__183[reference_name]=[0,await gen_temp_name(reference_name)];
                                            return __target_obj__183;
                                            
                                        }()
                                    };
                                    if (check_true (((ctx_details && ctx_details["declared_global"])&&await not((ctx_details && ctx_details["is_argument"]))))){
                                         await async function(){
                                            let __target_obj__184=shadowed_globals;
                                            __target_obj__184[(alloc_set && alloc_set["0"] && alloc_set["0"]["name"])]=true;
                                            return __target_obj__184;
                                            
                                        }()
                                    }
                                }
                            };
                            if (check_true (await not((ctx_details && ctx_details["is_argument"])))){
                                 return  await set_ctx(ctx,reference_name,AsyncFunction)
                            }
                        };
                        let __BREAK__FLAG__=false;
                        while(await __test_condition__177()) {
                            await __body_ref__178();
                             if(__BREAK__FLAG__) {
                                 break;
                                
                            }
                        } ;
                        
                    })();
                    idx=-1;
                    await (async function(){
                         let __test_condition__185=async function() {
                             return  (idx<((allocations && allocations.length)-1))
                        };
                        let __body_ref__186=async function() {
                            idx+=1;
                            stmt=[];
                            alloc_set=await (async function(){
                                let __targ__188=await (async function(){
                                    let __targ__187=allocations;
                                    if (__targ__187){
                                         return(__targ__187)[idx]
                                    } 
                                })();
                                if (__targ__188){
                                     return(__targ__188)["val"]
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
                                        let __target_obj__189=ctx;
                                        __target_obj__189["in_assignment"]=true;
                                        return __target_obj__189;
                                        
                                    }();
                                    assignment_value=await compile((alloc_set && alloc_set["1"]),ctx);
                                     return  await async function(){
                                        let __target_obj__190=ctx;
                                        __target_obj__190["in_assignment"]=false;
                                        return __target_obj__190;
                                        
                                    }()
                                } else if (check_true( (((alloc_set && alloc_set["1"] && alloc_set["1"]["name"]) instanceof String || typeof (alloc_set && alloc_set["1"] && alloc_set["1"]["name"])==='string')&&await (async function(){
                                    let __targ__191=(Environment && Environment["context"] && Environment["context"]["scope"]);
                                    if (__targ__191){
                                         return(__targ__191)[(alloc_set && alloc_set["1"] && alloc_set["1"]["name"])]
                                    } 
                                })()&&await not((ctx_details && ctx_details["is_argument"]))&&await (async function(){
                                    let __targ__192=shadowed_globals;
                                    if (__targ__192){
                                         return(__targ__192)[(alloc_set && alloc_set["0"] && alloc_set["0"]["name"])]
                                    } 
                                })()))) {
                                     return  assignment_value=[{
                                        ctype:(ctx_details && ctx_details["value"])
                                    },"await"," ","Environment.get_global","(","\"",(alloc_set && alloc_set["0"] && alloc_set["0"]["name"]),"\"",")"]
                                } else  {
                                     return  assignment_value=await compile((alloc_set && alloc_set["1"]),ctx)
                                }
                            } ();
                            await async function(){
                                if (check_true( ((assignment_value instanceof Array)&&((assignment_value && assignment_value["0"]) instanceof Object)&&(assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])))) {
                                     return  await set_ctx(ctx,reference_name,await map_ctype_to_value((assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"]),assignment_value))
                                } else if (check_true( ((assignment_value instanceof Array)&&((assignment_value && assignment_value["0"]) instanceof Array)&&(assignment_value && assignment_value["0"] && assignment_value["0"]["0"] && assignment_value["0"]["0"]["ctype"])))) {
                                     return  await set_ctx(ctx,reference_name,await map_ctype_to_value((assignment_value && assignment_value["0"] && assignment_value["0"]["0"] && assignment_value["0"]["0"]["ctype"]),assignment_value))
                                } else  {
                                     return  await set_ctx(ctx,reference_name,assignment_value)
                                }
                            } ();
                            assignment_value=await wrap_assignment_value(assignment_value,ctx);
                            if (check_true ((ctx_details && ctx_details["is_argument"]))){
                                 await async function(){
                                    let __target_obj__193=block_declarations;
                                    __target_obj__193[reference_name]=true;
                                    return __target_obj__193;
                                    
                                }()
                            };
                            def_idx=null;
                            await async function(){
                                if (check_true( (await (async function(){
                                    let __targ__194=redefinitions;
                                    if (__targ__194){
                                         return(__targ__194)[reference_name]
                                    } 
                                })()&&await first(await (async function(){
                                    let __targ__195=redefinitions;
                                    if (__targ__195){
                                         return(__targ__195)[reference_name]
                                    } 
                                })())))) {
                                    def_idx=await first(await (async function(){
                                        let __targ__196=redefinitions;
                                        if (__targ__196){
                                             return(__targ__196)[reference_name]
                                        } 
                                    })());
                                    def_idx+=1;
                                    await async function(){
                                        let __target_obj__197=await (async function(){
                                            let __targ__198=redefinitions;
                                            if (__targ__198){
                                                 return(__targ__198)[reference_name]
                                            } 
                                        })();
                                        __target_obj__197[0]=def_idx;
                                        return __target_obj__197;
                                        
                                    }();
                                     return  await (async function() {
                                        let __for_body__201=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__202=[],__elements__200=["let"," ",await (async function(){
                                            let __targ__204=await (async function(){
                                                let __targ__203=redefinitions;
                                                if (__targ__203){
                                                     return(__targ__203)[reference_name]
                                                } 
                                            })();
                                            if (__targ__204){
                                                 return(__targ__204)[def_idx]
                                            } 
                                        })(),"="," ",(preamble && preamble["1"])," ","function","()","{","return"," ",assignment_value,"}",";"];
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__199 in __elements__200) {
                                            __array__202.push(await __for_body__201(__elements__200[__iter__199]));
                                            if(__BREAK__FLAG__) {
                                                 __array__202.pop();
                                                break;
                                                
                                            }
                                        }return __array__202;
                                         
                                    })()
                                } else if (check_true( await not(await (async function(){
                                    let __targ__205=block_declarations;
                                    if (__targ__205){
                                         return(__targ__205)[reference_name]
                                    } 
                                })()))) {
                                    await (async function() {
                                        let __for_body__208=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__209=[],__elements__207=["let"," ",reference_name,";"];
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__206 in __elements__207) {
                                            __array__209.push(await __for_body__208(__elements__207[__iter__206]));
                                            if(__BREAK__FLAG__) {
                                                 __array__209.pop();
                                                break;
                                                
                                            }
                                        }return __array__209;
                                         
                                    })();
                                     return  await async function(){
                                        let __target_obj__210=block_declarations;
                                        __target_obj__210[reference_name]=true;
                                        return __target_obj__210;
                                        
                                    }()
                                }
                            } ();
                            if (check_true (await not(await (async function(){
                                let __targ__211=assignments;
                                if (__targ__211){
                                     return(__targ__211)[reference_name]
                                } 
                            })()))){
                                 await async function(){
                                    let __target_obj__212=assignments;
                                    __target_obj__212[reference_name]=[];
                                    return __target_obj__212;
                                    
                                }()
                            };
                             return  (await (async function(){
                                let __targ__213=assignments;
                                if (__targ__213){
                                     return(__targ__213)[reference_name]
                                } 
                            })()).push(await (async function () {
                                 if (check_true (def_idx)){
                                      return await (async function(){
                                        let __array_op_rval__216=(preamble && preamble["0"]);
                                         if (__array_op_rval__216 instanceof Function){
                                            return await __array_op_rval__216(" ",await (async function(){
                                                let __targ__215=await (async function(){
                                                    let __targ__214=redefinitions;
                                                    if (__targ__214){
                                                         return(__targ__214)[reference_name]
                                                    } 
                                                })();
                                                if (__targ__215){
                                                     return(__targ__215)[def_idx]
                                                } 
                                            })(),"()",";") 
                                        } else {
                                            return[__array_op_rval__216," ",await (async function(){
                                                let __targ__215=await (async function(){
                                                    let __targ__214=redefinitions;
                                                    if (__targ__214){
                                                         return(__targ__214)[reference_name]
                                                    } 
                                                })();
                                                if (__targ__215){
                                                     return(__targ__215)[def_idx]
                                                } 
                                            })(),"()",";"]
                                        }
                                    })()
                                } else {
                                      return assignment_value
                                } 
                            })())
                        };
                        let __BREAK__FLAG__=false;
                        while(await __test_condition__185()) {
                            await __body_ref__186();
                             if(__BREAK__FLAG__) {
                                 break;
                                
                            }
                        } ;
                        
                    })();
                    if (check_true (need_sub_block)){
                         await (async function() {
                            let __for_body__219=async function(pset) {
                                 return  await (async function() {
                                    let __for_body__223=async function(redef) {
                                         return  (await (async function(){
                                            let __targ__225=redefinitions;
                                            if (__targ__225){
                                                 return(__targ__225)[(pset && pset["0"])]
                                            } 
                                        })()).shift()
                                    };
                                    let __array__224=[],__elements__222=(pset && pset["1"]);
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__221 in __elements__222) {
                                        __array__224.push(await __for_body__223(__elements__222[__iter__221]));
                                        if(__BREAK__FLAG__) {
                                             __array__224.pop();
                                            break;
                                            
                                        }
                                    }return __array__224;
                                     
                                })()
                            };
                            let __array__220=[],__elements__218=await (await Environment.get_global("pairs"))(redefinitions);
                            let __BREAK__FLAG__=false;
                            for(let __iter__217 in __elements__218) {
                                __array__220.push(await __for_body__219(__elements__218[__iter__217]));
                                if(__BREAK__FLAG__) {
                                     __array__220.pop();
                                    break;
                                    
                                }
                            }return __array__220;
                             
                        })()
                    };
                    if (check_true (need_sub_block)){
                        (acc).push("{");
                         sub_block_count+=1
                    };
                    idx=-1;
                    await (async function(){
                         let __test_condition__226=async function() {
                             return  (idx<((allocations && allocations.length)-1))
                        };
                        let __body_ref__227=async function() {
                            idx+=1;
                            def_idx=null;
                            stmt=[];
                            alloc_set=await (async function(){
                                let __targ__229=await (async function(){
                                    let __targ__228=allocations;
                                    if (__targ__228){
                                         return(__targ__228)[idx]
                                    } 
                                })();
                                if (__targ__229){
                                     return(__targ__229)["val"]
                                } 
                            })();
                            reference_name=await clean_quoted_reference(await sanitize_js_ref_name((alloc_set && alloc_set["0"] && alloc_set["0"]["name"])));
                            ctx_details=await get_declaration_details(ctx,reference_name);
                            assignment_value=(await (async function(){
                                let __targ__230=assignments;
                                if (__targ__230){
                                     return(__targ__230)[reference_name]
                                } 
                            })()).shift();
                            await async function(){
                                if (check_true( await (async function(){
                                    let __targ__231=block_declarations;
                                    if (__targ__231){
                                         return(__targ__231)[reference_name]
                                    } 
                                })())) {
                                     return true
                                } else  {
                                    (stmt).push("let");
                                     return  (stmt).push(" ")
                                }
                            } ();
                            (stmt).push(reference_name);
                            await async function(){
                                let __target_obj__232=block_declarations;
                                __target_obj__232[reference_name]=true;
                                return __target_obj__232;
                                
                            }();
                            (stmt).push("=");
                            (stmt).push(assignment_value);
                            (stmt).push(";");
                             return  (acc).push(stmt)
                        };
                        let __BREAK__FLAG__=false;
                        while(await __test_condition__226()) {
                            await __body_ref__227();
                             if(__BREAK__FLAG__) {
                                 break;
                                
                            }
                        } ;
                        
                    })();
                    (acc).push(await compile_block(await (await Environment.get_global("conj"))(["PLACEHOLDER"],block),ctx,{
                        no_scope_boundary:true,ignore_declarations:declarations_handled
                    }));
                    await (async function() {
                        let __for_body__235=async function(i) {
                             return  (acc).push("}")
                        };
                        let __array__236=[],__elements__234=await (await Environment.get_global("range"))(sub_block_count);
                        let __BREAK__FLAG__=false;
                        for(let __iter__233 in __elements__234) {
                            __array__236.push(await __for_body__235(__elements__234[__iter__233]));
                            if(__BREAK__FLAG__) {
                                 __array__236.pop();
                                break;
                                
                            }
                        }return __array__236;
                         
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
                        let __array_op_rval__237=in_sync_ques_;
                         if (__array_op_rval__237 instanceof Function){
                            return await __array_op_rval__237(ctx) 
                        } else {
                            return[__array_op_rval__237,ctx]
                        }
                    })())){
                          return ""
                    } else {
                          return "await"
                    }
                };
                calling_preamble=async function(ctx) {
                    if (check_true (await (async function(){
                        let __array_op_rval__238=in_sync_ques_;
                         if (__array_op_rval__238 instanceof Function){
                            return await __array_op_rval__238(ctx) 
                        } else {
                            return[__array_op_rval__238,ctx]
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
                    let type_mark;
                    let nbody;
                    acc=[];
                    idx=-1;
                    arg=null;
                    ctx=await new_ctx(ctx);
                    fn_args=(tokens && tokens["1"] && tokens["1"]["val"]);
                    body=(tokens && tokens["2"]);
                    type_mark=null;
                    nbody=null;
                    await async function(){
                        let __target_obj__239=ctx;
                        __target_obj__239["return_last_value"]=true;
                        return __target_obj__239;
                        
                    }();
                    await async function(){
                        let __target_obj__240=ctx;
                        __target_obj__240["return_point"]=0;
                        return __target_obj__240;
                        
                    }();
                    await set_ctx(ctx,"__IN_LAMBDA__",true);
                    await set_ctx(ctx,"__LAMBDA_STEP__",-1);
                    await async function(){
                        let __target_obj__241=ctx;
                        __target_obj__241["lambda_scope"]=true;
                        return __target_obj__241;
                        
                    }();
                    await async function(){
                        let __target_obj__242=ctx;
                        __target_obj__242["suppress_return"]=false;
                        return __target_obj__242;
                        
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
                        let __target_obj__243=type_mark;
                        __target_obj__243["args"]=[];
                        return __target_obj__243;
                        
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
                         let __test_condition__244=async function() {
                             return  (idx<((fn_args && fn_args.length)-1))
                        };
                        let __body_ref__245=async function() {
                            idx+=1;
                            arg=await (async function(){
                                let __targ__246=fn_args;
                                if (__targ__246){
                                     return(__targ__246)[idx]
                                } 
                            })();
                            if (check_true (((arg && arg.name)==="&"))){
                                idx+=1;
                                arg=await (async function(){
                                    let __targ__247=fn_args;
                                    if (__targ__247){
                                         return(__targ__247)[idx]
                                    } 
                                })();
                                if (check_true ((null==arg))){
                                    throw new SyntaxError("Missing argument symbol after &");
                                    
                                };
                                await set_ctx(ctx,(arg && arg.name),ArgumentType);
                                 await async function(){
                                    let __target_obj__248=arg;
                                    __target_obj__248["name"]=("..."+(arg && arg.name));
                                    return __target_obj__248;
                                    
                                }()
                            } else {
                                 await set_ctx(ctx,(arg && arg.name),ArgumentType)
                            };
                            (acc).push(await sanitize_js_ref_name((arg && arg.name)));
                            ((type_mark && type_mark["args"])).push(await sanitize_js_ref_name((arg && arg.name)));
                            if (check_true ((idx<((fn_args && fn_args.length)-1)))){
                                 return  (acc).push(",")
                            }
                        };
                        let __BREAK__FLAG__=false;
                        while(await __test_condition__244()) {
                            await __body_ref__245();
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
                            let __target_obj__249=ctx;
                            __target_obj__249["return_last_value"]=false;
                            return __target_obj__249;
                            
                        }()
                    } else {
                         await async function(){
                            let __target_obj__250=ctx;
                            __target_obj__250["return_last_value"]=true;
                            return __target_obj__250;
                            
                        }()
                    };
                    await async function(){
                        if (check_true( ((body && body["val"] && body["val"]["0"] && body["val"]["0"]["name"])==="let"))) {
                             return  (acc).push(await compile((body && body["val"]),ctx))
                        } else if (check_true( ((body && body["val"] && body["val"]["0"] && body["val"]["0"]["name"])==="do"))) {
                             return  (acc).push(await compile_block((body && body["val"]),ctx))
                        } else  {
                            nbody=[{
                                type:"special",val:`=:do`,ref:true,name:"do"
                            },body];
                            await async function(){
                                let __target_obj__251=ctx;
                                __target_obj__251["return_last_value"]=true;
                                return __target_obj__251;
                                
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
                    body=(tokens && tokens["2"] && tokens["2"]["val"]);
                    idx=-1;
                    quoted_body=[];
                    arg=null;
                    type_mark=await type_marker("Function");
                    (acc).push(type_mark);
                    await (async function() {
                        let __for_body__254=async function(t) {
                             return  (acc).push(t)
                        };
                        let __array__255=[],__elements__253=["new"," ","Function","("];
                        let __BREAK__FLAG__=false;
                        for(let __iter__252 in __elements__253) {
                            __array__255.push(await __for_body__254(__elements__253[__iter__252]));
                            if(__BREAK__FLAG__) {
                                 __array__255.pop();
                                break;
                                
                            }
                        }return __array__255;
                         
                    })();
                    await (async function(){
                         let __test_condition__256=async function() {
                             return  (idx<((fn_args && fn_args.length)-1))
                        };
                        let __body_ref__257=async function() {
                            idx+=1;
                            arg=await (async function(){
                                let __targ__258=fn_args;
                                if (__targ__258){
                                     return(__targ__258)[idx]
                                } 
                            })();
                            await set_ctx(ctx,(arg && arg.name),ArgumentType);
                            (acc).push(("\""+(arg && arg.name)+"\""));
                            ((type_mark && type_mark["args"])).push((arg && arg.name));
                             return  (acc).push(",")
                        };
                        let __BREAK__FLAG__=false;
                        while(await __test_condition__256()) {
                            await __body_ref__257();
                             if(__BREAK__FLAG__) {
                                 break;
                                
                            }
                        } ;
                        
                    })();
                    (acc).push("\"");
                    await (async function() {
                        let __for_body__261=async function(c) {
                            if (check_true (await not((c==="\n"),(c==="\r")))){
                                if (check_true ((c==="\""))){
                                     (quoted_body).push(await String.fromCharCode(92))
                                };
                                 return  (quoted_body).push(c)
                            }
                        };
                        let __array__262=[],__elements__260=(body).split("");
                        let __BREAK__FLAG__=false;
                        for(let __iter__259 in __elements__260) {
                            __array__262.push(await __for_body__261(__elements__260[__iter__259]));
                            if(__BREAK__FLAG__) {
                                 __array__262.pop();
                                break;
                                
                            }
                        }return __array__262;
                         
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
                     return  ("__"+(arg||"")+"__"+(var_counter=var_counter+1))
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
                     return  await (async function(){
                        let __array_op_rval__263=(preamble && preamble["2"]);
                         if (__array_op_rval__263 instanceof Function){
                            return await __array_op_rval__263((preamble && preamble["0"])," ",(preamble && preamble["1"])," ",(preamble && preamble["3"]),"function","()","{",await compile_cond_inner(tokens,ctx),"} ",(preamble && preamble["4"]),"()") 
                        } else {
                            return[__array_op_rval__263,(preamble && preamble["0"])," ",(preamble && preamble["1"])," ",(preamble && preamble["3"]),"function","()","{",await compile_cond_inner(tokens,ctx),"} ",(preamble && preamble["4"]),"()"]
                        }
                    })()
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
                        fst=(""+(((stmts instanceof Array)&&await first(stmts)&&(await first(stmts) instanceof Object)&&await (async function(){
                            let __targ__264=await first(stmts);
                            if (__targ__264){
                                 return(__targ__264)["ctype"]
                            } 
                        })()&&await async function(){
                            if (check_true( (await (async function(){
                                let __targ__265=await first(stmts);
                                if (__targ__265){
                                     return(__targ__265)["ctype"]
                                } 
                            })() instanceof String || typeof await (async function(){
                                let __targ__265=await first(stmts);
                                if (__targ__265){
                                     return(__targ__265)["ctype"]
                                } 
                            })()==='string'))) {
                                 return await (async function(){
                                    let __targ__266=await first(stmts);
                                    if (__targ__266){
                                         return(__targ__266)["ctype"]
                                    } 
                                })()
                            } else  {
                                 return await sub_type(await (async function(){
                                    let __targ__267=await first(stmts);
                                    if (__targ__267){
                                         return(__targ__267)["ctype"]
                                    } 
                                })())
                            }
                        } ())||""));
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
                    await (await Environment.get_global("compiler_syntax_validation"))("compile_cond",tokens,errors,ctx,tree);
                    await async function(){
                        if (check_true( await not((((condition_tokens && condition_tokens.length)%2)===0)))) {
                             throw new SyntaxError("cond: Invalid syntax: missing condition block");
                            
                        } else if (check_true( ((condition_tokens && condition_tokens.length)===0))) {
                             throw new SyntaxError("cond: Invalid syntax: no conditions provided");
                            
                        }
                    } ();
                    await set_ctx(ctx,"__LAMBDA_STEP__",-1);
                    await (async function(){
                         let __test_condition__268=async function() {
                             return  (idx<(condition_tokens && condition_tokens.length))
                        };
                        let __body_ref__269=async function() {
                            inject_return=false;
                            condition=await (async function(){
                                let __targ__270=condition_tokens;
                                if (__targ__270){
                                     return(__targ__270)[idx]
                                } 
                            })();
                            idx+=1;
                            condition_block=await (async function(){
                                let __targ__271=condition_tokens;
                                if (__targ__271){
                                     return(__targ__271)[idx]
                                } 
                            })();
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
                                    let __array_op_rval__272=is_form_ques_;
                                     if (__array_op_rval__272 instanceof Function){
                                        return await __array_op_rval__272(condition) 
                                    } else {
                                        return[__array_op_rval__272,condition]
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
                        while(await __test_condition__268()) {
                            await __body_ref__269();
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
                    let __if_id__273= async function(){
                        return if_id+=1
                    };
                    let if_log;
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
                        let if_id=await __if_id__273();
                        ;
                        if_log=await (async function () {
                             if (check_true ((opts && opts["quiet_mode"]))){
                                  return log
                            } else {
                                  return await defclog({
                                    prefix:("compile_if ("+if_id+")"),background:"#10A0A0",color:"white"
                                })
                            } 
                        })();
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
                            fst=(""+(((stmts instanceof Array)&&await first(stmts)&&(await first(stmts) instanceof Object)&&await (async function(){
                                let __targ__274=await first(stmts);
                                if (__targ__274){
                                     return(__targ__274)["ctype"]
                                } 
                            })()&&await async function(){
                                if (check_true( (await (async function(){
                                    let __targ__275=await first(stmts);
                                    if (__targ__275){
                                         return(__targ__275)["ctype"]
                                    } 
                                })() instanceof String || typeof await (async function(){
                                    let __targ__275=await first(stmts);
                                    if (__targ__275){
                                         return(__targ__275)["ctype"]
                                    } 
                                })()==='string'))) {
                                     return await (async function(){
                                        let __targ__276=await first(stmts);
                                        if (__targ__276){
                                             return(__targ__276)["ctype"]
                                        } 
                                    })()
                                } else  {
                                     return await sub_type(await (async function(){
                                        let __targ__277=await first(stmts);
                                        if (__targ__277){
                                             return(__targ__277)["ctype"]
                                        } 
                                    })())
                                }
                            } ())||""));
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
                                } else if (check_true( (((ctx && ctx["block_step"])===0)&&((ctx && ctx["return_point"])<3)))) {
                                    needs_braces_ques_=true;
                                     return  false
                                } else if (check_true( (((ctx && ctx["block_step"])===0)&&((ctx && ctx["return_point"])>2)))) {
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
                        if (check_true (((ctx && ctx["block_step"])===undefined))){
                             await async function(){
                                let __target_obj__278=ctx;
                                __target_obj__278["block_step"]=0;
                                return __target_obj__278;
                                
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
                                let __target_obj__279=ctx;
                                __target_obj__279["suppress_return"]=true;
                                return __target_obj__279;
                                
                            }()
                        };
                        if (check_true (((await first(compiled_test) instanceof Object)&&await (async function(){
                            let __targ__280=await first(compiled_test);
                            if (__targ__280){
                                 return(__targ__280)["ctype"]
                            } 
                        })()&&(await (async function(){
                            let __targ__281=await first(compiled_test);
                            if (__targ__281){
                                 return(__targ__281)["ctype"]
                            } 
                        })() instanceof String || typeof await (async function(){
                            let __targ__281=await first(compiled_test);
                            if (__targ__281){
                                 return(__targ__281)["ctype"]
                            } 
                        })()==='string')&&await contains_ques_("unction",await (async function(){
                            let __targ__282=await first(compiled_test);
                            if (__targ__282){
                                 return(__targ__282)["ctype"]
                            } 
                        })())))){
                             await (async function() {
                                let __for_body__285=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__286=[],__elements__284=["if"," ","(check_true (",(preamble && preamble["0"])," ",compiled_test,"()","))"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__283 in __elements__284) {
                                    __array__286.push(await __for_body__285(__elements__284[__iter__283]));
                                    if(__BREAK__FLAG__) {
                                         __array__286.pop();
                                        break;
                                        
                                    }
                                }return __array__286;
                                 
                            })()
                        } else {
                             await (async function() {
                                let __for_body__289=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__290=[],__elements__288=["if"," ","(check_true (",compiled_test,"))"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__287 in __elements__288) {
                                    __array__290.push(await __for_body__289(__elements__288[__iter__287]));
                                    if(__BREAK__FLAG__) {
                                         __array__290.pop();
                                        break;
                                        
                                    }
                                }return __array__290;
                                 
                            })()
                        };
                        compiled_true=await compile(if_true,ctx);
                        inject_return=await check_needs_return(compiled_true);
                        if (check_true (needs_braces_ques_)){
                            (acc).push("{");
                             (acc).push(" ")
                        };
                        (acc).push(await (async function () {
                             if (check_true ((false&&(await get_ctx_val(ctx,"__LAMBDA_STEP__")===0)&&((ctx && ctx["block_step"])===0)))){
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
                                 if (check_true ((false&&(await get_ctx_val(ctx,"__LAMBDA_STEP__")===0)))){
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
                            let __target_obj__291=ctx;
                            __target_obj__291["suppress_return"]=in_suppress_ques_;
                            return __target_obj__291;
                            
                        }();
                         return  acc
                    }
                };
                cwrap_log=await (async function () {
                     if (check_true (quiet_mode)){
                          return log
                    } else {
                          return await defclog({
                            color:"darkgreen;"
                        })
                    } 
                })();
                compile_wrapper_fn=async function(tokens,ctx,opts) {
                    let acc;
                    let preamble;
                    let needs_await;
                    acc=[];
                    ctx=ctx;
                    preamble=await calling_preamble(ctx);
                    needs_await=true;
                    await async function(){
                        if (check_true( ((tokens instanceof Object)&&await not((tokens instanceof Array))&&await not(((tokens && tokens["type"])==="arr"))))) {
                            needs_await=false;
                             return  acc=[await compile(tokens,ctx)]
                        } else if (check_true( await (async function(){
                            let __array_op_rval__292=is_block_ques_;
                             if (__array_op_rval__292 instanceof Function){
                                return await __array_op_rval__292(tokens) 
                            } else {
                                return[__array_op_rval__292,tokens]
                            }
                        })())) {
                            ctx=await new_ctx(ctx);
                            await async function(){
                                let __target_obj__293=ctx;
                                __target_obj__293["return_point"]=1;
                                return __target_obj__293;
                                
                            }();
                             return  acc=["(",(preamble && preamble["1"])," ","function","()","{",await compile(tokens,ctx),"}",")","()"]
                        } else if (check_true( ((tokens instanceof Object)&&((tokens && tokens["val"] && tokens["val"]["0"] && tokens["val"]["0"]["name"])==="if")))) {
                            ctx=await new_ctx(ctx);
                            await async function(){
                                let __target_obj__294=ctx;
                                __target_obj__294["return_point"]=1;
                                return __target_obj__294;
                                
                            }();
                             return  await (async function() {
                                let __for_body__297=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__298=[],__elements__296=["(",(preamble && preamble["1"])," ","function","()","{",await compile_if((tokens && tokens["val"]),ctx),"}",")","()"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__295 in __elements__296) {
                                    __array__298.push(await __for_body__297(__elements__296[__iter__295]));
                                    if(__BREAK__FLAG__) {
                                         __array__298.pop();
                                        break;
                                        
                                    }
                                }return __array__298;
                                 
                            })()
                        } else if (check_true( (tokens instanceof Array))) {
                             return  acc=await compile_block_to_anon_fn(tokens,ctx)
                        } else if (check_true( ((tokens instanceof Object)&&(tokens && tokens["val"])&&((tokens && tokens["type"])==="arr")))) {
                             return  acc=await compile_block_to_anon_fn((tokens && tokens["val"]),ctx)
                        }
                    } ();
                    if (check_true (needs_await)){
                          return await (async function(){
                            let __array_op_rval__299=(preamble && preamble["0"]);
                             if (__array_op_rval__299 instanceof Function){
                                return await __array_op_rval__299(" ",acc) 
                            } else {
                                return[__array_op_rval__299," ",acc]
                            }
                        })()
                    } else {
                          return await (async function(){
                            let __array_op_rval__300=acc;
                             if (__array_op_rval__300 instanceof Function){
                                return await __array_op_rval__300() 
                            } else {
                                return[__array_op_rval__300]
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
                        let __target_obj__301=ctx;
                        __target_obj__301["return_point"]=0;
                        return __target_obj__301;
                        
                    }();
                    await async function(){
                        if (check_true( await (async function(){
                            let __array_op_rval__302=is_block_ques_;
                             if (__array_op_rval__302 instanceof Function){
                                return await __array_op_rval__302(tokens) 
                            } else {
                                return[__array_op_rval__302,tokens]
                            }
                        })())) {
                            await async function(){
                                let __target_obj__303=ctx;
                                __target_obj__303["return_last_value"]=true;
                                return __target_obj__303;
                                
                            }();
                            await async function(){
                                let __target_obj__304=ctx;
                                __target_obj__304["return_point"]=0;
                                return __target_obj__304;
                                
                            }();
                             return  await (async function() {
                                let __for_body__307=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__308=[],__elements__306=["(",(preamble && preamble["1"])," ","function","()",await compile_block(tokens,ctx),")","()"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__305 in __elements__306) {
                                    __array__308.push(await __for_body__307(__elements__306[__iter__305]));
                                    if(__BREAK__FLAG__) {
                                         __array__308.pop();
                                        break;
                                        
                                    }
                                }return __array__308;
                                 
                            })()
                        } else if (check_true( ((tokens && tokens["0"] && tokens["0"]["name"])==="let"))) {
                            await async function(){
                                let __target_obj__309=ctx;
                                __target_obj__309["return_last_value"]=true;
                                return __target_obj__309;
                                
                            }();
                            await async function(){
                                let __target_obj__310=ctx;
                                __target_obj__310["return_point"]=0;
                                return __target_obj__310;
                                
                            }();
                             return  await (async function() {
                                let __for_body__313=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__314=[],__elements__312=["(",(preamble && preamble["1"])," ","function","()",await compile(tokens,ctx),")","()"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__311 in __elements__312) {
                                    __array__314.push(await __for_body__313(__elements__312[__iter__311]));
                                    if(__BREAK__FLAG__) {
                                         __array__314.pop();
                                        break;
                                        
                                    }
                                }return __array__314;
                                 
                            })()
                        } else  {
                            await async function(){
                                let __target_obj__315=ctx;
                                __target_obj__315["return_last_value"]=true;
                                return __target_obj__315;
                                
                            }();
                            await async function(){
                                let __target_obj__316=ctx;
                                __target_obj__316["return_point"]=0;
                                return __target_obj__316;
                                
                            }();
                             return  await (async function() {
                                let __for_body__319=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__320=[],__elements__318=["(",(preamble && preamble["1"])," ","function","()","{"," ","return"," ",await compile(tokens,ctx)," ","}",")","()"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__317 in __elements__318) {
                                    __array__320.push(await __for_body__319(__elements__318[__iter__317]));
                                    if(__BREAK__FLAG__) {
                                         __array__320.pop();
                                        break;
                                        
                                    }
                                }return __array__320;
                                 
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
                        type:"special",val:`=:do`,ref:true,name:"do"
                    });
                    await async function(){
                        if (check_true( (tokens instanceof Array))) {
                             return await (async function() {
                                let __for_body__323=async function(token) {
                                     return  (place).push(token)
                                };
                                let __array__324=[],__elements__322=tokens;
                                let __BREAK__FLAG__=false;
                                for(let __iter__321 in __elements__322) {
                                    __array__324.push(await __for_body__323(__elements__322[__iter__321]));
                                    if(__BREAK__FLAG__) {
                                         __array__324.pop();
                                        break;
                                        
                                    }
                                }return __array__324;
                                 
                            })()
                        } else  {
                             return await (async function() {
                                let __for_body__327=async function(token) {
                                     return  (place).push(token)
                                };
                                let __array__328=[],__elements__326=await (async function(){
                                    let __array_op_rval__329=tokens;
                                     if (__array_op_rval__329 instanceof Function){
                                        return await __array_op_rval__329() 
                                    } else {
                                        return[__array_op_rval__329]
                                    }
                                })();
                                let __BREAK__FLAG__=false;
                                for(let __iter__325 in __elements__326) {
                                    __array__328.push(await __for_body__327(__elements__326[__iter__325]));
                                    if(__BREAK__FLAG__) {
                                         __array__328.pop();
                                        break;
                                        
                                    }
                                }return __array__328;
                                 
                            })()
                        }
                    } ();
                     return  preamble
                };
                push_as_arg_list=async function(place,args) {
                    await map(async function(v,i,t) {
                        (place).push(v);
                        if (check_true ((i<=(t-2)))){
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
                        let __for_body__332=async function(opt_token) {
                             return  (args).push(await wrap_assignment_value(await compile(opt_token,ctx),ctx))
                        };
                        let __array__333=[],__elements__331=(new_opts||[]);
                        let __BREAK__FLAG__=false;
                        for(let __iter__330 in __elements__331) {
                            __array__333.push(await __for_body__332(__elements__331[__iter__330]));
                            if(__BREAK__FLAG__) {
                                 __array__333.pop();
                                break;
                                
                            }
                        }return __array__333;
                         
                    })();
                    await async function(){
                        if (check_true( (await not((null==(type_details && type_details["value"])))&&(type_details && type_details["declared_global"])))) {
                            await (async function() {
                                let __for_body__336=async function(arg) {
                                     return  (acc).push(arg)
                                };
                                let __array__337=[],__elements__335=["new"," ",await compile((tokens && tokens["1"]),ctx),"("];
                                let __BREAK__FLAG__=false;
                                for(let __iter__334 in __elements__335) {
                                    __array__337.push(await __for_body__336(__elements__335[__iter__334]));
                                    if(__BREAK__FLAG__) {
                                         __array__337.pop();
                                        break;
                                        
                                    }
                                }return __array__337;
                                 
                            })();
                            await push_as_arg_list(acc,args);
                             return  (acc).push(")")
                        } else if (check_true( (await not((null==(type_details && type_details["value"])))&&(type_details && type_details["value"]) instanceof Function))) {
                            await (async function() {
                                let __for_body__340=async function(arg) {
                                     return  (acc).push(arg)
                                };
                                let __array__341=[],__elements__339=["new"," ",target_type,"("];
                                let __BREAK__FLAG__=false;
                                for(let __iter__338 in __elements__339) {
                                    __array__341.push(await __for_body__340(__elements__339[__iter__338]));
                                    if(__BREAK__FLAG__) {
                                         __array__341.pop();
                                        break;
                                        
                                    }
                                }return __array__341;
                                 
                            })();
                            await push_as_arg_list(acc,args);
                             return  (acc).push(")")
                        } else if (check_true( ((null==(type_details && type_details["value"]))&&await not((null==(root_type_details && root_type_details["value"])))))) {
                            await (async function() {
                                let __for_body__344=async function(arg) {
                                     return  (acc).push(arg)
                                };
                                let __array__345=[],__elements__343=["(",(preamble && preamble["0"])," ","Environment.get_global","(","\"","indirect_new","\"",")",")","(",target_type];
                                let __BREAK__FLAG__=false;
                                for(let __iter__342 in __elements__343) {
                                    __array__345.push(await __for_body__344(__elements__343[__iter__342]));
                                    if(__BREAK__FLAG__) {
                                         __array__345.pop();
                                        break;
                                        
                                    }
                                }return __array__345;
                                 
                            })();
                            if (check_true (((args && args.length)>0))){
                                (acc).push(",");
                                 await push_as_arg_list(acc,args)
                            };
                             return  (acc).push(")")
                        }
                    } ();
                    target_return_type=(await get_ctx_val(ctx,target_type)||await (async function(){
                        let __targ__346=(await get_declarations(ctx,target_type)||new Object());
                        if (__targ__346){
                             return(__targ__346)["type"]
                        } 
                    })()||await (await Environment.get_global("get_outside_global"))(target_type)||UnknownType);
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
                                     throw new Error(("Invalid value modification operator: "+(tokens && tokens["0"] && tokens["0"]["name"])));
                                    
                                }
                            } ()
                        } else {
                              return await async function(){
                                if (check_true( ((target_location==="local")&&((tokens && tokens["0"] && tokens["0"]["name"])==="inc")))) {
                                     return "+="
                                } else if (check_true( ((target_location==="local")&&((tokens && tokens["0"] && tokens["0"]["name"])==="dec")))) {
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
                    how_much=(((tokens && tokens["2"])&&await compile((tokens && tokens["2"]),ctx))||1);
                     return  await async function(){
                        if (check_true( (target_location==="global"))) {
                            has_lisp_globals=true;
                            mod_source=("("+operation+" "+target+" "+how_much+")");
                             return  ["await"," ","Environment.set_global(\"",target,"\",",await compile(await tokenize(await (await Environment.get_global("read_lisp"))(mod_source),ctx),ctx),")"]
                        } else if (check_true(in_infix)) {
                             return  ["(",target,"=",target,operation,how_much,")"]
                        } else  {
                             return await (async function(){
                                let __array_op_rval__347=target;
                                 if (__array_op_rval__347 instanceof Function){
                                    return await __array_op_rval__347(operation,how_much) 
                                } else {
                                    return[__array_op_rval__347,operation,how_much]
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
                     return  await (async function(){
                        let __array_op_rval__348=(preamble && preamble["2"]);
                         if (__array_op_rval__348 instanceof Function){
                            return await __array_op_rval__348((preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()","{",await compile_try_inner(tokens,ctx),"}",")","()") 
                        } else {
                            return[__array_op_rval__348,(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()","{",await compile_try_inner(tokens,ctx),"}",")","()"]
                        }
                    })()
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
                        fst=(""+(((stmts instanceof Array)&&await first(stmts)&&(await first(stmts) instanceof Object)&&await (async function(){
                            let __targ__349=await first(stmts);
                            if (__targ__349){
                                 return(__targ__349)["ctype"]
                            } 
                        })()&&await async function(){
                            if (check_true( (await (async function(){
                                let __targ__350=await first(stmts);
                                if (__targ__350){
                                     return(__targ__350)["ctype"]
                                } 
                            })() instanceof String || typeof await (async function(){
                                let __targ__350=await first(stmts);
                                if (__targ__350){
                                     return(__targ__350)["ctype"]
                                } 
                            })()==='string'))) {
                                 return await (async function(){
                                    let __targ__351=await first(stmts);
                                    if (__targ__351){
                                         return(__targ__351)["ctype"]
                                    } 
                                })()
                            } else  {
                                 return await sub_type(await (async function(){
                                    let __targ__352=await first(stmts);
                                    if (__targ__352){
                                         return(__targ__352)["ctype"]
                                    } 
                                })())
                            }
                        } ())||""));
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
                                let __for_body__355=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__356=[],__elements__354=[" ","catch","(",the_exception_ref,")"," ","{"," "];
                                let __BREAK__FLAG__=false;
                                for(let __iter__353 in __elements__354) {
                                    __array__356.push(await __for_body__355(__elements__354[__iter__353]));
                                    if(__BREAK__FLAG__) {
                                         __array__356.pop();
                                        break;
                                        
                                    }
                                }return __array__356;
                                 
                            })()
                        };
                        if (check_true (((err_data && err_data["error_type"])==="Error"))){
                             base_error_caught=true
                        };
                        if (check_true ((((err_data && err_data["error_type"])==="Error")||((err_data && err_data["idx"])===((err_data && err_data["total_catches"])-1))))){
                             complete=true
                        };
                        if (check_true (((err_data && err_data["idx"])>0))){
                             await (async function() {
                                let __for_body__359=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__360=[],__elements__358=[" ","else"," "];
                                let __BREAK__FLAG__=false;
                                for(let __iter__357 in __elements__358) {
                                    __array__360.push(await __for_body__359(__elements__358[__iter__357]));
                                    if(__BREAK__FLAG__) {
                                         __array__360.pop();
                                        break;
                                        
                                    }
                                }return __array__360;
                                 
                            })()
                        };
                        await (async function() {
                            let __for_body__363=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__364=[],__elements__362=[" ","if"," ","(",the_exception_ref," ","instanceof"," ",(err_data && err_data["error_type"]),")"," ","{"," ","let"," ",(err_data && err_data["error_ref"]),"=",the_exception_ref,";"," "];
                            let __BREAK__FLAG__=false;
                            for(let __iter__361 in __elements__362) {
                                __array__364.push(await __for_body__363(__elements__362[__iter__361]));
                                if(__BREAK__FLAG__) {
                                     __array__364.pop();
                                    break;
                                    
                                }
                            }return __array__364;
                             
                        })();
                        if (check_true ((err_data && err_data["insert_return"]))){
                            (acc).push(" ");
                            (acc).push("return");
                             (acc).push(" ")
                        };
                        (acc).push(stmts);
                        (acc).push("}");
                        if (check_true ((((err_data && err_data["idx"])===((err_data && err_data["total_catches"])-1))&&await not(base_error_caught)))){
                             await (async function() {
                                let __for_body__367=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__368=[],__elements__366=[" ","else"," ","throw"," ",the_exception_ref,";"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__365 in __elements__366) {
                                    __array__368.push(await __for_body__367(__elements__366[__iter__365]));
                                    if(__BREAK__FLAG__) {
                                         __array__368.pop();
                                        break;
                                        
                                    }
                                }return __array__368;
                                 
                            })()
                        };
                        if (check_true (complete)){
                             await (async function() {
                                let __for_body__371=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__372=[],__elements__370=[" ","}"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__369 in __elements__370) {
                                    __array__372.push(await __for_body__371(__elements__370[__iter__369]));
                                    if(__BREAK__FLAG__) {
                                         __array__372.pop();
                                        break;
                                        
                                    }
                                }return __array__372;
                                 
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
                        let __target_obj__373=ctx;
                        __target_obj__373["return_last_value"]=true;
                        return __target_obj__373;
                        
                    }();
                    await async function(){
                        let __target_obj__374=ctx;
                        __target_obj__374["in_try"]=true;
                        return __target_obj__374;
                        
                    }();
                    stmts=await compile(try_block,ctx);
                    if (check_true (((stmts && stmts["0"] && stmts["0"]["ctype"])&&(((stmts && stmts["0"] && stmts["0"]["ctype"])===AsyncFunction)||((stmts && stmts["0"] && stmts["0"]["ctype"])===Function))))){
                         (stmts).unshift("await")
                    };
                    if (check_true (await (async function(){
                        let __array_op_rval__375=is_complex_ques_;
                         if (__array_op_rval__375 instanceof Function){
                            return await __array_op_rval__375(try_block) 
                        } else {
                            return[__array_op_rval__375,try_block]
                        }
                    })())){
                         await (async function() {
                            let __for_body__378=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__379=[],__elements__377=["try"," ","/* TRY COMPLEX */ ",stmts," "];
                            let __BREAK__FLAG__=false;
                            for(let __iter__376 in __elements__377) {
                                __array__379.push(await __for_body__378(__elements__377[__iter__376]));
                                if(__BREAK__FLAG__) {
                                     __array__379.pop();
                                    break;
                                    
                                }
                            }return __array__379;
                             
                        })()
                    } else {
                         await (async function() {
                            let __for_body__382=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__383=[],__elements__381=await (async function ()  {
                                let __array_arg__384=(async function() {
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
                                return ["try"," ","/* TRY SIMPLE */ ","{"," ",await __array_arg__384(),stmts," ","}"]
                            } )();
                            let __BREAK__FLAG__=false;
                            for(let __iter__380 in __elements__381) {
                                __array__383.push(await __for_body__382(__elements__381[__iter__380]));
                                if(__BREAK__FLAG__) {
                                     __array__383.pop();
                                    break;
                                    
                                }
                            }return __array__383;
                             
                        })()
                    };
                    await (async function(){
                         let __test_condition__385=async function() {
                             return  (idx<(catches && catches.length))
                        };
                        let __body_ref__386=async function() {
                            catch_block=await (async function(){
                                let __targ__388=await (async function(){
                                    let __targ__387=catches;
                                    if (__targ__387){
                                         return(__targ__387)[idx]
                                    } 
                                })();
                                if (__targ__388){
                                     return(__targ__388)["val"]
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
                        while(await __test_condition__385()) {
                            await __body_ref__386();
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
                        if (check_true( ((tokens instanceof Array)&&((tokens && tokens.length)===2)&&(tokens && tokens["1"] && tokens["1"]["ref"])))) {
                            mode=0;
                             return  error_instance=await compile((tokens && tokens["1"]),ctx)
                        } else if (check_true( ((tokens instanceof Array)&&((tokens && tokens.length)===3)))) {
                            error_instance=await compile((tokens && tokens["1"]),ctx);
                             return  error_message=await compile((tokens && tokens["2"]),ctx)
                        } else if (check_true( ((tokens instanceof Array)&&((tokens && tokens.length)===2)))) {
                            error_message=await compile((tokens && tokens["1"]),ctx);
                             return  error_instance="Error"
                        } else  {
                             throw new SyntaxError("Invalid Throw Syntax");
                            
                        }
                    } ();
                    if (check_true ((mode===0))){
                         await (async function() {
                            let __for_body__391=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__392=[],__elements__390=["throw"," ",error_instance,";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__389 in __elements__390) {
                                __array__392.push(await __for_body__391(__elements__390[__iter__389]));
                                if(__BREAK__FLAG__) {
                                     __array__392.pop();
                                    break;
                                    
                                }
                            }return __array__392;
                             
                        })()
                    } else {
                         await (async function() {
                            let __for_body__395=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__396=[],__elements__394=["throw"," ","new"," ",error_instance,"(",error_message,")",";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__393 in __elements__394) {
                                __array__396.push(await __for_body__395(__elements__394[__iter__393]));
                                if(__BREAK__FLAG__) {
                                     __array__396.pop();
                                    break;
                                    
                                }
                            }return __array__396;
                             
                        })()
                    };
                     return  acc
                };
                compile_break=async function(tokens,ctx) {
                     return  await (async function(){
                        let __array_op_rval__397=break_out;
                         if (__array_op_rval__397 instanceof Function){
                            return await __array_op_rval__397("=","true",";","return") 
                        } else {
                            return[__array_op_rval__397,"=","true",";","return"]
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
                        let __array_op_rval__398=is_block_ques_;
                         if (__array_op_rval__398 instanceof Function){
                            return await __array_op_rval__398((tokens && tokens["1"] && tokens["1"]["val"])) 
                        } else {
                            return[__array_op_rval__398,(tokens && tokens["1"] && tokens["1"]["val"])]
                        }
                    })())){
                         await (async function() {
                            let __for_body__401=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__402=[],__elements__400=["let"," ",return_val_reference,"=",await compile((tokens && tokens["1"] && tokens["1"]["val"]),ctx),";","return"," ",return_val_reference,";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__399 in __elements__400) {
                                __array__402.push(await __for_body__401(__elements__400[__iter__399]));
                                if(__BREAK__FLAG__) {
                                     __array__402.pop();
                                    break;
                                    
                                }
                            }return __array__402;
                             
                        })()
                    } else {
                         await (async function() {
                            let __for_body__405=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__406=[],__elements__404=["return"," ",await compile((tokens && tokens["1"]),ctx),";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__403 in __elements__404) {
                                __array__406.push(await __for_body__405(__elements__404[__iter__403]));
                                if(__BREAK__FLAG__) {
                                     __array__406.pop();
                                    break;
                                    
                                }
                            }return __array__406;
                             
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
                    if (check_true ((args&&((args && args.length)===1)))){
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
                            let __for_body__409=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__410=[],__elements__408=["let"," ",target_argument_ref,"=","[]",".concat","(",await compile(target_arg,ctx),")",";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__407 in __elements__408) {
                                __array__410.push(await __for_body__409(__elements__408[__iter__407]));
                                if(__BREAK__FLAG__) {
                                     __array__410.pop();
                                    break;
                                    
                                }
                            }return __array__410;
                             
                        })();
                        await (async function() {
                            let __for_body__413=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__414=[],__elements__412=["if","(","!",target_argument_ref," ","instanceof"," ","Array",")","{","throw"," ","new"," ","TypeError","(","\"Invalid final argument to apply - an array is required\"",")","}"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__411 in __elements__412) {
                                __array__414.push(await __for_body__413(__elements__412[__iter__411]));
                                if(__BREAK__FLAG__) {
                                     __array__414.pop();
                                    break;
                                    
                                }
                            }return __array__414;
                             
                        })();
                        await (async function() {
                            let __for_body__417=async function(token) {
                                preceding_arg_ref=await gen_temp_name("pre_arg");
                                if (check_true (await (async function(){
                                    let __array_op_rval__419=is_form_ques_;
                                     if (__array_op_rval__419 instanceof Function){
                                        return await __array_op_rval__419(token) 
                                    } else {
                                        return[__array_op_rval__419,token]
                                    }
                                })())){
                                     await (async function() {
                                        let __for_body__422=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__423=[],__elements__421=["let"," ",preceding_arg_ref,"=",await wrap_assignment_value(await compile((token && token["val"]),ctx),ctx),";"];
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__420 in __elements__421) {
                                            __array__423.push(await __for_body__422(__elements__421[__iter__420]));
                                            if(__BREAK__FLAG__) {
                                                 __array__423.pop();
                                                break;
                                                
                                            }
                                        }return __array__423;
                                         
                                    })()
                                } else {
                                     preceding_arg_ref=await wrap_assignment_value(await compile(token,ctx))
                                };
                                 return  (acc).push(await (async function(){
                                    let __array_op_rval__424=target_argument_ref;
                                     if (__array_op_rval__424 instanceof Function){
                                        return await __array_op_rval__424(".unshift","(",preceding_arg_ref,")",";") 
                                    } else {
                                        return[__array_op_rval__424,".unshift","(",preceding_arg_ref,")",";"]
                                    }
                                })())
                            };
                            let __array__418=[],__elements__416=args;
                            let __BREAK__FLAG__=false;
                            for(let __iter__415 in __elements__416) {
                                __array__418.push(await __for_body__417(__elements__416[__iter__415]));
                                if(__BREAK__FLAG__) {
                                     __array__418.pop();
                                    break;
                                    
                                }
                            }return __array__418;
                             
                        })();
                         await (async function() {
                            let __for_body__427=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__428=[],__elements__426=["return"," ","(",function_ref,")",".","apply","(","this",",",target_argument_ref,")"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__425 in __elements__426) {
                                __array__428.push(await __for_body__427(__elements__426[__iter__425]));
                                if(__BREAK__FLAG__) {
                                     __array__428.pop();
                                    break;
                                    
                                }
                            }return __array__428;
                             
                        })()
                    } else {
                        if (check_true (await (async function(){
                            let __array_op_rval__429=is_form_ques_;
                             if (__array_op_rval__429 instanceof Function){
                                return await __array_op_rval__429(args) 
                            } else {
                                return[__array_op_rval__429,args]
                            }
                        })())){
                            await (async function() {
                                let __for_body__432=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__433=[],__elements__431=["let"," ",args_ref,"=",await wrap_assignment_value(await compile((args && args["val"]),ctx),ctx),";"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__430 in __elements__431) {
                                    __array__433.push(await __for_body__432(__elements__431[__iter__430]));
                                    if(__BREAK__FLAG__) {
                                         __array__433.pop();
                                        break;
                                        
                                    }
                                }return __array__433;
                                 
                            })();
                             complex_ques_=true
                        };
                        await (async function() {
                            let __for_body__436=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__437=[],__elements__435=["return"," ","("," ",function_ref,")",".","apply","(","this"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__434 in __elements__435) {
                                __array__437.push(await __for_body__436(__elements__435[__iter__434]));
                                if(__BREAK__FLAG__) {
                                     __array__437.pop();
                                    break;
                                    
                                }
                            }return __array__437;
                             
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
                     return  await (async function(){
                        let __array_op_rval__438=(preamble && preamble["0"]);
                         if (__array_op_rval__438 instanceof Function){
                            return await __array_op_rval__438(" ","(",(preamble && preamble["1"])," ","function","()","{",acc,"}",")","()") 
                        } else {
                            return[__array_op_rval__438," ","(",(preamble && preamble["1"])," ","function","()","{",acc,"}",")","()"]
                        }
                    })()
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
                     return  await async function(){
                        if (check_true( (simple_target_ques_&&simple_method_ques_))) {
                             return await compile_call_inner(tokens,ctx,{
                                type:0,preamble:preamble
                            })
                        } else if (check_true(simple_target_ques_)) {
                             return await compile_call_inner(tokens,ctx,{
                                type:0,preamble:preamble
                            })
                        } else  {
                             return await (async function(){
                                let __array_op_rval__439=(preamble && preamble["2"]);
                                 if (__array_op_rval__439 instanceof Function){
                                    return await __array_op_rval__439((preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ","{",await compile_call_inner(tokens,ctx,{
                                        type:2,preamble:preamble
                                    })," ","}",")","()") 
                                } else {
                                    return[__array_op_rval__439,(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ","{",await compile_call_inner(tokens,ctx,{
                                        type:2,preamble:preamble
                                    })," ","}",")","()"]
                                }
                            })()
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
                            let __for_body__442=async function(token) {
                                (acc).push(",");
                                 return  (acc).push(await wrap_assignment_value(await compile(token,ctx),ctx))
                            };
                            let __array__443=[],__elements__441=await tokens["slice"].call(tokens,3);
                            let __BREAK__FLAG__=false;
                            for(let __iter__440 in __elements__441) {
                                __array__443.push(await __for_body__442(__elements__441[__iter__440]));
                                if(__BREAK__FLAG__) {
                                     __array__443.pop();
                                    break;
                                    
                                }
                            }return __array__443;
                             
                        })()
                    };
                    method=null;
                    if (check_true (((tokens && tokens.length)<3))){
                        throw new SyntaxError(("call: missing arguments, requires at least 2"));
                        
                    };
                    target=await wrap_assignment_value(await compile((tokens && tokens["1"]),ctx),ctx);
                    method=await wrap_assignment_value(await compile((tokens && tokens["2"]),ctx),ctx);
                    await async function(){
                        if (check_true( (((opts && opts["type"])===0)||((opts && opts["type"])===1)))) {
                             return  await async function(){
                                if (check_true( ((tokens && tokens.length)===3))) {
                                     return await (async function() {
                                        let __for_body__446=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__447=[],__elements__445=await (async function(){
                                            let __array_op_rval__448=(preamble && preamble["0"]);
                                             if (__array_op_rval__448 instanceof Function){
                                                return await __array_op_rval__448(" ",target,"[",method,"]","()") 
                                            } else {
                                                return[__array_op_rval__448," ",target,"[",method,"]","()"]
                                            }
                                        })();
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__444 in __elements__445) {
                                            __array__447.push(await __for_body__446(__elements__445[__iter__444]));
                                            if(__BREAK__FLAG__) {
                                                 __array__447.pop();
                                                break;
                                                
                                            }
                                        }return __array__447;
                                         
                                    })()
                                } else  {
                                    await (async function() {
                                        let __for_body__451=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__452=[],__elements__450=await (async function(){
                                            let __array_op_rval__453=(preamble && preamble["0"]);
                                             if (__array_op_rval__453 instanceof Function){
                                                return await __array_op_rval__453(" ",target,"[",method,"]",".call","(",target) 
                                            } else {
                                                return[__array_op_rval__453," ",target,"[",method,"]",".call","(",target]
                                            }
                                        })();
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__449 in __elements__450) {
                                            __array__452.push(await __for_body__451(__elements__450[__iter__449]));
                                            if(__BREAK__FLAG__) {
                                                 __array__452.pop();
                                                break;
                                                
                                            }
                                        }return __array__452;
                                         
                                    })();
                                    await add_args();
                                     return  (acc).push(")")
                                }
                            } ()
                        } else if (check_true( ((opts && opts["type"])===2))) {
                            await (async function() {
                                let __for_body__456=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__457=[],__elements__455=["{"," ","let"," ","__call_target__","=",target,","," ","__call_method__","=",method,";"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__454 in __elements__455) {
                                    __array__457.push(await __for_body__456(__elements__455[__iter__454]));
                                    if(__BREAK__FLAG__) {
                                         __array__457.pop();
                                        break;
                                        
                                    }
                                }return __array__457;
                                 
                            })();
                            await async function(){
                                if (check_true( ((tokens && tokens.length)===3))) {
                                     return await (async function() {
                                        let __for_body__460=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__461=[],__elements__459=["return"," ",(preamble && preamble["0"])," ","__call_target__","[","__call_method__","]","()"];
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__458 in __elements__459) {
                                            __array__461.push(await __for_body__460(__elements__459[__iter__458]));
                                            if(__BREAK__FLAG__) {
                                                 __array__461.pop();
                                                break;
                                                
                                            }
                                        }return __array__461;
                                         
                                    })()
                                } else  {
                                    await (async function() {
                                        let __for_body__464=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__465=[],__elements__463=["return"," ",(preamble && preamble["0"])," ","__call_target__","[","__call_method__","]",".","call","(","__call_target__"];
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__462 in __elements__463) {
                                            __array__465.push(await __for_body__464(__elements__463[__iter__462]));
                                            if(__BREAK__FLAG__) {
                                                 __array__465.pop();
                                                break;
                                                
                                            }
                                        }return __array__465;
                                         
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
                    fst=(((stmts instanceof Array)&&await first(stmts)&&(await first(stmts) instanceof Object)&&await not(await (async function(){
                        let __targ__466=await first(stmts);
                        if (__targ__466){
                             return(__targ__466)["ctype"]
                        } 
                    })() instanceof Function)&&await (async function(){
                        let __targ__467=await first(stmts);
                        if (__targ__467){
                             return(__targ__467)["ctype"]
                        } 
                    })()&&await async function(){
                        if (check_true( (await (async function(){
                            let __targ__468=await first(stmts);
                            if (__targ__468){
                                 return(__targ__468)["ctype"]
                            } 
                        })() instanceof String || typeof await (async function(){
                            let __targ__468=await first(stmts);
                            if (__targ__468){
                                 return(__targ__468)["ctype"]
                            } 
                        })()==='string'))) {
                             return await (async function(){
                                let __targ__469=await first(stmts);
                                if (__targ__469){
                                     return(__targ__469)["ctype"]
                                } 
                            })()
                        } else  {
                             return await sub_type(await (async function(){
                                let __targ__470=await first(stmts);
                                if (__targ__470){
                                     return(__targ__470)["ctype"]
                                } 
                            })())
                        }
                    } ())||"");
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
                    let __symbols__471= async function(){
                        return []
                    };
                    let from_tokens;
                    let from_place;
                    let acc;
                    {
                        symbol_tokens=(tokens && tokens["1"]);
                        let symbols=await __symbols__471();
                        ;
                        from_tokens=null;
                        from_place=null;
                        acc=[];
                        symbol_tokens=(tokens && tokens["1"]);
                        from_tokens=(tokens && tokens["2"]);
                        await console.log("compile_import: ->",await clone(tokens));
                        (acc).push({
                            ctype:"statement"
                        });
                        (acc).push("import");
                        (acc).push(" ");
                        from_place=await compile(from_tokens,ctx);
                        await console.log("compile_import: compiled symbols:    ",symbols);
                        await console.log("compile_import: compiled from place: ",from_place);
                        await async function(){
                            if (check_true( ((symbol_tokens && symbol_tokens["val"]) instanceof Array))) {
                                await (async function() {
                                    let __for_body__474=async function(s) {
                                         return  (symbols).push(await compile(s,ctx))
                                    };
                                    let __array__475=[],__elements__473=(symbol_tokens && symbol_tokens["val"]);
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__472 in __elements__473) {
                                        __array__475.push(await __for_body__474(__elements__473[__iter__472]));
                                        if(__BREAK__FLAG__) {
                                             __array__475.pop();
                                            break;
                                            
                                        }
                                    }return __array__475;
                                     
                                })();
                                 return  await (async function() {
                                    let __for_body__478=async function(t) {
                                         return  (acc).push(t)
                                    };
                                    let __array__479=[],__elements__477=await flatten(["{"," ",symbols," ","}"," ","from"," ",from_place]);
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__476 in __elements__477) {
                                        __array__479.push(await __for_body__478(__elements__477[__iter__476]));
                                        if(__BREAK__FLAG__) {
                                             __array__479.pop();
                                            break;
                                            
                                        }
                                    }return __array__479;
                                     
                                })()
                            }
                        } ();
                        await console.log("compile_import: <- ",await clone(acc));
                         return  acc
                    }
                };
                compile_javascript=async function(tokens,ctx) {
                    let acc;
                    let text;
                    acc=[];
                    text=null;
                    await (async function() {
                        let __for_body__482=async function(t) {
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
                        let __array__483=[],__elements__481=(await (await Environment.get_global("rest"))(tokens)||[]);
                        let __BREAK__FLAG__=false;
                        for(let __iter__480 in __elements__481) {
                            __array__483.push(await __for_body__482(__elements__481[__iter__480]));
                            if(__BREAK__FLAG__) {
                                 __array__483.pop();
                                break;
                                
                            }
                        }return __array__483;
                         
                    })();
                     return  acc
                };
                compile_dynamic_import=async function(tokens,ctx) {
                    let from_tokens;
                    let preamble;
                    let from_place;
                    let acc;
                    from_tokens=null;
                    preamble=await calling_preamble(ctx);
                    from_place=null;
                    acc=[];
                    from_tokens=(tokens && tokens["1"]);
                    (acc).push({
                        ctype:"statement"
                    });
                    from_place=await compile(from_tokens,ctx);
                    await (async function() {
                        let __for_body__486=async function(t) {
                             return  (acc).push(t)
                        };
                        let __array__487=[],__elements__485=await flatten(await (async function(){
                            let __array_op_rval__488=(preamble && preamble["0"]);
                             if (__array_op_rval__488 instanceof Function){
                                return await __array_op_rval__488(" ","import"," ","(",from_place,")") 
                            } else {
                                return[__array_op_rval__488," ","import"," ","(",from_place,")"]
                            }
                        })());
                        let __BREAK__FLAG__=false;
                        for(let __iter__484 in __elements__485) {
                            __array__487.push(await __for_body__486(__elements__485[__iter__484]));
                            if(__BREAK__FLAG__) {
                                 __array__487.pop();
                                break;
                                
                            }
                        }return __array__487;
                         
                    })();
                     return  acc
                };
                compile_set_global=async function(tokens,ctx) {
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
                    has_lisp_globals=true;
                    await async function(){
                        let __target_obj__489=(root_ctx && root_ctx["defined_lisp_globals"]);
                        __target_obj__489[target]=AsyncFunction;
                        return __target_obj__489;
                        
                    }();
                    if (check_true ((tokens && tokens["3"]))){
                         metavalue=await (async function () {
                             if (check_true (await (async function(){
                                let __array_op_rval__490=is_complex_ques_;
                                 if (__array_op_rval__490 instanceof Function){
                                    return await __array_op_rval__490((tokens && tokens["3"])) 
                                } else {
                                    return[__array_op_rval__490,(tokens && tokens["3"])]
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
                        if (check_true( (((assignment_value && assignment_value["0"]) instanceof Object)&&(assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])))) {
                            await async function(){
                                let __target_obj__491=(root_ctx && root_ctx["defined_lisp_globals"]);
                                __target_obj__491[target]=await async function(){
                                    if (check_true( ((assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])==="Function"))) {
                                         return Function
                                    } else if (check_true( ((assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])==="AsyncFunction"))) {
                                         return AsyncFunction
                                    } else if (check_true( ((assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])==="Number"))) {
                                         return Number
                                    } else if (check_true( ((assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])==="expression"))) {
                                         return Expression
                                    } else  {
                                         return (assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])
                                    }
                                } ();
                                return __target_obj__491;
                                
                            }();
                            if (check_true (wrap_as_function_ques_)){
                                 return  assignment_value=await (async function(){
                                    let __array_op_rval__492=(preamble && preamble["0"]);
                                     if (__array_op_rval__492 instanceof Function){
                                        return await __array_op_rval__492(" ","(",(preamble && preamble["1"])," ","function"," ","()",assignment_value,")","()") 
                                    } else {
                                        return[__array_op_rval__492," ","(",(preamble && preamble["1"])," ","function"," ","()",assignment_value,")","()"]
                                    }
                                })()
                            }
                        } else  {
                            if (check_true (((assignment_value instanceof Array)&&((assignment_value && assignment_value["0"])==="await")))){
                                  return await async function(){
                                    let __target_obj__493=(root_ctx && root_ctx["defined_lisp_globals"]);
                                    __target_obj__493[target]=AsyncFunction;
                                    return __target_obj__493;
                                    
                                }()
                            } else {
                                  return await async function(){
                                    let __target_obj__494=(root_ctx && root_ctx["defined_lisp_globals"]);
                                    __target_obj__494[target]=assignment_value;
                                    return __target_obj__494;
                                    
                                }()
                            }
                        }
                    } ();
                    if (check_true (await verbosity(ctx))){
                        await (async function(){
                            let __array_op_rval__495=clog;
                             if (__array_op_rval__495 instanceof Function){
                                return await __array_op_rval__495("target: ",await (await Environment.get_global("as_lisp"))(target)) 
                            } else {
                                return[__array_op_rval__495,"target: ",await (await Environment.get_global("as_lisp"))(target)]
                            }
                        })();
                         await (async function(){
                            let __array_op_rval__496=clog;
                             if (__array_op_rval__496 instanceof Function){
                                return await __array_op_rval__496("assignment_value: ",await (await Environment.get_global("as_lisp"))(assignment_value)) 
                            } else {
                                return[__array_op_rval__496,"assignment_value: ",await (await Environment.get_global("as_lisp"))(assignment_value)]
                            }
                        })()
                    };
                    acc=await (async function ()  {
                        let __array_arg__499=(async function() {
                            if (check_true (((Function===await (async function(){
                                let __targ__497=(root_ctx && root_ctx["defined_lisp_globals"]);
                                if (__targ__497){
                                     return(__targ__497)[target]
                                } 
                            })())||await (async function(){
                                let __array_op_rval__498=in_sync_ques_;
                                 if (__array_op_rval__498 instanceof Function){
                                    return await __array_op_rval__498(ctx) 
                                } else {
                                    return[__array_op_rval__498,ctx]
                                }
                            })()))){
                                  return ""
                            } else {
                                  return "await"
                            }
                        } );
                        let __array_arg__500=(async function() {
                            if (check_true (metavalue)){
                                  return ","
                            } else {
                                  return ""
                            }
                        } );
                        let __array_arg__501=(async function() {
                            if (check_true (metavalue)){
                                  return metavalue
                            } else {
                                  return ""
                            }
                        } );
                        return [{
                            ctype:"statement"
                        },await __array_arg__499()," ","Environment",".","set_global","(","","\"",(tokens && tokens["1"] && tokens["1"]["name"]),"\"",",",assignment_value,await __array_arg__500(),await __array_arg__501(),")"]
                    } )();
                     return  acc
                };
                is_token_ques_=async function(t) {
                     return  (((t instanceof Object)&&(t && t["__token__"]))||((t instanceof Array)&&((t && t["0"]) instanceof Object)&&(t && t["0"] && t["0"]["__token__"])))
                };
                compile_quote=async function(lisp_struct,ctx) {
                    let acc;
                    acc=[];
                    ctx=await new_ctx(ctx);
                    await async function(){
                        let __target_obj__502=ctx;
                        __target_obj__502["hard_quote_mode"]=true;
                        return __target_obj__502;
                        
                    }();
                    acc=await compile_quotem(lisp_struct,ctx);
                     return  acc
                };
                compile_quotel=async function(lisp_struct,ctx) {
                    let acc;
                    acc=[];
                    acc=await JSON.stringify((lisp_struct && lisp_struct["1"]));
                     return  await (async function(){
                        let __array_op_rval__503=acc;
                         if (__array_op_rval__503 instanceof Function){
                            return await __array_op_rval__503() 
                        } else {
                            return[__array_op_rval__503]
                        }
                    })()
                };
                wrap_and_run=async function(js_code,ctx,run_opts) {
                    let __assembly__504= async function(){
                        return null
                    };
                    let result;
                    let fst;
                    let needs_braces_ques_;
                    let run_log;
                    let __needs_return_ques___505= async function(){
                        return await (async function ()  {
                            fst=(""+(((js_code instanceof Array)&&await first(js_code)&&(await first(js_code) instanceof Object)&&await (async function(){
                                let __targ__506=await first(js_code);
                                if (__targ__506){
                                     return(__targ__506)["ctype"]
                                } 
                            })())||""));
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
                        let assembly=await __assembly__504();
                        ;
                        result=null;
                        fst=null;
                        needs_braces_ques_=false;
                        run_log=await (async function () {
                             if (check_true ((opts && opts["quiet_mode"]))){
                                  return log
                            } else {
                                  return await defclog({
                                    prefix:"wrap_and_run",background:"#703030",color:"white"
                                })
                            } 
                        })();
                        let needs_return_ques_=await __needs_return_ques___505();
                        ;
                        assembled=null;
                        assembled=await (await Environment.get_global("splice_in_return_b"))(await (await Environment.get_global("splice_in_return_a"))(js_code));
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
                        assembly=new AsyncFunction("Environment",assembled);
                        if (check_true ((run_opts && run_opts["bind_mode"]))){
                             assembly=await (await Environment.get_global("bind_function"))(assembly,Environment)
                        };
                        result=await assembly(Environment);
                         return  result
                    }
                };
                follow_log=await (async function () {
                     if (check_true ((opts && opts["quiet_mode"]))){
                          return log
                    } else {
                          return await defclog({
                            prefix:"follow_tree",background:"#603060",color:"white"
                        })
                    } 
                })();
                follow_tree=async function(tree,ctx) {
                    let meta;
                    let tlength;
                    let idx;
                    let tval;
                    let tmp_name;
                    let check_return_tree;
                    let result;
                    let subacc;
                    let ntree;
                    meta=null;
                    tlength=0;
                    idx=0;
                    tval=null;
                    tmp_name=null;
                    check_return_tree=async function(stmts) {
                        let fst;
                        let rval;
                        fst=await (async function () {
                             if (check_true (((ntree instanceof Array)&&((ntree && ntree["0"]) instanceof Object)&&await (async function(){
                                let __targ__507=(ntree && ntree["0"]);
                                if (__targ__507){
                                     return(__targ__507)["ctype"]
                                } 
                            })()))){
                                  return await (async function(){
                                    let __targ__508=await first(ntree);
                                    if (__targ__508){
                                         return(__targ__508)["ctype"]
                                    } 
                                })()
                            } else {
                                  return null
                            } 
                        })();
                        rval=null;
                        rval=await async function(){
                            if (check_true( (fst===null))) {
                                 return stmts
                            } else if (check_true( (fst==="Boolean"))) {
                                 return (""+(stmts && stmts["1"]))
                            } else if (check_true( (fst==="nil"))) {
                                 return "null"
                            } else if (check_true( (fst==="Number"))) {
                                 return (stmts && stmts["1"])
                            } else if (check_true( (fst==="undefined"))) {
                                 return "undefined"
                            } else  {
                                 return stmts
                            }
                        } ();
                         return  rval
                    };
                    result=null;
                    subacc=[];
                    ntree=null;
                    if (check_true ((null==ctx))){
                        throw new ReferenceError("follow_tree received nil/undefined ctx");
                        
                    };
                     return  await async function(){
                        if (check_true( (tree instanceof Array))) {
                            tlength=(tree && tree.length);
                            await (async function(){
                                 let __test_condition__509=async function() {
                                     return  (idx<tlength)
                                };
                                let __body_ref__510=async function() {
                                    tval=await (async function(){
                                        let __targ__511=tree;
                                        if (__targ__511){
                                             return(__targ__511)[idx]
                                        } 
                                    })();
                                    await async function(){
                                        if (check_true( (tval===`=$,@`))) {
                                            idx+=1;
                                            tval=await (async function(){
                                                let __targ__512=tree;
                                                if (__targ__512){
                                                     return(__targ__512)[idx]
                                                } 
                                            })();
                                            if (check_true (await not((undefined==tval)))){
                                                if (check_true (await get_ctx_val(ctx,"__IN_LAMBDA__"))){
                                                    ntree=[];
                                                    if (check_true ((tval instanceof Object))){
                                                        tmp_name=await gen_temp_name("tval");
                                                         await (async function() {
                                                            let __for_body__515=async function(t) {
                                                                 return  (ntree).push(t)
                                                            };
                                                            let __array__516=[],__elements__514=await flatten(await (await Environment.get_global("embed_compiled_quote"))(0,tmp_name,tval));
                                                            let __BREAK__FLAG__=false;
                                                            for(let __iter__513 in __elements__514) {
                                                                __array__516.push(await __for_body__515(__elements__514[__iter__513]));
                                                                if(__BREAK__FLAG__) {
                                                                     __array__516.pop();
                                                                    break;
                                                                    
                                                                }
                                                            }return __array__516;
                                                             
                                                        })()
                                                    } else {
                                                         await (async function() {
                                                            let __for_body__519=async function(t) {
                                                                 return  (subacc).push(t)
                                                            };
                                                            let __array__520=[],__elements__518=await flatten(await (await Environment.get_global("embed_compiled_quote"))(1,tmp_name,tval));
                                                            let __BREAK__FLAG__=false;
                                                            for(let __iter__517 in __elements__518) {
                                                                __array__520.push(await __for_body__519(__elements__518[__iter__517]));
                                                                if(__BREAK__FLAG__) {
                                                                     __array__520.pop();
                                                                    break;
                                                                    
                                                                }
                                                            }return __array__520;
                                                             
                                                        })()
                                                    };
                                                    if (check_true ((tval instanceof Object))){
                                                        (ntree).push(await (await Environment.get_global("embed_compiled_quote"))(4));
                                                        ntree=await compile(await tokenize(tval,ctx),ctx);
                                                        ntree=await check_return_tree(ntree);
                                                         ntree=await wrap_and_run(ntree,ctx)
                                                    } else {
                                                        
                                                    }
                                                } else {
                                                    ntree=await compile(await tokenize(tval,ctx),ctx);
                                                    ntree=await check_return_tree(ntree);
                                                    if (check_true ((ntree instanceof Object))){
                                                         ntree=await wrap_and_run(ntree,ctx)
                                                    }
                                                };
                                                 return  subacc=await subacc["concat"].call(subacc,ntree)
                                            } else throw new SyntaxError("invalid splice operator position");
                                            
                                        } else if (check_true( (await not((ctx && ctx["hard_quote_mode"]))&&((tval===`=:##`)||(tval===`=:unquotem`))))) {
                                            idx+=1;
                                            tval=await (async function(){
                                                let __targ__521=tree;
                                                if (__targ__521){
                                                     return(__targ__521)[idx]
                                                } 
                                            })();
                                            if (check_true (await not((undefined==tval)))){
                                                if (check_true (await get_ctx_val(ctx,"__IN_LAMBDA__"))){
                                                    ntree=[];
                                                    if (check_true ((tval instanceof Object))){
                                                        tmp_name=await gen_temp_name("tval");
                                                         await (async function() {
                                                            let __for_body__524=async function(t) {
                                                                 return  (ntree).push(t)
                                                            };
                                                            let __array__525=[],__elements__523=await flatten(await (await Environment.get_global("embed_compiled_quote"))(2,tmp_name,tval));
                                                            let __BREAK__FLAG__=false;
                                                            for(let __iter__522 in __elements__523) {
                                                                __array__525.push(await __for_body__524(__elements__523[__iter__522]));
                                                                if(__BREAK__FLAG__) {
                                                                     __array__525.pop();
                                                                    break;
                                                                    
                                                                }
                                                            }return __array__525;
                                                             
                                                        })()
                                                    } else {
                                                         await (async function() {
                                                            let __for_body__528=async function(t) {
                                                                 return  (ntree).push(t)
                                                            };
                                                            let __array__529=[],__elements__527=await flatten(await (await Environment.get_global("embed_compiled_quote"))(3,tmp_name,tval));
                                                            let __BREAK__FLAG__=false;
                                                            for(let __iter__526 in __elements__527) {
                                                                __array__529.push(await __for_body__528(__elements__527[__iter__526]));
                                                                if(__BREAK__FLAG__) {
                                                                     __array__529.pop();
                                                                    break;
                                                                    
                                                                }
                                                            }return __array__529;
                                                             
                                                        })()
                                                    };
                                                    if (check_true ((tval instanceof Object))){
                                                        (ntree).push(await (await Environment.get_global("embed_compiled_quote"))(4));
                                                        ntree=await compile(await tokenize(tval,ctx),ctx);
                                                         ntree=await wrap_and_run(ntree,ctx)
                                                    };
                                                     return  subacc=await subacc["concat"].call(subacc,ntree)
                                                } else {
                                                    ntree=await compile(await tokenize(tval,ctx),ctx);
                                                    ntree=await check_return_tree(ntree);
                                                    ntree=await wrap_and_run(ntree,ctx);
                                                     return  (subacc).push(ntree)
                                                }
                                            } else throw new SyntaxError("invalid unquotem operator position");
                                            
                                        } else  {
                                            tval=await follow_tree(tval,ctx);
                                             return  (subacc).push(tval)
                                        }
                                    } ();
                                     return  idx+=1
                                };
                                let __BREAK__FLAG__=false;
                                while(await __test_condition__509()) {
                                    await __body_ref__510();
                                     if(__BREAK__FLAG__) {
                                         break;
                                        
                                    }
                                } ;
                                
                            })();
                             return  subacc
                        } else if (check_true( (await is_number_ques_(tree)||(tree instanceof String || typeof tree==='string')||(false===tree)||(true===tree)||(null===tree)||(undefined===tree)))) {
                             return tree
                        } else if (check_true( ((tree instanceof Object)&&await not(tree instanceof Function)))) {
                            await (async function() {
                                let __for_body__532=async function(k) {
                                     return  await async function(){
                                        let __target_obj__534=tree;
                                        __target_obj__534[k]=await follow_tree(await (async function(){
                                            let __targ__535=tree;
                                            if (__targ__535){
                                                 return(__targ__535)[k]
                                            } 
                                        })(),ctx);
                                        return __target_obj__534;
                                        
                                    }()
                                };
                                let __array__533=[],__elements__531=await (await Environment.get_global("keys"))(tree);
                                let __BREAK__FLAG__=false;
                                for(let __iter__530 in __elements__531) {
                                    __array__533.push(await __for_body__532(__elements__531[__iter__530]));
                                    if(__BREAK__FLAG__) {
                                         __array__533.pop();
                                        break;
                                        
                                    }
                                }return __array__533;
                                 
                            })();
                             return  tree
                        } else if (check_true( tree instanceof Function)) {
                             return tree
                        }
                    } ()
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
                    let pcm;
                    let encoded;
                    let rval;
                    let is_arr_ques_;
                    acc=[];
                    pcm=null;
                    encoded=null;
                    rval=null;
                    is_arr_ques_=((lisp_struct && lisp_struct["1"]) instanceof Array);
                    has_lisp_globals=true;
                    if (check_true (await contains_ques_((lisp_struct && lisp_struct["1"]),await (async function(){
                        let __array_op_rval__536=("="+":"+"(");
                         if (__array_op_rval__536 instanceof Function){
                            return await __array_op_rval__536(("="+":"+")"),("="+":"+"'"),("="+":")) 
                        } else {
                            return[__array_op_rval__536,("="+":"+")"),("="+":"+"'"),("="+":")]
                        }
                    })()))){
                          return ("\""+(lisp_struct && lisp_struct["1"])+"\"")
                    } else {
                        pcm=await follow_tree((lisp_struct && lisp_struct["1"]),ctx);
                        await async function(){
                            if (check_true( (pcm instanceof String || typeof pcm==='string'))) {
                                 return  await (async function() {
                                    let __for_body__539=async function(t) {
                                         return  (acc).push(t)
                                    };
                                    let __array__540=[],__elements__538=await (async function(){
                                        let __array_op_rval__541=("`"+pcm+"`");
                                         if (__array_op_rval__541 instanceof Function){
                                            return await __array_op_rval__541() 
                                        } else {
                                            return[__array_op_rval__541]
                                        }
                                    })();
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__537 in __elements__538) {
                                        __array__540.push(await __for_body__539(__elements__538[__iter__537]));
                                        if(__BREAK__FLAG__) {
                                             __array__540.pop();
                                            break;
                                            
                                        }
                                    }return __array__540;
                                     
                                })()
                            } else if (check_true( await is_number_ques_(pcm))) {
                                 return (acc).push(pcm)
                            } else if (check_true( ((pcm===false)||(pcm===true)))) {
                                 return (acc).push(pcm)
                            } else  {
                                encoded=await Environment["as_lisp"].call(Environment,pcm);
                                encoded=await (await Environment.get_global("add_escape_encoding"))(encoded);
                                 return  await (async function() {
                                    let __for_body__544=async function(t) {
                                         return  (acc).push(t)
                                    };
                                    let __array__545=[],__elements__543=["await"," ","Environment.do_deferred_splice","(","await"," ","Environment.read_lisp","(","'",encoded,"'",")",")"];
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
                        } ();
                         return  acc
                    }
                };
                unq_log=await (async function () {
                     if (check_true ((opts && opts["quiet_mode"]))){
                          return log
                    } else {
                          return await defclog({
                            prefix:"compile_unquotem",background:"#505060",color:"white"
                        })
                    } 
                })();
                compile_unquotem=async function(lisp_struct,ctx) {
                    let acc;
                    acc=[];
                    (acc).push(await compile((lisp_struct && lisp_struct["1"]),ctx));
                     return  acc
                };
                evalq_log=await (async function () {
                     if (check_true ((opts && opts["quiet_mode"]))){
                          return log
                    } else {
                          return await defclog({
                            prefix:"compile_evalq",background:"#505060",color:"white"
                        })
                    } 
                })();
                compile_evalq=async function(lisp_struct,ctx) {
                    let acc;
                    let __tokens__546= async function(){
                        return null
                    };
                    let preamble;
                    let is_arr_ques_;
                    {
                        acc=[];
                        let tokens=await __tokens__546();
                        ;
                        preamble=await calling_preamble(ctx);
                        is_arr_ques_=((lisp_struct && lisp_struct["1"]) instanceof Array);
                        tokens=await (async function () {
                             if (check_true (is_arr_ques_)){
                                  return await tokenize((lisp_struct && lisp_struct["1"]),ctx)
                            } else {
                                  return (await tokenize(await (async function(){
                                    let __array_op_rval__547=(lisp_struct && lisp_struct["1"]);
                                     if (__array_op_rval__547 instanceof Function){
                                        return await __array_op_rval__547() 
                                    } else {
                                        return[__array_op_rval__547]
                                    }
                                })(),ctx)).pop()
                            } 
                        })();
                        acc=[await compile(tokens,ctx)];
                        if (check_true (is_arr_ques_)){
                             acc=await (async function(){
                                let __array_op_rval__548=(preamble && preamble["1"]);
                                 if (__array_op_rval__548 instanceof Function){
                                    return await __array_op_rval__548(" ","function","()",["{","return"," ",acc,"}"]) 
                                } else {
                                    return[__array_op_rval__548," ","function","()",["{","return"," ",acc,"}"]]
                                }
                            })()
                        };
                         return  acc
                    }
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
                    let __assembly__549= async function(){
                        return null
                    };
                    let type_mark;
                    let acc;
                    let preamble;
                    let result;
                    {
                        let assembly=await __assembly__549();
                        ;
                        type_mark=null;
                        acc=[];
                        preamble=await calling_preamble(ctx);
                        result=null;
                        assembly=await compile((tokens && tokens["1"] && tokens["1"]["val"]),ctx);
                        if (check_true (await verbosity(ctx))){
                             await (async function(){
                                let __array_op_rval__550=eval_log;
                                 if (__array_op_rval__550 instanceof Function){
                                    return await __array_op_rval__550("assembly:",await clone(assembly)) 
                                } else {
                                    return[__array_op_rval__550,"assembly:",await clone(assembly)]
                                }
                            })()
                        };
                        has_lisp_globals=true;
                        result=["Environment",".","eval","(",(preamble && preamble["0"])," ",(preamble && preamble["1"])," ","function","()",["{","return"," ",assembly,"}","()",")"]];
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
                     return  await (async function(){
                        let __array_op_rval__551=(preamble && preamble["2"]);
                         if (__array_op_rval__551 instanceof Function){
                            return await __array_op_rval__551((preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ","{",await compile_for_each_inner(tokens,ctx,preamble)," ","}",")","()") 
                        } else {
                            return[__array_op_rval__551,(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ","{",await compile_for_each_inner(tokens,ctx,preamble)," ","}",")","()"]
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
                              return ((for_args && for_args.length)-1)
                        } else {
                              return 0
                        } 
                    })();
                    for_body=(tokens && tokens["2"]);
                    body_is_block_ques_=await (async function(){
                        let __array_op_rval__552=is_block_ques_;
                         if (__array_op_rval__552 instanceof Function){
                            return await __array_op_rval__552((for_body && for_body["val"])) 
                        } else {
                            return[__array_op_rval__552,(for_body && for_body["val"])]
                        }
                    })();
                    ;
                    if (check_true ((iter_count<1))){
                        throw new SyntaxError("Invalid for_each arguments");
                        
                    };
                    await (async function() {
                        let __for_body__555=async function(iter_idx) {
                            (idx_iters).push(await (async function(){
                                let __targ__557=for_args;
                                if (__targ__557){
                                     return(__targ__557)[iter_idx]
                                } 
                            })());
                             return  await set_ctx(ctx,await clean_quoted_reference(await (async function(){
                                let __targ__558=await last(idx_iters);
                                if (__targ__558){
                                     return(__targ__558)["name"]
                                } 
                            })()),ArgumentType)
                        };
                        let __array__556=[],__elements__554=await (await Environment.get_global("range"))(iter_count);
                        let __BREAK__FLAG__=false;
                        for(let __iter__553 in __elements__554) {
                            __array__556.push(await __for_body__555(__elements__554[__iter__553]));
                            if(__BREAK__FLAG__) {
                                 __array__556.pop();
                                break;
                                
                            }
                        }return __array__556;
                         
                    })();
                    await set_ctx(ctx,collector_ref,ArgumentType);
                    await set_ctx(ctx,element_list,"arg");
                    if (check_true (await not(body_is_block_ques_))){
                         for_body=await make_do_block(for_body)
                    };
                    prebuild=await build_fn_with_assignment(body_function_ref,(for_body && for_body["val"]),idx_iters,ctx);
                    await async function(){
                        let __target_obj__559=ctx;
                        __target_obj__559["return_last_value"]=true;
                        return __target_obj__559;
                        
                    }();
                    (acc).push(await compile(prebuild,ctx));
                    await (async function() {
                        let __for_body__562=async function(t) {
                             return  (acc).push(t)
                        };
                        let __array__563=[],__elements__561=["let"," ",collector_ref,"=","[]",",",element_list,"=",await wrap_assignment_value(await compile(elements,ctx),ctx),";"];
                        let __BREAK__FLAG__=false;
                        for(let __iter__560 in __elements__561) {
                            __array__563.push(await __for_body__562(__elements__561[__iter__560]));
                            if(__BREAK__FLAG__) {
                                 __array__563.pop();
                                break;
                                
                            }
                        }return __array__563;
                         
                    })();
                    await (async function() {
                        let __for_body__566=async function(t) {
                             return  (acc).push(t)
                        };
                        let __array__567=[],__elements__565=["let"," ",break_out,"=","false",";"];
                        let __BREAK__FLAG__=false;
                        for(let __iter__564 in __elements__565) {
                            __array__567.push(await __for_body__566(__elements__565[__iter__564]));
                            if(__BREAK__FLAG__) {
                                 __array__567.pop();
                                break;
                                
                            }
                        }return __array__567;
                         
                    })();
                    if (check_true (await (await Environment.get_global("blank?"))((preamble && preamble["0"])))){
                         await set_ctx(ctx,body_function_ref,Function)
                    } else {
                         await set_ctx(ctx,body_function_ref,AsyncFunction)
                    };
                    await async function(){
                        if (check_true( (((for_args && for_args.length)===2)&&await not(((for_args && for_args["1"]) instanceof Array))))) {
                            await set_ctx(ctx,idx_iter,Number);
                            await (async function() {
                                let __for_body__570=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__571=[],__elements__569=["for","(","let"," ",idx_iter," ","in"," ",element_list,")"," ","{"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__568 in __elements__569) {
                                    __array__571.push(await __for_body__570(__elements__569[__iter__568]));
                                    if(__BREAK__FLAG__) {
                                         __array__571.pop();
                                        break;
                                        
                                    }
                                }return __array__571;
                                 
                            })();
                            await (async function() {
                                let __for_body__574=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__575=[],__elements__573=await (async function(){
                                    let __array_op_rval__576=collector_ref;
                                     if (__array_op_rval__576 instanceof Function){
                                        return await __array_op_rval__576(".","push","(",(preamble && preamble["0"])," ",body_function_ref,"(",element_list,"[",idx_iter,"]",")",")",";") 
                                    } else {
                                        return[__array_op_rval__576,".","push","(",(preamble && preamble["0"])," ",body_function_ref,"(",element_list,"[",idx_iter,"]",")",")",";"]
                                    }
                                })();
                                let __BREAK__FLAG__=false;
                                for(let __iter__572 in __elements__573) {
                                    __array__575.push(await __for_body__574(__elements__573[__iter__572]));
                                    if(__BREAK__FLAG__) {
                                         __array__575.pop();
                                        break;
                                        
                                    }
                                }return __array__575;
                                 
                            })();
                            await (async function() {
                                let __for_body__579=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__580=[],__elements__578=["if","(",break_out,")"," ","{"," ",collector_ref,".","pop","()",";","break",";","}"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__577 in __elements__578) {
                                    __array__580.push(await __for_body__579(__elements__578[__iter__577]));
                                    if(__BREAK__FLAG__) {
                                         __array__580.pop();
                                        break;
                                        
                                    }
                                }return __array__580;
                                 
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
                    await set_ctx(ctx,break_out,true);
                    if (check_true ((test_condition && test_condition["ref"]))){
                         (prebuild).push(await compile(await build_fn_with_assignment(test_condition_ref,(test_condition && test_condition["name"]),null,ctx),ctx))
                    } else {
                         (prebuild).push(await compile(await build_fn_with_assignment(test_condition_ref,(test_condition && test_condition["val"]),null,ctx),ctx))
                    };
                    (prebuild).push(await compile(await build_fn_with_assignment(body_ref,(body && body["val"]),null,ctx),ctx));
                    await (async function() {
                        let __for_body__583=async function(t) {
                             return  (prebuild).push(t)
                        };
                        let __array__584=[],__elements__582=["let"," ",break_out,"=","false",";"];
                        let __BREAK__FLAG__=false;
                        for(let __iter__581 in __elements__582) {
                            __array__584.push(await __for_body__583(__elements__582[__iter__581]));
                            if(__BREAK__FLAG__) {
                                 __array__584.pop();
                                break;
                                
                            }
                        }return __array__584;
                         
                    })();
                    await (async function() {
                        let __for_body__587=async function(t) {
                             return  (prebuild).push(t)
                        };
                        let __array__588=[],__elements__586=["while","(",(preamble && preamble["0"])," ",test_condition_ref,"()",")"," ","{",(preamble && preamble["0"])," ",body_ref,"()",";"," ","if","(",break_out,")"," ","{"," ","break",";","}","}"," ","",";"];
                        let __BREAK__FLAG__=false;
                        for(let __iter__585 in __elements__586) {
                            __array__588.push(await __for_body__587(__elements__586[__iter__585]));
                            if(__BREAK__FLAG__) {
                                 __array__588.pop();
                                break;
                                
                            }
                        }return __array__588;
                         
                    })();
                    await (async function() {
                        let __for_body__591=async function(t) {
                             return  (acc).push(t)
                        };
                        let __array__592=[],__elements__590=await (async function(){
                            let __array_op_rval__593=(preamble && preamble["0"]);
                             if (__array_op_rval__593 instanceof Function){
                                return await __array_op_rval__593(" ","(",(preamble && preamble["1"])," ","function","()","{"," ",prebuild,"}",")","()") 
                            } else {
                                return[__array_op_rval__593," ","(",(preamble && preamble["1"])," ","function","()","{"," ",prebuild,"}",")","()"]
                            }
                        })();
                        let __BREAK__FLAG__=false;
                        for(let __iter__589 in __elements__590) {
                            __array__592.push(await __for_body__591(__elements__590[__iter__589]));
                            if(__BREAK__FLAG__) {
                                 __array__592.pop();
                                break;
                                
                            }
                        }return __array__592;
                         
                    })();
                     return  acc
                };
                compile_for_with=async function(tokens,ctx,preamble) {
                    preamble=await calling_preamble(ctx);
                     return  await (async function(){
                        let __array_op_rval__594=(preamble && preamble["2"]);
                         if (__array_op_rval__594 instanceof Function){
                            return await __array_op_rval__594((preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ","{",await compile_for_with_inner(tokens,ctx,preamble)," ","}",")","()") 
                        } else {
                            return[__array_op_rval__594,(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ","{",await compile_for_with_inner(tokens,ctx,preamble)," ","}",")","()"]
                        }
                    })()
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
                              return ((for_args && for_args.length)-1)
                        } else {
                              return 0
                        } 
                    })();
                    for_body=(tokens && tokens["2"]);
                    body_is_block_ques_=await (async function(){
                        let __array_op_rval__595=is_block_ques_;
                         if (__array_op_rval__595 instanceof Function){
                            return await __array_op_rval__595((for_body && for_body["val"])) 
                        } else {
                            return[__array_op_rval__595,(for_body && for_body["val"])]
                        }
                    })();
                    ;
                    if (check_true ((iter_count<1))){
                        throw new SyntaxError("Invalid for_each arguments");
                        
                    };
                    await (async function() {
                        let __for_body__598=async function(iter_ref) {
                            (idx_iters).push(await (async function(){
                                let __targ__600=for_args;
                                if (__targ__600){
                                     return(__targ__600)[iter_ref]
                                } 
                            })());
                             return  await set_ctx(ctx,await clean_quoted_reference(await (async function(){
                                let __targ__601=await last(idx_iters);
                                if (__targ__601){
                                     return(__targ__601)["name"]
                                } 
                            })()),ArgumentType)
                        };
                        let __array__599=[],__elements__597=await (await Environment.get_global("range"))(iter_count);
                        let __BREAK__FLAG__=false;
                        for(let __iter__596 in __elements__597) {
                            __array__599.push(await __for_body__598(__elements__597[__iter__596]));
                            if(__BREAK__FLAG__) {
                                 __array__599.pop();
                                break;
                                
                            }
                        }return __array__599;
                         
                    })();
                    await set_ctx(ctx,generator_expression,"arg");
                    if (check_true (await not(body_is_block_ques_))){
                         for_body=await make_do_block(for_body)
                    };
                    prebuild=await build_fn_with_assignment(body_function_ref,(for_body && for_body["val"]),idx_iters,ctx);
                    await async function(){
                        let __target_obj__602=ctx;
                        __target_obj__602["return_last_value"]=true;
                        return __target_obj__602;
                        
                    }();
                    (acc).push(await compile(prebuild,ctx));
                    await (async function() {
                        let __for_body__605=async function(t) {
                             return  (acc).push(t)
                        };
                        let __array__606=[],__elements__604=["let"," ",break_out,"=","false",";"];
                        let __BREAK__FLAG__=false;
                        for(let __iter__603 in __elements__604) {
                            __array__606.push(await __for_body__605(__elements__604[__iter__603]));
                            if(__BREAK__FLAG__) {
                                 __array__606.pop();
                                break;
                                
                            }
                        }return __array__606;
                         
                    })();
                    await set_ctx(ctx,body_function_ref,AsyncFunction);
                    await async function(){
                        if (check_true( (((for_args && for_args.length)===2)&&await not(((for_args && for_args["1"]) instanceof Array))))) {
                            await (async function() {
                                let __for_body__609=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__610=[],__elements__608=["for"," ",(preamble && preamble["0"])," ","(","const"," ",iter_ref," ","of"," ",await wrap_assignment_value(await compile(elements,ctx),ctx),")"," ","{"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__607 in __elements__608) {
                                    __array__610.push(await __for_body__609(__elements__608[__iter__607]));
                                    if(__BREAK__FLAG__) {
                                         __array__610.pop();
                                        break;
                                        
                                    }
                                }return __array__610;
                                 
                            })();
                            await (async function() {
                                let __for_body__613=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__614=[],__elements__612=await (async function(){
                                    let __array_op_rval__615=(preamble && preamble["0"]);
                                     if (__array_op_rval__615 instanceof Function){
                                        return await __array_op_rval__615(" ",body_function_ref,"(",iter_ref,")",";") 
                                    } else {
                                        return[__array_op_rval__615," ",body_function_ref,"(",iter_ref,")",";"]
                                    }
                                })();
                                let __BREAK__FLAG__=false;
                                for(let __iter__611 in __elements__612) {
                                    __array__614.push(await __for_body__613(__elements__612[__iter__611]));
                                    if(__BREAK__FLAG__) {
                                         __array__614.pop();
                                        break;
                                        
                                    }
                                }return __array__614;
                                 
                            })();
                            await (async function() {
                                let __for_body__618=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__619=[],__elements__617=["if","(",break_out,")"," ","break",";"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__616 in __elements__617) {
                                    __array__619.push(await __for_body__618(__elements__617[__iter__616]));
                                    if(__BREAK__FLAG__) {
                                         __array__619.pop();
                                        break;
                                        
                                    }
                                }return __array__619;
                                 
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
                     return  (await get_ctx(ctx,"__VERBOSITY__")||await Environment["get_global"].call(Environment,"__VERBOSITY__"))
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
                        let __for_body__622=async function(exp) {
                            declaration=(exp && exp["val"] && exp["val"]["0"] && exp["val"]["0"]["name"]);
                            targeted=await (await Environment.get_global("rest"))((exp && exp["val"]));
                            if (check_true (await (async function(){
                                let __array_op_rval__624=verbosity;
                                 if (__array_op_rval__624 instanceof Function){
                                    return await __array_op_rval__624(ctx) 
                                } else {
                                    return[__array_op_rval__624,ctx]
                                }
                            })())){
                                 await (async function(){
                                    let __array_op_rval__625=declare_log;
                                     if (__array_op_rval__625 instanceof Function){
                                        return await __array_op_rval__625("declaration: ",declaration,"targeted: ",await (await Environment.get_global("each"))(targeted,"name"),targeted) 
                                    } else {
                                        return[__array_op_rval__625,"declaration: ",declaration,"targeted: ",await (await Environment.get_global("each"))(targeted,"name"),targeted]
                                    }
                                })()
                            };
                             return  await async function(){
                                if (check_true( (declaration==="toplevel"))) {
                                    await async function(){
                                        let __target_obj__626=opts;
                                        __target_obj__626["root_environment"]=(targeted && targeted["0"]);
                                        return __target_obj__626;
                                        
                                    }();
                                    if (check_true ((opts && opts["root_environment"]))){
                                          return env_ref=""
                                    } else {
                                          return env_ref="Environment."
                                    }
                                } else if (check_true( (declaration==="include"))) {
                                     return  await (async function() {
                                        let __for_body__629=async function(name) {
                                            sanitized_name=await sanitize_js_ref_name(name);
                                            dec_struct=await get_declaration_details(ctx,name);
                                            if (check_true (dec_struct)){
                                                await (async function() {
                                                    let __for_body__633=async function(t) {
                                                         return  (acc).push(t)
                                                    };
                                                    let __array__634=[],__elements__632=["let"," ",sanitized_name,"="];
                                                    let __BREAK__FLAG__=false;
                                                    for(let __iter__631 in __elements__632) {
                                                        __array__634.push(await __for_body__633(__elements__632[__iter__631]));
                                                        if(__BREAK__FLAG__) {
                                                             __array__634.pop();
                                                            break;
                                                            
                                                        }
                                                    }return __array__634;
                                                     
                                                })();
                                                await async function(){
                                                    if (check_true( ((dec_struct && dec_struct["value"]) instanceof Function&&await (async function(){
                                                        let __targ__636=await (async function(){
                                                            let __targ__635=(Environment && Environment["definitions"]);
                                                            if (__targ__635){
                                                                 return(__targ__635)[name]
                                                            } 
                                                        })();
                                                        if (__targ__636){
                                                             return(__targ__636)["fn_body"]
                                                        } 
                                                    })()))) {
                                                        details=await (async function(){
                                                            let __targ__637=(Environment && Environment["definitions"]);
                                                            if (__targ__637){
                                                                 return(__targ__637)[name]
                                                            } 
                                                        })();
                                                        source=("(fn "+(details && details["fn_args"])+" "+(details && details["fn_body"])+")");
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
                                                let __targ__638=await get_declarations(ctx,name);
                                                if (__targ__638){
                                                     return(__targ__638)["type"]
                                                } 
                                            })())&&(dec_struct && dec_struct["value"]) instanceof Function))){
                                                  return await set_declaration(ctx,name,"type",Function)
                                            }
                                        };
                                        let __array__630=[],__elements__628=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__627 in __elements__628) {
                                            __array__630.push(await __for_body__629(__elements__628[__iter__627]));
                                            if(__BREAK__FLAG__) {
                                                 __array__630.pop();
                                                break;
                                                
                                            }
                                        }return __array__630;
                                         
                                    })()
                                } else if (check_true( (declaration==="verbose"))) {
                                    let verbosity_level=await parseInt(await first(await (await Environment.get_global("each"))(targeted,"name")));
                                    ;
                                    if (check_true (await not(await isNaN(verbosity_level)))){
                                        if (check_true ((verbosity_level>0))){
                                             await set_ctx(ctx,"__VERBOSITY__",verbosity_level)
                                        } else {
                                            await (async function(){
                                                let __array_op_rval__639=declare_log;
                                                 if (__array_op_rval__639 instanceof Function){
                                                    return await __array_op_rval__639("verbosity: turned off") 
                                                } else {
                                                    return[__array_op_rval__639,"verbosity: turned off"]
                                                }
                                            })();
                                            verbosity=silence;
                                             await set_ctx(ctx,"__VERBOSITY__",null)
                                        };
                                        verbosity=check_verbosity;
                                         return  await (async function(){
                                            let __array_op_rval__641=declare_log;
                                             if (__array_op_rval__641 instanceof Function){
                                                return await __array_op_rval__641("compiler: verbosity set: ",await (async function(){
                                                    let __array_op_rval__640=verbosity;
                                                     if (__array_op_rval__640 instanceof Function){
                                                        return await __array_op_rval__640(ctx) 
                                                    } else {
                                                        return[__array_op_rval__640,ctx]
                                                    }
                                                })()) 
                                            } else {
                                                return[__array_op_rval__641,"compiler: verbosity set: ",await (async function(){
                                                    let __array_op_rval__640=verbosity;
                                                     if (__array_op_rval__640 instanceof Function){
                                                        return await __array_op_rval__640(ctx) 
                                                    } else {
                                                        return[__array_op_rval__640,ctx]
                                                    }
                                                })()]
                                            }
                                        })()
                                    } else {
                                         (warnings).push("invalid verbosity declaration, expected number, received ")
                                    }
                                } else if (check_true( (declaration==="local"))) {
                                     return await (async function() {
                                        let __for_body__644=async function(name) {
                                            dec_struct=await get_declaration_details(ctx,name);
                                             return  await set_ctx(ctx,name,(dec_struct && dec_struct["value"]))
                                        };
                                        let __array__645=[],__elements__643=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__642 in __elements__643) {
                                            __array__645.push(await __for_body__644(__elements__643[__iter__642]));
                                            if(__BREAK__FLAG__) {
                                                 __array__645.pop();
                                                break;
                                                
                                            }
                                        }return __array__645;
                                         
                                    })()
                                } else if (check_true( (declaration==="function"))) {
                                     return  await (async function() {
                                        let __for_body__648=async function(name) {
                                             return  await set_declaration(ctx,name,"type",Function)
                                        };
                                        let __array__649=[],__elements__647=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__646 in __elements__647) {
                                            __array__649.push(await __for_body__648(__elements__647[__iter__646]));
                                            if(__BREAK__FLAG__) {
                                                 __array__649.pop();
                                                break;
                                                
                                            }
                                        }return __array__649;
                                         
                                    })()
                                } else if (check_true( (declaration==="array"))) {
                                     return  await (async function() {
                                        let __for_body__652=async function(name) {
                                             return  await set_declaration(ctx,name,"type",Array)
                                        };
                                        let __array__653=[],__elements__651=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__650 in __elements__651) {
                                            __array__653.push(await __for_body__652(__elements__651[__iter__650]));
                                            if(__BREAK__FLAG__) {
                                                 __array__653.pop();
                                                break;
                                                
                                            }
                                        }return __array__653;
                                         
                                    })()
                                } else if (check_true( (declaration==="number"))) {
                                     return  await (async function() {
                                        let __for_body__656=async function(name) {
                                             return  await set_declaration(ctx,name,"type",Number)
                                        };
                                        let __array__657=[],__elements__655=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__654 in __elements__655) {
                                            __array__657.push(await __for_body__656(__elements__655[__iter__654]));
                                            if(__BREAK__FLAG__) {
                                                 __array__657.pop();
                                                break;
                                                
                                            }
                                        }return __array__657;
                                         
                                    })()
                                } else if (check_true( (declaration==="string"))) {
                                     return  await (async function() {
                                        let __for_body__660=async function(name) {
                                             return  await set_declaration(ctx,name,"type",String)
                                        };
                                        let __array__661=[],__elements__659=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__658 in __elements__659) {
                                            __array__661.push(await __for_body__660(__elements__659[__iter__658]));
                                            if(__BREAK__FLAG__) {
                                                 __array__661.pop();
                                                break;
                                                
                                            }
                                        }return __array__661;
                                         
                                    })()
                                } else if (check_true( (declaration==="boolean"))) {
                                     return  await (async function() {
                                        let __for_body__664=async function(name) {
                                             return  await set_declaration(ctx,name,"type",Boolean)
                                        };
                                        let __array__665=[],__elements__663=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__662 in __elements__663) {
                                            __array__665.push(await __for_body__664(__elements__663[__iter__662]));
                                            if(__BREAK__FLAG__) {
                                                 __array__665.pop();
                                                break;
                                                
                                            }
                                        }return __array__665;
                                         
                                    })()
                                } else if (check_true( (declaration==="regexp"))) {
                                     return  await (async function() {
                                        let __for_body__668=async function(name) {
                                             return  await set_declaration(ctx,name,"type",RegExp)
                                        };
                                        let __array__669=[],__elements__667=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__666 in __elements__667) {
                                            __array__669.push(await __for_body__668(__elements__667[__iter__666]));
                                            if(__BREAK__FLAG__) {
                                                 __array__669.pop();
                                                break;
                                                
                                            }
                                        }return __array__669;
                                         
                                    })()
                                } else if (check_true( (declaration==="object"))) {
                                     return  await (async function() {
                                        let __for_body__672=async function(name) {
                                             return  await set_declaration(ctx,name,"type",Object)
                                        };
                                        let __array__673=[],__elements__671=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__670 in __elements__671) {
                                            __array__673.push(await __for_body__672(__elements__671[__iter__670]));
                                            if(__BREAK__FLAG__) {
                                                 __array__673.pop();
                                                break;
                                                
                                            }
                                        }return __array__673;
                                         
                                    })()
                                } else if (check_true( (declaration==="optimize"))) {
                                     return  await (async function() {
                                        let __for_body__676=async function(factor) {
                                            factor=await (await Environment.get_global("each"))(factor,"name");
                                             return  await async function(){
                                                if (check_true( ((factor && factor["0"])==="safety"))) {
                                                     return await set_declaration(ctx,"__SAFETY__","level",(factor && factor["1"]))
                                                }
                                            } ()
                                        };
                                        let __array__677=[],__elements__675=await (await Environment.get_global("each"))(targeted,"val");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__674 in __elements__675) {
                                            __array__677.push(await __for_body__676(__elements__675[__iter__674]));
                                            if(__BREAK__FLAG__) {
                                                 __array__677.pop();
                                                break;
                                                
                                            }
                                        }return __array__677;
                                         
                                    })()
                                } else  {
                                    (warnings).push(("unknown declaration directive: "+declaration));
                                     return  await (await Environment.get_global("warn"))(("compiler: unknown declaration directive: "+declaration))
                                }
                            } ()
                        };
                        let __array__623=[],__elements__621=expressions;
                        let __BREAK__FLAG__=false;
                        for(let __iter__620 in __elements__621) {
                            __array__623.push(await __for_body__622(__elements__621[__iter__620]));
                            if(__BREAK__FLAG__) {
                                 __array__623.pop();
                                break;
                                
                            }
                        }return __array__623;
                         
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
                        prefix:("compile_scoped_reference ("+((ctx && ctx["block_id"])||"-")+"):"),background:"steelblue",color:"white"
                    });
                    val=null;
                    call_type=await async function(){
                        if (check_true( await not((tokens && tokens["0"] && tokens["0"]["ref"])))) {
                             return "literal"
                        } else if (check_true( await get_ctx(ctx,(tokens && tokens["0"] && tokens["0"]["name"])))) {
                             return "local"
                        } else if (check_true( await get_lisp_ctx((tokens && tokens["0"] && tokens["0"]["name"])))) {
                             return "lisp"
                        }
                    } ();
                    check_statement=async function(stmt) {
                        if (check_true (await check_needs_wrap(stmt))){
                            if (check_true (((stmt && stmt["0"] && stmt["0"]["ctype"])==="ifblock"))){
                                  return await (async function(){
                                    let __array_op_rval__678=(preamble && preamble["2"]);
                                     if (__array_op_rval__678 instanceof Function){
                                        return await __array_op_rval__678((preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ","{"," ",stmt," ","}"," ",")","()") 
                                    } else {
                                        return[__array_op_rval__678,(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ","{"," ",stmt," ","}"," ",")","()"]
                                    }
                                })()
                            } else {
                                  return await (async function(){
                                    let __array_op_rval__679=(preamble && preamble["2"]);
                                     if (__array_op_rval__679 instanceof Function){
                                        return await __array_op_rval__679((preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ",stmt," ",")","()") 
                                    } else {
                                        return[__array_op_rval__679,(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ",stmt," ",")","()"]
                                    }
                                })()
                            }
                        } else {
                              return stmt
                        }
                    };
                    token=null;
                    await async function(){
                        if (check_true( (call_type==="lisp"))) {
                             return ref_type=await get_lisp_ctx((tokens && tokens["0"] && tokens["0"]["name"]))
                        } else if (check_true( (call_type==="local"))) {
                             return ref_type=await get_ctx(ctx,(tokens && tokens["0"] && tokens["0"]["name"]))
                        } else  {
                             return ref_type=ArgumentType
                        }
                    } ();
                    if (check_true (await (async function(){
                        let __array_op_rval__680=verbosity;
                         if (__array_op_rval__680 instanceof Function){
                            return await __array_op_rval__680(ctx) 
                        } else {
                            return[__array_op_rval__680,ctx]
                        }
                    })())){
                         await (async function(){
                            let __array_op_rval__681=sr_log;
                             if (__array_op_rval__681 instanceof Function){
                                return await __array_op_rval__681("where/what->",call_type,"/",ref_type,"for symbol: ",(tokens && tokens["0"] && tokens["0"]["name"])) 
                            } else {
                                return[__array_op_rval__681,"where/what->",call_type,"/",ref_type,"for symbol: ",(tokens && tokens["0"] && tokens["0"]["name"])]
                            }
                        })()
                    };
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
                        } else if (check_true( (ref_type===Number))) {
                             return ref_type=ArgumentType
                        } else if (check_true( (ref_type===String))) {
                             return ref_type="String"
                        } else if (check_true( (ref_type===ArgumentType))) {
                             return true
                        } else  {
                             return ref_type=await sub_type(ref_type)
                        }
                    } ();
                    rval=await async function(){
                        if (check_true( (ref_type==="AsyncFunction"))) {
                            (acc).push((preamble && preamble["0"]));
                            (acc).push(" ");
                            (acc).push(await (async function () {
                                 if (check_true ((call_type==="lisp"))){
                                      return await compile_lisp_scoped_reference((tokens && tokens["0"] && tokens["0"]["name"]),ctx)
                                } else {
                                      return (tokens && tokens["0"] && tokens["0"]["name"])
                                } 
                            })());
                            (acc).push("(");
                            await (async function(){
                                 let __test_condition__682=async function() {
                                     return  (idx<((tokens && tokens.length)-1))
                                };
                                let __body_ref__683=async function() {
                                    idx+=1;
                                    token=await (async function(){
                                        let __targ__684=tokens;
                                        if (__targ__684){
                                             return(__targ__684)[idx]
                                        } 
                                    })();
                                    stmt=await compile(token,ctx);
                                    stmt=await check_statement(stmt);
                                    (acc).push(stmt);
                                    if (check_true ((idx<((tokens && tokens.length)-1)))){
                                         return  (acc).push(",")
                                    }
                                };
                                let __BREAK__FLAG__=false;
                                while(await __test_condition__682()) {
                                    await __body_ref__683();
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
                                      return (tokens && tokens["0"] && tokens["0"]["name"])
                                } 
                            })());
                            (acc).push("(");
                            await (async function(){
                                 let __test_condition__685=async function() {
                                     return  (idx<((tokens && tokens.length)-1))
                                };
                                let __body_ref__686=async function() {
                                    idx+=1;
                                    token=await (async function(){
                                        let __targ__687=tokens;
                                        if (__targ__687){
                                             return(__targ__687)[idx]
                                        } 
                                    })();
                                    stmt=await compile(token,ctx);
                                    stmt=await check_statement(stmt);
                                    (acc).push(stmt);
                                    if (check_true ((idx<((tokens && tokens.length)-1)))){
                                         return  (acc).push(",")
                                    }
                                };
                                let __BREAK__FLAG__=false;
                                while(await __test_condition__685()) {
                                    await __body_ref__686();
                                     if(__BREAK__FLAG__) {
                                         break;
                                        
                                    }
                                } ;
                                
                            })();
                            (acc).push(")");
                             return  acc
                        } else if (check_true( ((call_type==="local")&&((ref_type==="Number")||(ref_type==="String")||(ref_type==="Boolean"))))) {
                            (acc).push((tokens && tokens["0"] && tokens["0"]["name"]));
                             return  acc
                        } else if (check_true( ((call_type==="local")&&await not((ref_type===ArgumentType))&&(tokens instanceof Array)))) {
                            val=await get_ctx_val(ctx,(tokens && tokens["0"] && tokens["0"]["name"]));
                            (acc).push(val);
                             return  acc
                        } else if (check_true( ((ref_type===ArgumentType)&&(tokens instanceof Array)))) {
                            (acc).push("[");
                            await (async function(){
                                 let __test_condition__688=async function() {
                                     return  (idx<(tokens && tokens.length))
                                };
                                let __body_ref__689=async function() {
                                    token=await (async function(){
                                        let __targ__690=tokens;
                                        if (__targ__690){
                                             return(__targ__690)[idx]
                                        } 
                                    })();
                                    (acc).push(await compile(token,ctx));
                                    if (check_true ((idx<((tokens && tokens.length)-1)))){
                                         (acc).push(",")
                                    };
                                     return  idx+=1
                                };
                                let __BREAK__FLAG__=false;
                                while(await __test_condition__688()) {
                                    await __body_ref__689();
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
                            throw new ReferenceError(("unknown reference: "+(tokens && tokens["0"] && tokens["0"]["name"])));
                            
                        } else if (check_true( (call_type==="lisp"))) {
                             return  await compile_lisp_scoped_reference((tokens && tokens["0"] && tokens["0"]["name"]),ctx)
                        } else  {
                            (acc).push((tokens && tokens["0"] && tokens["0"]["name"]));
                             return  acc
                        }
                    } ();
                    if (check_true (false)){
                         await async function(){
                            if (check_true( ((ref_type==="AsyncFunction")||(ref_type==="Function")))) {
                                 return (acc).unshift({
                                    ctype:ref_type
                                })
                            }
                        } ()
                    };
                     return  acc
                };
                compile_lisp_scoped_reference=async function(refname,ctx) {
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
                    declarations=await add(new Object(),await get_declarations(ctx,refname),await get_declaration_details(ctx,refname));
                    if (check_true ((declarations && declarations["inlined"]))){
                         refname=await sanitize_js_ref_name(refname)
                    };
                    if (check_true (((reftype==="String")&&await not((refval===undefined))))){
                         refval="text"
                    };
                     return  await async function(){
                        if (check_true( await contains_ques_((basename && basename["0"]),standard_types))) {
                             return refname
                        } else if (check_true((declarations && declarations["inlined"]))) {
                             return refname
                        } else if (check_true( await not((refval===undefined)))) {
                            has_lisp_globals=true;
                             return  [{
                                ctype:await (async function() {
                                    if (check_true ((await not(refval instanceof Function)&&(refval instanceof Object)))){
                                          return "object"
                                    } else {
                                          return refval
                                    }
                                } )()
                            },"(",(preamble && preamble["0"])," ",env_ref,"get_global","(\"",refname,"\")",")"]
                        } else  {
                            throw new ReferenceError(("unknown lisp reference: "+refname));
                            
                        }
                    } ()
                };
                standard_types=["AbortController","AbortSignal","AggregateError","Array","ArrayBuffer","Atomics","BigInt","BigInt64Array","BigUint64Array","Blob","Boolean","ByteLengthQueuingStrategy","CloseEvent","CountQueuingStrategy","Crypto","CryptoKey","CustomEvent","DOMException","DataView","Date","Error","ErrorEvent","EvalError","Event","EventTarget","File","FileReader","FinalizationRegistry","Float32Array","Float64Array","FormData","Function","Headers",Infinity,"Int16Array","Int32Array","Int8Array","Intl","JSON","Location","Map","Math","MessageChannel","MessageEvent","MessagePort","NaN","Navigator","Number","Object","Performance","PerformanceEntry","PerformanceMark","PerformanceMeasure","ProgressEvent","Promise","Proxy","RangeError","ReadableByteStreamController","ReadableStream","ReadableStreamDefaultController","ReadableStreamDefaultReader","ReferenceError","Reflect","RegExp","Request","Response","Set","SharedArrayBuffer","Storage","String","SubtleCrypto","Symbol","SyntaxError","TextDecoder","TextDecoderStream","TextEncoder","TextEncoderStream","TransformStream","TypeError","URIError","URL","URLSearchParams","Uint16Array","Uint32Array","Uint8Array","Uint8ClampedArray","WeakMap","WeakRef","WeakSet","WebAssembly","WebSocket","Window","Worker","WritableStream","WritableStreamDefaultController","WritableStreamDefaultWriter","__defineGetter__","__defineSetter__","__lookupGetter__","__lookupSetter__","_error","addEventListener","alert","atob","btoa","clearInterval","clearTimeout","close","closed","confirm","console","constructor","crypto","decodeURI","decodeURIComponent","dispatchEvent","encodeURI","encodeURIComponent","escape","eval","fetch","getParent","globalThis","hasOwnProperty","isFinite","isNaN","isPrototypeOf","localStorage","location","navigator","null","onload","onunload","parseFloat","parseInt","performance","prompt","propertyIsEnumerable","queueMicrotask","removeEventListener","self","sessionStorage","setInterval","setTimeout","structuredClone","this","toLocaleString","toString","undefined","unescape","valueOf","window","AsyncFunction","Environment","Expression","get_next_environment_id","subtype","lisp_writer","do_deferred_splice"];
                is_error=null;
                is_block_ques_=async function(tokens) {
                     return  (await contains_ques_((tokens && tokens["0"] && tokens["0"]["name"]),["do","progn"]))
                };
                is_complex_ques_=async function(tokens) {
                    let rval;
                    rval=(await (async function(){
                        let __array_op_rval__691=is_block_ques_;
                         if (__array_op_rval__691 instanceof Function){
                            return await __array_op_rval__691(tokens) 
                        } else {
                            return[__array_op_rval__691,tokens]
                        }
                    })()||(((tokens && tokens["type"])==="arr")&&await (async function(){
                        let __array_op_rval__692=is_block_ques_;
                         if (__array_op_rval__692 instanceof Function){
                            return await __array_op_rval__692((tokens && tokens["val"])) 
                        } else {
                            return[__array_op_rval__692,(tokens && tokens["val"])]
                        }
                    })())||((tokens && tokens["val"] && tokens["val"]["0"] && tokens["val"]["0"]["name"])==="if")||((tokens && tokens["val"] && tokens["val"]["0"] && tokens["val"]["0"]["name"])==="let"));
                     return  rval
                };
                is_form_ques_=async function(token) {
                     return  (((token && token["val"]) instanceof Array)||await (async function(){
                        let __array_op_rval__693=is_block_ques_;
                         if (__array_op_rval__693 instanceof Function){
                            return await __array_op_rval__693((token && token["val"])) 
                        } else {
                            return[__array_op_rval__693,(token && token["val"])]
                        }
                    })())
                };
                op_lookup=await ( async function(){
                    let __obj__694=new Object();
                    __obj__694["+"]=infix_ops;
                    __obj__694["*"]=infix_ops;
                    __obj__694["/"]=infix_ops;
                    __obj__694["-"]=infix_ops;
                    __obj__694["**"]=infix_ops;
                    __obj__694["%"]=infix_ops;
                    __obj__694["<<"]=infix_ops;
                    __obj__694[">>"]=infix_ops;
                    __obj__694["and"]=infix_ops;
                    __obj__694["or"]=infix_ops;
                    __obj__694["apply"]=compile_apply;
                    __obj__694["call"]=compile_call;
                    __obj__694["->"]=compile_call;
                    __obj__694["set_prop"]=compile_set_prop;
                    __obj__694["prop"]=compile_prop;
                    __obj__694["="]=compile_assignment;
                    __obj__694["setq"]=compile_assignment;
                    __obj__694["=="]=compile_compare;
                    __obj__694["eq"]=compile_compare;
                    __obj__694[">"]=compile_compare;
                    __obj__694["<"]=compile_compare;
                    __obj__694["<="]=compile_compare;
                    __obj__694[">="]=compile_compare;
                    __obj__694["return"]=compile_return;
                    __obj__694["new"]=compile_new;
                    __obj__694["do"]=compile_block;
                    __obj__694["progn"]=compile_block;
                    __obj__694["progl"]=async function(tokens,ctx) {
                         return  await compile_block(tokens,ctx,{
                            no_scope_boundary:true,suppress_return:"true"
                        })
                    };
                    __obj__694["break"]=compile_break;
                    __obj__694["inc"]=compile_val_mod;
                    __obj__694["dec"]=compile_val_mod;
                    __obj__694["try"]=compile_try;
                    __obj__694["throw"]=compile_throw;
                    __obj__694["let"]=compile_let;
                    __obj__694["defvar"]=compile_defvar;
                    __obj__694["while"]=compile_while;
                    __obj__694["for_each"]=compile_for_each;
                    __obj__694["if"]=compile_if;
                    __obj__694["cond"]=compile_cond;
                    __obj__694["fn"]=compile_fn;
                    __obj__694["lambda"]=compile_fn;
                    __obj__694["function*"]=async function(tokens,ctx) {
                         return  await compile_fn(tokens,ctx,{
                            generator:true
                        })
                    };
                    __obj__694["defglobal"]=compile_set_global;
                    __obj__694["list"]=compile_list;
                    __obj__694["function"]=async function(tokens,ctx) {
                         return  await compile_fn(tokens,ctx,{
                            synchronous:true
                        })
                    };
                    __obj__694["=>"]=async function(tokens,ctx) {
                         return  await compile_fn(tokens,ctx,{
                            arrow:true
                        })
                    };
                    __obj__694["yield"]=compile_yield;
                    __obj__694["for_with"]=compile_for_with;
                    __obj__694["quotem"]=compile_quotem;
                    __obj__694["quote"]=compile_quote;
                    __obj__694["quotel"]=compile_quotel;
                    __obj__694["evalq"]=compile_evalq;
                    __obj__694["eval"]=compile_eval;
                    __obj__694["jslambda"]=compile_jslambda;
                    __obj__694["javascript"]=compile_javascript;
                    __obj__694["instanceof"]=compile_instanceof;
                    __obj__694["typeof"]=compile_typeof;
                    __obj__694["unquotem"]=compile_unquotem;
                    __obj__694["debug"]=compile_debug;
                    __obj__694["declare"]=compile_declare;
                    __obj__694["import"]=compile_import;
                    __obj__694["dynamic_import"]=compile_dynamic_import;
                    return __obj__694;
                    
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
                                  return await (async function(){
                                    let __array_op_rval__695=(preamble && preamble["2"]);
                                     if (__array_op_rval__695 instanceof Function){
                                        return await __array_op_rval__695((preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ",stmt," ",")","()") 
                                    } else {
                                        return[__array_op_rval__695,(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ",stmt," ",")","()"]
                                    }
                                })()
                            }
                        } else {
                              return stmt
                        }
                    };
                    kvpair=null;
                    total_length=((tokens && tokens["val"] && tokens["val"]["length"])-1);
                    await async function(){
                        let __target_obj__696=ctx;
                        __target_obj__696["in_obj_literal"]=true;
                        return __target_obj__696;
                        
                    }();
                    await (async function() {
                        let __for_body__699=async function(token) {
                            if (check_true ((((token && token["type"])==="keyval")&&await check_invalid_js_ref((token && token.name))))){
                                has_valid_key_literals=false;
                                __BREAK__FLAG__=true;
                                return
                            }
                        };
                        let __array__700=[],__elements__698=((tokens && tokens["val"])||[]);
                        let __BREAK__FLAG__=false;
                        for(let __iter__697 in __elements__698) {
                            __array__700.push(await __for_body__699(__elements__698[__iter__697]));
                            if(__BREAK__FLAG__) {
                                 __array__700.pop();
                                break;
                                
                            }
                        }return __array__700;
                         
                    })();
                    if (check_true (has_valid_key_literals)){
                         if (check_true (((tokens && tokens["val"] && tokens["val"]["name"])==="{}"))){
                              return [{
                                ctype:"objliteral"
                            },"new Object()"]
                        } else {
                            (acc).push("{");
                            await (async function(){
                                 let __test_condition__701=async function() {
                                     return  (idx<total_length)
                                };
                                let __body_ref__702=async function() {
                                    idx+=1;
                                    kvpair=await (async function(){
                                        let __targ__703=(tokens && tokens["val"]);
                                        if (__targ__703){
                                             return(__targ__703)[idx]
                                        } 
                                    })();
                                    key=await get_val((kvpair && kvpair["val"] && kvpair["val"]["0"]),ctx);
                                    if (check_true ((((key && key.length)===1)&&(await key["charCodeAt"]()===34)))){
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
                                while(await __test_condition__701()) {
                                    await __body_ref__702();
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
                        await (async function() {
                            let __for_body__706=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__707=[],__elements__705=[{
                                ctype:"statement"
                            },(preamble && preamble["0"])," ","("," ",(preamble && preamble["1"])," ","function","()","{","let"," ",tmp_name,"=","new"," ","Object","()",";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__704 in __elements__705) {
                                __array__707.push(await __for_body__706(__elements__705[__iter__704]));
                                if(__BREAK__FLAG__) {
                                     __array__707.pop();
                                    break;
                                    
                                }
                            }return __array__707;
                             
                        })();
                        await (async function(){
                             let __test_condition__708=async function() {
                                 return  (idx<total_length)
                            };
                            let __body_ref__709=async function() {
                                idx+=1;
                                kvpair=await (async function(){
                                    let __targ__710=(tokens && tokens["val"]);
                                    if (__targ__710){
                                         return(__targ__710)[idx]
                                    } 
                                })();
                                 return  await (async function() {
                                    let __for_body__713=async function(t) {
                                         return  (acc).push(t)
                                    };
                                    let __array__714=[],__elements__712=await (async function(){
                                        let __array_op_rval__715=tmp_name;
                                         if (__array_op_rval__715 instanceof Function){
                                            return await __array_op_rval__715("[","\"",await cl_encode_string(await get_val((kvpair && kvpair["val"] && kvpair["val"]["0"]),ctx)),"\"","]","=",await compile_elem((kvpair && kvpair["val"] && kvpair["val"]["1"]),ctx),";") 
                                        } else {
                                            return[__array_op_rval__715,"[","\"",await cl_encode_string(await get_val((kvpair && kvpair["val"] && kvpair["val"]["0"]),ctx)),"\"","]","=",await compile_elem((kvpair && kvpair["val"] && kvpair["val"]["1"]),ctx),";"]
                                        }
                                    })();
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__711 in __elements__712) {
                                        __array__714.push(await __for_body__713(__elements__712[__iter__711]));
                                        if(__BREAK__FLAG__) {
                                             __array__714.pop();
                                            break;
                                            
                                        }
                                    }return __array__714;
                                     
                                })()
                            };
                            let __BREAK__FLAG__=false;
                            while(await __test_condition__708()) {
                                await __body_ref__709();
                                 if(__BREAK__FLAG__) {
                                     break;
                                    
                                }
                            } ;
                            
                        })();
                        await (async function() {
                            let __for_body__718=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__719=[],__elements__717=["return"," ",tmp_name,";","}",")","()"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__716 in __elements__717) {
                                __array__719.push(await __for_body__718(__elements__717[__iter__716]));
                                if(__BREAK__FLAG__) {
                                     __array__719.pop();
                                    break;
                                    
                                }
                            }return __array__719;
                             
                        })();
                         return  acc
                    }
                };
                is_literal_ques_=async function(val) {
                     return  (await is_number_ques_(val)||(val instanceof String || typeof val==='string')||(false===val)||(true===val))
                };
                comp_warn=await defclog({
                    prefix:"compile: [warn]:",background:"#fcffc8",color:"brown"
                });
                let compile=await __compile__5();
                ;
                compile_inner=async function(tokens,ctx,_cdepth) {
                    let operator_type;
                    let op_token;
                    let rcv;
                    let acc;
                    let preamble;
                    let tmp_name;
                    let refval;
                    let check_statement;
                    let ref;
                    operator_type=null;
                    op_token=null;
                    rcv=null;
                    _cdepth=(_cdepth||100);
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
                                  return await (async function(){
                                    let __array_op_rval__723=(preamble && preamble["2"]);
                                     if (__array_op_rval__723 instanceof Function){
                                        return await __array_op_rval__723((preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ",stmt," ",")","()") 
                                    } else {
                                        return[__array_op_rval__723,(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ",stmt," ",")","()"]
                                    }
                                })()
                            }
                        } else {
                              return stmt
                        }
                    };
                    ref=null;
                     return  await (async function(){
                        try /* TRY SIMPLE */ {
                             if (check_true ((null==ctx))){
                                await (async function(){
                                    let __array_op_rval__725=error_log;
                                     if (__array_op_rval__725 instanceof Function){
                                        return await __array_op_rval__725("compile: nil ctx: ",tokens) 
                                    } else {
                                        return[__array_op_rval__725,"compile: nil ctx: ",tokens]
                                    }
                                })();
                                throw new Error("compile: nil ctx");
                                
                            } else {
                                  return await async function(){
                                    if (check_true( (await is_number_ques_(tokens)||(tokens instanceof String || typeof tokens==='string')||(await sub_type(tokens)==="Boolean")))) {
                                         return tokens
                                    } else if (check_true( ((tokens instanceof Array)&&(tokens && tokens["0"] && tokens["0"]["ref"])&&await not((await get_ctx(ctx,(tokens && tokens["0"] && tokens["0"]["name"]))===UnknownType))&&(await (async function(){
                                        let __targ__726=op_lookup;
                                        if (__targ__726){
                                             return(__targ__726)[(tokens && tokens["0"] && tokens["0"]["name"])]
                                        } 
                                    })()||(Function===await get_ctx(ctx,(tokens && tokens["0"] && tokens["0"]["name"])))||(AsyncFunction===await get_ctx(ctx,(tokens && tokens["0"] && tokens["0"]["name"])))||("function"===typeof await (async function(){
                                        let __targ__727=(root_ctx && root_ctx["defined_lisp_globals"]);
                                        if (__targ__727){
                                             return(__targ__727)[(tokens && tokens["0"] && tokens["0"]["name"])]
                                        } 
                                    })())||await get_lisp_ctx((tokens && tokens["0"] && tokens["0"]["name"])) instanceof Function)))) {
                                        op_token=await first(tokens);
                                        operator=await (async function(){
                                            let __targ__728=op_token;
                                            if (__targ__728){
                                                 return(__targ__728)["name"]
                                            } 
                                        })();
                                        operator_type=await (async function(){
                                            let __targ__729=op_token;
                                            if (__targ__729){
                                                 return(__targ__729)["val"]
                                            } 
                                        })();
                                        ref=await (async function(){
                                            let __targ__730=op_token;
                                            if (__targ__730){
                                                 return(__targ__730)["ref"]
                                            } 
                                        })();
                                        op=await (async function(){
                                            let __targ__731=op_lookup;
                                            if (__targ__731){
                                                 return(__targ__731)[operator]
                                            } 
                                        })();
                                         return  await async function(){
                                            if (check_true(op)) {
                                                 return await (async function(){
                                                    let __array_op_rval__732=op;
                                                     if (__array_op_rval__732 instanceof Function){
                                                        return await __array_op_rval__732(tokens,ctx) 
                                                    } else {
                                                        return[__array_op_rval__732,tokens,ctx]
                                                    }
                                                })()
                                            } else if (check_true( await (async function(){
                                                let __targ__733=(Environment && Environment["inlines"]);
                                                if (__targ__733){
                                                     return(__targ__733)[operator]
                                                } 
                                            })())) {
                                                 return await compile_inline(tokens,ctx)
                                            } else  {
                                                 return await compile_scoped_reference(tokens,ctx)
                                            }
                                        } ()
                                    } else if (check_true( ((tokens instanceof Object)&&((tokens && tokens["type"])==="objlit")))) {
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
                                                let nctx;
                                                let symbolic_replacements;
                                                let compiled_values;
                                                is_operation=false;
                                                declared_type=null;
                                                nctx=null;
                                                symbolic_replacements=[];
                                                compiled_values=[];
                                                rcv=await compile((tokens && tokens["0"]),ctx,await add(_cdepth,1));
                                                if (check_true (((tokens && tokens["0"] && tokens["0"]["ref"])&&((tokens && tokens["0"] && tokens["0"]["val"]) instanceof String || typeof (tokens && tokens["0"] && tokens["0"]["val"])==='string')))){
                                                     declared_type=await get_declarations(ctx,(tokens && tokens["0"] && tokens["0"]["name"]))
                                                };
                                                await (async function() {
                                                    let __for_body__736=async function(t) {
                                                        if (check_true (await not(await get_ctx_val(ctx,"__IN_LAMBDA__")))){
                                                             await set_ctx(ctx,"__LAMBDA_STEP__",0)
                                                        };
                                                         return  (compiled_values).push(await compile(t,ctx,await add(_cdepth,1)))
                                                    };
                                                    let __array__737=[],__elements__735=await (await Environment.get_global("rest"))(tokens);
                                                    let __BREAK__FLAG__=false;
                                                    for(let __iter__734 in __elements__735) {
                                                        __array__737.push(await __for_body__736(__elements__735[__iter__734]));
                                                        if(__BREAK__FLAG__) {
                                                             __array__737.pop();
                                                            break;
                                                            
                                                        }
                                                    }return __array__737;
                                                     
                                                })();
                                                await map(async function(compiled_element,idx) {
                                                    let inst;
                                                    inst=await (async function () {
                                                         if (check_true ((((compiled_element && compiled_element["0"]) instanceof Object)&&await (async function(){
                                                            let __targ__738=(compiled_element && compiled_element["0"]);
                                                            if (__targ__738){
                                                                 return(__targ__738)["ctype"]
                                                            } 
                                                        })()))){
                                                              return await (async function(){
                                                                let __targ__739=(compiled_element && compiled_element["0"]);
                                                                if (__targ__739){
                                                                     return(__targ__739)["ctype"]
                                                                } 
                                                            })()
                                                        } else {
                                                              return null
                                                        } 
                                                    })();
                                                     return  await async function(){
                                                        if (check_true( ((inst==="block")||(inst==="letblock")))) {
                                                             return  (symbolic_replacements).push(await (async function(){
                                                                let __array_op_rval__741=idx;
                                                                 if (__array_op_rval__741 instanceof Function){
                                                                    return await __array_op_rval__741(await gen_temp_name("array_arg"),await (async function(){
                                                                        let __array_op_rval__740=(preamble && preamble["2"]);
                                                                         if (__array_op_rval__740 instanceof Function){
                                                                            return await __array_op_rval__740("(",(preamble && preamble["1"])," ","function","()"," ",compiled_element," ",")") 
                                                                        } else {
                                                                            return[__array_op_rval__740,"(",(preamble && preamble["1"])," ","function","()"," ",compiled_element," ",")"]
                                                                        }
                                                                    })()) 
                                                                } else {
                                                                    return[__array_op_rval__741,await gen_temp_name("array_arg"),await (async function(){
                                                                        let __array_op_rval__740=(preamble && preamble["2"]);
                                                                         if (__array_op_rval__740 instanceof Function){
                                                                            return await __array_op_rval__740("(",(preamble && preamble["1"])," ","function","()"," ",compiled_element," ",")") 
                                                                        } else {
                                                                            return[__array_op_rval__740,"(",(preamble && preamble["1"])," ","function","()"," ",compiled_element," ",")"]
                                                                        }
                                                                    })()]
                                                                }
                                                            })())
                                                        } else if (check_true( (inst==="ifblock"))) {
                                                             return  (symbolic_replacements).push(await (async function(){
                                                                let __array_op_rval__743=idx;
                                                                 if (__array_op_rval__743 instanceof Function){
                                                                    return await __array_op_rval__743(await gen_temp_name("array_arg"),await (async function(){
                                                                        let __array_op_rval__742=(preamble && preamble["2"]);
                                                                         if (__array_op_rval__742 instanceof Function){
                                                                            return await __array_op_rval__742("(",(preamble && preamble["1"])," ","function","()"," ","{",compiled_element,"}"," ",")") 
                                                                        } else {
                                                                            return[__array_op_rval__742,"(",(preamble && preamble["1"])," ","function","()"," ","{",compiled_element,"}"," ",")"]
                                                                        }
                                                                    })()) 
                                                                } else {
                                                                    return[__array_op_rval__743,await gen_temp_name("array_arg"),await (async function(){
                                                                        let __array_op_rval__742=(preamble && preamble["2"]);
                                                                         if (__array_op_rval__742 instanceof Function){
                                                                            return await __array_op_rval__742("(",(preamble && preamble["1"])," ","function","()"," ","{",compiled_element,"}"," ",")") 
                                                                        } else {
                                                                            return[__array_op_rval__742,"(",(preamble && preamble["1"])," ","function","()"," ","{",compiled_element,"}"," ",")"]
                                                                        }
                                                                    })()]
                                                                }
                                                            })())
                                                        }
                                                    } ()
                                                },compiled_values);
                                                await (async function() {
                                                    let __for_body__746=async function(elem) {
                                                        await (async function() {
                                                            let __for_body__750=async function(t) {
                                                                 return  (acc).push(t)
                                                            };
                                                            let __array__751=[],__elements__749=["let"," ",(elem && elem["1"]),"=",(elem && elem["2"]),";"];
                                                            let __BREAK__FLAG__=false;
                                                            for(let __iter__748 in __elements__749) {
                                                                __array__751.push(await __for_body__750(__elements__749[__iter__748]));
                                                                if(__BREAK__FLAG__) {
                                                                     __array__751.pop();
                                                                    break;
                                                                    
                                                                }
                                                            }return __array__751;
                                                             
                                                        })();
                                                         return  await compiled_values["splice"].call(compiled_values,(elem && elem["0"]),1,await (async function(){
                                                            let __array_op_rval__752=(preamble && preamble["0"]);
                                                             if (__array_op_rval__752 instanceof Function){
                                                                return await __array_op_rval__752(" ",(elem && elem["1"]),"()") 
                                                            } else {
                                                                return[__array_op_rval__752," ",(elem && elem["1"]),"()"]
                                                            }
                                                        })())
                                                    };
                                                    let __array__747=[],__elements__745=symbolic_replacements;
                                                    let __BREAK__FLAG__=false;
                                                    for(let __iter__744 in __elements__745) {
                                                        __array__747.push(await __for_body__746(__elements__745[__iter__744]));
                                                        if(__BREAK__FLAG__) {
                                                             __array__747.pop();
                                                            break;
                                                            
                                                        }
                                                    }return __array__747;
                                                     
                                                })();
                                                if (check_true (((symbolic_replacements && symbolic_replacements.length)>0))){
                                                    (acc).unshift("{");
                                                     (acc).unshift({
                                                        ctype:"block"
                                                    })
                                                };
                                                await async function(){
                                                    if (check_true( (((declared_type && declared_type["type"])===Function)||(((rcv && rcv["0"]) instanceof Object)&&(rcv && rcv["0"] && rcv["0"]["ctype"]) instanceof Function)||(((rcv && rcv["0"]) instanceof Object)&&await not(((rcv && rcv["0"]) instanceof Array))&&((rcv && rcv["0"] && rcv["0"]["ctype"]) instanceof String || typeof (rcv && rcv["0"] && rcv["0"]["ctype"])==='string')&&await contains_ques_("unction",(rcv && rcv["0"] && rcv["0"]["ctype"])))))) {
                                                        is_operation=true;
                                                        await (async function() {
                                                            let __for_body__755=async function(t) {
                                                                 return  (acc).push(t)
                                                            };
                                                            let __array__756=[],__elements__754=["(",rcv,")","("];
                                                            let __BREAK__FLAG__=false;
                                                            for(let __iter__753 in __elements__754) {
                                                                __array__756.push(await __for_body__755(__elements__754[__iter__753]));
                                                                if(__BREAK__FLAG__) {
                                                                     __array__756.pop();
                                                                    break;
                                                                    
                                                                }
                                                            }return __array__756;
                                                             
                                                        })();
                                                        await push_as_arg_list(acc,compiled_values);
                                                         return  (acc).push(")")
                                                    } else if (check_true( ((null==(declared_type && declared_type["type"]))&&(((tokens && tokens["0"] && tokens["0"]["type"])==="arg")||((rcv instanceof String || typeof rcv==='string')&&await get_declaration_details(ctx,rcv))||((rcv instanceof Array)&&((rcv && rcv["0"]) instanceof Object)&&((rcv && rcv["0"] && rcv["0"]["ctype"]) instanceof String || typeof (rcv && rcv["0"] && rcv["0"]["ctype"])==='string')&&((rcv && rcv["0"] && rcv["0"]["ctype"])&&(await not(await contains_ques_("unction",(rcv && rcv["0"] && rcv["0"]["ctype"])))&&await not(("string"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&&await not(("String"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&&await not(("nil"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&&await not(("Number"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&&await not(("undefined"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&&await not(("objliteral"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&&await not(("Boolean"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&&await not(("array"===(rcv && rcv["0"] && rcv["0"]["ctype"])))))))))) {
                                                        tmp_name=await gen_temp_name("array_op_rval");
                                                        if (check_true ((((rcv && rcv["0"]) instanceof Object)&&((rcv && rcv["0"] && rcv["0"]["ctype"]) instanceof String || typeof (rcv && rcv["0"] && rcv["0"]["ctype"])==='string')&&await contains_ques_("block",((rcv && rcv["0"] && rcv["0"]["ctype"])||""))))){
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
                                                            let __for_body__759=async function(t) {
                                                                 return  (acc).push(t)
                                                            };
                                                            let __array__760=[],__elements__758=await (async function(){
                                                                let __array_op_rval__761=(preamble && preamble["0"]);
                                                                 if (__array_op_rval__761 instanceof Function){
                                                                    return await __array_op_rval__761(" ","(",(preamble && preamble["1"])," ","function","()","{","let"," ",tmp_name,"=",rcv,";"," ","if"," ","(",tmp_name," ","instanceof"," ","Function",")","{","return"," ",(preamble && preamble["0"])," ",tmp_name,"(") 
                                                                } else {
                                                                    return[__array_op_rval__761," ","(",(preamble && preamble["1"])," ","function","()","{","let"," ",tmp_name,"=",rcv,";"," ","if"," ","(",tmp_name," ","instanceof"," ","Function",")","{","return"," ",(preamble && preamble["0"])," ",tmp_name,"("]
                                                                }
                                                            })();
                                                            let __BREAK__FLAG__=false;
                                                            for(let __iter__757 in __elements__758) {
                                                                __array__760.push(await __for_body__759(__elements__758[__iter__757]));
                                                                if(__BREAK__FLAG__) {
                                                                     __array__760.pop();
                                                                    break;
                                                                    
                                                                }
                                                            }return __array__760;
                                                             
                                                        })();
                                                        await push_as_arg_list(acc,compiled_values);
                                                        await (async function() {
                                                            let __for_body__764=async function(t) {
                                                                 return  (acc).push(t)
                                                            };
                                                            let __array__765=[],__elements__763=[")"," ","}"," ","else"," ","{","return","[",tmp_name];
                                                            let __BREAK__FLAG__=false;
                                                            for(let __iter__762 in __elements__763) {
                                                                __array__765.push(await __for_body__764(__elements__763[__iter__762]));
                                                                if(__BREAK__FLAG__) {
                                                                     __array__765.pop();
                                                                    break;
                                                                    
                                                                }
                                                            }return __array__765;
                                                             
                                                        })();
                                                        if (check_true ((await length(await (await Environment.get_global("rest"))(tokens))>0))){
                                                            (acc).push(",");
                                                             await push_as_arg_list(acc,compiled_values)
                                                        };
                                                         return  await (async function() {
                                                            let __for_body__768=async function(t) {
                                                                 return  (acc).push(t)
                                                            };
                                                            let __array__769=[],__elements__767=["]","}","}",")","()"];
                                                            let __BREAK__FLAG__=false;
                                                            for(let __iter__766 in __elements__767) {
                                                                __array__769.push(await __for_body__768(__elements__767[__iter__766]));
                                                                if(__BREAK__FLAG__) {
                                                                     __array__769.pop();
                                                                    break;
                                                                    
                                                                }
                                                            }return __array__769;
                                                             
                                                        })()
                                                    } else  {
                                                        if (check_true (((symbolic_replacements && symbolic_replacements.length)>0))){
                                                            (acc).push("return");
                                                             (acc).push(" ")
                                                        };
                                                        (acc).push("[");
                                                        rcv=await check_statement(rcv);
                                                        (acc).push(rcv);
                                                        if (check_true ((await length(await (await Environment.get_global("rest"))(tokens))>0))){
                                                            (acc).push(",");
                                                             await push_as_arg_list(acc,compiled_values)
                                                        };
                                                         return  (acc).push("]")
                                                    }
                                                } ();
                                                if (check_true (((symbolic_replacements && symbolic_replacements.length)>0))){
                                                     (acc).push("}")
                                                };
                                                 return  acc
                                            }
                                        } ()
                                    } else if (check_true( ((tokens instanceof Object)&&((tokens && tokens["val"]) instanceof Array)&&(tokens && tokens["type"])))) {
                                        await async function(){
                                            let __target_obj__770=ctx;
                                            __target_obj__770["source"]=(tokens && tokens["source"]);
                                            return __target_obj__770;
                                            
                                        }();
                                        rcv=await compile((tokens && tokens["val"]),ctx,await add(_cdepth,1));
                                         return  rcv
                                    } else if (check_true( (((tokens instanceof Object)&&await check_true((tokens && tokens["val"]))&&(tokens && tokens["type"]))||((tokens && tokens["type"])==="literal")||((tokens && tokens["type"])==="arg")||((tokens && tokens["type"])==="null")))) {
                                        let snt_name=null;
                                        ;
                                        let snt_value=null;
                                        ;
                                         return  await async function(){
                                            if (check_true( (await not((tokens && tokens["ref"]))&&((tokens && tokens["type"])==="arr")))) {
                                                 return await compile((tokens && tokens["val"]),ctx,await add(_cdepth,1))
                                            } else if (check_true( (((tokens && tokens["type"])==="null")||(((tokens && tokens["type"])==="literal")&&((tokens && tokens.name)==="null")&&(tokens && tokens["ref"]))))) {
                                                 return [{
                                                    ctype:"nil"
                                                },"null"]
                                            } else if (check_true( (((tokens && tokens["type"])==="literal")&&((tokens && tokens.name)==="undefined")&&(tokens && tokens["ref"])))) {
                                                 return [{
                                                    ctype:"undefined"
                                                },"undefined"]
                                            } else if (check_true( await not((tokens && tokens["ref"])))) {
                                                 if (check_true ((((tokens && tokens["type"])==="literal")&&((tokens && tokens["val"]) instanceof String || typeof (tokens && tokens["val"])==='string')))){
                                                     return  [{
                                                        ctype:"string"
                                                    },("\""+await cl_encode_string((tokens && tokens["val"]))+"\"")]
                                                } else {
                                                      return [{
                                                        ctype:await sub_type((tokens && tokens["val"]))
                                                    },(tokens && tokens["val"])]
                                                }
                                            } else if (check_true( ((tokens && tokens["ref"])&&(opts && opts["root_environment"])))) {
                                                 return  await (await Environment.get_global("path_to_js_syntax"))((await sanitize_js_ref_name((tokens && tokens.name))).split("."))
                                            } else if (check_true( ((tokens && tokens["ref"])&&await (async function(){
                                                let __targ__771=op_lookup;
                                                if (__targ__771){
                                                     return(__targ__771)[(tokens && tokens.name)]
                                                } 
                                            })()))) {
                                                 return (tokens && tokens.name)
                                            } else if (check_true( ((tokens && tokens["ref"])&&await (async function ()  {
                                                snt_name=await sanitize_js_ref_name((tokens && tokens.name));
                                                snt_value=await get_ctx(ctx,snt_name);
                                                 return  (snt_value||(0===snt_value)||(false===snt_value))
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
                                                 return await compile_lisp_scoped_reference((tokens && tokens.name),ctx)
                                            } else  {
                                                throw new ReferenceError(("compile: unknown reference: "+(tokens && tokens.name)));
                                                
                                            }
                                        } ()
                                    } else  {
                                        throw new SyntaxError("compile passed invalid compilation structure");
                                        
                                    }
                                } ()
                            } 
                        } catch(__exception__724) {
                              if (__exception__724 instanceof Error) {
                                 let e=__exception__724;
                                 {
                                    is_error={
                                        error:(e && e.name),message:(e && e.message),form:await source_from_tokens(tokens,expanded_tree),parent_forms:await source_from_tokens(tokens,expanded_tree,true),invalid:true
                                    };
                                    if (check_true (await not((e && e["handled"])))){
                                          return (errors).push(await clone(is_error))
                                    }
                                }
                            } 
                        }
                    })()
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
                assemble_output=async function(js_tree) {
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
                            let __for_body__774=async function(spacer) {
                                 return  (text).push(spacer)
                            };
                            let __array__775=[],__elements__773=format_depth;
                            let __BREAK__FLAG__=false;
                            for(let __iter__772 in __elements__773) {
                                __array__775.push(await __for_body__774(__elements__773[__iter__772]));
                                if(__BREAK__FLAG__) {
                                     __array__775.pop();
                                    break;
                                    
                                }
                            }return __array__775;
                             
                        })()
                    };
                    process_output_token=async function(t) {
                        escaped=await Math.max(0,(escaped-1));
                         return  await async function(){
                            if (check_true( ((t==="\"")&&(escaped===0)&&in_quotes))) {
                                in_quotes=false;
                                 return  (text).push(t)
                            } else if (check_true( ((t==="\"")&&(escaped===0)))) {
                                in_quotes=true;
                                 return  (text).push(t)
                            } else if (check_true( (t===escape_char))) {
                                (escaped===2);
                                 return  (text).push(t)
                            } else if (check_true( (await not(in_quotes)&&(t==="{")))) {
                                (text).push(t);
                                (format_depth).push("    ");
                                 return  await insert_indent()
                            } else if (check_true( (await not(in_quotes)&&await starts_with_ques_("}",t)))) {
                                (format_depth).pop();
                                await insert_indent();
                                 return  (text).push(t)
                            } else if (check_true( (await not(in_quotes)&&(t===";")))) {
                                (text).push(t);
                                 return  await insert_indent()
                            } else if (check_true( (false&&await not(in_quotes)&&await starts_with_ques_("/*",t)))) {
                                (text).push(t);
                                 return  await insert_indent()
                            } else  {
                                 return  (text).push(t)
                            }
                        } ()
                    };
                    assemble=async function(js_tokens) {
                         return  await (async function() {
                            let __for_body__778=async function(t) {
                                 return  await async function(){
                                    if (check_true( (t instanceof Array))) {
                                         return  await assemble(t)
                                    } else if (check_true( (t instanceof Object))) {
                                        if (check_true (((t && t["comment"])&&(opts && opts["include_source"])))){
                                            (text).push(("/* "+(t && t["comment"])+" */"));
                                             return  await insert_indent()
                                        }
                                    } else  {
                                        if (check_true ((opts && opts["formatted_output"]))){
                                              return await process_output_token(t)
                                        } else {
                                              return (text).push(t)
                                        }
                                    }
                                } ()
                            };
                            let __array__779=[],__elements__777=js_tokens;
                            let __BREAK__FLAG__=false;
                            for(let __iter__776 in __elements__777) {
                                __array__779.push(await __for_body__778(__elements__777[__iter__776]));
                                if(__BREAK__FLAG__) {
                                     __array__779.pop();
                                    break;
                                    
                                }
                            }return __array__779;
                             
                        })()
                    };
                    {
                        await assemble(await flatten(await (async function(){
                            let __array_op_rval__780=js_tree;
                             if (__array_op_rval__780 instanceof Function){
                                return await __array_op_rval__780() 
                            } else {
                                return[__array_op_rval__780]
                            }
                        })()));
                         return  (text).join("")
                    }
                };
                ;
                if (check_true ((null==Environment)))throw new EvalError("Compiler: No environment passed in options.");
                ;
                if (check_true (await Environment["get_global"].call(Environment,"__VERBOSITY__"))){
                    {
                        let verbosity_level;
                        verbosity_level=await Environment["get_global"].call(Environment,"__VERBOSITY__");
                        if (check_true ((verbosity_level>0))){
                             verbosity=check_verbosity
                        }
                    }
                };
                await set_ctx(root_ctx,break_out,false);
                await async function(){
                    let __target_obj__781=root_ctx;
                    __target_obj__781["defined_lisp_globals"]=new Object();
                    return __target_obj__781;
                    
                }();
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
                            }  catch(__exception__782) {
                                  if (__exception__782 instanceof Error) {
                                     let e=__exception__782;
                                      return is_error=e
                                } 
                            }
                        })();
                        await async function(){
                            if (check_true( (is_error instanceof SyntaxError))) {
                                (errors).push(is_error);
                                 return  is_error
                            } else if (check_true(is_error)) {
                                 return is_error
                            } else if (check_true( (null==final_token_assembly))) {
                                is_error=new EvalError("Pre-Compilation Error");
                                 return  is_error
                            } else  {
                                assembly=await compile(final_token_assembly,root_ctx,0);
                                assembly=await (await Environment.get_global("splice_in_return_a"))(assembly);
                                 return  assembly=await (await Environment.get_global("splice_in_return_b"))(assembly)
                            }
                        } ();
                        if (check_true ((opts && opts["root_environment"]))){
                             has_lisp_globals=false
                        };
                        if (check_true (((assembly && assembly["0"] && assembly["0"]["ctype"])&&(assembly && assembly["0"] && assembly["0"]["ctype"]) instanceof Function))){
                             await async function(){
                                let __target_obj__783=(assembly && assembly["0"]);
                                __target_obj__783["ctype"]=await map_value_to_ctype((assembly && assembly["0"] && assembly["0"]["ctype"]));
                                return __target_obj__783;
                                
                            }()
                        };
                        await async function(){
                            if (check_true( (await not(is_error)&&assembly&&(await first(assembly) instanceof Object)&&await (async function(){
                                let __targ__784=await first(assembly);
                                if (__targ__784){
                                     return(__targ__784)["ctype"]
                                } 
                            })()&&(await not((await (async function(){
                                let __targ__785=await first(assembly);
                                if (__targ__785){
                                     return(__targ__785)["ctype"]
                                } 
                            })() instanceof String || typeof await (async function(){
                                let __targ__785=await first(assembly);
                                if (__targ__785){
                                     return(__targ__785)["ctype"]
                                } 
                            })()==='string'))||await (async function ()  {
                                let val;
                                val=await (async function(){
                                    let __targ__786=await first(assembly);
                                    if (__targ__786){
                                         return(__targ__786)["ctype"]
                                    } 
                                })();
                                 return  (await not((val==="assignment"))&&await not(await contains_ques_("block",val))&&await not(await contains_ques_("unction",val)))
                            } )())))) {
                                 return await async function(){
                                    let __target_obj__787=(assembly && assembly["0"]);
                                    __target_obj__787["ctype"]="statement";
                                    return __target_obj__787;
                                    
                                }()
                            } else if (check_true( (assembly&&(await first(assembly) instanceof String || typeof await first(assembly)==='string')&&(await first(assembly)==="throw")))) {
                                 return assembly=[{
                                    ctype:"block"
                                },assembly]
                            } else if (check_true( (await not(is_error)&&assembly&&(await not((await first(assembly) instanceof Object))||await not(await (async function(){
                                let __targ__788=await first(assembly);
                                if (__targ__788){
                                     return(__targ__788)["ctype"]
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
                        if (check_true ((opts && opts["root_environment"]))){
                             has_lisp_globals=false
                        };
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
                if (check_true ((opts && opts["error_report"]))){
                     await (async function(){
                        let __array_op_rval__789=(opts && opts["error_report"]);
                         if (__array_op_rval__789 instanceof Function){
                            return await __array_op_rval__789({
                                errors:errors,warnings:warnings
                            }) 
                        } else {
                            return[__array_op_rval__789,{
                                errors:errors,warnings:warnings
                            }]
                        }
                    })()
                };
                 return  output
            }
        }
    }
})} 
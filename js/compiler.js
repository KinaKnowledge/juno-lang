// Source: compiler.lisp  
// Build Time: 2022-06-20 12:46:17
// Version: 2022.06.20.12.46
export const DLISP_ENV_VERSION='2022.06.20.12.46';




var { get_next_environment_id, check_true, get_outside_global, subtype, lisp_writer, clone, LispSyntaxError } = await import("./lisp_writer.js");
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
            let sub_type=function subtype(value) {  if (value === null) return "null";  else if (value === undefined) return "undefined";  else if (value instanceof Array) return "array";  else if (value.constructor && value.constructor!=null && value.constructor.name!=='Object') {    return value.constructor.name;  }  return typeof value;};
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
            let subtype=function subtype(value) {  if (value === null) return "null";  else if (value === undefined) return "undefined";  else if (value instanceof Array) return "array";  else if (value.constructor && value.constructor!=null && value.constructor.name!=='Object') {    return value.constructor.name;  }  return typeof value;};
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
                                let __targ__721=(rval && rval["0"]);
                                if (__targ__721){
                                     return(__targ__721)["ctype"]
                                } 
                            })()))){
                                 true
                            } else {
                                await (async function(){
                                    let __array_op_rval__722=comp_warn;
                                     if (__array_op_rval__722 instanceof Function){
                                        return await __array_op_rval__722("<-",(_cdepth||"-"),"unknown/undeclared type returned: ",await (await Environment.get_global("as_lisp"))(rval)) 
                                    } else {
                                        return[__array_op_rval__722,"<-",(_cdepth||"-"),"unknown/undeclared type returned: ",await (await Environment.get_global("as_lisp"))(rval)]
                                    }
                                })();
                                 await (async function(){
                                    let __array_op_rval__723=comp_warn;
                                     if (__array_op_rval__723 instanceof Function){
                                        return await __array_op_rval__723("  ",(_cdepth||"-"),"for given: ",await source_from_tokens(tokens,expanded_tree)) 
                                    } else {
                                        return[__array_op_rval__723,"  ",(_cdepth||"-"),"for given: ",await source_from_tokens(tokens,expanded_tree)]
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
                    if (check_true (((args instanceof Array)&&await not(_suppress_comptime_eval)))){
                        args=await compile_time_eval(ctx,args,_path);
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
                            })(),ctx,_path,true))
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
                compile_time_eval=async function(ctx,lisp_tree,path) {
                    if (check_true (((lisp_tree instanceof Array)&&(((lisp_tree && lisp_tree["0"]) instanceof String || typeof (lisp_tree && lisp_tree["0"])==='string')&&(await length((lisp_tree && lisp_tree["0"]))>2)&&await starts_with_ques_("=:",(lisp_tree && lisp_tree["0"])))&&await (await Environment.get_global("resolve_path"))(["definitions",await (lisp_tree && lisp_tree["0"])["substr"].call((lisp_tree && lisp_tree["0"]),2),"eval_when","compile_time"],Environment)))){
                        let ntree;
                        let precompile_function;
                        ntree=null;
                        precompile_function=await Environment["get_global"].call(Environment,await (lisp_tree && lisp_tree["0"])["substr"].call((lisp_tree && lisp_tree["0"]),2));
                        if (check_true (await verbosity(ctx))){
                             await (async function(){
                                let __array_op_rval__71=comp_time_log;
                                 if (__array_op_rval__71 instanceof Function){
                                    return await __array_op_rval__71(path,"->",await (lisp_tree && lisp_tree["0"])["substr"].call((lisp_tree && lisp_tree["0"]),2),lisp_tree,"to function: ",await lisp_tree["slice"].call(lisp_tree,1)) 
                                } else {
                                    return[__array_op_rval__71,path,"->",await (lisp_tree && lisp_tree["0"])["substr"].call((lisp_tree && lisp_tree["0"]),2),lisp_tree,"to function: ",await lisp_tree["slice"].call(lisp_tree,1)]
                                }
                            })()
                        };
                        await (async function(){
                            try /* TRY SIMPLE */ {
                                  return ntree=await (async function(){
                                    let __apply_args__73=await lisp_tree["slice"].call(lisp_tree,1);
                                    return ( precompile_function).apply(this,__apply_args__73)
                                })() 
                            } catch(__exception__72) {
                                  if (__exception__72 instanceof Error) {
                                     let e=__exception__72;
                                     {
                                        await async function(){
                                            let __target_obj__75=e;
                                            __target_obj__75["handled"]=true;
                                            return __target_obj__75;
                                            
                                        }();
                                        (errors).push({
                                            error:(e && e.name),message:(e && e.message),form:await source_chain([0],await (async function(){
                                                let __array_op_rval__76=lisp_tree;
                                                 if (__array_op_rval__76 instanceof Function){
                                                    return await __array_op_rval__76() 
                                                } else {
                                                    return[__array_op_rval__76]
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
                                 ntree=await compile_time_eval(ctx,ntree,path)
                            };
                            if (check_true (await verbosity(ctx))){
                                 await (async function(){
                                    let __array_op_rval__77=comp_time_log;
                                     if (__array_op_rval__77 instanceof Function){
                                        return await __array_op_rval__77(await (lisp_tree && lisp_tree["0"])["substr"].call((lisp_tree && lisp_tree["0"]),2),"<- lisp: ",await (await Environment.get_global("as_lisp"))(ntree)) 
                                    } else {
                                        return[__array_op_rval__77,await (lisp_tree && lisp_tree["0"])["substr"].call((lisp_tree && lisp_tree["0"]),2),"<- lisp: ",await (await Environment.get_global("as_lisp"))(ntree)]
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
                        let __targ__78=await first(tokens);
                        if (__targ__78){
                             return(__targ__78)["name"]
                        } 
                    })();
                    math_op=(await (async function(){
                        let __targ__79=op_translation;
                        if (__targ__79){
                             return(__targ__79)[math_op_a]
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
                            let __target_obj__80=tokens;
                            __target_obj__80[0]={
                                type:"function",val:await add("=:","add"),name:"add",ref:true
                            };
                            return __target_obj__80;
                            
                        }();
                        stmts=await compile(tokens,ctx);
                        stmts=await wrap_assignment_value(stmts,ctx);
                         return  stmts
                    } else {
                        (acc).push("(");
                        await (async function(){
                             let __test_condition__81=async function() {
                                 return  (idx<((tokens && tokens.length)-1))
                            };
                            let __body_ref__82=async function() {
                                idx+=1;
                                token=await (async function(){
                                    let __targ__83=tokens;
                                    if (__targ__83){
                                         return(__targ__83)[idx]
                                    } 
                                })();
                                await add_operand();
                                 return  (acc).push(await wrap_assignment_value(await compile(token,ctx),ctx))
                            };
                            let __BREAK__FLAG__=false;
                            while(await __test_condition__81()) {
                                await __body_ref__82();
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
                        let __array_op_rval__84=is_complex_ques_;
                         if (__array_op_rval__84 instanceof Function){
                            return await __array_op_rval__84((token && token["val"])) 
                        } else {
                            return[__array_op_rval__84,(token && token["val"])]
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
                        let __for_body__87=async function(t) {
                             return  (wrapper).push(t)
                        };
                        let __array__88=[],__elements__86=await (async function(){
                            let __array_op_rval__89=(preamble && preamble["0"]);
                             if (__array_op_rval__89 instanceof Function){
                                return await __array_op_rval__89(" ",(preamble && preamble["1"])," ",(preamble && preamble["3"]),"function","()","{","let"," ",target_reference,"=",target,";") 
                            } else {
                                return[__array_op_rval__89," ",(preamble && preamble["1"])," ",(preamble && preamble["3"]),"function","()","{","let"," ",target_reference,"=",target,";"]
                            }
                        })();
                        let __BREAK__FLAG__=false;
                        for(let __iter__85 in __elements__86) {
                            __array__88.push(await __for_body__87(__elements__86[__iter__85]));
                            if(__BREAK__FLAG__) {
                                 __array__88.pop();
                                break;
                                
                            }
                        }return __array__88;
                         
                    })();
                    await (async function(){
                         let __test_condition__90=async function() {
                             return  (idx<((tokens && tokens.length)-1))
                        };
                        let __body_ref__91=async function() {
                            idx+=1;
                            (acc).push(target_reference);
                            token=await (async function(){
                                let __targ__92=tokens;
                                if (__targ__92){
                                     return(__targ__92)[idx]
                                } 
                            })();
                            (acc).push("[");
                            stmt=await wrap_assignment_value(await compile(token,ctx),ctx);
                            (acc).push(stmt);
                            (acc).push("]");
                            idx+=1;
                            (acc).push("=");
                            token=await (async function(){
                                let __targ__93=tokens;
                                if (__targ__93){
                                     return(__targ__93)[idx]
                                } 
                            })();
                            if (check_true ((null==token)))throw new Error("set_prop: odd number of arguments");
                            ;
                            stmt=await wrap_assignment_value(await compile(token,ctx),ctx);
                            (acc).push(stmt);
                             return  (acc).push(";")
                        };
                        let __BREAK__FLAG__=false;
                        while(await __test_condition__90()) {
                            await __body_ref__91();
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
                        let __targ__94=tokens;
                        if (__targ__94){
                             return(__targ__94)[2]
                        } 
                    })(),ctx),ctx);
                    if (check_true ((await safety_level(ctx)>1))){
                        target_val=await gen_temp_name("targ");
                         return  await (async function(){
                            let __array_op_rval__95=(preamble && preamble["0"]);
                             if (__array_op_rval__95 instanceof Function){
                                return await __array_op_rval__95(" ","(",(preamble && preamble["1"])," ","function","()","{","let"," ",target_val,"=",target,";","if"," ","(",target_val,")","{"," ","return","(",target_val,")","[",idx_key,"]","}"," ","}",")","()") 
                            } else {
                                return[__array_op_rval__95," ","(",(preamble && preamble["1"])," ","function","()","{","let"," ",target_val,"=",target,";","if"," ","(",target_val,")","{"," ","return","(",target_val,")","[",idx_key,"]","}"," ","}",")","()"]
                            }
                        })()
                    } else {
                          return ["(",target,")","[",idx_key,"]"]
                    }
                };
                compile_elem=async function(token,ctx) {
                    let rval;
                    let __check_needs_wrap__96= async function(){
                        return async function(stmts) {
                            let fst;
                            fst=(((stmts instanceof Array)&&await first(stmts)&&(await first(stmts) instanceof Object)&&await (async function(){
                                let __targ__97=await first(stmts);
                                if (__targ__97){
                                     return(__targ__97)["ctype"]
                                } 
                            })()&&await async function(){
                                if (check_true( (await (async function(){
                                    let __targ__98=await first(stmts);
                                    if (__targ__98){
                                         return(__targ__98)["ctype"]
                                    } 
                                })() instanceof String || typeof await (async function(){
                                    let __targ__98=await first(stmts);
                                    if (__targ__98){
                                         return(__targ__98)["ctype"]
                                    } 
                                })()==='string'))) {
                                     return await (async function(){
                                        let __targ__99=await first(stmts);
                                        if (__targ__99){
                                             return(__targ__99)["ctype"]
                                        } 
                                    })()
                                } else  {
                                     return await sub_type(await (async function(){
                                        let __targ__100=await first(stmts);
                                        if (__targ__100){
                                             return(__targ__100)["ctype"]
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
                        let check_needs_wrap=await __check_needs_wrap__96();
                        ;
                        if (check_true (await (async function(){
                            let __array_op_rval__101=is_complex_ques_;
                             if (__array_op_rval__101 instanceof Function){
                                return await __array_op_rval__101((token && token["val"])) 
                            } else {
                                return[__array_op_rval__101,(token && token["val"])]
                            }
                        })())){
                             rval=await compile_wrapper_fn(token,ctx)
                        } else {
                             rval=await compile(token,ctx)
                        };
                        if (check_true (await not((rval instanceof Array)))){
                             rval=await (async function(){
                                let __array_op_rval__102=rval;
                                 if (__array_op_rval__102 instanceof Function){
                                    return await __array_op_rval__102() 
                                } else {
                                    return[__array_op_rval__102]
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
                        let __for_body__105=async function(token) {
                            stmt=await wrap_assignment_value(await compile(token,ctx),ctx);
                             return  (args).push(stmt)
                        };
                        let __array__106=[],__elements__104=await tokens["slice"].call(tokens,1);
                        let __BREAK__FLAG__=false;
                        for(let __iter__103 in __elements__104) {
                            __array__106.push(await __for_body__105(__elements__104[__iter__103]));
                            if(__BREAK__FLAG__) {
                                 __array__106.pop();
                                break;
                                
                            }
                        }return __array__106;
                         
                    })();
                    if (check_true (await verbosity())){
                         await (async function(){
                            let __array_op_rval__107=inline_log;
                             if (__array_op_rval__107 instanceof Function){
                                return await __array_op_rval__107("args: ",args) 
                            } else {
                                return[__array_op_rval__107,"args: ",args]
                            }
                        })()
                    };
                    if (check_true (await (async function(){
                        let __targ__108=(Environment && Environment["inlines"]);
                        if (__targ__108){
                             return(__targ__108)[(tokens && tokens["0"] && tokens["0"]["name"])]
                        } 
                    })())){
                        inline_fn=await (async function(){
                            let __targ__109=(Environment && Environment["inlines"]);
                            if (__targ__109){
                                 return(__targ__109)[(tokens && tokens["0"] && tokens["0"]["name"])]
                            } 
                        })();
                         rval=await (async function(){
                            let __array_op_rval__110=inline_fn;
                             if (__array_op_rval__110 instanceof Function){
                                return await __array_op_rval__110(args) 
                            } else {
                                return[__array_op_rval__110,args]
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
                        let __array_op_rval__111=place;
                         if (__array_op_rval__111 instanceof Function){
                            return await __array_op_rval__111(".push","(",thing,")") 
                        } else {
                            return[__array_op_rval__111,".push","(",thing,")"]
                        }
                    })()
                };
                compile_list=async function(tokens,ctx) {
                    let acc;
                    let compiled_values;
                    acc=["["];
                    compiled_values=[];
                    await (async function() {
                        let __for_body__114=async function(t) {
                             return  (compiled_values).push(await wrap_assignment_value(await compile(t,ctx),ctx))
                        };
                        let __array__115=[],__elements__113=await tokens["slice"].call(tokens,1);
                        let __BREAK__FLAG__=false;
                        for(let __iter__112 in __elements__113) {
                            __array__115.push(await __for_body__114(__elements__113[__iter__112]));
                            if(__BREAK__FLAG__) {
                                 __array__115.pop();
                                break;
                                
                            }
                        }return __array__115;
                         
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
                          return ["typeof"," ",await compile((tokens && tokens["1"]),ctx)]
                    } else {
                          return ["typeof"," ",await compile_elem((tokens && tokens["1"]),ctx)]
                    }
                };
                compile_instanceof=async function(tokens,ctx) {
                    let acc;
                    acc=[];
                    if (check_true (((tokens instanceof Array)&&((tokens && tokens.length)===3)))){
                        let __array_arg__118=(async function() {
                            if (check_true (await (async function(){
                                let __array_op_rval__116=is_complex_ques_;
                                 if (__array_op_rval__116 instanceof Function){
                                    return await __array_op_rval__116((tokens && tokens["1"])) 
                                } else {
                                    return[__array_op_rval__116,(tokens && tokens["1"])]
                                }
                            })())){
                                  return await compile_wrapper_fn((tokens && tokens["1"]),ctx)
                            } else {
                                  return await compile((tokens && tokens["1"]),ctx)
                            }
                        } );
                        let __array_arg__119=(async function() {
                            if (check_true (await (async function(){
                                let __array_op_rval__117=is_complex_ques_;
                                 if (__array_op_rval__117 instanceof Function){
                                    return await __array_op_rval__117((tokens && tokens["1"])) 
                                } else {
                                    return[__array_op_rval__117,(tokens && tokens["1"])]
                                }
                            })())){
                                  return await compile_wrapper_fn((tokens && tokens["2"]),ctx)
                            } else {
                                  return await compile((tokens && tokens["2"]),ctx)
                            }
                        } );
                        return ["(",await __array_arg__118()," ","instanceof"," ",await __array_arg__119(),")"]
                    } else throw new SyntaxError("instanceof requires 2 arguments");
                    
                };
                compile_compare=async function(tokens,ctx) {
                    let acc;
                    let ops;
                    let __operator__120= async function(){
                        return await (async function(){
                            let __targ__123=ops;
                            if (__targ__123){
                                 return(__targ__123)[await (async function(){
                                    let __targ__122=await first(tokens);
                                    if (__targ__122){
                                         return(__targ__122)["name"]
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
                            let __obj__121=new Object();
                            __obj__121["eq"]="==";
                            __obj__121["=="]="===";
                            __obj__121["<"]="<";
                            __obj__121[">"]=">";
                            __obj__121["gt"]=">";
                            __obj__121["lt"]="<";
                            __obj__121["<="]="<=";
                            __obj__121[">="]=">=";
                            return __obj__121;
                            
                        })();
                        let operator=await __operator__120();
                        ;
                        left=await (async function(){
                            let __targ__124=tokens;
                            if (__targ__124){
                                 return(__targ__124)[1]
                            } 
                        })();
                        right=await (async function(){
                            let __targ__125=tokens;
                            if (__targ__125){
                                 return(__targ__125)[2]
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
                        let __targ__126=await first(tokens);
                        if (__targ__126){
                             return(__targ__126)["name"]
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
                        let __target_obj__127=ctx;
                        __target_obj__127["in_assignment"]=true;
                        return __target_obj__127;
                        
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
                            let __for_body__130=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__131=[],__elements__129=[{
                                ctype:"statement"
                            },(preamble && preamble["0"])," ","Environment",".","set_global","(","\"",target,"\"",",",assignment_value,")"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__128 in __elements__129) {
                                __array__131.push(await __for_body__130(__elements__129[__iter__128]));
                                if(__BREAK__FLAG__) {
                                     __array__131.pop();
                                    break;
                                    
                                }
                            }return __array__131;
                             
                        })()
                    };
                    await async function(){
                        let __target_obj__132=ctx;
                        __target_obj__132["in_assignment"]=false;
                        return __target_obj__132;
                        
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
                                        let __targ__133=await first(flattened);
                                        if (__targ__133){
                                             return(__targ__133)["ctype"]
                                        } 
                                    })()))) {
                                         return inst=await first(flattened)
                                    } else if (check_true( ((await first(flattened) instanceof String || typeof await first(flattened)==='string')&&await starts_with_ques_("/*",await first(flattened))&&(await second(flattened) instanceof Object)&&await (async function(){
                                        let __targ__134=await second(flattened);
                                        if (__targ__134){
                                             return(__targ__134)["ctype"]
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
                            let __tokens__135= async function(){
                                return null
                            };
                            let stmt;
                            let num_non_return_statements;
                            {
                                idx=0;
                                rval=null;
                                let tokens=await __tokens__135();
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
                                     let __test_condition__136=async function() {
                                         return  (idx<num_non_return_statements)
                                    };
                                    let __body_ref__137=async function() {
                                        idx+=1;
                                        if (check_true (await verbosity(ctx))){
                                            await console.log("");
                                             await (async function(){
                                                let __array_op_rval__139=top_level_log;
                                                 if (__array_op_rval__139 instanceof Function){
                                                    return await __array_op_rval__139((""+idx+"/"+num_non_return_statements),"->",await (await Environment.get_global("as_lisp"))(await (async function(){
                                                        let __targ__138=lisp_tree;
                                                        if (__targ__138){
                                                             return(__targ__138)[idx]
                                                        } 
                                                    })())) 
                                                } else {
                                                    return[__array_op_rval__139,(""+idx+"/"+num_non_return_statements),"->",await (await Environment.get_global("as_lisp"))(await (async function(){
                                                        let __targ__138=lisp_tree;
                                                        if (__targ__138){
                                                             return(__targ__138)[idx]
                                                        } 
                                                    })())]
                                                }
                                            })()
                                        };
                                        tokens=await tokenize(await (async function(){
                                            let __targ__140=lisp_tree;
                                            if (__targ__140){
                                                 return(__targ__140)[idx]
                                            } 
                                        })(),ctx);
                                        stmt=await compile(tokens,ctx);
                                        rval=await wrap_and_run(stmt,ctx,{
                                            bind_mode:true
                                        });
                                        if (check_true (await verbosity(ctx))){
                                            await (async function(){
                                                let __array_op_rval__141=top_level_log;
                                                 if (__array_op_rval__141 instanceof Function){
                                                    return await __array_op_rval__141((""+idx+"/"+num_non_return_statements),"compiled <- ",await (await Environment.get_global("as_lisp"))(stmt)) 
                                                } else {
                                                    return[__array_op_rval__141,(""+idx+"/"+num_non_return_statements),"compiled <- ",await (await Environment.get_global("as_lisp"))(stmt)]
                                                }
                                            })();
                                             return  await (async function(){
                                                let __array_op_rval__142=top_level_log;
                                                 if (__array_op_rval__142 instanceof Function){
                                                    return await __array_op_rval__142((""+idx+"/"+num_non_return_statements),"<-",await (await Environment.get_global("as_lisp"))(rval)) 
                                                } else {
                                                    return[__array_op_rval__142,(""+idx+"/"+num_non_return_statements),"<-",await (await Environment.get_global("as_lisp"))(rval)]
                                                }
                                            })()
                                        }
                                    };
                                    let __BREAK__FLAG__=false;
                                    while(await __test_condition__136()) {
                                        await __body_ref__137();
                                         if(__BREAK__FLAG__) {
                                             break;
                                            
                                        }
                                    } ;
                                    
                                })();
                                 return  await (async function(){
                                    let __targ__143=lisp_tree;
                                    if (__targ__143){
                                         return(__targ__143)[(idx+1)]
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
                        let __target_obj__144=ctx;
                        __target_obj__144["block_id"]=block_id;
                        return __target_obj__144;
                        
                    }();
                    if (check_true ((await get_ctx_val(ctx,"__LAMBDA_STEP__")===-1))){
                        lambda_block=true;
                         await (await Environment.get_global("setf_ctx"))(ctx,"__LAMBDA_STEP__",((tokens && tokens.length)-1))
                    };
                    if (check_true (await not((block_options && block_options["no_scope_boundary"])))){
                         (acc).push("{")
                    };
                    await (async function(){
                         let __test_condition__145=async function() {
                             return  (idx<((tokens && tokens.length)-1))
                        };
                        let __body_ref__146=async function() {
                            idx+=1;
                            token=await (async function(){
                                let __targ__147=tokens;
                                if (__targ__147){
                                     return(__targ__147)[idx]
                                } 
                            })();
                            if (check_true ((idx===((tokens && tokens.length)-1)))){
                                 await async function(){
                                    let __target_obj__148=ctx;
                                    __target_obj__148["final_block_statement"]=true;
                                    return __target_obj__148;
                                    
                                }()
                            };
                            await async function(){
                                let __target_obj__149=ctx;
                                __target_obj__149["block_step"]=((tokens && tokens.length)-1-idx);
                                return __target_obj__149;
                                
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
                                let __targ__150=await first(stmt);
                                if (__targ__150){
                                     return(__targ__150)["ctype"]
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
                        while(await __test_condition__145()) {
                            await __body_ref__146();
                             if(__BREAK__FLAG__) {
                                 break;
                                
                            }
                        } ;
                        
                    })();
                    await async function(){
                        if (check_true( (await not((block_options && block_options["suppress_return"]))&&await not((ctx && ctx["suppress_return"]))&&(await (async function(){
                            let __array_op_rval__151=needs_return_ques_;
                             if (__array_op_rval__151 instanceof Function){
                                return await __array_op_rval__151(stmts,ctx) 
                            } else {
                                return[__array_op_rval__151,stmts,ctx]
                            }
                        })()||((idx>1)&&await (async function(){
                            let __array_op_rval__152=needs_return_ques_;
                             if (__array_op_rval__152 instanceof Function){
                                return await __array_op_rval__152(stmts,ctx) 
                            } else {
                                return[__array_op_rval__152,stmts,ctx]
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
                            let __array_op_rval__153=needs_return_ques_;
                             if (__array_op_rval__153 instanceof Function){
                                return await __array_op_rval__153(stmts,ctx) 
                            } else {
                                return[__array_op_rval__153,stmts,ctx]
                            }
                        })()||((idx>1)&&await (async function(){
                            let __array_op_rval__154=needs_return_ques_;
                             if (__array_op_rval__154 instanceof Function){
                                return await __array_op_rval__154(stmts,ctx) 
                            } else {
                                return[__array_op_rval__154,stmts,ctx]
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
                    let __check_needs_wrap__155= async function(){
                        return async function(stmts) {
                            let fst;
                            fst=(((stmts instanceof Array)&&await first(stmts)&&(await first(stmts) instanceof Object)&&await (async function(){
                                let __targ__156=await first(stmts);
                                if (__targ__156){
                                     return(__targ__156)["ctype"]
                                } 
                            })()&&await async function(){
                                if (check_true( (await (async function(){
                                    let __targ__157=await first(stmts);
                                    if (__targ__157){
                                         return(__targ__157)["ctype"]
                                    } 
                                })() instanceof String || typeof await (async function(){
                                    let __targ__157=await first(stmts);
                                    if (__targ__157){
                                         return(__targ__157)["ctype"]
                                    } 
                                })()==='string'))) {
                                     return await (async function(){
                                        let __targ__158=await first(stmts);
                                        if (__targ__158){
                                             return(__targ__158)["ctype"]
                                        } 
                                    })()
                                } else  {
                                     return await sub_type(await (async function(){
                                        let __targ__159=await first(stmts);
                                        if (__targ__159){
                                             return(__targ__159)["ctype"]
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
                        let check_needs_wrap=await __check_needs_wrap__155();
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
                            let __array_arg__160=(async function() {
                                if (check_true (((ctx_details && ctx_details["is_argument"])&&((ctx_details && ctx_details["levels_up"])===1)))){
                                      return ""
                                } else {
                                      return "let "
                                }
                            } );
                            return [{
                                ctype:"assignment"
                            },await __array_arg__160(),"",target,"=",[assignment_value],";"]
                        }
                    }
                };
                get_declaration_details=async function(ctx,symname,_levels_up) {
                     return  await async function(){
                        if (check_true( (await (async function(){
                            let __targ__161=(ctx && ctx["scope"]);
                            if (__targ__161){
                                 return(__targ__161)[symname]
                            } 
                        })()&&await (async function(){
                            let __targ__162=ctx;
                            if (__targ__162){
                                 return(__targ__162)["lambda_scope"]
                            } 
                        })()))) {
                             return {
                                name:symname,is_argument:true,levels_up:(_levels_up||0),value:await (async function(){
                                    let __targ__163=(ctx && ctx["scope"]);
                                    if (__targ__163){
                                         return(__targ__163)[symname]
                                    } 
                                })(),declared_global:await (async function() {
                                    if (check_true (await (async function(){
                                        let __targ__164=(root_ctx && root_ctx["defined_lisp_globals"]);
                                        if (__targ__164){
                                             return(__targ__164)[symname]
                                        } 
                                    })())){
                                          return true
                                    } else {
                                          return false
                                    }
                                } )()
                            }
                        } else if (check_true( await (async function(){
                            let __targ__165=(ctx && ctx["scope"]);
                            if (__targ__165){
                                 return(__targ__165)[symname]
                            } 
                        })())) {
                             return {
                                name:symname,is_argument:false,levels_up:(_levels_up||0),value:await (async function(){
                                    let __targ__166=(ctx && ctx["scope"]);
                                    if (__targ__166){
                                         return(__targ__166)[symname]
                                    } 
                                })(),declarations:await get_declarations(ctx,symname),declared_global:await (async function() {
                                    if (check_true (await (async function(){
                                        let __targ__167=(root_ctx && root_ctx["defined_lisp_globals"]);
                                        if (__targ__167){
                                             return(__targ__167)[symname]
                                        } 
                                    })())){
                                          return true
                                    } else {
                                          return false
                                    }
                                } )()
                            }
                        } else if (check_true( ((await (async function(){
                            let __targ__168=ctx;
                            if (__targ__168){
                                 return(__targ__168)["parent"]
                            } 
                        })()==null)&&await (async function(){
                            let __targ__169=(root_ctx && root_ctx["defined_lisp_globals"]);
                            if (__targ__169){
                                 return(__targ__169)[symname]
                            } 
                        })()))) {
                             return {
                                name:symname,is_argument:false,levels_up:(_levels_up||0),value:await (async function(){
                                    let __targ__170=(ctx && ctx["scope"]);
                                    if (__targ__170){
                                         return(__targ__170)[symname]
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
                        let __targ__171=await first(stmts);
                        if (__targ__171){
                             return(__targ__171)["ctype"]
                        } 
                    })()&&await async function(){
                        if (check_true( (await (async function(){
                            let __targ__172=await first(stmts);
                            if (__targ__172){
                                 return(__targ__172)["ctype"]
                            } 
                        })() instanceof String || typeof await (async function(){
                            let __targ__172=await first(stmts);
                            if (__targ__172){
                                 return(__targ__172)["ctype"]
                            } 
                        })()==='string'))) {
                             return await (async function(){
                                let __targ__173=await first(stmts);
                                if (__targ__173){
                                     return(__targ__173)["ctype"]
                                } 
                            })()
                        } else  {
                             return await sub_type(await (async function(){
                                let __targ__174=await first(stmts);
                                if (__targ__174){
                                     return(__targ__174)["ctype"]
                                } 
                            })())
                        }
                    } ())||""));
                    preamble=await calling_preamble(ctx);
                     return  await async function(){
                        if (check_true( ("ifblock"===fst))) {
                             return await (async function(){
                                let __array_op_rval__175=(preamble && preamble["2"]);
                                 if (__array_op_rval__175 instanceof Function){
                                    return await __array_op_rval__175({
                                        mark:"wrap_assignment_value"
                                    },(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function"," ","()"," ","{"," ",stmts," ","}",")","()") 
                                } else {
                                    return[__array_op_rval__175,{
                                        mark:"wrap_assignment_value"
                                    },(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function"," ","()"," ","{"," ",stmts," ","}",")","()"]
                                }
                            })()
                        } else if (check_true( await contains_ques_("block",fst))) {
                             return await (async function(){
                                let __array_op_rval__176=(preamble && preamble["2"]);
                                 if (__array_op_rval__176 instanceof Function){
                                    return await __array_op_rval__176({
                                        mark:"wrap_assignment_value"
                                    },(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function"," ","()"," "," ",stmts," ",")","()") 
                                } else {
                                    return[__array_op_rval__176,{
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
                        let __target_obj__177=ctx;
                        __target_obj__177["return_last_value"]=true;
                        return __target_obj__177;
                        
                    }();
                    (acc).push("{");
                    sub_block_count+=1;
                    if (check_true (((block && block["0"] && block["0"]["val"] && block["0"]["val"]["0"] && block["0"]["val"]["0"]["name"])==="declare"))){
                        declarations_handled=true;
                         (acc).push(await compile_declare((block && block["0"] && block["0"]["val"]),ctx))
                    };
                    await (async function(){
                         let __test_condition__178=async function() {
                             return  (idx<((allocations && allocations.length)-1))
                        };
                        let __body_ref__179=async function() {
                            idx+=1;
                            alloc_set=await (async function(){
                                let __targ__181=await (async function(){
                                    let __targ__180=allocations;
                                    if (__targ__180){
                                         return(__targ__180)[idx]
                                    } 
                                })();
                                if (__targ__181){
                                     return(__targ__181)["val"]
                                } 
                            })();
                            reference_name=await clean_quoted_reference(await sanitize_js_ref_name((alloc_set && alloc_set["0"] && alloc_set["0"]["name"])));
                            ctx_details=await get_declaration_details(ctx,reference_name);
                            if (check_true (ctx_details)){
                                if (check_true ((await not((ctx_details && ctx_details["is_argument"]))&&((ctx_details && ctx_details["levels_up"])>1)))){
                                    need_sub_block=true;
                                    if (check_true (await (async function(){
                                        let __targ__182=redefinitions;
                                        if (__targ__182){
                                             return(__targ__182)[reference_name]
                                        } 
                                    })())){
                                         (await (async function(){
                                            let __targ__183=redefinitions;
                                            if (__targ__183){
                                                 return(__targ__183)[reference_name]
                                            } 
                                        })()).push(await gen_temp_name(reference_name))
                                    } else {
                                         await async function(){
                                            let __target_obj__184=redefinitions;
                                            __target_obj__184[reference_name]=[0,await gen_temp_name(reference_name)];
                                            return __target_obj__184;
                                            
                                        }()
                                    };
                                    if (check_true (((ctx_details && ctx_details["declared_global"])&&await not((ctx_details && ctx_details["is_argument"]))))){
                                         await async function(){
                                            let __target_obj__185=shadowed_globals;
                                            __target_obj__185[(alloc_set && alloc_set["0"] && alloc_set["0"]["name"])]=true;
                                            return __target_obj__185;
                                            
                                        }()
                                    }
                                }
                            };
                            if (check_true (await not((ctx_details && ctx_details["is_argument"])))){
                                 return  await set_ctx(ctx,reference_name,AsyncFunction)
                            }
                        };
                        let __BREAK__FLAG__=false;
                        while(await __test_condition__178()) {
                            await __body_ref__179();
                             if(__BREAK__FLAG__) {
                                 break;
                                
                            }
                        } ;
                        
                    })();
                    idx=-1;
                    await (async function(){
                         let __test_condition__186=async function() {
                             return  (idx<((allocations && allocations.length)-1))
                        };
                        let __body_ref__187=async function() {
                            idx+=1;
                            stmt=[];
                            alloc_set=await (async function(){
                                let __targ__189=await (async function(){
                                    let __targ__188=allocations;
                                    if (__targ__188){
                                         return(__targ__188)[idx]
                                    } 
                                })();
                                if (__targ__189){
                                     return(__targ__189)["val"]
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
                                        let __target_obj__190=ctx;
                                        __target_obj__190["in_assignment"]=true;
                                        return __target_obj__190;
                                        
                                    }();
                                    assignment_value=await compile((alloc_set && alloc_set["1"]),ctx);
                                     return  await async function(){
                                        let __target_obj__191=ctx;
                                        __target_obj__191["in_assignment"]=false;
                                        return __target_obj__191;
                                        
                                    }()
                                } else if (check_true( (((alloc_set && alloc_set["1"] && alloc_set["1"]["name"]) instanceof String || typeof (alloc_set && alloc_set["1"] && alloc_set["1"]["name"])==='string')&&await (async function(){
                                    let __targ__192=(Environment && Environment["context"] && Environment["context"]["scope"]);
                                    if (__targ__192){
                                         return(__targ__192)[(alloc_set && alloc_set["1"] && alloc_set["1"]["name"])]
                                    } 
                                })()&&await not((ctx_details && ctx_details["is_argument"]))&&await (async function(){
                                    let __targ__193=shadowed_globals;
                                    if (__targ__193){
                                         return(__targ__193)[(alloc_set && alloc_set["0"] && alloc_set["0"]["name"])]
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
                                    let __target_obj__194=block_declarations;
                                    __target_obj__194[reference_name]=true;
                                    return __target_obj__194;
                                    
                                }()
                            };
                            def_idx=null;
                            await async function(){
                                if (check_true( (await (async function(){
                                    let __targ__195=redefinitions;
                                    if (__targ__195){
                                         return(__targ__195)[reference_name]
                                    } 
                                })()&&await first(await (async function(){
                                    let __targ__196=redefinitions;
                                    if (__targ__196){
                                         return(__targ__196)[reference_name]
                                    } 
                                })())))) {
                                    def_idx=await first(await (async function(){
                                        let __targ__197=redefinitions;
                                        if (__targ__197){
                                             return(__targ__197)[reference_name]
                                        } 
                                    })());
                                    def_idx+=1;
                                    await async function(){
                                        let __target_obj__198=await (async function(){
                                            let __targ__199=redefinitions;
                                            if (__targ__199){
                                                 return(__targ__199)[reference_name]
                                            } 
                                        })();
                                        __target_obj__198[0]=def_idx;
                                        return __target_obj__198;
                                        
                                    }();
                                     return  await (async function() {
                                        let __for_body__202=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__203=[],__elements__201=["let"," ",await (async function(){
                                            let __targ__205=await (async function(){
                                                let __targ__204=redefinitions;
                                                if (__targ__204){
                                                     return(__targ__204)[reference_name]
                                                } 
                                            })();
                                            if (__targ__205){
                                                 return(__targ__205)[def_idx]
                                            } 
                                        })(),"="," ",(preamble && preamble["1"])," ","function","()","{","return"," ",assignment_value,"}",";"];
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__200 in __elements__201) {
                                            __array__203.push(await __for_body__202(__elements__201[__iter__200]));
                                            if(__BREAK__FLAG__) {
                                                 __array__203.pop();
                                                break;
                                                
                                            }
                                        }return __array__203;
                                         
                                    })()
                                } else if (check_true( await not(await (async function(){
                                    let __targ__206=block_declarations;
                                    if (__targ__206){
                                         return(__targ__206)[reference_name]
                                    } 
                                })()))) {
                                    await (async function() {
                                        let __for_body__209=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__210=[],__elements__208=["let"," ",reference_name,";"];
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__207 in __elements__208) {
                                            __array__210.push(await __for_body__209(__elements__208[__iter__207]));
                                            if(__BREAK__FLAG__) {
                                                 __array__210.pop();
                                                break;
                                                
                                            }
                                        }return __array__210;
                                         
                                    })();
                                     return  await async function(){
                                        let __target_obj__211=block_declarations;
                                        __target_obj__211[reference_name]=true;
                                        return __target_obj__211;
                                        
                                    }()
                                }
                            } ();
                            if (check_true (await not(await (async function(){
                                let __targ__212=assignments;
                                if (__targ__212){
                                     return(__targ__212)[reference_name]
                                } 
                            })()))){
                                 await async function(){
                                    let __target_obj__213=assignments;
                                    __target_obj__213[reference_name]=[];
                                    return __target_obj__213;
                                    
                                }()
                            };
                             return  (await (async function(){
                                let __targ__214=assignments;
                                if (__targ__214){
                                     return(__targ__214)[reference_name]
                                } 
                            })()).push(await (async function () {
                                 if (check_true (def_idx)){
                                      return await (async function(){
                                        let __array_op_rval__217=(preamble && preamble["0"]);
                                         if (__array_op_rval__217 instanceof Function){
                                            return await __array_op_rval__217(" ",await (async function(){
                                                let __targ__216=await (async function(){
                                                    let __targ__215=redefinitions;
                                                    if (__targ__215){
                                                         return(__targ__215)[reference_name]
                                                    } 
                                                })();
                                                if (__targ__216){
                                                     return(__targ__216)[def_idx]
                                                } 
                                            })(),"()",";") 
                                        } else {
                                            return[__array_op_rval__217," ",await (async function(){
                                                let __targ__216=await (async function(){
                                                    let __targ__215=redefinitions;
                                                    if (__targ__215){
                                                         return(__targ__215)[reference_name]
                                                    } 
                                                })();
                                                if (__targ__216){
                                                     return(__targ__216)[def_idx]
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
                        while(await __test_condition__186()) {
                            await __body_ref__187();
                             if(__BREAK__FLAG__) {
                                 break;
                                
                            }
                        } ;
                        
                    })();
                    if (check_true (need_sub_block)){
                         await (async function() {
                            let __for_body__220=async function(pset) {
                                 return  await (async function() {
                                    let __for_body__224=async function(redef) {
                                         return  (await (async function(){
                                            let __targ__226=redefinitions;
                                            if (__targ__226){
                                                 return(__targ__226)[(pset && pset["0"])]
                                            } 
                                        })()).shift()
                                    };
                                    let __array__225=[],__elements__223=(pset && pset["1"]);
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__222 in __elements__223) {
                                        __array__225.push(await __for_body__224(__elements__223[__iter__222]));
                                        if(__BREAK__FLAG__) {
                                             __array__225.pop();
                                            break;
                                            
                                        }
                                    }return __array__225;
                                     
                                })()
                            };
                            let __array__221=[],__elements__219=await (await Environment.get_global("pairs"))(redefinitions);
                            let __BREAK__FLAG__=false;
                            for(let __iter__218 in __elements__219) {
                                __array__221.push(await __for_body__220(__elements__219[__iter__218]));
                                if(__BREAK__FLAG__) {
                                     __array__221.pop();
                                    break;
                                    
                                }
                            }return __array__221;
                             
                        })()
                    };
                    if (check_true (need_sub_block)){
                        (acc).push("{");
                         sub_block_count+=1
                    };
                    idx=-1;
                    await (async function(){
                         let __test_condition__227=async function() {
                             return  (idx<((allocations && allocations.length)-1))
                        };
                        let __body_ref__228=async function() {
                            idx+=1;
                            def_idx=null;
                            stmt=[];
                            alloc_set=await (async function(){
                                let __targ__230=await (async function(){
                                    let __targ__229=allocations;
                                    if (__targ__229){
                                         return(__targ__229)[idx]
                                    } 
                                })();
                                if (__targ__230){
                                     return(__targ__230)["val"]
                                } 
                            })();
                            reference_name=await clean_quoted_reference(await sanitize_js_ref_name((alloc_set && alloc_set["0"] && alloc_set["0"]["name"])));
                            ctx_details=await get_declaration_details(ctx,reference_name);
                            assignment_value=(await (async function(){
                                let __targ__231=assignments;
                                if (__targ__231){
                                     return(__targ__231)[reference_name]
                                } 
                            })()).shift();
                            await async function(){
                                if (check_true( await (async function(){
                                    let __targ__232=block_declarations;
                                    if (__targ__232){
                                         return(__targ__232)[reference_name]
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
                                let __target_obj__233=block_declarations;
                                __target_obj__233[reference_name]=true;
                                return __target_obj__233;
                                
                            }();
                            (stmt).push("=");
                            (stmt).push(assignment_value);
                            (stmt).push(";");
                             return  (acc).push(stmt)
                        };
                        let __BREAK__FLAG__=false;
                        while(await __test_condition__227()) {
                            await __body_ref__228();
                             if(__BREAK__FLAG__) {
                                 break;
                                
                            }
                        } ;
                        
                    })();
                    (acc).push(await compile_block(await (await Environment.get_global("conj"))(["PLACEHOLDER"],block),ctx,{
                        no_scope_boundary:true,ignore_declarations:declarations_handled
                    }));
                    await (async function() {
                        let __for_body__236=async function(i) {
                             return  (acc).push("}")
                        };
                        let __array__237=[],__elements__235=await (await Environment.get_global("range"))(sub_block_count);
                        let __BREAK__FLAG__=false;
                        for(let __iter__234 in __elements__235) {
                            __array__237.push(await __for_body__236(__elements__235[__iter__234]));
                            if(__BREAK__FLAG__) {
                                 __array__237.pop();
                                break;
                                
                            }
                        }return __array__237;
                         
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
                        let __array_op_rval__238=in_sync_ques_;
                         if (__array_op_rval__238 instanceof Function){
                            return await __array_op_rval__238(ctx) 
                        } else {
                            return[__array_op_rval__238,ctx]
                        }
                    })())){
                          return ""
                    } else {
                          return "await"
                    }
                };
                calling_preamble=async function(ctx) {
                    if (check_true (await (async function(){
                        let __array_op_rval__239=in_sync_ques_;
                         if (__array_op_rval__239 instanceof Function){
                            return await __array_op_rval__239(ctx) 
                        } else {
                            return[__array_op_rval__239,ctx]
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
                        let __target_obj__240=ctx;
                        __target_obj__240["return_last_value"]=true;
                        return __target_obj__240;
                        
                    }();
                    await async function(){
                        let __target_obj__241=ctx;
                        __target_obj__241["return_point"]=0;
                        return __target_obj__241;
                        
                    }();
                    await set_ctx(ctx,"__IN_LAMBDA__",true);
                    await set_ctx(ctx,"__LAMBDA_STEP__",-1);
                    await async function(){
                        let __target_obj__242=ctx;
                        __target_obj__242["lambda_scope"]=true;
                        return __target_obj__242;
                        
                    }();
                    await async function(){
                        let __target_obj__243=ctx;
                        __target_obj__243["suppress_return"]=false;
                        return __target_obj__243;
                        
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
                        let __target_obj__244=type_mark;
                        __target_obj__244["args"]=[];
                        return __target_obj__244;
                        
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
                         let __test_condition__245=async function() {
                             return  (idx<((fn_args && fn_args.length)-1))
                        };
                        let __body_ref__246=async function() {
                            idx+=1;
                            arg=await (async function(){
                                let __targ__247=fn_args;
                                if (__targ__247){
                                     return(__targ__247)[idx]
                                } 
                            })();
                            if (check_true (((arg && arg.name)==="&"))){
                                idx+=1;
                                arg=await (async function(){
                                    let __targ__248=fn_args;
                                    if (__targ__248){
                                         return(__targ__248)[idx]
                                    } 
                                })();
                                if (check_true ((null==arg))){
                                    throw new SyntaxError("Missing argument symbol after &");
                                    
                                };
                                await set_ctx(ctx,(arg && arg.name),ArgumentType);
                                 await async function(){
                                    let __target_obj__249=arg;
                                    __target_obj__249["name"]=("..."+(arg && arg.name));
                                    return __target_obj__249;
                                    
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
                        while(await __test_condition__245()) {
                            await __body_ref__246();
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
                            let __target_obj__250=ctx;
                            __target_obj__250["return_last_value"]=false;
                            return __target_obj__250;
                            
                        }()
                    } else {
                         await async function(){
                            let __target_obj__251=ctx;
                            __target_obj__251["return_last_value"]=true;
                            return __target_obj__251;
                            
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
                                let __target_obj__252=ctx;
                                __target_obj__252["return_last_value"]=true;
                                return __target_obj__252;
                                
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
                        let __for_body__255=async function(t) {
                             return  (acc).push(t)
                        };
                        let __array__256=[],__elements__254=["new"," ","Function","("];
                        let __BREAK__FLAG__=false;
                        for(let __iter__253 in __elements__254) {
                            __array__256.push(await __for_body__255(__elements__254[__iter__253]));
                            if(__BREAK__FLAG__) {
                                 __array__256.pop();
                                break;
                                
                            }
                        }return __array__256;
                         
                    })();
                    await (async function(){
                         let __test_condition__257=async function() {
                             return  (idx<((fn_args && fn_args.length)-1))
                        };
                        let __body_ref__258=async function() {
                            idx+=1;
                            arg=await (async function(){
                                let __targ__259=fn_args;
                                if (__targ__259){
                                     return(__targ__259)[idx]
                                } 
                            })();
                            await set_ctx(ctx,(arg && arg.name),ArgumentType);
                            (acc).push(("\""+(arg && arg.name)+"\""));
                            ((type_mark && type_mark["args"])).push((arg && arg.name));
                             return  (acc).push(",")
                        };
                        let __BREAK__FLAG__=false;
                        while(await __test_condition__257()) {
                            await __body_ref__258();
                             if(__BREAK__FLAG__) {
                                 break;
                                
                            }
                        } ;
                        
                    })();
                    (acc).push("\"");
                    await (async function() {
                        let __for_body__262=async function(c) {
                            if (check_true (await not((c==="\n"),(c==="\r")))){
                                if (check_true ((c==="\""))){
                                     (quoted_body).push(await String.fromCharCode(92))
                                };
                                 return  (quoted_body).push(c)
                            }
                        };
                        let __array__263=[],__elements__261=(body).split("");
                        let __BREAK__FLAG__=false;
                        for(let __iter__260 in __elements__261) {
                            __array__263.push(await __for_body__262(__elements__261[__iter__260]));
                            if(__BREAK__FLAG__) {
                                 __array__263.pop();
                                break;
                                
                            }
                        }return __array__263;
                         
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
                        let __array_op_rval__264=(preamble && preamble["2"]);
                         if (__array_op_rval__264 instanceof Function){
                            return await __array_op_rval__264((preamble && preamble["0"])," ",(preamble && preamble["1"])," ",(preamble && preamble["3"]),"function","()","{",await compile_cond_inner(tokens,ctx),"} ",(preamble && preamble["4"]),"()") 
                        } else {
                            return[__array_op_rval__264,(preamble && preamble["0"])," ",(preamble && preamble["1"])," ",(preamble && preamble["3"]),"function","()","{",await compile_cond_inner(tokens,ctx),"} ",(preamble && preamble["4"]),"()"]
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
                            let __targ__265=await first(stmts);
                            if (__targ__265){
                                 return(__targ__265)["ctype"]
                            } 
                        })()&&await async function(){
                            if (check_true( (await (async function(){
                                let __targ__266=await first(stmts);
                                if (__targ__266){
                                     return(__targ__266)["ctype"]
                                } 
                            })() instanceof String || typeof await (async function(){
                                let __targ__266=await first(stmts);
                                if (__targ__266){
                                     return(__targ__266)["ctype"]
                                } 
                            })()==='string'))) {
                                 return await (async function(){
                                    let __targ__267=await first(stmts);
                                    if (__targ__267){
                                         return(__targ__267)["ctype"]
                                    } 
                                })()
                            } else  {
                                 return await sub_type(await (async function(){
                                    let __targ__268=await first(stmts);
                                    if (__targ__268){
                                         return(__targ__268)["ctype"]
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
                         let __test_condition__269=async function() {
                             return  (idx<(condition_tokens && condition_tokens.length))
                        };
                        let __body_ref__270=async function() {
                            inject_return=false;
                            condition=await (async function(){
                                let __targ__271=condition_tokens;
                                if (__targ__271){
                                     return(__targ__271)[idx]
                                } 
                            })();
                            idx+=1;
                            condition_block=await (async function(){
                                let __targ__272=condition_tokens;
                                if (__targ__272){
                                     return(__targ__272)[idx]
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
                                    let __array_op_rval__273=is_form_ques_;
                                     if (__array_op_rval__273 instanceof Function){
                                        return await __array_op_rval__273(condition) 
                                    } else {
                                        return[__array_op_rval__273,condition]
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
                        while(await __test_condition__269()) {
                            await __body_ref__270();
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
                    let __if_id__274= async function(){
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
                        let if_id=await __if_id__274();
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
                                let __targ__275=await first(stmts);
                                if (__targ__275){
                                     return(__targ__275)["ctype"]
                                } 
                            })()&&await async function(){
                                if (check_true( (await (async function(){
                                    let __targ__276=await first(stmts);
                                    if (__targ__276){
                                         return(__targ__276)["ctype"]
                                    } 
                                })() instanceof String || typeof await (async function(){
                                    let __targ__276=await first(stmts);
                                    if (__targ__276){
                                         return(__targ__276)["ctype"]
                                    } 
                                })()==='string'))) {
                                     return await (async function(){
                                        let __targ__277=await first(stmts);
                                        if (__targ__277){
                                             return(__targ__277)["ctype"]
                                        } 
                                    })()
                                } else  {
                                     return await sub_type(await (async function(){
                                        let __targ__278=await first(stmts);
                                        if (__targ__278){
                                             return(__targ__278)["ctype"]
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
                                let __target_obj__279=ctx;
                                __target_obj__279["block_step"]=0;
                                return __target_obj__279;
                                
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
                                let __target_obj__280=ctx;
                                __target_obj__280["suppress_return"]=true;
                                return __target_obj__280;
                                
                            }()
                        };
                        if (check_true (((await first(compiled_test) instanceof Object)&&await (async function(){
                            let __targ__281=await first(compiled_test);
                            if (__targ__281){
                                 return(__targ__281)["ctype"]
                            } 
                        })()&&(await (async function(){
                            let __targ__282=await first(compiled_test);
                            if (__targ__282){
                                 return(__targ__282)["ctype"]
                            } 
                        })() instanceof String || typeof await (async function(){
                            let __targ__282=await first(compiled_test);
                            if (__targ__282){
                                 return(__targ__282)["ctype"]
                            } 
                        })()==='string')&&await contains_ques_("unction",await (async function(){
                            let __targ__283=await first(compiled_test);
                            if (__targ__283){
                                 return(__targ__283)["ctype"]
                            } 
                        })())))){
                             await (async function() {
                                let __for_body__286=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__287=[],__elements__285=["if"," ","(check_true (",(preamble && preamble["0"])," ",compiled_test,"()","))"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__284 in __elements__285) {
                                    __array__287.push(await __for_body__286(__elements__285[__iter__284]));
                                    if(__BREAK__FLAG__) {
                                         __array__287.pop();
                                        break;
                                        
                                    }
                                }return __array__287;
                                 
                            })()
                        } else {
                             await (async function() {
                                let __for_body__290=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__291=[],__elements__289=["if"," ","(check_true (",compiled_test,"))"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__288 in __elements__289) {
                                    __array__291.push(await __for_body__290(__elements__289[__iter__288]));
                                    if(__BREAK__FLAG__) {
                                         __array__291.pop();
                                        break;
                                        
                                    }
                                }return __array__291;
                                 
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
                            let __target_obj__292=ctx;
                            __target_obj__292["suppress_return"]=in_suppress_ques_;
                            return __target_obj__292;
                            
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
                            let __array_op_rval__293=is_block_ques_;
                             if (__array_op_rval__293 instanceof Function){
                                return await __array_op_rval__293(tokens) 
                            } else {
                                return[__array_op_rval__293,tokens]
                            }
                        })())) {
                            ctx=await new_ctx(ctx);
                            await async function(){
                                let __target_obj__294=ctx;
                                __target_obj__294["return_point"]=1;
                                return __target_obj__294;
                                
                            }();
                             return  acc=["(",(preamble && preamble["1"])," ","function","()","{",await compile(tokens,ctx),"}",")","()"]
                        } else if (check_true( ((tokens instanceof Object)&&((tokens && tokens["val"] && tokens["val"]["0"] && tokens["val"]["0"]["name"])==="if")))) {
                            ctx=await new_ctx(ctx);
                            await async function(){
                                let __target_obj__295=ctx;
                                __target_obj__295["return_point"]=1;
                                return __target_obj__295;
                                
                            }();
                             return  await (async function() {
                                let __for_body__298=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__299=[],__elements__297=["(",(preamble && preamble["1"])," ","function","()","{",await compile_if((tokens && tokens["val"]),ctx),"}",")","()"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__296 in __elements__297) {
                                    __array__299.push(await __for_body__298(__elements__297[__iter__296]));
                                    if(__BREAK__FLAG__) {
                                         __array__299.pop();
                                        break;
                                        
                                    }
                                }return __array__299;
                                 
                            })()
                        } else if (check_true( (tokens instanceof Array))) {
                             return  acc=await compile_block_to_anon_fn(tokens,ctx)
                        } else if (check_true( ((tokens instanceof Object)&&(tokens && tokens["val"])&&((tokens && tokens["type"])==="arr")))) {
                             return  acc=await compile_block_to_anon_fn((tokens && tokens["val"]),ctx)
                        }
                    } ();
                    if (check_true (needs_await)){
                          return await (async function(){
                            let __array_op_rval__300=(preamble && preamble["0"]);
                             if (__array_op_rval__300 instanceof Function){
                                return await __array_op_rval__300(" ",acc) 
                            } else {
                                return[__array_op_rval__300," ",acc]
                            }
                        })()
                    } else {
                          return await (async function(){
                            let __array_op_rval__301=acc;
                             if (__array_op_rval__301 instanceof Function){
                                return await __array_op_rval__301() 
                            } else {
                                return[__array_op_rval__301]
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
                        let __target_obj__302=ctx;
                        __target_obj__302["return_point"]=0;
                        return __target_obj__302;
                        
                    }();
                    await async function(){
                        if (check_true( await (async function(){
                            let __array_op_rval__303=is_block_ques_;
                             if (__array_op_rval__303 instanceof Function){
                                return await __array_op_rval__303(tokens) 
                            } else {
                                return[__array_op_rval__303,tokens]
                            }
                        })())) {
                            await async function(){
                                let __target_obj__304=ctx;
                                __target_obj__304["return_last_value"]=true;
                                return __target_obj__304;
                                
                            }();
                            await async function(){
                                let __target_obj__305=ctx;
                                __target_obj__305["return_point"]=0;
                                return __target_obj__305;
                                
                            }();
                             return  await (async function() {
                                let __for_body__308=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__309=[],__elements__307=["(",(preamble && preamble["1"])," ","function","()",await compile_block(tokens,ctx),")","()"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__306 in __elements__307) {
                                    __array__309.push(await __for_body__308(__elements__307[__iter__306]));
                                    if(__BREAK__FLAG__) {
                                         __array__309.pop();
                                        break;
                                        
                                    }
                                }return __array__309;
                                 
                            })()
                        } else if (check_true( ((tokens && tokens["0"] && tokens["0"]["name"])==="let"))) {
                            await async function(){
                                let __target_obj__310=ctx;
                                __target_obj__310["return_last_value"]=true;
                                return __target_obj__310;
                                
                            }();
                            await async function(){
                                let __target_obj__311=ctx;
                                __target_obj__311["return_point"]=0;
                                return __target_obj__311;
                                
                            }();
                             return  await (async function() {
                                let __for_body__314=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__315=[],__elements__313=["(",(preamble && preamble["1"])," ","function","()",await compile(tokens,ctx),")","()"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__312 in __elements__313) {
                                    __array__315.push(await __for_body__314(__elements__313[__iter__312]));
                                    if(__BREAK__FLAG__) {
                                         __array__315.pop();
                                        break;
                                        
                                    }
                                }return __array__315;
                                 
                            })()
                        } else  {
                            await async function(){
                                let __target_obj__316=ctx;
                                __target_obj__316["return_last_value"]=true;
                                return __target_obj__316;
                                
                            }();
                            await async function(){
                                let __target_obj__317=ctx;
                                __target_obj__317["return_point"]=0;
                                return __target_obj__317;
                                
                            }();
                             return  await (async function() {
                                let __for_body__320=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__321=[],__elements__319=["(",(preamble && preamble["1"])," ","function","()","{"," ","return"," ",await compile(tokens,ctx)," ","}",")","()"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__318 in __elements__319) {
                                    __array__321.push(await __for_body__320(__elements__319[__iter__318]));
                                    if(__BREAK__FLAG__) {
                                         __array__321.pop();
                                        break;
                                        
                                    }
                                }return __array__321;
                                 
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
                                let __for_body__324=async function(token) {
                                     return  (place).push(token)
                                };
                                let __array__325=[],__elements__323=tokens;
                                let __BREAK__FLAG__=false;
                                for(let __iter__322 in __elements__323) {
                                    __array__325.push(await __for_body__324(__elements__323[__iter__322]));
                                    if(__BREAK__FLAG__) {
                                         __array__325.pop();
                                        break;
                                        
                                    }
                                }return __array__325;
                                 
                            })()
                        } else  {
                             return await (async function() {
                                let __for_body__328=async function(token) {
                                     return  (place).push(token)
                                };
                                let __array__329=[],__elements__327=await (async function(){
                                    let __array_op_rval__330=tokens;
                                     if (__array_op_rval__330 instanceof Function){
                                        return await __array_op_rval__330() 
                                    } else {
                                        return[__array_op_rval__330]
                                    }
                                })();
                                let __BREAK__FLAG__=false;
                                for(let __iter__326 in __elements__327) {
                                    __array__329.push(await __for_body__328(__elements__327[__iter__326]));
                                    if(__BREAK__FLAG__) {
                                         __array__329.pop();
                                        break;
                                        
                                    }
                                }return __array__329;
                                 
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
                        let __for_body__333=async function(opt_token) {
                             return  (args).push(await wrap_assignment_value(await compile(opt_token,ctx),ctx))
                        };
                        let __array__334=[],__elements__332=(new_opts||[]);
                        let __BREAK__FLAG__=false;
                        for(let __iter__331 in __elements__332) {
                            __array__334.push(await __for_body__333(__elements__332[__iter__331]));
                            if(__BREAK__FLAG__) {
                                 __array__334.pop();
                                break;
                                
                            }
                        }return __array__334;
                         
                    })();
                    await async function(){
                        if (check_true( (await not((null==(type_details && type_details["value"])))&&(type_details && type_details["declared_global"])))) {
                            await (async function() {
                                let __for_body__337=async function(arg) {
                                     return  (acc).push(arg)
                                };
                                let __array__338=[],__elements__336=["new"," ",await compile((tokens && tokens["1"]),ctx),"("];
                                let __BREAK__FLAG__=false;
                                for(let __iter__335 in __elements__336) {
                                    __array__338.push(await __for_body__337(__elements__336[__iter__335]));
                                    if(__BREAK__FLAG__) {
                                         __array__338.pop();
                                        break;
                                        
                                    }
                                }return __array__338;
                                 
                            })();
                            await push_as_arg_list(acc,args);
                             return  (acc).push(")")
                        } else if (check_true( (await not((null==(type_details && type_details["value"])))&&(type_details && type_details["value"]) instanceof Function))) {
                            await (async function() {
                                let __for_body__341=async function(arg) {
                                     return  (acc).push(arg)
                                };
                                let __array__342=[],__elements__340=["new"," ",target_type,"("];
                                let __BREAK__FLAG__=false;
                                for(let __iter__339 in __elements__340) {
                                    __array__342.push(await __for_body__341(__elements__340[__iter__339]));
                                    if(__BREAK__FLAG__) {
                                         __array__342.pop();
                                        break;
                                        
                                    }
                                }return __array__342;
                                 
                            })();
                            await push_as_arg_list(acc,args);
                             return  (acc).push(")")
                        } else if (check_true( ((null==(type_details && type_details["value"]))&&await not((null==(root_type_details && root_type_details["value"])))))) {
                            await (async function() {
                                let __for_body__345=async function(arg) {
                                     return  (acc).push(arg)
                                };
                                let __array__346=[],__elements__344=["(",(preamble && preamble["0"])," ","Environment.get_global","(","\"","indirect_new","\"",")",")","(",target_type];
                                let __BREAK__FLAG__=false;
                                for(let __iter__343 in __elements__344) {
                                    __array__346.push(await __for_body__345(__elements__344[__iter__343]));
                                    if(__BREAK__FLAG__) {
                                         __array__346.pop();
                                        break;
                                        
                                    }
                                }return __array__346;
                                 
                            })();
                            if (check_true (((args && args.length)>0))){
                                (acc).push(",");
                                 await push_as_arg_list(acc,args)
                            };
                             return  (acc).push(")")
                        }
                    } ();
                    target_return_type=(await get_ctx_val(ctx,target_type)||await (async function(){
                        let __targ__347=(await get_declarations(ctx,target_type)||new Object());
                        if (__targ__347){
                             return(__targ__347)["type"]
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
                                let __array_op_rval__348=target;
                                 if (__array_op_rval__348 instanceof Function){
                                    return await __array_op_rval__348(operation,how_much) 
                                } else {
                                    return[__array_op_rval__348,operation,how_much]
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
                        let __array_op_rval__349=(preamble && preamble["2"]);
                         if (__array_op_rval__349 instanceof Function){
                            return await __array_op_rval__349((preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()","{",await compile_try_inner(tokens,ctx),"}",")","()") 
                        } else {
                            return[__array_op_rval__349,(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()","{",await compile_try_inner(tokens,ctx),"}",")","()"]
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
                            let __targ__350=await first(stmts);
                            if (__targ__350){
                                 return(__targ__350)["ctype"]
                            } 
                        })()&&await async function(){
                            if (check_true( (await (async function(){
                                let __targ__351=await first(stmts);
                                if (__targ__351){
                                     return(__targ__351)["ctype"]
                                } 
                            })() instanceof String || typeof await (async function(){
                                let __targ__351=await first(stmts);
                                if (__targ__351){
                                     return(__targ__351)["ctype"]
                                } 
                            })()==='string'))) {
                                 return await (async function(){
                                    let __targ__352=await first(stmts);
                                    if (__targ__352){
                                         return(__targ__352)["ctype"]
                                    } 
                                })()
                            } else  {
                                 return await sub_type(await (async function(){
                                    let __targ__353=await first(stmts);
                                    if (__targ__353){
                                         return(__targ__353)["ctype"]
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
                                let __for_body__356=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__357=[],__elements__355=[" ","catch","(",the_exception_ref,")"," ","{"," "];
                                let __BREAK__FLAG__=false;
                                for(let __iter__354 in __elements__355) {
                                    __array__357.push(await __for_body__356(__elements__355[__iter__354]));
                                    if(__BREAK__FLAG__) {
                                         __array__357.pop();
                                        break;
                                        
                                    }
                                }return __array__357;
                                 
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
                                let __for_body__360=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__361=[],__elements__359=[" ","else"," "];
                                let __BREAK__FLAG__=false;
                                for(let __iter__358 in __elements__359) {
                                    __array__361.push(await __for_body__360(__elements__359[__iter__358]));
                                    if(__BREAK__FLAG__) {
                                         __array__361.pop();
                                        break;
                                        
                                    }
                                }return __array__361;
                                 
                            })()
                        };
                        await (async function() {
                            let __for_body__364=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__365=[],__elements__363=[" ","if"," ","(",the_exception_ref," ","instanceof"," ",(err_data && err_data["error_type"]),")"," ","{"," ","let"," ",(err_data && err_data["error_ref"]),"=",the_exception_ref,";"," "];
                            let __BREAK__FLAG__=false;
                            for(let __iter__362 in __elements__363) {
                                __array__365.push(await __for_body__364(__elements__363[__iter__362]));
                                if(__BREAK__FLAG__) {
                                     __array__365.pop();
                                    break;
                                    
                                }
                            }return __array__365;
                             
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
                                let __for_body__368=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__369=[],__elements__367=[" ","else"," ","throw"," ",the_exception_ref,";"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__366 in __elements__367) {
                                    __array__369.push(await __for_body__368(__elements__367[__iter__366]));
                                    if(__BREAK__FLAG__) {
                                         __array__369.pop();
                                        break;
                                        
                                    }
                                }return __array__369;
                                 
                            })()
                        };
                        if (check_true (complete)){
                             await (async function() {
                                let __for_body__372=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__373=[],__elements__371=[" ","}"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__370 in __elements__371) {
                                    __array__373.push(await __for_body__372(__elements__371[__iter__370]));
                                    if(__BREAK__FLAG__) {
                                         __array__373.pop();
                                        break;
                                        
                                    }
                                }return __array__373;
                                 
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
                        let __target_obj__374=ctx;
                        __target_obj__374["return_last_value"]=true;
                        return __target_obj__374;
                        
                    }();
                    await async function(){
                        let __target_obj__375=ctx;
                        __target_obj__375["in_try"]=true;
                        return __target_obj__375;
                        
                    }();
                    stmts=await compile(try_block,ctx);
                    if (check_true (((stmts && stmts["0"] && stmts["0"]["ctype"])&&(((stmts && stmts["0"] && stmts["0"]["ctype"])===AsyncFunction)||((stmts && stmts["0"] && stmts["0"]["ctype"])===Function))))){
                         (stmts).unshift("await")
                    };
                    if (check_true (await (async function(){
                        let __array_op_rval__376=is_complex_ques_;
                         if (__array_op_rval__376 instanceof Function){
                            return await __array_op_rval__376(try_block) 
                        } else {
                            return[__array_op_rval__376,try_block]
                        }
                    })())){
                         await (async function() {
                            let __for_body__379=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__380=[],__elements__378=["try"," ","/* TRY COMPLEX */ ",stmts," "];
                            let __BREAK__FLAG__=false;
                            for(let __iter__377 in __elements__378) {
                                __array__380.push(await __for_body__379(__elements__378[__iter__377]));
                                if(__BREAK__FLAG__) {
                                     __array__380.pop();
                                    break;
                                    
                                }
                            }return __array__380;
                             
                        })()
                    } else {
                         await (async function() {
                            let __for_body__383=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__384=[],__elements__382=await (async function ()  {
                                let __array_arg__385=(async function() {
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
                                return ["try"," ","/* TRY SIMPLE */ ","{"," ",await __array_arg__385(),stmts," ","}"]
                            } )();
                            let __BREAK__FLAG__=false;
                            for(let __iter__381 in __elements__382) {
                                __array__384.push(await __for_body__383(__elements__382[__iter__381]));
                                if(__BREAK__FLAG__) {
                                     __array__384.pop();
                                    break;
                                    
                                }
                            }return __array__384;
                             
                        })()
                    };
                    await (async function(){
                         let __test_condition__386=async function() {
                             return  (idx<(catches && catches.length))
                        };
                        let __body_ref__387=async function() {
                            catch_block=await (async function(){
                                let __targ__389=await (async function(){
                                    let __targ__388=catches;
                                    if (__targ__388){
                                         return(__targ__388)[idx]
                                    } 
                                })();
                                if (__targ__389){
                                     return(__targ__389)["val"]
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
                        while(await __test_condition__386()) {
                            await __body_ref__387();
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
                            let __for_body__392=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__393=[],__elements__391=["throw"," ",error_instance,";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__390 in __elements__391) {
                                __array__393.push(await __for_body__392(__elements__391[__iter__390]));
                                if(__BREAK__FLAG__) {
                                     __array__393.pop();
                                    break;
                                    
                                }
                            }return __array__393;
                             
                        })()
                    } else {
                         await (async function() {
                            let __for_body__396=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__397=[],__elements__395=["throw"," ","new"," ",error_instance,"(",error_message,")",";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__394 in __elements__395) {
                                __array__397.push(await __for_body__396(__elements__395[__iter__394]));
                                if(__BREAK__FLAG__) {
                                     __array__397.pop();
                                    break;
                                    
                                }
                            }return __array__397;
                             
                        })()
                    };
                     return  acc
                };
                compile_break=async function(tokens,ctx) {
                     return  await (async function(){
                        let __array_op_rval__398=break_out;
                         if (__array_op_rval__398 instanceof Function){
                            return await __array_op_rval__398("=","true",";","return") 
                        } else {
                            return[__array_op_rval__398,"=","true",";","return"]
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
                        let __array_op_rval__399=is_block_ques_;
                         if (__array_op_rval__399 instanceof Function){
                            return await __array_op_rval__399((tokens && tokens["1"] && tokens["1"]["val"])) 
                        } else {
                            return[__array_op_rval__399,(tokens && tokens["1"] && tokens["1"]["val"])]
                        }
                    })())){
                         await (async function() {
                            let __for_body__402=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__403=[],__elements__401=["let"," ",return_val_reference,"=",await compile((tokens && tokens["1"] && tokens["1"]["val"]),ctx),";","return"," ",return_val_reference,";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__400 in __elements__401) {
                                __array__403.push(await __for_body__402(__elements__401[__iter__400]));
                                if(__BREAK__FLAG__) {
                                     __array__403.pop();
                                    break;
                                    
                                }
                            }return __array__403;
                             
                        })()
                    } else {
                         await (async function() {
                            let __for_body__406=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__407=[],__elements__405=["return"," ",await compile((tokens && tokens["1"]),ctx),";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__404 in __elements__405) {
                                __array__407.push(await __for_body__406(__elements__405[__iter__404]));
                                if(__BREAK__FLAG__) {
                                     __array__407.pop();
                                    break;
                                    
                                }
                            }return __array__407;
                             
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
                            let __for_body__410=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__411=[],__elements__409=["let"," ",target_argument_ref,"=","[]",".concat","(",await compile(target_arg,ctx),")",";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__408 in __elements__409) {
                                __array__411.push(await __for_body__410(__elements__409[__iter__408]));
                                if(__BREAK__FLAG__) {
                                     __array__411.pop();
                                    break;
                                    
                                }
                            }return __array__411;
                             
                        })();
                        await (async function() {
                            let __for_body__414=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__415=[],__elements__413=["if","(","!",target_argument_ref," ","instanceof"," ","Array",")","{","throw"," ","new"," ","TypeError","(","\"Invalid final argument to apply - an array is required\"",")","}"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__412 in __elements__413) {
                                __array__415.push(await __for_body__414(__elements__413[__iter__412]));
                                if(__BREAK__FLAG__) {
                                     __array__415.pop();
                                    break;
                                    
                                }
                            }return __array__415;
                             
                        })();
                        await (async function() {
                            let __for_body__418=async function(token) {
                                preceding_arg_ref=await gen_temp_name("pre_arg");
                                if (check_true (await (async function(){
                                    let __array_op_rval__420=is_form_ques_;
                                     if (__array_op_rval__420 instanceof Function){
                                        return await __array_op_rval__420(token) 
                                    } else {
                                        return[__array_op_rval__420,token]
                                    }
                                })())){
                                     await (async function() {
                                        let __for_body__423=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__424=[],__elements__422=["let"," ",preceding_arg_ref,"=",await wrap_assignment_value(await compile((token && token["val"]),ctx),ctx),";"];
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__421 in __elements__422) {
                                            __array__424.push(await __for_body__423(__elements__422[__iter__421]));
                                            if(__BREAK__FLAG__) {
                                                 __array__424.pop();
                                                break;
                                                
                                            }
                                        }return __array__424;
                                         
                                    })()
                                } else {
                                     preceding_arg_ref=await wrap_assignment_value(await compile(token,ctx))
                                };
                                 return  (acc).push(await (async function(){
                                    let __array_op_rval__425=target_argument_ref;
                                     if (__array_op_rval__425 instanceof Function){
                                        return await __array_op_rval__425(".unshift","(",preceding_arg_ref,")",";") 
                                    } else {
                                        return[__array_op_rval__425,".unshift","(",preceding_arg_ref,")",";"]
                                    }
                                })())
                            };
                            let __array__419=[],__elements__417=args;
                            let __BREAK__FLAG__=false;
                            for(let __iter__416 in __elements__417) {
                                __array__419.push(await __for_body__418(__elements__417[__iter__416]));
                                if(__BREAK__FLAG__) {
                                     __array__419.pop();
                                    break;
                                    
                                }
                            }return __array__419;
                             
                        })();
                         await (async function() {
                            let __for_body__428=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__429=[],__elements__427=["return"," ","(",function_ref,")",".","apply","(","this",",",target_argument_ref,")"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__426 in __elements__427) {
                                __array__429.push(await __for_body__428(__elements__427[__iter__426]));
                                if(__BREAK__FLAG__) {
                                     __array__429.pop();
                                    break;
                                    
                                }
                            }return __array__429;
                             
                        })()
                    } else {
                        if (check_true (await (async function(){
                            let __array_op_rval__430=is_form_ques_;
                             if (__array_op_rval__430 instanceof Function){
                                return await __array_op_rval__430(args) 
                            } else {
                                return[__array_op_rval__430,args]
                            }
                        })())){
                            await (async function() {
                                let __for_body__433=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__434=[],__elements__432=["let"," ",args_ref,"=",await wrap_assignment_value(await compile((args && args["val"]),ctx),ctx),";"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__431 in __elements__432) {
                                    __array__434.push(await __for_body__433(__elements__432[__iter__431]));
                                    if(__BREAK__FLAG__) {
                                         __array__434.pop();
                                        break;
                                        
                                    }
                                }return __array__434;
                                 
                            })();
                             complex_ques_=true
                        };
                        await (async function() {
                            let __for_body__437=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__438=[],__elements__436=["return"," ","("," ",function_ref,")",".","apply","(","this"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__435 in __elements__436) {
                                __array__438.push(await __for_body__437(__elements__436[__iter__435]));
                                if(__BREAK__FLAG__) {
                                     __array__438.pop();
                                    break;
                                    
                                }
                            }return __array__438;
                             
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
                        let __array_op_rval__439=(preamble && preamble["0"]);
                         if (__array_op_rval__439 instanceof Function){
                            return await __array_op_rval__439(" ","(",(preamble && preamble["1"])," ","function","()","{",acc,"}",")","()") 
                        } else {
                            return[__array_op_rval__439," ","(",(preamble && preamble["1"])," ","function","()","{",acc,"}",")","()"]
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
                                let __array_op_rval__440=(preamble && preamble["2"]);
                                 if (__array_op_rval__440 instanceof Function){
                                    return await __array_op_rval__440((preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ","{",await compile_call_inner(tokens,ctx,{
                                        type:2,preamble:preamble
                                    })," ","}",")","()") 
                                } else {
                                    return[__array_op_rval__440,(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ","{",await compile_call_inner(tokens,ctx,{
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
                            let __for_body__443=async function(token) {
                                (acc).push(",");
                                 return  (acc).push(await wrap_assignment_value(await compile(token,ctx),ctx))
                            };
                            let __array__444=[],__elements__442=await tokens["slice"].call(tokens,3);
                            let __BREAK__FLAG__=false;
                            for(let __iter__441 in __elements__442) {
                                __array__444.push(await __for_body__443(__elements__442[__iter__441]));
                                if(__BREAK__FLAG__) {
                                     __array__444.pop();
                                    break;
                                    
                                }
                            }return __array__444;
                             
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
                                        let __for_body__447=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__448=[],__elements__446=await (async function(){
                                            let __array_op_rval__449=(preamble && preamble["0"]);
                                             if (__array_op_rval__449 instanceof Function){
                                                return await __array_op_rval__449(" ",target,"[",method,"]","()") 
                                            } else {
                                                return[__array_op_rval__449," ",target,"[",method,"]","()"]
                                            }
                                        })();
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__445 in __elements__446) {
                                            __array__448.push(await __for_body__447(__elements__446[__iter__445]));
                                            if(__BREAK__FLAG__) {
                                                 __array__448.pop();
                                                break;
                                                
                                            }
                                        }return __array__448;
                                         
                                    })()
                                } else  {
                                    await (async function() {
                                        let __for_body__452=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__453=[],__elements__451=await (async function(){
                                            let __array_op_rval__454=(preamble && preamble["0"]);
                                             if (__array_op_rval__454 instanceof Function){
                                                return await __array_op_rval__454(" ",target,"[",method,"]",".call","(",target) 
                                            } else {
                                                return[__array_op_rval__454," ",target,"[",method,"]",".call","(",target]
                                            }
                                        })();
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__450 in __elements__451) {
                                            __array__453.push(await __for_body__452(__elements__451[__iter__450]));
                                            if(__BREAK__FLAG__) {
                                                 __array__453.pop();
                                                break;
                                                
                                            }
                                        }return __array__453;
                                         
                                    })();
                                    await add_args();
                                     return  (acc).push(")")
                                }
                            } ()
                        } else if (check_true( ((opts && opts["type"])===2))) {
                            await (async function() {
                                let __for_body__457=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__458=[],__elements__456=["{"," ","let"," ","__call_target__","=",target,","," ","__call_method__","=",method,";"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__455 in __elements__456) {
                                    __array__458.push(await __for_body__457(__elements__456[__iter__455]));
                                    if(__BREAK__FLAG__) {
                                         __array__458.pop();
                                        break;
                                        
                                    }
                                }return __array__458;
                                 
                            })();
                            await async function(){
                                if (check_true( ((tokens && tokens.length)===3))) {
                                     return await (async function() {
                                        let __for_body__461=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__462=[],__elements__460=["return"," ",(preamble && preamble["0"])," ","__call_target__","[","__call_method__","]","()"];
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__459 in __elements__460) {
                                            __array__462.push(await __for_body__461(__elements__460[__iter__459]));
                                            if(__BREAK__FLAG__) {
                                                 __array__462.pop();
                                                break;
                                                
                                            }
                                        }return __array__462;
                                         
                                    })()
                                } else  {
                                    await (async function() {
                                        let __for_body__465=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__466=[],__elements__464=["return"," ",(preamble && preamble["0"])," ","__call_target__","[","__call_method__","]",".","call","(","__call_target__"];
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__463 in __elements__464) {
                                            __array__466.push(await __for_body__465(__elements__464[__iter__463]));
                                            if(__BREAK__FLAG__) {
                                                 __array__466.pop();
                                                break;
                                                
                                            }
                                        }return __array__466;
                                         
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
                        let __targ__467=await first(stmts);
                        if (__targ__467){
                             return(__targ__467)["ctype"]
                        } 
                    })() instanceof Function)&&await (async function(){
                        let __targ__468=await first(stmts);
                        if (__targ__468){
                             return(__targ__468)["ctype"]
                        } 
                    })()&&await async function(){
                        if (check_true( (await (async function(){
                            let __targ__469=await first(stmts);
                            if (__targ__469){
                                 return(__targ__469)["ctype"]
                            } 
                        })() instanceof String || typeof await (async function(){
                            let __targ__469=await first(stmts);
                            if (__targ__469){
                                 return(__targ__469)["ctype"]
                            } 
                        })()==='string'))) {
                             return await (async function(){
                                let __targ__470=await first(stmts);
                                if (__targ__470){
                                     return(__targ__470)["ctype"]
                                } 
                            })()
                        } else  {
                             return await sub_type(await (async function(){
                                let __targ__471=await first(stmts);
                                if (__targ__471){
                                     return(__targ__471)["ctype"]
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
                    let __symbols__472= async function(){
                        return []
                    };
                    let from_tokens;
                    let from_place;
                    let acc;
                    {
                        symbol_tokens=(tokens && tokens["1"]);
                        let symbols=await __symbols__472();
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
                                    let __for_body__475=async function(s) {
                                         return  (symbols).push(await compile(s,ctx))
                                    };
                                    let __array__476=[],__elements__474=(symbol_tokens && symbol_tokens["val"]);
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__473 in __elements__474) {
                                        __array__476.push(await __for_body__475(__elements__474[__iter__473]));
                                        if(__BREAK__FLAG__) {
                                             __array__476.pop();
                                            break;
                                            
                                        }
                                    }return __array__476;
                                     
                                })();
                                 return  await (async function() {
                                    let __for_body__479=async function(t) {
                                         return  (acc).push(t)
                                    };
                                    let __array__480=[],__elements__478=await flatten(["{"," ",symbols," ","}"," ","from"," ",from_place]);
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__477 in __elements__478) {
                                        __array__480.push(await __for_body__479(__elements__478[__iter__477]));
                                        if(__BREAK__FLAG__) {
                                             __array__480.pop();
                                            break;
                                            
                                        }
                                    }return __array__480;
                                     
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
                        let __for_body__483=async function(t) {
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
                        let __array__484=[],__elements__482=(await (await Environment.get_global("rest"))(tokens)||[]);
                        let __BREAK__FLAG__=false;
                        for(let __iter__481 in __elements__482) {
                            __array__484.push(await __for_body__483(__elements__482[__iter__481]));
                            if(__BREAK__FLAG__) {
                                 __array__484.pop();
                                break;
                                
                            }
                        }return __array__484;
                         
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
                        let __for_body__487=async function(t) {
                             return  (acc).push(t)
                        };
                        let __array__488=[],__elements__486=await flatten(await (async function(){
                            let __array_op_rval__489=(preamble && preamble["0"]);
                             if (__array_op_rval__489 instanceof Function){
                                return await __array_op_rval__489(" ","import"," ","(",from_place,")") 
                            } else {
                                return[__array_op_rval__489," ","import"," ","(",from_place,")"]
                            }
                        })());
                        let __BREAK__FLAG__=false;
                        for(let __iter__485 in __elements__486) {
                            __array__488.push(await __for_body__487(__elements__486[__iter__485]));
                            if(__BREAK__FLAG__) {
                                 __array__488.pop();
                                break;
                                
                            }
                        }return __array__488;
                         
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
                        let __target_obj__490=(root_ctx && root_ctx["defined_lisp_globals"]);
                        __target_obj__490[target]=AsyncFunction;
                        return __target_obj__490;
                        
                    }();
                    if (check_true ((tokens && tokens["3"]))){
                         metavalue=await (async function () {
                             if (check_true (await (async function(){
                                let __array_op_rval__491=is_complex_ques_;
                                 if (__array_op_rval__491 instanceof Function){
                                    return await __array_op_rval__491((tokens && tokens["3"])) 
                                } else {
                                    return[__array_op_rval__491,(tokens && tokens["3"])]
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
                                let __target_obj__492=(root_ctx && root_ctx["defined_lisp_globals"]);
                                __target_obj__492[target]=await async function(){
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
                                return __target_obj__492;
                                
                            }();
                            if (check_true (wrap_as_function_ques_)){
                                 return  assignment_value=await (async function(){
                                    let __array_op_rval__493=(preamble && preamble["0"]);
                                     if (__array_op_rval__493 instanceof Function){
                                        return await __array_op_rval__493(" ","(",(preamble && preamble["1"])," ","function"," ","()",assignment_value,")","()") 
                                    } else {
                                        return[__array_op_rval__493," ","(",(preamble && preamble["1"])," ","function"," ","()",assignment_value,")","()"]
                                    }
                                })()
                            }
                        } else  {
                            if (check_true (((assignment_value instanceof Array)&&((assignment_value && assignment_value["0"])==="await")))){
                                  return await async function(){
                                    let __target_obj__494=(root_ctx && root_ctx["defined_lisp_globals"]);
                                    __target_obj__494[target]=AsyncFunction;
                                    return __target_obj__494;
                                    
                                }()
                            } else {
                                  return await async function(){
                                    let __target_obj__495=(root_ctx && root_ctx["defined_lisp_globals"]);
                                    __target_obj__495[target]=assignment_value;
                                    return __target_obj__495;
                                    
                                }()
                            }
                        }
                    } ();
                    if (check_true (await verbosity(ctx))){
                        await (async function(){
                            let __array_op_rval__496=clog;
                             if (__array_op_rval__496 instanceof Function){
                                return await __array_op_rval__496("target: ",await (await Environment.get_global("as_lisp"))(target)) 
                            } else {
                                return[__array_op_rval__496,"target: ",await (await Environment.get_global("as_lisp"))(target)]
                            }
                        })();
                         await (async function(){
                            let __array_op_rval__497=clog;
                             if (__array_op_rval__497 instanceof Function){
                                return await __array_op_rval__497("assignment_value: ",await (await Environment.get_global("as_lisp"))(assignment_value)) 
                            } else {
                                return[__array_op_rval__497,"assignment_value: ",await (await Environment.get_global("as_lisp"))(assignment_value)]
                            }
                        })()
                    };
                    acc=await (async function ()  {
                        let __array_arg__500=(async function() {
                            if (check_true (((Function===await (async function(){
                                let __targ__498=(root_ctx && root_ctx["defined_lisp_globals"]);
                                if (__targ__498){
                                     return(__targ__498)[target]
                                } 
                            })())||await (async function(){
                                let __array_op_rval__499=in_sync_ques_;
                                 if (__array_op_rval__499 instanceof Function){
                                    return await __array_op_rval__499(ctx) 
                                } else {
                                    return[__array_op_rval__499,ctx]
                                }
                            })()))){
                                  return ""
                            } else {
                                  return "await"
                            }
                        } );
                        let __array_arg__501=(async function() {
                            if (check_true (metavalue)){
                                  return ","
                            } else {
                                  return ""
                            }
                        } );
                        let __array_arg__502=(async function() {
                            if (check_true (metavalue)){
                                  return metavalue
                            } else {
                                  return ""
                            }
                        } );
                        return [{
                            ctype:"statement"
                        },await __array_arg__500()," ","Environment",".","set_global","(","","\"",(tokens && tokens["1"] && tokens["1"]["name"]),"\"",",",assignment_value,await __array_arg__501(),await __array_arg__502(),")"]
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
                        let __target_obj__503=ctx;
                        __target_obj__503["hard_quote_mode"]=true;
                        return __target_obj__503;
                        
                    }();
                    acc=await compile_quotem(lisp_struct,ctx);
                     return  acc
                };
                compile_quotel=async function(lisp_struct,ctx) {
                    let acc;
                    acc=[];
                    acc=await JSON.stringify((lisp_struct && lisp_struct["1"]));
                     return  await (async function(){
                        let __array_op_rval__504=acc;
                         if (__array_op_rval__504 instanceof Function){
                            return await __array_op_rval__504() 
                        } else {
                            return[__array_op_rval__504]
                        }
                    })()
                };
                wrap_and_run=async function(js_code,ctx,run_opts) {
                    let __assembly__505= async function(){
                        return null
                    };
                    let result;
                    let fst;
                    let needs_braces_ques_;
                    let run_log;
                    let __needs_return_ques___506= async function(){
                        return await (async function ()  {
                            fst=(""+(((js_code instanceof Array)&&await first(js_code)&&(await first(js_code) instanceof Object)&&await (async function(){
                                let __targ__507=await first(js_code);
                                if (__targ__507){
                                     return(__targ__507)["ctype"]
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
                        let assembly=await __assembly__505();
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
                        let needs_return_ques_=await __needs_return_ques___506();
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
                                let __targ__508=(ntree && ntree["0"]);
                                if (__targ__508){
                                     return(__targ__508)["ctype"]
                                } 
                            })()))){
                                  return await (async function(){
                                    let __targ__509=await first(ntree);
                                    if (__targ__509){
                                         return(__targ__509)["ctype"]
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
                                 let __test_condition__510=async function() {
                                     return  (idx<tlength)
                                };
                                let __body_ref__511=async function() {
                                    tval=await (async function(){
                                        let __targ__512=tree;
                                        if (__targ__512){
                                             return(__targ__512)[idx]
                                        } 
                                    })();
                                    await async function(){
                                        if (check_true( (tval===`=$,@`))) {
                                            idx+=1;
                                            tval=await (async function(){
                                                let __targ__513=tree;
                                                if (__targ__513){
                                                     return(__targ__513)[idx]
                                                } 
                                            })();
                                            if (check_true (await not((undefined==tval)))){
                                                if (check_true (await get_ctx_val(ctx,"__IN_LAMBDA__"))){
                                                    ntree=[];
                                                    if (check_true ((tval instanceof Object))){
                                                        tmp_name=await gen_temp_name("tval");
                                                         await (async function() {
                                                            let __for_body__516=async function(t) {
                                                                 return  (ntree).push(t)
                                                            };
                                                            let __array__517=[],__elements__515=await flatten(await (await Environment.get_global("embed_compiled_quote"))(0,tmp_name,tval));
                                                            let __BREAK__FLAG__=false;
                                                            for(let __iter__514 in __elements__515) {
                                                                __array__517.push(await __for_body__516(__elements__515[__iter__514]));
                                                                if(__BREAK__FLAG__) {
                                                                     __array__517.pop();
                                                                    break;
                                                                    
                                                                }
                                                            }return __array__517;
                                                             
                                                        })()
                                                    } else {
                                                         await (async function() {
                                                            let __for_body__520=async function(t) {
                                                                 return  (subacc).push(t)
                                                            };
                                                            let __array__521=[],__elements__519=await flatten(await (await Environment.get_global("embed_compiled_quote"))(1,tmp_name,tval));
                                                            let __BREAK__FLAG__=false;
                                                            for(let __iter__518 in __elements__519) {
                                                                __array__521.push(await __for_body__520(__elements__519[__iter__518]));
                                                                if(__BREAK__FLAG__) {
                                                                     __array__521.pop();
                                                                    break;
                                                                    
                                                                }
                                                            }return __array__521;
                                                             
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
                                                let __targ__522=tree;
                                                if (__targ__522){
                                                     return(__targ__522)[idx]
                                                } 
                                            })();
                                            if (check_true (await not((undefined==tval)))){
                                                if (check_true (await get_ctx_val(ctx,"__IN_LAMBDA__"))){
                                                    ntree=[];
                                                    if (check_true ((tval instanceof Object))){
                                                        tmp_name=await gen_temp_name("tval");
                                                         await (async function() {
                                                            let __for_body__525=async function(t) {
                                                                 return  (ntree).push(t)
                                                            };
                                                            let __array__526=[],__elements__524=await flatten(await (await Environment.get_global("embed_compiled_quote"))(2,tmp_name,tval));
                                                            let __BREAK__FLAG__=false;
                                                            for(let __iter__523 in __elements__524) {
                                                                __array__526.push(await __for_body__525(__elements__524[__iter__523]));
                                                                if(__BREAK__FLAG__) {
                                                                     __array__526.pop();
                                                                    break;
                                                                    
                                                                }
                                                            }return __array__526;
                                                             
                                                        })()
                                                    } else {
                                                         await (async function() {
                                                            let __for_body__529=async function(t) {
                                                                 return  (ntree).push(t)
                                                            };
                                                            let __array__530=[],__elements__528=await flatten(await (await Environment.get_global("embed_compiled_quote"))(3,tmp_name,tval));
                                                            let __BREAK__FLAG__=false;
                                                            for(let __iter__527 in __elements__528) {
                                                                __array__530.push(await __for_body__529(__elements__528[__iter__527]));
                                                                if(__BREAK__FLAG__) {
                                                                     __array__530.pop();
                                                                    break;
                                                                    
                                                                }
                                                            }return __array__530;
                                                             
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
                                while(await __test_condition__510()) {
                                    await __body_ref__511();
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
                                let __for_body__533=async function(k) {
                                     return  await async function(){
                                        let __target_obj__535=tree;
                                        __target_obj__535[k]=await follow_tree(await (async function(){
                                            let __targ__536=tree;
                                            if (__targ__536){
                                                 return(__targ__536)[k]
                                            } 
                                        })(),ctx);
                                        return __target_obj__535;
                                        
                                    }()
                                };
                                let __array__534=[],__elements__532=await (await Environment.get_global("keys"))(tree);
                                let __BREAK__FLAG__=false;
                                for(let __iter__531 in __elements__532) {
                                    __array__534.push(await __for_body__533(__elements__532[__iter__531]));
                                    if(__BREAK__FLAG__) {
                                         __array__534.pop();
                                        break;
                                        
                                    }
                                }return __array__534;
                                 
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
                        let __array_op_rval__537=("="+":"+"(");
                         if (__array_op_rval__537 instanceof Function){
                            return await __array_op_rval__537(("="+":"+")"),("="+":"+"'"),("="+":")) 
                        } else {
                            return[__array_op_rval__537,("="+":"+")"),("="+":"+"'"),("="+":")]
                        }
                    })()))){
                          return ("\""+(lisp_struct && lisp_struct["1"])+"\"")
                    } else {
                        pcm=await follow_tree((lisp_struct && lisp_struct["1"]),ctx);
                        await async function(){
                            if (check_true( (pcm instanceof String || typeof pcm==='string'))) {
                                 return  await (async function() {
                                    let __for_body__540=async function(t) {
                                         return  (acc).push(t)
                                    };
                                    let __array__541=[],__elements__539=await (async function(){
                                        let __array_op_rval__542=("`"+pcm+"`");
                                         if (__array_op_rval__542 instanceof Function){
                                            return await __array_op_rval__542() 
                                        } else {
                                            return[__array_op_rval__542]
                                        }
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
                            } else if (check_true( await is_number_ques_(pcm))) {
                                 return (acc).push(pcm)
                            } else if (check_true( ((pcm===false)||(pcm===true)))) {
                                 return (acc).push(pcm)
                            } else  {
                                encoded=await Environment["as_lisp"].call(Environment,pcm);
                                encoded=await (await Environment.get_global("add_escape_encoding"))(encoded);
                                 return  await (async function() {
                                    let __for_body__545=async function(t) {
                                         return  (acc).push(t)
                                    };
                                    let __array__546=[],__elements__544=["await"," ","Environment.do_deferred_splice","(","await"," ","Environment.read_lisp","(","'",encoded,"'",")",")"];
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__543 in __elements__544) {
                                        __array__546.push(await __for_body__545(__elements__544[__iter__543]));
                                        if(__BREAK__FLAG__) {
                                             __array__546.pop();
                                            break;
                                            
                                        }
                                    }return __array__546;
                                     
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
                    let __tokens__547= async function(){
                        return null
                    };
                    let preamble;
                    let is_arr_ques_;
                    {
                        acc=[];
                        let tokens=await __tokens__547();
                        ;
                        preamble=await calling_preamble(ctx);
                        is_arr_ques_=((lisp_struct && lisp_struct["1"]) instanceof Array);
                        tokens=await (async function () {
                             if (check_true (is_arr_ques_)){
                                  return await tokenize((lisp_struct && lisp_struct["1"]),ctx)
                            } else {
                                  return (await tokenize(await (async function(){
                                    let __array_op_rval__548=(lisp_struct && lisp_struct["1"]);
                                     if (__array_op_rval__548 instanceof Function){
                                        return await __array_op_rval__548() 
                                    } else {
                                        return[__array_op_rval__548]
                                    }
                                })(),ctx)).pop()
                            } 
                        })();
                        acc=[await compile(tokens,ctx)];
                        if (check_true (is_arr_ques_)){
                             acc=await (async function(){
                                let __array_op_rval__549=(preamble && preamble["1"]);
                                 if (__array_op_rval__549 instanceof Function){
                                    return await __array_op_rval__549(" ","function","()",["{","return"," ",acc,"}"]) 
                                } else {
                                    return[__array_op_rval__549," ","function","()",["{","return"," ",acc,"}"]]
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
                    let __assembly__550= async function(){
                        return null
                    };
                    let type_mark;
                    let acc;
                    let preamble;
                    let result;
                    {
                        let assembly=await __assembly__550();
                        ;
                        type_mark=null;
                        acc=[];
                        preamble=await calling_preamble(ctx);
                        result=null;
                        assembly=await compile((tokens && tokens["1"] && tokens["1"]["val"]),ctx);
                        if (check_true (await verbosity(ctx))){
                             await (async function(){
                                let __array_op_rval__551=eval_log;
                                 if (__array_op_rval__551 instanceof Function){
                                    return await __array_op_rval__551("assembly:",await clone(assembly)) 
                                } else {
                                    return[__array_op_rval__551,"assembly:",await clone(assembly)]
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
                        let __array_op_rval__552=(preamble && preamble["2"]);
                         if (__array_op_rval__552 instanceof Function){
                            return await __array_op_rval__552((preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ","{",await compile_for_each_inner(tokens,ctx,preamble)," ","}",")","()") 
                        } else {
                            return[__array_op_rval__552,(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ","{",await compile_for_each_inner(tokens,ctx,preamble)," ","}",")","()"]
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
                        let __array_op_rval__553=is_block_ques_;
                         if (__array_op_rval__553 instanceof Function){
                            return await __array_op_rval__553((for_body && for_body["val"])) 
                        } else {
                            return[__array_op_rval__553,(for_body && for_body["val"])]
                        }
                    })();
                    ;
                    if (check_true ((iter_count<1))){
                        throw new SyntaxError("Invalid for_each arguments");
                        
                    };
                    await (async function() {
                        let __for_body__556=async function(iter_idx) {
                            (idx_iters).push(await (async function(){
                                let __targ__558=for_args;
                                if (__targ__558){
                                     return(__targ__558)[iter_idx]
                                } 
                            })());
                             return  await set_ctx(ctx,await clean_quoted_reference(await (async function(){
                                let __targ__559=await last(idx_iters);
                                if (__targ__559){
                                     return(__targ__559)["name"]
                                } 
                            })()),ArgumentType)
                        };
                        let __array__557=[],__elements__555=await (await Environment.get_global("range"))(iter_count);
                        let __BREAK__FLAG__=false;
                        for(let __iter__554 in __elements__555) {
                            __array__557.push(await __for_body__556(__elements__555[__iter__554]));
                            if(__BREAK__FLAG__) {
                                 __array__557.pop();
                                break;
                                
                            }
                        }return __array__557;
                         
                    })();
                    await set_ctx(ctx,collector_ref,ArgumentType);
                    await set_ctx(ctx,element_list,"arg");
                    if (check_true (await not(body_is_block_ques_))){
                         for_body=await make_do_block(for_body)
                    };
                    prebuild=await build_fn_with_assignment(body_function_ref,(for_body && for_body["val"]),idx_iters,ctx);
                    await async function(){
                        let __target_obj__560=ctx;
                        __target_obj__560["return_last_value"]=true;
                        return __target_obj__560;
                        
                    }();
                    (acc).push(await compile(prebuild,ctx));
                    await (async function() {
                        let __for_body__563=async function(t) {
                             return  (acc).push(t)
                        };
                        let __array__564=[],__elements__562=["let"," ",collector_ref,"=","[]",",",element_list,"=",await wrap_assignment_value(await compile(elements,ctx),ctx),";"];
                        let __BREAK__FLAG__=false;
                        for(let __iter__561 in __elements__562) {
                            __array__564.push(await __for_body__563(__elements__562[__iter__561]));
                            if(__BREAK__FLAG__) {
                                 __array__564.pop();
                                break;
                                
                            }
                        }return __array__564;
                         
                    })();
                    await (async function() {
                        let __for_body__567=async function(t) {
                             return  (acc).push(t)
                        };
                        let __array__568=[],__elements__566=["let"," ",break_out,"=","false",";"];
                        let __BREAK__FLAG__=false;
                        for(let __iter__565 in __elements__566) {
                            __array__568.push(await __for_body__567(__elements__566[__iter__565]));
                            if(__BREAK__FLAG__) {
                                 __array__568.pop();
                                break;
                                
                            }
                        }return __array__568;
                         
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
                                let __for_body__571=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__572=[],__elements__570=["for","(","let"," ",idx_iter," ","in"," ",element_list,")"," ","{"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__569 in __elements__570) {
                                    __array__572.push(await __for_body__571(__elements__570[__iter__569]));
                                    if(__BREAK__FLAG__) {
                                         __array__572.pop();
                                        break;
                                        
                                    }
                                }return __array__572;
                                 
                            })();
                            await (async function() {
                                let __for_body__575=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__576=[],__elements__574=await (async function(){
                                    let __array_op_rval__577=collector_ref;
                                     if (__array_op_rval__577 instanceof Function){
                                        return await __array_op_rval__577(".","push","(",(preamble && preamble["0"])," ",body_function_ref,"(",element_list,"[",idx_iter,"]",")",")",";") 
                                    } else {
                                        return[__array_op_rval__577,".","push","(",(preamble && preamble["0"])," ",body_function_ref,"(",element_list,"[",idx_iter,"]",")",")",";"]
                                    }
                                })();
                                let __BREAK__FLAG__=false;
                                for(let __iter__573 in __elements__574) {
                                    __array__576.push(await __for_body__575(__elements__574[__iter__573]));
                                    if(__BREAK__FLAG__) {
                                         __array__576.pop();
                                        break;
                                        
                                    }
                                }return __array__576;
                                 
                            })();
                            await (async function() {
                                let __for_body__580=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__581=[],__elements__579=["if","(",break_out,")"," ","{"," ",collector_ref,".","pop","()",";","break",";","}"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__578 in __elements__579) {
                                    __array__581.push(await __for_body__580(__elements__579[__iter__578]));
                                    if(__BREAK__FLAG__) {
                                         __array__581.pop();
                                        break;
                                        
                                    }
                                }return __array__581;
                                 
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
                        let __for_body__584=async function(t) {
                             return  (prebuild).push(t)
                        };
                        let __array__585=[],__elements__583=["let"," ",break_out,"=","false",";"];
                        let __BREAK__FLAG__=false;
                        for(let __iter__582 in __elements__583) {
                            __array__585.push(await __for_body__584(__elements__583[__iter__582]));
                            if(__BREAK__FLAG__) {
                                 __array__585.pop();
                                break;
                                
                            }
                        }return __array__585;
                         
                    })();
                    await (async function() {
                        let __for_body__588=async function(t) {
                             return  (prebuild).push(t)
                        };
                        let __array__589=[],__elements__587=["while","(",(preamble && preamble["0"])," ",test_condition_ref,"()",")"," ","{",(preamble && preamble["0"])," ",body_ref,"()",";"," ","if","(",break_out,")"," ","{"," ","break",";","}","}"," ","",";"];
                        let __BREAK__FLAG__=false;
                        for(let __iter__586 in __elements__587) {
                            __array__589.push(await __for_body__588(__elements__587[__iter__586]));
                            if(__BREAK__FLAG__) {
                                 __array__589.pop();
                                break;
                                
                            }
                        }return __array__589;
                         
                    })();
                    await (async function() {
                        let __for_body__592=async function(t) {
                             return  (acc).push(t)
                        };
                        let __array__593=[],__elements__591=await (async function(){
                            let __array_op_rval__594=(preamble && preamble["0"]);
                             if (__array_op_rval__594 instanceof Function){
                                return await __array_op_rval__594(" ","(",(preamble && preamble["1"])," ","function","()","{"," ",prebuild,"}",")","()") 
                            } else {
                                return[__array_op_rval__594," ","(",(preamble && preamble["1"])," ","function","()","{"," ",prebuild,"}",")","()"]
                            }
                        })();
                        let __BREAK__FLAG__=false;
                        for(let __iter__590 in __elements__591) {
                            __array__593.push(await __for_body__592(__elements__591[__iter__590]));
                            if(__BREAK__FLAG__) {
                                 __array__593.pop();
                                break;
                                
                            }
                        }return __array__593;
                         
                    })();
                     return  acc
                };
                compile_for_with=async function(tokens,ctx,preamble) {
                    preamble=await calling_preamble(ctx);
                     return  await (async function(){
                        let __array_op_rval__595=(preamble && preamble["2"]);
                         if (__array_op_rval__595 instanceof Function){
                            return await __array_op_rval__595((preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ","{",await compile_for_with_inner(tokens,ctx,preamble)," ","}",")","()") 
                        } else {
                            return[__array_op_rval__595,(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ","{",await compile_for_with_inner(tokens,ctx,preamble)," ","}",")","()"]
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
                        let __array_op_rval__596=is_block_ques_;
                         if (__array_op_rval__596 instanceof Function){
                            return await __array_op_rval__596((for_body && for_body["val"])) 
                        } else {
                            return[__array_op_rval__596,(for_body && for_body["val"])]
                        }
                    })();
                    ;
                    if (check_true ((iter_count<1))){
                        throw new SyntaxError("Invalid for_each arguments");
                        
                    };
                    await (async function() {
                        let __for_body__599=async function(iter_ref) {
                            (idx_iters).push(await (async function(){
                                let __targ__601=for_args;
                                if (__targ__601){
                                     return(__targ__601)[iter_ref]
                                } 
                            })());
                             return  await set_ctx(ctx,await clean_quoted_reference(await (async function(){
                                let __targ__602=await last(idx_iters);
                                if (__targ__602){
                                     return(__targ__602)["name"]
                                } 
                            })()),ArgumentType)
                        };
                        let __array__600=[],__elements__598=await (await Environment.get_global("range"))(iter_count);
                        let __BREAK__FLAG__=false;
                        for(let __iter__597 in __elements__598) {
                            __array__600.push(await __for_body__599(__elements__598[__iter__597]));
                            if(__BREAK__FLAG__) {
                                 __array__600.pop();
                                break;
                                
                            }
                        }return __array__600;
                         
                    })();
                    await set_ctx(ctx,generator_expression,"arg");
                    if (check_true (await not(body_is_block_ques_))){
                         for_body=await make_do_block(for_body)
                    };
                    prebuild=await build_fn_with_assignment(body_function_ref,(for_body && for_body["val"]),idx_iters,ctx);
                    await async function(){
                        let __target_obj__603=ctx;
                        __target_obj__603["return_last_value"]=true;
                        return __target_obj__603;
                        
                    }();
                    (acc).push(await compile(prebuild,ctx));
                    await (async function() {
                        let __for_body__606=async function(t) {
                             return  (acc).push(t)
                        };
                        let __array__607=[],__elements__605=["let"," ",break_out,"=","false",";"];
                        let __BREAK__FLAG__=false;
                        for(let __iter__604 in __elements__605) {
                            __array__607.push(await __for_body__606(__elements__605[__iter__604]));
                            if(__BREAK__FLAG__) {
                                 __array__607.pop();
                                break;
                                
                            }
                        }return __array__607;
                         
                    })();
                    await set_ctx(ctx,body_function_ref,AsyncFunction);
                    await async function(){
                        if (check_true( (((for_args && for_args.length)===2)&&await not(((for_args && for_args["1"]) instanceof Array))))) {
                            await (async function() {
                                let __for_body__610=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__611=[],__elements__609=["for"," ",(preamble && preamble["0"])," ","(","const"," ",iter_ref," ","of"," ",await wrap_assignment_value(await compile(elements,ctx),ctx),")"," ","{"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__608 in __elements__609) {
                                    __array__611.push(await __for_body__610(__elements__609[__iter__608]));
                                    if(__BREAK__FLAG__) {
                                         __array__611.pop();
                                        break;
                                        
                                    }
                                }return __array__611;
                                 
                            })();
                            await (async function() {
                                let __for_body__614=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__615=[],__elements__613=await (async function(){
                                    let __array_op_rval__616=(preamble && preamble["0"]);
                                     if (__array_op_rval__616 instanceof Function){
                                        return await __array_op_rval__616(" ",body_function_ref,"(",iter_ref,")",";") 
                                    } else {
                                        return[__array_op_rval__616," ",body_function_ref,"(",iter_ref,")",";"]
                                    }
                                })();
                                let __BREAK__FLAG__=false;
                                for(let __iter__612 in __elements__613) {
                                    __array__615.push(await __for_body__614(__elements__613[__iter__612]));
                                    if(__BREAK__FLAG__) {
                                         __array__615.pop();
                                        break;
                                        
                                    }
                                }return __array__615;
                                 
                            })();
                            await (async function() {
                                let __for_body__619=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__620=[],__elements__618=["if","(",break_out,")"," ","break",";"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__617 in __elements__618) {
                                    __array__620.push(await __for_body__619(__elements__618[__iter__617]));
                                    if(__BREAK__FLAG__) {
                                         __array__620.pop();
                                        break;
                                        
                                    }
                                }return __array__620;
                                 
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
                        let __for_body__623=async function(exp) {
                            declaration=(exp && exp["val"] && exp["val"]["0"] && exp["val"]["0"]["name"]);
                            targeted=await (await Environment.get_global("rest"))((exp && exp["val"]));
                            if (check_true (await (async function(){
                                let __array_op_rval__625=verbosity;
                                 if (__array_op_rval__625 instanceof Function){
                                    return await __array_op_rval__625(ctx) 
                                } else {
                                    return[__array_op_rval__625,ctx]
                                }
                            })())){
                                 await (async function(){
                                    let __array_op_rval__626=declare_log;
                                     if (__array_op_rval__626 instanceof Function){
                                        return await __array_op_rval__626("declaration: ",declaration,"targeted: ",await (await Environment.get_global("each"))(targeted,"name"),targeted) 
                                    } else {
                                        return[__array_op_rval__626,"declaration: ",declaration,"targeted: ",await (await Environment.get_global("each"))(targeted,"name"),targeted]
                                    }
                                })()
                            };
                             return  await async function(){
                                if (check_true( (declaration==="toplevel"))) {
                                    await async function(){
                                        let __target_obj__627=opts;
                                        __target_obj__627["root_environment"]=(targeted && targeted["0"]);
                                        return __target_obj__627;
                                        
                                    }();
                                    if (check_true ((opts && opts["root_environment"]))){
                                          return env_ref=""
                                    } else {
                                          return env_ref="Environment."
                                    }
                                } else if (check_true( (declaration==="include"))) {
                                     return  await (async function() {
                                        let __for_body__630=async function(name) {
                                            sanitized_name=await sanitize_js_ref_name(name);
                                            dec_struct=await get_declaration_details(ctx,name);
                                            if (check_true (dec_struct)){
                                                await (async function() {
                                                    let __for_body__634=async function(t) {
                                                         return  (acc).push(t)
                                                    };
                                                    let __array__635=[],__elements__633=["let"," ",sanitized_name,"="];
                                                    let __BREAK__FLAG__=false;
                                                    for(let __iter__632 in __elements__633) {
                                                        __array__635.push(await __for_body__634(__elements__633[__iter__632]));
                                                        if(__BREAK__FLAG__) {
                                                             __array__635.pop();
                                                            break;
                                                            
                                                        }
                                                    }return __array__635;
                                                     
                                                })();
                                                await async function(){
                                                    if (check_true( ((dec_struct && dec_struct["value"]) instanceof Function&&await (async function(){
                                                        let __targ__637=await (async function(){
                                                            let __targ__636=(Environment && Environment["definitions"]);
                                                            if (__targ__636){
                                                                 return(__targ__636)[name]
                                                            } 
                                                        })();
                                                        if (__targ__637){
                                                             return(__targ__637)["fn_body"]
                                                        } 
                                                    })()))) {
                                                        details=await (async function(){
                                                            let __targ__638=(Environment && Environment["definitions"]);
                                                            if (__targ__638){
                                                                 return(__targ__638)[name]
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
                                                let __targ__639=await get_declarations(ctx,name);
                                                if (__targ__639){
                                                     return(__targ__639)["type"]
                                                } 
                                            })())&&(dec_struct && dec_struct["value"]) instanceof Function))){
                                                  return await set_declaration(ctx,name,"type",Function)
                                            }
                                        };
                                        let __array__631=[],__elements__629=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__628 in __elements__629) {
                                            __array__631.push(await __for_body__630(__elements__629[__iter__628]));
                                            if(__BREAK__FLAG__) {
                                                 __array__631.pop();
                                                break;
                                                
                                            }
                                        }return __array__631;
                                         
                                    })()
                                } else if (check_true( (declaration==="verbose"))) {
                                    let verbosity_level=await parseInt(await first(await (await Environment.get_global("each"))(targeted,"name")));
                                    ;
                                    if (check_true (await not(await isNaN(verbosity_level)))){
                                        if (check_true ((verbosity_level>0))){
                                             await set_ctx(ctx,"__VERBOSITY__",verbosity_level)
                                        } else {
                                            await (async function(){
                                                let __array_op_rval__640=declare_log;
                                                 if (__array_op_rval__640 instanceof Function){
                                                    return await __array_op_rval__640("verbosity: turned off") 
                                                } else {
                                                    return[__array_op_rval__640,"verbosity: turned off"]
                                                }
                                            })();
                                            verbosity=silence;
                                             await set_ctx(ctx,"__VERBOSITY__",null)
                                        };
                                        verbosity=check_verbosity;
                                         return  await (async function(){
                                            let __array_op_rval__642=declare_log;
                                             if (__array_op_rval__642 instanceof Function){
                                                return await __array_op_rval__642("compiler: verbosity set: ",await (async function(){
                                                    let __array_op_rval__641=verbosity;
                                                     if (__array_op_rval__641 instanceof Function){
                                                        return await __array_op_rval__641(ctx) 
                                                    } else {
                                                        return[__array_op_rval__641,ctx]
                                                    }
                                                })()) 
                                            } else {
                                                return[__array_op_rval__642,"compiler: verbosity set: ",await (async function(){
                                                    let __array_op_rval__641=verbosity;
                                                     if (__array_op_rval__641 instanceof Function){
                                                        return await __array_op_rval__641(ctx) 
                                                    } else {
                                                        return[__array_op_rval__641,ctx]
                                                    }
                                                })()]
                                            }
                                        })()
                                    } else {
                                         (warnings).push("invalid verbosity declaration, expected number, received ")
                                    }
                                } else if (check_true( (declaration==="local"))) {
                                     return await (async function() {
                                        let __for_body__645=async function(name) {
                                            dec_struct=await get_declaration_details(ctx,name);
                                             return  await set_ctx(ctx,name,(dec_struct && dec_struct["value"]))
                                        };
                                        let __array__646=[],__elements__644=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__643 in __elements__644) {
                                            __array__646.push(await __for_body__645(__elements__644[__iter__643]));
                                            if(__BREAK__FLAG__) {
                                                 __array__646.pop();
                                                break;
                                                
                                            }
                                        }return __array__646;
                                         
                                    })()
                                } else if (check_true( (declaration==="function"))) {
                                     return  await (async function() {
                                        let __for_body__649=async function(name) {
                                             return  await set_declaration(ctx,name,"type",Function)
                                        };
                                        let __array__650=[],__elements__648=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__647 in __elements__648) {
                                            __array__650.push(await __for_body__649(__elements__648[__iter__647]));
                                            if(__BREAK__FLAG__) {
                                                 __array__650.pop();
                                                break;
                                                
                                            }
                                        }return __array__650;
                                         
                                    })()
                                } else if (check_true( (declaration==="array"))) {
                                     return  await (async function() {
                                        let __for_body__653=async function(name) {
                                             return  await set_declaration(ctx,name,"type",Array)
                                        };
                                        let __array__654=[],__elements__652=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__651 in __elements__652) {
                                            __array__654.push(await __for_body__653(__elements__652[__iter__651]));
                                            if(__BREAK__FLAG__) {
                                                 __array__654.pop();
                                                break;
                                                
                                            }
                                        }return __array__654;
                                         
                                    })()
                                } else if (check_true( (declaration==="number"))) {
                                     return  await (async function() {
                                        let __for_body__657=async function(name) {
                                             return  await set_declaration(ctx,name,"type",Number)
                                        };
                                        let __array__658=[],__elements__656=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__655 in __elements__656) {
                                            __array__658.push(await __for_body__657(__elements__656[__iter__655]));
                                            if(__BREAK__FLAG__) {
                                                 __array__658.pop();
                                                break;
                                                
                                            }
                                        }return __array__658;
                                         
                                    })()
                                } else if (check_true( (declaration==="string"))) {
                                     return  await (async function() {
                                        let __for_body__661=async function(name) {
                                             return  await set_declaration(ctx,name,"type",String)
                                        };
                                        let __array__662=[],__elements__660=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__659 in __elements__660) {
                                            __array__662.push(await __for_body__661(__elements__660[__iter__659]));
                                            if(__BREAK__FLAG__) {
                                                 __array__662.pop();
                                                break;
                                                
                                            }
                                        }return __array__662;
                                         
                                    })()
                                } else if (check_true( (declaration==="boolean"))) {
                                     return  await (async function() {
                                        let __for_body__665=async function(name) {
                                             return  await set_declaration(ctx,name,"type",Boolean)
                                        };
                                        let __array__666=[],__elements__664=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__663 in __elements__664) {
                                            __array__666.push(await __for_body__665(__elements__664[__iter__663]));
                                            if(__BREAK__FLAG__) {
                                                 __array__666.pop();
                                                break;
                                                
                                            }
                                        }return __array__666;
                                         
                                    })()
                                } else if (check_true( (declaration==="regexp"))) {
                                     return  await (async function() {
                                        let __for_body__669=async function(name) {
                                             return  await set_declaration(ctx,name,"type",RegExp)
                                        };
                                        let __array__670=[],__elements__668=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__667 in __elements__668) {
                                            __array__670.push(await __for_body__669(__elements__668[__iter__667]));
                                            if(__BREAK__FLAG__) {
                                                 __array__670.pop();
                                                break;
                                                
                                            }
                                        }return __array__670;
                                         
                                    })()
                                } else if (check_true( (declaration==="object"))) {
                                     return  await (async function() {
                                        let __for_body__673=async function(name) {
                                             return  await set_declaration(ctx,name,"type",Object)
                                        };
                                        let __array__674=[],__elements__672=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__671 in __elements__672) {
                                            __array__674.push(await __for_body__673(__elements__672[__iter__671]));
                                            if(__BREAK__FLAG__) {
                                                 __array__674.pop();
                                                break;
                                                
                                            }
                                        }return __array__674;
                                         
                                    })()
                                } else if (check_true( (declaration==="optimize"))) {
                                     return  await (async function() {
                                        let __for_body__677=async function(factor) {
                                            factor=await (await Environment.get_global("each"))(factor,"name");
                                             return  await async function(){
                                                if (check_true( ((factor && factor["0"])==="safety"))) {
                                                     return await set_declaration(ctx,"__SAFETY__","level",(factor && factor["1"]))
                                                }
                                            } ()
                                        };
                                        let __array__678=[],__elements__676=await (await Environment.get_global("each"))(targeted,"val");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__675 in __elements__676) {
                                            __array__678.push(await __for_body__677(__elements__676[__iter__675]));
                                            if(__BREAK__FLAG__) {
                                                 __array__678.pop();
                                                break;
                                                
                                            }
                                        }return __array__678;
                                         
                                    })()
                                } else  {
                                    (warnings).push(("unknown declaration directive: "+declaration));
                                     return  await (await Environment.get_global("warn"))(("compiler: unknown declaration directive: "+declaration))
                                }
                            } ()
                        };
                        let __array__624=[],__elements__622=expressions;
                        let __BREAK__FLAG__=false;
                        for(let __iter__621 in __elements__622) {
                            __array__624.push(await __for_body__623(__elements__622[__iter__621]));
                            if(__BREAK__FLAG__) {
                                 __array__624.pop();
                                break;
                                
                            }
                        }return __array__624;
                         
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
                                    let __array_op_rval__679=(preamble && preamble["2"]);
                                     if (__array_op_rval__679 instanceof Function){
                                        return await __array_op_rval__679((preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ","{"," ",stmt," ","}"," ",")","()") 
                                    } else {
                                        return[__array_op_rval__679,(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ","{"," ",stmt," ","}"," ",")","()"]
                                    }
                                })()
                            } else {
                                  return await (async function(){
                                    let __array_op_rval__680=(preamble && preamble["2"]);
                                     if (__array_op_rval__680 instanceof Function){
                                        return await __array_op_rval__680((preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ",stmt," ",")","()") 
                                    } else {
                                        return[__array_op_rval__680,(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ",stmt," ",")","()"]
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
                        let __array_op_rval__681=verbosity;
                         if (__array_op_rval__681 instanceof Function){
                            return await __array_op_rval__681(ctx) 
                        } else {
                            return[__array_op_rval__681,ctx]
                        }
                    })())){
                         await (async function(){
                            let __array_op_rval__682=sr_log;
                             if (__array_op_rval__682 instanceof Function){
                                return await __array_op_rval__682("where/what->",call_type,"/",ref_type,"for symbol: ",(tokens && tokens["0"] && tokens["0"]["name"])) 
                            } else {
                                return[__array_op_rval__682,"where/what->",call_type,"/",ref_type,"for symbol: ",(tokens && tokens["0"] && tokens["0"]["name"])]
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
                                 let __test_condition__683=async function() {
                                     return  (idx<((tokens && tokens.length)-1))
                                };
                                let __body_ref__684=async function() {
                                    idx+=1;
                                    token=await (async function(){
                                        let __targ__685=tokens;
                                        if (__targ__685){
                                             return(__targ__685)[idx]
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
                                while(await __test_condition__683()) {
                                    await __body_ref__684();
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
                                 let __test_condition__686=async function() {
                                     return  (idx<((tokens && tokens.length)-1))
                                };
                                let __body_ref__687=async function() {
                                    idx+=1;
                                    token=await (async function(){
                                        let __targ__688=tokens;
                                        if (__targ__688){
                                             return(__targ__688)[idx]
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
                                while(await __test_condition__686()) {
                                    await __body_ref__687();
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
                                 let __test_condition__689=async function() {
                                     return  (idx<(tokens && tokens.length))
                                };
                                let __body_ref__690=async function() {
                                    token=await (async function(){
                                        let __targ__691=tokens;
                                        if (__targ__691){
                                             return(__targ__691)[idx]
                                        } 
                                    })();
                                    (acc).push(await compile(token,ctx));
                                    if (check_true ((idx<((tokens && tokens.length)-1)))){
                                         (acc).push(",")
                                    };
                                     return  idx+=1
                                };
                                let __BREAK__FLAG__=false;
                                while(await __test_condition__689()) {
                                    await __body_ref__690();
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
                        let __array_op_rval__692=is_block_ques_;
                         if (__array_op_rval__692 instanceof Function){
                            return await __array_op_rval__692(tokens) 
                        } else {
                            return[__array_op_rval__692,tokens]
                        }
                    })()||(((tokens && tokens["type"])==="arr")&&await (async function(){
                        let __array_op_rval__693=is_block_ques_;
                         if (__array_op_rval__693 instanceof Function){
                            return await __array_op_rval__693((tokens && tokens["val"])) 
                        } else {
                            return[__array_op_rval__693,(tokens && tokens["val"])]
                        }
                    })())||((tokens && tokens["val"] && tokens["val"]["0"] && tokens["val"]["0"]["name"])==="if")||((tokens && tokens["val"] && tokens["val"]["0"] && tokens["val"]["0"]["name"])==="let"));
                     return  rval
                };
                is_form_ques_=async function(token) {
                     return  (((token && token["val"]) instanceof Array)||await (async function(){
                        let __array_op_rval__694=is_block_ques_;
                         if (__array_op_rval__694 instanceof Function){
                            return await __array_op_rval__694((token && token["val"])) 
                        } else {
                            return[__array_op_rval__694,(token && token["val"])]
                        }
                    })())
                };
                op_lookup=await ( async function(){
                    let __obj__695=new Object();
                    __obj__695["+"]=infix_ops;
                    __obj__695["*"]=infix_ops;
                    __obj__695["/"]=infix_ops;
                    __obj__695["-"]=infix_ops;
                    __obj__695["**"]=infix_ops;
                    __obj__695["%"]=infix_ops;
                    __obj__695["<<"]=infix_ops;
                    __obj__695[">>"]=infix_ops;
                    __obj__695["and"]=infix_ops;
                    __obj__695["or"]=infix_ops;
                    __obj__695["apply"]=compile_apply;
                    __obj__695["call"]=compile_call;
                    __obj__695["->"]=compile_call;
                    __obj__695["set_prop"]=compile_set_prop;
                    __obj__695["prop"]=compile_prop;
                    __obj__695["="]=compile_assignment;
                    __obj__695["setq"]=compile_assignment;
                    __obj__695["=="]=compile_compare;
                    __obj__695["eq"]=compile_compare;
                    __obj__695[">"]=compile_compare;
                    __obj__695["<"]=compile_compare;
                    __obj__695["<="]=compile_compare;
                    __obj__695[">="]=compile_compare;
                    __obj__695["return"]=compile_return;
                    __obj__695["new"]=compile_new;
                    __obj__695["do"]=compile_block;
                    __obj__695["progn"]=compile_block;
                    __obj__695["progl"]=async function(tokens,ctx) {
                         return  await compile_block(tokens,ctx,{
                            no_scope_boundary:true,suppress_return:"true"
                        })
                    };
                    __obj__695["break"]=compile_break;
                    __obj__695["inc"]=compile_val_mod;
                    __obj__695["dec"]=compile_val_mod;
                    __obj__695["try"]=compile_try;
                    __obj__695["throw"]=compile_throw;
                    __obj__695["let"]=compile_let;
                    __obj__695["defvar"]=compile_defvar;
                    __obj__695["while"]=compile_while;
                    __obj__695["for_each"]=compile_for_each;
                    __obj__695["if"]=compile_if;
                    __obj__695["cond"]=compile_cond;
                    __obj__695["fn"]=compile_fn;
                    __obj__695["lambda"]=compile_fn;
                    __obj__695["function*"]=async function(tokens,ctx) {
                         return  await compile_fn(tokens,ctx,{
                            generator:true
                        })
                    };
                    __obj__695["defglobal"]=compile_set_global;
                    __obj__695["list"]=compile_list;
                    __obj__695["function"]=async function(tokens,ctx) {
                         return  await compile_fn(tokens,ctx,{
                            synchronous:true
                        })
                    };
                    __obj__695["=>"]=async function(tokens,ctx) {
                         return  await compile_fn(tokens,ctx,{
                            arrow:true
                        })
                    };
                    __obj__695["yield"]=compile_yield;
                    __obj__695["for_with"]=compile_for_with;
                    __obj__695["quotem"]=compile_quotem;
                    __obj__695["quote"]=compile_quote;
                    __obj__695["quotel"]=compile_quotel;
                    __obj__695["evalq"]=compile_evalq;
                    __obj__695["eval"]=compile_eval;
                    __obj__695["jslambda"]=compile_jslambda;
                    __obj__695["javascript"]=compile_javascript;
                    __obj__695["instanceof"]=compile_instanceof;
                    __obj__695["typeof"]=compile_typeof;
                    __obj__695["unquotem"]=compile_unquotem;
                    __obj__695["debug"]=compile_debug;
                    __obj__695["declare"]=compile_declare;
                    __obj__695["import"]=compile_import;
                    __obj__695["dynamic_import"]=compile_dynamic_import;
                    return __obj__695;
                    
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
                                    let __array_op_rval__696=(preamble && preamble["2"]);
                                     if (__array_op_rval__696 instanceof Function){
                                        return await __array_op_rval__696((preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ",stmt," ",")","()") 
                                    } else {
                                        return[__array_op_rval__696,(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ",stmt," ",")","()"]
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
                        let __target_obj__697=ctx;
                        __target_obj__697["in_obj_literal"]=true;
                        return __target_obj__697;
                        
                    }();
                    await (async function() {
                        let __for_body__700=async function(token) {
                            if (check_true ((((token && token["type"])==="keyval")&&await check_invalid_js_ref((token && token.name))))){
                                has_valid_key_literals=false;
                                __BREAK__FLAG__=true;
                                return
                            }
                        };
                        let __array__701=[],__elements__699=((tokens && tokens["val"])||[]);
                        let __BREAK__FLAG__=false;
                        for(let __iter__698 in __elements__699) {
                            __array__701.push(await __for_body__700(__elements__699[__iter__698]));
                            if(__BREAK__FLAG__) {
                                 __array__701.pop();
                                break;
                                
                            }
                        }return __array__701;
                         
                    })();
                    if (check_true (has_valid_key_literals)){
                         if (check_true (((tokens && tokens["val"] && tokens["val"]["name"])==="{}"))){
                              return [{
                                ctype:"objliteral"
                            },"new Object()"]
                        } else {
                            (acc).push("{");
                            await (async function(){
                                 let __test_condition__702=async function() {
                                     return  (idx<total_length)
                                };
                                let __body_ref__703=async function() {
                                    idx+=1;
                                    kvpair=await (async function(){
                                        let __targ__704=(tokens && tokens["val"]);
                                        if (__targ__704){
                                             return(__targ__704)[idx]
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
                                while(await __test_condition__702()) {
                                    await __body_ref__703();
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
                            let __for_body__707=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__708=[],__elements__706=[{
                                ctype:"statement"
                            },(preamble && preamble["0"])," ","("," ",(preamble && preamble["1"])," ","function","()","{","let"," ",tmp_name,"=","new"," ","Object","()",";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__705 in __elements__706) {
                                __array__708.push(await __for_body__707(__elements__706[__iter__705]));
                                if(__BREAK__FLAG__) {
                                     __array__708.pop();
                                    break;
                                    
                                }
                            }return __array__708;
                             
                        })();
                        await (async function(){
                             let __test_condition__709=async function() {
                                 return  (idx<total_length)
                            };
                            let __body_ref__710=async function() {
                                idx+=1;
                                kvpair=await (async function(){
                                    let __targ__711=(tokens && tokens["val"]);
                                    if (__targ__711){
                                         return(__targ__711)[idx]
                                    } 
                                })();
                                 return  await (async function() {
                                    let __for_body__714=async function(t) {
                                         return  (acc).push(t)
                                    };
                                    let __array__715=[],__elements__713=await (async function(){
                                        let __array_op_rval__716=tmp_name;
                                         if (__array_op_rval__716 instanceof Function){
                                            return await __array_op_rval__716("[","\"",await cl_encode_string(await get_val((kvpair && kvpair["val"] && kvpair["val"]["0"]),ctx)),"\"","]","=",await compile_elem((kvpair && kvpair["val"] && kvpair["val"]["1"]),ctx),";") 
                                        } else {
                                            return[__array_op_rval__716,"[","\"",await cl_encode_string(await get_val((kvpair && kvpair["val"] && kvpair["val"]["0"]),ctx)),"\"","]","=",await compile_elem((kvpair && kvpair["val"] && kvpair["val"]["1"]),ctx),";"]
                                        }
                                    })();
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__712 in __elements__713) {
                                        __array__715.push(await __for_body__714(__elements__713[__iter__712]));
                                        if(__BREAK__FLAG__) {
                                             __array__715.pop();
                                            break;
                                            
                                        }
                                    }return __array__715;
                                     
                                })()
                            };
                            let __BREAK__FLAG__=false;
                            while(await __test_condition__709()) {
                                await __body_ref__710();
                                 if(__BREAK__FLAG__) {
                                     break;
                                    
                                }
                            } ;
                            
                        })();
                        await (async function() {
                            let __for_body__719=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__720=[],__elements__718=["return"," ",tmp_name,";","}",")","()"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__717 in __elements__718) {
                                __array__720.push(await __for_body__719(__elements__718[__iter__717]));
                                if(__BREAK__FLAG__) {
                                     __array__720.pop();
                                    break;
                                    
                                }
                            }return __array__720;
                             
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
                                    let __array_op_rval__724=(preamble && preamble["2"]);
                                     if (__array_op_rval__724 instanceof Function){
                                        return await __array_op_rval__724((preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ",stmt," ",")","()") 
                                    } else {
                                        return[__array_op_rval__724,(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ",stmt," ",")","()"]
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
                                    let __array_op_rval__726=error_log;
                                     if (__array_op_rval__726 instanceof Function){
                                        return await __array_op_rval__726("compile: nil ctx: ",tokens) 
                                    } else {
                                        return[__array_op_rval__726,"compile: nil ctx: ",tokens]
                                    }
                                })();
                                throw new Error("compile: nil ctx");
                                
                            } else {
                                  return await async function(){
                                    if (check_true( (await is_number_ques_(tokens)||(tokens instanceof String || typeof tokens==='string')||(await sub_type(tokens)==="Boolean")))) {
                                         return tokens
                                    } else if (check_true( ((tokens instanceof Array)&&(tokens && tokens["0"] && tokens["0"]["ref"])&&await not((await get_ctx(ctx,(tokens && tokens["0"] && tokens["0"]["name"]))===UnknownType))&&(await (async function(){
                                        let __targ__727=op_lookup;
                                        if (__targ__727){
                                             return(__targ__727)[(tokens && tokens["0"] && tokens["0"]["name"])]
                                        } 
                                    })()||(Function===await get_ctx(ctx,(tokens && tokens["0"] && tokens["0"]["name"])))||(AsyncFunction===await get_ctx(ctx,(tokens && tokens["0"] && tokens["0"]["name"])))||("function"===typeof await (async function(){
                                        let __targ__728=(root_ctx && root_ctx["defined_lisp_globals"]);
                                        if (__targ__728){
                                             return(__targ__728)[(tokens && tokens["0"] && tokens["0"]["name"])]
                                        } 
                                    })())||await get_lisp_ctx((tokens && tokens["0"] && tokens["0"]["name"])) instanceof Function)))) {
                                        op_token=await first(tokens);
                                        operator=await (async function(){
                                            let __targ__729=op_token;
                                            if (__targ__729){
                                                 return(__targ__729)["name"]
                                            } 
                                        })();
                                        operator_type=await (async function(){
                                            let __targ__730=op_token;
                                            if (__targ__730){
                                                 return(__targ__730)["val"]
                                            } 
                                        })();
                                        ref=await (async function(){
                                            let __targ__731=op_token;
                                            if (__targ__731){
                                                 return(__targ__731)["ref"]
                                            } 
                                        })();
                                        op=await (async function(){
                                            let __targ__732=op_lookup;
                                            if (__targ__732){
                                                 return(__targ__732)[operator]
                                            } 
                                        })();
                                         return  await async function(){
                                            if (check_true(op)) {
                                                 return await (async function(){
                                                    let __array_op_rval__733=op;
                                                     if (__array_op_rval__733 instanceof Function){
                                                        return await __array_op_rval__733(tokens,ctx) 
                                                    } else {
                                                        return[__array_op_rval__733,tokens,ctx]
                                                    }
                                                })()
                                            } else if (check_true( await (async function(){
                                                let __targ__734=(Environment && Environment["inlines"]);
                                                if (__targ__734){
                                                     return(__targ__734)[operator]
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
                                                    let __for_body__737=async function(t) {
                                                        if (check_true (await not(await get_ctx_val(ctx,"__IN_LAMBDA__")))){
                                                             await set_ctx(ctx,"__LAMBDA_STEP__",0)
                                                        };
                                                         return  (compiled_values).push(await compile(t,ctx,await add(_cdepth,1)))
                                                    };
                                                    let __array__738=[],__elements__736=await (await Environment.get_global("rest"))(tokens);
                                                    let __BREAK__FLAG__=false;
                                                    for(let __iter__735 in __elements__736) {
                                                        __array__738.push(await __for_body__737(__elements__736[__iter__735]));
                                                        if(__BREAK__FLAG__) {
                                                             __array__738.pop();
                                                            break;
                                                            
                                                        }
                                                    }return __array__738;
                                                     
                                                })();
                                                await map(async function(compiled_element,idx) {
                                                    let inst;
                                                    inst=await (async function () {
                                                         if (check_true ((((compiled_element && compiled_element["0"]) instanceof Object)&&await (async function(){
                                                            let __targ__739=(compiled_element && compiled_element["0"]);
                                                            if (__targ__739){
                                                                 return(__targ__739)["ctype"]
                                                            } 
                                                        })()))){
                                                              return await (async function(){
                                                                let __targ__740=(compiled_element && compiled_element["0"]);
                                                                if (__targ__740){
                                                                     return(__targ__740)["ctype"]
                                                                } 
                                                            })()
                                                        } else {
                                                              return null
                                                        } 
                                                    })();
                                                     return  await async function(){
                                                        if (check_true( ((inst==="block")||(inst==="letblock")))) {
                                                             return  (symbolic_replacements).push(await (async function(){
                                                                let __array_op_rval__742=idx;
                                                                 if (__array_op_rval__742 instanceof Function){
                                                                    return await __array_op_rval__742(await gen_temp_name("array_arg"),await (async function(){
                                                                        let __array_op_rval__741=(preamble && preamble["2"]);
                                                                         if (__array_op_rval__741 instanceof Function){
                                                                            return await __array_op_rval__741("(",(preamble && preamble["1"])," ","function","()"," ",compiled_element," ",")") 
                                                                        } else {
                                                                            return[__array_op_rval__741,"(",(preamble && preamble["1"])," ","function","()"," ",compiled_element," ",")"]
                                                                        }
                                                                    })()) 
                                                                } else {
                                                                    return[__array_op_rval__742,await gen_temp_name("array_arg"),await (async function(){
                                                                        let __array_op_rval__741=(preamble && preamble["2"]);
                                                                         if (__array_op_rval__741 instanceof Function){
                                                                            return await __array_op_rval__741("(",(preamble && preamble["1"])," ","function","()"," ",compiled_element," ",")") 
                                                                        } else {
                                                                            return[__array_op_rval__741,"(",(preamble && preamble["1"])," ","function","()"," ",compiled_element," ",")"]
                                                                        }
                                                                    })()]
                                                                }
                                                            })())
                                                        } else if (check_true( (inst==="ifblock"))) {
                                                             return  (symbolic_replacements).push(await (async function(){
                                                                let __array_op_rval__744=idx;
                                                                 if (__array_op_rval__744 instanceof Function){
                                                                    return await __array_op_rval__744(await gen_temp_name("array_arg"),await (async function(){
                                                                        let __array_op_rval__743=(preamble && preamble["2"]);
                                                                         if (__array_op_rval__743 instanceof Function){
                                                                            return await __array_op_rval__743("(",(preamble && preamble["1"])," ","function","()"," ","{",compiled_element,"}"," ",")") 
                                                                        } else {
                                                                            return[__array_op_rval__743,"(",(preamble && preamble["1"])," ","function","()"," ","{",compiled_element,"}"," ",")"]
                                                                        }
                                                                    })()) 
                                                                } else {
                                                                    return[__array_op_rval__744,await gen_temp_name("array_arg"),await (async function(){
                                                                        let __array_op_rval__743=(preamble && preamble["2"]);
                                                                         if (__array_op_rval__743 instanceof Function){
                                                                            return await __array_op_rval__743("(",(preamble && preamble["1"])," ","function","()"," ","{",compiled_element,"}"," ",")") 
                                                                        } else {
                                                                            return[__array_op_rval__743,"(",(preamble && preamble["1"])," ","function","()"," ","{",compiled_element,"}"," ",")"]
                                                                        }
                                                                    })()]
                                                                }
                                                            })())
                                                        }
                                                    } ()
                                                },compiled_values);
                                                await (async function() {
                                                    let __for_body__747=async function(elem) {
                                                        await (async function() {
                                                            let __for_body__751=async function(t) {
                                                                 return  (acc).push(t)
                                                            };
                                                            let __array__752=[],__elements__750=["let"," ",(elem && elem["1"]),"=",(elem && elem["2"]),";"];
                                                            let __BREAK__FLAG__=false;
                                                            for(let __iter__749 in __elements__750) {
                                                                __array__752.push(await __for_body__751(__elements__750[__iter__749]));
                                                                if(__BREAK__FLAG__) {
                                                                     __array__752.pop();
                                                                    break;
                                                                    
                                                                }
                                                            }return __array__752;
                                                             
                                                        })();
                                                         return  await compiled_values["splice"].call(compiled_values,(elem && elem["0"]),1,await (async function(){
                                                            let __array_op_rval__753=(preamble && preamble["0"]);
                                                             if (__array_op_rval__753 instanceof Function){
                                                                return await __array_op_rval__753(" ",(elem && elem["1"]),"()") 
                                                            } else {
                                                                return[__array_op_rval__753," ",(elem && elem["1"]),"()"]
                                                            }
                                                        })())
                                                    };
                                                    let __array__748=[],__elements__746=symbolic_replacements;
                                                    let __BREAK__FLAG__=false;
                                                    for(let __iter__745 in __elements__746) {
                                                        __array__748.push(await __for_body__747(__elements__746[__iter__745]));
                                                        if(__BREAK__FLAG__) {
                                                             __array__748.pop();
                                                            break;
                                                            
                                                        }
                                                    }return __array__748;
                                                     
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
                                                            let __for_body__756=async function(t) {
                                                                 return  (acc).push(t)
                                                            };
                                                            let __array__757=[],__elements__755=["(",rcv,")","("];
                                                            let __BREAK__FLAG__=false;
                                                            for(let __iter__754 in __elements__755) {
                                                                __array__757.push(await __for_body__756(__elements__755[__iter__754]));
                                                                if(__BREAK__FLAG__) {
                                                                     __array__757.pop();
                                                                    break;
                                                                    
                                                                }
                                                            }return __array__757;
                                                             
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
                                                            let __for_body__760=async function(t) {
                                                                 return  (acc).push(t)
                                                            };
                                                            let __array__761=[],__elements__759=await (async function(){
                                                                let __array_op_rval__762=(preamble && preamble["0"]);
                                                                 if (__array_op_rval__762 instanceof Function){
                                                                    return await __array_op_rval__762(" ","(",(preamble && preamble["1"])," ","function","()","{","let"," ",tmp_name,"=",rcv,";"," ","if"," ","(",tmp_name," ","instanceof"," ","Function",")","{","return"," ",(preamble && preamble["0"])," ",tmp_name,"(") 
                                                                } else {
                                                                    return[__array_op_rval__762," ","(",(preamble && preamble["1"])," ","function","()","{","let"," ",tmp_name,"=",rcv,";"," ","if"," ","(",tmp_name," ","instanceof"," ","Function",")","{","return"," ",(preamble && preamble["0"])," ",tmp_name,"("]
                                                                }
                                                            })();
                                                            let __BREAK__FLAG__=false;
                                                            for(let __iter__758 in __elements__759) {
                                                                __array__761.push(await __for_body__760(__elements__759[__iter__758]));
                                                                if(__BREAK__FLAG__) {
                                                                     __array__761.pop();
                                                                    break;
                                                                    
                                                                }
                                                            }return __array__761;
                                                             
                                                        })();
                                                        await push_as_arg_list(acc,compiled_values);
                                                        await (async function() {
                                                            let __for_body__765=async function(t) {
                                                                 return  (acc).push(t)
                                                            };
                                                            let __array__766=[],__elements__764=[")"," ","}"," ","else"," ","{","return","[",tmp_name];
                                                            let __BREAK__FLAG__=false;
                                                            for(let __iter__763 in __elements__764) {
                                                                __array__766.push(await __for_body__765(__elements__764[__iter__763]));
                                                                if(__BREAK__FLAG__) {
                                                                     __array__766.pop();
                                                                    break;
                                                                    
                                                                }
                                                            }return __array__766;
                                                             
                                                        })();
                                                        if (check_true ((await length(await (await Environment.get_global("rest"))(tokens))>0))){
                                                            (acc).push(",");
                                                             await push_as_arg_list(acc,compiled_values)
                                                        };
                                                         return  await (async function() {
                                                            let __for_body__769=async function(t) {
                                                                 return  (acc).push(t)
                                                            };
                                                            let __array__770=[],__elements__768=["]","}","}",")","()"];
                                                            let __BREAK__FLAG__=false;
                                                            for(let __iter__767 in __elements__768) {
                                                                __array__770.push(await __for_body__769(__elements__768[__iter__767]));
                                                                if(__BREAK__FLAG__) {
                                                                     __array__770.pop();
                                                                    break;
                                                                    
                                                                }
                                                            }return __array__770;
                                                             
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
                                            let __target_obj__771=ctx;
                                            __target_obj__771["source"]=(tokens && tokens["source"]);
                                            return __target_obj__771;
                                            
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
                                                let __targ__772=op_lookup;
                                                if (__targ__772){
                                                     return(__targ__772)[(tokens && tokens.name)]
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
                        } catch(__exception__725) {
                              if (__exception__725 instanceof Error) {
                                 let e=__exception__725;
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
                            let __for_body__775=async function(spacer) {
                                 return  (text).push(spacer)
                            };
                            let __array__776=[],__elements__774=format_depth;
                            let __BREAK__FLAG__=false;
                            for(let __iter__773 in __elements__774) {
                                __array__776.push(await __for_body__775(__elements__774[__iter__773]));
                                if(__BREAK__FLAG__) {
                                     __array__776.pop();
                                    break;
                                    
                                }
                            }return __array__776;
                             
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
                            let __for_body__779=async function(t) {
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
                            let __array__780=[],__elements__778=js_tokens;
                            let __BREAK__FLAG__=false;
                            for(let __iter__777 in __elements__778) {
                                __array__780.push(await __for_body__779(__elements__778[__iter__777]));
                                if(__BREAK__FLAG__) {
                                     __array__780.pop();
                                    break;
                                    
                                }
                            }return __array__780;
                             
                        })()
                    };
                    {
                        await assemble(await flatten(await (async function(){
                            let __array_op_rval__781=js_tree;
                             if (__array_op_rval__781 instanceof Function){
                                return await __array_op_rval__781() 
                            } else {
                                return[__array_op_rval__781]
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
                    let __target_obj__782=root_ctx;
                    __target_obj__782["defined_lisp_globals"]=new Object();
                    return __target_obj__782;
                    
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
                            }  catch(__exception__783) {
                                  if (__exception__783 instanceof Error) {
                                     let e=__exception__783;
                                      return is_error=e
                                } 
                            }
                        })();
                        await async function(){
                            if (check_true( (is_error&&(opts && opts["throw_on_error"])))) {
                                 throw is_error;
                                
                            } else if (check_true( (is_error instanceof SyntaxError))) {
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
                                let __target_obj__784=(assembly && assembly["0"]);
                                __target_obj__784["ctype"]=await map_value_to_ctype((assembly && assembly["0"] && assembly["0"]["ctype"]));
                                return __target_obj__784;
                                
                            }()
                        };
                        await async function(){
                            if (check_true( (await not(is_error)&&assembly&&(await first(assembly) instanceof Object)&&await (async function(){
                                let __targ__785=await first(assembly);
                                if (__targ__785){
                                     return(__targ__785)["ctype"]
                                } 
                            })()&&(await not((await (async function(){
                                let __targ__786=await first(assembly);
                                if (__targ__786){
                                     return(__targ__786)["ctype"]
                                } 
                            })() instanceof String || typeof await (async function(){
                                let __targ__786=await first(assembly);
                                if (__targ__786){
                                     return(__targ__786)["ctype"]
                                } 
                            })()==='string'))||await (async function ()  {
                                let val;
                                val=await (async function(){
                                    let __targ__787=await first(assembly);
                                    if (__targ__787){
                                         return(__targ__787)["ctype"]
                                    } 
                                })();
                                 return  (await not((val==="assignment"))&&await not(await contains_ques_("block",val))&&await not(await contains_ques_("unction",val)))
                            } )())))) {
                                 return await async function(){
                                    let __target_obj__788=(assembly && assembly["0"]);
                                    __target_obj__788["ctype"]="statement";
                                    return __target_obj__788;
                                    
                                }()
                            } else if (check_true( (assembly&&(await first(assembly) instanceof String || typeof await first(assembly)==='string')&&(await first(assembly)==="throw")))) {
                                 return assembly=[{
                                    ctype:"block"
                                },assembly]
                            } else if (check_true( (await not(is_error)&&assembly&&(await not((await first(assembly) instanceof Object))||await not(await (async function(){
                                let __targ__789=await first(assembly);
                                if (__targ__789){
                                     return(__targ__789)["ctype"]
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
                        let __array_op_rval__790=(opts && opts["error_report"]);
                         if (__array_op_rval__790 instanceof Function){
                            return await __array_op_rval__790({
                                errors:errors,warnings:warnings
                            }) 
                        } else {
                            return[__array_op_rval__790,{
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
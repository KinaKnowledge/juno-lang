// Source: compiler.lisp  
// Build Time: 2022-06-30 09:08:01
// Version: 2022.06.30.09.08
export const DLISP_ENV_VERSION='2022.06.30.09.08';




var { get_next_environment_id, check_true, get_outside_global, subtype, lisp_writer, clone, LispSyntaxError } = await import("./lisp_writer.js");
export async function init_compiler(Environment) {
  return await Environment.set_global("compiler",async function(quoted_lisp,opts) {
    const __GG__=Environment.get_global;
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
                 let __test_condition__24=async function() {
                     return  (idx<(tree && tree.length))
                };
                let __body_ref__25=async function() {
                    tval=await (async function(){
                        let __targ__26=tree;
                        if (__targ__26){
                             return(__targ__26)[idx]
                        } 
                    })();
                    if (check_true ((tval===deferred_operator))){
                        idx+=1;
                        tval=await (async function(){
                            let __targ__27=tree;
                            if (__targ__27){
                                 return(__targ__27)[idx]
                            } 
                        })();
                         rval=await rval["concat"].call(rval,await do_deferred_splice(tval))
                    } else {
                         (rval).push(await do_deferred_splice(tval))
                    };
                     return  idx+=1
                };
                let __BREAK__FLAG__=false;
                while(await __test_condition__24()) {
                    await __body_ref__25();
                     if(__BREAK__FLAG__) {
                         break;
                        
                    }
                } ;
                
            })();
             return  rval
        } else if (check_true( (tree instanceof Object))) {
            rval=new Object();
            await (async function() {
                let __for_body__30=async function(pset) {
                     return  await async function(){
                        let __target_obj__32=rval;
                        __target_obj__32[(pset && pset["0"])]=await do_deferred_splice((pset && pset["1"]));
                        return __target_obj__32;
                        
                    }()
                };
                let __array__31=[],__elements__29=await (await __GG__("pairs"))(tree);
                let __BREAK__FLAG__=false;
                for(let __iter__28 in __elements__29) {
                    __array__31.push(await __for_body__30(__elements__29[__iter__28]));
                    if(__BREAK__FLAG__) {
                         __array__31.pop();
                        break;
                        
                    }
                }return __array__31;
                 
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
            let is_nil_ques_=async function(value) {     return  (null===value)
};
            let is_number_ques_=function(x) {                         return  ( subtype(x)==="Number")
                    };
            let starts_with_ques_=function anonymous(val,text) {
{ if (text instanceof Array) { return text[0]===val } else if (subtype(text)=='String') { return text.startsWith(val) } else { return false }}
};
            let cl_encode_string=async function(text) {    if (check_true ((text instanceof String || typeof text==='string'))){
        let escaped;
        let nq;
        let step1;
        let snq;
        escaped=await (await __GG__("replace"))(new RegExp("\n","g"),await (await __GG__("add"))(await String.fromCharCode(92),"n"),text);
        escaped=await (await __GG__("replace"))(new RegExp("\r","g"),await (await __GG__("add"))(await String.fromCharCode(92),"r"),escaped);
        nq=(escaped).split(await String.fromCharCode(34));
        step1=(nq).join(await (await __GG__("add"))(await String.fromCharCode(92),await String.fromCharCode(34)));
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
            let first_level_setup;
            let needs_first_level;
            let signal_error;
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
                    ;
                     return  async function(...args) {
                         return  await (async function(){
                            let __target_arg__8=[].concat(await (await __GG__("conj"))([style],args));
                            if(!__target_arg__8 instanceof Array){
                                throw new TypeError("Invalid final argument to apply - an array is required")
                            }let __pre_arg__9=("%c"+await (async function () {
                                 if (check_true ((opts && opts["prefix"]))){
                                      return (opts && opts["prefix"])
                                } else {
                                      return (args).shift()
                                } 
                            })());
                            __target_arg__8.unshift(__pre_arg__9);
                            return (console.log).apply(this,__target_arg__8)
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
            let compile_javascript;
            let compile_dynamic_import;
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
            let __compile__5= async function(){
                return async function(tokens,ctx,_cdepth) {
                    if (check_true (is_error)){
                          return is_error
                    } else {
                        let rval=await compile_inner(tokens,ctx,_cdepth);
                        ;
                        if (check_true (false)){
                             if (check_true (((rval instanceof Array)&&((rval && rval["0"]) instanceof Object)&&await (async function(){
                                let __targ__650=(rval && rval["0"]);
                                if (__targ__650){
                                     return(__targ__650)["ctype"]
                                } 
                            })()))){
                                 true
                            } else {
                                (comp_warn)("<-",(_cdepth||"-"),"unknown/undeclared type returned: ",await (await __GG__("as_lisp"))(rval));
                                 (comp_warn)("  ",(_cdepth||"-"),"for given: ",await source_from_tokens(tokens,expanded_tree))
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
                first_level_setup=[];
                needs_first_level=true;
                signal_error=async function(message) {
                     return  new (await __GG__("LispSyntaxError"))(message)
                };
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
                        let __target_obj__10=new Object();
                        __target_obj__10["ctype"]=type;
                        __target_obj__10["args"]=[];
                        return __target_obj__10;
                        
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
                        let __array_op_rval__11=in_sync_ques_;
                         if (__array_op_rval__11 instanceof Function){
                            return await __array_op_rval__11(ctx) 
                        } else {
                            return[__array_op_rval__11,ctx]
                        }
                    })())){
                        await async function(){
                            let __target_obj__12=(tmp_template && tmp_template["2"] && tmp_template["2"]["val"] && tmp_template["2"]["val"]["0"]);
                            __target_obj__12["val"]="=:function";
                            return __target_obj__12;
                            
                        }();
                         await async function(){
                            let __target_obj__13=(tmp_template && tmp_template["2"] && tmp_template["2"]["val"] && tmp_template["2"]["val"]["0"]);
                            __target_obj__13["name"]="function";
                            return __target_obj__13;
                            
                        }()
                    };
                    await async function(){
                        let __target_obj__14=(tmp_template && tmp_template["1"]);
                        __target_obj__14["name"]=tmp_var_name;
                        __target_obj__14["val"]=tmp_var_name;
                        return __target_obj__14;
                        
                    }();
                    if (check_true ((args instanceof Array))){
                         await async function(){
                            let __target_obj__15=(tmp_template && tmp_template["2"] && tmp_template["2"]["val"] && tmp_template["2"]["val"]["1"]);
                            __target_obj__15["val"]=args;
                            return __target_obj__15;
                            
                        }()
                    };
                    await async function(){
                        let __target_obj__16=(tmp_template && tmp_template["2"] && tmp_template["2"]["val"] && tmp_template["2"]["val"]["2"]);
                        __target_obj__16["val"]=body;
                        return __target_obj__16;
                        
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
                            let __target_obj__17=(tmp_template && tmp_template["0"] && tmp_template["0"]["val"] && tmp_template["0"]["val"]["1"]);
                            __target_obj__17["val"]=args;
                            return __target_obj__17;
                            
                        }()
                    };
                    await async function(){
                        let __target_obj__18=(tmp_template && tmp_template["0"] && tmp_template["0"]["val"] && tmp_template["0"]["val"]["2"]);
                        __target_obj__18["val"]=body;
                        return __target_obj__18;
                        
                    }();
                     return  tmp_template
                };
                referenced_global_symbols=new Object();
                new_ctx=async function(parent) {
                    let ctx_obj;
                    ctx_obj=new Object();
                    await async function(){
                        let __target_obj__19=ctx_obj;
                        __target_obj__19["scope"]=new Object();
                        __target_obj__19["source"]="";
                        __target_obj__19["parent"]=parent;
                        __target_obj__19["ambiguous"]=new Object();
                        __target_obj__19["declared_types"]=new Object();
                        __target_obj__19["defs"]=[];
                        return __target_obj__19;
                        
                    }();
                    if (check_true (parent)){
                        if (check_true ((parent && parent["source"]))){
                             await async function(){
                                let __target_obj__20=ctx_obj;
                                __target_obj__20["source"]=(parent && parent["source"]);
                                return __target_obj__20;
                                
                            }()
                        };
                        if (check_true ((parent && parent["defvar_eval"]))){
                             await async function(){
                                let __target_obj__21=ctx_obj;
                                __target_obj__21["defvar_eval"]=true;
                                return __target_obj__21;
                                
                            }()
                        };
                        if (check_true ((parent && parent["has_first_level"]))){
                             await async function(){
                                let __target_obj__22=ctx_obj;
                                __target_obj__22["has_first_level"]=true;
                                return __target_obj__22;
                                
                            }()
                        };
                        if (check_true ((parent && parent["block_step"]))){
                             await async function(){
                                let __target_obj__23=ctx_obj;
                                __target_obj__23["block_step"]=(parent && parent["block_step"]);
                                return __target_obj__23;
                                
                            }()
                        };
                        if (check_true ((parent && parent["block_id"]))){
                             await async function(){
                                let __target_obj__24=ctx_obj;
                                __target_obj__24["block_id"]=(parent && parent["block_id"]);
                                return __target_obj__24;
                                
                            }()
                        };
                        if (check_true ((parent && parent["suppress_return"]))){
                             await async function(){
                                let __target_obj__25=ctx_obj;
                                __target_obj__25["suppress_return"]=(parent && parent["suppress_return"]);
                                return __target_obj__25;
                                
                            }()
                        };
                        if (check_true ((parent && parent["in_try"]))){
                             await async function(){
                                let __target_obj__26=ctx_obj;
                                __target_obj__26["in_try"]=await (async function(){
                                    let __targ__27=parent;
                                    if (__targ__27){
                                         return(__targ__27)["in_try"]
                                    } 
                                })();
                                return __target_obj__26;
                                
                            }()
                        };
                        if (check_true ((parent && parent["return_point"]))){
                             await async function(){
                                let __target_obj__28=ctx_obj;
                                __target_obj__28["return_point"]=await add((parent && parent["return_point"]),1);
                                return __target_obj__28;
                                
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
                        } else if (check_true( ((ctype instanceof String || typeof ctype==='string')&&await contains_ques_("block",ctype)))) {
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
                    if (check_true (((value instanceof Array)&&(value && value["0"] && value["0"]["ctype"])))){
                          return await async function(){
                            let __target_obj__29=(ctx && ctx["scope"]);
                            __target_obj__29[sanitized_name]=await async function(){
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
                     return  await async function(){
                        if (check_true( await is_nil_ques_(name))) {
                             throw new SyntaxError(("get_ctx: nil identifier passed: "+await sub_type(name)));
                            
                        } else if (check_true( await is_number_ques_(name))) {
                             return name
                        } else if (check_true( name instanceof Function)) {
                             throw new SyntaxError(("get_ctx: invalid identifier passed: "+await sub_type(name)));
                            
                        } else  {
                            ref_name=await first(await (await __GG__("get_object_path"))(name));
                             return  await async function(){
                                if (check_true( await not((undefined===await (async function(){
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
                                ref_name=await first(await (await __GG__("get_object_path"))(ref_name));
                                 return  await async function(){
                                    if (check_true( await (async function(){
                                        let __targ__33=op_lookup;
                                        if (__targ__33){
                                             return(__targ__33)[ref_name]
                                        } 
                                    })())) {
                                         return AsyncFunction
                                    } else if (check_true( await not((undefined===await (async function(){
                                        let __targ__34=(ctx && ctx["scope"]);
                                        if (__targ__34){
                                             return(__targ__34)[ref_name]
                                        } 
                                    })())))) {
                                         return await (async function(){
                                            let __targ__35=(ctx && ctx["scope"]);
                                            if (__targ__35){
                                                 return(__targ__35)[ref_name]
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
                                        let __targ__36=op_lookup;
                                        if (__targ__36){
                                             return(__targ__36)[ref_name]
                                        } 
                                    })())) {
                                         return null
                                    } else if (check_true( await not((undefined===await (async function(){
                                        let __targ__37=(ctx && ctx["declared_types"]);
                                        if (__targ__37){
                                             return(__targ__37)[ref_name]
                                        } 
                                    })())))) {
                                         return await (async function(){
                                            let __targ__38=(ctx && ctx["declared_types"]);
                                            if (__targ__38){
                                                 return(__targ__38)[ref_name]
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
                    if (check_true (await (await __GG__("blank?"))(dec_struct))){
                         dec_struct={
                            type:undefined,inlined:false
                        }
                    };
                    await async function(){
                        let __target_obj__39=dec_struct;
                        __target_obj__39[declaration_type]=value;
                        return __target_obj__39;
                        
                    }();
                    await async function(){
                        let __target_obj__40=(ctx && ctx["declared_types"]);
                        __target_obj__40[sname]=dec_struct;
                        return __target_obj__40;
                        
                    }();
                     return  await (async function(){
                        let __targ__41=(ctx && ctx["declared_types"]);
                        if (__targ__41){
                             return(__targ__41)[sname]
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
                            ref_name=await first(await (await __GG__("get_object_path"))(ref_name));
                             return  await async function(){
                                if (check_true( await (async function(){
                                    let __targ__42=(ctx && ctx["ambiguous"]);
                                    if (__targ__42){
                                         return(__targ__42)[ref_name]
                                    } 
                                })())) {
                                     return true
                                } else if (check_true((ctx && ctx["parent"]))) {
                                     return await (async function(){
                                        let __array_op_rval__43=is_ambiguous_ques_;
                                         if (__array_op_rval__43 instanceof Function){
                                            return await __array_op_rval__43((ctx && ctx["parent"]),ref_name) 
                                        } else {
                                            return[__array_op_rval__43,(ctx && ctx["parent"]),ref_name]
                                        }
                                    })()
                                }
                            } ()
                        }
                    } ()
                };
                set_ambiguous=async function(ctx,name) {
                     return  await async function(){
                        let __target_obj__44=(ctx && ctx["ambiguous"]);
                        __target_obj__44[name]=true;
                        return __target_obj__44;
                        
                    }()
                };
                unset_ambiguous=async function(ctx,name) {
                     return  await (await __GG__("delete_prop"))((ctx && ctx["ambiguous"]),name)
                };
                invalid_js_ref_chars="+?-%&^#!*[]~{}|";
                invalid_js_ref_chars_regex=new RegExp("[\%\+\[\>\?\<\\}\{&\#\^\=\~\*\!\)\(\-]+","g");
                check_invalid_js_ref=async function(symname) {
                     return  await async function(){
                        if (check_true( await not((symname instanceof String || typeof symname==='string')))) {
                             return false
                        } else if (check_true( ((symname instanceof String || typeof symname==='string')&&(await length(symname)>2)&&await starts_with_ques_("=:",symname)))) {
                             return (await length(await (await __GG__("scan_str"))(invalid_js_ref_chars_regex,await symname["substr"].call(symname,2)))>0)
                        } else  {
                             return (await length(await (await __GG__("scan_str"))(invalid_js_ref_chars_regex,symname))>0)
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
                                let __for_body__47=async function(t) {
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
                                             throw new SyntaxError(("Invalid character in symbol: "+symname));
                                            
                                        } else  {
                                             return (acc).push(t)
                                        }
                                    } ()
                                };
                                let __array__48=[],__elements__46=text_chars;
                                let __BREAK__FLAG__=false;
                                for(let __iter__45 in __elements__46) {
                                    __array__48.push(await __for_body__47(__elements__46[__iter__45]));
                                    if(__BREAK__FLAG__) {
                                         __array__48.pop();
                                        break;
                                        
                                    }
                                }return __array__48;
                                 
                            })();
                             return  (acc).join("")
                        }
                    } ()
                };
                find_in_context=async function(ctx,name) {
                    let symname;
                    let ref;
                    let __is_literal_ques___49= async function(){
                        return (await is_number_ques_(name)||(await not(ref)&&(name instanceof String || typeof name==='string'))||("nil"===symname)||("null"===symname)||(ref&&("undefined"===symname))||(ref&&("else"===symname))||(ref&&("catch"===symname))||(true===name)||(false===name))
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
                                 return "nil"
                            }
                        } ();
                        ref=(symname&&((name instanceof String || typeof name==='string')&&(await length(name)>2)&&await starts_with_ques_("=:",name)));
                        let is_literal_ques_=await __is_literal_ques___49();
                        ;
                        special=(ref&&symname&&await contains_ques_(symname,await (await __GG__("conj"))(["unquotem","quotem"],await (await __GG__("keys"))(op_lookup))));
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
                                } else if (check_true( (name===undefined))) {
                                     return "literal"
                                } else  {
                                    (error_log)("find_in_context: unknown type: ",name);
                                    debugger;
                                    ;
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
                            } (),val:await (async function() {
                                if (check_true ((val===undefined))){
                                      return undefined
                                } else {
                                      return val
                                }
                            } )(),ref:await (async function() {
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
                        cpath=await (await __GG__("chop"))(cpath);
                        source=await (await __GG__("as_lisp"))(await (await __GG__("resolve_path"))(cpath,tree));
                        if (check_true (((source && source.length)>80))){
                             source=await add(await source["substr"].call(source,0,80),"...")
                        };
                        if (check_true (await not(await (await __GG__("blank?"))(source)))){
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
                             return await (await __GG__("as_lisp"))(await (await __GG__("resolve_path"))((tokens && tokens["path"]),tree))
                        } else if (check_true( ((tokens instanceof Array)&&(tokens && tokens["0"] && tokens["0"]["path"])&&collect_parents_ques_))) {
                             return await source_chain((tokens && tokens["0"] && tokens["0"]["path"]),tree)
                        } else if (check_true( ((tokens instanceof Array)&&(tokens && tokens["0"] && tokens["0"]["path"])))) {
                             return await (await __GG__("as_lisp"))(await (await __GG__("resolve_path"))(await (await __GG__("chop"))((tokens && tokens["0"] && tokens["0"]["path"])),tree))
                        } else if (check_true( ((undefined===tokens)&&await not((undefined===tree))))) {
                             return await (await __GG__("as_lisp"))(tree)
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
                        comps=await (await __GG__("get_object_path"))(name);
                        cannot_be_js_global=await check_invalid_js_ref((comps && comps["0"]));
                        ref_name=(comps).shift();
                        ref_type=await (async function () {
                             if (check_true ((ref_name==="this"))){
                                  return THIS_REFERENCE
                            } else {
                                let global_ref=await (async function(){
                                    let __targ__50=(root_ctx && root_ctx["defined_lisp_globals"]);
                                    if (__targ__50){
                                         return(__targ__50)[ref_name]
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
                            let __target_obj__51=referenced_global_symbols;
                            __target_obj__51[ref_name]=ref_type;
                            return __target_obj__51;
                            
                        }()))){
                            
                        };
                         return  await async function(){
                            if (check_true( (NOT_FOUND_THING===ref_type))) {
                                 return undefined
                            } else if (check_true( (ref_type===THIS_REFERENCE))) {
                                 return ref_type
                            } else if (check_true( ((comps && comps.length)===0))) {
                                 return ref_type
                            } else if (check_true( (((comps && comps.length)===1)&&(ref_type instanceof Object)&&await contains_ques_((comps && comps["0"]),await (await __GG__("object_methods"))(ref_type))))) {
                                 return await (async function(){
                                    let __targ__52=ref_type;
                                    if (__targ__52){
                                         return(__targ__52)[(comps && comps["0"])]
                                    } 
                                })()
                            } else if (check_true( (ref_type instanceof Object))) {
                                 return await (await __GG__("resolve_path"))(comps,ref_type)
                            } else if (check_true( ((typeof ref_type==="object")&&await contains_ques_((comps && comps["0"]),await Object["keys"].call(Object,ref_type))))) {
                                await (async function(){
                                     let __test_condition__53=async function() {
                                         return  ((ref_type==undefined)||((comps && comps.length)>0))
                                    };
                                    let __body_ref__54=async function() {
                                         return  ref_type=await (async function(){
                                            let __targ__55=ref_type;
                                            if (__targ__55){
                                                 return(__targ__55)[(comps).shift()]
                                            } 
                                        })()
                                    };
                                    let __BREAK__FLAG__=false;
                                    while(await __test_condition__53()) {
                                        await __body_ref__54();
                                         if(__BREAK__FLAG__) {
                                             break;
                                            
                                        }
                                    } ;
                                    
                                })();
                                 return  ref_type
                            } else  {
                                await (async function(){
                                    let __array_op_rval__56=get_lisp_ctx_log;
                                     if (__array_op_rval__56 instanceof Function){
                                        return await __array_op_rval__56("symbol not found: ",name,ref_name,ref_type,cannot_be_js_global) 
                                    } else {
                                        return[__array_op_rval__56,"symbol not found: ",name,ref_name,ref_type,cannot_be_js_global]
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
                                 console.log("get_val: reference: ",await (await __GG__("safe_access"))(token,ctx,sanitize_js_ref_name))
                            };
                            let ref_name=await (async function () {
                                 if (check_true (((await safety_level(ctx)>1)&&((comps && comps.length)>1)))){
                                      return await (await __GG__("safe_access"))(token,ctx,sanitize_js_ref_name)
                                } else {
                                      return await sanitize_js_ref_name(await (await __GG__("expand_dot_accessor"))((token && token.name),ctx))
                                } 
                            })();
                            ;
                             return  await async function(){
                                if (check_true( (await get_ctx(ctx,"__IN_QUOTEM__")&&await not(await get_ctx(ctx,"__IN_LAMBDA__"))))) {
                                     return await get_ctx(ctx,ref_name)
                                } else if (check_true( (false&&await get_ctx(ctx,"__IN_QUOTEM__")&&await get_ctx(ctx,"__IN_LAMBDA__")))) {
                                     return ("await ctx_access(\""+ref_name+"\")")
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
                    _path=(_path||[]);
                    if (check_true ((await JSON.stringify(obj)==="{}"))){
                         return  {
                            type:"object",ref:false,val:"{}",name:"{}",__token__:true,path:_path
                        }
                    } else {
                          return await (async function() {
                            let __for_body__59=async function(pset) {
                                 return  {
                                    type:"keyval",val:await tokenize(pset,ctx,"path:",await add(_path,(pset && pset["0"]))),ref:false,name:(""+await (await __GG__("as_lisp"))((pset && pset["0"]))),__token__:true
                                }
                            };
                            let __array__60=[],__elements__58=await (await __GG__("pairs"))(obj);
                            let __BREAK__FLAG__=false;
                            for(let __iter__57 in __elements__58) {
                                __array__60.push(await __for_body__59(__elements__58[__iter__57]));
                                if(__BREAK__FLAG__) {
                                     __array__60.pop();
                                    break;
                                    
                                }
                            }return __array__60;
                             
                        })()
                    }
                };
                tokenize_quote=async function(args,_path) {
                     return  await async function(){
                        if (check_true( ((args && args["0"])==="=:quote"))) {
                             return {
                                type:"arr",__token__:true,source:await (await __GG__("as_lisp"))(args),val:await (await __GG__("conj"))([{
                                    type:"special",val:"=:quote",ref:true,name:"quote",__token__:true
                                }],await args["slice"].call(args,1)),ref:((args instanceof String || typeof args==='string')&&(await length(args)>2)&&await starts_with_ques_("=:",args)),name:null,path:_path
                            }
                        } else if (check_true( ((args && args["0"])==="=:quotem"))) {
                             return {
                                type:"arr",__token__:true,source:await (await __GG__("as_lisp"))(args),val:await (await __GG__("conj"))([{
                                    type:"special",path:await (await __GG__("conj"))(_path,[0]),val:"=:quotem",ref:true,name:"quotem",__token__:true
                                }],await args["slice"].call(args,1)),ref:((args instanceof String || typeof args==='string')&&(await length(args)>2)&&await starts_with_ques_("=:",args)),name:null,path:_path
                            }
                        } else  {
                             return {
                                type:"arr",__token__:true,source:await (await __GG__("as_lisp"))(args),val:await (await __GG__("conj"))([{
                                    type:"special",val:"=:quotel",ref:true,name:"quotel",__token__:true
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
                    ;
                    if (check_true ((null==ctx))){
                        await console.error("tokenize: nil ctx passed: ",await clone(args));
                        throw new ReferenceError("nil/undefined ctx passed to tokenize");
                        
                    };
                    if (check_true (((args instanceof Array)&&await not(_suppress_comptime_eval)))){
                        args=await compile_time_eval(ctx,args,_path);
                         await async function(){
                            if (check_true( ((_path && _path.length)>1))) {
                                tobject=await (await __GG__("resolve_path"))(await (await __GG__("chop"))(_path),expanded_tree);
                                if (check_true (tobject)){
                                     await async function(){
                                        let __target_obj__61=tobject;
                                        __target_obj__61[await last(_path)]=args;
                                        return __target_obj__61;
                                        
                                    }()
                                }
                            } else if (check_true( ((_path && _path.length)===1))) {
                                 await async function(){
                                    let __target_obj__62=expanded_tree;
                                    __target_obj__62[await first(_path)]=args;
                                    return __target_obj__62;
                                    
                                }()
                            } else  {
                                 return expanded_tree=args
                            }
                        } ()
                    };
                     return  await async function(){
                        if (check_true( ((args instanceof String || typeof args==='string')||await is_number_ques_(args)||((args===true)||(args===false))))) {
                             return await first(await tokenize([args],ctx,_path,true))
                        } else if (check_true( ((args instanceof Array)&&(((args && args["0"])==="=:quotem")||((args && args["0"])==="=:quote")||((args && args["0"])==="=:quotel"))))) {
                            rval=await tokenize_quote(args,_path);
                             return  rval
                        } else if (check_true( ((args instanceof Array)&&await not(await get_ctx_val(ctx,"__IN_LAMBDA__"))&&((args && args["0"])==="=:iprogn")))) {
                            rval=await compile_toplevel(args,ctx);
                             return  await tokenize(rval,ctx,_path)
                        } else if (check_true( (await not((args instanceof Array))&&(args instanceof Object)))) {
                             return await first(await tokenize([args],ctx,await add(_path,0)))
                        } else  {
                            if (check_true ((((args && args["0"])==="=:fn")||((args && args["0"])==="=:function")||((args && args["0"])==="=:=>")))){
                                ctx=await new_ctx(ctx);
                                 await set_ctx(ctx,"__IN_LAMBDA__",true)
                            };
                             return  await (async function() {
                                let __for_body__65=async function(arg) {
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
                                                type:"fun",__token__:true,val:arg,ref:is_ref,name:(""+await (await __GG__("as_lisp"))(arg)),path:await add(_path,idx)
                                            }
                                        } else if (check_true( (argtype==="AsyncFunction"))) {
                                             return {
                                                type:"asf",__token__:true,val:arg,ref:is_ref,name:(""+await (await __GG__("as_lisp"))(arg)),path:await add(_path,idx)
                                            }
                                        } else if (check_true( (argtype==="array"))) {
                                             return {
                                                type:"array",__token__:true,val:arg,ref:is_ref,name:(""+await (await __GG__("as_lisp"))(arg)),path:await add(_path,idx)
                                            }
                                        } else if (check_true( (argtype==="Number"))) {
                                             return {
                                                type:"num",__token__:true,val:argvalue,ref:is_ref,name:(""+await (await __GG__("as_lisp"))(arg)),path:await add(_path,idx)
                                            }
                                        } else if (check_true( ((argtype==="String")&&is_ref))) {
                                             return {
                                                type:"arg",__token__:true,val:argvalue,ref:is_ref,name:await clean_quoted_reference((""+await (await __GG__("as_lisp"))(arg))),global:(argdetails && argdetails["global"]),local:(argdetails && argdetails["local"]),path:await add(_path,idx)
                                            }
                                        } else if (check_true( (argtype==="String"))) {
                                             return {
                                                type:"literal",__token__:true,val:argvalue,ref:is_ref,name:await clean_quoted_reference((""+await (await __GG__("as_lisp"))(arg))),global:(argdetails && argdetails["global"]),path:await add(_path,idx)
                                            }
                                        } else if (check_true( (arg instanceof Object))) {
                                             return  {
                                                type:"objlit",__token__:true,val:await tokenize_object(arg,ctx,await add(_path,idx)),ref:is_ref,name:null,path:await add(_path,idx)
                                            }
                                        } else if (check_true( ((argtype==="literal")&&is_ref&&((""+await (await __GG__("as_lisp"))(arg))==="nil")))) {
                                             return {
                                                type:"null",__token__:true,val:null,ref:true,name:"null",path:await add(_path,idx)
                                            }
                                        } else if (check_true( ((argtype==="unbound")&&is_ref&&(null==argvalue)))) {
                                             return {
                                                type:"arg",__token__:true,val:arg,ref:true,name:await clean_quoted_reference((""+await (await __GG__("as_lisp"))(arg))),path:await add(_path,idx)
                                            }
                                        } else if (check_true( ((argtype==="unbound")&&is_ref))) {
                                             return {
                                                type:await sub_type(argvalue),__token__:true,val:argvalue,ref:true,name:await clean_quoted_reference(await sanitize_js_ref_name((""+await (await __GG__("as_lisp"))(arg)))),path:await add(_path,idx)
                                            }
                                        } else  {
                                             return {
                                                type:argtype,__token__:true,val:argvalue,ref:is_ref,name:await clean_quoted_reference((""+await (await __GG__("as_lisp"))(arg))),global:(argdetails && argdetails["global"]),local:(argdetails && argdetails["local"]),path:await add(_path,idx)
                                            }
                                        }
                                    } ()
                                };
                                let __array__66=[],__elements__64=args;
                                let __BREAK__FLAG__=false;
                                for(let __iter__63 in __elements__64) {
                                    __array__66.push(await __for_body__65(__elements__64[__iter__63]));
                                    if(__BREAK__FLAG__) {
                                         __array__66.pop();
                                        break;
                                        
                                    }
                                }return __array__66;
                                 
                            })()
                        }
                    } ()
                };
                comp_time_log=await defclog({
                    prefix:"compile_time_eval",background:"#C0C0C0",color:"darkblue"
                });
                compile_time_eval=async function(ctx,lisp_tree,path) {
                    if (check_true (((lisp_tree instanceof Array)&&(((lisp_tree && lisp_tree["0"]) instanceof String || typeof (lisp_tree && lisp_tree["0"])==='string')&&(await length((lisp_tree && lisp_tree["0"]))>2)&&await starts_with_ques_("=:",(lisp_tree && lisp_tree["0"])))&&await (await __GG__("resolve_path"))(["definitions",await (lisp_tree && lisp_tree["0"])["substr"].call((lisp_tree && lisp_tree["0"]),2),"eval_when","compile_time"],Environment)))){
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
                                    let __apply_args__68=await lisp_tree["slice"].call(lisp_tree,1);
                                    return ( precompile_function).apply(this,__apply_args__68)
                                })() 
                            } catch(__exception__67) {
                                  if (__exception__67 instanceof Error) {
                                     let e=__exception__67;
                                     {
                                        await async function(){
                                            let __target_obj__70=e;
                                            __target_obj__70["handled"]=true;
                                            return __target_obj__70;
                                            
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
                             (warnings).push(("compile time function "+await (lisp_tree && lisp_tree["0"])["substr"].call((lisp_tree && lisp_tree["0"]),2)+" returned nil"))
                        } else {
                            ntree=await do_deferred_splice(ntree);
                            if (check_true (await not((await JSON.stringify(ntree)===await JSON.stringify(lisp_tree))))){
                                 ntree=await compile_time_eval(ctx,ntree,path)
                            };
                            if (check_true (await verbosity(ctx))){
                                 (comp_time_log)(await (lisp_tree && lisp_tree["0"])["substr"].call((lisp_tree && lisp_tree["0"]),2),"<- lisp: ",await (await __GG__("as_lisp"))(ntree))
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
                        let __targ__71=await first(tokens);
                        if (__targ__71){
                             return(__targ__71)["name"]
                        } 
                    })();
                    math_op=(await (async function(){
                        let __targ__72=op_translation;
                        if (__targ__72){
                             return(__targ__72)[math_op_a]
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
                    if (check_true (((symbol_ctx_val instanceof Array)&&(symbol_ctx_val && symbol_ctx_val["0"] && symbol_ctx_val["0"]["ctype"])))){
                         symbol_ctx_val=(symbol_ctx_val && symbol_ctx_val["0"] && symbol_ctx_val["0"]["ctype"])
                    };
                    if (check_true (((((declaration && declaration["type"])===Array)||((declaration && declaration["type"])===Object)||(symbol_ctx_val==="objliteral")||(symbol_ctx_val===Expression)||(symbol_ctx_val===ArgumentType)||((tokens && tokens["1"] && tokens["1"]["type"])==="objlit")||((tokens && tokens["1"] && tokens["1"]["type"])==="arr"))&&(math_op==="+")))){
                         is_overloaded=true
                    };
                    if (check_true (is_overloaded)){
                        await async function(){
                            let __target_obj__73=tokens;
                            __target_obj__73[0]={
                                type:"function",val:await add("=:","add"),name:"add",ref:true
                            };
                            return __target_obj__73;
                            
                        }();
                        stmts=await compile(tokens,ctx);
                        stmts=await wrap_assignment_value(stmts,ctx);
                         return  stmts
                    } else {
                        (acc).push("(");
                        await (async function(){
                             let __test_condition__74=async function() {
                                 return  (idx<((tokens && tokens.length)-1))
                            };
                            let __body_ref__75=async function() {
                                idx+=1;
                                token=await (async function(){
                                    let __targ__76=tokens;
                                    if (__targ__76){
                                         return(__targ__76)[idx]
                                    } 
                                })();
                                await add_operand();
                                 return  (acc).push(await wrap_assignment_value(await compile(token,ctx),ctx))
                            };
                            let __BREAK__FLAG__=false;
                            while(await __test_condition__74()) {
                                await __body_ref__75();
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
                        let __array_op_rval__77=is_complex_ques_;
                         if (__array_op_rval__77 instanceof Function){
                            return await __array_op_rval__77((token && token["val"])) 
                        } else {
                            return[__array_op_rval__77,(token && token["val"])]
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
                    ;
                    await (async function() {
                        let __for_body__80=async function(t) {
                             return  (wrapper).push(t)
                        };
                        let __array__81=[],__elements__79=[(preamble && preamble["0"])," ",(preamble && preamble["1"])," ",(preamble && preamble["3"]),"function","()","{","let"," ",target_reference,"=",target,";"];
                        let __BREAK__FLAG__=false;
                        for(let __iter__78 in __elements__79) {
                            __array__81.push(await __for_body__80(__elements__79[__iter__78]));
                            if(__BREAK__FLAG__) {
                                 __array__81.pop();
                                break;
                                
                            }
                        }return __array__81;
                         
                    })();
                    await (async function(){
                         let __test_condition__82=async function() {
                             return  (idx<((tokens && tokens.length)-1))
                        };
                        let __body_ref__83=async function() {
                            idx+=1;
                            (acc).push(target_reference);
                            token=await (async function(){
                                let __targ__84=tokens;
                                if (__targ__84){
                                     return(__targ__84)[idx]
                                } 
                            })();
                            (acc).push("[");
                            stmt=await wrap_assignment_value(await compile(token,ctx),ctx);
                            (acc).push(stmt);
                            (acc).push("]");
                            idx+=1;
                            (acc).push("=");
                            token=await (async function(){
                                let __targ__85=tokens;
                                if (__targ__85){
                                     return(__targ__85)[idx]
                                } 
                            })();
                            if (check_true ((null==token)))throw new Error("set_prop: odd number of arguments");
                            ;
                            stmt=await wrap_assignment_value(await compile(token,ctx),ctx);
                            (acc).push(stmt);
                             return  (acc).push(";")
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
                        let __targ__86=tokens;
                        if (__targ__86){
                             return(__targ__86)[2]
                        } 
                    })(),ctx),ctx);
                    ;
                    if (check_true ((await safety_level(ctx)>1))){
                        target_val=await gen_temp_name("targ");
                         return  [(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()","{","let"," ",target_val,"=",target,";","if"," ","(",target_val,")","{"," ","return","(",target_val,")","[",idx_key,"]","}"," ","}",")","()"]
                    } else {
                          return ["(",target,")","[",idx_key,"]"]
                    }
                };
                compile_elem=async function(token,ctx) {
                    let rval;
                    let __check_needs_wrap__87= async function(){
                        return async function(stmts) {
                            let fst;
                            fst=(((stmts instanceof Array)&&await first(stmts)&&(await first(stmts) instanceof Object)&&await (async function(){
                                let __targ__88=await first(stmts);
                                if (__targ__88){
                                     return(__targ__88)["ctype"]
                                } 
                            })()&&await async function(){
                                if (check_true( (await (async function(){
                                    let __targ__89=await first(stmts);
                                    if (__targ__89){
                                         return(__targ__89)["ctype"]
                                    } 
                                })() instanceof String || typeof await (async function(){
                                    let __targ__89=await first(stmts);
                                    if (__targ__89){
                                         return(__targ__89)["ctype"]
                                    } 
                                })()==='string'))) {
                                     return await (async function(){
                                        let __targ__90=await first(stmts);
                                        if (__targ__90){
                                             return(__targ__90)["ctype"]
                                        } 
                                    })()
                                } else  {
                                     return await sub_type(await (async function(){
                                        let __targ__91=await first(stmts);
                                        if (__targ__91){
                                             return(__targ__91)["ctype"]
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
                        let check_needs_wrap=await __check_needs_wrap__87();
                        ;
                        if (check_true (await (async function(){
                            let __array_op_rval__92=is_complex_ques_;
                             if (__array_op_rval__92 instanceof Function){
                                return await __array_op_rval__92((token && token["val"])) 
                            } else {
                                return[__array_op_rval__92,(token && token["val"])]
                            }
                        })())){
                             rval=await compile_wrapper_fn(token,ctx)
                        } else {
                             rval=await compile(token,ctx)
                        };
                        if (check_true (await not((rval instanceof Array)))){
                             rval=await (async function(){
                                let __array_op_rval__93=rval;
                                 if (__array_op_rval__93 instanceof Function){
                                    return await __array_op_rval__93() 
                                } else {
                                    return[__array_op_rval__93]
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
                        let __for_body__96=async function(token) {
                            stmt=await wrap_assignment_value(await compile(token,ctx),ctx);
                             return  (args).push(stmt)
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
                    if (check_true (await verbosity())){
                         (inline_log)("args: ",args)
                    };
                    if (check_true (await (async function(){
                        let __targ__98=(Environment && Environment["inlines"]);
                        if (__targ__98){
                             return(__targ__98)[(tokens && tokens["0"] && tokens["0"]["name"])]
                        } 
                    })())){
                        inline_fn=await (async function(){
                            let __targ__99=(Environment && Environment["inlines"]);
                            if (__targ__99){
                                 return(__targ__99)[(tokens && tokens["0"] && tokens["0"]["name"])]
                            } 
                        })();
                         rval=await (async function(){
                            let __array_op_rval__100=inline_fn;
                             if (__array_op_rval__100 instanceof Function){
                                return await __array_op_rval__100(args,ctx) 
                            } else {
                                return[__array_op_rval__100,args,ctx]
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
                        let __array_op_rval__101=place;
                         if (__array_op_rval__101 instanceof Function){
                            return await __array_op_rval__101(".push","(",thing,")") 
                        } else {
                            return[__array_op_rval__101,".push","(",thing,")"]
                        }
                    })()
                };
                compile_list=async function(tokens,ctx) {
                    let acc;
                    let compiled_values;
                    acc=["["];
                    compiled_values=[];
                    await (async function() {
                        let __for_body__104=async function(t) {
                             return  (compiled_values).push(await wrap_assignment_value(await compile(t,ctx),ctx))
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
                        let __array_arg__108=(async function() {
                            if (check_true (await (async function(){
                                let __array_op_rval__106=is_complex_ques_;
                                 if (__array_op_rval__106 instanceof Function){
                                    return await __array_op_rval__106((tokens && tokens["1"])) 
                                } else {
                                    return[__array_op_rval__106,(tokens && tokens["1"])]
                                }
                            })())){
                                  return await compile_wrapper_fn((tokens && tokens["1"]),ctx)
                            } else {
                                  return await compile((tokens && tokens["1"]),ctx)
                            }
                        } );
                        let __array_arg__109=(async function() {
                            if (check_true (await (async function(){
                                let __array_op_rval__107=is_complex_ques_;
                                 if (__array_op_rval__107 instanceof Function){
                                    return await __array_op_rval__107((tokens && tokens["1"])) 
                                } else {
                                    return[__array_op_rval__107,(tokens && tokens["1"])]
                                }
                            })())){
                                  return await compile_wrapper_fn((tokens && tokens["2"]),ctx)
                            } else {
                                  return await compile((tokens && tokens["2"]),ctx)
                            }
                        } );
                        return ["(",await __array_arg__108()," ","instanceof"," ",await __array_arg__109(),")"]
                    } else throw new SyntaxError("instanceof requires 2 arguments");
                    
                };
                compile_compare=async function(tokens,ctx) {
                    let acc;
                    let ops;
                    let __operator__110= async function(){
                        return await (async function(){
                            let __targ__113=ops;
                            if (__targ__113){
                                 return(__targ__113)[await (async function(){
                                    let __targ__112=await first(tokens);
                                    if (__targ__112){
                                         return(__targ__112)["name"]
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
                            let __obj__111=new Object();
                            __obj__111["eq"]="==";
                            __obj__111["=="]="===";
                            __obj__111["<"]="<";
                            __obj__111[">"]=">";
                            __obj__111["gt"]=">";
                            __obj__111["lt"]="<";
                            __obj__111["<="]="<=";
                            __obj__111[">="]=">=";
                            return __obj__111;
                            
                        })();
                        let operator=await __operator__110();
                        ;
                        left=await (async function(){
                            let __targ__114=tokens;
                            if (__targ__114){
                                 return(__targ__114)[1]
                            } 
                        })();
                        right=await (async function(){
                            let __targ__115=tokens;
                            if (__targ__115){
                                 return(__targ__115)[2]
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
                        let __targ__116=await first(tokens);
                        if (__targ__116){
                             return(__targ__116)["name"]
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
                             throw new SyntaxError(("assignment: invalid target: "+(token && token["name"])));
                            
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
                    await (await __GG__("compiler_syntax_validation"))("compile_assignment",tokens,errors,ctx,expanded_tree);
                    await unset_ambiguous(ctx,target);
                    await async function(){
                        let __target_obj__117=ctx;
                        __target_obj__117["in_assignment"]=true;
                        return __target_obj__117;
                        
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
                            let __for_body__120=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__121=[],__elements__119=[{
                                ctype:"statement"
                            },(preamble && preamble["0"])," ","Environment",".","set_global","(","\"",target,"\"",",",assignment_value,")"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__118 in __elements__119) {
                                __array__121.push(await __for_body__120(__elements__119[__iter__118]));
                                if(__BREAK__FLAG__) {
                                     __array__121.pop();
                                    break;
                                    
                                }
                            }return __array__121;
                             
                        })()
                    };
                    await async function(){
                        let __target_obj__122=ctx;
                        __target_obj__122["in_assignment"]=false;
                        return __target_obj__122;
                        
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
                                        let __targ__123=await first(flattened);
                                        if (__targ__123){
                                             return(__targ__123)["ctype"]
                                        } 
                                    })()))) {
                                         return inst=await first(flattened)
                                    } else if (check_true( ((await first(flattened) instanceof String || typeof await first(flattened)==='string')&&await starts_with_ques_("/*",await first(flattened))&&(await second(flattened) instanceof Object)&&await (async function(){
                                        let __targ__124=await second(flattened);
                                        if (__targ__124){
                                             return(__targ__124)["ctype"]
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
                            let __tokens__125= async function(){
                                return null
                            };
                            let stmt;
                            let num_non_return_statements;
                            {
                                idx=0;
                                rval=null;
                                let tokens=await __tokens__125();
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
                                     let __test_condition__126=async function() {
                                         return  (idx<num_non_return_statements)
                                    };
                                    let __body_ref__127=async function() {
                                        idx+=1;
                                        await set_ctx(ctx,"__TOP_LEVEL__",true);
                                        if (check_true (await verbosity(ctx))){
                                            await console.log("");
                                             (top_level_log)((""+idx+"/"+num_non_return_statements),"->",await (await __GG__("as_lisp"))(await (async function(){
                                                let __targ__128=lisp_tree;
                                                if (__targ__128){
                                                     return(__targ__128)[idx]
                                                } 
                                            })()))
                                        };
                                        tokens=await tokenize(await (async function(){
                                            let __targ__129=lisp_tree;
                                            if (__targ__129){
                                                 return(__targ__129)[idx]
                                            } 
                                        })(),ctx);
                                        stmt=await compile(tokens,ctx);
                                        rval=await wrap_and_run(stmt,ctx,{
                                            bind_mode:true
                                        });
                                        if (check_true (await verbosity(ctx))){
                                            (top_level_log)((""+idx+"/"+num_non_return_statements),"compiled <- ",await (await __GG__("as_lisp"))(stmt));
                                             return  (top_level_log)((""+idx+"/"+num_non_return_statements),"<-",await (await __GG__("as_lisp"))(rval))
                                        }
                                    };
                                    let __BREAK__FLAG__=false;
                                    while(await __test_condition__126()) {
                                        await __body_ref__127();
                                         if(__BREAK__FLAG__) {
                                             break;
                                            
                                        }
                                    } ;
                                    
                                })();
                                 return  await (async function(){
                                    let __targ__130=lisp_tree;
                                    if (__targ__130){
                                         return(__targ__130)[(idx+1)]
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
                    let is_first_level;
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
                        if (check_true (((tokens && tokens["path"])&&((tokens && tokens["path"] && tokens["path"]["length"])>0)))){
                             (acc).push(await source_comment(tokens))
                        }
                    };
                    await async function(){
                        let __target_obj__131=ctx;
                        __target_obj__131["block_id"]=block_id;
                        return __target_obj__131;
                        
                    }();
                    if (check_true ((await get_ctx_val(ctx,"__LAMBDA_STEP__")===-1))){
                        lambda_block=true;
                         await (await __GG__("setf_ctx"))(ctx,"__LAMBDA_STEP__",((tokens && tokens.length)-1))
                    };
                    if (check_true (await not((block_options && block_options["no_scope_boundary"])))){
                         (acc).push("{")
                    };
                    if (check_true (is_first_level)){
                         (acc).push(first_level_setup)
                    };
                    await (async function(){
                         let __test_condition__132=async function() {
                             return  (idx<((tokens && tokens.length)-1))
                        };
                        let __body_ref__133=async function() {
                            idx+=1;
                            token=await (async function(){
                                let __targ__134=tokens;
                                if (__targ__134){
                                     return(__targ__134)[idx]
                                } 
                            })();
                            if (check_true ((idx===((tokens && tokens.length)-1)))){
                                 await async function(){
                                    let __target_obj__135=ctx;
                                    __target_obj__135["final_block_statement"]=true;
                                    return __target_obj__135;
                                    
                                }()
                            };
                            await async function(){
                                let __target_obj__136=ctx;
                                __target_obj__136["block_step"]=((tokens && tokens.length)-1-idx);
                                return __target_obj__136;
                                
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
                            await (await __GG__("assert"))(await not((stmt===undefined)),"compile_block: returned stmt is undefined");
                            stmt_ctype=(((ctx && ctx["block_step"])>0)&&(await first(stmt) instanceof Object)&&await (async function(){
                                let __targ__137=await first(stmt);
                                if (__targ__137){
                                     return(__targ__137)["ctype"]
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
                        while(await __test_condition__132()) {
                            await __body_ref__133();
                             if(__BREAK__FLAG__) {
                                 break;
                                
                            }
                        } ;
                        
                    })();
                    await async function(){
                        if (check_true( (await not((block_options && block_options["suppress_return"]))&&await not((ctx && ctx["suppress_return"]))&&(await (async function(){
                            let __array_op_rval__138=needs_return_ques_;
                             if (__array_op_rval__138 instanceof Function){
                                return await __array_op_rval__138(stmts,ctx) 
                            } else {
                                return[__array_op_rval__138,stmts,ctx]
                            }
                        })()||((idx>1)&&await (async function(){
                            let __array_op_rval__139=needs_return_ques_;
                             if (__array_op_rval__139 instanceof Function){
                                return await __array_op_rval__139(stmts,ctx) 
                            } else {
                                return[__array_op_rval__139,stmts,ctx]
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
                            let __array_op_rval__140=needs_return_ques_;
                             if (__array_op_rval__140 instanceof Function){
                                return await __array_op_rval__140(stmts,ctx) 
                            } else {
                                return[__array_op_rval__140,stmts,ctx]
                            }
                        })()||((idx>1)&&await (async function(){
                            let __array_op_rval__141=needs_return_ques_;
                             if (__array_op_rval__141 instanceof Function){
                                return await __array_op_rval__141(stmts,ctx) 
                            } else {
                                return[__array_op_rval__141,stmts,ctx]
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
                compile_defvar=async function(tokens,ctx) {
                    let target;
                    let wrap_as_function_ques_;
                    let ctx_details;
                    let assignment_type;
                    let __check_needs_wrap__142= async function(){
                        return async function(stmts) {
                            let fst;
                            fst=(((stmts instanceof Array)&&await first(stmts)&&(await first(stmts) instanceof Object)&&await (async function(){
                                let __targ__143=await first(stmts);
                                if (__targ__143){
                                     return(__targ__143)["ctype"]
                                } 
                            })()&&await async function(){
                                if (check_true( (await (async function(){
                                    let __targ__144=await first(stmts);
                                    if (__targ__144){
                                         return(__targ__144)["ctype"]
                                    } 
                                })() instanceof String || typeof await (async function(){
                                    let __targ__144=await first(stmts);
                                    if (__targ__144){
                                         return(__targ__144)["ctype"]
                                    } 
                                })()==='string'))) {
                                     return await (async function(){
                                        let __targ__145=await first(stmts);
                                        if (__targ__145){
                                             return(__targ__145)["ctype"]
                                        } 
                                    })()
                                } else  {
                                     return await sub_type(await (async function(){
                                        let __targ__146=await first(stmts);
                                        if (__targ__146){
                                             return(__targ__146)["ctype"]
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
                        let check_needs_wrap=await __check_needs_wrap__142();
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
                            await (await __GG__("delete_prop"))(ctx,"defvar_eval");
                             return  [{
                                ctype:"assignment"
                            },"let"," ",target,"=",assignment_value,"()",";"]
                        } else {
                            let __array_arg__147=(async function() {
                                if (check_true (((ctx_details && ctx_details["is_argument"])&&((ctx_details && ctx_details["levels_up"])===1)))){
                                      return ""
                                } else {
                                      return "let "
                                }
                            } );
                            return [{
                                ctype:"assignment"
                            },await __array_arg__147(),"",target,"=",[assignment_value],";"]
                        }
                    }
                };
                get_declaration_details=async function(ctx,symname,_levels_up) {
                     return  await async function(){
                        if (check_true( (await (async function(){
                            let __targ__148=(ctx && ctx["scope"]);
                            if (__targ__148){
                                 return(__targ__148)[symname]
                            } 
                        })()&&await (async function(){
                            let __targ__149=ctx;
                            if (__targ__149){
                                 return(__targ__149)["lambda_scope"]
                            } 
                        })()))) {
                             return {
                                name:symname,is_argument:true,levels_up:(_levels_up||0),value:await (async function(){
                                    let __targ__150=(ctx && ctx["scope"]);
                                    if (__targ__150){
                                         return(__targ__150)[symname]
                                    } 
                                })(),declared_global:await (async function() {
                                    if (check_true (await (async function(){
                                        let __targ__151=(root_ctx && root_ctx["defined_lisp_globals"]);
                                        if (__targ__151){
                                             return(__targ__151)[symname]
                                        } 
                                    })())){
                                          return true
                                    } else {
                                          return false
                                    }
                                } )()
                            }
                        } else if (check_true( await (async function(){
                            let __targ__152=(ctx && ctx["scope"]);
                            if (__targ__152){
                                 return(__targ__152)[symname]
                            } 
                        })())) {
                             return {
                                name:symname,is_argument:false,levels_up:(_levels_up||0),value:await (async function(){
                                    let __targ__153=(ctx && ctx["scope"]);
                                    if (__targ__153){
                                         return(__targ__153)[symname]
                                    } 
                                })(),declarations:await get_declarations(ctx,symname),declared_global:await (async function() {
                                    if (check_true (await (async function(){
                                        let __targ__154=(root_ctx && root_ctx["defined_lisp_globals"]);
                                        if (__targ__154){
                                             return(__targ__154)[symname]
                                        } 
                                    })())){
                                          return true
                                    } else {
                                          return false
                                    }
                                } )()
                            }
                        } else if (check_true( ((await (async function(){
                            let __targ__155=ctx;
                            if (__targ__155){
                                 return(__targ__155)["parent"]
                            } 
                        })()==null)&&await (async function(){
                            let __targ__156=(root_ctx && root_ctx["defined_lisp_globals"]);
                            if (__targ__156){
                                 return(__targ__156)[symname]
                            } 
                        })()))) {
                             return {
                                name:symname,is_argument:false,levels_up:(_levels_up||0),value:await (async function(){
                                    let __targ__157=(ctx && ctx["scope"]);
                                    if (__targ__157){
                                         return(__targ__157)[symname]
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
                        let __targ__158=await first(stmts);
                        if (__targ__158){
                             return(__targ__158)["ctype"]
                        } 
                    })()&&await async function(){
                        if (check_true( (await (async function(){
                            let __targ__159=await first(stmts);
                            if (__targ__159){
                                 return(__targ__159)["ctype"]
                            } 
                        })() instanceof String || typeof await (async function(){
                            let __targ__159=await first(stmts);
                            if (__targ__159){
                                 return(__targ__159)["ctype"]
                            } 
                        })()==='string'))) {
                             return await (async function(){
                                let __targ__160=await first(stmts);
                                if (__targ__160){
                                     return(__targ__160)["ctype"]
                                } 
                            })()
                        } else  {
                             return await sub_type(await (async function(){
                                let __targ__161=await first(stmts);
                                if (__targ__161){
                                     return(__targ__161)["ctype"]
                                } 
                            })())
                        }
                    } ())||""));
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
                        if (check_true( ((name instanceof String || typeof name==='string')&&await starts_with_ques_("\"",name)&&await (await __GG__("ends_with?"))("\"",name)))) {
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
                    is_first_level=false;
                    sub_block_count=0;
                    ctx_details=null;
                    preamble=await calling_preamble(ctx);
                    structure_validation_rules=[[[1,"val"],[(await __GG__("is_array?"))],"allocation section"],[[2],[async function(v) {
                         return  await not((v===undefined))
                    }],"block"]];
                    validation_results=null;
                    allocations=(tokens && tokens["1"] && tokens["1"]["val"]);
                    block=await tokens["slice"].call(tokens,2);
                    syntax_error=null;
                    idx=-1;
                    ;
                    await (await __GG__("compiler_syntax_validation"))("compile_let",tokens,errors,ctx,expanded_tree);
                    await async function(){
                        let __target_obj__162=ctx;
                        __target_obj__162["return_last_value"]=true;
                        return __target_obj__162;
                        
                    }();
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
                         let __test_condition__163=async function() {
                             return  (idx<((allocations && allocations.length)-1))
                        };
                        let __body_ref__164=async function() {
                            idx+=1;
                            alloc_set=await (async function(){
                                let __targ__166=await (async function(){
                                    let __targ__165=allocations;
                                    if (__targ__165){
                                         return(__targ__165)[idx]
                                    } 
                                })();
                                if (__targ__166){
                                     return(__targ__166)["val"]
                                } 
                            })();
                            reference_name=await clean_quoted_reference(await sanitize_js_ref_name((alloc_set && alloc_set["0"] && alloc_set["0"]["name"])));
                            ctx_details=await get_declaration_details(ctx,reference_name);
                            if (check_true (ctx_details)){
                                if (check_true ((await not((ctx_details && ctx_details["is_argument"]))&&((ctx_details && ctx_details["levels_up"])>1)))){
                                    need_sub_block=true;
                                    if (check_true (await (async function(){
                                        let __targ__167=redefinitions;
                                        if (__targ__167){
                                             return(__targ__167)[reference_name]
                                        } 
                                    })())){
                                         (await (async function(){
                                            let __targ__168=redefinitions;
                                            if (__targ__168){
                                                 return(__targ__168)[reference_name]
                                            } 
                                        })()).push(await gen_temp_name(reference_name))
                                    } else {
                                         await async function(){
                                            let __target_obj__169=redefinitions;
                                            __target_obj__169[reference_name]=[0,await gen_temp_name(reference_name)];
                                            return __target_obj__169;
                                            
                                        }()
                                    };
                                    if (check_true (((ctx_details && ctx_details["declared_global"])&&await not((ctx_details && ctx_details["is_argument"]))))){
                                         await async function(){
                                            let __target_obj__170=shadowed_globals;
                                            __target_obj__170[(alloc_set && alloc_set["0"] && alloc_set["0"]["name"])]=true;
                                            return __target_obj__170;
                                            
                                        }()
                                    }
                                }
                            };
                            if (check_true (await not((ctx_details && ctx_details["is_argument"])))){
                                 return  await set_ctx(ctx,reference_name,AsyncFunction)
                            }
                        };
                        let __BREAK__FLAG__=false;
                        while(await __test_condition__163()) {
                            await __body_ref__164();
                             if(__BREAK__FLAG__) {
                                 break;
                                
                            }
                        } ;
                        
                    })();
                    idx=-1;
                    await (async function(){
                         let __test_condition__171=async function() {
                             return  (idx<((allocations && allocations.length)-1))
                        };
                        let __body_ref__172=async function() {
                            idx+=1;
                            stmt=[];
                            alloc_set=await (async function(){
                                let __targ__174=await (async function(){
                                    let __targ__173=allocations;
                                    if (__targ__173){
                                         return(__targ__173)[idx]
                                    } 
                                })();
                                if (__targ__174){
                                     return(__targ__174)["val"]
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
                                        let __target_obj__175=ctx;
                                        __target_obj__175["in_assignment"]=true;
                                        return __target_obj__175;
                                        
                                    }();
                                    assignment_value=await compile((alloc_set && alloc_set["1"]),ctx);
                                     return  await async function(){
                                        let __target_obj__176=ctx;
                                        __target_obj__176["in_assignment"]=false;
                                        return __target_obj__176;
                                        
                                    }()
                                } else if (check_true( (((alloc_set && alloc_set["1"] && alloc_set["1"]["name"]) instanceof String || typeof (alloc_set && alloc_set["1"] && alloc_set["1"]["name"])==='string')&&await (async function(){
                                    let __targ__177=(Environment && Environment["context"] && Environment["context"]["scope"]);
                                    if (__targ__177){
                                         return(__targ__177)[(alloc_set && alloc_set["1"] && alloc_set["1"]["name"])]
                                    } 
                                })()&&await not((ctx_details && ctx_details["is_argument"]))&&await (async function(){
                                    let __targ__178=shadowed_globals;
                                    if (__targ__178){
                                         return(__targ__178)[(alloc_set && alloc_set["0"] && alloc_set["0"]["name"])]
                                    } 
                                })()))) {
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
                                    let __target_obj__179=block_declarations;
                                    __target_obj__179[reference_name]=true;
                                    return __target_obj__179;
                                    
                                }()
                            };
                            def_idx=null;
                            await async function(){
                                if (check_true( (await (async function(){
                                    let __targ__180=redefinitions;
                                    if (__targ__180){
                                         return(__targ__180)[reference_name]
                                    } 
                                })()&&await first(await (async function(){
                                    let __targ__181=redefinitions;
                                    if (__targ__181){
                                         return(__targ__181)[reference_name]
                                    } 
                                })())))) {
                                    def_idx=await first(await (async function(){
                                        let __targ__182=redefinitions;
                                        if (__targ__182){
                                             return(__targ__182)[reference_name]
                                        } 
                                    })());
                                    def_idx+=1;
                                    await async function(){
                                        let __target_obj__183=await (async function(){
                                            let __targ__184=redefinitions;
                                            if (__targ__184){
                                                 return(__targ__184)[reference_name]
                                            } 
                                        })();
                                        __target_obj__183[0]=def_idx;
                                        return __target_obj__183;
                                        
                                    }();
                                     return  await (async function() {
                                        let __for_body__187=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__188=[],__elements__186=["let"," ",await (async function(){
                                            let __targ__190=await (async function(){
                                                let __targ__189=redefinitions;
                                                if (__targ__189){
                                                     return(__targ__189)[reference_name]
                                                } 
                                            })();
                                            if (__targ__190){
                                                 return(__targ__190)[def_idx]
                                            } 
                                        })(),"="," ",(preamble && preamble["1"])," ","function","()","{","return"," ",assignment_value,"}",";"];
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__185 in __elements__186) {
                                            __array__188.push(await __for_body__187(__elements__186[__iter__185]));
                                            if(__BREAK__FLAG__) {
                                                 __array__188.pop();
                                                break;
                                                
                                            }
                                        }return __array__188;
                                         
                                    })()
                                } else if (check_true( await not(await (async function(){
                                    let __targ__191=block_declarations;
                                    if (__targ__191){
                                         return(__targ__191)[reference_name]
                                    } 
                                })()))) {
                                    await (async function() {
                                        let __for_body__194=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__195=[],__elements__193=["let"," ",reference_name,";"];
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__192 in __elements__193) {
                                            __array__195.push(await __for_body__194(__elements__193[__iter__192]));
                                            if(__BREAK__FLAG__) {
                                                 __array__195.pop();
                                                break;
                                                
                                            }
                                        }return __array__195;
                                         
                                    })();
                                     return  await async function(){
                                        let __target_obj__196=block_declarations;
                                        __target_obj__196[reference_name]=true;
                                        return __target_obj__196;
                                        
                                    }()
                                }
                            } ();
                            if (check_true (await not(await (async function(){
                                let __targ__197=assignments;
                                if (__targ__197){
                                     return(__targ__197)[reference_name]
                                } 
                            })()))){
                                 await async function(){
                                    let __target_obj__198=assignments;
                                    __target_obj__198[reference_name]=[];
                                    return __target_obj__198;
                                    
                                }()
                            };
                             return  (await (async function(){
                                let __targ__199=assignments;
                                if (__targ__199){
                                     return(__targ__199)[reference_name]
                                } 
                            })()).push(await (async function () {
                                 if (check_true (def_idx)){
                                      return [(preamble && preamble["0"])," ",await (async function(){
                                        let __targ__201=await (async function(){
                                            let __targ__200=redefinitions;
                                            if (__targ__200){
                                                 return(__targ__200)[reference_name]
                                            } 
                                        })();
                                        if (__targ__201){
                                             return(__targ__201)[def_idx]
                                        } 
                                    })(),"()",";"]
                                } else {
                                      return assignment_value
                                } 
                            })())
                        };
                        let __BREAK__FLAG__=false;
                        while(await __test_condition__171()) {
                            await __body_ref__172();
                             if(__BREAK__FLAG__) {
                                 break;
                                
                            }
                        } ;
                        
                    })();
                    if (check_true (need_sub_block)){
                         await (async function() {
                            let __for_body__204=async function(pset) {
                                 return  await (async function() {
                                    let __for_body__208=async function(redef) {
                                         return  (await (async function(){
                                            let __targ__210=redefinitions;
                                            if (__targ__210){
                                                 return(__targ__210)[(pset && pset["0"])]
                                            } 
                                        })()).shift()
                                    };
                                    let __array__209=[],__elements__207=(pset && pset["1"]);
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__206 in __elements__207) {
                                        __array__209.push(await __for_body__208(__elements__207[__iter__206]));
                                        if(__BREAK__FLAG__) {
                                             __array__209.pop();
                                            break;
                                            
                                        }
                                    }return __array__209;
                                     
                                })()
                            };
                            let __array__205=[],__elements__203=await (await __GG__("pairs"))(redefinitions);
                            let __BREAK__FLAG__=false;
                            for(let __iter__202 in __elements__203) {
                                __array__205.push(await __for_body__204(__elements__203[__iter__202]));
                                if(__BREAK__FLAG__) {
                                     __array__205.pop();
                                    break;
                                    
                                }
                            }return __array__205;
                             
                        })()
                    };
                    if (check_true (need_sub_block)){
                        (acc).push("{");
                         sub_block_count+=1
                    };
                    idx=-1;
                    await (async function(){
                         let __test_condition__211=async function() {
                             return  (idx<((allocations && allocations.length)-1))
                        };
                        let __body_ref__212=async function() {
                            idx+=1;
                            def_idx=null;
                            stmt=[];
                            alloc_set=await (async function(){
                                let __targ__214=await (async function(){
                                    let __targ__213=allocations;
                                    if (__targ__213){
                                         return(__targ__213)[idx]
                                    } 
                                })();
                                if (__targ__214){
                                     return(__targ__214)["val"]
                                } 
                            })();
                            reference_name=await clean_quoted_reference(await sanitize_js_ref_name((alloc_set && alloc_set["0"] && alloc_set["0"]["name"])));
                            ctx_details=await get_declaration_details(ctx,reference_name);
                            assignment_value=(await (async function(){
                                let __targ__215=assignments;
                                if (__targ__215){
                                     return(__targ__215)[reference_name]
                                } 
                            })()).shift();
                            await async function(){
                                if (check_true( await (async function(){
                                    let __targ__216=block_declarations;
                                    if (__targ__216){
                                         return(__targ__216)[reference_name]
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
                                let __target_obj__217=block_declarations;
                                __target_obj__217[reference_name]=true;
                                return __target_obj__217;
                                
                            }();
                            (stmt).push("=");
                            (stmt).push(assignment_value);
                            (stmt).push(";");
                             return  (acc).push(stmt)
                        };
                        let __BREAK__FLAG__=false;
                        while(await __test_condition__211()) {
                            await __body_ref__212();
                             if(__BREAK__FLAG__) {
                                 break;
                                
                            }
                        } ;
                        
                    })();
                    (acc).push(await compile_block(await (await __GG__("conj"))(["PLACEHOLDER"],block),ctx,{
                        no_scope_boundary:true,ignore_declarations:declarations_handled
                    }));
                    await (async function() {
                        let __for_body__220=async function(i) {
                             return  (acc).push("}")
                        };
                        let __array__221=[],__elements__219=await (await __GG__("range"))(sub_block_count);
                        let __BREAK__FLAG__=false;
                        for(let __iter__218 in __elements__219) {
                            __array__221.push(await __for_body__220(__elements__219[__iter__218]));
                            if(__BREAK__FLAG__) {
                                 __array__221.pop();
                                break;
                                
                            }
                        }return __array__221;
                         
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
                        let __array_op_rval__222=in_sync_ques_;
                         if (__array_op_rval__222 instanceof Function){
                            return await __array_op_rval__222(ctx) 
                        } else {
                            return[__array_op_rval__222,ctx]
                        }
                    })())){
                          return ""
                    } else {
                          return "await"
                    }
                };
                calling_preamble=async function(ctx) {
                    if (check_true (await (async function(){
                        let __array_op_rval__223=in_sync_ques_;
                         if (__array_op_rval__223 instanceof Function){
                            return await __array_op_rval__223(ctx) 
                        } else {
                            return[__array_op_rval__223,ctx]
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
                        let __target_obj__224=ctx;
                        __target_obj__224["return_last_value"]=true;
                        return __target_obj__224;
                        
                    }();
                    await async function(){
                        let __target_obj__225=ctx;
                        __target_obj__225["return_point"]=0;
                        return __target_obj__225;
                        
                    }();
                    await set_ctx(ctx,"__IN_LAMBDA__",true);
                    await set_ctx(ctx,"__LAMBDA_STEP__",-1);
                    await async function(){
                        let __target_obj__226=ctx;
                        __target_obj__226["lambda_scope"]=true;
                        return __target_obj__226;
                        
                    }();
                    await async function(){
                        let __target_obj__227=ctx;
                        __target_obj__227["suppress_return"]=false;
                        return __target_obj__227;
                        
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
                        let __target_obj__228=type_mark;
                        __target_obj__228["args"]=[];
                        return __target_obj__228;
                        
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
                         let __test_condition__229=async function() {
                             return  (idx<((fn_args && fn_args.length)-1))
                        };
                        let __body_ref__230=async function() {
                            idx+=1;
                            arg=await (async function(){
                                let __targ__231=fn_args;
                                if (__targ__231){
                                     return(__targ__231)[idx]
                                } 
                            })();
                            if (check_true (((arg && arg.name)==="&"))){
                                idx+=1;
                                arg=await (async function(){
                                    let __targ__232=fn_args;
                                    if (__targ__232){
                                         return(__targ__232)[idx]
                                    } 
                                })();
                                if (check_true ((null==arg))){
                                    throw new SyntaxError("Missing argument symbol after &");
                                    
                                };
                                await set_ctx(ctx,(arg && arg.name),ArgumentType);
                                 await async function(){
                                    let __target_obj__233=arg;
                                    __target_obj__233["name"]=("..."+(arg && arg.name));
                                    return __target_obj__233;
                                    
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
                        while(await __test_condition__229()) {
                            await __body_ref__230();
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
                            let __target_obj__234=ctx;
                            __target_obj__234["return_last_value"]=false;
                            return __target_obj__234;
                            
                        }()
                    } else {
                         await async function(){
                            let __target_obj__235=ctx;
                            __target_obj__235["return_last_value"]=true;
                            return __target_obj__235;
                            
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
                                let __target_obj__236=ctx;
                                __target_obj__236["return_last_value"]=true;
                                return __target_obj__236;
                                
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
                        let __for_body__239=async function(t) {
                             return  (acc).push(t)
                        };
                        let __array__240=[],__elements__238=["new"," ","Function","("];
                        let __BREAK__FLAG__=false;
                        for(let __iter__237 in __elements__238) {
                            __array__240.push(await __for_body__239(__elements__238[__iter__237]));
                            if(__BREAK__FLAG__) {
                                 __array__240.pop();
                                break;
                                
                            }
                        }return __array__240;
                         
                    })();
                    await (async function(){
                         let __test_condition__241=async function() {
                             return  (idx<((fn_args && fn_args.length)-1))
                        };
                        let __body_ref__242=async function() {
                            idx+=1;
                            arg=await (async function(){
                                let __targ__243=fn_args;
                                if (__targ__243){
                                     return(__targ__243)[idx]
                                } 
                            })();
                            await set_ctx(ctx,(arg && arg.name),ArgumentType);
                            (acc).push(("\""+(arg && arg.name)+"\""));
                            ((type_mark && type_mark["args"])).push((arg && arg.name));
                             return  (acc).push(",")
                        };
                        let __BREAK__FLAG__=false;
                        while(await __test_condition__241()) {
                            await __body_ref__242();
                             if(__BREAK__FLAG__) {
                                 break;
                                
                            }
                        } ;
                        
                    })();
                    (acc).push("\"");
                    await (async function() {
                        let __for_body__246=async function(c) {
                            if (check_true (await not((c==="\n"),(c==="\r")))){
                                if (check_true ((c==="\""))){
                                     (quoted_body).push(await String.fromCharCode(92))
                                };
                                 return  (quoted_body).push(c)
                            }
                        };
                        let __array__247=[],__elements__245=(body).split("");
                        let __BREAK__FLAG__=false;
                        for(let __iter__244 in __elements__245) {
                            __array__247.push(await __for_body__246(__elements__245[__iter__244]));
                            if(__BREAK__FLAG__) {
                                 __array__247.pop();
                                break;
                                
                            }
                        }return __array__247;
                         
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
                        fst=(""+(((stmts instanceof Array)&&await first(stmts)&&(await first(stmts) instanceof Object)&&await (async function(){
                            let __targ__248=await first(stmts);
                            if (__targ__248){
                                 return(__targ__248)["ctype"]
                            } 
                        })()&&await async function(){
                            if (check_true( (await (async function(){
                                let __targ__249=await first(stmts);
                                if (__targ__249){
                                     return(__targ__249)["ctype"]
                                } 
                            })() instanceof String || typeof await (async function(){
                                let __targ__249=await first(stmts);
                                if (__targ__249){
                                     return(__targ__249)["ctype"]
                                } 
                            })()==='string'))) {
                                 return await (async function(){
                                    let __targ__250=await first(stmts);
                                    if (__targ__250){
                                         return(__targ__250)["ctype"]
                                    } 
                                })()
                            } else  {
                                 return await sub_type(await (async function(){
                                    let __targ__251=await first(stmts);
                                    if (__targ__251){
                                         return(__targ__251)["ctype"]
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
                    await (await __GG__("compiler_syntax_validation"))("compile_cond",tokens,errors,ctx,expanded_tree);
                    await async function(){
                        if (check_true( await not((((condition_tokens && condition_tokens.length)%2)===0)))) {
                             throw new SyntaxError("cond: Invalid syntax: missing condition block");
                            
                        } else if (check_true( ((condition_tokens && condition_tokens.length)===0))) {
                             throw new SyntaxError("cond: Invalid syntax: no conditions provided");
                            
                        }
                    } ();
                    await set_ctx(ctx,"__LAMBDA_STEP__",-1);
                    await (async function(){
                         let __test_condition__252=async function() {
                             return  (idx<(condition_tokens && condition_tokens.length))
                        };
                        let __body_ref__253=async function() {
                            inject_return=false;
                            condition=await (async function(){
                                let __targ__254=condition_tokens;
                                if (__targ__254){
                                     return(__targ__254)[idx]
                                } 
                            })();
                            idx+=1;
                            condition_block=await (async function(){
                                let __targ__255=condition_tokens;
                                if (__targ__255){
                                     return(__targ__255)[idx]
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
                                    let __array_op_rval__256=is_form_ques_;
                                     if (__array_op_rval__256 instanceof Function){
                                        return await __array_op_rval__256(condition) 
                                    } else {
                                        return[__array_op_rval__256,condition]
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
                        while(await __test_condition__252()) {
                            await __body_ref__253();
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
                    let __if_id__257= async function(){
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
                        let if_id=await __if_id__257();
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
                            fst=(""+(((stmts instanceof Array)&&await first(stmts)&&(await first(stmts) instanceof Object)&&await (async function(){
                                let __targ__258=await first(stmts);
                                if (__targ__258){
                                     return(__targ__258)["ctype"]
                                } 
                            })()&&await async function(){
                                if (check_true( (await (async function(){
                                    let __targ__259=await first(stmts);
                                    if (__targ__259){
                                         return(__targ__259)["ctype"]
                                    } 
                                })() instanceof String || typeof await (async function(){
                                    let __targ__259=await first(stmts);
                                    if (__targ__259){
                                         return(__targ__259)["ctype"]
                                    } 
                                })()==='string'))) {
                                     return await (async function(){
                                        let __targ__260=await first(stmts);
                                        if (__targ__260){
                                             return(__targ__260)["ctype"]
                                        } 
                                    })()
                                } else  {
                                     return await sub_type(await (async function(){
                                        let __targ__261=await first(stmts);
                                        if (__targ__261){
                                             return(__targ__261)["ctype"]
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
                        ;
                        if (check_true (((ctx && ctx["block_step"])===undefined))){
                             await async function(){
                                let __target_obj__262=ctx;
                                __target_obj__262["block_step"]=0;
                                return __target_obj__262;
                                
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
                                let __target_obj__263=ctx;
                                __target_obj__263["suppress_return"]=true;
                                return __target_obj__263;
                                
                            }()
                        };
                        if (check_true (((await first(compiled_test) instanceof Object)&&await (async function(){
                            let __targ__264=await first(compiled_test);
                            if (__targ__264){
                                 return(__targ__264)["ctype"]
                            } 
                        })()&&(await (async function(){
                            let __targ__265=await first(compiled_test);
                            if (__targ__265){
                                 return(__targ__265)["ctype"]
                            } 
                        })() instanceof String || typeof await (async function(){
                            let __targ__265=await first(compiled_test);
                            if (__targ__265){
                                 return(__targ__265)["ctype"]
                            } 
                        })()==='string')&&await contains_ques_("unction",await (async function(){
                            let __targ__266=await first(compiled_test);
                            if (__targ__266){
                                 return(__targ__266)["ctype"]
                            } 
                        })())))){
                             await (async function() {
                                let __for_body__269=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__270=[],__elements__268=["if"," ","(check_true (",(preamble && preamble["0"])," ",compiled_test,"()","))"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__267 in __elements__268) {
                                    __array__270.push(await __for_body__269(__elements__268[__iter__267]));
                                    if(__BREAK__FLAG__) {
                                         __array__270.pop();
                                        break;
                                        
                                    }
                                }return __array__270;
                                 
                            })()
                        } else {
                             await (async function() {
                                let __for_body__273=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__274=[],__elements__272=["if"," ","(check_true (",compiled_test,"))"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__271 in __elements__272) {
                                    __array__274.push(await __for_body__273(__elements__272[__iter__271]));
                                    if(__BREAK__FLAG__) {
                                         __array__274.pop();
                                        break;
                                        
                                    }
                                }return __array__274;
                                 
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
                            let __target_obj__275=ctx;
                            __target_obj__275["suppress_return"]=in_suppress_ques_;
                            return __target_obj__275;
                            
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
                        if (check_true( ((tokens instanceof Object)&&await not((tokens instanceof Array))&&await not(((tokens && tokens["type"])==="arr"))))) {
                            needs_await=false;
                             return  acc=[await compile(tokens,ctx)]
                        } else if (check_true( await (async function(){
                            let __array_op_rval__276=is_block_ques_;
                             if (__array_op_rval__276 instanceof Function){
                                return await __array_op_rval__276(tokens) 
                            } else {
                                return[__array_op_rval__276,tokens]
                            }
                        })())) {
                            ctx=await new_ctx(ctx);
                            await async function(){
                                let __target_obj__277=ctx;
                                __target_obj__277["return_point"]=1;
                                return __target_obj__277;
                                
                            }();
                             return  acc=["(",(preamble && preamble["1"])," ","function","()","{",await compile(tokens,ctx),"}",")","()"]
                        } else if (check_true( ((tokens instanceof Object)&&((tokens && tokens["val"] && tokens["val"]["0"] && tokens["val"]["0"]["name"])==="if")))) {
                            ctx=await new_ctx(ctx);
                            await async function(){
                                let __target_obj__278=ctx;
                                __target_obj__278["return_point"]=1;
                                return __target_obj__278;
                                
                            }();
                             return  await (async function() {
                                let __for_body__281=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__282=[],__elements__280=["(",(preamble && preamble["1"])," ","function","()","{",await compile_if((tokens && tokens["val"]),ctx),"}",")","()"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__279 in __elements__280) {
                                    __array__282.push(await __for_body__281(__elements__280[__iter__279]));
                                    if(__BREAK__FLAG__) {
                                         __array__282.pop();
                                        break;
                                        
                                    }
                                }return __array__282;
                                 
                            })()
                        } else if (check_true( (tokens instanceof Array))) {
                             return  acc=await compile_block_to_anon_fn(tokens,ctx)
                        } else if (check_true( ((tokens instanceof Object)&&(tokens && tokens["val"])&&((tokens && tokens["type"])==="arr")))) {
                             return  acc=await compile_block_to_anon_fn((tokens && tokens["val"]),ctx)
                        }
                    } ();
                    if (check_true (needs_await)){
                          return [(preamble && preamble["0"])," ",acc]
                    } else {
                          return await (async function(){
                            let __array_op_rval__283=acc;
                             if (__array_op_rval__283 instanceof Function){
                                return await __array_op_rval__283() 
                            } else {
                                return[__array_op_rval__283]
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
                        let __target_obj__284=ctx;
                        __target_obj__284["return_point"]=0;
                        return __target_obj__284;
                        
                    }();
                    await async function(){
                        if (check_true( await (async function(){
                            let __array_op_rval__285=is_block_ques_;
                             if (__array_op_rval__285 instanceof Function){
                                return await __array_op_rval__285(tokens) 
                            } else {
                                return[__array_op_rval__285,tokens]
                            }
                        })())) {
                            await async function(){
                                let __target_obj__286=ctx;
                                __target_obj__286["return_last_value"]=true;
                                return __target_obj__286;
                                
                            }();
                            await async function(){
                                let __target_obj__287=ctx;
                                __target_obj__287["return_point"]=0;
                                return __target_obj__287;
                                
                            }();
                             return  await (async function() {
                                let __for_body__290=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__291=[],__elements__289=["(",(preamble && preamble["1"])," ","function","()",await compile_block(tokens,ctx),")","()"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__288 in __elements__289) {
                                    __array__291.push(await __for_body__290(__elements__289[__iter__288]));
                                    if(__BREAK__FLAG__) {
                                         __array__291.pop();
                                        break;
                                        
                                    }
                                }return __array__291;
                                 
                            })()
                        } else if (check_true( ((tokens && tokens["0"] && tokens["0"]["name"])==="let"))) {
                            await async function(){
                                let __target_obj__292=ctx;
                                __target_obj__292["return_last_value"]=true;
                                return __target_obj__292;
                                
                            }();
                            await async function(){
                                let __target_obj__293=ctx;
                                __target_obj__293["return_point"]=0;
                                return __target_obj__293;
                                
                            }();
                             return  await (async function() {
                                let __for_body__296=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__297=[],__elements__295=["(",(preamble && preamble["1"])," ","function","()",await compile(tokens,ctx),")","()"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__294 in __elements__295) {
                                    __array__297.push(await __for_body__296(__elements__295[__iter__294]));
                                    if(__BREAK__FLAG__) {
                                         __array__297.pop();
                                        break;
                                        
                                    }
                                }return __array__297;
                                 
                            })()
                        } else  {
                            await async function(){
                                let __target_obj__298=ctx;
                                __target_obj__298["return_last_value"]=true;
                                return __target_obj__298;
                                
                            }();
                            await async function(){
                                let __target_obj__299=ctx;
                                __target_obj__299["return_point"]=0;
                                return __target_obj__299;
                                
                            }();
                             return  await (async function() {
                                let __for_body__302=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__303=[],__elements__301=["(",(preamble && preamble["1"])," ","function","()","{"," ","return"," ",await compile(tokens,ctx)," ","}",")","()"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__300 in __elements__301) {
                                    __array__303.push(await __for_body__302(__elements__301[__iter__300]));
                                    if(__BREAK__FLAG__) {
                                         __array__303.pop();
                                        break;
                                        
                                    }
                                }return __array__303;
                                 
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
                                let __for_body__306=async function(token) {
                                     return  (place).push(token)
                                };
                                let __array__307=[],__elements__305=tokens;
                                let __BREAK__FLAG__=false;
                                for(let __iter__304 in __elements__305) {
                                    __array__307.push(await __for_body__306(__elements__305[__iter__304]));
                                    if(__BREAK__FLAG__) {
                                         __array__307.pop();
                                        break;
                                        
                                    }
                                }return __array__307;
                                 
                            })()
                        } else  {
                             return await (async function() {
                                let __for_body__310=async function(token) {
                                     return  (place).push(token)
                                };
                                let __array__311=[],__elements__309=await (async function(){
                                    let __array_op_rval__312=tokens;
                                     if (__array_op_rval__312 instanceof Function){
                                        return await __array_op_rval__312() 
                                    } else {
                                        return[__array_op_rval__312]
                                    }
                                })();
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
                    comps=await (await __GG__("get_object_path"))(target_type);
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
                         target_type=await (await __GG__("path_to_js_syntax"))(comps)
                    };
                    await (async function() {
                        let __for_body__315=async function(opt_token) {
                             return  (args).push(await wrap_assignment_value(await compile(opt_token,ctx),ctx))
                        };
                        let __array__316=[],__elements__314=(new_opts||[]);
                        let __BREAK__FLAG__=false;
                        for(let __iter__313 in __elements__314) {
                            __array__316.push(await __for_body__315(__elements__314[__iter__313]));
                            if(__BREAK__FLAG__) {
                                 __array__316.pop();
                                break;
                                
                            }
                        }return __array__316;
                         
                    })();
                    await async function(){
                        if (check_true( (await not((null==(type_details && type_details["value"])))&&(type_details && type_details["declared_global"])))) {
                            await (async function() {
                                let __for_body__319=async function(arg) {
                                     return  (acc).push(arg)
                                };
                                let __array__320=[],__elements__318=["new"," ",await compile((tokens && tokens["1"]),ctx),"("];
                                let __BREAK__FLAG__=false;
                                for(let __iter__317 in __elements__318) {
                                    __array__320.push(await __for_body__319(__elements__318[__iter__317]));
                                    if(__BREAK__FLAG__) {
                                         __array__320.pop();
                                        break;
                                        
                                    }
                                }return __array__320;
                                 
                            })();
                            await push_as_arg_list(acc,args);
                             return  (acc).push(")")
                        } else if (check_true( (await not((null==(type_details && type_details["value"])))&&(type_details && type_details["value"]) instanceof Function))) {
                            await (async function() {
                                let __for_body__323=async function(arg) {
                                     return  (acc).push(arg)
                                };
                                let __array__324=[],__elements__322=["new"," ",target_type,"("];
                                let __BREAK__FLAG__=false;
                                for(let __iter__321 in __elements__322) {
                                    __array__324.push(await __for_body__323(__elements__322[__iter__321]));
                                    if(__BREAK__FLAG__) {
                                         __array__324.pop();
                                        break;
                                        
                                    }
                                }return __array__324;
                                 
                            })();
                            await push_as_arg_list(acc,args);
                             return  (acc).push(")")
                        } else if (check_true( ((null==(type_details && type_details["value"]))&&await not((null==(root_type_details && root_type_details["value"])))))) {
                            await (async function() {
                                let __for_body__327=async function(arg) {
                                     return  (acc).push(arg)
                                };
                                let __array__328=[],__elements__326=["(",(preamble && preamble["0"])," ",env_ref,"get_global","(","\"","indirect_new","\"",")",")","(",target_type];
                                let __BREAK__FLAG__=false;
                                for(let __iter__325 in __elements__326) {
                                    __array__328.push(await __for_body__327(__elements__326[__iter__325]));
                                    if(__BREAK__FLAG__) {
                                         __array__328.pop();
                                        break;
                                        
                                    }
                                }return __array__328;
                                 
                            })();
                            if (check_true (((args && args.length)>0))){
                                (acc).push(",");
                                 await push_as_arg_list(acc,args)
                            };
                             return  (acc).push(")")
                        }
                    } ();
                    target_return_type=(await get_ctx_val(ctx,target_type)||await (async function(){
                        let __targ__329=(await get_declarations(ctx,target_type)||new Object());
                        if (__targ__329){
                             return(__targ__329)["type"]
                        } 
                    })()||await (await __GG__("get_outside_global"))(target_type)||UnknownType);
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
                             return  ["(","await"," ",env_ref,"set_global(\"",target,"\",","await"," ",env_ref,"get_global(\"",target,"\")"," ",operation," ",how_much,"))"]
                        } else if (check_true(in_infix)) {
                             return  ["(",target,"=",target,operation,how_much,")"]
                        } else  {
                             return await (async function(){
                                let __array_op_rval__330=target;
                                 if (__array_op_rval__330 instanceof Function){
                                    return await __array_op_rval__330(operation,how_much) 
                                } else {
                                    return[__array_op_rval__330,operation,how_much]
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
                        fst=(""+(((stmts instanceof Array)&&await first(stmts)&&(await first(stmts) instanceof Object)&&await (async function(){
                            let __targ__331=await first(stmts);
                            if (__targ__331){
                                 return(__targ__331)["ctype"]
                            } 
                        })()&&await async function(){
                            if (check_true( (await (async function(){
                                let __targ__332=await first(stmts);
                                if (__targ__332){
                                     return(__targ__332)["ctype"]
                                } 
                            })() instanceof String || typeof await (async function(){
                                let __targ__332=await first(stmts);
                                if (__targ__332){
                                     return(__targ__332)["ctype"]
                                } 
                            })()==='string'))) {
                                 return await (async function(){
                                    let __targ__333=await first(stmts);
                                    if (__targ__333){
                                         return(__targ__333)["ctype"]
                                    } 
                                })()
                            } else  {
                                 return await sub_type(await (async function(){
                                    let __targ__334=await first(stmts);
                                    if (__targ__334){
                                         return(__targ__334)["ctype"]
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
                                let __for_body__337=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__338=[],__elements__336=[" ","catch","(",the_exception_ref,")"," ","{"," "];
                                let __BREAK__FLAG__=false;
                                for(let __iter__335 in __elements__336) {
                                    __array__338.push(await __for_body__337(__elements__336[__iter__335]));
                                    if(__BREAK__FLAG__) {
                                         __array__338.pop();
                                        break;
                                        
                                    }
                                }return __array__338;
                                 
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
                                let __for_body__341=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__342=[],__elements__340=[" ","else"," "];
                                let __BREAK__FLAG__=false;
                                for(let __iter__339 in __elements__340) {
                                    __array__342.push(await __for_body__341(__elements__340[__iter__339]));
                                    if(__BREAK__FLAG__) {
                                         __array__342.pop();
                                        break;
                                        
                                    }
                                }return __array__342;
                                 
                            })()
                        };
                        await (async function() {
                            let __for_body__345=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__346=[],__elements__344=[" ","if"," ","(",the_exception_ref," ","instanceof"," ",(err_data && err_data["error_type"]),")"," ","{"," ","let"," ",(err_data && err_data["error_ref"]),"=",the_exception_ref,";"," "];
                            let __BREAK__FLAG__=false;
                            for(let __iter__343 in __elements__344) {
                                __array__346.push(await __for_body__345(__elements__344[__iter__343]));
                                if(__BREAK__FLAG__) {
                                     __array__346.pop();
                                    break;
                                    
                                }
                            }return __array__346;
                             
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
                                let __for_body__349=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__350=[],__elements__348=[" ","else"," ","throw"," ",the_exception_ref,";"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__347 in __elements__348) {
                                    __array__350.push(await __for_body__349(__elements__348[__iter__347]));
                                    if(__BREAK__FLAG__) {
                                         __array__350.pop();
                                        break;
                                        
                                    }
                                }return __array__350;
                                 
                            })()
                        };
                        if (check_true (complete)){
                             await (async function() {
                                let __for_body__353=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__354=[],__elements__352=[" ","}"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__351 in __elements__352) {
                                    __array__354.push(await __for_body__353(__elements__352[__iter__351]));
                                    if(__BREAK__FLAG__) {
                                         __array__354.pop();
                                        break;
                                        
                                    }
                                }return __array__354;
                                 
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
                        let __target_obj__355=ctx;
                        __target_obj__355["return_last_value"]=true;
                        return __target_obj__355;
                        
                    }();
                    await async function(){
                        let __target_obj__356=ctx;
                        __target_obj__356["in_try"]=true;
                        return __target_obj__356;
                        
                    }();
                    stmts=await compile(try_block,ctx);
                    if (check_true (((stmts && stmts["0"] && stmts["0"]["ctype"])&&(((stmts && stmts["0"] && stmts["0"]["ctype"])===AsyncFunction)||((stmts && stmts["0"] && stmts["0"]["ctype"])===Function))))){
                         (stmts).unshift("await")
                    };
                    if (check_true (await (async function(){
                        let __array_op_rval__357=is_complex_ques_;
                         if (__array_op_rval__357 instanceof Function){
                            return await __array_op_rval__357(try_block) 
                        } else {
                            return[__array_op_rval__357,try_block]
                        }
                    })())){
                         await (async function() {
                            let __for_body__360=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__361=[],__elements__359=["try"," ","/* TRY COMPLEX */ ",stmts," "];
                            let __BREAK__FLAG__=false;
                            for(let __iter__358 in __elements__359) {
                                __array__361.push(await __for_body__360(__elements__359[__iter__358]));
                                if(__BREAK__FLAG__) {
                                     __array__361.pop();
                                    break;
                                    
                                }
                            }return __array__361;
                             
                        })()
                    } else {
                         await (async function() {
                            let __for_body__364=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__365=[],__elements__363=await (async function ()  {
                                let __array_arg__366=(async function() {
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
                                return ["try"," ","/* TRY SIMPLE */ ","{"," ",await __array_arg__366(),stmts," ","}"]
                            } )();
                            let __BREAK__FLAG__=false;
                            for(let __iter__362 in __elements__363) {
                                __array__365.push(await __for_body__364(__elements__363[__iter__362]));
                                if(__BREAK__FLAG__) {
                                     __array__365.pop();
                                    break;
                                    
                                }
                            }return __array__365;
                             
                        })()
                    };
                    await (async function(){
                         let __test_condition__367=async function() {
                             return  (idx<(catches && catches.length))
                        };
                        let __body_ref__368=async function() {
                            catch_block=await (async function(){
                                let __targ__370=await (async function(){
                                    let __targ__369=catches;
                                    if (__targ__369){
                                         return(__targ__369)[idx]
                                    } 
                                })();
                                if (__targ__370){
                                     return(__targ__370)["val"]
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
                        while(await __test_condition__367()) {
                            await __body_ref__368();
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
                            let __for_body__373=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__374=[],__elements__372=["throw"," ",error_instance,";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__371 in __elements__372) {
                                __array__374.push(await __for_body__373(__elements__372[__iter__371]));
                                if(__BREAK__FLAG__) {
                                     __array__374.pop();
                                    break;
                                    
                                }
                            }return __array__374;
                             
                        })()
                    } else {
                         await (async function() {
                            let __for_body__377=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__378=[],__elements__376=["throw"," ","new"," ",error_instance,"(",error_message,")",";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__375 in __elements__376) {
                                __array__378.push(await __for_body__377(__elements__376[__iter__375]));
                                if(__BREAK__FLAG__) {
                                     __array__378.pop();
                                    break;
                                    
                                }
                            }return __array__378;
                             
                        })()
                    };
                     return  acc
                };
                compile_break=async function(tokens,ctx) {
                     return  await (async function(){
                        let __array_op_rval__379=break_out;
                         if (__array_op_rval__379 instanceof Function){
                            return await __array_op_rval__379("=","true",";","return") 
                        } else {
                            return[__array_op_rval__379,"=","true",";","return"]
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
                        let __array_op_rval__380=is_block_ques_;
                         if (__array_op_rval__380 instanceof Function){
                            return await __array_op_rval__380((tokens && tokens["1"] && tokens["1"]["val"])) 
                        } else {
                            return[__array_op_rval__380,(tokens && tokens["1"] && tokens["1"]["val"])]
                        }
                    })())){
                         await (async function() {
                            let __for_body__383=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__384=[],__elements__382=["let"," ",return_val_reference,"=",await compile((tokens && tokens["1"] && tokens["1"]["val"]),ctx),";","return"," ",return_val_reference,";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__381 in __elements__382) {
                                __array__384.push(await __for_body__383(__elements__382[__iter__381]));
                                if(__BREAK__FLAG__) {
                                     __array__384.pop();
                                    break;
                                    
                                }
                            }return __array__384;
                             
                        })()
                    } else {
                         await (async function() {
                            let __for_body__387=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__388=[],__elements__386=["return"," ",await compile((tokens && tokens["1"]),ctx),";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__385 in __elements__386) {
                                __array__388.push(await __for_body__387(__elements__386[__iter__385]));
                                if(__BREAK__FLAG__) {
                                     __array__388.pop();
                                    break;
                                    
                                }
                            }return __array__388;
                             
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
                            let __for_body__391=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__392=[],__elements__390=["let"," ",target_argument_ref,"=","[]",".concat","(",await compile(target_arg,ctx),")",";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__389 in __elements__390) {
                                __array__392.push(await __for_body__391(__elements__390[__iter__389]));
                                if(__BREAK__FLAG__) {
                                     __array__392.pop();
                                    break;
                                    
                                }
                            }return __array__392;
                             
                        })();
                        await (async function() {
                            let __for_body__395=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__396=[],__elements__394=["if","(","!",target_argument_ref," ","instanceof"," ","Array",")","{","throw"," ","new"," ","TypeError","(","\"Invalid final argument to apply - an array is required\"",")","}"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__393 in __elements__394) {
                                __array__396.push(await __for_body__395(__elements__394[__iter__393]));
                                if(__BREAK__FLAG__) {
                                     __array__396.pop();
                                    break;
                                    
                                }
                            }return __array__396;
                             
                        })();
                        await (async function() {
                            let __for_body__399=async function(token) {
                                preceding_arg_ref=await gen_temp_name("pre_arg");
                                if (check_true (await (async function(){
                                    let __array_op_rval__401=is_form_ques_;
                                     if (__array_op_rval__401 instanceof Function){
                                        return await __array_op_rval__401(token) 
                                    } else {
                                        return[__array_op_rval__401,token]
                                    }
                                })())){
                                     await (async function() {
                                        let __for_body__404=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__405=[],__elements__403=["let"," ",preceding_arg_ref,"=",await wrap_assignment_value(await compile((token && token["val"]),ctx),ctx),";"];
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__402 in __elements__403) {
                                            __array__405.push(await __for_body__404(__elements__403[__iter__402]));
                                            if(__BREAK__FLAG__) {
                                                 __array__405.pop();
                                                break;
                                                
                                            }
                                        }return __array__405;
                                         
                                    })()
                                } else {
                                     preceding_arg_ref=await wrap_assignment_value(await compile(token,ctx))
                                };
                                 return  (acc).push(await (async function(){
                                    let __array_op_rval__406=target_argument_ref;
                                     if (__array_op_rval__406 instanceof Function){
                                        return await __array_op_rval__406(".unshift","(",preceding_arg_ref,")",";") 
                                    } else {
                                        return[__array_op_rval__406,".unshift","(",preceding_arg_ref,")",";"]
                                    }
                                })())
                            };
                            let __array__400=[],__elements__398=args;
                            let __BREAK__FLAG__=false;
                            for(let __iter__397 in __elements__398) {
                                __array__400.push(await __for_body__399(__elements__398[__iter__397]));
                                if(__BREAK__FLAG__) {
                                     __array__400.pop();
                                    break;
                                    
                                }
                            }return __array__400;
                             
                        })();
                         await (async function() {
                            let __for_body__409=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__410=[],__elements__408=["return"," ","(",function_ref,")",".","apply","(","this",",",target_argument_ref,")"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__407 in __elements__408) {
                                __array__410.push(await __for_body__409(__elements__408[__iter__407]));
                                if(__BREAK__FLAG__) {
                                     __array__410.pop();
                                    break;
                                    
                                }
                            }return __array__410;
                             
                        })()
                    } else {
                        if (check_true (await (async function(){
                            let __array_op_rval__411=is_form_ques_;
                             if (__array_op_rval__411 instanceof Function){
                                return await __array_op_rval__411(args) 
                            } else {
                                return[__array_op_rval__411,args]
                            }
                        })())){
                            await (async function() {
                                let __for_body__414=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__415=[],__elements__413=["let"," ",args_ref,"=",await wrap_assignment_value(await compile((args && args["val"]),ctx),ctx),";"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__412 in __elements__413) {
                                    __array__415.push(await __for_body__414(__elements__413[__iter__412]));
                                    if(__BREAK__FLAG__) {
                                         __array__415.pop();
                                        break;
                                        
                                    }
                                }return __array__415;
                                 
                            })();
                             complex_ques_=true
                        };
                        await (async function() {
                            let __for_body__418=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__419=[],__elements__417=["return"," ","("," ",function_ref,")",".","apply","(","this"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__416 in __elements__417) {
                                __array__419.push(await __for_body__418(__elements__417[__iter__416]));
                                if(__BREAK__FLAG__) {
                                     __array__419.pop();
                                    break;
                                    
                                }
                            }return __array__419;
                             
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
                        if (check_true( (simple_target_ques_&&simple_method_ques_))) {
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
                            let __for_body__422=async function(token) {
                                (acc).push(",");
                                 return  (acc).push(await wrap_assignment_value(await compile(token,ctx),ctx))
                            };
                            let __array__423=[],__elements__421=await tokens["slice"].call(tokens,3);
                            let __BREAK__FLAG__=false;
                            for(let __iter__420 in __elements__421) {
                                __array__423.push(await __for_body__422(__elements__421[__iter__420]));
                                if(__BREAK__FLAG__) {
                                     __array__423.pop();
                                    break;
                                    
                                }
                            }return __array__423;
                             
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
                                        let __for_body__426=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__427=[],__elements__425=await (async function(){
                                            let __array_op_rval__428=(preamble && preamble["0"]);
                                             if (__array_op_rval__428 instanceof Function){
                                                return await __array_op_rval__428(" ",target,"[",method,"]","()") 
                                            } else {
                                                return[__array_op_rval__428," ",target,"[",method,"]","()"]
                                            }
                                        })();
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__424 in __elements__425) {
                                            __array__427.push(await __for_body__426(__elements__425[__iter__424]));
                                            if(__BREAK__FLAG__) {
                                                 __array__427.pop();
                                                break;
                                                
                                            }
                                        }return __array__427;
                                         
                                    })()
                                } else  {
                                    await (async function() {
                                        let __for_body__431=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__432=[],__elements__430=await (async function(){
                                            let __array_op_rval__433=(preamble && preamble["0"]);
                                             if (__array_op_rval__433 instanceof Function){
                                                return await __array_op_rval__433(" ",target,"[",method,"]",".call","(",target) 
                                            } else {
                                                return[__array_op_rval__433," ",target,"[",method,"]",".call","(",target]
                                            }
                                        })();
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__429 in __elements__430) {
                                            __array__432.push(await __for_body__431(__elements__430[__iter__429]));
                                            if(__BREAK__FLAG__) {
                                                 __array__432.pop();
                                                break;
                                                
                                            }
                                        }return __array__432;
                                         
                                    })();
                                    await add_args();
                                     return  (acc).push(")")
                                }
                            } ()
                        } else if (check_true( ((opts && opts["type"])===2))) {
                            await (async function() {
                                let __for_body__436=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__437=[],__elements__435=["{"," ","let"," ","__call_target__","=",target,","," ","__call_method__","=",method,";"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__434 in __elements__435) {
                                    __array__437.push(await __for_body__436(__elements__435[__iter__434]));
                                    if(__BREAK__FLAG__) {
                                         __array__437.pop();
                                        break;
                                        
                                    }
                                }return __array__437;
                                 
                            })();
                            await async function(){
                                if (check_true( ((tokens && tokens.length)===3))) {
                                     return await (async function() {
                                        let __for_body__440=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__441=[],__elements__439=["return"," ",(preamble && preamble["0"])," ","__call_target__","[","__call_method__","]","()"];
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__438 in __elements__439) {
                                            __array__441.push(await __for_body__440(__elements__439[__iter__438]));
                                            if(__BREAK__FLAG__) {
                                                 __array__441.pop();
                                                break;
                                                
                                            }
                                        }return __array__441;
                                         
                                    })()
                                } else  {
                                    await (async function() {
                                        let __for_body__444=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__445=[],__elements__443=["return"," ",(preamble && preamble["0"])," ","__call_target__","[","__call_method__","]",".","call","(","__call_target__"];
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__442 in __elements__443) {
                                            __array__445.push(await __for_body__444(__elements__443[__iter__442]));
                                            if(__BREAK__FLAG__) {
                                                 __array__445.pop();
                                                break;
                                                
                                            }
                                        }return __array__445;
                                         
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
                        let __targ__446=await first(stmts);
                        if (__targ__446){
                             return(__targ__446)["ctype"]
                        } 
                    })() instanceof Function)&&await (async function(){
                        let __targ__447=await first(stmts);
                        if (__targ__447){
                             return(__targ__447)["ctype"]
                        } 
                    })()&&await async function(){
                        if (check_true( (await (async function(){
                            let __targ__448=await first(stmts);
                            if (__targ__448){
                                 return(__targ__448)["ctype"]
                            } 
                        })() instanceof String || typeof await (async function(){
                            let __targ__448=await first(stmts);
                            if (__targ__448){
                                 return(__targ__448)["ctype"]
                            } 
                        })()==='string'))) {
                             return await (async function(){
                                let __targ__449=await first(stmts);
                                if (__targ__449){
                                     return(__targ__449)["ctype"]
                                } 
                            })()
                        } else  {
                             return await sub_type(await (async function(){
                                let __targ__450=await first(stmts);
                                if (__targ__450){
                                     return(__targ__450)["ctype"]
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
                    let __symbols__451= async function(){
                        return []
                    };
                    let from_tokens;
                    let from_place;
                    let acc;
                    {
                        symbol_tokens=(tokens && tokens["1"]);
                        let symbols=await __symbols__451();
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
                                    let __for_body__454=async function(s) {
                                         return  (symbols).push(await compile(s,ctx))
                                    };
                                    let __array__455=[],__elements__453=(symbol_tokens && symbol_tokens["val"]);
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__452 in __elements__453) {
                                        __array__455.push(await __for_body__454(__elements__453[__iter__452]));
                                        if(__BREAK__FLAG__) {
                                             __array__455.pop();
                                            break;
                                            
                                        }
                                    }return __array__455;
                                     
                                })();
                                 return  await (async function() {
                                    let __for_body__458=async function(t) {
                                         return  (acc).push(t)
                                    };
                                    let __array__459=[],__elements__457=await flatten(["{"," ",symbols," ","}"," ","from"," ",from_place]);
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__456 in __elements__457) {
                                        __array__459.push(await __for_body__458(__elements__457[__iter__456]));
                                        if(__BREAK__FLAG__) {
                                             __array__459.pop();
                                            break;
                                            
                                        }
                                    }return __array__459;
                                     
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
                        let __for_body__462=async function(t) {
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
                        let __array__463=[],__elements__461=(await (await __GG__("rest"))(tokens)||[]);
                        let __BREAK__FLAG__=false;
                        for(let __iter__460 in __elements__461) {
                            __array__463.push(await __for_body__462(__elements__461[__iter__460]));
                            if(__BREAK__FLAG__) {
                                 __array__463.pop();
                                break;
                                
                            }
                        }return __array__463;
                         
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
                    ;
                    from_tokens=(tokens && tokens["1"]);
                    (acc).push({
                        ctype:"statement"
                    });
                    from_place=await compile(from_tokens,ctx);
                    await (async function() {
                        let __for_body__466=async function(t) {
                             return  (acc).push(t)
                        };
                        let __array__467=[],__elements__465=await flatten([(preamble && preamble["0"])," ","import"," ","(",from_place,")"]);
                        let __BREAK__FLAG__=false;
                        for(let __iter__464 in __elements__465) {
                            __array__467.push(await __for_body__466(__elements__465[__iter__464]));
                            if(__BREAK__FLAG__) {
                                 __array__467.pop();
                                break;
                                
                            }
                        }return __array__467;
                         
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
                    ;
                    has_lisp_globals=true;
                    await async function(){
                        let __target_obj__468=(root_ctx && root_ctx["defined_lisp_globals"]);
                        __target_obj__468[target]=AsyncFunction;
                        return __target_obj__468;
                        
                    }();
                    if (check_true ((tokens && tokens["3"]))){
                         metavalue=await (async function () {
                             if (check_true (await (async function(){
                                let __array_op_rval__469=is_complex_ques_;
                                 if (__array_op_rval__469 instanceof Function){
                                    return await __array_op_rval__469((tokens && tokens["3"])) 
                                } else {
                                    return[__array_op_rval__469,(tokens && tokens["3"])]
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
                                let __target_obj__470=(root_ctx && root_ctx["defined_lisp_globals"]);
                                __target_obj__470[target]=await async function(){
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
                                return __target_obj__470;
                                
                            }();
                            if (check_true (wrap_as_function_ques_)){
                                 return  assignment_value=[(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function"," ","()",assignment_value,")","()"]
                            }
                        } else  {
                            if (check_true (((assignment_value instanceof Array)&&((assignment_value && assignment_value["0"])==="await")))){
                                  return await async function(){
                                    let __target_obj__471=(root_ctx && root_ctx["defined_lisp_globals"]);
                                    __target_obj__471[target]=AsyncFunction;
                                    return __target_obj__471;
                                    
                                }()
                            } else {
                                  return await async function(){
                                    let __target_obj__472=(root_ctx && root_ctx["defined_lisp_globals"]);
                                    __target_obj__472[target]=assignment_value;
                                    return __target_obj__472;
                                    
                                }()
                            }
                        }
                    } ();
                    if (check_true (await verbosity(ctx))){
                        (clog)("target: ",await (await __GG__("as_lisp"))(target));
                         (clog)("assignment_value: ",await (await __GG__("as_lisp"))(assignment_value))
                    };
                    acc=await (async function ()  {
                        let __array_arg__475=(async function() {
                            if (check_true (((Function===await (async function(){
                                let __targ__473=(root_ctx && root_ctx["defined_lisp_globals"]);
                                if (__targ__473){
                                     return(__targ__473)[target]
                                } 
                            })())||await (async function(){
                                let __array_op_rval__474=in_sync_ques_;
                                 if (__array_op_rval__474 instanceof Function){
                                    return await __array_op_rval__474(ctx) 
                                } else {
                                    return[__array_op_rval__474,ctx]
                                }
                            })()))){
                                  return ""
                            } else {
                                  return "await"
                            }
                        } );
                        let __array_arg__476=(async function() {
                            if (check_true (metavalue)){
                                  return ","
                            } else {
                                  return ""
                            }
                        } );
                        let __array_arg__477=(async function() {
                            if (check_true (metavalue)){
                                  return metavalue
                            } else {
                                  return ""
                            }
                        } );
                        return [{
                            ctype:"statement"
                        },await __array_arg__475()," ","Environment",".","set_global","(","","\"",(tokens && tokens["1"] && tokens["1"]["name"]),"\"",",",assignment_value,await __array_arg__476(),await __array_arg__477(),")"]
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
                    acc=await compile_quotem(lisp_struct,ctx);
                     return  acc
                };
                compile_quotel=async function(lisp_struct,ctx) {
                    let acc;
                    acc=[];
                    acc=await JSON.stringify((lisp_struct && lisp_struct["1"]));
                     return  await (async function(){
                        let __array_op_rval__478=acc;
                         if (__array_op_rval__478 instanceof Function){
                            return await __array_op_rval__478() 
                        } else {
                            return[__array_op_rval__478]
                        }
                    })()
                };
                wrap_and_run=async function(js_code,ctx,run_opts) {
                    let __assembly__479= async function(){
                        return null
                    };
                    let result;
                    let fst;
                    let needs_braces_ques_;
                    let in_quotem;
                    let run_log;
                    let __needs_return_ques___480= async function(){
                        return await (async function ()  {
                            fst=(""+(((js_code instanceof Array)&&await first(js_code)&&(await first(js_code) instanceof Object)&&await (async function(){
                                let __targ__481=await first(js_code);
                                if (__targ__481){
                                     return(__targ__481)["ctype"]
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
                        let assembly=await __assembly__479();
                        ;
                        result=null;
                        fst=null;
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
                        let needs_return_ques_=await __needs_return_ques___480();
                        ;
                        assembled=null;
                        ;
                        if (check_true ((await not((opts && opts["root_environment"]))&&has_lisp_globals))){
                             (first_level_setup).push(["const __GG__=",env_ref,"get_global",";"])
                        };
                        assembled=await (await __GG__("splice_in_return_b"))(await (await __GG__("splice_in_return_a"))(js_code));
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
                            (run_log)("in quotem: ",in_quotem,"needs_braces? ",needs_braces_ques_,"needs_return?",needs_return_ques_);
                             (run_log)("assembled: ",assembled)
                        };
                        assembly=new AsyncFunction("Environment",assembled);
                        if (check_true ((run_opts && run_opts["bind_mode"]))){
                             assembly=await (await __GG__("bind_function"))(assembly,Environment)
                        };
                        result=await assembly(Environment);
                        if (check_true (await verbosity(ctx))){
                             (run_log)("<- ",result)
                        };
                         return  result
                    }
                };
                quote_tree=async function(lisp_tree,ctx,_acc) {
                    let acc;
                    let mode;
                    let in_concat;
                    let in_lambda_ques_;
                    acc=(_acc||[]);
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
                                        if (check_true( (("=:##"===elem)||("=:unquotem"===elem)))) {
                                            if (check_true (in_concat)){
                                                 (acc).push(await compile_wrapper_fn(await tokenize([await (async function(){
                                                    let __targ__482=lisp_tree;
                                                    if (__targ__482){
                                                         return(__targ__482)[await add(i,1)]
                                                    } 
                                                })()],ctx),ctx))
                                            } else {
                                                 (acc).push(await compile_wrapper_fn(await tokenize(await (async function(){
                                                    let __targ__483=lisp_tree;
                                                    if (__targ__483){
                                                         return(__targ__483)[await add(i,1)]
                                                    } 
                                                })(),ctx),ctx))
                                            };
                                             return  mode=1
                                        } else if (check_true( ("=$,@"===elem))) {
                                            if (check_true (await not(in_concat))){
                                                 (acc).push("].concat(")
                                            };
                                            (acc).push(await compile_wrapper_fn(await tokenize(await (async function(){
                                                let __targ__484=lisp_tree;
                                                if (__targ__484){
                                                     return(__targ__484)[await add(i,1)]
                                                } 
                                            })(),ctx),ctx));
                                            in_concat=true;
                                             return  mode=1
                                        } else  {
                                            if (check_true (in_concat)){
                                                  return await quote_tree(await (async function(){
                                                    let __array_op_rval__485=elem;
                                                     if (__array_op_rval__485 instanceof Function){
                                                        return await __array_op_rval__485() 
                                                    } else {
                                                        return[__array_op_rval__485]
                                                    }
                                                })(),ctx,acc)
                                            } else {
                                                  return await quote_tree(elem,ctx,acc)
                                            }
                                        }
                                    } ();
                                    if (check_true ((i<(t-1)))){
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
                                await quote_tree(await (async function(){
                                    let __targ__486=lisp_tree;
                                    if (__targ__486){
                                         return(__targ__486)[k]
                                    } 
                                })(),ctx,acc);
                                if (check_true ((i<(t-1)))){
                                      return (acc).push(",")
                                }
                            },await (await __GG__("keys"))(lisp_tree));
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
                            let __array_arg__487=(async function() {
                                if (check_true (await get_ctx(ctx,"__IN_LAMBDA__"))){
                                      return "[IN LAMBDA]"
                                } else {
                                      return ""
                                }
                            } );
                            (quotem_log)("->",await __array_arg__487(),await JSON.stringify((lisp_struct && lisp_struct["1"])))
                        }
                    };
                    if (check_true (await get_ctx(ctx,"__IN_LAMBDA__"))){
                         quoted_js=await quote_tree((lisp_struct && lisp_struct["1"]),ctx)
                    } else {
                         quoted_js=await quote_tree((lisp_struct && lisp_struct["1"]),ctx)
                    };
                    if (check_true (await verbosity(ctx))){
                         (quotem_log)("<-",await (await __GG__("as_lisp"))(quoted_js))
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
                    let __assembly__488= async function(){
                        return null
                    };
                    let type_mark;
                    let acc;
                    let preamble;
                    let result;
                    {
                        let assembly=await __assembly__488();
                        ;
                        type_mark=null;
                        acc=[];
                        preamble=await calling_preamble(ctx);
                        result=null;
                        assembly=await compile((tokens && tokens["1"] && tokens["1"]["val"]),ctx);
                        if (check_true (await verbosity(ctx))){
                             (eval_log)("assembly:",await clone(assembly))
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
                    ;
                     return  await (async function(){
                        let __array_op_rval__489=(preamble && preamble["2"]);
                         if (__array_op_rval__489 instanceof Function){
                            return await __array_op_rval__489((preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ","{",await compile_for_each_inner(tokens,ctx,preamble)," ","}",")","()") 
                        } else {
                            return[__array_op_rval__489,(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()"," ","{",await compile_for_each_inner(tokens,ctx,preamble)," ","}",")","()"]
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
                        let __array_op_rval__490=is_block_ques_;
                         if (__array_op_rval__490 instanceof Function){
                            return await __array_op_rval__490((for_body && for_body["val"])) 
                        } else {
                            return[__array_op_rval__490,(for_body && for_body["val"])]
                        }
                    })();
                    if (check_true ((iter_count<1))){
                        throw new SyntaxError("Invalid for_each arguments");
                        
                    };
                    await (async function() {
                        let __for_body__493=async function(iter_idx) {
                            (idx_iters).push(await (async function(){
                                let __targ__495=for_args;
                                if (__targ__495){
                                     return(__targ__495)[iter_idx]
                                } 
                            })());
                             return  await set_ctx(ctx,await clean_quoted_reference(await (async function(){
                                let __targ__496=await last(idx_iters);
                                if (__targ__496){
                                     return(__targ__496)["name"]
                                } 
                            })()),ArgumentType)
                        };
                        let __array__494=[],__elements__492=await (await __GG__("range"))(iter_count);
                        let __BREAK__FLAG__=false;
                        for(let __iter__491 in __elements__492) {
                            __array__494.push(await __for_body__493(__elements__492[__iter__491]));
                            if(__BREAK__FLAG__) {
                                 __array__494.pop();
                                break;
                                
                            }
                        }return __array__494;
                         
                    })();
                    await set_ctx(ctx,collector_ref,ArgumentType);
                    await set_ctx(ctx,element_list,"arg");
                    if (check_true (await not(body_is_block_ques_))){
                         for_body=await make_do_block(for_body)
                    };
                    prebuild=await build_fn_with_assignment(body_function_ref,(for_body && for_body["val"]),idx_iters,ctx);
                    await async function(){
                        let __target_obj__497=ctx;
                        __target_obj__497["return_last_value"]=true;
                        return __target_obj__497;
                        
                    }();
                    (acc).push(await compile(prebuild,ctx));
                    await (async function() {
                        let __for_body__500=async function(t) {
                             return  (acc).push(t)
                        };
                        let __array__501=[],__elements__499=["let"," ",collector_ref,"=","[]",",",element_list,"=",await wrap_assignment_value(await compile(elements,ctx),ctx),";"];
                        let __BREAK__FLAG__=false;
                        for(let __iter__498 in __elements__499) {
                            __array__501.push(await __for_body__500(__elements__499[__iter__498]));
                            if(__BREAK__FLAG__) {
                                 __array__501.pop();
                                break;
                                
                            }
                        }return __array__501;
                         
                    })();
                    await (async function() {
                        let __for_body__504=async function(t) {
                             return  (acc).push(t)
                        };
                        let __array__505=[],__elements__503=["let"," ",break_out,"=","false",";"];
                        let __BREAK__FLAG__=false;
                        for(let __iter__502 in __elements__503) {
                            __array__505.push(await __for_body__504(__elements__503[__iter__502]));
                            if(__BREAK__FLAG__) {
                                 __array__505.pop();
                                break;
                                
                            }
                        }return __array__505;
                         
                    })();
                    if (check_true (await (await __GG__("blank?"))((preamble && preamble["0"])))){
                         await set_ctx(ctx,body_function_ref,Function)
                    } else {
                         await set_ctx(ctx,body_function_ref,AsyncFunction)
                    };
                    await async function(){
                        if (check_true( (((for_args && for_args.length)===2)&&await not(((for_args && for_args["1"]) instanceof Array))))) {
                            await set_ctx(ctx,idx_iter,NumberType);
                            await (async function() {
                                let __for_body__508=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__509=[],__elements__507=["for","(","let"," ",idx_iter," ","in"," ",element_list,")"," ","{"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__506 in __elements__507) {
                                    __array__509.push(await __for_body__508(__elements__507[__iter__506]));
                                    if(__BREAK__FLAG__) {
                                         __array__509.pop();
                                        break;
                                        
                                    }
                                }return __array__509;
                                 
                            })();
                            await (async function() {
                                let __for_body__512=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__513=[],__elements__511=await (async function(){
                                    let __array_op_rval__514=collector_ref;
                                     if (__array_op_rval__514 instanceof Function){
                                        return await __array_op_rval__514(".","push","(",(preamble && preamble["0"])," ",body_function_ref,"(",element_list,"[",idx_iter,"]",")",")",";") 
                                    } else {
                                        return[__array_op_rval__514,".","push","(",(preamble && preamble["0"])," ",body_function_ref,"(",element_list,"[",idx_iter,"]",")",")",";"]
                                    }
                                })();
                                let __BREAK__FLAG__=false;
                                for(let __iter__510 in __elements__511) {
                                    __array__513.push(await __for_body__512(__elements__511[__iter__510]));
                                    if(__BREAK__FLAG__) {
                                         __array__513.pop();
                                        break;
                                        
                                    }
                                }return __array__513;
                                 
                            })();
                            await (async function() {
                                let __for_body__517=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__518=[],__elements__516=["if","(",break_out,")"," ","{"," ",collector_ref,".","pop","()",";","break",";","}"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__515 in __elements__516) {
                                    __array__518.push(await __for_body__517(__elements__516[__iter__515]));
                                    if(__BREAK__FLAG__) {
                                         __array__518.pop();
                                        break;
                                        
                                    }
                                }return __array__518;
                                 
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
                        let __for_body__521=async function(t) {
                             return  (prebuild).push(t)
                        };
                        let __array__522=[],__elements__520=["let"," ",break_out,"=","false",";"];
                        let __BREAK__FLAG__=false;
                        for(let __iter__519 in __elements__520) {
                            __array__522.push(await __for_body__521(__elements__520[__iter__519]));
                            if(__BREAK__FLAG__) {
                                 __array__522.pop();
                                break;
                                
                            }
                        }return __array__522;
                         
                    })();
                    await (async function() {
                        let __for_body__525=async function(t) {
                             return  (prebuild).push(t)
                        };
                        let __array__526=[],__elements__524=["while","(",(preamble && preamble["0"])," ",test_condition_ref,"()",")"," ","{",(preamble && preamble["0"])," ",body_ref,"()",";"," ","if","(",break_out,")"," ","{"," ","break",";","}","}"," ","",";"];
                        let __BREAK__FLAG__=false;
                        for(let __iter__523 in __elements__524) {
                            __array__526.push(await __for_body__525(__elements__524[__iter__523]));
                            if(__BREAK__FLAG__) {
                                 __array__526.pop();
                                break;
                                
                            }
                        }return __array__526;
                         
                    })();
                    await (async function() {
                        let __for_body__529=async function(t) {
                             return  (acc).push(t)
                        };
                        let __array__530=[],__elements__528=[(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()","{"," ",prebuild,"}",")","()"];
                        let __BREAK__FLAG__=false;
                        for(let __iter__527 in __elements__528) {
                            __array__530.push(await __for_body__529(__elements__528[__iter__527]));
                            if(__BREAK__FLAG__) {
                                 __array__530.pop();
                                break;
                                
                            }
                        }return __array__530;
                         
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
                              return ((for_args && for_args.length)-1)
                        } else {
                              return 0
                        } 
                    })();
                    for_body=(tokens && tokens["2"]);
                    body_is_block_ques_=await (async function(){
                        let __array_op_rval__531=is_block_ques_;
                         if (__array_op_rval__531 instanceof Function){
                            return await __array_op_rval__531((for_body && for_body["val"])) 
                        } else {
                            return[__array_op_rval__531,(for_body && for_body["val"])]
                        }
                    })();
                    if (check_true ((iter_count<1))){
                        throw new SyntaxError("Invalid for_each arguments");
                        
                    };
                    await (async function() {
                        let __for_body__534=async function(iter_ref) {
                            (idx_iters).push(await (async function(){
                                let __targ__536=for_args;
                                if (__targ__536){
                                     return(__targ__536)[iter_ref]
                                } 
                            })());
                             return  await set_ctx(ctx,await clean_quoted_reference(await (async function(){
                                let __targ__537=await last(idx_iters);
                                if (__targ__537){
                                     return(__targ__537)["name"]
                                } 
                            })()),ArgumentType)
                        };
                        let __array__535=[],__elements__533=await (await __GG__("range"))(iter_count);
                        let __BREAK__FLAG__=false;
                        for(let __iter__532 in __elements__533) {
                            __array__535.push(await __for_body__534(__elements__533[__iter__532]));
                            if(__BREAK__FLAG__) {
                                 __array__535.pop();
                                break;
                                
                            }
                        }return __array__535;
                         
                    })();
                    await set_ctx(ctx,generator_expression,"arg");
                    if (check_true (await not(body_is_block_ques_))){
                         for_body=await make_do_block(for_body)
                    };
                    prebuild=await build_fn_with_assignment(body_function_ref,(for_body && for_body["val"]),idx_iters,ctx);
                    await async function(){
                        let __target_obj__538=ctx;
                        __target_obj__538["return_last_value"]=true;
                        return __target_obj__538;
                        
                    }();
                    (acc).push(await compile(prebuild,ctx));
                    await (async function() {
                        let __for_body__541=async function(t) {
                             return  (acc).push(t)
                        };
                        let __array__542=[],__elements__540=["let"," ",break_out,"=","false",";"];
                        let __BREAK__FLAG__=false;
                        for(let __iter__539 in __elements__540) {
                            __array__542.push(await __for_body__541(__elements__540[__iter__539]));
                            if(__BREAK__FLAG__) {
                                 __array__542.pop();
                                break;
                                
                            }
                        }return __array__542;
                         
                    })();
                    await set_ctx(ctx,body_function_ref,AsyncFunction);
                    await async function(){
                        if (check_true( (((for_args && for_args.length)===2)&&await not(((for_args && for_args["1"]) instanceof Array))))) {
                            await (async function() {
                                let __for_body__545=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__546=[],__elements__544=["for"," ",(preamble && preamble["0"])," ","(","const"," ",iter_ref," ","of"," ",await wrap_assignment_value(await compile(elements,ctx),ctx),")"," ","{"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__543 in __elements__544) {
                                    __array__546.push(await __for_body__545(__elements__544[__iter__543]));
                                    if(__BREAK__FLAG__) {
                                         __array__546.pop();
                                        break;
                                        
                                    }
                                }return __array__546;
                                 
                            })();
                            await (async function() {
                                let __for_body__549=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__550=[],__elements__548=await (async function(){
                                    let __array_op_rval__551=(preamble && preamble["0"]);
                                     if (__array_op_rval__551 instanceof Function){
                                        return await __array_op_rval__551(" ",body_function_ref,"(",iter_ref,")",";") 
                                    } else {
                                        return[__array_op_rval__551," ",body_function_ref,"(",iter_ref,")",";"]
                                    }
                                })();
                                let __BREAK__FLAG__=false;
                                for(let __iter__547 in __elements__548) {
                                    __array__550.push(await __for_body__549(__elements__548[__iter__547]));
                                    if(__BREAK__FLAG__) {
                                         __array__550.pop();
                                        break;
                                        
                                    }
                                }return __array__550;
                                 
                            })();
                            await (async function() {
                                let __for_body__554=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__555=[],__elements__553=["if","(",break_out,")"," ","break",";"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__552 in __elements__553) {
                                    __array__555.push(await __for_body__554(__elements__553[__iter__552]));
                                    if(__BREAK__FLAG__) {
                                         __array__555.pop();
                                        break;
                                        
                                    }
                                }return __array__555;
                                 
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
                    expressions=await (await __GG__("rest"))(tokens);
                    targeted=null;
                    acc=[];
                    source=null;
                    details=null;
                    sanitized_name=null;
                    declaration=null;
                    dec_struct=null;
                    await (async function() {
                        let __for_body__558=async function(exp) {
                            declaration=(exp && exp["val"] && exp["val"]["0"] && exp["val"]["0"]["name"]);
                            targeted=await (await __GG__("rest"))((exp && exp["val"]));
                            if (check_true (await (async function(){
                                let __array_op_rval__560=verbosity;
                                 if (__array_op_rval__560 instanceof Function){
                                    return await __array_op_rval__560(ctx) 
                                } else {
                                    return[__array_op_rval__560,ctx]
                                }
                            })())){
                                 (declare_log)("declaration: ",declaration,"targeted: ",await (await __GG__("each"))(targeted,"name"),targeted)
                            };
                             return  await async function(){
                                if (check_true( (declaration==="toplevel"))) {
                                    await async function(){
                                        let __target_obj__561=opts;
                                        __target_obj__561["root_environment"]=(targeted && targeted["0"]);
                                        return __target_obj__561;
                                        
                                    }();
                                    if (check_true ((opts && opts["root_environment"]))){
                                          return env_ref=""
                                    } else {
                                          return env_ref="Environment."
                                    }
                                } else if (check_true( (declaration==="include"))) {
                                     return  await (async function() {
                                        let __for_body__564=async function(name) {
                                            sanitized_name=await sanitize_js_ref_name(name);
                                            dec_struct=await get_declaration_details(ctx,name);
                                            if (check_true (dec_struct)){
                                                await (async function() {
                                                    let __for_body__568=async function(t) {
                                                         return  (acc).push(t)
                                                    };
                                                    let __array__569=[],__elements__567=["let"," ",sanitized_name,"="];
                                                    let __BREAK__FLAG__=false;
                                                    for(let __iter__566 in __elements__567) {
                                                        __array__569.push(await __for_body__568(__elements__567[__iter__566]));
                                                        if(__BREAK__FLAG__) {
                                                             __array__569.pop();
                                                            break;
                                                            
                                                        }
                                                    }return __array__569;
                                                     
                                                })();
                                                await async function(){
                                                    if (check_true( ((dec_struct && dec_struct["value"]) instanceof Function&&await (async function(){
                                                        let __targ__571=await (async function(){
                                                            let __targ__570=(Environment && Environment["definitions"]);
                                                            if (__targ__570){
                                                                 return(__targ__570)[name]
                                                            } 
                                                        })();
                                                        if (__targ__571){
                                                             return(__targ__571)["fn_body"]
                                                        } 
                                                    })()))) {
                                                        details=await (async function(){
                                                            let __targ__572=(Environment && Environment["definitions"]);
                                                            if (__targ__572){
                                                                 return(__targ__572)[name]
                                                            } 
                                                        })();
                                                        source=("(fn "+(details && details["fn_args"])+" "+(details && details["fn_body"])+")");
                                                        source=await compile(await tokenize(await (await __GG__("read_lisp"))(source),ctx),ctx,1000);
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
                                                let __targ__573=await get_declarations(ctx,name);
                                                if (__targ__573){
                                                     return(__targ__573)["type"]
                                                } 
                                            })())&&(dec_struct && dec_struct["value"]) instanceof Function))){
                                                  return await set_declaration(ctx,name,"type",Function)
                                            }
                                        };
                                        let __array__565=[],__elements__563=await (await __GG__("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__562 in __elements__563) {
                                            __array__565.push(await __for_body__564(__elements__563[__iter__562]));
                                            if(__BREAK__FLAG__) {
                                                 __array__565.pop();
                                                break;
                                                
                                            }
                                        }return __array__565;
                                         
                                    })()
                                } else if (check_true( (declaration==="verbose"))) {
                                    let verbosity_level=await parseInt(await first(await (await __GG__("each"))(targeted,"name")));
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
                                            let __array_op_rval__574=verbosity;
                                             if (__array_op_rval__574 instanceof Function){
                                                return await __array_op_rval__574(ctx) 
                                            } else {
                                                return[__array_op_rval__574,ctx]
                                            }
                                        })())
                                    } else {
                                         (warnings).push("invalid verbosity declaration, expected number, received ")
                                    }
                                } else if (check_true( (declaration==="local"))) {
                                     return await (async function() {
                                        let __for_body__577=async function(name) {
                                            dec_struct=await get_declaration_details(ctx,name);
                                             return  await set_ctx(ctx,name,(dec_struct && dec_struct["value"]))
                                        };
                                        let __array__578=[],__elements__576=await (await __GG__("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__575 in __elements__576) {
                                            __array__578.push(await __for_body__577(__elements__576[__iter__575]));
                                            if(__BREAK__FLAG__) {
                                                 __array__578.pop();
                                                break;
                                                
                                            }
                                        }return __array__578;
                                         
                                    })()
                                } else if (check_true( (declaration==="function"))) {
                                     return  await (async function() {
                                        let __for_body__581=async function(name) {
                                             return  await set_declaration(ctx,name,"type",Function)
                                        };
                                        let __array__582=[],__elements__580=await (await __GG__("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__579 in __elements__580) {
                                            __array__582.push(await __for_body__581(__elements__580[__iter__579]));
                                            if(__BREAK__FLAG__) {
                                                 __array__582.pop();
                                                break;
                                                
                                            }
                                        }return __array__582;
                                         
                                    })()
                                } else if (check_true( (declaration==="array"))) {
                                     return  await (async function() {
                                        let __for_body__585=async function(name) {
                                             return  await set_declaration(ctx,name,"type",Array)
                                        };
                                        let __array__586=[],__elements__584=await (await __GG__("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__583 in __elements__584) {
                                            __array__586.push(await __for_body__585(__elements__584[__iter__583]));
                                            if(__BREAK__FLAG__) {
                                                 __array__586.pop();
                                                break;
                                                
                                            }
                                        }return __array__586;
                                         
                                    })()
                                } else if (check_true( (declaration==="number"))) {
                                     return  await (async function() {
                                        let __for_body__589=async function(name) {
                                             return  await set_declaration(ctx,name,"type",NumberType)
                                        };
                                        let __array__590=[],__elements__588=await (await __GG__("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__587 in __elements__588) {
                                            __array__590.push(await __for_body__589(__elements__588[__iter__587]));
                                            if(__BREAK__FLAG__) {
                                                 __array__590.pop();
                                                break;
                                                
                                            }
                                        }return __array__590;
                                         
                                    })()
                                } else if (check_true( (declaration==="string"))) {
                                     return  await (async function() {
                                        let __for_body__593=async function(name) {
                                             return  await set_declaration(ctx,name,"type",StringType)
                                        };
                                        let __array__594=[],__elements__592=await (await __GG__("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__591 in __elements__592) {
                                            __array__594.push(await __for_body__593(__elements__592[__iter__591]));
                                            if(__BREAK__FLAG__) {
                                                 __array__594.pop();
                                                break;
                                                
                                            }
                                        }return __array__594;
                                         
                                    })()
                                } else if (check_true( (declaration==="boolean"))) {
                                     return  await (async function() {
                                        let __for_body__597=async function(name) {
                                             return  await set_declaration(ctx,name,"type",Boolean)
                                        };
                                        let __array__598=[],__elements__596=await (await __GG__("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__595 in __elements__596) {
                                            __array__598.push(await __for_body__597(__elements__596[__iter__595]));
                                            if(__BREAK__FLAG__) {
                                                 __array__598.pop();
                                                break;
                                                
                                            }
                                        }return __array__598;
                                         
                                    })()
                                } else if (check_true( (declaration==="regexp"))) {
                                     return  await (async function() {
                                        let __for_body__601=async function(name) {
                                             return  await set_declaration(ctx,name,"type",RegExp)
                                        };
                                        let __array__602=[],__elements__600=await (await __GG__("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__599 in __elements__600) {
                                            __array__602.push(await __for_body__601(__elements__600[__iter__599]));
                                            if(__BREAK__FLAG__) {
                                                 __array__602.pop();
                                                break;
                                                
                                            }
                                        }return __array__602;
                                         
                                    })()
                                } else if (check_true( (declaration==="object"))) {
                                     return  await (async function() {
                                        let __for_body__605=async function(name) {
                                             return  await set_declaration(ctx,name,"type",Object)
                                        };
                                        let __array__606=[],__elements__604=await (await __GG__("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__603 in __elements__604) {
                                            __array__606.push(await __for_body__605(__elements__604[__iter__603]));
                                            if(__BREAK__FLAG__) {
                                                 __array__606.pop();
                                                break;
                                                
                                            }
                                        }return __array__606;
                                         
                                    })()
                                } else if (check_true( (declaration==="optimize"))) {
                                     return  await (async function() {
                                        let __for_body__609=async function(factor) {
                                            factor=await (await __GG__("each"))(factor,"name");
                                             return  await async function(){
                                                if (check_true( ((factor && factor["0"])==="safety"))) {
                                                     return await set_declaration(ctx,"__SAFETY__","level",(factor && factor["1"]))
                                                }
                                            } ()
                                        };
                                        let __array__610=[],__elements__608=await (await __GG__("each"))(targeted,"val");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__607 in __elements__608) {
                                            __array__610.push(await __for_body__609(__elements__608[__iter__607]));
                                            if(__BREAK__FLAG__) {
                                                 __array__610.pop();
                                                break;
                                                
                                            }
                                        }return __array__610;
                                         
                                    })()
                                } else  {
                                    (warnings).push(("unknown declaration directive: "+declaration));
                                     return  await (await __GG__("warn"))(("compiler: unknown declaration directive: "+declaration))
                                }
                            } ()
                        };
                        let __array__559=[],__elements__557=expressions;
                        let __BREAK__FLAG__=false;
                        for(let __iter__556 in __elements__557) {
                            __array__559.push(await __for_body__558(__elements__557[__iter__556]));
                            if(__BREAK__FLAG__) {
                                 __array__559.pop();
                                break;
                                
                            }
                        }return __array__559;
                         
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
                             return ref_type=await get_ctx(ctx,(tokens && tokens["0"] && tokens["0"]["name"]))
                        } else  {
                             return ref_type=ArgumentType
                        }
                    } ();
                    if (check_true (await (async function(){
                        let __array_op_rval__611=verbosity;
                         if (__array_op_rval__611 instanceof Function){
                            return await __array_op_rval__611(ctx) 
                        } else {
                            return[__array_op_rval__611,ctx]
                        }
                    })())){
                        (sr_log)("where/what->",call_type,"/",ref_type,"for symbol: ",(tokens && tokens["0"] && tokens["0"]["name"]));
                        if (check_true (await get_ctx(ctx,"__IN_QUOTEM__"))){
                             (sr_log)("in quotem")
                        }
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
                                 let __test_condition__612=async function() {
                                     return  (idx<((tokens && tokens.length)-1))
                                };
                                let __body_ref__613=async function() {
                                    idx+=1;
                                    token=await (async function(){
                                        let __targ__614=tokens;
                                        if (__targ__614){
                                             return(__targ__614)[idx]
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
                                while(await __test_condition__612()) {
                                    await __body_ref__613();
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
                                 let __test_condition__615=async function() {
                                     return  (idx<((tokens && tokens.length)-1))
                                };
                                let __body_ref__616=async function() {
                                    idx+=1;
                                    token=await (async function(){
                                        let __targ__617=tokens;
                                        if (__targ__617){
                                             return(__targ__617)[idx]
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
                                while(await __test_condition__615()) {
                                    await __body_ref__616();
                                     if(__BREAK__FLAG__) {
                                         break;
                                        
                                    }
                                } ;
                                
                            })();
                            (acc).push(")");
                             return  acc
                        } else if (check_true( ((call_type==="local")&&((ref_type==="NumberType")||(ref_type==="StringType")||(ref_type==="Boolean"))))) {
                            (acc).push((tokens && tokens["0"] && tokens["0"]["name"]));
                             return  acc
                        } else if (check_true( ((call_type==="local")&&await not((ref_type===ArgumentType))&&(tokens instanceof Array)))) {
                            val=await get_ctx_val(ctx,(tokens && tokens["0"] && tokens["0"]["name"]));
                            (acc).push(val);
                             return  acc
                        } else if (check_true( ((ref_type===ArgumentType)&&(tokens instanceof Array)))) {
                            (acc).push("[");
                            await (async function(){
                                 let __test_condition__618=async function() {
                                     return  (idx<(tokens && tokens.length))
                                };
                                let __body_ref__619=async function() {
                                    token=await (async function(){
                                        let __targ__620=tokens;
                                        if (__targ__620){
                                             return(__targ__620)[idx]
                                        } 
                                    })();
                                    (acc).push(await compile(token,ctx));
                                    if (check_true ((idx<((tokens && tokens.length)-1)))){
                                         (acc).push(",")
                                    };
                                     return  idx+=1
                                };
                                let __BREAK__FLAG__=false;
                                while(await __test_condition__618()) {
                                    await __body_ref__619();
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
                    basename=await (await __GG__("get_object_path"))(refname);
                    ;
                    declarations=await add(new Object(),await get_declarations(ctx,refname),await get_declaration_details(ctx,refname));
                    if (check_true ((declarations && declarations["inlined"]))){
                         refname=await sanitize_js_ref_name(refname)
                    };
                    if (check_true (((reftype==="StringType")&&await not((refval===undefined))))){
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
                                let __array_op_rval__621=verbosity;
                                 if (__array_op_rval__621 instanceof Function){
                                    return await __array_op_rval__621(ctx) 
                                } else {
                                    return[__array_op_rval__621,ctx]
                                }
                            })())){
                                 await console.log("compile_lisp_scoped_reference: has_first_level? ",await get_ctx(ctx,"has_first_level"),": ",refname)
                            };
                            if (check_true ((await get_ctx(ctx,"has_first_level")&&await not((opts && opts["root_environment"]))))){
                                  return [{
                                    ctype:await (async function() {
                                        if (check_true ((await not(refval instanceof Function)&&(refval instanceof Object)))){
                                              return "object"
                                        } else {
                                              return refval
                                        }
                                    } )()
                                },"(",(preamble && preamble["0"])," ","__GG__","(\"",refname,"\")",")"]
                            } else {
                                  return [{
                                    ctype:await (async function() {
                                        if (check_true ((await not(refval instanceof Function)&&(refval instanceof Object)))){
                                              return "object"
                                        } else {
                                              return refval
                                        }
                                    } )()
                                },"(",(preamble && preamble["0"])," ",env_ref,"get_global","(\"",refname,"\")",")"]
                            }
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
                        let __array_op_rval__622=is_block_ques_;
                         if (__array_op_rval__622 instanceof Function){
                            return await __array_op_rval__622(tokens) 
                        } else {
                            return[__array_op_rval__622,tokens]
                        }
                    })()||(((tokens && tokens["type"])==="arr")&&await (async function(){
                        let __array_op_rval__623=is_block_ques_;
                         if (__array_op_rval__623 instanceof Function){
                            return await __array_op_rval__623((tokens && tokens["val"])) 
                        } else {
                            return[__array_op_rval__623,(tokens && tokens["val"])]
                        }
                    })())||((tokens && tokens["val"] && tokens["val"]["0"] && tokens["val"]["0"]["name"])==="if")||((tokens && tokens["val"] && tokens["val"]["0"] && tokens["val"]["0"]["name"])==="let"));
                     return  rval
                };
                is_form_ques_=async function(token) {
                     return  (((token && token["val"]) instanceof Array)||await (async function(){
                        let __array_op_rval__624=is_block_ques_;
                         if (__array_op_rval__624 instanceof Function){
                            return await __array_op_rval__624((token && token["val"])) 
                        } else {
                            return[__array_op_rval__624,(token && token["val"])]
                        }
                    })())
                };
                op_lookup=await ( async function(){
                    let __obj__625=new Object();
                    __obj__625["+"]=infix_ops;
                    __obj__625["*"]=infix_ops;
                    __obj__625["/"]=infix_ops;
                    __obj__625["-"]=infix_ops;
                    __obj__625["**"]=infix_ops;
                    __obj__625["%"]=infix_ops;
                    __obj__625["<<"]=infix_ops;
                    __obj__625[">>"]=infix_ops;
                    __obj__625["and"]=infix_ops;
                    __obj__625["or"]=infix_ops;
                    __obj__625["apply"]=compile_apply;
                    __obj__625["call"]=compile_call;
                    __obj__625["->"]=compile_call;
                    __obj__625["set_prop"]=compile_set_prop;
                    __obj__625["prop"]=compile_prop;
                    __obj__625["="]=compile_assignment;
                    __obj__625["setq"]=compile_assignment;
                    __obj__625["=="]=compile_compare;
                    __obj__625["eq"]=compile_compare;
                    __obj__625[">"]=compile_compare;
                    __obj__625["<"]=compile_compare;
                    __obj__625["<="]=compile_compare;
                    __obj__625[">="]=compile_compare;
                    __obj__625["return"]=compile_return;
                    __obj__625["new"]=compile_new;
                    __obj__625["do"]=compile_block;
                    __obj__625["progn"]=compile_block;
                    __obj__625["progl"]=async function(tokens,ctx) {
                         return  await compile_block(tokens,ctx,{
                            no_scope_boundary:true,suppress_return:true
                        })
                    };
                    __obj__625["break"]=compile_break;
                    __obj__625["inc"]=compile_val_mod;
                    __obj__625["dec"]=compile_val_mod;
                    __obj__625["try"]=compile_try;
                    __obj__625["throw"]=compile_throw;
                    __obj__625["let"]=compile_let;
                    __obj__625["defvar"]=compile_defvar;
                    __obj__625["while"]=compile_while;
                    __obj__625["for_each"]=compile_for_each;
                    __obj__625["if"]=compile_if;
                    __obj__625["cond"]=compile_cond;
                    __obj__625["fn"]=compile_fn;
                    __obj__625["lambda"]=compile_fn;
                    __obj__625["function*"]=async function(tokens,ctx) {
                         return  await compile_fn(tokens,ctx,{
                            generator:true
                        })
                    };
                    __obj__625["defglobal"]=compile_set_global;
                    __obj__625["list"]=compile_list;
                    __obj__625["function"]=async function(tokens,ctx) {
                         return  await compile_fn(tokens,ctx,{
                            synchronous:true
                        })
                    };
                    __obj__625["=>"]=async function(tokens,ctx) {
                         return  await compile_fn(tokens,ctx,{
                            arrow:true
                        })
                    };
                    __obj__625["yield"]=compile_yield;
                    __obj__625["for_with"]=compile_for_with;
                    __obj__625["quotem"]=compile_quotem;
                    __obj__625["quote"]=compile_quote;
                    __obj__625["quotel"]=compile_quotel;
                    __obj__625["eval"]=compile_eval;
                    __obj__625["jslambda"]=compile_jslambda;
                    __obj__625["javascript"]=compile_javascript;
                    __obj__625["instanceof"]=compile_instanceof;
                    __obj__625["typeof"]=compile_typeof;
                    __obj__625["unquotem"]=compile_unquotem;
                    __obj__625["debug"]=compile_debug;
                    __obj__625["declare"]=compile_declare;
                    __obj__625["import"]=compile_import;
                    __obj__625["dynamic_import"]=compile_dynamic_import;
                    return __obj__625;
                    
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
                    total_length=((tokens && tokens["val"] && tokens["val"]["length"])-1);
                    ;
                    await async function(){
                        let __target_obj__626=ctx;
                        __target_obj__626["in_obj_literal"]=true;
                        return __target_obj__626;
                        
                    }();
                    await (async function() {
                        let __for_body__629=async function(token) {
                            if (check_true ((((token && token["type"])==="keyval")&&await check_invalid_js_ref((token && token.name))))){
                                has_valid_key_literals=false;
                                __BREAK__FLAG__=true;
                                return
                            }
                        };
                        let __array__630=[],__elements__628=((tokens && tokens["val"])||[]);
                        let __BREAK__FLAG__=false;
                        for(let __iter__627 in __elements__628) {
                            __array__630.push(await __for_body__629(__elements__628[__iter__627]));
                            if(__BREAK__FLAG__) {
                                 __array__630.pop();
                                break;
                                
                            }
                        }return __array__630;
                         
                    })();
                    if (check_true (has_valid_key_literals)){
                         if (check_true (((tokens && tokens["val"] && tokens["val"]["name"])==="{}"))){
                              return [{
                                ctype:"objliteral"
                            },"new Object()"]
                        } else {
                            (acc).push("{");
                            await (async function(){
                                 let __test_condition__631=async function() {
                                     return  (idx<total_length)
                                };
                                let __body_ref__632=async function() {
                                    idx+=1;
                                    kvpair=await (async function(){
                                        let __targ__633=(tokens && tokens["val"]);
                                        if (__targ__633){
                                             return(__targ__633)[idx]
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
                                while(await __test_condition__631()) {
                                    await __body_ref__632();
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
                            let __for_body__636=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__637=[],__elements__635=[{
                                ctype:"statement"
                            },(preamble && preamble["0"])," ","("," ",(preamble && preamble["1"])," ","function","()","{","let"," ",tmp_name,"=","new"," ","Object","()",";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__634 in __elements__635) {
                                __array__637.push(await __for_body__636(__elements__635[__iter__634]));
                                if(__BREAK__FLAG__) {
                                     __array__637.pop();
                                    break;
                                    
                                }
                            }return __array__637;
                             
                        })();
                        await (async function(){
                             let __test_condition__638=async function() {
                                 return  (idx<total_length)
                            };
                            let __body_ref__639=async function() {
                                idx+=1;
                                kvpair=await (async function(){
                                    let __targ__640=(tokens && tokens["val"]);
                                    if (__targ__640){
                                         return(__targ__640)[idx]
                                    } 
                                })();
                                 return  await (async function() {
                                    let __for_body__643=async function(t) {
                                         return  (acc).push(t)
                                    };
                                    let __array__644=[],__elements__642=await (async function(){
                                        let __array_op_rval__645=tmp_name;
                                         if (__array_op_rval__645 instanceof Function){
                                            return await __array_op_rval__645("[","\"",await cl_encode_string(await get_val((kvpair && kvpair["val"] && kvpair["val"]["0"]),ctx)),"\"","]","=",await compile_elem((kvpair && kvpair["val"] && kvpair["val"]["1"]),ctx),";") 
                                        } else {
                                            return[__array_op_rval__645,"[","\"",await cl_encode_string(await get_val((kvpair && kvpair["val"] && kvpair["val"]["0"]),ctx)),"\"","]","=",await compile_elem((kvpair && kvpair["val"] && kvpair["val"]["1"]),ctx),";"]
                                        }
                                    })();
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__641 in __elements__642) {
                                        __array__644.push(await __for_body__643(__elements__642[__iter__641]));
                                        if(__BREAK__FLAG__) {
                                             __array__644.pop();
                                            break;
                                            
                                        }
                                    }return __array__644;
                                     
                                })()
                            };
                            let __BREAK__FLAG__=false;
                            while(await __test_condition__638()) {
                                await __body_ref__639();
                                 if(__BREAK__FLAG__) {
                                     break;
                                    
                                }
                            } ;
                            
                        })();
                        await (async function() {
                            let __for_body__648=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__649=[],__elements__647=["return"," ",tmp_name,";","}",")","()"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__646 in __elements__647) {
                                __array__649.push(await __for_body__648(__elements__647[__iter__646]));
                                if(__BREAK__FLAG__) {
                                     __array__649.pop();
                                    break;
                                    
                                }
                            }return __array__649;
                             
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
                    let __op__651= async function(){
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
                        let op=await __op__651();
                        ;
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
                                        if (check_true( (await is_number_ques_(tokens)||(tokens instanceof String || typeof tokens==='string')||(await sub_type(tokens)==="Boolean")))) {
                                             return tokens
                                        } else if (check_true( ((tokens instanceof Array)&&(tokens && tokens["0"] && tokens["0"]["ref"])&&await not((await get_ctx(ctx,(tokens && tokens["0"] && tokens["0"]["name"]))===UnknownType))&&(await (async function(){
                                            let __targ__653=op_lookup;
                                            if (__targ__653){
                                                 return(__targ__653)[(tokens && tokens["0"] && tokens["0"]["name"])]
                                            } 
                                        })()||(Function===await get_ctx(ctx,(tokens && tokens["0"] && tokens["0"]["name"])))||(AsyncFunction===await get_ctx(ctx,(tokens && tokens["0"] && tokens["0"]["name"])))||("function"===typeof await (async function(){
                                            let __targ__654=(root_ctx && root_ctx["defined_lisp_globals"]);
                                            if (__targ__654){
                                                 return(__targ__654)[(tokens && tokens["0"] && tokens["0"]["name"])]
                                            } 
                                        })())||await get_lisp_ctx((tokens && tokens["0"] && tokens["0"]["name"])) instanceof Function)))) {
                                            op_token=await first(tokens);
                                            operator=await (async function(){
                                                let __targ__655=op_token;
                                                if (__targ__655){
                                                     return(__targ__655)["name"]
                                                } 
                                            })();
                                            operator_type=await (async function(){
                                                let __targ__656=op_token;
                                                if (__targ__656){
                                                     return(__targ__656)["val"]
                                                } 
                                            })();
                                            ref=await (async function(){
                                                let __targ__657=op_token;
                                                if (__targ__657){
                                                     return(__targ__657)["ref"]
                                                } 
                                            })();
                                            op=await (async function(){
                                                let __targ__658=op_lookup;
                                                if (__targ__658){
                                                     return(__targ__658)[operator]
                                                } 
                                            })();
                                             return  await async function(){
                                                if (check_true(op)) {
                                                     return (op)(tokens,ctx)
                                                } else if (check_true( await (async function(){
                                                    let __targ__659=(Environment && Environment["inlines"]);
                                                    if (__targ__659){
                                                         return(__targ__659)[operator]
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
                                                        let __for_body__662=async function(t) {
                                                            if (check_true (await not(await get_ctx_val(ctx,"__IN_LAMBDA__")))){
                                                                 await set_ctx(ctx,"__LAMBDA_STEP__",0)
                                                            };
                                                             return  (compiled_values).push(await compile(t,ctx,await add(_cdepth,1)))
                                                        };
                                                        let __array__663=[],__elements__661=await (await __GG__("rest"))(tokens);
                                                        let __BREAK__FLAG__=false;
                                                        for(let __iter__660 in __elements__661) {
                                                            __array__663.push(await __for_body__662(__elements__661[__iter__660]));
                                                            if(__BREAK__FLAG__) {
                                                                 __array__663.pop();
                                                                break;
                                                                
                                                            }
                                                        }return __array__663;
                                                         
                                                    })();
                                                    await map(async function(compiled_element,idx) {
                                                        let inst;
                                                        inst=await (async function () {
                                                             if (check_true ((((compiled_element && compiled_element["0"]) instanceof Object)&&await (async function(){
                                                                let __targ__664=(compiled_element && compiled_element["0"]);
                                                                if (__targ__664){
                                                                     return(__targ__664)["ctype"]
                                                                } 
                                                            })()))){
                                                                  return await (async function(){
                                                                    let __targ__665=(compiled_element && compiled_element["0"]);
                                                                    if (__targ__665){
                                                                         return(__targ__665)["ctype"]
                                                                    } 
                                                                })()
                                                            } else {
                                                                  return null
                                                            } 
                                                        })();
                                                         return  await async function(){
                                                            if (check_true( ((inst==="block")||(inst==="letblock")))) {
                                                                 return  (symbolic_replacements).push(await (async function(){
                                                                    let __array_op_rval__666=idx;
                                                                     if (__array_op_rval__666 instanceof Function){
                                                                        return await __array_op_rval__666(await gen_temp_name("array_arg"),[(preamble && preamble["2"]),"(",(preamble && preamble["1"])," ","function","()"," ",compiled_element," ",")"]) 
                                                                    } else {
                                                                        return[__array_op_rval__666,await gen_temp_name("array_arg"),[(preamble && preamble["2"]),"(",(preamble && preamble["1"])," ","function","()"," ",compiled_element," ",")"]]
                                                                    }
                                                                })())
                                                            } else if (check_true( (inst==="ifblock"))) {
                                                                 return  (symbolic_replacements).push(await (async function(){
                                                                    let __array_op_rval__667=idx;
                                                                     if (__array_op_rval__667 instanceof Function){
                                                                        return await __array_op_rval__667(await gen_temp_name("array_arg"),[(preamble && preamble["2"]),"(",(preamble && preamble["1"])," ","function","()"," ","{",compiled_element,"}"," ",")"]) 
                                                                    } else {
                                                                        return[__array_op_rval__667,await gen_temp_name("array_arg"),[(preamble && preamble["2"]),"(",(preamble && preamble["1"])," ","function","()"," ","{",compiled_element,"}"," ",")"]]
                                                                    }
                                                                })())
                                                            }
                                                        } ()
                                                    },compiled_values);
                                                    await (async function() {
                                                        let __for_body__670=async function(elem) {
                                                            await (async function() {
                                                                let __for_body__674=async function(t) {
                                                                     return  (acc).push(t)
                                                                };
                                                                let __array__675=[],__elements__673=["let"," ",(elem && elem["1"]),"=",(elem && elem["2"]),";"];
                                                                let __BREAK__FLAG__=false;
                                                                for(let __iter__672 in __elements__673) {
                                                                    __array__675.push(await __for_body__674(__elements__673[__iter__672]));
                                                                    if(__BREAK__FLAG__) {
                                                                         __array__675.pop();
                                                                        break;
                                                                        
                                                                    }
                                                                }return __array__675;
                                                                 
                                                            })();
                                                             return  await compiled_values["splice"].call(compiled_values,(elem && elem["0"]),1,[(preamble && preamble["0"])," ",(elem && elem["1"]),"()"])
                                                        };
                                                        let __array__671=[],__elements__669=symbolic_replacements;
                                                        let __BREAK__FLAG__=false;
                                                        for(let __iter__668 in __elements__669) {
                                                            __array__671.push(await __for_body__670(__elements__669[__iter__668]));
                                                            if(__BREAK__FLAG__) {
                                                                 __array__671.pop();
                                                                break;
                                                                
                                                            }
                                                        }return __array__671;
                                                         
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
                                                                let __for_body__678=async function(t) {
                                                                     return  (acc).push(t)
                                                                };
                                                                let __array__679=[],__elements__677=["(",rcv,")","("];
                                                                let __BREAK__FLAG__=false;
                                                                for(let __iter__676 in __elements__677) {
                                                                    __array__679.push(await __for_body__678(__elements__677[__iter__676]));
                                                                    if(__BREAK__FLAG__) {
                                                                         __array__679.pop();
                                                                        break;
                                                                        
                                                                    }
                                                                }return __array__679;
                                                                 
                                                            })();
                                                            await push_as_arg_list(acc,compiled_values);
                                                             return  (acc).push(")")
                                                        } else if (check_true( ((null==(declared_type && declared_type["type"]))&&(((tokens && tokens["0"] && tokens["0"]["type"])==="arg")||((rcv instanceof String || typeof rcv==='string')&&await get_declaration_details(ctx,rcv))||((rcv instanceof Array)&&((rcv && rcv["0"]) instanceof Object)&&((rcv && rcv["0"] && rcv["0"]["ctype"]) instanceof String || typeof (rcv && rcv["0"] && rcv["0"]["ctype"])==='string')&&((rcv && rcv["0"] && rcv["0"]["ctype"])&&(await not(await contains_ques_("unction",(rcv && rcv["0"] && rcv["0"]["ctype"])))&&await not(("string"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&&await not(("StringType"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&&await not(("nil"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&&await not(("NumberType"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&&await not(("undefined"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&&await not(("objliteral"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&&await not(("Boolean"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&&await not(("array"===(rcv && rcv["0"] && rcv["0"]["ctype"])))))))))) {
                                                            if (check_true (show_hints)){
                                                                 (comp_warn)("value ambiguity - use declare to clarify: ",await source_from_tokens(tokens,expanded_tree,true)," ",await (await __GG__("as_lisp"))(rcv))
                                                            };
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
                                                                let __for_body__682=async function(t) {
                                                                     return  (acc).push(t)
                                                                };
                                                                let __array__683=[],__elements__681=[(preamble && preamble["0"])," ","(",(preamble && preamble["1"])," ","function","()","{","let"," ",tmp_name,"=",rcv,";"," ","if"," ","(",tmp_name," ","instanceof"," ","Function",")","{","return"," ",(preamble && preamble["0"])," ",tmp_name,"("];
                                                                let __BREAK__FLAG__=false;
                                                                for(let __iter__680 in __elements__681) {
                                                                    __array__683.push(await __for_body__682(__elements__681[__iter__680]));
                                                                    if(__BREAK__FLAG__) {
                                                                         __array__683.pop();
                                                                        break;
                                                                        
                                                                    }
                                                                }return __array__683;
                                                                 
                                                            })();
                                                            await push_as_arg_list(acc,compiled_values);
                                                            await (async function() {
                                                                let __for_body__686=async function(t) {
                                                                     return  (acc).push(t)
                                                                };
                                                                let __array__687=[],__elements__685=[")"," ","}"," ","else"," ","{","return","[",tmp_name];
                                                                let __BREAK__FLAG__=false;
                                                                for(let __iter__684 in __elements__685) {
                                                                    __array__687.push(await __for_body__686(__elements__685[__iter__684]));
                                                                    if(__BREAK__FLAG__) {
                                                                         __array__687.pop();
                                                                        break;
                                                                        
                                                                    }
                                                                }return __array__687;
                                                                 
                                                            })();
                                                            if (check_true ((await length(await (await __GG__("rest"))(tokens))>0))){
                                                                (acc).push(",");
                                                                 await push_as_arg_list(acc,compiled_values)
                                                            };
                                                             return  await (async function() {
                                                                let __for_body__690=async function(t) {
                                                                     return  (acc).push(t)
                                                                };
                                                                let __array__691=[],__elements__689=["]","}","}",")","()"];
                                                                let __BREAK__FLAG__=false;
                                                                for(let __iter__688 in __elements__689) {
                                                                    __array__691.push(await __for_body__690(__elements__689[__iter__688]));
                                                                    if(__BREAK__FLAG__) {
                                                                         __array__691.pop();
                                                                        break;
                                                                        
                                                                    }
                                                                }return __array__691;
                                                                 
                                                            })()
                                                        } else  {
                                                            let __array_arg__692=(async function() {
                                                                if (check_true ((await length(await (await __GG__("rest"))(tokens))>0))){
                                                                    (acc).push(",");
                                                                     await push_as_arg_list(acc,compiled_values)
                                                                }
                                                            } );
                                                            return await (async function(){
                                                                let __array_op_rval__693=await (async function() {
                                                                    if (check_true (((symbolic_replacements && symbolic_replacements.length)>0))){
                                                                        (acc).push("return");
                                                                         (acc).push(" ")
                                                                    }
                                                                } )();
                                                                 if (__array_op_rval__693 instanceof Function){
                                                                    return await __array_op_rval__693((acc).push("["),rcv=await check_statement(rcv),(acc).push(rcv),await __array_arg__692(),(acc).push("]")) 
                                                                } else {
                                                                    return[__array_op_rval__693,(acc).push("["),rcv=await check_statement(rcv),(acc).push(rcv),await __array_arg__692(),(acc).push("]")]
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
                                        } else if (check_true( ((tokens instanceof Object)&&((tokens && tokens["val"]) instanceof Array)&&(tokens && tokens["type"])))) {
                                            await async function(){
                                                let __target_obj__694=ctx;
                                                __target_obj__694["source"]=(tokens && tokens["source"]);
                                                return __target_obj__694;
                                                
                                            }();
                                            rcv=await compile((tokens && tokens["val"]),ctx,await add(_cdepth,1));
                                             return  rcv
                                        } else if (check_true( (((tokens instanceof Object)&&await check_true((tokens && tokens["val"]))&&(tokens && tokens["type"]))||((tokens && tokens["type"])==="literal")||((tokens && tokens["type"])==="arg")||((tokens && tokens["type"])==="null")))) {
                                            if (check_true (await (async function(){
                                                let __array_op_rval__695=verbosity;
                                                 if (__array_op_rval__695 instanceof Function){
                                                    return await __array_op_rval__695(ctx) 
                                                } else {
                                                    return[__array_op_rval__695,ctx]
                                                }
                                            })())){
                                                (comp_log)(("compile: "+_cdepth+" singleton: "),tokens);
                                                if (check_true (await get_ctx(ctx,"__IN_QUOTEM__"))){
                                                     (comp_log)(("compile: "+_cdepth+" singleton: "),"in quotem")
                                                }
                                            };
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
                                                          return [{
                                                            ctype:"string"
                                                        },("\""+await cl_encode_string((tokens && tokens["val"]))+"\"")]
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
                                                } else if (check_true( ((tokens && tokens["ref"])&&(opts && opts["root_environment"])))) {
                                                     return  await (await __GG__("path_to_js_syntax"))((await sanitize_js_ref_name((tokens && tokens.name))).split("."))
                                                } else if (check_true( ((tokens && tokens["ref"])&&await (async function(){
                                                    let __targ__696=op_lookup;
                                                    if (__targ__696){
                                                         return(__targ__696)[(tokens && tokens.name)]
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
                                                    if (check_true (await (async function(){
                                                        let __array_op_rval__697=verbosity;
                                                         if (__array_op_rval__697 instanceof Function){
                                                            return await __array_op_rval__697(ctx) 
                                                        } else {
                                                            return[__array_op_rval__697,ctx]
                                                        }
                                                    })())){
                                                         (comp_log)("compile: singleton: found local context: ",refval,"literal?",await (async function(){
                                                            let __array_op_rval__698=is_literal_ques_;
                                                             if (__array_op_rval__698 instanceof Function){
                                                                return await __array_op_rval__698(refval) 
                                                            } else {
                                                                return[__array_op_rval__698,refval]
                                                            }
                                                        })())
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
                            } catch(__exception__652) {
                                  if (__exception__652 instanceof Error) {
                                     let e=__exception__652;
                                     {
                                        is_error={
                                            error:(e && e.name),source_name:source_name,message:(e && e.message),form:await source_from_tokens(tokens,expanded_tree),parent_forms:await source_from_tokens(tokens,expanded_tree,true),invalid:true
                                        };
                                        if (check_true ((opts && opts["throw_on_error"])))throw is_error;
                                        ;
                                        if (check_true (await not((e && e["handled"])))){
                                              return (errors).push(is_error)
                                        }
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
                            let __for_body__701=async function(spacer) {
                                 return  (text).push(spacer)
                            };
                            let __array__702=[],__elements__700=format_depth;
                            let __BREAK__FLAG__=false;
                            for(let __iter__699 in __elements__700) {
                                __array__702.push(await __for_body__701(__elements__700[__iter__699]));
                                if(__BREAK__FLAG__) {
                                     __array__702.pop();
                                    break;
                                    
                                }
                            }return __array__702;
                             
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
                            let __for_body__705=async function(t) {
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
                            let __array__706=[],__elements__704=js_tokens;
                            let __BREAK__FLAG__=false;
                            for(let __iter__703 in __elements__704) {
                                __array__706.push(await __for_body__705(__elements__704[__iter__703]));
                                if(__BREAK__FLAG__) {
                                     __array__706.pop();
                                    break;
                                    
                                }
                            }return __array__706;
                             
                        })()
                    };
                    {
                        await assemble(await flatten(await (async function(){
                            let __array_op_rval__707=js_tree;
                             if (__array_op_rval__707 instanceof Function){
                                return await __array_op_rval__707() 
                            } else {
                                return[__array_op_rval__707]
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
                await set_ctx(root_ctx,break_out,false);
                await async function(){
                    let __target_obj__708=root_ctx;
                    __target_obj__708["defined_lisp_globals"]=new Object();
                    return __target_obj__708;
                    
                }();
                await set_ctx(root_ctx,"__SOURCE_NAME__",source_name);
                await set_ctx(root_ctx,"__LAMBDA_STEP__",-1);
                output=await async function(){
                    if (check_true((opts && opts["special_operators"]))) {
                         return await (await __GG__("make_set"))(await (await __GG__("keys"))(op_lookup))
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
                            }  catch(__exception__709) {
                                  if (__exception__709 instanceof Error) {
                                     let e=__exception__709;
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
                                if (check_true ((await not((opts && opts["root_environment"]))&&has_lisp_globals))){
                                     (first_level_setup).push(["const __GG__=",env_ref,"get_global",";"])
                                };
                                assembly=await (await __GG__("splice_in_return_a"))(assembly);
                                 return  assembly=await (await __GG__("splice_in_return_b"))(assembly)
                            }
                        } ();
                        if (check_true ((opts && opts["root_environment"]))){
                             has_lisp_globals=false
                        };
                        if (check_true (((assembly && assembly["0"] && assembly["0"]["ctype"])&&(assembly && assembly["0"] && assembly["0"]["ctype"]) instanceof Function))){
                             await async function(){
                                let __target_obj__710=(assembly && assembly["0"]);
                                __target_obj__710["ctype"]=await map_value_to_ctype((assembly && assembly["0"] && assembly["0"]["ctype"]));
                                return __target_obj__710;
                                
                            }()
                        };
                        await async function(){
                            if (check_true( (await not(is_error)&&assembly&&(await first(assembly) instanceof Object)&&await (async function(){
                                let __targ__711=await first(assembly);
                                if (__targ__711){
                                     return(__targ__711)["ctype"]
                                } 
                            })()&&(await not((await (async function(){
                                let __targ__712=await first(assembly);
                                if (__targ__712){
                                     return(__targ__712)["ctype"]
                                } 
                            })() instanceof String || typeof await (async function(){
                                let __targ__712=await first(assembly);
                                if (__targ__712){
                                     return(__targ__712)["ctype"]
                                } 
                            })()==='string'))||await (async function ()  {
                                let val;
                                val=await (async function(){
                                    let __targ__713=await first(assembly);
                                    if (__targ__713){
                                         return(__targ__713)["ctype"]
                                    } 
                                })();
                                 return  (await not((val==="assignment"))&&await not(await contains_ques_("block",val))&&await not(await contains_ques_("unction",val)))
                            } )())))) {
                                 return await async function(){
                                    let __target_obj__714=(assembly && assembly["0"]);
                                    __target_obj__714["ctype"]="statement";
                                    return __target_obj__714;
                                    
                                }()
                            } else if (check_true( (assembly&&(await first(assembly) instanceof String || typeof await first(assembly)==='string')&&(await first(assembly)==="throw")))) {
                                 return assembly=[{
                                    ctype:"block"
                                },assembly]
                            } else if (check_true( (await not(is_error)&&assembly&&(await not((await first(assembly) instanceof Object))||await not(await (async function(){
                                let __targ__715=await first(assembly);
                                if (__targ__715){
                                     return(__targ__715)["ctype"]
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
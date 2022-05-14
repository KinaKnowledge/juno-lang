var { get_next_environment_id, check_true, get_outside_global, subtype, lisp_writer, clone } = await import("./lisp_writer.js");

export async function init_compiler(Environment) {
await Environment.set_global("compiler",async function(quoted_lisp,opts) {
    let __get_global__1= async function(){
        return (opts && opts["env"] && opts["env"]["get_global"])
    };
    {
        let get_global=await __get_global__1();
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
                     let __test_condition__22=async function() {
                         return  (idx<(tree && tree.length))
                    };
                    let __body_ref__23=async function() {
                        tval=await (async function(){
                            let __targ__24=tree;
                            if (__targ__24){
                                 return(__targ__24)[idx]
                            } 
                        })();
                        if (check_true ((tval===deferred_operator))){
                            idx+=1;
                            tval=await (async function(){
                                let __targ__25=tree;
                                if (__targ__25){
                                     return(__targ__25)[idx]
                                } 
                            })();
                             rval=await rval["concat"].call(rval,await do_deferred_splice(tval))
                        } else {
                             (rval).push(await do_deferred_splice(tval))
                        };
                         return  idx+=1
                    };
                    let __BREAK__FLAG__=false;
                    while(await __test_condition__22()) {
                        await __body_ref__23();
                         if(__BREAK__FLAG__) {
                             break;
                            
                        }
                    } ;
                    
                })();
                 return  rval
            } else if (check_true( (tree instanceof Object))) {
                rval=new Object();
                await (async function() {
                    let __for_body__28=async function(pset) {
                         return  await async function(){
                            let __target_obj__30=rval;
                            __target_obj__30[(pset && pset["0"])]=await do_deferred_splice((pset && pset["1"]));
                            return __target_obj__30;
                            
                        }()
                    };
                    let __array__29=[],__elements__27=await (await Environment.get_global("pairs"))(tree);
                    let __BREAK__FLAG__=false;
                    for(let __iter__26 in __elements__27) {
                        __array__29.push(await __for_body__28(__elements__27[__iter__26]));
                        if(__BREAK__FLAG__) {
                             __array__29.pop();
                            break;
                            
                        }
                    }return __array__29;
                     
                })();
                 return  rval
            } else  {
                 return tree
            }
        }()
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
            let is_nil_ques_=async function(value) {         return  (null===value)
    };
            let is_number_ques_=async function(x) {                         return  (await subtype(x)==="Number")
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
            let contains_ques_=async function(value,container) {                         return  await async function(){
                            if (check_true( (await not(value)&&await not(container)))) {
                                 return false
                            } else if (check_true( (container==null))) {
                                 throw new TypeError("contains?: passed nil/undefined container value");
                                
                            } else if (check_true( (container instanceof String || typeof container==='string'))) {
                                 if (check_true (await (await get_global("is_number?"))(value))){
                                      return (await container["indexOf"].call(container,(""+value))>-1)
                                } else {
                                      return (await container["indexOf"].call(container,value)>-1)
                                }
                            } else if (check_true( container instanceof Array)) {
                                 return await container["includes"].call(container,value)
                            } else if (check_true( await (await get_global("is_set?"))(container))) {
                                 return await container["has"].call(container,value)
                            } else  {
                                 throw new TypeError(("contains?: passed invalid container type: "+await sub_type(container)));
                                
                            }
                        }()
                    };
            let tree;
            let op;
            let __Environment__2= async function(){
                return (opts && opts["env"])
            };
            let default_safety_level;
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
            let get_source_chain;
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
            let fn_log;
            let compile_fn;
            let compile_jslambda;
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
                                let __targ__651=(rval && rval["0"]);
                                if (__targ__651){
                                     return(__targ__651)["ctype"]
                                } 
                            })()))){
                                 await (async function(){
                                    let __array_op_rval__652=comp_log;
                                     if (__array_op_rval__652 instanceof Function){
                                        return await __array_op_rval__652(("compile:"+_cdepth+" <- "),"return type: ",await (await Environment.get_global("as_lisp"))((rval && rval["0"]))) 
                                    } else {
                                        return[__array_op_rval__652,("compile:"+_cdepth+" <- "),"return type: ",await (await Environment.get_global("as_lisp"))((rval && rval["0"]))]
                                    }
                                })()
                            } else {
                                 await (async function(){
                                    let __array_op_rval__653=comp_warn;
                                     if (__array_op_rval__653 instanceof Function){
                                        return await __array_op_rval__653("<-",_cdepth,"unknown/undeclared type returned: ",await clone(rval)) 
                                    } else {
                                        return[__array_op_rval__653,"<-",_cdepth,"unknown/undeclared type returned: ",await clone(rval)]
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
                op=null;
                let Environment=await __Environment__2();
                ;
                default_safety_level=((Environment && Environment["declarations"] && Environment["declarations"]["safety"] && Environment["declarations"]["safety"]["level"])||1);
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
                build_fn_with_assignment=async function(tmp_var_name,body,args) {
                    let tmp_template;
                    tmp_template=await clone(temp_fn_asn_template);
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
                        let __target_obj__17=ctx_obj;
                        __target_obj__17["scope"]=new Object();
                        __target_obj__17["source"]="";
                        __target_obj__17["parent"]=parent;
                        __target_obj__17["ambiguous"]=new Object();
                        __target_obj__17["declared_types"]=new Object();
                        __target_obj__17["defs"]=[];
                        return __target_obj__17;
                        
                    }();
                    if (check_true (parent)){
                        if (check_true ((parent && parent["source"]))){
                             await async function(){
                                let __target_obj__18=ctx_obj;
                                __target_obj__18["source"]=(parent && parent["source"]);
                                return __target_obj__18;
                                
                            }()
                        };
                        if (check_true ((parent && parent["defvar_eval"]))){
                             await async function(){
                                let __target_obj__19=ctx_obj;
                                __target_obj__19["defvar_eval"]=true;
                                return __target_obj__19;
                                
                            }()
                        };
                        if (check_true ((parent && parent["hard_quote_mode"]))){
                             await async function(){
                                let __target_obj__20=ctx_obj;
                                __target_obj__20["hard_quote_mode"]=true;
                                return __target_obj__20;
                                
                            }()
                        };
                        if (check_true ((parent && parent["block_step"]))){
                             await async function(){
                                let __target_obj__21=ctx_obj;
                                __target_obj__21["block_step"]=(parent && parent["block_step"]);
                                return __target_obj__21;
                                
                            }()
                        };
                        if (check_true ((parent && parent["block_id"]))){
                             await async function(){
                                let __target_obj__22=ctx_obj;
                                __target_obj__22["block_id"]=(parent && parent["block_id"]);
                                return __target_obj__22;
                                
                            }()
                        };
                        if (check_true ((parent && parent["suppress_return"]))){
                             await async function(){
                                let __target_obj__23=ctx_obj;
                                __target_obj__23["suppress_return"]=(parent && parent["suppress_return"]);
                                return __target_obj__23;
                                
                            }()
                        };
                        if (check_true ((parent && parent["in_try"]))){
                             await async function(){
                                let __target_obj__24=ctx_obj;
                                __target_obj__24["in_try"]=await (async function(){
                                    let __targ__25=parent;
                                    if (__targ__25){
                                         return(__targ__25)["in_try"]
                                    } 
                                })();
                                return __target_obj__24;
                                
                            }()
                        };
                        if (check_true ((parent && parent["return_point"]))){
                             await async function(){
                                let __target_obj__26=ctx_obj;
                                __target_obj__26["return_point"]=await add((parent && parent["return_point"]),1);
                                return __target_obj__26;
                                
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
                    }()
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
                        } else  {
                             return value
                        }
                    }()
                };
                set_ctx=async function(ctx,name,value) {
                    let sanitized_name=await sanitize_js_ref_name(name);
                    ;
                    if (check_true (((value instanceof Array)&&(value && value["0"] && value["0"]["ctype"])))){
                          return await async function(){
                            let __target_obj__27=(ctx && ctx["scope"]);
                            __target_obj__27[sanitized_name]=await async function(){
                                if (check_true( ((value && value["0"] && value["0"]["ctype"])==="Function"))) {
                                     return Function
                                } else if (check_true( ((value && value["0"] && value["0"]["ctype"])==="AsyncFunction"))) {
                                     return AsyncFunction
                                } else if (check_true( ((value && value["0"] && value["0"]["ctype"])==="expression"))) {
                                     return Expression
                                } else  {
                                     return (value && value["0"] && value["0"]["ctype"])
                                }
                            }();
                            return __target_obj__27;
                            
                        }()
                    } else {
                          return await async function(){
                            let __target_obj__28=(ctx && ctx["scope"]);
                            __target_obj__28[sanitized_name]=value;
                            return __target_obj__28;
                            
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
                                    let __targ__29=(ctx && ctx["scope"]);
                                    if (__targ__29){
                                         return(__targ__29)[ref_name]
                                    } 
                                })())))) {
                                     return await (async function(){
                                        let __targ__30=(ctx && ctx["scope"]);
                                        if (__targ__30){
                                             return(__targ__30)[ref_name]
                                        } 
                                    })()
                                } else if (check_true((ctx && ctx["parent"]))) {
                                     return await get_ctx((ctx && ctx["parent"]),ref_name)
                                }
                            }()
                        }
                    }()
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
                                        let __targ__31=op_lookup;
                                        if (__targ__31){
                                             return(__targ__31)[ref_name]
                                        } 
                                    })())) {
                                         return AsyncFunction
                                    } else if (check_true( await not((undefined===await (async function(){
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
                                }()
                            }
                        }
                    }()
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
                                        let __targ__34=op_lookup;
                                        if (__targ__34){
                                             return(__targ__34)[ref_name]
                                        } 
                                    })())) {
                                         return null
                                    } else if (check_true( await not((undefined===await (async function(){
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
                                    } else if (check_true((ctx && ctx["parent"]))) {
                                         return await get_declarations((ctx && ctx["parent"]),ref_name,true)
                                    }
                                }()
                            }
                        }
                    }()
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
                        let __target_obj__37=dec_struct;
                        __target_obj__37[declaration_type]=value;
                        return __target_obj__37;
                        
                    }();
                    await async function(){
                        let __target_obj__38=(ctx && ctx["declared_types"]);
                        __target_obj__38[sname]=dec_struct;
                        return __target_obj__38;
                        
                    }();
                     return  await (async function(){
                        let __targ__39=(ctx && ctx["declared_types"]);
                        if (__targ__39){
                             return(__targ__39)[sname]
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
                                    let __targ__40=(ctx && ctx["ambiguous"]);
                                    if (__targ__40){
                                         return(__targ__40)[ref_name]
                                    } 
                                })())) {
                                     return true
                                } else if (check_true((ctx && ctx["parent"]))) {
                                     return await (async function(){
                                        let __array_op_rval__41=is_ambiguous_ques_;
                                         if (__array_op_rval__41 instanceof Function){
                                            return await __array_op_rval__41((ctx && ctx["parent"]),ref_name) 
                                        } else {
                                            return[__array_op_rval__41,(ctx && ctx["parent"]),ref_name]
                                        }
                                    })()
                                }
                            }()
                        }
                    }()
                };
                set_ambiguous=async function(ctx,name) {
                     return  await async function(){
                        let __target_obj__42=(ctx && ctx["ambiguous"]);
                        __target_obj__42[name]=true;
                        return __target_obj__42;
                        
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
                    }()
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
                                let __for_body__45=async function(t) {
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
                                    }()
                                };
                                let __array__46=[],__elements__44=text_chars;
                                let __BREAK__FLAG__=false;
                                for(let __iter__43 in __elements__44) {
                                    __array__46.push(await __for_body__45(__elements__44[__iter__43]));
                                    if(__BREAK__FLAG__) {
                                         __array__46.pop();
                                        break;
                                        
                                    }
                                }return __array__46;
                                 
                            })();
                             return  (acc).join("")
                        }
                    }()
                };
                find_in_context=async function(ctx,name) {
                    let symname;
                    let ref;
                    let __is_literal_ques___47= async function(){
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
                        }();
                        ref=(symname&&((name instanceof String || typeof name==='string')&&(await length(name)>2)&&await starts_with_ques_("=:",name)));
                        let is_literal_ques_=await __is_literal_ques___47();
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
                        }();
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
                                        let __array_op_rval__48=error_log;
                                         if (__array_op_rval__48 instanceof Function){
                                            return await __array_op_rval__48("find_in_context: unknown type: ",name) 
                                        } else {
                                            return[__array_op_rval__48,"find_in_context: unknown type: ",name]
                                        }
                                    })();
                                     return  "??"
                                }
                            }(),name:await async function(){
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
                            }(),val:val,ref:await (async function() {
                                if (check_true (ref)){
                                      return true
                                } else {
                                      return false
                                }
                            } )(),local:(local||null),global:((global&&await not((NOT_FOUND===global)))||null)
                        }
                    }
                };
                get_source_chain=async function(ctx,sources) {
                    if (check_true (ctx)){
                        sources=(sources||[]);
                        if (check_true ((ctx && ctx["source"]))){
                             (sources).push((ctx && ctx["source"]))
                        };
                        if (check_true ((ctx && ctx["parent"]))){
                              return await get_source_chain((ctx && ctx["parent"]),sources)
                        } else {
                              return sources
                        }
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
                                  return (await (async function(){
                                    let __targ__49=(root_ctx && root_ctx["defined_lisp_globals"]);
                                    if (__targ__49){
                                         return(__targ__49)[ref_name]
                                    } 
                                })()||await Environment["get_global"].call(Environment,ref_name,NOT_FOUND_THING,cannot_be_js_global))
                            } 
                        })();
                        if (check_true ((await not((NOT_FOUND_THING===ref_type))&&await not(await contains_ques_(ref_name,standard_types))&&await async function(){
                            let __target_obj__50=referenced_global_symbols;
                            __target_obj__50[ref_name]=ref_type;
                            return __target_obj__50;
                            
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
                                    let __targ__51=ref_type;
                                    if (__targ__51){
                                         return(__targ__51)[(comps && comps["0"])]
                                    } 
                                })()
                            } else if (check_true( (ref_type instanceof Object))) {
                                 return await (await Environment.get_global("resolve_path"))(comps,ref_type)
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
                        }()
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
                    }()
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
                            let __for_body__55=async function(pset) {
                                 return  {
                                    type:"keyval",val:await tokenize(pset,ctx,"path:",await add(_path,(pset && pset["0"]))),ref:false,name:(""+await (await Environment.get_global("as_lisp"))((pset && pset["0"]))),__token__:"true"
                                }
                            };
                            let __array__56=[],__elements__54=await (await Environment.get_global("pairs"))(obj);
                            let __BREAK__FLAG__=false;
                            for(let __iter__53 in __elements__54) {
                                __array__56.push(await __for_body__55(__elements__54[__iter__53]));
                                if(__BREAK__FLAG__) {
                                     __array__56.pop();
                                    break;
                                    
                                }
                            }return __array__56;
                             
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
                    }()
                };
                tokenize=async function(args,ctx,_path) {
                    let argtype;
                    let rval;
                    let qval;
                    let idx;
                    let argdetails;
                    let argvalue;
                    let is_ref;
                    argtype=null;
                    rval=null;
                    ctx=ctx;
                    _path=(_path||[]);
                    qval=null;
                    idx=-1;
                    argdetails=null;
                    argvalue=null;
                    is_ref=null;
                    if (check_true ((null==ctx))){
                        await console.error("tokenize: nil ctx passed: ",await clone(args));
                        throw new ReferenceError("nil/undefined ctx passed to tokenize");
                        
                    };
                    if (check_true ((args instanceof Array))){
                         args=await compile_time_eval(ctx,args)
                    };
                     return  await async function(){
                        if (check_true( ((args instanceof String || typeof args==='string')||await is_number_ques_(args)||((args===true)||(args===false))))) {
                             return await first(await tokenize(await (async function(){
                                let __array_op_rval__57=args;
                                 if (__array_op_rval__57 instanceof Function){
                                    return await __array_op_rval__57() 
                                } else {
                                    return[__array_op_rval__57]
                                }
                            })(),ctx,_path))
                        } else if (check_true( ((args instanceof Array)&&(((args && args["0"])===`=:quotem`)||((args && args["0"])===`=:quote`)||((args && args["0"])===`=:quotel`))))) {
                            rval=await tokenize_quote(args,_path);
                             return  rval
                        } else if (check_true( ((args instanceof Array)&&await not(await get_ctx_val(ctx,"__IN_LAMBDA__"))&&((args && args["0"])===`=:progn`)))) {
                            rval=await compile_toplevel(args,ctx);
                             return  await tokenize(rval,ctx,_path)
                        } else if (check_true( (await not((args instanceof Array))&&(args instanceof Object)))) {
                             return await first(await tokenize(await (async function(){
                                let __array_op_rval__58=args;
                                 if (__array_op_rval__58 instanceof Function){
                                    return await __array_op_rval__58() 
                                } else {
                                    return[__array_op_rval__58]
                                }
                            })(),ctx,await add(_path,0)))
                        } else  {
                            if (check_true ((((args && args["0"])===`=:fn`)||((args && args["0"])===`=:function`)||((args && args["0"])===`=:=>`)))){
                                ctx=await new_ctx(ctx);
                                 await set_ctx(ctx,"__IN_LAMBDA__",true)
                            };
                             return  await (async function() {
                                let __for_body__61=async function(arg) {
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
                                    }()
                                };
                                let __array__62=[],__elements__60=args;
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
                    }()
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
                                    let __apply_args__64=await lisp_tree["slice"].call(lisp_tree,1);
                                    return ( precompile_function).apply(this,__apply_args__64)
                                })() 
                            } catch(__exception__63) {
                                  if (__exception__63 instanceof Error) {
                                     let e=__exception__63;
                                     {
                                        await async function(){
                                            let __target_obj__66=e;
                                            __target_obj__66["handled"]=true;
                                            return __target_obj__66;
                                            
                                        }();
                                        (errors).push({
                                            error:(e && e.name),message:(e && e.message),form:(ctx && ctx["source"]),parent_forms:await get_source_chain(ctx),invalid:true,text:await (await Environment.get_global("as_lisp"))(lisp_tree)
                                        });
                                        throw e;
                                        
                                    }
                                } 
                            }
                        })();
                        if (check_true ((null==ntree))){
                             await (async function(){
                                let __array_op_rval__67=comp_time_log;
                                 if (__array_op_rval__67 instanceof Function){
                                    return await __array_op_rval__67("unable to perform compilation time operation") 
                                } else {
                                    return[__array_op_rval__67,"unable to perform compilation time operation"]
                                }
                            })()
                        } else {
                             ntree=await do_deferred_splice(ntree)
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
                    math_op=(await (async function(){
                        let __targ__69=op_translation;
                        if (__targ__69){
                             return(__targ__69)[math_op_a]
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
                    if (check_true ((((declaration&&((declaration && declaration["type"])===Array))||(declaration&&((declaration && declaration["type"])===Object))||(symbol_ctx_val===Expression)||(symbol_ctx_val===ArgumentType)||((tokens && tokens["1"] && tokens["1"]["type"])==="objlit")||((tokens && tokens["1"] && tokens["1"]["type"])==="arr"))&&(math_op==="+")))){
                         is_overloaded=true
                    };
                    if (check_true (is_overloaded)){
                        await async function(){
                            let __target_obj__70=tokens;
                            __target_obj__70[0]={
                                type:"function",val:await add("=:","add"),name:"add",ref:true
                            };
                            return __target_obj__70;
                            
                        }();
                        stmts=await compile(tokens,ctx);
                        stmts=await wrap_assignment_value(stmts);
                         return  stmts
                    } else {
                        (acc).push("(");
                        await (async function(){
                             let __test_condition__71=async function() {
                                 return  (idx<((tokens && tokens.length)-1))
                            };
                            let __body_ref__72=async function() {
                                idx+=1;
                                token=await (async function(){
                                    let __targ__73=tokens;
                                    if (__targ__73){
                                         return(__targ__73)[idx]
                                    } 
                                })();
                                await add_operand();
                                 return  (acc).push(await wrap_assignment_value(await compile(token,ctx)))
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
                         return  acc
                    }
                };
                compile_set_prop=async function(tokens,ctx) {
                    let acc;
                    let wrapper;
                    let stmt;
                    let token;
                    let target_reference;
                    let complicated;
                    let target;
                    let idx;
                    acc=[];
                    wrapper=[];
                    stmt=null;
                    token=await second(tokens);
                    target_reference=await gen_temp_name("target_obj");
                    complicated=await (async function(){
                        let __array_op_rval__74=is_complex_ques_;
                         if (__array_op_rval__74 instanceof Function){
                            return await __array_op_rval__74((token && token["val"])) 
                        } else {
                            return[__array_op_rval__74,(token && token["val"])]
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
                        let __for_body__77=async function(t) {
                             return  (wrapper).push(t)
                        };
                        let __array__78=[],__elements__76=["await"," ","async"," ","function","()","{","let"," ",target_reference,"=",target,";"];
                        let __BREAK__FLAG__=false;
                        for(let __iter__75 in __elements__76) {
                            __array__78.push(await __for_body__77(__elements__76[__iter__75]));
                            if(__BREAK__FLAG__) {
                                 __array__78.pop();
                                break;
                                
                            }
                        }return __array__78;
                         
                    })();
                    await (async function(){
                         let __test_condition__79=async function() {
                             return  (idx<((tokens && tokens.length)-1))
                        };
                        let __body_ref__80=async function() {
                            idx+=1;
                            (acc).push(target_reference);
                            token=await (async function(){
                                let __targ__81=tokens;
                                if (__targ__81){
                                     return(__targ__81)[idx]
                                } 
                            })();
                            (acc).push("[");
                            stmt=await wrap_assignment_value(await compile(token,ctx));
                            (acc).push(stmt);
                            (acc).push("]");
                            idx+=1;
                            (acc).push("=");
                            token=await (async function(){
                                let __targ__82=tokens;
                                if (__targ__82){
                                     return(__targ__82)[idx]
                                } 
                            })();
                            if (check_true ((null==token)))throw new Error("set_prop: odd number of arguments");
                            ;
                            stmt=await wrap_assignment_value(await compile(token,ctx));
                            (acc).push(stmt);
                             return  (acc).push(";")
                        };
                        let __BREAK__FLAG__=false;
                        while(await __test_condition__79()) {
                            await __body_ref__80();
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
                    (wrapper).push("()");
                     return  wrapper
                };
                compile_prop=async function(tokens,ctx) {
                    let acc;
                    let target;
                    let target_val;
                    let idx_key;
                    acc=[];
                    target=await wrap_assignment_value(await compile(await second(tokens),ctx));
                    target_val=null;
                    idx_key=await wrap_assignment_value(await compile(await (async function(){
                        let __targ__83=tokens;
                        if (__targ__83){
                             return(__targ__83)[2]
                        } 
                    })(),ctx));
                    if (check_true ((await safety_level(ctx)>1))){
                        target_val=await gen_temp_name("targ");
                         return  ["await"," ","(","async"," ","function","()","{","let"," ",target_val,"=",target,";","if"," ","(",target_val,")","{"," ","return","(",target_val,")","[",idx_key,"]","}"," ","}",")","()"]
                    } else {
                          return ["(",target,")","[",idx_key,"]"]
                    }
                };
                compile_elem=async function(token,ctx) {
                    let rval;
                    let __check_needs_wrap__84= async function(){
                        return async function(stmts) {
                            let fst;
                            fst=(""+(((stmts instanceof Array)&&await first(stmts)&&(await first(stmts) instanceof Object)&&await (async function(){
                                let __targ__85=await first(stmts);
                                if (__targ__85){
                                     return(__targ__85)["ctype"]
                                } 
                            })()&&await async function(){
                                if (check_true( (await (async function(){
                                    let __targ__86=await first(stmts);
                                    if (__targ__86){
                                         return(__targ__86)["ctype"]
                                    } 
                                })() instanceof String || typeof await (async function(){
                                    let __targ__86=await first(stmts);
                                    if (__targ__86){
                                         return(__targ__86)["ctype"]
                                    } 
                                })()==='string'))) {
                                     return await (async function(){
                                        let __targ__87=await first(stmts);
                                        if (__targ__87){
                                             return(__targ__87)["ctype"]
                                        } 
                                    })()
                                } else  {
                                     return await sub_type(await (async function(){
                                        let __targ__88=await first(stmts);
                                        if (__targ__88){
                                             return(__targ__88)["ctype"]
                                        } 
                                    })())
                                }
                            }())||""));
                             return  await async function(){
                                if (check_true( await contains_ques_("block",fst))) {
                                     return true
                                } else  {
                                     return false
                                }
                            }()
                        }
                    };
                    {
                        rval=null;
                        let check_needs_wrap=await __check_needs_wrap__84();
                        ;
                        if (check_true (await (async function(){
                            let __array_op_rval__89=is_complex_ques_;
                             if (__array_op_rval__89 instanceof Function){
                                return await __array_op_rval__89((token && token["val"])) 
                            } else {
                                return[__array_op_rval__89,(token && token["val"])]
                            }
                        })())){
                             rval=await compile_wrapper_fn(token,ctx)
                        } else {
                             rval=await compile(token,ctx)
                        };
                        if (check_true (await not((rval instanceof Array)))){
                             rval=await (async function(){
                                let __array_op_rval__90=rval;
                                 if (__array_op_rval__90 instanceof Function){
                                    return await __array_op_rval__90() 
                                } else {
                                    return[__array_op_rval__90]
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
                        let __for_body__93=async function(token) {
                            stmt=await wrap_assignment_value(await compile(token,ctx));
                             return  (args).push(stmt)
                        };
                        let __array__94=[],__elements__92=await tokens["slice"].call(tokens,1);
                        let __BREAK__FLAG__=false;
                        for(let __iter__91 in __elements__92) {
                            __array__94.push(await __for_body__93(__elements__92[__iter__91]));
                            if(__BREAK__FLAG__) {
                                 __array__94.pop();
                                break;
                                
                            }
                        }return __array__94;
                         
                    })();
                    if (check_true (await (async function(){
                        let __targ__95=(Environment && Environment["inlines"]);
                        if (__targ__95){
                             return(__targ__95)[(tokens && tokens["0"] && tokens["0"]["name"])]
                        } 
                    })())){
                        inline_fn=await (async function(){
                            let __targ__96=(Environment && Environment["inlines"]);
                            if (__targ__96){
                                 return(__targ__96)[(tokens && tokens["0"] && tokens["0"]["name"])]
                            } 
                        })();
                         rval=await (async function(){
                            let __array_op_rval__97=inline_fn;
                             if (__array_op_rval__97 instanceof Function){
                                return await __array_op_rval__97(args) 
                            } else {
                                return[__array_op_rval__97,args]
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
                        let __array_op_rval__98=place;
                         if (__array_op_rval__98 instanceof Function){
                            return await __array_op_rval__98(".push","(",thing,")") 
                        } else {
                            return[__array_op_rval__98,".push","(",thing,")"]
                        }
                    })()
                };
                compile_list=async function(tokens,ctx) {
                    let acc;
                    let compiled_values;
                    acc=["["];
                    compiled_values=[];
                    await (async function() {
                        let __for_body__101=async function(t) {
                             return  (compiled_values).push(await wrap_assignment_value(await compile(t,ctx)))
                        };
                        let __array__102=[],__elements__100=await tokens["slice"].call(tokens,1);
                        let __BREAK__FLAG__=false;
                        for(let __iter__99 in __elements__100) {
                            __array__102.push(await __for_body__101(__elements__100[__iter__99]));
                            if(__BREAK__FLAG__) {
                                 __array__102.pop();
                                break;
                                
                            }
                        }return __array__102;
                         
                    })();
                    await push_as_arg_list(acc,compiled_values);
                    (acc).push("]");
                     return  acc
                };
                compile_typeof=async function(tokens,ctx) {
                    console.log("compile_typeof: ",await clone(tokens));
                    if (check_true (((tokens && tokens["1"] && tokens["1"]["type"])==="arg"))){
                          return ["typeof"," ",(tokens && tokens["1"] && tokens["1"]["name"])]
                    } else {
                          return ["typeof"," ",await compile_elem((tokens && tokens["1"]),ctx)]
                    }
                };
                compile_instanceof=async function(tokens,ctx) {
                    let acc;
                    acc=[];
                    if (check_true (((tokens instanceof Array)&&((tokens && tokens.length)===3)))){
                        let __array_arg__105=(async function() {
                            if (check_true (await (async function(){
                                let __array_op_rval__103=is_complex_ques_;
                                 if (__array_op_rval__103 instanceof Function){
                                    return await __array_op_rval__103((tokens && tokens["1"])) 
                                } else {
                                    return[__array_op_rval__103,(tokens && tokens["1"])]
                                }
                            })())){
                                  return await compile_wrapper_fn((tokens && tokens["1"]),ctx)
                            } else {
                                  return await compile((tokens && tokens["1"]),ctx)
                            }
                        } );
                        let __array_arg__106=(async function() {
                            if (check_true (await (async function(){
                                let __array_op_rval__104=is_complex_ques_;
                                 if (__array_op_rval__104 instanceof Function){
                                    return await __array_op_rval__104((tokens && tokens["1"])) 
                                } else {
                                    return[__array_op_rval__104,(tokens && tokens["1"])]
                                }
                            })())){
                                  return await compile_wrapper_fn((tokens && tokens["2"]),ctx)
                            } else {
                                  return await compile((tokens && tokens["2"]),ctx)
                            }
                        } );
                        return ["(",await __array_arg__105()," ","instanceof"," ",await __array_arg__106(),")"]
                    } else throw new SyntaxError("instanceof requires 2 arguments");
                    
                };
                compile_compare=async function(tokens,ctx) {
                    let acc;
                    let ops;
                    let __operator__107= async function(){
                        return await (async function(){
                            let __targ__110=ops;
                            if (__targ__110){
                                 return(__targ__110)[await (async function(){
                                    let __targ__109=await first(tokens);
                                    if (__targ__109){
                                         return(__targ__109)["name"]
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
                            let __obj__108=new Object();
                            __obj__108["eq"]="==";
                            __obj__108["=="]="===";
                            __obj__108["<"]="<";
                            __obj__108[">"]=">";
                            __obj__108["gt"]=">";
                            __obj__108["lt"]="<";
                            __obj__108["<="]="<=";
                            __obj__108[">="]=">=";
                            return __obj__108;
                            
                        })();
                        let operator=await __operator__107();
                        ;
                        left=await (async function(){
                            let __targ__111=tokens;
                            if (__targ__111){
                                 return(__targ__111)[1]
                            } 
                        })();
                        right=await (async function(){
                            let __targ__112=tokens;
                            if (__targ__112){
                                 return(__targ__112)[2]
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
                    let target;
                    let target_details;
                    let target_location_compile_time;
                    acc=[];
                    assignment_operator=await (async function(){
                        let __targ__113=await first(tokens);
                        if (__targ__113){
                             return(__targ__113)["name"]
                        } 
                    })();
                    token=await second(tokens);
                    assignment_value=null;
                    assignment_type=null;
                    wrap_as_function_ques_=null;
                    target=await sanitize_js_ref_name(await async function(){
                        if (check_true((token && token["ref"]))) {
                             return (token && token["name"])
                        } else  {
                             throw new Error(("assignment: invalid target: "+(token && token["name"])));
                            
                        }
                    }());
                    target_details=await get_declaration_details(ctx,target);
                    target_location_compile_time=await async function(){
                        if (check_true((target_details && target_details["is_argument"]))) {
                             return "local"
                        } else if (check_true((target_details && target_details["declared_global"]))) {
                             return "global"
                        } else  {
                             return "local"
                        }
                    }();
                    await unset_ambiguous(ctx,target);
                    await async function(){
                        let __target_obj__114=ctx;
                        __target_obj__114["in_assignment"]=true;
                        return __target_obj__114;
                        
                    }();
                    assignment_value=await compile((tokens && tokens["2"]),ctx);
                    if (check_true (((assignment_value instanceof Array)&&((assignment_value && assignment_value["0"]) instanceof Object)&&(assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])))){
                         assignment_type=await map_ctype_to_value((assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"]),assignment_value)
                    } else {
                        await set_ambiguous(ctx,target);
                         assignment_type=UnknownType
                    };
                    assignment_value=await wrap_assignment_value(assignment_value);
                    if (check_true ((target_location_compile_time==="local"))){
                        await set_ctx(ctx,target,assignment_type);
                        (acc).push(target);
                        (acc).push("=");
                         (acc).push(assignment_value)
                    } else {
                         await (async function() {
                            let __for_body__117=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__118=[],__elements__116=[{
                                ctype:"statement"
                            },"await"," ","Environment",".","set_global","(","\"",target,"\"",",",assignment_value,")"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__115 in __elements__116) {
                                __array__118.push(await __for_body__117(__elements__116[__iter__115]));
                                if(__BREAK__FLAG__) {
                                     __array__118.pop();
                                    break;
                                    
                                }
                            }return __array__118;
                             
                        })()
                    };
                    await async function(){
                        let __target_obj__119=ctx;
                        __target_obj__119["in_assignment"]=false;
                        return __target_obj__119;
                        
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
                                        let __targ__120=await first(flattened);
                                        if (__targ__120){
                                             return(__targ__120)["ctype"]
                                        } 
                                    })()))) {
                                         return inst=await first(flattened)
                                    } else if (check_true( ((await first(flattened) instanceof String || typeof await first(flattened)==='string')&&await starts_with_ques_("/*",await first(flattened))&&(await second(flattened) instanceof Object)&&await (async function(){
                                        let __targ__121=await second(flattened);
                                        if (__targ__121){
                                             return(__targ__121)["ctype"]
                                        } 
                                    })()))) {
                                         return inst=await second(flattened)
                                    }
                                }();
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
                                }()
                            }
                        }()
                    } else {
                          return false
                    }
                };
                top_level_log=await defclog({
                    prefix:"top-level",color:"white",background:"#300010"
                });
                compile_toplevel=async function(lisp_tree,ctx,block_options) {
                    if (check_true (await get_ctx_val(ctx,"__IN_LAMBDA__")))throw new EvalError("Compiler attempt to compile top-level in lambda (most likely a bug)");
                     else {
                        {
                            let idx;
                            let rval;
                            let __tokens__122= async function(){
                                return null
                            };
                            let stmt;
                            let num_non_return_statements;
                            {
                                idx=0;
                                rval=null;
                                let tokens=await __tokens__122();
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
                                     let __test_condition__123=async function() {
                                         return  (idx<num_non_return_statements)
                                    };
                                    let __body_ref__124=async function() {
                                        idx+=1;
                                        await (async function(){
                                            let __array_op_rval__126=top_level_log;
                                             if (__array_op_rval__126 instanceof Function){
                                                return await __array_op_rval__126((""+idx+"/"+num_non_return_statements),"->",await (await Environment.get_global("as_lisp"))(await (async function(){
                                                    let __targ__125=lisp_tree;
                                                    if (__targ__125){
                                                         return(__targ__125)[idx]
                                                    } 
                                                })())) 
                                            } else {
                                                return[__array_op_rval__126,(""+idx+"/"+num_non_return_statements),"->",await (await Environment.get_global("as_lisp"))(await (async function(){
                                                    let __targ__125=lisp_tree;
                                                    if (__targ__125){
                                                         return(__targ__125)[idx]
                                                    } 
                                                })())]
                                            }
                                        })();
                                        tokens=await tokenize(await (async function(){
                                            let __targ__127=lisp_tree;
                                            if (__targ__127){
                                                 return(__targ__127)[idx]
                                            } 
                                        })(),ctx);
                                        stmt=await compile(tokens,ctx);
                                        await (async function(){
                                            let __array_op_rval__128=top_level_log;
                                             if (__array_op_rval__128 instanceof Function){
                                                return await __array_op_rval__128((""+idx+"/"+num_non_return_statements),"compiled <- ",stmt) 
                                            } else {
                                                return[__array_op_rval__128,(""+idx+"/"+num_non_return_statements),"compiled <- ",stmt]
                                            }
                                        })();
                                        rval=await wrap_and_run(stmt,ctx,{
                                            bind_mode:true
                                        });
                                        await (async function(){
                                            let __array_op_rval__129=top_level_log;
                                             if (__array_op_rval__129 instanceof Function){
                                                return await __array_op_rval__129((""+idx+"/"+num_non_return_statements),"<-",rval) 
                                            } else {
                                                return[__array_op_rval__129,(""+idx+"/"+num_non_return_statements),"<-",rval]
                                            }
                                        })();
                                         return  await (async function(){
                                            let __array_op_rval__130=top_level_log;
                                             if (__array_op_rval__130 instanceof Function){
                                                return await __array_op_rval__130((""+idx+"/"+num_non_return_statements),"ctx",await clone((Environment && Environment["context"] && Environment["context"]["scope"]))) 
                                            } else {
                                                return[__array_op_rval__130,(""+idx+"/"+num_non_return_statements),"ctx",await clone((Environment && Environment["context"] && Environment["context"]["scope"]))]
                                            }
                                        })()
                                    };
                                    let __BREAK__FLAG__=false;
                                    while(await __test_condition__123()) {
                                        await __body_ref__124();
                                         if(__BREAK__FLAG__) {
                                             break;
                                            
                                        }
                                    } ;
                                    
                                })();
                                 return  await (async function(){
                                    let __targ__131=lisp_tree;
                                    if (__targ__131){
                                         return(__targ__131)[(idx+1)]
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
                    if (check_true ((tokens && tokens["1"] && tokens["1"]["source"]))){
                         await async function(){
                            let __target_obj__132=ctx;
                            __target_obj__132["source"]=(tokens && tokens["1"] && tokens["1"]["source"]);
                            return __target_obj__132;
                            
                        }()
                    };
                    await async function(){
                        let __target_obj__133=ctx;
                        __target_obj__133["block_id"]=block_id;
                        return __target_obj__133;
                        
                    }();
                    if (check_true ((await get_ctx_val(ctx,"__LAMBDA_STEP__")===-1))){
                        lambda_block=true;
                         await (await Environment.get_global("setf_ctx"))(ctx,"__LAMBDA_STEP__",((tokens && tokens.length)-1))
                    };
                    if (check_true (await not((block_options && block_options["no_scope_boundary"])))){
                         (acc).push("{")
                    };
                    await (async function(){
                         let __test_condition__134=async function() {
                             return  (idx<((tokens && tokens.length)-1))
                        };
                        let __body_ref__135=async function() {
                            idx+=1;
                            token=await (async function(){
                                let __targ__136=tokens;
                                if (__targ__136){
                                     return(__targ__136)[idx]
                                } 
                            })();
                            if (check_true ((idx===((tokens && tokens.length)-1)))){
                                 await async function(){
                                    let __target_obj__137=ctx;
                                    __target_obj__137["final_block_statement"]=true;
                                    return __target_obj__137;
                                    
                                }()
                            };
                            await async function(){
                                let __target_obj__138=ctx;
                                __target_obj__138["block_step"]=((tokens && tokens.length)-1-idx);
                                return __target_obj__138;
                                
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
                            }();
                            stmt_ctype=(((ctx && ctx["block_step"])>0)&&(await first(stmt) instanceof Object)&&await (async function(){
                                let __targ__139=await first(stmt);
                                if (__targ__139){
                                     return(__targ__139)["ctype"]
                                } 
                            })());
                            await async function(){
                                if (check_true( (stmt_ctype==="AsyncFunction"))) {
                                    (stmts).push({
                                        mark:"block<-async"
                                    });
                                     return  (stmts).push(stmt)
                                } else if (check_true( (stmt_ctype==="block"))) {
                                     return  (stmts).push(await wrap_assignment_value(stmt))
                                } else  {
                                    (stmts).push({
                                        mark:"standard"
                                    });
                                     return  (stmts).push(stmt)
                                }
                            }();
                            if (check_true ((idx<((tokens && tokens.length)-1)))){
                                 return  (stmts).push(";")
                            }
                        };
                        let __BREAK__FLAG__=false;
                        while(await __test_condition__134()) {
                            await __body_ref__135();
                             if(__BREAK__FLAG__) {
                                 break;
                                
                            }
                        } ;
                        
                    })();
                    await async function(){
                        if (check_true( (await not((block_options && block_options["suppress_return"]))&&await not((ctx && ctx["suppress_return"]))&&(await (async function(){
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
                        })()))))) {
                            last_stmt=(stmts).pop();
                            (stmts).push({
                                mark:"final-return",if_id:await get_ctx_val(ctx,"__IF_BLOCK__"),block_step:(ctx && ctx["block_step"]),lambda_step:await get_ctx_val(ctx,"__LAMBDA_STEP__")
                            });
                            (stmts).push(" ");
                             return  (stmts).push(last_stmt)
                        } else if (check_true( (await (async function(){
                            let __array_op_rval__142=needs_return_ques_;
                             if (__array_op_rval__142 instanceof Function){
                                return await __array_op_rval__142(stmts,ctx) 
                            } else {
                                return[__array_op_rval__142,stmts,ctx]
                            }
                        })()||((idx>1)&&await (async function(){
                            let __array_op_rval__143=needs_return_ques_;
                             if (__array_op_rval__143 instanceof Function){
                                return await __array_op_rval__143(stmts,ctx) 
                            } else {
                                return[__array_op_rval__143,stmts,ctx]
                            }
                        })())))) {
                            last_stmt=(stmts).pop();
                            (stmts).push({
                                mark:"block-end",if_id:await get_ctx_val(ctx,"__IF_BLOCK__"),block_step:(ctx && ctx["block_step"]),lambda_step:await get_ctx_val(ctx,"__LAMBDA_STEP__")
                            });
                            (stmts).push(" ");
                             return  (stmts).push(last_stmt)
                        }
                    }();
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
                    let __check_needs_wrap__144= async function(){
                        return async function(stmts) {
                            let fst;
                            fst=(""+(((stmts instanceof Array)&&await first(stmts)&&(await first(stmts) instanceof Object)&&await (async function(){
                                let __targ__145=await first(stmts);
                                if (__targ__145){
                                     return(__targ__145)["ctype"]
                                } 
                            })()&&await async function(){
                                if (check_true( (await (async function(){
                                    let __targ__146=await first(stmts);
                                    if (__targ__146){
                                         return(__targ__146)["ctype"]
                                    } 
                                })() instanceof String || typeof await (async function(){
                                    let __targ__146=await first(stmts);
                                    if (__targ__146){
                                         return(__targ__146)["ctype"]
                                    } 
                                })()==='string'))) {
                                     return await (async function(){
                                        let __targ__147=await first(stmts);
                                        if (__targ__147){
                                             return(__targ__147)["ctype"]
                                        } 
                                    })()
                                } else  {
                                     return await sub_type(await (async function(){
                                        let __targ__148=await first(stmts);
                                        if (__targ__148){
                                             return(__targ__148)["ctype"]
                                        } 
                                    })())
                                }
                            }())||""));
                             return  await async function(){
                                if (check_true( await contains_ques_("block",fst))) {
                                     return true
                                } else  {
                                     return false
                                }
                            }()
                        }
                    };
                    let assignment_value;
                    {
                        target=await clean_quoted_reference(await sanitize_js_ref_name((tokens && tokens["1"] && tokens["1"]["name"])));
                        wrap_as_function_ques_=null;
                        ctx_details=null;
                        assignment_type=null;
                        let check_needs_wrap=await __check_needs_wrap__144();
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
                                 return  assignment_value=await wrap_assignment_value(assignment_value)
                            } else if (check_true( (assignment_type && assignment_type["value"]) instanceof Function)) {
                                 return await set_ctx(ctx,target,(assignment_type && assignment_type["value"]))
                            } else  {
                                 return await set_ctx(ctx,target,assignment_value)
                            }
                        }();
                        if (check_true ((ctx && ctx["defvar_eval"]))){
                            await (await Environment.get_global("delete_prop"))(ctx,"defvar_eval");
                             return  [{
                                ctype:"assignment"
                            },"let"," ",target,"=",assignment_value,"()",";"]
                        } else {
                            let __array_arg__149=(async function() {
                                if (check_true (((ctx_details && ctx_details["is_argument"])&&((ctx_details && ctx_details["levels_up"])===1)))){
                                      return ""
                                } else {
                                      return "let "
                                }
                            } );
                            return [{
                                ctype:"assignment"
                            },await __array_arg__149(),"",target,"=",[assignment_value],";"]
                        }
                    }
                };
                get_declaration_details=async function(ctx,symname,_levels_up) {
                     return  await async function(){
                        if (check_true( (await (async function(){
                            let __targ__150=(ctx && ctx["scope"]);
                            if (__targ__150){
                                 return(__targ__150)[symname]
                            } 
                        })()&&await (async function(){
                            let __targ__151=ctx;
                            if (__targ__151){
                                 return(__targ__151)["lambda_scope"]
                            } 
                        })()))) {
                             return {
                                name:symname,is_argument:true,levels_up:(_levels_up||0),value:await (async function(){
                                    let __targ__152=(ctx && ctx["scope"]);
                                    if (__targ__152){
                                         return(__targ__152)[symname]
                                    } 
                                })(),declared_global:await (async function() {
                                    if (check_true (await (async function(){
                                        let __targ__153=(root_ctx && root_ctx["defined_lisp_globals"]);
                                        if (__targ__153){
                                             return(__targ__153)[symname]
                                        } 
                                    })())){
                                          return true
                                    } else {
                                          return false
                                    }
                                } )()
                            }
                        } else if (check_true( await (async function(){
                            let __targ__154=(ctx && ctx["scope"]);
                            if (__targ__154){
                                 return(__targ__154)[symname]
                            } 
                        })())) {
                             return {
                                name:symname,is_argument:false,levels_up:(_levels_up||0),value:await (async function(){
                                    let __targ__155=(ctx && ctx["scope"]);
                                    if (__targ__155){
                                         return(__targ__155)[symname]
                                    } 
                                })(),declarations:await get_declarations(ctx,symname),declared_global:await (async function() {
                                    if (check_true (await (async function(){
                                        let __targ__156=(root_ctx && root_ctx["defined_lisp_globals"]);
                                        if (__targ__156){
                                             return(__targ__156)[symname]
                                        } 
                                    })())){
                                          return true
                                    } else {
                                          return false
                                    }
                                } )()
                            }
                        } else if (check_true( ((await (async function(){
                            let __targ__157=ctx;
                            if (__targ__157){
                                 return(__targ__157)["parent"]
                            } 
                        })()==null)&&await (async function(){
                            let __targ__158=(root_ctx && root_ctx["defined_lisp_globals"]);
                            if (__targ__158){
                                 return(__targ__158)[symname]
                            } 
                        })()))) {
                             return {
                                name:symname,is_argument:false,levels_up:(_levels_up||0),value:await (async function(){
                                    let __targ__159=(ctx && ctx["scope"]);
                                    if (__targ__159){
                                         return(__targ__159)[symname]
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
                    }()
                };
                wrap_assignment_value=async function(stmts) {
                    let fst;
                    fst=(""+(((stmts instanceof Array)&&await first(stmts)&&(await first(stmts) instanceof Object)&&await (async function(){
                        let __targ__160=await first(stmts);
                        if (__targ__160){
                             return(__targ__160)["ctype"]
                        } 
                    })()&&await async function(){
                        if (check_true( (await (async function(){
                            let __targ__161=await first(stmts);
                            if (__targ__161){
                                 return(__targ__161)["ctype"]
                            } 
                        })() instanceof String || typeof await (async function(){
                            let __targ__161=await first(stmts);
                            if (__targ__161){
                                 return(__targ__161)["ctype"]
                            } 
                        })()==='string'))) {
                             return await (async function(){
                                let __targ__162=await first(stmts);
                                if (__targ__162){
                                     return(__targ__162)["ctype"]
                                } 
                            })()
                        } else  {
                             return await sub_type(await (async function(){
                                let __targ__163=await first(stmts);
                                if (__targ__163){
                                     return(__targ__163)["ctype"]
                                } 
                            })())
                        }
                    }())||""));
                     return  await async function(){
                        if (check_true( ("ifblock"===fst))) {
                             return [{
                                ctype:"AsyncFunction"
                            },{
                                mark:"wrap_assignment_value"
                            },"await"," ","(","async"," ","function"," ","()"," ","{"," ",stmts," ","}",")","()"]
                        } else if (check_true( await contains_ques_("block",fst))) {
                             return [{
                                ctype:"AsyncFunction"
                            },{
                                mark:"wrap_assignment_value"
                            },"await"," ","(","async"," ","function"," ","()"," "," ",stmts," ",")","()"]
                        } else  {
                             return stmts
                        }
                    }()
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
                    }()
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
                        let __target_obj__164=ctx;
                        __target_obj__164["return_last_value"]=true;
                        return __target_obj__164;
                        
                    }();
                    (acc).push("{");
                    sub_block_count+=1;
                    if (check_true ((ctx && ctx["source"]))){
                         (acc).push({
                            comment:("let start "+(ctx && ctx["source"])+" ")
                        })
                    };
                    if (check_true (((block && block["0"] && block["0"]["val"] && block["0"]["val"]["0"] && block["0"]["val"]["0"]["name"])==="declare"))){
                        declarations_handled=true;
                         (acc).push(await compile_declare((block && block["0"] && block["0"]["val"]),ctx))
                    };
                    await (async function(){
                         let __test_condition__165=async function() {
                             return  (idx<((allocations && allocations.length)-1))
                        };
                        let __body_ref__166=async function() {
                            idx+=1;
                            alloc_set=await (async function(){
                                let __targ__168=await (async function(){
                                    let __targ__167=allocations;
                                    if (__targ__167){
                                         return(__targ__167)[idx]
                                    } 
                                })();
                                if (__targ__168){
                                     return(__targ__168)["val"]
                                } 
                            })();
                            reference_name=await clean_quoted_reference(await sanitize_js_ref_name((alloc_set && alloc_set["0"] && alloc_set["0"]["name"])));
                            ctx_details=await get_declaration_details(ctx,reference_name);
                            if (check_true (ctx_details)){
                                if (check_true ((await not((ctx_details && ctx_details["is_argument"]))&&((ctx_details && ctx_details["levels_up"])>1)))){
                                    need_sub_block=true;
                                    if (check_true (await (async function(){
                                        let __targ__169=redefinitions;
                                        if (__targ__169){
                                             return(__targ__169)[reference_name]
                                        } 
                                    })())){
                                         (await (async function(){
                                            let __targ__170=redefinitions;
                                            if (__targ__170){
                                                 return(__targ__170)[reference_name]
                                            } 
                                        })()).push(await gen_temp_name(reference_name))
                                    } else {
                                         await async function(){
                                            let __target_obj__171=redefinitions;
                                            __target_obj__171[reference_name]=[0,await gen_temp_name(reference_name)];
                                            return __target_obj__171;
                                            
                                        }()
                                    };
                                    if (check_true (((ctx_details && ctx_details["declared_global"])&&await not((ctx_details && ctx_details["is_argument"]))))){
                                         await async function(){
                                            let __target_obj__172=shadowed_globals;
                                            __target_obj__172[(alloc_set && alloc_set["0"] && alloc_set["0"]["name"])]=true;
                                            return __target_obj__172;
                                            
                                        }()
                                    }
                                }
                            };
                            if (check_true (await not((ctx_details && ctx_details["is_argument"])))){
                                 return  await set_ctx(ctx,reference_name,AsyncFunction)
                            }
                        };
                        let __BREAK__FLAG__=false;
                        while(await __test_condition__165()) {
                            await __body_ref__166();
                             if(__BREAK__FLAG__) {
                                 break;
                                
                            }
                        } ;
                        
                    })();
                    idx=-1;
                    await (async function(){
                         let __test_condition__173=async function() {
                             return  (idx<((allocations && allocations.length)-1))
                        };
                        let __body_ref__174=async function() {
                            idx+=1;
                            stmt=[];
                            alloc_set=await (async function(){
                                let __targ__176=await (async function(){
                                    let __targ__175=allocations;
                                    if (__targ__175){
                                         return(__targ__175)[idx]
                                    } 
                                })();
                                if (__targ__176){
                                     return(__targ__176)["val"]
                                } 
                            })();
                            reference_name=await clean_quoted_reference(await sanitize_js_ref_name((alloc_set && alloc_set["0"] && alloc_set["0"]["name"])));
                            ctx_details=await get_declaration_details(ctx,reference_name);
                            await async function(){
                                if (check_true( ((alloc_set && alloc_set["1"] && alloc_set["1"]["val"]) instanceof Array))) {
                                    await async function(){
                                        let __target_obj__177=ctx;
                                        __target_obj__177["in_assignment"]=true;
                                        return __target_obj__177;
                                        
                                    }();
                                    assignment_value=await compile((alloc_set && alloc_set["1"]),ctx);
                                     return  await async function(){
                                        let __target_obj__178=ctx;
                                        __target_obj__178["in_assignment"]=false;
                                        return __target_obj__178;
                                        
                                    }()
                                } else if (check_true( (((alloc_set && alloc_set["1"] && alloc_set["1"]["name"]) instanceof String || typeof (alloc_set && alloc_set["1"] && alloc_set["1"]["name"])==='string')&&await (async function(){
                                    let __targ__179=(Environment && Environment["context"] && Environment["context"]["scope"]);
                                    if (__targ__179){
                                         return(__targ__179)[(alloc_set && alloc_set["1"] && alloc_set["1"]["name"])]
                                    } 
                                })()&&await not((ctx_details && ctx_details["is_argument"]))&&await (async function(){
                                    let __targ__180=shadowed_globals;
                                    if (__targ__180){
                                         return(__targ__180)[(alloc_set && alloc_set["0"] && alloc_set["0"]["name"])]
                                    } 
                                })()))) {
                                     return  assignment_value=[{
                                        ctype:(ctx_details && ctx_details["value"])
                                    },"await"," ","Environment.get_global","(","\"",(alloc_set && alloc_set["0"] && alloc_set["0"]["name"]),"\"",")"]
                                } else  {
                                     return  assignment_value=await compile((alloc_set && alloc_set["1"]),ctx)
                                }
                            }();
                            await async function(){
                                if (check_true( ((assignment_value instanceof Array)&&((assignment_value && assignment_value["0"]) instanceof Object)&&(assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])))) {
                                     return  await set_ctx(ctx,reference_name,await map_ctype_to_value((assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"]),assignment_value))
                                } else if (check_true( ((assignment_value instanceof Array)&&((assignment_value && assignment_value["0"]) instanceof Array)&&(assignment_value && assignment_value["0"] && assignment_value["0"]["0"] && assignment_value["0"]["0"]["ctype"])))) {
                                     return  await set_ctx(ctx,reference_name,await map_ctype_to_value((assignment_value && assignment_value["0"] && assignment_value["0"]["0"] && assignment_value["0"]["0"]["ctype"]),assignment_value))
                                } else  {
                                    await console.warn("compile_assignment: unknown assignment type: ",reference_name);
                                     return  await set_ctx(ctx,reference_name,assignment_value)
                                }
                            }();
                            assignment_value=await wrap_assignment_value(assignment_value);
                            if (check_true ((ctx_details && ctx_details["is_argument"]))){
                                 await async function(){
                                    let __target_obj__181=block_declarations;
                                    __target_obj__181[reference_name]=true;
                                    return __target_obj__181;
                                    
                                }()
                            };
                            def_idx=null;
                            await async function(){
                                if (check_true( (await (async function(){
                                    let __targ__182=redefinitions;
                                    if (__targ__182){
                                         return(__targ__182)[reference_name]
                                    } 
                                })()&&await first(await (async function(){
                                    let __targ__183=redefinitions;
                                    if (__targ__183){
                                         return(__targ__183)[reference_name]
                                    } 
                                })())))) {
                                    def_idx=await first(await (async function(){
                                        let __targ__184=redefinitions;
                                        if (__targ__184){
                                             return(__targ__184)[reference_name]
                                        } 
                                    })());
                                    def_idx+=1;
                                    await async function(){
                                        let __target_obj__185=await (async function(){
                                            let __targ__186=redefinitions;
                                            if (__targ__186){
                                                 return(__targ__186)[reference_name]
                                            } 
                                        })();
                                        __target_obj__185[0]=def_idx;
                                        return __target_obj__185;
                                        
                                    }();
                                     return  await (async function() {
                                        let __for_body__189=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__190=[],__elements__188=["let"," ",await (async function(){
                                            let __targ__192=await (async function(){
                                                let __targ__191=redefinitions;
                                                if (__targ__191){
                                                     return(__targ__191)[reference_name]
                                                } 
                                            })();
                                            if (__targ__192){
                                                 return(__targ__192)[def_idx]
                                            } 
                                        })(),"="," ","async"," ","function","()","{","return"," ",assignment_value,"}",";"];
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__187 in __elements__188) {
                                            __array__190.push(await __for_body__189(__elements__188[__iter__187]));
                                            if(__BREAK__FLAG__) {
                                                 __array__190.pop();
                                                break;
                                                
                                            }
                                        }return __array__190;
                                         
                                    })()
                                } else if (check_true( await not(await (async function(){
                                    let __targ__193=block_declarations;
                                    if (__targ__193){
                                         return(__targ__193)[reference_name]
                                    } 
                                })()))) {
                                    await (async function() {
                                        let __for_body__196=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__197=[],__elements__195=["let"," ",reference_name,";"];
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__194 in __elements__195) {
                                            __array__197.push(await __for_body__196(__elements__195[__iter__194]));
                                            if(__BREAK__FLAG__) {
                                                 __array__197.pop();
                                                break;
                                                
                                            }
                                        }return __array__197;
                                         
                                    })();
                                     return  await async function(){
                                        let __target_obj__198=block_declarations;
                                        __target_obj__198[reference_name]=true;
                                        return __target_obj__198;
                                        
                                    }()
                                }
                            }();
                            if (check_true (await not(await (async function(){
                                let __targ__199=assignments;
                                if (__targ__199){
                                     return(__targ__199)[reference_name]
                                } 
                            })()))){
                                 await async function(){
                                    let __target_obj__200=assignments;
                                    __target_obj__200[reference_name]=[];
                                    return __target_obj__200;
                                    
                                }()
                            };
                             return  (await (async function(){
                                let __targ__201=assignments;
                                if (__targ__201){
                                     return(__targ__201)[reference_name]
                                } 
                            })()).push(await (async function () {
                                 if (check_true (def_idx)){
                                      return ["await"," ",await (async function(){
                                        let __targ__203=await (async function(){
                                            let __targ__202=redefinitions;
                                            if (__targ__202){
                                                 return(__targ__202)[reference_name]
                                            } 
                                        })();
                                        if (__targ__203){
                                             return(__targ__203)[def_idx]
                                        } 
                                    })(),"()",";"]
                                } else {
                                      return assignment_value
                                } 
                            })())
                        };
                        let __BREAK__FLAG__=false;
                        while(await __test_condition__173()) {
                            await __body_ref__174();
                             if(__BREAK__FLAG__) {
                                 break;
                                
                            }
                        } ;
                        
                    })();
                    if (check_true (need_sub_block)){
                         await (async function() {
                            let __for_body__206=async function(pset) {
                                 return  await (async function() {
                                    let __for_body__210=async function(redef) {
                                         return  (await (async function(){
                                            let __targ__212=redefinitions;
                                            if (__targ__212){
                                                 return(__targ__212)[(pset && pset["0"])]
                                            } 
                                        })()).shift()
                                    };
                                    let __array__211=[],__elements__209=(pset && pset["1"]);
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__208 in __elements__209) {
                                        __array__211.push(await __for_body__210(__elements__209[__iter__208]));
                                        if(__BREAK__FLAG__) {
                                             __array__211.pop();
                                            break;
                                            
                                        }
                                    }return __array__211;
                                     
                                })()
                            };
                            let __array__207=[],__elements__205=await (await Environment.get_global("pairs"))(redefinitions);
                            let __BREAK__FLAG__=false;
                            for(let __iter__204 in __elements__205) {
                                __array__207.push(await __for_body__206(__elements__205[__iter__204]));
                                if(__BREAK__FLAG__) {
                                     __array__207.pop();
                                    break;
                                    
                                }
                            }return __array__207;
                             
                        })()
                    };
                    if (check_true (need_sub_block)){
                        (acc).push("{");
                         sub_block_count+=1
                    };
                    idx=-1;
                    await (async function(){
                         let __test_condition__213=async function() {
                             return  (idx<((allocations && allocations.length)-1))
                        };
                        let __body_ref__214=async function() {
                            idx+=1;
                            def_idx=null;
                            stmt=[];
                            alloc_set=await (async function(){
                                let __targ__216=await (async function(){
                                    let __targ__215=allocations;
                                    if (__targ__215){
                                         return(__targ__215)[idx]
                                    } 
                                })();
                                if (__targ__216){
                                     return(__targ__216)["val"]
                                } 
                            })();
                            reference_name=await clean_quoted_reference(await sanitize_js_ref_name((alloc_set && alloc_set["0"] && alloc_set["0"]["name"])));
                            ctx_details=await get_declaration_details(ctx,reference_name);
                            assignment_value=(await (async function(){
                                let __targ__217=assignments;
                                if (__targ__217){
                                     return(__targ__217)[reference_name]
                                } 
                            })()).shift();
                            await async function(){
                                if (check_true( await (async function(){
                                    let __targ__218=block_declarations;
                                    if (__targ__218){
                                         return(__targ__218)[reference_name]
                                    } 
                                })())) {
                                     return true
                                } else  {
                                    (stmt).push("let");
                                     return  (stmt).push(" ")
                                }
                            }();
                            (stmt).push(reference_name);
                            await async function(){
                                let __target_obj__219=block_declarations;
                                __target_obj__219[reference_name]=true;
                                return __target_obj__219;
                                
                            }();
                            (stmt).push("=");
                            (stmt).push(assignment_value);
                            (stmt).push(";");
                             return  (acc).push(stmt)
                        };
                        let __BREAK__FLAG__=false;
                        while(await __test_condition__213()) {
                            await __body_ref__214();
                             if(__BREAK__FLAG__) {
                                 break;
                                
                            }
                        } ;
                        
                    })();
                    (acc).push(await compile_block(await (await Environment.get_global("conj"))(["PLACEHOLDER"],block),ctx,{
                        no_scope_boundary:true,ignore_declarations:declarations_handled
                    }));
                    await (async function() {
                        let __for_body__222=async function(i) {
                             return  (acc).push("}")
                        };
                        let __array__223=[],__elements__221=await (await Environment.get_global("range"))(sub_block_count);
                        let __BREAK__FLAG__=false;
                        for(let __iter__220 in __elements__221) {
                            __array__223.push(await __for_body__222(__elements__221[__iter__220]));
                            if(__BREAK__FLAG__) {
                                 __array__223.pop();
                                break;
                                
                            }
                        }return __array__223;
                         
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
                fn_log=await defclog({
                    prefix:"compile_fn",background:"black",color:"lightblue"
                });
                compile_fn=async function(tokens,ctx,fn_opts) {
                    let acc;
                    let idx;
                    let arg;
                    let fn_args;
                    let __body__224= async function(){
                        return (tokens && tokens["2"])
                    };
                    let type_mark;
                    let nbody;
                    {
                        acc=[];
                        idx=-1;
                        arg=null;
                        ctx=await new_ctx(ctx);
                        fn_args=(tokens && tokens["1"] && tokens["1"]["val"]);
                        let body=await __body__224();
                        ;
                        type_mark=null;
                        nbody=null;
                        await async function(){
                            let __target_obj__225=ctx;
                            __target_obj__225["return_last_value"]=true;
                            return __target_obj__225;
                            
                        }();
                        await async function(){
                            let __target_obj__226=ctx;
                            __target_obj__226["return_point"]=0;
                            return __target_obj__226;
                            
                        }();
                        await set_ctx(ctx,"__IN_LAMBDA__",true);
                        await set_ctx(ctx,"__LAMBDA_STEP__",-1);
                        await async function(){
                            let __target_obj__227=ctx;
                            __target_obj__227["lambda_scope"]=true;
                            return __target_obj__227;
                            
                        }();
                        await async function(){
                            let __target_obj__228=ctx;
                            __target_obj__228["suppress_return"]=false;
                            return __target_obj__228;
                            
                        }();
                        await async function(){
                            if (check_true((fn_opts && fn_opts["synchronous"]))) {
                                type_mark=await type_marker("Function");
                                 return  (acc).push(type_mark)
                            } else if (check_true((fn_opts && fn_opts["arrow"]))) {
                                type_mark=await type_marker("Function");
                                 return  (acc).push(type_mark)
                            } else  {
                                type_mark=await type_marker("AsyncFunction");
                                (acc).push(type_mark);
                                (acc).push("async");
                                 return  (acc).push(" ")
                            }
                        }();
                        await async function(){
                            let __target_obj__229=type_mark;
                            __target_obj__229["args"]=[];
                            return __target_obj__229;
                            
                        }();
                        if (check_true (await not((fn_opts && fn_opts["arrow"])))){
                             (acc).push("function")
                        };
                        (acc).push("(");
                        await (async function(){
                             let __test_condition__230=async function() {
                                 return  (idx<((fn_args && fn_args.length)-1))
                            };
                            let __body_ref__231=async function() {
                                idx+=1;
                                arg=await (async function(){
                                    let __targ__232=fn_args;
                                    if (__targ__232){
                                         return(__targ__232)[idx]
                                    } 
                                })();
                                if (check_true (((arg && arg.name)==="&"))){
                                    idx+=1;
                                    arg=await (async function(){
                                        let __targ__233=fn_args;
                                        if (__targ__233){
                                             return(__targ__233)[idx]
                                        } 
                                    })();
                                    if (check_true ((null==arg))){
                                        throw new SyntaxError("Missing argument symbol after &");
                                        
                                    };
                                    await set_ctx(ctx,(arg && arg.name),ArgumentType);
                                     await async function(){
                                        let __target_obj__234=arg;
                                        __target_obj__234["name"]=("..."+(arg && arg.name));
                                        return __target_obj__234;
                                        
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
                            while(await __test_condition__230()) {
                                await __body_ref__231();
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
                        await async function(){
                            let __target_obj__235=ctx;
                            __target_obj__235["return_last_value"]=true;
                            return __target_obj__235;
                            
                        }();
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
                                    let __target_obj__236=ctx;
                                    __target_obj__236["return_last_value"]=true;
                                    return __target_obj__236;
                                    
                                }();
                                (acc).push({
                                    mark:"nbody"
                                });
                                 return  (acc).push(await compile_block(nbody,ctx))
                            }
                        }();
                         return  acc
                    }
                };
                compile_jslambda=async function(tokens,ctx) {
                    let acc;
                    let fn_args;
                    let __body__237= async function(){
                        return (tokens && tokens["2"] && tokens["2"]["val"])
                    };
                    let idx;
                    let quoted_body;
                    let arg;
                    let type_mark;
                    {
                        acc=[];
                        fn_args=(tokens && tokens["1"] && tokens["1"]["val"]);
                        let body=await __body__237();
                        ;
                        idx=-1;
                        quoted_body=[];
                        arg=null;
                        type_mark=await type_marker("Function");
                        (acc).push(type_mark);
                        await (async function() {
                            let __for_body__240=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__241=[],__elements__239=["new"," ","Function","("];
                            let __BREAK__FLAG__=false;
                            for(let __iter__238 in __elements__239) {
                                __array__241.push(await __for_body__240(__elements__239[__iter__238]));
                                if(__BREAK__FLAG__) {
                                     __array__241.pop();
                                    break;
                                    
                                }
                            }return __array__241;
                             
                        })();
                        await (async function(){
                             let __test_condition__242=async function() {
                                 return  (idx<((fn_args && fn_args.length)-1))
                            };
                            let __body_ref__243=async function() {
                                idx+=1;
                                arg=await (async function(){
                                    let __targ__244=fn_args;
                                    if (__targ__244){
                                         return(__targ__244)[idx]
                                    } 
                                })();
                                await set_ctx(ctx,(arg && arg.name),ArgumentType);
                                (acc).push(("\""+(arg && arg.name)+"\""));
                                ((type_mark && type_mark["args"])).push((arg && arg.name));
                                 return  (acc).push(",")
                            };
                            let __BREAK__FLAG__=false;
                            while(await __test_condition__242()) {
                                await __body_ref__243();
                                 if(__BREAK__FLAG__) {
                                     break;
                                    
                                }
                            } ;
                            
                        })();
                        (acc).push("\"");
                        await (async function() {
                            let __for_body__247=async function(c) {
                                if (check_true (await not((c==="\n"),(c==="\r")))){
                                    if (check_true ((c==="\""))){
                                         (quoted_body).push(await String.fromCharCode(92))
                                    };
                                     return  (quoted_body).push(c)
                                }
                            };
                            let __array__248=[],__elements__246=(body).split("");
                            let __BREAK__FLAG__=false;
                            for(let __iter__245 in __elements__246) {
                                __array__248.push(await __for_body__247(__elements__246[__iter__245]));
                                if(__BREAK__FLAG__) {
                                     __array__248.pop();
                                    break;
                                    
                                }
                            }return __array__248;
                             
                        })();
                        (acc).push((await flatten(quoted_body)).join(""));
                        (acc).push("\"");
                        (acc).push(")");
                         return  acc
                    }
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
                     return  [{
                        ctype:"AsyncFunction"
                    },"await"," ","async"," ","function","()","{",await compile_cond_inner(tokens,ctx),"}()"]
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
                            let __targ__249=await first(stmts);
                            if (__targ__249){
                                 return(__targ__249)["ctype"]
                            } 
                        })()&&await async function(){
                            if (check_true( (await (async function(){
                                let __targ__250=await first(stmts);
                                if (__targ__250){
                                     return(__targ__250)["ctype"]
                                } 
                            })() instanceof String || typeof await (async function(){
                                let __targ__250=await first(stmts);
                                if (__targ__250){
                                     return(__targ__250)["ctype"]
                                } 
                            })()==='string'))) {
                                 return await (async function(){
                                    let __targ__251=await first(stmts);
                                    if (__targ__251){
                                         return(__targ__251)["ctype"]
                                    } 
                                })()
                            } else  {
                                 return await sub_type(await (async function(){
                                    let __targ__252=await first(stmts);
                                    if (__targ__252){
                                         return(__targ__252)["ctype"]
                                    } 
                                })())
                            }
                        }())||""));
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
                        }()
                    };
                    idx=0;
                    condition=null;
                    condition_block=null;
                    condition_tokens=await tokens["slice"].call(tokens,1);
                    await (await Environment.get_global("compiler_syntax_validation"))("compile_cond",tokens,errors,ctx,tree);
                    await async function(){
                        if (check_true( await not((((condition_tokens && condition_tokens.length)%2)===0)))) {
                             throw new SyntaxError("cond: Invalid syntax: missing condition block");
                            
                        } else if (check_true( ((condition_tokens && condition_tokens.length)===0))) {
                             throw new SyntaxError("cond: Invalid syntax: no conditions provided");
                            
                        }
                    }();
                    await set_ctx(ctx,"__LAMBDA_STEP__",-1);
                    await (async function(){
                         let __test_condition__253=async function() {
                             return  (idx<(condition_tokens && condition_tokens.length))
                        };
                        let __body_ref__254=async function() {
                            inject_return=false;
                            condition=await (async function(){
                                let __targ__255=condition_tokens;
                                if (__targ__255){
                                     return(__targ__255)[idx]
                                } 
                            })();
                            idx+=1;
                            condition_block=await (async function(){
                                let __targ__256=condition_tokens;
                                if (__targ__256){
                                     return(__targ__256)[idx]
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
                                    let __array_op_rval__257=is_form_ques_;
                                     if (__array_op_rval__257 instanceof Function){
                                        return await __array_op_rval__257(condition) 
                                    } else {
                                        return[__array_op_rval__257,condition]
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
                            }();
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
                        while(await __test_condition__253()) {
                            await __body_ref__254();
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
                    let __if_id__258= async function(){
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
                    let needs_braces_ques_;
                    let check_needs_return;
                    {
                        acc=[];
                        stmts=null;
                        fst=null;
                        let if_id=await __if_id__258();
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
                        needs_braces_ques_=false;
                        check_needs_return=async function(stmts) {
                            fst=(""+(((stmts instanceof Array)&&await first(stmts)&&(await first(stmts) instanceof Object)&&await (async function(){
                                let __targ__259=await first(stmts);
                                if (__targ__259){
                                     return(__targ__259)["ctype"]
                                } 
                            })()&&await async function(){
                                if (check_true( (await (async function(){
                                    let __targ__260=await first(stmts);
                                    if (__targ__260){
                                         return(__targ__260)["ctype"]
                                    } 
                                })() instanceof String || typeof await (async function(){
                                    let __targ__260=await first(stmts);
                                    if (__targ__260){
                                         return(__targ__260)["ctype"]
                                    } 
                                })()==='string'))) {
                                     return await (async function(){
                                        let __targ__261=await first(stmts);
                                        if (__targ__261){
                                             return(__targ__261)["ctype"]
                                        } 
                                    })()
                                } else  {
                                     return await sub_type(await (async function(){
                                        let __targ__262=await first(stmts);
                                        if (__targ__262){
                                             return(__targ__262)["ctype"]
                                        } 
                                    })())
                                }
                            }())||""));
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
                            }()
                        };
                        if (check_true (((ctx && ctx["block_step"])===undefined))){
                             await async function(){
                                let __target_obj__263=ctx;
                                __target_obj__263["block_step"]=0;
                                return __target_obj__263;
                                
                            }()
                        };
                        if (check_true ((null==ctx))){
                            throw new ReferenceError("undefined/nil ctx passed to compile_if");
                            
                        };
                        (acc).push({
                            ctype:"ifblock"
                        });
                        if (check_true ((ctx && ctx["source"]))){
                             (acc).push({
                                comment:(""+(ctx && ctx["source"])+" ")
                            })
                        };
                        compiled_test=await compile_elem(test_form,ctx);
                        await set_ctx(ctx,"__IF_BLOCK__",if_id);
                        if (check_true (((ctx && ctx["block_step"])>0))){
                             await async function(){
                                let __target_obj__264=ctx;
                                __target_obj__264["suppress_return"]=true;
                                return __target_obj__264;
                                
                            }()
                        };
                        if (check_true (((await first(compiled_test) instanceof Object)&&await (async function(){
                            let __targ__265=await first(compiled_test);
                            if (__targ__265){
                                 return(__targ__265)["ctype"]
                            } 
                        })()&&(await (async function(){
                            let __targ__266=await first(compiled_test);
                            if (__targ__266){
                                 return(__targ__266)["ctype"]
                            } 
                        })() instanceof String || typeof await (async function(){
                            let __targ__266=await first(compiled_test);
                            if (__targ__266){
                                 return(__targ__266)["ctype"]
                            } 
                        })()==='string')&&await contains_ques_("unction",await (async function(){
                            let __targ__267=await first(compiled_test);
                            if (__targ__267){
                                 return(__targ__267)["ctype"]
                            } 
                        })())))){
                             await (async function() {
                                let __for_body__270=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__271=[],__elements__269=["if"," ","(check_true (","await"," ",compiled_test,"()","))"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__268 in __elements__269) {
                                    __array__271.push(await __for_body__270(__elements__269[__iter__268]));
                                    if(__BREAK__FLAG__) {
                                         __array__271.pop();
                                        break;
                                        
                                    }
                                }return __array__271;
                                 
                            })()
                        } else {
                             await (async function() {
                                let __for_body__274=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__275=[],__elements__273=["if"," ","(check_true (",compiled_test,"))"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__272 in __elements__273) {
                                    __array__275.push(await __for_body__274(__elements__273[__iter__272]));
                                    if(__BREAK__FLAG__) {
                                         __array__275.pop();
                                        break;
                                        
                                    }
                                }return __array__275;
                                 
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
                            let __target_obj__276=ctx;
                            __target_obj__276["suppress_return"]=in_suppress_ques_;
                            return __target_obj__276;
                            
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
                    let needs_await;
                    acc=[];
                    ctx=ctx;
                    needs_await=true;
                    await async function(){
                        if (check_true( ((tokens instanceof Object)&&await not((tokens instanceof Array))&&await not(((tokens && tokens["type"])==="arr"))))) {
                            needs_await=false;
                             return  acc=[await compile(tokens,ctx)]
                        } else if (check_true( await (async function(){
                            let __array_op_rval__277=is_block_ques_;
                             if (__array_op_rval__277 instanceof Function){
                                return await __array_op_rval__277(tokens) 
                            } else {
                                return[__array_op_rval__277,tokens]
                            }
                        })())) {
                            ctx=await new_ctx(ctx);
                            await async function(){
                                let __target_obj__278=ctx;
                                __target_obj__278["return_point"]=1;
                                return __target_obj__278;
                                
                            }();
                             return  acc=["(","async"," ","function","()","{",await compile(tokens,ctx),"}",")","()"]
                        } else if (check_true( ((tokens instanceof Object)&&((tokens && tokens["val"] && tokens["val"]["0"] && tokens["val"]["0"]["name"])==="if")))) {
                            ctx=await new_ctx(ctx);
                            await async function(){
                                let __target_obj__279=ctx;
                                __target_obj__279["return_point"]=1;
                                return __target_obj__279;
                                
                            }();
                             return  await (async function() {
                                let __for_body__282=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__283=[],__elements__281=["(","async"," ","function","()","{",await compile_if((tokens && tokens["val"]),ctx),"}",")","()"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__280 in __elements__281) {
                                    __array__283.push(await __for_body__282(__elements__281[__iter__280]));
                                    if(__BREAK__FLAG__) {
                                         __array__283.pop();
                                        break;
                                        
                                    }
                                }return __array__283;
                                 
                            })()
                        } else if (check_true( (tokens instanceof Array))) {
                             return  acc=await compile_block_to_anon_fn(tokens,ctx)
                        } else if (check_true( ((tokens instanceof Object)&&(tokens && tokens["val"])&&((tokens && tokens["type"])==="arr")))) {
                             return  acc=await compile_block_to_anon_fn((tokens && tokens["val"]),ctx)
                        }
                    }();
                    if (check_true (needs_await)){
                          return ["await"," ",acc]
                    } else {
                          return await (async function(){
                            let __array_op_rval__284=acc;
                             if (__array_op_rval__284 instanceof Function){
                                return await __array_op_rval__284() 
                            } else {
                                return[__array_op_rval__284]
                            }
                        })()
                    }
                };
                compile_block_to_anon_fn=async function(tokens,ctx,opts) {
                    let acc;
                    acc=[];
                    ctx=await new_ctx(ctx);
                    await async function(){
                        let __target_obj__285=ctx;
                        __target_obj__285["return_point"]=0;
                        return __target_obj__285;
                        
                    }();
                    await async function(){
                        if (check_true( await (async function(){
                            let __array_op_rval__286=is_block_ques_;
                             if (__array_op_rval__286 instanceof Function){
                                return await __array_op_rval__286(tokens) 
                            } else {
                                return[__array_op_rval__286,tokens]
                            }
                        })())) {
                            await async function(){
                                let __target_obj__287=ctx;
                                __target_obj__287["return_last_value"]=true;
                                return __target_obj__287;
                                
                            }();
                            await async function(){
                                let __target_obj__288=ctx;
                                __target_obj__288["return_point"]=0;
                                return __target_obj__288;
                                
                            }();
                             return  await (async function() {
                                let __for_body__291=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__292=[],__elements__290=["(","async"," ","function","()",await compile_block(tokens,ctx),")","()"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__289 in __elements__290) {
                                    __array__292.push(await __for_body__291(__elements__290[__iter__289]));
                                    if(__BREAK__FLAG__) {
                                         __array__292.pop();
                                        break;
                                        
                                    }
                                }return __array__292;
                                 
                            })()
                        } else if (check_true( ((tokens && tokens["0"] && tokens["0"]["name"])==="let"))) {
                            await async function(){
                                let __target_obj__293=ctx;
                                __target_obj__293["return_last_value"]=true;
                                return __target_obj__293;
                                
                            }();
                            await async function(){
                                let __target_obj__294=ctx;
                                __target_obj__294["return_point"]=0;
                                return __target_obj__294;
                                
                            }();
                             return  await (async function() {
                                let __for_body__297=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__298=[],__elements__296=["(","async"," ","function","()",await compile(tokens,ctx),")","()"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__295 in __elements__296) {
                                    __array__298.push(await __for_body__297(__elements__296[__iter__295]));
                                    if(__BREAK__FLAG__) {
                                         __array__298.pop();
                                        break;
                                        
                                    }
                                }return __array__298;
                                 
                            })()
                        } else  {
                            await async function(){
                                let __target_obj__299=ctx;
                                __target_obj__299["return_last_value"]=true;
                                return __target_obj__299;
                                
                            }();
                            await async function(){
                                let __target_obj__300=ctx;
                                __target_obj__300["return_point"]=0;
                                return __target_obj__300;
                                
                            }();
                             return  await (async function() {
                                let __for_body__303=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__304=[],__elements__302=["(","async"," ","function","()","{"," ","return"," ",await compile(tokens,ctx)," ","}",")","()"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__301 in __elements__302) {
                                    __array__304.push(await __for_body__303(__elements__302[__iter__301]));
                                    if(__BREAK__FLAG__) {
                                         __array__304.pop();
                                        break;
                                        
                                    }
                                }return __array__304;
                                 
                            })()
                        }
                    }();
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
                                let __for_body__307=async function(token) {
                                     return  (place).push(token)
                                };
                                let __array__308=[],__elements__306=tokens;
                                let __BREAK__FLAG__=false;
                                for(let __iter__305 in __elements__306) {
                                    __array__308.push(await __for_body__307(__elements__306[__iter__305]));
                                    if(__BREAK__FLAG__) {
                                         __array__308.pop();
                                        break;
                                        
                                    }
                                }return __array__308;
                                 
                            })()
                        } else  {
                             return await (async function() {
                                let __for_body__311=async function(token) {
                                     return  (place).push(token)
                                };
                                let __array__312=[],__elements__310=await (async function(){
                                    let __array_op_rval__313=tokens;
                                     if (__array_op_rval__313 instanceof Function){
                                        return await __array_op_rval__313() 
                                    } else {
                                        return[__array_op_rval__313]
                                    }
                                })();
                                let __BREAK__FLAG__=false;
                                for(let __iter__309 in __elements__310) {
                                    __array__312.push(await __for_body__311(__elements__310[__iter__309]));
                                    if(__BREAK__FLAG__) {
                                         __array__312.pop();
                                        break;
                                        
                                    }
                                }return __array__312;
                                 
                            })()
                        }
                    }();
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
                    new_opts=await tokens["slice"].call(tokens,2);
                    if (check_true (((comps && comps.length)>1))){
                         target_type=await (await Environment.get_global("path_to_js_syntax"))(comps)
                    };
                    await (async function() {
                        let __for_body__316=async function(opt_token) {
                             return  (args).push(await wrap_assignment_value(await compile(opt_token,ctx)))
                        };
                        let __array__317=[],__elements__315=(new_opts||[]);
                        let __BREAK__FLAG__=false;
                        for(let __iter__314 in __elements__315) {
                            __array__317.push(await __for_body__316(__elements__315[__iter__314]));
                            if(__BREAK__FLAG__) {
                                 __array__317.pop();
                                break;
                                
                            }
                        }return __array__317;
                         
                    })();
                    await async function(){
                        if (check_true( (await not((null==(type_details && type_details["value"])))&&(type_details && type_details["value"]) instanceof Function))) {
                            await (async function() {
                                let __for_body__320=async function(arg) {
                                     return  (acc).push(arg)
                                };
                                let __array__321=[],__elements__319=["new"," ",target_type,"("];
                                let __BREAK__FLAG__=false;
                                for(let __iter__318 in __elements__319) {
                                    __array__321.push(await __for_body__320(__elements__319[__iter__318]));
                                    if(__BREAK__FLAG__) {
                                         __array__321.pop();
                                        break;
                                        
                                    }
                                }return __array__321;
                                 
                            })();
                            await push_as_arg_list(acc,args);
                             return  (acc).push(")")
                        } else if (check_true( ((null==(type_details && type_details["value"]))&&await not((null==(root_type_details && root_type_details["value"])))))) {
                            await (async function() {
                                let __for_body__324=async function(arg) {
                                     return  (acc).push(arg)
                                };
                                let __array__325=[],__elements__323=["(","await"," ","Environment.get_global","(","\"","indirect_new","\"",")",")","(",target_type];
                                let __BREAK__FLAG__=false;
                                for(let __iter__322 in __elements__323) {
                                    __array__325.push(await __for_body__324(__elements__323[__iter__322]));
                                    if(__BREAK__FLAG__) {
                                         __array__325.pop();
                                        break;
                                        
                                    }
                                }return __array__325;
                                 
                            })();
                            if (check_true (((args && args.length)>0))){
                                (acc).push(",");
                                 await push_as_arg_list(acc,args)
                            };
                             return  (acc).push(")")
                        }
                    }();
                    target_return_type=(await get_ctx_val(ctx,target_type)||await (async function(){
                        let __targ__326=(await get_declarations(ctx,target_type)||new Object());
                        if (__targ__326){
                             return(__targ__326)["type"]
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
                    }();
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
                            }()
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
                            }()
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
                                let __array_op_rval__327=target;
                                 if (__array_op_rval__327 instanceof Function){
                                    return await __array_op_rval__327(operation,how_much) 
                                } else {
                                    return[__array_op_rval__327,operation,how_much]
                                }
                            })()
                        }
                    }()
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
                     return  [{
                        ctype:"AsyncFunction"
                    },"await"," ","(","async"," ","function","()","{",await compile_try_inner(tokens,ctx),"}",")","()"]
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
                            let __targ__328=await first(stmts);
                            if (__targ__328){
                                 return(__targ__328)["ctype"]
                            } 
                        })()&&await async function(){
                            if (check_true( (await (async function(){
                                let __targ__329=await first(stmts);
                                if (__targ__329){
                                     return(__targ__329)["ctype"]
                                } 
                            })() instanceof String || typeof await (async function(){
                                let __targ__329=await first(stmts);
                                if (__targ__329){
                                     return(__targ__329)["ctype"]
                                } 
                            })()==='string'))) {
                                 return await (async function(){
                                    let __targ__330=await first(stmts);
                                    if (__targ__330){
                                         return(__targ__330)["ctype"]
                                    } 
                                })()
                            } else  {
                                 return await sub_type(await (async function(){
                                    let __targ__331=await first(stmts);
                                    if (__targ__331){
                                         return(__targ__331)["ctype"]
                                    } 
                                })())
                            }
                        }())||""));
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
                        }()
                    };
                    insert_catch_block=async function(err_data,stmts) {
                        let complete;
                        complete=false;
                        if (check_true (((err_data && err_data["idx"])===0))){
                             await (async function() {
                                let __for_body__334=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__335=[],__elements__333=[" ","catch","(",the_exception_ref,")"," ","{"," "];
                                let __BREAK__FLAG__=false;
                                for(let __iter__332 in __elements__333) {
                                    __array__335.push(await __for_body__334(__elements__333[__iter__332]));
                                    if(__BREAK__FLAG__) {
                                         __array__335.pop();
                                        break;
                                        
                                    }
                                }return __array__335;
                                 
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
                                let __for_body__338=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__339=[],__elements__337=[" ","else"," "];
                                let __BREAK__FLAG__=false;
                                for(let __iter__336 in __elements__337) {
                                    __array__339.push(await __for_body__338(__elements__337[__iter__336]));
                                    if(__BREAK__FLAG__) {
                                         __array__339.pop();
                                        break;
                                        
                                    }
                                }return __array__339;
                                 
                            })()
                        };
                        await (async function() {
                            let __for_body__342=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__343=[],__elements__341=[" ","if"," ","(",the_exception_ref," ","instanceof"," ",(err_data && err_data["error_type"]),")"," ","{"," ","let"," ",(err_data && err_data["error_ref"]),"=",the_exception_ref,";"," "];
                            let __BREAK__FLAG__=false;
                            for(let __iter__340 in __elements__341) {
                                __array__343.push(await __for_body__342(__elements__341[__iter__340]));
                                if(__BREAK__FLAG__) {
                                     __array__343.pop();
                                    break;
                                    
                                }
                            }return __array__343;
                             
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
                                let __for_body__346=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__347=[],__elements__345=[" ","else"," ","throw"," ",the_exception_ref,";"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__344 in __elements__345) {
                                    __array__347.push(await __for_body__346(__elements__345[__iter__344]));
                                    if(__BREAK__FLAG__) {
                                         __array__347.pop();
                                        break;
                                        
                                    }
                                }return __array__347;
                                 
                            })()
                        };
                        if (check_true (complete)){
                             await (async function() {
                                let __for_body__350=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__351=[],__elements__349=[" ","}"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__348 in __elements__349) {
                                    __array__351.push(await __for_body__350(__elements__349[__iter__348]));
                                    if(__BREAK__FLAG__) {
                                         __array__351.pop();
                                        break;
                                        
                                    }
                                }return __array__351;
                                 
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
                        let __target_obj__352=ctx;
                        __target_obj__352["return_last_value"]=true;
                        return __target_obj__352;
                        
                    }();
                    await async function(){
                        let __target_obj__353=ctx;
                        __target_obj__353["in_try"]=true;
                        return __target_obj__353;
                        
                    }();
                    stmts=await compile(try_block,ctx);
                    if (check_true (((stmts && stmts["0"] && stmts["0"]["ctype"])&&(((stmts && stmts["0"] && stmts["0"]["ctype"])===AsyncFunction)||((stmts && stmts["0"] && stmts["0"]["ctype"])===Function))))){
                         (stmts).unshift("await")
                    };
                    if (check_true (await (async function(){
                        let __array_op_rval__354=is_complex_ques_;
                         if (__array_op_rval__354 instanceof Function){
                            return await __array_op_rval__354(try_block) 
                        } else {
                            return[__array_op_rval__354,try_block]
                        }
                    })())){
                         await (async function() {
                            let __for_body__357=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__358=[],__elements__356=["try"," ","/* TRY COMPLEX */ ",stmts," "];
                            let __BREAK__FLAG__=false;
                            for(let __iter__355 in __elements__356) {
                                __array__358.push(await __for_body__357(__elements__356[__iter__355]));
                                if(__BREAK__FLAG__) {
                                     __array__358.pop();
                                    break;
                                    
                                }
                            }return __array__358;
                             
                        })()
                    } else {
                         await (async function() {
                            let __for_body__361=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__362=[],__elements__360=await (async function ()  {
                                let __array_arg__363=(async function() {
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
                                return ["try"," ","/* TRY SIMPLE */ ","{"," ",await __array_arg__363(),stmts," ","}"]
                            } )();
                            let __BREAK__FLAG__=false;
                            for(let __iter__359 in __elements__360) {
                                __array__362.push(await __for_body__361(__elements__360[__iter__359]));
                                if(__BREAK__FLAG__) {
                                     __array__362.pop();
                                    break;
                                    
                                }
                            }return __array__362;
                             
                        })()
                    };
                    await (async function(){
                         let __test_condition__364=async function() {
                             return  (idx<(catches && catches.length))
                        };
                        let __body_ref__365=async function() {
                            catch_block=await (async function(){
                                let __targ__367=await (async function(){
                                    let __targ__366=catches;
                                    if (__targ__366){
                                         return(__targ__366)[idx]
                                    } 
                                })();
                                if (__targ__367){
                                     return(__targ__367)["val"]
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
                        while(await __test_condition__364()) {
                            await __body_ref__365();
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
                    console.log("compile_throw: tokens:",tokens);
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
                    }();
                    if (check_true ((mode===0))){
                         await (async function() {
                            let __for_body__370=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__371=[],__elements__369=["throw"," ",error_instance,";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__368 in __elements__369) {
                                __array__371.push(await __for_body__370(__elements__369[__iter__368]));
                                if(__BREAK__FLAG__) {
                                     __array__371.pop();
                                    break;
                                    
                                }
                            }return __array__371;
                             
                        })()
                    } else {
                         await (async function() {
                            let __for_body__374=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__375=[],__elements__373=["throw"," ","new"," ",error_instance,"(",error_message,")",";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__372 in __elements__373) {
                                __array__375.push(await __for_body__374(__elements__373[__iter__372]));
                                if(__BREAK__FLAG__) {
                                     __array__375.pop();
                                    break;
                                    
                                }
                            }return __array__375;
                             
                        })()
                    };
                     return  acc
                };
                compile_break=async function(tokens,ctx) {
                     return  await (async function(){
                        let __array_op_rval__376=break_out;
                         if (__array_op_rval__376 instanceof Function){
                            return await __array_op_rval__376("=","true",";","return") 
                        } else {
                            return[__array_op_rval__376,"=","true",";","return"]
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
                        let __array_op_rval__377=is_block_ques_;
                         if (__array_op_rval__377 instanceof Function){
                            return await __array_op_rval__377((tokens && tokens["1"] && tokens["1"]["val"])) 
                        } else {
                            return[__array_op_rval__377,(tokens && tokens["1"] && tokens["1"]["val"])]
                        }
                    })())){
                         await (async function() {
                            let __for_body__380=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__381=[],__elements__379=["let"," ",return_val_reference,"=",await compile((tokens && tokens["1"] && tokens["1"]["val"]),ctx),";","return"," ",return_val_reference,";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__378 in __elements__379) {
                                __array__381.push(await __for_body__380(__elements__379[__iter__378]));
                                if(__BREAK__FLAG__) {
                                     __array__381.pop();
                                    break;
                                    
                                }
                            }return __array__381;
                             
                        })()
                    } else {
                         await (async function() {
                            let __for_body__384=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__385=[],__elements__383=["return"," ",await compile((tokens && tokens["1"]),ctx),";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__382 in __elements__383) {
                                __array__385.push(await __for_body__384(__elements__383[__iter__382]));
                                if(__BREAK__FLAG__) {
                                     __array__385.pop();
                                    break;
                                    
                                }
                            }return __array__385;
                             
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
                    requires_await=false;
                    compiled_fun_resolver=null;
                    args=await tokens["slice"].call(tokens,2);
                    if (check_true ((args&&((args && args.length)===1)))){
                         args=await first(args)
                    };
                    function_ref=await compile(fn_ref,ctx);
                    if (check_true ((fn_ref && fn_ref["ref"]))){
                         ctype=await get_declaration_details(ctx,(fn_ref && fn_ref["val"]))
                    };
                    if (check_true ((ctype && ctype["value"]) instanceof Function)){
                         requires_await=true
                    };
                    function_ref=await wrap_assignment_value(function_ref);
                    if (check_true ((args instanceof Array))){
                        target_argument_ref=await gen_temp_name("target_arg");
                        target_arg=(args).pop();
                        await (async function() {
                            let __for_body__388=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__389=[],__elements__387=["let"," ",target_argument_ref,"=","[]",".concat","(",await compile(target_arg,ctx),")",";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__386 in __elements__387) {
                                __array__389.push(await __for_body__388(__elements__387[__iter__386]));
                                if(__BREAK__FLAG__) {
                                     __array__389.pop();
                                    break;
                                    
                                }
                            }return __array__389;
                             
                        })();
                        await (async function() {
                            let __for_body__392=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__393=[],__elements__391=["if","(","!",target_argument_ref," ","instanceof"," ","Array",")","{","throw"," ","new"," ","TypeError","(","\"Invalid final argument to apply - an array is required\"",")","}"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__390 in __elements__391) {
                                __array__393.push(await __for_body__392(__elements__391[__iter__390]));
                                if(__BREAK__FLAG__) {
                                     __array__393.pop();
                                    break;
                                    
                                }
                            }return __array__393;
                             
                        })();
                        await (async function() {
                            let __for_body__396=async function(token) {
                                preceding_arg_ref=await gen_temp_name("pre_arg");
                                if (check_true (await (async function(){
                                    let __array_op_rval__398=is_form_ques_;
                                     if (__array_op_rval__398 instanceof Function){
                                        return await __array_op_rval__398(token) 
                                    } else {
                                        return[__array_op_rval__398,token]
                                    }
                                })())){
                                     await (async function() {
                                        let __for_body__401=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__402=[],__elements__400=["let"," ",preceding_arg_ref,"=",await wrap_assignment_value(await compile((token && token["val"]),ctx)),";"];
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
                                     preceding_arg_ref=await wrap_assignment_value(await compile(token,ctx))
                                };
                                 return  (acc).push(await (async function(){
                                    let __array_op_rval__403=target_argument_ref;
                                     if (__array_op_rval__403 instanceof Function){
                                        return await __array_op_rval__403(".unshift","(",preceding_arg_ref,")",";") 
                                    } else {
                                        return[__array_op_rval__403,".unshift","(",preceding_arg_ref,")",";"]
                                    }
                                })())
                            };
                            let __array__397=[],__elements__395=args;
                            let __BREAK__FLAG__=false;
                            for(let __iter__394 in __elements__395) {
                                __array__397.push(await __for_body__396(__elements__395[__iter__394]));
                                if(__BREAK__FLAG__) {
                                     __array__397.pop();
                                    break;
                                    
                                }
                            }return __array__397;
                             
                        })();
                         await (async function() {
                            let __for_body__406=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__407=[],__elements__405=["return"," ","(",function_ref,")",".","apply","(","this",",",target_argument_ref,")"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__404 in __elements__405) {
                                __array__407.push(await __for_body__406(__elements__405[__iter__404]));
                                if(__BREAK__FLAG__) {
                                     __array__407.pop();
                                    break;
                                    
                                }
                            }return __array__407;
                             
                        })()
                    } else {
                        if (check_true (await (async function(){
                            let __array_op_rval__408=is_form_ques_;
                             if (__array_op_rval__408 instanceof Function){
                                return await __array_op_rval__408(args) 
                            } else {
                                return[__array_op_rval__408,args]
                            }
                        })())){
                            await (async function() {
                                let __for_body__411=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__412=[],__elements__410=["let"," ",args_ref,"=",await wrap_assignment_value(await compile((args && args["val"]),ctx)),";"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__409 in __elements__410) {
                                    __array__412.push(await __for_body__411(__elements__410[__iter__409]));
                                    if(__BREAK__FLAG__) {
                                         __array__412.pop();
                                        break;
                                        
                                    }
                                }return __array__412;
                                 
                            })();
                             complex_ques_=true
                        };
                        await (async function() {
                            let __for_body__415=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__416=[],__elements__414=["return"," ","("," ",function_ref,")",".","apply","(","this"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__413 in __elements__414) {
                                __array__416.push(await __for_body__415(__elements__414[__iter__413]));
                                if(__BREAK__FLAG__) {
                                     __array__416.pop();
                                    break;
                                    
                                }
                            }return __array__416;
                             
                        })();
                        if (check_true (args)){
                            (acc).push(",");
                            if (check_true (complex_ques_)){
                                 (acc).push(args_ref)
                            } else {
                                 (acc).push(await wrap_assignment_value(await compile(args,ctx)))
                            }
                        };
                         (acc).push(")")
                    };
                     return  ["await"," ","(","async"," ","function","()","{",acc,"}",")","()"]
                };
                compile_call=async function(tokens,ctx) {
                    let simple_target_ques_;
                    let simple_method_ques_;
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
                                type:0
                            })
                        } else if (check_true(simple_target_ques_)) {
                             return await compile_call_inner(tokens,ctx,{
                                type:0
                            })
                        } else  {
                             return [{
                                ctype:"AsyncFunction"
                            },"await"," ","(","async"," ","function","()"," ","{",await compile_call_inner(tokens,ctx,{
                                type:2
                            })," ","}",")","()"]
                        }
                    }()
                };
                compile_call_inner=async function(tokens,ctx,opts) {
                    let acc;
                    let target;
                    let idx;
                    let add_args;
                    let method;
                    acc=[];
                    target=null;
                    idx=-1;
                    add_args=async function() {
                         return  await (async function() {
                            let __for_body__419=async function(token) {
                                (acc).push(",");
                                 return  (acc).push(await wrap_assignment_value(await compile(token,ctx)))
                            };
                            let __array__420=[],__elements__418=await tokens["slice"].call(tokens,3);
                            let __BREAK__FLAG__=false;
                            for(let __iter__417 in __elements__418) {
                                __array__420.push(await __for_body__419(__elements__418[__iter__417]));
                                if(__BREAK__FLAG__) {
                                     __array__420.pop();
                                    break;
                                    
                                }
                            }return __array__420;
                             
                        })()
                    };
                    method=null;
                    if (check_true (((tokens && tokens.length)<3))){
                        throw new SyntaxError(("call: missing arguments, requires at least 2"));
                        
                    };
                    target=await wrap_assignment_value(await compile((tokens && tokens["1"]),ctx));
                    method=await wrap_assignment_value(await compile((tokens && tokens["2"]),ctx));
                    await async function(){
                        if (check_true( (((opts && opts["type"])===0)||((opts && opts["type"])===1)))) {
                             return  await async function(){
                                if (check_true( ((tokens && tokens.length)===3))) {
                                     return await (async function() {
                                        let __for_body__423=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__424=[],__elements__422=["await"," ",target,"[",method,"]","()"];
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__421 in __elements__422) {
                                            __array__424.push(await __for_body__423(__elements__422[__iter__421]));
                                            if(__BREAK__FLAG__) {
                                                 __array__424.pop();
                                                break;
                                                
                                            }
                                        }return __array__424;
                                         
                                    })()
                                } else  {
                                    await (async function() {
                                        let __for_body__427=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__428=[],__elements__426=["await"," ",target,"[",method,"]",".call","(",target];
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__425 in __elements__426) {
                                            __array__428.push(await __for_body__427(__elements__426[__iter__425]));
                                            if(__BREAK__FLAG__) {
                                                 __array__428.pop();
                                                break;
                                                
                                            }
                                        }return __array__428;
                                         
                                    })();
                                    await add_args();
                                     return  (acc).push(")")
                                }
                            }()
                        } else if (check_true( ((opts && opts["type"])===2))) {
                            await (async function() {
                                let __for_body__431=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__432=[],__elements__430=["{"," ","let"," ","__call_target__","=",target,","," ","__call_method__","=",method,";"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__429 in __elements__430) {
                                    __array__432.push(await __for_body__431(__elements__430[__iter__429]));
                                    if(__BREAK__FLAG__) {
                                         __array__432.pop();
                                        break;
                                        
                                    }
                                }return __array__432;
                                 
                            })();
                            await async function(){
                                if (check_true( ((tokens && tokens.length)===3))) {
                                     return await (async function() {
                                        let __for_body__435=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__436=[],__elements__434=["return"," ","await"," ","__call_target__","[","__call_method__","]","()"];
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__433 in __elements__434) {
                                            __array__436.push(await __for_body__435(__elements__434[__iter__433]));
                                            if(__BREAK__FLAG__) {
                                                 __array__436.pop();
                                                break;
                                                
                                            }
                                        }return __array__436;
                                         
                                    })()
                                } else  {
                                    await (async function() {
                                        let __for_body__439=async function(t) {
                                             return  (acc).push(t)
                                        };
                                        let __array__440=[],__elements__438=["return"," ","await"," ","__call_target__","[","__call_method__","]",".","call","(","__call_target__"];
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__437 in __elements__438) {
                                            __array__440.push(await __for_body__439(__elements__438[__iter__437]));
                                            if(__BREAK__FLAG__) {
                                                 __array__440.pop();
                                                break;
                                                
                                            }
                                        }return __array__440;
                                         
                                    })();
                                    await add_args();
                                     return  (acc).push(")")
                                }
                            }();
                             return  (acc).push("}")
                        }
                    }();
                     return  acc
                };
                check_needs_wrap=async function(stmts) {
                    let fst;
                    fst=(""+(((stmts instanceof Array)&&await first(stmts)&&(await first(stmts) instanceof Object)&&await not(await (async function(){
                        let __targ__441=await first(stmts);
                        if (__targ__441){
                             return(__targ__441)["ctype"]
                        } 
                    })() instanceof Function)&&await (async function(){
                        let __targ__442=await first(stmts);
                        if (__targ__442){
                             return(__targ__442)["ctype"]
                        } 
                    })())||""));
                     return  await async function(){
                        if (check_true( await contains_ques_("block",fst))) {
                             return true
                        } else  {
                             return false
                        }
                    }()
                };
                compile_import=async function(tokens,ctx) {
                    let symbol_tokens;
                    let symbols;
                    let from_tokens;
                    let from_place;
                    let acc;
                    symbol_tokens=(tokens && tokens["1"]);
                    symbols=[];
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
                                let __for_body__445=async function(s) {
                                     return  (symbols).push(await compile(s,ctx))
                                };
                                let __array__446=[],__elements__444=(symbol_tokens && symbol_tokens["val"]);
                                let __BREAK__FLAG__=false;
                                for(let __iter__443 in __elements__444) {
                                    __array__446.push(await __for_body__445(__elements__444[__iter__443]));
                                    if(__BREAK__FLAG__) {
                                         __array__446.pop();
                                        break;
                                        
                                    }
                                }return __array__446;
                                 
                            })();
                             return  await (async function() {
                                let __for_body__449=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__450=[],__elements__448=await flatten(["{"," ",symbols," ","}"," ","from"," ",from_place]);
                                let __BREAK__FLAG__=false;
                                for(let __iter__447 in __elements__448) {
                                    __array__450.push(await __for_body__449(__elements__448[__iter__447]));
                                    if(__BREAK__FLAG__) {
                                         __array__450.pop();
                                        break;
                                        
                                    }
                                }return __array__450;
                                 
                            })()
                        }
                    }();
                    await console.log("compile_import: <- ",await clone(acc));
                     return  acc
                };
                compile_javascript=async function(tokens,ctx) {
                    let acc;
                    let text;
                    acc=[];
                    text=null;
                    await (async function() {
                        let __for_body__453=async function(t) {
                             return  await async function(){
                                if (check_true((t && t["ref"]))) {
                                     return (acc).push((t && t.name))
                                } else if (check_true( ((t && t["val"]) instanceof Array))) {
                                     return (acc).push(await compile(t,ctx))
                                } else  {
                                     return (acc).push((t && t["val"]))
                                }
                            }()
                        };
                        let __array__454=[],__elements__452=(await (await Environment.get_global("rest"))(tokens)||[]);
                        let __BREAK__FLAG__=false;
                        for(let __iter__451 in __elements__452) {
                            __array__454.push(await __for_body__453(__elements__452[__iter__451]));
                            if(__BREAK__FLAG__) {
                                 __array__454.pop();
                                break;
                                
                            }
                        }return __array__454;
                         
                    })();
                     return  acc
                };
                compile_dynamic_import=async function(tokens,ctx) {
                    let from_tokens;
                    let from_place;
                    let acc;
                    from_tokens=null;
                    from_place=null;
                    acc=[];
                    from_tokens=(tokens && tokens["1"]);
                    await console.log("compile_dynamic_import: ->",await clone(tokens));
                    (acc).push({
                        ctype:"statement"
                    });
                    from_place=await compile(from_tokens,ctx);
                    await console.log("compile_import: compiled from place: ",from_place);
                    await (async function() {
                        let __for_body__457=async function(t) {
                             return  (acc).push(t)
                        };
                        let __array__458=[],__elements__456=await flatten(["await"," ","import"," ","(",from_place,")"]);
                        let __BREAK__FLAG__=false;
                        for(let __iter__455 in __elements__456) {
                            __array__458.push(await __for_body__457(__elements__456[__iter__455]));
                            if(__BREAK__FLAG__) {
                                 __array__458.pop();
                                break;
                                
                            }
                        }return __array__458;
                         
                    })();
                    await console.log("compile_import: <- ",await clone(acc));
                     return  acc
                };
                compile_set_global=async function(tokens,ctx) {
                    let target;
                    let wrap_as_function_ques_;
                    let acc;
                    let clog;
                    let metavalue;
                    let assignment_value;
                    target=(tokens && tokens["1"] && tokens["1"]["name"]);
                    wrap_as_function_ques_=null;
                    acc=null;
                    clog=await (async function () {
                         if (check_true ((opts && opts["quiet_mode"]))){
                              return log
                        } else {
                              return await defclog({
                                prefix:"compile_set_global",color:"white",background:"#205020"
                            })
                        } 
                    })();
                    metavalue=null;
                    assignment_value=null;
                    has_lisp_globals=true;
                    await async function(){
                        let __target_obj__459=(root_ctx && root_ctx["defined_lisp_globals"]);
                        __target_obj__459[target]=AsyncFunction;
                        return __target_obj__459;
                        
                    }();
                    if (check_true ((tokens && tokens["3"]))){
                         metavalue=await (async function () {
                             if (check_true (await (async function(){
                                let __array_op_rval__460=is_complex_ques_;
                                 if (__array_op_rval__460 instanceof Function){
                                    return await __array_op_rval__460((tokens && tokens["3"])) 
                                } else {
                                    return[__array_op_rval__460,(tokens && tokens["3"])]
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
                    if (check_true ((((assignment_value && assignment_value["0"]) instanceof Object)&&(assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])))){
                        await async function(){
                            let __target_obj__461=(root_ctx && root_ctx["defined_lisp_globals"]);
                            __target_obj__461[target]=await async function(){
                                if (check_true( ((assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])==="Function"))) {
                                     return Function
                                } else if (check_true( ((assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])==="AsyncFunction"))) {
                                     return AsyncFunction
                                } else if (check_true( ((assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])==="Number"))) {
                                     return Number
                                } else if (check_true( ((assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])==="expression"))) {
                                     return Expression
                                } else  {
                                     return assignment_value
                                }
                            }();
                            return __target_obj__461;
                            
                        }();
                        if (check_true (wrap_as_function_ques_)){
                             assignment_value=["await"," ","(","async"," ","function"," ","()",assignment_value,")","()"]
                        }
                    } else {
                         await async function(){
                            let __target_obj__462=(root_ctx && root_ctx["defined_lisp_globals"]);
                            __target_obj__462[target]=assignment_value;
                            return __target_obj__462;
                            
                        }()
                    };
                    acc=await (async function ()  {
                        let __array_arg__463=(async function() {
                            if (check_true (metavalue)){
                                  return ","
                            } else {
                                  return ""
                            }
                        } );
                        let __array_arg__464=(async function() {
                            if (check_true (metavalue)){
                                  return metavalue
                            } else {
                                  return ""
                            }
                        } );
                        return [{
                            ctype:"statement"
                        },"await"," ","Environment",".","set_global","(","","\"",(tokens && tokens["1"] && tokens["1"]["name"]),"\"",",",assignment_value,await __array_arg__463(),await __array_arg__464(),")"]
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
                        let __target_obj__465=ctx;
                        __target_obj__465["hard_quote_mode"]=true;
                        return __target_obj__465;
                        
                    }();
                    acc=await compile_quotem(lisp_struct,ctx);
                     return  acc
                };
                compile_quotel=async function(lisp_struct,ctx) {
                    let acc;
                    acc=[];
                    acc=await JSON.stringify((lisp_struct && lisp_struct["1"]));
                     return  await (async function(){
                        let __array_op_rval__466=acc;
                         if (__array_op_rval__466 instanceof Function){
                            return await __array_op_rval__466() 
                        } else {
                            return[__array_op_rval__466]
                        }
                    })()
                };
                wrap_and_run=async function(js_code,ctx,run_opts) {
                    let __assembly__467= async function(){
                        return null
                    };
                    let result;
                    let fst;
                    let needs_braces_ques_;
                    let run_log;
                    let __needs_return_ques___468= async function(){
                        return await (async function ()  {
                            fst=(""+(((js_code instanceof Array)&&await first(js_code)&&(await first(js_code) instanceof Object)&&await (async function(){
                                let __targ__469=await first(js_code);
                                if (__targ__469){
                                     return(__targ__469)["ctype"]
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
                            }()
                        } )()
                    };
                    let assembled;
                    {
                        let assembly=await __assembly__467();
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
                        let needs_return_ques_=await __needs_return_ques___468();
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
                                let __targ__470=(ntree && ntree["0"]);
                                if (__targ__470){
                                     return(__targ__470)["ctype"]
                                } 
                            })()))){
                                  return await (async function(){
                                    let __targ__471=await first(ntree);
                                    if (__targ__471){
                                         return(__targ__471)["ctype"]
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
                        }();
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
                                 let __test_condition__472=async function() {
                                     return  (idx<tlength)
                                };
                                let __body_ref__473=async function() {
                                    tval=await (async function(){
                                        let __targ__474=tree;
                                        if (__targ__474){
                                             return(__targ__474)[idx]
                                        } 
                                    })();
                                    await async function(){
                                        if (check_true( ((tval===`=$,@`)))) {
                                            idx+=1;
                                            tval=await (async function(){
                                                let __targ__475=tree;
                                                if (__targ__475){
                                                     return(__targ__475)[idx]
                                                } 
                                            })();
                                            if (check_true (await not((undefined==tval)))){
                                                if (check_true (await get_ctx_val(ctx,"__IN_LAMBDA__"))){
                                                    ntree=[];
                                                    if (check_true ((tval instanceof Object))){
                                                        tmp_name=await gen_temp_name("tval");
                                                         await (async function() {
                                                            let __for_body__478=async function(t) {
                                                                 return  (ntree).push(t)
                                                            };
                                                            let __array__479=[],__elements__477=await flatten(await (await Environment.get_global("embed_compiled_quote"))(0,tmp_name,tval));
                                                            let __BREAK__FLAG__=false;
                                                            for(let __iter__476 in __elements__477) {
                                                                __array__479.push(await __for_body__478(__elements__477[__iter__476]));
                                                                if(__BREAK__FLAG__) {
                                                                     __array__479.pop();
                                                                    break;
                                                                    
                                                                }
                                                            }return __array__479;
                                                             
                                                        })()
                                                    } else {
                                                         await (async function() {
                                                            let __for_body__482=async function(t) {
                                                                 return  (subacc).push(t)
                                                            };
                                                            let __array__483=[],__elements__481=await flatten(await (await Environment.get_global("embed_compiled_quote"))(1,tmp_name,tval));
                                                            let __BREAK__FLAG__=false;
                                                            for(let __iter__480 in __elements__481) {
                                                                __array__483.push(await __for_body__482(__elements__481[__iter__480]));
                                                                if(__BREAK__FLAG__) {
                                                                     __array__483.pop();
                                                                    break;
                                                                    
                                                                }
                                                            }return __array__483;
                                                             
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
                                                let __targ__484=tree;
                                                if (__targ__484){
                                                     return(__targ__484)[idx]
                                                } 
                                            })();
                                            if (check_true (await not((undefined==tval)))){
                                                if (check_true (await get_ctx_val(ctx,"__IN_LAMBDA__"))){
                                                    ntree=[];
                                                    if (check_true ((tval instanceof Object))){
                                                        tmp_name=await gen_temp_name("tval");
                                                         await (async function() {
                                                            let __for_body__487=async function(t) {
                                                                 return  (ntree).push(t)
                                                            };
                                                            let __array__488=[],__elements__486=await flatten(await (await Environment.get_global("embed_compiled_quote"))(2,tmp_name,tval));
                                                            let __BREAK__FLAG__=false;
                                                            for(let __iter__485 in __elements__486) {
                                                                __array__488.push(await __for_body__487(__elements__486[__iter__485]));
                                                                if(__BREAK__FLAG__) {
                                                                     __array__488.pop();
                                                                    break;
                                                                    
                                                                }
                                                            }return __array__488;
                                                             
                                                        })()
                                                    } else {
                                                         await (async function() {
                                                            let __for_body__491=async function(t) {
                                                                 return  (ntree).push(t)
                                                            };
                                                            let __array__492=[],__elements__490=await flatten(await (await Environment.get_global("embed_compiled_quote"))(3,tmp_name,tval));
                                                            let __BREAK__FLAG__=false;
                                                            for(let __iter__489 in __elements__490) {
                                                                __array__492.push(await __for_body__491(__elements__490[__iter__489]));
                                                                if(__BREAK__FLAG__) {
                                                                     __array__492.pop();
                                                                    break;
                                                                    
                                                                }
                                                            }return __array__492;
                                                             
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
                                    }();
                                     return  idx+=1
                                };
                                let __BREAK__FLAG__=false;
                                while(await __test_condition__472()) {
                                    await __body_ref__473();
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
                                let __for_body__495=async function(k) {
                                     return  await async function(){
                                        let __target_obj__497=tree;
                                        __target_obj__497[k]=await follow_tree(await (async function(){
                                            let __targ__498=tree;
                                            if (__targ__498){
                                                 return(__targ__498)[k]
                                            } 
                                        })(),ctx);
                                        return __target_obj__497;
                                        
                                    }()
                                };
                                let __array__496=[],__elements__494=await (await Environment.get_global("keys"))(tree);
                                let __BREAK__FLAG__=false;
                                for(let __iter__493 in __elements__494) {
                                    __array__496.push(await __for_body__495(__elements__494[__iter__493]));
                                    if(__BREAK__FLAG__) {
                                         __array__496.pop();
                                        break;
                                        
                                    }
                                }return __array__496;
                                 
                            })();
                             return  tree
                        } else if (check_true( tree instanceof Function)) {
                             return tree
                        }
                    }()
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
                        let __array_op_rval__499=("="+":"+"(");
                         if (__array_op_rval__499 instanceof Function){
                            return await __array_op_rval__499(("="+":"+")"),("="+":"+"'"),("="+":")) 
                        } else {
                            return[__array_op_rval__499,("="+":"+")"),("="+":"+"'"),("="+":")]
                        }
                    })()))){
                          return ("\""+(lisp_struct && lisp_struct["1"])+"\"")
                    } else {
                        pcm=await follow_tree((lisp_struct && lisp_struct["1"]),ctx);
                        await async function(){
                            if (check_true( (pcm instanceof String || typeof pcm==='string'))) {
                                 return  await (async function() {
                                    let __for_body__502=async function(t) {
                                         return  (acc).push(t)
                                    };
                                    let __array__503=[],__elements__501=await (async function(){
                                        let __array_op_rval__504=("`"+pcm+"`");
                                         if (__array_op_rval__504 instanceof Function){
                                            return await __array_op_rval__504() 
                                        } else {
                                            return[__array_op_rval__504]
                                        }
                                    })();
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__500 in __elements__501) {
                                        __array__503.push(await __for_body__502(__elements__501[__iter__500]));
                                        if(__BREAK__FLAG__) {
                                             __array__503.pop();
                                            break;
                                            
                                        }
                                    }return __array__503;
                                     
                                })()
                            } else if (check_true( await is_number_ques_(pcm))) {
                                 return (acc).push(pcm)
                            } else if (check_true( ((pcm===false)||(pcm===true)))) {
                                 return (acc).push(pcm)
                            } else  {
                                encoded=await Environment["as_lisp"].call(Environment,pcm);
                                encoded=await (await Environment.get_global("add_escape_encoding"))(encoded);
                                 return  await (async function() {
                                    let __for_body__507=async function(t) {
                                         return  (acc).push(t)
                                    };
                                    let __array__508=[],__elements__506=["await"," ","Environment.do_deferred_splice","(","await"," ","Environment.read_lisp","(","'",encoded,"'",")",")"];
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__505 in __elements__506) {
                                        __array__508.push(await __for_body__507(__elements__506[__iter__505]));
                                        if(__BREAK__FLAG__) {
                                             __array__508.pop();
                                            break;
                                            
                                        }
                                    }return __array__508;
                                     
                                })()
                            }
                        }();
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
                    let __tokens__509= async function(){
                        return null
                    };
                    let is_arr_ques_;
                    {
                        acc=[];
                        let tokens=await __tokens__509();
                        ;
                        is_arr_ques_=((lisp_struct && lisp_struct["1"]) instanceof Array);
                        tokens=await (async function () {
                             if (check_true (is_arr_ques_)){
                                  return await tokenize((lisp_struct && lisp_struct["1"]),ctx)
                            } else {
                                  return (await tokenize(await (async function(){
                                    let __array_op_rval__510=(lisp_struct && lisp_struct["1"]);
                                     if (__array_op_rval__510 instanceof Function){
                                        return await __array_op_rval__510() 
                                    } else {
                                        return[__array_op_rval__510]
                                    }
                                })(),ctx)).pop()
                            } 
                        })();
                        acc=[await compile(tokens,ctx)];
                        if (check_true (is_arr_ques_)){
                             acc=["async"," ","function","()",["{","return"," ",acc,"}"]]
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
                    let __assembly__511= async function(){
                        return null
                    };
                    let type_mark;
                    let acc;
                    let result;
                    {
                        let assembly=await __assembly__511();
                        ;
                        type_mark=null;
                        acc=[];
                        result=null;
                        assembly=await compile((tokens && tokens["1"] && tokens["1"]["val"]),ctx);
                        has_lisp_globals=true;
                        result=["Environment",".","eval","(","await"," ","async"," ","function","()",["{","return"," ",assembly,"}","()",")"]];
                         return  result
                    }
                };
                compile_debug=async function(tokens,ctx) {
                     return  [{
                        ctype:"statement"
                    },"debugger",";"]
                };
                compile_for_each=async function(tokens,ctx) {
                     return  [{
                        ctype:"AsyncFunction"
                    },"await"," ","(","async"," ","function","()"," ","{",await compile_for_each_inner(tokens,ctx)," ","}",")","()"]
                };
                compile_for_each_inner=async function(tokens,ctx) {
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
                        let __array_op_rval__512=is_block_ques_;
                         if (__array_op_rval__512 instanceof Function){
                            return await __array_op_rval__512((for_body && for_body["val"])) 
                        } else {
                            return[__array_op_rval__512,(for_body && for_body["val"])]
                        }
                    })();
                    if (check_true ((iter_count<1))){
                        throw new SyntaxError("Invalid for_each arguments");
                        
                    };
                    await (async function() {
                        let __for_body__515=async function(iter_idx) {
                            (idx_iters).push(await (async function(){
                                let __targ__517=for_args;
                                if (__targ__517){
                                     return(__targ__517)[iter_idx]
                                } 
                            })());
                             return  await set_ctx(ctx,await clean_quoted_reference(await (async function(){
                                let __targ__518=await last(idx_iters);
                                if (__targ__518){
                                     return(__targ__518)["name"]
                                } 
                            })()),ArgumentType)
                        };
                        let __array__516=[],__elements__514=await (await Environment.get_global("range"))(iter_count);
                        let __BREAK__FLAG__=false;
                        for(let __iter__513 in __elements__514) {
                            __array__516.push(await __for_body__515(__elements__514[__iter__513]));
                            if(__BREAK__FLAG__) {
                                 __array__516.pop();
                                break;
                                
                            }
                        }return __array__516;
                         
                    })();
                    await set_ctx(ctx,collector_ref,ArgumentType);
                    await set_ctx(ctx,element_list,"arg");
                    if (check_true (await not(body_is_block_ques_))){
                         for_body=await make_do_block(for_body)
                    };
                    prebuild=await build_fn_with_assignment(body_function_ref,(for_body && for_body["val"]),idx_iters);
                    await async function(){
                        let __target_obj__519=ctx;
                        __target_obj__519["return_last_value"]=true;
                        return __target_obj__519;
                        
                    }();
                    (acc).push(await compile(prebuild,ctx));
                    await (async function() {
                        let __for_body__522=async function(t) {
                             return  (acc).push(t)
                        };
                        let __array__523=[],__elements__521=["let"," ",collector_ref,"=","[]",",",element_list,"=",await wrap_assignment_value(await compile(elements,ctx)),";"];
                        let __BREAK__FLAG__=false;
                        for(let __iter__520 in __elements__521) {
                            __array__523.push(await __for_body__522(__elements__521[__iter__520]));
                            if(__BREAK__FLAG__) {
                                 __array__523.pop();
                                break;
                                
                            }
                        }return __array__523;
                         
                    })();
                    await (async function() {
                        let __for_body__526=async function(t) {
                             return  (acc).push(t)
                        };
                        let __array__527=[],__elements__525=["let"," ",break_out,"=","false",";"];
                        let __BREAK__FLAG__=false;
                        for(let __iter__524 in __elements__525) {
                            __array__527.push(await __for_body__526(__elements__525[__iter__524]));
                            if(__BREAK__FLAG__) {
                                 __array__527.pop();
                                break;
                                
                            }
                        }return __array__527;
                         
                    })();
                    await set_ctx(ctx,body_function_ref,AsyncFunction);
                    await async function(){
                        if (check_true( (((for_args && for_args.length)===2)&&await not(((for_args && for_args["1"]) instanceof Array))))) {
                            await set_ctx(ctx,idx_iter,Number);
                            await (async function() {
                                let __for_body__530=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__531=[],__elements__529=["for","(","let"," ",idx_iter," ","in"," ",element_list,")"," ","{"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__528 in __elements__529) {
                                    __array__531.push(await __for_body__530(__elements__529[__iter__528]));
                                    if(__BREAK__FLAG__) {
                                         __array__531.pop();
                                        break;
                                        
                                    }
                                }return __array__531;
                                 
                            })();
                            await (async function() {
                                let __for_body__534=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__535=[],__elements__533=await (async function(){
                                    let __array_op_rval__536=collector_ref;
                                     if (__array_op_rval__536 instanceof Function){
                                        return await __array_op_rval__536(".","push","(","await"," ",body_function_ref,"(",element_list,"[",idx_iter,"]",")",")",";") 
                                    } else {
                                        return[__array_op_rval__536,".","push","(","await"," ",body_function_ref,"(",element_list,"[",idx_iter,"]",")",")",";"]
                                    }
                                })();
                                let __BREAK__FLAG__=false;
                                for(let __iter__532 in __elements__533) {
                                    __array__535.push(await __for_body__534(__elements__533[__iter__532]));
                                    if(__BREAK__FLAG__) {
                                         __array__535.pop();
                                        break;
                                        
                                    }
                                }return __array__535;
                                 
                            })();
                            await (async function() {
                                let __for_body__539=async function(t) {
                                     return  (acc).push(t)
                                };
                                let __array__540=[],__elements__538=["if","(",break_out,")"," ","{"," ",collector_ref,".","pop","()",";","break",";","}"];
                                let __BREAK__FLAG__=false;
                                for(let __iter__537 in __elements__538) {
                                    __array__540.push(await __for_body__539(__elements__538[__iter__537]));
                                    if(__BREAK__FLAG__) {
                                         __array__540.pop();
                                        break;
                                        
                                    }
                                }return __array__540;
                                 
                            })();
                             return  (acc).push("}")
                        }
                    }();
                    (acc).push("return");
                    (acc).push(" ");
                    (acc).push(collector_ref);
                    (acc).push(";");
                     return  acc
                };
                compile_while=async function(tokens,ctx) {
                    let acc;
                    let idx;
                    let test_condition;
                    let test_condition_ref;
                    let __body__541= async function(){
                        return (tokens && tokens["2"])
                    };
                    let body_ref;
                    let prebuild;
                    {
                        acc=[];
                        idx=0;
                        ctx=await new_ctx(ctx);
                        test_condition=(tokens && tokens["1"]);
                        test_condition_ref=await gen_temp_name("test_condition");
                        let body=await __body__541();
                        ;
                        body_ref=await gen_temp_name("body_ref");
                        prebuild=[];
                        await set_ctx(ctx,break_out,true);
                        if (check_true ((test_condition && test_condition["ref"]))){
                             (prebuild).push(await compile(await build_fn_with_assignment(test_condition_ref,(test_condition && test_condition["name"])),ctx))
                        } else {
                             (prebuild).push(await compile(await build_fn_with_assignment(test_condition_ref,(test_condition && test_condition["val"])),ctx))
                        };
                        (prebuild).push(await compile(await build_fn_with_assignment(body_ref,(body && body["val"])),ctx));
                        await (async function() {
                            let __for_body__544=async function(t) {
                                 return  (prebuild).push(t)
                            };
                            let __array__545=[],__elements__543=["let"," ",break_out,"=","false",";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__542 in __elements__543) {
                                __array__545.push(await __for_body__544(__elements__543[__iter__542]));
                                if(__BREAK__FLAG__) {
                                     __array__545.pop();
                                    break;
                                    
                                }
                            }return __array__545;
                             
                        })();
                        await (async function() {
                            let __for_body__548=async function(t) {
                                 return  (prebuild).push(t)
                            };
                            let __array__549=[],__elements__547=["while","(","await"," ",test_condition_ref,"()",")"," ","{","await"," ",body_ref,"()",";"," ","if","(",break_out,")"," ","{"," ","break",";","}","}"," ","",";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__546 in __elements__547) {
                                __array__549.push(await __for_body__548(__elements__547[__iter__546]));
                                if(__BREAK__FLAG__) {
                                     __array__549.pop();
                                    break;
                                    
                                }
                            }return __array__549;
                             
                        })();
                        await (async function() {
                            let __for_body__552=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__553=[],__elements__551=["await"," ","(","async"," ","function","()","{"," ",prebuild,"}",")","()"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__550 in __elements__551) {
                                __array__553.push(await __for_body__552(__elements__551[__iter__550]));
                                if(__BREAK__FLAG__) {
                                     __array__553.pop();
                                    break;
                                    
                                }
                            }return __array__553;
                             
                        })();
                         return  acc
                    }
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
                    await (async function(){
                        let __array_op_rval__554=declare_log;
                         if (__array_op_rval__554 instanceof Function){
                            return await __array_op_rval__554("->",await clone(expressions)) 
                        } else {
                            return[__array_op_rval__554,"->",await clone(expressions)]
                        }
                    })();
                    await (async function() {
                        let __for_body__557=async function(exp) {
                            declaration=(exp && exp["val"] && exp["val"]["0"] && exp["val"]["0"]["name"]);
                            targeted=await (await Environment.get_global("rest"))((exp && exp["val"]));
                            await (async function(){
                                let __array_op_rval__559=declare_log;
                                 if (__array_op_rval__559 instanceof Function){
                                    return await __array_op_rval__559("declaration: ",declaration,"targeted: ",await (await Environment.get_global("each"))(targeted,"name"),targeted) 
                                } else {
                                    return[__array_op_rval__559,"declaration: ",declaration,"targeted: ",await (await Environment.get_global("each"))(targeted,"name"),targeted]
                                }
                            })();
                             return  await async function(){
                                if (check_true( (declaration==="toplevel"))) {
                                    await async function(){
                                        let __target_obj__560=opts;
                                        __target_obj__560["root_environment"]=(targeted && targeted["0"]);
                                        return __target_obj__560;
                                        
                                    }();
                                    if (check_true ((opts && opts["root_environment"]))){
                                          return env_ref=""
                                    } else {
                                          return env_ref="Environment."
                                    }
                                } else if (check_true( (declaration==="include"))) {
                                     return  await (async function() {
                                        let __for_body__563=async function(name) {
                                            sanitized_name=await sanitize_js_ref_name(name);
                                            dec_struct=await get_declaration_details(ctx,name);
                                            await (async function ()  {
                                                let __array_arg__565=(async function() {
                                                    if (check_true ((dec_struct && dec_struct["value"]))){
                                                          return await (dec_struct && dec_struct["value"])["toString"]()
                                                    } else {
                                                          return "NOT FOUND"
                                                    }
                                                } );
                                                return await (async function(){
                                                    let __array_op_rval__566=declare_log;
                                                     if (__array_op_rval__566 instanceof Function){
                                                        return await __array_op_rval__566("current_declaration for ",name,": ",await __array_arg__565(),await clone(dec_struct)) 
                                                    } else {
                                                        return[__array_op_rval__566,"current_declaration for ",name,": ",await __array_arg__565(),await clone(dec_struct)]
                                                    }
                                                })()
                                            } )();
                                            if (check_true ((dec_struct))){
                                                await (async function() {
                                                    let __for_body__569=async function(t) {
                                                         return  (acc).push(t)
                                                    };
                                                    let __array__570=[],__elements__568=["let"," ",sanitized_name,"="];
                                                    let __BREAK__FLAG__=false;
                                                    for(let __iter__567 in __elements__568) {
                                                        __array__570.push(await __for_body__569(__elements__568[__iter__567]));
                                                        if(__BREAK__FLAG__) {
                                                             __array__570.pop();
                                                            break;
                                                            
                                                        }
                                                    }return __array__570;
                                                     
                                                })();
                                                await async function(){
                                                    if (check_true( ((dec_struct && dec_struct["value"]) instanceof Function&&await (async function(){
                                                        let __targ__572=await (async function(){
                                                            let __targ__571=(Environment && Environment["definitions"]);
                                                            if (__targ__571){
                                                                 return(__targ__571)[name]
                                                            } 
                                                        })();
                                                        if (__targ__572){
                                                             return(__targ__572)["fn_body"]
                                                        } 
                                                    })()))) {
                                                        details=await (async function(){
                                                            let __targ__573=(Environment && Environment["definitions"]);
                                                            if (__targ__573){
                                                                 return(__targ__573)[name]
                                                            } 
                                                        })();
                                                        source=("(fn "+(details && details["fn_args"])+" "+(details && details["fn_body"])+")");
                                                        await (async function(){
                                                            let __array_op_rval__574=declare_log;
                                                             if (__array_op_rval__574 instanceof Function){
                                                                return await __array_op_rval__574("source: ",source) 
                                                            } else {
                                                                return[__array_op_rval__574,"source: ",source]
                                                            }
                                                        })();
                                                        source=await compile(await tokenize(await (await Environment.get_global("read_lisp"))(source),ctx),ctx,1000);
                                                        await (async function(){
                                                            let __array_op_rval__575=declare_log;
                                                             if (__array_op_rval__575 instanceof Function){
                                                                return await __array_op_rval__575("compiled: ",source) 
                                                            } else {
                                                                return[__array_op_rval__575,"compiled: ",source]
                                                            }
                                                        })();
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
                                                }();
                                                 (acc).push(";")
                                            };
                                            await set_declaration(ctx,name,"inlined",true);
                                            if (check_true ((("undefined"===await (async function(){
                                                let __targ__576=await get_declarations(ctx,name);
                                                if (__targ__576){
                                                     return(__targ__576)["type"]
                                                } 
                                            })())&&(dec_struct && dec_struct["value"]) instanceof Function))){
                                                  return await set_declaration(ctx,name,"type",Function)
                                            }
                                        };
                                        let __array__564=[],__elements__562=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__561 in __elements__562) {
                                            __array__564.push(await __for_body__563(__elements__562[__iter__561]));
                                            if(__BREAK__FLAG__) {
                                                 __array__564.pop();
                                                break;
                                                
                                            }
                                        }return __array__564;
                                         
                                    })()
                                } else if (check_true( (declaration==="local"))) {
                                     return await (async function() {
                                        let __for_body__579=async function(name) {
                                            dec_struct=await get_declaration_details(ctx,name);
                                            await (async function(){
                                                let __array_op_rval__581=declare_log;
                                                 if (__array_op_rval__581 instanceof Function){
                                                    return await __array_op_rval__581("local: declaration_details: ",dec_struct) 
                                                } else {
                                                    return[__array_op_rval__581,"local: declaration_details: ",dec_struct]
                                                }
                                            })();
                                             return  await set_ctx(ctx,name,(dec_struct && dec_struct["value"]))
                                        };
                                        let __array__580=[],__elements__578=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__577 in __elements__578) {
                                            __array__580.push(await __for_body__579(__elements__578[__iter__577]));
                                            if(__BREAK__FLAG__) {
                                                 __array__580.pop();
                                                break;
                                                
                                            }
                                        }return __array__580;
                                         
                                    })()
                                } else if (check_true( (declaration==="function"))) {
                                     return  await (async function() {
                                        let __for_body__584=async function(name) {
                                             return  await set_declaration(ctx,name,"type",Function)
                                        };
                                        let __array__585=[],__elements__583=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__582 in __elements__583) {
                                            __array__585.push(await __for_body__584(__elements__583[__iter__582]));
                                            if(__BREAK__FLAG__) {
                                                 __array__585.pop();
                                                break;
                                                
                                            }
                                        }return __array__585;
                                         
                                    })()
                                } else if (check_true( (declaration==="array"))) {
                                     return  await (async function() {
                                        let __for_body__588=async function(name) {
                                             return  await set_declaration(ctx,name,"type",Array)
                                        };
                                        let __array__589=[],__elements__587=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__586 in __elements__587) {
                                            __array__589.push(await __for_body__588(__elements__587[__iter__586]));
                                            if(__BREAK__FLAG__) {
                                                 __array__589.pop();
                                                break;
                                                
                                            }
                                        }return __array__589;
                                         
                                    })()
                                } else if (check_true( (declaration==="number"))) {
                                     return  await (async function() {
                                        let __for_body__592=async function(name) {
                                             return  await set_declaration(ctx,name,"type",Number)
                                        };
                                        let __array__593=[],__elements__591=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__590 in __elements__591) {
                                            __array__593.push(await __for_body__592(__elements__591[__iter__590]));
                                            if(__BREAK__FLAG__) {
                                                 __array__593.pop();
                                                break;
                                                
                                            }
                                        }return __array__593;
                                         
                                    })()
                                } else if (check_true( (declaration==="string"))) {
                                     return  await (async function() {
                                        let __for_body__596=async function(name) {
                                             return  await set_declaration(ctx,name,"type",String)
                                        };
                                        let __array__597=[],__elements__595=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__594 in __elements__595) {
                                            __array__597.push(await __for_body__596(__elements__595[__iter__594]));
                                            if(__BREAK__FLAG__) {
                                                 __array__597.pop();
                                                break;
                                                
                                            }
                                        }return __array__597;
                                         
                                    })()
                                } else if (check_true( (declaration==="boolean"))) {
                                     return  await (async function() {
                                        let __for_body__600=async function(name) {
                                             return  await set_declaration(ctx,name,"type",Boolean)
                                        };
                                        let __array__601=[],__elements__599=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__598 in __elements__599) {
                                            __array__601.push(await __for_body__600(__elements__599[__iter__598]));
                                            if(__BREAK__FLAG__) {
                                                 __array__601.pop();
                                                break;
                                                
                                            }
                                        }return __array__601;
                                         
                                    })()
                                } else if (check_true( (declaration==="regexp"))) {
                                     return  await (async function() {
                                        let __for_body__604=async function(name) {
                                             return  await set_declaration(ctx,name,"type",RegExp)
                                        };
                                        let __array__605=[],__elements__603=await (await Environment.get_global("each"))(targeted,"name");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__602 in __elements__603) {
                                            __array__605.push(await __for_body__604(__elements__603[__iter__602]));
                                            if(__BREAK__FLAG__) {
                                                 __array__605.pop();
                                                break;
                                                
                                            }
                                        }return __array__605;
                                         
                                    })()
                                } else if (check_true( (declaration==="optimize"))) {
                                    await (async function(){
                                        let __array_op_rval__606=declare_log;
                                         if (__array_op_rval__606 instanceof Function){
                                            return await __array_op_rval__606("optimizations: ",targeted) 
                                        } else {
                                            return[__array_op_rval__606,"optimizations: ",targeted]
                                        }
                                    })();
                                     return  await (async function() {
                                        let __for_body__609=async function(factor) {
                                            await (async function(){
                                                let __array_op_rval__611=declare_log;
                                                 if (__array_op_rval__611 instanceof Function){
                                                    return await __array_op_rval__611("optimization: ",await (await Environment.get_global("each"))(factor,"name")) 
                                                } else {
                                                    return[__array_op_rval__611,"optimization: ",await (await Environment.get_global("each"))(factor,"name")]
                                                }
                                            })();
                                            factor=await (await Environment.get_global("each"))(factor,"name");
                                            await async function(){
                                                if (check_true( ((factor && factor["0"])==="safety"))) {
                                                     return await set_declaration(ctx,"__SAFETY__","level",(factor && factor["1"]))
                                                }
                                            }();
                                             return  await (async function(){
                                                let __array_op_rval__612=declare_log;
                                                 if (__array_op_rval__612 instanceof Function){
                                                    return await __array_op_rval__612("safety set: ",await safety_level(ctx)) 
                                                } else {
                                                    return[__array_op_rval__612,"safety set: ",await safety_level(ctx)]
                                                }
                                            })()
                                        };
                                        let __array__610=[],__elements__608=await (await Environment.get_global("each"))(targeted,"val");
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__607 in __elements__608) {
                                            __array__610.push(await __for_body__609(__elements__608[__iter__607]));
                                            if(__BREAK__FLAG__) {
                                                 __array__610.pop();
                                                break;
                                                
                                            }
                                        }return __array__610;
                                         
                                    })()
                                }
                            }()
                        };
                        let __array__558=[],__elements__556=expressions;
                        let __BREAK__FLAG__=false;
                        for(let __iter__555 in __elements__556) {
                            __array__558.push(await __for_body__557(__elements__556[__iter__555]));
                            if(__BREAK__FLAG__) {
                                 __array__558.pop();
                                break;
                                
                            }
                        }return __array__558;
                         
                    })();
                    await (async function(){
                        let __array_op_rval__613=declare_log;
                         if (__array_op_rval__613 instanceof Function){
                            return await __array_op_rval__613("<-",await clone(acc)) 
                        } else {
                            return[__array_op_rval__613,"<-",await clone(acc)]
                        }
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
                    }();
                    check_statement=async function(stmt) {
                        if (check_true (await check_needs_wrap(stmt))){
                            if (check_true (((stmt && stmt["0"] && stmt["0"]["ctype"])==="ifblock"))){
                                  return [{
                                    ctype:"AsyncFunction"
                                },"await"," ","(","async"," ","function","()"," ","{"," ",stmt," ","}"," ",")","()"]
                            } else {
                                  return [{
                                    ctype:"AsyncFunction"
                                },"await"," ","(","async"," ","function","()"," ",stmt," ",")","()"]
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
                    }();
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
                    }();
                    rval=await async function(){
                        if (check_true( (ref_type==="AsyncFunction"))) {
                            (acc).push("await");
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
                                 let __test_condition__614=async function() {
                                     return  (idx<((tokens && tokens.length)-1))
                                };
                                let __body_ref__615=async function() {
                                    idx+=1;
                                    token=await (async function(){
                                        let __targ__616=tokens;
                                        if (__targ__616){
                                             return(__targ__616)[idx]
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
                                while(await __test_condition__614()) {
                                    await __body_ref__615();
                                     if(__BREAK__FLAG__) {
                                         break;
                                        
                                    }
                                } ;
                                
                            })();
                            (acc).push(")");
                             return  acc
                        } else if (check_true( (ref_type==="Function"))) {
                            (acc).push("await");
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
                                 let __test_condition__617=async function() {
                                     return  (idx<((tokens && tokens.length)-1))
                                };
                                let __body_ref__618=async function() {
                                    idx+=1;
                                    token=await (async function(){
                                        let __targ__619=tokens;
                                        if (__targ__619){
                                             return(__targ__619)[idx]
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
                                while(await __test_condition__617()) {
                                    await __body_ref__618();
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
                                 let __test_condition__620=async function() {
                                     return  (idx<(tokens && tokens.length))
                                };
                                let __body_ref__621=async function() {
                                    token=await (async function(){
                                        let __targ__622=tokens;
                                        if (__targ__622){
                                             return(__targ__622)[idx]
                                        } 
                                    })();
                                    (acc).push(await compile(token,ctx));
                                    if (check_true ((idx<((tokens && tokens.length)-1)))){
                                         (acc).push(",")
                                    };
                                     return  idx+=1
                                };
                                let __BREAK__FLAG__=false;
                                while(await __test_condition__620()) {
                                    await __body_ref__621();
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
                    }();
                    if (check_true (false)){
                         await async function(){
                            if (check_true( ((ref_type==="AsyncFunction")||(ref_type==="Function")))) {
                                 return (acc).unshift({
                                    ctype:ref_type
                                })
                            }
                        }()
                    };
                     return  acc
                };
                compile_lisp_scoped_reference=async function(refname,ctx) {
                    let refval;
                    let reftype;
                    let declarations;
                    let basename;
                    refval=await get_lisp_ctx(refname);
                    reftype=await sub_type(refval);
                    declarations=null;
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
                        } else if (check_true( (refval&&await not((refval===undefined))))) {
                            has_lisp_globals=true;
                             return  [{
                                ctype:refval
                            },"(","await"," ",env_ref,"get_global","(\"",refname,"\")",")"]
                        } else  {
                            throw new ReferenceError(("unknown lisp reference: "+refname));
                            
                        }
                    }()
                };
                standard_types=["AbortController","AbortSignal","AggregateError","Array","ArrayBuffer","Atomics","BigInt","BigInt64Array","BigUint64Array","Blob","Boolean","ByteLengthQueuingStrategy","CloseEvent","CountQueuingStrategy","Crypto","CryptoKey","CustomEvent","DOMException","DataView","Date","Error","ErrorEvent","EvalError","Event","EventTarget","File","FileReader","FinalizationRegistry","Float32Array","Float64Array","FormData","Function","Headers",Infinity,"Int16Array","Int32Array","Int8Array","Intl","JSON","Location","Map","Math","MessageChannel","MessageEvent","MessagePort","NaN","Navigator","Number","Object","Performance","PerformanceEntry","PerformanceMark","PerformanceMeasure","ProgressEvent","Promise","Proxy","RangeError","ReadableByteStreamController","ReadableStream","ReadableStreamDefaultController","ReadableStreamDefaultReader","ReferenceError","Reflect","RegExp","Request","Response","Set","SharedArrayBuffer","Storage","String","SubtleCrypto","Symbol","SyntaxError","TextDecoder","TextDecoderStream","TextEncoder","TextEncoderStream","TransformStream","TypeError","URIError","URL","URLSearchParams","Uint16Array","Uint32Array","Uint8Array","Uint8ClampedArray","WeakMap","WeakRef","WeakSet","WebAssembly","WebSocket","Window","Worker","WritableStream","WritableStreamDefaultController","WritableStreamDefaultWriter","__defineGetter__","__defineSetter__","__lookupGetter__","__lookupSetter__","_error","addEventListener","alert","atob","btoa","clearInterval","clearTimeout","close","closed","confirm","console","constructor","crypto","decodeURI","decodeURIComponent","dispatchEvent","encodeURI","encodeURIComponent","escape","eval","fetch","getParent","globalThis","hasOwnProperty","isFinite","isNaN","isPrototypeOf","localStorage","location","navigator","null","onload","onunload","parseFloat","parseInt","performance","prompt","propertyIsEnumerable","queueMicrotask","removeEventListener","self","sessionStorage","setInterval","setTimeout","structuredClone","this","toLocaleString","toString","undefined","unescape","valueOf","window","AsyncFunction","Environment","Expression","get_next_environment_id","clone","subtype","lisp_writer","do_deferred_splice"];
                is_error=null;
                is_block_ques_=async function(tokens) {
                     return  (await contains_ques_((tokens && tokens["0"] && tokens["0"]["name"]),["do","progn"]))
                };
                is_complex_ques_=async function(tokens) {
                    let rval;
                    rval=(await (async function(){
                        let __array_op_rval__623=is_block_ques_;
                         if (__array_op_rval__623 instanceof Function){
                            return await __array_op_rval__623(tokens) 
                        } else {
                            return[__array_op_rval__623,tokens]
                        }
                    })()||(((tokens && tokens["type"])==="arr")&&await (async function(){
                        let __array_op_rval__624=is_block_ques_;
                         if (__array_op_rval__624 instanceof Function){
                            return await __array_op_rval__624((tokens && tokens["val"])) 
                        } else {
                            return[__array_op_rval__624,(tokens && tokens["val"])]
                        }
                    })())||((tokens && tokens["val"] && tokens["val"]["0"] && tokens["val"]["0"]["name"])==="if")||((tokens && tokens["val"] && tokens["val"]["0"] && tokens["val"]["0"]["name"])==="let"));
                     return  rval
                };
                is_form_ques_=async function(token) {
                     return  (((token && token["val"]) instanceof Array)||await (async function(){
                        let __array_op_rval__625=is_block_ques_;
                         if (__array_op_rval__625 instanceof Function){
                            return await __array_op_rval__625((token && token["val"])) 
                        } else {
                            return[__array_op_rval__625,(token && token["val"])]
                        }
                    })())
                };
                op_lookup=await ( async function(){
                    let __obj__626=new Object();
                    __obj__626["+"]=infix_ops;
                    __obj__626["*"]=infix_ops;
                    __obj__626["/"]=infix_ops;
                    __obj__626["-"]=infix_ops;
                    __obj__626["**"]=infix_ops;
                    __obj__626["%"]=infix_ops;
                    __obj__626["<<"]=infix_ops;
                    __obj__626[">>"]=infix_ops;
                    __obj__626["and"]=infix_ops;
                    __obj__626["or"]=infix_ops;
                    __obj__626["apply"]=compile_apply;
                    __obj__626["call"]=compile_call;
                    __obj__626["->"]=compile_call;
                    __obj__626["set_prop"]=compile_set_prop;
                    __obj__626["prop"]=compile_prop;
                    __obj__626["="]=compile_assignment;
                    __obj__626["setq"]=compile_assignment;
                    __obj__626["=="]=compile_compare;
                    __obj__626["eq"]=compile_compare;
                    __obj__626[">"]=compile_compare;
                    __obj__626["<"]=compile_compare;
                    __obj__626["<="]=compile_compare;
                    __obj__626[">="]=compile_compare;
                    __obj__626["return"]=compile_return;
                    __obj__626["new"]=compile_new;
                    __obj__626["do"]=compile_block;
                    __obj__626["progn"]=compile_block;
                    __obj__626["progl"]=async function(tokens,ctx) {
                         return  await compile_block(tokens,ctx,{
                            no_scope_boundary:true,suppress_return:"true"
                        })
                    };
                    __obj__626["break"]=compile_break;
                    __obj__626["inc"]=compile_val_mod;
                    __obj__626["dec"]=compile_val_mod;
                    __obj__626["try"]=compile_try;
                    __obj__626["throw"]=compile_throw;
                    __obj__626["let"]=compile_let;
                    __obj__626["defvar"]=compile_defvar;
                    __obj__626["while"]=compile_while;
                    __obj__626["for_each"]=compile_for_each;
                    __obj__626["if"]=compile_if;
                    __obj__626["cond"]=compile_cond;
                    __obj__626["fn"]=compile_fn;
                    __obj__626["lambda"]=compile_fn;
                    __obj__626["defglobal"]=compile_set_global;
                    __obj__626["list"]=compile_list;
                    __obj__626["function"]=async function(tokens,ctx) {
                         return  await compile_fn(tokens,ctx,{
                            synchronous:true
                        })
                    };
                    __obj__626["=>"]=async function(tokens,ctx) {
                         return  await compile_fn(tokens,ctx,{
                            arrow:true
                        })
                    };
                    __obj__626["quotem"]=compile_quotem;
                    __obj__626["quote"]=compile_quote;
                    __obj__626["quotel"]=compile_quotel;
                    __obj__626["evalq"]=compile_evalq;
                    __obj__626["eval"]=compile_eval;
                    __obj__626["jslambda"]=compile_jslambda;
                    __obj__626["javascript"]=compile_javascript;
                    __obj__626["instanceof"]=compile_instanceof;
                    __obj__626["typeof"]=compile_typeof;
                    __obj__626["unquotem"]=compile_unquotem;
                    __obj__626["debug"]=compile_debug;
                    __obj__626["declare"]=compile_declare;
                    __obj__626["import"]=compile_import;
                    __obj__626["dynamic_import"]=compile_dynamic_import;
                    return __obj__626;
                    
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
                    key=null;
                    tmp_name=null;
                    ctx=await new_ctx(ctx);
                    check_statement=async function(stmt) {
                        if (check_true (await check_needs_wrap(stmt))){
                            if (check_true (((stmt && stmt["0"] && stmt["0"]["ctype"])==="ifblock"))){
                                  return [{
                                    ctype:"AsyncFunction",marker:"ifblock"
                                },"await"," ","(","async"," ","function","()"," ","{",stmt,"}"," ",")","()"]
                            } else {
                                  return [{
                                    ctype:"AsyncFunction"
                                },"await"," ","(","async"," ","function","()"," ",stmt," ",")","()"]
                            }
                        } else {
                              return stmt
                        }
                    };
                    kvpair=null;
                    total_length=((tokens && tokens["val"] && tokens["val"]["length"])-1);
                    await async function(){
                        let __target_obj__627=ctx;
                        __target_obj__627["in_obj_literal"]=true;
                        return __target_obj__627;
                        
                    }();
                    await (async function() {
                        let __for_body__630=async function(token) {
                            if (check_true ((((token && token["type"])==="keyval")&&await check_invalid_js_ref((token && token.name))))){
                                has_valid_key_literals=false;
                                __BREAK__FLAG__=true;
                                return
                            }
                        };
                        let __array__631=[],__elements__629=((tokens && tokens["val"])||[]);
                        let __BREAK__FLAG__=false;
                        for(let __iter__628 in __elements__629) {
                            __array__631.push(await __for_body__630(__elements__629[__iter__628]));
                            if(__BREAK__FLAG__) {
                                 __array__631.pop();
                                break;
                                
                            }
                        }return __array__631;
                         
                    })();
                    if (check_true (has_valid_key_literals)){
                         if (check_true (((tokens && tokens["val"] && tokens["val"]["name"])==="{}"))){
                              return [{
                                ctype:"objliteral"
                            },"new Object()"]
                        } else {
                            (acc).push("{");
                            await (async function(){
                                 let __test_condition__632=async function() {
                                     return  (idx<total_length)
                                };
                                let __body_ref__633=async function() {
                                    idx+=1;
                                    kvpair=await (async function(){
                                        let __targ__634=(tokens && tokens["val"]);
                                        if (__targ__634){
                                             return(__targ__634)[idx]
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
                                while(await __test_condition__632()) {
                                    await __body_ref__633();
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
                            let __for_body__637=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__638=[],__elements__636=[{
                                ctype:"statement"
                            },"await"," ","("," ","async"," ","function","()","{","let"," ",tmp_name,"=","new"," ","Object","()",";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__635 in __elements__636) {
                                __array__638.push(await __for_body__637(__elements__636[__iter__635]));
                                if(__BREAK__FLAG__) {
                                     __array__638.pop();
                                    break;
                                    
                                }
                            }return __array__638;
                             
                        })();
                        await (async function(){
                             let __test_condition__639=async function() {
                                 return  (idx<total_length)
                            };
                            let __body_ref__640=async function() {
                                idx+=1;
                                kvpair=await (async function(){
                                    let __targ__641=(tokens && tokens["val"]);
                                    if (__targ__641){
                                         return(__targ__641)[idx]
                                    } 
                                })();
                                 return  await (async function() {
                                    let __for_body__644=async function(t) {
                                         return  (acc).push(t)
                                    };
                                    let __array__645=[],__elements__643=await (async function(){
                                        let __array_op_rval__646=tmp_name;
                                         if (__array_op_rval__646 instanceof Function){
                                            return await __array_op_rval__646("[","\"",await cl_encode_string(await get_val((kvpair && kvpair["val"] && kvpair["val"]["0"]),ctx)),"\"","]","=",await compile_elem((kvpair && kvpair["val"] && kvpair["val"]["1"]),ctx),";") 
                                        } else {
                                            return[__array_op_rval__646,"[","\"",await cl_encode_string(await get_val((kvpair && kvpair["val"] && kvpair["val"]["0"]),ctx)),"\"","]","=",await compile_elem((kvpair && kvpair["val"] && kvpair["val"]["1"]),ctx),";"]
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
                                     
                                })()
                            };
                            let __BREAK__FLAG__=false;
                            while(await __test_condition__639()) {
                                await __body_ref__640();
                                 if(__BREAK__FLAG__) {
                                     break;
                                    
                                }
                            } ;
                            
                        })();
                        await (async function() {
                            let __for_body__649=async function(t) {
                                 return  (acc).push(t)
                            };
                            let __array__650=[],__elements__648=["return"," ",tmp_name,";","}",")","()"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__647 in __elements__648) {
                                __array__650.push(await __for_body__649(__elements__648[__iter__647]));
                                if(__BREAK__FLAG__) {
                                     __array__650.pop();
                                    break;
                                    
                                }
                            }return __array__650;
                             
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
                    let tmp_name;
                    let refval;
                    let check_statement;
                    let ref;
                    operator_type=null;
                    op_token=null;
                    rcv=null;
                    _cdepth=(_cdepth||100);
                    acc=[];
                    tmp_name=null;
                    refval=null;
                    check_statement=async function(stmt) {
                        if (check_true (await check_needs_wrap(stmt))){
                            if (check_true (((stmt && stmt["0"] && stmt["0"]["ctype"])==="ifblock"))){
                                  return [{
                                    ctype:"AsyncFunction",marker:"ifblock"
                                },"await"," ","(","async"," ","function","()"," ","{",stmt,"}"," ",")","()"]
                            } else {
                                  return [{
                                    ctype:"AsyncFunction"
                                },"await"," ","(","async"," ","function","()"," ",stmt," ",")","()"]
                            }
                        } else {
                              return stmt
                        }
                    };
                    ref=null;
                    await async function(){
                        let __target_obj__654=ctx;
                        __target_obj__654["source"]=await async function(){
                            if (check_true((tokens && tokens["source"]))) {
                                 return (tokens && tokens["source"])
                            } else if (check_true((tokens && tokens["0"] && tokens["0"]["source"]))) {
                                 return (tokens && tokens["0"] && tokens["0"]["source"])
                            } else if (check_true((tokens && tokens["1"] && tokens["1"]["source"]))) {
                                 return (tokens && tokens["1"] && tokens["1"]["source"])
                            } else  {
                                 return (ctx && ctx["source"])
                            }
                        }();
                        return __target_obj__654;
                        
                    }();
                     return  await (async function(){
                        try /* TRY SIMPLE */ {
                             if (check_true ((null==ctx))){
                                await (async function(){
                                    let __array_op_rval__656=error_log;
                                     if (__array_op_rval__656 instanceof Function){
                                        return await __array_op_rval__656("compile: nil ctx: ",tokens) 
                                    } else {
                                        return[__array_op_rval__656,"compile: nil ctx: ",tokens]
                                    }
                                })();
                                throw new Error("compile: nil ctx");
                                
                            } else {
                                  return await async function(){
                                    if (check_true( (await is_number_ques_(tokens)||(tokens instanceof String || typeof tokens==='string')||(await sub_type(tokens)==="Boolean")))) {
                                         return tokens
                                    } else if (check_true( ((tokens instanceof Array)&&(tokens && tokens["0"] && tokens["0"]["ref"])&&await not((await get_ctx(ctx,(tokens && tokens["0"] && tokens["0"]["name"]))===UnknownType))&&(await (async function(){
                                        let __targ__657=op_lookup;
                                        if (__targ__657){
                                             return(__targ__657)[(tokens && tokens["0"] && tokens["0"]["name"])]
                                        } 
                                    })()||(Function===await get_ctx(ctx,(tokens && tokens["0"] && tokens["0"]["name"])))||(AsyncFunction===await get_ctx(ctx,(tokens && tokens["0"] && tokens["0"]["name"])))||("function"===typeof await (async function(){
                                        let __targ__658=(root_ctx && root_ctx["defined_lisp_globals"]);
                                        if (__targ__658){
                                             return(__targ__658)[(tokens && tokens["0"] && tokens["0"]["name"])]
                                        } 
                                    })())||await get_lisp_ctx((tokens && tokens["0"] && tokens["0"]["name"])) instanceof Function)))) {
                                        op_token=await first(tokens);
                                        operator=await (async function(){
                                            let __targ__659=op_token;
                                            if (__targ__659){
                                                 return(__targ__659)["name"]
                                            } 
                                        })();
                                        operator_type=await (async function(){
                                            let __targ__660=op_token;
                                            if (__targ__660){
                                                 return(__targ__660)["val"]
                                            } 
                                        })();
                                        ref=await (async function(){
                                            let __targ__661=op_token;
                                            if (__targ__661){
                                                 return(__targ__661)["ref"]
                                            } 
                                        })();
                                        op=await (async function(){
                                            let __targ__662=op_lookup;
                                            if (__targ__662){
                                                 return(__targ__662)[operator]
                                            } 
                                        })();
                                         return  await async function(){
                                            if (check_true(op)) {
                                                 return await (async function(){
                                                    let __array_op_rval__663=op;
                                                     if (__array_op_rval__663 instanceof Function){
                                                        return await __array_op_rval__663(tokens,ctx) 
                                                    } else {
                                                        return[__array_op_rval__663,tokens,ctx]
                                                    }
                                                })()
                                            } else if (check_true( await (async function(){
                                                let __targ__664=(Environment && Environment["inlines"]);
                                                if (__targ__664){
                                                     return(__targ__664)[operator]
                                                } 
                                            })())) {
                                                 return await compile_inline(tokens,ctx)
                                            } else  {
                                                 return await compile_scoped_reference(tokens,ctx)
                                            }
                                        }()
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
                                                    let __for_body__667=async function(t) {
                                                        if (check_true (await not(await get_ctx_val(ctx,"__IN_LAMBDA__")))){
                                                             await set_ctx(ctx,"__LAMBDA_STEP__",0)
                                                        };
                                                         return  (compiled_values).push(await compile(t,ctx,await add(_cdepth,1)))
                                                    };
                                                    let __array__668=[],__elements__666=await (await Environment.get_global("rest"))(tokens);
                                                    let __BREAK__FLAG__=false;
                                                    for(let __iter__665 in __elements__666) {
                                                        __array__668.push(await __for_body__667(__elements__666[__iter__665]));
                                                        if(__BREAK__FLAG__) {
                                                             __array__668.pop();
                                                            break;
                                                            
                                                        }
                                                    }return __array__668;
                                                     
                                                })();
                                                await map(async function(compiled_element,idx) {
                                                    let inst;
                                                    inst=await (async function () {
                                                         if (check_true ((((compiled_element && compiled_element["0"]) instanceof Object)&&await (async function(){
                                                            let __targ__669=(compiled_element && compiled_element["0"]);
                                                            if (__targ__669){
                                                                 return(__targ__669)["ctype"]
                                                            } 
                                                        })()))){
                                                              return await (async function(){
                                                                let __targ__670=(compiled_element && compiled_element["0"]);
                                                                if (__targ__670){
                                                                     return(__targ__670)["ctype"]
                                                                } 
                                                            })()
                                                        } else {
                                                              return null
                                                        } 
                                                    })();
                                                     return  await async function(){
                                                        if (check_true( ((inst==="block")||(inst==="letblock")))) {
                                                             return  (symbolic_replacements).push(await (async function(){
                                                                let __array_op_rval__671=idx;
                                                                 if (__array_op_rval__671 instanceof Function){
                                                                    return await __array_op_rval__671(await gen_temp_name("array_arg"),[{
                                                                        ctype:"AsyncFunction"
                                                                    },"(","async"," ","function","()"," ",compiled_element," ",")"]) 
                                                                } else {
                                                                    return[__array_op_rval__671,await gen_temp_name("array_arg"),[{
                                                                        ctype:"AsyncFunction"
                                                                    },"(","async"," ","function","()"," ",compiled_element," ",")"]]
                                                                }
                                                            })())
                                                        } else if (check_true( (inst==="ifblock"))) {
                                                             return  (symbolic_replacements).push(await (async function(){
                                                                let __array_op_rval__672=idx;
                                                                 if (__array_op_rval__672 instanceof Function){
                                                                    return await __array_op_rval__672(await gen_temp_name("array_arg"),[{
                                                                        ctype:"AsyncFunction"
                                                                    },"(","async"," ","function","()"," ","{",compiled_element,"}"," ",")"]) 
                                                                } else {
                                                                    return[__array_op_rval__672,await gen_temp_name("array_arg"),[{
                                                                        ctype:"AsyncFunction"
                                                                    },"(","async"," ","function","()"," ","{",compiled_element,"}"," ",")"]]
                                                                }
                                                            })())
                                                        }
                                                    }()
                                                },compiled_values);
                                                await (async function() {
                                                    let __for_body__675=async function(elem) {
                                                        await (async function() {
                                                            let __for_body__679=async function(t) {
                                                                 return  (acc).push(t)
                                                            };
                                                            let __array__680=[],__elements__678=["let"," ",(elem && elem["1"]),"=",(elem && elem["2"]),";"];
                                                            let __BREAK__FLAG__=false;
                                                            for(let __iter__677 in __elements__678) {
                                                                __array__680.push(await __for_body__679(__elements__678[__iter__677]));
                                                                if(__BREAK__FLAG__) {
                                                                     __array__680.pop();
                                                                    break;
                                                                    
                                                                }
                                                            }return __array__680;
                                                             
                                                        })();
                                                         return  await compiled_values["splice"].call(compiled_values,(elem && elem["0"]),1,["await"," ",(elem && elem["1"]),"()"])
                                                    };
                                                    let __array__676=[],__elements__674=symbolic_replacements;
                                                    let __BREAK__FLAG__=false;
                                                    for(let __iter__673 in __elements__674) {
                                                        __array__676.push(await __for_body__675(__elements__674[__iter__673]));
                                                        if(__BREAK__FLAG__) {
                                                             __array__676.pop();
                                                            break;
                                                            
                                                        }
                                                    }return __array__676;
                                                     
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
                                                            let __for_body__683=async function(t) {
                                                                 return  (acc).push(t)
                                                            };
                                                            let __array__684=[],__elements__682=["(",rcv,")","("];
                                                            let __BREAK__FLAG__=false;
                                                            for(let __iter__681 in __elements__682) {
                                                                __array__684.push(await __for_body__683(__elements__682[__iter__681]));
                                                                if(__BREAK__FLAG__) {
                                                                     __array__684.pop();
                                                                    break;
                                                                    
                                                                }
                                                            }return __array__684;
                                                             
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
                                                            let __for_body__687=async function(t) {
                                                                 return  (acc).push(t)
                                                            };
                                                            let __array__688=[],__elements__686=["await"," ","(","async"," ","function","()","{","let"," ",tmp_name,"=",rcv,";"," ","if"," ","(",tmp_name," ","instanceof"," ","Function",")","{","return"," ","await"," ",tmp_name,"("];
                                                            let __BREAK__FLAG__=false;
                                                            for(let __iter__685 in __elements__686) {
                                                                __array__688.push(await __for_body__687(__elements__686[__iter__685]));
                                                                if(__BREAK__FLAG__) {
                                                                     __array__688.pop();
                                                                    break;
                                                                    
                                                                }
                                                            }return __array__688;
                                                             
                                                        })();
                                                        await push_as_arg_list(acc,compiled_values);
                                                        await (async function() {
                                                            let __for_body__691=async function(t) {
                                                                 return  (acc).push(t)
                                                            };
                                                            let __array__692=[],__elements__690=[")"," ","}"," ","else"," ","{","return","[",tmp_name];
                                                            let __BREAK__FLAG__=false;
                                                            for(let __iter__689 in __elements__690) {
                                                                __array__692.push(await __for_body__691(__elements__690[__iter__689]));
                                                                if(__BREAK__FLAG__) {
                                                                     __array__692.pop();
                                                                    break;
                                                                    
                                                                }
                                                            }return __array__692;
                                                             
                                                        })();
                                                        if (check_true ((await length(await (await Environment.get_global("rest"))(tokens))>0))){
                                                            (acc).push(",");
                                                             await push_as_arg_list(acc,compiled_values)
                                                        };
                                                         return  await (async function() {
                                                            let __for_body__695=async function(t) {
                                                                 return  (acc).push(t)
                                                            };
                                                            let __array__696=[],__elements__694=["]","}","}",")","()"];
                                                            let __BREAK__FLAG__=false;
                                                            for(let __iter__693 in __elements__694) {
                                                                __array__696.push(await __for_body__695(__elements__694[__iter__693]));
                                                                if(__BREAK__FLAG__) {
                                                                     __array__696.pop();
                                                                    break;
                                                                    
                                                                }
                                                            }return __array__696;
                                                             
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
                                                }();
                                                if (check_true (((symbolic_replacements && symbolic_replacements.length)>0))){
                                                     (acc).push("}")
                                                };
                                                 return  acc
                                            }
                                        }()
                                    } else if (check_true( ((tokens instanceof Object)&&((tokens && tokens["val"]) instanceof Array)&&(tokens && tokens["type"])))) {
                                        await async function(){
                                            let __target_obj__697=ctx;
                                            __target_obj__697["source"]=(tokens && tokens["source"]);
                                            return __target_obj__697;
                                            
                                        }();
                                        rcv=await compile((tokens && tokens["val"]),ctx,await add(_cdepth,1));
                                         return  rcv
                                    } else if (check_true( (((tokens instanceof Object)&&await (await Environment.get_global("check_true"))((tokens && tokens["val"]))&&(tokens && tokens["type"]))||((tokens && tokens["type"])==="literal")||((tokens && tokens["type"])==="arg")||((tokens && tokens["type"])==="null")))) {
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
                                            } else if (check_true( ((tokens && tokens["ref"])&&await (async function(){
                                                let __targ__698=op_lookup;
                                                if (__targ__698){
                                                     return(__targ__698)[(tokens && tokens.name)]
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
                                                }()
                                            } else if (check_true( await get_lisp_ctx((tokens && tokens.name)))) {
                                                 return await compile_lisp_scoped_reference((tokens && tokens.name),ctx)
                                            } else  {
                                                throw new ReferenceError(("compile: unknown reference: "+(tokens && tokens.name)));
                                                
                                            }
                                        }()
                                    } else  {
                                        throw new SyntaxError("compile passed invalid compilation structure");
                                        
                                    }
                                }()
                            } 
                        } catch(__exception__655) {
                              if (__exception__655 instanceof Error) {
                                 let e=__exception__655;
                                 {
                                    is_error={
                                        error:(e && e.name),message:(e && e.message),form:(ctx && ctx["source"]),parent_forms:await get_source_chain(ctx),invalid:true,text:await (await Environment.get_global("as_lisp"))(await (async function() {
                                             if (check_true ((tokens instanceof Array))){
                                                  return await map(async function(v) {
                                                     return  (v && v["val"])
                                                },tokens)
                                            } else {
                                                  return (tokens && tokens["val"])
                                            } 
                                        } )())
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
                            prefix:"compiler:",background:"darkblue",color:"white"
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
                        }()
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
                                }()
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
                         return  (text).join("")
                    }
                };
                ;
                if (check_true ((null==Environment)))throw new Error("Compiler: No environment passed in options.");
                ;
                await set_ctx(root_ctx,break_out,false);
                await async function(){
                    let __target_obj__708=root_ctx;
                    __target_obj__708["defined_lisp_globals"]=new Object();
                    return __target_obj__708;
                    
                }();
                await set_ctx(root_ctx,"__LAMBDA_STEP__",-1);
                output=await async function(){
                    if (check_true((opts && opts["only_tokens"]))) {
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
                            if (check_true(is_error)) {
                                 return is_error
                            } else if (check_true( (null==final_token_assembly))) {
                                is_error=new EvalError("Pre-Compilation Error");
                                 return  is_error
                            } else  {
                                if (check_true (((await Environment.get_global("DEBUG_LEVEL"))>3))){
                                     await (async function(){
                                        let __array_op_rval__710=main_log;
                                         if (__array_op_rval__710 instanceof Function){
                                            return await __array_op_rval__710("input tokens: ",await clone(final_token_assembly)) 
                                        } else {
                                            return[__array_op_rval__710,"input tokens: ",await clone(final_token_assembly)]
                                        }
                                    })()
                                };
                                assembly=await compile(final_token_assembly,root_ctx,0);
                                assembly=await (await Environment.get_global("splice_in_return_a"))(assembly);
                                 return  assembly=await (await Environment.get_global("splice_in_return_b"))(assembly)
                            }
                        }();
                        if (check_true ((opts && opts["root_environment"]))){
                             has_lisp_globals=false
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
                            }
                        }();
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
                }();
                if (check_true ((opts && opts["error_report"]))){
                     await (async function(){
                        let __array_op_rval__716=(opts && opts["error_report"]);
                         if (__array_op_rval__716 instanceof Function){
                            return await __array_op_rval__716(errors) 
                        } else {
                            return[__array_op_rval__716,errors]
                        }
                    })()
                };
                 return  output
            }
        }
    }
})
}


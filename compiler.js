var { get_next_environment_id, check_true, get_outside_global, subtype, lisp_writer, clone } = await import("./lisp_writer.js");

export async function init_compiler(Environment) {
    await Environment.set_global("compiler",async function(quoted_lisp,opts) {
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
	let do_deferred_splice=async function(tree) {
            let rval;
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
			let __test_condition__1=async function() {
                            return  (idx<(tree && tree.length))
			};
			let __body_ref__2=async function() {
                            tval=await (async function(){
				let __targ__3=tree;
				if (__targ__3){
                                    return(__targ__3)[idx]
				} 
                            })();
                            if (check_true ((tval===deferred_operator))){
				idx+=1;
				tval=await (async function(){
                                    let __targ__4=tree;
                                    if (__targ__4){
					return(__targ__4)[idx]
                                    } 
				})();
				rval=await rval["concat"].call(rval,await do_deferred_splice(tval))
                            } else {
				(rval).push(await do_deferred_splice(tval))
                            };
                            return  idx+=1
			};
			let __BREAK__FLAG__=false;
			while(await __test_condition__1()) {
                            await __body_ref__2();
                            if(__BREAK__FLAG__) {
				break;
				
                            }
			} ;
			
                    })();
                    return  rval
		} else if (check_true( (tree instanceof Object))) {
                    rval=new Object();
                    await (async function() {
			let __for_body__7=async function(pset) {
                            return  await async function(){
				let __target_obj__9=rval;
				__target_obj__9[(pset && pset["0"])]=await do_deferred_splice((pset && pset["1"]));
				return __target_obj__9;
				
                            }()
			};
			let __array__8=[],__elements__6=(await Environment.get_global("pairs"))(tree);
			let __BREAK__FLAG__=false;
			for(let __iter__5 in __elements__6) {
                            __array__8.push(await __for_body__7(__elements__6[__iter__5]));
                            if(__BREAK__FLAG__) {
				__array__8.pop();
				break;
				
                            }
			}return __array__8;
			
                    })();
                    return  rval
		} else  {
                    return tree
		}
            }()
	};
	let not=function anonymous(x) {
	    { if (x) { return false } else { return true } }
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
	let tree;
	let op;
	let __Environment__10= async function(){
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
	let __log__11= async function(){
            return console.log
	};
	let __defclog__12= async function(){
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
			let __target_arg__16=[].concat((await Environment.get_global("conj"))(await (async function(){
                            let __array_op_rval__17=style;
                            if (__array_op_rval__17 instanceof Function){
				return await __array_op_rval__17() 
                            } else {
				return[__array_op_rval__17]
                            }
			})(),args));
			if(!__target_arg__16 instanceof Array){
                            throw new TypeError("Invalid final argument to apply - an array is required")
			}let __pre_arg__18=("%c"+await (async function () {
                            if (check_true ((opts && opts["prefix"]))){
				return (opts && opts["prefix"])
                            } else {
				return (args).shift()
                            } 
			})());
			__target_arg__16.unshift(__pre_arg__18);
			return (console.log).apply(this,__target_arg__16)
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
	let check_needs_wrap;
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
	let __compile__13= async function(){
            return async function(tokens,ctx,_cdepth) {
		if (check_true (is_error)){
                    return is_error
		} else {
                    let rval=await compile_inner(tokens,ctx,_cdepth);
                    ;
                    if (check_true (false)){
			if (check_true (((rval instanceof Array)&&((rval && rval["0"]) instanceof Object)&&await (async function(){
                            let __targ__643=(rval && rval["0"]);
                            if (__targ__643){
				return(__targ__643)["ctype"]
                            } 
			})()))){
                            await (async function(){
				let __array_op_rval__644=comp_log;
				if (__array_op_rval__644 instanceof Function){
                                    return await __array_op_rval__644(("compile:"+_cdepth+" <- "),"return type: ",(await Environment.get_global("as_lisp"))((rval && rval["0"]))) 
				} else {
                                    return[__array_op_rval__644,("compile:"+_cdepth+" <- "),"return type: ",(await Environment.get_global("as_lisp"))((rval && rval["0"]))]
				}
                            })()
			} else {
                            await (async function(){
				let __array_op_rval__645=comp_warn;
				if (__array_op_rval__645 instanceof Function){
                                    return await __array_op_rval__645("<-",_cdepth,"unknown/undeclared type returned: ",clone(rval)) 
				} else {
                                    return[__array_op_rval__645,"<-",_cdepth,"unknown/undeclared type returned: ",clone(rval)]
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
            let Environment=await __Environment__10();
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
            let log=await __log__11();
            ;
            let defclog=await __defclog__12();
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
                    let __target_obj__19=new Object();
                    __target_obj__19["ctype"]=type;
                    __target_obj__19["args"]=[];
                    return __target_obj__19;
                    
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
		tmp_template=clone(temp_fn_asn_template);
		await async function(){
                    let __target_obj__20=(tmp_template && tmp_template["1"]);
                    __target_obj__20["name"]=tmp_var_name;
                    __target_obj__20["val"]=tmp_var_name;
                    return __target_obj__20;
                    
		}();
		if (check_true ((args instanceof Array))){
                    await async function(){
			let __target_obj__21=(tmp_template && tmp_template["2"] && tmp_template["2"]["val"] && tmp_template["2"]["val"]["1"]);
			__target_obj__21["val"]=args;
			return __target_obj__21;
			
                    }()
		};
		await async function(){
                    let __target_obj__22=(tmp_template && tmp_template["2"] && tmp_template["2"]["val"] && tmp_template["2"]["val"]["2"]);
                    __target_obj__22["val"]=body;
                    return __target_obj__22;
                    
		}();
		return  tmp_template
            };
            build_anon_fn=async function(body,args) {
		let tmp_template;
		tmp_template=clone(anon_fn_template);
		if (check_true ((args instanceof Array))){
                    await async function(){
			let __target_obj__23=(tmp_template && tmp_template["0"] && tmp_template["0"]["val"] && tmp_template["0"]["val"]["1"]);
			__target_obj__23["val"]=args;
			return __target_obj__23;
			
                    }()
		};
		await async function(){
                    let __target_obj__24=(tmp_template && tmp_template["0"] && tmp_template["0"]["val"] && tmp_template["0"]["val"]["2"]);
                    __target_obj__24["val"]=body;
                    return __target_obj__24;
                    
		}();
		return  tmp_template
            };
            referenced_global_symbols=new Object();
            new_ctx=async function(parent) {
		let ctx_obj;
		ctx_obj=new Object();
		await async function(){
                    let __target_obj__25=ctx_obj;
                    __target_obj__25["scope"]=new Object();
                    __target_obj__25["source"]="";
                    __target_obj__25["parent"]=parent;
                    __target_obj__25["ambiguous"]=new Object();
                    __target_obj__25["declared_types"]=new Object();
                    __target_obj__25["defs"]=[];
                    return __target_obj__25;
                    
		}();
		if (check_true (parent)){
                    if (check_true ((parent && parent["source"]))){
			await async function(){
                            let __target_obj__26=ctx_obj;
                            __target_obj__26["source"]=(parent && parent["source"]);
                            return __target_obj__26;
                            
			}()
                    };
                    if (check_true ((parent && parent["defvar_eval"]))){
			await async function(){
                            let __target_obj__27=ctx_obj;
                            __target_obj__27["defvar_eval"]=true;
                            return __target_obj__27;
                            
			}()
                    };
                    if (check_true ((parent && parent["hard_quote_mode"]))){
			await async function(){
                            let __target_obj__28=ctx_obj;
                            __target_obj__28["hard_quote_mode"]=true;
                            return __target_obj__28;
                            
			}()
                    };
                    if (check_true ((parent && parent["block_step"]))){
			await async function(){
                            let __target_obj__29=ctx_obj;
                            __target_obj__29["block_step"]=(parent && parent["block_step"]);
                            return __target_obj__29;
                            
			}()
                    };
                    if (check_true ((parent && parent["block_id"]))){
			await async function(){
                            let __target_obj__30=ctx_obj;
                            __target_obj__30["block_id"]=(parent && parent["block_id"]);
                            return __target_obj__30;
                            
			}()
                    };
                    if (check_true ((parent && parent["suppress_return"]))){
			await async function(){
                            let __target_obj__31=ctx_obj;
                            __target_obj__31["suppress_return"]=(parent && parent["suppress_return"]);
                            return __target_obj__31;
                            
			}()
                    };
                    if (check_true ((parent && parent["in_try"]))){
			await async function(){
                            let __target_obj__32=ctx_obj;
                            __target_obj__32["in_try"]=await (async function(){
				let __targ__33=parent;
				if (__targ__33){
                                    return(__targ__33)["in_try"]
				} 
                            })();
                            return __target_obj__32;
                            
			}()
                    };
                    if (check_true ((parent && parent["return_point"]))){
			await async function(){
                            let __target_obj__34=ctx_obj;
                            __target_obj__34["return_point"]=(await Environment.get_global("add"))((parent && parent["return_point"]),1);
                            return __target_obj__34;
                            
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
                    } else if (check_true( ((ctype instanceof String || typeof ctype==='string')&&await (await Environment.get_global("contains?"))("block",ctype)))) {
			return UnknownType
                    } else if (check_true( (ctype==="array"))) {
			return Array
                    } else if (check_true( (ctype==="Boolean"))) {
			return Boolean
                    } else if (check_true( (ctype==="nil"))) {
			return NilType
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
			let __target_obj__35=(ctx && ctx["scope"]);
			__target_obj__35[sanitized_name]=await async function(){
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
			return __target_obj__35;
			
                    }()
		} else {
                    return await async function(){
			let __target_obj__36=(ctx && ctx["scope"]);
			__target_obj__36[sanitized_name]=value;
			return __target_obj__36;
			
                    }()
		}
            };
            get_ctx=async function(ctx,name) {
		let ref_name;
		ref_name=null;
		return  await async function(){
                    if (check_true( await (await Environment.get_global("is_nil?"))(name))) {
			throw new SyntaxError(("get_ctx: nil identifier passed: "+await sub_type(name)));
			
                    } else if (check_true( await (await Environment.get_global("is_number?"))(name))) {
			return name
                    } else if (check_true( name instanceof Function)) {
			throw new SyntaxError(("get_ctx: invalid identifier passed: "+await sub_type(name)));
			
                    } else  {
			ref_name=await first(await (await Environment.get_global("get_object_path"))(name));
			return  await async function(){
                            if (check_true( await not((undefined===await (async function(){
				let __targ__37=(ctx && ctx["scope"]);
				if (__targ__37){
                                    return(__targ__37)[ref_name]
				} 
                            })())))) {
				return await (async function(){
                                    let __targ__38=(ctx && ctx["scope"]);
                                    if (__targ__38){
					return(__targ__38)[ref_name]
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
                    console.error("get_ctx_val: undefined/nil ctx passed.")
		};
		return  await async function(){
                    if (check_true( await (await Environment.get_global("is_nil?"))(name))) {
			throw new TypeError(("get_ctx_val: nil identifier passed: "+await sub_type(name)));
			
                    } else if (check_true( await (await Environment.get_global("is_number?"))(name))) {
			return name
                    } else if (check_true( name instanceof Function)) {
			throw new Error(("get_ctx_val: invalid identifier passed: "+await sub_type(name)));
			
                    } else  {
			if (check_true ((await Environment.get_global("starts_with?"))("=:",name))){
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
                                    let __targ__39=op_lookup;
                                    if (__targ__39){
					return(__targ__39)[ref_name]
                                    } 
				})())) {
                                    return AsyncFunction
				} else if (check_true( await not((undefined===await (async function(){
                                    let __targ__40=(ctx && ctx["scope"]);
                                    if (__targ__40){
					return(__targ__40)[ref_name]
                                    } 
				})())))) {
                                    return await (async function(){
					let __targ__41=(ctx && ctx["scope"]);
					if (__targ__41){
                                            return(__targ__41)[ref_name]
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
			
                    } else if (check_true( await (await Environment.get_global("is_nil?"))(name))) {
			throw new TypeError(("get_declarations: nil identifier passed: "+await sub_type(oname)));
			
                    } else if (check_true( await (await Environment.get_global("is_number?"))(name))) {
			return name
                    } else if (check_true( name instanceof Function)) {
			throw new Error(("get_declarations: invalid identifier passed: "+await sub_type(oname)));
			
                    } else  {
			if (check_true ((name instanceof String || typeof name==='string'))){
                            if (check_true ((await Environment.get_global("starts_with?"))("=:",name))){
				ref_name=await name["substr"].call(name,2)
                            } else {
				ref_name=name
                            };
                            return  await async function(){
				if (check_true( await (async function(){
                                    let __targ__42=op_lookup;
                                    if (__targ__42){
					return(__targ__42)[ref_name]
                                    } 
				})())) {
                                    return null
				} else if (check_true( await not((undefined===await (async function(){
                                    let __targ__43=(ctx && ctx["declared_types"]);
                                    if (__targ__43){
					return(__targ__43)[ref_name]
                                    } 
				})())))) {
                                    return await (async function(){
					let __targ__44=(ctx && ctx["declared_types"]);
					if (__targ__44){
                                            return(__targ__44)[ref_name]
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
                    let __target_obj__45=dec_struct;
                    __target_obj__45[declaration_type]=value;
                    return __target_obj__45;
                    
		}();
		await async function(){
                    let __target_obj__46=(ctx && ctx["declared_types"]);
                    __target_obj__46[sname]=dec_struct;
                    return __target_obj__46;
                    
		}();
		return  await (async function(){
                    let __targ__47=(ctx && ctx["declared_types"]);
                    if (__targ__47){
			return(__targ__47)[sname]
                    } 
		})()
            };
            is_ambiguous_ques_=async function(ctx,name) {
		let ref_name;
		ref_name=null;
		return  await async function(){
                    if (check_true( await (await Environment.get_global("is_nil?"))(ctx))) {
			throw new TypeError(("is_ambiguous?: nil ctx passed"));
			
                    } else if (check_true( await (await Environment.get_global("is_nil?"))(name))) {
			throw new TypeError(("is_ambiguous?: nil reference name passed"));
			
                    } else if (check_true( await not((name instanceof String || typeof name==='string')))) {
			throw new TypeError(("is_ambiguous?: reference name given is a "+await sub_type(name)+", requires a string"));
			
                    } else  {
			if (check_true ((await Environment.get_global("starts_with?"))("=:",name))){
                            ref_name=await name["substr"].call(name,2)
			} else {
                            ref_name=name
			};
			ref_name=await first(await (await Environment.get_global("get_object_path"))(ref_name));
			return  await async function(){
                            if (check_true( await (async function(){
				let __targ__48=(ctx && ctx["ambiguous"]);
				if (__targ__48){
                                    return(__targ__48)[ref_name]
				} 
                            })())) {
				return true
                            } else if (check_true((ctx && ctx["parent"]))) {
				return await (async function(){
                                    let __array_op_rval__49=is_ambiguous_ques_;
                                    if (__array_op_rval__49 instanceof Function){
					return await __array_op_rval__49((ctx && ctx["parent"]),ref_name) 
                                    } else {
					return[__array_op_rval__49,(ctx && ctx["parent"]),ref_name]
                                    }
				})()
                            }
			}()
                    }
		}()
            };
            set_ambiguous=async function(ctx,name) {
		return  await async function(){
                    let __target_obj__50=(ctx && ctx["ambiguous"]);
                    __target_obj__50[name]=true;
                    return __target_obj__50;
                    
		}()
            };
            unset_ambiguous=async function(ctx,name) {
		return  (await Environment.get_global("delete_prop"))((ctx && ctx["ambiguous"]),name)
            };
            invalid_js_ref_chars="+?-%&^#!*[]~{}|";
            invalid_js_ref_chars_regex=new RegExp("[%+[>?<}{&#^=~*!)(-]+","g");
            check_invalid_js_ref=async function(symname) {
		return  await async function(){
                    if (check_true( await not((symname instanceof String || typeof symname==='string')))) {
			return false
                    } else if (check_true( ((symname instanceof String || typeof symname==='string')&&(await length(symname)>2)&&(await Environment.get_global("starts_with?"))("=:",symname)))) {
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
                            let __for_body__53=async function(t) {
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
                                    } else if (check_true( await (await Environment.get_global("contains?"))(t,"(){}"))) {
					throw new SyntaxError(("Invalid character in symbol: "+symname));
					
                                    } else  {
					return (acc).push(t)
                                    }
				}()
                            };
                            let __array__54=[],__elements__52=text_chars;
                            let __BREAK__FLAG__=false;
                            for(let __iter__51 in __elements__52) {
				__array__54.push(await __for_body__53(__elements__52[__iter__51]));
				if(__BREAK__FLAG__) {
                                    __array__54.pop();
                                    break;
                                    
				}
                            }return __array__54;
                            
			})();
			return  (acc).join("")
                    }
		}()
            };
            find_in_context=async function(ctx,name) {
		let symname;
		let ref;
		let __is_literal_ques___55= async function(){
                    return (await (await Environment.get_global("is_number?"))(name)||(await not(ref)&&(name instanceof String || typeof name==='string'))||(ref&&("nil"===symname))||(ref&&("null"===symname))||(ref&&("undefined"===symname))||(ref&&("else"===symname))||(ref&&("catch"===symname))||(true===name)||(false===name))
		};
		let special;
		let local;
		let global;
		let val;
		{
                    symname=await async function(){
			if (check_true( ((name instanceof String || typeof name==='string')&&(await length(name)>2)&&(await Environment.get_global("starts_with?"))("=:",name)))) {
                            return await name["substr"].call(name,2)
			} else if (check_true( (name instanceof String || typeof name==='string'))) {
                            return name
			} else  {
                            return null
			}
                    }();
                    ref=(symname&&((name instanceof String || typeof name==='string')&&(await length(name)>2)&&(await Environment.get_global("starts_with?"))("=:",name)));
                    let is_literal_ques_=await __is_literal_ques___55();
                    ;
                    special=(ref&&symname&&await (await Environment.get_global("contains?"))(symname,(await Environment.get_global("conj"))(["unquotem","quotem"],(await Environment.get_global("keys"))(op_lookup))));
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
                                    let __array_op_rval__56=error_log;
                                    if (__array_op_rval__56 instanceof Function){
					return await __array_op_rval__56("find_in_context: unknown type: ",name) 
                                    } else {
					return[__array_op_rval__56,"find_in_context: unknown type: ",name]
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
				let __targ__57=(root_ctx && root_ctx["defined_lisp_globals"]);
				if (__targ__57){
                                    return(__targ__57)[ref_name]
				} 
                            })()||await Environment["get_global"].call(Environment,ref_name,NOT_FOUND_THING,cannot_be_js_global))
			} 
                    })();
                    if (check_true ((await not((NOT_FOUND_THING===ref_type))&&await not(await (await Environment.get_global("contains?"))(ref_name,standard_types))&&await async function(){
			let __target_obj__58=referenced_global_symbols;
			__target_obj__58[ref_name]=ref_type;
			return __target_obj__58;
			
                    }()))){
			
                    };
                    return  await async function(){
			if (check_true( (NOT_FOUND_THING===ref_type))) {
                            return  undefined
			} else if (check_true( (ref_type===THIS_REFERENCE))) {
                            return ref_type
			} else if (check_true( ((comps && comps.length)===0))) {
                            return  ref_type
			} else if (check_true( (((comps && comps.length)===1)&&(ref_type instanceof Object)&&await (await Environment.get_global("contains?"))((comps && comps["0"]),await (await Environment.get_global("object_methods"))(ref_type))))) {
                            return await (async function(){
				let __targ__59=ref_type;
				if (__targ__59){
                                    return(__targ__59)[(comps && comps["0"])]
				} 
                            })()
			} else if (check_true( (ref_type instanceof Object))) {
                            return (await Environment.get_global("resolve_path"))(comps,ref_type)
			} else  {
                            await (async function(){
				let __array_op_rval__60=get_lisp_ctx_log;
				if (__array_op_rval__60 instanceof Function){
                                    return await __array_op_rval__60("symbol not found: ",name,ref_name,ref_type,cannot_be_js_global) 
				} else {
                                    return[__array_op_rval__60,"symbol not found: ",name,ref_name,ref_type,cannot_be_js_global]
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
            tokenize_object=async function(obj,ctx) {
		if (check_true ((JSON.stringify(obj)==="{}"))){
                    return  {
			type:"object",ref:false,val:"{}",name:"{}",__token__:"true"
                    }
		} else {
                    return await (async function() {
			let __for_body__63=async function(pset) {
                            return  {
				type:"keyval",val:await tokenize(pset,ctx),ref:false,name:(""+(await Environment.get_global("as_lisp"))((pset && pset["0"]))),__token__:"true"
                            }
			};
			let __array__64=[],__elements__62=(await Environment.get_global("pairs"))(obj);
			let __BREAK__FLAG__=false;
			for(let __iter__61 in __elements__62) {
                            __array__64.push(await __for_body__63(__elements__62[__iter__61]));
                            if(__BREAK__FLAG__) {
				__array__64.pop();
				break;
				
                            }
			}return __array__64;
			
                    })()
		}
            };
            tokenize_quote=async function(args) {
		return  await async function(){
                    if (check_true( ((args && args["0"])===`=:quote`))) {
			return {
                            type:"arr",__token__:"true",source:(await Environment.get_global("as_lisp"))(args),val:(await Environment.get_global("conj"))([{
				type:"special",val:`=:quote`,ref:true,name:"quote",__token__:"true"
                            }],await args["slice"].call(args,1)),ref:((args instanceof String || typeof args==='string')&&(await length(args)>2)&&(await Environment.get_global("starts_with?"))("=:",args)),name:null
			}
                    } else if (check_true( ((args && args["0"])===`=:quotem`))) {
			return {
                            type:"arr",__token__:"true",source:(await Environment.get_global("as_lisp"))(args),val:(await Environment.get_global("conj"))([{
				type:"special",val:`=:quotem`,ref:true,name:"quotem",__token__:"true"
                            }],await args["slice"].call(args,1)),ref:((args instanceof String || typeof args==='string')&&(await length(args)>2)&&(await Environment.get_global("starts_with?"))("=:",args)),name:null
			}
                    } else  {
			return {
                            type:"arr",__token__:"true",source:(await Environment.get_global("as_lisp"))(args),val:(await Environment.get_global("conj"))([{
				type:"special",val:`=:quotel`,ref:true,name:"quotel",__token__:"true"
                            }],await args["slice"].call(args,1)),ref:((args instanceof String || typeof args==='string')&&(await length(args)>2)&&(await Environment.get_global("starts_with?"))("=:",args)),name:null
			}
                    }
		}()
            };
            tokenize=async function(args,ctx) {
		let argtype;
		let rval;
		let qval;
		let argdetails;
		let argvalue;
		let is_ref;
		argtype=null;
		rval=null;
		ctx=ctx;
		qval=null;
		argdetails=null;
		argvalue=null;
		is_ref=null;
		if (check_true ((null==ctx))){
                    console.error("tokenize: nil ctx passed: ",clone(args));
                    throw new ReferenceError("nil/undefined ctx passed to tokenize");
                    
		};
		if (check_true ((args instanceof Array))){
                    args=await compile_time_eval(ctx,args)
		};
		return  await async function(){
                    if (check_true( ((args instanceof String || typeof args==='string')||await (await Environment.get_global("is_number?"))(args)||((args===true)||(args===false))))) {
			return await first(await tokenize(await (async function(){
                            let __array_op_rval__65=args;
                            if (__array_op_rval__65 instanceof Function){
				return await __array_op_rval__65() 
                            } else {
				return[__array_op_rval__65]
                            }
			})(),ctx))
                    } else if (check_true( ((args instanceof Array)&&(((args && args["0"])===`=:quotem`)||((args && args["0"])===`=:quote`)||((args && args["0"])===`=:quotel`))))) {
			rval=await tokenize_quote(args);
			return  rval
                    } else if (check_true( ((args instanceof Array)&&await not(await get_ctx_val(ctx,"__IN_LAMBDA__"))&&((args && args["0"])===`=:progn`)))) {
			rval=await compile_toplevel(args,ctx);
			return  await tokenize(rval,ctx)
                    } else if (check_true( (await not((args instanceof Array))&&(args instanceof Object)))) {
			return await first(await tokenize(await (async function(){
                            let __array_op_rval__66=args;
                            if (__array_op_rval__66 instanceof Function){
				return await __array_op_rval__66() 
                            } else {
				return[__array_op_rval__66]
                            }
			})(),ctx))
                    } else  {
			if (check_true ((((args && args["0"])===`=:fn`)||((args && args["0"])===`=:function`)||((args && args["0"])===`=:=>`)))){
                            ctx=await new_ctx(ctx);
                            await set_ctx(ctx,"__IN_LAMBDA__",true)
			};
			return  await (async function() {
                            let __for_body__69=async function(arg) {
				argdetails=await find_in_context(ctx,arg);
				argvalue=(argdetails && argdetails["val"]);
				argtype=(argdetails && argdetails["type"]);
				is_ref=(argdetails && argdetails["ref"]);
				return  await async function(){
                                    if (check_true( (await sub_type(arg)==="array"))) {
					return {
                                            type:"arr",__token__:"true",source:(await Environment.get_global("as_lisp"))(arg),val:await tokenize(arg,ctx),ref:is_ref,name:null
					}
                                    } else if (check_true( (argtype==="Function"))) {
					return {
                                            type:"fun",__token__:"true",val:arg,ref:is_ref,name:(""+(await Environment.get_global("as_lisp"))(arg))
					}
                                    } else if (check_true( (argtype==="AsyncFunction"))) {
					return {
                                            type:"asf",__token__:"true",val:arg,ref:is_ref,name:(""+(await Environment.get_global("as_lisp"))(arg))
					}
                                    } else if (check_true( (argtype==="array"))) {
					return {
                                            type:"array",__token__:"true",val:arg,ref:is_ref,name:(""+(await Environment.get_global("as_lisp"))(arg))
					}
                                    } else if (check_true( (argtype==="Number"))) {
					return {
                                            type:"num",__token__:"true",val:argvalue,ref:is_ref,name:(""+(await Environment.get_global("as_lisp"))(arg))
					}
                                    } else if (check_true( ((argtype==="String")&&is_ref))) {
					return {
                                            type:"arg",__token__:"true",val:argvalue,ref:is_ref,name:await clean_quoted_reference((""+(await Environment.get_global("as_lisp"))(arg))),global:(argdetails && argdetails["global"]),local:(argdetails && argdetails["local"])
					}
                                    } else if (check_true( (argtype==="String"))) {
					return {
                                            type:"literal",__token__:"true",val:argvalue,ref:is_ref,name:await clean_quoted_reference((""+(await Environment.get_global("as_lisp"))(arg))),global:(argdetails && argdetails["global"])
					}
                                    } else if (check_true( (arg instanceof Object))) {
					return  {
                                            type:"objlit",__token__:"true",val:await tokenize_object(arg,ctx),ref:is_ref,name:null
					}
                                    } else if (check_true( ((argtype==="literal")&&is_ref&&((""+(await Environment.get_global("as_lisp"))(arg))==="nil")))) {
					return {
                                            type:"null",__token__:"true",val:null,ref:true,name:"null"
					}
                                    } else if (check_true( ((argtype==="unbound")&&is_ref&&(null==argvalue)))) {
					return {
                                            type:"arg",__token__:"true",val:arg,ref:true,name:await clean_quoted_reference((""+(await Environment.get_global("as_lisp"))(arg)))
					}
                                    } else if (check_true( ((argtype==="unbound")&&is_ref))) {
					return {
                                            type:await sub_type(argvalue),__token__:"true",val:argvalue,ref:true,name:await clean_quoted_reference(await sanitize_js_ref_name((""+(await Environment.get_global("as_lisp"))(arg))))
					}
                                    } else  {
					return {
                                            type:argtype,__token__:"true",val:argvalue,ref:is_ref,name:await clean_quoted_reference((""+(await Environment.get_global("as_lisp"))(arg))),global:(argdetails && argdetails["global"]),local:(argdetails && argdetails["local"])
					}
                                    }
				}()
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
		}()
            };
            comp_time_log=await defclog({
		prefix:"compile_time_eval",background:"#C0C0C0",color:"darkblue"
            });
            compile_time_eval=async function(ctx,lisp_tree) {
		if (check_true (((lisp_tree instanceof Array)&&(((lisp_tree && lisp_tree["0"]) instanceof String || typeof (lisp_tree && lisp_tree["0"])==='string')&&(await length((lisp_tree && lisp_tree["0"]))>2)&&(await Environment.get_global("starts_with?"))("=:",(lisp_tree && lisp_tree["0"])))&&(await Environment.get_global("resolve_path"))(["definitions",await (lisp_tree && lisp_tree["0"])["substr"].call((lisp_tree && lisp_tree["0"]),2),"eval_when","compile_time"],Environment)))){
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
                                    console.error("precompilation error: ",e);
                                    (errors).push({
					error:(e && e.name),message:(e && e.message),form:(ctx && ctx["source"]),parent_forms:await get_source_chain(ctx),invalid:true,text:(await Environment.get_global("as_lisp"))(lisp_tree)
                                    });
                                    throw new Error(e);
                                    
				}
                            } 
			}
                    })();
                    if (check_true ((null==ntree))){
			await (async function(){
                            let __array_op_rval__74=comp_time_log;
                            if (__array_op_rval__74 instanceof Function){
				return await __array_op_rval__74("unable to perform compilation time operation") 
                            } else {
				return[__array_op_rval__74,"unable to perform compilation time operation"]
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
                    let __targ__75=await first(tokens);
                    if (__targ__75){
			return(__targ__75)["name"]
                    } 
		})();
		math_op=(await (async function(){
                    let __targ__76=op_translation;
                    if (__targ__76){
			return(__targ__76)[math_op_a]
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
			let __target_obj__77=tokens;
			__target_obj__77[0]={
                            type:"function",val:(await Environment.get_global("add"))("=:","add"),name:"add",ref:true
			};
			return __target_obj__77;
			
                    }();
                    stmts=await compile(tokens,ctx);
                    stmts=await wrap_assignment_value(stmts);
                    return  stmts
		} else {
                    (acc).push("(");
                    await (async function(){
			let __test_condition__78=async function() {
                            return  (idx<((tokens && tokens.length)-1))
			};
			let __body_ref__79=async function() {
                            idx+=1;
                            token=await (async function(){
				let __targ__80=tokens;
				if (__targ__80){
                                    return(__targ__80)[idx]
				} 
                            })();
                            await add_operand();
                            return  (acc).push(await wrap_assignment_value(await compile(token,ctx)))
			};
			let __BREAK__FLAG__=false;
			while(await __test_condition__78()) {
                            await __body_ref__79();
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
                    let __array_op_rval__81=is_complex_ques_;
                    if (__array_op_rval__81 instanceof Function){
			return await __array_op_rval__81((token && token["val"])) 
                    } else {
			return[__array_op_rval__81,(token && token["val"])]
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
                    let __for_body__84=async function(t) {
			return  (wrapper).push(t)
                    };
                    let __array__85=[],__elements__83=["await"," ","async"," ","function","()","{","let"," ",target_reference,"=",target,";"];
                    let __BREAK__FLAG__=false;
                    for(let __iter__82 in __elements__83) {
			__array__85.push(await __for_body__84(__elements__83[__iter__82]));
			if(__BREAK__FLAG__) {
                            __array__85.pop();
                            break;
                            
			}
                    }return __array__85;
                    
		})();
		await (async function(){
                    let __test_condition__86=async function() {
			return  (idx<((tokens && tokens.length)-1))
                    };
                    let __body_ref__87=async function() {
			idx+=1;
			(acc).push(target_reference);
			token=await (async function(){
                            let __targ__88=tokens;
                            if (__targ__88){
				return(__targ__88)[idx]
                            } 
			})();
			(acc).push("[");
			stmt=await wrap_assignment_value(await compile(token,ctx));
			(acc).push(stmt);
			(acc).push("]");
			idx+=1;
			(acc).push("=");
			token=await (async function(){
                            let __targ__89=tokens;
                            if (__targ__89){
				return(__targ__89)[idx]
                            } 
			})();
			if (check_true ((null==token)))throw new Error("set_prop: odd number of arguments");
			;
			stmt=await wrap_assignment_value(await compile(token,ctx));
			(acc).push(stmt);
			return  (acc).push(";")
                    };
                    let __BREAK__FLAG__=false;
                    while(await __test_condition__86()) {
			await __body_ref__87();
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
                    let __targ__90=tokens;
                    if (__targ__90){
			return(__targ__90)[2]
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
		let __check_needs_wrap__91= async function(){
                    return async function(stmts) {
			let fst;
			fst=(""+(((stmts instanceof Array)&&await first(stmts)&&(await first(stmts) instanceof Object)&&await (async function(){
                            let __targ__92=await first(stmts);
                            if (__targ__92){
				return(__targ__92)["ctype"]
                            } 
			})()&&await async function(){
                            if (check_true( (await (async function(){
				let __targ__93=await first(stmts);
				if (__targ__93){
                                    return(__targ__93)["ctype"]
				} 
                            })() instanceof String || typeof await (async function(){
				let __targ__93=await first(stmts);
				if (__targ__93){
                                    return(__targ__93)["ctype"]
				} 
                            })()==='string'))) {
				return await (async function(){
                                    let __targ__94=await first(stmts);
                                    if (__targ__94){
					return(__targ__94)["ctype"]
                                    } 
				})()
                            } else  {
				return await sub_type(await (async function(){
                                    let __targ__95=await first(stmts);
                                    if (__targ__95){
					return(__targ__95)["ctype"]
                                    } 
				})())
                            }
			}())||""));
			return  await async function(){
                            if (check_true( await (await Environment.get_global("contains?"))("block",fst))) {
				return true
                            } else  {
				return false
                            }
			}()
                    }
		};
		{
                    rval=null;
                    let check_needs_wrap=await __check_needs_wrap__91();
                    ;
                    if (check_true (await (async function(){
			let __array_op_rval__96=is_complex_ques_;
			if (__array_op_rval__96 instanceof Function){
                            return await __array_op_rval__96((token && token["val"])) 
			} else {
                            return[__array_op_rval__96,(token && token["val"])]
			}
                    })())){
			rval=await compile_wrapper_fn(token,ctx)
                    } else {
			rval=await compile(token,ctx)
                    };
                    if (check_true (await not((rval instanceof Array)))){
			rval=await (async function(){
                            let __array_op_rval__97=rval;
                            if (__array_op_rval__97 instanceof Function){
				return await __array_op_rval__97() 
                            } else {
				return[__array_op_rval__97]
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
                    let __for_body__100=async function(token) {
			stmt=await wrap_assignment_value(await compile(token,ctx));
			return  (args).push(stmt)
                    };
                    let __array__101=[],__elements__99=await tokens["slice"].call(tokens,1);
                    let __BREAK__FLAG__=false;
                    for(let __iter__98 in __elements__99) {
			__array__101.push(await __for_body__100(__elements__99[__iter__98]));
			if(__BREAK__FLAG__) {
                            __array__101.pop();
                            break;
                            
			}
                    }return __array__101;
                    
		})();
		if (check_true (await (async function(){
                    let __targ__102=(Environment && Environment["inlines"]);
                    if (__targ__102){
			return(__targ__102)[(tokens && tokens["0"] && tokens["0"]["name"])]
                    } 
		})())){
                    inline_fn=await (async function(){
			let __targ__103=(Environment && Environment["inlines"]);
			if (__targ__103){
                            return(__targ__103)[(tokens && tokens["0"] && tokens["0"]["name"])]
			} 
                    })();
                    rval=await (async function(){
			let __array_op_rval__104=inline_fn;
			if (__array_op_rval__104 instanceof Function){
                            return await __array_op_rval__104(args) 
			} else {
                            return[__array_op_rval__104,args]
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
                    let __array_op_rval__105=place;
                    if (__array_op_rval__105 instanceof Function){
			return await __array_op_rval__105(".push","(",thing,")") 
                    } else {
			return[__array_op_rval__105,".push","(",thing,")"]
                    }
		})()
            };
            compile_list=async function(tokens,ctx) {
		let acc;
		let compiled_values;
		acc=["["];
		compiled_values=[];
		await (async function() {
                    let __for_body__108=async function(t) {
			return  (compiled_values).push(await wrap_assignment_value(await compile(t,ctx)))
                    };
                    let __array__109=[],__elements__107=await tokens["slice"].call(tokens,1);
                    let __BREAK__FLAG__=false;
                    for(let __iter__106 in __elements__107) {
			__array__109.push(await __for_body__108(__elements__107[__iter__106]));
			if(__BREAK__FLAG__) {
                            __array__109.pop();
                            break;
                            
			}
                    }return __array__109;
                    
		})();
		await push_as_arg_list(acc,compiled_values);
		(acc).push("]");
		return  acc
            };
            compile_typeof=async function(tokens,ctx) {
		return  ["typeof"," ",await compile_elem((tokens && tokens["1"]),ctx)]
            };
            compile_instanceof=async function(tokens,ctx) {
		let acc;
		acc=[];
		if (check_true (((tokens instanceof Array)&&((tokens && tokens.length)===3)))){
                    let __array_arg__112=(async function() {
			if (check_true (await (async function(){
                            let __array_op_rval__110=is_complex_ques_;
                            if (__array_op_rval__110 instanceof Function){
				return await __array_op_rval__110((tokens && tokens["1"])) 
                            } else {
				return[__array_op_rval__110,(tokens && tokens["1"])]
                            }
			})())){
                            return await compile_wrapper_fn((tokens && tokens["1"]),ctx)
			} else {
                            return await compile((tokens && tokens["1"]),ctx)
			}
                    } );
                    let __array_arg__113=(async function() {
			if (check_true (await (async function(){
                            let __array_op_rval__111=is_complex_ques_;
                            if (__array_op_rval__111 instanceof Function){
				return await __array_op_rval__111((tokens && tokens["1"])) 
                            } else {
				return[__array_op_rval__111,(tokens && tokens["1"])]
                            }
			})())){
                            return await compile_wrapper_fn((tokens && tokens["2"]),ctx)
			} else {
                            return await compile((tokens && tokens["2"]),ctx)
			}
                    } );
                    return ["(",await __array_arg__112()," ","instanceof"," ",await __array_arg__113(),")"]
		} else throw new SyntaxError("instanceof requires 2 arguments");
		
            };
            compile_compare=async function(tokens,ctx) {
		let acc;
		let ops;
		let __operator__114= async function(){
                    return await (async function(){
			let __targ__117=ops;
			if (__targ__117){
                            return(__targ__117)[await (async function(){
				let __targ__116=await first(tokens);
				if (__targ__116){
                                    return(__targ__116)["name"]
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
			let __obj__115=new Object();
			__obj__115["eq"]="==";
			__obj__115["=="]="===";
			__obj__115["<"]="<";
			__obj__115[">"]=">";
			__obj__115["gt"]=">";
			__obj__115["lt"]="<";
			__obj__115["<="]="<=";
			__obj__115[">="]=">=";
			return __obj__115;
			
                    })();
                    let operator=await __operator__114();
                    ;
                    left=await (async function(){
			let __targ__118=tokens;
			if (__targ__118){
                            return(__targ__118)[1]
			} 
                    })();
                    right=await (async function(){
			let __targ__119=tokens;
			if (__targ__119){
                            return(__targ__119)[2]
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
                    let __targ__120=await first(tokens);
                    if (__targ__120){
			return(__targ__120)["name"]
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
		console.log("compile_assignment: target_details: ",target_details);
		await unset_ambiguous(ctx,target);
		await async function(){
                    let __target_obj__121=ctx;
                    __target_obj__121["in_assignment"]=true;
                    return __target_obj__121;
                    
		}();
		assignment_value=await compile((tokens && tokens["2"]),ctx);
		if (check_true (((assignment_value instanceof Array)&&((assignment_value && assignment_value["0"]) instanceof Object)&&(assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])))){
                    assignment_type=await map_ctype_to_value((assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"]),assignment_value)
		} else {
                    console.warn("compile_assignment: undeclared assignment type: ",target);
                    await set_ambiguous(ctx,target);
                    assignment_type=UnknownType
		};
		console.log("compile_assignment: target is: ",target," type: ",assignment_type," value: ",clone(assignment_value));
		assignment_value=await wrap_assignment_value(assignment_value);
		if (check_true ((target_location_compile_time==="local"))){
                    await set_ctx(ctx,target,assignment_type);
                    (acc).push(target);
                    (acc).push("=");
                    (acc).push(assignment_value)
		} else {
                    await (async function() {
			let __for_body__124=async function(t) {
                            return  (acc).push(t)
			};
			let __array__125=[],__elements__123=[{
                            ctype:"statement"
			},"await"," ","Environment",".","set_global","(","\"",target,"\"",",",assignment_value,")"];
			let __BREAK__FLAG__=false;
			for(let __iter__122 in __elements__123) {
                            __array__125.push(await __for_body__124(__elements__123[__iter__122]));
                            if(__BREAK__FLAG__) {
				__array__125.pop();
				break;
				
                            }
			}return __array__125;
			
                    })()
		};
		await async function(){
                    let __target_obj__126=ctx;
                    __target_obj__126["in_assignment"]=false;
                    return __target_obj__126;
                    
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
                                    let __targ__127=await first(flattened);
                                    if (__targ__127){
					return(__targ__127)["ctype"]
                                    } 
				})()))) {
                                    return inst=await first(flattened)
				} else if (check_true( ((await first(flattened) instanceof String || typeof await first(flattened)==='string')&&(await Environment.get_global("starts_with?"))("/*",await first(flattened))&&(await second(flattened) instanceof Object)&&await (async function(){
                                    let __targ__128=await second(flattened);
                                    if (__targ__128){
					return(__targ__128)["ctype"]
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
				} else if (check_true( await (await Environment.get_global("contains?"))(await first(flattened),["__BREAK__FLAG__","let","if","return","throw"]))) {
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
			let __tokens__129= async function(){
                            return null
			};
			let stmt;
			let num_non_return_statements;
			{
                            idx=0;
                            rval=null;
                            let tokens=await __tokens__129();
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
				let __test_condition__130=async function() {
                                    return  (idx<num_non_return_statements)
				};
				let __body_ref__131=async function() {
                                    idx+=1;
                                    await (async function(){
					let __array_op_rval__133=top_level_log;
					if (__array_op_rval__133 instanceof Function){
                                            return await __array_op_rval__133((""+idx+"/"+num_non_return_statements),"->",(await Environment.get_global("as_lisp"))(await (async function(){
						let __targ__132=lisp_tree;
						if (__targ__132){
                                                    return(__targ__132)[idx]
						} 
                                            })())) 
					} else {
                                            return[__array_op_rval__133,(""+idx+"/"+num_non_return_statements),"->",(await Environment.get_global("as_lisp"))(await (async function(){
						let __targ__132=lisp_tree;
						if (__targ__132){
                                                    return(__targ__132)[idx]
						} 
                                            })())]
					}
                                    })();
                                    tokens=await tokenize(await (async function(){
					let __targ__134=lisp_tree;
					if (__targ__134){
                                            return(__targ__134)[idx]
					} 
                                    })(),ctx);
                                    stmt=await compile(tokens,ctx);
                                    await (async function(){
					let __array_op_rval__135=top_level_log;
					if (__array_op_rval__135 instanceof Function){
                                            return await __array_op_rval__135((""+idx+"/"+num_non_return_statements),"compiled <- ",stmt) 
					} else {
                                            return[__array_op_rval__135,(""+idx+"/"+num_non_return_statements),"compiled <- ",stmt]
					}
                                    })();
                                    rval=await wrap_and_run(stmt,ctx,{
					bind_mode:true
                                    });
                                    await (async function(){
					let __array_op_rval__136=top_level_log;
					if (__array_op_rval__136 instanceof Function){
                                            return await __array_op_rval__136((""+idx+"/"+num_non_return_statements),"<-",rval) 
					} else {
                                            return[__array_op_rval__136,(""+idx+"/"+num_non_return_statements),"<-",rval]
					}
                                    })();
                                    return  await (async function(){
					let __array_op_rval__137=top_level_log;
					if (__array_op_rval__137 instanceof Function){
                                            return await __array_op_rval__137((""+idx+"/"+num_non_return_statements),"ctx",clone((Environment && Environment["context"] && Environment["context"]["scope"]))) 
					} else {
                                            return[__array_op_rval__137,(""+idx+"/"+num_non_return_statements),"ctx",clone((Environment && Environment["context"] && Environment["context"]["scope"]))]
					}
                                    })()
				};
				let __BREAK__FLAG__=false;
				while(await __test_condition__130()) {
                                    await __body_ref__131();
                                    if(__BREAK__FLAG__) {
					break;
					
                                    }
				} ;
				
                            })();
                            return  await (async function(){
				let __targ__138=lisp_tree;
				if (__targ__138){
                                    return(__targ__138)[(idx+1)]
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
		block_id=(((block_options && block_options.name)&&(await Environment.get_global("add"))((block_options && block_options.name),(blk_counter=blk_counter+1)))||(blk_counter=blk_counter+1));
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
			let __target_obj__139=ctx;
			__target_obj__139["source"]=(tokens && tokens["1"] && tokens["1"]["source"]);
			return __target_obj__139;
			
                    }()
		};
		await async function(){
                    let __target_obj__140=ctx;
                    __target_obj__140["block_id"]=block_id;
                    return __target_obj__140;
                    
		}();
		if (check_true ((await get_ctx_val(ctx,"__LAMBDA_STEP__")===-1))){
                    lambda_block=true;
                    await (await Environment.get_global("setf_ctx"))(ctx,"__LAMBDA_STEP__",((tokens && tokens.length)-1))
		};
		if (check_true (await not((block_options && block_options["no_scope_boundary"])))){
                    (acc).push("{")
		};
		await (async function(){
                    let __test_condition__141=async function() {
			return  (idx<((tokens && tokens.length)-1))
                    };
                    let __body_ref__142=async function() {
			idx+=1;
			token=await (async function(){
                            let __targ__143=tokens;
                            if (__targ__143){
				return(__targ__143)[idx]
                            } 
			})();
			if (check_true ((idx===((tokens && tokens.length)-1)))){
                            await async function(){
				let __target_obj__144=ctx;
				__target_obj__144["final_block_statement"]=true;
				return __target_obj__144;
				
                            }()
			};
			await async function(){
                            let __target_obj__145=ctx;
                            __target_obj__145["block_step"]=((tokens && tokens.length)-1-idx);
                            return __target_obj__145;
                            
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
                            let __targ__146=await first(stmt);
                            if (__targ__146){
				return(__targ__146)["ctype"]
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
                    while(await __test_condition__141()) {
			await __body_ref__142();
			if(__BREAK__FLAG__) {
                            break;
                            
			}
                    } ;
                    
		})();
		await async function(){
                    if (check_true( (await not((block_options && block_options["suppress_return"]))&&await not((ctx && ctx["suppress_return"]))&&(await (async function(){
			let __array_op_rval__147=needs_return_ques_;
			if (__array_op_rval__147 instanceof Function){
                            return await __array_op_rval__147(stmts,ctx) 
			} else {
                            return[__array_op_rval__147,stmts,ctx]
			}
                    })()||((idx>1)&&await (async function(){
			let __array_op_rval__148=needs_return_ques_;
			if (__array_op_rval__148 instanceof Function){
                            return await __array_op_rval__148(stmts,ctx) 
			} else {
                            return[__array_op_rval__148,stmts,ctx]
			}
                    })()))))) {
			last_stmt=(stmts).pop();
			(stmts).push({
                            mark:"final-return",if_id:await get_ctx_val(ctx,"__IF_BLOCK__"),block_step:(ctx && ctx["block_step"]),lambda_step:await get_ctx_val(ctx,"__LAMBDA_STEP__")
			});
			(stmts).push(" ");
			return  (stmts).push(last_stmt)
                    } else if (check_true( (await (async function(){
			let __array_op_rval__149=needs_return_ques_;
			if (__array_op_rval__149 instanceof Function){
                            return await __array_op_rval__149(stmts,ctx) 
			} else {
                            return[__array_op_rval__149,stmts,ctx]
			}
                    })()||((idx>1)&&await (async function(){
			let __array_op_rval__150=needs_return_ques_;
			if (__array_op_rval__150 instanceof Function){
                            return await __array_op_rval__150(stmts,ctx) 
			} else {
                            return[__array_op_rval__150,stmts,ctx]
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
		let __check_needs_wrap__151= async function(){
                    return async function(stmts) {
			let fst;
			fst=(""+(((stmts instanceof Array)&&await first(stmts)&&(await first(stmts) instanceof Object)&&await (async function(){
                            let __targ__152=await first(stmts);
                            if (__targ__152){
				return(__targ__152)["ctype"]
                            } 
			})()&&await async function(){
                            if (check_true( (await (async function(){
				let __targ__153=await first(stmts);
				if (__targ__153){
                                    return(__targ__153)["ctype"]
				} 
                            })() instanceof String || typeof await (async function(){
				let __targ__153=await first(stmts);
				if (__targ__153){
                                    return(__targ__153)["ctype"]
				} 
                            })()==='string'))) {
				return await (async function(){
                                    let __targ__154=await first(stmts);
                                    if (__targ__154){
					return(__targ__154)["ctype"]
                                    } 
				})()
                            } else  {
				return await sub_type(await (async function(){
                                    let __targ__155=await first(stmts);
                                    if (__targ__155){
					return(__targ__155)["ctype"]
                                    } 
				})())
                            }
			}())||""));
			return  await async function(){
                            if (check_true( await (await Environment.get_global("contains?"))("block",fst))) {
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
                    let check_needs_wrap=await __check_needs_wrap__151();
                    ;
                    assignment_value=null;
                    assignment_value=await (async function ()  {
			return  await compile((tokens && tokens["2"]),ctx)
                    } )();
                    wrap_as_function_ques_=await check_needs_wrap(assignment_value);
                    ctx_details=await get_declaration_details(ctx,target);
                    if (check_true (((assignment_value instanceof Array)&&((assignment_value && assignment_value["0"]) instanceof Object)&&(assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])))){
			await set_ctx(ctx,target,await map_ctype_to_value((assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"]),assignment_value));
			assignment_value=await wrap_assignment_value(assignment_value)
                    } else {
			await set_ctx(ctx,target,assignment_value)
                    };
                    if (check_true ((ctx && ctx["defvar_eval"]))){
			(await Environment.get_global("delete_prop"))(ctx,"defvar_eval");
			return  [{
                            ctype:"assignment"
			},"let"," ",target,"=",assignment_value,"()",";"]
                    } else {
			let __array_arg__156=(async function() {
                            if (check_true (((ctx_details && ctx_details["is_argument"])&&((ctx_details && ctx_details["levels_up"])===1)))){
				return ""
                            } else {
				return "let "
                            }
			} );
			return [{
                            ctype:"assignment"
			},await __array_arg__156(),"",target,"=",[assignment_value],";"]
                    }
		}
            };
            get_declaration_details=async function(ctx,symname,_levels_up) {
		return  await async function(){
                    if (check_true( (await (async function(){
			let __targ__157=(ctx && ctx["scope"]);
			if (__targ__157){
                            return(__targ__157)[symname]
			} 
                    })()&&await (async function(){
			let __targ__158=ctx;
			if (__targ__158){
                            return(__targ__158)["lambda_scope"]
			} 
                    })()))) {
			return {
                            name:symname,is_argument:true,levels_up:(_levels_up||0),value:await (async function(){
				let __targ__159=(ctx && ctx["scope"]);
				if (__targ__159){
                                    return(__targ__159)[symname]
				} 
                            })(),declared_global:await (async function() {
				if (check_true (await (async function(){
                                    let __targ__160=(root_ctx && root_ctx["defined_lisp_globals"]);
                                    if (__targ__160){
					return(__targ__160)[symname]
                                    } 
				})())){
                                    return true
				} else {
                                    return false
				}
                            } )()
			}
                    } else if (check_true( await (async function(){
			let __targ__161=(ctx && ctx["scope"]);
			if (__targ__161){
                            return(__targ__161)[symname]
			} 
                    })())) {
			return {
                            name:symname,is_argument:false,levels_up:(_levels_up||0),value:await (async function(){
				let __targ__162=(ctx && ctx["scope"]);
				if (__targ__162){
                                    return(__targ__162)[symname]
				} 
                            })(),declarations:await get_declarations(ctx,symname),declared_global:await (async function() {
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
                    } else if (check_true( ((await (async function(){
			let __targ__164=ctx;
			if (__targ__164){
                            return(__targ__164)["parent"]
			} 
                    })()==null)&&await (async function(){
			let __targ__165=(root_ctx && root_ctx["defined_lisp_globals"]);
			if (__targ__165){
                            return(__targ__165)[symname]
			} 
                    })()))) {
			return {
                            name:symname,is_argument:false,levels_up:(_levels_up||0),value:await (async function(){
				let __targ__166=(ctx && ctx["scope"]);
				if (__targ__166){
                                    return(__targ__166)[symname]
				} 
                            })(),declarations:await get_declarations(ctx,symname),declared_global:true
			}
                    } else if (check_true((ctx && ctx["parent"]))) {
			return await get_declaration_details((ctx && ctx["parent"]),symname,((_levels_up&&(await Environment.get_global("add"))(_levels_up,1))||1))
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
                    let __targ__167=await first(stmts);
                    if (__targ__167){
			return(__targ__167)["ctype"]
                    } 
		})()&&await async function(){
                    if (check_true( (await (async function(){
			let __targ__168=await first(stmts);
			if (__targ__168){
                            return(__targ__168)["ctype"]
			} 
                    })() instanceof String || typeof await (async function(){
			let __targ__168=await first(stmts);
			if (__targ__168){
                            return(__targ__168)["ctype"]
			} 
                    })()==='string'))) {
			return await (async function(){
                            let __targ__169=await first(stmts);
                            if (__targ__169){
				return(__targ__169)["ctype"]
                            } 
			})()
                    } else  {
			return await sub_type(await (async function(){
                            let __targ__170=await first(stmts);
                            if (__targ__170){
				return(__targ__170)["ctype"]
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
                    } else if (check_true( await (await Environment.get_global("contains?"))("block",fst))) {
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
                    if (check_true( ((name instanceof String || typeof name==='string')&&(await Environment.get_global("starts_with?"))("\"",name)&&(await Environment.get_global("ends_with?"))("\"",name)))) {
			return await await name["substr"].call(name,1)["substr"].call(await name["substr"].call(name,1),0,(await length(name)-2))
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
		let assignment_type;
		let stmt;
		let def_idx;
		let redefinitions;
		let need_sub_block;
		let assignments;
		let reference_name;
		let alloc_set;
		let sub_block_count;
		let ctx_details;
		let allocations;
		let block;
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
		assignment_type=null;
		stmt=null;
		def_idx=null;
		redefinitions=new Object();
		need_sub_block=false;
		assignments=new Object();
		reference_name=null;
		alloc_set=null;
		sub_block_count=0;
		ctx_details=null;
		allocations=(tokens && tokens["1"] && tokens["1"]["val"]);
		block=await tokens["slice"].call(tokens,2);
		idx=-1;
		await async function(){
                    let __target_obj__171=ctx;
                    __target_obj__171["return_last_value"]=true;
                    return __target_obj__171;
                    
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
                    let __test_condition__172=async function() {
			return  (idx<((allocations && allocations.length)-1))
                    };
                    let __body_ref__173=async function() {
			idx+=1;
			alloc_set=await (async function(){
                            let __targ__175=await (async function(){
				let __targ__174=allocations;
				if (__targ__174){
                                    return(__targ__174)[idx]
				} 
                            })();
                            if (__targ__175){
				return(__targ__175)["val"]
                            } 
			})();
			reference_name=await clean_quoted_reference(await sanitize_js_ref_name((alloc_set && alloc_set["0"] && alloc_set["0"]["name"])));
			ctx_details=await get_declaration_details(ctx,reference_name);
			if (check_true (ctx_details)){
                            if (check_true ((await not((ctx_details && ctx_details["is_argument"]))&&((ctx_details && ctx_details["levels_up"])>1)))){
				need_sub_block=true;
				if (check_true (await (async function(){
                                    let __targ__176=redefinitions;
                                    if (__targ__176){
					return(__targ__176)[reference_name]
                                    } 
				})())){
                                    (await (async function(){
					let __targ__177=redefinitions;
					if (__targ__177){
                                            return(__targ__177)[reference_name]
					} 
                                    })()).push(await gen_temp_name(reference_name))
				} else {
                                    await async function(){
					let __target_obj__178=redefinitions;
					__target_obj__178[reference_name]=[0,await gen_temp_name(reference_name)];
					return __target_obj__178;
					
                                    }()
				}
                            }
			};
			if (check_true (await not((ctx_details && ctx_details["is_argument"])))){
                            return  await set_ctx(ctx,reference_name,AsyncFunction)
			}
                    };
                    let __BREAK__FLAG__=false;
                    while(await __test_condition__172()) {
			await __body_ref__173();
			if(__BREAK__FLAG__) {
                            break;
                            
			}
                    } ;
                    
		})();
		idx=-1;
		await (async function(){
                    let __test_condition__179=async function() {
			return  (idx<((allocations && allocations.length)-1))
                    };
                    let __body_ref__180=async function() {
			idx+=1;
			stmt=[];
			alloc_set=await (async function(){
                            let __targ__182=await (async function(){
				let __targ__181=allocations;
				if (__targ__181){
                                    return(__targ__181)[idx]
				} 
                            })();
                            if (__targ__182){
				return(__targ__182)["val"]
                            } 
			})();
			reference_name=await clean_quoted_reference(await sanitize_js_ref_name((alloc_set && alloc_set["0"] && alloc_set["0"]["name"])));
			ctx_details=await get_declaration_details(ctx,reference_name);
			await async function(){
                            if (check_true( ((alloc_set && alloc_set["1"] && alloc_set["1"]["val"]) instanceof Array))) {
				await async function(){
                                    let __target_obj__183=ctx;
                                    __target_obj__183["in_assignment"]=true;
                                    return __target_obj__183;
                                    
				}();
				assignment_value=await compile((alloc_set && alloc_set["1"]),ctx);
				return  await async function(){
                                    let __target_obj__184=ctx;
                                    __target_obj__184["in_assignment"]=false;
                                    return __target_obj__184;
                                    
				}()
                            } else  {
				return  assignment_value=await compile((alloc_set && alloc_set["1"]),ctx)
                            }
			}();
			if (check_true (((assignment_value instanceof Array)&&((assignment_value && assignment_value["0"]) instanceof Object)&&(assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"])))){
                            await set_ctx(ctx,reference_name,await map_ctype_to_value((assignment_value && assignment_value["0"] && assignment_value["0"]["ctype"]),assignment_value))
			} else {
                            console.warn("compile_assignment: unknown assignment type: ",reference_name);
                            await set_ctx(ctx,reference_name,assignment_value)
			};
			assignment_value=await wrap_assignment_value(assignment_value);
			if (check_true ((ctx_details && ctx_details["is_argument"]))){
                            await async function(){
				let __target_obj__185=block_declarations;
				__target_obj__185[reference_name]=true;
				return __target_obj__185;
				
                            }()
			};
			def_idx=null;
			await async function(){
                            if (check_true( (await (async function(){
				let __targ__186=redefinitions;
				if (__targ__186){
                                    return(__targ__186)[reference_name]
				} 
                            })()&&await first(await (async function(){
				let __targ__187=redefinitions;
				if (__targ__187){
                                    return(__targ__187)[reference_name]
				} 
                            })())))) {
				def_idx=await first(await (async function(){
                                    let __targ__188=redefinitions;
                                    if (__targ__188){
					return(__targ__188)[reference_name]
                                    } 
				})());
				def_idx+=1;
				await async function(){
                                    let __target_obj__189=await (async function(){
					let __targ__190=redefinitions;
					if (__targ__190){
                                            return(__targ__190)[reference_name]
					} 
                                    })();
                                    __target_obj__189[0]=def_idx;
                                    return __target_obj__189;
                                    
				}();
				return  await (async function() {
                                    let __for_body__193=async function(t) {
					return  (acc).push(t)
                                    };
                                    let __array__194=[],__elements__192=["let"," ",await (async function(){
					let __targ__196=await (async function(){
                                            let __targ__195=redefinitions;
                                            if (__targ__195){
						return(__targ__195)[reference_name]
                                            } 
					})();
					if (__targ__196){
                                            return(__targ__196)[def_idx]
					} 
                                    })(),"="," ","async"," ","function","()","{","return"," ",assignment_value,"}",";"];
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__191 in __elements__192) {
					__array__194.push(await __for_body__193(__elements__192[__iter__191]));
					if(__BREAK__FLAG__) {
                                            __array__194.pop();
                                            break;
                                            
					}
                                    }return __array__194;
                                    
				})()
                            } else if (check_true( await not(await (async function(){
				let __targ__197=block_declarations;
				if (__targ__197){
                                    return(__targ__197)[reference_name]
				} 
                            })()))) {
				await (async function() {
                                    let __for_body__200=async function(t) {
					return  (acc).push(t)
                                    };
                                    let __array__201=[],__elements__199=["let"," ",reference_name,";"];
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__198 in __elements__199) {
					__array__201.push(await __for_body__200(__elements__199[__iter__198]));
					if(__BREAK__FLAG__) {
                                            __array__201.pop();
                                            break;
                                            
					}
                                    }return __array__201;
                                    
				})();
				return  await async function(){
                                    let __target_obj__202=block_declarations;
                                    __target_obj__202[reference_name]=true;
                                    return __target_obj__202;
                                    
				}()
                            }
			}();
			if (check_true (await not(await (async function(){
                            let __targ__203=assignments;
                            if (__targ__203){
				return(__targ__203)[reference_name]
                            } 
			})()))){
                            await async function(){
				let __target_obj__204=assignments;
				__target_obj__204[reference_name]=[];
				return __target_obj__204;
				
                            }()
			};
			return  (await (async function(){
                            let __targ__205=assignments;
                            if (__targ__205){
				return(__targ__205)[reference_name]
                            } 
			})()).push(await (async function () {
                            if (check_true (def_idx)){
				return ["await"," ",await (async function(){
                                    let __targ__207=await (async function(){
					let __targ__206=redefinitions;
					if (__targ__206){
                                            return(__targ__206)[reference_name]
					} 
                                    })();
                                    if (__targ__207){
					return(__targ__207)[def_idx]
                                    } 
				})(),"()",";"]
                            } else {
				return assignment_value
                            } 
			})())
                    };
                    let __BREAK__FLAG__=false;
                    while(await __test_condition__179()) {
			await __body_ref__180();
			if(__BREAK__FLAG__) {
                            break;
                            
			}
                    } ;
                    
		})();
		if (check_true (need_sub_block)){
                    await (async function() {
			let __for_body__210=async function(pset) {
                            return  await (async function() {
				let __for_body__214=async function(redef) {
                                    return  (await (async function(){
					let __targ__216=redefinitions;
					if (__targ__216){
                                            return(__targ__216)[(pset && pset["0"])]
					} 
                                    })()).shift()
				};
				let __array__215=[],__elements__213=(pset && pset["1"]);
				let __BREAK__FLAG__=false;
				for(let __iter__212 in __elements__213) {
                                    __array__215.push(await __for_body__214(__elements__213[__iter__212]));
                                    if(__BREAK__FLAG__) {
					__array__215.pop();
					break;
					
                                    }
				}return __array__215;
				
                            })()
			};
			let __array__211=[],__elements__209=(await Environment.get_global("pairs"))(redefinitions);
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
		if (check_true (need_sub_block)){
                    (acc).push("{");
                    sub_block_count+=1
		};
		idx=-1;
		await (async function(){
                    let __test_condition__217=async function() {
			return  (idx<((allocations && allocations.length)-1))
                    };
                    let __body_ref__218=async function() {
			idx+=1;
			def_idx=null;
			stmt=[];
			alloc_set=await (async function(){
                            let __targ__220=await (async function(){
				let __targ__219=allocations;
				if (__targ__219){
                                    return(__targ__219)[idx]
				} 
                            })();
                            if (__targ__220){
				return(__targ__220)["val"]
                            } 
			})();
			reference_name=await clean_quoted_reference(await sanitize_js_ref_name((alloc_set && alloc_set["0"] && alloc_set["0"]["name"])));
			ctx_details=await get_declaration_details(ctx,reference_name);
			assignment_value=(await (async function(){
                            let __targ__221=assignments;
                            if (__targ__221){
				return(__targ__221)[reference_name]
                            } 
			})()).shift();
			await async function(){
                            if (check_true( ((assignment_value instanceof Array)&&(await first(assignment_value) instanceof Object)&&await (async function(){
				let __targ__222=await first(assignment_value);
				if (__targ__222){
                                    return(__targ__222)["ctype"]
				} 
                            })()))) {
				return assignment_type=await first(assignment_value)
                            } else if (check_true( await (async function(){
				let __targ__223=op_lookup;
				if (__targ__223){
                                    return(__targ__223)[(alloc_set && alloc_set["1"] && alloc_set["1"]["val"] && alloc_set["1"]["val"]["0"] && alloc_set["1"]["val"]["0"]["name"])]
				} 
                            })())) {
				return assignment_type=Function
                            } else  {
				return assignment_type=await sub_type(assignment_value)
                            }
			}();
			await async function(){
                            if (check_true( await (async function(){
				let __targ__224=block_declarations;
				if (__targ__224){
                                    return(__targ__224)[reference_name]
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
                            let __target_obj__225=block_declarations;
                            __target_obj__225[reference_name]=true;
                            return __target_obj__225;
                            
			}();
			(stmt).push("=");
			(stmt).push(assignment_value);
			(stmt).push(";");
			return  (acc).push(stmt)
                    };
                    let __BREAK__FLAG__=false;
                    while(await __test_condition__217()) {
			await __body_ref__218();
			if(__BREAK__FLAG__) {
                            break;
                            
			}
                    } ;
                    
		})();
		(acc).push(await compile_block((await Environment.get_global("conj"))(["PLACEHOLDER"],block),ctx,{
                    no_scope_boundary:true,ignore_declarations:declarations_handled
		}));
		await (async function() {
                    let __for_body__228=async function(i) {
			return  (acc).push("}")
                    };
                    let __array__229=[],__elements__227=await (await Environment.get_global("range"))(sub_block_count);
                    let __BREAK__FLAG__=false;
                    for(let __iter__226 in __elements__227) {
			__array__229.push(await __for_body__228(__elements__227[__iter__226]));
			if(__BREAK__FLAG__) {
                            __array__229.pop();
                            break;
                            
			}
                    }return __array__229;
                    
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
		let __body__230= async function(){
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
                    let body=await __body__230();
                    ;
                    type_mark=null;
                    nbody=null;
                    await async function(){
			let __target_obj__231=ctx;
			__target_obj__231["return_last_value"]=true;
			return __target_obj__231;
			
                    }();
                    await async function(){
			let __target_obj__232=ctx;
			__target_obj__232["return_point"]=0;
			return __target_obj__232;
			
                    }();
                    await set_ctx(ctx,"__IN_LAMBDA__",true);
                    await set_ctx(ctx,"__LAMBDA_STEP__",-1);
                    await async function(){
			let __target_obj__233=ctx;
			__target_obj__233["lambda_scope"]=true;
			return __target_obj__233;
			
                    }();
                    await async function(){
			let __target_obj__234=ctx;
			__target_obj__234["suppress_return"]=false;
			return __target_obj__234;
			
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
			let __target_obj__235=type_mark;
			__target_obj__235["args"]=[];
			return __target_obj__235;
			
                    }();
                    if (check_true (await not((fn_opts && fn_opts["arrow"])))){
			(acc).push("function")
                    };
                    (acc).push("(");
                    await (async function(){
			let __test_condition__236=async function() {
                            return  (idx<((fn_args && fn_args.length)-1))
			};
			let __body_ref__237=async function() {
                            idx+=1;
                            arg=await (async function(){
				let __targ__238=fn_args;
				if (__targ__238){
                                    return(__targ__238)[idx]
				} 
                            })();
                            if (check_true (((arg && arg.name)==="&"))){
				idx+=1;
				arg=await (async function(){
                                    let __targ__239=fn_args;
                                    if (__targ__239){
					return(__targ__239)[idx]
                                    } 
				})();
				if (check_true ((null==arg))){
                                    throw new SyntaxError("Missing argument symbol after &");
                                    
				};
				await set_ctx(ctx,(arg && arg.name),ArgumentType);
				await async function(){
                                    let __target_obj__240=arg;
                                    __target_obj__240["name"]=("..."+(arg && arg.name));
                                    return __target_obj__240;
                                    
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
			while(await __test_condition__236()) {
                            await __body_ref__237();
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
			let __target_obj__241=ctx;
			__target_obj__241["return_last_value"]=true;
			return __target_obj__241;
			
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
				let __target_obj__242=ctx;
				__target_obj__242["return_last_value"]=true;
				return __target_obj__242;
				
                            }();
                            await (async function(){
				let __array_op_rval__243=fn_log;
				if (__array_op_rval__243 instanceof Function){
                                    return await __array_op_rval__243("nbody: ",nbody) 
				} else {
                                    return[__array_op_rval__243,"nbody: ",nbody]
				}
                            })();
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
		let __body__244= async function(){
                    return (tokens && tokens["2"] && tokens["2"]["val"])
		};
		let idx;
		let quoted_body;
		let arg;
		let type_mark;
		{
                    acc=[];
                    fn_args=(tokens && tokens["1"] && tokens["1"]["val"]);
                    let body=await __body__244();
                    ;
                    idx=-1;
                    quoted_body=[];
                    arg=null;
                    type_mark=await type_marker("Function");
                    (acc).push(type_mark);
                    await (async function() {
			let __for_body__247=async function(t) {
                            return  (acc).push(t)
			};
			let __array__248=[],__elements__246=["new"," ","Function","("];
			let __BREAK__FLAG__=false;
			for(let __iter__245 in __elements__246) {
                            __array__248.push(await __for_body__247(__elements__246[__iter__245]));
                            if(__BREAK__FLAG__) {
				__array__248.pop();
				break;
				
                            }
			}return __array__248;
			
                    })();
                    await (async function(){
			let __test_condition__249=async function() {
                            return  (idx<((fn_args && fn_args.length)-1))
			};
			let __body_ref__250=async function() {
                            idx+=1;
                            arg=await (async function(){
				let __targ__251=fn_args;
				if (__targ__251){
                                    return(__targ__251)[idx]
				} 
                            })();
                            await set_ctx(ctx,(arg && arg.name),ArgumentType);
                            (acc).push(("\""+(arg && arg.name)+"\""));
                            ((type_mark && type_mark["args"])).push((arg && arg.name));
                            return  (acc).push(",")
			};
			let __BREAK__FLAG__=false;
			while(await __test_condition__249()) {
                            await __body_ref__250();
                            if(__BREAK__FLAG__) {
				break;
				
                            }
			} ;
			
                    })();
                    (acc).push("\"");
                    await (async function() {
			let __for_body__254=async function(c) {
                            if (check_true (await not((c==="\n"),(c==="\r")))){
				if (check_true ((c==="\""))){
                                    (quoted_body).push(String.fromCharCode(92))
				};
				return  (quoted_body).push(c)
                            }
			};
			let __array__255=[],__elements__253=(body).split("");
			let __BREAK__FLAG__=false;
			for(let __iter__252 in __elements__253) {
                            __array__255.push(await __for_body__254(__elements__253[__iter__252]));
                            if(__BREAK__FLAG__) {
				__array__255.pop();
				break;
				
                            }
			}return __array__255;
			
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
			let __targ__256=await first(stmts);
			if (__targ__256){
                            return(__targ__256)["ctype"]
			} 
                    })()&&await async function(){
			if (check_true( (await (async function(){
                            let __targ__257=await first(stmts);
                            if (__targ__257){
				return(__targ__257)["ctype"]
                            } 
			})() instanceof String || typeof await (async function(){
                            let __targ__257=await first(stmts);
                            if (__targ__257){
				return(__targ__257)["ctype"]
                            } 
			})()==='string'))) {
                            return await (async function(){
				let __targ__258=await first(stmts);
				if (__targ__258){
                                    return(__targ__258)["ctype"]
				} 
                            })()
			} else  {
                            return await sub_type(await (async function(){
				let __targ__259=await first(stmts);
				if (__targ__259){
                                    return(__targ__259)["ctype"]
				} 
                            })())
			}
                    }())||""));
                    return  await async function(){
			if (check_true( (fst==="ifblock"))) {
                            await (async function(){
				let __array_op_rval__260=cond_log;
				if (__array_op_rval__260 instanceof Function){
                                    return await __array_op_rval__260("check_needs_return: is an ifblock which needs braces!") 
				} else {
                                    return[__array_op_rval__260,"check_needs_return: is an ifblock which needs braces!"]
				}
                            })();
                            needs_braces_ques_=true;
                            return  false
			} else if (check_true( await (await Environment.get_global("contains?"))("block",fst))) {
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
		await async function(){
                    if (check_true( await not((((condition_tokens && condition_tokens.length)%2)===0)))) {
			throw new SyntaxError("cond: Invalid syntax: missing condition block");
			
                    } else if (check_true( ((condition_tokens && condition_tokens.length)===0))) {
			throw new SyntaxError("cond: Invalid syntax: no conditions provided");
			
                    }
		}();
		await set_ctx(ctx,"__LAMBDA_STEP__",-1);
		await (async function(){
                    let __test_condition__261=async function() {
			return  (idx<(condition_tokens && condition_tokens.length))
                    };
                    let __body_ref__262=async function() {
			inject_return=false;
			condition=await (async function(){
                            let __targ__263=condition_tokens;
                            if (__targ__263){
				return(__targ__263)[idx]
                            } 
			})();
			idx+=1;
			condition_block=await (async function(){
                            let __targ__264=condition_tokens;
                            if (__targ__264){
				return(__targ__264)[idx]
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
				let __array_op_rval__265=is_form_ques_;
				if (__array_op_rval__265 instanceof Function){
                                    return await __array_op_rval__265(condition) 
				} else {
                                    return[__array_op_rval__265,condition]
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
                    while(await __test_condition__261()) {
			await __body_ref__262();
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
		let __if_id__266= async function(){
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
                    let if_id=await __if_id__266();
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
                            let __targ__267=await first(stmts);
                            if (__targ__267){
				return(__targ__267)["ctype"]
                            } 
			})()&&await async function(){
                            if (check_true( (await (async function(){
				let __targ__268=await first(stmts);
				if (__targ__268){
                                    return(__targ__268)["ctype"]
				} 
                            })() instanceof String || typeof await (async function(){
				let __targ__268=await first(stmts);
				if (__targ__268){
                                    return(__targ__268)["ctype"]
				} 
                            })()==='string'))) {
				return await (async function(){
                                    let __targ__269=await first(stmts);
                                    if (__targ__269){
					return(__targ__269)["ctype"]
                                    } 
				})()
                            } else  {
				return await sub_type(await (async function(){
                                    let __targ__270=await first(stmts);
                                    if (__targ__270){
					return(__targ__270)["ctype"]
                                    } 
				})())
                            }
			}())||""));
			return  await async function(){
                            if (check_true( await (await Environment.get_global("contains?"))("block",fst))) {
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
                            let __target_obj__271=ctx;
                            __target_obj__271["block_step"]=0;
                            return __target_obj__271;
                            
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
                            let __target_obj__272=ctx;
                            __target_obj__272["suppress_return"]=true;
                            return __target_obj__272;
                            
			}()
                    };
                    if (check_true (((await first(compiled_test) instanceof Object)&&await (async function(){
			let __targ__273=await first(compiled_test);
			if (__targ__273){
                            return(__targ__273)["ctype"]
			} 
                    })()&&(await (async function(){
			let __targ__274=await first(compiled_test);
			if (__targ__274){
                            return(__targ__274)["ctype"]
			} 
                    })() instanceof String || typeof await (async function(){
			let __targ__274=await first(compiled_test);
			if (__targ__274){
                            return(__targ__274)["ctype"]
			} 
                    })()==='string')&&await (await Environment.get_global("contains?"))("unction",await (async function(){
			let __targ__275=await first(compiled_test);
			if (__targ__275){
                            return(__targ__275)["ctype"]
			} 
                    })())))){
			await (async function() {
                            let __for_body__278=async function(t) {
				return  (acc).push(t)
                            };
                            let __array__279=[],__elements__277=["if"," ","(check_true (","await"," ",compiled_test,"()","))"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__276 in __elements__277) {
				__array__279.push(await __for_body__278(__elements__277[__iter__276]));
				if(__BREAK__FLAG__) {
                                    __array__279.pop();
                                    break;
                                    
				}
                            }return __array__279;
                            
			})()
                    } else {
			await (async function() {
                            let __for_body__282=async function(t) {
				return  (acc).push(t)
                            };
                            let __array__283=[],__elements__281=["if"," ","(check_true (",compiled_test,"))"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__280 in __elements__281) {
				__array__283.push(await __for_body__282(__elements__281[__iter__280]));
				if(__BREAK__FLAG__) {
                                    __array__283.pop();
                                    break;
                                    
				}
                            }return __array__283;
                            
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
				mark:"rval",if_id:if_id,block_step:(ctx && ctx["block_step"]),lambda_step:Math.max(0,await get_ctx_val(ctx,"__LAMBDA_STEP__"))
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
                                    mark:"rval",if_id:if_id,block_step:(ctx && ctx["block_step"]),lambda_step:Math.max(0,await get_ctx_val(ctx,"__LAMBDA_STEP__"))
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
			let __target_obj__284=ctx;
			__target_obj__284["suppress_return"]=in_suppress_ques_;
			return __target_obj__284;
			
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
			let __array_op_rval__285=is_block_ques_;
			if (__array_op_rval__285 instanceof Function){
                            return await __array_op_rval__285(tokens) 
			} else {
                            return[__array_op_rval__285,tokens]
			}
                    })())) {
			ctx=await new_ctx(ctx);
			await async function(){
                            let __target_obj__286=ctx;
                            __target_obj__286["return_point"]=1;
                            return __target_obj__286;
                            
			}();
			return  acc=["(","async"," ","function","()","{",await compile(tokens,ctx),"}",")","()"]
                    } else if (check_true( ((tokens instanceof Object)&&((tokens && tokens["val"] && tokens["val"]["0"] && tokens["val"]["0"]["name"])==="if")))) {
			ctx=await new_ctx(ctx);
			await async function(){
                            let __target_obj__287=ctx;
                            __target_obj__287["return_point"]=1;
                            return __target_obj__287;
                            
			}();
			return  await (async function() {
                            let __for_body__290=async function(t) {
				return  (acc).push(t)
                            };
                            let __array__291=[],__elements__289=["(","async"," ","function","()","{",await compile_if((tokens && tokens["val"]),ctx),"}",")","()"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__288 in __elements__289) {
				__array__291.push(await __for_body__290(__elements__289[__iter__288]));
				if(__BREAK__FLAG__) {
                                    __array__291.pop();
                                    break;
                                    
				}
                            }return __array__291;
                            
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
			let __array_op_rval__292=acc;
			if (__array_op_rval__292 instanceof Function){
                            return await __array_op_rval__292() 
			} else {
                            return[__array_op_rval__292]
			}
                    })()
		}
            };
            compile_block_to_anon_fn=async function(tokens,ctx,opts) {
		let acc;
		acc=[];
		ctx=await new_ctx(ctx);
		await async function(){
                    let __target_obj__293=ctx;
                    __target_obj__293["return_point"]=0;
                    return __target_obj__293;
                    
		}();
		await async function(){
                    if (check_true( await (async function(){
			let __array_op_rval__294=is_block_ques_;
			if (__array_op_rval__294 instanceof Function){
                            return await __array_op_rval__294(tokens) 
			} else {
                            return[__array_op_rval__294,tokens]
			}
                    })())) {
			await async function(){
                            let __target_obj__295=ctx;
                            __target_obj__295["return_last_value"]=true;
                            return __target_obj__295;
                            
			}();
			await async function(){
                            let __target_obj__296=ctx;
                            __target_obj__296["return_point"]=0;
                            return __target_obj__296;
                            
			}();
			return  await (async function() {
                            let __for_body__299=async function(t) {
				return  (acc).push(t)
                            };
                            let __array__300=[],__elements__298=["(","async"," ","function","()",await compile_block(tokens,ctx),")","()"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__297 in __elements__298) {
				__array__300.push(await __for_body__299(__elements__298[__iter__297]));
				if(__BREAK__FLAG__) {
                                    __array__300.pop();
                                    break;
                                    
				}
                            }return __array__300;
                            
			})()
                    } else if (check_true( ((tokens && tokens["0"] && tokens["0"]["name"])==="let"))) {
			await async function(){
                            let __target_obj__301=ctx;
                            __target_obj__301["return_last_value"]=true;
                            return __target_obj__301;
                            
			}();
			await async function(){
                            let __target_obj__302=ctx;
                            __target_obj__302["return_point"]=0;
                            return __target_obj__302;
                            
			}();
			return  await (async function() {
                            let __for_body__305=async function(t) {
				return  (acc).push(t)
                            };
                            let __array__306=[],__elements__304=["(","async"," ","function","()",await compile(tokens,ctx),")","()"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__303 in __elements__304) {
				__array__306.push(await __for_body__305(__elements__304[__iter__303]));
				if(__BREAK__FLAG__) {
                                    __array__306.pop();
                                    break;
                                    
				}
                            }return __array__306;
                            
			})()
                    } else  {
			await async function(){
                            let __target_obj__307=ctx;
                            __target_obj__307["return_last_value"]=true;
                            return __target_obj__307;
                            
			}();
			await async function(){
                            let __target_obj__308=ctx;
                            __target_obj__308["return_point"]=0;
                            return __target_obj__308;
                            
			}();
			return  await (async function() {
                            let __for_body__311=async function(t) {
				return  (acc).push(t)
                            };
                            let __array__312=[],__elements__310=["(","async"," ","function","()","{"," ","return"," ",await compile(tokens,ctx)," ","}",")","()"];
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
		return  acc
            };
            make_do_block=async function(tokens) {
		let preamble;
		let place;
		preamble=clone({
                    type:"arr",ref:false,name:null,val:[]
		});
		place=(preamble && preamble["val"]);
		(place).push({
                    type:"special",val:`=:do`,ref:true,name:"do"
		});
		await async function(){
                    if (check_true( (tokens instanceof Array))) {
			return await (async function() {
                            let __for_body__315=async function(token) {
				return  (place).push(token)
                            };
                            let __array__316=[],__elements__314=tokens;
                            let __BREAK__FLAG__=false;
                            for(let __iter__313 in __elements__314) {
				__array__316.push(await __for_body__315(__elements__314[__iter__313]));
				if(__BREAK__FLAG__) {
                                    __array__316.pop();
                                    break;
                                    
				}
                            }return __array__316;
                            
			})()
                    } else  {
			return await (async function() {
                            let __for_body__319=async function(token) {
				return  (place).push(token)
                            };
                            let __array__320=[],__elements__318=await (async function(){
				let __array_op_rval__321=tokens;
				if (__array_op_rval__321 instanceof Function){
                                    return await __array_op_rval__321() 
				} else {
                                    return[__array_op_rval__321]
				}
                            })();
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
                    let __for_body__324=async function(opt_token) {
			return  (args).push(await wrap_assignment_value(await compile(opt_token,ctx)))
                    };
                    let __array__325=[],__elements__323=(new_opts||[]);
                    let __BREAK__FLAG__=false;
                    for(let __iter__322 in __elements__323) {
			__array__325.push(await __for_body__324(__elements__323[__iter__322]));
			if(__BREAK__FLAG__) {
                            __array__325.pop();
                            break;
                            
			}
                    }return __array__325;
                    
		})();
		await async function(){
                    if (check_true( (await not((null==(type_details && type_details["value"])))&&(type_details && type_details["value"]) instanceof Function))) {
			await (async function() {
                            let __for_body__328=async function(arg) {
				return  (acc).push(arg)
                            };
                            let __array__329=[],__elements__327=["new"," ",target_type,"("];
                            let __BREAK__FLAG__=false;
                            for(let __iter__326 in __elements__327) {
				__array__329.push(await __for_body__328(__elements__327[__iter__326]));
				if(__BREAK__FLAG__) {
                                    __array__329.pop();
                                    break;
                                    
				}
                            }return __array__329;
                            
			})();
			await push_as_arg_list(acc,args);
			return  (acc).push(")")
                    } else if (check_true( ((null==(type_details && type_details["value"]))&&await not((null==(root_type_details && root_type_details["value"])))))) {
			await (async function() {
                            let __for_body__332=async function(arg) {
				return  (acc).push(arg)
                            };
                            let __array__333=[],__elements__331=["(","await"," ","Environment.get_global","(","\"","indirect_new","\"",")",")","(",target_type];
                            let __BREAK__FLAG__=false;
                            for(let __iter__330 in __elements__331) {
				__array__333.push(await __for_body__332(__elements__331[__iter__330]));
				if(__BREAK__FLAG__) {
                                    __array__333.pop();
                                    break;
                                    
				}
                            }return __array__333;
                            
			})();
			if (check_true (((args && args.length)>0))){
                            (acc).push(",");
                            await push_as_arg_list(acc,args)
			};
			return  (acc).push(")")
                    }
		}();
		target_return_type=(await get_ctx_val(ctx,target_type)||await (async function(){
                    let __targ__334=(await get_declarations(ctx,target_type)||new Object());
                    if (__targ__334){
			return(__targ__334)["type"]
                    } 
		})()||(await Environment.get_global("get_outside_global"))(target_type)||UnknownType);
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
                            let __array_op_rval__335=target;
                            if (__array_op_rval__335 instanceof Function){
				return await __array_op_rval__335(operation,how_much) 
                            } else {
				return[__array_op_rval__335,operation,how_much]
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
			let __targ__336=await first(stmts);
			if (__targ__336){
                            return(__targ__336)["ctype"]
			} 
                    })()&&await async function(){
			if (check_true( (await (async function(){
                            let __targ__337=await first(stmts);
                            if (__targ__337){
				return(__targ__337)["ctype"]
                            } 
			})() instanceof String || typeof await (async function(){
                            let __targ__337=await first(stmts);
                            if (__targ__337){
				return(__targ__337)["ctype"]
                            } 
			})()==='string'))) {
                            return await (async function(){
				let __targ__338=await first(stmts);
				if (__targ__338){
                                    return(__targ__338)["ctype"]
				} 
                            })()
			} else  {
                            return await sub_type(await (async function(){
				let __targ__339=await first(stmts);
				if (__targ__339){
                                    return(__targ__339)["ctype"]
				} 
                            })())
			}
                    }())||""));
                    return  await async function(){
			if (check_true( await (await Environment.get_global("contains?"))("block",fst))) {
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
                            let __for_body__342=async function(t) {
				return  (acc).push(t)
                            };
                            let __array__343=[],__elements__341=[" ","catch","(",the_exception_ref,")"," ","{"," "];
                            let __BREAK__FLAG__=false;
                            for(let __iter__340 in __elements__341) {
				__array__343.push(await __for_body__342(__elements__341[__iter__340]));
				if(__BREAK__FLAG__) {
                                    __array__343.pop();
                                    break;
                                    
				}
                            }return __array__343;
                            
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
                            let __for_body__346=async function(t) {
				return  (acc).push(t)
                            };
                            let __array__347=[],__elements__345=[" ","else"," "];
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
                    await (async function() {
			let __for_body__350=async function(t) {
                            return  (acc).push(t)
			};
			let __array__351=[],__elements__349=[" ","if"," ","(",the_exception_ref," ","instanceof"," ",(err_data && err_data["error_type"]),")"," ","{"," ","let"," ",(err_data && err_data["error_ref"]),"=",the_exception_ref,";"," "];
			let __BREAK__FLAG__=false;
			for(let __iter__348 in __elements__349) {
                            __array__351.push(await __for_body__350(__elements__349[__iter__348]));
                            if(__BREAK__FLAG__) {
				__array__351.pop();
				break;
				
                            }
			}return __array__351;
			
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
                            let __for_body__354=async function(t) {
				return  (acc).push(t)
                            };
                            let __array__355=[],__elements__353=[" ","else"," ","throw"," ",the_exception_ref,";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__352 in __elements__353) {
				__array__355.push(await __for_body__354(__elements__353[__iter__352]));
				if(__BREAK__FLAG__) {
                                    __array__355.pop();
                                    break;
                                    
				}
                            }return __array__355;
                            
			})()
                    };
                    if (check_true (complete)){
			await (async function() {
                            let __for_body__358=async function(t) {
				return  (acc).push(t)
                            };
                            let __array__359=[],__elements__357=[" ","}"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__356 in __elements__357) {
				__array__359.push(await __for_body__358(__elements__357[__iter__356]));
				if(__BREAK__FLAG__) {
                                    __array__359.pop();
                                    break;
                                    
				}
                            }return __array__359;
                            
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
                    let __target_obj__360=ctx;
                    __target_obj__360["return_last_value"]=true;
                    return __target_obj__360;
                    
		}();
		await async function(){
                    let __target_obj__361=ctx;
                    __target_obj__361["in_try"]=true;
                    return __target_obj__361;
                    
		}();
		stmts=await compile(try_block,ctx);
		if (check_true (((stmts && stmts["0"] && stmts["0"]["ctype"])&&(((stmts && stmts["0"] && stmts["0"]["ctype"])===AsyncFunction)||((stmts && stmts["0"] && stmts["0"]["ctype"])===Function))))){
                    (stmts).unshift("await")
		};
		if (check_true (await (async function(){
                    let __array_op_rval__362=is_complex_ques_;
                    if (__array_op_rval__362 instanceof Function){
			return await __array_op_rval__362(try_block) 
                    } else {
			return[__array_op_rval__362,try_block]
                    }
		})())){
                    await (async function() {
			let __for_body__365=async function(t) {
                            return  (acc).push(t)
			};
			let __array__366=[],__elements__364=["try"," ","/* TRY COMPLEX */ ",stmts," "];
			let __BREAK__FLAG__=false;
			for(let __iter__363 in __elements__364) {
                            __array__366.push(await __for_body__365(__elements__364[__iter__363]));
                            if(__BREAK__FLAG__) {
				__array__366.pop();
				break;
				
                            }
			}return __array__366;
			
                    })()
		} else {
                    await (async function() {
			let __for_body__369=async function(t) {
                            return  (acc).push(t)
			};
			let __array__370=[],__elements__368=await (async function ()  {
                            let __array_arg__371=(async function() {
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
                            return ["try"," ","/* TRY SIMPLE */ ","{"," ",await __array_arg__371(),stmts," ","}"]
			} )();
			let __BREAK__FLAG__=false;
			for(let __iter__367 in __elements__368) {
                            __array__370.push(await __for_body__369(__elements__368[__iter__367]));
                            if(__BREAK__FLAG__) {
				__array__370.pop();
				break;
				
                            }
			}return __array__370;
			
                    })()
		};
		await (async function(){
                    let __test_condition__372=async function() {
			return  (idx<(catches && catches.length))
                    };
                    let __body_ref__373=async function() {
			catch_block=await (async function(){
                            let __targ__375=await (async function(){
				let __targ__374=catches;
				if (__targ__374){
                                    return(__targ__374)[idx]
				} 
                            })();
                            if (__targ__375){
				return(__targ__375)["val"]
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
                    while(await __test_condition__372()) {
			await __body_ref__373();
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
		let error_instance;
		acc=[];
		error_message=null;
		error_instance=null;
		await async function(){
                    if (check_true( ((tokens instanceof Array)&&((tokens && tokens.length)===3)))) {
			error_instance=await compile((tokens && tokens["1"]),ctx);
			return  error_message=await compile((tokens && tokens["2"]),ctx)
                    } else if (check_true( ((tokens instanceof Array)&&((tokens && tokens.length)===2)))) {
			error_message=await compile((tokens && tokens["1"]),ctx);
			return  error_instance="Error"
                    } else  {
			throw new SyntaxError("Invalid Throw Syntax");
			
                    }
		}();
		await (async function() {
                    let __for_body__378=async function(t) {
			return  (acc).push(t)
                    };
                    let __array__379=[],__elements__377=["throw"," ","new"," ",error_instance,"(",error_message,")",";"];
                    let __BREAK__FLAG__=false;
                    for(let __iter__376 in __elements__377) {
			__array__379.push(await __for_body__378(__elements__377[__iter__376]));
			if(__BREAK__FLAG__) {
                            __array__379.pop();
                            break;
                            
			}
                    }return __array__379;
                    
		})();
		return  acc
            };
            compile_break=async function(tokens,ctx) {
		return  await (async function(){
                    let __array_op_rval__380=break_out;
                    if (__array_op_rval__380 instanceof Function){
			return await __array_op_rval__380("=","true",";","return") 
                    } else {
			return[__array_op_rval__380,"=","true",";","return"]
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
                    let __array_op_rval__381=is_block_ques_;
                    if (__array_op_rval__381 instanceof Function){
			return await __array_op_rval__381((tokens && tokens["1"] && tokens["1"]["val"])) 
                    } else {
			return[__array_op_rval__381,(tokens && tokens["1"] && tokens["1"]["val"])]
                    }
		})())){
                    await (async function() {
			let __for_body__384=async function(t) {
                            return  (acc).push(t)
			};
			let __array__385=[],__elements__383=["let"," ",return_val_reference,"=",await compile((tokens && tokens["1"] && tokens["1"]["val"]),ctx),";","return"," ",return_val_reference,";"];
			let __BREAK__FLAG__=false;
			for(let __iter__382 in __elements__383) {
                            __array__385.push(await __for_body__384(__elements__383[__iter__382]));
                            if(__BREAK__FLAG__) {
				__array__385.pop();
				break;
				
                            }
			}return __array__385;
			
                    })()
		} else {
                    await (async function() {
			let __for_body__388=async function(t) {
                            return  (acc).push(t)
			};
			let __array__389=[],__elements__387=["return"," ",await compile((tokens && tokens["1"]),ctx),";"];
			let __BREAK__FLAG__=false;
			for(let __iter__386 in __elements__387) {
                            __array__389.push(await __for_body__388(__elements__387[__iter__386]));
                            if(__BREAK__FLAG__) {
				__array__389.pop();
				break;
				
                            }
			}return __array__389;
			
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
			let __for_body__392=async function(t) {
                            return  (acc).push(t)
			};
			let __array__393=[],__elements__391=["let"," ",target_argument_ref,"=","[]",".concat","(",await compile(target_arg,ctx),")",";"];
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
			let __for_body__396=async function(t) {
                            return  (acc).push(t)
			};
			let __array__397=[],__elements__395=["if","(","!",target_argument_ref," ","instanceof"," ","Array",")","{","throw"," ","new"," ","TypeError","(","\"Invalid final argument to apply - an array is required\"",")","}"];
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
			let __for_body__400=async function(token) {
                            preceding_arg_ref=await gen_temp_name("pre_arg");
                            if (check_true (await (async function(){
				let __array_op_rval__402=is_form_ques_;
				if (__array_op_rval__402 instanceof Function){
                                    return await __array_op_rval__402(token) 
				} else {
                                    return[__array_op_rval__402,token]
				}
                            })())){
				await (async function() {
                                    let __for_body__405=async function(t) {
					return  (acc).push(t)
                                    };
                                    let __array__406=[],__elements__404=["let"," ",preceding_arg_ref,"=",await wrap_assignment_value(await compile((token && token["val"]),ctx)),";"];
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__403 in __elements__404) {
					__array__406.push(await __for_body__405(__elements__404[__iter__403]));
					if(__BREAK__FLAG__) {
                                            __array__406.pop();
                                            break;
                                            
					}
                                    }return __array__406;
                                    
				})()
                            } else {
				preceding_arg_ref=await wrap_assignment_value(await compile(token,ctx))
                            };
                            return  (acc).push(await (async function(){
				let __array_op_rval__407=target_argument_ref;
				if (__array_op_rval__407 instanceof Function){
                                    return await __array_op_rval__407(".unshift","(",preceding_arg_ref,")",";") 
				} else {
                                    return[__array_op_rval__407,".unshift","(",preceding_arg_ref,")",";"]
				}
                            })())
			};
			let __array__401=[],__elements__399=args;
			let __BREAK__FLAG__=false;
			for(let __iter__398 in __elements__399) {
                            __array__401.push(await __for_body__400(__elements__399[__iter__398]));
                            if(__BREAK__FLAG__) {
				__array__401.pop();
				break;
				
                            }
			}return __array__401;
			
                    })();
                    await (async function() {
			let __for_body__410=async function(t) {
                            return  (acc).push(t)
			};
			let __array__411=[],__elements__409=["return"," ","(",function_ref,")",".","apply","(","this",",",target_argument_ref,")"];
			let __BREAK__FLAG__=false;
			for(let __iter__408 in __elements__409) {
                            __array__411.push(await __for_body__410(__elements__409[__iter__408]));
                            if(__BREAK__FLAG__) {
				__array__411.pop();
				break;
				
                            }
			}return __array__411;
			
                    })()
		} else {
                    if (check_true (await (async function(){
			let __array_op_rval__412=is_form_ques_;
			if (__array_op_rval__412 instanceof Function){
                            return await __array_op_rval__412(args) 
			} else {
                            return[__array_op_rval__412,args]
			}
                    })())){
			await (async function() {
                            let __for_body__415=async function(t) {
				return  (acc).push(t)
                            };
                            let __array__416=[],__elements__414=["let"," ",args_ref,"=",await wrap_assignment_value(await compile((args && args["val"]),ctx)),";"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__413 in __elements__414) {
				__array__416.push(await __for_body__415(__elements__414[__iter__413]));
				if(__BREAK__FLAG__) {
                                    __array__416.pop();
                                    break;
                                    
				}
                            }return __array__416;
                            
			})();
			complex_ques_=true
                    };
                    await (async function() {
			let __for_body__419=async function(t) {
                            return  (acc).push(t)
			};
			let __array__420=[],__elements__418=["return"," ","("," ",function_ref,")",".","apply","(","this"];
			let __BREAK__FLAG__=false;
			for(let __iter__417 in __elements__418) {
                            __array__420.push(await __for_body__419(__elements__418[__iter__417]));
                            if(__BREAK__FLAG__) {
				__array__420.pop();
				break;
				
                            }
			}return __array__420;
			
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
		let acc;
		let target;
		let idx;
		let method;
		acc=[];
		target=null;
		idx=-1;
		method=null;
		if (check_true (((tokens && tokens.length)<3))){
                    throw new SyntaxError(("call: missing arguments, requires at least 2"));
                    
		};
		if (check_true (await (async function(){
                    let __array_op_rval__421=is_block_ques_;
                    if (__array_op_rval__421 instanceof Function){
			return await __array_op_rval__421((tokens && tokens["1"] && tokens["1"]["val"])) 
                    } else {
			return[__array_op_rval__421,(tokens && tokens["1"] && tokens["1"]["val"])]
                    }
		})())){
                    target=await compile_wrapper_fn((tokens && tokens["1"] && tokens["1"]["val"]),ctx)
		} else {
                    target=await compile((tokens && tokens["1"]),ctx)
		};
		if (check_true (await (async function(){
                    let __array_op_rval__422=is_complex_ques_;
                    if (__array_op_rval__422 instanceof Function){
			return await __array_op_rval__422((tokens && tokens["2"])) 
                    } else {
			return[__array_op_rval__422,(tokens && tokens["2"])]
                    }
		})())){
                    method=await compile_wrapper_fn((tokens && tokens["2"]),ctx)
		} else {
                    method=await compile((tokens && tokens["2"]),ctx)
		};
		await async function(){
                    if (check_true( ((tokens && tokens.length)===3))) {
			return await (async function() {
                            let __for_body__425=async function(t) {
				return  (acc).push(t)
                            };
                            let __array__426=[],__elements__424=["await"," ",target,"[",method,"]","()"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__423 in __elements__424) {
				__array__426.push(await __for_body__425(__elements__424[__iter__423]));
				if(__BREAK__FLAG__) {
                                    __array__426.pop();
                                    break;
                                    
				}
                            }return __array__426;
                            
			})()
                    } else  {
			await (async function() {
                            let __for_body__429=async function(t) {
				return  (acc).push(t)
                            };
                            let __array__430=[],__elements__428=["await"," ",target,"[",method,"]",".","call","(",target];
                            let __BREAK__FLAG__=false;
                            for(let __iter__427 in __elements__428) {
				__array__430.push(await __for_body__429(__elements__428[__iter__427]));
				if(__BREAK__FLAG__) {
                                    __array__430.pop();
                                    break;
                                    
				}
                            }return __array__430;
                            
			})();
			await (async function() {
                            let __for_body__433=async function(token) {
				(acc).push(",");
				if (check_true (await (async function(){
                                    let __array_op_rval__435=is_complex_ques_;
                                    if (__array_op_rval__435 instanceof Function){
					return await __array_op_rval__435(token) 
                                    } else {
					return[__array_op_rval__435,token]
                                    }
				})())){
                                    return (acc).push(await compile_wrapper_fn(token,ctx))
				} else {
                                    return (acc).push(await compile(token,ctx))
				}
                            };
                            let __array__434=[],__elements__432=await tokens["slice"].call(tokens,3);
                            let __BREAK__FLAG__=false;
                            for(let __iter__431 in __elements__432) {
				__array__434.push(await __for_body__433(__elements__432[__iter__431]));
				if(__BREAK__FLAG__) {
                                    __array__434.pop();
                                    break;
                                    
				}
                            }return __array__434;
                            
			})();
			return  (acc).push(")")
                    }
		}();
		return  acc
            };
            check_needs_wrap=async function(stmts) {
		let fst;
		fst=(""+(((stmts instanceof Array)&&await first(stmts)&&(await first(stmts) instanceof Object)&&await not(await (async function(){
                    let __targ__436=await first(stmts);
                    if (__targ__436){
			return(__targ__436)["ctype"]
                    } 
		})() instanceof Function)&&await (async function(){
                    let __targ__437=await first(stmts);
                    if (__targ__437){
			return(__targ__437)["ctype"]
                    } 
		})())||""));
		return  await async function(){
                    if (check_true( await (await Environment.get_global("contains?"))("block",fst))) {
			return true
                    } else  {
			return false
                    }
		}()
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
                    let __target_obj__438=(root_ctx && root_ctx["defined_lisp_globals"]);
                    __target_obj__438[target]=AsyncFunction;
                    return __target_obj__438;
                    
		}();
		if (check_true ((tokens && tokens["3"]))){
                    metavalue=await (async function () {
			if (check_true (await (async function(){
                            let __array_op_rval__439=is_complex_ques_;
                            if (__array_op_rval__439 instanceof Function){
				return await __array_op_rval__439((tokens && tokens["3"])) 
                            } else {
				return[__array_op_rval__439,(tokens && tokens["3"])]
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
			let __target_obj__440=(root_ctx && root_ctx["defined_lisp_globals"]);
			__target_obj__440[target]=await async function(){
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
			return __target_obj__440;
			
                    }();
                    if (check_true (wrap_as_function_ques_)){
			assignment_value=["await"," ","(","async"," ","function"," ","()",assignment_value,")","()"]
                    }
		} else {
                    await async function(){
			let __target_obj__441=(root_ctx && root_ctx["defined_lisp_globals"]);
			__target_obj__441[target]=assignment_value;
			return __target_obj__441;
			
                    }()
		};
		acc=await (async function ()  {
                    let __array_arg__442=(async function() {
			if (check_true (metavalue)){
                            return ","
			} else {
                            return ""
			}
                    } );
                    let __array_arg__443=(async function() {
			if (check_true (metavalue)){
                            return metavalue
			} else {
                            return ""
			}
                    } );
                    return [{
			ctype:"statement"
                    },"await"," ","Environment",".","set_global","(","","\"",(tokens && tokens["1"] && tokens["1"]["name"]),"\"",",",assignment_value,await __array_arg__442(),await __array_arg__443(),")"]
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
		console.log("compile_quote: ",JSON.stringify(lisp_struct));
		console.log("compile_quote",clone(lisp_struct));
		await async function(){
                    let __target_obj__444=ctx;
                    __target_obj__444["hard_quote_mode"]=true;
                    return __target_obj__444;
                    
		}();
		acc=await compile_quotem(lisp_struct,ctx);
		return  acc
            };
            compile_quotel=async function(lisp_struct,ctx) {
		let acc;
		acc=[];
		console.log("compile_quotel:-> ",JSON.stringify(lisp_struct));
		acc=JSON.stringify((lisp_struct && lisp_struct["1"]));
		console.log("compile_quotel: <-",JSON.stringify((lisp_struct && lisp_struct["1"])));
		return  await (async function(){
                    let __array_op_rval__445=acc;
                    if (__array_op_rval__445 instanceof Function){
			return await __array_op_rval__445() 
                    } else {
			return[__array_op_rval__445]
                    }
		})()
            };
            wrap_and_run=async function(js_code,ctx,run_opts) {
		let __assembly__446= async function(){
                    return null
		};
		let result;
		let fst;
		let needs_braces_ques_;
		let run_log;
		let __needs_return_ques___447= async function(){
                    return await (async function ()  {
			fst=(""+(((js_code instanceof Array)&&await first(js_code)&&(await first(js_code) instanceof Object)&&await (async function(){
                            let __targ__448=await first(js_code);
                            if (__targ__448){
				return(__targ__448)["ctype"]
                            } 
			})())||""));
			if (check_true (fst instanceof Function)){
                            fst=await sub_type(fst)
			};
			await (async function(){
                            let __array_op_rval__449=run_log;
                            if (__array_op_rval__449 instanceof Function){
				return await __array_op_rval__449("checking if return is required: fst: ",fst,js_code) 
                            } else {
				return[__array_op_rval__449,"checking if return is required: fst: ",fst,js_code]
                            }
			})();
			return  await async function(){
                            if (check_true( await (await Environment.get_global("contains?"))("block",fst))) {
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
                    let assembly=await __assembly__446();
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
                    let needs_return_ques_=await __needs_return_ques___447();
                    ;
                    assembled=null;
                    assembled=await (await Environment.get_global("splice_in_return_b"))(await (await Environment.get_global("splice_in_return_a"))(js_code));
                    assembled=await assemble_output(assembled);
                    assembled=(await Environment.get_global("add"))(await (async function() {
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
			assembly=(await Environment.get_global("bind_function"))(assembly,Environment)
                    };
                    result=await assembly(Environment);
                    await (async function(){
			let __array_op_rval__450=run_log;
			if (__array_op_rval__450 instanceof Function){
                            return await __array_op_rval__450("<-",result) 
			} else {
                            return[__array_op_rval__450,"<-",result]
			}
                    })();
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
                            let __targ__451=(ntree && ntree["0"]);
                            if (__targ__451){
				return(__targ__451)["ctype"]
                            } 
			})()))){
                            return await (async function(){
				let __targ__452=await first(ntree);
				if (__targ__452){
                                    return(__targ__452)["ctype"]
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
                    await (async function(){
			let __array_op_rval__453=follow_log;
			if (__array_op_rval__453 instanceof Function){
                            return await __array_op_rval__453("check_return_tree: ",fst," returning: ",await sub_type(rval),clone(rval)) 
			} else {
                            return[__array_op_rval__453,"check_return_tree: ",fst," returning: ",await sub_type(rval),clone(rval)]
			}
                    })();
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
                            let __test_condition__454=async function() {
				return  (idx<tlength)
                            };
                            let __body_ref__455=async function() {
				tval=await (async function(){
                                    let __targ__456=tree;
                                    if (__targ__456){
					return(__targ__456)[idx]
                                    } 
				})();
				await async function(){
                                    if (check_true( ((tval===`=$,@`)))) {
					idx+=1;
					tval=await (async function(){
                                            let __targ__457=tree;
                                            if (__targ__457){
						return(__targ__457)[idx]
                                            } 
					})();
					if (check_true (await not((undefined==tval)))){
                                            if (check_true (await get_ctx_val(ctx,"__IN_LAMBDA__"))){
						ntree=[];
						if (check_true ((tval instanceof Object))){
                                                    tmp_name=await gen_temp_name("tval");
                                                    await (async function() {
							let __for_body__460=async function(t) {
                                                            return  (ntree).push(t)
							};
							let __array__461=[],__elements__459=await flatten(await (await Environment.get_global("embed_compiled_quote"))(0,tmp_name,tval));
							let __BREAK__FLAG__=false;
							for(let __iter__458 in __elements__459) {
                                                            __array__461.push(await __for_body__460(__elements__459[__iter__458]));
                                                            if(__BREAK__FLAG__) {
								__array__461.pop();
								break;
								
                                                            }
							}return __array__461;
							
                                                    })()
						} else {
                                                    await (async function(){
							let __array_op_rval__462=follow_log;
							if (__array_op_rval__462 instanceof Function){
                                                            return await __array_op_rval__462("splice: building deferred compilation (serializing tval to lisp)") 
							} else {
                                                            return[__array_op_rval__462,"splice: building deferred compilation (serializing tval to lisp)"]
							}
                                                    })();
                                                    await (async function() {
							let __for_body__465=async function(t) {
                                                            return  (subacc).push(t)
							};
							let __array__466=[],__elements__464=await flatten(await (await Environment.get_global("embed_compiled_quote"))(1,tmp_name,tval));
							let __BREAK__FLAG__=false;
							for(let __iter__463 in __elements__464) {
                                                            __array__466.push(await __for_body__465(__elements__464[__iter__463]));
                                                            if(__BREAK__FLAG__) {
								__array__466.pop();
								break;
								
                                                            }
							}return __array__466;
							
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
						await (async function(){
                                                    let __array_op_rval__467=follow_log;
                                                    if (__array_op_rval__467 instanceof Function){
							return await __array_op_rval__467("compiled ntree <-",clone(ntree)) 
                                                    } else {
							return[__array_op_rval__467,"compiled ntree <-",clone(ntree)]
                                                    }
						})();
						if (check_true ((ntree instanceof Object))){
                                                    await (async function(){
							let __array_op_rval__468=follow_log;
							if (__array_op_rval__468 instanceof Function){
                                                            return await __array_op_rval__468("spliced: evaluating: ",clone(ntree)) 
							} else {
                                                            return[__array_op_rval__468,"spliced: evaluating: ",clone(ntree)]
							}
                                                    })();
                                                    ntree=await wrap_and_run(ntree,ctx)
						}
                                            };
                                            return  subacc=await subacc["concat"].call(subacc,ntree)
					} else throw new SyntaxError("invalid splice operator position");
					
                                    } else if (check_true( (await not((ctx && ctx["hard_quote_mode"]))&&((tval===`=:##`)||(tval===`=:unquotem`))))) {
					idx+=1;
					tval=await (async function(){
                                            let __targ__469=tree;
                                            if (__targ__469){
						return(__targ__469)[idx]
                                            } 
					})();
					if (check_true (await not((undefined==tval)))){
                                            if (check_true (await get_ctx_val(ctx,"__IN_LAMBDA__"))){
						ntree=[];
						if (check_true ((tval instanceof Object))){
                                                    tmp_name=await gen_temp_name("tval");
                                                    await (async function() {
							let __for_body__472=async function(t) {
                                                            return  (ntree).push(t)
							};
							let __array__473=[],__elements__471=await flatten(await (await Environment.get_global("embed_compiled_quote"))(2,tmp_name,tval));
							let __BREAK__FLAG__=false;
							for(let __iter__470 in __elements__471) {
                                                            __array__473.push(await __for_body__472(__elements__471[__iter__470]));
                                                            if(__BREAK__FLAG__) {
								__array__473.pop();
								break;
								
                                                            }
							}return __array__473;
							
                                                    })()
						} else {
                                                    await (async function() {
							let __for_body__476=async function(t) {
                                                            return  (ntree).push(t)
							};
							let __array__477=[],__elements__475=await flatten(await (await Environment.get_global("embed_compiled_quote"))(3,tmp_name,tval));
							let __BREAK__FLAG__=false;
							for(let __iter__474 in __elements__475) {
                                                            __array__477.push(await __for_body__476(__elements__475[__iter__474]));
                                                            if(__BREAK__FLAG__) {
								__array__477.pop();
								break;
								
                                                            }
							}return __array__477;
							
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
                            while(await __test_condition__454()) {
				await __body_ref__455();
				if(__BREAK__FLAG__) {
                                    break;
                                    
				}
                            } ;
                            
			})();
			await (async function(){
                            let __array_op_rval__478=follow_log;
                            if (__array_op_rval__478 instanceof Function){
				return await __array_op_rval__478("<-",clone(subacc)) 
                            } else {
				return[__array_op_rval__478,"<-",clone(subacc)]
                            }
			})();
			return  subacc
                    } else if (check_true( (await (await Environment.get_global("is_number?"))(tree)||(tree instanceof String || typeof tree==='string')||(false===tree)||(true===tree)||(null===tree)||(undefined===tree)))) {
			return tree
                    } else if (check_true( ((tree instanceof Object)&&await not(tree instanceof Function)))) {
			await (async function() {
                            let __for_body__481=async function(k) {
				return  await async function(){
                                    let __target_obj__483=tree;
                                    __target_obj__483[k]=await follow_tree(await (async function(){
					let __targ__484=tree;
					if (__targ__484){
                                            return(__targ__484)[k]
					} 
                                    })(),ctx);
                                    return __target_obj__483;
                                    
				}()
                            };
                            let __array__482=[],__elements__480=(await Environment.get_global("keys"))(tree);
                            let __BREAK__FLAG__=false;
                            for(let __iter__479 in __elements__480) {
				__array__482.push(await __for_body__481(__elements__480[__iter__479]));
				if(__BREAK__FLAG__) {
                                    __array__482.pop();
                                    break;
                                    
				}
                            }return __array__482;
                            
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
		await (async function(){
                    let __array_op_rval__485=quotem_log;
                    if (__array_op_rval__485 instanceof Function){
			return await __array_op_rval__485(" ->",JSON.stringify(lisp_struct)) 
                    } else {
			return[__array_op_rval__485," ->",JSON.stringify(lisp_struct)]
                    }
		})();
		if (check_true (await (await Environment.get_global("contains?"))((lisp_struct && lisp_struct["1"]),await (async function(){
                    let __array_op_rval__486=("="+":"+"(");
                    if (__array_op_rval__486 instanceof Function){
			return await __array_op_rval__486(("="+":"+")"),("="+":"+"'"),("="+":")) 
                    } else {
			return[__array_op_rval__486,("="+":"+")"),("="+":"+"'"),("="+":")]
                    }
		})()))){
                    return ("\""+(lisp_struct && lisp_struct["1"])+"\"")
		} else {
                    pcm=await follow_tree((lisp_struct && lisp_struct["1"]),ctx);
                    await (async function(){
			let __array_op_rval__487=quotem_log;
			if (__array_op_rval__487 instanceof Function){
                            return await __array_op_rval__487("post follow_tree: ",clone(pcm)) 
			} else {
                            return[__array_op_rval__487,"post follow_tree: ",clone(pcm)]
			}
                    })();
                    await async function(){
			if (check_true( (pcm instanceof String || typeof pcm==='string'))) {
                            return  await (async function() {
				let __for_body__490=async function(t) {
                                    return  (acc).push(t)
				};
				let __array__491=[],__elements__489=await (async function(){
                                    let __array_op_rval__492=("`"+pcm+"`");
                                    if (__array_op_rval__492 instanceof Function){
					return await __array_op_rval__492() 
                                    } else {
					return[__array_op_rval__492]
                                    }
				})();
				let __BREAK__FLAG__=false;
				for(let __iter__488 in __elements__489) {
                                    __array__491.push(await __for_body__490(__elements__489[__iter__488]));
                                    if(__BREAK__FLAG__) {
					__array__491.pop();
					break;
					
                                    }
				}return __array__491;
				
                            })()
			} else if (check_true( await (await Environment.get_global("is_number?"))(pcm))) {
                            return (acc).push(pcm)
			} else if (check_true( ((pcm===false)||(pcm===true)))) {
                            return (acc).push(pcm)
			} else  {
                            encoded=await Environment["as_lisp"].call(Environment,pcm);
                            encoded=await (await Environment.get_global("add_escape_encoding"))(encoded);
                            await (async function(){
				let __array_op_rval__493=quotem_log;
				if (__array_op_rval__493 instanceof Function){
                                    return await __array_op_rval__493("encoded: ",encoded) 
				} else {
                                    return[__array_op_rval__493,"encoded: ",encoded]
				}
                            })();
                            return  await (async function() {
				let __for_body__496=async function(t) {
                                    return  (acc).push(t)
				};
				let __array__497=[],__elements__495=["await"," ","Environment.do_deferred_splice","(","await"," ","Environment.read_lisp","(","'",encoded,"'",")",")"];
				let __BREAK__FLAG__=false;
				for(let __iter__494 in __elements__495) {
                                    __array__497.push(await __for_body__496(__elements__495[__iter__494]));
                                    if(__BREAK__FLAG__) {
					__array__497.pop();
					break;
					
                                    }
				}return __array__497;
				
                            })()
			}
                    }();
                    await (async function(){
			let __array_op_rval__498=quotem_log;
			if (__array_op_rval__498 instanceof Function){
                            return await __array_op_rval__498("<- ",acc) 
			} else {
                            return[__array_op_rval__498,"<- ",acc]
			}
                    })();
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
		let __tokens__499= async function(){
                    return null
		};
		let is_arr_ques_;
		{
                    acc=[];
                    let tokens=await __tokens__499();
                    ;
                    is_arr_ques_=((lisp_struct && lisp_struct["1"]) instanceof Array);
                    console.log("compile_evalq ->",lisp_struct);
                    tokens=await (async function () {
			if (check_true (is_arr_ques_)){
                            return await tokenize((lisp_struct && lisp_struct["1"]),ctx)
			} else {
                            return (await tokenize(await (async function(){
				let __array_op_rval__500=(lisp_struct && lisp_struct["1"]);
				if (__array_op_rval__500 instanceof Function){
                                    return await __array_op_rval__500() 
				} else {
                                    return[__array_op_rval__500]
				}
                            })(),ctx)).pop()
			} 
                    })();
                    acc=[await compile(tokens,ctx)];
                    if (check_true (is_arr_ques_)){
			acc=["async"," ","function","()",["{","return"," ",acc,"}"]]
                    };
                    console.log("compile_evalq <-",acc);
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
		let __assembly__501= async function(){
                    return null
		};
		let type_mark;
		let acc;
		let result;
		{
                    let assembly=await __assembly__501();
                    ;
                    type_mark=null;
                    acc=[];
                    result=null;
                    assembly=await compile((tokens && tokens["1"] && tokens["1"]["val"]),ctx);
                    has_lisp_globals=true;
                    result=["Environment",".","eval","(","await"," ","async"," ","function","()",["{","return"," ",assembly,"}","()",")"]];
                    await (async function(){
			let __array_op_rval__502=eval_log;
			if (__array_op_rval__502 instanceof Function){
                            return await __array_op_rval__502("result of eval: ",clone(result)) 
			} else {
                            return[__array_op_rval__502,"result of eval: ",clone(result)]
			}
                    })();
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
                    let __array_op_rval__503=is_block_ques_;
                    if (__array_op_rval__503 instanceof Function){
			return await __array_op_rval__503((for_body && for_body["val"])) 
                    } else {
			return[__array_op_rval__503,(for_body && for_body["val"])]
                    }
		})();
		if (check_true ((iter_count<1))){
                    throw new SyntaxError("Invalid for_each arguments");
                    
		};
		await (async function() {
                    let __for_body__506=async function(iter_idx) {
			(idx_iters).push(await (async function(){
                            let __targ__508=for_args;
                            if (__targ__508){
				return(__targ__508)[iter_idx]
                            } 
			})());
			return  await set_ctx(ctx,await clean_quoted_reference(await (async function(){
                            let __targ__509=await last(idx_iters);
                            if (__targ__509){
				return(__targ__509)["name"]
                            } 
			})()),ArgumentType)
                    };
                    let __array__507=[],__elements__505=await (await Environment.get_global("range"))(iter_count);
                    let __BREAK__FLAG__=false;
                    for(let __iter__504 in __elements__505) {
			__array__507.push(await __for_body__506(__elements__505[__iter__504]));
			if(__BREAK__FLAG__) {
                            __array__507.pop();
                            break;
                            
			}
                    }return __array__507;
                    
		})();
		await set_ctx(ctx,collector_ref,ArgumentType);
		await set_ctx(ctx,element_list,"arg");
		if (check_true (await not(body_is_block_ques_))){
                    for_body=await make_do_block(for_body)
		};
		prebuild=await build_fn_with_assignment(body_function_ref,(for_body && for_body["val"]),idx_iters);
		await async function(){
                    let __target_obj__510=ctx;
                    __target_obj__510["return_last_value"]=true;
                    return __target_obj__510;
                    
		}();
		(acc).push(await compile(prebuild,ctx));
		await (async function() {
                    let __for_body__513=async function(t) {
			return  (acc).push(t)
                    };
                    let __array__514=[],__elements__512=["let"," ",collector_ref,"=","[]",",",element_list,"=",await wrap_assignment_value(await compile(elements,ctx)),";"];
                    let __BREAK__FLAG__=false;
                    for(let __iter__511 in __elements__512) {
			__array__514.push(await __for_body__513(__elements__512[__iter__511]));
			if(__BREAK__FLAG__) {
                            __array__514.pop();
                            break;
                            
			}
                    }return __array__514;
                    
		})();
		await (async function() {
                    let __for_body__517=async function(t) {
			return  (acc).push(t)
                    };
                    let __array__518=[],__elements__516=["let"," ",break_out,"=","false",";"];
                    let __BREAK__FLAG__=false;
                    for(let __iter__515 in __elements__516) {
			__array__518.push(await __for_body__517(__elements__516[__iter__515]));
			if(__BREAK__FLAG__) {
                            __array__518.pop();
                            break;
                            
			}
                    }return __array__518;
                    
		})();
		await set_ctx(ctx,body_function_ref,AsyncFunction);
		await async function(){
                    if (check_true( (((for_args && for_args.length)===2)&&await not(((for_args && for_args["1"]) instanceof Array))))) {
			await set_ctx(ctx,idx_iter,Number);
			await (async function() {
                            let __for_body__521=async function(t) {
				return  (acc).push(t)
                            };
                            let __array__522=[],__elements__520=["for","(","let"," ",idx_iter," ","in"," ",element_list,")"," ","{"];
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
				return  (acc).push(t)
                            };
                            let __array__526=[],__elements__524=await (async function(){
				let __array_op_rval__527=collector_ref;
				if (__array_op_rval__527 instanceof Function){
                                    return await __array_op_rval__527(".","push","(","await"," ",body_function_ref,"(",element_list,"[",idx_iter,"]",")",")",";") 
				} else {
                                    return[__array_op_rval__527,".","push","(","await"," ",body_function_ref,"(",element_list,"[",idx_iter,"]",")",")",";"]
				}
                            })();
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
                            let __for_body__530=async function(t) {
				return  (acc).push(t)
                            };
                            let __array__531=[],__elements__529=["if","(",break_out,")"," ","{"," ",collector_ref,".","pop","()",";","break",";","}"];
                            let __BREAK__FLAG__=false;
                            for(let __iter__528 in __elements__529) {
				__array__531.push(await __for_body__530(__elements__529[__iter__528]));
				if(__BREAK__FLAG__) {
                                    __array__531.pop();
                                    break;
                                    
				}
                            }return __array__531;
                            
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
		let __body__532= async function(){
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
                    let body=await __body__532();
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
			let __for_body__535=async function(t) {
                            return  (prebuild).push(t)
			};
			let __array__536=[],__elements__534=["let"," ",break_out,"=","false",";"];
			let __BREAK__FLAG__=false;
			for(let __iter__533 in __elements__534) {
                            __array__536.push(await __for_body__535(__elements__534[__iter__533]));
                            if(__BREAK__FLAG__) {
				__array__536.pop();
				break;
				
                            }
			}return __array__536;
			
                    })();
                    await (async function() {
			let __for_body__539=async function(t) {
                            return  (prebuild).push(t)
			};
			let __array__540=[],__elements__538=["while","(","await"," ",test_condition_ref,"()",")"," ","{","await"," ",body_ref,"()",";"," ","if","(",break_out,")"," ","{"," ","break",";","}","}"," ","",";"];
			let __BREAK__FLAG__=false;
			for(let __iter__537 in __elements__538) {
                            __array__540.push(await __for_body__539(__elements__538[__iter__537]));
                            if(__BREAK__FLAG__) {
				__array__540.pop();
				break;
				
                            }
			}return __array__540;
			
                    })();
                    await (async function() {
			let __for_body__543=async function(t) {
                            return  (acc).push(t)
			};
			let __array__544=[],__elements__542=["await"," ","(","async"," ","function","()","{"," ",prebuild,"}",")","()"];
			let __BREAK__FLAG__=false;
			for(let __iter__541 in __elements__542) {
                            __array__544.push(await __for_body__543(__elements__542[__iter__541]));
                            if(__BREAK__FLAG__) {
				__array__544.pop();
				break;
				
                            }
			}return __array__544;
			
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
                    let __array_op_rval__545=declare_log;
                    if (__array_op_rval__545 instanceof Function){
			return await __array_op_rval__545("->",clone(expressions)) 
                    } else {
			return[__array_op_rval__545,"->",clone(expressions)]
                    }
		})();
		await (async function() {
                    let __for_body__548=async function(exp) {
			declaration=(exp && exp["val"] && exp["val"]["0"] && exp["val"]["0"]["name"]);
			targeted=await (await Environment.get_global("rest"))((exp && exp["val"]));
			await (async function(){
                            let __array_op_rval__550=declare_log;
                            if (__array_op_rval__550 instanceof Function){
				return await __array_op_rval__550("declaration: ",declaration,"targeted: ",await (await Environment.get_global("each"))(targeted,"name"),targeted) 
                            } else {
				return[__array_op_rval__550,"declaration: ",declaration,"targeted: ",await (await Environment.get_global("each"))(targeted,"name"),targeted]
                            }
			})();
			return  await async function(){
                            if (check_true( (declaration==="toplevel"))) {
				await async function(){
                                    let __target_obj__551=opts;
                                    __target_obj__551["root_environment"]=(targeted && targeted["0"]);
                                    return __target_obj__551;
                                    
				}();
				if (check_true ((opts && opts["root_environment"]))){
                                    return env_ref=""
				} else {
                                    return env_ref="Environment."
				}
                            } else if (check_true( (declaration==="include"))) {
				return  await (async function() {
                                    let __for_body__554=async function(name) {
					sanitized_name=await sanitize_js_ref_name(name);
					dec_struct=await get_declaration_details(ctx,name);
					await (async function ()  {
                                            let __array_arg__556=(async function() {
						if (check_true (dec_struct)){
                                                    return await (dec_struct && dec_struct["value"])["toString"]()
						} else {
                                                    return "NOT FOUND"
						}
                                            } );
                                            return await (async function(){
						let __array_op_rval__557=declare_log;
						if (__array_op_rval__557 instanceof Function){
                                                    return await __array_op_rval__557("current_declaration for ",name,": ",await __array_arg__556(),clone(dec_struct)) 
						} else {
                                                    return[__array_op_rval__557,"current_declaration for ",name,": ",await __array_arg__556(),clone(dec_struct)]
						}
                                            })()
					} )();
					if (check_true ((dec_struct))){
                                            await (async function() {
						let __for_body__560=async function(t) {
                                                    return  (acc).push(t)
						};
						let __array__561=[],__elements__559=["let"," ",sanitized_name,"="];
						let __BREAK__FLAG__=false;
						for(let __iter__558 in __elements__559) {
                                                    __array__561.push(await __for_body__560(__elements__559[__iter__558]));
                                                    if(__BREAK__FLAG__) {
							__array__561.pop();
							break;
							
                                                    }
						}return __array__561;
						
                                            })();
                                            await async function(){
						if (check_true( ((dec_struct && dec_struct["value"]) instanceof Function&&await (async function(){
                                                    let __targ__563=await (async function(){
							let __targ__562=(Environment && Environment["definitions"]);
							if (__targ__562){
                                                            return(__targ__562)[name]
							} 
                                                    })();
                                                    if (__targ__563){
							return(__targ__563)["fn_body"]
                                                    } 
						})()))) {
                                                    details=await (async function(){
							let __targ__564=(Environment && Environment["definitions"]);
							if (__targ__564){
                                                            return(__targ__564)[name]
							} 
                                                    })();
                                                    source=("(fn "+(details && details["fn_args"])+" "+(details && details["fn_body"])+")");
                                                    await (async function(){
							let __array_op_rval__565=declare_log;
							if (__array_op_rval__565 instanceof Function){
                                                            return await __array_op_rval__565("source: ",source) 
							} else {
                                                            return[__array_op_rval__565,"source: ",source]
							}
                                                    })();
                                                    source=await compile(await tokenize(await (await Environment.get_global("read_lisp"))(source),ctx),ctx,1000);
                                                    await (async function(){
							let __array_op_rval__566=declare_log;
							if (__array_op_rval__566 instanceof Function){
                                                            return await __array_op_rval__566("compiled: ",source) 
							} else {
                                                            return[__array_op_rval__566,"compiled: ",source]
							}
                                                    })();
                                                    (acc).push(source);
                                                    await set_ctx(ctx,name,AsyncFunction)
						} else if (check_true( (dec_struct && dec_struct["value"]) instanceof Function)) {
                                                    (acc).push(await await (dec_struct && dec_struct["value"])["toString"]()["replace"].call(await (dec_struct && dec_struct["value"])["toString"](),"\n",""));
                                                    await set_ctx(ctx,name,AsyncFunction)
						} else  {
                                                    (acc).push(await (dec_struct && dec_struct["value"])["toString"]());
                                                    await set_ctx(ctx,name,ArgumentType)
						}
                                            }();
                                            (acc).push(";")
					};
					return  await set_declaration(ctx,name,"inlined",true)
                                    };
                                    let __array__555=[],__elements__553=await (await Environment.get_global("each"))(targeted,"name");
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__552 in __elements__553) {
					__array__555.push(await __for_body__554(__elements__553[__iter__552]));
					if(__BREAK__FLAG__) {
                                            __array__555.pop();
                                            break;
                                            
					}
                                    }return __array__555;
                                    
				})()
                            } else if (check_true( (declaration==="local"))) {
				return await (async function() {
                                    let __for_body__569=async function(name) {
					dec_struct=await get_declaration_details(ctx,name);
					await (async function(){
                                            let __array_op_rval__571=declare_log;
                                            if (__array_op_rval__571 instanceof Function){
						return await __array_op_rval__571("local: declaration_details: ",dec_struct) 
                                            } else {
						return[__array_op_rval__571,"local: declaration_details: ",dec_struct]
                                            }
					})();
					return  await set_ctx(ctx,name,(dec_struct && dec_struct["value"]))
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
                            } else if (check_true( (declaration==="function"))) {
				return  await (async function() {
                                    let __for_body__574=async function(name) {
					return  await set_declaration(ctx,name,"type",Function)
                                    };
                                    let __array__575=[],__elements__573=await (await Environment.get_global("each"))(targeted,"name");
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__572 in __elements__573) {
					__array__575.push(await __for_body__574(__elements__573[__iter__572]));
					if(__BREAK__FLAG__) {
                                            __array__575.pop();
                                            break;
                                            
					}
                                    }return __array__575;
                                    
				})()
                            } else if (check_true( (declaration==="array"))) {
				return  await (async function() {
                                    let __for_body__578=async function(name) {
					return  await set_declaration(ctx,name,"type",Array)
                                    };
                                    let __array__579=[],__elements__577=await (await Environment.get_global("each"))(targeted,"name");
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__576 in __elements__577) {
					__array__579.push(await __for_body__578(__elements__577[__iter__576]));
					if(__BREAK__FLAG__) {
                                            __array__579.pop();
                                            break;
                                            
					}
                                    }return __array__579;
                                    
				})()
                            } else if (check_true( (declaration==="number"))) {
				return  await (async function() {
                                    let __for_body__582=async function(name) {
					return  await set_declaration(ctx,name,"type",Number)
                                    };
                                    let __array__583=[],__elements__581=await (await Environment.get_global("each"))(targeted,"name");
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__580 in __elements__581) {
					__array__583.push(await __for_body__582(__elements__581[__iter__580]));
					if(__BREAK__FLAG__) {
                                            __array__583.pop();
                                            break;
                                            
					}
                                    }return __array__583;
                                    
				})()
                            } else if (check_true( (declaration==="string"))) {
				return  await (async function() {
                                    let __for_body__586=async function(name) {
					return  await set_declaration(ctx,name,"type",String)
                                    };
                                    let __array__587=[],__elements__585=await (await Environment.get_global("each"))(targeted,"name");
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__584 in __elements__585) {
					__array__587.push(await __for_body__586(__elements__585[__iter__584]));
					if(__BREAK__FLAG__) {
                                            __array__587.pop();
                                            break;
                                            
					}
                                    }return __array__587;
                                    
				})()
                            } else if (check_true( (declaration==="boolean"))) {
				return  await (async function() {
                                    let __for_body__590=async function(name) {
					return  await set_declaration(ctx,name,"type",Boolean)
                                    };
                                    let __array__591=[],__elements__589=await (await Environment.get_global("each"))(targeted,"name");
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__588 in __elements__589) {
					__array__591.push(await __for_body__590(__elements__589[__iter__588]));
					if(__BREAK__FLAG__) {
                                            __array__591.pop();
                                            break;
                                            
					}
                                    }return __array__591;
                                    
				})()
                            } else if (check_true( (declaration==="regexp"))) {
				return  await (async function() {
                                    let __for_body__594=async function(name) {
					return  await set_declaration(ctx,name,"type",RegExp)
                                    };
                                    let __array__595=[],__elements__593=await (await Environment.get_global("each"))(targeted,"name");
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__592 in __elements__593) {
					__array__595.push(await __for_body__594(__elements__593[__iter__592]));
					if(__BREAK__FLAG__) {
                                            __array__595.pop();
                                            break;
                                            
					}
                                    }return __array__595;
                                    
				})()
                            } else if (check_true( (declaration==="optimize"))) {
				await (async function(){
                                    let __array_op_rval__596=declare_log;
                                    if (__array_op_rval__596 instanceof Function){
					return await __array_op_rval__596("optimizations: ",targeted) 
                                    } else {
					return[__array_op_rval__596,"optimizations: ",targeted]
                                    }
				})();
				return  await (async function() {
                                    let __for_body__599=async function(factor) {
					await (async function(){
                                            let __array_op_rval__601=declare_log;
                                            if (__array_op_rval__601 instanceof Function){
						return await __array_op_rval__601("optimization: ",await (await Environment.get_global("each"))(factor,"name")) 
                                            } else {
						return[__array_op_rval__601,"optimization: ",await (await Environment.get_global("each"))(factor,"name")]
                                            }
					})();
					factor=await (await Environment.get_global("each"))(factor,"name");
					await async function(){
                                            if (check_true( ((factor && factor["0"])==="safety"))) {
						return await set_declaration(ctx,"__SAFETY__","level",(factor && factor["1"]))
                                            }
					}();
					return  await (async function(){
                                            let __array_op_rval__602=declare_log;
                                            if (__array_op_rval__602 instanceof Function){
						return await __array_op_rval__602("safety set: ",await safety_level(ctx)) 
                                            } else {
						return[__array_op_rval__602,"safety set: ",await safety_level(ctx)]
                                            }
					})()
                                    };
                                    let __array__600=[],__elements__598=await (await Environment.get_global("each"))(targeted,"val");
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__597 in __elements__598) {
					__array__600.push(await __for_body__599(__elements__598[__iter__597]));
					if(__BREAK__FLAG__) {
                                            __array__600.pop();
                                            break;
                                            
					}
                                    }return __array__600;
                                    
				})()
                            }
			}()
                    };
                    let __array__549=[],__elements__547=expressions;
                    let __BREAK__FLAG__=false;
                    for(let __iter__546 in __elements__547) {
			__array__549.push(await __for_body__548(__elements__547[__iter__546]));
			if(__BREAK__FLAG__) {
                            __array__549.pop();
                            break;
                            
			}
                    }return __array__549;
                    
		})();
		await (async function(){
                    let __array_op_rval__603=declare_log;
                    if (__array_op_rval__603 instanceof Function){
			return await __array_op_rval__603("<-",clone(acc)) 
                    } else {
			return[__array_op_rval__603,"<-",clone(acc)]
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
			await (async function(){
                            let __array_op_rval__604=sr_log;
                            if (__array_op_rval__604 instanceof Function){
				return await __array_op_rval__604("check_statement: needs wrap: ",(stmt && stmt["0"] && stmt["0"]["ctype"]),stmt) 
                            } else {
				return[__array_op_rval__604,"check_statement: needs wrap: ",(stmt && stmt["0"] && stmt["0"]["ctype"]),stmt]
                            }
			})();
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
				return await compile_lisp_scoped_reference((tokens && tokens["0"] && tokens["0"]["name"]))
                            } else {
				return (tokens && tokens["0"] && tokens["0"]["name"])
                            } 
			})());
			(acc).push("(");
			await (async function(){
                            let __test_condition__605=async function() {
				return  (idx<((tokens && tokens.length)-1))
                            };
                            let __body_ref__606=async function() {
				idx+=1;
				token=await (async function(){
                                    let __targ__607=tokens;
                                    if (__targ__607){
					return(__targ__607)[idx]
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
                            while(await __test_condition__605()) {
				await __body_ref__606();
				if(__BREAK__FLAG__) {
                                    break;
                                    
				}
                            } ;
                            
			})();
			(acc).push(")");
			return  acc
                    } else if (check_true( (ref_type==="Function"))) {
			(acc).push(await (async function () {
                            if (check_true ((call_type==="lisp"))){
				return await compile_lisp_scoped_reference((tokens && tokens["0"] && tokens["0"]["name"]))
                            } else {
				return (tokens && tokens["0"] && tokens["0"]["name"])
                            } 
			})());
			(acc).push("(");
			await (async function(){
                            let __test_condition__608=async function() {
				return  (idx<((tokens && tokens.length)-1))
                            };
                            let __body_ref__609=async function() {
				idx+=1;
				token=await (async function(){
                                    let __targ__610=tokens;
                                    if (__targ__610){
					return(__targ__610)[idx]
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
                            while(await __test_condition__608()) {
				await __body_ref__609();
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
                            let __test_condition__611=async function() {
				return  (idx<(tokens && tokens.length))
                            };
                            let __body_ref__612=async function() {
				token=await (async function(){
                                    let __targ__613=tokens;
                                    if (__targ__613){
					return(__targ__613)[idx]
                                    } 
				})();
				(acc).push(await compile(token,ctx));
				if (check_true ((idx<((tokens && tokens.length)-1)))){
                                    (acc).push(",")
				};
				return  idx+=1
                            };
                            let __BREAK__FLAG__=false;
                            while(await __test_condition__611()) {
				await __body_ref__612();
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
			return  await compile_lisp_scoped_reference((tokens && tokens["0"] && tokens["0"]["name"]))
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
            compile_lisp_scoped_reference=async function(refname) {
		let refval;
		let reftype;
		let basename;
		refval=await get_lisp_ctx(refname);
		reftype=await sub_type(refval);
		basename=await (await Environment.get_global("get_object_path"))(refname);
		if (check_true (((reftype==="String")&&await not((refval===undefined))))){
                    refval="text"
		};
		return  await async function(){
                    if (check_true( await (await Environment.get_global("contains?"))((basename && basename["0"]),standard_types))) {
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
		return  (await (await Environment.get_global("contains?"))((tokens && tokens["0"] && tokens["0"]["name"]),["do","progn"]))
            };
            is_complex_ques_=async function(tokens) {
		let rval;
		rval=(await (async function(){
                    let __array_op_rval__614=is_block_ques_;
                    if (__array_op_rval__614 instanceof Function){
			return await __array_op_rval__614(tokens) 
                    } else {
			return[__array_op_rval__614,tokens]
                    }
		})()||(((tokens && tokens["type"])==="arr")&&await (async function(){
                    let __array_op_rval__615=is_block_ques_;
                    if (__array_op_rval__615 instanceof Function){
			return await __array_op_rval__615((tokens && tokens["val"])) 
                    } else {
			return[__array_op_rval__615,(tokens && tokens["val"])]
                    }
		})())||((tokens && tokens["val"] && tokens["val"]["0"] && tokens["val"]["0"]["name"])==="if")||((tokens && tokens["val"] && tokens["val"]["0"] && tokens["val"]["0"]["name"])==="let"));
		return  rval
            };
            is_form_ques_=async function(token) {
		return  (((token && token["val"]) instanceof Array)||await (async function(){
                    let __array_op_rval__616=is_block_ques_;
                    if (__array_op_rval__616 instanceof Function){
			return await __array_op_rval__616((token && token["val"])) 
                    } else {
			return[__array_op_rval__616,(token && token["val"])]
                    }
		})())
            };
            op_lookup=await ( async function(){
		let __obj__617=new Object();
		__obj__617["+"]=infix_ops;
		__obj__617["*"]=infix_ops;
		__obj__617["/"]=infix_ops;
		__obj__617["-"]=infix_ops;
		__obj__617["**"]=infix_ops;
		__obj__617["%"]=infix_ops;
		__obj__617["<<"]=infix_ops;
		__obj__617[">>"]=infix_ops;
		__obj__617["and"]=infix_ops;
		__obj__617["or"]=infix_ops;
		__obj__617["apply"]=compile_apply;
		__obj__617["call"]=compile_call;
		__obj__617["->"]=compile_call;
		__obj__617["set_prop"]=compile_set_prop;
		__obj__617["prop"]=compile_prop;
		__obj__617["="]=compile_assignment;
		__obj__617["setq"]=compile_assignment;
		__obj__617["=="]=compile_compare;
		__obj__617["eq"]=compile_compare;
		__obj__617[">"]=compile_compare;
		__obj__617["<"]=compile_compare;
		__obj__617["<="]=compile_compare;
		__obj__617[">="]=compile_compare;
		__obj__617["return"]=compile_return;
		__obj__617["new"]=compile_new;
		__obj__617["do"]=compile_block;
		__obj__617["progn"]=compile_block;
		__obj__617["progl"]=async function(tokens,ctx) {
                    return  await compile_block(tokens,ctx,{
			no_scope_boundary:true,suppress_return:"true"
                    })
		};
		__obj__617["break"]=compile_break;
		__obj__617["inc"]=compile_val_mod;
		__obj__617["dec"]=compile_val_mod;
		__obj__617["try"]=compile_try;
		__obj__617["throw"]=compile_throw;
		__obj__617["let"]=compile_let;
		__obj__617["defvar"]=compile_defvar;
		__obj__617["while"]=compile_while;
		__obj__617["for_each"]=compile_for_each;
		__obj__617["if"]=compile_if;
		__obj__617["cond"]=compile_cond;
		__obj__617["fn"]=compile_fn;
		__obj__617["lambda"]=compile_fn;
		__obj__617["defglobal"]=compile_set_global;
		__obj__617["list"]=compile_list;
		__obj__617["function"]=async function(tokens,ctx) {
                    return  await compile_fn(tokens,ctx,{
			synchronous:true
                    })
		};
		__obj__617["=>"]=async function(tokens,ctx) {
                    return  await compile_fn(tokens,ctx,{
			arrow:true
                    })
		};
		__obj__617["quotem"]=compile_quotem;
		__obj__617["quote"]=compile_quote;
		__obj__617["quotel"]=compile_quotel;
		__obj__617["evalq"]=compile_evalq;
		__obj__617["eval"]=compile_eval;
		__obj__617["jslambda"]=compile_jslambda;
		__obj__617["instanceof"]=compile_instanceof;
		__obj__617["typeof"]=compile_typeof;
		__obj__617["unquotem"]=compile_unquotem;
		__obj__617["debug"]=compile_debug;
		__obj__617["declare"]=compile_declare;
		return __obj__617;
		
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
			await (async function(){
                            let __array_op_rval__618=comp_log;
                            if (__array_op_rval__618 instanceof Function){
				return await __array_op_rval__618("check_statement: needs wrap: ",(stmt && stmt["0"] && stmt["0"]["ctype"]),((stmt && stmt["0"] && stmt["0"]["ctype"])==="ifblock"),stmt) 
                            } else {
				return[__array_op_rval__618,"check_statement: needs wrap: ",(stmt && stmt["0"] && stmt["0"]["ctype"]),((stmt && stmt["0"] && stmt["0"]["ctype"])==="ifblock"),stmt]
                            }
			})();
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
                    let __target_obj__619=ctx;
                    __target_obj__619["in_obj_literal"]=true;
                    return __target_obj__619;
                    
		}();
		await (async function() {
                    let __for_body__622=async function(token) {
			if (check_true ((((token && token["type"])==="keyval")&&await check_invalid_js_ref((token && token.name))))){
                            has_valid_key_literals=false;
                            __BREAK__FLAG__=true;
                            return
			}
                    };
                    let __array__623=[],__elements__621=((tokens && tokens["val"])||[]);
                    let __BREAK__FLAG__=false;
                    for(let __iter__620 in __elements__621) {
			__array__623.push(await __for_body__622(__elements__621[__iter__620]));
			if(__BREAK__FLAG__) {
                            __array__623.pop();
                            break;
                            
			}
                    }return __array__623;
                    
		})();
		if (check_true (has_valid_key_literals)){
                    if (check_true (((tokens && tokens["val"] && tokens["val"]["name"])==="{}"))){
			return [{
                            ctype:"objliteral"
			},"new Object()"]
                    } else {
			(acc).push("{");
			await (async function(){
                            let __test_condition__624=async function() {
				return  (idx<total_length)
                            };
                            let __body_ref__625=async function() {
				idx+=1;
				kvpair=await (async function(){
                                    let __targ__626=(tokens && tokens["val"]);
                                    if (__targ__626){
					return(__targ__626)[idx]
                                    } 
				})();
				key=await get_val((kvpair && kvpair["val"] && kvpair["val"]["0"]),ctx);
				if (check_true ((((key && key.length)===1)&&(await key["charCodeAt"]()===34)))){
                                    key="'\"'"
				};
				console.log("compile_obj_literal:",idx,"key->",key,"token_value:",(kvpair && kvpair["val"] && kvpair["val"]["0"]));
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
                            while(await __test_condition__624()) {
				await __body_ref__625();
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
			let __for_body__629=async function(t) {
                            return  (acc).push(t)
			};
			let __array__630=[],__elements__628=[{
                            ctype:"statement"
			},"await"," ","("," ","async"," ","function","()","{","let"," ",tmp_name,"=","new"," ","Object","()",";"];
			let __BREAK__FLAG__=false;
			for(let __iter__627 in __elements__628) {
                            __array__630.push(await __for_body__629(__elements__628[__iter__627]));
                            if(__BREAK__FLAG__) {
				__array__630.pop();
				break;
				
                            }
			}return __array__630;
			
                    })();
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
                            return  await (async function() {
				let __for_body__636=async function(t) {
                                    return  (acc).push(t)
				};
				let __array__637=[],__elements__635=await (async function(){
                                    let __array_op_rval__638=tmp_name;
                                    if (__array_op_rval__638 instanceof Function){
					return await __array_op_rval__638("[","\"",await (await Environment.get_global("cl_encode_string"))(await get_val((kvpair && kvpair["val"] && kvpair["val"]["0"]),ctx)),"\"","]","=",await compile_elem((kvpair && kvpair["val"] && kvpair["val"]["1"]),ctx),";") 
                                    } else {
					return[__array_op_rval__638,"[","\"",await (await Environment.get_global("cl_encode_string"))(await get_val((kvpair && kvpair["val"] && kvpair["val"]["0"]),ctx)),"\"","]","=",await compile_elem((kvpair && kvpair["val"] && kvpair["val"]["1"]),ctx),";"]
                                    }
				})();
				let __BREAK__FLAG__=false;
				for(let __iter__634 in __elements__635) {
                                    __array__637.push(await __for_body__636(__elements__635[__iter__634]));
                                    if(__BREAK__FLAG__) {
					__array__637.pop();
					break;
					
                                    }
				}return __array__637;
				
                            })()
			};
			let __BREAK__FLAG__=false;
			while(await __test_condition__631()) {
                            await __body_ref__632();
                            if(__BREAK__FLAG__) {
				break;
				
                            }
			} ;
			
                    })();
                    await (async function() {
			let __for_body__641=async function(t) {
                            return  (acc).push(t)
			};
			let __array__642=[],__elements__640=["return"," ",tmp_name,";","}",")","()"];
			let __BREAK__FLAG__=false;
			for(let __iter__639 in __elements__640) {
                            __array__642.push(await __for_body__641(__elements__640[__iter__639]));
                            if(__BREAK__FLAG__) {
				__array__642.pop();
				break;
				
                            }
			}return __array__642;
			
                    })();
                    return  acc
		}
            };
            is_literal_ques_=async function(val) {
		return  (await (await Environment.get_global("is_number?"))(val)||(val instanceof String || typeof val==='string')||(false===val)||(true===val))
            };
            comp_warn=await defclog({
		prefix:"compile: [warn]:",background:"#fcffc8",color:"brown"
            });
            let compile=await __compile__13();
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
                    let __target_obj__646=ctx;
                    __target_obj__646["source"]=await async function(){
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
                    return __target_obj__646;
                    
		}();
		return  await (async function(){
                    try /* TRY SIMPLE */ {
			if (check_true ((null==ctx))){
                            await (async function(){
				let __array_op_rval__648=error_log;
				if (__array_op_rval__648 instanceof Function){
                                    return await __array_op_rval__648("compile: nil ctx: ",tokens) 
				} else {
                                    return[__array_op_rval__648,"compile: nil ctx: ",tokens]
				}
                            })();
                            throw new Error("compile: nil ctx");
                            
			} else {
                            return await async function(){
				if (check_true( (await (await Environment.get_global("is_number?"))(tokens)||(tokens instanceof String || typeof tokens==='string')||(await sub_type(tokens)==="Boolean")))) {
                                    return tokens
				} else if (check_true( ((tokens instanceof Array)&&(tokens && tokens["0"] && tokens["0"]["ref"])&&await not((await get_ctx(ctx,(tokens && tokens["0"] && tokens["0"]["name"]))===UnknownType))&&(await (async function(){
                                    let __targ__649=op_lookup;
                                    if (__targ__649){
					return(__targ__649)[(tokens && tokens["0"] && tokens["0"]["name"])]
                                    } 
				})()||(Function===await get_ctx(ctx,(tokens && tokens["0"] && tokens["0"]["name"])))||(AsyncFunction===await get_ctx(ctx,(tokens && tokens["0"] && tokens["0"]["name"])))||("function"===typeof await (async function(){
                                    let __targ__650=(root_ctx && root_ctx["defined_lisp_globals"]);
                                    if (__targ__650){
					return(__targ__650)[(tokens && tokens["0"] && tokens["0"]["name"])]
                                    } 
				})())||await get_lisp_ctx((tokens && tokens["0"] && tokens["0"]["name"])) instanceof Function)))) {
                                    op_token=await first(tokens);
                                    operator=await (async function(){
					let __targ__651=op_token;
					if (__targ__651){
                                            return(__targ__651)["name"]
					} 
                                    })();
                                    operator_type=await (async function(){
					let __targ__652=op_token;
					if (__targ__652){
                                            return(__targ__652)["val"]
					} 
                                    })();
                                    ref=await (async function(){
					let __targ__653=op_token;
					if (__targ__653){
                                            return(__targ__653)["ref"]
					} 
                                    })();
                                    op=await (async function(){
					let __targ__654=op_lookup;
					if (__targ__654){
                                            return(__targ__654)[operator]
					} 
                                    })();
                                    return  await async function(){
					if (check_true(op)) {
                                            return await (async function(){
						let __array_op_rval__655=op;
						if (__array_op_rval__655 instanceof Function){
                                                    return await __array_op_rval__655(tokens,ctx) 
						} else {
                                                    return[__array_op_rval__655,tokens,ctx]
						}
                                            })()
					} else if (check_true( await (async function(){
                                            let __targ__656=(Environment && Environment["inlines"]);
                                            if (__targ__656){
						return(__targ__656)[operator]
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
                                            rcv=await compile((tokens && tokens["0"]),ctx,(await Environment.get_global("add"))(_cdepth,1));
                                            if (check_true (((tokens && tokens["0"] && tokens["0"]["ref"])&&((tokens && tokens["0"] && tokens["0"]["val"]) instanceof String || typeof (tokens && tokens["0"] && tokens["0"]["val"])==='string')))){
						declared_type=await get_declarations(ctx,(tokens && tokens["0"] && tokens["0"]["name"]));
						await (async function(){
                                                    let __array_op_rval__657=comp_log;
                                                    if (__array_op_rval__657 instanceof Function){
							return await __array_op_rval__657(("compile: "+_cdepth+" [array_literal]:"),"declared_type: ",declared_type,((declared_type && declared_type["type"])===Function)) 
                                                    } else {
							return[__array_op_rval__657,("compile: "+_cdepth+" [array_literal]:"),"declared_type: ",declared_type,((declared_type && declared_type["type"])===Function)]
                                                    }
						})()
                                            };
                                            await (async function() {
						let __for_body__660=async function(t) {
                                                    if (check_true (await not(await get_ctx_val(ctx,"__IN_LAMBDA__")))){
							await set_ctx(ctx,"__LAMBDA_STEP__",0)
                                                    };
                                                    return  (compiled_values).push(await compile(t,ctx,(await Environment.get_global("add"))(_cdepth,1)))
						};
						let __array__661=[],__elements__659=await (await Environment.get_global("rest"))(tokens);
						let __BREAK__FLAG__=false;
						for(let __iter__658 in __elements__659) {
                                                    __array__661.push(await __for_body__660(__elements__659[__iter__658]));
                                                    if(__BREAK__FLAG__) {
							__array__661.pop();
							break;
							
                                                    }
						}return __array__661;
						
                                            })();
                                            await map(async function(compiled_element,idx) {
						let inst;
						inst=await (async function () {
                                                    if (check_true ((((compiled_element && compiled_element["0"]) instanceof Object)&&await (async function(){
							let __targ__662=(compiled_element && compiled_element["0"]);
							if (__targ__662){
                                                            return(__targ__662)["ctype"]
							} 
                                                    })()))){
							return await (async function(){
                                                            let __targ__663=(compiled_element && compiled_element["0"]);
                                                            if (__targ__663){
								return(__targ__663)["ctype"]
                                                            } 
							})()
                                                    } else {
							return null
                                                    } 
						})();
						return  await async function(){
                                                    if (check_true( ((inst==="block")||(inst==="letblock")))) {
							return  (symbolic_replacements).push(await (async function(){
                                                            let __array_op_rval__664=idx;
                                                            if (__array_op_rval__664 instanceof Function){
								return await __array_op_rval__664(await gen_temp_name("array_arg"),[{
                                                                    ctype:"AsyncFunction"
								},"(","async"," ","function","()"," ",compiled_element," ",")"]) 
                                                            } else {
								return[__array_op_rval__664,await gen_temp_name("array_arg"),[{
                                                                    ctype:"AsyncFunction"
								},"(","async"," ","function","()"," ",compiled_element," ",")"]]
                                                            }
							})())
                                                    } else if (check_true( (inst==="ifblock"))) {
							return  (symbolic_replacements).push(await (async function(){
                                                            let __array_op_rval__665=idx;
                                                            if (__array_op_rval__665 instanceof Function){
								return await __array_op_rval__665(await gen_temp_name("array_arg"),[{
                                                                    ctype:"AsyncFunction"
								},"(","async"," ","function","()"," ","{",compiled_element,"}"," ",")"]) 
                                                            } else {
								return[__array_op_rval__665,await gen_temp_name("array_arg"),[{
                                                                    ctype:"AsyncFunction"
								},"(","async"," ","function","()"," ","{",compiled_element,"}"," ",")"]]
                                                            }
							})())
                                                    }
						}()
                                            },compiled_values);
                                            await (async function() {
						let __for_body__668=async function(elem) {
                                                    await (async function() {
							let __for_body__672=async function(t) {
                                                            return  (acc).push(t)
							};
							let __array__673=[],__elements__671=["let"," ",(elem && elem["1"]),"=",(elem && elem["2"]),";"];
							let __BREAK__FLAG__=false;
							for(let __iter__670 in __elements__671) {
                                                            __array__673.push(await __for_body__672(__elements__671[__iter__670]));
                                                            if(__BREAK__FLAG__) {
								__array__673.pop();
								break;
								
                                                            }
							}return __array__673;
							
                                                    })();
                                                    return  await compiled_values["splice"].call(compiled_values,(elem && elem["0"]),1,["await"," ",(elem && elem["1"]),"()"])
						};
						let __array__669=[],__elements__667=symbolic_replacements;
						let __BREAK__FLAG__=false;
						for(let __iter__666 in __elements__667) {
                                                    __array__669.push(await __for_body__668(__elements__667[__iter__666]));
                                                    if(__BREAK__FLAG__) {
							__array__669.pop();
							break;
							
                                                    }
						}return __array__669;
						
                                            })();
                                            if (check_true (((symbolic_replacements && symbolic_replacements.length)>0))){
						(acc).unshift("{");
						(acc).unshift({
                                                    ctype:"block"
						})
                                            };
                                            await async function(){
						if (check_true( (((declared_type && declared_type["type"])===Function)||(((rcv && rcv["0"]) instanceof Object)&&(rcv && rcv["0"] && rcv["0"]["ctype"]) instanceof Function)||(((rcv && rcv["0"]) instanceof Object)&&await not(((rcv && rcv["0"]) instanceof Array))&&await (await Environment.get_global("contains?"))("unction",(rcv && rcv["0"] && rcv["0"]["ctype"])))))) {
                                                    is_operation=true;
                                                    await (async function() {
							let __for_body__676=async function(t) {
                                                            return  (acc).push(t)
							};
							let __array__677=[],__elements__675=["(",rcv,")","("];
							let __BREAK__FLAG__=false;
							for(let __iter__674 in __elements__675) {
                                                            __array__677.push(await __for_body__676(__elements__675[__iter__674]));
                                                            if(__BREAK__FLAG__) {
								__array__677.pop();
								break;
								
                                                            }
							}return __array__677;
							
                                                    })();
                                                    await push_as_arg_list(acc,compiled_values);
                                                    return  (acc).push(")")
						} else if (check_true( ((null==(declared_type && declared_type["type"]))&&(((tokens && tokens["0"] && tokens["0"]["type"])==="arg")||((rcv instanceof String || typeof rcv==='string')&&await get_declaration_details(ctx,rcv))||((rcv instanceof Array)&&((rcv && rcv["0"]) instanceof Object)&&((rcv && rcv["0"] && rcv["0"]["ctype"]) instanceof String || typeof (rcv && rcv["0"] && rcv["0"]["ctype"])==='string')&&((rcv && rcv["0"] && rcv["0"]["ctype"])&&(await not(await (await Environment.get_global("contains?"))("unction",(rcv && rcv["0"] && rcv["0"]["ctype"])))&&await not(("string"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&&await not(("String"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&&await not(("nil"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&&await not(("Number"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&&await not(("undefined"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&&await not(("objliteral"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&&await not(("Boolean"===(rcv && rcv["0"] && rcv["0"]["ctype"])))&&await not(("array"===(rcv && rcv["0"] && rcv["0"]["ctype"])))))))))) {
                                                    tmp_name=await gen_temp_name("array_op_rval");
                                                    if (check_true ((((rcv && rcv["0"]) instanceof Object)&&((rcv && rcv["0"] && rcv["0"]["ctype"]) instanceof String || typeof (rcv && rcv["0"] && rcv["0"]["ctype"])==='string')&&await (await Environment.get_global("contains?"))("block",((rcv && rcv["0"] && rcv["0"]["ctype"])||""))))){
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
							let __for_body__680=async function(t) {
                                                            return  (acc).push(t)
							};
							let __array__681=[],__elements__679=["await"," ","(","async"," ","function","()","{","let"," ",tmp_name,"=",rcv,";"," ","if"," ","(",tmp_name," ","instanceof"," ","Function",")","{","return"," ","await"," ",tmp_name,"("];
							let __BREAK__FLAG__=false;
							for(let __iter__678 in __elements__679) {
                                                            __array__681.push(await __for_body__680(__elements__679[__iter__678]));
                                                            if(__BREAK__FLAG__) {
								__array__681.pop();
								break;
								
                                                            }
							}return __array__681;
							
                                                    })();
                                                    await push_as_arg_list(acc,compiled_values);
                                                    await (async function() {
							let __for_body__684=async function(t) {
                                                            return  (acc).push(t)
							};
							let __array__685=[],__elements__683=[")"," ","}"," ","else"," ","{","return","[",tmp_name];
							let __BREAK__FLAG__=false;
							for(let __iter__682 in __elements__683) {
                                                            __array__685.push(await __for_body__684(__elements__683[__iter__682]));
                                                            if(__BREAK__FLAG__) {
								__array__685.pop();
								break;
								
                                                            }
							}return __array__685;
							
                                                    })();
                                                    if (check_true ((await length(await (await Environment.get_global("rest"))(tokens))>0))){
							(acc).push(",");
							await push_as_arg_list(acc,compiled_values)
                                                    };
                                                    return  await (async function() {
							let __for_body__688=async function(t) {
                                                            return  (acc).push(t)
							};
							let __array__689=[],__elements__687=["]","}","}",")","()"];
							let __BREAK__FLAG__=false;
							for(let __iter__686 in __elements__687) {
                                                            __array__689.push(await __for_body__688(__elements__687[__iter__686]));
                                                            if(__BREAK__FLAG__) {
								__array__689.pop();
								break;
								
                                                            }
							}return __array__689;
							
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
					let __target_obj__690=ctx;
					__target_obj__690["source"]=(tokens && tokens["source"]);
					return __target_obj__690;
					
                                    }();
                                    rcv=await compile((tokens && tokens["val"]),ctx,(await Environment.get_global("add"))(_cdepth,1));
                                    return  rcv
				} else if (check_true( (((tokens instanceof Object)&&(tokens && tokens["val"])&&(tokens && tokens["type"]))||((tokens && tokens["type"])==="literal")||((tokens && tokens["type"])==="arg")||((tokens && tokens["type"])==="null")))) {
                                    let snt_name=null;
                                    ;
                                    let snt_value=null;
                                    ;
                                    return  await async function(){
					if (check_true( (await not((tokens && tokens["ref"]))&&((tokens && tokens["type"])==="arr")))) {
                                            return await compile((tokens && tokens["val"]),ctx,(await Environment.get_global("add"))(_cdepth,1))
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
						},("\""+await (await Environment.get_global("cl_encode_string"))((tokens && tokens["val"]))+"\"")]
                                            } else {
						return [{
                                                    ctype:await sub_type((tokens && tokens["val"]))
						},(tokens && tokens["val"])]
                                            }
					} else if (check_true( ((tokens && tokens["ref"])&&await (async function(){
                                            let __targ__691=op_lookup;
                                            if (__targ__691){
						return(__targ__691)[(tokens && tokens.name)]
                                            } 
					})()))) {
                                            return (tokens && tokens.name)
					} else if (check_true( ((tokens && tokens["ref"])&&await (async function ()  {
                                            snt_name=await sanitize_js_ref_name((tokens && tokens.name));
                                            snt_value=await get_ctx(ctx,snt_name);
                                            return  (snt_value||(false===snt_value))
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
                                            await (async function(){
						let __array_op_rval__692=comp_log;
						if (__array_op_rval__692 instanceof Function){
                                                    return await __array_op_rval__692("compile: unknown reference: ",(tokens && tokens.name)) 
						} else {
                                                    return[__array_op_rval__692,"compile: unknown reference: ",(tokens && tokens.name)]
						}
                                            })();
                                            throw new ReferenceError(("compile: unknown reference: "+(tokens && tokens.name)));
                                            
					}
                                    }()
				} else  {
                                    await (async function(){
					let __array_op_rval__693=error_log;
					if (__array_op_rval__693 instanceof Function){
                                            return await __array_op_rval__693("compile: invalid compilation structure:",tokens) 
					} else {
                                            return[__array_op_rval__693,"compile: invalid compilation structure:",tokens]
					}
                                    })();
                                    console.error("Compile passed invalid compilation structure");
                                    console.error(clone(tokens));
                                    console.error("CTX:",clone(ctx));
                                    throw new SyntaxError("compile passed invalid compilation structure");
                                    
				}
                            }()
			} 
                    } catch(__exception__647) {
			if (__exception__647 instanceof Error) {
                            let e=__exception__647;
                            {
				console.error("COMPILATION ERROR: ",e);
				is_error={
                                    error:(e && e.name),message:(e && e.message),form:(ctx && ctx["source"]),parent_forms:await get_source_chain(ctx),invalid:true,text:(await Environment.get_global("as_lisp"))(await (async function() {
					if (check_true ((tokens instanceof Array))){
                                            return await map(async function(v) {
						return  (v && v["val"])
                                            },tokens)
					} else {
                                            return (tokens && tokens["val"])
					} 
                                    } )())
				};
				(errors).push(clone(is_error));
				await (async function(){
                                    let __array_op_rval__694=error_log;
                                    if (__array_op_rval__694 instanceof Function){
					return await __array_op_rval__694(is_error) 
                                    } else {
					return[__array_op_rval__694,is_error]
                                    }
				})();
				return  console.error("compilation",is_error)
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
		escape_char=String.fromCharCode(92);
		format_depth=[];
		last_t=null;
		insert_indent=async function() {
                    (text).push("\n");
                    return  await (async function() {
			let __for_body__697=async function(spacer) {
                            return  (text).push(spacer)
			};
			let __array__698=[],__elements__696=format_depth;
			let __BREAK__FLAG__=false;
			for(let __iter__695 in __elements__696) {
                            __array__698.push(await __for_body__697(__elements__696[__iter__695]));
                            if(__BREAK__FLAG__) {
				__array__698.pop();
				break;
				
                            }
			}return __array__698;
			
                    })()
		};
		process_output_token=async function(t) {
                    escaped=Math.max(0,(escaped-1));
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
			} else if (check_true( (await not(in_quotes)&&(await Environment.get_global("starts_with?"))("}",t)))) {
                            (format_depth).pop();
                            await insert_indent();
                            return  (text).push(t)
			} else if (check_true( (await not(in_quotes)&&(t===";")))) {
                            (text).push(t);
                            return  await insert_indent()
			} else if (check_true( (false&&await not(in_quotes)&&(await Environment.get_global("starts_with?"))("/*",t)))) {
                            (text).push(t);
                            return  await insert_indent()
			} else  {
                            return  (text).push(t)
			}
                    }()
		};
		assemble=async function(js_tokens) {
                    return  await (async function() {
			let __for_body__701=async function(t) {
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
			let __array__702=[],__elements__700=js_tokens;
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
		{
                    await assemble(await flatten(await (async function(){
			let __array_op_rval__703=js_tree;
			if (__array_op_rval__703 instanceof Function){
                            return await __array_op_rval__703() 
			} else {
                            return[__array_op_rval__703]
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
		let __target_obj__704=root_ctx;
		__target_obj__704["defined_lisp_globals"]=new Object();
		return __target_obj__704;
		
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
			}  catch(__exception__705) {
                            if (__exception__705 instanceof Error) {
				let e=__exception__705;
				return console.error("pre-compilation: ",(e && e.message))
                            } 
			}
                    })();
                    if (check_true ((null==final_token_assembly))){
			is_error=new Error("Pre-Compilation Error");
			await (async function(){
                            let __array_op_rval__706=error_log;
                            if (__array_op_rval__706 instanceof Function){
				return await __array_op_rval__706("pre-compilation error") 
                            } else {
				return[__array_op_rval__706,"pre-compilation error"]
                            }
			})();
			console.error("pre-compilation error");
			is_error
                    } else {
			assembly=await compile(final_token_assembly,root_ctx,0);
			assembly=await (await Environment.get_global("splice_in_return_a"))(assembly);
			assembly=await (await Environment.get_global("splice_in_return_b"))(assembly)
                    };
                    if (check_true (is_error)){
			await (async function(){
                            let __array_op_rval__707=error_log;
                            if (__array_op_rval__707 instanceof Function){
				return await __array_op_rval__707("compilation",clone(is_error)) 
                            } else {
				return[__array_op_rval__707,"compilation",clone(is_error)]
                            }
			})()
                    };
                    if (check_true ((opts && opts["root_environment"]))){
			has_lisp_globals=false
                    };
                    await async function(){
			if (check_true( (await not(is_error)&&assembly&&(await first(assembly) instanceof Object)&&await (async function(){
                            let __targ__708=await first(assembly);
                            if (__targ__708){
				return(__targ__708)["ctype"]
                            } 
			})()&&(await not((await (async function(){
                            let __targ__709=await first(assembly);
                            if (__targ__709){
				return(__targ__709)["ctype"]
                            } 
			})() instanceof String || typeof await (async function(){
                            let __targ__709=await first(assembly);
                            if (__targ__709){
				return(__targ__709)["ctype"]
                            } 
			})()==='string'))||await (async function ()  {
                            let val;
                            val=await (async function(){
				let __targ__710=await first(assembly);
				if (__targ__710){
                                    return(__targ__710)["ctype"]
				} 
                            })();
                            return  (await not((val==="assignment"))&&await not(await (await Environment.get_global("contains?"))("block",val))&&await not(await (await Environment.get_global("contains?"))("unction",val)))
			} )())))) {
                            return await async function(){
				let __target_obj__711=(assembly && assembly["0"]);
				__target_obj__711["ctype"]="statement";
				return __target_obj__711;
				
                            }()
			} else if (check_true( ((await first(assembly) instanceof String || typeof await first(assembly)==='string')&&(await first(assembly)==="throw")))) {
                            return assembly=[{
				ctype:"block"
                            },assembly]
			} else if (check_true( (await not(is_error)&&(await not((await first(assembly) instanceof Object))||await not(await (async function(){
                            let __targ__712=await first(assembly);
                            if (__targ__712){
				return(__targ__712)["ctype"]
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
			await (async function(){
                            let __array_op_rval__713=error_log;
                            if (__array_op_rval__713 instanceof Function){
				return await __array_op_rval__713("compiler: is an error: ",is_error) 
                            } else {
				return[__array_op_rval__713,"compiler: is an error: ",is_error]
                            }
			})();
			return  is_error
                    } else {
			if (check_true ((await first(assembly) instanceof Object))){
                            return [(await Environment.get_global("add"))({
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
            if (check_true (((errors && errors.length)>0))){
		await map(async function(x) {
                    return  await (async function(){
			let __array_op_rval__714=error_log;
			if (__array_op_rval__714 instanceof Function){
                            return await __array_op_rval__714(x) 
			} else {
                            return[__array_op_rval__714,x]
			}
                    })()
		},errors)
            };
            if (check_true ((opts && opts["error_report"]))){
		await (async function(){
                    let __array_op_rval__715=(opts && opts["error_report"]);
                    if (__array_op_rval__715 instanceof Function){
			return await __array_op_rval__715(errors) 
                    } else {
			return[__array_op_rval__715,errors]
                    }
		})()
            };
            return  output
	}
    })}

var { get_next_environment_id, check_true, get_outside_global, subtype,lisp_writer, clone } = await import("./lisp_writer.js");

if (typeof AsyncFunction === "undefined") {
  globalThis.AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
}

async function init_dlisp()
{
  let symname;
  symname="dlisp_env";
  {
    await async function(){
      let __target_obj__1=globalThis;
      __target_obj__1[symname]=async function(opts) {
        {
          let subtype=function subtype(value) {  if (value === null) return "null";
						 else if (value === undefined) return "undefined";
						 else if (value instanceof Array) return "array";
						 else if (value.constructor && value.constructor!=null && value.constructor.name!=='Object') {
						   return value.constructor.name;
						 }
						 return typeof value;
					      };
          ;
          let Environment={
            global_ctx:{
              scope:new Object()
            },definitions:new Object(),declarations:{
              safety:{
                level:2
              }
            },externs:new Object()
          };
          ;
          let id=await get_next_environment_id();
          ;
          if (check_true ((undefined==opts))){
            opts=new Object()
          };
          await async function(){
            let __target_obj__2=Environment;
            __target_obj__2["context"]=(Environment && Environment["global_ctx"]);
            return __target_obj__2;
            
          }();
          let compiler=async function() {
            return  true
          };
          ;
          let MAX_SAFE_INTEGER=9007199254740991;
          ;
          await async function(){
            let __target_obj__3=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__3["MAX_SAFE_INTEGER"]=MAX_SAFE_INTEGER;
            return __target_obj__3;
            
          }();
          let sub_type=subtype;
          ;
          await async function(){
            let __target_obj__4=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__4["sub_type"]=sub_type;
            return __target_obj__4;
            
          }();
          let int=parseInt;
          ;
          await async function(){
            let __target_obj__5=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__5["int"]=int;
            return __target_obj__5;
            
          }();
          let float=parseFloat;
          ;
          await async function(){
            let __target_obj__6=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__6["float"]=float;
            return __target_obj__6;
            
          }();
          let values=new Function("...args","{\n                                let acc = [];\n                                for (let _i in args) {\n                                    let value = args[_i];\n                                    let type = subtype(value);\n                                    if (value instanceof Set)  {\n                                        acc = acc.concat(Array.from(value));\n                                    } else if (type==='array') {\n                                        acc = acc.concat(value);\n                                    } else if (type==='object') {\n                                        acc = acc.concat(Object.values(value))\n                                    } else {\n                                        acc = acc.concat(value);\n                                    }\n                                }\n                                return acc;\n                            }");
          ;
          await async function(){
            let __target_obj__7=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__7["values"]=values;
            return __target_obj__7;
            
          }();
          let pairs=new Function("obj","{\n                                    if (subtype(obj)==='array') {\n                                        let rval = [];\n                                        for (let i = 0; i < obj.length; i+=2) {\n                                            rval.push([obj[i],obj[i+1]]);\n                                        }\n                                        return rval;\n                                    } else {\n                                        let keys = Object.keys(obj);\n                                        let rval = keys.reduce(function(acc,x,i) {\n                                            acc.push([x,obj[x]])\n                                            return acc;\n                                        },[]);\n                                        return rval;\n                                    }\n                                }");
          ;
          await async function(){
            let __target_obj__8=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__8["pairs"]=pairs;
            return __target_obj__8;
            
          }();
          let keys=new Function("obj","{  return Object.keys(obj);  }");
          ;
          await async function(){
            let __target_obj__9=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__9["keys"]=keys;
            return __target_obj__9;
            
          }();
          let take=new Function("place","{ return place.shift() }");
          ;
          await async function(){
            let __target_obj__10=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__10["take"]=take;
            return __target_obj__10;
            
          }();
          let prepend=new Function("place","thing","{ return place.unshift(thing) }");
          ;
          await async function(){
            let __target_obj__11=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__11["prepend"]=prepend;
            return __target_obj__11;
            
          }();
          let first=new Function("x","{ return x[0] }");
          ;
          await async function(){
            let __target_obj__12=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__12["first"]=first;
            return __target_obj__12;
            
          }();
          let last=new Function("x","{ return x[x.length - 1] }");
          ;
          await async function(){
            let __target_obj__13=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__13["last"]=last;
            return __target_obj__13;
            
          }();
          let length=new Function("obj","{\n                                if(obj instanceof Array) {\n                                    return obj.length;\n                                } else if (obj instanceof Set) {\n                                    return obj.size;\n                                } else if ((obj === undefined)||(obj===null)) {\n                                    return 0;\n                                } else if (typeof obj==='object') {\n                                    return Object.keys(obj).length;\n                                } else if (typeof obj==='string') {\n                                    return obj.length;\n                                } \n                                return 0;\n                            }");
          ;
          await async function(){
            let __target_obj__14=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__14["length"]=length;
            return __target_obj__14;
            
          }();
          let conj=new Function("...args","{   let list = [];\n                                if (args[0] instanceof Array) {\n                                    list = args[0];\n                                } else {\n                                    list = [args[0]];\n                                }\n                                args.slice(1).map(function(x) {\n                                    list = list.concat(x);\n                                });\n                                return list;\n                            }");
          ;
          await async function(){
            let __target_obj__15=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__15["conj"]=conj;
            return __target_obj__15;
            
          }();
          let reverse=new Function("container","{ return container.slice(0).reverse }");
          ;
          await async function(){
            let __target_obj__16=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__16["reverse"]=reverse;
            return __target_obj__16;
            
          }();
          [await async function(){
            let __target_obj__17=(Environment && Environment["definitions"]);
            __target_obj__17["reverse"]={
              usage:["container:list"],description:"Returns a copy of the passed list as reversed.  The original is not changed.",tags:["list","sort","order"]
            };
            return __target_obj__17;
            
          }()];
          let map=new AsyncFunction("lambda","array_values","{ try {\n                                        let rval = [],\n                                                tl = array_values.length;\n                                        for (let i = 0; i < array_values.length; i++) {\n                                            rval.push(await lambda.apply(this,[array_values[i], i, tl]));\n                                         }\n                                        return rval;\n                                    } catch (ex) {           \n                                              if (lambda === undefined || lambda === null) {\n                                                    throw new ReferenceError(\"map: lambda argument (position 0) is undefined or nil\")\n                                              } else if (array_values === undefined || array_values === null) {\n                                                    throw new ReferenceError(\"map: container argument (position 1) is undefined or nil\")\n                                              } else if (!(lambda instanceof Function)) {\n                                                    throw new ReferenceError(\"map: lambda argument must be a function: received: \"+ typeof lambda)\n                                              } else if (!(array_values instanceof Array)) {\n                                                    throw new ReferenceError(\"map: invalid array argument, received: \" + typeof array_values)\n                                              } else {\n                                                    // something else just pass on the error\n                                                throw ex;\n                                              }\n                                    }\n                              }");
          ;
          await async function(){
            let __target_obj__18=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__18["map"]=map;
            return __target_obj__18;
            
          }();
          let bind=new Function("func,this_arg","{ return func.bind(this_arg) }");
          ;
          await async function(){
            let __target_obj__19=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__19["bind"]=bind;
            return __target_obj__19;
            
          }();
          let to_object=new Function("array_values","{\n                                      let obj={}\n                                      array_values.forEach((pair)=>{\n                                             obj[pair[0]]=pair[1]\n                                      });\n                                      return obj;\n                                    }");
          ;
          await async function(){
            let __target_obj__20=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__20["to_object"]=to_object;
            return __target_obj__20;
            
          }();
          let slice=async function(target,from,to) {
            return  await async function(){
              if (check_true(to)) {
                return await target["slice"].call(target,from,to)
              } else if (check_true(from)) {
                return await target["slice"].call(target,from)
              } else  {
                throw new SyntaxError("slice requires 2 or 3 arguments");
                
              }
            }()
          };
          ;
          await async function(){
            let __target_obj__21=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__21["slice"]=slice;
            return __target_obj__21;
            
          }();
          let rest=async function(x) {
            return  await async function(){
              if (check_true( (x instanceof Array))) {
                return await x["slice"].call(x,1)
              } else if (check_true( (x instanceof String || typeof x==='string'))) {
                return await x["substr"].call(x,1)
              } else  {
                return null
              }
            }()
          };
          ;
          await async function(){
            let __target_obj__22=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__22["rest"]=rest;
            return __target_obj__22;
            
          }();
          let second=new Function("x","{ return x[1] }");
          ;
          await async function(){
            let __target_obj__23=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__23["second"]=second;
            return __target_obj__23;
            
          }();
          let third=new Function("x","{ return x[2] }");
          ;
          await async function(){
            let __target_obj__24=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__24["third"]=third;
            return __target_obj__24;
            
          }();
          let chop=new Function("x","{ if (x instanceof Array) { return x.slice(x.length-1) } else { return x.substr(0,x.length-1) } }");
          ;
          await async function(){
            let __target_obj__25=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__25["chop"]=chop;
            return __target_obj__25;
            
          }();
          let chomp=new Function("x","{ return x.substr(x.length-1) }");
          ;
          await async function(){
            let __target_obj__26=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__26["chomp"]=chomp;
            return __target_obj__26;
            
          }();
          let not=new Function("x","{ if (check_true(x)) { return false } else { return true } }");
          ;
          await async function(){
            let __target_obj__27=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__27["not"]=not;
            return __target_obj__27;
            
          }();
          let push=new Function("place","thing","{ return place.push(thing) }");
          ;
          await async function(){
            let __target_obj__28=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__28["push"]=push;
            return __target_obj__28;
            
          }();
          let pop=new Function("place","{ return place.pop() }");
          ;
          await async function(){
            let __target_obj__29=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__29["pop"]=pop;
            return __target_obj__29;
            
          }();
          let list=async function(...args) {
            return  args
          };
          ;
          await async function(){
            let __target_obj__30=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__30["list"]=list;
            return __target_obj__30;
            
          }();
          let flatten=new Function("x","{ return x.flat(999999999999) } ");
          ;
          await async function(){
            let __target_obj__31=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__31["flatten"]=flatten;
            return __target_obj__31;
            
          }();
          let jslambda=async function(...args) {
            return  await (async function(){
              let __apply_args__32=await flatten(args);
              return ( Function).apply(this,__apply_args__32)
            })()
          };
          ;
          await async function(){
            let __target_obj__34=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__34["jslambda"]=jslambda;
            return __target_obj__34;
            
          }();
          let join=async function(...args) {
            return  await async function(){
              if (check_true( ((args && args.length)===1))) {
                return await args["join"].call(args,"")
              } else  {
                return await (args && args["1"])["join"].call((args && args["1"]),(args && args["0"]))
              }
            }()
          };
          ;
          await async function(){
            let __target_obj__35=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__35["join"]=join;
            return __target_obj__35;
            
          }();
          let lowercase=async function(x) {
            return  await x["toLowerCase"]()
          };
          ;
          await async function(){
            let __target_obj__36=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__36["lowercase"]=lowercase;
            return __target_obj__36;
            
          }();
          let uppercase=async function(x) {
            return  await x["toUpperCase"]()
          };
          ;
          await async function(){
            let __target_obj__37=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__37["uppercase"]=uppercase;
            return __target_obj__37;
            
          }();
          let log=async function(...args) {
            return  await (async function(){
              return ( console.log).apply(this,args)
            })()
          };
          ;
          await async function(){
            let __target_obj__40=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__40["log"]=log;
            return __target_obj__40;
            
          }();
          let split=new Function("container","token","{ return container.split(token) }");
          ;
          await async function(){
            let __target_obj__41=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__41["split"]=split;
            return __target_obj__41;
            
          }();
          let split_by=new Function("token","container","{ return container.split(token) }");
          ;
          await async function(){
            let __target_obj__42=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__42["split_by"]=split_by;
            return __target_obj__42;
            
          }();
          let is_object_ques_=new Function("x","{ return x instanceof Object }");
          ;
          await async function(){
            let __target_obj__43=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__43["is_object?"]=is_object_ques_;
            return __target_obj__43;
            
          }();
          let is_array_ques_=new Function("x","{ return x instanceof Array }");
          ;
          await async function(){
            let __target_obj__44=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__44["is_array?"]=is_array_ques_;
            return __target_obj__44;
            
          }();
          let is_number_ques_=async function(x) {
            return  (await subtype(x)==="Number")
          };
          ;
          await async function(){
            let __target_obj__45=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__45["is_number?"]=is_number_ques_;
            return __target_obj__45;
            
          }();
          let is_function_ques_=async function(x) {
            return  (x instanceof Function)
          };
          ;
          await async function(){
            let __target_obj__46=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__46["is_function?"]=is_function_ques_;
            return __target_obj__46;
            
          }();
          let is_set_ques_=new Function("x","{ return x instanceof Set }");
          ;
          await async function(){
            let __target_obj__47=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__47["is_set?"]=is_set_ques_;
            return __target_obj__47;
            
          }();
          let is_element_ques_=new Function("x","{ return x instanceof Element }");
          ;
          await async function(){
            let __target_obj__48=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__48["is_element?"]=is_element_ques_;
            return __target_obj__48;
            
          }();
          let is_string_ques_=async function(x) {
            return  ((x instanceof String)||(typeof x==="string"))
          };
          ;
          await async function(){
            let __target_obj__49=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__49["is_string?"]=is_string_ques_;
            return __target_obj__49;
            
          }();
          let is_nil_ques_=async function(x) {
            return  (x===null)
          };
          ;
          await async function(){
            let __target_obj__50=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__50["is_nil?"]=is_nil_ques_;
            return __target_obj__50;
            
          }();
          let ends_with_ques_=new Function("val","text","{ if (text instanceof Array) { return text[text.length-1]===val } else if (subtype(text)=='String') { return text.endsWith(val) } else { return false }}");
          ;
          await async function(){
            let __target_obj__51=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__51["ends_with?"]=ends_with_ques_;
            return __target_obj__51;
            
          }();
          let starts_with_ques_=new Function("val","text","{ if (text instanceof Array) { return text[0]===val } else if (subtype(text)=='String') { return text.startsWith(val) } else { return false }}");
          ;
          await async function(){
            let __target_obj__52=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__52["starts_with?"]=starts_with_ques_;
            return __target_obj__52;
            
          }();
          let blank_ques_=async function(val) {
            return  ((val==null)||((val instanceof String || typeof val==='string')&&(val==="")))
          };
          ;
          await async function(){
            let __target_obj__53=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__53["blank?"]=blank_ques_;
            return __target_obj__53;
            
          }();
          let contains_ques_=async function(value,container) {
            return  await async function(){
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
              } else if (check_true( (container instanceof Array))) {
                return await container["includes"].call(container,value)
              } else if (check_true( await (await get_global("is_set?"))(container))) {
                return await container["has"].call(container,value)
              } else  {
                throw new TypeError(("contains?: passed invalid container type: "+await sub_type(container)));
                
              }
            }()
          };
          ;
          await async function(){
            let __target_obj__54=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__54["contains?"]=contains_ques_;
            return __target_obj__54;
            
          }();
          let make_set=async function(vals) {
            if (check_true ((vals instanceof Array))){
              return new Set(vals)
            } else {
              let vtype;
              vtype=await sub_type(vals);
              return  await async function(){
                if (check_true( (vtype==="Set"))) {
                  return new Set(vals)
                } else if (check_true( (vtype==="object"))) {
                  return new Set(await values(vals))
                }
              }()
            }
          };
          ;
          await async function(){
            let __target_obj__55=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__55["make_set"]=make_set;
            return __target_obj__55;
            
          }();
          let describe=async function(quoted_symbol) {
            let not_found;
            let __location__56= async function(){
              return await async function(){
                if (check_true( await (async function(){
                  let __targ__57=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
                  if (__targ__57){
                    return(__targ__57)[quoted_symbol]
                  } 
                })())) {
                  return "global"
                } else if (check_true( await not((undefined===await get_outside_global(quoted_symbol))))) {
                  return "external"
                } else  {
                  return null
                }
              }()
            };
            let result;
            {
              not_found={
                not_found:true
              };
              let location=await __location__56();
              ;
              result=null;
              result=await (await get_global("add"))({
                type:await async function(){
                  if (check_true( (location==="global"))) {
                    return await sub_type(await (async function(){
                      let __targ__58=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
                      if (__targ__58){
                        return(__targ__58)[quoted_symbol]
                      } 
                    })())
                  } else if (check_true( (location==="external"))) {
                    return await sub_type(await get_outside_global(quoted_symbol))
                  } else  {
                    return "undefined"
                  }
                }(),location:location
              },await (async function() {
                if (check_true (await (async function(){
                  let __targ__59=(Environment && Environment["definitions"]);
                  if (__targ__59){
                    return(__targ__59)[quoted_symbol]
                  } 
                })())){
                  return await (async function(){
                    let __targ__60=(Environment && Environment["definitions"]);
                    if (__targ__60){
                      return(__targ__60)[quoted_symbol]
                    } 
                  })()
                } else {
                  return new Object()
                } 
              } )());
              if (check_true ((result && result["description"]))){
                await async function(){
                  let __target_obj__61=result;
                  __target_obj__61["description"]=await Environment["eval"].call(Environment,(result && result["description"]));
                  return __target_obj__61;
                  
                }()
              };
              return  result
            }
          };
          ;
          await async function(){
            let __target_obj__62=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__62["describe"]=describe;
            return __target_obj__62;
            
          }();
          let undefine=async function(quoted_symbol) {
            if (check_true (await (async function(){
              let __targ__63=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
              if (__targ__63){
                return(__targ__63)[quoted_symbol]
              } 
            })())){
              return await (await get_global("delete_prop"))((Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]),quoted_symbol)
            } else {
              return false
            }
          };
          ;
          await async function(){
            let __target_obj__64=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__64["undefine"]=undefine;
            return __target_obj__64;
            
          }();
          let eval_exp=async function(expression) {
            await console.log("EVAL:",expression);
            return  await (async function(){
              let __array_op_rval__65=expression;
              if (__array_op_rval__65 instanceof Function){
                return await __array_op_rval__65() 
              } else {
                return[__array_op_rval__65]
              }
            })()
          };
          ;
          await async function(){
            let __target_obj__66=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__66["eval_exp"]=eval_exp;
            return __target_obj__66;
            
          }();
          let indirect_new=new Function("...args","{\n                                    let targetClass = args[0];\n                                    if (subtype(targetClass)===\"String\") {\n                                        let tmpf=new Function(\"{ return \"+targetClass+\" }\");\n                                        targetClass = tmpf();\n                                    }\n                                    if (args.length==1) {\n                                        let f = function(Class) {\n                                            return new (Function.prototype.bind.apply(Class, args));\n                                        }\n                                        let rval = f.apply(this,[targetClass]);\n                                        return rval;\n                                    } else {\n                                        let f = function(Class) {\n                                            return new (Function.prototype.bind.apply(Class, args));\n                                        }\n                                        let rval = f.apply(this,[targetClass].concat(args.slice(1)));\n                                        return rval;\n                                    }}");
          ;
          await async function(){
            let __target_obj__67=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__67["indirect_new"]=indirect_new;
            return __target_obj__67;
            
          }();
          let range=async function(...args) {
            let from_to;
            let step;
            let idx;
            let acc;
            from_to=await (async function () {
              if (check_true ((args && args["1"]))){
                return [parseInt((args && args["0"])),parseInt((args && args["1"]))]
              } else {
                return [0,parseInt((args && args["0"]))]
              } 
            })();
            step=await (async function () {
              if (check_true ((args && args["2"]))){
                return parseFloat((args && args["2"]))
              } else {
                return 1
              } 
            })();
            idx=(from_to && from_to["0"]);
            acc=[];
            await (async function(){
              let __test_condition__68=async function() {
                return  (idx<(from_to && from_to["1"]))
              };
              let __body_ref__69=async function() {
                (acc).push(idx);
                return  idx+=step
              };
              let __BREAK__FLAG__=false;
              while(await __test_condition__68()) {
                await __body_ref__69();
                if(__BREAK__FLAG__) {
                  break;
                  
                }
              } ;
              
            })();
            return  acc
          };
          ;
          await async function(){
            let __target_obj__70=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__70["range"]=range;
            return __target_obj__70;
            
          }();
          let add=new Function("...args","{\n                                let acc;\n                                if (typeof args[0]===\"number\") {\n                                    acc = 0;\n                                } else if (args[0] instanceof Array) {\n                                    return args[0].concat(args.slice(1));\n                                } else if (typeof args[0]==='object') {\n                                   let rval = {};\n                                   for (let i in args) {\n                                        if (typeof args[i] === 'object') {\n                                            for (let k in args[i]) {\n                                                rval[k] = args[i][k];\n                                            }\n                                        }\n                                   }\n                                   return rval;\n                                } else {\n                                    acc = \"\";\n                                }\n                                for (let i in args) {\n                                    acc += args[i];\n                                }\n                                return acc;\n                             }");
          ;
          await async function(){
            let __target_obj__71=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__71["add"]=add;
            return __target_obj__71;
            
          }();
          let merge_objects=new Function("x","{\n                                    let rval = {};\n                                    for (let i in x) {\n                                        if (typeof i === 'object') {\n                                            for (let k in x[i]) {\n                                                rval[k] = x[i][k];\n                                            }\n                                        }\n                                    }\n                                    return rval;\n                                 }");
          ;
          await async function(){
            let __target_obj__72=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__72["merge_objects"]=merge_objects;
            return __target_obj__72;
            
          }();
          let index_of=new Function("value,container","{ let searcher = (v) => v == value; return container.findIndex(searcher);}");
          ;
          await async function(){
            let __target_obj__73=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__73["index_of"]=index_of;
            return __target_obj__73;
            
          }();
          let resolve_path=new Function("path,obj","{\n                                        if (typeof path==='string') {\n                                            path = path.split(\".\");\n                                        }\n                                        let s=obj;\n                                        return path.reduce(function(prev, curr) {\n                                            return prev ? prev[curr] : undefined\n                                        }, obj || {})\n                                    }");
          ;
          await async function(){
            let __target_obj__74=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__74["resolve_path"]=resolve_path;
            return __target_obj__74;
            
          }();
          let delete_prop=new Function("obj","...args","{\n                                        if (args.length == 1) {\n                                            return delete obj[args[0]];\n                                        } else {\n                                            while (args.length > 0) {\n                                                let prop = args.shift();\n                                                delete obj[prop];\n                                            }\n                                        }\n                                        return obj;\n                                    }");
          ;
          await async function(){
            let __target_obj__75=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__75["delete_prop"]=delete_prop;
            return __target_obj__75;
            
          }();
          let min_value=new Function("elements","{ return Math.min(...elements); }");
          ;
          await async function(){
            let __target_obj__76=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__76["min_value"]=min_value;
            return __target_obj__76;
            
          }();
          let max_value=new Function("elements","{ return Math.max(...elements); }");
          ;
          await async function(){
            let __target_obj__77=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__77["max_value"]=max_value;
            return __target_obj__77;
            
          }();
          let interlace=async function(...args) {
            let min_length;
            let rlength_args;
            let rval;
            min_length=await min_value(await map(length,args));
            rlength_args=await range(await length(args));
            rval=[];
            await (async function() {
              let __for_body__80=async function(i) {
                return  await (async function() {
                  let __for_body__84=async function(j) {
                    return  (rval).push(await (async function(){
                      let __targ__87=await (async function(){
                        let __targ__86=args;
                        if (__targ__86){
                          return(__targ__86)[j]
                        } 
                      })();
                      if (__targ__87){
                        return(__targ__87)[i]
                      } 
                    })())
                  };
                  let __array__85=[],__elements__83=rlength_args;
                  let __BREAK__FLAG__=false;
                  for(let __iter__82 in __elements__83) {
                    __array__85.push(await __for_body__84(__elements__83[__iter__82]));
                    if(__BREAK__FLAG__) {
                      __array__85.pop();
                      break;
                      
                    }
                  }return __array__85;
                  
                })()
              };
              let __array__81=[],__elements__79=await range(min_length);
              let __BREAK__FLAG__=false;
              for(let __iter__78 in __elements__79) {
                __array__81.push(await __for_body__80(__elements__79[__iter__78]));
                if(__BREAK__FLAG__) {
                  __array__81.pop();
                  break;
                  
                }
              }return __array__81;
              
            })();
            return  rval
          };
          ;
          await async function(){
            let __target_obj__88=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__88["interlace"]=interlace;
            return __target_obj__88;
            
          }();
          [await async function(){
            let __target_obj__89=(Environment && Environment["definitions"]);
            __target_obj__89["interlace"]={
              usage:["list0:array","list1:array","listn?:array"],description:"Returns a list containing a consecutive values from each list, in argument order.  I.e. list0.0 list1.0 listn.0 list0.1 list1.1 listn.1 ...",tags:["list","array","join","merge"]
            };
            return __target_obj__89;
            
          }()];
          let trim=async function(x) {
            return  await x["trim"]()
          };
          ;
          await async function(){
            let __target_obj__90=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__90["trim"]=trim;
            return __target_obj__90;
            
          }();
          let assert=async function(assertion_form,failure_message) {
            if (check_true (assertion_form)){
              return assertion_form
            } else throw new EvalError((failure_message||"assertion failure"));
            
          };
          ;
          await async function(){
            let __target_obj__91=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__91["assert"]=assert;
            return __target_obj__91;
            
          }();
          [await async function(){
            let __target_obj__92=(Environment && Environment["definitions"]);
            __target_obj__92["assert"]={
              description:"If the evaluated assertion form is true, the result is returned, otherwise an EvalError is thrown with the optionally provided failure message.",usage:["form:*","failure_message:string?"],tags:["true","error","check","debug","valid","assertion"]
            };
            return __target_obj__92;
            
          }()];
          let unquotify=async function(val) {
            let dval;
            dval=val;
            if (check_true (await (await get_global("starts_with?"))("\"",dval))){
              dval=await dval["substr"].call(dval,1,((dval && dval["length"])-2))
            };
            if (check_true (await (await get_global("starts_with?"))("=:",dval))){
              dval=await dval["substr"].call(dval,2)
            };
            return  dval
          };
          ;
          await async function(){
            let __target_obj__93=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__93["unquotify"]=unquotify;
            return __target_obj__93;
            
          }();
          [await async function(){
            let __target_obj__94=(Environment && Environment["definitions"]);
            __target_obj__94["unquotify"]={
              description:"Removes binding symbols and quotes from a supplied value.  For use in compile time function such as macros.",usage:["val:string"],tags:["macro","quote","quotes","desym"]
            };
            return __target_obj__94;
            
          }()];
          let or_args=async function(argset) {
            let is_true;
            is_true=false;
            await (async function() {
              let __for_body__97=async function(elem) {
                if (check_true (elem)){
                  is_true=true;
                  __BREAK__FLAG__=true;
                  return
                }
              };
              let __array__98=[],__elements__96=argset;
              let __BREAK__FLAG__=false;
              for(let __iter__95 in __elements__96) {
                __array__98.push(await __for_body__97(__elements__96[__iter__95]));
                if(__BREAK__FLAG__) {
                  __array__98.pop();
                  break;
                  
                }
              }return __array__98;
              
            })();
            return  is_true
          };
          ;
          await async function(){
            let __target_obj__99=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__99["or_args"]=or_args;
            return __target_obj__99;
            
          }();
          let defclog=async function(opts) {
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
                let __target_arg__102=[].concat(await conj(await (async function(){
                  let __array_op_rval__103=style;
                  if (__array_op_rval__103 instanceof Function){
                    return await __array_op_rval__103() 
                  } else {
                    return[__array_op_rval__103]
                  }
                })(),args));
                if(!__target_arg__102 instanceof Array){
                  throw new TypeError("Invalid final argument to apply - an array is required")
                }let __pre_arg__104=("%c"+await (async function () {
                  if (check_true ((opts && opts["prefix"]))){
                    return (opts && opts["prefix"])
                  } else {
                    return (args).shift()
                  } 
                })());
                __target_arg__102.unshift(__pre_arg__104);
                return (console.log).apply(this,__target_arg__102)
              })()
            }
          };
          ;
          await async function(){
            let __target_obj__105=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__105["defclog"]=defclog;
            return __target_obj__105;
            
          }();
          let NOT_FOUND=new ReferenceError("not found");
          ;
          await async function(){
            let __target_obj__106=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__106["NOT_FOUND"]=NOT_FOUND;
            return __target_obj__106;
            
          }();
          let check_external_env_default=true;
          ;
          await async function(){
            let __target_obj__107=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__107["check_external_env_default"]=check_external_env_default;
            return __target_obj__107;
            
          }();
          let set_global=async function(refname,value,meta) {
            if (check_true (await not((typeof refname==="string"))))throw new TypeError("reference name must be a string type");
            ;
            await async function(){
              let __target_obj__108=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
              __target_obj__108[refname]=value;
              return __target_obj__108;
              
            }();
            if (check_true (((meta instanceof Object)&&await not((meta instanceof Array))))){
              await async function(){
                let __target_obj__109=(Environment && Environment["definitions"]);
                __target_obj__109[refname]=meta;
                return __target_obj__109;
                
              }()
            };
            return  await (async function(){
              let __targ__110=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
              if (__targ__110){
                return(__targ__110)[refname]
              } 
            })()
          };
          ;
          await async function(){
            let __target_obj__111=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__111["set_global"]=set_global;
            return __target_obj__111;
            
          }();
          let get_global=async function(refname,value_if_not_found,suppress_check_external_env) {
            return  await async function(){
              if (check_true( await not((typeof refname==="string")))) {
                throw new TypeError("reference name must be a string type");
                
              } else if (check_true( (refname==="Environment"))) {
                return Environment
              } else  {
                let comps;
                let refval;
                let check_external_env;
                comps=await get_object_path(refname);
                refval=null;
                check_external_env=await (async function () {
                  if (check_true (suppress_check_external_env)){
                    return false
                  } else {
                    return check_external_env_default
                  } 
                })();
                refval=(await (async function(){
                  let __targ__112=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
                  if (__targ__112){
                    return(__targ__112)[(comps && comps["0"])]
                  } 
                })()||await (async function () {
                  if (check_true (check_external_env)){
                    return (await (async function(){
                      let __targ__113=(Environment && Environment["externs"]);
                      if (__targ__113){
                        return(__targ__113)[(comps && comps["0"])]
                      } 
                    })()||await get_outside_global((comps && comps["0"]))||NOT_FOUND)
                  } else {
                    return NOT_FOUND
                  } 
                })());
                if (check_true ((undefined===await (async function(){
                  let __targ__114=(Environment && Environment["externs"]);
                  if (__targ__114){
                    return(__targ__114)[(comps && comps["0"])]
                  } 
                })()))){
                  await async function(){
                    let __target_obj__115=(Environment && Environment["externs"]);
                    __target_obj__115[(comps && comps["0"])]=refval;
                    return __target_obj__115;
                    
                  }()
                };
                return  await async function(){
                  if (check_true( (NOT_FOUND===refval))) {
                    return (value_if_not_found||NOT_FOUND)
                  } else if (check_true( ((comps && comps.length)===1))) {
                    return refval
                  } else if (check_true( ((comps && comps.length)>1))) {
                    return  await resolve_path(await rest(comps),refval)
                  } else  {
                    await console.warn("get_global: condition fall through: ",comps);
                    return  NOT_FOUND
                  }
                }()
              }
            }()
          };
          ;
          await async function(){
            let __target_obj__116=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__116["get_global"]=get_global;
            return __target_obj__116;
            
          }();
          let compile=async function(json_expression,opts) {
            return  await compiler(json_expression,{
              env:Environment
            })
          };
          ;
          await async function(){
            let __target_obj__117=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__117["compile"]=compile;
            return __target_obj__117;
            
          }();
          let env_log=await defclog({
            prefix:("env"+id),background:"#B0F0C0"
          });
          ;
          await async function(){
            let __target_obj__118=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__118["env_log"]=env_log;
            return __target_obj__118;
            
          }();
          let evaluate=async function(expression,ctx,opts) {
            let compiled;
            let result;
            opts=(opts||new Object());
            compiled=null;
            result=null;
            if (check_true ((opts && opts["compiled_source"]))){
              compiled=expression
            } else {
              compiled=await compiler(await (async function() {
                if (check_true ((opts && opts["json_in"]))){
                  return expression
                } else {
                  return await Environment["read_lisp"].call(Environment,expression)
                } 
              } )(),{
                env:Environment,ctx:ctx,formatted_output:true,error_report:((opts && opts["error_report"])||null),quiet_mode:((opts && opts["quiet_mode"])||false)
              })
            };
            if (check_true ((opts && opts["on_compilation_complete"]))){
              await (async function(){
                let __array_op_rval__119=(opts && opts["on_compilation_complete"]);
                if (__array_op_rval__119 instanceof Function){
                  return await __array_op_rval__119(compiled) 
                } else {
                  return[__array_op_rval__119,compiled]
                }
              })()
            };
            await (async function(){
              try /* TRY COMPLEX */ {
                return  result=await async function(){
                  if (check_true((compiled && compiled["error"]))) {
                    throw new Error((await Environment.get_global("indirect_new"))(compiled.error,(compiled && compiled["message"])));
                    
                  } else if (check_true( ((compiled && compiled["0"] && compiled["0"]["ctype"])&&(await (await get_global("contains?"))("block",(compiled && compiled["0"] && compiled["0"]["ctype"]))||((compiled && compiled["0"] && compiled["0"]["ctype"])==="assignment")||((compiled && compiled["0"] && compiled["0"]["ctype"])==="__!NOT_FOUND!__"))))) {
                    if (check_true (await (async function(){
                      let __array_op_rval__121=(compiled && compiled["0"] && compiled["0"]["has_lisp_globals"]);
                      if (__array_op_rval__121 instanceof Function){
                        return await __array_op_rval__121() 
                      } else {
                        return[__array_op_rval__121]
                      }
                    })())){
                      await async function(){
                        let __target_obj__122=compiled;
                        __target_obj__122[1]=new AsyncFunction("Environment",("{ "+(compiled && compiled["1"])+"}"));
                        return __target_obj__122;
                        
                      }();
                      return  await (async function(){
                        let __array_op_rval__123=(compiled && compiled["1"]);
                        if (__array_op_rval__123 instanceof Function){
                          return await __array_op_rval__123(Environment) 
                        } else {
                          return[__array_op_rval__123,Environment]
                        }
                      })()
                    } else {
                      await async function(){
                        let __target_obj__124=compiled;
                        __target_obj__124[1]=new AsyncFunction(("{"+(compiled && compiled["1"])+"}"));
                        return __target_obj__124;
                        
                      }();
                      return  await (async function(){
                        let __array_op_rval__125=(compiled && compiled["1"]);
                        if (__array_op_rval__125 instanceof Function){
                          return await __array_op_rval__125() 
                        } else {
                          return[__array_op_rval__125]
                        }
                      })()
                    }
                  } else if (check_true( ((compiled && compiled["0"] && compiled["0"]["ctype"])&&(("AsyncFunction"===(compiled && compiled["0"] && compiled["0"]["ctype"]))||("statement"===(compiled && compiled["0"] && compiled["0"]["ctype"]))||("objliteral"===(compiled && compiled["0"] && compiled["0"]["ctype"])))))) {
                    if (check_true (await (async function(){
                      let __array_op_rval__126=(compiled && compiled["0"] && compiled["0"]["has_lisp_globals"]);
                      if (__array_op_rval__126 instanceof Function){
                        return await __array_op_rval__126() 
                      } else {
                        return[__array_op_rval__126]
                      }
                    })())){
                      await async function(){
                        let __target_obj__127=compiled;
                        __target_obj__127[1]=new AsyncFunction("Environment",("{ return "+(compiled && compiled["1"])+"} "));
                        return __target_obj__127;
                        
                      }();
                      return  await (async function(){
                        let __array_op_rval__128=(compiled && compiled["1"]);
                        if (__array_op_rval__128 instanceof Function){
                          return await __array_op_rval__128(Environment) 
                        } else {
                          return[__array_op_rval__128,Environment]
                        }
                      })()
                    } else {
                      await async function(){
                        let __target_obj__129=compiled;
                        __target_obj__129[1]=new AsyncFunction(("{ return "+(compiled && compiled["1"])+"}"));
                        return __target_obj__129;
                        
                      }();
                      return  await (async function(){
                        let __array_op_rval__130=(compiled && compiled["1"]);
                        if (__array_op_rval__130 instanceof Function){
                          return await __array_op_rval__130() 
                        } else {
                          return[__array_op_rval__130]
                        }
                      })()
                    }
                  } else if (check_true( ((compiled && compiled["0"] && compiled["0"]["ctype"])&&("Function"===(compiled && compiled["0"] && compiled["0"]["ctype"]))))) {
                    if (check_true (await (async function(){
                      let __array_op_rval__131=(compiled && compiled["0"] && compiled["0"]["has_lisp_globals"]);
                      if (__array_op_rval__131 instanceof Function){
                        return await __array_op_rval__131() 
                      } else {
                        return[__array_op_rval__131]
                      }
                    })())){
                      await async function(){
                        let __target_obj__132=compiled;
                        __target_obj__132[1]=new Function("Environment",("{ return "+(compiled && compiled["1"])+"} "));
                        return __target_obj__132;
                        
                      }();
                      return  await (async function(){
                        let __array_op_rval__133=(compiled && compiled["1"]);
                        if (__array_op_rval__133 instanceof Function){
                          return await __array_op_rval__133(Environment) 
                        } else {
                          return[__array_op_rval__133,Environment]
                        }
                      })()
                    } else {
                      await async function(){
                        let __target_obj__134=compiled;
                        __target_obj__134[1]=new Function(("{ return "+(compiled && compiled["1"])+"}"));
                        return __target_obj__134;
                        
                      }();
                      return  await (async function(){
                        let __array_op_rval__135=(compiled && compiled["1"]);
                        if (__array_op_rval__135 instanceof Function){
                          return await __array_op_rval__135() 
                        } else {
                          return[__array_op_rval__135]
                        }
                      })()
                    }
                  } else  {
                    return (compiled && compiled["1"])
                  }
                }()
              }  catch(__exception__120) {
                if (__exception__120 instanceof Error) {
                  let e=__exception__120;
                  {
                    if (check_true ((opts && opts["error_report"]))){
                      await (async function(){
                        let __array_op_rval__136=(opts && opts["error_report"]);
                        if (__array_op_rval__136 instanceof Function){
                          return await __array_op_rval__136({
                            error:(e && e.name),message:(e && e.message),form:null,parent_forms:null,invalid:true,text:(e && e.stack)
                          }) 
                        } else {
                          return[__array_op_rval__136,{
                            error:(e && e.name),message:(e && e.message),form:null,parent_forms:null,invalid:true,text:(e && e.stack)
                          }]
                        }
                      })()
                    };
                    result=e;
                    if (check_true ((ctx&&(ctx && ctx["in_try"]))))throw new Error(result);
                    
                  }
                } 
              }
            })();
            return  result
          };
          ;
          await async function(){
            let __target_obj__137=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__137["evaluate"]=evaluate;
            return __target_obj__137;
            
          }();
          let eval_struct=async function(lisp_struct,ctx,opts) {
            let rval;
            rval=null;
            if (check_true (lisp_struct instanceof Function)){
              rval=await (async function(){
                let __array_op_rval__138=lisp_struct;
                if (__array_op_rval__138 instanceof Function){
                  return await __array_op_rval__138() 
                } else {
                  return[__array_op_rval__138]
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
            let __target_obj__139=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__139["eval_struct"]=eval_struct;
            return __target_obj__139;
            
          }();
          let meta_for_symbol=async function(quoted_symbol) {
            if (check_true (await (await get_global("starts_with?"))("=:",quoted_symbol))){
              return await (async function(){
                let __targ__140=(Environment && Environment["definitions"]);
                if (__targ__140){
                  return(__targ__140)[await quoted_symbol["substr"].call(quoted_symbol,2)]
                } 
              })()
            } else {
              return await (async function(){
                let __targ__141=(Environment && Environment["definitions"]);
                if (__targ__141){
                  return(__targ__141)[quoted_symbol]
                } 
              })()
            }
          };
          ;
          let set_compiler=async function(compiler_function) {
            compiler=compiler_function;
            return  await async function(){
              let __target_obj__142=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
              __target_obj__142["compiler"]=compiler;
              return __target_obj__142;
              
            }()
          };
          ;
          await async function(){
            let __target_obj__143=Environment;
            __target_obj__143["get_global"]=get_global;
            __target_obj__143["set_global"]=set_global;
            return __target_obj__143;
            
          }();
          let reader=async function(text,opts) {    let output_structure;    let idx;
						    let line_number;
						    let column_number;
						    let len;
						    let in_buffer;
						    let in_code;
						    let in_quotes;
						    let in_long_text;
						    let in_comment;
						    let local_text;
						    let position;
						    let in_single_quote;
						    let mode;
						    let read_table;
						    let get_char;
						    let handle_escape_char;
						    let process_word;
						    let registered_stop_char;
						    let handler_stack;
						    let handler;
						    let c;
						    let next_c;
						    let depth;
						    let __stop__1= async function(){
						      return false
						    };
						    let read_block;
						    {
						      output_structure=[];
						      idx=-1;
						      line_number=0;
						      column_number=0;
						      opts=(opts||new Object());
						      len=(await (await Environment.get_global("length"))(text)-1);
						      in_buffer=text.split("");
						      in_code=0;
						      in_quotes=1;
						      in_long_text=2;
						      in_comment=3;
						      local_text=async function() {
							let start;
							let end;
							start=await Math.max(0,(idx-10));
							end=await Math.max(await (await Environment.get_global("length"))(in_buffer),(idx+10));
							return  in_buffer.slice(start,end).join("")
						      };
						      position=async function() {
							return  ("line: "+line_number+" column: "+column_number)
						      };
						      in_single_quote=4;
						      mode=in_code;
						      read_table=await ( async function(){
							let __obj__2=new Object();
							__obj__2["("]=[")",async function(block) {
							  return  block
							}];
							__obj__2["["]=["]",async function(block) {
							  return  block
							}];
							__obj__2["{"]=["}",async function(block) {
							  let obj;
							  let __idx__3= async function(){
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
							    let idx=await __idx__3();
							    ;
							    key_mode=0;
							    need_colon=1;
							    value_mode=2;
							    key=null;
							    value=null;
							    cpos=null;
							    state=key_mode;
							    block_length=(await (await Environment.get_global("length"))(block)-1);
							    await (async function(){
							      let __test_condition__4=async function() {
								return  (idx<block_length)
							      };
							      let __body_ref__5=async function() {
								idx+=1;
								key=await (async function(){
								  let __targ__6=block;
								  if (__targ__6){
								    return(__targ__6)[idx]
								  } 
								})();
								if (check_true ((key instanceof Array&&(( key && key.length )===2)&&(( key && key["0"] )==="=:quotem")&&(( key && key["1"] ) instanceof String || typeof ( key && key["1"] )==='string')))){
								  key=( key && key["1"] )
								};
								if (check_true (((key instanceof String || typeof key==='string')&&await (await Environment.get_global("starts_with?"))("=:",key)&&(await (await Environment.get_global("length"))(key)>2)))){
								  key=await key["substr"].call(key,2)
								};
								return  await async function(){
								  if (check_true( await (await Environment.get_global("blank?"))(key))) {
								    throw new SyntaxError((""+await position()+": blank or nil key: "+await (async function(){
								      let __targ__7=block;
								      if (__targ__7){
									return(__targ__7)[idx]
								      } 
								    })()+" -->"+await local_text()+"<--"));
								    
								  } else if (check_true( await (await Environment.get_global("is_number?"))(key))) {
								    idx+=1;
								    return  await async function(){
								      let __target_obj__8=obj;
								      __target_obj__8[key]=await (async function(){
									let __targ__9=block;
									if (__targ__9){
									  return(__targ__9)[idx]
									} 
								      })();
								      return __target_obj__8;
								      
								    }()
								  } else if (check_true( ((key instanceof String || typeof key==='string')&&await (await Environment.get_global("contains?"))(":",key)&&await (await Environment.get_global("not"))(await (await Environment.get_global("ends_with?"))(":",key))))) {
								    cpos=await key["indexOf"].call(key,":");
								    value=await key["substr"].call(key,(cpos+1));
								    key=await key["substr"].call(key,0,cpos);
								    return  await async function(){
								      let __target_obj__10=obj;
								      __target_obj__10[key]=value;
								      return __target_obj__10;
								      
								    }()
								  } else  {
								    idx+=1;
								    if (check_true (await (await Environment.get_global("ends_with?"))(":",key))){
								      key=key.substr(0,(key.length-1))
								    } else {
								      if (check_true ((await (async function(){
									let __targ__11=block;
									if (__targ__11){
									  return(__targ__11)[idx]
									} 
								      })()===":"))){
									idx+=1
								      } else throw new SyntaxError((""+await position()+"missing colon in object key: "+key+" -->"+await local_text()));
								      
								    };
								    return  await async function(){
								      let __target_obj__12=obj;
								      __target_obj__12[key]=await (async function(){
									let __targ__13=block;
									if (__targ__13){
									  return(__targ__13)[idx]
									} 
								      })();
								      return __target_obj__12;
								      
								    }()
								  }
								}()
							      };
							      let __BREAK__FLAG__=false;
							      while(await __test_condition__4()) {
								await __body_ref__5();
								if(__BREAK__FLAG__) {
								  break;
								  
								}
							      } ;
							      
							    })();
							    return  obj
							  }
							}];
							__obj__2["\""]=["\"",async function(block) {
							  return  ["quotes",block]
							}];
							return __obj__2;
							
						      })();
						      get_char=async function(pos) {
							return  await (async function(){
							  let __targ__14=in_buffer;
							  if (__targ__14){
							    return(__targ__14)[pos]
							  } 
							})()
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
							}()
						      };
						      process_word=async function(word_acc,backtick_mode) {
							let word;
							let word_as_number;
							word=word_acc.join("");
							word_as_number=await parseFloat(word);
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
							      } else if (check_true( await (await Environment.get_global("contains?"))(word,["=:(","=:)","=:'"]))) {
								return  word
							      } else if (check_true( (backtick_mode===1))) {
								return word
							      } else  {
								return await (await Environment.get_global("add"))("=:",word)
							      }
							    }()
							  } else if (check_true( await (await Environment.get_global("is_number?"))(word_as_number))) {
							    return word_as_number
							  } else  {
							    console.log("reader: ",await position()," what is this?",word,word_acc,await local_text());
							    return  word
							  }
							}()
						      };
						      registered_stop_char=null;
						      handler_stack=[];
						      handler=null;
						      c=null;
						      next_c=null;
						      depth=0;
						      let stop=await __stop__1();
						      ;
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
							  acc.push(_prefix_op)
							};
							await (async function(){
							  let __test_condition__15=async function() {
							    return  (await (await Environment.get_global("not"))(stop)&&(idx<len))
							  };
							  let __body_ref__16=async function() {
							    idx+=1;
							    escape_mode=await Math.max(0,(escape_mode-1));
							    c=await get_char(idx);
							    next_c=await get_char((idx+1));
							    if (check_true ((c==="\n"))){
							      line_number+=1;
							      column_number=0
							    };
							    await async function(){
							      if (check_true( ((c==="\n")&&(mode===in_comment)))) {
								mode=in_code;
								__BREAK__FLAG__=true;
								return
							      } else if (check_true( ((mode>0)&&(92===await c["charCodeAt"].call(c,0))))) {
								return  escape_mode=2
							      } else if (check_true( ((mode>0)&&(escape_mode===1)))) {
								return  word_acc.push(await handle_escape_char(c))
							      } else if (check_true( ((mode===in_long_text)&&(escape_mode===0)&&(c==="|")))) {
								acc.push(word_acc.join(""));
								word_acc=[];
								mode=in_code;
								__BREAK__FLAG__=true;
								return
							      } else if (check_true( ((mode===in_quotes)&&(escape_mode===0)&&(c==="\"")))) {
								acc=await (await Environment.get_global("add"))(word_acc.join(""));
								word_acc=[];
								mode=in_code;
								__BREAK__FLAG__=true;
								return
							      } else if (check_true( ((mode===in_single_quote)&&(escape_mode===0)&&(c==="'")))) {
								acc=await (await Environment.get_global("add"))(word_acc.join(""));
								word_acc=[];
								mode=in_code;
								__BREAK__FLAG__=true;
								return
							      } else if (check_true( ((c==="|")&&(mode===in_code)))) {
								if (check_true ((( word_acc && word_acc.length )>0))){
								  acc.push(await process_word(word_acc));
								  word_acc=[]
								};
								mode=in_long_text;
								block_return=await read_block(await (await Environment.get_global("add"))(_depth,1));
								if (check_true ((backtick_mode===1))){
								  block_return=["=:quotem",block_return];
								  backtick_mode=0
								};
								return  acc.push(block_return)
							      } else if (check_true( ((c==="\"")&&(escape_mode===0)&&(mode===in_code)))) {
								if (check_true ((( word_acc && word_acc.length )>0))){
								  acc.push(await process_word(word_acc));
								  word_acc=[]
								};
								mode=in_quotes;
								block_return=await read_block(await (await Environment.get_global("add"))(_depth,1));
								if (check_true ((backtick_mode===1))){
								  backtick_mode=0
								};
								return  acc.push(block_return)
							      } else if (check_true( ((c==="'")&&(escape_mode===0)&&(mode===in_code)))) {
								if (check_true ((( word_acc && word_acc.length )>0))){
								  acc.push(await process_word(word_acc));
								  word_acc=[]
								};
								mode=in_single_quote;
								block_return=await read_block(await (await Environment.get_global("add"))(_depth,1));
								if (check_true ((backtick_mode===1))){
								  backtick_mode=0
								};
								return  acc.push(block_return)
							      } else if (check_true( (mode===in_comment))) {
								return false
							      } else if (check_true( ((c===";")&&(mode===in_code)))) {
								if (check_true ((( word_acc && word_acc.length )>0))){
								  acc.push(await process_word(word_acc));
								  word_acc=[]
								};
								mode=in_comment;
								return  await read_block(await (await Environment.get_global("add"))(_depth,1))
							      } else if (check_true( ((mode===in_code)&&(await (await Environment.get_global("length"))(handler_stack)>0)&&(c===await (async function(){
								let __targ__17=await (await Environment.get_global("last"))(handler_stack);
								if (__targ__17){
								  return(__targ__17)[0]
								} 
							      })())))) {
								__BREAK__FLAG__=true;
								return
							      } else if (check_true( ((mode===in_code)&&await (async function(){
								let __targ__18=read_table;
								if (__targ__18){
								  return(__targ__18)[c]
								} 
							      })()&&await (await Environment.get_global("first"))(await (async function(){
								let __targ__19=read_table;
								if (__targ__19){
								  return(__targ__19)[c]
								} 
							      })())))) {
								handler_stack.push(await (async function(){
								  let __targ__20=read_table;
								  if (__targ__20){
								    return(__targ__20)[c]
								  } 
								})());
								if (check_true ((( word_acc && word_acc.length )>0))){
								  acc.push(await process_word(word_acc,backtick_mode));
								  backtick_mode=0;
								  word_acc=[]
								};
								block_return=await read_block(await (await Environment.get_global("add"))(_depth,1));
								handler=await (async function(){
								  let __targ__21=handler_stack.pop();
								  if (__targ__21){
								    return(__targ__21)[1]
								  } 
								})();
								block_return=await (async function(){
								  let __array_op_rval__22=handler;
								  if (__array_op_rval__22 instanceof Function){
								    return await __array_op_rval__22(block_return) 
								  } else {
								    return[__array_op_rval__22,block_return]
								  }
								})();
								if (check_true (await (await Environment.get_global("not"))((undefined===block_return)))){
								  if (check_true ((backtick_mode===1))){
								    block_return=["=:quotem",block_return];
								    backtick_mode=0
								  };
								  return  acc.push(block_return)
								}
							      } else if (check_true( ((mode===in_code)&&(c==="`")))) {
								if (check_true ((( word_acc && word_acc.length )>0))){
								  acc.push(await process_word(word_acc));
								  word_acc=[]
								};
								return  backtick_mode=1
							      } else if (check_true( ((mode===in_code)&&(c===":")&&(( word_acc && word_acc.length )===0)&&(( acc && acc.length )>0)&&(await (await Environment.get_global("last"))(acc) instanceof String || typeof await (await Environment.get_global("last"))(acc)==='string')))) {
								return acc.push(await (await Environment.get_global("add"))(acc.pop(),":"))
							      } else if (check_true( ((mode===in_code)&&(last_c===",")&&((c==="#")||(c==="@"))))) {
								word_acc.push(c);
								acc.push(await process_word(word_acc));
								return  word_acc=[]
							      } else if (check_true( ((mode===in_code)&&((c===" ")||(await c["charCodeAt"].call(c,0)===10)||(await c["charCodeAt"].call(c,0)===9)||((c===",")&&await (await Environment.get_global("not"))((next_c==="@"))&&await (await Environment.get_global("not"))((next_c==="#"))))))) {
								if (check_true ((( word_acc && word_acc.length )>0))){
								  if (check_true ((backtick_mode===1))){
								    acc.push(await process_word(word_acc,backtick_mode));
								    backtick_mode=0
								  } else {
								    acc.push(await process_word(word_acc))
								  };
								  return  word_acc=[]
								}
							      } else if (check_true( ((mode===in_code)&&(await c["charCodeAt"].call(c,0)===13)))) {
								return false
							      } else  {
								return  word_acc.push(c)
							      }
							    }();
							    column_number+=1;
							    return  last_c=c
							  };
							  let __BREAK__FLAG__=false;
							  while(await __test_condition__15()) {
							    await __body_ref__16();
							    if(__BREAK__FLAG__) {
							      break;
							      
							    }
							  } ;
							  
							})();
							if (check_true ((( word_acc && word_acc.length )>0))){
							  acc.push(await process_word(word_acc,backtick_mode));
							  word_acc=[]
							};
							return  acc
						      };
						      output_structure=await read_block(0);
						      if (check_true ((output_structure instanceof Array&&(await (await Environment.get_global("length"))(output_structure)>1)))){
							output_structure.unshift("=:progn");
							await console.log("read (multiple forms) <-",output_structure);
							return  await (await Environment.get_global("first"))(await (async function(){
							  let __array_op_rval__23=output_structure;
							  if (__array_op_rval__23 instanceof Function){
							    return await __array_op_rval__23() 
							  } else {
							    return[__array_op_rval__23]
							  }
							})())
						      } else {
							return await (await Environment.get_global("first"))(output_structure)
						      }
						    }
					       };
          let add_escape_encoding=async function(text) {    if (check_true ((text instanceof String || typeof text==='string'))){
            let chars;
            let acc;
            chars=(text).split("");
            acc=[];
            await (async function() {
              let __for_body__3=async function(c) {
                return  await async function(){
                  if (check_true( ((await c["charCodeAt"].call(c,0)===34)))) {
                    (acc).push(await String.fromCharCode(92));
                    return  (acc).push(c)
                  } else  {
                    return (acc).push(c)
                  }
                }()
              };
              let __array__4=[],__elements__2=chars;
              let __BREAK__FLAG__=false;
              for(let __iter__1 in __elements__2) {
                __array__4.push(await __for_body__3(__elements__2[__iter__1]));
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
          let get_outside_global=function get_outside_global(refname) {  try {
	    let tfn = new Function("{ if (typeof " + refname + " === 'undefined') { return undefined } else { return "+refname+" } }");
	    return tfn();
	  } catch (ex) {
	    return undefined;
	  }
								      };
          let get_object_path=async function(refname) {
            let chars;
            let comps;
            let mode;
            let name_acc;
            chars=(refname).split("");
            comps=[];
            mode=0;
            name_acc=[];
            await (async function() {
              let __for_body__146=async function(c) {
                return  await async function(){
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
                }()
              };
              let __array__147=[],__elements__145=chars;
              let __BREAK__FLAG__=false;
              for(let __iter__144 in __elements__145) {
                __array__147.push(await __for_body__146(__elements__145[__iter__144]));
                if(__BREAK__FLAG__) {
                  __array__147.pop();
                  break;
                  
                }
              }return __array__147;
              
            })();
            if (check_true ((await length(name_acc)>0))){
              (comps).push((name_acc).join(""))
            };
            return  comps
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
                  let __test_condition__148=async function() {
                    return  (idx<(tree && tree.length))
                  };
                  let __body_ref__149=async function() {
                    tval=await (async function(){
                      let __targ__150=tree;
                      if (__targ__150){
                        return(__targ__150)[idx]
                      } 
                    })();
                    if (check_true ((tval===deferred_operator))){
                      idx+=1;
                      tval=await (async function(){
                        let __targ__151=tree;
                        if (__targ__151){
                          return(__targ__151)[idx]
                        } 
                      })();
                      rval=await rval["concat"].call(rval,await do_deferred_splice(tval))
                    } else {
                      (rval).push(await do_deferred_splice(tval))
                    };
                    return  idx+=1
                  };
                  let __BREAK__FLAG__=false;
                  while(await __test_condition__148()) {
                    await __body_ref__149();
                    if(__BREAK__FLAG__) {
                      break;
                      
                    }
                  } ;
                  
                })();
                return  rval
              } else if (check_true( (tree instanceof Object))) {
                rval=new Object();
                await (async function() {
                  let __for_body__154=async function(pset) {
                    return  await async function(){
                      let __target_obj__156=rval;
                      __target_obj__156[(pset && pset["0"])]=await do_deferred_splice((pset && pset["1"]));
                      return __target_obj__156;
                      
                    }()
                  };
                  let __array__155=[],__elements__153=await pairs(tree);
                  let __BREAK__FLAG__=false;
                  for(let __iter__152 in __elements__153) {
                    __array__155.push(await __for_body__154(__elements__153[__iter__152]));
                    if(__BREAK__FLAG__) {
                      __array__155.pop();
                      break;
                      
                    }
                  }return __array__155;
                  
                })();
                return  rval
              } else  {
                return tree
              }
            }()
          };
          let safe_access=async function(token,ctx,sanitizer_fn) {
            let comps;
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
                let __target_obj__157=comps;
                __target_obj__157[0]=await (async function(){
                  let __array_op_rval__158=sanitizer_fn;
                  if (__array_op_rval__158 instanceof Function){
                    return await __array_op_rval__158((comps && comps["0"])) 
                  } else {
                    return[__array_op_rval__158,(comps && comps["0"])]
                  }
                })();
                return __target_obj__157;
                
              }();
              await (async function(){
                let __test_condition__159=async function() {
                  return  ((comps && comps.length)>0)
                };
                let __body_ref__160=async function() {
                  (acc).push((comps).shift());
                  return  (acc_full).push(await (await get_global("expand_dot_accessor"))((acc).join("."),ctx))
                };
                let __BREAK__FLAG__=false;
                while(await __test_condition__159()) {
                  await __body_ref__160();
                  if(__BREAK__FLAG__) {
                    break;
                    
                  }
                } ;
                
              })();
              rval=await flatten(["(",(acc_full).join(" && "),")"]);
              return  rval
            }
          };
          let embed_compiled_quote=async function(type,tmp_name,tval) {     return  await async function(){
            if (check_true( (type===0))) {
              return await (async function(){
                let __array_op_rval__6="=:(";
                if (__array_op_rval__6 instanceof Function){
                  return await __array_op_rval__6(`=:let`,"=:(","=:(",tmp_name,await (await Environment.get_global("add"))("=:",await (await Environment.get_global("as_lisp"))(tval)),"=:)","=:)",await (await Environment.get_global("add"))("=:",tmp_name)) 
                } else {
                  return[__array_op_rval__6,`=:let`,"=:(","=:(",tmp_name,await (await Environment.get_global("add"))("=:",await (await Environment.get_global("as_lisp"))(tval)),"=:)","=:)",await (await Environment.get_global("add"))("=:",tmp_name)]
                }
              })()
            } else if (check_true( (type===1))) {
              return [`=$&!`,"=:'",`=:+`,`=:await`,`=:Environment.as_lisp`,"=:(",tval,"=:)",`=:+`,"=:'"]
            } else if (check_true( (type===2))) {
              return await (async function(){
                let __array_op_rval__7="=:(";
                if (__array_op_rval__7 instanceof Function){
                  return await __array_op_rval__7(`=:let`,"=:(","=:(",tmp_name,await (await Environment.get_global("add"))("=:",await (await Environment.get_global("as_lisp"))(tval)),"=:)","=:)",await (await Environment.get_global("add"))("=:",tmp_name)) 
                } else {
                  return[__array_op_rval__7,`=:let`,"=:(","=:(",tmp_name,await (await Environment.get_global("add"))("=:",await (await Environment.get_global("as_lisp"))(tval)),"=:)","=:)",await (await Environment.get_global("add"))("=:",tmp_name)]
                }
              })()
            } else if (check_true( (type===3))) {
              return await (async function(){
                let __array_op_rval__8="=:'";
                if (__array_op_rval__8 instanceof Function){
                  return await __array_op_rval__8(`=:+`,`=:await`,`=:Environment.as_lisp`,"=:(",tval,"=:)",`=:+`,"=:'") 
                } else {
                  return[__array_op_rval__8,`=:+`,`=:await`,`=:Environment.as_lisp`,"=:(",tval,"=:)",`=:+`,"=:'"]
                }
              })()
            } else if (check_true( (type===4))) {
              return "=:)"
            }
	  }()
								      };
          ;
          let as_lisp=lisp_writer;
          ;
          let read_lisp=reader;
          ;
          await async function(){
            let __target_obj__161=(Environment && Environment["global_ctx"] && Environment["global_ctx"]["scope"]);
            __target_obj__161["eval"]=eval_exp;
            __target_obj__161["reader"]=reader;
            __target_obj__161["add_escape_encoding"]=add_escape_encoding;
            __target_obj__161["as_lisp"]=lisp_writer;
            __target_obj__161["lisp_writer"]=lisp_writer;
            return __target_obj__161;
            
          }();
          let inlines=await add(new Object(),await (async function() {
            if (check_true ((opts && opts["inlines"]))){
              return (opts && opts["inlines"])
            } else {
              return new Object()
            } 
          } )(),await ( async function(){
            let __obj__162=new Object();
            __obj__162["pop"]=async function(args) {
              return  ["(",(args && args["0"]),")",".","pop()"]
            };
            __obj__162["push"]=async function(args) {
              return  ["(",(args && args["0"]),")",".push","(",(args && args["1"]),")"]
            };
            __obj__162["chomp"]=async function(args) {
              return  ["(",(args && args["0"]),")",".substr","(",0,",","(",(args && args["0"]),".length","-",1,")",")"]
            };
            __obj__162["join"]=async function(args) {
              if (check_true (((args && args.length)===1))){
                return ["(",(args && args["0"]),")",".join","()"]
              } else {
                return ["(",(args && args["1"]),")",".join","(",(args && args["0"]),")"]
              }
            };
            __obj__162["take"]=async function(args) {
              return  ["(",(args && args["0"]),")",".shift","()"]
            };
            __obj__162["prepend"]=async function(args) {
              return  ["(",(args && args["0"]),")",".unshift","(",(args && args["1"]),")"]
            };
            __obj__162["trim"]=async function(args) {
              return  ["(",(args && args["0"]),")",".trim()"]
            };
            __obj__162["lowercase"]=async function(args) {
              return  ["(",(args && args["0"]),")",".toLowerCase()"]
            };
            __obj__162["uppercase"]=async function(args) {
              return  ["(",(args && args["0"]),")",".toUpperCase()"]
            };
            __obj__162["islice"]=async function(args) {
              return  await async function(){
                if (check_true( ((args && args.length)===3))) {
                  return ["(",(args && args["0"]),")",".slice(",(args && args["1"]),",",(args && args["2"]),")"]
                } else if (check_true( ((args && args.length)===2))) {
                  return ["(",(args && args["0"]),")",".slice(",(args && args["1"]),")"]
                } else  {
                  throw new SyntaxError("slice requires 2 or 3 arguments");
                  
                }
              }()
            };
            __obj__162["split_by"]=async function(args) {
              return  ["(",(args && args["1"]),")",".split","(",(args && args["0"]),")"]
            };
            __obj__162["bind"]=async function(args) {
              return  await (async function(){
                let __array_op_rval__163=(args && args["0"]);
                if (__array_op_rval__163 instanceof Function){
                  return await __array_op_rval__163(".bind(",(args && args["1"]),")") 
                } else {
                  return[__array_op_rval__163,".bind(",(args && args["1"]),")"]
                }
              })()
            };
            __obj__162["is_array?"]=async function(args) {
              return  ["(",(args && args["0"])," instanceof Array",")"]
            };
            __obj__162["is_object?"]=async function(args) {
              return  ["(",(args && args["0"])," instanceof Object",")"]
            };
            __obj__162["is_string?"]=async function(args) {
              return  ["(",(args && args["0"])," instanceof String || typeof ",(args && args["0"]),"===","'string'",")"]
            };
            __obj__162["is_function?"]=async function(args) {
              return  await (async function(){
                let __array_op_rval__164=(args && args["0"]);
                if (__array_op_rval__164 instanceof Function){
                  return await __array_op_rval__164(" instanceof Function") 
                } else {
                  return[__array_op_rval__164," instanceof Function"]
                }
              })()
            };
            __obj__162["is_element?"]=async function(args) {
              return  await (async function(){
                let __array_op_rval__165=(args && args["0"]);
                if (__array_op_rval__165 instanceof Function){
                  return await __array_op_rval__165(" instanceof Element") 
                } else {
                  return[__array_op_rval__165," instanceof Element"]
                }
              })()
            };
            __obj__162["log"]=async function(args) {
              return  ["console.log","(",await map(async function(val,idx,tl) {
                if (check_true ((idx<(tl-1)))){
                  return await (async function(){
                    let __array_op_rval__166=val;
                    if (__array_op_rval__166 instanceof Function){
                      return await __array_op_rval__166(",") 
                    } else {
                      return[__array_op_rval__166,","]
                    }
                  })()
                } else {
                  return await (async function(){
                    let __array_op_rval__167=val;
                    if (__array_op_rval__167 instanceof Function){
                      return await __array_op_rval__167() 
                    } else {
                      return[__array_op_rval__167]
                    }
                  })()
                }
              },args),")"]
            };
            __obj__162["reverse"]=async function(args) {
              return  ["(",(args && args["0"]),")",".slice(0).reverse()"]
            };
            __obj__162["int"]=async function(args) {
              return  await async function(){
                if (check_true( ((args && args.length)===1))) {
                  return ["parseInt(",(args && args["0"]),")"]
                } else if (check_true( ((args && args.length)===2))) {
                  return ["parseInt(",(args && args["0"]),",",(args && args["1"]),")"]
                } else  {
                  throw new "SyntaxError"(("invalid number of arguments to int: received "+(args && args.length)));
                  
                }
              }()
            };
            __obj__162["float"]=async function(args) {
              return  ["parseFloat(",(args && args["0"]),")"]
            };
            return __obj__162;
            
          })());
          ;
          await async function(){
            let __target_obj__168=Environment;
            __target_obj__168["eval"]=eval_struct;
            __target_obj__168["identify"]=subtype;
            __target_obj__168["meta_for_symbol"]=meta_for_symbol;
            __target_obj__168["set_compiler"]=set_compiler;
            __target_obj__168["read_lisp"]=reader;
            __target_obj__168["as_lisp"]=as_lisp;
            __target_obj__168["inlines"]=inlines;
            __target_obj__168["definitions"]=(Environment && Environment["definitions"]);
            __target_obj__168["declarations"]=(Environment && Environment["declarations"]);
            __target_obj__168["compile"]=compile;
            __target_obj__168["evaluate"]=evaluate;
            __target_obj__168["do_deferred_splice"]=do_deferred_splice;
            __target_obj__168["id"]=async function() {
              return  id
            };
            __target_obj__168["set_check_external_env"]=async function(state) {
              check_external_env_default=state;
              return  check_external_env_default
            };
            __target_obj__168["check_external_env"]=async function() {
              return  check_external_env_default
            };
            return __target_obj__168;
            
          }();
          return  Environment
        }
      };
      return __target_obj__1;
      
    }();
    return  await (async function(){
      let __targ__169=globalThis;
      if (__targ__169){
        return(__targ__169)[symname]
      } 
    })()
  }
}
export { init_dlisp }


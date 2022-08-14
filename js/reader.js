// Source: reader.lisp  
// Build Time: 2022-08-14 07:24:15
// Version: 2022.08.14.07.24
export const DLISP_ENV_VERSION='2022.08.14.07.24';




var { get_next_environment_id, check_true, get_outside_global, subtype, lisp_writer, clone, LispSyntaxError } = await import("./lisp_writer.js");
export async function initializer(Environment) {
  return await Environment.set_global("reader",async function(text,opts) {
     return  await async function(){
        if (check_true( (undefined==text))) {
             throw new EvalError(("reader: received undefined, text must be a string."));
            
        } else if (check_true( await (await Environment.get_global("not"))((text instanceof String || typeof text==='string')))) {
             throw new EvalError(("reader: received "+ await (await Environment.get_global("sub_type"))(text)+ ": text must be a string."));
            
        } else  {
            let output_structure;
            let idx;
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
            line_number=1;
            column_number=0;
            source_name=await (async function () {
                 if (check_true ((opts && opts["source_name"]))){
                      return (opts && opts["source_name"])
                } else {
                      return "anonymous"
                } 
            })();
            opts=(opts|| new Object());
            len=(await (await Environment.get_global("length"))(text)- 1);
            debugmode=await async function(){
                if (check_true((opts && opts["verbose"]))) {
                     return true
                } else if (check_true( ((opts && opts["verbose"])===false))) {
                     return false
                } else if (check_true( ((await Environment.get_global("__VERBOSITY__"))>6))) {
                     return true
                } else  {
                     return false
                }
            } ();
            in_buffer=(text).split("");
            in_code=0;
            in_quotes=1;
            in_long_text=2;
            in_comment=3;
            in_single_quote=4;
            reading_object=false;
            mode=in_code;
            local_text=async function() {
                let start;
                let end;
                start=await Math.max(0,(idx- 10));
                end=await Math.min(await (await Environment.get_global("length"))(in_buffer),(idx+ 10));
                 return  (await (await Environment.get_global("slice"))(in_buffer,start,end)).join("")
            };
            position=async function(offset) {
                 return  ("line: "+ line_number+ " column: "+ await (async function () {
                     if (check_true (offset)){
                          return (column_number+ offset)
                    } else {
                          return column_number
                    } 
                })())
            };
            read_table=await (await Environment.get_global("add"))(new Object(),await (async function() {
                 if (check_true ((opts && opts["read_table_entries"]))){
                      return (opts && opts["read_table_entries"])
                } else {
                      return new Object()
                } 
            } )(),await ( async function(){
                let __obj__1=new Object();
                __obj__1["("]=[")",async function(block) {
                     return  block
                }];
                __obj__1["["]=["]",async function(block) {
                     return  block
                }];
                __obj__1["{"]=["}",async function(block) {
                    let obj;
                    let __idx__2= async function(){
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
                        let idx=await __idx__2();
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
                             let __test_condition__3=async function() {
                                 return  (idx<block_length)
                            };
                            let __body_ref__4=async function() {
                                (idx=idx+1);
                                key=block[idx];
                                if (check_true (((key instanceof Array)&& ((key && key.length)===2)&& ((key && key["0"])==="=:quotem")&& ((key && key["1"]) instanceof String || typeof (key && key["1"])==='string')))){
                                     key=(key && key["1"])
                                };
                                if (check_true (((key instanceof String || typeof key==='string')&& await (await Environment.get_global("starts_with?"))("=:",key)&& (await (await Environment.get_global("length"))(key)>2)))){
                                     key=await key["substr"].call(key,2)
                                };
                                 return  await async function(){
                                    if (check_true( await (await Environment.get_global("blank?"))(key))) {
                                         return await error("missing object key",("blank or nil key: "+ block[idx]))
                                    } else if (check_true( await (await Environment.get_global("is_number?"))(key))) {
                                        (idx=idx+1);
                                         return  await async function(){
                                            obj[key]=block[idx];
                                            return obj;
                                            
                                        }()
                                    } else if (check_true( ((key instanceof String || typeof key==='string')&& await (await Environment.get_global("contains?"))(":",key)&& await (await Environment.get_global("not"))(await (await Environment.get_global("ends_with?"))(":",key))))) {
                                        cpos=await key["indexOf"].call(key,":");
                                        value=await key["substr"].call(key,(cpos+ 1));
                                        key=await key["substr"].call(key,0,cpos);
                                        value=await process_word((value).split(""),0);
                                         return  await async function(){
                                            obj[key]=value;
                                            return obj;
                                            
                                        }()
                                    } else  {
                                        (idx=idx+1);
                                        if (check_true (await (await Environment.get_global("ends_with?"))(":",key))){
                                             key=await (await Environment.get_global("chop"))(key)
                                        } else {
                                            if (check_true ((block[idx]===":"))){
                                                 (idx=idx+1)
                                            } else {
                                                 await error("missing colon",("expected colon for: "+ key))
                                            }
                                        };
                                         return  await async function(){
                                            obj[key]=block[idx];
                                            return obj;
                                            
                                        }()
                                    }
                                } ()
                            };
                            let __BREAK__FLAG__=false;
                            while(await __test_condition__3()) {
                                await __body_ref__4();
                                 if(__BREAK__FLAG__) {
                                     break;
                                    
                                }
                            } ;
                            
                        })();
                         return  obj
                    }
                },async function() {
                     return  reading_object=true
                }];
                __obj__1["\""]=["\"",async function(block) {
                     return  ["quotes",block]
                }];
                return __obj__1;
                
            })());
            get_char=async function(pos) {
                 return  in_buffer[pos]
            };
            error=async function(type,message,offset) {
                throw new LispSyntaxError({
                    message:message,position:await position(offset),pos:{
                        line:line_number,column:(column_number+ (offset|| 0))
                    },depth:depth,local_text:await local_text(),source_name:source_name,type:type
                });
                
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
                } ()
            };
            process_word=async function(word_acc,backtick_mode) {
                let word;
                let word_as_number;
                word=(word_acc).join("");
                word_as_number=await Number(word);
                if (check_true (debugmode)){
                     console.log("process_word: ",word,word_as_number,backtick_mode)
                };
                 return  await async function(){
                    if (check_true( ("true"===word))) {
                         return true
                    } else if (check_true( ("false"===word))) {
                         return false
                    } else if (check_true( (":"===word))) {
                         return word
                    } else if (check_true( (",@"===word))) {
                         return "=$,@"
                    } else if (check_true( ((",#"===word)|| ("##"===word)))) {
                         return "=:##"
                    } else if (check_true( ("=$,@"===word))) {
                         return "=$,@"
                    } else if (check_true( ("=:##"===word))) {
                         return "=:##"
                    } else if (check_true( await isNaN(word_as_number))) {
                         return  await async function(){
                            if (check_true( (word==="=:"))) {
                                 return  "=:"
                            } else if (check_true( ((backtick_mode===0)&& await (await Environment.get_global("ends_with?"))(")",word)))) {
                                 return await error("trailing character","unexpected trailing parenthesis")
                            } else if (check_true( ((backtick_mode===0)&& await (await Environment.get_global("ends_with?"))("]",word)))) {
                                 return await error("trailing character","unexpected trailing bracket")
                            } else if (check_true( await (await Environment.get_global("contains?"))(word,["=:(","=:)","=:'"]))) {
                                 return  word
                            } else if (check_true( (backtick_mode===1))) {
                                 return word
                            } else  {
                                 return await (await Environment.get_global("add"))("=:",word)
                            }
                        } ()
                    } else if (check_true( await (await Environment.get_global("is_number?"))(word_as_number))) {
                         return word_as_number
                    } else  {
                        console.log("reader: ",await position()," what is this?",word,word_acc,await local_text());
                         return  word
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
                     (acc).push(_prefix_op)
                };
                depth=_depth;
                await (async function(){
                     let __test_condition__8=async function() {
                         return  (await (await Environment.get_global("not"))(stop)&& (idx<len))
                    };
                    let __body_ref__9=async function() {
                        idx+=1;
                        escape_mode=await Math.max(0,(escape_mode- 1));
                        c=await get_char(idx);
                        next_c=await get_char((idx+ 1));
                        if (check_true ((c==="\n"))){
                            line_number+=1;
                             column_number=0
                        };
                        if (check_true (debugmode)){
                             await console.log(_depth,"C->",c,next_c,mode,escape_mode,await clone(acc),await clone(word_acc),(handler_stack && handler_stack.length))
                        };
                        await async function(){
                            if (check_true( ((next_c===undefined)&& await (await Environment.get_global("not"))((await (async function(){
                                let __targ__10=await (await Environment.get_global("last"))(handler_stack);
                                if (__targ__10){
                                     return(__targ__10)[0]
                                } 
                            })()===undefined))&& (await (await Environment.get_global("not"))((c===await (async function(){
                                let __targ__11=await (await Environment.get_global("last"))(handler_stack);
                                if (__targ__11){
                                     return(__targ__11)[0]
                                } 
                            })()))|| ((handler_stack && handler_stack.length)>1))))) {
                                 return await error("premature end",("premature end: expected: "+ await (async function(){
                                    let __targ__12=await (await Environment.get_global("last"))(handler_stack);
                                    if (__targ__12){
                                         return(__targ__12)[0]
                                    } 
                                })()))
                            } else if (check_true( ((next_c===undefined)&& (mode===in_quotes)&& await (await Environment.get_global("not"))((await c["charCodeAt"]()===34))))) {
                                 return await error("premature end","premature end: expected: \"")
                            } else if (check_true( ((next_c===undefined)&& (mode===in_long_text)&& await (await Environment.get_global("not"))((c==="|"))))) {
                                 return await error("premature end","premature end: expected: |")
                            } else if (check_true( ((mode===in_code)&& (_depth===1)&& (next_c===")")&& (c===")")))) {
                                 return  await error("trailing character","unexpected trailing parenthesis")
                            }
                        } ();
                        await async function(){
                            if (check_true( ((c==="\n")&& (mode===in_comment)))) {
                                mode=in_code;
                                __BREAK__FLAG__=true;
                                return
                            } else if (check_true( ((92===await c["charCodeAt"].call(c,0))&& (mode===in_long_text)))) {
                                (word_acc).push(c);
                                 return  (word_acc).push(c)
                            } else if (check_true( ((mode>0)&& (escape_mode===1)&& (92===await c["charCodeAt"].call(c,0))))) {
                                 return  (word_acc).push(c)
                            } else if (check_true( ((mode>0)&& (92===await c["charCodeAt"].call(c,0))))) {
                                 return  escape_mode=2
                            } else if (check_true( ((mode>0)&& (escape_mode===1)))) {
                                 return  (word_acc).push(await handle_escape_char(c))
                            } else if (check_true( ((mode===in_long_text)&& (escape_mode===0)&& (c==="|")))) {
                                acc=await (await Environment.get_global("add"))((word_acc).join(""));
                                word_acc=[];
                                mode=in_code;
                                __BREAK__FLAG__=true;
                                return
                            } else if (check_true( ((mode===in_quotes)&& (escape_mode===0)&& (c==="\"")))) {
                                acc=await (await Environment.get_global("add"))((word_acc).join(""));
                                word_acc=[];
                                mode=in_code;
                                __BREAK__FLAG__=true;
                                return
                            } else if (check_true( ((mode===in_single_quote)&& (escape_mode===0)&& (c==="'")))) {
                                acc=await (await Environment.get_global("add"))((word_acc).join(""));
                                word_acc=[];
                                mode=in_code;
                                __BREAK__FLAG__=true;
                                return
                            } else if (check_true( ((c==="|")&& (mode===in_code)))) {
                                if (check_true (((word_acc && word_acc.length)>0))){
                                    (acc).push(await process_word(word_acc));
                                     word_acc=[]
                                };
                                mode=in_long_text;
                                block_return=await read_block(await (await Environment.get_global("add"))(_depth,1));
                                if (check_true ((backtick_mode===1))){
                                    block_return=["=:quotem",block_return];
                                     backtick_mode=0
                                };
                                 return  (acc).push(block_return)
                            } else if (check_true( ((c==="\"")&& (escape_mode===0)&& (mode===in_code)))) {
                                if (check_true (((word_acc && word_acc.length)>0))){
                                    (acc).push(await process_word(word_acc));
                                     word_acc=[]
                                };
                                mode=in_quotes;
                                block_return=await read_block(await (await Environment.get_global("add"))(_depth,1));
                                if (check_true ((backtick_mode===1))){
                                     backtick_mode=0
                                };
                                 return  (acc).push(block_return)
                            } else if (check_true( ((c==="'")&& (escape_mode===0)&& (mode===in_code)))) {
                                if (check_true (((word_acc && word_acc.length)>0))){
                                    (acc).push(await process_word(word_acc));
                                     word_acc=[]
                                };
                                mode=in_single_quote;
                                block_return=await read_block(await (await Environment.get_global("add"))(_depth,1));
                                if (check_true ((backtick_mode===1))){
                                     backtick_mode=0
                                };
                                 return  (acc).push(block_return)
                            } else if (check_true( (mode===in_comment))) {
                                 return false
                            } else if (check_true( ((c===";")&& (mode===in_code)))) {
                                if (check_true (((word_acc && word_acc.length)>0))){
                                    (acc).push(await process_word(word_acc));
                                     word_acc=[]
                                };
                                mode=in_comment;
                                 return  await read_block(await (await Environment.get_global("add"))(_depth,1))
                            } else if (check_true( ((mode===in_code)&& (await (await Environment.get_global("length"))(handler_stack)>0)&& (c===await (async function(){
                                let __targ__13=await (await Environment.get_global("last"))(handler_stack);
                                if (__targ__13){
                                     return(__targ__13)[0]
                                } 
                            })())))) {
                                __BREAK__FLAG__=true;
                                return
                            } else if (check_true( ((mode===in_code)&& read_table[c]&& await (await Environment.get_global("first"))(read_table[c])))) {
                                if (check_true (await (async function(){
                                    let __targ__14=read_table[c];
                                    if (__targ__14){
                                         return(__targ__14)[2]
                                    } 
                                })())){
                                    handler=await (async function(){
                                        let __targ__15=read_table[c];
                                        if (__targ__15){
                                             return(__targ__15)[2]
                                        } 
                                    })();
                                    await (async function(){
                                        let __array_op_rval__16=handler;
                                         if (__array_op_rval__16 instanceof Function){
                                            return await __array_op_rval__16() 
                                        } else {
                                            return[__array_op_rval__16]
                                        }
                                    })();
                                     handler=null
                                };
                                (handler_stack).push(read_table[c]);
                                if (check_true (((word_acc && word_acc.length)>0))){
                                    (acc).push(await process_word(word_acc,backtick_mode));
                                    backtick_mode=0;
                                     word_acc=[]
                                };
                                block_return=await read_block(await (await Environment.get_global("add"))(_depth,1));
                                handler=await (async function(){
                                    let __targ__17=(handler_stack).pop();
                                    if (__targ__17){
                                         return(__targ__17)[1]
                                    } 
                                })();
                                block_return=await (async function(){
                                    let __array_op_rval__18=handler;
                                     if (__array_op_rval__18 instanceof Function){
                                        return await __array_op_rval__18(block_return) 
                                    } else {
                                        return[__array_op_rval__18,block_return]
                                    }
                                })();
                                if (check_true (await (await Environment.get_global("not"))((undefined===block_return)))){
                                    if (check_true ((backtick_mode===1))){
                                        block_return=["=:quotem",block_return];
                                         backtick_mode=0
                                    };
                                     return  (acc).push(block_return)
                                }
                            } else if (check_true( ((mode===in_code)&& (c==="`")))) {
                                if (check_true (((word_acc && word_acc.length)>0))){
                                    (acc).push(await process_word(word_acc));
                                     word_acc=[]
                                };
                                 return  backtick_mode=1
                            } else if (check_true( ((mode===in_code)&& (c===":")&& ((word_acc && word_acc.length)===0)&& ((acc && acc.length)>0)&& (await (await Environment.get_global("last"))(acc) instanceof String || typeof await (await Environment.get_global("last"))(acc)==='string')))) {
                                 return (acc).push(await (await Environment.get_global("add"))((acc).pop(),":"))
                            } else if (check_true( ((mode===in_code)&& (last_c===",")&& ((c==="#")|| (c==="@"))))) {
                                (word_acc).push(c);
                                (acc).push(await process_word(word_acc));
                                 return  word_acc=[]
                            } else if (check_true( ((mode===in_code)&& ((c===" ")|| (await c["charCodeAt"].call(c,0)===10)|| (await c["charCodeAt"].call(c,0)===9)|| ((c===",")&& await (await Environment.get_global("not"))((next_c==="@"))&& await (await Environment.get_global("not"))((next_c==="#"))))))) {
                                if (check_true (((word_acc && word_acc.length)>0))){
                                    if (check_true ((backtick_mode===1))){
                                        (acc).push(await process_word(word_acc,backtick_mode));
                                         backtick_mode=0
                                    } else {
                                         (acc).push(await process_word(word_acc))
                                    };
                                     return  word_acc=[]
                                }
                            } else if (check_true( ((mode===in_code)&& (await c["charCodeAt"].call(c,0)===13)))) {
                                 return false
                            } else  {
                                 return  (word_acc).push(c)
                            }
                        } ();
                        column_number+=1;
                         return  last_c=c
                    };
                    let __BREAK__FLAG__=false;
                    while(await __test_condition__8()) {
                        await __body_ref__9();
                         if(__BREAK__FLAG__) {
                             break;
                            
                        }
                    } ;
                    
                })();
                if (check_true (((word_acc && word_acc.length)>0))){
                    (acc).push(await process_word(word_acc,backtick_mode));
                     word_acc=[]
                };
                 return  acc
            };
            if (check_true (debugmode)){
                 await console.log("read->",in_buffer)
            };
            output_structure=await read_block(0);
            if (check_true (debugmode)){
                 await console.log("read<-",await clone(output_structure))
            };
            if (check_true (((output_structure instanceof Array)&& (await (await Environment.get_global("length"))(output_structure)>1)))){
                (output_structure).unshift("=:iprogn");
                 return  await (await Environment.get_global("first"))(await (async function(){
                    let __array_op_rval__19=output_structure;
                     if (__array_op_rval__19 instanceof Function){
                        return await __array_op_rval__19() 
                    } else {
                        return[__array_op_rval__19]
                    }
                })())
            } else {
                  return await (await Environment.get_global("first"))(output_structure)
            }
        }
    } ()
})} 
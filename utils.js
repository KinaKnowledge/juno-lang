// Utilities for the Dlisp Compiler

export function clone(src,depth) {
        if (src===null) {
            return null;
        }
        depth = depth || 0;
        if (depth >= 500) {
            return "TO DEEP";
        }
        if (src===undefined) {
            return undefined;
        } else if (src === null) {
	    return null;
	} else if (src instanceof Function ) {
            return src; 
        } else if (src==this) {
            return this;
        } else if (src.constructor===String) {	  
	  return src.toString();
	} else if (src.constructor===Number) {
	  return src;
	} else if (src.constructor===Boolean) {
	  return src;
	} else if ((src.constructor===Array)||(src.constructor===Object)) {
	  let obj;
	  if (src.constructor===Array) {
	    obj=[];
	  } else {
	    obj={}
	  }
          for (let idx in src) {
	    obj[idx]=clone(src[idx],depth+1);
	  }
	  return obj;
	} else {
	  return src;
	}
}

function new_token (type, depth, mode, token_id, curpos, line_num, column_num, quote_start_depth ) {
    return new Object({
        type: type,
        depth: depth,
        error: null,
        mode:mode,
        id: ++token_id,
        offset_start:curpos,
        offset_end:curpos,
        line_start:line_num,
        line_end:line_num,
        column_start:column_num,
        column_end:column_num,
        qstart_depth:quote_start_depth,
        text:'',
        tokens:[],
    })
}

export function tokenize(text,performTrim, line_offset) {

        let curpos = 0;
        let tokens = [];
        let next_c = null;
        let stack = [];
        line_offset = line_offset || 0;
        let token = null;
        let line_num = line_offset;
        let column_num = 0;
        let paren_id = 0;
        let depth = 0;
        let token_id = 0;
        const IN_CODE = 0;
        const IN_COMMENT = 1;
        const IN_QUOTES = 2;
        const IN_REGEX = 3;
        const IN_JS = 4;
        const IN_QM = 5;
        const IN_LONG_STRING = 6;
        const IN_QM_STRING = 7;
        const IN_SPLICE = 8;
        const IN_UNQUOTEM_EXPANSION = 9;
        const PAREN_OPEN =10;
        const BRACKET_OPEN = 12;
        const SPLICE = 14;
        const SYMBOL = 20;
        const STRING = 21;
        const NUMBER = 22;
        const COMMENT = 23;
        const NEWLINE = 24;
        const SPACE = 25;
        const REGEX = 26;
        const JS = 27;
        const QUOTE = 28;
        const COMMA = 29;
        const ROOT = 30;
        const COLON = 31;

        const ERROR = 40;
        let mode = IN_CODE; //default
        let c = null;
        let last_c = null;
        let last_last_c = null;
        let escape_mode = 0;
        let i = 0;
        if (performTrim) text = text.trim();
       
        let update_state = () => {
            token.offset_end = curpos;
            token.column_end = column_num;
            token.line_end = line_num;
            if (text[i] !== '\\' && escape_mode === 0) {
                token.text += text[i];
            } else if (last_c === '\\' && text[i] === '\\') {
                token.text += text[i];
            } else if (escape_mode === 1) {
                if (text[i] === "n") {
                    token.text += "\n"
                } else if (text[i] === "r") {
                    token.text += "\r"
                } else if (text[i] === "t") {
                    token.text += "\t"
                } else if (text[i] === "\"") {
                    token.text += '"';
                } else {
                    token.text += text[i];
                }

            }
            last_last_c = last_c;
            last_c = c;
            last_column_num = column_num;
            curpos++;
            column_num++;
        };



        let store_token = () => {
            if (token === null) return;
            if (token.type===SYMBOL) {
                if (!isNaN(parseFloat(token.text))) {
                    token.type = NUMBER;
                }
            }
            if (token.text==='`' && token.mode===IN_QM) return;  // throw it away as next token is going to be a quoted list
            console.log("    save token: type: ",token.type," mode: ",token.mode,"  text: |"+token.text+"|");
            tokens.push(token);
        };
        let last_line_num = 0;
        let last_column_num = 0;
        let mode_stack = [];
        let quote_start_depth = null;


        let root_token = new_token(ROOT,depth,mode, token_id, curpos,line_num,column_num,quote_start_depth);
        tokens = root_token.tokens;
        stack.push(root_token);
        token = null;
        let cCode;
        //console.log("code-> ",text);
        // loop through
        for (i = 0; i < text.length; i++) {
            c = text[i];
            next_c = text[i+1];
            last_line_num = line_num;
            escape_mode = Math.max(0,escape_mode - 1);
            
            if (typeof c==="string") {
                   cCode = c.charCodeAt(0);
            } else {
                   cCode = "-"
            }
            console.log("->",c, "[",cCode,"]", " mode:", mode, "  depth: ", depth, );
            
            if (mode === IN_CODE || mode === IN_QM) {
                if (c === '[') c='(';if (c === ']') c=")";
                if (c === "\t") c=" ";

            }   // for the case statement;
            if (mode !== IN_LONG_STRING && (c === "\\")) {
                //console.log("escape mode: "+next_c);
                escape_mode = 2;
            }
            switch(c) {

                case "\n":
                    // new line - increment our line counter and reset our column counter to 0
                    column_num = 0;
                    last_line_num = line_num;
                    line_num++;
                    if (mode === IN_COMMENT) {
                        update_state();
                        if (mode_stack.length>0) {
                            mode = mode_stack.pop();
                        } else {
                            mode = IN_CODE;
                        }
                        token = null;
                        continue;
                    } else if (mode === IN_CODE) {
                        store_token();
                        token = new_token(NEWLINE,depth,mode, token_id, curpos,line_num,column_num,quote_start_depth);
                        update_state();
                        token = null;
                        continue
                    } else if (mode === IN_QM) {
                        if (depth <= quote_start_depth) {
                            // quote mode end
                            //update_state();
                            store_token();
                            token = new_token(SPACE,depth,mode, token_id, curpos,line_num,column_num,quote_start_depth);
                            update_state();  // throw it away since we aren't interested in it
                            token = null;
                            mode = IN_CODE;
                            continue;
                        } else {
                            store_token();
                            token = new_token(SPACE,depth,mode, token_id, curpos,line_num,column_num,quote_start_depth);
                            update_state();
                            token = null;
                            continue;
                        }
                    }
                    break;
                case " ":
                    if (mode === IN_CODE) {
                        store_token();
                        token = new_token(SPACE,depth,mode, token_id, curpos,line_num,column_num,quote_start_depth);
                        update_state();
                        // throw it away since we don't care about it
                        token = null;
                        continue;
                    } else if (mode === IN_QM) {
                        //console.log("quote_mode: hit space:  depth: ",depth,"  qstart->",quote_start_depth);
                        if (depth <= quote_start_depth) {
                            // quote mode end
                            //update_state();
                            store_token();
                            token = new_token(SPACE,depth,mode, token_id, curpos,line_num,column_num,quote_start_depth);
                            update_state();  // throw it away since we aren't interested in it
                            token = null;
                            mode = IN_CODE;
                            continue;
                        } else {
                            store_token();
                            token = new_token(SPACE,depth,mode, token_id, curpos,line_num,column_num,quote_start_depth);
                            update_state();
                            token = null;
                            continue;
                        }
                    }
                    break;
                case ":":
                    if (text[i-1].charCodeAt(0) >= 48 && text[i-1].charCodeAt(0)<= 57 && ((next_c.charCodeAt(0)>=65 && next_c.charCodeAt(0) <= 90) || (next_c.charCodeAt(0)>=97&&next_c.charCodeAt(0)<=122))) {
                       update_state()
                        continue;
                    } else if (mode === IN_CODE||(mode === IN_QM && depth === quote_start_depth)) {
                        store_token();
                        token = new_token(COLON,depth,mode, token_id, curpos,line_num,column_num,quote_start_depth);
                        update_state();
                        store_token();
                        token = null;
                        mode = IN_CODE;
                        continue;
                    } else if (mode === IN_QM) {
                        store_token();
                        token = new_token(COLON,depth,mode, token_id, curpos,line_num,column_num,quote_start_depth);
                        update_state();
                        store_token();
                        token = null;
                        continue;
                    }
                    break;
                case "|":
                    if (mode === IN_LONG_STRING) {
                        store_token();
                        token = new_token(SPACE,depth,mode, token_id, curpos,line_num,column_num,quote_start_depth);
                        update_state();
                        token = null;
                        mode = IN_CODE;
                        continue;
                    } else if (mode === IN_CODE) {
                        store_token();
                        token = new_token(SPACE,depth,mode, token_id, curpos,line_num,column_num,quote_start_depth);
                        update_state();
                        mode = IN_LONG_STRING;
                        token = null;
                        continue;
                    }
                case ";":
                    if (mode === IN_CODE || mode === IN_QM) {
                        store_token();
                        mode_stack.push(mode);
                        mode = IN_COMMENT;
                        token = new_token(COMMENT,depth,mode, token_id, curpos,line_num,column_num,quote_start_depth);
                    }
                    break;
                case "/":
                    if (last_c==='/' && mode === IN_CODE) {

                        // throw the  last in_code token away since it is //
                        token = new_token(REGEX,depth,mode, token_id, curpos,line_num,column_num,quote_start_depth);
                        token.offset_start--;
                        token.column_start--;
                        token.text = '/';
                        mode = IN_REGEX;
                    } else if (last_c==='/' && mode === IN_REGEX) {
                        update_state();  // include the last /
                        store_token();
                        token = null;
                        mode = IN_CODE;
                        continue;
                    }
                    break;
                case "!":
                    if (last_last_c !== "\\" && last_c==='<' && mode === IN_CODE) {
                        token.column_end--;
                        token.offset_end--;
                        token.text = token.text.substr(0,token.text.length-1);
                        store_token();
                        token = new_token(JS,depth,mode, token_id, curpos,line_num,column_num,quote_start_depth);
                        token.offset_start--;
                        token.column_start--;
                        token.text='<';
                        mode = IN_JS;
                    }
                    break;
                case ">":
                    if (mode === IN_JS && last_c === '!' && last_last_c !== "\\") {
                        update_state();
                        store_token();
                        token = null;
                        mode = IN_CODE;
                        continue;
                    }
                    break;
                case "`":
                    if (mode === IN_CODE) {
                        mode = IN_QM;
                        store_token();
                        token = new_token(QUOTE,depth,mode, token_id, curpos,line_num,column_num,quote_start_depth);
                        //console.log("Entering quote mode: ",token);
                        quote_start_depth = depth;
                    }
                    break;
                case "\r":
                    if (mode === IN_QM) {
                        continue;
                    } else if (mode === IN_CODE) {
                        continue;
                    }
                    break;
                case ",":
                    if (mode === IN_QM && next_c === "&") {
                        store_token();
                        token = new_token(COMMA,depth,mode, token_id, curpos,line_num,column_num,quote_start_depth);
                        update_state();
                        continue;
                    } else if (mode === IN_QM  || mode === IN_CODE) {
                        store_token();
                        if (next_c === '#') {
                            store_token();
                            token = new_token(COMMA,depth,mode, token_id, curpos,line_num,column_num,quote_start_depth);
                            update_state();
                            mode = IN_UNQUOTEM_EXPANSION;
                            continue
                        }
                        if (next_c === "@") {
                            mode = IN_SPLICE;
                            token = new_token(SPLICE, depth, mode, token_id, curpos, line_num, column_num, quote_start_depth);
                            update_state();
                        }  else {
                            token = new_token(COMMA,depth,mode, token_id, curpos,line_num,column_num,quote_start_depth);
                            update_state();
                            token = null;
                        }
                        continue;
                    }
                    break;
                case '#':
                    if (mode === IN_UNQUOTEM_EXPANSION) {
                        update_state()
                        token.text="=:##";
                        store_token();
                        token = null;
                        mode = IN_QM;
                        continue;
                    }
                case '&':
                    if (mode === COMMA) {
                        mode = IN_CODE;
                        update_state();
                        store_token();
                        token = null;
                        continue;

                    } else {
                        break;
                    }
                    break;
                case '@':
                     if (mode === IN_SPLICE) {
                         mode = IN_CODE;
                         update_state();
                         store_token();
                         token = null;
                         continue;
                     }
                     break;
                case '"':
                    if (mode === IN_CODE && last_c!=="\\") {
                        mode = IN_QUOTES;
                        store_token();
                        token = new_token(STRING,depth,mode, token_id, curpos,line_num,column_num,quote_start_depth);
                    } else if (mode === IN_QUOTES && last_c!=='\\') {
                        mode = IN_CODE;
                        update_state();
                        store_token();
                        token = null;
                        continue;
                    } else if (mode === IN_QUOTES && last_c==='\\') {
                        update_state();
                        continue;
                    } else if (mode === IN_QM  && last_c!=="\\") {
                        store_token();
                        token = new_token(STRING,depth,mode, token_id, curpos,line_num,column_num,quote_start_depth);
                        mode = IN_QM_STRING;
                    } else if (mode === IN_QM_STRING  && last_c!=="\\") {
                        update_state();     // collect the value into the string
                        store_token();      // store it
                        mode = IN_QM;
                        token = null;
                        continue;
                    }
                    break;
                case '(':
                    if (mode === IN_CODE) {
                        store_token();     // push the current token into our current list
                        depth++;                // up the depth
                        token = new_token(PAREN_OPEN,depth,mode, token_id, curpos,line_num,column_num,quote_start_depth); // create a new token
                        update_state();
                        store_token();
                        stack.push(token);      // push it into the depth stack
                        tokens = token.tokens;  // update the tokens pointer
                        token = null;
                        continue;
                    } else if (mode === IN_QM) {

                        store_token();     // push the current token into our current list
                        depth++;                // up the depth
                        token = new_token(PAREN_OPEN,depth,mode, token_id, curpos,line_num,column_num,quote_start_depth); // create a new token
                        update_state();
                        store_token();
                        stack.push(token);      // push it into the depth stack
                        tokens = token.tokens;  // update the tokens pointer
                        token = null;
                        continue;

                    }
                    break;
                case '{':
                    if (mode === IN_CODE || mode === IN_QM) {
                        store_token();
                        depth++;
                        token = new_token(BRACKET_OPEN,depth,mode, token_id, curpos,line_num,column_num,quote_start_depth);
                        update_state();
                        store_token();
                        stack.push(token);
                        tokens = token.tokens;  // update the tokens pointer
                        token = null;
                        continue;
                    }
                    break;
                case ')':
                    if (mode === IN_CODE||mode === IN_QM) {
                        //console.log(mode, "hit: ) depth now-> ",depth,"  qstart->",quote_start_depth);
                        if (mode === IN_QM && depth<=quote_start_depth) mode = IN_CODE;
                        store_token();   // push the currently active token into the current list
                        depth--;                // remove the depth by 1
                        if (depth < 0) {
                            //throw new SyntaxError("Unexpected "+text[i]+" "+last_line_num+", col: "+last_column_num+", file pos: "+curpos);
                            token = new_token(ERROR,depth,mode, token_id, curpos,line_num,column_num,quote_start_depth);
                            update_state();
                            token.error = "Unexpected: "+text[i];
                            store_token();
                            depth = 0;
                            continue;
                        }
                        let stack_token = stack.pop(); // get our matching ( token off the stack
                        if (stack_token===null) {
                            throw "Invalid stack state: for ) depth = "+depth;
                        }
                        if (stack_token.type !== PAREN_OPEN) {
                            stack_token.error = 'Unexpected )';
                        }
                        token = stack_token;
                        update_state();         // append the parenthesis and account for the position
                        tokens = stack[stack.length-1].tokens;  // assign our currently active tokens
                        //tokens.push(token);     // and push our completed token ( ) onto the active token list
                        token = null;
                        continue;
                    } /*else if (mode === IN_QM) {
                        depth--;
                        //console.log("quote_mode: ) depth now -> ",depth, "  qstart->",quote_start_depth);
                        if (depth === quote_start_depth) {
                            // quote mode end
                            update_state();
                            store_token();
                            //console.log("ending quote mode: final token: ",token);
                            token = null;
                            quote_start_depth = null;
                            mode = IN_CODE;
                            continue;
                        } } */

                    break;
                case '}':
                    if (mode === IN_CODE || mode === IN_QM ) {
                        if (mode === IN_QM && depth<=quote_start_depth) mode = IN_CODE;
                        store_token();
                        //mode = IN_CODE;
                        depth--;
                        if (depth < 0) {
                            token = new_token(ERROR,depth,mode, token_id, curpos,line_num,column_num,quote_start_depth);
                            update_state();
                            token.error = "Unexpected: "+text[i];
                            store_token();
                            depth = 0;
                            continue;
                        }
                        let stack_token = stack.pop();
                        if (stack_token===null) {
                            throw "Invalid stack state: for } depth = "+depth;
                        }
                        if (stack_token.type !== BRACKET_OPEN) {
                            stack_token.error = 'Unexpected }';
                        }
                        token = stack_token;
                        update_state();
                        tokens = stack[stack.length-1].tokens;

                        token = null;
                        continue;
                    } /*else if (mode === IN_QM) {
                        depth--;
                        if (depth === quote_start_depth) {
                            // quote mode end
                            update_state();
                            store_token();
                            token = null;
                            quote_start_depth = null;
                            mode = IN_CODE;
                            continue;
                        }
                    } */
                    break;
            }
            switch(mode) {
                case IN_CODE:
                    if (token === null && typeof c === "string") token = new_token(SYMBOL,depth,mode, token_id, curpos,line_num,column_num,quote_start_depth);
                    else if (token === null && typeof c === "number") token = new_token(NUMBER,depth,mode, token_id, curpos,line_num,column_num,quote_start_depth);
                    break;
                case IN_QM:
                    if (token === null && typeof c === "string") token = new_token(SYMBOL,depth,mode, token_id, curpos,line_num,column_num,quote_start_depth);
                    else if (token === null && typeof c === "number") token = new_token(NUMBER,depth,mode, token_id, curpos,line_num,column_num,quote_start_depth);
                    break;
                case IN_LONG_STRING:
                    if (token === null) token = new_token(STRING,depth,mode, token_id, curpos,line_num,column_num,quote_start_depth);
                    break;
                default:
                    if (token === null) throw Error("Invalid State: token is null but state is: "+mode);
            }
            if (token === null) {
                console.log("char=",text[i]," mode=",mode," offset=",curpos," last_c=",last_c," last_last_c=",last_last_c);
                throw Error("Invalid state: token is null at end of cycle!");
            }
            update_state();
        }

        if (token!=null) {
            tokens = root_token.tokens;
            store_token();
        }
        //console.log("Root: ",root_token);
        return root_token;
    }

var SymbolCodes={};

SymbolCodes.IN_CODE = 0;
SymbolCodes.IN_COMMENT = 1;
SymbolCodes.IN_QUOTES = 2;
SymbolCodes.IN_REGEX = 3;
SymbolCodes.IN_JS = 4;
SymbolCodes.IN_QM = 5;
SymbolCodes.IN_LONG_STRING = 6;
SymbolCodes.IN_QM_STRING = 7;
SymbolCodes.IN_SPLICE = 8;

SymbolCodes.PAREN_OPEN =10;
SymbolCodes.PAREN_CLOSE = 11;

SymbolCodes.BRACKET_OPEN = 12;
SymbolCodes.BRACKET_CLOSE = 13;

SymbolCodes.SPLICE = 14;

SymbolCodes.SYMBOL = 20;
SymbolCodes.STRING = 21;
SymbolCodes.NUMBER = 22;
SymbolCodes.COMMENT = 23;
SymbolCodes.NEWLINE = 24;
SymbolCodes.SPACE = 25;
SymbolCodes.REGEX = 26;
SymbolCodes.JS = 27;
SymbolCodes.QUOTE = 28;
SymbolCodes.COMMA = 29;
SymbolCodes.ROOT = 30;
SymbolCodes.COLON = 31;
SymbolCodes.BOOLEAN = 32;
SymbolCodes.KEY_MODE = 34;
SymbolCodes.VALUE_MODE = 35;
SymbolCodes.EXPECT_COMMA_MODE = 37;
SymbolCodes.INDENT = 38;
SymbolCodes.ERROR = 40;

export function treeToObject(tree,depth) {
        depth = depth||0;
        //console.log("Tree: ",tree, "-> depth: ",depth);
        if (tree === undefined) return undefined;
        if (tree === null) return null;
 
        let struct;
        if (tree.type === SymbolCodes.SPLICE) {
            return "=$,@";
        } else if (tree.type === SymbolCodes.COMMA) {
            return tree.text;
        } else if (tree.type === SymbolCodes.BRACKET_OPEN) {
            struct = {};
        } else if ((tree.type === SymbolCodes.PAREN_OPEN && tree.mode === SymbolCodes.IN_CODE)|| tree.type === SymbolCodes.ROOT) {
            struct = [];
        } else if (tree.type === SymbolCodes.NUMBER) {
            return parseFloat(tree.text);
        } else if (tree.type === SymbolCodes.SYMBOL && tree.mode === SymbolCodes.IN_CODE) {
            if (tree.text==="true") {
                return true;
            } else if (tree.text==="false") {
                return false;
            }	  
            return "=:" + tree.text;
        } else if (tree.type === SymbolCodes.SYMBOL && tree.mode === SymbolCodes.IN_QM) {
            if (tree.text[0] === '`') {
                //console.log("Quote Tree Start depth 1: ",tree)
                return tree.text.substr(1);
            }
            if (tree.text==="true") {
                return true;
            } else if (tree.text==="false") {
                return false;
            }
	  console.log("Quote Mode: returning: ","=:",tree.text);
            return "=:" + tree.text;
        } else if ((tree.type === SymbolCodes.PAREN_OPEN||tree.type === SymbolCodes.BRACKET_OPEN) && tree.mode === SymbolCodes.IN_QM) {
            let rval = [];
            let new_q = false;
            //console.log("Quote Tree Start depth 2: ",tree)
            if (tree.qstart_depth==depth-1) {
                rval.push("=:quotem");
                new_q = true;
            }
            if (new_q) {
                rval.push(tree.tokens.reduce(function(prev, cur) {
                    //console.log(" <- ",prev);
                    prev.push(treeToObject(cur,depth+1))
                    return prev;
                }, []));
            } else {
                rval = (tree.tokens.reduce(function(prev, cur) {
                    //console.log(" <- ",prev);
                    prev.push(treeToObject(cur,depth+1))
                    return prev;
                }, []));
            }            
            return rval;
        } else if (tree.type === SymbolCodes.STRING) {
            //console.log("  -> ", tree.text.substr(1, tree.text.length - 2))
            return tree.text.substr(1, tree.text.length - 2);
        } else if (tree.type === SymbolCodes.QUOTE && tree.text==='`') {
            let rval = ["=:quotem"];
            //console.log("Quote Tree Start depth 3: ",tree);
            rval.push(tree.tokens.reduce(function (prev, cur) {
                console.log(" <- ", prev);
                prev.push(treeToObject(cur,depth+1));
                return prev;
            }, []));
            //console.log(" -> returning ", rval);
            return rval;
        } else if (tree.type === SymbolCodes.QUOTE && tree.mode === SymbolCodes.IN_QM) {
            if (tree.text[0] === '`') {
                //console.log("Quote Tree Start depth 4: ",tree);
                return tree.text.substr(1);
            }
            return "=:" + tree.text;
        } else return tree.text;
        if (struct instanceof Array) {          
	  if (tree.mode === SymbolCodes.IN_CODE && tree.tokens.length == 2 && tree.tokens[0].text == "=" && tree.tokens[1].text == ":") {
            struct.push("=:")	    
	  } else if (tree.mode === SymbolCodes.IN_CODE && tree.tokens.length == 3 && tree.tokens[0].text == "quote" && tree.tokens[1].text == "=" && tree.tokens[2].text == ":") {
	    struct.push("=:")
	  } else {
	    console.log("->",tree.tokens);
	      for(let i in tree.tokens) {
		let token = tree.tokens[i];	      
                struct.push(treeToObject(token,depth+1));
	      }
            }	   
        } else if (typeof struct === 'object') {
            //console.log("Tree:  # tokens: ",tree.tokens.length,": ",tree);
            for (let i = 0 ; i < tree.tokens.length; i+=3) {
                if (tree.tokens[i+1] === undefined) {
                    throw new SyntaxError("Expected ':' at pos:"+tree.tokens[i].offset_start+1+": line:"+(tree.tokens[i].line_start+1)+"  col:"+tree.tokens[i].column_start);
                } else if (tree.tokens[i+1].type !== SymbolCodes.COLON) {
                    throw new SyntaxError("Expected ':' at pos:"+tree.tokens[i+1].offset_start+": line:"+(tree.tokens[i+1].line_start+1)+"  col:"+tree.tokens[i+1].column_start);
                }
                struct[treeToObject(tree.tokens[i],depth+1)]=treeToObject(tree.tokens[i+2],depth+1);
            }
        }  
        return struct;
    }

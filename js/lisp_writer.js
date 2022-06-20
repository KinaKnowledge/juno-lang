// lisp_writer
// converts JSON based to the DLisp representation

export function check_true(val) {
  return val||0===val
}

export function get_outside_global(refname) {
  try {
    let tfn = new Function("{ if (typeof " + refname + " === 'undefined') { return undefined } else { return "+refname+" } }");
    return tfn();
  } catch (ex) {
    return undefined;
  }
}

export function subtype(value) {
  if (value === null) return "null";
  else if (value === undefined) return "undefined";
  else if (value instanceof Array) return "array";
  else if (value.constructor && value.constructor!=null && value.constructor.name!=='Object') {
    return value.constructor.name;
  }
  return typeof value;
}

globalThis.dlisp_environment_count=0;

export class LispSyntaxError extends SyntaxError {
  constructor(json_structure) {
    super(JSON.stringify(json_structure));
    this.name = 'LispSyntaxError';
  }
}

// make it available to the global JS environment
globalThis.LispSyntaxError=LispSyntaxError

export function get_next_environment_id() {
    globalThis.dlisp_environment_count++;
    return globalThis.dlisp_environment_count;
}



export function lisp_writer(obj,depth,max_depth) {
  if (depth===undefined) depth=0;
  if (max_depth===undefined) max_depth=1502;
  const bracketStyles=['(',')','(',')','{','}'];
  let bracketStyle=0;
  let text='';
  let type = subtype(obj);
  //if (depth === 0) console.log("lisp_writer:->",obj);
  if (type === undefined) {
    type = "UNKNOWN"
  }
  if (max_depth && (depth > max_depth)) {
    return "...";
  }
  if (depth > 500) {
    console.warn("lisp_writer: depth bomb: object: ",type);
    throw new Error("recursion too deep");
  }
 
  if (obj===undefined) return 'undefined';
  if (obj===null) return 'null';
  if (typeof obj==='number') return obj;
  if (typeof obj==='function') {
    //if (depth === 0) console.log("lisp_writer: <- [ function ]",obj.toString());
    if (obj.name) { return obj.name }
    
    return "lambda";
  } // technically this shouldn't be a JSON object but this is a convenience for us..
  if (obj instanceof Array) {
    if (obj.length > 0 && obj[0] instanceof String && obj[0].startsWith("=:")) {
      bracketStyle = 2;
    }
    text += bracketStyles[bracketStyle];
    // determine if we have any objects or arrays in the list
    for (let i in obj) {
      if (i > 0) text += ' ';
      
      text += lisp_writer(obj[i],depth+4,max_depth);
    }
    text += bracketStyles[bracketStyle+1];
    //if (depth === 0) console.log("lisp_writer: <- [ array ]",text);
    return text;
  } else if (typeof obj ==='object') {
    // object {}
    if (obj.constructor && obj.constructor.name !== "Object") {
      if (typeof Element != 'undefined') {
        if (obj instanceof Element) {
          let clist = Array.from(obj.classList).join(" ");
          if (obj.id) {
            return obj.constructor.name+"/"+obj.tagName.toLowerCase()+"#"+obj.id;
          } else {
            return obj.constructor.name+"/"+obj.tagName.toLowerCase()+"."+clist;
          }
        } else {
          return "" + obj.constructor.name + "";
        }
      } else {
        return "" + obj.constructor.name + "";
      }
    }
    bracketStyle=4;
    text+=bracketStyles[bracketStyle];
    let keys = Object.keys(obj);
    for (let i in keys) {
      if (i > 0) text+= ' ';
      if (typeof obj[keys[i]]=="symbol") {
	text+=lisp_writer(keys[i],depth+4)+": \"<symbol>\"";
      } else {
	text+=lisp_writer(keys[i],depth+4)+":"+lisp_writer(obj[keys[i]],depth+4, max_depth)
      }
    }
    text += bracketStyles[bracketStyle+1];
    //if (depth === 0) console.log("lisp_writer: <- [ object ]",text);
    return text;
  } else if (typeof obj === 'string') {
    // string    
    if (obj==="=:") return obj;
    else if (obj==="=:##") return ",#";
    else if (obj==="=$,@") return "=$,@";
    else if (obj.startsWith("=:")) return obj.substr(2);
    
    obj = obj.replaceAll("\"","\\\"");        
    obj = obj.replaceAll("'","\\'");        
    obj = obj.replaceAll("\n",'\\n');
    obj = obj.replaceAll("\r",'\\r');
    obj = obj.replaceAll("\f",'\\f');
    obj = obj.replaceAll("\b",'\\b');			         
    //obj = JSON.stringify(obj);  // encode with JSON semantics
    
    //if (depth == 0) console.log("lisp_writer: <-",'"'+obj+'"');
    
    return '"'+obj+'"';
    
    
  } else {
    //if (depth === 0) console.log("lisp_writer: <- [ other ]",obj);
    return obj; // numbers and booleans
  }
}

export function clone(src,depth) {
        if (src===null) {
            return null;
        }
        depth = depth || 0;
        if (depth >= 500) {
          throw new EvalError("too deep");
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


// Source: core.lisp  
// Build Time: 2023-04-14 12:00:06
// Version: 2023.04.14.12.00
export const DLISP_ENV_VERSION='2023.04.14.12.00';




const { get_next_environment_id, check_true, get_outside_global, subtype, lisp_writer, clone, LispSyntaxError } = await import("./lisp_writer.js");
export async function environment_boot(Environment)  {
{
    await Environment.set_global("special_definitions",await (async function(){
         return [{
            name:"+",usage:["arg0:*","argN:*"],description:("The plus operator takes an arbitrary number of arguments and attempts to 'add' them together. "+ "Of all the mathematical operators, this is the only one that is overloaded in terms of the "+ "type of values it can take.  The adding operation undertaken by the + operator is determined "+ "by the first argument in the argument list. The operator accepts the following types: <br>"+ "numbers, Objects, arrays and Strings.<br> "+ "If the argument type is a number (or declared to be a number), then the normal infix "+ "mathematical expression will be constructed in the emitted javascript, otherwise the synchronous "+ "add function will be used to handle the addition in a dynamic fashion during execution. <br><br>"+ "Adding Objects<br>"+ "When two objects are added together, a new Object is constructed with the keys and values from "+ "each object in successive order from the argument list.  If a later object contains the same "+ "key as an earlier object, the later object's value will be used and will overwrite the earlier "+ "value of the same key. <br>Example: (+ { abc: 123 def: 456 } { abc: 789 }) -> { abc: 789 def: 456 }<br>"+ "If a non-object type is encountered after starting with an object it is ignored.<br>"+ "<br>Adding Arrays<br>"+ "If an array is the first argument to the operator, all subsequent argument values are appended "+ "to the first array and the first array is returned as the result.  The types of the subsequent "+ "arguments are not interrogated unlike with Object addition, and are simply concatenated to the "+ "first argument.  <br>Example: (+ [ 1 2 3 ] [ 4 5 6] 7 8) <-  [ 1 2 3 [ 4 5 6 ] 7 8 ]<br>"+ "<br>Adding Strings<br>"+ "A new string is returned as a result of adding all subsequent arguments together.  If a subsequent "+ "argument is a string, or is an object with a toString method defined, it is appended to the result "+ "as expected.  Otherwise, the default string representation in the prototype chain will be used, "+ "which may not be what is expected.<br>"+ "Example: ```(+ \"This is the result: \" (fn (v) (+ 1 2))) <- \"This is the result: async "+ "function(v) {\n return (1+ 2)\n}\"```<\n"+ "Example: ( + \"1\" \"2\" ) <- \"12\" <br>"+ "Example: (+ \"John\" \"Jingleheimer\") <- \"JohnJingleheimer\"<br>"+ "Example: (+ \"An object:\" { abc: 123 }) <- \"An object: [object Object]\"<br>"),tags:["special","add","+","addition","arithmetic"]
        },{
            name:"-",usage:["arg0:*","argN:*"],description:"Subtracts from the first argument all subsequent arguments and returns the result.",tags:["special","subtract","-","arithmetic"]
        },{
            name:"/",usage:["dividend:number","argN:number"],description:"Arithmetically divides the first argument (dividend) by all subsequent arguments (divisors) and returns the result.",tags:["special","division","divide","arithmetic"]
        },{
            name:"*",usage:["arg0:number","argN:number"],description:"Multiplies the first argument with all subsequent arguments, returning the result.",tags:["special","multiplication","arithmetic"]
        },{
            name:"**",usage:["base:number","exponent:number"],description:"The exponentiation operator raises the first argument to the power of the second argument.",tags:["special","exponent","base","power","arithmetic"]
        },{
            name:"%",usage:["dividend:number","divisor:number"],description:"Modulo (Remainder) divides the first argument by the second argument and returns the remainder from the division operation.",tags:["special","remainder","modulo","division","arithmetic"]
        },{
            name:"<<",usage:["value:number","amount_to_shift_left:number"],description:"The << operator performs a leftward shift of the bits of the first argument by the amount of the second argument.",tags:["special","shift","bit","left"]
        },{
            name:">>",usage:["value:number","amount_to_shift_right:number"],description:"The << operator performs a rightward shift of the bits of the first argument by the amount of the second argument.",tags:["special","shift","bit","right"]
        },{
            name:"and",usage:["arg0:*","argN:*"],description:("Each argument to the and operator is evaluated, and upon the first value that is a Javascript false "+ "(or an equivalent false, such as nil, undefined or 0), the encountered false is returned.  If all values "+ "are equivalent to true , then the final argument is returned. Equivalent to && in Javascript."),tags:["logic","condition","true","false","&&"]
        },{
            name:"or",usage:["arg0:*","argN:*"],tags:["logic","condition","true","false","||"]
        },{
            name:"apply",usage:["function_to_call:function","arg0:*","argN:array"],description:("Apply calls the specified function (first argument) with the subsequent arguments.  The last argument "+ "must be an array, which contains the remaining arguments. <br>"+ "Example: (apply add 1 2 [ 3 4 5]) <- 15<br>"),tags:["function","arguments","array","call"]
        },{
            name:"call",usage:["target:object","function_to_call:text","argsN:*"],description:("Given a target object, a function to call, calls the function in the target object with the target object as the this value. "+ "The remaining arguments are provided as arguments to the method being called. A synonym for call is the -> operation."+ "The result of the call is returned."),tags:["function","call","->","this","object"]
        },{
            name:"->",usage:["target:object","function_to_call:text","argsN:*"],description:("Given a target object, a function to call, calls the function in the target object with the target object as the this value. "+ "The remaining arguments are provided as arguments to the method being called. A synonym for -> is the call operation."+ "The result of the call is returned."),tags:["object","function","call","->","this"]
        },{
            name:"set_prop",usage:["place:object","key0:string|number","value0:*","keyN:string","valueN:*"],description:("Sets a property on the designated place (an object) using the key as the property name and the provided value as the value."+ "The operator returns the object that was modified.")
        },{
            name:"prop",usage:["place:object","key:string|number"],description:("Returns a property on the designated place (an object) using the key as the property name.  If the key isn't found, undefined is returned.")
        },{
            name:"=",usage:["target:symbol","value:*"],description:("Sets the target symbol to the provided value and returns the value.   A Reference error is thrown if the symbol is undeclared."),tags:["assignment","set","value"]
        },{
            name:"setq",usage:["target:symbol","value:*"],description:("Sets the target symbol to the provided value and returns the value.   A Reference error is thrown if the symbol is undeclared."),tags:["assignment","set","value"]
        },{
            name:"==",usage:["value0:*","value1:*"],description:("Represents the Javascript === operator and returns true if the operands are equal and of the same type, otherwise false."),tags:["equality","equivalence","equal","eq"]
        },{
            name:"eq",usage:["value0:*","value1:*"],description:("Represents the Javascript == operator and returns true if the operands are \"equal\".  This is a looser definition of equality "+ "then ===, and different types can be considered equal if the underlying value is the same.<br>"+ "Example: (== 5 \"5\") is considered the same."),tags:["equality","equivalence","equal","eq"]
        },{
            name:">",usage:["value_left:number","value_right:number"],description:("Returns true if the left value is greater than the right value, otherwise returns false."),tags:["equivalence","equal","comparison","gt"]
        },{
            name:"<",usage:["value_left:number","value_right:number"],description:("Returns true if the left value is smaller than the right value, otherwise returns false."),tags:["equivalence","equal","comparison","lt"]
        },{
            name:">=",usage:["value_left:number","value_right:number"],description:("Returns true if the left value is greater than or equal to the right value, otherwise returns false."),tags:["equivalence","equal","comparison","gt"]
        },{
            name:"<=",usage:["value_left:number","value_right:number"],description:("Returns true if the left value is less than or equal to the right value, otherwise returns false."),tags:["equivalence","equal","comparison","gt"]
        },{
            name:"new",usage:["constructor:function","argN:*"],description:"Given a constructor function and arguments, returns an instantiated object of the requested type.",tags:["constructor","instantiation","object","class"]
        },{
            name:"progn",usage:["form0:*","form1:*","formN:*"],description:await (async function(){
                 return ["=:+","The block operator evaluates all forms in the order they were provided and returns the last value.","If the block operator is a top level form, then the forms are evaluated as top level forms, in ","which the form is compiled and immediately evaluated. The results of any side effects of the ","compiled form are therefore available to subsequent processing.<br>","The block operator introduces a new lexical scope boundary (in JS the equivalence { } ) such that symbols ","defined locally to the block via defvar will not be visible to blocks above it, only subforms and ","blocks defined within it."] 
            })(),tags:["block","progn","do","scope"]
        },{
            name:"do",usage:["form0:*","form1:*","formN:*"],description:await (async function(){
                 return ["=:resolve_path",["definitions","progn"],["=:Environment.get_namespace_handle","core"]] 
            })(),tags:["block","progn","do","scope"]
        },{
            name:"progl",usage:["form0:*","form1:*","formN:*"],description:("Like progn, progl is a block operator, but doesn't establish a new scope boundary in the contained forms."+ "It also doesn't return any values, but acts as a means by which to manipulate quoted forms (for example in a macro)."),tags:["block","progn","do"]
        },{
            name:"break",usage:[],description:("The break operator is a flow control mechanism used to stop the iteration of a for_each or while "+ "loop. It should be used as a direct subform of the for_each or while."),tags:["block","flow","control"]
        },{
            name:"inc",usage:["target:symbol","amount:?number"],description:("Increment the target symbol by the default value of 1 or the provided amount as a second argument. "+ "The operator returns the new value of the target symbol."),tags:["increment","count","dec"]
        },{
            name:"dec",usage:["target:symbol","amount:?number"],description:("Decrement the target symbol by the default value of 1 or the provided amount as a second argument. "+ "The operator returns the new value of the target symbol."),tags:["decrement","count","inc"]
        },{
            name:"try",usage:["expression:*","error-clause0:array","error-clauseN:array"],description:("An expression or block surrounded by a try-catch error clause which throws an Error "+ "or subclass of Error is checked against all (but at least 1) catch expressions that match the type "+ "of error which has been thrown. If the error type is matched by a handler for that type, the catch "+ "expression is evaluated. If a handler for the error type or the error's prototype chain isn't "+ "found, the exception is rethrown, for potential interception by handlers further up the stack "+ "heirarchy.  In the following example, the specific error thrown is caught locally.  If an error "+ "was thrown that wasn't specifically Deno.errors.NotFound, the error would be rethrown: ```"+ "(try\n"+ "   (write_text_file \"/will/not/work.txt\" \"No permissions\")\n"+ "   (catch Deno.errors.NotFound (e)\n"+ "     (+ \"CAUGHT: type: \" (subtype e) \"MESSAGE: \" e.message)))```"+ "<- \"CAUGHT: type:  NotFound MESSAGE:  No such file or directory (os error 2), open '/will/not/work.txt'\"<br>\n"+ "An example of multiple catches for the same try block:```"+ "(try\n"+ "  (throw Error \"ERROR MESSAGE\")\n"+ "  (catch TypeError (e)\n"+ "    (progn\n"+ "      (log \"Caught TypeError: \" e.message)\n"+ "      \"ERROR 1\"))\n"+ "  (catch Error (e)\n"+ "    (progn\n"+ "        (log \"Caught BaseError: \" e.message)\n"+ "        \"ERROR 2\")))```"+ "<- \"ERROR 2\"<br><br>The try-catch constructs returns the last value of the try block "+ "or the return value from a matched catch block, otherwise there is no local return.<br>Example:```"+ "(let\n"+ "   ((result (try\n"+ "              (throw Error \"Invalid!\") ; just throw to demonstrate the catch return\n"+ "              (catch Error (e)\n"+ "                  e.message))))\n"+ "   result)```"+ "<- \"Invalid!\""),tags:["catch","error","throw","flow","control"]
        },{
            name:"throw",usage:["type:symbol","message:string"],description:("Given a type as a symbol and a message, constructs an object instance of the specified type "+ "and then throws the object.  The thrown object should be lexically enclosed in a try-catch "+ "form otherwise the unhandled throw may cause an exit of the runtime (dependent on the "+ "runtime environment behavior for uncaught objects.<br>See also: try<br>"),tags:["flow","control","error","exceptions","try","catch"]
        },{
            name:"catch",usage:["error_type:*","allocation:array","expression:*"],description:await (async function(){
                 return ["=:resolve_path",["definitions","try"],["=:Environment.get_namespace_handle","core"]] 
            })(),tags:["flow","control","error","exceptions","try","throw"]
        },{
            name:"let",usage:["allocations:array","declarations:?expression","expression0:*","expressionN:*"],description:("Let is the primary means in which to allocate new bindings, and operate on the declared "+ "bindings. The binding forms are evaluated sequentially, but the declared symbols are "+ "available for all allocation forms, regardless of position in the sequence of binding "+ "forms.  Once all the bindings have been evaluated, the expressions are evaluated in an "+ "implicit progn block, with the result of the evaluation of the last expression being "+ "returned to the caller.  Note that even though a symbol binding may be accessible to "+ "all expressions in the allocation forms, the referenced symbol may not be initialized "+ "and have a value of undefined, so caution must be taken to not reference values in "+ "prior to initialization.  Syntactically, all symbols allocated in let must be defined "+ "an initial value, and so the form (let ((a)) (= a 1)) is invalid.<br>"+ "<br>Example:```"+ "(let\n"+ "  ((a 2)      ; b, and f are visible at this point but b and f are undefined\n"+ "   (f (fn ()  ; when f is called, a and b will be defined and have value\n"+ "        (* a b)))\n"+ "   (b 21))    ; once b's init form completes b will be set to the value 21\n"+ "  (log \"a is: \" a \" b is: \" b)   ; first block expression - all allocatoins complete\n"+ "  (f))         ; last block expression, f will be called and return 42```"+ "<- 42<br>"+ "Note that the above example doesn't contain an optional declaration form, "+ "which must come after the allocations and before the block expressions.<br><br>"+ "Another consideration when using let is that within the allocation forms, any references to "+ "symbols that are lexically scoped outside the let have their values available.  If the contained "+ "let re-binds an existing symbol, the new binding will have lexical precedence and the value "+ "of the rebound symbol will be determined by the result of the init-form of the allocation."+ "This same rule applies to global values: if a let rebinds a global symbol in an allocation, "+ "the symbol referenced in the let scope will be the local value, and not the global.  This is "+ "defined as shadowing.<br>"+ "Example: ```"+ "(let\n"+ "  ((a_binding 1))\n"+ "  (log \"outer: a_binding: \" a_binding)\n"+ "  (let ;; start inner let\n"+ "     ((b_binding 2)\n"+ "      (a_binding 3))  ;  a is rebound to 3\n"+ "     (log \"inner: a_binding: \" a_binding \" b_binding: \" b_binding)\n"+ "     a_binding)\n"+ "  (log \"outer: a_binding: \" a_binding) ; outer binding again\n"+ "  a_binding)\n"+ "out: \"outer: a_binding: \" 1 \n"+ "out: \"inner: a_binding: \" 2 \"b_binding: \" 3\n"+ "out: \"outer: a_binding: \" 1 ```<br>"+ "Declarations can be placed after the allocation form and prior to the "+ "expressions comprising the block:```"+ "(defun handler (options)\n"+ "   (let\n"+ "      ((validator options.validator)\n"+ "       (user_input (request_user_input \"Enter your value\")))\n"+ "      (declare (function validator))\n"+ "      (validator user_input)))```"+ "<br>In the above the declare provides an optimization hint for the "+ "compiler.  Without the declare, the compiler would have to insert "+ "code that checks at runtime whether or not the options.validator value "+ "is a function prior to calling it, resulting in less execution efficiency. "),tags:["compiler","allocation","symbol","initializing","scope","declaration"]
        },{
            name:"defvar",usage:["name:symbol","value:*"],description:("Define a symbol in the local block scope. The operation doesn't have a return value "+ "and a SyntaxError will be thrown by the compiler if the result of a defvar operation "+ "is used as part of an assignment form."),tags:["allocation","define","var","reference","symbol"]
        },{
            name:"defconst",usage:["name:symbol","value:*"],description:("Define a constant in either the local scope or global scope.  The defconst operator "+ "can be used in both subforms and at the toplevel to specify that a symbol value be "+ "treated as a constant.  When top-level, the metadata will indicate that the "+ "defined symbol is a constant.  Any attempted changes to the value of the symbol "+ "will result in a TypeError being thrown.<br>"+ "Example:```"+ "(defconst ghi \"Unchanging\")\n"+ "<- \"Unchanging\"\n\n"+ "(= ghi \"Hi there\")\n"+ "<- TypeError Assignment to constant variable ghi```<br>"),tags:["allocation","symbol","define","constant","const"]
        },{
            name:"while",usage:["test_expression:*","body_expression:array"],description:("The while operator checks the return value of a test_expression and if the result of the "+ "test is true (or a result equivalent to true), it will then evaluate the body expression. "+ "If the result is false, then the while loop doesn't evaluate the body_expression and "+ "completes.  Once the body expression is evaluated, the test expression will be "+ "evaluated again and the cycle will continue, potentially forever, so it is important "+ "to be careful to have a means to break out or the execution environment may not "+ "ever return.  The body of the while is not a block, so if there are multiple "+ "expressions to be evaluated as part of the body expression they must be wrapped "+ "in a progn block operator. The break operator can be used to `break out` of the "+ "loop in addition to the test expression returning false.<br>There is no return "+ "value from a while loop; it should be considered undefined.<br>Example:```"+ "(let\n"+ "  ((i 10)\n"+ "   (count 0))\n"+ "  (while (> i 0)\n"+ "    (progn\n"+ "      (inc count i)\n"+ "      (dec i)))\n"+ "  ; note: there is no return value from while\n"+ "  count)\n"+ "<- 55```"),tags:["flow","control","loop","break","for_each"]
        },{
            name:"for_each",usage:["allocation_form","body_expression:array"],description:("The for_each operator provides a simple loop variable that allocates a "+ "symbol which is assigned the next value in the returned array from the "+ "init form in the allocation. It then evaluates the body expression "+ "with the symbol in scope.  It will continue to loop, with the allocated "+ "symbol being defined successive values until the end of the array "+ "is reached, or a (break) operator is encountered in the body "+ "expression. Unlike while, the for_each operator is a collector, and "+ "all values returned from the body_expression will be returned as an "+ "array from for_each.<br>Example:```"+ "(for_each (r (range 5))\n"+ "     (* r 2))\n"+ "<- [0 2 4 6 8]```<br>"),tags:["flow","control","loop","break","while"]
        },{
            name:"if",usage:["test_form:*","if_true:*","if_false:*"],description:("The conditional if operator evaluates the provided test form "+ "and if the result of the evaluation is true, evaluates and returns "+ "the results of the if_true form, otherwise the if form will "+ "evaluate and return the result of the if_false form.<br>"+ "Example:```"+ "(progn\n"+ "   (defvar name (request_user_input \"Enter your name:\"))\n"+ "   (if (blank? name)\n"+ "        \"No Name Entered\"\n"+ "        (+ \"Hello \" name)))\n"+ "```"),tags:["flow","control","condition","logic","cond","branching"]
        },{
            name:"cond",usage:["test_expr0:*","if_true_expr0:*","test_expr1:*","if_true_expr1:*","test_exprN:*","if_true_exprN:*"],description:("The cond operator evaluates test expressions sequentially, until either a true value is "+ "returned or the end of the test expressions are reached.  If a test expression returns "+ "true, the if_true expression following the test expression is evaluated and the result "+ "returned.  If no expressions match, then nil is returned.  There is a special keyword "+ "available in the cond form, else, which is syntactic sugar for true, that can be used "+ "to always have a default value.  The else or true test expression should always be the "+ "final test expression otherwise a SyntaxError will result. <br>Example:```"+ "(let\n"+ "  ((name (request_user_input \"Enter your first name name:\")))\n"+ "  (cond\n"+ "    (blank? name)  ; first test\n"+ "    \"Hello there no-name!\"\n"+ "    (< (length name) 12)  ; second test\n"+ "    (+ \"Hello there \" name \"!\")\n"+ "    else  ; the default\n"+ "    (+ \"Hello there \" name \"! Your first name is long.\")))```<br>"),tags:["flow","control","condition","logic","if","branching"]
        },{
            name:"fn",usage:["arguments:array","body_expression:*"],description:("There are multiple types of functions that can be created depending on the requirements of the "+ "use case:<br>"+ "The lambda and fn operators create asynchronous functions. The fn is shorthand for lambda and can be used interchangably.<br>"+ "The function keyword creates a synchronous function. <br>"+ "The => operator creates Javascript arrow functions.<br>"+ "All definitions return a form which contains the compiled body expression. The provided argument array maps  "+ "the symbol names to bound symbols available within the body expression. The body expression is evaluated "+ "with the bound symbols containing the values of arguments provided at time the function is called and the "+ "result of the body expression is returned from the function call.<br>"+ "Typically, the body expression is a progn with multiple forms, however, this is not always necessary "+ "if the function being defined can be contained in a single form.  With the exception of arrow functions, "+ "functions always establish a new block scope, and any arguments that have the same symbolic names as globals "+ "or variables in the closure that defines the function will be shadowed.<br>"+ "<br>"+ "Once defined, the function is stored in compiled form, meaning that if inspected, the javascript that comprises "+ "function will be returned as opposed to the source code of the function.<br>"+ "There is a special operator for the arguments that can be used to capture all remaining arguments of a "+ "function, the quoted &.  If the `& is included in the argument list of a function, all remaining run time values at "+ "the index of the `& operator will be returned as part of the symbol following the `& operator.  This symbol should be "+ "the last symbol in a argument list.<br>"+ "Example of an asynchronous function:```"+ "(fn (a b)     ;; a and b are the arguments that are bound\n"+ "   (/ (+ a b) 2)) ;; the body expression that acts on the bound arguments a and b```<br><br>"+ "Example with the ampersand argument operator used in a synchronous function:```"+ "(function (initial `& vals)\n"+ "   (/ (+ initial (apply add vals))\n"+ "      (+ 1 (length vals))))```"+ "<br>In the above example, add was used in the apply because the + operator isn't a true function.<br>"+ "Arrow functions do not define their own scope and should be used as anonymous functions within let and scoped blocks.<br>"+ "Example:```"+ "(let\n"+ "  ((i 0)\n"+ "   (my_incrementor (=> (v)\n"+ "                     (inc i v)))\n"+ "   (my_decrementor (=> (v)\n"+ "                     (dec i v))))\n"+ "  (my_incrementor 4)\n"+ "  (my_decrementor 2)\n"+ "  i)```"+ "<- 2<br>"+ "<br>"+ ""),tags:["function","lambda","fn","call","apply","scope","arrow","lambda"]
        },{
            name:"function",usage:["arguments:array","body_expression:*"],description:await (async function(){
                 return ["=:resolve_path",["definitions","fn"],["=:Environment.get_namespace_handle","core"]] 
            })(),tags:["function","lambda","fn","call","apply","scope","arrow","lambda"]
        },{
            name:"=>",usage:["arguments:array","body_expression:*"],description:await (async function(){
                 return ["=:resolve_path",["definitions","fn"],["=:Environment.get_namespace_handle","core"]] 
            })(),tags:["function","lambda","fn","call","apply","scope","arrow","lambda"]
        },{
            name:"lambda",usage:["arguments:array","body_expression:*"],description:await (async function(){
                 return ["=:resolve_path",["definitions","fn"],["=:Environment.get_namespace_handle","core"]] 
            })(),tags:["function","lambda","fn","call","apply","scope","arrow","lambda"]
        },{
            name:"defglobal",usage:["name:symbol","value:*","metadata:object"],description:("Defines a global variable in the current namespace, or if preceded by a namespace "+ "qualifier, will place the variable in the designated namespace.  The metadata value "+ "is an optional object that provides information about the defined symbol for purposes "+ "of help, rehydration, and other context.  The metadata object tags are arbitrary, but "+ "depending on the type of value being referenced by the symbol, there are some "+ "reserved keys that are used by the system itself.<br>Example:```"+ "(defglobal *global_var* \"The value of the global.\"\n"+ "           { description: \"This is a global in the current namespace\"\n"+ "             tags: [ `keywords `for `grouping ] }\n```"+ "<br>"+ "The key/value pairs attached to a symbol are arbitrary and "+ "can be provided for purposes of description or use by users or programatic elements."),tags:["function","lambda","fn","call","apply","scope","arrow","lambda"]
        },{
            name:"list",usage:["item0:*","item1:*","itemN:*"],description:("Unlike languages like Common-Lisp and other lisps that use proper lists, "+ "the Juno language doesn't have a true list type.  All sequential collections "+ "are in arrays because the underlying language, Javascript, doesn't have a "+ "true list structure.  The list operator here is for backward compatibility "+ "with older versions of this language that explicitly used the term as part of "+ "a way to construct an array.")
        },{
            name:"yield",usage:["value:*"],description:("Note that the yield operator and generator functions aren't official yet and "+ "are still requiring development work and testing due to how to structure "+ "the emitted code to ensure that the yield is placed within a function* "+ "structure vs. a typical function."),tags:["generator","experimental"]
        },{
            name:"for_with",usage:["allocation_form","body_expression:array"],description:("The for_with operator provides a simple loop variable that allocates a "+ "symbol which is assigned the next value from the iterator function in the "+ "init form in the allocation. It then evaluates the body expression "+ "with the symbol in scope.  It will continue to loop, with the allocated "+ "symbol being defined successive values until the end of the array "+ "is reached, or a (break) operator is encountered in the body "+ "expression. Unlike for_each, the for_with operator is not a collector, and "+ "there is no return value and attempting to assign the return value will not work.<br>Example:```"+ "(for_with (next_val (generator instream))\n"+ "     (log (-> text_decoder `decode next_val)))\n"+ "```<br>"),tags:["iteration","generator","loop","flow","control"]
        },{
            name:"Environment",usage:[],license:(["Copyright (c) 2022-2023, Kina, LLC","Permission is hereby granted, free of charge, to any person obtaining a copy","of this software and associated documentation files (the \"Software\"), to deal","in the Software without restriction, including without limitation the rights","to use, copy, modify, merge, publish, distribute, sublicense, and/or sell","copies of the Software, and to permit persons to whom the Software is","furnished to do so, subject to the following conditions:","","The above copyright notice and this permission notice shall be included in all","copies or substantial portions of the Software.","","THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR","IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,","FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE","AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER","LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,","OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE","SOFTWARE."]).join("\n"),description:("The Environment object facilitates the runtime capabilities of the Juno system.")
        }] 
    })(),{
        requires:["join"],externals:["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],source_name:"core.lisp"
    });
    await (async function() {
        let __for_body__3=async function(entry) {
            await async function(){
                Environment.definitions[(entry && entry.name)]={
                    description:((entry && entry["description"])|| ""),usage:((entry && entry["usage"])|| []),tags:((entry && entry["tags"])|| []),type:"Special"
                };
                return Environment.definitions;
                
            }();
            if (check_true ((entry && entry["license"]))){
                return await async function(){
                    let __target_obj__6=Environment.definitions[(entry && entry.name)];
                    __target_obj__6["license"]=(entry && entry["license"]);
                    return __target_obj__6;
                    
                }()
            }
        };
        let __array__4=[],__elements__2=(await Environment.get_global("special_definitions"));
        let __BREAK__FLAG__=false;
        for(let __iter__1 in __elements__2) {
            __array__4.push(await __for_body__3(__elements__2[__iter__1]));
            if(__BREAK__FLAG__) {
                 __array__4.pop();
                break;
                
            }
        }return __array__4;
         
    })();
    await (await Environment.get_global("undefine"))("core/special_definitions");
    await Environment.set_global("defmacro",async function(name,arg_list,...body) {
        let macro_name;
        let macro_args;
        let macro_body;
        let source_details;
        macro_name=name;
        macro_args=arg_list;
        macro_body=body;
        source_details={
            eval_when:{
                compile_time:true
            },name:await (async function(){
                if (check_true (await (await Environment.get_global("starts_with?"))("=:",name))){
                    return await name["substr"].call(name,2)
                } else {
                    return name
                }
            })(),macro:true,fn_args:await (await Environment.get_global("as_lisp"))(macro_args)
        };
        {
            return ["=:defglobal",macro_name,["=:fn",macro_args,].concat(macro_body),["=:quote",source_details]]
        }
    },{
        eval_when:{
            compile_time:true
        },description:"simple defmacro for bootstrapping and is replaced by the more sophisticated form.",requires:["starts_with?","as_lisp"],requires:["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],source_name:"core.lisp"
    });
    await Environment.set_global("read_lisp",(await Environment.get_global("reader")),{
        requires:["reader"],externals:["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],source_name:"core.lisp"
    });
    await Environment.set_global("desym",async function(val) {
        let strip;
        strip=async function(v) {
            return (""+ await (await Environment.get_global("as_lisp"))(v))
        };
        return await async function(){
            if (check_true ((val instanceof String || typeof val==='string'))) {
                return await strip(val)
            } else if (check_true ((val instanceof Array))) {
                return await (async function() {
                    let __for_body__9=async function(v) {
                        return await strip(v)
                    };
                    let __array__10=[],__elements__8=val;
                    let __BREAK__FLAG__=false;
                    for(let __iter__7 in __elements__8) {
                        __array__10.push(await __for_body__9(__elements__8[__iter__7]));
                        if(__BREAK__FLAG__) {
                             __array__10.pop();
                            break;
                            
                        }
                    }return __array__10;
                     
                })()
            } else {
                return val
            }
        } ()
    },{ "eval_when":{ "compile_time":true
},"name":"desym","macro":true,"fn_args":"(val)","description":"Given a value or arrays of values, return the provided symbol in it's literal, quoted form, e.g. (desym myval) => \"myval\"","usage":["val:string|array"],"tags":["symbol","reference","literal","desymbolize","dereference","deref","desym_ref"],"requires":["as_lisp","is_string?","is_array?"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("desym_ref",async function(val) {
    return ["=:+","",["=:as_lisp",val]]
},{ "eval_when":{ "compile_time":true
},"name":"desym_ref","macro":true,"fn_args":"(val)","description":["=:+","Given a value will return the a string containing the desymbolized value or values. ","Example: <br>","(defglobal myvar \"foo\")<br>","(defglobal myarr [ (quote myvar) ])<br>","(desym_ref myarr) <- (myvar)<br>","(desym_ref myarr.0) <- myvar<br>","(subtype (desym_ref myarr.0)) <- \"String\""],"usage":["val:*"],"tags":["symbol","reference","syntax","dereference","desym","desym_ref"],"requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("deref",async function(val) {
    return ["=:let",[["=:mval",val]],["=:if",["=:and",["=:is_string?","=:mval"],["=:starts_with?","=:","=:mval"]],["=:->","=:mval","substr",2],"=:mval"]]
},{ "eval_when":{ "compile_time":true
},"name":"deref","macro":true,"fn_args":"(val)","description":["=:+","If the value that the symbol references is a binding value, aka starting with '=:', then return the symbol value ","instead of the value that is referenced by the symbol. This is useful in macros where a value in a form is ","to be used for it's symbolic name vs. it's referenced value, which may be undefined if the symbol being ","de-referenced is not bound to any value. <br>","Example:<br>","Dereference the symbolic value being held in array element 0:<br>","(defglobal myvar \"foo\")<br>","(defglobal myarr [ (quote myvar) ])<br>","(deref my_array.0) => \"my_var\"<br>","(deref my_array) => [ \"=:my_var\" ]<br>","<br>In the last example, the input to deref isn't a string and so it returns the value as is.  See also desym_ref."],"tags":["symbol","reference","syntax","dereference","desym","desym_ref"],"usage":["symbol:string"],"requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("when",async function(...args) {
    let condition;
    let mbody;
    condition=(args && args["0"]);
    mbody=await (await Environment.get_global("slice"))(args,1);
    return ["=:if",condition,["=:do",].concat(mbody)]
},{ "eval_when":{ "compile_time":true
},"name":"when","macro":true,"fn_args":"(condition \"&\" mbody)","description":["=:+","Similar to if, but the body forms are evaluated in an implicit progn, if the condition form or expression is true. ","The function when will return the last form value.  There is no evaluation of the body if the conditional expression ","is false."],"usage":["condition:*","body:*"],"tags":["if","condition","logic","true","progn","conditional"],"requires":["slice"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("if_compile_time_defined",async function(quoted_symbol,exists_form,not_exists_form) {
    if (check_true (await (await Environment.get_global("describe"))(quoted_symbol))){
        return exists_form
    } else {
        return (not_exists_form|| [])
    }
},{ "eval_when":{ "compile_time":true
},"name":"if_compile_time_defined","macro":true,"fn_args":"(quoted_symbol exists_form not_exists_form)","description":"If the provided quoted symbol is a defined symbol at compilation time, the exists_form will be compiled, otherwise the not_exists_form will be compiled.","tags":["compile","defined","global","symbol","reference"],"usage":["quoted_symbol:string","exists_form:*","not_exists_form:*"],"requires":["describe"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("defexternal",async function(name,value) {
    return ["=:let",[["=:symname",["=:desym",].concat(name)]],["=:do",["=:set_prop","=:globalThis","=:symname",value],["=:prop","=:globalThis","=:symname"]]]
},{ "eval_when":{ "compile_time":true
},"name":"defexternal","macro":true,"fn_args":"(name value)","description":"Given a name and a value, defexternal will add a globalThis property with the symbol name thereby creating a global variable in the javascript environment.","tags":["global","javascript","globalThis","value"],"usage":["name:string","value:*"],"requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("defun",async function(name,args,body,meta) {
    let fn_name;
    let fn_args;
    let fn_body;
    let source_details;
    fn_name=name;
    fn_args=args;
    fn_body=body;
    source_details=await (await Environment.get_global("add"))({
        name:await (async function(){
             return await (await Environment.get_global("unquotify"))(name) 
        })(),fn_args:await (await Environment.get_global("as_lisp"))(fn_args)
    },await (async function(){
        if (check_true (meta)){
            return meta
        } else {
            return new Object()
        }
    })());
    return ["=:do",["=:defglobal",fn_name,["=:fn",fn_args,fn_body],["=:quote",source_details]]]
},{ "eval_when":{ "compile_time":true
},"name":"defun","macro":true,"fn_args":"(name args body meta)","requires":["add","unquotify","as_lisp"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("decomp_symbol",async function(quoted_sym) {
    let comps;
    comps=(quoted_sym).split("/");
    if (check_true (((comps && comps.length)===1))){
        return await (async function(){
            let __array_op_rval__11=(comps && comps["0"]);
             if (__array_op_rval__11 instanceof Function){
                return await __array_op_rval__11(await (await Environment.get_global("first"))(await (async function(){
                     return await (await Environment.get_global("each"))(await (async function(){
                         return await (await Environment.get_global("describe"))(quoted_sym,true) 
                    })(),"namespace") 
                })()),false) 
            } else {
                return [__array_op_rval__11,await (await Environment.get_global("first"))(await (async function(){
                     return await (await Environment.get_global("each"))(await (async function(){
                         return await (await Environment.get_global("describe"))(quoted_sym,true) 
                    })(),"namespace") 
                })()),false]
            }
        })()
    } else {
        return await (async function(){
            let __array_op_rval__12=(comps && comps["1"]);
             if (__array_op_rval__12 instanceof Function){
                return await __array_op_rval__12((comps && comps["0"]),true) 
            } else {
                return [__array_op_rval__12,(comps && comps["0"]),true]
            }
        })()
    }
},{ "name":"decomp_symbol","fn_args":"(quoted_sym)","requires":["split_by","first","each","describe"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("defun_sync",async function(name,args,body,meta) {
    let fn_name;
    let fn_args;
    let fn_body;
    let source_details;
    fn_name=name;
    fn_args=args;
    fn_body=body;
    source_details=await (await Environment.get_global("add"))({
        name:await (async function(){
             return await (await Environment.get_global("unquotify"))(name) 
        })(),fn_args:await (await Environment.get_global("as_lisp"))(fn_args)
    },await (async function(){
        if (check_true (meta)){
            return meta
        } else {
            return new Object()
        }
    })());
    return ["=:do",["=:defglobal",fn_name,["=:function",fn_args,fn_body],["=:quote",source_details]]]
},{ "eval_when":{ "compile_time":true
},"name":"defun_sync","macro":true,"fn_args":"(name args body meta)","description":["=:+","Creates a top level synchronous function as opposed to the default via defun, which creates an asynchronous top level function.","Doesn't support destructuring bind in the lambda list (args). ","Given a name, an argument list, a body and symbol metadata, will establish a top level synchronous function.  If the name is ","fully qualified, the function will be compiled in the current namespace (and it's lexical environment) and placed in the ","specified namespace."],"usage":["name:string","args:array","body:*","meta:object"],"tags":["define","function","synchronous","toplevel"],"requires":["add","unquotify","as_lisp"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("macroexpand",async function(quoted_form) {
    let macro_name;
    let working_env;
    let meta;
    let macro_func;
    macro_name=await (async function() { try {
        return await (quoted_form && quoted_form["0"])["substr"].call((quoted_form && quoted_form["0"]),2)
    } catch (__exception__13) {
        if (__exception__13 instanceof Error) {
            let e=__exception__13;
            {
                throw new Error("macroexpand: unable to determine macro: is the form quoted?");
                
            }
        }
    }
})();
working_env=await Environment["get_namespace_handle"].call(Environment,await (await Environment.get_global("current_namespace"))());
meta=await (await Environment.get_global("first"))(await (await Environment.get_global("meta_for_symbol"))(macro_name,true));
macro_func=await working_env["get_global"].call(working_env,((meta && meta["namespace"])+ "/"+ macro_name));
if (check_true ((macro_func instanceof Function&& await (await Environment.get_global("resolve_path"))(["eval_when","compile_time"],meta)))){
    {
        return await (async function(){
            let __apply_args__14=await (async function(){
                 return await quoted_form["slice"].call(quoted_form,1) 
            })();
            return ( macro_func).apply(this,__apply_args__14)
        })()
    }
} else {
    return quoted_form
}
},{ "name":"macroexpand","fn_args":"(quoted_form)","description":"Given a quoted form, will perform the macro expansion and return the expanded form.","usage":["quoted_form:*"],"tags":["macro","expansion","debug","compile","compilation"],"requires":["current_namespace","first","meta_for_symbol","is_function?","resolve_path"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("macroexpand_all",async function(quoted_form) {
    return await (await Environment.get_global("detokenize"))(await (async function(){
         return await (await Environment.get_global("tokenize_lisp"))(quoted_form) 
    })())
},{ "name":"macroexpand_all","fn_args":"(quoted_form)","description":["=:+","Given a quoted form, will recursively expand all macros in the quoted form ","and return the expanded form structure"],"usage":["quoted_form:*"],"tags":["macro","expansion","debug","compile","compilation"],"requires":["detokenize","tokenize_lisp"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("check_type",async function(thing,type_name,error_string) {
    if (check_true (error_string)){
        return ["=:if",["=:not",["=:==",["=:sub_type",thing],type_name]],["=:throw","=:TypeError",error_string]]
    } else {
        return ["=:if",["=:not",["=:==",["=:sub_type",thing],type_name]],["=:throw","=:TypeError",["=:+","invalid type: required ",type_name," but got ",["=:sub_type",thing]]]]
    }
},{ "eval_when":{ "compile_time":true
},"name":"check_type","macro":true,"fn_args":"(thing type_name error_string)","description":"If the type of thing (ascertained by sub_type) are not of the type type_name, will throw a TypeError with the optional error_string as the error message.","usage":["thing:*","type_name:string","error_string:string"],"tags":["types","validation","type","assert"],"requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await (async function(){
    return  Environment.set_global("get_object_path",function(refname) {
        if (check_true ((( refname["indexOf"].call(refname,".")>-1)|| ( refname["indexOf"].call(refname,"[")>-1)))){
            {
                let chars;
                let comps;
                let mode;
                let name_acc;
                chars=(refname).split("");
                comps=[];
                mode=0;
                name_acc=[];
                 ( function() {
                    let __for_body__18=function(c) {
                        return   (function(){
                            if (check_true (((c===".")&& (mode===0)))) {
                                {
                                    if (check_true (((name_acc && name_acc.length)>0))){
                                        {
                                            (comps).push((name_acc).join(""))
                                        }
                                    };
                                    return name_acc=[]
                                }
                            } else if (check_true (((mode===0)&& (c==="[")))) {
                                {
                                    mode=1;
                                    if (check_true (((name_acc && name_acc.length)>0))){
                                        {
                                            (comps).push((name_acc).join(""))
                                        }
                                    };
                                    return name_acc=[]
                                }
                            } else if (check_true (((mode===1)&& (c==="]")))) {
                                {
                                    mode=0;
                                    (comps).push((name_acc).join(""));
                                    return name_acc=[]
                                }
                            } else {
                                return (name_acc).push(c)
                            }
                        } )()
                    };
                    let __array__19=[],__elements__17=chars;
                    let __BREAK__FLAG__=false;
                    for(let __iter__16 in __elements__17) {
                        __array__19.push( __for_body__18(__elements__17[__iter__16]));
                        if(__BREAK__FLAG__) {
                             __array__19.pop();
                            break;
                            
                        }
                    }return __array__19;
                     
                })();
                if (check_true (((name_acc && name_acc.length)>0))){
                    (comps).push((name_acc).join(""))
                };
                return comps
            }
        } else {
            return  ( function(){
                let __array_op_rval__20=refname;
                 if (__array_op_rval__20 instanceof Function){
                    return  __array_op_rval__20() 
                } else {
                    return [__array_op_rval__20]
                }
            })()
        }
    },{ "name":"get_object_path","fn_args":"(refname)","description":"get_object_path is used by the compiler to take a string based notation in the form of p[a][b] or p.a.b and returns an array of the components.","tags":["compiler"],"usage":["refname:string"],"requires":["split_by","push","join"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await Environment.set_global("do_deferred_splice",async function(tree) {
    let rval;
    let idx;
    let tval;
    let deferred_operator;
    rval=null;
    idx=0;
    tval=null;
    deferred_operator=(["=","$","&","!"]).join("");
    return await async function(){
        if (check_true ((tree instanceof Array))) {
            {
                rval=[];
                await (async function(){
                     let __test_condition__21=async function() {
                        return (idx<(tree && tree.length))
                    };
                    let __body_ref__22=async function() {
                        tval=tree[idx];
                        if (check_true ((tval===deferred_operator))){
                            {
                                idx+=1;
                                tval=tree[idx];
                                rval=await rval["concat"].call(rval,await (async function(){
                                     return await do_deferred_splice(tval) 
                                })())
                            }
                        } else {
                            (rval).push(await (async function(){
                                 return await do_deferred_splice(tval) 
                            })())
                        };
                        return idx+=1
                    };
                    let __BREAK__FLAG__=false;
                    while(await __test_condition__21()) {
                         await __body_ref__22();
                         if(__BREAK__FLAG__) {
                             break;
                            
                        }
                    } ;
                    
                })();
                return rval
            }
        } else if (check_true ((tree instanceof Object))) {
            {
                rval=new Object();
                await (async function() {
                    let __for_body__25=async function(pset) {
                        return await async function(){
                            rval[(pset && pset["0"])]=await (async function(){
                                 return await do_deferred_splice((pset && pset["1"])) 
                            })();
                            return rval;
                            
                        }()
                    };
                    let __array__26=[],__elements__24=await (await Environment.get_global("pairs"))(tree);
                    let __BREAK__FLAG__=false;
                    for(let __iter__23 in __elements__24) {
                        __array__26.push(await __for_body__25(__elements__24[__iter__23]));
                        if(__BREAK__FLAG__) {
                             __array__26.pop();
                            break;
                            
                        }
                    }return __array__26;
                     
                })();
                return rval
            }
        } else {
            return tree
        }
    } ()
},{ "name":"do_deferred_splice","fn_args":"(tree)","description":"Internally used by the compiler to facilitate splice operations on arrays.","usage":["tree:*"],"tags":["compiler","build"],"requires":["join","is_array?","push","is_object?","pairs"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("define",async function(...args) {
    let defs;
    defs=await (await Environment.get_global("slice"))(args,0);
    {
        let acc;
        let symname;
        acc=await (async function(){
             return ["=:progl"] 
        })();
        symname=null;
        await (async function() {
            let __for_body__30=async function(defset) {
                (acc).push(await (async function(){
                     return ["=:defvar",(defset && defset["0"]),(defset && defset["1"])] 
                })());
                symname=(defset && defset["0"]);
                (acc).push(await (async function(){
                     return ["=:set_prop",await (async function(){
                         return "=:Environment.global_ctx.scope" 
                    })(),(""+ await (await Environment.get_global("as_lisp"))(symname)),symname] 
                })());
                if (check_true (((defset && defset["2"]) instanceof Object))){
                    {
                        return (acc).push(await (async function(){
                             return [["=:set_prop",await (async function(){
                                 return "=:Environment.definitions" 
                            })(),(""+ await (await Environment.get_global("as_lisp"))(symname)+ ""),(defset && defset["2"])]] 
                        })())
                    }
                }
            };
            let __array__31=[],__elements__29=defs;
            let __BREAK__FLAG__=false;
            for(let __iter__28 in __elements__29) {
                __array__31.push(await __for_body__30(__elements__29[__iter__28]));
                if(__BREAK__FLAG__) {
                     __array__31.pop();
                    break;
                    
                }
            }return __array__31;
             
        })();
        return acc
    }
},{ "eval_when":{ "compile_time":true
},"name":"define","macro":true,"fn_args":"[\"&\" defs]","usage":["declaration:array","declaration:array*"],"description":["=:+","Given 1 or more declarations in the form of (symbol value ?metadata), ","creates a symbol in global scope referencing the provided value.  If a ","metadata object is provided, this is stored as a the symbol's metadata."],"tags":["symbol","reference","definition","metadata","environment"],"requires":["slice","push","as_lisp","is_object?"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("defbinding",async function(...args) {
    args=await (await Environment.get_global("slice"))(args,0);
    {
        let binding;
        let acc;
        binding=null;
        acc=await (async function(){
             return ["=:list"] 
        })();
        await (async function() {
            let __for_body__34=async function(bind_set) {
                return await async function(){
                    if (check_true (((bind_set instanceof Array)&& (((bind_set && bind_set.length)===2)|| ((bind_set && bind_set.length)===3))&& ((bind_set && bind_set["1"]) instanceof Array)&& ((bind_set && bind_set["1"] && bind_set["1"]["length"])===2)))) {
                        {
                            binding=await (async function(){
                                 return ["=:quotel",await (async function(){
                                     return ["=:bind",(bind_set && bind_set["1"] && bind_set["1"]["0"]),(bind_set && bind_set["1"] && bind_set["1"]["1"])] 
                                })()] 
                            })();
                            return (acc).push(await (async function(){
                                 return ["=:defglobal",((await Environment.get_global("*namespace*"))+ "/"+ await (async function(){
                                    let mval;
                                    mval=(bind_set && bind_set["0"]);
                                    if (check_true (((mval instanceof String || typeof mval==='string')&& await (await Environment.get_global("starts_with?"))("=:",mval)))){
                                        return await mval["substr"].call(mval,2)
                                    } else {
                                        return mval
                                    }
                                })()),await (async function(){
                                     return ["=:bind",(bind_set && bind_set["1"] && bind_set["1"]["0"]),(bind_set && bind_set["1"] && bind_set["1"]["1"])] 
                                })(),await (async function(){
                                    if (check_true (((bind_set && bind_set["2"]) instanceof Object))){
                                        return await (await Environment.get_global("add"))(new Object(),(bind_set && bind_set["2"]),{
                                            initializer:binding
                                        })
                                    } else {
                                        return {
                                            initializer:binding
                                        }
                                    }
                                })()] 
                            })())
                        }
                    } else {
                        throw new SyntaxError("defbinding received malform arguments");
                        
                    }
                } ()
            };
            let __array__35=[],__elements__33=args;
            let __BREAK__FLAG__=false;
            for(let __iter__32 in __elements__33) {
                __array__35.push(await __for_body__34(__elements__33[__iter__32]));
                if(__BREAK__FLAG__) {
                     __array__35.pop();
                    break;
                    
                }
            }return __array__35;
             
        })();
        return acc
    }
},{ "eval_when":{ "compile_time":true
},"name":"defbinding","macro":true,"fn_args":"[\"&\" args]","description":["=:+","Defines a global binding to a potentially native function.  This macro ","facilitates the housekeeping by keeping track of the source form ","used (and stored in the environment) so that the save environment ","facility can capture the source bindings and recreate it in the initializer ","function on rehydration.<br>","The macro can take an arbitrary amount of binding arguments, with the form: ","(symbol_name (fn_to_bind_to this))"],"usage":["binding_set0:array","binding_setN:array"],"tags":["toplevel","global","bind","environment","initialize"],"requires":["slice","is_array?","push","*namespace*","is_string?","starts_with?","is_object?","add"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("define_env",async function(...args) {
    let defs;
    defs=await (await Environment.get_global("slice"))(args,0);
    {
        let acc;
        let symname;
        acc=await (async function(){
             return ["=:progl"] 
        })();
        symname=null;
        await (async function() {
            let __for_body__38=async function(defset) {
                (acc).push(await (async function(){
                     return ["=:defvar",(defset && defset["0"]),(defset && defset["1"])] 
                })());
                symname=(defset && defset["0"]);
                (acc).push(await (async function(){
                     return ["=:set_prop",await (async function(){
                         return "=:Environment.global_ctx.scope" 
                    })(),(""+ await (await Environment.get_global("as_lisp"))(symname)),symname] 
                })());
                if (check_true (((defset && defset["2"]) instanceof Object))){
                    return (acc).push(await (async function(){
                         return [["=:set_prop",await (async function(){
                             return "=:Environment.definitions" 
                        })(),(""+ await (await Environment.get_global("as_lisp"))(symname)+ ""),await (await Environment.get_global("add"))({
                            core_lang:true
                        },(defset && defset["2"]))]] 
                    })())
                } else {
                    return (acc).push(await (async function(){
                         return [["=:set_prop",await (async function(){
                             return "=:Environment.definitions" 
                        })(),(""+ await (await Environment.get_global("as_lisp"))(symname)+ ""),{
                            core_lang:true
                        }]] 
                    })())
                }
            };
            let __array__39=[],__elements__37=defs;
            let __BREAK__FLAG__=false;
            for(let __iter__36 in __elements__37) {
                __array__39.push(await __for_body__38(__elements__37[__iter__36]));
                if(__BREAK__FLAG__) {
                     __array__39.pop();
                    break;
                    
                }
            }return __array__39;
             
        })();
        return acc
    }
},{ "eval_when":{ "compile_time":true
},"name":"define_env","macro":true,"fn_args":"[\"&\" defs]","description":["=:+","define_env is a macro used to provide a dual definition on the top level: it creates a symbol via defvar in the ","constructed scope as well as placing a reference to the defined symbol in the scope object."],"usage":["definitions:array"],"tags":["environment","core","build"],"requires":["slice","push","as_lisp","is_object?","add"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("type",async function(x) {
    return await async function(){
        if (check_true ((null===x))) {
            return "null"
        } else if (check_true ((undefined===x))) {
            return "undefined"
        } else if (check_true ((x instanceof Array))) {
            return "array"
        } else {
            return typeof x
        }
    } ()
},{ "name":"type","fn_args":"(x)","usage":["value:*"],"description":"returns the type of value that has been passed.  Deprecated, and the sub_type function should be used.","tags":["types","value","what"],"requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await (async function(){
    return  Environment.set_global("destructure_list",function(elems) {
        let idx;
        let acc;
        let passed_rest;
        let structure;
        let follow_tree;
        idx=0;
        acc=[];
        passed_rest=0;
        structure=elems;
        follow_tree=async function(elems,_path_prefix) {
            return   (function(){
                if (check_true ((passed_rest>0))) {
                    {
                        if (check_true ((passed_rest===1))){
                            (acc).push(_path_prefix)
                        };
                        return passed_rest+=1
                    }
                } else if (check_true ((elems instanceof Array))) {
                    return  ( Environment.get_global("map"))(async function(elem,idx) {
                        return  follow_tree(elem, ( Environment.get_global("add"))(_path_prefix,idx))
                    },elems)
                } else if (check_true ((elems instanceof Object))) {
                    return  ( function() {
                        let __for_body__42=function(pset) {
                            return  follow_tree((pset && pset["1"]), ( Environment.get_global("add"))(_path_prefix,(pset && pset["0"])))
                        };
                        let __array__43=[],__elements__41= ( Environment.get_global("pairs"))(elems);
                        let __BREAK__FLAG__=false;
                        for(let __iter__40 in __elements__41) {
                            __array__43.push( __for_body__42(__elements__41[__iter__40]));
                            if(__BREAK__FLAG__) {
                                 __array__43.pop();
                                break;
                                
                            }
                        }return __array__43;
                         
                    })()
                } else if (check_true (((elems instanceof String || typeof elems==='string')&& ("&"===elems)))) {
                    {
                        passed_rest+=1;
                        return (acc).push(["*",_path_prefix])
                    }
                } else {
                    return (acc).push(_path_prefix)
                }
            } )()
        };
         follow_tree(structure,[]);
        return acc
    },{ "name":"destructure_list","fn_args":"(elems)","description":"Destructure list takes a nested array and returns the paths of each element in the provided array.","usage":["elems:array"],"tags":["destructuring","path","array","nested","tree"],"requires":["push","is_array?","map","add","is_object?","pairs","is_string?"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await Environment.set_global("destructuring_bind",async function(...args) {
    let bind_vars;
    let expression;
    let forms;
    bind_vars=(args && args["0"]);
    expression=(args && args["1"]);
    forms=await (await Environment.get_global("slice"))(args,2);
    {
        let binding_vars;
        let preamble;
        let allocations;
        let passed_rest;
        let expr_result_var;
        let paths;
        let bound_expression;
        let acc;
        binding_vars=bind_vars;
        preamble=[];
        allocations=[];
        passed_rest=false;
        expr_result_var=("=:"+ "_expr_"+ await (await Environment.get_global("random_int"))(100000));
        paths=await (await Environment.get_global("destructure_list"))(binding_vars);
        bound_expression=await (async function(){
            if (check_true (((expression instanceof Array)&& await (await Environment.get_global("starts_with?"))("=:",(expression && expression["0"]))))){
                {
                    (allocations).push(await (async function(){
                         return [expr_result_var,expression] 
                    })());
                    return expr_result_var
                }
            } else {
                return expression
            }
        })();
        acc=await (async function(){
             return ["=:let"] 
        })();
        await (await Environment.get_global("assert"))(((bind_vars instanceof Array)&& await (async function(){
             return await (await Environment.get_global("is_value?"))(expression) 
        })()&& await (async function(){
             return await (await Environment.get_global("is_value?"))(forms) 
        })()),"destructuring_bind: requires 3 arguments");
        await (async function() {
            let __for_body__46=async function(idx) {
                if (check_true (("*"===await (await Environment.get_global("first"))(paths[idx])))){
                    {
                        (allocations).push(await (async function(){
                             return [await (await Environment.get_global("resolve_path"))(paths[await (await Environment.get_global("add"))(idx,1)],binding_vars),await (async function(){
                                 return await async function(){
                                    if (check_true ((bound_expression instanceof Object))) {
                                        return await (await Environment.get_global("slice"))(bound_expression,idx)
                                    } else {
                                        return ["=:slice",expression,await (await Environment.get_global("first"))(await (await Environment.get_global("second"))(paths[idx]))]
                                    }
                                } () 
                            })()] 
                        })());
                        return __BREAK__FLAG__=true;
                        return
                    }
                } else {
                    {
                        return (allocations).push(await (async function(){
                             return [await (await Environment.get_global("resolve_path"))(paths[idx],binding_vars),await (async function(){
                                 return await async function(){
                                    if (check_true ((bound_expression instanceof Object))) {
                                        return await (await Environment.get_global("resolve_path"))(paths[idx],bound_expression)
                                    } else {
                                        return (await (await Environment.get_global("conj"))(await (async function(){
                                            let __array_op_rval__48=bound_expression;
                                             if (__array_op_rval__48 instanceof Function){
                                                return await __array_op_rval__48() 
                                            } else {
                                                return [__array_op_rval__48]
                                            }
                                        })(),paths[idx])).join(".")
                                    }
                                } () 
                            })()] 
                        })())
                    }
                }
            };
            let __array__47=[],__elements__45=await (await Environment.get_global("range"))(await (await Environment.get_global("length"))(paths));
            let __BREAK__FLAG__=false;
            for(let __iter__44 in __elements__45) {
                __array__47.push(await __for_body__46(__elements__45[__iter__44]));
                if(__BREAK__FLAG__) {
                     __array__47.pop();
                    break;
                    
                }
            }return __array__47;
             
        })();
        (acc).push(allocations);
        acc=await (await Environment.get_global("conj"))(acc,forms);
        return acc
    }
},{ "eval_when":{ "compile_time":true
},"name":"destructuring_bind","macro":true,"fn_args":"(bind_vars expression \"&\" forms)","description":["=:+","The macro destructuring_bind binds the variable symbols specified in bind_vars to the corresponding ","values in the tree structure resulting from the evaluation of the provided expression.  The bound ","variables are then available within the provided forms, which are then evaluated.  Note that ","destructuring_bind only supports destructuring arrays. Destructuring objects is not supported."],"usage":["bind_vars:array","expression:array","forms:*"],"tags":["destructure","array","list","bind","variables","allocation","symbols"],"requires":["slice","random_int","destructure_list","is_array?","starts_with?","push","assert","is_value?","first","resolve_path","add","is_object?","second","join","conj","range","length"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await (async function(){
    return  Environment.set_global("split_by_recurse",function(token,container) {
        return   (function(){
            if (check_true ((container instanceof String || typeof container==='string'))) {
                return (container).split(token)
            } else if (check_true ((container instanceof Array))) {
                return  ( Environment.get_global("map"))(async function(elem) {
                    return  ( Environment.get_global("split_by_recurse"))(token,elem)
                },container)
            }
        } )()
    },{ "name":"split_by_recurse","fn_args":"(token container)","usage":["token:string","container:string|array"],"description":["=:+","Like split_by, splits the provided container at ","each token, returning an array of the split ","items.  If the container is an array, the function ","will recursively split the strings in the array ","and return an array containing the split values ","of that array.  The final returned array may contain ","strings and arrays."],"tags":["split","nested","recursion","array","string"],"requires":["is_string?","split_by","is_array?","map","split_by_recurse"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await Environment.set_global("defmacro",async function(name,lambda_list,...forms) {
    let macro_name;
    let macro_args;
    let macro_body;
    let final_form;
    let macro_meta;
    let complex_lambda_list;
    let source_details;
    macro_name=name;
    macro_args=lambda_list;
    macro_body=forms;
    final_form=await (await Environment.get_global("last"))(forms);
    macro_meta=await (async function(){
        if (check_true (((final_form instanceof Object)&& await (await Environment.get_global("not"))(await (await Environment.get_global("blank?"))((final_form && final_form["description"])))&& await (await Environment.get_global("not"))(await (await Environment.get_global("blank?"))((final_form && final_form["usage"])))))){
            return (forms).pop()
        }
    })();
    complex_lambda_list=await (async function(){
         return await (await Environment.get_global("or_args"))(await (async function() {
            let __for_body__51=async function(elem) {
                return (await (await Environment.get_global("length"))(await (await Environment.get_global("flatten"))(await (await Environment.get_global("destructure_list"))(elem)))>0)
            };
            let __array__52=[],__elements__50=lambda_list;
            let __BREAK__FLAG__=false;
            for(let __iter__49 in __elements__50) {
                __array__52.push(await __for_body__51(__elements__50[__iter__49]));
                if(__BREAK__FLAG__) {
                     __array__52.pop();
                    break;
                    
                }
            }return __array__52;
             
        })()) 
    })();
    source_details=await (await Environment.get_global("add"))({
        eval_when:{
            compile_time:true
        },name:await (async function(){
            if (check_true (await (await Environment.get_global("starts_with?"))("=:",name))){
                return await name["substr"].call(name,2)
            } else {
                return name
            }
        })(),macro:true,fn_args:await (await Environment.get_global("as_lisp"))(macro_args)
    },await (async function(){
        if (check_true (macro_meta)){
            return macro_meta
        } else {
            return new Object()
        }
    })());
    if (check_true (complex_lambda_list)){
        return ["=:defglobal",macro_name,["=:fn",["&","=:args"],["=:destructuring_bind",macro_args,"=:args",].concat(macro_body)],["=:quote",source_details]]
    } else {
        return ["=:defglobal",macro_name,["=:fn",macro_args,].concat(macro_body),["=:quote",source_details]]
    }
},{
    description:("Defines the provided name as a compile time macro function in the "+ "current namespace environment. The parameters in the lambda list are "+ "destructured and bound to the provided names which are then available in the "+ "macro function.  The forms are used as the basis for the function with the "+ "final form expected to return a quoted form which is then as the expansion of "+ "the macro by the compiler. The body of forms are explicitly placed in a progn "+ "block.  Like with functions and defglobal, if the final argument to defmacro is "+ "an object, this will be used for the metadata associated with with the bound "+ "symbol provided as name.<br><br>#### Example <br>```(defmacro unless (condition "+ "`& forms)\n  `(if (not ,#condition)\n       (progn \n         ,@forms))) "+ "```<br><br><br>In the above example the macro unless is defined.  Passed "+ "arguments must be explicitly unquoted or an error may be thrown because the "+ "arguments condition and forms *may* not be defined in the final compilation "+ "environment.  Note that if the symbols used by the macro are defined in the "+ "final compilation scope, that this may cause unexpected behavior due to the "+ "form being placed into the compilation tree and then acting on those symbols. "+ "<br>Be aware that if a macro being defined returns an object (not an array) you "+ "should explicitly add the final metadata form to explictly ensure appropriate "+ "interpretation of the argument positions.<br>Since a macro is a function that "+ "is defined to operate at compile time vs. run time, the rules of declare apply. "+ " Declaration operate normally and should be the first form in the block, or if "+ "using let, the first form after the allocation block of the let. "),usage:["name:symbol","lambda_list:array","forms:array","meta?:object"],eval_when:{
        compile_time:true
    },tags:["macro","define","compile","function"],requires:["last","is_object?","not","blank?","pop","or_args","length","flatten","destructure_list","add","starts_with?","as_lisp"],requires:["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],source_name:"core.lisp"
});
await Environment.set_global("defun",async function(name,lambda_list,body,meta) {
    let fn_name;
    let fn_args;
    let fn_body;
    let fn_meta;
    let complex_lambda_list;
    let symbol_details;
    let source_details;
    fn_name=name;
    fn_args=lambda_list;
    fn_body=body;
    fn_meta=meta;
    complex_lambda_list=await (async function(){
         return await (await Environment.get_global("or_args"))(await (async function() {
            let __for_body__55=async function(elem) {
                return (await (await Environment.get_global("length"))(await (await Environment.get_global("flatten"))(await (await Environment.get_global("destructure_list"))(elem)))>0)
            };
            let __array__56=[],__elements__54=lambda_list;
            let __BREAK__FLAG__=false;
            for(let __iter__53 in __elements__54) {
                __array__56.push(await __for_body__55(__elements__54[__iter__53]));
                if(__BREAK__FLAG__) {
                     __array__56.pop();
                    break;
                    
                }
            }return __array__56;
             
        })()) 
    })();
    symbol_details=await (async function(){
         return await (await Environment.get_global("decomp_symbol"))(await (async function(){
             return await (await Environment.get_global("unquotify"))(name) 
        })()) 
    })();
    source_details=await (await Environment.get_global("add"))({
        name:(symbol_details && symbol_details["0"]),fn_args:await (await Environment.get_global("as_lisp"))(fn_args)
    },await (async function(){
        if (check_true (fn_meta)){
            {
                if (check_true ((fn_meta && fn_meta["description"]))){
                    await async function(){
                        fn_meta["description"]=(fn_meta && fn_meta["description"]);
                        return fn_meta;
                        
                    }()
                };
                return fn_meta
            }
        } else {
            return new Object()
        }
    })());
    if (check_true (complex_lambda_list)){
        return ["=:defglobal",fn_name,["=:fn",["&","=:args"],["=:destructuring_bind",fn_args,"=:args",fn_body]],["=:quote",source_details]]
    } else {
        return ["=:defglobal",fn_name,["=:fn",fn_args,fn_body],["=:quote",source_details]]
    }
},{ "eval_when":{ "compile_time":true
},"name":"defun","macro":true,"fn_args":"(name lambda_list body meta)","description":["=:+","Defines a top level function in the current environment.  Given a name, lambda_list,","body, and a meta data description, builds, compiles and installs the function in the","environment under the provided name.  The body isn't an explicit progn, and must be","within a block structure, such as progn, let or do."],"usage":["name:string:required","lambda_list:array:required","body:array:required","meta:object"],"tags":["function","lambda","define","environment"],"requires":["or_args","length","flatten","destructure_list","decomp_symbol","unquotify","add","as_lisp"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("defun_sync_ds",async function(name,lambda_list,body,meta) {
    let fn_name;
    let fn_args;
    let fn_body;
    let fn_meta;
    let complex_lambda_list;
    let symbol_details;
    let source_details;
    fn_name=name;
    fn_args=lambda_list;
    fn_body=body;
    fn_meta=meta;
    complex_lambda_list=await (async function(){
         return await (await Environment.get_global("or_args"))(await (async function() {
            let __for_body__60=async function(elem) {
                return (await (await Environment.get_global("length"))(await (await Environment.get_global("flatten"))(await (await Environment.get_global("destructure_list"))(elem)))>0)
            };
            let __array__61=[],__elements__59=lambda_list;
            let __BREAK__FLAG__=false;
            for(let __iter__58 in __elements__59) {
                __array__61.push(await __for_body__60(__elements__59[__iter__58]));
                if(__BREAK__FLAG__) {
                     __array__61.pop();
                    break;
                    
                }
            }return __array__61;
             
        })()) 
    })();
    symbol_details=await (async function(){
         return await (await Environment.get_global("decomp_symbol"))(await (async function(){
             return await (await Environment.get_global("unquotify"))(name) 
        })()) 
    })();
    source_details=await (await Environment.get_global("add"))({
        name:(symbol_details && symbol_details["0"]),fn_args:await (await Environment.get_global("as_lisp"))(fn_args)
    },await (async function(){
        if (check_true (fn_meta)){
            {
                if (check_true ((fn_meta && fn_meta["description"]))){
                    await async function(){
                        fn_meta["description"]=(fn_meta && fn_meta["description"]);
                        return fn_meta;
                        
                    }()
                };
                return fn_meta
            }
        } else {
            return new Object()
        }
    })());
    if (check_true (complex_lambda_list)){
        return ["=:defglobal",fn_name,["=:function",["&","=:args"],["=:destructuring_bind",fn_args,"=:args",fn_body]],["=:quote",source_details]]
    } else {
        return ["=:defglobal",fn_name,["=:function",fn_args,fn_body],["=:quote",source_details]]
    }
},{ "eval_when":{ "compile_time":true
},"name":"defun_sync_ds","macro":true,"fn_args":"(name lambda_list body meta)","description":["=:+","Defines a top level function in the current environment.  Given a name, lambda_list,","body, and a meta data description, builds, compiles and installs the function in the","environment under the provided name.  The body isn't an explicit progn, and must be","within a block structure, such as progn, let or do."],"usage":["name:string:required","lambda_list:array:required","body:array:required","meta:object"],"tags":["function","lambda","define","environment"],"requires":["or_args","length","flatten","destructure_list","decomp_symbol","unquotify","add","as_lisp"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("no_await",async function(form) {
    return ["=:progn",["=:defvar","=:__SYNCF__",true],form]
},{ "eval_when":{ "compile_time":true
},"name":"no_await","macro":true,"fn_args":"(form)","description":["=:+","For the provided form in an asynchronous context, forces the compiler flag ","to treat the form as synchronous, thus avoiding an await call.  The return ","value may be impacted and result in a promise being returned ","as opposed to a resolved promise value."],"usage":["no_await:array"],"tags":["compiler","synchronous","await","promise"],"requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("reduce",async function(...args) {
    let elem;
    let item_list;
    let form;
    elem=(args && args["0"] && args["0"]["0"]);
    item_list=(args && args["0"] && args["0"]["1"]);
    form=(args && args["1"]);
    return ["=:let",[["=:__collector",[]],["=:__result","=:nil"],["=:__action",["=:fn",[].concat(elem),form]]],["=:declare",["=:function","=:__action"]],["=:for_each",["=:__item",item_list],["=:do",["=:=","=:__result",["=:__action","=:__item"]],["=:if","=:__result",["=:push","=:__collector","=:__result"]]]],"=:__collector"]
},{ "eval_when":{ "compile_time":true
},"name":"reduce","macro":true,"fn_args":"[(elem item_list) form]","description":["=:+","Provided a first argument as a list which contains a binding variable name and a list, ","returns a list of all non-null return values that result from the evaluation of the second list."],"usage":["allocator:array","forms:*"],"tags":["filter","remove","select","list","array"],"requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("reduce_sync",async function(...args) {
    let elem;
    let item_list;
    let form;
    elem=(args && args["0"] && args["0"]["0"]);
    item_list=(args && args["0"] && args["0"]["1"]);
    form=(args && args["1"]);
    return ["=:let",[["=:__collector",[]],["=:__result","=:nil"],["=:__action",["=:function",[].concat(elem),form]]],["=:declare",["=:function","=:__action"]],["=:for_each",["=:__item",item_list],["=:do",["=:=","=:__result",["=:__action","=:__item"]],["=:if","=:__result",["=:push","=:__collector","=:__result"]]]],"=:__collector"]
},{ "eval_when":{ "compile_time":true
},"name":"reduce_sync","macro":true,"fn_args":"[(elem item_list) form]","description":"Provided a first argument as a list which contains a binding variable name and a list, returns a list of all non-null return values that result from the evaluation of the second list.","usage":["allocator:array","forms:*"],"tags":["filter","remove","select","list","array"],"requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("is_nil?",async function(value) {
    return (null===value)
},{ "name":"is_nil?","fn_args":"[\"value\"]","description":"for the given value x, returns true if x is exactly equal to nil.","usage":["arg:value"],"tags":["type","condition","subtype","value","what"],"requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("is_regex?",async function(x) {
    return (await (await Environment.get_global("sub_type"))(x)==="RegExp")
},{ "name":"is_regex?","fn_args":"(x)","description":"for the given value x, returns true if x is a Javascript regex object","usage":["arg:value"],"tags":["type","condition","subtype","value","what"],"requires":["sub_type"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("bind_function",(await Environment.get_global("bind")),{
    description:"Reference bind and so has the exact same behavior.  Used for Kina legacy code. See bind description.",requires:["bind"],requires:["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],source_name:"core.lisp"
});
await (async function(){
    return  Environment.set_global("is_error?",function(val) {
        return (val instanceof Error)
    },{ "name":"is_error?","fn_args":"(val)","description":"Returns true if the passed value is a instance of an Error type, otherwise returns false.","usage":["val:*"],"tags":["Error","types","predicate","type","instanceof"],"requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await Environment.set_global("is_reference?",async function(val) {
    return ["=:and",["=:is_string?",val],["=:>",["=:length",val],2],["=:starts_with?",["=:quote","=:"],val]]
},{ "eval_when":{ "compile_time":true
},"name":"is_reference?","macro":true,"fn_args":"(val)","description":["=:+","Returns true if the quoted value is a binding string; in JSON notation this would be a string starting with \"=:\". ","Note that this function doesn't check if the provided value is a defined symbol, but only if it has been ","described in the JSON structure as a bounding string."],"usage":["val:string"],"tags":["reference","JSON","binding","symbol","predicate"],"requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await (async function(){
    return  Environment.set_global("scan_str",function(regex,search_string) {
        let result;
        let last_result;
        let totals;
        let strs;
        result=null;
        last_result=new Object();
        totals=[];
        strs=(""+ search_string);
        if (check_true ( ( Environment.get_global("is_regex?"))(regex))){
            try {
                  (function(){
                    regex["lastIndex"]=0;
                    return regex;
                    
                })();
                 ( function(){
                     let __test_condition__65=function() {
                        result= regex["exec"].call(regex,strs);
                        return ( ( Environment.get_global("not"))(((result && result["index"])===(last_result && last_result["index"])))&& result)
                    };
                    let __body_ref__66=function() {
                        last_result=result;
                        return (totals).push( ( Environment.get_global("to_object"))( ( function() {
                            let __for_body__69=function(v) {
                                return  ( function(){
                                    let __array_op_rval__71=v;
                                     if (__array_op_rval__71 instanceof Function){
                                        return  __array_op_rval__71(result[v]) 
                                    } else {
                                        return [__array_op_rval__71,result[v]]
                                    }
                                })()
                            };
                            let __array__70=[],__elements__68= ( Environment.get_global("keys"))(result);
                            let __BREAK__FLAG__=false;
                            for(let __iter__67 in __elements__68) {
                                __array__70.push( __for_body__69(__elements__68[__iter__67]));
                                if(__BREAK__FLAG__) {
                                     __array__70.pop();
                                    break;
                                    
                                }
                            }return __array__70;
                             
                        })()))
                    };
                    let __BREAK__FLAG__=false;
                    while( __test_condition__65()) {
                          __body_ref__66();
                         if(__BREAK__FLAG__) {
                             break;
                            
                        }
                    } ;
                    
                })()
            } catch (__exception__63) {
                if (__exception__63 instanceof Error) {
                    let e=__exception__63;
                    {
                        console.log((e && e.message))
                    }
                }
            }
        } else {
            throw new Error(new ReferenceError(("scan_str: invalid RegExp provided: "+ regex)));
            
        };
        return totals
    },{ "name":"scan_str","fn_args":"(regex search_string)","description":["=:+","Using a provided regex and a search string, performs a regex ","exec using the provided regex argument on the string argument. ","Returns an array of results or an empty array, with matched ","text, index, and any capture groups."],"usage":["regex:RegExp","text:string"],"tags":["regex","string","match","exec","array"],"requires":["is_regex?","not","push","to_object","keys","log"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await Environment.set_global("remove_prop",async function(obj,key) {
    if (check_true (await (await Environment.get_global("not"))((undefined===obj[key])))){
        {
            {
                let val;
                val=obj[key];
                await (await Environment.get_global("delete_prop"))(obj,key);
                return val
            }
        }
    }
},{ "name":"remove_prop","fn_args":"(obj key)","usage":["obj:object","key:*"],"description":["=:+","If the provided key exists, removes the key from the provided object, ","and returns the removed value if the key exists, otherwise returned undefined."],"tags":["object","key","value","mutate","delete_prop","remove"],"requires":["not","delete_prop"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("object_methods",async function(obj) {
    let properties;
    let current_obj;
    properties=new Set();
    current_obj=obj;
    await (async function(){
         let __body_ref__73=async function() {
            await (await Environment.get_global("map"))(async function(item) {
                return await properties["add"].call(properties,item)
            },await Object.getOwnPropertyNames(current_obj));
            return current_obj=await Object.getPrototypeOf(current_obj)
        };
        let __BREAK__FLAG__=false;
        while(current_obj) { await __body_ref__73();
         if(__BREAK__FLAG__) {
             break;
            
        }
    } ;
    
})();
return await (async function() {
    {
         let __call_target__=await Array.from(await properties["keys"]()), __call_method__="filter";
        return await __call_target__[__call_method__].call(__call_target__,async function(item) {
            return item instanceof Function
        })
    } 
})()
},{ "name":"object_methods","fn_args":"(obj)","description":"Given a instantiated object, get all methods (functions) that the object and it's prototype chain contains.","usage":["obj:object"],"tags":["object","methods","functions","introspection","keys"],"requires":["map","is_function?"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("expand_dot_accessor",async function(val,ctx) {
    let comps;
    let find_in_ctx;
    let reference;
    let idx;
    let val_type;
    comps=(val).split(".");
    find_in_ctx=async function(the_ctx) {
        return await async function(){
            if (check_true (await (async function(){
                let __targ__74=(the_ctx && the_ctx["scope"]);
                if (__targ__74){
                     return(__targ__74)[reference]
                } 
            })())) {
                return await (async function(){
                    let __targ__75=(the_ctx && the_ctx["scope"]);
                    if (__targ__75){
                         return(__targ__75)[reference]
                    } 
                })()
            } else if (check_true ((the_ctx && the_ctx["parent"]))) {
                return await find_in_ctx((the_ctx && the_ctx["parent"]))
            }
        } ()
    };
    reference=(comps).shift();
    idx=0;
    val_type=await find_in_ctx(ctx);
    return await async function(){
        if (check_true ((0===(comps && comps.length)))) {
            return reference
        } else if (check_true (((val_type instanceof Object)&& await (await Environment.get_global("contains?"))((comps && comps["0"]),await (async function(){
             return await (await Environment.get_global("object_methods"))(val_type) 
        })())&& await (await Environment.get_global("not"))(await val_type["propertyIsEnumerable"].call(val_type,(comps && comps["0"])))))) {
            return val
        } else {
            return (await (await Environment.get_global("conj"))(await (async function(){
                let __array_op_rval__76=reference;
                 if (__array_op_rval__76 instanceof Function){
                    return await __array_op_rval__76() 
                } else {
                    return [__array_op_rval__76]
                }
            })(),await (await Environment.get_global("flatten"))(await (async function() {
                let __for_body__79=async function(comp) {
                    idx+=1;
                    if (check_true (((idx===1)&& (reference==="this")))){
                        return [".",comp]
                    } else {
                        if (check_true (await (await Environment.get_global("is_number?"))(comp))){
                            return ["[",comp,"]"]
                        } else {
                            return ["[\"",comp,"\"]"]
                        }
                    }
                };
                let __array__80=[],__elements__78=comps;
                let __BREAK__FLAG__=false;
                for(let __iter__77 in __elements__78) {
                    __array__80.push(await __for_body__79(__elements__78[__iter__77]));
                    if(__BREAK__FLAG__) {
                         __array__80.pop();
                        break;
                        
                    }
                }return __array__80;
                 
            })()))).join("")
        }
    } ()
},{ "name":"expand_dot_accessor","fn_args":"(val ctx)","description":"Used for compilation. Expands dotted notation of a.b.0.1 to a[\"b\"][0][1]","usage":["val:string","ctx:object"],"tags":["compiler","system"],"requires":["split_by","take","is_object?","contains?","object_methods","not","join","conj","flatten","is_number?"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await (async function(){
    return  Environment.set_global("from_mixed_case",function(mixed_case_key) {
        let tokens;
        let acc;
        let ccode;
        tokens= ( function(){
            if (check_true ((mixed_case_key instanceof String || typeof mixed_case_key==='string'))){
                return (mixed_case_key).split("")
            } else {
                throw new TypeError("from_mixed_case: key argument must be a string");
                
            }
        })();
        acc=[];
        ccode=null;
         ( function() {
            let __for_body__83=function(t) {
                ccode= t["charCodeAt"].call(t,0);
                if (check_true (((ccode>=65)&& (ccode<=90)))){
                    {
                        (acc).push("_");
                        return (acc).push((t).toLowerCase())
                    }
                } else {
                    return (acc).push(t)
                }
            };
            let __array__84=[],__elements__82=tokens;
            let __BREAK__FLAG__=false;
            for(let __iter__81 in __elements__82) {
                __array__84.push( __for_body__83(__elements__82[__iter__81]));
                if(__BREAK__FLAG__) {
                     __array__84.pop();
                    break;
                    
                }
            }return __array__84;
             
        })();
        return (acc).join("")
    },{ "name":"from_mixed_case","fn_args":"(mixed_case_key)","description":["=:+","<br><br>Given a mixed case string, will return the standardized key format ","representation of the string.  For example,  the string `myVariable` will be ","returned as `my_variable` with this function.  A TypeError will be thrown if a ","non-string argument is provided. "],"usage":["mixed_case_key:string"],"tags":["key","convert","snake","mixed","case","format"],"requires":["is_string?","split_by","push","lowercase","join"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await (async function(){
    return  Environment.set_global("to_mixed_case",function(snake_case_key) {
        let tokens;
        let acc;
        let upmode;
        tokens= ( function(){
            if (check_true ((snake_case_key instanceof String || typeof snake_case_key==='string'))){
                return (snake_case_key).split("")
            } else {
                throw new TypeError("to_mixed_case: key argument must be a string");
                
            }
        })();
        acc=[];
        upmode=false;
         ( function() {
            let __for_body__87=function(t) {
                return   (function(){
                    if (check_true ((t==="_"))) {
                        return upmode=true
                    } else if (check_true (upmode)) {
                        {
                            (acc).push((t).toUpperCase());
                            return upmode=false
                        }
                    } else {
                        return (acc).push(t)
                    }
                } )()
            };
            let __array__88=[],__elements__86=tokens;
            let __BREAK__FLAG__=false;
            for(let __iter__85 in __elements__86) {
                __array__88.push( __for_body__87(__elements__86[__iter__85]));
                if(__BREAK__FLAG__) {
                     __array__88.pop();
                    break;
                    
                }
            }return __array__88;
             
        })();
        return (acc).join("")
    },{ "name":"to_mixed_case","fn_args":"(snake_case_key)","description":["=:+","<br><br>Given a snake case string, will return a mixed case key format ","representation of the string.  For example,  the string `my_variable` will be ","returned as `myVariable` with this function.  A TypeError will be thrown if a ","non-string argument is provided. "],"usage":["snake_case_key:string"],"tags":["key","convert","snake","mixed","case","format"],"requires":["is_string?","split_by","push","uppercase","join"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await Environment.set_global("new_ctx",async function(ctx) {
    let __new_ctx__89= async function(){
        return {
            scope:new Object(),parent:null
        }
    };
    {
        let new_ctx=await __new_ctx__89();
        ;
        if (check_true (ctx)){
            {
                await async function(){
                    new_ctx["parent"]=ctx;
                    return new_ctx;
                    
                }()
            }
        };
        return new_ctx
    }
},{ "name":"new_ctx","fn_args":"(ctx)","description":"Used for compilation. Given a context structure, provides a utility function for retrieving a context value based on a provided identifier.","usage":["ctx:?object"],"tags":["compiler","system","context","ctx","setf_ctx"],"requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("getf_ctx",async function(ctx,name,_value) {
    if (check_true ((ctx&& (name instanceof String || typeof name==='string')))){
        return await async function(){
            if (check_true (await (await Environment.get_global("not"))((undefined===await (async function(){
                let __targ__91=(ctx && ctx["scope"]);
                if (__targ__91){
                     return(__targ__91)[name]
                } 
            })())))) {
                if (check_true (await (await Environment.get_global("not"))((_value===undefined)))){
                    {
                        await async function(){
                            let __target_obj__92=(ctx && ctx["scope"]);
                            __target_obj__92[name]=_value;
                            return __target_obj__92;
                            
                        }();
                        return _value
                    }
                } else {
                    return await (async function(){
                        let __targ__93=(ctx && ctx["scope"]);
                        if (__targ__93){
                             return(__targ__93)[name]
                        } 
                    })()
                }
            } else if (check_true ((ctx && ctx["parent"]))) {
                return await (await Environment.get_global("getf_ctx"))((ctx && ctx["parent"]),name,_value)
            } else {
                return undefined
            }
        } ()
    } else {
        throw new Error("invalid call to getf_ctx: missing argument/s");
        
    }
},{ "name":"getf_ctx","fn_args":"(ctx name _value)","description":"Used for compilation. Given a context structure, provides a utility function for retrieving a context value based on a provided identifier.","usage":["ctx:object","name:string"],"tags":["compiler","system","context","ctx","new_ctx","setf_ctx"],"requires":["is_string?","not","getf_ctx"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("setf_ctx",async function(ctx,name,value) {
    let found_val;
    found_val=await (async function(){
         return await (await Environment.get_global("getf_ctx"))(ctx,name,value) 
    })();
    if (check_true ((found_val===undefined))){
        await async function(){
            let __target_obj__94=(ctx && ctx["scope"]);
            __target_obj__94[name]=value;
            return __target_obj__94;
            
        }()
    };
    return value
},{ "name":"setf_ctx","fn_args":"(ctx name value)","description":"Used for compilation. Given a context structure, provides a utility function for setting a context place with value.","usage":["ctx:object","name:string","value:*"],"tags":["compiler","system","context","ctx","new_ctx","getf_ctx"],"requires":["getf_ctx"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("set_path",async function(path,obj,value) {
    let fpath;
    let idx;
    let rpath;
    let target_obj;
    fpath=await (async function(){
         return await clone(path) 
    })();
    idx=(fpath).pop();
    rpath=fpath;
    target_obj=null;
    target_obj=await (await Environment.get_global("resolve_path"))(rpath,obj);
    if (check_true (target_obj)){
        {
            return await async function(){
                target_obj[idx]=value;
                return target_obj;
                
            }()
        }
    } else {
        throw new RangeError(("set_path: invalid path: "+ path));
        
    }
},{ "name":"set_path","fn_args":"(path obj value)","description":["=:+","Given a path value as an array, a tree structure, and a value, ","sets the value within the tree at the path value, potentially overriding any existing value at that path.<br><br>","(defglobal foo [ 0 2 [ { `foo: [ 1 4 3 ] `bar: [ 0 1 2 ] } ] 3 ])<br>","(set_path [ 2 0 `bar 1 ] foo 10) => [ 0 10 2 ]<br>","foo => [ 0 2 [ { foo: [ 1 4 3 ] bar: [ 0 10 2 ] } ] 3 ]"],"tags":["resolve_path","make_path","path","set","tree","mutate"],"usage":["path:array","tree:array|object","value:*"],"requires":["pop","resolve_path"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("make_path",async function(target_path,root_obj,value,_pos) {
    let segment;
    let cval;
    let pos;
    target_path=await (async function(){
        if (check_true (_pos)){
            return target_path
        } else {
            return await clone(target_path)
        }
    })();
    segment=(target_path).shift();
    cval=null;
    pos=(_pos|| []);
    (pos).push(segment);
    return await async function(){
        if (check_true (((target_path && target_path.length)===0))) {
            {
                await (await Environment.get_global("set_path"))(pos,root_obj,value);
                return value
            }
        } else if (check_true (cval=await (await Environment.get_global("resolve_path"))(pos,root_obj))) {
            return await async function(){
                if (check_true (((cval instanceof Object)&& ((null==cval[await (await Environment.get_global("first"))(target_path)])|| (cval[await (await Environment.get_global("first"))(target_path)] instanceof Object)|| ((target_path && target_path.length)===1))))) {
                    return await (await Environment.get_global("make_path"))(target_path,root_obj,value,pos)
                } else {
                    throw new TypeError(("make_path: non-object encountered at "+ await (await Environment.get_global("as_lisp"))(await (await Environment.get_global("add"))(pos,await (await Environment.get_global("first"))(target_path)))));
                    
                }
            } ()
        } else {
            {
                await (await Environment.get_global("set_path"))(pos,root_obj,new Object());
                return await (await Environment.get_global("make_path"))(target_path,root_obj,value,pos)
            }
        }
    } ()
},{ "name":"make_path","fn_args":"(target_path root_obj value _pos)","description":["=:+","Given a target_path array, a target object and a value to set, ","constructs the path to the object, constructing where ","required.  If the path cannot be made due to a ","non-nil, non-object value encountered at one of ","the path segments, the function will throw a TypeError, ","otherwise it will return the provided value if successful."],"usage":["path:array","root_obj:object","value:*"],"tags":["set_path","path","set","object","resolve_path","mutate"],"requires":["take","push","set_path","resolve_path","is_object?","first","make_path","as_lisp","add"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("minmax",async function(container) {
    let value_found;
    let smallest;
    let biggest;
    value_found=false;
    smallest=(await Environment.get_global("MAX_SAFE_INTEGER"));
    biggest=(-1* (await Environment.get_global("MAX_SAFE_INTEGER")));
    if (check_true ((container&& (container instanceof Array)&& (await (await Environment.get_global("length"))(container)>0)))){
        {
            await (async function() {
                let __for_body__98=async function(value) {
                    return (await (await Environment.get_global("is_number?"))(value)&& await (async function(){
                        value_found=true;
                        smallest=await Math.min(value,smallest);
                        return biggest=await Math.max(value,biggest)
                    })())
                };
                let __array__99=[],__elements__97=container;
                let __BREAK__FLAG__=false;
                for(let __iter__96 in __elements__97) {
                    __array__99.push(await __for_body__98(__elements__97[__iter__96]));
                    if(__BREAK__FLAG__) {
                         __array__99.pop();
                        break;
                        
                    }
                }return __array__99;
                 
            })();
            if (check_true (value_found)){
                return await (async function(){
                    let __array_op_rval__100=smallest;
                     if (__array_op_rval__100 instanceof Function){
                        return await __array_op_rval__100(biggest) 
                    } else {
                        return [__array_op_rval__100,biggest]
                    }
                })()
            } else {
                return null
            }
        }
    } else {
        return null
    }
},{ "name":"minmax","fn_args":"(container)","description":["=:+","Given an array container with numeric values, returns an array with smallest ","and largest values in the given array [ min, max ]<br>","(minmax [ 2 0 1 3]) -> [ 0 3 ]"],"usage":["container:array"],"tags":["min","max","array","number","range"],"requires":["MAX_SAFE_INTEGER","is_array?","length","is_number?"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("aif",async function(test_expr,eval_when_true,eval_when_false) {
    return ["=:let",[["=:it",test_expr]],["=:if","=:it",eval_when_true,eval_when_false]]
},{ "eval_when":{ "compile_time":true
},"name":"aif","macro":true,"fn_args":"(test_expr eval_when_true eval_when_false)","description":["=:+","Anaphoric If - This macro defines a scope in which the symbol `it is used ","to store the evaluation of the test form or expression.  It is then available ","in the eval_when_true form and, if provided, the eval_when_false expression."],"usage":["test_expression:*","eval_when_true:*","eval_when_false:*?"],"tags":["conditional","logic","anaphoric","if","it"],"requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("ifa",async function(test,thenclause,elseclause) {
    return ["=:let",[["=:it",test]],["=:if","=:it",thenclause,elseclause]]
},{ "eval_when":{ "compile_time":true
},"name":"ifa","macro":true,"fn_args":"(test thenclause elseclause)","description":"Similar to if, the ifa macro is anaphoric in binding, where the it value is defined as the return value of the test form. Use like if, but the it reference is bound within the bodies of the thenclause or elseclause.","usage":["test:*","thenclause:*","elseclause:*"],"tags":["cond","it","if","anaphoric"],"requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await (async function(){
    return  Environment.set_global("map_range",function(n,from_range,to_range) {
        ;
        return ((to_range && to_range["0"])+ (((n- (from_range && from_range["0"]))/ ((from_range && from_range["1"])- (from_range && from_range["0"])))* ((to_range && to_range["1"])- (to_range && to_range["0"]))))
    },{ "name":"map_range","fn_args":"(n from_range to_range)","usage":["n:number","from_range:array","to_range:array"],"tags":["range","scale","conversion"],"description":["=:+","Given an initial number n, and two numeric ranges, maps n from the first range ","to the second range, returning the value of n as scaled into the second range. "],"requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await (async function(){
    return  Environment.set_global("range_inc",function(start,end,step) {
        if (check_true (end)){
            return  ( Environment.get_global("range"))(start, ( Environment.get_global("add"))(end,1),step)
        } else {
            return  ( Environment.get_global("range"))( ( Environment.get_global("add"))(start,1))
        }
    },{ "name":"range_inc","fn_args":"(start end step)","description":["=:+","Similar to range, but is end inclusive: [start end] returning an array containing values from start, including end. ","vs. the regular range function that returns [start end).  ","If just 1 argument is provided, the function returns an array starting from 0, up to and including the provided value."],"usage":["start:number","end?:number","step?:number"],"tags":["range","iteration","loop"],"requires":["range","add"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await Environment.set_global("HSV_to_RGB",async function(h,s,v) {
     {
             var r, g, b, i, f, p, q, t;
             if (arguments.length === 1) {
                s = h.s, v = h.v, h = h.h;
             }
             i = Math.floor(h * 6);
             f = h * 6 - i;
             p = v * (1 - s);
             q = v * (1 - f * s);
             t = v * (1 - (1 - f) * s);
             switch (i % 6) {
                              case 0: r = v, g = t, b = p; break;
                              case 1: r = q, g = v, b = p; break;
                              case 2: r = p, g = v, b = t; break;
                              case 3: r = p, g = q, b = v; break;
                              case 4: r = t, g = p, b = v; break;
                              case 5: r = v, g = p, b = q; break;
                              }
             return {
                      r: Math.round(r * 255),
                      g: Math.round(g * 255),
                      b: Math.round(b * 255)
                      }
             } 
},{ "name":"HSV_to_RGB","fn_args":"(h s v)","description":["=:+","Given a hue, saturation and brightness, all of which ","should be values between 0 and 1, returns an object ","containing 3 keys: r, g, b, with values between 0 and 255, ","representing the corresponding red, green and blue values ","for the provided hue, saturation and brightness."],"usage":["hue:number","saturation:number","value:number"],"tags":["color","conversion","hue","saturation","brightness","red","green","blue","rgb"],"requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("color_for_number",async function(num,saturation,brightness) {
    let h;
    let pos;
    let color_key;
    let rgb;
    let v;
    h=await Math.abs(await parseInt(num));
    pos=(8% h);
    color_key=[0,4,1,5,2,6,3,7];
    rgb=null;
    v=color_key[pos];
    ;
    h=await (await Environment.get_global("map_range"))(((20* h)% 360),[0,360],[0,1]);
    v=await (await Environment.get_global("map_range"))([v,[0,7],[0.92,1]]);
    rgb=await (async function(){
         return await (await Environment.get_global("HSV_to_RGB"))(h,saturation,brightness) 
    })();
    return ("#"+ await (async function() {
        {
             let __call_target__=await (rgb && rgb["r"])["toString"].call((rgb && rgb["r"]),16), __call_method__="padStart";
            return await __call_target__[__call_method__].call(__call_target__,2,"0")
        } 
    })()+ await (async function() {
        {
             let __call_target__=await (rgb && rgb["g"])["toString"].call((rgb && rgb["g"]),16), __call_method__="padStart";
            return await __call_target__[__call_method__].call(__call_target__,2,"0")
        } 
    })()+ await (async function() {
        {
             let __call_target__=await (rgb && rgb["b"])["toString"].call((rgb && rgb["b"]),16), __call_method__="padStart";
            return await __call_target__[__call_method__].call(__call_target__,2,"0")
        } 
    })())
},{ "name":"color_for_number","fn_args":"(num saturation brightness)","usage":["number:number","saturation:float","brightness:float"],"description":"Given an arbitrary integer, a saturation between 0 and 1 and a brightness between 0 and 1, return an RGB color string","tags":["ui","color","view"],"requires":["map_range","HSV_to_RGB"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("flatten_ctx",async function(ctx,_var_table) {
    let var_table;
    let ctx_keys;
    var_table=(_var_table|| new Object());
    ctx_keys=await (await Environment.get_global("keys"))(var_table);
    if (check_true ((ctx && ctx["scope"]))){
        {
            await (async function() {
                let __for_body__103=async function(k) {
                    if (check_true (await (await Environment.get_global("not"))(await (await Environment.get_global("contains?"))(k,ctx_keys)))){
                        {
                            return await async function(){
                                var_table[k]=await (async function(){
                                    let __targ__106=(ctx && ctx["scope"]);
                                    if (__targ__106){
                                         return(__targ__106)[k]
                                    } 
                                })();
                                return var_table;
                                
                            }()
                        }
                    }
                };
                let __array__104=[],__elements__102=await (await Environment.get_global("keys"))((ctx && ctx["scope"]));
                let __BREAK__FLAG__=false;
                for(let __iter__101 in __elements__102) {
                    __array__104.push(await __for_body__103(__elements__102[__iter__101]));
                    if(__BREAK__FLAG__) {
                         __array__104.pop();
                        break;
                        
                    }
                }return __array__104;
                 
            })();
            if (check_true ((ctx && ctx["parent"]))){
                {
                    await (await Environment.get_global("flatten_ctx"))((ctx && ctx["parent"]),var_table)
                }
            };
            return var_table
        }
    }
},{ "name":"flatten_ctx","fn_args":"(ctx _var_table)","description":"Internal usage by the compiler, flattens the hierarchical context structure to a single level. Shadowing rules apply.","usage":["ctx_object:object"],"tags":["system","compiler"],"requires":["keys","not","contains?","flatten_ctx"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("identify_symbols",async function(quoted_form,_state) {
    let acc;
    acc=[];
    _state=await (async function(){
        if (check_true (_state)){
            return _state
        } else {
            return new Object()
        }
    })();
    debugger;
    ;
    await async function(){
        if (check_true ((quoted_form instanceof Array))) {
            {
                return await (async function() {
                    let __for_body__109=async function(elem) {
                        return (acc).push(await (async function(){
                             return await (await Environment.get_global("identify_symbols"))(elem,_state) 
                        })())
                    };
                    let __array__110=[],__elements__108=quoted_form;
                    let __BREAK__FLAG__=false;
                    for(let __iter__107 in __elements__108) {
                        __array__110.push(await __for_body__109(__elements__108[__iter__107]));
                        if(__BREAK__FLAG__) {
                             __array__110.pop();
                            break;
                            
                        }
                    }return __array__110;
                     
                })()
            }
        } else if (check_true (((quoted_form instanceof String || typeof quoted_form==='string')&& await (await Environment.get_global("starts_with?"))("=:",quoted_form)))) {
            (acc).push({
                name:await (await Environment.get_global("as_lisp"))(quoted_form),where:await (async function(){
                     return await (await Environment.get_global("describe"))(await (await Environment.get_global("as_lisp"))(quoted_form)) 
                })()
            })
        } else if (check_true ((quoted_form instanceof Object))) {
            await (async function() {
                let __for_body__113=async function(elem) {
                    return (acc).push(await (async function(){
                         return await (await Environment.get_global("identify_symbols"))(elem,_state) 
                    })())
                };
                let __array__114=[],__elements__112=await (await Environment.get_global("values"))(quoted_form);
                let __BREAK__FLAG__=false;
                for(let __iter__111 in __elements__112) {
                    __array__114.push(await __for_body__113(__elements__112[__iter__111]));
                    if(__BREAK__FLAG__) {
                         __array__114.pop();
                        break;
                        
                    }
                }return __array__114;
                 
            })()
        }
    } ();
    return ["=:quote",acc]
},{ "name":"identify_symbols","fn_args":"(quoted_form _state)","requires":["is_array?","push","identify_symbols","is_string?","starts_with?","as_lisp","describe","is_object?","values"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("unless",async function(...args) {
    let condition;
    let forms;
    condition=(args && args["0"]);
    forms=await (await Environment.get_global("slice"))(args,1);
    return ["=:if",["=:not",condition],["=:do",].concat(forms)]
},{ "eval_when":{ "compile_time":true
},"name":"unless","macro":true,"fn_args":"(condition \"&\" forms)","description":"opposite of if, if the condition is false then the forms are evaluated","usage":["condition:array","forms:array"],"tags":["if","not","ifnot","logic","conditional"],"requires":["slice"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("use_quoted_initializer",async function(...args) {
    let forms;
    forms=await (await Environment.get_global("slice"))(args,0);
    {
        let insert_initializer;
        insert_initializer=async function(form) {
            let meta=form[3];
            ;
            if (check_true ((null==form[3]))){
                meta=await async function(){
                    form[3]=new Object();
                    return form;
                    
                }()
            };
            return await async function(){
                if (check_true (((meta instanceof Array)&& (await (await Environment.get_global("resolve_path"))([3,1],form) instanceof Object)))) {
                    {
                        await (await Environment.get_global("set_path"))([3,1,"initializer"],form,await (async function(){
                             return ["=:quotel",await (async function(){
                                 return ["=:try",(form && form["2"]),["=:catch","=:Error",["=:e"],"=:e"]] 
                            })()] 
                        })());
                        return form
                    }
                } else if (check_true ((meta instanceof Object))) {
                    {
                        await async function(){
                            let __target_obj__116=(form && form["3"]);
                            __target_obj__116["initializer"]=await (async function(){
                                 return ["=:quotel",await (async function(){
                                     return ["=:try",(form && form["2"]),["=:catch","=:Error",["=:e"],"=:e"]] 
                                })()] 
                            })();
                            return __target_obj__116;
                            
                        }();
                        return form
                    }
                } else {
                    {
                        await (await Environment.get_global("warn"))("use_quoted_initializer: cannot quote ",await (async function(){
                            if (check_true (((form && form["2"]) instanceof String || typeof (form && form["2"])==='string'))){
                                return (form && form["2"])
                            } else {
                                return form
                            }
                        })());
                        return form
                    }
                }
            } ()
        };
        return await (async function() {
            let __for_body__119=async function(form) {
                form=await (async function(){
                     return await (await Environment.get_global("macroexpand"))(form) 
                })();
                if (check_true (((form instanceof Array)&& ((form && form["0"])==="=:defglobal")))){
                    {
                        return await insert_initializer(form)
                    }
                } else {
                    return form
                }
            };
            let __array__120=[],__elements__118=forms;
            let __BREAK__FLAG__=false;
            for(let __iter__117 in __elements__118) {
                __array__120.push(await __for_body__119(__elements__118[__iter__117]));
                if(__BREAK__FLAG__) {
                     __array__120.pop();
                    break;
                    
                }
            }return __array__120;
             
        })()
    }
},{ "eval_when":{ "compile_time":true
},"name":"use_quoted_initializer","macro":true,"fn_args":"[\"&\" forms]","description":["=:+","The macro `use_quoted_initializer` preserves the source form in the ","symbol definition object.  When the environment is saved, any source forms that ","wish to be preserved through the serialization process should be in the body of ","this macro.  This is a necessity for global objects that hold callable ","functions, or functions or structures that require initializers, such as things ","that connect or use environmental resources.  "],"usage":["forms:array"],"tags":["compilation","save_env","export","source","use","compiler","compile"],"requires":["slice","is_array?","is_object?","resolve_path","set_path","warn","is_string?","macroexpand"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await (async function(){
    return  Environment.set_global("but_last",function(arr) {
        if (check_true ((arr instanceof Array))){
            return  ( Environment.get_global("slice"))(arr,0,((arr && arr.length)- 1))
        } else {
            throw new TypeError(("but_last: expected array, but received "+  ( Environment.get_global("sub_type"))(arr)));
            
        }
    },{ "name":"but_last","fn_args":"(arr)","description":["=:+","Given an array, returns all elements except the final element.  This ","function is the inverse of `last`.  If there are less than 2 elements in the ","array (0 or 1 elements), then an empty array is returned.  If a non-array is ","provided, the function will throw a `TypeError`. "],"usage":["arr:array"],"tags":["array","last","elements","front","head","rest"],"requires":["is_array?","slice","sub_type"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await (async function(){
    return  Environment.set_global("random_int",function(...args) {
        let top;
        let bottom;
        top=0;
        bottom=0;
        if (check_true (( ( Environment.get_global("length"))(args)>1))){
            {
                top= parseInt((args && args["1"]));
                bottom= parseInt((args && args["0"]))
            }
        } else {
            top= parseInt((args && args["0"]))
        };
        return  parseInt( ( Environment.get_global("add"))(( Math.random()* (top- bottom)),bottom))
    },{ "name":"random_int","fn_args":"[\"&\" \"args\"]","description":["=:+","Returns a random integer between 0 and the argument. ","If two arguments are provided then returns an integer ","between the first argument and the second argument."],"usage":["arg1:number","arg2?:number"],"tags":["rand","number","integer"],"requires":["length","add"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await (async function(){
    return  Environment.set_global("resolve_multi_path",function(path,obj,not_found) {
        return   (function(){
            if (check_true ((obj instanceof Object))) {
                return   (function(){
                    if (check_true ((( ( Environment.get_global("length"))(path)===1)&& ("*"=== ( Environment.get_global("first"))(path))))) {
                        return (obj|| not_found)
                    } else if (check_true ((( ( Environment.get_global("length"))(path)===1)&& (obj[ ( Environment.get_global("first"))(path)] instanceof Object)))) {
                        return (obj[ ( Environment.get_global("first"))(path)]|| not_found)
                    } else if (check_true ((( ( Environment.get_global("length"))(path)===1)&&  ( Environment.get_global("not"))((obj[ ( Environment.get_global("first"))(path)] instanceof Object))&&  ( Environment.get_global("not"))((null==obj[ ( Environment.get_global("first"))(path)]))))) {
                        return obj[ ( Environment.get_global("first"))(path)]
                    } else if (check_true (((obj instanceof Array)&& ("*"=== ( Environment.get_global("first"))(path))))) {
                        return  ( function() {
                            let __for_body__123=function(val) {
                                return  ( Environment.get_global("resolve_multi_path"))( ( Environment.get_global("rest"))(path),val,not_found)
                            };
                            let __array__124=[],__elements__122=obj;
                            let __BREAK__FLAG__=false;
                            for(let __iter__121 in __elements__122) {
                                __array__124.push( __for_body__123(__elements__122[__iter__121]));
                                if(__BREAK__FLAG__) {
                                     __array__124.pop();
                                    break;
                                    
                                }
                            }return __array__124;
                             
                        })()
                    } else if (check_true (((obj instanceof Object)&& ("*"=== ( Environment.get_global("first"))(path))))) {
                        return  ( function() {
                            let __for_body__127=function(val) {
                                return  ( Environment.get_global("resolve_multi_path"))( ( Environment.get_global("rest"))(path),val,not_found)
                            };
                            let __array__128=[],__elements__126= ( Environment.get_global("values"))(obj);
                            let __BREAK__FLAG__=false;
                            for(let __iter__125 in __elements__126) {
                                __array__128.push( __for_body__127(__elements__126[__iter__125]));
                                if(__BREAK__FLAG__) {
                                     __array__128.pop();
                                    break;
                                    
                                }
                            }return __array__128;
                             
                        })()
                    } else if (check_true (( ( Environment.get_global("length"))(path)>1))) {
                        return  ( Environment.get_global("resolve_multi_path"))( ( Environment.get_global("rest"))(path),obj[ ( Environment.get_global("first"))(path)],not_found)
                    }
                } )()
            } else {
                return not_found
            }
        } )()
    },{ "name":"resolve_multi_path","fn_args":"(path obj not_found)","tags":["path","wildcard","tree","structure"],"usage":["path:array","obj:object","not_found:?*"],"description":["=:+","Given a list containing a path to a value in a nested array, return the value at the given ","path. If the value * is in the path, the path value is a wild card if the passed object ","structure at the path position is a vector or list."],"requires":["is_object?","length","first","not","is_array?","resolve_multi_path","rest","values"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await (async function(){
    return  Environment.set_global("delete_path",function(path,obj) {
        let mpath;
        let key;
        let place_path;
        let place;
        mpath= ( function(){
             return  clone(path) 
        })();
        key=(mpath).pop();
        place_path=mpath;
        place=null;
        if (check_true ( ( Environment.get_global("not"))((path instanceof Array)))){
            {
                throw new TypeError("path must be an array when provided to delete_path");
                
            }
        };
        if (check_true ( ( Environment.get_global("not"))((obj instanceof Object)))){
            {
                throw new TypeError("Invalid object provided to delete_path");
                
            }
        };
        return   (function(){
            if (check_true ((( ( Environment.get_global("length"))(place_path)===0)&&  ( function(){
                 return  ( Environment.get_global("is_value?"))(key) 
            })()))) {
                {
                     ( Environment.get_global("delete_prop"))(obj,key);
                    return obj
                }
            } else if (check_true ((( ( Environment.get_global("length"))(place_path)>0)&&  ( function(){
                 return  ( Environment.get_global("is_value?"))(key) 
            })()))) {
                {
                    place= ( Environment.get_global("resolve_path"))(place_path,obj);
                    if (check_true ((place instanceof Object))){
                        {
                             ( Environment.get_global("delete_prop"))(place,key)
                        }
                    };
                    return obj
                }
            } else {
                throw new TypeError("delete_path: invalid path or object provided");
                
            }
        } )()
    },{ "name":"delete_path","fn_args":"(path obj)","description":["=:+","Given a path and an target object, removes the specified value ","at the path and returns the original object, which will have been modified. ","If the value isn't found, there are no modifications to the object and the ","object is returned.  Will throw a TypeError if the obj argument isn't an ","object type, of if the path isn't an array with at least one element."],"usage":["path:array","obj:object"],"tags":["path","delete","remove","object","resolve","modify","value"],"requires":["pop","not","is_array?","is_object?","length","is_value?","delete_prop","resolve_path"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await Environment.set_global("symbol_tree",async function(quoted_form,_state,_current_path) {
    let acc;
    let allocators;
    let uop;
    let get_allocations;
    let idx;
    let fval;
    let sym_paths;
    let is_root;
    acc=[];
    allocators={
        let:await (async function(){
             return [[1,"*",0]] 
        })(),defun:await (async function(){
             return [[1],[2,"*"]] 
        })()
    };
    uop=null;
    get_allocations=async function() {
        sym_paths=allocators[await (async function(){
             return await (await Environment.get_global("unquotify"))((quoted_form && quoted_form["0"])) 
        })()];
        if (check_true (sym_paths)){
            {
                return await (async function() {
                    let __for_body__131=async function(sym_path) {
                        fval=await (await Environment.get_global("resolve_multi_path"))(sym_path,quoted_form);
                        await console.log("Fval is: ",fval,"sym_path: ",sym_path,"current_path: ",_current_path," ",quoted_form);
                        uop=await (async function(){
                             return await (await Environment.get_global("unquotify"))((quoted_form && quoted_form["0"])) 
                        })();
                        if (check_true ((fval instanceof Array))){
                            return await (async function() {
                                let __for_body__135=async function(s) {
                                    s=await (async function(){
                                         return await (await Environment.get_global("unquotify"))(s) 
                                    })();
                                    if (check_true ((null==await (async function(){
                                        let __targ__137=(_state && _state["definitions"]);
                                        if (__targ__137){
                                             return(__targ__137)[fval]
                                        } 
                                    })()))){
                                        {
                                            await async function(){
                                                let __target_obj__138=(_state && _state["definitions"]);
                                                __target_obj__138[s]=[];
                                                return __target_obj__138;
                                                
                                            }()
                                        }
                                    };
                                    return (await (async function(){
                                        let __targ__139=(_state && _state["definitions"]);
                                        if (__targ__139){
                                             return(__targ__139)[s]
                                        } 
                                    })()).push({
                                        path:_current_path,op:uop
                                    })
                                };
                                let __array__136=[],__elements__134=fval;
                                let __BREAK__FLAG__=false;
                                for(let __iter__133 in __elements__134) {
                                    __array__136.push(await __for_body__135(__elements__134[__iter__133]));
                                    if(__BREAK__FLAG__) {
                                         __array__136.pop();
                                        break;
                                        
                                    }
                                }return __array__136;
                                 
                            })()
                        } else {
                            {
                                if (check_true ((null==await (async function(){
                                    let __targ__140=(_state && _state["definitions"]);
                                    if (__targ__140){
                                         return(__targ__140)[fval]
                                    } 
                                })()))){
                                    {
                                        await async function(){
                                            let __target_obj__141=(_state && _state["definitions"]);
                                            __target_obj__141[fval]=[];
                                            return __target_obj__141;
                                            
                                        }()
                                    }
                                };
                                return (await (async function(){
                                    let __targ__142=(_state && _state["definitions"]);
                                    if (__targ__142){
                                         return(__targ__142)[fval]
                                    } 
                                })()).push({
                                    path:_current_path,op:uop
                                })
                            }
                        }
                    };
                    let __array__132=[],__elements__130=sym_paths;
                    let __BREAK__FLAG__=false;
                    for(let __iter__129 in __elements__130) {
                        __array__132.push(await __for_body__131(__elements__130[__iter__129]));
                        if(__BREAK__FLAG__) {
                             __array__132.pop();
                            break;
                            
                        }
                    }return __array__132;
                     
                })()
            }
        }
    };
    idx=-1;
    fval=null;
    sym_paths=null;
    is_root=await (async function(){
        if (check_true ((_state==undefined))){
            return true
        } else {
            return false
        }
    })();
    _state=await (async function(){
        if (check_true (_state)){
            return _state
        } else {
            return {
                definitions:new Object()
            }
        }
    })();
    _current_path=(_current_path|| []);
    ;
    await console.log("symbol_tree: quoted_form: ",quoted_form,_current_path);
    await get_allocations();
    return await async function(){
        if (check_true ((quoted_form instanceof Array))) {
            {
                await (await Environment.get_global("map"))(async function(elem,idx) {
                    {
                        let it;
                        it=await (async function(){
                             return await (await Environment.get_global("symbol_tree"))(elem,_state,await (await Environment.get_global("conj"))(_current_path,idx)) 
                        })();
                        if (check_true (it)){
                            return (acc).push(it)
                        } else {
                            return 
                        }
                    }
                },quoted_form);
                if (check_true (is_root)){
                    return await (await Environment.get_global("add"))({
                        tree:acc
                    },_state)
                } else {
                    return acc
                }
            }
        } else if (check_true (((quoted_form instanceof String || typeof quoted_form==='string')&& await (await Environment.get_global("starts_with?"))("=:",quoted_form)))) {
            {
                return await (await Environment.get_global("unquotify"))(quoted_form)
            }
        } else if (check_true ((quoted_form instanceof Object))) {
            {
                await (async function() {
                    let __for_body__145=async function(pset) {
                        {
                            let it;
                            it=await (async function(){
                                 return await (await Environment.get_global("symbol_tree"))((pset && pset["1"]),_state,await (await Environment.get_global("conj"))(_current_path,await (async function(){
                                    let __array_op_rval__147=(pset && pset["1"]);
                                     if (__array_op_rval__147 instanceof Function){
                                        return await __array_op_rval__147() 
                                    } else {
                                        return [__array_op_rval__147]
                                    }
                                })())) 
                            })();
                            if (check_true (it)){
                                return (acc).push(it)
                            } else {
                                return 
                            }
                        }
                    };
                    let __array__146=[],__elements__144=await (await Environment.get_global("pairs"))(quoted_form);
                    let __BREAK__FLAG__=false;
                    for(let __iter__143 in __elements__144) {
                        __array__146.push(await __for_body__145(__elements__144[__iter__143]));
                        if(__BREAK__FLAG__) {
                             __array__146.pop();
                            break;
                            
                        }
                    }return __array__146;
                     
                })();
                if (check_true (is_root)){
                    return await (await Environment.get_global("add"))({
                        tree:acc
                    },_state)
                } else {
                    return acc
                }
            }
        }
    } ()
},{ "name":"symbol_tree","fn_args":"(quoted_form _state _current_path)","description":"Given a quoted form as input, isolates the symbols of the form in a tree structure so dependencies can be seen.","usage":["quoted_form:quote"],"tags":["structure","development","analysis"],"requires":["unquotify","resolve_multi_path","is_array?","push","map","symbol_tree","conj","add","is_string?","starts_with?","is_object?","pairs"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("except_nil",async function(items) {
    let acc=[];
    ;
    if (check_true (await (await Environment.get_global("not"))((await (await Environment.get_global("sub_type"))(items)=="array")))){
        items=[items]
    };
    await (async function() {
        let __for_body__150=async function(value) {
            if (check_true (await (await Environment.get_global("not"))((null==value)))){
                return (acc).push(value)
            }
        };
        let __array__151=[],__elements__149=items;
        let __BREAK__FLAG__=false;
        for(let __iter__148 in __elements__149) {
            __array__151.push(await __for_body__150(__elements__149[__iter__148]));
            if(__BREAK__FLAG__) {
                 __array__151.pop();
                break;
                
            }
        }return __array__151;
         
    })();
    return acc
},{ "name":"except_nil","fn_args":"[\"items\"]","description":"Takes the passed list or set and returns a new list that doesn't contain any undefined or nil values.  Unlike no_empties, false values and blank strings will pass through.","usage":["items:list|set"],"tags":["filter","nil","undefined","remove","no_empties"],"requires":["not","sub_type","push"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("each",async function(items,property) {
    return await async function(){
        if (check_true (((property instanceof String || typeof property==='string')|| await (await Environment.get_global("is_number?"))(property)))) {
            return await (await Environment.get_global("except_nil"))(await (async function() {
                let __for_body__154=async function(item) {
                    if (check_true (item)){
                        {
                            return item[property]
                        }
                    }
                };
                let __array__155=[],__elements__153=(items|| []);
                let __BREAK__FLAG__=false;
                for(let __iter__152 in __elements__153) {
                    __array__155.push(await __for_body__154(__elements__153[__iter__152]));
                    if(__BREAK__FLAG__) {
                         __array__155.pop();
                        break;
                        
                    }
                }return __array__155;
                 
            })())
        } else if (check_true ((await (await Environment.get_global("sub_type"))(property)=="array"))) {
            {
                let __collector;
                let __result;
                let __action;
                __collector=[];
                __result=null;
                __action=async function(item) {
                    let nl=[];
                    ;
                    await (async function() {
                        let __for_body__158=async function(p) {
                            return await async function(){
                                if (check_true ((p instanceof Array))) {
                                    return (nl).push(await (await Environment.get_global("resolve_path"))(p,item))
                                } else if (check_true (p instanceof Function)) {
                                    return (nl).push(await (async function(){
                                        let __array_op_rval__160=p;
                                         if (__array_op_rval__160 instanceof Function){
                                            return await __array_op_rval__160(item) 
                                        } else {
                                            return [__array_op_rval__160,item]
                                        }
                                    })())
                                } else {
                                    return (nl).push(item[p])
                                }
                            } ()
                        };
                        let __array__159=[],__elements__157=property;
                        let __BREAK__FLAG__=false;
                        for(let __iter__156 in __elements__157) {
                            __array__159.push(await __for_body__158(__elements__157[__iter__156]));
                            if(__BREAK__FLAG__) {
                                 __array__159.pop();
                                break;
                                
                            }
                        }return __array__159;
                         
                    })();
                    return nl
                };
                ;
                await (async function() {
                    let __for_body__163=async function(__item) {
                        __result=await __action(__item);
                        if (check_true (__result)){
                            return (__collector).push(__result)
                        }
                    };
                    let __array__164=[],__elements__162=items;
                    let __BREAK__FLAG__=false;
                    for(let __iter__161 in __elements__162) {
                        __array__164.push(await __for_body__163(__elements__162[__iter__161]));
                        if(__BREAK__FLAG__) {
                             __array__164.pop();
                            break;
                            
                        }
                    }return __array__164;
                     
                })();
                return __collector
            }
        } else if (check_true ((await (await Environment.get_global("sub_type"))(property)=="AsyncFunction"))) {
            {
                let __collector;
                let __result;
                let __action;
                __collector=[];
                __result=null;
                __action=async function(item) {
                    return await (async function(){
                        let __array_op_rval__165=property;
                         if (__array_op_rval__165 instanceof Function){
                            return await __array_op_rval__165(item) 
                        } else {
                            return [__array_op_rval__165,item]
                        }
                    })()
                };
                ;
                await (async function() {
                    let __for_body__168=async function(__item) {
                        __result=await __action(__item);
                        if (check_true (__result)){
                            return (__collector).push(__result)
                        }
                    };
                    let __array__169=[],__elements__167=items;
                    let __BREAK__FLAG__=false;
                    for(let __iter__166 in __elements__167) {
                        __array__169.push(await __for_body__168(__elements__167[__iter__166]));
                        if(__BREAK__FLAG__) {
                             __array__169.pop();
                            break;
                            
                        }
                    }return __array__169;
                     
                })();
                return __collector
            }
        } else if (check_true ((await (await Environment.get_global("sub_type"))(property)=="Function"))) {
            {
                let __collector;
                let __result;
                let __action;
                __collector=[];
                __result=null;
                __action=async function(item) {
                    return await (async function(){
                        let __array_op_rval__170=property;
                         if (__array_op_rval__170 instanceof Function){
                            return await __array_op_rval__170(item) 
                        } else {
                            return [__array_op_rval__170,item]
                        }
                    })()
                };
                ;
                await (async function() {
                    let __for_body__173=async function(__item) {
                        __result=await __action(__item);
                        if (check_true (__result)){
                            return (__collector).push(__result)
                        }
                    };
                    let __array__174=[],__elements__172=items;
                    let __BREAK__FLAG__=false;
                    for(let __iter__171 in __elements__172) {
                        __array__174.push(await __for_body__173(__elements__172[__iter__171]));
                        if(__BREAK__FLAG__) {
                             __array__174.pop();
                            break;
                            
                        }
                    }return __array__174;
                     
                })();
                return __collector
            }
        } else {
            throw new TypeError(("each: strings, arrays, and functions can be provided for the property name or names to extract - received: "+ await (await Environment.get_global("sub_type"))(property)));
            
        }
    } ()
},{ "name":"each","fn_args":"(items property)","description":["=:+","Provided a list of items, provide a property name or ","a list of property names to be extracted and returned from the source array as a new list.","If property is an array, and contains values that are arrays, those arrays will be treated as a path."],"usage":["items:list","property:string|list|function|AsyncFunction"],"tags":["pluck","element","only","list","object","property"],"requires":["is_string?","is_number?","except_nil","sub_type","is_array?","push","resolve_path","is_function?"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await (async function(){
    return  Environment.set_global("replace",function(...args) {
        if (check_true (((args && args.length)<3))){
            throw new SyntaxError("Invalid syntax for replace: requires at least three arguments, target value or regex, the replacement value, and at least one value (object list or string)");
            
        } else {
            try {
                {
                    let target;
                    let replacement;
                    let work_values;
                    let value_type;
                    let sr_val;
                    let arg_value_type;
                    let rval;
                    target=(args && args["0"]);
                    replacement=(args && args["1"]);
                    work_values= ( Environment.get_global("slice"))(args,2);
                    value_type=null;
                    sr_val=null;
                    arg_value_type= subtype((args && args["2"]));
                    rval=[];
                     ( function() {
                        let __for_body__178=function(value) {
                            value_type= subtype(value);
                            if (check_true ((value_type==="Number"))){
                                {
                                    value_type="String";
                                    value=(""+ value)
                                }
                            };
                            return   (function(){
                                if (check_true ((value_type==="String"))) {
                                    return (rval).push( value["replace"].call(value,target,replacement))
                                } else if (check_true ((value_type==="array"))) {
                                    return  ( function() {
                                        let __for_body__182=function(elem) {
                                            return (rval).push( ( Environment.get_global("replace"))(target,replacement,elem))
                                        };
                                        let __array__183=[],__elements__181=value;
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__180 in __elements__181) {
                                            __array__183.push( __for_body__182(__elements__181[__iter__180]));
                                            if(__BREAK__FLAG__) {
                                                 __array__183.pop();
                                                break;
                                                
                                            }
                                        }return __array__183;
                                         
                                    })()
                                } else if (check_true ((value_type==="object"))) {
                                    {
                                        sr_val=new Object();
                                         ( function() {
                                            let __for_body__186=function(k) {
                                                if (check_true ( value["hasOwnProperty"].call(value,k))){
                                                    {
                                                        return   (function(){
                                                            sr_val[k]= ( Environment.get_global("replace"))(target,replacement,value[k]);
                                                            return sr_val;
                                                            
                                                        })()
                                                    }
                                                }
                                            };
                                            let __array__187=[],__elements__185= ( Environment.get_global("keys"))(value);
                                            let __BREAK__FLAG__=false;
                                            for(let __iter__184 in __elements__185) {
                                                __array__187.push( __for_body__186(__elements__185[__iter__184]));
                                                if(__BREAK__FLAG__) {
                                                     __array__187.pop();
                                                    break;
                                                    
                                                }
                                            }return __array__187;
                                             
                                        })();
                                        return rval= rval["concat"].call(rval,sr_val)
                                    }
                                }
                            } )()
                        };
                        let __array__179=[],__elements__177=work_values;
                        let __BREAK__FLAG__=false;
                        for(let __iter__176 in __elements__177) {
                            __array__179.push( __for_body__178(__elements__177[__iter__176]));
                            if(__BREAK__FLAG__) {
                                 __array__179.pop();
                                break;
                                
                            }
                        }return __array__179;
                         
                    })();
                    if (check_true (( ( Environment.get_global("not"))((arg_value_type==="array"))&&  ( Environment.get_global("not"))((arg_value_type==="object"))))){
                        return  ( Environment.get_global("first"))(rval)
                    } else {
                        return rval
                    }
                }
            } catch (__exception__175) {
                if (__exception__175 instanceof Error) {
                    let e=__exception__175;
                    {
                        return  console.error(("replace: "+ e))
                    }
                }
            }
        }
    },{ "name":"replace","fn_args":"[\"&\" args]","description":["=:+","Given at least 3 arguments, finds the first  argument, and replaces with the second argument, operating on the third plus argument.  ","This function will act to replace and find values in strings, arrays and objects.  When replacing values in strings, be aware that ","only the first matching value will be replaced.  To replace ALL values in strings, use a RegExp with the `g flag set, such as ","(new RegExp \"Target String\" `g).  For example, the following replaces all target values in the target string:<br>","(replace (new RegExp \"Indiana\" `g) \"Illinois\" \"The address of the location in Indiana has now been changed to 123 Main Street, Townville, Indiana.\")"],"usage":["target:string|regexp","replacement:string|number","container:string|array|object"],"tags":["replace","find","change","edit","string","array","object"],"requires":["slice","push","replace","keys","not","first"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await (async function(){
    return  Environment.set_global("get_symbol_details_for_ns",function(namespace,symbol_name) {
        if (check_true (((namespace instanceof String || typeof namespace==='string')&& (symbol_name instanceof String || typeof symbol_name==='string')))){
            return  ( Environment.get_global("first"))( ( function(){
                let __collector;
                let __result;
                let __action;
                __collector=[];
                __result=null;
                __action=function(entry) {
                    if (check_true (((entry && entry["namespace"])===namespace))){
                        {
                            return entry
                        }
                    }
                };
                ;
                 ( function() {
                    let __for_body__191=function(__item) {
                        __result= __action(__item);
                        if (check_true (__result)){
                            return (__collector).push(__result)
                        }
                    };
                    let __array__192=[],__elements__190= ( Environment.get_global("meta_for_symbol"))(symbol_name,true);
                    let __BREAK__FLAG__=false;
                    for(let __iter__189 in __elements__190) {
                        __array__192.push( __for_body__191(__elements__190[__iter__189]));
                        if(__BREAK__FLAG__) {
                             __array__192.pop();
                            break;
                            
                        }
                    }return __array__192;
                     
                })();
                return __collector
            })())
        } else {
            throw new TypeError("get_symbol_for_ns: invalid arguments: must both be strings");
            
        }
    },{ "name":"get_symbol_details_for_ns","fn_args":"(namespace symbol_name)","description":"Given a namespace and a symbol name returns the details for the specific symbol in the namespace if found, or nil if not.","tags":["namespace","symbol","find","meta","details"],"usage":["namespace:string","symbol_name:string"],"requires":["is_string?","first","push","meta_for_symbol"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await Environment.set_global("env_encode_string",async function(text) {
    let te;
    let enc;
    let decl;
    let de;
    let bl;
    te=new TextEncoder();
    enc=await te["encode"].call(te,text);
    decl=[];
    de=new TextDecoder();
    bl=null;
    await (async function() {
        let __for_body__195=async function(b) {
            if (check_true ((b===92))){
                {
                    (decl).push(92);
                    (decl).push(92);
                    (decl).push(92);
                    return (decl).push(92)
                }
            } else {
                {
                    return (decl).push(b)
                }
            }
        };
        let __array__196=[],__elements__194=enc;
        let __BREAK__FLAG__=false;
        for(let __iter__193 in __elements__194) {
            __array__196.push(await __for_body__195(__elements__194[__iter__193]));
            if(__BREAK__FLAG__) {
                 __array__196.pop();
                break;
                
            }
        }return __array__196;
         
    })();
    return await de["decode"].call(de,new Uint8Array(decl))
},{ "name":"env_encode_string","fn_args":"(text)","requires":["push"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("cl_encode_string",async function(text) {
    if (check_true ((text instanceof String || typeof text==='string'))){
        {
            let escaped;
            let nq;
            let step1;
            let snq;
            escaped=await (await Environment.get_global("replace"))(new RegExp("\n","g"),await (await Environment.get_global("add"))(await String.fromCharCode(92),"n"),text);
            escaped=await (await Environment.get_global("replace"))(new RegExp("\r","g"),await (await Environment.get_global("add"))(await String.fromCharCode(92),"r"),escaped);
            nq=(escaped).split(await String.fromCharCode(34));
            step1=(nq).join(await (await Environment.get_global("add"))(await String.fromCharCode(92),await String.fromCharCode(34)));
            snq=(step1).split(await String.fromCharCode(39));
            return step1
        }
    } else {
        return text
    }
},{ "name":"cl_encode_string","fn_args":"(text)","requires":["is_string?","replace","add","split_by","join"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await (async function(){
    return  Environment.set_global("fn_signature",function(f) {
        if (check_true ((f instanceof Function|| (f instanceof String || typeof f==='string')))){
            {
                let sig;
                let arg_text;
                let comps;
                let descriptor;
                let fname;
                let ftype;
                let extends_class;
                let keyword_idx;
                let args;
                sig=( ( Environment.get_global("first"))(( ( Environment.get_global("replace"))("\n","", ( function(){
                    if (check_true (f instanceof Function)){
                        return  f["toString"]()
                    } else {
                        return f
                    }
                })())).split("{"))).trim();
                arg_text=null;
                comps=null;
                descriptor=null;
                fname=null;
                ftype=null;
                extends_class=null;
                keyword_idx=null;
                args=null;
                return   (function(){
                    if (check_true ( ( Environment.get_global("starts_with?"))("class",sig))) {
                        {
                            ftype="class";
                            descriptor=(sig).split(" ");
                            fname= ( Environment.get_global("second"))(descriptor);
                            if (check_true ((descriptor[3]==="extends"))){
                                extends_class=descriptor[4]
                            };
                            return {
                                name:fname,type:ftype,extends:extends_class
                            }
                        }
                    } else {
                        {
                            if (check_true (sig)){
                                {
                                    comps=(sig).split("(");
                                    descriptor=(( ( Environment.get_global("first"))(comps)|| "")).split(" ");
                                    arg_text=( ( Environment.get_global("chop"))( ( Environment.get_global("second"))(comps))|| "")
                                }
                            };
                            if (check_true (((descriptor && descriptor.length)>0))){
                                {
                                    keyword_idx= ( Environment.get_global("index_of"))("function",descriptor);
                                    if (check_true (keyword_idx)){
                                        {
                                            fname=( ( Environment.get_global("first"))( descriptor["slice"].call(descriptor,(keyword_idx+ 1),(keyword_idx+ 2)))|| "anonymous");
                                            ftype= ( function(){
                                                if (check_true ((keyword_idx===0))){
                                                    return "sync"
                                                } else {
                                                    return descriptor[(keyword_idx- 1)]
                                                }
                                            })()
                                        }
                                    }
                                }
                            };
                            if (check_true (arg_text)){
                                args= ( function() {
                                    let __for_body__199=function(a) {
                                        return (a).trim()
                                    };
                                    let __array__200=[],__elements__198=((arg_text).split(",")|| []);
                                    let __BREAK__FLAG__=false;
                                    for(let __iter__197 in __elements__198) {
                                        __array__200.push( __for_body__199(__elements__198[__iter__197]));
                                        if(__BREAK__FLAG__) {
                                             __array__200.pop();
                                            break;
                                            
                                        }
                                    }return __array__200;
                                     
                                })()
                            } else {
                                args=[]
                            };
                            return {
                                name:fname,type:ftype,args:args
                            }
                        }
                    }
                } )()
            }
        } else {
            throw new TypeError("non-function supplied to fn_signature");
            
        }
    },{ "name":"fn_signature","fn_args":"(f)","description":["=:+","For a given function as an argument, returns an object with a ","type key containing the function type (async, sync) and an args ","key with an array for the arguments.  Note that a string value which ","is the result of a function serialized with the function's ","toString() method can also be passed."],"usage":["f:function|string"],"tags":["function","signature","arity","inspect"],"requires":["is_function?","is_string?","trim","first","split_by","replace","starts_with?","second","chop","index_of"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await Environment.set_global("path_to_js_syntax",async function(comps) {
    if (check_true ((comps instanceof Array))){
        if (check_true (((comps && comps.length)>1))){
            return (await (async function(){
                 return await (await Environment.get_global("map"))(async function(comp,idx) {
                    if (check_true ((idx===0))){
                        return comp
                    } else {
                        return await async function(){
                            if (check_true ((await isNaN(parseInt(comp))&& await (await Environment.get_global("starts_with?"))("\"",comp)))) {
                                return ("["+ comp+ "]")
                            } else if (check_true (await isNaN(parseInt(comp)))) {
                                return ("."+ comp)
                            } else {
                                return ("["+ "'"+ comp+ "'"+ "]")
                            }
                        } ()
                    }
                },comps) 
            })()).join("")
        } else {
            return (comps && comps["0"])
        }
    } else {
        throw new TypeError(("path_to_js_syntax: need array - given "+ await (await Environment.get_global("sub_type"))(comps)));
        
    }
},{ "name":"path_to_js_syntax","fn_args":"(comps)","description":"Used by the compiler, converts an array containing the components of a path to Javascript syntax, which is then returned as a string.","usage":["comps:array"],"tags":["compiler","path","js","javascript"],"requires":["is_array?","join","map","int","starts_with?","sub_type"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("first_is_upper_case?",async function(str_val) {
    let rval=await str_val["match"].call(str_val,new RegExp("^[A-Z]"));
    ;
    if (check_true ((rval&& (rval && rval["0"])))){
        return true
    } else {
        return false
    }
},{ "name":"first_is_upper_case?","fn_args":"(str_val)","description":"Returns true if the first character of the provided string is an uppercase value in the range [A-Z]. ","usage":["str_val:string"],"tags":["string","case","uppercase","capitalized"],"requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("safe_access_2",async function(token,ctx,sanitizer_fn) {
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
        {
            await async function(){
                comps[0]=await (async function(){
                    let __array_op_rval__202=sanitizer_fn;
                     if (__array_op_rval__202 instanceof Function){
                        return await __array_op_rval__202((comps && comps["0"])) 
                    } else {
                        return [__array_op_rval__202,(comps && comps["0"])]
                    }
                })();
                return comps;
                
            }();
            await (async function(){
                 let __test_condition__203=async function() {
                    return ((comps && comps.length)>0)
                };
                let __body_ref__204=async function() {
                    (acc).push((comps).shift());
                    if (check_true (((comps && comps.length)>0))){
                        return (acc_full).push((["check_true(",await (async function(){
                             return await (await Environment.get_global("expand_dot_accessor"))((acc).join("."),ctx) 
                        })(),")"]).join(""))
                    } else {
                        return (acc_full).push(await (async function(){
                             return await (await Environment.get_global("expand_dot_accessor"))((acc).join("."),ctx) 
                        })())
                    }
                };
                let __BREAK__FLAG__=false;
                while(await __test_condition__203()) {
                     await __body_ref__204();
                     if(__BREAK__FLAG__) {
                         break;
                        
                    }
                } ;
                
            })();
            rval=await (await Environment.get_global("flatten"))(["(",(acc_full).join(" && "),")"]);
            return rval
        }
    }
},{ "name":"safe_access_2","fn_args":"(token ctx sanitizer_fn)","requires":["split_by","push","take","join","expand_dot_accessor","flatten"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("safe_access",async function(token,ctx,sanitizer_fn) {
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
        {
            await async function(){
                comps[0]=await (async function(){
                    let __array_op_rval__206=sanitizer_fn;
                     if (__array_op_rval__206 instanceof Function){
                        return await __array_op_rval__206((comps && comps["0"])) 
                    } else {
                        return [__array_op_rval__206,(comps && comps["0"])]
                    }
                })();
                return comps;
                
            }();
            await (async function(){
                 let __test_condition__207=async function() {
                    return ((comps && comps.length)>0)
                };
                let __body_ref__208=async function() {
                    (acc).push((comps).shift());
                    return (acc_full).push(await (async function(){
                         return await (await Environment.get_global("expand_dot_accessor"))((acc).join("."),ctx) 
                    })())
                };
                let __BREAK__FLAG__=false;
                while(await __test_condition__207()) {
                     await __body_ref__208();
                     if(__BREAK__FLAG__) {
                         break;
                        
                    }
                } ;
                
            })();
            rval=await (await Environment.get_global("flatten"))(["(",(acc_full).join(" && "),")"]);
            return rval
        }
    }
},{ "name":"safe_access","fn_args":"(token ctx sanitizer_fn)","requires":["split_by","push","take","expand_dot_accessor","join","flatten"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("compile_to_js",async function(quoted_form) {
    return ["=:->","=:Environment","compile",quoted_form]
},{ "eval_when":{ "compile_time":true
},"name":"compile_to_js","macro":true,"fn_args":"(quoted_form)","description":["=:+","Given a quoted form, returns an array with two elements, element 0 is the compilation metadata, ","and element 1 is the output Javascript as a string."],"usage":["quoted_form:*"],"tags":["compilation","source","javascript","environment"],"requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("evaluate_compiled_source",async function(compiled_source) {
    return ["=:->","=:Environment","evaluate",compiled_source,"=:nil",{ "compiled_source":true
}]
},{ "eval_when":{ "compile_time":true
},"name":"evaluate_compiled_source","macro":true,"fn_args":"(compiled_source)","description":["=:+","The macro evaluate_compiled_source takes the direct output of the compiler, ","which can be captured using the macro compile_to_js, and performs the ","evaluation of the compiled source, thereby handling the second half of the ","compile then evaluate cycle.  This call will return the results of ","the evaluation of the compiled code assembly."],"usage":["compiled_source:array"],"tags":["compilation","compile","eval","pre-compilation"],"requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("form_structure",async function(quoted_form,max_depth) {
    let idx;
    let acc;
    let structure;
    let follow_tree;
    idx=0;
    acc=[];
    max_depth=(max_depth|| (await Environment.get_global("MAX_SAFE_INTEGER")));
    structure=quoted_form;
    follow_tree=async function(elems,acc,_depth) {
        return await async function(){
            if (check_true ((((elems instanceof Array)|| (elems instanceof Object))&& (_depth>=max_depth)))) {
                if (check_true ((elems instanceof Array))){
                    return "array"
                } else {
                    return "object"
                }
            } else if (check_true ((elems instanceof Array))) {
                return await (await Environment.get_global("map"))(async function(elem,idx) {
                    return await follow_tree(elem,[],await (await Environment.get_global("add"))(_depth,1))
                },elems)
            } else if (check_true ((elems instanceof Object))) {
                {
                    return await (async function() {
                        let __for_body__211=async function(pset) {
                            return await follow_tree((pset && pset["1"]),[],await (await Environment.get_global("add"))(_depth,1))
                        };
                        let __array__212=[],__elements__210=await (await Environment.get_global("pairs"))(elems);
                        let __BREAK__FLAG__=false;
                        for(let __iter__209 in __elements__210) {
                            __array__212.push(await __for_body__211(__elements__210[__iter__209]));
                            if(__BREAK__FLAG__) {
                                 __array__212.pop();
                                break;
                                
                            }
                        }return __array__212;
                         
                    })()
                }
            } else {
                return await async function(){
                    if (check_true (((elems instanceof String || typeof elems==='string')&& await (await Environment.get_global("starts_with?"))("=:",elems)))) {
                        return "symbol"
                    } else if (check_true (await (await Environment.get_global("is_number?"))(elems))) {
                        return "number"
                    } else if (check_true ((elems instanceof String || typeof elems==='string'))) {
                        return "string"
                    } else if (check_true (((elems===true)|| (elems===false)))) {
                        return "boolean"
                    } else {
                        return elems
                    }
                } ()
            }
        } ()
    };
    return await follow_tree(structure,[],0)
},{ "name":"form_structure","fn_args":"(quoted_form max_depth)","description":["=:+","Given a form and an optional max_depth positive number, ","traverses the passed JSON form and produces a nested array structure that contains","the contents of the form classified as either a \"symbol\", \"number\", \"string\", \"boolean\", \"array\", \"object\", or the elem itself. ","The returned structure will mirror the passed structure in form, except with the leaf contents ","being replaced with generalized categorizations."],"tags":["validation","compilation","structure"],"usage":["quoted_form:*","max_depth:?number"],"requires":["MAX_SAFE_INTEGER","is_array?","is_object?","map","add","pairs","is_string?","starts_with?","is_number?"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("validate_form_structure",async function(validation_rules,quoted_form) {
    let results;
    let all_valid;
    let target;
    results={
        valid:[],invalid:[],rule_count:await (await Environment.get_global("length"))(validation_rules),all_passed:false
    };
    all_valid=null;
    target=null;
    await (async function() {
        let __for_body__215=async function(rule) {
            if (check_true (((rule instanceof Array)&& ((rule && rule.length)>1)&& ((rule && rule["0"]) instanceof Array)&& ((rule && rule["1"]) instanceof Array)))){
                {
                    all_valid=true;
                    target=await (await Environment.get_global("resolve_path"))((rule && rule["0"]),quoted_form);
                    await (async function() {
                        let __for_body__219=async function(validation) {
                            if (check_true (await (await Environment.get_global("not"))(await (async function(){
                                let __array_op_rval__221=validation;
                                 if (__array_op_rval__221 instanceof Function){
                                    return await __array_op_rval__221(target) 
                                } else {
                                    return [__array_op_rval__221,target]
                                }
                            })()))){
                                {
                                    all_valid=false;
                                    return __BREAK__FLAG__=true;
                                    return
                                }
                            }
                        };
                        let __array__220=[],__elements__218=(rule && rule["1"]);
                        let __BREAK__FLAG__=false;
                        for(let __iter__217 in __elements__218) {
                            __array__220.push(await __for_body__219(__elements__218[__iter__217]));
                            if(__BREAK__FLAG__) {
                                 __array__220.pop();
                                break;
                                
                            }
                        }return __array__220;
                         
                    })();
                    if (check_true (all_valid)){
                        return ((results && results["valid"])).push(((rule && rule["2"])|| (rule && rule["0"])))
                    } else {
                        return ((results && results["invalid"])).push(((rule && rule["2"])|| (rule && rule["0"])))
                    }
                }
            }
        };
        let __array__216=[],__elements__214=(validation_rules|| []);
        let __BREAK__FLAG__=false;
        for(let __iter__213 in __elements__214) {
            __array__216.push(await __for_body__215(__elements__214[__iter__213]));
            if(__BREAK__FLAG__) {
                 __array__216.pop();
                break;
                
            }
        }return __array__216;
         
    })();
    await async function(){
        results["all_passed"]=(await (await Environment.get_global("length"))((results && results["valid"]))===(results && results["rule_count"]));
        return results;
        
    }();
    return results
},{ "name":"validate_form_structure","fn_args":"(validation_rules quoted_form)","description":["=:+","Given a validation rule structure and a quoted form to analyze returns an object with ","two keys, valid and invalid, which are arrays containing the outcome of the rule ","evaluation, a rule_count key containing the total rules passed, and an all_passed key","which will be set to true if all rules passed, otherwise it will fail.","If the rule evaluates successfully, valid is populated with the rule path, ","otherwise the rule path is placed in the invalid array.<br><br>","Rule structure is as follows:<br><code>","[ [path [validation validation ...] \"rule_name\"] [path [validation ...] \"rule_name\"] ]<br>","</code>","where path is an array with the index path and ","validation is a single argument lambda (fn (v) v) that must either ","return true or false. If true, the validation is considered correct, ","false for incorrect.  The result of the rule application will be put in the valid array, ","otherwise the result will be put in invalid."],"tags":["validation","rules","form","structure"],"usage":["validation_rules:array","quoted_form:*"],"requires":["length","is_array?","resolve_path","not","push"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("*compiler_syntax_rules*",{
    compile_let:await (async function(){
         return [[[0,1,"val"],[(await Environment.get_global("is_array?"))],"let allocation section"],await (async function(){
             return [[0,2],[async function(v) {
                return await (await Environment.get_global("not"))((v===undefined))
            }],"let missing block"] 
        })()] 
    })(),compile_cond:await (async function(){
         return [[[0],[async function(v) {
            return ((await (await Environment.get_global("length"))(await (await Environment.get_global("rest"))(v))% 2)===0)
        }],"cond: odd number of arguments"]] 
    })(),compile_assignment:await (async function(){
         return [[[0,1],[async function(v) {
            return await (await Environment.get_global("not"))((v===undefined))
        }],"assignment is missing target and values"],await (async function(){
             return [[0,2],[async function(v) {
                return await (await Environment.get_global("not"))((v===undefined))
            }],"assignment is missing value"] 
        })()] 
    })()
},{
    requires:["is_array?","not","length","rest"],externals:["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],source_name:"core.lisp"
});
await Environment.set_global("tokenize_lisp",async function(quoted_source) {
    let current_env;
    current_env=await Environment["get_namespace_handle"].call(Environment,await (await Environment.get_global("current_namespace"))());
    return await (await Environment.get_global("compiler"))(quoted_source,{
        only_tokens:true,env:current_env
    })
},{ "name":"tokenize_lisp","fn_args":"(quoted_source)","description":["=:+","Given a quoted source, returns the compilation tokens for the source, prior ","to the actual compilation step.  Any functions that are specified as ","compile_time for eval_when, such as macros, will be expanded and the results of ","the expansions will be in the returned token form. "],"usage":["quoted_source:*"],"tags":["compilation","compiler","tokenize","token","tokens","precompiler"],"requires":["current_namespace","compiler"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("detokenize",async function(token) {
    let rval;
    rval=null;
    return await async function(){
        if (check_true ((token instanceof Array))) {
            return await (async function() {
                let __for_body__225=async function(t) {
                    return await (await Environment.get_global("detokenize"))(t)
                };
                let __array__226=[],__elements__224=token;
                let __BREAK__FLAG__=false;
                for(let __iter__223 in __elements__224) {
                    __array__226.push(await __for_body__225(__elements__224[__iter__223]));
                    if(__BREAK__FLAG__) {
                         __array__226.pop();
                        break;
                        
                    }
                }return __array__226;
                 
            })()
        } else if (check_true (((token instanceof Object)&& ((token && token["type"])==="objlit")&& ((token && token["val"] && token["val"]["name"])==="{}")))) {
            return new Object()
        } else if (check_true (((token instanceof Object)&& ((token && token["type"])==="objlit")))) {
            {
                rval=new Object();
                await (async function() {
                    let __for_body__229=async function(t) {
                        return await async function(){
                            rval[(t && t["val"] && t["val"]["0"] && t["val"]["0"]["name"])]=await (async function(){
                                 return await (await Environment.get_global("detokenize"))((t && t["val"] && t["val"]["1"])) 
                            })();
                            return rval;
                            
                        }()
                    };
                    let __array__230=[],__elements__228=(token && token["val"]);
                    let __BREAK__FLAG__=false;
                    for(let __iter__227 in __elements__228) {
                        __array__230.push(await __for_body__229(__elements__228[__iter__227]));
                        if(__BREAK__FLAG__) {
                             __array__230.pop();
                            break;
                            
                        }
                    }return __array__230;
                     
                })();
                return rval
            }
        } else if (check_true (((token instanceof Object)&& ((token && token["type"])==="literal")))) {
            return await (await Environment.get_global("detokenize"))((token && token["val"]))
        } else if (check_true (((token instanceof Object)&& ((token && token["type"])==="arr")&& (token && token["source"])&& ((token && token["val"] && token["val"]["0"] && token["val"]["0"]["type"])==="special")&& (token && token["val"] && token["val"]["0"] && token["val"]["0"]["ref"])))) {
            {
                return await (async function(){
                    let __array_op_rval__232=(token && token["val"] && token["val"]["0"] && token["val"]["0"]["val"]);
                     if (__array_op_rval__232 instanceof Function){
                        return await __array_op_rval__232((token && token["val"] && token["val"]["1"])) 
                    } else {
                        return [__array_op_rval__232,(token && token["val"] && token["val"]["1"])]
                    }
                })()
            }
        } else if (check_true (((token instanceof Object)&& (token && token["ref"])))) {
            return ("=:"+ (token && token.name))
        } else if (check_true (((token instanceof Object)&& ((token && token["type"])==="arr")))) {
            {
                return await (await Environment.get_global("detokenize"))((token && token["val"]))
            }
        } else if (check_true (((token instanceof Object)&& (token && token["ref"])))) {
            {
                return (token && token["val"])
            }
        } else if (check_true ((token instanceof Object))) {
            return await (await Environment.get_global("detokenize"))((token && token["val"]))
        } else {
            {
                return token
            }
        }
    } ()
},{ "name":"detokenize","fn_args":"(token)","description":["=:+","Converts the provided compiler tokens to a JSON structure representing ","the original source tree. "],"usage":["token_structure:object|array"],"tags":["compilation","compiler","tokenize","token","tokens","precompiler"],"requires":["is_array?","detokenize","is_object?"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("describe_all",async function() {
    return await (async function(){
        let __apply_args__233=await (async function(){
             return await (async function() {
                let __for_body__237=async function(s) {
                    return await (await Environment.get_global("to_object"))(await (async function(){
                         return [await (async function(){
                            let __array_op_rval__239=s;
                             if (__array_op_rval__239 instanceof Function){
                                return await __array_op_rval__239(await (async function(){
                                     return await (await Environment.get_global("describe"))(s) 
                                })()) 
                            } else {
                                return [__array_op_rval__239,await (async function(){
                                     return await (await Environment.get_global("describe"))(s) 
                                })()]
                            }
                        })()] 
                    })())
                };
                let __array__238=[],__elements__236=await (async function(){
                     return await (await Environment.get_global("symbols"))() 
                })();
                let __BREAK__FLAG__=false;
                for(let __iter__235 in __elements__236) {
                    __array__238.push(await __for_body__237(__elements__236[__iter__235]));
                    if(__BREAK__FLAG__) {
                         __array__238.pop();
                        break;
                        
                    }
                }return __array__238;
                 
            })() 
        })();
        return ( (await Environment.get_global("add"))).apply(this,__apply_args__233)
    })()
},{ "name":"describe_all","fn_args":"[]","description":"Returns an object with all defined symbols as the keys and their corresponding descriptions.","usage":[],"tags":["env","environment","symbol","symbols","global","globals"],"requires":["add","to_object","describe","symbols"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("is_value?",async function(val) {
    if (check_true ((val===""))){
        return true
    } else {
        if (check_true ((val===undefined))){
            return false
        } else {
            if (check_true (await isNaN(val))){
                return true
            } else {
                if (check_true (val)){
                    return true
                } else {
                    return false
                }
            }
        }
    }
},{ "name":"is_value?","fn_args":"(val)","description":"Returns true for anything that is not nil or undefined or false.","usage":["val:*"],"tags":["if","value","truthy",false,true],"requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("sort",async function(elems,options) {
    let opts;
    let sort_fn;
    let sort_fn_inner;
    let keyed;
    let reverser;
    let comparitor;
    let key_path_a;
    let key_path_b;
    opts=(((options instanceof Object)&& options)|| new Object());
    sort_fn=null;
    sort_fn_inner=null;
    keyed=false;
    reverser=await (async function(){
        if (check_true ((opts && opts["reversed"]))){
            return -1
        } else {
            return 1
        }
    })();
    comparitor=await (async function(){
         return await async function(){
            if (check_true ((opts && opts["comparitor"]) instanceof Function)) {
                return (opts && opts["comparitor"])
            } else {
                return function(a,b) {
                    return   (function(){
                        if (check_true ((a instanceof String || typeof a==='string'))) {
                            if (check_true ((b instanceof String || typeof b==='string'))){
                                return (reverser*  a["localeCompare"].call(a,b))
                            } else {
                                return (reverser*  a["localeCompare"].call(a,(""+ b)))
                            }
                        } else if (check_true ((b instanceof String || typeof b==='string'))) {
                            return (reverser*  ( function() {
                                {
                                     let __call_target__=(""+ a), __call_method__="localeCompare";
                                    return  __call_target__[__call_method__].call(__call_target__,b)
                                } 
                            })())
                        } else if (check_true ((opts && opts["reversed"]))) {
                            return (b- a)
                        } else {
                            return (a- b)
                        }
                    } )()
                }
            }
        } () 
    })();
    key_path_a="aval";
    key_path_b="bval";
    await (await Environment.get_global("assert"))((elems instanceof Array),"sort: elements must be an array");
    await (await Environment.get_global("assert"))((await subtype(comparitor)==="Function"),("sort: invalid comparitor provided : "+ await subtype(comparitor)+ " - must be a synchronous function, or evaluate to a synchronous function."));
    await (await Environment.get_global("assert"))((((opts && opts["comparitor"])&& await (await Environment.get_global("not"))((opts && opts["reversed"])))|| (await (await Environment.get_global("not"))((opts && opts["comparitor"]))&& (opts && opts["reversed"]))|| (await (await Environment.get_global("not"))((opts && opts["comparitor"]))&& await (await Environment.get_global("not"))((opts && opts["reversed"])))),"sort: comparitor option cannot be combined with reversed option");
    await async function(){
        if (check_true (((opts && opts["key"]) instanceof String || typeof (opts && opts["key"])==='string'))) {
            {
                keyed=true;
                key_path_a=await (async function(){
                     return await (await Environment.get_global("path_to_js_syntax"))(await (await Environment.get_global("get_object_path"))(("aval."+ (opts && opts["key"])))) 
                })();
                return key_path_b=await (async function(){
                     return await (await Environment.get_global("path_to_js_syntax"))(await (await Environment.get_global("get_object_path"))(("bval."+ (opts && opts["key"])))) 
                })()
            }
        } else if (check_true (((opts && opts["key"]) instanceof Array))) {
            {
                keyed=true;
                key_path_a=await (async function(){
                     return await (await Environment.get_global("path_to_js_syntax"))(await (await Environment.get_global("conj"))(["aval"],(opts && opts["key"]))) 
                })();
                key_path_b=await (async function(){
                     return await (await Environment.get_global("path_to_js_syntax"))(await (await Environment.get_global("conj"))(["bval"],(opts && opts["key"]))) 
                })()
            }
        }
    } ();
    sort_fn_inner=new Function("aval","bval","comparitor",("return comparitor( "+ key_path_a+ ","+ key_path_b+ ")"));
    sort_fn=function(aval,bval) {
        return  sort_fn_inner(aval,bval,comparitor)
    };
    return await elems["sort"].call(elems,sort_fn)
},{ "name":"sort","fn_args":"(elems options)","description":["=:+","Given an array of elements, and an optional options object, returns a new sorted array.","With no options provided, the elements are sorted in ascending order.  If the key ","reversed is set to true in options, then the elements are reverse sorted. ","<br>","An optional synchronous function can be provided (defined by the comparitor key) which is expected to take ","two values and return the difference between them as can be used by the sort method of ","JS Array.  Additionally a key value can be provided as either a string (separated by dots) or as an array ","which will be used to bind (destructure) the a and b values to be compared to nested values in the elements ","of the array.","<br>","<br>","Options:<br>","reversed:boolean:if true, the elements are reverse sorted.  Note that if a comparitor function is provided, then ","this key cannot be present, as the comparitor should deal with the sorting order.<br>","key:string|array:A path to the comparison values in the provided elements. If a string, it is provided as period ","separated values.  If it is an array, each component of the array is a successive path value in the element to be ","sorted. <br>","comparitor:function:A synchronous function that is to be provided for comparison of two elements.  It should take ","two arguments, and return the difference between the arguments, either a positive or negative."],"usage":["elements:array","options:object?"],"tags":["array","sorting","order","reverse","comparison","objects"],"requires":["is_object?","is_function?","is_string?","assert","is_array?","not","path_to_js_syntax","get_object_path","conj"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("and*",async function(...args) {
    let vals;
    vals=await (await Environment.get_global("slice"))(args,0);
    if (check_true (((vals && vals.length)>0))){
        {
            let rval=true;
            ;
            await (async function() {
                let __for_body__242=async function(v) {
                    if (check_true (await (await Environment.get_global("not"))(await (async function(){
                         return await (await Environment.get_global("is_value?"))(v) 
                    })()))){
                        {
                            rval=false;
                            return __BREAK__FLAG__=true;
                            return
                        }
                    }
                };
                let __array__243=[],__elements__241=vals;
                let __BREAK__FLAG__=false;
                for(let __iter__240 in __elements__241) {
                    __array__243.push(await __for_body__242(__elements__241[__iter__240]));
                    if(__BREAK__FLAG__) {
                         __array__243.pop();
                        break;
                        
                    }
                }return __array__243;
                 
            })();
            return rval
        }
    }
},{ "name":"and*","fn_args":"[\"&\" vals]","description":["=:+","Similar to and, but unlike and, values that ","are \"\" (blank) or NaN are considered to be true.","Uses is_value? to determine if the value should be considered to be true.","Returns true if the given arguments all are considered a value, ","otherwise false.  If no arguments are provided, returns undefined."],"usage":["val0:*","val1:*","val2:*"],"tags":["truth","and","logic","truthy"],"requires":["slice","not","is_value?"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("or*",async function(...args) {
    let vals;
    vals=await (await Environment.get_global("slice"))(args,0);
    if (check_true (((vals && vals.length)>0))){
        {
            let rval=false;
            ;
            await (async function() {
                let __for_body__246=async function(v) {
                    if (check_true (await (await Environment.get_global("is_value?"))(v))){
                        {
                            rval=true;
                            return __BREAK__FLAG__=true;
                            return
                        }
                    }
                };
                let __array__247=[],__elements__245=vals;
                let __BREAK__FLAG__=false;
                for(let __iter__244 in __elements__245) {
                    __array__247.push(await __for_body__246(__elements__245[__iter__244]));
                    if(__BREAK__FLAG__) {
                         __array__247.pop();
                        break;
                        
                    }
                }return __array__247;
                 
            })();
            return rval
        }
    }
},{ "name":"or*","fn_args":"[\"&\" vals]","description":["=:+","Similar to or, but unlike or, values that ","are \"\" (blank) or NaN are considered to be true.","Uses is_value? to determine if the value should be considered to be true.","Returns true if the given arguments all are considered a value, ","otherwise false.  If no arguments are provided, returns undefined."],"usage":["val0:*","val1:*","val2:*"],"tags":["truth","or","logic","truthy"],"requires":["slice","is_value?"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("either",async function(...args) {
    args=await (await Environment.get_global("slice"))(args,0);
    {
        let rval;
        rval=null;
        await (async function() {
            let __for_body__250=async function(arg) {
                rval=arg;
                if (check_true ((await (await Environment.get_global("not"))((undefined===arg))&& await (await Environment.get_global("not"))((null===arg))))){
                    {
                        return __BREAK__FLAG__=true;
                        return
                    }
                }
            };
            let __array__251=[],__elements__249=args;
            let __BREAK__FLAG__=false;
            for(let __iter__248 in __elements__249) {
                __array__251.push(await __for_body__250(__elements__249[__iter__248]));
                if(__BREAK__FLAG__) {
                     __array__251.pop();
                    break;
                    
                }
            }return __array__251;
             
        })();
        return rval
    }
},{ "name":"either","fn_args":"[\"&\" args]","description":["=:+","Similar to or, but unlike or, returns the first non nil ","or undefined value in the argument list whereas or returns ","the first truthy value."],"usage":["values:*"],"tags":["nil","truthy","logic","or","undefined"],"requires":["slice","not"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await (async function(){
    return  Environment.set_global("sanitize_js_ref_name",function(symname) {
        return   (function(){
            if (check_true ( ( Environment.get_global("not"))((symname instanceof String || typeof symname==='string')))) {
                return symname
            } else {
                {
                    let text_chars;
                    let acc;
                    text_chars=(symname).split("");
                    acc=[];
                     ( function() {
                        let __for_body__254=function(t) {
                            return   (function(){
                                if (check_true ((t==="+"))) {
                                    return (acc).push("_plus_")
                                } else if (check_true ((t==="?"))) {
                                    return (acc).push("_ques_")
                                } else if (check_true ((t==="-"))) {
                                    return (acc).push("_")
                                } else if (check_true ((t==="&"))) {
                                    return (acc).push("_amper_")
                                } else if (check_true ((t==="^"))) {
                                    return (acc).push("_carot_")
                                } else if (check_true ((t==="#"))) {
                                    return (acc).push("_hash_")
                                } else if (check_true ((t==="!"))) {
                                    return (acc).push("_exclaim_")
                                } else if (check_true ((t==="*"))) {
                                    return (acc).push("_star_")
                                } else if (check_true ((t==="~"))) {
                                    return (acc).push("_tilde_")
                                } else if (check_true ((t==="~"))) {
                                    return (acc).push("_percent_")
                                } else if (check_true ((t==="|"))) {
                                    return (acc).push("_pipe_")
                                } else if (check_true ( ( Environment.get_global("contains?"))(t,"(){}"))) {
                                    throw new LispSyntaxError(("Invalid character in symbol: "+ symname));
                                    
                                } else {
                                    return (acc).push(t)
                                }
                            } )()
                        };
                        let __array__255=[],__elements__253=text_chars;
                        let __BREAK__FLAG__=false;
                        for(let __iter__252 in __elements__253) {
                            __array__255.push( __for_body__254(__elements__253[__iter__252]));
                            if(__BREAK__FLAG__) {
                                 __array__255.pop();
                                break;
                                
                            }
                        }return __array__255;
                         
                    })();
                    return (acc).join("")
                }
            }
        } )()
    },{ "name":"sanitize_js_ref_name","fn_args":"(symname)","requires":["not","is_string?","split_by","push","contains?","join"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await Environment.set_global("is_symbol?",async function(symbol_to_find) {
    return ["=:not",["=:or",["=:==",["=:typeof",symbol_to_find],"undefined"],["=:==",["=:->","=:Environment","get_global",symbol_to_find,"=:ReferenceError"],"=:ReferenceError"]]]
},{ "eval_when":{ "compile_time":true
},"name":"is_symbol?","macro":true,"fn_args":"(symbol_to_find)","usage":["symbol:string|*"],"description":["=:+","If provided a quoted symbol, will return true if the symbol can be found ","in the local or global contexts."],"tags":["context","env","def"],"requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("defvalue",async function(sym,value,meta) {
    let meta_data;
    meta_data=await (async function(){
        if (check_true ((meta instanceof Object))){
            return meta
        } else {
            return new Object()
        }
    })();
    return ["=:let",[["=:unquoted_sym",["=:desym",sym]],["=:details",["=:describe","=:unquoted_sym"]]],["=:if","=:details",["=:->","=:Environment","get_global",["=:+","=:details.namespace","/","=:unquoted_sym"]],["=:defglobal",sym,value,meta_data]]]
},{ "eval_when":{ "compile_time":true
},"name":"defvalue","macro":true,"fn_args":"(sym value meta)","description":["=:+","If the provided symbol is already defined as an accessible ","global value from the current namespace it will return the ","defined value, otherwise it will define the global in the ","current (implicit) namespace or the explicitly referenced ","namespace.  Returns the newly defined value or previously ","defined value."],"usage":["sym:symbol|string","value:*","meta:?object"],"tags":["allocation","reference","symbol","value","set","reference","global"],"requires":["is_object?"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("defparameter",async function(sym,value,meta) {
    let meta_data;
    meta_data=await (async function(){
        if (check_true ((meta instanceof Object))){
            return meta
        } else {
            return new Object()
        }
    })();
    return ["=:first",["=:use_quoted_initializer",["=:defglobal",sym,value,meta_data]]]
},{ "eval_when":{ "compile_time":true
},"name":"defparameter","macro":true,"fn_args":"(sym value meta)","description":["=:+","Defines a global that is always reset to the provided value, ","when called or when the image is reloaded, ensuring that the ","initial value is always set to a specific value.  If the value ","is already defined, it will be overwritten.  To set a symbol in ","an explicit namespace, provide a fully qualified symbol name ","in the form of namspace/symname as the symbol to be defined. ","Returns the defined value."],"usage":["sym:symbol|string","value:*","meta:?object"],"tags":["allocation","reference","symbol","value","set","reference","global"],"requires":["is_object?"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("get_function_args",async function(f) {
    let r;
    let s;
    r=new RegExp("^[a-zA-Z_]+ [a-zA-Z ]*\\\\(([a-zA-Z 0-9_,\\\\.\\\\n]*)\\\\)","gm");
    s=await f["toString"]();
    r=await (await Environment.get_global("scan_str"))(r,s);
    if (check_true ((((r && r.length)>0)&& ((r && r["0"]) instanceof Object)))){
        {
            return await (await Environment.get_global("map"))(async function(v) {
                if (check_true (await (await Environment.get_global("ends_with?"))("\n",v))){
                    return await (await Environment.get_global("chop"))(v)
                } else {
                    return v
                }
            },((await (await Environment.get_global("second"))((r && r["0"]))|| "")).split(","))
        }
    }
},{ "name":"get_function_args","fn_args":"(f)","description":"Given a javascript function, return a list of arg names for that function","usage":["function:function"],"tags":["function","introspect","introspection","arguments"],"requires":["scan_str","is_object?","map","ends_with?","chop","split_by","second"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("findpaths",async function(value,structure) {
    let acc;
    let search;
    acc=[];
    search=async function(struct,_cpath) {
        return await async function(){
            if (check_true ((struct instanceof Array))) {
                return await (await Environment.get_global("map"))(async function(elem,idx) {
                    return await async function(){
                        if (check_true ((elem instanceof Object))) {
                            return await search(elem,await (await Environment.get_global("conj"))(_cpath,await (async function(){
                                let __array_op_rval__256=idx;
                                 if (__array_op_rval__256 instanceof Function){
                                    return await __array_op_rval__256() 
                                } else {
                                    return [__array_op_rval__256]
                                }
                            })()))
                        } else if (check_true ((elem===value))) {
                            return (acc).push(await (await Environment.get_global("conj"))(_cpath,await (async function(){
                                let __array_op_rval__257=idx;
                                 if (__array_op_rval__257 instanceof Function){
                                    return await __array_op_rval__257() 
                                } else {
                                    return [__array_op_rval__257]
                                }
                            })()))
                        }
                    } ()
                },struct)
            } else if (check_true ((struct instanceof Object))) {
                return await (await Environment.get_global("map"))(async function(pset) {
                    return await async function(){
                        if (check_true (((pset && pset["1"]) instanceof Object))) {
                            return await search((pset && pset["1"]),await (await Environment.get_global("conj"))(_cpath,await (async function(){
                                let __array_op_rval__258=(pset && pset["0"]);
                                 if (__array_op_rval__258 instanceof Function){
                                    return await __array_op_rval__258() 
                                } else {
                                    return [__array_op_rval__258]
                                }
                            })()))
                        } else if (check_true (((pset && pset["1"])===value))) {
                            return (acc).push(await (await Environment.get_global("conj"))(_cpath,await (async function(){
                                let __array_op_rval__259=(pset && pset["1"]);
                                 if (__array_op_rval__259 instanceof Function){
                                    return await __array_op_rval__259() 
                                } else {
                                    return [__array_op_rval__259]
                                }
                            })()))
                        }
                    } ()
                },await (await Environment.get_global("pairs"))(struct))
            } else if (check_true ((struct===value))) {
                return (acc).push(_cpath)
            }
        } ()
    };
    await search(structure,[]);
    return acc
},{ "name":"findpaths","fn_args":"(value structure)","requires":["is_array?","map","is_object?","conj","push","pairs"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("warn",await (async function(){
     return await (await Environment.get_global("defclog"))({
        prefix:"⚠️  "
    }) 
})(),{
    description:"Prefixes a warning symbol prior to the arguments to the console.  Otherwise the same as console.log.",usage:["args0:*","argsN:*"],tags:["log","warning","error","signal","output","notify","defclog"],initializer:await (async function(){
         return ["=:defclog",{ "prefix":"⚠️  "
    }] 
})(),requires:["defclog"],requires:["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],source_name:"core.lisp"
});
await Environment.set_global("success",await (async function(){
     return await (await Environment.get_global("defclog"))({
        color:"green",prefix:"✓  "
    }) 
})(),{
    description:"Prefixes a green checkmark symbol prior to the arguments to the console.  Otherwise the same as console.log.",usage:["args0:*","argsN:*"],tags:["log","warning","notify","signal","output","ok","success","defclog"],initializer:await (async function(){
         return ["=:defclog",{ "color":"green","prefix":"✓  "
    }] 
})(),requires:["defclog"],requires:["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],source_name:"core.lisp"
});
await Environment.set_global("in_background",async function(...args) {
    let forms;
    forms=await (await Environment.get_global("slice"))(args,0);
    return ["=:new","=:Promise",["=:fn",["=:resolve","=:reject"],["=:progn",["=:resolve",true],].concat(forms)]]
},{ "eval_when":{ "compile_time":true
},"name":"in_background","macro":true,"fn_args":"[\"&\" forms]","description":["=:+","Given a form or forms, evaluates the forms in the background, with ","the function returning true immediately prior to starting the forms."],"usage":["forms:*"],"tags":["eval","background","promise","evaluation"],"requires":["slice"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("set_compiler",async function(compiler_function) {
    await Environment["set_compiler"].call(Environment,compiler_function);
    return compiler_function
},{ "name":"set_compiler","fn_args":"(compiler_function)","description":["=:+","Given a compiled compiler function, installs the provided function as the ","environment's compiler, and returns the compiler function."],"usage":["compiler_function:function"],"tags":["compilation","environment","compiler"],"requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("show",async function(thing) {
    return await async function(){
        if (check_true (thing instanceof Function)) {
            return await thing["toString"]()
        } else {
            return thing
        }
    } ()
},{ "name":"show","fn_args":"(thing)","usage":["thing:function"],"description":"Given a name to a compiled function, returns the source of the compiled function.  Otherwise just returns the passed argument.","tags":["compile","source","javascript","js","display"],"requires":["is_function?"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("export_symbols",async function(...args) {
    args=await (await Environment.get_global("slice"))(args,0);
    {
        let acc;
        let numargs;
        let idx;
        acc=await (async function(){
             return ["=:javascript","export","{"] 
        })();
        numargs=await (await Environment.get_global("length"))(args);
        idx=0;
        await (async function() {
            let __for_body__262=async function(symname) {
                await async function(){
                    if (check_true (((symname instanceof Array)&& ((symname && symname.length)===2)))) {
                        {
                            (acc).push(await (async function(){
                                let mval;
                                mval=(symname && symname["0"]);
                                if (check_true (((mval instanceof String || typeof mval==='string')&& await (await Environment.get_global("starts_with?"))("=:",mval)))){
                                    return await mval["substr"].call(mval,2)
                                } else {
                                    return mval
                                }
                            })());
                            (acc).push(" as ");
                            return (acc).push(await (async function(){
                                let mval;
                                mval=(symname && symname["1"]);
                                if (check_true (((mval instanceof String || typeof mval==='string')&& await (await Environment.get_global("starts_with?"))("=:",mval)))){
                                    return await mval["substr"].call(mval,2)
                                } else {
                                    return mval
                                }
                            })())
                        }
                    } else if (check_true ((symname instanceof String || typeof symname==='string'))) {
                        (acc).push(await (async function(){
                            let mval;
                            mval=symname;
                            if (check_true (((mval instanceof String || typeof mval==='string')&& await (await Environment.get_global("starts_with?"))("=:",mval)))){
                                return await mval["substr"].call(mval,2)
                            } else {
                                return mval
                            }
                        })())
                    } else {
                        throw new SyntaxError("Invalid argument for export");
                        
                    }
                } ();
                idx+=1;
                if (check_true ((idx<numargs))){
                    return (acc).push(", ")
                }
            };
            let __array__263=[],__elements__261=args;
            let __BREAK__FLAG__=false;
            for(let __iter__260 in __elements__261) {
                __array__263.push(await __for_body__262(__elements__261[__iter__260]));
                if(__BREAK__FLAG__) {
                     __array__263.pop();
                    break;
                    
                }
            }return __array__263;
             
        })();
        (acc).push("}");
        return acc
    }
},{ "eval_when":{ "compile_time":true
},"name":"export_symbols","macro":true,"fn_args":"[\"&\" args]","usage":["arg0:string|array","argN:string|array"],"description":["=:+","The export_symbols macro facilitates the Javascript module export functionality.  ","To make available defined lisp symbols from the current module the export_symbols ","macro is called with it's arguments being either the direct symbols or, if an ","argument is an array, the first is the defined symbol within the lisp environment ","or current module and the second element in the array is the name to be exported ","as.  For example: <br> ","(export lisp_symbol1 lisp_symbol2) ;; exports lisp_symbol1 and lisp_symbol2 directly. <br>","(export (lisp_symbol1 external_name)) ;; exports lisp_symbol1 as 'external_name`. <br>","(export (initialize default) symbol2) ;; exports initialize as default and symbol2 as itself."],"tags":["env","enviroment","module","export","import","namespace","scope"],"requires":["slice","length","is_array?","push","is_string?","starts_with?"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("register_feature",async function(feature) {
    if (check_true (await (await Environment.get_global("not"))(await (await Environment.get_global("contains?"))(feature,(await Environment.get_global("*env_config*.features")))))){
        {
            ((await Environment.get_global("*env_config*.features"))).push(feature);
            return true
        }
    } else {
        return false
    }
},{ "name":"register_feature","fn_args":"(feature)","description":"Adds the provided string to the *env_config* features.  Features are used to mark what functionality is present in the environment.","tags":["environment","modules","libraries","namespaces"],"usage":["feature:string"],"requires":["not","contains?","*env_config*","push"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("object_methods",async function(obj) {
    let properties;
    let current_obj;
    properties=new Set();
    current_obj=obj;
    await (async function(){
         let __body_ref__265=async function() {
            await (await Environment.get_global("map"))(async function(item) {
                return await properties["add"].call(properties,item)
            },await Object.getOwnPropertyNames(current_obj));
            return current_obj=await Object.getPrototypeOf(current_obj)
        };
        let __BREAK__FLAG__=false;
        while(current_obj) { await __body_ref__265();
         if(__BREAK__FLAG__) {
             break;
            
        }
    } ;
    
})();
return await (async function() {
    {
         let __call_target__=await Array.from(await properties["keys"]()), __call_method__="filter";
        return await __call_target__[__call_method__].call(__call_target__,async function(item) {
            return item instanceof Function
        })
    } 
})()
},{ "name":"object_methods","fn_args":"(obj)","description":"Given a instantiated object, get all methods (functions) that the object and it's prototype chain contains.","usage":["obj:object"],"tags":["object","methods","functions","introspection","keys"],"requires":["map","is_function?"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("uniq",async function(values) {
    let s;
    s=new Set();
    await (await Environment.get_global("map"))(async function(x) {
        return await s["add"].call(s,x)
    },(values|| []));
    return await (await Environment.get_global("to_array"))(s)
},{ "name":"uniq","fn_args":"(values)","description":["=:+","Given a list of values, returns a new list with unique, deduplicated values. ","If the values list contains complex types such as objects or arrays, set the ","handle_complex_types argument to true so they are handled appropriately. "],"usage":["values:list"],"tags":["list","dedup","duplicates","unique","values"],"requires":["map","to_array"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("time_in_millis",async function() {
    return ["=:Date.now"]
},{ "eval_when":{ "compile_time":true
},"name":"time_in_millis","macro":true,"fn_args":"[]","usage":[],"tags":["time","milliseconds","number","integer","date"],"description":"Returns the current time in milliseconds as an integer","requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("defns",async function(name,options) {
    if (check_true ((options&& (options && options["ignore_if_exists"])&& (name instanceof String || typeof name==='string')&& await (await Environment.get_global("contains?"))(name,await (await Environment.get_global("namespaces"))())))){
        return name
    } else {
        return await (await Environment.get_global("create_namespace"))(name,options)
    }
},{ "name":"defns","fn_args":"(name options)","usage":["name:string","options:object"],"description":["=:+","Given a name and an optional options object, creates a new namespace ","identified by the name argument.  If the options object is provided, the following keys are available:","<br>","ignore_if_exists:boolean:If set to true, if the namespace is already defined, do not return an error ","and instead just return with the name of the requested namespace. Any other options are ignored and ","the existing namespace isn't altered.","contained:boolean:If set to true, the newly defined namespace will not have visibility to other namespaces ","beyond 'core' and itself.  Any fully qualified symbols that reference other non-core namespaces will ","fail.","serialize_with_image:boolean:If set to false, if the environment is saved, the namespace will not be ","included in the saved image file.  Default is true."],"tags":["namespace","environment","define","scope","context"],"requires":["is_string?","contains?","namespaces","create_namespace"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("use_ns",async function(name) {
    return ["=:set_namespace",["=:desym",name]]
},{ "eval_when":{ "compile_time":true
},"name":"use_ns","macro":true,"fn_args":"(name)","usage":["name:symbol"],"description":"Sets the current namespace to the provided name.  Returns the name of the new namespace if succesful, otherwise an Eval error is thrown","tags":["namespace","environment","scope","change","set"],"requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("bind_and_call",async function(...args) {
    let target_object;
    let this_object;
    let method;
    target_object=(args && args["0"]);
    this_object=(args && args["1"]);
    method=(args && args["2"]);
    args=await (await Environment.get_global("slice"))(args,3);
    {
        let boundf=await (await Environment.get_global("bind"))(target_object[method],this_object);
        ;
        if (check_true (boundf)){
            return await (async function(){
                return ( boundf).apply(this,args)
            })()
        } else {
            throw new Error("unable to bind target_object");
            
        }
    }
},{ "name":"bind_and_call","fn_args":"(target_object this_object method \"&\" args)","usage":["target_object:object","this_object:object","method:string","args0:*","argsn:*"],"description":"Binds the provided method of the target object with the this_object context, and then calls the object method with the optional provided arguments.","tags":["bind","object","this","context","call"],"requires":["slice","bind"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await (async function(){
    return  Environment.set_global("clamp",function(value,min,max) {
        return  Math.min( Math.max(min,value),max)
    },{ "name":"clamp","fn_args":"(value min max)","description":["=:+","Given a numeric value, along with minimum and maximum values for the provided value, ","the function will return the value if between the bounding values, otherwise ","the closest bounding value will be returned.  If the value is above the provided ","maximum, then the maximum will be returned.  If the value is below the minimum, then ","the minimum value is returned."],"tags":["value","number","min","max","bounds","boundary","range"],"usage":["value:number","min:number","max:number"],"requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await Environment.set_global("document",new Object(),{
    requires:[],externals:["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],source_name:"core.lisp"
});
await Environment.set_global("save_locally",async function(fname,data,content_type) {
    if (check_true (window["document"])){
        {
            let blob;
            let elem;
            let dbody;
            blob=new Blob(await (async function(){
                let __array_op_rval__268=data;
                 if (__array_op_rval__268 instanceof Function){
                    return await __array_op_rval__268() 
                } else {
                    return [__array_op_rval__268]
                }
            })(),{
                type:content_type
            });
            elem=await (async function() {
                {
                     let __call_target__=window["document"], __call_method__="createElement";
                    return await __call_target__[__call_method__].call(__call_target__,"a")
                } 
            })();
            dbody=await (async function(){
                let __targ__269=(await Environment.get_global("document"));
                if (__targ__269){
                     return(__targ__269)["body"]
                } 
            })();
            ;
            await async function(){
                elem["href"]=await window.URL["createObjectURL"].call(window.URL,blob);
                elem["download"]=fname;
                return elem;
                
            }();
            await dbody["appendChild"].call(dbody,elem);
            await elem["click"]();
            await dbody["removeChild"].call(dbody,elem);
            return true
        }
    } else {
        return false
    }
},{ "name":"save_locally","fn_args":"(fname data content_type)","description":["=:+","Provided a filename, a data buffer, and a MIME type, such as \"text/javascript\", ","triggers a browser download of the provided data with the filename.  Depending ","on the browser configuration, the data will be saved to the configured ","user download directory, or prompt the user for a save location. "],"usage":["filename:string","data:*","content_type:string"],"tags":["save","download","browser"],"requires":["document"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await (await Environment.get_global("undefine"))("document");
await Environment.set_global("fetch_text",async function(url) {
    let resp;
    resp=await fetch(url);
    if (check_true ((resp && resp["ok"]))){
        return await resp["text"]()
    } else {
        throw new EvalError(("unable to fetch "+ url+ ": "+ (resp && resp["status"])+ ": "+ (resp && resp["statusText"])));
        
    }
},{ "name":"fetch_text","fn_args":"(url)","description":["=:+","Given a url, returns the text content of that url. ","This function is a helper function for the import macro."],"usage":["url:string"],"tags":["fetch","text","string"],"requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("import",async function(...args) {
    args=await (await Environment.get_global("slice"))(args,0);
    {
        let filespec;
        let is_url_ques_;
        let js_mode;
        let url_comps;
        let js_mod;
        let load_fn;
        let target_symbols;
        let target_path;
        let acc;
        filespec=await (await Environment.get_global("last"))(args);
        is_url_ques_=await (await Environment.get_global("contains?"))("://",filespec);
        js_mode=null;
        url_comps=null;
        js_mod=null;
        load_fn=null;
        target_symbols=await (async function(){
            if (check_true (((args && args.length)>1))){
                return (args && args["0"])
            }
        })();
        target_path=null;
        acc=[];
        await async function(){
            if (check_true ((is_url_ques_|| await (await Environment.get_global("not"))((null==location))))) {
                {
                    load_fn="fetch_text";
                    url_comps=await (async function(){
                         return await async function(){
                            if (check_true (is_url_ques_)) {
                                return new URL(filespec)
                            } else if (check_true (await (await Environment.get_global("starts_with?"))("/",filespec))) {
                                return new URL((""+ location["origin"]+ filespec))
                            } else {
                                return new URL((""+ location["href"]+ "/"+ filespec))
                            }
                        } () 
                    })();
                    return target_path=(url_comps && url_comps["pathname"])
                }
            } else if (check_true (await (await Environment.get_global("not"))(((typeof "read_text_file"==="undefined")|| (await Environment["get_global"].call(Environment,"read_text_file",ReferenceError)===ReferenceError))))) {
                {
                    load_fn="read_text_file";
                    return target_path=filespec
                }
            } else {
                throw new EvalError(("unable to handle import of "+ filespec));
                
            }
        } ();
        return await async function(){
            if (check_true ((await (await Environment.get_global("ends_with?"))(".lisp",target_path)|| await (await Environment.get_global("ends_with?"))(".juno",target_path)))) {
                return ["=:evaluate",[await (async function(){
                     return ("=:"+ load_fn) 
                })(),filespec],"=:nil",["=:to_object",[["source_name",filespec],["throw_on_error",true]]]]
            } else if (check_true (await (await Environment.get_global("ends_with?"))(".json",target_path))) {
                return ["=:evaluate",["=:JSON.parse",[await (async function(){
                     return ("=:"+ load_fn) 
                })(),filespec]],"=:nil",["=:to_object",[["json_in",true],["source_name",filespec],["throw_on_error",true]]]]
            } else if (check_true ((await (await Environment.get_global("ends_with?"))(".js",target_path)|| (await (await Environment.get_global("not"))(((typeof "Deno"==="undefined")|| (await Environment["get_global"].call(Environment,"Deno",ReferenceError)===ReferenceError)))&& await (await Environment.get_global("ends_with?"))(".ts",target_path))))) {
                {
                    return await async function(){
                        if (check_true ((await (await Environment.get_global("length"))(target_symbols)===0))) {
                            throw new SyntaxError("imports of javascript sources require binding symbols as the first argument");
                            
                        } else if (check_true ((target_symbols instanceof Array))) {
                            {
                                (acc).push(await (async function(){
                                     return ["=:defglobal",(target_symbols && target_symbols["0"]),["=:dynamic_import",filespec],{ "is_import":true,"initializer":["=:quotem",["=:import",].concat(args)]
                                }] 
                            })());
                            (acc).push(await (async function(){
                                 return ["=:set_path",["imports",["=:+",await (await Environment.get_global("current_namespace"))(),"/",["=:desym",(target_symbols && target_symbols["0"])]]],"=:*env_config*",["=:to_object",[["symbol",["=:desym",(target_symbols && target_symbols["0"])]],["namespace",await (await Environment.get_global("current_namespace"))()],["location",filespec]]]] 
                            })());
                            (acc).push(await (async function(){
                                 return ["=:when",["=:prop",(target_symbols && target_symbols["0"]),"initializer"],["=:->",(target_symbols && target_symbols["0"]),"initializer","=:Environment"]] 
                            })());
                            (acc).push((target_symbols && target_symbols["0"]));
                            return ["=:iprogn",].concat(acc)
                        }
                    }
                } ()
            }
        } else {
            throw new EvalError("invalid extension: needs to be .lisp, .js, .json or .juno");
            
        }
    } ()
}
},{ "eval_when":{ "compile_time":true
},"name":"import","macro":true,"fn_args":"[\"&\" args]","description":["=:+","Dynamically load the contents of the specified source file (including ","path) into the Lisp environment in the current namespace.<br>If the file is a ","Lisp source, it will be evaluated as part of the load and the final result ","returned.  <br>If the file is a JS source, it will be loaded into the ","environment and a handle returned.  When importing non-Lisp sources (javascript ","or typescript), import requires a binding symbol in an array as the first ","argument.  <br>The allowed extensions are `.lisp`, `.js`, `.json`, `.juno`, and ","if the JS platform is Deno, `.ts` is allowed.  Otherwise an `EvalError` will be ","thrown due to a non-handled file type.<br><br>#### Examples - Server ","<br><br>When on a server instance the path can be relative:```(import ","\"tests/compiler_tests.lisp\")```<br><br>For a remote Javascript/Typescript ","resource:```(import (logger) ","\"https://deno.land/std@0.148.0/log/mod.ts\")```<br><br>For a local ","Javascript/Typescript resource:```(import (logger) ","\"/absolute/path/to/library.js\")\n```<br><br>Note that this is a dynamic import. ","<br><br>#### Example - Browser <br><br>With the browser, to import, the ","environment should be hosted for access to served resources:```(import ","\"/pkg/doc_generation.juno\")```<br><br><br> "],"tags":["compile","read","io","file","get","fetch","load","dynamic_import"],"usage":["binding_symbols:array","filename:string"],"requires":["slice","last","contains?","not","starts_with?","ends_with?","length","is_array?","push","current_namespace"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("system_date_format",{
    weekday:"long",year:"numeric",month:"2-digit",day:"2-digit",hour:"numeric",minute:"numeric",second:"numeric",fractionalSecondDigits:3,hourCycle:"h24",hour12:false,timeZoneName:"short"
},{
    description:("The system date format structure that is used by the system_date_formatter."+ "If modified, the system_date_formatter, which is a Intl.DateTimeFormat object "+ "should be reinitialized by calling (new Intl.DateTimeFormat [] system_date_format)."),tags:["time","date","system"],requires:["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],source_name:"core.lisp"
});
await Environment.set_global("system_date_formatter",new Intl.DateTimeFormat([],(await Environment.get_global("system_date_format"))),{
    initializer:await (async function(){
         return ["=:new","=:Intl.DateTimeFormat",[],(await Environment.get_global("system_date_format"))] 
    })(),tags:["time","date","system"],description:"The instantiation of the system_date_format.  See system_date_format for additional information.",requires:["system_date_format"],requires:["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],source_name:"core.lisp"
});
await Environment.set_global("tzoffset",async function() {
    return (60* await (async function() {
        {
             let __call_target__=new Date(), __call_method__="getTimezoneOffset";
            return await __call_target__[__call_method__]()
        } 
    })())
},{ "name":"tzoffset","fn_args":"[]","description":"Returns the number of seconds the local timezone is offset from GMT","usage":[],"tags":["time","date","timezone"],"requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("date_components",async function(date_value,date_formatter) {
    if (check_true (await (await Environment.get_global("is_date?"))(date_value))){
        return await (await Environment.get_global("to_object"))(await (async function(){
             return await (await Environment.get_global("map"))(async function(x) {
                return await (async function(){
                    let __array_op_rval__271=(x && x["type"]);
                     if (__array_op_rval__271 instanceof Function){
                        return await __array_op_rval__271((x && x["value"])) 
                    } else {
                        return [__array_op_rval__271,(x && x["value"])]
                    }
                })()
            },await (async function(){
                if (check_true (date_formatter)){
                    return await (await Environment.get_global("bind_and_call"))(date_formatter,date_formatter,"formatToParts",date_value)
                } else {
                    return await (await Environment.get_global("bind_and_call"))((await Environment.get_global("system_date_formatter")),(await Environment.get_global("system_date_formatter")),"formatToParts",date_value)
                }
            })()) 
        })())
    } else {
        return null
    }
},{ "name":"date_components","fn_args":"(date_value date_formatter)","usage":["date_value:Date","date_formatter:DateTimeFormat?"],"description":"Given a date value, returns an object containing a the current time information broken down by time component. Optionally pass a Intl.DateTimeFormat object as a second argument.","tags":["date","time","object","component"],"requires":["is_date?","to_object","map","bind_and_call","system_date_formatter"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("formatted_date",async function(dval,date_formatter) {
    let comps;
    comps=await (async function(){
         return await (await Environment.get_global("date_components"))(dval,date_formatter) 
    })();
    if (check_true (comps)){
        if (check_true (date_formatter)){
            return (await (await Environment.get_global("values"))(comps)).join("")
        } else {
            return (""+ (comps && comps["year"])+ "-"+ (comps && comps["month"])+ "-"+ (comps && comps["day"])+ " "+ (comps && comps["hour"])+ ":"+ (comps && comps["minute"])+ ":"+ (comps && comps["second"]))
        }
    } else {
        return null
    }
},{ "name":"formatted_date","fn_args":"(dval date_formatter)","usage":["dval:Date","date_formatter:DateTimeFormat?"],"description":"Given a date object, return a formatted string in the form of: \"yyyy-MM-d HH:mm:ss\".  Optionally pass a Intl.DateTimeFormat object as a second argument.","tags":["date","format","time","string"],"requires":["date_components","join","values"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("*LANGUAGE*",new Object(),{
    requires:[],externals:["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],source_name:"core.lisp"
});
await (async function(){
    return  Environment.set_global("dtext",function(default_text) {
        return ( ( function(){
            let __targ__272=( Environment.get_global("*LANGUAGE*"));
            if (__targ__272){
                 return(__targ__272)[default_text]
            } 
        })()|| default_text)
    },{ "name":"dtext","fn_args":"(default_text)","usage":["text:string","key:string?"],"description":["=:+","Given a default text string and an optional key, if a key ","exists in the global object *LANGUAGE*, return the text associated with the key. ","If no key is provided, attempts to find the default text as a key in the *LANGUAGE* object. ","If that is a nil entry, returns the default text."],"tags":["text","multi-lingual","language","translation","translate"],"requires":["*LANGUAGE*"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await Environment.set_global("nth",async function(idx,collection) {
    return await async function(){
        if (check_true ((idx instanceof Array))) {
            return await (await Environment.get_global("map"))(async function(v) {
                return await (await Environment.get_global("nth"))(v,collection)
            },idx)
        } else if (check_true ((await (await Environment.get_global("is_number?"))(idx)&& (idx<0)&& (await (await Environment.get_global("length"))(collection)>=(-1* idx))))) {
            return collection[await (await Environment.get_global("add"))(await (await Environment.get_global("length"))(collection),idx)]
        } else if (check_true ((await (await Environment.get_global("is_number?"))(idx)&& (idx<0)&& (await (await Environment.get_global("length"))(collection)<(-1* idx))))) {
            return undefined
        } else {
            return collection[idx]
        }
    } ()
},{ "name":"nth","fn_args":"(idx collection)","description":["=:+","Based on the index or index list passed as the first argument, ","and a collection as a second argument, return the specified values ","from the collection. If an index value is negative, the value ","retrieved will be at the offset starting from the end of the array, ","i.e. -1 will return the last value in the array."],"tags":["filter","select","pluck","object","list","key","array"],"usage":["idx:string|number|array","collection:list|object"],"requires":["is_array?","map","nth","is_number?","length","add"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await (async function(){
    return  Environment.set_global("max_index",function(container) {
        return  Math.max(0,( ( Environment.get_global("length"))(container)- 1))
    },{ "name":"max_index","fn_args":"(container)","description":["=:+","Given a container, typically an Array or derivative, ","return the max index value, calculated as length - 1.<br>"],"usage":["container:array"],"tags":["length","array","container","max","index","range","limit"],"requires":["length"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await (async function(){
    return  Environment.set_global("decode_text",function(buffer) {
        return  ( function() {
            {
                 let __call_target__=new TextDecoder(), __call_method__="decode";
                return  __call_target__[__call_method__].call(__call_target__,buffer)
            } 
        })()
    },{ "name":"decode_text","fn_args":"(buffer)","description":"Given a source buffer, such as a Uint8Array, decode into utf-8 text.","usage":["buffer:ArrayBuffer"],"tags":["decode","encode","string","array","text"],"requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await (async function(){
    return  Environment.set_global("encode_text",function(text) {
        return  ( function() {
            {
                 let __call_target__=new TextEncoder(), __call_method__="encode";
                return  __call_target__[__call_method__].call(__call_target__,text)
            } 
        })()
    },{ "name":"encode_text","fn_args":"(text)","description":"Given a source buffer, such as a Uint8Array, decode into utf-8 text.","usage":["buffer:ArrayBuffer"],"tags":["decode","encode","string","array","text"],"requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await Environment.set_global("hostname",async function() {
    return await Deno.hostname()
},{ "name":"hostname","fn_args":"[]","description":"Returns the hostname of the system the environment is running on.","usage":[],"tags":["hostname","server","environment"],"requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("use_symbols",async function(namespace,symbol_list,target_namespace) {
    let acc;
    let nspace;
    let nspace_handle;
    let decs;
    acc=await (async function(){
         return ["=:progn"] 
    })();
    nspace=await (async function(){
        if (check_true (namespace)){
            {
                let mval;
                mval=namespace;
                if (check_true (((mval instanceof String || typeof mval==='string')&& await (await Environment.get_global("starts_with?"))("=:",mval)))){
                    return await mval["substr"].call(mval,2)
                } else {
                    return mval
                }
            }
        }
    })();
    nspace_handle=null;
    decs=null;
    nspace_handle=await Environment["get_namespace_handle"].call(Environment,nspace);
    await (async function() {
        let __for_body__275=async function(sym) {
            decs=await (async function(){
                let __targ__277=(nspace_handle && nspace_handle["definitions"]);
                if (__targ__277){
                     return(__targ__277)[await (async function(){
                        let mval;
                        mval=sym;
                        if (check_true (((mval instanceof String || typeof mval==='string')&& await (await Environment.get_global("starts_with?"))("=:",mval)))){
                            return await mval["substr"].call(mval,2)
                        } else {
                            return mval
                        }
                    })()]
                } 
            })();
            return (acc).push(await (async function(){
                 return ["=:defglobal",await (async function(){
                    let mval;
                    mval=sym;
                    if (check_true (((mval instanceof String || typeof mval==='string')&& await (await Environment.get_global("starts_with?"))("=:",mval)))){
                        return await mval["substr"].call(mval,2)
                    } else {
                        return mval
                    }
                })(),await (async function(){
                     return ("=:"+ nspace+ "/"+ await (async function(){
                        let mval;
                        mval=sym;
                        if (check_true (((mval instanceof String || typeof mval==='string')&& await (await Environment.get_global("starts_with?"))("=:",mval)))){
                            return await mval["substr"].call(mval,2)
                        } else {
                            return mval
                        }
                    })()) 
                })(),["=:to_object",[["initializer",["=:quotem",["=:pend_load",nspace,await (async function(){
                     return (target_namespace|| await (await Environment.get_global("current_namespace"))()) 
                })(),await (async function(){
                    let mval;
                    mval=sym;
                    if (check_true (((mval instanceof String || typeof mval==='string')&& await (await Environment.get_global("starts_with?"))("=:",mval)))){
                        return await mval["substr"].call(mval,2)
                    } else {
                        return mval
                    }
                })(),await (async function(){
                     return ("=:"+ nspace+ "/"+ await (async function(){
                        let mval;
                        mval=sym;
                        if (check_true (((mval instanceof String || typeof mval==='string')&& await (await Environment.get_global("starts_with?"))("=:",mval)))){
                            return await mval["substr"].call(mval,2)
                        } else {
                            return mval
                        }
                    })()) 
                })()]]],["=:quotem",["require_ns",nspace]],["=:quotem",["requires",[await (async function(){
                     return (""+ nspace+ "/"+ await (async function(){
                        let mval;
                        mval=sym;
                        if (check_true (((mval instanceof String || typeof mval==='string')&& await (await Environment.get_global("starts_with?"))("=:",mval)))){
                            return await mval["substr"].call(mval,2)
                        } else {
                            return mval
                        }
                    })()) 
                })()]]],["eval_when",await (async function(){
                     return ((decs&& decs["eval_when"])|| new Object()) 
                })()]]]] 
            })())
        };
        let __array__276=[],__elements__274=symbol_list;
        let __BREAK__FLAG__=false;
        for(let __iter__273 in __elements__274) {
            __array__276.push(await __for_body__275(__elements__274[__iter__273]));
            if(__BREAK__FLAG__) {
                 __array__276.pop();
                break;
                
            }
        }return __array__276;
         
    })();
    return acc
},{ "eval_when":{ "compile_time":true
},"name":"use_symbols","macro":true,"fn_args":"(namespace symbol_list target_namespace)","description":["=:+","Given a namespace and an array of symbols (quoted or unquoted), ","the macro will faciltate the binding of the symbols into the ","current namespace."],"usage":["namespace:string|symbol","symbol_list:array","target_namespace?:string"],"tags":["namespace","binding","import","use","symbols"],"requires":["is_string?","starts_with?","push","current_namespace"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("use_unique_symbols",async function(namespace) {
    if (check_true ((namespace instanceof String || typeof namespace==='string'))){
        {
            let symlist;
            symlist=await Environment["evaluate"].call(Environment,("("+ namespace+ "/symbols { `unique: true })"));
            (await Environment.eval(await async function(){
                return ["=:use_symbols",namespace,symlist]
            }(),null));
            return await (await Environment.get_global("length"))(symlist)
        }
    } else {
        throw new EvalError("provided namespace must be a string");
        
    }
},{ "name":"use_unique_symbols","fn_args":"(namespace)","description":["=:+","This function binds all symbols unique to the provided ","namespace identifier into the current namespace. Returns ","the amount of symbol bound."],"usage":["namespace:string"],"tags":["namespace","binding","import","use","symbols"],"requires":["is_string?","length"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("sort_dependencies",async function() {
    let ordered;
    let ns;
    let symname;
    let ns_marker;
    let symbol_marker;
    let splice_before;
    let current_pos;
    ordered=[];
    ns=null;
    symname=null;
    ns_marker=function(ns) {
        return ("*NS:"+ ns)
    };
    symbol_marker=function(ns,symbol_name) {
        return (""+ ns+ "/"+ symbol_name)
    };
    splice_before=async function(target_name,value_to_insert) {
        let idx;
        let value_idx;
        idx=await (await Environment.get_global("index_of"))(target_name,ordered);
        value_idx=await (await Environment.get_global("index_of"))(value_to_insert,ordered);
        return await async function(){
            if (check_true (((value_idx>-1)&& (value_idx===idx)))) {
                return true
            } else if (check_true (((value_idx>-1)&& (value_idx<idx)))) {
                return true
            } else if (check_true (((idx>-1)&& (value_idx===-1)))) {
                return await ordered["splice"].call(ordered,idx,0,value_to_insert)
            } else if (check_true (((idx===-1)&& (value_idx>-1)))) {
                return (ordered).push(target_name)
            } else if (check_true ((idx===-1))) {
                {
                    (ordered).push(value_to_insert);
                    return (ordered).push(target_name)
                }
            } else if (check_true (((idx>-1)&& (value_idx>-1)&& (idx<value_idx)))) {
                {
                    await ordered["splice"].call(ordered,value_idx,1);
                    return await ordered["splice"].call(ordered,idx,0,value_to_insert)
                }
            } else {
                return await console.log("fall through: target: ",target_name,"@",idx,"  ",value_to_insert,"@",value_idx)
            }
        } ()
    };
    current_pos=null;
    await (async function() {
        let __for_body__280=async function(name) {
            ns=await Environment["get_namespace_handle"].call(Environment,name);
            return await (async function() {
                let __for_body__284=async function(pset) {
                    {
                        let __symname__286= async function(){
                            return (pset && pset["0"])
                        };
                        let symdef;
                        {
                            let symname=await __symname__286();
                            ;
                            symdef=(pset && pset["1"]);
                            return await async function(){
                                if (check_true ((symdef && symdef["requires"]))) {
                                    return await (async function() {
                                        let __for_body__289=async function(req) {
                                            {
                                                let _expr_17202;
                                                let req_sym;
                                                let req_ns;
                                                let explicit;
                                                _expr_17202=await (async function(){
                                                     return await (await Environment.get_global("decomp_symbol"))(req) 
                                                })();
                                                req_sym=(_expr_17202 && _expr_17202["0"]);
                                                req_ns=(_expr_17202 && _expr_17202["1"]);
                                                explicit=(_expr_17202 && _expr_17202["2"]);
                                                if (check_true (req_ns)){
                                                    {
                                                        return await splice_before(await symbol_marker(name,symname),await symbol_marker(req_ns,req_sym))
                                                    }
                                                }
                                            }
                                        };
                                        let __array__290=[],__elements__288=(symdef && symdef["requires"]);
                                        let __BREAK__FLAG__=false;
                                        for(let __iter__287 in __elements__288) {
                                            __array__290.push(await __for_body__289(__elements__288[__iter__287]));
                                            if(__BREAK__FLAG__) {
                                                 __array__290.pop();
                                                break;
                                                
                                            }
                                        }return __array__290;
                                         
                                    })()
                                } else {
                                    {
                                        if (check_true ((await (await Environment.get_global("index_of"))(await symbol_marker(name,symname),ordered)===-1))){
                                            {
                                                return (ordered).push(await symbol_marker(name,symname))
                                            }
                                        }
                                    }
                                }
                            } ()
                        }
                    }
                };
                let __array__285=[],__elements__283=await (await Environment.get_global("pairs"))((ns && ns["definitions"]));
                let __BREAK__FLAG__=false;
                for(let __iter__282 in __elements__283) {
                    __array__285.push(await __for_body__284(__elements__283[__iter__282]));
                    if(__BREAK__FLAG__) {
                         __array__285.pop();
                        break;
                        
                    }
                }return __array__285;
                 
            })()
        };
        let __array__281=[],__elements__279=await (await Environment.get_global("conj"))(["core"],await (async function(){
            let __collector;
            let __result;
            let __action;
            __collector=[];
            __result=null;
            __action=async function(name) {
                if (check_true (await (await Environment.get_global("not"))((name==="core")))){
                    {
                        return name
                    }
                }
            };
            ;
            await (async function() {
                let __for_body__293=async function(__item) {
                    __result=await __action(__item);
                    if (check_true (__result)){
                        return (__collector).push(__result)
                    }
                };
                let __array__294=[],__elements__292=await (await Environment.get_global("namespaces"))();
                let __BREAK__FLAG__=false;
                for(let __iter__291 in __elements__292) {
                    __array__294.push(await __for_body__293(__elements__292[__iter__291]));
                    if(__BREAK__FLAG__) {
                         __array__294.pop();
                        break;
                        
                    }
                }return __array__294;
                 
            })();
            return __collector
        })());
        let __BREAK__FLAG__=false;
        for(let __iter__278 in __elements__279) {
            __array__281.push(await __for_body__280(__elements__279[__iter__278]));
            if(__BREAK__FLAG__) {
                 __array__281.pop();
                break;
                
            }
        }return __array__281;
         
    })();
    return {
        namespaces:await (async function(){
            let acc;
            acc=[];
            {
                let __collector;
                let __result;
                let __action;
                __collector=[];
                __result=null;
                __action=async function(sym) {
                    let _expr_21557;
                    let nspace;
                    _expr_21557=await (async function(){
                         return await (await Environment.get_global("decomp_symbol"))(sym) 
                    })();
                    sym=(_expr_21557 && _expr_21557["0"]);
                    nspace=(_expr_21557 && _expr_21557["1"]);
                    if (check_true (await (await Environment.get_global("not"))(await (await Environment.get_global("contains?"))(nspace,acc)))){
                        {
                            (acc).push(nspace);
                            return nspace
                        }
                    }
                };
                ;
                await (async function() {
                    let __for_body__297=async function(__item) {
                        __result=await __action(__item);
                        if (check_true (__result)){
                            return (__collector).push(__result)
                        }
                    };
                    let __array__298=[],__elements__296=ordered;
                    let __BREAK__FLAG__=false;
                    for(let __iter__295 in __elements__296) {
                        __array__298.push(await __for_body__297(__elements__296[__iter__295]));
                        if(__BREAK__FLAG__) {
                             __array__298.pop();
                            break;
                            
                        }
                    }return __array__298;
                     
                })();
                return __collector
            }
        })(),symbols:ordered
    }
},{ "name":"sort_dependencies","fn_args":"[]","description":["=:+","Returns an object containing two keys, `namespaces` and `symbols`, each ","being arrays that contains the needed load order to satisfy the dependencies ","for the current environment with all namespaces.  For symbols, the array is ","sorted in terms of dependencies: a symbol appearing with a higher index value ","will mean that it is dependent on symbols at a lower index value, with the ","first symbol having no dependencies, and the final element having the most ","dependencies.  For example, if the final symbol in the returned array is to be ","compiled, symbols at a lower index must be defined prior to compiling the final ","symbol.<br>The namespaces reflect the same rule: a lower indexed namespace must ","be loaded prior to a higher indexed namespace. "],"usage":[],"tags":["symbol","symbols","dependencies","requirements","order","compile"],"requires":["index_of","push","decomp_symbol","pairs","conj","not","namespaces","contains?"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("symbols_by_namespace",async function(options) {
    let ns_handle;
    ns_handle=null;
    return await (await Environment.get_global("to_object"))(await (async function() {
        let __for_body__301=async function(ns) {
            ns_handle=await Environment["get_namespace_handle"].call(Environment,ns);
            if (check_true ((options && options["include_meta"]))){
                return await (async function(){
                    let __array_op_rval__314=ns;
                     if (__array_op_rval__314 instanceof Function){
                        return await __array_op_rval__314(await (await Environment.get_global("to_object"))(await (await Environment.get_global("conj"))(await (async function() {
                            let __for_body__305=async function(pset) {
                                {
                                    let sym_name;
                                    let val;
                                    sym_name=(pset && pset["0"]);
                                    val=(pset && pset["1"]);
                                    return await (async function(){
                                        let __array_op_rval__307=sym_name;
                                         if (__array_op_rval__307 instanceof Function){
                                            return await __array_op_rval__307(await (await Environment.get_global("add"))(new Object(),await (async function(){
                                                if (check_true ((null==(val && val["type"])))){
                                                    return {
                                                        type:"Unknown!"
                                                    }
                                                } else {
                                                    return new Object()
                                                }
                                            })(),val)) 
                                        } else {
                                            return [__array_op_rval__307,await (await Environment.get_global("add"))(new Object(),await (async function(){
                                                if (check_true ((null==(val && val["type"])))){
                                                    return {
                                                        type:"Unknown!"
                                                    }
                                                } else {
                                                    return new Object()
                                                }
                                            })(),val)]
                                        }
                                    })()
                                }
                            };
                            let __array__306=[],__elements__304=await (await Environment.get_global("pairs"))((ns_handle && ns_handle["definitions"]));
                            let __BREAK__FLAG__=false;
                            for(let __iter__303 in __elements__304) {
                                __array__306.push(await __for_body__305(__elements__304[__iter__303]));
                                if(__BREAK__FLAG__) {
                                     __array__306.pop();
                                    break;
                                    
                                }
                            }return __array__306;
                             
                        })(),await (async function() {
                            let __for_body__310=async function(pset) {
                                {
                                    let sym_name;
                                    let val;
                                    sym_name=(pset && pset["0"]);
                                    val=(pset && pset["1"]);
                                    return await (async function(){
                                        let __array_op_rval__313=sym_name;
                                         if (__array_op_rval__313 instanceof Function){
                                            return await __array_op_rval__313(await (await Environment.get_global("add"))({
                                                type:await (await Environment.get_global("sub_type"))(val)
                                            },await (async function(){
                                                let it;
                                                it=await (async function(){
                                                    let __targ__312=(ns_handle && ns_handle["definitions"]);
                                                    if (__targ__312){
                                                         return(__targ__312)[sym_name]
                                                    } 
                                                })();
                                                if (check_true (it)){
                                                    return it
                                                } else {
                                                    return new Object()
                                                }
                                            })())) 
                                        } else {
                                            return [__array_op_rval__313,await (await Environment.get_global("add"))({
                                                type:await (await Environment.get_global("sub_type"))(val)
                                            },await (async function(){
                                                let it;
                                                it=await (async function(){
                                                    let __targ__312=(ns_handle && ns_handle["definitions"]);
                                                    if (__targ__312){
                                                         return(__targ__312)[sym_name]
                                                    } 
                                                })();
                                                if (check_true (it)){
                                                    return it
                                                } else {
                                                    return new Object()
                                                }
                                            })())]
                                        }
                                    })()
                                }
                            };
                            let __array__311=[],__elements__309=await (await Environment.get_global("pairs"))((ns_handle && ns_handle["context"] && ns_handle["context"]["scope"]));
                            let __BREAK__FLAG__=false;
                            for(let __iter__308 in __elements__309) {
                                __array__311.push(await __for_body__310(__elements__309[__iter__308]));
                                if(__BREAK__FLAG__) {
                                     __array__311.pop();
                                    break;
                                    
                                }
                            }return __array__311;
                             
                        })()))) 
                    } else {
                        return [__array_op_rval__314,await (await Environment.get_global("to_object"))(await (await Environment.get_global("conj"))(await (async function() {
                            let __for_body__305=async function(pset) {
                                {
                                    let sym_name;
                                    let val;
                                    sym_name=(pset && pset["0"]);
                                    val=(pset && pset["1"]);
                                    return await (async function(){
                                        let __array_op_rval__307=sym_name;
                                         if (__array_op_rval__307 instanceof Function){
                                            return await __array_op_rval__307(await (await Environment.get_global("add"))(new Object(),await (async function(){
                                                if (check_true ((null==(val && val["type"])))){
                                                    return {
                                                        type:"Unknown!"
                                                    }
                                                } else {
                                                    return new Object()
                                                }
                                            })(),val)) 
                                        } else {
                                            return [__array_op_rval__307,await (await Environment.get_global("add"))(new Object(),await (async function(){
                                                if (check_true ((null==(val && val["type"])))){
                                                    return {
                                                        type:"Unknown!"
                                                    }
                                                } else {
                                                    return new Object()
                                                }
                                            })(),val)]
                                        }
                                    })()
                                }
                            };
                            let __array__306=[],__elements__304=await (await Environment.get_global("pairs"))((ns_handle && ns_handle["definitions"]));
                            let __BREAK__FLAG__=false;
                            for(let __iter__303 in __elements__304) {
                                __array__306.push(await __for_body__305(__elements__304[__iter__303]));
                                if(__BREAK__FLAG__) {
                                     __array__306.pop();
                                    break;
                                    
                                }
                            }return __array__306;
                             
                        })(),await (async function() {
                            let __for_body__310=async function(pset) {
                                {
                                    let sym_name;
                                    let val;
                                    sym_name=(pset && pset["0"]);
                                    val=(pset && pset["1"]);
                                    return await (async function(){
                                        let __array_op_rval__313=sym_name;
                                         if (__array_op_rval__313 instanceof Function){
                                            return await __array_op_rval__313(await (await Environment.get_global("add"))({
                                                type:await (await Environment.get_global("sub_type"))(val)
                                            },await (async function(){
                                                let it;
                                                it=await (async function(){
                                                    let __targ__312=(ns_handle && ns_handle["definitions"]);
                                                    if (__targ__312){
                                                         return(__targ__312)[sym_name]
                                                    } 
                                                })();
                                                if (check_true (it)){
                                                    return it
                                                } else {
                                                    return new Object()
                                                }
                                            })())) 
                                        } else {
                                            return [__array_op_rval__313,await (await Environment.get_global("add"))({
                                                type:await (await Environment.get_global("sub_type"))(val)
                                            },await (async function(){
                                                let it;
                                                it=await (async function(){
                                                    let __targ__312=(ns_handle && ns_handle["definitions"]);
                                                    if (__targ__312){
                                                         return(__targ__312)[sym_name]
                                                    } 
                                                })();
                                                if (check_true (it)){
                                                    return it
                                                } else {
                                                    return new Object()
                                                }
                                            })())]
                                        }
                                    })()
                                }
                            };
                            let __array__311=[],__elements__309=await (await Environment.get_global("pairs"))((ns_handle && ns_handle["context"] && ns_handle["context"]["scope"]));
                            let __BREAK__FLAG__=false;
                            for(let __iter__308 in __elements__309) {
                                __array__311.push(await __for_body__310(__elements__309[__iter__308]));
                                if(__BREAK__FLAG__) {
                                     __array__311.pop();
                                    break;
                                    
                                }
                            }return __array__311;
                             
                        })()))]
                    }
                })()
            } else {
                return await (async function(){
                    let __array_op_rval__320=ns;
                     if (__array_op_rval__320 instanceof Function){
                        return await __array_op_rval__320(await (async function(){
                             return await (await Environment.get_global("sort"))(await (async function(){
                                 return await async function(){
                                    if (check_true (false)) {
                                        {
                                            {
                                                let __collector;
                                                let __result;
                                                let __action;
                                                __collector=[];
                                                __result=null;
                                                __action=async function(pset) {
                                                    let name;
                                                    let val;
                                                    name=(pset && pset["0"]);
                                                    val=(pset && pset["1"]);
                                                    if (check_true (await (async function(){
                                                        let __array_op_rval__315=(options && options["filter_by"]);
                                                         if (__array_op_rval__315 instanceof Function){
                                                            return await __array_op_rval__315(name,{
                                                                type:await (await Environment.get_global("sub_type"))(val)
                                                            }) 
                                                        } else {
                                                            return [__array_op_rval__315,name,{
                                                                type:await (await Environment.get_global("sub_type"))(val)
                                                            }]
                                                        }
                                                    })())){
                                                        return name
                                                    }
                                                };
                                                ;
                                                await (async function() {
                                                    let __for_body__318=async function(__item) {
                                                        __result=await __action(__item);
                                                        if (check_true (__result)){
                                                            return (__collector).push(__result)
                                                        }
                                                    };
                                                    let __array__319=[],__elements__317=await (await Environment.get_global("pairs"))((ns_handle && ns_handle["context"] && ns_handle["context"]["scope"]));
                                                    let __BREAK__FLAG__=false;
                                                    for(let __iter__316 in __elements__317) {
                                                        __array__319.push(await __for_body__318(__elements__317[__iter__316]));
                                                        if(__BREAK__FLAG__) {
                                                             __array__319.pop();
                                                            break;
                                                            
                                                        }
                                                    }return __array__319;
                                                     
                                                })();
                                                return __collector
                                            }
                                        }
                                    } else {
                                        return await (await Environment.get_global("uniq"))(await (await Environment.get_global("conj"))(await (await Environment.get_global("keys"))((ns_handle && ns_handle["context"] && ns_handle["context"]["scope"])),await (await Environment.get_global("keys"))((ns_handle && ns_handle["definitions"]))))
                                    }
                                } () 
                            })()) 
                        })()) 
                    } else {
                        return [__array_op_rval__320,await (async function(){
                             return await (await Environment.get_global("sort"))(await (async function(){
                                 return await async function(){
                                    if (check_true (false)) {
                                        {
                                            {
                                                let __collector;
                                                let __result;
                                                let __action;
                                                __collector=[];
                                                __result=null;
                                                __action=async function(pset) {
                                                    let name;
                                                    let val;
                                                    name=(pset && pset["0"]);
                                                    val=(pset && pset["1"]);
                                                    if (check_true (await (async function(){
                                                        let __array_op_rval__315=(options && options["filter_by"]);
                                                         if (__array_op_rval__315 instanceof Function){
                                                            return await __array_op_rval__315(name,{
                                                                type:await (await Environment.get_global("sub_type"))(val)
                                                            }) 
                                                        } else {
                                                            return [__array_op_rval__315,name,{
                                                                type:await (await Environment.get_global("sub_type"))(val)
                                                            }]
                                                        }
                                                    })())){
                                                        return name
                                                    }
                                                };
                                                ;
                                                await (async function() {
                                                    let __for_body__318=async function(__item) {
                                                        __result=await __action(__item);
                                                        if (check_true (__result)){
                                                            return (__collector).push(__result)
                                                        }
                                                    };
                                                    let __array__319=[],__elements__317=await (await Environment.get_global("pairs"))((ns_handle && ns_handle["context"] && ns_handle["context"]["scope"]));
                                                    let __BREAK__FLAG__=false;
                                                    for(let __iter__316 in __elements__317) {
                                                        __array__319.push(await __for_body__318(__elements__317[__iter__316]));
                                                        if(__BREAK__FLAG__) {
                                                             __array__319.pop();
                                                            break;
                                                            
                                                        }
                                                    }return __array__319;
                                                     
                                                })();
                                                return __collector
                                            }
                                        }
                                    } else {
                                        return await (await Environment.get_global("uniq"))(await (await Environment.get_global("conj"))(await (await Environment.get_global("keys"))((ns_handle && ns_handle["context"] && ns_handle["context"]["scope"])),await (await Environment.get_global("keys"))((ns_handle && ns_handle["definitions"]))))
                                    }
                                } () 
                            })()) 
                        })()]
                    }
                })()
            }
        };
        let __array__302=[],__elements__300=await (await Environment.get_global("namespaces"))();
        let __BREAK__FLAG__=false;
        for(let __iter__299 in __elements__300) {
            __array__302.push(await __for_body__301(__elements__300[__iter__299]));
            if(__BREAK__FLAG__) {
                 __array__302.pop();
                break;
                
            }
        }return __array__302;
         
    })())
},{ "name":"symbols_by_namespace","fn_args":"(options)","description":["=:+","<br><br>By default, when called with no options, the `symbols_by_namespace` ","function returns an object with a key for each namespace, with an array ","containing the symbols (in a string format) defined in that ","namespace. <br>There is an optional `options` object argument which can modify ","the returned results and format.  <br><br>#### Options ","<br><br>include_meta:function -If true, will return the meta data associated ","with each symbol from the Environment definitions.  The output format is ","changed in this situation: instead of an array being returned, an object with ","the symbol names as keys and the meta data values as their value is returned.   "],"usage":["options:object"],"tags":["symbols","namespace"],"requires":["to_object","conj","add","pairs","sub_type","sort","push","uniq","keys","namespaces"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("*formatting_rules*",{
    minor_indent:["defun","defun_sync","defmacro","define","when","let","destructuring_bind","while","for_each","fn","lambda","function","progn","do","reduce","cond","try","catch","macroexpand","compile","unless","for_with","no_await","reduce_sync"],keywords:["-","->","*","**","/","%","+","<","<<","<=","=","==","=>",">",">=",">>","and","apply","break","call","cond","debug","dec","declare","defconst","defglobal","defvar","do","dynamic_import","eq","eval","fn","for_each","for_with","function","function*","if","inc","instanceof","javascript","jslambda","lambda","let","list","new","or","progl","progn","prop","quote","quotel","quotem","return","set_prop","setq","static_import","throw","try","typeof","unquotem","while","yield"],functions:[],allocating_forms:{
        let:async function(tree) {
            return await (await Environment.get_global("flatten"))(await (async function(){
                 return [await (await Environment.get_global("resolve_multi_path"))([1,"*",0],tree)] 
            })())
        },defun:async function(tree) {
            return await (await Environment.get_global("conj"))([await (await Environment.get_global("resolve_path"))([1],tree)],await (await Environment.get_global("flatten"))(await (await Environment.get_global("resolve_path"))([2],tree)))
        },defun_sync:async function(tree) {
            return await (await Environment.get_global("conj"))([await (await Environment.get_global("resolve_path"))([1],tree)],await (await Environment.get_global("flatten"))(await (await Environment.get_global("resolve_path"))([2],tree)))
        },defmacro:async function(tree) {
            return await (await Environment.get_global("conj"))([await (await Environment.get_global("resolve_path"))([1],tree)],await (await Environment.get_global("flatten"))(await (await Environment.get_global("resolve_path"))([2],tree)))
        },function:async function(tree) {
            return await (await Environment.get_global("flatten"))(await (async function(){
                 return [await (await Environment.get_global("resolve_path"))([1],tree)] 
            })())
        },fn:async function(tree) {
            return await (await Environment.get_global("flatten"))(await (async function(){
                 return [await (await Environment.get_global("resolve_path"))([1],tree)] 
            })())
        },lambda:async function(tree) {
            return await (await Environment.get_global("flatten"))(await (async function(){
                 return [await (await Environment.get_global("resolve_path"))([1],tree)] 
            })())
        },destructuring_bind:async function(tree) {
            return await (await Environment.get_global("flatten"))(await (async function(){
                 return [await (await Environment.get_global("resolve_path"))([1],tree)] 
            })())
        },defvar:async function(tree) {
            return [tree[1]]
        },for_each:async function(tree) {
            return [await (await Environment.get_global("resolve_path"))([1,0],tree)]
        },for_with:async function(tree) {
            return [await (await Environment.get_global("resolve_path"))([1,0],tree)]
        },reduce:async function(tree) {
            return [await (await Environment.get_global("resolve_path"))([1,0],tree)]
        },reduce_sync:async function(tree) {
            return [await (await Environment.get_global("resolve_path"))([1,0],tree)]
        },defglobal:async function(tree) {
            return [tree[1]]
        },defparameter:async function(tree) {
            return [tree[1]]
        }
    }
},{
    requires:["flatten","resolve_multi_path","conj","resolve_path"],externals:["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],source_name:"core.lisp"
});
await Environment.set_global("all_globals",async function() {
    let acc;
    acc=new Set();
    await (async function() {
        let __for_body__323=async function(ns) {
            return await (async function() {
                let __for_body__327=async function(k) {
                    return await acc["add"].call(acc,k)
                };
                let __array__328=[],__elements__326=await (await Environment.get_global("keys"))(await (await Environment.get_global("resolve_path"))(["global_ctx","scope"],await Environment["get_namespace_handle"].call(Environment,ns)));
                let __BREAK__FLAG__=false;
                for(let __iter__325 in __elements__326) {
                    __array__328.push(await __for_body__327(__elements__326[__iter__325]));
                    if(__BREAK__FLAG__) {
                         __array__328.pop();
                        break;
                        
                    }
                }return __array__328;
                 
            })()
        };
        let __array__324=[],__elements__322=await (await Environment.get_global("namespaces"))();
        let __BREAK__FLAG__=false;
        for(let __iter__321 in __elements__322) {
            __array__324.push(await __for_body__323(__elements__322[__iter__321]));
            if(__BREAK__FLAG__) {
                 __array__324.pop();
                break;
                
            }
        }return __array__324;
         
    })();
    return acc
},{ "name":"all_globals","fn_args":"[]","usage":[],"description":"Returns a set of all global symbols, regardless of namespace.","tags":["editor","globals","autocomplete"],"requires":["keys","resolve_path","namespaces"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("sleep",async function(seconds) {
    return new Promise(async function(resolve) {
        return await setTimeout(async function() {
            return await (async function(){
                let __array_op_rval__329=resolve;
                 if (__array_op_rval__329 instanceof Function){
                    return await __array_op_rval__329(true) 
                } else {
                    return [__array_op_rval__329,true]
                }
            })()
        },(seconds* 1000))
    })
},{ "name":"sleep","fn_args":"(seconds)","usage":["seconds:number"],"tags":["time","timing","pause","control"],"description":"Pauses execution for the number of seconds provided to the function.","requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("process_tree_symbols",async function(tree,prefix,_ctx) {
    let is_root;
    let rval;
    let symbol;
    let global_details;
    let allocator;
    let allocations;
    let sort_token;
    let format_token;
    is_root=(null==_ctx);
    rval=null;
    _ctx=(_ctx|| {
        acc:[],allocations:new Set(),symbols:new Set(),keywords:new Set(),literals:new Set(),globals:new Set(),global_detail:new Object()
    });
    symbol=null;
    global_details=null;
    allocator=null;
    allocations=null;
    sort_token=async function(t) {
        symbol=(""+ await (await Environment.get_global("as_lisp"))(t));
        if (check_true (await (await Environment.get_global("not"))((symbol===prefix)))){
            {
                return await async function(){
                    if (check_true ((t instanceof Array))) {
                        return await (await Environment.get_global("process_tree_symbols"))(t,prefix,_ctx)
                    } else if (check_true (await (await Environment.get_global("contains?"))(symbol,(await Environment.get_global("*formatting_rules*.keywords"))))) {
                        return await (_ctx && _ctx["keywords"])["add"].call((_ctx && _ctx["keywords"]),symbol)
                    } else if (check_true (await (async function(){
                        global_details=await (await Environment.get_global("meta_for_symbol"))(symbol,true);
                        return (await (await Environment.get_global("length"))(global_details)>0)
                    })())) {
                        {
                            return await (_ctx && _ctx["globals"])["add"].call((_ctx && _ctx["globals"]),symbol)
                        }
                    } else if (check_true (((t instanceof String || typeof t==='string')&& (await (await Environment.get_global("length"))(t)>2)&& await (await Environment.get_global("starts_with?"))(await (async function(){
                         return "=:" 
                    })(),t)))) {
                        return await (_ctx && _ctx["symbols"])["add"].call((_ctx && _ctx["symbols"]),(""+ await (await Environment.get_global("as_lisp"))(t)))
                    } else if (check_true ((await (await Environment.get_global("is_number?"))(t)|| (true===t)|| (false===t)|| ("nil"===(""+ await (await Environment.get_global("as_lisp"))(t)))))) {
                        return await (_ctx && _ctx["literals"])["add"].call((_ctx && _ctx["literals"]),(""+ t))
                    }
                } ()
            }
        }
    };
    format_token=async function(token) {
        return {
            value:(token && token.name),score:0,meta:await (async function(){
                if (check_true (((token && token["type"])==="arg"))){
                    return "local"
                } else {
                    return (token && token["type"])
                }
            })()
        }
    };
    await async function(){
        if (check_true (((tree instanceof Array)&& ((tree && tree.length)>0)))) {
            {
                allocator=await (async function(){
                    let __targ__330=(await Environment.get_global("*formatting_rules*.allocating_forms"));
                    if (__targ__330){
                         return(__targ__330)[(""+ await (await Environment.get_global("as_lisp"))(tree[0]))]
                    } 
                })();
                if (check_true (allocator instanceof Function)){
                    {
                        allocations=await (async function(){
                            let __array_op_rval__331=allocator;
                             if (__array_op_rval__331 instanceof Function){
                                return await __array_op_rval__331(tree) 
                            } else {
                                return [__array_op_rval__331,tree]
                            }
                        })();
                        await (async function() {
                            let __for_body__334=async function(allocation) {
                                symbol=(""+ await (await Environment.get_global("as_lisp"))(allocation));
                                if (check_true (await (await Environment.get_global("not"))(((symbol===prefix)|| (symbol==="\"&\""))))){
                                    {
                                        return await (_ctx && _ctx["allocations"])["add"].call((_ctx && _ctx["allocations"]),symbol)
                                    }
                                }
                            };
                            let __array__335=[],__elements__333=allocations;
                            let __BREAK__FLAG__=false;
                            for(let __iter__332 in __elements__333) {
                                __array__335.push(await __for_body__334(__elements__333[__iter__332]));
                                if(__BREAK__FLAG__) {
                                     __array__335.pop();
                                    break;
                                    
                                }
                            }return __array__335;
                             
                        })()
                    }
                };
                return await (async function() {
                    let __for_body__338=async function(t) {
                        return await sort_token(t)
                    };
                    let __array__339=[],__elements__337=tree;
                    let __BREAK__FLAG__=false;
                    for(let __iter__336 in __elements__337) {
                        __array__339.push(await __for_body__338(__elements__337[__iter__336]));
                        if(__BREAK__FLAG__) {
                             __array__339.pop();
                            break;
                            
                        }
                    }return __array__339;
                     
                })()
            }
        } else if (check_true ((tree instanceof Object))) {
            {
                await (async function() {
                    let __for_body__342=async function(pset) {
                        await (_ctx && _ctx["literals"])["add"].call((_ctx && _ctx["literals"]),(pset && pset["0"]));
                        return await sort_token((pset && pset["1"]))
                    };
                    let __array__343=[],__elements__341=await (await Environment.get_global("pairs"))(tree);
                    let __BREAK__FLAG__=false;
                    for(let __iter__340 in __elements__341) {
                        __array__343.push(await __for_body__342(__elements__341[__iter__340]));
                        if(__BREAK__FLAG__) {
                             __array__343.pop();
                            break;
                            
                        }
                    }return __array__343;
                     
                })()
            }
        } else {
            await sort_token(tree)
        }
    } ();
    if (check_true (is_root)){
        {
            rval={
                allocations:await (async function(){
                     return await (await Environment.get_global("to_array"))((_ctx && _ctx["allocations"])) 
                })(),symbols:await (async function(){
                     return await (await Environment.get_global("to_array"))((_ctx && _ctx["symbols"])) 
                })(),keywords:await (async function(){
                     return await (await Environment.get_global("to_array"))((_ctx && _ctx["keywords"])) 
                })(),literals:await (async function(){
                     return await (await Environment.get_global("to_array"))((_ctx && _ctx["literals"])) 
                })(),globals:await (async function(){
                     return await (await Environment.get_global("to_array"))((_ctx && _ctx["globals"])) 
                })()
            }
        }
    };
    return rval
},{ "name":"process_tree_symbols","fn_args":"(tree prefix _ctx)","usage":["tree:*"],"description":["=:+","Given a JSON structure, such as produced by the reader, returns an object containing the various determined types of the provided structure:<br>","allocations:array - All locally allocated symbols<br>","symbols:array - All identified symbols<br>","keywords:array - All keywords used in the structure","literals:array - All identified literals (i.e. not a symbol)","globals:array - All referenced globals"],"tags":["editor","usage","scope","structure"],"requires":["as_lisp","not","is_array?","process_tree_symbols","contains?","*formatting_rules*","meta_for_symbol","length","is_string?","starts_with?","is_number?","is_function?","is_object?","pairs","to_array"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await (async function(){
    return  Environment.set_global("keys*",function(obj) {
        if (check_true ((obj instanceof Object))){
            {
                let current_obj;
                let prototypes;
                let properties;
                current_obj=obj;
                prototypes=[];
                properties= ( Environment.get_global("first"))(prototypes);
                 ( function(){
                     let __body_ref__345=function() {
                        properties=new Set();
                        (prototypes).push(properties);
                         ( function() {
                            let __for_body__348=function(item) {
                                return  properties["add"].call(properties,item)
                            };
                            let __array__349=[],__elements__347= Object.getOwnPropertyNames(current_obj);
                            let __BREAK__FLAG__=false;
                            for(let __iter__346 in __elements__347) {
                                __array__349.push( __for_body__348(__elements__347[__iter__346]));
                                if(__BREAK__FLAG__) {
                                     __array__349.pop();
                                    break;
                                    
                                }
                            }return __array__349;
                             
                        })();
                        return current_obj= Object.getPrototypeOf(current_obj)
                    };
                    let __BREAK__FLAG__=false;
                    while(current_obj) {  __body_ref__345();
                     if(__BREAK__FLAG__) {
                         break;
                        
                    }
                } ;
                
            })();
            return  ( Environment.get_global("flatten"))( ( function() {
                let __for_body__352=function(s) {
                    return  ( function() {
                        {
                             let __call_target__= Array.from(s), __call_method__="sort";
                            return  __call_target__[__call_method__]()
                        } 
                    })()
                };
                let __array__353=[],__elements__351=prototypes;
                let __BREAK__FLAG__=false;
                for(let __iter__350 in __elements__351) {
                    __array__353.push( __for_body__352(__elements__351[__iter__350]));
                    if(__BREAK__FLAG__) {
                         __array__353.pop();
                        break;
                        
                    }
                }return __array__353;
                 
            })())
        }
    } else {
        throw new TypeError("keys*: invalid object as argument");
        
    }
},{ "name":"keys*","fn_args":"(obj)","description":["=:+","Like keys, but where keys uses Object.keys, keys* uses the function Object.getOwnpropertynames and returns the ","prototype keys as well."],"usage":["obj:Object"],"tags":["object","array","keys","property","properties","introspection"],"requires":["is_object?","first","push","flatten"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await (async function(){
    return  Environment.set_global("pairs*",function(obj) {
        if (check_true ((obj instanceof Object))){
            return  ( function() {
                let __for_body__356=function(k) {
                    return  ( function(){
                        let __array_op_rval__358=k;
                         if (__array_op_rval__358 instanceof Function){
                            return  __array_op_rval__358(obj[k]) 
                        } else {
                            return [__array_op_rval__358,obj[k]]
                        }
                    })()
                };
                let __array__357=[],__elements__355= ( Environment.get_global("keys*"))(obj);
                let __BREAK__FLAG__=false;
                for(let __iter__354 in __elements__355) {
                    __array__357.push( __for_body__356(__elements__355[__iter__354]));
                    if(__BREAK__FLAG__) {
                         __array__357.pop();
                        break;
                        
                    }
                }return __array__357;
                 
            })()
        }
    },{ "name":"pairs*","fn_args":"(obj)","description":"Like pairs, but where keys uses Object.keys, pairs* returns the key-value pairs prototype heirarchy as well.","usage":["obj:Object"],"tags":["object","array","keys","property","properties","introspection","values"],"requires":["is_object?","keys*"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await Environment.set_global("for",async function(...args) {
    let symbol_list;
    let array_ref;
    let body_forms;
    symbol_list=(args && args["0"] && args["0"]["0"]);
    array_ref=(args && args["0"] && args["0"]["1"]);
    body_forms=await (await Environment.get_global("slice"))(args,1);
    {
        let sym_list;
        sym_list=symbol_list;
        if (check_true ((sym_list instanceof Array))){
            return ["=:for_each",["=:_pset",array_ref],["=:destructuring_bind",sym_list,"=:_pset",].concat(body_forms)]
        } else {
            return ["=:for_each",[sym_list,array_ref],["=:progn",].concat(body_forms)]
        }
    }
},{ "eval_when":{ "compile_time":true
},"name":"for","macro":true,"fn_args":"[(symbol_list array_ref) \"&\" body_forms]","description":["=:+","The for macro provides a facility for looping through arrays, ","destructuring their contents into local symbols that can be used in a block.  ","The `for` macro is a higher level construct than the `for_each` operator, as it ","allows for multiple symbols to be mapped into the contents iteratively, vs. ","for_each allowing only a single symbol to be bound to each top level element in ","the provided array.<br>The symbol_list is provided as the lambda list to a ","`destructuring_bind` if multiple symbols are provided, otherwise, if only a ","single variable is provided, the `for` macro will convert to  a for_each call, ","with the `body_forms` enclosed in a `progn` block.  <br><br>#### Examples ","<br><br>An example of a multiple bindings is below.  The values of `positions` ","are mapped (destructured) into x, y, w and h, respectively, each iteration ","through the loop mapping to the next structured element of the array:```(let\n ","((positions\n      [[[1 2] [5 3]]\n       [[6 3] [10 2]]]))\n  (for ([[x y] [w h]] ","positions)\n       (log \"x,y,w,h=\" x y w h)\n       (+ \"\" x \",\" y \"+\"  w \",\" h ",")))```<br><br>Upon evaluation the log output is as follows:```\"x,y,w,h=\" 1 2 5 ","3```<br>```\"x,y,w,h=\" 6 3 10 2```<br><br>The results returned from the ","call:```[\"1,2+5,3\"\n \"6,3+10,2\"]```<br><br>Notice that the `for` body is wrapped ","in an explicit `progn` such that the last value is accumulated and returned ","from the `for` operation.<br>An example of single bindings, which essentially ","transforms into a `for_each` call with an implicit `progn` around the body ","forms.  This form is essentially a convenience call around `for_each`.  ```(for ","(x [1 2 3])\n     (log \"x is: \" x) \n     (+ x 2))```<br><br>Both the log form ","and the final body form `(+ x 2)` are the body forms and will be evaluated in ","sequence, the final form results accumulating to be returned to the ","caller.<br>Log output from the above:```\"x is: \" 1\n\"x is: \" 2\n\"x is: \" ","3```<br><br>Return value:```[3 4 5]```<br>"],"usage":["allocations_and_values:array","body_forms:*"],"tags":["iteration","loop","for","array","destructuring"],"requires":["slice","is_array?"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("for_items",async function(...args) {
    let iteration_symbol;
    let collection;
    let body_forms;
    iteration_symbol=(args && args["0"] && args["0"]["0"]);
    collection=(args && args["0"] && args["0"]["1"]);
    body_forms=await (await Environment.get_global("slice"))(args,1);
    return ["=:let",[["=:__collection",collection]],["=:for_each",["=:__idx",["=:range","=:__collection.length"]],["=:progn",["=:defvar",iteration_symbol,["=:->","=:__collection","item","=:__idx"]],].concat(body_forms)]]
},{ "eval_when":{ "compile_time":true
},"name":"for_items","macro":true,"fn_args":"[(iteration_symbol collection) \"&\" body_forms]","description":["=:+","The `for_items` macro takes a collection, checks the length property ","and then iterates through the collection assigning each value in the collection ","to the provided iterator symbol.  The behavior is similar to `for_each` where ","the final result of the body forms is accumulated and returned as an ","array.  <br>The `for_items` macro provides a `progn` wrapper around the body ","forms so it is not required to provide a block specifier in the body forms ","provided.<br> "],"usage":["allocation_and_collection:array","body:array"],"tags":["iteration","for","loop","iterator","collection"],"requires":["slice"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await (async function(){
    return  Environment.set_global("word_wrap",function(text,ncols) {
        let line_length;
        let words;
        let max_cols;
        let current_line;
        let lines;
        line_length=0;
        words=(text).split(" ");
        max_cols=(ncols|| 80);
        current_line=[];
        lines=[];
         ( function() {
            let __for_body__361=function(word) {
                return   (function(){
                    if (check_true (((line_length+  ( Environment.get_global("length"))(word))>=max_cols))) {
                        {
                            (lines).push((current_line).join(" "));
                            current_line= ( function(){
                                let __array_op_rval__363=word;
                                 if (__array_op_rval__363 instanceof Function){
                                    return  __array_op_rval__363() 
                                } else {
                                    return [__array_op_rval__363]
                                }
                            })();
                            return line_length= ( Environment.get_global("add"))( ( Environment.get_global("length"))(word),1)
                        }
                    } else {
                        {
                            (current_line).push(word);
                            return line_length+= ( Environment.get_global("add"))( ( Environment.get_global("length"))(word),1)
                        }
                    }
                } )()
            };
            let __array__362=[],__elements__360=(words|| []);
            let __BREAK__FLAG__=false;
            for(let __iter__359 in __elements__360) {
                __array__362.push( __for_body__361(__elements__360[__iter__359]));
                if(__BREAK__FLAG__) {
                     __array__362.pop();
                    break;
                    
                }
            }return __array__362;
             
        })();
        if (check_true (((current_line && current_line.length)>0))){
            (lines).push((current_line).join(" "))
        };
        return lines
    },{ "name":"word_wrap","fn_args":"(text ncols)","description":["=:+","Given a string of text and an optional column length ","returns an array of lines wrapped at or before the ","column length.  If no column length is provided, ","the default is 80."],"usage":["text:string","ncols:?number"],"tags":["text","string","wrap","format"],"requires":["split_by","length","push","join","add"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await Environment.set_global("progc",async function(...args) {
    let forms;
    forms=await (await Environment.get_global("slice"))(args,0);
    return ["=:try",["=:progn",].concat(forms),["=:catch","=:Error",["=:e"],["=:log","=:e.message"]]]
},{ "eval_when":{ "compile_time":true
},"name":"progc","macro":true,"fn_args":"[\"&\" forms]","description":["=:+","This macro wraps the provided forms in a ","try-catch, and returns the last value if ","no errors, like progn, or if an error ","occurs, logs to the console.  Simple ","help for debugging."],"tags":["debug","error","catch","handler","progn","eval"],"usage":["forms:*"],"requires":["slice"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await (async function(){
    return  Environment.set_global("reverse_string",function(text) {
        return ( ( function() {
            {
                 let __call_target__=(text).split(""), __call_method__="reverse";
                return  __call_target__[__call_method__]()
            } 
        })()).join("")
    },{ "name":"reverse_string","fn_args":"(text)","description":"Given a string, returns the characters in reverse order.","usage":["text:string"],"tags":["string","text","reverse","modify"],"requires":["join","split_by"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await (async function(){
    return  Environment.set_global("last_n_chars",function(n,text) {
        if (check_true ((text instanceof String || typeof text==='string'))){
            return  text["substr"].call(text,(-1* n))
        } else {
            return null
        }
    },{ "name":"last_n_chars","fn_args":"(n text)","description":"For a given string, returns the last n characters as a string.","usage":["n:number","text:string"],"tags":["string","text","last","amount","end","tail"],"requires":["is_string?"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await (async function(){
    return  Environment.set_global("last_n",function(n,arr) {
        if (check_true (((n>0)&& (arr instanceof Array)))){
            return  arr["slice"].call(arr,(-1* n))
        } else {
            return null
        }
    },{ "name":"last_n","fn_args":"(n arr)","description":"For a given array, returns the last n elements as an array.","usage":["n:number","arr:array"],"tags":["array","list","last","amount","end","tail"],"requires":["is_array?"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await (async function(){
    return  Environment.set_global("from_last",function(amount,arr) {
        return arr[((arr && arr.length)- (1+ amount))]
    },{ "name":"from_last","fn_args":"(amount arr)","description":["=:+","Given an offset amount and an array, `from_last` returns the value at ","the offset amount from the end of the array. "],"usage":["amount:number","arr:array"],"tags":["array","list","last","amount","end","tail"],"requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await (async function(){
    return  Environment.set_global("analyze_text_line",function(line) {
        let delta;
        let indent_spaces;
        let base_indent;
        let idx;
        let openers;
        let closers;
        let code_mode;
        let cpos;
        let last_c;
        let last_delim;
        delta=0;
        indent_spaces=0;
        base_indent=null;
        idx=-1;
        openers=[];
        closers=[];
        code_mode=true;
        cpos=null;
        last_c=null;
        last_delim=null;
         ( function() {
            let __for_body__366=function(c) {
                idx+=1;
                  (function(){
                    if (check_true (((c==="\"")&& ((null==last_c)|| (last_c&&  ( Environment.get_global("not"))((92=== last_c["charCodeAt"]()))))))) {
                        return code_mode= ( Environment.get_global("not"))(code_mode)
                    } else if (check_true ((code_mode&& (c===";")))) {
                        {
                            __BREAK__FLAG__=true;
                            return
                        }
                    } else if (check_true ((code_mode&& ((c==="(")|| (c==="{")|| (c==="["))))) {
                        {
                            delta+=1;
                            (openers).push(idx);
                            base_indent=indent_spaces;
                            cpos=idx;
                            last_delim=c
                        }
                    } else if (check_true ((code_mode&& ((c===")")|| (c==="]")|| (c==="}"))))) {
                        {
                            delta-=1;
                            (closers).push(idx);
                            cpos=idx;
                            last_delim=c
                        }
                    } else if (check_true ((code_mode&& (c===" ")&&  ( Environment.get_global("not"))(base_indent)))) {
                        {
                            indent_spaces+=1
                        }
                    } else if (check_true ( ( Environment.get_global("not"))(base_indent))) {
                        base_indent=indent_spaces
                    }
                } )();
                return last_c=c
            };
            let __array__367=[],__elements__365=(line).split("");
            let __BREAK__FLAG__=false;
            for(let __iter__364 in __elements__365) {
                __array__367.push( __for_body__366(__elements__365[__iter__364]));
                if(__BREAK__FLAG__) {
                     __array__367.pop();
                    break;
                    
                }
            }return __array__367;
             
        })();
        if (check_true ((undefined==base_indent))){
            {
                base_indent=indent_spaces
            }
        };
        return {
            delta:delta,final_type:last_delim,final_pos:cpos,line:line,indent:base_indent,openers:openers,closers:closers
        }
    },{ "name":"analyze_text_line","fn_args":"(line)","description":["=:+","Given a line of text, analyzes the text for form/block openers, identified as ","(,{,[ and their corresponding closers, which correspod to ),},].  It then returns ","an object containing the following: <br><br>","{ delta:int   - a positive or negative integer that is represents the positive or negative depth change, <br>","  final_type: string - the final delimiter character found which can either be an opener or a closer, <br>","  final_pos: int - the position of the final delimiter, <br>","  line: string - the line of text analyzed, <br>","  indent: int - the indentation space count found in the line, <br>","  openers: array - an array of integers representing all column positions of found openers in the line.<br>","  closers: array - an array of integers representing all column positions of found closers in the line. }<br><br>","The function does not count opening and closing tokens if they appear in a string."],"tags":["text","tokens","form","block","formatting","indentation"],"usage":["line:string"],"requires":["not","push","split_by"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await (async function(){
    return  Environment.set_global("calculate_indent_rule",function(delta,movement_needed) {
        let lisp_line;
        let remainder_pos;
        let remainder;
        let comps;
        let symbol_details;
        lisp_line= (delta && delta["line"])["substr"].call((delta && delta["line"]), ( Environment.get_global("first"))((delta && delta["openers"])));
        remainder_pos= ( function(){
            if (check_true (((delta && delta["openers"] && delta["openers"]["length"])>0))){
                return ( ( function(){
                    let __targ__368=(delta && delta["openers"]);
                    if (__targ__368){
                         return(__targ__368)[(movement_needed- 1)]
                    } 
                })()||  ( Environment.get_global("first"))((delta && delta["openers"]))|| (delta && delta["indent"]))
            } else {
                return 0
            }
        })();
        remainder= (delta && delta["line"])["substr"].call((delta && delta["line"]),(1+ remainder_pos));
        comps= ( function(){
            let __collector;
            let __result;
            let __action;
            __collector=[];
            __result=null;
            __action=function(c) {
                if (check_true ( ( Environment.get_global("not"))( ( Environment.get_global("blank?"))(c)))){
                    {
                        return c
                    }
                }
            };
            ;
             ( function() {
                let __for_body__371=function(__item) {
                    __result= __action(__item);
                    if (check_true (__result)){
                        return (__collector).push(__result)
                    }
                };
                let __array__372=[],__elements__370=(remainder).split(" ");
                let __BREAK__FLAG__=false;
                for(let __iter__369 in __elements__370) {
                    __array__372.push( __for_body__371(__elements__370[__iter__369]));
                    if(__BREAK__FLAG__) {
                         __array__372.pop();
                        break;
                        
                    }
                }return __array__372;
                 
            })();
            return __collector
        })();
        symbol_details= ( function(){
            if (check_true ((((comps && comps.length)>0)&&  ( Environment.get_global("not"))( ( Environment.get_global("contains?"))("(",(comps && comps["0"])))&&  ( Environment.get_global("not"))( ( Environment.get_global("contains?"))("{",(comps && comps["0"])))&&  ( Environment.get_global("not"))( ( Environment.get_global("contains?"))("[",(comps && comps["0"])))))){
                return ( ( Environment.get_global("first"))( ( Environment.get_global("meta_for_symbol"))((comps && comps["0"]),true))|| {
                    type:"-"
                })
            } else {
                return {
                    type:"-"
                }
            }
        })();
          (function(){
            if (check_true ((movement_needed===0))) {
                return true
            } else if (check_true ((((comps && comps.length)===0)&& ((delta && delta["openers"] && delta["openers"]["length"])===0)&& ((delta && delta["closers"] && delta["closers"]["length"])===0)))) {
                true
            } else if (check_true (( ( Environment.get_global("starts_with?"))("def",(comps && comps["0"]))||  ( Environment.get_global("contains?"))((comps && comps["0"]),( Environment.get_global("*formatting_rules*.minor_indent")))))) {
                {
                      (function(){
                        delta["indent"]=(remainder_pos+ 3);
                        return delta;
                        
                    })()
                }
            } else if (check_true (((((symbol_details && symbol_details["type"])&&  ( Environment.get_global("contains?"))("Function",(symbol_details && symbol_details["type"])))||  ( Environment.get_global("contains?"))((comps && comps["0"]),( Environment.get_global("*formatting_rules*.keywords"))))&&  ( Environment.get_global("contains?"))((delta && delta["final_type"]),["(","[",")","]"])))) {
                {
                    if (check_true ((( ( Environment.get_global("length"))((delta && delta["closers"]))===0)&& ( ( Environment.get_global("length"))((delta && delta["openers"]))===1)))){
                        {
                              (function(){
                                delta["indent"]=(remainder_pos+ 3);
                                return delta;
                                
                            })()
                        }
                    } else {
                        {
                              (function(){
                                delta["indent"]=(remainder_pos+ (comps && comps["0"] && comps["0"]["length"])+ 2);
                                return delta;
                                
                            })()
                        }
                    }
                }
            } else if (check_true ( ( Environment.get_global("contains?"))((comps && comps["0"]),( Environment.get_global("built_ins"))))) {
                {
                      (function(){
                        delta["indent"]=(remainder_pos+ (comps && comps["0"] && comps["0"]["length"])+ 2);
                        return delta;
                        
                    })()
                }
            } else if (check_true (((delta && delta["final_type"])==="["))) {
                {
                      (function(){
                        delta["indent"]=(remainder_pos+ 1);
                        return delta;
                        
                    })()
                }
            } else if (check_true (( ( Environment.get_global("starts_with?"))("[",(comps && comps["0"]))||  ( Environment.get_global("starts_with?"))("(",(comps && comps["0"]))))) {
                {
                      (function(){
                        delta["indent"]=(remainder_pos+ 1);
                        return delta;
                        
                    })()
                }
            } else if (check_true (((comps && comps.length)===1))) {
                {
                      (function(){
                        delta["indent"]=(remainder_pos+ 3);
                        return delta;
                        
                    })()
                }
            } else if (check_true ((((delta && delta["final_type"])==="{")&& (movement_needed>0)))) {
                {
                      (function(){
                        delta["indent"]=(remainder_pos+ 2);
                        return delta;
                        
                    })()
                }
            } else if (check_true (((comps && comps.length)===0))) {
                {
                      (function(){
                        delta["indent"]=(1+ remainder_pos);
                        return delta;
                        
                    })()
                }
            } else {
                {
                      (function(){
                        delta["indent"]=(remainder_pos+ (comps && comps["0"] && comps["0"]["length"])+ 2);
                        return delta;
                        
                    })()
                }
            }
        } )();
        return delta
    },{ "name":"calculate_indent_rule","fn_args":"(delta movement_needed)","description":["=:+","Given a delta object as returned from analyze_text_line, and an integer representing the ","the amount of tree depth to change, calculates the line indentation required for the ","given delta object, and creates an indent property in the delta object containing ","the given amount of spaces to prepend to the line.  References the *formatting_rules* ","object as needed to determine minor indentation from standard indentation, as well as ","which symbols are identified as keywords.  Returns the provided delta object with the ","indent key added."],"tags":["indentation","text","formatting"],"usage":["delta:object","movement_needed:int"],"requires":["first","not","blank?","push","split_by","contains?","meta_for_symbol","starts_with?","*formatting_rules*","length","built_ins"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await (async function(){
    return  Environment.set_global("format_lisp_line",function(line_number,get_line) {
        if (check_true (((line_number>0)&& get_line instanceof Function))){
            {
                let current_row;
                let prior_line;
                let delta;
                let movement_needed;
                let orig_movement_needed;
                let comps;
                let final;
                let in_seek;
                current_row=(line_number- 1);
                prior_line= ( function(){
                    let v= ( function(){
                        let __array_op_rval__383=get_line;
                         if (__array_op_rval__383 instanceof Function){
                            return  __array_op_rval__383(current_row) 
                        } else {
                            return [__array_op_rval__383,current_row]
                        }
                    })();
                    ;
                     ( function(){
                         let __test_condition__384=function() {
                            return (((v).trim()==="")&& (current_row>0))
                        };
                        let __body_ref__385=function() {
                            current_row-=1;
                            return v= ( function(){
                                let __array_op_rval__386=get_line;
                                 if (__array_op_rval__386 instanceof Function){
                                    return  __array_op_rval__386(current_row) 
                                } else {
                                    return [__array_op_rval__386,current_row]
                                }
                            })()
                        };
                        let __BREAK__FLAG__=false;
                        while( __test_condition__384()) {
                              __body_ref__385();
                             if(__BREAK__FLAG__) {
                                 break;
                                
                            }
                        } ;
                        
                    })();
                    return (v|| "")
                })();
                delta= ( Environment.get_global("analyze_text_line"))(prior_line);
                movement_needed=0;
                orig_movement_needed=0;
                comps=null;
                final=(delta && delta["final_type"]);
                in_seek=((delta && delta["openers"] && delta["openers"]["length"])<(delta && delta["closers"] && delta["closers"]["length"]));
                movement_needed=(delta && delta["delta"]);
                orig_movement_needed=movement_needed;
                  (function(){
                    if (check_true ((movement_needed<0))) {
                        {
                            let lisp_line;
                            let remainder_pos;
                            let remainder;
                            let symbol_details;
                            lisp_line=null;
                            remainder_pos=null;
                            remainder=null;
                            symbol_details=null;
                             ( function(){
                                 let __test_condition__387=function() {
                                    return ((movement_needed<0)&& (current_row>0))
                                };
                                let __body_ref__388=function() {
                                    current_row-=1;
                                    prior_line= ( function(){
                                        let __array_op_rval__389=get_line;
                                         if (__array_op_rval__389 instanceof Function){
                                            return  __array_op_rval__389(current_row) 
                                        } else {
                                            return [__array_op_rval__389,current_row]
                                        }
                                    })();
                                     ( function(){
                                         let __test_condition__390=function() {
                                            return ((current_row>0)&& ((prior_line).trim()===""))
                                        };
                                        let __body_ref__391=function() {
                                            current_row-=1;
                                            return prior_line= ( function(){
                                                let __array_op_rval__392=get_line;
                                                 if (__array_op_rval__392 instanceof Function){
                                                    return  __array_op_rval__392(current_row) 
                                                } else {
                                                    return [__array_op_rval__392,current_row]
                                                }
                                            })()
                                        };
                                        let __BREAK__FLAG__=false;
                                        while( __test_condition__390()) {
                                              __body_ref__391();
                                             if(__BREAK__FLAG__) {
                                                 break;
                                                
                                            }
                                        } ;
                                        
                                    })();
                                    delta= ( Environment.get_global("analyze_text_line"))(prior_line);
                                    return movement_needed=(movement_needed+ (delta && delta["delta"]))
                                };
                                let __BREAK__FLAG__=false;
                                while( __test_condition__387()) {
                                      __body_ref__388();
                                     if(__BREAK__FLAG__) {
                                         break;
                                        
                                    }
                                } ;
                                
                            })();
                            return delta= ( Environment.get_global("calculate_indent_rule"))(delta,movement_needed)
                        }
                    } else if (check_true ((movement_needed>0))) {
                        {
                            return delta= ( Environment.get_global("calculate_indent_rule"))(delta,movement_needed)
                        }
                    }
                } )();
                return ( ( function() {
                    let __for_body__395=function(c) {
                        return " "
                    };
                    let __array__396=[],__elements__394= ( Environment.get_global("range"))( Math.max(0,(delta && delta["indent"])));
                    let __BREAK__FLAG__=false;
                    for(let __iter__393 in __elements__394) {
                        __array__396.push( __for_body__395(__elements__394[__iter__393]));
                        if(__BREAK__FLAG__) {
                             __array__396.pop();
                            break;
                            
                        }
                    }return __array__396;
                     
                })()).join("")
            }
        }
    },{ "name":"format_lisp_line","fn_args":"(line_number get_line)","description":["=:+","Given a line number and an accessor function (synchronous), returns a","a text string representing the computed indentation for the provided ","line number. The get_line function to be provided will be called with ","a single integer argument representing a requested line number from ","the text buffer being analyzed.  The provided get_line function should ","return a string representing the line of text from the buffer containing ","the requested line. Once the string is returned, it is mandatory to update ","the line buffer with the updated indented string, otherwise the function ","will not work properly."],"tags":["formatting","indentation","text","indent"],"usage":["line_number:integer","get_line:function"],"requires":["is_function?","trim","analyze_text_line","calculate_indent_rule","join","range"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await Environment.set_global("set_default",async function(path,value) {
    let real_path;
    real_path=await (async function(){
         return await async function(){
            if (check_true (((path instanceof String || typeof path==='string')&& await (await Environment.get_global("starts_with?"))("=:",path)&& await (await Environment.get_global("contains?"))(".",path)))) {
                return ((""+ await (await Environment.get_global("as_lisp"))(path))).split(".")
            } else if (check_true (((path instanceof String || typeof path==='string')&& await (await Environment.get_global("contains?"))(".",path)))) {
                return (path).split(".")
            } else if (check_true (((path instanceof String || typeof path==='string')&& await (await Environment.get_global("contains?"))("~",path)))) {
                return (path).split("~")
            } else {
                return path
            }
        } () 
    })();
    return ["=:progn",["=:unless",["=:is_array?",real_path],["=:throw","=:ReferenceError","set_default: invalid path specification, needs to be an array, string or symbol."]],["=:defvar","=:__first_val",["=:first",real_path]],["=:if",["=:contains?","=:__first_val",["=:list","features","build","imports","included_libraries"]],["=:throw","=:ReferenceError",["=:+","set_default: the path value ","doesn't reference a default value setting"]]],["=:if",["=:resolve_path",real_path,"=:*env_config*"],["=:set_path",real_path,"=:*env_config*",value],["=:make_path",real_path,"=:*env_config*",value]],["=:resolve_path",real_path,"=:*env_config*"]]
},{ "eval_when":{ "compile_time":true
},"name":"set_default","macro":true,"fn_args":"(path value)","description":["=:+","Given a path to a value in the *env_config* object, and a value to set, creates or sets the value ","at the provided path position.  The path can be in the following forms:<br>","path.to.default_value:symbol - A period delimited non-quoted symbol<br>","[ `path `to `default_value ] - An array with quoted values or strings, in the standard path format.<br>","\"path.to.default_value\" - A string delimited by periods<br>","\"path~to~default_value\" - A string delimited by the path delimiter ~<br>","<br>","The value returned from the macro is the new default value as set in the *env_config*.<br>"],"tags":["default","defaults","set","application","editor","repl"],"usage":["path:symbol|string|array","value:*"],"requires":["is_string?","starts_with?","contains?","split_by","as_lisp"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("get_default",async function(key,alt_val) {
    if (check_true ((key instanceof Array))){
        return (await (await Environment.get_global("resolve_multi_path"))(key,(await Environment.get_global("*env_config*")))|| alt_val)
    } else {
        throw new TypeError("get_default: key must be an array");
        
    }
},{ "name":"get_default","fn_args":"(key alt_val)","description":["=:+","Given a path (array form) to a key in `*env_config*` , returns the ","value at the path.  If the value cannot be found, will return `undefined`.  If ","the second argument is provided, `alt_val`, that value will be returned if the ","provided path isn't found. "],"usage":["key:array","alt_val:*"],"tags":["settings","config","defaults","default","environment","env","application"],"requires":["is_array?","resolve_multi_path","*env_config*"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("traverse",async function(structure,operator_function,_path) {
    let __path__397= async function(){
        return (_path|| [])
    };
    {
        let path=await __path__397();
        ;
        if (check_true ((null==operator_function))){
            throw new Error("traverse: requires a function as a second argument");
            
        };
        await async function(){
            if (check_true ((structure instanceof Array))) {
                {
                    await (async function(){
                        let __array_op_rval__398=operator_function;
                         if (__array_op_rval__398 instanceof Function){
                            return await __array_op_rval__398(structure,path) 
                        } else {
                            return [__array_op_rval__398,structure,path]
                        }
                    })();
                    return await (await Environment.get_global("map"))(async function(elem,idx) {
                        return await (await Environment.get_global("traverse"))(elem,operator_function,await (await Environment.get_global("conj"))(path,idx))
                    },structure)
                }
            } else if (check_true ((structure instanceof Object))) {
                {
                    await (async function(){
                        let __array_op_rval__399=operator_function;
                         if (__array_op_rval__399 instanceof Function){
                            return await __array_op_rval__399(structure,path) 
                        } else {
                            return [__array_op_rval__399,structure,path]
                        }
                    })();
                    await (async function() {
                        let __for_body__402=async function(pset) {
                            {
                                let key;
                                let value;
                                key=(pset && pset["0"]);
                                value=(pset && pset["1"]);
                                return await (await Environment.get_global("traverse"))(value,operator_function,await (await Environment.get_global("conj"))(path,key))
                            }
                        };
                        let __array__403=[],__elements__401=await (await Environment.get_global("pairs"))(structure);
                        let __BREAK__FLAG__=false;
                        for(let __iter__400 in __elements__401) {
                            __array__403.push(await __for_body__402(__elements__401[__iter__400]));
                            if(__BREAK__FLAG__) {
                                 __array__403.pop();
                                break;
                                
                            }
                        }return __array__403;
                         
                    })()
                }
            } else {
                await (async function(){
                    let __array_op_rval__404=operator_function;
                     if (__array_op_rval__404 instanceof Function){
                        return await __array_op_rval__404(structure,path) 
                    } else {
                        return [__array_op_rval__404,structure,path]
                    }
                })()
            }
        } ();
        return structure
    }
},{ "name":"traverse","fn_args":"(structure operator_function _path)","description":["=:+","Given a structure such as an object or an array, and an operator ","function argument, the function will recursively call the operator function ","with the value and the path to each value in the structure.   The operator ","function can choose to operate on the value at the path by calling `set_path` ","for the root object, or otherwise examine the value and the path.  The return ","value of the operator function is ignored.  The operator function signature is ","called with `(value path_to_value)` as a signature.<br><br> "],"usage":["structure:object","operator_function:function"],"tags":["recursion","recurse","structure","object","array","search","find"],"requires":["is_array?","map","traverse","conj","is_object?","pairs"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await Environment.set_global("truncate",async function(len,value,trailer) {
    trailer=(trailer|| "");
    return await async function(){
        if (check_true ((value instanceof String || typeof value==='string'))) {
            if (check_true (((value && value.length)>len))){
                return await (await Environment.get_global("add"))(await value["substr"].call(value,0,len),trailer)
            } else {
                return value
            }
        } else if (check_true ((value instanceof Array))) {
            return await value["slice"].call(value,0,len)
        } else {
            return value
        }
    } ()
},{ "name":"truncate","fn_args":"(len value trailer)","description":["=:+","Given a length and a string or an array, return the value ","with a length no more than then the provided value. If ","the value is a string an optional trailer string can be ","provided that will be appeneded to the truncated string."],"usage":["len:number","value:array|string","trailer:string?"],"tags":["array","string","length","max","min"],"requires":["is_string?","add","is_array?"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await (async function(){
    return  Environment.set_global("all_global_functions",function() {
        let acc;
        let env_a;
        acc=new Set();
        env_a=null;
         ( function() {
            let __for_body__407=function(ns) {
                env_a= Environment["get_namespace_handle"].call(Environment,ns);
                return  ( function() {
                    let __for_body__411=function(pset) {
                        if (check_true ((pset && pset["1"]) instanceof Function)){
                            return  acc["add"].call(acc,(pset && pset["0"]))
                        }
                    };
                    let __array__412=[],__elements__410= ( Environment.get_global("pairs"))((env_a && env_a["context"] && env_a["context"]["scope"]));
                    let __BREAK__FLAG__=false;
                    for(let __iter__409 in __elements__410) {
                        __array__412.push( __for_body__411(__elements__410[__iter__409]));
                        if(__BREAK__FLAG__) {
                             __array__412.pop();
                            break;
                            
                        }
                    }return __array__412;
                     
                })()
            };
            let __array__408=[],__elements__406= ( Environment.get_global("namespaces"))();
            let __BREAK__FLAG__=false;
            for(let __iter__405 in __elements__406) {
                __array__408.push( __for_body__407(__elements__406[__iter__405]));
                if(__BREAK__FLAG__) {
                     __array__408.pop();
                    break;
                    
                }
            }return __array__408;
             
        })();
        return acc
    },{ "name":"all_global_functions","fn_args":"[]","description":"Returns a Set object of all accessible functions in the environment, including all namespaces.","usage":[],"tags":["global","function","scope","environment"],"requires":["is_function?","pairs","namespaces"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await (async function(){
    return  Environment.set_global("pretty_print",function(in_struct,report_callout) {
        let in_text;
        let chars;
        let key_words;
        let block_words;
        let conditionals;
        let char;
        let global_lookup;
        let last_opener;
        let operator;
        let next_char;
        let next_char_pos;
        let state;
        let lines;
        let formatted_lines;
        let line_acc;
        let rule;
        let cpos;
        let debug_mode;
        let closers;
        let openers;
        let code_mode;
        let string_mode;
        let escape_state;
        let mode;
        let nl_suppress;
        let skip_for;
        let depth_change;
        let long_string_mode;
        let report;
        let lpos;
        let lnum;
        let argnum;
        let text;
        let word;
        let word_acc;
        let add_char_to_line;
        let next_line;
        let is_whitespace_ques_;
        let indent_string;
        let get_line;
        let calc_next_char;
        in_text= ( function(){
             return   (function(){
                if (check_true ((in_struct instanceof Object))) {
                    return  ( Environment.get_global("as_lisp"))(in_struct)
                } else if (check_true ((in_struct instanceof String || typeof in_struct==='string'))) {
                    return in_struct
                } else {
                    return (""+ in_struct)
                }
            } )() 
        })();
        chars=(in_text).split("");
        key_words= ( function(){
            let __targ__413=( Environment.get_global("*formatting_rules*"));
            if (__targ__413){
                 return(__targ__413)["keywords"]
            } 
        })();
        block_words=["try","progn","progl","progc","do","let","cond"];
        conditionals=["if","when","unless"];
        char=null;
        global_lookup= ( function(){
            let tmp= ( Environment.get_global("all_global_functions"))();
            ;
             ( function() {
                let __for_body__416=function(op) {
                    return  tmp["add"].call(tmp,op)
                };
                let __array__417=[],__elements__415=(key_words|| []);
                let __BREAK__FLAG__=false;
                for(let __iter__414 in __elements__415) {
                    __array__417.push( __for_body__416(__elements__415[__iter__414]));
                    if(__BREAK__FLAG__) {
                         __array__417.pop();
                        break;
                        
                    }
                }return __array__417;
                 
            })();
            return tmp
        })();
        last_opener=null;
        operator=null;
        next_char=null;
        next_char_pos=0;
        state=new Object();
        lines=[];
        formatted_lines=[];
        line_acc=[];
        rule=null;
        cpos=-1;
        debug_mode= ( function(){
            if (check_true (report_callout)){
                return true
            } else {
                return false
            }
        })();
        closers=[")","]","}"];
        openers=["(","[","{"];
        code_mode=0;
        string_mode=1;
        escape_state=0;
        mode=code_mode;
        nl_suppress=false;
        skip_for=null;
        depth_change=0;
        long_string_mode=2;
        report=[];
        lpos=0;
        lnum=0;
        argnum=0;
        text=null;
        word="";
        word_acc=[];
        add_char_to_line=function(c) {
            (line_acc).push((c|| char));
            return lpos=(line_acc && line_acc.length)
        };
        next_line=function() {
            (lines).push((line_acc).join(""));
            lnum=(lines && lines.length);
            depth_change=0;
            return line_acc=[]
        };
        is_whitespace_ques_=function(c) {
            return  ( Environment.get_global("contains?"))(c,[" ","	"])
        };
        indent_string=null;
        get_line=function(rnum) {
            let it;
            it=lines[rnum];
            if (check_true (it)){
                if (check_true ( ( Environment.get_global("ends_with?"))("\n",it))){
                    return it
                } else {
                    return (it+ "\n")
                }
            } else {
                return null
            }
        };
        calc_next_char=function() {
            if (check_true (chars[(1+ cpos)])){
                {
                    next_char_pos=(cpos+ 1);
                     ( function(){
                         let __test_condition__418=function() {
                            return (chars[next_char_pos]&&  is_whitespace_ques_(chars[next_char_pos]))
                        };
                        let __body_ref__419=function() {
                            return next_char_pos+=1
                        };
                        let __BREAK__FLAG__=false;
                        while( __test_condition__418()) {
                              __body_ref__419();
                             if(__BREAK__FLAG__) {
                                 break;
                                
                            }
                        } ;
                        
                    })();
                    return next_char=chars[next_char_pos]
                }
            }
        };
         ( function(){
             let __test_condition__420=function() {
                return (cpos<(chars && chars.length))
            };
            let __body_ref__421=function() {
                cpos+=1;
                char=chars[cpos];
                rule=null;
                if (check_true (char)){
                    {
                        if (check_true ((skip_for&& (skip_for>0)))){
                            skip_for-=1
                        };
                        if (check_true (( char["charCodeAt"]()===92))){
                            escape_state=2
                        } else {
                            escape_state= Math.max(0,(escape_state- 1))
                        };
                        if (check_true (((mode===code_mode)&& (cpos>=next_char_pos)))){
                            {
                                if (check_true ((nl_suppress&& (skip_for===null)))){
                                    {
                                        skip_for=2
                                    }
                                };
                                 calc_next_char()
                            }
                        };
                        if (check_true (((mode===code_mode)&& ( is_whitespace_ques_(char)||  ( Environment.get_global("contains?"))(char,openers)||  ( Environment.get_global("contains?"))(char,closers)|| (char===":")|| (char==="\n"))))){
                            {
                                if (check_true (((word_acc && word_acc.length)>0))){
                                    {
                                        word=(word_acc).join("");
                                        if (check_true ((((last_opener==="(")|| (last_opener==="["))&&  ( Environment.get_global("not"))( ( Environment.get_global("starts_with?"))("\"",word))&&  ( Environment.get_global("not"))( ( Environment.get_global("starts_with?"))("`",word))))){
                                            operator=word
                                        }
                                    }
                                };
                                word_acc=[]
                            }
                        } else {
                            (word_acc).push(char)
                        };
                        if (check_true (((mode===code_mode)&& (char==="}")&&  ( Environment.get_global("not"))(( ( Environment.get_global("last"))(line_acc)==="{"))&&  ( Environment.get_global("not"))( ( Environment.get_global("contains?"))( ( Environment.get_global("last"))(line_acc),closers))&&  ( Environment.get_global("not"))(( ( Environment.get_global("last"))(line_acc)===" "))))){
                             add_char_to_line(" ")
                        };
                        if (check_true (((mode===code_mode)&&  ( Environment.get_global("contains?"))(char,openers)))){
                            last_opener=char
                        };
                        if (check_true (((mode===code_mode)&& ( ( Environment.get_global("contains?"))(char,closers)||  is_whitespace_ques_(char))))){
                            last_opener=null
                        };
                        if (check_true ((skip_for===0))){
                            {
                                nl_suppress=false;
                                skip_for=null
                            }
                        };
                          (function(){
                            if (check_true (((mode===code_mode)&& (char==="\"")))) {
                                {
                                    return mode=string_mode
                                }
                            } else if (check_true (((mode===code_mode)&& ("|"===char)))) {
                                {
                                    return mode=long_string_mode
                                }
                            } else if (check_true (((char==="\"")&& (mode===string_mode)&& (escape_state===0)))) {
                                {
                                    return mode=code_mode
                                }
                            } else if (check_true (((char==="|")&& (mode===long_string_mode)))) {
                                {
                                    return mode=code_mode
                                }
                            } else if (check_true (( ( Environment.get_global("contains?"))(char,openers)&& (mode===code_mode)))) {
                                {
                                    return argnum=0
                                }
                            } else if (check_true (((char===":")&& (mode===code_mode)))) {
                                {
                                    argnum+=1;
                                    return nl_suppress=true
                                }
                            }
                        } )();
                        if (check_true ((mode===code_mode))){
                            {
                                  (function(){
                                    if (check_true ( ( Environment.get_global("contains?"))(char,openers))) {
                                        return depth_change+=1
                                    } else if (check_true ( ( Environment.get_global("contains?"))(char,closers))) {
                                        depth_change-=1
                                    }
                                } )();
                                  (function(){
                                    if (check_true (( is_whitespace_ques_(char)&&  ( Environment.get_global("contains?"))(next_char,closers)&& (argnum>1)&&  ( Environment.get_global("not"))(nl_suppress)))) {
                                        {
                                            rule="r0!";
                                            return  next_line()
                                        }
                                    } else if (check_true (( is_whitespace_ques_(char)&& (word&&  ( Environment.get_global("contains?"))(word,block_words))))) {
                                        {
                                            rule="rb!";
                                             next_line()
                                        }
                                    } else if (check_true (( is_whitespace_ques_(char)&& (argnum>=1)&&  ( Environment.get_global("not"))( ( Environment.get_global("contains?"))( ( Environment.get_global("last"))(line_acc),closers))&& (depth_change>-1)&& (depth_change<2)&&  ( Environment.get_global("contains?"))(operator,conditionals)))) {
                                        {
                                            rule="rC";
                                             next_line()
                                        }
                                    } else if (check_true (( is_whitespace_ques_(char)&& (argnum<2)&& (depth_change<2)&& (lpos<30)&&  ( Environment.get_global("not"))( ( Environment.get_global("contains?"))( ( Environment.get_global("last"))(line_acc),closers))&& ( ( Environment.get_global("not"))( ( Environment.get_global("starts_with?"))("\"",(word|| "")))&&  ( Environment.get_global("not"))( ( Environment.get_global("starts_with?"))("`",(word|| "")))&& (depth_change>-1))&& ((next_char_pos- cpos)<=1)))) {
                                        {
                                             add_char_to_line();
                                            argnum+=1;
                                            rule="r1+"
                                        }
                                    } else if (check_true (( is_whitespace_ques_(char)&& (argnum===0)&& ( ( Environment.get_global("not"))( ( Environment.get_global("starts_with?"))("\"",(word|| "")))&&  ( Environment.get_global("not"))( ( Environment.get_global("starts_with?"))("`",(word|| "")))&& (word&&  global_lookup["has"].call(global_lookup,word))&&  ( Environment.get_global("not"))(("()"===( ( Environment.get_global("last_n"))(2,line_acc)).join("")))&& (depth_change>-1))))) {
                                        {
                                             add_char_to_line();
                                            argnum+=1;
                                            rule="rc"
                                        }
                                    } else if (check_true (( is_whitespace_ques_(char)&&  ( Environment.get_global("not"))(nl_suppress)&&  ( Environment.get_global("not"))((next_char==="{"))&& ((next_char_pos- cpos)<=1)))) {
                                        {
                                            rule="r2!";
                                             next_line();
                                            nl_suppress=true
                                        }
                                    } else if (check_true (( ( Environment.get_global("contains?"))(char,openers)&&  ( Environment.get_global("not"))(nl_suppress)&& (argnum>1)))) {
                                        {
                                            rule="r3!";
                                            nl_suppress=true;
                                             next_line();
                                             add_char_to_line();
                                            argnum=0
                                        }
                                    } else if (check_true (( ( Environment.get_global("contains?"))(char,openers)&& (argnum>1)))) {
                                        {
                                            rule="r3A";
                                             add_char_to_line();
                                            argnum=0
                                        }
                                    } else if (check_true (( is_whitespace_ques_(char)&&  ( Environment.get_global("not"))(nl_suppress)&& (depth_change<0)))) {
                                        {
                                            rule="r4!";
                                             next_line();
                                            argnum=0
                                        }
                                    } else if (check_true (( is_whitespace_ques_(char)&&  ( Environment.get_global("not"))(nl_suppress)&& (lpos>40)))) {
                                        {
                                            rule="r5!";
                                             next_line();
                                            argnum=0
                                        }
                                    } else if (check_true (((char==="{")&&  ( Environment.get_global("not"))( is_whitespace_ques_(chars[(1+ cpos)]))&&  ( Environment.get_global("not"))((chars[(1+ cpos)]==="}"))))) {
                                        {
                                            rule="r6";
                                             add_char_to_line();
                                             add_char_to_line(" ")
                                        }
                                    } else if (check_true (((char===":")&&  ( Environment.get_global("not"))((" "===chars[(1+ cpos)]))))) {
                                        {
                                            rule="r7";
                                             add_char_to_line();
                                             add_char_to_line(" ")
                                        }
                                    } else {
                                        {
                                            rule="r99";
                                             add_char_to_line()
                                        }
                                    }
                                } )()
                            }
                        } else {
                            {
                                rule="rD";
                                 add_char_to_line()
                            }
                        };
                        if (check_true (debug_mode)){
                            {
                                return (report).push( ( function(){
                                    let __array_op_rval__422=cpos;
                                     if (__array_op_rval__422 instanceof Function){
                                        return  __array_op_rval__422(char, ( function(){
                                            if (check_true ((cpos<=next_char_pos))){
                                                return next_char
                                            } else {
                                                return ""
                                            }
                                        })(),lpos,(next_char_pos- cpos),depth_change,mode,argnum, ( function(){
                                            if (check_true (((mode===code_mode)&&  is_whitespace_ques_(char)))){
                                                return "*"
                                            } else {
                                                return ""
                                            }
                                        })(), ( function(){
                                            if (check_true (nl_suppress)){
                                                return " NLS "
                                            } else {
                                                return ""
                                            }
                                        })(), ( function(){
                                            if (check_true (skip_for)){
                                                return skip_for
                                            } else {
                                                return ""
                                            }
                                        })(),rule,word,operator,(line_acc).join("")) 
                                    } else {
                                        return [__array_op_rval__422,char, ( function(){
                                            if (check_true ((cpos<=next_char_pos))){
                                                return next_char
                                            } else {
                                                return ""
                                            }
                                        })(),lpos,(next_char_pos- cpos),depth_change,mode,argnum, ( function(){
                                            if (check_true (((mode===code_mode)&&  is_whitespace_ques_(char)))){
                                                return "*"
                                            } else {
                                                return ""
                                            }
                                        })(), ( function(){
                                            if (check_true (nl_suppress)){
                                                return " NLS "
                                            } else {
                                                return ""
                                            }
                                        })(), ( function(){
                                            if (check_true (skip_for)){
                                                return skip_for
                                            } else {
                                                return ""
                                            }
                                        })(),rule,word,operator,(line_acc).join("")]
                                    }
                                })())
                            }
                        }
                    }
                }
            };
            let __BREAK__FLAG__=false;
            while( __test_condition__420()) {
                  __body_ref__421();
                 if(__BREAK__FLAG__) {
                     break;
                    
                }
            } ;
            
        })();
        if (check_true (debug_mode)){
            {
                 ( function(){
                    let __array_op_rval__423=report_callout;
                     if (__array_op_rval__423 instanceof Function){
                        return  __array_op_rval__423(report,{
                            columns:["CPOS","CHAR","NEXTC","LPOS","NCD","DEPTHC","MODE","ARGNUM","WS?","NLS?","SKIP_FOR","rule","word","op","Line_ACC"]
                        }) 
                    } else {
                        return [__array_op_rval__423,report,{
                            columns:["CPOS","CHAR","NEXTC","LPOS","NCD","DEPTHC","MODE","ARGNUM","WS?","NLS?","SKIP_FOR","rule","word","op","Line_ACC"]
                        }]
                    }
                })()
            }
        };
        if (check_true (((line_acc && line_acc.length)>0))){
            {
                (lines).push((line_acc).join(""))
            }
        };
         ( function() {
            let __for_body__426=function(line_num) {
                text=(""+ lines[line_num]+ "\n");
                if (check_true ((line_num>0))){
                    indent_string= ( Environment.get_global("format_lisp_line"))(line_num,get_line)
                } else {
                    indent_string=""
                };
                return   (function(){
                    lines[line_num]=(""+ indent_string+ text);
                    return lines;
                    
                })()
            };
            let __array__427=[],__elements__425= ( Environment.get_global("range"))((lines && lines.length));
            let __BREAK__FLAG__=false;
            for(let __iter__424 in __elements__425) {
                __array__427.push( __for_body__426(__elements__425[__iter__424]));
                if(__BREAK__FLAG__) {
                     __array__427.pop();
                    break;
                    
                }
            }return __array__427;
             
        })();
        return (lines).join("")
    },{ "name":"pretty_print","fn_args":"(in_struct report_callout)","description":["=:+","The pretty_print function attempts to format the presented input, provided ","either as a string or JSON. The return is a string with the formatted input."],"tags":["format","pretty","lisp","display","output"],"usage":["input:array|string"],"requires":["is_object?","as_lisp","is_string?","split_by","*formatting_rules*","all_global_functions","push","join","contains?","ends_with?","not","starts_with?","last","last_n","format_lisp_line","range"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await Environment.set_global("get_dependencies",async function(global_symbol,_deps,_req_ns,_externs) {
    let comps;
    let target_symbol;
    let namespace;
    let added;
    let externals;
    let required_namespaces;
    let dependencies;
    let ns_env;
    let sym_meta;
    comps=(global_symbol).split("/");
    target_symbol=await (async function(){
        if (check_true (((comps && comps.length)>1))){
            return await (await Environment.get_global("second"))(comps)
        } else {
            return await (await Environment.get_global("first"))(comps)
        }
    })();
    namespace=await (async function(){
        if (check_true (((comps && comps.length)>1))){
            return await (await Environment.get_global("first"))(comps)
        } else {
            return null
        }
    })();
    added=false;
    externals=(_externs|| new Set());
    required_namespaces=(_req_ns|| new Set());
    dependencies=(_deps|| new Set());
    ns_env=await Environment["get_namespace_handle"].call(Environment,await (await Environment.get_global("current_namespace"))());
    sym_meta=await ns_env["eval"].call(ns_env,await (async function(){
         return ["=:meta_for_symbol",target_symbol,true] 
    })());
    await async function(){
        if (check_true ((namespace&& sym_meta&& ((sym_meta && sym_meta.length)>0)))) {
            return await (async function() {
                let __for_body__431=async function(m) {
                    if (check_true (((m && m["namespace"])===namespace))){
                        {
                            sym_meta=m;
                            return __BREAK__FLAG__=true;
                            return
                        }
                    }
                };
                let __array__432=[],__elements__430=sym_meta;
                let __BREAK__FLAG__=false;
                for(let __iter__429 in __elements__430) {
                    __array__432.push(await __for_body__431(__elements__430[__iter__429]));
                    if(__BREAK__FLAG__) {
                         __array__432.pop();
                        break;
                        
                    }
                }return __array__432;
                 
            })()
        } else {
            {
                sym_meta=await (await Environment.get_global("first"))(sym_meta);
                namespace=(sym_meta && sym_meta["namespace"])
            }
        }
    } ();
    if (check_true ((namespace&& await (await Environment.get_global("not"))(await required_namespaces["has"].call(required_namespaces,namespace))))){
        await required_namespaces["add"].call(required_namespaces,namespace)
    };
    if (check_true ((sym_meta && sym_meta["externals"]))){
        {
            await (async function() {
                let __for_body__435=async function(external_ref) {
                    return await externals["add"].call(externals,external_ref)
                };
                let __array__436=[],__elements__434=(sym_meta && sym_meta["externals"]);
                let __BREAK__FLAG__=false;
                for(let __iter__433 in __elements__434) {
                    __array__436.push(await __for_body__435(__elements__434[__iter__433]));
                    if(__BREAK__FLAG__) {
                         __array__436.pop();
                        break;
                        
                    }
                }return __array__436;
                 
            })()
        }
    };
    if (check_true ((sym_meta&& namespace))){
        {
            await (async function() {
                let __for_body__439=async function(required_symbol) {
                    if (check_true (await (await Environment.get_global("not"))(await dependencies["has"].call(dependencies,required_symbol)))){
                        {
                            added=true;
                            return await dependencies["add"].call(dependencies,required_symbol)
                        }
                    }
                };
                let __array__440=[],__elements__438=(sym_meta && sym_meta["requires"]);
                let __BREAK__FLAG__=false;
                for(let __iter__437 in __elements__438) {
                    __array__440.push(await __for_body__439(__elements__438[__iter__437]));
                    if(__BREAK__FLAG__) {
                         __array__440.pop();
                        break;
                        
                    }
                }return __array__440;
                 
            })();
            if (check_true (added)){
                await (async function() {
                    let __for_body__443=async function(required_symbol) {
                        return await (await Environment.get_global("get_dependencies"))(required_symbol,dependencies,required_namespaces,externals)
                    };
                    let __array__444=[],__elements__442=(sym_meta && sym_meta["requires"]);
                    let __BREAK__FLAG__=false;
                    for(let __iter__441 in __elements__442) {
                        __array__444.push(await __for_body__443(__elements__442[__iter__441]));
                        if(__BREAK__FLAG__) {
                             __array__444.pop();
                            break;
                            
                        }
                    }return __array__444;
                     
                })()
            }
        }
    };
    if (check_true ((null==_deps))){
        {
            return {
                dependencies:await (async function(){
                     return await (await Environment.get_global("to_array"))(dependencies) 
                })(),namespaces:await (async function(){
                     return await (await Environment.get_global("to_array"))(required_namespaces) 
                })(),externals:await (async function(){
                     return await (await Environment.get_global("to_array"))(externals) 
                })()
            }
        }
    }
},{ "name":"get_dependencies","fn_args":"(global_symbol _deps _req_ns _externs)","description":["=:+","<br><br>Given a symbol in string form, returns the global dependencies that the ","symbol is dependent on in the runtime environment.  The return structure is in ","the form:```{\n  dependencies: []\n  namespaces: []   \n  externals: ","[]\n}```<br><br>The return structure will contain all the qualified and ","non-qualified symbols referenced by the provided target symbol, plus the ","dependencies of the required symbols.  <br>The needed namespace environments ","are also returned in the `namespaces` value.\n<br>References to external global ","Javascript values are listed in the `externals` result.  These values are ","defined as dependencies for the provided symbol, but are not defined in a Juno ","Environment.<br> "],"usage":["quoted_symbol:string"],"tags":["dependencies","tree","required","dependency"],"requires":["split_by","second","first","current_namespace","not","get_dependencies","to_array"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await (async function(){
    return  Environment.set_global("pad_left",function(value,pad_amount,padchar) {
        return  ( function() {
            {
                 let __call_target__=(""+ value), __call_method__="padStart";
                return  __call_target__[__call_method__].call(__call_target__,pad_amount,padchar)
            } 
        })()
    },{ "name":"pad_left","fn_args":"(value pad_amount padchar)","description":["=:+","<br><br>Given a value (number or text). an amount to pad, and an optional ","character to use a padding value, returns a string that will contain pad amount ","leading characters of the padchar value.<br><br>#### Example <br>```(pad_left ","23 5 `0)\n<- \"00023\"\n\n(pad_left 4 5)\n<- \"    4\"```<br> "],"usage":["value:number|string","pad_amount:number","padchar:?string"],"tags":["pad","string","text","left"],"requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await Environment.set_global("symbol_dependencies",async function(symbol_array) {
    if (check_true ((symbol_array instanceof Array))){
        {
            {
                let dependencies;
                let ns_deps;
                let externals;
                let deps;
                dependencies=new Set();
                ns_deps=new Set();
                externals=new Set();
                deps=null;
                await (async function() {
                    let __for_body__447=async function(sym) {
                        return await (await Environment.get_global("get_dependencies"))(sym,dependencies,ns_deps,externals)
                    };
                    let __array__448=[],__elements__446=symbol_array;
                    let __BREAK__FLAG__=false;
                    for(let __iter__445 in __elements__446) {
                        __array__448.push(await __for_body__447(__elements__446[__iter__445]));
                        if(__BREAK__FLAG__) {
                             __array__448.pop();
                            break;
                            
                        }
                    }return __array__448;
                     
                })();
                return {
                    dependencies:await (async function(){
                         return await (await Environment.get_global("to_array"))(dependencies) 
                    })(),namespaces:await (async function(){
                         return await (await Environment.get_global("to_array"))(ns_deps) 
                    })(),externals:await (async function(){
                         return await (await Environment.get_global("to_array"))(externals) 
                    })()
                }
            }
        }
    }
},{ "name":"symbol_dependencies","fn_args":"(symbol_array)","description":["=:+","Given an array of symbols in string form, returns the global dependencies that the ","symbols are dependent on in the runtime environment.  The return structure is in ","the form:```{\n  dependencies: []\n  namespaces: []\n}```<br><br>The return ","structure will contain all the qualified and non-qualified symbols referenced ","by the provided target symbol, plus the dependencies of the required ","symbols.  <br>The needed namespace environments are also returned in the ","namespaces value.<br> "],"usage":["quoted_symbol:array"],"tags":["dependencies","tree","required","dependency"],"requires":["is_array?","get_dependencies","to_array"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await (async function(){
    return  Environment.set_global("keyword_mapper",function(token) {
        if (check_true ( ( Environment.get_global("contains?"))(token,( Environment.get_global("*formatting_rules*.keywords"))))){
            return "keyword"
        } else {
            return "identifier"
        }
    },{ "name":"keyword_mapper","fn_args":"(token)","requires":["contains?","*formatting_rules*"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await Environment.set_global("with_each_entry",async function(...args) {
    let binding_sym;
    let iteration_form;
    let body_forms;
    binding_sym=(args && args["0"] && args["0"]["0"]);
    iteration_form=(args && args["1"]);
    body_forms=await (await Environment.get_global("slice"))(args,2);
    return ["=:let",[["=:__data_val__",iteration_form],[binding_sym,"=:nil"],["=:__next_val__","=:nil"]],["=:if",["=:is_function?","=:__data_val__.next"],["=:while",["=:=","=:__next_val__",["=:->","=:__data_val__","next"]],["=:progn",["=:=",binding_sym,"=:__next_val__.value"],].concat(body_forms,[["=:if","=:__next_val__.done",["=:break"]]])],["=:throw","=:TypeError","with_each_entry: iteration_form is not an iterator"]]]
},{ "eval_when":{ "compile_time":true
},"name":"with_each_entry","macro":true,"fn_args":"[(binding_sym) iteration_form \"&\" body_forms]","description":["=:+","Given a binding symbol, a form or symbol that resolves to an iteration ","object with a `next` function, and the body forms to be used with the ","binding_symbol, will call the binding forms for every value in the iterator, ","with the binding symbol being set to the next value each time through the ","loop.<br><br>#### Example <br>```(with_each_value (entries)\n   (-> ","request_headers `entries) ;; will return an iterator\n   (if (== entries.0 ","\"content-type\")\n       (= content_type entries.1)))```<br><br><br> "],"usage":["binding_sym:array","iteration_form:*","body_forms:*"],"tags":["iteration","loop","iterator","entries","flow","values"],"requires":["slice"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
});
await (async function(){
    await (async function(){
        return  Environment.set_global("operating_system",function() {
            return  ( Environment.get_global("resolve_path"))(["build","os"],Deno)
        },{ "name":"operating_system","fn_args":"[]","description":"Returns a text string of the operating system name: darwin, linux, windows","usage":[],"tags":["os","environment","build","platform","env"],"requires":["resolve_path"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
    })
})();
await (async function(){
    return  Environment.set_global("platform_architecture",function() {
        return  ( Environment.get_global("resolve_path"))(["build","arch"],Deno)
    },{ "name":"platform_architecture","fn_args":"[]","description":"Returns a text string of the underlying hardware architecture, for example aarch64 or X86_64.","usage":[],"tags":["os","platform","architecture","hardware","type","build"],"requires":["resolve_path"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await (async function(){
    return  Environment.set_global("platform",function() {
        return Deno["build"]
    },{ "name":"platform","fn_args":"[]","description":"Returns an object with keys for 'target', 'arch', 'os' and 'vendor'.  ","usage":[],"tags":["os","platform","architecture","hardware","type","build"],"requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
await (async function(){
    return  Environment.set_global("exit",function(return_code) {
        return  Deno.exit(return_code)
    },{ "name":"exit","fn_args":"(return_code)","description":"Exits the system and returns the provided integer return code","usage":["return_code:?number"],"tags":["exit","quit","return","leave"],"requires":[],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
return await Environment.set_global("permissions",async function() {
    let perms;
    perms=["run","env","write","read","net","ffi","sys"];
    return await (await Environment.get_global("to_object"))(await (async function() {
        let __for_body__451=async function(p) {
            return await (async function(){
                let __array_op_rval__454=p;
                 if (__array_op_rval__454 instanceof Function){
                    return await __array_op_rval__454(await (async function(){
                        let __targ__453=await Deno.permissions.query({
                            name:p
                        });
                        if (__targ__453){
                             return(__targ__453)["state"]
                        } 
                    })()) 
                } else {
                    return [__array_op_rval__454,await (async function(){
                        let __targ__453=await Deno.permissions.query({
                            name:p
                        });
                        if (__targ__453){
                             return(__targ__453)["state"]
                        } 
                    })()]
                }
            })()
        };
        let __array__452=[],__elements__450=perms;
        let __BREAK__FLAG__=false;
        for(let __iter__449 in __elements__450) {
            __array__452.push(await __for_body__451(__elements__450[__iter__449]));
            if(__BREAK__FLAG__) {
                 __array__452.pop();
                break;
                
            }
        }return __array__452;
         
    })())
},{ "name":"permissions","fn_args":"[]","requires":["to_object"],"externals":["Error","SyntaxError","Array","ReferenceError","Set","Object","TypeError","clone","RangeError","Math","parseInt","console","subtype","TextEncoder","TextDecoder","Uint8Array","RegExp","String","isNaN","Function","LispSyntaxError","window","Blob","fetch","EvalError","URL","Intl","Date","Deno","Promise","setTimeout"],"source_name":"core.lisp"
})
})();
return true
}
}
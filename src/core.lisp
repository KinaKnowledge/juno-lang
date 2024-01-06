
;; Once the Alpha Environment is brought up this file should be imported into it

;; Initial build of environment
;; Build all forms in the starter environment
;; up to random_int

;; add_escape_encoding is used for quoting purposes and providing escaped
;; double quotes to quoted lisp in compiled Javascript

;; **
   

;; setup the special operator definitions of the compiler

(defglobal special_definitions
   [{ name: "+"
      usage: ["arg0:*" "argN:*"]
      description: (+ "The plus operator takes an arbitrary number of arguments and attempts to 'add' them together. "
                      "Of all the mathematical operators, this is the only one that is overloaded in terms of the "
                      "type of values it can take.  The adding operation undertaken by the + operator is determined "
                      "by the first argument in the argument list. The operator accepts the following types: <br>"
                      "numbers, Objects, arrays and Strings.<br> "
                      "If the argument type is a number (or declared to be a number), then the normal infix " 
                      "mathematical expression will be constructed in the emitted javascript, otherwise the synchronous " 
                      "add function will be used to handle the addition in a dynamic fashion during execution. <br><br>"
                      "Adding Objects<br>"
                      "When two objects are added together, a new Object is constructed with the keys and values from "
                      "each object in successive order from the argument list.  If a later object contains the same "
                      "key as an earlier object, the later object's value will be used and will overwrite the earlier "
                      "value of the same key. <br>Example: (+ { abc: 123 def: 456 } { abc: 789 }) -> { abc: 789 def: 456 }<br>"
                      "If a non-object type is encountered after starting with an object it is ignored.<br>"
                      "<br>Adding Arrays<br>"
                      "If an array is the first argument to the operator, all subsequent argument values are appended "
                      "to the first array and the first array is returned as the result.  The types of the subsequent "
                      "arguments are not interrogated unlike with Object addition, and are simply concatenated to the "
                      "first argument.  <br>Example: (+ [ 1 2 3 ] [ 4 5 6] 7 8) <-  [ 1 2 3 [ 4 5 6 ] 7 8 ]<br>"
                      "<br>Adding Strings<br>"
                      "A new string is returned as a result of adding all subsequent arguments together.  If a subsequent "
                      "argument is a string, or is an object with a toString method defined, it is appended to the result "
                      "as expected.  Otherwise, the default string representation in the prototype chain will be used, "
                      "which may not be what is expected.<br>" 
                      "Example: ```(+ \"This is the result: \" (fn (v) (+ 1 2))) <- \"This is the result: async " 
                      "function(v) {\n return (1+ 2)\n}\"```<\n"
                      "Example: ( + \"1\" \"2\" ) <- \"12\" <br>"
                      "Example: (+ \"John\" \"Jingleheimer\") <- \"JohnJingleheimer\"<br>"
                      "Example: (+ \"An object:\" { abc: 123 }) <- \"An object: [object Object]\"<br>")
      tags: ["special" "add" "+" "addition" "arithmetic" ] 
      }
    { name: "-"
      usage: ["arg0:*" "argN:*"]
      description: "Subtracts from the first argument all subsequent arguments and returns the result."
      tags: ["special" "subtract" "-" "arithmetic" ] }
    { name: "/"
      usage: ["dividend:number" "argN:number"]
      description: "Arithmetically divides the first argument (dividend) by all subsequent arguments (divisors) and returns the result."
      tags: ["special" "division" "divide" "arithmetic" ]
      }
    { name: "*"
      usage: ["arg0:number" "argN:number"]
      description: "Multiplies the first argument with all subsequent arguments, returning the result."
      tags: ["special" "multiplication" "arithmetic" ] }
    { name: "**"
      usage: ["base:number" "exponent:number"]
      description: "The exponentiation operator raises the first argument to the power of the second argument."
      tags: ["special" "exponent" "base" "power" "arithmetic" ] }
    { name: "%"
      usage: ["dividend:number" "divisor:number"]
      description: "Modulo (Remainder) divides the first argument by the second argument and returns the remainder from the division operation."
      tags: ["special" "remainder" "modulo" "division" "arithmetic" ] }
    { name: "<<"
      usage: ["value:number" "amount_to_shift_left:number"]
      description: "The << operator performs a leftward shift of the bits of the first argument by the amount of the second argument."
      tags: ["special" "shift" "bit" "left"]
      }
    { name: ">>"
      usage: ["value:number" "amount_to_shift_right:number"]
      description: "The << operator performs a rightward shift of the bits of the first argument by the amount of the second argument."
      tags: ["special" "shift" "bit" "right"]
      }
     { name: "and"
       usage: ["arg0:*" "argN:*"]
       description: (+ "Each argument to the and operator is evaluated, and upon the first value that is a Javascript false "
                       "(or an equivalent false, such as nil, undefined or 0), the encountered false is returned.  If all values "
                       "are equivalent to true , then the final argument is returned. Equivalent to && in Javascript.")
       tags: ["logic" "condition" "true" "false" "&&"]
      }
     { name: "or"
       usage: ["arg0:*" "argN:*"]
       tags: ["logic" "condition" "true" "false" "||"]
       }
     { name: "apply"
       usage: ["function_to_call:function" "arg0:*" "argN:array"]
       description: (+ "Apply calls the specified function (first argument) with the subsequent arguments.  The last argument "
                       "must be an array, which contains the remaining arguments. <br>" 
                       "Example: (apply add 1 2 [ 3 4 5]) <- 15<br>")
       tags: ["function" "arguments" "array" "call"] 
       }
     { name: "call"
       usage: ["target:object" "function_to_call:text" "argsN:*" ]
       description: (+ "Given a target object, a function to call, calls the function in the target object with the target object as the this value. " 
                       "The remaining arguments are provided as arguments to the method being called. A synonym for call is the -> operation."
                       "The result of the call is returned.")
       tags: ["function" "call" "->" "this" "object"] }
     
     { name: "->"
       usage: ["target:object" "function_to_call:text" "argsN:*" ]
       description: (+ "Given a target object, a function to call, calls the function in the target object with the target object as the this value. " 
                       "The remaining arguments are provided as arguments to the method being called. A synonym for -> is the call operation."
                       "The result of the call is returned.")
       tags: [ "object" "function" "call" "->" "this" ] }
     
     { name: "set_prop"
       usage: ["place:object" "key0:string|number" "value0:*" "keyN:string" "valueN:*"]
       description: (+ "Sets a property on the designated place (an object) using the key as the property name and the provided value as the value."
                       "The operator returns the object that was modified.") }
     { name: "prop"
       usage: ["place:object" "key:string|number"]
       description: (+ "Returns a property on the designated place (an object) using the key as the property name.  If the key isn't found, undefined is returned.") }
     { name: "="
       usage: ["target:symbol" "value:*"]
       description: (+ "Sets the target symbol to the provided value and returns the value.   A Reference error is thrown if the symbol is undeclared.")
       tags: [`assignment `set `value ]  }
     { name: "setq"
       usage: ["target:symbol" "value:*"]
       description: (+ "Sets the target symbol to the provided value and returns the value.   A Reference error is thrown if the symbol is undeclared.")
       tags: [`assignment `set `value ] }
     { name: "=="
       usage: ["value0:*" "value1:*"]
       description: (+ "Represents the Javascript === operator and returns true if the operands are equal and of the same type, otherwise false.")
       tags: [`equality `equivalence `equal `eq ] }
     { name: "eq"
       usage: ["value0:*" "value1:*"]
       description: (+ "Represents the Javascript == operator and returns true if the operands are \"equal\".  This is a looser definition of equality "
                       "then ===, and different types can be considered equal if the underlying value is the same.<br>"
                       "Example: (== 5 \"5\") is considered the same.")
       tags: [`equality `equivalence `equal `eq ] }
     { name: ">"
       usage: ["value_left:number" "value_right:number"]
       description: (+ "Returns true if the left value is greater than the right value, otherwise returns false.")
       tags: [`equivalence `equal `comparison `gt  ] }
     { name: "<"
       usage: ["value_left:number" "value_right:number"]
       description: (+ "Returns true if the left value is smaller than the right value, otherwise returns false.")
       tags: [`equivalence `equal `comparison `lt  ] }
      { name: ">="
       usage: ["value_left:number" "value_right:number"]
       description: (+ "Returns true if the left value is greater than or equal to the right value, otherwise returns false.")
       tags: [`equivalence `equal `comparison `gt  ] }
      { name: "<="
       usage: ["value_left:number" "value_right:number"]
       description: (+ "Returns true if the left value is less than or equal to the right value, otherwise returns false.")
       tags: [`equivalence `equal `comparison `gt  ] }
      { name: "new"
       usage: ["constructor:function" "argN:*"]
       description: "Given a constructor function and arguments, returns an instantiated object of the requested type."
       tags: [`constructor `instantiation `object `class  ] }
      
      { name: "progn"
        usage: ["form0:*" "form1:*" "formN:*"]
        description: `(+ "The block operator evaluates all forms in the order they were provided and returns the last value."
                         "If the block operator is a top level form, then the forms are evaluated as top level forms, in "
                         "which the form is compiled and immediately evaluated. The results of any side effects of the "
                         "compiled form are therefore available to subsequent processing.<br>"
                         "The block operator introduces a new lexical scope boundary (in JS the equivalence { } ) such that symbols "
                         "defined locally to the block via defvar will not be visible to blocks above it, only subforms and "
                         "blocks defined within it.")
        tags: ["block" "progn" "do" "scope"] }
      { name: "do"
        usage: ["form0:*" "form1:*" "formN:*"]
        description: `(resolve_path [ `definitions `progn ] (Environment.get_namespace_handle `core))
        tags: ["block" "progn" "do" "scope"] }
      { name: "progl"
        usage: ["form0:*" "form1:*" "formN:*"]
        description: (+ "Like progn, progl is a block operator, but doesn't establish a new scope boundary in the contained forms."
                        "It also doesn't return any values, but acts as a means by which to manipulate quoted forms (for example in a macro).")
        tags: ["block" "progn" "do"] }
      { name: "break"
        usage: []
        description: (+ "The break operator is a flow control mechanism used to stop the iteration of a for_each or while " 
                        "loop. It should be used as a direct subform of the for_each or while.") 
        tags: ["block" "flow" "control" ] }
      { name: "inc" 
        usage: ["target:symbol" "amount:?number" ]
        description: (+ "Increment the target symbol by the default value of 1 or the provided amount as a second argument. "
                        "The operator returns the new value of the target symbol.")
        tags: ["increment" "count" "dec"] }
      { name: "dec" 
        usage: ["target:symbol" "amount:?number" ]
        description: (+ "Decrement the target symbol by the default value of 1 or the provided amount as a second argument. "
                        "The operator returns the new value of the target symbol.")
        tags: ["decrement" "count" "inc"] }
      { name: "try"
        usage: ["expression:*" "error-clause0:array" "error-clauseN:array"]
        description: (+ "An expression or block surrounded by a try-catch error clause which throws an Error "
                        "or subclass of Error is checked against all (but at least 1) catch expressions that match the type " 
                        "of error which has been thrown. If the error type is matched by a handler for that type, the catch "
                        "expression is evaluated. If a handler for the error type or the error's prototype chain isn't "
                        "found, the exception is rethrown, for potential interception by handlers further up the stack "
                        "heirarchy.  In the following example, the specific error thrown is caught locally.  If an error "
                        "was thrown that wasn't specifically Deno.errors.NotFound, the error would be rethrown: ```"
                        "(try\n"
                        "   (write_text_file \"/will/not/work.txt\" \"No permissions\")\n"
                        "   (catch Deno.errors.NotFound (e)\n"
                        "     (+ \"CAUGHT: type: \" (subtype e) \"MESSAGE: \" e.message)))```"
                        "<- \"CAUGHT: type:  NotFound MESSAGE:  No such file or directory (os error 2), open '/will/not/work.txt'\"<br>\n"
                        "An example of multiple catches for the same try block:```"
                        "(try\n"
                        "  (throw Error \"ERROR MESSAGE\")\n"
                        "  (catch TypeError (e)\n"
                        "    (progn\n"
                        "      (log \"Caught TypeError: \" e.message)\n"
                        "      \"ERROR 1\"))\n"
                        "  (catch Error (e)\n"
                        "    (progn\n"
                        "        (log \"Caught BaseError: \" e.message)\n"
                        "        \"ERROR 2\")))```"
                        "<- \"ERROR 2\"<br><br>The try-catch constructs returns the last value of the try block "
                        "or the return value from a matched catch block, otherwise there is no local return.<br>Example:```"
                        "(let\n"
                        "   ((result (try\n"
                        "              (throw Error \"Invalid!\") ; just throw to demonstrate the catch return\n"
                        "              (catch Error (e)\n"
                        "                  e.message))))\n" 
                        "   result)```"
                        "<- \"Invalid!\"")
        tags: ["catch" "error" "throw" "flow" "control"]
        }
      { name: "throw"
        usage: ["type:symbol" "message:string"]
        description: (+ "Given a type as a symbol and a message, constructs an object instance of the specified type " 
                        "and then throws the object.  The thrown object should be lexically enclosed in a try-catch "
                        "form otherwise the unhandled throw may cause an exit of the runtime (dependent on the "
                        "runtime environment behavior for uncaught objects.<br>See also: try<br>")
        tags: ["flow" "control" "error" "exceptions" "try" "catch" ] 
        }
      { name: "catch"
        usage: ["error_type:*" "allocation:array" "expression:*"]
        description: `(resolve_path [ `definitions `try ] (Environment.get_namespace_handle `core))
        tags: ["flow" "control" "error" "exceptions" "try" "throw" ]
        }
      { name: "let"
        usage: ["allocations:array" "declarations:?expression" "expression0:*" "expressionN:*"]
        description: (+ "Let is the primary means in which to allocate new bindings, and operate on the declared "
                        "bindings. The binding forms are evaluated sequentially, but the declared symbols are "
                        "available for all allocation forms, regardless of position in the sequence of binding "
                        "forms.  Once all the bindings have been evaluated, the expressions are evaluated in an "
                        "implicit progn block, with the result of the evaluation of the last expression being "
                        "returned to the caller.  Note that even though a symbol binding may be accessible to "
                        "all expressions in the allocation forms, the referenced symbol may not be initialized "
                        "and have a value of undefined, so caution must be taken to not reference values in "
                        "prior to initialization.  Syntactically, all symbols allocated in let must be defined "
                        "an initial value, and so the form (let ((a)) (= a 1)) is invalid.<br>"
                        "<br>Example:```"
                        "(let\n"
                        "  ((a 2)      ; b, and f are visible at this point but b and f are undefined\n"
                        "   (f (fn ()  ; when f is called, a and b will be defined and have value\n"
                        "        (* a b)))\n"
                        "   (b 21))    ; once b's init form completes b will be set to the value 21\n"
                        "  (log \"a is: \" a \" b is: \" b)   ; first block expression - all allocatoins complete\n"
                        "  (f))         ; last block expression, f will be called and return 42```"
                        "<- 42<br>"
                        "Note that the above example doesn't contain an optional declaration form, "
                        "which must come after the allocations and before the block expressions.<br><br>"
                        "Another consideration when using let is that within the allocation forms, any references to "
                        "symbols that are lexically scoped outside the let have their values available.  If the contained "
                        "let re-binds an existing symbol, the new binding will have lexical precedence and the value "
                        "of the rebound symbol will be determined by the result of the init-form of the allocation."
                        "This same rule applies to global values: if a let rebinds a global symbol in an allocation, "
                        "the symbol referenced in the let scope will be the local value, and not the global.  This is "
                        "defined as shadowing.<br>"
                        "Example: ```"
                        "(let\n"
                        "  ((a_binding 1))\n"
                        "  (log \"outer: a_binding: \" a_binding)\n"
                        "  (let ;; start inner let\n"
                        "     ((b_binding 2)\n"
                        "      (a_binding 3))  ;  a is rebound to 3\n"
                        "     (log \"inner: a_binding: \" a_binding \" b_binding: \" b_binding)\n"
                        "     a_binding)\n"
                        "  (log \"outer: a_binding: \" a_binding) ; outer binding again\n"
                        "  a_binding)\n"
                        "out: \"outer: a_binding: \" 1 \n"
                        "out: \"inner: a_binding: \" 2 \"b_binding: \" 3\n"
                        "out: \"outer: a_binding: \" 1 ```<br>"
                        "Declarations can be placed after the allocation form and prior to the "
                        "expressions comprising the block:```"
                        "(defun handler (options)\n"
                        "   (let\n"
                        "      ((validator options.validator)\n"
                        "       (user_input (request_user_input \"Enter your value\")))\n"
                        "      (declare (function validator))\n"
                        "      (validator user_input)))```"
                        "<br>In the above the declare provides an optimization hint for the "
                        "compiler.  Without the declare, the compiler would have to insert "
                        "code that checks at runtime whether or not the options.validator value "
                        "is a function prior to calling it, resulting in less execution efficiency. ")
        tags: ["compiler" "allocation" "symbol" "initializing" "scope" "declaration"]
                 }
      {
          name: "defvar"
          usage: ["name:symbol" "value:*"]
          description: (+ "Define a symbol in the local block scope. The operation doesn't have a return value "
                          "and a SyntaxError will be thrown by the compiler if the result of a defvar operation "
                          "is used as part of an assignment form.")
          tags: ["allocation" "define" "var" "reference" "symbol"]
      }
      { name: "defconst"
        usage: ["name:symbol" "value:*"]
        description: (+ "Define a constant in either the local scope or global scope.  The defconst operator "
                        "can be used in both subforms and at the toplevel to specify that a symbol value be "
                        "treated as a constant.  When top-level, the metadata will indicate that the "
                        "defined symbol is a constant.  Any attempted changes to the value of the symbol "
                        "will result in a TypeError being thrown.<br>"
                        "Example:```"
                        "(defconst ghi \"Unchanging\")\n"
                        "<- \"Unchanging\"\n\n"
                        "(= ghi \"Hi there\")\n"
                        "<- TypeError Assignment to constant variable ghi```<br>")
        tags: ["allocation" "symbol" "define" "constant" "const" ] }
      { name: "while"
        usage: ["test_expression:*" "body_expression:array" ]
        description: (+ "The while operator checks the return value of a test_expression and if the result of the " 
                        "test is true (or a result equivalent to true), it will then evaluate the body expression. "
                        "If the result is false, then the while loop doesn't evaluate the body_expression and "
                        "completes.  Once the body expression is evaluated, the test expression will be "
                        "evaluated again and the cycle will continue, potentially forever, so it is important "
                        "to be careful to have a means to break out or the execution environment may not "
                        "ever return.  The body of the while is not a block, so if there are multiple "
                        "expressions to be evaluated as part of the body expression they must be wrapped "
                        "in a progn block operator. The break operator can be used to `break out` of the "
                        "loop in addition to the test expression returning false.<br>There is no return "
                        "value from a while loop; it should be considered undefined.<br>Example:```"
                        "(let\n"
                        "  ((i 10)\n"
                        "   (count 0))\n"
                        "  (while (> i 0)\n"
                        "    (progn\n"
                        "      (inc count i)\n"
                        "      (dec i)))\n"
                        "  ; note: there is no return value from while\n"
                        "  count)\n"
                        "<- 55```")
        tags: ["flow" "control" "loop" "break" "for_each"] 
        }
      { name: "for_each"
        usage: ["allocation_form" "body_expression:array"]
        description: (+ "The for_each operator provides a simple loop variable that allocates a "
                        "symbol which is assigned the next value in the returned array from the "
                        "init form in the allocation. It then evaluates the body expression "
                        "with the symbol in scope.  It will continue to loop, with the allocated "
                        "symbol being defined successive values until the end of the array "
                        "is reached, or a (break) operator is encountered in the body "
                        "expression. Unlike while, the for_each operator is a collector, and "
                        "all values returned from the body_expression will be returned as an "
                        "array from for_each.<br>Example:```"
                        "(for_each (r (range 5))\n"
                        "     (* r 2))\n"
                        "<- [0 2 4 6 8]```<br>")
        tags: ["flow" "control" "loop" "break" "while"] }
      { name: "if"
        usage: ["test_form:*" "if_true:*" "if_false:*"]
        description: (+ "The conditional if operator evaluates the provided test form "
                        "and if the result of the evaluation is true, evaluates and returns "
                        "the results of the if_true form, otherwise the if form will "
                        "evaluate and return the result of the if_false form.<br>"
                        "Example:```"
                        "(progn\n"
                        "   (defvar name (request_user_input \"Enter your name:\"))\n"
                        "   (if (blank? name)\n"
                        "        \"No Name Entered\"\n"
                        "        (+ \"Hello \" name)))\n"
                        "```")
        tags: ["flow" "control" "condition" "logic" "cond" "branching"]
        }
      { name: "cond"
        usage: ["test_expr0:*" "if_true_expr0:*" "test_expr1:*" "if_true_expr1:*" "test_exprN:*" "if_true_exprN:*"]
        description: (+ "The cond operator evaluates test expressions sequentially, until either a true value is "
                        "returned or the end of the test expressions are reached.  If a test expression returns "
                        "true, the if_true expression following the test expression is evaluated and the result "
                        "returned.  If no expressions match, then nil is returned.  There is a special keyword "
                        "available in the cond form, else, which is syntactic sugar for true, that can be used "
                        "to always have a default value.  The else or true test expression should always be the "
                        "final test expression otherwise a SyntaxError will result. <br>Example:```"
                        "(let\n"
                        "  ((name (request_user_input \"Enter your first name name:\")))\n"
                        "  (cond\n"
                        "    (blank? name)  ; first test\n"
                        "    \"Hello there no-name!\"\n"
                        "    (< (length name) 12)  ; second test\n"
                        "    (+ \"Hello there \" name \"!\")\n"
                        "    else  ; the default\n"
                        "    (+ \"Hello there \" name \"! Your first name is long.\")))```<br>")
        tags: ["flow" "control" "condition" "logic" "if" "branching"] 
        }
      {
          name: "fn"
          usage: ["arguments:array" "body_expression:*"]
          description: (+ "There are multiple types of functions that can be created depending on the requirements of the "
                          "use case:<br>"
                          "The lambda and fn operators create asynchronous functions. The fn is shorthand for lambda and can be used interchangably.<br>"
                          "The function keyword creates a synchronous function. <br>"
                          "The => operator creates Javascript arrow functions.<br>"
                          "All definitions return a form which contains the compiled body expression. The provided argument array maps  "
                          "the symbol names to bound symbols available within the body expression. The body expression is evaluated "
                          "with the bound symbols containing the values of arguments provided at time the function is called and the "
                          "result of the body expression is returned from the function call.<br>"
                          "Typically, the body expression is a progn with multiple forms, however, this is not always necessary "
                          "if the function being defined can be contained in a single form.  With the exception of arrow functions, "
                          "functions always establish a new block scope, and any arguments that have the same symbolic names as globals " 
                          "or variables in the closure that defines the function will be shadowed.<br>"
                          "<br>"
                          "Once defined, the function is stored in compiled form, meaning that if inspected, the javascript that comprises "
                          "function will be returned as opposed to the source code of the function.<br>"
                          "There is a special operator for the arguments that can be used to capture all remaining arguments of a "
                          "function, the quoted &.  If the `& is included in the argument list of a function, all remaining run time values at "
                          "the index of the `& operator will be returned as part of the symbol following the `& operator.  This symbol should be "
                          "the last symbol in a argument list.<br>"
                          "Example of an asynchronous function:```"
                          "(fn (a b)     ;; a and b are the arguments that are bound\n"
                          "   (/ (+ a b) 2)) ;; the body expression that acts on the bound arguments a and b```<br><br>"
                          "Example with the ampersand argument operator used in a synchronous function:```"
                          "(function (initial `& vals)\n"
                          "   (/ (+ initial (apply add vals))\n"
                          "      (+ 1 (length vals))))```"
                          "<br>In the above example, add was used in the apply because the + operator isn't a true function.<br>"
                          "Arrow functions do not define their own scope and should be used as anonymous functions within let and scoped blocks.<br>"
                          "Example:```"
                          "(let\n"
                          "  ((i 0)\n"
                          "   (my_incrementor (=> (v)\n"
                          "                     (inc i v)))\n"
                          "   (my_decrementor (=> (v)\n"
                          "                     (dec i v))))\n"
                          "  (my_incrementor 4)\n"
                          "  (my_decrementor 2)\n"
                          "  i)```"
                          "<- 2<br>"
                          "<br>"
                          "")
          tags: ["function" "lambda" "fn" "call" "apply" "scope" "arrow" "lambda"]
      }
      {  name: "function"
         usage: ["arguments:array" "body_expression:*"]
         description: `(resolve_path [ `definitions `fn ] (Environment.get_namespace_handle `core))
         tags: ["function" "lambda" "fn" "call" "apply" "scope" "arrow" "lambda"]
      }
      {  name: "=>"
         usage: ["arguments:array" "body_expression:*"]
         description: `(resolve_path [ `definitions `fn ] (Environment.get_namespace_handle `core))
         tags: ["function" "lambda" "fn" "call" "apply" "scope" "arrow" "lambda"]
      }
      {  name: "lambda"
         usage: ["arguments:array" "body_expression:*"]
         description: `(resolve_path [ `definitions `fn ] (Environment.get_namespace_handle `core))
         tags: ["function" "lambda" "fn" "call" "apply" "scope" "arrow" "lambda"]
      }
      {  name: "defglobal"
         usage: ["name:symbol" "value:*" "metadata:object"]
         description: (+ "Defines a global variable in the current namespace, or if preceded by a namespace "
                         "qualifier, will place the variable in the designated namespace.  The metadata value "
                         "is an optional object that provides information about the defined symbol for purposes "
                         "of help, rehydration, and other context.  The metadata object tags are arbitrary, but "
                         "depending on the type of value being referenced by the symbol, there are some "
                         "reserved keys that are used by the system itself.<br>Example:```"
                         "(defglobal *global_var* \"The value of the global.\"\n"
                         "           { description: \"This is a global in the current namespace\"\n"
                         "             tags: [ `keywords `for `grouping ] }\n```"
                         "<br>"
                         "The key/value pairs attached to a symbol are arbitrary and "
                         "can be provided for purposes of description or use by users or programatic elements.")
         tags: ["function" "lambda" "fn" "call" "apply" "scope" "arrow" "lambda"]
      }
      {
          name: "list"
          usage: ["item0:*" "item1:*" "itemN:*"]
          description: (+ "Unlike languages like Common-Lisp and other lisps that use proper lists, "
                           "the Juno language doesn't have a true list type.  All sequential collections "
                           "are in arrays because the underlying language, Javascript, doesn't have a "
                           "true list structure.  The list operator here is for backward compatibility "
                           "with older versions of this language that explicitly used the term as part of "
                           "a way to construct an array.")
      }
      {
          name: "yield"
          usage: ["value:*"]
          description: (+ "Note that the yield operator and generator functions aren't official yet and "
                           "are still requiring development work and testing due to how to structure "
                           "the emitted code to ensure that the yield is placed within a function* "
                           "structure vs. a typical function.")
          tags: [`generator `experimental]
      }
      {
          name: "for_with"
          usage: ["allocation_form" "body_expression:array"]
          description: (+ "The for_with operator provides a simple loop variable that allocates a "
                          "symbol which is assigned the next value from the iterator function in the "
                          "init form in the allocation. It then evaluates the body expression "
                          "with the symbol in scope.  It will continue to loop, with the allocated "
                          "symbol being defined successive values until the end of the array "
                          "is reached, or a (break) operator is encountered in the body "
                          "expression. Unlike for_each, the for_with operator is not a collector, and "
                          "there is no return value and attempting to assign the return value will not work.<br>Example:```"
                          "(for_with (next_val (generator instream))\n"
                          "     (log (-> text_decoder `decode next_val)))\n"
                          "```<br>")
          tags: [`iteration `generator `loop `flow `control ]
      }
      {
          name: "create_namespace"
          description: (+ "Given a name and an optional options object, creates a new namespace "
                          "with the given name.<br><br>#### Options  <br><br>contained:boolean - If set to "
                          "true, the newly defined namespace will not have visibility to other namespaces "
                          "beyond \'core\' and itself.  Any fully qualified symbols that reference other "
                          "non-core namespaces will fail.<br>serialize_with_image:boolean-If set to false, "
                          "if the environment is saved, the namespace will not be included in the saved "
                          "image file.  Default is true. ")
          usage: ["name:string" "options:object"]
          tags: [`namespace `scope `symbol `symbols `environment]
      }
      {
          name: "delete_namespace"
          description: (+ "Given a namespace name as a string, removes the designated namespace. "
                          "If the namespace to be deleted is the active namespace, an EvalError "
                          "will be thrown.")
          usage: ["name:string"]
          tags: [`namespace `scope `symbol `symbols `environment]
      }
      {
          name: "set_namespace"
          description: (+ "Sets the current namespace to the given namespace.  If the namespace "
                          "given doesn't exist, an error will be thrown.")
          usage: ["name:string"]
          tags: [`namespace `scope `symbol `symbols `environment]
      }
      {
          name: "Environment"
          usage: []
          license:  (join "\n" 
                       ["Copyright (c) 2022-2023, Kina, LLC"
                        "Permission is hereby granted, free of charge, to any person obtaining a copy"
                        "of this software and associated documentation files (the \"Software\"), to deal"
                        "in the Software without restriction, including without limitation the rights"
                        "to use, copy, modify, merge, publish, distribute, sublicense, and/or sell"
                        "copies of the Software, and to permit persons to whom the Software is"
                        "furnished to do so, subject to the following conditions:"
                        ""
                        "The above copyright notice and this permission notice shall be included in all"
                        "copies or substantial portions of the Software."
                        ""
                        "THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR"
                        "IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,"
                        "FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE"
                        "AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER"
                        "LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,"
                        "OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE"
                        "SOFTWARE."])
          description: (+ "The Environment object facilitates the runtime capabilities of the Juno system.")
      }
    ])

(for_each (entry special_definitions)
   (progn
      (set_prop Environment.definitions
         entry.name
         { description: (or entry.description "")
                       usage: (or entry.usage [])
                       tags: (or entry.tags [])
                       type: "Special" })
      (if entry.license
         (set_prop (prop Environment.definitions entry.name) 
                   `license entry.license))))

;; now undefine the original object since they are now installed into the definitions of the Environment

(undefine `core/special_definitions)

(defglobal defmacro
    (fn (name arg_list `& body)
        (let ;; capture the arguments
            ((macro_name name)
             (macro_args arg_list)
             (macro_body body)
             (source_details 
                         {
                            `eval_when: { `compile_time: true  }
                            `name: (if (starts_with? "=:" name)
                                       (-> name `substr 2)
                                       name)
                            `macro: true
                            `fn_args: (as_lisp macro_args)
                            ;`fn_body: (as_lisp macro_body)
                          }))
                         
         ;; next run through the steps of registering a macro
         ;; which is essentially a compile time function that 
         ;; transforms the body forms with the provided arguments
         ;; and returns the new form
         (do 
             `(defglobal ,#macro_name 
                  (fn ,#macro_args
                      ,@macro_body)
                  (quote ,#source_details)))))
         {
                     `eval_when: { `compile_time: true }
          `description: "simple defmacro for bootstrapping and is replaced by the more sophisticated form."
         })
     


(defglobal `read_lisp
    reader)


(defmacro desym (val)
    (let
        ((strip (fn (v)
                    (+ "" (as_lisp v)))))
      (cond 
            (is_string? val)
            (strip val)
            (is_array? val)
            (for_each (`v val)
               (strip v))
            else
            val))
  {
   `description: "Given a value or arrays of values, return the provided symbol in it's literal, quoted form, e.g. (desym myval) => \"myval\""
   `usage: ["val:string|array"]
   `tags: [`symbol `reference `literal `desymbolize `dereference `deref `desym_ref]
   })
        
(defmacro desym_ref (val)
  `(+ "" (as_lisp ,#val))
  {
   `description: (+ "Given a value will return the a string containing the desymbolized value or values. "
                    "Example: <br>"
                    "(defglobal myvar \"foo\")<br>"
                    "(defglobal myarr [ (quote myvar) ])<br>"
                    "(desym_ref myarr) <- (myvar)<br>"
                    "(desym_ref myarr.0) <- myvar<br>"
                    "(subtype (desym_ref myarr.0)) <- \"String\"")
   `usage: ["val:*"]
   `tags: ["symbol" "reference" "syntax" "dereference" "desym" "desym_ref" ]
   })
 
(defmacro deref (val)
  `(let
      ((mval ,#val))
    (if (and (is_string? mval)
             (starts_with? "=:" mval))
      (-> mval `substr 2)
      mval))
  {
   `description: (+ "If the value that the symbol references is a binding value, aka starting with '=:', then return the symbol value "
                    "instead of the value that is referenced by the symbol. This is useful in macros where a value in a form is "
                    "to be used for it's symbolic name vs. it's referenced value, which may be undefined if the symbol being "
                    "de-referenced is not bound to any value. <br>"
                    "Example:<br>"
                    "Dereference the symbolic value being held in array element 0:<br>"
                    "(defglobal myvar \"foo\")<br>"
                    "(defglobal myarr [ (quote myvar) ])<br>"
                    "(deref my_array.0) => \"my_var\"<br>"
                    "(deref my_array) => [ \"=:my_var\" ]<br>"
                    "<br>In the last example, the input to deref isn't a string and so it returns the value as is.  See also desym_ref.")
   `tags: ["symbol" "reference" "syntax" "dereference" "desym" "desym_ref" ]
   `usage: ["symbol:string"]
                    
   })

(defmacro when (condition `& mbody) 
     `(if ,#condition
          (do
            ,@mbody))
  {
   `description: (+ "Similar to if, but the body forms are evaluated in an implicit progn, if the condition form or expression is true. "
                    "The function when will return the last form value.  There is no evaluation of the body if the conditional expression "
                    "is false.")
   `usage: ["condition:*" "body:*"]
   `tags: ["if" "condition" "logic" "true" "progn" "conditional"]                    
   })


(defmacro if_compile_time_defined (quoted_symbol exists_form not_exists_form)
  (if  (describe quoted_symbol)
    exists_form       
    (or not_exists_form []))       
     {
         `description: "If the provided quoted symbol is a defined symbol at compilation time, the exists_form will be compiled, otherwise the not_exists_form will be compiled."
         `tags: ["compile" "defined" "global" "symbol" "reference"]
         `usage:["quoted_symbol:string" "exists_form:*" "not_exists_form:*"]         
     })

(defmacro defexternal (name value)
   `(let
       ((symname (desym ,@name)))
    (do 
       (set_prop globalThis
             symname
             ,#value)
       (prop globalThis
             symname)))
  {
   `description: "Given a name and a value, defexternal will add a globalThis property with the symbol name thereby creating a global variable in the javascript environment."
   `tags: [ `global `javascript `globalThis `value ]
   `usage: ["name:string" "value:*"]
   })
         
(defmacro defun (name args body meta)
    (let
        ((fn_name name)
         (fn_args args)
         (fn_body body)
         (source_details 
                     (+
                         {
                            `name: (unquotify name)
                            `fn_args: (as_lisp fn_args)
                            ;`fn_body: (add_escape_encoding (as_lisp fn_body))
                          }
                         (if meta 
                             meta
                             {}))))
     `(do
         (defglobal ,#fn_name
             (fn ,#fn_args
                 ,#fn_body)
           (quote ,#source_details))))
  {
   `description: "simple defun for bootstrapping and is replaced by the more sophisticated defun during bootstrapping"
   })

(defun decomp_symbol (quoted_sym full_resolution)
  (let
      ((comps (split_by "/" quoted_sym))
       (ns nil))
    (cond 
       (and full_resolution
          (== comps.length 1))
       (progn
          (= ns 
             (first (reduce (symdata (describe quoted_sym true))
                       (unless symdata.require_ns
                          symdata.namespace))))
          [comps.0 ns false])
       
       (== comps.length 1)
       [comps.0 (first (each (describe quoted_sym true) `namespace)) false]
       else
       [comps.1 comps.0 true])))

(defmacro defun_sync (name args body meta)
    (let
        ((fn_name name)
         (fn_args args)
         (fn_body body)
         (source_details 
                     (+
                         {
                            `name: (unquotify name)
                            `fn_args: (as_lisp fn_args)
                            ;`fn_body: (add_escape_encoding (as_lisp fn_body))
                          }
                         (if meta 
                             meta
                             {}))))
     `(do
         (defglobal ,#fn_name
             (function ,#fn_args
                 ,#fn_body)
           (quote ,#source_details))))
  {
   `description: (+ "Creates a top level synchronous function as opposed to the default via defun, which creates an asynchronous top level function."                    
                    "Doesn't support destructuring bind in the lambda list (args). "
                    "Given a name, an argument list, a body and symbol metadata, will establish a top level synchronous function.  If the name is "
                    "fully qualified, the function will be compiled in the current namespace (and it's lexical environment) and placed in the "
                    "specified namespace."
                    )
   `usage: ["name:string" "args:array" "body:*" "meta:object" ]
   `tags: ["define" "function" "synchronous" "toplevel" ]
   })
  
(defun core/macroexpand (quoted_form)
    (let
        ((macro_name (try
                        (-> quoted_form.0 `substr 2)
                        (catch Error (e)
                           (throw "macroexpand: unable to determine macro: is the form quoted?"))))
         (working_env nil)
         (meta nil) 
         (macro_func nil))
        (= working_env (-> Environment `get_namespace_handle (current_namespace)))
        (= meta (-> working_env `eval `(first (meta_for_symbol ,#macro_name true))))
        (= macro_func (if meta.namespace 
                          (-> working_env `get_global (+ meta.namespace "/" macro_name))
                          (-> working_env `get_global macro_name)))
        ;; get the first namespace we find it in (should be either us or core)))
        (if (and (is_function? macro_func)
                 (resolve_path [ `eval_when `compile_time ] meta))
            (progn
               (apply macro_func (-> quoted_form `slice 1)))
            quoted_form))
   {
     `description: "Given a quoted form, will perform the macro expansion and return the expanded form."
     `usage: ["quoted_form:*"]
     `tags:["macro" "expansion" "debug" "compile" "compilation"]
   })
 
(defun macroexpand_all (quoted_form)
   (detokenize (tokenize_lisp quoted_form))
   {
     `description: (+ "Given a quoted form, will recursively expand all macros in the quoted form "
                      "and return the expanded form structure")
     `usage: ["quoted_form:*"]
     `tags:["macro" "expansion" "debug" "compile" "compilation"]
   }) 

(defmacro check_type (thing type_name error_string)
    (if error_string
        `(if (not (== (sub_type ,#thing) ,#type_name))
             (throw TypeError ,#error_string))
        `(if (not (== (sub_type ,#thing) ,#type_name))
             (throw TypeError (+ "invalid type: required " ,#type_name " but got " (sub_type ,#thing)))))
    {
     `description: "If the type of thing (ascertained by sub_type) are not of the type type_name, will throw a TypeError with the optional error_string as the error message."
     `usage:["thing:*" "type_name:string" "error_string:string"]
     `tags:["types" "validation" "type" "assert"]
     })
         

              

(defun_sync get_object_path (refname)
  (if (or (> (-> refname `indexOf ".") -1)
          (> (-> refname `indexOf "[") -1))
    (let
        ((`chars (split_by "" refname))
         (`comps [])
         (`mode 0)
         (`name_acc []))
                 
        (for_each (`c chars)
          (do
            (cond
                (and (== c ".")
                     (== mode 0))
                (do
                  (when (> name_acc.length 0)
                    (push comps
                          (join "" name_acc)))
                    (= name_acc []))
                (and (== mode 0)
                     (== c "["))
                (do
                  (= mode 1)
                  (when (> name_acc.length 0)
                    (push comps
                         (join "" name_acc)))
                   (= name_acc []))
                (and (== mode 1)
                     (== c "]"))
                         
                (do
                  (= mode 0)                  
                  (push comps
                        (join "" name_acc))
                   (= name_acc []))
                else
                (push name_acc c))))
        (if (> name_acc.length 0)
            (push comps (join "" name_acc)))
        comps)
    [ refname ])
  {
   `description: "get_object_path is used by the compiler to take a string based notation in the form of p[a][b] or p.a.b and returns an array of the components."
   `tags: [ `compiler ]
   `usage: ["refname:string"]
   })
             




(defun do_deferred_splice (tree)
    (let
        ((`rval nil)
         (`idx 0)
         (`tval nil)
         (`deferred_operator (join "" [`= `$ `& `!])))
       ;(console.log "do_deferred_splice: ->" (clone tree))
        (cond
            (is_array? tree)
            (do
               (= rval [])
               (while (< idx tree.length)
                 (do
                    (= tval (prop tree idx))
                    (if (== tval deferred_operator)
                        (do 
                            (inc idx)
                            (= tval (prop tree idx))
                            ;(log "got deferred_operator for: " tval)
                            (= rval (-> rval `concat (do_deferred_splice tval))))
                        (push rval (do_deferred_splice tval)))
                    (inc idx)))
                rval)
            (is_object? tree)
            (do 
                (= rval {})
                (for_each (`pset (pairs tree))
                   (do
                       (set_prop rval
                                 pset.0
                                 (do_deferred_splice pset.1))))
               rval)
            else
            tree))
  {
   `description: "Internally used by the compiler to facilitate splice operations on arrays."
   `usage: ["tree:*"]
   `tags: [`compiler `build ]
   })




(defmacro define (`& defs)
    (let
        ((acc [(quote progl)])
         (symname nil))
     
     (for_each (`defset defs)
        (do
            (push acc [(quote defvar) defset.0 defset.1])
            (= symname defset.0)
            (push acc [(quote set_prop) (quote Environment.global_ctx.scope) (+ "" (as_lisp symname)) symname])
            (when (is_object? defset.2)
                  (push acc ([(quote set_prop) (quote Environment.definitions)
                                       (+ "" (as_lisp symname) "")
                                       defset.2])))))
     acc)
   {
    `usage: ["declaration:array" "declaration:array*"]
    `description: (+ "Given 1 or more declarations in the form of (symbol value ?metadata), " 
                     "creates a symbol in global scope referencing the provided value.  If a "
                     "metadata object is provided, this is stored as a the symbol's metadata.")
    `tags: ["symbol" "reference" "definition" "metadata" "environment"]
                     
    })


 

;; Defines a global binding to a (presumably) native function
;; This macro facilitates the housekeeping with keeping track
;; of the source form used (and stored in the environment) so
;; that save_env can capture the source bindings and recreate
;; it in the initializer function on rehydration...


(defmacro defbinding (`& args)
  (let
      ((binding nil)
       (acc [(quote list)]))
    
    (for_each (bind_set args)
              (do
                (cond
                  (and (is_array? bind_set)
                       (or (== bind_set.length 2);; Include the metadata
                           (== bind_set.length 3))
                       (is_array? bind_set.1)
                       (== bind_set.1.length 2))
                  (do                    
                    (= binding [(quote quotel) [(quote bind) bind_set.1.0 bind_set.1.1 ]])
                    (push acc [ (quote defglobal) (+ *namespace* "/" (deref bind_set.0)) [(quote bind) bind_set.1.0 bind_set.1.1]
                           (if (is_object? bind_set.2)
                             (+ {} bind_set.2
                                { `initializer: binding })
                             { `initializer: binding }) ]))
                             
                  else
                  (throw SyntaxError "defbinding received malform arguments"))))    
    acc)
  {
   description: (+ "Defines a global binding to a potentially native function.  This macro "
                   "facilitates the housekeeping by keeping track of the source form "
                   "used (and stored in the environment) so that the save environment "
                   "facility can capture the source bindings and recreate it in the initializer "
                   "function on rehydration.<br>"
                   "The macro can take an arbitrary amount of binding arguments, with the form: "
                   "(symbol_name (fn_to_bind_to this))")
   usage: ["binding_set0:array" "binding_setN:array"]
   tags: ["toplevel" "global" "bind" "environment" "initialize" ]
   })
  

(defmacro define_env (`& defs)
    (let
        ((acc [(quote progl)])
         (symname nil))
     
     (for_each (`defset defs)
        (do
            (push acc [(quote defvar) defset.0 defset.1])
            (= symname defset.0)
            (push acc [(quote set_prop) (quote Environment.global_ctx.scope) (+ "" (as_lisp symname)) symname])
            (if (is_object? defset.2)
              (push acc ([(quote set_prop) (quote Environment.definitions)
                          (+ "" (as_lisp symname) "")
                          (+ { `core_lang: true } defset.2) ]))
              (push acc ([(quote set_prop) (quote Environment.definitions)
                          (+ "" (as_lisp symname) "")
                          { `core_lang: true } ] )))))
     acc)
  {
   `description: (+ "define_env is a macro used to provide a dual definition on the top level: it creates a symbol via defvar in the "
                    "constructed scope as well as placing a reference to the defined symbol in the scope object.")
   `usage: ["definitions:array"]
   `tags: ["environment" "core" "build"]
   })


(defun_sync type (x)
    (cond
        (== nil x) "null"
        (== undefined x) "undefined"
        (instanceof x Array) "array"
        else
        (typeof x))
    {
        `usage:["value:*"]
        `description: "returns the type of value that has been passed.  Deprecated, and the sub_type function should be used."
        `tags:["types","value","what"]
    })


(defun_sync destructure_list (elems)
      (let
          ((idx 0)
           (acc [])
           (passed_rest 0)
           
           (structure elems)
           (follow_tree (function (elems _path_prefix)
                            (cond
                                (> passed_rest 0)
                                (progn
                                   (if (== passed_rest 1) 
                                       (push acc _path_prefix))
                                   (inc passed_rest))
                                (is_array? elems)
                                (progn
                                   (defvar path_idx -1)
                                   (for_each (elem elems)
                                      (progn
                                         (inc path_idx)
                                         (follow_tree elem (+ _path_prefix path_idx)))))
                                (is_object? elems)
                                (for_each (`pset (pairs elems))
                                    (follow_tree pset.1 (+ _path_prefix pset.0)))
                                (and (is_string? elems)
                                     (== "&" elems))
                                ;; the rest go into the same path value
                                (progn
                                   (inc passed_rest)
                                   (push acc  [ `*  _path_prefix ]))
                                else ;; not container, simple values record the final path in our acculumlator
                                (push acc _path_prefix)))))
        (follow_tree structure [])
        acc)
  {
   `description: "Destructure list takes a nested array and returns the paths of each element in the provided array."
   `usage: ["elems:array"]
   `tags: ["destructuring" "path" "array" "nested" "tree"]
   })


(defmacro destructuring_bind (bind_vars expression `& forms)  
      (let
          ((binding_vars bind_vars)
           (preamble [])
           (allocations [])
           (passed_rest false)
           (expr_result_var (+ "=:" "_expr_" (random_int 100000)))
           (paths (destructure_list binding_vars))           
           (bound_expression (if (and (is_array? expression)
                                      (starts_with? "=:"  expression.0))
                               (do
                                 (push allocations
                                       `[,#expr_result_var ,#expression])
                                 expr_result_var)
                               expression))                                            
           (acc [(quote let)]))
        
          (assert (and (is_array? binding_vars)
                       (is_value? expression)
                       (is_value? forms))
                  "destructuring_bind: requires 3 arguments")
          ;(log "destructuring_bind: " "bind_vars: " bind_vars "paths: " paths "bound_expression: " bound_expression 
           ;    "forms: " forms)
          (for_each (`idx (range (length paths)))
             (do
                (if (== "*" (first (prop paths idx)))
                    (progn
                       (push allocations
                          [(resolve_path (prop paths (+ idx 1)) binding_vars)
                           (cond
                              (is_object? bound_expression)
                              (slice bound_expression idx)
                              else
                              `(slice ,#expression ,#(first (second (prop paths idx)))))])
                       (break))
                    (progn
                       (push allocations
                          [ (resolve_path (prop paths idx) binding_vars)
                           (cond
                              (is_object? bound_expression)
                              (resolve_path (prop paths idx) bound_expression)
                              else
                              (join "." (conj [ bound_expression ] (prop paths idx)))) ])))))
          
          (push acc
                allocations)
          (= acc (conj acc
                       forms))
          acc)
  {
   `description: (+ "The macro destructuring_bind binds the variable symbols specified in bind_vars to the corresponding "
                    "values in the tree structure resulting from the evaluation of the provided expression.  The bound "
                    "variables are then available within the provided forms, which are then evaluated.  Note that "
                    "destructuring_bind only supports destructuring arrays. Destructuring objects is not supported.")
   `usage: ["bind_vars:array" "expression:array" "forms:*"]
   `tags: [`destructure `array `list `bind `variables `allocation `symbols ]
   })

(defun_sync split_by_recurse (token container)  
    (cond
      (is_string? container)
      (split_by token container)
      (is_array? container)
      (map (fn (elem)
             (split_by_recurse token elem))
           container))
  {
   `usage: ["token:string" "container:string|array"]
   `description: (+ "Like split_by, splits the provided container at "
                    "each token, returning an array of the split "
                    "items.  If the container is an array, the function "
                    "will recursively split the strings in the array "
                    "and return an array containing the split values "
                    "of that array.  The final returned array may contain "
                    "strings and arrays.")
   `tags: [ `split `nested `recursion `array `string ]
   })


;; Rebuild defmacro to use destructuring 
  
(defglobal defmacro
   (fn (name lambda_list `& forms)
        (let ;; capture the arguments
            ((symdetails (decomp_symbol (if (starts_with? "=:" name)
                                            (-> name `substr 2)
                                            name)))
             (macro_name symdetails.0)  ;; actual symbol name
             (target_ns symdetails.1)
             (macro_args lambda_list)
             (macro_body forms)
             (final_form (last forms))
             (macro_meta (if (and (is_object? final_form)
                                  (not (blank? final_form.description))
                                  (not (blank? final_form.usage)))
                           (pop forms)))             
             (complex_lambda_list (or_args (for_each (`elem lambda_list)
                                                (> (length (flatten (destructure_list elem))) 0))))
                                     
             (source_details 
                         (+ {
                                `eval_when: { `compile_time: true  }
                                `name: macro_name
                                `macro: true
                                `fn_args: (as_lisp macro_args)
                                ;`fn_body: (as_lisp macro_body)
                            }
                            (if macro_meta
                                macro_meta
                                {}))))
        
         ;; next run through the steps of registering a macro
         ;; which is essentially a compile time function that 
         ;; transforms the body forms with the provided arguments
         ;; and returns the new form
         ;; add a destructuring_bind if we have a complex lambda list
         
         (if complex_lambda_list
          `(defglobal ,#name 
                  (fn (`& args)
                      (destructuring_bind ,#macro_args 
                                          args
                                          ,@macro_body))
                  (quote ,#source_details))
              
          `(defglobal ,#name 
                  (fn ,#macro_args
                      ,@macro_body)
                  (quote ,#source_details)))))
          
          
    {
     
      `description: (+ "Defines the provided name as a compile time macro function in the "
                       "current namespace environment. The parameters in the lambda list are "
                       "destructured and bound to the provided names which are then available in the "
                       "macro function.  The forms are used as the basis for the function with the "
                       "final form expected to return a quoted form which is then as the expansion of "
                       "the macro by the compiler. The body of forms are explicitly placed in a progn "
                       "block.  Like with functions and defglobal, if the final argument to defmacro is "
                       "an object, this will be used for the metadata associated with with the bound "
                       "symbol provided as name.<br><br>#### Example <br>```(defmacro unless (condition "
                       "`& forms)\n  `(if (not ,#condition)\n       (progn \n         ,@forms))) "
                       "```<br><br><br>In the above example the macro unless is defined.  Passed "
                       "arguments must be explicitly unquoted or an error may be thrown because the "
                       "arguments condition and forms *may* not be defined in the final compilation "
                       "environment.  Note that if the symbols used by the macro are defined in the "
                       "final compilation scope, that this may cause unexpected behavior due to the "
                       "form being placed into the compilation tree and then acting on those symbols. "
                       "<br>Be aware that if a macro being defined returns an object (not an array) you "
                       "should explicitly add the final metadata form to explictly ensure appropriate "
                       "interpretation of the argument positions.<br>Since a macro is a function that "
                       "is defined to operate at compile time vs. run time, the rules of declare apply. "
                       " Declaration operate normally and should be the first form in the block, or if "
                       "using let, the first form after the allocation block of the let. ")
     `usage: ["name:symbol" "lambda_list:array" "forms:array" "meta?:object"]
     `eval_when: { `compile_time: true }
     `tags: [ `macro `define `compile `function ]
    })  



;; Recreate the defun function now that we have destructuring installed


(defmacro defun (name lambda_list body meta)
  (let
        ((fn_name name)
         (fn_args lambda_list)
         (fn_body body)
         (fn_meta meta)        
         (complex_lambda_list (or_args 
                                   (for_each (`elem lambda_list)
                                        (> (length (flatten (destructure_list elem))) 0))))
         (symbol_details (decomp_symbol (unquotify name)))
         (source_details 
                     (+
                         {
                            `name: symbol_details.0
                            `fn_args: (as_lisp fn_args)                          
                          }                         
                         (if fn_meta 
                             (do 
                                 (if fn_meta.description
                                     (set_prop fn_meta
                                               `description
                                                fn_meta.description))
                                  fn_meta)
                             {}))))
      
        (if complex_lambda_list
          `(defglobal ,#fn_name 
                  (fn (`& args)
                      (destructuring_bind ,#fn_args 
                                          args
                                          ,#fn_body))
                  (quote ,#source_details))
         `(defglobal ,#fn_name
             (fn ,#fn_args
                 ,#fn_body)
              (quote ,#source_details))))
    {
     `description: (+ "Defines a top level function in the current environment.  Given a name, lambda_list,"
                      "body, and a meta data description, builds, compiles and installs the function in the"
                      "environment under the provided name.  The body isn't an explicit progn, and must be"
                      "within a block structure, such as progn, let or do.")
     `usage: ["name:string:required" "lambda_list:array:required" "body:array:required" "meta:object"]
     `tags: ["function" "lambda" "define" "environment"]     
     })

(defmacro defun_sync_ds (name lambda_list body meta)
     (let
        ((fn_name name)
         (fn_args lambda_list)
         (fn_body body)
         (fn_meta meta)        
         (complex_lambda_list (or_args 
                                   (for_each (`elem lambda_list)
                                        (> (length (flatten (destructure_list elem))) 0))))
         (symbol_details (decomp_symbol (unquotify name)))
         (source_details 
                     (+
                         {
                            `name: symbol_details.0
                            `fn_args: (as_lisp fn_args)                          
                          }                         
                         (if fn_meta 
                             (do 
                                 (if fn_meta.description
                                     (set_prop fn_meta
                                               `description
                                                fn_meta.description))
                                  fn_meta)
                             {}))))
      
        (if complex_lambda_list
          `(defglobal ,#fn_name 
                  (function (`& args)
                      (destructuring_bind ,#fn_args 
                                          args
                                          ,#fn_body))
                  (quote ,#source_details))
         `(defglobal ,#fn_name
             (function ,#fn_args
                 ,#fn_body)
              (quote ,#source_details))))
    {
     `description: (+ "Defines a top level function in the current environment.  Given a name, lambda_list,"
                      "body, and a meta data description, builds, compiles and installs the function in the"
                      "environment under the provided name.  The body isn't an explicit progn, and must be"
                      "within a block structure, such as progn, let or do.")
     `usage: ["name:string:required" "lambda_list:array:required" "body:array:required" "meta:object"]
     `tags: ["function" "lambda" "define" "environment"]     
     })

(defmacro no_await (form)
   `(progn
       (defvar __SYNCF__ true)
       ,#form)
  {
   `description: (+ "For the provided form in an asynchronous context, forces the compiler flag "
                    "to treat the form as synchronous, thus avoiding an await call.  The return "
                    "value may be impacted and result in a promise being returned "
                    "as opposed to a resolved promise value.")
   `usage: ["no_await:array"]
   `tags: ["compiler" "synchronous" "await" "promise"]
   })

(defmacro reduce ((elem item_list) form)
    `(let
        ((__collector [])
         (__result nil)
         (__action (fn (,@elem)
                         ,#form)))
      (declare (function __action))                     
      (for_each (__item ,#item_list)
         (do
             (= __result (__action __item))
             (if __result
                 (push __collector __result))))
      __collector)
  {
      description: (+ "Provided a first argument as a list which contains a binding variable name and a list, " 
                      "returns a list of all non-null return values that result from the evaluation of the second list.")
      usage: ["allocator:array" "forms:*"]
      tags: [`filter `remove `select `list `array]
   })

(defmacro reduce_sync ((elem item_list) form)
    `(let
        ((__collector [])
         (__result nil)
         (__action (function (,@elem)
                         ,#form)))
      (declare (function __action))                     
      (for_each (__item ,#item_list)
         (do
             (= __result (__action __item))
             (if __result
                 (push __collector __result))))
      __collector)
  {
      "description":"Provided a first argument as a list which contains a binding variable name and a list, returns a list of all non-null return values that result from the evaluation of the second list."
      "usage":["allocator:array" "forms:*"]
      `tags: [`filter `remove `select `list `array]
  })
     

(defun is_nil? (`value)
        (== nil value)
        {
        `description: "for the given value x, returns true if x is exactly equal to nil."
        `usage: ["arg:value"]
        `tags: ["type" "condition" "subtype" "value" "what" ]
        })

 (defun is_regex? (x)
       (== (sub_type x) "RegExp")
       {
        `description: "for the given value x, returns true if x is a Javascript regex object"
        `usage: ["arg:value"]
        `tags: ["type" "condition" "subtype" "value" "what" ]
        })
 
(defglobal bind_function bind
  {
   `description: "Reference bind and so has the exact same behavior.  Used for Kina legacy code. See bind description."
   })


(defun_sync is_error? (val)
   (instanceof val Error)
   {
       `description: "Returns true if the passed value is a instance of an Error type, otherwise returns false."
       `usage: ["val:*"]
       `tags: ["Error" "types" "predicate" "type" "instanceof" ]
   })

(defmacro is_reference? (val)
  `(and (is_string? ,#val)
       (> (length ,#val) 2)
       (starts_with? (quote "=:") ,#val))
  {
   `description: (+ "Returns true if the quoted value is a binding string; in JSON notation this would be a string starting with \"=:\". "
                    "Note that this function doesn't check if the provided value is a defined symbol, but only if it has been "
                    "described in the JSON structure as a bounding string.")
   `usage: ["val:string"]
   `tags: ["reference" "JSON" "binding" "symbol" "predicate" ] 
   }) 
    
(defun_sync scan_str (regex search_string)
   (let
      ((`result      nil)
       (`last_result {})
       (`totals  [])
       (`strs    (+ "" search_string)))
      (if (is_regex? regex)
          (progc
             (set_prop regex
                `lastIndex 0)
             (while (do (= result (-> regex `exec strs ))
                        (and (not (== result.index last_result.index)) 
                             result))
                (progn
                   (= last_result result)
                   (push totals (to_object
                                           (for_each (v (keys result))
                                              [v (prop result v)]))))))
          (throw (new ReferenceError (+ "scan_str: invalid RegExp provided: " regex))))
      totals)
   {`description: (+ "Using a provided regex and a search string, performs a regex "
                     "exec using the provided regex argument on the string argument. "
                     "Returns an array of results or an empty array, with matched "
                     "text, index, and any capture groups.")
                  `usage:["regex:RegExp" "text:string"]
                  `tags:["regex" "string" "match" "exec" "array"] })
     
(defun remove_prop (obj key)
      (when (not (== undefined (prop obj key)))
              (let
                  ((`val (prop obj key)))
                  (delete_prop obj key)
                  val))
       {
         `usage: ["obj:object" "key:*"]
         `description: (+ "If the provided key exists, removes the key from the provided object, "
                          "and returns the removed value if the key exists, otherwise returned undefined.")
         `tags: ["object" "key" "value" "mutate" "delete_prop" "remove" ]
       })     

(defun object_methods (obj)
    (let
        ((`properties (new Set))
         (`current_obj  obj))
     (while current_obj
        (do
            (map (fn (item)
                     (-> properties `add item))
                 (Object.getOwnPropertyNames current_obj))
            (= current_obj (Object.getPrototypeOf current_obj))))
    (-> (Array.from (-> properties `keys))
        `filter (fn (item)
                    (is_function? item))))
    {
     `description: "Given a instantiated object, get all methods (functions) that the object and it's prototype chain contains."
     `usage: ["obj:object"]
     `tags: [`object `methods `functions `introspection `keys]
     })         
 
(defun expand_dot_accessor (val ctx)
  (let
      ((`comps (split_by "." val))
       (`find_in_ctx (fn (the_ctx)
                         (cond
                           (prop the_ctx.scope reference)
                           (prop the_ctx.scope reference)
                           the_ctx.parent
                           (find_in_ctx the_ctx.parent))))
       (`reference (take comps))
       (`idx 0)
       (`val_type (find_in_ctx ctx))) ;; contains the named reference, comps now will have the path components
    (cond
      (== 0 comps.length)
      reference
      (and (is_object? val_type)
           (contains? comps.0 (object_methods val_type))
           (not (-> val_type `propertyIsEnumerable comps.0)))
      val  ;; direct reference to a special property
      else 
      (join ""
            (conj [ reference ]
                  (flatten (for_each (`comp comps)
                              (progn
                                 (inc idx)
                                 (if (and (== idx 1)
                                          (== reference "this"))
                                     [ "." comp ]
                                     (if (is_number? comp)
                                         [ "[" comp "]" ]
                                         [ "[\"" comp "\"]" ])))))))))
  {
   `description: "Used for compilation. Expands dotted notation of a.b.0.1 to a[\"b\"][0][1]"
   `usage: ["val:string" "ctx:object"]
   `tags: [`compiler `system ]
   })
 
(defun_sync from_mixed_case (mixed_case_key)
   (let
      ((tokens (if (is_string? mixed_case_key)
                   (split_by "" mixed_case_key)
                   (throw TypeError "from_mixed_case: key argument must be a string")))
       (acc [])
       (ccode nil))
      (for_each (t tokens)
         (progn
            (= ccode (-> t `charCodeAt 0))
            (if (and (>= ccode 65)
                     (<= ccode 90))
                (progn
                   (push acc "_")
                   (push acc (lowercase t)))
                (push acc t))))
      (join "" acc))
   {
     description: (+ "<br><br>Given a mixed case string, will return the standardized key format "
                     "representation of the string.  For example,  the string `myVariable` will be "
                     "returned as `my_variable` with this function.  A TypeError will be thrown if a "
                     "non-string argument is provided. ")
     usage: ["mixed_case_key:string"]
     tags: [`key `convert `snake `mixed `case `format ]
   })

(defun_sync to_mixed_case (snake_case_key)
   (let
      ((tokens (if (is_string? snake_case_key)
                   (split_by "" snake_case_key)
                   (throw TypeError "to_mixed_case: key argument must be a string")))
       (acc [])
       (upmode false))
      (for_each (t tokens)
         (progn
            (cond 
               (== t "_")
               (= upmode true)
               upmode
               (progn
                  (push acc (uppercase t))
                  (= upmode false))
               else
               (push acc t))))
      (join "" acc))
   {
     description: (+ "<br><br>Given a snake case string, will return a mixed case key format "
                     "representation of the string.  For example,  the string `my_variable` will be "
                     "returned as `myVariable` with this function.  A TypeError will be thrown if a "
                     "non-string argument is provided. ")
     usage: ["snake_case_key:string"]
     tags: [`key `convert `snake `mixed `case `format ]
   })

(defun new_ctx (ctx)
   (let
      ((new_ctx { scope: {}
                  parent: nil }))
      (if ctx
         (progn
            (set_prop new_ctx
                      `parent
                      ctx)))
      new_ctx)
  {
   `description: "Used for compilation. Given a context structure, provides a utility function for retrieving a context value based on a provided identifier."
   `usage: ["ctx:?object"]
   `tags: [`compiler `system `context `ctx `setf_ctx ]
   })

(defun getf_ctx (ctx name _value)
    (if (and ctx (is_string? name))
        (cond
           (not (== undefined (prop ctx.scope name)))
           (if (not (== _value undefined))
               (do 
                   (set_prop ctx.scope
                             name
                             _value)
                   _value)
               (prop ctx.scope name))
           ctx.parent
           (getf_ctx ctx.parent name _value)
           else
           undefined)
        (throw "invalid call to getf_ctx: missing argument/s"))
  {
   `description: "Used for compilation. Given a context structure, provides a utility function for retrieving a context value based on a provided identifier."
   `usage: ["ctx:object" "name:string"]
   `tags: [`compiler `system `context `ctx `new_ctx `setf_ctx ]
   })

(defun setf_ctx (ctx name value)
    (let
        ((`found_val (getf_ctx ctx name value)))
        (if (== found_val undefined)
            (set_prop ctx.scope
                      name
                      value))
        value)
  {
   `description: "Used for compilation. Given a context structure, provides a utility function for setting a context place with value."
   `usage: ["ctx:object" "name:string" "value:*" ]
   `tags: [`compiler `system `context `ctx `new_ctx `getf_ctx ]
   })
                  
        
(defun set_path (path obj value)
    (let
        ((`fpath (clone path))
         (`idx (pop fpath))
         (`rpath fpath)
         (`target_obj nil))
     (= target_obj (resolve_path rpath obj))
     (if target_obj
         (do (set_prop target_obj
                   idx
                   value))
           
         (throw RangeError (+ "set_path: invalid path: " path))))
  {
   `description: (+ "Given a path value as an array, a tree structure, and a value, "
                    "sets the value within the tree at the path value, potentially overriding any existing value at that path.<br><br>"
                    "(defglobal foo [ 0 2 [ { `foo: [ 1 4 3 ] `bar: [ 0 1 2 ] } ] 3 ])<br>"
                    "(set_path [ 2 0 `bar 1 ] foo 10) => [ 0 10 2 ]<br>"
                    "foo => [ 0 2 [ { foo: [ 1 4 3 ] bar: [ 0 10 2 ] } ] 3 ]")
   `tags: [ "resolve_path" "make_path" "path" "set" "tree" "mutate" ]
   `usage: [ "path:array" "tree:array|object" "value:*" ]
   })

(defun make_path (target_path root_obj value _pos)
   (let
      ((target_path (if _pos  ;; if we are already processing...
                        target_path  ;; use what we have..
                        (clone target_path)))  ;; otherwise clone it so we don't remove it
       (segment (take target_path))
       (cval nil)
       (pos (or _pos [])))
      (push pos segment)
      (cond
        (== target_path.length 0)
        (progn
           (set_path pos root_obj
                     value)
           value)
        
        (= cval (resolve_path pos root_obj))
        (cond 
           (and (is_object? cval)
                (or (eq nil (prop cval (first target_path)))
                    (is_object?  (prop cval (first target_path)))
                    (== target_path.length 1)))
           (make_path target_path root_obj value pos)
           else
           (throw TypeError (+ "make_path: non-object encountered at " (as_lisp (+ pos (first target_path))))))
        else
        (progn
           (set_path pos root_obj {})
           (make_path target_path root_obj value pos))))
   {
       `description: (+ "Given a target_path array, a target object and a value to set, "
                        "constructs the path to the object, constructing where "
                        "required.  If the path cannot be made due to a "
                        "non-nil, non-object value encountered at one of "
                        "the path segments, the function will throw a TypeError, "
                        "otherwise it will return the provided value if successful.")
       `usage: ["path:array" "root_obj:object" "value:*"]
       `tags: ["set_path" "path" "set" "object" "resolve_path" "mutate"]
   })

(defun minmax (container)
    (let
       ((value_found false)
        (smallest MAX_SAFE_INTEGER)
        (biggest (* -1 MAX_SAFE_INTEGER)))
       (if (and container (is_array? container) (> (length container) 0))
          (do 
              (for_each (`value container)
                (and (is_number? value) 
                  (do 
                    (= value_found true)
                    (= smallest (Math.min value smallest))
                    (= biggest (Math.max value biggest)))))
              (if value_found [ smallest biggest] 
                  nil))
          nil)
       )
  {
   `description: (+ "Given an array container with numeric values, returns an array with smallest "
                    "and largest values in the given array [ min, max ]<br>"
                    "(minmax [ 2 0 1 3]) -> [ 0 3 ]")
   `usage: [ "container:array" ]
   `tags: ["min" "max" "array" "number" "range" ]
   })

                     
(defmacro aif (test_expr eval_when_true eval_when_false)
  `(let
       ((it ,#test_expr))   ;; capture the result of the if in `it and make it available in scope
     (if it
       ,#eval_when_true
         ,#eval_when_false))
  {
   `description: (+ "Anaphoric If - This macro defines a scope in which the symbol `it is used "
                    "to store the evaluation of the test form or expression.  It is then available "
                    "in the eval_when_true form and, if provided, the eval_when_false expression.")
   `usage: ["test_expression:*" "eval_when_true:*" "eval_when_false:*?"]
   `tags: [ `conditional `logic `anaphoric `if `it ]
   })

(defmacro ifa (test thenclause elseclause)
    `(let 
          ((it ,#test))
         (if it ,#thenclause ,#elseclause))
  {
      `description: "Similar to if, the ifa macro is anaphoric in binding, where the it value is defined as the return value of the test form. Use like if, but the it reference is bound within the bodies of the thenclause or elseclause."
      `usage: ["test:*" "thenclause:*" "elseclause:*"]
      `tags: ["cond" "it" "if" "anaphoric"]
  })  



(defun_sync map_range (n from_range to_range)
     (let
      ()
    (declare (number to_range.0 to_range.1 from_range.0 from_range.1))
    (+ to_range.0
       (* (/ (- n from_range.0)
             (- from_range.1 from_range.0))
          (- to_range.1 to_range.0))))
  { `usage: ["n:number" "from_range:array" "to_range:array"]
   `tags:  ["range" "scale" "conversion"]
   `description: (+ "Given an initial number n, and two numeric ranges, maps n from the first range " 
                    "to the second range, returning the value of n as scaled into the second range. ") })



(defun_sync range_inc (start end step)
        (if end
            (range start (+ end 1) step)
            (range (+ start 1)))
        {
         `description: (+ "Similar to range, but is end inclusive: [start end] returning an array containing values from start, including end. " 
                          "vs. the regular range function that returns [start end).  "
                          "If just 1 argument is provided, the function returns an array starting from 0, up to and including the provided value.")
         `usage: ["start:number" "end?:number" "step?:number"]
         `tags:  ["range" "iteration" "loop"]
         })

(defun HSV_to_RGB (h s v) 
   (javascript
         | {
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
             } |)
   {
       `description: (+ "Given a hue, saturation and brightness, all of which " 
                        "should be values between 0 and 1, returns an object "
                        "containing 3 keys: r, g, b, with values between 0 and 255, "
                        "representing the corresponding red, green and blue values "
                        "for the provided hue, saturation and brightness.")
       `usage: ["hue:number" "saturation:number" "value:number"]
       `tags: [ `color `conversion `hue `saturation `brightness `red `green `blue `rgb]
   })

(defun color_for_number (num saturation brightness)
    (let
        ((h (Math.abs (parseInt num)))
         (pos (% 8 h))
         (color_key [0 4 1 5 2 6 3 7])
         (rgb nil)
         (v (prop color_key pos)))
       (declare (number v h)
                (object rgb))
       (= h (map_range (% (* 20 h) 360) [0 360] [0.0 1.0]))
       (= v (map_range (v [0 7] [0.92 1])))
       (= rgb (HSV_to_RGB h saturation brightness))
       (+ "#" (-> (-> rgb.r `toString 16) `padStart 2 "0")
              (-> (-> rgb.g `toString 16) `padStart 2 "0")
              (-> (-> rgb.b `toString 16) `padStart 2 "0")))
        {
            `usage:["number:number" "saturation:float" "brightness:float"]
            `description:"Given an arbitrary integer, a saturation between 0 and 1 and a brightness between 0 and 1, return an RGB color string"
            `tags:["ui" "color" "view"]
        })
 
(defun flatten_ctx (ctx _var_table)
  (let
      ((`var_table (or _var_table (new Object)))
       (`ctx_keys (keys var_table)))
    (when ctx.scope
      (for_each (`k (keys ctx.scope))
                (when (not (contains? k ctx_keys))
                  (set_prop var_table
                            k
                            (prop ctx.scope k))))
      (when ctx.parent
        (flatten_ctx ctx.parent var_table))
      var_table))
  {
   `description: "Internal usage by the compiler, flattens the hierarchical context structure to a single level. Shadowing rules apply."
   `usage: ["ctx_object:object"]
   `tags: ["system" "compiler"]
   })
             
            
  
(defun identify_symbols (quoted_form _state)
    (let
        ((acc [])
         (_state (if _state
                     _state
                     {
                         
                     })))
        (debug)
        (cond
            (is_array? quoted_form)
            (do
                (for_each (`elem quoted_form)
                   (push acc
                         (identify_symbols elem _state))))
            (and (is_string? quoted_form)
                 (starts_with? "=:" quoted_form))
            (push acc
                 { `name: (as_lisp quoted_form)
                   `where: (describe (as_lisp quoted_form)) })
            (is_object? quoted_form)
            (for_each (`elem (values quoted_form))
                (push acc
                      (identify_symbols elem _state))))
        [(quote quote) acc]))
                       
(defmacro unless (condition `& forms)
    `(if (not ,#condition)
         (do 
             ,@forms))
     {
       `description: "opposite of if, if the condition is false then the forms are evaluated"
      `usage: ["condition:array" "forms:array"]
      `tags: ["if" "not" "ifnot" "logic" "conditional"]
     })

(defmacro use_quoted_initializer (`& forms)
   (let
      ((insert_initializer
          (fn (form)
             ;; the final form must be in the form of a (defglobal name value) or (defglobal name value { }) or (defglobal name value (quote { } ))
             ;; the def- macros should all expand out into this architypal form..
             ;; if the meta isn't provided the metadata will be appended in.
             (progn
                (defvar meta (prop form 3))
                ;(console.log "insert_initializer: form: " (clone form))
                ;(console.log "insert_initializer: meta: " (clone meta))
                (if (eq nil (prop form 3))
                    (= meta
                       (set_prop form
                          3
                          {})))
                (cond
                   (and (is_array? meta)
                        (is_object? (resolve_path [ 3 1 ] form)))
                   (progn
                      (set_path [ 3 1 `initializer ] form [(quote quotel) `(try (progn ,#form.2) (catch Error (e) e))])
                      form)
                   (is_object? meta)
                   (progn
                      ;(console.log "insert_initializer: setting initializer on " form.3)
                      (set_prop form.3
                         `initializer [(quote quotel) `(try (progn ,#form.2)  (catch Error (e) e))])
                      form)
                   else
                   (progn
                      (warn "use_quoted_initializer: cannot quote " (if (is_string? form.2) form.2 form " - cannot find meta form. Check calling syntax."))
                      form)
                   )))))
      (for_each (form forms)
         (progn
            ;; make sure we are working with the form in it's expanded state.
            ;; this macro should be the calling form to defun, etc..
            (= form (macroexpand form))
            (if (and (is_array? form)
                     (== form.0 (quote defglobal)))
                (progn
                   (insert_initializer form))
                form))))
   {
     `description: (+ "The macro `use_quoted_initializer` preserves the source form in the "
                      "symbol definition object.  When the environment is saved, any source forms that "
                      "wish to be preserved through the serialization process should be in the body of "
                      "this macro.  This is a necessity for global objects that hold callable "
                      "functions, or functions or structures that require initializers, such as things "
                      "that connect or use environmental resources.  ")
     `usage: ["forms:array"]
     `tags: [`compilation `save_env `export `source `use `compiler `compile ]
     
     })
	 
	 
	   
(defun_sync but_last (arr)
   (if (is_array? arr)
       (slice arr 0 (- arr.length 1))
       (throw TypeError (+ "but_last: expected array, but received " (sub_type arr))))
   {
     description: (+ "Given an array, returns all elements except the final element.  This "
                      "function is the inverse of `last`.  If there are less than 2 elements in the "
                      "array (0 or 1 elements), then an empty array is returned.  If a non-array is "
                      "provided, the function will throw a `TypeError`. ")
     usage: ["arr:array"]
     tags: ["array" "last" "elements" "front" "head" "rest"]
   })

(defun_sync random_int (`& `args)
       (let
            ((`top 0)
             (`bottom 0))
            (if (> (length args) 1)
                (do 
                    (= top (parseInt args.1))
                    (= bottom (parseInt args.0))
                )
                (= top (parseInt args.0))
            )
            (parseInt (+ (* (Math.random)(- top bottom)) bottom))
       )
       {
           description: (+ "Returns a random integer between 0 and the argument. " 
                           "If two arguments are provided then returns an integer "
                           "between the first argument and the second argument.")
           usage:["arg1:number","arg2?:number"]
           tags:["rand" "number" "integer" ]
       })


(defun_sync resolve_multi_path (path obj not_found)
  (do 
    ;(console.log "path: " path " obj: " obj)
    (cond
    (is_object? obj)
    (cond
      (and (== (length path) 1)
          (== "*" (first path)))
	  (or obj
	      not_found)
	  (and (== (length path) 1)
	       (is_object? (prop obj (first path))))
      (or (prop obj (first path))
           not_found)
      (and (== (length path) 1)
           (not (is_object? (prop obj (first path))))
           (not (eq nil (prop obj (first path)))))
      (prop obj (first path))
      (and (is_array? obj)
           (== "*" (first path)))
      (for_each (val obj)
         (resolve_multi_path (rest path) val not_found))
     
	  (and (is_object? obj)
	       (== "*" (first path)))
	  (for_each (val (values obj))
	    (resolve_multi_path (rest path) val not_found))
	  
	  (> (length path) 1)
	  (resolve_multi_path (rest path) (prop obj (first path)) not_found))
	 else
	 not_found))
   {
       `tags: ["path" "wildcard" "tree" "structure"]
       `usage:["path:array" "obj:object" "not_found:?*"]
       `description:  (+ "Given a list containing a path to a value in a nested array, return the value at the given " 
                         "path. If the value * is in the path, the path value is a wild card if the passed object " 
                         "structure at the path position is a vector or list.")
   })

(defun_sync delete_path (path obj)
   (let
      ((mpath (clone path))
       (key (pop mpath))
       (place_path mpath)
       (place nil))
      (when (not (is_array? path))
         (throw TypeError "path must be an array when provided to delete_path"))
      (when (not (is_object? obj))
         (throw TypeError "Invalid object provided to delete_path"))
      (cond 
         (and (== (length place_path) 0)
              (is_value? key))
         (progn
            (delete_prop obj key)
            obj)
         (and (> (length place_path) 0)
              (is_value? key))
         (progn
            (= place (resolve_path place_path obj))
            (when (is_object? place)
               (delete_prop place key))
            obj)
         else
         (throw TypeError "delete_path: invalid path or object provided")))
   {
       `description: (+ "Given a path and an target object, removes the specified value " 
                        "at the path and returns the original object, which will have been modified. "
                        "If the value isn't found, there are no modifications to the object and the "
                        "object is returned.  Will throw a TypeError if the obj argument isn't an "
                        "object type, of if the path isn't an array with at least one element.")
       `usage: ["path:array" "obj:object"]
       `tags: ["path" "delete" "remove" "object" "resolve" "modify" "value" ]
   })

(defun symbol_tree (quoted_form _state _current_path )
    (let
        ((acc [])
         (allocators {
                `let: [[1 `* 0]]
                `defun: [[1] [2 `*]]
                })
         (uop nil)
         (get_allocations (fn ()
                             (do
                              (= sym_paths (prop allocators (unquotify quoted_form.0)))
                              (when sym_paths
                                 (for_each (sym_path sym_paths)
                                    (do
                                        (= fval (resolve_multi_path sym_path quoted_form))
                                        (console.log "Fval is: " fval "sym_path: " sym_path "current_path: " _current_path " " quoted_form)
                                        (= uop (unquotify quoted_form.0))
                                        (if (is_array? fval)
                                          (for_each (`s fval)
                                            (do
                                              (= s (unquotify s))
                                              (when (eq nil (prop _state.definitions fval))
                                                    (set_prop _state.definitions
                                                              s
                                                              []))
                                              (push (prop _state.definitions s)
                                                   { `path: _current_path `op: uop })))
                                           (do 
                                               (when (eq nil (prop _state.definitions fval))
                                                    (set_prop _state.definitions
                                                              fval
                                                              []))
                                               (push (prop _state.definitions fval)
                                                     { `path: _current_path `op: uop })))))))))
         (idx -1)
         (fval nil)
         (sym_paths nil)
         (is_root (if (eq _state undefined)
                      true
                      false))
         (_state (if _state
                     _state
                     {
                        `definitions:{}
                     }))
         (_current_path (or _current_path [])))
        (declare (array _current_path))
        (console.log "symbol_tree: quoted_form: " quoted_form _current_path)
        (get_allocations)
        (cond
            (is_array? quoted_form)
            (do
                (map (fn (elem idx)
                         (do 
                            (ifa (symbol_tree elem _state (conj  _current_path idx))
                                 (push acc it))))
                     quoted_form)
                 (if is_root 
                     (+ { `tree: acc }
                        _state)
                     acc))
            (and (is_string? quoted_form)
                 (starts_with? "=:" quoted_form))
            (do 
                (unquotify quoted_form))
                
                
            (is_object? quoted_form)
            (do 
                (for_each (`pset (pairs quoted_form))
                    (ifa (symbol_tree pset.1 _state (conj _current_path [ pset.1 ]))
                         (push acc it)))
                (if is_root 
                     (+ { `tree: acc }
                        _state)
                     acc))))
    {
        `description: "Given a quoted form as input, isolates the symbols of the form in a tree structure so dependencies can be seen."
        `usage: ["quoted_form:quote"]
        `tags: ["structure" "development" "analysis"]
    })   


(defun except_nil (`items)
        (do 
            (defvar `acc [])           
            (if (not (eq (sub_type items) "array"))
                (setq items (list items))
            )
            (for_each (`value items)
                  (if (not (eq nil value))
                      (push acc value)))
            acc)
                        
        {
         "description":"Takes the passed list or set and returns a new list that doesn't contain any undefined or nil values.  Unlike no_empties, false values and blank strings will pass through."
         "usage":["items:list|set"]
         "tags": ["filter" "nil" "undefined" "remove" "no_empties"]
        }
    )

(defun each (items property)
       (cond 
           (or (is_string? property)
               (is_number? property))
               (except_nil
                   (for_each (`item (or items []))
                     (do 
                         (when item 
                               (prop item property)))))
         
           (eq (sub_type property) `array)
               (reduce (`item items)
                 (do 
                    (defvar `nl []) 
                    (for_each (`p property)
                        (cond 
                            (is_array? p)
                            (push nl (resolve_path p item))
                            (is_function? p)
                            (push nl (p item))
                            else
                            (push nl (prop item p))))
                    nl))
            (eq (sub_type property) `AsyncFunction)
                (reduce (`item items)
                 (property item))
            
            (eq (sub_type property) `Function)
                (reduce (`item items)
                 (property item))
             
           else
             (throw TypeError (+ "each: strings, arrays, and functions can be provided for the property name or names to extract - received: " (sub_type property))))
       {
           `description: (+ "Provided a list of items, provide a property name or " 
                            "a list of property names to be extracted and returned from the source array as a new list."
                            "If property is an array, and contains values that are arrays, those arrays will be treated as a path.")
           `usage: ["items:list" "property:string|list|function|AsyncFunction"]
           `tags: ["pluck" "element" "only" "list" "object" "property"]
       })

(defun_sync replace (`& args)
    (if (< args.length 3)
        (throw SyntaxError "Invalid syntax for replace: requires at least three arguments, target value or regex, the replacement value, and at least one value (object list or string)")
        (try
            (let
                ((target args.0)
                 (replacement args.1)
                 (work_values (slice args 2))
                 (value_type nil)
                 (sr_val nil)
                 (arg_value_type (subtype args.2))
                 (rval []))
             (for_each (value work_values)
                (do
                   (= value_type (subtype value))
                   (when (== value_type `Number)
                      (= value_type `String)
                      (= value (+ "" value)))
                   (cond
                       (== value_type `String)
                       (push rval (-> value `replace target replacement))
                       
                       (== value_type `array)
                       (for_each (`elem value)
                          (push rval
                                (replace target replacement elem)))
                       
                       (== value_type `object)
                       (do
                           (= sr_val {})
                           (for_each (`k (keys value))
                               (when (-> value `hasOwnProperty k)
                                  (set_prop sr_val
                                            k
                                            (replace target replacement (prop value k)))))
                           (= rval (-> rval `concat sr_val))))))
             (if (and (not (== arg_value_type `array))
                      (not (== arg_value_type `object)))
                 (first rval)
                 rval))
             (catch Error (`e)
               (console.error (+ "replace: " e)))))
  {
   `description: (+ "Given at least 3 arguments, finds the first  argument, and replaces with the second argument, operating on the third plus argument.  "
                    "This function will act to replace and find values in strings, arrays and objects.  When replacing values in strings, be aware that "
                    "only the first matching value will be replaced.  To replace ALL values in strings, use a RegExp with the `g flag set, such as "
                    "(new RegExp \"Target String\" `g).  For example, the following replaces all target values in the target string:<br>"
                    "(replace (new RegExp \"Indiana\" `g) \"Illinois\" \"The address of the location in Indiana has now been changed to 123 Main Street, Townville, Indiana.\")")
   `usage: ["target:string|regexp" "replacement:string|number" "container:string|array|object"]
   `tags: ["replace" "find" "change" "edit" "string" "array" "object"]
   })




(defun_sync get_symbol_details_for_ns (namespace symbol_name)
   (if (and (is_string? namespace)
            (is_string? symbol_name))
       (first (reduce_sync (entry (meta_for_symbol symbol_name true))
                 (when (== entry.namespace namespace)
                    entry)))
       (throw TypeError "get_symbol_for_ns: invalid arguments: must both be strings"))
   {
       `description: "Given a namespace and a symbol name returns the details for the specific symbol in the namespace if found, or nil if not."
       `tags: ["namespace" "symbol" "find" "meta" "details"]
       `usage: ["namespace:string" "symbol_name:string"]
   })


(defun env_encode_string (text)
   (let
      ((te (new TextEncoder))
       (enc (-> te `encode text))
       (decl [])
       (de (new TextDecoder))
       (bl nil))
      (for_each (`b enc)
         (progn
            (if (== b 92)
                (progn
                   (push decl 92)
                   (push decl 92)
                   (push decl 92)
                   (push decl 92))
                (progn
                   (push decl b)))))
      (-> de `decode (new Uint8Array decl))))
  

(defun cl_encode_string (text)
  (if (is_string? text)
      (let
          ((`escaped (replace (new RegExp "\n" `g) 
                              (+ (String.fromCharCode 92) "n") text))
           (`escaped (replace (new RegExp "\r" `g) 
                              (+ (String.fromCharCode 92) "r") escaped))
           (`nq (split_by (String.fromCharCode 34) escaped))
           (`step1 (join (+ (String.fromCharCode 92) (String.fromCharCode 34)) nq))
           (`snq (split_by (String.fromCharCode 39) step1)))
          ;(join (+ (String.fromCharCode 92) (String.fromCharCode 39)) snq))
         step1)
    text))



(defun_sync fn_signature (f)
    (if (or (is_function? f)
            (is_string? f))
        (let
            ((sig (trim (first (split_by "{" (replace "\n" "" (if (is_function? f)
                                                                  (-> f `toString)
                                                                  f))))))
             (arg_text nil)
             (comps nil)
             (descriptor nil)
             (fname nil)
             (ftype nil)
             (extends_class nil)
             (keyword_idx nil)
             (args nil))
          (cond
              (starts_with? "class" sig)
              (progn
                  (= ftype "class")
                  (= descriptor (split_by " " sig))
                  (= fname (second descriptor))
                  (if (== (prop descriptor 3) "extends")
                     (= extends_class (prop descriptor 4)))
                  {
                      `name: fname
                      `type: ftype
                      `extends: extends_class
                  })
              else
              (progn
                  (when sig
                      (= comps (split_by "(" sig))
                      (= descriptor (split_by " " (or (first comps) "")))
                      (= arg_text (or (chop (second comps)) "")))
                  (when (> descriptor.length 0)
                      (= keyword_idx (index_of "function" descriptor))
                      (when keyword_idx
                          (= fname (or (first (-> descriptor `slice (+ keyword_idx 1) (+ keyword_idx 2)))
                                       "anonymous"))
                          (= ftype (if (== keyword_idx 0)
                                       "sync"
                                       (prop descriptor (- keyword_idx 1))))))
                  
                  (if arg_text
                      (= args (for_each (a (or (split_by "," arg_text) []))
                                (trim a)))
                      (= args []))
                  
                  { `name: fname
                    `type: ftype
                    `args: args
                    
                    })))
    (throw TypeError "non-function supplied to fn_signature"))
    {
      `description: (+ "For a given function as an argument, returns an object with a " 
                       "type key containing the function type (async, sync) and an args "
                       "key with an array for the arguments.  Note that a string value which "
                       "is the result of a function serialized with the function's "
                       "toString() method can also be passed.")
      `usage: ["f:function|string"]
      `tags: ["function" "signature" "arity" "inspect"]
    })
 
(defun path_to_js_syntax (comps)
    (if (is_array? comps)
        (if (> comps.length 1)
            (join ""     
                  (map (fn (comp idx)
                           (if (== idx 0)
                               comp
                               (cond
                                   (and (isNaN (int comp))
                                        (starts_with? "\"" comp))
                                   (+ "[" comp "]")
                                   (isNaN (int comp))
                                   (+ "." comp)
                                   else
                                   (+ "[" "'" comp "'" "]"))))
                                   
                              ; (+ "[" (if (isNaN (int comp))
                               ;           (+ "'" comp "'")
                                ;          comp) "]")))
                       comps))
            comps.0)
        (throw TypeError (+ "path_to_js_syntax: need array - given " (sub_type comps))))
  {
   `description: "Used by the compiler, converts an array containing the components of a path to Javascript syntax, which is then returned as a string."
   `usage: ["comps:array"]
   `tags: ["compiler" "path" "js" "javascript"]
   })

(defun first_is_upper_case? (str_val)
    (progn
       (defvar rval (-> str_val `match (new RegExp "^[A-Z]")))
       (if (and rval rval.0)
           true
           false))
  {
  `description: "Returns true if the first character of the provided string is an uppercase value in the range [A-Z]. "
   `usage: ["str_val:string"]
   `tags: ["string" "case" "uppercase" "capitalized"]
   })
       
(defun safe_access_2 (token ctx sanitizer_fn)
    (let
        ((comps nil)
         (acc [])
         (acc_full [])
         (pos nil)
         (rval nil))
     (= comps (split_by "." token.name))
     (if (== comps.length 1)
         token.name
         (do 
             ;(debug)
             (set_prop comps
                       0
                       (sanitizer_fn comps.0))
             (while (> comps.length 0)
                (do 
                    (push acc
                          (take comps))
                    (if (> comps.length 0)
                        (push acc_full
                              (join "" ["check_true(" (expand_dot_accessor (join "." acc) ctx) ")"]))
                        (push acc_full
                          (expand_dot_accessor (join "." acc) ctx)))))
                          
             (= rval (flatten ["(" (join " && " acc_full) ")" ]))
             rval))))

(defun safe_access(token ctx sanitizer_fn)
    (let
        ((comps nil)
         (acc [])
         (acc_full [])
         (pos nil)
         (rval nil))
     (= comps (split_by "." token.name))
     (if (== comps.length 1)
         token.name
         (do 
             ;(debug)
             (set_prop comps
                       0
                       (sanitizer_fn comps.0))
             (while (> comps.length 0)
                (do 
                    (push acc
                          (take comps))
                    (push acc_full
                          (expand_dot_accessor (join "." acc) ctx))))
             (= rval (flatten ["(" (join " && " acc_full) ")" ]))
             rval))))

(defmacro compile_to_js (quoted_form) 
    `(-> Environment `compile ,#quoted_form)
    {
        `description: (+ "Given a quoted form, returns an array with two elements, element 0 is the compilation metadata, "
                         "and element 1 is the output Javascript as a string.")
        `usage: ["quoted_form:*"]
        `tags: ["compilation" "source" "javascript" "environment"]
    })

(defmacro `evaluate_compiled_source (compiled_source)
 `(-> Environment `evaluate ,#compiled_source nil { `compiled_source: true })
     {
         `description:(+ "The macro evaluate_compiled_source takes the direct output of the compiler, "
                         "which can be captured using the macro compile_to_js, and performs the "
                         "evaluation of the compiled source, thereby handling the second half of the "
                         "compile then evaluate cycle.  This call will return the results of "
                         "the evaluation of the compiled code assembly.")
         `usage: ["compiled_source:array"]
         `tags: ["compilation" "compile" "eval" "pre-compilation"] })
     
(defun form_structure (quoted_form max_depth)
      (let
          ((idx 0)
           (acc [])
           (max_depth (or max_depth MAX_SAFE_INTEGER))
           (structure quoted_form)
           (follow_tree (fn (elems acc _depth)
                            (cond
                                (and (or (is_array? elems)
                                         (is_object? elems))
                                     (>= _depth max_depth))
                                (if (is_array? elems)
                                    `array
                                    `object)
                                (is_array? elems)
                                (map (fn (elem idx)
                                                   (follow_tree elem [] (+ _depth 1)))
                                               elems)
                                
                                (is_object? elems)
                                (do 
                                  (for_each (`pset (pairs elems))
                                        (follow_tree pset.1 [] (+ _depth 1))))
                                   
                                else ;; not container, simple values record the final path in our acculumlator
                                (cond
                                   (and (is_string? elems)
                                        (starts_with? "=:" elems))
                                   `symbol
                                   (is_number? elems)
                                   `number
                                   (is_string? elems)
                                   `string
                                   (or (== elems true)
                                       (== elems false))
                                   `boolean
                                   else
                                   elems)))))
        (follow_tree structure [] 0))
    {
     `description: (+ "Given a form and an optional max_depth positive number, " 
                      "traverses the passed JSON form and produces a nested array structure that contains"
                      "the contents of the form classified as either a \"symbol\", \"number\", \"string\", \"boolean\", \"array\", \"object\", or the elem itself. "
                      "The returned structure will mirror the passed structure in form, except with the leaf contents "
                      "being replaced with generalized categorizations.")
     `tags: ["validation" "compilation" "structure"]
     `usage: ["quoted_form:*" "max_depth:?number"]
     })



(defun validate_form_structure (validation_rules quoted_form)
    (let
        ((results {
                  `valid: []
                  `invalid: []
                  `rule_count: (length validation_rules)
                  `all_passed: false
                   })
         (`all_valid nil)
         (target nil))
        (for_each (`rule (or validation_rules []))
          (do
           (when (and (is_array? rule)
                     (> rule.length 1)
                     (is_array? rule.0)
                     (is_array? rule.1))
              (= all_valid true)
              (= target (resolve_path rule.0 quoted_form))
              (for_each (`validation rule.1)
                  (when (not (validation target))
                      (= all_valid false)
                      (break)))
              (if all_valid
                  (push results.valid
                        (or rule.2 rule.0))
                  (push results.invalid
                        (or rule.2 rule.0))))))
      (set_prop results
                `all_passed
                (== (length results.valid) results.rule_count))
      results)
  {
    `description: (+ "Given a validation rule structure and a quoted form to analyze returns an object with "
                     "two keys, valid and invalid, which are arrays containing the outcome of the rule "
                     "evaluation, a rule_count key containing the total rules passed, and an all_passed key"
                     "which will be set to true if all rules passed, otherwise it will fail."
                     "If the rule evaluates successfully, valid is populated with the rule path, " 
                     "otherwise the rule path is placed in the invalid array.<br><br>"
                     "Rule structure is as follows:<br><code>"
                     "[ [path [validation validation ...] \"rule_name\"] [path [validation ...] \"rule_name\"] ]<br>"
                     "</code>"
                     "where path is an array with the index path and "
                     "validation is a single argument lambda (fn (v) v) that must either " 
                     "return true or false. If true, the validation is considered correct, " 
                     "false for incorrect.  The result of the rule application will be put in the valid array, " 
                     "otherwise the result will be put in invalid.")
    `tags: ["validation" "rules" "form" "structure"]
    `usage: ["validation_rules:array" "quoted_form:*"]
      })




;(use_quoted_initializer
 (defglobal *compiler_syntax_rules*
   { 
    `compile_let:  [ [[0 1 `val] (list is_array?) "let allocation section"]
                    [[0 2] (list (fn (v) (not (== v undefined)))) "let missing block"]]
    `compile_cond: [ [[0] (list (fn (v) (== (% (length (rest v)) 2) 0))) "cond: odd number of arguments" ]]
    `compile_assignment: [[[0 1] (list (fn (v) (not (== v undefined)))) "assignment is missing target and values"]
                          [[0 2] (list (fn (v) (not (== v undefined)))) "assignment is missing value"]]
    })


(defun tokenize_lisp (quoted_source)
   (let
      ((current_env (-> Environment `get_namespace_handle (current_namespace))))
   (compiler quoted_source
      { `only_tokens: true 
        `env: current_env
      }))
   {
     `description: (+ "Given a quoted source, returns the compilation tokens for the source, prior "
                      "to the actual compilation step.  Any functions that are specified as "
                      "compile_time for eval_when, such as macros, will be expanded and the results of "
                      "the expansions will be in the returned token form. ")
     `usage: ["quoted_source:*"]
     `tags: ["compilation" "compiler" "tokenize" "token" "tokens" "precompiler"]
   })

(defun detokenize (token)
   (let
      ((rval nil))
      (cond
         (is_array? token)
         (for_each (`t token)
            (detokenize t))
         (and (is_object? token)
              (== token.type "objlit")
              (== token.val.name "{}"))
         {}
         (and (is_object? token)
              (== token.type "objlit"))
         (progn
            (= rval (new Object))
            (for_each (t token.val)
               (set_prop rval
                  t.val.0.name
                  (detokenize t.val.1)))
            rval)
        
         (and (is_object? token)
              (== token.type "literal"))
         (detokenize token.val)
         
         (and (is_object? token)
              (== token.type "arr")
              token.source
              (== token.val.0.type "special")
              token.val.0.ref)
         (progn
            [token.val.0.val token.val.1])
          (and (is_object? token)
              ;(== token.type "num")
              token.ref)
         (+ "=:" token.name)
         (and (is_object? token)
              (== token.type "arr"))
         (progn
            (detokenize token.val))
         (and (is_object? token)
              token.ref)
         (progn
            token.val)
         (is_object? token)
         (detokenize token.val)
         else
         (progn
            token)))
   {
     `description: (+ "Converts the provided compiler tokens to a JSON structure representing "
                      "the original source tree. ")
     `usage: ["token_structure:object|array"]
     `tags: ["compilation" "compiler" "tokenize" "token" "tokens" "precompiler"]
   })



(defun describe_all ()    
    (apply add   
      (for_each (s (symbols))
        (to_object [[s (describe s)]])))
    {
        `description: "Returns an object with all defined symbols as the keys and their corresponding descriptions."
        `usage: []
        `tags: [`env `environment `symbol `symbols `global `globals ]
    })

(defun is_value? (val)
    (if (== val "")
        true
        (if (== val undefined)
            false
            (if (isNaN val)
                true                
                (if val
                  true
                  false))))
    {
     `description: "Returns true for anything that is not nil or undefined or false."
     `usage: ["val:*"]
     `tags: [`if `value `truthy `false `true ]
     })

(defun sort (elems options)
  (let
      ((opts (or (and (is_object? options)
                          options)
                 {}))
       (sort_fn nil)
       (sort_fn_inner nil)
       (keyed false)
       (reverser   (if opts.reversed
                     -1
                     1))
       (comparitor (cond
                     (is_function? opts.comparitor)
                     opts.comparitor                     
                     else
                     ;; we don't know what the elements can be so we need to have some detection work done
                     ;; for efficiency supply an explicit comparitor function for the elements.
                     (function (a b)
                               (cond
                                 (is_string? a)
                                 (if (is_string? b)
                                   (* reverser (-> a `localeCompare b))
                                   (* reverser (-> a `localeCompare (+ "" b))))
                                 
                                 (is_string? b)
                                 (* reverser (-> (+ "" a) `localeCompare b))

                                 opts.reversed
                                 (- b a)
                                 else
                                 (- a b)))))                                                                                           
       (key_path_a "aval")
       (key_path_b "bval"))
    
    ;; confirm we have an array for elements 
    (assert (is_array? elems) "sort: elements must be an array")
    (assert (== (subtype comparitor) "Function") (+ "sort: invalid comparitor provided : " (subtype comparitor) " - must be a synchronous function, or evaluate to a synchronous function."))
    
    (assert (or (and opts.comparitor (not opts.reversed))
                (and (not opts.comparitor) opts.reversed)
                (and (not opts.comparitor) (not opts.reversed)))
            "sort: comparitor option cannot be combined with reversed option")
    

    ;; build up our structures so we can create a fast sort lambda
    (cond
      (is_string? opts.key)
      (do
        (= keyed true)
        (= key_path_a (path_to_js_syntax (get_object_path (+ "aval." opts.key))))
        (= key_path_b (path_to_js_syntax (get_object_path (+ "bval." opts.key)))))
      (is_array? opts.key)
      (do
        (= keyed true)
        (= key_path_a (path_to_js_syntax (conj ["aval"] opts.key)))
        (= key_path_b (path_to_js_syntax (conj ["bval"] opts.key)))))
  
    (= sort_fn_inner (new Function "aval" "bval" "comparitor" (+ "return comparitor( " key_path_a "," key_path_b ")")))
    (= sort_fn (function (aval bval)
                         (sort_fn_inner aval bval comparitor)))
    (-> elems `sort sort_fn))
  {
   `description: (+ "Given an array of elements, and an optional options object, returns a new sorted array."
                    "With no options provided, the elements are sorted in ascending order.  If the key "
                    "reversed is set to true in options, then the elements are reverse sorted. "
                    "<br>"
                    "An optional synchronous function can be provided (defined by the comparitor key) which is expected to take "
                    "two values and return the difference between them as can be used by the sort method of "
                    "JS Array.  Additionally a key value can be provided as either a string (separated by dots) or as an array "
                    "which will be used to bind (destructure) the a and b values to be compared to nested values in the elements "
                    "of the array."
                    "<br>"
                    "<br>"
                    "Options:<br>"
                    "reversed:boolean:if true, the elements are reverse sorted.  Note that if a comparitor function is provided, then "
                    "this key cannot be present, as the comparitor should deal with the sorting order.<br>"
                    "key:string|array:A path to the comparison values in the provided elements. If a string, it is provided as period "
                    "separated values.  If it is an array, each component of the array is a successive path value in the element to be "
                    "sorted. <br>"
                    "comparitor:function:A synchronous function that is to be provided for comparison of two elements.  It should take "
                    "two arguments, and return the difference between the arguments, either a positive or negative.")
   `usage: ["elements:array" "options:object?"]
   `tags: [`array `sorting `order `reverse `comparison `objects]                    
   })

(defun and* (`& vals)
   (when (> vals.length 0)
       (defvar rval true)
       (for_each (`v vals)
          (when (not (is_value? v))
             (= rval false)
             (break)))
        rval)
    {
        `description: (+ "Similar to and, but unlike and, values that " 
                         "are \"\" (blank) or NaN are considered to be true."  
                         "Uses is_value? to determine if the value should be considered to be true."
                         "Returns true if the given arguments all are considered a value, " 
                         "otherwise false.  If no arguments are provided, returns undefined.")
        `usage: ["val0:*" "val1:*" "val2:*" ]
        `tags: ["truth" "and" "logic" "truthy"]
    })

(defun or* (`& vals)
   (when (> vals.length 0)
       (defvar rval false)
       (for_each (`v vals)
          (when (is_value? v)
             (= rval true)
             (break)))
        rval)
    {
        `description: (+ "Similar to or, but unlike or, values that " 
                         "are \"\" (blank) or NaN are considered to be true."  
                         "Uses is_value? to determine if the value should be considered to be true."
                         "Returns true if the given arguments all are considered a value, " 
                         "otherwise false.  If no arguments are provided, returns undefined.")
        `usage: ["val0:*" "val1:*" "val2:*" ]
        `tags: ["truth" "or" "logic" "truthy"]
    })

(defun either (`& args)
   (let
      ((rval nil))
      (for_each (`arg args)
         (do 
             (= rval arg)
             (when (and (not (== undefined arg))
                  (not (== nil arg)))
             (break))))
      rval)
  {
      `description: (+ "Similar to or, but unlike or, returns the first non nil " 
                       "or undefined value in the argument list whereas or returns " 
                       "the first truthy value.")
      `usage: ["values:*"]
      `tags: ["nil" "truthy" "logic" "or" "undefined"]
  })


(defun_sync sanitize_js_ref_name (symname)
          (cond 
            (not (is_string? symname))
            symname
            else
            (let
                ((`text_chars (split_by "" symname))
                 (`acc []))
              
              (for_each (`t text_chars)
                        (cond (== t "+")
                              (push acc "_plus_")
                              (== t "?")
                              (push acc "_ques_")
                              (== t "-")
                              (push acc "_")
                              (== t "&")
                              (push acc "_amper_")
                              (== t "^")
                              (push acc "_carot_")
                              (== t "#")
                              (push acc "_hash_")
                              (== t "!")
                              (push acc "_exclaim_")
                              (== t "*")
                              (push acc "_star_")
                              (== t "~")
                              (push acc "_tilde_")
                              (== t "~")
                              (push acc "_percent_")
                              (== t "|")
                              (push acc "_pipe_")
                              (contains? t "(){}")
                              (throw LispSyntaxError (+ "Invalid character in symbol: " symname))
                              else
                              (push acc t)))
              (join "" acc))))
       
(defmacro is_symbol? (symbol_to_find)
  `(not (or (== (typeof ,#symbol_to_find) "undefined")
            (== (-> Environment `get_global ,#symbol_to_find ReferenceError) ReferenceError)))

  {
   `usage: ["symbol:string|*"]
   `description: (+ "If provided a quoted symbol, will return true if the symbol can be found "
                    "in the local or global contexts.")

   `tags: ["context" "env" "def"]
   })


(defmacro defvalue (sym value meta)
   (let
      ((meta_data (if (is_object? meta) meta {})))
      `(let
          ((unquoted_sym (desym ,#sym))
           (details (describe unquoted_sym)))
          (if details
             (-> Environment `get_global (+ details.namespace "/" unquoted_sym))
             (defglobal ,#sym ,#value ,#meta_data))))
      {
      `description: (+ "If the provided symbol is already defined as an accessible "
                       "global value from the current namespace it will return the "
                       "defined value, otherwise it will define the global in the "
                       "current (implicit) namespace or the explicitly referenced " 
                       "namespace.  Returns the newly defined value or previously "
                       "defined value.")
      `usage: ["sym:symbol|string" "value:*" "meta:?object"]
      `tags: ["allocation" "reference" "symbol" "value" "set" "reference" "global"]
    })
   
(defmacro defparameter (sym value meta)
   (let
      ((meta_data (if (is_object? meta) meta {})))
      `(first
          (use_quoted_initializer
             (defglobal ,#sym ,#value ,#meta_data))))
          {
            `description: (+ "Defines a global that is always reset to the provided value, "
                             "when called or when the image is reloaded, ensuring that the "
                             "initial value is always set to a specific value.  If the value "
                             "is already defined, it will be overwritten.  To set a symbol in "
                             "an explicit namespace, provide a fully qualified symbol name "
                             "in the form of namspace/symname as the symbol to be defined. "
                             "Returns the defined value.")
            `usage: ["sym:symbol|string" "value:*" "meta:?object"]
            `tags: ["allocation" "reference" "symbol" "value" "set" "reference" "global"]
            })

(defun get_function_args (f)
    (let
        ((r (new RegExp |^[a-zA-Z_]+ [a-zA-Z ]*\\(([a-zA-Z 0-9_,\\.\\n]*)\\)| `gm))
         (s (-> f `toString))
         (r (scan_str r s)))
      (when (and (> r.length 0)
                 (is_object? r.0))
        (map (fn (v)
                 (if (ends_with? "\n" v)
                     (chop v)
                     v))
                 (split_by "," (or (second r.0) "")))))
    {
      `description: "Given a javascript function, return a list of arg names for that function"
      `usage: ["function:function"]
      `tags: [ "function" "introspect" "introspection" "arguments"]
     })   

(defun findpaths (value structure)
  (let
      ((acc [])  ;; the accumulator for our results      
       (search (fn (struct _cpath)  ;; the recursion routine
                 (cond
                   (is_array? struct)
                   (map (fn (elem idx)
                          (cond                               
                            (is_object? elem)
                            (search elem (conj _cpath [ idx ]))
                            
                               ;; simple value do comparison
                            (== elem value)
                            (push acc (conj _cpath [ idx ]))))
                        struct)
                   (is_object? struct)
                   (map (fn (pset)
                          (cond
                            (is_object? pset.1)
                            (search pset.1 (conj _cpath [ pset.0 ])) ;; path with key

                            (== pset.1 value)
                            (push acc (conj _cpath [ pset.1 ]))))
                        (pairs struct))

                   (== struct value)
                   (push acc _cpath)))))
    (search structure [])
    acc))


   

 (defglobal warn
   (defclog { `prefix: "⚠️  "  })
   {
    `description: "Prefixes a warning symbol prior to the arguments to the console.  Otherwise the same as console.log."
    `usage:["args0:*" "argsN:*" ]
    `tags: ["log" "warning" "error" "signal" "output" "notify" "defclog"]
    `initializer: (quote [ "=:defclog", { prefix: "⚠️  " } ])
    })

 (defglobal success
   (defclog { `color: `green `prefix: "✓  " })
   {
    `description: "Prefixes a green checkmark symbol prior to the arguments to the console.  Otherwise the same as console.log."
    `usage:["args0:*" "argsN:*" ]
    `tags: ["log" "warning" "notify" "signal" "output" "ok" "success" "defclog"]
    `initializer: (quote [ "=:defclog", { color: "green", prefix: "✓  " } ])
    })

(defmacro in_background (`& forms)
  `(new Promise
	(fn (resolve reject)
	    (progn
	      (resolve true)
	      ,@forms)))
  {
  `description: (+ "Given a form or forms, evaluates the forms in the background, with "
		   "the function returning true immediately prior to starting the forms.")
  `usage: ["forms:*"]
  `tags: ["eval" "background" "promise" "evaluation"]
  })

(defun set_compiler (compiler_function)
    (progn
        (-> Environment `set_compiler compiler_function)
        compiler_function)
    {
        `description: (+ "Given a compiled compiler function, installs the provided function as the "
                         "environment's compiler, and returns the compiler function.")
        `usage: ["compiler_function:function"]
        `tags:["compilation" "environment" "compiler"]
    })

(defun show (thing)
    (cond
      (is_function? thing)
      (-> thing `toString)
      else
      thing)
    { `usage: ["thing:function"]
    `description: "Given a name to a compiled function, returns the source of the compiled function.  Otherwise just returns the passed argument."
    `tags:["compile" "source" "javascript" "js" "display" ]
    
     })

(defmacro export_symbols (`& args)
  (let
      ((acc [ quote [javascript `export "{"]])
       (numargs (length args))
       (idx 0))
    (for_each (symname args)
              (do
                (cond
                  (and (is_array? symname)
                       (== symname.length 2))
                  (do
                    (push acc (deref symname.0))
                    (push acc " as ")
                    (push acc (deref symname.1)))
                  (is_string? symname)
                  (push acc (deref symname))
                  else
                  (throw SyntaxError "Invalid argument for export"))
                (inc idx)
                (if (< idx numargs)
                  (push acc ", "))))
    (push acc "}")
    acc)
    {
     `usage: ["arg0:string|array","argN:string|array"]
     `description: (+ "The export_symbols macro facilitates the Javascript module export functionality.  "
                      "To make available defined lisp symbols from the current module the export_symbols "
                      "macro is called with it's arguments being either the direct symbols or, if an "
                      "argument is an array, the first is the defined symbol within the lisp environment "
                      "or current module and the second element in the array is the name to be exported "
                      "as.  For example: <br> "
                      "(export lisp_symbol1 lisp_symbol2) ;; exports lisp_symbol1 and lisp_symbol2 directly. <br>"
                      "(export (lisp_symbol1 external_name)) ;; exports lisp_symbol1 as 'external_name`. <br>"
                      "(export (initialize default) symbol2) ;; exports initialize as default and symbol2 as itself.")
     `tags: ["env" "enviroment" "module" "export" "import" "namespace" "scope"]                      
     })

(defun register_feature (feature)
  (if (not (contains? feature *env_config*.features))
      (do
         (push *env_config*.features feature)
         true)
    false)
  {
  `description: "Adds the provided string to the *env_config* features.  Features are used to mark what functionality is present in the environment."
  `tags: ["environment" "modules" "libraries" "namespaces"]
  `usage: ["feature:string"]
  })

(defun object_methods (obj)
    (let
        ((properties (new Set))
         (current_obj  obj))
     (while current_obj
        (do
            (map (fn (item)
                     (-> properties `add item))
                 (Object.getOwnPropertyNames current_obj))
            (= current_obj (Object.getPrototypeOf current_obj))))
    (-> (Array.from (-> properties `keys))
        `filter (fn (item)
                    (is_function? item))))
    {
     `description: "Given a instantiated object, get all methods (functions) that the object and it's prototype chain contains."
     `usage: ["obj:object"]
     `tags: [`object `methods `functions `introspection `keys]
     })

(defun uniq (values)
     (let
         ((s (new Set)))         
             
                 (map (fn (x)
			  (-> s `add x))
                      (or values
                          []))
                (to_array s))
    { `description: (+ "Given a list of values, returns a new list with unique, deduplicated values. "
                       "If the values list contains complex types such as objects or arrays, set the "
                       "handle_complex_types argument to true so they are handled appropriately. ")
      `usage: ["values:list"]
      `tags: ["list" "dedup" "duplicates" "unique" "values"] })

(defmacro time_in_millis ()
        `(Date.now)
        { "usage":[]
          "tags":["time" "milliseconds" "number" "integer" "date"]
          "description":"Returns the current time in milliseconds as an integer" })

(defun defns (name options)
  (if (and options
           options.ignore_if_exists
           (is_string? name)
           (contains? name (namespaces)))
     name   ;; just return
     (create_namespace name options)) ;; try and make it 
  {
    description: (+ "Given a name and an optional options object, creates a new namespace "
                    "identified by the name argument.  If the options object is provided, the "
                    "following keys are available:<br><br>#### Options "
                    "<br><br>ignore_if_exists:boolean - If set to true, if the namespace is already "
                    "defined, do not return an error and instead just return with the name of the "
                    "requested namespace. Any other options are ignored and the existing namespace "
                    "isn\'t altered.<br>contained:boolean - If set to true, the newly defined "
                    "namespace will not have visibility to other namespaces beyond \'core\' and "
                    "itself.  Any fully qualified symbols that reference other non-core namespaces "
                    "will fail.<br>serialize_with_image:boolean-If set to false, if the environment "
                    "is saved, the namespace will not be included in the saved image file.  Default "
                    "is true. ")
    usage: ["name:string" "options:object"]
    tags: ["namespace" "environment" "define" "scope" "context"]
   })

(defmacro use_ns (name)
  `(set_namespace (desym ,#name))
  {
   `usage: [ "name:symbol" ]
   `description: "Sets the current namespace to the provided name.  Returns the name of the new namespace if succesful, otherwise an Eval error is thrown"
   `tags: ["namespace" "environment" "scope" "change" "set"]
   })

 (defun bind_and_call (target_object this_object method `& args)
        (do
            (defvar boundf (bind (prop target_object method) this_object))
            (if boundf
                (apply boundf args)
                (throw "unable to bind target_object")))
        {
            `usage:["target_object:object" "this_object:object" "method:string" "args0:*" "argsn:*"]
            `description: "Binds the provided method of the target object with the this_object context, and then calls the object method with the optional provided arguments."
            `tags:["bind" "object" "this" "context" "call"]
        })

(defun_sync clamp (value min max)
   (Math.min (Math.max min value) max)
   {
       `description: (+ "Given a numeric value, along with minimum and maximum values for the provided value, "
                        "the function will return the value if between the bounding values, otherwise "
                        "the closest bounding value will be returned.  If the value is above the provided "
                        "maximum, then the maximum will be returned.  If the value is below the minimum, then "
                        "the minimum value is returned.")
       `tags: ["value" "number" "min" "max" "bounds" "boundary" "range" ]
       `usage: ["value:number" "min:number" "max:number"]
   })
                       
(defglobal document (new Object))
(defun save_locally (fname data content_type)
     (if (prop window `document)
       (let
           ((blob (new Blob [ data ] { type: content_type }))
            (elem (-> (prop window `document) `createElement `a))
            (dbody (prop document `body)))
         (declare (object dbody))
         (set_prop elem
                   `href
                   (-> window.URL `createObjectURL blob)
                   `download
                   fname)
         (-> dbody `appendChild elem)
         (-> elem `click)
         (-> dbody `removeChild elem)
         true)
       false)
     {
      `description: (+ "Provided a filename, a data buffer, and a MIME type, such as \"text/javascript\", "
                       "triggers a browser download of the provided data with the filename.  Depending "
                       "on the browser configuration, the data will be saved to the configured "
                       "user download directory, or prompt the user for a save location. ")
      `usage: [ "filename:string" "data:*" "content_type:string" ]
      `tags: [ "save" "download" "browser" ]
      })
(undefine `document)


(defun fetch_text (url)
  (let
      ((resp (fetch url)))
    (if resp.ok
      (-> resp `text)
      (throw EvalError (+ "unable to fetch " url ": " resp.status ": " resp.statusText))))
  {
   `description: (+ "Given a url, returns the text content of that url. "
                    "This function is a helper function for the import macro.")
   `usage: [ "url:string" ]
   `tags: [`fetch `text `string ]
   })

;; The import macro handles loading and storage depending on the source

(defmacro import (`& args)
   (let
      ((filespec (last args))
       (is_url? (contains? "://" filespec))
       (js_mode nil)
       (url_comps nil)
       (js_mod nil)
       (load_fn nil)
       (target_symbols (if (> args.length 1)
                           args.0))
       (target_path nil)
       (in_browser? (not (contains? "Deno" navigator.userAgent)))
       (acc []))
      (cond
         ;; are we using network resources?
         (or is_url?
            (not (eq nil location)))
         (progn
            (setq load_fn `fetch_text)   ;; we will use fetch to GET the resource
            (setq url_comps (cond
                               is_url?
                               (new URL filespec)
                               (starts_with? "/" filespec)
                               (new URL (+ "" (prop location `origin) filespec))
                               else
                               (new URL (+ "" (prop location `origin) "/" filespec))))
            (setq target_path url_comps.pathname))
         (is_symbol? "read_text_file")
         (progn
            (setq load_fn `read_text_file)
            (setq target_path filespec))
         else
         (throw EvalError (+ "unable to handle import of " filespec)))
      (cond
         (or (ends_with? ".lisp" target_path)
             (ends_with? ".juno" target_path))
         
         `(evaluate (,#(+ "=:" load_fn) ,#filespec)
                    nil
                    (to_object [[ `source_name ,#filespec]
                                [ `throw_on_error true ]]))
         
         (ends_with? ".json" target_path)
         `(evaluate (JSON.parse (,#(+ "=:" load_fn) ,#filespec))
                    nil
                    (to_object [[`json_in true]
                                [`source_name ,#filespec ]
                                [`throw_on_error true]]))
         
         (or (ends_with? ".js" target_path)
             (and (is_symbol? `Deno)
                  (ends_with? ".ts" target_path)))
         (progn
            (cond
               (== (length target_symbols) 0)
               (throw SyntaxError "imports of javascript sources require binding symbols as the first argument")
               (is_array? target_symbols)
               (progn
                  (push acc
                     `(defglobal ,#target_symbols.0 (dynamic_import ,#filespec)
                         {
                           `is_import: true
                           `initializer: `(import ,@args)
                           }))
                  (push acc
                     `(set_path [ `imports (+ ,#(current_namespace) "/" (desym ,#target_symbols.0)) ] *env_config* (to_object [[`symbol (desym ,#target_symbols.0) ] [ `namespace ,#(current_namespace) ] [ `location ,#filespec ]])))
                  (push acc
                     `(when (prop ,#target_symbols.0 `initializer)
                         (-> ,#target_symbols.0 `initializer Environment)))
                  (push acc target_symbols.0)
                  ;(console.log "import: acc is: " (as_lisp acc))
                  `(iprogn
                      ,@acc))))
         (ends_with? ".ts" target_path)
         (throw EvalError ".ts extension requires Deno (which wasn't detected)")
         else
         (throw EvalError "invalid extension: needs to be .lisp, .js, .ts (in Deno), .json or .juno")))
   { `description: (+ "Dynamically load the contents of the specified source file (including "
                      "path) into the Lisp environment in the current namespace.<br>If the file is a "
                      "Lisp source, it will be evaluated as part of the load and the final result "
                      "returned.  <br>If the file is a JS source, it will be loaded into the "
                      "environment and a handle returned.  When importing non-Lisp sources (javascript "
                      "or typescript), import requires a binding symbol in an array as the first "
                      "argument.  <br>The allowed extensions are `.lisp`, `.js`, `.json`, `.juno`, and "
                      "if the JS platform is Deno, `.ts` is allowed.  Otherwise an `EvalError` will be "
                      "thrown due to a non-handled file type.<br><br>#### Examples - Server "
                      "<br><br>When on a server instance the path can be relative:```(import "
                      "\"tests/compiler_tests.lisp\")```<br><br>For a remote Javascript/Typescript "
                      "resource:```(import (logger) "
                      "\"https://deno.land/std@0.148.0/log/mod.ts\")```<br><br>For a local "
                      "Javascript/Typescript resource:```(import (logger) "
                      "\"/absolute/path/to/library.js\")\n```<br><br>Note that this is a dynamic import. "
                      "<br><br>#### Example - Browser <br><br>With the browser, to import, the "
                      "environment should be hosted for access to served resources:```(import "
                      "\"/pkg/doc_generation.juno\")```<br><br><br> ")

                  `tags: [`compile `read `io `file `get `fetch `load `dynamic_import ]
                  `usage: ["binding_symbols:array" "filename:string"]
                  })

(defglobal system_date_format
       {
          `weekday: "long"
          `year: "numeric",
          `month: "2-digit",
          `day: "2-digit",
          `hour: "numeric",
          `minute: "numeric",
          `second: "numeric",
          `fractionalSecondDigits: 3,
          `hourCycle: "h24"
          `hour12: false,
          `timeZoneName: "short"
        }
  {
   `description: (+ "The system date format structure that is used by the system_date_formatter."
                    "If modified, the system_date_formatter, which is a Intl.DateTimeFormat object "
                    "should be reinitialized by calling (new Intl.DateTimeFormat [] system_date_format).")
   `tags: ["time" "date" "system"]
   })
    
(defglobal system_date_formatter
  (new Intl.DateTimeFormat [] system_date_format)
  {
    `initializer: `(new Intl.DateTimeFormat [] ,#system_date_format)
    `tags: ["time" "date" "system"]
    `description: "The instantiation of the system_date_format.  See system_date_format for additional information."
  })

(defun tzoffset ()
  (* 60 (-> (new Date) `getTimezoneOffset))
  {
    `description: "Returns the number of seconds the local timezone is offset from GMT"
    `usage: []
    `tags: ["time" "date" "timezone"]
   })

     
(defun date_components (date_value date_formatter)
  (if (is_date? date_value)
    (to_object
     (map (fn (x)
            [x.type x.value])
          (if date_formatter
            (bind_and_call date_formatter date_formatter `formatToParts date_value)
            (bind_and_call system_date_formatter system_date_formatter `formatToParts date_value))))
    nil)
  {
   `usage: ["date_value:Date" "date_formatter:DateTimeFormat?"] 
   `description: "Given a date value, returns an object containing a the current time information broken down by time component. Optionally pass a Intl.DateTimeFormat object as a second argument."
   `tags: ["date" "time" "object" "component"]
   })
        
(defun formatted_date (dval date_formatter)
  (let
      ((`comps (date_components dval date_formatter)))
    (if comps
      (if date_formatter
        (join "" (values comps)) 
        (+ "" comps.year "-" comps.month "-" comps.day " " comps.hour ":" comps.minute ":" comps.second))
      nil))
                                        ;(-> dval `toString "yyyy-MM-d HH:mm:ss")
  {
   `usage: ["dval:Date" "date_formatter:DateTimeFormat?"]
   `description: "Given a date object, return a formatted string in the form of: \"yyyy-MM-d HH:mm:ss\".  Optionally pass a Intl.DateTimeFormat object as a second argument."
   `tags:["date" "format" "time" "string"]
   })

(defglobal *LANGUAGE* {})

(defun_sync dtext (default_text)
  (or
   (prop *LANGUAGE* default_text)
   default_text)
  { `usage: ["text:string" "key:string?"]
   `description: (+ "Given a default text string and an optional key, if a key "  
                    "exists in the global object *LANGUAGE*, return the text associated with the key. "
                    "If no key is provided, attempts to find the default text as a key in the *LANGUAGE* object. "
                    "If that is a nil entry, returns the default text.")
   `tags: ["text" "multi-lingual" "language" "translation" "translate"]
   })

(defun nth (idx collection)
  (cond 
    (is_array? idx)
    (map (lambda (v) (nth v collection)) idx)
    (and (is_number? idx) (< idx 0) (>= (length collection) (* -1 idx)))
    (prop collection (+ (length collection) idx))
    (and (is_number? idx) (< idx 0) (< (length collection) (* -1 idx)))
    undefined
    else
    (prop collection idx))
  {
   "description":(+ "Based on the index or index list passed as the first argument, " 
                    "and a collection as a second argument, return the specified values " 
                    "from the collection. If an index value is negative, the value "
                    "retrieved will be at the offset starting from the end of the array, "
                    "i.e. -1 will return the last value in the array.")
   "tags":["filter" "select" "pluck" "object" "list" "key" "array"]
   "usage":["idx:string|number|array","collection:list|object"]
   })

 
(defun_sync max_index (container)
   (Math.max 0 (- (length container) 1))
   {
       description: (+ "Given a container, typically an Array or derivative, "
                       "return the max index value, calculated as length - 1.<br>")
       usage: ["container:array"]
       tags: ["length" "array" "container" "max" "index" "range" "limit"]
   })
 

(defun_sync decode_text (buffer)
   (-> (new TextDecoder) `decode buffer)
   {
       `description: "Given a source buffer, such as a Uint8Array, decode into utf-8 text."
       `usage: ["buffer:ArrayBuffer"]
       `tags: ["decode" "encode" "string" "array" "text"]
   })

(defun_sync encode_text (text)
   (-> (new TextEncoder) `encode text)
   {
       `description: "Given a source buffer, such as a Uint8Array, decode into utf-8 text."
       `usage: ["buffer:ArrayBuffer"]
       `tags: ["decode" "encode" "string" "array" "text"]
   })
                       
               
(if_compile_time_defined `Deno
   (defun hostname ()
      (Deno.hostname)
      {
        `description: "Returns the hostname of the system the environment is running on."
        `usage: []
        `tags: ["hostname" "server" "environment"]
        }))

(defmacro use_symbols (namespace symbol_list target_namespace)
   (let
      ((acc [(quote progn)])
       (nspace (if namespace
                   (deref namespace))
               (throw "nill namespace provided to use_symbols"))
       (nspace_handle nil)
       (target_ns (if target_namespace
                      (deref target_namespace)))
       (decs nil))
      (when target_ns
         (push acc
            (quote (declare (namespace ,#target_ns)))))
      ;(assert (is_string? nspace))
      ;(assert (is_array? symbol_list) "invalid symbol list provided to use_symbols")
      (setq nspace_handle
         (-> Environment `get_namespace_handle nspace))
      
      (for_each (sym symbol_list)
         (progn
            (= decs (prop nspace_handle.definitions (deref sym)))
            (push acc `(defglobal ,#(deref sym)
                          ,#(+ "=:" nspace "/" (deref sym))
                          
                          (to_object [[ `initializer `(pend_load ,#nspace ,#(or target_ns (current_namespace)) ,#(deref sym) ,#(+ "=:" nspace "/" (deref sym)))]
                                      `[ `require_ns  ,#nspace ]
                                      `[ `requires [,#(+ "" nspace "/" (deref sym)) ]]
                                      [ `eval_when ,#(or (and decs (prop decs `eval_when)) {}) ]])))))
      (push acc (length symbol_list))
      acc)
   {
     `description: (+ "Given a namespace and an array of symbols (quoted or unquoted), "
                      "the macro will faciltate the binding of the symbols into the "
                      "current namespace. An optional target namespace can be provided "
                      "as a third argument, otherwise the value in (current_namespace) "
                      "is used.")
     `usage: [ "namespace:string|symbol" "symbol_list:array" "target_namespace:?string|symbol"]
     `tags: [ `namespace `binding `import `use `symbols ]
     })
  
(defun use_unique_symbols (source_namespace target_namespace)
   (if (is_string? source_namespace)
       (let
          ((symlist (-> Environment `evaluate (+ "(" source_namespace "/symbols { `unique: true })"))))
          (if target_namespace
             (unless (is_string? target_namespace)
                (throw TypeError "use_unique_symbols: provided target_namespace must be a string")))
          (console.log "target_namespace: " target_namespace)
          (if (is_string? source_namespace)
              (eval `(use_symbols ,#source_namespace ,#symlist ,#target_namespace))
              (eval `(use_symbols ,#source_namespace ,#symlist)))
          (length symlist))
       (throw TypeError "provided source_namespace must be a string"))
   {
     `description: (+ "This function binds all symbols unique to the provided "
                      "source_namespace identifier into the target_namespace "
                      "if provided, otherwise places the symbols into the "
                      "current namespace. Returns the amount of symbols bound.")
     `usage: ["source_namespace:string" "target_namespace:?string"]
     `tags: [ `namespace `binding `import `use `symbols ]
     })


(defun common_symbols ()
   (let
      ((acc {})
       (ns nil)
       (ns_total 0))
   (for (ns_name (namespaces))
        (inc ns_total)
        (= ns (-> Environment `get_namespace_handle ns_name))
        (for (symname (keys ns.global_ctx.scope))
             (aif (prop acc symname)
                 (set_prop acc symname
                    (+ it 1))
                 (set_prop acc symname
                           1))))
   (reduce (pset (pairs acc))
      (destructuring_bind (symname count)
         pset
         (when (== count ns_total)
            symname))))
   {
       description: "Returns a list of symbols that are common to all namespaces."
       usage: []
       tags: [ `symbol `symbols `namespaces `common `namespace ]
   })


(defun sort_dependencies ()
   (let
      ((ordered [])
       (invalids (make_set (conj (to_array (compiler [] { `special_operators: true `env: Environment }))
                                 (common_symbols))))
       (ns nil)
       (depends_on {})
       (inverted [])
       (namespace_order [  ])
       (ensure_before (fn (before after)
                         (unless (or (== before "EXTERNAL")
                                     (== after "EXTERNAL"))
                         (let
                            ((before_idx (index_of before namespace_order ))
                             (after_idx (index_of after namespace_order)))
                            ;(log "ensure_before: put: " before "(" before_idx ") prior to: " after "(" after_idx ")")
                            (cond
                               (== -2 (+ before_idx after_idx)) ;; they are both not found, so insert in order
                               (progn
                                  (push namespace_order before)
                                  (push namespace_order after))
                               (and (> before_idx -1)  ;; before is found 
                                    (== after_idx -1)) ;; after is not
                               (push namespace_order after)
                               (and (== before_idx -1)   ;; before is not found
                                    (> after_idx -1))    ;; after is
                               (progn
                                  (-> namespace_order `splice after_idx 0 before))
                               (> before_idx after_idx)  ;; both are found, but inverted order
                               (progn
                                  (-> namespace_order `splice before_idx 1) ;; remove before
                                  (-> namespace_order `splice after_idx 0 before)))))))
                                  
       (symname nil)
       (ns_marker (function (ns)
                     (+ "*NS:" ns)))
       (symbol_marker (function (ns symbol_name)
                         (+ "" ns "/" symbol_name)))
       (splice_before (fn (target_name value_to_insert)
                         (let
                            ((idx (index_of target_name ordered))
                             (value_idx (index_of value_to_insert ordered)))
                            (cond
                               (and (> value_idx -1)   ;; value is already there
                                    (== value_idx idx)) ;; value and target are at the same index (same thing)
                               true                    ;; do nothing
                               
                               (and (> value_idx -1)   ;; value is already there
                                    (< value_idx idx)) ;; and value is before target
                               true                    ;; don't do anything
                               
                               (and (> idx -1)         ;; target is found
                                    (== value_idx -1)) ;; dependency value isn't found
                               (-> ordered `splice idx 0 value_to_insert)  ;; splice dependency before target
                               
                               (and (== idx -1)        ;; target isn't found
                                    (> value_idx -1))  ;; value is already there
                               (push ordered target_name) ;; just add the target at the end
                               
                               
                               (== idx -1)             ;; target isn't found and we know value wouldn't be there because above
                               (progn
                                  (push ordered          ;; insert the value depended on
                                     value_to_insert)
                                  (push ordered
                                     target_name))   ;; then the symbol depending on it
                               
                               (and (> idx -1)         ;; both the target and
                                    (> value_idx -1)   ;; the value are found
                                    (< idx value_idx)) ;; but the target is before the value
                               (progn
                                  (-> ordered `splice value_idx 1) ;; remove the value which is lower down the list
                                  (-> ordered `splice idx 0 value_to_insert)) ;; splice it in before the target.. move it up
                               else
                               (console.log "fall through: target: " target_name "@" idx "  " value_to_insert "@" value_idx)))))
       (current_pos nil))
      (for_each (name (conj [ "core" ] ;; core always first
                            (reduce (name (namespaces))
                               (unless (== name "core")
                                  name))))
         (progn
            (= ns (-> Environment `get_namespace_handle name))  ;; get the namespace handle
            ;; loop through the definitions and build the dependency
            (for_each (`pset (pairs ns.definitions))
               (destructuring_bind (symname symdef)
                  pset
                  (cond
                     (-> invalids `has symname)
                     nil ;; do nothing
                     symdef.require_ns
                     (progn
                        (unless (prop depends_on symdef.require_ns)
                           (set_prop depends_on symdef.require_ns []))
                        (unless (contains? name (prop depends_on symdef.require_ns))
                           (push (prop depends_on symdef.require_ns) name)))
                     symdef.requires
                     (for_each (req symdef.requires)
                        (destructuring_bind (req_sym req_ns explicit)
                           (decomp_symbol req name)
                           (when (and req_ns 
                                      (not (== req symname))
                                      (not (contains? req invalids)))
                              
                                      ;; do not count recursive relationships
                              (when (not (== req_ns name))
                                 (unless (prop depends_on req_ns)
                                    (set_prop depends_on req_ns []))
                                 (when (and (not (contains? name (prop depends_on req_ns)))
                                            (not (== name "core")))
                                    (push (prop depends_on req_ns) name)))
                              (splice_before (symbol_marker name symname) (symbol_marker req_ns req_sym)))))
                     else
                     (progn
                        (when (== (index_of (symbol_marker name symname) ordered) -1)
                           (push ordered
                              (symbol_marker name symname)))))))))
      ;; depends on now is the form of namespace:[dependent namespaces]
      ;; sort into dependency order
      ;; core always first 
      ;(log "depends_on: " (pairs depends_on))
      (defvar score {})
      (for ((parent_namespace dependents) (pairs depends_on))
           (for (dependent dependents)
                (push inverted [dependent parent_namespace])))
      (for ((dependent parent_namespace) inverted)
           (ensure_before parent_namespace dependent))
       
      
      (for (ns (namespaces))
         (unless (contains? ns namespace_order)
            (push namespace_order ns )))
      (log "sort_dependencies: namespace dependency order: " namespace_order)
      ;(log "sort_dependencies: all namespaces: " (namespaces))
      
      { namespaces: namespace_order
                   symbols: ordered })
   {
     description: (+ "Returns an object containing two keys, `namespaces` and `symbols`, each "
                     "being arrays that contains the needed load order to satisfy the dependencies "
                     "for the current environment with all namespaces.  For symbols, the array is "
                     "sorted in terms of dependencies: a symbol appearing with a higher index value "
                     "will mean that it is dependent on symbols at a lower index value, with the "
                     "first symbol having no dependencies, and the final element having the most "
                     "dependencies.  For example, if the final symbol in the returned array is to be "
                     "compiled, symbols at a lower index must be defined prior to compiling the final "
                     "symbol.<br>The namespaces reflect the same rule: a lower indexed namespace must "
                     "be loaded prior to a higher indexed namespace. ")
     usage: []
     tags: [`symbol `symbols `dependencies `requirements `order `compile ]});

;; *scratch* buffer

(defun symbols_by_namespace (options)
  (let
      ((ns_handle nil))
    (to_object
        (for_each (ns (namespaces))
           (progn
               (= ns_handle (-> Environment `get_namespace_handle ns))
               (if options.include_meta
                  [ns 
                   (to_object (conj
                                    (for_each (pset (pairs ns_handle.definitions))
                                              (destructuring_bind (sym_name val)
                                                                  pset
                                                                  [sym_name (+ {}
                                                                               (if (eq nil val.type)                                                                                 
                                                                                 { type: "Unknown!" }
                                                                                 {})
                                                                               val) ]))
                                    (for_each (pset (pairs ns_handle.context.scope))
                                       (destructuring_bind (sym_name val)
                                          pset
                                          [sym_name (+ {
                                                         `type: (sub_type val)
                                                         }
                                                      (aif (prop ns_handle.definitions sym_name)
                                                           it
                                                           {}))
                                            ]))
                                    ))]
                                                             
                  [ns (sort (cond
                               false ;options.filter_by   ;; deprecated and not full coverage 
                               (progn
                                  (reduce (pset (pairs ns_handle.context.scope))
                                     (destructuring_bind (name val)
                                        pset
                                        (if (options.filter_by name { `type: (sub_type val) })
                                            name))))
                               else
                               (uniq (conj (keys ns_handle.context.scope)
                                           (keys ns_handle.definitions))))) ])))))
  {
   
    `description: (+ "<br><br>By default, when called with no options, the `symbols_by_namespace` "
                     "function returns an object with a key for each namespace, with an array "
                     "containing the symbols (in a string format) defined in that "
                     "namespace. <br>There is an optional `options` object argument which can modify "
                     "the returned results and format.  <br><br>#### Options "
                     "<br><br>include_meta:function -If true, will return the meta data associated "
                     "with each symbol from the Environment definitions.  The output format is "
                     "changed in this situation: instead of an array being returned, an object with "
                     "the symbol names as keys and the meta data values as their value is returned.   ")
    `usage: ["options:object"]
    `tags: ["symbols" "namespace" ]
    })

(defglobal *formatting_rules*
  {
    minor_indent: ["defun", "defun_sync", "defmacro", "define", "when", "let", "destructuring_bind", "while",
                   "for_each","fn","lambda","function", "progn","do","reduce","cond","try","catch","macroexpand",
                   "compile" "unless" "for_with" "no_await" "reduce_sync"]
    keywords: ["-" "->" "*" "**" "/" "%" "+" "<" "<<" "<=" "=" "==" "=>" ">" ">=" ">>" "and" "apply" "break" "call"
               "cond" "debug" "dec" "declare" "defconst" "defglobal" "defvar" "do" "dynamic_import" "eq" "eval" "fn"
               "for_each" "for_with" "function" "function*" "if" "inc" "instanceof" "javascript" "jslambda" "lambda"
               "let" "list" "new" "or" "progl" "progn" "prop" "quote" "quotel" "quotem" "return" "set_prop" "setq"
               "static_import" "throw" "try" "typeof" "unquotem" "while" "yield"]
    functions: []
    allocating_forms: {
                       `let: (fn (tree)
                                (progn
                                   (flatten [ (resolve_multi_path [ 1 `* 0 ] tree) ])))
                       `defun: (fn (tree)
                                  (progn
                                     (conj (list (resolve_path [ 1 ] tree))
                                           (flatten (resolve_path [ 2 ] tree)))))
                       `defun_sync: (fn (tree)
                                       (progn
                                          (conj (list (resolve_path [ 1 ] tree))
                                                (flatten (resolve_path [ 2 ] tree)))))
                       `defmacro: (fn (tree)
                                     (progn
                                        (conj (list (resolve_path [ 1 ] tree))
                                              (flatten (resolve_path [ 2 ] tree)))))
                       `function: (fn (tree)
                                     (flatten [ (resolve_path [ 1 ] tree) ]))
                       `fn: (fn (tree)
                               (flatten [ (resolve_path [ 1 ] tree) ]))
                       `lambda: (fn (tree)
                                   (flatten[ (resolve_path [ 1 ] tree) ]))
                       `destructuring_bind: (fn (tree)
                                               (progn
                                                  (flatten [(resolve_path [ 1 ] tree)])))
                       `defvar: (fn (tree)
                                   [list  (prop tree 1) ])
                       `for_each: (fn (tree)
                                     [list (resolve_path [ 1 0 ] tree)])
                       `for_with: (fn (tree)
                                     [list (resolve_path [ 1 0 ] tree)])
                       `reduce: (fn (tree)
                                   [list (resolve_path [ 1 0 ] tree)])
                       `reduce_sync: (fn (tree)
                                        [list (resolve_path [ 1 0 ] tree)])
                       `defglobal: (fn (tree)
                                      [list (prop tree 1)])
                       `defparameter: (fn (tree)
                                         [list (prop tree 1)])
                       
                       }
    })
   
(defun all_globals ()
   (let
      ((acc (new Set)))
   (for_each (ns (namespaces))
      (for_each (k (keys (resolve_path [ `global_ctx `scope ] (-> Environment `get_namespace_handle ns))))
         (-> acc `add k)))
   acc)
   {
       `usage: []
       `description: "Returns a set of all global symbols, regardless of namespace."
       `tags: ["editor" "globals" "autocomplete"]
   })


(defun sleep (seconds)
       (new Promise 
            (fn (resolve)
                (setTimeout (lambda() (resolve true)) (* seconds 1000))))
        {"usage":["seconds:number"]
         "tags":["time" "timing" "pause" "control"]
         "description":"Pauses execution for the number of seconds provided to the function." }) 

(defun process_tree_symbols (tree prefix _ctx)
   (let
      ((is_root (eq nil _ctx))
       (rval nil)
       (_ctx (or _ctx {
                        acc: []
                        allocations: (new Set)
                        symbols: (new Set)
                        keywords: (new Set)
                        literals: (new Set)
                        globals: (new Set)
                        global_detail: {}
                        }))
       (symbol nil)
       (global_details nil)
       (allocator nil)
       (allocations nil)
       (sort_token (fn (t)
                      (progn
                         (= symbol (desym_ref t))
                         (unless (== symbol prefix)
                            (cond
                               (is_array? t)
                               (process_tree_symbols t prefix _ctx)
                               
                               (contains? symbol *formatting_rules*.keywords)
                               (-> _ctx.keywords `add symbol)
                               
                               (progn
                                  (= global_details (meta_for_symbol symbol true) )
                                  (> (length global_details) 0))
                               (progn
                                  (-> _ctx.globals `add symbol))
                               
                               (is_reference? t)
                               (-> _ctx.symbols `add (desym_ref t))
                               (or ;(is_string? t)
                                  (is_number? t)
                                  (== true t)
                                  (== false t)
                                  (== "nil" (desym_ref t)))
                               (-> _ctx.literals `add (+ "" t)))))))
       (format_token (fn (token)
                        {
                            `value: token.name
                            `score: 0
                            `meta: (if (== token.type "arg")
                                       "local"
                                       token.type)
                        })))
      (cond
         (and (is_array? tree)
              (> tree.length 0))
         (progn
            (= allocator (prop *formatting_rules*.allocating_forms (desym_ref (prop tree 0))))
            (if (is_function? allocator)
                 (progn
                    (= allocations (allocator tree))
                    (for_each (allocation allocations)
                       (progn
                          (= symbol (desym_ref allocation))
                          (unless (or (== symbol prefix)
                                      (== symbol "\"&\""))
                             (-> _ctx.allocations
                                `add symbol))))))
                    
            (for_each (`t tree)
               (progn
                  (sort_token t))))
         (is_object? tree)
         (progn
            (for_each (pset (pairs tree))
               (progn
                  (-> _ctx.literals 
                     `add pset.0)   ;; the key
                  (sort_token pset.1))))
         else
         (sort_token tree))
      
      (when is_root
         (= rval {
             allocations: (to_array _ctx.allocations)
             symbols: (to_array _ctx.symbols)
             keywords: (to_array _ctx.keywords)
             literals: (to_array _ctx.literals)
             globals: (to_array _ctx.globals)
             }))
      rval)
   {
       `usage: ["tree:*"]
       `description: (+ "Given a JSON structure, such as produced by the reader, returns an object containing the various determined types of the provided structure:<br>"
                        "allocations:array - All locally allocated symbols<br>"
                        "symbols:array - All identified symbols<br>"
                        "keywords:array - All keywords used in the structure"
                        "literals:array - All identified literals (i.e. not a symbol)"
                        "globals:array - All referenced globals")
       `tags: ["editor" "usage" "scope" "structure" ]
   })

(defun_sync keys* (obj)
  (if (is_object? obj)
    (let
        ((current_obj obj)
         (prototypes [])
         (properties (first prototypes)))
    (while current_obj
        (do
            (= properties (new Set))
            (push prototypes properties)
            (for_each (item (Object.getOwnPropertyNames current_obj))
                     (-> properties `add item))
            (= current_obj (Object.getPrototypeOf current_obj))))
    (flatten
        (for_each (s prototypes)
            (-> (Array.from s) `sort))))
    
    (throw TypeError "keys*: invalid object as argument"))
  {
   `description: (+ "Like keys, but where keys uses Object.keys, keys* uses the function Object.getOwnpropertynames and returns the "
                    "prototype keys as well.")
   `usage: ["obj:Object"]
   `tags: ["object" "array" "keys" "property" "properties" "introspection"]
   })

(defun_sync pairs* (obj)
  (if (is_object? obj)
    (for_each (k (keys* obj))
      [k (prop obj k)]))
  {
      `description: "Like pairs, but where keys uses Object.keys, pairs* returns the key-value pairs prototype heirarchy as well."
      `usage: ["obj:Object"]
      `tags: ["object" "array" "keys" "property" "properties" "introspection" "values"]
   })

(defmacro for ((symbol_list array_ref) `& body_forms)
   (let
      ((sym_list symbol_list))
      (if (is_array? sym_list)
          `(for_each (_pset ,#array_ref)
              (destructuring_bind ,#sym_list
                 _pset
                 ,@body_forms))
          `(for_each (,#sym_list ,#array_ref)
              (progn
                 ,@body_forms))))
   {
     description: (+ "The for macro provides a facility for looping through arrays, "
                      "destructuring their contents into local symbols that can be used in a block.  "
                      "The `for` macro is a higher level construct than the `for_each` operator, as it "
                      "allows for multiple symbols to be mapped into the contents iteratively, vs. "
                      "for_each allowing only a single symbol to be bound to each top level element in "
                      "the provided array.<br>The symbol_list is provided as the lambda list to a "
                      "`destructuring_bind` if multiple symbols are provided, otherwise, if only a "
                      "single variable is provided, the `for` macro will convert to  a for_each call, "
                      "with the `body_forms` enclosed in a `progn` block.  <br><br>#### Examples "
                      "<br><br>An example of a multiple bindings is below.  The values of `positions` "
                      "are mapped (destructured) into x, y, w and h, respectively, each iteration "
                      "through the loop mapping to the next structured element of the array:```(let\n "
                      "((positions\n      [[[1 2] [5 3]]\n       [[6 3] [10 2]]]))\n  (for ([[x y] [w h]] "
                      "positions)\n       (log \"x,y,w,h=\" x y w h)\n       (+ \"\" x \",\" y \"+\"  w \",\" h "
                      ")))```<br><br>Upon evaluation the log output is as follows:```\"x,y,w,h=\" 1 2 5 "
                      "3```<br>```\"x,y,w,h=\" 6 3 10 2```<br><br>The results returned from the "
                      "call:```[\"1,2+5,3\"\n \"6,3+10,2\"]```<br><br>Notice that the `for` body is wrapped "
                      "in an explicit `progn` such that the last value is accumulated and returned "
                      "from the `for` operation.<br>An example of single bindings, which essentially "
                      "transforms into a `for_each` call with an implicit `progn` around the body "
                      "forms.  This form is essentially a convenience call around `for_each`.  ```(for "
                      "(x [1 2 3])\n     (log \"x is: \" x) \n     (+ x 2))```<br><br>Both the log form "
                      "and the final body form `(+ x 2)` are the body forms and will be evaluated in "
                      "sequence, the final form results accumulating to be returned to the "
                      "caller.<br>Log output from the above:```\"x is: \" 1\n\"x is: \" 2\n\"x is: \" "
                      "3```<br><br>Return value:```[3 4 5]```<br>")
     usage: ["allocations_and_values:array" "body_forms:*"]
     tags: [`iteration `loop `for `array `destructuring ]
   })

(defmacro for_items ((iteration_symbol collection) `& body_forms)
   `(let
      ((__collection ,#collection))
      (for_each (__idx (range __collection.length))
       (progn
          (defvar ,#iteration_symbol (-> __collection `item __idx))
          ,@body_forms)))
   {
     description: (+ "The `for_items` macro takes a collection, checks the length property "
                     "and then iterates through the collection assigning each value in the collection "
                     "to the provided iterator symbol.  The behavior is similar to `for_each` where "
                     "the final result of the body forms is accumulated and returned as an "
                     "array.  <br>The `for_items` macro provides a `progn` wrapper around the body "
                     "forms so it is not required to provide a block specifier in the body forms "
                     "provided.<br> ")

     usage: ["allocation_and_collection:array" "body:array"]
     tags: ["iteration" "for" "loop" "iterator" "collection" ]
   })



(defun_sync word_wrap (text ncols)
   (let
      ((line_length 0)
       (words (split_by " " text))
       (max_cols (or ncols 80))
       (current_line [])
       (lines []))
      (for_each (word (or words []))
         (cond
            (>= (+ line_length (length word)) max_cols)
            (progn
               (push lines (join " " current_line))   ;; over the limit, push the current line into line
               (= current_line [ word ])   ;; make a new line and add the word to it
               (= line_length (+ (length word) 1))) ;; set the current line length to the word + 1 space
            else
            (progn
               (push current_line word)    ;; otherwise add the word to the current line
               (inc line_length (+ (length word) 1))))) ;;...and update our line length counter
                    
      
      ;; push any remaining last line into the lines accumulator
      (if (> current_line.length 0)
          (push lines (join " " current_line)))
      ;; and return lines
      lines)
   {
       `description: (+ "Given a string of text and an optional column length "
                        "returns an array of lines wrapped at or before the "
                        "column length.  If no column length is provided, "
                        "the default is 80.")
       `usage: ["text:string" "ncols:?number"]
       `tags: ["text" "string" "wrap" "format" ]
   })
 
 (defmacro progc (`& forms)
   `(try
       (progn
          ,@forms)
       (catch Error (e)
          (log e.message)))
   {
       `description: (+ "This macro wraps the provided forms in a "
                        "try-catch, and returns the last value if "
                        "no errors, like progn, or if an error "
                        "occurs, logs to the console.  Simple "
                        "help for debugging.")
       `tags: ["debug" "error" "catch" "handler" "progn" "eval"]
       `usage: ["forms:*"]
   })

(defun_sync reverse_string (text)
   (join "" (-> (split_by "" text) `reverse))
   {
       description: "Given a string, returns the characters in reverse order."
       usage: ["text:string"]
       tags: ["string" "text" "reverse" "modify" ]
   })

(defun_sync last_n_chars (n text)
   (if (is_string? text)
       (-> text `substr (* -1 n))
       nil)
   {
       description: "For a given string, returns the last n characters as a string."
       usage: ["n:number" "text:string"]
       tags: ["string" "text" "last" "amount" "end" "tail"]
   })

(defun_sync last_n (n arr)
   (if (and (> n 0)
            (is_array? arr))
       (-> arr `slice (* -1 n))
       nil)
   {
       description: "For a given array, returns the last n elements as an array."
       usage: ["n:number" "arr:array"]
       tags: ["array" "list" "last" "amount" "end" "tail"]
   })
 
(defun_sync from_last (amount arr)
   (prop arr (- arr.length (+ 1 amount)))
   {
     description: (+ "Given an offset amount and an array, `from_last` returns the value at "
                      "the offset amount from the end of the array. ")
     usage: ["amount:number" "arr:array"]
     tags: ["array" "list" "last" "amount" "end" "tail"]
   })



(defun_sync analyze_text_line (line)
  (let
     ((delta 0)
      (indent_spaces 0)
      (base_indent nil)
      (idx -1)
      (openers [])
      (closers [])
      (code_mode true)      
      (cpos nil)
      (last_c nil)
      (last_delim nil))   
   (for_each (c (split_by "" line))
      (progn
        (inc idx)
        (cond
          (and (== c "\"")               
               (or (eq nil last_c)
                   (and last_c
                        (not (== 92 (-> last_c `charCodeAt))))))
          (= code_mode (not code_mode))
          
          (and code_mode
               (== c ";"))
          (progn
           (break))
          
          (and code_mode
               (or (== c "(")
                   (== c "{")
                   (== c "[")))
           (progn
                (inc delta)
                (push openers idx)
                (= base_indent indent_spaces)
                (= cpos idx)
                (= last_delim c))
           (and code_mode
             (or (== c ")")
                 (== c "]")
                 (== c "}")))
           (progn
              (dec delta)
              (push closers idx)
              (= cpos idx)
              (= last_delim c))
           (and code_mode
                (== c " ")
                (not base_indent))
           (progn
              (inc indent_spaces))
           
           (not base_indent)
           (= base_indent indent_spaces))
           (= last_c c)))
      (when (eq undefined base_indent)
         (= base_indent indent_spaces))
      { delta: delta
        final_type: last_delim
        final_pos: cpos
        line: line
        indent: base_indent
        openers: openers
        closers: closers
        })
  { description: (+ "Given a line of text, analyzes the text for form/block openers, identified as "
                    "(,{,[ and their corresponding closers, which correspod to ),},].  It then returns "
                    "an object containing the following: <br><br>"
                    "{ delta:int   - a positive or negative integer that is represents the positive or negative depth change, <br>"
                    "  final_type: string - the final delimiter character found which can either be an opener or a closer, <br>"
                    "  final_pos: int - the position of the final delimiter, <br>",
                    "  line: string - the line of text analyzed, <br>",
                    "  indent: int - the indentation space count found in the line, <br>",
                    "  openers: array - an array of integers representing all column positions of found openers in the line.<br>"
                    "  closers: array - an array of integers representing all column positions of found closers in the line. }<br><br>"
                    "The function does not count opening and closing tokens if they appear in a string.")
    tags: [ `text `tokens `form `block `formatting `indentation ]
   usage: ["line:string"] })

(defun_sync calculate_indent_rule (delta movement_needed)
   (let
      ((lisp_line (-> delta.line `substr (first delta.openers)))
       (remainder_pos (if (> delta.openers.length 0)
                          (or (prop delta.openers (- movement_needed 1))
                              (first delta.openers)
                              delta.indent)
                          0))
       (remainder (-> delta.line `substr (+ 1 remainder_pos)))
       (comps (reduce_sync (c (split_by " " remainder))
                             (when (not (blank? c))
                                c)))
       (symbol_details (if (and (> comps.length 0)
                                (not (contains? "(" comps.0))
                                            (not (contains? "{" comps.0))
                                            (not (contains? "[" comps.0)))
                                        (or (first (meta_for_symbol comps.0 true))
                                            { `type: "-" })
                                        { `type: "-" })))
      ;(log "-> remainder_pos" remainder_pos "movement needed: " movement_needed delta.openers "comps" comps)
      (cond
         (== movement_needed 0)
         true
         (and (== comps.length 0)
              (== delta.openers.length 0)
              (== delta.closers.length 0))
         true
         (or (starts_with? "def" comps.0)
             (contains? comps.0 *formatting_rules*.minor_indent))
         (progn
            ;(log "rule 0")
            (set_prop delta
                      `indent
                      (+ remainder_pos 3)))
         
         (and (or (and symbol_details.type
                       (contains? "Function" symbol_details.type))
                  (contains? comps.0 *formatting_rules*.keywords))
              (contains? delta.final_type ["(" "[" ")" "]"]))
                            
         (progn
            (if (and (== (length delta.closers) 0)
                     (== (length delta.openers) 1))
                (progn
                   ;(log "rule 1A")
                   (set_prop delta
                      `indent
                      (+ remainder_pos 3)))
                (progn
                   ;(log "rule 1B")
                   (set_prop delta
                      `indent
                      (+ remainder_pos comps.0.length 2)))))
            
         
         
         (contains? comps.0 built_ins)
         (progn
            ;(log "rule 3")
            (set_prop delta
                      `indent
                      (+ remainder_pos comps.0.length 2)))
         
         (== delta.final_type "[")
         (progn
            ;(log "rule 4")
            (set_prop delta
                     `indent
                     (+ remainder_pos 1)))
         (or (starts_with? "[" comps.0)
             (starts_with? "(" comps.0))
         (progn
            ;(log "rule 5")
            (set_prop delta
                     `indent
                     (+ remainder_pos 1)))
         (== comps.length 1)
         (progn
            ;(log "rule 6")
            (set_prop delta
                     `indent
                     (+ remainder_pos 3)))
         (and (== delta.final_type "{")
              (> movement_needed 0))
         (progn
            ;(log "rule 2")
            (set_prop delta
               `indent
               (+ remainder_pos 2)))
               ;(+ (last delta.openers) 2)))
         (== comps.length 0)
         (progn
           ;(log "rule 7")
           (set_prop delta
                     `indent
                     (+ 1 remainder_pos)))
         else
         (progn
            ;(log "rule D")
            (set_prop delta
                      `indent
                      (+ remainder_pos comps.0.length 2))))
      
      
      delta)
   {
       `description: (+ "Given a delta object as returned from analyze_text_line, and an integer representing the "
                        "the amount of tree depth to change, calculates the line indentation required for the "
                        "given delta object, and creates an indent property in the delta object containing "
                        "the given amount of spaces to prepend to the line.  References the *formatting_rules* "
                        "object as needed to determine minor indentation from standard indentation, as well as "
                        "which symbols are identified as keywords.  Returns the provided delta object with the "
                        "indent key added.")
       `tags: ["indentation" "text" "formatting"]
       `usage: ["delta:object" "movement_needed:int"]
   })

(defun_sync format_lisp_line (line_number get_line) 
   (if (and (> line_number 0)
            (is_function? get_line))
      (let
         ((current_row (- line_number 1))
          (prior_line (progn
                         (defvar v (get_line current_row))
                         (while (and (== (trim v) "")
                                     (> current_row 0))
                            (progn
                               (dec current_row)
                               (= v (get_line current_row))))
                         (or v "")))
          (delta (analyze_text_line prior_line))
          (movement_needed 0)
          (orig_movement_needed 0)
          (comps nil)
          (final delta.final_type)
          (in_seek (< delta.openers.length delta.closers.length)))
         (= movement_needed delta.delta)
         (= orig_movement_needed movement_needed)
         (cond 
            (< movement_needed 0)
            (let
               ((lisp_line nil)
                (remainder_pos nil)
                (remainder nil)
                (symbol_details nil))
               (while (and (< movement_needed 0)
                           (> current_row 0))
                  (progn
                     (dec current_row)
                     (= prior_line (get_line current_row))
                     (while (and (> current_row 0)
                                 (== (trim prior_line) ""))
                        (progn
                           (dec current_row)
                           (= prior_line (get_line current_row))))
                     (= delta (analyze_text_line prior_line))
                     (= movement_needed (+ movement_needed delta.delta))))
               (= delta (calculate_indent_rule delta movement_needed)))
            (> movement_needed 0)
            (progn
               (= delta (calculate_indent_rule delta movement_needed))))
       (join "" (for_each (c (range (Math.max 0 delta.indent))) " "))))
   {
     `description: (+ "Given a line number and an accessor function (synchronous), returns a"
                      "a text string representing the computed indentation for the provided "
                      "line number. The get_line function to be provided will be called with "
                      "a single integer argument representing a requested line number from "
                      "the text buffer being analyzed.  The provided get_line function should "
                      "return a string representing the line of text from the buffer containing "
                      "the requested line. Once the string is returned, it is mandatory to update "
                      "the line buffer with the updated indented string, otherwise the function "
                      "will not work properly.")
     `tags: [ `formatting `indentation `text `indent ]
     `usage: ["line_number:integer" "get_line:function"]
   })

(defmacro set_default (path value)
  (let
     ((real_path (cond 
                    (and (is_string? path)
                         (starts_with? "=:" path)
                         (contains? "." path))
                    (split_by "." (desym_ref path))
                    (and (is_string? path)
                         (contains? "." path))
                    (split_by "." path)
                    (and (is_string? path)
                         (contains? "~" path))
                    (split_by "~" path)
                    else
                    path)))
     `(progn
         (unless (is_array? ,#real_path) 
            (throw ReferenceError "set_default: invalid path specification, needs to be an array, string or symbol."))
         (defvar __first_val (first ,#real_path))
         (if (contains? __first_val (list `features `build `imports `included_libraries))
             (throw ReferenceError (+ "set_default: the path value "   "doesn't reference a default value setting")))
         (if (resolve_path ,#real_path *env_config*)
             (set_path ,#real_path *env_config* ,#value)
             (make_path ,#real_path *env_config* ,#value ))
         (resolve_path ,#real_path *env_config*)))
  {
    `description: (+ "Given a path to a value in the *env_config* object, and a value to set, creates or sets the value "
                     "at the provided path position.  The path can be in the following forms:<br>"
                     "path.to.default_value:symbol - A period delimited non-quoted symbol<br>"
                     "[ `path `to `default_value ] - An array with quoted values or strings, in the standard path format.<br>"
                     "\"path.to.default_value\" - A string delimited by periods<br>"
                     "\"path~to~default_value\" - A string delimited by the path delimiter ~<br>"
                     "<br>"
                     "The value returned from the macro is the new default value as set in the *env_config*.<br>")
    `tags: ["default" "defaults" "set" "application" "editor" "repl" ]
    `usage: ["path:symbol|string|array" "value:*"]
  })

(defun get_default (key alt_val)
   (let
      ((path_to_value (cond
                         (is_string? key)
                         (split_by "." key)
                         (is_array? key)
                         key
                         else
                         (throw TypeError "get_default: key must be an array or string")))
       (entry_exists? (has_the_keys? [ (last path_to_value) ] 
                                     (resolve_path (but_last path_to_value) *env_config*))))
   (if entry_exists?
      (resolve_multi_path path_to_value *env_config*)
      (or alt_val nil)))
      
   {
     description: (+ "Given a path (array form) to a key in `*env_config*` , returns the "
                     "value at the path.  If the value cannot be found, will return `undefined`.  If "
                     "the second argument is provided, `alt_val`, that value will be returned if the "
                     "provided path isn\'t found. ")
     usage:["key:array" "alt_val:*"]
     tags: ["settings" "config" "defaults" "default" "environment" "env" "application"]
   })

(defun traverse (structure operator_function _path)
   (let
      ((path (or _path [])))
      (if (eq nil operator_function)
          (throw Error "traverse: requires a function as a second argument"))
      (cond
         (is_array? structure)
         (progn
            (operator_function structure path)
            (map (fn (elem idx)
                    (progn
                       (traverse elem operator_function (conj path idx))))
                 structure))
         (is_object? structure)
         (progn
            (operator_function structure path)
            (for_each (pset (pairs structure))
               (destructuring_bind (key value)
                  pset
                  (traverse value operator_function (conj path key)))))
         else
         (operator_function structure path))
      structure)
   {
     description: (+ "Given a structure such as an object or an array, and an operator "
                     "function argument, the function will recursively call the operator function "
                     "with the value and the path to each value in the structure.   The operator "
                     "function can choose to operate on the value at the path by calling `set_path` "
                     "for the root object, or otherwise examine the value and the path.  The return "
                     "value of the operator function is ignored.  The operator function signature is "
                     "called with `(value path_to_value)` as a signature.<br><br> ")
     usage: ["structure:object" "operator_function:function"]
     tags: ["recursion" "recurse" "structure" "object" "array" "search" "find"]
   })

(defun truncate (len value trailer)
    (let
      ((trailer  (or trailer "")))
     (cond
       (is_string? value)
       (if (> value.length len)
           (+ (-> value `substr 0 len) trailer)
           value)
       (is_array? value)
       (-> value `slice 0 len)
       else
       value))
    {
     `description: (+ "Given a length and a string or an array, return the value "
                      "with a length no more than then the provided value. If "
                      "the value is a string an optional trailer string can be "
                      "provided that will be appeneded to the truncated string.")
     `usage: ["len:number" "value:array|string" "trailer:string?"]
     `tags: ["array" "string" "length" "max" "min"]})

(defun_sync all_global_functions ()
   (let
      ((acc (new Set))
       (env_a nil))
      (for_each (ns (namespaces))
         (progn
            (= env_a (-> Environment `get_namespace_handle ns))
            (for_each (pset (pairs env_a.context.scope))
               (if (is_function? pset.1)
                   (-> acc `add pset.0)))))
      acc)
   {
       `description: "Returns a Set object of all accessible functions in the environment, including all namespaces."
       `usage: []
       `tags: ["global" "function" "scope" "environment"]
   })

(defun_sync pretty_print (in_struct report_callout)
   (let
      ((in_text (cond 
                   (is_object? in_struct)
                   (as_lisp in_struct)
                   (is_string? in_struct)
                   in_struct
                   else
                   (+ "" in_struct))) ;; bools, numbers etc, convert to string
       (chars (split_by "" in_text))
       (key_words (prop *formatting_rules* `keywords))
       (block_words [ "try" "progn" "progl" "progc" "do" "let" "cond"])
       (conditionals [ "if" "when" "unless" ])
       (char nil)
       (global_lookup (progn
                         (defvar tmp (all_global_functions)) ;; set of the globals
                         (for_each (op (or key_words []))
                            (-> tmp `add op))
                         tmp))
       (last_opener nil)
       (operator nil)
       (next_char nil)
       (next_char_pos 0)
       (state {})
       (lines [])
       (formatted_lines [])
       (line_acc [])
       (rule nil)
       (cpos -1)
       (debug_mode (if report_callout
                       true
                       false))
       (closers [ ")" "]" "}"])
       (openers [ "(" "[" "{" ])
       (code_mode 0)
       (string_mode 1)
       (escape_state 0)
       (mode code_mode)
       (nl_suppress false)
       (skip_for nil)
       (depth_change 0)
       (long_string_mode 2)
       (report [])
       (lpos 0)
       (lnum 0)
       (argnum 0)
       (text nil)
       (word "")
       (word_acc [])
       
       (add_char_to_line (function (c)
                            (progn
                               (push line_acc (or c char))
                               (= lpos line_acc.length))))
       (next_line (function ()
                     (progn
                        (push lines (join "" line_acc))  ;; push it into the lines
                        (= lnum lines.length)
                        (= depth_change 0)
                        (= line_acc []))))      ;; start a new line
       (is_whitespace? (function (c)
                          (contains? c [" " "\t" ])))
       (indent_string nil)
       (get_line (function (rnum)
                   (aif (prop lines rnum)
                        (if (ends_with? "\n" it)
                            it
                            (+ it "\n"))
                        nil)))
       (calc_next_char (function ()
                          (when (prop chars (+ 1 cpos))  ;; something is next
                             (= next_char_pos (+ cpos 1))
                             (while (and    ;; while less then current pos
                                         (prop chars next_char_pos) ;; and something is next
                                         (is_whitespace? (prop chars next_char_pos)))
                                (inc next_char_pos))
                             (= next_char (prop chars next_char_pos))))))
      ;; hairy here - 
      ;; basic idea is that we run through the each character updating  
      ;; various state mechanisms.
      ;; we *try* to get a keep a sense of what operator we are on, 
      ;; but it isn't always accurate. 
      
      ;; some notes:
      ;; newlines are suppressed via the nl_suppress flag.  This is used
      ;; to ensure that key:values don't get a return at the :, but wherever the
      ;; next appropriate newline value should be in the value part.
      ;; when nl_suppress is set, and skip_for is nil, it is set to two, 
      ;; and each cycle decremented until 0, when nl_suppress is turned off and 
      ;; skip_for is set to nil.
      
      ;; we keep track only of if we are in a code state, or a string state, so the modes
      ;; are code_mode, string_mode and long_string_mode
      
      ;; we keep a running track of the depth change of the line in depth_change: 0 for no depth change.  
      ;; if a closer is encoutered, we decrement depth_change for the line, 
      ;; otherwise we increment it.  
      ;; depth_change resets to 0 at each line
      
      ;; argnum is a counter that tries to keep track of the argument number we are on for a form.
      ;; note that this isn't a stack, so when a new opener '(,[' is encountered, we reset it to 0.
      ;; closers '(,[,{'' don't reset it. 
      
      
      (while (< cpos chars.length)
         (progn
            (inc cpos)
            (= char (prop chars cpos))
            (= rule nil)
            (when char
               (if (and skip_for
                        (> skip_for 0))
                   (dec skip_for))
               (if (== (-> char `charCodeAt) 92)
                   (= escape_state 2)
                   (= escape_state (Math.max 0 (- escape_state 1))))
               (when (and (== mode code_mode)
                          (>= cpos next_char_pos))
                  (when (and nl_suppress
                             (== skip_for nil))
                     (= skip_for 2))
                  (calc_next_char))
               
               (if (and (== mode code_mode)
                        (or (is_whitespace? char)
                            (contains? char openers)
                            (contains? char closers)
                            (== char ":")
                            (== char "\n")))
                   (progn
                      (when (> word_acc.length 0)
                         (= word (join "" word_acc))
                         (if (and (or (== last_opener "(")
                                      (== last_opener "["))
                                  (not (starts_with? "\"" word))
                                  (not (starts_with? "`" word)))
                             (= operator word)))
                      (= word_acc []))
                   (push word_acc char))
               (if (and (== mode code_mode)
                        (== char "}")
                        (not (== (last line_acc) "{"))
                        (not (contains? (last line_acc) closers))
                        (not (== (last line_acc) " ")))
                   (add_char_to_line " "))
               (if (and (== mode code_mode)
                        (contains? char openers))
                   (= last_opener char))
               (if (and (== mode code_mode)
                        (or (contains? char closers)
                            (is_whitespace? char)))
                   (= last_opener nil))
               
               (when (== skip_for 0)
                  (= nl_suppress false)
                  (= skip_for nil))
               (cond
                  (and (== mode code_mode)   ;; quote -> string_mode
                       (== char "\""))
                  (progn
                     (= mode string_mode))
                  
                  (and (== mode code_mode)   ;; pipe -> long_string_mode
                       (== "|" char))
                  (progn
                     (= mode long_string_mode))
                  
                  (and (== char "\"")
                       (== mode string_mode)
                       (== escape_state 0))
                  (progn
                     (= mode code_mode))
                  
                  (and (== char "|")
                       (== mode long_string_mode))
                  (progn
                     (= mode code_mode))
                  
                  (and (contains? char openers)
                       (== mode code_mode))
                  (progn
                     (= argnum 0))
                  
                  (and (== char ":")
                       (== mode code_mode))
                  (progn
                     (inc argnum)
                     (= nl_suppress true)))
               (if (== mode code_mode)
                   (progn
                      (cond 
                         (contains? char openers)
                         (inc depth_change)
                         (contains? char closers)
                         (dec depth_change))
                      (cond
                         (and (is_whitespace? char)
                              (contains? next_char closers)
                              (> argnum 1)
                              (not nl_suppress))
                         (progn
                            (= rule "r0!")
                            (next_line))
                         (and (is_whitespace? char)
                              (and word (contains? word block_words)))
                         (progn
                            (= rule "rb!")
                            (next_line))
                         (and (is_whitespace? char)
                              (>= argnum 1)
                              (not (contains? (last line_acc) closers))
                              (> depth_change -1)
                              (< depth_change 2)
                              (contains? operator conditionals))
                         (progn
                            (= rule "rC")
                            (next_line))
                         (and (is_whitespace? char)
                              (< argnum 2)
                              (< depth_change 2)
                              (< lpos 30)
                              (not (contains? (last line_acc) closers))
                              (and (not (starts_with? "\"" (or word "")))
                                   (not (starts_with? "`" (or word "")))
                                   (> depth_change -1))
                              (<= (- next_char_pos cpos) 1))
                         (progn
                            (add_char_to_line)
                            (inc argnum)
                            (= rule "r1+"))
                         (and (is_whitespace? char)
                              (== argnum 0)
                              (and (not (starts_with? "\"" (or word "")))
                                   (not (starts_with? "`" (or word "")))
                                   (and word (-> global_lookup `has word))
                                   (not (== "()" (join "" (last_n 2 line_acc))))
                                   (> depth_change -1)))
                         (progn
                            (add_char_to_line)
                            (inc argnum)
                            (= rule "rc"))
                         (and (is_whitespace? char)
                              (not nl_suppress)
                              (not (== next_char "{"))
                              (<= (- next_char_pos cpos) 1))
                         (progn
                            (= rule "r2!")
                            (next_line)
                            (= nl_suppress true))
                         (and (contains? char openers)
                              (not nl_suppress)
                              (> argnum 1))
                         (progn
                            (= rule "r3!")
                            (= nl_suppress true)
                            (next_line)
                            (add_char_to_line)
                            (= argnum 0))
                         (and (contains? char openers)
                              (> argnum 1))
                         (progn
                            (= rule "r3A")
                            (add_char_to_line)
                            (= argnum 0))
                         (and (is_whitespace? char)
                              (not nl_suppress)
                              (< depth_change 0))
                         (progn
                            (= rule "r4!")
                            (next_line)
                            (= argnum 0))
                         (and (is_whitespace? char)
                              (not nl_suppress)
                              (> lpos 40))
                         (progn
                            (= rule "r5!")
                            (next_line)
                            (= argnum 0))
                         (and (== char "{" )
                              (not (is_whitespace? (prop chars (+ 1 cpos))))
                              (not (== (prop chars (+ 1 cpos)) "}")))
                         (progn
                            (= rule "r6")
                            (add_char_to_line)
                            (add_char_to_line " "))
                         
                         (and (== char ":")
                              (not (== " " (prop chars (+ 1 cpos)))))
                         (progn
                            (= rule "r7")
                            (add_char_to_line)
                            (add_char_to_line " "))
                         else                          
                         (progn
                            (= rule "r99")
                            (add_char_to_line))))
                   (progn
                      (= rule "rD")
                      (add_char_to_line)))
               (when debug_mode 
                  (push report
                     [cpos
                      char
                      (if (<= cpos next_char_pos)
                          next_char
                          "")
                      lpos
                      (- next_char_pos cpos)
                      depth_change
                      mode
                      argnum
                      (if (and (== mode code_mode) (is_whitespace? char)) "*" "")
                      (if nl_suppress " NLS " "")
                      (if skip_for skip_for "")
                      rule
                      word
                      operator
                      (join "" line_acc)
                      ]
                     )))))
                          
      
      (when debug_mode
         (report_callout report {
                      `columns: ["CPOS" "CHAR" "NEXTC" "LPOS" "NCD" "DEPTHC" "MODE" "ARGNUM" "WS?" "NLS?" "SKIP_FOR" "rule" "word" "op" "Line_ACC"]
                      }))
      ;; this will not compile if the below is uncommented prior to the html namespace being loaded
      ;(when debug_mode
       ;  (log (dtable report
        ;           {
         ;            `columns: ["CPOS" "CHAR" "NEXTC" "LPOS" "NCD" "DEPTHC" "MODE" "ARGNUM" "WS?" "NLS?" "SKIP_FOR" "rule" "word" "op" "Line_ACC"]
          ;           })))
      (when (> line_acc.length 0)
         (push lines (join "" line_acc)))
      
      (for_each (line_num (range lines.length))
         (progn
            (= text (+ "" (prop lines line_num) "\n"))
            (if (> line_num 0)
                (= indent_string (format_lisp_line line_num get_line))
                (= indent_string ""))
            (set_prop lines
               line_num
               (+ "" indent_string text))))
      (join "" lines))
   {
     description: (+ "The pretty_print function attempts to format the presented input, provided "
                     "either as a string or JSON. The return is a string with the formatted input.")
     tags: ["format" "pretty" "lisp" "display" "output"]
     usage: ["input:array|string"]
     })


(defun get_dependencies (global_symbol _deps _req_ns _externs)
   (let
      ((comps (split_by "/" global_symbol))
       (target_symbol (if (> comps.length 1)
                          (second comps)
                          (first comps)))
       (namespace (if (> comps.length 1)
                      (first comps)
                      nil))
       (added false)
       (externals (or _externs (new Set)))
       (required_namespaces (or _req_ns (new Set)))
       (dependencies (or _deps (new Set)))
       (ns_env (-> Environment `get_namespace_handle (current_namespace)))  ;; make sure to operate in the current evaluation context
       (sym_meta (-> ns_env `eval `(meta_for_symbol ,#target_symbol true))))
      (cond
         (and namespace
              sym_meta
              (> sym_meta.length 0))
         (for_each (m sym_meta)
            (when (== m.namespace namespace)
               (= sym_meta m)
               (break)))
         else
         (progn
            (= sym_meta (first sym_meta))  ;; take the first in the sort order
            (= namespace sym_meta.namespace)))
      (if (and namespace
               (not (-> required_namespaces `has namespace)))
          (-> required_namespaces `add namespace))
      
      (when sym_meta.externals
         (for_each (external_ref sym_meta.externals)
            (-> externals `add external_ref)))
      
      (when (and sym_meta namespace)
         (for_each (required_symbol sym_meta.requires)
            (when (not (-> dependencies `has required_symbol))
               (= added true)
               (-> dependencies `add required_symbol)))
         (if added
            (for_each (required_symbol sym_meta.requires)
               (get_dependencies required_symbol dependencies required_namespaces externals))))
      (when (eq nil _deps)
         {
           dependencies: (to_array dependencies)
           namespaces: (to_array required_namespaces)
           externals: (to_array externals)
           }))
   {
     `description: (+ "<br><br>Given a symbol in string form, returns the global dependencies that the "
                      "symbol is dependent on in the runtime environment.  The return structure is in "
                      "the form:```{\n  dependencies: []\n  namespaces: []   \n  externals: "
                      "[]\n}```<br><br>The return structure will contain all the qualified and "
                      "non-qualified symbols referenced by the provided target symbol, plus the "
                      "dependencies of the required symbols.  <br>The needed namespace environments "
                      "are also returned in the `namespaces` value.\n<br>References to external global "
                      "Javascript values are listed in the `externals` result.  These values are "
                      "defined as dependencies for the provided symbol, but are not defined in a Juno "
                      "Environment.<br> ")
     `usage: ["quoted_symbol:string"]
     `tags: ["dependencies" "tree" "required" "dependency"]
   })
 
(defun_sync uuid ()
  (javascript "return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
     (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16));")
  {
      description: "Returns a UUID"
      usage: []
      tags: ["uuid" "id" "generate"]
  })


(defun_sync pad_left (value pad_amount padchar)
   (-> (+ "" value) `padStart pad_amount padchar)
   {
     `description: (+ "<br><br>Given a value (number or text). an amount to pad, and an optional "
                      "character to use a padding value, returns a string that will contain pad amount "
                      "leading characters of the padchar value.<br><br>#### Example <br>```(pad_left "
                      "23 5 `0)\n<- \"00023\"\n\n(pad_left 4 5)\n<- \"    4\"```<br> ")

     `usage: ["value:number|string" "pad_amount:number" "padchar:?string"]
     `tags: ["pad" "string" "text" "left"]
   })  
            
(defun symbol_dependencies (symbol_array)
   (when (is_array? symbol_array)
      (let
         ((dependencies (new Set))
          (ns_deps (new Set))
          (externals (new Set))
          (deps nil))
      (for_each (sym symbol_array)
         (progn
            (get_dependencies sym dependencies ns_deps externals)))
      {
        `dependencies: (to_array dependencies)
        `namespaces: (to_array ns_deps)
        `externals: (to_array externals)
        }))
   {
       `description: (+ "Given an array of symbols in string form, returns the global dependencies that the "
                      "symbols are dependent on in the runtime environment.  The return structure is in "
                      "the form:```{\n  dependencies: []\n  namespaces: []\n}```<br><br>The return "
                      "structure will contain all the qualified and non-qualified symbols referenced "
                      "by the provided target symbol, plus the dependencies of the required "
                      "symbols.  <br>The needed namespace environments are also returned in the "
                      "namespaces value.<br> ")
       `usage: ["quoted_symbol:array"]
       `tags: ["dependencies" "tree" "required" "dependency"]
   })

(defun_sync keyword_mapper (token)
  (if (contains? token *formatting_rules*.keywords)
    "keyword"
    "identifier"))

(defmacro with_each_entry ((binding_sym) iteration_form `& body_forms)
   `(let
       ((__data_val__ ,#iteration_form)
        (,#binding_sym nil)
        (__next_val__ nil))
       (if (is_function? __data_val__.next)
           (while (= __next_val__ (-> __data_val__ `next))
              (progn
                 (= ,#binding_sym __next_val__.value)
                 ,@body_forms
                 (if __next_val__.done                         
                    (break))))
           (throw TypeError "with_each_entry: iteration_form is not an iterator")))
   {
     `description: (+ "Given a binding symbol, a form or symbol that resolves to an iteration "
                      "object with a `next` function, and the body forms to be used with the "
                      "binding_symbol, will call the binding forms for every value in the iterator, "
                      "with the binding symbol being set to the next value each time through the "
                      "loop.<br><br>#### Example <br>```(with_each_value (entries)\n   (-> "
                      "request_headers `entries) ;; will return an iterator\n   (if (== entries.0 "
                      "\"content-type\")\n       (= content_type entries.1)))```<br><br><br> ")
     usage: ["binding_sym:array" "iteration_form:*" "body_forms:*"]
     tags: [`iteration `loop `iterator `entries `flow `values ]
   })

(if_compile_time_defined `Deno
   (progn
      (defun_sync operating_system ()
         (resolve_path [ `build `os ] Deno)
         {
           `description: "Returns a text string of the operating system name: darwin, linux, windows"
           `usage: []
           `tags: ["os" "environment" "build" "platform" "env" ]
           })
      
      (defun_sync platform_architecture ()
         (resolve_path [ `build `arch ] Deno)
         {
           `description: "Returns a text string of the underlying hardware architecture, for example aarch64 or X86_64."
           `usage: []
           `tags: ["os" "platform" "architecture" "hardware" "type" "build" ]
           })
      
      (defun_sync platform ()
         (+ {} 
            Deno.version
            (prop Deno `build)
            { `env: (-> Deno.env `toObject) })
         {
           `description: (+ "Returns an object describing the operating environment that the system "
                            "is running on, if possible.  A object is returned with key value pairs that "
                            "describes the runtime environment.  Currently the supported runtime is Deno, "
                            "but if a different runtime is used the output of this command may vary due to "
                            "the underlying information being returned.<br>architecture:string - The "
                            "underlying instruction set architecture of the machine.<br>deno:string - The "
                            "version of the Deno runtime<br>env:object - The current environment variables "
                            "the runtime is using.<br>os:string - The operating system name or "
                            "identifier<br>target:string - The binary type of the "
                            "runtime.<br>typescript:string - The version of Typescript supported in the "
                            "runtime.<br>v8:string - The version of the V8 Javascript "
                            "runtime.<br>vendor:string - The operating system vendor. ")
           `usage: []
           `tags: ["os" "platform" "architecture" "hardware" "type" "build" "environment"]
           })
      
      (defun_sync os_env ()
         (-> Deno.env `toObject)
         {
             description: "Returns an object representing the current environment variables of the runtime process."
             usage: []
             tags: ["environment" "variable" "variables" "system" "os" "platform"]
         })
      
      (defun_sync get_env (key)
         (-> Deno.env `get key)
         {
             description: "Given a key returns the environment variable value for the key if it exists."
             usage: []
             tags: ["os" "environment" "variables" "system"]
         })
      
      (defun_sync set_env (key value)
         (-> Deno.env `set key value)
         {
             description: "Given a key and a value sets the environment variable value for the key."
             usage: []
             tags: ["os" "environment" "variables" "system"]
         })
      
      (defun_sync exit (return_code)
         (Deno.exit return_code)
         {
             description: "Exits the system and returns the provided integer return code"
             usage: ["return_code:?number"]
             tags: ["exit" "quit" "return" "leave"]
         })
      (defun permissions ()
         (let
            ((perms [ `run `env `write `read `net `ffi `sys ]))
            (to_object
               (for_each (p perms)
                  [ p
                     (prop (Deno.permissions.query { name: p })
                           `state) ]))))))


true
 

# Documentation Reference for core

### Generated on 2023-03-08 12:16:47
### __VERBOSITY__

#### core
##### object
Set __VERBOSITY__ to a positive integer for verbose console output of system activity.
##### Tags
debug compiler environment global
---
### -

#### core
#### Usage
`arg0:* argN:*`
##### Special
Subtracts from the first argument all subsequent arguments and returns the result.
##### Tags
special subtract - arithmetic
---
### ->

#### core
#### Usage
`target:object function_to_call:text argsN:*`
##### Special
Given a target object, a function to call, calls the function in the target object with the target object as the this value. The remaining arguments are provided as arguments to the method being called. A synonym for -> is the call operation.The result of the call is returned.
##### Tags
object function call -> this
---
### *

#### core
#### Usage
`arg0:number argN:number`
##### Special
Multiplies the first argument with all subsequent arguments, returning the result.
##### Tags
special multiplication arithmetic
---
### **

#### core
#### Usage
`base:number exponent:number`
##### Special
The exponentiation operator raises the first argument to the power of the second argument.
##### Tags
special exponent base power arithmetic
---
### /

#### core
#### Usage
`dividend:number argN:number`
##### Special
Arithmetically divides the first argument (dividend) by all subsequent arguments (divisors) and returns the result.
##### Tags
special division divide arithmetic
---
### %

#### core
#### Usage
`dividend:number divisor:number`
##### Special
Modulo (Remainder) divides the first argument by the second argument and returns the remainder from the division operation.
##### Tags
special remainder modulo division arithmetic
---
### +

#### core
#### Usage
`arg0:* argN:*`
##### Special
The plus operator takes an arbitrary number of arguments and attempts to 'add' them together. Of all the mathematical operators, this is the only one that is overloaded in terms of the type of values it can take.  The adding operation undertaken by the + operator is determined by the first argument in the argument list. The operator accepts the following types: <br>numbers, Objects, arrays and Strings.<br> If the argument type is a number (or declared to be a number), then the normal infix mathematical expression will be constructed in the emitted javascript, otherwise the synchronous add function will be used to handle the addition in a dynamic fashion during execution. <br><br>Adding Objects<br>When two objects are added together, a new Object is constructed with the keys and values from each object in successive order from the argument list.  If a later object contains the same key as an earlier object, the later object's value will be used and will overwrite the earlier value of the same key. <br>Example: (+ { abc: 123 def: 456 } { abc: 789 }) -> { abc: 789 def: 456 }<br>If a non-object type is encountered after starting with an object it is ignored.<br><br>Adding Arrays<br>If an array is the first argument to the operator, all subsequent argument values are appended to the first array and the first array is returned as the result.  The types of the subsequent arguments are not interrogated unlike with Object addition, and are simply concatenated to the first argument.  <br>Example: (+ [ 1 2 3 ] [ 4 5 6] 7 8) <-  [ 1 2 3 [ 4 5 6 ] 7 8 ]<br><br>Adding Strings<br>A new string is returned as a result of adding all subsequent arguments together.  If a subsequent argument is a string, or is an object with a toString method defined, it is appended to the result as expected.  Otherwise, the default string representation in the prototype chain will be used, which may not be what is expected.<br>Example: 
```
(+ "This is the result: " (fn (v) (+ 1 2))) <- "This is the result: async function(v) {
 return (1+ 2)
}"
```
<
Example: ( + "1" "2" ) <- "12" <br>Example: (+ "John" "Jingleheimer") <- "JohnJingleheimer"<br>Example: (+ "An object:" { abc: 123 }) <- "An object: [object Object]"<br>
##### Tags
special add + addition arithmetic
---
### +=

#### core
#### Usage
`symbol:* arg0:* argn?:*`
##### Macro
Appends in place the arguments to the symbol, adding the values of the arguments to the end.
##### Tags
append mutate text add number
---
### <

#### core
#### Usage
`value_left:number value_right:number`
##### Special
Returns true if the left value is smaller than the right value, otherwise returns false.
##### Tags
equivalence equal comparison lt
---
### <<

#### core
#### Usage
`value:number amount_to_shift_left:number`
##### Special
The << operator performs a leftward shift of the bits of the first argument by the amount of the second argument.
##### Tags
special shift bit left
---
### <=

#### core
#### Usage
`value_left:number value_right:number`
##### Special
Returns true if the left value is less than or equal to the right value, otherwise returns false.
##### Tags
equivalence equal comparison gt
---
### =

#### core
#### Usage
`target:symbol value:*`
##### Special
Sets the target symbol to the provided value and returns the value.   A Reference error is thrown if the symbol is undeclared.
##### Tags
assignment set value
---
### ==

#### core
#### Usage
`value0:* value1:*`
##### Special
Represents the Javascript === operator and returns true if the operands are equal and of the same type, otherwise false.
##### Tags
equality equivalence equal eq
---
### =>

#### core
#### Usage
`arguments:array body_expression:*`
##### Special
[object Object]
##### Tags
function lambda fn call apply scope arrow lambda
---
### >

#### core
#### Usage
`value_left:number value_right:number`
##### Special
Returns true if the left value is greater than the right value, otherwise returns false.
##### Tags
equivalence equal comparison gt
---
### >=

#### core
#### Usage
`value_left:number value_right:number`
##### Special
Returns true if the left value is greater than or equal to the right value, otherwise returns false.
##### Tags
equivalence equal comparison gt
---
### >>

#### core
#### Usage
`value:number amount_to_shift_right:number`
##### Special
The << operator performs a rightward shift of the bits of the first argument by the amount of the second argument.
##### Tags
special shift bit right
---
### add

#### core
#### Usage
`arg0:* argN:*`
##### Function
Add is an overloaded function that, based on the first argument provided, determines how to 'add' the arguments. If provided a number as a first argument, then it will assume the rest of the arguments are numbers and add them to the first, returning the numerical sum of the arguments. If an object, it will merge the keys of the provided arguments, returning a combined object.  Be aware that if merging objects, if arguments that have the same keys the argument who appears last with the key will prevail.  If called with an array as a first argument, the subsequent arguments will be added to the first via 'concat'.  If strings, the strings will be joined into a single string and returned.<br>(add 1 2 3) => 6<br>(add { `abc: 123 `def: 345 } { `def: 456 }) => { abc: 123, def: 456 }(add [ 1 2 3 ] [ 4 5 6] 7) => [ 1, 2, 3, [ 4, 5, 6 ], 7 ]<br>(add "abc" "def") => "abcdef"<br><br>Note that add doesn't typically need to explicily called.  The compiler will try and determine the best way to handle adding based on the arguments to be added, so the + operator should be used instead, since it gives the compiler an opportunity to inline if possible.
##### Tags
add + sum number addition merge join concat
---
### add_days

#### core
#### Usage
`date_obj:Date num_days:number`
##### AsyncFunction
Given a date object and the number of days (either positive or negative) modifies the given date object to the appropriate date value, and returns the date object.
##### Tags
date time duration days add
---
### add_hours

#### core
#### Usage
`date_obj:Date hours:number`
##### AsyncFunction
Given a date object and the number of hours (either positive or negative) modifies the given date object to the appropriate date value, and returns the date object.
##### Tags
date time duration hours add
---
### ago

#### core
#### Usage
`dval:Date`
##### AsyncFunction
Given a date object, return a formatted string in English with the amount of time elapsed from the provided date.
##### Tags
date format time string elapsed
---
### aif

#### core
#### Usage
`test_expression:* eval_when_true:* eval_when_false:*?`
##### Macro
Anaphoric If - This macro defines a scope in which the symbol `it is used to store the evaluation of the test form or expression.  It is then available in the eval_when_true form and, if provided, the eval_when_false expression.
##### Tags
conditional logic anaphoric if it
---
### all_global_functions

#### core
#### Usage
``
##### Function
Returns a Set object of all accessible functions in the environment, including all namespaces.
##### Tags
global function scope environment
---
### all_globals

#### core
#### Usage
``
##### AsyncFunction
Returns a set of all global symbols, regardless of namespace.
##### Tags
editor globals autocomplete
---
### analyze_text_line

#### core
#### Usage
`line:string`
##### Function
Given a line of text, analyzes the text for form/block openers, identified as (,{,[ and their corresponding closers, which correspod to ),},].  It then returns an object containing the following: <br><br>{ delta:int   - a positive or negative integer that is represents the positive or negative depth change, <br>  final_type: string - the final delimiter character found which can either be an opener or a closer, <br>  final_pos: int - the position of the final delimiter, <br>  line: string - the line of text analyzed, <br>  indent: int - the indentation space count found in the line, <br>  openers: array - an array of integers representing all column positions of found openers in the line.<br>  closers: array - an array of integers representing all column positions of found closers in the line. }<br><br>The function does not count opening and closing tokens if they appear in a string.
##### Tags
text tokens form block formatting indentation
---
### and

#### core
#### Usage
`arg0:* argN:*`
##### Special
Each argument to the and operator is evaluated, and upon the first value that is a Javascript false (or an equivalent false, such as nil, undefined or 0), the encountered false is returned.  If all values are equivalent to true , then the final argument is returned. Equivalent to && in Javascript.
##### Tags
logic condition true false &&
---
### and*

#### core
#### Usage
`val0:* val1:* val2:*`
##### AsyncFunction
Similar to and, but unlike and, values that are "" (blank) or NaN are considered to be true.Uses is_value? to determine if the value should be considered to be true.Returns true if the given arguments all are considered a value, otherwise false.  If no arguments are provided, returns undefined.
##### Tags
truth and logic truthy
---
### apply

#### core
#### Usage
`function_to_call:function arg0:* argN:array`
##### Special
Apply calls the specified function (first argument) with the subsequent arguments.  The last argument must be an array, which contains the remaining arguments. <br>Example: (apply add 1 2 [ 3 4 5]) <- 15<br>
##### Tags
function arguments array call
---
### apply_list_to_list

#### core
#### Usage
`operator:function modifier_list:array target_list:array`
##### AsyncFunction
Given an operator (function), a list of values to be applied (modifier list), and a list of source values (the target), returns a new list (array) that contains the result of calling the operator function with each value from the target list with the values from the modifier list. The operator function is called with <code>(operator source_value modifer_value)</code>.
##### Tags
map list array apply range index
---
### apply_operator_list

#### core
#### Usage
`operator_list:array target_list:array`
##### AsyncFunction
<p>Note: Deprecated.Given a list containing quoted functions (modifier list), and a list of source values (the target), returns a new list (array) that contains the result of calling the relative index of the modifier functions with the value from the relative index from the target list. The modifiers are applied in the following form: <code>(modifier_function target_value)</code>.</p><p>If the modifer_list is shorter than the target list, the modifer_list index cycles back to 0 (modulus).</p>
##### Tags
map list array apply range index
---
### array_to_object

#### core
#### Usage
`list_to_process:array`
##### AsyncFunction
Takes the provided list and returns an object with the even indexed items as keys and odd indexed items as values.
##### Tags
list array object convert
---
### assert

#### core
#### Usage
`form:* failure_message:string?`
##### Function
If the evaluated assertion form is true, the result is returned, otherwise an EvalError is thrown with the optionally provided failure message.
##### Tags
true error check debug valid assertion
---
### bind

#### core
#### Usage
`func:function this_arg:*`
##### Function
Given a function and a this value, the bind function returns a new function that has its this keyword set to the provided value in this_arg.
##### Tags
bind this function
---
### bind_and_call

#### core
#### Usage
`target_object:object this_object:object method:string args0:* argsn:*`
##### AsyncFunction
Binds the provided method of the target object with the this_object context, and then calls the object method with the optional provided arguments.
##### Tags
bind object this context call
---
### bind_function

#### core
##### Function
Reference bind and so has the exact same behavior.  Used for Kina legacy code. See bind description.
---
### blank?

#### core
#### Usage
`val:*`
##### Function
Given a value, if it is equal (via eq) to nil or to "" (an empty string), returns true, otherwise false.
##### Tags
string empty text
---
### break

#### core
#### Usage
``
##### Special
The break operator is a flow control mechanism used to stop the iteration of a for_each or while loop. It should be used as a direct subform of the for_each or while.
##### Tags
block flow control
---
### but_last

#### core
#### Usage
`arr:array`
##### Function
Given an array, returns all elements except the final element.  This function is the inverse of `last`.  If there are less than 2 elements in the array (0 or 1 elements), then an empty array is returned.  If a non-array is provided, the function will throw a `TypeError`. 
##### Tags
array last elements front head rest
---
### calculate_indent_rule

#### core
#### Usage
`delta:object movement_needed:int`
##### Function
Given a delta object as returned from analyze_text_line, and an integer representing the the amount of tree depth to change, calculates the line indentation required for the given delta object, and creates an indent property in the delta object containing the given amount of spaces to prepend to the line.  References the *formatting_rules* object as needed to determine minor indentation from standard indentation, as well as which symbols are identified as keywords.  Returns the provided delta object with the indent key added.
##### Tags
indentation text formatting
---
### call

#### core
#### Usage
`target:object function_to_call:text argsN:*`
##### Special
Given a target object, a function to call, calls the function in the target object with the target object as the this value. The remaining arguments are provided as arguments to the method being called. A synonym for call is the -> operation.The result of the call is returned.
##### Tags
function call -> this object
---
### camel_case_to_lower

#### core
#### Usage
``
##### AsyncFunction
Given a camel case string such as camelCase, returns the equivalent lowercase/underscore: camel_case.
##### Tags
text string conversion lowercase uppercase
---
### catch

#### core
#### Usage
`error_type:* allocation:array expression:*`
##### Special
[object Object]
##### Tags
flow control error exceptions try throw
---
### check_type

#### core
#### Usage
`thing:* type_name:string error_string:string`
##### Macro
If the type of thing (ascertained by sub_type) are not of the type type_name, will throw a TypeError with the optional error_string as the error message.
##### Tags
types validation type assert
---
### chomp

#### core
#### Usage
`x:string`
##### Function
Given a string returns a new string containing all characters except the last character.
##### Tags
slice subset string
---
### chop

#### core
#### Usage
`container:array|string`
##### Function
Returns a new container containing all items except the last item.  This function takes either an array or a string.
##### Tags
array slice subset first string
---
### chop_front

#### core
#### Usage
`container:array|string amount:integer`
##### Function
Given a string or array, returns a new container with the first value removed from the provided container.  An optional amount can be provided to remove more than one value from the container.
##### Tags
text string list reduce
---
### clamp

#### core
#### Usage
`value:number min:number max:number`
##### Function
Given a numeric value, along with minimum and maximum values for the provided value, the function will return the value if between the bounding values, otherwise the closest bounding value will be returned.  If the value is above the provided maximum, then the maximum will be returned.  If the value is below the minimum, then the minimum value is returned.
##### Tags
value number min max bounds boundary range
---
### clear_time

#### core
#### Usage
`date_obj:Date`
##### AsyncFunction
Given a date object, modifies the date object by clearing the time value and leaving the date value.  Returns the date object.
##### Tags
date time duration midnight add
---
### color_for_number

#### core
#### Usage
`number:number saturation:float brightness:float`
##### AsyncFunction
Given an arbitrary integer, a saturation between 0 and 1 and a brightness between 0 and 1, return an RGB color string
##### Tags
ui color view
---
### compare_list_ends

#### core
#### Usage
`array1:array array2:array`
##### AsyncFunction
Compares the ends of the provided flat arrays, where the shortest list must match completely the tail end of the longer list. Returns true if the comparison matches, false if they don't.
##### Tags
comparision values list array
---
### compile

#### user
#### Usage
`json_expression:* opts:object`
##### AsyncFunction
Compiles the given JSON or quoted lisp and returns a string containing the lisp form or expression as javascript.<br>If passed the option { meta: true } , an array is returned containing compilation metadata in element 0 and the compiled code in element 1.
##### Tags
macro quote quotes desym compiler
---
### compile_buffer

#### core
#### Usage
`input_file:string initializer_function:string? options:object?`
##### AsyncFunction
Given an input lisp file, and an optional initalizer function name and options object, compile the lisp file into a javascript file. The options object will allow the specification of an output path and filename, given by the key output_file.  If the initializer function isn't specified it is named initializer, which when used with load, will be automatically called one the file is loaded.  Otherwise the initializer function should be called when after dynamically importing, using dynamic_import. If the options object is to be used, with a default initializer, nil should be used as a placeholder for the initializer_function name.<br><br>Options are as follows:<br><br>js_headers: array: If provided, this is an array of strings that representlines to be inserted at the top of the file.include_source: boolean: If provided will append the block forms and expressions within the text as comments.output_file: string: If provided the path and filename of the compiled javascript file to be produced.include_boilerplate: boolean: If set to false explicity, the boilerplatecode will be not be included in the build.<br><br>NOTE: this function's API is unstable and subject to change due to the early phase of this language.
##### Tags
compile environment building javascript lisp file export
---
### compile_lisp

#### core
#### Usage
`text:string`
##### AsyncFunction
Given an input string of lisp text, returns a JSON structure ready for evaluation.
---
### compile_to_js

#### core
#### Usage
`quoted_form:*`
##### Macro
Given a quoted form, returns an array with two elements, element 0 is the compilation metadata, and element 1 is the output Javascript as a string.
##### Tags
compilation source javascript environment
---
### cond

#### core
#### Usage
`test_expr0:* if_true_expr0:* test_expr1:* if_true_expr1:* test_exprN:* if_true_exprN:*`
##### Special
The cond operator evaluates test expressions sequentially, until either a true value is returned or the end of the test expressions are reached.  If a test expression returns true, the if_true expression following the test expression is evaluated and the result returned.  If no expressions match, then nil is returned.  There is a special keyword available in the cond form, else, which is syntactic sugar for true, that can be used to always have a default value.  The else or true test expression should always be the final test expression otherwise a SyntaxError will result. <br>Example:
```
(let
  ((name (request_user_input "Enter your first name name:")))
  (cond
    (blank? name)  ; first test
    "Hello there no-name!"
    (< (length name) 12)  ; second test
    (+ "Hello there " name "!")
    else  ; the default
    (+ "Hello there " name "! Your first name is long.")))
```
<br>
##### Tags
flow control condition logic if branching
---
### conj

#### core
#### Usage
`arg0:* argN:*`
##### Function
Conjoins or concatenates things (typically arrays) together and returns an array. Examples:<br>(conj [ 1 2 ] [ 3 4 ]) => [ 1 2 3 4 ]<br>(conj [ 1 2 ] 3 4 ) => [ 1 2 3 4 ]<br>(conj 1 2 [ 3 4 ]) => [ 1 2 3 4 ]<br>(conj { `abc: 123 } [ 2 3]) => [ { abc: 123 }, 2, 3 ]<br>(conj [ 1 2 3 [ 4 ]] [ 5 6 [ 7 ]]) => [ 1 2 3 [ 4 ] 5 6 [ 7 ] ]
##### Tags
elements concat array conjoin append
---
### contains?

#### core
#### Usage
`value:* container:array|set|string`
##### Function
Given a target value and container value (array, set, or string), checks if the container has the value. If it is found, true is returned, otherwise false if returned.  
##### Tags
string array set has includes indexOf
---
### date_components

#### core
#### Usage
`date_value:Date date_formatter:DateTimeFormat?`
##### AsyncFunction
Given a date value, returns an object containing a the current time information broken down by time component. Optionally pass a Intl.DateTimeFormat object as a second argument.
##### Tags
date time object component
---
### date_to_string

#### core
#### Usage
`date_val:Date formatted_string:string`
##### AsyncFunction
Given a date value and a formatted template string, return a string representation of the date based on the formatted template string.<br>E.g. (date_to_string (new Date) "yyyy-MM-dd HH:mm:ss")<br><table><tr><td>yyyy</td><td>Four position formatted year, e.g. 2021</td></tr><tr><td>yy</td><td>Two position formatted year, e.g. 21</td></tr><tr><td>dd</td><td>Two position formatted day of month, e.g. 03</td></tr><tr><td>d</td><td>1 position numeric day of month, e.g. 3</td></tr><tr><td>MM</td><td>Two position formatted month number, e.g. 06</td></tr><tr><td>M</td><td>One or two position formatted month number, e.g. 6 or 10</td></tr><tr><td>HH</td><td>Two position formatted 24 hour number, e.g. 08</td></tr><tr><td>H</td><td>One position formatted 24 hour, e.g 8</td></tr><tr><td>hh</td><td>Two position formatted 12 hour clock, e.g. 08</td></tr><tr><td>h</td><td>One position formatted 12 hour clock, e.g 8</td></tr><tr><td>mm</td><td>Minutes with 2 position width, eg. 05</td></tr><tr><td>m</td><td>Minutes with 1 or 2 positions, e.g 5 or 15.</td></tr><tr><td>ss</td><td>Seconds with 2 positions, e.g 03 or 25.</td></tr><tr><td>s</td><td>Seconds with 1 or 2 positions, e.g 3 or 25.</td></tr><tr><td>sss</td><td>Milliseconds with 3 digits, such as 092 or 562.</td></tr><tr><td>TZ</td><td>Include timezone abbreviated, e.g. GMT+1.</td></tr><tr><td>D</td><td>Weekday abbreviated to 1 position, such as T for Tuesday or Thursday, or W for Wednesday (in certain locales)</td></tr><tr><td>DD</td><td>Weekday shortened to 3 positions, such as Fri for Friday.</td></tr><tr><td>DDD</td><td>Full name of weekday, such as Saturday.</td></tr></table>
##### Tags
time date string text format formatted
---
### day_before_yesterday

#### core
#### Usage
``
##### AsyncFunction
This function returns an array with two Date values.  The first, in index 0, is the start of the day before yesterday (midnight), and the second is 24 later.
##### Tags
time date range prior hours 24
---
### day_of_week

#### core
#### Usage
`date:Date`
##### AsyncFunction
Given a date object, returns the day of the week for that date object
##### Tags
time week date day
---
### dec

#### core
#### Usage
`target:symbol amount:?number`
##### Special
Decrement the target symbol by the default value of 1 or the provided amount as a second argument. The operator returns the new value of the target symbol.
##### Tags
decrement count inc
---
### decode_text

#### core
#### Usage
`buffer:ArrayBuffer`
##### Function
Given a source buffer, such as a Uint8Array, decode into utf-8 text.
##### Tags
decode encode string array text
---
### defbinding

#### core
#### Usage
`binding_set0:array binding_setN:array`
##### Macro
Defines a global binding to a potentially native function.  This macro facilitates the housekeeping by keeping track of the source form used (and stored in the environment) so that the save environment facility can capture the source bindings and recreate it in the initializer function on rehydration.<br>The macro can take an arbitrary amount of binding arguments, with the form: (symbol_name (fn_to_bind_to this))
##### Tags
toplevel global bind environment initialize
---
### defclog

#### core
#### Usage
`options:object`
##### AsyncFunction
Given a description object, containing specific keys, returns a customized console logging function implements the given requested properties.<br>Options<br>prefix:string:The prefix to log prior to any supplied user arguments.<br>color:string:The text color to use on the prefix (or initial argument if no prefix)<br>background:string:The background coloe to use on the prefix (or initial argument if no prefix)<br>
##### Tags
log logging console utility
---
### defconst

#### core
#### Usage
`name:symbol value:*`
##### Special
Define a constant in either the local scope or global scope.  The defconst operator can be used in both subforms and at the toplevel to specify that a symbol value be treated as a constant.  When top-level, the metadata will indicate that the defined symbol is a constant.  Any attempted changes to the value of the symbol will result in a TypeError being thrown.<br>Example:
```
(defconst ghi "Unchanging")
<- "Unchanging"

(= ghi "Hi there")
<- TypeError Assignment to constant variable ghi
```
<br>
##### Tags
allocation symbol define constant const
---
### defexternal

#### core
#### Usage
`name:string value:*`
##### Macro
Given a name and a value, defexternal will add a globalThis property with the symbol name thereby creating a global variable in the javascript environment.
##### Tags
global javascript globalThis value
---
### defglobal

#### core
#### Usage
`name:symbol value:* metadata:object`
##### Special
Defines a global variable in the current namespace, or if preceded by a namespace qualifier, will place the variable in the designated namespace.  The metadata value is an optional object that provides information about the defined symbol for purposes of help, rehydration, and other context.  The metadata object tags are arbitrary, but depending on the type of value being referenced by the symbol, there are some reserved keys that are used by the system itself.<br>Example:
```
(defglobal *global_var* "The value of the global."
           { description: "This is a global in the current namespace"
             tags: [ `keywords `for `grouping ] }

```
<br>The key/value pairs attached to a symbol are arbitrary and can be provided for purposes of description or use by users or programatic elements.
##### Tags
function lambda fn call apply scope arrow lambda
---
### define

#### core
#### Usage
`declaration:array declaration:array*`
##### Macro
Given 1 or more declarations in the form of (symbol value ?metadata), creates a symbol in global scope referencing the provided value.  If a metadata object is provided, this is stored as a the symbol's metadata.
##### Tags
symbol reference definition metadata environment
---
### define_env

#### core
#### Usage
`definitions:array`
##### Macro
define_env is a macro used to provide a dual definition on the top level: it creates a symbol via defvar in the constructed scope as well as placing a reference to the defined symbol in the scope object.
##### Tags
environment core build
---
### defmacro

#### core
#### Usage
`name:symbol lambda_list:array forms:array meta?:object`
##### AsyncFunction
Defines the provided name as a compile time macro function in the current namespace environment. The parameters in the lambda list are destructured and bound to the provided names which are then available in the macro function.  The forms are used as the basis for the function with the final form expected to return a quoted form which is then as the expansion of the macro by the compiler. The body of forms are explicitly placed in a progn block.  Like with functions and defglobal, if the final argument to defmacro is an object, this will be used for the metadata associated with with the bound symbol provided as name.<br>Example:<br> (defmacro unless (condition `& forms)
    `(if (not ,#condition)
       (do 
         ,@forms))
    {
     `description: "opposite of if, if the condition is false then the forms are evaluated"
     `usage: ["condition:array" "forms:array"]
     `tags: ["if" "not" "ifnot" "logic" "conditional"]
     }) <br>In the above example the macro unless is defined.  Passed arguments must be explicitly unquoted or an error may be thrown because the arguments condition and forms *may* not be defined in the final compilation environment.  Note that if the symbols used by the macro are defined in the final compilation scope, that this may cause unexpected behavior due to the form being placed into the compilation tree and then acting on those symbols. <br>Be aware that if a macro being defined returns an object (not an array) you should explicitly add the final metadata form to explictly ensure appropriate interpretation of the argument positions.<br><br>Since a macro is a function that is defined to operate at compile time vs. run time, the rules of declare apply.  Declaration operate normally and should be the first form in the block, or if using let, the first form after the allocation block of the let.
##### Tags
macro define compile function
---
### defns

#### core
#### Usage
`name:string options:object`
##### AsyncFunction
Given a name and an optional options object, creates a new namespace identified by the name argument.  If the options object is provided, the following keys are available:<br>ignore_if_exists:boolean:If set to true, if the namespace is already defined, do not return an error and instead just return with the name of the requested namespace. Any other options are ignored and the existing namespace isn't altered.contained:boolean:If set to true, the newly defined namespace will not have visibility to other namespaces beyond 'core' and itself.  Any fully qualified symbols that reference other non-core namespaces will fail.serialize_with_image:boolean:If set to false, if the environment is saved, the namespace will not be included in the saved image file.  Default is true.
##### Tags
namespace environment define scope context
---
### defparameter

#### core
#### Usage
`sym:symbol|string value:* meta:?object`
##### Macro
Defines a global that is always reset to the provided value, when called or when the image is reloaded, ensuring that the initial value is always set to a specific value.  If the value is already defined, it will be overwritten.  To set a symbol in an explicit namespace, provide a fully qualified symbol name in the form of namspace/symname as the symbol to be defined. Returns the defined value.
##### Tags
allocation reference symbol value set reference global
---
### defun

#### core
#### Usage
`name:string:required lambda_list:array:required body:array:required meta:object`
##### Macro
Defines a top level function in the current environment.  Given a name, lambda_list,body, and a meta data description, builds, compiles and installs the function in theenvironment under the provided name.  The body isn't an explicit progn, and must bewithin a block structure, such as progn, let or do.
##### Tags
function lambda define environment
---
### defun_sync

#### core
#### Usage
`name:string args:array body:* meta:object`
##### Macro
Creates a top level synchronous function as opposed to the default via defun, which creates an asynchronous top level function.Doesn't support destructuring bind in the lambda list (args). Given a name, an argument list, a body and symbol metadata, will establish a top level synchronous function.  If the name is fully qualified, the function will be compiled in the current namespace (and it's lexical environment) and placed in the specified namespace.
##### Tags
define function synchronous toplevel
---
### defun_sync_ds

#### core
#### Usage
`name:string:required lambda_list:array:required body:array:required meta:object`
##### Macro
Defines a top level function in the current environment.  Given a name, lambda_list,body, and a meta data description, builds, compiles and installs the function in theenvironment under the provided name.  The body isn't an explicit progn, and must bewithin a block structure, such as progn, let or do.
##### Tags
function lambda define environment
---
### defvalue

#### core
#### Usage
`sym:symbol|string value:* meta:?object`
##### Macro
If the provided symbol is already defined as an accessible global value from the current namespace it will return the defined value, otherwise it will define the global in the current (implicit) namespace or the explicitly referenced namespace.  Returns the newly defined value or previously defined value.
##### Tags
allocation reference symbol value set reference global
---
### defvar

#### core
#### Usage
`name:symbol value:*`
##### Special
Define a symbol in the local block scope. The operation doesn't have a return value and a SyntaxError will be thrown by the compiler if the result of a defvar operation is used as part of an assignment form.
##### Tags
allocation define var reference symbol
---
### delete_path

#### core
#### Usage
`path:array obj:object`
##### Function
Given a path and an target object, removes the specified value at the path and returns the original object, which will have been modified. If the value isn't found, there are no modifications to the object and the object is returned.  Will throw a TypeError if the obj argument isn't an object type, of if the path isn't an array with at least one element.
##### Tags
path delete remove object resolve modify value
---
### delete_prop

#### core
#### Usage
`obj:objects key0:string keyN?:string`
##### Function
Removes the key or keys of the provided object, and returns the modified object.<br>Example:<br>(defglobal foo { abc: 123 def: 456 ghi: 789 })<br>(delete_prop foo `abc `def) => { ghi: 789 }<br>
##### Tags
delete keys object remove remove_prop mutate
---
### demarked_number

#### core
#### Usage
`value:number separator:string precision:number no_show_sign:boolean`
##### AsyncFunction
Given a numeric value, a separator string, such as "," and a precision value for the fractional-part or mantissa of the value, the demarked_number function will return a string with a formatted value. Default value for precision is 2 if not provided.If no_show_sign is true, there will be no negative sign returned, which can be useful for alternative formatting.  See compile_format.
##### Tags
format conversion currency
---
### deref

#### core
#### Usage
`symbol:string`
##### Macro
If the value that the symbol references is a binding value, aka starting with '=:', then return the symbol value instead of the value that is referenced by the symbol. This is useful in macros where a value in a form is to be used for it's symbolic name vs. it's referenced value, which may be undefined if the symbol being de-referenced is not bound to any value. <br>Example:<br>Dereference the symbolic value being held in array element 0:<br>(defglobal myvar "foo")<br>(defglobal myarr [ (quote myvar) ])<br>(deref my_array.0) => "my_var"<br>(deref my_array) => [ "=:my_var" ]<br><br>In the last example, the input to deref isn't a string and so it returns the value as is.  See also desym_ref.
##### Tags
symbol reference syntax dereference desym desym_ref
---
### describe

#### user
#### Usage
`quoted_symbol:string search_mode:boolean`
##### AsyncFunction
Given a quoted symbol returns the relevant metadata pertinent to the current namespace context.
##### Tags
meta help definition symbol metadata info meta_for_symbol
---
### describe_all

#### core
#### Usage
``
##### AsyncFunction
Returns an object with all defined symbols as the keys and their corresponding descriptions.
##### Tags
env environment symbol symbols global globals
---
### destructure_list

#### core
#### Usage
`elems:array`
##### Function
Destructure list takes a nested array and returns the paths of each element in the provided array.
##### Tags
destructuring path array nested tree
---
### destructuring_bind

#### core
#### Usage
`bind_vars:array expression:array forms:*`
##### Macro
The macro destructuring_bind binds the variable symbols specified in bind_vars to the corresponding values in the tree structure resulting from the evaluation of the provided expression.  The bound variables are then available within the provided forms, which are then evaluated.  Note that destructuring_bind only supports destructuring arrays. Destructuring objects is not supported.
##### Tags
destructure array list bind variables allocation symbols
---
### desym

#### core
#### Usage
`val:string|array`
##### Macro
Given a value or arrays of values, return the provided symbol in it's literal, quoted form, e.g. (desym myval) => "myval"
##### Tags
symbol reference literal desymbolize dereference deref desym_ref
---
### desym_ref

#### core
#### Usage
`val:*`
##### Macro
Given a value will return the a string containing the desymbolized value or values. Example: <br>(defglobal myvar "foo")<br>(defglobal myarr [ (quote myvar) ])<br>(desym_ref myarr) <- (myvar)<br>(desym_ref myarr.0) <- myvar<br>(subtype (desym_ref myarr.0)) <- "String"
##### Tags
symbol reference syntax dereference desym desym_ref
---
### detokenize

#### core
#### Usage
`token_structure:object|array`
##### AsyncFunction
Converts the provided compiler tokens to a JSON structure representing the original source tree. 
##### Tags
compilation compiler tokenize token tokens precompiler
---
### do

#### core
#### Usage
`form0:* form1:* formN:*`
##### Special
[object Object]
##### Tags
block progn do scope
---
### do_deferred_splice

#### core
#### Usage
`tree:*`
##### AsyncFunction
Internally used by the compiler to facilitate splice operations on arrays.
##### Tags
compiler build
---
### dtext

#### core
#### Usage
`text:string key:string?`
##### Function
Given a default text string and an optional key, if a key exists in the global object *LANGUAGE*, return the text associated with the key. If no key is provided, attempts to find the default text as a key in the *LANGUAGE* object. If that is a nil entry, returns the default text.
##### Tags
text multi-lingual language translation translate
---
### each

#### core
#### Usage
`items:list property:string|list|function|AsyncFunction`
##### AsyncFunction
Provided a list of items, provide a property name or a list of property names to be extracted and returned from the source array as a new list.If property is an array, and contains values that are arrays, those arrays will be treated as a path.
##### Tags
pluck element only list object property
---
### either

#### core
#### Usage
`values:*`
##### AsyncFunction
Similar to or, but unlike or, returns the first non nil or undefined value in the argument list whereas or returns the first truthy value.
##### Tags
nil truthy logic or undefined
---
### encode_text

#### core
#### Usage
`buffer:ArrayBuffer`
##### Function
Given a source buffer, such as a Uint8Array, decode into utf-8 text.
##### Tags
decode encode string array text
---
### ends_with?

#### core
#### Usage
`end_value:value collection:array|string`
##### Function
for a given string or array, checks to see if it ends with the given start_value.  Non string args return false.
##### Tags
string text list array filter reduce
---
### ensure_keys

#### core
#### Usage
`keylist obj:object default_value:*?`
##### AsyncFunction
Given a list of key values, an object (or nil) and an optional default value to be assigned each key, ensures that the object returned has the specified keys (if not already set) set to either the specified default value, or nil.
##### Tags
object keys values required key
---
### enum

#### core
#### Usage
`value_list:array`
##### AsyncFunction
Given a list of string values, returns an object with each value in the list corresponding to a numerical value.
##### Tags
enumeration values
---
### env_log

#### user
#### Usage
`arg0:* argN:*`
##### AsyncFunction
The environment logging function used by the environment.
---
### eq

#### core
#### Usage
`value0:* value1:*`
##### Special
Represents the Javascript == operator and returns true if the operands are "equal".  This is a looser definition of equality then ===, and different types can be considered equal if the underlying value is the same.<br>Example: (== 5 "5") is considered the same.
##### Tags
equality equivalence equal eq
---
### eval_exp

#### core
#### Usage
`expression:*`
##### AsyncFunction
Evaluates the given expression and returns the value.
##### Tags
eval evaluation expression
---
### evaluate_compiled_source

#### core
#### Usage
`compiled_source:array`
##### Macro
The macro evaluate_compiled_source takes the direct output of the compiler, which can be captured using the macro compile_to_js, and performs the evaluation of the compiled source, thereby handling the second half of the compile then evaluate cycle.  This call will return the results of the evaluation of the compiled code assembly.
##### Tags
compilation compile eval pre-compilation
---
### except_nil

#### core
#### Usage
`items:list|set`
##### AsyncFunction
Takes the passed list or set and returns a new list that doesn't contain any undefined or nil values.  Unlike no_empties, false values and blank strings will pass through.
##### Tags
filter nil undefined remove no_empties
---
### exit

#### core
#### Usage
`return_code:?number`
##### Function
Exits the system and returns the provided integer return code
##### Tags
exit quit return leave
---
### expand_dot_accessor

#### core
#### Usage
`val:string ctx:object`
##### AsyncFunction
Used for compilation. Expands dotted notation of a.b.0.1 to a["b"][0][1]
##### Tags
compiler system
---
### export_symbols

#### core
#### Usage
`arg0:string|array argN:string|array`
##### Macro
The export_symbols macro facilitates the Javascript module export functionality.  To make available defined lisp symbols from the current module the export_symbols macro is called with it's arguments being either the direct symbols or, if an argument is an array, the first is the defined symbol within the lisp environment or current module and the second element in the array is the name to be exported as.  For example: <br> (export lisp_symbol1 lisp_symbol2) ;; exports lisp_symbol1 and lisp_symbol2 directly. <br>(export (lisp_symbol1 external_name)) ;; exports lisp_symbol1 as 'external_name`. <br>(export (initialize default) symbol2) ;; exports initialize as default and symbol2 as itself.
##### Tags
env enviroment module export import namespace scope
---
### extend

#### core
#### Usage
`target_object:object source_object:object`
##### AsyncFunction
Given a target object and a source object, add the keys and values of the source object to the target object.
##### Tags
object extension keys add values
---
### fetch_text

#### core
#### Usage
`url:string`
##### AsyncFunction
Given a url, returns the text content of that url. This function is a helper function for the import macro.
##### Tags
fetch text string
---
### filter

#### core
#### Usage
`f:function container:array`
##### AsyncFunction
Given a function with a single argument, if that function returns true, the value will included in the returned array, otherwise it will not.  Opposite of reject.
##### Tags
collections reduce reject where list array reduce
---
### first

#### core
#### Usage
`x:array`
##### Function
Given an array, returns the first element in the array.
##### Tags
array container elements
---
### first_is_upper_case?

#### core
#### Usage
`str_val:string`
##### AsyncFunction
Returns true if the first character of the provided string is an uppercase value in the range [A-Z]. 
##### Tags
string case uppercase capitalized
---
### first_with

#### core
#### Usage
`property_list:array data:object|array`
##### AsyncFunction
Given a list of properties or indexes and a data value, sequentially looks through the property list and returns the first non-null result.
##### Tags
list array index properties search find
---
### fixed

#### core
#### Usage
`value:number precision?:number`
##### AsyncFunction
Given a floating point value and an optional precision value, return a string corresponding to the desired precision.  If precision is left out, defaults to 3.
##### Tags
format conversion
---
### flatten

#### core
#### Usage
`x:array`
##### Function
Given a nested array structure, returns a flattened version of the array
##### Tags
array container flat tree
---
### flatten_ctx

#### core
#### Usage
`ctx_object:object`
##### AsyncFunction
Internal usage by the compiler, flattens the hierarchical context structure to a single level. Shadowing rules apply.
##### Tags
system compiler
---
### float

#### core
#### Usage
`value:string|number`
##### Function
Convenience method for parseFloat, should be used in map vs. directly calling parseFloat, which will not work directly
##### Tags
conversion number
---
### fn

#### core
#### Usage
`arguments:array body_expression:*`
##### Special
There are multiple types of functions that can be created depending on the requirements of the use case:<br>The lambda and fn operators create asynchronous functions. The fn is shorthand for lambda and can be used interchangably.<br>The function keyword creates a synchronous function. <br>The => operator creates Javascript arrow functions.<br>All definitions return a form which contains the compiled body expression. The provided argument array maps  the symbol names to bound symbols available within the body expression. The body expression is evaluated with the bound symbols containing the values of arguments provided at time the function is called and the result of the body expression is returned from the function call.<br>Typically, the body expression is a progn with multiple forms, however, this is not always necessary if the function being defined can be contained in a single form.  With the exception of arrow functions, functions always establish a new block scope, and any arguments that have the same symbolic names as globals or variables in the closure that defines the function will be shadowed.<br><br>Once defined, the function is stored in compiled form, meaning that if inspected, the javascript that comprises function will be returned as opposed to the source code of the function.<br>There is a special operator for the arguments that can be used to capture all remaining arguments of a function, the quoted &.  If the `& is included in the argument list of a function, all remaining run time values at the index of the `& operator will be returned as part of the symbol following the `& operator.  This symbol should be the last symbol in a argument list.<br>Example of an asynchronous function:
```
(fn (a b)     ;; a and b are the arguments that are bound
   (/ (+ a b) 2)) ;; the body expression that acts on the bound arguments a and b
```
<br><br>Example with the ampersand argument operator used in a synchronous function:
```
(function (initial `& vals)
   (/ (+ initial (apply add vals))
      (+ 1 (length vals))))
```
<br>In the above example, add was used in the apply because the + operator isn't a true function.<br>Arrow functions do not define their own scope and should be used as anonymous functions within let and scoped blocks.<br>Example:
```
(let
  ((i 0)
   (my_incrementor (=> (v)
                     (inc i v)))
   (my_decrementor (=> (v)
                     (dec i v))))
  (my_incrementor 4)
  (my_decrementor 2)
  i)
```
<- 2<br><br>
##### Tags
function lambda fn call apply scope arrow lambda
---
### fn_signature

#### core
#### Usage
`f:function|string`
##### Function
For a given function as an argument, returns an object with a type key containing the function type (async, sync) and an args key with an array for the arguments.  Note that a string value which is the result of a function serialized with the function's toString() method can also be passed.
##### Tags
function signature arity inspect
---
### for

#### core
#### Usage
`allocations_and_values:array body_forms:*`
##### Macro
The for macro provides a facility for looping through arrays, destructuring their contents into local symbols that can be used in a block.  The `for` macro is a higher level construct than the `for_each` operator, as it allows for multiple symbols to be mapped into the contents iteratively, vs. for_each allowing only a single symbol to be bound to each top level element in the provided array.<br>The symbol_list is provided as the lambda list to a `destructuring_bind` if multiple symbols are provided, otherwise, if only a single variable is provided, the `for` macro will convert to  a for_each call, with the `body_forms` enclosed in a `progn` block.  <br><br>#### Examples <br><br>An example of a multiple bindings is below.  The values of `positions` are mapped (destructured) into x, y, w and h, respectively, each iteration through the loop mapping to the next structured element of the array:
```
(let
 ((positions
      [[[1 2] [5 3]]
       [[6 3] [10 2]]]))
  (for ([[x y] [w h]] positions)
       (log "x,y,w,h=" x y w h)
       (+ "" x "," y "+"  w "," h )))
```
<br><br>Upon evaluation the log output is as follows:
```
"x,y,w,h=" 1 2 5 3
```
<br>
```
"x,y,w,h=" 6 3 10 2
```
<br><br>The results returned from the call:
```
["1,2+5,3"
 "6,3+10,2"]
```
<br><br>Notice that the `for` body is wrapped in an explicit `progn` such that the last value is accumulated and returned from the `for` operation.<br>An example of single bindings, which essentially transforms into a `for_each` call with an implicit `progn` around the body forms.  This form is essentially a convenience call around `for_each`.  
```
(for (x [1 2 3])
     (log "x is: " x) 
     (+ x 2))
```
<br><br>Both the log form and the final body form `(+ x 2)` are the body forms and will be evaluated in sequence, the final form results accumulating to be returned to the caller.<br>Log output from the above:
```
"x is: " 1
"x is: " 2
"x is: " 3
```
<br><br>Return value:
```
[3 4 5]
```
<br>
##### Tags
iteration loop for array destructuring
---
### for_each

#### core
#### Usage
`allocation_form body_expression:array`
##### Special
The for_each operator provides a simple loop variable that allocates a symbol which is assigned the next value in the returned array from the init form in the allocation. It then evaluates the body expression with the symbol in scope.  It will continue to loop, with the allocated symbol being defined successive values until the end of the array is reached, or a (break) operator is encountered in the body expression. Unlike while, the for_each operator is a collector, and all values returned from the body_expression will be returned as an array from for_each.<br>Example:
```
(for_each (r (range 5))
     (* r 2))
<- [0 2 4 6 8]
```
<br>
##### Tags
flow control loop break while
---
### for_with

#### core
#### Usage
`allocation_form body_expression:array`
##### Special
The for_with operator provides a simple loop variable that allocates a symbol which is assigned the next value from the iterator function in the init form in the allocation. It then evaluates the body expression with the symbol in scope.  It will continue to loop, with the allocated symbol being defined successive values until the end of the array is reached, or a (break) operator is encountered in the body expression. Unlike for_each, the for_with operator is not a collector, and there is no return value and attempting to assign the return value will not work.<br>Example:
```
(for_with (next_val (generator instream))
     (log (-> text_decoder `decode next_val)))

```
<br>
##### Tags
iteration generator loop flow control
---
### form_id

#### core
#### Usage
`name:string`
##### AsyncFunction
Given a standard string returns a compliant HTML ID suitable for forms.
---
### form_structure

#### core
#### Usage
`quoted_form:* max_depth:?number`
##### AsyncFunction
Given a form and an optional max_depth positive number, traverses the passed JSON form and produces a nested array structure that containsthe contents of the form classified as either a "symbol", "number", "string", "boolean", "array", "object", or the elem itself. The returned structure will mirror the passed structure in form, except with the leaf contents being replaced with generalized categorizations.
##### Tags
validation compilation structure
---
### format_lisp_line

#### core
#### Usage
`line_number:integer get_line:function`
##### Function
Given a line number and an accessor function (synchronous), returns aa text string representing the computed indentation for the provided line number. The get_line function to be provided will be called with a single integer argument representing a requested line number from the text buffer being analyzed.  The provided get_line function should return a string representing the line of text from the buffer containing the requested line. Once the string is returned, it is mandatory to update the line buffer with the updated indented string, otherwise the function will not work properly.
##### Tags
formatting indentation text indent
---
### formatted_date

#### core
#### Usage
`dval:Date date_formatter:DateTimeFormat?`
##### AsyncFunction
Given a date object, return a formatted string in the form of: "yyyy-MM-d HH:mm:ss".  Optionally pass a Intl.DateTimeFormat object as a second argument.
##### Tags
date format time string
---
### from_key

#### core
#### Usage
`value:string separator?:string`
##### Function
Takes a key formatted value such as "last_name" and returns a "prettier" string that contains spaces in place of the default separator, '_' and each word's first letter is capitalized. An optional separator argument can be provided to use an alternative separator token.<br>E.G. last_name becomes "Last Name".
##### Tags
string split key hash record form ui
---
### from_key1

#### core
#### Usage
`value:string`
##### Function
Useful for calling with map, since this function prevents the other values being passed as arguments by map from being passed to the from_key function.
##### Tags
map function key pretty ui to_key
---
### from_mixed_case

#### core
#### Usage
`mixed_case_key:string`
##### Function
<br><br>Given a mixed case string, will return the standardized key format representation of the string.  For example,  the string `myVariable` will be returned as `my_variable` with this function.  A TypeError will be thrown if a non-string argument is provided. 
##### Tags
key convert snake mixed case format
---
### from_style_text

#### core
#### Usage
`text:string`
##### AsyncFunction
Given a string or text in the format of an Element style attribute: "css_attrib:value; css_attrib2:value", split into pairs containing attribute name and value.
##### Tags
text css style pairs string array list ui html
---
### from_universal_time

#### core
#### Usage
`seconds:number`
##### Function
Given a universal_time_value (i.e. seconds from Jan 1 1900) returns a Date object.
##### Tags
date time universal 1900
---
### function

#### core
#### Usage
`arguments:array body_expression:*`
##### Special
[object Object]
##### Tags
function lambda fn call apply scope arrow lambda
---
### gather_up_prop

#### core
#### Usage
`key:string values:array|object`
##### AsyncFunction
Given a key and an object or array of objects, return all the values associated with the provided key.
##### Tags
key property objects iteration
---
### gen_id

#### core
#### Usage
`prefix:string`
##### AsyncFunction
Given a prefix returns a element safe unique id
##### Tags
web html identification
---
### get_default

#### core
#### Usage
`key:array alt_val:*`
##### AsyncFunction
Given a path (array form) to a key in `*env_config*` , returns the value at the path.  If the value cannot be found, will return `undefined`.  If the second argument is provided, `alt_val`, that value will be returned if the provided path isn't found. 
##### Tags
settings config defaults default environment env application
---
### get_dependencies

#### core
#### Usage
`quoted_symbol:string`
##### AsyncFunction
<br><br>Given a symbol in string form, returns the global dependencies that the symbol is dependent on in the runtime environment.  The return structure is in the form:
```
{
  dependencies: []
  namespaces: []   
  externals: []
}
```
<br><br>The return structure will contain all the qualified and non-qualified symbols referenced by the provided target symbol, plus the dependencies of the required symbols.  <br>The needed namespace environments are also returned in the `namespaces` value.
<br>References to external global Javascript values are listed in the `externals` result.  These values are defined as dependencies for the provided symbol, but are not defined in a Juno Environment.<br> 
##### Tags
dependencies tree required dependency
---
### get_function_args

#### core
#### Usage
`function:function`
##### AsyncFunction
Given a javascript function, return a list of arg names for that function
##### Tags
function introspect introspection arguments
---
### get_object_path

#### core
#### Usage
`refname:string`
##### Function
get_object_path is used by the compiler to take a string based notation in the form of p[a][b] or p.a.b and returns an array of the components.
##### Tags
compiler
---
### get_symbol_details_for_ns

#### core
#### Usage
`namespace:string symbol_name:string`
##### Function
Given a namespace and a symbol name returns the details for the specific symbol in the namespace if found, or nil if not.
##### Tags
namespace symbol find meta details
---
### getf_ctx

#### core
#### Usage
`ctx:object name:string`
##### AsyncFunction
Used for compilation. Given a context structure, provides a utility function for retrieving a context value based on a provided identifier.
##### Tags
compiler system context ctx new_ctx setf_ctx
---
### has_items?

#### core
#### Usage
`value:list`
##### AsyncFunction
Returns true if the list provided has a length greater than one, or false if the list is 0 or nil
##### Tags
list values contains
---
### has_the_keys?

#### core
#### Usage
`key_list:list object_to_check:object`
##### AsyncFunction
Given a provided key_list, validate that each listed key or dotted-path-notation value exist in the object.
---
### hostname

#### core
#### Usage
``
##### AsyncFunction
Returns the hostname of the system the environment is running on.
##### Tags
hostname server environment
---
### hsv_to_rgb

#### core
#### Usage
`hsv_values:array`
##### Function
Takes an array with three values corresponding to hue, saturation and brightness. Each value should be between 0 and 1.  The function returns an array with three values corresponding to red, green and blue.
##### Tags
colors graphics rgb conversion
---
### HSV_to_RGB

#### core
#### Usage
`hue:number saturation:number value:number`
##### AsyncFunction
Given a hue, saturation and brightness, all of which should be values between 0 and 1, returns an object containing 3 keys: r, g, b, with values between 0 and 255, representing the corresponding red, green and blue values for the provided hue, saturation and brightness.
##### Tags
color conversion hue saturation brightness red green blue rgb
---
### if

#### core
#### Usage
`test_form:* if_true:* if_false:*`
##### Special
The conditional if operator evaluates the provided test form and if the result of the evaluation is true, evaluates and returns the results of the if_true form, otherwise the if form will evaluate and return the result of the if_false form.<br>Example:
```
(progn
   (defvar name (request_user_input "Enter your name:"))
   (if (blank? name)
        "No Name Entered"
        (+ "Hello " name)))

```

##### Tags
flow control condition logic cond branching
---
### if_compile_time_defined

#### core
#### Usage
`quoted_symbol:string exists_form:* not_exists_form:*`
##### Macro
If the provided quoted symbol is a defined symbol at compilation time, the exists_form will be compiled, otherwise the not_exists_form will be compiled.
##### Tags
compile defined global symbol reference
---
### if_undefined

#### core
#### Usage
`value:* replacer:*`
##### Macro
If the first value is undefined, return the second value
---
### ifa

#### core
#### Usage
`test:* thenclause:* elseclause:*`
##### Macro
Similar to if, the ifa macro is anaphoric in binding, where the it value is defined as the return value of the test form. Use like if, but the it reference is bound within the bodies of the thenclause or elseclause.
##### Tags
cond it if anaphoric
---
### import

#### core
#### Usage
`binding_symbols:array filename:string`
##### Macro
Dynamically load the contents of the specified source file (including path) into the Lisp environment in the current namespace.<br>If the file is a Lisp source, it will be evaluated as part of the load and the final result returned.If the file is a JS source, it will be loaded into the environment and a handle returned.When importing non-Lisp sources (javascript or typescript), import requires a binding symbol in an array as the first argument.<brThe allowed extensions are .lisp, .js, .json, .juno, and if the JS platform is Deno, .ts is allowed.  Otherwise an EvalError will be thrown due to a non-handled file type.Examples:<br>Lisp/JSON: (import "tests/compiler_tests.lisp")<br>JS/TS Remote: (import (logger) "https://deno.land/std@0.148.0/log/mod.ts")<br>JS/TS Local: (import (logger) "/absolute/path/to/library.js")<br><br>Note that this is a dynamic import. 
##### Tags
compile read io file get fetch load dynamic_import
---
### in_background

#### core
#### Usage
`forms:*`
##### Macro
Given a form or forms, evaluates the forms in the background, with the function returning true immediately prior to starting the forms.
##### Tags
eval background promise evaluation
---
### inc

#### core
#### Usage
`target:symbol amount:?number`
##### Special
Increment the target symbol by the default value of 1 or the provided amount as a second argument. The operator returns the new value of the target symbol.
##### Tags
increment count dec
---
### index_of

#### core
#### Usage
`value:number|string|boolean container:array`
##### Function
Given a value and an array container, returns the index of the value in the array, or -1 if not found.
##### Tags
find position index array contains
---
### indirect_new

#### core
#### Usage
`arg0:* argsN:*`
##### Function
Used by the compiler for implementation of the new operator and shouldn't be directly called by user programs.  The new operator should be called instead.
##### Tags
system compiler internal
---
### int

#### core
#### Usage
`value:string|number`
##### Function
Convenience method for parseInt, should be used in map vs. directly calling parseInt, which will not work directly
##### Tags
conversion number
---
### interlace

#### core
#### Usage
`list0:array list1:array listn?:array`
##### AsyncFunction
Returns a list containing a consecutive values from each list, in argument order.  I.e. list0.0 list1.0 listn.0 list0.1 list1.1 listn.1 ...
##### Tags
list array join merge
---
### interpolate

#### core
#### Usage
`from:number to:number steps:number`
##### Function
Returns an array of length steps which has ascending or descending values inclusive of from and to.
##### Tags
range interpolation fill
---
### invert_pairs

#### core
#### Usage
`value:array`
##### AsyncFunction
Given an array value containing pairs of value, as in [[1 2] [3 4]], invert the positions to be: [[2 1] [4 3]]
##### Tags
array list invert flip reverse swap
---
### is_array?

#### core
#### Usage
`arg:value`
##### Function
for the given value x, returns true if x is an array.
##### Tags
type condition subtype value what
---
### is_date?

#### core
#### Usage
`arg:value`
##### Function
for the given value x, returns true if x is a Date object.
##### Tags
type condition subtype value what
---
### is_element?

#### core
#### Usage
`arg:value`
##### Function
for the given value x, returns true if x is an Element object
##### Tags
type condition subtype value what
---
### is_error?

#### core
#### Usage
`val:*`
##### Function
Returns true if the passed value is a instance of an Error type, otherwise returns false.
##### Tags
Error types predicate type instanceof
---
### is_even?

#### core
#### Usage
`value:number`
##### AsyncFunction
If the argument passed is an even number, return true, else returns false.
##### Tags
list filter modulus odd number
---
### is_function?

#### core
#### Usage
`arg:value`
##### Function
for the given value x, returns true if x is a function.
##### Tags
type condition subtype value what function
---
### is_lower?

#### core
#### Usage
`value:string`
##### AsyncFunction
Given a string as an argument, returns true if the first character of the string is a lowercase character value (ASCII), and false otherwise.
##### Tags
text string lowercase uppercase
---
### is_nil?

#### core
#### Usage
`arg:value`
##### Function
for the given value x, returns true if x is exactly equal to nil.
##### Tags
type condition subtype value what
---
### is_number?

#### core
#### Usage
`arg:value`
##### Function
for the given value x, returns true if x is a number.
##### Tags
type condition subtype value what function
---
### is_object?

#### core
#### Usage
`arg:value`
##### Function
for the given value x, returns true if x is an Javascript object type.
##### Tags
type condition subtype value what
---
### is_odd?

#### core
#### Usage
`value:number`
##### AsyncFunction
If the argument passed is an odd number, return true, else returns false.
##### Tags
list filter modulus even number
---
### is_reference?

#### core
#### Usage
`val:string`
##### Macro
Returns true if the quoted value is a binding string; in JSON notation this would be a string starting with "=:". Note that this function doesn't check if the provided value is a defined symbol, but only if it has been described in the JSON structure as a bounding string.
##### Tags
reference JSON binding symbol predicate
---
### is_regex?

#### core
#### Usage
`arg:value`
##### Function
for the given value x, returns true if x is a Javascript regex object
##### Tags
type condition subtype value what
---
### is_set?

#### core
#### Usage
`arg:value`
##### Function
for the given value x, returns true if x is a set.
##### Tags
type condition subtype value what
---
### is_string?

#### core
#### Usage
`arg:value`
##### Function
for the given value x, returns true if x is a String object
##### Tags
type condition subtype value what
---
### is_symbol?

#### core
#### Usage
`symbol:string|*`
##### Macro
If provided a quoted symbol, will return true if the symbol can be found in the local or global contexts.
##### Tags
context env def
---
### is_upper?

#### core
#### Usage
`value:string`
##### AsyncFunction
Given a string as an argument, returns true if the first character of the string is an uppercase character value (ASCII), and false otherwise.
##### Tags
text string lowercase uppercase
---
### is_value?

#### core
#### Usage
`val:*`
##### AsyncFunction
Returns true for anything that is not nil or undefined or false.
##### Tags
if value truthy false true
---
### join

#### core
#### Usage
`joining_string?:string container:array`
##### Function
Given an optional joining string and an array of strings, returns a string containing the elements of the array interlaced with the optional joining string.<br>(join "," [ "red" "fox" ]) -> "red,fox"<br>(join ["red" "fox"]) -> redfox
##### Tags
array combine split string text
---
### jslambda

#### core
#### Usage
`argument_list:array argn:string`
##### Function
Proxy for Javascript Function.  Given a set of string based arguments, all but the last are considered arguments to the function to be defined.  The last argument is considered the body of the function and should be provided as a string of javascript. Returns a javascript function. <br>(jslambda (`a `b) "{ return a+b }")<br>(jslambda () "{ return new Date() }")
##### Tags
javascript embed function
---
### keys

#### core
#### Usage
`obj:object`
##### Function
Given an object, returns the keys of the object.
##### Tags
object values keys indexes container
---
### keys*

#### core
#### Usage
`obj:Object`
##### Function
Like keys, but where keys uses Object.keys, keys* uses the function Object.getOwnpropertynames and returns the prototype keys as well.
##### Tags
object array keys property properties introspection
---
### lambda

#### core
#### Usage
`arguments:array body_expression:*`
##### Special
[object Object]
##### Tags
function lambda fn call apply scope arrow lambda
---
### last

#### core
#### Usage
`x:array`
##### Function
Given an array, returns the last element in the array.
##### Tags
array container elements end
---
### last_n

#### core
#### Usage
`n:number arr:array`
##### Function
For a given array, returns the last n elements as an array.
##### Tags
array list text last amount end tail
---
### last_n_chars

#### core
#### Usage
`n:number text:string`
##### Function
For a given string, returns the last n characters as a string.
##### Tags
string text last amount end tail
---
### last_sunday

#### core
#### Usage
`date:Date?`
##### AsyncFunction
Called with no arguments returns a date representing the prior sunday at midnight, 12:00 AM.  If given a date, returns the prior sunday from the given date.
##### Tags
time date range prior week 24
---
### last_week

#### core
#### Usage
``
##### AsyncFunction
This function returns an array with two Date values.  The first, in index 0, is the start of the prior week at midnight, and the second is 7 days later, at midnight.
##### Tags
time date range prior hours 24
---
### length

#### core
#### Usage
`thing:container`
##### Function
Returns the length of the supplied type (array, object, set, string, number). If the supplied value is nil or a non-container type, returns 0.
##### Tags
size elements container dimension array set string number
---
### let

#### core
#### Usage
`allocations:array declarations:?expression expression0:* expressionN:*`
##### Special
Let is the primary means in which to allocate new bindings, and operate on the declared bindings. The binding forms are evaluated sequentially, but the declared symbols are available for all allocation forms, regardless of position in the sequence of binding forms.  Once all the bindings have been evaluated, the expressions are evaluated in an implicit progn block, with the result of the evaluation of the last expression being returned to the caller.  Note that even though a symbol binding may be accessible to all expressions in the allocation forms, the referenced symbol may not be initialized and have a value of undefined, so caution must be taken to not reference values in prior to initialization.  Syntactically, all symbols allocated in let must be defined an initial value, and so the form (let ((a)) (= a 1)) is invalid.<br><br>Example:
```
(let
  ((a 2)      ; b, and f are visible at this point but b and f are undefined
   (f (fn ()  ; when f is called, a and b will be defined and have value
        (* a b)))
   (b 21))    ; once b's init form completes b will be set to the value 21
  (log "a is: " a " b is: " b)   ; first block expression - all allocatoins complete
  (f))         ; last block expression, f will be called and return 42
```
<- 42<br>Note that the above example doesn't contain an optional declaration form, which must come after the allocations and before the block expressions.<br><br>Another consideration when using let is that within the allocation forms, any references to symbols that are lexically scoped outside the let have their values available.  If the contained let re-binds an existing symbol, the new binding will have lexical precedence and the value of the rebound symbol will be determined by the result of the init-form of the allocation.This same rule applies to global values: if a let rebinds a global symbol in an allocation, the symbol referenced in the let scope will be the local value, and not the global.  This is defined as shadowing.<br>Example: 
```
(let
  ((a_binding 1))
  (log "outer: a_binding: " a_binding)
  (let ;; start inner let
     ((b_binding 2)
      (a_binding 3))  ;  a is rebound to 3
     (log "inner: a_binding: " a_binding " b_binding: " b_binding)
     a_binding)
  (log "outer: a_binding: " a_binding) ; outer binding again
  a_binding)
out: "outer: a_binding: " 1 
out: "inner: a_binding: " 2 "b_binding: " 3
out: "outer: a_binding: " 1 
```
<br>Declarations can be placed after the allocation form and prior to the expressions comprising the block:
```
(defun handler (options)
   (let
      ((validator options.validator)
       (user_input (request_user_input "Enter your value")))
      (declare (function validator))
      (validator user_input)))
```
<br>In the above the declare provides an optimization hint for the compiler.  Without the declare, the compiler would have to insert code that checks at runtime whether or not the options.validator value is a function prior to calling it, resulting in less execution efficiency. 
##### Tags
compiler allocation symbol initializing scope declaration
---
### lifespan

#### core
#### Usage
`dval:Date`
##### AsyncFunction
Given a date object, return a formatted string in English with the amount of time until the specified date.
##### Tags
date format time string elapsed
---
### list

#### core
#### Usage
`arg0:* argN:*`
##### AsyncFunction
Given a set of arbitrary arguments, returns an array containing the provided arguments. If no arguments are provided, returns an empty array.
##### Tags
array container elements
---
### load

#### core
#### Usage
`filename:string`
##### AsyncFunction
Compile and load the contents of the specified lisp filename (including path) into the Lisp environment. The file contents are expected to be Lisp source code in text format.
##### Tags
compile read io file
---
### log

#### user
#### Usage
`arg0:* argN:*`
##### AsyncFunction
Logs arguments to the console and the current *system_repl* output.  Returns nil.
##### Tags
log console values display
---
### lowercase

#### core
#### Usage
`text:string`
##### Function
Given a string, converts all capital characters to lowercase characters.
##### Tags
string text uppercase case convert
---
### macroexpand

#### core
#### Usage
`quoted_form:*`
##### AsyncFunction
Given a quoted form, will perform the macro expansion and return the expanded form.
##### Tags
macro expansion debug compile compilation
---
### macroexpand_all

#### core
#### Usage
`quoted_form:*`
##### AsyncFunction
Given a quoted form, will recursively expand all macros in the quoted form and return the expanded form structure
##### Tags
macro expansion debug compile compilation
---
### macros

#### core
#### Usage
``
##### AsyncFunction
Returns the list of currently defined macros.  This function takes no arguments.
##### Tags
environment macro defined
---
### make_path

#### core
#### Usage
`path:array root_obj:object value:*`
##### AsyncFunction
Given a target_path array, a target object and a value to set, constructs the path to the object, constructing where required.  If the path cannot be made due to a non-nil, non-object value encountered at one of the path segments, the function will throw a TypeError, otherwise it will return the provided value if successful.
##### Tags
set_path path set object resolve_path mutate
---
### make_set

#### core
#### Usage
`vals:array|object|set`
##### Function
If given an array, a new Set is returned containing the elements of the array. If given an object, a new Set is returned containing the values of the object, and the keys are discarded. If given a set, new Set is created and returend  from the values of the old set.
##### Tags
array set object values convert
---
### make_sort_buckets

#### core
#### Usage
``
##### AsyncFunction
Called with no arguments, this function returns a function that when called with a category and a value, will store that value under the category name in an array, which acts as an accumulator of items for that category.  In this mode, the function returns the passed item to be stored.<br><br>When the returned function is called with no arguments, the function returns the object containing all passed categories as its keys, with the values being the accumulateditems passed in previous calls.
##### Tags
objects accumulator values sorting categorize categorization buckets
---
### map

#### core
#### Usage
`lambda:function elements:array`
##### AsyncFunction
Provided a function as a first argument, map calls the function (item, current_index, total_length) with each element from the second argument, which should be a list. Returns a new list containing the return values resulting from evaluating.
##### Tags
array container elements iteration
---
### map_range

#### core
#### Usage
`n:number from_range:array to_range:array`
##### Function
Given an initial number n, and two numeric ranges, maps n from the first range to the second range, returning the value of n as scaled into the second range. 
##### Tags
range scale conversion
---
### match_all

#### core
#### Usage
`regex_str:string search_string:string`
##### AsyncFunction
Given a regex expression as a string, and the string to search through, returns all matched items via matchAll.
##### Tags
match regex string find scan
---
### max_index

#### core
#### Usage
`container:array`
##### Function
Given a container, typically an Array or derivative, return the max index value, calculated as length - 1.<br>
##### Tags
length array container max index range limit
---
### max_value

#### core
#### Usage
`elements:array`
##### Function
Returns the maximum value in the provided array of numbers.
##### Tags
min max_value array elements minimum number
---
### measure_time

#### core
#### Usage
`form:list`
##### Macro
Given a form as input, returns an object containing time taken to evaluate the form in milliseconds with the key time and a result key with the evaluation results.
##### Tags
time measurement debug timing
---
### merge_objects

#### core
#### Usage
`objects:array`
##### Function
Merge objects takes an array of objects and returns an object whose keys and values are the sum of the provided objects (same behavior as add with objects).  If objects have the same keys, the last element in the array with the duplicate key will be used to provide the value for that key.
##### Tags
add merge keys values objects value
---
### meta_for_symbol

#### user
#### Usage
`quoted_symbol:string search_mode:boolean`
##### Function
Given a quoted symbol and a boolean indicating whether or not all namespaces should be searched, returns the meta data associated with the symbol for each environment.  If search mode is requested, the value returned is an array, since there can be symbols with the same name in different environments. If no values are found an empty array is returned.  If not in search mode, meta_for_symbol searches the current namespace only, and if a matching symbol is found, returns an object with all found metadata, otherwise nil is returned.
##### Tags
describe meta help definition symbol metadata
---
### midnight-to-midnight

#### core
#### Usage
`val:Date`
##### AsyncFunction
This function returns an array with two Date values.  The first, in index 0, is the start of the prior day (yesterday midnight), and the second is 24 hours later, i.e. midnight from last night.
##### Tags
time date range prior hours 24
---
### min_value

#### core
#### Usage
`elements:array`
##### Function
Returns the minimum value in the provided array of numbers.
##### Tags
min max_value array elements minimum number
---
### minmax

#### core
#### Usage
`container:array`
##### AsyncFunction
Given an array of numbers returns an array containing the smallest and the largest values found in the provided array. 
##### Tags
list number range value
---
### minmax_index

#### core
#### Usage
`container:array`
##### AsyncFunction
Given an array of numbers returns an array containing the indexes of the smallest and the largest values found in the provided array.
##### Tags
list number range value index
---
### modify_color_ts

#### core
#### Usage
`rgb_value:array tint_factor:number`
##### AsyncFunction
Given an array containing three values between 0 and 1 corresponding to red, green and blue, apply the provided factor to the color and return the result as an rgb array.The provided factor should be in the range -1 to 1: -1 to 0 applies shade to the color and 0 to 1 applies tinting to the color.
##### Tags
colors graphics
---
### new

#### core
#### Usage
`constructor:function argN:*`
##### Special
Given a constructor function and arguments, returns an instantiated object of the requested type.
##### Tags
constructor instantiation object class
---
### new_ctx

#### core
#### Usage
`ctx:?object`
##### AsyncFunction
Used for compilation. Given a context structure, provides a utility function for retrieving a context value based on a provided identifier.
##### Tags
compiler system context ctx setf_ctx
---
### next_sunday

#### core
#### Usage
`date:Date?`
##### AsyncFunction
Called with no arguments returns a date representing the upcoming sunday at midnight, 12:00 AM.  If given a date, returns the next sunday from the given date.
##### Tags
time date range next week 24
---
### no_await

#### core
#### Usage
`no_await:array`
##### Macro
For the provided form in an asynchronous context, forces the compiler flag to treat the form as synchronous, thus avoiding an await call.  The return value may be impacted and result in a promise being returned as opposed to a resolved promise value.
##### Tags
compiler synchronous await promise
---
### no_empties

#### core
#### Usage
`items:list|set`
##### AsyncFunction
Takes the passed list or set and returns a new list that doesn't contain any undefined, nil or empty values
##### Tags
filter nil undefined remove except_nil
---
### noop

#### core
#### Usage
`val:*`
##### AsyncFunction
No operation, just returns the value.  To be used as a placeholder operation, such as in apply_operator_list.
##### Tags
apply value
---
### not

#### core
#### Usage
`x:*`
##### Function
Returns the logical opposite of the given value.  If given a truthy value, a false is returned.  If given a falsey value, true is returned.
##### Tags
logic not inverse
---
### nth

#### core
#### Usage
`idx:string|number|array collection:list|object`
##### AsyncFunction
Based on the index or index list passed as the first argument, and a collection as a second argument, return the specified values from the collection. If an index value is negative, the value retrieved will be at the offset starting from the end of the array, i.e. -1 will return the last value in the array.
##### Tags
filter select pluck object list key array
---
### object_methods

#### core
#### Usage
`obj:object`
##### AsyncFunction
Given a instantiated object, get all methods (functions) that the object and it's prototype chain contains.
##### Tags
object methods functions introspection keys
---
### objects_from_list

#### core
#### Usage
`key_path:string|array objects:array`
##### AsyncFunction
Given a path (string or array), and an array of object values, the function returns a new object with keys named via the value at the given path, and the object as the value.
##### Tags
list object conversion transform
---
### on_empty

#### core
#### Usage
`empty_form:form value:*`
##### Macro
If the value argument is not an empty array, an empty object, nil or undefined, return the value, otherwise evaluate the provided empty_form and return the results of the evaluation of the empty_form.
##### Tags
condition empty list array object eval undefined
---
### on_nil

#### core
#### Usage
`nil_form:form value:*`
##### Macro
If the value argument is not nil or not undefined, return the value, otherwise evaluate the provided nil_form and return the results of the evaluation of the nil_form.
##### Tags
condition nil eval undefined
---
### only

#### core
#### Usage
`fields:array data:array|object`
##### AsyncFunction
Given an array of objects, or a single object, return objects only containing the specified keys and the corresponging value.
##### Tags
pluck filter select object each list objects keys
---
### operating_system

#### core
#### Usage
``
##### Function
Returns a text string of the operating system name: darwin, linux, windows
##### Tags
os environment build platform env
---
### options_and_args

#### core
#### Usage
`arg_array:array`
##### AsyncFunction
Given an array of values, returns an array containing two values.  If the value at position 0 in the provided array is an non nil object, it will be in the position 0 of the returned value and the remaining values will be in position 1 of the returned array.If the value at position 0 in the provided array is not an object type,the value in position 0 of the returned array will be nil and all values will be placed in the returned array in position 1.
##### Tags
arguments options
---
### or_args

#### core
#### Usage
`argset:array`
##### AsyncFunction
Provided an array of values, returns true if any of the values are true, otherwise will return false.
##### Tags
or true false array logic
---
### or*

#### core
#### Usage
`val0:* val1:* val2:*`
##### AsyncFunction
Similar to or, but unlike or, values that are "" (blank) or NaN are considered to be true.Uses is_value? to determine if the value should be considered to be true.Returns true if the given arguments all are considered a value, otherwise false.  If no arguments are provided, returns undefined.
##### Tags
truth or logic truthy
---
### pad_left

#### core
#### Usage
`value:number|string pad_amount:number padchar:?string`
##### Function
<br><br>Given a value (number or text). an amount to pad, and an optional character to use a padding value, returns a string that will contain pad amount leading characters of the padchar value.<br><br>#### Example <br>
```
(pad_left 23 5 `0)
<- "00023"

(pad_left 4 5)
<- "    4"
```
<br> 
##### Tags
pad string text left
---
### pairs

#### core
#### Usage
`obj:object`
##### Function
Given a passed object or array, returns a list containing a 2 element list for each key/value pair of the supplied object.
##### Tags
array container object
---
### pairs_from_list

#### core
#### Usage
`value:list size?:number`
##### AsyncFunction
Given a list, segment the passed list into sub list (default in pairs) or as otherwise specified in the optional size
##### Tags
list pairs collect
---
### pairs*

#### core
#### Usage
`obj:Object`
##### Function
Like pairs, but where keys uses Object.keys, pairs* returns the key-value pairs prototype heirarchy as well.
##### Tags
object array keys property properties introspection values
---
### parse_csv

#### core
#### Usage
`csv_data:string options:object?`
##### AsyncFunction
Given a text file of CSV data and an optional options value, parse and return a JSON structure of the CSV data as nested arrays.<br>Options can contain the following values:<br><table><tr><td>separator</td><td>A text value for the separator to use.  The default is a comma.</td></tr><tr><td>interruptions</td><td>If set to true, will pause regularly during processing for 1/10th of a second to allow other event queue activities to occur.</td></tr><tr><td>notifier</td><td>If interruptions is true, notifier will be triggered with the progress of work as a percentage of completion (0 - 1), the current count and the total rows.</td></tr></table>
##### Tags
parse list values table tabular csv
---
### path_to_js_syntax

#### core
#### Usage
`comps:array`
##### AsyncFunction
Used by the compiler, converts an array containing the components of a path to Javascript syntax, which is then returned as a string.
##### Tags
compiler path js javascript
---
### pend_load

#### user
#### Usage
`from_namespace:string target_namespace:string symbol:string initializer:array`
##### AsyncFunction
When used as an initializer wrapper via the use_symbols macro, the wrapped initializer will not be loaded until the from_namespace is loaded to ensure that the wrapped initializer won't fail due to not yet loaded dependencies.
##### Tags
symbol definitions namespace scope dependency dependencies require
---
### platform

#### core
#### Usage
``
##### Function
Returns an object with keys for 'target', 'arch', 'os' and 'vendor'.  
##### Tags
os platform architecture hardware type build
---
### platform_architecture

#### core
#### Usage
``
##### Function
Returns a text string of the underlying hardware architecture, for example aarch64 or X86_64.
##### Tags
os platform architecture hardware type build
---
### pluck

#### core
#### Usage
`fields:string|array data:array`
##### Macro
Similar to the 'each' commmand, given the set of desired fields as a first argument, and the data as the second argument, return only the specified fields from the supplied list of data
##### Tags
list each filter only object
---
### pop

#### core
#### Usage
`place:array`
##### Function
Given an array as an arguments, removes the last value from the given array and returns it.
##### Tags
array mutate take remove push
---
### prepend

#### core
#### Usage
`place:array thing:*`
##### Function
Places the value argument onto the first of the list (unshift) and returns the list.
##### Tags
array mutate container
---
### pretty_print

#### core
#### Usage
`input:array|string`
##### Function
The pretty_print function attempts to format the presented input, provided either as a string or JSON. The return is a string with the formatted input.
##### Tags
format pretty lisp display output
---
### process_tree_symbols

#### core
#### Usage
`tree:*`
##### AsyncFunction
Given a JSON structure, such as produced by the reader, returns an object containing the various determined types of the provided structure:<br>allocations:array - All locally allocated symbols<br>symbols:array - All identified symbols<br>keywords:array - All keywords used in the structureliterals:array - All identified literals (i.e. not a symbol)globals:array - All referenced globals
##### Tags
editor usage scope structure
---
### progc

#### core
#### Usage
`forms:*`
##### Macro
This macro wraps the provided forms in a try-catch, and returns the last value if no errors, like progn, or if an error occurs, logs to the console.  Simple help for debugging.
##### Tags
debug error catch handler progn eval
---
### progl

#### core
#### Usage
`form0:* form1:* formN:*`
##### Special
Like progn, progl is a block operator, but doesn't establish a new scope boundary in the contained forms.It also doesn't return any values, but acts as a means by which to manipulate quoted forms (for example in a macro).
##### Tags
block progn do
---
### progn

#### core
#### Usage
`form0:* form1:* formN:*`
##### Special
The block operator evaluates all forms in the order they were provided and returns the last value.If the block operator is a top level form, then the forms are evaluated as top level forms, in which the form is compiled and immediately evaluated. The results of any side effects of the compiled form are therefore available to subsequent processing.<br>The block operator introduces a new lexical scope boundary (in JS the equivalence { } ) such that symbols defined locally to the block via defvar will not be visible to blocks above it, only subforms and blocks defined within it.
##### Tags
block progn do scope
---
### prop

#### core
#### Usage
`place:object key:string|number`
##### Special
Returns a property on the designated place (an object) using the key as the property name.  If the key isn't found, undefined is returned.
##### Tags

---
### push

#### core
#### Usage
`place:array thing:*`
##### Function
Given an array as a place, and an arbitrary value, appends (pushes) the value to the end of the array.
##### Tags
array mutate append concat pop
---
### random_int

#### core
#### Usage
`arg1:number arg2?:number`
##### Function
Returns a random integer between 0 and the argument.  If two arguments are provided then returns an integer between the first argument and the second argument.
##### Tags
rand number integer
---
### range

#### core
#### Usage
`start_or_end:number end:number step:number`
##### Function
Range has a variable form depending on the amount of arguments provided to the function when calling it. If provided one argument, range will produce an array from 0 up to, but not including the provided value. If given two arguments, the first argument will be the starging value and the last value will be used as the upper bounding value, returning an array with elements starting at the start value and up to, but not including the bounding value. If given a third value, the value will be interpreted as the step value, and the returned array will contain values that increment by the step amount.  Range will throw an error if a negative range is specified. For negative ranges see neg_range.<br><br>Examples:<br>(range 5) -> [ 0 1 2 3 4 ]<br>(range 10 15) -> [ 10 11 12 13 14 ]<br>(range 10 20) -> [ 10 12 14 16 18 ]<br>(range -5 0) -> [ -5 -4 -3 -2 -1 ]<br>(range -3 3) -> [ -3, -2, -1, 0, 1, 2 ]<br>
---
### range_inc

#### core
#### Usage
`start:number end?:number step?:number`
##### Function
Similar to range, but is end inclusive: [start end] returning an array containing values from start, including end. vs. the regular range function that returns [start end).  If just 1 argument is provided, the function returns an array starting from 0, up to and including the provided value.
##### Tags
range iteration loop
---
### range_overlap?

#### core
#### Usage
`range_a:array range_b:array`
##### AsyncFunction
Given two ranges in the form of [low_val high_val], returns true if they overlap, otherwise false.  The results are undefined if the range values are not ordered from low to high.
##### Tags
range iteration loop
---
### rebuild_env

#### core
#### Usage
`options:object?`
##### AsyncFunction
Builds the lisp environment from the Lisp sources and produces the Javascript output files necessary for initializing the environment. Options: <br>source_dir:string:The directory of the Lisp sources, the default is './src'.<br>output_dir:string:The directory to where the output Javascript files are placed.  The default is './js'.<br>include_source:boolean:If true, the compiler will include comments of the lisp source (not fully supported yet).<br>version_tag:string:A string based label signifying the text to use as the version.  If not specified, the version tag uses the format year.month.day.hour.minute.<br>
##### Tags
compile export build environment javascript
---
### reduce

#### core
#### Usage
`binding-elem:symbol values:list form:list`
##### Macro
Provided a first argument as a list which contains a binding variable name and a list, returns a list of all non-null return values that result from the evaluation of the second list.
##### Tags
filter remove select list array
---
### reduce_sync

#### core
#### Usage
`binding-elem:symbol values:list form:list`
##### Macro
Provided a first argument as a list which contains a binding variable name and a list, returns a list of all non-null return values that result from the evaluation of the second list.
##### Tags
filter remove select list array
---
### register_feature

#### core
#### Usage
`feature:string`
##### AsyncFunction
Adds the provided string to the *env_config* features.  Features are used to mark what functionality is present in the environment.
##### Tags
environment modules libraries namespaces
---
### remaining_in_range

#### core
#### Usage
`value:number check_range:array`
##### AsyncFunction
Given a value, and an array containing a start and end value, returns the remaining amount of positions in the given range.  If the value isn't in range, the function will return nil.
##### Tags
range iteration loop
---
### remove_if

#### core
#### Usage
`f:function container:array`
##### AsyncFunction
Given a function with a single argument, if that function returns true, the value will excluded from the returned array.  Opposite of filter.
##### Tags
collections reduce filter where list array reduce
---
### remove_prop

#### core
#### Usage
`obj:object key:*`
##### AsyncFunction
If the provided key exists, removes the key from the provided object, and returns the removed value if the key exists, otherwise returned undefined.
##### Tags
object key value mutate delete_prop remove
---
### reorder_keys

#### core
#### Usage
`key_list:array obj:object`
##### AsyncFunction
Given a list of keys, returns a new object that has the keys in the order of the provided key list.
##### Tags
list object key order
---
### repl_config

#### core
#### Usage
``
##### AsyncFunction
Returns the environment configuration options that are available for the repl and their current settings.
##### Tags
repl config
---
### replace

#### core
#### Usage
`target:string|regexp replacement:string|number container:string|array|object`
##### Function
Given at least 3 arguments, finds the first  argument, and replaces with the second argument, operating on the third plus argument.  This function will act to replace and find values in strings, arrays and objects.  When replacing values in strings, be aware that only the first matching value will be replaced.  To replace ALL values in strings, use a RegExp with the `g flag set, such as (new RegExp "Target String" `g).  For example, the following replaces all target values in the target string:<br>(replace (new RegExp "Indiana" `g) "Illinois" "The address of the location in Indiana has now been changed to 123 Main Street, Townville, Indiana.")
##### Tags
replace find change edit string array object
---
### resolve_multi_path

#### core
#### Usage
`path:array obj:object not_found:?*`
##### Function
Given a list containing a path to a value in a nested array, return the value at the given path. If the value * is in the path, the path value is a wild card if the passed object structure at the path position is a vector or list.
##### Tags
path wildcard tree structure
---
### resolve_path

#### core
#### Usage
`path:array tree_structure:array|object`
##### Function
Given a path and a tree structure, which can be either an array or an object, traverse the tree structure and return the value at the path if it exists, otherwise undefined is returned.<br>(resolve_path [ 2 1 ] [ 1 2 [ 3 4 5 ] 6 7]) => 4)
##### Tags
find position index path array tree contains set_path
---
### rest

#### core
#### Usage
`x:array`
##### Function
Returns a new array containing the elements in the 2nd through last position (the tail) of the provided array.
##### Tags
array subset slice tail end
---
### reverse

#### core
#### Usage
`container:list`
##### Function
Returns a copy of the passed list as reversed.  The original is not changed.
##### Tags
list sort order
---
### reverse_string

#### core
#### Usage
`text:string`
##### Function
Given a string, returns the characters in reverse order.
##### Tags
string text reverse modify
---
### rgb_to_hsv

#### core
#### Usage
`rgb_values:array`
##### AsyncFunction
Takes an array with three values corresponding to red, green and blue: [red green blue].Each value should be between 0 and 1 (i.e the set [0 1]) The function returns an array with three values corresponding to [hue saturation value] in the set [0 1].
##### Tags
colors graphics rgb conversion hsv
---
### rgb_to_text

#### core
#### Usage
`rgb_values:array`
##### AsyncFunction
Given an array with 3 values ranging from 0 to 1, corresponding to the "red","green","blue" values of the described color, the function returns a string in the form of FFFFFF.
##### Tags
colors graphics
---
### rotate_left

#### core
#### Usage
`array_obj:array`
##### Function
Given an array, takes the element at the first position (index 0), removes it and places it at the front (highest index) and returns the array. 
##### Tags
array rotation shift left
---
### rotate_right

#### core
#### Usage
`array_obj:array`
##### Function
Given an array, takes the element at the last position (highest index), removes it and places it at the front (index 0) and returns the array. 
##### Tags
array rotation shift right
---
### save_locally

#### core
#### Usage
`filename:string data:* content_type:string`
##### AsyncFunction
Provided a filename, a data buffer, and a MIME type, such as "text/javascript", triggers a browser download of the provided data with the filename.  Depending on the browser configuration, the data will be saved to the configured user download directory, or prompt the user for a save location. 
##### Tags
save download browser
---
### scan_for

#### core
#### Usage
`non_nil_prop:string list_of_objects:array`
##### AsyncFunction
Given a property name and a list of objects, find the first object with the non-nil property value specified by non_nil_prop. Returns the value of the non-nil property.
##### Tags
find scan object list array value
---
### scan_list

#### core
#### Usage
`regex:string container:list`
##### AsyncFunction
Scans a list for the provided regex expression and returns the indexes in the list where it is found.  The provided regex expression can be a plain string or a RegExp object.
##### Tags
search index list regex array string
---
### scan_str

#### core
#### Usage
`regex:RegExp text:string`
##### Function
Using a provided regex and a search string, performs a regex exec using the provided regex argument on the string argument. Returns an array of results or an empty array, with matched text, index, and any capture groups.
##### Tags
regex string match exec array
---
### second

#### core
#### Usage
`x:array`
##### Function
Returns the second element in the provided array (the element at index 1)
##### Tags
array subset element first
---
### set_compiler

#### user
##### AsyncFunction
---
### set_default

#### core
#### Usage
`path:symbol|string|array value:*`
##### Macro
Given a path to a value in the *env_config* object, and a value to set, creates or sets the value at the provided path position.  The path can be in the following forms:<br>path.to.default_value:symbol - A period delimited non-quoted symbol<br>[ `path `to `default_value ] - An array with quoted values or strings, in the standard path format.<br>"path.to.default_value" - A string delimited by periods<br>"path~to~default_value" - A string delimited by the path delimiter ~<br><br>The value returned from the macro is the new default value as set in the *env_config*.<br>
##### Tags
default defaults set application editor repl
---
### set_path

#### core
#### Usage
`path:array tree:array|object value:*`
##### AsyncFunction
Given a path value as an array, a tree structure, and a value, sets the value within the tree at the path value, potentially overriding any existing value at that path.<br><br>(defglobal foo [ 0 2 [ { `foo: [ 1 4 3 ] `bar: [ 0 1 2 ] } ] 3 ])<br>(set_path [ 2 0 `bar 1 ] foo 10) => [ 0 10 2 ]<br>foo => [ 0 2 [ { foo: [ 1 4 3 ] bar: [ 0 10 2 ] } ] 3 ]
##### Tags
resolve_path make_path path set tree mutate
---
### set_path_value

#### core
#### Usage
`root:object path:list value:*`
##### AsyncFunction
Given an object (the root), a path array, and a value to set, sets the value at the path point in the root object.
##### Tags
object path resolve assign
---
### set_prop

#### core
#### Usage
`place:object key0:string|number value0:* keyN:string valueN:*`
##### Special
Sets a property on the designated place (an object) using the key as the property name and the provided value as the value.The operator returns the object that was modified.
##### Tags

---
### set_repl

#### core
#### Usage
`key:string value:*`
##### AsyncFunction
Given a configuration key and a value, sets the provided REPL config key to the value.
##### Tags
repl config
---
### setf_ctx

#### core
#### Usage
`ctx:object name:string value:*`
##### AsyncFunction
Used for compilation. Given a context structure, provides a utility function for setting a context place with value.
##### Tags
compiler system context ctx new_ctx getf_ctx
---
### setq

#### core
#### Usage
`target:symbol value:*`
##### Special
Sets the target symbol to the provided value and returns the value.   A Reference error is thrown if the symbol is undeclared.
##### Tags
assignment set value
---
### sha1

#### core
#### Usage
`text:string`
##### AsyncFunction
Given a text string as input, returns a SHA-1 hash digest string of the given input.
##### Tags
digest crypto hash comparison
---
### shade_rgb

#### core
#### Usage
`rgb_value:array tint_factor:number`
##### AsyncFunction
Given an array containing three values between 0 and 1 corresponding to red, green and blue, apply the provided tint factor to the color and return the result as an rgb array.The provided tint factor should be in the range 0 (for no tint) to 1 (full tint).
##### Tags
colors graphics
---
### show

#### core
#### Usage
`thing:function`
##### AsyncFunction
Given a name to a compiled function, returns the source of the compiled function.  Otherwise just returns the passed argument.
##### Tags
compile source javascript js display
---
### show_time_in_words

#### core
#### Usage
`seconds:integer options:object`
##### Function
Given an integer value representing seconds of a time duration, return a string representing the time in words, such as 2 mins.  If the key longForm is set to true in options return full words instead of contracted forms.  For example min vs. minute.
##### Tags
time date format string elapsed
---
### sleep

#### core
#### Usage
`seconds:number`
##### AsyncFunction
Pauses execution for the number of seconds provided to the function.
##### Tags
time timing pause control
---
### slice

#### core
#### Usage
`target:array from:number to:number`
##### Function
Given an array, with a starting index and an optional ending index, slice returns a new array containing the elements in the range of provided indices.
##### Tags
array slicing dimensions subset
---
### sort

#### core
#### Usage
`elements:array options:object?`
##### AsyncFunction
Given an array of elements, and an optional options object, returns a new sorted array.With no options provided, the elements are sorted in ascending order.  If the key reversed is set to true in options, then the elements are reverse sorted. <br>An optional synchronous function can be provided (defined by the comparitor key) which is expected to take two values and return the difference between them as can be used by the sort method of JS Array.  Additionally a key value can be provided as either a string (separated by dots) or as an array which will be used to bind (destructure) the a and b values to be compared to nested values in the elements of the array.<br><br>Options:<br>reversed:boolean:if true, the elements are reverse sorted.  Note that if a comparitor function is provided, then this key cannot be present, as the comparitor should deal with the sorting order.<br>key:string|array:A path to the comparison values in the provided elements. If a string, it is provided as period separated values.  If it is an array, each component of the array is a successive path value in the element to be sorted. <br>comparitor:function:A synchronous function that is to be provided for comparison of two elements.  It should take two arguments, and return the difference between the arguments, either a positive or negative.
##### Tags
array sorting order reverse comparison objects
---
### sort_dependencies

#### core
#### Usage
``
##### AsyncFunction
Returns an object containing two keys, `namespaces` and `symbols`, each being arrays that contains the needed load order to satisfy the dependencies for the current environment with all namespaces.  For symbols, the array is sorted in terms of dependencies: a symbol appearing with a higher index value will mean that it is dependent on symbols at a lower index value, with the first symbol having no dependencies, and the final element having the most dependencies.  For example, if the final symbol in the returned array is to be compiled, symbols at a lower index must be defined prior to compiling the final symbol.<br>The namespaces reflect the same rule: a lower indexed namespace must be loaded prior to a higher indexed namespace. 
##### Tags
symbol symbols dependencies requirements order compile
---
### split

#### core
#### Usage
`string_to_split:string split_token:string`
##### Function
Given a string to partition and a string for a splitting token, return an array whose elements are the text found between each splitting token. <br>(split "red,fox" ",") => [ "red" "fox" ]
##### Tags
partition join separate string array
---
### split_by

#### core
#### Usage
`split_token:string string_to_split:string`
##### Function
Given a string for a splitting token and a string to partition, return an array whose elements are the text found between each splitting token. <br>(split_by "," "red,fox") => [ "red" "fox" ]
##### Tags
partition join separate string array
---
### split_by_recurse

#### core
#### Usage
`token:string container:string|array`
##### Function
Like split_by, splits the provided container at each token, returning an array of the split items.  If the container is an array, the function will recursively split the strings in the array and return an array containing the split values of that array.  The final returned array may contain strings and arrays.
##### Tags
split nested recursion array string
---
### split_text_in_array

#### core
#### Usage
`split_element:text input_array:array`
##### AsyncFunction
Takes the provided array, and split_element, and returns an array of arrays which contain the split text strings of the input list.
##### Tags
text string split separate parse
---
### split_words

#### core
#### Usage
`text:string`
##### AsyncFunction
Like words and quotes, splits the text string into words and quoted words, but the unquoted words are split by spaces.  Both the unquoted words and the quoted words inhabit their own array.
##### Tags
text string split separate words parse
---
### squeeze

#### core
#### Usage
`string_value:string`
##### AsyncFunction
Returns a string that has all spaces removed from the supplied string value.
##### Tags
text space trim remove
---
### starts_with?

#### core
#### Usage
`start_value:value collection:array|string`
##### Function
for a given string or array, checks to see if it starts with the given start_value.  Non string args return false.
##### Tags
string text list array filter reduce begin
---
### str

#### core
#### Usage
`arg0:string argn:string`
##### AsyncFunction
Joins arguments into a single string separated by spaces and returns a single string.
##### Tags
string join text
---
### sub_type

#### core
#### Usage
`value:*`
##### Function
Returns a string the determined actual type of the provided value.
##### Tags
type class prototype typeof instanceof
---
### success

#### core
#### Usage
`args0:* argsN:*`
##### AsyncFunction
Prefixes a green checkmark symbol prior to the arguments to the console.  Otherwise the same as console.log.
##### Tags
log warning notify signal output ok success defclog
---
### sum

#### core
#### Usage
`vals:array`
##### Macro
Given an array of values, add up the contents of the array in an applied add operation.  If these are numbers, they will be added arithmetically.  If given strings, they will be joined together (appended). If given a first value of an array, all subsequent values will be added into the array. If given an array of objects, all the keys/values will be merged and a single object retuned.
##### Tags
add join summation numbers
---
### sum_up_prop

#### core
#### Usage
`key:string values:array|object`
##### AsyncFunction
Given a key and an object or array of objects, return the total sum amount of the given key.
##### Tags
sum key property objects iteration
---
### symbol_definition

#### user
#### Usage
`symname:string namespace:string`
##### AsyncFunction
Given a symbol name and an optional namespace, either as a fully qualified path or via the target_namespace argument, returns definition information about the retquested symbol.  Used primarily by the compiler to find metadata for a specific symbol during compilation.
##### Tags
compiler symbols namespace search context environment
---
### symbol_dependencies

#### core
#### Usage
`quoted_symbol:array`
##### AsyncFunction
Given an array of symbols in string form, returns the global dependencies that the symbols are dependent on in the runtime environment.  The return structure is in the form:
```
{
  dependencies: []
  namespaces: []
}
```
<br><br>The return structure will contain all the qualified and non-qualified symbols referenced by the provided target symbol, plus the dependencies of the required symbols.  <br>The needed namespace environments are also returned in the namespaces value.<br> 
##### Tags
dependencies tree required dependency
---
### symbol_tree

#### core
#### Usage
`quoted_form:quote`
##### AsyncFunction
Given a quoted form as input, isolates the symbols of the form in a tree structure so dependencies can be seen.
##### Tags
structure development analysis
---
### symbols

#### user
#### Usage
`opts:object`
##### AsyncFunction
Returns an array of the defined global symbols for the local environment.  If opts.unique is true, only symbols that are not part of the built ins are included.
##### Tags
symbol names definitions values scope
---
### symbols_by_namespace

#### core
#### Usage
`options:object`
##### AsyncFunction
<br><br>By default, when called with no options, the `symbols_by_namespace` function returns an object with a key for each namespace, with an array containing the symbols (in a string format) defined in that namespace. <br>There is an optional `options` object argument which can modify the returned results and format.  <br><br>#### Options <br><br>include_meta:function -If true, will return the meta data associated with each symbol from the Environment definitions.  The output format is changed in this situation: instead of an array being returned, an object with the symbol names as keys and the meta data values as their value is returned.   
##### Tags
symbols namespace
---
### system_date_format

#### core
##### object
The system date format structure that is used by the system_date_formatter.If modified, the system_date_formatter, which is a Intl.DateTimeFormat object should be reinitialized by calling (new Intl.DateTimeFormat [] system_date_format).
##### Tags
time date system
---
### system_date_formatter

#### core
##### DateTimeFormat
The instantiation of the system_date_format.  See system_date_format for additional information.
##### Tags
time date system
---
### take

#### core
#### Usage
`place:container`
##### Function
Takes the first value off the list, and returns the value.
##### Tags
array container mutate first
---
### text_to_rgb

#### core
#### Usage
`rgb_string:string`
##### AsyncFunction
Given an RGB hex color string in the form of "FFFFFF", returns an array containing [ red green blue ] in the set [ 0 1 ].
##### Tags
colors graphics
---
### third

#### core
#### Usage
`x:array`
##### Function
Returns the third element in the provided array (the element at index 2)
##### Tags
array subset element first
---
### throw

#### core
#### Usage
`type:symbol message:string`
##### Special
Given a type as a symbol and a message, constructs an object instance of the specified type and then throws the object.  The thrown object should be lexically enclosed in a try-catch form otherwise the unhandled throw may cause an exit of the runtime (dependent on the runtime environment behavior for uncaught objects.<br>See also: try<br>
##### Tags
flow control error exceptions try catch
---
### time_in_millis

#### core
#### Usage
``
##### Macro
Returns the current time in milliseconds as an integer
##### Tags
time milliseconds number integer date
---
### tint_rgb

#### core
#### Usage
`rgb_value:array tint_factor:number`
##### AsyncFunction
Given an array containing three values between 0 and 1 corresponding to red, green and blue, apply the provided tint factor to the color and return the result as an rgb array.The provided tint factor should be in the range 0 (for no tint) to 1 (full tint).
##### Tags
colors graphics
---
### to_array

#### core
#### Usage
`container:*`
##### AsyncFunction
Given a container of type Array, Set, Object, or a string, it will convert the members of the container to an array form, and return a new array with the values of the provided container. In the case of an object, the keys and values will be contained in paired arrays in the returned array.  A string will be split into individual characters. If provided a different type other than the listed values above, the value will be placed in an array as a single element.
##### Tags
array conversion set object string pairs
---
### to_csv

#### core
#### Usage
`rows:list delimiter:string`
##### AsyncFunction
Given a list of rows, which are expected to be lists themselves, join the contents of the rows together via , and then join the rows together into a csv buffer using a newline, then returned as a string.
##### Tags
csv values report comma serialize list
---
### to_key

#### core
#### Usage
`value:string separator?:string`
##### Function
Takes a value such as "Last Name" and returns a string that has the spaces removed and the characters replaced by the default separator, '_'.  Each word is converted to lowercase characters as well.An optional separator argument can be provided to use an alternative separator token.<br>E.G. "Last Name" becomes "last_name".
##### Tags
string split key hash record form ui
---
### to_mixed_case

#### core
#### Usage
`snake_case_key:string`
##### Function
<br><br>Given a snake case string, will return a mixed case key format representation of the string.  For example,  the string `my_variable` will be returned as `myVariable` with this function.  A TypeError will be thrown if a non-string argument is provided. 
##### Tags
key convert snake mixed case format
---
### to_object

#### core
#### Usage
`paired_array:array`
##### Function
Given an array of pairs in the form of [[key value] [key value] ...], constructs an object with the first array element of the pair as the key and the second element as the value. A single object is returned.
##### Tags
conversion object array list pairs
---
### tokenize_lisp

#### core
#### Usage
`quoted_source:*`
##### AsyncFunction
Given a quoted source, returns the compilation tokens for the source, prior to the actual compilation step.  Any functions that are specified as compile_time for eval_when, such as macros, will be expanded and the results of the expansions will be in the returned token form. 
##### Tags
compilation compiler tokenize token tokens precompiler
---
### traverse

#### core
#### Usage
`structure:object operator_function:function`
##### AsyncFunction
Given a structure such as an object or an array, and an operator function argument, the function will recursively call the operator function with the value and the path to each value in the structure.   The operator function can choose to operate on the value at the path by calling `set_path` for the root object, or otherwise examine the value and the path.  The return value of the operator function is ignored.  The operator function signature is called with `(value path_to_value)` as a signature.<br><br> 
##### Tags
recursion recurse structure object array search find
---
### trim

#### core
#### Usage
`value:string`
##### Function
Removes leading and trailing spaces from the provided string value.
##### Tags
string spaces clean squeeze leading trailing space
---
### truncate

#### core
#### Usage
`len:number value:array|string trailer:string?`
##### AsyncFunction
Given a length and a string or an array, return the value with a length no more than then the provided value. If the value is a string an optional trailer string can be provided that will be appeneded to the truncated string.
##### Tags
array string length max min
---
### try

#### core
#### Usage
`expression:* error-clause0:array error-clauseN:array`
##### Special
An expression or block surrounded by a try-catch error clause which throws an Error or subclass of Error is checked against all (but at least 1) catch expressions that match the type of error which has been thrown. If the error type is matched by a handler for that type, the catch expression is evaluated. If a handler for the error type or the error's prototype chain isn't found, the exception is rethrown, for potential interception by handlers further up the stack heirarchy.  In the following example, the specific error thrown is caught locally.  If an error was thrown that wasn't specifically Deno.errors.NotFound, the error would be rethrown: 
```
(try
   (write_text_file "/will/not/work.txt" "No permissions")
   (catch Deno.errors.NotFound (e)
     (+ "CAUGHT: type: " (subtype e) "MESSAGE: " e.message)))
```
<- "CAUGHT: type:  NotFound MESSAGE:  No such file or directory (os error 2), open '/will/not/work.txt'"<br>
An example of multiple catches for the same try block:
```
(try
  (throw Error "ERROR MESSAGE")
  (catch TypeError (e)
    (progn
      (log "Caught TypeError: " e.message)
      "ERROR 1"))
  (catch Error (e)
    (progn
        (log "Caught BaseError: " e.message)
        "ERROR 2")))
```
<- "ERROR 2"<br><br>The try-catch constructs returns the last value of the try block or the return value from a matched catch block, otherwise there is no local return.<br>Example:
```
(let
   ((result (try
              (throw Error "Invalid!") ; just throw to demonstrate the catch return
              (catch Error (e)
                  e.message))))
   result)
```
<- "Invalid!"
##### Tags
catch error throw flow control
---
### type

#### core
#### Usage
`value:*`
##### AsyncFunction
returns the type of value that has been passed.  Deprecated, and the sub_type function should be used.
##### Tags
types value what
---
### tzoffset

#### core
#### Usage
``
##### AsyncFunction
Returns the number of seconds the local timezone is offset from GMT
##### Tags
time date timezone
---
### undefine

#### user
#### Usage
`quoted_symbol:string`
##### Function
Given a quoted symbol removes the symbol and any definition information from the namespace. If the namespace is fully-qualified, then the symbol will be removed from the specified namespace instead of the currently active namespace. If the symbol is successfully removed, the function will return true, otherwise if it is not found, false will be returned.  Note that if the specified symbol is non-qualified, but exists in a different, accessible namespace, but the symbol isn`t present in the current namespace, the symbol will not be deleted.  The environment is not searched and therefore symbols have to be explicitly fully-qualified for any effect of this function outside the current namespace.
##### Tags
symbol delete remove unintern reference value
---
### uniq

#### core
#### Usage
`values:list`
##### AsyncFunction
Given a list of values, returns a new list with unique, deduplicated values. If the values list contains complex types such as objects or arrays, set the handle_complex_types argument to true so they are handled appropriately. 
##### Tags
list dedup duplicates unique values
---
### unless

#### core
#### Usage
`condition:array forms:array`
##### Macro
opposite of if, if the condition is false then the forms are evaluated
##### Tags
if not ifnot logic conditional
---
### unquotify

#### core
#### Usage
`val:string`
##### AsyncFunction
Removes binding symbols and quotes from a supplied value.  For use in compile time function such as macros.
##### Tags
macro quote quotes desym
---
### uppercase

#### core
#### Usage
`text:string`
##### Function
Given a string, converts all capital characters to uppercase characters.
##### Tags
string text lowercase case convert
---
### use_ns

#### core
#### Usage
`name:symbol`
##### Macro
Sets the current namespace to the provided name.  Returns the name of the new namespace if succesful, otherwise an Eval error is thrown
##### Tags
namespace environment scope change set
---
### use_quoted_initializer

#### core
#### Usage
`forms:array`
##### Macro
 
use_quoted_initializer is a macro that preserves the source form in the symbol definition object. 
When the environment is saved, any source forms that wish to be preserved through the 
serialization process should be in the body of this macro.  This is a necessity for global 
objects that hold callable functions, or functions or structures that require initializers,
such as things that connect or use environmental resources.

##### Tags
compilation save_env export source use compiler compile
---
### use_symbols

#### core
#### Usage
`namespace:string|symbol symbol_list:array target_namespace?:string`
##### Macro
Given a namespace and an array of symbols (quoted or unquoted), the macro will faciltate the binding of the symbols into the current namespace.
##### Tags
namespace binding import use symbols
---
### use_unique_symbols

#### core
#### Usage
`namespace:string`
##### AsyncFunction
This function binds all symbols unique to the provided namespace identifier into the current namespace. Returns the amount of symbol bound.
##### Tags
namespace binding import use symbols
---
### validate_form_structure

#### core
#### Usage
`validation_rules:array quoted_form:*`
##### AsyncFunction
Given a validation rule structure and a quoted form to analyze returns an object with two keys, valid and invalid, which are arrays containing the outcome of the rule evaluation, a rule_count key containing the total rules passed, and an all_passed keywhich will be set to true if all rules passed, otherwise it will fail.If the rule evaluates successfully, valid is populated with the rule path, otherwise the rule path is placed in the invalid array.<br><br>Rule structure is as follows:<br><code>[ [path [validation validation ...] "rule_name"] [path [validation ...] "rule_name"] ]<br></code>where path is an array with the index path and validation is a single argument lambda (fn (v) v) that must either return true or false. If true, the validation is considered correct, false for incorrect.  The result of the rule application will be put in the valid array, otherwise the result will be put in invalid.
##### Tags
validation rules form structure
---
### values

#### core
#### Usage
`arg0:* argn:*`
##### Function
Given a container, returns a list containing the values of each supplied argument. Note that for objects, only the values are returned, not the keys. If given multiple values, the returned value is a concatentation of all containers provided in the arguments.
##### Tags
array container object keys elements
---
### warn

#### core
#### Usage
`args0:* argsN:*`
##### AsyncFunction
Prefixes a warning symbol prior to the arguments to the console.  Otherwise the same as console.log.
##### Tags
log warning error signal output notify defclog
---
### when

#### core
#### Usage
`condition:* body:*`
##### Macro
Similar to if, but the body forms are evaluated in an implicit progn, if the condition form or expression is true. The function when will return the last form value.  There is no evaluation of the body if the conditional expression is false.
##### Tags
if condition logic true progn conditional
---
### while

#### core
#### Usage
`test_expression:* body_expression:array`
##### Special
The while operator checks the return value of a test_expression and if the result of the test is true (or a result equivalent to true), it will then evaluate the body expression. If the result is false, then the while loop doesn't evaluate the body_expression and completes.  Once the body expression is evaluated, the test expression will be evaluated again and the cycle will continue, potentially forever, so it is important to be careful to have a means to break out or the execution environment may not ever return.  The body of the while is not a block, so if there are multiple expressions to be evaluated as part of the body expression they must be wrapped in a progn block operator. The break operator can be used to `break out` of the loop in addition to the test expression returning false.<br>There is no return value from a while loop; it should be considered undefined.<br>Example:
```
(let
  ((i 10)
   (count 0))
  (while (> i 0)
    (progn
      (inc count i)
      (dec i)))
  ; note: there is no return value from while
  count)
<- 55
```

##### Tags
flow control loop break for_each
---
### with_each_entry

#### core
#### Usage
`binding_sym:array iteration_form:* body_forms:*`
##### Macro
Given a binding symbol, a form or symbol that resolves to an iteration object with a `next` function, and the body forms to be used with the binding_symbol, will call the binding forms for every value in the iterator, with the binding symbol being set to the next value each time through the loop.<br><br>#### Example <br>
```
(with_each_value (entries)
   (-> request_headers `entries) ;; will return an iterator
   (if (== entries.0 "content-type")
       (= content_type entries.1)))
```
<br><br><br> 
##### Tags
iteration loop iterator entries flow values
---
### with_fs_events

#### core
#### Usage
`event_binding:symbol location:string body:array`
##### Macro
This function sets up a watcher scope for events on a filesystem. The symbol passed to the event_binding is bound to new events that occur at the provided location.  Once an event occurs, the body forms are executed.
##### Tags
file filesystem events io watch
---
### word_wrap

#### core
#### Usage
`text:string ncols:?number`
##### Function
Given a string of text and an optional column length returns an array of lines wrapped at or before the column length.  If no column length is provided, the default is 80.
##### Tags
text string wrap format
---
### words_and_quotes

#### core
#### Usage
`text:string`
##### AsyncFunction
Given a text string, separates the words and quoted words, returning quoted words as their isolated string.
##### Tags
text string split separate parse
---
### yesterday

#### core
#### Usage
``
##### AsyncFunction
This function returns an array with two Date values.  The first, in index 0, is the start of the prior day (yesterday midnight), and the second is 24 hours later, i.e. midnight from last night.
##### Tags
time date range prior hours 24
---
### yield

#### core
#### Usage
`value:*`
##### Special
Note that the yield operator and generator functions aren't official yet and are still requiring development work and testing due to how to structure the emitted code to ensure that the yield is placed within a function* structure vs. a typical function.
##### Tags
generator experimental
---
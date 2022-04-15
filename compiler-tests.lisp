
(defglobal `compiler_tests
[
    [ "true" 
    []
    true
    "primitive compilation: true"
                                        ;`(fn (source opts) (compiler (read_lisp source) opts))
    ]
    [ "false" 
    []
    false
    "primitive compilation: false"
    ]
    [ "nil" 
    []
    null
    "primitive compilation: nil"
    ]
    [ "undefined" 
    []
    undefined
    "primitive compilation: undefined"
    ]
    [ "123" 
    []
    123
    "primitive compilation: positive number"
    ]
    [ "-1" 
    []
    -1
    "primitive compilation: negative number"
    ]
    [ "3.14"
    []
    3.14
    "primitive compilation: floating point"
    ]
    [ "\"Hello\""
    []
    "Hello"
    "primitive compilation: string"
    ]
    ["\"undefined\""
     []
     "undefined"
     "String (double quoted) values - undefined"
     ]
    ["\"null\""
     []
     "null"
     "String (double quoted) values - nil"
     ]
    [ "{}"
    []
    `{}
    "primitive compilation: object"
    ]
    [ "[]"
    []
    `[]
    "primitive compilation: array"
    ]
    [ "(fn ()
           true)"
    []
    true
    "function definition with single statement"
    ]
    ["(quotel \"\\\"Hello\\\" 'world'\")"
     []
     "\"Hello\" 'world'"
     "quote literal: single quote and double quotes"]
    ["(quote \"\\\"Hello\\\" 'world'\")"
     []
     "\"Hello\" 'world'"
     "quote: single quote and double quotes"]
    ["(quotem \"\\\"Hello\\\" 'world'\")"
     []
     "\"Hello\" 'world'"
     "quote macro: single quote and double quotes"]
    ["(quote \"Hello \n world\")"
     []
     "Hello \n world"
     "quoted newline handling"]
    ["(quote \"Hello \r world\")"
     []
     "Hello \r world"
     "quoted carriage-return handling"]
    [ "(fn ()
            (+ 1 2))"
    []
    3
    "function definition with single expression"
    ]
    [ "(+ { `abc: 123 } { `def: 456 })"
    []
    `{"abc":123 "def":456}
    "overloaded add: objects - no key overlap"
    ]
    [ "(+ { `abc: 123 } { `def: 456 } { `abc: 789 })"
    []
    `{"abc":789 "def":456}
    "overloaded add: objects - key overlap precedence"
    ]
    [ "(+ [ 1 2 3] [ 4 5 6 ])"
    []
    `[1 2 3 [ 4 5 6]]
    "overloaded add: array"
    ] 
    [ "(+ \"abc\" \"def\")"
    []
    "abcdef"
    "overloaded add: string"
    ]
    [ "(fn (a b)
            (== a b))"
    [2 2]
    true
    "equality with =="]
    [ "(fn (a b)
            (== a b))"
    [undefined nil]
    false
    "non-equality with == (js ===)"]
    ["(fn (a b)
            (eq a b))"
    [undefined nil]
    true
    "equality with eq (js ==) "]
    ["(fn (a b)
            (eq a b))"
    [nil false]
    false
    "non-equality with eq (js ==) "]
    ["(fn ()
           (or false undefined 1 true))"
    []
    1
    "or - true with 1"]
    ["(fn ()
           (or nil false undefined true))"
    []
    true
    "or - true with nil, false, undefined, true"]
    ["(fn ()
           (or false nil))"
    []
    nil
    "or - false with false and nil"]
    ["(fn ()
           (or false))"
    []
    false
    "or - one argument: false"]
    ["(fn ()
           (and true 1 []))"
    []
    `[]
    "and - true with true, 1 and empty array"]
    ["(fn ()
           (and true false nil))"
    []
    false
    "and - false with true undefined false and nil"]
    ["(fn ()
           (and true))"
    []
    true
    "and - one argument: true"]
    ["(fn ()
           (and nil))"
    []
    nil
    "and - one argument: nil"]
    ["(fn (arg)
           (and 1 true (or false
                           arg)))"
    [true]
    true
    "and,or nested - return true"]
    ["(fn (arg)
           (and 1 true (or false
                           arg)))"
    [false]
    false
    "and,or nested - return false"]
    [ "(fn (a1 a2)
                 (/ (+ a1 a2) 2))"
    [5 10]
    7.5 "nested arithmetic 1"]
    [ "(fn (a1 a2)
                 (* -1 
                    (/ (- a1 a2) 2)
                     4))"
    [4 5]
    2 "nested arithmetic 2"]
    
    ["(fn (a)
           (if (< a 2)
              (- a 1)
              (+ a 1)))"
    [1]
    0
    "if with simple form, simple if true and if false"
    ]
    ["(fn ()
            (do 
              (+ 1 2)))"
    []
    3
    "single statement in block"
    ]
    [ "(fn ()
            (do 
                (+ 4 4)
                (+ 2 2)))"
    []
    4
    "multiple statements in block"
    ]
    [ "(fn ()
            (let
                ((`a 0))
                (inc a)))"
    []
    1
    "increment scoped reference"
    ]
    [ "(fn ()
            (let
                ((`a 0))
                (dec a)))"
    
    []
    -1
    "decrement scoped reference"
    ]
    
    [ "(fn () (eval `(+ 2 2)))"
    []
    4
    "eval back quoted form"
    ]
    [ "(is_array? [])"
    []
    true
    "inline compilation array"
    ]
    [ "(is_object? {})"
    []
    true
    "inline compilation object - true"
    ]
    [ "(is_object? 123)"
    []
    false
    "inline compilation object - false"
    ]
    ["\"block\""
    []
    "block"
    "compilation instruction collision avoidance"
    nil
    "(defglobal block \"block\")"
    ]
    ["(undefine `block)"
    []
    true
    "undefine symbol to valid reference"
    "(defglobal block \"block\")"
    ]
    ["(undefine `block)"
    []
    false
    "undefine symbol to invalid reference"
    ]
    [ "(fn (val)
              (do 
                  (if (< val 0)
                      (do 
                          (log \"this is a negative\")
                          (return (+ \"\" val \" is a negative number.\")))
                      (do 
                          (log \"another item\")
                          (if (> val 0)
                                (return \"positive\"))
                          true))
                  (return \"something else!\")
                  (log \"never here!\")))"
    [-1]
    "-1 is a negative number." "return from block - positive with form"]
    [ "(fn (val)
              (do 
                  (if (< val 0)
                      (do 
                          (log \"this is a negative\")
                          (return (+ \"\" val \" is a negative number.\")))
                      (do 
                          (log \"another item\")
                          (if (> val 0)
                                (return \"positive\"))
                          true))
                  (return \"something else!\")
                  (log \"never here!\")))"
    [1]
    "positive" "return from block - nested if with blocks"]
    [ "(fn (val)
              (do 
                  (if (< val 0)
                      (do 
                          (log \"this is a negative\")
                          (return (+ \"\" val \" is a negative number.\")))
                      (do 
                          (log \"another item\")
                          (if (> val 0)
                                (return \"positive\"))
                          true))
                  (return \"something else!\")
                  (log \"never here!\")))"
    [0]
    "something else!"
    "return from block - default return"]
    [ "(fn (c d)
              (for_each (`a (range c) )
                (for_each (`b (range d))
                        (* a b))))"
    [5 3]
    `((0 0 0) (0 1 2) (0 2 4) (0 3 6) (0 4 8))
    "nested for each looping"]
    [ "(fn (func c target)
             (apply func c target))"
    (list + 1 [2 3 4 5] )
    15 
    "apply with multiple args"
    ]
    [ "(fn ()
           (apply last [[ 1 2 3 4 ]]))"
    []
    4
    "apply to a global function"]
    [ "(apply is_string? [\"hello\"])"
    []
    true
    "apply to an inline function"]
    ["(apply (fn (v)
           (+ v 1))
       [2])"
    []
    3
    "apply an anonymous function"]
    ["(let
    ((x 3))
    (apply 
       (fn (v)
           (+ v 1))
           [x]))"
     []
     4
     "Application of variable to anonymous"]
    ["(let
        ((x 3))
        (apply (cond
                   (>= x 0)
                   (fn (v)
                       (+ v 1))
                   else
                   (fn (v)
                       (- v 1)))
               [x]))"
     []
     4
     "apply to a conditionally returned function"]
    ["(let
        ((x 3))
        (apply 
           (if (> x 0) 
               (fn (v)
                  (+ v 1))
               (fn (v)
                   (- v 1)))
               [x]))"
     []
     4
     "apply to a conditionally returned function (if)"]
    ["(let
        ((x 3))
        (apply 
           (fn (v w)
               (+ v w))
               2 [x]))"
     []
     5
     "Multi argument apply with anonymous function"]
    [ "(fn ()
         (do (defvar `s (new Set))
             (call s `add 1)
             (-> s `add 2)
             (-> s `has 2)))"
    
    []
    true
    "simple call"]
    [ "(fn ()
            (let ((i 1)) 
               i))"
    []
    1
    "let with simple assigment - numeric"]
    [ "(fn ()
            (let ((`i {})) 
               i))"
    []
    `{}
    "let with simple assigment - object literal"]
    [ "(fn ()
            (let ((`i [])) 
               i))"
    []
    `[]
    "let with simple assigment - array literal"]
    
    [ "(fn () (let ((log console.log)) (log \"hello\") (log (sub_type log)) (typeof log))"
    []
    `function
    "let type detection on assignment"
    ]
    
    [ "(fn ()
            (let ((i 0) 
                  (j (+ i 1)))
              j))"
    []
    1
    "let with sequential assignment dependency"]
    [ "(fn ()
            (let ((i 2) 
                  (j (let
                         ((`t (+ i 10)))
                         (if (> t 11)
                             true
                             false))))
                         
              j))"
    []
    true
    "nested lets with if conditions"]
    [ "(fn ()
            (let ((i 2) 
                  (j (let
                         ((`t (+ i 10)))
                         (cond (> t 11)
                             true
                             else
                             false))))
                         
              j))"
    []
    true
    "nested lets with cond"]
    [ "(fn ()
            (let ((i 5)
                  (tfn (fn (v)
                           (if (== v 1)
                               1
                               (* v (tfn (- v 1)))))))
              (tfn i)))"
    []
    120
    "let with recursion"]
   
    [ "(let ((`x 1) (`y 2)) (+ x y))"
    []
    3
    "evaluation of anonymous let block"
    ]
     ["(let ((d1 1) (d1 2)) d1)"
     []
     2
     "Redeclaration of local reference in let"
     ]
    [ "(do (defvar `abc 123) abc)"
    []
    123
    "evaluation of anon block multi forms"
    ]
    [ "(+ 4 4)"
    []
    8
    "evaluation of anon block single form"
    ]
    [ "(fn ()
            (do
                (defvar abc 0)
                (inc abc)))"
    []
    1
    "defvar in local scope"]
    [ "(fn ()
            MAX_SAFE_INTEGER)"
    []
    9007199254740991
    "global scope get"]
    [ "(fn ()
            (do
                (defvar run_tests 0)
                (inc run_tests)))"
    []
    1
    "global scope shadow"]
    [ "(defglobal `test_set1 1000)"
    []
    1000
    "global scope set - simple"
    ]
    [ "(fn ()
            (do
                (defglobal `test_set1 1010)
                test_set1))"
    []
    1010
    "global scope set from inside lambda"
    ]
    [ "(fn (v)
            (do
                (defglobal `test_set2 (fn (val)
                                         (* val 10)))
                (test_set2 v)))"
    [5]
    50
    "global scope set - lambda"
    nil
    "(undefine `test_set2)"
    ]
    [ "(fn (v)
           (inc test_set1 v))"
    [5]
    1015
    "global scope increment - lambda"
    
    ]
    [ "(do
         (defglobal `abc { `abc: 123} )
         (= abc 123)
         abc)"
    []
    123
    "Set a global variable with an assignment operation"]
    [ "(defglobal `sayit 
           (fn (x)
            (if (>= x 0)
                (if (>= x 100)
                    (if (>= x 1000)
                        (do
                            (log \"x is greater or equal to 1000!\")
                            \"x is greater than or equal to 1000!\")
                        (do
                            (log \"x is not greater 1000..but larger than or equal to 100\")
                            \"x is not greater than or equal to 1000..but between 100 and 999\"))
                   \"x is less than or equal to 100 but greater than or equal to 0\")
               \"x is less than 0\")))"
    [1050]
    "x is greater than or equal to 1000!"
    "nested if statements in compiled code - deepest true evaluation"]
    [ "(sayit 300)"
    []
    "x is not greater than or equal to 1000..but between 100 and 999"
    "nested if statements in compiled code - deepest false evaluation"]  
    [ "(sayit 50)"
    []
    "x is less than or equal to 100 but greater than or equal to 0"
    "nested if statements in compiled code - middle false evaluation"]
    [ "(sayit -1)"
    []
    "x is less than 0"
    "nested if statements in compiled code - top false evaluation"]
    ["(do
          (defglobal `po10A
            (fn (x)
                (if (>= x 0)
                    (if (>= x 100)
                        (if (>= x 1000)
                            1000
                            100)
                        0)
                    -100)))
         [(po10A -1) (po10A 10) (po10A 200) (po10A 1020)])"
    []
    `(-100 0 100 1000)
    "Nested simple ifs"]
    
    [ "(fn (a)
              (for_each (`r (range a)) 
                 (do 
                     (if (> r 5)
                         (break))
                     (* r a))))"
    [10]
    `[0 10 20 30 40 50]
    "for_each with break"]
    [ "(fn (f)
              (let
                  ((`i 0))
              (while (< i f)
                 (do 
                     (if (> i 10)
                         (break))
                     (inc i)))
              i))"
    [20]
    11 "while with local inc and break"]
    ["(fn ()
          (for_each (`a [ 0 1 2 3 ])
             a))"
    []
    `[0,1,2,3]
    "for_each with iteration over a literal array"
    ]
    [ "(fn ()
                  (try
                      (throw TypeError \"ERROR MESSAGE\")
                      (catch TypeError (e)
                        (do
                            (log \"Caught IT: \" e)
                            \"ERROR 1\"))
                      (catch Error (e)
                        (do
                            (log \"Caught ERROR IT: \" e)
                            \"ERROR 2\"))))"
    []
    "ERROR 1" "multiple catches on a try - TypeError"]
    [ "(fn ()
                  (try
                      (throw Error \"ERROR MESSAGE\")
                      (catch TypeError (e)
                        (do
                            (log \"Caught IT: \" e)
                            \"ERROR 1\"))
                      (catch Error (e)
                        (do
                            (log \"Caught ERROR IT: \" e)
                            \"ERROR 2\"))))"
    []
    "ERROR 2" "multiple catches on a try - Error"]
    
    [ "(fn ()
              (try
                (let
                  ((`i 5))
                   (while (> i 0)
                      (do
                        (dec i)
                        (try
                            (if (== i 3)
                               (throw Error \"i is 3!\"))
                            (catch SyntaxError (e)
                              (do
                                  (throw Error (+ \"SyntaxError caught: \" e.message))))))))
                (catch Error (`e)
                   (do
                       e.message))))"
    []
    "i is 3!"
    "nested try catch hierarchy - outermost catch"]
    
    
    [ "(fn ()
              (try
                (let
                  ((`i 5))
                   (while (> i 0)
                      (do
                        (dec i)
                        (try
                            (if (== i 3)
                               (throw SyntaxError \"i is 3!\"))
                            (catch SyntaxError (e)
                              (do
                                  (throw Error (+ \"SyntaxError caught: \" e.message))))))))
                (catch Error (`e)
                   (do
                       e.message))))"
    []
    "SyntaxError caught: i is 3!"
    "nested try catch hierarchy - inner catch"]
    
    [ "(fn () (+ \"\" (new Date 2022 2)))"
    []
    "Tue Mar 01 2022 00:00:00 GMT-0500 (Eastern Standard Time)"
    "new with simple arguments"
    ]
    [ "(fn (y) (+ \"\" (new Date (do (+ 1 y))
                               2)))"
    [2019]
    "Sun Mar 01 2020 00:00:00 GMT-0500 (Eastern Standard Time)"
    "new with a complex argument and simple argument."
    ]
    [ "(fn (x)
           (cond
               (> (+ x 50) 100)
               (do 
                  \"condition 1\")
               (< x 0)
               \"condition 2\"
               else
               (do
                   (log \"Condition: else\")
                   \"condition: else\")))"
    [51]
    "condition 1"
    "first condition with a form eval"]
    [ "(fn (x)
           (cond
               (> (+ x 50) 100)
               (do 
                  \"condition 1\")
               (< x 0)
               \"condition 2\"
               else
               (do
                   (log \"Condition: else\")
                   \"condition: else\")))"
    [-1]
    "condition 2"
    "alt condition with a form eval"]
    [ "(fn (x)
           (cond
               (> (+ x 50) 100)
               (do 
                  \"condition 1\")
               (< x 0)
               \"condition 2\"
               else
               (do
                   (log \"Condition: else\")
                   \"condition: else\")))"
    [10]
    "condition: else"
    "final else condition block"]
    [ "(fn (target from to)
                          (cond
                              to
                              (-> target `slice from to)
                              from
                              (-> target `slice from)
                              else
                              (throw SyntaxError \"slice requires 2 or 3 arguments\")))"
    `[ [0 1 2 3 4] 1 3 ]
    `[1 2]
    "cond with compiled throw condition"
    nil
    ]
    [ "(fn (target from to)
                          (cond
                              to
                              (do 
                                  (console.log \"to is:\" to)
                                  (-> target `slice from to))
                              from
                              (do 
                                  (console.log \"from is:\" from)
                                  (-> target `slice from))
                              else
                              (do (throw SyntaxError \"slice requires 2 or 3 arguments\"))))"
    `[ [0 1 2 3 4] 1 4 ]
    `[1 2 3]
    "cond with compiled throw condition in block"
    nil
    ]
    ["(fn ()
            (let
                ((obj {})
                 (`block [\"abc\" 123])
                 (`key (first block))
                 (idx 0))
                (cond
                  (eq nil key)
                  (throw SyntaxError (+ \"blank or nil key: \" key))
                  key
                  (do
                      (inc idx)
                      (set_prop obj
                                key
                                (prop block idx))))
                obj))"
    []
    {`abc:123}
    "cond with throw in first block"
    ]
    [ "(fn (abc)
             { 
               `name: \"Bob\"
               `birthdate: (+ \"\" (new Date 2010 6 1))
               `form: (do
                          (= abc (* abc 10))
                          (+ abc 10))
                      })"
    [10]
    {"name":"Bob" "birthdate":"Thu Jul 01 2010 00:00:00 GMT-0400 (Eastern Daylight Time)" "form":110}
    "object literal with evaluated values"]
    
    [ "(do `(list ,@(1 2 3)))"
    []
    `(list 1 2 3)
    "splice operator"
    ]
    
    [ "(do (quotem (list ,#(+ 1 2 3))))"
    []
    `(list 6)
    "unquotem operations"
    ]
    
    [ "(list 1 2 3 (quote (list 3 4 ,@(5 6) (+ 100 2) `(list 3 1 (quotem 5)))))"
    []
    `(1 2 3 (list 3 4 "=$,@" (5 6) (+ 100 2) (quotem (list 3 1 (quotem 5)))))
    "quote"
    ]
    
    [ "`((,#a b) (unquotem c) ,@d)"
    []
    `[[5 b] [2] 1 2]
    "full compilation of back quote/unquotem operations"
    nil
    "(do
         (defglobal `a 5)
         (defglobal `c 2)
         (defglobal `d (list 1 2)))"
    ]
    [ "`(list ,#(list 1 2))"
    []
    `(list (1 2))
    "quotem operations with ,#"]
    [ "`(list ,@(list 1 2))"
    []
    `(list 1 2)
    "quotem operations with splice operator"]
    [ "(quotem (unquotem true))"
    []
    [true]
    "quotem/unquotem true statement"]
    [ "(fn () (quotem (unquotem true)))"
    []
    [true]
    "quotem/unquotem true statement in function"]
    [ "(quotem (unquotem false))"
    []
    [false]
    "quotem/unquotem true statement in function"]
    [ "(fn () (quotem (unquotem false)))"
    []
    [false]
    "quotem/unquotem false statement in function"]
    [ "(quotem (unquotem (do (console.log \"hello\") true)))"
    []
    [true]
    "quotem/unquotem block"]           
    [ "(eval (eval (eval (fn () (list 1 2 3 (quotem (list 3 4 ,@(5 6) (+ 100 2) `(list 3 1 (quotem 5)))))))))"
    []
    `(1 2 3 (3 4 5 6 102 (3 1 5)))
    
    "quotem/unquotem eval sequence"

    ]
    
    [ "(fn ()
             (let
                ((`x 1)
                 (`y 2)
                 (`source `(+ x y)))
                source))"
    []
    `(+ x y)
    "let returning quoted closure"
    ]
    [ "(fn ()
         (try 
          (let
            ((`x 1)
             (`y 2)
             (`source (eval `(+ x y))))
           source)
           (catch Error (`e)
              (do 
                  e.message))))"
    []
    "FAIL: [EXEC]:compiler returned: lambda->\"compile: unknown reference: x\""
    "let returning quoted closure then eval"
    nil
    "(-> env `set_check_external_env false)"
    ]
    ["(let
     ((`ntree nil)
      (`precompile_function (fn (v)
                                (- v 1))))
                   
       (try
          (= ntree (apply precompile_function [2]))
          (catch Error (`e)
            (do
             e
             ))))"
     []
     1
     "try/catching a return value assignment via apply"]
    [ "(let
         ((`x 1)
          (`y 2)
          (`source (fn () (+ x y))))
         source)"
    []
    3
    "let returning function accessing lexical scope"
    
    ]
    [  "(fn (a1 `& r)
        (do
            [a1 r]))"
    ["Not Inside" "Inside" "the" "array"]
    `["Not Inside" ["Inside" "the" "array"]]
    "function with rest args"]
    [  "(fn (place property value)
               (set_prop place property value))"
    [{} "name" "Bob"]
    `{ `name: "Bob" }
    "Simple set property"]
    [  "(fn ()
            (set_prop {}
                      \"name\" \"Bob\"
                      \"place\" \"Anywhere\"
                      \"age\" 42))"
    []
    `{"name":"Bob" "place":"Anywhere" "age":42}
    "Multiple set property on obj literal"]
    [ "(fn ()
            (set_prop (new Object)
                      \"name\" \"Bob\"
                      \"place\" \"Anywhere\"
                      \"age\" 42))"
    []
    `{"name":"Bob" "place":"Anywhere" "age":42}
    "Multiple set property on newly instantiated object"]
    [ "(fn ()
            (let
                ((`abc { `name: \"Alvin\" }))
                (set_prop abc
                      \"name\" \"Bob\"
                      \"place\" \"Anywhere\"
                      \"age\" 42)))"
    []
    `{"name":"Bob" "place":"Anywhere" "age":42}
    "Multiple set property on obj in scope"]
    
    [  "(fn ()
            (let
                ((`abc { `name: \"Alvin\" }))
                (prop abc `name)))"
    []
    "Alvin"
    "Get property of object"]
    [  "(fn ()
            (let
                ((`abc { `name: \"Alvin\" }))
                abc.name))"
    []
    "Alvin"
    "Get static property of object"]
    [  "(fn ()
            (let
                ((`abc { `name: \"Alvin\" }))
                 (prop abc (+ \"n\" \"ame\"))))"
    []
    "Alvin"
    "Get property of object via expression"]
    
    [  "(fn ()
            (let
                ((`n (new Number 123)))
             (instanceof n Number)))"
    []
    true
    "instanceof simple"]
    [ "(fn ()
            (let
                ((`n (new Number 123))
                 (`s (new String (+ \"abc\" 123))))
                (and (instanceof n Number) (instanceof s String))))"
    []
    true
    "compound instance of"
    ]
    [ "(fn () (and (instanceof {} Object) (instanceof [] Array)))"
    []
    true
    "instanceof object types"
    ]
    [ "(fn () (and (instanceof {} Number) (instanceof [] Array)))"
    []
    false
    "not instanceof"
    ]
    [ "(fn () (let ((a [])) (push a (new Number 123)) (push a (new String (+ \"A\" 123))) a))"
    []
    `(Number String)
    "compile arguments"
    ]
    [ "(fn () [ (typeof \"Alex\") (typeof 123) (typeof false) (typeof {}) (typeof []) ])"
    []
    `["string" "number" "boolean" "object" "object"]
    "typeof"
    ]
    [ "(do
           (defglobal \"when2\"
               (fn (condition `& mbody) 
                       (do
                          `(if ,#condition
                               (do
                                   ,@mbody))))
                {`eval_when:{ `compile_time: true }})
            (describe `when2))"
    []
    `{"type":"AsyncFunction" "location":"global" "eval_when":{"compile_time":true}}
    "register compile time function"
    ]
    [ "(when2 (> 4 0) \"positive number\")"
    []
    "positive number"
    "compile time function - positive"
    ]
    
    [ "(do (defglobal wtest (fn (v) (when2 (> v 0) \"positive\"))) (wtest 3))"
    []
    "positive"
    "lambda ref compile time function - positive"]
    
    [ "(do 
           (defglobal wtest 
               (fn (v) 
                   (let
                       ((a []))
                      (when2 (> v 0) 
                         (inc v)
                         (push a v)
                         a)))) 
           (wtest 3))"
    []
    `[4]
    "lambda ref compile time function - block insertion"]
    [ "(wtest 0)"
    []
    undefined
    "compile time function - neg condition"
    ]

    ["(do
          (defglobal `sp
            (fn (a1 `& r)
                    (do
                        `[,@a1 ,@r])))
          (sp \"A1\" \"B1\" \"B2\" \"B3\")"
     []
     `["A1" "B1" "B2" "B3"]
     "Quoted splice of array with multiple elements into list"
     ]

    ["(let
        ((`let_scope_var 2)
         (`my_lambda (fn (x)
                         (do
                             (= x (* x let_scope_var))
                             (inc let_scope_var)
                             x))))
        [(my_lambda 5) (my_lambda 6) (my_lambda 7)])"
      []
      `[10 18 28]
      "Modification of closure values"
    ]
    ["`(do 
          {
             `this_is_quoted: true
          })"
      []
      `[do {"this_is_quoted":true}]
      "Quoted object integrity"
     ]

    ["(progn (defglobal `abc (make_set [ 1 2 3])) (call abc `has 1))"
    []
    true
    "make_set then call - has item true"
    ]
    ["(progn (defglobal `abc (make_set [ 1 2 3])) (call abc `has 5))"
    []
    false
    "make_set then call - not has item"
    ]
    ["(conj [[1 2 3]] [[4 5 6] [7 8 9]])"
    []
    `[[1 2 3] [4 5 6] [7 8 9]]
    "conj - conjoin nested array"
    ]
    ["(conj [1 2 3] [4 5 6] [7 8 9])"
    []
    `[1 2 3 4 5 6 7 8 9]
    "conj - conjoin array"
    ]
    ["(conj { `abc: 123} { `def: 123} )"
    []
    `({"abc":123} {"def":123})
    "conj - conjoin multiple objects"]
    ["(index_of 3 (list 1 2 3 4 5))"
    []
    2
    "index_of numeric value in array - found"]
    ["(index_of \"Alex\" [\"John\" \"Ralph\" \"Larry\" \"Alex\" \"Alvin\"])"
    []
    3
    "index_of string value in array - found"]
    ["(index_of \"Nope\" [\"John\" \"Ralph\" \"Larry\" \"Alex\" \"Alvin\"])"
    []
    -1
    "index_of value in array - not found"]
    
    ["(do (defglobal `abc [1 2 3 4]) (slice abc 1))"
    []
    [2 3 4]
    "slice - 1 argument"]
    ["(do (defglobal `abc [1 2 3 4]) (slice abc 2 4))"
    []
    [3 4]
    "slice - 2 argument"]
    ["(do (defglobal `abc {\"abc\":123} {\"def\":123}) (delete_prop abc `def) abc)"
    []
    `{ `abc: 123 }
    "validate delete property on object"]
    ["(do (defglobal `abc {\"abc\":123} {\"def\":123}) (delete_prop abc `def))"
    []
    true
    "delete_prop return val true on 1 arg"]
    ["(do (defglobal `abc {\"abc\":123} {\"def\":123} {\"ghi\":456}) (delete_prop abc `def `ghi))"
    []
    `{`abc: 123}
    "delete_prop return val true on 1 arg"]
    
    ["(parseFloat \"3.14159\")"
    []
    3.14159
    "convert from string to float parseFloat"]
    ["(float \"3.14159\")"
    []
    3.14159
    "convert from string to float: float"]
    ["(int \"17\")"
    []
    17
    "convert from string to integer"]
    
    ["[(length [0 1 2 ]) (length \"Hello\") (length nil) (length undefined) (length { `abc: 123 `def: 456}) (length false) (length true)]"
    []
    `[3 5 0 0 2 0 0]
    "length function"]
    ["(resolve_path [`record 0 `name ] { `abc: 123 `record: [{ `def: 456 `name: \"Larry\"}]})"
    []
    "Larry"
    "resolve_path: success"
    ]
    ["(resolve_path [`record 1 `name ] { `abc: 123 `record: [{ `def: 456 `name: \"Larry\"}]})"
    []
    undefined
    "resolve_path: failure"
    ]
    ["(fn () (let ((place [])) (push place 1) (push place 2) (pop place)))"
    []
    2
    "pushes then pop"
    ]
    ["(fn () (let ((place [])) (push place 1) (push place 2) (take place)))"
    []
    1
    "pushes then take"
    ]
    ["(fn () (let ((place [])) (prepend place 1) (prepend place 2) (take place)))"
    []
    2
    "prepends then take"
    ]
    
    ["+invalid_js_chars+"
    []
    "+invalid?"
    "handle invalid js chars global"
    nil
    "(defglobal +invalid_js_chars+ \"+invalid?\")"
    ]
    ["(let
           ((`is_true? (> 3 1))
            (`+text+   \"+hello?\"))
           [is_true? +text+])"
    []
    [true  "+hello?"]
    "handle invalid js chars local scoped"
    ]
    ["(do
         (defvar `is_true (> 3 1))
         (defvar `+text   \"hello?\")
         [is_true +text])"
    []
    [true "hello?"]
    "multiple block and return array"
    ]
    ["(let ((`a 5) (`b (fn (val) (* val 4)))) [true (b a)])"
    []
    [true 20]
    "let block with fn and array return"]
    ["(let ((`a 5) (`b (fn (val) (* val 4)))) { `state: true  `value: (b a)})"
    []
    {`state: true `value: 20 }
    "let block with fn and object return"]
    ["(fn (opts)
         (do 
          (defvar opts (or opts {}))
          opts))"
    []
    {}
    "in-scope arg value redefinition via defvar"]
    ["(fn (opts)
         (let 
            ((opts (or opts {})))
            opts))"
    []
    {}
    "in-scope arg value redefinition via let"]
    ["(fn (opts)
         (let 
            ((opts (or opts {})))
            opts))"
    [{ `testing: true }]
    { `testing: true }
    "in-scope arg value redefinition - use arg vs default"]
    ["(map (fn (x) [(+ x 1) (+ x 2)]) (range 10))"
    []
    `((1 2) (2 3) (3 4) (4 5) (5 6) (6 7) (7 8) (8 9) (9 10) (10 11))
    "function returning array values after ops"]
    ["(let
         ((fact (fn (x)
                    (if (== x 1)
                        1
                        (* x (fact (- x 1)))))))
         (fact 5))"
    []
    120
    "Recursive factorial calculation via let"
    ]
    ["\"(+ 32 2)\""
    []
    "(+ 32 2)"
    "properly handle parenthesis appearing in strings"]
    ["(let ((stop false)) stop)"  
    []
    false
    "Global shadowing with untrue value - false"
    ]
    ["(let ((stop nil)) stop)"  
    []
    nil
    "Global shadowing with untrue value - nil"
    ]
    ["(defglobal `ctest
        (fn (val)
            (let
                ((`text (split_by \"\" val))
                 (`c nil)
                 (`word_acc [])
                 (`acc []))
                (for_each (`pos (range (length text)))
                  (do
                      (= c (prop text pos))
                      (if (== c \" \")
                         (do
                             (push acc (join \"\" word_acc))
                             (= word_acc []))
                         (do
                             (push word_acc c)))
                      (log \"word_acc:\" c)))
                (if (> word_acc.length 0)
                    (push acc (join \"\" word_acc)))
            acc)))"
    ["1234 ABC"]
    `("1234" "ABC")
    "mid block if return suppression"
    ]
    ["[(is_number? (float \"1.23\"))
         (is_number? \"Nope\")
         (is_number? [])
         (is_number? {})
         (is_number? nil)]"
    []
    `[true false false false false]
    "is_number? validation"]
    ["[(is_string? \"Hello\")
         (is_string? [])
         (is_string? 1.234)
         (is_string? nil)
         (is_string? {})]"
    []
    `[true false false false false]
    "is_string? validation"]
    ["[(is_array? [])
         (is_array? \"My String\")
         (is_array? 1.234)
         (is_array? nil)
         (is_array? {})]"
    []
    `[true false false false false]
    "is_array? validation"]
    ["[(is_object? {})
         (is_object? [])
         (is_object? \"My String\")
         (is_object? 1.234)
         (is_object? nil)
         ]"
    []
    `[true true false false false]
    "is_object? validation"]
    ["[(do { `abc: { `def: 100 }})]"
    []
    `[{"abc":{"def":100}}]
    "Block in operator position of args"
    ]
    ["[123 (do true { `abc: { `def: 100 }})]"
    []
    `[123 {"abc":{"def":100}} ]
    "Block in non-operator position of array"]
    ["[(do (if true true false)) 1 2 (fn (v) (+ 1 v)) [ (if true true false) ] (do { `abc: { `def: 100 }}) ]"
    []
    `(true 1 2 lambda (true) {"abc":{"def":100}})
    "Blocks, lambdas and embedded objects and array in array"]
    ["{
        `name:(do
                 (+ \"Two\" \" \" \"Words\"))
        `things: (let
                    ((`m []))
                    (while (< m.length 10)
                       (do
                           (push m m.length)))
                    m)
        `ifblock: (if (> 5 2)
                      (do
                          (* 5 2))
                      false)
        `condblock: (cond
                        (== false true)
                        \"not here\"
                        else
                        \"here\")
         }"
    []
    `{"name":"Two Words" "things":(0 1 2 3 4 5 6 7 8 9) "ifblock":10 "condblock":"here"}
    "Object with values of different block types"]
    ["[ (do
            (+ \"Two\" \" \" \"Words\"))
           (let
              ((`m []))
               (while (< m.length 10)
                   (do
                       (push m m.length)))
                m)
            (if (> 5 2)
              (do
                  (* 5 2))
              false)
           (cond
            (== false true)
            \"not here\"
            else
            \"here\")]"
    []
    `("Two Words" (0 1 2 3 4 5 6 7 8 9) 10 "here")
    "Array with values of different block types"]
    ["(fn (word_acc)
          (let
              ((`word (join \"\" word_acc))
               (`word_as_number (float word)))
              (cond
                  (== \"true\" word)
                  true
                  (== \"false\" word)
                  false
                  (== \":\" word)
                  word
                  (isNaN word_as_number)
                  (do 
                      (if (== word \"=:\")
                          (do 
                              \"=:\")
                          (+ \"=:\" word))) ;; since not in quotes, return a reference 
                  (is_number? word_as_number)
                  word_as_number
                  else
                  (do 
                      (log \"what is this?\" word word_acc)
                      word))))"
    [["A" "B" "C"]]
    (quote ABC)
    "Cond with embedded if"]
    ["(do 
    (defglobal `test_fn
        (fn (meta)
            (let
                ((source_details 
                     (+
                         {
                            `arguments: [ \"a:1\" \"a:2\"]
                            `body: `(do
                                        true)
                         }
                         (if meta meta
                             {}))))
                source_details)))
    (test_fn { `other: \"things\" }))"
     []
     (quote {"arguments":("a:1" "a:2") "body":(do true) "other":"things"})
     "If statement returns appropriately from inner let"
     ]
    ["(progn
          (defglobal `testcall 
              (fn (callable)
                  (do
                      (declare (function callable))
                      (callable 123))))
          (-> testcall `toString))"
     []
     "async function(callable) {;return (callable)(123)}"
     "Optmization by using declare - no ambiguity check" 
    ]
    ["(progn
          (defglobal `testcall 
              (fn (my_arg)
                  (do
                      (declare (array my_arg))
                      (+ my_arg 2))))
          (testcall [12]))
         "
      [2]
     `[12 2]
     "Type declaration to array using declare"]
    ["(defglobal rtest 
        (fn (acc)
          (let
            ((acc (or acc [])))
            (if (< (length acc) 3)
                (rtest (+ acc (length acc)))
                acc))))
      (rtest)"
      []
      `[0 1 2]
      "Correct type determination on overloaded add - array"
      
      ]
   ["(defglobal rtest2 
      (fn (acc)
        (let
            ((acc (or acc 1)))
            (if (< acc 4)
                (rtest2 (+ acc 1))
                acc))))"
    []
    4
    "Correct type determiniation on overloaded add - number"]
   ["(let
      ((blk_counter 0) 
       (blk_name \"test\"))
       
       (= blk_name
          (or (and blk_name
                  (+ blk_name (inc blk_counter)))
              (inc blk_counter)))
        (or blk_name
            blk_counter))"
    []
    "test1"
    "Detection of infix operations in value mod operation w/positive or"]
    ["(let
      ((blk_counter 0) 
       (blk_name nil))
       
       (= blk_name
          (or (and blk_name
                  (+ blk_name (inc blk_counter)))
              (inc blk_counter)))
        (or blk_name
            blk_counter))"
    []
    1
    "Detection of infix operations in value mod operation w/negative or"]
   ["(let
      ((blk_counter 0))
       (inc blk_counter))"
    []
    1
    "Value modification outside of infix_ops"]
  ["(-> (fn ()
        (let
          ((blk_counter 0))
           (inc blk_counter)))
      `toString)"
    []
   "async function() {\n    let blk_counter=0;\n    return blk_counter+=1\n}"
   "Value modification outside of infix_ops - output expression"
     ]
  ["(let
      ((blk_counter 1))
       (> (inc blk_counter) 1))"
    []
    true
    "Comparison operator with embedded value modification compilation - true"
   ]
  ["(let
      ((blk_counter 0))
       (> (inc blk_counter) 1))"
    []
    false
    "Comparison operator with embedded value modification compilation - false"
   ]
  ["{
      \"==\":\"abc\"
    }"
   []
   `{
    "==": "abc"
     }
   "Proper handling non-valid Javascript characters"]
  ["(let
    ((non_valid_js_name? nil)
     (assignment_value 123))
      (= non_valid_js_name? assignment_value)
      non_valid_js_name?)"
    []
    123
    "Handle assignment of non valid js characters in assignment."
   ]
  ["(let
     ((abc { `def: 123 }))
     (declare (optimize (safety 2)))
     abc.def)"
   []
   123
   "Safety level 2 for property accessors" ]
  ["(let
     ((abc { `def: 123 }))
     (declare (optimize (safety 2)))
     abc.fgh)"
   []
   undefined
   "Safety level 2 for property accessors with invalid accessor" ]
  ["(let
    ((acc [])
     (condition true))
    (push acc (if condition
                  \"OK\"
                  \"Nope\"))
    acc)"
   []
   `["OK"]
   "Embedded if block in inline."
            ]
  ["(let
    ((abc [0 1 2 3]))
    (declare (include length first))
    [(first abc) (length abc)])"
   []
   `[0 4]
    "Declare inclusion of function code."
    ]        
        
        
])

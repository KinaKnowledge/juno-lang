
(defun run_tests (test_numbers opts)
    (let
        ((`results nil)
         (`clog nil)       
         (`test_function nil)
         (`tests compiler_tests)  ;; shadow if we slice a certain subset
         (`test_output nil)
         (`tester compiler)
	 (`env Environment)
         (`quiet_mode (if (eq nil opts.quiet_mode)
			  true
			  opts.quiet_mode))
			  
	 (`fail_count 0)
         (`idx -1)
         (`andf (fn (args)
                    (let
                        ((`rval true))
                      (for_each (`a (or args []))
                                (when (not a)
                                  (= rval false)
                                  (break)))
                      rval))))
      
      
     
      
      (cond 
        (and (eq opts nil)
             (is_object? test_numbers))
        (= opts test_numbers)
        (and (is_object? opts)
             (is_array? test_numbers))
        (do 
         (= tests (nth test_numbers tests)))
        (and (not (is_object? test_numbers))
             (is_number? test_numbers))
        (do 
         (= quiet_mode false)
         (= tests (nth [ test_numbers ] tests))))
       
      (if quiet_mode
	(= clog (fn ()
		    true))
	(= clog (defclog {  `color: "blue" } )))
      
       (clog "run_tests" "STARTING TESTS" (-> env `id))
       
         
      (= results
         (for_each (`test tests)
                   (do
                    (defvar `result nil)
                    (= test_output nil)
                    (inc idx)		    
                     (clog "START TEST:      " idx test.3)
                     (clog "TEST EXPRESSION: " idx (or opts.test_code
                                                       (as_lisp test.0)))
                     ;(sleep 0.01)
                     (when (or opts.setup_code test.5)
                       (-> env `evaluate (or opts.setup_code
                                             test.5)))  ;; environmental setup
                     (if test.4
                         (= tester (fn (v)
                                       (-> env `evaluate v)))
                         (= tester 
                                        ;(fn (source)
                                        ;   (-> env `evaluate source nil { `env: env `quiet_mode: true }))))
                            (bind_function env.evaluate env)))
                     (= result (do 
                                (= test_function
                                   (try 
                                    (tester (or opts.test_code test.0) nil { `env: env `quiet_mode: quiet_mode })
                                    (catch Error (`e)
                                           e)))
                                (clog "run_tests: test function:" (sub_type test_function) test_function )
                                 ;(console.log "test_function: " test_function)
                                 (cond 
                                   (and (is_object? test_function)
                                        test_function.message)
                                   
                                   (+ "FAIL: [COMPILE]: " (as_lisp test_function))
                                   (is_function? test_function)
                                   (do 
                                    ;(log "running function: " test.1)
                                    (= test_output
                                     (try
                                      (if (> test.1.length 0) 
                                          (apply test_function test.1)
                                          (test_function))
                                      (catch Error (`e)
                                             e)))
                                     (clog "test output: " test_output))
                                   else  ;; non function - don't try and evaluate it
                                   (do (clog "run_tests: non function returned: " test_function)
                                       (= test_output test_function)))
                                 (clog "TEST OUTPUT:" (sub_type test_function) test_output )
                                 (if (and (is_object? test_output)
                                          test_output.message)
                                     (+ "FAIL: [EXEC]:" (+ "compiler returned: " (as_lisp test_function) "->" (as_lisp test_output.message)))
                                     test_output)))
					;(console.log "run_tests: output: " result)
		     (if (not (== (as_lisp result) (as_lisp test.2)))
			 (inc fail_count))
                    [ idx
                     (or test.3 (as_lisp test.0))
                     (== (as_lisp result) (as_lisp test.2))
                     (as_lisp result)
                     (as_lisp test.2)])))
      (cond
	opts.summary
        (andf (each results `1))
	opts.fails
	(progn
	  (console.log "FAILS: " fail_count)
	  (reduce (`r results)
		    (when (== r.2 false)
		      r)))
            else
	results)))




(defun test_code (test_number)
  (prop (prop compiler_tests test_number) 0))

(defun cc () (do  (console.clear)))


(defun report_tests ()
  (progn
    (defvar results  (run_tests { `quiet_mode: false `fails: true } ))
					;(cc)
    (console.log "")
    (if (== 0 results.length)
	(progn
	  (console.log "%cALL TESTS PASS"  "color: darkgreen")
	  true)
	(progn
	  (console.log "%cFAIL"  "color: red")
	  (console.table results)
	  false))))


	     


(defun watch_tests ()
  (in_background 
   (with_fs_events (ev "./compiler.js")
        (progn
	  (report_tests))
      )))
		       



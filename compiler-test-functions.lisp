;; Compiler Test Functions

;; Import into the Working Environroment for testing

(do
(defun `dlisp_tab (passed_env)
  (let
      ((`result nil)
       (`compiled nil)
       (`view nil)
       (`env passed_env)
       (`lisp_view (div { `style: "height: calc(100% - 10px);" }))
       (`js_code_view (div { `style: "height: calc(100% - 10px);" } ))
       (`js_code_editor
         (controls/code_editor { `parent: js_code_view `javascript_mode: true }))
       (`success false)
       (`lisp_code_editor (controls/code_editor {
                                                `parent: lisp_view
                                                }))
       (`output_view (div { `style: "height: calc(100% - 10px)" } ))
       (`output_editor
         (controls/code_editor {
                               `parent: output_view
                               }))
       (`messages_view (div { `style: "height: calc(100% - 10px)" } "Messages"))
       (`messages_editor
         (controls/code_editor { `parent: messages_view }))
       (`compile_button (button { `class: "MenuButton2" } "Compile"))
       (`evaluate_button (button { `class: "MenuButton2" } "Evaluate"))
       (`evaluate_js_button (button { `class: "MenuButton2" } "Evaluate JS"))
       (`controls [ compile_button  evaluate_button evaluate_js_button ])
       (`control_view (div { `style: "display: flex; margin: 5px;" } 
                           controls))
       
       (`compile (fn (eval_code?)
                     (do
                      ;(set_disabled compile_button evaluate_button evaluate_js_button)
                      (clear_log)
                      (console.clear)
                      
                      (notify "Running")
                       (try
                        (do 
                            (if eval_code?
                                (= result
                                   (-> env `evaluate (-> lisp_code_editor.editor `getValue)
                                       nil
                                       { `error_report: (fn (errors)
                                                            (display_errors errors))
                                         `on_compilation_complete: (fn (compiled_code)
                                                                       (disp_comp_results compiled_code)) }))
                                (= compiled (compiler (-> env `read_lisp (-> lisp_code_editor.editor `getValue))
                                                      { `formatted_output: true `js_out: true })))
                           (disp_comp_results compiled)
                           (-> output_editor.editor `setValue (cond
                                                                  (== result undefined)
                                                                  "[undefined]"
                                                                  (== result nil)
                                                                  "[nil]"
                                                                  (is_function? result)
                                                                  (-> result `toString)
                                                                  else
                                                                  (JSON.stringify result nil 4)))
                           (-> output_editor.editor `gotoLine 0 0))        
                        (catch Error (`e)
                               (do
                                (log (+ "COMPILE ERROR:" e)))))
                       
                       (set_enabled compile_button evaluate_button evaluate_js_button))))
       (`resize_observer
         nil)
       (`display_errors
           (fn (errors)
               (do
                   (-> messages_editor.editor `setValue (JSON.stringify errors nil 4))
                   (-> messages_editor.editor `gotoLine 0 0))))
       (`disp_comp_results
         (fn (compiled)
             (cond
               (and compiled
                    (== compiled.length 2))
               
               (do 
                   (console.log "dlisp_tab: compiled text: " compiled.1)
                   (-> js_code_editor.editor `setValue 
                       compiled.1)
                   (-> js_code_editor.editor `gotoLine 0 0))
               
               compiled
               (do 
                   (console.log "dlisp_tab: compiled text: " compiled)
                   (-> js_code_editor.editor `setValue
                       compiled)
                   (-> js_code_editor.editor `gotoLine 0 0)))))
       (`qview 
         (quad_view [ lisp_view
                    js_code_view
                    messages_view
                    output_view ]
                    { `on_size_adjust: (fn ()
                                           (do
                                            (-> js_code_editor.editor `resize)
                                             (-> lisp_code_editor.editor `resize))) }
                    )))
    (= view
       (div { `style: "height: calc(100% - 10px); overflow: hidden;"}
            control_view
            qview.view))
    
    (-> lisp_code_editor.editor.commands `addCommand
        {
        `name: "exec"
        `bindKey: { `win: "Shift-Enter" `linux: "Shift-Enter" `mac: "Shift-Enter" }
        `exec: compile
        })
    (attach_event_listener compile_button `click
                           compile)
    
    (attach_event_listener evaluate_button `click
                           (fn (e)
                               (compile true)))
    (attach_event_listener evaluate_js_button `click
                           (fn (e)
                               (let
                                   ((`f (new AsyncFunction "Environment" 
                                             (-> js_code_editor.editor `getValue)))
                                    (`result (f env)))
                                   (-> output_editor.editor `setValue (cond
                                                                  (== result undefined)
                                                                  "[undefined]"
                                                                  (== result nil)
                                                                  "[nil]"
                                                                  (is_function? result)
                                                                  (-> result `toString)
                                                                  else
                                                                  (JSON.stringify result nil 4)))  )))    
                                   
                                         
    
    (setTimeout (fn ()
                    (do 
                     (-> qview `set_vertical_position (- window.innerWidth (/ window.innerWidth 2)))
                     (-> qview `set_horizontal_position (- window.innerHeight (/ window.innerHeight 3)) (- window.innerHeight (/ window.innerHeight 2)))))
                
                1000)
    view))

(defun `dlisp_tabs ()
   (do
       (tab ["Dlisp 1" (dlisp_tab)] true)
       (sleep 1)
       (tab ["Dlisp 2" (dlisp_tab)] true)
       (sleep 1)
       (tab ["Dlisp 3" (dlisp_tab)] true)
       (sleep 1)
       (tab ["Dlisp 4" (dlisp_tab)] true)
       (sleep 1)
       (tab ["Dlisp 5" (dlisp_tab)] true)))


                                        ;(show_test_dialog)
(do
 
 (defun `show_test_dialog (test_number)
   (let
       ((`test_detail (or (prop compiler_tests test_number)
                          ["" [] undefined "No Test"]))
        (`result nil)
        (`compiled nil)
        (`setup_code (prop test_detail 5)))
     (dialog_window 
      (let
          ((`view (div { `style: "height: 700px; width: 700px;" } ))
           (`test_output (div { `style: "height: 50px"} "Test Output" ))
           
           (`test_code_view 
             (if setup_code
                 (div { `style: "height: 200px;" } )
                 (div { `style: "height: 200px;" } )))
           (`js_code_view 
             (div { `style: "height: 300px;" } ))
           (`js_code_editor
             (controls/code_editor { `parent: js_code_view `javascript_mode: true }))
           (`setup_code_view 
             (when setup_code
               (div { `style: "margin-top: 4px; height: 50px;" } )))
           (`success false)
           (`test_code_editor (controls/code_editor {
                                                    `parent: test_code_view
                                                    }))
           (`run_test_button (button { `class: "MenuButton2" `style: "background: darkblue; color: white;" } "Run Test"))
           (`compile_button (button { `class: "MenuButton2" } "Compile Only"))
           (`setup_code_editor 
             (when setup_code
               (controls/code_editor {
                                     `parent: setup_code_view
                                     })))
           (`disp_comp_results
             (fn (compiled)
                 (cond
                   (and compiled
                        (== compiled.length 2))
                   
                   (-> js_code_editor.editor `setValue 
                       compiled.1)
                   
                   compiled
                   (-> js_code_editor.editor `setValue
                       (as_lisp compiled)))))
           (`compile (fn (eval_code?)
                         (do
                          (set_disabled compile_button run_test_button)
                          (clear_log)
                           (try
                            (if eval_code?
                                (-> env `evaluate (-> test_code_editor.editor `getValue)
                                    nil
                                    { `on_compilation_complete: (fn (compiled_code)
                                                                    (disp_comp_results compiled_code)) })
                                (= compiled (compiler (read_lisp (-> test_code_editor.editor `getValue))
                                                      { `formatted_output: true `js_out: true })))
                            
                            (catch Error (`e)
                                   (do
                                    (log (+ "COMPILE ERROR:" e)))))
                           (disp_comp_results compiled)
                           (set_enabled compile_button run_test_button)))))
        
        (-> view `append (div { } "Test Code"))
        (-> view `append test_code_view)
        (-> view `append (div { } "Compiled Code"))
        (-> view `append js_code_view)
        
        (-> test_code_editor.editor.commands `addCommand
            {
            `name: "exec"
            `bindKey: { `win: "Shift-Enter" `linux: "Shift-Enter" `mac: "Shift-Enter" }
            `exec: compile
            }) 
        (log "TEST DETAIL: " test_detail)
        (when setup_code
          (-> view `append (div { } "Setup Code"))
          (-> view `append setup_code_view))
        (-> view `append run_test_button)
        (-> view `append compile_button)
        (-> view `append test_output)
        
        (try 
         (do 
          (-> test_code_editor.editor `setValue test_detail.0)
          (when setup_code (-> setup_code_editor.editor `setValue test_detail.5))
           (= success true))
         (catch Error (`e)
                (log (+ "Error: " e))))
        (when (not success)
          (-> test_code_editor.editor `setValue (+ ";; No test found! ??")))
        (-> test_code_editor.session `setUseWrapMode false)      
        (-> test_code_editor.editor `setReadOnly false)
        (when setup_code_editor
          (-> setup_code_editor.editor `setReadOnly false)
          (-> setup_code_editor.session `setUseWrapMode false))
        (attach_event_listener compile_button
                               `click
                               compile)
        (if test_number             
            (attach_event_listener run_test_button
                                   `click
                                   (fn (e)
                                       (do
                                        (set_disabled compile_button run_test_button)
                                        (try
                                         
                                         (= compiled (compiler (read_lisp (-> test_code_editor.editor `getValue))
                                                               { `formatted_output: true `js_out: true }))
                                         
                                         (catch Error (`e)
                                                (do
                                                 (log (+ "COMPILE ERROR:" e)))))
                                         (try
                                          (= result (first (run_tests test_number (+ { `test_code: (-> test_code_editor.editor `getValue) }
                                                                                     (if setup_code
                                                                                         { `setup_code:  (-> setup_code_editor.editor `getValue) }
                                                                                         {})))))
                                          (catch Error (`e)
                                                 (do
                                                  (log (+ "ERROR: " e)))))
                                         (log "COMPILED: " compiled)
                                         (cond
                                           (and compiled
                                                (== compiled.length 2))
                                           (-> js_code_editor.editor `setValue 
                                               compiled.1)
                                           compiled
                                           (-> js_code_editor.editor `setValue
                                               (as_lisp compiled)))
                                         
                                         (log "RESULT: " result)
                                         (set_enabled compile_button run_test_button)
                                         (-> test_output
                                             `replaceChildren
                                             (table { `style: "width: 100%" } 
                                                    (thead
                                                     (th "Pass?") (th "Result") (th "Expected"))
                                                    (tbody
                                                     (tr
                                                      (td result.2)
                                                      (td (as_lisp result.3))
                                                      (td (as_lisp result.4)))))))))
            (attach_event_listener run_test_button
                                   `click
                                   (fn (e)
                                       (do 
                                        (set_disabled compile_button run_test_button)
                                        (compile true)
                                         (set_enabled compile_button run_test_button)))))
        
        
        (setTimeout (fn ()
                        (do 
                         (-> test_code_editor.editor `resize)
                         (-> test_code_editor.editor `moveCursorTo 0 0)
                          (-> test_code_editor.editor `clearSelection))
                        (when setup_code_editor
                          (-> setup_code_editor.editor `resize)
                          (-> setup_code_editor.editor `moveCursorTo 0 0)
                          (-> setup_code_editor.editor `clearSelection)))
                    100)
        view)
      {
      `title: (+ "Test " (or test_number "") ": " test_detail.3)
      `width: 730
      })))
 

(defun `reader_lib ()
    (get_attachment (unpack (first (retrieve { `no_meta: true `index_0: "Compiler-Reader" `type: `Function } )))))
 
 (defun `test_code (test_number)
   (prop (prop compiler_tests test_number) 0))
 (defun `cc () (do (clear_log) (console.clear)))
 (defun `run_tests (test_numbers opts)
    (let
        ((`results nil)
         (`clog (defclog { `background: "black" `color: "white" } ))
         
         (`test_function nil)
         (`tests compiler_tests)  ;; shadow if we slice a certain subset
         (`test_output nil)
         (`tester compiler)
         (`quiet_mode true)
         (`env nil)
         (`idx -1)
         (`andf (fn (args)
                    (let
                        ((`rval true))
                      (for_each (`a (or args []))
                                (when (not a)
                                  (= rval false)
                                  (break)))
                      rval))))
      
      (clear_log)
     
      
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
       (= env
          (cond opts.new_env
                    (make_start_env)
                    opts.env
                    opts.env))
       (when (eq nil env)
             (throw "run_tests: environment is nil"))
       (clog "run_tests" "STARTING TESTS" (-> env `id))
       (when opts.new_env
             (-> env `evaluate (reader_lib))
             (-> env `evaluate "(do 
                            (set_prop Environment 
                                      `read_lisp
                                      reader)
                            (set_prop Environment
                                      `as_lisp
                                      globalThis.lisp_writer))"))
         
      (= results
         (for_each (`test tests)
                   (do
                    (defvar `result nil)
                    (= test_output nil)
                     (inc idx)
                     (clog "START TEST:      " idx test.3)
                     (clog "TEST EXPRESSION: " idx (or opts.test_code
                                                       (as_lisp test.0)))
                     (sleep 0.01)
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
                                 (console.log "test_function: " test_function)
                                 (cond 
                                   (and (is_object? test_function)
                                        test_function.message)
                                   
                                   (+ "FAIL: [COMPILE]: " (as_lisp test_function))
                                   (is_function? test_function)
                                   (do 
                                    (log "running function: " test.1)
                                    (= test_output
                                     (try
                                      (if (> test.1.length 0) 
                                          (apply test_function test.1)
                                          (test_function))
                                      (catch Error (`e)
                                             e)))
                                     (log "test output: " test_output))
                                   else  ;; non function - don't try and evaluate it
                                   (do (log "run_tests: non function returned: " test_function)
                                       (= test_output test_function)))
                                 (clog "TEST OUTPUT:" (sub_type test_function) test_output )
                                 (if (and (is_object? test_output)
                                          test_output.message)
                                     (+ "FAIL: [EXEC]:" (+ "compiler returned: " (as_lisp test_function) "->" (as_lisp test_output.message)))
                                     test_output)))
                     (console.log "run_tests: output: " result)                   
                    [ idx
                     (or test.3 (as_lisp test.0))
                     (== (as_lisp result) (as_lisp test.2))
                     (as_lisp result)
                     (as_lisp test.2)])))
      (cond opts.summary
            (andf (each results `1))
            opts.table
            (controls/table2 results
                                          {
                                          `on_row_click: (fn (value position)
                                                             (show_test_dialog value.0))
                                          `read_only: true
                                          `title: (if (not (== false (andf (each results `2))))
                                                      "PASS"
                                                      "FAIL")
                                          `columns:[
                                          {`name: "Test #" `width: 50 }
                                          {`name: "Test Name" `width: 300 }
                                          {`name: "Pass" `width: 50 }
                                          {`name: "Received"  `width: 200}
                                          {`name: "Expected"  `width: 50} ]
                                          `row_style_callback: (fn (row_data data_offset viewport_row_offset)
                                                                   { `columns: [nil, nil, (if (== row_data.2 true) { `style: "background: #50FF5020;" } { `style: "background: #FF505020;" }) ] })
                                          
                                          })
            else
            results)))
  (defun `tcq (test_num)
    (do 
     (clear_log)
     (display [(test_code test_num)
      (compiler (read_lisp (test_code test_num))) { `only_code: true })]))
  )         


;; reader test
(defun `run_reader_tests ()
  (let
      ((`results [])
       (`reader_output nil)
       (`read_lisp_output nil)
       (`test_result nil)
       (`idx -1)
       (`andf (fn (args)
                    (let
                        ((`rval true))
                      (for_each (`a (or args []))
                                (when (not a)
                                  (= rval false)
                                  (break)))
                      rval))))
    (for_each (`test compiler_tests)
        (do
            (inc idx)
            (log "RUNNING TEST: " test.3 test.0)
            (sleep 0.01)
            (= reader_output (reader test.0))
            (= read_lisp_output (read_lisp test.0))
            (= test_result (== (JSON.stringify reader_output) (JSON.stringify  read_lisp_output)))
            (push results
                  [idx
                   (or test.3 (as_lisp test.0))
                   test_result
                   reader_output
                   read_lisp_output])
            (when (not test_result)
                  (console.log "FAIL TEST:", test reader_output read_lisp_output))))
                  
    
    (render_view (controls/table2 results
                                  {
                                   `on_row_click: (fn (value position)
                                                             (show_test_dialog value.0))
                                   `read_only: true
                                   `title: (if (not (== false (andf (each results `2))))
                                              "PASS"
                                              "FAIL")
                                   `columns:[
                                          {`name: "Test #" `width: 50 }
                                          {`name: "Test Name" `width: 300 }
                                          {`name: "Pass" `width: 50 }
                                          {`name: "Reader"  `width: 200}
                                          {`name: "Read Lisp"  `width: 200} ]
                                   `row_style_callback: (fn (row_data data_offset viewport_row_offset)
                                                           { `columns: [nil, nil, (if (== row_data.2 true) { `style: "background: #50FF5020;" } { `style: "background: #FF505020;" }) ] })
                                   }
                                      
                                   ))))

true)


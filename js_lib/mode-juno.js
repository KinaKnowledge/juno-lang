ace.define("ace/mode/juno_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;



var JunoHighlightRules = function() {

  var builtinFunctions = ('MAX_SAFE_INTEGER LispSyntaxError sub_type __VERBOSITY__ int float values '+
			  'pairs keys take prepend first last length conj reverse map bind to_object '+
			  'to_array slice rest second third chop chomp not push pop list flatten '+
			  'jslambda join lowercase uppercase log split split_by is_object? is_array? '+
			  'is_number? is_function? is_set? is_element? is_string? is_nil? is_regex? '+
			  'is_date? ends_with? starts_with? delete_prop blank? contains? make_set '+
			  'meta_for_symbol describe undefine eval_exp indirect_new range add '+
			  'merge_objects index_of resolve_path min_value max_value interlace trim ' +
			  'assert unquotify or_args special_operators defclog NOT_FOUND ' +
			  'check_external_env_default *namespace* pending_ns_loads pend_load load_pends '+
			  'symbols set_global get_global symbol_definition compile env_log '+
			  'evaluate_local evaluate eval_struct built_ins set_compiler clone *env_config* '+
			  'create_namespace set_namespace delete_namespace namespaces current_namespace '+
			  'eval reader add_escape_encoding get_outside_global as_lisp lisp_writer clone_to_new '+
			  'save_env null defmacro read_lisp desym desym_ref deref when if_compile_time_defined '+
			  'defexternal defun defun_sync macroexpand macroexpand_nq check_type get_object_path '+
			  'do_deferred_splice define defbinding define_env type destructure_list '+
			  'destructuring_bind split_by_recurse reduce bind_function is_reference? scan_str '+
			  'remove_prop object_methods expand_dot_accessor getf_ctx setf_ctx set_path minmax '+
			  'gen_multiples path_multiply splice_in_return_a splice_in_return_b aif ifa '+
			  'map_range range_inc HSV_to_RGB color_for_number flatten_ctx identify_symbols unless '+
			  'use_quoted_initializer random_int resolve_multi_path symbol_tree except_nil each '+
			  'replace cl_encode_string path_to_js_syntax first_is_upper_case? safe_access_2 '+
			  'safe_access compile_to_js evaluate_compiled_source form_structure '+
			  'validate_form_structure *compiler_syntax_rules* compiler_source_chain '+
			  'compiler_syntax_validation describe_all is_value? sort and* or* either is_symbol? '+
			  'get_function_args findpaths warn success in_background show export_symbols '+
			  'register_feature uniq time_in_millis defns use_ns bind_and_call save_locally '+
			  'fetch_text import system_date_format system_date_formatter tzoffset date_components '+
			  'formatted_date *LANGUAGE* dtext nth use_symbols use_unique_symbols compiler '+
			  'read_text_file readline_mod streams repl set_repl repl_config $ $$ $$$ '+
			  'prop set_prop Environment push pop list ');

    var keywords = ('throw try defvar typeof instanceof == < > <= >= eq return yield jslambda cond apply ' +
		    'defglobal do fn if let new function progn javascript catch evaluate eval call -> import '+
		    'dynamic_import quote for_each for_with declare');

    var buildinConstants = ("true false nil");

    var keywordMapper = this.createKeywordMapper({
        "keyword": keywords,
        "constant.language": buildinConstants,
        "support.function": builtinFunctions
    }, "identifier", false, " ");

    this.$rules = {
        "start" : [
            {
                token : "comment",
                regex : ";.*$"
            }, {
                token : "keyword", //parens
                regex : "[\\(|\\)]"
            }, {
                token : "keyword", //lists
                regex : "[\\'\\(]"
            }, {
                token : "keyword", //vectors
                regex : "[\\[|\\]]"
            }, {
                token : "keyword", //sets and maps
                regex : "[\\{|\\}|\\#\\{|\\#\\}]"
            }, {
                    token : "keyword", // ampersands
                    regex : '[\\&]'
            }, {
                    token : "keyword", // metadata
                    regex : '[\\#\\^\\{]'
            }, {
                    token : "keyword", // anonymous fn syntactic sugar
                    regex : '[\\%]'
            }, {
                    token : "keyword", // deref reader macro
                    regex : '[@]'
            }, {
                token : "constant.numeric", // hex
                regex : "0[xX][0-9a-fA-F]+\\b"
            }, {
                token : "constant.numeric", // float
                regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
            }, {
                token : "constant.language",
                regex : '[!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+||=|!=|<=|>=|<>|<|>|!|&&]'
            }, {
                token : keywordMapper,
                regex : "[a-zA-Z_$][a-zA-Z0-9_$\\-]*\\b"
            }, {
                token : "string", // single line
                regex : '"',
                next: "string"
            }, {
                token : "constant", // symbol
                regex : /:[^()\[\]{}'"\^%`,;\s]+/
            }, {
                token : "string.regexp", //Regular Expressions
                regex : '/#"(?:\\.|(?:\\")|[^""\n])*"/g'
            }

        ],
        "string" : [
            {
                token : "constant.language.escape",
                regex : "\\\\.|\\\\$"
            }, {
                token : "string",
                regex : '[^"\\\\]+'
            }, {
                token : "string",
                regex : '"',
                next : "start"
            }
        ]
    };
};

oop.inherits(JunoHighlightRules, TextHighlightRules);

exports.JunoHighlightRules = JunoHighlightRules;
});

ace.define("ace/mode/matching_parens_outdent",["require","exports","module","ace/range"], function(require, exports, module) {
"use strict";

var Range = require("../range").Range;

var MatchingParensOutdent = function() {};

(function() {

    this.checkOutdent = function(line, input) {
        if (! /^\s+$/.test(line))
            return false;

        return /^\s*\)/.test(input);
    };

    this.autoOutdent = function(doc, row) {
        var line = doc.getLine(row);
        var match = line.match(/^(\s*\))/);

        if (!match) return 0;

        var column = match[1].length;
        var openBracePos = doc.findMatchingBracket({row: row, column: column});

        if (!openBracePos || openBracePos.row == row) return 0;

        var indent = this.$getIndent(doc.getLine(openBracePos.row));
        console.log("junomode: autoOutdent: indent: ", indent);
        doc.replace(new Range(row, 0, row, column-1), indent);
    };

    this.$getIndent = function(line) {
      var match = line.match(/^(\s+)/);
      console.log("junomode: getIndent: match: ",match,"line: ",line);
        if (match) {
            return match[1];
        }

        return "";
    };

}).call(MatchingParensOutdent.prototype);

exports.MatchingParensOutdent = MatchingParensOutdent;
});

ace.define("ace/mode/juno",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/juno_highlight_rules","ace/mode/matching_parens_outdent"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var JunoHighlightRules = require("./juno_highlight_rules").JunoHighlightRules;
var MatchingParensOutdent = require("./matching_parens_outdent").MatchingParensOutdent;

var Mode = function() {
    this.HighlightRules = JunoHighlightRules;
    this.$outdent = new MatchingParensOutdent();
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {

    this.lineCommentStart = ";";
    this.minorIndentFunctions = ["defun", "defun-sync", "defmacro", "define", "when", "let", "destructuring_bind", "while","for_each","fn","lambda","progn","do","reduce"];
    this.env = globalThis.env;  /* handle to the Juno environment */
    
    this.$toIndent = function(str) {        
        let rval=str.split('').map(function(ch) {
            if (/\s/.exec(ch)) {
                return ch;
            } else {
                return ' ';
            }
        }).join('');      
      return rval;
    };

    this.$calculateIndent = function(line, tab) {
        var baseIndent = this.$getIndent(line);
        var delta = 0;
        var isParen, ch;
        var currentControl = globalThis.env.get_global("$current_control");
      var formatHandler = currentControl["options"]["format_handler"];
      return "";
      
      if (formatHandler) {
        return formatHandler(line,tab,baseIndent);
      } 
        for (var i = line.length - 1; i >= 0; i--) {
            ch = line[i];
            if (ch === '(') {
                delta--;
                isParen = true;
            } else if (ch === '(' || ch === '[' || ch === '{') {
                delta--;
                isParen = false;
            } else if (ch === ')' || ch === ']' || ch === '}') {
                delta++;
            }
            if (delta < 0) {
                break;
            }
        }
           
      console.log("mode-juno: calculateIndent-> line: ", JSON.stringify(line),"delta: ",delta,"isParen: ",isParen, "baseindent: ", baseIndent, "ibefore: ",i+1);
        if (delta < 0 && isParen) {
            i += 1;
            var iBefore = i;
            var fn = '';
            while (true) {
                ch = line[i];
              if ((ch === ' ' || ch === '\t') || ((ch === undefined) && (this.minorIndentFunctions.indexOf(fn) !== -1)))  {
                    if(this.minorIndentFunctions.indexOf(fn) !== -1) {
                        // return this.$toIndent(line.substring(0, iBefore - 5) + tab);
                      return this.$toIndent(line.substring(0, iBefore) + "  ");		   
                    } else {
                      return this.$toIndent(line.substring(0, iBefore) + fn.length+1);
                    }
                } else if (ch === undefined) {
                    return this.$toIndent(line.substring(0, iBefore - 1) + tab);
                }
                fn += line[i];
                i++;
            }
        } else if(delta < 0 && !isParen) {
            return this.$toIndent(line.substring(0, i+2));
	} else if(delta === 1) {
	    baseIndent = baseIndent.substring(0, baseIndent.length - tab.length);
            return baseIndent;
        } else if(delta > 0) {
          baseIndent = baseIndent.substring(0, baseIndent.length - (tab.length + (delta - 1)));
            return baseIndent;
        } else {
            return baseIndent;
        }
    };

    this.getNextLineIndent = function(state, line, tab) {
        return this.$calculateIndent(line, tab);
    };

    this.checkOutdent = function(state, line, input) {
        return this.$outdent.checkOutdent(line, input);
    };

    this.autoOutdent = function(state, doc, row) {
        this.$outdent.autoOutdent(doc, row);
    };

    this.$id = "ace/mode/juno";
    this.snippetFileId = "ace/snippets/juno";
}).call(Mode.prototype);

exports.Mode = Mode;
});                (function() {
                    ace.require(["ace/mode/juno"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            

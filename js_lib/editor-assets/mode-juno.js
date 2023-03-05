ace.define("ace/mode/juno_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;



var JunoHighlightRules = function() {
  console.log("JunoHighlightrules: called..");
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

    var keywordMapperInternal = this.createKeywordMapper({
        "keyword": keywords,
        "constant.language": buildinConstants,
        "support.function": builtinFunctions
    }, "identifier", false, " ");

  
  var keywordMapper = function(e) {
    //let rval=keywordMapperInternal(e);
    var $keywordMapper = globalThis.env.get_global("keyword_mapper",null);
    if ($keywordMapper) {
      return $keywordMapper(e);
    } else return "identifier"; // just default to an identifier if the keywordMapper isn't available
  }
    this.$rules = {
        "start" : [
            {
                token : "comment",
                regex : ";.*$"
            }, {
                token : keywordMapper,
                regex : "[*a-zA-Z_$][a-zA-Z0-9_$\\-*?]*"
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
            },  {
                token : "constant.numeric", // hex
                regex : "0[xX][0-9a-fA-F]+\\b"
            }, {
                token : "constant.numeric", // float
                regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
            }, /*{
                token : "constant.language",
                regex : '[!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+||=|!=|<=|>=|<>|<|>|!|&&]'
            },*/  {
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

ace.define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"], function(require, exports, module) {
"use strict";

var oop = require("../../lib/oop");
var Range = require("../../range").Range;
var BaseFoldMode = require("./fold_mode").FoldMode;

var FoldMode = exports.FoldMode = function(commentRegex) {
    if (commentRegex) {
        this.foldingStartMarker = new RegExp(
            this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.start)
        );
        this.foldingStopMarker = new RegExp(
            this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.end)
        );
    }
};
oop.inherits(FoldMode, BaseFoldMode);

(function() {
    
    this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/;
    this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/;
    this.singleLineBlockCommentRe= /^\s*(\/\*).*\*\/\s*$/;
    this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/;
    this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/;
    this._getFoldWidgetBase = this.getFoldWidget;
    this.getFoldWidget = function(session, foldStyle, row) {
        var line = session.getLine(row);
    
        if (this.singleLineBlockCommentRe.test(line)) {
            if (!this.startRegionRe.test(line) && !this.tripleStarBlockCommentRe.test(line))
                return "";
        }
    
        var fw = this._getFoldWidgetBase(session, foldStyle, row);
    
        if (!fw && this.startRegionRe.test(line))
            return "start"; // lineCommentRegionStart
    
        return fw;
    };

    this.getFoldWidgetRange = function(session, foldStyle, row, forceMultiline) {
        var line = session.getLine(row);
        
        if (this.startRegionRe.test(line))
            return this.getCommentRegionBlock(session, line, row);
        
        var match = line.match(this.foldingStartMarker);
        if (match) {
            var i = match.index;

            if (match[1])
                return this.openingBracketBlock(session, match[1], row, i);
                
            var range = session.getCommentFoldRange(row, i + match[0].length, 1);
            
            if (range && !range.isMultiLine()) {
                if (forceMultiline) {
                    range = this.getSectionRange(session, row);
                } else if (foldStyle != "all")
                    range = null;
            }
            
            return range;
        }

        if (foldStyle === "markbegin")
            return;

        var match = line.match(this.foldingStopMarker);
        if (match) {
            var i = match.index + match[0].length;

            if (match[1])
                return this.closingBracketBlock(session, match[1], row, i);

            return session.getCommentFoldRange(row, i, -1);
        }
    };
    
    this.getSectionRange = function(session, row) {
        var line = session.getLine(row);
        var startIndent = line.search(/\S/);
        var startRow = row;
        var startColumn = line.length;
        row = row + 1;
        var endRow = row;
        var maxRow = session.getLength();
        while (++row < maxRow) {
            line = session.getLine(row);
            var indent = line.search(/\S/);
            if (indent === -1)
                continue;
            if  (startIndent > indent)
                break;
            var subRange = this.getFoldWidgetRange(session, "all", row);
            
            if (subRange) {
                if (subRange.start.row <= startRow) {
                    break;
                } else if (subRange.isMultiLine()) {
                    row = subRange.end.row;
                } else if (startIndent == indent) {
                    break;
                }
            }
            endRow = row;
        }
        
        return new Range(startRow, startColumn, endRow, session.getLine(endRow).length);
    };
    this.getCommentRegionBlock = function(session, line, row) {
        var startColumn = line.search(/\s*$/);
        var maxRow = session.getLength();
        var startRow = row;
        
        var re = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/;
        var depth = 1;
        while (++row < maxRow) {
            line = session.getLine(row);
            var m = re.exec(line);
            if (!m) continue;
            if (m[1]) depth--;
            else depth++;

            if (!depth) break;
        }

        var endRow = row;
        if (endRow > startRow) {
            return new Range(startRow, startColumn, endRow, line.length);
        }
    };

}).call(FoldMode.prototype);

});


ace.define("ace/mode/juno",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/juno_highlight_rules","ace/mode/matching_parens_outdent","ace/mode/behaviour/cstyle","ace/mode/folding/cstyle"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var JunoHighlightRules = require("./juno_highlight_rules").JunoHighlightRules;
var MatchingParensOutdent = require("./matching_parens_outdent").MatchingParensOutdent;
var CStyleFoldMode = require("./folding/cstyle").FoldMode;

var Mode = function() {
    this.HighlightRules = JunoHighlightRules;
    this.$outdent = new MatchingParensOutdent();
    this.$behaviour = this.$defaultBehaviour;
    this.foldingRules = new CStyleFoldMode();
};
oop.inherits(Mode, TextMode);

(function() {

    this.lineCommentStart = ";";
    this.minorIndentFunctions = ["defun", "defun-sync", "defmacro", "define", "when", "let", "destructuring_bind", "while","for_each","fn","lambda","progn","do","reduce","reduce_sync"];
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

    // Indentation is handled externally in the Lisp 
    this.$calculateIndent = function(line, tab) {
      //var baseIndent = this.$getIndent(line);
      //var delta = 0;
      //var isParen, ch;
      //var currentControl = globalThis.env.get_global("$current_control");
      //var formatHandler = currentControl["options"]["format_handler"];
      return "";
      
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
    // this.snippetFileId = "ace/snippets/juno";
}).call(Mode.prototype);





exports.Mode = Mode;
});                (function() {
                    ace.require(["ace/mode/juno"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            

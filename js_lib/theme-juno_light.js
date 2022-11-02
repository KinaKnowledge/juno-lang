ace.define("ace/theme/juno_light",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = false;
exports.cssClass = "ace-juno_light";
exports.cssText = "\
.ace-juno_light .ace_gutter {\
background: var(--editor-gutter-bg-color);\
color: var(--editor-gutter-color);\
}\
.ace-juno_light .ace_print-margin {\
width: 1px;\
background: var(--editor-bg-color);\
}\
.ace-juno_light {\
background-color: var(--editor-bg-color);\
color: var(--editor-text-color);\
}\
.ace-juno_light .ace_cursor {\
color: var(--editor-cursor-color);\
}\
.ace-juno_light .ace_marker-layer .ace_selection {\
background: var(--editor-selected-bg-color);\
}\
.ace-juno_light.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px var(--editor-bg-color);\
}\
.ace-juno_light .ace_marker-layer .ace_step {\
background: var(--editor-step-bg-color);\
}\
.ace-juno_light .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid var(--matching-paren-outline-color);\
background: var(--matching-paren-color);\
}\
.ace-juno_light .ace_marker-layer .ace_active-line {\
background: var(--editor-active-line-bg)\
}\
.ace-juno_light .ace_gutter-active-line {\
background-color: var(--editor-active-line-gutter-bg-color);\
}\
.ace-juno_light .ace_marker-layer .ace_selected-word {\
border: 1px solid var(--editor-selected-bg-color);\
background: var(--editor-selected-word-bg-color);\
}\
.ace-juno_light .ace_invisible {\
color: var(--editor-invisible-color)\
}\
.ace-juno_light .ace_fold {\
border-color: var(--editor-invisible-color)\
}\
.ace-juno_light .ace_constant{color:var(--editor-constant-color);}\
.ace-juno_light .ace_constant.ace_numeric{color:var(--editor-numeric-color);}\
.ace-juno_light .ace_support{color:var(--editor-support-color);}\
.ace-juno_light .ace_function{color:var(--editor-function-color);}\
.ace-juno_light .ace_asyncfunction{color:var(--editor-asyncfunction-color);}\
.ace-juno_light .ace_constant{color:var(--editor-constant-color);}\
.ace-juno_light .ace_storage{color:var(--editor-storage-color);}\
.ace-juno_light .ace_invalid.ace_illegal{color:var(--editor-illegal-color);\
background-color:var(--editor-illegal-bg-color);}\
.ace-juno_light .ace_invalid.ace_deprecated{text-decoration:underline;\
font-style:italic;\
color:var(--editor-deprecated-color);\
background-color:var(--editor-deprecated-bg-color);}\
.ace-juno_light .ace_string{color:var(--editor-string-color);}\
.ace-juno_light .ace_string.ace_regexp{color:var(--editor-regex-color);\
background-color:var(--editor-regex-bg-color);}\
.ace-juno_light .ace_comment{color:var(--editor-comment-color);\
font-style: italic;}\
.ace-juno_light .ace_variable{var(--editor-variable-color);}\
.ace-juno_light .ace_meta.ace_tag{color:#005273;}\
.ace-juno_light .ace_markup.ace_heading{color:var(--editor-heading-color);\
background-color:var(--editor-heading-bg-color);}\
.ace-juno_light .ace_markup.ace_list{color:var(--editor-list-color);}\
.ace-juno_light .ace_keyword{color:var(--editor-keyword-color);}\
.ace-juno_light .ace_identifier{color:var(--editor-identifier-color);}\
";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
});

(function() {
  ace.require(["ace/theme/juno_light"], function(m) {
    if (typeof module == "object" && typeof exports == "object" && module) {
      module.exports = m;
    }
  });
})();
            

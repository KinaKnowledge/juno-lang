ace.define("ace/theme/ice",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = false;
exports.cssClass = "ace-ice";
exports.cssText = "\
.ace-ice .ace_gutter {\
background: var(--editor-gutter-bg-color);\
color: var(--editor-gutter-color);\
}\
.ace-ice .ace_print-margin {\
width: 1px;\
background: var(--editor-bg-color);\
}\
.ace-ice {\
background-color: var(--editor-bg-color);\
color: var(--editor-text-color);\
}\
.ace-ice .ace_cursor {\
color: var(--editor-cursor-color);\
}\
.ace-ice .ace_marker-layer .ace_selection {\
background: var(--editor-selected-bg-color);\
}\
.ace-ice.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px var(--editor-bg-color);\
}\
.ace-ice .ace_marker-layer .ace_step {\
background: var(--editor-step-bg-color);\
}\
.ace-ice .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid var(--matching-paren-outline-color);\
background: var(--matching-paren-color);\
}\
.ace-ice .ace_marker-layer .ace_active-line {\
background: var(--editor-active-line-bg)\
}\
.ace-ice .ace_gutter-active-line {\
background-color: var(--editor-active-line-gutter-bg-color);\
}\
.ace-ice .ace_marker-layer .ace_selected-word {\
border: 1px solid var(--editor-selected-bg-color);\
background-color: var(--editor-selected-word-bg-color);\
box-shadow: 0px 0px 2px 2px #0000001F;\
}\
.ace-ice .ace_invisible {\
color: var(--editor-invisible-color)\
}\
.ace-ice .ace_fold {\
border-color: var(--editor-invisible-color)\
}\
.ace-ice .ace_constant{color:var(--editor-constant-color);}\
.ace-ice .ace_constant.ace_numeric{color:var(--editor-numeric-color);}\
.ace-ice .ace_support{color:var(--editor-support-color);}\
.ace-ice .ace_function{color:var(--editor-function-color);}\
.ace-ice .ace_asyncfunction{color:var(--editor-asyncfunction-color);}\
.ace-ice .ace_constant{color:var(--editor-constant-color);}\
.ace-ice .ace_storage{color:var(--editor-storage-color);}\
.ace-ice .ace_invalid.ace_illegal{color:var(--editor-illegal-color);\
background-color:var(--editor-illegal-bg-color);}\
.ace-ice .ace_invalid.ace_deprecated{text-decoration:underline;\
font-style:italic;\
color:var(--editor-deprecated-color);\
background-color:var(--editor-deprecated-bg-color);}\
.ace-ice .ace_string{color:var(--editor-string-color);}\
.ace-ice .ace_string.ace_regexp{color:var(--editor-regex-color);\
background-color:var(--editor-regex-bg-color);}\
.ace-ice .ace_comment{color:var(--editor-comment-color);}\
.ace-ice .ace_variable{var(--editor-variable-color);}\
.ace-ice .ace_meta.ace_tag{color:#005273;}\
.ace-ice .ace_markup.ace_heading{color:var(--editor-heading-color);\
background-color:var(--editor-heading-bg-color);}\
.ace-ice .ace_markup.ace_list{color:var(--editor-list-color);}\
.ace-ice .ace_keyword{color:var(--editor-keyword-color);}\
.ace-ice .ace_identifier{color:var(--editor-identifier-color);}\
";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
});

(function() {
  ace.require(["ace/theme/ice"], function(m) {
    if (typeof module == "object" && typeof exports == "object" && module) {
      module.exports = m;
    }
  });
})();
            

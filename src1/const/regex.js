"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayOp = exports.RenderType = exports.ArrayMethod = exports.NodeType = exports.RegexpStr = exports.Attr = exports.pattern_insertion = void 0;
exports.pattern_insertion = /\{\{\s*(\S+)\s*\}\}/; // 插值表达式
exports.Attr = {
    K_MODEL: 'k-model'
};
exports.RegexpStr = {
    brace: /\{\{((?:.|\n)+?)\}\}/,
    forStatement: /([a-z_]+[\w]*)\s+in\s+([a-z_][\w.]+(\[.*\])*)/,
    bracket: /\[['|"]?(\w+)['|"]?\]/,
    isString: /'([^']*)'|"([^\"]*)"/,
    isParams: /^[^"|^'\d]+.*/,
    arithmeticOp: /\*|\+|-\/|\(|\)/g,
    inputElement: /INPUT|TEXTAREA/,
    arrtibuteKey: /k-for|k-model|k-if|k:.*|k-on:(.*)|k-show/,
    kAttribute: /k:(.*)/,
    kOnAttribute: /k-on:(.*)/,
    methodAndParam: /([a-zA-Z\d_]+)\((.*)\)/,
    isTernaryOp: /!.*|!!.*|.+?.+:.+/,
    ternaryOpSplit: /\?|:|\(|\)|!!/,
    isNormalHtmlTag: /html|body|base|head|link|meta|style|title|address|article|aside|footer|header|h1|h2|h3|h4|h5|h6|hgroup|nav|section|div|dd|dl|dt|figcaption|figure|hr|img|li|main|ol|p|pre|ul|a|b|abbr|bdi|bdo|br|cite|code|data|dfn|em|i|kbd|mark|q|rp|rt|rtc|ruby|s|samp|small|span|strong|sub|sup|time|u|var|wbr|area|audio|map|track|video|embed|object|param|source|canvas|script|noscript|del|ins|caption|col|colgroup|table|thead|tbody|td|th|tr|button|datalist|fieldset|form|input|label|legend|meter|optgroup|option|output|progress|select|textarea|details|dialog|menu|menuitem|summary|content|element|shadow|template/i,
    isProps: /:(.*)/
};
exports.NodeType = {
    ELEMENT: 1,
    ATTRIBUTE: 2,
    TEXT: 3,
    COMMENT: 8,
    DOCUMENT: 9
};
exports.ArrayMethod = ['push', 'pop', 'splice', 'shift', 'unshift', 'sort', 'reverse'];
var RenderType;
(function (RenderType) {
    RenderType[RenderType["TEXT"] = 0] = "TEXT";
    RenderType[RenderType["INPUT"] = 1] = "INPUT";
    RenderType[RenderType["TEXTAREA"] = 2] = "TEXTAREA";
    RenderType[RenderType["FOR"] = 3] = "FOR";
    RenderType[RenderType["IF"] = 4] = "IF";
    RenderType[RenderType["ATTRIBUTE"] = 5] = "ATTRIBUTE";
})(RenderType = exports.RenderType || (exports.RenderType = {}));
var ArrayOp;
(function (ArrayOp) {
    ArrayOp[ArrayOp["PUSH"] = 0] = "PUSH";
    ArrayOp[ArrayOp["POP"] = 1] = "POP";
    ArrayOp[ArrayOp["SORT"] = 2] = "SORT";
    ArrayOp[ArrayOp["CHANGE"] = 3] = "CHANGE";
    ArrayOp[ArrayOp["SHIFT"] = 4] = "SHIFT";
})(ArrayOp = exports.ArrayOp || (exports.ArrayOp = {}));

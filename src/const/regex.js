"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegexpStr = void 0;
exports.RegexpStr = {
    insertion: /\{\{\s*(\S+)\s*\}\}/,
    brace: /{{([^{}]+)}}/,
    braceg: /{{([^{}]+)}}/g,
    vOnAttribute: /v-on:([^=]+)/,
    vBindAttribute: /v-bind:([^=]+)/,
    forStatement: /([a-z_]+[\w]*)\s+in\s+([a-z_][\w.]+(\[.*\])*)/,
    bracket: /\[['|"]?(\w+)['|"]?\]/,
    isString: /'([^']*)'|"([^\"]*)"/,
    isParams: /^[^"|^'\d]+.*/,
    arithmeticOp: /\*|\+|-\/|\(|\)/g,
    inputElement: /INPUT|TEXTAREA/,
    methodAndParam: /([a-zA-Z\d_]+)\((.*)\)/,
    isTernaryOp: /!.*|!!.*|.+?.+:.+/,
    ternaryOpSplit: /\?|:|\(|\)|!!/,
    isNormalHtmlTag: /html|body|base|head|link|meta|style|title|address|article|aside|footer|header|h1|h2|h3|h4|h5|h6|hgroup|nav|section|div|dd|dl|dt|figcaption|figure|hr|img|li|main|ol|p|pre|ul|a|b|abbr|bdi|bdo|br|cite|code|data|dfn|em|i|kbd|mark|q|rp|rt|rtc|ruby|s|samp|small|span|strong|sub|sup|time|u|var|wbr|area|audio|map|track|video|embed|object|param|source|canvas|script|noscript|del|ins|caption|col|colgroup|table|thead|tbody|td|th|tr|button|datalist|fieldset|form|input|label|legend|meter|optgroup|option|output|progress|select|textarea|details|dialog|menu|menuitem|summary|content|element|shadow|template/i,
    isProps: /:(.*)/
};

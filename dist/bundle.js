/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _compile)
/* harmony export */ });
/* harmony import */ var _watcher_watcher__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _const_regex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);


function _compile(that) {
    var dom = document.querySelector(that.$el);
    var children = dom.children;
    var self = that;
    var i = 0, j = 0;
    // 更新函数，但observer中model的数据改变的时候，通过Watcher_ts的update调用更新函数，从而更新dom
    var updater = null;
    for (; i < children.length; i++) {
        var node = children[i];
        (function (node) {
            // 解析{{}}里面的内容
            // 保存指令原始内容，不然数据更新时无法完成替换
            var text = node.innerText;
            var matches = text.match(_const_regex__WEBPACK_IMPORTED_MODULE_1__.RegexpStr.braceg);
            if (matches && matches.length > 0) {
                // 保存和node绑定的所有属性
                node.bindingAttributes = [];
                for (j = 0; j < matches.length; j++) {
                    // data某个属性
                    var attr = matches[j].match(_const_regex__WEBPACK_IMPORTED_MODULE_1__.RegexpStr.brace)[1];
                    // 将和该node绑定的data属性保存起来
                    node.bindingAttributes.push(attr);
                    (function (attr) {
                        updater = function () {
                            // 改变的属性值对应的文本进行替换
                            var innerText = text.replace(new RegExp("{{" + attr + "}}", "g"), self.$data[attr]);
                            // 如果该node绑定多个属性 eg:<div>{{title}}{{description}}</div>
                            for (var k = 0; k < node.bindingAttributes.length; k++) {
                                if (node.bindingAttributes[k] !== attr) {
                                    // 恢复原来没改变的属性对应的文本
                                    innerText = innerText.replace("{{" + node.bindingAttributes[k] + "}}", self.$data[node.bindingAttributes[k]]);
                                }
                            }
                            node.innerText = innerText;
                        };
                        self._binding[attr]._texts.push(new _watcher_watcher__WEBPACK_IMPORTED_MODULE_0__["default"](self, attr, updater));
                    })(attr);
                }
            }
            // 解析vue指令
            var attributes = node.getAttributeNames();
            for (j = 0; j < attributes.length; j++) {
                // vue指令
                var attribute = attributes[j];
                // DOM attribute
                var domAttr = null;
                // 绑定的data属性
                var vmDataAttr = node.getAttribute(attribute);
                if (/v-bind:([^=]+)/.test(attribute)) {
                    // 解析v-bind
                    domAttr = RegExp.$1;
                    // 更新函数
                    updater = function (val) {
                        node[domAttr] = val;
                    };
                    // data属性绑定多个watcher
                    self._binding[vmDataAttr]._directives.push(new _watcher_watcher__WEBPACK_IMPORTED_MODULE_0__["default"](self, vmDataAttr, updater));
                }
                else if (attribute === "v-model" && (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA')) {
                    // 解析v-model
                    // 更新函数
                    updater = function (val) {
                        node.value = val;
                    };
                    // data属性绑定多个watcher
                    self._binding[vmDataAttr]._directives.push(new _watcher_watcher__WEBPACK_IMPORTED_MODULE_0__["default"](self, vmDataAttr, updater));
                    // 监听input/textarea的数据变化，同步到model去，实现双向绑定
                    node.addEventListener("input", function (evt) {
                        var $el = evt.currentTarget;
                        self.$data[vmDataAttr] = $el.value;
                    });
                }
                else if (_const_regex__WEBPACK_IMPORTED_MODULE_1__.RegexpStr.vOnAttribute.test(attribute)) {
                    // 解析v-on
                    var event = RegExp.$1;
                    var method = vmDataAttr;
                    node.addEventListener(event, function (evt) {
                        self.$methods[method] && self.$methods[method].call(self, evt);
                    });
                }
            }
        })(node);
    }
}


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Watcher_ts)
/* harmony export */ });
/**
 * Watcher_ts充当订阅者的角色，架起了Observer和Compile的桥梁，Observer监听到数据变化后，
 * 通知Wathcer更新视图(调用Wathcer的update方法)，Watcher_ts再告诉Compile去调用更新函数，
 * 实现dom的更新。同时页面的初始化渲染也交给了Watcher_ts（当然也可以放到Compile进行）。
 * @param {*} vm viewmodel
 * @param {*} attr data的某个属性
 * @param {*} cb 更新函数
 */
class Watcher_ts {
    constructor(vm, attr, cb) {
        this.vm = vm; // viewmodel
        this.attr = attr; // data的属性，一个watcher订阅一个data属性
        this.cb = cb; // 更新函数，在compile那边定义
        this.update();
    }
    // 初始化渲染视图
    update() {
        this.cb(this.vm.$data[this.attr]);
    }
}


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RegexpStr": () => (/* binding */ RegexpStr)
/* harmony export */ });
const RegexpStr = {
    insertion: /\{\{\s*(\S+)\s*\}\}/,
    brace: /{{([^{}]+)}}/,
    braceg: /{{([^{}]+)}}/g,
    vOnAttribute: /v-on:([^=]+)/,
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


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _observer)
/* harmony export */ });
/**
* Observer遍历$data，通过Object.defineProperty的setter的挟持数据改变，监听到数据改变后取出所有该属性对应的订阅者，然后通知更新函数更新视图。
* 注意：这里有循环，且闭包（getter和setter）里面需要依赖循环项（value和key），所以用立即执行函数解决循环项获取不对的问题。
*/
function _observer(data, that) {
    var self = that;
    for (var key in that.$data) {
        if (that.$data.hasOwnProperty(key)) {
            // 初始化属性对应的订阅者容器（数组）
            that._binding[key] = {
                _directives: [],
                _texts: []
            };
            if (typeof that.$data[key] === "object") {
                return that._observer(that.$data[key]);
            }
            var val = data[key];
            // 立即执行函数获取正确的循环项
            (function (value, key) {
                Object.defineProperty(self.$data, key, {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        return value;
                    },
                    set(newval) {
                        if (newval === value) {
                            return;
                        }
                        value = newval;
                        // 监听到数据改变后取出所有该属性对应的订阅者，通知view更新-属性
                        if (self._binding[key]._directives) {
                            self._binding[key]._directives.forEach(function (watcher) {
                                watcher.update();
                            }, self);
                        }
                        // 监听到数据改变后取出所有该属性对应的订阅者，通知view更新-文本
                        if (self._binding[key]._texts) {
                            self._binding[key]._texts.forEach(function (watcher) {
                                watcher.update();
                            }, self);
                        }
                    }
                });
            })(val, key);
        }
    }
}


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _compile_compile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _observer_observer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);


class MVVM {
    // 初始化
    constructor(options) {
        this.$data = options.data;
        this.$methods = options.methods;
        this.$el = options.el;
        // 保存data的每个属性对应的所有watcher
        this._binding = {};
        // 调用observer和compile
        (0,_observer_observer__WEBPACK_IMPORTED_MODULE_1__["default"])(options.data, this);
        (0,_compile_compile__WEBPACK_IMPORTED_MODULE_0__["default"])(this);
        // this.xxx 代理this.$data.xxx
        this.proxyAttribute();
    }
    proxyAttribute() {
        var keys = Object.keys(this.$data);
        var self = this;
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            (function (key) {
                Object.defineProperty(self, key, {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        return self.$data[key];
                    },
                    set: function (newVal) {
                        if (newVal !== self.$data[key]) {
                            self.$data[key] = newVal;
                        }
                    }
                });
            })(key);
        }
    }
}
// @ts-ignore
window.MVVM = MVVM;

})();

/******/ })()
;
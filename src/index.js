"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compile_1 = __importDefault(require("./compile/compile"));
const observer_1 = __importDefault(require("./observer/observer"));
/**
 * MVVM 完成初始化操作，并且调用_observer 和_compile。
 * 对$data进行代理，并通过this.attribute来代理this.$data.attribute
 */
class MVVM {
    // 初始化
    constructor(options) {
        this.$data = options.data;
        this.$methods = options.methods;
        this.$el = options.el;
        // 保存data的每个属性对应的所有watcher 
        // 因为一个属性可能对应多个指令，所以需要一个_binding 属性来存放属性对应的所有订阅者
        // 这样属性一改变，就可以取出所有的订阅者去更新视图。
        this._binding = {};
        // 调用observer和compile
        (0, observer_1.default)(options.data, this);
        (0, compile_1.default)(this);
        // this.xxx 代理this.$data.xxx
        this.proxyAttribute();
    }
    /**
    * 将this.<attr>的调用代理到this.$data.<attr>上，同时this.<attr>的值的改变也会同步到this.$data.<attr上>
    */
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
// 显示初始化window的MVVM对象，防止找不到definition
// @ts-ignore
window.MVVM = MVVM;

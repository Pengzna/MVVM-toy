"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const observe_1 = require("./core/observe");
const complie_1 = require("./core/complie");
class TOY {
    constructor(vm) {
        this.$data = vm.data;
        // 数据劫持
        (0, observe_1.observer)(this.$data);
        // 模板解析
        (0, complie_1.compile)(vm.el, this);
    }
}
function test() {
    console.log(123);
}

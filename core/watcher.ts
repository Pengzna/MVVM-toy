/**
 * Dependency - 收集和通知订阅者
 * 架起Observer和Compile的桥梁，Observer监听到数据变化后，
 * 通知Dependency更新视图，Dependency再告诉Compile去调用更新函数，
 * 实现dom的更新。同时页面的初始化渲染也交给了Dependency（当然也可以放到Compile进行）。
 */
class Dependency {
    subscribers: Array<any>;
    constructor() {
        this.subscribers = [];
    }
    addSub(sub) {
        this.subscribers.push(sub);
    }
    notify() {
        this.subscribers.forEach(sub => {
            sub.update();
        })
    }
}

class Watcher {
    vm: any;
    key: any;
    callback: any;
    constructor(vm, key, callback){
        this.vm = vm;
        this.key = key; // vm对应的属性
        this.callback = callback; // 记录如何更新文本内容的回调函数
    }
    update() {
        this.callback();
    }
}
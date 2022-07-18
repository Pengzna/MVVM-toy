/**
 * Watcher充当订阅者的角色，架起了Observer和Compile的桥梁，Observer监听到数据变化后，
 * 通知Wathcer更新视图(调用Wathcer的update方法)，Watcher再告诉Compile去调用更新函数，
 * 实现dom的更新。同时页面的初始化渲染也交给了Watcher（当然也可以放到Compile进行）。
 * @param {*} vm viewmodel
 * @param {*} attr data的某个属性
 * @param {*} cb 更新函数
 */
 function Dependency(vm, attr, cb) {
    this.vm = vm; // viewmodel
    this.attr = attr; // data的属性，一个watcher订阅一个data属性
    this.cb = cb; // 更新函数，在compile那边定义
    // 初始化渲染视图
    this.update();
  }
  
  Watcher.prototype.update = function() {
    // 通知comile中的更新函数更新dom 
    this.cb(this.vm.$data[this.attr]);
  }
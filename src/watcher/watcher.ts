import Dependency from "../dependency/dependency";
  // 订阅者
  export default class Watcher {
    vm: any;
    key: any;
    callback: any;
    // 需要vue实例上的属性 以获取更新什么数据
    constructor(vm: any, key: any, callback: any) {
      this.vm = vm;
      this.key = key;
      this.callback = callback;
      //临时属性 —— 触发getter 把订阅者实例存储到Dependency实例的subscribers里面
      Dependency.temp = this;
      key.split(".").reduce((total: any, current: string | number) => total[current], vm.$data);
      Dependency.temp = null; // 防止订阅者多次加入到依赖实例数组里
    }
    update() {
      const value = this.key
        .split(".")
        .reduce((total: any, current: string | number) => total[current], this.vm.$data);
      this.callback(value);
    }
  }
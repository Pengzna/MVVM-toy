  //依赖 —— 实现发布-订阅模式 用于存放订阅者和通知订阅者更新
  export default class Dependency {
    static temp: any;
    subscribers: any[];
    constructor() {
      this.subscribers = []; // 用于收集依赖data的订阅者信息
    }
    addSub(sub: any) {
      this.subscribers.push(sub);
    }
    notify() {
      this.subscribers.forEach((sub) => sub.update());
    }
  }
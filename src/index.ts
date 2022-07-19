import _compile from './compile/compile';
import _observer from "./observer/observer";

// import Watcher_ts from "./watcher/watcher";

interface MVVM {
  $data: any;
  $methods: any;
  $el: any;
  _binding: {};
}

class MVVM implements MVVM {
    // 初始化
  constructor(options: any){
    this.$data = options.data;
    this.$methods = options.methods;
    this.$el = options.el;
    // 保存data的每个属性对应的所有watcher
    this._binding  = {};
    // 调用observer和compile
    _observer(options.data, this);
    _compile(this);
    // this.xxx 代理this.$data.xxx
    this.proxyAttribute();
  }

  proxyAttribute() {
    var keys = Object.keys(this.$data);
    var self = this;
    for(var i = 0; i < keys.length; i++) {
      var key = keys[i];
      (function(key) {
        Object.defineProperty(self, key, {
          enumerable: true,
          configurable: true,
          get: function() {
            return self.$data[key];
          },
          set: function(newVal) {
            if(newVal !== self.$data[key]) {
              self.$data[key] = newVal;
            }
          }
        })
      })(key)
    }
  }
}

// @ts-ignore
window.MVVM = MVVM;
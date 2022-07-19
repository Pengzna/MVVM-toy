// // import _compile from './compile/compile';
// // import _observer from "./observer/observer";

// import Watcher_ts from "./watcher/watcher";

// // interface MVVM {
// //   $data: any;
// //   $methods: any;
// //   $el: any;
// //   _binding: {};
// // }

// class MVVM {
//   $data: any;
//   $methods: any;
//   $el: any;
//   _binding: any;
//   // 初始化
//   constructor(options: any){
//     this.$data = options.data;
//     this.$methods = options.methods;
//     this.$el = options.el;
//     // 保存data的每个属性对应的所有watcher
//     this._binding  = {};
//     // 调用observer和compile
//     // _observer(options.data, this);
//     // _compile(this);
//     this._observer(options.data);
//     this._compile();
//     // this.xxx 代理this.$data.xxx
//     this.proxyAttribute();
//   }

//   proxyAttribute() {
//     var keys = Object.keys(this.$data);
//     var self = this;
//     for(var i = 0; i < keys.length; i++) {
//       var key = keys[i];
//       (function(key) {
//         Object.defineProperty(self, key, {
//           enumerable: true,
//           configurable: true,
//           get: function() {
//             return self.$data[key];
//           },
//           set: function(newVal) {
//             if(newVal !== self.$data[key]) {
//               self.$data[key] = newVal;
//             }
//           }
//         })
//       })(key)
//     }
//   }

//   _compile() {
//     var dom = document.querySelector(this.$el);
//     var children = dom.children;
//     var self = this;
//     var i = 0, j = 0;
  
//     // 更新函数，但observer中model的数据改变的时候，通过Watcher_ts的update调用更新函数，从而更新dom
//     var updater = null;
//     for(; i < children.length; i++) {
//       var node = children[i];
//       (function(node) {
//         // 解析{{}}里面的内容
//         // 保存指令原始内容，不然数据更新时无法完成替换
//         var text = node.innerText;
//         var matches = text.match(/{{([^{}]+)}}/g);
//         if(matches && matches.length > 0) {
//           // 保存和node绑定的所有属性
//           node.bindingAttributes = [];
//           for(j = 0; j < matches.length; j++) {
//             // data某个属性
//             var attr = matches[j].match(/{{([^{}]+)}}/)[1];
//             // 将和该node绑定的data属性保存起来
//             node.bindingAttributes.push(attr);
//             (function(attr) {
//               updater = function() {
//                 // 改变的属性值对应的文本进行替换
//                 var innerText = text.replace(new RegExp("{{" + attr + "}}", "g"), self.$data[attr]);
//                 // 如果该node绑定多个属性 eg:<div>{{title}}{{description}}</div>
//                 for(var k = 0; k < node.bindingAttributes.length; k++) {
//                   if(node.bindingAttributes[k] !== attr) {
//                     // 恢复原来没改变的属性对应的文本
//                     innerText = innerText.replace("{{" + node.bindingAttributes[k] + "}}", self.$data[node.bindingAttributes[k]]);
//                   }
//                 }
//                 node.innerText = innerText;
//               };
//               self._binding[attr]._texts.push(new Watcher_ts(self, attr, updater));
//             })(attr);
//           }
//         }
  
//         // 解析vue指令
//         var attributes = node.getAttributeNames();
//         for(j = 0; j < attributes.length; j++) {
//           // vue指令
//           var attribute = attributes[j];
//           // DOM attribute
//           var domAttr: string | any = null;
//           // 绑定的data属性
//           var vmDataAttr = node.getAttribute(attribute);
         
//           if(/v-bind:([^=]+)/.test(attribute)) {
//             // 解析v-bind
//             domAttr = RegExp.$1;
//             // 更新函数
//             updater = function(val: any) {
//               node[domAttr] = val;
//             }
//             // data属性绑定多个watcher
//             self._binding[vmDataAttr]._directives.push(
//               new Watcher_ts(self, vmDataAttr, updater)
//             )
//           } else if(attribute === "v-model" && (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA')) {
//             // 解析v-model
//             // 更新函数
//             updater = function(val: any) {
//               node.value = val;
//             }
//             // data属性绑定多个watcher
//             self._binding[vmDataAttr]._directives.push(
//               new Watcher_ts(self, vmDataAttr, updater)
//             )
//             // 监听input/textarea的数据变化，同步到model去，实现双向绑定
//             node.addEventListener("input", function(evt: any) {
//               var $el = evt.currentTarget;
//               self.$data[vmDataAttr] = $el.value;
//             });
//           } else if(/v-on:([^=]+)/.test(attribute)) {
//             // 解析v-on
//             var event = RegExp.$1;
//             var method = vmDataAttr;
//             node.addEventListener(event, function(evt: any) {
//               self.$methods[method] && self.$methods[method].call(self, evt);
//             });
//           }
//         }
//       })(node);
//     }
//   }

//   _observer(data: any): void {
//     var self = this;
//     for(var key in this.$data) {
//       if (this.$data.hasOwnProperty(key)) {
//         // 初始化属性对应的订阅者容器（数组）
//         this._binding[key] = {
//           _directives: [],
//           _texts: []
//         };
   
//         if(typeof this.$data[key] === "object") {
//           return this._observer(this.$data[key]);
//         }
//         var val = data[key];
//         // 立即执行函数获取正确的循环项
//         (function(value, key) {
//           Object.defineProperty(self.$data, key, {
//             enumerable: true,
//             configurable: true,
//             get: function() {
//               return value;
//             },
//             set(newval) {
//               if(newval === value) {
//                 return;
//               }
//               value = newval;
//               // 监听到数据改变后取出所有该属性对应的订阅者，通知view更新-属性
//               if(self._binding[key]._directives) {
//                 self._binding[key]._directives.forEach(function(watcher: any) {
//                   watcher.update();
//                 }, self);
//               }
//               // 监听到数据改变后取出所有该属性对应的订阅者，通知view更新-文本
//               if(self._binding[key]._texts) {
//                 self._binding[key]._texts.forEach(function(watcher: any) {
//                   watcher.update();
//                 }, self);
//               }
//             }
//           });
//         })(val, key);
//       }
//     }
//    }

// }

// // @ts-ignore
// window.MVVM = MVVM;
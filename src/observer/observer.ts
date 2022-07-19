/**
* Observer遍历$data，通过Object.defineProperty的setter的挟持数据改变，监听到数据改变后取出所有该属性对应的订阅者，然后通知更新函数更新视图。  
* 注意：这里有循环，且闭包（getter和setter）里面需要依赖循环项（value和key），所以用立即执行函数解决循环项获取不对的问题。
*/
export default function _observer(data: any, that: any) {
 var self = that;
 for(var key in that.$data) {
   if (that.$data.hasOwnProperty(key)) {
     // 初始化属性对应的订阅者容器（数组）
     that._binding[key] = {
       _directives: [],
       _texts: []
     };

     if(typeof that.$data[key] === "object") {
       return that._observer(that.$data[key]);
     }
     var val = data[key];
     // 立即执行函数获取正确的循环项
     (function(value, key) {
       Object.defineProperty(self.$data, key, {
         enumerable: true,
         configurable: true,
         get: function() {
           return value;
         },
         set(newval) {
           if(newval === value) {
             return;
           }
           value = newval;
           // 监听到数据改变后取出所有该属性对应的订阅者，通知view更新-属性
           if(self._binding[key]._directives) {
             self._binding[key]._directives.forEach(function(watcher: any) {
               watcher.update();
             }, self);
           }
           // 监听到数据改变后取出所有该属性对应的订阅者，通知view更新-文本
           if(self._binding[key]._texts) {
             self._binding[key]._texts.forEach(function(watcher: any) {
               watcher.update();
             }, self);
           }
         }
       });
     })(val, key);
   }
 }
}
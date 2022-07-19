import Watcher_ts from "../watcher/watcher";
import { RegexpStr } from '../const/regex';

export default function _compile(that: any) {
    var dom = document.querySelector(that.$el);
    var children = dom.children;
    var self = that;
    var i = 0, j = 0;
  
    // 更新函数，但observer中model的数据改变的时候，通过Watcher_ts的update调用更新函数，从而更新dom
    var updater = null;
    for(; i < children.length; i++) {
      var node = children[i];
      (function(node) {
        // 解析{{}}里面的内容
        // 保存指令原始内容，不然数据更新时无法完成替换
        var text = node.innerText;
        var matches = text.match(RegexpStr.braceg);
        if(matches && matches.length > 0) {
          // 保存和node绑定的所有属性
          node.bindingAttributes = [];
          for(j = 0; j < matches.length; j++) {
            // data某个属性
            var attr = matches[j].match(RegexpStr.brace)[1];
            // 将和该node绑定的data属性保存起来
            node.bindingAttributes.push(attr);
            (function(attr) {
              updater = function() {
                // 改变的属性值对应的文本进行替换
                var innerText = text.replace(new RegExp("{{" + attr + "}}", "g"), self.$data[attr]);
                // 如果该node绑定多个属性 eg:<div>{{title}}{{description}}</div>
                for(var k = 0; k < node.bindingAttributes.length; k++) {
                  if(node.bindingAttributes[k] !== attr) {
                    // 恢复原来没改变的属性对应的文本
                    innerText = innerText.replace("{{" + node.bindingAttributes[k] + "}}", self.$data[node.bindingAttributes[k]]);
                  }
                }
                node.innerText = innerText;
              };
              self._binding[attr]._texts.push(new Watcher_ts(self, attr, updater));
            })(attr);
          }
        }
  
        // 解析vue指令
        var attributes = node.getAttributeNames();
        for(j = 0; j < attributes.length; j++) {
          // vue指令
          var attribute = attributes[j];
          // DOM attribute
          var domAttr: string | any = null;
          // 绑定的data属性
          var vmDataAttr = node.getAttribute(attribute);
         
          if(/v-bind:([^=]+)/.test(attribute)) {
            // 解析v-bind
            domAttr = RegExp.$1;
            // 更新函数
            updater = function(val: any) {
              node[domAttr] = val;
            }
            // data属性绑定多个watcher
            self._binding[vmDataAttr]._directives.push(
              new Watcher_ts(self, vmDataAttr, updater)
            )
          } else if(attribute === "v-model" && (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA')) {
            // 解析v-model
            // 更新函数
            updater = function(val: any) {
              node.value = val;
            }
            // data属性绑定多个watcher
            self._binding[vmDataAttr]._directives.push(
              new Watcher_ts(self, vmDataAttr, updater)
            )
            // 监听input/textarea的数据变化，同步到model去，实现双向绑定
            node.addEventListener("input", function(evt: any) {
              var $el = evt.currentTarget;
              self.$data[vmDataAttr] = $el.value;
            });
          } else if(RegexpStr.vOnAttribute.test(attribute)) {
            // 解析v-on
            var event = RegExp.$1;
            var method = vmDataAttr;
            node.addEventListener(event, function(evt: any) {
              self.$methods[method] && self.$methods[method].call(self, evt);
            });
          }
        }
      })(node);
    }
  
  }


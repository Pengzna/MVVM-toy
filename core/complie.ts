import { pattern_insertion } from '../const/regex';

/**
 * @author: Peng Junzhi
 * 2022-07-18
 * 获取页面元素 - 放入临时内存 - 应用Vue数据 - 渲染页面 (虚拟dom)
 * Compile遍历所有的节点，解析指令，为每个节点绑定更新函数，且添加订阅者，当订阅者通知view更新的时候，调用更新函数，实现对视图的更新。  
 * 这里同样需要使用立即执行函数来解决闭包依赖的循环项问题。  
 * 还有一点需要解决的是，如果节点的innerText依赖多个属性的话，如何做到只替换改变属性对应的文本问题。  
 * 比如{{message}}：{{name}}已经被编译解析成“欢迎： 鸣人”，如果message改变为“你好”，怎么让使得“欢迎：鸣人”改为“你好：鸣人”。
 */
export const compile = (element: any, vm: any) => {
    vm.$el = document.querySelector(element);
    const fragment = document.createDocumentFragment();
    let child;
    while (child = vm.$el.firstChild){
        // 此时把原来的元素摘除了
        fragment.append(child);
    }
    console.log(fragment);
    // 解析dom碎片
    fragment_compile(fragment, vm);
    // 把解析后的内容应用到vm的el中
    vm.$el.appendChild(fragment);
}

const fragment_compile = (node: any, vm: any) => {
    /* 1. 插值表达式 {{}} */
    if(node.nodeType === 3) {
        const result_regex = pattern_insertion.exec(node.nodeValue);
        if(result_regex) {
            console.log(`匹配插值表达式成功, 结果: ${result_regex}`);
            if(result_regex) {
                // 链式获取对象里子属性的值
                // 先把字符串转为数组, 方便用reduce方法
                const arr = result_regex[1].split('.');
                const value = arr.reduce(
                    (total, current) => total[current], vm.$data
                )
                console.log(`链式调用取出最终值: ${value}`);
                // 随后用vm里data的值替换插值表达式的文本
                node.nodeValue = node.nodeValue.replace(pattern_insertion, value);
            }
        }
        return;
    }
    node.childNodes.forEach(element => {
        fragment_compile(element, vm);
    });
}

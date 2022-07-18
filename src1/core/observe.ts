import { Dependency } from "./watcher";

/**
 * @author: Peng Junzhi
 * 2022-07-18
 * Observer遍历$data，通过Object.defineProperty的setter的挟持数据改变，监听到数据改变后取出所有该属性对应的订阅者，然后通知更新函数更新视图。  
 * 注意：这里有循环，且闭包（getter和setter）里面需要依赖循环项（value和key），所以用立即执行函数解决循环项获取不对的问题。
 */
export const observer = (data: object) => {
    Object.keys(data).forEach((key) => {
        if(!data || typeof data !== 'object') return;
        const dependency = new Dependency(); // 创建订阅者 - 观察者依赖
        let value: any = data[key as keyof typeof data];
        observer(value);
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get() {
                console.log(`访问: ${key}, 值为: ${key}`);
                // 订阅者加入依赖示例的数组
                Dependency.temp && dependency.addSub(Dependency.temp);
                return value;
            },
            set(newValue: any) {
                console.log(`修改: ${key}, 值为: ${key}`);
                value = newValue;
                // 修改时重新数据劫持
                observer(newValue);
                // 通知订阅者
                dependency.notify();
            }
        })
    })
}
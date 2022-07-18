
/**
 * @author: Peng Junzhi
 * 2022-07-18
 * Observer遍历$data，通过Object.defineProperty的setter的挟持数据改变，监听到数据改变后取出所有该属性对应的订阅者，然后通知更新函数更新视图。  
 * 注意：这里有循环，且闭包（getter和setter）里面需要依赖循环项（value和key），所以用立即执行函数解决循环项获取不对的问题。
 */
export const observer = (data: object) => {
    Object.keys(data).forEach(key => {
        if(!data || typeof data !== 'object') return;
        let value = data[key];
        Observer(value);
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get() {
                console.log(`访问: ${key}, 值为: ${key}`);
                return value;
            },
            set(newValue: any) {
                console.log(`修改: ${key}, 值为: ${key}`);
                value = newValue;
                // 修改时重新数据劫持
                Observer(newValue)
            }
        })
    })
}
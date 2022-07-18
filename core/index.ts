import { observer } from "./observe";
import { compile } from './complie';

class Toy_MVVM {
    $data: any;
    constructor(vm: any){
        this.$data = vm.data;
        // 数据劫持
        observer(this.$data);
        // 模板解析
        compile(vm.el, this);
    }
}


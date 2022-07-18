import { observer } from "./core/observe";
import { compile } from './core/complie';

class TOY {
    $data: any;
    constructor(vm: any){
        this.$data = vm.data;
        // 数据劫持
        observer(this.$data);
        // 模板解析
        compile(vm.el, this);
    }
}

function test(){
    console.log(123)
}


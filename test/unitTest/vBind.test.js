const MVVM = require('../mock')

const vue = new MVVM({
    el: "#app",
    data: {
      message: "测试",
      name: "百度前端",
      id: "1234"
    },
    methods: {
      handleClick: function() {
        alert(this.message + ":" + this.name + ", 点击确定会修改值");
        this.name = '修改了值为此~';
        console.log(document.getElementById(1234))
      }
    }
})

test('1 + 2 = 3', () => {
    expect(sum(1, 2)).toBe(3);
});
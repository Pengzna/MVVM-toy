if (typeof TextEncoder !== 'function') {
    const TextEncodingPolyfill = require('text-encoding');
    window.TextEncoder = TextEncodingPolyfill.TextEncoder;
    window.TextDecoder = TextEncodingPolyfill.TextDecoder;
}
// const fs = require("fs");
// const html = fs.readFileSync("../index.html");
// const page = new JSDOM(html)

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const jsDomIntance = new JSDOM(`
<!DOCTYPE html>
<body>
  <div id="app">
    <input type="text" v-model="name"/>
    <button id="test" v-on:click="handleClick">获取输入值</button>
  </div>
</body>
<script src="../../dist/bundle.js"></script>
<script>
  var vue = new MVVM_mock({
    el: "#app",
    data: {
      message: 'v-on测试'
    },
    methods: {
        handleClick: function() {
          alert(this.message + ":" + this.name + ", 点击确定会修改值");
          this.name = '修改了值为此~';
          console.log(document.getElementById(1234))
        }
      }
  })
</script>
</html>
`, 
  {
    contentType: "text/html",
    // runScripts: "dangerously",
    resources: "usable"
  },
)
const window_mock = jsDomIntance.window; // window 对象
const document = window_mock.document; // document 对象
const value = document.getElementById('test');

test('v-model test', () => {
    expect(value).toBe(document.getElementById('test'));
});
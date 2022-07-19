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
    <div v-bind:id="id">
      v-bind单元测试 - 百度前端大作业2022
    </div>
  </div>
</body>
<script src="../../dist/bundle.js"></script>
<script>
  var vue = new MVVM_mock({
    el: "#app",
    data: {
      id: "1234"
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
const value = document.getElementById('1234');

test('v-bind test', () => {
    expect(value).toBe(document.getElementById('1234'));
});
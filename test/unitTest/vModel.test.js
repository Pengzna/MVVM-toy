import { MVVM } from '../../src/index';

test('v-model test', () => {
  document.body.innerHTML = `
  <div id="app">
    <div v-bind:id="id">{{message}}:{{name}}</div>
    <input type="text" v-model="name"/>
    <button v-on:click="handleClick">获取输入值</button>
  </div>
  `;
  const vue = new MVVM({
    el: "#app",
    data: {
      message: "测试",
      name: "百度前端",
      id: "1234"
    },
  })
  const actualValue = document.getElementsByTagName("input")[0].value;
  expect(vue.name).toBe(actualValue);
  const input = document.getElementsByTagName("input")[0];
  // 触发v-model需要触发事件。
  input.addEventListener('input', function () {
    vue.name = "修改后"
  });
  let inputEvent = new Event('input');
  input.dispatchEvent(inputEvent);
  const modifiedValue = document.getElementsByTagName("input")[0].value
  expect(vue.name).toBe(modifiedValue);
});
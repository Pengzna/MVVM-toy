import { MVVM } from '../../src/index';

test('v-bind test', () => {
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
  const testNode = document.getElementById('1234')
  const actualValue = "{{message}}:{{name}}"
  expect(testNode.textContent).toBe(actualValue);
});

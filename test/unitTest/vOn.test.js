import { MVVM } from '../../src/index';

test('v-on test', () => {
  document.body.innerHTML = `
  <div id="app">
    <div v-bind:id="id">{{message}}:{{name}}</div>
    <input type="text" v-model="name"/>
    <button v-on:click="handleClick" id="bt">获取输入值</button>
  </div>
  `;
  const vue = new MVVM({
    el: "#app",
    data: {
      message: "测试",
      name: "百度前端",
      id: "1234"
    },
    methods: {
      handleClick: function() {
        this.name = '修改了值为此~';
      }
    }
  })
  document.getElementById('bt').click();
  const actualValue = '修改了值为此~'
  expect(vue.name).toBe(actualValue);
});
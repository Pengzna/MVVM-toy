# 彭俊植 百度前端大作业 MVVM 框架

[toc]

# 1. 核心原理

与 MVC 相比，MVVM 包含数据驱动视图更新的机制 & 渲染视图的模板引擎。Vue 即以 MVVM 架构为设计思想，实现了双向绑定等功能。总的来说 MVVM 框架的核心原理如下：

MVVM 基本架构：![image-20220714175940359](https://peng-img.oss-cn-shanghai.aliyuncs.com/markdown-img/image-20220714175940359.png)

## 1.1. 数据劫持

> 通过 js 原生的`Object.defineProperty`方法，可以进行数据劫持。而做数据劫持时主要用到的就是 get 和 set 两个属性。通过该方法，被劫持的对象属性，只要在外界获取或者修改属性值都会触发 get 或 set 方法，这样我们就可以在 get 或 set 中对属性做一些额外对操作。

由此，可以通过数据劫持对数据做一些额外的操作从而实现响应式数据。

## 1.2. 模板编译

> 为什么要模板编译？ 我们知道在 vue 中是通过一些指令或者小胡子语法*(即{{}})*来实现数据绑定的，而浏览器并不认识这些指令或者小胡子语法，因此在页面加载后需要将这些语法转换成真正的数据呈现给用户。

本次大作业中，我以 input 元素和 v-model 指令为例来实现一个简单的模板编译。主要流程如下：

- 遍历#app 下所有的节点，然后根据节点的类型做相应的操作
  - 如果是元素节点，获取该节点中所有的属性（attributes）并遍历看是否有 v-model 指令
    - 如果有 v-model 指令，则根据该指令绑定的属性名（data 中的属性名）获取到对应到值，并赋值给节点的 value 属性
  - 如果是文本节点，则看该文本内容中是否包含小胡子语法
    - 如果有小胡子语法，同样需要解析出小胡子中绑定的属性名（data 中的属性名）并获取到对应到值替换该文本内容
- 遍历完每个节点后再将该节点作为子节点添加到 html 到文档碎片中
- 最后再将整个文档碎片添加到 dom 中 需要说明到是：在 vue 中实现是借助虚拟 dom 实现的，而这里为了简单就借助文档碎片来模拟虚拟 dom 实现，另外为什么一定要用文档碎片，不能直接遍历节点吗？直接遍历也是可以的但是这样一来由于不停的修改节点势必会造成大量的性能消耗，而通过文档碎片在所有节点遍历完成后只需要一次消耗，这样就大大降低了回流重汇带来的性能损耗。

## 1.3. 双向绑定

> 本次大作业主要是利用数据劫持加发布订阅模式来实现数据的双向绑定的。

数据劫持的目的是为了在获取数据或给数据赋值之前对数据做一些额外的操作，那么这些额外的操作其实就是利用发布订阅模式对数据属性进行监控。大概实现思路如下：

- 定义一个 Watcher 类，用于对属性进行监听，并实现属性值的同步更新
- 在模板编译的时候，通过 watcher 来监听属性
- 在数据劫持的 get 函数中进行依赖收集
- 在数据劫持的 set 函数中通知各个 watcher 进行数据更新

# 2. 代码架构

```
MVVM
│
├─ src
│  ├─ compile
│  │  └─ compile.ts // compile模块
│  ├─ const
│  │  └─ regex.ts // 正则表达式枚举
│  ├─ observer
│  │  └─ observer.ts // observer模块
│  ├─ watcher
│  │  └─ watcher.ts // wather类
│  └─ index.ts // 主入口文件
├─ test
│  ├─ unitTest // 单元测试文件
│  │  ├─ vBind.test.js
│  │  ├─ vModel.test.js
│  │  └─ vOn.test.js
│  ├─ index.html // 集成测试html
│  └─ mock.js // mock
├─ .gitignore
├─ package-lock.json
├─ package.json
├─ README.md
├─ tsconfig.json
└─ webpack.config.js

```

## 2.1. MVVM

入口文件，在这里对 vue 当中的`$el、$methods、$data`进行初始化，调用 `observer` 遍历`$data`的数据并进行挟持，调用`compile`遍历`$el`下的所有节点，解析之类和取值操作`({{}})`。遍历`$data`的数据，通过`Object.defineProperty`的`getter`和`setter`实现对`$data` 的代理。

## 2.2. Observer

遍历 `$data`，通过 `Object.defineProperty` 设置 `getter` 和 `setter`，在 `setter` 知道数据发生了改变，然后通知 `Wacher` 去更新 `view`。

## 2.3. Compile

遍历`$el` 下的所有节点，解析指令和取值操作等，为每个节点绑定更新函数（在这里），绑定事件和 `method` 的关系，同时也添加订阅者，当接受到视图更新的订阅消息后，调用更新函数，实现视图更新。同时在添加订阅者的时候，初始化渲染视图。

## 2.4. Watcher

`Watcher` 作为订阅者，充当 `Observer` 和 `Compile` 的中间桥梁，包含 `update` 方法，`update` 方法调用 `Compile` 中绑定的事件更新函数，实现对视图的初始化和更新操作。

# 3. 实例

> 实现功能：
>
> - v-on（事件绑定）
> - v-bind（单向绑定）
> - v-model（双向绑定）
> - 小胡子语法（插值表达式{{}}，双向绑定）

## 3.1. HTML

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>
  <body>
    <div id="app">
      <div v-bind:id="id">{{message}}:{{name}}</div>
      <input type="text" v-model="name" />
      <button v-on:click="handleClick">获取输入值</button>
    </div>
  </body>
  <script src="../dist/bundle.js"></script>
  <script>
    var vue = new MVVM({
      el: '#app',
      data: {
        message: '测试',
        name: '百度前端',
        id: '1234',
      },
      methods: {
        handleClick: function () {
          alert(this.message + ':' + this.name + ', 点击确定会修改值')
          this.name = '修改了值为此~'
          console.log(document.getElementById(1234))
        },
      },
    })
  </script>
</html>
```

## 3.2. 效果展示

**_v-model_**![image-20220719232943560](https://peng-img.oss-cn-shanghai.aliyuncs.com/markdown-img/image-20220719232943560.png)

**_v-on / v-bind_**![image-20220719232957753](https://peng-img.oss-cn-shanghai.aliyuncs.com/markdown-img/image-20220719232957753.png)

# 4. 单元测试

> 考虑到我编写的都是类，在`MVVM`类构造的时候即调用所有模块，进行绑定、注册、监听、订阅等工作。因此选择构造 dom 对 v-on（事件绑定）、v-model（双向绑定）、v-bind（数据单向绑定）进行测试

## 4.1. 测试配置

- 测试工具：`"jest": "^28.1.3"`
- 测试环境：`"node.js": "^v16.13.2"`

- `package.json`配置

  - ```json
    {
      "dependencies": {
        "http": "^0.0.1-security",
        "jest-environment-jsdom": "^28.1.3",
        "jsdom": "^20.0.0",
        "text-encoding": "^0.7.0"
      },
      "name": "mvvm",
      "description": "简易的MVVM框架，用typescript实现",
      "version": "1.0.0",
      "main": "index.js",
      "directories": {
        "test": "test"
      },
      "devDependencies": {
        "@babel/core": "^7.18.9",
        "@babel/preset-env": "^7.18.9",
        "@babel/preset-typescript": "^7.18.6",
        "@types/chai": "^4.3.1",
        "@types/jest": "^28.1.6",
        "@types/mocha": "^9.1.1",
        "babel-jest": "^28.1.3",
        "chai": "^4.3.6",
        "jest": "^28.1.3",
        "mocha": "^10.0.0",
        "ts-loader": "^9.3.1",
        "ts-node": "^10.9.1",
        "typescript": "^4.7.4",
        "webpack": "^5.73.0",
        "webpack-cli": "^4.10.0"
      },
      "scripts": {
        "test": "jest",
        "build": "webpack",
        "coverage": "jest --coverage"
      },
      "repository": {
        "type": "git",
        "url": "git+https://github.com/Pengzna/MVVM-toy.git"
      },
      "keywords": [],
      "author": "",
      "license": "ISC",
      "bugs": {
        "url": "https://github.com/Pengzna/MVVM-toy/issues"
      },
      "homepage": "https://github.com/Pengzna/MVVM-toy#readme"
    }
    ```

- `jest.config.js`配置

  - ```js
    module.exports = {
      transform: {
        '^.+\\.js$': 'babel-jest',
      },
      testEnvironment: 'jsdom',
    }
    ```

## 4.2. 测试代码

### 4.2.1. vBind.test.js

```js
import { MVVM } from '../../src/index'

test('v-bind test', () => {
  document.body.innerHTML = `
  <div id="app">
    <div v-bind:id="id">{{message}}:{{name}}</div>
    <input type="text" v-model="name"/>
    <button v-on:click="handleClick">获取输入值</button>
  </div>
  `
  const vue = new MVVM({
    el: '#app',
    data: {
      message: '测试',
      name: '百度前端',
      id: '1234',
    },
  })
  const testNode = document.getElementById('1234')
  const actualValue = '{{message}}:{{name}}'
  expect(testNode.textContent).toBe(actualValue)
})
```

### 4.2.2. vModel.test.js

```js
import { MVVM } from '../../src/index'

test('v-model test', () => {
  document.body.innerHTML = `
  <div id="app">
    <div v-bind:id="id">{{message}}:{{name}}</div>
    <input type="text" v-model="name"/>
    <button v-on:click="handleClick">获取输入值</button>
  </div>
  `
  const vue = new MVVM({
    el: '#app',
    data: {
      message: '测试',
      name: '百度前端',
      id: '1234',
    },
  })
  const actualValue = document.getElementsByTagName('input')[0].value
  expect(vue.name).toBe(actualValue)
  const input = document.getElementsByTagName('input')[0]
  // 触发v-model需要触发事件。
  input.addEventListener('input', function () {
    vue.name = '修改后'
  })
  let inputEvent = new Event('input')
  input.dispatchEvent(inputEvent)
  const modifiedValue = document.getElementsByTagName('input')[0].value
  expect(vue.name).toBe(modifiedValue)
})
```

### 4.2.3. vOn.test.js

```js
import { MVVM } from '../../src/index'

test('v-on test', () => {
  document.body.innerHTML = `
  <div id="app">
    <div v-bind:id="id">{{message}}:{{name}}</div>
    <input type="text" v-model="name"/>
    <button v-on:click="handleClick" id="bt">获取输入值</button>
  </div>
  `
  const vue = new MVVM({
    el: '#app',
    data: {
      message: '测试',
      name: '百度前端',
      id: '1234',
    },
    methods: {
      handleClick: function () {
        this.name = '修改了值为此~'
      },
    },
  })
  document.getElementById('bt').click()
  const actualValue = '修改了值为此~'
  expect(vue.name).toBe(actualValue)
})
```

## 4.3. 测试结果

![image-20220720123743581](https://peng-img.oss-cn-shanghai.aliyuncs.com/markdown-img/image-20220720123743581.png)

## 4.4. 测试覆盖率

![image-20220722113152793](https://peng-img.oss-cn-shanghai.aliyuncs.com/markdown-img/image-20220722113152793.png)

![image-20220722113218413](https://peng-img.oss-cn-shanghai.aliyuncs.com/markdown-img/image-20220722113218413.png)

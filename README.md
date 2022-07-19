# 彭俊植 百度前端大作业MVVM框架

[toc]

# 1. 核心原理

与 MVC 相比，MVVM 包含数据驱动视图更新的机制 & 渲染视图的模板引擎。Vue 即以 MVVM 架构为设计思想，实现了双向绑定等功能。总的来说 MVVM 框架的核心原理如下：

MVVM 基本架构：![image-20220714175940359](https://peng-img.oss-cn-shanghai.aliyuncs.com/markdown-img/image-20220714175940359.png)

## 1.1. 数据劫持

> 通过js原生的`Object.defineProperty`方法，可以进行数据劫持。而做数据劫持时主要用到的就是get和set两个属性。通过该方法，被劫持的对象属性，只要在外界获取或者修改属性值都会触发get或set方法，这样我们就可以在get或set中对属性做一些额外对操作。

由此，可以通过数据劫持对数据做一些额外的操作从而实现响应式数据。

## 1.2. 模板编译

> 为什么要模板编译？ 我们知道在 vue 中是通过一些指令或者小胡子语法*(即{{}})*来实现数据绑定的，而浏览器并不认识这些指令或者小胡子语法，因此在页面加载后需要将这些语法转换成真正的数据呈现给用户。

本次大作业中，我以input元素和v-model指令为例来实现一个简单的模板编译。主要流程如下：

 - 遍历#app下所有的节点，然后根据节点的类型做相应的操作
   - 如果是元素节点，获取该节点中所有的属性（attributes）并遍历看是否有v-model指令
     - 如果有v-model指令，则根据该指令绑定的属性名（data中的属性名）获取到对应到值，并赋值给节点的value属性
   - 如果是文本节点，则看该文本内容中是否包含小胡子语法
     - 如果有小胡子语法，同样需要解析出小胡子中绑定的属性名（data中的属性名）并获取到对应到值替换该文本内容
 - 遍历完每个节点后再将该节点作为子节点添加到html到文档碎片中
 - 最后再将整个文档碎片添加到dom中 需要说明到是：在vue中实现是借助虚拟dom实现的，而这里为了简单就借助文档碎片来模拟虚拟dom实现，另外为什么一定要用文档碎片，不能直接遍历节点吗？直接遍历也是可以的但是这样一来由于不停的修改节点势必会造成大量的性能消耗，而通过文档碎片在所有节点遍历完成后只需要一次消耗，这样就大大降低了回流重汇带来的性能损耗。

## 1.3. 双向绑定

> 本次大作业主要是利用数据劫持加发布订阅模式来实现数据的双向绑定的。

数据劫持的目的是为了在获取数据或给数据赋值之前对数据做一些额外的操作，那么这些额外的操作其实就是利用发布订阅模式对数据属性进行监控。大概实现思路如下：

- 定义一个Watcher类，用于对属性进行监听，并实现属性值的同步更新
- 在模板编译的时候，通过watcher来监听属性
- 在数据劫持的get函数中进行依赖收集
- 在数据劫持的set函数中通知各个watcher进行数据更新

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
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <div id="app">
    <div v-bind:id="id">
      {{message}}:{{name}}
    </div>
    <input type="text" v-model="name"/>
    <button v-on:click="handleClick">获取输入值</button>
  </div>
</body>
<script src="../dist/bundle.js"></script>
<script>
  var vue = new MVVM({
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
</script>
</html>
```

## 3.2. 效果展示

***v-model***![image-20220719232943560](https://peng-img.oss-cn-shanghai.aliyuncs.com/markdown-img/image-20220719232943560.png)

***v-on / v-bind***![image-20220719232957753](https://peng-img.oss-cn-shanghai.aliyuncs.com/markdown-img/image-20220719232957753.png)

# 4. 单元测试

> 考虑到我编写的都是类，在`MVVM`类构造的时候即调用所有模块，进行绑定、注册、监听、订阅等工作。因此选择构造dom对v-on（事件绑定）、v-model（双向绑定）、v-bind（数据单向绑定）进行测试

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
          '^.+\\.js$': 'babel-jest'
        },
        testEnvironment: 'jsdom'
    }
    ```

## 4.2. 测试代码

### 4.2.1. vBind.test.js

```js
if (typeof TextEncoder !== 'function') {
    const TextEncodingPolyfill = require('text-encoding');
    window.TextEncoder = TextEncodingPolyfill.TextEncoder;
    window.TextDecoder = TextEncodingPolyfill.TextDecoder;
}

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
```

### 4.2.2. vModel.test.js

```js
if (typeof TextEncoder !== 'function') {
    const TextEncodingPolyfill = require('text-encoding');
    window.TextEncoder = TextEncodingPolyfill.TextEncoder;
    window.TextDecoder = TextEncodingPolyfill.TextDecoder;
}

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const jsDomIntance = new JSDOM(`
<!DOCTYPE html>
<body>
  <div id="app">
    <div id="test">
        {{message}}
    </div>
    <input type="text" v-model="message"/>
  </div>
</body>
<script src="../../dist/bundle.js"></script>
<script>
  var vue = new MVVM_mock({
    el: "#app",
    data: {
      message: 'v-model测试'
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
const value = document.getElementById('test').textContent;

test('v-model test', () => {
    expect(value).toBe(document.getElementById('test').textContent);
});
```

### 4.2.3. vOn.test.js

```js
if (typeof TextEncoder !== 'function') {
    const TextEncodingPolyfill = require('text-encoding');
    window.TextEncoder = TextEncodingPolyfill.TextEncoder;
    window.TextDecoder = TextEncodingPolyfill.TextDecoder;
}

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
```

## 4.3. 测试结果

![image-20220719234125452](https://peng-img.oss-cn-shanghai.aliyuncs.com/markdown-img/image-20220719234125452.png)

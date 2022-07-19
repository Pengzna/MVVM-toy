const path = require('path')
module.exports = {
  resolve: {
    extensions: ['.ts', '.js', '.json', '.wasm']
  },
  mode: 'none',
  entry: path.resolve(__dirname, './src/index.ts'), // 指定入口文件
  output: {
    path: path.resolve(__dirname, 'dist'), // 指定打包文件的目录
    filename: 'bundle.js' // 打包后文件的名称
  },
  // 指定webpack打包时要使用的模块
  module: {
    // 指定loader加载的规则
    rules: [
      {
          test: /\.ts$/,
          loader: 'ts-loader',
          exclude: /node-modules/,
          options: {
              configFile: path.resolve(__dirname, './tsconfig.json')
          }
      }
    ]
  },
  // 设置哪些文件类型可以作为模块被引用
  resolve: {
    extensions: ['.ts', '.js']
  }
}
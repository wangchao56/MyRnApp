让我查看项目中 web 构建的完整配置：

用户问的是 web 产物如何打包构建。我需要查看项目中 web 构建相关的配置文件，包括：

1. rspack.config.js - 项目使用 rspack 作为 web 打包工具
2. entry/index.tsx - web 入口文件
3. package.json 中的 web 相关脚本

让我查看这些文件来详细说明 web 打包流程。

让我继续查看更多 web 构建相关配置：

用户想了解项目中 Web 产物是如何打包构建的。我已经看到了 rspack.config.js 和 entry/index.tsx 文件。让我继续查看更多相关配置，包括 public/index.html 和其他相关文件。

用户询问如何打包构建 web 产物。我已经看到了 rspack.config.js 配置文件，现在需要查看入口文件和 HTML 模板来完整理解构建流程。让我读取这些文件。

用户问的是 "所以 web 产物如何打包构建"，我需要基于之前查看的代码来详细解释这个项目的 web 打包构建流程。

从代码中可以看到：

1. 使用 **Rspack** 作为打包工具（替代 Webpack）
2. 入口文件是 `src/index.web.ts`
3. 配置文件是 `rspack.config.js`
4. HTML 模板是 `public/index.html`

我需要详细解释：

1. 打包工具（Rspack）
2. 配置文件结构
3. 构建命令
4. 输出产物
5. 完整的构建流程

让我整理一个清晰的回答。

# 🌐 Web 产物打包构建详解

你的项目使用 **Rspack** 作为 Web 打包工具，这是一个高性能的 JavaScript 打包器。让我详细说明构建流程：

---

## 📦 核心打包工具：Rspack

### 什么是 Rspack

**Rspack** 是字节跳动开发的高性能打包工具，相比传统 Webpack：

- ⚡ 构建速度快 10-100 倍
- 🚀 支持增量构建
- 🔄 兼容 Webpack 配置

---

## 📁 构建配置详解

### 1. 主配置文件 - [rspack.config.js](file:///Users/tianhe/work/hqfront/rspack.config.js)

**核心配置结构**：

| 配置项         | 说明                               |
| -------------- | ---------------------------------- |
| `entry`        | 入口文件：`src/index.web.ts`       |
| `output`       | 输出目录：`build/`                 |
| `resolve`      | 模块解析配置（别名、扩展名）       |
| `module.rules` | 加载器配置（Babel、图片、字体等）  |
| `plugins`      | 插件配置（HTML、Copy、Refresh 等） |
| `devServer`    | 开发服务器配置                     |
| `optimization` | 优化配置（压缩、代码分割）         |

### 2. 关键配置解析

**入口配置**：

```javascript
entry: "./src/index.web.ts",
output: {
  path: path.resolve(__dirname, "build"),
  filename: isDev ? "static/js/[name].js" : "static/js/[name].[contenthash:8].js",
  publicPath: "/",
  clean: true,
},
```

**React Native Web 别名**：

```javascript
resolve: {
  alias: {
    "react-native$": "react-native-web",  // 将 react-native 映射到 react-native-web
  },
}
```

**Babel 配置**（处理 JSX/TypeScript）：

```javascript
module: {
  rules: [{
    test: /\.(ts|tsx|js|jsx)$/,
    use: {
      loader: "babel-loader",
      options: {
        presets: ["module:metro-react-native-babel-preset"],  // 使用 RN 的 Babel 预设
        plugins: [
          "@babel/plugin-proposal-decorators",
          "@babel/plugin-transform-react-jsx",
          ...(isDev ? [require.resolve("react-refresh/babel")] : []),
        ],
      },
    },
  }],
}
```

---

## 🚀 构建命令

### 开发模式

```bash
npm run web:dev
# 或
yarn web:dev
```

**作用**：启动开发服务器，支持热更新

### 生产构建

```bash
npm run web:build
# 或
yarn web:build
```

**作用**：生成生产环境产物

### 生产构建（无 sourcemap）

```bash
npm run web:nomap:build
```

**作用**：生成生产产物并上传 sourcemap 到 Sentry

---

## 📊 构建产物结构

```
build/
├── static/
│   ├── js/
│   │   ├── main.[hash].js          # 主应用代码
│   │   ├── vendors.[hash].js       # 第三方依赖（代码分割）
│   │   └── [name].[hash].chunk.js  # 按需加载的 chunk
│   └── media/
│       ├── [name].[hash].png       # 图片资源
│       ├── [name].[hash].ttf       # 字体文件
│       └── [name].[hash].lottie    # Lottie 动画
├── index.html                       # HTML 入口
├── favicon.ico                      # 图标
├── manifest.json                    # PWA 配置
└── version.json                     # 版本信息（生产环境）
```

---

## 🔄 完整构建流程

```
┌─────────────────────────────────────────────────────────────────┐
│                    Web 构建流程                                │
├─────────────────────────────────────────────────────────────────┤
│  1. 入口文件: src/index.web.ts                                │
│       ↓                                                       │
│  2. Rspack 解析依赖                                           │
│       ↓                                                       │
│  3. Babel 转换: TS/JSX → JS                                   │
│       ↓                                                       │
│  4. 资源处理: 图片/字体 → 静态资源                             │
│       ↓                                                       │
│  5. 代码分割: 主应用 + vendors                                 │
│       ↓                                                       │
│  6. 压缩优化: Terser 压缩 + Tree Shaking                      │
│       ↓                                                       │
│  7. 生成 HTML: HtmlRspackPlugin                               │
│       ↓                                                       │
│  8. 复制静态文件: CopyRspackPlugin                            │
│       ↓                                                       │
│  9. 生成版本文件: GenerateVersionPlugin (仅生产)              │
│       ↓                                                       │
│  10. 输出到 build/ 目录                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 入口文件解析

### [src/index.web.ts](file:///Users/tianhe/work/hqfront/src/index.web.ts)

```typescript
import {AppRegistry} from 'react-native';
import {Myapp} from '../app/app';

// 注册应用组件
AppRegistry.registerComponent('jiji', () => Myapp);

// 运行应用（挂载到 #root）
AppRegistry.runApplication('jiji', {
  rootTag: document.getElementById('root'),
});
```

**关键点**：

- 使用 React Native 的 `AppRegistry` API
- 将 React Native 组件挂载到 DOM 的 `#root` 节点
- 实现了 React Native 代码的 Web 端复用

---

## 📱 HTML 模板

### [public/index.html](file:///Users/tianhe/work/hqfront/public/index.html)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, ..." />
    <title>GateH</title>
    <link rel="stylesheet" href="<%= PUBLIC_URL %>/index.css" />
  </head>
  <body>
    <div id="root"></div>
    <!-- 应用挂载点 -->
    <script src="https://res.wx.qq.com/open/js/jweixin-1.6.0.js"></script>
    <!-- 微信 SDK -->
  </body>
</html>
```

---

## 🧩 核心插件

| 插件                    | 作用                                |
| ----------------------- | ----------------------------------- |
| `HtmlRspackPlugin`      | 生成 HTML 文件，自动注入打包后的 JS |
| `CopyRspackPlugin`      | 复制 public 目录下的静态文件        |
| `ReactRefreshPlugin`    | 开发模式热更新                      |
| `DefinePlugin`          | 定义全局变量（如 `__DEV__`）        |
| `GenerateVersionPlugin` | 生产环境生成版本信息文件            |

---

## 🚀 开发服务器配置

```javascript
devServer: {
  port: 3000,           // 端口
  hot: true,            // 热更新
  historyApiFallback: true,  // 支持 React Router
  proxy: {
    "/v1/api": {
      target: env[arg].BASE_URL,  // API 代理
      changeOrigin: true,
    },
  },
},
```

---

## 📝 总结

| 项目         | 说明                          |
| ------------ | ----------------------------- |
| **打包工具** | Rspack（高性能替代 Webpack）  |
| **入口文件** | `src/index.web.ts`            |
| **输出目录** | `build/`                      |
| **开发命令** | `npm run web:dev`             |
| **生产命令** | `npm run web:build`           |
| **核心技术** | React Native Web + TypeScript |

你的项目已经配置了完整的 Web 构建流程，可以直接运行构建命令生成产物！

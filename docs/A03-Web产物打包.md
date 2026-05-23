# Web 产物打包

> 状态：✅ 已实现（2026-05-24 同步）

项目有**两条 Web 构建路径**，使用不同打包工具和入口，请勿混淆。

## 路径一：`@myapp/web` 独立 H5

用于独立 Web 站点、Bridge 联调页等。

| 项 | 值 |
|----|-----|
| 配置 | 根目录 `webpack.config.js` |
| 入口 | `packages/web/src/index.tsx` |
| 输出 | `packages/web/dist/` |
| 开发 | `pnpm dev:web`（端口 **3000**） |
| 构建 | `pnpm build:web` |

**特点：**

- 使用 React Router v6 路由
- 依赖 `@myapp/shared` 共享组件与状态
- 通过 `@myapp/jsbridge` 与 App WebView 通信

```bash
# 开发
pnpm dev:web

# 生产构建
pnpm build:web
```

产物结构：

```
packages/web/dist/
├── index.html
├── bundle.[hash].js
└── bundle.[hash].js.map
```

## 路径二：App RNW 整包

用于在浏览器中运行完整 App（与原生共用 React Navigation）。

| 项 | 值 |
|----|-----|
| 配置 | 根目录 `rspack.config.js` |
| 入口 | `packages/app/index.web.js` |
| 输出 | `packages/app/dist/` |
| 开发 | `pnpm dev:app:web`（端口 **3002**） |
| 构建 | `pnpm build:app:web` |

**特点：**

- 使用 Rspack（高性能，兼容 Webpack 生态）
- 与 `packages/app` 共用导航和页面
- `react-native` 映射到 `react-native-web`

```bash
# 开发
pnpm dev:app:web

# 生产构建
pnpm build:app:web
```

## 路径三：JSBridge UMD 包

用于在非打包环境（纯 HTML 页面）引入 JSBridge。

| 项 | 值 |
|----|-----|
| 配置 | `packages/jsbridge/webpack.config.js` |
| 输出 | `packages/jsbridge/dist/umd/jsbridge.min.js` |
| 构建 | `pnpm build:jsbridge` |

```html
<script src="path/to/jsbridge.min.js"></script>
<script>
  const { share, invoke } = JSBridge;
</script>
```

## 原生 App（Metro）

原生 Android / iOS 不走 Web 打包，使用 Metro：

```bash
pnpm dev:app      # 启动 Metro
pnpm android      # 构建并运行 Android
pnpm ios          # 构建并运行 iOS
```

## 对比总结

| 场景 | 命令 | 工具 | 端口 | 导航 |
|------|------|------|------|------|
| 独立 H5 | `pnpm dev:web` | Webpack | 3000 | React Router |
| App Web 版 | `pnpm dev:app:web` | Rspack | 3002 | React Navigation |
| 原生 App | `pnpm dev:app` | Metro | 8081 | React Navigation |
| JSBridge UMD | `pnpm build:jsbridge` | Webpack | — | — |

## Bridge 联调

1. 启动 H5：`pnpm dev:web`（:3000）
2. 启动 App：`pnpm dev:app` + `pnpm android`
3. App 内打开 Bridge 测试页，加载 `http://<局域网IP>:3000/bridge-test`

详见 [完整测试场景](./完整测试场景.md)。

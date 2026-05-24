# Web 产物打包

> 状态：✅ 已实现（2026-05-24 同步）

项目有**两条 Web 构建路径**，使用不同打包工具和入口。

## 路径一：`@myapp/web` 独立 H5

| 项 | 值 |
|----|-----|
| 目录 | `apps/web` |
| 配置 | `apps/web/webpack.config.js` |
| 入口 | `apps/web/src/index.tsx` |
| 输出 | `apps/web/dist/` |
| 开发 | `pnpm dev:web`（:3000） |
| 构建 | `pnpm build:web` → `nx run @myapp/web:build` |

## 路径二：App RNW 整包

| 项 | 值 |
|----|-----|
| 目录 | `apps/app` |
| 配置 | 根目录 `rspack.config.js` |
| 入口 | `apps/app/index.web.js` |
| 输出 | `apps/app/dist/` |
| 开发 | `pnpm dev:app:web`（:3002） |
| 构建 | `pnpm build:app:web` → `nx run @myapp/app:build:web` |

## 路径三：JSBridge UMD

| 项 | 值 |
|----|-----|
| 目录 | `packages/jsbridge` |
| 构建 | `pnpm build:jsbridge` → `nx run @myapp/jsbridge:build` |
| 输出 | `packages/jsbridge/dist/umd/jsbridge.min.js` |

## 对比

| 场景 | 命令 | 工具 | 端口 |
|------|------|------|------|
| 独立 H5 | `pnpm dev:web` | Webpack | 3000 |
| App Web 版 | `pnpm dev:app:web` | Rspack | 3002 |
| 原生 App | `pnpm dev:app` | Metro | 8081 |

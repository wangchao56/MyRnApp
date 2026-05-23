# MyRnApp 文档索引

> 最后同步：2026-05-24  
> 图例：✅ 已实现 · ⚠️ 部分实现 · ⏳ 规划中 · ❌ 未实现

## 快速导航

| 需求 | 文档 |
|------|------|
| 整体架构 | [A01-项目架构](./A01-项目架构.md) |
| Nx 任务编排 | [B04-Nx使用指南](./B04-Nx使用指南.md) |
| apps 目录说明 | [apps/README.md](../apps/README.md) |
| 安装与环境 | [B01-安装命令](./B01-安装命令.md) |
| 开发调试 | [B02-开发调试](./B02-开发调试.md) |
| Web / App 打包 | [A03-Web产物打包](./A03-Web产物打包.md) |
| JSBridge | [packages/jsbridge/README.md](../packages/jsbridge/README.md) |

---

## 架构与构建

| 文档 | 状态 | 说明 |
|------|------|------|
| [A01-项目架构](./A01-项目架构.md) | ✅ | apps + packages 分层、Nx、双 Web 路径 |
| [A02-打包构建](./A02-打包构建.md) | ⚠️ | Metro 原生构建说明可用 |
| [A03-Web产物打包](./A03-Web产物打包.md) | ✅ | Webpack（web）与 Rspack（App RNW） |
| [B04-Nx使用指南](./B04-Nx使用指南.md) | ✅ | Nx 命令、缓存、新增项目 |
| [B01-安装命令](./B01-安装命令.md) | ⚠️ | 安装步骤基本可用 |
| [B02-开发调试](./B02-开发调试.md) | ⚠️ | 调试技巧基本可用 |
| [B03-RNW与RN原生对比](./B03-RNW与RN原生对比.md) | 📖 | 概念参考 |

---

## UI 组件与主题

| 文档 | 状态 | 说明 |
|------|------|------|
| [D02-主题化StyleSheet](./D02-主题化StyleSheet.md) | ✅ | 与 packages/shared 主题系统一致 |
| [D03-主题化StyleSheet优化规划](./D03-主题化StyleSheet优化规划.md) | ⏳ | CSS 变量、断点等未实现 |
| [D04-通用图片组件](./D04-通用图片组件.md) | ⚠️ | OssImage / SmartImage 已实现 |
| [D05-Gradient渐变组件](./D05-Gradient渐变组件.md) | ⚠️ | Web 渐变已实现；Native 纯色 fallback |
| [D06-SvgIcon图标组件](./D06-SvgIcon图标组件.md) | ✅ | 基于 Material Icons 字体 |

---

## JSBridge 与功能模块

| 文档 | 状态 | 说明 |
|------|------|------|
| [jsbridge/B04-JSBridge进阶功能指南](./jsbridge/B04-JSBridge进阶功能指南.md) | ⚠️ | App handlers 在 apps/app/src/bridge |
| [媒体保存功能总结](./媒体保存功能总结.md) | ⚠️ | Native 相册保存未实现 |
| [S01-扫码/相机解决方案](./S01-扫码/相机解决方案.md) | ⏳ | Web 扫码已实现，Native 占位 |
| [Z01-支付解决方案](./Z01-支付解决方案.md) | ⏳ | 纯设计方案 |
| [C01-应用内购买](./C01-应用内购买.md) | ❌ | 未实现 |

---

## 架构要点

- **Nx** 替代 Turborepo，统一 build / lint / test / typecheck
- **apps/** 存放可部署应用（app、web；预留 windows / macos / harmony）
- **packages/** 存放共享库（shared、jsbridge）

## 双 Web 路径

```
pnpm dev:web        -> apps/web      Webpack  :3000  独立 H5
pnpm dev:app:web    -> apps/app      Rspack   :3002  App RNW
pnpm dev:app        -> Metro                 原生 Android / iOS
```

## 文档分类

| 前缀 | 类别 |
|------|------|
| A | 架构与构建 |
| B | 安装、调试、工具链（含 Nx） |
| C | 平台专题（IAP、CocoaPods 等） |
| D | UI 组件与主题 |
| I | iOS 开发 |
| jsbridge/ | JSBridge 进阶 |
| S / Z | 方案规划（扫码、支付） |
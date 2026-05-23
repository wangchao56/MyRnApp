# MyRnApp 文档索引

> 最后同步：2026-05-24  
> 图例：✅ 已实现 · ⚠️ 部分实现 · ⏳ 规划中 · ❌ 未实现 / 已废弃

## 快速导航

| 需求 | 文档 |
|------|------|
| 了解整体架构 | [A01-项目架构](./A01-项目架构.md) |
| 安装与环境 | [B01-安装命令](./B01-安装命令.md) |
| 日常开发调试 | [B02-开发调试](./B02-开发调试.md) |
| Web / App 打包 | [A02-打包构建](./A02-打包构建.md)、[A03-Web产物打包](./A03-Web产物打包.md) |
| JSBridge 联调 | [jsbridge/B04-JSBridge进阶功能指南](./jsbridge/B04-JSBridge进阶功能指南.md)、[`packages/jsbridge/README.md`](../packages/jsbridge/README.md) |
| Bridge 测试 | [完整测试场景](./完整测试场景.md)、[立即测试指南](./立即测试指南.md) |

---

## 架构与构建

| 文档 | 状态 | 说明 |
|------|------|------|
| [A01-项目架构](./A01-项目架构.md) | ✅ | Monorepo 结构、四包职责、双 Web 路径 |
| [A02-打包构建](./A02-打包构建.md) | ⚠️ | Metro 原生构建说明可用；部分路径引用旧项目 |
| [A03-Web产物打包](./A03-Web产物打包.md) | ✅ | `@myapp/web`（Webpack）与 App RNW（Rspack）分流说明 |
| [A04-各大版本之间的区别](./A04-各大版本之间的区别.md) | 📖 | RN 版本参考，与当前 0.74.7 无强绑定 |
| [B01-安装命令](./B01-安装命令.md) | ⚠️ | 安装步骤基本可用 |
| [B02-开发调试](./B02-开发调试.md) | ⚠️ | 调试技巧基本可用 |
| [B03-RNW与RN原生对比](./B03-RNW与RN原生对比.md) | 📖 | 概念参考 |

---

## UI 组件与主题

| 文档 | 状态 | 说明 |
|------|------|------|
| [D01-UI设计规范](./D01-UI设计规范.md) | 📖 | 设计规范参考 |
| [D01-SafeAreaView 在 Web 端的行为](./D01-📱%20SafeAreaView%20在%20Web%20端的行为.md) | 📖 | SafeArea 行为说明 |
| [D02-主题化StyleSheet](./D02-主题化StyleSheet.md) | ✅ | 与 `packages/shared/src/theme/StyleSheet.ts` 一致 |
| [D03-主题化StyleSheet优化规划](./D03-主题化StyleSheet优化规划.md) | ⏳ | CSS 变量、断点等未实现 |
| [D03-AppH5主题化优化规划](./D03-AppH5主题化优化规划.md) | ⏳ | App/H5 主题同步方案，未实现 |
| [D04-通用图片组件](./D04-通用图片组件.md) | ⚠️ | OssImage / SmartImage / ImagePreview 已实现；FastOssImage 不存在 |
| [D05-Gradient渐变组件](./D05-Gradient渐变组件.md) | ⚠️ | Web 渐变 ✅；Native 仅纯色 fallback |
| [D06-SvgIcon图标组件](./D06-SvgIcon图标组件.md) | ✅ | 基于 Material Icons 字体，非 SVG 文件 |

---

## JSBridge 与分享

| 文档 | 状态 | 说明 |
|------|------|------|
| [`packages/jsbridge/README.md`](../packages/jsbridge/README.md) | ✅ | API 权威参考 |
| [jsbridge/B04-JSBridge进阶功能指南](./jsbridge/B04-JSBridge进阶功能指南.md) | ⚠️ | 进阶用法；RN handler 在 `@myapp/app/src/bridge` |

**已实现能力：**

- H5 SDK：`invoke` / `share` / 平台检测 / Mock / 事件订阅
- 分享适配：RN App、微信 H5、小程序、浏览器、剪贴板降级
- App handlers：`getUserInfo`、`getToken`、`scanQRCode`（mock）、`share`、`getAppInfo`、`getDeviceInfo`、`showToast`
- 测试页：App `BridgeTestScreen` + Web `BridgeTestPage`

---

## 功能模块

| 文档 | 状态 | 说明 |
|------|------|------|
| [媒体保存功能总结](./媒体保存功能总结.md) | ⚠️ | Hook 与测试页存在；**Native 相册保存未实现** |
| [S01-扫码/相机解决方案](./S01-扫码/相机解决方案.md) | ⏳ | 方案参考；Web 扫码 ✅，Native 占位 |
| [Z01-支付解决方案](./Z01-支付解决方案.md) | ⏳ | 纯设计方案，无代码 |
| [C01-应用内购买](./C01-应用内购买.md) | ❌ | 未实现；文档已标注 |

---

## 平台与环境

| 文档 | 状态 | 说明 |
|------|------|------|
| [Android测试指南](./Android测试指南.md) | 📖 | Android 测试步骤 |
| [Android环境问题修复指南](./Android环境问题修复指南.md) | 📖 | 环境问题排查 |
| [BUG01-运行pnpm android命令报错](./BUG01-运行pnpm%20android命令报错.md) | 📖 | 已知问题记录 |
| [I01-iOS开发指南](./I01-iOS开发指南.md) | 📖 | iOS 开发 |
| [I02-iOS快速参考](./I02-iOS快速参考.md) | 📖 | iOS 速查 |
| [C02-CocoaPods 是什么](./C02-📦%20CocoaPods%20是什么.md) | 📖 | CocoaPods 介绍 |
| [C03-CocoaPods 安装指南](./C03-📦%20CocoaPods%20安装指南.md) | 📖 | CocoaPods 安装 |

---

## 测试

| 文档 | 状态 | 说明 |
|------|------|------|
| [完整测试场景](./完整测试场景.md) | ⚠️ | Bridge 联调场景，需对照当前端口 |
| [立即测试指南](./立即测试指南.md) | ⚠️ | 快速上手测试 |
| [快速测试卡片](./快速测试卡片.md) | ⚠️ | 测试速查 |

---

## 实现状态总览

### ✅ 已完成

- Monorepo：`shared` / `app` / `web` / `jsbridge` 四包结构
- MST 状态管理 + 浅/深主题 + `createStyleSheet` / `useStyles`
- 基础 UI：Button、Card、Input、Image、OssImage、SmartImage、ImagePreview
- JSBridge 完整链路 + 多平台分享
- App 导航：React Navigation（Stack + Tab + Modal）
- Web 独立站点：React Router（`@myapp/web`）
- App RNW 整包：Rspack + React Navigation（`dev:app:web`）

### ⚠️ 部分实现

- Gradient：Web CSS 渐变；Native 纯色占位
- Scanner：Web `html5-qrcode`；Native UI 占位
- useSaveMedia：Hook 接口存在；Native 未接 CameraRoll
- JSBridge `scanQRCode`：返回 mock 数据

### ⏳ 规划中

- 主题 CSS 变量 / 断点系统（见 D03 规划文档）
- 原生扫码（vision-camera / expo-camera）
- 原生媒体保存（`@react-native-camera-roll/camera-roll`）
- 支付 / IAP（见 Z01、C01）

### ❌ 已废弃 / 未采用

以下方案**不在当前架构中使用**，相关文档已删除：

- styled-components、apisauce（旧单包架构遗留）
- expo-linear-gradient（Gradient 改用 Web CSS + Native fallback）
- react-native-fast-image / FastOssImage
- Web 包迁移到 React Navigation（维持 Web 独立 H5 + App RNW 双路径）
- JSBridge 放在 `shared` 或 `web` 包内（已独立为 `@myapp/jsbridge`）

---

## 双 Web 开发路径

```
pnpm dev:web        → packages/web   Webpack  :3000  React Router  独立 H5 / Bridge 联调
pnpm dev:app:web    → packages/app   Rspack   :3002  React Navigation  完整 App RNW
pnpm dev:app        → Metro                 原生 Android / iOS
```

Bridge 联调：`BridgeTestScreen` 加载 `@myapp/web` 的 `/bridge-test` 页面（需 `pnpm dev:web`）。

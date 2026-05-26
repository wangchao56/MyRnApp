# MyRnApp 文档

> 在线文档：推送到 `main` 分支后，可通过 **GitHub Pages** 访问（地址形如 `https://<用户名>.github.io/<仓库名>/`）。  
> 本地预览：`pnpm docs:dev` · 构建：`pnpm docs:build`

> 最后更新：2026-05  
> 技术栈：React Native **0.77.3** · pnpm workspace · Nx

## 快速入口

| 主题 | 链接 |
|------|------|
| **开发环境（必读）** | [B05-开发环境安装与配置](/B05-开发环境安装与配置) |
| 项目架构 | [A01-项目架构](/A01-项目架构) |
| RN 0.77 迁移 | [A05-RN077迁移指南](/A05-RN077迁移指南) |
| Nx 使用 | [B04-Nx使用指南](/B04-Nx使用指南) |
| 开发调试 | [B02-开发调试](/B02-开发调试) |
| Web / App 打包 | [A03-Web产物打包](/A03-Web产物打包) |
| JSBridge Loading | [JSBridge-Loading-Usage](/JSBridge-Loading-Usage) |

---

## 架构与构建

| 文档 | 说明 |
|------|------|
| [A01-项目架构](/A01-项目架构) | apps + packages、Nx、Web 构建 |
| [A02-打包构建](/A02-打包构建) | Metro、Release |
| [A03-Web产物打包](/A03-Web产物打包) | Webpack（web）、Rspack（App RNW） |
| [A05-RN077迁移指南](/A05-RN077迁移指南) | 0.74.7 → 0.77.3 |
| [B04-Nx使用指南](/B04-Nx使用指南) | Nx 任务与缓存 |

---

## 开发实践（B 系列）

| 文档 | 说明 |
|------|------|
| [B05-开发环境安装与配置](/B05-开发环境安装与配置) | `pnpm setup` / `.env` / 环境 |
| [B01-安装命令](/B01-安装命令) | 常用安装命令 |
| [B02-开发调试](/B02-开发调试) | Metro、调试工具 |
| [B03-RNW与RN原生对比](/B03-RNW与RN原生对比) | 跨端差异 |
| [Android测试指南](/Android测试指南) | Android 测试 |
| [BUG01-运行pnpm android命令报错](/BUG01-运行pnpm android命令报错) | 常见问题 |

---

## UI 与组件（D 系列）

| 文档 | 说明 |
|------|------|
| [D02-主题化StyleSheet](/D02-主题化StyleSheet) | packages/shared 主题 |
| [D04-通用图片组件](/D04-通用图片组件) | OssImage / SmartImage |
| [D06-SvgIcon图标组件](/D06-SvgIcon图标组件) | Material Icons |
| [D07-组件封装规范](/D07-组件封装规范) | 组件规范 |

---

## JSBridge 与能力

| 文档 | 说明 |
|------|------|
| [JSBridge Loading 用法](/JSBridge-Loading-Usage) | Loading 控制 |
| [JSBridge 进阶功能](/jsbridge/B04-JSBridge进阶功能指南) | Native handlers |
| [E01-剪贴板功能](/E01-剪贴板功能) | 剪贴板 |
| [S01-扫码/相机解决方案](/S01-扫码/相机解决方案) | 扫码 |
| [Z01-支付解决方案](/Z01-支付解决方案) | 支付 |

---

## iOS

| 文档 | 说明 |
|------|------|
| [I01-iOS开发指南](/I01-iOS开发指南) | iOS 开发 |
| [I02-iOS快速参考](/I02-iOS快速参考) | 速查 |
| [C02-CocoaPods 是什么](/C02-📦%20CocoaPods%20是什么) | CocoaPods 概念 |
| [C03-CocoaPods 安装指南](/C03-📦%20CocoaPods%20安装指南) | CocoaPods 安装 |

---

## Monorepo 结构

- **Nx**：统一 build / lint / test / typecheck
- **apps/**：mobile、web；规划 windows / macos / harmony
- **packages/**：shared、jsbridge
- 原生工程：`android/`、`ios/`

## 常用命令

```bash
pnpm setup              # 环境检测 + 生成 .env
pnpm setup:env          # 仅生成/更新 .env
pnpm dev:mobile         # Metro（移动端）
pnpm dev:web            # 独立 H5 :3000
pnpm dev:mobile:web     # App RNW :3002
pnpm android            # Android（读取 .env）
pnpm ios                # iOS（macOS）
pnpm docs:dev           # 本地文档站
```

## 文档分类

| 前缀 | 含义 |
|------|------|
| A | 架构、构建、迁移 |
| B | 环境、调试、工具 |
| C | 商业 / CocoaPods |
| D | UI 与组件 |
| I | iOS |
| jsbridge/ | JSBridge 专题 |
| S / Z / E | 扫码、支付、剪贴板等 |

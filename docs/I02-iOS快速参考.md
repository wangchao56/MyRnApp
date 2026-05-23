---
title: iOS 开发快速参考
date: 2024-01-15
tags:
  - ios
  - quick-reference
aliases:
  - iOS Quick Reference
status: completed
---

# iOS 开发快速参考

> [!tip] 快速导航
> 需要快速查找命令？请查看下方命令速查表。

---

## 命令速查表

| 操作 | 命令 |
|------|------|
| 安装依赖 | `pnpm install` |
| 安装 iOS 依赖 | `cd packages/app/ios && pod install` |
| 启动 Metro | `pnpm start` |
| 运行 iOS | `pnpm ios` |
| 运行指定模拟器 | `npx react-native run-ios --simulator="iPhone 16 Pro"` |
| 构建 Release | `npx react-native build-ios --mode release` |
| 生成 Bundle | `npx react-native bundle --platform ios --dev false --entry-file index.js --bundle-output ios/main.jsbundle --assets-dest ios` |

---

## 常用命令

### 开发阶段

```bash
# 启动开发（推荐顺序）
pnpm install              # 1. 安装依赖
cd packages/app/ios && pod install && cd ../..  # 2. 安装 iOS pods
pnpm start                # 3. 启动 Metro
pnpm ios                  # 4. 运行 iOS 应用

# 同时开发 App 和 Web
pnpm dev:all
```

### 调试阶段

```bash
# 清理缓存
npx react-native start --reset-cache

# 查看可用模拟器
xcrun simctl list devices available

# 重启 Metro
# Ctrl + C 然后重新运行 pnpm start
```

### 构建阶段

```bash
# Debug 构建
npx react-native build-ios --mode debug

# Release 构建
npx react-native build-ios --mode release

# 生成 JS Bundle
npx react-native bundle --platform ios --dev false --entry-file index.js --bundle-output ios/main.jsbundle --assets-dest ios
```

---

## 目录速查

| 路径 | 说明 |
|------|------|
| `packages/app/` | React Native App 项目根目录 |
| `packages/app/ios/` | iOS 原生代码目录 |
| `packages/app/src/` | React Native 源代码 |
| `packages/shared/` | 共享代码（状态管理、组件等） |
| `packages/web/` | Web 项目 |

---

## 文件速查

| 文件 | 说明 |
|------|------|
| `MyRnApp.xcworkspace` | ✅ 用这个打开 Xcode |
| `MyRnApp.xcodeproj` | ❌ 不要直接打开 |
| `Podfile` | CocoaPods 配置文件 |
| `package.json` | 项目依赖配置 |

---

## 快捷键

### Xcode

| 快捷键 | 功能 |
|--------|------|
| `Cmd + R` | 运行应用 |
| `Cmd + Shift + K` | 清理构建 |
| `Cmd + ,` | 偏好设置 |
| `Cmd + D` | 打开开发者菜单 |

### Metro

| 快捷键 | 功能 |
|--------|------|
| `R` | 重新加载 |
| `I` | 切换 Inspector |
| `D` | 打开开发者菜单 |
| `Ctrl + C` | 停止服务器 |

### iOS 模拟器

| 快捷键 | 功能 |
|--------|------|
| `Cmd + R` | 重新加载 |
| `Cmd + D` | 开发者菜单 |
| `Cmd + S` | 截图 |
| `Cmd + Shift + H` | Home 键 |

---

## 状态指示器

### Metro 终端

```
✅ Metro 运行中 - 端口 8081
❌ Metro 连接失败 - 检查端口占用
⚠️  Bundle 加载中 - 等待...
```

### Xcode 构建

```
Building the app...
- Building the app.
- Building the app..
- Building the app...
✅ BUILD SUCCEEDED
❌ BUILD FAILED
```

---

## 错误代码

| 错误代码 | 含义 | 解决方案 |
|----------|------|----------|
| EACCES | 权限不足 | `sudo` 或检查文件权限 |
| ENOENT | 文件不存在 | 检查路径或重新安装依赖 |
| ECONNREFUSED | 连接被拒绝 | 检查 Metro 是否运行 |
| MODULE_NOT_FOUND | 模块找不到 | `pnpm install` 或清理缓存 |

---

## 相关链接

- [[I01-iOS开发指南|iOS 开发完整指南]]
- [A01-项目架构](./A01-项目架构.md)
- [[B02-开发调试|开发调试指南]]

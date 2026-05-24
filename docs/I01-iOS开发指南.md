---
title: iOS 开发指南
date: 2024-01-15
tags:
  - ios
  - react-native
  - 开发指南
aliases:
  - iOS开发流程
  - iOS Setup Guide
status: completed
---

# iOS 开发指南

> [!info] 概述
> 本文档详细说明如何在 Monorepo 架构下开发 iOS 应用，包括环境配置、项目启动、常见问题解决等。

## 目录

- [[#环境要求]]
- [[#项目结构]]
- [[#快速开始]]
- [[#详细步骤]]
- [[#常见问题]]
- [[#开发技巧]]
- [[#发布流程]]

---

## 环境要求

### 必需软件

- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0
- **Xcode**: >= 15.0
- **CocoaPods**: >= 1.14.0
- **Ruby**: >= 2.7.0
- **watchman**: (可选，用于文件监控)

### 检查环境

```bash
# 检查 Node.js
node --version

# 检查 pnpm
pnpm --version

# 检查 Xcode
xcodebuild -version

# 检查 CocoaPods
pod --version

# 检查 Ruby
ruby --version
```

> [!warning] 重要提示
> 确保所有依赖都正确安装，特别是 CocoaPods，否则 iOS 项目将无法构建。

---

## 项目结构

```
MyRnApp/
├── apps/
│   └── app/                      # @myapp/app — React Native 代码
│       ├── src/                  # 页面、导航、组件
│       └── package.json
├── ios/                          # iOS 原生代码（根目录）
│   ├── MyRnApp/
│   ├── MyRnApp.xcodeproj/
│   ├── MyRnApp.xcworkspace/      # ⚠️ 使用这个打开项目
│   ├── Podfile
│   └── Pods/
├── android/                      # Android 原生代码（根目录）
├── metro.config.js
└── packages/
    ├── shared/
    └── jsbridge/
```

> [!important] 关键文件
> - `MyRnApp.xcworkspace` - 用 Xcode 打开此文件
> - `MyRnApp.xcodeproj` - 不要直接打开此文件

---

## 快速开始

### 方式一：使用命令行（推荐）

```bash
# 1. 安装依赖
pnpm install

# 2. 安装 iOS 依赖
cd ios
pod install

# 3. 启动 Metro 开发服务器
cd ../..
pnpm start

# 4. 运行 iOS 应用（新终端）
pnpm ios
```

### 方式二：使用 Xcode

```bash
# 1. 安装依赖
pnpm install

# 2. 安装 iOS 依赖
cd ios && pod install && cd ../..

# 3. 打开 Xcode
open ios/MyRnApp.xcworkspace

# 4. 在 Xcode 中按 Cmd + R 运行
```

---

## 详细步骤

### 第一步：安装依赖

```bash
# 安装 pnpm（如果未安装）
npm install -g pnpm

# 安装项目依赖
pnpm install
```

> [!tip] pnpm 安装说明
> 项目使用 pnpm workspace，推荐使用 pnpm 而不是 npm 或 yarn。

### 第二步：安装 CocoaPods 依赖

```bash
# 进入 iOS 目录
cd ios

# 安装 CocoaPods 依赖
pod install

# 或者更新并安装
pod install --repo-update
```

> [!note] 首次安装
> 首次运行可能需要几分钟下载所有 CocoaPods 依赖，请耐心等待。

### 第三步：启动 Metro 开发服务器

```bash
# 在项目根目录运行
pnpm start

# 或者
pnpm dev:app
```

Metro 会在 `http://localhost:8081` 启动。

> [!tip] Metro 快捷键
> - `R` - 重新加载
> - `I` - 切换 inspector
> - `D` - 打开开发者菜单

### 第四步：运行 iOS 应用

#### 方式 A：使用命令行

```bash
# 方式 1：直接运行
pnpm ios

# 方式 2：带指定模拟器
npx react-native run-ios --simulator="iPhone 16 Pro"

# 方式 3：Release 版本
npx react-native run-ios --configuration Release
```

#### 方式 B：使用 Xcode

1. 打开 `ios/MyRnApp.xcworkspace`
2. 选择目标模拟器（如 iPhone 16 Pro）
3. 按 `Cmd + R` 运行

> [!warning] 重要提示
> 必须打开 `.xcworkspace` 文件，不是 `.xcodeproj` 文件。

---

## 常见问题

### 问题 1：模拟器黑屏

**症状**：应用启动后显示黑屏。

**解决方案**：

```bash
# 1. 清理构建缓存
cd ios
rm -rf build
rm -rf Pods
rm -rf ~/Library/Developer/Xcode/DerivedData

# 2. 重新安装 pods
pod install

# 3. 重新构建
cd ..
pnpm ios
```

### 问题 2：Pod 安装失败

**症状**：`pod install` 报错网络连接失败。

**解决方案**：

```bash
# 1. 更新 repo
pod repo update

# 2. 重试安装
pod install --repo-update

# 3. 如果还是失败，尝试使用镜像
# 编辑 Podfile，添加：
# source 'https://mirrors.tuna.tsinghua.edu.cn/git/CocoaPods/Specs.git'
```

### 问题 3：Metro 连接失败

**症状**：Metro 显示连接错误。

**解决方案**：

```bash
# 1. 检查 Metro 是否运行
curl http://localhost:8081

# 2. 重启 Metro
# 在 Metro 终端按 Ctrl + C，然后重新运行
pnpm start

# 3. 清除缓存
npx react-native start --reset-cache
```

### 问题 4：TypeScript 类型错误

**症状**：编译时出现类型错误。

**解决方案**：

```bash
# 运行类型检查
pnpm typecheck

# 或者在 VSCode 中
# 按 Shift + Cmd + P，输入 "TypeScript: Restart TS Server"
```

### 问题 5：模块找不到

**症状**：`Unable to resolve module` 错误。

**解决方案**：

```bash
# 1. 确保在根目录安装了所有依赖
pnpm install

# 2. 重置 Metro 缓存
npx react-native start --reset-cache

# 3. 重新启动
pnpm start
```

### 问题 6：Xcode 版本不兼容

**症状**：构建时报错 Xcode 版本过低。

**解决方案**：

```bash
# 检查 Xcode 版本
xcodebuild -version

# 更新 Xcode
# App Store > 更新 > Xcode

# 或使用 Xcode Beta
```

### 问题 7：No bundle URL present（最常见）

**症状**：应用启动后显示红色错误：

> No bundle URL present.
> Make sure you're running a packager server or have included a .jsbundle file in your application bundle.

**原因**：应用无法连接到 Metro 打包服务器。

**解决方案（按顺序尝试）**：

#### 方案 1：重新启动 Metro 服务器

```bash
# 1. 在 Metro 终端按 Ctrl + C 停止服务器
# 2. 重启并重置缓存
pnpm start --reset-cache
```

#### 方案 2：重新加载应用

在 iOS 模拟器中：
- 按 `Cmd + R` 重新加载
- 或按 `Cmd + D` 打开开发者菜单，选择 **Reload**

#### 方案 3：配置调试服务器地址

1. 在模拟器中按 `Cmd + D`
2. 选择 **Dev Settings**
3. 选择 **Debug server host & port for device**
4. 输入 `localhost:8081`
5. 按 `Cmd + R` 重新加载

#### 方案 4：检查 Metro 状态

```bash
# 检查 Metro 是否在运行
curl http://localhost:8081

# 如果返回内容，说明 Metro 正常运行
# 如果连接拒绝，说明 Metro 没有运行
```

#### 方案 5：清理并重新构建

```bash
# 1. 停止 Metro（Ctrl + C）

# 2. 清理缓存
cd ios
rm -rf build
rm -rf ~/Library/Developer/Xcode/DerivedData

# 3. 重启 Metro
pnpm start --reset-cache

# 4. 在模拟器中按 Cmd + R
```

#### 方案 6：检查 Metro 配置

确保 `metro.config.js` 配置正确：

```javascript
// metro.config.js（根目录）
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

> [!tip] 预防措施
> 在运行 `pnpm ios` 之前，确保 Metro 服务器已经启动并显示 "info Dev server ready"。

---

## 开发技巧

### 技巧 1：快速重启应用

在 iOS 模拟器中：
- 按 `Cmd + R` 重新加载
- 按 `Cmd + D` 打开开发者菜单

### 技巧 2：清理缓存

```bash
# 清理所有缓存
rm -rf node_modules
rm -rf packages/*/node_modules
rm -rf ios/Pods
rm -rf ios/build
pnpm install
cd ios && pod install
```

### 技巧 3：切换模拟器

```bash
# 列出可用模拟器
xcrun simctl list devices available

# 运行指定模拟器
npx react-native run-ios --simulator="iPhone 15"
```

### 技巧 4：查看日志

```bash
# 查看 Metro 日志
pnpm start

# 查看 iOS 构建日志
# 在 Xcode 中：View > Navigators > Report Navigator
```

### 技巧 5：使用热重载

1. 在模拟器中按 `Cmd + D`
2. 选择 `Enable Hot Reloading` 或 `Enable Live Reload`

---

## 发布流程

### 1. 构建 Release 版本

```bash
# iOS Release
npx react-native build-ios --mode release

# 或在 Xcode 中
# Product > Archive
```

### 2. 生成 JS Bundle

```bash
# 为 iOS 生成 bundle
npx react-native bundle \
  --platform ios \
  --dev false \
  --entry-file index.js \
  --bundle-output ios/main.jsbundle \
  --assets-dest ios
```

### 3. 上传到 App Store

```bash
# 安装 fastlane（可选）
brew install fastlane

# 使用 Xcode 手动上传
# Xcode > Product > Archive > Distribute App
```

---

## 相关文档

- [A01-项目架构](./A01-项目架构.md)
- [[B02-开发调试|开发调试指南]]
- [[A02-打包构建|打包构建指南]]

---

## 更新日志

- **2024-01-15**: 初始版本创建
- 添加完整 iOS 开发流程
- 添加常见问题解决方案

# MyRnApp

这是一个使用 React Native 构建的跨平台移动应用项目，支持 Android、iOS 和 Web。

## 技术栈

- **React Native**: 0.74.7
- **React Navigation**: 导航方案
- **MobX State Tree**: 状态管理
- **TypeScript**: 类型支持
- **pnpm**: 包管理工具
- **Turbo**: 构建工具

## 项目结构

```
MyRnApp/
├── packages/
│   ├── app/          # React Native 移动端应用
│   ├── shared/       # 共享代码库（组件、工具、状态管理等）
│   └── web/          # Web 端应用
└── docs/             # 项目文档
```

## 前置条件

确保你已经完成以下环境配置：

- **Node.js**: >= 18
- **pnpm**: 8.15.0
- **Android Studio**: 用于 Android 开发（需配置 ANDROID_HOME 环境变量）
- **Xcode**: 用于 iOS 开发（仅 macOS）
- **React Native 环境**: 参考 [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup)

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发模式

#### Android 开发模式

```bash
pnpm android
```

这个命令会：
1. 启动 Metro 打包服务器
2. 构建 Android 应用
3. 在模拟器或真机上安装并启动应用

#### iOS 开发模式（macOS）

```bash
pnpm ios
```

#### Web 开发模式

```bash
pnpm dev:web
```

#### 同时启动 App 和 Web

```bash
pnpm dev:all
```

### 仅启动 Metro 服务器

```bash
pnpm dev:app
```
# 1. 清理缓存（如果需要）
pnpm clean:cache

# 2. 启动 Metro 服务器
pnpm dev:app

# 3. 在另一个终端构建 Android
pnpm android
## 可用命令

| 命令 | 说明 |
|------|------|
| `pnpm android` | 启动 Android 开发模式 |
| `pnpm ios` | 启动 iOS 开发模式 |
| `pnpm dev:app` | 仅启动 Metro 服务器 |
| `pnpm dev:web` | 启动 Web 开发模式 |
| `pnpm dev:all` | 同时启动 App 和 Web |
| `pnpm build:app:android` | 构建 Android 生产版本 |
| `pnpm build:app:ios` | 构建 iOS 生产版本 |
| `pnpm build:web` | 构建 Web 生产版本 |
| `pnpm lint` | 运行代码检查 |
| `pnpm test` | 运行测试 |
| `pnpm typecheck` | 运行 TypeScript 类型检查 |

## 调试技巧

### Android 调试

在 Android 设备/模拟器上：
- 按 `Ctrl + M` 或摇一摇设备打开开发者菜单
- 选择 "Reload" 重新加载应用
- 选择 "Debug" 开启远程调试
- 选择 "Show Inspector" 查看组件树

### iOS 调试

在 iOS 模拟器上：
- 按 `Cmd ⌘ + D` 打开开发者菜单
- 按 `Cmd ⌘ + R` 重新加载应用

## 文档

更多详细文档请参考 [docs/](file:///e:\workspace\MyRnApp\docs) 目录：

- [项目架构](file:///e:\workspace\MyRnApp\docs\A01-项目架构.md)
- [安装命令](file:///e:\workspace\MyRnApp\docs\B01-安装命令.md)
- [开发调试](file:///e:\workspace\MyRnApp\docs\B02-开发调试.md)
- [打包构建](file:///e:\workspace\MyRnApp\docs\A02-打包构建.md)

## 故障排除

如果遇到问题，请查看：
- React Native [官方故障排除指南](https://reactnative.dev/docs/troubleshooting)
- 项目 [开发调试文档](file:///e:\workspace\MyRnApp\docs\B02-开发调试.md)

## 学习更多

- [React Native 官网](https://reactnative.dev)
- [React Navigation](https://reactnavigation.org/)
- [MobX State Tree](https://mobx-state-tree.js.org/)

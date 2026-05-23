# MyRnApp

跨平台移动应用 Monorepo，支持 Android、iOS 和 Web。

## 技术栈

- **React Native** 0.74.7
- **React Navigation** — App 导航
- **React Router** — 独立 H5 路由
- **MobX State Tree** — 状态管理
- **TypeScript** — 类型支持
- **pnpm + Turbo** — 包管理与构建

## 项目结构

```
MyRnApp/
├── packages/
│   ├── app/          # React Native 移动端 + RNW
│   ├── shared/       # 共享组件、hooks、models、theme
│   ├── web/          # 独立 H5 站点
│   └── jsbridge/     # JSBridge SDK（H5 ↔ App 通信）
├── android/、ios/    # 原生工程
└── docs/             # 项目文档
```

## 前置条件

- **Node.js** >= 18
- **pnpm** 8.15.0
- **Android Studio**（Android 开发，需配置 ANDROID_HOME）
- **Xcode**（iOS 开发，仅 macOS）

## 快速开始

```bash
pnpm install
```

### 开发命令

| 命令 | 说明 |
|------|------|
| `pnpm android` | 启动 Android 开发（Metro + 构建） |
| `pnpm ios` | 启动 iOS 开发（macOS） |
| `pnpm dev:app` | 仅启动 Metro 服务器 |
| `pnpm dev:web` | 独立 H5 开发（Webpack，:3000） |
| `pnpm dev:app:web` | App RNW 开发（Rspack，:3002） |
| `pnpm dev:all` | 并行启动 app + web |
| `pnpm build:web` | 构建 @myapp/web |
| `pnpm build:jsbridge` | 构建 JSBridge UMD |
| `pnpm typecheck` | TypeScript 类型检查 |
| `pnpm lint` | 代码检查 |
| `pnpm test` | 运行测试 |
| `pnpm clean:cache` | 清理 Android 构建缓存 |

### Android 调试流程

```bash
pnpm clean:cache   # 可选，遇到缓存问题时
pnpm dev:app       # 终端 1：启动 Metro
pnpm android       # 终端 2：构建并运行
```

## 文档

完整文档索引（含实现状态标记）见 **[docs/README.md](./docs/README.md)**。

常用文档：

- [项目架构](./docs/A01-项目架构.md)
- [Web 产物打包](./docs/A03-Web产物打包.md)
- [安装命令](./docs/B01-安装命令.md)
- [开发调试](./docs/B02-开发调试.md)
- [JSBridge README](./packages/jsbridge/README.md)

## 故障排除

- [React Native 官方故障排除](https://reactnative.dev/docs/troubleshooting)
- [开发调试文档](./docs/B02-开发调试.md)
- [Android 环境问题修复](./docs/Android环境问题修复指南.md)

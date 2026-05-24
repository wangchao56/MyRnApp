# MyRnApp

跨平台移动应�?Monorepo，支�?Android、iOS �?Web�?

## 技术栈

- **React Native** 0.77.3（自 0.74.7 升级，见 [RN 0.77 迁移指南](./docs/A05-RN077迁移指南.md)�?
- **Nx** �?Monorepo 任务编排（替�?Turborepo�?
- **React Navigation** �?App 导航
- **React Router** �?独立 H5 路由
- **MobX State Tree** �?状态管�?
- **pnpm workspace** �?包管�?

## 项目结构

```
MyRnApp/
├── apps/
�?  ├── mobile/     # @myapp/mobile �?React Native（Android/iOS/RNW�?
�?  └── web/          # @myapp/web �?独立 H5 站点
├── packages/
�?  ├── shared/       # @myapp/shared �?共享组件、hooks、models
�?  └── jsbridge/     # @myapp/jsbridge �?JSBridge SDK
├── android/、ios/    # 原生工程（后续可迁入 apps/mobile�?
└── docs/
```

规划中的平台应用：`apps/windows`、`apps/macos`、`apps/harmony`。详�?[apps/README.md](./apps/README.md)�?

## 快速开�?

```bash
pnpm install
```

### 开发命�?

| 命令 | 说明 |
|------|------|
| `pnpm android` | 启动 Android 开�?|
| `pnpm ios` | 启动 iOS 开发（macOS�?|
| `pnpm dev:mobile` | Metro 开发服务器 |
| `pnpm dev:web` | 独立 H5 开发（:3000�?|
| `pnpm dev:mobile:web` | App RNW 开发（:3002�?|
| `pnpm dev:all` | 并行启动 app + web |
| `pnpm build:web` | 构建 @myapp/web |
| `pnpm build:jsbridge` | 构建 JSBridge UMD |
| `pnpm typecheck` | `nx run-many -t typecheck` |
| `pnpm lint` | `nx run-many -t lint` |
| `pnpm graph` | 打开 Nx 依赖�?|

## 文档

- [文档索引](./docs/README.md)
- [项目架构](./docs/A01-项目架构.md)
- [RN 0.77 迁移指南](./docs/A05-RN077迁移指南.md)
- [Nx 使用指南](./docs/B04-Nx使用指南.md)
- [JSBridge README](./packages/jsbridge/README.md)

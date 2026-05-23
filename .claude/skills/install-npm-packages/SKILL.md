---
name: install-npm-packages
description: 在 pnpm monorepo 项目中安装 npm 包的指南。当用户需要添加依赖、安装包或管理项目依赖时使用此技能。适用于 @myapp/app、@myapp/web、@myapp/shared、@myapp/jsbridge 以及根目录的依赖管理。
---

# NPM 包安装指南

这是一个使用 pnpm workspace + Nx 的 monorepo 项目。

## 项目结构

- `@myapp/app` — `apps/app`，React Native 移动应用
- `@myapp/web` — `apps/web`，Web 应用
- `@myapp/shared` — `packages/shared`，共享组件和工具
- `@myapp/jsbridge` — `packages/jsbridge`，JSBridge SDK

## 安装命令

### 在特定包中安装

```bash
# @myapp/app
pnpm --filter @myapp/app add <package-name>
pnpm app add <package-name>

# @myapp/web
pnpm --filter @myapp/web add <package-name>
pnpm web add <package-name>

# @myapp/shared
pnpm --filter @myapp/shared add <package-name>
pnpm shared add <package-name>

# @myapp/jsbridge
pnpm --filter @myapp/jsbridge add <package-name>
pnpm jsbridge add <package-name>
```

### 在根目录安装（全局共享）

```bash
pnpm add -wD <package-name>   # 开发依赖
pnpm add -w <package-name>    # 生产依赖
```

## 最佳实践

1. **共享依赖优先放在根目录** — 避免重复安装
2. **平台特定依赖放在对应 app** — 如 RN 专属库放在 `@myapp/app`
3. **通用工具库放在 @myapp/shared** — 通过 peerDependencies 声明
4. **内部依赖使用 workspace:\***
5. **安装后运行** `pnpm typecheck`（Nx 编排）

## 验证安装

```bash
pnpm list
pnpm typecheck
pnpm build
```

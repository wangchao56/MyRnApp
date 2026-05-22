---
name: install-npm-packages
description: 在此 monorepo 项目中合理安装 npm 包的指南
---

# MyRnApp 项目 npm 包安装指南

这是一个使用 pnpm 作为包管理器的 monorepo 项目，包含三个主要包：
- @myapp/app - React Native 移动应用
- @myapp/shared - 共享组件和工具
- @myapp/web - Web 应用

## 安装命令

### 在特定包中安装

```bash
# @myapp/app
pnpm --filter @myapp/app add <package-name>
# 或使用便捷脚本
pnpm app add <package-name>

# @myapp/web
pnpm --filter @myapp/web add <package-name>
# 或使用便捷脚本
pnpm web add <package-name>

# @myapp/shared
pnpm --filter @myapp/shared add <package-name>
# 或使用便捷脚本
pnpm shared add <package-name>
```

### 在根目录安装（全局共享）

```bash
# 开发依赖
pnpm add -wD <package-name>

# 生产依赖
pnpm add -w <package-name>
```

### 安装开发依赖

```bash
# 特定包
pnpm app add -D <package-name>

# 根目录
pnpm add -wD <package-name>
```

## 最佳实践

1. **共享依赖优先放在根目录** - 避免重复安装
2. **平台特定依赖放在对应包** - 如 React Native 专属库放在 @myapp/app
3. **通用工具库放在 @myapp/shared** - 通过 peerDependencies 声明
4. **使用 workspace 协议** - 内部依赖使用 workspace:*
5. **安装后运行类型检查** - `pnpm typecheck` 确保类型安全

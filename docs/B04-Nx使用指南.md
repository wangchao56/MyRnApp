# Nx 使用指南

> 适用版本：Nx 21.x  
> 最后更新：2026-05-24

本项目使用 **Nx** 作为 Monorepo 任务编排工具（替代 Turborepo），配合 **pnpm workspace** 管理依赖。

## 为什么用 Nx

| 能力 | 说明 |
|------|------|
| 任务调度 | 统一执行 build / lint / test / typecheck |
| 依赖顺序 | `build` 自动先构建上游库（如 jsbridge → web） |
| 本地缓存 | 未变更的项目跳过重复构建，加速 CI 与本地开发 |
| 依赖可视化 | `nx graph` 查看项目间依赖关系 |
| 按需执行 | 只跑受影响的项目（配合 `--affected`） |

## 工作区结构

```
MyRnApp/
├── nx.json                 # 工作区全局配置
├── apps/
│   ├── app/project.json    # @myapp/app（application）
│   └── web/project.json    # @myapp/web（application）
└── packages/
    ├── shared/project.json # @myapp/shared（library）
    └── jsbridge/project.json
```

### 项目一览

| 项目名 | 类型 | 路径 | 说明 |
|--------|------|------|------|
| `@myapp/app` | application | `apps/app` | RN 主应用 |
| `@myapp/web` | application | `apps/web` | 独立 H5 |
| `@myapp/shared` | library | `packages/shared` | 共享业务库 |
| `@myapp/jsbridge` | library | `packages/jsbridge` | JSBridge SDK |

查看所有项目：

```bash
pnpm nx show projects
```

## 常用命令

### 单项目执行

语法：`nx run <项目名>:<target>`

```bash
# 类型检查
pnpm nx run @myapp/app:typecheck
pnpm nx run @myapp/web:typecheck

# 构建
pnpm nx run @myapp/web:build
pnpm nx run @myapp/jsbridge:build
pnpm nx run @myapp/app:build:web

# 开发（长驻进程）
pnpm nx run @myapp/app:dev          # Metro
pnpm nx run @myapp/web:dev          # Webpack :3000
pnpm nx run @myapp/app:dev:web      # Rspack :3002
```

### 批量执行

语法：`nx run-many -t <target>`

```bash
# 所有项目的 typecheck
pnpm nx run-many -t typecheck

# 指定多个项目
pnpm nx run-many -t lint --projects=@myapp/app,@myapp/web

# 并行启动 dev（app + web）
pnpm nx run-many -t dev --parallel --projects=@myapp/app,@myapp/web
```

### 根目录快捷脚本

根 `package.json` 已封装常用 Nx 命令，可直接使用：

| 命令 | 等价 Nx 命令 |
|------|-------------|
| `pnpm typecheck` | `nx run-many -t typecheck` |
| `pnpm lint` | `nx run-many -t lint` |
| `pnpm test` | `nx run-many -t test` |
| `pnpm build` | `nx run-many -t build` |
| `pnpm build:web` | `nx run @myapp/web:build` |
| `pnpm build:jsbridge` | `nx run @myapp/jsbridge:build` |
| `pnpm dev:app` | `nx run @myapp/app:dev` |
| `pnpm dev:web` | `nx run @myapp/web:dev` |
| `pnpm dev:app:web` | `nx run @myapp/app:dev:web` |
| `pnpm dev:all` | `nx run-many -t dev --parallel --projects=@myapp/app,@myapp/web` |
| `pnpm graph` | `nx graph` |

> **说明**：`pnpm android`、`pnpm ios` 等原生 CLI 命令暂未纳入 Nx target，仍由根脚本直接调用 React Native CLI。

## 依赖图

```bash
pnpm graph
# 或
pnpm nx graph
```

浏览器会打开交互式依赖图，可查看：

- `@myapp/web` → 依赖 `@myapp/shared`、`@myapp/jsbridge`
- `@myapp/app` → 依赖 `@myapp/shared`、`@myapp/jsbridge`
- `@myapp/shared` → 依赖 `@myapp/jsbridge`

## 任务与缓存

### target 定义位置

每个项目的 `project.json` 声明 **targets**，通过 `nx:run-script` 执行对应 `package.json` 中的 npm script：

```json
{
  "name": "@myapp/web",
  "targets": {
    "build": {
      "executor": "nx:run-script",
      "options": { "script": "build" },
      "dependsOn": ["^build"]
    }
  }
}
```

- `^build`：先构建所有**依赖项目**的 `build` target  
  例如构建 `@myapp/web` 前会先构建 `@myapp/jsbridge`

### 全局默认（nx.json）

```json
"targetDefaults": {
  "build": {
    "dependsOn": ["^build"],
    "cache": true
  },
  "typecheck": { "cache": true },
  "dev": { "cache": false }
}
```

| target | 是否缓存 | 说明 |
|--------|----------|------|
| `build` | ✅ | 产出物缓存到 `.nx/cache` |
| `lint` / `test` / `typecheck` | ✅ | 输入未变则跳过 |
| `dev` / `clean` | ❌ | 长驻进程或清理操作不缓存 |

### 跳过缓存

```bash
pnpm nx run @myapp/web:build --skip-nx-cache
pnpm nx run-many -t typecheck --skip-nx-cache
```

### 清理缓存

```bash
# 仅 Nx 缓存
pnpm nx reset

# Nx + Android 等（根脚本）
pnpm clean:cache
```

## 只跑受影响的项目

基于 Git 变更，仅执行受影响项目（适合 CI 与本地快速验证）：

```bash
# 相对 main 分支的受影响项目
pnpm nx affected -t typecheck
pnpm nx affected -t lint
pnpm nx affected -t build

# 指定 base
pnpm nx affected -t typecheck --base=main --head=HEAD
```

## 新增项目（以 apps/windows 为例）

1. **创建目录与 package.json**

```bash
mkdir -p apps/windows
```

```json
{
  "name": "@myapp/windows",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "react-native run-windows",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@myapp/shared": "workspace:*"
  }
}
```

2. **添加 project.json**

```json
{
  "name": "@myapp/windows",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "apps/windows/src",
  "projectType": "application",
  "tags": ["scope:app", "platform:windows"],
  "targets": {
    "dev": {
      "executor": "nx:run-script",
      "options": { "script": "dev" }
    },
    "typecheck": {
      "executor": "nx:run-script",
      "options": { "script": "typecheck" }
    }
  }
}
```

3. **确认 workspace 已包含**（`pnpm-workspace.yaml` 已有 `apps/*`，无需改）

4. **验证**

```bash
pnpm install
pnpm nx show projects   # 应出现 @myapp/windows
pnpm nx run @myapp/windows:typecheck
```

5. **（可选）根 package.json 添加快捷脚本**

```json
"dev:windows": "nx run @myapp/windows:dev"
```

## 项目标签（tags）

用于过滤与约束依赖：

| 标签 | 项目 |
|------|------|
| `scope:app` | app、web |
| `scope:shared` | shared、jsbridge |
| `platform:mobile` | app |
| `platform:web` | web |
| `type:lib` | shared、jsbridge |

按标签批量执行：

```bash
pnpm nx run-many -t typecheck --projects=tag:scope:app
pnpm nx run-many -t lint --projects=tag:scope:shared
```

## CI 中的用法

GitHub Actions 已配置为 Nx 命令（见 `.github/workflows/ci.yml`）：

```yaml
- run: pnpm nx run-many -t typecheck
- run: pnpm nx run-many -t lint
- run: pnpm nx run-many -t test
- run: pnpm nx run @myapp/web:build
```

CI 环境可开启 Nx Cloud 进一步共享缓存（可选，需单独配置）。

## 与 pnpm 的配合

```bash
# 在特定包安装依赖（与 Nx 无关，仍用 pnpm filter）
pnpm --filter @myapp/app add some-package
pnpm app add some-package

# 安装后验证
pnpm nx run @myapp/app:typecheck
```

依赖安装见 [B01-安装命令](./B01-安装命令.md) 与 [install-npm-packages 技能](../.claude/skills/install-npm-packages/SKILL.md)。

## 故障排除

### `tsc` 找不到（Windows）

若 `nx run typecheck` 报 `Cannot find module '.../typescript/bin/tsc'`：

```bash
pnpm install
pnpm exec tsc --noEmit -p apps/app
```

或在各包 `package.json` 中将 `"typecheck": "tsc --noEmit"` 改为 `"typecheck": "pnpm exec tsc --noEmit"`。

### 项目未被 Nx 识别

确认存在 `project.json` 且 `name` 与 `package.json` 的 `name` 一致，然后：

```bash
pnpm nx show projects
```

### 缓存导致结果异常

```bash
pnpm nx reset
pnpm nx run @myapp/web:build --skip-nx-cache
```

### 查看 target 详情

```bash
pnpm nx show project @myapp/web
pnpm nx show project @myapp/web --web   # 浏览器查看
```

## 相关文档

- [A01-项目架构](./A01-项目架构.md)
- [A03-Web产物打包](./A03-Web产物打包.md)
- [apps/README.md](../apps/README.md)
- [Nx 官方文档](https://nx.dev/getting-started/intro)

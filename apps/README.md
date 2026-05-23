# Apps

可部署的应用入口，按平台划分。

## 当前应用

| 目录 | 包名 | 平台 | 说明 |
|------|------|------|------|
| [app/](./app/) | `@myapp/app` | Android / iOS / RNW | React Native 主应用 |
| [web/](./web/) | `@myapp/web` | Web (H5) | 独立 H5 站点，Bridge 联调 |

## 规划中的平台应用

以下目录将在对应平台接入时创建，共享 `@myapp/shared` 与 `@myapp/jsbridge`：

| 规划目录 | 平台 | 技术栈 |
|----------|------|--------|
| `apps/windows/` | Windows 桌面 | react-native-windows |
| `apps/macos/` | macOS 桌面 | react-native-macos |
| `apps/harmony/` | HarmonyOS | react-native-harmony |

> 原生工程（`android/`、`ios/`）目前仍在仓库根目录，后续可迁入 `apps/app/` 以统一多平台结构。

## Nx 命令

```bash
nx run @myapp/app:typecheck
nx run @myapp/web:build
nx run-many -t typecheck
nx graph
```

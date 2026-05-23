## 报错现象

运行 `pnpm android` 时，Gradle 在**配置阶段**就失败了，核心信息是：

```
:ReactNative:Running '[node, -e, try {console.log(require('@react-native-community/cli').bin);} ...]' command failed.
Process 'command 'node'' finished with non-zero exit value 268435659
```

出错位置在 `native_modules.gradle`：React Native 自动链接原生模块时会执行 `node`，但 Gradle 里这次调用失败了。

---

## 原因分析

1. **在终端里直接跑 `node` 是正常的**  
   说明 Node/Volta 本身没问题。

2. **问题出在 Gradle Daemon 的环境**  
   Gradle 会长期驻留一个 Daemon 进程。如果这个 Daemon 是很早以前（比如从 Android Studio、或 PATH 不完整的环境）启动的，它内部的 `PATH` 里可能**没有** Volta 的 Node。

3. **`native_modules.gradle` 写死了 `node` 命令**  
   它不会读你 `gradle.properties` 里曾经写的 `nodeExecutable`，只会执行系统 PATH 里的 `node`。Daemon 找不到或找错，就会报 `268435659` 这类异常退出码。

4. **临时验证**  
   执行 `android\gradlew.bat --stop` 停掉旧 Daemon 后，再构建往往就能过——说明是**缓存的旧环境**，不是项目代码写错。

---

## 我做了什么

### 1. 立刻恢复构建（一次性）

```powershell
cd e:\workspace\MyRnApp\android
.\gradlew.bat --stop
cd ..
pnpm android
```

停掉旧 Daemon，让 Gradle 用当前 shell 里正确的 PATH 重新起一个 Daemon。

### 2. 防止以后再犯（改仓库配置）

**`android/gradlew.bat`** — 在启动 Gradle **之前** 把 Node 放进 PATH，并尽量设置 `NODE_BINARY`：

- 优先用 `C:\Program Files\Volta\node.exe`
- 否则用 `where node` 解析
- 把 Node 所在目录 prepend 到 `PATH`

这样以后无论谁通过 `gradlew` 启动 Daemon，配置阶段都能找到 `node`。

**`android/app/build.gradle`** — 在 `react { }` 里增加：

```gradle
def nodeFromEnv = System.getenv("NODE_BINARY")
if (nodeFromEnv != null && !nodeFromEnv.isBlank()) {
    nodeExecutableAndArgs = [nodeFromEnv]
}
```

打包/打 bundle 时也会用绝对路径，不依赖 Daemon 里模糊的 `node`。

**`android/gradle.properties`** — 删掉了本机硬编码路径：

```properties
nodeExecutable=C:\Users\jienix\AppData\Local\Volta\tools\image\node\22.22.3\node.exe
```

这种路径换 Node 版本或换电脑就会失效，而且 `native_modules.gradle` 本来也不会读它。

---

## 和后面那个 Metro 报错的区别

| 问题 | 命令 | 原因 | 处理 |
|------|------|------|------|
| Gradle / Node | `pnpm android` | Gradle Daemon PATH 里没有 Node | `gradlew --stop` + 改 `gradlew.bat` |
| Metro 模块找不到 | `pnpm dev:app` | `HybridWebView` 里 `../bridge` 路径写错 | 改成 `../../bridge` |

这是两件独立的事：一个是 **Android 原生构建**，一个是 **JS 打包路径**。

---

## 若 Android Studio 里又出现同样 Node 错误

在 Studio 自带 Terminal 里再执行一次：

```powershell
cd android
.\gradlew.bat --stop
```

然后重新 Sync / Run。Studio 起的 Daemon 有时仍不带 Volta PATH，停掉后会按 `gradlew.bat` 里新逻辑重建。
# Android 媒体保存功能测试指南

## 已完成的工作

### 1. 安装依赖
已成功安�?`@react-native-camera-roll/camera-roll@^7.10.2` 到根目录依赖中�?

### 2. Android 权限配置
已在 `android/app/src/main/AndroidManifest.xml` 中添加以下权限：
- `READ_EXTERNAL_STORAGE` - 读取外部存储
- `WRITE_EXTERNAL_STORAGE` - 写入外部存储
- `READ_MEDIA_IMAGES` - Android 13+ 读取图片
- `READ_MEDIA_VIDEO` - Android 13+ 读取视频
- `requestLegacyExternalStorage="true"` - Android 10 向后兼容

### 3. 创建测试页面
已创建专门的测试页面 `MediaSaveTestScreen`，可通过底部导航�?"Media" 标签页访问�?

### 4. 更新�?Hook
`useSaveMedia` hook 已更新为�?
- 跨平台兼容（Web + Native�?
- 自动处理 Android 权限请求
- 支持 Android 不同版本的权限差�?

## 如何�?Android 设备上测�?

### 方法一：使�?Android 模拟�?

1. **打开 Android Studio**
   - 启动 Android Studio
   - 打开 AVD Manager（Android Virtual Device Manager�?

2. **创建或启动模拟器**
   - 点击 "Create Virtual Device"
   - 选择一个设备（�?Pixel 4�?
   - 选择一个系统镜像（�?Android 13, API 33�?
   - 完成设置并启动模拟器

3. **等待模拟器启�?*
   - 确保模拟器完全启动并显示主屏�?

4. **启动 Metro Bundler（如果尚未启动）**
   ```bash
   cd e:\workspace\MyRnApp
   pnpm dev:mobile
   ```

5. **运行应用**
   ```bash
   cd e:\workspace\MyRnApp
   pnpm android
   ```
   
   或者如果只想安�?APK 并手动运行：
   ```bash
   cd android
   ./gradlew installDebug
   ```
   然后在模拟器中手动打开 MyRnApp 应用

### 方法二：使用真机

1. **在手机上启用开发者选项**
   - 打开 "设置" > "关于手机"
   - 连续点击 "版本�? 7 �?
   - 返回设置，找�?"开发者选项"

2. **启用 USB 调试**
   - 在开发者选项中，启用 "USB 调试"
   - （可选）启用 "USB 安装" �?"USB 调试（安全设置）"

3. **连接手机**
   - 使用 USB 线连接手机到电脑
   - 在手机上授权 USB 调试（如果弹出提示）

4. **确认设备连接**
   ```bash
   adb devices
   ```
   应该能看到你的设�?

5. **启动 Metro Bundler**
   ```bash
   pnpm dev:mobile
   ```

6. **运行应用**
   ```bash
   pnpm android
   ```

## 测试步骤

1. **应用启动�?*，底部导航栏应该显示 4 个标签：
   - Home
   - Profile
   - Media（新添加的测试标签）
   - Settings

2. **点击 "Media" 标签**

3. **测试保存图片**
   - 点击 "📷 保存图片" 按钮
   - 如果是首次使用，应用会请求存储权�?
   - 授予权限后，图片会保存到 "MyRnApp Test" 相册
   - 应该看到成功提示�?图片已保存到相册�?

4. **测试保存视频**
   - 点击 "🎬 保存视频" 按钮
   - 视频会保存到同一个相�?
   - 应该看到成功提示�?视频已保存到相册�?

5. **检查相�?*
   - 打开手机相册应用
   - 找到 "MyRnApp Test" 相册
   - 确认图片和视频已成功保存

## 常见问题

### Q: 权限请求没有弹出�?
A: 确保�?`AndroidManifest.xml` 中添加了相应的权限声明�?

### Q: 保存失败，提示权限被拒绝�?
A: 
- 检查是否正确添加了所有必需的权�?
- Android 13+ 需�?`READ_MEDIA_IMAGES` �?`READ_MEDIA_VIDEO`
- Android 10 以下需�?`READ_EXTERNAL_STORAGE` �?`WRITE_EXTERNAL_STORAGE`

### Q: 应用崩溃或报错？
A:
- 确保 Metro bundler 正在运行
- 检查终端中的错误日�?
- 确保 `@react-native-camera-roll/camera-roll` 已正确安�?

### Q: 如何查看保存的文件？
A:
- 打开手机自带的相册应�?
- 查找 "MyRnApp Test" 相册
- 或使用文件管理器进入 `DCIM/MyRnApp Test` 目录

## 技术细�?

### useSaveMedia Hook 功能
- 自动检测平台（Web/Android/iOS�?
- 自动请求所需权限（Android�?
- 支持保存到指定相�?
- 完整的状态管理（loading, error, success�?
- 跨平台兼�?

### 权限处理
```typescript
// Android 13+ (API 33+)
PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO

// Android 12 及以�?
PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
```

### 保存选项
```typescript
await saveMedia(uri, {
  type: 'photo', // �?'video'
  album: 'MyRnApp Test' // 可选，指定相册名称
});
```

## 下一�?

如果测试成功，恭喜你！媒体保存功能已经可以正常工作了�?

你可以：
1. 在其他页面中集成 `useSaveMedia` hook
2. 自定义保存成�?失败的提�?
3. 添加更多的错误处理逻辑
4. 根据需要调整权限请求策�?

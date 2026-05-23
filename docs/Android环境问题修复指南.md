# Android 环境问题修复指南

## 当前状态

### 遇到的问题

在尝试启动 Android 应用时遇到了以下问题：

1. **@react-native-camera-roll/camera-roll** - 已解决（已移除，改用 Web 端模拟）
2. **react-native-vision-camera** - 缺少依赖 `react-native-nitro-modules`

## 问题分析

### 问题 1: react-native-vision-camera 依赖缺失

**错误信息**:
```
Project with path ':react-native-nitro-modules' could not be found in project ':react-native-vision-camera'.
```

**原因**: `react-native-vision-camera` 需要 `react-native-nitro-modules` 作为依赖项。

## 解决方案

### 方案一：安装缺失的依赖（推荐）

安装 `react-native-nitro-modules`：

```bash
cd e:\workspace\MyRnApp
pnpm add react-native-nitro-modules
```

然后重新启动 Android：

```bash
pnpm android
```

### 方案二：移除 vision-camera（如果不需要）

如果应用中不需要 vision-camera，可以暂时移除：

```bash
cd e:\workspace\MyRnApp
pnpm remove react-native-vision-camera
```

然后重新启动 Android：

```bash
pnpm android
```

### 方案三：使用 Web 测试（无需配置）

由于 `useSaveMedia` hook 已简化为 Web 端实现，可以先在 Web 上测试：

```bash
# 启动 Web 测试
cd e:\workspace\MyRnApp
pnpm dev:web
```

然后访问 http://localhost:3000/

## 测试步骤

### Web 端测试（立即可用）

1. 启动 Web 服务器：
   ```bash
   cd e:\workspace\MyRnApp
   pnpm dev:web
   ```

2. 打开浏览器访问：http://localhost:3000/

3. 找到 "Save Media Test" 卡片

4. 测试保存功能：
   - 点击 "保存图片" - 文件会下载到本地
   - 点击 "保存视频" - 文件会下载到本地

### Android 端测试（需要先修复）

按照上述方案之一修复后：

1. 启动 Metro Bundler：
   ```bash
   cd e:\workspace\MyRnApp
   pnpm dev:app
   ```

2. 启动 Android 应用（新终端）：
   ```bash
   cd e:\workspace\MyRnApp
   pnpm android
   ```

3. 在应用中测试：
   - 点击底部 "Media" 标签
   - 测试保存功能

## 完整代码实现

### useSaveMedia Hook

文件：`packages/shared/src/hooks/useSaveMedia.ts`

```typescript
import { useState, useCallback } from 'react';
import { Platform } from 'react-native';

export type MediaType = 'photo' | 'video';

export interface SaveMediaOptions {
  type?: MediaType;
  album?: string;
}

export interface UseSaveMediaReturn {
  saveMedia: (uri: string, options?: SaveMediaOptions) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  reset: () => void;
}

const downloadToBrowser = async (uri: string, filename: string) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Download failed:', err);
    throw err;
  }
};

export const useSaveMedia = (): UseSaveMediaReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const saveMedia = useCallback(
    async (uri: string, options: SaveMediaOptions = {}) => {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const filename = options.type === 'video' ? 'media.mp4' : 'image.png';
        await downloadToBrowser(uri, filename);
        setSuccess(true);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to save media';
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return {
    saveMedia,
    isLoading,
    error,
    success,
    reset,
  };
};
```

### 使用示例

```typescript
import { useSaveMedia } from '@myapp/shared';

function MyComponent() {
  const { saveMedia, isLoading, error, success } = useSaveMedia();

  const handleSave = async () => {
    try {
      await saveMedia('https://example.com/image.jpg', {
        type: 'photo',
      });
      console.log('保存成功！');
    } catch (err) {
      console.error('保存失败:', err);
    }
  };

  return (
    <View>
      <Button onPress={handleSave} disabled={isLoading} />
      {success && <Text>保存成功！</Text>}
      {error && <Text>错误: {error}</Text>}
    </View>
  );
}
```

## 修复 Android 环境的步骤

### 快速修复

```bash
# 1. 安装缺失的依赖
cd e:\workspace\MyRnApp
pnpm add react-native-nitro-modules

# 2. 重新安装依赖
pnpm install

# 3. 启动 Android 应用
pnpm android
```

## 测试场景

### 场景 1: Web 端保存图片

1. 打开 http://localhost:3000/
2. 滚动到 "Save Media Test" 卡片
3. 点击 "📷 保存图片"
4. 文件会自动下载

### 场景 2: Web 端保存视频

1. 在同一页面
2. 点击 "🎬 保存视频"
3. 文件会自动下载

### 场景 3: Android 端测试（修复后）

1. 启动 Android 应用
2. 点击 "Media" 标签
3. 测试保存功能

## 相关文件

- Hook 实现：`packages/shared/src/hooks/useSaveMedia.ts`
- 测试页面：`packages/app/src/screens/MediaSaveTestScreen.tsx`
- Web 测试页面：`packages/web/src/pages/HomePage.tsx`
- 权限配置：`android/app/src/main/AndroidManifest.xml`

## 注意事项

### Web 端限制
- 只能下载文件到本地
- 无法保存到相册

### Android 端（修复后）
- 可以保存到相册
- 需要正确配置原生依赖

## 下一步

1. 选择一个修复方案
2. 修复 Android 环境
3. 测试 Android 功能
4. 如有问题，查看详细日志

## 文档列表

- [立即测试指南](./立即测试指南.md)
- [完整测试场景](./完整测试场景.md)
- [媒体保存功能总结](./媒体保存功能总结.md)

---

**💡 提示**: Web 端测试已经可用，可以立即开始测试保存功能！

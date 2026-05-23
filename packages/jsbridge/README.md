# @myapp/jsbridge

多平台 JSBridge 库，支持 React Native App、微信 H5、小程序和普通浏览器。

## 安装

```bash
pnpm add @myapp/jsbridge
```

## 快速使用

### 在 Web 项目中使用

#### 方式一：ES Module 导入（推荐）

```typescript
import { share, getPlatform, invoke, jsbridge } from '@myapp/jsbridge';

// 获取当前平台
console.log(getPlatform()); // 'rn' | 'wechat-h5' | 'miniprogram' | 'browser'

// 统一分享接口
await share({
  title: '精彩活动',
  desc: '快来参加',
  link: 'https://example.com/activity',
  imgUrl: 'https://example.com/thumb.jpg'
});

// 调用原生接口
if (jsbridge.isInApp()) {
  const userInfo = await invoke('getUserInfo');
  console.log(userInfo);
}
```

#### 方式二：使用独立打包的 UMD 版本

```html
<!-- 引入独立打包文件 -->
<script src="path/to/jsbridge.min.js"></script>

<script>
  // 全局变量 JSBridge 可用
  const { share, getPlatform, jsbridge } = JSBridge;
  
  console.log(getPlatform());
  
  share({
    title: '精彩活动',
    desc: '快来参加',
    link: 'https://example.com/activity'
  });
</script>
```

### 在 React Native 项目中使用

App 端的 Bridge handler 在 `@myapp/app` 包内，不在 jsbridge 包中：

```typescript
// packages/app/src/components/HybridWebView/index.tsx
import { bridgeHandlers } from '../../bridge/bridgeHandlers';

// 处理来自 WebView 的消息
const handleMessage = async (event: WebViewMessageEvent) => {
  const { msgId, action, data } = JSON.parse(event.nativeEvent.data);
  const handler = bridgeHandlers[action];

  if (handler) {
    const result = await handler(data);
  }
};
```

可用 actions 见 `packages/app/src/bridge/bridgeHandlers.ts`。

## 构建

```bash
# 构建所有版本
pnpm build

# 构建过程包括：
# - ESM 版本 (dist/esm/)
# - CommonJS 版本 (dist/cjs/)
# - 类型定义 (dist/types/)
# - UMD 独立打包版本 (dist/umd/jsbridge.min.js)
```

## API 文档

### 核心类

- `jsbridge`: 全局单例实例

### 主要方法

- `invoke<T, R>(action: string, data?: T): Promise<R>`: 调用原生接口
- `share(options: ShareOptions): Promise<any>`: 统一分享接口
- `isInApp(): boolean`: 检查是否在 RN App 中
- `isInMiniProgram(): boolean`: 检查是否在小程序中
- `isInWechat(): boolean`: 检查是否在微信中
- `getPlatform(): PlatformType | null`: 获取当前平台类型
- `onAppEvent(eventType: string, handler: (data: any) => void): () => void`: 订阅 App 事件
- `offAppEvent(eventType: string): void`: 取消订阅 App 事件
- `destroy(): void`: 销毁实例，清理资源

### 类型导出

- `ShareOptions`: 分享配置选项
- `ShareScene`: 分享场景类型
- `PlatformType`: 平台类型
- `BridgeRequest`: 桥接请求类型
- `BridgeResponse`: 桥接响应类型

## 项目结构

```
packages/jsbridge/
├── src/
│   ├── index.ts          # 主入口
│   ├── types.ts          # 类型定义
│   ├── env.ts            # 环境检测
│   ├── JSBridge.ts       # 核心类
│   └── share-adapters.ts # 分享适配器
├── dist/
│   ├── esm/              # ES Module 版本
│   ├── cjs/              # CommonJS 版本
│   ├── types/            # 类型定义
│   └── umd/              # UMD 打包版本
│       └── jsbridge.min.js
├── package.json
├── tsconfig.json
├── webpack.config.js
└── README.md
```

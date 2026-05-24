# React Native WebView 优化指南

## 概述

本文档总结了对项目中 `react-native-webview` 组件的全面优化工作，包括性能提升、错误处理增强、JS 注入优化等内容。

## 目录

- [主要优化内容](#主要优化内容)
- [API 变更](#api-变更)
- [使用示例](#使用示例)
- [关键文件说明](#关键文件说明)
- [最佳实践](#最佳实践)

---

## 主要优化内容

### 1. 性能优化

| 优化项 | 说明 |
|--------|------|
| 硬件加速 | `androidLayerType="hardware"` 开启硬件加速 |
| 缓存优化 | `cacheEnabled` 启用缓存 |
| Cookie 支持 | `thirdPartyCookiesEnabled` 启用第三方 Cookie（Android） |
| 自适应缩放 | `scalesPageToFit` 优化页面显示 |

### 2. JS 注入优化

- **注入时机改进**：使用 `injectedJavaScriptBeforeContentLoaded` 在内容加载前注入
- **就绪事件**：新增 `hybridWebViewReady` 自定义事件
- **消息队列**：实现消息队列机制，避免在 WebView 准备前发送消息失败

### 3. 错误处理增强

- **HTTP 错误处理**：新增 `onHttpError` 处理 HTTP 状态码
- **自动重试**：添加最大重试次数配置（默认 3 次）
- **白名单拦截**：URL 白名单检查和拦截
- **默认错误 UI**：提供美观的默认错误组件

### 4. JSBridge 改进

- **等待就绪**：新增 `waitForBridgeReady()` 函数
- **状态检查**：新增 `isBridgeReady()` 函数
- **消息队列 TTL**：消息 TTL 机制，防止内存泄漏
- **回调清理**：自动清理过期回调

### 5. 功能增强

- **扩展 ref 接口**：
  - `goBack()` / `goForward()` 导航
  - `clearCache()` 清除缓存
  - `clearHistory()` 清除历史
- **配置项**：
  - `enableDebug` 调试日志控制
  - `maxRetryCount` 重试次数控制
- **默认组件**：内置 Loading 和 Error 组件

---

## API 变更

### HybridWebView 组件

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `source` | WebViewSource | 必填 | WebView 资源 |
| `whitelist` | string[] | [] | URL 白名单 |
| `enableDebug` | boolean | __DEV__ | 是否启用调试日志 |
| `maxRetryCount` | number | 3 | 最大重试次数 |
| `renderLoading` | () => ReactNode | 默认加载组件 | 自定义加载组件 |
| `renderError` | (error) => ReactNode | 默认错误组件 | 自定义错误组件 |
| `onBridgeMessage` | (msg) => void | - | 接收桥接消息 |
| `onAppEvent` | (type, data) => void | - | 接收 App 事件 |

#### Ref 接口

```typescript
interface HybridWebViewRef {
  sendToH5: (response: BridgeResponse) => void;
  reload: () => void;
  goBack: () => boolean;
  goForward: () => boolean;
  clearCache: () => void;
  clearHistory: () => void;
}
```

### JSBridge API

```typescript
// 等待桥接就绪
waitForBridgeReady(): Promise<void>;

// 检查桥接状态
isBridgeReady(): boolean;

// 已有的 API
invoke<T, R>(action: string, data?: T): Promise<R>;
share(options: ShareOptions): Promise<any>;
isInApp(): boolean;
isInMiniProgram(): boolean;
isInWechat(): boolean;
getPlatform(): PlatformType | null;
onAppEvent(eventType: string, handler: Function): () => void;
offAppEvent(eventType: string): void;
```

---

## 使用示例

### 基本使用

```tsx
import React, { useRef } from 'react';
import { HybridWebView, HybridWebViewRef } from '@/components/HybridWebView';

function WebViewPage() {
  const webViewRef = useRef<HybridWebViewRef>(null);

  return (
    <HybridWebView
      ref={webViewRef}
      source={{ uri: 'https://example.com' }}
    />
  );
}
```

### 高级配置

```tsx
import React from 'react';
import { Text, View, Button } from 'react-native';
import { HybridWebView, HybridWebViewRef } from '@/components/HybridWebView';

function AdvancedWebViewPage() {
  const webViewRef = useRef<HybridWebViewRef>(null);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', padding: 8, gap: 8 }}>
        <Button title="返回" onPress={() => webViewRef.current?.goBack()} />
        <Button title="前进" onPress={() => webViewRef.current?.goForward()} />
        <Button title="刷新" onPress={() => webViewRef.current?.reload()} />
        <Button title="清除缓存" onPress={() => webViewRef.current?.clearCache()} />
      </View>
      
      <HybridWebView
        ref={webViewRef}
        source={{ uri: 'https://example.com' }}
        whitelist={['example.com', 'trusteddomain.com']}
        enableDebug={__DEV__}
        maxRetryCount={3}
        
        renderLoading={() => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>正在加载...</Text>
          </View>
        )}
        
        renderError={(error) => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>加载失败: {error.message}</Text>
            <Button title="重试" onPress={() => webViewRef.current?.reload()} />
          </View>
        )}
        
        onBridgeMessage={(msg) => {
          console.log('收到桥接消息:', msg);
        }}
      />
    </View>
  );
}
```

### 在 H5 页面中使用 JSBridge

```javascript
import { waitForBridgeReady, invoke } from '@myapp/jsbridge';

// 等待桥接就绪
waitForBridgeReady().then(async () => {
  try {
    const userInfo = await invoke('getUserInfo');
    console.log('用户信息:', userInfo);
  } catch (err) {
    console.error('获取用户信息失败:', err);
  }
});

// 监听 App 事件
import { onAppEvent } from '@myapp/jsbridge';

const unsubscribe = onAppEvent('themeChanged', (data) => {
  console.log('主题变更:', data);
});

// 取消监听
// unsubscribe();
```

---

## 关键文件说明

### 1. apps/app/src/components/HybridWebView/index.tsx

主要的 WebView 封装组件，包含所有优化逻辑。

**核心功能：**
- WebView 配置和性能优化
- 桥接消息处理
- 错误处理和重试机制
- 默认 UI 组件

**相关代码：** [HybridWebView 组件](file:///e:/workspace/MyRnApp/apps/app/src/components/HybridWebView/index.tsx)

### 2. packages/jsbridge/src/JSBridge.ts

JSBridge 核心逻辑，优化了消息发送和就绪管理。

**核心功能：**
- 就绪状态管理
- 消息队列处理
- 超时和错误处理

**相关代码：** [JSBridge 实现](file:///e:/workspace/MyRnApp/packages/jsbridge/src/JSBridge.ts)

### 3. packages/jsbridge/src/index.ts

导出新增的 API 函数。

**相关代码：** [JSBridge 入口](file:///e:/workspace/MyRnApp/packages/jsbridge/src/index.ts)

---

## 最佳实践

### 1. 错误处理

```tsx
<HybridWebView
  renderError={(error) => (
    <View>
      <Text>页面加载失败</Text>
      <Text>错误代码: {error.code}</Text>
      {error.url && <Text>URL: {error.url}</Text>}
    </View>
  )}
/>
```

### 2. 白名单配置

只允许访问信任的域名：

```tsx
<HybridWebView
  whitelist={['yourdomain.com', 'trustedsite.com']}
  source={{ uri: 'https://yourdomain.com/page' }}
/>
```

### 3. 在 H5 中正确初始化

```javascript
// H5 页面代码
import { waitForBridgeReady, invoke, isBridgeReady } from '@myapp/jsbridge';

async function init() {
  if (!isBridgeReady()) {
    await waitForBridgeReady();
  }
  
  const userInfo = await invoke('getUserInfo');
  // 使用用户信息...
}

init();
```

### 4. 调试模式

在开发环境启用详细日志：

```tsx
<HybridWebView
  enableDebug={__DEV__}
  // ...
/>
```

---

## 向后兼容性

所有优化都保持向后兼容，现有代码无需修改即可正常运行。新增功能为可选使用。

---

## 更新日志

### v2.0.0 (2026-05-24)

#### 新增
- 硬件加速配置
- HTTP 错误处理
- 自动重试机制
- URL 白名单功能
- 消息队列机制
- `waitForBridgeReady()` API
- `isBridgeReady()` API
- 扩展的 ref 接口
- 默认 Loading 和 Error 组件

#### 改进
- 优化 JS 注入时机
- 增强错误处理
- 改进日志输出
- 优化性能配置

#### 修复
- 修复 WebView 未就绪时发送消息失败的问题
- 改进回调清理机制，防止内存泄漏

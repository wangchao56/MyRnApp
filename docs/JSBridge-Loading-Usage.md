# JSBridge Loading 控制功能

## 概述

新增的 Loading 控制功能允许 H5 页面通过 JSBridge 控制 App 端的 Loading 显示与隐藏，同时支持双向状态同步。

## 功能特性

1. **H5 触发显示**：H5 可以通过 JSBridge 调用 `showLoading` 显示 Loading
2. **H5 触发隐藏**：H5 可以通过 JSBridge 调用 `hideLoading` 隐藏 Loading
3. **状态同步**：Loading 状态变化时，会同步到相关监听器
4. **自定义文本**：支持自定义 Loading 文本
5. **WebView 集成**：HybridWebView 组件已集成该功能

---

## H5 端使用

### 引入和初始化

```typescript
import { jsbridge, showLoading, hideLoading, isInApp } from '@myapp/jsbridge';

// 确保桥接就绪
await jsbridge.waitForReady();
```

### 显示 Loading

```typescript
// 简单使用
await showLoading();

// 自定义文本
await showLoading({ text: '数据提交中...' });

// 完整配置 (目前仅支持 text, mask 预留)
await showLoading({ 
  text: '请稍候...',
  mask: true
});
```

### 隐藏 Loading

```typescript
await hideLoading();
```

### 完整示例

```typescript
import { showLoading, hideLoading } from '@myapp/jsbridge';

// 示例 1: 数据加载
async function fetchData() {
  try {
    await showLoading({ text: '加载数据中...' });
    const result = await api.getData();
    // 处理数据
  } catch (error) {
    console.error(error);
  } finally {
    await hideLoading();
  }
}

// 示例 2: 表单提交
async function submitForm(formData) {
  try {
    await showLoading({ text: '正在提交...' });
    await api.submit(formData);
    // 成功处理
  } finally {
    await hideLoading();
  }
}
```

---

## App 端配置

### BridgeTestScreen 使用示例

```tsx
import React from 'react';
import { HybridWebView } from './components/HybridWebView';

export default function BridgeTestScreen() {
  return (
    <HybridWebView
      source={{ uri: 'https://your-h5-page.com' }}
      // 启用 Loading 控制 (默认 true)
      enableNativeLoadingControl={true}
      // 可选：监听 Loading 状态变化
      onLoadingStateChange={(isLoading, text) => {
        console.log('Loading 状态变化:', isLoading, text);
      }}
    />
  );
}
```

### HybridWebView 新增 Props

```typescript
interface HybridWebViewProps {
  // ...其他原有属性
  
  /**
   * 是否启用 H5 控制 Loading 的功能，默认 true
   */
  enableNativeLoadingControl?: boolean;
  
  /**
   * Loading 状态变化回调
   */
  onLoadingStateChange?: (isLoading: boolean, text?: string) => void;
}
```

---

## LoadingManager 使用 (App 端内部使用)

如果需要在 App 端直接控制 Loading 状态，可以使用 `LoadingManager`：

```tsx
import { LoadingManager } from './bridge/bridgeHandlers';

// 订阅状态变化
const unsubscribe = LoadingManager.subscribe(({ isLoading, text }) => {
  console.log('Loading 状态:', isLoading, text);
});

// 设置 Loading 状态
LoadingManager.setState(true, '自定义加载文本');
LoadingManager.setState(false);

// 获取当前状态
const state = LoadingManager.getState();
console.log(state.isLoading, state.text);

// 取消订阅
unsubscribe();
```

---

## 工作原理

### 完整流程

1. H5 调用 `showLoading(options)`
2. JSBridge 将消息发送到 WebView
3. WebView 的 `handleMessage` 接收并调用对应的 handler
4. `showLoading` handler 通过 `LoadingManager` 更新状态
5. HybridWebView 的 `useEffect` 监听到状态变化
6. HybridWebView 更新 UI 显示 Loading 组件
7. H5 调用 `hideLoading` 时重复类似流程，隐藏 UI

### 关键点

- `isControlledByH5` 标记确保 Loading 被 H5 控制时，不会因为 WebView 自动加载事件而隐藏
- Loading 状态共享机制确保多个组件可以同步响应
- SPA 路由时，默认不显示 Loading 提升用户体验

---

## 注意事项

1. **调用时机**：确保 WebView 加载完成后再调用 Loading 相关方法
2. **配对调用**：每次 `showLoading` 后必须调用 `hideLoading`，避免用户无法关闭 Loading
3. **状态一致性**：H5 控制 Loading 时，会覆盖 WebView 自身的加载状态
4. **多页面状态**：多个页面共用同一个 Loading 管理器时，状态会同步
5. **文本长度**：Loading 文本建议不超过 20 个字，避免 UI 显示异常

---

## 未来优化方向

- 支持自定义 Loading 样式
- 添加超时自动隐藏功能
- 支持 Loading 动画定制

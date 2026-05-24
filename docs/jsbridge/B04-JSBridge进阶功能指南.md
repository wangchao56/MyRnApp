# JS Bridge 进阶功能使用指南

> 状态：⚠️ 部分实现�?026-05-24 同步�? 
> - H5 SDK：从 `@myapp/jsbridge` 导入  
> - App handlers：在 `apps/mobile/src/bridge/bridgeHandlers.ts`  
> - 默认超时�?*15 �?*（非 10 秒）

## 一、超时处�?
H5 端的 JSBridge 已经内置了超时机制，默认超时时间�?15 秒（15000ms）�?
### 使用方法

```typescript
import { jsbridge } from '@myapp/jsbridge';

// 使用默认超时�?5秒）
const result = await jsbridge.invoke('getUserInfo');

// 自定义超时（5秒）
const jsbridgeWithCustomTimeout = new JSBridge({ timeout: 5000 });
const result2 = await jsbridgeWithCustomTimeout.invoke('scanQRCode');
```

### 超时行为

- 当请求超时时，Promise 会被 reject，错误信息为：`Action 'xxx' 超时 (xxxms)`
- 超时后会自动清理对应的回调记录，防止内存泄漏

## 二、安全校�?
App 端支持对 WebView 中的 URL 进行白名单校验�?
### 使用方法

```typescript
import { HybridWebView } from '@myapp/mobile';

<HybridWebView
  source={{ uri: 'https://example.com/h5' }}
  whitelist={['example.com', 'trusted-domain.com']}
  // ...其他 props
/>
```

### 校验逻辑

- 如果配置�?`whitelist`，HybridWebView 会在 `onNavigationStateChange` 时校�?URL
- 如果 URL 不在白名单内，会在控制台输出警告
- 可以根据业务需求扩展校验逻辑

## 三、App 主动推�?
支持 App 主动�?H5 推送事件，H5 可以通过 `onAppEvent` 监听这些事件�?
### App 端发送事�?
```typescript
import { bridgeHandlers } from '@myapp/mobile';

// 在某�?handler �?export const bridgeHandlers = {
  // ...
  subscribeNotifications: async () => {
    // 监听推送事件并转发�?H5
    notificationManager.on('message', (message) => {
      webviewRef.current?.injectJavaScript(
        `window.__ON_APP_EVENT__('notification', ${JSON.stringify(message)})`
      );
    });
    return { subscribed: true };
  },
};
```

### H5 端接收事�?
```typescript
import { onAppEvent, offAppEvent } from '@myapp/jsbridge';

useEffect(() => {
  // 监听 App 推送的通知事件
  onAppEvent('notification', (data) => {
    console.log('收到 App 推�?', data);
    // 更新 UI 或执行其他逻辑
  });

  // 清理
  return () => {
    offAppEvent('notification');
  };
}, []);
```

## 四、批量操�?
### 串行调用

```typescript
const results = await Promise.all([
  jsbridge.invoke('getUserInfo'),
  jsbridge.invoke('getToken'),
  jsbridge.invoke('getAppInfo'),
]);
```

### 带错误处理的调用

```typescript
const actions = ['getUserInfo', 'getToken', 'scanQRCode'];

const results = await Promise.allSettled(
  actions.map(action => jsbridge.invoke(action))
);

results.forEach((result, index) => {
  if (result.status === 'fulfilled') {
    console.log(`${actions[index]}:`, result.value);
  } else {
    console.error(`${actions[index]} 失败:`, result.reason);
  }
});
```

## 五、调试技�?
### 开启调试日�?
```typescript
// H5 �?import { jsbridge } from '@myapp/jsbridge';

// 监听所�?invoke 调用
const originalInvoke = jsbridge.invoke.bind(jsbridge);
jsbridge.invoke = async (action, data) => {
  console.log(`[JSBridge] >>> ${action}`, data);
  try {
    const result = await originalInvoke(action, data);
    console.log(`[JSBridge] <<< ${action}`, result);
    return result;
  } catch (error) {
    console.error(`[JSBridge] !!! ${action}`, error);
    throw error;
  }
};
```

### 查看待处理请�?
```typescript
// 获取当前等待响应的请求数�?console.log('Pending requests:', jsbridge.pendingCount);
```

## 六、最佳实�?
1. **统一错误处理**：创建统一的错误处理函数，避免重复代码

```typescript
const invokeWithErrorHandling = async (action: string, data?: any) => {
  try {
    return await jsbridge.invoke(action, data);
  } catch (error: any) {
    showToast(`操作失败: ${error.message}`);
    throw error;
  }
};
```

2. **类型安全**：使�?TypeScript 的类型定义确�?API 调用安全

```typescript
interface UserInfo {
  userId: string;
  name: string;
  email: string;
}

const userInfo = await jsbridge.invoke<UserInfo>('getUserInfo');
```

3. **防止重复提交**：在 UI 层添�?loading 状�?
```typescript
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  if (loading) return;
  setLoading(true);
  try {
    await jsbridge.invoke('submitForm', formData);
  } finally {
    setLoading(false);
  }
};
```

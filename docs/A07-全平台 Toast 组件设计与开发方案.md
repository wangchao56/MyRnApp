# React Native 全平台 Toast 组件设计与开发方案

> 状态：⏳ 待实现，尚未实现（2026-05-24）

## 1. 方案概述

### 1.1 背景

React Native 没有 DOM，无法使用 Web 端的 `ReactDOM.createPortal` 实现全局浮层。本方案基于 `react-native-root-siblings` 库，通过**劫持应用根节点注册过程**，在根组件旁开一个"外挂窗口"，实现跨页面、跨导航栈的全局 Toast 组件。

### 1.2 适用场景

- 跨页面全局提示（成功 / 失败 / 加载）
- 不依赖任何业务组件 state 的独立浮层
- 需要与微信 WeUI 设计规范保持一致的 Toast 交互

### 1.3 技术选型

| 依赖 | 版本 | 作用 |
|------|------|------|
| `react-native-root-siblings` | ^4.x | 提供根节点旁的外挂渲染能力 |
| `react-native` | ≥0.62 | 基础框架 |

> **注意**：RN ≥ 0.62 且启用新架构时，必须用 `RootSiblingParent` 包裹根组件。

---

## 2. 设计原则与规范

### 2.1 微信 WeUI Toast 规范对齐

| 规范项 | 要求 | RN 实现方式 |
|--------|------|-------------|
| **单例约束** | 同时只能显示一个 Toast | 新 Toast 出现时立即销毁旧的 |
| **层级** | 高于所有页面内容 | 通过 `RootSiblings` 挂载到根节点，与应用同层级 |
| **位置** | 屏幕居中 | `justifyContent: 'center'`, `alignItems: 'center'` |
| **蒙层** | Loading 时阻止点击穿透 | `pointerEvents` 控制或透明遮罩 |
| **时长** | 成功/错误 1500~2000ms；Loading 手动控制 | `setTimeout` + 动画预留 |
| **文案** | 不超过 14 个汉字，禁止换行 | `numberOfLines={2}` 兜底截断 |
| **动画** | 淡入淡出 | `Animated` + `useNativeDriver: true` |

### 2.2 核心设计决策

1. **命令式 API**：`toast.success('msg')` 更符合 Toast 的瞬时反馈特性，避免每个页面维护 `visible` state。
2. **单例覆盖**：连续触发时不排队，直接掐断旧的 Toast，保证最新反馈即时呈现。
3. **自包含状态**：不依赖 Redux / Context / Zustand，Toast 生命周期完全自治，避免页面卸载后 Toast 残留。
4. **动画时序绑定**：退场动画结束后才执行销毁，防止视觉闪断。

---

## 3. 架构设计

### 3.1 三层架构

```
┌─────────────────────────────────────────┐
│  第 3 层：API 层（门面模式）              │
│  Toast.success() / loading() / hide()   │
│  职责：单例控制、类型分发、生命周期管理     │
├─────────────────────────────────────────┤
│  第 2 层：挂载层（Portal Adapter）        │
│  RootSiblings                           │
│  职责：将组件插入到应用根节点旁            │
├─────────────────────────────────────────┤
│  第 1 层：视图层（Pure Component）        │
│  ToastView                              │
│  职责：样式、动画、自动销毁回调            │
└─────────────────────────────────────────┘
```

### 3.2 两个核心机制

#### 机制一：单例强制覆盖

```ts
let currentSibling: RootSiblings | null = null;

const show = (...) => {
  if (currentSibling) {
    currentSibling.destroy(); // 立即销毁旧的
  }
  currentSibling = new RootSiblings(<ToastView ... />);
};
```

**为什么不用队列？** Toast 是瞬时反馈，排队会导致延迟叠加，直接覆盖更符合用户直觉。

#### 机制二：动画与销毁的时序绑定

```
调用 show
  → 创建 RootSiblings（opacity = 0）
  → 播放入场动画（200ms 淡入）
  → 等待 duration
  → 播放退场动画（200ms 淡出）
  → 动画结束回调 → 执行 destroy()
```

销毁权交给视图层自己管理，API 层只负责创建，逻辑边界清晰。

---

## 4. 核心实现

### 4.1 根组件配置（App.tsx）

```tsx
import React from 'react';
import { RootSiblingParent } from 'react-native-root-siblings';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <RootSiblingParent>
      <NavigationContainer>
        {/* 你的整个应用 */}
      </NavigationContainer>
    </RootSiblingParent>
  );
}
```

### 4.2 视图层组件（ToastView.tsx）

```tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons'; // 或 react-native-vector-icons

const { width } = Dimensions.get('window');

export type ToastType = 'success' | 'error' | 'loading' | 'info';

interface Props {
  message: string;
  type?: ToastType;
  duration?: number;
  onDestroy: () => void;
}

const ICON_MAP: Record<Exclude<ToastType, 'loading'>, string> = {
  success: 'check-circle',
  error: 'x-circle',
  info: 'info',
};

export default function ToastView({
  message,
  type = 'info',
  duration = 2000,
  onDestroy,
}: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 入场动画
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // 非 loading 自动退场
    if (type !== 'loading') {
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => onDestroy());
      }, duration);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <Animated.View
      style={[styles.container, { opacity: fadeAnim }]}
      pointerEvents="none"
    >
      <View style={styles.content}>
        {type === 'loading' ? (
          <ActivityIndicator color="#fff" style={styles.icon} />
        ) : (
          <Feather
            name={ICON_MAP[type]}
            size={28}
            color="#fff"
            style={styles.icon}
          />
        )}
        <Text style={styles.text} numberOfLines={2}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  content: {
    minWidth: 120,
    maxWidth: width * 0.65,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 8,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
```

### 4.3 API 层封装（toast.ts）

```ts
import React from 'react';
import RootSiblings from 'react-native-root-siblings';
import ToastView, { ToastType } from '../components/Toast/ToastView';

let siblingInstance: RootSiblings | null = null;
let hideTimer: NodeJS.Timeout | null = null;

const destroy = () => {
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
  if (siblingInstance) {
    siblingInstance.destroy();
    siblingInstance = null;
  }
};

const show = (message: string, type: ToastType, duration = 2000) => {
  // 单例：先销毁旧的
  destroy();

  siblingInstance = new RootSiblings(
    <ToastView
      message={message}
      type={type}
      duration={duration}
      onDestroy={destroy}
    />
  );

  // 非 loading 类型自动销毁（预留动画时间）
  if (type !== 'loading') {
    hideTimer = setTimeout(() => destroy(), duration + 300);
  }

  return siblingInstance;
};

export const Toast = {
  /** 纯文本提示 */
  show: (message: string, duration?: number) =>
    show(message, 'info', duration),

  /** 成功提示 */
  success: (message: string, duration?: number) =>
    show(message, 'success', duration),

  /** 错误提示 */
  error: (message: string, duration?: number) =>
    show(message, 'error', duration),

  /** 加载中（需手动调用 Toast.hide() 关闭） */
  loading: (message = '加载中...') =>
    show(message, 'loading', 0),

  /** 手动销毁 */
  hide: destroy,
};
```

---

## 5. 使用方式

### 5.1 基础调用

```tsx
import { Toast } from './utils/toast';

// 任意位置直接调用，无需 import 组件或维护 state
Toast.success('保存成功', 1500);
Toast.error('网络连接失败');
Toast.loading('正在提交...');
```

### 5.2 异步场景（必须配对使用）

```tsx
const submit = async () => {
  Toast.loading('上传中...');
  try {
    await api.upload(data);
    Toast.success('上传成功');
  } catch (e) {
    Toast.error('上传失败');
  } finally {
    // 保险起见，确保 loading 被关闭
    Toast.hide();
  }
};
```

---

## 6. RootSiblings 实现原理

### 6.1 核心问题

RN 没有 DOM，子组件永远被包裹在父组件的视图层级内，无法"穿透"到根层级之上。

### 6.2 解决方案：劫持根组件注册

```
AppRegistry.registerComponent
  → 返回 Wrapper 组件（替代用户原本的 App）
  → Wrapper 内部同时渲染：
      1. 用户应用（OriginalRoot）
      2. 所有外挂组件（siblings）
  → 两者为兄弟节点，外挂组件后渲染，天然覆盖全屏
```

### 6.3 新版本（v4+）组件化方案

```tsx
<RootSiblingParent>  {/* 预留外挂插槽 */}
  <YourApp />
</RootSiblingParent>
```

`RootSiblingParent` 内部维护 siblings 数组，通过 React 状态驱动重渲染。

### 6.4 生命周期流程

```
new RootSiblings(<Toast />)
  → 往全局 siblings 数组 push 一项
  → 触发 RootSiblingParent 状态更新
  → 重新渲染，Toast 画在应用之上
  → 调用 destroy() → 从数组移除 → 再次触发更新 → Toast 消失
```

---

## 7. 最佳实践

### 7.1 线程安全

- 动画必须设置 `useNativeDriver: true`，避免 JS 线程阻塞时 Toast 卡顿。

### 7.2 状态隔离

- Toast 不依赖任何业务组件的 state、Redux、Context。
- 即使调用 Toast 的页面被卸载，Toast 依然正常显示（因为它挂在根节点）。

### 7.3 样式规范

- 背景色使用 `rgba(0, 0, 0, 0.75)` 对齐微信 WeUI 暗色遮罩风格。
- 最大宽度限制为屏幕宽度的 65%，防止横屏或平板设备上过度拉伸。

### 7.4 扩展预留

| 扩展点 | 预留方式 |
|--------|----------|
| 自定义图标 | `type` 字段支持字符串，内部 `switch` 映射，未来可透传 ReactNode |
| 自定义位置 | 样式抽离到 `StyleSheet`，调用时透传 `style` 覆盖 |
| 自定义动画 | 封装 `animateIn` / `animateOut` 函数，支持替换 |
| 点击蒙层关闭 | 外层包 `TouchableWithoutFeedback`，通过 props 控制 |
| 多行文本 | `numberOfLines` 默认 2，自动截断 |

---

## 8. 与 Web 方案对比

| 维度 | Web (ReactDOM.createPortal) | React Native (RootSiblings) |
|------|---------------------------|----------------------------|
| **挂载点** | `document.body` 下动态创建 `div` | `AppRegistry` 根节点旁开窗口 |
| **销毁方式** | `root.unmount()` + `removeChild` | `.destroy()` 方法 |
| **根组件包裹** | 不需要 | **必须**用 `RootSiblingParent` 包裹 |
| **样式体系** | CSS / Tailwind / Styled | StyleSheet（无继承、无 rem） |
| **层级控制** | `z-index` | 无 `zIndex`，靠挂载顺序（后挂载在上） |
| **线程安全** | 无需考虑 | 动画必须 `useNativeDriver: true` |
| **命令式调用** | 全局封装 `toast.success()` | 全局封装 `Toast.success()` |
| **单例实现** | 维护全局 DOM 节点引用 | 维护全局 RootSiblings 实例引用 |

---

## 9. 总结

```
一个单例管全局（API 层）
一个外挂插顶层（挂载层）
一个组件管样式（视图层）
动画结束再销毁（时序机制）
新来旧走不排队（覆盖机制）
```

这套方案不仅适用于 Toast，也适用于全局 Loading、Modal、Notification 等所有"跨页面浮层"场景。其核心思想是：**在 RN 视图树的根部旁边另开一扇门，任何 JS 代码都能随时往屏幕上贴一个视图，完全绕过 React 的父子组件层级约束。**

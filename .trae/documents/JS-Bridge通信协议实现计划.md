# JS Bridge 通信协议实现计划

## 项目概述

将现有的简单回调式 JS Bridge 重构为基于 Promise 的 RPC 架构，实现 H5 与 React Native App 之间优雅的双向通信。

## 实施步骤

### 第一步：创建协议类型定义

**目标**：定义标准的数据结构，确保 H5 和 App 之间的通信格式一致

**文件**：`packages/shared/src/jsbridge/types.ts`

**内容**：
- `BridgeRequest` 接口：包含 `msgId`、`action`、`data`
- `BridgeResponse` 接口：包含 `msgId`、`code`、`data`、`error`
- `ActionHandler` 类型：定义 action 处理函数的签名

### 第二步：重构 H5 端 SDK

**目标**：实现 Promise-based 的 JSBridge 类，替代现有的回调式实现

**文件**：`packages/web/src/jsbridge/JSBridge.ts`

**核心功能**：
1. `invoke(action, data)` 方法：生成 `msgId`，存储 Promise 的 `resolve/reject`，发送消息
2. `receiveMessage(response)` 方法：接收 App 回调，通过 `msgId` 匹配对应的 Promise
3. 全局函数 `window.__RECEIVE_MESSAGE_FROM_APP__` 暴露给 App 调用
4. 超时处理：10 秒超时后自动 reject 并清理
5. 非 App 环境下的 mock 实现

**类型声明**：`packages/web/src/jsbridge/globals.d.ts`

### 第三步：创建 App 端 Action Handlers

**目标**：集中管理所有暴露给 H5 的原生能力

**文件**：`packages/app/src/services/bridgeHandlers.ts`

**初始 handlers**：
- `getUserInfo`：获取用户信息
- `getToken`：获取认证 Token
- `scanQRCode`：调用扫码功能
- `share`：调用分享功能

### 第四步：实现 HybridWebView 组件

**目标**：封装 React Native WebView，处理消息路由分发

**文件**：`packages/app/src/components/HybridWebView/index.tsx`

**核心逻辑**：
1. `sendResponseToH5(msgId, code, data, error)`：通过 `injectJavaScript` 发送响应
2. `onMessage`：解析 H5 消息，路由到对应的 handler
3. Origin 白名单校验（安全性）
4. 支持 HTML string 或 URI source

### 第五步：创建示例页面测试 Bridge

**目标**：创建可运行的示例，验证 Bridge 功能正常

**App 端**：`packages/app/src/screens/BridgeTestScreen.tsx`
- 展示 HybridWebView 组件
- 显示 H5 返回的测试数据

**H5 端**：`packages/web/src/pages/BridgeTestPage.tsx`
- 演示 `JSBridge.invoke()` 的调用方式
- 展示错误处理和超时场景

### 第六步：添加进阶功能

**目标**：满足生产环境需求

1. **超时机制**：H5 端实现带超时的 Promise
2. **安全校验**：App 端校验 WebView URL 是否在白名单内
3. **App 主动推送**：支持 `window.__ON_APP_EVENT__` 接收 App 推送的事件

### 第七步：更新入口文件和导出

**目标**：确保新模块正确导出和初始化

**更新文件**：
- `packages/shared/src/index.ts` - 导出类型定义
- `packages/web/src/App.tsx` - 初始化 JSBridge
- `packages/app/src/App.tsx` - 注册 HybridWebView 路由

## 文件结构变更

```
packages/
├── shared/src/
│   └── jsbridge/
│       └── types.ts              # 新增：协议类型定义
├── web/src/
│   ├── jsbridge/
│   │   ├── JSBridge.ts           # 新增：核心实现
│   │   ├── index.ts              # 修改：导出重构
│   │   └── globals.d.ts          # 新增：全局类型声明
│   └── pages/
│       └── BridgeTestPage.tsx    # 新增：测试页面
└── app/src/
    ├── components/
    │   └── HybridWebView/
    │       └── index.tsx         # 新增：封装 WebView
    ├── services/
    │   └── bridgeHandlers.ts     # 新增：action handlers
    └── screens/
        └── BridgeTestScreen.tsx  # 新增：App 端测试页面
```

## 实现顺序

1. 类型定义（shared）- 其他模块依赖此文件
2. H5 SDK 实现（web）
3. App Handlers（app）
4. HybridWebView 组件（app）
5. 示例页面（web + app）
6. 进阶功能（可选）
7. 集成测试

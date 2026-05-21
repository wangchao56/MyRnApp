# React Native Web 导航迁移方案

## 📋 概述

当前状态：
- `packages/app` (React Native) - 使用 React Navigation
- `packages/web` (React Native Web) - 使用 React Router

目标：
统一使用 React Navigation，实现跨平台导航代码共享

---

## 🎯 方案对比

### 当前方案
| 特性 | React Router | React Navigation |
|------|-------------|-----------------|
| 跨平台支持 | ❌ 仅限 Web | ✅ iOS/Android/Web |
| 代码共享 | ❌ 需要维护两套 | ✅ 90%+ 可共享 |
| 原生体验 | ⚠️ Web 友好 | ✅ 原生手势动画 |
| 包体积 | ✅ 轻量 | ⚠️ 稍大 |
| 社区生态 | ✅ Web 标准 | ✅ React Native 标准 |

---

## 📦 迁移步骤

### 第一步：在 web 包安装依赖

```bash
cd packages/web
pnpm add @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context
```

### 第二步：修改 web 包的入口文件

修改 `packages/web/src/App.tsx`：

```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreProvider } from '@myapp/shared';
import { AppNavigator } from '@myapp/app/src/navigators'; // 共享 app 的导航

const App: React.FC = () => {
  return (
    <StoreProvider>
      <SafeAreaProvider>
        <View style={styles.container}>
          <AppNavigator />
        </View>
      </SafeAreaProvider>
    </StoreProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100vh',
    backgroundColor: '#FFFFFF',
  },
});

export default App;
```

### 第三步：配置 web 包的 webpack 配置

确保 webpack.config.js 需要正确处理 React Navigation 的依赖：

```javascript
// packages/web/webpack.config.js
module.exports = {
  // 确保支持 @react-navigation
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
  },
};
```

### 第四步：移除旧代码清理

删除 `packages/web/src/router/` 目录下的 React Router 相关文件可以删除或归档。

---

## 第五步：调整导航器适配（可选）

如果需要针对 Web 做特定调整，可以创建条件编译：

```tsx
// 在 shared/navigators/AppNavigator.tsx
import { Platform } from 'react-native';

export const AppNavigator: React.FC = () => {
  const isWeb = Platform.OS === 'web';
  
  return (
    <Tab.Navigator
      screenOptions={{
        // Web 特定配置
        ...(isWeb && {
          tabBarStyle: {
            // Web 特定样式
          },
        }),
      }}
    >
      {/* 页面配置 */}
    </Tab.Navigator>
  );
};
```

---

## 📁 迁移前后目录结构

### 迁移前
```
packages/
├── app/
│   └── src/
│       ├── navigators/      # React Navigation
│       └── screens/        # 屏幕组件
└── web/
    └── src/
        ├── router/          # React Router
        └── pages/         # Web 专用页面
```

### 迁移后
```
packages/
├── app/
│   └── src/
│       ├── navigators/      # 共享的导航器
│       └── screens/        # 共享的屏幕组件
└── web/
    └── src/
        └── App.tsx       # 简化的入口文件
```

---

## 🎨 屏幕组件共享

确保 screen 组件是纯跨平台组件，不包含特定平台的代码。

---

## 🚨 注意事项

1. **平台特定代码使用 Platform.OS 判断
2. **某些 API 在 React Native 兼容性
3. **包体积优化
4. **Web 端可以使用 webpack 进行 tree-shaking

---

## ✅ 验证清单

- [ ] 安装依赖
- [ ] 修改 web 入口文件
- [ ] 测试导航功能
- [ ] 测试页面切换
- [ ] 测试底部导航栏
- [ ] 测试性能
- [ ] 移除旧代码

---

## 🔙 回滚方案

如果迁移出现问题，可以回滚到 React Router：

1. 恢复 `package.json 中恢复原来的依赖
2. 恢复 web 包的入口文件

---

## 📊 预期收益

1. **减少维护成本
2. **统一用户体验
3. **代码复用率提升
4. **降低学习曲线

---

*最后更新：2024-05-22

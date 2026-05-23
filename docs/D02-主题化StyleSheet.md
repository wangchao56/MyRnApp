# 主题化 StyleSheet 使用指南

> 状态：✅ 已实现（2026-05-24 同步）  
> 源码：`packages/shared/src/theme/StyleSheet.ts`

## 概述

本项目提供了一个主题化的 StyleSheet 封装，支持自动响应浅色/深色主题切换，提供类型安全的样式定义。

## 核心概念

### 主题系统

项目基于 MobX State Tree 实现主题管理，支持：
- 浅色模式 (`light`)
- 深色模式 (`dark`)
- 主题持久化存储
- 主题切换功能

### 主题 Token

所有样式使用统一的设计 token：

| Token 类型 | 说明 | 示例 |
|-----------|------|------|
| `colors` | 主题化颜色 | `theme.colors.primary` |
| `spacing` | 间距系统 | `theme.spacing.md` |
| `fontSizes` | 字体大小 | `theme.fontSizes.lg` |
| `fontWeights` | 字体粗细 | `theme.fontWeights.semibold` |
| `borderRadius` | 圆角 | `theme.borderRadius.md` |
| `shadows` | 阴影 | `theme.shadows.md` |

## 快速开始

### 1. 导入工具函数

```tsx
import { createStyleSheet, useStyles } from '@myapp/shared';
```

### 2. 定义样式

使用 `createStyleSheet()` 创建样式，支持两种方式：

#### 方式一：函数式（推荐，支持主题）

```tsx
const styles = createStyleSheet((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.bold,
  },
}));
```

#### 方式二：对象式（不支持主题）

```tsx
const styles = createStyleSheet({
  container: {
    backgroundColor: '#fff',
    padding: 16,
  },
});
```

### 3. 在组件中使用

```tsx
const MyComponent = () => {
  const themedStyles = useStyles(styles);
  
  return (
    <View style={themedStyles.container}>
      <Text style={themedStyles.title}>Hello World</Text>
    </View>
  );
};
```

## 完整示例

### 基础组件示例

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { createStyleSheet, useStyles } from '@myapp/shared';

const componentStyles = createStyleSheet((theme) => ({
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.semibold,
    marginBottom: theme.spacing.sm,
  },
  cardContent: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.md,
  },
}));

export const ThemedCard = ({ title, content }) => {
  const styles = useStyles(componentStyles);
  
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardContent}>{content}</Text>
    </View>
  );
};
```

### 按钮组件示例

```tsx
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { createStyleSheet, useStyles } from '@myapp/shared';

const buttonStyles = createStyleSheet((theme) => ({
  button: {
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  text: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.semibold,
  },
  outlineText: {
    color: theme.colors.primary,
  },
}));

interface ButtonProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  onPress: () => void;
}

export const ThemedButton = ({ title, variant = 'primary', onPress }) => {
  const styles = useStyles(buttonStyles);
  
  return (
    <TouchableOpacity 
      style={[styles.button, styles[variant]]} 
      onPress={onPress}
    >
      <Text style={[
        styles.text, 
        variant === 'outline' && styles.outlineText
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
```

## API 参考

### `createStyleSheet<T>(styles: StyleSheetCreator<T> | T)`

创建样式定义。

**参数：**
- `styles`: 可以是样式对象或接收 `theme` 参数的函数

**返回：**
- 样式定义对象，供 `useStyles` 使用

### `useStyles<T>(styleCreator: StyleSheetCreator<T> | T)`

在组件中使用样式的 Hook。

**参数：**
- `styleCreator`: `createStyleSheet` 返回的样式定义

**返回：**
- 主题化后的样式对象（已通过 `StyleSheet.create` 优化）

**依赖：**
- 自动响应 `isDarkMode` 变化
- 使用 `useMemo` 缓存结果，优化性能

### ThemeContext 类型

```typescript
interface ThemeContext {
  colors: ThemedColors;
  spacing: typeof SPACING;
  fontSizes: typeof FONT_SIZES;
  fontWeights: typeof FONT_WEIGHTS;
  borderRadius: typeof BORDER_RADIUS;
  shadows: typeof SHADOWS;
  isDarkMode: boolean;
}
```

## 主题 Token 参考

### 颜色 (Colors)

| Token | 浅色值 | 深色值 | 说明 |
|-------|--------|--------|------|
| `primary` | `#007AFF` | `#007AFF` | 主色调 |
| `secondary` | `#5856D6` | `#5856D6` | 次要色调 |
| `background` | `#FFFFFF` | `#1C1C1E` | 背景色 |
| `surface` | `#F5F5F7` | `#2C2C2E` | 表面色（卡片等） |
| `text` | `#1C1C1E` | `#FFFFFF` | 主要文本 |
| `textSecondary` | `#8E8E93` | `#8E8E93` | 次要文本 |
| `border` | `#E5E5EA` | `#3A3A3C` | 边框色 |
| `success` | `#34C759` | `#34C759` | 成功状态 |
| `warning` | `#FF9500` | `#FF9500` | 警告状态 |
| `error` | `#FF3B30` | `#FF3B30` | 错误状态 |

### 间距 (Spacing)

| Token | 值 |
|-------|----|
| `none` | `0` |
| `xs` | `4` |
| `sm` | `8` |
| `md` | `16` |
| `lg` | `24` |
| `xl` | `32` |
| `xxl` | `48` |

### 字体大小 (Font Sizes)

| Token | 值 |
|-------|----|
| `xs` | `10` |
| `sm` | `12` |
| `md` | `14` |
| `lg` | `16` |
| `xl` | `18` |
| `xxl` | `24` |
| `xxxl` | `32` |

### 字体粗细 (Font Weights)

| Token | 值 |
|-------|----|
| `regular` | `'400'` |
| `medium` | `'500'` |
| `semibold` | `'600'` |
| `bold` | `'700'` |

### 圆角 (Border Radius)

| Token | 值 |
|-------|----|
| `none` | `0` |
| `sm` | `4` |
| `md` | `8` |
| `lg` | `12` |
| `xl` | `16` |
| `full` | `9999` |

## 迁移指南

### 从原有的 StyleSheet 迁移

**原有方式：**
```tsx
import { StyleSheet } from 'react-native';
import { colors, spacing } from '@myapp/shared';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: spacing.md,
  },
});
```

**新方式：**
```tsx
import { createStyleSheet, useStyles } from '@myapp/shared';

const styles = createStyleSheet((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
}));

// 在组件中
const styles = useStyles(styles);
```

### 从手动 isDarkMode 判断迁移

**原有方式：**
```tsx
const Card = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <View style={{
      backgroundColor: isDarkMode ? colors.surfaceDark : colors.white,
    }} />
  );
};
```

**新方式：**
```tsx
const cardStyles = createStyleSheet((theme) => ({
  card: {
    backgroundColor: theme.colors.surface,
  },
}));

const Card = () => {
  const styles = useStyles(cardStyles);
  return <View style={styles.card} />;
};
```

## 最佳实践

### 1. 样式定义位置

建议将样式定义放在组件外部，避免每次渲染重新创建：

```tsx
// ✅ 正确：组件外部
const componentStyles = createStyleSheet((theme) => ({...}));

const MyComponent = () => {
  const styles = useStyles(componentStyles);
  // ...
};

// ❌ 避免：组件内部
const MyComponent = () => {
  const styles = useStyles(createStyleSheet((theme) => ({...})));
  // ...
};
```

### 2. 组合多个样式

```tsx
<View style={[styles.base, styles.variant, customStyle]} />
```

### 3. 条件样式

```tsx
const isActive = true;

<View style={[
  styles.button,
  isActive && styles.active,
]} />
```

### 4. 使用常量而非硬编码

```tsx
// ✅ 推荐
padding: theme.spacing.md,

// ❌ 避免
padding: 16,
```

## 示例组件

项目中已包含两个使用主题化 StyleSheet 的示例组件：

1. **Card** - [packages/shared/src/components/Card/index.tsx](../packages/shared/src/components/Card/index.tsx)
2. **Button** - [packages/shared/src/components/Button/index.tsx](../packages/shared/src/components/Button/index.tsx)

## 相关文件

- [主题 Token](../packages/shared/src/theme/tokens.ts)
- [StyleSheet 封装](../packages/shared/src/theme/StyleSheet.ts)
- [主题导出](../packages/shared/src/theme/index.ts)
- [RootStore 主题管理](../packages/shared/src/models/RootStore.ts)

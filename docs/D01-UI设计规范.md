# UI 设计规范

## 1. 设计稿尺寸标准

### 1.1 基准设计稿尺寸

| 平台 | 推荐设计稿尺寸 | 说明 |
|------|--------------|------|
| **移动端** | 375 × 812 px (iPhone X) | iOS 主流机型，作为基准 |
| **平板** | 768 × 1024 px (iPad) | 平板端基准 |
| **Web** | 1920 × 1080 px | 桌面端基准 |

### 1.2 尺寸单位对应关系

| 设计单位 | 代码单位 | 说明 |
|---------|---------|------|
| px | dp | 密度无关像素，自动适配不同屏幕密度 |
| px | sp | 可缩放像素，用于字体大小 |

---

## 2. 响应式尺寸转换方案

### 2.1 创建尺寸适配工具

创建 `packages/shared/src/utils/responsive.ts` 文件：

```typescript
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 设计稿基准尺寸（iPhone X: 375×812）
const DESIGN_WIDTH = 375;
const DESIGN_HEIGHT = 812;

/**
 * 将设计稿像素转换为响应式尺寸
 * @param size 设计稿中的像素值
 * @returns 响应式尺寸（dp）
 */
export const scale = (size: number): number => {
  return (size / DESIGN_WIDTH) * SCREEN_WIDTH;
};

/**
 * 将设计稿高度像素转换为响应式尺寸
 * @param size 设计稿中的像素值
 * @returns 响应式尺寸（dp）
 */
export const scaleHeight = (size: number): number => {
  return (size / DESIGN_HEIGHT) * SCREEN_HEIGHT;
};

/**
 * 字体缩放（限制最小/最大值）
 * @param size 设计稿中的字体像素值
 * @returns 响应式字体大小（sp）
 */
export const scaleFont = (size: number): number => {
  const scaled = scale(size);
  return Math.min(Math.max(scaled, 10), 48);
};

/**
 * 获取屏幕宽高
 */
export const SCREEN = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmallScreen: SCREEN_WIDTH < 375,
  isLargeScreen: SCREEN_WIDTH >= 414,
};
```

### 2.2 使用示例

假设设计稿中元素尺寸为：
- 按钮宽度：320px
- 按钮高度：48px
- 字体大小：16px
- 间距：16px

代码实现：

```typescript
import { scale, scaleFont, SCREEN } from '../utils/responsive';

const styles = StyleSheet.create({
  button: {
    width: scale(320),      // 设计稿 320px → 响应式宽度
    height: scale(48),      // 设计稿 48px → 响应式高度
    borderRadius: scale(8), // 设计稿 8px → 响应式圆角
  },
  text: {
    fontSize: scaleFont(16), // 设计稿 16px → 响应式字体
  },
  container: {
    paddingHorizontal: scale(16),
    width: SCREEN.width - scale(32), // 屏幕宽度 - 两侧各 16px
  },
});
```

---

## 3. 设计 Token 定义

### 3.1 颜色规范

```typescript
// packages/shared/src/theme/tokens.ts
export const COLORS = {
  primary: '#007AFF',
  primaryDark: '#0066CC',
  secondary: '#5856D6',
  background: '#FFFFFF',
  backgroundDark: '#1C1C1E',
  text: '#1C1C1E',
  textLight: '#8E8E93',
  border: '#E5E5EA',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
};
```

### 3.2 间距规范

```typescript
export const SPACING = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
```

### 3.3 字体规范

```typescript
export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
  xxxl: 32,
};

export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};
```

### 3.4 圆角和阴影规范

```typescript
export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px rgba(0,0,0,0.05)',
  md: '0 4px 6px rgba(0,0,0,0.1)',
  lg: '0 8px 16px rgba(0,0,0,0.12)',
  xl: '0 16px 24px rgba(0,0,0,0.14)',
};
```

---

## 4. 跨端适配策略

### 4.1 平台特定样式

```typescript
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: scale(SPACING.md),
    ...Platform.select({
      ios: {
        shadowColor: COLORS.text,
        shadowOffset: { width: 0, height: scale(2) },
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: SHADOWS.md,
      },
    }),
  },
});
```

### 4.2 Web 端特殊处理

在 Web 端需要设置 HTML 根元素字体大小：

```html
<!-- packages/web/public/index.html -->
<style>
  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
  }
  
  @media (max-width: 375px) {
    html {
      font-size: 14px;
    }
  }
</style>
```

---

## 5. 设计到代码转换流程

### 5.1 转换步骤

1. **测量设计稿**：获取元素的像素尺寸
2. **应用 scale 函数**：使用 `scale()`、`scaleHeight()`、`scaleFont()` 转换
3. **使用设计 Token**：颜色、间距等使用预定义的 Token
4. **平台适配**：根据需要添加平台特定样式

### 5.2 尺寸转换对照表

| 设计稿尺寸(px) | iPhone X(375px) | iPhone 14 Pro(393px) | iPad(768px) |
|---------------|-----------------|---------------------|-------------|
| 16 | 16 | 16.7 | 33.3 |
| 32 | 32 | 33.3 | 66.7 |
| 48 | 48 | 50 | 100 |
| 64 | 64 | 66.7 | 133.3 |

---

## 6. 设计交付清单

| 交付物 | 说明 |
|--------|------|
| 设计稿 | 完整的 Figma/Sketch 文件 |
| Token 文档 | 色彩、字体、间距等变量定义 |
| 组件库 | 可复用组件的设计规范 |
| 交互说明 | 动画、过渡效果说明 |
| 切图资源 | PNG/SVG 图标和图片 |

---

## 7. 组件开发规范

### 7.1 组件命名规范

```
组件命名: [组件名]
文件结构: packages/shared/src/components/[组件名]/[组件名].tsx
示例: Button/Button.tsx, Card/Card.tsx
```

### 7.2 组件模板

```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { scale, scaleFont } from '../../utils/responsive';
import { COLORS, SPACING, FONT_SIZES } from '../../theme/tokens';

interface ComponentNameProps {
  // Props 定义
}

export const ComponentName: React.FC<ComponentNameProps> = (props) => {
  return (
    <View style={styles.container}>
      {/* 组件内容 */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // 使用 scale() 和 Token
  },
});
```

---

## 8. 最佳实践

1. **移动优先**：先设计移动端，再扩展到桌面端
2. **Flexbox 布局**：使用 Flexbox 实现响应式布局
3. **最小可点击区域**：按钮最小 44px × 44px（设计稿）
4. **安全区域适配**：使用 `SafeAreaView` 处理刘海屏
5. **字体大小限制**：最小 10dp，最大 48dp
6. **使用相对单位**：避免使用固定像素值

---

## 附录

### A. 常用工具函数

```typescript
// 判断设备类型
const isTablet = SCREEN.width >= 768;
const isWeb = Platform.OS === 'web';

// 获取安全区域
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

// 监听屏幕尺寸变化
Dimensions.addEventListener('change', ({ window }) => {
  // 处理屏幕旋转等情况
});
```

---

**版本**: v1.0  
**创建日期**: 2026-05-21  
**适用项目**: React Native + Web 多端项目
# App + H5 主题化优化规划

针对你的 React Native + Web 项目，以下是更实用的优化方向。

## 当前架构
- ✅ 基础主题化 StyleSheet 已实现
- ✅ 支持浅色/深色模式
- ✅ 设计 token 系统已建立
- 📱 支持 iOS/Android
- 🌐 支持 Web

---

## 优化方案优先级

### 🔴 高优先级（建议优先实现）

#### 1. 动画 Token 系统
**文件**: `packages/shared/src/theme/animations.ts`

为动画提供统一的配置，app 和 web 通用。

```typescript
export const ANIMATIONS = {
  duration: {
    fast: 150,    // 快速动画
    normal: 300,  // 标准动画
    slow: 500,    // 慢速动画
  },
  easing: {
    easeOut: Easing.out(Easing.cubic),
    easeInOut: Easing.inOut(Easing.cubic),
    bounce: Easing.bounce,
  },
};
```

**使用示例**:
```typescript
const styles = createStyleSheet((theme) => ({
  // 动画配置可以直接用在 Animated 中
}));
```

---

#### 2. 主题变体支持
**文件**: 更新 `packages/shared/src/theme/tokens.ts`

支持多种主题，不仅仅是明暗模式：
- 🌞 浅色主题（默认）
- 🌙 深色主题
- 🍂 护眼主题（Sepia）
- 📱 OLED 纯黑主题（省电）

**实现**:
```typescript
export function getThemedColors(theme: 'light' | 'dark' | 'sepia' | 'oled') {
  switch (theme) {
    case 'dark':
      return { ...COLORS, background: '#000', surface: '#1c1c1e' };
    case 'sepia':
      return { ...COLORS, background: '#f5f0e1', text: '#433422' };
    case 'oled':
      return { ...COLORS, background: '#000000', surface: '#0a0a0a' };
    default:
      return { /* 浅色主题 */ };
  }
}
```

---

#### 3. Web 端 CSS 增强
**文件**: `packages/shared/src/theme/extensions.ts`

为 Web 端解锁更多 CSS 功能，同时保持与 native 兼容。

```typescript
import { Platform } from 'react-native';

// Web 专属样式工具
export function webOnly(webStyles: any, nativeStyles: any = {}) {
  return Platform.select({
    web: webStyles,
    default: nativeStyles,
  });
}

// 渐变支持（Web）
export function cssGradient(colors: string[], direction: 'to right' | 'to bottom' = 'to bottom') {
  return Platform.select({
    web: {
      background: `linear-gradient(${direction}, ${colors.join(', ')})`,
    },
    default: {},
  });
}

// 毛玻璃效果（Web）
export function glassEffect(blur: number = 10, opacity: number = 0.8) {
  return Platform.select({
    web: {
      backdropFilter: `blur(${blur}px)`,
      WebkitBackdropFilter: `blur(${blur}px)`,
    },
    default: {},
  });
}
```

**使用示例**:
```typescript
const styles = createStyleSheet((theme) => ({
  card: {
    backgroundColor: `${theme.colors.surface}cc`,
    ...webOnly(
      { backdropFilter: 'blur(10px)' },
      { backgroundColor: theme.colors.surface }
    ),
  },
}));
```

---

### 🟡 中优先级（有用但不急）

#### 4. 样式预设系统
**文件**: `packages/shared/src/theme/presets.ts`

为常用组件提供预设样式，减少重复代码。

```typescript
export const PRESETS = {
  card: (theme) => ({
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  }),
  
  buttonPrimary: (theme) => ({
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  }),
  
  textBody: (theme) => ({
    color: theme.colors.text,
    fontSize: theme.fontSizes.md,
    lineHeight: 20,
  }),
};
```

---

#### 5. 线性渐变支持
**文件**: `packages/shared/src/theme/gradients.ts`

需要安装 `expo-linear-gradient`:
```bash
pnpm add expo-linear-gradient
```

```typescript
export const GRADIENTS = {
  primary: ['#007AFF', '#5856D6'],
  success: ['#34C759', '#30D158'],
  danger: ['#FF3B30', '#FF453A'],
};

export function createGradientProps(
  colors: string[],
  direction: 'horizontal' | 'vertical' = 'vertical'
) {
  const start = { x: 0, y: 0 };
  const end = direction === 'vertical' ? { x: 0, y: 1 } : { x: 1, y: 0 };
  
  return { colors, start, end };
}
```

---

### 🟢 低优先级（锦上添花）

#### 6. 样式调试工具
**文件**: `packages/shared/src/hooks/useStyleDebug.ts`

开发时方便调试样式边界。

```typescript
export function useStyleDebug() {
  const [debugMode, setDebugMode] = useState(false);
  
  const wrap = (style: any) => {
    if (!debugMode || !__DEV__) return style;
    return {
      ...style,
      borderWidth: 1,
      borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
    };
  };
  
  return { debugMode, setDebugMode, wrap };
}
```

---

## 推荐实现顺序

### 第 1 步：动画 Token（1天）
这个最简单，对 app 和 web 都有用。

### 第 2 步：主题变体（1-2天）
让用户有更多主题选择，提升体验。

### 第 3 步：Web CSS 增强（1天）
让 H5 端能够用更多现代 CSS 特性。

### 第 4 步：样式预设（1天）
提升开发效率，减少重复代码。

---

## 保持不变的功能

✅ 当前的主题化 StyleSheet 核心功能  
✅ useStyles hook  
✅ 设计 token（colors, spacing, fonts 等）

---

## 相关文件

- [当前 StyleSheet](../packages/shared/src/theme/StyleSheet.ts)
- [主题 Tokens](../packages/shared/src/theme/tokens.ts)
- [RootStore](../packages/shared/src/models/RootStore.ts)

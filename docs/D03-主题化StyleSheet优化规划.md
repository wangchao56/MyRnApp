# 主题化 StyleSheet 优化规划

## 当前状态分析

### ✅ 已实现的功能
- 基础的主题化 StyleSheet 封装
- `createStyleSheet` 和 `useStyles` API
- 浅色/深色主题切换
- 基础设计 token 系统（颜色、间距、字体等）
- 类型安全的样式定义

### ❌ 当前局限性
1. **缺乏 CSS 变量支持** - 无法利用 CSS Custom Properties
2. **动态样式能力有限** - 缺乏运行时样式计算
3. **响应式支持不足** - 缺少断点系统
4. **动画/过渡支持不完善** - 未统一动画配置
5. **Web 端功能受限** - RN 样式限制了现代 CSS 能力
6. **样式组合能力弱** - 缺少类似 Tailwind 的原子化样式
7. **主题扩展困难** - 难以添加新的主题变体
8. **缺少样式调试工具** - 开发体验可优化

---

## 优化阶段规划

### 阶段一：核心增强（优先级：高）

#### 1.1 CSS 变量集成（Web 端）

**目标：** 在 Web 端启用 CSS Custom Properties

**实现方案：**
```typescript
// tokens.ts 扩展
export const CSS_VARS = {
  colors: {
    primary: '--color-primary',
    background: '--color-background',
    // ...
  },
  spacing: {
    md: '--spacing-md',
    // ...
  },
};

// StyleSheet.ts 扩展
export function getCSSVars(theme: ThemeContext) {
  return {
    [CSS_VARS.colors.primary]: theme.colors.primary,
    [CSS_VARS.colors.background]: theme.colors.background,
    // ...
  };
}

// 使用示例
const styles = createStyleSheet((theme) => ({
  container: {
    // Web 端使用 CSS 变量
    ...Platform.select({
      web: {
        backgroundColor: `var(${CSS_VARS.colors.background})`,
      },
      default: {
        backgroundColor: theme.colors.background,
      },
    }),
  },
}));
```

**文件：**
- [theme/tokens.ts](../packages/shared/src/theme/tokens.ts)
- [theme/StyleSheet.ts](../packages/shared/src/theme/StyleSheet.ts)

---

#### 1.2 响应式断点系统

**目标：** 添加响应式布局支持

**实现方案：**
```typescript
// theme/breakpoints.ts
export const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

export type Breakpoint = keyof typeof BREAKPOINTS;

// hooks/useBreakpoint.ts
export function useBreakpoint(): Breakpoint {
  const { width } = useWindowDimensions();
  
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
}

// StyleSheet.ts 扩展
export function createResponsiveStyleSheet<T extends NamedStyles<T>>(
  styles: (theme: ThemeContext, breakpoint: Breakpoint) => T
) {
  return styles;
}

export function useResponsiveStyles<T extends NamedStyles<T>>(
  styleCreator: (theme: ThemeContext, breakpoint: Breakpoint) => T
) {
  const { isDarkMode } = useTheme();
  const breakpoint = useBreakpoint();
  
  return useMemo(() => {
    const theme = createThemeContext(isDarkMode);
    const styles = styleCreator(theme, breakpoint);
    return RNStyleSheet.create(styles);
  }, [isDarkMode, breakpoint]);
}

// 使用示例
const responsiveStyles = createResponsiveStyleSheet((theme, bp) => ({
  container: {
    flexDirection: bp === 'xs' ? 'column' : 'row',
    padding: bp === 'xs' ? theme.spacing.sm : theme.spacing.lg,
  },
}));
```

**新建文件：**
- `packages/shared/src/theme/breakpoints.ts`
- `packages/shared/src/hooks/useBreakpoint.ts`

---

#### 1.3 动画 Token 系统

**目标：** 统一动画配置

**实现方案：**
```typescript
// theme/animations.ts
export const ANIMATIONS = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeOut: Easing.out(Easing.cubic),
    easeInOut: Easing.inOut(Easing.cubic),
    bounce: Easing.bounce,
  },
};

// StyleSheet.ts 扩展
export interface ThemeContext {
  // ... 现有属性
  animations: typeof ANIMATIONS;
}

// 使用示例
const fadeAnim = useRef(new Animated.Value(0)).current;

const startFadeIn = () => {
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: theme.animations.duration.normal,
    easing: theme.animations.easing.easeOut,
    useNativeDriver: true,
  }).start();
};
```

**新建文件：**
- `packages/shared/src/theme/animations.ts`

---

### 阶段二：样式能力增强（优先级：中）

#### 2.1 原子化样式工具

**目标：** 提供类似 Tailwind 的原子化样式能力

**实现方案：**
```typescript
// theme/atomic.ts
export const atomicStyles = {
  // 布局
  flex: { flex: 1 },
  flexRow: { flexDirection: 'row' },
  flexCol: { flexDirection: 'column' },
  itemsCenter: { alignItems: 'center' },
  justifyCenter: { justifyContent: 'center' },
  
  // 间距
  p0: { padding: 0 },
  p1: { padding: 4 },
  p2: { padding: 8 },
  // ...
  
  // 颜色（主题化）
  bgPrimary: (theme) => ({ backgroundColor: theme.colors.primary }),
  textPrimary: (theme) => ({ color: theme.colors.primary }),
};

// useAtomicStyles hook
export function useAtomicStyles() {
  const styles = useStyles(theme => ({
    bgPrimary: { backgroundColor: theme.colors.primary },
    textPrimary: { color: theme.colors.primary },
    // ...
  }));
  
  return {
    ...styles,
    flex: { flex: 1 },
    flexRow: { flexDirection: 'row' },
    // ... 静态样式
  };
}

// 使用示例
const MyComponent = () => {
  const atoms = useAtomicStyles();
  
  return (
    <View style={[atoms.flex, atoms.flexCol, atoms.p2]}>
      <Text style={atoms.textPrimary}>Hello</Text>
    </View>
  );
};
```

**新建文件：**
- `packages/shared/src/theme/atomic.ts`

---

#### 2.2 主题变体支持

**目标：** 支持自定义主题（不仅仅是明暗）

**实现方案：**
```typescript
// models/RootStore.ts 扩展
export const RootStore = types
  .model('RootStore', {
    theme: types.optional(
      types.union(
        types.literal('light'),
        types.literal('dark'),
        types.literal('sepia'),
        types.literal('oled')
      ),
      'light'
    ),
    // ...
  });

// theme/tokens.ts 扩展
export const getThemedColors = (theme: string) => {
  switch (theme) {
    case 'dark':
      return { /* 深色主题 */ };
    case 'sepia':
      return { /* 护眼主题 */ };
    case 'oled':
      return { /* OLED 纯黑主题 */ };
    default:
      return { /* 浅色主题 */ };
  }
};

// StyleSheet.ts 更新
export function useStyles<T extends NamedStyles<T>>(
  styleCreator: StyleSheetCreator<T> | T
) {
  const { theme: themeName } = useTheme();
  
  return useMemo(() => {
    const theme: ThemeContext = {
      colors: getThemedColors(themeName),
      // ...
      isDarkMode: themeName !== 'light',
      themeName,
    };
    
    const styles = typeof styleCreator === 'function'
      ? styleCreator(theme)
      : styleCreator;
      
    return RNStyleSheet.create(styles);
  }, [themeName]);
}
```

---

#### 2.3 CSS-in-JS 增强（Web 端）

**目标：** 在 Web 端解锁更多 CSS 功能

**实现方案：**
```typescript
// StyleSheet.ts 扩展
import { Platform } from 'react-native';

type ExtendedStyle = ViewStyle | TextStyle | ImageStyle & {
  // Web 专属 CSS 属性
  backdropFilter?: string;
  backdropBlur?: number;
  cursor?: string;
  userSelect?: string;
  scrollBehavior?: 'smooth' | 'auto';
  textOverflow?: 'ellipsis' | 'clip';
  whiteSpace?: 'nowrap' | 'normal' | 'pre' | 'pre-wrap';
};

// 工具函数
export function webStyle(webStyles: any, nativeStyles: any = {}) {
  return Platform.select({
    web: webStyles,
    default: nativeStyles,
  });
}

// 使用示例
const styles = createStyleSheet((theme) => ({
  glass: {
    backgroundColor: `${theme.colors.surface}80`,
    ...webStyle({
      backdropFilter: 'blur(10px)',
      webkitBackdropFilter: 'blur(10px)',
    }),
  },
}));
```

---

### 阶段三：开发体验优化（优先级：中）

#### 3.1 样式调试工具

**目标：** 提供开发时的样式调试能力

**实现方案：**
```typescript
// hooks/useStyleDebug.ts
export function useStyleDebug() {
  const [debugMode, setDebugMode] = useState(false);
  
  const wrapStyle = (style: any) => {
    if (!debugMode || !__DEV__) return style;
    
    return {
      ...style,
      borderWidth: 1,
      borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
      backgroundColor: `hsla(${Math.random() * 360}, 70%, 50%, 0.1)`,
    };
  };
  
  return { debugMode, setDebugMode, wrapStyle };
}

// 使用示例
const MyComponent = () => {
  const { wrapStyle } = useStyleDebug();
  const styles = useStyles(myStyles);
  
  return (
    <View style={wrapStyle(styles.container)}>
      {/* ... */}
    </View>
  );
};
```

**新建文件：**
- `packages/shared/src/hooks/useStyleDebug.ts`

---

#### 3.2 样式性能监控

**目标：** 监控样式重新计算的性能

**实现方案：**
```typescript
// hooks/useStylePerformance.ts
export function useStylePerformance(name: string) {
  const lastRender = useRef(Date.now());
  
  const logPerformance = useCallback(() => {
    if (__DEV__) {
      const now = Date.now();
      const delta = now - lastRender.current;
      if (delta > 16) {
        console.warn(`[Style Perf] ${name}: ${delta}ms (可能卡顿)`);
      }
      lastRender.current = now;
    }
  }, [name]);
  
  return { logPerformance };
}
```

**新建文件：**
- `packages/shared/src/hooks/useStylePerformance.ts`

---

#### 3.3 VS Code 智能提示增强

**目标：** 提供更好的开发体验

**实现方案：**
```typescript
// 增强类型定义
type ThemePath = 
  | `colors.${keyof ThemedColors}`
  | `spacing.${keyof typeof SPACING}`
  | `fontSizes.${keyof typeof FONT_SIZES}`;

// 提供 path-to-value 的辅助函数
export function theme(path: ThemePath, theme: ThemeContext) {
  const [category, key] = path.split('.');
  return theme[category][key];
}

// 使用示例
const styles = createStyleSheet((theme) => ({
  container: {
    backgroundColor: theme('colors.background'),
    padding: theme('spacing.md'),
  },
}));
```

---

### 阶段四：高级功能（优先级：低）

#### 4.1 样式预设系统

**目标：** 提供常用组件的样式预设

**实现方案：**
```typescript
// theme/presets.ts
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
  
  button: (theme) => ({
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
  }),
  
  text: (theme) => ({
    color: theme.colors.text,
    fontSize: theme.fontSizes.md,
  }),
};

// 使用示例
const styles = createStyleSheet((theme) => ({
  customCard: {
    ...PRESETS.card(theme),
    backgroundColor: theme.colors.primary,
  },
}));
```

**新建文件：**
- `packages/shared/src/theme/presets.ts`

---

#### 4.2 线性渐变支持

**目标：** 简化渐变的使用

**实现方案：**
```typescript
// theme/gradients.ts
export const GRADIENTS = {
  primary: ['#007AFF', '#5856D6'],
  success: ['#34C759', '#30D158'],
  danger: ['#FF3B30', '#FF453A'],
};

export function createGradientStyle(
  colors: string[],
  direction: 'horizontal' | 'vertical' = 'vertical'
) {
  const start = { x: 0, y: 0 };
  const end = direction === 'vertical' ? { x: 0, y: 1 } : { x: 1, y: 0 };
  
  return { colors, start, end };
}

// 使用示例
import { LinearGradient } from 'expo-linear-gradient';

const GradientCard = () => {
  const gradient = createGradientStyle(GRADIENTS.primary);
  
  return (
    <LinearGradient {...gradient} />
  );
};
```

**新建文件：**
- `packages/shared/src/theme/gradients.ts`

---

#### 4.3 暗黑模式增强

**目标：** 提供更细粒度的暗黑模式控制

**实现方案：**
```typescript
// 支持动态调整对比度
export function adjustContrast(color: string, factor: number): string {
  // 颜色对比度调整逻辑
}

// 支持自动色彩反转
export function autoInvert(lightColor: string, darkColor?: string) {
  return (theme: ThemeContext) => 
    theme.isDarkMode ? (darkColor || invertColor(lightColor)) : lightColor;
}

// 使用示例
const styles = createStyleSheet((theme) => ({
  card: {
    backgroundColor: autoInvert('#fff', '#1c1c1e')(theme),
  },
}));
```

---

## 实现优先级总结

| 阶段 | 功能 | 优先级 | 预估工作量 | 依赖 |
|------|------|--------|-----------|------|
| 一 | 响应式断点系统 | 🔴 高 | 2天 | 无 |
| 一 | 动画 Token 系统 | 🔴 高 | 1天 | 无 |
| 一 | CSS 变量集成 | 🟡 中 | 2天 | Web 项目 |
| 二 | 原子化样式工具 | 🟡 中 | 3天 | 断点系统 |
| 二 | 主题变体支持 | 🟡 中 | 2天 | 无 |
| 二 | CSS-in-JS 增强 | 🟡 中 | 2天 | Web 项目 |
| 三 | 样式调试工具 | 🟢 低 | 1天 | 无 |
| 三 | 样式性能监控 | 🟢 低 | 1天 | 无 |
| 四 | 样式预设系统 | 🟢 低 | 2天 | 动画 Token |
| 四 | 线性渐变支持 | 🟢 低 | 1天 | expo-linear-gradient |
| 四 | 暗黑模式增强 | 🟢 低 | 2天 | 无 |

---

## 技术栈建议

### 可选依赖

如果需要更强大的能力，可以考虑引入：

| 库名 | 用途 | 适用场景 |
|------|------|---------|
| `nativewind` | Tailwind CSS for RN | 需要大量原子化样式 |
| `restyle` | Shopify 样式系统 | 需要更结构化的主题 |
| `tamagui` | 完整的 UI 工具包 | 需要完整的设计系统 |
| `expo-linear-gradient` | 渐变支持 | 需要渐变色 |
| `react-native-reanimated` | 动画增强 | 需要复杂动画 |

---

## 迁移策略

### 渐进式升级建议

1. **保持向后兼容** - 新功能作为可选增强
2. **分阶段引入** - 先完成阶段一再推进后续
3. **文档同步更新** - 每次升级后更新使用文档
4. **代码示例同步** - 在 docs 中提供迁移示例

### 兼容性保障

```typescript
// 保留现有 API
export { createStyleSheet, useStyles } from './StyleSheet';

// 新功能作为独立导出
export { 
  createResponsiveStyleSheet, 
  useResponsiveStyles,
  useAtomicStyles,
  createGradientStyle,
} from './extensions';
```

---

## 相关文件索引

### 现有文件
- [StyleSheet 封装](../packages/shared/src/theme/StyleSheet.ts)
- [主题 Token](../packages/shared/src/theme/tokens.ts)
- [RootStore](../packages/shared/src/models/RootStore.ts)
- [useTheme Hook](../packages/shared/src/hooks/useStore.tsx)

### 计划新增文件
- `packages/shared/src/theme/breakpoints.ts`
- `packages/shared/src/theme/animations.ts`
- `packages/shared/src/theme/atomic.ts`
- `packages/shared/src/theme/presets.ts`
- `packages/shared/src/theme/gradients.ts`
- `packages/shared/src/hooks/useBreakpoint.ts`
- `packages/shared/src/hooks/useStyleDebug.ts`
- `packages/shared/src/hooks/useStylePerformance.ts`

# Gradient 渐变组件

多端适配的线性渐变组件，基于 `expo-linear-gradient` 实现，支持 iOS、Android 和 Web 端。

## 安装依赖

```bash
pnpm add expo-linear-gradient
```

## 基础用法

```tsx
import { Gradient } from '@myapp/shared';

<Gradient colors={['#FF6B6B', '#4ECDC4']}>
  <Text>渐变背景内容</Text>
</Gradient>
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|-----|------|--------|-----|
| `colors` | `string[] \| ColorStop[]` | - | 渐变颜色数组 |
| `direction` | `'horizontal' \| 'vertical' \| 'diagonal' \| 'diagonal-up'` | `'vertical'` | 渐变方向 |
| `start` | `{ x: number; y: number }` | - | 自定义渐变起点坐标 (0-1) |
| `end` | `{ x: number; y: number }` | - | 自定义渐变终点坐标 (0-1) |
| `children` | `ReactNode` | - | 子元素 |
| `style` | `ViewStyle` | - | 容器样式 |

### 方向说明

| 值 | 说明 | 效果 |
|---|------|-----|
| `horizontal` | 从左到右 | → |
| `vertical` | 从上到下 | ↓ |
| `diagonal` | 从左上到右下 | ↘ |
| `diagonal-up` | 从左下到右上 | ↗ |

### 类型定义

```typescript
// 渐变方向
type GradientDirection = 'horizontal' | 'vertical' | 'diagonal' | 'diagonal-up';

// 颜色停止点
interface ColorStop {
  color: string;
  location?: number;  // 0-1 之间的值
}
```

## 使用示例

### 1. 基础双色渐变

```tsx
<Gradient colors={['#667eea', '#764ba2']}>
  <View style={{ padding: 20 }}>
    <Text>渐变背景</Text>
  </View>
</Gradient>
```

### 2. 指定渐变方向

```tsx
// 水平渐变
<Gradient colors={['#FF6B6B', '#4ECDC4']} direction="horizontal">
  <Text>从左到右</Text>
</Gradient>

// 对角线渐变
<Gradient colors={['#667eea', '#764ba2']} direction="diagonal">
  <Text>对角线</Text>
</Gradient>
```

### 3. 多色渐变

```tsx
<Gradient colors={['#FF6B6B', '#4ECDC4', '#45B7D1']}>
  <Text>三色渐变</Text>
</Gradient>
```

### 4. 自定义渐变坐标

```tsx
<Gradient
  colors={['#667eea', '#764ba2']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
>
  <Text>自定义坐标</Text>
</Gradient>
```

### 5. 配合快捷函数使用

```tsx
import { Gradient, createGradientColors, createMultiColorGradient } from '@myapp/shared';

// 双色渐变
const colors1 = createGradientColors('#FF6B6B', '#4ECDC4');

// 多色渐变
const colors2 = createMultiColorGradient('#FF6B6B', '#4ECDC4', '#45B7D1');

<Gradient colors={colors1} direction="diagonal">
  <Text>使用快捷函数</Text>
</Gradient>
```

### 6. 实际应用场景

```tsx
// 按钮渐变
<Gradient colors={['#667eea', '#764ba2']} direction="horizontal">
  <TouchableOpacity>
    <Text style={{ color: '#fff', padding: 12 }}>登录</Text>
  </TouchableOpacity>
</Gradient>

// 卡片背景
<Card>
  <Gradient colors={['#f093fb', '#f5576c']} direction="diagonal">
    <Text style={{ color: '#fff' }}>VIP 会员</Text>
  </Gradient>
</Card>

// 页面头部渐变
<Gradient colors={['#4ECDC4', '#44A08D']} direction="vertical">
  <View style={{ paddingTop: 50, paddingBottom: 20 }}>
    <Text style={{ color: '#fff', fontSize: 24 }}>我的</Text>
  </View>
</Gradient>
```

### 7. 带样式容器的渐变

```tsx
<Gradient
  colors={['#667eea', '#764ba2']}
  direction="diagonal"
  style={{
    width: 200,
    height: 100,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
  <Text style={{ color: '#fff' }}>圆角渐变卡片</Text>
</Gradient>
```

## 注意事项

1. **颜色数量**：至少需要 2 个颜色，否则会自动补齐
2. **expo-linear-gradient**：该库会自动处理 Web 端的 CSS 渐变
3. **子元素定位**：渐变组件内部使用 `absoluteFill`，子元素需要自行设置定位样式
4. **平台兼容性**：
   - iOS：使用原生 CAGradientLayer
   - Android：使用原生 LinearGradient
   - Web：使用 CSS linear-gradient

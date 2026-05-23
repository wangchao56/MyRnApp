# SvgIcon 图标组件

> 状态：✅ 已实现（2026-05-24 同步）  
> 注意：组件名为 SvgIcon，实际基于 **Material Icons 字体**，并非 SVG 文件渲染。

基于 `@react-native-vector-icons/material-icons` 封装的多端图标组件，支持 iOS、Android 和 Web 端。

## 安装依赖

### 基础依赖（已安装）

```bash
# Material Icons 已默认安装
pnpm add @react-native-vector-icons/material-icons
```

### 添加其他图标库（可选）

如果需要使用其他图标库，可以按需安装：

```bash
# AntDesign 图标
pnpm add @react-native-vector-icons/ant-design

# Entypo 图标
pnpm add @react-native-vector-icons/entypo

# EvilIcons 图标
pnpm add @react-native-vector-icons/evil-icons

# Feather 图标
pnpm add @react-native-vector-icons/feather

# FontAwesome 图标
pnpm add @react-native-vector-icons/font-awesome

# FontAwesome5 图标
pnpm add @react-native-vector-icons/font-awesome5

# Ionicons 图标
pnpm add @react-native-vector-icons/ionicons

# MaterialCommunityIcons 图标
pnpm add @react-native-vector-icons/material-community-icons

# Octicons 图标
pnpm add @react-native-vector-icons/octicons

# SimpleLineIcons 图标
pnpm add @react-native-vector-icons/simple-line-icons
```

### Android 配置

安装新图标库后，需要在 `android/app/build.gradle` 中添加字体配置：

```groovy
apply from: file("../../../../node_modules/@react-native-vector-icons/material-icons/fonts.gradle")
apply from: file("../../../../node_modules/@react-native-vector-icons/ant-design/fonts.gradle")
// 添加其他图标库的字体文件...
```

## 基础用法

```tsx
import { SvgIcon } from '@myapp/shared';

<SvgIcon name="home" size={24} color="#333" />
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|-----|------|--------|-----|
| `name` | `string` | - | 图标名称 |
| `size` | `number \| IconSize` | `'md'` | 图标大小 |
| `color` | `string` | `'#000'` | 图标颜色 |
| `onPress` | `() => void` | - | 点击事件 |
| `disabled` | `boolean` | `false` | 禁用状态 |
| `style` | `TextStyle` | - | 容器样式 |

### IconSize 预设

| 值 | 像素大小 |
|---|---------|
| `xs` | 12px |
| `sm` | 16px |
| `md` | 20px |
| `lg` | 24px |
| `xl` | 32px |

## 使用示例

### 1. 基础用法

```tsx
// 使用数字大小
<SvgIcon name="home" size={24} color="#333" />

// 使用预设大小
<SvgIcon name="home" size="lg" color="red" />
```

### 2. 点击事件

```tsx
<SvgIcon
  name="search"
  size={20}
  color="#666"
  onPress={() => navigation.goBack()}
/>
```

### 3. 禁用状态

```tsx
<SvgIcon
  name="lock"
  size={24}
  disabled
/>
```

### 4. 使用 ICONS 常量

```tsx
import { SvgIcon, ICONS } from '@myapp/shared';

// 返回箭头
<SvgIcon name={ICONS.arrowLeft} />

// 操作类
<SvgIcon name={ICONS.add} />
<SvgIcon name={ICONS.edit} />
<SvgIcon name={ICONS.delete} />

// UI 类
<SvgIcon name={ICONS.search} />
<SvgIcon name={ICONS.setting} />
<SvgIcon name={ICONS.menu} />

// 状态类
<SvgIcon name={ICONS.success} color="green" />
<SvgIcon name={ICONS.warning} color="orange" />
<SvgIcon name={ICONS.error} color="red" />
```

### 5. 实际应用场景

```tsx
// 导航栏图标
<View style={styles.header}>
  <SvgIcon name={ICONS.arrowLeft} onPress={() => goBack()} />
  <Text>标题</Text>
  <SvgIcon name={ICONS.setting} onPress={() => openSettings()} />
</View>

// 列表项图标
<View style={styles.listItem}>
  <SvgIcon name={ICONS.user} size="sm" color="#666" />
  <Text style={{ marginLeft: 8 }}>个人资料</Text>
</View>

// 按钮图标
<TouchableOpacity style={styles.button}>
  <SvgIcon name={ICONS.add} color="#fff" size="sm" />
  <Text style={{ color: '#fff', marginLeft: 4 }}>添加</Text>
</TouchableOpacity>

// 加载状态
<SvgIcon name={ICONS.loading} size="lg" color="#666" />
```

## ICONS 常量集合

### 箭头类
```tsx
ICONS.arrowLeft    // 'arrow-back'
ICONS.arrowRight   // 'arrow-forward'
ICONS.arrowUp      // 'arrow-upward'
ICONS.arrowDown    // 'arrow-downward'
ICONS.chevronLeft  // 'chevron-left'
ICONS.chevronRight // 'chevron-right'
```

### 操作类
```tsx
ICONS.add      // 'add'
ICONS.remove   // 'remove'
ICONS.close    // 'close'
ICONS.check    // 'check'
ICONS.edit     // 'edit'
ICONS.delete   // 'delete'
ICONS.copy     // 'content-copy'
ICONS.share    // 'share'
ICONS.download // 'file-download'
ICONS.upload   // 'file-upload'
```

### 媒体类
```tsx
ICONS.image  // 'image'
ICONS.camera // 'camera-alt'
ICONS.video  // 'play-circle-filled'
```

### 社交类
```tsx
ICONS.user     // 'person'
ICONS.users    // 'group'
ICONS.heart    // 'favorite'
ICONS.star     // 'star-border'
ICONS.message  // 'message'
ICONS.mail     // 'mail'
```

### UI 类
```tsx
ICONS.search   // 'search'
ICONS.setting  // 'settings'
ICONS.menu     // 'menu'
ICONS.more     // 'more-vert'
ICONS.refresh  // 'refresh'
ICONS.filter   // 'filter-list'
ICONS.cart     // 'shopping-cart'
ICONS.bell     // 'notifications'
ICONS.eye      // 'visibility'
```

### 状态类
```tsx
ICONS.success  // 'check-circle'
ICONS.warning  // 'warning'
ICONS.error    // 'error'
ICONS.info     // 'info'
ICONS.loading  // 'refresh'
```

## 注意事项

1. **按需安装**：默认只安装 Material Icons，如需其他图标库请按需安装
2. **Android 字体配置**：新增图标库后需要在 Android build.gradle 中添加字体配置
3. **图标名称**：不同图标库的图标名称可能不同，需查阅对应图标库文档
4. **平台差异**：Web 端和 Native 端的渲染方式略有不同，但 API 保持一致
5. **颜色格式**：支持十六进制、RGB、RGBA 等颜色格式

## 图标库文档

- [Material Icons](https://fonts.google.com/icons) - 默认图标库
- [AntDesign Icons](https://ant.design/components/icon)
- [Font Awesome](https://fontawesome.com/icons)
- [Ionicons](https://ionicons.com/)

# SvgIcon 图标组件

基于 `react-native-vector-icons` 封装的多端图标组件，支持 iOS、Android 和 Web 端。

## 安装依赖

```bash
pnpm add react-native-vector-icons
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
| `family` | `IconFamily` | `'AntDesign'` | 图标家族 |
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

### IconFamily 图标家族

| 值 | 说明 |
|---|------|
| `AntDesign` | AntDesign 图标集（默认） |
| `Entypo` | Entypo+ 图标集 |
| `EvilIcons` | Evil Icons 图标集 |
| `Feather` | Feather 图标集 |
| `FontAwesome` | Font Awesome 图标集 |
| `FontAwesome5` | Font Awesome 5 图标集 |
| `Ionicons` | Ionicons 图标集 |
| `MaterialCommunityIcons` | Material Community Icons |
| `MaterialIcons` | Material Icons |
| `Octicons` | Octicons 图标集 |
| `SimpleLineIcons` | Simple Line Icons |

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

### 4. 使用图标家族

```tsx
// 使用 Ionicons
<SvgIcon name="logo-github" family="Ionicons" size={24} />

// 使用 MaterialIcons
<SvgIcon name="menu" family="MaterialIcons" size={24} />

// 使用 FontAwesome
<SvgIcon name="github" family="FontAwesome" size={24} />
```

### 5. 使用 ICONS 常量

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

### 6. 实际应用场景

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
ICONS.arrowLeft    // 'left'
ICONS.arrowRight   // 'right'
ICONS.arrowUp      // 'up'
ICONS.arrowDown    // 'down'
ICONS.chevronLeft  // 'chevronleft'
ICONS.chevronRight // 'chevronright'
```

### 操作类
```tsx
ICONS.add      // 'plus'
ICONS.remove   // 'minus'
ICONS.close    // 'close'
ICONS.check    // 'check'
ICONS.edit     // 'edit'
ICONS.delete   // 'delete'
ICONS.copy     // 'copy'
ICONS.share    // 'sharealt'
ICONS.download // 'download'
ICONS.upload   // 'upload'
```

### 媒体类
```tsx
ICONS.image  // 'picture'
ICONS.camera // 'camera'
ICONS.video  // 'playcircleo'
ICONS.mic    // 'mic'
```

### 社交类
```tsx
ICONS.user     // 'user'
ICONS.users    // 'users'
ICONS.heart    // 'heart'
ICONS.star     // 'staro'
ICONS.message  // 'message1'
ICONS.mail     // 'mail'
```

### UI 类
```tsx
ICONS.search   // 'search'
ICONS.setting  // 'setting'
ICONS.menu     // 'menuunfold'
ICONS.more     // 'ellipsis'
ICONS.refresh  // 'reload1'
ICONS.filter   // 'filter'
ICONS.sort     // 'sort1'
ICONS.cart     // 'shoppingcart'
ICONS.bell     // 'bells'
ICONS.eye      // 'eye'
ICONS.eyeOff   // 'eyeoff'
```

### 状态类
```tsx
ICONS.success  // 'checkcircle'
ICONS.warning  // 'warning'
ICONS.error    // 'closecircle'
ICONS.info     // 'infocirlce'
ICONS.loading  // 'loading1'
```

## 注意事项

1. **字体加载**：Web 端需要确保 vector-icons 字体已正确加载
2. **图标名称**：不同图标家族的图标名称可能不同，需查阅对应图标库文档
3. **平台差异**：Web 端和 Native 端的渲染方式略有不同，但 API 保持一致
4. **颜色格式**：支持十六进制、RGB、RGBA 等颜色格式

## 图标库文档

- [AntDesign Icons](https://ant.design/components/icon)
- [Font Awesome](https://fontawesome.com/icons)
- [Ionicons](https://ionicons.com/)
- [Material Icons](https://fonts.google.com/icons)

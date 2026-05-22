import React from 'react';
import {View, StyleSheet, TextStyle, Platform, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {createStyleSheet, useStyles} from '../../theme';

// 图标家族类型
export type IconFamily =
  | 'AntDesign'
  | 'Entypo'
  | 'EvilIcons'
  | 'Feather'
  | 'FontAwesome'
  | 'FontAwesome5'
  | 'Ionicons'
  | 'MaterialCommunityIcons'
  | 'MaterialIcons'
  | 'Octicons'
  | 'SimpleLineIcons';

// 图标大小预设
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// 图标属性
export interface SvgIconProps {
  /** 图标名称 */
  name: string;
  /** 图标家族 */
  family?: IconFamily;
  /** 图标大小 */
  size?: number | IconSize;
  /** 图标颜色 */
  color?: string;
  /** 点击事件 */
  onPress?: () => void;
  /** 容器样式 */
  style?: TextStyle;
  /** 是否禁用 */
  disabled?: boolean;
}

// 图标大小映射
const SIZE_MAP: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

const iconStyles = createStyleSheet({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
});

export const SvgIcon: React.FC<SvgIconProps> = ({
  name,
  family = 'AntDesign',
  size = 'md',
  color,
  onPress,
  style,
  disabled = false,
}) => {
  const iconSize = typeof size === 'number' ? size : SIZE_MAP[size];
  const iconColor = color || '#000';
  const isDisabled = disabled || !name;
  const styles = useStyles(iconStyles);

  // Native 端使用 react-native-vector-icons
  if (Platform.OS !== 'web') {
    const content = (
      <View style={[styles.container, isDisabled && styles.disabled, style]}>
        <Icon name={name} size={iconSize} color={iconColor} />
      </View>
    );

    if (onPress) {
      return (
        <TouchableOpacity onPress={onPress} disabled={isDisabled} activeOpacity={0.7}>
          {content}
        </TouchableOpacity>
      );
    }

    return content;
  }

  // Web 端：react-native-vector-icons 会自动加载字体
  // 使用 Text 组件配合字体
  const webContent = (
    <View style={[styles.container, isDisabled && styles.disabled, style]}>
      <Icon name={name} size={iconSize} color={iconColor} />
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} disabled={isDisabled} activeOpacity={0.7}>
        {webContent}
      </TouchableOpacity>
    );
  }

  return webContent;
};

/** 常用图标名称集合 */
export const ICONS = {
  // 箭头类
  arrowLeft: 'left',
  arrowRight: 'right',
  arrowUp: 'up',
  arrowDown: 'down',
  chevronLeft: 'chevronleft',
  chevronRight: 'chevronright',

  // 操作类
  add: 'plus',
  remove: 'minus',
  close: 'close',
  check: 'check',
  edit: 'edit',
  delete: 'delete',
  copy: 'copy',
  share: 'sharealt',
  download: 'download',
  upload: 'upload',

  // 媒体类
  image: 'picture',
  camera: 'camera',
  video: 'playcircleo',
  mic: 'mic',

  // 社交类
  user: 'user',
  users: 'users',
  heart: 'heart',
  star: 'staro',
  message: 'message1',
  mail: 'mail',

  // UI 类
  search: 'search',
  setting: 'setting',
  menu: 'menuunfold',
  more: 'ellipsis',
  refresh: 'reload1',
  filter: 'filter',
  sort: 'sort1',
  cart: 'shoppingcart',
  bell: 'bells',
  eye: 'eye',
  eyeOff: 'eyeoff',

  // 状态类
  success: 'checkcircle',
  warning: 'warning',
  error: 'closecircle',
  info: 'infocirlce',
  loading: 'loading1',
};

export default SvgIcon;

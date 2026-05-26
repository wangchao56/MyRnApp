import React from 'react';
import {View, TextStyle, Platform, TouchableOpacity} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {createStyleSheet, useStyles} from '../../theme';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type MaterialIconName = React.ComponentProps<typeof MaterialIcons>['name'];
export type IconFamily = 'material';

export interface SvgIconProps {
  name: string;
  size?: number | IconSize;
  color?: string;
  style?: TextStyle;
  disabled?: boolean;
}

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

export const SvgIcon: React.FC<SvgIconProps> = ({name, size = 'md', color, style, disabled = false}) => {
  const iconSize = typeof size === 'number' ? size : SIZE_MAP[size];
  const iconColor = color || '#000';
  const isDisabled = disabled || !name;
  const styles = useStyles(iconStyles);

  const icon = (
    <MaterialIcons
      name={name as MaterialIconName}
      size={iconSize}
      color={iconColor}
      style={[
        isDisabled && styles.disabled,
        Platform.OS === 'web' && {lineHeight: iconSize},
        style,
      ] as any}
    />
  );

  const content = (
    <View
      style={[
        styles.container,
        {
          width: iconSize,
          height: iconSize,
        },
      ]}>
      {icon}
    </View>
  );

  return content;
};

export const ICONS = {
  arrowLeft: 'arrow-back',
  arrowRight: 'arrow-forward',
  arrowUp: 'arrow-upward',
  arrowDown: 'arrow-downward',
  chevronLeft: 'chevron-left',
  chevronRight: 'chevron-right',

  add: 'add',
  remove: 'remove',
  close: 'close',
  check: 'check',
  edit: 'edit',
  delete: 'delete',
  copy: 'content-copy',
  share: 'share',
  download: 'file-download',
  upload: 'file-upload',

  image: 'image',
  camera: 'camera-alt',
  video: 'play-circle-filled',

  user: 'person',
  users: 'group',
  heart: 'favorite',
  star: 'star-border',
  message: 'message',
  mail: 'mail',

  search: 'search',
  setting: 'settings',
  menu: 'menu',
  more: 'more-vert',
  refresh: 'refresh',
  filter: 'filter-list',
  cart: 'shopping-cart',
  bell: 'notifications',
  eye: 'visibility',

  success: 'check-circle',
  warning: 'warning',
  error: 'error',
  info: 'info',
  loading: 'refresh',
};

export default SvgIcon;

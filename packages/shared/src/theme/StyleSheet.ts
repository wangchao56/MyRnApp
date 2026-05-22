import {
  StyleSheet as RNStyleSheet,
  ViewStyle,
  TextStyle,
  ImageStyle,
  DimensionValue,
} from 'react-native';
import {
  getThemedColors,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  BORDER_RADIUS,
  SHADOWS,
  type ThemedColors,
} from './tokens';
import {useTheme} from '../hooks';
import {useMemo} from 'react';
import {fitSize} from '../utils/responsive';

type NamedStyles<T> = {[P in keyof T]: ViewStyle | TextStyle | ImageStyle};

export interface ThemeContext {
  colors: ThemedColors;
  spacing: typeof SPACING;
  fontSizes: typeof FONT_SIZES;
  fontWeights: typeof FONT_WEIGHTS;
  borderRadius: typeof BORDER_RADIUS;
  shadows: typeof SHADOWS;
  isDarkMode: boolean;
  fz: typeof fitSize;
}

export type StyleSheetCreator<T extends NamedStyles<T>> = (
  theme: ThemeContext,
) => T;

// 需要响应式处理的样式属性
const RESPONSIVE_KEYS = new Set([
  'width',
  'height',
  'minWidth',
  'maxWidth',
  'minHeight',
  'maxHeight',
  'margin',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginHorizontal',
  'marginVertical',
  'padding',
  'paddingTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'paddingHorizontal',
  'paddingVertical',
  'borderRadius',
  'borderWidth',
  'borderTopWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderRightWidth',
  'fontSize',
  'lineHeight',
  'letterSpacing',
  'top',
  'bottom',
  'left',
  'right',
]);

// 递归处理样式对象
function processStyle<T extends ViewStyle | TextStyle | ImageStyle>(
  style: T,
): T {
  if (!style || typeof style !== 'object') {
    return style;
  }

  const result: Record<string, unknown> = {};

  for (const key in style) {
    const value = (style as Record<string, unknown>)[key];

    if (typeof value === 'number' && RESPONSIVE_KEYS.has(key)) {
      // 数值类型且是需要适配的属性，自动应用 fitSize
      result[key] = fitSize(value);
    } else if (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value)
    ) {
      // 嵌套对象（如 shadowOffset）递归处理
      result[key] = processStyle(value);
    } else {
      result[key] = value;
    }
  }

  return result as T;
}

export function createStyleSheet<T extends NamedStyles<T>>(
  styles: StyleSheetCreator<T> | T,
) {
  // 静态样式：自动处理数值属性
  if (typeof styles === 'object' && !Array.isArray(styles)) {
    const processed: Partial<T> = {};
    for (const key in styles) {
      processed[key] = processStyle(styles[key]);
    }
    return processed as T;
  }
  return styles;
}

export function useStyles<T extends NamedStyles<T>>(
  styleCreator: StyleSheetCreator<T> | T,
) {
  const {isDarkMode} = useTheme();

  return useMemo(() => {
    const theme: ThemeContext = {
      colors: getThemedColors(isDarkMode),
      spacing: SPACING,
      fontSizes: FONT_SIZES,
      fontWeights: FONT_WEIGHTS,
      borderRadius: BORDER_RADIUS,
      shadows: SHADOWS,
      isDarkMode,
      fz: fitSize,
    };

    const styles =
      typeof styleCreator === 'function' ? styleCreator(theme) : styleCreator;

    return RNStyleSheet.create(styles);
  }, [isDarkMode]);
}

export {
  SPACING as spacing,
  FONT_SIZES as fontSizes,
  FONT_WEIGHTS as fontWeights,
  BORDER_RADIUS as borderRadius,
  SHADOWS as shadows,
  getThemedColors,
};

export type {ThemedColors};

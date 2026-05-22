import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {LinearGradient as ExpoLinearGradient} from 'expo-linear-gradient';

// 渐变方向类型
export type GradientDirection =
  | 'horizontal' // 从左到右
  | 'vertical' // 从上到下
  | 'diagonal' // 对角线 (左上到右下)
  | 'diagonal-up'; // 对角线上 (左下到右上)

// 颜色停止点类型
export interface ColorStop {
  color: string;
  location?: number; // 0-1 之间的值，表示颜色的位置
}

export interface GradientProps {
  /** 渐变颜色数组 */
  colors: string[] | ColorStop[];
  /** 渐变方向 */
  direction?: GradientDirection;
  /** 自定义渐变起点坐标 (0-1) */
  start?: {x: number; y: number};
  /** 自定义渐变终点坐标 (0-1) */
  end?: {x: number; y: number};
  /** 子元素 */
  children?: React.ReactNode;
  /** 容器样式 */
  style?: ViewStyle;
}

// 方向到坐标的映射
const DIRECTION_MAP: Record<
  GradientDirection,
  {start: {x: number; y: number}; end: {x: number; y: number}}
> = {
  horizontal: {
    start: {x: 0, y: 0.5},
    end: {x: 1, y: 0.5},
  },
  vertical: {
    start: {x: 0.5, y: 0},
    end: {x: 0.5, y: 1},
  },
  diagonal: {
    start: {x: 0, y: 0},
    end: {x: 1, y: 1},
  },
  'diagonal-up': {
    start: {x: 0, y: 1},
    end: {x: 1, y: 0},
  },
};

// 处理颜色数组，确保至少有2个颜色
function processColors(
  colors: string[] | ColorStop[],
): [string, string, ...string[]] {
  if (colors.length === 0) return ['#000', '#fff'];
  if (colors.length === 1) return [colors[0] as string, colors[0] as string];

  const firstItem = colors[0];
  if (typeof firstItem === 'string') {
    return colors as [string, string, ...string[]];
  }

  return (colors as ColorStop[]).map(stop => stop.color) as [
    string,
    string,
    ...string[],
  ];
}

const gradientStyles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

export const Gradient: React.FC<GradientProps> = ({
  colors,
  direction,
  start,
  end,
  children,
  style,
}) => {
  const colorArray = processColors(colors);

  const gradientStart =
    start ?? (direction ? DIRECTION_MAP[direction].start : {x: 0, y: 0});
  const gradientEnd =
    end ?? (direction ? DIRECTION_MAP[direction].end : {x: 0, y: 1});

  return (
    <View style={[gradientStyles.container, style]}>
      <ExpoLinearGradient
        colors={colorArray}
        start={gradientStart}
        end={gradientEnd}
        style={StyleSheet.absoluteFill}>
        {children}
      </ExpoLinearGradient>
    </View>
  );
};

/** 创建双色渐变 */
export const createGradientColors = (
  startColor: string,
  endColor: string,
): string[] => {
  return [startColor, endColor];
};

/** 创建多色渐变 */
export const createMultiColorGradient = (...colors: string[]): string[] => {
  return colors;
};

export default Gradient;

import React from 'react';
import {Platform, StyleSheet, View, ViewStyle} from 'react-native';

export type GradientDirection = 'horizontal' | 'vertical' | 'diagonal' | 'diagonal-up';

export interface ColorStop {
  color: string;
  location?: number;
}

export interface GradientProps {
  colors: string[] | ColorStop[];
  direction?: GradientDirection;
  start?: {x: number; y: number};
  end?: {x: number; y: number};
  children?: React.ReactNode;
  style?: ViewStyle;
}

const gradientStyles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

const DIRECTION_TO_CSS: Record<GradientDirection, string> = {
  horizontal: '90deg',
  vertical: '180deg',
  diagonal: '135deg',
  'diagonal-up': '45deg',
};

function normalizeColors(colors: string[] | ColorStop[]): string[] {
  if (colors.length === 0) {
    return ['#000000', '#ffffff'];
  }

  if (typeof colors[0] === 'string') {
    return colors as string[];
  }

  return (colors as ColorStop[]).map(stop => stop.color);
}

function buildWebGradient(colors: string[], direction?: GradientDirection): ViewStyle {
  const angle = DIRECTION_TO_CSS[direction ?? 'vertical'];
  return {
    backgroundImage: `linear-gradient(${angle}, ${colors.join(', ')})`,
  } as ViewStyle;
}

export const Gradient: React.FC<GradientProps> = ({colors, direction, children, style}) => {
  const colorArray = normalizeColors(colors);
  const fallbackColor = colorArray[0] ?? '#000000';

  const platformStyle =
    Platform.OS === 'web'
      ? buildWebGradient(colorArray, direction)
      : ({backgroundColor: fallbackColor} as ViewStyle);

  return <View style={[gradientStyles.container, platformStyle, style]}>{children}</View>;
};

export const createGradientColors = (startColor: string, endColor: string): string[] => {
  return [startColor, endColor];
};

export const createMultiColorGradient = (...colors: string[]): string[] => {
  return colors;
};

export default Gradient;

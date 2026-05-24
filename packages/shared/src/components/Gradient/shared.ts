import type React from 'react';
import {StyleSheet, ViewStyle} from 'react-native';

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
  locations?: number[];
  children?: React.ReactNode;
  style?: ViewStyle;
}

export const gradientStyles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

export const DIRECTION_TO_CSS: Record<GradientDirection, string> = {
  horizontal: '90deg',
  vertical: '180deg',
  diagonal: '135deg',
  'diagonal-up': '45deg',
};

export const DIRECTION_TO_START_END: Record<
  GradientDirection,
  {start: {x: number; y: number}; end: {x: number; y: number}}
> = {
  horizontal: {start: {x: 0, y: 0.5}, end: {x: 1, y: 0.5}},
  vertical: {start: {x: 0.5, y: 0}, end: {x: 0.5, y: 1}},
  diagonal: {start: {x: 0, y: 0}, end: {x: 1, y: 1}},
  'diagonal-up': {start: {x: 0, y: 1}, end: {x: 1, y: 0}},
};

export function normalizeColors(colors: string[] | ColorStop[]): string[] {
  if (colors.length === 0) {
    return ['#000000', '#ffffff'];
  }

  if (typeof colors[0] === 'string') {
    return colors as string[];
  }

  return (colors as ColorStop[]).map(stop => stop.color);
}

export function normalizeLocations(colors: string[] | ColorStop[]): number[] | undefined {
  if (colors.length === 0 || typeof colors[0] === 'string') {
    return undefined;
  }

  const locations = (colors as ColorStop[])
    .map(stop => stop.location)
    .filter((loc): loc is number => loc !== undefined);
  return locations.length === colors.length ? locations : undefined;
}

export function buildWebGradient(
  colors: string[],
  direction?: GradientDirection,
  start?: {x: number; y: number},
  end?: {x: number; y: number},
  locations?: number[],
): ViewStyle {
  let angle: string;
  if (start && end) {
    angle = `${Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI) + 90}deg`;
  } else {
    angle = DIRECTION_TO_CSS[direction ?? 'vertical'];
  }

  const colorStops = colors.map((color, index) => {
    if (locations && locations[index] !== undefined) {
      return `${color} ${locations[index] * 100}%`;
    }
    return color;
  });

  return {
    backgroundImage: `linear-gradient(${angle}, ${colorStops.join(', ')})`,
  } as ViewStyle;
}

export const createGradientColors = (startColor: string, endColor: string): string[] => {
  return [startColor, endColor];
};

export const createMultiColorGradient = (...colors: string[]): string[] => {
  return colors;
};

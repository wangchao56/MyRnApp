import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const DESIGN_WIDTH = 375;
const DESIGN_HEIGHT = 812;

export const scale = (size: number): number => {
  return (size / DESIGN_WIDTH) * SCREEN_WIDTH;
};

export const scaleHeight = (size: number): number => {
  return (size / DESIGN_HEIGHT) * SCREEN_HEIGHT;
};

export const scaleFont = (size: number): number => {
  const scaled = scale(size);
  return Math.min(Math.max(scaled, 10), 48);
};

export const SCREEN = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmallScreen: SCREEN_WIDTH < 375,
  isLargeScreen: SCREEN_WIDTH >= 414,
};
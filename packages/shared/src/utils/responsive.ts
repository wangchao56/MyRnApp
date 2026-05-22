import {Dimensions} from 'react-native';

// 获取屏幕的实际宽高（基于设计稿的基准尺寸）
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

// 设计稿的基准尺寸（iPhone X/11/12/13 标准分辨率）
const DESIGN_WIDTH = 375;
const DESIGN_HEIGHT = 812;

/**
 * 根据屏幕宽度进行适配（设置尺寸时使用）
 * @param val - 设计稿中的尺寸
 * @returns 实际渲染尺寸
 */
export const fitSize = (val: number): number => {
  return (val / DESIGN_WIDTH) * SCREEN_WIDTH;
};

export const fz = fitSize; // 字体适配函数别名

/**
 * 根据屏幕高度进行缩放
 * @param size - 设计稿中的尺寸
 * @returns 实际渲染尺寸
 * 适用于需要根据屏幕高度调整的元素（如间距）
 */
export const scaleHeight = (size: number): number => {
  return (size / DESIGN_HEIGHT) * SCREEN_HEIGHT;
};

/**
 * 字体大小缩放
 * @param size - 设计稿中的字体大小
 * @returns 实际字体大小
 * 限制字体大小范围在 10-48 之间，避免过大或过小
 */
export const scaleFont = (size: number): number => {
  const scaled = fitSize(size);
  return Math.min(Math.max(scaled, 10), 48);
};

/**
 * 屏幕相关常量
 */
export const SCREEN = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmallScreen: SCREEN_WIDTH < 375, // 小屏幕设备（如 iPhone SE）
  isLargeScreen: SCREEN_WIDTH >= 414, // 大屏幕设备（如 iPhone Max/Plus）
};

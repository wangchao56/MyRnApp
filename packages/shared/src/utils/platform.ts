import { Platform, Dimensions } from 'react-native';

export const isWeb = Platform.OS === 'web';
export const isNative = Platform.OS !== 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const getScreenSize = () => {
  const { width, height } = Dimensions.get('window');
  return { width, height };
};

export function platformSelect<T>(options: {
  ios?: T;
  android?: T;
  web?: T;
  default?: T;
}): T | undefined {
  if (isIOS && options.ios !== undefined) return options.ios;
  if (isAndroid && options.android !== undefined) return options.android;
  if (isWeb && options.web !== undefined) return options.web;
  return options.default;
}

export const getSafeAreaInsets = () => {
  if (isWeb && typeof window !== 'undefined') {
    const bodyStyle = window.getComputedStyle(document.body);
    return {
      top: parseInt(bodyStyle.paddingTop) || 0,
      bottom: parseInt(bodyStyle.paddingBottom) || 0,
      left: 0,
      right: 0,
    };
  }
  return null;
};

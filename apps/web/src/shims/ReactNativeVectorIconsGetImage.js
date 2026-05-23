export const ensureNativeModuleAvailable = () => {};

export const getImageForFont = async () => {
  throw new Error('getImageForFont is not supported in the web build.');
};

export const getImageForFontSync = () => {
  throw new Error('getImageForFontSync is not supported in the web build.');
};

export default {
  ensureNativeModuleAvailable,
  getImageForFont,
  getImageForFontSync,
};

import {PixelRatio, Platform, ImageStyle, StyleSheet} from 'react-native';

export type ImageSource = string | {uri: string} | number;

export interface ImageProcessConfig {
  ossSuffix?: {
    normal: string[];
    preview: string[];
  };
  enableResize?: boolean;
  enableQuality?: boolean;
}

export interface OssResizeOptions {
  p?: number;
  w?: number;
  h?: number;
  m?: 'lfit' | 'mfit' | 'fill' | 'pad' | 'fixed';
  l?: number;
  s?: number;
  limit?: 0 | 1;
  color?: string;
}

export interface ImageProcessOptions {
  skipSize?: boolean;
  notChangeSource?: boolean;
  customSuffix?: string;
  resizeOptions?: OssResizeOptions;
}

const defaultConfig: ImageProcessConfig = {
  ossSuffix: {
    normal: ['?x-oss-process=style/x1', '?x-oss-process=style/x2', '?x-oss-process=style/x3'],
    preview: ['?x-oss-process=style/thumb_x1', '?x-oss-process=style/thumb_x2', '?x-oss-process=style/thumb_x3'],
  },
  enableResize: true,
  enableQuality: true,
};

let globalConfig: ImageProcessConfig = {...defaultConfig};

export const setImageConfig = (config: Partial<ImageProcessConfig>) => {
  globalConfig = {...globalConfig, ...config};
};

export const getImageConfig = () => globalConfig;

const getPixelRatio = () => {
  if (Platform.OS === 'web') {
    return Math.min(window.devicePixelRatio || 1, 3);
  }
  return Math.min(PixelRatio.get(), 3);
};

export const isGifImage = (uri: string): boolean => {
  if (!uri) {
    return false;
  }
  const lowerUri = uri.toLowerCase();
  return lowerUri.endsWith('.gif') || lowerUri.includes('.gif?');
};

export const getQualitySuffix = (isPreview: boolean, pixelRatio: number, suffix: string[]): string => {
  if (pixelRatio >= 3 && suffix[2]) {
    return suffix[2];
  } else if (pixelRatio >= 2 && suffix[1]) {
    return suffix[1];
  } else {
    return suffix[0];
  }
};

export const processImageUrl = (
  uri: string,
  width?: string | number,
  height?: string | number,
  isPreview: boolean = false,
  options: ImageProcessOptions = {},
): string => {
  const {skipSize = false, notChangeSource = false, customSuffix, resizeOptions} = options;

  if (!uri) {
    return uri;
  }
  if (notChangeSource) {
    return uri;
  }
  if (isGifImage(uri)) {
    return uri;
  }

  if (resizeOptions) {
    return processImageUrlWithResizeOptions(uri, resizeOptions);
  }

  if (customSuffix) {
    return uri + customSuffix;
  }

  const config = getImageConfig();
  const suffixArray: string[] =
    config.ossSuffix?.[isPreview ? 'preview' : 'normal'] ||
    defaultConfig.ossSuffix?.[isPreview ? 'preview' : 'normal'] ||
    [];

  if (skipSize || !width || !height) {
    return uri + getQualitySuffix(isPreview, getPixelRatio(), suffixArray);
  }

  if (!config.enableResize) {
    return uri + getQualitySuffix(isPreview, getPixelRatio(), suffixArray);
  }

  const isWidthNumber = typeof width === 'number';
  const isHeightNumber = typeof height === 'number';
  const pixelRatio = getPixelRatio();

  if (isWidthNumber && isHeightNumber) {
    const resizedWidth = ~~(Number(width) * pixelRatio);
    const resizedHeight = ~~(Number(height) * pixelRatio);
    return `${uri}?x-oss-process=image/resize,w_${resizedWidth},h_${resizedHeight}`;
  }

  if (isWidthNumber) {
    const resizedWidth = ~~(Number(width) * pixelRatio);
    return `${uri}?x-oss-process=image/resize,w_${resizedWidth}`;
  }

  if (isHeightNumber) {
    const resizedHeight = ~~(Number(height) * pixelRatio);
    return `${uri}?x-oss-process=image/resize,h_${resizedHeight}`;
  }

  return uri + getQualitySuffix(isPreview, pixelRatio, suffixArray);
};

export const processSource = (
  source: ImageSource,
  width?: string | number,
  height?: string | number,
  isPreview: boolean = false,
  options: ImageProcessOptions = {},
): ImageSource => {
  if (!source) {
    return source;
  }

  if (typeof source === 'number') {
    return source;
  }

  if (typeof source === 'string') {
    return {
      uri: processImageUrl(source, width, height, isPreview, options),
    };
  }

  if (typeof source === 'object' && 'uri' in source) {
    return {
      ...source,
      uri: processImageUrl(source.uri, width, height, isPreview, options),
    };
  }

  return source;
};

export const extractSizeFromStyle = (style: ImageStyle | ImageStyle[]): {width?: number; height?: number} => {
  const flattenedStyle = StyleSheet.flatten(style);
  return {
    width: flattenedStyle.width as number | undefined,
    height: flattenedStyle.height as number | undefined,
  };
};

export const isOssImage = (uri: string): boolean => {
  if (!uri) {
    return false;
  }
  const ossDomains = ['aliyuncs.com', 'aliclouddn.com', 'taobaocdn.com', 'tbcdn.com'];

  try {
    const url = new URL(uri);
    return ossDomains.some(domain => url.hostname.includes(domain));
  } catch {
    return false;
  }
};

export const buildOssResizeParams = (options: OssResizeOptions): string => {
  const params: string[] = [];

  if (options.p !== undefined) {
    params.push(`p_${options.p}`);
  }
  if (options.w !== undefined) {
    params.push(`w_${options.w}`);
  }
  if (options.h !== undefined) {
    params.push(`h_${options.h}`);
  }
  if (options.m) {
    params.push(`m_${options.m}`);
  }
  if (options.l !== undefined) {
    params.push(`l_${options.l}`);
  }
  if (options.s !== undefined) {
    params.push(`s_${options.s}`);
  }
  if (options.limit !== undefined) {
    params.push(`limit_${options.limit}`);
  }
  if (options.color) {
    params.push(`color_${options.color}`);
  }

  return params.length > 0 ? `image/resize,${params.join(',')}` : '';
};

export const processImageUrlWithResizeOptions = (uri: string, resizeOptions: OssResizeOptions): string => {
  if (!uri) {
    return uri;
  }
  if (isGifImage(uri)) {
    return uri;
  }

  const processParams = buildOssResizeParams(resizeOptions);
  if (!processParams) {
    return uri;
  }

  if (uri.includes('?')) {
    if (uri.includes('x-oss-process=')) {
      return uri;
    }
    return `${uri}&x-oss-process=${encodeURIComponent(processParams)}`;
  }

  return `${uri}?x-oss-process=${encodeURIComponent(processParams)}`;
};

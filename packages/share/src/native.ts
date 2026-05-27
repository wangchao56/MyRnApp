import type { ShareData, ShareResult } from './types';

type ShareModule = {
  default: {
    open: (options: {
      title?: string;
      message?: string;
      url?: string;
    }) => Promise<{ success?: boolean; message?: string }>;
  };
};

function loadShareModule(): ShareModule['default'] {
  try {
    // 鸿蒙可选依赖，未安装时 fallback；避免 Web 打包器静态解析请使用 native.web.ts
    const ohShare =
      require('@react-native-oh-library/react-native-share') as ShareModule;
    return ohShare.default;
  } catch {
    const rnShare = require('react-native-share') as ShareModule;
    return rnShare.default;
  }
}

export async function shareNative(data: ShareData): Promise<ShareResult> {
  try {
    const Share = loadShareModule();
    await Share.open({
      title: data.title,
      message: data.message,
      url: data.url,
    });
    return { success: true, method: 'native-share' };
  } catch (error: unknown) {
    const err = error as { message?: string; dismissedAction?: boolean };
    const message = err?.message ?? '';
    if (
      message.includes('User did not share') ||
      message.includes('dismissed') ||
      err?.dismissedAction
    ) {
      return {
        success: false,
        cancelled: true,
        method: 'native-share',
        error: 'User dismissed',
      };
    }
    return {
      success: false,
      method: 'native-share',
      error: error instanceof Error ? error.message : 'Share failed',
    };
  }
}

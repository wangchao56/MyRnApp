import { PlatformType } from './types';

export class EnvDetector {
  static isRNWebView(): boolean {
    return typeof window !== 'undefined' && !!window.ReactNativeWebView;
  }

  static isWechat(): boolean {
    return typeof navigator !== 'undefined' && /MicroMessenger/i.test(navigator.userAgent);
  }

  static async isMiniProgram(): Promise<boolean> {
    if (!EnvDetector.isWechat()) return false;

    return new Promise((resolve) => {
      const wx = (window as any).wx;
      if (wx?.miniProgram) {
        wx.miniProgram.getEnv((res: any) => resolve(!!res.miniprogram));
      } else {
        setTimeout(() => {
          resolve(false);
        }, 100);
      }
    });
  }

  static async getPlatform(): Promise<PlatformType> {
    if (EnvDetector.isRNWebView()) return 'rn';
    if (await EnvDetector.isMiniProgram()) return 'miniprogram';
    if (EnvDetector.isWechat()) return 'wechat-h5';
    return 'browser';
  }
}

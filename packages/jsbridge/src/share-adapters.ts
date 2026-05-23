import { PlatformType, ShareOptions } from "./types";

export interface ShareAdapter {
  share(options: ShareOptions): Promise<any>;
  isAvailable(): boolean | Promise<boolean>;
}

export class RNShareAdapter implements ShareAdapter {
  private sendMessage: (msg: string) => void;

  constructor(sendMessage: (msg: string) => void) {
    this.sendMessage = sendMessage;
  }

  isAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.ReactNativeWebView;
  }

  async share(options: ShareOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      const msgId = `${Date.now()}_${Math.random().toString(36).slice(2)}`;

      const handler = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          if (data.msgId === msgId) {
            window.removeEventListener('message', handler);
            data.code === 200 || data.code === 0 ? resolve(data.data) : reject(new Error(data.error));
          }
        } catch {}
      };

      window.addEventListener('message', handler);

      this.sendMessage(
        JSON.stringify({
          msgId,
          action: 'share',
          data: options,
        })
      );
    });
  }
}

export class WechatJSSDKAdapter implements ShareAdapter {
  private wxReady: Promise<void>;

  constructor() {
    this.wxReady = new Promise((resolve) => {
      const wx = (window as any).wx;
      if (wx?.ready) {
        wx.ready(resolve);
      } else {
        resolve();
      }
    });
  }

  isAvailable(): boolean {
    return typeof window !== 'undefined' && !!(window as any).wx;
  }

  async share(options: ShareOptions): Promise<any> {
    await this.wxReady;

    const wx = (window as any).wx;

    const shareData = {
      title: options.title,
      desc: options.desc || '',
      link: options.link,
      imgUrl: options.imgUrl || '',
      success: () => {},
      cancel: () => {},
    };

    return new Promise((resolve) => {
      if (wx?.updateAppMessageShareData) {
        wx.updateAppMessageShareData({
          ...shareData,
          success: () => resolve({ success: true }),
          cancel: () => resolve({ success: false, cancelled: true }),
        });
      }

      if (wx?.updateTimelineShareData) {
        wx.updateTimelineShareData({
          title: options.title,
          link: options.link,
          imgUrl: options.imgUrl,
          success: () => resolve({ success: true }),
          cancel: () => resolve({ success: false, cancelled: true }),
        });
      }

      resolve({
        success: true,
        method: 'wechat-menu',
        message: '请点击右上角分享',
      });
    });
  }
}

export class MiniProgramAdapter implements ShareAdapter {
  isAvailable(): boolean {
    return typeof window !== 'undefined' && !!(window as any).wx?.miniProgram;
  }

  async share(options: ShareOptions): Promise<any> {
    const wx = (window as any).wx;

    wx.miniProgram.postMessage({
      data: {
        action: 'share',
        ...options,
      },
    });

    wx.miniProgram.showShareMenu?.({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    });

    return {
      success: true,
      method: 'miniprogram-menu',
      message: '请点击右上角分享',
    };
  }
}

export class BrowserShareAdapter implements ShareAdapter {
  isAvailable(): boolean {
    return typeof navigator !== 'undefined' && !!navigator.share;
  }

  async share(options: ShareOptions): Promise<any> {
    return navigator.share({
      title: options.title,
      text: options.desc,
      url: options.link,
    });
  }
}

export class ClipboardAdapter implements ShareAdapter {
  isAvailable(): boolean {
    return typeof navigator !== 'undefined' && !!navigator.clipboard;
  }

  async share(options: ShareOptions): Promise<any> {
    await navigator.clipboard.writeText(`${options.title}\n${options.link}`);
    return { success: true, method: 'clipboard', message: '链接已复制' };
  }
}

export function getAdaptersForPlatform(
  platform: PlatformType,
  sendRNMessage: (msg: string) => void
): ShareAdapter[] {
  const adapters: ShareAdapter[] = [];

  switch (platform) {
    case 'rn':
      adapters.push(new RNShareAdapter(sendRNMessage));
      break;
    case 'miniprogram':
      adapters.push(new MiniProgramAdapter());
      break;
    case 'wechat-h5':
      adapters.push(new WechatJSSDKAdapter());
      break;
    case 'browser':
      adapters.push(new BrowserShareAdapter());
      adapters.push(new ClipboardAdapter());
      break;
  }

  return adapters;
}

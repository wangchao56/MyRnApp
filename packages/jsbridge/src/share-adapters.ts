import { PlatformType, ShareOptions } from './types';

export interface ShareAdapter {
  share(options: ShareOptions): Promise<unknown>;
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

  async share(options: ShareOptions): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const msgId = `${Date.now()}_${Math.random().toString(36).slice(2)}`;

      const handler = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          if (data.msgId === msgId) {
            window.removeEventListener('message', handler);
            data.code === 200 || data.code === 0
              ? resolve(data.data)
              : reject(new Error(data.error));
          }
        } catch {
          // ignore non-bridge messages
        }
      };

      window.addEventListener('message', handler);

      this.sendMessage(
        JSON.stringify({
          msgId,
          action: 'share',
          data: options,
        }),
      );
    });
  }
}

export class WebShareAdapter implements ShareAdapter {
  isAvailable(): boolean {
    return typeof window !== 'undefined';
  }

  async share(options: ShareOptions): Promise<unknown> {
    const { shareWeb, shareOptionsToShareData } = await import('@myapp/share/web');
    return shareWeb(shareOptionsToShareData(options));
  }
}

export class MiniProgramAdapter implements ShareAdapter {
  isAvailable(): boolean {
    return typeof window !== 'undefined' && !!(window as Window & { wx?: { miniProgram?: unknown } }).wx?.miniProgram;
  }

  async share(options: ShareOptions): Promise<unknown> {
    const wx = (
      window as unknown as {
        wx: {
          miniProgram: {
            postMessage: (payload: { data: unknown }) => void;
            showShareMenu?: (opts: Record<string, unknown>) => void;
          };
        };
      }
    ).wx;

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

export function getAdaptersForPlatform(
  platform: PlatformType,
  sendRNMessage: (msg: string) => void,
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
    case 'browser':
      adapters.push(new WebShareAdapter());
      break;
  }

  return adapters;
}

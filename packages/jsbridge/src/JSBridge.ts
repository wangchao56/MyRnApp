import {
  BridgeRequest,
  BridgeResponse,
  DEFAULT_TIMEOUT,
  ShareOptions,
  PlatformType,
} from './types';

declare var process: {
  env: {
    NODE_ENV?: string;
  };
};
import { EnvDetector } from './env';
import { ShareAdapter, getAdaptersForPlatform, ClipboardAdapter } from './share-adapters';

type PendingCallback = {
  resolve: (value: any) => void;
  reject: (error: Error) => void;
  timeoutId?: ReturnType<typeof setTimeout>;
};

type MockHandler = (action: string, data?: any) => any;

interface JSBridgeOptions {
  timeout?: number;
  enableMock?: boolean;
  mockHandler?: MockHandler;
}

class JSBridge {
  private callbacks: Map<string, PendingCallback> = new Map();
  private idCounter = 0;
  private timeout: number;
  private enableMock: boolean;
  private mockHandler?: MockHandler;
  private isInitialized = false;
  private platform: PlatformType | null = null;
  private shareAdapters: ShareAdapter[] = [];

  constructor(options: JSBridgeOptions = {}) {
    this.timeout = options.timeout ?? DEFAULT_TIMEOUT;
    this.enableMock = options.enableMock ?? process.env.NODE_ENV === 'development';
    this.mockHandler = options.mockHandler;
    this.init();
  }

  private async init(): Promise<void> {
    this.setupGlobalReceiver();
    this.platform = await EnvDetector.getPlatform();
    this.setupShareAdapters();
    this.isInitialized = true;
  }

  private generateMsgId(): string {
    return `${Date.now()}_${++this.idCounter}_${Math.random().toString(36).slice(2, 6)}`;
  }

  private setupGlobalReceiver(): void {
    if (typeof window === 'undefined') return;

    (window as any).__RECEIVE_MESSAGE_FROM_APP__ = this.receiveMessage.bind(this);
    (window as any).__ON_APP_EVENT__ = this.handleAppEvent.bind(this);
  }

  getPlatform(): PlatformType | null {
    return this.platform;
  }

  isInApp(): boolean {
    return this.platform === 'rn';
  }

  isInMiniProgram(): boolean {
    return this.platform === 'miniprogram';
  }

  isInWechat(): boolean {
    return this.platform === 'wechat-h5' || this.platform === 'miniprogram';
  }

  invoke<T = any, R = any>(action: string, data?: T): Promise<R> {
    return new Promise((resolve, reject) => {
      if (!this.isInApp()) {
        if (this.enableMock) {
          const mockResult = this.getMockResult(action, data);
          if (mockResult !== undefined) {
            resolve(mockResult as R);
            return;
          }
        }
        reject(new Error(`Action '${action}' 需要在 App 环境内执行，当前环境: ${this.platform}`));
        return;
      }

      const msgId = this.generateMsgId();

      const timeoutId = setTimeout(() => {
        this.callbacks.delete(msgId);
        reject(new Error(`Action '${action}' 超时 (${this.timeout}ms)`));
      }, this.timeout);

      this.callbacks.set(msgId, { resolve, reject, timeoutId });

      const request: BridgeRequest<T> = { msgId, action, data };
      window.ReactNativeWebView?.postMessage(JSON.stringify(request));
    });
  }

  private receiveMessage(responseString: string): void {
    try {
      const response: BridgeResponse = JSON.parse(responseString);
      const { msgId, code, data, error } = response;

      const callback = this.callbacks.get(msgId);
      if (!callback) return;

      if (callback.timeoutId) {
        clearTimeout(callback.timeoutId);
      }

      if (code === 200 || code === 0) {
        callback.resolve(data);
      } else {
        callback.reject(new Error(error || `Error code: ${code}`));
      }

      this.callbacks.delete(msgId);
    } catch (e) {
      console.error('[JSBridge] 解析 App 返回数据失败', e);
    }
  }

  private handleAppEvent(eventType: string, data: any): void {
    console.log(`[JSBridge] App 推送事件: ${eventType}`, data);
    const eventHandlers = (window as any).__APP_EVENT_HANDLERS__;
    if (eventHandlers && eventHandlers[eventType]) {
      eventHandlers[eventType](data);
    }
  }

  onAppEvent(eventType: string, handler: (data: any) => void): () => void {
    if (typeof window !== 'undefined') {
      if (!(window as any).__APP_EVENT_HANDLERS__) {
        (window as any).__APP_EVENT_HANDLERS__ = {};
      }
      (window as any).__APP_EVENT_HANDLERS__[eventType] = handler;
    }

    return () => this.offAppEvent(eventType);
  }

  offAppEvent(eventType: string): void {
    if (typeof window !== 'undefined' && (window as any).__APP_EVENT_HANDLERS__) {
      delete (window as any).__APP_EVENT_HANDLERS__[eventType];
    }
  }

  private setupShareAdapters(): void {
    if (!this.platform) return;

    const sendRNMessage = (msg: string) => {
      window.ReactNativeWebView?.postMessage(msg);
    };

    this.shareAdapters = getAdaptersForPlatform(this.platform, sendRNMessage);
  }

  async share(options: ShareOptions): Promise<any> {
    if (this.isInApp()) {
      return this.invoke('share', options);
    }

    for (const adapter of this.shareAdapters) {
      try {
        const available = await adapter.isAvailable();
        if (available) {
          return await adapter.share(options);
        }
      } catch (error) {
        console.warn('[JSBridge] 分享适配器失败，尝试下一个', error);
        continue;
      }
    }

    const fallbackAdapter = new ClipboardAdapter();
    if (await fallbackAdapter.isAvailable()) {
      return fallbackAdapter.share(options);
    }

    throw new Error('当前环境不支持分享功能');
  }

  private getMockResult(action: string, data?: any): any {
    if (this.mockHandler) {
      const custom = this.mockHandler(action, data);
      if (custom !== undefined) return custom;
    }

    const mocks: Record<string, any> = {
      getUserInfo: { userId: '888', name: 'Demo User', email: 'demo@example.com', avatar: '' },
      getToken: 'mock_token_' + Date.now(),
      getLocation: { latitude: 31.2304, longitude: 121.4737, city: '上海' },
      scanQRCode: { result: 'https://example.com', format: 'QR_CODE' },
      share: { success: true, mock: true },
      getDeviceInfo: {
        platform: 'iOS',
        version: '16.0',
        model: 'iPhone14,2',
        appVersion: '1.0.0',
      },
      getAppInfo: { version: '1.0.0', platform: 'React Native', buildNumber: '100' },
    };

    return mocks[action];
  }

  get pendingCount(): number {
    return this.callbacks.size;
  }

  destroy(): void {
    this.callbacks.forEach(({ timeoutId, reject }) => {
      if (timeoutId) clearTimeout(timeoutId);
      reject(new Error('JSBridge 已销毁'));
    });
    this.callbacks.clear();
  }
}

export const jsbridge = new JSBridge();

export const invoke = <T = any, R = any>(action: string, data?: T): Promise<R> => {
  return jsbridge.invoke<T, R>(action, data);
};

export const share = (options: ShareOptions): Promise<any> => {
  return jsbridge.share(options);
};

export const isInApp = (): boolean => jsbridge.isInApp();

export const isInMiniProgram = (): boolean => jsbridge.isInMiniProgram();

export const isInWechat = (): boolean => jsbridge.isInWechat();

export const getPlatform = (): PlatformType | null => jsbridge.getPlatform();

export const onAppEvent = (eventType: string, handler: (data: any) => void): (() => void) => {
  return jsbridge.onAppEvent(eventType, handler);
};

export const offAppEvent = (eventType: string): void => {
  jsbridge.offAppEvent(eventType);
};

export default jsbridge;

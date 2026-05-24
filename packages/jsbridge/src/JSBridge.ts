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
  createdAt: number;
};

type MockHandler = (action: string, data?: any) => any;

interface JSBridgeOptions {
  timeout?: number;
  enableMock?: boolean;
  mockHandler?: MockHandler;
}

const MAX_MESSAGE_QUEUE_SIZE = 100;
const MESSAGE_TTL = 30000;

class JSBridge {
  private callbacks: Map<string, PendingCallback> = new Map();
  private idCounter = 0;
  private timeout: number;
  private enableMock: boolean;
  private mockHandler?: MockHandler;
  private isInitialized = false;
  private platform: PlatformType | null = null;
  private shareAdapters: ShareAdapter[] = [];
  private messageQueue: Array<{ data: string; timestamp: number }> = [];
  private isReady = false;
  private readyPromiseResolve?: () => void;
  private readyPromise = new Promise<void>((resolve) => {
    this.readyPromiseResolve = resolve;
  });

  constructor(options: JSBridgeOptions = {}) {
    this.timeout = options.timeout ?? DEFAULT_TIMEOUT;
    this.enableMock = options.enableMock ?? process.env.NODE_ENV === 'development';
    this.mockHandler = options.mockHandler;
    this.init();
  }

  private async init(): Promise<void> {
    this.setupGlobalReceiver();
    this.setupReadyListener();
    this.platform = await EnvDetector.getPlatform();
    this.setupShareAdapters();
    this.isInitialized = true;
    
    this.cleanupExpiredCallbacks();
  }

  private setupReadyListener(): void {
    if (typeof window === 'undefined') return;

    const checkReady = () => {
      if ((window as any).__HYBRID_WEBVIEW_READY__) {
        this.setReady();
      }
    };

    window.addEventListener('hybridWebViewReady', () => {
      this.setReady();
    });

    setTimeout(checkReady, 100);
  }

  private setReady(): void {
    if (!this.isReady) {
      this.isReady = true;
      this.flushMessageQueue();
      this.readyPromiseResolve?.();
    }
  }

  waitForReady(): Promise<void> {
    if (this.isReady) {
      return Promise.resolve();
    }
    return this.readyPromise;
  }

  get readyState(): boolean {
    return this.isReady;
  }

  private generateMsgId(): string {
    return `${Date.now()}_${++this.idCounter}_${Math.random().toString(36).slice(2, 6)}`;
  }

  private setupGlobalReceiver(): void {
    if (typeof window === 'undefined') return;

    (window as any).__RECEIVE_MESSAGE_FROM_APP__ = this.receiveMessage.bind(this);
    (window as any).__ON_APP_EVENT__ = this.handleAppEvent.bind(this);
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const item = this.messageQueue.shift();
      if (item && Date.now() - item.timestamp < MESSAGE_TTL) {
        window.ReactNativeWebView?.postMessage(item.data);
      }
    }
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

  async invoke<T = any, R = any>(action: string, data?: T): Promise<R> {
    if (!this.isInApp()) {
      if (this.enableMock) {
        const mockResult = this.getMockResult(action, data);
        if (mockResult !== undefined) {
          return Promise.resolve(mockResult as R);
        }
      }
      return Promise.reject(new Error(`Action '${action}' 需要在 App 环境内执行，当前环境: ${this.platform}`));
    }

    await this.waitForReady();

    return new Promise((resolve, reject) => {
      const msgId = this.generateMsgId();
      const createdAt = Date.now();

      const timeoutId = setTimeout(() => {
        this.callbacks.delete(msgId);
        reject(new Error(`Action '${action}' 超时 (${this.timeout}ms)`));
      }, this.timeout);

      this.callbacks.set(msgId, { resolve, reject, timeoutId, createdAt });

      const request: BridgeRequest<T> = { msgId, action, data };
      const messageData = JSON.stringify(request);

      if (window.ReactNativeWebView) {
        try {
          window.ReactNativeWebView.postMessage(messageData);
        } catch (e) {
          this.queueMessage(messageData);
        }
      } else {
        this.queueMessage(messageData);
      }
    });
  }

  private queueMessage(data: string): void {
    if (this.messageQueue.length >= MAX_MESSAGE_QUEUE_SIZE) {
      this.messageQueue.shift();
    }
    this.messageQueue.push({ data, timestamp: Date.now() });
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
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(msg);
      } else {
        this.queueMessage(msg);
      }
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

  private cleanupExpiredCallbacks(): void {
    const now = Date.now();
    for (const [msgId, callback] of this.callbacks.entries()) {
      if (now - callback.createdAt > this.timeout * 2) {
        if (callback.timeoutId) {
          clearTimeout(callback.timeoutId);
        }
        callback.reject(new Error('Callback expired'));
        this.callbacks.delete(msgId);
      }
    }
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
    this.messageQueue = [];
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

export const waitForBridgeReady = (): Promise<void> => {
  return jsbridge.waitForReady();
};

export const isBridgeReady = (): boolean => {
  return jsbridge.readyState;
};

export default jsbridge;

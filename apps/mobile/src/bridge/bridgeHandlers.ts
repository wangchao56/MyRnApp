import { ActionHandlers, ShareOptions as NewShareOptions, ShowLoadingOptions } from '@myapp/jsbridge';
import { shareNative, shareOptionsToShareData } from '@myapp/share';
import type { ShareData } from '@myapp/share';
import { Alert, Platform } from 'react-native';

// 全局 loading 状态管理器
interface LoadingState {
  isLoading: boolean;
  text: string;
  listeners: Array<(state: { isLoading: boolean; text?: string }) => void>;
}

const loadingState: LoadingState = {
  isLoading: false,
  text: '加载中...',
  listeners: [],
};

export const LoadingManager = {
  getState: () => ({ isLoading: loadingState.isLoading, text: loadingState.text }),
  
  setState: (isLoading: boolean, text?: string) => {
    loadingState.isLoading = isLoading;
    if (text !== undefined) {
      loadingState.text = text;
    }
    loadingState.listeners.forEach(listener => 
      listener({ isLoading, text: loadingState.text })
    );
  },
  
  subscribe: (listener: (state: { isLoading: boolean; text?: string }) => void) => {
    loadingState.listeners.push(listener);
    return () => {
      const index = loadingState.listeners.indexOf(listener);
      if (index > -1) {
        loadingState.listeners.splice(index, 1);
      }
    };
  },
};

export interface UserInfo {
  userId: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface TokenResult {
  token: string;
  expiresAt: number;
}

export interface QRCodeResult {
  result: string;
  format?: string;
  rawBytes?: number[];
}

export interface LegacyShareOptions {
  title?: string;
  text?: string;
  url?: string;
}

export interface ShareResult {
  success: boolean;
  error?: string;
}

export const bridgeHandlers: ActionHandlers = {
  getUserInfo: async (): Promise<UserInfo> => {
    return {
      userId: '888',
      name: 'App User',
      email: 'user@example.com',
      avatar: 'https://picsum.photos/200',
    };
  },

  getToken: async (): Promise<TokenResult> => {
    return {
      token: 'app_token_abc123',
      expiresAt: Date.now() + 3600000,
    };
  },

  scanQRCode: async (options?: { type?: string }): Promise<QRCodeResult> => {
    console.log('[BridgeHandler] scanQRCode called with options:', options);
    return {
      result: 'https://example.com/scanned',
      format: 'qr_code',
    };
  },

  share: async (options?: NewShareOptions | LegacyShareOptions): Promise<ShareResult> => {
    console.log('[BridgeHandler] share called with options:', options);

    try {
      let shareData: ShareData;

      if (options && 'link' in options) {
        shareData = shareOptionsToShareData(options as NewShareOptions);
      } else {
        const legacyOptions = (options || {}) as LegacyShareOptions;
        shareData = {
          title: legacyOptions.title ?? '',
          message:
            Platform.OS === 'ios'
              ? legacyOptions.text ?? ''
              : [legacyOptions.text, legacyOptions.url].filter(Boolean).join('\n') ||
                legacyOptions.title ||
                '',
          url: legacyOptions.url ?? '',
        };
      }

      const result = await shareNative(shareData);

      return {
        success: result.success,
        error: result.error,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Share failed',
      };
    }
  },

  getAppInfo: async (): Promise<{ version: string; platform: string; buildNumber: string }> => {
    return {
      version: '1.0.0',
      platform: 'React Native',
      buildNumber: '100',
    };
  },

  getDeviceInfo: async (): Promise<{ deviceId: string; os: string; osVersion: string }> => {
    return {
      deviceId: 'device_12345',
      os: 'Android',
      osVersion: '14',
    };
  },

  showToast: async (message?: string): Promise<{ shown: boolean }> => {
    console.log('[BridgeHandler] Toast:', message);
    Alert.alert('Toast', message || 'Toast');
    return { shown: true };
  },

  showLoading: async (options?: ShowLoadingOptions): Promise<void> => {
    console.log('[BridgeHandler] showLoading:', options);
    LoadingManager.setState(true, options?.text || '加载中...');
  },

  hideLoading: async (): Promise<void> => {
    console.log('[BridgeHandler] hideLoading');
    LoadingManager.setState(false);
  },
};

export const getHandler = (action: string) => {
  return bridgeHandlers[action];
};

export const getAvailableActions = (): string[] => {
  return Object.keys(bridgeHandlers);
};

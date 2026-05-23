import { ActionHandlers, ShareOptions as NewShareOptions } from '@myapp/jsbridge';
import { Alert, Platform, Share } from 'react-native';

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
      let shareTitle: string | undefined;
      let shareMessage: string;
      let shareUrl: string | undefined;

      if ('link' in (options || {})) {
        const newOptions = options as NewShareOptions;
        shareTitle = newOptions.title;
        shareMessage = newOptions.desc || '';
        shareUrl = newOptions.link;
      } else {
        const legacyOptions = options as LegacyShareOptions;
        shareTitle = legacyOptions.title;
        shareMessage =
          Platform.OS === 'ios'
            ? legacyOptions?.text ?? ''
            : [legacyOptions?.text, legacyOptions?.url].filter(Boolean).join('\n') ||
              legacyOptions?.title ||
              '';
        shareUrl = legacyOptions?.url;
      }

      const result = await Share.share({
        title: shareTitle,
        message: shareMessage,
        url: shareUrl,
      });

      if (result.action === Share.dismissedAction) {
        return { success: false, error: 'User dismissed' };
      }

      return { success: true };
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
};

export const getHandler = (action: string) => {
  return bridgeHandlers[action];
};

export const getAvailableActions = (): string[] => {
  return Object.keys(bridgeHandlers);
};

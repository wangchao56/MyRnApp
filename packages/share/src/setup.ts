import { setShareNotify } from './notify';
import { setWechatConfigProvider } from './wechatConfig';
import type { WechatJssdkConfig } from './types';

export function setupDefaultShare(options?: {
  wechatConfigUrl?: string;
  onNotify?: (message: string) => void;
}): void {
  const { wechatConfigUrl = '/api/wechat-jssdk-config', onNotify } = options ?? {};

  setWechatConfigProvider(async (pageUrl: string): Promise<WechatJssdkConfig> => {
    const endpoint = `${wechatConfigUrl}?url=${encodeURIComponent(pageUrl)}`;
    const res = await fetch(endpoint);
    if (!res.ok) {
      throw new Error(`Wechat JSSDK config failed: ${res.status}`);
    }
    return res.json() as Promise<WechatJssdkConfig>;
  });

  setShareNotify(
    onNotify ??
      ((message: string) => {
        if (typeof window !== 'undefined' && typeof window.alert === 'function') {
          window.alert(message);
        }
      }),
  );
}

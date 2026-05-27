import type { WechatJssdkConfig } from './types';

export type WechatConfigProvider = (url: string) => Promise<WechatJssdkConfig>;

let provider: WechatConfigProvider | null = null;

export function setWechatConfigProvider(fn: WechatConfigProvider | null): void {
  provider = fn;
}

export function hasWechatConfigProvider(): boolean {
  return provider !== null;
}

export async function fetchWechatConfig(
  url: string = typeof location !== 'undefined'
    ? location.href.split('#')[0]
    : '',
): Promise<WechatJssdkConfig | null> {
  if (!provider) {
    return null;
  }
  return provider(url);
}

export function loadJWeixin(): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('loadJWeixin requires window'));
      return;
    }
    const win = window as Window & { wx?: Record<string, unknown> };
    if (win.wx) {
      resolve(win.wx);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js';
    script.onload = () =>
      resolve((window as unknown as { wx: Record<string, unknown> }).wx);
    script.onerror = () => reject(new Error('Failed to load jweixin'));
    document.head.appendChild(script);
  });
}

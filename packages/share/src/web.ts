import NativeShare from '@myapp/nativeshare';
import type { ShareData, ShareResult, ShareTarget } from './types';
import { setClipboard } from './clipboard';
import { notify } from './notify';
import { fetchWechatConfig, hasWechatConfigProvider, loadJWeixin } from './wechatConfig';

const TARGET_MAP: Record<ShareTarget, string> = {
  default: 'default',
  wechatFriend: 'wechatfriend',
  wechatTimeline: 'wechattimeline',
  qqFriend: 'qqfriend',
  qZone: 'qzone',
  weibo: 'weibo',
};

function getUA(): string {
  return typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
}

function isMobileUA(ua: string): boolean {
  return /mobile|android|iphone|ipad/i.test(ua);
}

function isWechatUA(ua: string): boolean {
  return /micromessenger/i.test(ua);
}

function isWindowsWechat(ua: string): boolean {
  return isWechatUA(ua) && /windowswechat/i.test(ua);
}

function isInAppBrowser(ua: string): boolean {
  return isWechatUA(ua) || /qq|ucbrowser|baidu/i.test(ua);
}

async function setupPCWechatShare(data: ShareData): Promise<boolean> {
  const config = await fetchWechatConfig();
  if (!config) {
    return false;
  }

  const wx = (await loadJWeixin()) as {
    config: (opts: Record<string, unknown>) => void;
    ready: (fn: () => void) => void;
    updateAppMessageShareData: (opts: Record<string, unknown>) => void;
    updateTimelineShareData: (opts: Record<string, unknown>) => void;
  };

  return new Promise((resolve) => {
    wx.config({
      ...config,
      jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'],
    });

    wx.ready(() => {
      wx.updateAppMessageShareData({
        title: data.title,
        desc: data.message,
        link: data.url,
        imgUrl: data.icon || '',
      });
      wx.updateTimelineShareData({
        title: data.title,
        link: data.url,
        imgUrl: data.icon || '',
      });
      resolve(true);
    });
  });
}

async function shareWithNativeShare(
  data: ShareData,
  target?: ShareTarget,
): Promise<ShareResult | null> {
  if (!hasWechatConfigProvider()) {
    return null;
  }

  try {
    const wechatConfig = await fetchWechatConfig();
    if (!wechatConfig) {
      return null;
    }

    const ns = new NativeShare({
      wechatConfig,
      syncTitleToTag: true,
      syncDescToTag: true,
      syncIconToTag: true,
    });

    ns.setShareData({
      title: data.title,
      desc: data.message || '',
      link: data.url,
      icon: data.icon || '',
      from: '@myapp',
    });

    const callTarget = target ? TARGET_MAP[target] : 'default';
    try {
      ns.call(callTarget);
      return { success: true, method: 'nativeshare', message: '分享已唤起' };
    } catch (error: unknown) {
      const err = error as { code?: string; success?: boolean };
      if (err?.success === false || err?.code) {
        return null;
      }
      throw error;
    }
  } catch {
    return null;
  }
}

export function shareOptionsToShareData(options: {
  title: string;
  desc?: string;
  link: string;
  imgUrl?: string;
}): ShareData {
  return {
    title: options.title,
    message: options.desc,
    url: options.link,
    icon: options.imgUrl,
  };
}

export async function shareWeb(
  data: ShareData,
  target?: ShareTarget,
): Promise<ShareResult> {
  const ua = getUA();
  const isMobile = isMobileUA(ua);

  if (isWindowsWechat(ua)) {
    const configured = await setupPCWechatShare(data);
    if (configured) {
      notify('请点击右上角「···」分享给朋友');
      return {
        success: true,
        method: 'wechat-menu-pc',
        message: '请点击右上角「···」分享给朋友',
      };
    }
  }

  if (isMobile && isInAppBrowser(ua)) {
    const nsResult = await shareWithNativeShare(data, target);
    if (nsResult?.success) {
      return nsResult;
    }
  }

  if (typeof navigator !== 'undefined' && navigator.share && isMobile) {
    try {
      await navigator.share({
        title: data.title,
        text: data.message,
        url: data.url,
      });
      return { success: true, method: 'web-share-api' };
    } catch (error: unknown) {
      const err = error as { name?: string };
      if (err?.name === 'AbortError') {
        return {
          success: false,
          cancelled: true,
          method: 'web-share-api',
          error: 'User dismissed',
        };
      }
    }
  }

  const clipText = data.message ? `${data.title}\n${data.message}\n${data.url}` : data.url;
  await setClipboard(clipText);
  notify('链接已复制到剪贴板');
  return {
    success: true,
    method: 'clipboard',
    message: '链接已复制到剪贴板',
  };
}

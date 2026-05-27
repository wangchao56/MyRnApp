import { assign, loadJs } from './utils';
import Share from './Share';
import type { NativeShareConfig, NativeShareData } from './types';

export default class Wechat extends Share {
  constructor(config?: NativeShareConfig) {
    super(config);
    this.setConfig(config);
  }

  call(_command?: string, options?: Partial<NativeShareData>): void {
    this.setShareData(options);
  }

  setConfig(config?: NativeShareConfig): void {
    super.setConfig(config);
    this.init(this.getConfig().wechatConfig);
  }

  init(config?: Record<string, unknown>): void {
    if (!config) {
      return;
    }
    loadJs('https://res.wx.qq.com/open/js/jweixin-1.4.0.js', () => {
      wx.config(
        assign(
          {
            debug: false,
            jsApiList: [
              'onMenuShareTimeline',
              'onMenuShareAppMessage',
              'onMenuShareQQ',
              'onMenuShareWeibo',
              'onMenuShareQZone',
              'updateAppMessageShareData',
              'updateTimelineShareData',
            ],
          },
          config,
        ),
      );

      const shareData = this._shareData;
      const wxShareData: Record<string, unknown> = {};

      Object.defineProperty(wxShareData, 'trigger', {
        get: () => (...args: unknown[]) => {
          assign(wxShareData, {
            title: shareData.title,
            desc: shareData.desc,
            link: shareData.link,
            imgUrl: shareData.icon,
            success: shareData.success,
            fail: shareData.fail,
            cancel: shareData.fail,
          });
          shareData.trigger(...args);
        },
        set: (newValue: (...args: unknown[]) => void) => {
          shareData.trigger = newValue;
        },
        enumerable: true,
      });

      wx.ready(() => {
        wx.onMenuShareAppMessage(wxShareData);
        wx.onMenuShareQQ(wxShareData);
        wx.onMenuShareQZone(wxShareData);
        wx.onMenuShareWeibo(wxShareData);
        wx.onMenuShareTimeline(wxShareData);
        wx.updateAppMessageShareData(wxShareData);
        wx.updateTimelineShareData(wxShareData);
      });
    });
  }
}

import { loadJs, getHostnameFromUrl } from './utils';
import Share from './Share';
import type { NativeShareConfig, NativeShareData, ShareCommand } from './types';

export default class QQAndroid extends Share {
  constructor(config?: NativeShareConfig) {
    super(config);
    this.init();
  }

  setShareData(options: Partial<NativeShareData> = {}): void {
    super.setShareData(options);
    const data = this.getShareData();
    if (getHostnameFromUrl(data.link) !== location.hostname) {
      data.link = location.href;
      console.warn(
        '安卓的QQ自带浏览器分享url必须跟页面url同一个域名，已自动为你设置为当前页面的url',
      );
    }
    try {
      mqq.data.setShareInfo(
        {
          share_url: data.link,
          title: data.title,
          desc: data.desc,
          image_url: data.icon,
        },
        (result) => {
          if (result !== true) {
            console.warn(result);
          }
        },
      );
    } catch {
      // mqq 未就绪时忽略
    }
  }

  call(_command: ShareCommand = 'default', options?: Partial<NativeShareData>): void {
    this.setShareData(options);
    mqq.ui.showShareMenu();
  }

  init(): void {
    loadJs('https://open.mobile.qq.com/sdk/qqapi.js', () => {
      this.setShareData();
    });
  }
}

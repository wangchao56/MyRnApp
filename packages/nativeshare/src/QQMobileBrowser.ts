import { loadJs } from './utils';
import {
  wechatTimeline,
  wechatFriend,
  qqFriend,
  qZone,
  weibo,
  copyUrl,
  more,
  generateQRCode,
  defaultCommand,
} from './command';
import Share from './Share';
import type { NativeShareConfig, NativeShareData, ShareCommand } from './types';

export default class QQMobileBrowser extends Share {
  static commamdMap: Record<string, number | undefined> = {
    [wechatTimeline]: 8,
    [wechatFriend]: 1,
    [qqFriend]: 4,
    [qZone]: 3,
    [weibo]: 11,
    [copyUrl]: 10,
    [more]: 5,
    [generateQRCode]: 7,
    [defaultCommand]: undefined,
  };

  constructor(config?: NativeShareConfig) {
    super(config);
    loadJs('https://jsapi.qq.com/get?api=app.share');
  }

  call(command: ShareCommand = 'default', options?: Partial<NativeShareData>): void {
    this.setShareData(options);
    const data = this.getShareData();
    const toApp = QQMobileBrowser.commamdMap[String(command).toLowerCase()];
    browser.app.share({
      title: data.title,
      description: data.desc,
      url: data.link,
      img_url: data.icon,
      from: data.from,
      to_app: toApp,
    });
  }
}

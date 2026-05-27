import {
  wechatTimeline,
  wechatFriend,
  qqFriend,
  qZone,
  weibo,
  defaultCommand,
} from './command';
import Share from './Share';
import type { NativeShareConfig, NativeShareData, ShareCommand } from './types';

export default class UCIosBrowser extends Share {
  static commamdMap: Record<string, string | undefined> = {
    [wechatTimeline]: 'kWeixinFriend',
    [wechatFriend]: 'kWeixin',
    [qqFriend]: 'kQQ',
    [qZone]: 'kQZone',
    [weibo]: 'kSinaWeibo',
    [defaultCommand]: undefined,
  };

  call(command: ShareCommand = 'default', options?: Partial<NativeShareData>): void {
    this.setShareData(options);
    const data = this.getShareData();
    const toApp = UCIosBrowser.commamdMap[String(command).toLowerCase()];
    if (ucbrowser.web_shareEX) {
      ucbrowser.web_shareEX(
        JSON.stringify({
          title: data.title,
          content: data.desc,
          sourceUrl: data.link,
          imageUrl: data.icon,
          source: data.from,
          target: toApp,
        }),
      );
    } else {
      ucbrowser.web_share(
        data.title,
        data.desc,
        data.link,
        toApp,
        '',
        data.from,
        '',
      );
    }
  }
}

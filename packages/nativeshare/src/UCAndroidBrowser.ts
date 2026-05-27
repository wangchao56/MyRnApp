import {
  wechatTimeline,
  wechatFriend,
  qqFriend,
  qZone,
  weibo,
  defaultCommand,
} from './command';
import Share from './Share';
import type { NativeShareData, ShareCommand } from './types';

export default class UCAndroidBrowser extends Share {
  static commamdMap: Record<string, string> = {
    [wechatTimeline]: 'WechatTimeline',
    [wechatFriend]: 'WechatFriends',
    [qqFriend]: 'QQ',
    [qZone]: 'Qzone',
    [weibo]: 'SinaWeibo',
    [defaultCommand]: '',
  };

  call(command: ShareCommand = 'default', options?: Partial<NativeShareData>): void {
    this.setShareData(options);
    const data = this.getShareData();
    const toApp = UCAndroidBrowser.commamdMap[String(command).toLowerCase()];
    ucweb.startRequest('shell.page_share', [
      data.title,
      data.desc,
      data.link,
      toApp,
      '',
      data.from,
      data.icon,
    ]);
  }
}

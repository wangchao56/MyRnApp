import { shareToQQ, shareToQZone, shareToWeibo4Web } from './specifyShare';
import { qqFriend, qZone, weibo } from './command';
import Share from './Share';
import type { NativeShareData, ShareCommand } from './types';

export default class Others extends Share {
  call(command: ShareCommand = 'default', options?: Partial<NativeShareData>): void {
    this.setShareData(options);

    if (!navigator.share) {
      const cmd = String(command).toLowerCase();
      if (cmd === weibo) {
        shareToWeibo4Web();
        return;
      }
      if (cmd === qqFriend) {
        shareToQQ();
      } else if (cmd === qZone) {
        shareToQZone();
      }

      const err = new Error(`the browser may not support command ${cmd}!`) as Error & {
        code?: string;
      };
      err.code = 'UNSUPPORTED_COMMAND';
      throw err;
    }

    const data = this.getShareData();
    navigator
      .share({
        url: data.link,
        title: data.title,
        text: data.desc,
      })
      .then(data.success)
      .catch(data.fail);
  }
}

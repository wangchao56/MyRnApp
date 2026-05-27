import Share from './Share';
import type { NativeShareData, ShareCommand } from './types';

export default class BaiduIosBrowser extends Share {
  call(_command: ShareCommand = 'default', options?: Partial<NativeShareData>): void {
    this.setShareData(options);
    const data = this.getShareData();
    location.href =
      'baidubrowserapp://bd_utils?action=shareWebPage&params=' +
      encodeURIComponent(
        JSON.stringify({
          title: data.title,
          content: data.desc,
          imageurl: data.icon,
          landurl: data.link,
          mediaType: 0,
          share_type: 'webpage',
        }),
      );
  }
}

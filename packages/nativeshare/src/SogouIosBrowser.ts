import Share from './Share';
import type { NativeShareData, ShareCommand } from './types';

export default class SogouIosBrowser extends Share {
  call(_command: ShareCommand = 'default', options?: Partial<NativeShareData>): void {
    this.setShareData(options);
    const data = this.getShareData();
    SogouMse.Utility.shareWithInfo({
      shareTitle: data.title,
      shareContent: data.desc,
      shareImageUrl: data.icon,
      shareUrl: data.link,
    });
  }
}

import Share from './Share';
import type { NativeShareData, ShareCommand } from './types';

export default class BaiduAndroidBrowser extends Share {
  call(_command: ShareCommand = 'default', options?: Partial<NativeShareData>): void {
    this.setShareData(options);
    const data = this.getShareData();
    _flyflowNative.exec(
      'bd_utils',
      'shareWebPage',
      JSON.stringify({
        title: data.title,
        content: data.desc,
        landurl: data.link,
        imageurl: data.icon,
        shareSource: data.from,
      }),
      '',
    );
  }
}

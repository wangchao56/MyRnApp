import { loadJs } from './utils';
import Share from './Share';
import type { NativeShareConfig, NativeShareData, ShareCommand } from './types';

export default class QQIos extends Share {
  constructor(config?: NativeShareConfig) {
    super(config);
    this.init();
  }

  call(_command: ShareCommand = 'default', options?: Partial<NativeShareData>): void {
    this.setShareData(options);
    mqq.ui.showShareMenu();
  }

  init(): void {
    loadJs('https://open.mobile.qq.com/sdk/qqapi.js', () => {
      const data = this._shareData;
      mqq.ui.setOnShareHandler((type) => {
        mqq.ui.shareMessage(
          {
            back: true,
            share_type: type,
            title: data.title,
            desc: data.desc,
            share_url: data.link,
            image_url: data.icon,
            sourceName: data.from,
          },
          (result) => {
            if (result.retCode === 0) {
              data.success();
            } else {
              data.fail();
            }
          },
        );
      });
    });
  }
}

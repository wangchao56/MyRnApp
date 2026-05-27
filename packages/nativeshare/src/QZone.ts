import { loadJs } from './utils';
import Share from './Share';
import type { NativeShareConfig, NativeShareData, ShareCommand } from './types';

export default class QZone extends Share {
  hasSomethingWrong = false;

  constructor(config?: NativeShareConfig) {
    super(config);
    this.init();
  }

  call(_command: ShareCommand = 'default', options?: Partial<NativeShareData>): void {
    this.setShareData(options);

    const data = this.getShareData();
    const imageArr: string[] = [];
    const titleArr: string[] = [];
    const summaryArr: string[] = [];
    const shareURLArr: string[] = [];

    for (let i = 0; i < 5; i++) {
      imageArr.push(data.icon);
      shareURLArr.push(data.link);
      titleArr.push(data.title);
      summaryArr.push(data.desc);
    }

    QZAppExternal.setShare(
      ({ code }) => {
        if (code !== 0) {
          this.hasSomethingWrong = true;
        }
      },
      {
        type: 'share',
        image: imageArr,
        title: titleArr,
        summary: summaryArr,
        shareURL: shareURLArr,
      },
    );
  }

  setShareData(options: Partial<NativeShareData> = {}): void {
    try {
      this.call('default', options);
    } catch {
      // 初始化阶段可能失败
    }
  }

  init(): void {
    loadJs(
      'https://qzonestyle.gtimg.cn/qzone/phone/m/v4/widget/mobile/jsbridge.js',
      () => {
        this.call('default');
      },
    );
  }
}

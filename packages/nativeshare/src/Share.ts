import {
  assign,
  setDescTagContent,
  setIconTagHref,
  setTitleTagTitle,
} from './utils';
import { defaultShareData } from './shareData';
import type { NativeShareConfig, NativeShareData } from './types';

export default class Share {
  protected _shareData: NativeShareData = defaultShareData;
  protected _config: NativeShareConfig = {
    syncDescToTag: false,
    syncIconToTag: false,
    syncTitleToTag: false,
  };

  constructor(config?: NativeShareConfig) {
    this.setConfig(config);
  }

  getShareData(): NativeShareData {
    return { ...this._shareData };
  }

  setShareData(options: Partial<NativeShareData> = {}): void {
    assign(this._shareData, options);
    if (this._config.syncDescToTag) {
      setDescTagContent(this._shareData.desc);
    }
    if (this._config.syncIconToTag) {
      setIconTagHref(this._shareData.icon);
    }
    if (this._config.syncTitleToTag) {
      setTitleTagTitle(this._shareData.title);
    }
  }

  setConfig(config: NativeShareConfig = {}): void {
    assign(this._config, config);
  }

  getConfig(): NativeShareConfig {
    return assign({}, this._config);
  }

  call(_command?: string, _options?: Partial<NativeShareData>): void {
    // 由子类实现
  }
}

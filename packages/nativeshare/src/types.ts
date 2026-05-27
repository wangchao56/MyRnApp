export interface NativeShareData {
  link: string;
  title: string;
  desc: string;
  icon: string;
  from: string;
  success: () => void;
  fail: () => void;
  trigger: (...args: unknown[]) => void;
}

export interface NativeShareConfig {
  wechatConfig?: Record<string, unknown>;
  syncTitleToTag?: boolean;
  syncDescToTag?: boolean;
  syncIconToTag?: boolean;
}

export type ShareCommand =
  | 'default'
  | 'wechatfriend'
  | 'wechattimeline'
  | 'qqfriend'
  | 'qzone'
  | 'weibo'
  | 'copyurl'
  | 'more'
  | 'generateqrcode'
  | string;

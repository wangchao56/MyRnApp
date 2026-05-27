import type { WechatJssdkConfig } from '../types';
export type WechatConfigProvider = (url: string) => Promise<WechatJssdkConfig>;
export declare function setWechatConfigProvider(fn: WechatConfigProvider | null): void;
export declare function hasWechatConfigProvider(): boolean;
export declare function fetchWechatConfig(url?: string): Promise<WechatJssdkConfig | null>;
export declare function loadJWeixin(): Promise<Record<string, unknown>>;

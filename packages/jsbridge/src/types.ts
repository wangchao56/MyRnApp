export interface BridgeRequest<T = any> {
  msgId: string;
  action: string;
  data?: T;
}

export interface BridgeResponse<T = any> {
  msgId: string;
  code: number;
  data?: T;
  error?: string | null;
}

export interface ActionHandler<T = any, R = any> {
  (data?: T): Promise<R> | R;
}

export interface ActionHandlers {
  [action: string]: ActionHandler;
}

export const BRIDGE_RESPONSE_CODE = {
  SUCCESS: 200,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
  TIMEOUT: 408,
} as const;

export const DEFAULT_TIMEOUT = 15000;

export interface JSBridgeConfig {
  timeout?: number;
  whitelist?: string[];
}

export interface JSBridgeInstance {
  invoke<T = any, R = any>(action: string, data?: T): Promise<R>;
  isInApp(): boolean;
}

export type ShareScene = 'session' | 'timeline' | 'favorite';

export interface ShareOptions {
  title: string;
  desc?: string;
  link: string;
  imgUrl?: string;
  type?: 'text' | 'image' | 'link' | 'miniProgram';
  scene?: ShareScene;
}

export type PlatformType = 'rn' | 'wechat-h5' | 'miniprogram' | 'browser';

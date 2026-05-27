/* eslint-disable @typescript-eslint/no-explicit-any */
declare const wx: {
  config: (opts: Record<string, unknown>) => void;
  ready: (fn: () => void) => void;
  onMenuShareAppMessage: (opts: Record<string, unknown>) => void;
  onMenuShareQQ: (opts: Record<string, unknown>) => void;
  onMenuShareQZone: (opts: Record<string, unknown>) => void;
  onMenuShareWeibo: (opts: Record<string, unknown>) => void;
  onMenuShareTimeline: (opts: Record<string, unknown>) => void;
  updateAppMessageShareData: (opts: Record<string, unknown>) => void;
  updateTimelineShareData: (opts: Record<string, unknown>) => void;
};

declare const mqq: {
  ui: {
    showShareMenu: () => void;
    setOnShareHandler: (fn: (type: number) => void) => void;
    shareMessage: (opts: Record<string, unknown>, cb: (data: { retCode: number }) => void) => void;
  };
  data: {
    setShareInfo: (info: Record<string, unknown>, cb: (data: unknown) => void) => void;
  };
};

declare const browser: {
  app: {
    share: (opts: Record<string, unknown>) => void;
  };
};

declare const ucbrowser: {
  web_shareEX: (json: string) => void;
  web_share: (...args: unknown[]) => void;
};

declare const ucweb: {
  startRequest: (action: string, args: unknown[]) => void;
};

declare const _flyflowNative: {
  exec: (a: string, b: string, c: string, d: string) => void;
};

declare const SogouMse: {
  Utility: {
    shareWithInfo: (opts: Record<string, unknown>) => void;
  };
};

declare const QZAppExternal: {
  setShare: (cb: (data: { code: number }) => void, opts: Record<string, unknown>) => void;
};

interface Window {
  NativeShare?: import('./index').NativeShareConstructor;
}

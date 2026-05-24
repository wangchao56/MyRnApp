/// <reference path="./globals.d.ts" />

export * from './types';
export * from './env';
export * from './share-adapters';
export * from './JSBridge';
export {
  default as jsbridge,
  invoke,
  isInApp,
  isInMiniProgram,
  isInWechat,
  getPlatform,
  share,
  showLoading,
  hideLoading,
  onAppEvent,
  offAppEvent,
  waitForBridgeReady,
  isBridgeReady,
} from './JSBridge';
export { default } from './JSBridge';

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
  onAppEvent,
  offAppEvent,
} from './JSBridge';
export { default } from './JSBridge';

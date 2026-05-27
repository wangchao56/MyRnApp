import { Platform } from 'react-native';
import type { ShareData, ShareResult, ShareTarget } from './types';
import { shareNative } from './native';
import { shareWeb } from './web';

export type {
  ShareData,
  ShareTarget,
  ShareResult,
  ShareNotify,
  WechatJssdkConfig,
} from './types';
export { setShareNotify } from './notify';
export {
  setWechatConfigProvider,
  hasWechatConfigProvider,
  fetchWechatConfig,
  loadJWeixin,
} from './wechatConfig';
export type { WechatConfigProvider } from './wechatConfig';
export { shareNative } from './native';
export { shareWeb } from './web';
export { setClipboard, getClipboard } from './clipboard';

export async function share(
  data: ShareData,
  target?: ShareTarget,
): Promise<ShareResult> {
  if (Platform.OS === 'web') {
    return shareWeb(data, target);
  }
  return shareNative(data);
}

export { shareOptionsToShareData } from './web';
export { setupDefaultShare } from './setup';

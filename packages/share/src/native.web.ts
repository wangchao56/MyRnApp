import type { ShareData, ShareResult } from './types';

/** Web 构建桩：实际分享走 shareWeb，不应调用本方法。 */
export async function shareNative(_data: ShareData): Promise<ShareResult> {
  return {
    success: false,
    method: 'native-share',
    error: 'shareNative is not available on web',
  };
}

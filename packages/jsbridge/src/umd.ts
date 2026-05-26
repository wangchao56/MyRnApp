export * from './index';
export { default } from './index';

import { EnvDetector } from './env';
import { UMD_GLOBAL_NAME } from './umd-global';

const JSBRIDGE_VERSION = '1.0.0';

async function logUmdLoaded(): Promise<void> {
  if (typeof console === 'undefined') {
    return;
  }

  const platform = await EnvDetector.getPlatform();
  const mountRoot =
    typeof globalThis !== 'undefined' ? (globalThis as Record<string, unknown>) : undefined;
  const mountTarget = typeof window !== 'undefined' ? 'window' : 'globalThis';
  const globalKey = UMD_GLOBAL_NAME;
  const mounted = mountRoot?.[globalKey];

  console.info(
    `%c[@myapp/jsbridge v${JSBRIDGE_VERSION}]%c SDK 已成功加载`,
    'color: #0d9488; font-weight: bold;',
    'color: inherit;',
  );
  console.info(`[@myapp/jsbridge] 当前运行环境: ${platform}`);

  if (mounted) {
    console.info(`[@myapp/jsbridge] 已挂载到 ${mountTarget}.${globalKey}`, mounted);
    console.info(
      `[@myapp/jsbridge] 使用示例: const { invoke, share, jsbridge } = ${mountTarget}.${globalKey}`,
    );
  } else {
    console.warn(
      `[@myapp/jsbridge] 未在 ${mountTarget}.${globalKey} 上检测到 SDK，请确认 jsbridge.min.js 已正确引入`,
    );
  }
}

void logUmdLoaded();

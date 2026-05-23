import { BridgeRequest, BridgeResponse } from '@myapp/shared';

export {};

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
    __RECEIVE_MESSAGE_FROM_APP__?: (response: string) => void;
    __ON_APP_EVENT__?: (eventType: string, data?: any) => void;
    __APP_EVENT_HANDLERS__?: Record<string, (data: any) => void>;
  }
}

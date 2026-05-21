export const isInWebView = (): boolean => {
  return typeof window !== 'undefined' && !!window.ReactNativeWebView;
};

interface JSBridgeInterface {
  isInWebView: () => boolean;
  getToken: () => Promise<string>;
  getUserInfo: () => Promise<any>;
  postMessage: (data: any) => void;
  onMessage: (type: string, callback: (data: any) => void) => void;
}

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
    JSBridge?: {
      postMessage: (data: any) => void;
      onMessage: (type: string, callback: (data: any) => void) => void;
      getToken: () => Promise<string>;
      getUserInfo: () => Promise<any>;
    };
  }
}

export const JSBridge: JSBridgeInterface = {
  isInWebView,

  postMessage: (data: any) => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify(data));
    }
  },

  onMessage: (type: string, callback: (data: any) => void) => {
    if (window.JSBridge) {
      window.JSBridge.onMessage(type, callback);
    }
  },

  getToken: async (): Promise<string> => {
    if (isInWebView() && window.JSBridge) {
      return window.JSBridge.getToken();
    }
    return localStorage.getItem('token') || '';
  },

  getUserInfo: async () => {
    if (isInWebView() && window.JSBridge) {
      return window.JSBridge.getUserInfo();
    }
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

export const initJSBridge = () => {
  if (!isInWebView()) {
    window.JSBridge = {
      postMessage: (data) => console.log('JSBridge mock:', data),
      onMessage: () => {},
      getToken: async () => localStorage.getItem('token') || '',
      getUserInfo: async () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
      },
    };
  }
};

export default JSBridge;

import React, { useCallback, useRef, useImperativeHandle, forwardRef } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  BackHandler,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import { WebView, WebViewProps, WebViewMessageEvent } from 'react-native-webview';
import {
  BridgeRequest,
  BridgeResponse,
  BRIDGE_RESPONSE_CODE,
  JSBridgeConfig,
} from '@myapp/shared';
import { bridgeHandlers, getAvailableActions } from '../../bridge';

export interface HybridWebViewRef {
  sendToH5: (response: BridgeResponse) => void;
  reload: () => void;
}

export interface HybridWebViewProps extends Omit<WebViewProps, 'source'> {
  source: WebViewProps['source'];
  config?: JSBridgeConfig;
  whitelist?: string[];
  onBridgeMessage?: (message: BridgeRequest) => void;
  onAppEvent?: (eventType: string, data?: any) => void;
  renderLoading?: () => React.ReactNode;
  renderError?: (error: { code: number; message: string }) => React.ReactNode;
}

const HybridWebViewComponent: React.ForwardRefRenderFunction<
  HybridWebViewRef,
  HybridWebViewProps
> = (
  {
    source,
    config,
    whitelist = [],
    onBridgeMessage,
    onAppEvent,
    renderLoading,
    renderError,
    onMessage,
    onNavigationStateChange,
    ...props
  },
  ref
) => {
  const webviewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<{ code: number; message: string } | null>(null);

  const sendResponseToH5 = useCallback((response: BridgeResponse) => {
    if (webviewRef.current) {
      const script = `window.__RECEIVE_MESSAGE_FROM_APP__('${JSON.stringify(response)}')`;
      webviewRef.current.injectJavaScript(script);
    }
  }, []);

  const sendAppEventToH5 = useCallback((eventType: string, data?: any) => {
    if (webviewRef.current) {
      const script = `window.__ON_APP_EVENT__('${eventType}', ${JSON.stringify(data ?? null)})`;
      webviewRef.current.injectJavaScript(script);
    }
  }, []);

  const handleMessage = useCallback(
    async (event: WebViewMessageEvent) => {
      try {
        const request: BridgeRequest = JSON.parse(event.nativeEvent.data);
        const { msgId, action, data } = request;
        console.log('[HybridWebView] 收到 H5 消息:', request);
        onBridgeMessage?.(request);

        const handler = bridgeHandlers[action];
        if (!handler) {
          sendResponseToH5({
            msgId,
            code: BRIDGE_RESPONSE_CODE.NOT_FOUND,
            data: null,
            error: `Action '${action}' not found`,
          });
          return;
        }

        try {
          const result = await handler(data);
          sendResponseToH5({
            msgId,
            code: BRIDGE_RESPONSE_CODE.SUCCESS,
            data: result,
            error: null,
          });
        } catch (err: any) {
          sendResponseToH5({
            msgId,
            code: BRIDGE_RESPONSE_CODE.INTERNAL_ERROR,
            data: null,
            error: err?.message || 'Internal Error',
          });
        }
      } catch (parseError) {
        console.error('[HybridWebView] 解析 H5 消息失败', parseError);
      }
    },
    [onBridgeMessage, sendResponseToH5]
  );

  const handleNavigationStateChange = useCallback(
    (navState: any) => {
      if (whitelist.length > 0 && navState?.url) {
        try {
          const url = new URL(navState.url);
          const isAllowed = whitelist.some((domain) => url.hostname.includes(domain));
          if (!isAllowed) {
            console.warn(`[HybridWebView] URL not in whitelist: ${url.hostname}`);
          }
        } catch (e) {
          console.warn('[HybridWebView] Invalid URL:', navState.url);
        }
      }
      onNavigationStateChange?.(navState);
    },
    [onNavigationStateChange, whitelist]
  );

  const handleError = useCallback(
    (syntheticEvent: any) => {
      const { nativeEvent } = syntheticEvent;
      console.error('[HybridWebView] WebView error:', nativeEvent.description);
      setError({
        code: nativeEvent.code || -1,
        message: nativeEvent.description || 'WebView Error',
      });
      props.onError?.(syntheticEvent);
    },
    [props]
  );

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    setError(null);
    props.onLoadStart?.();
  }, [props]);

  const handleLoadEnd = useCallback(() => {
    setIsLoading(false);
    props.onLoadEnd?.();
  }, [props]);

  const injectInitialScript = useCallback(() => {
    const availableActions = getAvailableActions();
    return `
      (function() {
        window.__AVAILABLE_ACTIONS__ = ${JSON.stringify(availableActions)};
        console.log('[HybridWebView] Initialized with actions:', window.__AVAILABLE_ACTIONS__);
      })();
      true;
    `;
  }, []);

  useImperativeHandle(ref, () => ({
    sendToH5: sendResponseToH5,
    reload: () => webviewRef.current?.reload(),
  }));

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (webviewRef.current) {
        webviewRef.current.goBack();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, []);

  if (error && renderError) {
    return <View style={styles.container}>{renderError(error)}</View>;
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        source={source}
        onMessage={handleMessage}
        onError={handleError}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onNavigationStateChange={handleNavigationStateChange}
        injectedJavaScript={injectInitialScript()}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        allowsBackForwardNavigationGestures={true}
        {...props}
      />
      {isLoading && renderLoading && (
        <View style={styles.loadingOverlay}>{renderLoading()}</View>
      )}
    </View>
  );
};

export const HybridWebView = forwardRef(HybridWebViewComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

export default HybridWebView;

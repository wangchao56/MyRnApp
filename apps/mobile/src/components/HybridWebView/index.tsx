import React, { useCallback, useRef, useImperativeHandle, forwardRef, useMemo, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  BackHandler,
  Platform,
  Alert,
} from 'react-native';
import { WebView, WebViewProps, WebViewMessageEvent, WebViewNavigation } from 'react-native-webview';
import {
  BridgeRequest,
  BridgeResponse,
  BRIDGE_RESPONSE_CODE,
} from '@myapp/jsbridge';
import { bridgeHandlers, getAvailableActions, LoadingManager } from '../../bridge';

export interface HybridWebViewRef {
  sendToH5: (response: BridgeResponse) => void;
  reload: () => void;
  goBack: () => boolean;
  goForward: () => boolean;
  clearCache: () => void;
  clearHistory: () => void;
}

export interface HybridWebViewProps extends Omit<WebViewProps, 'source' | 'renderError' | 'renderLoading'> {
  source: WebViewProps['source'];
  whitelist?: string[];
  onBridgeMessage?: (message: BridgeRequest) => void;
  onAppEvent?: (eventType: string, data?: any) => void;
  renderLoading?: () => React.ReactNode;
  renderError?: (error: { code: number; message: string; url?: string }) => React.ReactNode;
  enableDebug?: boolean;
  maxRetryCount?: number;
  loadTimeout?: number;
  hideLoadingOnSpaNavigation?: boolean;
  onLoadingStateChange?: (isLoading: boolean, text?: string) => void;
  enableNativeLoadingControl?: boolean;
}

const DEFAULT_MAX_RETRY = 3;
const DEFAULT_LOAD_TIMEOUT = 15000;
const CACHE_ENABLED = true;
const THIRD_PARTY_COOKIES_ENABLED = Platform.OS === 'android';

const HybridWebViewComponent: React.ForwardRefRenderFunction<
  HybridWebViewRef,
  HybridWebViewProps
> = (
  {
    source,
    whitelist = [],
    onBridgeMessage,
    onAppEvent,
    renderLoading,
    renderError,
    onMessage,
    onNavigationStateChange,
    enableDebug = __DEV__,
    maxRetryCount = DEFAULT_MAX_RETRY,
    loadTimeout = DEFAULT_LOAD_TIMEOUT,
    hideLoadingOnSpaNavigation = true,
    onLoadingStateChange,
    enableNativeLoadingControl = true,
    ...props
  },
  ref
) => {
    const webviewRef = useRef<WebView>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [loadingText, setLoadingText] = React.useState('加载中...');
    const [isControlledByH5, setIsControlledByH5] = React.useState(false);
    const [error, setError] = React.useState<{ code: number; message: string; url?: string } | null>(null);
    const [retryCount, setRetryCount] = React.useState(0);
    const [canGoBack, setCanGoBack] = React.useState(false);
    const currentUrlRef = useRef<string>('');
    const currentHostRef = useRef<string>('');
    const messageQueueRef = useRef<BridgeResponse[]>([]);
    const isWebViewReadyRef = useRef(false);
    const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const injectedJavaScriptBeforeContentLoaded = useMemo(() => {
      const availableActions = getAvailableActions();
      return `
      (function() {
        window.__AVAILABLE_ACTIONS__ = ${JSON.stringify(availableActions)};
        window.__HYBRID_WEBVIEW_READY__ = true;
        
        if (typeof window.__HYBRID_WEBVIEW_INIT__ !== 'function') {
          window.__HYBRID_WEBVIEW_INIT__ = function() {
            if (window.dispatchEvent) {
              var event = new CustomEvent('hybridWebViewReady', {
                detail: { availableActions: window.__AVAILABLE_ACTIONS__ }
              });
              window.dispatchEvent(event);
            }
            ${enableDebug ? "console.log('[HybridWebView] WebView ready, actions available:', window.__AVAILABLE_ACTIONS__);" : ''}
          };
          window.__HYBRID_WEBVIEW_INIT__();
        }
        
        true;
      })();
      true;
    `;
    }, [enableDebug]);

    const sendResponseToH5 = useCallback((response: BridgeResponse) => {
      if (!webviewRef.current || !isWebViewReadyRef.current) {
        messageQueueRef.current.push(response);
        return;
      }
      
      try {
        const safeResponse = JSON.stringify(response).replace(/'/g, "\\'");
        const script = `
          if (window.__RECEIVE_MESSAGE_FROM_APP__) {
            window.__RECEIVE_MESSAGE_FROM_APP__('${safeResponse}');
          }
          true;
        `;
        webviewRef.current.injectJavaScript(script);
      } catch (e) {
        console.error('[HybridWebView] 发送消息到 H5 失败:', e);
      }
    }, []);

    const sendAppEventToH5 = useCallback((eventType: string, data?: any) => {
      if (!webviewRef.current || !isWebViewReadyRef.current) {
        return;
      }
      
      try {
        const safeData = data ? JSON.stringify(data).replace(/'/g, "\\'") : 'null';
        const script = `
          if (window.__ON_APP_EVENT__) {
            window.__ON_APP_EVENT__('${eventType}', ${safeData});
          }
          true;
        `;
        webviewRef.current.injectJavaScript(script);
      } catch (e) {
        console.error('[HybridWebView] 发送 App 事件到 H5 失败:', e);
      }
    }, []);

    const flushMessageQueue = useCallback(() => {
      while (messageQueueRef.current.length > 0) {
        const response = messageQueueRef.current.shift();
        if (response) {
          sendResponseToH5(response);
        }
      }
    }, [sendResponseToH5]);

    const handleMessage = useCallback(
      async (event: WebViewMessageEvent) => {
        try {
          const request: BridgeRequest = JSON.parse(event.nativeEvent.data);
          const { msgId, action, data } = request;
          
          if (enableDebug) {
            console.log('[HybridWebView] 收到 H5 消息:', request);
          }
          
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
            console.error('[HybridWebView] 执行 action 失败:', action, err);
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
      [onBridgeMessage, sendResponseToH5, enableDebug]
    );

    const parseHostFromUrl = useCallback((url: string): string => {
      try {
        const parsedUrl = new URL(url);
        return parsedUrl.host;
      } catch (e) {
        return '';
      }
    }, []);

    const checkUrlInWhitelist = useCallback((url: string): boolean => {
      if (whitelist.length === 0) return true;
      
      try {
        const parsedUrl = new URL(url);
        return whitelist.some((domain) => parsedUrl.hostname.includes(domain));
      } catch (e) {
        return false;
      }
    }, [whitelist]);

    const clearLoadTimeout = useCallback(() => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
    }, []);

    const handleShouldStartLoadWithRequest = useCallback(
      (request: any): boolean => {
        const { url } = request;
        
        if (url.startsWith('http://') || url.startsWith('https://')) {
          if (!checkUrlInWhitelist(url)) {
            console.warn('[HybridWebView] URL blocked by whitelist:', url);
            Alert.alert(
              '访问受限',
              '该页面不在允许的访问列表中',
              [{ text: '确定' }],
              { cancelable: false }
            );
            return false;
          }
        }
        
        return true;
      },
      [checkUrlInWhitelist]
    );

    const handleNavigationStateChange = useCallback(
      (navState: WebViewNavigation) => {
        if (navState.url) {
          currentUrlRef.current = navState.url;
        }
        setCanGoBack(navState.canGoBack);
        
        onNavigationStateChange?.(navState);
      },
      [onNavigationStateChange]
    );

    const handleError = useCallback(
      (syntheticEvent: any) => {
        clearLoadTimeout();
        
        const { nativeEvent } = syntheticEvent;
        const errorCode = nativeEvent.code || -1;
        const errorMessage = nativeEvent.description || 'WebView Error';
        const url = nativeEvent.url || currentUrlRef.current;
        
        console.error('[HybridWebView] WebView error:', { code: errorCode, message: errorMessage, url });
        
        setIsLoading(false);
        setError({
          code: errorCode,
          message: errorMessage,
          url,
        });
        
        props.onError?.(syntheticEvent);
      },
      [props, clearLoadTimeout]
    );

    const handleHttpError = useCallback(
      (syntheticEvent: any) => {
        const { nativeEvent } = syntheticEvent;
        const statusCode = nativeEvent.statusCode || -1;
        const url = nativeEvent.url || currentUrlRef.current;
        
        console.warn('[HybridWebView] HTTP Error:', { statusCode, url });
        
        if (statusCode === 404 || statusCode >= 500) {
          setError({
            code: statusCode,
            message: `页面加载失败 (${statusCode})`,
            url,
          });
        }
        
        props.onHttpError?.(syntheticEvent);
      },
      [props]
    );

    const handleLoadStart = useCallback(
      (event: Parameters<NonNullable<WebViewProps['onLoadStart']>>[0]) => {
        const newUrl = event.nativeEvent.url;
        const newHost = parseHostFromUrl(newUrl);
        
        // 检查是否是同一 host 内部导航（SPA 路由）
        const isSameHostNavigation = 
          currentHostRef.current && 
          currentHostRef.current === newHost;
        
        if (hideLoadingOnSpaNavigation && isSameHostNavigation) {
          // 如果是 SPA 内部路由，不显示加载状态
          if (enableDebug) {
            console.log('[HybridWebView] 检测到 SPA 路由变更，跳过加载状态:', newUrl);
          }
        } else if (!isControlledByH5) {
          // 真实页面加载，且没有被 H5 控制，显示加载状态
          setIsLoading(true);
          setError(null);
          isWebViewReadyRef.current = false;
          
          // 设置加载超时
          clearLoadTimeout();
          loadTimeoutRef.current = setTimeout(() => {
            if (enableDebug) {
              console.warn('[HybridWebView] 加载超时，隐藏加载状态');
            }
            setIsLoading(false);
          }, loadTimeout);
          
          if (enableDebug) {
            console.log('[HybridWebView] 开始加载:', newUrl);
          }
        }
        
        // 更新当前 host
        currentHostRef.current = newHost;
        currentUrlRef.current = newUrl;
        
        props.onLoadStart?.(event);
      },
      [props, enableDebug, parseHostFromUrl, clearLoadTimeout, hideLoadingOnSpaNavigation, loadTimeout, isControlledByH5]
    );

    const handleLoadEnd = useCallback(
      (event: Parameters<NonNullable<WebViewProps['onLoadEnd']>>[0]) => {
        // 清除超时定时器
        clearLoadTimeout();
        
        if (!isControlledByH5) {
          setIsLoading(false);
        }
        
        isWebViewReadyRef.current = true;
        setRetryCount(0);
        flushMessageQueue();
        
        if (enableDebug) {
          console.log('[HybridWebView] 加载完成:', event.nativeEvent.url);
        }
        
        props.onLoadEnd?.(event);
      },
      [props, enableDebug, flushMessageQueue, clearLoadTimeout, isControlledByH5]
    );

    const handleLoadProgress = useCallback(
      (event: any) => {
        if (enableDebug) {
          console.log('[HybridWebView] 加载进度:', event.nativeEvent.progress);
        }
        props.onLoadProgress?.(event);
      },
      [props, enableDebug]
    );

    const handleReload = useCallback(() => {
      if (error && retryCount < maxRetryCount) {
        setRetryCount(prev => prev + 1);
        setError(null);
        webviewRef.current?.reload();
      } else {
        webviewRef.current?.reload();
      }
    }, [error, retryCount, maxRetryCount]);

    const handleGoBack = useCallback((): boolean => {
      if (webviewRef.current && canGoBack) {
        webviewRef.current.goBack();
        return true;
      }
      return false;
    }, [canGoBack]);

    const handleGoForward = useCallback((): boolean => {
      if (webviewRef.current) {
        webviewRef.current.goForward();
        return true;
      }
      return false;
    }, []);

    const handleClearCache = useCallback(() => {
      if (webviewRef.current && 'clearCache' in webviewRef.current) {
        (webviewRef.current as any).clearCache(true);
      }
    }, []);

    const handleClearHistory = useCallback(() => {
      if (webviewRef.current && 'clearHistory' in webviewRef.current) {
        (webviewRef.current as any).clearHistory();
      }
    }, []);

    useImperativeHandle(ref, () => ({
      sendToH5: sendResponseToH5,
      reload: handleReload,
      goBack: handleGoBack,
      goForward: handleGoForward,
      clearCache: handleClearCache,
      clearHistory: handleClearHistory,
    }));

    React.useEffect(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (canGoBack) {
          webviewRef.current?.goBack();
          return true;
        }
        return false;
      });

      return () => backHandler.remove();
    }, [canGoBack]);

    React.useEffect(() => {
      // 初始化 host
      if (source && 'uri' in source && typeof source.uri === 'string') {
        currentHostRef.current = parseHostFromUrl(source.uri);
        currentUrlRef.current = source.uri;
      }
    }, [source, parseHostFromUrl]);

    React.useEffect(() => {
      return () => {
        clearLoadTimeout();
        messageQueueRef.current = [];
        isWebViewReadyRef.current = false;
      };
    }, [clearLoadTimeout]);

    // 监听 LoadingManager 状态变化
    React.useEffect(() => {
      if (!enableNativeLoadingControl) return;

      const unsubscribe = LoadingManager.subscribe(({ isLoading, text }) => {
        if (enableDebug) {
          console.log('[HybridWebView] LoadingManager 状态变化:', isLoading, text);
        }
        
        setIsLoading(isLoading);
        if (text !== undefined) {
          setLoadingText(text);
        }
        
        // 如果是由 H5 触发的，设置受控状态
        setIsControlledByH5(isLoading);
        
        // 通知外部状态变化
        onLoadingStateChange?.(isLoading, text);
      });

      return unsubscribe;
    }, [enableNativeLoadingControl, enableDebug, onLoadingStateChange]);

    const DefaultLoadingComponent = () => (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>{loadingText}</Text>
      </View>
    );

    const DefaultErrorComponent = () => (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>页面加载失败</Text>
        <Text style={styles.errorMessage}>{error?.message}</Text>
        {error?.url && (
          <Text style={styles.errorUrl} numberOfLines={1} ellipsizeMode="middle">
            {error.url}
          </Text>
        )}
        <View style={styles.errorActions}>
          <Text style={styles.retryButton} onPress={handleReload}>
            {retryCount > 0 ? `重试 (${retryCount}/${maxRetryCount})` : '重试'}
          </Text>
        </View>
      </View>
    );

    return (
      <View style={styles.container}>
        {error ? (
          renderError ? renderError(error) : <DefaultErrorComponent />
        ) : (
          <WebView
            ref={webviewRef}
            source={source}
            onMessage={handleMessage}
            onError={handleError}
            onHttpError={handleHttpError}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            onLoadProgress={handleLoadProgress}
            onNavigationStateChange={handleNavigationStateChange}
            onShouldStartLoadWithRequest={Platform.select({
              ios: handleShouldStartLoadWithRequest,
              android: undefined,
            })}
            injectedJavaScriptBeforeContentLoaded={injectedJavaScriptBeforeContentLoaded}
            
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={false}
            allowsBackForwardNavigationGestures={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            cacheEnabled={CACHE_ENABLED}
            thirdPartyCookiesEnabled={THIRD_PARTY_COOKIES_ENABLED}
            androidLayerType="hardware"
            scalesPageToFit={true}
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={true}
            style={styles.webview}
            
            {...props}
          />
        )}
        
        {isLoading && !error && (
          <View style={styles.loadingOverlay}>
            {renderLoading ? renderLoading() : <DefaultLoadingComponent />}
          </View>
        )}
      </View>
    );
  };

export const HybridWebView = forwardRef(HybridWebViewComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorUrl: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  errorActions: {
    flexDirection: 'row',
    gap: 16,
  },
  retryButton: {
    fontSize: 16,
    color: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F0F7FF',
  },
});

export default HybridWebView;

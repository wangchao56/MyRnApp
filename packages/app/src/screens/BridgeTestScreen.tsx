import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { HybridWebView, HybridWebViewRef } from '../components/HybridWebView';
import { BridgeRequest } from '@myapp/shared';


export const BridgeTestScreen: React.FC = () => {
  const webviewRef = useRef<HybridWebViewRef>(null);
  const [lastMessage, setLastMessage] = useState<BridgeRequest | null>(null);

  const handleBridgeMessage = useCallback((message: BridgeRequest) => {
    console.log('[BridgeTestScreen] 收到 H5 消息:', message);
    setLastMessage(message);
  }, []);

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.loadingText}>加载中...</Text>
    </View>
  );

  const renderError = (error: { code: number; message: string }) => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>出错了</Text>
      <Text style={styles.errorMessage}>{error.message}</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => webviewRef.current?.reload()}
      >
        <Text style={styles.retryButtonText}>重试</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.webviewContainer}>
        <HybridWebView
          ref={webviewRef}
          source={{ uri: "http://192.168.31.49:3000/bridge-test" }}
          onBridgeMessage={handleBridgeMessage}
          // renderLoading={renderLoading}
          webviewDebuggingEnabled={true}  // Android 专用属性
          renderError={renderError}
          style={styles.webview}
        />
      </View>

      <View style={styles.debugPanel}>
        <Text style={styles.debugTitle}>调试信息</Text>
        <ScrollView style={styles.debugContent}>
          <Text style={styles.debugText}>
            {lastMessage
              ? JSON.stringify(lastMessage, null, 2)
              : '暂无消息'}
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#007AFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  lastMessage: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  webviewContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  debugPanel: {
    maxHeight: 150,
    padding: 12,
    backgroundColor: '#1a1a1a',
  },
  debugTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00FF00',
    marginBottom: 4,
  },
  debugContent: {
    flex: 1,
  },
  debugText: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#00FF00',
  },
});

export default BridgeTestScreen;

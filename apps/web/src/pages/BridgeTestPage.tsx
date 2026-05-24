import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { invoke, isInApp, onAppEvent, offAppEvent } from '@myapp/jsbridge';

interface TestResult {
  action: string;
  status: 'pending' | 'success' | 'error';
  data?: any;
  error?: string;
  time: Date;
}

export const BridgeTestPage: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [inApp, setInApp] = useState(false);

  useEffect(() => {
    setInApp(isInApp());

    onAppEvent('testPush', (data: unknown) => {
      console.log('[BridgeTestPage] 收到 App 推送:', data);
      setResults((prev) => [
        ...prev,
        {
          action: 'App Push: testPush',
          status: 'success',
          data,
          time: new Date(),
        },
      ]);
    });

    return () => {
      offAppEvent('testPush');
    };
  }, []);

  const addResult = (result: TestResult) => {
    setResults((prev) => [result, ...prev].slice(0, 20));
  };

  const testAction = async (action: string, data?: any) => {
    const startTime = Date.now();
    addResult({
      action,
      status: 'pending',
      time: new Date(),
    });

    try {
      const result = await invoke(action, data);
      const duration = Date.now() - startTime;
      addResult({
        action,
        status: 'success',
        data: result,
        time: new Date(),
      });
      console.log(`[${action}] 成功 (${duration}ms):`, result);
    } catch (error: any) {
      const duration = Date.now() - startTime;
      addResult({
        action,
        status: 'error',
        error: error.message,
        time: new Date(),
      });
      console.error(`[${action}] 失败 (${duration}ms):`, error);
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return '#34C759';
      case 'error':
        return '#FF3B30';
      default:
        return '#FF9500';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>JSBridge 测试页面</Text>
        <View style={[styles.badge, inApp ? styles.badgeInApp : styles.badgeWeb]}>
          <Text style={styles.badgeText}>
            {inApp ? 'App 环境' : 'Web 环境'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>用户信息</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={() => testAction('getUserInfo')}
          >
            <Text style={styles.buttonText}>获取用户信息</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={() => testAction('getToken')}
          >
            <Text style={styles.buttonText}>获取 Token</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>功能调用</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.buttonSuccess]}
            onPress={() => testAction('scanQRCode', { type: 'qr' })}
          >
            <Text style={styles.buttonText}>扫码</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonSuccess]}
            onPress={() => testAction('share', { title: '测试', text: '来自 H5 的分享' })}
          >
            <Text style={styles.buttonText}>分享</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>应用信息</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={() => testAction('getAppInfo')}
          >
            <Text style={styles.buttonText}>获取 App 信息</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={() => testAction('getDeviceInfo')}
          >
            <Text style={styles.buttonText}>获取设备信息</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>系统功能</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={() => testAction('showToast', '这是一条 Toast 消息')}
          >
            <Text style={styles.buttonText}>显示 Toast</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>测试结果</Text>
        {results.length === 0 ? (
          <Text style={styles.emptyText}>暂无测试结果</Text>
        ) : (
          results.map((result, index) => (
            <View key={index} style={styles.resultItem}>
              <View style={styles.resultHeader}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: getStatusColor(result.status) },
                  ]}
                />
                <Text style={styles.resultAction}>{result.action}</Text>
              </View>
              <Text style={styles.resultTime}>
                {result.time.toLocaleTimeString()}
              </Text>
              {result.status === 'pending' && (
                <Text style={styles.resultPending}>处理中...</Text>
              )}
              {result.status === 'success' && result.data && (
                <View style={styles.resultData}>
                  <Text style={styles.resultDataText}>
                    {JSON.stringify(result.data, null, 2)}
                  </Text>
                </View>
              )}
              {result.status === 'error' && (
                <Text style={styles.resultError}>{result.error}</Text>
              )}
            </View>
          ))
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Promise-based JS Bridge Demo
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeInApp: {
    backgroundColor: '#007AFF',
  },
  badgeWeb: {
    backgroundColor: '#8E8E93',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  buttonGroup: {
    gap: 8,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#007AFF',
  },
  buttonSuccess: {
    backgroundColor: '#34C759',
  },
  buttonSecondary: {
    backgroundColor: '#5856D6',
  },
  buttonDanger: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
  resultItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  resultAction: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  resultTime: {
    fontSize: 11,
    color: '#999',
    marginLeft: 16,
  },
  resultPending: {
    fontSize: 12,
    color: '#FF9500',
    marginTop: 4,
    marginLeft: 16,
  },
  resultData: {
    marginTop: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    padding: 10,
  },
  resultDataText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#333',
  },
  resultError: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
    marginLeft: 16,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 40,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});

export default BridgeTestPage;

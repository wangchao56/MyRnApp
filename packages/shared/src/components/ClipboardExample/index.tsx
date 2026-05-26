import React from 'react';
import { View, Text, Button, StyleSheet, Alert, Platform } from 'react-native';
import { useClipboard } from '../../hooks';
import { CopyButton } from '../CopyButton';

const TEST_TEXT = 'Hello from Clipboard! 👋';
const TEST_URL = 'https://github.com/react-native-clipboard/clipboard';
const TEST_INVITE_CODE = 'INVITE-2024-ABCD';

export const ClipboardExample: React.FC = () => {
  const { data, setString, getString, hasString } = useClipboard();

  const handleCopyText = async () => {
    try {
      await setString(TEST_TEXT);
      if (Platform.OS !== 'web') {
        Alert.alert('成功', `已复制到剪贴板:\n${TEST_TEXT}`);
      }
    } catch (err) {
      if (Platform.OS !== 'web') {
        Alert.alert('错误', '复制失败');
      }
    }
  };

  const handleCopyUrl = async () => {
    try {
      await setString(TEST_URL);
      if (Platform.OS !== 'web') {
        Alert.alert('成功', `链接已复制:\n${TEST_URL}`);
      }
    } catch (err) {
      if (Platform.OS !== 'web') {
        Alert.alert('错误', '复制失败');
      }
    }
  };

  const handleCheckClipboard = async () => {
    try {
      const hasContent = await hasString();
      if (Platform.OS !== 'web') {
        Alert.alert('剪贴板状态', hasContent ? '剪贴板中有内容' : '剪贴板为空');
      }
    } catch (err) {
      if (Platform.OS !== 'web') {
        Alert.alert('错误', '检查失败');
      }
    }
  };

  const handleRefresh = async () => {
    try {
      await getString();
    } catch (err) {
      console.error('Refresh failed:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>剪贴板示例</Text>

      <View style={styles.statusBox}>
        <Text style={styles.statusLabel}>当前剪贴板内容:</Text>
        <Text style={styles.statusText} numberOfLines={3} ellipsizeMode="tail">
          {data || '(空)'}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="📋 复制示例文本" onPress={handleCopyText} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="🔗 复制链接" onPress={handleCopyUrl} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="🔍 检查剪贴板" onPress={handleCheckClipboard} color="#5856D6" />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="🔄 刷新内容" onPress={handleRefresh} color="#8E8E93" />
      </View>

      <View style={styles.exampleSection}>
        <Text style={styles.exampleTitle}>CopyButton 组件示例:</Text>

        <View style={styles.copyButtonRow}>
          <CopyButton
            text={TEST_INVITE_CODE}
            label="复制邀请码"
            variant="primary"
            size="small"
            style={styles.copyButton}
          />
        </View>

        <View style={styles.copyButtonRow}>
          <CopyButton
            text={TEST_URL}
            label="复制链接"
            copiedLabel="已复制!"
            variant="outline"
            size="medium"
            style={styles.copyButton}
          />
        </View>

        <View style={styles.copyButtonRow}>
          <CopyButton
            text="这是一段较长的文本内容，演示 CopyButton 组件的完整功能"
            label="复制长文本"
            variant="secondary"
            size="large"
            showAlert={Platform.OS !== 'web'}
            style={styles.copyButton}
          />
        </View>
      </View>

      <View style={styles.platformInfo}>
        <Text style={styles.platformTitle}>平台信息</Text>
        <Text style={styles.platformText}>OS: {Platform.OS}</Text>
        <Text style={styles.platformText}>自动同步: Hook 自动监听剪贴板变化</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  statusBox: {
    width: '100%',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 14,
    color: '#1976D2',
    marginBottom: 8,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  buttonContainer: {
    marginVertical: 8,
    width: '100%',
  },
  exampleSection: {
    width: '100%',
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
  },
  copyButtonRow: {
    marginVertical: 8,
    width: '100%',
  },
  copyButton: {
    width: '100%',
  },
  platformInfo: {
    width: '100%',
    marginTop: 24,
    padding: 16,
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
  },
  platformTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#E65100',
  },
  platformText: {
    fontSize: 14,
    color: '#424242',
    marginBottom: 4,
  },
});

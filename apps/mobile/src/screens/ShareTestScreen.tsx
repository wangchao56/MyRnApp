import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { share } from '@myapp/share';
import type { ShareResult } from '@myapp/share';

export const ShareTestScreen: React.FC = () => {
  const [lastResult, setLastResult] = useState<ShareResult | null>(null);

  const handleShare = async () => {
    try {
      const result = await share({
        title: '邀请你加入 MyRnApp',
        message: '快来体验全平台分享',
        url: 'https://example.com/invite?code=demo',
        icon: 'https://picsum.photos/200',
      });
      setLastResult(result);
      if (result.message) {
        Alert.alert('分享', result.message);
      }
    } catch (error) {
      Alert.alert(
        '分享失败',
        error instanceof Error ? error.message : '未知错误',
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>分享功能测试</Text>
        <Text style={styles.subtitle}>平台: {Platform.OS}</Text>
        <TouchableOpacity style={styles.button} onPress={handleShare}>
          <Text style={styles.buttonText}>唤起分享</Text>
        </TouchableOpacity>
        {lastResult && (
          <Text style={styles.result}>
            {JSON.stringify(lastResult, null, 2)}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#8E8E93',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  result: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    color: '#333',
  },
});

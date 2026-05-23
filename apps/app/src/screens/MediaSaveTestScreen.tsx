import React from 'react';
import {View, Text, Button, StyleSheet, ActivityIndicator, Alert, Platform, ScrollView} from 'react-native';
import {useSaveMedia} from '@myapp/shared';

const TEST_IMAGE_URL = 'https://picsum.photos/800/600?random=100';
const TEST_VIDEO_URL = 'https://www.w3schools.com/html/mov_bbb.mp4';

export const MediaSaveTestScreen: React.FC = () => {
  const {saveMedia, isLoading, error, success, reset} = useSaveMedia();

  const handleSaveImage = async () => {
    try {
      await saveMedia(TEST_IMAGE_URL, {
        type: 'photo',
        album: 'MyRnApp Test',
      });
      Alert.alert('成功', '图片已保存到相册！\n相册名称: MyRnApp Test');
    } catch (err) {
      Alert.alert('错误', `保存失败: ${error || '未知错误'}`);
    }
  };

  const handleSaveVideo = async () => {
    try {
      await saveMedia(TEST_VIDEO_URL, {
        type: 'video',
        album: 'MyRnApp Test',
      });
      Alert.alert('成功', '视频已保存到相册！\n相册名称: MyRnApp Test');
    } catch (err) {
      Alert.alert('错误', `保存失败: ${error || '未知错误'}`);
    }
  };

  const handleReset = () => {
    reset();
    Alert.alert('已重置', '状态已重置');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>媒体保存测试</Text>
      <Text style={styles.subtitle}>平台: {Platform.OS}</Text>

      <View style={styles.statusContainer}>
        {isLoading && (
          <View style={styles.statusItem}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.statusText}>正在保存...</Text>
          </View>
        )}

        {success && !isLoading && (
          <View style={[styles.statusItem, styles.successBox]}>
            <Text style={styles.successText}>✅ 保存成功！</Text>
          </View>
        )}

        {error && !isLoading && (
          <View style={[styles.statusItem, styles.errorBox]}>
            <Text style={styles.errorText}>❌ 错误: {error}</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="📷 保存图片"
          onPress={handleSaveImage}
          disabled={isLoading}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="🎬 保存视频"
          onPress={handleSaveVideo}
          disabled={isLoading}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="🔄 重置状态"
          onPress={handleReset}
          color="#8E8E93"
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>测试信息</Text>
        <Text style={styles.infoText}>
          测试图片: {TEST_IMAGE_URL}
        </Text>
        <Text style={styles.infoText}>
          测试视频: {TEST_VIDEO_URL}
        </Text>
        <Text style={styles.infoText}>
          目标相册: MyRnApp Test
        </Text>
      </View>

      <View style={styles.platformInfo}>
        <Text style={styles.platformTitle}>平台信息</Text>
        <Text style={styles.platformText}>OS: {Platform.OS}</Text>
        <Text style={styles.platformText}>Version: {Platform.Version}</Text>
        <Text style={styles.platformText}>
          权限处理: {Platform.OS === 'android' ? '自动请求存储权限' : '无需权限'}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F2F2F7',
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
  statusContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  statusItem: {
    alignItems: 'center',
    padding: 20,
  },
  statusText: {
    marginTop: 10,
    fontSize: 16,
    color: '#007AFF',
  },
  successBox: {
    backgroundColor: '#D4EDDA',
    borderRadius: 12,
    padding: 16,
  },
  successText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#155724',
  },
  errorBox: {
    backgroundColor: '#F8D7DA',
    borderRadius: 12,
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#721C24',
  },
  buttonContainer: {
    marginVertical: 10,
  },
  infoContainer: {
    marginTop: 30,
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1976D2',
  },
  infoText: {
    fontSize: 14,
    color: '#424242',
    marginBottom: 8,
  },
  platformInfo: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
  },
  platformTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#E65100',
  },
  platformText: {
    fontSize: 14,
    color: '#424242',
    marginBottom: 8,
  },
});

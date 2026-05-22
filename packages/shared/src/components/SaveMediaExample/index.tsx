import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useSaveMedia} from '../../hooks';

export const SaveMediaExample: React.FC = () => {
  const {saveMedia, isLoading, error, success, reset} = useSaveMedia();

  const handleSaveImage = async () => {
    try {
      await saveMedia('https://reactnative.dev/img/tiny_logo.png', {
        type: 'photo',
        album: 'MyRnApp',
      });
      Alert.alert('成功', '图片已保存到相册');
    } catch (err) {
      Alert.alert('错误', error || '保存失败');
    }
  };

  const handleSaveVideo = async () => {
    try {
      await saveMedia('https://www.w3schools.com/html/mov_bbb.mp4', {
        type: 'video',
        album: 'MyRnApp',
      });
      Alert.alert('成功', '视频已保存到相册');
    } catch (err) {
      Alert.alert('错误', error || '保存失败');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>媒体保存示例</Text>

      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      {success && <Text style={styles.successText}>保存成功！</Text>}
      {error && <Text style={styles.errorText}>错误: {error}</Text>}

      <View style={styles.buttonContainer}>
        <Button
          title="保存图片"
          onPress={handleSaveImage}
          disabled={isLoading}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="保存视频"
          onPress={handleSaveVideo}
          disabled={isLoading}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="重置状态" onPress={reset} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    marginVertical: 10,
    width: '80%',
  },
  successText: {
    color: 'green',
    fontSize: 16,
    marginVertical: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginVertical: 10,
  },
});

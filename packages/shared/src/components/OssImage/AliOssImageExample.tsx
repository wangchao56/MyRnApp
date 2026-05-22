import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AliOssImage, type OssResizeOptions } from '../../index';

const AliOssImageExample = () => {
  const exampleUrl = 'https://oss-console-img-demo-cn-hangzhou-3az.oss-cn-hangzhou.aliyuncs.com/example1.jpg';

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <AliOssImage
          source={exampleUrl}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.section}>
        <AliOssImage
          source={exampleUrl}
          style={styles.image}
          resizeMode="cover"
          resizeOptions={{ p: 50 }}
        />
      </View>

      <View style={styles.section}>
        <AliOssImage
          source={exampleUrl}
          style={styles.image}
          resizeMode="cover"
          resizeOptions={{ w: 200, h: 150, m: 'lfit' }}
        />
      </View>

      <View style={styles.section}>
        <AliOssImage
          source={exampleUrl}
          style={styles.image}
          resizeMode="cover"
          resizeOptions={{ w: 200, h: 150, m: 'fill' }}
        />
      </View>

      <View style={styles.section}>
        <AliOssImage
          source={exampleUrl}
          style={styles.image}
          resizeMode="cover"
          resizeOptions={{ w: 200, h: 150, m: 'pad', color: '000000' }}
        />
      </View>

      <View style={styles.section}>
        <AliOssImage
          source={exampleUrl}
          style={styles.image}
          resizeMode="cover"
          resizeOptions={{ l: 300 }}
        />
      </View>

      <View style={styles.section}>
        <AliOssImage
          source={exampleUrl}
          style={styles.image}
          resizeMode="cover"
          resizeOptions={{ p: 120, limit: 0 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  section: {
    width: '50%',
    padding: 8,
  },
  image: {
    width: '100%',
    height: 100,
  },
});

export default AliOssImageExample;

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {
  Card,
  Button,
  useAuth,
  colors,
  OssImage,
  ImagePreview,
  SmartImage,
  SvgIcon,
  ICONS,
} from '@myapp/shared';
import {observer} from 'mobx-react-lite';

const HomePageCom: React.FC = () => {
  const {isLoggedIn, displayName, login, logout} = useAuth();
  const [previewVisible, setPreviewVisible] = useState(false);

  const handleLogin = async () => {
    try {
      await login('demo@example.com', 'password');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome to MyRnApp</Text>
      <Text style={styles.subtitle}>Web Application</Text>
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Status</Text>
        <Text style={styles.cardText}>
          {isLoggedIn ? `Logged in as: ${displayName}` : 'Not logged in'}
        </Text>
      </Card>
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Actions</Text>
        {isLoggedIn ? (
          <Button title="Logout" onPress={logout} variant="secondary" />
        ) : (
          <Button title="Demo Login" onPress={handleLogin} variant="primary" />
        )}
      </Card>
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Architecture</Text>
        <Text style={styles.cardText}>
          This web app demonstrates the Monorepo architecture with:
        </Text>
        <Text style={styles.bulletPoint}>
          - Shared state management (MST + MobX)
        </Text>
        <Text style={styles.bulletPoint}>- Cross-platform components</Text>
        <Text style={styles.bulletPoint}>- TypeScript throughout</Text>
        <Text style={styles.bulletPoint}>- React Router for navigation</Text>
        <Text style={styles.bulletPoint}>- React Native Web</Text>
      </Card>
      <Card style={styles.card}>
        <OssImage
          source={{
            uri: 'https://picsum.photos/600/400?random=1',
          }}
          style={{width: '100%', height: 200, borderRadius: 8}}
          resizeMode="contain"
          onPress={() => setPreviewVisible(true)}
        />
      </Card>
      <ImageBackground
        source={{uri: 'https://picsum.photos/600/400?random=2'}}
        style={{width: '100%', height: 200, borderRadius: 8}}
        resizeMode="contain">
        <Text style={styles.cardText}>北京图片</Text>
      </ImageBackground>
      <ImagePreview
        visible={previewVisible}
        images={[
          'https://picsum.photos/600/400?random=2',
          'https://picsum.photos/600/400?random=3',
        ]}
        onClose={() => setPreviewVisible(false)}
      />
      <SmartImage
        source={{uri: 'https://picsum.photos/600/400?random=2'}}
        style={{width: '100%', height: 200, borderRadius: 8}}
        resizeMode="cover"
      />
      <SvgIcon name="home" size={24} color="#333" />
      <SvgIcon name="home" size="lg" color="red" />
      <SvgIcon name="search1" onPress={() => console.log('点击')} />
      <SvgIcon name="lock" disabled />
      <SvgIcon name={ICONS.arrowLeft} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  bulletPoint: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
    marginBottom: 4,
  },
});

export const HomePage = observer(HomePageCom);

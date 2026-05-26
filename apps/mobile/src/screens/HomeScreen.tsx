import React, {useCallback, useState} from 'react';
import {ImageBackground, ScrollView, StyleSheet, Text, View} from 'react-native';
import {
  Button,
  Card,
  ICONS,
  ImagePreview,
  OssImage,
  SmartImage,
  SvgIcon,
  colors,
  useAuth,
  useTheme,
} from '@myapp/shared';
import {observer} from 'mobx-react-lite';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigators/RouteType';

const SWIPER_HEIGHT = 200;

const IMAGE_ONE = 'https://picsum.photos/600/400?random=11';
const IMAGE_TWO = 'https://picsum.photos/600/400?random=12';
const IMAGE_THREE = 'https://picsum.photos/600/400?random=13';

const colorsItem = ['tomato', 'thistle', 'skyblue', 'teal'];

export const HomeScreenCom: React.FC = () => {
  const {user, isLoggedIn, displayName, logout, login} = useAuth();
  const {isDarkMode} = useTheme();
  const [previewVisible, setPreviewVisible] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [swiperWidth, setSwiperWidth] = useState(0);

  const handleSwiperLayout = useCallback((layoutWidth: number) => {
    if (layoutWidth > 0) {
      setSwiperWidth(prev => (prev === layoutWidth ? prev : layoutWidth));
    }
  }, []);

  const swiperItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: swiperWidth,
      offset: swiperWidth * index,
      index,
    }),
    [swiperWidth],
  );

  // const backgroundColor = isDarkMode ? colors.darkGray : colors.background;

  const handleLogin = async () => {
    try {
      navigation.navigate('MyModal', {data: 'someData'});
      // await login('demo@example.com', 'password');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} nestedScrollEnabled showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Welcome to MyRnApp</Text>
        <Text style={styles.subtitle}>Native image component examples</Text>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Status</Text>
          <Text style={styles.cardText}>{isLoggedIn ? `Logged in as: ${displayName}` : 'Not logged in'}</Text>
          {user && <Text style={styles.cardText}>Email: {user.email}</Text>}
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Actions</Text>
          {isLoggedIn ? (
            <Button title="Logout" onPress={handleLogout} variant="secondary" />
          ) : (
            <Button title="Demo Login" onPress={handleLogin} variant="primary" />
          )}
          <Button
            title="Bridge Test"
            onPress={() => navigation.navigate('BridgeTest')}
            variant="primary"
            style={{marginTop: 8}}
          />
          <Button
            title="Clipboard Test"
            onPress={() => navigation.navigate('BridgeTest')}
            variant="outline"
            style={{marginTop: 8}}
          />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Architecture</Text>
          <Text style={styles.cardText}>This app demonstrates the Monorepo architecture with:</Text>
          <Text style={styles.bulletPoint}>- Shared state management (MST + MobX)</Text>
          <Text style={styles.bulletPoint}>- Cross-platform components</Text>
          <Text style={styles.bulletPoint}>- TypeScript throughout</Text>
          <Text style={styles.bulletPoint}>- React Navigation</Text>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>OssImage preview</Text>
          <Text style={styles.cardText}>Tap the image to open the shared ImagePreview modal.</Text>
          <OssImage
            source={{uri: IMAGE_ONE}}
            style={styles.heroImage}
            resizeMode="cover"
            placeholder="loading"
            onPress={() => setPreviewVisible(true)}
          />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>ImageBackground</Text>
          <ImageBackground
            source={{uri: IMAGE_TWO}}
            style={styles.backgroundImage}
            imageStyle={styles.backgroundImageRadius}
            resizeMode="cover">
            <View style={styles.imageOverlay}>
              <Text style={styles.overlayTitle}>Native background image</Text>
              <Text style={styles.overlayText}>Powered by React Native</Text>
            </View>
          </ImageBackground>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>SmartImage1</Text>
          <Text style={styles.cardText}>Includes loading state, fade-in, and built-in tap preview.</Text>
          <SmartImage
            source={{uri: IMAGE_THREE}}
            width="100%"
            height={200}
            borderRadius={8}
            resizeMode="cover"
            placeholder="skeleton"
            enablePreview
          />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>SvgIcon</Text>
          <View style={styles.iconRow}>
            <SvgIcon name="home" size={24} color={colors.text} />
            <SvgIcon name={ICONS.search} size={24} color={colors.primary} />
            <SvgIcon name="lock" size={24} color={colors.gray} disabled />
            <SvgIcon name={ICONS.arrowLeft} size={24} color={colors.text} />
          </View>
        </Card>

        <ImagePreview
          visible={previewVisible}
          images={[IMAGE_ONE, IMAGE_TWO, IMAGE_THREE]}
          onClose={() => setPreviewVisible(false)}
        />
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Swiper</Text>
          <View
            style={styles.swiperContainer}
            onLayout={e => handleSwiperLayout(e.nativeEvent.layout.width)}>
            {swiperWidth > 0 ? (
              <SwiperFlatList
                key={swiperWidth}
                index={0}
                showPagination
                paginationDefaultColor="rgba(255,255,255,0.5)"
                paginationActiveColor="white"
                data={colorsItem}
                getItemLayout={swiperItemLayout}
                renderItem={({item}) => (
                  <View style={[styles.swiperSlide, {backgroundColor: item, width: swiperWidth}]}>
                    <Text style={styles.text}>{item}</Text>
                  </View>
                )}
              />
            ) : (
              <View style={styles.swiperPlaceholder} />
            )}
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
  },
  content: {
    padding: 16,
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
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
    marginBottom: 4,
  },
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  backgroundImage: {
    height: 200,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  backgroundImageRadius: {
    borderRadius: 8,
  },
  imageOverlay: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  overlayTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  overlayText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  swiperContainer: {
    width: '100%',
    height: SWIPER_HEIGHT,
    overflow: 'hidden',
    borderRadius: 8,
  },
  swiperPlaceholder: {
    flex: 1,
    backgroundColor: colors.lightGray,
    borderRadius: 8,
  },
  swiperSlide: {
    height: SWIPER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {fontSize: 30, textAlign: 'center', color: 'white', fontWeight: 'bold'},
});

export const HomeScreen = observer(HomeScreenCom);

import React, {useRef, useEffect} from 'react';
import {Platform, StatusBar, StyleSheet, View, useColorScheme} from 'react-native';
import {NavigationContainerRef} from '@react-navigation/native';
import {SafeAreaProvider, initialWindowMetrics} from 'react-native-safe-area-context';
import {StoreProvider} from '@myapp/shared';
import {setupDefaultShare} from '@myapp/share';
import {AppNavigator, setRootNavigation, RootStackParamList} from './navigators';
import {NavigationProvider} from './navigators/NavigationProvider';

// Web 端最大宽度限制
const MAX_WEB_WIDTH = 480;

const WebWrapper: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <View style={styles.webWrapper}>
      <View style={styles.webContent}>{children}</View>
    </View>
  );
};

// 根据平台选择 Wrapper
const Wrapper = Platform.OS === 'web' ? WebWrapper : React.Fragment;

function App() {
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    setRootNavigation(navigationRef.current!);
    if (Platform.OS === 'web') {
      setupDefaultShare({
        onNotify: (message) => {
          if (typeof window !== 'undefined') {
            window.alert(message);
          }
        },
      });
    }
  }, []);

  return (
    <StoreProvider>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <Wrapper>
          <NavigationProvider>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              translucent={true}
            />
            <AppNavigator />
          </NavigationProvider>
        </Wrapper>
      </SafeAreaProvider>
    </StoreProvider>
  );
}

const styles = StyleSheet.create({
  webWrapper: {
    width: '100%',
    height: '100%',
    maxWidth: MAX_WEB_WIDTH,
    alignSelf: 'center',
    flex: 1,
  },
  webContent: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default App;

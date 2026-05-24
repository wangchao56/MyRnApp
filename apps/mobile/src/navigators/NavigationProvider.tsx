// navigation/NavigationProvider.tsx
import React from 'react';
import {NavigationContainer, DefaultTheme, DarkTheme, NavigationState} from '@react-navigation/native';
import {useColorScheme} from 'react-native';
import {RootStackParamList} from './RouteType';

// 自定义主题
export const MyLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1E88E5',
    background: '#F5F5F5',
    card: '#FFFFFF',
    text: '#212121',
    border: '#E0E0E0',
    notification: '#FF5722',
  },
};

export const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#90CAF9',
    background: '#121212',
    card: '#1E1E1E',
    text: '#E0E0E0',
    border: '#333333',
    notification: '#FF8A65',
  },
};

// 导航状态持久化（可选）
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getActiveRouteName} from './helper';
import {linking} from './LinkingConfig';
import {useTheme} from '@myapp/shared';
import {observer} from 'mobx-react-lite';

export const persistence = {
  async persistNavigationState(state: any) {
    await AsyncStorage.setItem('navigationState', JSON.stringify(state));
  },
  async loadNavigationState() {
    const json = await AsyncStorage.getItem('navigationState');
    return json ? JSON.parse(json) : undefined;
  },
};

// 导航事件监听
const onReady = () => {
  console.log('Navigation ready');
};

// 导航状态变化回调
const onStateChange = (state: NavigationState | undefined) => {
  const currentRouteName = getActiveRouteName(state);
  console.log('Navigation state changed:', currentRouteName);
  // 可以在这里添加埋点或其他逻辑
};

// 主容器组件
interface NavigationProviderProps {
  children: React.ReactNode;
}

function MainNavigationContainer({children}: NavigationProviderProps) {
  const {isDarkMode} = useTheme();

  return (
    <NavigationContainer<RootStackParamList>
      linking={linking}
      // fallback={<SplashScreen />} // Deep Link 加载时占位
      onReady={onReady}
      onStateChange={onStateChange}
      theme={{
        dark: isDarkMode,
        colors: {
          primary: '#007AFF',
          background: isDarkMode ? '#000' : '#fff',
          card: isDarkMode ? '#1C1C1E' : '#fff',
          text: isDarkMode ? '#fff' : '#000',
          border: isDarkMode ? '#38383A' : '#C6C6C8',
          notification: '#FF3B30',
        },
      }}
      // 状态持久化（开发时建议关闭）
      // initialState={persistence.loadNavigationState()}
      // onStateChange={async (state) => {
      //   onStateChange(state);
      //   await persistence.persistNavigationState(state);
      // }}
    >
      {children}
    </NavigationContainer>
  );
}

export const NavigationProvider = observer(MainNavigationContainer);

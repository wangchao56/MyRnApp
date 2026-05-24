import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainerRef, NavigationContainer } from '@react-navigation/native';

import { ModalScreen } from '../components/ModalScreen';
import { BridgeTestScreen } from '../screens/BridgeTestScreen';
import { RootStackParamList } from './RouteType';
import { ModalStack, modalNavigationRef } from './ModalStack';
import MainNavigator, { MainTabs } from './MainTabNavigator';



// 设置全局导航引用的回调
let setNavigationRef: ((ref: NavigationContainerRef<RootStackParamList>) => void) | null = null;
export const setRootNavigation = (ref: NavigationContainerRef<RootStackParamList>) => {
  if (setNavigationRef) {
    setNavigationRef(ref);
  }
};
// 创建导航器实例
const RootStack = createNativeStackNavigator<RootStackParamList>();
export const AppNavigator: React.FC = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {/* <MainNavigator /> */}
      {MainNavigator()}
      {/* <RootStack.Screen name="Main" component={MainTabs} options={{headerShown: false}} /> */}
      {/* Modal 层（独立导航容器） */}
      <RootStack.Screen name="Modals">
        {() => (
          <NavigationContainer independent ref={modalNavigationRef}>
            <ModalStack />
          </NavigationContainer>
        )}
      </RootStack.Screen>
      {/* <RootStack.Screen name="WebView" component={ModalScreen} /> */}
      <RootStack.Screen name="MyModal" component={ModalScreen} />
      <RootStack.Screen
        name="BridgeTest"
        component={BridgeTestScreen}
        options={{
          headerShown: true,
          title: 'Bridge 测试',
          statusBarTranslucent: false, // 只针对这个页面设置
        }}
      />
    </RootStack.Navigator>
  );
};

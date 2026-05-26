import React from 'react';
import {View} from 'react-native';

const defaultInsets = {top: 0, right: 0, bottom: 0, left: 0};

export const SafeAreaProvider = ({children}) => (
  <View style={{flex: 1, width: '100%', height: '100%'}}>{children}</View>
);

export const SafeAreaInsetsContext = React.createContext(defaultInsets);
export const SafeAreaFrameContext = React.createContext({x: 0, y: 0, width: 0, height: 0});
export const useSafeAreaInsets = () => defaultInsets;
export const useSafeAreaFrame = () => ({
  x: 0,
  y: 0,
  width: typeof window !== 'undefined' ? window.innerWidth : 0,
  height: typeof window !== 'undefined' ? window.innerHeight : 0,
});
export const withSafeAreaInsets = Component => Component;

/** Web 端须使用 RN View，否则 flex:1 等样式无法正确映射为 CSS */
export const SafeAreaView = ({children, style, edges: _edges, ...props}) => (
  <View style={[{flex: 1}, style]} {...props}>
    {children}
  </View>
);

export const initialWindowMetrics = {
  insets: defaultInsets,
  frame: {
    x: 0,
    y: 0,
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  },
};

export default {
  SafeAreaProvider,
  SafeAreaInsetsContext,
  SafeAreaFrameContext,
  useSafeAreaInsets,
  useSafeAreaFrame,
  withSafeAreaInsets,
  SafeAreaView,
  initialWindowMetrics,
};

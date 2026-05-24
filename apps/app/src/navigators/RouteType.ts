import {NavigatorScreenParams} from '@react-navigation/native';
import {NavigationState} from '@react-navigation/native';
import {MainTabParamList} from './MainTabNavigator';

// 自定义 NavigationContainer 组件的 Props
export interface AppNavigationContainerProps {
  /** 导航状态变化回调 */
  onStateChange?: (state: NavigationState | undefined) => void;
  /** 深度链接配置 */
  linking?: {
    prefixes: string[];
    config?: {
      screens: Record<string, any>;
      initialRouteName?: string;
    };
  };
  /** 导航主题 */
  theme?: {
    dark: boolean;
    colors: {
      primary: string;
      background: string;
      card: string;
      text: string;
      border: string;
      notification: string;
    };
  };
  /** 初始化状态 */
  initialState?: NavigationState;
}
// 导航参数类型
export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
  WebView: {uri: string; title?: string};
  MyModal: {data?: string} | undefined;
  Modals: undefined;
  BridgeTest: undefined;
};

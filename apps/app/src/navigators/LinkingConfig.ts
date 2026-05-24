import {LinkingOptions} from '@react-navigation/native';
import {RootStackParamList} from './RouteType';

// Deep Link 配置
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['myapp://', 'https://myapp.com'],
  config: {
    initialRouteName: 'Main',
    screens: {
      Main: {
        screens: {
          Home: 'home',
          Profile: 'profile',
          Settings: 'settings',
        },
      },
    },
  },
};

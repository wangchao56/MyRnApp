// Deep Link 配置
// 深度链接配置示例
export const linking = {
  prefixes: ['myapp://', 'https://myapp.com'],
  config: {
    initialRouteName: 'Main' as const,
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

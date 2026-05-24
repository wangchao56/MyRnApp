import {NavigationState} from '@react-navigation/native';

// 获取当前活跃的路由名称
export const getActiveRouteName = (state: NavigationState | undefined): string | undefined => {
  if (!state) return undefined;

  const route = state.routes[state.index];

  if (route.state) {
    return getActiveRouteName(route.state as NavigationState);
  }

  return route.name;
};

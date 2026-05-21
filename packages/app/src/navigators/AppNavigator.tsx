import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useTheme, colors } from '@myapp/shared';

export type RootStackParamList = {
  Main: undefined;
  WebView: { uri: string; title?: string };
};

export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

interface TabIconProps {
  name: string;
  focused: boolean;
  isDarkMode: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ name, focused, isDarkMode }) => (
  <View style={[styles.tabIcon, { backgroundColor: isDarkMode ? colors.surfaceDark : colors.surface }]}>
    <Text style={[
      styles.tabIconText, 
      focused && styles.tabIconTextActive,
      { color: focused ? colors.primary : (isDarkMode ? colors.lightGray : colors.gray) }
    ]}>
      {name.charAt(0)}
    </Text>
  </View>
);

const MainTabsComponent: React.FC = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDarkMode ? colors.lightGray : colors.gray,
        tabBarStyle: {
          backgroundColor: isDarkMode ? colors.darkGray : colors.white,
          borderTopColor: isDarkMode ? colors.gray : colors.lightGray,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="Home" focused={focused} isDarkMode={isDarkMode} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="Profile" focused={focused} isDarkMode={isDarkMode} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="Settings" focused={focused} isDarkMode={isDarkMode} />,
        }}
      />
    </Tab.Navigator>
  );
};

const MainTabs = observer(MainTabsComponent);

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={MainTabs} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tabIconTextActive: {
    color: colors.primary,
  },
});

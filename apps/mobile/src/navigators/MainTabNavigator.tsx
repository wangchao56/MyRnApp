// navigation/MainNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// 页面
import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { MediaSaveTestScreen } from '../screens/MediaSaveTestScreen';
import { ClipboardTestScreen } from '../screens/ClipboardTestScreen';
import { ShareTestScreen } from '../screens/ShareTestScreen';
import { colors } from '@myapp/shared';
import { useTheme } from '@react-navigation/native';
import { View, Platform, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { observer } from 'mobx-react-lite';

export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
  MediaTest: undefined;
  ClipboardTest: undefined;
  ShareTest: undefined;
  MyModal: undefined;
};

interface TabIconProps {
  name: string;
  focused: boolean;
  isDarkMode: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ name, focused, isDarkMode }) => (
  <View style={[styles.tabIcon, { backgroundColor: isDarkMode ? colors.surfaceDark : colors.surface }]}>
    <Text
      style={[
        styles.tabIconText,
        focused && styles.tabIconTextActive,
        { color: focused ? colors.primary : isDarkMode ? colors.lightGray : colors.gray },
      ]}>
      {name.charAt(0)}
    </Text>
  </View>
);
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_BAR_CONTENT_HEIGHT = 56;

const MainTabsComponent: React.FC = () => {
  const { dark: isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomInset = Platform.OS === 'ios' ? insets.bottom : 0;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDarkMode ? colors.lightGray : colors.gray,
        tabBarStyle: {
          backgroundColor: isDarkMode ? colors.darkGray : colors.white,
          borderTopColor: isDarkMode ? colors.gray : colors.lightGray,
          paddingBottom: bottomInset,
          height: TAB_BAR_CONTENT_HEIGHT + bottomInset,
          ...(Platform.OS === 'web'
            ? {
                position: 'absolute' as const,
                bottom: 0,
                left: 0,
                right: 0,
                height: 60,
                paddingBottom: 0,
              }
            : null),
        },
        headerShown: false,
      }}>
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
        name="MediaTest"
        component={MediaSaveTestScreen}
        options={{
          tabBarLabel: 'Media',
          tabBarIcon: ({ focused }) => <TabIcon name="Media" focused={focused} isDarkMode={isDarkMode} />,
        }}
      />
      <Tab.Screen
        name="ClipboardTest"
        component={ClipboardTestScreen}
        options={{
          tabBarLabel: 'Clipboard',
          tabBarIcon: ({ focused }) => <TabIcon name="Clipboard" focused={focused} isDarkMode={isDarkMode} />,
        }}
      />
      <Tab.Screen
        name="ShareTest"
        component={ShareTestScreen}
        options={{
          tabBarLabel: 'Share',
          tabBarIcon: ({ focused }) => <TabIcon name="Share" focused={focused} isDarkMode={isDarkMode} />,
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

export const MainTabs = observer(MainTabsComponent);

// 主导航（包含 Stack 页面）
export default function MainNavigator() {
  return (
    <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false, statusBarTranslucent: false }} />
  );
}

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

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreProvider } from '@myapp/shared';
import { AppNavigator } from './navigators';

const App: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <StoreProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor="transparent"
            translucent
          />
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </StoreProvider>
  );
};

export default App;

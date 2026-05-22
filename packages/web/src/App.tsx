import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Router } from './router';

const App: React.FC = () => {
  return (
    <View style={styles.container}>
      <Router />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100vh' as any,
    backgroundColor: '#FFFFFF',
  },
});

export default App;

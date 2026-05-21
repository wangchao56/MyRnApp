import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, Card, useAuth, useTheme, colors} from '@myapp/shared';
import {observer} from 'mobx-react-lite';

export const HomeScreenCom: React.FC = () => {
  const {user, isLoggedIn, displayName, logout, login} = useAuth();
  const {isDarkMode} = useTheme();

  const backgroundColor = isDarkMode ? colors.darkGray : colors.background;

  const handleLogin = async () => {
    try {
      await login('demo@example.com', 'password');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor}]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          Welcome to MyRnApp - Testing Hot Reload!
        </Text>
        <Text style={styles.subtitle}>Monorepo Architecture Demo</Text>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Status</Text>
          <Text style={styles.cardText}>
            {isLoggedIn ? `Logged in as: ${displayName}` : 'Not logged in'}
          </Text>
          {user && <Text style={styles.cardText}>Email: {user.email}</Text>}
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Actions</Text>
          {isLoggedIn ? (
            <Button title="Logout" onPress={handleLogout} variant="secondary" />
          ) : (
            <Button
              title="Demo Login"
              onPress={handleLogin}
              variant="primary"
            />
          )}
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Architecture</Text>
          <Text style={styles.cardText}>
            This app demonstrates the Monorepo architecture with:
          </Text>
          <Text style={styles.bulletPoint}>
            • Shared state management (MST + MobX)
          </Text>
          <Text style={styles.bulletPoint}>• Cross-platform components</Text>
          <Text style={styles.bulletPoint}>• TypeScript throughout</Text>
          <Text style={styles.bulletPoint}>• React Navigation</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  bulletPoint: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
    marginBottom: 4,
  },
});
export const HomeScreen = observer(HomeScreenCom);

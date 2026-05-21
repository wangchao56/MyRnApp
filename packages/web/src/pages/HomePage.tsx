import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Button, useAuth, colors } from '@myapp/shared';

export const HomePage: React.FC = () => {
  const { isLoggedIn, displayName, login, logout } = useAuth();

  const handleLogin = async () => {
    try {
      await login('demo@example.com', 'password');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome to MyRnApp</Text>
      <Text style={styles.subtitle}>Web Application</Text>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Status</Text>
        <Text style={styles.cardText}>
          {isLoggedIn ? `Logged in as: ${displayName}` : 'Not logged in'}
        </Text>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Actions</Text>
        {isLoggedIn ? (
          <Button title="Logout" onPress={logout} variant="secondary" />
        ) : (
          <Button title="Demo Login" onPress={handleLogin} variant="primary" />
        )}
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Architecture</Text>
        <Text style={styles.cardText}>
          This web app demonstrates the Monorepo architecture with:
        </Text>
        <Text style={styles.bulletPoint}>• Shared state management (MST + MobX)</Text>
        <Text style={styles.bulletPoint}>• Cross-platform components</Text>
        <Text style={styles.bulletPoint}>• TypeScript throughout</Text>
        <Text style={styles.bulletPoint}>• React Router for navigation</Text>
        <Text style={styles.bulletPoint}>• React Native Web</Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, useLocation } from 'react-router-dom';
import { colors } from '@myapp/shared';

export const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        <Link to="/" style={styles.brand}>
          <Text style={styles.brandText}>MyRnApp</Text>
        </Link>
        <View style={styles.links}>
          <Link
            to="/"
            style={[styles.link, isActive('/') && styles.linkActive]}
          >
            <Text style={[styles.linkText, isActive('/') && styles.linkTextActive]}>
              Home
            </Text>
          </Link>
          <Link
            to="/profile"
            style={[styles.link, isActive('/profile') && styles.linkActive]}
          >
            <Text style={[styles.linkText, isActive('/profile') && styles.linkTextActive]}>
              Profile
            </Text>
          </Link>
          <Link
            to="/settings"
            style={[styles.link, isActive('/settings') && styles.linkActive]}
          >
            <Text style={[styles.linkText, isActive('/settings') && styles.linkTextActive]}>
              Settings
            </Text>
          </Link>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    textDecoration: 'none',
  },
  brandText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  links: {
    flexDirection: 'row',
    gap: 16,
  },
  link: {
    textDecoration: 'none',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  linkActive: {
    backgroundColor: colors.surface,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  linkTextActive: {
    color: colors.primary,
  },
});

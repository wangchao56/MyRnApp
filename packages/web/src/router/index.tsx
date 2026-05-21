import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { ProfilePage } from '../pages/ProfilePage';
import { SettingsPage } from '../pages/SettingsPage';
import { Navigation } from './Navigation';

export const Router: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <Navigation />
      <View style={styles.content}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </View>
    </View>
  );
};

const styles = {
  content: {
    flex: 1 as const,
    padding: 16 as const,
  },
};

import { View } from 'react-native';

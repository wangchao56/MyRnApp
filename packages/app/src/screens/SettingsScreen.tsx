import React from 'react';
import {View, Text, StyleSheet, Switch} from 'react-native';
import {Card, Button, useTheme, colors} from '@myapp/shared';
import {observer} from 'mobx-react-lite';
import {SafeAreaView} from 'react-native-safe-area-context';

const SettingsScreenCom: React.FC = () => {
  const {isDarkMode, toggleTheme} = useTheme();

  const backgroundColor = isDarkMode ? colors.darkGray : colors.background;

  return (
    <SafeAreaView style={[styles.container, {backgroundColor}]}>
      <View style={styles.content}>
        <Text style={styles.title}>设置页</Text>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Appearance</Text>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>暗黑主题</Text>
              <Text style={styles.settingDescription}>{isDarkMode ? 'On' : 'Off'}</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{false: colors.lightGray, true: colors.primary}}
              thumbColor={colors.white}
            />
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>About</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Version</Text>
            <Text style={styles.settingValue}>1.0.0</Text>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Architecture</Text>
            <Text style={styles.settingValue}>Monorepo</Text>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>State Management</Text>
            <Text style={styles.settingValue}>MST + MobX</Text>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Actions</Text>
          <Button title="Reset App Data" onPress={() => {}} variant="danger" />
        </Card>
      </View>
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
    marginBottom: 24,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  settingLabel: {
    fontSize: 16,
    color: colors.text,
  },
  settingDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  settingValue: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});

export const SettingsScreen = observer(SettingsScreenCom);

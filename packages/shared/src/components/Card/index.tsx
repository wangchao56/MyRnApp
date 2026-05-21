import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useTheme, colors, spacing } from '../../';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

const CardComponent: React.FC<CardProps> = ({
  children,
  style,
  padding = 'medium',
}) => {
  const { isDarkMode } = useTheme();
  
  const paddingStyles = {
    none: {},
    small: { padding: spacing.sm },
    medium: { padding: spacing.md },
    large: { padding: spacing.lg },
  };

  const cardStyle = {
    backgroundColor: isDarkMode ? colors.surfaceDark : colors.white,
    shadowColor: isDarkMode ? colors.white : colors.black,
  };

  return (
    <View style={[styles.card, cardStyle, paddingStyles[padding], style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export const Card = observer(CardComponent);

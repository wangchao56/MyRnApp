import React from 'react';
import {View, ViewProps, ViewStyle} from 'react-native';
import {observer} from 'mobx-react-lite';
import {createStyleSheet, useStyles} from '../../theme';

interface CardProps extends Partial<ViewProps> {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

const cardStyles = createStyleSheet(theme => ({
  card: {
    borderRadius: theme.borderRadius.lg,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: theme.colors.surface,
    shadowColor: theme.colors.black,
  },
  paddingNone: {},
  paddingSmall: {padding: theme.spacing.sm},
  paddingMedium: {padding: theme.spacing.md},
  paddingLarge: {padding: theme.spacing.lg},
}));

const CardComponent: React.FC<CardProps> = ({children, style, padding = 'medium', ...rest}) => {
  const styles = useStyles(cardStyles);

  const paddingMap = {
    none: styles.paddingNone,
    small: styles.paddingSmall,
    medium: styles.paddingMedium,
    large: styles.paddingLarge,
  };

  return (
    <View style={[styles.card, paddingMap[padding], style]} {...rest}>
      {children}
    </View>
  );
};

export const Card = observer(CardComponent);

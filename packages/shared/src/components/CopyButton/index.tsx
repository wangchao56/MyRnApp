import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  Alert,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { createStyleSheet, useStyles } from '../../theme';
import { useClipboard } from '../../hooks';

interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  onCopied?: () => void;
  showAlert?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

const copyButtonStyles = createStyleSheet((theme) => ({
  button: {
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  small: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  medium: {
    paddingVertical: theme.spacing.sm + 4,
    paddingHorizontal: theme.spacing.lg,
  },
  large: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.medium as any,
  },
  outlineText: {
    color: theme.colors.primary,
  },
}));

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  label = '复制',
  copiedLabel = '已复制',
  onCopied,
  showAlert = false,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
  disabled = false,
}) => {
  const styles = useStyles(copyButtonStyles);
  const { setString } = useClipboard();
  const [isCopied, setIsCopied] = useState(false);

  const handlePress = async () => {
    if (disabled) return;

    try {
      await setString(text);
      setIsCopied(true);
      onCopied?.();

      if (showAlert) {
        Alert.alert('提示', '已复制到剪贴板');
      }

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      if (showAlert) {
        Alert.alert('错误', '复制失败');
      }
    }
  };

  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.text,
          isOutline && styles.outlineText,
          textStyle,
        ]}
      >
        {isCopied ? copiedLabel : label}
      </Text>
    </TouchableOpacity>
  );
};

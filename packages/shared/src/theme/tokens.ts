export const COLORS = {
  primary: '#007AFF',
  primaryDark: '#0066CC',
  secondary: '#5856D6',
  background: '#FFFFFF',
  backgroundDark: '#1C1C1E',
  surface: '#F5F5F7',
  surfaceDark: '#2C2C2E',
  text: '#1C1C1E',
  textLight: '#8E8E93',
  textDark: '#8E8E93',
  textSecondary: '#8E8E93',
  border: '#E5E5EA',
  borderDark: '#3A3A3C',
  gray: '#8E8E93',
  lightGray: '#E5E5EA',
  darkGray: '#1C1C1E',
  white: '#FFFFFF',
  black: '#000000',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
};

export const getThemedColors = (isDarkMode: boolean) => ({
  primary: COLORS.primary,
  primaryDark: COLORS.primaryDark,
  secondary: COLORS.secondary,
  background: isDarkMode ? COLORS.backgroundDark : COLORS.background,
  surface: isDarkMode ? COLORS.surfaceDark : COLORS.surface,
  text: isDarkMode ? COLORS.white : COLORS.text,
  textLight: COLORS.textLight,
  textSecondary: isDarkMode ? COLORS.textDark : COLORS.textSecondary,
  border: isDarkMode ? COLORS.borderDark : COLORS.border,
  gray: COLORS.gray,
  lightGray: COLORS.lightGray,
  darkGray: COLORS.darkGray,
  white: COLORS.white,
  black: COLORS.black,
  success: COLORS.success,
  warning: COLORS.warning,
  error: COLORS.error,
});

export const SPACING = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
  xxxl: 32,
};

export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px rgba(0,0,0,0.05)',
  md: '0 4px 6px rgba(0,0,0,0.1)',
  lg: '0 8px 16px rgba(0,0,0,0.12)',
  xl: '0 16px 24px rgba(0,0,0,0.14)',
};

export type ThemedColors = ReturnType<typeof getThemedColors>;

import React, { useState, useCallback, useRef } from 'react';
import {
  Image as RNImage,
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Animated,
  Platform,
  ImageStyle,
  ViewStyle,
} from 'react-native';
import { createStyleSheet, useStyles } from '../../theme';

export type ImageSource = string | { uri: string } | number;
export type ImagePlaceholderType = 'none' | 'loading' | 'blur' | 'color';

export interface ImageProps {
  source: ImageSource;
  style?: ImageStyle;
  containerStyle?: ViewStyle;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center' | 'repeat';
  placeholder?: ImageSource | null;
  placeholderType?: ImagePlaceholderType;
  placeholderColor?: string;
  errorIcon?: React.ReactNode;
  onLoad?: () => void;
  onError?: (error: any) => void;
  onPress?: () => void;
  enablePreview?: boolean;
  previewBackgroundColor?: string;
  fadeIn?: boolean;
  fadeInDuration?: number;
  lazyLoad?: boolean;
  maxRetryCount?: number;
  retryInterval?: number;
  aspectRatio?: number;
  priority?: 'low' | 'normal' | 'high';
  fallbackSource?: ImageSource;
}

const defaultImageStyles = createStyleSheet((theme) => ({
  container: {
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.lightGray,
  },
  errorText: {
    color: theme.colors.gray,
    fontSize: theme.fontSizes.sm,
    marginTop: theme.spacing.xs,
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    padding: 10,
    zIndex: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
}));

export const Image: React.FC<ImageProps> = ({
  source,
  style,
  containerStyle,
  resizeMode = 'cover',
  placeholder = null,
  placeholderType = 'loading',
  placeholderColor,
  errorIcon,
  onLoad,
  onError,
  onPress,
  enablePreview = false,
  previewBackgroundColor = 'rgba(0, 0, 0, 0.9)',
  fadeIn = true,
  fadeInDuration = 300,
  lazyLoad = false,
  maxRetryCount = 3,
  retryInterval = 1000,
  aspectRatio,
  priority = 'normal',
  fallbackSource,
}) => {
  const styles = useStyles(defaultImageStyles);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const fadeAnim = useRef(new Animated.Value(fadeIn ? 0 : 1)).current;
  const mountedRef = useRef(true);

  const resolveSource = useCallback((src: ImageSource): any => {
    if (!src) {return null;}
    if (typeof src === 'string') {return { uri: src };}
    if (typeof src === 'object' && 'uri' in src) {return src;}
    return src;
  }, []);

  const resolvedSource = resolveSource(source);

  const handleLoad = useCallback(() => {
    if (!mountedRef.current) {return;}

    setIsLoading(false);
    setHasError(false);
    onLoad?.();

    if (fadeIn) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: fadeInDuration,
        useNativeDriver: true,
      }).start();
    }
  }, [fadeIn, fadeInDuration, fadeAnim, onLoad]);

  const handleError = useCallback(
    (error: any) => {
      if (!mountedRef.current) {return;}

      if (retryCount < maxRetryCount) {
        const timer = setTimeout(() => {
          if (mountedRef.current) {
            setRetryCount((prev) => prev + 1);
          }
        }, retryInterval);
        return () => clearTimeout(timer);
      }

      setIsLoading(false);
      setHasError(true);
      onError?.(error);

      if (fadeIn) {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: fadeInDuration,
          useNativeDriver: true,
        }).start();
      }
    },
    [retryCount, maxRetryCount, retryInterval, fadeIn, fadeInDuration, fadeAnim, onError]
  );

  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  React.useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setRetryCount(0);
    if (fadeIn) {
      fadeAnim.setValue(0);
    }
  }, [source, fadeIn, fadeAnim]);

  const renderPlaceholder = () => {
    if (placeholderType === 'none' || !isLoading) {return null;}

    if (placeholder) {
      return (
        <RNImage
          source={resolveSource(placeholder)}
          style={[StyleSheet.absoluteFill, styles.image]}
          resizeMode={resizeMode}
          blurRadius={placeholderType === 'blur' ? 10 : 0}
        />
      );
    }

    if (placeholderType === 'loading') {
      return (
        <View
          style={[
            styles.placeholderContainer,
            placeholderColor ? { backgroundColor: placeholderColor } : undefined,
          ]}
        >
          <ActivityIndicator color={placeholderColor || '#999'} size="small" />
        </View>
      );
    }

    if (placeholderType === 'color' && placeholderColor) {
      return (
        <View
          style={[
            styles.placeholderContainer,
            { backgroundColor: placeholderColor },
          ]}
        />
      );
    }

    return null;
  };

  const renderError = () => {
    if (!hasError || isLoading) {return null;}

    if (fallbackSource) {
      return (
        <RNImage
          source={resolveSource(fallbackSource)}
          style={[styles.image, style]}
          resizeMode={resizeMode}
          onLoad={handleLoad}
        />
      );
    }

    return (
      <View style={styles.errorContainer}>
        {errorIcon || (
          <>
            <Text style={styles.errorText}>图片加载失败</Text>
          </>
        )}
      </View>
    );
  };

  const openPreview = () => {
    if (enablePreview) {
      setIsVisible(true);
    }
    onPress?.();
  };

  const closePreview = () => {
    setIsVisible(false);
  };

  const containerStyleWithAspectRatio = aspectRatio
    ? [{ aspectRatio }, containerStyle]
    : containerStyle;

  const content = (
    <View style={[styles.container, containerStyleWithAspectRatio]}>
      {!hasError && (
        <RNImage
          source={resolvedSource}
          style={[styles.image, style]}
          resizeMode={resizeMode}
          onLoad={handleLoad}
          onError={handleError}
          fadeDuration={fadeIn ? fadeInDuration : 0}
        />
      )}

      {renderPlaceholder()}
      {renderError()}

      {hasError && fadeIn && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { opacity: fadeAnim },
          ]}
          pointerEvents="none"
        />
      )}
    </View>
  );

  if (onPress || enablePreview) {
    return (
      <>
        <TouchableOpacity
          onPress={openPreview}
          activeOpacity={0.8}
          disabled={!onPress}
        >
          {content}
        </TouchableOpacity>

        <Modal
          visible={isVisible}
          transparent
          animationType="fade"
          onRequestClose={closePreview}
        >
          <View style={[styles.previewOverlay, { backgroundColor: previewBackgroundColor }]}>
            <TouchableOpacity style={styles.closeButton} onPress={closePreview}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            <RNImage
              source={resolvedSource}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        </Modal>
      </>
    );
  }

  return content;
};

export default Image;

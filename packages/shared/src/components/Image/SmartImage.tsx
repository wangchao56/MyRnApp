import React, { useState, useCallback, useRef, useEffect } from 'react';
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
  NativeSyntheticEvent,
  ImageErrorEventData,
  ImageLoadEventData,
} from 'react-native';
import { useStyles, createStyleSheet, colors } from '../../theme';

export interface SmartImageProps {
  source: string | { uri: string } | number;
  style?: ImageStyle;
  containerStyle?: ViewStyle;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  placeholder?: 'none' | 'loading' | 'skeleton';
  skeletonColor?: string;
  onLoad?: () => void;
  onError?: (error: any) => void;
  onPress?: () => void;
  enablePreview?: boolean;
  fadeIn?: boolean;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  lazyLoad?: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const smartImageStyles = createStyleSheet((theme) => ({
  container: {
    overflow: 'hidden',
    backgroundColor: theme.colors.lightGray,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  skeleton: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.lightGray,
  },
  skeletonAnimated: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.lightGray,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.lightGray,
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.lightGray,
  },
  errorIcon: {
    fontSize: 24,
  },
  errorText: {
    color: theme.colors.gray,
    fontSize: theme.fontSizes.sm,
    marginTop: theme.spacing.xs,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  previewImage: {
    width: screenWidth - 40,
    height: screenHeight - 150,
  },
}));

export const SmartImage: React.FC<SmartImageProps> = ({
  source,
  style,
  containerStyle,
  resizeMode = 'cover',
  placeholder = 'loading',
  skeletonColor,
  onLoad,
  onError,
  onPress,
  enablePreview = true,
  fadeIn = true,
  width,
  height,
  borderRadius = 0,
  lazyLoad = false,
}) => {
  const styles = useStyles(smartImageStyles);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(fadeIn ? 0 : 1)).current;
  const skeletonAnim = useRef(new Animated.Value(0)).current;
  const mountedRef = useRef(true);

  const resolveSource = useCallback((src: any) => {
    if (!src) {return null;}
    if (typeof src === 'string') {return { uri: src };}
    if (typeof src === 'object' && 'uri' in src) {return src;}
    return src;
  }, []);

  const resolvedSource = resolveSource(source);

  useEffect(() => {
    mountedRef.current = true;

    if (placeholder === 'skeleton') {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(skeletonAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(skeletonAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();

      return () => {
        mountedRef.current = false;
        animation.stop();
      };
    }

    return () => {
      mountedRef.current = false;
    };
  }, [placeholder, skeletonAnim]);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    if (fadeIn) {
      fadeAnim.setValue(0);
    }
  }, [source, fadeIn, fadeAnim]);

  const handleLoad = useCallback(
    (e: NativeSyntheticEvent<ImageLoadEventData>) => {
      if (!mountedRef.current) {return;}

      setIsLoading(false);
      onLoad?.();

      if (fadeIn) {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    },
    [fadeIn, fadeAnim, onLoad]
  );

  const handleError = useCallback(
    (e: NativeSyntheticEvent<ImageErrorEventData>) => {
      if (!mountedRef.current) {return;}

      setIsLoading(false);
      setHasError(true);
      onError?.(e.nativeEvent.error);

      if (fadeIn) {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    },
    [fadeIn, fadeAnim, onError]
  );

  const handlePress = () => {
    if (enablePreview && !hasError) {
      setIsPreviewVisible(true);
    }
    onPress?.();
  };

  const closePreview = () => {
    setIsPreviewVisible(false);
  };

  const containerDimensions = {
    width: (width ?? '100%') as any,
    height: (height ?? '100%') as any,
    borderRadius,
  };

  const renderLoadingPlaceholder = () => {
    if (!isLoading) {return null;}

    if (placeholder === 'skeleton') {
      const backgroundColor = skeletonAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [skeletonColor || '#E5E5EA', '#F5F5F7'],
      });

      return (
        <Animated.View
          style={[
            styles.skeletonAnimated,
            { backgroundColor },
          ]}
        />
      );
    }

    if (placeholder === 'loading') {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} size="small" />
        </View>
      );
    }

    return null;
  };

  const renderErrorPlaceholder = () => {
    if (!hasError || isLoading) {return null;}

    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>🖼️</Text>
        <Text style={styles.errorText}>加载失败</Text>
      </View>
    );
  };

  const imageContent = (
    <>
      {!hasError && (
        <Animated.Image
          source={resolvedSource}
          style={[
            styles.image,
            style,
            { opacity: fadeAnim },
          ]}
          resizeMode={resizeMode}
          onLoad={handleLoad}
          onError={handleError}
          loadingIndicatorSource={
            Platform.OS === 'android' && placeholder === 'loading'
              ? undefined
              : undefined
          }
          fadeDuration={fadeIn ? 250 : 0}
        />
      )}

      {renderLoadingPlaceholder()}
      {renderErrorPlaceholder()}
    </>
  );

  const imageContainer = (
    <View style={[styles.container, containerDimensions, containerStyle]}>
      {imageContent}
    </View>
  );

  if (onPress || enablePreview) {
    return (
      <>
        <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
          {imageContainer}
        </TouchableOpacity>

        <Modal
          visible={isPreviewVisible}
          transparent
          animationType="fade"
          onRequestClose={closePreview}
          statusBarTranslucent
        >
          <View style={styles.previewContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={closePreview}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

            <RNImage
              source={resolvedSource}
              style={styles.previewImage}
              resizeMode="contain"
            />
          </View>
        </Modal>
      </>
    );
  }

  return imageContainer;
};

export default SmartImage;

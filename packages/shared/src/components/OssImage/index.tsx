import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Image as RNImage,
  ImageBackground,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Platform,
  ImageStyle,
  ViewStyle,
} from 'react-native';
import { useStyles, createStyleSheet } from '../../theme';
import { processSource, extractSizeFromStyle, type ImageSource, type OssResizeOptions } from '../../utils/image';

export interface AliOssImageProps {
  source: ImageSource;
  style?: ImageStyle;
  containerStyle?: ViewStyle;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  isPreview?: boolean;
  skipSize?: boolean;
  notChangeSource?: boolean;
  customSuffix?: string;
  placeholder?: 'loading' | 'skeleton' | 'none';
  skeletonColor?: string;
  fallbackSource?: ImageSource;
  onLoad?: () => void;
  onError?: (error: any) => void;
  onPress?: () => void;
  fadeIn?: boolean;
  fadeInDuration?: number;
  resizeOptions?: OssResizeOptions;
}

const defaultAliOssImageStyles = createStyleSheet((theme) => ({
  container: {
    overflow: 'hidden',
    backgroundColor: theme.colors.lightGray,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  skeletonContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.lightGray,
  },
  skeletonAnimation: {
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
    marginBottom: 4,
  },
  errorText: {
    color: theme.colors.gray,
    fontSize: theme.fontSizes.sm,
  },
}));

export const AliOssImage: React.FC<AliOssImageProps> = ({
  source,
  style,
  containerStyle,
  resizeMode = 'cover',
  isPreview = false,
  skipSize = false,
  notChangeSource = false,
  customSuffix,
  placeholder = 'loading',
  skeletonColor,
  fallbackSource,
  onLoad,
  onError,
  onPress,
  fadeIn = true,
  fadeInDuration = 250,
  resizeOptions,
}) => {
  const styles = useStyles(defaultAliOssImageStyles);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const fadeAnim = useRef(new Animated.Value(fadeIn ? 0 : 1)).current;
  const skeletonAnim = useRef(new Animated.Value(0)).current;
  const mountedRef = useRef(true);

  const { width, height } = extractSizeFromStyle(style || {});

  const resolvedSource = processSource(source, width, height, isPreview, {
    skipSize,
    notChangeSource,
    customSuffix,
    resizeOptions,
  });

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
    (e: any) => {
      if (!mountedRef.current) {return;}

      setIsLoading(false);
      onLoad?.();

      if (fadeIn) {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: fadeInDuration,
          useNativeDriver: true,
        }).start();
      }
    },
    [fadeIn, fadeInDuration, fadeAnim, onLoad]
  );

  const handleError = useCallback(
    (e: any) => {
      if (!mountedRef.current) {return;}

      setIsLoading(false);
      setHasError(true);
      onError?.(e);

      if (fadeIn) {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: fadeInDuration,
          useNativeDriver: true,
        }).start();
      }
    },
    [fadeIn, fadeInDuration, fadeAnim, onError]
  );

  const renderLoadingPlaceholder = () => {
    if (!isLoading) {return null;}

    if (placeholder === 'skeleton') {
      const backgroundColor = skeletonAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [skeletonColor || '#E5E5EA', '#F5F5F1'],
      });

      return (
        <Animated.View style={[styles.skeletonAnimation, { backgroundColor }]} />
      );
    }

    if (placeholder === 'loading') {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#999" size="small" />
        </View>
      );
    }

    return null;
  };

  const renderErrorPlaceholder = () => {
    if (!hasError || isLoading) {return null;}

    if (fallbackSource) {
      const fallbackResolved = processSource(fallbackSource, width, height, isPreview, {
        skipSize,
        notChangeSource,
        customSuffix,
        resizeOptions,
      });

      return (
        <RNImage
          source={fallbackResolved as any}
          style={[styles.image, style]}
          resizeMode={resizeMode}
        />
      );
    }

    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>🖼️</Text>
        <Text style={styles.errorText}>加载失败</Text>
      </View>
    );
  };

  const renderImage = () => {
    if (Platform.OS === 'web') {
      return (
        <ImageBackground
          source={resolvedSource as any}
          style={[styles.image, style, fadeIn && { opacity: fadeAnim }]}
          imageStyle={style}
          resizeMode={resizeMode}
          onLoad={handleLoad as any}
          onError={handleError as any}
        >
          {renderLoadingPlaceholder()}
          {renderErrorPlaceholder()}
        </ImageBackground>
      );
    }

    return (
      <>
        <Animated.Image
          source={resolvedSource as any}
          style={[
            styles.image,
            style,
            fadeIn && { opacity: fadeAnim },
          ]}
          resizeMode={resizeMode}
          onLoad={handleLoad}
          onError={handleError}
          fadeDuration={fadeIn ? fadeInDuration : 0}
        />

        {isLoading && placeholder !== 'none' && renderLoadingPlaceholder()}
        {hasError && renderErrorPlaceholder()}
      </>
    );
  };

  const container = (
    <View style={[styles.container, containerStyle]}>
      {renderImage()}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {container}
      </TouchableOpacity>
    );
  }

  return container;
};

export default AliOssImage;

export { AliOssImage as OssImage };

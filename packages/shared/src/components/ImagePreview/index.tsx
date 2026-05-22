import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Image as RNImage,
  Animated,
  ScrollView,
  Platform,
} from 'react-native';
import { useStyles, createStyleSheet } from '../../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface ImagePreviewProps {
  visible: boolean;
  images: Array<string | { uri: string } | number>;
  initialIndex?: number;
  onClose: () => void;
  backgroundColor?: string;
  closeButtonStyle?: any;
  closeButtonTextStyle?: any;
  showIndicator?: boolean;
}

const defaultPreviewStyles = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH - 40,
    height: SCREEN_HEIGHT - 150,
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '300',
    lineHeight: 28,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  prevButton: {
    left: 10,
  },
  nextButton: {
    right: 10,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorText: {
    color: '#fff',
    fontSize: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },
}));

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  visible,
  images,
  initialIndex = 0,
  onClose,
  backgroundColor,
  closeButtonStyle,
  closeButtonTextStyle,
  showIndicator = true,
}) => {
  const styles = useStyles(defaultPreviewStyles);
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // 当 visible 或 initialIndex 变化时重置状态
  useEffect(() => {
    if (visible) {
      setCurrentIndex(initialIndex);
      // 滚动到指定位置
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: initialIndex * SCREEN_WIDTH,
          animated: false,
        });
      }, 10);
    }
  }, [visible, initialIndex]);

  const resolveSource = (source: string | { uri: string } | number) => {
    if (!source) return null;
    if (typeof source === 'string') return { uri: source };
    if (typeof source === 'number') return source;
    return source;
  };

  const handleClose = () => {
    onClose();
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const index = Math.round(contentOffset.x / SCREEN_WIDTH);
    if (index !== currentIndex && index >= 0 && index < images.length) {
      setCurrentIndex(index);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      scrollViewRef.current?.scrollTo({
        x: newIndex * SCREEN_WIDTH,
        animated: true,
      });
    }
  };

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      scrollViewRef.current?.scrollTo({
        x: newIndex * SCREEN_WIDTH,
        animated: true,
      });
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={[styles.container, backgroundColor ? { backgroundColor } : undefined]}>
        <TouchableOpacity style={[styles.closeButton, closeButtonStyle]} onPress={handleClose}>
          <Text style={[styles.closeButtonText, closeButtonTextStyle]}>×</Text>
        </TouchableOpacity>

        {/* 上一张按钮 */}
        {images.length > 1 && currentIndex > 0 && (
          <TouchableOpacity style={[styles.navButton, styles.prevButton]} onPress={goToPrev}>
            <Text style={styles.navButtonText}>‹</Text>
          </TouchableOpacity>
        )}

        {/* 下一张按钮 */}
        {images.length > 1 && currentIndex < images.length - 1 && (
          <TouchableOpacity style={[styles.navButton, styles.nextButton]} onPress={goToNext}>
            <Text style={styles.navButtonText}>›</Text>
          </TouchableOpacity>
        )}

        {/* 图片滚动列表 */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollContainer}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
        >
          {images.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              <RNImage
                source={resolveSource(image) || undefined}
                style={styles.image}
              />
            </View>
          ))}
        </ScrollView>

        {/* 位置指示器 */}
        {showIndicator && images.length > 1 && (
          <View style={styles.indicatorContainer}>
            <Text style={styles.indicatorText}>{`${currentIndex + 1} / ${images.length}`}</Text>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default ImagePreview;

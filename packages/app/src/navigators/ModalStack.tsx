import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainerRef} from '@react-navigation/native';
import {View, Pressable, ActivityIndicator, Text, StyleSheet} from 'react-native';

// ============ 1. 定义所有 Modal 页面类型 ============

export type ModalStackParamList = {
  AlertModal: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    danger?: boolean; // 危险操作（红色按钮）
  };
  BottomSheetModal: {
    title: string;
    options: Array<{
      label: string;
      value: string;
      icon?: string;
      danger?: boolean;
    }>;
    onSelect: (value: string) => void;
  };
  ImageViewerModal: {
    images: string[];
    initialIndex?: number;
  };
  LoadingModal: {
    text?: string;
  };
  // 添加更多 Modal...
};

const Stack = createNativeStackNavigator<ModalStackParamList>();

// ============ 2. 全局导航引用（用于编程式打开） ============

export const modalNavigationRef = React.createRef<NavigationContainerRef<ModalStackParamList>>();

// ============ 3. 通用打开/关闭方法 ============

export const ModalService = {
  open: <T extends keyof ModalStackParamList>(name: T, params: ModalStackParamList[T]) => {
    modalNavigationRef.current?.navigate(name as string, params as any);
  },

  close: () => {
    modalNavigationRef.current?.goBack();
  },

  closeAll: () => {
    modalNavigationRef.current?.resetRoot();
  },
};

export function ModalStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        presentation: 'transparentModal',
        animation: 'fade',
        headerShown: false,
        contentStyle: {backgroundColor: 'transparent'},
      }}>
      <Stack.Screen name="AlertModal" component={AlertModal} />
      <Stack.Screen name="LoadingModal" component={LoadingModal} />
      <Stack.Screen name="ImageViewerModal" component={ImageViewerModal} />
      <Stack.Screen name="BottomSheetModal" component={BottomSheetModal} />
    </Stack.Navigator>
  );
}

// ========== Modal 页面组件 ==========

function AlertModal({route}: any) {
  const {title, message, confirmText = '确认', cancelText = '取消', onConfirm, onCancel, danger} = route.params;

  const handleConfirm = () => {
    onConfirm?.();
    ModalService.close();
  };

  const handleCancel = () => {
    onCancel?.();
    ModalService.close();
  };

  return (
    <View style={styles.overlay}>
      <Pressable style={StyleSheet.absoluteFill} onPress={handleCancel} />
      <View style={styles.alertBox}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.buttonRow}>
          <Pressable style={[styles.button, styles.cancelBtn]} onPress={handleCancel}>
            <Text style={styles.cancelText}>{cancelText}</Text>
          </Pressable>
          <Pressable style={[styles.button, danger && styles.dangerBtn]} onPress={handleConfirm}>
            <Text style={[styles.confirmText, danger && styles.dangerText]}>{confirmText}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function LoadingModal({route}: any) {
  const {text = '加载中...'} = route.params;
  return (
    <View style={styles.overlay}>
      <View style={styles.loadingBox}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>{text}</Text>
      </View>
    </View>
  );
}

function ImageViewerModal({route}: any) {
  const {images, initialIndex = 0} = route.params;
  return (
    <View style={[styles.overlay, {backgroundColor: '#000'}]}>
      <Pressable style={styles.closeBtn} onPress={ModalService.close}>
        <Text style={{color: '#fff', fontSize: 16}}>✕ 关闭</Text>
      </Pressable>
      <Text style={{color: '#fff'}}>Image: {images[initialIndex]}</Text>
    </View>
  );
}

function BottomSheetModal({route}: any) {
  const {title, options, onSelect} = route.params;

  return (
    <View style={styles.overlay}>
      <Pressable style={StyleSheet.absoluteFill} onPress={ModalService.close} />
      <View style={styles.sheetBox}>
        <Text style={styles.sheetTitle}>{title}</Text>
        {options.map((opt: any) => (
          <Pressable
            key={opt.value}
            style={styles.sheetItem}
            onPress={() => {
              onSelect(opt.value);
              ModalService.close();
            }}>
            <Text style={[styles.sheetItemText, opt.danger && styles.dangerText]}>{opt.label}</Text>
          </Pressable>
        ))}
        <Pressable style={[styles.sheetItem, styles.cancelSheetItem]} onPress={ModalService.close}>
          <Text style={styles.cancelText}>取消</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ========== 样式 ==========

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  // Alert
  alertBox: {
    width: 300,
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 16,
    alignItems: 'center',
  },
  title: {fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#212121'},
  message: {fontSize: 14, color: '#666', marginBottom: 24, textAlign: 'center', lineHeight: 20},
  buttonRow: {flexDirection: 'row', gap: 12, width: '100%'},
  button: {flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center'},
  cancelBtn: {backgroundColor: '#F5F5F5'},
  dangerBtn: {backgroundColor: '#FFEBEE'},
  confirmText: {fontSize: 16, fontWeight: '600', color: '#1E88E5'},
  cancelText: {fontSize: 16, color: '#666'},
  dangerText: {color: '#D32F2F'},
  // Loading
  loadingBox: {padding: 32, backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: 12, alignItems: 'center'},
  loadingText: {color: 'white', marginTop: 16, fontSize: 14},
  // Image Viewer
  closeBtn: {position: 'absolute', top: 50, right: 20, zIndex: 10},
  // Bottom Sheet
  sheetBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  sheetTitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sheetItem: {paddingVertical: 16, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F5F5F5'},
  sheetItemText: {fontSize: 16, color: '#212121'},
  cancelSheetItem: {marginTop: 8, borderTopWidth: 8, borderTopColor: '#F5F5F5'},
});

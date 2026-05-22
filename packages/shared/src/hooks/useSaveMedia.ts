import {useState, useCallback} from 'react';
import {Platform, PermissionsAndroid} from 'react-native';

// Dynamic import for CameraRoll - only works on Native
let CameraRollModule: any;
if (Platform.OS !== 'web') {
  try {
    CameraRollModule = require('@react-native-camera-roll/camera-roll');
  } catch {
    // Ignore on web
  }
}

const CameraRoll = CameraRollModule?.CameraRoll;

export type MediaType = 'photo' | 'video';

export interface SaveMediaOptions {
  type?: MediaType;
  album?: string;
}

export interface UseSaveMediaReturn {
  saveMedia: (uri: string, options?: SaveMediaOptions) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  reset: () => void;
  isSupported: boolean;
}

export const useSaveMedia = (): UseSaveMediaReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Check if save media is supported
  const isSupported = Platform.OS !== 'web' && !!CameraRoll;

  const requestAndroidPermissions = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ];

      if (Platform.Version >= 33) {
        permissions.push(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
        permissions.push(PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO);
      }

      const granted = await PermissionsAndroid.requestMultiple(permissions);

      const allGranted = Object.values(granted).every(
        (result: any) => result === PermissionsAndroid.RESULTS.GRANTED,
      );

      return allGranted;
    } catch (err) {
      console.warn('Permission error:', err);
      return false;
    }
  };

  const saveMedia = useCallback(
    async (uri: string, options: SaveMediaOptions = {}) => {
      // Not supported on web
      if (!isSupported) {
        setError('Save media is not supported on web');
        return;
      }

      setIsLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const hasPermission = await requestAndroidPermissions();
        if (!hasPermission) {
          throw new Error('Permission denied');
        }

        await CameraRoll.save(uri, {
          type: options.type || 'photo',
          album: options.album,
        });

        setSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save media');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [isSupported],
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return {
    saveMedia,
    isLoading,
    error,
    success,
    reset,
    isSupported,
  };
};

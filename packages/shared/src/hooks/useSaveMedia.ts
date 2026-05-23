import { useState, useCallback } from 'react';
import { Platform } from 'react-native';

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
}

const downloadToBrowser = async (uri: string, filename: string) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Download failed:', err);
    throw err;
  }
};

export const useSaveMedia = (): UseSaveMediaReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const saveMedia = useCallback(
    async (uri: string, options: SaveMediaOptions = {}) => {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const filename = options.type === 'video' ? 'media.mp4' : 'image.png';
        await downloadToBrowser(uri, filename);
        setSuccess(true);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to save media';
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
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
  };
};

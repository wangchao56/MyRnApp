import {useCallback, useState} from 'react';

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

  const saveMedia = useCallback(async () => {
    setError('Save media is not supported on web');
  }, []);

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
    isSupported: false,
  };
};

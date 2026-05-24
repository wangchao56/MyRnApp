import { useState, useEffect, useCallback } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';

export interface UseClipboardReturn {
  data: string | null;
  setString: (text: string) => Promise<void>;
  getString: () => Promise<string | null>;
  hasString: () => Promise<boolean>;
}

export const useClipboard = (): UseClipboardReturn => {
  const [data, setData] = useState<string | null>(null);

  const getString = useCallback(async (): Promise<string | null> => {
    try {
      const text = await Clipboard.getString();
      setData(text);
      return text;
    } catch (error) {
      console.error('Failed to get clipboard content:', error);
      return null;
    }
  }, []);

  const setString = useCallback(async (text: string): Promise<void> => {
    try {
      await Clipboard.setString(text);
      setData(text);
    } catch (error) {
      console.error('Failed to set clipboard content:', error);
      throw error;
    }
  }, []);

  const hasString = useCallback(async (): Promise<boolean> => {
    try {
      return await Clipboard.hasString();
    } catch (error) {
      console.error('Failed to check clipboard:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    getString();
  }, [getString]);

  return {
    data,
    setString,
    getString,
    hasString,
  };
};

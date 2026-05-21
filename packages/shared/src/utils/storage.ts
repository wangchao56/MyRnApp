import { Platform } from 'react-native';

type StorageValue = string | number | boolean | object | null;

interface StorageAdapter {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  clear: () => Promise<void>;
}

const webStorage: StorageAdapter = {
  getItem: async (key) => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: async (key, value) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    }
  },
  removeItem: async (key) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    }
  },
  clear: async () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  },
};

let nativeStorage: StorageAdapter | null = null;

const getNativeStorage = async (): Promise<StorageAdapter> => {
  if (!nativeStorage) {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      nativeStorage = {
        getItem: (key) => AsyncStorage.getItem(key),
        setItem: (key, value) => AsyncStorage.setItem(key, value),
        removeItem: (key) => AsyncStorage.removeItem(key),
        clear: () => AsyncStorage.clear(),
      };
    } catch (error) {
      console.warn('AsyncStorage not available, using mock storage');
      nativeStorage = {
        getItem: async () => null,
        setItem: async () => {},
        removeItem: async () => {},
        clear: async () => {},
      };
    }
  }
  return nativeStorage;
};

export const Storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return webStorage.getItem(key);
    }
    const storage = await getNativeStorage();
    return storage.getItem(key);
  },

  async setItem(key: string, value: StorageValue): Promise<void> {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    if (Platform.OS === 'web') {
      return webStorage.setItem(key, stringValue);
    }
    const storage = await getNativeStorage();
    return storage.setItem(key, stringValue);
  },

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      return webStorage.removeItem(key);
    }
    const storage = await getNativeStorage();
    return storage.removeItem(key);
  },

  async clear(): Promise<void> {
    if (Platform.OS === 'web') {
      return webStorage.clear();
    }
    const storage = await getNativeStorage();
    return storage.clear();
  },

  async getJSON<T>(key: string): Promise<T | null> {
    const value = await this.getItem(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  },
};

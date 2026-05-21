import { useEffect, useState, useContext, createContext } from 'react';
import { RootStore, RootStoreType, createRootStore } from '../models';

const StoreContext = createContext<RootStoreType | null>(null);

interface StoreProviderProps {
  children: React.ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const [store, setStore] = useState<RootStoreType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const rootStore = await createRootStore();
        setStore(rootStore);
      } catch (error) {
        console.error('Failed to initialize store:', error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  if (isLoading) {
    return null;
  }

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

export const useStore = (): RootStoreType => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return store;
};

export const useUserStore = () => {
  const store = useStore();
  return store.userStore;
};

export const useTheme = () => {
  const store = useStore();
  return {
    theme: store.theme,
    isDarkMode: store.isDarkMode,
    toggleTheme: () => store.toggleTheme(),
    setTheme: (theme: 'light' | 'dark') => store.setTheme(theme),
  };
};

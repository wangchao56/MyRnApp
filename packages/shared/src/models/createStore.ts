import { RootStore, RootStoreType, setupSnapshotListener } from './RootStore';
import { Storage } from '../utils/storage';

let store: RootStoreType | null = null;

export const createRootStore = async (): Promise<RootStoreType> => {
  if (store) return store;

  let initialSnapshot: any = undefined;
  try {
    initialSnapshot = await Storage.getJSON('rootStore');
    if (!initialSnapshot || typeof initialSnapshot !== 'object' || Array.isArray(initialSnapshot)) {
      console.warn('Invalid rootStore snapshot, using defaults');
      initialSnapshot = undefined;
    } else if (Object.keys(initialSnapshot).length === 0) {
      console.warn('Empty rootStore snapshot, using defaults');
      initialSnapshot = undefined;
    }
  } catch (error) {
    console.error('Failed to load rootStore from storage:', error);
    initialSnapshot = undefined;
  }

  store = RootStore.create(initialSnapshot);
  setupSnapshotListener(store);
  await store.loadTheme();
  await store.userStore.loadFromStorage();

  return store;
};

export const getStore = (): RootStoreType => {
  if (!store) {
    throw new Error('Store not initialized. Call createRootStore first.');
  }
  return store;
};

export const resetStore = () => {
  if (store) {
    store.reset();
  }
  store = null;
};

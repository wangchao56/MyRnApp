import { RootStore, RootStoreType } from './RootStore';
import { Storage } from '../utils/storage';

let store: RootStoreType | null = null;

export const createRootStore = async (): Promise<RootStoreType> => {
  if (store) return store;

  let initialSnapshot: any = undefined;
  try {
    initialSnapshot = await Storage.getJSON('rootStore');
  } catch (error) {
    console.error('Failed to load rootStore from storage:', error);
  }

  store = RootStore.create(initialSnapshot || {});
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

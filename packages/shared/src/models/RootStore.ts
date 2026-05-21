import {types, Instance, onSnapshot, flow} from 'mobx-state-tree';
import {UserStore} from './UserStore';
import {Storage} from '../utils/storage';

export const RootStore = types
  .model('RootStore', {
    userStore: types.optional(UserStore, {}),
    theme: types.optional(
      types.union(types.literal('light'), types.literal('dark')),
      'light',
    ),
  })
  .actions(self => ({
    setTheme(theme: 'light' | 'dark') {
      self.theme = theme;
      Storage.setItem('theme', theme);
    },

    loadTheme: flow(function* () {
      try {
        const savedTheme = yield Storage.getItem('theme');
        if (savedTheme === 'dark' || savedTheme === 'light') {
          self.theme = savedTheme;
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    }),

    reset() {
      self.theme = 'light';
      self.userStore.logout();
    },
  }))
  .actions(self => ({
    afterCreate() {
      self.loadTheme();
    },
    toggleTheme() {
      self.setTheme(self.theme === 'light' ? 'dark' : 'light');
    },
  }))
  .views(self => ({
    get isDarkMode() {
      return self.theme === 'dark';
    },
    get isAuthenticated() {
      return self.userStore.isLoggedIn;
    },
  }));

export type RootStoreType = Instance<typeof RootStore>;

export const setupSnapshotListener = (store: RootStoreType) => {
  onSnapshot(store, snapshot => {
    Storage.setItem('rootStore', snapshot).catch(err => {
      console.error('Failed to save rootStore:', err);
    });
  });
};

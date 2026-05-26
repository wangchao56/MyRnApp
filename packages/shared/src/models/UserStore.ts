import { types, flow, Instance } from 'mobx-state-tree';
import { UserModel } from './UserModel';
import { Storage } from '../utils/storage';

export const UserStore = types
  .model('UserStore', {
    user: types.maybe(UserModel),
    isLoggedIn: types.optional(types.boolean, false),
    isLoading: types.optional(types.boolean, false),
    error: types.maybe(types.string),
  })
  .actions((self) => ({
    login: flow(function* (email: string, password: string) {
      self.isLoading = true;
      self.error = undefined;
      try {
        const response = yield fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const userData = yield response.json();
        self.user = UserModel.create(userData);
        self.isLoggedIn = true;
        yield Storage.setItem('user', userData);
        if (userData.token) {
          yield Storage.setItem('token', userData.token);
        }
      } catch (err) {
        self.error = err instanceof Error ? err.message : 'Login failed';
        throw err;
      } finally {
        self.isLoading = false;
      }
    }),

    logout: flow(function* () {
      try {
        yield fetch('/api/auth/logout', { method: 'POST' });
      } catch {
      } finally {
        self.user = undefined;
        self.isLoggedIn = false;
        yield Storage.removeItem('user');
        yield Storage.removeItem('token');
      }
    }),

    loadFromStorage: flow(function* () {
      try {
        const userData = yield Storage.getJSON<any>('user');
        if (userData && userData.id) {
          self.user = UserModel.create(userData);
          self.isLoggedIn = true;
        }
      } catch (error) {
        console.error('Failed to load user from storage:', error);
      }
    }),

    updateUser: flow(function* (userData: Partial<Instance<typeof UserModel>>) {
      if (!self.user) {return;}
      Object.assign(self.user, userData);
      yield Storage.setItem('user', { ...self.user });
    }),

    setError(error: string | undefined) {
      self.error = error;
    },

    setLoading(loading: boolean) {
      self.isLoading = loading;
    },
  }))
  .views((self) => ({
    get displayName() {
      return self.user?.name || 'Guest';
    },
    get userEmail() {
      return self.user?.email || '';
    },
    get userAvatar() {
      return self.user?.avatar || null;
    },
  }));

export type UserStoreType = Instance<typeof UserStore>;

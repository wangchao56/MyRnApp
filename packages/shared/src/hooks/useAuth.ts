import { useUserStore } from './useStore';

export const useAuth = () => {
  const userStore = useUserStore();

  return {
    user: userStore.user,
    isLoggedIn: userStore.isLoggedIn,
    isLoading: userStore.isLoading,
    error: userStore.error,
    displayName: userStore.displayName,
    userEmail: userStore.userEmail,
    userAvatar: userStore.userAvatar,
    login: userStore.login,
    logout: userStore.logout,
    updateUser: userStore.updateUser,
  };
};

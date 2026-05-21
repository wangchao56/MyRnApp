export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  token?: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

import { api } from './api';
import { User } from '../types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    return api.post<LoginResponse>('/auth/login', data);
  },

  async logout(): Promise<void> {
    return api.post('/auth/logout');
  },

  async register(data: LoginRequest & { name: string }): Promise<LoginResponse> {
    return api.post<LoginResponse>('/auth/register', data);
  },

  async refreshToken(): Promise<{ token: string }> {
    return api.post('/auth/refresh');
  },
};

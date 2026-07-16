import { apiClient } from '@/lib/api-client';
import {
  AuthResponse,
  LoginDto,
  SignupDto,
  User,
  UpdateProfileDto,
} from '@/types';

export const authService = {
  async signup(data: SignupDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/signup', data);
    apiClient.setToken(response.accessToken);
    return response;
  },

  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/signin', data);
    apiClient.setToken(response.accessToken);
    return response;
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get<unknown>('/auth/me');
    return response as User;
  },

  async updateProfile(data: UpdateProfileDto): Promise<User> {
    const response = await apiClient.patch<unknown>('/auth/me', data);
    return response as User;
  },

  logout() {
    apiClient.setToken(null);
  },

  getToken(): string | null {
    return apiClient.getToken();
  },

  isAuthenticated(): boolean {
    return !!apiClient.getToken();
  },
};

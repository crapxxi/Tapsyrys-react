import { apiClient } from '@/lib/axios';
import type { JwtResponse, LoginRequest, RegUserRequest, UserResponse } from '@/types/api';

export const authService = {
  /** POST /api/v1/auth/register */
  register: async (data: RegUserRequest): Promise<UserResponse> => {
    const response = await apiClient.post<UserResponse>('/api/v1/auth/register', data);
    return response.data;
  },

  /** POST /api/v1/auth/login */
  login: async (data: LoginRequest): Promise<JwtResponse> => {
    const response = await apiClient.post<JwtResponse>('/api/v1/auth/login', data);
    return response.data;
  },

  /** GET /api/v1/auth/me */
  getMe: async (): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>('/api/v1/auth/me');
    return response.data;
  },
};

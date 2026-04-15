import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import type { JwtResponse, LoginRequest, UserResponse } from '@/types/api';

// ─── Login ───────────────────────────────────────────────────────────────────

export function useLogin() {
  const mutation = useMutation<JwtResponse, Error, LoginRequest>({
    mutationFn: authService.login,
    onSuccess: ({ token }) => {
      localStorage.setItem('token', token);
    },
  });

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
  };
}

// ─── Current user ────────────────────────────────────────────────────────────

export function useMe() {
  const { data, isLoading, isError, error } = useQuery<UserResponse, Error>({
    queryKey: ['auth', 'me'],
    queryFn: authService.getMe,
    retry: false,
  });

  return { data, isLoading, isError, error };
}

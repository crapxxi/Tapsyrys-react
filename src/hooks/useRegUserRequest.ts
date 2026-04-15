import { useMutation, type UseMutateFunction } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { authService } from '@/services/authService';
import type { RegUserRequest, UserResponse } from '@/types/api';

interface UseRegUserRequestResult {
  register: UseMutateFunction<UserResponse, Error, RegUserRequest, unknown>;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  data: UserResponse | undefined;
  reset: () => void;
}

/**
 * Custom hook for user registration.
 * Shows i18n toast on success / error.
 *
 * Usage:
 *   const { register, isLoading } = useRegUserRequest();
 *   register({ phone, email, password }, { onSuccess: () => navigate('/login') });
 */
export function useRegUserRequest(): UseRegUserRequestResult {
  const { t } = useTranslation();

  const mutation = useMutation<UserResponse, Error, RegUserRequest>({
    mutationFn: authService.register,
    onSuccess: () => {
      toast.success(t('auth.register.success'));
    },
    onError: (err) => {
      toast.error(err.message || t('errors.generic'));
    },
  });

  return {
    register: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

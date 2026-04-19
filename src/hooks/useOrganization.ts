import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { organizationService } from '@/services/organizationService';
import type { MyOrgResponse, OrganizationResponse, RegOrgRequest } from '@/types/api';

export const orgKeys = {
  all: ['organizations', 'all'] as const,
  me: ['organizations', 'me'] as const,
  byId: (id: number) => ['organizations', id] as const,
};

export function useAllOrganizations() {
  const { data, isLoading, isError, error } = useQuery<OrganizationResponse[], Error>({
    queryKey: orgKeys.all,
    queryFn: organizationService.getAll,
  });
  return { data, isLoading, isError, error };
}

export function useMyOrganization() {
  const { data, isLoading, isError, error } = useQuery<MyOrgResponse, Error>({
    queryKey: orgKeys.me,
    queryFn: organizationService.getMyOrganization,
    retry: false,
  });
  return { data, isLoading, isError, error };
}

export function useOrganizationById(id: number) {
  const { data, isLoading, isError, error } = useQuery<OrganizationResponse, Error>({
    queryKey: orgKeys.byId(id),
    queryFn: () => organizationService.getById(id),
    enabled: id > 0,
  });
  return { data, isLoading, isError, error };
}

interface CreateOrgVars { data: RegOrgRequest; logo?: File }

export function useCreateOrganization() {
  const queryClient = useQueryClient();
  const mutation = useMutation<OrganizationResponse, Error, CreateOrgVars>({
    mutationFn: ({ data, logo }) => organizationService.create(data, logo),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orgKeys.me });
    },
  });
  return {
    createOrganization: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
  };
}

export function useSetOrgLocation() {
  const queryClient = useQueryClient();
  const mutation = useMutation<void, Error, { lat: number; lon: number }>({
    mutationFn: ({ lat, lon }) => organizationService.setLocation(lat, lon),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orgKeys.me });
    },
  });
  return {
    setLocation: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
}

export function useAddUserToOrg() {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    OrganizationResponse,
    Error,
    { organizationId: number; phone: string }
  >({
    mutationFn: ({ organizationId, phone }) =>
      organizationService.addUser(organizationId, phone),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orgKeys.me });
    },
  });
  return {
    addUser: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}

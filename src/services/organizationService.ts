import { apiClient } from '@/lib/axios';
import type { OrganizationResponse, RegOrgRequest } from '@/types/api';

export const organizationService = {
  /** POST /api/v1/organizations */
  create: async (data: RegOrgRequest, logo?: File): Promise<OrganizationResponse> => {
    const fd = new FormData();
    const jsonBlob = new Blob([JSON.stringify(data)], {
      type: 'application/json',
    });
    fd.append('request', jsonBlob);
    if (logo) fd.append('logo', logo);
    const response = await apiClient.post<OrganizationResponse>('/api/v1/organizations', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /** GET /api/v1/organizations/all — admin only */
  getAll: async (): Promise<OrganizationResponse[]> => {
    const response = await apiClient.get<OrganizationResponse[]>('/api/v1/organizations/all');
    return response.data;
  },

  /** GET /api/v1/organizations/me */
  getMyOrganization: async (): Promise<OrganizationResponse> => {
    const response = await apiClient.get<OrganizationResponse>('/api/v1/organizations/me');
    return response.data;
  },

  /** GET /api/v1/organizations/:organizationId */
  getById: async (organizationId: number): Promise<OrganizationResponse> => {
    const response = await apiClient.get<OrganizationResponse>(
      `/api/v1/organizations/${organizationId}`,
    );
    return response.data;
  },

  /** PUT /api/v1/organizations/:organizationId/users?phone=... */
  addUser: async (organizationId: number, phone: string): Promise<OrganizationResponse> => {
    const response = await apiClient.put<OrganizationResponse>(
      `/api/v1/organizations/${organizationId}/users`,
      null,
      { params: { phone } },
    );
    return response.data;
  },
};

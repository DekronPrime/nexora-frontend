import { apiClient } from '@/lib/api-client';
import {
  ProjectMember,
  InviteMemberDto,
} from '@/types';

export const membersService = {
  async getProjectMembers(projectId: string): Promise<ProjectMember[]> {
    const response = await apiClient.get<{ data: ProjectMember[] }>(`/members?projectId=${projectId}`);
    return response.data;
  },

  async invite(data: InviteMemberDto): Promise<ProjectMember> {
    const response = await apiClient.post<{ data: ProjectMember }>('/members/invite', data);
    return response.data;
  },

  async remove(memberId: string): Promise<void> {
    await apiClient.delete(`/members/${memberId}`);
  },

  async leave(projectId: string): Promise<void> {
    await apiClient.post('/members/leave', { projectId });
  },
};

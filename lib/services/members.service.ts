import { apiClient } from '@/lib/api-client';
import {
  ProjectMember,
  InviteMemberDto,
} from '@/types';

export const membersService = {
  async getProjectMembers(projectId: string): Promise<ProjectMember[]> {
    const response = await apiClient.get<unknown>(`/members?projectId=${projectId}`);
    return Array.isArray(response) ? (response as ProjectMember[]) : [];
  },

  async invite(data: InviteMemberDto): Promise<ProjectMember> {
    const response = await apiClient.post<unknown>('/members/invite', data);
    return response as ProjectMember;
  },

  async remove(memberId: string): Promise<void> {
    await apiClient.delete(`/members/${memberId}`);
  },

  async leave(projectId: string): Promise<void> {
    await apiClient.post('/members/leave', { projectId });
  },
};

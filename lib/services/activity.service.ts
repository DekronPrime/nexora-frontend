import { apiClient } from '@/lib/api-client';
import { ActivityLog } from '@/types';

export const activityService = {
  async getProjectActivity(projectId: string): Promise<ActivityLog[]> {
    const response = await apiClient.get<{ data: ActivityLog[] }>(`/activity/project/${projectId}`);
    return response.data;
  },

  async getTaskActivity(taskId: string): Promise<ActivityLog[]> {
    const response = await apiClient.get<{ data: ActivityLog[] }>(`/activity/task/${taskId}`);
    return response.data;
  },

  async getMyActivity(): Promise<ActivityLog[]> {
    const response = await apiClient.get<{ data: ActivityLog[] }>('/activity/me');
    return response.data;
  },
};

import { apiClient } from "@/src/lib/api-client";
import { ActivityLog } from "@/src/types";

export const activityService = {
  async getProjectActivity(projectId: string): Promise<ActivityLog[]> {
    const response = await apiClient.get<unknown>(
      `/activity/project/${projectId}`,
    );
    return Array.isArray(response) ? (response as ActivityLog[]) : [];
  },

  async getTaskActivity(taskId: string): Promise<ActivityLog[]> {
    const response = await apiClient.get<unknown>(`/activity/task/${taskId}`);
    return Array.isArray(response) ? (response as ActivityLog[]) : [];
  },

  async getMyActivity(): Promise<ActivityLog[]> {
    const response = await apiClient.get<unknown>("/activity/me");
    return Array.isArray(response) ? (response as ActivityLog[]) : [];
  },
};

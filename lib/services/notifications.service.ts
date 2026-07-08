import { apiClient } from '@/lib/api-client';
import { Notification } from '@/types';

export const notificationsService = {
  async getAll(): Promise<Notification[]> {
    const response = await apiClient.get<{ data: Notification[] }>('/notifications');
    return response.data;
  },

  async getById(id: string): Promise<Notification> {
    const response = await apiClient.get<{ data: Notification }>(`/notifications/${id}`);
    return response.data;
  },

  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<{ count: number }>('/notifications/unread-count');
    return response.count;
  },

  async markAsRead(id: string): Promise<Notification> {
    const response = await apiClient.patch<{ data: Notification }>(`/notifications/${id}`);
    return response.data;
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.patch('/notifications/mark-all-read');
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/notifications/${id}`);
  },
};

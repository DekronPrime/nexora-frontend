import { apiClient } from "@/src/lib/api-client";
import { Notification } from "@/src/types";

export const notificationsService = {
  async getAll(): Promise<Notification[]> {
    const response = await apiClient.get<unknown>("/notifications");
    return Array.isArray(response) ? (response as Notification[]) : [];
  },

  async getById(id: string): Promise<Notification> {
    const response = await apiClient.get<unknown>(`/notifications/${id}`);
    return response as Notification;
  },

  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<unknown>(
      "/notifications/unread-count",
    );
    return typeof response === "object" && response && "count" in response
      ? Number((response as { count?: number }).count ?? 0)
      : 0;
  },

  async markAsRead(id: string): Promise<Notification> {
    const response = await apiClient.patch<unknown>(`/notifications/${id}`, {
      isRead: true,
    });
    return response as Notification;
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.patch("/notifications/mark-all-read");
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/notifications/${id}`);
  },
};

"use client";

import { useNotifications } from "@/src/contexts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { LoadingState, EmptyState } from "@/src/components/states";
import { Badge } from "@/src/components/ui/badge";
import { CheckCheck, Bell, Trash2 } from "lucide-react";
import { NotificationItem } from "@/src/components/notifications/notification-item";

export default function NotificationsPage() {
  const { notifications, unreadCount, isLoading, markAllAsRead } =
    useNotifications();
  const notificationsList = Array.isArray(notifications) ? notifications : [];

  if (isLoading) {
    return <LoadingState message="Loading notifications..." />;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Notifications
          </h1>
          {unreadCount > 0 && (
            <p className="text-slate-600 mt-1">
              {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" className="gap-2" onClick={markAllAsRead}>
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          {notificationsList.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No notifications"
              description="You're all caught up!"
            />
          ) : (
            <div className="divide-y">
              {notificationsList.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  compact={false}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

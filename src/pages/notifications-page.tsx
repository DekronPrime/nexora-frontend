"use client";

import { NotificationItem } from "@/src/components/notifications/notification-item";
import { EmptyState, LoadingState } from "@/src/components/states";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { useNotifications } from "@/src/contexts";
import { Bell, CheckCheck } from "lucide-react";

export const NotificationsPage = () => {
  const { notifications, unreadCount, isLoading, markAllAsRead } =
    useNotifications();
  const notificationsList = Array.isArray(notifications) ? notifications : [];

  if (isLoading) {
    return <LoadingState message="Loading notifications..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-12 w-12 text-slate-900" fill="currentColor" />
          <div>
            <h1 className="text-2xl font-bold font-unbounded text-slate-900">
              Notifications
            </h1>
            <p className="text-slate-700 font-sofia">
              Stay updated with the latest notifications and alerts
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button variant="default" className="gap-2" onClick={markAllAsRead}>
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <Card className="rounded-lg bg-muted w-full xl:w-3/4 mx-auto">
        <CardContent className="p-0">
          {notificationsList.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No notifications"
              description="You're all caught up!"
            />
          ) : (
            <div className="divide-y rounded-lg items-center mx-auto bg-muted p-3">
              <div className="flex flex-col items-start justify-between p-2  rounded-t-lg bg-muted">
                <h3 className="text-xl font-bold font-unbounded text-slate-900">
                  Recent Notifications
                </h3>
                {unreadCount > 0 && (
                  <p className="text-base font-semibold text-slate-600 font-sofia">
                    {unreadCount} unread notification
                    {unreadCount > 1 ? "s" : ""}
                  </p>
                )}
              </div>
              <div className="mt-2">
                {notificationsList.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    compact={false}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

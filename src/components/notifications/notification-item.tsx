"use client";

import { Notification } from "@/src/types";
import { cn } from "@/src/lib/utils";
import { Bell, CheckCircle, UserPlus, AtSign, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNotifications } from "@/src/contexts";

const notificationIcons = {
  task_assigned: CheckCircle,
  project_invitation: UserPlus,
  task_completed: Check,
  mention: AtSign,
};

interface NotificationItemProps {
  notification: Notification;
  compact?: boolean;
}

export function NotificationItem({
  notification,
  compact = true,
}: NotificationItemProps) {
  const { markAsRead } = useNotifications();
  const Icon = notificationIcons[notification.type] || Bell;

  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "relative w-full text-left flex items-start gap-3 p-3 hover:bg-muted transition-all border border-l-4   border-slate-200",
        !notification.isRead
          ? "bg-white border-l-primary"
          : "bg-muted border-l-slate-400",
        compact
          ? "p-3 border-l-0"
          : "hover:shadow-md last:rounded-b-lg last:border-b-none",
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 rounded-full p-2",
          notification.isRead ? "bg-muted" : "bg-primary/10",
        )}
      >
        <Icon
          className={cn(
            compact ? "w-4 h-4" : "w-6 h-6",
            notification.isRead ? "text-muted-foreground" : "text-primary",
          )}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-semibold font-inter truncate",
            !notification.isRead && "text-foreground",
            compact ? "font-semibold text-sm" : "font-bold text-lg",
          )}
        >
          {notification.title}
        </p>
        <p
          className={cn(
            "font-sofia text-muted-foreground line-clamp-2",
            compact ? "font-medium text-xs" : "font-semibold text-sm",
          )}
        >
          {notification.message}
        </p>
        {!compact && (
          <p className="text-xs italic font-inter font-semibold text-muted-foreground float-right">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </p>
        )}
      </div>
      {!notification.isRead && (
        <div className="absolute top-3 right-3 flex-shrink-0 w-2 h-2 rounded-full bg-primary" />
      )}
    </button>
  );
}

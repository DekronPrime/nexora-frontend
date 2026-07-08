'use client';

import { Notification } from '@/types';
import { cn } from '@/lib/utils';
import { Bell, CheckCircle, UserPlus, AtSign, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications } from '@/contexts';

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

export function NotificationItem({ notification, compact = true }: NotificationItemProps) {
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
        'w-full text-left flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors',
        !notification.isRead && 'bg-primary/5',
        compact && 'p-3'
      )}
    >
      <div
        className={cn(
          'flex-shrink-0 rounded-full p-2',
          notification.isRead ? 'bg-muted' : 'bg-primary/10'
        )}
      >
        <Icon
          className={cn(
            'h-4 w-4',
            notification.isRead ? 'text-muted-foreground' : 'text-primary'
          )}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-sm font-medium truncate',
            !notification.isRead && 'text-foreground'
          )}
        >
          {notification.title}
        </p>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {notification.message}
        </p>
        {!compact && (
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </p>
        )}
      </div>
      {!notification.isRead && (
        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary" />
      )}
    </button>
  );
}

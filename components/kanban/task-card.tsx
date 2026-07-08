'use client';

import { useDraggable } from '@dnd-kit/core';
import { Task, TaskPriority } from '@/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, GripVertical } from 'lucide-react';
import { format } from 'date-fns';

const priorityColors: Record<TaskPriority, string> = {
  low: 'text-slate-500 bg-slate-100',
  medium: 'text-amber-600 bg-amber-100',
  high: 'text-orange-600 bg-orange-100',
  urgent: 'text-red-600 bg-red-100',
};

const priorityLabels: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  isDragging?: boolean;
}

export function TaskCard({ task, onClick, isDragging }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: task,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const userInitials = task.assignee?.fullName
    ? task.assignee.fullName.split(' ').map((n) => n[0]).join('').toUpperCase()
    : '?';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-white rounded-lg border border-slate-200 p-3 shadow-sm cursor-pointer',
        'hover:shadow-md hover:border-slate-300 transition-all',
        isDragging && 'shadow-xl ring-2 ring-blue-500',
        task.completedAt && 'opacity-60'
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-2">
        <button
          className="text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing mt-0.5"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={cn(
                'text-xs font-medium px-1.5 py-0.5 rounded',
                priorityColors[task.priority]
              )}
            >
              {priorityLabels[task.priority]}
            </span>
          </div>
          <h4 className={cn(
            'font-medium text-slate-900 text-sm line-clamp-2',
            task.completedAt && 'line-through text-slate-500'
          )}>
            {task.title}
          </h4>
          {task.description && (
            <p className="text-xs text-slate-500 line-clamp-2 mt-1">
              {task.description}
            </p>
          )}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              {task.dueDate && (
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Calendar className="h-3 w-3" />
                  <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                </div>
              )}
            </div>
            {task.assignee && (
              <Avatar className="h-6 w-6">
                <AvatarImage src={task.assignee.avatarUrl || undefined} />
                <AvatarFallback className="text-[10px] bg-slate-100">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

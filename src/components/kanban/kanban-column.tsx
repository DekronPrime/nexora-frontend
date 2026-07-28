"use client";

import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { KanbanColumn as KanbanColumnType, Task } from "@/src/types";
import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import type { ComponentType } from "react";
import { TaskCard } from "./task-card";

interface KanbanColumnProps {
  column: KanbanColumnType;
  onTaskClick: (task: Task) => void;
  onAddTask: () => void;
  isLoading?: boolean;
}

export function KanbanColumn({
  column,
  onTaskClick,
  onAddTask,
  isLoading,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const tasks = Array.isArray(column.tasks) ? column.tasks : [];
  const ColumnIcon = column.icon as ComponentType<any>;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "lg:max-w-1/4 md:max-w-1/2 w-full bg-slate-100 rounded-xl p-3 transition-colors",
        isOver && "bg-blue-100/75",
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ColumnIcon className={cn("h-6 w-6", column.color)} />
          <h3 className="font-bold font-inter text-slate-700">
            {column.title}
          </h3>
          <span className="text-sm bg-slate-200 text-slate-600 px-2 py-1 rounded-md font-semibold font-inter">
            {column.tasks.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onAddTask}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2 min-h-[200px]">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
          />
        ))}
        {tasks.length === 0 && (
          <button
            onClick={onAddTask}
            className="w-full p-4 border-2 border-dashed border-slate-300 rounded-lg text-sm font-sofia font-semibold text-slate-500 hover:border-slate-400 hover:text-slate-600 transition-colors"
          >
            Add a task
          </button>
        )}
      </div>
    </div>
  );
}

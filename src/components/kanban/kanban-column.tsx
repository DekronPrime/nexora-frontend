"use client";

import { useDroppable } from "@dnd-kit/core";
import { KanbanColumn as KanbanColumnType, Task } from "@/src/types";
import { TaskCard } from "./task-card";
import { cn } from "@/src/lib/utils";
import { Plus } from "lucide-react";
import { Button } from "@/src/components/ui/button";

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

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex-shrink-0 w-80 bg-slate-100/50 rounded-xl p-3 transition-colors",
        isOver && "bg-blue-100/50",
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: column.color }}
          />
          <h3 className="font-medium text-slate-700">{column.title}</h3>
          <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium">
            {column.tasks.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
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
            className="w-full p-4 border-2 border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-slate-400 hover:text-slate-600 transition-colors"
          >
            Add a task
          </button>
        )}
      </div>
    </div>
  );
}

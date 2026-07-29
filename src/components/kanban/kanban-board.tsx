"use client";

import {
  KanbanColumn as KanbanColumnType,
  Task,
  TaskStatus,
} from "@/src/types";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CheckCheck, Flame, LayoutList, SquarePen } from "lucide-react";
import { useMemo, useState } from "react";
import { KanbanColumn } from "./kanban-column";
import { TaskCard } from "./task-card";

const columnConfig: Array<{
  id: TaskStatus;
  title: string;
  icon: React.ComponentType;
  color: string;
}> = [
  { id: "todo", title: "To Do", icon: LayoutList, color: "text-slate-500" },
  {
    id: "in_progress",
    title: "In Progress",
    icon: Flame,
    color: "text-amber-500",
  },
  { id: "review", title: "Review", icon: SquarePen, color: "text-violet-500" },
  { id: "done", title: "Done", icon: CheckCheck, color: "text-emerald-500" },
];

interface KanbanBoardProps {
  tasks: Task[];
  onTaskStatusChange: (taskId: string, status: TaskStatus) => void;
  onTaskClick: (task: Task) => void;
  onAddTask: (status: TaskStatus) => void;
  isLoading?: boolean;
}

export function KanbanBoard({
  tasks,
  onTaskStatusChange,
  onTaskClick,
  onAddTask,
  isLoading,
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const columns = useMemo<KanbanColumnType[]>(() => {
    return columnConfig.map((config) => ({
      ...config,
      tasks: tasks.filter((task) => task.status === config.id),
    }));
  }, [tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    const task = tasks.find((t) => t.id === taskId);
    if (task && task.status !== newStatus) {
      onTaskStatusChange(taskId, newStatus);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (!event.over) return;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="flex justify-evenly flex-wrap lg:flex-nowrap gap-4 lg:overflow-x-auto">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            onTaskClick={onTaskClick}
            onAddTask={() => onAddTask(column.id)}
            isLoading={isLoading}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div
            className="bg-white
        scale-105
        shadow-2xl
        cursor-grabbing"
          >
            <TaskCard task={activeTask} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

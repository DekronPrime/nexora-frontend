"use client";

import { useTasks, useProjects } from "@/hooks";
import { LoadingState, ErrorState, EmptyState } from "@/components/states";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle, Clock, AlertTriangle, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { TaskStatus, TaskPriority, Task } from "@/types";
import { formatDate, formatDistanceToNow } from "date-fns";

const statusColors: Record<TaskStatus, string> = {
  todo: "bg-slate-200 text-slate-700",
  in_progress: "bg-blue-100 text-blue-700",
  review: "bg-amber-100 text-amber-700",
  done: "bg-emerald-100 text-emerald-700",
};

const statusLabels: Record<TaskStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
};

const priorityColors: Record<TaskPriority, string> = {
  low: "text-slate-500",
  medium: "text-amber-500",
  high: "text-orange-500",
  urgent: "text-red-500",
};

export default function ImportantPage() {
  const { tasks, isLoading: tasksLoading, error: tasksError } = useTasks();
  const { projects } = useProjects();
  const tasksList = Array.isArray(tasks) ? tasks : [];
  const projectsList = Array.isArray(projects) ? projects : [];

  const importantTasks = tasksList.filter(
    (task) => task.priority === "high" || task.priority === "urgent",
  );

  const projectMap = projectsList.reduce(
    (acc, project) => {
      acc[project.id] = project;
      return acc;
    },
    {} as Record<string, (typeof projects)[0]>,
  );

  if (tasksLoading) {
    return <LoadingState message="Loading important tasks..." />;
  }

  if (tasksError) {
    return <ErrorState message={tasksError} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Star className="h-6 w-6 text-amber-500" fill="currentColor" />
            Important Tasks
          </h1>
          <p className="text-slate-600 mt-1">
            High priority and urgent tasks across all projects
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {importantTasks.length === 0 ? (
        <EmptyState
          icon={CheckCircle}
          title="All clear!"
          description="You don't have any high priority or urgent tasks."
        />
      ) : (
        <div className="space-y-4">
          {importantTasks.map((task) => (
            <Link
              key={task.id}
              href={`/projects/${task.projectId}`}
              className="block"
            >
              <Card className="hover:shadow-md hover:border-blue-200 transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle
                          className={cn(
                            "h-4 w-4",
                            priorityColors[task.priority],
                          )}
                        />
                        <span
                          className={cn(
                            "text-sm font-medium",
                            priorityColors[task.priority],
                          )}
                        >
                          {task.priority.toUpperCase()}
                        </span>
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full",
                            statusColors[task.status],
                          )}
                        >
                          {statusLabels[task.status]}
                        </span>
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-1">
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-slate-500 line-clamp-2 mb-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span>
                          {projectMap[task.projectId]?.title ||
                            "Unknown project"}
                        </span>
                        {task.dueDate && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            Due{" "}
                            {formatDistanceToNow(new Date(task.dueDate), {
                              addSuffix: true,
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import {
  priorityBorderColors,
  priorityColors,
} from "@/src/components/kanban/task-card";
import { iconMap } from "@/src/components/modals/project-modal";
import { EmptyState, ErrorState, LoadingState } from "@/src/components/states";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { useProjects, useTasks } from "@/src/hooks";
import { cn } from "@/src/lib/utils";
import { statusColors, statusLabels } from "@/src/pages/project-page";
import { Task, TaskPriority } from "@/src/types";
import { formatDistanceToNow } from "date-fns";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Folder,
  Star,
} from "lucide-react";
import Link from "next/link";

export const ImportantPage = () => {
  const { tasks, isLoading: tasksLoading, error: tasksError } = useTasks();
  const { projects } = useProjects();
  const tasksList = Array.isArray(tasks) ? tasks : [];
  const projectsList = Array.isArray(projects) ? projects : [];

  const importantPriorities: TaskPriority[] = ["high", "urgent"];

  const importantTasks = tasksList.filter((task) =>
    importantPriorities.includes(task.priority),
  );

  const projectMap = projectsList.reduce(
    (acc, project) => {
      acc[project.id] = project;
      return acc;
    },
    {} as Record<string, (typeof projects)[0]>,
  );

  const groupedTasks = importantTasks.reduce(
    (acc, task) => {
      const project = projectMap[task.projectId];

      if (!project) return acc;

      const existingGroup = acc.find(
        (group) => group.project.id === project.id,
      );

      if (existingGroup) {
        existingGroup.tasks.push(task);
      } else {
        acc.push({
          project,
          tasks: [task],
        });
      }

      return acc;
    },
    [] as Array<{
      project: (typeof projects)[0];
      tasks: Task[];
    }>,
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
        <div className="flex items-center gap-2">
          <Star className="h-12 w-12 text-amber-500" fill="currentColor" />
          <div>
            <h1 className="text-2xl font-bold font-unbounded text-slate-900">
              Important Tasks
            </h1>
            <p className="text-slate-700 font-sofia">
              High priority and urgent tasks across all projects
            </p>
          </div>
        </div>

        <Button variant="default" size="default" className="gap-2">
          <Filter className="h-5 w-5" />
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
        <div className="space-y-6">
          {groupedTasks.map(({ project, tasks }) => {
            return (
              <Card
                key={project.id}
                className="overflow-hidden border-slate-200 rounded-lg"
              >
                <div
                  className="h-2"
                  style={{ backgroundColor: project.color }}
                />
                <CardHeader className="border-b border-slate-100 bg-slate-100 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${project.color}20` }}
                      >
                        {(() => {
                          const Icon = iconMap[project.icon] || Folder;
                          return <Icon style={{ color: project.color }} />;
                        })()}
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold font-unbounded text-slate-900">
                          {project.title}
                        </CardTitle>

                        <p className="font-semibold font-inter text-sm text-slate-500">
                          {tasks.length} important{" "}
                          {tasks.length === 1 ? "task" : "tasks"}
                        </p>
                      </div>
                    </div>

                    <Link href={`/projects/${project.id}`}>
                      <Button variant="default" size="sm">
                        Open project
                      </Button>
                    </Link>
                  </div>
                </CardHeader>

                <CardContent className="p-6 pt-3 bg-slate-100">
                  <div className="space-y-2">
                    {tasks.map((task) => (
                      <Link
                        key={task.id}
                        href={`/projects/${task.projectId}`}
                        className="block"
                      >
                        <div
                          className={cn(
                            "rounded-r-lg border border-l-4 border-slate-200 bg-white p-4",
                            priorityBorderColors[task.priority],
                            "hover:shadow-md hover:border-slate-300 hover:border-l-slate-700 transition-all",
                            "cursor-pointer",
                          )}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex flex-col gap-2">
                              <div
                                className={cn(
                                  "inline-flex w-fit items-center gap-2 py-1 px-2 rounded",
                                  priorityColors[task.priority],
                                )}
                              >
                                <AlertTriangle className={cn("h-4 w-4")} />
                                <span
                                  className={cn(
                                    "text-xs font-semibold uppercase",
                                  )}
                                >
                                  {task.priority} Priority
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                {task.assignee && (
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage
                                      src={task.assignee.avatarUrl || undefined}
                                    />
                                    <AvatarFallback className="text-[10px] bg-slate-100">
                                      {task.assignee?.fullName
                                        ? task.assignee.fullName
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .toUpperCase()
                                        : "?"}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                                <div className="flex flex-col justify-center">
                                  <h3 className="font-bold text-lg font-inter text-slate-900 truncate">
                                    {task.title}
                                  </h3>
                                  {task.description && (
                                    <p className="text-sm font-semibold font-sofia text-slate-500 line-clamp-2">
                                      {task.description}
                                    </p>
                                  )}
                                  {task.dueDate && (
                                    <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
                                      <Clock className="h-3.5 w-3.5" />

                                      <span>
                                        Due{" "}
                                        {formatDistanceToNow(
                                          new Date(task.dueDate),
                                          {
                                            addSuffix: true,
                                          },
                                        )}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <span
                              className={cn(
                                "rounded-full px-3 py-1 text-sm font-semibold",
                                statusColors[task.status],
                              )}
                            >
                              {statusLabels[task.status]}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

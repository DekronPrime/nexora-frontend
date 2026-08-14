"use client";

import { KanbanBoard } from "@/src/components/kanban";
import { InviteMemberModal } from "@/src/components/modals";
import { TaskModal } from "@/src/components/modals/task-modal";
import { ErrorState, LoadingState } from "@/src/components/states";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { useMembers, useProject, useProjectTasks } from "@/src/hooks";
import { activityService, projectsService } from "@/src/lib/services";
import { cn } from "@/src/lib/utils";
import { ActivityLog, Task, TaskStatus } from "@/src/types";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Folder,
  Plus,
  Settings,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { priorityColors, priorityLabels } from "../components/kanban/task-card";
import { iconMap, ProjectModal } from "../components/modals/project-modal";
import { ConfirmationModal } from "../components/modals/confirmation-modal";

export const statusColors: Record<TaskStatus, string> = {
  todo: "bg-slate-200 text-slate-700",
  in_progress: "bg-amber-100 text-amber-700",
  review: "bg-violet-100 text-violet-700",
  done: "bg-emerald-100 text-emerald-700",
};

export const statusLabels: Record<TaskStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
};

const formatActivityMessage = (activity: ActivityLog) => {
  const actor = activity.user?.fullName || "Someone";

  switch (activity.action) {
    case "project_created":
      return `${actor} created the project "${activity.newValue?.title ?? "Untitled"}".`;

    case "project_deleted":
      return `${actor} deleted the project "${activity.oldValue?.title ?? "Untitled"}".`;

    case "project_updated": {
      const oldValue = activity.oldValue ?? {};
      const newValue = activity.newValue ?? {};

      if (oldValue.title !== newValue.title) {
        return `${actor} renamed the project from "${oldValue.title}" to "${newValue.title}".`;
      }
      if (oldValue.description !== newValue.description) {
        return `${actor} updated the project description.`;
      }

      return `${actor} updated the project.`;
    }

    case "task_created":
      return `${actor} created the task "${activity.newValue?.title ?? "Untitled"}".`;

    case "task_deleted":
      return `${actor} deleted the task "${activity.oldValue?.title ?? "Untitled"}".`;

    case "task_updated": {
      const oldValue = (activity.oldValue ?? {}) as {
        status?: string;
        priority?: string;
        title?: string;
        assigneeId?: string | null;
      };
      const newValue = (activity.newValue ?? {}) as {
        status?: string;
        priority?: string;
        title?: string;
        assigneeId?: string | null;
      };

      if (oldValue.status !== newValue.status) {
        return `${actor} moved "${newValue.title}" from ${oldValue.status?.toUpperCase() ?? ""} to ${newValue.status?.toUpperCase() ?? ""}.`;
      }
      if (oldValue.priority !== newValue.priority) {
        return `${actor} changed priority of "${newValue.title}" from ${oldValue.priority?.toUpperCase() ?? ""} to ${newValue.priority?.toUpperCase() ?? ""}.`;
      }
      if (oldValue.title !== newValue.title) {
        return `${actor} renamed task "${oldValue.title}" to "${newValue.title}".`;
      }
      if (oldValue.assigneeId !== newValue.assigneeId) {
        return `${actor} reassigned "${newValue.title}".`;
      }

      return `${actor} updated the task "${newValue.title}".`;
    }

    case "member_invited":
      return `${actor} invited a new member to the project.`;

    case "member_removed":
      return `${actor} removed a member from the project.`;

    case "member_role_updated":
      return `${actor} changed a member's role.`;

    default:
      return `${actor} performed "${activity.action}".`;
  }
};

export const ProjectPage = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = (params?.id ?? "") as string;

  const {
    project,
    isLoading: projectLoading,
    error: projectError,
  } = useProject(projectId);

  const {
    tasks,
    isLoading: tasksLoading,
    updateTaskStatus,
    fetchTasks,
  } = useProjectTasks(projectId);
  const { members, inviteMember } = useMembers(projectId);
  const taskList = Array.isArray(tasks) ? tasks : [];
  const membersList = Array.isArray(members) ? members : [];
  const ProjectIcon = project ? iconMap[project.icon] || Folder : Folder;

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("todo");
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;

    let isMounted = true;

    const loadActivity = async () => {
      setActivityLoading(true);
      setActivityError(null);

      try {
        const data = await activityService.getProjectActivity(projectId);
        if (isMounted) {
          setActivityLogs(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (isMounted) {
          setActivityError("Unable to load activity history");
          setActivityLogs([]);
        }
      } finally {
        if (isMounted) {
          setActivityLoading(false);
        }
      }
    };

    loadActivity();

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  const taskStats = useMemo(() => {
    const total = taskList.length;
    const todo = taskList.filter((t) => t.status === "todo").length;
    const inProgress = taskList.filter(
      (t) => t.status === "in_progress",
    ).length;
    const review = taskList.filter((t) => t.status === "review").length;
    const done = taskList.filter((t) => t.status === "done").length;
    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, todo, inProgress, review, done, completionRate };
  }, [taskList]);

  const handleTaskStatusChange = async (taskId: string, status: TaskStatus) => {
    try {
      await updateTaskStatus(taskId, status);
      toast.success("Task moved");
    } catch (error) {
      toast.error("Failed to move task");
      fetchTasks();
    }
  };

  const handleAddTask = (status: TaskStatus) => {
    setSelectedTask(undefined);
    setDefaultStatus(status);
    setTaskModalOpen(true);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setTaskModalOpen(true);
  };

  const handleEditProject = () => {
    setProjectModalOpen(true);
  };

  const handleDeleteProject = () => {
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!project) return;
    await projectsService.delete(project.id);
  };

  if (projectLoading) {
    return <LoadingState message="Loading project..." />;
  }

  if (projectError || !project) {
    return (
      <ErrorState
        message={projectError || "Project not found"}
        retry={() => router.push("/dashboard")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div
        className="flex items-start justify-between gap-4 flex-wrap bg-primary-foreground p-4 rounded-lg border-t-8"
        style={{ borderColor: project.color }}
      >
        <div className="flex items-start gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${project.color}20` }}
              >
                <ProjectIcon
                  className="h-7 w-7"
                  style={{ color: project.color }}
                />
              </div>
              <div>
                <h1 className="text-xl font-bold font-unbounded text-slate-900">
                  {project.title}
                </h1>
                <div className="flex items-center gap-2 mt-1 text-sm text-slate-500 font-inter">
                  {project.owner ? (
                    <Avatar
                      key={project.owner.id}
                      className="border-2 border-white h-7 w-7"
                    >
                      <AvatarImage src={project.owner.avatarUrl || undefined} />
                      <AvatarFallback className="text-xs bg-slate-200">
                        {project.owner.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Calendar className="h-5 w-5" />
                  )}
                  <span>
                    Created {format(new Date(project.createdAt), "MMM d, yyyy")}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="font-semibold">
                    {taskStats.total} {taskStats.total === 1 ? "task" : "tasks"}
                  </span>
                </div>
              </div>
            </div>
            {project.description && (
              <p
                className="text-slate-700 font-sofia mt-2 pl-2 max-w-2xl line-clamp-2 border-l-[3px]"
                style={{ borderColor: `${project.color}` }}
              >
                {project.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleEditProject}>
            <Settings className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleDeleteProject}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="board" className="">
        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: project.color }}
        >
          <TabsList className="font-inter font-semibold">
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          <TabsContent value="board" className="space-y-4">
            <div className="flex items-center flex-wrap gap-4 px-4 py-3 bg-white rounded-ss-none rounded-lg">
              <div className="flex items-center flex-wrap gap-4 text-sm font-bold font-inter">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-500" />
                  <span className="text-slate-600">To Do</span>
                  <span className="font-semibold text-slate-900">
                    {taskStats.todo}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-slate-600">In Progress</span>
                  <span className="font-semibold text-slate-900">
                    {taskStats.inProgress}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-violet-500" />
                  <span className="text-slate-600">Review</span>
                  <span className="font-semibold text-slate-900">
                    {taskStats.review}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-600">Done</span>
                  <span className="font-semibold text-slate-900">
                    {taskStats.done}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0" />
              <div className="flex items-center gap-2 font-sofia font-semibold">
                <span className="text-base text-slate-500">Progress</span>
                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${taskStats.completionRate}%` }}
                  />
                </div>
                <span className="font-bold text-slate-900">
                  {taskStats.completionRate}%
                </span>
              </div>
            </div>

            {tasksLoading ? (
              <LoadingState message="Loading tasks..." />
            ) : (
              <KanbanBoard
                tasks={tasks}
                onTaskStatusChange={handleTaskStatusChange}
                onTaskClick={handleTaskClick}
                onAddTask={handleAddTask}
              />
            )}
          </TabsContent>

          <TabsContent value="list">
            <Card className="rounded-t-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between rounded-ss-none rounded-lg">
                  <span className="font-inter">All Tasks</span>
                  <Button
                    size="sm"
                    className="gap-2"
                    onClick={() => handleAddTask("todo")}
                  >
                    <Plus className="h-4 w-4" />
                    Add Task
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {taskList.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8">
                    No tasks yet. Add your first task!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {taskList.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 gap-3 border bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                        onClick={() => handleTaskClick(task)}
                      >
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
                        <div className="min-w-0 flex-1">
                          <div className="flex gap-2">
                            <h4 className="font-bold font-inter text-base text-slate-900 truncate">
                              {task.title}
                            </h4>
                            <div className="text-sm flex gap-2 text-slate-500 capitalize mb-1">
                              <span
                                className={cn(
                                  "text-xs font-medium px-2 py-0.5 rounded",
                                  priorityColors[task.priority],
                                )}
                              >
                                {priorityLabels[task.priority]} Priority
                              </span>
                            </div>
                          </div>
                          {task.description && (
                            <p className="text-sm font-semibold font-sofia text-slate-500 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap",
                            statusColors[task.status],
                          )}
                        >
                          {statusLabels[task.status]}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle className="font-inter">Activity Log</CardTitle>
              </CardHeader>
              <CardContent>
                {activityLoading ? (
                  <LoadingState message="Loading activity..." />
                ) : activityError ? (
                  <p className="text-sm text-slate-500 text-center py-8">
                    {activityError}
                  </p>
                ) : activityLogs.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8">
                    No activity yet for this project.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {activityLogs.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-3 gap-3 border bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                      >
                        <Avatar key={activity.user?.id} className="h-10 w-10">
                          <AvatarImage
                            src={activity.user?.avatarUrl || undefined}
                          />
                          <AvatarFallback className="text-[10px] bg-slate-100">
                            {activity.user?.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold font-inter text-base text-slate-900">
                            {formatActivityMessage(activity)}
                          </p>
                          <p className="text-sm font-sofia text-slate-500">
                            {format(
                              new Date(activity.createdAt),
                              "MMM d, yyyy • HH:mm",
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="font-inter">Team Members</span>
                  <Button
                    size="sm"
                    variant="default"
                    className="gap-2"
                    onClick={() => setInviteModalOpen(true)}
                  >
                    <Users className="h-4 w-4" />
                    Invite Member
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {membersList.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8">
                    No members yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {membersList.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 gap-3 border bg-slate-50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={member.user.avatarUrl || undefined}
                            />
                            <AvatarFallback>
                              {member.user.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold font-inter text-slate-900">
                              {member.user.fullName}
                            </p>
                            <p className="text-sm font-semibold font-sofia text-slate-500">
                              {member.user.email}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            member.role === "owner" ? "default" : "secondary"
                          }
                          className="text-sm font-medium px-3 pb-1 rounded-full whitespace-nowrap capitalize"
                        >
                          {member.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      <TaskModal
        open={taskModalOpen}
        onOpenChange={setTaskModalOpen}
        projectId={project.id}
        defaultStatus={defaultStatus}
        task={selectedTask}
        onSuccess={() => fetchTasks()}
      />
      <InviteMemberModal
        open={inviteModalOpen}
        onOpenChange={setInviteModalOpen}
        projectId={projectId}
        invite={inviteMember}
      />
      <ProjectModal
        open={projectModalOpen}
        onOpenChange={setProjectModalOpen}
        project={project}
      />

      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete project?"
        description={`Are you sure you want to delete project "${project.title}"? This will permanently delete all tasks and cannot be undone.`}
        confirmLabel="Delete project"
        variant="destructive"
        onConfirm={handleConfirmDelete}
        onSuccess={() => {
          toast.success("Project deleted");
          router.push("/dashboard");
        }}
      />
    </div>
  );
};

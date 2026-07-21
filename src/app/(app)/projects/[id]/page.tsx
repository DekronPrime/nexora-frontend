"use client";

import { KanbanBoard } from "@/src/components/kanban";
import { AddTaskModal } from "@/src/components/modals/add-task-modal";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { useMembers, useProject, useProjectTasks } from "@/src/hooks";
import { InviteMemberModal } from "@/src/components/modals";
import { activityService } from "@/src/lib/services";
import { cn } from "@/src/lib/utils";
import { ActivityLog, Task, TaskStatus } from "@/src/types";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Edit,
  Folder,
  MoreHorizontal,
  Plus,
  Settings,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

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

const formatActivityMessage = (activity: ActivityLog) => {
  const actor = activity.user?.fullName || "Someone";
  const entity = activity.entityType || "item";

  switch (activity.action.toLowerCase()) {
    case "created":
      return `${actor} created ${entity}`;
    case "updated":
      return `${actor} updated ${entity}`;
    case "deleted":
      return `${actor} deleted ${entity}`;
    case "completed":
      return `${actor} completed ${entity}`;
    case "moved":
      return `${actor} moved ${entity}`;
    case "assigned":
      return `${actor} assigned ${entity}`;
    default:
      return `${actor} ${activity.action} ${entity}`;
  }
};

export default function ProjectPage() {
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

  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
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
    setDefaultStatus(status);
    setAddTaskModalOpen(true);
  };

  const handleTaskClick = (task: Task) => {
    // Task detail view will be added in future
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
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${project.color}20` }}
              >
                <Folder className="h-5 w-5" style={{ color: project.color }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {project.title}
                </h1>
                <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Created {format(new Date(project.createdAt), "MMM d, yyyy")}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span>{taskStats.total} tasks</span>
                </div>
              </div>
            </div>
            {project.description && (
              <p className="text-slate-600 mt-2 max-w-2xl">
                {project.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="gap-2"
            onClick={() => handleAddTask("todo")}
          >
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
          <Link href={`/projects/${projectId}/settings`}>
            <Button variant="outline" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit project
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="board" className="space-y-6">
        <TabsList>
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="space-y-6">
          {/* Stats Bar */}
          <div className="flex items-center flex-wrap gap-4 px-4 py-3 bg-white rounded-lg border">
            <div className="flex items-center flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-400" />
                <span className="text-slate-600">To Do</span>
                <span className="font-semibold text-slate-900">
                  {taskStats.todo}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-slate-600">In Progress</span>
                <span className="font-semibold text-slate-900">
                  {taskStats.inProgress}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
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
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Progress</span>
              <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${taskStats.completionRate}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-slate-900">
                {taskStats.completionRate}%
              </span>
            </div>
          </div>

          {/* Kanban Board */}
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>All Tasks</span>
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
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                      onClick={() => handleTaskClick(task)}
                    >
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-slate-900 truncate">
                          {task.title}
                        </h4>
                        <p className="text-sm text-slate-500 capitalize">
                          {task.priority} priority
                          {task.assignee && ` • ${task.assignee.fullName}`}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "ml-3 text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap",
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
              <CardTitle>Activity Log</CardTitle>
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
                <div className="space-y-3">
                  {activityLogs.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
                        {(activity.user?.fullName || "U")
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-900">
                          {formatActivityMessage(activity)}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
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
                <span>Team Members</span>
                <Button
                  size="sm"
                  variant="outline"
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
                <div className="space-y-3">
                  {membersList.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
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
                          <p className="font-medium text-slate-900">
                            {member.user.fullName}
                          </p>
                          <p className="text-sm text-slate-500">
                            {member.user.email}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          member.role === "owner" ? "default" : "secondary"
                        }
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
      </Tabs>

      <AddTaskModal
        open={addTaskModalOpen}
        onOpenChange={setAddTaskModalOpen}
        projectId={projectId}
        defaultStatus={defaultStatus}
      />
      <InviteMemberModal
        open={inviteModalOpen}
        onOpenChange={setInviteModalOpen}
        projectId={projectId}
        invite={inviteMember}
      />
    </div>
  );
}

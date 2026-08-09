"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { Calendar } from "@/src/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Textarea } from "@/src/components/ui/textarea";
import { useMembers, useTasks } from "@/src/hooks";
import { cn } from "@/src/lib/utils";
import {
  CreateTaskDto,
  ProjectMember,
  Task,
  TaskPriority,
  TaskStatus,
  UpdateTaskDto,
} from "@/src/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(3000).optional(),
  status: z.enum(["todo", "in_progress", "review", "done"] as const),
  priority: z.enum(["low", "medium", "high", "urgent"] as const),
  assigneeId: z.string().nullable().optional(),
  dueDate: z.date().nullable().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  task?: Task;
  defaultStatus?: TaskStatus;
  onSuccess?: () => void;
}

export function TaskModal({
  open,
  onOpenChange,
  projectId,
  task,
  defaultStatus = "todo",
  onSuccess,
}: TaskModalProps) {
  const getDefaultValues = (): TaskFormData => ({
    title: task?.title ?? "",
    description: task?.description ?? "",
    status: task?.status ?? defaultStatus,
    priority: task?.priority ?? "medium",
    assigneeId: task?.assigneeId ?? null,
    dueDate: task?.dueDate ? new Date(task.dueDate) : null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const { members = [] } = useMembers(projectId);
  const { createTask, updateTask } = useTasks({ projectId });
  const isEditing = !!task;
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    if (!open) return;
    reset(getDefaultValues());
  }, [task, open, defaultStatus, reset]);

  const selectedAssignee = watch("assigneeId");
  const selectedPriority = watch("priority");
  const selectedStatus = watch("status");
  const selectedDueDate = watch("dueDate");

  const onSubmit = async (data: TaskFormData) => {
    setIsLoading(true);
    try {
      const baseTaskPayload = {
        title: data.title,
        description: data.description || "",
        status: data.status,
        priority: data.priority,
        ...(data.assigneeId ? { assigneeId: data.assigneeId } : {}),
        ...(data.dueDate ? { dueDate: data.dueDate.toISOString() } : {}),
      };

      if (isEditing) {
        await updateTask(task.id, baseTaskPayload as UpdateTaskDto);
      } else {
        const createTaskPayload: CreateTaskDto = {
          projectId,
          ...baseTaskPayload,
        };
        await createTask(createTaskPayload);
      }

      toast.success(
        isEditing ? "Task updated successfully" : "Task created successfully",
      );
      onOpenChange(false);
      reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error creating task:", error);
      const message =
        error instanceof Error ? error.message : "Failed to create task";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
    }
    onOpenChange(isOpen);
  };

  const submitLabel = isEditing ? "Save changes" : "Create task";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit task" : "Add new task"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the task details."
              : "Create a new task for your project."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Task title" {...register("title")} />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Add a description..."
              rows={3}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={selectedStatus}
                onValueChange={(value: TaskStatus) => setValue("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={selectedPriority}
                onValueChange={(value: TaskPriority) =>
                  setValue("priority", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select
                value={selectedAssignee || "unassigned"}
                onValueChange={(value) =>
                  setValue("assigneeId", value === "unassigned" ? null : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {members.map((member: ProjectMember) => (
                    <SelectItem key={member.id} value={member.userId}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage
                            src={member.user.avatarUrl || undefined}
                          />
                          <AvatarFallback className="text-[10px]">
                            {member.user.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{member.user.fullName}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Due date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDueDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDueDate
                      ? format(selectedDueDate, "PPP")
                      : "No date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDueDate || undefined}
                    onSelect={(date) => setValue("dueDate", date || null)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Saving..." : "Creating..."}
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

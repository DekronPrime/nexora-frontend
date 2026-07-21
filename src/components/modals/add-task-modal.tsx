"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Calendar } from "@/src/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { useMembers, useTasks } from "@/src/hooks";
import { TaskStatus, TaskPriority, ProjectMember } from "@/src/types";
import { toast } from "sonner";
import { cn } from "@/src/lib/utils";
import { format } from "date-fns";
import { Loader2, CalendarIcon } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";

const addTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(3000).optional(),
  status: z.enum(["todo", "in_progress", "review", "done"] as const),
  priority: z.enum(["low", "medium", "high", "urgent"] as const),
  assigneeId: z.string().nullable().optional(),
  dueDate: z.date().nullable().optional(),
});

type AddTaskFormData = z.infer<typeof addTaskSchema>;

interface AddTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  defaultStatus?: TaskStatus;
}

export function AddTaskModal({
  open,
  onOpenChange,
  projectId,
  defaultStatus = "todo",
}: AddTaskModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { members = [] } = useMembers(projectId);
  const { createTask } = useTasks({ projectId });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddTaskFormData>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: {
      status: defaultStatus,
      priority: "medium",
      assigneeId: null,
      dueDate: null,
    },
  });

  const selectedAssignee = watch("assigneeId");
  const selectedPriority = watch("priority");
  const selectedStatus = watch("status");
  const selectedDueDate = watch("dueDate");

  const onSubmit = async (data: AddTaskFormData) => {
    setIsLoading(true);
    try {
      const taskPayload: any = {
        projectId,
        title: data.title,
        description: data.description || "",
        status: data.status,
        priority: data.priority,
      };

      // Only include assigneeId if it's set
      if (data.assigneeId) {
        taskPayload.assigneeId = data.assigneeId;
      }

      // Only include dueDate if it's set
      if (data.dueDate) {
        taskPayload.dueDate = data.dueDate.toISOString();
      }

      console.log("Creating task with data:", taskPayload);

      const result = await createTask(taskPayload);

      console.log("Task created successfully:", result);
      toast.success("Task created successfully");
      onOpenChange(false);
      reset();
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add new task</DialogTitle>
          <DialogDescription>
            Create a new task for your project.
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
                  Creating...
                </>
              ) : (
                "Create task"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

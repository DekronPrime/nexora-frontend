"use client";

import { Button } from "@/src/components/ui/button";
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
import { Textarea } from "@/src/components/ui/textarea";
import { useProjects } from "@/src/hooks";

import { cn } from "@/src/lib/utils";
import { Project } from "@/src/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Briefcase,
  Check,
  Code,
  Folder,
  GitBranch,
  Globe,
  Home,
  Layers,
  Loader2,
  Rocket,
  Star,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const colorPresets = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#6366F1",
];

export const iconPresets = [
  { id: "Folder", component: Folder },
  { id: "Briefcase", component: Briefcase },
  { id: "Code", component: Code },
  { id: "Globe", component: Globe },
  { id: "Home", component: Home },
  { id: "Layers", component: Layers },
  { id: "Rocket", component: Rocket },
  { id: "Star", component: Star },
  { id: "Zap", component: Zap },
  { id: "GitBranch", component: GitBranch },
];

export const iconMap = iconPresets.reduce(
  (acc, curr) => {
    acc[curr.id] = curr.component;
    return acc;
  },
  {} as Record<
    string,
    React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  >,
);

const projectSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .max(3000, "Description must be less than 3000 characters")
    .optional(),
  color: z.string().min(1, "Please select a color"),
  icon: z.string().min(1, "Please select an icon"),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project;
  onSuccess?: () => void;
}

export function ProjectModal({
  open,
  onOpenChange,
  project,
  onSuccess,
}: ProjectModalProps) {
  const router = useRouter();
  const { createProject, updateProject } = useProjects();
  const [isLoading, setIsLoading] = useState(false);

  const isEdit = !!project;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      color: colorPresets[0],
      icon: iconPresets[0].id,
    },
  });

  useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        description: project.description,
        color: project.color,
        icon: project.icon,
      });
    } else {
      reset({
        title: "",
        description: "",
        color: colorPresets[0],
        icon: iconPresets[0].id,
      });
    }
  }, [project, open, reset]);

  const selectedColor = watch("color");
  const selectedIcon = watch("icon");

  const onSubmit = async (data: ProjectFormData) => {
    setIsLoading(true);

    try {
      if (isEdit) {
        await updateProject(project.id, {
          title: data.title,
          description: data.description || "",
          color: data.color,
          icon: data.icon,
        });

        toast.success("Project updated");
      } else {
        const newProject = await createProject({
          title: data.title,
          description: data.description || "",
          color: data.color,
          icon: data.icon,
        });

        toast.success("Project created");

        router.push(`/projects/${newProject.id}`);
      }

      onOpenChange(false);
      reset();
      onSuccess?.();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to " + (isEdit ? "update" : "create") + " project";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit project" : "Create new project"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update your project information."
              : "Start organizing your tasks by creating a new project."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Project name</Label>
            <Input
              id="title"
              placeholder="My awesome project"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="What's this project about?"
              rows={3}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex justify-evenly flex-wrap gap-2">
              {colorPresets.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue("color", color)}
                  className={cn(
                    "w-20 h-10 rounded-lg transition-all",
                    selectedColor === color
                      ? "ring-2 ring-offset-2 ring-blue-500 scale-110"
                      : "hover:scale-105",
                  )}
                  style={{ backgroundColor: color }}
                >
                  {selectedColor === color && (
                    <Check className="w-4 h-4 text-white mx-auto" />
                  )}
                </button>
              ))}
            </div>
            {errors.color && (
              <p className="text-sm text-destructive">{errors.color.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {iconPresets.map((icon) => {
                const IconComponent = icon.component;
                return (
                  <button
                    key={icon.id}
                    type="button"
                    onClick={() => setValue("icon", icon.id)}
                    className={cn(
                      "w-14 h-14 rounded-lg border-2 flex items-center justify-center transition-all",
                      selectedIcon === icon.id
                        ? "border-blue-500 bg-blue-50 text-blue-600"
                        : "border-slate-200 hover:border-slate-300 text-slate-600",
                    )}
                  >
                    <IconComponent className="h-7 w-7" />
                  </button>
                );
              })}
            </div>
            {errors.icon && (
              <p className="text-sm text-destructive">{errors.icon.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEdit ? "Saving..." : "Creating..."}
                </>
              ) : isEdit ? (
                "Save changes"
              ) : (
                "Create project"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

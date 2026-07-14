"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Plus,
  Folder,
  Users,
  CheckCircle,
  Clock,
  MoreVertical,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProjects } from "@/hooks";
import {
  EmptyProjectsState,
  LoadingState,
  ErrorState,
} from "@/components/states";
import { CreateProjectModal } from "@/components/modals/create-project-modal";
import { Project, ProjectMember } from "@/types";
import { toast } from "sonner";

function ProjectCard({ project }: { project: Project }) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/projects/${project.id}`}>
        <Card className="group cursor-pointer hover:shadow-lg hover:border-blue-200 transition-all duration-200 overflow-hidden">
          <div className="h-2" style={{ backgroundColor: project.color }} />
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${project.color}20` }}
                >
                  <Folder
                    className="h-5 w-5"
                    style={{ color: project.color }}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {project._count?.tasks || 0} tasks
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link href={`/projects/${project.id}`} className="w-full">
                      View Project
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href={`/projects/${project.id}/settings`}
                      className="w-full"
                    >
                      Settings
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {project.description && (
              <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                {project.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {project.members?.slice(0, 4).map((member: ProjectMember) => (
                  <Avatar
                    key={member.id}
                    className="border-2 border-white h-7 w-7"
                  >
                    <AvatarImage src={member.user.avatarUrl || undefined} />
                    <AvatarFallback className="text-xs bg-slate-100">
                      {member.user.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {project._count?.members && project._count.members > 4 && (
                  <div className="h-7 w-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs text-slate-600">
                    +{project._count.members - 4}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export default function DashboardPage() {
  const {
    projects = [],
    isLoading,
    error,
    fetchProjects,
    deleteProject,
  } = useProjects();
  const projectsList = Array.isArray(projects) ? projects : [];

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleCreateProject = () => {
    setCreateModalOpen(true);
  };

  if (isLoading) {
    return <LoadingState message="Loading projects..." />;
  }

  if (error) {
    return <ErrorState message={error} retry={fetchProjects} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Manage your projects and tasks</p>
        </div>
        <Button onClick={handleCreateProject} className="gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {projectsList.length === 0 ? (
        <EmptyProjectsState onCreateNew={handleCreateProject} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projectsList.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}

            {/* Add Project Card */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: projectsList.length * 0.05 }}
              onClick={handleCreateProject}
              className="flex flex-col items-center justify-center gap-2 p-5 rounded-lg border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Plus className="h-6 w-6 text-slate-400 group-hover:text-blue-500" />
              </div>
              <span className="text-sm font-medium text-slate-600 group-hover:text-blue-600">
                Create new project
              </span>
            </motion.button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-8">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Folder className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {projectsList.length}
                    </p>
                    <p className="text-sm text-slate-500">Total Projects</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {projects.reduce(
                        (acc, p) => acc + (p._count?.tasks || 0),
                        0,
                      )}
                    </p>
                    <p className="text-sm text-slate-500">Total Tasks</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">0</p>
                    <p className="text-sm text-slate-500">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">0</p>
                    <p className="text-sm text-slate-500">Team Members</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <CreateProjectModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
    </div>
  );
}

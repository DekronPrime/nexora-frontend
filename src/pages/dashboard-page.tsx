"use client";

import { ProjectModal } from "@/src/components/modals/project-modal";
import { ProjectCard } from "@/src/components/projects/project-card";
import {
  EmptyProjectsState,
  ErrorState,
  LoadingState,
} from "@/src/components/states";
import { Button } from "@/src/components/ui/button";
import { useProjects } from "@/src/hooks";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  Folder,
  LayoutDashboard,
  Plus,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Project } from "../types";
import { Card, CardContent } from "../components/ui/card";

export const DashboardPage = () => {
  const {
    projects = [],
    isLoading,
    error,
    fetchProjects,
    deleteProject,
  } = useProjects();
  const projectsList = Array.isArray(projects) ? projects : [];

  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();

  const handleCreateProject = () => {
    setSelectedProject(undefined);
    setProjectModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setProjectModalOpen(true);
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
        <div className="flex items-center gap-2">
          <LayoutDashboard
            className="h-12 w-12 text-slate-900"
            fill="currentColor"
          />
          <div>
            <h1 className="text-2xl font-bold font-unbounded text-slate-900">
              Dashboard
            </h1>
            <p className="text-slate-700 font-sofia">
              Manage your recent projects you've been working on
            </p>
          </div>
        </div>

        <Button onClick={handleCreateProject} className="gap-2">
          <Plus className="h-5 w-5" />
          New Project
        </Button>
      </div>

      {projectsList.length === 0 ? (
        <EmptyProjectsState onCreateNew={handleCreateProject} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 my-8">
            <Card className="border-l-[6px] border-blue-600 shadow-md rounded-r-lg rounded-l-none">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Folder className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 inline-flex items-center gap-2">
                      {projectsList.length}/5{" "}
                      <span className="text-xs font-bold font-inter leading-none text-blue-600 py-1 px-2 rounded-full bg-blue-100">
                        Free Plan
                      </span>
                    </p>
                    <p className="text-sm font-bold font-sofia text-slate-500">
                      Total Projects
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-[6px] border-amber-600 shadow-md rounded-r-lg rounded-l-none">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {projects.reduce((acc, p) => acc + (p.taskCount || 0), 0)}
                    </p>
                    <p className="text-sm font-bold font-sofia text-slate-500">
                      Total Tasks
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-[6px] border-emerald-600 shadow-md rounded-r-lg rounded-l-none">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {projects.reduce(
                        (acc, p) => acc + (p.completedTaskCount || 0),
                        0,
                      )}
                    </p>
                    <p className="text-sm font-bold font-sofia text-slate-500">
                      Completed Tasks
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-[6px] border-purple-600 shadow-md rounded-r-lg rounded-l-none">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">1</p>
                    <p className="text-sm font-bold font-sofia text-slate-500">
                      Team Members
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
            {projectsList.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleEditProject}
              />
            ))}

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: projectsList.length * 0.05 }}
              onClick={handleCreateProject}
              className="flex flex-col items-center justify-center gap-2 p-5 rounded-lg border-2 border-dashed min-h-[184px] border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center group-hover:bg-blue-500 transition-all">
                <Plus className="h-6 w-6 text-slate-700 group-hover:text-slate-200" />
              </div>
              <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600">
                Create new project
              </span>
            </motion.button>
          </div>
        </>
      )}

      <ProjectModal
        open={projectModalOpen}
        onOpenChange={setProjectModalOpen}
        project={selectedProject}
        onSuccess={() => fetchProjects()}
      />
    </div>
  );
};

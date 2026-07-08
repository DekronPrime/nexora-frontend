"use client";

import { useState, useEffect, useCallback } from "react";
import { Project, CreateProjectDto, UpdateProjectDto } from "@/types";
import { projectsService } from "@/lib/services";
import { useAuth } from "@/contexts";

interface UseProjectsReturn {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (data: CreateProjectDto) => Promise<Project>;
  updateProject: (id: string, data: UpdateProjectDto) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
}

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchProjects = useCallback(async () => {
    if (!isAuthenticated) {
      setProjects([]);
      setIsLoading(false);
      return;
    }

    console.log(isAuthenticated);

    setIsLoading(true);
    setError(null);
    try {
      const data = await projectsService.getAll();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch projects");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (data: CreateProjectDto): Promise<Project> => {
    const project = await projectsService.create(data);
    setProjects((prev) => [...prev, project]);
    return project;
  };

  const updateProject = async (
    id: string,
    data: UpdateProjectDto,
  ): Promise<Project> => {
    const project = await projectsService.update(id, data);
    setProjects((prev) => prev.map((p) => (p.id === id ? project : p)));
    return project;
  };

  const deleteProject = async (id: string): Promise<void> => {
    await projectsService.delete(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return {
    projects,
    isLoading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}

export function useProject(id: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchProject = useCallback(async () => {
    if (!id || !isAuthenticated) {
      setProject(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await projectsService.getById(id);
      setProject(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch project");
    } finally {
      setIsLoading(false);
    }
  }, [id, isAuthenticated]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const updateProject = async (data: UpdateProjectDto): Promise<Project> => {
    const updated = await projectsService.update(id, data);
    setProject(updated);
    return updated;
  };

  const deleteProject = async (): Promise<void> => {
    await projectsService.delete(id);
    setProject(null);
  };

  return {
    project,
    isLoading,
    error,
    fetchProject,
    updateProject,
    deleteProject,
  };
}

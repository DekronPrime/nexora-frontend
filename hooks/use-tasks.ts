'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, CreateTaskDto, UpdateTaskDto, TaskStatus, TaskFilters } from '@/types';
import { tasksService } from '@/lib/services';
import { useAuth } from '@/contexts';

interface UseTasksReturn {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (data: CreateTaskDto) => Promise<Task>;
  updateTask: (id: string, data: UpdateTaskDto) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<Task>;
}

export function useTasks(filters?: TaskFilters): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const projectId = filters?.projectId;
  const status = filters?.status;
  const priority = filters?.priority;
  const assigneeId = filters?.assigneeId;

  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = projectId
        ? await tasksService.getByProject(projectId)
        : await tasksService.getAll({ projectId, status, priority, assigneeId });
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  }, [projectId, status, priority, assigneeId, isAuthenticated]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (data: CreateTaskDto): Promise<Task> => {
    const task = await tasksService.create(data);
    setTasks((prev) => [...prev, task]);
    return task;
  };

  const updateTask = async (id: string, data: UpdateTaskDto): Promise<Task> => {
    const task = await tasksService.update(id, data);
    setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
    return task;
  };

  const deleteTask = async (id: string): Promise<void> => {
    await tasksService.delete(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTaskStatus = async (id: string, status: TaskStatus): Promise<Task> => {
    return updateTask(id, { status });
  };

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
  };
}

export function useProjectTasks(projectId: string) {
  return useTasks({ projectId });
}

export function useTask(id: string) {
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchTask = useCallback(async () => {
    if (!id || !isAuthenticated) {
      setTask(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await tasksService.getById(id);
      setTask(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch task');
    } finally {
      setIsLoading(false);
    }
  }, [id, isAuthenticated]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const updateTask = async (data: UpdateTaskDto): Promise<Task> => {
    const updated = await tasksService.update(id, data);
    setTask(updated);
    return updated;
  };

  const deleteTask = async (): Promise<void> => {
    await tasksService.delete(id);
    setTask(null);
  };

  return {
    task,
    isLoading,
    error,
    fetchTask,
    updateTask,
    deleteTask,
  };
}

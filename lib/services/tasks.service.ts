import { apiClient } from '@/lib/api-client';
import {
  Task,
  CreateTaskDto,
  UpdateTaskDto,
  TaskStatus,
  TaskPriority,
} from '@/types';

interface TaskFilters {
  projectId?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
}

function buildQueryString(filters: TaskFilters): string {
  const params = new URLSearchParams();
  if (filters.projectId) params.append('projectId', filters.projectId);
  if (filters.status) params.append('status', filters.status);
  if (filters.priority) params.append('priority', filters.priority);
  if (filters.assigneeId) params.append('assigneeId', filters.assigneeId);
  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

export const tasksService = {
  async getAll(filters?: TaskFilters): Promise<Task[]> {
    const queryString = filters ? buildQueryString(filters) : '';
    const response = await apiClient.get<{ data: Task[] }>(`/tasks${queryString}`);
    return response.data;
  },

  async getByProject(projectId: string): Promise<Task[]> {
    const response = await apiClient.get<{ data: Task[] }>(`/tasks/project/${projectId}`);
    return response.data;
  },

  async getById(id: string): Promise<Task> {
    const response = await apiClient.get<{ data: Task }>(`/tasks/${id}`);
    return response.data;
  },

  async create(data: CreateTaskDto): Promise<Task> {
    const response = await apiClient.post<{ data: Task }>('/tasks', data);
    return response.data;
  },

  async update(id: string, data: UpdateTaskDto): Promise<Task> {
    const response = await apiClient.patch<{ data: Task }>(`/tasks/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  },

  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    return this.update(id, { status });
  },
};

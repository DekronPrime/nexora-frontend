import { apiClient } from "@/src/lib/api-client";
import { Project, CreateProjectDto, UpdateProjectDto } from "@/src/types";

function normalizeProjectPayload<T>(payload: unknown): T {
  if (Array.isArray(payload)) {
    return payload as T;
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (record.data !== undefined) {
      return normalizeProjectPayload(record.data as unknown) as T;
    }
    return payload as T;
  }

  return payload as T;
}

export const projectsService = {
  async getAll(): Promise<Project[]> {
    const response = await apiClient.get<unknown>("/projects");
    const payload = normalizeProjectPayload<unknown>(response);
    return Array.isArray(payload) ? (payload as Project[]) : [];
  },

  async getById(id: string): Promise<Project> {
    const response = await apiClient.get<unknown>(`/projects/${id}`);
    const payload = normalizeProjectPayload<unknown>(response);
    return payload as Project;
  },

  async create(data: CreateProjectDto): Promise<Project> {
    const response = await apiClient.post<unknown>("/projects", data);
    const payload = normalizeProjectPayload<unknown>(response);
    return payload as Project;
  },

  async update(id: string, data: UpdateProjectDto): Promise<Project> {
    const response = await apiClient.patch<unknown>(`/projects/${id}`, data);
    const payload = normalizeProjectPayload<unknown>(response);
    return payload as Project;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/projects/${id}`);
  },
};

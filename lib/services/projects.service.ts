import { apiClient } from "@/lib/api-client";
import { Project, CreateProjectDto, UpdateProjectDto } from "@/types";

export const projectsService = {
  async getAll(): Promise<Project[]> {
    const response = await apiClient.get<{ data: Project[] }>("/projects");
    console.log(response);
    console.log(...response);
    return response.data;
  },

  async getById(id: string): Promise<Project> {
    const response = await apiClient.get<{ data: Project }>(`/projects/${id}`);
    return response.data;
  },

  async create(data: CreateProjectDto): Promise<Project> {
    const response = await apiClient.post<{ data: Project }>("/projects", data);
    return response.data;
  },

  async update(id: string, data: UpdateProjectDto): Promise<Project> {
    const response = await apiClient.patch<{ data: Project }>(
      `/projects/${id}`,
      data,
    );
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/projects/${id}`);
  },
};

// User Types
export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Project Types
export interface Project {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  ownerId: string;
  owner?: User;
  createdAt: string;
  updatedAt: string;
  members?: ProjectMember[];
  _count?: {
    tasks: number;
    members: number;
  };
}

export interface CreateProjectDto {
  title: string;
  description?: string;
  color: string;
  icon: string;
}

export interface UpdateProjectDto {
  title?: string;
  description?: string;
  color?: string;
  icon?: string;
}

// Task Types
export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string | null;
  assignee?: User | null;
  createdBy: string;
  creator?: User;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface CreateTaskDto {
  projectId: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string | null;
  dueDate?: string | null;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string | null;
  dueDate?: string | null;
}

// Task Filters
export interface TaskFilters {
  projectId?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
}

// Project Member Types
export type MemberRole = "owner" | "member";

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  user: User;
  role: MemberRole;
  joinedAt: string;
}

export interface InviteMemberDto {
  projectId: string;
  email: string;
  role: MemberRole;
}

// Activity Log Types
export interface ActivityLog {
  id: string;
  projectId: string;
  taskId: string | null;
  userId: string;
  user?: User;
  action: string;
  entityType: string;
  entityId: string;
  oldValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

// Notification Types
export type NotificationType =
  | "task_assigned"
  | "project_invitation"
  | "task_completed"
  | "mention";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  isRead: boolean;
  createdAt: string;
}

// Auth Types
export interface LoginDto {
  email: string;
  password: string;
}

export interface SignupDto {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface UpdateProfileDto {
  fullName?: string;
  avatarUrl?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  status: "fail";
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  statusCode: number;
  timestamp: string;
  path: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface KanbanColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  color: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number | "Custom";
  period?: string;
  features: string[];
  buttonText: string;
  featured?: boolean;
  badge?: string;
  owned?: boolean;
}

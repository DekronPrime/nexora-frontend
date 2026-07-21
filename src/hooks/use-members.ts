"use client";

import { useState, useEffect, useCallback } from "react";
import { ProjectMember, InviteMemberDto } from "@/src/types";
import { membersService } from "@/src/lib/services";
import { useAuth } from "@/src/contexts";

interface UseMembersReturn {
  members: ProjectMember[];
  isLoading: boolean;
  error: string | null;
  fetchMembers: () => Promise<void>;
  inviteMember: (data: InviteMemberDto) => Promise<ProjectMember>;
  removeMember: (memberId: string) => Promise<void>;
  leaveProject: () => Promise<void>;
}

export function useMembers(projectId: string): UseMembersReturn {
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchMembers = useCallback(async () => {
    if (!projectId || !isAuthenticated) {
      setMembers([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await membersService.getProjectMembers(projectId);
      setMembers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch members");
    } finally {
      setIsLoading(false);
    }
  }, [projectId, isAuthenticated]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const inviteMember = async (
    data: InviteMemberDto,
  ): Promise<ProjectMember> => {
    const member = await membersService.invite(data);
    setMembers((prev) => [...prev, member]);
    return member;
  };

  const removeMember = async (memberId: string): Promise<void> => {
    await membersService.remove(memberId);
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  const leaveProject = async (): Promise<void> => {
    await membersService.leave(projectId);
    setMembers([]);
  };

  return {
    members,
    isLoading,
    error,
    fetchMembers,
    inviteMember,
    removeMember,
    leaveProject,
  };
}

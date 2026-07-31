import { apiClient } from "@/src/lib/api-client";
import { ChangePasswordDto, User } from "@/src/types";

export const userService = {
    async update(data: ChangePasswordDto): Promise<User> {
        const response = await apiClient.post<unknown>("/user/password", data);
        return response as User;
    },
};

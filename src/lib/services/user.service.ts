import { apiClient } from "@/src/lib/api-client";
import { ChangePasswordDto, UpdateProfileDto, User } from "@/src/types";

export const userService = {
    async update(data: UpdateProfileDto) {
        const response = await apiClient.patch<User>("/user/profile/update", data);
        return response;
    },

    async changePassword(data: ChangePasswordDto) {
        await apiClient.patch<void>("/user/password/update", data);
    },
};

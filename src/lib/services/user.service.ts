import { apiClient } from "@/src/lib/api-client";
import { ChangePasswordDto, User } from "@/src/types";

export const userService = {
    async update(data: ChangePasswordDto) {
        const response = await apiClient.patch<unknown>("/user/password", data);
        console.log("Password updated successfully:", response);
    },
};

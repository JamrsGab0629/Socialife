import { changePassword } from "../../../helpers/settings/settings.request";

export async function change_password(payload) {
    try {
        const response = await changePassword(payload);

        if (response?.error || response?.success === false) {
            throw new Error(response?.message || "Failed to change password.");
        }

        return response;
    } catch (error) {
        throw new Error(
            error?.response?.data?.message ||
            error?.message ||
            "An unexpected error occurred while updating password."
        );
    }
}
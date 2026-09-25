import Request from "../../core/request";

/**
 * Fetches the logged-in user's full profile.
 * @returns {Promise<Object>} API response payload.
 */
export async function get_my_profile() {
    try {
        return await Request({
            param: `/profiles/me`,
            method: "GET",
            args: {},
        });
    } catch (error) {
        console.error("Failed inside get_my_profile request helper:", error);
        throw error;
    }
}

/**
 * Uploads a new profile picture.
 * @param {FormData} formData - must contain the file under the "image" field.
 * @returns {Promise<Object>} API response payload.
 */
export async function update_profile_picture(formData) {
    try {
        return await Request({
            param: `/profiles/picture`,
            method: "PUT",
            args: formData,
        });
    } catch (error) {
        console.error("Failed inside update_profile_picture request helper:", error);
        throw error;
    }
}
/**
 * Removes the current profile picture (resets to default).
 * @returns {Promise<Object>} API response payload.
 */
export async function remove_profile_picture() {
    try {
        return await Request({
            param: `/profiles/picture`,
            method: "DELETE",
            args: {},
        });
    } catch (error) {
        console.error("Failed inside remove_profile_picture request helper:", error);
        throw error;
    }
}
/**
 * Uploads a new cover photo.
 * @param {FormData} formData - must contain the file under the "image" field.
 * @returns {Promise<Object>} API response payload.
 */
export async function update_cover_photo(formData) {
    try {
        return await Request({
            param: `/profiles/cover`,
            method: "PUT",
            args: formData,
        });
    } catch (error) {
        console.error("Failed inside update_cover_photo request helper:", error);
        throw error;
    }
}

/**
 * Removes the current cover photo (resets to default).
 * @returns {Promise<Object>} API response payload.
 */
export async function remove_cover_photo() {
    try {
        return await Request({
            param: `/profiles/cover`,
            method: "DELETE",
            args: {},
        });
    } catch (error) {
        console.error("Failed inside remove_cover_photo request helper:", error);
        throw error;
    }
}

/**
 * Fetches another user's profile header info (name, friend count, avatar, cover).
 * @param {string|number} userId
 * @returns {Promise<Object>} API response payload.
 */
export async function get_user_profile_stats(userId) {
    try {
        return await Request({
            param: `/profiles/${userId}/friend-stats`,
            method: "GET",
            args: {},
        });
    } catch (error) {
        console.error("Failed inside get_user_profile_stats request helper:", error);
        throw error;
    }
}
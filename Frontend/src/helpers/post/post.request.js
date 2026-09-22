import Request from "../../core/request";

/**
 * Sends the create post FormData to the backend API.
 * @param {FormData} formData - The multipart form data containing caption and image.
 * @returns {Promise<Object>} API response payload.
 */
export async function post_content(formData) {
    try {
        return await Request({
            param: `/posts/`,
            method: "POST",
            args: formData,
        });
    } catch (error) {
        console.error("Failed inside post_content request helper:", error);
        throw error;
    }
}

export async function like_content(args) {
    try {
        return await Request({
            param: `/posts/${args.content_id}/like`,
            method: "POST",
            args: args,
        });
    } catch (error) {
        console.error("Failed inside like_content:", error);
        throw error;
    }
}

export async function comment_content(args) {
    try {
        return await Request({
            param: `/posts/${args.content_id}/comments`,
            method: "POST",
            args: args,
        });
    } catch (error) {
        console.error("Failed inside comment_content:", error);
        throw error;
    }
}
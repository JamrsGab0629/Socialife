import Request from "../../core/request";

/**
 * Submits a new post payload with optional media attachment.
 * @param {FormData} formData - The multipart form data.
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

/**
 * Toggles a like on a post.
 * @param {string|number} postId - The ID of the post.
 * @returns {Promise<Object>} API response payload.
 */
export async function like_content(postId) {
    try {
        return await Request({
            param: `/posts/${postId}/like`,
            method: "POST",
            args: {},
        });
    } catch (error) {
        console.error("Failed inside like_content request helper:", error);
        throw error;
    }
}

/**
 * Adds a comment to a post.
 * @param {string|number} postId - The ID of the post.
 * @param {string} commentText - The text content of the comment.
 * @returns {Promise<Object>} API response payload.
 */
export async function comment_content(postId, commentText) {
    try {
        return await Request({
            param: `/posts/${postId}/comments`,
            method: "POST",
            args: { comment: commentText },
        });
    } catch (error) {
        console.error("Failed inside comment_content request helper:", error);
        throw error;
    }
}

/**
 * Fetches comments for a specific post.
 * @param {string|number} postId - The ID of the post.
 * @param {number} page - Page number.
 * @param {number} limit - Limit per page.
 * @returns {Promise<Object>} API response payload.
 */
export async function get_comments(postId, page = 1, limit = 10) {
    try {
        return await Request({
            param: `/posts/${postId}/comments`,
            method: "GET",
            args: { page, limit },
        });
    } catch (error) {
        console.error("Failed inside get_comments request helper:", error);
        throw error;
    }
}

export async function reply_content(postId, parentId, commentText) {
    return Request({
        param: `/posts/${postId}/${parentId}/replies`,
        method: "POST",
        args: { comment: commentText },
    });
}

export async function get_replies(postId, parentId) {
    return Request({
        param: `/posts/${postId}/${parentId}/replies`,
        method: "GET",
    });
}

export async function save_post(postId) {
    return Request({
        param: `/saved-posts/${postId}`,
        method: "POST",
        args: {},
    });
}

export async function unsave_post(postId) {
    return Request({
        param: `/saved-posts/${postId}`,
        method: "DELETE",
        args: {},
    });
}

export async function share_post(postId, caption = "") {
    return Request({
        param: `/posts/${postId}/share`,
        method: "POST",
        args: { caption },
    });
}
/**
 * Fetches a user's profile feed (posts + shares, paginated).
 * @param {string|number} userId - The ID of the profile owner.
 * @param {number} page - Page number.
 * @param {number} limit - Limit per page.
 * @returns {Promise<Object>} API response payload.
 */
export async function get_profile_feed(userId, page = 1, limit = 10) {
    try {
        return await Request({
            param: `/posts/user/${userId}`,
            method: "GET",
            args: { page, limit },
        });
    } catch (error) {
        console.error("Failed inside get_profile_feed request helper:", error);
        throw error;
    }
}

/**
 * Fetches a single post by its ID.
 * @param {string|number} postId
 * @returns {Promise<Object>} API response payload.
 */
export async function get_post_by_id(postId) {
    try {
        return await Request({
            param: `/posts/${postId}`,
            method: "GET",
            args: {},
        });
    } catch (error) {
        console.error("Failed inside get_post_by_id request helper:", error);
        throw error;
    }
}

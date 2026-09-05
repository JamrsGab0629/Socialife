import { post_content } from "../../helpers/post/post.request.js";

/**
 * Submits a new post payload with optional media attachment.
 * @param {string|number} user_id - Author ID.
 * @param {Object} data - Post payload details (e.g., caption/privacy).
 * @param {File|null} file - Optional file attachment.
 * @returns {Promise<Object>} API response payload.
 */
export async function createPostService(user_id, data = {}, file = null) {
  try {
    const formData = new FormData();

    // Attach text/metadata
    formData.append("user_id", user_id);
    if (data.caption) formData.append("caption", data.caption);

    // Attach file if present
    if (file) {
      formData.append("media", file);
    }

    const response = await post_content(formData);
    return response;
  } catch (error) {
    console.error("Failed to execute createPostService:", error);
    throw error;
  }
}
import { post_content } from "../../helpers/post/post.request.js";

/**
 * Submits a new post payload with optional media attachment.
 * @param {string|number} user_id - Author ID.
 * @param {Object} data - Post payload details (e.g., caption/content).
 * @param {File|null} file - Optional image file attachment.
 * @returns {Promise<Object>} API response payload.
 */
export async function createPostService(user_id, data = {}, file = null) {
  try {
    const formData = new FormData();

    if (user_id && user_id !== "CURRENT_USER_ID") {
      formData.append("user_id", user_id);
    }

    const caption = (data.caption || "").trim();
    const content = (data.content || caption).trim();

    if (caption) formData.append("caption", caption);
    if (content) formData.append("content", content);

    // Multer upload middleware expects field name 'image'
    if (file) {
      formData.append("image", file);
      formData.append("media", file);
    }

    const response = await post_content(formData);
    return response;
  } catch (error) {
    console.error("Failed to execute createPostService:", error);
    throw error;
  }
}
import Request from "../../core/request.js";

/**
 * Fetches the paginated home feed using the backend's hybrid loader.
 * @param {number} [page=1]
 * @param {number} [limit=10]
 * @returns {Promise<{ success: boolean, data: Array<Object>, pagination: Object }>}
 */
export async function fetchHomeFeed(page = 1, limit = 10) {
    try {
        const result = await Request({
            param: "/posts",
            method: "GET",
            args: { page, limit }
        });

        if (result && result.success) {
            return result;
        } else {
            console.error("Failed to load home feed:", result?.message || "Unknown error");
            return result;
        }
    } catch (error) {
        console.error("Network error fetching home feed:", error);
        throw error;
    }
}

export default fetchHomeFeed;
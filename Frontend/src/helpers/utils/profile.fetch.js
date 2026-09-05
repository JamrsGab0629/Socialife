import Request from "/core/request";

async function fetchProfileFeed(userId, page = 1, limit = 10) {
    try {
        // Pass query parameters via `args` since Request maps GET args to config.params
        const result = await Request({
            param: `/posts/user/${userId}`,
            method: "GET",
            args: { page, limit }
        });

        if (result && result.success) {
            console.log("Profile Posts:", result.data);
            return result;
        } else {
            console.error("Failed to load profile feed:", result?.message || "Unknown error");
            return result;
        }
    } catch (error) {
        console.error("Network error fetching profile feed:", error);
        throw error;
    }
}
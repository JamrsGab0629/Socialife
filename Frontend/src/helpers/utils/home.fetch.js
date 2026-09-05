import Request from "/core/request";

async function fetchHomeFeed(page = 1, limit = 10) {
    try {
        const result = await Request({
            param: "/posts",
            method: "GET",
            args: { page, limit }
        });

        if (result && result.success) {
            console.log("Home Posts:", result.data);
            console.log("Pagination Meta:", result.pagination);
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
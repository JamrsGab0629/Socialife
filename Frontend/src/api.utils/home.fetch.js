async function fetchHomeFeed(page = 1, limit = 10) {
    try {
        const response = await fetch(`http://localhost:3000/api/posts?page=${page}&limit=${limit}`, {
            method: "GET",
            credentials: "include" // paki send cookie dito
        });

        const result = await response.json();

        if (result.success) {
            console.log("Home Posts:", result.data);
            console.log("Pagination Meta:", result.pagination);
            return result;
        } else {
            console.error("Failed to load home feed:", result.message);
        }
    } catch (error) {
        console.error("Network error fetching home feed:", error);
    }
}
async function fetchProfileFeed(userId, page = 1, limit = 10) {
    try {
        const response = await fetch(`http://localhost:3000/api/posts/user/${userId}?page=${page}&limit=${limit}`, {
            method: "GET",
            credentials: "include" // Crucial for cookies
        });

        const result = await response.json();

        if (result.success) {
            console.log("Profile Posts:", result.data);
            return result;
        } else {
            console.error("Failed to load profile feed:", result.message);
        }
    } catch (error) {
        console.error("Network error fetching profile feed:", error);
    }
}
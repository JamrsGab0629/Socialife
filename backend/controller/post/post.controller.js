import * as postService from "../../services/post.service.js";

export const createPost = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.user_id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID not found in token" });
        }

        const result = await postService.createPostService(userId, req.body, req.file);
        return res.status(201).json({ success: true, message: "Post created successfully!", data: result });
    } catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

export const getHomeFeed = async (req, res) => {
    try {
        const result = await postService.getHomeFeedService(req.query);
        return res.status(200).json({ success: true, message: "Home feed fetched successfully", ...result });
    } catch (error) {
        console.error("Error fetching home feed:", error);
        return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

export const getProfileFeed = async (req, res) => {
    try {
        const result = await postService.getProfileFeedService(req.params.userId, req.query);
        return res.status(200).json({ success: true, message: "Profile posts fetched successfully", ...result });
    } catch (error) {
        console.error("Error fetching profile feed:", error);
        return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

export const deactivatePost = async (req, res) => {
    try {
        const userId = req.user?.userId || req.user?.user_id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID not found in token" });
        }

        await postService.deactivatePostService(req.params.postId, userId);
        return res.status(200).json({ success: true, message: "Post deactivated successfully" });
    } catch (error) {
        console.error("Error deactivating post:", error);
        return res.status(400).json({ success: false, message: error.message || "Internal server error" });
    }
};
import * as likeService from "../services/like.service.js";

export const toggleLike = async (req, res) => {
    try {
        const userId = req.user?.userId || req.user?.user_id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID not found in token" });
        }

        const result = await likeService.toggleLikeService(req.params.postId, userId);
        return res.status(200).json({
            success: true,
            message: result.liked ? "Post liked" : "Post unliked",
            data: result
        });
    } catch (error) {
        console.error("Error toggling like:", error);
        return res.status(400).json({ success: false, message: error.message || "Internal server error" });
    }
};
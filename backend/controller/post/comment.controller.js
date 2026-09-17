import * as commentService from "../../services/comment.service.js";

export const addComment = async (req, res) => {
    try {
        const userId = req.user?.userId || req.user?.user_id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID not found in token" });
        }

        const { comment } = req.body;
        if (!comment || comment.trim() === "") {
            return res.status(400).json({ success: false, message: "Comment body cannot be empty" });
        }

        const result = await commentService.addCommentService(req.params.postId, userId, comment);
        return res.status(201).json({
            success: true,
            message: "Comment added successfully",
            data: result
        });
    } catch (error) {
        console.error("Error adding comment:", error);
        return res.status(400).json({ success: false, message: error.message || "Internal server error" });
    }
};

export const addReply = async (req, res) => {
    try {
        const userId = req.user?.userId || req.user?.user_id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID not found in token" });
        }

        const { comment } = req.body;
        if (!comment || comment.trim() === "") {
            return res.status(400).json({ success: false, message: "Comment body cannot be empty" });
        }

        const result = await commentService.addReplyService(req.params.postId, req.params.parentId, userId, comment);
        return res.status(201).json({
            success: true,
            message: "Comment added successfully",
            data: result
        });
    } catch (error) {
        console.error("Error adding comment:", error);
        return res.status(400).json({ success: false, message: error.message || "Internal server error" });
    }
}

export const getComments = async (req, res) => {
    try {
        const result = await commentService.getCommentsService(req.params.postId, req.query);
        return res.status(200).json({
            success: true,
            message: "Comments fetched successfully",
            ...result
        });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

export const getReplies = async (req, res) => {
    try {
        const result = await commentService.getRepliesService(req.params.parentId, req.query);
        return res.status(200).json({
            success: true,
            message: "Comments fetched successfully",
            ...result
        });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
}
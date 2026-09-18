import * as commentService from "../../services/comment.service.js";

// Add a comment
export const addComment = async (req, res, next) => {
    try {
        const { postId } = req.validated.params;
        const { comment } = req.validated.body;

        const userId = req.user.user_id || req.user.userId;

        const result = await commentService.addCommentService(
            postId,
            userId,
            comment
        );

        return res.status(201).json({
            success: true,
            message: "Comment added successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

// Add a reply
export const addReply = async (req, res, next) => {
    try {
        const { postId, parentId } = req.validated.params;
        const { comment } = req.validated.body;

        const userId = req.user.user_id || req.user.userId;

        const result = await commentService.addReplyService(
            postId,
            parentId,
            userId,
            comment
        );

        return res.status(201).json({
            success: true,
            message: "Reply added successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

// Get comments
export const getComments = async (req, res, next) => {
    try {
        const { postId } = req.validated.params;
        const query = req.validated.query;

        const result = await commentService.getCommentsService(
            postId,
            query
        );

        return res.status(200).json({
            success: true,
            message: "Comments fetched successfully",
            ...result
        });
    } catch (error) {
        next(error);
    }
};

// Get replies
export const getReplies = async (req, res, next) => {
    try {
        const { postId, parentId } = req.validated.params;
        const query = req.validated.query;

        const result = await commentService.getRepliesService(
            postId,
            parentId,
            query
        );

        return res.status(200).json({
            success: true,
            message: "Replies fetched successfully",
            ...result
        });
    } catch (error) {
        next(error);
    }
};
import * as commentService from "../../services/comment.service.js";

export const addComment = async (req, res, next) => {
    try {
        const userId = req.user.user_id;

        const result = await commentService.addCommentService(
            req.params.postId,
            userId,
            req.body.comment
        );

        return res.status(201).json({
            success: true,
            message: "Comment added successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const addReply = async (req, res, next) => {
    try {
        const userId = req.user.user_id;

        const result = await commentService.addReplyService(
            req.params.postId,
            req.params.parentId,
            userId,
            req.body.comment
        );

        return res.status(201).json({
            success: true,
            message: "Reply added successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const getComments = async (req, res, next) => {
    try {
        const result = await commentService.getCommentsService(
            req.params.postId,
            req.query
        );

        return res.status(200).json({
            success: true,
            message: "Comments fetched successfully",
            ...result,
        });
    } catch (error) {
        next(error);
    }
};

export const getReplies = async (req, res, next) => {
    try {
        const result = await commentService.getRepliesService(
            req.params.postId,
            req.params.parentId,
            req.query
        );

        return res.status(200).json({
            success: true,
            message: "Replies fetched successfully",
            ...result,
        });
    } catch (error) {
        next(error);
    }
};
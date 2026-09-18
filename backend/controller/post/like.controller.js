// controller/post/like.controller.js

import * as likeService from "../../services/like.service.js";

export const toggleLike = async (req, res, next) => {
    try {
        const userId = req.user.userId || req.user.user_id;
        const { postId } = req.validated.params;

        const result = await likeService.toggleLikeService(
            postId,
            userId
        );

        return res.status(200).json({
            success: true,
            message: result.liked
                ? "Post liked"
                : "Post unliked",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};
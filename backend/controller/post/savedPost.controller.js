import * as savedPostService from "../../services/savedPost.service.js";

export const savePost = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.user_id;
        const { postId } = req.params;

        const result = await savedPostService.savePostService(userId, postId);

        return res.status(201).json({
            success: true,
            message: "Post saved successfully!",
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const unsavePost = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.user_id;
        const { postId } = req.params;

        const result = await savedPostService.unsavePostService(userId, postId);

        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getSavedPosts = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.user_id;
        const { page, limit } = req.query;

        const result = await savedPostService.getSavedPostsService(userId, page, limit);

        return res.status(200).json({
            success: true,
            message: "Saved posts fetched successfully",
            data: result.data,
            pagination: result.pagination
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
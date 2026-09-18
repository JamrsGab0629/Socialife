import * as savedPostService from "../../services/savedPost.service.js";

export const savePost = async (req, res, next) => {
    try {
        const userId = req.user.userId || req.user.user_id;
        const { postId } = req.validated.params; 

        const result = await savedPostService.savePostService(userId, postId);

        return res.status(201).json({
            success: true,
            message: "Post saved successfully!",
            data: result
        });
    } catch (error) {
        next(error); 
    }
};

export const unsavePost = async (req, res, next) => {
    try {
        const userId = req.user.userId || req.user.user_id;
        const { postId } = req.validated.params; 

        const result = await savedPostService.unsavePostService(userId, postId);

        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        next(error);
    }
};

export const getSavedPosts = async (req, res, next) => {
    try {
        const userId = req.user.userId || req.user.user_id;
        const query = req.validated.query; 

        const result = await savedPostService.getSavedPostsService(userId, query);

        return res.status(200).json({
            success: true,
            message: "Saved posts fetched successfully",
            data: result.data,
            pagination: result.pagination
        });
    } catch (error) {
        next(error);
    }
};
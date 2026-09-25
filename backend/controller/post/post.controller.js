import * as postService from "../../services/post.service.js";

export const createPost = async (req, res, next) => {
    try {
        const userId = req.user.userId || req.user.user_id;

        const result = await postService.createPostService(
            userId,
            req.validated.body,
            req.file
        );

        return res.status(201).json({
            success: true,
            message: "Post created successfully!",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const getHomeFeed = async (req, res, next) => {
    try {
        const userId = req.user.userId || req.user.user_id;
        const result = await postService.getHomeFeedService(
            userId,
            req.validated.query
        );

        return res.status(200).json({
            success: true,
            message: "Home feed fetched successfully",
            ...result
        });
    } catch (error) {
        next(error);
    }
};

export const getProfileFeed = async (req, res, next) => {
    try {
        const { userId } = req.validated.params;
        const query = req.validated.query;

        const result = await postService.getProfileFeedService(
            userId,
            query
        );

        return res.status(200).json({
            success: true,
            message: "Profile posts fetched successfully",
            ...result
        });
    } catch (error) {
        next(error);
    }
};

export const deactivatePost = async (req, res, next) => {
    try {
        const userId = req.user.userId || req.user.user_id;
        const { postId } = req.validated.params;

        await postService.deactivatePostService(postId, userId);

        return res.status(200).json({
            success: true,
            message: "Post deactivated successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const getPostById = async (req, res, next) => {
    try {
        const { postId } = req.params;

        const result = await postService.getPostByIdService(postId);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Post fetched successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const getUserPhotos = async (req, res, next) => {
    try {
        const { userId } = req.validated.params;
        const photos = await postService.getUserPhotosService(userId);

        return res.status(200).json({
            success: true,
            message: "User photos fetched successfully",
            data: photos
        });
    } catch (error) {
        next(error);
    }
};
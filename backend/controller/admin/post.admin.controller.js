import * as postServices from "../../services/post.admin.services.js";

/**
 * GET /api/admin/post/get/:status?
 */
export const getPosts = async (req, res) => {
    try {
        const status = req.params?.status ?? "ALL";
        const result = await postServices.getPosts(status, req.query);

        return res.status(200).json({
            success: true,
            message: "Posts fetched successfully",
            result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch posts",
        });
    }
};

/**
 * GET /api/admin/post/from/:username
 */
export const getByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const result = await postServices.getByUsername(username, req.query);

        return res.status(200).json({
            success: true,
            message: `Posts by user '${username}' fetched successfully`,
            result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch user posts",
        });
    }
};

/**
 * GET /api/admin/post/view/:postId
 */
export const viewPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const result = await postServices.viewPost(postId);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Post fetched successfully",
            result,
        });
    } catch (error) {
        if (error.status === 404 || error.message === "POST_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch post",
        });
    }
};

/**
 * PUT /api/admin/post/:postId/remove
 */
export const removePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const result = await postServices.removePost(postId);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Post status updated successfully",
            result,
        });
    } catch (error) {
        if (error.status === 404 || error.message === "POST_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to remove post",
        });
    }
};
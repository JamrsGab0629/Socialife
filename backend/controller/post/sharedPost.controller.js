import { createShareRecord } from "../../services/sharedPost.service.js";

export const sharePost = async (req, res, next) => {
    try {
        const userId = req.user?.userId || req.user?.user_id;

        if (!userId) {
            const error = new Error("Unauthorized: User ID missing from token payload");
            error.statusCode = 401;
            throw error;
        }

        const { postId } = req.validated.params; 
        const { caption } = req.validated.body; 

        const newShare = await createShareRecord(userId, postId, caption);

        return res.status(201).json({
            success: true,
            message: "Post shared successfully",
            data: newShare,
        });
    } catch (error) {
        next(error); 
    }
};

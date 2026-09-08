import * as sharedPostService from "../services/sharedPost.service.js";

export const sharePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { caption } = req.body;
    
    // Fallback support for both user_id and userId depending on your JWT payload
    const userId = req.user?.user_id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: User ID missing from token" });
    }

    const newShare = await sharedPostService.createShareRecord(userId, postId, caption);

    return res.status(201).json({
      success: true,
      message: "Post shared successfully",
      data: newShare,
    });
  } catch (error) {
    const statusCode = error.message === "Post not found or has been deactivated" ? 404 : 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};
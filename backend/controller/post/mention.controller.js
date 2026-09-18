
import { MentionService } from "../../services/mention.service.js";
import { NotificationService } from "../../services/notifications.service.js";
import { CommentService } from "../../services/comment.service.js";
import { PostService } from "../../services/post.service.js";

/**
 * Request body:
 * {
 *   mentions: string[],       // user UUIDs
 *   entityId: string,         // post_id or comment_id
 *   type: "comment" | "post"
 * }
 */

export const mentionController = async (req, res, next) => {
  try {
    const authorId = req.user?.userId || req.user?.user_id;

    if (!authorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      mentions = [],
      entityId,
      type = "comment",
    } = req.body;

    // Validate request input
    if (!mentions.length) {
      return res.status(400).json({
        success: false,
        message: "No recipients to mention",
      });
    }

    if (!entityId) {
      return res.status(400).json({
        success: false,
        message: "entityId is required",
      });
    }

    if (!["comment", "post"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mention type",
      });
    }

    // Verify entity existence
    if (type === "comment") {
      const comment = await CommentService.findById(entityId);

      if (!comment) {
        return res.status(404).json({
          success: false,
          message: "Comment not found",
        });
      }
    }

    if (type === "post") {
      const post = await PostService.findById(entityId, authorId);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }
    }

    const errors = [];
    const successfulNotifications = [];

    // Process mentions in parallel
    await Promise.all(
      mentions.map(async (recipientId) => {
        try {
          const mentionData =
            type === "comment"
              ? await MentionService.commentMention(
                  recipientId,
                  authorId
                )
              : await MentionService.postMention(
                  recipientId,
                  authorId
                );

          const notification =
            await NotificationService.createNotification(
              mentionData
            );

          successfulNotifications.push(notification);
        } catch (err) {
          errors.push({
            recipientId,
            message: err.message,
          });
        }
      })
    );

    const hasErrors = errors.length > 0;

    const status =
      hasErrors && successfulNotifications.length === 0
        ? 500
        : 200;

    return res.status(status).json({
      success: successfulNotifications.length > 0,
      data: successfulNotifications,
      ...(hasErrors && { errors }),
    });
  } catch (error) {
    next(error);
  }
};
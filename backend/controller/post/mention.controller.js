import { MentionService } from "../../services/mention.service";
import { NotificationService } from "../../services/notifications.service";
import { CommentService } from "../../services/comment.service";
import { PostService } from "../../services/post.service";

/**
 * Interface body = {
 *  mention: userId[],
 *  entityId: post_id || comment_id,
 *  type: comment || post,
 * }
 * */

export const mentionController = async (req, res) => {
  const authorId = req.user?.userId || req.user?.user_id;
  if (!authorId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  // Type can be either "comment" or "post"
  const { mentions = [], entityId, type = "comment" } = req.body;

  if (!mentions.length) {
    return res.status(400).json({ success: false, message: "No recipients to mention" });
  }

  if (!entityId) {
    return res.status(400).json({ success: false, message: "entityId is required" });
  }

  try {
    // 1. Verify existence using the appropriate service
    if (type === "comment") {
      const comment = await CommentService.findById(entityId);
      if (!comment) {
        return res.status(404).json({ success: false, message: "Comment not found" });
      }
    } else if (type === "post") {
      const post = await PostService.findById(entityId, authorId);
      if (!post) {
        return res.status(404).json({ success: false, message: "Post not found" });
      }
    } else {
      return res.status(400).json({ success: false, message: "Invalid mention type" });
    }

    const errors = [];
    const successfulNotifications = [];

    // 2. Dispatch mentions in parallel
    await Promise.all(
      mentions.map(async (recipientId) => {
        try {
          // Choose service method based on type
          const mentionData =
            type === "comment"
              ? await MentionService.commentMention(recipientId, authorId)
              : await MentionService.postMention(recipientId, authorId);

          const notification = await NotificationService.createNotification(mentionData);
          successfulNotifications.push(notification);
        } catch (err) {
          errors.push({ recipientId, message: err.message });
        }
      })
    );

    const hasErrors = errors.length > 0;
    const status = hasErrors && successfulNotifications.length === 0 ? 500 : 200;

    return res.status(status).json({
      success: successfulNotifications.length > 0,
      data: successfulNotifications,
      ...(errors.length > 0 && { errors }),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
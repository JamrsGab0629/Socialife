import { MentionService } from "../../services/mention.service.js";
import { NotificationService } from "../../services/notifications.service.js";
import { findCommentById } from "../../services/comment.service.js";
import { getPostById } from "../../services/post.service.js";

export const mentionController = async (req, res, next) => {
    try {
        const authorId = req.user.user_id || req.user.userId;

        const {
            mentions = [],
            entityId,
            type = "comment",
        } = req.body;

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

        // Verify entity
        if (type === "comment") {
            const comment = await findCommentById(entityId);

            if (!comment) {
                return res.status(404).json({
                    success: false,
                    message: "Comment not found",
                });
            }
        }

        if (type === "post") {
            const post = await getPostById(entityId, authorId);

            if (!post) {
                return res.status(404).json({
                    success: false,
                    message: "Post not found",
                });
            }
        }

        const results = await Promise.all(
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

                    return {
                        success: true,
                        data: notification,
                    };
                } catch (error) {
                    return {
                        success: false,
                        recipientId,
                        message: error.message,
                    };
                }
            })
        );

        const successfulNotifications = results
            .filter((result) => result.success)
            .map((result) => result.data);

        const errors = results.filter(
            (result) => !result.success
        );

        if (
            successfulNotifications.length === 0 &&
            errors.length > 0
        ) {
            return res.status(400).json({
                success: false,
                data: [],
                errors,
            });
        }

        return res.status(200).json({
            success: true,
            data: successfulNotifications,
            ...(errors.length > 0 && { errors }),
        });
    } catch (error) {
        next(error);
    }
};
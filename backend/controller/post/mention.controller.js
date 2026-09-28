import { MentionService } from "../../services/mention.service.js";
import * as notificationService from "../../services/notifications.service.js";
import { findCommentById } from "../../services/comment.service.js";
import { getPostByIdService } from "../../services/post.service.js";

export const mentionController = async (req, res, next) => {
    try {
        const authorId = req.user.user_id || req.user.userId;

        const {
            mentions = [],
            entityId,
            type = "comment",
        } = req.body;

        if (!Array.isArray(mentions) || mentions.length === 0) {
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

        // Resolve which post this mention belongs to, so the notification can link to it
        let postId = null;

        if (type === "comment") {
            const comment = await findCommentById(entityId);

            if (!comment) {
                return res.status(404).json({
                    success: false,
                    message: "Comment not found",
                });
            }

            postId = comment.post_id;
        } else {
            const post = await getPostByIdService(entityId);

            if (!post) {
                return res.status(404).json({
                    success: false,
                    message: "Post not found",
                });
            }

            postId = post.post_id;
        }

        const recipients = [...new Set(mentions)];

        const results = await Promise.all(
            recipients.map(async (recipientId) => {
                try {
                    if (recipientId === authorId) {
                        return {
                            success: false,
                            recipientId,
                            message: "You cannot mention yourself",
                        };
                    }

                    const mentionData =
                        type === "comment"
                            ? await MentionService.commentMention(recipientId, authorId, postId)
                            : await MentionService.postMention(recipientId, authorId, postId);

                    const notification =
                        await notificationService.createNotificationService(mentionData);

                    return { success: true, data: notification };
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

        const errors = results.filter((result) => !result.success);

        if (successfulNotifications.length === 0 && errors.length > 0) {
            return res.status(400).json({
                success: false,
                data: [],
                errors,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Mentions processed successfully",
            data: successfulNotifications,
            ...(errors.length > 0 && { errors }),
        });
    } catch (error) {
        next(error);
    }
};
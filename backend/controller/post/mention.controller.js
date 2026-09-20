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

        // console.log(mentions);

        // Validate mentions
        if (!Array.isArray(mentions) || mentions.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No recipients to mention",
            });
        }

        // Validate entity ID
        if (!entityId) {
            return res.status(400).json({
                success: false,
                message: "entityId is required",
            });
        }

        // Validate mention type
        if (!["comment", "post"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Invalid mention type",
            });
        }

        // Verify the comment or post exists
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
            const post = await getPostByIdService(entityId, authorId);

            if (!post) {
                return res.status(404).json({
                    success: false,
                    message: "Post not found",
                });
            }
        }

        // Create mentions and notifications concurrently
        const results = await Promise.all(
            mentions.map(async (recipientId) => {
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
                            ? await MentionService.commentMention(
                                  recipientId,
                                  authorId,
                                  entityId
                              )
                            : await MentionService.postMention(
                                  recipientId,
                                  authorId,
                                  entityId
                              );

                    // Updated to use the correct namespace function import
                    const notification =
                        await notificationService.createNotificationService(
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

        // Every mention failed
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

        // At least one mention succeeded
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
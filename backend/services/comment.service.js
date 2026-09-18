    import Sequelize from "sequelize";
    import { Post, User, CommentData } from "../model/association.model.js";
    import { hybridLoad } from "../utils/loaders/hybrid.loader.js";
    import { safeNotify } from "../utils/notify.utils.js";

    const notFound = (message) => {
    const error = new Error(message);
    error.statusCode = 404;
    return error;
    };

    export const addCommentService = async (postId, userId, comment) => {
    const t = await CommentData.sequelize.transaction();

    try {
        const post = await Post.findOne({
        where: {
            post_id: postId,
            is_active: true,
        },
        transaction: t,
        });

        if (!post) {
        throw notFound("Post not found");
        }

        const newComment = await CommentData.create(
        {
            post_id: postId,
            author_id: userId,
            comment,
        },
        {
            transaction: t,
        },
        );

        await post.increment("comment_count", {
        by: 1,
        transaction: t,
        });

        await t.commit();

        safeNotify(post.user_id, userId, "comment", "commented on your post.");

        return newComment;
    } catch (error) {
        if (!t.finished) {
        await t.rollback();
        }

        throw error;
    }
    };

    export const addReplyService = async (
    postId,
    parentId,
    userId,
    commentText,
    ) => {
    const t = await CommentData.sequelize.transaction();

    try {
        const post = await Post.findOne({
        where: {
            post_id: postId,
            is_active: true,
        },
        transaction: t,
        });

        if (!post) {
        throw notFound("Post not found");
        }

        const parentComment = await CommentData.findOne({
        where: {
            comment_data_id: parentId,
            post_id: postId,
        },
        transaction: t,
        });

        if (!parentComment) {
        throw notFound("Parent comment not found");
        }

        const newComment = await CommentData.create(
        {
            post_id: postId,
            author_id: userId,
            comment: commentText,
            parent_id: parentId,
        },
        {
            transaction: t,
        },
        );

        await post.increment("comment_count", {
        by: 1,
        transaction: t,
        });

        await t.commit();

        safeNotify(
        parentComment.author_id,
        userId,
        "reply",
        "replied to your comment.",
        );

        return newComment;
    } catch (error) {
        if (!t.finished) {
        await t.rollback();
        }

        throw error;
    }
    };

    export const getCommentsService = async (postId, query = {}) => {
    const page = Math.max(1, parseInt(query.page, 10) || 1);

    const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));

    return await hybridLoad(CommentData, {
        page,
        limit,

        where: {
        post_id: postId,
        parent_id: null,
        },

        attributes: {
        include: [
            [
            Sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM comment_data AS reply
                            WHERE reply.parent_id =
                            CommentData.comment_data_id
                        )`),
            "reply_count",
            ],
        ],
        },

        include: [
        {
            model: User,
            as: "author",
            attributes: ["user_id", "username", "profile_url"],
        },
        {
            model: CommentData,
            as: "replies",
            limit: 3,

            include: [
            {
                model: User,
                as: "author",
                attributes: ["user_id", "username", "profile_url"],
            },
            ],

            order: [["created_at", "ASC"]],
        },
        ],

        order: [["created_at", "DESC"]],
    });
    };

    export const getRepliesService = async (postId, parentId, query = {}) => {
    const parentComment = await CommentData.findOne({
        where: {
        comment_data_id: parentId,
        post_id: postId,
        },
    });

    if (!parentComment) {
        throw notFound("Parent comment not found");
    }

    const page = Math.max(1, parseInt(query.page, 10) || 1);

    const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));

    return await hybridLoad(CommentData, {
        page,
        limit,

        where: {
        post_id: postId,
        parent_id: parentId,
        },

        attributes: {
        include: [
            [
            Sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM comment_data AS nested_reply
                            WHERE nested_reply.parent_id =
                            CommentData.comment_data_id
                        )`),
            "reply_count",
            ],
        ],
        },

        include: [
        {
            model: User,
            as: "author",
            attributes: ["user_id", "username", "profile_url"],
        },
        ],

        order: [["created_at", "ASC"]],
    });
    };

    export const getPostById = async (postId) => {
    return await Post.findByPk(postId);
    };

    export const findCommentById = async (commentId) => {
    return await CommentData.findByPk(commentId);
    };

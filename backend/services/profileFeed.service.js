import { Post, SharedPost, User, PhotoData, LikeData } from "../model/association.model.js";

export const getUnifiedProfileFeedService = async (targetUserId, viewerId, query) => {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.max(1, parseInt(query.limit, 10) || 10);
    const offset = (page - 1) * limit;

    const likeInclude = {
        model: LikeData,
        as: "likes",
        attributes: ["post_id"],
        where: { user_id: viewerId },
        required: false,
    };

    // Fetch original posts and shared posts concurrently
    const [userPosts, userShares] = await Promise.all([
        Post.findAll({
            where: { user_id: targetUserId, is_active: true },
            include: [
                { model: User, as: "author", attributes: ["user_id", "username", "profile_url"] },
                { model: PhotoData, as: "photo" },
                likeInclude
            ]
        }),
        SharedPost.findAll({
            where: { user_id: targetUserId },
            include: [
                { model: User, as: "user", attributes: ["user_id", "username", "profile_url"] },
                { 
                    model: Post, 
                    as: "post", 
                    where: { is_active: true }, 
                    include: [
                        { model: User, as: "author", attributes: ["user_id", "username", "profile_url"] },
                        { model: PhotoData, as: "photo" },
                        likeInclude
                    ] 
                }
            ]
        })
    ]);

    // Format and combine both arrays chronologically
    const combinedFeed = [
        ...userPosts.map(post => ({ feedItemType: "original", created_at: post.created_at, data: post, is_own_post: post.user_id === viewerId })),
        ...userShares.map(share => ({ feedItemType: "shared", created_at: share.created_at, data: share, is_own_post: share.post?.user_id === viewerId }))
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Pagination calculations
    const totalItems = combinedFeed.length;
    const totalPages = Math.ceil(totalItems / limit);
    const paginatedItems = combinedFeed.slice(offset, offset + limit);

    return {
        data: paginatedItems,
        pagination: {
            page,
            limit,
            totalItems,
            totalPages,
            hasMore: offset + limit < totalItems
        }
    };
};
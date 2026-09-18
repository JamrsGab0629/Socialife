import { Post, SharedPost, User, PhotoData } from "../model/association.model.js";

export const getUnifiedProfileFeedService = async (targetUserId, query) => {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.max(1, parseInt(query.limit, 10) || 10);
    const offset = (page - 1) * limit;

    // Fetch original posts and shared posts concurrently
    const [userPosts, userShares] = await Promise.all([
        Post.findAll({
            where: { user_id: targetUserId, is_active: true },
            include: [
                { model: User, as: "author", attributes: ["user_id", "username", "profile_url"] },
                { model: PhotoData, as: "photo" }
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
                        { model: PhotoData, as: "photo" }
                    ] 
                }
            ]
        })
    ]);

    // Format and combine both arrays chronologically
    const combinedFeed = [
        ...userPosts.map(post => ({ feedItemType: "original", created_at: post.created_at, data: post })),
        ...userShares.map(share => ({ feedItemType: "shared", created_at: share.created_at, data: share }))
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
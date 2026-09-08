import { Post, SharedPost, User, PhotoData } from "../model/association.model.js";

export const getUnifiedProfileFeedService = async (targetUserId, query) => {
    const { page = 1, limit = 10 } = query;
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.max(1, parseInt(limit, 10) || 10);

   
    const userPosts = await Post.findAll({
        where: { user_id: targetUserId, is_active: true },
        include: [
            { model: User, as: "author", attributes: ["user_id", "username", "profile_url"] },
            { model: PhotoData, as: "photo" }
        ]
    });

    const formattedPosts = userPosts.map(post => ({
        feedItemType: "original",
        created_at: post.created_at,
        data: post
    }));

  
    const userShares = await SharedPost.findAll({
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
    });

    const formattedShares = userShares.map(share => ({
        feedItemType: "shared",
        created_at: share.created_at, 
        data: share
    }));

    
    const combinedFeed = [...formattedPosts, ...formattedShares];

   
    combinedFeed.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

   
    const totalItems = combinedFeed.length;
    const totalPages = Math.ceil(totalItems / parsedLimit);
    const startIndex = (parsedPage - 1) * parsedLimit;
    const paginatedItems = combinedFeed.slice(startIndex, startIndex + parsedLimit);

    return {
        data: paginatedItems,
        pagination: {
            page: parsedPage,
            limit: parsedLimit,
            totalItems,
            totalPages,
            hasMore: startIndex + parsedLimit < totalItems
        }
    };
};
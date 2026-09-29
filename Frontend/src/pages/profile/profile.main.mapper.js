// profile.main.mapper.js
function mapFeedItemToPostData(item) {
    if (item.feedItemType === "shared") {
        const share = item.data;
        const original = share.post || {};
        return {
            post_id: original.post_id || original.id,
            feed_id: `share-${share.id}`,
            author: original.author,
            photo: original.photo,
            caption: original.caption,
            content: original.content,
            created_at: original.created_at,
            like_count: original.like_count,
            comment_count: original.comment_count,
            is_liked: Array.isArray(original.likes) && original.likes.length > 0,
            is_shared: true,
            shared_by: share.user,
            share_caption: share.caption,
            shared_at: share.created_at,
            is_own_post: item.is_own_post,
        };
    }

    const post = item.data;
    return {
        post_id: post.post_id || post.id,
        author: post.author,
        photo: post.photo,
        caption: post.caption,
        content: post.content,
        created_at: post.created_at,
        like_count: post.like_count,
        comment_count: post.comment_count,
        is_liked: Array.isArray(post.likes) && post.likes.length > 0,
        is_own_post: item.is_own_post,
    };
}

export default mapFeedItemToPostData;
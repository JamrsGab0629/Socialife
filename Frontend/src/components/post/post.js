// post.js

import style from "./post.module.css";
import Helper from "./post.helper";

const renderContent = (content) => {
    if (!content) return "";
    if (typeof content === "string") return "";
    const items = Array.isArray(content) ? content : [];
    return items
        .filter((item) => item["type"] === "img" || item["type"] === "image" || item["type"] === "photo")
        .map((item) => `<img src="${item["url"] || item["href"]}" alt="post photo">`)
        .join("");
};

const formatPostTime = (timestamp) => {
    if (!timestamp) return "";
    try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return String(timestamp);
        
        const now = new Date();
        const diffSeconds = Math.floor((now - date) / 1000);
        
        if (diffSeconds < 60) return "Just now";
        if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
        if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
        
        return date.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    } catch {
        return "";
    }
};

const escapeHtml = (str) =>
    String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const linkifyMentions = (text) =>
    escapeHtml(text).replace(/@(\w+)/g, (match, username) =>
        `<span role="link" tabindex="0" class="${style["mention-link"]}" data-mention-username="${username}">@${username}</span>`
    );

export default function Post(data, { showSave = false } = {}) {
    if (!data || Object.keys(data).length <= 0) return "";

    const postId = data.post_id || data.id || "";
    const cardId = data.feed_id || postId;
    const authorName = data.user_name || data.author?.username || "Anonymous";
    const avatarUrl = data.avatar_url || data.author?.profile_url || "/icon/user-avatar.svg";
    const authorId = data.author?.user_id || data.user_id || "";
    const postTime = formatPostTime(data.shared_at || data.post_time || data.created_at);
    
      const textContent = linkifyMentions(data.caption || (typeof data.content === "string" ? data.content : ""));

       let photoHtml = "";
    if (data.photo && data.photo.href) {
        photoHtml = `<img src="${data.photo.href}" alt="post photo" data-action="zoom-photo" data-post-id="${postId}" style="cursor: pointer;">`;
    } else if (data.photo_url) {
        photoHtml = `<img src="${data.photo_url}" alt="post photo" data-action="zoom-photo" data-post-id="${postId}" style="cursor: pointer;">`;
    } else if (Array.isArray(data.content)) {
        photoHtml = renderContent(data.content);
    }

    const commentCount = data.comment_count ?? (data.comment_data?.length || 0);
    const commentData = data.comment_data || data.comments || [];
    const likesCount = data.like_count ?? data.likes_count ?? 0;
    const isLiked = Boolean(data.is_liked || data.liked);
    const isSaved = Boolean(data.is_saved);
    const sharedBy = data.shared_by?.username || "Someone";
    const shareContext = data.is_shared ? `
        <div class="${style["share-context"]}">
            <span>${sharedBy} shared a post</span>
            ${data.share_caption ? `<div class="${style["share-caption"]}">${data.share_caption}</div>` : ""}
        </div>
    ` : "";

    return `
        <div class="${style["post-card"]}" id="${cardId}">
            <div class="${style["post-header"]}">
                <img src="${avatarUrl}" alt="${authorName}" onerror="this.src='/icon/user-avatar.svg'">
                <h2>
                  <a href="${authorId ? `/app/profile/${authorId}` : '#'}" class="${style["post-author"]}">${authorName}</a>
                    <span class="${style["post-time"]}">${postTime}</span>
                </h2>
                                           <div class="${style["post-menu"]}">
                    <button type="button" class="${style["action-more"]}" data-action="toggle-post-menu" aria-label="Post options" aria-expanded="false">
                        <img src="/icon/more.svg" alt="">
                    </button>
                    <div class="${style["post-menu-popover"]}" data-post-menu hidden>
                        ${showSave ? `
                            <button type="button" data-action="toggle-save" data-post-id="${postId}" aria-pressed="${isSaved}">
                                <img src="/icon/save.svg" alt="">
                                <span data-save-label>${isSaved ? "Saved" : "Save post"}</span>
                            </button>
                        ` : ""}
                        ${data.is_own_post ? `
                            <button type="button" data-action="delete-post" data-post-id="${postId}">
                                <img src="/icon/trash.svg" alt="">
                                <span>Delete post</span>
                            </button>
                        ` : ""}
                    </div>
                </div>
            </div>

            ${shareContext}

            ${textContent ? `<div class="${style["post-text"]}">${textContent}</div>` : ""}

            ${photoHtml ? `<div class="${style["post-photo"]}">${photoHtml}</div>` : ""}

            <div class="${style["post-meta"]}"><span class="like-count">${likesCount}</span> likes · <span class="comment-count">${commentCount}</span> comments</div>

            <div class="${style["comments"]}">
                ${Helper(commentData)}
            </div>

            <div class="${style["post-actions"]}">
                <button type="button" class="${style["action-btn"]} ${isLiked ? style.liked : ""}" data-action="like" data-post-id="${postId}" aria-pressed="${isLiked}">
                    <img src="/icon/like.svg" alt="like">
                    Like
                </button>
                <button type="button" class="${style["action-btn"]}" data-action="toggle-comments" data-post-id="${postId}">
                    <img src="/icon/chat.svg" alt="comment">
                    Comment
                </button>
                <button type="button" class="${style["action-btn"]}" data-action="share" data-post-id="${postId}">
                    <img src="/icon/export.svg" alt="share">
                    Share
                </button>
            </div>
<!-- COMMENTS INTERACTIVE SECTION (Hidden by default) -->
            <div class="${style["comments-section"]}" data-comments-section style="display: none;">
                <div class="${style["comment-box-row"]}">
                    <img src="${avatarUrl}" alt="avatar" class="${style["comment-user-avatar"]}" data-comment-avatar onerror="this.src='icon/user-avatar.svg'">
                    <div class="${style["comment-input-wrapper"]}">
                        <input type="text" class="${style["comment-input"]}" data-comment-input placeholder="Write a public comment...">
                        <button type="button" class="${style["comment-submit-btn"]}" data-action="submit-comment" data-post-id="${postId}">Post</button>
                    </div>
                </div>
                <div class="${style["comments-list"]}" data-comments-list></div>
            </div>
        </div>
    `;
}
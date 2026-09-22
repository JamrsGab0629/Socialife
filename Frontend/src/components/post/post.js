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

export default function Post(data) {
    if (!data || Object.keys(data).length <= 0) return "";

    const postId = data.post_id || data.id || "";
    const authorName = data.user_name || data.author?.username || "Anonymous";
    const avatarUrl = data.avatar_url || data.author?.profile_url || "../../icons/user-avatar.svg";
    const postTime = formatPostTime(data.post_time || data.created_at);
    
    // Support caption or text content
    const textContent = data.caption || (typeof data.content === "string" ? data.content : "");

    // Photo support: from Sequelize photo relation (photo.href) or mock content array
    let photoHtml = "";
    if (data.photo && data.photo.href) {
        photoHtml = `<img src="${data.photo.href}" alt="post photo">`;
    } else if (data.photo_url) {
        photoHtml = `<img src="${data.photo_url}" alt="post photo">`;
    } else if (Array.isArray(data.content)) {
        photoHtml = renderContent(data.content);
    }

    const commentCount = data.comment_count ?? (data.comment_data?.length || 0);
    const commentData = data.comment_data || data.comments || [];

    return `
        <div class="${style["post-card"]}" id="${postId}">
            <div class="${style["post-header"]}">
                <img src="${avatarUrl}" alt="${authorName}" onerror="this.src='../../icons/user-avatar.svg'">
                <h2>
                    <span class="${style["post-author"]}">${authorName}</span>
                    <span class="${style["post-time"]}">${postTime}</span>
                </h2>
                <a class="${style["action-more"]}" href="#"><img src="../../icons/more.svg" alt="more"></a>
            </div>

            ${textContent ? `<div class="${style["post-text"]}">${textContent}</div>` : ""}

            ${photoHtml ? `<div class="${style["post-photo"]}">${photoHtml}</div>` : ""}

            <div class="${style["post-meta"]}">${commentCount} comments</div>

            <div class="${style["comments"]}">
                ${Helper(commentData)}
            </div>

            <div class="${style["post-actions"]}">
                <div class="${style["action-btn"]}">
                    <a href="#" data-post-id="${postId}">
                        <img src="../../icons/like.svg" alt="like">
                        Like
                    </a>
                </div>
                <div class="${style["action-btn"]}">
                    <a href="#" data-post-id="${postId}">
                        <img src="../../icons/chat.svg" alt="comment">
                        Comment
                    </a>
                </div>
                <div class="${style["action-btn"]}">
                    <a href="#" data-post-id="${postId}">
                        <img src="../../icons/export.svg" alt="share">
                        Share
                    </a>
                </div>
            </div>
        </div>
    `;
}
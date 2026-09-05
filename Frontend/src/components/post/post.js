// post.js

import style from "./post.module.css";
import Helper from "./post.helper";

const renderContent = (content) => {
    const items = content || [];
    return items
        .filter((item) => item["type"] === "img")
        .map((item) => `<img src="${item["url"]}" alt="post photo">`)
        .join("");
};

export default function Post(data) {
    if (!data || Object.keys(data).length <= 0) return "";

    return `
        <div class="${style["post-card"]}" id="${data["post_id"] || ""}">
            <div class="${style["post-header"]}">
                <img src="${data["avatar_url"] || "../../icons/default-avatar.svg"}" alt="${data["user_name"] || "User"}">
                <h2>
                    <span class="${style["post-author"]}">${data["user_name"] || "Anonymous"}</span>
                    <span class="${style["post-time"]}">${data["post_time"] || ""}</span>
                </h2>
                <a class="${style["action-more"]}" href="#"><img src="../../icons/more.svg" alt="more"></a>
            </div>

            <div class="${style["post-text"]}">
                ${data["caption"] || ""}
            </div>

            <div class="${style["post-photo"]}">
                ${renderContent(data["content"])}
            </div>

            <div class="${style["post-meta"]}">${data['comment_count'] || 0} comments</div>

            <div class="${style["comments"]}">
                ${Helper(data["comment_data"])}
            </div>

            <div class="${style["post-actions"]}">
                <div class="${style["action-btn"]}">
                    <a href="#">
                        <img src="../../icons/like.svg" alt="like">
                        Like
                    </a>
                </div>
                <div class="${style["action-btn"]}">
                    <a href="#">
                        <img src="../../icons/chat.svg" alt="comment">
                        Comment
                    </a>
                </div>
                <div class="${style["action-btn"]}">
                    <a href="#">
                        <img src="../../icons/export.svg" alt="share">
                        Share
                    </a>
                </div>
            </div>
        </div>
    `;
}
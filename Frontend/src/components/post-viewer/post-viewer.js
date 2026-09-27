import style from "./post-viewer.module.css";
import { like_content, comment_content, get_comments } from "../../helpers/post/post.request";

let overlayEl = null;
let currentPostId = null;
let currentLiked = false;
let baseLikes = 0;

function formatTimeAgo(isoString) {
    if (!isoString) return "";
    const diffMs = Date.now() - new Date(isoString).getTime();
    const hours = Math.floor(diffMs / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
}

function buildOverlay() {
    // Defensive: remove any orphaned overlay from a previous module
    // instance (e.g. after rapid SPA navigation re-running Home()).
  document.querySelectorAll(`.${style["pv-overlay"]}`).forEach((el) => el.remove());
    const el = document.createElement("div");
    el.className = style["pv-overlay"];
    el.hidden = true;
    el.innerHTML = `
        <div class="${style["pv-viewer"]}">
            <section class="${style["pv-photo-stage"]}">
                <button type="button" class="${style["pv-stage-btn"]} ${style["pv-close-btn"]}" data-pv-close>&times;</button>
                <div class="${style["pv-photo-frame"]}">
                    <img class="${style["pv-stage-photo"]}" data-pv-photo alt="post photo">
                </div>
            </section>

            <section class="${style["pv-post-panel"]}">
                <div class="${style["pv-post-header"]}">
                    <img class="${style["pv-author-avatar"]}" data-pv-avatar alt="">
                    <div class="${style["pv-author-meta"]}">
                        <span class="${style["pv-author-name"]}" data-pv-author></span>
                        <span class="${style["pv-post-time"]}" data-pv-time></span>
                    </div>
                </div>

                <p class="${style["pv-post-caption"]}" data-pv-caption></p>

                <div class="${style["pv-reaction-bar"]}">
                    <button type="button" class="${style["pv-like-btn"]}" data-pv-like>
                        <img src="/icon/like.svg" alt="like">
                        <span data-pv-like-count>0</span>
                    </button>
                    <div><span data-pv-comment-count>0</span> comments</div>
                </div>

                <div class="${style["pv-divider"]}"></div>

                <div class="${style["pv-comment-list"]}" data-pv-comment-list></div>

                <div class="${style["pv-comment-composer"]}">
                    <input type="text" class="${style["pv-comment-input"]}" data-pv-comment-input placeholder="Write a comment...">
                    <button type="button" class="${style["pv-comment-send"]}" data-pv-comment-send>Post</button>
                </div>
            </section>
        </div>
    `;

    document.body.appendChild(el);

    el.querySelector("[data-pv-close]").addEventListener("click", closePostViewer);
    el.addEventListener("click", (e) => {
        if (e.target === el) closePostViewer();
    });

    el.querySelector("[data-pv-like]").addEventListener("click", handleLikeClick);
    el.querySelector("[data-pv-comment-send]").addEventListener("click", handleCommentSubmit);
    el.querySelector("[data-pv-comment-input]").addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleCommentSubmit();
    });

    return el;
}

function renderComment(comment) {
    const list = overlayEl.querySelector("[data-pv-comment-list]");
    const item = document.createElement("div");
    item.className = style["pv-comment-item"];

    const authorName = comment.author?.username || comment.author_name || "You";
    const avatarUrl = comment.author?.profile_url || "/icon/user-avatar.svg";
    const text = comment.comment || "";

    item.innerHTML = `
        <img class="${style["pv-comment-avatar"]}" src="${avatarUrl}" alt="" onerror="this.src='/icon/user-avatar.svg'">
        <div>
            <div class="${style["pv-comment-bubble"]}">
                <span class="${style["pv-comment-name"]}">${authorName}</span>
                <p class="${style["pv-comment-text"]}"></p>
            </div>
        </div>
    `;
    item.querySelector(`.${style["pv-comment-text"]}`).textContent = text;
    list.appendChild(item);
}

async function loadComments(postId) {
    const list = overlayEl.querySelector("[data-pv-comment-list]");
    list.innerHTML = "";
    try {
        const { data } = await get_comments(postId);
        (data || []).forEach(renderComment);
    } catch (error) {
        console.error("Failed to load comments in post viewer:", error);
    }
}

async function handleLikeClick() {
    if (!currentPostId) return;
    try {
        const { data } = await like_content(currentPostId);
        currentLiked = Boolean(data?.liked);
        const newCount = data?.likeCount ?? baseLikes;
        baseLikes = newCount;

        const likeBtn = overlayEl.querySelector("[data-pv-like]");
        likeBtn.classList.toggle(style["liked"], currentLiked);
        overlayEl.querySelector("[data-pv-like-count]").textContent = newCount;

        window.dispatchEvent(new CustomEvent("post:liked", {
            detail: { postId: currentPostId, likeCount: newCount, isLiked: currentLiked }
        }));
    } catch (error) {
        console.error("Failed to toggle like in post viewer:", error);
    }
}

async function handleCommentSubmit() {
    const input = overlayEl.querySelector("[data-pv-comment-input]");
    const text = input.value.trim();
    if (!text || !currentPostId) return;

    try {
        const { data } = await comment_content(currentPostId, text);
        // addCommentService doesn't include author info on the raw row,
        // so we render it as the current user locally.
        renderComment({ comment: data?.comment ?? text, author_name: "You" });
        input.value = "";

        const commentCountEl = overlayEl.querySelector("[data-pv-comment-count]");
        const newCount = (parseInt(commentCountEl.textContent, 10) || 0) + 1;
        commentCountEl.textContent = newCount;

        window.dispatchEvent(new CustomEvent("post:commented", {
            detail: { postId: currentPostId, commentCount: newCount }
        }));
    } catch (error) {
        console.error("Failed to submit comment in post viewer:", error);
    }
}

export function openPostViewer(postData) {
    if (!overlayEl || !document.body.contains(overlayEl)) {
        overlayEl = buildOverlay();
    }

    const postId = postData.post_id || postData.id || "";
    currentPostId = postId;
    currentLiked = Boolean(postData.is_liked || postData.liked);
    baseLikes = postData.like_count ?? postData.likes_count ?? 0;

    const authorName = postData.user_name || postData.author?.username || "Anonymous";
    const avatarUrl = postData.avatar_url || postData.author?.profile_url || "/icon/user-avatar.svg";
    const photoUrl = postData.photo?.href || postData.photo_url || "";
    const caption = postData.caption || (typeof postData.content === "string" ? postData.content : "");

    overlayEl.querySelector("[data-pv-photo]").src = photoUrl;
    const avatarImg = overlayEl.querySelector("[data-pv-avatar]");
    avatarImg.src = avatarUrl;
    avatarImg.onerror = function () { this.src = "/icon/user-avatar.svg"; };
    overlayEl.querySelector("[data-pv-author]").textContent = authorName;
    overlayEl.querySelector("[data-pv-time]").textContent = formatTimeAgo(postData.shared_at || postData.post_time || postData.created_at);
    overlayEl.querySelector("[data-pv-caption]").textContent = caption;

    const likeBtn = overlayEl.querySelector("[data-pv-like]");
    likeBtn.classList.toggle(style["liked"], currentLiked);
    overlayEl.querySelector("[data-pv-like-count]").textContent = baseLikes;
    overlayEl.querySelector("[data-pv-comment-count]").textContent = postData.comment_count ?? 0;

    overlayEl.hidden = false;
    document.body.style.overflow = "hidden";

    loadComments(postId);
}

export function closePostViewer() {
    if (!overlayEl || !document.body.contains(overlayEl)) {
        overlayEl = null;
        return;
    }
    overlayEl.hidden = true;
    document.body.style.overflow = "";
    currentPostId = null;
}
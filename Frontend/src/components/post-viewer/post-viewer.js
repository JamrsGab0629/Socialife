import style from "./post-viewer.module.css";
import { like_content, comment_content, get_comments, get_replies, reply_content } from "../../helpers/post/post.request";
import { initMentionPicker } from "../mention/mention-picker";

let overlayEl = null;
let currentPostId = null;
let currentLiked = false;
let baseLikes = 0;
let mentionPicker = null;

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
                            <button type="button" class="${style["pv-panel-close"]}" data-pv-close>&times;</button>
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

    el.querySelectorAll("[data-pv-close]").forEach((btn) =>
        btn.addEventListener("click", closePostViewer)
    );
    el.addEventListener("click", (e) => {
        if (e.target === el) closePostViewer();
    });

    el.querySelector("[data-pv-like]").addEventListener("click", handleLikeClick);
    el.querySelector("[data-pv-comment-send]").addEventListener("click", handleCommentSubmit);
    el.querySelector("[data-pv-comment-input]").addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleCommentSubmit();
    });

    // Reply toggle / view-replies delegation
    el.addEventListener("click", (e) => {
        const replyToggle = e.target.closest("[data-pv-toggle-reply]");
        if (replyToggle) {
            const form = replyToggle.closest("[data-comment-id]")?.querySelector("[data-pv-reply-form]");
            if (form) {
                form.hidden = !form.hidden;
                if (!form.hidden) form.querySelector("[data-pv-reply-input]")?.focus();
            }
            return;
        }

        const viewReplies = e.target.closest("[data-pv-toggle-replies]");
        if (viewReplies) {
            handleToggleReplies(viewReplies);
            return;
        }
    });

    // Reply form submission
    el.addEventListener("submit", (e) => {
        const form = e.target.closest("[data-pv-reply-form]");
        if (!form) return;
        e.preventDefault();
        handleReplySubmit(form);
    });

    // @mention support for the main comment box and any reply box inside the viewer
    mentionPicker = initMentionPicker(el);

    return el;
}

function renderComment(comment, isReply = false) {
    const list = overlayEl.querySelector("[data-pv-comment-list]");
    const item = document.createElement("div");
    item.className = style["pv-comment-item"];

    const authorName = comment.author?.username || comment.user_name || comment.author_name || "You";
    const avatarUrl = comment.author?.profile_url || comment.avatar_url || "/icon/user-avatar.svg";
    const text = comment.comment || comment.content || "";
    const commentId = comment.comment_data_id || comment.id || "";
    const embeddedReplies = comment.replies || [];
    const replyCount = Number(comment.reply_count || embeddedReplies.length || 0);
    const hasMoreReplies = replyCount > embeddedReplies.length;

    item.innerHTML = `
        <img class="${style["pv-comment-avatar"]}" src="${avatarUrl}" alt="" onerror="this.src='/icon/user-avatar.svg'">
        <div style="flex:1">
            <div class="${style["pv-comment-bubble"]}">
                <span class="${style["pv-comment-name"]}">${authorName}</span>
                <p class="${style["pv-comment-text"]}"></p>
            </div>
            ${!isReply ? `
                <div class="${style["pv-comment-actions"]}">
                    <button type="button" data-pv-toggle-reply>Reply</button>
                    ${hasMoreReplies ? `<button type="button" data-pv-toggle-replies>View more replies (${replyCount - embeddedReplies.length})</button>` : ""}
                </div>
                <div class="${style["pv-replies-list"]}" data-pv-replies-list></div>
                <form class="${style["pv-reply-form"]}" data-pv-reply-form data-parent-id="${commentId}" hidden>
                    <input type="text" data-pv-reply-input placeholder="Write a reply...">
                    <button type="submit">Reply</button>
                </form>
            ` : ""}
        </div>
    `;
    item.querySelector(`.${style["pv-comment-text"]}`).textContent = text;
    if (!isReply) item.dataset.commentId = commentId;
    list.appendChild(item);

    // Render the replies already embedded by getCommentsService, before any "load more" click
    if (!isReply && embeddedReplies.length > 0) {
        const repliesList = item.querySelector("[data-pv-replies-list]");
        embeddedReplies.forEach((reply) => appendReplyEl(repliesList, reply));
        repliesList.dataset.loaded = hasMoreReplies ? "" : "true"; // "true" means fully loaded, nothing more to fetch
    }
}

function appendReplyEl(repliesList, reply) {
    const replyEl = document.createElement("div");
    replyEl.className = style["pv-comment-item"];
    const authorName = reply.author?.username || "User";
    const avatarUrl = reply.author?.profile_url || "/icon/user-avatar.svg";
    replyEl.innerHTML = `
        <img class="${style["pv-comment-avatar"]}" src="${avatarUrl}" alt="" onerror="this.src='/icon/user-avatar.svg'">
        <div class="${style["pv-comment-bubble"]}">
            <span class="${style["pv-comment-name"]}">${authorName}</span>
            <p class="${style["pv-comment-text"]}"></p>
        </div>
    `;
    replyEl.querySelector(`.${style["pv-comment-text"]}`).textContent = reply.comment || "";
    repliesList.appendChild(replyEl);
}
async function loadComments(postId) {
    const list = overlayEl.querySelector("[data-pv-comment-list]");
    list.innerHTML = "";
    try {
        const { data } = await get_comments(postId);
        (data || []).forEach((comment) => renderComment(comment, false));
    } catch (error) {
        console.error("Failed to load comments in post viewer:", error);
    }
}

async function handleToggleReplies(button) {
    const commentItem = button.closest("[data-comment-id]");
    const repliesList = commentItem?.querySelector("[data-pv-replies-list]");
    const commentId = commentItem?.dataset.commentId;
    if (!repliesList || !commentId || !currentPostId) return;

    if (repliesList.dataset.loaded) {
        repliesList.hidden = !repliesList.hidden;
        return;
    }

    try {
        const { data } = await get_replies(currentPostId, commentId);
        repliesList.innerHTML = ""; // full list replaces the 3 embedded ones with all of them
        (data || []).forEach((reply) => appendReplyEl(repliesList, reply));
        repliesList.dataset.loaded = "true";
        button.remove(); // no more to load
    } catch (error) {
        console.error("Failed to load replies in post viewer:", error);
    }
}

async function handleReplySubmit(form) {
    const parentId = form.dataset.parentId;
    const input = form.querySelector("[data-pv-reply-input]");
    const text = input?.value.trim();
    if (!text || !parentId || !currentPostId) return;

    const mentionIds = mentionPicker?.getMentionIds(input) || [];

    try {
        const { data } = await reply_content(currentPostId, parentId, text, mentionIds);
        input.value = "";
        mentionPicker?.clearMentions(input);
        form.hidden = true;

        const commentItem = form.closest("[data-comment-id]");
        const repliesList = commentItem?.querySelector("[data-pv-replies-list]");
        if (repliesList) {
            repliesList.hidden = false;
            appendReplyEl(repliesList, { comment: data?.comment ?? text, author: { username: "You" } });
        }
    } catch (error) {
        console.error("Failed to submit reply in post viewer:", error);
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

    const mentionIds = mentionPicker?.getMentionIds(input) || [];

    try {
        const { data } = await comment_content(currentPostId, text, mentionIds);
        // addCommentService doesn't include author info on the raw row,
        // so we render it as the current user locally.
        renderComment({ comment: data?.comment ?? text, author_name: "You" }, false);
        input.value = "";
        mentionPicker?.clearMentions(input);

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
    overlayEl.querySelector(`.${style["pv-viewer"]}`).classList.toggle(style["pv-no-photo"], !photoUrl);


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
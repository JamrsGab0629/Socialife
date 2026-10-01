// home.helper.js
import style from "./home.module.css";
import Create_Post from '../../components/create_post/create_post';
import postStyle from '../../components/post/post.module.css';
import { comment_content, get_comments, get_replies, like_content, reply_content, save_post, share_post, unsave_post } from '../../helpers/post/post.request';
import { get_my_profile } from '../../helpers/post/post.helpers';
import { send_friend_request } from "../../helpers/friends/friends.request";
import { initMentionPicker } from '../../components/mention/mention-picker';
import { commentMention } from '../../helpers/mention/mention.helper';
import { get_user_profile_by_username } from '../../helpers/profile/profile.request';
import { report_user } from '../../helpers/report/report.request';
const avatar_colors = ["#E8A5A0", "#A5C7E8", "#C7A5E8", "#A5E8C0", "#E8D5A5"];

let currentUser = { userName: "User", avatarUrl: "../../icons/user-avatar.svg" };
let mentionPicker = null;

// add near the bottom, after currentUser/mentionPicker declarations
export function applyCurrentUserAvatar(scope) {
    if (!scope) return;
    scope.querySelectorAll('[data-comment-avatar]').forEach((avatar) => {
        avatar.src = currentUser.avatarUrl;
    });
}
const getAvatarColor = (user_id) => {
    const index = Number(user_id) % avatar_colors.length;
    return avatar_colors[Math.abs(index) || 0];
};

const getInitial = (name) => {
    return (name || "?").trim().charAt(0).toUpperCase();
};

export const FriendsTemplate = (friends_data) => {
    const data = friends_data || [];
    let template = "";

    if (data.length === 0) return template;

    data.forEach((friend) => {
        const color = getAvatarColor(friend["user_id"]);
        const name = friend["username"] || friend["user_name"] || "Someone";
        const initial = getInitial(name);
        const avatarUrl = friend["profile_url"];

        template += `
            <div class="${style["friend-row"]}" data-user-id="${friend["user_id"]}">
                <div class="${style["friend-avatar"]}" style="background:${color};">
                    ${avatarUrl ? `<img src="${avatarUrl}" alt="${name}">` : `<div class="${style["avatar-fallback"]}">${initial}</div>`}
                </div>
                <div class="${style["friend-name"]}">${name}</div>
                <button class="${style["add-friend-btn"]}" data-action="add-friend" data-user-id="${friend["user_id"]}">Add Friend</button>
            </div>
        `;
    });

    return template;
};
export function initComposerOverlay() {
    const trigger = document.getElementById('composer-trigger');
    const backdrop = document.getElementById('composer-overlay-backdrop');
    const container = document.getElementById('composer-overlay-container');

    if (!trigger || !backdrop || !container) return;

    // Open Modal
    trigger.addEventListener('click', () => {
        backdrop.hidden = false;
        container.innerHTML = '';
        Create_Post(container); // Mounts the modal component
    });

    // Close Modal on backdrop click outside the content card
    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
            backdrop.hidden = true;
            container.innerHTML = '';
        }
    });
}
export function initFriendRecommendations(container) {
    if (!container) return;

    container.addEventListener('click', async (e) => {
        const btn = e.target.closest('[data-action="add-friend"]');
        if (!btn || btn.disabled) return;

        const userId = btn.dataset.userId;
        try {
            btn.disabled = true;
            await send_friend_request(userId);
            btn.textContent = 'Requested';
        } catch (error) {
            console.error('Failed to send friend request:', error);
            btn.disabled = false;
        }
    });
}
export function initSharePostDialog(picker) {
    const dialog = document.getElementById('share-post-dialog');
    const form = dialog?.querySelector('[data-share-post-form]');
    const caption = dialog?.querySelector('[data-share-caption]');
    const submitButton = dialog?.querySelector('[data-share-submit]');
    const errorMessage = dialog?.querySelector('[data-share-error]');

    if (!dialog || !form || !caption || !submitButton || !errorMessage) return;

    dialog.querySelector('[data-action="close-share-dialog"]')?.addEventListener('click', () => dialog.close());

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const postId = dialog.dataset.postId;
        if (!postId) return;

        const mentionIds = picker?.getMentionIds(caption) || [];

        try {
            submitButton.disabled = true;
            submitButton.textContent = 'Sharing...';
            errorMessage.hidden = true;
            await share_post(postId, caption.value.trim(), mentionIds);
            picker?.clearMentions(caption);
            dialog.close();
        } catch (error) {
            console.error('Failed to share post:', error);
            errorMessage.textContent = 'Unable to share this post. Please try again.';
            errorMessage.hidden = false;
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Share';
        }
    });

    dialog.addEventListener('close', () => {
        caption.value = '';
        errorMessage.hidden = true;
        delete dialog.dataset.postId;
    });
}

export function initReportDialog() {
    const dialog = document.getElementById('report-dialog');
    const form = dialog?.querySelector('[data-report-form]');
    const targetNameEl = dialog?.querySelector('[data-report-target-name]');
    const details = dialog?.querySelector('[data-report-details]');
    const submitButton = dialog?.querySelector('[data-report-submit]');
    const errorMessage = dialog?.querySelector('[data-report-error]');

    if (!dialog || !form || !submitButton) return;

    dialog.querySelectorAll('[data-action="close-report-dialog"]').forEach((btn) =>
        btn.addEventListener('click', () => dialog.close())
    );

    // Enable/disable on any change inside the options area, using delegation
    // so it works even if radios render after this function runs
    dialog.addEventListener('change', (e) => {
        if (e.target.name === 'report-category') {
            submitButton.disabled = false;
        }
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const userId = dialog.dataset.authorId;
        const category = dialog.querySelector('input[name="report-category"]:checked')?.value;
        if (!userId || !category) return;

        const detailText = details.value.trim();
        const message = detailText ? `${category}: ${detailText}` : category;

        try {
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
            errorMessage.hidden = true;
            await report_user(userId, message);
            dialog.close();
        } catch (error) {
            console.error('Failed to submit report:', error);
            errorMessage.textContent = error?.response?.data?.message || 'Unable to submit report. Please try again.';
            errorMessage.hidden = false;
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Submit report';
        }
    });

    dialog.addEventListener('close', () => {
        form.reset();
        details.value = '';
        errorMessage.hidden = true;
        submitButton.disabled = true;
        delete dialog.dataset.authorId;
    });
}
const linkifyMentions = (text) => {
    return text.replace(/@(\w+)/g, (match, username) => {
               return `<span role="link" tabindex="0" class="${postStyle["mention-link"]}" data-mention-username="${username}">@${username}</span>`;
    });
};

const renderCommentItem = (comment, postId, isReply = false) => {
    const userName = comment.user_name || comment.author?.username || currentUser.userName;
    const avatarUrl = comment.avatar_url || comment.author?.profile_url || currentUser.avatarUrl;
    const commentText = linkifyMentions(comment.comment || comment.content || "");
    const commentId = comment.comment_data_id || comment.id || "";
    const replies = comment.replies || [];

    return `
        <div class="${postStyle.comment}" ${isReply ? "" : `data-comment-id="${commentId}" data-post-id="${postId}"`}>
            <div class="${postStyle["comment-avatar"]}">
                <img src="${avatarUrl}" alt="${userName}" onerror="this.src='../../icons/default-avatar.svg'">
            </div>
            <div>
                <div><b>${userName}</b> ${commentText}</div>
                ${isReply ? "" : `
                    <div class="${postStyle["comment-actions"]}">
                        <button type="button" data-action="toggle-reply-form">Reply</button>
                        ${Number(comment.reply_count || replies.length) ? `<button type="button" data-action="toggle-replies">View replies</button>` : ""}
                    </div>
                `}
            </div>
        </div>
        ${isReply ? "" : `
            <div class="${postStyle.replies}" data-replies-list>${replies.map((reply) => renderCommentItem(reply, postId, true)).join("")}</div>
            <form class="${postStyle["reply-form"]}" data-reply-form data-post-id="${postId}" data-parent-id="${commentId}" hidden>
                <input type="text" class="comment-input" data-reply-input placeholder="Write a reply...">
                <button type="submit" class="${postStyle["comment-submit-btn"]}">Reply</button>
            </form>
        `}
    `;
};


export function initCommentInteractions(container) {
    if (!container) return;
    mentionPicker = initMentionPicker(container);
    get_my_profile()
    .then(response => {
        const profile = response?.data || response;
        if (profile) {
            currentUser = {
                userName: profile.username || profile.user_name || currentUser.userName,
                avatarUrl: profile.profile_url || currentUser.avatarUrl,
            };
            applyCurrentUserAvatar(container);
        }
    })
    .catch(err => console.error("Failed to fetch profile name for comments:", err));

    container.addEventListener('click', async (e) => {
        const target = e.target;

        const menuButton = target.closest('[data-action="toggle-post-menu"]');
        if (menuButton) {
            const menu = menuButton.parentElement?.querySelector('[data-post-menu]');
            if (menu) {
                const isOpen = !menu.hidden;
                menu.hidden = isOpen;
                menuButton.setAttribute('aria-expanded', String(!isOpen));
            }
            return;
        }
                const mentionLink = target.closest('[data-mention-username]');
        if (mentionLink) {
            e.preventDefault();
            const username = mentionLink.dataset.mentionUsername;
            try {
                const { data: profile } = await get_user_profile_by_username(username);
                if (profile?.user_id) {
                    window.location.href = `/app/profile/${profile.user_id}`;
                }
            } catch (error) {
                console.error("Failed to resolve mentioned user:", error);
            }
            return;
        }

        const shareButton = target.closest('[data-action="share"]');
        if (shareButton) {
            const dialog = document.getElementById('share-post-dialog');
            if (dialog && shareButton.dataset.postId) {
                dialog.dataset.postId = shareButton.dataset.postId;
                dialog.showModal();
                dialog.querySelector('[data-share-caption]')?.focus();
            }
            return;
        }
       const reportButton = target.closest('[data-action="open-report"]');
if (reportButton) {
    // Close the post's 3-dot menu first, or it stays on top of the dialog
    document.querySelectorAll('[data-post-menu]').forEach((menu) => { menu.hidden = true; });

    const dialog = document.getElementById('report-dialog');
    if (dialog) {
        dialog.dataset.authorId = reportButton.dataset.authorId;
        const nameEl = dialog.querySelector('[data-report-target-name]');
        if (nameEl) nameEl.textContent = reportButton.dataset.authorName || '';
        dialog.showModal();
    }
    return;
}
        const toggleBtn = target.closest('[data-action="toggle-comments"]');
        if (toggleBtn) {
            const postId = toggleBtn.dataset.postId;
            if (!postId) return;

            const postCard = toggleBtn.closest(`.${postStyle["post-card"]}`);
            const commentsSection = postCard?.querySelector('[data-comments-section]');

            if (!commentsSection) return;

            const isHidden = commentsSection.style.display === 'none' || !commentsSection.style.display;
            commentsSection.style.display = isHidden ? 'block' : 'none';

            const commentsList = commentsSection.querySelector('[data-comments-list]');
            if (isHidden && commentsList && commentsList.children.length === 0) {
                try {
                    const response = await get_comments(postId);
                    const comments = response?.data || response?.comments || [];

                    commentsList.innerHTML = comments.map((comment) => renderCommentItem(comment, postId)).join('');
                } catch (err) {
                    console.error("Failed to load comments:", err);
                }
            }
            return;
        }

        const likeBtn = target.closest('[data-action="like"]');
        if (likeBtn && !likeBtn.disabled) {
            await handleLike(likeBtn);
            return;
        }

        const saveBtn = target.closest('[data-action="toggle-save"]');
        if (saveBtn && !saveBtn.disabled) {
            await handleSave(saveBtn);
            return;
        }

        const replyFormBtn = target.closest('[data-action="toggle-reply-form"]');
        if (replyFormBtn) {
            const comment = replyFormBtn.closest('[data-comment-id]');
            const form = comment?.nextElementSibling?.nextElementSibling;
            if (form?.matches('[data-reply-form]')) {
                form.hidden = !form.hidden;
                if (!form.hidden) form.querySelector('[data-reply-input]')?.focus();
            }
            return;
        }

        const repliesBtn = target.closest('[data-action="toggle-replies"]');
        if (repliesBtn) {
            await toggleReplies(repliesBtn);
            return;
        }

        const submitBtn = target.closest('[data-action="submit-comment"]');
        if (submitBtn) {
            await handleCommentSubmission(submitBtn);
        }
    });

    container.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter' && e.target.hasAttribute('data-comment-input')) {
            e.preventDefault();
            const commentsSection = e.target.closest('[data-comments-section]');
            const submitBtn = commentsSection?.querySelector('[data-action="submit-comment"]');
            if (submitBtn) {
                await handleCommentSubmission(submitBtn);
            }
        }
    });

    container.addEventListener('submit', async (e) => {
        const replyForm = e.target.closest('[data-reply-form]');
        if (!replyForm) return;

        e.preventDefault();
        await handleReplySubmission(replyForm);
    });
}

async function handleCommentSubmission(submitBtn) {
    const postId = submitBtn.dataset.postId;
    if (!postId) return;

    const postCard = submitBtn.closest(`.${postStyle["post-card"]}`);
    const inputField = postCard?.querySelector('[data-comment-input]');

    if (!inputField) return;

    const commentText = inputField.value.trim();
    if (!commentText) return;

    const mentionIds = mentionPicker?.getMentionIds(inputField) || [];

    try {
        submitBtn.disabled = true;
        const response = await comment_content(postId, commentText);
        const newComment = response?.data || response;
        const commentId = newComment.comment_data_id || newComment.id;

        inputField.value = '';
        mentionPicker?.clearMentions(inputField);

        if (mentionIds.length > 0 && commentId) {
            commentMention({ mentions: mentionIds, entityId: commentId }).catch((err) =>
                console.error("Failed to send mentions:", err)
            );
        }

        const commentsList = postCard.querySelector('[data-comments-list]');
        if (commentsList) {
            const commentPayload = {
                comment_data_id: commentId,
                user_name: newComment.user_name || currentUser.userName,
                comment: newComment.comment || commentText
            };
            commentsList.insertAdjacentHTML('beforeend', renderCommentItem(commentPayload, postId));
        }

        const commentCount = postCard.querySelector('.comment-count');
        if (commentCount) {
            commentCount.textContent = String(Number(commentCount.textContent) + 1);
        }
    } catch (error) {
        console.error("Failed to submit comment:", error);
    } finally {
        submitBtn.disabled = false;
    }
}
async function toggleReplies(button) {
    const comment = button.closest('[data-comment-id]');
    const repliesList = comment?.nextElementSibling;
    const postId = comment?.dataset.postId;
    const parentId = comment?.dataset.commentId;
    if (!repliesList || !postId || !parentId) return;

    if (repliesList.dataset.loaded) {
        repliesList.hidden = !repliesList.hidden;
        return;
    }

    try {
        button.disabled = true;
        const response = await get_replies(postId, parentId);
        const replies = response?.data || [];
        repliesList.innerHTML = replies.map((reply) => renderCommentItem(reply, postId, true)).join('');
        repliesList.dataset.loaded = "true";
        button.textContent = "Hide replies";
    } catch (error) {
        console.error("Failed to load replies:", error);
    } finally {
        button.disabled = false;
    }
}

async function handleReplySubmission(replyForm) {
    const postId = replyForm.dataset.postId;
    const parentId = replyForm.dataset.parentId;
    const input = replyForm.querySelector('[data-reply-input]');
    const submitBtn = replyForm.querySelector('button[type="submit"]');
    const commentText = input?.value.trim();
    if (!postId || !parentId || !commentText) return;

    const mentionIds = mentionPicker?.getMentionIds(input) || [];

    try {
        submitBtn.disabled = true;
        const response = await reply_content(postId, parentId, commentText);
        const reply = response?.data || response;
        const repliesList = replyForm.previousElementSibling;

        repliesList.insertAdjacentHTML('beforeend', renderCommentItem({
            ...reply,
            user_name: reply.user_name || currentUser.userName,
            comment: reply.comment || commentText,
        }, postId, true));
        repliesList.dataset.loaded = "true";
        input.value = '';

        mentionPicker?.clearMentions(input);
        const replyId = reply.comment_data_id || reply.id;
        if (mentionIds.length > 0 && replyId) {
            commentMention({ mentions: mentionIds, entityId: replyId }).catch((err) =>
                console.error("Failed to send mentions:", err)
            );
        }
        const postCard = replyForm.closest(`.${postStyle["post-card"]}`);
        const commentCount = postCard?.querySelector('.comment-count');
        if (commentCount) commentCount.textContent = String(Number(commentCount.textContent) + 1);
    } catch (error) {
        console.error("Failed to submit reply:", error);
    } finally {
        submitBtn.disabled = false;
    }
}
async function handleLike(likeBtn) {
    const postId = likeBtn.dataset.postId;
    const postCard = likeBtn.closest(`.${postStyle["post-card"]}`);
    if (!postId || !postCard) return;

    try {
        likeBtn.disabled = true;
        const response = await like_content(postId);
        const result = response?.data || response;
        const liked = Boolean(result?.liked);

        likeBtn.classList.toggle(postStyle.liked, liked);
        likeBtn.setAttribute('aria-pressed', String(liked));

        const likeCount = postCard.querySelector('.like-count');
        if (likeCount && Number.isFinite(Number(result?.likeCount))) {
            likeCount.textContent = String(result.likeCount);
        }
    } catch (error) {
        console.error("Failed to toggle like:", error);
    } finally {
        likeBtn.disabled = false;
    }
}

async function handleSave(saveBtn) {
    const postId = saveBtn.dataset.postId;
    if (!postId) return;

    const wasSaved = saveBtn.getAttribute('aria-pressed') === 'true';

    try {
        saveBtn.disabled = true;
        if (wasSaved) {
            await unsave_post(postId);
        } else {
            await save_post(postId);
        }

        const isSaved = !wasSaved;
        saveBtn.setAttribute('aria-pressed', String(isSaved));
        saveBtn.querySelector('[data-save-label]').textContent = isSaved ? 'Saved' : 'Save post';
        const menu = saveBtn.closest('[data-post-menu]');
        if (menu) {
            menu.hidden = true;
            menu.parentElement?.querySelector('[data-action="toggle-post-menu"]')?.setAttribute('aria-expanded', 'false');
        }
    } catch (error) {
        console.error('Failed to update saved post:', error);
    } finally {
        saveBtn.disabled = false;
    }
}

export default function Helper() {}

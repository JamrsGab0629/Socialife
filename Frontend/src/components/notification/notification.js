import { getNotifications, markNotificationAsRead } from "./notification.service";
import { get_post_by_id } from "../../helpers/post/post.request";
import { get_share_by_id } from "../../helpers/share/share.request";
import { openPostViewer } from "../post-viewer/post-viewer";
import { InfiniteScroll } from "../../helpers/utils/InfiniteScroll";
import { skeleton } from "../skeleton/skeleton";
import style from "./notification.module.css";

function renderNotification(notification) {
    const author = notification.author || {};
    const isRead = Boolean(notification.is_read);

    return `
        <button type="button" class="${style["notif-item"]} ${isRead ? "" : style.unread}" data-notification-id="${notification.notification_id}" data-post-id="${notification.post_id || ""}" data-share-id="${notification.share_id || ""}" data-type="${notification.type || ""}">
            <div class="${style["notif-avatar-wrap"]}">
                <img src="${author.profile_url || "../../icons/user-avatar.svg"}" alt="${author.username || "User"}" onerror="this.src='../../icons/user-avatar.svg'">
                <span class="${style["notif-badge-icon"]} ${style[notification.type] || ""}"></span>
            </div>
            <div class="${style["notif-body"]}">
                <div class="${style["notif-text"]}"><b>${author.username || "Someone"}</b> ${notification.content}</div>
                <div class="${style["notif-time"]}">${formatTime(notification.created_at)}</div>
            </div>
            ${!isRead ? `<span class="${style["notif-dot"]}"></span>` : ""}
        </button>
    `;
}

export default async function Notification(root) {
    root.innerHTML = `
        <div data-notif-list></div>
        <div data-notif-sentinel style="height: 20px;"></div>
        <div data-notif-empty hidden>You have no notifications yet.</div>
    `;

    const list = root.querySelector("[data-notif-list]");
    const sentinel = root.querySelector("[data-notif-sentinel]");
    const empty = root.querySelector("[data-notif-empty]");

    // One click handler on the list covers every page that gets loaded later
    list.addEventListener("click", async (event) => {
        const item = event.target.closest("[data-notification-id]");
        if (!item) return;

        if (item.classList.contains(style.unread)) {
            try {
                await markNotificationAsRead(item.dataset.notificationId);
                item.classList.remove(style.unread);
                item.querySelector(`.${style["notif-dot"]}`)?.remove();
            } catch (error) {
                console.error("Failed to mark notification as read:", error);
            }
        }

        const type = item.dataset.type;
        if (type === "friend_request" || type === "friend_accept") {
            window.location.href = "/app/friends";
            return;
        }

        const shareId = item.dataset.shareId;
        const postId = item.dataset.postId;

        try {
            if (type === "share" && shareId) {
                const { data: share } = await get_share_by_id(shareId);
                if (share) {
                    openPostViewer({
                        post_id: share.post_id,
                        user_name: share.user?.username,
                        avatar_url: share.user?.profile_url,
                        caption: share.caption,
                        photo: share.post?.photo,
                        like_count: share.post?.like_count,
                        comment_count: share.post?.comment_count,
                        created_at: share.created_at,
                    });
                    return;
                }
            }

            if (postId) {
                const { data: post } = await get_post_by_id(postId);
                if (post) openPostViewer(post);
            }
        } catch (error) {
            console.error("Failed to open post from notification:", error);
        }
    });

    new InfiniteScroll({
        container: list,
        sentinel,
        limit: 20,
        loaderHTML: skeleton("notification", 5),
        loadMore: async ({ page, limit }) => {
            const result = await getNotifications(page, limit);
            const items = Array.isArray(result?.data) ? result.data : [];
            if (page === 1 && items.length === 0) empty.hidden = false;
            return result;
        },
        renderItems: (items, container) => {
            container.insertAdjacentHTML("beforeend", items.map(renderNotification).join(""));
        },
    });
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return "";

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
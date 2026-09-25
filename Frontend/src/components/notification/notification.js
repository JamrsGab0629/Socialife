import { getNotifications, markNotificationAsRead } from "./notification.service";
import { get_post_by_id } from "../../helpers/post/post.request";
import { openPostViewer } from "../post-viewer/post-viewer";
import style from "./notification.module.css";

export default async function Notification(root) {
    root.textContent = "Loading notifications...";

    try {
        const result = await getNotifications();
        const notifications = Array.isArray(result?.data) ? result.data : [];

        if (!notifications.length) {
            root.textContent = "You have no notifications yet.";
            return;
        }

        root.innerHTML = notifications.map((notification) => {
            const author = notification.author || {};
            const isRead = Boolean(notification.is_read);

            return `
                <button type="button" class="${style["notif-item"]} ${isRead ? "" : style.unread}" data-notification-id="${notification.notification_id}" data-post-id="${notification.post_id || ""}">
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
        }).join("");

        root.addEventListener("click", async (event) => {
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

            const postId = item.dataset.postId;
            if (postId) {
                try {
                    const { data: post } = await get_post_by_id(postId);
                    if (post) openPostViewer(post);
                } catch (error) {
                    console.error("Failed to open post from notification:", error);
                }
            }
        });
    } catch (error) {
        console.error("Failed to load notifications:", error);
        root.textContent = "Unable to load notifications. Please try again.";
    }
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
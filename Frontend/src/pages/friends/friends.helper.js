import style from "./friends.module.css";
import {
    send_friend_request,
    accept_friend_request,
    decline_friend_request,
    remove_friend
} from "../../helpers/friends/friends.request";
import { confirmDialog } from "../../components/confirm-dialog/confirm-dialog";
const avatar_colors = ["#E8A5A0", "#A5C7E8", "#C7A5E8", "#A5E8C0", "#E8D5A5"];

const getAvatarColor = (user_id) => {
    let hash = 0;
    const str = String(user_id || "");
    for (let i = 0; i < str.length; i++) hash += str.charCodeAt(i);
    return avatar_colors[hash % avatar_colors.length];
};

const getInitial = (name) => (name || "?").trim().charAt(0).toUpperCase();

const renderAvatar = (user) => {
    if (user.profile_url) {
        return `<img src="${user.profile_url}" alt="${user.username}">`;
    }
    return `<div class="${style["avatar-fallback"]}" style="background:${getAvatarColor(user.user_id)};">${getInitial(user.username)}</div>`;
};

export const FriendsTemplate = (friends_data) => {
    const data = friends_data || [];

    if (data.length === 0) {
        return `<div class="${style["empty-state"]}">No friends to show.</div>`;
    }

    return data.map((friend) => `
        <div class="${style["friend-card"]}" data-user-id="${friend.user_id}">
            <div class="${style["avatar-container"]}">
                ${renderAvatar(friend)}
                <span class="${style["status-indicator"]} ${style["online"]}"></span>
            </div>
            <div class="${style["friend-details"]}">
                <div class="${style["friend-name"]}">${friend.username}</div>
                <div class="${style["friend-status"]}">Friend</div>
            </div>
            <button class="${style["chat-shortcut-btn"]}" data-action="remove-friend" data-user-id="${friend.user_id}">Remove</button>
        </div>
    `).join("");
};

export const RequestsTemplate = (requests_data) => {
    const data = requests_data || [];

    if (data.length === 0) {
        return `<div class="${style["empty-state"]}">No pending requests.</div>`;
    }

    return data.map((req) => {
        const requester = req.requester || {};
        return `
            <div class="${style["friend-card"]}" data-user-id="${requester.user_id}">
                <div class="${style["avatar-container"]}">
                    ${renderAvatar(requester)}
                </div>
                <div class="${style["friend-details"]}">
                    <div class="${style["friend-name"]}">${requester.username}</div>
                    <div class="${style["friend-status"]}">Sent you a request</div>
                </div>
                <button class="${style["chat-shortcut-btn"]}" data-action="accept-request" data-user-id="${requester.user_id}">Accept</button>
                <button class="${style["chat-shortcut-btn"]}" data-action="decline-request" data-user-id="${requester.user_id}">Decline</button>
            </div>
        `;
    }).join("");
};

export const SuggestionsTemplate = (suggestions_data) => {
    const data = suggestions_data || [];

    if (data.length === 0) {
        return `<div class="${style["empty-state"]}">No suggestions right now.</div>`;
    }

    return data.map((user) => `
        <div class="${style["friend-card"]}" data-user-id="${user.user_id}">
            <div class="${style["avatar-container"]}">
                ${renderAvatar(user)}
            </div>
            <div class="${style["friend-details"]}">
                <div class="${style["friend-name"]}">${user.username}</div>
                <div class="${style["friend-status"]}">Suggested for you</div>
            </div>
            <button class="${style["chat-shortcut-btn"]}" data-action="add-friend" data-user-id="${user.user_id}">Add Friend</button>
        </div>
    `).join("");
};

// Attaches ONE set of listeners to the container (event delegation).
// Safe to re-render the grid's innerHTML as often as you want — this never re-binds
// and never leaves duplicate/stale listeners behind.
export default function Helper(gridEl, { onChange } = {}) {
    gridEl.addEventListener('click', async (e) => {
        const btn = e.target.closest('[data-action]');
        if (!btn) {
            const card = e.target.closest(`.${style["friend-card"]}`);
            if (card) window.location.href = `/app/profile/${card.dataset.userId}`;
            return;
        }

        e.stopPropagation();
        const userId = btn.dataset.userId;
        const action = btn.dataset.action;

        try {
            if (action === 'add-friend') {
                btn.disabled = true;
                btn.textContent = 'Requested';
                await send_friend_request(userId);
            } else if (action === 'accept-request') {
                await accept_friend_request(userId);
                onChange?.();
            } else if (action === 'decline-request') {
                await decline_friend_request(userId);
                onChange?.();
                       } else if (action === 'remove-friend') {
                const ok = await confirmDialog({
                    title: "Remove this friend?",
                    message: "You'll need to send a new request to reconnect.",
                    confirmText: "Remove",
                    danger: true,
                });
                if (!ok) {
                    btn.disabled = false;
                    return;
                }
                await remove_friend(userId);
                onChange?.();
            }
        } catch (error) {
            console.error(`Failed to perform ${action}:`, error);
            btn.disabled = false;
        }
    });
}
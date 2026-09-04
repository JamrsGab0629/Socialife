import style from "./friends.module.css";

const avatar_colors = ["#E8A5A0", "#A5C7E8", "#C7A5E8", "#A5E8C0", "#E8D5A5"];

const getAvatarColor = (user_id) => {
    const index = Number(user_id) % avatar_colors.length;
    return avatar_colors[Math.abs(index) || 0];
};

const getInitial = (name) => {
    return (name || "?").trim().charAt(0).toUpperCase();
};

export const FriendsTemplate = (friends_data) => {
    const data = friends_data || [];

    if (data.length === 0) {
        return `<div class="${style["empty-state"]}">No friends to show.</div>`;
    }

    let template = "";

    data.forEach((friend) => {
        const color = getAvatarColor(friend["user_id"]);
        const initial = getInitial(friend["user_name"]);

        template += `
            <div class="${style["friend-card"]}" data-user-id="${friend["user_id"]}">
                <div class="${style["avatar-container"]}">
                    <div class="${style["avatar-fallback"]}" style="background:${color};">${initial}</div>
                    <span class="${style["status-indicator"]} ${style["online"]}"></span>
                </div>
                <div class="${style["friend-details"]}">
                    <div class="${style["friend-name"]}">${friend["user_name"]}</div>
                    <div class="${style["friend-status"]}">Active now</div>
                </div>
                <button class="${style["chat-shortcut-btn"]}" data-action="message" data-user-id="${friend["user_id"]}">Message</button>
            </div>
        `;
    });

    return template;
}

// Attaches ONE set of listeners to the container (event delegation).
// Safe to re-render the grid's innerHTML as often as you want — this never re-binds
// and never leaves duplicate/stale listeners behind.
export default function Helper(gridEl) {
    gridEl.addEventListener('click', (e) => {
        const msgBtn = e.target.closest(`.${style["chat-shortcut-btn"]}`);
        if (msgBtn) {
            e.stopPropagation();
            const userId = msgBtn.dataset.userId;
            window.location.href = `/app/messages?user=${userId}`;
            return;
        }

        const card = e.target.closest(`.${style["friend-card"]}`);
        if (card) {
            const userId = card.dataset.userId;
            console.log('Open profile for user', userId);
        }
    });
}

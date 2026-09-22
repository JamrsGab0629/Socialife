// home.helper.js
import style from "./home.module.css";
import Create_Post from '../../components/create_post/create_post';

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
    let template = "";

    if (data.length === 0) return template;

    data.forEach((friend) => {
        const color = getAvatarColor(friend["user_id"]);
        const initial = getInitial(friend["user_name"]);

        template += `
            <div class="${style["friend-row"]}">
                <div class="${style["friend-avatar"]}" style="background:${color};">
                    <div class="${style["avatar-fallback"]}">${initial}</div>
                </div>
                <div class="${style["friend-name"]}">${friend["user_name"]}</div>
                <button class="${style["add-friend-btn"]}" data-user-id="${friend["user_id"]}">Add Friend</button>
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

export default function Helper() {}
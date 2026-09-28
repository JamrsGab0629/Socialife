// notifications.service.js — mocked network layer for the Notifications modal.
const MOCK_SETTINGS = [
    { id: "likes", label: "Likes and reactions", enabled: true },
    { id: "comments", label: "Comments", enabled: true },
    { id: "follows", label: "New followers", enabled: false },
    { id: "messages", label: "Direct messages", enabled: true },
];

export function fetch_notification_settings() {
    return new Promise((resolve) => {
        setTimeout(() => resolve(structuredClone(MOCK_SETTINGS)), 350);
    });
}

export function update_notification_setting(id, enabled) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const item = MOCK_SETTINGS.find((s) => s.id === id);
            if (item) item.enabled = enabled;
            resolve({ success: true });
        }, 250);
    });
}

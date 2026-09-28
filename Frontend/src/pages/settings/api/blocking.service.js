// blocking.service.js — mocked network layer for the Blocking modal.
const MOCK_BLOCKED = [
    { id: 1, name: "troll_acc", blocked_at: "May 26, 2025" },
    { id: 2, name: "spam_account", blocked_at: "May 28, 2025" },
];

export function fetch_blocked_users() {
    return new Promise((resolve) => {
        setTimeout(() => resolve(structuredClone(MOCK_BLOCKED)), 350);
    });
}

export function unblock_user(id) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const idx = MOCK_BLOCKED.findIndex((u) => u.id === id);
            if (idx !== -1) MOCK_BLOCKED.splice(idx, 1);
            resolve({ success: true });
        }, 250);
    });
}

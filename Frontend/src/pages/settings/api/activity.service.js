// activity.service.js — mocked network layer for the Your Activity modal.
const MOCK_ACTIVITY = [
    { id: 1, action: "Liked a post by @mariasantos", date: "Today" },
    { id: 2, action: "Commented on @johndelacruz's photo", date: "Yesterday" },
    { id: 3, action: "Tagged in a post by @alexarivera", date: "3 days ago" },
];

export function fetch_recent_activity() {
    return new Promise((resolve) => {
        setTimeout(() => resolve(structuredClone(MOCK_ACTIVITY)), 350);
    });
}

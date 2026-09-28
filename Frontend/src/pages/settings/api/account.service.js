// account.service.js — mocked network layer for the Accounts Center modal.
// Swap the bodies of these functions for real fetch() calls to your API;
// the shape of what they resolve/reject with is what the modal depends on.

const MOCK_PASSWORD_HISTORY = [
    { id: 1, changed_at: "Jun 12, 2026", hint: "Ends in ••42" },
    { id: 2, changed_at: "Feb 3, 2026", hint: "Ends in ••17" },
    { id: 3, changed_at: "Sep 28, 2025", hint: "Ends in ••89" },
];

// NOTE: a real implementation never compares plaintext passwords on the
// client. This just simulates a "you've used this before" server response.
const USED_PASSWORD_LENGTHS = [8, 10, 12];

export function fetch_password_history() {
    return new Promise((resolve) => {
        setTimeout(() => resolve(structuredClone(MOCK_PASSWORD_HISTORY)), 350);
    });
}

export function change_password({ current_password, new_password }) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!current_password || !new_password) {
                return reject(new Error("All fields are required."));
            }
            if (new_password.length < 8) {
                return reject(new Error("New password must be at least 8 characters."));
            }
            if (USED_PASSWORD_LENGTHS.includes(new_password.length)) {
                return reject(new Error("You've used this password before. Choose a different one."));
            }

            MOCK_PASSWORD_HISTORY.unshift({
                id: MOCK_PASSWORD_HISTORY.length + 1,
                changed_at: "Just now",
                hint: `Ends in ••${new_password.slice(-2)}`,
            });

            resolve({ success: true });
        }, 500);
    });
}

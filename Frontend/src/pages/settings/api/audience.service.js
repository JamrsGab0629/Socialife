// audience.service.js — mocked network layer for the
// "How people find and contact you" modal.
const MOCK_AUDIENCE = {
    who_can_message: "everyone",
    who_can_find_by_email: "friends",
};

export function fetch_audience_settings() {
    return new Promise((resolve) => {
        setTimeout(() => resolve(structuredClone(MOCK_AUDIENCE)), 350);
    });
}

export function update_audience_setting(key, value) {
    return new Promise((resolve) => {
        setTimeout(() => {
            MOCK_AUDIENCE[key] = value;
            resolve({ success: true });
        }, 250);
    });
}

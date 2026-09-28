// contact-modal.js
// Skeleton content for "How people find and contact you" — radio groups
// backed by audience.service. Add more fields the same way as your privacy
// model grows.
import { fetch_audience_settings, update_audience_setting } from "../api/audience.service";

const OPTIONS = ["everyone", "friends", "only_me"];
const OPTION_LABELS = { everyone: "Everyone", friends: "Friends", only_me: "Only me" };

function render_group(style, key, label, current_value) {
    return `
        <div class="${style["field"]}">
            <label>${label}</label>
            ${OPTIONS.map(
                (opt) => `
                <label class="${style["radio-row"]}">
                    <input type="radio" name="${key}" value="${opt}" class="${style["radio-input"]}" ${
                        opt === current_value ? "checked" : ""
                    } />
                    ${OPTION_LABELS[opt]}
                </label>`
            ).join("")}
        </div>`;
}

export function render_contact_modal(body, style) {
    body.innerHTML = `
        <div class="${style["skeleton-line"]}"></div>
        <div class="${style["skeleton-line"]}" style="width:60%"></div>
    `;

    fetch_audience_settings().then((settings) => {
        body.innerHTML = `
            ${render_group(style, "who_can_message", "Who can message you", settings.who_can_message)}
            ${render_group(style, "who_can_find_by_email", "Who can find you by email", settings.who_can_find_by_email)}
        `;

        body.querySelectorAll("input[type='radio']").forEach((input) => {
            input.addEventListener("change", (e) => {
                update_audience_setting(e.target.name, e.target.value);
            });
        });
    });
}

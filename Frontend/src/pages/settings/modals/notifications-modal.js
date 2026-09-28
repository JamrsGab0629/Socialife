// notifications-modal.js
// Skeleton content for the Notifications overlay — a list of toggles backed
// by notifications.service. Add more rows or split into categories as
// your actual notification model grows; the render/bind pattern won't change.
import { fetch_notification_settings, update_notification_setting } from "../api/notifications.service";

export function render_notifications_modal(body, style) {
    body.innerHTML = `
        <div id="notificationsList">
            <div class="${style["skeleton-line"]}"></div>
            <div class="${style["skeleton-line"]}" style="width:70%"></div>
        </div>
    `;

    fetch_notification_settings().then((settings) => {
        const list_el = body.querySelector("#notificationsList");
        list_el.innerHTML = settings
            .map(
                (s) => `
                <div class="${style["list-row"]}">
                    <span>${s.label}</span>
                    <div class="${style["toggle"]} ${s.enabled ? style["active"] : ""}" data-id="${s.id}" role="button" tabindex="0">
                        <span class="${style["toggle-knob"]}"></span>
                    </div>
                </div>`
            )
            .join("");

        list_el.querySelectorAll(`.${style["toggle"]}`).forEach((toggle) => {
            toggle.addEventListener("click", () => {
                const is_active = toggle.classList.toggle(style["active"]);
                update_notification_setting(toggle.dataset.id, is_active);
            });
        });
    });
}

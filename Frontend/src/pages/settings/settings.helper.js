// settings.helper.js
// Wires every clickable settings row to its overlay modal, and wires the
// dark-mode toggle to core/theme.js. Adding a new settings tab later is a
// three-step job: add a data-modal="x" attribute in settings.js, drop an
// "x-modal.js" render function in ./modals/, and register it in MODAL_MAP.
import Modal from "../../components/modal/modal";
import { getSelectedTheme, toggleTheme } from "../../core/theme";

import { render_account_modal } from "./modals/account-modal";
import { render_notifications_modal } from "./modals/notifications-modal";
import { render_contact_modal } from "./modals/contact-modal";
import { render_blocking_modal } from "./modals/blocking-modal";
import { render_activity_modal } from "./modals/activity-modal";

const MODAL_MAP = {
    account: { title: "Accounts Center", render: render_account_modal },
    notifications: { title: "Notifications", render: render_notifications_modal },
    contact: { title: "How people find and contact you", render: render_contact_modal },
    blocking: { title: "Blocking", render: render_blocking_modal },
    activity: { title: "Your activity", render: render_activity_modal },
};

function bind_modal_triggers(root) {
    const modal = Modal();

    root.querySelectorAll("[data-modal]").forEach((item) => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const config = MODAL_MAP[item.dataset.modal];
            if (!config) return;
            modal.open(config.title, config.render);
        });
    });
}

function bind_dark_mode_toggle(root, style) {
    const toggle = root.querySelector("#darkModeToggle");
    if (!toggle) return;

    const sync = () => {
        toggle.classList.toggle(style["active"], getSelectedTheme() === "DARK");
    };

    toggle.addEventListener("click", () => {
        toggleTheme();
        sync();
    });

    toggle.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleTheme();
            sync();
        }
    });

    sync();
}

export function init_settings(root, style) {
    bind_modal_triggers(root);
    bind_dark_mode_toggle(root, style);
}

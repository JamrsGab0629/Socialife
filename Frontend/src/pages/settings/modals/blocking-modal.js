// blocking-modal.js
// Skeleton content for Blocking — list + unblock action backed by
// blocking.service.
import { fetch_blocked_users, unblock_user } from "../api/blocking.service";

export function render_blocking_modal(body, style) {
    body.innerHTML = `<div id="blockedList"><div class="${style["skeleton-line"]}"></div></div>`;

    async function load() {
        const list_el = body.querySelector("#blockedList");
        const blocked = await fetch_blocked_users();

        if (blocked.length === 0) {
            list_el.innerHTML = `<p class="${style["empty-state"]}">You haven't blocked anyone.</p>`;
            return;
        }

        list_el.innerHTML = blocked
            .map(
                (u) => `
                <div class="${style["list-row"]}">
                    <span>@${u.name}<span class="${style["muted-text"]}"> · blocked ${u.blocked_at}</span></span>
                    <button class="${style["link-danger"]}" data-id="${u.id}">Unblock</button>
                </div>`
            )
            .join("");

        list_el.querySelectorAll("button[data-id]").forEach((btn) => {
            btn.addEventListener("click", async () => {
                btn.disabled = true;
                await unblock_user(Number(btn.dataset.id));
                load();
            });
        });
    }

    load();
}

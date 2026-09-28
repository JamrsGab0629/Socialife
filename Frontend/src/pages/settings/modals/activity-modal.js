// activity-modal.js
// Skeleton content for Your Activity — a simple read-only feed backed by
// activity.service. Add pagination/filtering here later without touching
// the modal shell or settings.helper.js.
import { fetch_recent_activity } from "../api/activity.service";

export function render_activity_modal(body, style) {
    body.innerHTML = `<div id="activityList"><div class="${style["skeleton-line"]}"></div></div>`;

    fetch_recent_activity().then((items) => {
        const list_el = body.querySelector("#activityList");
        list_el.innerHTML = items
            .map(
                (a) => `
                <div class="${style["list-row"]}">
                    <span>${a.action}</span>
                    <span class="${style["muted-text"]}">${a.date}</span>
                </div>`
            )
            .join("");
    });
}

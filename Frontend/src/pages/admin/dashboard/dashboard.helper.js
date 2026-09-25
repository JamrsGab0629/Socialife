// dashboard.helper.js
// Pulls a lightweight summary across the other mocked services so the
// dashboard reflects the same data users see on their own pages.
import { fetch_users } from "../api/users.service";
import { fetch_posts } from "../api/posts.service";
import { fetch_reports } from "../api/reports.service";

function status_pill(style_badge, status) {
  const map = {
    pending: [style_badge["badge-orange"], "Pending"],
    reviewed: [style_badge["badge-purple"], "Reviewed"],
    resolved: [style_badge["badge-green"], "Resolved"],
    dismissed: [style_badge["badge-gray"], "Dismissed"],
  };
  const [cls, label] = map[status] || [style_badge["badge-gray"], status];
  return `<span class="${style_badge["badge"]} ${cls}">${label}</span>`;
}

export async function init_dashboard_view(styles) {
  const { style, style_badge } = styles;
  const [users, posts, reports] = await Promise.all([fetch_users(), fetch_posts(), fetch_reports()]);

  const banned_count = users.filter((u) => u.status === "banned").length;
  const pending_reports = reports.filter((r) => r.status === "pending").length;

  document.getElementById("statTotalUsers").textContent = users.length;
  document.getElementById("statTotalPosts").textContent = posts.length;
  document.getElementById("statPendingReports").textContent = pending_reports;
  document.getElementById("statBannedUsers").textContent = banned_count;

  document.getElementById("recentReports").innerHTML = reports
    .slice(0, 4)
    .map(
      (r) => `
      <div class="${style["report-row"]}">
        <span>${r.reporter} reported ${r.target}</span>
        <span class="${style["report-reason"]}">${r.reason}</span>
        ${status_pill(style_badge, r.status)}
      </div>`
    )
    .join("");
}

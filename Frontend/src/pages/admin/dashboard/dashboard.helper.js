import { getDashboardData } from "../api/dashboard.service";

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
  const { stats, reports } = await getDashboardData();

  document.getElementById("statTotalUsers").textContent = stats.totalUsers;
  document.getElementById("statTotalPosts").textContent = stats.totalPosts;
  document.getElementById("statPendingReports").textContent = stats.totalPendingReports;
  document.getElementById("statBannedUsers").textContent = stats.totalBannedUsers;

  const recentReportsContainer = document.getElementById("recentReports");

  if (!reports || reports.length === 0) {
    recentReportsContainer.innerHTML = `<p style="padding: 1rem; color: #888;">No recent reports found.</p>`;
    return;
  }

  recentReportsContainer.innerHTML = reports
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
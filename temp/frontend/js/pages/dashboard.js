import {
  getDashboardMetrics,
  getUserGrowth,
  getDailyActiveUsers,
  getPeakUsageHours,
  getMonthlyActivity,
  getRecentReports,
  getRecentUsers
} from "../api/adminDashboard.service.js";
import { renderMetricCard, renderMetricSkeleton } from "../components/metricCard.js";
import { renderLineChart, renderBarChart } from "../components/charts.js";
import { statusBadge } from "../components/statusBadge.js";
import { icon } from "../components/icons.js";

const METRIC_DEFS = [
  { key: "totalUsers", label: "Total Users", icon: "users", color: "blue" },
  { key: "totalPosts", label: "Total Posts", icon: "posts", color: "blue" },
  { key: "totalReels", label: "Total Reels", icon: "reels", color: "blue" },
  { key: "activeUsers", label: "Active Users", icon: "users", color: "green" },
  { key: "bannedUsers", label: "Banned Users", icon: "shieldBan", color: "red" },
  { key: "totalReports", label: "Total Reports", icon: "flag", color: "amber" }
];

export async function initDashboardPage() {
  const metricsGrid = document.getElementById("metrics-grid");
  metricsGrid.innerHTML = METRIC_DEFS.map((m) => renderMetricSkeleton(m.label, m.icon, m.color)).join("");

  const reportsList = document.getElementById("recent-reports-list");
  const usersTableBody = document.getElementById("recent-users-body");

  const [metrics, reports, users] = await Promise.all([
    getDashboardMetrics(),
    getRecentReports(4),
    getRecentUsers(4)
  ]);

  metricsGrid.innerHTML = METRIC_DEFS.map((m) =>
    renderMetricCard({
      label: m.label,
      value: metrics[m.key]?.toLocaleString?.() ?? metrics[m.key],
      icon: m.icon,
      color: m.color,
      delta: metrics.deltas?.[m.key]
    })
  ).join("");

  reportsList.innerHTML = reports.items
    .map(
      (r) => `
      <div class="report-row">
        <img class="report-row__thumb" src="https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(r.id)}" alt="" />
        <div class="report-row__body">
          <div class="report-row__title">Reported ${r.type === "post" ? "post by" : "user"} <span>${r.target}</span></div>
          <div class="report-row__reason">${r.reason}</div>
        </div>
        <div class="report-row__meta">
          <div class="report-row__time">${r.timeAgo}</div>
          ${statusBadge(r.status)}
        </div>
      </div>`
    )
    .join("");

  usersTableBody.innerHTML = users.items
    .map(
      (u) => `
      <tr>
        <td>
          <div class="data-table__user">
            <span class="avatar">${icon("user")}</span>
            <div>
              <div class="data-table__user-name">${u.name}</div>
              <div class="data-table__user-handle">${u.handle}</div>
            </div>
          </div>
        </td>
        <td class="data-table__muted">${u.email}</td>
        <td class="data-table__muted">${u.joined}</td>
        <td>${statusBadge(u.status)}</td>
      </tr>`
    )
    .join("");

  await loadChart("user-growth-chart", getUserGrowth, renderLineChart);
  await loadChart("dau-chart", getDailyActiveUsers, renderBarChart);
  await loadChart("peak-hours-chart", getPeakUsageHours, renderLineChart);
  await loadChart("monthly-activity-chart", getMonthlyActivity, renderBarChart);
}

async function loadChart(svgId, fetcher, renderer, range) {
  const svg = document.getElementById(svgId);
  if (!svg) return;
  const data = await fetcher(range);
  renderer(svg, data);
}

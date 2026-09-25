// analytics.helper.js
// Fetching analytics data and drawing simple, dependency-free SVG charts.
import { fetch_analytics } from "../api/analytics.service";

const WIDTH = 420;
const HEIGHT = 220;
const PADDING = 30;

function build_line_chart(data) {
  const max_value = Math.max(...data.map((d) => d.value));
  const step_x = (WIDTH - PADDING * 2) / (data.length - 1);
  const points = data.map((d, i) => {
    const x = PADDING + i * step_x;
    const y = HEIGHT - PADDING - (d.value / max_value) * (HEIGHT - PADDING * 2);
    return { x, y, label: d.label };
  });

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const area = `${path} L ${points[points.length - 1].x} ${HEIGHT - PADDING} L ${points[0].x} ${HEIGHT - PADDING} Z`;

  return `
    <svg class="chart-svg" viewBox="0 0 ${WIDTH} ${HEIGHT + 20}" xmlns="http://www.w3.org/2000/svg">
      <path d="${area}" fill="var(--color-primary)" fill-opacity="0.12" stroke="none" />
      <path d="${path}" fill="none" stroke="var(--color-primary)" stroke-width="2.5" />
      ${points
        .map(
          (p) => `
            <circle cx="${p.x}" cy="${p.y}" r="4" fill="var(--color-primary)" />
            <text x="${p.x}" y="${HEIGHT + 14}" text-anchor="middle" class="axis-label">${p.label}</text>`
        )
        .join("")}
    </svg>`;
}

function build_bar_chart(data) {
  const max_value = Math.max(...data.map((d) => d.value));
  const bar_gap = 14;
  const bar_width = (WIDTH - PADDING * 2 - bar_gap * (data.length - 1)) / data.length;

  const bars = data
    .map((d, i) => {
      const bar_height = (d.value / max_value) * (HEIGHT - PADDING * 2);
      const x = PADDING + i * (bar_width + bar_gap);
      const y = HEIGHT - PADDING - bar_height;
      return `
        <rect x="${x}" y="${y}" width="${bar_width}" height="${bar_height}" rx="6" fill="var(--color-primary)" />
        <text x="${x + bar_width / 2}" y="${HEIGHT + 14}" text-anchor="middle" class="axis-label">${d.label}</text>`;
    })
    .join("");

  return `
    <svg class="chart-svg" viewBox="0 0 ${WIDTH} ${HEIGHT + 20}" xmlns="http://www.w3.org/2000/svg">
      ${bars}
    </svg>`;
}

export async function init_analytics_view() {
  const { user_growth, active_users } = await fetch_analytics();
  document.getElementById("userGrowthChart").innerHTML = build_line_chart(user_growth);
  document.getElementById("activeUsersChart").innerHTML = build_bar_chart(active_users);
}

// reports.helper.js
// Fetching, status filtering and review/resolve/dismiss actions.
import { fetch_reports, set_report_status } from "../api/reports.service";

const state = { all_reports: [], status_filter: "all" };

function get_filtered_reports() {
  if (state.status_filter === "all") return state.all_reports;
  return state.all_reports.filter((r) => r.status === state.status_filter);
}

function status_badge(style_badge, status) {
  const map = {
    pending: [style_badge["badge-orange"], "Pending"],
    reviewed: [style_badge["badge-purple"], "Reviewed"],
    resolved: [style_badge["badge-green"], "Resolved"],
    dismissed: [style_badge["badge-gray"], "Dismissed"],
  };
  const [cls, label] = map[status] || [style_badge["badge-gray"], status];
  return `<span class="${style_badge["badge"]} ${cls}">${label}</span>`;
}

function render_rows(styles) {
  const { style, style_btn, style_badge } = styles;
  const filtered = get_filtered_reports();
  const body = document.getElementById("reportsTableBody");

  if (filtered.length === 0) {
    body.innerHTML = `<tr><td colspan="5" class="${style["empty"]}">No reports match this filter.</td></tr>`;
  } else {
    body.innerHTML = filtered
      .map(
        (r) => `
        <tr>
          <td>${r.reporter}</td>
          <td><span class="${style["target-tag"]}">${r.target_type}</span>${r.target}</td>
          <td>${r.reason}</td>
          <td>${status_badge(style_badge, r.status)}</td>
          <td>${r.date}</td>
          <td>
            <div class="${style["actions"]}">
              <button class="${style_btn["btn"]} ${style_btn["btn-dark"]}" data-action="reviewed" data-id="${r.id}">Review</button>
              <button class="${style_btn["btn"]} ${style_btn["btn-success"]}" data-action="resolved" data-id="${r.id}">Resolve</button>
              <button class="${style_btn["btn"]} ${style_btn["btn-danger"]}" data-action="dismissed" data-id="${r.id}">Dismiss</button>
            </div>
          </td>
        </tr>`
      )
      .join("");
  }

  document.getElementById("reportsCount").textContent = `Showing 1-${filtered.length} of ${filtered.length}`;
}

function bind_events(styles) {
  document.getElementById("reportStatusFilter").addEventListener("change", (e) => {
    state.status_filter = e.target.value;
    render_rows(styles);
  });

  document.getElementById("reportsTableBody").addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const next_status = btn.dataset.action;

    btn.disabled = true;
    await set_report_status(id, next_status);
    const report = state.all_reports.find((r) => r.id === id);
    if (report) report.status = next_status;
    render_rows(styles);
  });
}

export async function init_reports_view(styles) {
  state.all_reports = await fetch_reports();
  render_rows(styles);
  bind_events(styles);
}

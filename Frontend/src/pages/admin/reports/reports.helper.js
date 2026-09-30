import { fetch_reports, set_report_status } from "../api/reports.service";

const PAGE_SIZE = 10;

const state = {
  reports: [],
  total_items: 0,
  total_pages: 1,
  status_filter: "all",
  page: 1,
  loading: false
};

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
  const body = document.getElementById("reportsTableBody");
  if (!body) return;

  if (state.loading) {
    body.innerHTML = `<tr><td colspan="6" class="${style["empty"]}">Loading reports...</td></tr>`;
    return;
  }

  if (state.reports.length === 0) {
    body.innerHTML = `<tr><td colspan="6" class="${style["empty"]}">No reports match this filter.</td></tr>`;
  } else {
    body.innerHTML = state.reports
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

  const start = state.total_items === 0 ? 0 : (state.page - 1) * PAGE_SIZE + 1;
  const end = Math.min(state.page * PAGE_SIZE, state.total_items);

  const countEl = document.getElementById("reportsCount");
  if (countEl) {
    countEl.textContent = `Showing ${start}-${end} of ${state.total_items}`;
  }

  const pager = document.getElementById("reportsPager");
  if (pager) {
    pager.innerHTML = Array.from({ length: state.total_pages }, (_, i) => i + 1)
      .map(
        (n) =>
          `<button class="${style["page-btn"]} ${n === state.page ? style["is-current"] : ""}" data-page="${n}">${n}</button>`
      )
      .join("");
  }
}

async function load_data(styles) {
  state.loading = true;
  render_rows(styles);

  try {
    const data = await fetch_reports({
      page: state.page,
      limit: PAGE_SIZE,
      status: state.status_filter
    });

    state.reports = data.reports;
    state.total_items = data.pagination.totalItems;
    state.total_pages = data.pagination.totalPages || 1;
  } catch (err) {
    console.error("Failed to load reports:", err);
    state.reports = [];
    state.total_items = 0;
    state.total_pages = 1;
  } finally {
    state.loading = false;
    render_rows(styles);
  }
}

function bind_events(styles) {
  document.getElementById("reportStatusFilter")?.addEventListener("change", (e) => {
    state.status_filter = e.target.value;
    state.page = 1;
    load_data(styles);
  });

  document.getElementById("reportsPager")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-page]");
    if (!btn) return;
    const selectedPage = Number(btn.dataset.page);
    if (selectedPage !== state.page) {
      state.page = selectedPage;
      load_data(styles);
    }
  });
document.getElementById("reportsTableBody")?.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const id = btn.dataset.id; // <-- no Number() conversion, UUIDs stay as strings
    const next_status = btn.dataset.action;

    btn.disabled = true;
    try {
      await set_report_status(id, next_status);
      await load_data(styles);
    } catch (err) {
      console.error("Failed to update report status:", err);
      btn.disabled = false;
    }
});
}

export async function init_reports_view(styles) {
  bind_events(styles);
  await load_data(styles);
}
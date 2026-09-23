import { getReports, reviewReport, resolveReport, dismissReport } from "../api/reports.service.js";
import { statusBadge } from "../components/statusBadge.js";
import { renderStatePanel, renderPagination } from "../components/table.js";
import { confirmModal } from "../components/modal.js";
import { showToast } from "../app.js";

const state = { page: 1, pageSize: 8, status: "all" };

export async function initReportsPage() {
  document.getElementById("reports-status-filter").addEventListener("change", (e) => {
    state.status = e.target.value;
    state.page = 1;
    loadReports();
  });

  await loadReports();
}

async function loadReports() {
  const body = document.getElementById("reports-table-body");
  const wrap = document.getElementById("reports-table-wrap");
  const paginationSlot = document.getElementById("reports-pagination");
  const table = document.getElementById("reports-table");

  table.style.display = "none";
  wrap.querySelector(".state-panel")?.remove();
  wrap.insertAdjacentHTML("beforeend", renderStatePanel({ type: "loading", title: "Loading reports..." }));

  try {
    const res = await getReports(state);
    wrap.querySelector(".state-panel")?.remove();

    if (!res.items.length) {
      table.style.display = "none";
      wrap.insertAdjacentHTML(
        "beforeend",
        renderStatePanel({ type: "empty", title: "No reports found", desc: "Try a different status filter." })
      );
      paginationSlot.innerHTML = "";
      return;
    }

    table.style.display = "";
    body.innerHTML = res.items.map(reportRow).join("");
    attachRowActions(body);

    paginationSlot.innerHTML = "";
    paginationSlot.appendChild(
      renderPagination({
        page: res.page,
        pageSize: res.pageSize,
        total: res.total,
        onPageChange: (p) => {
          state.page = p;
          loadReports();
        }
      })
    );
  } catch (err) {
    table.style.display = "none";
    wrap.querySelector(".state-panel")?.remove();
    wrap.insertAdjacentHTML(
      "beforeend",
      renderStatePanel({ type: "error", title: "Couldn't load reports", desc: err.message })
    );
    paginationSlot.innerHTML = "";
  }
}

function reportRow(r) {
  return `
    <tr data-id="${r.id}">
      <td class="data-table__muted">${r.reporter}</td>
      <td>
        <span class="badge badge--neutral" style="margin-right:6px;">${r.targetType}</span>${r.target}
      </td>
      <td class="data-table__muted">${r.reason}</td>
      <td>${statusBadge(r.status)}</td>
      <td class="data-table__muted">${r.date}</td>
      <td>
        <div class="data-table__actions">
          <button class="btn btn--sm btn--secondary" data-action="review">Review</button>
          <button class="btn btn--sm btn--success" data-action="resolve">Resolve</button>
          <button class="btn btn--sm btn--danger" data-action="dismiss">Dismiss</button>
        </div>
      </td>
    </tr>`;
}

function attachRowActions(body) {
  body.querySelectorAll("button[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.closest("tr");
      const id = row.dataset.id;
      const action = btn.dataset.action;

      const actions = {
        review: { fn: reviewReport, label: "marked as reviewed", tone: "info", title: "Mark report as reviewed?" },
        resolve: { fn: resolveReport, label: "resolved", tone: "success", title: "Resolve this report?" },
        dismiss: { fn: dismissReport, label: "dismissed", tone: "danger", title: "Dismiss this report?" }
      };
      const cfg = actions[action];
      if (!cfg) return;

      confirmModal({
        title: cfg.title,
        body: "This updates the report's status for the moderation team.",
        confirmLabel: action.charAt(0).toUpperCase() + action.slice(1),
        tone: cfg.tone === "info" ? "info" : cfg.tone,
        onConfirm: async () => {
          try {
            await cfg.fn(id);
          } catch {
            /* falls back silently until backend is connected */
          }
          showToast(`Report ${cfg.label}.`);
          loadReports();
        }
      });
    });
  });
}

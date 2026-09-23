import { icon } from "./icons.js";

export function renderStatePanel({ type = "empty", title, desc }) {
  if (type === "loading") {
    return `<div class="state-panel"><div class="spinner"></div><div class="state-panel__title">${title || "Loading..."}</div></div>`;
  }
  const isError = type === "error";
  return `
    <div class="state-panel ${isError ? "state-panel--error" : ""}">
      <span class="state-panel__icon">${icon(isError ? "alertTriangle" : "inbox")}</span>
      <div class="state-panel__title">${title}</div>
      ${desc ? `<div class="state-panel__desc">${desc}</div>` : ""}
    </div>
  `;
}

export function renderPagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const wrap = document.createElement("div");
  wrap.className = "pagination";

  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const pageButtons = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
      pageButtons.push(p);
    } else if (pageButtons[pageButtons.length - 1] !== "...") {
      pageButtons.push("...");
    }
  }

  wrap.innerHTML = `
    <div class="pagination__info">Showing ${start}-${end} of ${total}</div>
    <div class="pagination__controls">
      <button class="pagination__btn" data-page="${page - 1}" ${page === 1 ? "disabled" : ""} aria-label="Previous page">${icon("chevronLeft")}</button>
      ${pageButtons
        .map((p) =>
          p === "..."
            ? `<span class="pagination__btn" style="pointer-events:none;">...</span>`
            : `<button class="pagination__btn ${p === page ? "is-active" : ""}" data-page="${p}">${p}</button>`
        )
        .join("")}
      <button class="pagination__btn" data-page="${page + 1}" ${page === totalPages ? "disabled" : ""} aria-label="Next page">${icon("chevronRight")}</button>
    </div>
  `;

  wrap.querySelectorAll("[data-page]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = Number(btn.dataset.page);
      if (target >= 1 && target <= totalPages) onPageChange(target);
    });
  });

  return wrap;
}

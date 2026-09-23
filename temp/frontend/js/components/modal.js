import { icon } from "./icons.js";

// tone: "danger" | "success" | "info"
export function confirmModal({ title, body, confirmLabel = "Confirm", tone = "danger", onConfirm }) {
  const overlay = document.getElementById("modal-root");
  const iconName = tone === "success" ? "restore" : tone === "danger" ? "shieldBan" : "alertTriangle";

  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal__icon" style="background:var(--color-${tone}-bg); color:var(--color-${tone});">
        ${icon(iconName)}
      </div>
      <div class="modal__title">${title}</div>
      <div class="modal__body">${body}</div>
      <div class="modal__actions">
        <button class="btn btn--secondary" id="modal-cancel">Cancel</button>
        <button class="btn btn--${tone === "success" ? "success" : "danger"}" id="modal-confirm">${confirmLabel}</button>
      </div>
    </div>
  `;
  overlay.hidden = false;

  const close = () => {
    overlay.hidden = true;
    overlay.innerHTML = "";
  };

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  }, { once: true });

  document.getElementById("modal-cancel").addEventListener("click", close);
  document.getElementById("modal-confirm").addEventListener("click", () => {
    onConfirm?.();
    close();
  });
}

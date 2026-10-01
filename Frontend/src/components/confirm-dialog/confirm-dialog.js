import style from "./confirm-dialog.module.css";

let overlayEl = null;

function buildOverlay() {
    const el = document.createElement("div");
    el.className = style["cd-overlay"];
    el.hidden = true;
    el.innerHTML = `
        <div class="${style["cd-card"]}">
            <div class="${style["cd-brand"]}">
                <img src="../../icons/socialife-stamp.png" alt="" onerror="this.style.display='none'">
                <span>SociaLife</span>
            </div>
            <h3 class="${style["cd-title"]}" data-cd-title></h3>
            <p class="${style["cd-message"]}" data-cd-message></p>
            <div class="${style["cd-actions"]}">
                <button type="button" class="${style["cd-cancel"]}" data-cd-cancel></button>
                <button type="button" class="${style["cd-confirm"]}" data-cd-confirm></button>
            </div>
        </div>
    `;
    document.body.appendChild(el);
    return el;
}

/**
 * Shows a branded confirm dialog and resolves to true/false.
 * @param {Object} options
 * @param {string} [options.title="Are you sure?"]
 * @param {string} [options.message=""]
 * @param {string} [options.confirmText="Confirm"]
 * @param {string} [options.cancelText="Cancel"]
 * @param {boolean} [options.danger=false] - red confirm button for destructive actions
 * @returns {Promise<boolean>}
 */
export function confirmDialog({
    title = "Are you sure?",
    message = "",
    confirmText = "Confirm",
    cancelText = "Cancel",
    danger = false,
} = {}) {
    if (!overlayEl || !document.body.contains(overlayEl)) {
        overlayEl = buildOverlay();
    }

    overlayEl.querySelector("[data-cd-title]").textContent = title;
    overlayEl.querySelector("[data-cd-message]").textContent = message;

    const cancelBtn = overlayEl.querySelector("[data-cd-cancel]");
    const confirmBtn = overlayEl.querySelector("[data-cd-confirm]");
    cancelBtn.textContent = cancelText;
    confirmBtn.textContent = confirmText;
    confirmBtn.classList.toggle(style["cd-danger"], danger);

    overlayEl.hidden = false;

    return new Promise((resolve) => {
        function cleanup(result) {
            overlayEl.hidden = true;
            cancelBtn.removeEventListener("click", onCancel);
            confirmBtn.removeEventListener("click", onConfirm);
            overlayEl.removeEventListener("click", onBackdrop);
            resolve(result);
        }
        function onCancel() { cleanup(false); }
        function onConfirm() { cleanup(true); }
        function onBackdrop(e) {
            if (e.target === overlayEl) cleanup(false);
        }

        cancelBtn.addEventListener("click", onCancel);
        confirmBtn.addEventListener("click", onConfirm);
        overlayEl.addEventListener("click", onBackdrop);
    });
}
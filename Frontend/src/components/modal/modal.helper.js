// modal.helper.js
// Overlay-level interaction handlers: closing via the ✕ button, clicking
// outside the panel, or pressing Escape. Kept separate from modal.js so the
// component file stays focused on markup/composition.

export function bind_overlay_events(els, close) {
    els.close_btn.addEventListener("click", close);

    els.overlay.addEventListener("click", (e) => {
        if (e.target === els.overlay) close();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
    });
}

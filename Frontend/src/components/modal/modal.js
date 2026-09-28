// modal.js
// A single reusable, blurred overlay modal. Any feature can call Modal()
// to get the shared instance (created once, appended to <body> lazily) and
// call .open(title, render_body) to fill it with whatever content it needs.
//
// Usage from any view/helper:
//   import Modal from "../../components/modal/modal";
//   const modal = Modal();
//   modal.open("Some title", (body, style, close) => { ...render into body... });
import style from "./modal.module.css";
import { bind_overlay_events } from "./modal.helper";

let instance = null;

export default function Modal() {
    if (instance) return instance;

    const root = document.createElement("div");
    root.className = style["overlay"];
    root.innerHTML = `
        <div class="${style["panel"]}" id="modalPanel">
            <div class="${style["panel-header"]}">
                <h3 class="${style["panel-title"]}" id="modalTitle"></h3>
                <button class="${style["panel-close"]}" id="modalClose" aria-label="Close">✕</button>
            </div>
            <div class="${style["panel-body"]}" id="modalBody"></div>
        </div>
    `;
    document.body.appendChild(root);

    const els = {
        overlay: root,
        panel: root.querySelector("#modalPanel"),
        title: root.querySelector("#modalTitle"),
        body: root.querySelector("#modalBody"),
        close_btn: root.querySelector("#modalClose"),
    };

    function open(title, render_body) {
        els.title.textContent = title;
        els.body.innerHTML = "";
        root.classList.add(style["is-open"]);
        document.body.style.overflow = "hidden";
        if (typeof render_body === "function") {
            render_body(els.body, style, close);
        }
    }

    function close() {
        root.classList.remove(style["is-open"]);
        document.body.style.overflow = "";
    }

    bind_overlay_events(els, close);

    instance = { open, close };
    return instance;
}

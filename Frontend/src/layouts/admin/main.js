import style from "./main.module.css";
import { bind_topbar } from "./main.helper";

const NOTIF_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`;

const PROFILE_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;

export default function MainLayout(root) {
  root.innerHTML = `
    <div class="${style["shell"]}">
      <aside class="${style["sidebar"]}" id="sidebar"></aside>
      <div class="${style["content-wrapper"]}">
        <header class="${style["topbar"]}">
          <div class="${style["topbar-actions"]}">
            <button class="${style["icon-btn"]}" id="notifBtn">
              ${NOTIF_ICON}<span class="${style["notif-badge"]}">3</span>
            </button>
            <button class="${style["icon-btn"]}" id="profileBtn">${PROFILE_ICON}</button>
          </div>
        </header>
        <main class="${style["main-content"]}" id="mainContent"></main>
      </div>
    </div>
  `;

  bind_topbar(root);

  return {
    navigation: document.getElementById("sidebar"),
    main: document.getElementById("mainContent") 
  };
}
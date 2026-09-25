import style from "./main.module.css";
import { bind_topbar } from "./main.helper";

export default function MainLayout(root) {

  root.innerHTML = `
    <div class="${style["shell"]}">
      <aside class="${style["sidebar"]}" id="sidebar"></aside>
      <div class="${style["content-wrapper"]}">
        <header class="${style["topbar"]}">
          <div class="${style["topbar-actions"]}">
            <button class="${style["icon-btn"]}" id="notifBtn">
              🔔<span class="${style["notif-badge"]}">3</span>
            </button>
            <button class="${style["icon-btn"]}" id="profileBtn">👤</button>
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

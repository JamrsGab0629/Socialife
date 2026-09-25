import style from "./navigation.module.css";
import style_active from "../../../styles/admin/active.module.css";
import { NAV_ITEMS, highlight_active_route, bind_logout } from "./navigation.helper";

const BRAND_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.58 7.58"></path><circle cx="11" cy="11" r="2"></circle></svg>`;

const LOGOUT_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>`;

function render_links(items, style) {
  return items
    .map(
      (item) => `
        <a href="/admin/${item.route}" data-route="${item.route}" class="${style["nav-item"]}">
          <span class="${style["nav-icon"]}">${item.icon}</span>
          <span class="${style["nav-text"]}">${item.label}</span>
        </a>`
    )
    .join("");
}

export default function Navigation(root, current_route) {
  root.innerHTML = `
    <div class="${style["brand"]}">
      <span class="${style["brand-icon"]}">${BRAND_ICON}</span>
      <span class="${style["brand-text"]}">Socialife</span>
    </div>

    <div class="${style["profile"]}">
      <div class="${style["avatar-wrapper"]}">
        <div class="${style["avatar"]}"></div>
      </div>
      <div class="${style["profile-info"]}">
        <p class="${style["profile-name"]}">James Gabriel</p>
        <p class="${style["profile-role"]}">Administrator</p>
        <p class="${style["profile-status"]}"><span class="${style["status-dot"]}"></span>Online</p>
      </div>
    </div>

    <p class="${style["nav-label"]}">Main</p>
    <nav class="${style["nav-list"]}" id="mainNav">${render_links(NAV_ITEMS.main, style)}</nav>

    <!--
    <p class="${style["nav-label"]}">System</p>
    <nav class="${style["nav-list"]}" id="systemNav">${render_links(NAV_ITEMS.system, style)}</nav>
    --->
    <button class="${style["logout"]}" id="logoutBtn">
      <span class="${style["nav-icon"]}">${LOGOUT_ICON}</span>
      <span class="${style["nav-text"]}">Log out</span>
    </button>
  `;

  highlight_active_route(root, style, style_active, current_route);
  bind_logout(root.querySelector("#logoutBtn"));

  return { root };
}
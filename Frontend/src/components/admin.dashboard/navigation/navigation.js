import style from "./navigation.module.css";
import style_active from "../../../styles/admin/active.module.css";
import {
  NAV_ITEMS,
  highlight_active_route,
  bind_logout,
  setupAdminInformation
} from "./navigation.helper";

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
    <!-- BRAND / LOGO -->
    <a href="/admin/dashboard" class="${style["brand"]}">
      <img class="${style["stamp"]}" src="/Socialife-stamp.png" alt="Socialife Stamp">
      <img class="${style["script"]}" src="/Socialife-script.png" alt="Socialife Logo">
    </a>

    <!-- PROFILE BLOCK -->
    <div class="${style["profile"]}">
      <div class="${style["avatar-wrapper"]}" data-admin="avatar-wrapper" data-img-class="${style["avatar"]}">
        <div class="${style["avatar"]}"></div>
      </div>
      <div class="${style["profile-info"]}">
        <p class="${style["profile-name"]}" data-admin="profile-name">Loading...</p>
        <p class="${style["profile-role"]}" data-admin="profile-role">Administrator</p>
        <p class="${style["profile-status"]}"><span class="${style["status-dot"]}"></span>Online</p>
      </div>
    </div>

    <!-- MAIN NAV -->
    <p class="${style["nav-label"]}">Main</p>
    <nav class="${style["nav-list"]}" id="mainNav">${render_links(NAV_ITEMS.main, style)}</nav>

    <!-- LOGOUT -->
    <button class="${style["logout"]}" id="logoutBtn">
      <span class="${style["nav-icon"]}">${LOGOUT_ICON}</span>
      <span class="${style["nav-text"]}">Log out</span>
    </button>
  `;

  // Apply route highlighting
  highlight_active_route(root, style, style_active, current_route);

  // Attach logout handler
  bind_logout(root.querySelector("#logoutBtn"));

  // Fetch admin verification and populate user profile
  setupAdminInformation(root);

  return { root };
}
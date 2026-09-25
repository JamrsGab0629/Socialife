// navigation.js
// Shared sidebar. Rendered fresh by MainLayout on every route change so the
// active-link state always matches the current page.
import style from "./navigation.module.css";
import style_active from "../../../styles/admin/active.module.css";
import { NAV_ITEMS, highlight_active_route, bind_logout } from "./navigation.helper";

function render_links(items, style) {
  return items
    .map(
      (item) => `
        <a href="/admin/${item.route}" data-route="${item.route}" class="${style["nav-item"]}">
          <span class="${style["nav-icon"]}">${item.icon}</span>${item.label}
        </a>`
    )
    .join("");
}

export default function Navigation(root, current_route) {
  root.innerHTML = `
    <div class="${style["brand"]}">
      <span class="${style["brand-icon"]}">✎</span>
      <span>Socialife</span>
    </div>

    <div class="${style["profile"]}">
      <div class="${style["avatar"]}"></div>
      <div>
        <p class="${style["profile-name"]}">James Gabriel</p>
        <p class="${style["profile-role"]}">Administrator</p>
        <p class="${style["profile-status"]}"><span class="${style["status-dot"]}"></span>Online</p>
      </div>
    </div>

    <p class="${style["nav-label"]}">Main</p>
    <nav class="${style["nav-list"]}" id="mainNav">${render_links(NAV_ITEMS.main, style)}</nav>

    <p class="${style["nav-label"]}">System</p>
    <nav class="${style["nav-list"]}" id="systemNav">${render_links(NAV_ITEMS.system, style)}</nav>

    <button class="${style["logout"]}" id="logoutBtn">↩ Log out</button>
  `;

  highlight_active_route(root, style, style_active, current_route);
  bind_logout(root.querySelector("#logoutBtn"));

  return { root };
}

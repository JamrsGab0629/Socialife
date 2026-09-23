import { icon } from "./icons.js";

const NAV_MAIN = [
  { key: "dashboard", label: "Dashboard", icon: "dashboard" },
  { key: "users", label: "Users", icon: "users" },
  { key: "posts", label: "Posts", icon: "posts" },
  { key: "reports", label: "Reports", icon: "reports" },
  { key: "analytics", label: "Analytics", icon: "analytics" },
  { key: "team-roles", label: "Team Roles", icon: "teamRoles" }
];

const NAV_SYSTEM = [{ key: "settings", label: "Settings", icon: "settings" }];

// TODO(backend): source the signed-in admin from the session/auth endpoint.
const CURRENT_ADMIN = { name: "James Gabriel", role: "Administrator", online: true };

export function renderSidebar(activeKey) {
  const navItem = (item) => `
    <li>
      <a class="sidebar__link ${item.key === activeKey ? "is-active" : ""}" href="#/${item.key}" data-route="${item.key}">
        ${icon(item.icon)}
        <span>${item.label}</span>
      </a>
    </li>`;

  return `
    <div class="sidebar__brand">
      <span class="sidebar__brand-mark">${icon("logo")}</span>
      <span class="sidebar__brand-name">Socialife</span>
    </div>

    <div class="sidebar__profile">
      <span class="sidebar__avatar">${icon("user")}</span>
      <div class="sidebar__profile-info">
        <div class="sidebar__profile-name">${CURRENT_ADMIN.name}</div>
        <div class="sidebar__profile-role">${CURRENT_ADMIN.role}</div>
        <div class="sidebar__profile-status"><span class="sidebar__status-dot"></span> Online</div>
      </div>
    </div>

    <nav class="sidebar__nav">
      <div>
        <div class="sidebar__group-label">MAIN</div>
        <ul class="sidebar__list">${NAV_MAIN.map(navItem).join("")}</ul>
      </div>
      <div>
        <div class="sidebar__group-label">SYSTEM</div>
        <ul class="sidebar__list">${NAV_SYSTEM.map(navItem).join("")}</ul>
      </div>
    </nav>

    <div class="sidebar__footer">
      <a class="sidebar__link" href="#" id="logout-link">
        ${icon("logout")}
        <span>Log out</span>
      </a>
    </div>
  `;
}

export function mountSidebar(activeKey) {
  const sidebar = document.getElementById("sidebar");
  sidebar.innerHTML = renderSidebar(activeKey);

  const backdrop = document.getElementById("sidebar-backdrop");
  sidebar.querySelectorAll(".sidebar__link[data-route]").forEach((link) => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("is-open");
      backdrop?.classList.remove("is-visible");
    });
  });

  document.getElementById("logout-link")?.addEventListener("click", (e) => {
    e.preventDefault();
    // TODO(backend): call the real logout endpoint, which clears the
    // HTTP-only auth cookie server-side.
    window.location.hash = "#/dashboard";
  });
}

// navigation.helper.js
// Event handlers, active-route highlighting, and nav data for the sidebar.

export const NAV_ITEMS = {
  main: [
    { route: "dashboard", label: "Dashboard", icon: "▦" },
    { route: "users", label: "Users", icon: "☺" },
    { route: "posts", label: "Posts", icon: "▤" },
    { route: "reports", label: "Reports", icon: "⚑" },
    { route: "analytics", label: "Analytics", icon: "📈" },
    { route: "team-roles", label: "Team Roles", icon: "☰" },
  ],
  system: [{ route: "settings", label: "Settings", icon: "⚙" }],
};

export function highlight_active_route(root, style, style_active, current_route) {
  const links = root.querySelectorAll(`.${style["nav-item"]}`);
  links.forEach((link) => {
    const is_active = link.dataset.route === current_route;
    link.classList.toggle(style_active["is-active"], is_active);
  });
}

export function bind_logout(button) {
  if (!button) return;
  button.addEventListener("click", () => {
    // Mocked logout flow — no real session to clear yet.
    window.alert("You have been logged out (mocked).");
  });
}

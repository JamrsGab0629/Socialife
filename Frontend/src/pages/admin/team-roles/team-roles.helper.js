// team-roles.helper.js
// Fetching admins and rendering the roles table; "Add administrator" is a
// mocked create action so submissions can't be duplicated mid-flight.
import { fetch_admins, add_admin } from "../api/team-roles.service";

let has_submit = false;
const state = { admins: [] };

function render_rows(styles) {
  const { style, style_btn, style_badge } = styles;
  document.getElementById("adminsTableBody").innerHTML = state.admins
    .map(
      (a) => `
      <tr>
        <td>
          <div class="${style["name-cell"]}">
            <div class="${style["avatar"]}"></div>
            <span class="${style["name"]}">${a.name}</span>
          </div>
        </td>
        <td>${a.email}</td>
        <td><span class="${style_badge["badge"]} ${style_badge["badge-purple"]}">${a.role}</span></td>
        <td>${a.permissions}</td>
        <td class="${style["actions"]}">
          <button class="${style_btn["btn"]} ${style_btn["btn-outline"]}" data-id="${a.id}">Edit role</button>
        </td>
      </tr>`
    )
    .join("");
}

function bind_events(styles) {
  document.getElementById("addAdminBtn").addEventListener("click", async () => {
    if (has_submit) return; // submission guard
    has_submit = true;

    await add_admin({
      name: "New Admin",
      email: "new.admin@socialife.app",
      role: "User Support",
      permissions: "Users (view only)",
    });
    state.admins = await fetch_admins();
    render_rows(styles);

    has_submit = false;
  });

  document.getElementById("adminsTableBody").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-id]");
    if (!btn) return;
    window.alert(`Editing role for admin #${btn.dataset.id} (mocked).`);
  });
}

export async function init_team_roles_view(styles) {
  state.admins = await fetch_admins();
  render_rows(styles);
  bind_events(styles);
}

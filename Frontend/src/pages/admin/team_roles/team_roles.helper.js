import { fetch_admins, add_admin, update_admin_role } from "../api/team_roles.service";

let is_submitting = false;
const state = {
  admins: [],
  page: 1,
  limit: 20,
  totalItems: 0
};

function render_rows(styles) {
  const { style, style_btn, style_badge } = styles;
  const tbody = document.getElementById("adminsTableBody");

  if (!tbody) return;

  if (state.admins.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="${style["empty"]}">No team members found.</td></tr>`;
    return;
  }

  tbody.innerHTML = state.admins
    .map(
      (a) => `
      <tr>
        <td>
          <div class="${style["name-cell"]}">
            <div class="${style["avatar"]}">
              ${
                a.avatar
                  ? `<img src="${a.avatar}" alt="${a.name}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" />`
                  : `<span>${a.name.charAt(0).toUpperCase()}</span>`
              }
            </div>
            <span class="${style["name"]}">${a.name}</span>
          </div>
        </td>
        <td>${a.email}</td>
        <td><span class="${style_badge["badge"]} ${style_badge["badge-purple"]}">${a.role}</span></td>
        <td>${a.permissions}</td>
        <td class="${style["actions"]}">
          <button class="${style_btn["btn"]} ${style_btn["btn-outline"]}" data-id="${a.id}" data-role="${a.rawRole}" data-name="${a.name}">
            Edit role
          </button>
        </td>
      </tr>`
    )
    .join("");
}

export async function load_team_data(styles) {
  const data = await fetch_admins("ALL", { page: state.page, limit: state.limit });
  state.admins = data.members;
  state.totalItems = data.pagination.totalItems;
  render_rows(styles);
}

function bind_events(styles) {
  // 1. Add Administrator Event Trigger
  document.getElementById("addAdminBtn")?.addEventListener("click", async () => {
    if (is_submitting) return;

    const userId = window.prompt("Enter Target User ID to assign as Administrator:");
    if (!userId || !userId.trim()) return;

    const roleInput = window.prompt(
      "Enter role (e.g., ADMIN, MODERATOR, ANALYST, USER_SUPPORT):",
      "ADMIN"
    );
    if (!roleInput || !roleInput.trim()) return;

    try {
      is_submitting = true;
      await add_admin({ userId: userId.trim(), role: roleInput.trim() });
      window.alert("Administrator added successfully.");
      await load_team_data(styles);
    } catch (err) {
      console.error("Failed to add team member:", err);
      window.alert(err.message || "Failed to add administrator.");
    } finally {
      is_submitting = false;
    }
  });

  // 2. Edit Administrator Role Event Trigger
  document.getElementById("adminsTableBody")?.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-id]");
    if (!btn) return;

    const userId = btn.dataset.id;
    const currentRole = btn.dataset.role || "ADMIN";
    const userName = btn.dataset.name || "User";

    const newRole = window.prompt(
      `Update role for ${userName} (Current: ${currentRole}):\nOptions: ADMIN, MODERATOR, ANALYST, USER_SUPPORT, SUPER_ADMIN`,
      currentRole
    );

    if (!newRole || newRole.trim().toUpperCase() === currentRole) return;

    try {
      btn.disabled = true;
      await update_admin_role(userId, newRole.trim());
      window.alert(`Role updated successfully for ${userName}.`);
      await load_team_data(styles);
    } catch (err) {
      console.error("Failed to update role:", err);
      window.alert(err.message || "Failed to update role.");
    } finally {
      btn.disabled = false;
    }
  });
}

export async function init_team_roles_view(styles) {
  bind_events(styles);
  await load_team_data(styles);
}
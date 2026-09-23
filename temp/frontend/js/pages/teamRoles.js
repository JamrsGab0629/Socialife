import { icon } from "../components/icons.js";
import { showToast } from "../app.js";

// TODO(backend): source from GET /api/admin/team once the endpoint and
// permission model are finalized. Placeholder data only.
const PLACEHOLDER_ADMINS = [
  { name: "James Gabriel", email: "james.gabriel@socialife.app", role: "Super Admin", permissions: "Full access to all modules" },
  { name: "Renee Ocampo", email: "renee.ocampo@socialife.app", role: "Content Moderator", permissions: "Posts, Reports" },
  { name: "Miguel Torres", email: "miguel.torres@socialife.app", role: "User Support", permissions: "Users, Reports (view only)" },
  { name: "Sofia Ramirez", email: "sofia.ramirez@socialife.app", role: "Analyst", permissions: "Analytics (view only)" }
];

export async function initTeamRolesPage() {
  const body = document.getElementById("team-roles-body");
  body.innerHTML = PLACEHOLDER_ADMINS.map(
    (a) => `
    <tr>
      <td>
        <div class="data-table__user">
          <span class="avatar">${icon("user")}</span>
          <div class="data-table__user-name">${a.name}</div>
        </div>
      </td>
      <td class="data-table__muted">${a.email}</td>
      <td><span class="badge badge--info">${a.role}</span></td>
      <td class="data-table__muted">${a.permissions}</td>
      <td>
        <div class="data-table__actions">
          <button class="btn btn--sm btn--secondary" data-action="edit">Edit role</button>
        </div>
      </td>
    </tr>`
  ).join("");

  body.querySelectorAll('[data-action="edit"]').forEach((btn) => {
    btn.addEventListener("click", () => showToast("Role editing is ready to wire up once permissions are backed by the API."));
  });

  document.getElementById("add-admin-btn")?.addEventListener("click", () => {
    showToast("Add administrator — hook up to your invite flow.");
  });
}

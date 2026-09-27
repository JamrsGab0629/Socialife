// team-roles.js
import style from "./team_roles.module.css";
import style_btn from "../../../styles/admin/btn.module.css";
import style_badge from "../../../styles/admin/badge.module.css";
import { init_team_roles_view } from "./team_roles.helper";
import MainLayout from "../../../layouts/admin/main";
import Navigation from "../../../components/admin.dashboard/navigation/navigation";

export default function TeamRoles() {
  const { navigation, main } = MainLayout(this.root);
  Navigation(navigation, "team-roles");

  main.innerHTML = `
    <div class="${style["page-header"]}">
      <div>
        <h1>Team Roles</h1>
        <p>Manage administrators and their permissions</p>
      </div>
    </div>
    <div class="${style["card"]}">
      <div class="${style["card-header"]}">
        <h2>Administrators</h2>
        <button class="${style_btn["btn"]} ${style_btn["btn-primary"]}" id="addAdminBtn">+ Add administrator</button>
      </div>
      <table class="${style["table"]}">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Permissions</th><th></th></tr>
        </thead>
        <tbody id="adminsTableBody"></tbody>
      </table>
    </div>
  `;

  init_team_roles_view({ style, style_btn, style_badge });
}

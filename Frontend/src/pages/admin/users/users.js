import style from "./users.module.css";
import style_btn from "../../../styles/admin/btn.module.css";
import style_badge from "../../../styles/admin/badge.module.css";
import { init_users_view } from "./users.helper";
import MainLayout from "../../../layouts/admin/main";
import Navigation from "../../../components/admin.dashboard/navigation/navigation";

export default function Users() {
  const { navigation, main } = MainLayout(this.root);

  Navigation(navigation, "users");

  main.innerHTML = `
    <div class="${style["page-header"]}">
      <h1>Users</h1>
      <p>Search, review, and manage platform accounts</p>
    </div>
    <div class="${style["card"]}">
      <div class="${style["toolbar"]}">
        <input 
          type="search" 
          id="userSearch" 
          class="${style["search-input"]}" 
          placeholder="Search by username..." 
          autocomplete="off"
        />
        <select id="statusFilter" class="${style["filter-select"]}">
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
        </select>
      </div>
      <table class="${style["table"]}">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Joined</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="usersTableBody"></tbody>
      </table>
      <div class="${style["pagination"]}">
        <span id="usersCount"></span>
        <div id="usersPager" class="${style["pager"]}"></div>
      </div>
    </div>
  `;

  init_users_view({ style, style_btn, style_badge });
}
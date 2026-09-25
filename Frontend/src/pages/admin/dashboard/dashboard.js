// dashboard.js
import Navigation from "../../../components/admin.dashboard/navigation/navigation";
import style from "./dashboard.module.css";
import style_badge from "../../../styles/admin/badge.module.css";
import { init_dashboard_view } from "./dashboard.helper";
import Layout from "../../../layouts/admin/main";

export default function Dashboard() {
  const { navigation, main } = Layout(this.root);

  Navigation(navigation, "dashboard");

  main.innerHTML = `
    <div class="${style["page-header"]}">
      <h1>Dashboard</h1>
      <p>Overview of Socialife activity</p>
    </div>

    <div class="${style["stat-grid"]}">
      <div class="${style["stat-card"]}">
        <div class="${style["stat-icon"]} ${style["stat-icon-blue"]}">☺</div>
        <p class="${style["stat-label"]}">Total Users</p>
        <p class="${style["stat-value"]}" id="statTotalUsers">—</p>
      </div>
      <div class="${style["stat-card"]}">
        <div class="${style["stat-icon"]} ${style["stat-icon-green"]}">▤</div>
        <p class="${style["stat-label"]}">Total Posts</p>
        <p class="${style["stat-value"]}" id="statTotalPosts">—</p>
      </div>
      <div class="${style["stat-card"]}">
        <div class="${style["stat-icon"]} ${style["stat-icon-orange"]}">⚑</div>
        <p class="${style["stat-label"]}">Pending Reports</p>
        <p class="${style["stat-value"]}" id="statPendingReports">—</p>
      </div>
      <div class="${style["stat-card"]}">
        <div class="${style["stat-icon"]} ${style["stat-icon-red"]}">⛔</div>
        <p class="${style["stat-label"]}">Banned Users</p>
        <p class="${style["stat-value"]}" id="statBannedUsers">—</p>
      </div>
    </div>

    <div class="${style["card"]}">
      <h2>Recent Reports</h2>
      <div id="recentReports"></div>
    </div>
  `;

  init_dashboard_view({ style, style_badge });
}

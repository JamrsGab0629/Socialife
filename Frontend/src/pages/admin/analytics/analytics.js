// analytics.js
import style from "./analytics.module.css";
import { init_analytics_view } from "./analytics.helper";
import Navigation from "../../../components/admin.dashboard/navigation/navigation";
import MainLayout from "../../../layouts/admin/main";

export default function Analytics() {
  const { navigation, main } = MainLayout(this.root);
  Navigation(navigation, "analytics");
  
  main.innerHTML = `
    <div class="${style["page-header"]}">
      <h1>Analytics</h1>
      <p>Platform growth and engagement trends</p>
    </div>
    <div class="${style["grid"]}">
      <div class="${style["card"]}">
        <h2>User Growth</h2>
        <div id="userGrowthChart"></div>
      </div>
      <div class="${style["card"]}">
        <h2>Active Users</h2>
        <div id="activeUsersChart"></div>
      </div>
    </div>
  `;

  init_analytics_view();
}

// reports.js
import style from "./reports.module.css";
import style_btn from "../../../styles/admin/btn.module.css";
import style_badge from "../../../styles/admin/badge.module.css";
import { init_reports_view } from "./reports.helper";
import MainLayout from "../../../layouts/admin/main";
import Navigation from "../../../components/admin.dashboard/navigation/navigation";

export default function Reports() {
  const { navigation, main } = MainLayout(this.root);
  Navigation(navigation, "reports");
  main.innerHTML = `
    <div class="${style["page-header"]}">
      <h1>Reports</h1>
      <p>Review flagged users and content</p>
    </div>
    <div class="${style["card"]}">
      <div class="${style["toolbar"]}">
        <select id="reportStatusFilter" class="${style["filter-select"]}">
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>
      </div>
      <table class="${style["table"]}">
        <thead>
          <tr><th>Reporter</th><th>Reported</th><th>Reason</th><th>Status</th><th>Date</th><th></th></tr>
        </thead>
        <tbody id="reportsTableBody"></tbody>
      </table>
      <div class="${style["pagination"]}">
        <span id="reportsCount"></span>
      </div>
    </div>
  `;

  init_reports_view({ style, style_btn, style_badge });
}

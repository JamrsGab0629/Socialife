import { apiFetch } from "./apiFetch.js";
import {
  getUserGrowth,
  getDailyActiveUsers,
  getPeakUsageHours,
  getMonthlyActivity
} from "./adminDashboard.service.js";

export { getUserGrowth, getDailyActiveUsers, getPeakUsageHours, getMonthlyActivity };

export async function getPostActivity(range = "month") {
  try {
    return await apiFetch.get(`/api/admin/analytics/post-activity?range=${range}`);
  } catch {
    return {
      __placeholder: true,
      labels: ["May 1", "May 8", "May 15", "May 22", "May 29"],
      values: [1200, 1900, 2300, 2100, 2800]
    };
  }
}

export async function getReportTrends(range = "month") {
  try {
    return await apiFetch.get(`/api/admin/analytics/report-trends?range=${range}`);
  } catch {
    return {
      __placeholder: true,
      labels: ["May 1", "May 8", "May 15", "May 22", "May 29"],
      values: [88, 120, 96, 140, 112]
    };
  }
}

import {
  getUserGrowth,
  getDailyActiveUsers,
  getMonthlyActivity,
  getPeakUsageHours,
  getPostActivity,
  getReportTrends
} from "../api/analytics.service.js";
import { renderLineChart, renderBarChart } from "../components/charts.js";

const CHARTS = [
  { id: "an-user-growth", fetcher: getUserGrowth, renderer: renderLineChart },
  { id: "an-active-users", fetcher: getDailyActiveUsers, renderer: renderBarChart },
  { id: "an-monthly-activity", fetcher: getMonthlyActivity, renderer: renderBarChart },
  { id: "an-peak-hours", fetcher: getPeakUsageHours, renderer: renderLineChart },
  { id: "an-post-activity", fetcher: getPostActivity, renderer: renderLineChart },
  { id: "an-report-trends", fetcher: getReportTrends, renderer: renderBarChart }
];

export async function initAnalyticsPage() {
  await Promise.all(
    CHARTS.map(async ({ id, fetcher, renderer }) => {
      const svg = document.getElementById(id);
      if (!svg) return;
      const data = await fetcher();
      renderer(svg, data);
    })
  );
}

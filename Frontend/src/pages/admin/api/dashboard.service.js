import { dashboard } from "../../../helpers/admin/dashboard.request";
import { getRecentReports } from "../../../helpers/admin/reports.admin.request";

/**
 * Transforms report data to normalized handles and lowercase status values
 */
function transformReport(r) {
    const reporterObj = r.author || {};
    const reporterHandle = reporterObj.username
        ? `@${reporterObj.username}`
        : r.reporter_id
            ? `@user_${r.reporter_id}`
            : "@unknown";

    const targetObj = r.reported_user || {};
    const targetHandle = targetObj.username
        ? `@${targetObj.username}`
        : r.user_id
            ? `@user_${r.user_id}`
            : "@unknown";

    const date = r.created_at
        ? new Date(r.created_at).toLocaleDateString()
        : "N/A";
    const status = r.status ? r.status.toLowerCase() : "pending";

    return {
        id: r.report_id || r.id,
        reporter: reporterHandle,
        target: targetHandle,
        reason: r.reason || "No reason provided",
        status,
        date,
    };
}

/**
 * Main service method to initialize dashboard data safely.
 * Returns -1 for failed stats and empty array for failed reports.
 */
export async function getDashboardData() {
    const [statsResponse, reportsResponse] = await Promise.all([
        dashboard().catch(() => null),
        getRecentReports({ page: 1, limit: 4 }).catch(() => null),
    ]);

    // Extract stats payload safely
    const statsData = statsResponse?.result || statsResponse?.data || statsResponse || {};

    const stats = {
        totalUsers: statsData.totalUsers ?? -1,
        totalPosts: statsData.totalPosts ?? -1,
        totalPendingReports: statsData.totalPendingReports ?? -1,
        totalBannedUsers: statsData.totalBannedUsers ?? -1,
    };

    // Extract reports payload safely
    const reportsPayload = reportsResponse?.result || reportsResponse?.data || reportsResponse;
    const rawReports = reportsPayload?.reports
        ? reportsPayload.reports
        : Array.isArray(reportsPayload)
            ? reportsPayload
            : [];

    const reports = rawReports.slice(0, 4).map(transformReport);

    return {
        stats,
        reports,
    };
}
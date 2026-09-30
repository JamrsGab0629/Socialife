import * as reportAPIHelper from "../../../helpers/admin/reports.admin.request";

function transformReport(r) {
  const reporterObj = r.author || r.reporter || {};
  const reporterHandle = reporterObj.username ? `@${reporterObj.username}` : (r.author_id ? `@user_${r.author_id}` : "@unknown");

  const targetObj = r.reported_user || r.target || {};
  const targetHandle = targetObj.username ? `@${targetObj.username}` : (r.user_id ? `@user_${r.user_id}` : "@unknown");

  const date = r.created_at ? new Date(r.created_at).toLocaleDateString() : "N/A";
  const status = r.status ? r.status.toLowerCase() : "pending";
  const targetType = r.post_id ? "post" : "user";

  return {
    id: r.report_id || r.id,
    reporter: reporterHandle,
    target_type: targetType,
    target: targetHandle,
    reason: r.message || r.reason || "No reason provided",
    status,
    date
  };
}

export async function fetch_reports({ page = 1, limit = 10, status = "all" } = {}) {
  let apiStatus = "ALL";
  if (status !== "all") {
    apiStatus = status.toUpperCase();
  }

  const response = await reportAPIHelper.getReports(apiStatus, { page, limit });
  // Backend shape: { success, data: { data: [...reports], pagination: {...} } }
  const payload = response?.data || response;
  const rawReports = Array.isArray(payload?.data)
    ? payload.data
    : (Array.isArray(payload) ? payload : []);

  const pagination = payload?.pagination || {
    totalItems: rawReports.length,
    totalPages: 1,
    currentPage: page,
    limit
  };

  return {
    reports: rawReports.map(transformReport),
    pagination
  };
}

export async function set_report_status(reportId, nextStatus) {
  const formattedStatus = nextStatus.toUpperCase();
  return await reportAPIHelper.updateReport(reportId, { status: formattedStatus });
}
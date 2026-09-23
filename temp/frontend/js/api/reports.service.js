import { apiFetch } from "./apiFetch.js";

export async function getReports({ page = 1, pageSize = 8, status = "all" } = {}) {
  const params = new URLSearchParams({ page, pageSize, status });
  try {
    return await apiFetch.get(`/api/admin/reports?${params.toString()}`);
  } catch {
    const all = PLACEHOLDER_REPORTS.filter(
      (r) => status === "all" || r.status === status
    );
    const start = (page - 1) * pageSize;
    return {
      __placeholder: true,
      items: all.slice(start, start + pageSize),
      total: all.length,
      page,
      pageSize
    };
  }
}

export async function reviewReport(reportId) {
  return apiFetch.patch(`/api/admin/reports/${reportId}`, { status: "reviewed" });
}

export async function resolveReport(reportId) {
  return apiFetch.patch(`/api/admin/reports/${reportId}`, { status: "resolved" });
}

export async function dismissReport(reportId) {
  return apiFetch.patch(`/api/admin/reports/${reportId}`, { status: "dismissed" });
}

export const PLACEHOLDER_REPORTS = [
  { id: "r1", reporter: "@carlov", target: "@user123", targetType: "post", reason: "Inappropriate content", date: "May 29, 2025", status: "pending" },
  { id: "r2", reporter: "@nicolecruz", target: "@spam_account", targetType: "user", reason: "Spam and misleading information", date: "May 29, 2025", status: "pending" },
  { id: "r3", reporter: "@kevinr", target: "@another.user", targetType: "post", reason: "Harassment", date: "May 28, 2025", status: "reviewed" },
  { id: "r4", reporter: "@beaf", target: "@fake_profile", targetType: "user", reason: "Fake account", date: "May 28, 2025", status: "resolved" },
  { id: "r5", reporter: "@dianelopez", target: "@markreyes", targetType: "post", reason: "Misinformation", date: "May 27, 2025", status: "pending" },
  { id: "r6", reporter: "@paologutierrez", target: "@troll_acc", targetType: "user", reason: "Abusive behavior", date: "May 26, 2025", status: "dismissed" },
  { id: "r7", reporter: "@alexarivera", target: "@johndelacruz", targetType: "post", reason: "Copyright concern", date: "May 25, 2025", status: "reviewed" }
];

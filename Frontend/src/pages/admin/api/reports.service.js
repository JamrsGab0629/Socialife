// reports.service.js — mocked network layer for the Reports view.
const MOCK_REPORTS = [
  { id: 1, reporter: "@carlov", target_type: "post", target: "@user123", reason: "Inappropriate content", status: "pending", date: "May 29, 2025" },
  { id: 2, reporter: "@nicolecruz", target_type: "user", target: "@spam_account", reason: "Spam and misleading information", status: "pending", date: "May 29, 2025" },
  { id: 3, reporter: "@kevinr", target_type: "post", target: "@another.user", reason: "Harassment", status: "reviewed", date: "May 28, 2025" },
  { id: 4, reporter: "@beaf", target_type: "user", target: "@fake_profile", reason: "Fake account", status: "resolved", date: "May 28, 2025" },
  { id: 5, reporter: "@dianelopez", target_type: "post", target: "@markreyes", reason: "Misinformation", status: "pending", date: "May 27, 2025" },
  { id: 6, reporter: "@paologutierrez", target_type: "user", target: "@troll_acc", reason: "Abusive behavior", status: "dismissed", date: "May 26, 2025" },
  { id: 7, reporter: "@alexarivera", target_type: "post", target: "@johndelacruz", reason: "Copyright concern", status: "reviewed", date: "May 25, 2025" },
];

export function fetch_reports() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(MOCK_REPORTS)), 400);
  });
}

export function set_report_status(id, status) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const report = MOCK_REPORTS.find((r) => r.id === id);
      if (!report) return reject(new Error("Report not found"));
      report.status = status;
      resolve(structuredClone(report));
    }, 300);
  });
}

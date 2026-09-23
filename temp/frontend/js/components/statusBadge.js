const STATUS_MAP = {
  active: { label: "Active", tone: "success" },
  banned: { label: "Banned", tone: "danger" },
  pending: { label: "Pending", tone: "warning" },
  reviewed: { label: "Reviewed", tone: "info" },
  resolved: { label: "Resolved", tone: "success" },
  dismissed: { label: "Dismissed", tone: "neutral" },
  removed: { label: "Removed", tone: "danger" }
};

export function statusBadge(statusKey) {
  const status = STATUS_MAP[statusKey] || { label: statusKey, tone: "neutral" };
  return `<span class="badge badge--${status.tone}">${status.label}</span>`;
}

import { apiFetch } from "./apiFetch.js";

// TODO(backend): wire to real endpoints once available.
// Every function currently resolves with PLACEHOLDER data clearly
// marked below, so the UI never ships hardcoded numbers silently.

export async function getDashboardMetrics() {
  try {
    return await apiFetch.get("/api/admin/dashboard/metrics");
  } catch {
    return {
      __placeholder: true,
      totalUsers: 12458,
      totalPosts: 34682,
      totalReels: 8743,
      activeUsers: 4291,
      bannedUsers: 231,
      totalReports: 562,
      deltas: {
        totalUsers: 12.5,
        totalPosts: 8.7,
        totalReels: 15.3,
        activeUsers: 10.1,
        bannedUsers: 3.2,
        totalReports: -5.4
      }
    };
  }
}

export async function getUserGrowth(range = "month") {
  try {
    return await apiFetch.get(`/api/admin/dashboard/user-growth?range=${range}`);
  } catch {
    return {
      __placeholder: true,
      labels: ["May 1", "May 8", "May 15", "May 22", "May 29"],
      values: [3200, 5400, 7100, 9600, 12458]
    };
  }
}

export async function getDailyActiveUsers(range = "week") {
  try {
    return await apiFetch.get(`/api/admin/dashboard/daily-active-users?range=${range}`);
  } catch {
    return {
      __placeholder: true,
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      values: [3100, 4600, 4900, 4200, 3800, 2600, 2100]
    };
  }
}

export async function getPeakUsageHours(range = "today") {
  try {
    return await apiFetch.get(`/api/admin/dashboard/peak-hours?range=${range}`);
  } catch {
    return {
      __placeholder: true,
      labels: ["0", "4", "8", "12", "16", "20", "24"],
      values: [400, 300, 1800, 4600, 3200, 1600, 500]
    };
  }
}

export async function getMonthlyActivity(range = "year") {
  try {
    return await apiFetch.get(`/api/admin/dashboard/monthly-activity?range=${range}`);
  } catch {
    return {
      __placeholder: true,
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      values: [14000, 19000, 21000, 30000, 33000, 37000]
    };
  }
}

export async function getRecentReports(limit = 4) {
  try {
    return await apiFetch.get(`/api/admin/reports/recent?limit=${limit}`);
  } catch {
    return {
      __placeholder: true,
      items: [
        { id: "r1", type: "post", target: "@user123", reason: "Inappropriate content", timeAgo: "2 minutes ago", status: "pending" },
        { id: "r2", type: "user", target: "@spam_account", reason: "Spam and misleading information", timeAgo: "15 minutes ago", status: "pending" },
        { id: "r3", type: "post", target: "@another.user", reason: "Harassment", timeAgo: "1 hour ago", status: "reviewed" },
        { id: "r4", type: "user", target: "@fake_profile", reason: "Fake account", timeAgo: "3 hours ago", status: "resolved" }
      ]
    };
  }
}

export async function getRecentUsers(limit = 4) {
  try {
    return await apiFetch.get(`/api/admin/users/recent?limit=${limit}`);
  } catch {
    return {
      __placeholder: true,
      items: [
        { id: "u1", name: "Maria Santos", handle: "@mariasantos", email: "maria.santos@gmail.com", joined: "May 29, 2025", status: "active" },
        { id: "u2", name: "John Dela Cruz", handle: "@johndelacruz", email: "john.d@gmail.com", joined: "May 29, 2025", status: "active" },
        { id: "u3", name: "Alexa Rivera", handle: "@alexarivera", email: "alexa.rivera@gmail.com", joined: "May 29, 2025", status: "active" },
        { id: "u4", name: "Mark Reyes", handle: "@markreyes", email: "mark.reyes@gmail.com", joined: "May 28, 2025", status: "banned" }
      ]
    };
  }
}

import { apiFetch } from "./apiFetch.js";

// TODO(backend): replace placeholder fallback with real pagination once
// GET /api/admin/users is available.
export async function getUsers({ page = 1, pageSize = 8, search = "", status = "all" } = {}) {
  const params = new URLSearchParams({ page, pageSize, search, status });
  try {
    return await apiFetch.get(`/api/admin/users?${params.toString()}`);
  } catch {
    const all = PLACEHOLDER_USERS.filter((u) => {
      const matchesSearch =
        !search ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "all" || u.status === status;
      return matchesSearch && matchesStatus;
    });
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

// Ban/unban only — the frontend never permanently deletes a user.
export async function banUser(userId) {
  return apiFetch.patch(`/api/admin/users/${userId}/ban`, {});
}

export async function unbanUser(userId) {
  return apiFetch.patch(`/api/admin/users/${userId}/unban`, {});
}

export const PLACEHOLDER_USERS = [
  { id: "u1", name: "Maria Santos", handle: "@mariasantos", email: "maria.santos@gmail.com", joined: "May 29, 2025", status: "active" },
  { id: "u2", name: "John Dela Cruz", handle: "@johndelacruz", email: "john.d@gmail.com", joined: "May 29, 2025", status: "active" },
  { id: "u3", name: "Alexa Rivera", handle: "@alexarivera", email: "alexa.rivera@gmail.com", joined: "May 29, 2025", status: "active" },
  { id: "u4", name: "Mark Reyes", handle: "@markreyes", email: "mark.reyes@gmail.com", joined: "May 28, 2025", status: "banned" },
  { id: "u5", name: "Diane Lopez", handle: "@dianelopez", email: "diane.lopez@gmail.com", joined: "May 27, 2025", status: "active" },
  { id: "u6", name: "Carlo Villanueva", handle: "@carlov", email: "carlo.v@gmail.com", joined: "May 26, 2025", status: "active" },
  { id: "u7", name: "Bea Fernandez", handle: "@beaf", email: "bea.fernandez@gmail.com", joined: "May 25, 2025", status: "banned" },
  { id: "u8", name: "Kevin Ramos", handle: "@kevinr", email: "kevin.ramos@gmail.com", joined: "May 24, 2025", status: "active" },
  { id: "u9", name: "Nicole Cruz", handle: "@nicolecruz", email: "nicole.cruz@gmail.com", joined: "May 23, 2025", status: "active" },
  { id: "u10", name: "Paolo Gutierrez", handle: "@paologutierrez", email: "paolo.g@gmail.com", joined: "May 22, 2025", status: "active" }
];

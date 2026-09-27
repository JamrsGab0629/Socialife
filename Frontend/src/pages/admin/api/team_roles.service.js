import { getTeam, addMember, updateTeam } from "../../../helpers/admin/team.admin.request";

const ROLE_PERMISSIONS = {
  SUPER_ADMIN: "Full access to all modules",
  ADMIN: "Posts, Users, Reports, Team Management",
  MODERATOR: "Posts, Reports",
  ANALYST: "Analytics (view only)",
  USER_SUPPORT: "Users, Reports (view only)"
};

function formatRoleLabel(role = "") {
  return role
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function transformMember(m) {
  const user = m.user || m.User || m;
  const username = user.username || "Unknown Admin";
  const email = user.email || `${username.toLowerCase().replace(/\s+/g, ".")}@socialife.app`;
  const roleCode = (m.role || user.role || "ADMIN").toUpperCase();

  return {
    id: user.user_id || m.userId || m.id,
    name: username,
    email: email,
    role: formatRoleLabel(roleCode),
    rawRole: roleCode,
    permissions: ROLE_PERMISSIONS[roleCode] || "Standard system access",
    avatar: user.profile_url || null
  };
}

export async function fetch_admins(status = "ALL", { page = 1, limit = 20 } = {}) {
  try {
    const response = await getTeam(status, { page, limit });
    const payload = response?.result || response?.data || response;
    const rawList = Array.isArray(payload) ? payload : (payload?.team || payload?.members || []);

    return {
      members: rawList.map(transformMember),
      pagination: payload?.pagination || {
        totalItems: rawList.length,
        totalPages: 1,
        currentPage: page,
        limit
      }
    };
  } catch (error) {
    console.error("Error fetching team members:", error);
    return { members: [], pagination: { totalItems: 0, totalPages: 1, currentPage: 1, limit } };
  }
}

export async function add_admin({ userId, role }) {
  const response = await addMember({ userId, role: role.toUpperCase() });
  return response?.result || response?.data || response;
}

export async function update_admin_role(userId, role) {
  const response = await updateTeam(userId, { role: role.toUpperCase() });
  return response?.result || response?.data || response;
}
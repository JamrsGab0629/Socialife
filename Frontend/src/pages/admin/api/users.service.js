import * as userAPIHelper from "../../../helpers/admin/user.admin.request";

function transformUser(u) {
  const name = [u.first_name, u.last_name].filter(Boolean).join(" ") || u.username;
  const joined = u.created_at ? new Date(u.created_at).toLocaleDateString() : "N/A";
  
  // Determine status based on API flags
  const status = u.is_actived ? "active" : "banned";

  return {
    id: u.user_id,
    name,
    handle: `@${u.username}`,
    username: u.username,
    email: u.email,
    joined,
    status,
    avatar: u.profile_url
  };
}

export async function fetch_users({ page = 1, limit = 10, status = "all", search = "" } = {}) {
  let apiStatus = "ALL";
  if (status === "active") apiStatus = "ACTIVE";
  if (status === "banned") apiStatus = "BANNED";

  let response;

  // If a search query is provided, use findUserByUsername endpoint
  if (search.trim()) {
    response = await userAPIHelper.findUserByUsername(search.trim());
  } else {
    // Call getUsers(status, { page, limit }) matching your function parameters
    response = await userAPIHelper.getUsers(apiStatus, { page, limit });
  }

  const rawUsers = response?.result?.users 
    ? response.result.users 
    : (response?.result ? [response.result] : []);

  const pagination = response?.result?.pagination || {
    totalItems: rawUsers.length,
    totalPages: 1,
    currentPage: page,
    limit
  };

  return {
    users: rawUsers.map(transformUser),
    pagination
  };
}

export async function view_user_details(userId) {
  return await userAPIHelper.viewUser(userId);
}

export async function set_user_status(userId) {
  return await userAPIHelper.toggleStatus(userId);
}
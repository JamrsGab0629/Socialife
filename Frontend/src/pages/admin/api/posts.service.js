import * as postAPIHelper from "../../../helpers/admin/post.admin.request";

function transformPost(p) {
  // Read author details from Sequelize association output (`include: [{ model: User, as: "author" }]`)
  const authorObj = p.author || {};
  const authorName = authorObj.username || "Unknown User";
  const handle = authorObj.username ? `@${authorObj.username}` : "@unknown";
  const created = p.created_at ? new Date(p.created_at).toLocaleDateString() : "N/A";

  // Match Sequelize boolean field `is_active`
  const status = p.is_active ? "active" : "removed";

  return {
    id: p.post_id,
    author: authorName,
    handle,
    content: p.content || p.caption || "No content",
    created,
    status,
    avatar: authorObj.profile_url || null
  };
}

export async function fetch_posts({ page = 1, limit = 10, status = "all", search = "" } = {}) {
  let apiStatus = "ALL";
  if (status === "active") apiStatus = "ACTIVE";
  if (status === "removed") apiStatus = "REMOVED";

  let response;
  const trimmedSearch = search.trim();

  // If search query is provided, query by username endpoint
  if (trimmedSearch.length > 0) {
    const cleanUsername = trimmedSearch.replace(/^@/, "");
    response = await postAPIHelper.getPostsFrom(cleanUsername, { page, limit });
  } else {
    response = await postAPIHelper.getPosts(apiStatus, { page, limit });
  }

  // Handle standard JSON response wrapper or raw Sequelize output
  const payload = response?.result || response?.data || response;
  const rawPosts = payload?.posts ? payload.posts : (Array.isArray(payload) ? payload : []);

  const pagination = payload?.pagination || {
    totalItems: rawPosts.length,
    totalPages: 1,
    currentPage: page,
    limit
  };

  return {
    posts: rawPosts.map(transformPost),
    pagination
  };
}

export async function view_post_details(postId) {
  return await postAPIHelper.viewPost(postId);
}

export async function set_post_status(postId) {
  // Calls toggle status endpoint (`removePost` on backend toggles `is_active`)
  return await postAPIHelper.removePost(postId);
}
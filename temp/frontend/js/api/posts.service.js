import { apiFetch } from "./apiFetch.js";

export async function getPosts({ page = 1, pageSize = 8, search = "", filter = "all" } = {}) {
  const params = new URLSearchParams({ page, pageSize, search, filter });
  try {
    return await apiFetch.get(`/api/admin/posts?${params.toString()}`);
  } catch {
    const all = PLACEHOLDER_POSTS.filter((p) => {
      const matchesSearch =
        !search ||
        p.author.toLowerCase().includes(search.toLowerCase()) ||
        p.content.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "active" && p.is_active) ||
        (filter === "removed" && !p.is_active);
      return matchesSearch && matchesFilter;
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

// Uses the existing is_active field, per current backend convention.
export async function removePost(postId) {
  return apiFetch.patch(`/api/admin/posts/${postId}`, { is_active: false });
}

export async function restorePost(postId) {
  return apiFetch.patch(`/api/admin/posts/${postId}`, { is_active: true });
}

export const PLACEHOLDER_POSTS = [
  { id: "p1", author: "Maria Santos", handle: "@mariasantos", content: "Sunset views from the rooftop tonight, can't get over this city skyline...", created: "May 29, 2025", is_active: true },
  { id: "p2", author: "John Dela Cruz", handle: "@johndelacruz", content: "New personal record at the gym this morning. Consistency really pays off.", created: "May 28, 2025", is_active: true },
  { id: "p3", author: "spam_account", handle: "@spam_account", content: "CLICK HERE for free followers instantly, limited time offer!!!", created: "May 28, 2025", is_active: false },
  { id: "p4", author: "Alexa Rivera", handle: "@alexarivera", content: "Finally finished the mural downtown, three weeks of work paid off.", created: "May 27, 2025", is_active: true },
  { id: "p5", author: "Mark Reyes", handle: "@markreyes", content: "Unpopular opinion but I think this new update broke more than it fixed.", created: "May 26, 2025", is_active: true },
  { id: "p6", author: "Diane Lopez", handle: "@dianelopez", content: "Weekend hike turned into an impromptu picnic. Ten out of ten.", created: "May 25, 2025", is_active: true },
  { id: "p7", author: "fake_profile", handle: "@fake_profile", content: "Reposted content flagged by multiple users for misleading claims.", created: "May 24, 2025", is_active: false },
  { id: "p8", author: "Carlo Villanueva", handle: "@carlov", content: "Coffee shop recommendations for a quiet Sunday, drop them below.", created: "May 23, 2025", is_active: true }
];

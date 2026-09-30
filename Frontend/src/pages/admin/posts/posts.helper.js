
import { fetch_posts, set_post_status, view_post_details } from "../api/posts.service";
import { openPostViewer } from "../../../components/post-viewer/post-viewer";


const PAGE_SIZE = 10;

const state = {
  posts: [],
  total_items: 0,
  total_pages: 1,
  search: "",
  status_filter: "all",
  page: 1,
  loading: false
};

function status_badge(style_badge, status) {
  const map = {
    active: [style_badge["badge-green"], "Active"],
    removed: [style_badge["badge-red"], "Removed"],
  };
  const [cls, label] = map[status] || [style_badge["badge-gray"], status];
  return `<span class="${style_badge["badge"]} ${cls}">${label}</span>`;
}

function render_rows(styles) {
  const { style, style_btn, style_badge } = styles;
  const body = document.getElementById("postsTableBody");

  if (state.loading) {
    body.innerHTML = `<tr><td colspan="5" class="${style["empty"]}">Loading posts...</td></tr>`;
    return;
  }

  if (state.posts.length === 0) {
    body.innerHTML = `<tr><td colspan="5" class="${style["empty"]}">No posts found.</td></tr>`;
  } else {
    body.innerHTML = state.posts
      .map(
        (p) => `
        <tr>
          <td>
            <div class="${style["author-cell"]}">
              <div class="${style["avatar"]}">
                ${
                  p.avatar
                    ? `<img src="${p.avatar}" alt="${p.author}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" />`
                    : `<span>${p.author.charAt(0).toUpperCase()}</span>`
                }
              </div>
              <div>
                <p class="${style["name"]}">${p.author}</p>
                <p class="${style["handle"]}">${p.handle}</p>
              </div>
            </div>
          </td>
          <td class="${style["content-cell"]}" title="${p.content}">${p.content}</td>
          <td>${p.created}</td>
          <td>${status_badge(style_badge, p.status)}</td>
          <td>
            <div class="${style["actions"]}">
              <button class="${style_btn["btn"]} ${style_btn["btn-outline"]}" data-action="view" data-id="${p.id}">View</button>
              ${
                p.status === "removed"
                  ? `<button class="${style_btn["btn"]} ${style_btn["btn-success"]}" data-action="restore" data-id="${p.id}">Restore</button>`
                  : `<button class="${style_btn["btn"]} ${style_btn["btn-danger"]}" data-action="remove" data-id="${p.id}">Remove</button>`
              }
            </div>
          </td>
        </tr>`
      )
      .join("");
  }

  const start = state.total_items === 0 ? 0 : (state.page - 1) * PAGE_SIZE + 1;
  const end = Math.min(state.page * PAGE_SIZE, state.total_items);

  document.getElementById("postsCount").textContent = `Showing ${start}-${end} of ${state.total_items}`;

  const pager = document.getElementById("postsPager");
  if (pager) {
    pager.innerHTML = Array.from({ length: state.total_pages }, (_, i) => i + 1)
      .map(
        (n) =>
          `<button class="${style["page-btn"]} ${n === state.page ? style["is-current"] : ""}" data-page="${n}">${n}</button>`
      )
      .join("");
  }
}

async function load_data(styles) {
  state.loading = true;
  render_rows(styles);

  try {
    const data = await fetch_posts({
      page: state.page,
      limit: PAGE_SIZE,
      status: state.status_filter,
      search: state.search
    });

    state.posts = data.posts;
    state.total_items = data.pagination.totalItems;
    state.total_pages = data.pagination.totalPages;
  } catch (err) {
    console.error("Failed to load posts:", err);
    state.posts = [];
    state.total_items = 0;
    state.total_pages = 1;
  } finally {
    state.loading = false;
    render_rows(styles);
  }
}

function bind_events(styles) {
  let debounceTimer = null;

  document.getElementById("postSearch").addEventListener("input", (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      state.search = e.target.value;
      state.page = 1;
      load_data(styles);
    }, 400);
  });

  document.getElementById("postStatusFilter").addEventListener("change", (e) => {
    state.status_filter = e.target.value;
    state.page = 1;
    load_data(styles);
  });

  const pager = document.getElementById("postsPager");
  if (pager) {
    pager.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-page]");
      if (!btn) return;
      const selectedPage = Number(btn.dataset.page);
      if (selectedPage !== state.page) {
        state.page = selectedPage;
        load_data(styles);
      }
    });
  }

  document.getElementById("postsTableBody").addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const id = btn.dataset.id; // UUID String
    const { action } = btn.dataset;
    if (action === "view") {
      try {
       const raw = await view_post_details(id);
        console.log("RAW POST DATA:", raw); // ADD THIS TEMPORARILY
        const post = raw?.result || raw?.data || raw;
        console.log("UNWRAPPED POST:", post); // ADD THIS TEMPORARILY

        openPostViewer({
          post_id: post.post_id || post.id || id,
          user_name: post.author?.username || post.username,
          avatar_url: post.author?.profile_url || post.avatar,
          caption: post.caption,
          content: post.content,
          photo: post.photo,
          photo_url: post.photo_url,
          like_count: post.like_count,
          comment_count: post.comment_count,
          created_at: post.created_at,
        });
      } catch (err) {
        console.error("Failed to view post details:", err);
      }
      return;
    }
    if (action === "remove" || action === "restore") {
      btn.disabled = true;
      try {
        await set_post_status(id); // Calls backend removePost (toggles is_active)
        await load_data(styles);
      } catch (err) {
        console.error("Failed to update post status:", err);
        btn.disabled = false;
      }
    }
  });
}

export async function init_posts_view(styles) {
  bind_events(styles);
  await load_data(styles);
}
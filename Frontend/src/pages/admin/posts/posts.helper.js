// posts.helper.js
// Fetching, filtering and remove/restore actions for the Posts view.
import { fetch_posts, set_post_status } from "../api/posts.service";

const state = {
  all_posts: [],
  search: "",
  status_filter: "all",
};

function get_filtered_posts() {
  return state.all_posts.filter((p) => {
    const matches_search =
      !state.search ||
      p.author.toLowerCase().includes(state.search) ||
      p.content.toLowerCase().includes(state.search);
    const matches_status = state.status_filter === "all" || p.status === state.status_filter;
    return matches_search && matches_status;
  });
}

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
  const filtered = get_filtered_posts();
  const body = document.getElementById("postsTableBody");

  if (filtered.length === 0) {
    body.innerHTML = `<tr><td colspan="4" class="${style["empty"]}">No posts match your filters.</td></tr>`;
  } else {
    body.innerHTML = filtered
      .map(
        (p) => `
        <tr>
          <td>
            <div class="${style["author-cell"]}">
              <div class="${style["avatar"]}"></div>
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

  document.getElementById("postsCount").textContent = `Showing 1-${filtered.length} of ${filtered.length}`;
}

function bind_events(styles) {
  document.getElementById("postSearch").addEventListener("input", (e) => {
    state.search = e.target.value.trim().toLowerCase();
    render_rows(styles);
  });

  document.getElementById("postStatusFilter").addEventListener("change", (e) => {
    state.status_filter = e.target.value;
    render_rows(styles);
  });

  document.getElementById("postsTableBody").addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const { action } = btn.dataset;

    if (action === "view") {
      window.alert(`Viewing post #${id} (mocked).`);
      return;
    }

    btn.disabled = true;
    const next_status = action === "remove" ? "removed" : "active";
    await set_post_status(id, next_status);
    const post = state.all_posts.find((p) => p.id === id);
    if (post) post.status = next_status;
    render_rows(styles);
  });
}

export async function init_posts_view(styles) {
  state.all_posts = await fetch_posts();
  render_rows(styles);
  bind_events(styles);
}

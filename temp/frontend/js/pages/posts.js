import { getPosts, removePost, restorePost } from "../api/posts.service.js";
import { renderStatePanel, renderPagination } from "../components/table.js";
import { confirmModal } from "../components/modal.js";
import { icon } from "../components/icons.js";
import { showToast } from "../app.js";

const state = { page: 1, pageSize: 8, search: "", filter: "all" };
let searchDebounce;

export async function initPostsPage() {
  document.getElementById("posts-search").addEventListener("input", (e) => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      state.search = e.target.value;
      state.page = 1;
      loadPosts();
    }, 250);
  });

  document.getElementById("posts-filter").addEventListener("change", (e) => {
    state.filter = e.target.value;
    state.page = 1;
    loadPosts();
  });

  await loadPosts();
}

async function loadPosts() {
  const body = document.getElementById("posts-table-body");
  const wrap = document.getElementById("posts-table-wrap");
  const paginationSlot = document.getElementById("posts-pagination");
  const table = document.getElementById("posts-table");

  table.style.display = "none";
  wrap.querySelector(".state-panel")?.remove();
  wrap.insertAdjacentHTML("beforeend", renderStatePanel({ type: "loading", title: "Loading posts..." }));

  try {
    const res = await getPosts(state);
    wrap.querySelector(".state-panel")?.remove();

    if (!res.items.length) {
      table.style.display = "none";
      wrap.insertAdjacentHTML(
        "beforeend",
        renderStatePanel({ type: "empty", title: "No posts found", desc: "Try a different search term or filter." })
      );
      paginationSlot.innerHTML = "";
      return;
    }

    table.style.display = "";
    body.innerHTML = res.items.map(postRow).join("");
    attachRowActions(body);

    paginationSlot.innerHTML = "";
    paginationSlot.appendChild(
      renderPagination({
        page: res.page,
        pageSize: res.pageSize,
        total: res.total,
        onPageChange: (p) => {
          state.page = p;
          loadPosts();
        }
      })
    );
  } catch (err) {
    table.style.display = "none";
    wrap.querySelector(".state-panel")?.remove();
    wrap.insertAdjacentHTML(
      "beforeend",
      renderStatePanel({ type: "error", title: "Couldn't load posts", desc: err.message })
    );
    paginationSlot.innerHTML = "";
  }
}

function postRow(p) {
  return `
    <tr data-id="${p.id}">
      <td>
        <div class="data-table__user">
          <span class="avatar">${icon("user")}</span>
          <div>
            <div class="data-table__user-name">${p.author}</div>
            <div class="data-table__user-handle">${p.handle}</div>
          </div>
        </div>
      </td>
      <td class="data-table__content-preview">${p.content}</td>
      <td class="data-table__muted">${p.created}</td>
      <td>${p.is_active ? '<span class="badge badge--success">Active</span>' : '<span class="badge badge--danger">Removed</span>'}</td>
      <td>
        <div class="data-table__actions">
          <button class="btn btn--sm btn--secondary" data-action="view">${icon("eye")} View</button>
          ${
            p.is_active
              ? `<button class="btn btn--sm btn--danger" data-action="remove">${icon("trash")} Remove</button>`
              : `<button class="btn btn--sm btn--success" data-action="restore">${icon("restore")} Restore</button>`
          }
        </div>
      </td>
    </tr>`;
}

function attachRowActions(body) {
  body.querySelectorAll("button[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.closest("tr");
      const id = row.dataset.id;
      const author = row.querySelector(".data-table__user-name").textContent;
      const action = btn.dataset.action;

      if (action === "view") {
        showToast(`Viewing ${author}'s post — hook up to a post detail view.`);
        return;
      }

      if (action === "remove") {
        confirmModal({
          title: "Remove this post?",
          body: "The post will be hidden from Socialife. You can restore it any time.",
          confirmLabel: "Remove post",
          tone: "danger",
          onConfirm: async () => {
            try {
              await removePost(id);
            } catch {
              /* falls back silently until backend is connected */
            }
            showToast("Post removed.");
            loadPosts();
          }
        });
      }

      if (action === "restore") {
        confirmModal({
          title: "Restore this post?",
          body: "The post will become visible on Socialife again.",
          confirmLabel: "Restore post",
          tone: "success",
          onConfirm: async () => {
            try {
              await restorePost(id);
            } catch {
              /* falls back silently until backend is connected */
            }
            showToast("Post restored.");
            loadPosts();
          }
        });
      }
    });
  });
}

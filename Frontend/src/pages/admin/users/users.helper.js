// users.helper.js
// Fetching, filtering, pagination and ban/unban actions for the Users view.
import { fetch_users, set_user_status } from "../api/users.service";

const PAGE_SIZE = 8;

const state = {
  all_users: [],
  search: "",
  status_filter: "all",
  page: 1,
};

function get_filtered_users() {
  return state.all_users.filter((u) => {
    const matches_search =
      !state.search ||
      u.name.toLowerCase().includes(state.search) ||
      u.email.toLowerCase().includes(state.search);
    const matches_status = state.status_filter === "all" || u.status === state.status_filter;
    return matches_search && matches_status;
  });
}

function status_badge(style_badge, status) {
  const map = {
    active: [style_badge["badge-green"], "Active"],
    banned: [style_badge["badge-red"], "Banned"],
  };
  const [cls, label] = map[status] || [style_badge["badge-gray"], status];
  return `<span class="${style_badge["badge"]} ${cls}">${label}</span>`;
}

function render_rows(styles) {
  const { style, style_btn, style_badge } = styles;
  const filtered = get_filtered_users();
  const total_pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  state.page = Math.min(state.page, total_pages);
  const start = (state.page - 1) * PAGE_SIZE;
  const page_items = filtered.slice(start, start + PAGE_SIZE);

  const body = document.getElementById("usersTableBody");
  if (page_items.length === 0) {
    body.innerHTML = `<tr><td colspan="5" class="${style["empty"]}">No users match your filters.</td></tr>`;
  } else {
    body.innerHTML = page_items
      .map(
        (u) => `
        <tr>
          <td>
            <div class="${style["user-cell"]}">
              <div class="${style["avatar"]}"></div>
              <div>
                <p class="${style["name"]}">${u.name}</p>
                <p class="${style["handle"]}">${u.handle}</p>
              </div>
            </div>
          </td>
          <td>${u.email}</td>
          <td>${u.joined}</td>
          <td>${status_badge(style_badge, u.status)}</td>
          <td>
            <div class="${style["actions"]}">
              <button class="${style_btn["btn"]} ${style_btn["btn-outline"]}" data-action="view" data-id="${u.id}">View</button>
              ${
                u.status === "banned"
                  ? `<button class="${style_btn["btn"]} ${style_btn["btn-success"]}" data-action="unban" data-id="${u.id}">Unban</button>`
                  : `<button class="${style_btn["btn"]} ${style_btn["btn-danger"]}" data-action="ban" data-id="${u.id}">Ban</button>`
              }
            </div>
          </td>
        </tr>`
      )
      .join("");
  }

  document.getElementById("usersCount").textContent = `Showing ${
    filtered.length === 0 ? 0 : start + 1
  }-${Math.min(start + PAGE_SIZE, filtered.length)} of ${filtered.length}`;

  const pager = document.getElementById("usersPager");
  pager.innerHTML = Array.from({ length: total_pages }, (_, i) => i + 1)
    .map(
      (n) =>
        `<button class="${style["page-btn"]} ${n === state.page ? style["is-current"] : ""}" data-page="${n}">${n}</button>`
    )
    .join("");
}

function bind_events(styles) {
  const { style, style_btn, style_badge } = styles;

  document.getElementById("userSearch").addEventListener("input", (e) => {
    state.search = e.target.value.trim().toLowerCase();
    state.page = 1;
    render_rows(styles);
  });

  document.getElementById("statusFilter").addEventListener("change", (e) => {
    state.status_filter = e.target.value;
    state.page = 1;
    render_rows(styles);
  });

  document.getElementById("usersPager").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-page]");
    if (!btn) return;
    state.page = Number(btn.dataset.page);
    render_rows(styles);
  });

  document.getElementById("usersTableBody").addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const { action } = btn.dataset;

    if (action === "view") {
      window.alert(`Viewing user #${id} (mocked).`);
      return;
    }

    btn.disabled = true;
    const next_status = action === "ban" ? "banned" : "active";
    await set_user_status(id, next_status);
    const user = state.all_users.find((u) => u.id === id);
    if (user) user.status = next_status;
    render_rows(styles);
  });
}

export async function init_users_view(styles) {
  state.all_users = await fetch_users();
  render_rows(styles);
  bind_events(styles);
}

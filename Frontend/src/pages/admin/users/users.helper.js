import { fetch_users, set_user_status, view_user_details } from "../api/users.service";

const PAGE_SIZE = 10;

const state = {
  users: [],
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
    banned: [style_badge["badge-red"], "Banned"],
  };
  const [cls, label] = map[status] || [style_badge["badge-gray"], status];
  return `<span class="${style_badge["badge"]} ${cls}">${label}</span>`;
}

function render_rows(styles) {
  const { style, style_btn, style_badge } = styles;
  const body = document.getElementById("usersTableBody");

  if (state.loading) {
    body.innerHTML = `<tr><td colspan="5" class="${style["empty"]}">Loading users...</td></tr>`;
    return;
  }

  if (state.users.length === 0) {
    body.innerHTML = `<tr><td colspan="5" class="${style["empty"]}">No users found.</td></tr>`;
  } else {
    body.innerHTML = state.users
      .map(
        (u) => `
        <tr>
          <td>
            <div class="${style["user-cell"]}">
              <div class="${style["avatar"]}">
                ${u.avatar
            ? `<img src="${u.avatar}" alt="${u.name}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" />`
            : `<span>${u.name.charAt(0).toUpperCase()}</span>`
          }
              </div>
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
              ${u.status === "banned"
            ? `<button class="${style_btn["btn"]} ${style_btn["btn-success"]}" data-action="unban" data-id="${u.id}">Unban</button>`
            : `<button class="${style_btn["btn"]} ${style_btn["btn-danger"]}" data-action="ban" data-id="${u.id}">Ban</button>`
          }
            </div>
          </td>
        </tr>`
      )
      .join("");
  }

  const start = state.total_items === 0 ? 0 : (state.page - 1) * PAGE_SIZE + 1;
  const end = Math.min(state.page * PAGE_SIZE, state.total_items);

  document.getElementById("usersCount").textContent = `Showing ${start}-${end} of ${state.total_items}`;

  const pager = document.getElementById("usersPager");
  pager.innerHTML = Array.from({ length: state.total_pages }, (_, i) => i + 1)
    .map(
      (n) =>
        `<button class="${style["page-btn"]} ${n === state.page ? style["is-current"] : ""}" data-page="${n}">${n}</button>`
    )
    .join("");
}

async function load_data(styles) {
  state.loading = true;
  render_rows(styles);

  try {
    const data = await fetch_users({
      page: state.page,
      limit: PAGE_SIZE,
      status: state.status_filter,
      search: state.search
    });

    state.users = data.users;
    state.total_items = data.pagination.totalItems;
    state.total_pages = data.pagination.totalPages;
  } catch (err) {
    console.error("Failed to load users:", err);
    state.users = [];
    state.total_items = 0;
    state.total_pages = 1;
  } finally {
    state.loading = false;
    render_rows(styles);
  }
}

function bind_events(styles) {
  let debounceTimer = null;

  document.getElementById("userSearch").addEventListener("input", (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      state.search = e.target.value;
      state.page = 1;
      load_data(styles);
    }, 400);
  });

  document.getElementById("statusFilter").addEventListener("change", (e) => {
    state.status_filter = e.target.value;
    state.page = 1;
    load_data(styles);
  });

  document.getElementById("usersPager").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-page]");
    if (!btn) return;
    const selectedPage = Number(btn.dataset.page);
    if (selectedPage !== state.page) {
      state.page = selectedPage;
      load_data(styles);
    }
  });

  document.getElementById("usersTableBody").addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const id = btn.dataset.id; // UUID String
    const { action } = btn.dataset;

    if (action === "view") {
      try {
        const details = await view_user_details(id);
        // console.log("User Details:", details);
        window.alert(`User Details fetched for ID: ${id}`);
      } catch (err) {
        console.error("Error viewing user:", err);
      }
      return;
    }

    if (action === "ban" || action === "unban") {
      btn.disabled = true;
      try {
        await set_user_status(id);
        await load_data(styles); // Refresh list from backend
      } catch (err) {
        console.error("Failed to toggle status:", err);
        btn.disabled = false;
      }
    }
  });
}

export async function init_users_view(styles) {
  bind_events(styles);
  await load_data(styles);
}
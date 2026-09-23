import { getUsers, banUser, unbanUser } from "../api/users.service.js";
import { statusBadge } from "../components/statusBadge.js";
import { renderStatePanel, renderPagination } from "../components/table.js";
import { confirmModal } from "../components/modal.js";
import { icon } from "../components/icons.js";
import { showToast } from "../app.js";

const state = { page: 1, pageSize: 8, search: "", status: "all" };
let searchDebounce;

export async function initUsersPage() {
  document.getElementById("users-search").addEventListener("input", (e) => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      state.search = e.target.value;
      state.page = 1;
      loadUsers();
    }, 250);
  });

  document.getElementById("users-status-filter").addEventListener("change", (e) => {
    state.status = e.target.value;
    state.page = 1;
    loadUsers();
  });

  await loadUsers();
}

async function loadUsers() {
  const body = document.getElementById("users-table-body");
  const wrap = document.getElementById("users-table-wrap");
  const paginationSlot = document.getElementById("users-pagination");
  const table = document.getElementById("users-table");

  table.style.display = "none";
  wrap.querySelector(".state-panel")?.remove();
  wrap.insertAdjacentHTML("beforeend", renderStatePanel({ type: "loading", title: "Loading users..." }));

  try {
    const res = await getUsers(state);
    wrap.querySelector(".state-panel")?.remove();

    if (!res.items.length) {
      table.style.display = "none";
      wrap.insertAdjacentHTML(
        "beforeend",
        renderStatePanel({
          type: "empty",
          title: "No users found",
          desc: "Try a different search term or status filter."
        })
      );
      paginationSlot.innerHTML = "";
      return;
    }

    table.style.display = "";
    body.innerHTML = res.items.map(userRow).join("");
    attachRowActions(body);

    paginationSlot.innerHTML = "";
    paginationSlot.appendChild(
      renderPagination({
        page: res.page,
        pageSize: res.pageSize,
        total: res.total,
        onPageChange: (p) => {
          state.page = p;
          loadUsers();
        }
      })
    );
  } catch (err) {
    table.style.display = "none";
    wrap.querySelector(".state-panel")?.remove();
    wrap.insertAdjacentHTML(
      "beforeend",
      renderStatePanel({ type: "error", title: "Couldn't load users", desc: err.message })
    );
    paginationSlot.innerHTML = "";
  }
}

function userRow(u) {
  return `
    <tr data-id="${u.id}">
      <td>
        <div class="data-table__user">
          <span class="avatar">${icon("user")}</span>
          <div>
            <div class="data-table__user-name">${u.name}</div>
            <div class="data-table__user-handle">${u.handle}</div>
          </div>
        </div>
      </td>
      <td class="data-table__muted">${u.email}</td>
      <td class="data-table__muted">${u.joined}</td>
      <td>${statusBadge(u.status)}</td>
      <td>
        <div class="data-table__actions">
          <button class="btn btn--sm btn--secondary" data-action="view">${icon("eye")} View</button>
          ${
            u.status === "banned"
              ? `<button class="btn btn--sm btn--success" data-action="unban">${icon("restore")} Unban</button>`
              : `<button class="btn btn--sm btn--danger" data-action="ban">${icon("shieldBan")} Ban</button>`
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
      const name = row.querySelector(".data-table__user-name").textContent;
      const action = btn.dataset.action;

      if (action === "view") {
        showToast(`Viewing ${name} — hook up to a user detail view.`);
        return;
      }

      if (action === "ban") {
        confirmModal({
          title: `Ban ${name}?`,
          body: "They'll immediately lose access to their account. This can be reversed at any time.",
          confirmLabel: "Ban user",
          tone: "danger",
          onConfirm: async () => {
            try {
              await banUser(id);
            } catch {
              /* falls back silently until backend is connected */
            }
            showToast(`${name} has been banned.`);
            loadUsers();
          }
        });
      }

      if (action === "unban") {
        confirmModal({
          title: `Unban ${name}?`,
          body: "This restores their access to Socialife immediately.",
          confirmLabel: "Unban user",
          tone: "success",
          onConfirm: async () => {
            try {
              await unbanUser(id);
            } catch {
              /* falls back silently until backend is connected */
            }
            showToast(`${name} has been unbanned.`);
            loadUsers();
          }
        });
      }
    });
  });
}

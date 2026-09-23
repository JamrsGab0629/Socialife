import { icon } from "./icons.js";

export function mountHeader({ title, description }) {
  const header = document.getElementById("app-header");
  header.innerHTML = `
    <div class="app-header__left">
      <button class="header__mobile-toggle" id="sidebar-toggle" aria-label="Toggle navigation">
        ${icon("menu")}
      </button>
      <div class="app-header__titles">
        <h1 class="app-header__title">${title}</h1>
        <p class="app-header__desc">${description}</p>
      </div>
    </div>
    <div class="app-header__actions">
      <button class="icon-btn" aria-label="Notifications">
        ${icon("bell")}
        <span class="icon-btn__badge">3</span>
      </button>
      <button class="icon-btn" aria-label="Admin profile">
        ${icon("user")}
      </button>
    </div>
  `;

  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  document.getElementById("sidebar-toggle")?.addEventListener("click", () => {
    sidebar.classList.toggle("is-open");
    backdrop.classList.toggle("is-visible");
  });
  backdrop?.addEventListener("click", () => {
    sidebar.classList.remove("is-open");
    backdrop.classList.remove("is-visible");
  });
}

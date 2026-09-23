import { mountSidebar } from "./components/sidebar.js";
import { mountHeader } from "./components/header.js";

const ROUTES = {
  dashboard: {
    title: "Dashboard",
    description: "Overview of your platform",
    page: "pages/dashboard.html",
    init: () => import("./pages/dashboard.js").then((m) => m.initDashboardPage())
  },
  users: {
    title: "Users",
    description: "Search, review, and manage platform accounts",
    page: "pages/users.html",
    init: () => import("./pages/users.js").then((m) => m.initUsersPage())
  },
  posts: {
    title: "Posts",
    description: "Review and moderate posts across Socialife",
    page: "pages/posts.html",
    init: () => import("./pages/posts.js").then((m) => m.initPostsPage())
  },
  reports: {
    title: "Reports",
    description: "Review flagged users and content",
    page: "pages/reports.html",
    init: () => import("./pages/reports.js").then((m) => m.initReportsPage())
  },
  analytics: {
    title: "Analytics",
    description: "Platform growth and engagement trends",
    page: "pages/analytics.html",
    init: () => import("./pages/analytics.js").then((m) => m.initAnalyticsPage())
  },
  "team-roles": {
    title: "Team Roles",
    description: "Manage administrators and their permissions",
    page: "pages/team-roles.html",
    init: () => import("./pages/teamRoles.js").then((m) => m.initTeamRolesPage())
  },
  settings: {
    title: "Settings",
    description: "Account, notification, and security preferences",
    page: "pages/settings.html",
    init: () => Promise.resolve()
  }
};

const DEFAULT_ROUTE = "dashboard";
const pageCache = new Map();

// Bumped on every navigation so an in-flight render from a route the
// user has already left can detect it's stale and bail out instead of
// writing into (or querying) DOM that belongs to the new page.
let renderToken = 0;

async function fetchPage(path) {
  if (pageCache.has(path)) return pageCache.get(path);
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`${path} responded with ${res.status}`);
  }
  const html = await res.text();
  pageCache.set(path, html);
  return html;
}

function currentRouteKey() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  return ROUTES[hash] ? hash : DEFAULT_ROUTE;
}

export async function initRouter() {
  window.addEventListener("hashchange", renderRoute);
  await renderRoute();
}

async function renderRoute() {
  const key = currentRouteKey();
  const route = ROUTES[key];
  const content = document.getElementById("page-content");

  const myToken = ++renderToken;
  const isStale = () => myToken !== renderToken;

  mountSidebar(key);
  mountHeader({ title: route.title, description: route.description });

  content.innerHTML = `<div class="state-panel"><div class="spinner"></div></div>`;

  try {
    const html = await fetchPage(route.page);
    if (isStale()) return; // a newer navigation started while this was fetching

    content.innerHTML = html;
    await route.init();
    if (isStale()) return; // navigation happened mid-init; new page already owns the DOM
  } catch (err) {
    if (isStale()) return;
    content.innerHTML = `
      <div class="card card--pad">
        <div class="state-panel state-panel--error">
          <div class="state-panel__title">Couldn't load this page</div>
          <div class="state-panel__desc">${err.message}</div>
        </div>
      </div>`;
  }
}

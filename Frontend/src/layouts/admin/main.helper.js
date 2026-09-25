// main.helper.js
// Small helpers for the app shell (topbar interactions live here so
// main.js stays focused on markup/composition).

export function bind_topbar(root) {
  const notif_btn = root.querySelector("#notifBtn");
  const profile_btn = root.querySelector("#profileBtn");

  notif_btn?.addEventListener("click", () => {
    window.alert("3 new notifications (mocked).");
  });

  profile_btn?.addEventListener("click", () => {
    window.location.hash = "#/settings";
  });
}

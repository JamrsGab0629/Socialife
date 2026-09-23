import { initRouter } from "./router.js";

export function showToast(message) {
  const stack = document.getElementById("toast-stack");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  stack.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

document.addEventListener("DOMContentLoaded", () => {
  initRouter();
});

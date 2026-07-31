function toggleLike(el) {
  el.classList.toggle("liked");
  const label = el.querySelector(".like-label");
  label.textContent = el.classList.contains("liked") ? "Liked" : "Like";
}

/* ---------- Messaging page ---------- */

function selectConversation(el, name, status) {
  document
    .querySelectorAll(".conv-item")
    .forEach((item) => item.classList.remove("active"));
  el.classList.add("active");
  el.classList.remove("unread");
  const dot = el.querySelector(".conv-unread-dot");
  if (dot) dot.remove();

  const nameEl = document.getElementById("chatHeaderName");
  const statusEl = document.getElementById("chatHeaderStatus");
  if (nameEl) nameEl.textContent = name;
  if (statusEl) statusEl.textContent = status;

  // Swap the chat header photo to match whoever was just selected
  const sourceAvatar = el.querySelector(".conv-avatar svg, .conv-avatar img");
  const headerAvatarBox = document.getElementById("chatHeaderAvatar");
  if (sourceAvatar && headerAvatarBox) {
    const clone = sourceAvatar.cloneNode(true);
    clone.setAttribute("width", "42");
    clone.setAttribute("height", "42");
    headerAvatarBox.innerHTML = "";
    headerAvatarBox.appendChild(clone);
  }

  showTypingThenReply(name);
}

function showTypingThenReply(name) {
  const messagesArea = document.getElementById("messagesArea");
  if (!messagesArea) return;

  const typingRow = document.createElement("div");
  typingRow.className = "msg-row received typing-row";
  typingRow.innerHTML = `
<div class="typing-bubble">
<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>
</div>`;
  messagesArea.appendChild(typingRow);
  messagesArea.scrollTop = messagesArea.scrollHeight;

  setTimeout(() => {
    typingRow.remove();
  }, 1100);
}

function reactToMessage(el) {
  const existing = el.querySelector(".reaction-pop");
  if (existing) existing.remove();

  const pop = document.createElement("span");
  pop.className = "reaction-pop";
  pop.textContent = "👍";
  el.appendChild(pop);

  setTimeout(() => pop.remove(), 900);
}

function sendMessage() {
  const input = document.getElem;
  entById("chatInput");
  const text = input.value.trim();
  if (!text) return;

  const messagesArea = document.getElementById("messagesArea");

  const row = document.createElement("div");
  row.className = "msg-row sent";
  const bubble = document.createElement("div");
  bubble.className = "msg-bubble";
  bubble.textContent = text;
  bubble.ondblclick = () => reactToMessage(bubble);
  row.appendChild(bubble);
  messagesArea.appendChild(row);

  input.value = "";
  messagesArea.scrollTop = messagesArea.scrollHeight;
}

function handleChatInputKey(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
}

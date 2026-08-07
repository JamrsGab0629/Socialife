const photos = Array.from(document.querySelectorAll('.stage-photo'));
const dots = Array.from(document.querySelectorAll('.photo-dot'));
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const closeBtn = document.getElementById('closeBtn');

let currentIndex = 0;

function showPhoto(index) {
  currentIndex = (index + photos.length) % photos.length;
  photos.forEach((photo, i) => photo.classList.toggle('active', i === currentIndex));
  dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
}

prevBtn.addEventListener('click', () => showPhoto(currentIndex - 1));
nextBtn.addEventListener('click', () => showPhoto(currentIndex + 1));

dots.forEach((dot) => {
  dot.addEventListener('click', () => showPhoto(parseInt(dot.dataset.index, 10)));
});

closeBtn.addEventListener('click', () => {
  document.getElementById('viewer').style.display = 'none';
});

function initials(name) {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

document.querySelectorAll('.author-avatar img, .comment-avatar img, .viewer-avatar img').forEach((img) => {
  img.addEventListener('error', () => {
    const container = img.parentElement;
    container.textContent = initials(img.alt || '?');
  });
});

const likeBtn = document.getElementById('likeBtn');
const likeCount = document.getElementById('likeCount');
let liked = false;
let baseLikes = parseInt(likeCount.textContent.replace(/,/g, ''), 10);

likeBtn.addEventListener('click', () => {
  liked = !liked;
  likeBtn.classList.toggle('liked', liked);
  const total = baseLikes + (liked ? 1 : 0);
  likeCount.textContent = total.toLocaleString();
});

const commentList = document.getElementById('commentList');
const commentCount = document.getElementById('commentCount');

commentList.addEventListener('click', (event) => {
  const button = event.target.closest('.comment-like');
  if (!button) return;
  button.classList.toggle('liked');
  button.textContent = button.classList.contains('liked') ? 'Liked' : 'Like';
});

function addComment(name, avatarSrc, text) {
  const item = document.createElement('div');
  item.className = 'comment-item';
  item.innerHTML =
    '<div class="comment-avatar"><img src="' + avatarSrc + '" alt="' + name + '"></div>' +
    '<div class="comment-body">' +
      '<div class="comment-bubble"><span class="comment-name">' + name + '</span><p class="comment-text"></p></div>' +
      '<div class="comment-actions"><button type="button" class="comment-like">Like</button><button type="button">Reply</button><span class="comment-time">Just now</span></div>' +
    '</div>';

  item.querySelector('.comment-text').textContent = text;

  const img = item.querySelector('img');
  img.addEventListener('error', () => {
    img.parentElement.textContent = initials(name);
  });

  commentList.appendChild(item);
  commentList.scrollTop = commentList.scrollHeight;

  const current = parseInt(commentCount.textContent, 10) || 0;
  commentCount.textContent = current + 1;
}

const commentInput = document.getElementById('commentInput');
const commentSend = document.getElementById('commentSend');

function submitComment() {
  const text = commentInput.value.trim();
  if (!text) return;
  addComment('James Gabriel Santos', 'images/james.jpg', text);
  commentInput.value = '';
}

commentSend.addEventListener('click', submitComment);

commentInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') submitComment();
});
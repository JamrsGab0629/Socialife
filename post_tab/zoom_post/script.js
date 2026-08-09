import Fetch from '../../src/core/fetch.js';

const photoFrame = document.getElementById('photoFrame');
const photoDots = document.getElementById('photoDots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const closeBtn = document.getElementById('closeBtn');

const viewerAvatar = document.getElementById('viewerAvatar');
const authorAvatar = document.getElementById('authorAvatar');
const authorName = document.getElementById('authorName');
const privacyPill = document.getElementById('privacyPill');
const postTime = document.getElementById('postTime');
const postCaption = document.getElementById('postCaption');
const likeBtn = document.getElementById('likeBtn');
const likeCount = document.getElementById('likeCount');
const commentCount = document.getElementById('commentCount');
const shareCount = document.getElementById('shareCount');
const commentList = document.getElementById('commentList');
const composerAvatar = document.getElementById('composerAvatar');
const commentInput = document.getElementById('commentInput');
const commentSend = document.getElementById('commentSend');

let currentUser = null;
let photoCount = 0;
let currentIndex = 0;
let liked = false;
let baseLikes = 0;

function initials(name) {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

function setAvatar(container, author) {
  container.innerHTML = '';
  const img = document.createElement('img');
  img.src = author.avatar;
  img.alt = author.name;
  img.addEventListener('error', () => {
    container.textContent = initials(author.name);
  });
  container.appendChild(img);
}

function formatTimeAgo(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const hours = Math.floor(diffMs / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return hours + 'h';
  return Math.floor(hours / 24) + 'd';
}

function showPhoto(index) {
  const photos = Array.from(photoFrame.children);
  currentIndex = (index + photoCount) % photoCount;
  photos.forEach((el, i) => el.classList.toggle('active', i === currentIndex));
  Array.from(photoDots.children).forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
}

function renderPhotos(photos) {
  photoFrame.innerHTML = '';
  photoDots.innerHTML = '';
  photoCount = photos.length;

  photos.forEach((photo, index) => {
    const img = document.createElement('img');
    img.className = 'stage-photo' + (index === 0 ? ' active' : '');
    img.src = photo.url;
    img.alt = '';

    const placeholder = document.createElement('div');
    placeholder.className = 'photo-placeholder' + (index === 0 ? ' active' : '');

    img.addEventListener('error', () => {
      img.classList.remove('active');
      placeholder.classList.add('active');
    });

    photoFrame.appendChild(img);
    photoFrame.appendChild(placeholder);

    if (photoCount > 1) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'photo-dot' + (index === 0 ? ' active' : '');
      dot.addEventListener('click', () => showPhoto(index));
      photoDots.appendChild(dot);
    }
  });
}

prevBtn.addEventListener('click', () => showPhoto(currentIndex - 1));
nextBtn.addEventListener('click', () => showPhoto(currentIndex + 1));

closeBtn.addEventListener('click', () => {
  document.getElementById('viewer').style.display = 'none';
});

function renderComment(comment) {
  const item = document.createElement('div');
  item.className = 'comment-item';

  const avatar = document.createElement('div');
  avatar.className = 'comment-avatar';
  setAvatar(avatar, comment.author);

  const body = document.createElement('div');
  body.className = 'comment-body';
  body.innerHTML =
    '<div class="comment-bubble"><span class="comment-name">' + comment.author.name +
    '</span><p class="comment-text"></p></div>' +
    '<div class="comment-actions"><button type="button" class="comment-like">Like</button><button type="button">Reply</button><span class="comment-time"></span></div>';

  body.querySelector('.comment-text').textContent = comment.text;
  body.querySelector('.comment-time').textContent = formatTimeAgo(comment.timestamp);

  item.appendChild(avatar);
  item.appendChild(body);
  commentList.appendChild(item);
}

commentList.addEventListener('click', (event) => {
  const button = event.target.closest('.comment-like');
  if (!button) return;
  button.classList.toggle('liked');
  button.textContent = button.classList.contains('liked') ? 'Liked' : 'Like';
});

function bumpCommentCount() {
  const current = parseInt(commentCount.textContent, 10) || 0;
  commentCount.textContent = current + 1;
}

function submitComment() {
  const text = commentInput.value.trim();
  if (!text || !currentUser) return;

  renderComment({
    author: currentUser,
    text: text,
    timestamp: new Date().toISOString()
  });

  commentList.scrollTop = commentList.scrollHeight;
  bumpCommentCount();
  commentInput.value = '';
}

commentSend.addEventListener('click', submitComment);
commentInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') submitComment();
});

likeBtn.addEventListener('click', () => {
  liked = !liked;
  likeBtn.classList.toggle('liked', liked);
  likeCount.textContent = (baseLikes + (liked ? 1 : 0)).toLocaleString();
});

function renderPost(data) {
  const post = data.post;
  currentUser = post.author;
  baseLikes = post.stats.likes;

  setAvatar(viewerAvatar, post.author);
  setAvatar(authorAvatar, post.author);
  setAvatar(composerAvatar, post.author);

  authorName.textContent = post.author.name;
  postTime.textContent = formatTimeAgo(post.timestamp);
  postCaption.textContent = post.caption;
  likeCount.textContent = post.stats.likes.toLocaleString();
  shareCount.textContent = post.stats.shares;
  commentCount.textContent = data.comments.length;

  privacyPill.innerHTML = post.privacy === 'public'
    ? '<svg class="icon" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"></circle><path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9s1.3-6.4 3.8-9z" stroke="currentColor" stroke-width="1.8"></path></svg><span>Public</span>'
    : '<svg class="icon" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" stroke-width="1.8"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="1.8"></path></svg><span>Private</span>';

  renderPhotos(post.photos);

  commentList.innerHTML = '';
  data.comments.forEach(renderComment);
}

async function init() {
  const data = await Fetch('../../public/API/zoom_post.json');
  if (!data) return;
  renderPost(data);
}

init();
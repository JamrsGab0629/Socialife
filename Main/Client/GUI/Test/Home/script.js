function toggleLike(el) {
    el.classList.toggle('liked');
    const label = el.querySelector('.like-label');
    label.textContent = el.classList.contains('liked') ? 'Liked' : 'Like';
  }

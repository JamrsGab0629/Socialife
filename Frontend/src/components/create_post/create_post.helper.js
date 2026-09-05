import { createPostService } from './create_post.service.js';

/**
 * Attaches event listeners and handles state management for the Create Post component.
 * @param {HTMLElement} root - The parent container element.
 * @param {Object} style - CSS Module object passed from the main component.
 * @param {string|number} userId - ID of the active user creating the post.
 */
export function initCreatePost(root = document, style = {}, userId = 'CURRENT_USER_ID') {
  // DOM References scoped to root container
  const composerCard = root.querySelector(`.${style['composer-card']}`) || root.querySelector('.composer-card');
  const closeBtn = root.querySelector('#closeBtn');
  const captionInput = root.querySelector('#captionInput');
  const postBtn = root.querySelector('#postBtn');
  const toast = root.querySelector('#toast') || document.querySelector('#toast');

  // Photo Elements
  const photoInput = root.querySelector('#photoInput');
  const addPhotoBtn = root.querySelector('#addPhotoBtn');
  const addPhotoBtnBottom = root.querySelector('#addPhotoBtnBottom');
  const photoPreview = root.querySelector('#photoPreview');
  const photoPreviewImage = root.querySelector('#photoPreviewImage');
  const removePhotoBtn = root.querySelector('#removePhotoBtn');

  // State
  let selectedPhoto = null;

  // --- Helper Functions ---

  function updatePostState() {
    if (!postBtn || !captionInput) return;
    const hasContent = captionInput.value.trim().length > 0 || selectedPhoto !== null;
    postBtn.disabled = !hasContent;
  }

  function showPhoto(file) {
    if (!file || !file.type.startsWith('image/')) return;

    selectedPhoto = file;
    const imageURL = URL.createObjectURL(file);

    if (photoPreviewImage) photoPreviewImage.src = imageURL;
    if (photoPreview) photoPreview.hidden = false;

    updatePostState();
  }

  function removePhoto() {
    selectedPhoto = null;
    if (photoInput) photoInput.value = '';
    if (photoPreviewImage) photoPreviewImage.src = '';
    if (photoPreview) photoPreview.hidden = true;

    updatePostState();
  }

  function resetComposer() {
    if (captionInput) {
      captionInput.value = '';
      captionInput.style.height = 'auto';
    }
    removePhoto();
    updatePostState();
  }

  function closeComposer() {
    resetComposer();
    if (composerCard) {
      composerCard.style.display = 'none';
    }
  }

  function showToast(message = 'Post created successfully!') {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2600);
  }

  // --- Event Listeners ---

  if (closeBtn) {
    closeBtn.addEventListener('click', closeComposer);
  }

  if (captionInput) {
    captionInput.addEventListener('input', () => {
      captionInput.style.height = 'auto';
      captionInput.style.height = `${captionInput.scrollHeight}px`;
      updatePostState();
    });
  }

  const handlePhotoBtnClick = () => photoInput && photoInput.click();
  if (addPhotoBtn) addPhotoBtn.addEventListener('click', handlePhotoBtnClick);
  if (addPhotoBtnBottom) addPhotoBtnBottom.addEventListener('click', handlePhotoBtnClick);

  if (photoInput) {
    photoInput.addEventListener('change', () => {
      const file = photoInput.files[0];
      if (!file) return;
      showPhoto(file);
      photoInput.value = '';
    });
  }

  if (removePhotoBtn) {
    removePhotoBtn.addEventListener('click', removePhoto);
  }

  // --- Post Submission with Service ---
  if (postBtn) {
    postBtn.addEventListener('click', async () => {
      if (postBtn.disabled) return;

      const captionText = captionInput.value.trim();
      const originalText = postBtn.textContent;

      try {
        // Show loading state
        postBtn.disabled = true;
        postBtn.textContent = 'Posting...';

        // Execute API call via service
        await createPostService(
          userId,
          { caption: captionText },
          selectedPhoto
        );

        resetComposer();
        showToast('Post created!');
      } catch (error) {
        console.error('Failed to publish post:', error);
        showToast('Failed to create post. Try again.');
      } finally {
        postBtn.textContent = originalText;
        updatePostState();
      }
    });
  }

  updatePostState();
}
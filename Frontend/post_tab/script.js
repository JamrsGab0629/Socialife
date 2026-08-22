
document.addEventListener('DOMContentLoaded', () => {

  // --- DOM References ---
  const captionInput = document.getElementById('captionInput');
  const postBtn = document.getElementById('postBtn');
  const toast = document.getElementById('toast');

  // Privacy Elements
  const privacyControl = document.querySelector('.privacy-control');
  const privacyToggle = document.getElementById('privacyToggle');
  const privacyLabel = document.getElementById('privacyLabel');
  const privacyIcon = document.getElementById('privacyIcon');
  const avatarWrap = document.querySelector('.avatar-wrap');

  // Photo Elements
  const photoInput = document.getElementById('photoInput');
  const addPhotoBtn = document.getElementById('addPhotoBtn');
  const photoPreview = document.getElementById('photoPreview');
  const photoPreviewImage = document.getElementById('photoPreviewImage');
  const removePhotoBtn = document.getElementById('removePhotoBtn');

  // --- State ---
  let selectedPhoto = null;

  const privacyIcons = {
    public: `
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        stroke-width="1.8">
      </circle>

      <path
        d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9s1.3-6.4-3.8-9z"
        stroke="currentColor"
        stroke-width="1.8">
      </path>
    `,

    private: `
      <rect
        x="5"
        y="11"
        width="14"
        height="9"
        rx="2"
        stroke="currentColor"
        stroke-width="1.8">
      </rect>

      <path
        d="M8 11V8a4 4 0 0 1 8 0v3"
        stroke="currentColor"
        stroke-width="1.8">
      </path>
    `
  };


  // --- 1. Privacy Control ---

  function setPrivacy(value) {

    if (!privacyLabel || !privacyIcon || !avatarWrap) return;

    privacyLabel.textContent =
      value === 'public' ? 'Public' : 'Private';

    privacyIcon.innerHTML =
      privacyIcons[value];

    avatarWrap.classList.toggle(
      'locked',
      value === 'private'
    );

    document
      .querySelectorAll('.privacy-option')
      .forEach((option) => {

        option.classList.toggle(
          'active',
          option.dataset.privacy === value
        );

      });
  }


  if (privacyToggle) {

    privacyToggle.addEventListener('click', (event) => {

      event.stopPropagation();

      if (privacyControl) {
        privacyControl.classList.toggle('open');
      }

    });

  }


  document
    .querySelectorAll('.privacy-option')
    .forEach((option) => {

      option.addEventListener('click', () => {

        setPrivacy(option.dataset.privacy);

        if (privacyControl) {
          privacyControl.classList.remove('open');
        }

      });

    });


  // --- 2. Textarea Auto-Resize ---

  if (captionInput) {

    captionInput.addEventListener('input', () => {

      captionInput.style.height = 'auto';

      captionInput.style.height =
        captionInput.scrollHeight + 'px';

      updatePostState();

    });

  }


  // --- 3. Single Photo Selection ---

  function showPhoto(file) {

    if (!file || !file.type.startsWith('image/')) {
      return;
    }

    selectedPhoto = file;

    const imageURL =
      URL.createObjectURL(file);

    if (photoPreviewImage) {
      photoPreviewImage.src = imageURL;
    }

    if (photoPreview) {
      photoPreview.hidden = false;
    }

    updatePostState();
  }


  function removePhoto() {

    selectedPhoto = null;

    if (photoInput) {
      photoInput.value = '';
    }

    if (photoPreviewImage) {
      photoPreviewImage.src = '';
    }

    if (photoPreview) {
      photoPreview.hidden = true;
    }

    updatePostState();
  }


  // Open photo picker

  if (addPhotoBtn && photoInput) {

    addPhotoBtn.addEventListener('click', () => {
      photoInput.click();
    });

  }


  // Select photo

  if (photoInput) {

    photoInput.addEventListener('change', () => {

      const file = photoInput.files[0];

      if (!file) return;

      showPhoto(file);

      // Allows selecting the same file again
      photoInput.value = '';

    });

  }


  // Remove photo

  if (removePhotoBtn) {

    removePhotoBtn.addEventListener('click', () => {
      removePhoto();
    });

  }


  // --- 4. Post Button State ---

  function updatePostState() {

    if (!postBtn || !captionInput) return;

    const hasContent =
      captionInput.value.trim().length > 0 ||
      selectedPhoto !== null;

    postBtn.disabled = !hasContent;
  }


  // --- 5. Reset Composer ---

  function resetComposer() {

    if (captionInput) {

      captionInput.value = '';

      captionInput.style.height = 'auto';

    }

    removePhoto();

    setPrivacy('public');

    updatePostState();
  }


  // --- 6. Toast ---

  function showToast() {

    if (!toast) return;

    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 2600);
  }


  // --- 7. Post ---

  if (postBtn) {

    postBtn.addEventListener('click', () => {

      if (postBtn.disabled) return;

      // Post immediately — no loader
      resetComposer();

      showToast();

    });

  }


  // --- 8. Click Outside Privacy Menu ---

  document.addEventListener('click', (event) => {

    if (
      privacyControl &&
      !privacyControl.contains(event.target)
    ) {

      privacyControl.classList.remove('open');

    }

  });


  // --- 9. Escape Key ---

  document.addEventListener('keydown', (event) => {

    if (event.key === 'Escape') {

      if (privacyControl) {
        privacyControl.classList.remove('open');
      }

    }

  });


  // --- Init ---

  setPrivacy('public');

  updatePostState();

});

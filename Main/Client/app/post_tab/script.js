document.addEventListener('DOMContentLoaded', () => {
  // --- DOM References ---
  const captionInput = document.getElementById('captionInput');
  const postBtn = document.getElementById('postBtn');
  const toast = document.getElementById('toast');
  const loader = document.getElementById('loader');
  const ringFill = document.getElementById('ringFill');
  const percentageText = document.getElementById('percentage');

  // Privacy Elements
  const privacyControl = document.querySelector('.privacy-control');
  const privacyToggle = document.getElementById('privacyToggle');
  const privacyLabel = document.getElementById('privacyLabel');
  const privacyIcon = document.getElementById('privacyIcon');
  const avatarWrap = document.querySelector('.avatar-wrap');

  // Tagging Elements
  const tagPeopleBtn = document.getElementById('tagPeopleBtn');
  const peoplePanel = document.getElementById('peoplePanel');
  const taggedAvatars = document.getElementById('taggedAvatars');

  // Photo Zone Elements
  const photoZone = document.getElementById('photoZone');
  const photoInput = document.getElementById('photoInput');
  const photoGrid = document.getElementById('photoGrid');
  const photoWarning = document.getElementById('photoWarning');
  const addPhotoBtn = document.getElementById('addPhotoBtn');

  // --- State Data ---
  const taggedPeople = new Set();
  const photos = [];
  let searchTerm = '';

  const friends = [
    'Maya Cruz', 'Ken Villareal', 'Ana Bautista',
    'Paolo Reyes', 'Liza Domingo', 'Miguel Torres'
  ];

  const privacyIcons = {
    public: '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"></circle><path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9s1.3-6.4 3.8-9z" stroke="currentColor" stroke-width="1.8"></path>',
    private: '<rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" stroke-width="1.8"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="1.8"></path>'
  };

  // --- 1. Privacy Control ---
  function setPrivacy(value) {
    if (!privacyLabel || !privacyIcon || !avatarWrap) return;
    privacyLabel.textContent = value === 'public' ? 'Public' : 'Private';
    privacyIcon.innerHTML = privacyIcons[value];
    avatarWrap.classList.toggle('locked', value === 'private');

    document.querySelectorAll('.privacy-option').forEach((option) => {
      option.classList.toggle('active', option.dataset.privacy === value);
    });
  }

  if (privacyToggle) {
    privacyToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      closePeoplePanel();
      privacyControl.classList.toggle('open');
    });
  }

  document.querySelectorAll('.privacy-option').forEach((option) => {
    option.addEventListener('click', () => {
      setPrivacy(option.dataset.privacy);
      if (privacyControl) privacyControl.classList.remove('open');
    });
  });

  // --- 2. Tag Friends Panel with Live Search ---
  function initials(name) {
    return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  }

  // Set up search bar and list container inside peoplePanel dynamically
  function initPeoplePanelStructure() {
    if (!peoplePanel) return;
    peoplePanel.innerHTML = `
      <div class="people-panel-search">
        <input type="text" id="friendSearchInput" placeholder="Search friends..." autocomplete="off">
      </div>
      <div class="people-list" id="peopleList"></div>
    `;

    const searchInput = peoplePanel.querySelector('#friendSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value;
        renderPeopleList();
      });
      searchInput.addEventListener('click', (e) => e.stopPropagation());
      searchInput.addEventListener('keydown', (e) => e.stopPropagation());
    }

    peoplePanel.addEventListener('click', (e) => e.stopPropagation());
  }

  function renderPeopleList() {
    const peopleList = document.getElementById('peopleList');
    if (!peopleList) return;
    peopleList.innerHTML = '';

    const filtered = friends.filter((name) =>
      name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );

    if (filtered.length === 0) {
      peopleList.innerHTML = '<div class="no-results" style="padding:12px; font-size:13px; opacity:0.6;">No friends found</div>';
      return;
    }

    filtered.forEach((name) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'people-panel-item' + (taggedPeople.has(name) ? ' selected' : '');
      item.innerHTML = `
        <span class="mini-avatar">${initials(name)}</span>
        <span class="friend-name">${name}</span>
        <span class="check"></span>
      `;

      item.addEventListener('click', (e) => {
        e.stopPropagation();
        if (taggedPeople.has(name)) {
          taggedPeople.delete(name);
        } else {
          taggedPeople.add(name);
        }
        renderPeopleList();
        renderTaggedAvatars();
      });

      peopleList.appendChild(item);
    });
  }

  function renderTaggedAvatars() {
    if (!taggedAvatars) return;
    taggedAvatars.innerHTML = '';
    Array.from(taggedPeople).forEach((name) => {
      const avatar = document.createElement('div');
      avatar.className = 'tagged-avatar';
      avatar.textContent = initials(name);
      avatar.title = name;
      taggedAvatars.appendChild(avatar);
    });
    updatePostState();
  }

  function closePeoplePanel() {
    if (peoplePanel) {
      peoplePanel.setAttribute('hidden', '');
      searchTerm = '';
      const searchInput = document.getElementById('friendSearchInput');
      if (searchInput) searchInput.value = '';
    }
  }

  function togglePeoplePanel() {
    if (!peoplePanel) return;
    const isHidden = peoplePanel.hasAttribute('hidden');
    if (isHidden) {
      if (!document.getElementById('friendSearchInput')) {
        initPeoplePanelStructure();
      }
      searchTerm = '';
      const searchInput = document.getElementById('friendSearchInput');
      if (searchInput) searchInput.value = '';

      renderPeopleList();
      peoplePanel.removeAttribute('hidden');
      if (searchInput) searchInput.focus();
    } else {
      closePeoplePanel();
    }
  }

  if (tagPeopleBtn) {
    tagPeopleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (privacyControl) privacyControl.classList.remove('open');
      togglePeoplePanel();
    });
  }

  // --- 3. Textarea Auto-Resizing ---
  if (captionInput) {
    captionInput.addEventListener('input', () => {
      captionInput.style.height = 'auto';
      captionInput.style.height = captionInput.scrollHeight + 'px';
      updatePostState();
    });
  }

  // --- 4. Photo Zone & Drag and Drop ---
  function renderPhotos() {
    if (!photoZone || !photoGrid) return;
    if (photos.length === 0) {
      photoZone.removeAttribute('hidden');
      photoGrid.setAttribute('hidden', '');
      photoGrid.innerHTML = '';
      updatePostState();
      return;
    }

    photoZone.setAttribute('hidden', '');
    photoGrid.removeAttribute('hidden');
    photoGrid.innerHTML = '';

    photos.forEach((src, index) => {
      const thumb = document.createElement('div');
      thumb.className = 'photo-thumb';
      thumb.innerHTML = `<img src="${src}" alt=""><button type="button">&times;</button>`;
      
      thumb.querySelector('button').addEventListener('click', () => {
        photos.splice(index, 1);
        renderPhotos();
      });
      
      photoGrid.appendChild(thumb);
    });

    const addMore = document.createElement('div');
    addMore.className = 'photo-thumb add-more';
    addMore.textContent = '+';
    addMore.addEventListener('click', () => photoInput && photoInput.click());
    photoGrid.appendChild(addMore);

    updatePostState();
  }

  function handleFiles(fileList) {
    const files = Array.from(fileList);
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    const rejected = files.length - imageFiles.length;

    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        photos.push(e.target.result);
        renderPhotos();
      };
      reader.readAsDataURL(file);
    });

    if (rejected > 0 && photoWarning) {
      photoWarning.removeAttribute('hidden');
      setTimeout(() => photoWarning.setAttribute('hidden', ''), 3200);
    }
  }

  if (photoZone && photoInput) {
    photoZone.addEventListener('click', () => photoInput.click());

    ['dragover', 'dragenter'].forEach((eventName) => {
      photoZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        photoZone.classList.add('drag-over');
      });
    });

    ['dragleave', 'dragend'].forEach((eventName) => {
      photoZone.addEventListener(eventName, () => {
        photoZone.classList.remove('drag-over');
      });
    });

    photoZone.addEventListener('drop', (e) => {
      e.preventDefault();
      photoZone.classList.remove('drag-over');
      handleFiles(e.dataTransfer.files);
    });
  }

  if (addPhotoBtn && photoInput) {
    addPhotoBtn.addEventListener('click', () => photoInput.click());
  }

  if (photoInput) {
    photoInput.addEventListener('change', () => {
      handleFiles(photoInput.files);
      photoInput.value = '';
    });
  }

  // --- 5. Post Button State & Submission ---
  function updatePostState() {
    if (!postBtn || !captionInput) return;
    const hasContent = captionInput.value.trim().length > 0 || photos.length > 0;
    postBtn.disabled = !hasContent;
  }

  function resetComposer() {
    if (captionInput) {
      captionInput.value = '';
      captionInput.style.height = 'auto';
    }
    taggedPeople.clear();
    renderTaggedAvatars();
    photos.length = 0;
    renderPhotos();
    setPrivacy('public');
    closePeoplePanel();
    updatePostState();
  }

  function showToast() {
    if (!toast) return;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2600);
  }

  // --- Loader Simulation ---
  function triggerLoader(callback) {
    if (!loader) {
      if (callback) callback();
      return;
    }

    loader.classList.add('active');
    let progress = 0;
    
    const interval = setInterval(() => {
      progress += 5;
      if (percentageText) percentageText.textContent = `${progress}%`;

      if (ringFill) {
        // Calculate stroke-dashoffset for SVG circular ring
        const circumference = 2 * Math.PI * 90; // r=90
        const offset = circumference - (progress / 100) * circumference;
        ringFill.style.strokeDashoffset = offset;
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          loader.classList.remove('active');
          if (callback) callback();
        }, 300);
      }
    }, 50);
  }

  if (postBtn) {
    postBtn.addEventListener('click', () => {
      if (postBtn.disabled) return;
      triggerLoader(() => {
        resetComposer();
        showToast();
      });
    });
  }

  // --- 6. Global Click-Outside & Keyboard Event Handling ---
  document.addEventListener('click', (e) => {
    if (privacyControl && !privacyControl.contains(e.target)) {
      privacyControl.classList.remove('open');
    }

    if (peoplePanel && tagPeopleBtn && !peoplePanel.contains(e.target) && !tagPeopleBtn.contains(e.target)) {
      closePeoplePanel();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (privacyControl) privacyControl.classList.remove('open');
      closePeoplePanel();
    }
  });

  // Init
  initPeoplePanelStructure();
  setPrivacy('public');
});
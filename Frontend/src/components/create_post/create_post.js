import { initCreatePost } from './create_post.helper.js';
import { get_my_profile } from '../../helpers/profile/profile.request';
import style from "./create_post.module.css";

export default function Create_Post(root) {
  root.innerHTML = `
    <section class="${style['composer-card']}">
        <!-- Close Button -->
        <button class="${style['close-btn']}" id="closeBtn" type="button" aria-label="Close composer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>

        <div class="${style['composer-header']}">
            <div class="${style['avatar-wrap']}" id="avatarWrap">
                <svg class="${style['aperture-ring']}" id="apertureRing" viewBox="0 0 72 72">
                    <circle class="${style['aperture-track']}" cx="36" cy="36" r="32"></circle>
                    <circle class="${style['aperture-fill']}" id="apertureFill" cx="36" cy="36" r="32"></circle>
                </svg>
                <div class="${style.avatar}" id="composerAvatarFallback">?</div>
                <img class="${style['avatar-img']}" id="composerAvatarImg" alt="" hidden>
            </div>

            <div class="${style['header-meta']}">
                <span class="${style['user-name']}" id="composerUserName">Loading...</span>
            </div>
        </div>

        <!-- Caption -->
        <textarea class="${style['caption-input']}" id="captionInput" placeholder="What's on your mind?" rows="1"></textarea>

        <div class="${style['photo-section']}">
            <!-- Hidden File Input -->
            <input type="file" id="photoInput" accept="image/*" hidden />

            <!-- Single Photo Preview -->
            <div class="${style['photo-preview']}" id="photoPreview" hidden>
                <img id="photoPreviewImage" alt="Selected photo" />
                <button class="${style['remove-photo-btn']}" id="removePhotoBtn" type="button" aria-label="Remove photo">&times;</button>
            </div>
        </div>

        <!-- Composer Toolbar -->
        <div class="${style['composer-toolbar']}">
            <button class="${style['tool-btn']}" id="addPhotoBtn" type="button">
                <svg class="${style.icon}" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.6"></rect>
                    <circle cx="8.5" cy="10" r="1.6" fill="currentColor"></circle>
                    <path d="M4 17l5-5 3.5 3.5L16 12l4 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                <span>Photo</span>
            </button>

            <button class="${style['post-btn']}" id="postBtn" type="button" disabled>
                Post
            </button>
        </div>
    </section>
  `;

  // Fetch real profile info and populate the header before wiring up events
  get_my_profile()
    .then(({ data: profile }) => {
      if (!profile) return;

      const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.username || 'You';
      const nameEl = root.querySelector('#composerUserName');
      if (nameEl) nameEl.textContent = fullName;

      const captionEl = root.querySelector('#captionInput');
      if (captionEl) captionEl.placeholder = `What's on your mind, ${profile.first_name || 'there'}?`;

      const avatarImg = root.querySelector('#composerAvatarImg');
      const avatarFallback = root.querySelector('#composerAvatarFallback');
      if (profile.profile_url && avatarImg) {
        avatarImg.src = profile.profile_url;
        avatarImg.hidden = false;
        if (avatarFallback) avatarFallback.hidden = true;
      } else if (avatarFallback) {
        const initials = `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase() || '?';
        avatarFallback.textContent = initials;
      }

      // Now that we know the real user_id, wire up the interactive behavior
      initCreatePost(root, style, profile.user_id);
    })
    .catch((error) => {
      console.error('Failed to load profile for composer:', error);
      initCreatePost(root, style, null);
    });
}
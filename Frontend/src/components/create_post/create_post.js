import { initCreatePost } from './create_post.helper.js';
import style from "./create_post.module.css";

export default function Create_Post(root, userId = 'CURRENT_USER_ID') {
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
            <div class="${style['avatar-wrap']}">
                <svg class="${style['aperture-ring']}" id="apertureRing" viewBox="0 0 72 72">
                    <circle class="${style['aperture-track']}" cx="36" cy="36" r="32"></circle>
                    <circle class="${style['aperture-fill']}" id="apertureFill" cx="36" cy="36" r="32"></circle>
                </svg>
                <div class="${style.avatar}">JS</div>
            </div>

            <div class="${style['header-meta']}">
                <span class="${style['user-name']}"> James Gabriel Santos </span>
            </div>
        </div>

        <!-- Caption -->
        <textarea class="${style['caption-input']}" id="captionInput" placeholder="What's on your mind, James?" rows="1"></textarea>

        <div class="${style['photo-section']}">
            <!-- Hidden File Input -->
            <input type="file" id="photoInput" accept="image/*" hidden />

            <button class="${style['tool-btn']}" id="addPhotoBtn" type="button">
                <svg class="${style.icon}" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.6"></rect>
                    <circle cx="8.5" cy="10" r="1.6" fill="currentColor"></circle>
                    <path d="M4 17l5-5 3.5 3.5L16 12l4 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                <span> Photo </span>
            </button>

            <!-- Single Photo Preview -->
            <div class="${style['photo-preview']}" id="photoPreview" hidden>
                <img id="photoPreviewImage" alt="Selected photo" />
                <button class="${style['remove-photo-btn']}" id="removePhotoBtn" type="button" aria-label="Remove photo"></button>
            </div>
        </div>

        <!-- Composer Toolbar -->
        <div class="${style['composer-toolbar']}">
            <button class="${style['tool-btn']}" id="addPhotoBtnBottom" type="button">
                <svg class="${style.icon}" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.6"></rect>
                    <circle cx="8.5" cy="10" r="1.6" fill="currentColor"></circle>
                    <path d="M4 17l5-5 3.5 3.5L16 12l4 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                Photo
            </button>

            <button class="${style['post-btn']}" id="postBtn" type="button" disabled>
                Post
            </button>
        </div>
    </section>
  `;

  // Attach event listeners and pass user state to helper
  initCreatePost(root, style, userId);
}
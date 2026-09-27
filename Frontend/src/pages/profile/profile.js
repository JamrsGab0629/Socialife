import Navigation from "../../components/navigation/navigation";
import Layout from "../../layouts/default/default";
import {
    get_my_profile,
    get_user_profile_stats,
    update_profile_picture,
    remove_profile_picture,
    update_cover_photo,
    remove_cover_photo
} from "../../helpers/profile/profile.request";
import { get_friend_status, send_friend_request, accept_friend_request, decline_friend_request, remove_friend } from "../../helpers/friends/friends.request";

import PicturesHelper from "./profile.pictures.helper";
import MainHelper from "./profile.main.helper";

import style from "./profile.module.css";

function renderFriendButton(status, userId) {
    const actionsEl = document.getElementById('profile-actions');
    if (!actionsEl) return;

    if (status === 'friends') {
        actionsEl.innerHTML = `<button class="${style["btn-primary"]}" data-friend-action="remove">Friends ✓</button>`;
    } else if (status === 'pending_sent') {
        actionsEl.innerHTML = `<button class="${style["btn-primary"]}" disabled>Requested</button>`;
    } else if (status === 'pending_received') {
        actionsEl.innerHTML = `
            <button class="${style["btn-primary"]}" data-friend-action="accept">Accept</button>
            <button class="${style["btn-primary"]}" data-friend-action="decline">Decline</button>
        `;
    } else {
        actionsEl.innerHTML = `<button class="${style["btn-primary"]}" data-friend-action="add">Add Friend</button>`;
    }

    actionsEl.querySelectorAll('[data-friend-action]').forEach((btn) => {
        btn.addEventListener('click', async () => {
            const action = btn.dataset.friendAction;
            btn.disabled = true;

            try {
                if (action === 'add') {
                    await send_friend_request(userId);
                    renderFriendButton('pending_sent', userId);
                } else if (action === 'accept') {
                    await accept_friend_request(userId);
                    renderFriendButton('friends', userId);
                } else if (action === 'decline') {
                    await decline_friend_request(userId);
                    renderFriendButton('none', userId);
                } else if (action === 'remove') {
                    await remove_friend(userId);
                    renderFriendButton('none', userId);
                }
            } catch (error) {
                console.error(`Failed friend action "${action}":`, error);
                btn.disabled = false;
            }
        });
    });
}

export default async function Profile(params){
    const { navigation, main } = Layout(this.root);
    const routeUserId = params?.userId;

    Navigation(navigation);
    main.innerHTML = `
        <div id="profile" class="${style['profile']}">
            <section class="${style["banner"]}" id="profile-banner">
                <button type="button" class="${style["cover-edit-btn"]}" id="cover-edit-btn" aria-label="Change cover photo" hidden>
                    <img src="/icon/edit_profile.svg" alt="">
                    <span>Edit cover photo</span>
                </button>
                <div class="${style["cover-menu-popover"]}" id="cover-menu" hidden>
                    <button type="button" id="cover-upload-option">Upload new photo</button>
                    <button type="button" id="cover-remove-option">Remove photo</button>
                </div>
                <input type="file" id="cover-input" accept="image/png,image/jpeg,image/webp" hidden>
            </section>

            <section class="${style["profile-header"]}">
                <div class="${style["profile-avatar"]}">
                    <img id="profile-avatar-img" src="/icon/user-avatar.svg" alt="Profile picture">
                    <button type="button" class="${style["avatar-edit-btn"]}" id="avatar-edit-btn" aria-label="Change profile photo" hidden>
                        <img src="/icon/edit_profile.svg" alt="">
                    </button>
                    <div class="${style["avatar-menu-popover"]}" id="avatar-menu" hidden>
                        <button type="button" id="avatar-upload-option">Upload new photo</button>
                        <button type="button" id="avatar-remove-option">Remove photo</button>
                    </div>
                    <input type="file" id="profile-avatar-input" accept="image/png,image/jpeg,image/webp" hidden>
                </div>
                <div class="${style["profile-info"]}">
                    <h1 id="profile-name">Loading...</h1>
                    <div class="${style["friends-count"]}" id="profile-friends-count"></div>
                </div>
                <div class="${style["profile-actions"]}" id="profile-actions"></div>
            </section>

            <nav class="${style["profile-tabs"]}" id="desktop-tabs">
                <button class="${style["tab"]} ${style["active"]}" role="tab" aria-selected="true" data-tab="all">All</button>
                <button class="${style["tab"]}" role="tab" aria-selected="false" data-tab="photos">Photos</button>
            </nav>

            <div class="${style["tab-content"]} ${style["active"]}" id="tab-all">
                <div class="${style["all-tab-grid"]}">

                                                           <div class="${style["photos-section"]}">
                        <div class="${style["photos-header"]}">
                            <h3>Photos</h3>
                            <button type="button" id="see-all-photos-lnk">See all photos ></button>
                        </div>
                        <div class="${style["photos-grid"]}" id="all-photos-preview"></div>

                        <div class="${style["about-section"]}" id="about-section">
                            <h3>About</h3>
                            <div class="${style["about-row"]}">
                                <img src="../../icons/cake.svg" alt="">
                                <span id="about-birthdate"></span>
                            </div>
                            <div class="${style["about-row"]}">
                                <img src="../../icons/calendar.svg" alt="">
                                <span id="about-joined"></span>
                            </div>
                        </div>
                    </div>

                    <div class="${style["posts-column"]}" id="posts-column"></div>
                </div>
            </div>
                        <div class="${style["tab-content"]}" id="tab-photos">
                <div class="${style["photos-grid"]} ${style["master-grid"]}" id="master-photos-grid"></div>
            </div>
        </div>

        <dialog id="share-post-dialog" class="${style['share-dialog']}">
            <form method="dialog" data-share-post-form>
                <h2>Share post</h2>
                <textarea data-share-caption maxlength="500" placeholder="Add a caption (optional)"></textarea>
                <p data-share-error hidden></p>
                <div class="${style['share-dialog-actions']}">
                    <button type="button" data-action="close-share-dialog">Cancel</button>
                    <button type="submit" data-share-submit>Share</button>
                </div>
            </form>
        </dialog>
    
    `;

    // --- Tab switching (All / Photos) ---
    const tabButtons = main.querySelectorAll(`.${style["tab"]}`);
    const tabContents = {
        all: document.getElementById('tab-all'),
        photos: document.getElementById('tab-photos'),
    };

    function switchTab(tabName) {
        tabButtons.forEach((btn) => {
            const isActive = btn.dataset.tab === tabName;
            btn.classList.toggle(style.active, isActive);
            btn.setAttribute('aria-selected', String(isActive));
        });

        Object.entries(tabContents).forEach(([name, el]) => {
            if (el) el.classList.toggle(style.active, name === tabName);
        });
    }

    tabButtons.forEach((btn) => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    const seeAllPhotosLink = document.getElementById('see-all-photos-lnk');
    if (seeAllPhotosLink) {
        seeAllPhotosLink.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab('photos');
        });
    }

    try {
        const { data: myProfile } = await get_my_profile();
        const myUserId = myProfile?.user_id;

        const isOwnProfile = !routeUserId || routeUserId === myUserId;
        const profile = isOwnProfile ? myProfile : (await get_user_profile_stats(routeUserId))?.data;

        const userId = isOwnProfile ? myUserId : routeUserId;

        if (!userId) {
            console.error("No user_id resolved for profile view:", profile);
            return;
        }

        const nameEl = document.getElementById('profile-name');
        if (nameEl) nameEl.textContent = `${profile.first_name} ${profile.last_name}`;

        const friendsEl = document.getElementById('profile-friends-count');
        if (friendsEl) friendsEl.textContent = `${profile.friend_count ?? 0} friends`;

                const birthdateEl = document.getElementById('about-birthdate');
        if (birthdateEl) {
            if (profile.birth_date) {
                const date = new Date(profile.birth_date);
                birthdateEl.textContent = `Born ${date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}`;
            } else {
                birthdateEl.textContent = 'Birthday not set';
            }
        }

        const joinedEl = document.getElementById('about-joined');
        if (joinedEl && profile.created_at) {
            const joinedDate = new Date(profile.created_at);
            joinedEl.textContent = `Joined ${joinedDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}`;
        }

        const avatarEl = document.getElementById('profile-avatar-img');
        if (avatarEl && profile.profile_url) avatarEl.src = profile.profile_url;

        const bannerEl = document.getElementById('profile-banner');
        if (bannerEl && profile.cover_url) {
            bannerEl.style.backgroundImage = `url("${profile.cover_url}")`;
            bannerEl.style.backgroundSize = "cover";
            bannerEl.style.backgroundPosition = "center";
        }

        // --- Avatar / cover editing only shown on your own profile ---
        const avatarEditBtn = document.getElementById('avatar-edit-btn');
        const coverEditBtn = document.getElementById('cover-edit-btn');

        if (isOwnProfile) {
            if (avatarEditBtn) avatarEditBtn.hidden = false;
            if (coverEditBtn) coverEditBtn.hidden = false;

            const avatarMenu = document.getElementById('avatar-menu');
            const avatarInput = document.getElementById('profile-avatar-input');
            const uploadOption = document.getElementById('avatar-upload-option');
            const removeOption = document.getElementById('avatar-remove-option');

            if (avatarEditBtn && avatarMenu) {
                avatarEditBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    avatarMenu.hidden = !avatarMenu.hidden;
                });
            }

            if (uploadOption && avatarInput) {
                uploadOption.addEventListener('click', () => {
                    avatarMenu.hidden = true;
                    avatarInput.click();
                });
            }

            if (avatarInput) {
                avatarInput.addEventListener('change', async () => {
                    const file = avatarInput.files[0];
                    if (!file) return;

                    const caption = window.prompt("Add a caption (optional):", "") || "";

                    const formData = new FormData();
                    formData.append('image', file);
                    formData.append('caption', caption);

                    try {
                        const { data } = await update_profile_picture(formData);
                        if (data?.profile_url) avatarEl.src = data.profile_url;
                    } catch (error) {
                        console.error("Failed to update profile picture:", error);
                    }
                });
            }

            if (removeOption) {
                removeOption.addEventListener('click', async () => {
                    avatarMenu.hidden = true;
                    try {
                        await remove_profile_picture();
                        avatarEl.src = "/icon/user-avatar.svg";
                    } catch (error) {
                        console.error("Failed to remove profile picture:", error);
                    }
                });
            }

            const coverMenu = document.getElementById('cover-menu');
            const coverInput = document.getElementById('cover-input');
            const coverUploadOption = document.getElementById('cover-upload-option');
            const coverRemoveOption = document.getElementById('cover-remove-option');

            if (coverEditBtn && coverMenu) {
                coverEditBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    coverMenu.hidden = !coverMenu.hidden;
                });
            }

            if (coverUploadOption && coverInput) {
                coverUploadOption.addEventListener('click', () => {
                    coverMenu.hidden = true;
                    coverInput.click();
                });
            }

            if (coverInput) {
                coverInput.addEventListener('change', async () => {
                    const file = coverInput.files[0];
                    if (!file) return;

                    const caption = window.prompt("Add a caption (optional):", "") || "";

                    const formData = new FormData();
                    formData.append('image', file);
                    formData.append('caption', caption);

                    try {
                        const { data } = await update_cover_photo(formData);
                        if (data?.cover_url && bannerEl) {
                            bannerEl.style.backgroundImage = `url("${data.cover_url}")`;
                            bannerEl.style.backgroundSize = "cover";
                            bannerEl.style.backgroundPosition = "center";
                        }
                    } catch (error) {
                        console.error("Failed to update cover photo:", error);
                    }
                });
            }

            if (coverRemoveOption) {
                coverRemoveOption.addEventListener('click', async () => {
                    coverMenu.hidden = true;
                    try {
                        await remove_cover_photo();
                        if (bannerEl) bannerEl.style.backgroundImage = "";
                    } catch (error) {
                        console.error("Failed to remove cover photo:", error);
                    }
                });
            }

            document.addEventListener('click', () => {
                if (avatarMenu) avatarMenu.hidden = true;
                if (coverMenu) coverMenu.hidden = true;
            });
        } else {
            try {
                const { data } = await get_friend_status(userId);
                renderFriendButton(data?.status || 'none', userId);
            } catch (error) {
                console.error("Failed to load friend status:", error);
            }
        }

        PicturesHelper(userId);
        MainHelper(userId);
    } catch (error) {
        console.error("Failed to load profile:", error);
    }
}
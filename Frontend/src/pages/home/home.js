import Navigation from '../../components/navigation/navigation';
import Layout from '../../layouts/default/default';

import style from './home.module.css';
import style_topbar_search from "../../styles/app/topbar-search.module.css";
import Helper, { FriendsTemplate, initComposerOverlay, initCommentInteractions, initSharePostDialog, initFriendRecommendations, applyCurrentUserAvatar } from './home.helper';
import Service, { fetchHomeFeedService } from './home.service';
import Post from '../../components/post/post';
import { openPostViewer } from '../../components/post-viewer/post-viewer';
import { deactivate_post } from '../../helpers/post/post.request';
import { InfiniteScroll } from '../../helpers/utils/InfiniteScroll'; 
import { getNotifications } from '../../components/notification/notification.service';
import { search_users } from '../../helpers/profile/profile.request';

const postDataStore = new Map();

export default async function Home() {
    const { navigation, main } = Layout(this.root);

    Navigation(navigation);
    main.innerHTML = `
        <div id="main-feed" class="${style['main-feed']}">
            <div class="${style_topbar_search["topbar"]}">
                <div class="${style_topbar_search["search-box"]}">
                    <img width="18px" height="18px" src="/icon/search.svg" alt="search">
                    <input type="text" class="${style_topbar_search["search-input"]}" placeholder="Hinted search text">
                </div>

                <a action-button="timeline" class="${style_topbar_search["icon-btn"]}" href="/app/timeline">
                    <span class="${style_topbar_search["icon-dot"]}" data-notification-count hidden></span>
                  <img width="30px" src="/icon/bell.svg" class="${style_topbar_search['bell-icon']}" alt="bell">
                </a>
            </div>
            
            <div id="feed-container">
                <div id="composer-trigger" class="${style['onmind']}" style="cursor: pointer;">
                    <div class="${style['composer-label']}">What's on your mind?</div>
                    <div class="${style['composer-box']}">Write something...</div>
                </div>
            </div>
            <div id="feed-sentinel" style="height: 20px;"></div>
        </div>

        <div class="${style["right-col"]}">
            <div class="${style["recommend-box"]}">
                <div class="${style["recommend-title"]}">Friend Recommendations</div>
                <div id="friend-list"></div>
            </div>
        </div>

        <!-- Overlay Modal Container -->
        <div id="composer-overlay-backdrop" class="${style['overlay-backdrop']}" hidden>
            <div id="composer-overlay-container" class="${style['overlay-modal']}"></div>
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

    Helper();
    initComposerOverlay(); // Bind overlay event listener

    // --- Search bar wiring (must run AFTER main.innerHTML so the elements exist) ---
    const searchInput = main.querySelector(`.${style_topbar_search["search-input"]}`);
    const searchBox = main.querySelector(`.${style_topbar_search["search-box"]}`);
    let searchResultsEl = null;
    let searchDebounceTimer = null;

    function renderSearchResults(users) {
        if (!searchResultsEl) return;

        if (users.length === 0) {
            searchResultsEl.innerHTML = `<div class="${style_topbar_search["search-empty"]}">No users found.</div>`;
            searchResultsEl.hidden = false;
            return;
        }

        searchResultsEl.innerHTML = users.map(user => `
            <a href="/app/profile/${user.user_id}" class="${style_topbar_search["search-result-item"]}">
                <img src="${user.profile_url || '/icon/user-avatar.svg'}" alt="${user.username}" onerror="this.src='/icon/user-avatar.svg'">
                <span>${user.username}</span>
            </a>
        `).join("");
        searchResultsEl.hidden = false;
    }

    if (searchInput && searchBox) {
        searchResultsEl = document.createElement('div');
        searchResultsEl.className = style_topbar_search["search-results"];
        searchResultsEl.hidden = true;
        searchBox.appendChild(searchResultsEl);

        searchInput.addEventListener('input', () => {
            clearTimeout(searchDebounceTimer);
            const query = searchInput.value.trim();

            if (!query) {
                searchResultsEl.hidden = true;
                searchResultsEl.innerHTML = "";
                return;
            }

            searchDebounceTimer = setTimeout(async () => {
                try {
                    const { data } = await search_users(query);
                    renderSearchResults(data || []);
                } catch (error) {
                    console.error("Search failed:", error);
                }
            }, 300);
        });

        document.addEventListener('click', (e) => {
            if (!searchBox.contains(e.target)) {
                searchResultsEl.hidden = true;
            }
        });
    }

    const feedContainer = document.getElementById('feed-container');
    const sentinel = document.getElementById('feed-sentinel');

    // Initialize comment interactions using event delegation on the feed container
    initCommentInteractions(feedContainer);
    initSharePostDialog();

    postDataStore.clear();

    // Open the zoomed post viewer when a post photo is clicked, and handle post deletion
    feedContainer.addEventListener('click', async (event) => {
        const zoomTarget = event.target.closest('[data-action="zoom-photo"]');
        if (zoomTarget) {
            const postId = zoomTarget.dataset.postId;
            const postData = postDataStore.get(postId);
            if (postData) openPostViewer(postData);
            return;
        }

        const deleteTarget = event.target.closest('[data-action="delete-post"]');
        if (deleteTarget) {
            const postId = deleteTarget.dataset.postId;
            if (!window.confirm("Delete this post?")) return;

            try {
                await deactivate_post(postId);
                const card = document.getElementById(postId);
                if (card) card.remove();
                postDataStore.delete(postId);
            } catch (error) {
                console.error("Failed to delete post:", error);
            }
        }
    });

    // Keep feed cards' like/comment counts in sync with the zoomed viewer
    window.addEventListener('post:liked', (event) => {
        const { postId, likeCount, isLiked } = event.detail || {};
        const card = document.getElementById(postId);
        if (!card) return;

        const likeCountEl = card.querySelector('.like-count');
        if (likeCountEl) likeCountEl.textContent = likeCount;

        const likeBtn = card.querySelector('[data-action="like"]');
        if (likeBtn) {
            likeBtn.setAttribute('aria-pressed', String(isLiked));
            likeBtn.classList.toggle('liked', isLiked);
        }
    });

    window.addEventListener('post:commented', (event) => {
        const { postId, commentCount } = event.detail || {};
        const card = document.getElementById(postId);
        if (!card) return;

        const commentCountEl = card.querySelector('.comment-count');
        if (commentCountEl) commentCountEl.textContent = commentCount;
    });

    new InfiniteScroll({
        container: feedContainer,
        sentinel: sentinel,
        limit: 10,
        loadMore: async ({ page, limit }) => {
            return await fetchHomeFeedService(page, limit);
        },
       renderItems: (posts, container) => {
    posts.forEach((postData) => {
        const postId = postData.post_id || postData.id || postData.feed_id;
        if (postId) postDataStore.set(String(postId), postData);

        const postMarkup = Post(postData, { showSave: true });
        container.insertAdjacentHTML('beforeend', postMarkup);
    });
    applyCurrentUserAvatar(container);
}
    });

    // Prepend newly created post immediately at the top of the feed
    window.addEventListener('post:created', (event) => {
    const newPost = event.detail;
    if (!newPost) return;

    const postId = newPost.post_id || newPost.id || newPost.feed_id;
    if (postId) postDataStore.set(String(postId), newPost);

    const postMarkup = Post(newPost, { showSave: true });
    const composerTrigger = document.getElementById('composer-trigger');
    if (composerTrigger) {
        composerTrigger.insertAdjacentHTML('afterend', postMarkup);
        applyCurrentUserAvatar(feedContainer);
    }
});

    const [friends_data, notificationResult] = await Promise.all([
        Service(),
        getNotifications().catch(() => null),
    ]);
    const friendListEl = document.getElementById('friend-list');
    friendListEl.innerHTML = FriendsTemplate(friends_data);
    initFriendRecommendations(friendListEl);

    const unreadCount = (notificationResult?.data || []).filter((notification) => !notification.is_read).length;
    const notificationBadge = document.querySelector('[data-notification-count]');
    if (notificationBadge && unreadCount > 0) {
        notificationBadge.textContent = String(unreadCount);
        notificationBadge.hidden = false;
    }
}
import Post from "../../components/post/post";
import { get_profile_feed, deactivate_post } from "../../helpers/post/post.request";
import mapFeedItemToPostData from "./profile.main.mapper";
import { openPostViewer } from "../../components/post-viewer/post-viewer";
import { initCommentInteractions, initSharePostDialog, applyCurrentUserAvatar } from "../home/home.helper";
import { InfiniteScroll } from "../../helpers/utils/InfiniteScroll";

const postDataStore = new Map();

export const Helper = async (userId) => {
    const root = document.getElementById("posts-column");
    if (!root) return;

    initCommentInteractions(root);
    initSharePostDialog();

    root.addEventListener("click", async (event) => {
        const zoomTarget = event.target.closest('[data-action="zoom-photo"]');
        if (zoomTarget) {
            const postId = zoomTarget.dataset.postId;
            const postData = postDataStore.get(String(postId));
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
                postDataStore.delete(String(postId));
            } catch (error) {
                console.error("Failed to delete post:", error);
            }
        }
    });

    window.addEventListener("post:liked", (event) => {
        const { postId, likeCount, isLiked } = event.detail || {};
        const card = document.getElementById(postId);
        if (!card) return;

        const likeCountEl = card.querySelector(".like-count");
        if (likeCountEl) likeCountEl.textContent = likeCount;

        const likeBtn = card.querySelector('[data-action="like"]');
        if (likeBtn) {
            likeBtn.setAttribute("aria-pressed", String(isLiked));
            likeBtn.classList.toggle("liked", isLiked);
        }
    });

    window.addEventListener("post:commented", (event) => {
        const { postId, commentCount } = event.detail || {};
        const card = document.getElementById(postId);
        if (!card) return;

        const commentCountEl = card.querySelector(".comment-count");
        if (commentCountEl) commentCountEl.textContent = commentCount;
    });

    postDataStore.clear();
    root.innerHTML = "";

    let sentinel = document.getElementById('profile-feed-sentinel');
    if (!sentinel) {
        sentinel = document.createElement('div');
        sentinel.id = 'profile-feed-sentinel';
        sentinel.style.height = '20px';
        root.insertAdjacentElement('afterend', sentinel);
    }

    new InfiniteScroll({
        container: root,
        sentinel,
        limit: 10,
        loadMore: async ({ page, limit }) => {
            return await get_profile_feed(userId, page, limit);
        },
        renderItems: (items, container) => {
    items.forEach((item) => {
        const mapped = mapFeedItemToPostData(item);
        const postId = mapped.post_id || mapped.id;
        if (postId) postDataStore.set(String(postId), mapped);

        const postMarkup = Post(mapped, { showSave: true });
        container.insertAdjacentHTML("beforeend", postMarkup);
    });
    applyCurrentUserAvatar(root); // add this line
}
    });
};

export default Helper;
import Post from "../../components/post/post";
import { get_profile_feed, deactivate_post } from "../../helpers/post/post.request";
import mapFeedItemToPostData from "./profile.main.mapper";
import { openPostViewer } from "../../components/post-viewer/post-viewer";

const postDataStore = new Map();

export const Helper = async (userId) => {
    const root = document.getElementById('posts-column');
    if (!root) return;

    root.addEventListener('click', async (event) => {
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

    try {
        const { data } = await get_profile_feed(userId);

        if (!data || data.length === 0) return;

        postDataStore.clear();

        const mappedPosts = data.map(item => {
            const mapped = mapFeedItemToPostData(item);
            const postId = mapped.post_id || mapped.id;
            if (postId) postDataStore.set(String(postId), mapped);
            return mapped;
        });

        root.innerHTML = mappedPosts
            .map(postData => Post(postData, { showSave: true }))
            .join("");
    } catch (error) {
        console.error("Failed to load profile feed:", error);
    }
};

export default Helper;
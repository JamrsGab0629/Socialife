import style from "./profile.module.css";
import Service from "./profile.pictures.service";
import { get_post_by_id } from "../../helpers/post/post.request";
import { openPostViewer } from "../../components/post-viewer/post-viewer";

const renderPhotos = (photos) => {
    return photos.map((photo) => `
        <div class="${style["photo-thumb"]}" data-post-id="${photo["post_id"] || photo["post"]?.post_id || ""}">
            <img src="${photo["href"]}" alt="post photo">
        </div>
    `).join("");
}

async function handlePhotoClick(event) {
    const thumb = event.target.closest(`.${style["photo-thumb"]}`);
    if (!thumb) return;

    const postId = thumb.dataset.postId;
    if (!postId) return;

    try {
        const { data: post } = await get_post_by_id(postId);
        if (post) openPostViewer(post);
    } catch (error) {
        console.error("Failed to open post from photo:", error);
    }
}

export const Helper = async (userId) => {
    const photos = await Service(userId);

    if (!Array.isArray(photos) || photos.length === 0) return;

    const preview = document.getElementById('all-photos-preview');
    if (preview) {
        preview.innerHTML = renderPhotos(photos.slice(0, 6));
        preview.addEventListener('click', handlePhotoClick);
    }

    const master = document.getElementById('master-photos-grid');
    if (master) {
        master.innerHTML = renderPhotos(photos);
        master.addEventListener('click', handlePhotoClick);
    }
}

export default Helper;
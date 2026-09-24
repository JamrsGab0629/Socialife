import style from "./profile.module.css";
import Service from "./profile.pictures.service";

const renderPhotos = (photos) => {
    return photos.map((photo) => `
        <div class="${style["photo-thumb"]}">
            <img src="${photo["href"]}" alt="post photo">
        </div>
    `).join("");
}

export const Helper = async (userId) => {
    const photos = await Service(userId);

    if (!Array.isArray(photos) || photos.length === 0) return;

    const preview = document.getElementById('all-photos-preview');
    if (preview) preview.innerHTML = renderPhotos(photos.slice(0, 6));

    const master = document.getElementById('master-photos-grid');
    if (master) master.innerHTML = renderPhotos(photos);
}

export default Helper;
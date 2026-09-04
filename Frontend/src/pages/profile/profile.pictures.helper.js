import style from "./profile.module.css";
import Service from "./profile.pictures.service";

const renderPhotos = (photos) => {
    return photos.map((photo) => `
        <div class="${style["photo-thumb"]}">
            <img src="${photo["photo_url"]}" alt="${photo["photo_alt"]}">
        </div>
    `).join("");
}

export const Helper = async () => {
    const data = await Service();

    if (Object.keys(data).length === 0) return;

    const avatar = document.getElementById('profile-avatar-img');
    if (avatar && data["avatar_url"]) {
        avatar.src = data["avatar_url"];
        avatar.alt = data["avatar_alt"] || avatar.alt;
    }

    const photos = data["photos"] || [];

    const preview = document.getElementById('all-photos-preview');
    if (preview) preview.innerHTML = renderPhotos(photos.slice(0, 6));

    const master = document.getElementById('master-photos-grid');
    if (master) master.innerHTML = renderPhotos(photos);
}

export default Helper;

import Post from "../../components/post/post";
import { get_profile_feed } from "../../helpers/post/post.request";
import mapFeedItemToPostData from "./profile.main.mapper";

export const Helper = async (userId) => {
    const root = document.getElementById('posts-column');
    if (!root) return;

    try {
        const { data } = await get_profile_feed(userId);
        console.log("profile feed data:", data);

        if (!data || data.length === 0) return;

        root.innerHTML = data
            .map(item => Post(mapFeedItemToPostData(item), { showSave: true }))
            .join("");
    } catch (error) {
        console.error("Failed to load profile feed:", error);
    }
};

export default Helper;
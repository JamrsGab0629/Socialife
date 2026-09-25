import { fetchHomeFeed } from "../../helpers/utils/home.fetch.js";
import { get_friend_suggestions } from "../../helpers/friends/friends.request";

export const Service = async () => {
    try {
        const { data } = await get_friend_suggestions();
        return data || [];
    } catch (error) {
        console.error("Failed to fetch friend recommendations:", error);
        return [];
    }
};

export const fetchHomeFeedService = async (page = 1, limit = 10) => {
    return await fetchHomeFeed(page, limit);
};

export default Service;
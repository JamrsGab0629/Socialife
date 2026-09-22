import Fetch from "../../core/fetch";
import { fetchHomeFeed } from "../../helpers/utils/home.fetch.js";

export const Service = async () => {
    return await Fetch('/api/friends.temp.json') || [];
};

export const fetchHomeFeedService = async (page = 1, limit = 10) => {
    return await fetchHomeFeed(page, limit);
};

export default Service;
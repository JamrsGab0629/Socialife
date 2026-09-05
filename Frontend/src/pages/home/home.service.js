import Fetch from "../../core/fetch";
import Request from "../../core/request";

export const Service = async () => {
    return await Fetch('/api/friends.temp.json') || [];
};

export const fetchHomeFeedService = async (page = 1, limit = 10) => {
    return await Request({
        param: "/posts",
        method: "GET",
        args: { page, limit }
    });
};

export default Service;
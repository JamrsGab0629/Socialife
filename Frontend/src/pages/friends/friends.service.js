import Fetch from "../../core/fetch";

export const Service = async () => {
    return await Fetch('/api/friends.temp.json') || [];
}

export default Service;

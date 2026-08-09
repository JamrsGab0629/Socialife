import Fetch from "../../core/fetch";

export const Service = async () => {
    return await Fetch('/api/content.temp.json') || {};
}

export default Service;
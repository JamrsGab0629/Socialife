import Fetch from "../../core/fetch";

export const Service = async () => {
    return await Fetch("/api/timeline.temp.json") || [];
}

export default Service;
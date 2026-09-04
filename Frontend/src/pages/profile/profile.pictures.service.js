import Fetch from "../../core/fetch";

export const Service = async () => {
    return await Fetch('/api/profile-pictures.temp.json') || {};
}

export default Service;

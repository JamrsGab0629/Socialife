import Request from "../../core/request";

export const Service = async (userId) => {
    try {
        const response = await Request({
            param: `/posts/user/${userId}/photos`,
            method: "GET",
            args: {},
        });
        return response?.data || {};
    } catch (error) {
        console.error("Failed to fetch profile photos:", error);
        return {};
    }
}

export default Service;
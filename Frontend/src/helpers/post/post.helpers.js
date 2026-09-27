import Request from "../../core/request";

export async function get_my_profile() {
    try {
        const response = await Request({
            param: '/profiles/me', 
            method: 'GET',
            args: {}
        });
        return response;
    } catch (error) {
        console.error("Failed to fetch profile:", error);
        throw error;
    }
}
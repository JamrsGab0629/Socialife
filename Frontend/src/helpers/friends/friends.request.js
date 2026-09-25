import Request from "../../core/request";

export async function get_friends_list() {
    try {
        return await Request({ param: `/friends`, method: "GET", args: {} });
    } catch (error) {
        console.error("Failed inside get_friends_list request helper:", error);
        throw error;
    }
}

export async function get_pending_requests() {
    try {
        return await Request({ param: `/friends/requests/pending`, method: "GET", args: {} });
    } catch (error) {
        console.error("Failed inside get_pending_requests request helper:", error);
        throw error;
    }
}

export async function get_friend_suggestions() {
    try {
        return await Request({ param: `/friends/suggestions`, method: "GET", args: {} });
    } catch (error) {
        console.error("Failed inside get_friend_suggestions request helper:", error);
        throw error;
    }
}

export async function get_friend_status(userId) {
    try {
        return await Request({ param: `/friends/status/${userId}`, method: "GET", args: {} });
    } catch (error) {
        console.error("Failed inside get_friend_status request helper:", error);
        throw error;
    }
}

export async function send_friend_request(userId) {
    try {
        return await Request({ param: `/friends/request/${userId}`, method: "POST", args: {} });
    } catch (error) {
        console.error("Failed inside send_friend_request request helper:", error);
        throw error;
    }
}

export async function accept_friend_request(userId) {
    try {
        return await Request({ param: `/friends/accept/${userId}`, method: "PATCH", args: {} });
    } catch (error) {
        console.error("Failed inside accept_friend_request request helper:", error);
        throw error;
    }
}

export async function decline_friend_request(userId) {
    try {
        return await Request({ param: `/friends/decline/${userId}`, method: "PATCH", args: {} });
    } catch (error) {
        console.error("Failed inside decline_friend_request request helper:", error);
        throw error;
    }
}

export async function remove_friend(userId) {
    try {
        return await Request({ param: `/friends/${userId}`, method: "DELETE", args: {} });
    } catch (error) {
        console.error("Failed inside remove_friend request helper:", error);
        throw error;
    }
}
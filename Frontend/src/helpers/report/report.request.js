import Request from "../../core/request";

export async function report_user(userId, message) {
    return Request({
        param: `/report`,
        method: "POST",
        args: { user_id: userId, message },
    });
}
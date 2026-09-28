import Request from "../../core/request";

export const get_share_by_id = (shareId) =>
    Request({
        param: `/posts/shares/${shareId}`,
        method: "GET",
    });
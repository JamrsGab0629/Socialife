// Frontend/src/helpers/share/share.request.js
import Request from "../../core/request"; 

export const get_share_by_id = (shareId) =>
    Request({
        param: `/shares/${shareId}`, // must match your backend route
        method: "GET",
    });
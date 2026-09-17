import Request from "../../core/request";

export async function commentMention(input) {
    /**
     * interface input = {
     *  mentions: userId[],
     *  entityId: post_id
     * }
     */
    return await Request({
        param: `/mention/`,
        method: "POST",
        args: {
            ...input,
            type: "comment"
        },
    })
}

export async function postMention(input) {
    /**
     * interface input = {
     *  mentions: userId[],
     *  entityId: post_id
     * }
     */
    return await Request({
        param: `/mention/`,
        method: "POST",
        args: {
            ...input,
            type: "post"
        },
    })
}
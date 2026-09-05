import Request from "../../core/request";

export async function post_content(args) {
    return await Request({
        param: `/posts/`,
        method: "POST",
        args: args,
    })
}

export async function like_content(args) {
    return await Request({
        param: `/posts/${args.content_id}/like`,
        method: "POST",
        args: args,
    })
}

export async function comment_content(args) {
    return await Request({
        param: `/posts/${args.content_id}/comments`,
        method: "POST",
        args: args,
    })
}
import Request from "/core/request";

export async function getPosts( status = ALL, {page = 1, limit = 10} ){
    return Request({
        param: `/admin/post/get/${status}`,
        method: "GET",
        args: {
            page, 
            limit
        }
    })
}

export async function getPostsFrom( username, {page = 1, limit = 10} ){
    return Request({
        param: `/admin/post/from/${username}`,
        methot: "GET",
        args: {
            page,
            limit
        }
    })
}

export async function viewPost( postId ){
    return Request({
        param: `/admin/post/view/${postId}`,
        methot: "GET",
        args: {}
    })
}

export async function removePost( postId ){
    return Request({
        param: `/admin/post/${postId}/remove`,
        methot: "PUT",
        args: {}
    })
}
import Request from "/core/request";

export async function getUsers( status = ALL, {page = 1, limit = 10} ){
    return Request({
        param: `/admin/user/get/${status}`,
        method: "GET",
        args: {
            page, 
            limit
        }
    })
}

export async function findUserByUsername( username ){
    return Request({
        param: `/admin/user/find/${username}`,
        methot: "GET",
        args: {}
    })
}

export async function viewUser( userId ){
    return Request({
        param: `/admin/user/view/${userId}`,
        methot: "GET",
        args: {}
    })
}

export async function toggleStatus( userId ){
    return Request({
        param: `/admin/user/${userId}`,
        methot: "PUT",
        args: {}
    })
}
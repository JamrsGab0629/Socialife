import Request from "/core/request";

export async function getTeam( status = "ALL", {page = 0, limit = 0} ){
    return Request({
        param: `/admin/team/get/${status}`,
        method: "GET",
        args: {
            page, 
            limit
        }
    })
}

export async function addMember( { userId, role = "ADMIN" } ){
    return Request({
        param: `/admin/team/add`,
        method: "POST",
        args: {
            userId,
            role
        }
    })
}

export async function updateTeam( userId, { role = "user" } ){
    return Request({
        param: `/admin/team/${userId}/role`,
        method: "PUT",
        args: {
            role
        }
    })
}
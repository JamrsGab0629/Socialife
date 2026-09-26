import Request from "/core/request";

export async function getRecentReports(args = {}){
    return Request({
        param: "/admin/report/get/ALL",
        method: "GET",
        args: {}
    })
}

export async function getReports( method = ALL, { page = 1, limit = 10 } ){
    return Request({
        param: `/admin/report/get/${method}`,
        method: "GET",
        args: {
            page, 
            limit
        }
    })
}

export async function updateReport( reportId, args = { status, severity, resolution } ){
    return Request({
        param: `/admin/${reportId}/update`,
        methot: "PUT",
        args
    })
}
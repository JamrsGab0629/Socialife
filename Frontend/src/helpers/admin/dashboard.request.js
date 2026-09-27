import Request from "/core/request";

export async function dashboard(args = {}) {
    return await Request({
        param: "/admin/dashboard",
        method: "GET",
        args: args,
    });
}
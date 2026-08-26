import Request from "/core/request"

export async function state(args) {
    const res = await Request({
        param: "/auth/state",
        method: "GET",
        args: args,
    });

    // console.log("debug.login", res);
    return res;
}
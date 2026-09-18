import Request from "/core/request";

export async function login(args) {
    const res = await Request({
        param: "/auth/login",
        method: "POST",
        args: args,
    });

    // console.log("debug.login", res);
    return res;
}

export async function signup(args) {
    return await Request({
        param: "/auth/signup",
        method: "POST",
        args: args,
    });
}

export async function verify_otp(args) {
    return await Request({
        param: "/auth/verify-otp",
        method: "POST",
        args: args,
    });
}

export async function request_otp(args) {
    return await Request({
        param: "/auth/resend-otp",
        method: "POST",
        args: args,
    });
}
export async function register(args) {
    console.log(args);
    return await Request({
        param: "/auth/register",
        method: "POST",
        args: args
    })
}

export async function logout(args = {}) {
    return await Request({
        param: "/auth/logout",
        method: "POST",
        args: args,
    });
}
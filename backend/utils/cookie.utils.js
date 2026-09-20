const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
}

const setRefreshTokenCookie = (res, token) => {
    res.cookie("refresh_token", token,{
        ...COOKIE_OPTIONS,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        path: '/'
    })
}

const setAccessTokenCookie = (res, token) => {
    res.cookie("access_token", token, {
        ...COOKIE_OPTIONS,
        maxAge : 5 * 60 * 1000,
        path: '/'
    });
};

export {
    setAccessTokenCookie,
    setRefreshTokenCookie
};
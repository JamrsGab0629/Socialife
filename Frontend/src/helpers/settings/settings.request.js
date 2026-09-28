import Request from "../../core/request";

export const changePassword = ( args = { password, new_password }) => {
    return Request({
        param: "/settings/change-password",
        method: "POST",
        args
    });
}
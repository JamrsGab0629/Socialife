import { checkAuth } from "../helpers/auth/verify.request";

export const isAuth = (component) => {
    if (typeof component !== 'function') {
        throw new Error('Component or action must be a function');
    }

    return function (...args) {
        const signupRegex = /^\/signup\/(?:(?<id>\d+))?$/i;
        const hasRedirect = typeof this?.redirect === 'function';
        const currentPath = window.location.pathname;

        return checkAuth()
            .then((res) => {
                const isAuth = Boolean(res?.success ?? res);

                if (isAuth) {
                    if (hasRedirect && (currentPath === "/login" || signupRegex.test(currentPath))) {
                        this.redirect("/app");
                        return null;
                    }
                    return component.apply(this, args);
                }

                if (hasRedirect && currentPath !== "/login") {
                    this.redirect("/login");
                    return null;
                }

                return component.apply(this, args);
            })
            .catch((err) => {
                return component.apply(this, args);
            });
    };
};

export default isAuth;
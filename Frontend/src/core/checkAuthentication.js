import * as authHelper from "../helpers/auth/verify.request";

export const checkAuth = (component) => {
    return function (...args) {
        if (typeof component !== 'function') {
            throw new Error('Component must be a function');
        }

        const currentPath = window.location.pathname;
        const hasRedirect = typeof this?.redirect === 'function';

        return authHelper.checkAuth()
            .then((isAuth) => {
                const authenticated = Boolean(isAuth?.success ?? isAuth);

                // 1. If authenticated, allow access directly to the protected component
                if (authenticated) {
                    return component.apply(this, args);
                }

                // 2. If NOT authenticated and not already on /login, redirect to /login
                if (currentPath !== "/login") {
                    if (hasRedirect) this.redirect("/login");
                    return null;
                }

                // If unauthenticated and already on /login, render the login component
                return component.apply(this, args);
            })
            .catch((err) => {
                console.error("Authentication check failed:", err);
                
                // Fallback: Redirect to /login on error if not already there
                if (currentPath !== "/login" && hasRedirect) {
                    this.redirect("/login");
                    return null;
                }
                
                return null;
            });
    };
};

export default checkAuth;
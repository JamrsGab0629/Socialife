import * as authHelper from "../helpers/auth/verify.request";

export const checkAdmin = (component) => {
    return function (...args) {
        if (typeof component !== 'function') {
            throw new Error('Component must be a function');
        }

        const currentPath = window.location.pathname;
        const hasRedirect = typeof this?.redirect === 'function';

        return authHelper.checkAdmin()
            .then((res) => {
                const isAdmin = Boolean(res?.success ?? false);

                // 1. If checkAdmin() returned success: true -> Allow access
                if (isAdmin) {
                    return component.apply(this, args);
                }

                // 2. If success is false -> Alert and redirect to /app
                alert("You are not an admin");
                
                if (hasRedirect) {
                    this.redirect("/app");
                } else {
                    window.location.href = "/app";
                }
                
                return null;
            })
            .catch((err) => {
                console.error("Admin verification check failed:", err);
                
                alert("You are not an admin");
                
                if (hasRedirect) {
                    this.redirect("/app");
                } else {
                    window.location.href = "/app";
                }

                return null;
            });
    };
};

export default checkAdmin;
import { isAuthenticated } from "../helpers/auth/verify.request";

export const Authenticated = (component) => {
    if (typeof component !== 'function') {
        throw new Error('Component or action must be a function');
    }

    return function(...args) {
        // Asynchronously check backend authentication in the background
        isAuthenticated()
            .then((isAuth) => {
                if (isAuth && this?.redirect === 'function') {
                    this.redirect("/app");
                }
            })
            .catch((err) => {
                // Guard for repeated going to login when your already in login
                const currentPath = window.location.pathname;

                console.error("Authentication error:", err);
                if (typeof this?.redirect === 'function' && currentPath !== "/login") {
                    this.redirect("/login");
                }
            });

        // Synchronously return execution of component with full arguments and context
        return component.apply(this, args);
    };
};

export default Authenticated;
import { getEmail } from "/core/email.state";
import { state } from "../helpers/auth/verify.request";

export const Authentication = (component, params) => {
    return function (...args) {
        if (typeof component !== 'function') {
            throw new Error('component must be a function');
        }

        const { isLoginRequired, isSignup } = params || {};
        const email = getEmail();
        const currentPath = window.location.pathname;

        // 1. Unauthenticated or missing email checks
        if (!email) {
            if (isLoginRequired && currentPath !== "/login") {
                this.redirect("/login");
                return Promise.resolve();
            }

            if (isSignup) {
                if (currentPath !== "/signup/1") {
                    this.redirect("/signup/1");
                    return Promise.resolve();
                }
                // Already on /signup/1 with no email: safely render step 1 component
                return Promise.resolve(component.apply(this, args));
            }
        }

        // 2. Fetch status for authenticated/entered email
        return state({ email })
            .then((res) => {
                // Declare data FIRST before using it
                const data = res?.data || res || {};
                console.log("debug.authentication:", data);

                return {
                    is_verified: Boolean(data.is_verified),
                    is_completed: Boolean(data.is_completed)
                };
            })
            .catch((err) => {
                // Log the caught error so syntax/runtime issues aren't hidden
                console.error("Authentication check failed:", err);
                return { is_verified: false, is_completed: false };
            })
            .then(({ is_verified, is_completed }) => {
                // 3. Prevent redirecting to current page to avoid loops
                if (!is_verified) {
                    if (currentPath !== "/signup/2") {
                        this.redirect("/signup/2");
                    } else {
                        // Already on /signup/2: render step 2 component
                        return component.apply(this, args);
                    }
                    return;
                }

                if (!is_completed) {
                    if (currentPath !== "/signup/3") {
                        this.redirect("/signup/3");
                    } else {
                        // Already on /signup/3: render step 3 component
                        return component.apply(this, args);
                    }
                    return;
                }

                // If fully verified & completed, execute the requested component
                return component.apply(this, args);
            });
    };
};

export default Authentication;
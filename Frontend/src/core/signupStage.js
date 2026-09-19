import { getEmail } from "/core/email.state";
import { state } from "../helpers/auth/verify.request";

export const SignupStage = (component) => {
    if (typeof component !== 'function') {
        throw new Error('Component must be a function');
    }

    return function (...args) {
        const currentPath = window.location.pathname;
        const redirect = (path) => typeof this?.redirect === 'function' && currentPath !== path && this.redirect(path);

        const email = getEmail();

        // Stage 1: No email entered yet
        if (!email) {
            redirect("/signup/1");
            return currentPath === "/signup/1" ? component.apply(this, args) : null;
        }

        // Fetch onboarding progress for active email
        return state({ email })
            .then((res) => {
                const data = res?.data || res || {};
                const isVerified = Boolean(data.is_verified);
                const isCompleted = Boolean(data.is_completed);

                // Stage 2: Verification required
                if (!isVerified) {
                    redirect("/signup/2");
                    return currentPath === "/signup/2" ? component.apply(this, args) : null;
                }

                // Stage 3: Account setup required
                if (!isCompleted) {
                    redirect("/signup/3");
                    return currentPath === "/signup/3" ? component.apply(this, args) : null;
                }

                // Onboarding finished -> main app
                redirect("/app");
                return null;
            })
            .catch((err) => {
                console.error("Signup Stage check failed:", err);
                redirect("/signup/1");
                return null;
            });
    };
};

export default SignupStage;
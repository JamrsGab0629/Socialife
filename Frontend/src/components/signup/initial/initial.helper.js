import { signup$ } from "../../../validators/user.validators";
import { signup } from "../../../helpers/auth/users.request";
import { setEmail } from "/core/email.state"; // Imported state setter

const on_success = (gmail) => {
    setEmail(gmail);
}

const getErrorMessage = (error) => {
    if (!navigator.onLine || error?.code === "ERR_NETWORK" || error?.message?.includes("Network Error")) {
        return "Network connection lost. Please check your internet connection and try again.";
    }

    if (error?.response) {
        const { status, data } = error.response;
        const serverMsg = data?.message;

        if (status === 400 || status === 401) {
            return serverMsg || "Incorrect email or username. Please try again.";
        }
        if (status === 404) {
            return "Account not found. Please check your email or sign up.";
        }
        if (status >= 500) {
            return "Server issue. Please try again later.";
        }
    }

    return error?.message || "Invalid email or password. Please try again.";
};

const toggle_password = (styleName) => {
    document.querySelectorAll(styleName).forEach((toggle) => {
        toggle.addEventListener("click", () => {
            const input = document.getElementById(toggle.dataset.target);
            if (!input) return;

            const isHidden = input.type === "password";
            input.type = isHidden ? "text" : "password";
            toggle.textContent = isHidden ? "Hide" : "Show";
            toggle.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
        });
    });
};

const scorePassword = (value) => {
    let score = 0;
    if (value.length >= 8) score++;
    if (value.length >= 12) score++;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    return score;
};

const password_strength = (style = {}) => {
    const signupPassword = document.getElementById("signupPassword");
    const strengthBar = document.querySelector(`.${style["pw-strength-bar"]} span`);
    const strengthLabel = document.querySelector(`.${style["pw-strength-label"]}`);

    if (!signupPassword || !strengthBar || !strengthLabel) return;

    signupPassword.addEventListener("input", () => {
        const value = signupPassword.value;
        const score = scorePassword(value);

        let width = "0%", label = "Weak", color = "var(--danger)";

        if (value && score > 2) {
            width = score <= 3 ? "66%" : "100%";
            label = score <= 3 ? "Medium" : "Strong";
            color = score <= 3 ? "var(--warn)" : "var(--success)";
        } else if (value) {
            width = "33%";
        }

        strengthBar.style.width = width;
        strengthBar.style.background = color;
        strengthLabel.textContent = label;
    });
};

const setup_form = (style = {}, redirect ) => {
    // console.log(redirect);

    const signupForm = document.getElementById("signupForm");
    if (!signupForm) return;

    const getClass = (key) => style[key] || key;
    const errorClass = getClass("has-error");
    let isSubmitting = false;

    const clearErrors = () => {
        const errorBanner = document.getElementById("formErrorBanner");
        if (errorBanner) {
            errorBanner.textContent = "";
            errorBanner.classList.remove(errorClass);
        }

        signupForm.querySelectorAll("input").forEach((input) => {
            input.classList.remove(errorClass);
        });

        signupForm.querySelectorAll(`.${getClass("field-error-msg")}`).forEach((msg) => {
            msg.textContent = "";
            msg.classList.remove(errorClass);
        });
    };

    const showFieldError = (inputName, errorMessage) => {
        const input = signupForm.querySelector(`input[name="${inputName}"]`);
        if (input) input.classList.add(errorClass);

        const errorSpan = document.getElementById(`${inputName}Error`);
        if (errorSpan) {
            errorSpan.textContent = errorMessage;
            errorSpan.classList.add(errorClass);
        }
    };

    const showBannerError = (message) => {
        const errorBanner = document.getElementById("formErrorBanner");
        if (errorBanner) {
            errorBanner.textContent = message;
            errorBanner.classList.add(errorClass);
        }
    };

    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (isSubmitting) return;
        isSubmitting = true;

        clearErrors();

        try {
            const rawData = Object.fromEntries(new FormData(e.target));
            delete rawData.terms;

            const validation = signup$.safeParse(rawData);

            if (!validation.success) {
                const fieldErrors = validation.error.flatten().fieldErrors;
                Object.entries(fieldErrors).forEach(([fieldName, messages]) => {
                    if (messages?.[0]) {
                        showFieldError(fieldName, messages[0]);
                    }
                });
                return;
            }

            const response = await signup(validation.data);
            if (response?.error) throw new Error(response.error);

            if (validation.data?.email) {
                setEmail(validation.data.email);
            }

            on_success(validation.data.email);
            redirect("/signup/2");

        } catch (error) {
            console.error("Signup submit error:", error);
            showBannerError(getErrorMessage(error));

            ["username", "email", "password"].forEach((fieldName) => {
                const input = signupForm.querySelector(`input[name="${fieldName}"]`);
                if (input) input.classList.add(errorClass);
            });

        } finally {
            isSubmitting = false;
        }
    });
};

export { toggle_password, password_strength, setup_form };
import { register$ } from "/validators/user.validators";
import { register } from "/helpers/auth/users.request";
import { getEmail } from "/core/email.state";

let gmail;

const getErrorMessage = (error) => {
    if (!navigator.onLine || error?.code === "ERR_NETWORK" || error?.message?.includes("Network Error")) {
        return "Network connection lost. Please check your internet connection and try again.";
    }

    if (error?.response) {
        const { status, data } = error.response;
        const serverMsg = data?.message;

        if (status === 400 || status === 401) {
            return serverMsg || "Incorrect details. Please try again.";
        }
        if (status === 404) {
            return "Account not found. Please check your email or sign up.";
        }
        if (status >= 500) {
            return "Server issue. Please try again later.";
        }
    }

    return error?.message || "Invalid submission. Please try again.";
};

export const init_variables = () => {
    gmail = getEmail();

    if (!gmail) {
        window.location.href = "/signup/1";
        return;
    }
};

export const setup_form = (style = {}, router) => {
    const profileForm = document.getElementById("profileForm");
    if (!profileForm) return;

    // Safely resolve CSS Module key or fallback to global string class
    const errorClass = style["has-error"] || "has-error";
    const fieldMsgClass = style["field-error-msg"] || "field-error-msg";
    let isSubmitting = false;

    const clearErrors = () => {
        const errorBanner = document.getElementById("formErrorBanner");
        if (errorBanner) {
            errorBanner.textContent = "";
            errorBanner.classList.remove(errorClass);
        }

        profileForm.querySelectorAll("input").forEach((input) => {
            input.classList.remove(errorClass);
        });

        profileForm.querySelectorAll(`.${fieldMsgClass}`).forEach((msg) => {
            msg.textContent = "";
            msg.classList.remove(errorClass);
        });
    };

    const showFieldError = (inputName, errorMessage) => {
        const input = profileForm.querySelector(`input[name="${inputName}"]`);
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

    profileForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (isSubmitting) return;
        isSubmitting = true;

        clearErrors();

        try {
            const rawData = Object.fromEntries(new FormData(e.target));

            // Validate against the imported Zod schema
            const validation = register$.safeParse(rawData);

            console.log("debug.final.helper", validation);

            if (!validation.success) {
                const fieldErrors = validation.error.flatten().fieldErrors;
                console.log("debug.final.helper", fieldErrors);
                Object.entries(fieldErrors).forEach(([fieldName, messages]) => {
                    if (messages?.[0]) {
                        showFieldError(fieldName, messages[0]);
                    }
                });
                return;
            }

            const response = await register({ email: gmail, ...validation.data });
            if (response?.error) throw new Error(response.error);

            // Execute router redirection correctly
            if (typeof router === "function") {
                router("/login");
            } else if (router?.navigate) {
                router.navigate("/login");
            } else {
                window.location.href = "/login";
            }

        } catch (error) {
            console.log(error);
            console.error("Profile submit error:", error);
            showBannerError(getErrorMessage(error));

            ["firstName", "lastName", "birthdate"].forEach((fieldName) => {
                const input = profileForm.querySelector(`input[name="${fieldName}"]`);
                if (input) input.classList.add(errorClass);
            });

        } finally {
            isSubmitting = false;
        }
    });
};
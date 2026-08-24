import { otp$ } from "/validators/user.validators";
import { verify_otp, request_otp } from "/helpers/auth/users.request";
import style from "./verify.module.css";

const getClass = (key) => style[key] || key;

const hasMessageClass = getClass("has-message");
const successClass = getClass("has-success");
const errorClass = getClass("has-error");

let gmail = "";

const getOtpForm = () => document.getElementById("otpForm");
const getDigits = () => Array.from(document.querySelectorAll(`.${getClass("otp-digit")}`));

const init_variables = () => {
    gmail = localStorage.getItem("gmail");

    if (!gmail) {
        window.location.href = "/signup/1";
        return;
    }

    const otpEmail = document.getElementById("otpEmail");
    if( otpEmail ){
        otpEmail.innerHTML = `${gmail.slice(0, 3)}***@gmail.com`;
    }
};

const clearErrors = () => {
    const errorBanner = document.getElementById("formErrorBanner");
    if (errorBanner) {
        errorBanner.textContent = "";
        errorBanner.classList.remove(
            hasMessageClass,
            "has-message",
            successClass,
            "has-success",
            errorClass,
            "has-error"
        );
    }

    const otpForm = getOtpForm();
    if (otpForm) {
        otpForm.querySelectorAll("input").forEach((input) => {
            input.classList.remove(errorClass, "has-error");
        });
    }
};

const showFieldError = () => {
    const otpForm = getOtpForm();
    if (otpForm) {
        otpForm.querySelectorAll("input").forEach((input) => {
            input.classList.add(errorClass, "has-error");
        });
    }
};

const showBannerError = (message) => {
    const messageBanner = document.getElementById("formErrorBanner");
    if (messageBanner) {
        messageBanner.textContent = message;
        messageBanner.classList.add(errorClass, "has-error", hasMessageClass, "has-message");
    }
};

const showBannerSuccess = (message) => {
    const messageBanner = document.getElementById("formErrorBanner");
    if (messageBanner) {
        messageBanner.textContent = message;
        messageBanner.classList.add(successClass, "has-success", hasMessageClass, "has-message");
    }
};

const handle_digits = () => {
    const digits = getDigits();
    const filledClass = getClass("is-filled");

    digits.forEach((input, index) => {
        input.addEventListener("input", () => {
            input.value = input.value.replace(/[^0-9]/g, "");
            input.classList.toggle(filledClass, input.value.length > 0);

            if (input.value && index < digits.length - 1) {
                digits[index + 1].focus();
            }
        });

        input.addEventListener("keydown", (e) => {
            clearErrors();

            if (e.key === "Backspace" && !input.value && index > 0) {
                digits[index - 1].focus();
            }
        });

        input.addEventListener("paste", (e) => {
            e.preventDefault();
            clearErrors();

            const clipboardData = e.clipboardData || window.clipboardData;
            const pasted = clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, digits.length);

            pasted.split("").forEach((char, i) => {
                if (digits[i]) {
                    digits[i].value = char;
                    digits[i].classList.add(filledClass);
                }
            });

            const nextIndex = Math.min(pasted.length, digits.length - 1);
            if (digits[nextIndex]) {
                digits[nextIndex].focus();
            }
        });
    });
};

const setup_form = () => {
    const otpForm = getOtpForm();
    if (!otpForm) return;

    let isSubmitting = false;

    otpForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (isSubmitting) return;
        isSubmitting = true;

        clearErrors();

        try {
            const digits = getDigits();
            const code = digits.map((input) => input.value).join("");

            const validation = otp$.safeParse({ otp: code });

            if (!validation.success) {
                showFieldError();
                return;
            }

            const response = await verify_otp({ email: gmail, otp: validation.data.otp });
            if (response?.error) throw new Error(response.error);

        } catch (error) {
            console.error("OTP verification error:", error);
            showBannerError(error?.message || error);
            showFieldError();
        } finally {
            isSubmitting = false;
        }
    });
};

const setup_resend = () => {
    const resendBtn = document.getElementById("otpResend");
    if (!resendBtn) return;

    let isRequesting = false;

    resendBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        if (isRequesting) return;
        isRequesting = true;

        clearErrors();

        try {
            const response = await request_otp({ email: gmail });
            if (response?.error) throw new Error(response.error);

            showBannerSuccess(response?.message || "OTP resent successfully.");
        } catch (error) {
            console.error("Resend OTP error:", error);
            showBannerError(error?.message || error);
            showFieldError();
        } finally {
            isRequesting = false;
        }
    });
};

export { init_variables, handle_digits, setup_form, setup_resend };
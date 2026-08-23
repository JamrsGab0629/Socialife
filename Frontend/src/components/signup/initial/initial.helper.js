import { signup$ } from "../../../validators/user.validators";
import { signup } from "../../../helpers/auth/users.request";

const getErrorMessage = (error) => {
    if (!navigator.onLine || error?.code === "ERR_NETWORK" || error?.message?.includes("Network Error")) {
        return "Network connection lost. Please check your internet connection and try again.";
    }

    if (error?.response) {
        const status = error.response.status;
        const serverMsg = error.response.data?.message;

        if (status === 401 || status === 400) {
            return serverMsg || "Incorrect email or password. Please try again.";
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

const toggle_password = (style_name) => {
    document.querySelectorAll(style_name).forEach(toggle => {
        toggle.addEventListener('click', () => {
            const input = document.getElementById(toggle.dataset.target);
            if (!input) return;

            const isHidden = input.type === 'password';
            input.type = isHidden ? 'text' : 'password';
            toggle.textContent = isHidden ? 'Hide' : 'Show';
            toggle.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
        });
    });
}

const password_strength = ( style = {} ) => {
    const signupPassword = document.getElementById('signupPassword');
    const strengthBar = document.querySelector(`.${style['pw-strength-bar']} span`);
    const strengthLabel = document.querySelector(`.${style['pw-strength-label']}`);

    function scorePassword(value) {
        let score = 0;
        if (value.length >= 8) score++;
        if (value.length >= 12) score++;
        if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
        if (/\d/.test(value)) score++;
        if (/[^A-Za-z0-9]/.test(value)) score++;
        return score;
    }

    signupPassword.addEventListener('input', () => {
        const value = signupPassword.value;
        const score = scorePassword(value);

        let width = '0%', label = 'Weak', color = 'var(--danger)';
        if (!value) {
            width = '0%'; label = 'Weak';
        } else if (score <= 2) {
            width = '33%'; label = 'Weak'; color = 'var(--danger)';
        } else if (score <= 3) {
            width = '66%'; label = 'Medium'; color = 'var(--warn)';
        } else {
            width = '100%'; label = 'Strong'; color = 'var(--success)';
        }

        strengthBar.style.width = width;
        strengthBar.style.background = color;
        strengthLabel.textContent = label;
    });
}

const setup_form = (style = {}) => {
    const signupForm = document.getElementById('signupForm');
    if (!signupForm) return;

    const getClass = (key) => style[key] || key;
    const errorClass = getClass('has-error');

    let has_submit = false;

    const clearErrors = () => {
        const errorBanner = document.getElementById('formErrorBanner');
        if (errorBanner) {
            errorBanner.textContent = '';
            errorBanner.classList.remove(errorClass, 'has-error');
        }

        signupForm.querySelectorAll('input').forEach(input => {
            input.classList.remove(errorClass, 'has-error');
        });

        const fieldMsgs = signupForm.querySelectorAll(`.${getClass('field-error-msg')}`);
        fieldMsgs.forEach(msg => {
            msg.textContent = '';
            msg.classList.remove(errorClass, 'has-error');
        });
    };

    const showFieldError = (inputName, errorMessage) => {
        const input = signupForm.querySelector(`input[name="${inputName}"]`);
        if (input) {
            input.classList.add(errorClass, 'has-error');
        }

        const errorSpan = document.getElementById(`${inputName}Error`);
        if (errorSpan) {
            errorSpan.textContent = errorMessage;
            errorSpan.classList.add(errorClass, 'has-error');
        }
    };

    const showBannerError = (message) => {
        const errorBanner = document.getElementById('formErrorBanner');
        if (errorBanner) {
            errorBanner.textContent = message;
            errorBanner.classList.add(errorClass, 'has-error');
        }
    };

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (has_submit) return;
        has_submit = true;

        clearErrors();

        try {
            const rawData = Object.fromEntries(new FormData(e.target));
            console.log(rawData);
            const validation = signup$.safeParse(rawData);

            if (!validation.success) {
                const fieldErrors = validation.error.flatten().fieldErrors;
                console.error('Validation errors:', fieldErrors);

                Object.entries(fieldErrors).forEach(([fieldName, messages]) => {
                    if (messages && messages.length > 0) {
                        showFieldError(fieldName, messages[0]);
                    }
                });
                return;
            }

            console.log("debug.setup_form", validation.data)

            const response = await signup(validation.data);
            if (response?.error) throw new Error(response.error);

            console.log('Init successful:', response);

        } catch (error) {
            console.error('Network or application runtime error:', error);

            const message = getErrorMessage(error.message);
            showBannerError(message);
        
            const usernameImput = signupForm.querySelector('input[name="username"]')
            const emailInput = signupForm.querySelector('input[name="email"]');
            const passwordInput = signupForm.querySelector('input[name="password"]');

            if (usernameImput) emailInput.classList.add(errorClass, 'has-error');
            if (emailInput) emailInput.classList.add(errorClass, 'has-error');
            if (passwordInput) passwordInput.classList.add(errorClass, 'has-error');

        } finally {
            has_submit = false;
        }
    });
}

export { toggle_password, password_strength, setup_form };
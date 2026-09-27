import { login$ } from '../../validators/user.validators';
import { login } from '/helpers/auth/users.request';
import { setEmail } from '/core/email.state'; // Imported state setter

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

const toggle_password = ( style_name ) => {
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

const setup_form = (style = {}, redirect ) => {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    const getClass = (key) => style[key] || key;
    const errorClass = getClass('has-error');

    let has_submit = false;

    const clearErrors = () => {
        const errorBanner = document.getElementById('formErrorBanner');
        if (errorBanner) {
            errorBanner.textContent = '';
            errorBanner.classList.remove(errorClass, 'has-error');
        }

        loginForm.querySelectorAll('input').forEach(input => {
            input.classList.remove(errorClass, 'has-error');
        });

        const fieldMsgs = loginForm.querySelectorAll(`.${getClass('field-error-msg')}`);
        fieldMsgs.forEach(msg => {
            msg.textContent = '';
            msg.classList.remove(errorClass, 'has-error');
        });
    };

    const showFieldError = (inputName, errorMessage) => {
        const input = loginForm.querySelector(`input[name="${inputName}"]`);
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

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (has_submit) return;
        has_submit = true;

        clearErrors();

        try {
            const rawData = Object.fromEntries(new FormData(e.target));
            const validation = login$.safeParse(rawData);

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

            // console.log("debug.setup_form", validation.data);

            const response = await login(validation.data);
            if(response?.error) throw new Error(response.error);

            // Store email in state on successful submission
            if (validation.data?.email) {
                setEmail(validation.data.email);
            }

            const user = response?.user;

            if(user?.role === "admin") {
                redirect("/admin");
            } else {
                redirect("/app");
            }

            // console.log('Login successful:', response);
        } catch (error) {
            console.error('Network or application runtime error:', error);

            const message = getErrorMessage(error?.message ?? error);
            showBannerError(message);

            const emailInput = loginForm.querySelector('input[name="email"]');
            const passwordInput = loginForm.querySelector('input[name="password"]');

            if (emailInput) emailInput.classList.add(errorClass, 'has-error');
            if (passwordInput) passwordInput.classList.add(errorClass, 'has-error');

        } finally {
            has_submit = false;
        }
    });
}

export { toggle_password, setup_form }
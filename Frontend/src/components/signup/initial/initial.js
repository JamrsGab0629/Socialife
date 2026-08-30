import style from './initial.module.css';
import style_btn from "../../../styles/main/btn.module.css";
import style_active from "../../../styles/main/active.module.css";
import { password_strength, setup_form, toggle_password } from './initial.helper';

export default function Initial(root) {
    // console.log(this);
    root.innerHTML = `
        <div class="${style['auth-card']}">
            <div class="${style['auth-tabs']}" role="tablist">
                <a href="/login" class="${style['auth-tab']}" role="tab" aria-selected="false">Log In</a>
                <a href="/signup/1" class="${style['auth-tab']} ${style_active['is-active']}" role="tab" aria-selected="true">Sign Up</a>
                <span class="${style['auth-tab-indicator']} ${style['is-signup']}" aria-hidden="true"></span>
            </div>

            <!-- Added top-level error banner container -->
            <div class="${style['auth-error-banner']}" id="formErrorBanner" aria-live="polite"></div>

            <form class="${style['auth-form']}" id="signupForm" novalidate>
                <label class="${style['auth-field']}">
                    <span>Username</span>
                    <input type="text" name="username" autocomplete="name" required placeholder="JuanDC-123">
                    <span class="${style['field-error-msg']}" id="usernameError"></span>
                </label>

                <label class="${style['auth-field']}">
                    <span>Email Address</span>
                    <input type="email" name="email" autocomplete="email" required placeholder="you@email.com">
                    <span class="${style['field-error-msg']}" id="emailError"></span>
                </label>

                <label class="${style['auth-field']}">
                    <span>Password</span>
                    <div class="${style['auth-password-wrap']}">
                        <input type="password" name="password" id="signupPassword" autocomplete="new-password"
                            required placeholder="Create a password">
                        <button type="button" class="${style['pw-toggle']} pw-toggle" data-target="signupPassword"
                            aria-label="Show password">Show</button>
                    </div>
                    <span class="${style['field-error-msg']}" id="passwordError"></span>

                    <div class="${style['pw-strength']}" id="pwStrength" aria-hidden="true">
                        <div class="${style['pw-strength-bar']}"><span></span></div>
                        <span class="${style['pw-strength-label']}">Weak</span>
                    </div>
                </label>

                <label class="${style['auth-checkbox']} ${style['auth-terms']}">
                    <input type="checkbox" name="terms" required>
                    <span>I agree to the <a href="#" class="${style['auth-link']}">Terms &amp; Conditions</a> and <a href="#"
                            class="${style['auth-link']}">Privacy
                            Policy</a></span>
                </label>

                <button type="submit" class="${style_btn['btn']} ${style_btn['btn-primary']} ${style['auth-submit']}">Create Account</button>

                <p class="${style['auth-switch']}">Already have an account? <a href="login">Log In</a></p>
            </form>
        </div>
    `

    function init() {
        // console.log(this);

        toggle_password(`.${style['pw-toggle']}`);
        password_strength(style);
        setup_form( style, this );
    };

    init.bind(this)();
}
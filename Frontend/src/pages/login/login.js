import style from "./login.module.css"
import style_btn from '../../styles/main/btn.module.css';
import style_active from "../../styles/main/active.module.css";

import Auth_Brand from "../../components/auth-brand/auth-brand";
import Auth from "../../layouts/auth/auth";
import { toggle_password, setup_form } from "./login.helper";

export default function Login() {
    const { aside, main } = Auth(this.root);

    Auth_Brand(aside);

    main.innerHTML = `
        <div class="${style['auth-card']}">
            <div class="${style['auth-tabs']}" role="tablist">
                <a href="/login" class="${style['auth-tab']} ${style_active['is-active']}" role="tab" aria-selected="true">Log In</a>
                <a href="/signup/" class="${style['auth-tab']}" role="tab" aria-selected="false">Sign Up</a>
                <span class="${style['auth-tab-indicator']}" aria-hidden="true"></span>
            </div>

            <!-- Added top-level error banner container -->
            <div class="${style['auth-error-banner']}" id="formErrorBanner" aria-live="polite"></div>

            <form class="${style['auth-form']}" id="loginForm" novalidate>
                <label class="${style['auth-field']}">
                    <span>Email or Username</span>
                    <!-- Added error class handling support -->
                    <input type="text" name="email" id="loginEmail" autocomplete="username" required placeholder="you@email.com">
                    <span class="${style['field-error-msg']}" id="emailError"></span>
                </label>

                <label class="${style['auth-field']}">
                    <span>Password</span>
                    <div class="${style['auth-password-wrap']}">
                        <input type="password" name="password" id="loginPassword" autocomplete="current-password" required placeholder="••••••••">
                        <button type="button" class="${style['pw-toggle']}" data-target="loginPassword" aria-label="Show password">Show</button>
                    </div>
                    <span class="${style['field-error-msg']}" id="passwordError"></span>
                </label>

                <div class="${style['auth-row']}">
                    <label class="${style['auth-checkbox']}">
                        <input type="checkbox" name="remember">
                        <span>Remember me</span>
                    </label>
                    <a href="#" class="${style['auth-link']}">Forgot password?</a>
                </div>

                <button type="submit" class="${style_btn['btn']} ${style_btn['btn-primary']} ${style['auth-submit']}">Log In</button>

                <p class="${style['auth-switch']}">Don't have an account? <a href="/signup/">Sign Up</a></p>
            </form>
        </div>
    `;

    function init( redirect) {
        toggle_password(`.${style['pw-toggle']}`);
        setup_form(style, redirect );
    };

    init( this.redirect );
}
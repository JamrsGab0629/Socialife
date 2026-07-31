import style from "./login.module.css"
import style_btn from '../../styles/main/btn.module.css';
import style_active from "../../styles/main/active.module.css";

import Auth_Brand from "../../components/auth-brand/auth-brand";
import Auth from "../../layouts/auth/auth";
import Component from "./login.component";

export default function Login(){
    const { aside, main } = Auth(this.root);

    Auth_Brand(aside);

    main.innerHTML = `
        <div class="${style['auth-card']}">
            <div class="${style['auth-tabs']}" role="tablist">
                <a href="/login" class="${style['auth-tab']} ${style_active['is-active']}" role="tab" aria-selected="true">Log In</a>
                <a href="/signup/" class="${style['auth-tab']}" role="tab" aria-selected="false">Sign Up</a>
                <span class="${style['auth-tab-indicator']}" aria-hidden="true"></span>
            </div>

            <form class="${style['auth-form']}" id="loginForm" novalidate>
                <label class="${style['auth-field']}">
                    <span>Email or Username</span>
                    <input type="text" name="identifier" autocomplete="username" required placeholder="you@email.com">
                </label>

                <label class="${style['auth-field']}">
                    <span>Password</span>
                    <div class="${style['auth-password-wrap']}">
                        <input type="password" name="password" id="loginPassword" autocomplete="current-password" required
                            placeholder="••••••••">
                        <button type="button" class="${style['pw-toggle']}" data-target="loginPassword" aria-label="Show password">Show</button>
                    </div>
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

    Component();
}
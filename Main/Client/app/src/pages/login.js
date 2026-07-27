import Auth_Brand from "../components/auth-brand";
import Auth from "../layouts/auth";

export default function Login(){
    const { aside, main } = Auth(this.root);

    Auth_Brand(aside);

    main.innerHTML = `
        <div class="auth-card">
            <div class="auth-tabs" role="tablist">
                <a href="/login" class="auth-tab is-active" role="tab" aria-selected="true">Log In</a>
                <a href="/signup" class="auth-tab" role="tab" aria-selected="false">Sign Up</a>
                <span class="auth-tab-indicator" aria-hidden="true"></span>
            </div>

            <form class="auth-form" id="loginForm" novalidate>
                <label class="auth-field">
                    <span>Email or Username</span>
                    <input type="text" name="identifier" autocomplete="username" required placeholder="you@email.com">
                </label>

                <label class="auth-field">
                    <span>Password</span>
                    <div class="auth-password-wrap">
                        <input type="password" name="password" id="loginPassword" autocomplete="current-password" required
                            placeholder="••••••••">
                        <button type="button" class="pw-toggle" data-target="loginPassword" aria-label="Show password">Show</button>
                    </div>
                </label>

                <div class="auth-row">
                    <label class="auth-checkbox">
                        <input type="checkbox" name="remember">
                        <span>Remember me</span>
                    </label>
                    <a href="#" class="auth-link">Forgot password?</a>
                </div>

                <button type="submit" class="btn btn-primary auth-submit">Log In</button>

                <p class="auth-switch">Don't have an account? <a href="signup.html">Sign Up</a></p>
            </form>
        </div>
    `;
}
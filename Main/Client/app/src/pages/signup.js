import Auth_Brand from "../components/auth-brand";
import Auth from "../layouts/auth";

export default function Signup(params) {
    const { aside, main } = Auth(this.root);
    Auth_Brand(aside);

    const counter = Number(params?.id) || 1;

    if ( counter === 1 ){
        main.innerHTML = `
            <div class="auth-card">
                <form class="auth-form" id="signupForm" novalidate>
                    <div class="auth-tabs" role="tablist">
                        <a href="/login" class="auth-tab" role="tab" aria-selected="false">Log In</a>
                        <a href="/signup/1" class="auth-tab is-active" role="tab" aria-selected="true">Sign Up</a>
                        <span class="auth-tab-indicator is-signup" aria-hidden="true"></span>
                    </div>

                    <label class="auth-field">
                        <span>Full Name</span>
                        <input type="text" name="fullname" autocomplete="name" required placeholder="Juan Dela Cruz">
                    </label>

                    <label class="auth-field">
                        <span>Email Address</span>
                        <input type="email" name="email" autocomplete="email" required placeholder="you@email.com">
                    </label>

                    <label class="auth-field">
                        <span>Password</span>
                        <div class="auth-password-wrap">
                            <input type="password" name="password" id="signupPassword" autocomplete="new-password"
                                required placeholder="Create a password">
                            <button type="button" class="pw-toggle" data-target="signupPassword"
                                aria-label="Show password">Show</button>
                        </div>
                        <div class="pw-strength" id="pwStrength" aria-hidden="true">
                            <div class="pw-strength-bar"><span></span></div>
                            <span class="pw-strength-label">Weak</span>
                        </div>
                    </label>

                    <label class="auth-checkbox auth-terms">
                        <input type="checkbox" name="terms" required>
                        <span>I agree to the <a href="#" class="auth-link">Terms &amp; Conditions</a> and <a href="#"
                                class="auth-link">Privacy
                                Policy</a></span>
                    </label>

                    <button type="submit" class="btn btn-primary auth-submit">Create Account</button>

                    <p class="auth-switch">Already have an account? <a href="login">Log In</a></p>
                </form>
            </div>
        `
    } else if (counter === 2) {
        main.innerHTML = `
            <div class="auth-card">
                <form class="auth-form" id="signupForm" novalidate>
                    <div class="auth-tabs" role="tablist">
                        <a href="/login" class="auth-tab" role="tab" aria-selected="false">Log In</a>
                        <a href="/signup/2" class="auth-tab is-active" role="tab" aria-selected="true">Sign Up</a>
                        <span class="auth-tab-indicator is-signup" aria-hidden="true"></span>
                    </div>

                    <label class="auth-field">
                        <span>Full Name</span>
                        <input type="text" name="username" autocomplete="name" required placeholder="Juan DC">
                    </label>

                    <label class="auth-field">
                        <span>Email Address</span>
                        <input type="email" name="email" autocomplete="email" required placeholder="you@email.com">
                    </label>

                    <label class="auth-field">
                        <span>Password</span>
                        <div class="auth-password-wrap">
                            <input type="password" name="password" id="signupPassword" autocomplete="new-password"
                                required placeholder="Create a password">
                            <button type="button" class="pw-toggle" data-target="signupPassword"
                                aria-label="Show password">Show</button>
                        </div>
                        <div class="pw-strength" id="pwStrength" aria-hidden="true">
                            <div class="pw-strength-bar"><span></span></div>
                            <span class="pw-strength-label">Weak</span>
                        </div>
                    </label>

                    <label class="auth-checkbox auth-terms">
                        <input type="checkbox" name="terms" required>
                        <span>I agree to the <a href="#" class="auth-link">Terms &amp; Conditions</a> and <a href="#"
                                class="auth-link">Privacy
                                Policy</a></span>
                    </label>

                    <button type="submit" class="btn btn-primary auth-submit">Create Account</button>

                    <p class="auth-switch">Already have an account? <a href="login">Log In</a></p>
                </form>
            </div>
        `
    } else if ( counter === 3) {
        main.innerHTML = `
            <div class="auth-card">
                <form class="auth-form" id="signupForm" novalidate>
                    <div class="auth-tabs" role="tablist">
                        <a href="/login" class="auth-tab" role="tab" aria-selected="false">Log In</a>
                        <a href="/signup/3" class="auth-tab is-active" role="tab" aria-selected="true">Sign Up</a>
                        <span class="auth-tab-indicator is-signup" aria-hidden="true"></span>
                    </div>

                    <label class="auth-field">
                        <span>Full Name</span>
                        <input type="text" name="fullname" autocomplete="name" required placeholder="Juan Dela Cruz">
                    </label>

                    <label class="auth-field">
                        <span>Email Address</span>
                        <input type="email" name="email" autocomplete="email" required placeholder="you@email.com">
                    </label>

                    <label class="auth-field">
                        <span>Password</span>
                        <div class="auth-password-wrap">
                            <input type="password" name="password" id="signupPassword" autocomplete="new-password"
                                required placeholder="Create a password">
                            <button type="button" class="pw-toggle" data-target="signupPassword"
                                aria-label="Show password">Show</button>
                        </div>
                        <div class="pw-strength" id="pwStrength" aria-hidden="true">
                            <div class="pw-strength-bar"><span></span></div>
                            <span class="pw-strength-label">Weak</span>
                        </div>
                    </label>

                    <label class="auth-checkbox auth-terms">
                        <input type="checkbox" name="terms" required>
                        <span>I agree to the <a href="#" class="auth-link">Terms &amp; Conditions</a> and <a href="#"
                                class="auth-link">Privacy
                                Policy</a></span>
                    </label>

                    <button type="submit" class="btn btn-primary auth-submit">Create Account</button>

                    <p class="auth-switch">Already have an account? <a href="login">Log In</a></p>
                </form>
            </div>
        `
    }
}
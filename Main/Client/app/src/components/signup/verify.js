export default function Verify(root) {
    root.innerHTML = `
        <div class="auth-card">
            <div class="otp-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="26" height="26"><path d="M3 6h18v12H3z" stroke="#2F5EFF" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M3 7l9 6 9-6" stroke="#2F5EFF" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>

            <h2 class="otp-title">Verify your email</h2>
            <p class="otp-sub">Enter the 6-digit code we sent to <span id="otpEmail">j***.santos@gmail.com</span></p>

            <form class="auth-form otp-form" id="otpForm" novalidate>
                <div class="otp-inputs" id="otpInputs">
                    <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" class="otp-digit" aria-label="Digit 1" required>
                    <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" class="otp-digit" aria-label="Digit 2" required>
                    <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" class="otp-digit" aria-label="Digit 3" required>
                    <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" class="otp-digit" aria-label="Digit 4" required>
                    <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" class="otp-digit" aria-label="Digit 5" required>
                    <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" class="otp-digit" aria-label="Digit 6" required>
                </div>

                <div class="otp-timer-row">
                    <span class="otp-timer" id="otpTimer">Code expires in <b id="otpCountdown">05:00</b></span>
                </div>

                <button type="submit" class="btn btn-primary auth-submit">Verify Email</button>

                <p class="auth-switch otp-resend-row">
                    Didn't get the code?
                    <button type="button" class="auth-switch-link otp-resend" id="otpResend" disabled>Resend code</button>
                </p>
            </form>
        </div>
    `
}
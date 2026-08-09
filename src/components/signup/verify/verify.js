import style from './verify.module.css';
import style_btn from '../../../styles/main/btn.module.css';
import Component from './verify.component';

export default function Verify(root) {
    root.innerHTML = `
        <div class="${style['auth-card']}">
            <div class="${style['otp-icon']}" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="26" height="26"><path d="M3 6h18v12H3z" stroke="#2F5EFF" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M3 7l9 6 9-6" stroke="#2F5EFF" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>

            <h2 class="${style['otp-title']}">Verify your email</h2>
            <p class="${style['otp-sub']}">Enter the 6-digit code we sent to <span id="otpEmail">j***.santos@gmail.com</span></p>

            <form class="${style['auth-form']} ${style['otp-form']}" id="otpForm" novalidate>
                <div class="${style['otp-inputs']}" id="otpInputs">
                    <input type="text" inputmode="numeric" pattern="[0-9]" maxlength="1" class="${style['otp-digit']}" aria-label="Digit 1" required oninput="this.value=this.value.replace(/[^0-9]/g,'')" onwheel="this.blur()">
                    <input type="text" inputmode="numeric" pattern="[0-9]" maxlength="1" class="${style['otp-digit']}" aria-label="Digit 2" required oninput="this.value=this.value.replace(/[^0-9]/g,'')" onwheel="this.blur()">
                    <input type="text" inputmode="numeric" pattern="[0-9]" maxlength="1" class="${style['otp-digit']}" aria-label="Digit 3" required oninput="this.value=this.value.replace(/[^0-9]/g,'')" onwheel="this.blur()">
                    <input type="text" inputmode="numeric" pattern="[0-9]" maxlength="1" class="${style['otp-digit']}" aria-label="Digit 4" required oninput="this.value=this.value.replace(/[^0-9]/g,'')" onwheel="this.blur()">
                    <input type="text" inputmode="numeric" pattern="[0-9]" maxlength="1" class="${style['otp-digit']}" aria-label="Digit 5" required oninput="this.value=this.value.replace(/[^0-9]/g,'')" onwheel="this.blur()">
                    <input type="text" inputmode="numeric" pattern="[0-9]" maxlength="1" class="${style['otp-digit']}" aria-label="Digit 6" required oninput="this.value=this.value.replace(/[^0-9]/g,'')" onwheel="this.blur()">
                </div>

                <div class="${style['otp-timer-row']}">
                    <span class="${style['otp-timer']}" id="otpTimer">Code expires in <b id="otpCountdown">05:00</b></span>
                </div>

                <button type="submit" class="${style_btn['btn']} ${style_btn['btn-primary']} ${style['auth-submit']}">Verify Email</button>

                <p class="${style['auth-switch']} ${style['otp-resend-row']}">
                    Didn't get the code?
                    <button type="button" class="${style['auth-switch-link']} ${style['otp-resend']}" id="otpResend" disabled>Resend code</button>
                </p>
            </form>
        </div>
    `
    Component();
}
import style from "./verify.module.css"

export default function Component() {
    const digits = Array.from(document.querySelectorAll(`.${style['otp-digit']}`));
    const otpForm = document.getElementById('otpForm');
    const countdownEl = document.getElementById('otpCountdown');
    const timerRow = document.getElementById('otpTimer');
    const resendBtn = document.getElementById('otpResend');

    digits.forEach((input, index) => {
        input.addEventListener('input', () => {
            input.value = input.value.replace(/[^0-9]/g, '');
            input.classList.toggle(`${style['is-filled']}`, input.value.length > 0);
            if (input.value && index < digits.length - 1) {
                digits[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value && index > 0) {
                digits[index - 1].focus();
            }
        });

        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '').slice(0, digits.length);
            pasted.split('').forEach((char, i) => {
                if (digits[i]) {
                    digits[i].value = char;
                    digits[i].classList.add(`${style['is-filled']}`);
                }
            });
            const nextIndex = Math.min(pasted.length, digits.length - 1);
            digits[nextIndex].focus();
        });
    });

    // OTP Countdown
    let secondsLeft = 300;
    let countdownTimer = null;

    function formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
    }

    function startCountdown() {
        secondsLeft = 300;
        timerRow.classList.remove(`${style['is-expired']}`);
        resendBtn.disabled = true;
        countdownEl.textContent = formatTime(secondsLeft);

        clearInterval(countdownTimer);
        countdownTimer = setInterval(() => {
            secondsLeft--;
            countdownEl.textContent = formatTime(Math.max(secondsLeft, 0));

            if (secondsLeft <= 0) {
                clearInterval(countdownTimer);
                timerRow.classList.add(`${style['is-expired']}`);
                resendBtn.disabled = false;
            }
        }, 1000);
    }

    startCountdown();


    // Resend the otp
    resendBtn.addEventListener('click', () => {
        if (resendBtn.disabled) return;
        digits.forEach(input => {
            input.value = '';
            input.classList.remove(`${style['is-filled']}`);
        });
        digits[0].focus();
        startCountdown();
    });

    otpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = digits.map(input => input.value).join('');
        if (code.length < digits.length) return;
        window.location.href = '3';
    });
}
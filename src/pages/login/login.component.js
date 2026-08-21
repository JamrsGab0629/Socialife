import HandleLogin from '../../core/handlelogin';
import style from './login.module.css';

export default function Component() {
    const loginForm = document.getElementById('loginForm');

    document.querySelectorAll(`.${style['pw-toggle']}`).forEach(toggle => {
        toggle.addEventListener('click', () => {
            const input = document.getElementById(toggle.dataset.target);
            const isHidden = input.type === 'password';
            input.type = isHidden ? 'text' : 'password';
            toggle.textContent = isHidden ? 'Hide' : 'Show';
            toggle.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
        });
    });

    let has_submit = false;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if(has_submit) return;

        has_submit = true;
        console.log('Login submitted:', await HandleLogin(Object.fromEntries(new FormData(loginForm))));
        has_submit = false;
    });
}
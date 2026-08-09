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

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Login submitted:', Object.fromEntries(new FormData(loginForm)));
        window.location.href = 'app/';
    });
}
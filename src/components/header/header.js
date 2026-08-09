import style from './header.module.css';
import style_btn from '../../styles/main/btn.module.css'

export default function Header(root){
    root.innerHTML = `
        <nav class="${style['nav']} container">
            <a href="#top" class="${style['nav-logo-mark']}">
                <span class="${style['nav-logo-mark']}" aria-hidden="true">
                    <svg viewBox="0 0 32 32" width="26" height="26">
                        <path d="M2 20c4-8 8-8 12 0s8 8 12 0" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
                    </svg>
                </span>
                Socialife
            </a>

            <ul class="${style['nav-links']}">
                <li><a href="#features">Features</a></li>
                <li><a href="#community">Community</a></li>
                <li><a href="#faq">FAQ</a></li>
            </ul>

            <div class="${style['nav-actions']}">
                <a href="/login" class="${style_btn['btn']} ${style_btn['btn-ghost']} ${style['nav-login']}">Log In</a>
                <a href="/signup/" class="${style_btn['btn']} ${style_btn['btn-primary']} ${style['nav-signup']}">Sign Up</a>
            </div>

            <button class="${style['nav-burger']}" id="navBurger" aria-label="Open menu" aria-expanded="false">
                <span></span><span></span><span></span>
            </button>
        </nav>

        <div class="${style['nav-mobile']}" id="navMobile">
            <a href="#features">Features</a>
            <a href="#community">Community</a>
            <a href="#faq">FAQ</a>
            <div class="${style['nav-mobile-actions']}">
                <a href="/login" class="${style['btn']} ${style_btn['btn']} ${style_btn['btn-ghost']}">Log In</a>
                <a href="/signup/" class="${style['btn']} ${style_btn['btn']} ${style_btn['btn-primary']}">Sign Up</a>
            </div>
        </div>
    `;
}
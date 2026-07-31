export default function Header(root) {
    root.innerHTML = `
        <nav class="nav container">
            <a href="#top" class="nav-logo">
                <span class="nav-logo-mark" aria-hidden="true">
                    <svg viewBox="0 0 32 32" width="26" height="26">
                        <path d="M2 20c4-8 8-8 12 0s8 8 12 0" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
                    </svg>
                </span>
                Socialife
            </a>

            <ul class="nav-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#community">Community</a></li>
                <li><a href="#faq">FAQ</a></li>
            </ul>

            <div class="nav-actions">
                <a href="/login" class="btn btn-ghost nav-login">Log In</a>
                <a href="/signup/" class="btn btn-primary nav-signup">Sign Up</a>
            </div>

            <button class="nav-burger" id="navBurger" aria-label="Open menu" aria-expanded="false">
                <span></span><span></span><span></span>
            </button>
        </nav>

        <div class="nav-mobile" id="navMobile">
            <a href="#features">Features</a>
            <a href="#community">Community</a>
            <a href="#faq">FAQ</a>
            <div class="nav-mobile-actions">
                <a href="/login" class="btn btn-ghost">Log In</a>
                <a href="/signup/" class="btn btn-primary">Sign Up</a>
            </div>
        </div>
    `;
}
export default function Auth_Brand(root){
    root.innerHTML = `
        <a href="/landing" class="auth-brand-logo">
            <span class="nav-logo-mark" aria-hidden="true">
                <svg viewBox="0 0 32 32" width="24" height="24">
                    <path d="M2 20c4-8 8-8 12 0s8 8 12 0" fill="none" stroke="currentColor" stroke-width="3"
                        stroke-linecap="round" />
                </svg>
            </span>
            Socialife
        </a>

        <div class="auth-brand-copy">
            <h1>Your feed, tuned to your frequency.</h1>
            <p>Join a platform built to surface what matters to you — not whatever keeps you scrolling the longest.
            </p>
        </div>

        <div class="auth-brand-wave" aria-hidden="true">
            <svg viewBox="0 0 400 120" preserveAspectRatio="none">
                <path d="M0 60 C 50 20, 100 100, 150 60 S 250 20, 300 60 S 380 90 400 60" fill="none"
                    stroke="currentColor" stroke-width="2" />
                <path d="M0 80 C 50 40, 100 120, 150 80 S 250 40, 300 80 S 380 110 400 80" fill="none"
                    stroke="currentColor" stroke-width="2" opacity="0.5" />
            </svg>
        </div>

        <blockquote class="auth-quote">
            "Finally a feed that feels curated by me, not for me."
            <cite>— Early Socialife member</cite>
        </blockquote>
    `;
}
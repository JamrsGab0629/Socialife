<<<<<<< HEAD:Main/Client/app/src/components/footer/footer.js
import style from "./footer.module.css"

export default function Footer(root) {
    root.innerHTML = `
        <div class="container ${style['footer-grid']}">
            <div class="${style['footer-brand']}">
                <a href="#top" class="${style['nav-logo']} ${style['footer-logo']}">
                    <span class="${style['nav-logo-mark']}" aria-hidden="true">
                        <svg viewBox="0 0 32 32" width="24" height="24">
                            <path d="M2 20c4-8 8-8 12 0s8 8 12 0" fill="none" stroke="currentColor" stroke-width="3"
                                stroke-linecap="round" />
                        </svg>
                    </span>
                    Socialife
                </a>
                <p>Social, at your own frequency.</p>
            </div>

            <div class="${style['footer-col']}">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#community">Community</a>
                <a href="#faq">FAQ</a>
            </div>

            <div class="${style['footer-col']}">
                <h4>Company</h4>
                <a href="#">About</a>
                <a href="#">Careers</a>
                <a href="#">Press</a>
                <a href="#">Contact</a>
            </div>

            <div class="${style['footer-col']}">
                <h4>Legal</h4>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Community Guidelines</a>
            </div>

        </div>

        <div class="container ${style['footer-bottom']}">
            <p>© 2026 Socialife. All rights reserved.</p>
        </div>
    `;
=======
export default function Footer(root) {
    root.innerHTML = `
        <div class="container footer-grid">
            <div class="footer-brand">
                <a href="#top" class="nav-logo footer-logo">
                    <span class="nav-logo-mark" aria-hidden="true">
                        <svg viewBox="0 0 32 32" width="24" height="24">
                            <path d="M2 20c4-8 8-8 12 0s8 8 12 0" fill="none" stroke="currentColor" stroke-width="3"
                                stroke-linecap="round" />
                        </svg>
                    </span>
                    Socialife
                </a>
                <p>Social, at your own frequency.</p>
            </div>

            <div class="footer-col">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#community">Community</a>
                <a href="#faq">FAQ</a>
            </div>

            <div class="footer-col">
                <h4>Company</h4>
                <a href="#">About</a>
                <a href="#">Careers</a>
                <a href="#">Press</a>
                <a href="#">Contact</a>
            </div>

            <div class="footer-col">
                <h4>Legal</h4>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Community Guidelines</a>
            </div>

        </div>

        <div class="container footer-bottom">
            <p>© 2026 Socialife. All rights reserved.</p>
        </div>
    `;
>>>>>>> d99a73c590e4d38b5677bfc2f3b03d6a673723dd:Main/Client/app/src/components/footer.js
}
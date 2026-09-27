import Navigation from "../../components/navigation/navigation";
import Layout from "../../layouts/default/default";

import style from "./settings.module.css";
import style_topbar_search from "../../styles/app/topbar-search.module.css";

export default function Settings() {
    const { navigation, main } = Layout(this.root);

    Navigation(navigation);
    main.innerHTML = `
        <div id="settings" class="${style['settings']}">
            <!-- ─── SEARCH ─── -->
            <div class="${style_topbar_search["topbar"]}">
                <div class="${style_topbar_search["search-box"]}">
                    <img width="18px" height="18px" src="/icon/search.svg" alt="search">
                    <input type="text" class="${style_topbar_search["search-input"]}" placeholder="Hinted search text">
                </div>
            </div>

            <!-- ─── BODY ─── -->
            <div class="${style["settings-body"]}">

                <!-- ═══ YOUR ACCOUNT ═══ -->
                <div class="${style["section-heading"]}">Your account</div>
                <div class="${style["settings-card"]}">
                    <a class="${style["settings-item"]}" href="#">
                        <img class="${style["settings-icon"]}" src="/icon/user-avatar.svg" alt="Users avatar">
                        <div class="${style["item-content"]}">
                            <div class="${style["item-title"]}">
                                Accounts Center
                                <span class="${style["badge"]} ${style["badge-blue"]}">verified</span>
                            </div>
                            <div class="${style["item-desc"]}">Password, security, personal details, connected experiences, ad
                                preferences
                            </div>
                        </div>
                        <span class="${style["item-chevron"]}">›</span>
                    </a>
                </div>

                <!-- ═══ PREFERENCES ═══ -->
                <div class="${style["section-heading"]}">Preferences</div>
                <div class="${style["section-sub"]}">Customize your experience on Socialife.</div>
                <div class="${style["settings-card"]}">
                    <a class="${style["settings-item"]}" href="#">
                        <img class="${style["settings-icon"]}" src="/icon/bell.svg" alt="Notifications">
                        <div class="${style["item-content"]}">
                            <div class="${style["item-title"]}">Notifications</div>
                        </div>
                        <span class="${style["item-chevron"]}">›</span>
                    </a>
                    <a class="${style["settings-item"]} ${style["dark-mode-row"]}" href="#">
                        <img class="${style["settings-icon"]}" src="/icon/contrast.svg" alt="Light-Dark mode">
                        <div class="${style["item-content"]}">
                            <div class="${style["item-title"]}">Dark mode</div>
                            <div class="${style["item-desc"]}">Switch to a darker theme</div>
                        </div>
                        <div class="${style["toggle-wrap"]}">
                            <div class="${style["toggle"]}" id="darkModeToggle" role="button" tabindex="0"
                                aria-label="Toggle dark mode">
                                <span class="${style["toggle-knob"]}"></span>
                            </div>
                        </div>
                    </a>
                </div>

                <!-- ═══ AUDIENCE & VISIBILITY ═══ -->
                <div class="${style["section-heading"]}">Audience and visibility</div>
                <div class="${style["section-sub"]}">Control who can see what you share on Socialife.</div>
                <div class="${style["settings-card"]}">
                    <a class="${style["settings-item"]}" href="#">
                        <img class="${style["settings-icon"]}" src="/icon/chat-bubble.svg" alt="Contacts">
                        <div class="${style["item-content"]}">
                            <div class="${style["item-title"]}">How people find and contact you</div>
                        </div>
                        <span class="${style["item-chevron"]}">›</span>
                    </a>
                </div>

                <!-- ═══ BLOCKING, PAYMENTS, ACTIVITY ═══ -->
                <div class="${style["section-heading"]}">Privacy &amp; controls</div>
                <div class="${style["settings-card"]}">
                    <a class="${style["settings-item"]}" href="#">
                        <img class="${style["settings-icon"]}" src="/icon/block-user.svg" alt="Blocks">
                        <div class="${style["item-content"]}">
                            <div class="${style["item-title"]}">Blocking</div>
                            <div class="${style["item-desc"]}">Manage blocked users and pages</div>
                        </div>
                        <span class="${style["item-chevron"]}">›</span>
                    </a>
                    <a class="${style["settings-item"]}" href="#">
                        <img class="${style["settings-icon"]}" src="/icon/activity.svg" alt="Activity">
                        <div class="${style["item-content"]}">
                            <div class="${style["item-title"]}">Your activity</div>
                            <div class="${style["item-desc"]}">Review your activity and content you're tagged in</div>
                        </div>
                        <span class="${style["item-chevron"]}">›</span>
                    </a>
                </div>

                <!-- ═══ COMMUNITY STANDARDS & LEGAL ═══ -->
                <div class="${style["section-heading"]}">Community Standards and legal policies</div>
                <div class="${style["settings-card"]}">
                    <div class="${style["check-item"]}">
                        <span class="${style["check-box"]} ${style["checked"]}">✓</span>
                        <span class="${style["check-label"]}">Terms of Service</span>
                    </div>
                    <div class="${style["check-item"]}">
                        <span class="${style["check-box"]} ${style["checked"]}">✓</span>
                        <span class="${style["check-label"]}">Privacy Policy</span>
                    </div>
                    <div class="${style["check-item"]}">
                        <span class="${style["check-box"]} ${style["checked"]}">✓</span>
                        <span class="${style["check-label"]}">Cookies policy</span>
                    </div>
                    <div class="${style["check-item"]}">
                        <span class="${style["check-box"]} ${style["checked"]}">✓</span>
                        <span class="${style["check-label"]}">Community Standards</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}
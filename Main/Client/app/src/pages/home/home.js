import Navigation from '../../components/navigation/navigation';
import Layout from '../../layouts/default/default';

import style from './home.module.css';
import style_onmind from '../../styles/app/onmind.module.css';
import style_topbar_search from "../../styles/app/topbar-search.module.css";
import Component from './home.component';
import Post from '../../components/post/post';
import Helper from './home.helper';

export default function Home() {
    const { navigation, main } = Layout(this.root);

    Navigation(navigation);
    main.innerHTML = `
        <div id="main-feed" class="${style['main-feed']}">
            <div class="${style_topbar_search["topbar"]}">
                <div class="${style_topbar_search["search-box"]}">
                    <img width="18px" height="18px" src="../../icons/search.svg" alt="search">
                    <input type="text" class="${style_topbar_search["search-input"]}" placeholder="Hinted search text">
                </div>

                <a action-button="timeline" class="${style_topbar_search["icon-btn"]}" href="/app/timeline">
                    <span class="${style_topbar_search["icon-dot"]}">3</span>
                    <img width="30px" src="../../icons/bell.svg" style="filter: invert(20%);" alt="bell">
                </a>
            </div>
        </div>
        <div class="${style["right-col"]}">
            <div class="${style["recommend-box"]}">
                <div class="${style["recommend-title"]}">Friend Recommendations</div>

                <div class="${style["friend-row"]}">
                    <svg class="${style["friend-avatar"]}" width="42" height="42" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50" fill="#E8A5A0" />
                        <ellipse cx="50" cy="55" rx="26" ry="28" fill="#F2C9A0" />
                        <path d="M18 55C18 25 32 10 50 10C68 10 82 25 82 55C74 40 64 34 50 40C36 34 26 40 18 55Z"
                            fill="#4A2E1E" />
                    </svg>
                    <div class="${style["friend-name"]}">Maria Garcia</div>
                    <button class="${style["add-friend-btn"]}">Add Friend</button>
                </div>
                <div class="${style["friend-row"]}">
                    <svg class="${style["friend-avatar"]}" width="42" height="42" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50" fill="#A5C7E8" />
                        <ellipse cx="50" cy="55" rx="26" ry="28" fill="#F0C39B" />
                        <path d="M20 46C20 22 33 12 50 12C67 12 80 22 80 46C80 30 68 24 50 24C32 24 20 30 20 46Z"
                            fill="#1B1B1B" />
                    </svg>
                    <div class="${style["friend-name"]}">Ben Chen</div>
                    <button class="${style["add-friend-btn"]}">Add Friend</button>
                </div>
                <div class="${style["friend-row"]}">
                    <svg class="${style["friend-avatar"]}" width="42" height="42" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50" fill="#C7A5E8" />
                        <ellipse cx="50" cy="55" rx="26" ry="28" fill="#E8B98C" />
                        <path d="M16 58C16 26 30 8 50 8C70 8 84 26 84 58C78 36 66 46 50 46C34 46 22 36 16 58Z"
                            fill="#2E1B0E" />
                    </svg>
                    <div class="${style["friend-name"]}">Sarah Jones</div>
                    <button class="${style["add-friend-btn"]}">Add Friend</button>
                </div>
                <div class="${style["friend-row"]}">
                    <svg class="${style["friend-avatar"]}" width="42" height="42" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50" fill="#A5E8C0" />
                        <ellipse cx="50" cy="55" rx="26" ry="28" fill="#E0A876" />
                        <path d="M20 44C20 20 33 10 50 10C67 10 80 20 80 44C74 32 64 30 50 34C36 30 26 32 20 44Z"
                            fill="#1B1410" />
                    </svg>
                    <div class="${style["friend-name"]}">Michael Brown</div>
                    <button class="${style["add-friend-btn"]}">Add Friend</button>
                </div>
                <div class="${style["friend-row"]}">
                    <svg class="${style["friend-avatar"]}" width="42" height="42" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50" fill="#E8D5A5" />
                        <ellipse cx="50" cy="55" rx="26" ry="28" fill="#F2CDA3" />
                        <path d="M18 50C18 24 32 10 50 10C68 10 82 24 82 50C82 34 70 22 50 22C30 22 18 34 18 50Z"
                            fill="#6B4423" />
                    </svg>
                    <div class="${style["friend-name"]}">Emily Davis</div>
                    <button class="${style["add-friend-btn"]}">Add Friend</button>
                </div>
            </div>
        </div>
    `;

    Helper( main );
}
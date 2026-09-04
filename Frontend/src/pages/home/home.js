import Navigation from '../../components/navigation/navigation';
import Layout from '../../layouts/default/default';

import style from './home.module.css';
import style_onmind from '../../styles/app/onmind.module.css';
import style_topbar_search from "../../styles/app/topbar-search.module.css";
import Component from './home.component';
import Post from '../../components/post/post';
import Helper, { FriendsTemplate } from './home.helper';
import Service from './home.service';

export default async function Home() {
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
                <div id="friend-list"></div>
            </div>
        </div>
    `;

    Helper();

    const friends_data = await Service();
    document.getElementById('friend-list').innerHTML = FriendsTemplate(friends_data);
}

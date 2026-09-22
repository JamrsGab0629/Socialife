// home.js
import Navigation from '../../components/navigation/navigation';
import Layout from '../../layouts/default/default';

import style from './home.module.css';
import style_topbar_search from "../../styles/app/topbar-search.module.css";
import Helper, { FriendsTemplate, initComposerOverlay, initCommentInteractions } from './home.helper';
import Service, { fetchHomeFeedService } from './home.service';
import Post from '../../components/post/post';
import { InfiniteScroll } from '../../helpers/utils/InfiniteScroll'; 

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
            
            <div id="feed-container">
                <div id="composer-trigger" class="${style['onmind']}" style="cursor: pointer;">
                    <div class="${style['composer-label']}">What's on your mind?</div>
                    <div class="${style['composer-box']}">Write something...</div>
                </div>
            </div>
            <div id="feed-sentinel" style="height: 20px;"></div>
        </div>

        <div class="${style["right-col"]}">
            <div class="${style["recommend-box"]}">
                <div class="${style["recommend-title"]}">Friend Recommendations</div>
                <div id="friend-list"></div>
            </div>
        </div>

        <!-- Overlay Modal Container -->
        <div id="composer-overlay-backdrop" class="${style['overlay-backdrop']}" hidden>
            <div id="composer-overlay-container" class="${style['overlay-modal']}"></div>
        </div>
    `;

    Helper();
    initComposerOverlay(); // Bind overlay event listener

    const feedContainer = document.getElementById('feed-container');
    const sentinel = document.getElementById('feed-sentinel');

    // Initialize comment interactions using event delegation on the feed container
    initCommentInteractions(feedContainer);

    new InfiniteScroll({
        container: feedContainer,
        sentinel: sentinel,
        limit: 10,
        loadMore: async ({ page, limit }) => {
            return await fetchHomeFeedService(page, limit);
        },
        renderItems: (posts, container) => {
            posts.forEach((postData) => {
                const postMarkup = Post(postData);
                container.insertAdjacentHTML('beforeend', postMarkup);
            });
        }
    });

    // Prepend newly created post immediately at the top of the feed
    window.addEventListener('post:created', (event) => {
        const newPost = event.detail;
        if (!newPost) return;

        const postMarkup = Post(newPost);
        const composerTrigger = document.getElementById('composer-trigger');
        if (composerTrigger) {
            composerTrigger.insertAdjacentHTML('afterend', postMarkup); // Places it right at the top of the feed
        }
    });

    const friends_data = await Service();
    document.getElementById('friend-list').innerHTML = FriendsTemplate(friends_data);
}
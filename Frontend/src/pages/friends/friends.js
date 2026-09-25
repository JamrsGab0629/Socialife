import Navigation from "../../components/navigation/navigation";
import Layout from "../../layouts/default/default";
import style from "./friends.module.css";
import Helper, { FriendsTemplate, RequestsTemplate, SuggestionsTemplate } from "./friends.helper";
import { get_friends_list, get_pending_requests, get_friend_suggestions } from "../../helpers/friends/friends.request";

export default async function Friends() {
    const { navigation, main } = Layout(this.root);

    Navigation(navigation);
    main.innerHTML = `
        <div id="friends-main" class="${style['friends-main']}">
            <div class="${style["friends-header"]}">
                <h2>People</h2>
                <div id="active-count" class="${style["active-count"]}"></div>
            </div>

            <nav class="${style["friends-tabs"]}">
                <button type="button" class="${style["friends-tab"]} ${style["active"]}" data-tab="friends">Friends</button>
                <button type="button" class="${style["friends-tab"]}" data-tab="requests">Requests</button>
                <button type="button" class="${style["friends-tab"]}" data-tab="suggestions">People You May Know</button>
            </nav>

            <div id="friends-grid" class="${style["friends-grid"]}"></div>
        </div>
    `;

    const grid = document.getElementById('friends-grid');
    const activeCountEl = document.getElementById('active-count');
    const tabs = main.querySelectorAll(`.${style["friends-tab"]}`);

    let cache = { friends: null, requests: null, suggestions: null };

    async function loadTab(tab) {
        grid.innerHTML = "Loading...";

        if (tab === 'friends') {
            if (!cache.friends) cache.friends = (await get_friends_list())?.data || [];
            grid.innerHTML = FriendsTemplate(cache.friends);
            activeCountEl.textContent = `${cache.friends.length} friends`;
        } else if (tab === 'requests') {
            if (!cache.requests) cache.requests = (await get_pending_requests())?.data || [];
            grid.innerHTML = RequestsTemplate(cache.requests);
            activeCountEl.textContent = `${cache.requests.length} pending`;
        } else if (tab === 'suggestions') {
            if (!cache.suggestions) cache.suggestions = (await get_friend_suggestions())?.data || [];
            grid.innerHTML = SuggestionsTemplate(cache.suggestions);
            activeCountEl.textContent = "";
        }
    }

    function refreshCurrentTab() {
        const activeTab = main.querySelector(`.${style["friends-tab"]}.${style["active"]}`)?.dataset.tab;
        cache = { friends: null, requests: null, suggestions: null };
        if (activeTab) loadTab(activeTab);
    }

    Helper(grid, { onChange: refreshCurrentTab });

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove(style.active));
            tab.classList.add(style.active);
            loadTab(tab.dataset.tab);
        });
    });

    loadTab('friends');
}
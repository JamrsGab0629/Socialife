import style from './navigation.module.css';
import * as navigationHelper from './navigation.helper.js';

export default function Navigation(root) {
    root.innerHTML = `
        <!-- SIDEBAR -->
        <aside class="${style['sidebar']}">
            <a id="refresh" href="/" class="${style['logo']}">
                <img id="main-logo" class="${style['stamp']}" src="/Socialife-stamp.png" alt="Socialife-stamp">
                <img class="${style['script']}" src="/Socialife-script.png" alt="Socialife-script">
            </a>

            <a nav-action="profile" id="profile-nav" href="/app/profile">
                <div class="${style['profile-block']}">
                    <div class="${style['avatar-ring']}"><img src="/icon/profile.svg" alt="User Avatar"></div>
                    <div class="${style['profile-name']}">Loading...</div>
                </div>
            </a>

            <nav class="${style['nav']}">
                <a nav-action="home" class="${style['nav-item']}" href="/app/home">
                    <img class="${style['nav-icon']}" src="/icon/home.svg" alt="Home">
                    Home
                </a>
                <a nav-action="saved" class="${style['nav-item']}" href="/app/saved">
                    <img class="${style['nav-icon']}" src="/icon/save.svg" alt="Saved">
                    Saved
                </a>
                <a nav-action="friends" class="${style['nav-item']}" href="/app/friends">
                    <img class="${style['nav-icon']}" src="/icon/group.svg" alt="Friends">
                    Friends
                </a>
                <a nav-action="settings" class="${style['nav-item']}" href="/app/settings">
                    <img class="${style['nav-icon']}" src="/icon/settings.svg" alt="Settings">
                    Settings
                </a>
                <a nav-action="log-out" class="${style['nav-item']}" href="#">
                    <img class="${style['nav-icon']}" src="/icon/logout.svg" alt="Log Out">
                    Log Out
                </a>
            </nav>
        </aside>

        <!-- MOBILE BOTTOM NAV -->
        <nav class="${style['mobile-bottom-nav']}">
            <a nav-action="home" class="${style['mobile-nav-item']}" href="/app/home">
                <img class="${style['nav-icon']}" src="/icon/home.svg" alt="Home">
                Home
            </a>
            <a nav-action="saved" class="${style['mobile-nav-item']}" href="/app/saved">
                <img class="${style['nav-icon']}" src="/icon/save.svg" alt="Saved">
                Saved
            </a>
            <a nav-action="friends" class="${style['mobile-nav-item']}" href="/app/friends">
                <img class="${style['nav-icon']}" src="/icon/group.svg" alt="Friends">
                Friends
            </a>
            <a nav-action="settings" class="${style['mobile-nav-item']}" href="/app/settings">
                <img class="${style['nav-icon']}" src="/icon/settings.svg" alt="Settings">
                Settings
            </a>
            <a nav-action="log-out" class="${style['mobile-nav-item']}" href="#">
                <img class="${style['nav-icon']}" src="/icon/logout.svg" alt="Log Out">
                Log Out
            </a>
        </nav>
    `;

    // Initialize user details and bind click handlers
    navigationHelper.setupUserInformation();
    navigationHelper.attachNavigationEvents(root);
}
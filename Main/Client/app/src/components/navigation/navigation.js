import style from './navigation.module.css'

export default function Navigation(root) {
    root.innerHTML = `
        <!-- SIDEBAR -->
        <aside class="${style['sidebar']}">
            <a id="refresh" href="/" class="${style['logo']}">
                <img id="main-logo" class="${style['stamp']}" src="./images/Socialife-stamp.png" alt="Socialife-stamp">
                <img class="${style['script']}" src="./images/Socialife-script.png" alt="Socialife-script">
            </a>

            <a nav-action="profile" id="profile-nav" href="/app/profile">
                <div class="${style['profile-block']}">
                    <div class="${style['avatar-ring']}"><img src="./images/profile/James.jpg" alt="James Gabriel Santos"></div>
                    <div class="${style['profile-name']}">James Gabriel Santos</div>
                </div>
            </a>

            <nav class="${style['nav']}">
                <a nav-action="home" class="${style['nav-item']}" href="/app/home">
                    <img class="${style['simple-icon']}" src="./images/icon/home.png">
                    Home
                </a>
                <a nav-action="saved" class="${style['nav-item']}" href="/app/saved">
                    <img class="${style['simple-icon']}" src="./images/icon/save.png">
                    Saved
                </a>
                <a nav-action="friends" class="${style['nav-item']}" href="/app/friends">
                    <img class="${style['simple-icon']}" src="./images/icon/group.png">
                    Friends
                </a>
                <a nav-action="settings" class="${style['nav-item']}" href="/app/settings">
                    <img class="${style['simple-icon']}" src="./images/icon/settings.png">
                    Settings
                </a>
                <a nav-action="log-out" class="${style['nav-item']}" href="/app/log-out">
                    <img class="${style['simple-icon']}" src="./images/icon/logout.png">
                    Log Out
                </a>
            </nav>
        </aside>

    <!-- MOBILE BOTTOM NAV -->
    <nav class="${style['mobile-bottom-nav']}">
        <a nav-action="home" class="${style['mobile-nav-item']}" href="/app/home">
            <img class="${style['simple-icon']}" src="./images/icon/home.png">
            Home~
        </a>
        <a nav-action="saved" class="${style['mobile-nav-item']}" href="/app/saved">
            <img class="${style['simple-icon']}" src="./images/icon/save.png">
            Saved
        </a>
        <a nav-action="friends" class="${style['mobile-nav-item']}" href="/app/friends">
            <img class="${style['simple-icon']}" src="./images/icon/group.png">
            Friends
        </a>
        <a nav-action="settings" class="${style['mobile-nav-item']}" href="/app/settings">
            <img class="${style['simple-icon']}" src="./images/icon/settings.png">
            Settings
        </a>
        <a nav-action="log-out" class="${style['mobile-nav-item']}" href="/app/log-out">
            <img class="${style['simple-icon']}" src="./images/icon/logout.png">
            Log Out
        </a>
    </nav>
    `;
}

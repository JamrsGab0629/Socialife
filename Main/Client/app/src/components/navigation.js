export default function Navigation(root) {
    root.innerHTML = `
        <!-- SIDEBAR -->
        <aside class="sidebar">
            <a id="refresh" href="./skeleton.html" class="logo">
                <img id="main-logo" class="stamp" src="./images/Socialife-stamp.png" alt="Socialife-stamp">
                <img class="script" src="./images/Socialife-script.png" alt="Socialife-script">
            </a>

            <a nav-action="profile" id="profile-nav" href="/home">
                <div class="profile-block">
                    <div class="avatar-ring"><img src="./images/profile/James.jpg" alt="James Gabriel Santos"></div>
                    <div class="profile-name">James Gabriel Santos</div>
                </div>
            </a>

            <nav class="nav">
                <a nav-action="home" class="nav-item" href="/home">
                    <img class="simple-icon" src="./images/icon/home.png">
                    Home
                </a>
                <a nav-action="saved" class="nav-item" href="/saved">
                    <img class="simple-icon" src="./images/icon/save.png">
                    Saved
                </a>
                <a nav-action="friends" class="nav-item" href="/friends">
                    <img class="simple-icon" src="./images/icon/group.png">
                    Friends
                </a>
                <a nav-action="settings" class="nav-item" href="/settings">
                    <img class="simple-icon" src="./images/icon/settings.png">
                    Settings
                </a>
                <a nav-action="log-out" class="nav-item" href="/log-out">
                    <img class="simple-icon" src="./images/icon/logout.png">
                    Log Out
                </a>
            </nav>
        </aside>

    <!-- MOBILE BOTTOM NAV -->
    <nav class="mobile-bottom-nav">
        <a nav-action="home" class="mobile-nav-item" href="/home">
            <img class="simple-icon" src="./images/icon/home.png">
            Home~
        </a>
        <a nav-action="saved" class="mobile-nav-item" href="saved">
            <img class="simple-icon" src="./images/icon/save.png">
            Saved
        </a>
        <a nav-action="friends" class="mobile-nav-item" href="friends">
            <img class="simple-icon" src="./images/icon/group.png">
            Friends
        </a>
        <a nav-action="settings" class="mobile-nav-item" href="/settings">
            <img class="simple-icon" src="./images/icon/settings.png">
            Settings
        </a>
        <a nav-action="log-out" class="mobile-nav-item" href="/log-out">
            <img class="simple-icon" src="./images/icon/logout.png">
            Log Out
        </a>
    </nav>
    `;
}

class SocialifeSidebar extends HTMLElement {
    connectedCallback() {
        const activeTab = this.getAttribute('active') || this._getAutoActiveTab();
        const userName = this.getAttribute('user-name') || 'James Gabriel Santos';
        const userAvatar = this.getAttribute('user-avatar') || '../images/profile/James.jpg';

        const navItems = [
            { id: 'home', label: 'Home', icon: '../images/icon/home.png', href: 'home.html' },
            { id: 'saved', label: 'Saved', icon: '../images/icon/save.png', href: 'saved.html' },
            { id: 'friends', label: 'Friends', icon: '../images/icon/group.png', href: 'profile.html' },
            { id: 'settings', label: 'Settings', icon: '../images/icon/settings.png', href: 'settings.html' },
            { id: 'log-out', label: 'Log Out', icon: '../images/icon/logout.png', href: '#' }
        ];

        this.innerHTML = `
            <aside class="sidebar">
                <a id="refresh" href="home.html" class="logo">
                    <img id="main-logo" class="stamp" src="../images/Socialife-stamp.png" alt="Socialife Stamp">
                    <img class="script" src="../images/Socialife-script.png" alt="Socialife Script">
                </a>

                <a nav-action="profile" id="profile-nav" href="profile.html">
                    <div class="profile-block">
                        <div class="avatar-ring">
                            <img src="${userAvatar}" alt="${userName}">
                        </div>
                        <div class="profile-name">${userName}</div>
                    </div>
                </a>

                <nav class="nav">
                    ${navItems.map(item => `
                        <a nav-action="${item.id}" 
                           class="nav-item ${activeTab === item.id ? 'active' : ''}" 
                           href="${item.href}">
                            <img class="simple-icon" src="${item.icon}" alt="${item.label}">
                            ${item.label}
                        </a>
                    `).join('')}
                </nav>
            </aside>
        `;
    }

    _getAutoActiveTab() {
        const path = window.location.pathname.toLowerCase();
        if (path.includes('settings')) return 'settings';
        if (path.includes('saved')) return 'saved';
        if (path.includes('friends') || path.includes('profile')) return 'friends';
        return 'home';
    }
}

customElements.define('socialife-sidebar', SocialifeSidebar);
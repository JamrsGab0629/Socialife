class SocialifeMobileNav extends HTMLElement {
    connectedCallback() {
        const activeTab = this.getAttribute('active') || 'home';

        const navItems = [
            { id: 'home', label: 'Home', icon: '../images/icon/home.png', href: 'home.html' },
            { id: 'saved', label: 'Saved', icon: '../images/icon/save.png', href: 'saved.html' },
            { id: 'friends', label: 'Friends', icon: '../images/icon/group.png', href: 'friends.html' },
            { id: 'settings', label: 'Settings', icon: '../images/icon/settings.png', href: 'settings.html' },
            { id: 'log-out', label: 'Log Out', icon: '../images/icon/logout.png', href: '#' }
        ];

        this.innerHTML = `
            <nav class="mobile-bottom-nav">
                ${navItems.map(item => `
                    <a nav-action="${item.id}" 
                       class="mobile-nav-item ${activeTab === item.id ? 'active' : ''}" 
                       href="${item.href}">
                        <img class="simple-icon" src="${item.icon}" alt="${item.label}">
                        ${item.label}
                    </a>
                `).join('')}
            </nav>
        `;
    }
}

customElements.define('socialife-mobile-nav', SocialifeMobileNav);
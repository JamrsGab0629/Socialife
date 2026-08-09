class SettingsItem extends HTMLElement {
    connectedCallback() {
        const icon = this.getAttribute('icon') || '';
        const title = this.getAttribute('title') || '';
        const desc = this.getAttribute('desc') || '';
        const action = this.getAttribute('action') || '';
        const type = this.getAttribute('type') || 'link'; // 'link' | 'toggle'
        const isDanger = this.hasAttribute('danger');
        const toggleId = this.getAttribute('toggle-id') || '';

        if (type === 'toggle') {
            this.innerHTML = `
                <div class="settings-item dark-mode-row">
                    <img class="settings-icon" src="${icon}" alt="${title}">
                    <div class="item-content">
                        <div class="item-title">${title}</div>
                        <div class="item-desc">${desc}</div>
                    </div>
                    <div class="toggle-wrap">
                        <div class="toggle" id="${toggleId}" role="button" tabindex="0" aria-label="${title}">
                            <span class="toggle-knob"></span>
                        </div>
                    </div>
                </div>
            `;
            return;
        }

        this.innerHTML = `
            <a class="settings-item" href="#" data-action="${action}">
                <img class="settings-icon" src="${icon}" alt="${title}">
                <div class="item-content">
                    <div class="item-title ${isDanger ? 'text-danger' : ''}">${title}</div>
                    <div class="item-desc">${desc}</div>
                </div>
                <span class="item-chevron">›</span>
            </a>
        `;
    }
}

customElements.define('settings-item', SettingsItem);
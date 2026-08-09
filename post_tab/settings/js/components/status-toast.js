class StatusToast extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<div class="status-message"></div>`;
        this.messageEl = this.querySelector('.status-message');
        this.timeoutId = null;
    }

    show(message, type = 'show', duration = 4000) {
        if (!this.messageEl) return;

        this.messageEl.textContent = message;
        this.messageEl.className = `status-message ${type}`;

        if (this.timeoutId) clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => this.hide(), duration);
    }

    hide() {
        if (this.messageEl) {
            this.messageEl.className = 'status-message';
            this.messageEl.textContent = '';
        }
    }
}

customElements.define('status-toast', StatusToast);
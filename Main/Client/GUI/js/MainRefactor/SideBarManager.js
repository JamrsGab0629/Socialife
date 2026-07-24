    export class SideBarManagement{
        constructor(config = {}){
            this.selectors = {
                menuToggle: config.menuToggleId || 'menu-toggle',
                sidebar: config.sidebarId || 'sidebar',
                mainContent: config.mainContentId || 'main-content',
                overlay: config.overlayId || 'overlay',
            };
            this.mobileQueryStr = config.mobileQuery || '(max-width: 768px)';
            this.mediaQuery = window.matchMedia(this.mobileQueryStr);
            this.abortController = new AbortController();

            this.init();
        }


        getElements() {
        try {
        const elements = {
            menuToggle: document.getElementById(this.selectors.menuToggle),
            sidebar: document.getElementById(this.selectors.sidebar),
            mainContent: document.getElementById(this.selectors.mainContent),
            overlay: document.getElementById(this.selectors.overlay),
        };

        Object.entries(elements).forEach(([key, el]) => {
            if (!el) throw new Error(`Missing DOM element: #${this.selectors[key]}`);
        });

        return elements;
        } catch (error) {
        console.error(`[Error Catching] Initialization failed: ${error.message}`);
        return null;
        }
    }
    init() {
        this.dom = this.getElements();
        if (!this.dom) return;

        this.bindEvents();
        this.setInitialState();
        console.log('[Activity Log] SidebarManager initialized.');
    }

    isMobile() {
        return this.mediaQuery.matches;
    }
    }
<<<<<<< HEAD
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
    isSidebarOpen() {
    return !this.dom.sidebar.classList.contains('sidebar-closed');
  }

  openSidebar() {
    console.log('[Activity Log] Action: Opening sidebar');
    this.dom.sidebar.classList.remove('sidebar-closed');

    if (this.isMobile()) {
      this.dom.overlay.classList.add('overlay-active');
    } else {
      this.dom.mainContent.classList.remove('main-expanded');
    }
  }

  closeSidebar() {
    try {
      console.log('[Activity Log] Action: Closing sidebar');
      this.dom.sidebar.classList.add('sidebar-closed');
      this.dom.overlay.classList.remove('overlay-active');

      if (!this.isMobile()) {
        this.dom.mainContent.classList.add('main-expanded');
      }
    } catch (err) {
      console.error('[Error Catching] Failed to close sidebar:', err);
    }
  }

  setInitialState() {
    console.log(`[Activity Log] Setting initial state (Mobile: ${this.isMobile()})`);
    if (this.isMobile()) {
      this.closeSidebar();
    } else {
      this.dom.sidebar.classList.remove('sidebar-closed');
      this.dom.mainContent.classList.remove('main-expanded');
      this.dom.overlay.classList.remove('overlay-active');
    }
  }
  bindEvents() {
    const { signal } = this.abortController;

    this.dom.menuToggle.addEventListener('click', () => {
      this.isSidebarOpen() ? this.closeSidebar() : this.openSidebar();
    }, { signal });

    this.dom.overlay.addEventListener('click', () => {
      this.closeSidebar();
    }, { signal });

    let resizeTimeout;
    let lastIsMobile = this.isMobile();

    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const nowMobile = this.isMobile();
        if (nowMobile !== lastIsMobile) {
          lastIsMobile = nowMobile;
          this.setInitialState();
        }
      }, 150);
    }, { signal });
  }

  destroy() {
    this.abortController.abort();
  }
}
    
=======
export class SidebarManager {
  constructor(config = {}) {
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

  isSidebarOpen() {
    return !this.dom.sidebar.classList.contains('sidebar-closed');
  }

  openSidebar() {
    console.log('[Activity Log] Action: Opening sidebar');
    this.dom.sidebar.classList.remove('sidebar-closed');

    if (this.isMobile()) {
      this.dom.overlay.classList.add('overlay-active');
    } else {
      this.dom.mainContent.classList.remove('main-expanded');
    }
  }

  closeSidebar() {
    console.log('[Activity Log] Action: Closing sidebar');
    this.dom.sidebar.classList.add('sidebar-closed');
    this.dom.overlay.classList.remove('overlay-active');

    if (!this.isMobile()) {
      this.dom.mainContent.classList.add('main-expanded');
    }
  }

  setInitialState() {
    if (this.isMobile()) {
      this.closeSidebar();
    } else {
      this.dom.sidebar.classList.remove('sidebar-closed');
      this.dom.mainContent.classList.remove('main-expanded');
      this.dom.overlay.classList.remove('overlay-active');
    }
  }

  bindEvents() {
    const { signal } = this.abortController;

    this.dom.menuToggle.addEventListener('click', () => {
      this.isSidebarOpen() ? this.closeSidebar() : this.openSidebar();
    }, { signal });

    this.dom.overlay.addEventListener('click', () => {
      this.closeSidebar();
    }, { signal });

    let resizeTimeout;
    let lastIsMobile = this.isMobile();

    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const nowMobile = this.isMobile();
        if (nowMobile !== lastIsMobile) {
          lastIsMobile = nowMobile;
          this.setInitialState();
        }
      }, 150);
    }, { signal });
  }

  destroy() {
    this.abortController.abort();
  }
}
>>>>>>> d99a73c590e4d38b5677bfc2f3b03d6a673723dd

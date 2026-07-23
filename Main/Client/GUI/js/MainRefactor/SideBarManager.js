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

}
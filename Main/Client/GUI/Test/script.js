const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('main-content');
const overlay = document.getElementById('overlay');

const MOBILE_QUERY = '(max-width: 768px)';

function isMobile() {
    return window.matchMedia(MOBILE_QUERY).matches;
}

function openSidebar() {
    sidebar.classList.remove('sidebar-closed');
    if (isMobile()) {
        overlay.classList.add('overlay-active');
    } else {
        mainContent.classList.remove('main-expanded');
    }
}

function closeSidebar() {
    sidebar.classList.add('sidebar-closed');
    overlay.classList.remove('overlay-active');
    if (!isMobile()) {
        mainContent.classList.add('main-expanded');
    }
}

function isSidebarOpen() {
    return !sidebar.classList.contains('sidebar-closed');
}

menuToggle.addEventListener('click', () => {
    if (isSidebarOpen()) {
        closeSidebar();
    } else {
        openSidebar();
    }
});


overlay.addEventListener('click', () => {
    closeSidebar();
});


function setInitialState() {
    if (isMobile()) {
        closeSidebar(); 
    } else {
        sidebar.classList.remove('sidebar-closed');
        mainContent.classList.remove('main-expanded');
        overlay.classList.remove('overlay-active');
    }
}

setInitialState();


let lastIsMobile = isMobile();
window.addEventListener('resize', () => {
    const nowMobile = isMobile();
    if (nowMobile !== lastIsMobile) {
        lastIsMobile = nowMobile;
        setInitialState();
    }
    // to commit to push
});
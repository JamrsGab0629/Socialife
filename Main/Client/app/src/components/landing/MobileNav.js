export default function MobileNav() {
    const navWrap = document.getElementById('navWrap');
    const onScroll = () => {
        navWrap.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const navBurger = document.getElementById('navBurger');
    const navMobile = document.getElementById('navMobile');

    navBurger.addEventListener('click', () => {
        const isOpen = navMobile.classList.toggle('is-open');
        navBurger.setAttribute('aria-expanded', String(isOpen));
    });

    navMobile.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMobile.classList.remove('is-open');
            navBurger.setAttribute('aria-expanded', 'false');
        });
    });
}
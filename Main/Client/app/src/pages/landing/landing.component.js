import style from "./landing.module.css"

export default function Component() {
    const navWrap = document.getElementById('navWrap');
    const onScroll = () => {
        navWrap.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const navBurger = document.getElementById('navBurger');
    const navMobile = document.getElementById('navMobile');

    navBurger.addEventListener('click', () => {
        const isOpen = navMobile.classList.toggle(`${style['is-open']}`);
        navBurger.setAttribute('aria-expanded', String(isOpen));
    });

    navMobile.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMobile.classList.remove('is-open');
            navBurger.setAttribute('aria-expanded', 'false');
        });
    });

    document.querySelectorAll('.faq-item').forEach(item => {
        const btn = item.querySelector('.faq-q');
        const answer = item.querySelector('.faq-a');

        const openItem = () => {
            btn.setAttribute('aria-expanded', 'true');
            answer.style.maxHeight = answer.scrollHeight + 'px';
        };

        const closeItem = () => {
            btn.setAttribute('aria-expanded', 'false');
            answer.style.maxHeight = null;
        };

        item.addEventListener('mouseenter', openItem);
        item.addEventListener('mouseleave', closeItem);
        btn.addEventListener('focus', openItem);
        btn.addEventListener('blur', closeItem);
    });
}
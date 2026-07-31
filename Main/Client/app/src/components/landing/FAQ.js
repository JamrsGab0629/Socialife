export default function FAQ() {
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
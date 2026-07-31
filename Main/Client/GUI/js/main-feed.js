window.addEventListener('DOMContentLoaded', () => {
    const populator = new lazy_populator(document);
    const postMap = new Map();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const contentInstance = postMap.get(entry.target);
            if (!contentInstance) return;

            if (entry.isIntersecting) {
                contentInstance.is_visible();
            } else {
                contentInstance.is_outside();
            }
        });
    }, { rootMargin: '150px 0p  x'});

    // Helper to register new post elements
    function attachPosts(elements) {
        elements.forEach((element) => {
            if (!postMap.has(element)) {
                const instance = new content(element);
                postMap.set(element, instance);
                observer.observe(element);
            }
        });
    }

    // Attach initial posts if present in raw HTML
    attachPosts(document.querySelectorAll('.post-card'));

    // 2. Infinite Scroll Trigger
    async function checkScrollPosition() {
        const scrollBottom = window.innerHeight + window.scrollY;
        const threshold = document.documentElement.scrollHeight - 400;

        if (scrollBottom >= threshold) {
            const newCardElements = await populator.next_batch();
            attachPosts(newCardElements);
        }
    }

    // Load first batch on startup if main feed is empty
    checkScrollPosition();

    // Throttled scroll listener
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                checkScrollPosition();
                ticking = false;
            });
            ticking = true;
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {

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

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navHeight = navWrap.offsetHeight + 16;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
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

  const formatStat = (value) => {
    if (value >= 1000000) return (value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1) + 'M';
    if (value >= 1000) return Math.round(value / 1000) + 'K';
    return String(value);
  };

  const animateCounter = (el, target) => {
    const duration = 1600;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatStat(Math.floor(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = formatStat(target);
    };
    requestAnimationFrame(tick);
  };

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const wrapper = entry.target;
      const target = Number(wrapper.dataset.target);
      const numEl = wrapper.querySelector('.stat-num');
      animateCounter(numEl, target);
      statObserver.unobserve(wrapper);
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.stat').forEach(stat => statObserver.observe(stat));

});
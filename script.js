/* IHEC Code-Lab - interactions (standalone)
   Works with the existing HTML/CSS template.
*/

(() => {
  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));

  // Navbar background on scroll
  const navbar = qs('#navbar');
  const updateNavbar = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // Mobile nav toggle
  const navToggle = qs('#navToggle');
  const navMenu = qs('#navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });

    // Close menu on link click
    qsa('a.nav-link', navMenu).forEach((a) => {
      a.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });
  }

  // Smooth scroll (fallback)
  qsa('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href.length < 2) return;
      const target = qs(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Scroll to top button
  const scrollTopBtn = qs('#scrollTopBtn');
  const updateScrollTop = () => {
    if (!scrollTopBtn) return;
    scrollTopBtn.classList.toggle('show', window.scrollY > 500);
  };
  window.addEventListener('scroll', updateScrollTop, { passive: true });
  updateScrollTop();
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Animated counters
  const animateCounters = () => {
    const els = qsa('[data-count]');
    if (!('IntersectionObserver' in window)) {
      els.forEach(runCounter);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          runCounter(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );
    els.forEach((el) => obs.observe(el));
  };

  function runCounter(el) {
    if (!el) return;
    const to = Number(el.getAttribute('data-count') || '0');
    const duration = 1100;
    const start = performance.now();
    const from = 0;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const value = Math.floor(from + (to - from) * (t * (2 - t)));
      el.textContent = value.toLocaleString('fr-FR');
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  animateCounters();

  // Modal helpers used by inline HTML onclick
  const modal = qs('#contactModal');
  const modalPackageName = qs('#modalPackageName');
  const modalClose = qs('.close-modal');

  window.openContactModal = (pkgName) => {
    if (!modal) return;
    if (modalPackageName) modalPackageName.textContent = pkgName ? `Package sélectionné : ${pkgName}` : '';
    modal.classList.add('open');
    document.body.classList.add('modal-open');
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // AOS init if available
  if (window.AOS && typeof window.AOS.init === 'function') {
    window.AOS.init({ duration: 850, once: true, offset: 80 });
  }

  // Particles init if available
  if (window.particlesJS) {
    window.particlesJS('particles-js', {
      particles: {
        number: { value: 55, density: { enable: true, value_area: 800 } },
        color: { value: '#ffffff' },
        opacity: { value: 0.25 },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 140, opacity: 0.12 },
        move: { enable: true, speed: 2 }
      },
      interactivity: {
        events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' } },
        modes: { repulse: { distance: 120 }, push: { particles_nb: 2 } }
      },
      retina_detect: true
    });
  }
})();

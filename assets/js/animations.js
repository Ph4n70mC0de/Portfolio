// === animations.js ===
// IntersectionObserver scroll animations, loader, back-to-top, custom cursor

(function () {
  'use strict';

  let revealObserver = null;
  let countObserver = null;

  /**
   * Initialize scroll reveal animations
   */
  function initRevealAnimations() {
    const elements = document.querySelectorAll('[data-animate]');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('animated'));
      return;
    }

    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    elements.forEach((el) => revealObserver.observe(el));
  }

  /**
   * Initialize stagger animations
   */
  function initStaggerAnimations() {
    const elements = document.querySelectorAll('[data-stagger]');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('animated'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));
  }

  /**
   * Animate a number from 0 to target
   * @param {HTMLElement} el
   */
  function countUp(el) {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (target === 0) return;
    const duration = 1500;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(t);
      const value = Math.floor(eased * target);
      el.textContent = formatNumber(value);
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = formatNumber(target);
      }
    }

    requestAnimationFrame(step);
  }

  /**
   * Initialize count-up animations on stat cards
   */
  function initCountUp() {
    const stats = document.querySelectorAll('.stat-card__number[data-count]');
    if (!stats.length) return;

    if (!('IntersectionObserver' in window)) {
      stats.forEach((s) => {
        s.textContent = formatNumber(parseInt(s.getAttribute('data-count'), 10) || 0);
      });
      return;
    }

    countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            countUp(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    stats.forEach((s) => countObserver.observe(s));
  }

  /**
   * Initialize back-to-top button
   */
  function initBackToTop() {
    const btn = document.getElementById('btnTop');
    if (!btn) return;

    const onScroll = throttle(() => {
      if (window.scrollY > 400) {
        btn.classList.add('btn-top--visible');
      } else {
        btn.classList.remove('btn-top--visible');
      }
    }, 100);

    window.addEventListener('scroll', onScroll, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /**
   * Initialize custom cursor (desktop only)
   */
  function initCustomCursor() {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (prefersReducedMotion()) return;

    const cursor = document.getElementById('cursor');
    const dot = cursor && cursor.querySelector('.cursor__dot');
    const ring = cursor && cursor.querySelector('.cursor__ring');
    if (!cursor || !dot || !ring) return;

    document.body.classList.add('cursor-active');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    const speed = 0.18;
    let rafId = null;
    let visible = false;

    function move() {
      ringX = lerp(ringX, mouseX, speed);
      ringY = lerp(ringY, mouseY, speed);
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(move);
    }

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) {
        visible = true;
        cursor.style.opacity = '1';
        move();
      }
    });

    document.addEventListener('mouseleave', () => {
      visible = false;
      cursor.style.opacity = '0';
      if (rafId) cancelAnimationFrame(rafId);
    });

    document.addEventListener('mouseenter', () => {
      visible = true;
      cursor.style.opacity = '1';
      move();
    });

    // Hoverable elements
    const hoverableSelector = 'a, button, [data-hover], .project-card, .tech-badge, .stat-card, .skill-bar, .timeline__card, .contact-info-card, .contact__form-card, .filter-btn, .skills__tab, .exp-tab';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest && e.target.closest(hoverableSelector)) {
        cursor.classList.add('cursor--hover');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest && e.target.closest(hoverableSelector)) {
        cursor.classList.remove('cursor--hover');
      }
    });
  }

  /**
   * Hide the loader after a brief moment
   */
  function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    if (prefersReducedMotion()) {
      loader.classList.add('loader--hidden');
      setTimeout(() => {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, 100);
      return;
    }

    const hideLoader = () => {
      loader.classList.add('loader--hidden');
      setTimeout(() => {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, 600);
    };

    if (document.readyState === 'complete') {
      setTimeout(hideLoader, 800);
    } else {
      window.addEventListener('load', () => {
        setTimeout(hideLoader, 800);
      });
    }
  }

  /**
   * Hero section load animations
   */
  function initHeroAnimations() {
    const heroContent = document.querySelector('.hero__content');
    if (!heroContent) return;

    if (prefersReducedMotion()) {
      heroContent.querySelectorAll('[data-animate]').forEach((el) => el.classList.add('animated'));
      return;
    }

    // Add stagger to hero children
    const items = heroContent.children;
    Array.from(items).forEach((item, idx) => {
      if (!item.hasAttribute('data-animate')) {
        item.setAttribute('data-animate', 'fade-up');
        item.style.setProperty('--delay', `${idx * 0.1}s`);
      }
    });

    // Trigger on page load
    setTimeout(() => {
      heroContent.querySelectorAll('[data-animate]').forEach((el) => {
        el.classList.add('animated');
      });
    }, 100);
  }

  /**
   * Initialize all animations
   */
  function init() {
    initLoader();
    initHeroAnimations();
    initRevealAnimations();
    initStaggerAnimations();
    initCountUp();
    initBackToTop();
    initCustomCursor();
  }

  window.Animations = { init, countUp };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// === navigation.js ===
// Nav scroll, mobile menu, active states, hide-on-scroll

(function () {
  'use strict';

  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks = document.querySelectorAll('.nav__link');
  const mobileLinks = document.querySelectorAll('.nav__mobile-link');
  const sections = document.querySelectorAll('main section[id]');

  let lastScrollY = window.scrollY;
  let isMenuOpen = false;
  let backdrop = null;

  function createBackdrop() {
    backdrop = document.createElement('div');
    backdrop.className = 'nav__backdrop';
    document.body.appendChild(backdrop);
    backdrop.addEventListener('click', closeMobileMenu);
  }

  function openMobileMenu() {
    if (!mobileMenu || !hamburger) return;
    isMenuOpen = true;
    mobileMenu.classList.add('nav__mobile--open');
    hamburger.classList.add('hamburger--open');
    hamburger.setAttribute('aria-expanded', 'true');
    if (backdrop) backdrop.classList.add('nav__backdrop--active');
    document.body.style.overflow = 'hidden';

    if (window.trapFocus) window.trapFocus(mobileMenu);
  }

  function closeMobileMenu() {
    if (!mobileMenu || !hamburger) return;
    isMenuOpen = false;
    mobileMenu.classList.remove('nav__mobile--open');
    hamburger.classList.remove('hamburger--open');
    hamburger.setAttribute('aria-expanded', 'false');
    if (backdrop) backdrop.classList.remove('nav__backdrop--active');
    document.body.style.overflow = '';

    if (window.releaseFocus) window.releaseFocus(mobileMenu);
  }

  function toggleMobileMenu() {
    if (isMenuOpen) closeMobileMenu();
    else openMobileMenu();
  }

  function handleScroll() {
    const currentY = window.scrollY;
    const scrollDown = currentY > lastScrollY;

    if (currentY > 50) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }

    if (!isMenuOpen) {
      if (scrollDown && currentY > 300) {
        nav.classList.add('nav--hidden');
      } else {
        nav.classList.remove('nav--hidden');
      }
    }

    lastScrollY = currentY;
  }

  function setActiveLink() {
    const scrollY = window.scrollY;
    const navHeight = parseInt(getCSSVar('--nav-height'), 10) || 72;

    let currentId = '';
    sections.forEach((section) => {
      const top = section.offsetTop - navHeight - 100;
      const bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        currentId = section.id;
      }
    });

    if (!currentId) {
      currentId = sections[0] ? sections[0].id : '';
    }

    navLinks.forEach((link) => {
      const target = link.getAttribute('data-section');
      if (target === currentId) {
        link.classList.add('nav__link--active');
      } else {
        link.classList.remove('nav__link--active');
      }
    });
  }

  function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;
    const navHeight = parseInt(getCSSVar('--nav-height'), 10) || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  function init() {
    if (!nav) return;

    createBackdrop();

    if (hamburger) {
      hamburger.addEventListener('click', toggleMobileMenu);
    }

    mobileLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href') || '';
        if (href.startsWith('#')) {
          e.preventDefault();
          const id = href.slice(1);
          smoothScrollTo(id);
          closeMobileMenu();
        }
      });
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href') || '';
        if (href.startsWith('#')) {
          e.preventDefault();
          const id = href.slice(1);
          smoothScrollTo(id);
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMobileMenu();
      }
    });

    const onScroll = throttle(() => {
      handleScroll();
      setActiveLink();
    }, 100);

    window.addEventListener('scroll', onScroll, { passive: true });
    setActiveLink();
    handleScroll();
  }

  window.Navigation = { init, openMobileMenu, closeMobileMenu, smoothScrollTo };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

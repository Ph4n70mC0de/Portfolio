// === skills.js ===
// Skills tab switching + skill bar fill animations

(function () {
  'use strict';

  let barObserver = null;
  const animatedPanels = new Set();

  /**
   * Switch active tab and panel
   */
  function switchTab(target) {
    const tabs = document.querySelectorAll('.skills__tab');
    const panels = document.querySelectorAll('.skills__panel');

    tabs.forEach((t) => {
      t.classList.remove('skills__tab--active');
      t.setAttribute('aria-selected', 'false');
    });
    panels.forEach((p) => {
      p.classList.remove('skills__panel--active');
      p.setAttribute('aria-hidden', 'true');
      p.setAttribute('tabindex', '-1');
    });

    const activeTab = document.querySelector(`.skills__tab[data-tab="${target}"]`);
    const activePanel = document.querySelector(`.skills__panel[data-panel="${target}"]`);

    if (activeTab) {
      activeTab.classList.add('skills__tab--active');
      activeTab.setAttribute('aria-selected', 'true');
    }
    if (activePanel) {
      activePanel.classList.add('skills__panel--active');
      activePanel.setAttribute('aria-hidden', 'false');
      activePanel.setAttribute('tabindex', '0');
      // Move focus to the active panel for screen reader experience
      activePanel.focus({ preventScroll: true });
      // Re-trigger bar animations for the new panel
      animateBarsInPanel(activePanel);
    }
  }

  /**
   * Animate skill bars within a panel
   * Only animates if bars haven't already reached their target width
   */
  function animateBarsInPanel(panel) {
    if (!panel) return;
    const bars = panel.querySelectorAll('.skill-bar');
    bars.forEach((bar, idx) => {
      const fill = bar.querySelector('.skill-bar__fill');
      if (!fill) return;
      const width = fill.getAttribute('data-width') || '0';
      const delay = idx * 0.1;
      bar.classList.remove('skill-bar--visible');
      // Disable transition, reset to 0%, force reflow, re-enable transition
      fill.style.transition = 'none';
      fill.style.width = '0%';
      fill.offsetWidth; // force reflow
      // Re-enable transition with staggered delay and animate to target
      fill.style.transition = `width 1.2s var(--ease-out) ${delay}s`;
      fill.style.width = width + '%';
      bar.classList.add('skill-bar--visible');
    });
  }

  /**
   * Setup tab click handlers
   */
  function initTabs() {
    const tabs = document.querySelectorAll('.skills__tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');
        if (target) switchTab(target);
      });

      // Keyboard navigation
      tab.addEventListener('keydown', (e) => {
        const tabsArray = Array.from(tabs);
        const currentIndex = tabsArray.indexOf(tab);

        let nextIndex;
        switch (e.key) {
          case 'ArrowRight':
            nextIndex = (currentIndex + 1) % tabsArray.length;
            tabsArray[nextIndex].focus();
            e.preventDefault();
            break;
          case 'ArrowLeft':
            nextIndex = (currentIndex - 1 + tabsArray.length) % tabsArray.length;
            tabsArray[nextIndex].focus();
            e.preventDefault();
            break;
          case 'Home':
            tabsArray[0].focus();
            e.preventDefault();
            break;
          case 'End':
            tabsArray[tabsArray.length - 1].focus();
            e.preventDefault();
            break;
          case 'Enter':
          case ' ':
            tab.click();
            e.preventDefault();
            break;
        }
      });
    });
  }

  /**
   * Observe and animate skill bars on first view (initial active panel)
   */
  function initBarObserver() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: just animate all visible bars
      const activePanel = document.querySelector('.skills__panel--active');
      if (activePanel) animateBarsInPanel(activePanel);
      return;
    }

    barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const panel = entry.target.closest('.skills__panel') ||
                          entry.target;
            if (panel.classList && panel.classList.contains('skills__panel--active')) {
              animateBarsInPanel(panel);
            } else {
              animateBarsInPanel(entry.target);
            }
            if (barObserver) {
              barObserver.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
      barObserver.observe(skillsSection);
    }
  }

  /**
   * Initialize skills module
   */
  function init() {
    initTabs();
    initBarObserver();
  }

  window.Skills = { init, switchTab, animateBarsInPanel };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
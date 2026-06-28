// === main.js ===
// App initialization orchestrator

(function () {
  'use strict';

  /**
   * Initialize the application
   */
  function init() {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const typewriterEl = document.getElementById('typewriter');
    if (typewriterEl && window.TypeWriter) {
      const tw = new window.TypeWriter(typewriterEl, [
        'beautiful interfaces',
        'scalable backends',
        'smart REST APIs',
        'pixel-perfect UIs',
        'great user experiences',
      ], {
        typeSpeed: 90,
        deleteSpeed: 50,
        pauseAfterType: 2200,
        pauseAfterDelete: 500,
      });
      setTimeout(() => tw.start(), 600);
    }

    initExperienceTabs();
    logIntro();
  }

  /**
   * Switch between work and education timelines
   */
  function initExperienceTabs() {
    const tabs = document.querySelectorAll('.exp-tab');
    const workTimeline = document.getElementById('workTimeline');
    const educationTimeline = document.getElementById('educationTimeline');

    if (!tabs.length) return;

    function switchExpTab(target) {
      // Update ARIA and classes on tabs
      tabs.forEach((t) => {
        const isTarget = t.getAttribute('data-exp') === target;
        t.classList.toggle('exp-tab--active', isTarget);
        t.setAttribute('aria-selected', isTarget ? 'true' : 'false');
      });

      // Toggle timelines and manage ARIA
      if (target === 'work') {
        if (workTimeline) {
          workTimeline.classList.remove('timeline--hidden');
          workTimeline.setAttribute('aria-hidden', 'false');
          workTimeline.setAttribute('tabindex', '0');
        }
        if (educationTimeline) {
          educationTimeline.classList.add('timeline--hidden');
          educationTimeline.setAttribute('aria-hidden', 'true');
          educationTimeline.setAttribute('tabindex', '-1');
        }
      } else if (target === 'education') {
        if (workTimeline) {
          workTimeline.classList.add('timeline--hidden');
          workTimeline.setAttribute('aria-hidden', 'true');
          workTimeline.setAttribute('tabindex', '-1');
        }
        if (educationTimeline) {
          educationTimeline.classList.remove('timeline--hidden');
          educationTimeline.setAttribute('aria-hidden', 'false');
          educationTimeline.setAttribute('tabindex', '0');
        }
      }
    }

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-exp');
        if (target) switchExpTab(target);
      });

      // Keyboard navigation (ArrowLeft/Right, Home, End, Enter, Space)
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
   * Print intro easter egg
   */
  function logIntro() {
    console.log('Portfolio site - open to work');
  }

  // Initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

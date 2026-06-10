// === theme.js ===
// Dark/light theme toggle with localStorage persistence

(function () {
  'use strict';

  const THEME_KEY = 'portfolio-theme';

  /**
   * Get the user's preferred theme from localStorage or system preferences
   * @returns {string} 'dark' or 'light'
   */
  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }

  /**
   * Apply the theme to the document body
   * @param {string} theme - 'dark' or 'light'
   */
  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.setAttribute('aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      toggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    }
  }

  /**
   * Toggle between dark and light themes
   */
  function toggleTheme() {
    const current = document.body.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';

    // Trigger smooth transition
    document.body.classList.add('theme-transitioning');
    applyTheme(next);

    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) {
      // localStorage may not be available
    }

    // Remove transition class after transition ends
    setTimeout(() => {
      document.body.classList.remove('theme-transitioning');
    }, 500);
  }

  /**
   * Initialize theme system
   */
  function init() {
    const theme = getPreferredTheme();
    applyTheme(theme);

    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.addEventListener('click', toggleTheme);
    }

    // Listen for system preference changes (only if no manual override)
    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: light)');
      mq.addEventListener('change', (e) => {
        try {
          if (!localStorage.getItem(THEME_KEY)) {
            applyTheme(e.matches ? 'light' : 'dark');
          }
        } catch (err) {
          // ignore
        }
      });
    }
  }

  // Expose for main.js
  window.ThemeManager = { init, toggleTheme, applyTheme, getPreferredTheme };

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

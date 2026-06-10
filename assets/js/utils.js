// === utils.js ===
// Shared utility functions

/**
 * Debounce: delays execution until after `wait` ms of no calls
 * @param {Function} fn - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(fn, wait = 300) {
  let timeoutId;
  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), wait);
  };
}

/**
 * Throttle: ensures fn is called at most once per `wait` ms
 * @param {Function} fn - Function to throttle
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(fn, wait = 100) {
  let lastCall = 0;
  let lastTimeout = null;
  return function throttled(...args) {
    const now = Date.now();
    const remaining = wait - (now - lastCall);
    if (remaining <= 0) {
      if (lastTimeout) {
        clearTimeout(lastTimeout);
        lastTimeout = null;
      }
      lastCall = now;
      fn.apply(this, args);
    } else if (!lastTimeout) {
      lastTimeout = setTimeout(() => {
        lastCall = Date.now();
        lastTimeout = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
}

/**
 * Linear interpolation
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} factor - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

/**
 * Clamp a number between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum
 * @param {number} max - Maximum
 * @returns {number} Clamped value
 */
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} el - Element to check
 * @param {number} threshold - Threshold percentage (0-1)
 * @returns {boolean} True if element is in viewport
 */
function isInViewport(el, threshold = 0) {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  const vertInView = (rect.top <= windowHeight * (1 - threshold)) &&
                      ((rect.top + rect.height) >= windowHeight * threshold);
  const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);
  return vertInView && horInView;
}

/**
 * Get a CSS custom property value from :root
 * @param {string} name - CSS variable name (with --)
 * @returns {string} The computed value
 */
function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * Format number with commas (1234 → 1,234)
 * @param {number} n - Number
 * @returns {string} Formatted string
 */
function formatNumber(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Detect if user prefers reduced motion
 * @returns {boolean} True if reduced motion is preferred
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Wait for a given number of ms
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>}
 */
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Easing function: easeOutQuart
 * @param {number} t - Progress 0-1
 * @returns {number} Eased value
 */
function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

/**
 * Easing function: easeInOutCubic
 * @param {number} t - Progress 0-1
 * @returns {number} Eased value
 */
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Trap focus inside a container
 * @param {HTMLElement} container - Container element
 */
function trapFocus(container) {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');
  const focusable = container.querySelectorAll(focusableSelectors);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  container._trapHandler = (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };
  container.addEventListener('keydown', container._trapHandler);
  first.focus();
}

/**
 * Release focus trap
 * @param {HTMLElement} container - Container element
 */
function releaseFocus(container) {
  if (container && container._trapHandler) {
    container.removeEventListener('keydown', container._trapHandler);
    delete container._trapHandler;
  }
}

/**
 * Sanitize text for safe HTML insertion
 * @param {string} str - Input string
 * @returns {string} Sanitized string
 */
function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

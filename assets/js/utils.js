// Shared utility functions

function debounce(fn, wait = 300) {
  let timeoutId;
  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), wait);
  };
}

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

function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

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

function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function formatNumber(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

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

function releaseFocus(container) {
  if (container && container._trapHandler) {
    container.removeEventListener('keydown', container._trapHandler);
    delete container._trapHandler;
  }
}

function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

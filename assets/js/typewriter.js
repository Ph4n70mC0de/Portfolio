// === typewriter.js ===
// Typewriter effect engine

class TypeWriter {
  /**
   * Create a typewriter instance
   * @param {HTMLElement} element - Target element
   * @param {string[]} words - Array of strings to cycle through
   * @param {Object} options - Configuration options
   */
  constructor(element, words = [], options = {}) {
    this.element = element;
    this.words = words;
    this.options = Object.assign(
      {
        typeSpeed: 100,
        deleteSpeed: 60,
        pauseAfterType: 2000,
        pauseAfterDelete: 500,
        loop: true,
      },
      options
    );

    this.wordIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.isPaused = false;
    this.timer = null;
  }

  /**
   * Type a character
   */
  type() {
    const current = this.words[this.wordIndex] || '';
    if (this.isDeleting) {
      this.charIndex = Math.max(0, this.charIndex - 1);
    } else {
      this.charIndex = Math.min(current.length, this.charIndex + 1);
    }

    // Update text with cursor-like effect
    this.element.textContent = current.substring(0, this.charIndex);

    let delay = this.isDeleting ? this.options.deleteSpeed : this.options.typeSpeed;

    // Add random jitter for natural feel
    if (!this.isDeleting) {
      delay += Math.random() * 50;
    }

    // Word complete
    if (!this.isDeleting && this.charIndex === current.length) {
      this.isDeleting = true;
      delay = this.options.pauseAfterType;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.wordIndex = (this.wordIndex + 1) % this.words.length;
      delay = this.options.pauseAfterDelete;
    }

    this.timer = setTimeout(() => this.type(), delay);
  }

  /**
   * Start the typewriter loop
   */
  start() {
    if (!this.element || !this.words.length) return;
    if (window.prefersReducedMotion && window.prefersReducedMotion()) {
      this.element.textContent = this.words[0];
      return;
    }
    this.stop();
    this.type();
  }

  /**
   * Stop the typewriter
   */
  stop() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

// Expose globally
window.TypeWriter = TypeWriter;

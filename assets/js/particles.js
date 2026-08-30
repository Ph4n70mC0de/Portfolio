// Canvas particle system with connection lines and mouse interaction

(function () {
  'use strict';

  class Particle {
    constructor(x, y, canvas) {
      this.canvas = canvas;
      this.x = x;
      this.y = y;
      this.size = Math.random() * 2 + 1;
      this.baseSize = this.size;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.3;
      this.colorIndex = Math.floor(Math.random() * 3);
      this.colors = [
        'rgba(108, 99, 255, ',
        'rgba(0, 212, 255, ',
        'rgba(0, 255, 136, ',
      ];
    }

    update(mouse) {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > window.innerWidth) this.x = 0;
      else if (this.x < 0) this.x = window.innerWidth;
      if (this.y > window.innerHeight) this.y = 0;
      else if (this.y < 0) this.y = window.innerHeight;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          this.x += (dx / dist) * force * 1.5;
          this.y += (dy / dist) * force * 1.5;
        }
      }
    }

    draw(ctx) {
      ctx.fillStyle = this.colors[this.colorIndex] + this.opacity + ')';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  class ParticleSystem {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.particleCount = 80;
      this.connectionDistance = 120;
      this.mouse = { x: null, y: null };
      this.rafId = null;
      this.running = false;

      this.handleResize = debounce(() => this.resize(), 200);
      this.handleMouseMove = (e) => {
        const rect = (this._hero || this.canvas).getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
      };
      this.handleMouseLeave = () => {
        this.mouse.x = null;
        this.mouse.y = null;
      };
    }

    resize() {
      const dpr = window.devicePixelRatio || 1;
      const cssWidth = window.innerWidth;
      const cssHeight = window.innerHeight;
      // Setting width/height resets the canvas (including transforms),
      // so always set dimensions first, then scale the context once.
      this.canvas.width = Math.floor(cssWidth * dpr);
      this.canvas.height = Math.floor(cssHeight * dpr);
      this.canvas.style.width = cssWidth + 'px';
      this.canvas.style.height = cssHeight + 'px';
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.particleCount = Math.min(Math.floor((cssWidth * cssHeight) / 12000), 80);
    }

    init() {
      this.particles = [];
      for (let i = 0; i < this.particleCount; i++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        this.particles.push(new Particle(x, y, this.canvas));
      }
    }

    connect() {
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const dx = this.particles[i].x - this.particles[j].x;
          const dy = this.particles[i].y - this.particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < this.connectionDistance) {
            const opacity = 1 - dist / this.connectionDistance;
            this.ctx.strokeStyle = `rgba(108, 99, 255, ${opacity * 0.25})`;
            this.ctx.lineWidth = 0.6;
            this.ctx.beginPath();
            this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
            this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
            this.ctx.stroke();
          }
        }
      }
    }

    animate() {
      if (!this.running) return;
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.particles.forEach((p) => {
        p.update(this.mouse);
        p.draw(this.ctx);
      });
      this.connect();
      this.rafId = requestAnimationFrame(() => this.animate());
    }

    start() {
      if (this.running) return;
      if (window.prefersReducedMotion && window.prefersReducedMotion()) {
        return;
      }
      this.running = true;
      this.resize();
      this.init();
      this.animate();
      window.addEventListener('resize', this.handleResize);

      // Mouse interaction must be tracked on the hero section, not the canvas
      // (the canvas sits behind content and has pointer-events: none).
      const hero = this.canvas.closest('section') || this.canvas;
      this._hero = hero;
      hero.addEventListener('mousemove', this.handleMouseMove);
      hero.addEventListener('mouseleave', this.handleMouseLeave);

      // Pause the simulation when the hero is not visible
      if ('IntersectionObserver' in window) {
        this._observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                if (!this.running) {
                  this.running = true;
                  this.animate();
                }
              } else {
                this.running = false;
                if (this.rafId) cancelAnimationFrame(this.rafId);
              }
            });
          },
          { threshold: 0.1 }
        );
        this._observer.observe(hero);
      }
    }

    stop() {
      this.running = false;
      if (this.rafId) cancelAnimationFrame(this.rafId);
      window.removeEventListener('resize', this.handleResize);
      if (this._hero) {
        this._hero.removeEventListener('mousemove', this.handleMouseMove);
        this._hero.removeEventListener('mouseleave', this.handleMouseLeave);
      }
      if (this._observer) this._observer.disconnect();
    }
  }

  window.ParticleSystem = ParticleSystem;
  window.Particle = Particle;

  function autoInit() {
    const canvas = document.getElementById('heroCanvas');
    if (canvas) {
      const ps = new ParticleSystem(canvas);
      ps.start();
      window.particleSystem = ps;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }
})();

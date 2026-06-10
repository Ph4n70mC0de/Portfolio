// === projects.js ===
// Project filtering, modal handling, and project data

(function () {
  'use strict';

  /**
   * Project data array
   */
  const PROJECTS = [
    {
      title: 'E-Commerce Platform',
      category: 'fullstack',
      categoryLabel: 'Full-Stack',
      year: 2024,
      description: 'A full-featured online store with cart, payments (Stripe), and admin dashboard.',
      longDesc: 'Built a complete e-commerce platform from scratch with user authentication, product catalog, shopping cart, Stripe payment integration, order management, and a comprehensive admin dashboard for inventory and analytics. Implemented server-side rendering for SEO and performance.',
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      liveUrl: '#',
      githubUrl: '#',
      imageHue: 260,
    },
    {
      title: 'Analytics Dashboard',
      category: 'frontend',
      categoryLabel: 'Frontend',
      year: 2024,
      description: 'Real-time analytics dashboard with interactive charts and data visualization.',
      longDesc: 'Designed and developed a responsive analytics dashboard featuring real-time data streaming via WebSockets, interactive D3.js charts, custom date range filters, and exportable reports. Focused on performance with virtualized lists handling 10K+ data points.',
      tags: ['React', 'TypeScript', 'D3.js'],
      liveUrl: '#',
      githubUrl: '#',
      imageHue: 200,
    },
    {
      title: 'Task Management App',
      category: 'fullstack',
      categoryLabel: 'Full-Stack',
      year: 2023,
      description: 'Collaborative project management tool with real-time updates and team workflows.',
      longDesc: 'A Kanban-style project management application with drag-and-drop, real-time collaboration via WebSockets, file attachments, comments, and granular permission controls. Built with a focus on accessibility (WCAG AA compliant).',
      tags: ['Vue.js', 'Express', 'PostgreSQL'],
      liveUrl: '#',
      githubUrl: '#',
      imageHue: 180,
    },
    {
      title: 'RESTful API Service',
      category: 'backend',
      categoryLabel: 'Backend',
      year: 2023,
      description: 'A scalable REST API with rate limiting, caching, and OAuth2 authentication.',
      longDesc: 'Designed and built a production-grade RESTful API serving 50K+ requests/day. Features include OAuth2 authentication, JWT tokens, Redis caching, rate limiting, comprehensive OpenAPI documentation, and 99.9% uptime.',
      tags: ['Python', 'FastAPI', 'Redis'],
      liveUrl: '#',
      githubUrl: '#',
      imageHue: 320,
    },
    {
      title: 'Portfolio Builder',
      category: 'frontend',
      categoryLabel: 'Frontend',
      year: 2023,
      description: 'A no-code portfolio builder with drag-and-drop UI and custom domain support.',
      longDesc: 'Built a fully-featured portfolio website builder with a drag-and-drop interface, multiple templates, custom domain support, and one-click publishing. Frontend built with React and a custom rendering engine for performance.',
      tags: ['React', 'Next.js', 'GraphQL'],
      liveUrl: '#',
      githubUrl: '#',
      imageHue: 30,
    },
    {
      title: 'AI Code Review Bot',
      category: 'backend',
      categoryLabel: 'Backend',
      year: 2024,
      description: 'An AI-powered code review bot that integrates with GitHub pull requests.',
      longDesc: 'Developed a serverless GitHub App that automatically reviews pull requests, suggests improvements, detects security vulnerabilities, and provides contextual learning resources. Processes 500+ PRs weekly across open-source communities.',
      tags: ['Node.js', 'OpenAI', 'AWS'],
      liveUrl: '#',
      githubUrl: '#',
      imageHue: 140,
    },
  ];

  /**
   * Filter projects by category
   */
  function filterProjects(category) {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card) => {
      const cardCategory = card.getAttribute('data-category');
      if (category === 'all' || cardCategory === category) {
        card.classList.remove('project-card--hidden', 'project-card--fading');
      } else {
        card.classList.add('project-card--fading');
        setTimeout(() => card.classList.add('project-card--hidden'), 250);
      }
    });
  }

  /**
   * Initialize filter buttons
   */
  function initFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('filter-btn--active'));
        btn.classList.add('filter-btn--active');
        const filter = btn.getAttribute('data-filter') || 'all';
        filterProjects(filter);
      });
    });
  }

  /**
   * Populate modal with project data
   */
  function openModal(index) {
    const project = PROJECTS[index];
    if (!project) return;
    const modal = document.getElementById('projectModal');
    const content = document.getElementById('modalContent');
    if (!modal || !content) return;

    const tagsHtml = project.tags
      .map((t) => `<span class="tag">${sanitize(t)}</span>`)
      .join('');

    content.innerHTML = `
      <div class="modal__hero" style="--modal-hue: ${project.imageHue}">
        <span class="modal__hero-letter">${sanitize(project.title.charAt(0))}</span>
      </div>
      <span class="modal__category">${sanitize(project.categoryLabel)} · ${project.year}</span>
      <h2 class="modal__title">${sanitize(project.title)}</h2>
      <p class="modal__description">${sanitize(project.longDesc)}</p>
      <div class="modal__tags">${tagsHtml}</div>
      <div class="modal__links">
        <a href="${project.liveUrl}" target="_blank" rel="noopener" class="btn btn--primary btn--sm">Live Demo ↗</a>
        <a href="${project.githubUrl}" target="_blank" rel="noopener" class="btn btn--ghost btn--sm">GitHub ↗</a>
      </div>
    `;

    modal.classList.add('modal--open');
    document.body.classList.add('modal-open');

    if (window.trapFocus) {
      window.trapFocus(modal.querySelector('.modal__panel'));
    }
  }

  /**
   * Close the project modal
   */
  function closeModal() {
    const modal = document.getElementById('projectModal');
    if (!modal) return;
    modal.classList.remove('modal--open');
    document.body.classList.remove('modal-open');

    if (window.releaseFocus) {
      window.releaseFocus(modal.querySelector('.modal__panel'));
    }
  }

  /**
   * Initialize view button click handlers
   */
  function initViewButtons() {
    const buttons = document.querySelectorAll('.project-card__view-btn');
    buttons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const index = parseInt(btn.getAttribute('data-project'), 10);
        openModal(index);
      });
    });
  }

  /**
   * Initialize modal close handlers
   */
  function initModalClose() {
    const closeBtn = document.getElementById('modalClose');
    const backdrop = document.getElementById('modalBackdrop');

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  /**
   * Initialize all project functionality
   */
  function init() {
    initFilters();
    initViewButtons();
    initModalClose();
  }

  window.Projects = { init, openModal, closeModal, filterProjects, PROJECTS };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

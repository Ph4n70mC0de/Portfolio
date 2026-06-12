# Contributing to Jonny Candes Portfolio

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this portfolio project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. Be kind, constructive, and professional in all interactions.

## Getting Started

1. Fork the repository
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/portfolio.git
   cd portfolio
   ```
3. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## How to Contribute

Contributions are welcome in the following areas:

- **Bug fixes** - Fix issues with existing functionality
- **Accessibility improvements** - Enhance WCAG compliance and keyboard navigation
- **Performance optimizations** - Improve loading speed or runtime efficiency
- **Responsive design fixes** - Address mobile/tablet layout issues
- **New features** - Add functionality that aligns with the portfolio's design language
- **Documentation** - Improve comments, README, or create new documentation

## Development Setup

This project requires no build tools or package managers. It uses pure HTML, CSS, and JavaScript.

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Basic knowledge of HTML5, CSS3, and JavaScript (ES6+)

### Running Locally

```bash
# Using Python's built-in HTTP server
python -m http.server 8000

# Or using Node.js serve package
npx serve .

# Or using any static server of your choice
```

Then open `http://localhost:8000` in your browser.

## Project Structure

```
Portfolio/
├── index.html              # Main entry point
├── resume.pdf              # Downloadable CV
├── assets/
│   ├── css/
│   │   ├── base.css        # Base styles and resets
│   │   ├── variables.css   # Design tokens (colors, typography, spacing)
│   │   ├── layout.css      # Grid and layout utilities
│   │   ├── components.css  # Reusable component styles
│   │   ├── animations.css  # Animation keyframes and utilities
│   │   ├── responsive.css  # Media queries and breakpoints
│   │   └── sections/       # Section-specific styles
│   └── js/
│       ├── main.js         # App initialization
│       ├── theme.js        # Dark/light theme toggle
│       ├── navigation.js   # Mobile menu and smooth scrolling
│       ├── typewriter.js   # Typing animation effect
│       ├── animations.js   # Scroll-triggered animations
│       ├── skills.js       # Skills tab switching
│       ├── projects.js     # Project filtering and modals
│       ├── contact.js      # Contact form handling
│       ├── particles.js    # Hero section particle effects
│       └── utils.js        # Shared utility functions
└── assets/images/
    ├── profile/            # Profile images
    ├── projects/           # Project screenshots
    └── icons/              # Icons and favicons
```

## Coding Standards

### HTML

- Use semantic HTML5 elements (`<header>`, `<main>`, `<section>`, `<article>`, etc.)
- Include proper ARIA attributes for accessibility
- Follow the existing indentation style (2 spaces)
- Use descriptive, kebab-case class names

### CSS

- Use CSS custom properties (variables) defined in `variables.css` for consistent design tokens
- Follow the BEM methodology for class naming where appropriate
- Place section-specific styles in `assets/css/sections/`
- Use the existing spacing, typography, and color variables
- Ensure responsive styles work across all breakpoints (`--bp-sm`, `--bp-md`, `--bp-lg`, `--bp-xl`)

### JavaScript

- Use strict mode (`'use strict'`)
- Follow the existing IIFE pattern for module isolation
- All code should be vanilla JavaScript (no frameworks or libraries)
- Use `const` and `let` instead of `var`
- Follow camelCase naming convention
- Include JSDoc comments for functions
- Ensure keyboard accessibility and ARIA compliance

### Accessibility

- Maintain WCAG 2.1 AA compliance
- Ensure all interactive elements are keyboard accessible
- Provide proper ARIA labels and roles
- Maintain sufficient color contrast (use the existing color variables)
- Test with screen readers and keyboard-only navigation

## Commit Guidelines

- Write clear, descriptive commit messages
- Use present tense ("Add feature" not "Added feature")
- Reference issues where applicable
- Keep commits focused and atomic

Example:
```bash
git commit -m "Fix mobile navigation menu closing on item click"
```

## Pull Request Process

1. Update the README.md or documentation if you've changed functionality
2. Ensure your changes work across all supported browsers
3. Test accessibility with keyboard navigation
4. Create a pull request with a clear description of changes
5. Wait for review and address any feedback

### PR Requirements

- All code should pass validation (no console errors in browser dev tools)
- No breaking changes to existing functionality
- Maintain backward compatibility

## Reporting Issues

If you find a bug or have a feature request:

1. Check existing issues to avoid duplicates
2. Create a new issue with:
   - A clear, descriptive title
   - Steps to reproduce (for bugs)
   - Expected vs. actual behavior
   - Browser and OS information
   - Screenshots (if applicable)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to this portfolio! Your efforts help maintain and improve this project.
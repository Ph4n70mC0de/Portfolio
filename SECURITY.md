# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ---------------- |
| main    | :white_check_mark: |

This is a static portfolio website with no server-side code or databases. Security updates are applied to the main branch.

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability in this portfolio, please report it responsibly.

### How to Report

**Please do not open a public issue for security vulnerabilities.** Instead, report directly to the maintainer:

- Email: arjscandes73@gmail.com

### What to Include

- A description of the vulnerability
- Steps to reproduce the issue
- Potential impact assessment
- Any suggested fixes (optional)

### Response Timeline

- Acknowledgment within 48 hours
- Initial assessment within 1 week
- Resolution timeline depends on severity and complexity

### Security Considerations

This project is a static HTML/CSS/JavaScript portfolio website. The main security considerations are:

- **Client-side security**: All code runs in the browser
- **No user data collection**: No forms submit data to servers
- **No authentication**: No user accounts or login systems
- **Static hosting**: Deployed via Vercel with standard security headers

If you discover XSS, injection, or other client-side vulnerabilities, please report them immediately.

## Best Practices for Contributors

- Never include sensitive data (API keys, passwords, secrets) in commits
- Sanitize any user input if adding interactive features
- Follow accessibility and security guidelines in the codebase
- Review the existing code patterns in `assets/js/utils.js` for sanitization utilities

## Security Headers

The portfolio is deployed on Vercel with the following security headers recommended:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https://code.iconify.design
```

## Third-Party Dependencies

This project uses:

- **Iconify** - CDN-hosted icon library (`https://code.iconify.design/iconify-icon/1.0.8/iconify-icon.min.js`)

These are loaded via trusted CDN and are subject to their own security policies.

---

Thank you for helping keep this portfolio secure!
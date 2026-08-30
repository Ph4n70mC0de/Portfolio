// === contact.js ===
// Contact form validation, character counter, submission handler

(function () {
  'use strict';

  const CONFIG = {
    formspreeEndpoint: 'https://formspree.io/f/mqpkaoba',
    email: 'arjscandes73@gmail.com',
    maxMessageLength: 500,
    minMessageLength: 10,
    minNameLength: 2,
    minSubjectLength: 3,
  };

  const RULES = {
    name: {
      minLength: CONFIG.minNameLength,
      required: true,
      validate: (v) => v.trim().length >= CONFIG.minNameLength,
      message: 'Name must be at least 2 characters',
    },
    email: {
      required: true,
      validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      message: 'Please enter a valid email address',
    },
    subject: {
      required: true,
      minLength: CONFIG.minSubjectLength,
      validate: (v) => v.trim().length >= CONFIG.minSubjectLength,
      message: 'Subject must be at least 3 characters',
    },
    message: {
      required: true,
      minLength: CONFIG.minMessageLength,
      maxLength: CONFIG.maxMessageLength,
      validate: (v) => v.trim().length >= CONFIG.minMessageLength,
      message: `Message must be at least ${CONFIG.minMessageLength} characters`,
    },
  };

  let form, nameInput, emailInput, subjectInput, messageInput;
  let charCount, submitBtn, successEl, resetBtn;

  function getErrorEl(field) {
    return document.getElementById(field + 'Error');
  }

  function setError(field, message) {
    const input = document.getElementById('contact' + field.charAt(0).toUpperCase() + field.slice(1));
    const errorEl = getErrorEl(field);
    if (input) {
      input.classList.add('form-input--error', 'form-textarea--error');
      input.setAttribute('aria-invalid', 'true');
    }
    if (errorEl) errorEl.textContent = message;
  }

  function clearError(field) {
    const input = document.getElementById('contact' + field.charAt(0).toUpperCase() + field.slice(1));
    const errorEl = getErrorEl(field);
    if (input) {
      input.classList.remove('form-input--error', 'form-textarea--error');
      input.setAttribute('aria-invalid', 'false');
    }
    if (errorEl) errorEl.textContent = '';
  }

  function validateField(field) {
    const rule = RULES[field];
    if (!rule) return true;
    const input = document.getElementById('contact' + field.charAt(0).toUpperCase() + field.slice(1));
    if (!input) return true;
    const value = input.value;

    if (rule.required && !value.trim()) {
      setError(field, 'This field is required');
      return false;
    }

    if (rule.validate && !rule.validate(value)) {
      setError(field, rule.message);
      return false;
    }

    clearError(field);
    return true;
  }

  function validateAll() {
    let valid = true;
    let firstInvalid = null;
    Object.keys(RULES).forEach((field) => {
      if (!validateField(field)) {
        valid = false;
        if (!firstInvalid) {
          firstInvalid = document.getElementById(
            'contact' + field.charAt(0).toUpperCase() + field.slice(1)
          );
        }
      }
    });
    // Move focus to the first invalid field so keyboard and screen reader
    // users land directly on the problem.
    if (firstInvalid) firstInvalid.focus();
    return valid;
  }

  function updateCharCount() {
    if (!messageInput || !charCount) return;
    const len = messageInput.value.length;
    charCount.textContent = len;

    charCount.parentElement.classList.remove('form-char-count--warn', 'form-char-count--danger');
    if (len >= CONFIG.maxMessageLength) {
      charCount.parentElement.classList.add('form-char-count--danger');
    } else if (len > CONFIG.maxMessageLength - 50) {
      charCount.parentElement.classList.add('form-char-count--warn');
    }
  }

  let isSubmitting = false;

  async function submitForm() {
    if (isSubmitting) return;
    isSubmitting = true;

    if (!validateAll()) {
      if (submitBtn) {
        submitBtn.classList.add('shake');
        setTimeout(() => submitBtn.classList.remove('shake'), 500);
      }
      isSubmitting = false;
      return;
    }

    if (!submitBtn || !form) {
      isSubmitting = false;
      return;
    }

    const formData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      subject: subjectInput.value.trim(),
      message: messageInput.value.trim(),
      _subject: `Portfolio Contact: ${subjectInput.value.trim()}`,
    };

    submitBtn.classList.add('btn--loading');
    submitBtn.disabled = true;
    [nameInput, emailInput, subjectInput, messageInput].forEach((i) => {
      if (i) i.disabled = true;
    });

    try {
      if (CONFIG.formspreeEndpoint) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(CONFIG.formspreeEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Form submission failed');
        }
      } else {
        await wait(1500);
        const mailto = `mailto:${CONFIG.email}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
          `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
        )}`;
        window.location.href = mailto;
      }

      showSuccess();
    } catch (err) {
      submitBtn.classList.remove('btn--loading');
      submitBtn.disabled = false;
      [nameInput, emailInput, subjectInput, messageInput].forEach((i) => {
        if (i) i.disabled = false;
      });
      showMessageError('Sorry, something went wrong. Please email me directly at ' + CONFIG.email);
    } finally {
      isSubmitting = false;
    }
  }

  function showMessageError(text) {
    const errorEl = getErrorEl('message');
    if (errorEl) errorEl.textContent = text;
  }

  function showSuccess() {
    if (form) form.style.display = 'none';
    if (successEl) successEl.style.display = 'block';
    // Move focus to the success heading so it is announced by screen readers
    const heading = document.getElementById('contactSuccessTitle');
    if (heading) heading.focus();
  }

  function resetForm() {
    if (form) form.style.display = '';
    if (successEl) successEl.style.display = 'none';
    if (form) form.reset();
    Object.keys(RULES).forEach(clearError);
    if (submitBtn) {
      submitBtn.classList.remove('btn--loading');
      submitBtn.disabled = false;
    }
    [nameInput, emailInput, subjectInput, messageInput].forEach((i) => {
      if (i) i.disabled = false;
    });
    updateCharCount();
  }

  function setupFieldListeners() {
    Object.keys(RULES).forEach((field) => {
      const input = document.getElementById('contact' + field.charAt(0).toUpperCase() + field.slice(1));
      if (!input) return;

      input.addEventListener('blur', () => {
        if (input.value.trim()) validateField(field);
      });

      input.addEventListener('focus', () => clearError(field));
    });

    if (messageInput) {
      messageInput.addEventListener('input', updateCharCount);
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        submitForm();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', resetForm);
    }
  }

  function init() {
    form = document.getElementById('contactForm');
    nameInput = document.getElementById('contactName');
    emailInput = document.getElementById('contactEmail');
    subjectInput = document.getElementById('contactSubject');
    messageInput = document.getElementById('contactMessage');
    charCount = document.getElementById('charCount');
    submitBtn = document.getElementById('contactSubmit');
    successEl = document.getElementById('contactSuccess');
    resetBtn = document.getElementById('contactReset');

    if (!form || !submitBtn) return;

    setupFieldListeners();
    updateCharCount();
  }

  window.Contact = { init, validateField, validateAll, resetForm };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

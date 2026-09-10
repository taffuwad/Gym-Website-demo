/* ================================================================
   CONTACT FORM VALIDATION & SUBMISSION
   ================================================================ */

(function() {
    'use strict';

    const form = document.getElementById('contactForm');
    if (!form) return;

    const submitBtn = document.querySelector('.form-submit');
    const fields = {
        name: document.getElementById('contactName'),
        email: document.getElementById('contactEmail'),
        phone: document.getElementById('contactPhone'),
        subject: document.getElementById('contactSubject'),
        message: document.getElementById('contactMessage')
    };

    const rules = [
        {
            fieldId: 'contactName',
            validate: (value) => {
                const trimmed = value.trim();
                if (!trimmed) return 'Please enter your full name.';
                if (trimmed.length < 2) return 'Name must be at least 2 characters.';
                return '';
            }
        },
        {
            fieldId: 'contactEmail',
            validate: (value) => {
                const trimmed = value.trim();
                if (!trimmed) return 'Please enter your email address.';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
                if (!emailRegex.test(trimmed)) return 'Please enter a valid email address.';
                return '';
            }
        },
        {
            fieldId: 'contactSubject',
            validate: (value) => {
                if (!value) return 'Please select a subject.';
                return '';
            }
        },
        {
            fieldId: 'contactMessage',
            validate: (value) => {
                const trimmed = value.trim();
                if (!trimmed) return 'Please enter your message.';
                if (trimmed.length < 10) return 'Message must be at least 10 characters.';
                return '';
            }
        }
    ];

    function getFieldGroup(fieldId) {
        const field = document.getElementById(fieldId);
        return field ? field.closest('.form-group') : null;
    }

    function showError(fieldId, message) {
        const group = getFieldGroup(fieldId);
        const errorEl = document.getElementById(`${fieldId}-error`);
        if (!group || !errorEl) return;

        group.classList.add('has-error');
        errorEl.textContent = message;
    }

    function clearError(fieldId) {
        const group = getFieldGroup(fieldId);
        const errorEl = document.getElementById(`${fieldId}-error`);
        if (!group || !errorEl) return;

        group.classList.remove('has-error');
        errorEl.textContent = '';
    }

    // Live re-validation for fields that have already errored
    rules.forEach(rule => {
        const field = document.getElementById(rule.fieldId);
        if (!field) return;

        const revalidate = () => {
            const group = getFieldGroup(rule.fieldId);
            if (!group || !group.classList.contains('has-error')) return;

            const message = rule.validate(field.value);
            if (message) {
                showError(rule.fieldId, message);
            } else {
                clearError(rule.fieldId);
            }
        };

        field.addEventListener('input', revalidate);
        field.addEventListener('change', revalidate);

        field.addEventListener('blur', () => {
            if (field.value === '') return;
            const message = rule.validate(field.value);
            if (message) {
                showError(rule.fieldId, message);
            } else {
                clearError(rule.fieldId);
            }
        });
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (submitBtn.disabled) return; // Prevent duplicate submission

        let firstInvalid = null;

        // Validate all required fields
        rules.forEach(rule => {
            const field = document.getElementById(rule.fieldId);
            if (!field) return;

            const message = rule.validate(field.value);
            if (message) {
                showError(rule.fieldId, message);
                if (!firstInvalid) firstInvalid = field;
            } else {
                clearError(rule.fieldId);
            }
        });

        // If there are validation errors, focus the first one
        if (firstInvalid) {
            if (typeof firstInvalid.focus === 'function') {
                firstInvalid.focus({ preventScroll: true });
            }
            firstInvalid.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            return;
        }

        // Set loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('is-loading');
        submitBtn.setAttribute('aria-busy', 'true');

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Here you would normally send the data to your backend
            // Example:
            // fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         name: fields.name.value,
            //         email: fields.email.value,
            //         phone: fields.phone.value,
            //         subject: fields.subject.value,
            //         message: fields.message.value
            //     })
            // }).then(r => r.json()).then(data => {
            //     form.reset();
            //     submitBtn.disabled = false;
            //     submitBtn.classList.remove('is-loading');
            //     alert('Message sent successfully!');
            // }).catch(err => {
            //     alert('Failed to send message. Please try again.');
            //     submitBtn.disabled = false;
            //     submitBtn.classList.remove('is-loading');
            // });

            // For demo purposes, just reset and show success
            form.reset();
            submitBtn.disabled = false;
            submitBtn.classList.remove('is-loading');
            submitBtn.setAttribute('aria-busy', 'false');

            // Show success message
            const successMessage = document.createElement('div');
            successMessage.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #C9A24D;
                color: #080A0B;
                padding: 16px 24px;
                border-radius: 8px;
                font-weight: 600;
                z-index: 9999;
                animation: slideIn 300ms ease;
            `;
            successMessage.textContent = '✓ Message sent successfully!';
            document.body.appendChild(successMessage);

            setTimeout(() => {
                successMessage.style.animation = 'slideOut 300ms ease';
                setTimeout(() => successMessage.remove(), 300);
            }, 3000);
        }, 1500);
    });

})();

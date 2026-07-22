/**
 * API API — main.js
 * Vanilla JS: renders the fire-rating icons from data attributes so the
 * menu markup in index.html stays readable. Alpine.js (loaded via CDN in
 * index.html) owns the nav scroll state, mobile menu, and reservation form.
 */

document.addEventListener('DOMContentLoaded', () => {
  const MAX_FLAMES = 4;

  document.querySelectorAll('[data-fire-rating]').forEach((el) => {
    const rating = el.getAttribute('data-fire-rating');

    // Desserts: one snowflake, no flames — the joke is the point.
    if (rating === 'snow') {
      el.innerHTML =
        '<svg class="w-5 h-5 text-heat" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
        '<use href="#icon-snowflake"></use></svg>';
      el.setAttribute('role', 'img');
      el.setAttribute('aria-label', 'Served chilled — no flame');
      return;
    }

    const level = Math.min(Math.max(parseInt(rating, 10) || 0, 0), MAX_FLAMES);
    let markup = '';

    for (let i = 1; i <= MAX_FLAMES; i++) {
      let colorClass = 'text-bone/15';
      if (i <= level) {
        // The hottest ratings (3-4) top out in heat gold, not ember.
        colorClass = i === level && level >= 3 ? 'text-heat' : 'text-ember';
      }
      markup +=
        `<svg class="w-4 h-4 ${colorClass}" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">` +
        '<use href="#icon-flame"></use></svg>';
    }

    el.innerHTML = markup;
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', `${level} out of ${MAX_FLAMES} flames`);
  });
});

/**
 * Alpine component: reservation form.
 * Client-side only — no backend. Validates required fields and email
 * format, then swaps the form for an inline confirmation message.
 *
 * Registered on the `alpine:init` event (rather than relying on script
 * load order) so it's always available before Alpine scans the DOM,
 * regardless of whether Alpine or main.js finishes loading first.
 */
document.addEventListener('alpine:init', () => {
  Alpine.data('reservationForm', () => ({
    form: {
      name: '',
      email: '',
      partySize: '2',
      date: '',
      time: '19:00',
      occasion: '',
    },
    errors: {},
    submitted: false,

    validate() {
      this.errors = {};

      if (!this.form.name.trim()) {
        this.errors.name = 'Tell us who to expect.';
      }

      if (!this.form.email.trim()) {
        this.errors.email = 'We need an email to confirm.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email.trim())) {
        this.errors.email = 'That email doesn’t look right.';
      }

      if (!this.form.date) {
        this.errors.date = 'Pick a date.';
      }

      return Object.keys(this.errors).length === 0;
    },

    submit() {
      if (this.validate()) {
        this.submitted = true;
      }
    },
  }));
});

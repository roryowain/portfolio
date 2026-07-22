// Lakeline Dental Studio — Alpine components
// IMPORTANT: this file is loaded BEFORE the Alpine CDN script in index.html.
// Components register on 'alpine:init' so they exist before Alpine's
// deferred boot scans the DOM — registering any later would be missed.

document.addEventListener('alpine:init', () => {

  // Mobile hamburger overlay nav
  Alpine.data('mobileNav', () => ({
    open: false,
  }));

  // FAQ accordion — single-open, CSS grid-template-rows collapse (no plugin)
  Alpine.data('faqAccordion', () => ({
    open: null,
    toggle(index) {
      this.open = this.open === index ? null : index;
    },
  }));

  // Multi-step booking form
  Alpine.data('bookingForm', () => ({
    step: 1,
    error: '',
    submitted: false,
    data: {
      patientType: '',
      reason: '',
      time: '',
      name: '',
      email: '',
      phone: '',
    },

    next() {
      if (!this.validateStep(this.step)) return;
      this.error = '';
      this.step += 1;
    },

    back() {
      this.error = '';
      this.step -= 1;
    },

    validateStep(step) {
      if (step === 1) {
        if (!this.data.patientType) {
          this.error = 'Let us know if you’re new or returning.';
          return false;
        }
      }
      if (step === 2) {
        if (!this.data.reason) {
          this.error = 'Please choose a reason for your visit.';
          return false;
        }
        if (!this.data.time) {
          this.error = 'Please choose a preferred time.';
          return false;
        }
      }
      return true;
    },

    validateContact() {
      const name = this.data.name.trim();
      const email = this.data.email.trim();
      const phone = this.data.phone.trim();

      if (name.length < 2) {
        this.error = 'Please enter your full name.';
        return false;
      }
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        this.error = 'Please enter a valid email address.';
        return false;
      }
      const digits = phone.replace(/\D/g, '');
      if (digits.length < 10) {
        this.error = 'Please enter a valid phone number.';
        return false;
      }
      return true;
    },

    submit() {
      if (!this.validateContact()) return;
      this.error = '';
      this.submitted = true;
    },
  }));

});

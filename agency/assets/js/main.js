/**
 * Studio Kilat — main.js
 * Two Alpine components: a live Kuala Lumpur clock for the nav, and the
 * Selected Work accordion (one row open at a time). Registered before
 * Alpine boots via alpine:init, per Alpine's documented pattern.
 */

document.addEventListener('alpine:init', () => {
  // --- Nav clock -----------------------------------------------------
  // Kuala Lumpur sits at a fixed UTC+8 with no DST, but we still ask
  // Intl for the timezone conversion rather than hardcoding the offset
  // in case a visitor's system clock is off from UTC.
  Alpine.data('kilatClock', () => ({
    time: '',
    formatter: null,

    init() {
      this.formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kuala_Lumpur',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      this.tick();
      // A minute resolution is honest for a "current time" widget and
      // avoids a once-a-second re-render for no visible benefit.
      setInterval(() => this.tick(), 1000 * 30);
    },

    tick() {
      this.time = this.formatter.format(new Date());
    },
  }));

  // --- Selected Work accordion ----------------------------------------
  // Only one case study open at a time. Rows are real <button> elements
  // with aria-expanded so the accordion is keyboard- and screenreader-
  // operable, not just clickable.
  Alpine.data('workList', () => ({
    open: null,

    toggle(id) {
      this.open = this.open === id ? null : id;
    },

    isOpen(id) {
      return this.open === id;
    },
  }));
});

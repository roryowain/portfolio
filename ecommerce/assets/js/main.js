/*
  TANAH — main.js
  Alpine store for cart + buy box, plus the vanilla-JS scroll-progress
  driver for the "From Tanah to Cup" journey line. No build step, no
  framework beyond Alpine (loaded via CDN in index.html).
*/

document.addEventListener('alpine:init', () => {
  /* ---------------------------------------------------------------
     Cart store — shared by the nav badge, the buy box and the drawer.
     Persisted to localStorage so a refresh doesn't lose the cart.
  --------------------------------------------------------------- */
  Alpine.store('cart', {
    items: JSON.parse(localStorage.getItem('tanah-cart') || '[]'),
    open: false,

    persist() {
      localStorage.setItem('tanah-cart', JSON.stringify(this.items));
    },

    addItem(item) {
      const existing = this.items.find((i) => i.key === item.key);
      if (existing) {
        existing.qty += item.qty;
      } else {
        this.items.push(item);
      }
      this.persist();
    },

    incItem(key) {
      const item = this.items.find((i) => i.key === key);
      if (item) item.qty += 1;
      this.persist();
    },

    decItem(key) {
      const item = this.items.find((i) => i.key === key);
      if (item) {
        item.qty -= 1;
        if (item.qty <= 0) this.removeItem(key);
      }
      this.persist();
    },

    removeItem(key) {
      this.items = this.items.filter((i) => i.key !== key);
      this.persist();
    },

    get count() {
      return this.items.reduce((sum, i) => sum + i.qty, 0);
    },

    get subtotal() {
      const total = this.items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
      return Math.round(total * 100) / 100;
    },
  });

  /* ---------------------------------------------------------------
     Buy box component — grind + size + quantity + subscription.
  --------------------------------------------------------------- */
  Alpine.data('tanahBuyBox', () => ({
    grinds: ['Whole bean', 'Espresso', 'V60', 'French press'],
    grind: 'Whole bean',
    sizes: [
      { id: '250g', label: '250g', price: 42 },
      { id: '500g', label: '500g', price: 78 },
      { id: '1kg', label: '1kg', price: 145 },
    ],
    sizeId: '250g',
    qty: 1,
    subscribe: false,
    justAdded: false,

    get size() {
      return this.sizes.find((s) => s.id === this.sizeId);
    },

    get unitPrice() {
      const base = this.size.price;
      return this.subscribe ? Math.round(base * 0.85 * 100) / 100 : base;
    },

    get lineTotal() {
      return Math.round(this.unitPrice * this.qty * 100) / 100;
    },

    formatPrice(n) {
      return Number.isInteger(n) ? `RM ${n}` : `RM ${n.toFixed(2)}`;
    },

    incQty() {
      if (this.qty < 99) this.qty += 1;
    },

    decQty() {
      if (this.qty > 1) this.qty -= 1;
    },

    addToCart() {
      const item = {
        key: `${this.grind}-${this.sizeId}-${this.subscribe ? 'sub' : 'one'}`,
        name: `TANAH · ${this.size.label} · ${this.grind}`,
        grind: this.grind,
        size: this.size.label,
        unitPrice: this.unitPrice,
        qty: this.qty,
        subscribe: this.subscribe,
      };
      this.$store.cart.addItem(item);
      this.$store.cart.open = true;
      this.justAdded = true;
      setTimeout(() => (this.justAdded = false), 1600);
    },
  }));
});

/* ---------------------------------------------------------------
   In-page anchor links (nav, hero CTAs, footer) smooth-scroll to
   their target. Scoped to click handling rather than a blanket
   `html { scroll-behavior: smooth }`, which would hijack every
   scroll on the page (wheel, keyboard, browser find-in-page).
--------------------------------------------------------------- */
(function initAnchorScroll() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    history.pushState(null, '', `#${id}`);
  });
})();

/* ---------------------------------------------------------------
   "From Tanah to Cup" scroll journey.
   Drives a CSS custom property (--journey-progress) on the track
   element as the section scrolls through the viewport, and reveals
   each station via IntersectionObserver. Both are skipped entirely
   under prefers-reduced-motion — the CSS fallback shows a full line
   and fully visible stations with no observers attached.
--------------------------------------------------------------- */
(function initJourney() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const track = document.querySelector('[data-journey-track]');
  const stations = document.querySelectorAll('.journey-station');

  if (prefersReducedMotion || !track) return;

  let ticking = false;

  function updateProgress() {
    const rect = track.getBoundingClientRect();
    const viewportH = window.innerHeight;
    // Progress is 0 when the top of the track enters the bottom of the
    // viewport, and 1 when the bottom of the track reaches the top.
    const total = rect.height + viewportH;
    const traveled = viewportH - rect.top;
    const progress = Math.min(1, Math.max(0, traveled / total));
    track.style.setProperty('--journey-progress', progress.toFixed(4));
    ticking = false;
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    },
    { passive: true }
  );
  window.addEventListener('resize', updateProgress);
  updateProgress();

  if ('IntersectionObserver' in window && stations.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    stations.forEach((station) => observer.observe(station));
  } else {
    stations.forEach((station) => station.classList.add('is-visible'));
  }
})();

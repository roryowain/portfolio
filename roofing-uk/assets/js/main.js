/**
 * Ridge & Beam — main.js
 * Alpine components. Registered on 'alpine:init' so this file MUST be
 * loaded (as a plain <script>, not defer) BEFORE the Alpine CDN <script defer>
 * tag in index.html — otherwise Alpine boots before these components exist.
 */

document.addEventListener('alpine:init', () => {
  /* ---------------------------------------------------------------
   * KNOW YOUR ROOF — interactive cross-section
   * ------------------------------------------------------------- */
  Alpine.data('roofDiagram', () => ({
    active: 'ridge',
    parts: [
      {
        id: 'ridge',
        number: '01',
        label: 'Ridge',
        spec: 'HALF-ROUND CLAY RIDGE TILES — BEDDED IN MORTAR',
        text:
          "The ridge caps the apex where two roof slopes meet, so water can never get in at the highest, most exposed point. When the mortar bedding dries out and cracks, wind gets a purchase under the tiles and lifts them — that's usually the first thing to go on an old roof.",
      },
      {
        id: 'slate',
        number: '02',
        label: 'Slate courses',
        spec: 'WELSH SLATE — 500 × 250MM, 30° MIN PITCH, DOUBLE LAP',
        text:
          'Slates are hung in overlapping rows, or courses, so every point on the roof is covered twice over — rain never meets a single layer. The slate itself can outlast the building; it is almost always the nails holding it that corrode first, so slates slip long before the stone wears out.',
      },
      {
        id: 'lead',
        number: '03',
        label: 'Lead flashing',
        spec: 'CODE 5 LEAD — DRESSED & STEPPED, CHIMNEY ABUTMENT',
        text:
          "Lead is soft enough to be dressed tightly around chimneys, walls and anywhere a roof can't simply overlap itself, sealing the joints slates can't reach. It will outlast most of the building if left alone, but one lifted edge or a split from movement sends water straight into the brickwork below.",
      },
      {
        id: 'valley',
        number: '04',
        label: 'Valley',
        spec: 'LEAD-LINED VALLEY GUTTER — 450MM WIDE',
        text:
          'Where two roof slopes meet at an angle, the valley channels their combined water down to the gutter — far more volume than either slope carries alone. It is the first place we check on any survey, because debris collects there and can back water up under sound slates.',
      },
      {
        id: 'chimney',
        number: '05',
        label: 'Chimney & pots',
        spec: 'BRICK STACK — CLAY POTS, FLAUNCHED IN MORTAR',
        text:
          'The stack draws smoke and gases well clear of the roof, standing proud so the wind carries them away rather than back down. The flaunching — the mortar collar bedding each pot — cracks first, and once it does, rain tracks down inside the stack and appears as a stain on a ceiling nowhere near the chimney breast.',
      },
      {
        id: 'gutter',
        number: '06',
        label: 'Gutters & fascia',
        spec: 'CAST IRON OGEE GUTTER — PAINTED TIMBER FASCIA',
        text:
          'The gutter catches everything shed by the roof and carries it well away from the walls and foundations before it can pool. Once it rusts through or blocks with leaves it overflows behind the fascia board, and that is how a roof problem quietly becomes a damp problem.',
      },
    ],
    select(id) {
      this.active = id;
    },
    isActive(id) {
      return this.active === id;
    },
    currentPart() {
      return this.parts.find((p) => p.id === this.active) || this.parts[0];
    },
    // Roving keyboard navigation between hotspot buttons (left/right/up/down + tab order).
    // Note: deliberately uses direct DOM traversal from event.target rather than
    // Alpine's $refs — $refs only tracks the literal `x-ref` directive, not a
    // dynamically bound `:x-ref`, which these buttons need (one ref per x-for item).
    onKeyNav(event, index) {
      const count = this.parts.length;
      let next = null;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        next = (index + 1) % count;
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        next = (index - 1 + count) % count;
      } else {
        return;
      }
      event.preventDefault();
      this.active = this.parts[next].id;
      const container = event.target.closest('.relative');
      const buttons = container ? container.querySelectorAll('.roof-hotspot') : [];
      buttons[next]?.focus();
    },
  }));

  /* ---------------------------------------------------------------
   * QUOTE FORM — validation + inline success state
   * ------------------------------------------------------------- */
  Alpine.data('quoteForm', () => ({
    submitted: false,
    submitting: false,
    fields: {
      name: '',
      phone: '',
      email: '',
      postcode: '',
      propertyType: '',
      description: '',
    },
    errors: {},
    validate() {
      const errors = {};
      if (!this.fields.name.trim()) {
        errors.name = 'Tell us who to ask for.';
      }
      const phoneDigits = this.fields.phone.replace(/[^\d]/g, '');
      if (!this.fields.phone.trim()) {
        errors.phone = 'A phone number, please — it is the quickest way to reach you.';
      } else if (phoneDigits.length < 9) {
        errors.phone = "That doesn't look like a full phone number.";
      }
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.fields.email.trim()) {
        errors.email = 'An email address, please.';
      } else if (!emailPattern.test(this.fields.email.trim())) {
        errors.email = "That doesn't look like a valid email address.";
      }
      const postcodePattern = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;
      if (!this.fields.postcode.trim()) {
        errors.postcode = 'The property postcode, please.';
      } else if (!postcodePattern.test(this.fields.postcode.trim())) {
        errors.postcode = "That doesn't look like a UK postcode, e.g. YO1 7HH.";
      }
      if (!this.fields.propertyType) {
        errors.propertyType = 'Choose the property type nearest the mark.';
      }
      if (!this.fields.description.trim()) {
        errors.description = 'A line or two on what needs doing.';
      } else if (this.fields.description.trim().length < 10) {
        errors.description = 'A little more detail helps Dan quote accurately.';
      }
      this.errors = errors;
      return Object.keys(errors).length === 0;
    },
    submit() {
      if (!this.validate()) return;
      this.submitting = true;
      // Simulated send — this is a portfolio demo, no backend is wired up.
      window.setTimeout(() => {
        this.submitting = false;
        this.submitted = true;
      }, 600);
    },
  }));

  /* ---------------------------------------------------------------
   * MOBILE NAV — simple toggle
   * ------------------------------------------------------------- */
  Alpine.data('mobileNav', () => ({
    open: false,
    toggle() {
      this.open = !this.open;
    },
    close() {
      this.open = false;
    },
  }));
});

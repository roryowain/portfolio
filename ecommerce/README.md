# TANAH — single-product e-commerce demo

This is a portfolio showpiece: a single-product landing page for TANAH, a fictional
specialty coffee brand selling rare Liberica coffee grown in Kluang, Johor, Malaysia. It's
built with no framework and no build step — semantic HTML5, Tailwind CSS via the Play CDN
with an inline design-token config, and Alpine.js for the buy box, cart drawer, FAQ
accordion and newsletter capture. Every product visual (the coffee bag, tasting-note
glyphs, journey icons) is hand-drawn inline SVG — there are no external image files. The
signature piece is the "From Tanah to Cup" section: a gold line grows down the page as you
scroll, driven by a small vanilla-JS scroll listener, with a static full-line/no-animation
fallback for `prefers-reduced-motion`.

To view it, just open `index.html` in a browser — nothing to install or compile. To deploy,
upload the `demos/ecommerce/` folder as-is to any static host (Netlify, Vercel, GitHub
Pages, S3, etc.); all assets are relative paths. The one piece that needs a real value
before launch is checkout: the cart drawer's "Checkout" button currently points at
`https://buy.stripe.com/PLACEHOLDER` (see the comment above it in `index.html`) — swap
that for the client's actual Stripe Payment Link and the buy flow is live. The cart itself
persists to `localStorage`, so items survive a refresh even before that link is wired up.

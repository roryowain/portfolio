# Ridge & Beam — demo site

This is a portfolio showpiece: a single-page demo site for "Ridge & Beam," a fictional heritage roofing firm in York. It exists to show prospective freelance clients what a bespoke, brand-specific build looks like — no template, no stock imagery, no build step. Every visual is Tailwind CSS (via the Play CDN), inline SVG, and Google Fonts (Zilla Slab, Source Sans 3, IBM Plex Mono); interactivity (the "Know Your Roof" diagram, the quote form, mobile nav) is handled by Alpine.js.

**To view it locally**, just open `index.html` in a browser — there's no build step or dependency install. **To deploy on Netlify**, drag the `roofing-uk` folder onto the Netlify "Deploy manually" drop zone, or connect it as a site with the publish directory set to this folder's root (`index.html` at the top level); no build command is needed since everything loads from CDNs at runtime.

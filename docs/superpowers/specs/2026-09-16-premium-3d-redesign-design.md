# Premium 3D redesign: design

Approved 2026-09-16.

## Goal
Replace the flat editorial look with a premium dark-luxury design, a real-time 3D hero and rich motion. All content,
URLs, redirects, forms, the booking flow, the logo and SEO keep working unchanged.

## Decisions
- **Direction:** dark luxury. Background `#070D14`, layered navy surfaces, frosted-glass cards, brand navy `#08405F`
  as glow, teal `#6FD3CF` and champagne `#D6B77C` accents. Fraunces (display serif), Manrope (body), IBM Plex Mono (labels).
- **3D:** a Three.js hero only (no WebGL elsewhere). The object is the practice's tooth mark, traced from the logo PNG to
  vector paths at build time, then extruded and beveled with a pearl/glass physical material and studio lighting.
  It rotates slowly, tilts toward the pointer or gyro, and turns and recedes on scroll.
- **Fallback:** a pre-rendered poster of the sculpture for no WebGL, `prefers-reduced-motion`, `save-data` and low
  device memory. The render loop pauses offscreen and in hidden tabs; DPR is capped (1.5 on mobile, 2 on desktop).
- **Motion:** Lenis smooth scroll; GSAP ScrollTrigger reveals (line-by-line headlines, staggered cards, perspective
  entrances); image parallax; 3D tilt cards with a pointer spotlight; magnetic buttons; count-up stats; a review
  marquee; an intro sequence; animated booking step transitions. Under reduced motion all of it becomes plain fades.

## Architecture
- The existing static build (`scripts/build.mjs`), `server.mjs`, content modules, redirects and APIs stay.
- `src/render.mjs` is rewritten with class-based markup; `src/assets/site.css` becomes the new design system.
- Client code moves to `src/client/`: `main.js` (menus, forms, booking, filter, motion) and `hero3d.js` (Three.js,
  dynamically imported only when a page has a 3D hero). Both are bundled with esbuild (ESM, code splitting) into `public/assets/`.
- `scripts/trace-logo.mjs` runs potrace on the logo mark and produces the SVG used by the 3D extrusion and the crisp header logo.

## Budgets
About 180 KB of gzipped JS on the homepage including 3D; under 60 KB on other pages. No horizontal overflow at 390px.

## Testing
Update `tests/e2e.mjs` for the new markup and keep every functional check. Add checks for the WebGL canvas rendering,
the fallback poster (WebGL disabled and reduced motion), no JS errors, and no overflow on all pages. Review
screenshots of key pages on desktop and phone.

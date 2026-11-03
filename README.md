# NUVOSID TECH — Website (Homepage phase)

Next.js 16 (App Router, JavaScript) · Bootstrap 5 grid + custom SCSS · Three.js / React Three Fiber / Drei · GSAP + ScrollTrigger (`@gsap/react`) · Lenis.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Where things live
- `src/data/*` — all copy (services, products, projects, stats, testimonials, process, site/contact). Edit content here.
- `src/styles/abstracts` — brand tokens & mixins; `src/styles/base/_global.scss` — light/dark CSS variables.
- `src/components/home/*` — one folder per homepage section (JSX + SCSS).
- `src/components/common/*` — Navbar, Footer, Preloader, ThemeToggle, SmoothScroll, cursor, progress, back-to-top.
- `src/components/three/*` — WebGL scenes (lazy-loaded, paused off-screen).
- `src/components/animations/*` — RevealText, FadeIn, Parallax, MagneticButton.
- `src/app/[slug]` — labelled placeholder routes (careers, services, products, our-work, privacy-policy, terms-and-conditions).

## Placeholders to replace before launch
- Logo: official artwork in `public/images/logo-*.png` (dark + light versions), rendered by `src/components/common/Logo/Logo.jsx`.
- Contact details & social URLs: `src/data/site.js`.
- Testimonials (`src/data/testimonials.js`), products (`products.js`), concept projects (`projects.js`), stats (`stats.js`).
- Newsletter form (`Footer.jsx`) validates but is not connected to a provider yet.

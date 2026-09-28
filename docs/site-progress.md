# Docs site (S1) — progress

Handoff for the next chat. Read this file only.

## Milestones
- [x] M1 — shell + deploy config: `M1_HASH`
- [ ] M2 — doc page pattern + Actions
- [ ] M3 — migrate remaining categories
- [ ] M4 — Getting started + Theming
- [ ] M5 — retire old single page

## Layout of the site
- `apps/gallery/src/main.tsx`: BrowserRouter. `/`, `/docs`, `/docs/theming`, `/docs/components/:slug`, `/blocks`; the old one-page gallery is kept at `/gallery` until M5.
- `apps/gallery/src/site/`: `Layout.tsx` (Navbar + Sidebar; intercepts same-origin anchor clicks, since Datum's Navbar/Sidebar render plain `<a>`), `nav.ts` (sidebar from `docs/component-plan.json` groups, `slugify`), `pages.tsx` (Placeholder, ComponentPage with "coming soon" fallback), `Landing.tsx`, `ThemeSwitch.tsx`, `site.css`.
- `apps/gallery/src/site/docs/index.ts`: `docPages` registry, slug → page component.
- `vercel.json` (repo root): builds styles → react → gallery, output `apps/gallery/dist`, SPA rewrite (excludes `assets/`, `check.html`, `review.html`).

## Categories
Migrated: none.
Left: Actions, Layout, Typography, Content, Feedback, Forms, Overlays, Navigation, Data, AI.

## Next step
M2: define the doc-file shape in `src/site/docs/` and migrate Button, ButtonGroup, Link from App.tsx (sections BUTTON…LINK, lines ~668–1069).

## Problems / notes
- Root `npm run build` builds only styles + react; build the site with `npm run build -w @datum-design/gallery`.
- Gallery has no tsconfig, so there's no typecheck; Vite only transpiles. Check pages in the browser.
- Switch takes `label` + `defaultChecked` (not children/defaultSelected).

# Docs site (S1) — progress

Handoff for the next chat. Read this file only.

## Milestones
- [x] M1 — shell + deploy config: `20aae2e`
- [x] M2 — doc page pattern + Actions: b3e36c5
- [x] M3 — migrate remaining categories (commits below; AI: `07eb8dd`)
- [x] M4 — Getting started + Theming: commit "Docs site M4"
- [ ] M5 — retire old single page

## M3 commits
- AI: see `git log --grep 'M3: AI'`
- Data: `8e3f87f`
- Navigation: `2b87a6a`
- Overlays: `f9c92aa`
- Forms: `af266c9`
- Feedback: `aa6c71b`
- Content: `c5b27a1`
- Typography: `313da21`
- Layout: `4d85915`

## Layout of the site
- `apps/gallery/src/main.tsx`: BrowserRouter. `/`, `/docs`, `/docs/theming`, `/docs/components/:slug`, `/blocks`; the old one-page gallery is kept at `/gallery` until M5.
- `apps/gallery/src/site/`: `Layout.tsx` (Navbar + Sidebar; intercepts same-origin anchor clicks, since Datum's Navbar/Sidebar render plain `<a>`), `nav.ts` (sidebar from `docs/component-plan.json` groups, `slugify`), `pages.tsx` (Placeholder, ComponentPage with "coming soon" fallback), `Landing.tsx`, `ThemeSwitch.tsx`, `site.css`.
- `apps/gallery/src/site/docs/index.ts`: `docPages` registry, slug → page component.
- `vercel.json` (repo root): builds styles → react → gallery, output `apps/gallery/dist`, SPA rewrite (excludes `assets/`, `check.html`, `review.html`).

## Categories
Migrated: Actions (Button incl. icon-only/toggle/FAB, ButtonGroup, Link), Layout, Typography, Content, Feedback, Forms, Overlays, Navigation, Data, AI.
Left: none.

## Next step
M5: retire the old single page. Every component has a routed page (66 slugs, checked against component-plan.json).
1. Remove the `/gallery` route and `App` import from `apps/gallery/src/main.tsx`.
2. Delete `apps/gallery/src/App.tsx`, `AiSection.tsx`, `DataSection.tsx`, `PickersSection.tsx` and `apps/gallery/scripts/` (check.html / review.html don't import them: confirm with grep first).
3. In `pages.tsx`, drop the "legacy gallery" sentence from the coming-soon fallback.
4. Drop the dead `.doc`, `.doc-nav`, `.theme-switch`, `.switches` rules from `gallery.css` (grep before removing; docs pages still use `.component-doc`, `.doc-section`, `.sample-box`, `.example-box`, `.props-table`, `.usage-grid`).
5. `npm run build -w @datum-design/gallery`, then `npm test` once. Commit, push.

## Doc file shape (M2)
`src/site/docs/kit.tsx`: `Demo` (Preview/Code Tabs; code is generated from the JSX children by `toJsx`, shown in `CodeBlock copyable`), `PropsTable`, `Usage`, `A11y`.
A doc file keeps the legacy markup (`section.component-doc`, `h1`, `p.dek`, `.doc-section` + `h2`/`p.lead`) and default-exports `<Name>Doc`.

## Problems / notes
- Root `npm run build` builds only styles + react; build the site with `npm run build -w @datum-design/gallery`.
- Gallery has no tsconfig, so there's no typecheck; Vite only transpiles. Check pages in the browser.
- Switch takes `label` + `defaultChecked` (not children/defaultSelected).
- migrate-section.py overwrites the doc file, so re-running it drops hand-added A11y notes. Don't re-run on a finished page.
- Conflict in the sources: DESIGN.md says orange's accent fill is orange-700 with white text; packages/styles/README.md says orange's accent carries dark text (#1B1B1B on #FC6E20). The Theming page avoids both and points at `text.onAccent`. Someone should reconcile the two docs.
- packages/react/README.md says 61 components and "real HTML element instead of an ARIA-role div"; the plan lists 66 and many are React Aria based. The Getting Started page doesn't repeat either claim.
- AI pages were split from one AiSection: each keeps a local `Part` helper that renders the page header, Demo, props and A11y.

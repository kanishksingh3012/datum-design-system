# Docs site (S1) — progress

Handoff for the next chat. Read this file only.

## Milestones
- [x] M1 — shell + deploy config: `20aae2e`
- [x] M2 — doc page pattern + Actions: commit "Docs site M2" (hash recorded in the next commit)
- [ ] M3 — migrate remaining categories
- [ ] M4 — Getting started + Theming
- [ ] M5 — retire old single page

## Layout of the site
- `apps/gallery/src/main.tsx`: BrowserRouter. `/`, `/docs`, `/docs/theming`, `/docs/components/:slug`, `/blocks`; the old one-page gallery is kept at `/gallery` until M5.
- `apps/gallery/src/site/`: `Layout.tsx` (Navbar + Sidebar; intercepts same-origin anchor clicks, since Datum's Navbar/Sidebar render plain `<a>`), `nav.ts` (sidebar from `docs/component-plan.json` groups, `slugify`), `pages.tsx` (Placeholder, ComponentPage with "coming soon" fallback), `Landing.tsx`, `ThemeSwitch.tsx`, `site.css`.
- `apps/gallery/src/site/docs/index.ts`: `docPages` registry, slug → page component.
- `vercel.json` (repo root): builds styles → react → gallery, output `apps/gallery/dist`, SPA rewrite (excludes `assets/`, `check.html`, `review.html`).

## Categories
Migrated: Actions (Button incl. icon-only/toggle/FAB, ButtonGroup, Link).
Left: Layout, Typography, Content, Feedback, Forms, Overlays, Navigation, Data, AI.

## Next step
M3, one category per commit, in order: Layout, Typography, Content, Feedback, Forms, Overlays, Navigation, Data, AI.
For each component: find its line range with `grep -n "/\* ====" apps/gallery/src/App.tsx`, then from `apps/gallery`:
`python3 scripts/migrate-section.py <Name> <slug> App.tsx <start>:<end>` (slug = `slugify` in nav.ts, e.g. `field-label`, `scroll-area`).
It copies the section, turns sample-box/example-box into `<Demo>`, pulls in imports, top-level consts and useState lines, and registers the page in `docs/index.ts`.
Then add `<A11y items={[...]} />` before the last `</section>` (import it from ./kit), build, and eyeball one page.
Forms pickers (Combobox, TagInput, DatePicker, DateRangePicker) and CommandPalette live in PickersSection.tsx; Table/DataTable in DataSection.tsx; AI in AiSection.tsx: pass that file as <src>.

## Doc file shape (M2)
`src/site/docs/kit.tsx`: `Demo` (Preview/Code Tabs; code is generated from the JSX children by `toJsx`, shown in `CodeBlock copyable`), `PropsTable`, `Usage`, `A11y`.
A doc file keeps the legacy markup (`section.component-doc`, `h1`, `p.dek`, `.doc-section` + `h2`/`p.lead`) and default-exports `<Name>Doc`.

## Problems / notes
- Root `npm run build` builds only styles + react; build the site with `npm run build -w @datum-design/gallery`.
- Gallery has no tsconfig, so there's no typecheck; Vite only transpiles. Check pages in the browser.
- Switch takes `label` + `defaultChecked` (not children/defaultSelected).

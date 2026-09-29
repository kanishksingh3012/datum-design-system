# Docs site (S1) — progress

Handoff for the next chat. Read this file only.

## Milestones
- [x] M1 — shell + deploy config: `20aae2e`
- [x] M2 — doc page pattern + Actions: b3e36c5
- [x] M3 — migrate remaining categories (commits below; AI: `07eb8dd`)
- [x] M4 — Getting started + Theming: `5a2fc3d`
- [x] M5 — retire old single page: `587c692` (deletions) + the follow-up "Docs site M5: drop the /gallery route" commit

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
- `apps/gallery/src/main.tsx`: BrowserRouter. `/`, `/docs` (GettingStarted.tsx), `/docs/theming` (Theming.tsx), `/docs/components/:slug`, `/blocks`. The old one-page gallery and scripts/migrate-section.py were removed in M5.
- `apps/gallery/src/site/`: `Layout.tsx` (Navbar + Sidebar; intercepts same-origin anchor clicks, since Datum's Navbar/Sidebar render plain `<a>`), `nav.ts` (sidebar from `docs/component-plan.json` groups, `slugify`), `pages.tsx` (Placeholder, ComponentPage with "coming soon" fallback), `Landing.tsx`, `ThemeSwitch.tsx`, `site.css`.
- `apps/gallery/src/site/docs/index.ts`: `docPages` registry, slug → page component.
- `vercel.json` (repo root): builds styles → react → gallery, output `apps/gallery/dist`, SPA rewrite (excludes `assets/`, `check.html`, `review.html`).

## Categories
Migrated: Actions (Button incl. icon-only/toggle/FAB, ButtonGroup, Link), Layout, Typography, Content, Feedback, Forms, Overlays, Navigation, Data, AI.
Left: none.

## Next step
S1 is done. Open follow-ups:
- Connect the repo to Vercel (import the GitHub repo; vercel.json already sets the build and SPA rewrite) and check a deep link such as /docs/components/button on the deployed URL.
- /blocks: see docs/blocks-progress.md.
- DESIGN.md vs styles README accent conflict: fixed (README now matches DESIGN.md).
- The Code tab is generated from JSX at runtime (`toJsx` in kit.tsx): handlers show as `() => …` and state-driven values show their current value. Hand-written snippets would read better for the busiest demos.

## Doc file shape (M2)
`src/site/docs/kit.tsx`: `Demo` (Preview/Code Tabs; code is generated from the JSX children by `toJsx`, shown in `CodeBlock copyable`), `PropsTable`, `Usage`, `A11y`.
A doc file keeps the legacy markup (`section.component-doc`, `h1`, `p.dek`, `.doc-section` + `h2`/`p.lead`) and default-exports `<Name>Doc`.

## Problems / notes
- Root `npm run build` builds only styles + react; build the site with `npm run build -w @datum-design/gallery`.
- Gallery typecheck: `npm run typecheck -w @datum-design/gallery`.
- Switch takes `label` + `defaultChecked` (not children/defaultSelected).
- migrate-section.py overwrites the doc file, so re-running it drops hand-added A11y notes. Don't re-run on a finished page.
- Conflict in the sources: DESIGN.md says orange's accent fill is orange-700 with white text; packages/styles/README.md says orange's accent carries dark text (#1B1B1B on #FC6E20). The Theming page avoids both and points at `text.onAccent`. Someone should reconcile the two docs.
- packages/react/README.md says 61 components and "real HTML element instead of an ARIA-role div"; the plan lists 66 and many are React Aria based. The Getting Started page doesn't repeat either claim.
- AI pages were split from one AiSection: each keeps a local `Part` helper that renders the page header, Demo, props and A11y.
- M5 found that the FileUpload and ContextMenu pages also rendered the old picker and command-palette sections, which App.tsx placed straight after them. Fixed before the legacy files were deleted.
- React tests at M5: 67 files, 392 tests passed.

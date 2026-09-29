# Blocks — progress

Handoff for the next chat. Read this file only.

## Milestones
- [x] M1 — real per-file blocks: (this commit, see `git log --grep 'Blocks M1'`)
- [x] M2 — checker coverage: see `git log --grep 'Blocks M2'`
- [ ] M3 — marketing core
- [ ] M4 — README accent fix + gallery typecheck

## How blocks work
- One file per block: `apps/gallery/src/site/blocks/<Name>.tsx`, one default export, no props, imports only `@datum-design/react` and `lucide-react`. Each wraps itself in `Section` + `Container padded`.
- `src/site/Blocks.tsx`: `groups` lists name, title, purpose per group (Marketing, Pricing & contact, Content, App shells). A new file must be added there to show up. Code tab = the file via `?raw` glob.
- Preview is an iframe of `block.html?name=<Name>` (`src/block/main.tsx`, a Vite input; excluded from the SPA rewrite in vercel.json) at 1280 / 768 / 390, auto-height, mirroring the site's `data-theme` and `color-scheme`.

## Checker
- `isMobileVariant`: any variant label starting with "mobile" renders at 390×844.
- Block fixtures come from a glob in `src/check/fixtures.tsx` (`blockFixtures`, states desktop/mobile, deep text); the checker adds the blocks folder's file names to `registered`, so `npm run check -- Hero` works.
- Static scan covers `src/site/blocks` (colors + an import rule); the render fails a block that scrolls sideways.

## Content
One fictional product across blocks: **Loomwork**, a planning workspace for product teams. Invented customers: Fernhill Labs, etc. No real names.

## Blocks
Done: Hero, Pricing, Testimonial, SignIn, DashboardStats.
Left: LogoCloud, FeatureGrid, FeatureSplit, Stats, Testimonials, CtaBand, Faq.

## Missing component props (not patched around)
- Container has no size below `sm` (640px); SignIn's card sits in `sm`, wider than the old 400px.
- Text / Heading have no `align` prop; blocks use inline `textAlign` (a keyword, not a token).

## Next step
M3: build LogoCloud, FeatureGrid, FeatureSplit, Stats, Testimonials, CtaBand, Faq; add each to `groups` in Blocks.tsx; `npm run check -- <Name>`.

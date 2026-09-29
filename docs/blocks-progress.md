# Blocks — progress

Handoff for the next chat. Read this file only.

## Milestones
- [x] M1 — real per-file blocks: (this commit, see `git log --grep 'Blocks M1'`)
- [x] M2 — checker coverage: see `git log --grep 'Blocks M2'`
- [x] M3 — marketing core: see `git log --grep 'Blocks M3'`
- [x] M4 — README accent fix + gallery typecheck: see `git log --grep 'Blocks M4'`

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
Done (12): Hero, LogoCloud, FeatureGrid, FeatureSplit, Stats, CtaBand, Pricing, Faq, Testimonial, Testimonials, SignIn, DashboardStats.
Left in this plan: none. Ideas for later: contact form, footer CTA, app header/sidebar shell.

## Missing component props (not patched around)
- Container has no size below `sm` (640px); SignIn's card sits in `sm`, wider than the old 400px.
- Text / Heading have no `align` prop; blocks use inline `textAlign` (a keyword, not a token).
- Text `as` allows only p / span / div / label: Testimonials wraps a `<blockquote style={{ margin: 0 }}>` around Text.
- Grid has no item `span` prop and no `align` prop (FeatureSplit uses inline `alignItems: "center"`).
- Section `tone` has no solid/inverse band (only default / muted / accent-subtle), so CtaBand sits on accentSubtle; a solid ink band would need text + focus-ring re-pointing the component doesn't offer.
- No icon-tile primitive: FeatureGrid draws the icon square with a token-only inline style.

## Next step
All four milestones are done. `npm run typecheck -w @datum-design/gallery` is clean (one fix: check/main.tsx treated a Record lookup as always defined). Next: more blocks (contact form, footer, app shell) or wire typecheck into CI.

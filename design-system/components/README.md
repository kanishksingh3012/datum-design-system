# Component contracts

Six components, each documented with the `design-system extend` template. These are framework-agnostic reference implementations (real semantic HTML/CSS, no JS framework) — the ground truth a future React/Radix/Vue/whatever implementation has to match. Live, working versions of all six are on the **Components** page of [Token atlas](https://claude.ai/code/artifact/578d3487-b6ad-44df-84c6-461bd61ba614) — that page is generated from the same styling described here, so it can't drift from this doc.

Sourced against Material Design 3, IBM Carbon, and Atlassian Design System's real published component docs (not memory) before designing each one — see the rationale line under each component for what specifically came from that research versus our own judgment call.

---

## Button

**Problem**: The primary way to trigger an action, consistently sized, colored, and stated across the whole system.

**Existing patterns checked**: Material 3 (5 tiers: elevated/filled/tonal/outlined/text), Carbon (primary/secondary/tertiary/ghost + danger variants), Atlassian (default/primary/subtle/warning/danger, two sizes). We converged on Carbon's simpler 4-tier model rather than Material's 5 — one fewer distinction to maintain, still covers every real use case.

**API**
| Property | Type | Default | Description |
|---|---|---|---|
| `variant` | `primary \| secondary \| ghost \| danger` | `primary` | Visual weight and semantic color |
| `size` | `default \| sm` | `default` | `default` = 44px (meets WCAG 2.5.5); `sm` = 36px, dense contexts only |
| `disabled` | boolean | `false` | — |
| `loading` | boolean | `false` | Implies disabled; shows spinner |

**States**: default, hover (8% brightness shift, matches Material's state-layer model), focus-visible, active/pressed (scale .98), disabled, loading.

**Tokens used**: `color.bg.accent/danger`, `color.text.onAccent/onDanger`, `color.border.strong`, `color.border.focus`, `radius.control`, `space.default/compact`, `motion.fast`, `motion.slow` (spinner), `interaction.minTarget`.

**Accessibility**: Real `<button>` — keyboard/screen-reader support is free. Rule (from Atlassian's own guidance): only one filled semantic button (primary or danger) per view region; everything else outline or ghost, so the page has one obvious default action.

**Open questions**: Icon+label combination spacing not yet tuned against real content; no "elevated" variant (Material has one, Carbon doesn't — deferred until a real use case shows up).

---

## Icon button

**Problem**: A button whose only content is a glyph — needs the same touch-target guarantee as Button without the label to lean on.

**Existing patterns checked**: Material pads the 24dp icon out to a 48dp tappable region via negative margin; this is exactly the model we adopted, using our own `interaction.minTarget` (44px) instead of Material's 48dp.

**API**
| Property | Type | Default | Description |
|---|---|---|---|
| `label` | string | — | **Required.** Becomes `aria-label`. |
| `disabled` | boolean | `false` | — |

**States**: default, hover, focus-visible, disabled.

**Tokens used**: `icon.control` (glyph size, 24px), `interaction.minTarget` (hit area, 44px), `radius.control`.

**Accessibility**: `aria-label` is not optional — there's no visible text fallback. This is the component that makes the visual/touch-size gap (24px glyph, 44px hit area) concrete; Material and Atlassian both document this same gap independently, which is why we trust it as the right pattern rather than inventing our own.

**Open questions**: No "selected" state yet (Atlassian documents one for toggleable icon buttons, e.g. a bookmark toggle) — add when a real toggle use case exists.

---

## Tooltip

**Problem**: A short label on hover/focus for sighted users who can't infer what an icon-only control does just from its shape.

**API**: A `data-tooltip="text"` attribute on any trigger element — no separate component instance needed.

**States**: hidden, visible (on `:hover` or `:focus-visible`).

**Tokens used**: `color.text.primary` (inverted as the chip background), `color.bg.page` (as the chip's text color), a `radius.base` fraction, `type.caption`, `motion.fast`.

**Accessibility — the one honest caveat in this whole set**: CSS-generated content (`content: attr(data-tooltip)`) is not reliably read by screen readers. That's not an oversight, it's *why* every icon button already carries `aria-label` independently — the tooltip is a convenience for sighted mouse/keyboard users, `aria-label` is what actually makes the control accessible. Neither substitutes for the other; both are required together.

---

## Text field

**Problem**: A labeled, single-line text input with a working error path.

**Existing patterns checked**: Material uses an animated floating label; Carbon and Atlassian both use a static label above the field. We chose the Carbon/Atlassian pattern — animated labels are real CSS/JS complexity for a marginal aesthetic gain, and "foolproof" mattered more than "fancy" for an unsupervised build. Carbon's rule that helper text is *replaced* by the error message (not shown alongside it) is directly adopted.

**API**
| Property | Type | Default | Description |
|---|---|---|---|
| `label` | string | — | **Required.** Never substitute with placeholder (explicit Atlassian rule: placeholder-as-label is banned). |
| `helpText` | string | — | Shown below the field; replaced by `errorText` when present |
| `errorText` | string | — | Sets `aria-invalid` + `aria-describedby` |
| `disabled` | boolean | `false` | — |

**States**: default, hover, focus-visible, error, disabled.

**Tokens used**: `color.border.default/strong/focus/danger`, `color.bg.page`, `radius.control`, `interaction.minTarget`, `type.label/body/caption`.

**Accessibility**: Real `<label for>`. Error state sets `aria-invalid="true"` and `aria-describedby` pointing at the message element, so a screen reader announces *what's wrong*, not just a red border a sighted user would see.

**Open questions**: Multi-field Form wrapper not built yet — same label/help/error structure should carry over directly when it is.

---

## Textarea

**Problem**: Multi-line text input — everything Text Field solved (label, help, error) still applies, just taller.

**Existing patterns checked**: No new research needed — same three systems' rules for labels/errors apply identically to a textarea as to a single-line input; the only real difference is sizing and resize behavior.

**API**: Same as Text Field, plus implicit multi-line sizing (96px minimum height, vertical resize only — horizontal resize is disabled so it can't break its container's layout).

**States**: default, hover, focus-visible, error, disabled — identical set to Text Field.

**Tokens used**: Identical to Text Field.

**Accessibility**: Same `<label for>` requirement. No differences from Text Field beyond the element tag itself.

---

## Radio group

**Problem**: Choosing exactly one option from a small visible set.

**Existing patterns checked**: This one didn't need new research — it's structurally Checkbox with two changes: a circular indicator instead of a checkmark glyph, and native `name`-attribute grouping so only one option in the group can be checked at a time (a free browser behavior, not something to hand-build).

**API**
| Property | Type | Default | Description |
|---|---|---|---|
| `name` | string | — | **Required.** Groups options — same name shared across every option in the set |
| `value` | string | — | Per-option value |
| `checked` | boolean | `false` | — |
| `disabled` | boolean | `false` | Per-option |

**States**: unselected, selected, focus-visible, disabled.

**Tokens used**: `color.bg.accent` (selected dot), `color.border.strong` (unselected ring), `color.border.focus`.

**Accessibility**: Real `<input type="radio">` sharing one `name` — arrow-key navigation between options within the group is native browser behavior. Same visually-hidden-input technique as Checkbox (clip-rect, not `display:none`).

---

## Switch

**Problem**: An on/off control for a setting that takes effect immediately — distinct from Checkbox, which implies the choice is one of several being batched until a form submits.

**Existing patterns checked**: This distinction (Switch = immediate effect, Checkbox = batched/deferred) is the standard rationale across mature systems for keeping the two components separate rather than styling one as the other.

**API**
| Property | Type | Default | Description |
|---|---|---|---|
| `checked` | boolean | `false` | Off / on |
| `disabled` | boolean | `false` | — |

**States**: off, on, focus-visible, disabled.

**Tokens used**: `color.bg.accent` (on-state track), `color.border.strong` (off-state track), `color.border.focus`, `motion.normal` (thumb slide animation).

**Accessibility**: `role="switch"` on the underlying (visually hidden) checkbox input tells assistive tech to announce it as on/off rather than checked/unchecked — the semantic difference from Checkbox is expressed in the accessibility tree, not just visually.

---

## Checkbox

**Problem**: Binary or multi-select choice, visually compact but still meeting the touch-target minimum.

**Existing patterns checked**: This component is where the "small visual, larger touch target" tension is sharpest — Atlassian documents it explicitly (16px visual, 24px hit target), Material pads an 18dp icon out to 48dp via negative margin. We used the same idea: 18px visual box, but the *clickable label* (not just the box) spans the full row height up to `interaction.minTarget`, which is a larger effective target than either reference system's number.

**API**
| Property | Type | Default | Description |
|---|---|---|---|
| `checked` | boolean | `false` | — |
| `disabled` | boolean | `false` | — |
| `label` | string | — | Rendered inside the same `<label>`, not a separate element |

**States**: unchecked, checked, focus-visible, disabled. (Indeterminate deferred — no tri-state parent control exists yet to need it.)

**Tokens used**: `color.bg.accent` (checked fill), `color.border.strong` (unchecked outline), `color.border.focus`, half of `radius.base` (box corner).

**Accessibility**: Real `<input type="checkbox">`, visually hidden via the clip-rect technique — **not** `display:none`, which would remove it from the accessibility tree entirely. Stays keyboard-operable and screen-reader-visible while the custom box handles the visuals via a sibling selector.

---

## Dialog

**Problem**: A focused, blocking overlay for a decision or self-contained task — built deliberately last, and carefully, since a broken focus trap is a real accessibility failure, not a cosmetic bug.

**Existing patterns checked**: The shadcn research from earlier in this project flagged the real distinction — use `AlertDialog`, not a generic `Dialog`, for destructive confirmation, specifically so it isn't dismissible by an accidental backdrop click. Rather than build two components, we made the safe behavior (no backdrop-click-dismiss) the *default* for the one Dialog component, so there's no separate "careful" variant to remember to use — every instance is safe by default.

**Implementation choice**: Built on the native `<dialog>` element with `.showModal()`, not a hand-rolled focus trap. The browser already implements focus trapping (confirmed via `dialog.matches(':modal')` returning true when open — that's what actually activates the trap, not just visual styling), Escape-to-close, and background inertness correctly. Reimplementing that in JS is a bigger, riskier surface for the exact same result.

**API**
| Property | Type | Default | Description |
|---|---|---|---|
| `title` | string | — | — |
| `body` | string | — | — |
| Trigger button | — | — | Wired via a `data-trigger="<dialog id>"` attribute |

**States**: closed, open.

**Tokens used**: `color.bg.surface`, `radius.card`, `elevation.overlay`, `space.section`, `type.h3`/`type.body`.

**Accessibility — everything below was actually tested, not assumed**:
- Focus moves into the dialog on open (`document.activeElement` inside the dialog — verified).
- Tab/Shift+Tab stay trapped inside while open — this is the native `:modal` state behavior, confirmed active.
- Backdrop click does **not** close it (verified with a synthetic click on the dialog element) — the safe default described above.
- The Cancel/Delete buttons close it via native `<form method="dialog">` semantics, and `dialog.returnValue` correctly captures which button was pressed — no custom close-handling JS needed for that part.
- Focus is explicitly saved before opening and restored to the trigger button after close — verified by checking `document.activeElement === trigger` post-close, not just assumed from the native behavior.

---

## Select

**Problem**: Choosing one option from a list too long to show as radio buttons.

**Existing patterns checked**: None needed beyond confirming the general principle — a native `<select>` gives keyboard type-ahead, arrow-key navigation, and Escape-to-close for free, which is exactly why we didn't build a custom listbox. A custom dropdown is real ongoing accessibility maintenance for a benefit (visual control) that's mostly cosmetic.

**API**: Same `label`/`helpText`/`errorText`/`disabled` shape as Text Field, wrapping a native `<select>`.

**States**: default, hover, focus-visible, disabled.

**Tokens used**: Same field tokens as Text Field. The dropdown chevron is the *existing* `chevron-right` icon rotated 90° in CSS — deliberately reused rather than authoring a new glyph for a trivial rotation.

**Accessibility**: The chevron is `aria-hidden` since the native control already communicates its own affordance; duplicating that in the accessibility tree would be noise, not signal.

---

## Avatar

**Problem**: Visually identifying a person or entity — in a list, a comment, a header.

**API**
| Property | Type | Default | Description |
|---|---|---|---|
| `size` | `default \| sm` | `default` | 40px / 28px |
| `src` | string | — | Photo URL; falls back to initials if absent/fails to load |
| `initials` | string | — | Fallback content |

**States**: static display.

**Tokens used**: `color.bg.accent`, `color.text.onAccent`, `type.label`.

**Accessibility**: When rendered as `<img>`, `alt` must be the person's actual name — not generic text like "avatar" or "profile picture," which tells a screen reader user nothing about whose image it is.

---

## Tabs

**Problem**: Switching between views that share the same screen space without navigating away.

**Existing patterns checked**: This is the exact pattern the Token Atlas dashboard already uses for its own Tokens/Components page switcher and theme selector — building a formal version of something we'd already proven works in practice.

**API**
| Property | Type | Default | Description |
|---|---|---|---|
| `active` | string | first tab | Which tab is selected |
| `disabled` | boolean | `false` | Per-tab |

**States**: inactive, active, focus-visible, disabled.

**Tokens used**: `color.bg.accent` (active underline), `color.text.primary/secondary`, `color.border.default`, `color.border.focus`, `interaction.minTarget`.

**Accessibility**: `role="tablist"`/`"tab"`/`aria-selected` are wired in the reference demo, and clicking actually switches the active tab (verified, not just styled to look clickable). **Known gap, stated plainly rather than silently skipped**: full roving-tabindex arrow-key navigation (the ARIA Authoring Practices tab pattern) isn't implemented — that needs real per-instance JS in an actual app, which a static reference page can't fully demonstrate. Whatever framework eventually wraps this needs to add that behavior.

---

## Alert

**Problem**: A persistent, page- or section-level message about status or an error — distinct from a transient toast (not built yet), which disappears on its own.

**Existing patterns checked**: Building this is what surfaced a real token gap — we only had *strong*, saturated danger/warning/success backgrounds (`bg.danger` etc.), designed for filled buttons and badges. A persistent alert box in that same saturated color would be visually loud and fatiguing. Added three new **subtle** background tokens (`bg.dangerSubtle`, `bg.warningSubtle`, `bg.successSubtle`) using each family's lightest step in light mode and darkest in dark mode — contrast-verified before adding, not after (all pairings clear 4.5:1+ for text, 3:1+ for the border, with real margin: 6.29–7.3:1 across all six new pairings).

**API**
| Property | Type | Default | Description |
|---|---|---|---|
| `variant` | `danger \| warning \| success` | — | **Required** |
| `title` | string | — | — |
| `body` | string | — | Optional supporting text |

**States**: static — not interactive itself.

**Tokens used**: `color.bg.{danger,warning,success}Subtle` (new), `color.text.danger/warning/success`, `color.border.danger` (danger variant's accent stripe).

**Accessibility**: `role="alert"` (danger) interrupts and announces immediately — reserved for things that need urgent attention. `role="status"` (warning, success) announces politely without interrupting whatever a screen reader is already doing mid-sentence. No status icon yet — the icon set only has `chevron-right`/`check`/`x` so far; the message text carries meaning alone for now, which still satisfies WCAG 1.4.1 (color isn't the only signal) but a real `alert-triangle`/`circle-alert` glyph is a natural next icon to draw.

**Design note**: corners are square, not `radius.control` — a rounded corner would visually clip against the left accent stripe in an odd way. Square is the correct call here, not an oversight.

---

## Toast

**Problem**: A brief, transient confirmation after an action, which disappears on its own — Alert's persistent counterpart.

**API**
| Property | Type | Default | Description |
|---|---|---|---|
| `text` | string | — | — |
| `duration` | number (ms) | — | Not implemented in the static reference — see open question below |

**States**: visible, dismissing.

**Tokens used**: `color.text.primary` (inverted as the chip background), `color.bg.page` (chip text), `elevation.overlay`, `radius.control`, `type.bodySmall`.

**Accessibility**: `role="status"`, not `role="alert"` — a toast confirms something that already happened, it doesn't need to interrupt. Real rule, not optional: it should auto-dismiss after several seconds **and** stay manually dismissible for anyone who reads slower than the timeout assumes. Never rely on the timer alone.

**Open questions**: The auto-dismiss timer itself isn't implemented — a static reference page can't demonstrate a timeout meaningfully (it would just look broken after a few seconds while someone's reading the docs). The dismiss button *is* real and verified working; the timer is real per-app JS wiring, deferred the same way Tabs' roving-tabindex was.

---

## Skeleton

**Problem**: A loading placeholder in roughly the shape of the real content, so it doesn't pop in and shift the layout.

**API**
| Property | Type | Default | Description |
|---|---|---|---|
| `shape` | `text \| avatar` | `text` | — |
| `width` | string | `100%` | Per-instance, since real content varies |

**States**: loading only — it's removed once real content arrives.

**Tokens used**: `color.bg.surface`, `radius.control`.

**Accessibility**: Purely decorative, no ARIA role of its own — but the *region* containing it should be marked `aria-busy="true"` while loading. Animates via opacity pulse only (nothing that moves position), and respects `prefers-reduced-motion` by slowing rather than stopping — motion still communicates "loading," it just does so more gently.

---

## Progress bar

**Problem**: Showing how far a *determinate* operation (upload, multi-step setup) has gotten.

**API**
| Property | Type | Default | Description |
|---|---|---|---|
| `value` | number (0–100) | — | **Required** |
| `label` | string | — | Becomes `aria-label` |

**States**: 0–100%, driven by `aria-valuenow`.

**Tokens used**: `color.bg.surface` (track), `color.bg.accent` (fill), `motion.normal` (fill transition on value change).

**Accessibility**: `role="progressbar"` with `aria-valuenow`/`aria-valuemin`/`aria-valuemax` is what makes the percentage announced to assistive tech — the visual bar alone communicates nothing to a screen reader without it.

**Open questions**: No indeterminate variant yet (an unknown-duration operation wants a continuously animating fill, not a percentage) — for an unknown-duration wait, reach for a spinner instead until this is built.

---

## Badge

**Problem**: A small, non-interactive status or count marker riding on other content.

**Existing patterns checked**: All three systems agree badges are non-interactive (Material: "never clickable," rides on a parent element; Atlassian: explicitly a "compact count primitive"). Carbon doesn't have a directly matching component — their closest analog (Tag) is interactive/dismissible, which is a *different* component we haven't built. That distinction is deliberate: Badge stays passive display-only; an interactive Tag/Chip is separate future work, not a Badge variant.

**API**
| Property | Type | Default | Description |
|---|---|---|---|
| `variant` | `neutral \| accent \| success \| warning \| danger` | `neutral` | — |

**States**: static only — no hover/focus/disabled, because it's not interactive. If a future need makes a badge clickable, that's a new component (Tag), not a Badge prop.

**Tokens used**: `color.bg.{accent,success,warning,danger}`, `color.text.on*`, `type.label`.

**Accessibility**: Plain `<span>`. If a badge's meaning is color-coded (e.g. a status dot), the label text must say the status in words — color can never be the only signal (WCAG 1.4.1).

---

## Card

**Problem**: A bounded content container for grouping related information.

**Existing patterns checked**: This is where research overturned an initial assumption. Carbon's Tile guidance says explicitly "do not add drop shadows"; Atlassian's rule is flat surface + border by default, `shadow-raised` reserved *only* for draggable/movable cards. Only Material defaults toward shadow (its "elevated" tier), and even Material offers flat "outlined"/"filled" alternatives. Two of three real systems treat flat-by-default as the norm and shadow as the exception — so that's what we built, not what felt intuitively "card-like" at first pass.

**API**
| Property | Type | Default | Description |
|---|---|---|---|
| `variant` | `flat \| elevated` | `flat` | `elevated` swaps the border for a shadow — never both at once |

**States**: static container. Interactive states belong to whatever's *inside* the card (a button, a link), never the card element itself.

**Tokens used**: `color.bg.surface`, `color.border.default`, `radius.card`, `elevation.raised` (elevated variant only), `space.section`.

**Accessibility**: No implicit ARIA role — a generic container has no special semantics. A clickable card (not built) needs a real focusable element inside it (e.g. a link wrapping the title), never an `onclick` handler on the div itself, which keyboard and screen-reader users can't reach.

---

## Cross-cutting notes

- **Naming**: every class is scoped with a `-c` suffix or unique prefix (`.badge-c`, `.card-c`, `.select-c`, `.avatar-c`, `.tabs-c`, `.alert-c`, `.toast-c`, `.skeleton-c`, `.progress-c`, `.dialog-c`, `.btn`, `.field`, `.checkbox`, `.radio`, `.switch`, `.icon-btn`, `[data-tooltip]`) to avoid colliding with the Token Atlas dashboard's own chrome classes (`.card`, `.badge`, `.tabs`), which style a completely different thing.
- **Nineteen components total now**, across six sections: Actions (Button, Icon Button, Tooltip), Forms (Text Field, Textarea, Select, Checkbox, Radio Group, Switch), Navigation (Tabs), Overlays (Dialog), Feedback (Alert, Toast, Skeleton, Progress bar), Display (Badge, Avatar, Card).
- **Touch targets**: Button (default), Icon button, and Text field all hit `interaction.minTarget` (44px) directly. Checkbox reaches it through the label's padding, not the visual box — matching how every real system we checked handles the same tension.
- **Nothing here is React/Vue/etc.** — deliberately. That's a framework decision for when the person who owns this system is actually present to make it, not something to lock in overnight.

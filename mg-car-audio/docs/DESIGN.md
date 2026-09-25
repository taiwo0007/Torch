# MG Car Audio: design system v2 (redesign)

**Design read:** a redesign of a local installer's shop and booking site for Irish drivers of used premium German cars and Japanese imports, mostly browsing on phones. The language is a dark "night cabin" look, built with native Liquid and CSS on Horizon, using MG's own red and the Prompt font, with restrained motion.

Dials (taste skill): DESIGN_VARIANCE 6 · MOTION_INTENSITY 3 · VISUAL_DENSITY 5.

Skills this follows: `.claude/skills/design-taste-frontend`, `.claude/skills/redesign-existing-projects`, `.claude/skills/ui-ux-pro-max` (accessibility and UX rules), and Anthropic's `frontend-design`.

## 1. What the client wants

- The owner showed Taiwo **radiomasters.ie** and **caraudiocentre.co.uk** and loves them. Both home pages let people **enter by system (category)**, not by car brand: CarPlay screens, Android stereos, speakers, subs, amps, dash cams, reverse cameras and so on, as big image tiles directly under the hero.
- **We one-up them** by keeping their strength (instant category entry, big tap targets, product photography, trust strip, top sellers, latest jobs) and fixing their weaknesses:
  - No fitted prices. We show **"from €X fitted"** on every system tile and a real workshop price board.
  - Cluttered heroes (sale banners, cookie walls, stacked colour blocks). Ours has one message and one action.
  - Neither lets you start with your car. Ours has an **Irish number-plate input** in the hero ("Enter your reg" → a quote with the reg pre-filled). It's also a step toward the future plate-lookup product.
  - A weak mobile flow. We add a **sticky mobile action bar** (Call · WhatsApp · Book), a 2-column system grid with full-width lead tiles, and thumb-reachable CTAs.
  - Inconsistent spacing and type. Ours uses one spacing scale, one radius scale and one type scale everywhere.
- Don't copy their assets or text (brief §1). Borrow the structure only.

## 2. Tokens

### Colour (MG brand: red on dark)

MG's current site uses red `#DF3131` / `#ED1C24` with black and white. Brand colour wins over taste defaults, so red stays. We avoid the generic "black + vermilion" look through a **blue-slate** dark (not neutral near-black), real workshop photography, subtle texture, and **red used sparingly**: primary CTA, prices, active states. Never large red areas.

| Token | Hex | Role |
|---|---|---|
| `--mg-bg` | `#0E1319` | Page background, "cabin at night" (blue-slate) |
| `--mg-surface` | `#151C25` | Raised panels, tiles |
| `--mg-surface-2` | `#1C2531` | Hover and inputs, nested panels |
| `--mg-line` | `#27313F` | Hairlines, borders |
| `--mg-text` | `#EEF2F6` | Primary text |
| `--mg-text-muted` | `#A3AFBE` | Secondary text (≥ 7:1 on bg) |
| `--mg-red` | `#DF3131` | MG red: primary buttons, prices, focus accents |
| `--mg-red-hover` | `#EC4545` | Hover |
| `--mg-red-text` | `#FF6B66` | Red used as **small text** on dark (AA) |
| `--mg-plate` | `#F4F5F2` | Number-plate white (plate input only) |
| `--mg-plate-blue` | `#1D4BB0` | EU band on the plate only |
| `--mg-whatsapp` | `#25D366` | WhatsApp icon or button only (functional colour) |

Rules:
- One accent (red). WhatsApp green appears only on the WhatsApp icon or the floating/sticky WhatsApp control, never as a second big CTA colour next to red. In button pairs, WhatsApp is a dark secondary button with a green icon.
- Shadows are tinted with the bg hue (`rgb(4 8 14 / .55)`), not pure black.
- One subtle grain/noise overlay (inline SVG data-URI, opacity ≤ .04) on the hero and dark panels only.

### Type

- **Prompt** (MG's current brand font, OFL). Self-host latin woff2 in theme `assets/` (weights 400, 500, 600, 700). Preload 600. `font-display: swap`. Use it for everything, and let weight and size do the hierarchy. Check whether Prompt is in Shopify's font library; if it is, also set the Horizon font pickers to it.
- Scale (fluid, mobile → desktop): display `clamp(2.25rem, 7vw, 4rem)` (hero only), h2 `clamp(1.75rem, 4.2vw, 2.75rem)`, h3 `1.25rem`, body `1rem`/1.6, small `.875rem`, micro `.8125rem`.
- Headings are **sentence case** (not uppercase), weight 600, tracking `-0.02em` for h1/h2, `text-wrap: balance`. Paragraphs max 62ch, `text-wrap: pretty`.
- Prices and times use `font-variant-numeric: tabular-nums`.
- Uppercase is allowed only for tiny functional labels (the plate's "IRL"), never for eyebrows or headings.

### Spacing (4px base; use only these)

`--mg-space-1: 4px` · `2: 8px` · `3: 12px` · `4: 16px` · `5: 24px` · `6: 32px` · `7: 48px` · `8: 64px` · `9: 96px` · `10: 128px`.

- Section padding: mobile `64px` top / `72px` bottom; desktop `112px` / `128px` (the bottom is optically larger). One class `.mg-section` does it; sections never set their own vertical padding.
- Section head → content gap: `32px` mobile, `48px` desktop.
- Grid gap: `12px` mobile, `16px` tablet, `20px` desktop.
- Container: max `1280px`, gutters `20px` mobile / `32px` tablet / `48px` desktop.

### Radius, depth, z-index

- Radius: `--mg-r-xs 6px` (chips, inputs), `--mg-r-sm 10px` (buttons), `--mg-r-md 16px` (tiles, cards), `--mg-r-lg 24px` (large panels, hero media).
- Depth: flat by default. Elevation only on hover or focus of interactive tiles (translateY(-2px) and a tinted shadow).
- Z-index scale: content 1, sticky header (Horizon), `--mg-z-float 40` (WhatsApp float and mobile action bar), below Horizon drawers and modals.

### Motion

- One orchestrated moment: the hero headline, subline and plate input fade and lift in (≤ 600ms total, staggered 80ms). Nothing else animates on load.
- Interaction feedback: 180–240ms transitions on hover, focus and press (`scale(.98)` on press).
- `prefers-reduced-motion`: no transforms, no entrance animation.

## 3. Components (shared, in `mg-theme.css`)

- `.mg-section`, `.mg-container`, `.mg-head` (h2 + optional lede, left-aligned, stacked, never split left/right), `.mg-head__link` (a text link to "see all", right-aligned on desktop only).
- Buttons: `.mg-btn--primary` (red), `.mg-btn--secondary` (surface-2 background, line border, text colour), `.mg-btn--whatsapp` (secondary look with a green icon), `.mg-link` (text link with underline offset). Min height 48px. Labels ≤ 3 words, one line. No trailing arrows on button labels.
- `.mg-tile` (system tile: image with scrim, title, price line), `.mg-price` (tabular "from €X fitted"), `.mg-chip` (only for real filters or tags).
- `.mg-plate` (Irish number-plate input: white plate, blue EU band with "IRL", heavy plate-style digits, uppercase input, 56px tall).
- No numbered markers except real sequences (how it works). No `01/02` on tiles. No middle-dot meta strings. **No em dashes in any copy.** No "→" appended to labels.

## 4. Home page v2 (mobile-first order)

1. **Header** (Horizon, restyled): logo text, search, cart, menu. Announcement: one line.
2. **Hero** (`mg-hero`): full-bleed MG photo (BMW CarPlay) with a slate scrim. h1 "Ireland's CarPlay and car audio specialist" (MG's own tagline). Subline ≤ 20 words. **Plate input** + "Get a quote" button (submits to `/pages/get-a-quote?reg=…`). Secondary text link "Or WhatsApp us a photo of your dash". Nothing else in the hero (no chips, no rating).
3. **Trust strip** (`mg-trust-bar`): Google rating (placeholder), fitting warranty (placeholder), "Fitted prices from €149", "Ballymount, D12. Open today until 7pm" (hours from settings, today computed client-side). Mobile: a 2×2 grid.
4. **What are you upgrading?** (`mg-system-grid`, NEW, the centrepiece): 10 system tiles. CarPlay & Android Auto · Screen upgrades · Android radios · Speakers · Subwoofers & amps · Dash cams · Reverse cameras · Japanese import conversion · Repairs (no sound, black screen, radio code) · Accessories. Each tile has a photo (MG asset or image picker) or a designed icon tile when no photo exists, a title, and "from €X fitted" / "Price on request". Desktop: a bento layout (CarPlay 2×2, Screen upgrades 2×1, the rest 1×1). Mobile: 2 columns with the first tile full width. The whole tile is the link. Min tile height 132px on mobile.
5. **Fitted price board** (`mg-services-grid` → restyled as a price list): rows showing service, time and price (€350, €299, €150, €149, €450), a book link per row, and a "€50 deposit secures your slot" note. Tabular numbers. A board, not cards.
6. **Best sellers** (Horizon `product-list`, restyled via `mg-theme.css`).
7. **Pick your car** (`mg-car-makes` → compact): a heading plus a horizontally scrollable row (wrapping on desktop) of typographic make chips linking to the make pages, including "Japanese imports".
8. **How it works** (4 real steps, numbered).
9. **Latest jobs** (`mg-gallery`): horizontal snap scroll on mobile, bento on desktop.
10. **Reviews** (`mg-reviews`): the rating summary and short quotes (≤ 3 lines each), not a 3-card carousel with dots.
11. **FAQ** (`mg-faq`): a disclosure list.
12. **Visit the workshop** (`mg-contact-map`).
13. **Mobile action bar** (≤ 749px, all pages except password): Call · WhatsApp · Book, fixed at the bottom with safe-area padding. It replaces the floating WhatsApp bubble on mobile. The desktop keeps the floating button. Pages get bottom padding so the bar never covers content.

## 5. Quality bar (pre-flight, every section)

- Check it at 360, 390, 768, 1024 and 1440 widths with `tools/preview/shoot.mjs`: no horizontal scroll, no clipped text, no CTA that wraps on desktop, and the hero fits the first viewport with the CTA visible.
- Contrast ≥ 4.5:1 for text, ≥ 3:1 for UI and large text. Visible focus rings everywhere. Tap targets ≥ 44px.
- Same section padding, head style and grid gaps across every section: consistency is the premium signal.
- Copy: plain, specific, active voice, Irish/UK English, no em dashes, no hype words (elevate, seamless, unleash, next-gen).

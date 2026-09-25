# MG Car Audio: design system v3 (Back Market–style redesign)

**Direction (from Taiwo):** "Follow the same design guidelines as backmarket.ie. Do something new." Combine this with the client's favourites (radiomasters.ie, caraudiocentre.co.uk): **the home page is entered by system (category), not by car brand.** Be very mobile-responsive, with consistent spacing and MG's brand colour.

**Design read:** a light, friendly, trust-first shop-and-book home page for Irish drivers (mostly on phones). It borrows Back Market's design grammar (light canvas, serif statements, one bold signature colour on big surfaces, black actions, trust strip, carousels, customer-photo reviews), carries MG's own brand (red `#DF3131`, the Prompt font), and uses native Liquid and CSS on Horizon.

Dials (taste skill): DESIGN_VARIANCE 5 · MOTION_INTENSITY 3 · VISUAL_DENSITY 5.

Skills this follows: `.claude/skills/design-taste-frontend`, `.claude/skills/redesign-existing-projects`, `.claude/skills/ui-ux-pro-max` (accessibility and UX rules), and Anthropic's `frontend-design`. Where they conflict with Taiwo's explicit direction (Back Market's grammar), **Taiwo's direction wins**.

> This **replaces the dark theme** from the original brief. Taiwo asked for the Back Market look, which is light.

## 1. Back Market's guidelines, translated for MG

| Back Market does | MG version |
|---|---|
| Light canvas: white page with pale cool-grey bands | `#FFFFFF` page, `#F4F5F7` bands, `#0F1115` ink |
| One bold signature colour on big surfaces (lime hero, lime category tiles) | **MG red** on the hero banner; category tiles in a pale red-neutral tint with a red hover edge. Never lime (that's Back Market's brand). |
| Black buttons for every action | Black primary buttons (`#0F1115`, white text). Red is never used for buttons except on dark or red surfaces, where buttons invert to white. |
| Serif statement headlines with a friendly tone ("Where the world shops refurbished tech.") | Serif display for the hero and big centred statements ("Ireland's CarPlay and car audio specialist."). Prompt for everything else. |
| Grey pill-shaped trust strip with 4 icon items (refurbishment, 30-day returns, warranty) | Fitting warranty · Fixed fitted prices · Factory features kept · Dublin 12 workshop |
| "Shop our most wanted" 4×2 tiles: coloured tile, product image, label under it | **"Shop by system"**: CarPlay & Android Auto, Screen upgrades, Android radios, Speakers, Subwoofers & amps, Dash cams, Reverse cameras, Japanese import conversion. Tile = tinted panel + MG photo (rounded) + label + "From €X fitted". |
| "Shop our best deals" panel: lifestyle photo left, category chips plus product carousel right | **"Fitted prices"** panel: workshop photo left; chips (CarPlay · Screens · Radios · Conversions) switch the service cards on the right; each card shows "From €350 fitted", time, and a book link |
| Product cards: white, rounded, rating, "Starting at €X", compared with the "new" price | Service and product cards in the same style: "From €350 fitted", "About 1 hour". No invented comparison prices. |
| "What is Verified Refurbished?" beige panel with a checklist card | **"What's in every MG fit"** panel: compatibility check from your reg, OEM-style finish, factory controls kept where possible, full test before you drive away, fitting warranty, €50 deposit to book |
| Customer-photo review cards with a name tag and stars | Review cards with an install photo, a 3-line quote, first name + car, and a "Sample review" tag until real reviews exist |
| Centred narrow FAQ, "4 questions people always ask" | "Questions drivers always ask": centred 720px list |
| Carousels with round black arrow buttons | The same: 40px round buttons, black filled (next), grey (disabled or prev) |
| Header: logo, big rounded search, help, account, cart; category nav row | Horizon header restyled: logo, big rounded search ("What are you upgrading?"), phone, cart; category nav row (the systems) |

**Our one-ups over all three reference sites:**
1. The **Irish number-plate input** in the hero ("Enter your reg" → quote with the reg pre-filled). None of them has it.
2. **Fitted prices everywhere** (the Irish competitors say "call for a quote").
3. A **sticky mobile action bar** (Call · WhatsApp · Book), a 2-column system grid, and thumb-reachable CTAs.

Don't copy Back Market's (or anyone's) logos, images, icons, copy or signature colour. Borrow the grammar only.

## 2. Tokens

### Colour

| Token | Hex | Role |
|---|---|---|
| `--mg-page` | `#FFFFFF` | Page background |
| `--mg-band` | `#F4F5F7` | Alternate section bands, trust strip, panels |
| `--mg-card` | `#FFFFFF` | Cards on bands (with a `--mg-line` border) |
| `--mg-line` | `#E3E6EA` | Hairlines, card borders |
| `--mg-ink` | `#0F1115` | Text, primary buttons |
| `--mg-ink-2` | `#4B5360` | Secondary text (≥ 7:1 on white) |
| `--mg-ink-3` | `#6B7380` | Tertiary text (≥ 4.5:1 on white and on band) |
| `--mg-red` | `#DF3131` | MG signature: hero banner, small labels ("Fitted price"), active states, focus accents |
| `--mg-red-ink` | `#B51F1F` | Red **text** on white (AA for small text) |
| `--mg-red-tint` | `#FCEEEC` | Category tile background (tinted neutral, not pink: check it on screen; if it reads pink, use `#F6F1EF`) |
| `--mg-warm` | `#F3EFEA` | The "What's in every MG fit" panel (Back Market uses a beige panel for its guarantee story) |
| `--mg-plate` | `#FFFFFF` + `--mg-plate-blue #1D4BB0` | Number-plate input only |
| `--mg-whatsapp` | `#25D366` | WhatsApp icon only (and the desktop floating button) |

Rules: one signature colour (red) for surfaces and highlights, black for actions, and nothing else loud. Shadows are soft and cool (`0 1px 2px rgb(15 17 21 / .06), 0 8px 24px rgb(15 17 21 / .06)`), and only on raised cards and hover.

### Type

- **Display serif:** a sturdy, friendly modern serif, **not** Fraunces or Instrument Serif (banned by the taste skill). Recommended: **Source Serif 4** (OFL) at weight 600, with a 600-italic for the hero's second line only. Used for the hero h1, centred statement headings and big panel headings.
- **UI and body:** **Prompt** (MG's current brand font, OFL), weights 400/500/600. Used for nav, section headings (h2, weight 600), cards, buttons, body.
- Self-host latin woff2 files in theme `assets/` (via `@font-face` in a snippet using `asset_url`); preload the display 600 and Prompt 400; `font-display: swap`. Point Horizon's font variables (`--font-body--family`, `--font-heading--family`) at them so native Horizon parts match.
- Scale: hero `clamp(2.25rem, 6vw, 3.75rem)` serif/1.05; statement `clamp(1.875rem, 4.5vw, 3rem)` serif/1.1; h2 (Prompt 600) `clamp(1.375rem, 2.6vw, 1.75rem)` (Back Market's section heads are modest: "Shop our most wanted"); card title `1rem` 600; body `1rem`/1.55; small `.875rem`; micro `.8125rem`.
- Sentence case everywhere. No uppercase eyebrows. Prices use tabular numbers, with the euro sign and superscript cents like Back Market (`€350`, or `€149`).

### Spacing (4px base; use only these)

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96`.

- Section rhythm: mobile `48px` between sections; desktop `72px`. Banded sections get `48/56px` inner padding on mobile and `72/80px` on desktop. One class, `.mg-section`, owns it.
- Section head (h2 + optional "See all" link on the right) → content: `16px` mobile, `20px` desktop (Back Market's heads sit tight on their content).
- Grid gaps: `8px` mobile tiles, `12px` tablet, `16px` desktop.
- Container: max `1120px` (Back Market's content column is narrow and calm), gutters `16px` mobile, `24px` tablet, `32px` desktop.

### Radius and z-index

- Radius: `8px` (buttons, inputs, chips), `12px` (cards, tiles), `16px` (panels, hero banner), `999px` (pills: search bar, trust strip, carousel arrows).
- Z-index: content 1; `--mg-z-float: 40` (WhatsApp float and mobile action bar), below Horizon's drawers and modals.

### Motion

Only interaction feedback: 150–200ms on hover, focus and press (`scale(.98)` on press), plus carousel scrolling. The hero may have one gentle fade-in. `prefers-reduced-motion` removes transforms.

## 3. Home page v3 (mobile-first order)

1. **Header** (Horizon restyled): white; logo; big rounded search pill "What are you upgrading?"; phone link; cart. A second row with a horizontally scrollable system nav (CarPlay, Screens, Android radios, Speakers, Subs & amps, Dash cams, Reverse cameras, Conversions, Repairs). Thin hairline under it.
2. **Hero banner** (`mg-hero`): a rounded (16px) **MG red** banner inside the container, like Back Market's lime banner. Left: serif h1 on two lines, e.g. "Your car already has the screen." / *"Add CarPlay."* (the italic line in serif italic), one short sentence, and the **plate input + black "Get a quote" button**. Right: the MG BMW CarPlay photo (rounded, no scrim needed). Mobile: stacked, image on top, banner full width with 16px gutters. White text on red (4.6:1). The button is black on red with white text.
3. **Statement + trust strip** (`mg-trust-bar`): a centred serif statement "Ireland's CarPlay and car audio specialist." with the subline "Fixed fitted prices at our Dublin 12 workshop. Backed by our fitting warranty." (keep "warranty" wording as a placeholder until confirmed). Below it, a grey pill strip of 4 items with line icons. Mobile: a 2×2 grid inside a rounded grey panel.
4. **Shop by system** (`mg-system-grid`, NEW): h2 "Shop by system", with 8 tiles in a 4×2 grid on desktop and 2 columns on mobile. Each tile: `--mg-red-tint` panel, MG photo centred with 12px radius (or a designed icon when no photo exists), label below ("CarPlay & Android Auto"), and a small "From €299 fitted" line in `--mg-red-ink`. The whole tile is the link. Hover: 1px red inset edge and a slight lift.
5. **Fitted prices panel** (`mg-services-grid` → Back Market "best deals" pattern): a grey band panel with a rounded photo on the left (desktop) and, on the right, chip tabs plus a horizontal card carousel of services with real prices (€350 BMW CarPlay, €299 BMW Android Auto iD7, €150 Android radio install, €149 iDrive 7 video in motion, €450 BMW Japanese-to-European conversion, others "Price on request"). Mobile: the photo is hidden and chips scroll horizontally above the cards. Round arrow buttons.
6. **Best sellers** (Horizon `product-list`, restyled as Back Market product cards in `mg-theme.css`).
7. **What's in every MG fit** (NEW section `mg-promise`, or reuse `mg-how-it-works`): a `--mg-warm` panel with a serif heading on the left and a white checklist card on the right (6 items with icons).
8. **Shop by car** (`mg-car-makes` → compact): h2 "Shop by car" and a scrollable row of make chips (text pills) plus "Japanese imports".
9. **How it works** (4 real steps, numbered, compact row, or merged into section 7 if it duplicates it).
10. **Reviews** (`mg-reviews` → Back Market style): h2 "What Dublin drivers say" + a rating summary; a carousel of photo cards (install photo top with a name tag top-left, stars, a 3-line quote, "Car: BMW 3 Series" line). Show a "Sample reviews" tag until real ones exist.
11. **Latest jobs** (`mg-gallery`): an optional compact photo carousel. It may merge with reviews if that reads as repetition.
12. **FAQ** (`mg-faq`): a centred 720px list titled "Questions drivers always ask", rows with chevrons, no boxes.
13. **Visit the workshop** (`mg-contact-map`): a light card with address, hours, buttons and the map facade.
14. **Footer**: light grey, clean columns, NAP, policies.
15. **Mobile action bar** (≤ 749px): white bar with a top hairline; Call · WhatsApp · **Book** (black primary); safe-area padding; the page gets bottom padding. The desktop keeps the floating WhatsApp button.

Inner pages (service, car-make, quote, contact, collection, product) get the same light system: red hero banner or a light header band, black buttons, grey bands, the same cards and chips.

## 4. Quality bar (pre-flight, every section)

- Check it at 360, 390, 768, 1024 and 1440 widths with `tools/preview/shoot.mjs`: no horizontal page scroll, no clipped text, CTAs on one line, and the hero banner fits the first viewport with the plate input visible on 390×844.
- Contrast ≥ 4.5:1 for text (≥ 3:1 for large text and UI). Visible focus rings (2px ink ring with a 2px offset). Tap targets ≥ 44px.
- Consistency: every section uses `.mg-section`, `.mg-container`, `.mg-head`, and the same gaps, radii and card styles. No section invents its own.
- Copy: plain, specific, active voice, Irish/UK English. **No em dashes.** No hype words. No middle-dot strings in the UI except the Call · WhatsApp · Book labels (these are separate buttons, not a dotted string).

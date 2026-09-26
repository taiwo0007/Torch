# MG Car Audio: design system v3 (Back Market–style redesign)

**Direction (from Taiwo):** "Follow the same design guidelines as backmarket.ie. Do something new." Combine this with the client's favourites (radiomasters.ie, caraudiocentre.co.uk): **the home page is entered by system (category), not by car brand.** Be very mobile-responsive, with consistent spacing and MG's brand colour.

**Design read:** a light, friendly, trust-first shop-and-book home page for Irish drivers (mostly on phones). It borrows Back Market's design grammar (light canvas, serif statements, one bold signature colour on big surfaces, black actions, trust strip, carousels, customer-photo reviews), carries MG's own brand (red `#DF3131`, the Prompt font), and uses native Liquid and CSS on Horizon.

Dials (taste skill): DESIGN_VARIANCE 5 · MOTION_INTENSITY 5 (v3.1; was 3) · VISUAL_DENSITY 5.

Skills this follows: `.claude/skills/design-taste-frontend`, `.claude/skills/redesign-existing-projects`, `.claude/skills/ui-ux-pro-max` (accessibility and UX rules), and Anthropic's `frontend-design`. Where they conflict with Taiwo's explicit direction (Back Market's grammar), **Taiwo's direction wins**.

> **Both light and dark themes (Taiwo's call).** Light is the default Back Market look. Dark mode is a first-class alternative that follows the visitor's system setting, with a manual override. Every section must look finished in both. See §2A.

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

### 2A. Dark mode (required; same layout, swapped tokens)

- **How it switches:** `<html data-mg-theme="light|dark">`. The default comes from a new theme setting `mg_theme_mode` (`auto` | `light` | `dark`, default `auto`). `auto` follows `prefers-color-scheme`. A small **theme control** in the footer (a segmented "Auto / Light / Dark", not a sun/moon toggle) stores the visitor's choice in `localStorage`. An inline script in `<head>` applies it before first paint (no flash). `color-scheme` is set to match.
- **Implementation:** every colour comes from `--mg-*` tokens defined for light on `:root`, overridden under `[data-mg-theme="dark"]` (and under `@media (prefers-color-scheme: dark)` for `[data-mg-theme="auto"]`). `mg-theme.css` also remaps **Horizon's own variables** (`--color-background`, `--color-foreground`, `--color-border`, input, button, drawer and popover vars) from the same tokens, so the header, cart drawer, product and collection pages switch too.
- **Dark tokens:**

| Token | Dark value |
|---|---|
| `--mg-page` | `#0E1319` (blue-slate night) |
| `--mg-band` | `#151B24` |
| `--mg-card` | `#1A212C` |
| `--mg-line` | `#2A3442` |
| `--mg-ink` | `#EEF2F6` |
| `--mg-ink-2` | `#B3BDCA` |
| `--mg-ink-3` | `#8E99A8` |
| `--mg-red` | `#DF3131` (hero banner stays MG red in both modes) |
| `--mg-red-ink` | `#FF7A74` (red text on dark, AA) |
| `--mg-red-tint` | `#221A1F` (tile panel) |
| `--mg-warm` | `#1D1A18` |
| Primary button | **inverts**: `#F4F5F7` background, `#0F1115` text (the "black button" becomes a light button) |
| Shadows | none; elevation by `--mg-line` borders and a lighter surface |

- Photos stay the same. Where an image sits on a tinted panel, the panel must not become muddy: check each tile in both modes.
- The preview tool must screenshot **both modes** (light and dark) at mobile and desktop.

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

### Motion (v3.1: "premium car" pass)

Dial MOTION_INTENSITY 5. Every movement has a job: feedback, a reveal as content arrives, or the hero's mood.

- **Feedback:** 150–200ms on hover, focus and press. Buttons lift 1px on hover and press to `scale(.98)`; cards and photo tiles lift 2px; photos inside cards and tiles zoom slowly (700ms, ease-out) on hover-capable devices only.
- **Load:** one orchestrated rise on the hero copy (headline, italic line, lede, plate, WhatsApp link, 80ms apart). Inner-page h1s rise once.
- **Scroll reveal:** sections fade and lift 20px once as they enter (560ms), grids and carousels stagger their children 70ms apart (`assets/mg-reveal.js`, §5.14). Transform and opacity only, no layout shift, nothing hidden without JavaScript.
- **Ambient:** the hero photo crossfade with a slow Ken Burns zoom, the car-make marquee (the one marquee on the page) and a 5% image parallax on the photo panels. Each pauses off screen and on hover or focus; the hero and marquee have a pause button.
- **Never:** scroll listeners, scroll-jacking, bounce, animated width/height, motion on every small element.
- `prefers-reduced-motion`: no reveals, no crossfade (first photo only), no zoom, no parallax, the marquee becomes wrapped chips.

## 3. Home page v3 (mobile-first order)

1. **Header** (Horizon restyled): white; logo; big rounded search pill "What are you upgrading?"; phone link; cart. A second row with a horizontally scrollable system nav (CarPlay, Screens, Android radios, Speakers, Subs & amps, Dash cams, Reverse cameras, Conversions, Repairs). Thin hairline under it.
2. **Hero** (`mg-hero`, v3.1): a full-bleed night photo (optional crossfade of up to three) under a dark scrim, the serif h1 with the italic line in red ink, the plate input + light "Get a quote" button and the WhatsApp link, and a thin MG red tail-light line along the bottom edge. Phones: copy at the bottom, plate in the first screen at 390x844. *(v3 was a rounded MG red banner inside the container:)* Left: serif h1 on two lines, e.g. "Your car already has the screen." / *"Add CarPlay."* (the italic line in serif italic), one short sentence, and the **plate input + black "Get a quote" button**. Right: the MG BMW CarPlay photo (rounded, no scrim needed). Mobile: stacked, image on top, banner full width with 16px gutters. White text on red (4.6:1). The button is black on red with white text.
3. **Statement + trust strip** (`mg-trust-bar`): a centred serif statement "Ireland's CarPlay and car audio specialist." with the subline "Fixed fitted prices at our Dublin 12 workshop. Backed by our fitting warranty." (keep "warranty" wording as a placeholder until confirmed). Below it, a grey pill strip of 4 items with line icons. Mobile: a 2×2 grid inside a rounded grey panel.
4. **Shop by system** (`mg-system-grid`): h2 "Shop by system", with 8 tiles in a 4×2 grid on desktop and 2 columns on mobile. v3.1: full-photo tiles (`.mg-tile--photo`, 4:5, 5:6 from 990px) with a dark bottom scrim, white label and "From €X fitted", an arrow chip, and a red edge glow plus slow zoom on hover or focus. *(v3:)* Each tile: `--mg-red-tint` panel, MG photo centred with 12px radius (or a designed icon when no photo exists), label below ("CarPlay & Android Auto"), and a small "From €299 fitted" line in `--mg-red-ink`. The whole tile is the link. Hover: 1px red inset edge and a slight lift.
5. **Fitted prices panel** (`mg-services-grid` → Back Market "best deals" pattern): a grey band panel with a rounded photo on the left (desktop) and, on the right, chip tabs plus a horizontal card carousel of services with real prices (€350 BMW CarPlay, €299 BMW Android Auto iD7, €150 Android radio install, €149 iDrive 7 video in motion, €450 BMW Japanese-to-European conversion, others "Price on request"). Mobile: the photo is hidden and chips scroll horizontally above the cards. Round arrow buttons.
6. **Best sellers** (Horizon `product-list`, restyled as Back Market product cards in `mg-theme.css`).
7. **What's in every MG fit** (NEW section `mg-promise`, or reuse `mg-how-it-works`): a `--mg-warm` panel with a serif heading on the left and a white checklist card on the right (6 items with icons).
8. **Shop by car** (`mg-car-makes` → compact): h2 "Shop by car" and a scrollable row of make chips (text pills) plus "Japanese imports".
9. **How it works** (4 real steps, numbered, compact row, or merged into section 7 if it duplicates it).
10. **Reviews** (`mg-reviews` → Back Market style): h2 "What Dublin drivers say" + a rating summary; a carousel of photo cards (install photo top with a name tag top-left, stars, a 3-line quote, "Car: BMW 3 Series" line). Show a "Sample reviews" tag until real ones exist.
11. **Latest jobs** (`mg-gallery`): an optional compact photo carousel. It may merge with reviews if that reads as repetition.
11b. **Night-drive CTA band** (`mg-cta-band`, v3.1): full-bleed light-trails photo under a dark shade, a big serif line ("Send your reg tonight." / *"Drive home with CarPlay."*), Book + WhatsApp buttons, the red tail-light line. Sits before the FAQ.
12. **FAQ** (`mg-faq`): a centred 720px list titled "Questions drivers always ask", rows with chevrons, no boxes.
13. **Visit the workshop** (`mg-contact-map`): a light card with address, hours, buttons and the map facade.
14. **Footer**: light grey, clean columns, NAP, policies.
15. **Mobile action bar** (≤ 749px): white bar with a top hairline; Call · WhatsApp · **Book** (black primary); safe-area padding; the page gets bottom padding. The desktop keeps the floating WhatsApp button.

Inner pages (service, car-make, quote, contact, collection, product) get the same light system: black buttons, grey bands, the same cards and chips. v3.1: the service, book-a-fitting, services, car-make and collection headers are cinematic night panels (`.mg-cine`, §5.14): the photo fades into the dark panel, copy on top, red tail-light line.

**Photos (v3.1).** The `mg-img-*` files are royalty-free stock mood photos (docs/IMAGE_CREDITS.md). They set the scene in heroes, system tiles, panels and the CTA band, carry an empty `alt`, and are never presented as MG's work: "Latest jobs", reviews and anything that claims "our work" keep MG's own `mg-*` photos. Section fallback selects label them "(stock)".

## 4. Quality bar (pre-flight, every section)

- Check it in **light and dark** at 360, 390, 768, 1024 and 1440 widths with `tools/preview/shoot.mjs`: no horizontal page scroll, no clipped text, CTAs on one line, and the hero banner fits the first viewport with the plate input visible on 390×844.
- Contrast ≥ 4.5:1 for text (≥ 3:1 for large text and UI). Visible focus rings (2px ink ring with a 2px offset). Tap targets ≥ 44px.
- Consistency: every section uses `.mg-section`, `.mg-container`, `.mg-head`, and the same gaps, radii and card styles. No section invents its own.
- Copy: plain, specific, active voice, Irish/UK English. **No em dashes.** No hype words. No middle-dot strings in the UI except the Call · WhatsApp · Book labels (these are separate buttons, not a dotted string).

## 5. Component API

The shared layer every section builds on. Source: `theme/assets/mg-theme.css` (tokens, Horizon bridge, components), `theme/snippets/mg-theme-mode.liquid`, `mg-fonts.liquid`, `mg-mobile-action-bar.liquid`, `mg-carousel-script.liquid` and `theme/assets/mg-carousel.js`. See every component rendered in both schemes with `node tools/preview/shoot.mjs --gallery` (reference markup: `tools/preview/gallery.liquid`).

### 5.0 Rules for section authors

1. **Compose, don't restyle.** A section's `{% stylesheet %}` holds layout only (grid columns, order, image aspect). Colour, type, radius, spacing and states come from the classes and tokens below. If something is missing, ask for it here instead of inventing it in a section.
2. **The section root is `<div class="mg-section">` (plus a modifier).** It owns all vertical rhythm. Never put vertical padding or margin on a section root or its first/last child. Inside, use the spacing tokens.
3. **Tokens only.** No hex, `rgb()` or named colours in sections. Per-instance values go in `style="--x: ..."` only when they come from settings.
4. **Both schemes.** Every section must look finished with `data-mg-scheme="light"` and `"dark"`. Check with `shoot.mjs` (default modes are both) at 360, 390, 768 and 1440.
5. **Breakpoints:** phones up to 749px, tablet from 750px, desktop from 990px (Horizon's own). Write mobile first: `@media screen and (min-width: 750px)`, `(min-width: 990px)`.
6. **One `h1` per page** (hero or banner). Section titles are `h2.mg-head__title`.
7. **Horizon's own colour settings stay blank** in templates and section groups (header, footer, product list). Horizon parts follow the tokens through the bridge (§5.11); a hard-coded Horizon colour would not switch in dark mode.
8. **Copy:** sentence case, no em dashes, no uppercase eyebrows, no arrows appended to labels.

### 5.1 Tokens

Colour (light value / dark value). Dark values apply under `html[data-mg-scheme='dark']`.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--mg-page` (`-rgb`) | `#ffffff` | `#0e1319` | Page background |
| `--mg-band` | `#f4f5f7` | `#151b24` | Bands, panels, trust strip |
| `--mg-band-2` | `#eceef1` | `#1f2733` | Hover on band, disabled buttons, segmented control track |
| `--mg-card` | `#ffffff` | `#1a212c` | Cards |
| `--mg-card-raised` | `#ffffff` | `#202834` | Raised and hovered cards (dark mode lifts by lightening) |
| `--mg-input` | `#ffffff` | `#0e1319` | Field backgrounds |
| `--mg-warm` | `#f3efea` | `#1d1a18` | "What's in every MG fit" panel |
| `--mg-line` (`-rgb`) | `#e3e6ea` | `#2a3442` | Hairlines, card borders, secondary button border (light) |
| `--mg-line-strong` | `#c4c9d0` | `#3a4556` | Stronger dividers, empty stars, secondary button border (dark) |
| `--mg-line-input` | `#828a96` | `#66728a` | Field borders (3:1 or better, WCAG 1.4.11) |
| `--mg-ink` (`-rgb`) | `#0f1115` | `#eef2f6` | Text |
| `--mg-ink-2` | `#4b5360` | `#b3bdca` | Secondary text |
| `--mg-ink-3` | `#646c79` | `#8e99a8` | Tertiary text (4.5:1 on page, band and warm) |
| `--mg-red` (`-rgb`) | `#df3131` | `#df3131` | MG red surfaces (hero and banners), 1px hover edge |
| `--mg-red-deep` | `#bf2727` | `#bf2727` | Pressed state on red surfaces |
| `--mg-red-ink` | `#b51f1f` | `#ff7a74` | Red text: prices on tiles, small labels, errors |
| `--mg-red-tint` | `#fceeec` | `#221a1f` | System tile panel, red badge |
| `--mg-on-red` | `#ffffff` | `#ffffff` | Text on `--mg-red` (4.5:1) |
| `--mg-action` / `--mg-action-hover` | `#0f1115` / `#2b3039` | `#f4f5f7` / `#ffffff` | Primary buttons, selected chips, next arrow (black in light, inverted in dark) |
| `--mg-on-action` (`-rgb`) | `#ffffff` | `#0f1115` | Text on `--mg-action` |
| `--mg-white`, `--mg-black`, `--mg-black-hover` | fixed | fixed | Colours that must not flip (buttons on the red banner) |
| `--mg-whatsapp` / `--mg-on-whatsapp` | `#25d366` / `#06301a` | same | WhatsApp icon and the floating button only |
| `--mg-success`, `--mg-error` | `#1e7b34`, red-ink | `#5fd07a`, red-ink | Form states |
| `--mg-star`, `--mg-star-empty` | ink, line-strong | same tokens | Rating stars (black like Back Market, not yellow) |
| `--mg-focus` | ink | ink | Focus ring colour (white inside `.mg-surface-red`) |
| `--mg-scrim` | gradient | gradient | Text over photos (review cards) |
| `--mg-plate*` | white plate, `#1d4bb0` band, `#ffcc00` stars | same | Number plate only |
| `--mg-shadow`, `--mg-shadow-raised`, `--mg-shadow-float` | soft cool shadows | `none` (float: 1px ring) | Raised cards, hover, WhatsApp button |

Type: `--mg-font-ui` (Prompt 400/500/600), `--mg-font-display` (Source Serif 4 600, 600 italic). Sizes `--mg-fs-hero` `clamp(2.25rem, 6vw, 3.75rem)`, `--mg-fs-statement` `clamp(1.875rem, 4.5vw, 3rem)`, `--mg-fs-banner` `clamp(2rem, 5vw, 3.25rem)`, `--mg-fs-h2` `clamp(1.375rem, 2.6vw, 1.75rem)`, `--mg-fs-h3` 1.25rem, `--mg-fs-title` 1rem, `--mg-fs-body` 1rem, `--mg-fs-lede` 1.0625rem (1.125rem from 990px), `--mg-fs-small` .875rem, `--mg-fs-micro` .8125rem, `--mg-lh-body` 1.55.

Spacing: `--mg-space-1` to `--mg-space-9` = 4, 8, 12, 16, 24, 32, 48, 64, 96px. Use nothing else.

Layout (phone / tablet / desktop): `--mg-gutter` 16 / 24 / 32, `--mg-gap` (tile and card grids) 8 / 12 / 16, `--mg-head-gap` 16 / 16 / 20, `--mg-panel-pad` 24 / 32 / 48, `--mg-section-gap` 48 / 48 / 72 (space between two sections), `--mg-band-pad-top` / `-bottom` 48/56 then 72/80 from 990px, `--mg-container` 1120px, `--mg-container-narrow` 720px.

Radius: `--mg-radius-xs` 4 (badges, tags), `--mg-radius-sm` 8 (buttons, inputs, chips, photos inside tiles), `--mg-radius-md` 12 (cards, tiles), `--mg-radius-lg` 16 (panels, banners, trust panel on phones), `--mg-radius-pill` (trust strip on desktop, carousel arrows, theme control, WhatsApp button). Nested corners: inner radius = outer radius minus the padding between them.

Other: `--mg-z-float` 7 (action bar and WhatsApp button: below Horizon's sticky header 8, overlays 16, menu drawer 18 and every modal; DESIGN §2 said 40, which would have put them above Horizon's drawers), `--mg-ease`, `--mg-dur` 180ms, `--mg-tap` 44px, `--mg-action-bar-h` 65px.

### 5.2 Theme mode

- `<html data-mg-theme="auto|light|dark" data-mg-scheme="light|dark">`. Style against **`data-mg-scheme`** (the resolved scheme); `data-mg-theme` is the visitor's choice.
- Default from the theme setting **Colour theme** (`mg_theme_mode`, `auto` / `light` / `dark`, default `auto`). A visitor's choice is stored in `localStorage['mg-theme']`. `{% render 'mg-theme-mode' %}` in `<head>` (after `meta-tags`, before the stylesheets) applies it before first paint, follows `prefers-color-scheme` live in auto, and keeps `<meta name="theme-color">` in step.
- JS: `window.mgSetTheme('auto' | 'light' | 'dark')`; listen for `document` event `mg:themechange` (`detail: { mode, scheme }`).
- The control (the chrome task places it in the footer). Outputs nothing when **Show theme control** (`mg_show_theme_control`) is off. Needs no script:

```liquid
{% render 'mg-theme-mode', control: true, id: 'footer-theme' %}
{%- comment -%} optional: label: 'Theme', hide_label: true, class: 'my-footer__theme' {%- endcomment -%}
```

```html
<!-- output -->
<div class="mg-theme-control" role="radiogroup" aria-labelledby="footer-theme-label" data-mg-theme-control>
  <span class="mg-theme-control__label" id="footer-theme-label">Theme</span>
  <span class="mg-theme-control__options">
    <label class="mg-theme-control__option">
      <input class="mg-theme-control__input" type="radio" name="footer-theme" value="auto" data-mg-theme-input checked>
      <span class="mg-theme-control__text">Auto</span>
    </label>
    <!-- Light, Dark -->
  </span>
</div>
```

### 5.3 Layout

| Class | Purpose |
|---|---|
| `.mg-section` | Every section root. Padding of half the section gap top and bottom, so two sections sit 48px apart on phones and 72px on desktop. |
| `.mg-section--band` | Full-bleed `--mg-band` background with band padding (48/56, 72/80) and the full gap outside it. |
| `.mg-section--warm` | Same as band, `--mg-warm` background. |
| `.mg-section--flush` | No outer spacing (a section that continues the one above). |
| `.mg-container` | Centred 1120px column with the gutters (and safe-area insets). Horizon's page grid uses the same width and margins, so header, product grids and footer line up. |
| `.mg-container--narrow` | 720px column (FAQ, text pages). |
| `.mg-panel` | Rounded (16px) `--mg-band` panel inside the container with `--mg-panel-pad`. Modifiers: `--warm`, `--tint` (red tint), `--card` (card colour + line), `--flush` (no padding, clips children: image + content panels). |
| `.mg-surface-red` | MG red surface with white text. Re-points tokens for its children: primary buttons become fixed black with white text in both schemes, secondary buttons turn white-outlined, links inherit white, focus rings turn white. Use it with `.mg-panel` for the hero banner. |
| `.mg-grid` | `display: grid` with `gap: var(--mg-gap)`. Columns are set by the section. |
| `.mg-actions` | Row of buttons with a 12px gap; on phones the buttons share the row and wrap. |

```html
<div class="mg-section mg-section--band">
  <div class="mg-container">
    <div class="mg-head"><h2 class="mg-head__title">Fitted prices</h2></div>
    ...
  </div>
</div>

<div class="mg-section">
  <div class="mg-container">
    <div class="mg-panel mg-surface-red">...hero content...</div>
  </div>
</div>
```

### 5.4 Type

| Class | Purpose |
|---|---|
| `.mg-head` | Section head: title (and optional sub line) left, `.mg-head__link` or `.mg-head__actions` right, 16/20px above the content. Wraps on narrow screens. |
| `.mg-head__text` | Wrapper when the head has a title and a sub line. |
| `.mg-head__title` | The section `h2`: Prompt 600, `--mg-fs-h2`. |
| `.mg-head__sub` | One line under the title, `--mg-ink-2`. |
| `.mg-head__link` | "See all" link on the right (add `.mg-link`). |
| `.mg-head__actions` | Slot on the right for carousel buttons or a small button. |
| `.mg-head--center` | Centred head (statements, FAQ). |
| `.mg-display` | Serif statement heading, `--mg-fs-statement`. `<em>` inside sets the 600 italic (one short phrase only). |
| `.mg-display--hero` | Hero size (`--mg-fs-hero`, line height 1.05). Use on the page's `h1`. |
| `.mg-display--center` | Centred statement. |
| `.mg-h1-banner` | Serif `h1` for inner-page banners (service, car make, collection, quote). |
| `.mg-lede` | Intro paragraph under a heading: `--mg-fs-lede`, `--mg-ink-2`, 60ch, 12px above. |

```html
<div class="mg-head">
  <div class="mg-head__text">
    <h2 class="mg-head__title">Shop by system</h2>
    <p class="mg-head__sub">Fitted at our Dublin 12 workshop.</p>
  </div>
  <a class="mg-link mg-head__link" href="/collections/all">See all</a>
</div>

<h1 class="mg-display mg-display--hero">Your car already has the screen. <em>Add CarPlay.</em></h1>
<p class="mg-lede">Wireless CarPlay and Android Auto, fitted in about an hour in Dublin 12.</p>
```

### 5.5 Actions

| Class | Purpose |
|---|---|
| `.mg-btn` | Base button or link button: 48px tall, 8px radius, Prompt 500, sentence case, one line, press scale .98, 2px focus ring with 2px offset. Icons (`mg-icon`) inside are 20px. |
| `.mg-btn--primary` | Black button, white text (light); light button, dark text (dark). One primary per view. |
| `.mg-btn--secondary` | Transparent with a line border and ink text. |
| `.mg-btn--whatsapp` | Secondary look with a green WhatsApp icon. |
| `.mg-btn--on-red` | Black button with white text on the red banner, fixed in both schemes. (Inside `.mg-surface-red`, `--primary` already behaves this way.) |
| `.mg-btn--sm` / `--lg` | 44px / 56px tall. |
| `.mg-btn--block` | Full width. |
| `.mg-link` | Inline or standalone text link: ink, 500, 1px underline that thickens on hover. |

```html
<a class="mg-btn mg-btn--primary" href="/pages/book-a-fitting">{% render 'mg-icon', icon: 'calendar' %}Book a fitting</a>
<a class="mg-btn mg-btn--whatsapp" href="https://wa.me/{{ settings.mg_whatsapp_number }}?text={{ settings.mg_whatsapp_message | url_encode }}" target="_blank" rel="noopener">{% render 'mg-icon', icon: 'whatsapp' %}WhatsApp us</a>
```

Disabled: the `disabled` attribute (or `aria-disabled="true"` on links) dims to 50%.

### 5.6 Surfaces

| Class | Purpose |
|---|---|
| `.mg-card` | Card: `--mg-card`, 1px `--mg-line`, 12px radius. |
| `.mg-card--raised` | Soft shadow in light, lighter surface in dark. |
| `a.mg-card` / `.mg-card--link` | Whole-card link: lifts 2px with a shadow (light) or lighter surface and stronger line (dark) on hover. |
| `.mg-card__media` | Top image area, `aspect-ratio: var(--mg-media-ratio, 4 / 3)`, image covers. |
| `.mg-card__body` | 16px padded column with 4px gaps. |
| `.mg-card__title` / `.mg-card__meta` | 1rem 600 title / .875rem `--mg-ink-2` meta line. |
| `.mg-tile` | System tile ("Shop by system"): red-tint panel, photo, label, "From €X fitted". The whole tile is the link; tiles in a grid row share a height. Hover: 1px red inset edge and a 2px lift. |
| `.mg-tile--plain` | Band background instead of red tint. |
| `.mg-tile__media` | 4:3 photo area with 8px corners; an `mg-icon` inside is drawn large in red-ink when there is no photo. |
| `.mg-tile__label` / `.mg-tile__meta` | Label (600) / price line (red-ink, micro). |

```html
<a class="mg-card mg-card--link" href="/products/carplay-installation-bmw">
  <span class="mg-card__media">{{ image | image_url: width: 800 | image_tag: loading: 'lazy', sizes: '(min-width: 990px) 25vw, 80vw' }}</span>
  <span class="mg-card__body">
    <span class="mg-badge mg-badge--red">Most booked</span>
    <span class="mg-card__title">BMW Apple CarPlay</span>
    <span class="mg-card__meta">About 1 hour</span>
    <span class="mg-price mg-price--lg"><span class="mg-price__label">From </span>€350<span class="mg-price__label"> fitted</span></span>
  </span>
</a>

<a class="mg-tile" href="/collections/carplay-android-auto">
  <span class="mg-tile__media"><img src="{{ 'mg-audi-carplay-screen-800.webp' | asset_url }}" alt="" width="800" height="533" loading="lazy"></span>
  <span class="mg-tile__label">CarPlay &amp; Android Auto</span>
  <span class="mg-tile__meta">From €299 fitted</span>
</a>
```

### 5.7 Controls

| Class | Purpose |
|---|---|
| `.mg-chip` | Chip. On `span`/`li` it is a small static label (32px). On `button`, `a` or `label` it is a 44px filter or link. Selected (`aria-pressed="true"`, `aria-selected="true"`, `aria-current="page"`, `.is-active`, or a checked input right before it): ink fill. |
| `.mg-chips` | Single scrollable row with scroll snap and an edge fade (the fade follows the scroll position where supported). Put `role="group"` or `role="tablist"` and a label on it. |
| `.mg-chips--wrap` | Wrap onto more lines instead of scrolling. |
| `.mg-chips--bleed` | On phones, scrolls edge to edge under the gutters. |
| `.mg-field` | Label + field + help/error stack (6px gaps). |
| `.mg-label`, `.mg-label__optional` | Field label (.875rem 500), "(optional)" in ink-2. Label above the field, never a placeholder as label. |
| `.mg-input` | `input`, `select` or `textarea`: 48px, 8px radius, 3:1 border, focus ring. `aria-invalid="true"` turns the border red. |
| `.mg-help`, `.mg-error-text` | Help text (ink-2) and error text (red-ink) below the field, linked with `aria-describedby`. |
| `.mg-plate` | Irish number-plate input: white plate with a 2px black edge, blue EU band with the ring of 12 stars and "IRL", heavy uppercase characters, 56px tall, focus ring on the whole plate. Stays a white plate in dark mode. |
| `.mg-plate-group` | Plate + button on one row; the button drops below when the row is too narrow (phones). |
| `.mg-theme-control` | Segmented Auto / Light / Dark control (see §5.2). |

```html
<div class="mg-chips mg-chips--bleed" role="group" aria-label="Filter services">
  <button class="mg-chip" type="button" aria-pressed="true">All</button>
  <button class="mg-chip" type="button" aria-pressed="false">CarPlay</button>
</div>

<div class="mg-field">
  <label class="mg-label" for="quote-phone">Phone <span class="mg-label__optional">(optional)</span></label>
  <input class="mg-input" id="quote-phone" name="contact[phone]" type="tel" autocomplete="tel" aria-describedby="quote-phone-help">
  <p class="mg-help" id="quote-phone-help">We only call about your booking.</p>
</div>
```

Plate input (keep the field name the quote form reads, e.g. `reg`, and a real label):

```html
<form class="mg-plate-group" action="/pages/get-a-quote" method="get">
  <div class="mg-plate">
    <span class="mg-plate__band" aria-hidden="true">IRL</span>
    <label class="mg-visually-hidden" for="hero-reg">Your registration</label>
    <input class="mg-plate__input" id="hero-reg" name="reg" type="text" placeholder="241-D-12345"
      autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="12">
  </div>
  <button class="mg-btn mg-btn--on-red mg-btn--lg" type="submit">Get a quote</button>
</form>
```

The stars are drawn by CSS (`.mg-plate__band::before`, a mask in `--mg-eu-stars`), so the band only needs the "IRL" text. Show a visible label such as "Enter your reg" above the plate when space allows.

### 5.8 Data

| Class | Purpose |
|---|---|
| `.mg-price` | Price: 600, tabular numbers, no wrapping. |
| `.mg-price__cents` (or `sup`) | Superscript cents, Back Market style: `€149<span class="mg-price__cents">00</span>`. Only when a price really has cents on its label. |
| `.mg-price__label` | "From" / "fitted" inside a price: regular weight, ink-2, never larger than .875rem. |
| `.mg-price--lg`, `.mg-price--red` | 1.5rem price / red-ink price and labels. |
| `.mg-stars` | Five stars drawn by CSS, filled to `--mg-rating` (0 to 5, decimals allowed). Needs `role="img"` and an `aria-label`. `--sm` / `--lg` sizes (default 1rem). |
| `.mg-badge` | Small 4px-radius label on band. `--red` (tint + red-ink), `--ink` (action colours), `--card` (card colour: name tags on photos). |
| `.mg-sample-tag` | Dashed "Sample review" / "Sample photo" tag on demo content until the real thing exists. |
| `.mg-trust` | Trust strip, a `ul`: 2x2 in a rounded band panel on phones, 4 across from 750px, a pill from 990px. Items `li.mg-trust__item`; icon `{% render 'mg-icon', icon: 'shield', class: 'mg-trust__icon' %}` (20px in a card-coloured square). |

```html
<span class="mg-stars" style="--mg-rating: {{ settings.mg_review_rating | default: 5 }};" role="img" aria-label="Rated {{ settings.mg_review_rating }} out of 5"></span>

<ul class="mg-trust" role="list">
  <li class="mg-trust__item">{% render 'mg-icon', icon: 'shield', class: 'mg-trust__icon' %}<span>{{ settings.mg_warranty_text }}</span></li>
  <li class="mg-trust__item">{% render 'mg-icon', icon: 'tag', class: 'mg-trust__icon' %}<span>Fixed fitted prices</span></li>
</ul>
```

### 5.9 Carousel

CSS in `mg-theme.css`, behaviour in `assets/mg-carousel.js` (custom element `<mg-carousel>`). A section that renders a carousel includes the script with `{% render 'mg-carousel-script' %}` (a module script: fetched and run once per page however many sections include it). Without JavaScript the track still scrolls and snaps; the arrow buttons stay hidden.

```html
{% render 'mg-carousel-script' %}
<mg-carousel class="mg-carousel" style="--mg-carousel-desktop: 4;">
  <div class="mg-head">
    <h2 class="mg-head__title">What Dublin drivers say</h2>
    <div class="mg-head__actions">
      <div class="mg-carousel__nav">
        <button class="mg-carousel__btn" type="button" data-mg-carousel-prev aria-label="Previous reviews">{% render 'mg-icon', icon: 'chevron-left' %}</button>
        <button class="mg-carousel__btn" type="button" data-mg-carousel-next aria-label="Next reviews">{% render 'mg-icon', icon: 'chevron-right' %}</button>
      </div>
    </div>
  </div>
  <ul class="mg-carousel__track" role="list" tabindex="0" aria-label="Customer reviews">
    <li class="mg-carousel__slide">...card...</li>
  </ul>
</mg-carousel>
```

| Part | Contract |
|---|---|
| `.mg-carousel` | Slides per view from `--mg-carousel-mobile` (1.25), `--mg-carousel-tablet` (2.4), `--mg-carousel-desktop` (4); override them on the element. Gap `--mg-carousel-gap` (default `--mg-gap`). |
| `.mg-carousel--bleed` | On phones the track runs edge to edge under the gutters. |
| `.mg-carousel__track` (or `[data-mg-carousel-track]`) | The scrolling list: CSS grid, one column per slide, `scroll-snap-type: x mandatory`, hidden scrollbar, keyboard-scrollable with `tabindex="0"` and a label. |
| `.mg-carousel__slide` | One item; its child fills the slide height so cards line up. `hidden` slides are skipped (use it for chip filters). |
| `.mg-carousel__nav` | Holds the buttons. Hidden until the element upgrades and while nothing overflows. `.mg-carousel__nav--desktop` hides it below 750px (swipe only on phones). |
| `.mg-carousel__btn` | 40px round button with a 44px hit area: filled ink when it can move, grey when disabled. Needs an `aria-label`. |
| `[data-mg-carousel-prev]`, `[data-mg-carousel-next]` | Buttons anywhere inside the element; they get `aria-controls` and `disabled` at either end, and move one page (as many whole slides as fit). |
| `data-overflow` | Set on `<mg-carousel>` while the track can scroll. |
| `el.refresh()`, `el.reset()` | Re-measure after showing or hiding slides / scroll back to the start (call `reset()` after a chip filter). |

Respects `prefers-reduced-motion` (instant scroll).

### 5.10 Global parts (rendered by the layout, not by sections)

- **Fonts:** `snippets/mg-fonts.liquid` in `<head>` before the stylesheets: `@font-face` for Prompt 400/500/600 and Source Serif 4 600 + 600 italic (latin, `font-display: swap`), preloads Prompt 400 and Source Serif 4 600.
- **Mobile action bar:** `snippets/mg-mobile-action-bar.liquid`, 749px and narrower, every template except password: Call (`tel:+{{ settings.mg_phone_e164 }}`), WhatsApp (number and message from settings, product title added on product pages; follows "Show WhatsApp buttons"), Book (`/pages/book-a-fitting`, primary). The page gets `padding-bottom` for it. It slides away while a Horizon drawer or dialog is open (`html[scroll-lock]`, the menu drawer), while the sticky add-to-cart bar shows, and while a form field has focus. Sections need no bottom spacing of their own for it.
- **WhatsApp button:** `snippets/mg-whatsapp-button.liquid`, now 750px and wider only (the bar covers phones): green pill with icon and "Chat on WhatsApp", lifts above the sticky add-to-cart bar and the Shopify Inbox bubble.

### 5.11 Horizon bridge (what `mg-theme.css` does to Horizon)

- Both schemes: `--font-body/subheading/heading/accent--family` point at Prompt (weights 400/500/600/600), Horizon `h1` to `h3` sizes follow the MG scale, `--narrow-page-width` is 1120px and `--page-margin` equals `--mg-gutter` (the page width setting stays "narrow"), focus outline 2px with 2px offset, `--color-input-border` uses `--mg-line-input`, `--color-error` / `--color-success` use the MG tokens.
- Dark scheme: every palette variable from `color-palette.liquid` (`--color-background`, `--color-foreground`, `--color-border` and their `-rgb`, primary and secondary button sets, input, variant and selected variant sets), the dark `--opacity-*-*` values, drawer and popover borders and shadows, the drawer/popover/badge `.color-custom-*` surfaces, quick add, the header row backgrounds and the cart bubble.
- Visual polish of Horizon components (header, product cards, cart drawer, facets, footer, password page) lives in `assets/mg-horizon.css` (chrome task), loaded right after `mg-theme.css`.

### 5.12 Backward-compatible classes (Phase 1)

Kept so current sections keep working while they are redone; restyled to the v3 look. Don't use them in new code.

| Old | Now behaves like | Replace with |
|---|---|---|
| `.mg-heading` | `h2` title | `.mg-head__title` |
| `.mg-eyebrow` | small red-ink sentence-case label | drop it (no eyebrows), or `.mg-badge` |
| `.mg-section-head`, `--center`, `--row` | head spacing, centred, flex row | `.mg-head`, `.mg-head--center` |
| `.mg-section--surface` | band | `.mg-section--band` |
| `.mg-section--tight` | half the section padding | `.mg-section` (or `--flush`) |
| `.mg-btn--ghost` | secondary | `.mg-btn--secondary` |
| `.mg-price-from` (`small` + `strong`) | label + price | `.mg-price` with `.mg-price__label` |
| `.mg-placeholder-note` | micro ink-3 note | `.mg-help` or `.mg-sample-tag` |
| `--mg-bg`, `--mg-surface`, `--mg-surface-2`, `--mg-border`, `--mg-border-strong`, `--mg-text`, `--mg-text-muted`, `--mg-text-subtle` | page, band, band-2, line, line-strong, ink, ink-2, ink-3 | the new names |
| `--mg-accent`, `--mg-accent-text`, `--mg-accent-hover`, `--mg-accent-soft`, `--mg-on-accent`, `--mg-accent-hover-bg`, `--mg-glow` | red, red-ink, red-ink, red-tint, on-red, red-deep, 1px red ring | the new names (red is never a button fill) |
| `--mg-radius`, `--mg-page-max`, `--mg-section-space`, `--mg-h1`, `--mg-h2`, `--mg-h3`, `--mg-h1-page`, `--mg-eyebrow-size` | radius-md, container + gutters, section gap, fs-hero, fs-h2, fs-h3, fs-banner, fs-small | the new names |

### 5.14 Photo surfaces and motion (v3.1)

Source: the "13B" block in `mg-theme.css`, `assets/mg-reveal.js`, `snippets/mg-reveal-script.liquid` (rendered once by the layout), `snippets/mg-asset-image.liquid`.

| Class / attribute | Purpose |
|---|---|
| `.mg-surface-night` | Fixed dark surface (`--mg-night`) with light ink, light primary buttons, glass secondary buttons and a white focus ring, in both schemes. For content on photos. |
| `.mg-red-line` | A 2px MG red tail-light line along the element's bottom edge (fades out at both ends). |
| `.mg-cine` + `.mg-cine__media` | Cinematic panel: use with `.mg-panel.mg-surface-night`. The media (first in the markup) sits on top on phones and fades down into the copy; from 990px it fills the right side (`--mg-cine-media`, default 62%) and fades left. |
| `.mg-tile--photo` (+ `.mg-tile__arrow`) | Full-photo system tile: the `.mg-tile__media` image covers the tile under `--mg-photo-scrim`, white label and price. Hover (hover devices) and focus-visible: red edge (`--mg-red-edge`), 1.06 zoom, arrow nudge. Ratio via `--mg-tile-ratio`. |
| `.mg-section--top` | Section that starts flush under the header (full-bleed heroes). |
| `.mg-load-rise` | One-time rise on load; stagger with `style="--mg-load-delay: 180ms"`. |
| `[data-mg-reveal]` | Fades and lifts in once when it enters the viewport. Put it on a section's head and main block, not on small elements. |
| `[data-mg-reveal-stagger]` | The same for each direct child, 70ms apart (max 8 steps). Use on grids, lists and carousel tracks. |
| `[data-mg-parallax]` | Its `<img>` drifts ±5% against the scroll (CSS scroll-driven animation; a rAF fallback runs only while on screen, fine-pointer devices only). The wrapper clips. |
| `[data-mg-pause-offscreen]` | Gets `[data-mg-offscreen]` while out of view, so its CSS can pause animations. |
| `.mg-motion-toggle[data-mg-motion-toggle]` | 36px round pause button (44px hit area) with `aria-controls` and `aria-pressed`; the controlled element gets `[data-mg-user-paused]`. Render it `hidden`: the script shows it (never under reduced motion). Put a `pause` and a `play` `mg-icon` inside. |
| `{% render 'mg-asset-image', asset: 'mg-img-hero-1', sizes: '100vw', loading: 'eager', priority: 'high', class: '...' %}` | Theme photo with real width/height and a srcset when a smaller copy exists. Knows every `mg-*.webp` in `assets/`. |

Rules: reveals are progressive enhancement (the script adds `.mg-reveal-on` to `<html>` after marking what is already on screen, so nothing flashes); the theme editor and reduced motion get no reveals; one marquee per page.

### 5.13 Section pre-flight

- Root is `.mg-section` (+ one modifier), content in `.mg-container`, head is `.mg-head`.
- No colour values, no vertical padding on the root, no new radius or spacing values.
- Checked in light and dark at 360, 390, 768 and 1440 (`shoot.mjs <template> --widths 360,390,768,1440`, plus `--fold` for heroes): no horizontal scroll, no clipped text, buttons on one line.
- Every image has `alt` (empty only when decorative), width and height; everything clickable is 44px or larger and shows the focus ring.

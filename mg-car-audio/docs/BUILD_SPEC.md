# MG Car Audio: theme build spec (Phase 1 demo)

This is the contract every build task follows. The client brief is in `docs/BRIEF.md`. Text scraped from MG's current site (their own content, which we may reuse) is in `docs/source/`.

## 1. Project layout

```
mg-car-audio/
  theme/            Shopify theme (Horizon 4.2.0 base, customised). Push with the Shopify CLI.
  data/             CSV files to import through Shopify admin (products, redirects).
  docs/             Brief, this spec, admin setup guide, page copy.
```

Validate with `shopify theme check --path mg-car-audio/theme` (run from `/home/user/Torch`). **Zero errors is required.** Warnings in files you created must be fixed too. The 6 warnings already in untouched Horizon files are the baseline and can stay.

There is **no store connected yet**, so nothing can be previewed. Read Horizon's own sections before writing Liquid, and prefer patterns Horizon already uses.

## 2. Brand and design direction

- **Mood:** premium, dark, automotive, mobile-first. Think high-end car configurator or OEM infotainment UI, not a template. Plenty of negative space, strong uppercase headings, thin hairline borders, one confident accent colour.
- **Colours:** use the tokens in `theme/assets/mg-theme.css` (`--mg-bg`, `--mg-surface`, `--mg-surface-2`, `--mg-border`, `--mg-text`, `--mg-text-muted`, `--mg-accent` #e4002b, `--mg-whatsapp`, `--mg-star`). The global Horizon palette is already dark (`config/settings_data.json`). Never hard-code other colours. Red is only for primary buttons, "from" prices, eyebrows and small highlights.
- **Type:** Inter (Shopify font library) is set globally. Headings are uppercase and heavy, with tight tracking. Use `.mg-heading`, `.mg-eyebrow`, `.mg-lede` from `mg-theme.css`.
- **Shared classes** (in `mg-theme.css`, don't redefine them): `.mg-section`, `.mg-section--tight`, `.mg-section--surface`, `.mg-container`, `.mg-section-head` (`--center`, `--row`), `.mg-btn` (`--primary`, `--ghost`, `--whatsapp`, `--block`), `.mg-card`, `.mg-price-from`, `.mg-chip`, `.mg-grid`, `.mg-visually-hidden`, `.mg-placeholder-note`.
- **Icons:** inline SVG only (stroke icons, 24×24 viewBox, `stroke="currentColor"`, `aria-hidden="true"`). No icon fonts, no external libraries. Put reusable icons in `snippets/mg-icon.liquid` (see ownership) and call `{% render 'mg-icon', icon: 'phone' %}`.
- **Motion:** subtle only (hover lifts, fades). Respect `prefers-reduced-motion`.
- **Accessibility:** WCAG AA contrast on the dark background, real `<button>`/`<a>` elements, visible focus, labelled form fields, `alt` text on every image, one `<h1>` per page.

## 3. Performance and SEO rules

- Target a Lighthouse mobile score of 85 or more. No new JS libraries. If a section needs JS, keep it small, vanilla, deferred, and scoped to that section (a custom element or `{% javascript %}`).
- Images: use `image_url` + `image_tag` with `widths` and `sizes`, `loading: 'lazy'` except the hero, which is eager with `fetchpriority: 'high'`. For theme-asset fallback images use `{{ 'mg-xxx.webp' | asset_url }}` in an `<img>` with explicit `width`/`height`, `loading="lazy"` and `decoding="async"`.
- Nothing may output `noindex`. The store must be indexable at launch.
- Each section's CSS goes in its own `{% stylesheet %}` tag (plain CSS, no Liquid), scoped under a class unique to that section (for example `.mg-hero`). Per-instance values (for example a colour from settings) go in an inline `style="--var: value"` attribute.

## 4. Shopify / Horizon conventions

- New sections are **classic sections with section-defined (local) blocks**, not theme blocks. Don't mix `@theme` blocks with local blocks in the same section.
- Every section needs a `presets` entry so it can be added in the theme editor, and sensible defaults so it looks finished on a fresh install with **no admin setup**.
- Schema labels are plain English strings (no `t:` translation keys), so nobody has to edit `locales/`.
- Business details come from the global settings group "MG Car Audio: business details" (`settings.mg_*`, defined in `config/settings_schema.json`). Available: `mg_business_name`, `mg_tagline`, `mg_phone_display`, `mg_phone_e164`, `mg_email`, `mg_street`, `mg_locality`, `mg_region`, `mg_postcode`, `mg_country_code`, `mg_geo_lat`, `mg_geo_lng`, `mg_map_query`, `mg_hours_weekdays`, `mg_hours_saturday`, `mg_hours_sunday`, `mg_whatsapp_enabled`, `mg_whatsapp_number`, `mg_whatsapp_message`, `mg_review_rating`, `mg_review_count`, `mg_review_url`, `mg_warranty_text`. **Read these instead of hard-coding the phone number or address.** Don't add new global settings; if you need one, use a section setting.
- WhatsApp links: `https://wa.me/{{ settings.mg_whatsapp_number }}?text={{ message | url_encode }}`. Phone links: `tel:+{{ settings.mg_phone_e164 }}`.
- Links to pages that don't exist yet should be section `url` settings with defaults such as `/pages/book-a-fitting`, `/pages/get-a-quote`, `/pages/contact`, `/collections/carplay-android-auto`, `/pages/carplay-installation`, `/pages/bmw-carplay`.
- JSON templates (`templates/*.json`) must be valid JSON, reference only section types that exist, and use only setting IDs those sections define. Setting values must match their types and ranges.
- Horizon files outside your ownership list must not be edited. If you think one needs a change, say so in your final report.

## 5. Real content and prices from MG's current site

Use MG's own copy from `docs/source/` where it fits, lightly edited into Irish/UK English. Real contact details: Unit 3, Ballymount Business Centre, Ballymount Road Lower, Dublin 12, D12 YX27. Phone 087 034 4355. Hours: Mon–Fri 9:30am–7pm, Sat 11am–7pm, Sun by appointment.

Real prices from their Book Online page:

| Service | Duration | Price |
|---|---|---|
| BMW Apple CarPlay | — | €350 |
| BMW Android Auto installation (iDrive 7 / ID7) | 1 hr | €299 |
| Android radio system install | 1 hr 30 min | €150 |
| BMW Japanese-to-European conversion | 2 hr | €450 |
| Mercedes Japanese-to-European conversion | — | price on request |
| VW Japan-to-Europe conversion | — | price on request |
| Radio frequency conversion (Japan to Europe) | — | price on request |
| BMW iDrive 7 video in motion | — | €149 |
| Booking deposit | — | €50 |

For services without a real price, use an obvious placeholder ("From €X fitted", marked *placeholder* in the schema `info`). **Don't invent reviews attributed to real people.** Demo review text must be clearly generic ("Demo review: replace with real Google reviews"), shown with first-name-plus-initial placeholders, and the section setting `info` must say it's a placeholder.

Don't mention competitor names anywhere on the site.

## 6. Image assets available (theme `assets/`, all MG's own)

| File | Content | Size |
|---|---|---|
| `mg-bmw-carplay-screen.webp` | BMW widescreen with CarPlay (hero) | 1536×1024 |
| `mg-audi-carplay-screen.webp` | Audi dash, CarPlay with an iPhone | 1536×1024 |
| `mg-android-auto-dash.webp` | Dash with Android Auto screen | 1536×1024 |
| `mg-showroom.webp` | MG's showroom / product wall | 1600×1200 |
| `mg-single-din-radio.webp` | Single-DIN radio on white | 1024×1024 |
| `mg-door-speaker.webp` | Door speaker, dark | 1024×1024 |
| `mg-speaker-pair.webp` | Pair of speakers on white | 1024×1024 |
| `mg-dash-radio.webp` | Dash with head unit, dark | 1024×1024 |
| `mg-speaker-range-banner.webp` | Speaker range strip | 1600×320 |
| `mg-bmw-japan-to-europe.webp` | Conversion service graphic (BMW) | 1536×1024 |
| `mg-mercedes-japan-to-europe.webp` | Conversion service graphic (Mercedes) | 1536×1024 |
| `mg-vw-japan-to-europe.webp` | Conversion service graphic (VW) | 1536×1024 |
| `mg-radio-frequency-conversion.webp` | Radio frequency conversion graphic | 1536×1024 |

Pattern for sections: an `image_picker` setting, falling back to one of these theme assets when blank, so the demo looks complete before anything is uploaded. Don't add car-maker logos (trademarks). Car-make tiles are typographic.

## 7. File ownership

Each build task owns only its files. Create them all under `mg-car-audio/theme/` unless the path starts with `data/` or `docs/`.

| Task | Owns |
|---|---|
| **home-a** | `sections/mg-hero.liquid`, `sections/mg-trust-bar.liquid`, `sections/mg-car-makes.liquid`, `sections/mg-services-grid.liquid`, `snippets/mg-icon.liquid` |
| **home-b** | `sections/mg-how-it-works.liquid`, `sections/mg-gallery.liquid`, `sections/mg-reviews.liquid`, `sections/mg-faq.liquid`, `sections/mg-contact-map.liquid` |
| **quote** | `sections/mg-quote-form.liquid`, `snippets/mg-whatsapp-button.liquid`, `blocks/mg-fitting-cta.liquid`, `templates/page.quote.json` |
| **service** | `sections/mg-service-hero.liquid`, `sections/mg-service-details.liquid`, `sections/mg-service-cta.liquid`, `templates/page.service.json` |
| **car-make** | `sections/mg-car-make.liquid`, `templates/page.car-make.json`, `snippets/mg-local-business-schema.liquid`, `snippets/meta-tags.liquid` (Horizon file: only the title and description logic) |
| **chrome** | `sections/header-group.json`, `sections/footer-group.json`, `sections/mg-footer-contact.liquid`, `assets/mg-theme.css` (append only), `templates/collection.json`, `templates/password.json`, `sections/mg-collection-hero.liquid` |
| **data** | everything under `data/` and `docs/` except `BRIEF.md`, `BUILD_SPEC.md` and `docs/source/` |

**Shared rule:** `snippets/mg-icon.liquid` is created by home-a. Other tasks may need icons before it exists, so any task may **append** new icons to it, provided it keeps the existing `case`/`when` structure and doesn't edit other icons. Icons home-a must include: `phone`, `whatsapp`, `calendar`, `star`, `shield`, `map-pin`, `clock`, `check`, `arrow-right`, `chevron-down`, `camera`, `car`, `wrench`, `speaker`, `screen`, `message`, `upload`, `plus`.

`templates/index.json`, `templates/page.contact.json`, `templates/product.json`, and adding cross-task sections to other templates are done by the integration task after all sections exist. Build tasks don't touch them.

## 8. Data contracts (shared between theme and admin setup)

These names are fixed. The car-make section reads them, and the setup guide tells Taiwo to create them in admin.

**Page templates** (assigned to pages in admin): `page.quote` (quote form page, handle `get-a-quote`), `page.contact` (handle `contact`), `page.service` (service page; default content is Apple CarPlay & Android Auto installation, handle `carplay-installation`; other services later get duplicated templates such as `page.service-dashcam`), `page.car-make` (handle pattern `<make>-carplay`, for example `bmw-carplay`).

**Metaobject `car_make`** (enable "Web pages": off; it's referenced from pages):

| Key | Type | Example |
|---|---|---|
| `name` | Single line text (required) | `BMW` |
| `headline` | Single line text | `BMW CarPlay & Screen Upgrades in Dublin` |
| `intro` | Multi-line text | Two short paragraphs |
| `hero_image` | File (image) | — |
| `systems` | List of single line text | `iDrive CIC`, `iDrive NBT`, `NBT EVO (ID4–ID6)`, `iDrive 7 (ID7)` |
| `models` | List of single line text | `3 Series (F30/F31, 2012–2019)` |
| `from_price` | Single line text | `€299` |
| `services` | List of single line text | Each entry is `Service name \| Price \| /link`, for example `Wireless CarPlay retrofit \| €350 \| /products/carplay-installation-bmw`. Price and link are optional. |
| `faqs` | List of metaobject references → `faq` | — |
| `seo_title` | Single line text | `BMW CarPlay & Screen Upgrades in Dublin \| MG Car Audio` |
| `seo_description` | Multi-line text | ≤155 characters |

**Metaobject `faq`:** `question` (single line text, required), `answer` (multi-line text).

**Page metafield:** `custom.car_make` → metaobject reference to `car_make`.

**Product metafields:** `custom.car_make` (list of single line text), `custom.car_model` (list of single line text), `custom.screen_size` (single line text, for example `10.25"`), `custom.fitted_price` (single line text, for example `€350`: the "fitted from" price shown by the fitting CTA block). Products also get tags `make:BMW`, `type:carplay-interface` and so on, as a fallback for filtering and automated collections.

**Collections (handles):** `carplay-android-auto`, `android-radios`, `screen-upgrades`, `speakers`, `subwoofers`, `amplifiers`, `dashcams`, `reverse-cameras`, `accessories`, `installation-services`, `gift-vouchers`, `best-sellers`.

**Product handles used by links:** `carplay-installation-bmw`, `android-auto-installation-bmw-id7`, `android-radio-installation`, `booking-deposit`.

## 9. Definition of done for a build task

1. Every owned file exists, with schema, presets and working defaults.
2. `shopify theme check --path mg-car-audio/theme` reports no errors and no warnings in owned files.
3. A short final report listing: the files created, each section's `type` name and setting IDs (the integration task needs them to write `templates/index.json`), what's a placeholder, and anything in someone else's files that needs changing.

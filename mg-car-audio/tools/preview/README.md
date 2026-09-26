# Local theme preview

Renders the theme's JSON templates to static HTML with LiquidJS and screenshots them with
Playwright, so the custom `mg-*` sections can be checked without a Shopify store. It is an
approximation of Shopify's renderer, not a replacement for `shopify theme dev`.

## Setup (once)

```sh
cd tools/preview
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install
```

`playwright` is pinned to 1.56.1, which matches the Chromium build in `/opt/pw-browsers`
(`chromium-1194`). Do not run `playwright install`. If the bundled browser path doesn't match,
`shoot.mjs` falls back to any Chromium under `$PLAYWRIGHT_BROWSERS_PATH` (or set `CHROMIUM_PATH`).

## Usage (from the repo root)

```sh
node tools/preview/render.mjs page.service          # -> tools/preview/out/page.service.html
node tools/preview/render.mjs                       # index, page.service, page.car-make, page.quote, page.contact
node tools/preview/render.mjs --all                 # every templates/*.json
node tools/preview/render.mjs index --home-fallback # home = all mg home sections (DESIGN.md §3 order) with preset defaults
node tools/preview/render.mjs --sections mg-faq,mg-reviews --name faq  # ad-hoc page -> out/faq.html
node tools/preview/render.mjs --gallery             # component gallery (tools/preview/gallery.liquid) -> out/gallery.html
node tools/preview/render.mjs page.car-make --fixture page.car-make--fallback --name page.car-make-fallback
                                                    # same template with another fixtures.json entry -> out/page.car-make-fallback.html

node tools/preview/shoot.mjs                        # render + screenshot the 5 default templates, light and dark
node tools/preview/shoot.mjs index --modes dark --widths 360,390,768,1440
node tools/preview/shoot.mjs page.car-make --only mobile --fold
node tools/preview/shoot.mjs --gallery --widths 390,1440
```

Screenshots are full-page PNGs named `out/<template>-<width>-<mode>.png`, for example
`index-390-light.png` and `index-1440-dark.png`.

- `--modes light,dark` (default both). Each scheme is applied the way a visitor would get it:
  `localStorage['mg-theme']` is set before the page loads and `prefers-color-scheme` is emulated,
  so the theme's own head script (`snippets/mg-theme-mode.liquid`) sets `data-mg-theme` and
  `data-mg-scheme` on `<html>`. If that script is missing or fails, the attributes are set directly
  and the run reports it.
- `--widths 390,1440` (default). Any list, e.g. `360,390,768,1024,1440`. Heights: 844 below 750px,
  1024 up to 989px, 900 from 990px. Below 990px the page is emulated as a touch device (so
  `(hover: hover)` rules do not apply).
- `--only mobile|desktop|<width>`: one width (`mobile` = 390, `desktop` = 1440).
- `--fold`: also writes `<template>-<width>-<mode>-fold.png`, the first viewport only, with the
  fixed bars (mobile action bar, WhatsApp button) where a visitor sees them. Use it to check that
  the hero and plate input fit in 390x844.

The summary lists each screenshot with its size, the fixed MG elements that were showing
(`[mg-action-bar]` on phones, `[mg-wa-float]` from 750px), any horizontal overflow at that width,
the font faces that actually loaded, and browser errors (404s, console errors, failed requests).

Each render also writes `out/<template>.report.json` and prints a summary of rendered sections,
the layout snippets used, placeholders, errors and warnings.

Other flags: `--design-mode` (sets `request.design_mode`, shows editor-only notes),
`--no-preset-blocks`, `--out <dir>`, `--strict` (exit 1 on section errors).
`MG_THEME_DIR=<path>` points the renderer at a different theme folder.

The HTML uses relative asset URLs, so `out/*.html` also opens directly from disk. `shoot.mjs`
serves the repo on a random `127.0.0.1` port while it runs.

## What it does

- Reads the template JSON, `config/settings_schema.json` + `config/settings_data.json`, and the
  section files **at render time**, so edits by other agents are picked up on every run.
- `mg-*` sections are rendered for real: schema defaults overlaid with template settings; blocks
  from the template (or the first preset's blocks when the template has none, noted in the report).
- Every other section type (Horizon's `main-page`, `product-list`, `footer`, ...) becomes a dashed,
  labelled placeholder. The header is a fake bar; `footer-group.json` is rendered with its
  `mg-*` sections real and the rest as placeholders.
- The page follows `layout/theme.liquid`, read on every run: every `{% render %}` there that is
  `stylesheets`, `theme-styles-variables`, `color-palette` or any `mg-*` snippet is rendered for
  real, in the layout's order (in `<head>`: `mg-theme-mode`, `mg-fonts`, `stylesheets`, ...; after
  the page: `mg-whatsapp-button`, `mg-mobile-action-bar`). New `mg-*` hooks are picked up
  automatically. `<html>` gets `data-mg-theme` / `data-mg-scheme` from the "Colour theme" setting.
- Fonts load from `theme/assets` through `snippets/mg-fonts.liquid` (Prompt 400/500/600, Source
  Serif 4 600 and 600 italic). Google Fonts are only used if a Horizon font setting names a
  non-system font.
- All `{% stylesheet %}` blocks in the theme are bundled (as Shopify does). The `{% javascript %}`
  blocks of the files that rendered run at the end of `<body>`.
- `--gallery` renders `tools/preview/gallery.liquid`: every shared component from
  `assets/mg-theme.css` (docs/DESIGN.md §5) with reference markup, for checking the design
  system itself in both schemes.
- A Liquid error in one section becomes a red error box and the rest of the page still renders.
  Unknown filters log a warning and pass the value through. Missing snippets and assets are
  reported as warnings.
- Fake `page` / `collection` / `product` objects come from `fixtures.json` (edit it to try other
  titles, page content or `metafields`, e.g. a `custom.car_make` metaobject). `page.car-make` has
  the BMW `car_make` entry from `docs/content/car-make-bmw.md`; `page.car-make--fallback` is the
  same page with no entry (a fresh install). `--fixture <key>` picks another entry for a template,
  and `--name <file>` (with one template) names the output, so both states can be shot side by side.

## Known gaps vs real Shopify

- Horizon sections, theme blocks (`{% content_for %}`), header/menus, cart, search and apps are not
  rendered (placeholders only). Horizon's own JS (`scripts` snippet) is not loaded.
- No real images from the admin: `image_picker` settings set to `shopify://shop_images/...` show
  a grey placeholder, and blank ones take the section's asset fallback. `image_url` ignores sizes
  and `image_tag` does not emit `srcset`.
- Metafields and metaobjects are empty unless you add them to `fixtures.json`. Products and
  collections are empty stubs, `form` objects are never "posted" and have no errors, and there is
  no customer.
- Filters are approximations: `money` formats EUR; `t` looks up `locales/en.default*.json`;
  color and font filters are reimplemented; `font_face`/`font_url` output nothing (Horizon's
  font settings are system fonts; the MG faces come from `mg-fonts`).
- LiquidJS and Shopify Liquid differ in edge cases (whitespace, some filter argument handling,
  nil/blank comparisons on unusual objects).
- In full-page screenshots, `position: fixed` elements (the mobile action bar, the floating
  WhatsApp button) show where they sit in the first viewport, so they overlap whatever is there;
  `--fold` shows them in place. Horizon's desktop scroll container is unlocked so the full page
  can be captured. CSS animations are finished before capture, and every scroll reveal
  (`[data-mg-reveal]`, `[data-mg-reveal-stagger]`) is marked done, so the page shows its settled
  state. Infinite animations (hero crossfade, marquee) show their first frame. Every image is
  decoded first, and each full-page shot is taken twice (the first capture primes Chromium's
  raster; a single capture sometimes left photos far below the fold unpainted).
- The header is a fake bar that follows the MG tokens (so it switches with the scheme); the real
  Horizon header, drawers and search are not rendered.

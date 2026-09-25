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
node tools/preview/render.mjs index --home-fallback # home = all mg home sections with preset defaults
node tools/preview/render.mjs --sections mg-faq,mg-reviews --name faq  # ad-hoc page -> out/faq.html

node tools/preview/shoot.mjs                        # render + screenshot the 5 default templates
node tools/preview/shoot.mjs page.car-make --only mobile
```

Screenshots are full-page PNGs: `out/<template>-mobile.png` (390x844 viewport) and
`out/<template>-desktop.png` (1440x900). Each render also writes `out/<template>.report.json`
and prints a summary of rendered sections, placeholders, errors and warnings.

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
- `<head>` follows `layout/theme.liquid`: the real `stylesheets`, `theme-styles-variables`,
  `color-palette` and `mg-local-business-schema` snippets, plus fonts from Google Fonts.
  All `{% stylesheet %}` blocks in the theme are bundled (as Shopify does). The `{% javascript %}`
  blocks of the files that rendered run at the end of `<body>`. `mg-whatsapp-button` renders last.
- A Liquid error in one section becomes a red error box and the rest of the page still renders.
  Unknown filters log a warning and pass the value through. Missing snippets and assets are
  reported as warnings.
- Fake `page` / `collection` / `product` objects come from `fixtures.json` (edit it to try other
  titles, page content or `metafields`, e.g. a `custom.car_make` metaobject).

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
  color and font filters are reimplemented; `font_face`/`font_url` output nothing because
  fonts come from Google Fonts (the font must exist there).
- LiquidJS and Shopify Liquid differ in edge cases (whitespace, some filter argument handling,
  nil/blank comparisons on unusual objects).
- In full-page screenshots, `position: fixed` elements (the floating WhatsApp button) show where
  they sit in the first viewport, and Horizon's desktop scroll container is unlocked so the full
  page can be captured. CSS animations are finished before capture.

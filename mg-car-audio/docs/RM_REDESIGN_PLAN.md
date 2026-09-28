# MG Car Audio: Radio Masters–style redesign (v4)

**Direction from Taiwo:** emulate radiomasters.ie's layout and page structure (they're the Irish authority) without plagiarism, in MG's own design system. The reg checker is a secondary, tucked-away feature, not the hero. Use the frontend skills in `.claude/skills/` (design-taste-frontend, redesign-existing-projects, ui-ux-pro-max).

Inputs:
- Layout study: `docs/RM_LAYOUT_STUDY.md`.
- Reference screenshots (session scratchpad, not committed): `/tmp/claude-0/-home-user-Torch/b3ea4f2c-e353-58ca-b5fe-bd6b5578fffa/scratchpad/rm/`.
- Existing system: `docs/DESIGN.md` (tokens, Component API §5/§5.14, motion), `docs/BUILD_SPEC.md` §3–5, §8.

## Rules
- Borrow structure and patterns only. **Never** copy RM's wording, photos, logo, colours (their lime/yellow/blue/red blocks), or distinctive graphics.
- The look is MG: **dark by default** (set `mg_theme_mode` default and settings_data to `dark`; light still works), near-black surfaces, MG red `#DF3131` accents, the Prompt UI font (headings may go bold uppercase like RM where it suits: tile labels and section heads), cinematic photos (`theme/assets/mg-img-*.webp`, credits in `docs/IMAGE_CREDITS.md`), and the existing motion system (`mg-reveal.js`).
- Keep what works: MG's real reviews in `templates/index.json` (don't change their text), real prices, `settings.mg_*`, the quote form, WhatsApp, JSON-LD, the theme editor settings, and one h1 per template.
- Stock photos are for mood only and never presented as MG's jobs.
- Copy: Irish/UK English, plain and specific, no em dashes, no hype words.
- Shopify upload limits (the local theme check misses these): labels and option labels ≤ 50 characters; info ≤ 500; range ≥ 3 steps; section name ≤ 25 characters; `url` defaults only `/collections` or `/collections/all`; font handles stay as they are.

## Improve on RM
- **Hero:** one clear message and primary CTA, not their stacked blocks.
- **Mobile header:** short, not a 300px tower.
- **Service pages:** show prices and booking, not just an SEO essay.
- **Mobile menu:** submenus that expand.
- **Mobile footer:** accordions.
- **Prices:** "From €X fitted" everywhere.

## File ownership (parallel tasks, don't edit others' files)
| Task | Owns |
|---|---|
| **chrome** | `sections/header-group.json`, `sections/footer-group.json`, `assets/mg-horizon.css`, `snippets/mg-mobile-action-bar.liquid`, `snippets/mg-whatsapp-button.liquid`, `sections/mg-footer-contact.liquid`, NEW `sections/mg-topbar.liquid` (contact strip, if needed as a header-group section), `config/settings_data.json` (theme mode + palette only), `config/settings_schema.json` (MG group only) |
| **home** | `sections/mg-hero.liquid`, `sections/mg-system-grid.liquid`, `sections/mg-trust-bar.liquid`, `sections/mg-reviews.liquid`, `sections/mg-cta-band.liquid`, `sections/mg-services-grid.liquid`, `sections/mg-promise.liquid`, `sections/mg-car-makes.liquid`, `sections/mg-how-it-works.liquid`, NEW `sections/mg-fit-check.liquid` (the tucked-away reg/make checker block), NEW `sections/mg-visit-callback.liquid` (premises photo + short callback/quote form, like RM's home-page closer), `templates/index.json` |
| **shop** | `templates/collection.json`, `templates/product.json`, `templates/list-collections.json`, `templates/search.json`, `sections/mg-collection-hero.liquid`, `blocks/mg-fitting-cta.liquid`, NEW `blocks/mg-fit-info.liquid` (a "Will it fit?" block reading product metafields), NEW `sections/mg-shop-by-car.liquid` if needed, `assets/mg-shop.css` |
| **pages** | `sections/mg-service-hero.liquid`, `sections/mg-service-details.liquid`, `sections/mg-service-cta.liquid`, `sections/mg-gallery.liquid`, `sections/mg-faq.liquid`, `sections/mg-contact-map.liquid`, `sections/mg-car-make.liquid`, `sections/mg-quote-form.liquid`, NEW `sections/mg-about-*.liquid`, templates `page.service*.json`, `page.services.json`, `page.gallery.json`, `page.contact.json`, `page.quote.json`, `page.book-a-fitting.json`, `page.car-make.json`, NEW `page.about.json`, NEW `page.faq.json`, `assets/mg-pages.css` |

Shared: `assets/mg-theme.css` (tokens and components) may only be **appended** to, each task under its own `/* === task: <name> === */` block. Don't change existing tokens except in the chrome task (theme mode defaults). `snippets/mg-icon.liquid`: append icons only.

## Quality bar
- Screenshots in light **and** dark (dark first) at 360, 390, 768 and 1440 via `tools/preview/shoot.mjs`: no horizontal overflow, CTAs on one line.
- AA contrast. Focus rings. Tap targets ≥ 44px. `prefers-reduced-motion` respected.
- `shopify theme check` shows 0 errors and no new warnings. `tools/validate_templates.py` passes.

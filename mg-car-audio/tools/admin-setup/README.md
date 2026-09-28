# Admin setup helpers

Used to fill the demo store via the Admin GraphQL API instead of the CSV import.

- `products_to_json.py` (run from `data/`): turns `products.csv` into `productSet` inputs (`/tmp/products.json`). Inventory is untracked, so every demo product can be bought. The gift voucher is created as a normal product because gift cards need activating first.
- `pages_to_json.py` (run from `docs/content/`): builds the 22 pages (title, handle, template suffix, body HTML, SEO) as `/tmp/pages.json`.

What was created on 28 Sep 2026:
- 4 product metafield definitions (`custom.car_make` and `custom.car_model` as lists, `screen_size`, `fitted_price`) with storefront read access.
- 59 products published to the Online Store and Shop channels.
- 12 automated tag collections (docs/SETUP.md §6), each with SEO filled in.
- 22 pages with templates.
- `main-menu` and the `footer` (Help) menu, laid out per docs/RM_REDESIGN_PLAN.md.

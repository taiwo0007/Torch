# MG Car Audio: store setup runbook

For **Taiwo**. Follow the steps in order: each one depends on the ones before it. Exact values are given everywhere, so nothing has to be made up in the admin.

**Markers**

- **[HUMAN]** Taiwo must do this himself: logins, approvals, anything involving money, the client, or MG's own accounts (brief §1).
- **[ADMIN]** A browser step in Shopify admin. Taiwo, or an agent driving a browser while Taiwo is logged in.
- **[CLI]** A terminal step, run from `/home/user/Torch`.

**Files this guide uses**

| File | What it is |
|---|---|
| `mg-car-audio/theme/` | The theme (Horizon 4.2.0, customised) |
| `mg-car-audio/data/products.csv` | 20 products (10 demo hardware, 10 real installation services), Shopify import format |
| `mg-car-audio/data/products-no-metafields.csv` | Same products without metafield columns (fallback, §5) |
| `mg-car-audio/data/redirects.csv` | 40 redirects from the old Wix URLs |
| `mg-car-audio/data/build_products.py` / `validate_data.py` | Edit products in the script, rebuild the CSV, validate |
| `mg-car-audio/docs/content/*.md` | Ready-to-paste page copy and car make entries |
| `mg-car-audio/docs/APPS.md` | App shortlist |

Admin menu names move around between Shopify admin versions. Where two names exist, both are given (for example **Content → Menus**, called **Online Store → Navigation** on older admins).

Contents: 1 Before you start · 2 Store settings · 3 Theme · 4 Custom data · 5 Import products · 6 Collections · 7 Metaobject entries · 8 Pages · 9 Menus · 10 Search & Discovery · 11 Theme settings · 12 Redirects · 13 Test orders · 14 SEO checklist · 15 Phase 1 hand-off · 16 Phase 2 and 3 · Appendix A placeholders · Appendix B metafield values · Appendix C unverified details.

---

## 1. Before you start

1. **[HUMAN]** Create a free Shopify Partner account at partners.shopify.com.
2. **[HUMAN]** In the Dev Dashboard, create a **Client transfer store** (not a Dev store: Dev stores can't be transferred). Country **Ireland**, currency **EUR**. Suggested store name: `mg-car-audio-demo` (the myshopify.com address can't be changed later).
3. **[CLI]** Check the tools: `node --version` (Node LTS) and `shopify version` (Shopify CLI 4.x; this project was checked with 4.8.2).
4. **[CLI]** Validate everything before you touch the store:

```bash
cd /home/user/Torch
shopify theme check --path mg-car-audio/theme        # must report 0 errors
python3 mg-car-audio/data/validate_data.py --check-urls   # must end "OK: no errors"
```

What a client transfer store can't do (shopify.dev, read 25 Sep 2026): it stays password-protected, it can't take real payments (use the Bogus Gateway), you can only install free or partner-friendly apps, and custom apps are blocked. So everything here uses the admin, the theme and CSV imports, with no API tokens.

---

## 2. Store settings

### 2.1 Store details  **[ADMIN]**

**Settings → General** (called **Store details** on some admins):

| Setting | Value |
|---|---|
| Store name | `MG Car Audio` (exactly this: the theme adds " \| MG Car Audio" to page titles unless the title already contains the store name, so any other name would double up titles) |
| Store email (contact email) | **Taiwo's own email during the demo**, so test quote-form messages don't reach MG. Change it to MG's email at transfer |
| Sender email | Same as above |
| Store phone | `+353 87 034 4355` |
| Legal business name | MG's registered name *(ask MG; placeholder `MG Car Audio`)* |
| Billing / store address | Unit 3, Ballymount Business Centre, Ballymount Road Lower, Dublin 12, D12 YX27, Ireland |
| Store currency | Euro (EUR). Set at store creation; check it here |
| Time zone | (GMT+00:00) Dublin |
| Unit system / default weight unit | Metric system / Kilograms (kg) |
| Order ID | Prefix `MG`, so orders read `#MG1001` |

### 2.2 Markets  **[ADMIN]**

**Settings → Markets**: Ireland is the primary market, currency EUR. Leave other markets inactive for the demo (Northern Ireland and the UK can be added in Phase 2 if MG wants them).

### 2.3 Taxes: Irish VAT 23%, prices include VAT  **[ADMIN]**

1. **Settings → Taxes and duties → European Union / Ireland**: make sure Shopify is collecting VAT for Ireland. Ireland's standard rate is **23%**, and Shopify's default rate for Ireland should already show 23%: check it.
2. Turn on **prices include tax** (Shopify's label is "Include sales tax in product price and shipping rate" or "All prices include tax"; on newer admins it's per market, under **Settings → Markets → Ireland**). Every price in `products.csv` is VAT-inclusive (€350 is €350 to the customer).
3. Charge VAT on shipping: on (Irish VAT applies to delivery charges).
4. **[HUMAN]** VAT registration number: MG's number, added by MG or with his permission. Leave blank for the demo.

All 20 products have **Charge tax: TRUE**, including the installation services and the deposit (VAT applies to services and to deposits in Ireland).

### 2.4 Payments: test orders only  **[ADMIN]**

**Settings → Payments**:

1. Add the **(for testing) Bogus Gateway** (**Add payment method** → search "Bogus" → Activate). Alternatively, Shopify Payments in test mode.
2. Bogus Gateway test cards: card number `1` = successful payment, `2` = failed payment, `3` = gateway error. Name on card: `Bogus Gateway`. Any future expiry date and any 3-digit security code.
3. Don't add real payment details. MG sets up Shopify Payments himself after the transfer (**[HUMAN]**, Phase 3).

### 2.5 Checkout  **[ADMIN]**

**Settings → Checkout**:

| Setting | Value |
|---|---|
| Customer contact method | Email (or phone number or email) |
| Full name | Require first and last name |
| Company name | Don't include |
| Address line 2 | Optional |
| Shipping address phone number | **Required** (MG needs a phone number to arrange fittings) |
| Marketing opt-in | Show email sign-up, unticked by default |
| Tipping | Off |

### 2.6 Shipping and delivery  **[ADMIN]**

**Settings → Shipping and delivery**. All rates are *placeholders* (see `docs/content/shipping.md`, which uses the same numbers):

1. **General shipping rates → Ireland** zone:
   - `Standard delivery`: €7.95 *(placeholder)*.
   - `Free standard delivery`: €0.00, with the condition **based on order price, minimum €150** *(placeholder)*.
2. Remove the "Rest of world" zone for now (the shipping page says Republic of Ireland only, *placeholder*).
3. **Local pickup**: do §2.7 first (rename the default location to `MG Car Audio – Ballymount`), then come back and enable local pickup for that location. Pickup instructions: `We'll email you when your order is ready. Collect from Unit 3, Ballymount Business Centre, Dublin 12, Mon–Fri 9:30am–7pm, Sat 11am–7pm.` Expected pickup time: "Usually ready in 24 hours" *(placeholder)*.

Installation services have **Requires shipping: FALSE**, so an order with only services (or the deposit) skips delivery entirely.

### 2.7 Locations  **[ADMIN]**

**Settings → Locations**: rename the default location to `MG Car Audio – Ballymount`, address as in §2.1. Hardware stock from the CSV is added to this location.

### 2.8 Notifications  **[ADMIN]**

**Settings → Notifications**: leave the default templates for the demo. Check that the sender email is Taiwo's (§2.1).

### 2.9 Policies  **[ADMIN]**, then **[HUMAN]** review

**Settings → Policies**:

1. Return and refund policy: paste the returns part of `docs/content/warranty-returns.md` (from "Returning an item bought online" down).
2. Privacy policy, Terms of service: **Create from template**, then fill in MG's details.
3. Shipping policy: paste `docs/content/shipping.md` (below the line).
4. Contact information: trade name `MG Car Audio`, phone `087 034 4355`, the Ballymount address, and MG's email and VAT number (**[HUMAN]**: ask MG).
5. **[HUMAN]** MG reviews all policies before launch (placeholders are listed in Appendix A).

### 2.10 Online Store preferences and password  **[ADMIN]**

**Online Store → Preferences**:

| Setting | Value |
|---|---|
| Home page title | `MG Car Audio \| CarPlay, Android Auto & Car Audio Fitting in Dublin` (66 characters; type a plain `\|`) |
| Home page meta description | `Ireland's CarPlay and car audio specialist. Wireless CarPlay, Android Auto, screen upgrades, speakers and cameras, fitted at our Dublin 12 workshop.` (148) |
| Social sharing image | Preferences takes an uploaded file, not a URL: download MG's showroom photo (https://static.wixstatic.com/media/c67c38_9f66ce5182fa4d39be339a5217ee9483~mv2.jpeg) and upload it here |

**Password**: **Settings → Online store → Store access → Password protection** (path from shopify.dev). Set a simple password to share with MG, for example `mg-demo-2026` *(choose your own)*. The password page can't be removed while the store is in your Partner organisation. Its design comes from the theme's `templates/password.json`.

---

## 3. Push and publish the theme  **[CLI]** + **[HUMAN]** login

Do this **before creating pages**: the page **Theme template** dropdown only lists the templates in the *published* theme, so `page.quote`, `page.service`, `page.car-make`, `page.contact`, `page.book-a-fitting`, `page.services` and `page.gallery` must be live first. Publishing is safe: the storefront stays behind the password.

```bash
cd /home/user/Torch
shopify theme check --path mg-car-audio/theme
shopify theme push --store mg-car-audio-demo --path mg-car-audio/theme --unpublished --theme "MG Car Audio v1"
```

- **[HUMAN]** The first CLI command that talks to the store opens a browser: Taiwo logs in with his Partner account.
- The push prints an editor link and a **preview link** (`https://mg-car-audio-demo.myshopify.com/?preview_theme_id=…`). Keep both.
- **No-login alternative (Theme Access):** **[HUMAN]** install the free **Theme Access** app by Shopify (Apps → Shopify App Store → "Theme Access"), create a password for your email, then add `--password shptka_…` to any theme command. Never commit that password.

Publish it:

```bash
shopify theme list --store mg-car-audio-demo
shopify theme publish --store mg-car-audio-demo --theme "MG Car Audio v1"
```

Or in the admin: **Online Store → Themes → MG Car Audio v1 → … → Publish**.

**Later pushes:** once anyone has changed settings in the theme editor, those changes live in `config/settings_data.json`, `templates/*.json` and `sections/*-group.json` on the store. Pull first (`shopify theme pull --store mg-car-audio-demo --theme "MG Car Audio v1" --path mg-car-audio/theme`), or push code only with `--ignore "config/settings_data.json" --ignore "templates/*.json" --ignore "sections/*.json"`. For live editing while you work: `shopify theme dev --store mg-car-audio-demo --path mg-car-audio/theme`.

---

## 4. Custom data definitions (before the product import)  **[ADMIN]**

Admin: **Settings → Metafields and metaobjects** (called **Custom data** on older admins). The keys must match exactly: the theme and the CSV use them.

For every definition below, tick **Storefronts** access (older wording: "Storefront API access" or "Expose to storefront"). If you see **Filtering** or **Smart collections** options, tick those too.

Create them in this order: metaobjects first (a page metafield can't reference a metaobject that doesn't exist yet), then the metafields.

### 4.1 Metaobject definition: FAQ

**Metaobject definitions → Add definition**

| Setting | Value |
|---|---|
| Name | `FAQ` |
| Type (API handle) | `faq` (check that it didn't become `faq_1` or similar) |
| Display name | Question |
| Options | **Web pages: off.** Storefronts access: **on**. Active-draft status: leave off (if you turn it on, every entry must be set to *Active* or it won't show on the site) |

| Field name | Key | Type | Validation |
|---|---|---|---|
| Question | `question` | Single line text, one value | Required |
| Answer | `answer` | Multi-line text | – |

### 4.2 Metaobject definition: Car make

| Setting | Value |
|---|---|
| Name | `Car make` |
| Type (API handle) | `car_make` |
| Display name | Name |
| Options | **Web pages: off** (car make pages are ordinary pages that reference an entry). Storefronts access: **on**. Active-draft status: off |

| Field name | Key | Type | Validation |
|---|---|---|---|
| Name | `name` | Single line text, one value | Required |
| Headline | `headline` | Single line text, one value | – |
| Intro | `intro` | Multi-line text | – |
| Hero image | `hero_image` | File, one file | Accept: images only |
| Systems | `systems` | Single line text, **list of values** | – |
| Models | `models` | Single line text, **list of values** | – |
| From price | `from_price` | Single line text, one value | – |
| Services | `services` | Single line text, **list of values** | – |
| FAQs | `faqs` | Metaobject, **list of entries**, reference type: FAQ | – |
| SEO title | `seo_title` | Single line text, one value | – |
| SEO description | `seo_description` | Multi-line text | Optional: max 155 characters |

When you type a field name, Shopify suggests a key. Check each one against the table (for example "FAQs" must give `faqs`, "SEO title" `seo_title`).

### 4.3 Page metafield: Car make

**Metafield definitions → Pages → Add definition**

| Name | Namespace and key | Type |
|---|---|---|
| Car make | `custom.car_make` | Metaobject → **Car make**, one entry |

### 4.4 Product metafields

**Metafield definitions → Products → Add definition**

| Name | Namespace and key | Type | Example |
|---|---|---|---|
| Car make | `custom.car_make` | Single line text, **list of values** | BMW |
| Car model | `custom.car_model` | Single line text, **list of values** | 3 Series (F30/F31) |
| Screen size | `custom.screen_size` | Single line text, one value | 10.25" |
| Fitted price | `custom.fitted_price` | Single line text, one value | €350 |

Don't add "preset choices" validation to Car make for now. If you do, it must allow exactly these values or the import will reject rows: `BMW`, `Audi`, `Mercedes-Benz`, `Volkswagen`, `Universal`, `Toyota`, `Lexus`, `Nissan`, `Honda`, `Mazda`.

Don't assign these definitions to a product category ("category metafields"): they must apply to all products.

---

## 5. Import products  **[ADMIN]**

**Before:** §4.4 definitions exist (metafield columns without a definition are ignored or rejected). The CSV validates (`python3 mg-car-audio/data/validate_data.py`). Don't open and re-save the CSV in Excel: it can break the UTF-8 characters (€, –) and the line breaks inside cells. If you need to change something, edit `data/build_products.py` and run `python3 mg-car-audio/data/build_products.py`.

**Import:**

1. **Products → Import → Add file** → `mg-car-audio/data/products.csv`.
2. Leave "Overwrite products with matching handles" unticked the first time (tick it for re-imports). Tick "Publish new products to all sales channels" if offered.
3. **Upload and preview**. The preview should say **20 products**. **Import products**. Shopify downloads the 22 images from MG's Wix site, which takes a few minutes; you get an email when it's done.

**What's in it:**

| Group | Products | Prices |
|---|---|---|
| Demo hardware (tag `demo-placeholder`) | 10: CarPlay/Android Auto interfaces for BMW NBT/NBT EVO, Audi MMI 3G/3G+, Mercedes NTG 4.5/5, VW MIB2; 10.25" BMW F30 and 12.3" Mercedes W205 Android screens; 9" Android double-DIN radio; 7" CarPlay double-DIN radio; wireless CarPlay adapter; reverse camera kit | **All placeholders** (€79–€699) |
| Installation services (type `Installation`, vendor MG Car Audio, no shipping) | 10: CarPlay Installation – BMW (4 iDrive variants, all €350), Android Auto BMW iDrive 7 (€299), Android radio installation (€150), BMW iDrive 7 video in motion (€149), BMW Japan-to-Europe (€450), Mercedes Japan-to-Europe (€450\*), VW Japan-to-Europe (€350\*), radio frequency conversion (€150\*), reverse camera installation (BMW €750, Audi €699, VW €650, Honda €399), booking deposit (€50) | **MG's real prices.** \*From MG's own service pages; the build spec lists these three as "price on request": confirm with MG |

**After, check:**

1. **Products**: 20 products, all Active. Filter by tag `demo-placeholder`: 10.
2. Open **Wireless CarPlay & Android Auto Interface – BMW NBT / NBT EVO**: 3 variants at €249, 1 image with alt text, and in **Metafields**: Car make `BMW`, Car model **8 separate items**, Fitted price `€350`.
3. Open **CarPlay Installation – BMW**: 4 variants at €350, "This is a physical product" unticked, "Charge tax" ticked.
4. Hardware stock: tracked, 6–20 units at MG Car Audio – Ballymount.

**If the metafields didn't import** (empty, or Car model is one item containing line breaks). Shopify's help centre couldn't be read from the build environment, so the list format in the CSV (one value per line in the cell, as Shopify's own exports write it) is the best available evidence rather than a confirmed spec (Appendix C). Then:

1. Re-import `products-no-metafields.csv` with **Overwrite products with matching handles** ticked (or leave the products as they are).
2. **Products → select all → Bulk edit → Columns** → add the four metafields, and paste the values from **Appendix B**. In the bulk editor, list values are separated with commas.

---

## 6. Collections  **[ADMIN]**

**Products → Collections → Create collection**, 12 times. Every one is **Automated** (smart), **Products must match: all conditions**, condition **Product tag · is equal to · `<tag>`**. After saving, check the handle under **Search engine listing → URL handle** matches the table (Shopify builds it from the title; "CarPlay & Android Auto" gives `carplay-android-auto`).

| Title | Handle = tag | Sort | Description (shown in the collection hero) | Products now |
|---|---|---|---|---|
| CarPlay & Android Auto | `carplay-android-auto` | Best selling | Wireless Apple CarPlay and Android Auto for your factory screen, plus widescreen upgrades and CarPlay radios, supplied and fitted at our Dublin 12 workshop. | 11 |
| Android Radios | `android-radios` | Best selling | Android touchscreen radios with wireless CarPlay and Android Auto built in, and professional fitting for €150. | 2 |
| Screen Upgrades | `screen-upgrades` | Best selling | OEM-style widescreen Android displays for BMW, Mercedes-Benz, Audi and VW, with wireless CarPlay and Android Auto. | 2 |
| Speakers | `speakers` | Best selling | Door and dash speaker upgrades from trusted brands such as JBL, fitted properly for clearer sound. | 0 |
| Subwoofers | `subwoofers` | Best selling | Deep, controlled bass for any car, from compact under-seat subwoofers to boot enclosures. | 0 |
| Amplifiers | `amplifiers` | Best selling | Amplifiers that give your speakers and subwoofer the clean power they need. | 0 |
| Dashcams | `dashcams` | Best selling | Front and rear dashcams, hard-wired with no trailing cables. | 0 |
| Reverse Cameras | `reverse-cameras` | Best selling | HD reversing cameras that work with your factory or aftermarket screen, supplied and fitted in Dublin 12. | 2 |
| Accessories | `accessories` | Best selling | Wireless CarPlay adapters, leads and the small upgrades that make a big difference. | 1 |
| Installation Services | `installation-services` | Manually (put CarPlay Installation – BMW first) | Book CarPlay, Android Auto, radio, camera and conversion fittings at our Dublin 12 workshop. A €50 deposit secures your slot. | 9 |
| Gift Vouchers | `gift-vouchers` | Best selling | Give the gift of a better drive. Our gift vouchers can be spent on products and fitting. | 0 |
| Best Sellers | `best-sellers` | Manually | Our most popular upgrades and fitting services. | 6 |

**SEO (Search engine listing)** for each collection:

| Handle | Page title | Meta description |
|---|---|---|
| carplay-android-auto | `CarPlay & Android Auto Upgrades, Fitted in Dublin \| MG Car Audio` | `Wireless Apple CarPlay and Android Auto interfaces, screens and radios for BMW, Audi, Mercedes-Benz, VW and more. Supplied and fitted in Dublin 12.` |
| android-radios | `Android Radios with CarPlay & Android Auto \| MG Car Audio` | `Android touchscreen radios with wireless CarPlay and Android Auto, plus professional fitting for €150 at our Dublin 12 workshop.` |
| screen-upgrades | `BMW, Mercedes, Audi & VW Screen Upgrades \| MG Car Audio` | `OEM-style widescreen Android displays with wireless CarPlay and Android Auto for BMW, Mercedes-Benz, Audi and VW. Fitted in Dublin 12.` |
| speakers | `Car Speakers, Supplied & Fitted in Dublin \| MG Car Audio` | `Speaker upgrades from trusted brands such as JBL, fitted properly for clearer vocals and tighter bass. Supplied and fitted at our Dublin 12 workshop.` |
| subwoofers | `Car Subwoofers, Supplied & Fitted in Dublin \| MG Car Audio` | `Deep, controlled bass for any car, from compact under-seat subwoofers to boot enclosures. Supplied and fitted at our Dublin 12 workshop.` |
| amplifiers | `Car Amplifiers, Supplied & Fitted in Dublin \| MG Car Audio` | `Car amplifiers that give your speakers and subwoofer clean, reliable power. Supplied and fitted at our Dublin 12 workshop.` |
| dashcams | `Dashcams, Supplied & Hard-Wired in Dublin \| MG Car Audio` | `Front and rear dashcams, professionally hard-wired with no trailing cables. Supplied and fitted at our Dublin 12 workshop.` |
| reverse-cameras | `Reverse Cameras, Supplied & Fitted in Dublin \| MG Car Audio` | `HD reversing cameras for your factory or aftermarket screen. BMW, Audi, VW and Honda supplied and fitted from €399 at our Dublin 12 workshop.` |
| accessories | `Car Audio & CarPlay Accessories \| MG Car Audio` | `Wireless CarPlay adapters, leads and the small upgrades that make a big difference. Click and collect from our Dublin 12 workshop.` |
| installation-services | `Car Audio & CarPlay Installation Services, Dublin \| MG Car Audio` | `Book CarPlay, Android Auto, radio, reverse camera and import conversion fittings at our Dublin 12 workshop. A €50 deposit secures your slot.` |
| gift-vouchers | `Gift Vouchers \| MG Car Audio` | `Give the gift of a better drive. MG Car Audio gift vouchers can be spent on products and fitting at our Dublin 12 workshop.` |
| best-sellers | `Best Sellers: CarPlay, Screens & Fitting \| MG Car Audio` | `Our most popular CarPlay upgrades, Android screens and fitting services, supplied and fitted at our Dublin 12 workshop.` |

(Type every `\|` as a plain `|`.)

**Collection images** (optional; the collection hero falls back to its own design): download and upload MG's pictures. BMW CarPlay (`c67c38_a37dca…png`) for CarPlay & Android Auto and Screen Upgrades; dash radio (`c67c38_5bc219…jpg`) for Android Radios; speaker pair (https://static.wixstatic.com/media/c67c38_5bd4a81395ac4bb39a3e5aeabc54406f~mv2.jpg) for Speakers; showroom (`c67c38_9f66ce…jpeg`) for Installation Services and Best Sellers. Full URLs are in `data/build_products.py`.

The five empty collections (Speakers, Subwoofers, Amplifiers, Dashcams, Gift Vouchers) are created now because the theme and redirects link to them, but keep them out of the menu until Phase 2 adds products. Gift vouchers in Phase 2: **Products → Gift cards → Add gift card product**, denominations €50 / €100 / €250 *(placeholder)*, tag `gift-vouchers`.

---

## 7. Metaobject entries  **[ADMIN]**

**Content → Metaobjects**

1. **FAQ → Add entry**: create the four BMW FAQs from `docs/content/car-make-bmw.md` §1.
2. **Car make → Add entry**: create the BMW entry from `docs/content/car-make-bmw.md` §2 (upload the hero image to **Content → Files** first). Save. If Active-draft status is on for the definition, set the entry to **Active**.
3. **Required in Phase 1:** the Audi, Mercedes-Benz and Volkswagen entries and their FAQs from `car-make-audi.md`, `car-make-mercedes-benz.md` and `car-make-volkswagen.md`. The home page car make tiles for those three makes link to their pages (§8 step 2), so the pages and their entries must exist before the demo. The files mark which prices are placeholders.

---

## 8. Pages  **[ADMIN]**

**Online Store → Pages → Add page.** For each page: title, content, **Theme template** (right-hand panel), and under **Search engine listing → Edit**: page title, meta description and **URL handle**. Always set the handle by hand: Shopify builds it from the title, which would give `about-mg-car-audio` instead of `about`.

| Title | Handle | Template | Content | SEO page title / meta description |
|---|---|---|---|---|
| About MG Car Audio | `about` | Default page | `docs/content/about.md` | In the file |
| Contact Us | `contact` | `page.contact` | `docs/content/contact.md` | In the file |
| Get a Quote | `get-a-quote` | `page.quote` | Leave empty (the template's H1 is "Get a fixed quote", set in the theme editor, not the page title) | `Get a Quote: CarPlay, Screens & Car Audio \| MG Car Audio` / `Send your reg, car and what you'd like fitted and we'll reply with a fixed fitted price. Or WhatsApp us a photo of your dash for the fastest quote.` |
| Book a Fitting | `book-a-fitting` | `page.book-a-fitting` | `docs/content/book-a-fitting.md` (deposit terms only; the template has the rest) | In the file |
| Apple CarPlay & Android Auto Installation in Dublin | `carplay-installation` | `page.service` | Leave empty (the template has all the content; the title is the page heading) | `Apple CarPlay & Android Auto Installation in Dublin \| MG Car Audio` / `Wired and wireless Apple CarPlay and Android Auto for BMW, Audi, Mercedes-Benz, VW and more. OEM-style finish, BMW from €350. Fitted in Dublin 12.` |
| BMW CarPlay & Screen Upgrades | `bmw-carplay` | `page.car-make` | Leave empty | In `docs/content/car-make-bmw.md` §3 |
| Our Work | `gallery` | `page.gallery` | `docs/content/gallery.md` (one paragraph; the template shows MG's photos) | In the file |
| Frequently Asked Questions | `faq` | Default page | `docs/content/faq.md` | In the file |
| Warranty & Returns | `warranty-returns` | Default page | `docs/content/warranty-returns.md` | In the file |
| Shipping & Collection | `shipping` | Default page | `docs/content/shipping.md` | In the file |
| Our Services | `services` | `page.services` | `docs/content/services.md` | In the file |

Then:

1. Open **BMW CarPlay & Screen Upgrades → Metafields → Car make** and select the **BMW** entry. Save.
2. **Required in Phase 1** (the home page's Audi, Mercedes-Benz and Volkswagen tiles link here, so without these pages they 404): also create `Audi CarPlay & Screen Upgrades` (`audi-carplay`), `Mercedes-Benz CarPlay & Screen Upgrades` (`mercedes-benz-carplay`) and `Volkswagen CarPlay & Screen Upgrades` (`volkswagen-carplay`), all with template `page.car-make`, and link each to its entry from §7 step 3. If an entry is missing, the page still works: it takes the make from the first word of the title and shows the section's make-neutral fallback (no hero price; only the €150 Android radio fitting is priced, the rest say "Price on request").

Pasting the Markdown: paste into the page editor, then set `##` lines as **Heading 2** and `###` as **Heading 3**, or paste the text into any Markdown previewer first and copy the formatted result. Tables paste best from a previewer.

---

## 9. Navigation menus  **[ADMIN]**

**Content → Menus** (older admins: **Online Store → Navigation**). The theme's header uses `main-menu`; the footer uses `main-menu`, `services` and `footer`.

### main-menu (edit the existing "Main menu")

| Item | Link | Children |
|---|---|---|
| Home | `/` (Home page) | – |
| Shop | `/collections/all` (Collections → All products) | CarPlay & Android Auto → `/collections/carplay-android-auto` · Screen Upgrades → `/collections/screen-upgrades` · Android Radios → `/collections/android-radios` · Reverse Cameras → `/collections/reverse-cameras` · Accessories → `/collections/accessories` · Installation Services → `/collections/installation-services` · Best Sellers → `/collections/best-sellers` (Phase 2: add Speakers, Subwoofers, Amplifiers, Dashcams, Gift Vouchers) |
| Services | `/pages/services` | Apple CarPlay & Android Auto → `/pages/carplay-installation` · Android Radio Fitting → `/products/android-radio-installation` · Reverse Camera Installation → `/products/reverse-camera-installation` · All Services → `/pages/services` |
| Car Makes | `/pages/bmw-carplay` | BMW → `/pages/bmw-carplay` · Audi → `/pages/audi-carplay` · Mercedes-Benz → `/pages/mercedes-benz-carplay` · VW → `/pages/volkswagen-carplay` (all four pages are created in §8) |
| Gallery | `/pages/gallery` | – |
| Book Fitting | `/pages/book-a-fitting` | – |
| Contact | `/pages/contact` | – |

Drag a child under its parent to nest it.

### footer (edit the existing "Footer menu")

About → `/pages/about` · FAQ → `/pages/faq` · Warranty & Returns → `/pages/warranty-returns` · Shipping & Collection → `/pages/shipping` · Contact → `/pages/contact` · Privacy Policy → `/policies/privacy-policy` · Terms of Service → `/policies/terms-of-service` · Refund Policy → `/policies/refund-policy`

### services (new menu: title `Services`, check its handle is `services`)

Apple CarPlay & Android Auto → `/pages/carplay-installation` · BMW Apple CarPlay → `/products/carplay-installation-bmw` · BMW Android Auto (iDrive 7) → `/products/android-auto-installation-bmw-id7` · Android Radio Fitting → `/products/android-radio-installation` · Reverse Camera Installation → `/products/reverse-camera-installation` · Japan-to-Europe Conversions → `/pages/services` · Book a Fitting → `/pages/book-a-fitting`

---

## 10. Search & Discovery filters  **[ADMIN]**

1. Install **Shopify Search & Discovery** (free, by Shopify): https://apps.shopify.com/search-and-discovery.
2. **Apps → Search & Discovery → Filters → Add filter**, in this order:

| # | Source | Label shown on the site |
|---|---|---|
| 1 | Product metafield **Car make** (`custom.car_make`) | Car make |
| 2 | Product metafield **Car model** (`custom.car_model`) | Car model |
| 3 | Product metafield **Screen size** (`custom.screen_size`) | Screen size |
| 4 | Product type | Type |
| 5 | Vendor | Brand |
| 6 | Price | Price |
| 7 | Availability (already there by default) | Availability |

A metafield only appears in the source list if its definition exists (§4.4). Filters only show on the storefront for values that products actually have. **Brand** (Vendor) has a single value in Phase 1, because every demo product's vendor is `MG Car Audio` (the hardware is own-label placeholder stock). It becomes useful in Phase 2, when MG's real products (JBL and so on) are added with their brand as the vendor.

3. Check: `/collections/all?filter.p.m.custom.car_make=BMW` (the BMW page's "Shop BMW parts" button) should list only BMW products.
4. **Synonyms** (Search & Discovery → Synonyms), one group per line:
   - `carplay, car play, apple carplay`
   - `android auto, androidauto`
   - `reverse camera, reversing camera, rear camera, backup camera, parking camera`
   - `head unit, stereo, car radio, radio`
   - `sat nav, satnav, navigation, gps`
   - `idrive, i-drive`
   - `vw, volkswagen`
   - `merc, mercedes, mercedes-benz`
   - `japan to europe, japanese import, import conversion`

---

## 11. Theme settings and editor checks  **[ADMIN]**

**Online Store → Themes → Customise → Theme settings → MG Car Audio: business details**:

| Setting | Now | Action |
|---|---|---|
| Phone, address, hours, WhatsApp number (`353870344355`) | MG's real details | **[HUMAN]** Confirm the WhatsApp number with MG |
| Email | Blank (hidden) | MG's site shows `MGCARAUDIODUBLIN@GMAIL.COM`. **[HUMAN]** Confirm with MG before adding it (it's published on every page) |
| Latitude / Longitude | Blank | Right-click MG's pin in Google Maps and copy the two numbers (used in local SEO structured data) |
| Google rating / review count | **Placeholder** 4.9 / 120 | **Before the demo:** look up MG Car Audio's public Google Business Profile (search "MG Car Audio Ballymount" in Google Maps) and copy the real star rating and review count. No client contact is needed. They show in the home trust bar, the reviews section and the service page hero as "from N Google reviews", so invented figures must not reach MG. If the profile has no rating, clear both fields: the rating hides everywhere |
| Google reviews link | Blank | The same profile's reviews URL (Share → copy link) |
| Warranty headline | "Workmanship warranty" (no length) | **[HUMAN]** Once MG confirms a length, change it to, for example, "12-month fitting warranty" |

**Logo and favicon** (brief §7: theme branded). **Theme settings → Logo and favicon**: upload MG's logo (a light or white version for the dark header; download it from MG's current site or ask MG for the original file) and a square favicon (at least 32 × 32 px, for example the red "MG" mark on black). Until a logo is uploaded, the header shows "MG CAR AUDIO" as styled text with a red bar, which is fine for the demo.

**Announcement bar** (**Header → Announcement bar**): the third message is plain text, `Call or WhatsApp 087 034 4355`, linked to `tel:+353870344355`. It doesn't read Theme settings, so if the number ever changes, edit this text and link as well.

**Reviews section** (home page): the five reviews are clearly marked demo text ("Demo review: replace with a real Google review", source label "Demo", and a "Demo" banner above the carousel). Before launch, replace each with a real Google review, copied word for word with the customer's permission (first name and initial only), set the source label to `Google`, and turn off **Show "Demo reviews" banner**.

Then click through the home page, one collection, one product and each page template in the editor and check nothing needs a setting (the integration task sets up `templates/index.json` and `templates/product.json`). If the home page "Best sellers" grid isn't already pointing at a collection, choose **Best Sellers**.

---

## 12. Redirects (Phase 2, before the domain moves)  **[ADMIN]**

**Content → Menus → URL redirects → Import** (older admins: **Online Store → Navigation → URL redirects**) → **Add file** → `mg-car-audio/data/redirects.csv` → **Upload file** → **Import redirects**. The file has the two columns Shopify expects, `Redirect from` and `Redirect to`, and 40 rows.

Shopify redirects are permanent (301) and only fire when the old path would otherwise be a 404, so they don't affect any live page. They only matter once `mgcaraudio.ie` points to Shopify (Phase 3). Test then with `curl -I https://www.mgcaraudio.ie/book-online` (expect `301` to `/pages/book-a-fitting`).

**What the crawl of mgcaraudio.ie found (25 September 2026):**

- **No sitemaps:** `/sitemap.xml`, `/pages-sitemap.xml`, `/store-products-sitemap.xml`, `/booking-services-sitemap.xml` and `/store-categories-sitemap.xml` all return 404, because Wix doesn't publish a sitemap while the site is set to `noindex`. `/shop` is also a 404 (redirected anyway, as the brief asks). URLs were collected from the links and page data on the home, About, Contact, Book Online and All Products pages instead.
- **Pages:** `/about`, `/contact`, `/book-online`, `/category/all-products`.
- **Shop categories:** `/category/all-products`, `/category/car-stereos`, `/category/car-speakers`, `/category/reverse-camera-installation-service`.
- **Products (7):** `/product-page/bmw-reversing-camera-installation` (€750), `/product-page/audi-reverse-camera-installation` (€699), `/product-page/volkswagon-reverse-camera-installaton` (€650, MG's spelling), `/product-page/honda-reverse-camera-installation` (€399), `/product-page/jbl-stadium-52cf-speakers-set` (€189), `/product-page/coaxial-speaker-pair` (€90), `/product-page/compact-single-din` (€199).
- **Service pages (9 live + 3 already 404 on Wix):** `bmw-apple-carplay`, `bmw-android-auto-installation-id7`, `android-radio-system-install`, `bmw-idrive-7-video-in-motion`, `bmw-japanese-to-europe-conversion`, `mercedes-japanese-to-european-spec-conversion`, `vw-japan-to-europe-conversion`, `radio-frequency-conversion-japan-to-europe`, `customer-deposit-to-book-the-slot`; plus `audio-system-upgrade`, `car-audio-installation`, `product-selection-assistance` (still referenced in Wix's page data but already 404).
- **Booking calendar:** `/booking-calendar/<same slug>` for each of the 12 services.
- **Cart:** `/cart-page`.

Each maps to the closest new page: services to their installation product, reverse cameras to `/products/reverse-camera-installation`, speakers to `/collections/speakers`, the single-DIN stereo and the car stereos category to `/collections/android-radios`, removed services to the nearest collection or the quote page. In Phase 2, if MG's JBL speakers, coaxial pair and compact single-DIN are added as products, edit those three redirects to point at the new product pages.

---

## 13. Test orders  **[ADMIN]**

With the Bogus Gateway (§2.4):

1. **Hardware + delivery:** add the 9" Android radio (€279) to the cart, check out to a Dublin address, standard delivery, card `1`. Expect the order total to show VAT included: €279 includes €52.17 VAT (279 − 279 ÷ 1.23).
2. **Service only:** buy the booking deposit (€50). Checkout should skip delivery (no shipping needed), and the order shows €9.35 VAT included.
3. **Failed payment:** repeat with card `2` and check the error message.
4. **Click and collect:** buy the wireless CarPlay adapter and choose Pick up.
5. Check the order emails arrive at Taiwo's store email, not MG's.
6. Afterwards, **cancel and archive** the test orders (and restock) so MG's order list starts clean after the transfer.

---

## 14. SEO checklist (brief §6)

| Item | What the theme and data already do | What's manual (who, when) |
|---|---|---|
| Store is indexable, no `noindex` | Nothing in the theme outputs a robots `noindex` (see `snippets/meta-tags.liquid`); Shopify's default `robots.txt` and `/sitemap.xml` are left alone | **[HUMAN]** The client transfer store is password-protected, so Google can't see it until MG's plan is active and the password is removed at launch (Phase 3). After launch: view the source of the home page, check there's no `noindex`, and run URL Inspection in Google Search Console |
| Unique title and meta description on every page | Car make pages use the entry's `seo_title` / `seo_description`, or build "`<Make>` CarPlay & Screen Upgrades in Dublin". Titles get " \| MG Car Audio" automatically unless they already contain it. All 20 products have an SEO title and description in the CSV (≤155 characters) | **[ADMIN]** Enter the page (§8), collection (§6) and home page (§2.10) SEO fields given in this guide |
| LocalBusiness / AutoRepair schema with NAP | `snippets/mg-local-business-schema.liquid` (rendered in the layout, but it only outputs on the home page and the contact page) outputs AutoRepair JSON-LD from Theme settings: name, address, phone, hours. It deliberately has no star rating | **[ADMIN]** Add latitude/longitude (§11). After launch, test the home page with Google's Rich Results Test (it can't get past the password before then) |
| 301 redirects from old Wix URLs | `data/redirects.csv`: the brief's 5, plus 35 found by crawling the old site (§12) | **[ADMIN]** Import (Phase 2). **[HUMAN]** Test after the domain moves (Phase 3) |
| Image alt text; compressed WebP | Theme images use Shopify's CDN (`image_url`), which serves WebP/AVIF automatically; theme assets are WebP. Every product image row in the CSV has alt text | **[ADMIN]** Add alt text to anything uploaded later (Files, theme editor, collection images) |
| Lighthouse mobile ≥ 85, no more than 3–4 apps | No new JS libraries; section JS is small and deferred. `docs/APPS.md` keeps the app count to 3 (4 with the optional form) | **[HUMAN]** Run Lighthouse (Chrome DevTools, mobile) on the preview while logged in: PageSpeed Insights can't get past the password page. Re-test after each app |
| GA4 and Meta pixel | – | **[HUMAN]** MG, after the transfer: install the **Google & YouTube** and **Facebook & Instagram** channels and connect his own accounts |
| Google Business Profile | – | **[HUMAN]** MG sets the website to the new domain after launch, and adds the Google reviews link to Theme settings |
| Test orders through the test gateway | – | §13 |
| Legal pages in Settings → Policies | Footer links to `/policies/…` (§9) | §2.9, **[HUMAN]** MG reviews |
| Irish VAT 23%, prices shown including VAT | All CSV prices are VAT-inclusive and taxable | §2.3 |
| Sitemap and Search Console | Shopify generates `/sitemap.xml` automatically | **[HUMAN]** MG (his Google account) verifies the domain in Search Console and submits the sitemap after launch |

---

## 15. Phase 1 demo hand-off checklist

Tick everything before sending anything to MG:

- [ ] `shopify theme check` reports 0 errors; the theme is pushed and published (§3).
- [ ] Theme settings → MG Car Audio: business details: the Google rating and review count are MG's real figures, copied from his public Google profile (§11). Not 4.9 / 120 unless that's what Google shows.
- [ ] Home page looks finished on a phone and on desktop: hero, trust bar, car makes, services, best sellers, how it works, gallery, reviews (with the "Demo" banner showing), FAQ, contact map.
- [ ] Every home page car make tile opens a real page: `/pages/bmw-carplay`, `/pages/audi-carplay`, `/pages/mercedes-benz-carplay` and `/pages/volkswagen-carplay` (the other makes open the quote form).
- [ ] `/collections/carplay-android-auto` shows 11 products with images and prices, and the Car make / Car model / Screen size / Price filters work (Brand has one value until Phase 2, §10).
- [ ] A hardware product (for example the BMW interface) shows the "Need it fitted? Fitted from €350" card; an installation product doesn't.
- [ ] `/pages/carplay-installation` (service page) and `/pages/bmw-carplay` (with BMW entry: systems, models, services, 4 FAQs) look complete, and so do the Audi, Mercedes-Benz and VW pages with their entries.
- [ ] `/pages/book-a-fitting`, `/pages/services` and `/pages/gallery` use their own templates (hero, cards, FAQ or gallery), not the plain Default page.
- [ ] `/pages/get-a-quote`: a test submission arrives at **Taiwo's** email.
- [ ] The WhatsApp button opens a chat to +353 87 034 4355 with the pre-filled message. **Don't press send**: it's MG's real number.
- [ ] Test orders placed and archived (§13).
- [ ] Password page looks branded.
- [ ] Appendix A placeholder list printed or saved, to go through with MG.

**Send to Taiwo** (then Taiwo decides what to send MG; agents don't contact the client):

- Storefront: `https://mg-car-audio-demo.myshopify.com` + the storefront password (§2.10).
- Or, if the theme isn't published yet, the preview link from `shopify theme push` (`…?preview_theme_id=…`). It still asks for the storefront password first.
- The Appendix A placeholder list.

Suggested message for Taiwo to adapt: *"Here's the first look at your new MG Car Audio website: [link], password [password]. Prices for your services are the ones from your booking page. Three come from your individual service pages, so please check them: Mercedes Japan-to-Europe €450, VW Japan-to-Europe €350 and radio frequency conversion €150. Anything marked as a sample (the hardware products, some 'from' prices, the demo reviews and the warranty wording) is there to show the layout, and I'll swap in your real details. Customers send their dash photos on WhatsApp for now; if you'd like a photo upload on the quote form itself, that needs a free form app. Have a look on your phone and tell me what you think."*

---

## 16. Phase 2 and Phase 3 (pointers)

**Phase 2 (after MG pays 50%):** real catalogue (replace or delete everything tagged `demo-placeholder`; MG's existing Wix items are the JBL Stadium 52CF set €189, a coaxial speaker pair €90 and a compact single-DIN €199), remaining car make entries and pages, more service pages (duplicate `page.service` as `page.service-dashcam` and so on), booking app with deposits and reviews app (`docs/APPS.md`), gallery with real install photos, redirects import (§12), SEO checklist (§14).

**Phase 3 (launch):** **[HUMAN]** Taiwo transfers the store (Dev Dashboard → Stores → ⋯ → Transfer store → MG's email; the invitation expires after 7 days). Before transferring: deactivate any Shopify Payments test setup, set the store email to MG's, and check the billing currency. MG then picks a plan, sets up Shopify Payments, connects `mgcaraudio.ie` and removes the password. Taiwo keeps collaborator access for the care plan.

---

## Appendix A: placeholder register (confirm with MG)

**Real, from MG's site (no action beyond a quick confirm):** address, phone, opening hours; BMW Apple CarPlay €350; BMW Android Auto iDrive 7 €299 (1 hr); Android radio installation €150 (1 hr 30, customer supplies the radio); BMW iDrive 7 video in motion €149; BMW Japan-to-Europe €450 (2 hr); booking deposit €50 and its 48-hour terms; reverse camera supplied and fitted BMW €750, Audi €699, VW €650, Honda €399; MG's own images.

**From MG's individual service pages, but "price on request" in the build spec:** Mercedes Japan-to-Europe €450 (2 hr); VW Japan-to-Europe €350 (2 hr, MIB 2012–2018 only); radio frequency conversion €150 (1 hr). **Confirm.**

**Ask MG:** does the €350 BMW CarPlay price include the interface hardware on CIC and NBT cars, or is it the price for cars that can be activated in software? The CSV prices all four iDrive variants at €350, as the spec says.

**Invented for the demo (must be replaced or confirmed):**

| What | Where |
|---|---|
| All 10 hardware products: names, specs, prices (€79–€699), stock levels, compatibility lists | `products.csv`, tag `demo-placeholder` |
| Hardware "fitted from" prices: BMW interface €350 (assumes MG's €350 includes it), Audi €399, Mercedes €399, VW €329, BMW F30 screen €699, W205 screen €849, 9" radio €429 (€279 + MG's real €150 fitting), 7" radio €379, reverse camera kit €399 (MG's lowest real reverse camera price) | `products.csv` metafield `custom.fitted_price` |
| Approximate production years for iDrive, MMI, NTG and MIB systems and chassis codes | Product copy and car make entries (general knowledge, not from MG) |
| Warranty length (not stated yet; headline "Workmanship warranty"), warranty exclusions, parts-warranty handling | Theme setting, `warranty-returns.md`, `faq.md` (listed in each file's notes) |
| Google rating 4.9 from 120 reviews (replace from MG's public Google profile before the demo, §11); five demo reviews, marked "Demo" on the site | Theme settings, reviews section |
| Delivery rates (€7.95, free over €150), delivery times, dispatch cut-off, Ireland-only, damaged-item window | `shipping.md`, §2.6 |
| Reply time (left out until MG confirms one), workshop payment methods, parking, car-warranty FAQ wording | Notes in `book-a-fitting.md` and `faq.md` |
| Car make page fallback (used only when a page has no car make entry): no prices except Android radio fitting €150 | `sections/mg-car-make.liquid`, `templates/page.car-make.json` |
| Quote form: no on-site dash photo upload (Shopify's contact form can't take files); photos come in on WhatsApp. On-site upload needs a free form app (`docs/APPS.md` §5) | Quote page, contact page |
| "From €X" prices for radio upgrades, JBL radios, speakers, subwoofers, amplifiers, dashcams, repairs, radio codes | `services.md` |
| Audi, Mercedes-Benz and VW CarPlay / screen prices | `car-make-*.md` |
| Gift voucher denominations | §6 |
| MG's email address (found on his site, not yet confirmed for publishing) | §11, `contact.md` |

---

## Appendix B: product metafield values (for the bulk-edit fallback in §5)

In Shopify's bulk editor, separate list values with commas. Values containing a comma don't occur here.

| Handle | Car make | Car model | Screen size | Fitted price |
|---|---|---|---|---|
| `wireless-carplay-interface-bmw-nbt-evo` | BMW | 1 Series (F20/F21); 2 Series (F22/F23); 3 Series (F30/F31); 4 Series (F32/F33/F36); 5 Series (F10/F11); X1 (F48); X3 (F25); X5 (F15) | – | €350 |
| `wireless-carplay-interface-audi-mmi-3g` | Audi | A4 (B8); A5 (8T); A6 (C7); A7 (4G); Q5 (8R); Q7 (4L) | – | €399 |
| `wireless-carplay-interface-mercedes-ntg` | Mercedes-Benz | A-Class (W176); B-Class (W246); C-Class (W204); C-Class (W205); CLA (C117); GLA (X156); E-Class (W212); GLC (X253); ML / GLE (W166) | – | €399 |
| `wireless-carplay-interface-vw-mib2` | Volkswagen | Golf (Mk7); Passat (B8); Polo (AW); Tiguan (AD1); Touran (5T); T-Roc (A1) | – | €329 |
| `android-screen-upgrade-bmw-f30-10-25` | BMW | 3 Series (F30/F31); 4 Series (F32/F33/F36) | 10.25" | €699 |
| `android-screen-upgrade-mercedes-w205-12-3` | Mercedes-Benz | C-Class (W205) | 12.3" | €849 |
| `android-double-din-radio-9-inch` | Universal | – | 9" | €429 |
| `wireless-carplay-double-din-radio-7-inch` | Universal | – | 7" | €379 |
| `wireless-carplay-adapter` | Universal | – | – | – |
| `oem-style-reverse-camera-kit` | Universal | – | – | €399 |
| `carplay-installation-bmw` | BMW | 1 Series (F20/F21); 2 Series (F22/F23); 3 Series (F30/F31); 4 Series (F32/F33/F36); 5 Series (F10/F11); X1 (F48); X3 (F25); X5 (F15) | – | €350 |
| `android-auto-installation-bmw-id7` | BMW | 1 Series (F40); 3 Series (G20/G21); 5 Series (G30/G31); X3 (G01); X5 (G05); Z4 (G29) | – | €299 |
| `android-radio-installation` | Universal | – | – | €150 |
| `bmw-idrive7-video-in-motion` | BMW | 1 Series (F40); 3 Series (G20/G21); 5 Series (G30/G31); X3 (G01); X5 (G05); Z4 (G29) | – | €149 |
| `bmw-japan-to-europe-conversion` | BMW | – | – | €450 |
| `mercedes-japan-to-europe-conversion` | Mercedes-Benz | – | – | €450 |
| `vw-japan-to-europe-conversion` | Volkswagen | – | – | €350 |
| `radio-frequency-conversion-japan-to-europe` | Toyota; Lexus; Nissan; Honda; Mazda | – | – | €150 |
| `reverse-camera-installation` | BMW; Audi; Volkswagen; Honda | – | – | €399 |
| `booking-deposit` | – | – | – | – |

(`;` separates list items in this table only.)

---

## Appendix C: what couldn't be verified from the build environment

`help.shopify.com` was blocked by the build environment's network policy (and challenges automated requests), so the Help Center pages couldn't be read directly. What was used instead:

| Detail | Source used | Confidence |
|---|---|---|
| Product CSV columns and order (57 columns, from `Title`, `URL handle`, `Description` … to `Google Shopping / Custom label 4`) | Shopify's current `product_template.csv`, as mirrored unchanged in several public GitHub repositories (identical headers across copies) | High |
| Metafield column header `<name> (product.metafields.<namespace>.<key>)`, and "after a product metafield is defined, it's included in your product CSV exports" | Help Center text quoted in search results, plus real Shopify exports | High |
| Variant metafields can't be imported by CSV | Several 2025–2026 guides and community threads | High (not used here) |
| **List metafield values: one value per line inside the cell** | Shopify's own exports write `list.single_line_text_field` values this way (for example "Search product boosts"); list *reference* metafields use `; `. The Help Center text itself wasn't readable | **Medium**: fallback in §5 |
| URL redirect CSV headers `Redirect from`, `Redirect to`; 301 only; only fires on 404 paths | Several 2026 guides quoting Shopify's help | High |
| Product category strings | Shopify's product taxonomy on GitHub (`Shopify/product-taxonomy`, release 2025-09 and main) | High |
| Client transfer store limits, password path | shopify.dev, Dev Dashboard → Client transfer stores | High |
| Admin menu labels (General vs Store details, Custom data vs Metafields and metaobjects, Navigation vs Content → Menus, where the tax-inclusive toggle lives) | Recent guides; labels vary by admin version | Medium: use the names given here as a guide |
| Whether paid-app "development store" plans apply to client transfer stores | One Shopify Community post (20 August 2026) says they don't | Medium: see `docs/APPS.md` |

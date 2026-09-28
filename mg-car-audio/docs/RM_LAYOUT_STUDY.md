# Radio Masters (radiomasters.ie): layout and IA study for MG Car Audio

> **Purpose.** This file records the *structure* of a competitor site (page types, section order, grid logic, component anatomy, behaviour) so the MG Car Audio designer can reuse the **patterns**.
> **What we don't take:** no text, photos, logos, brand colours, partner logos or wording from Radio Masters (RM). Nav labels appear below only so the structure can be described. BRIEF.md §1 and BUILD_SPEC.md §5 still apply: don't mention competitor names on the MG site.
> **How it was captured:** 28 Sep 2026, Playwright/Chromium, desktop 1440x900 and mobile 390x844 (iPhone UA, `isMobile`). Cookie banner accepted, page scrolled slowly, then full-page captures sliced into tiles (paths in §6).
> **Capture artefacts (not RM bugs):** the home hero is an MP4 product video. Headless Chromium has no H.264, so it shows as a black box. Some lazy widgets (Google-reviews block, store maps behind cookie consent, lower gallery images on very long product pages) appear as empty bands in some tiles.

Platform notes, for context only: WordPress + WooCommerce + Elementor, with a commercial theme (off-canvas mobile nav, search popup, side cart drawer, compare and wishlist plugins), a swatches plugin for variations, and a Google-reviews widget. Typeface: one geometric/techno sans throughout (Bai Jamjuree), with uppercase headings.

---

## 1. Sitemap / information architecture

### 1.1 Primary nav (desktop, left to right)

| # | Label | Type | Destination / children |
|---|---|---|---|
| 1 | SHOP + | Mega-menu (hover) | 2 text columns of ~19 product categories + 1 promo image card with a CTA button (see 3.3) |
| 2 | SALE | Plain link, shown in an accent colour | Shop archive filtered to on-sale items |
| 3 | OUR SERVICES + | Mega-menu (hover) | 2 text columns of 8 services + 1 promo image card with a "book online" CTA |
| 4 | ABOUT US | Link | About page |
| 5 | LATEST JOBS | Link | Blog archive (install case studies) |
| 6 | CONTACT | Link | Contact page |
| right | Search icon · Sign In (icon + text) · Basket icon with "(count)" | Utilities | Search drops down from the top; the basket opens a right-hand drawer |

Active page: underline bar under the nav label (visible on About, Latest Jobs, Contact, Our Services, Sale).

### 1.2 Shop taxonomy (product categories)

Amplifiers · Android Radio · Car Accessories · Car Alarms · Car Speakers · CarPlay & Android Auto · Customer Product Installation · Dash Cameras · Gift Vouchers · Japanese Language Conversion · Marine Audio · Parking Sensors · Power Sports Audio · Reverse Cameras · Sound Upgrade Sets · Soundproofing · Subwoofers · Vehicle Lighting. The catalogue has about 230 products, and Android Radio is the largest category at about 105.

Secondary facets: **Brands** (tag chips), **Search by vehicle** (car-make tag chips such as Audi, BMW, Lexus and Mercedes-Benz), and a price slider.

### 1.3 Services taxonomy

Android Radio · Car Alarms · CarPlay & Android Auto · Car Speakers · Parking Sensors · Reverse Cameras each have their own service page. **Dash Cameras** and **Subwoofers** link to *shop categories* instead of service pages, so the IA is inconsistent.

### 1.4 Page types observed

| Page type | URL pattern | Notes |
|---|---|---|
| Home | `/` | Promo + category-tile landing page |
| Shop archive / category | `/shop/product-category/all-products/<cat>/` | Sidebar filters + 4-column grid |
| Sale | the shop archive with a sale filter | Same template, plus an active-filter chip |
| Product (variable) | `/shop/product/<slug>/` | Installation is sold as a **variation** |
| Services hub | `/our-services/` | Hero + a 4x2 grid of photo tiles + callback form |
| Service detail | `/our-services/<service>/` | Long SEO article + a "latest jobs" strip. No price, no booking |
| Latest jobs (blog) | `/latest-jobs/` | Archive with a large image per post and a right sidebar |
| Job post | (single post) | Not studied in depth |
| About | `/about-us/` | Split image/text bands, stat counters, 10-icon "why choose us" grid |
| Contact | `/contact/` | Intro split, callback form, stores list with maps |
| FAQ | `/faq/` | Accordion groups by topic + a CTA button |
| Account / Wishlist / Cart / Checkout | standard WooCommerce | Wishlist and Compare are plugins |
| External | a Google Calendar booking link, a separate garage subdomain | "Book online" opens a third-party calendar |

Footer and utility links: FAQs, Privacy Policy, Terms & Conditions, Returns, social links (4), partner logos, several branch addresses.

---

## 2. Page-by-page breakdown

Heights are approximate CSS px at 1440 wide (desktop) and 390 wide (mobile).

### 2.1 Global chrome (every page)

| Order | Desktop | Mobile |
|---|---|---|
| a. Promo strip | Full-bleed gradient bar, ~46px, one centred line of bold USP text | Wraps to two lines, ~50px |
| b. Contact/info strip | Dark bar, ~50px, 4 evenly spaced items with small line icons: phone · email · Google-stars badge (links to reviews) · opening hours (weekday + Sunday) | Stacks into 3 rows (phone + email / stars / hours), ~120px. That's expensive space above the fold |
| c. Main header | Dark, ~100px: logo far left, nav starting ~240px in, utilities far right | ~95px: logo left; basket with count and a hamburger right |
| Sticky | After scrolling, a and b disappear and a ~100px dark header stays pinned | A ~80px bar (logo, basket, hamburger) stays pinned |
| Floating | A green "WhatsApp us" pill at bottom right; a dark square **back-to-top** button with a chevron appears above it after scrolling | Same pill, plus the bottom tab bar (3.4) and back-to-top |
| Cookie consent | A bottom card across the full width: logo, a paragraph, then **Accept / Deny / View preferences** as three equal buttons. After you choose, a small "Manage consent" tab stays docked at bottom right | A bottom sheet covering about 45% of the screen with three stacked full-width buttons |

Before content on every inner page: **breadcrumbs** in a light bar (~40px).

### 2.2 Home (desktop ~4,900px, mobile ~8,000px)

| # | Section | Desktop layout | Mobile layout | Content / CTA | Behaviour |
|---|---|---|---|---|---|
| 1 | **Hero** (~510px) | Contained two-part hero on the dark background. Left ~27%: a stack of three solid-colour blocks, each one a full-width CTA (a discount offer, "Shop now", "Dealer enquiry"). Each block is ~90–110px tall with letter-spaced uppercase text and an arrow. Right ~63%: an autoplay product **video** in a panel with large rounded top corners, plus a circular rotated "SALE" sticker at the top right | The video is full width (~220px) with the sticker. The three coloured blocks stack full width below it (~50–75px each) | 3 CTAs, one video | The video autoplays, muted |
| 2 | **Category tiles** (3 rows x 380px) | Full-bleed **3x3 grid** of photo tiles, each 480x380, with no gutters. Every tile has a dark overlay, a **big uppercase white label** bottom-left (2 lines if needed) and an outlined ghost "SHOP NOW →" button under it | **1 column**: 9 tiles, each ~200px tall and full bleed, with the same label + ghost button | 9 categories | No hover change was detected on desktop (a pixel diff was identical) |
| 3 | **Featured products** (~530px) | Contained (~1290px). A section heading with a huge **outlined "watermark" word** behind it (a pale stroke-only uppercase word). Below it, **5 product cards** in one row, which is a carousel | 1 card per view (full width), in a swipe carousel | 5+ products (all from one niche category on the day of capture) | Card hover: see 3.6 |
| 4 | **Google reviews** (~580px) | Full-bleed band with a darkened photo background. Left: a summary block with "EXCELLENT", 5 big stars, a review count and the Google logo. Right: a **carousel of 3 dark review cards** (avatar, name, time ago, stars + verified tick, 2–4 lines of text, "Read more"), with a round arrow on the right | The summary is centred on top and **1 card** sits below with a progress-bar pager | Third-party widget | Arrows/swipe |
| 5 | **Visit + callback** (~870px) | Contained, 2 columns 50/50. Left: a large storefront **photo** with an address/hours text block below it (hotlines, wholesale, working hours; underlined sub-labels). Right: an h2, one line of intro, **4 branch "tab" chips** (a city name in a light box with a left accent border), then the form (message textarea, name, email + phone on one row, reCAPTCHA, a solid "Send message" button) | Stacks: photo, contact text (centred), then the form with full-width fields and a full-width button | Lead capture | The chips switch which branch receives the message |
| 6 | **Footer** (~850px) | See 3.9 | See 3.9 | | |

### 2.3 Shop archive / category (CarPlay & Android Auto, Android Radio, Sale)

Desktop, ~2,950px with 13–16 products:

1. Breadcrumbs.
2. **Two-column body**, contained with a small gutter. The **left sidebar is ~300px (21%)** and the **grid ~1,110px**.
   - Sidebar, top to bottom: a product search input with an icon; **Product categories**, a checkbox list with counts, collapsible with a chevron; **Filter by price**, a dual-handle slider with a "Filter" text link; **Product brands**, small outlined tag chips; **Search by vehicle**, car-make tag chips. This is the only "vehicle finder" on the site: a flat list of makes, with no model or year.
   - Grid header row: list/grid view toggle · "Showing X of Y results" · sort dropdown ("Sort by latest") · "Show 16" per-page dropdown. A hairline sits under the row.
   - On Sale, an **active-filter chip** ("sale ×") + "Clear all" sits under the header row.
   - **Product grid: 4 columns**, ~180px image area. Cards are separated by thin vertical hairlines rather than boxes.
3. Pagination (numbered) when there are more than 16 products.
4. Footer. There's **no category hero, no intro copy, no install-price explainer and no FAQ** on category pages.

Mobile, ~5,400px:

- Breadcrumbs, then a toolbar row: "Filter" (icon + underlined text) · result count · sort · per-page. It's crowded, and the count text collides with the sort label.
- **2-column grid**, card image ~140px, titles truncated to 2 lines.
- "Filter" opens a **left off-canvas drawer** (~330px) holding the whole sidebar (search, categories, price, brands, vehicle), with a "Close ×" at the top right.

### 2.4 Product page (Android radio and CarPlay interface, both variable products)

Desktop fold (~900px):

| Zone | Layout |
|---|---|
| Breadcrumbs | Full path including the long product title |
| **Gallery (left ~45%)** | CarPlay product: a **vertical thumbnail rail** (5 visible, up/down arrows) to the left of a square main image. An **eye icon** at the top right opens the lightbox. Android radio product: one tall main image (a before/after dashboard composite) |
| **Summary (right ~45%)** | Stock status in small green caps · **Prev / Next** product links at the top right · **H1 title** (large, 2–3 lines; titles are keyword-stuffed) · meta row: Brand · star rating + review count · SKU, separated by vertical dividers · hairline · **price range** in the accent colour · **variation swatches as rectangular text chips** (selected = solid dark fill, others outlined) · "Clear" link · the variation's delivery/collection note · the **selected variation price** · "N in stock" with a smiley icon · QUANTITY with a − / + stepper · a solid dark **"+ ADD TO BASKET"** button · wishlist heart and compare icons · **express pay** buttons (Apple Pay / Google Pay / Link) · categories + brand · round social share icons (5) |
| **Installation add-on** | Not a separate add-on. It's a **variation attribute** ("Options of installation"): "Without installation" or "Installation of …" (the CarPlay unit has **two installation variants split by car model**). Choosing an installation variant shows a line naming the uplift (+€150) and updates the price. The Android radio has a second attribute for hardware spec (CPU/RAM/screen tier) |
| **Sticky add-to-cart bar** | Once the buy box scrolls away, a white bar slides in at the bottom of the viewport: thumbnail · "You're viewing: [title]" · price range + stars · "SELECT OPTIONS" button on the right |

Below the fold:

1. **Tabs**: Description · Additional information · Reviews (n). On mobile these become **accordions** with chevrons.
2. Description content is freeform. The CarPlay unit shows **"Compatible models"**, an image grid of head-unit software-version screens so buyers can identify their system, then a list of compatible models and years, a note saying "if not listed, contact us", then a **"Quick details" 2-column spec table** (~15 rows), then long feature images and numbered lists. The desktop page is very long (~14,500px).
3. **Related products**: "You may also like" with the outlined-watermark heading, **4 cards** on desktop and a **2x2 grid** on mobile.
4. Footer.

Mobile specifics: the thumbnail rail stays **vertical, to the left of** the main image, which eats about 20% of the width. Long variation chips **overflow the viewport** and get cut off on the right. The spec table's label column is so narrow that words break mid-word. The WhatsApp pill covers the title in the first screen.

Cart feedback: after "Add to basket" the page reloads with a full-width **green success notice** ("…has been added" + a "VIEW BASKET" link). The header count updates. The basket icon opens the **side cart drawer** (3.7).

### 2.5 Services hub (`/our-services/`)

| # | Section | Desktop | Mobile |
|---|---|---|---|
| 1 | **Hero** (~430px) | Full-bleed dark band. Left ~55%: a composite **product-collage** image (car with products in front). Right: a small letter-spaced eyebrow, a big 2-line uppercase h1, and **one solid button** ("Book online (discount)") that opens the external calendar | The image becomes a faded background, with centred text + a button on top (~450px) |
| 2 | **Service tiles** (2 rows x 380px) | Full-bleed **4x2 grid** of photo tiles (360x380), the same anatomy as the home category tiles, with the button labelled "DETAILS →" | 1 column, ~200px each |
| 3 | Visit + callback | Same block as home 2.2 #5 | same |
| 4 | Reviews band | Same widget (sometimes empty on load) | same |
| 5 | Footer | | |

### 2.6 Service detail (CarPlay & Android Auto; Android Radio)

Desktop (~4,100px), contained (~1,120px text column):

1. Breadcrumbs.
2. A **watermark word** (a huge outlined uppercase phrase that states a warranty claim) behind a small accent-colour eyebrow (the service name) and a large **sentence-case H1**.
3. A long article: an intro paragraph, H2 "what is…", paragraphs, a centred **inline image** (~60% width), then H2 "benefits" with a bullet list, H2 "key features" with bullets, H2 "how X differs from Y" with bullets and paragraphs.
4. An embedded **promo video** (black box in the capture), centred at ~65% width, with the SALE sticker.
5. **"LATEST JOBS" strip**: 3 columns, each a 4:3 photo (~200px) with a centred caption in the form **"Make Model Year, short job description"** (the make/model is bold).
6. Footer.

Mobile: the same single column. The H1 is very large (4 lines), and the article is ~7,500px long.

**What's missing:** no price or "from €" line, no book or quote button, no "which cars" selector, no linked products, no FAQ and no trust strip. The page is SEO text with a gallery at the end.

### 2.7 Latest jobs (blog archive)

Desktop (~8,500px), 2 columns (content ~590px / sidebar ~255px, ratio about 70/30):

- Each post: a **wide 2.1:1 featured photo** (full column width) · a small accent slash icon + category tags (uppercase, accent colour) + date · a **bold H2** (car make/model + job) · a 3–4 line excerpt · "READ MORE +". Posts are ~500px each, 10 per page, then numbered pagination.
- Some older posts use a **car-maker logo** as the featured image instead of a job photo (it looks placeholder-ish).
- Sidebar: search · "Recent post" list (small thumbnail + date + 3-line title) · an "About Us" image + paragraph widget · a **tall promo banner** (photo, logo, "contact us" + phone number + button).

Mobile: 1 column. The sidebar moves below the posts. Titles are huge (4 lines at ~30px).

### 2.8 About

Desktop (~4,800px):

1. **Split band** (~550px): a photo that bleeds to the left edge (~47%) and text on the right (an eyebrow with an accent slash, a big uppercase H2, a paragraph). A decorative **product cut-out** (a speaker) bleeds off the right edge.
2. **Split band, reversed** (~740px): a light-grey panel on the left with text; on the right, a photo clipped by a **diagonal edge**.
3. **Split band** (~620px): photo left (50%); text right with an eyebrow, H2, paragraph, **2 stat counters** (large accent numbers with a "+" superscript, small uppercase labels, a vertical divider between them) and a full-width solid "SHOP NOW →" bar. A grungy **tyre-track graphic** decorates the corner.
4. Reviews band (empty in the desktop capture; a photo band on mobile).
5. **"Why choose us"** (~860px): a watermark word, eyebrow, H2 and one-line sub, then a **5x2 icon grid**: filled dark circles (~100px) with white line icons, a short uppercase title and 2–5 lines of centred text. Mobile: 2 columns, with odd items centred alone.
6. Footer.

Mobile: every split band stacks with the text centred. On mobile the photos in bands 1–3 are **hidden**, which leaves long walls of text.

### 2.9 Contact

Desktop (~3,600px):

1. **Intro split** (~670px): left text column (a watermark word, eyebrow, 2-line uppercase H2, a paragraph, a "CALL US" label + a **very large phone number**, 4 round social icons, then 2 small columns: warehouse address / email); right, a photo (~50%).
2. **Visit + callback** block (the same as home #5, which duplicates the phone, email and hours shown in #1).
3. **"Our stores"**: a watermark heading + H2, then **3 columns** (Dublin / Galway / Limerick), each meant to show an embedded map (blank until you accept map cookies) with a city label and address below.
4. Footer.

Mobile: everything centred and stacked. The store maps leave ~350px blank gaps.

### 2.10 FAQ

Desktop (~4,100px), a centred **~610px column**:

- A watermark word + eyebrow + a big 2-line uppercase H2.
- **5 topic groups** (General · Android Radio & CarPlay · Cameras & Parking · Audio Upgrades · Installation & Warranty). Each has an uppercase H2 and 3–5 **accordion rows** (question in bold, a "+" / "−" at the far right, hairline dividers). The first item in each group is open by default.
- A closing CTA button ("Request a callback").

Mobile: the same, full width. It's clean and easy to scan. There was one content bug: in one group an *answer* is shown as a question.

---

## 3. Global components (anatomy)

### 3.1 Promo strip + contact/info strip

- A two-tier top: a one-line USP strip (gradient) above a **4-item info strip** (phone, email, a Google-stars badge linking to reviews, hours). Items are spaced across the full width, with thin vertical dividers between the first two.
- It works because it answers "can I call them now / are they rated / are they open?" before any scrolling.
- It fails on mobile, where it takes 3 rows (~170px including the USP strip) before the logo.

### 3.2 Header

- Dark bar: logo · centred-left nav (uppercase, bold, ~15px, ~36px gaps; "+" marks items with submenus; one item in an accent colour) · utilities (search icon, person icon + "Sign In", bag icon + count in brackets).
- It's sticky, and on scroll the top strips collapse away.

### 3.3 Mega-menus (desktop, hover)

- A white panel dropped under the nav item, ~600px wide for text plus a ~300px **promo card** attached on the right.
- Text area: **2 columns** of uppercase links (~15px, ~36px row pitch), with no icons and no grouping headings.
- Promo card: a full-height photo, a big bold 3–4 line headline, a short sub-line and a solid button.
- Services menu: the same pattern (2 columns of 4 + a promo card with a "book" button). The white panel is much taller than its content, which leaves ~300px of empty white.
- **Mobile menu:** a left off-canvas drawer (~330px) with a "Menu" tab header + ×. It's a **flat list of 6 top-level links with no submenus**, so you can't reach a category or service from the mobile menu directly.

### 3.4 Mobile bottom tab bar

- Fixed to the bottom (~52px). Four equal cells with hairline dividers, each an outline icon over a small bold label: **Shop · Account · Search · Wishlist**. It's white with dark icons.
- Search opens the same top-down search panel (a big grey input + a search icon, a close ⊗ at the top right, a dimmed page behind).
- Weak point: the four slots go to e-commerce actions (Account and Wishlist) and there's **no Call or Book**, even though installation is the core business.

### 3.5 WhatsApp float

- A green pill at bottom right ("WhatsApp us" + a chat-bubble icon), ~165x46 on desktop, sitting above the tab bar on mobile.
- Clicking it expands a **branch picker**: 4 stacked green pills (one per city) + an "Elsewhere" input with a small round "WA" send button. It routes chats to the right branch.
- It overlaps content on mobile (it covers product titles and review text).

### 3.6 Category / service photo tile

- A full-bleed photo with a dark gradient overlay, **no gutters** between tiles (a mosaic).
- Bottom-left: a **big uppercase label** (~40px desktop / ~30px mobile, bold, tight tracking, white, 1–2 lines) with an **outlined ghost button** below it (1px white border, small letter-spaced uppercase text + arrow, ~190x40).
- Desktop 3-up (home) or 4-up (services) at 380px tall; mobile 1-up at 200px.
- The pattern is strong and scannable. No hover state was found. There's no price or count on the tile.

### 3.7 Product card

Top to bottom:

- An image on white (square, ~180px desktop / ~140px mobile). A **badge** sits at the top left: a green "SALE" rectangle, or a grey "OUT OF STOCK" (the whole card is then faded to ~50% opacity).
- Category breadcrumb (tiny grey uppercase, e.g. "ALL PRODUCTS, CAR SPEAKERS"). It's redundant, because "All products" appears on every card.
- The title (~15px, 2-line clamp).
- A 5-star row, empty outlines when there are no reviews, which looks negative.
- The price (bold, accent colour; a range for variable products).
- **On hover (desktop):** the card lifts with a soft shadow; the title turns the accent colour; **wishlist + compare icon buttons** slide in on the image's right edge; the price row is replaced by **"+ SELECT OPTIONS / + QUICK VIEW"** text actions.
- Cards are separated by vertical hairlines rather than boxed.

### 3.8 Side cart drawer

- A right-hand panel (340px) sliding over a dimmed page: a "Shopping cart" title + "CLOSE ×" · line items (thumbnail, full variation title in the accent colour, "1 × €price", a remove ×) · a large empty space · a pinned footer with the subtotal (the price in the accent colour), a light "VIEW BASKET" button and a solid "CHECKOUT" button.
- The variation name (e.g. the installation option) is appended to the product title, so "fitted" versus "product only" stays visible in the cart.

### 3.9 Footer

- A full-bleed dark band with a moody car photo background.
- Desktop 4 columns:
  1. Logo, a short brand paragraph, 4 round social icons, then an "Information" link list.
  2. "Shop" links (~10) + "Our services" links (8).
  3. "Partners": a 3x3 grid of partner and brand logos.
  4. "Contact info": 5 branch addresses, a phone number with a large phone icon, email, a Google-stars badge and FAQs.
- Bottom bar: copyright · policy links (3) · "We accept" payment marks.
- Mobile: **no accordions**. Everything stacks, so the footer is ~2,300px long.

### 3.10 Other recurring devices

- **Outlined watermark heading.** A huge pale stroke-only word sits behind the real H2 (used on featured products, related products, FAQ, contact, about). It's decorative and nearly invisible on white.
- **Eyebrow labels** in letter-spaced accent caps, often with a small slanted-bar icon.
- **SALE sticker**: a circular, slightly rotated sticker on the hero and video media.
- **Review widget**: the rating summary + a card carousel (3.1 badge + 2.2 #4).
- **Stat counters**: numbers with a superscript "+".
- **Back-to-top** square button.
- **Prev / Next** product links on the product page.

---

## 4. What works and what to improve

### 4.1 Patterns worth emulating

1. **Info strip before anything else.** Phone, rating, hours and email are visible in the first 100px on desktop. For an installer this builds trust quickly.
2. **Full-photo category tiles with a big uppercase label + one button.** A 3x3 or 4x2 mosaic makes a fast visual index of "what we do". Mobile turns it into one tile per row.
3. **Installation as a choice inside the buy box**, with the uplift shown ("+€150") and the choice carried into the cart line. This is the single most relevant pattern for MG's fitted-price model.
4. **Model-specific install variants** (different fitting price for a big car versus a small one) and a **"compatible models" block with head-unit identification images**, which reduces "will it fit my car?" calls.
5. **Sticky "you're viewing" add-to-cart bar** on long product pages.
6. **Latest jobs captions in the form "Make Model Year, what we fitted"**, repeated at the bottom of each service page. It's good social proof, tied to the service.
7. **WhatsApp float** (with a branch picker for a multi-site business; MG has one site, so it becomes a single tap).
8. **Mega-menu with a promo card** that gives one campaign a spot in the navigation.
9. **FAQ grouped by topic**, in a narrow readable column with + / − rows.
10. **Reviews block**: the aggregate score and count on the left, a carousel of real review cards on the right.
11. **Side cart drawer**, which keeps users on the page.
12. **Two-column visit + callback block** (photo of the premises + a short form) at the end of key pages.

### 4.2 Weak or cluttered (MG should do better)

1. **Hero:** three stacked **solid colour blocks** (a different saturated colour each) compete with a video. There's no headline, no value proposition and no single primary action. MG should use one clear H1, one primary CTA (quote or book) and one secondary (WhatsApp).
2. **Three header tiers on mobile** (~300px before content). MG: one slim header plus an optional one-line USP. Move hours and rating lower (trust strip).
3. **Cookie wall**: a large bottom sheet with three equal buttons; maps and the reviews widget stay blank until you accept. MG should keep consent compact and use **map facades** (a static image + an "Open in Google Maps" link) so nothing sits empty.
4. **Services pages are SEO essays** with no price, booking, product link or FAQ. MG service pages should lead with "from €X fitted", duration, a Book / Get a quote CTA, supported cars, then proof and FAQ.
5. **Inconsistent IA**: some "services" link to shop categories; the mobile menu has no submenus. MG should use a single consistent system list (the same 8–10 items in nav, tiles, footer and mobile menu) with expandable mobile groups.
6. **Repetitive products**: featured products showed five near-identical headlight bulbs. The "All products" category label repeats on every card. Empty star rows appear on unreviewed items. MG should curate a mixed best-sellers row, hide stars when there are 0 reviews and drop the redundant category line.
7. **Keyword-stuffed product titles** (60–100 characters) get truncated on cards. MG: short titles such as "Wireless CarPlay, BMW NBT EVO", with the fitment in a sub-line.
8. **Vehicle finder is only make tags** in a sidebar. MG's plan (plate or make → model → year, "Shop by car" chips) is already better. Keep it prominent on home and category pages.
9. **Mobile product page issues**: the vertical thumbnail rail steals width; variation chips overflow the screen; the spec table's label column breaks words; the WhatsApp pill covers the title. MG: swipeable gallery with dots or thumbnails below, chips that wrap (or a radio-card list for install options), a stacked spec list and a float that stays clear of content.
10. **Bottom tab bar holds Account and Wishlist** instead of Call, WhatsApp and Book. MG's planned action bar (Call · WhatsApp · Book) is right for an installer.
11. **The duplicate contact block** appears twice on the contact page and on most other pages. Once per page is enough.
12. **Footer**: ~2,300px on mobile, with no accordions and a 9-logo partner wall. MG: collapsible columns on mobile, NAP + hours + map link, policies.
13. **Watermark headings** are near-invisible decoration, and the grunge graphics and diagonal photo cut-outs look dated. Skip them.
14. **Blog archive**: brand-logo placeholder images and 4-line mobile titles. MG: a gallery grid of real job photos with make/model captions and filters by system or make.
15. The **mega-menu panel** is taller than its content (a big white void), and has no grouping.
16. **Out-of-stock cards** at 50% opacity mixed into the grid. MG should sort in-stock items first or hide them.

---

## 5. Mapping RM patterns to MG Car Audio

MG facts used: CarPlay & Android Auto retrofits (wired/wireless, OEM), Android radios, screen upgrades (BMW / Mercedes / Audi / VW), speakers, subwoofers, amplifiers, dash cams, reverse cameras, Japanese-to-European conversions, repairs (no sound, black screen, radio code). Fitted prices: BMW CarPlay €350, BMW Android Auto iD7 €299, Android radio install €150, iDrive 7 video in motion €149, BMW JP→EU conversion €450, others on request. One workshop in Dublin 12 (Ballymount). Google rating 4.9 from 57 reviews. MG's own design system (DESIGN.md v3/v3.1) sets colours, type and motion. The mapping below covers **structure only**.

| RM pattern | MG page / section | How to adapt (improve on RM) |
|---|---|---|
| Info strip (phone · rating · hours · email) | Header utilities + `mg-trust-bar` | Desktop: phone and "4.9 ★ (57 Google reviews)" in the header. Hours move to the trust strip or the visit block. Mobile: none above the fold except a tap-to-call icon |
| Mega-menu (2 columns + promo card) | Desktop "Systems" dropdown | Group into **Fit** (CarPlay & Android Auto, Screen upgrades, Android radios), **Sound** (Speakers, Subwoofers, Amplifiers), **Safety** (Dash cams, Reverse cameras) and **Workshop** (JP→EU conversions, Repairs, Radio code). Promo card: "BMW CarPlay €350 fitted" with a real MG photo. Sized to content |
| Flat mobile off-canvas menu | Mobile drawer | Expandable groups (same 4 as above) + Call / WhatsApp / Book buttons pinned at the drawer bottom |
| Three-block promo hero | `mg-hero` | Replace with **one** H1 + plate/make input + "Get a quote" + WhatsApp link (as in DESIGN.md). Keep RM's idea of **one sticker** only for a real, time-limited offer |
| 3x3 full-bleed category tiles, big label + "Shop now" | `mg-system-grid` "Shop by system" | 8 tiles (4x2 desktop, 2-column mobile rather than RM's tall 1-column) with the label + **"From €X fitted"** (the piece RM lacks) + an arrow chip. The whole tile is the link, with a visible hover/focus state |
| Services hub 4x2 tiles with "Details" | `/pages/services` | The same tile component as the home page (one system, not two), each linking to a service page |
| Service page (SEO essay) | `page.service` template | Order: cinematic header (system name, "from €X fitted", duration, Book / Quote / WhatsApp) → "Which cars" make chips (BMW / Mercedes / Audi / VW, and JP imports where relevant) → what you get (checklist) → **latest jobs strip (3 up, "Make Model Year, what we fitted")** → related products → FAQ (4–6) → visit block. Keep some SEO copy, but put it below the conversion content |
| Product buy box with install variation | `product` template (CarPlay modules, Android radios, screens) | Show **radio cards**: "Product only €X" / "Fitted in Dublin 12 €Y (about 1 hr)" / "Fitted, large-screen models €Z". Show the uplift, then carry the choice into the cart line (as RM does). Add a "Check fit" link to the fitment block |
| "Compatible models" + head-unit ID images | Product "Will it fit?" tab/accordion | A structured list of makes, models and years + "how to identify your system" with MG's own screenshots or diagrams. Fallback CTA: "Not sure? Send your reg on WhatsApp" |
| Tabs (Description / Additional info / Reviews) | Product accordions | Accordions on all breakpoints: Overview · Will it fit? · What's in the box · Fitting & warranty · Reviews. The spec table becomes a stacked label/value list on mobile |
| Sticky "You're viewing" ATC bar | Product page | Keep it: thumbnail, short title, the price for the selected install option, a "Book fitting" / "Add to basket" button. On mobile it replaces the action bar while it shows |
| Express pay buttons | Product page | Shopify dynamic checkout (Shop Pay / Apple Pay / Google Pay) under the main button |
| Product card with hover actions | Horizon product card (restyled) | Image, short title, fitment sub-line (e.g. "BMW NBT EVO"), **"€X fitted"** price, a stars row only if reviews > 0, an optional badge ("Fitted in 1 hr", "Sale"). No wishlist or compare clutter. Drop the category label |
| Sidebar filters + "Search by vehicle" chips | Collection template | A top filter bar (Horizon facets: Make, System, Price, Fitted/DIY). Mobile: a filter drawer (RM's pattern is fine) + a sticky "Filter & sort" pill. **A "Shop by car" chip row at the top** of the collection |
| Featured products carousel | "Best sellers" (`product-list`) | 4-up desktop and a peek carousel on mobile, curated across systems (CarPlay module, Android radio, speaker set, dash cam) |
| Google reviews summary + card carousel | `mg-reviews` | "4.9 ★ from 57 Google reviews" summary + a carousel of review cards (demo placeholders until real ones are wired in, per BUILD_SPEC.md) with a "Car: …" line. Link to the Google profile |
| Latest jobs blog archive | `/blogs/latest-jobs` + `mg-gallery` | A photo grid (3-up desktop, 2-up mobile) with "Make Model Year, what we fitted" captions and filter chips by system or make. Each job post links to the matching service and product |
| Visit + callback 2-column block | `mg-contact-map` (home, services, contact) | One per page: a workshop card (Dublin 12 address, hours Mon–Fri 9:30–7, Sat 11–7, Sun by appointment, Call / WhatsApp / Directions) + a **map facade**. A short "Get a quote" form (reg, car, system, phone) replaces RM's generic message form |
| Branch-picker WhatsApp float | WhatsApp float (desktop) + action bar (mobile) | One-tap WhatsApp with a prefilled message ("Hi MG, I'd like a quote for [system] on my [car]"). Keep it clear of content |
| Bottom tab bar (Shop / Account / Search / Wishlist) | `mg` mobile action bar | **Call · WhatsApp · Book** (Book as primary), as in DESIGN.md §3, item 15. Search lives in the header pill |
| Top-down search panel | Header search pill ("What are you upgrading?") | Predictive search showing products, systems and car makes |
| Side cart drawer | Horizon cart drawer | The line item shows the install choice. Add a "Booking deposit €50" note where relevant and a "Book your fitting slot" CTA |
| FAQ grouped by topic, + / − rows | `mg-faq` / `/pages/faq` | The same structure (groups: CarPlay & screens · Android radios · Sound · Cameras · JP imports & repairs · Fitting, warranty & booking). Home shows 5–6 top questions |
| About: split bands + stat counters + 10-icon grid | `/pages/about` | Keep **split bands (2 max)** and **3–4 real stats** (e.g. 4.9 ★ / 57 reviews / years fitting / makes covered). Replace the 10-icon grid with the 6-item "What's in every MG fit" checklist (`mg-promise`) |
| Contact: big phone + stores | `/pages/contact` | A big tap-to-call number, WhatsApp, email, hours, one workshop map facade, a quote form. No duplicated blocks |
| Footer 4 columns + partner wall | Footer | Light, 4 columns (Systems · Shop by car · Help (FAQ, returns, warranty, booking) · Workshop (NAP, hours, map link)), mobile accordions, payment marks, socials. Genuine stocked brands (JBL, Harman Kardon) as text or small marks only if MG approves |
| Prev / Next product links | not needed | Skip them. Use "Also fits your car" related products instead |
| Outlined watermark headings, grunge graphics, diagonal cut photos | none | Don't emulate them |

### 5.1 Suggested MG page inventory (derived)

- Home · Services hub · 9–10 service pages (CarPlay & Android Auto, Screen upgrades, Android radios, Speakers, Subwoofers & amps, Dash cams, Reverse cameras, JP→EU conversions, Repairs & radio code).
- Collections per system, plus car-make landing pages (BMW, Mercedes, Audi, VW, then others). Product pages.
- Latest jobs (archive + post), About, Contact / Visit, FAQ, Book a fitting / Get a quote, policies.

---

## 6. Screenshot index

Base folder: `/tmp/claude-0/-home-user-Torch/b3ea4f2c-e353-58ca-b5fe-bd6b5578fffa/scratchpad/rm/`

The paths are in a session scratchpad, so copy the folder somewhere permanent if you need it later. Desktop tiles are 1500px slices of the 1440-wide page, scaled to 960 wide. Mobile tiles are 390 wide. The full-page PNGs are alongside (`<page>_<d|m>_full.png`), as are the first-screen shots (`<page>_<d|m>_fold.png`) and a DOM outline per page (`<page>_<d|m>_outline.json`: section top, height, width, headings).

| Page | Desktop tiles | Mobile tiles |
|---|---|---|
| Home | `home_d_t00.jpg` … `home_d_t03.jpg` | `home_m_t00.jpg` … `home_m_t05.jpg` |
| Category: CarPlay & Android Auto | `cat-carplay_d_t00.jpg`, `cat-carplay_d_t01.jpg` | `cat-carplay_m_t00.jpg` … `cat-carplay_m_t03.jpg` |
| Category: Android Radio | `cat-android_d_t00.jpg`, `cat-android_d_t01.jpg` | `cat-android_m_t00.jpg` … `cat-android_m_t03.jpg` |
| Sale (filtered archive) | `sale_d_t00.jpg`, `sale_d_t01.jpg` | `sale_m_t00.jpg` … `sale_m_t03.jpg` |
| Product: Android radio | `product-android_d_t00.jpg` … `product-android_d_t02.jpg` | `product-android_m_t00.jpg` … `product-android_m_t04.jpg` |
| Product: CarPlay interface (long) | `product-carplay_d_t00.jpg` … `product-carplay_d_t09.jpg` (some lower tiles blank: lazy images) | `product-carplay_m_t00.jpg` … `product-carplay_m_t07.jpg` |
| Services hub | `services_d_t00.jpg` … `services_d_t02.jpg` | `services_m_t00.jpg` … `services_m_t04.jpg` |
| Service: CarPlay & Android Auto | `svc-carplay_d_t00.jpg` … `svc-carplay_d_t02.jpg` | `svc-carplay_m_t00.jpg` … `svc-carplay_m_t05.jpg` |
| Service: Android Radio | `svc-android_d_t00.jpg` … `svc-android_d_t02.jpg` | `svc-android_m_t00.jpg` … `svc-android_m_t04.jpg` |
| Latest jobs | `jobs_d_t00.jpg` … `jobs_d_t05.jpg` | `jobs_m_t00.jpg` … `jobs_m_t06.jpg` |
| About | `about_d_t00.jpg` … `about_d_t03.jpg` | `about_m_t00.jpg` … `about_m_t04.jpg` |
| Contact | `contact_d_t00.jpg` … `contact_d_t02.jpg` | `contact_m_t00.jpg` … `contact_m_t04.jpg` |
| FAQ | `faq_d_t00.jpg` … `faq_d_t02.jpg` | `faq_m_t00.jpg` … `faq_m_t04.jpg` |

### 6.1 Interaction / state shots (viewport-size, `.png` and `.jpg`)

| State | Desktop | Mobile |
|---|---|---|
| Cookie banner | `i_d_cookie_banner` | `i_m_cookie_banner` |
| Home first screen (after consent) | `home_d_fold` | `i_m_home_fold` |
| Shop mega-menu | `i_d_menu_shop` | — |
| Services mega-menu | `i_d_menu_services` | — |
| Mobile off-canvas menu | — | `i_m_menu_open` |
| Sticky header after scroll | `i_d_sticky_featured`, `i_d_tiles_hover` | `i_m_scrolled_sticky` (tab bar, WhatsApp, back-to-top visible) |
| Category tiles (hover test, no change) | `i_d_tiles_nohover`, `i_d_tiles_hover` | — |
| Reviews widget | `i_d_reviews` / `i_d_sticky_featured` | see `home_m_t02.jpg` |
| Search panel | `i_d_search` | `i_m_search` |
| WhatsApp branch picker | `i_d_whatsapp` | — |
| Product card hover (category grid) | `i_d_cat_nohover`, `i_d_cat_card_hover` | — |
| Mobile filter drawer | — | `i_m_filter_drawer` |
| Product first screen, Android radio | `i_d_product_fold` | — |
| Product first screen, CarPlay (thumbnail rail) | `i_d_product_carplay_fold` | `i_m_product_fold`, `i_m_product_scrolled` (chip overflow, express pay) |
| Installation variant selected (+€150) | `i_d_product_install_variant` | — |
| Added-to-basket notice | `i_d_cart_after_add` | — |
| Side cart drawer | `i_d_cart_drawer` | — |
| Sticky "You're viewing" ATC bar | visible in `product-android_d_t00.jpg` and `product-carplay_d_t00.jpg` | — |

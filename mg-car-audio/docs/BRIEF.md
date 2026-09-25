# MG Car Audio: Shopify build brief (handoff for Claude)

> **Who this is for:** an AI agent (Claude) that can use the computer, the browser and the terminal to build this site for Taiwo, a freelance developer.
> **Goal:** build a premium demo Shopify store for MG Car Audio (Dublin) that Taiwo can show the owner. If the owner pays, transfer the store to him.
> **Date of research:** September 2026.

---

## 1. Ground rules for the agent

- **Stop and ask Taiwo before you:** pay for anything, install a paid app, enter card or bank details, transfer store ownership, change DNS or the domain, or contact the client.
- **Taiwo does these steps himself.** The agent waits for them:
  1. Creates the free Shopify Partner account (partners.shopify.com).
  2. Creates a **client transfer store** in the Partner / Dev Dashboard (country: Ireland, currency EUR).
  3. Logs in when the Shopify CLI opens a browser for sign-in.
- **Limits of a client transfer store:**
  - It stays password-protected until the client owns it.
  - It can't take real payments. Use test orders only.
  - You can install only free or partner-friendly apps. Custom and draft apps are blocked, so plan to use the theme, the admin and CSV imports rather than an Admin API custom-app token.
- **Scope:** the store only. The "fitment module" (section 8) is a later, separate project. Don't build it now.
- **Assets:** don't copy logos, photos or text from competitor sites (Radio Masters, Radio King and others). Only MG Car Audio's own content from mgcaraudio.ie may be reused. Use placeholders or royalty-free images elsewhere.

---

## 2. The client

| | |
|---|---|
| Business | MG Car Audio, Dublin, Ireland |
| Tagline on current site | "Ireland's Car Play & Audio Specialist" |
| Phone | 087 034 4355 |
| Current site | https://www.mgcaraudio.ie (Wix; pages: Home, About, Shop, Contact, Book Online) |
| Brands mentioned | JBL, Harman Kardon |
| Critical issue | Current site has `<meta name="robots" content="noindex">`, so it is **invisible on Google**. The new site must be indexable. |

**Services on the current site** (these become collections and service pages):
- Apple CarPlay & Android Auto installation (wired and wireless, OEM retrofits)
- Android radios
- Radio upgrades
- Screen upgrades for BMW, Mercedes, Audi and VW
- JBL radios
- Speaker upgrades
- Subwoofers
- Amplifiers
- Dashcam installation
- Reverse camera installation
- No-sound repair
- Black-screen repair
- Radio password / code

**Car makes the current site says it covers:** BMW, Audi, Volkswagen, Mercedes-Benz, Toyota, Honda, Nissan, Lexus, Ford, Mazda, Hyundai, Kia, Skoda, SEAT, Renault, Peugeot, Citroën, Volvo, Land Rover.

---

## 3. Research summary (why these decisions)

**Big retailers**
- Car Toys (US) is an installer like MG. It left Magento for Shopify because every install is personalised, and it runs install booking on Shopify.
- JB Hi-Fi (Australia) runs on Shopify Plus, and Car Audio Centre (UK) runs on Shopify.
- Only the giants run heavy stacks: Halfords uses Salesforce, and Crutchfield appears to be custom.

**Features worth copying from them**
- Installation sold as a product, or "fitted price" bundles (Best Buy, Car Toys)
- Online booking
- A prominent review badge
- Finance options
- How-to guides

**Small shops win on content, not platform**
- Radio King (Dublin): 4.8★ from 887 Google reviews and pages for each car make, but no real online store.
- Radio Masters (radiomasters.ie, WooCommerce): 4 locations, 10% off for booking online, a WhatsApp button, Google reviews and pages per vehicle.
- apple-carplay.uk: publishes "from £X fitted" prices per model. Irish competitors mostly just say "call for a quote", so this is a gap MG can fill.

**Why Shopify and not the alternatives**
- **Cost:** Basic is about €24 a month, or about €50–110 a month with apps.
- **Handover:** lowest risk, because the owner can manage it himself and any agency could take it over.
- **Custom or headless:** gives no speed or SEO advantage at 100–300 products.
- **Speed:** small stores pass Google's Core Web Vitals more often than big ones. Keep the number of apps low.

**Shopify's weakness**
- Fitment apps use US vehicle data.
- An Irish plate lookup API costs about €0.20 per lookup (carregistrationapi.ie, MotorCheck, One Auto API).
- This is Taiwo's future product opportunity (section 8).

---

## 4. Tech approach

1. **Theme:** start from Shopify's current free default theme (Horizon, or Dawn if Horizon isn't available). Customise it heavily so it doesn't look like a template: premium, dark and automotive, mobile-first.
2. **Theme development:** use the Shopify CLI, which needs Node.js LTS and `npm i -g @shopify/cli`.
   - `shopify theme init` or pull the base theme
   - `shopify theme dev --store <store>.myshopify.com` for a live preview
   - `shopify theme push` to upload
   - Keep the theme in a local git repo.
3. **Products:** create a CSV in Shopify's product import format and import it through Admin → Products → Import, in the browser.
4. **Pages, blog, menus and redirects:** use the admin in the browser, or theme templates plus JSON where possible. Use metaobjects for repeated content such as car-make pages, FAQs and reviews.
5. **Apps (free tiers only while building; list the paid options for Taiwo):**
   - booking app with deposits
   - Google reviews widget
   - WhatsApp button (or build it into the theme with no app)
   - Shopify Search & Discovery for filters (free)

---

## 5. Site structure

**Main menu:** Home · Shop · Services · Car Makes · Gallery · Book Fitting · Contact

**Home page (in order)**
1. Hero: "Ireland's CarPlay & Car Audio Specialist". Buttons: *Book a fitting* · *Get a quote on WhatsApp*.
2. Trust bar: Google rating (placeholder), warranty, "Fitted in Dublin", phone number.
3. "Shop by car make" grid (logos or text tiles).
4. Popular services with "from €X fitted" prices (placeholders; Taiwo gets real prices from the client).
5. Best sellers (product grid).
6. How it works: *Send your reg + dash photo → get a quote → book a slot → drive away*.
7. Install gallery / video strip.
8. Reviews carousel.
9. FAQ.
10. Contact and location map.

**Collections (shop)**
- CarPlay & Android Auto
- Android Radios
- Screen Upgrades
- Speakers
- Subwoofers
- Amplifiers
- Dashcams
- Reverse Cameras
- Accessories
- Installation Services
- Gift Vouchers

**Filters (Search & Discovery):**
- car make
- car model
- screen size
- product type
- brand
- price

Use metafields for car make and model.

**Service pages (one for each service in section 2)**
- what's included
- "from €X fitted" price
- compatible makes
- FAQ
- booking button

**Car make pages (`/pages/bmw-carplay` and so on)**
- Build one template driven by metaobjects.
- Start with BMW, Audi, Mercedes-Benz and VW, then the other makes in section 2.
- Title pattern: "BMW CarPlay & Screen Upgrades in Dublin | MG Car Audio".

**Installation as a product**
- Create install products, for example "CarPlay Installation – BMW", with variants.
- The booking app attaches a time slot and takes a deposit.

**Quote form**
- Fields: name, phone, reg number, car make/model/year, service wanted, dash photo upload, message.
- Also add a floating WhatsApp button linking to `wa.me/353870344355` (confirm the number with Taiwo).

**Other pages**
- About
- Contact (with Google Map)
- Gallery
- FAQ
- Warranty & Returns
- Privacy
- Terms
- Shipping

---

## 6. SEO and launch checklist

- [ ] Store is indexable after launch. Confirm there's no `noindex` anywhere in the theme.
- [ ] Unique title and meta description on every page. LocalBusiness / AutoRepair schema with NAP (name, address, phone).
- [ ] 301 redirects from the old Wix URLs to the new ones:
  - `/about` → `/pages/about`
  - `/contact` → `/pages/contact`
  - `/book-online` → booking page
  - `/category/all-products` → `/collections/all`
  - Also crawl the old site for product URLs and redirect those.
- [ ] Image alt text; compressed WebP images.
- [ ] Lighthouse mobile score of 85 or higher. No more than 3–4 apps.
- [ ] Google Analytics 4 and Meta pixel through the Shopify Google & YouTube and Facebook & Instagram channels (the client connects his own accounts after the transfer).
- [ ] Link the Google Business Profile, with the website set to the new domain.
- [ ] Test orders through Shopify's test gateway.
- [ ] Legal pages generated in Settings → Policies.
- [ ] Irish VAT set up (23% standard rate). Prices shown including VAT.

---

## 7. Build order (demo first)

**Phase 1: demo (show the client before he pays)**
1. Theme set up and branded
2. Home page
3. One collection with about 10 sample products
4. One service page (CarPlay installation)
5. One car make page (BMW)
6. Quote form and WhatsApp button

→ Send Taiwo the preview link and the store password.

**Phase 2: after the client pays 50%**
- the full catalogue
- all service and car make pages
- the booking app with deposits
- the reviews widget
- the gallery
- redirects
- the SEO checklist

**Phase 3: launch.** Taiwo transfers the store, and the client:
- picks a plan
- sets up Shopify Payments
- connects the domain

Then Taiwo gets collaborator/staff access for the care plan.

---

## 8. Future: the fitment module (don't build now)

- **What it is:** a Shopify app owned by Taiwo. The customer types an Irish or UK number plate, the app looks up the car through a plate API, shows compatible products (from a hand-built fitment table covering dash kits, harnesses, CAN-bus interfaces and speaker sizes), and links to booking a fitting slot.
- **How it's sold:** licensed to MG at €49–99 a month, then sold to other installers.
- **What matters most:** the fitment data is the moat, more than the code.
- **Before building:** check that 5–10 installers would pay for it.

---

## 9. Commercial notes (for Taiwo, not the agent)

**Suggested pricing**
- Starter build: €3,500–5,000
- Recommended build: €6,000–8,000
- Care plan: €75–150 a month
- Payment terms: 50% upfront, 50% at launch

**Contract**
- MG owns its store and content.
- Taiwo owns the fitment module.

**Trading Online Voucher**
- Up to €2,500, at 50% co-funding.
- Its 2026 status is unconfirmed. The client should check with his Local Enterprise Office (Dublin).

**Transfer**
- Only transfer after final payment.

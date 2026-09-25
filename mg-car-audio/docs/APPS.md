# MG Car Audio: app shortlist

**Rule from the brief:** no more than 3–4 apps, free tiers only while building, and Taiwo approves anything paid. Every app adds JavaScript to the storefront, so run Lighthouse on mobile again after each install (target 85+).

**Checked on apps.shopify.com on 25 September 2026.** Prices are the listing's own, in USD, billed every 30 days. Ratings are the listing's figures on that date. Anything not stated on the listing is marked **unverified**.

## What a client transfer store allows

From Shopify's developer docs (shopify.dev → Dev Dashboard → Client transfer stores, read 25 September 2026):

- "You can only install free apps and partner-friendly apps. Custom and draft apps can't be installed."
- Real transactions aren't supported: use the Bogus Gateway or Shopify Payments test mode.
- "Stores aren't eligible for promotions or free trials after they're transferred to the client."

"Partner-friendly" means the app's developer lets partners use it free on their build stores. Several listings below have a "Free for development stores" plan. **Caution:** a Shopify Community post from 20 August 2026 reports that Shopify's new "Free for partners and developers" billing option applies only to **Dev** stores, not **Client transfer** stores. So a paid-only app, or an app's "development store" plan, may not work on MG's store before transfer. **Plan on free plans until the transfer, then upgrade on MG's card.** (This is from one community report, not official docs, so treat it as unverified.)

Useful side effect: the free-trial rule means MG gets **no free trials after transfer**, so decide the paid plans with him before he picks one.

## Recommended stack

| # | Need | Pick | When | Cost while building | Cost after launch |
|---|---|---|---|---|---|
| 1 | Filters (car make, model, screen size, type, brand, price) | **Shopify Search & Discovery** | Phase 1 | Free | Free |
| 2 | Booking calendar with €50 deposits | **Cowlendar** (backup: BookThatApp) | Phase 2 | Free plan (5 bookings a month) | From $13.99/month |
| 3 | Google reviews on the site | **Google Reviews Rocket** or **Appio** free plan | Phase 2 | Free | Free, or $4.99–$6.95/month for auto-sync |
| – | WhatsApp button | **No app**: built into the theme | Done | – | – |
| (4) | Quote form with photo upload | Only if WhatsApp photos aren't enough: **Hulk Contact Form Builder** | Optional | Free (1 form, 50 submissions) | $12.90/month |

That's three storefront apps, or four with the optional form. Theme Access (free, by Shopify; for pushing the theme without a staff login) and the Google & YouTube and Facebook & Instagram channels (free, by Shopify; the client connects them after the transfer) don't count towards the limit in any practical sense: Theme Access adds nothing to the storefront.

---

## 1. Search and filters: Shopify Search & Discovery

- **Listing:** https://apps.shopify.com/search-and-discovery · by Shopify · launched 25 July 2022 · rating 2.7 (503 reviews).
- **Price:** Free (verified).
- **Transfer store:** installable (free app, verified against the rule above).
- **Why:** Horizon's collection and search filters come from this app. It's the only way to add filters for the `custom.car_make`, `custom.car_model` and `custom.screen_size` metafields. The BMW page's "Shop BMW parts" button links to `/collections/all?filter.p.m.custom.car_make=BMW`, which only filters once the **Car make** filter exists.
- **Also useful:** synonyms (for example "reversing camera" = "reverse camera"), product boosts, and related products on product pages.
- **The low rating** is mostly merchants wanting more advanced features. It's still the standard, free, Shopify-supported choice.
- Setup steps: `docs/SETUP.md` §10.

## 2. Booking with deposits (Phase 2)

MG already takes a €50 deposit to hold a slot (his current Wix booking page). The demo does this with no app: a **Booking deposit** product at `/products/booking-deposit`, and MG confirms the time by phone or WhatsApp (`docs/content/book-a-fitting.md`). A booking app adds a real calendar with time slots.

| App | Rating | Free plan | Paid plans | Deposits | Notes |
|---|---|---|---|---|---|
| **Cowlendar** (Appointment Booking Cowlendar) · https://apps.shopify.com/cowlendar | 4.9 (2,244) · Built for Shopify | Free: "Unlimited features, 5 bookings/mo" | Starter $13.99/mo (up to $1,000 booking revenue), Basic $29.99/mo (up to $3,000), Growth $59.99/mo (up to $10,000); 7-day trial | Paid plans list "Custom duration / Deposit / Prepayment" (verified). Free plan says "unlimited features", so deposits should work there too (**unverified**) | **Recommended.** Replaces Add to cart with Book now on chosen products. **Check with Cowlendar** whether "booking revenue" counts only the €50 deposits taken online or the full job value: with €350 jobs, the $1,000 cap could be reached in about three bookings |
| **BTA Appointment Booking App** (BookThatApp) · https://apps.shopify.com/bookthatapp | 4.7 (409) · Built for Shopify | Free: 10 bookings | Lite $25/mo (50 bookings), **Premium $49.95/mo (350 bookings, "Deposits/Bonds")**, Business $110/mo | Premium only (verified) | Solid backup. Google, Outlook and iCal sync. Expensive once deposits are needed |
| **Tipo Appointment Booking** · https://apps.shopify.com/tipo-appointment-booking | 4.9 (355) · Built for Shopify | Free: 1 service and 1 team member | Basic $9.90/mo (10 services), Pro $14.90/mo (unlimited); 7-day trial | Listing mentions "flexible payment options"; a deposit feature isn't named in the plans (**unverified**) | Cheapest paid option. Free plan is too small for MG's 6+ services. Ask Tipo about deposits before choosing |
| **Sesami Booking Platform** · https://apps.shopify.com/sesami | 4.6 (266) · Built for Shopify | Free: "Available for development stores" | Small $19/mo (5 calendars), Pro $129/mo, Premium $299/mo | "Deposits" is listed as a feature; which plan includes it isn't stated (**unverified**) | Listing calls itself "Partner-friendly". Its free plan appears to be for development stores only, so it may stop being free after transfer |

**Recommendation:** Cowlendar. Install it on the free plan in Phase 2 to show MG real booking on the installation products, then move to Starter (or Basic, depending on the revenue answer) after the transfer. Set the deposit to €50, and map each installation product's duration to MG's times (1 hr, 1 hr 30, 2 hr; see `docs/content/book-a-fitting.md`).

When a booking app is live, either keep the Booking deposit product for jobs agreed on WhatsApp, or hide it from the Installation Services collection.

## 3. Google reviews widget (Phase 2)

Phase 1 uses the theme's own reviews section, with clearly marked demo reviews, and the trust bar's rating from Theme settings (**placeholder** 4.9 from 120 reviews: replace it with MG's real Google figures). An app pulls in MG's real Google Business Profile reviews.

| App | Rating | Free plan | Paid | Notes |
|---|---|---|---|---|
| **Google Reviews Rocket** (Entangle Commerce) · https://apps.shopify.com/google-review-plus-by-entangle-1 | 5.0 (582) · Built for Shopify | Free: 7 layouts, manual review sync, 1 widget, "a limited number of reviews" | Platinum $4.99/mo (auto-sync unlimited reviews, filters), Pro $9.99/mo | **Recommended for the free plan.** Manual sync is fine for a small shop |
| **Appio Google Reviews** · https://apps.shopify.com/google-reviews-by-appio | 5.0 (97) · Built for Shopify | Free: shows 5 reviews, auto-sync every 24 hours, 5 widgets, filter reviews | Premium $6.95/mo (1,000 reviews, 13+ widgets, no branding) | Good free alternative with automatic sync |
| **Reputon Google Reviews** · https://apps.shopify.com/google-reviews-trust-badge | 5.0 (1,531) · Built for Shopify | "Development stores: Free for development stores, unlimited features" | Standard $6.99/mo | Best-reviewed, but no free plan for live stores, and the development-store plan may not apply to a client transfer store (**unverified**) |
| **GroPulse Google Reviews** · https://apps.shopify.com/gropulse-google-reviews | 4.9 (72) · Built for Shopify | Free: widget customisation, filter by rating | Basic $5.99/mo, Advance $9.99/mo | Fine, fewer reviews on the listing |
| Elfsight Google Reviews · https://apps.shopify.com/elfsight-google-reviews | 4.3 (27) | None: $5.99/mo, 7-day trial | $5.99/mo | Not recommended: no free plan |

**Recommendation:** Google Reviews Rocket or Appio on the free plan. Connect it to MG's Google Business Profile (MG must give access or be present: **human step**), show it in place of the demo reviews, and put the real rating and count into Theme settings → MG Car Audio: business details.

**Structured data:** the theme's AutoRepair schema deliberately has no star rating. Google doesn't show star snippets for reviews a business publishes about itself, so leave any "review rich snippets" option in the app switched off to avoid duplicate or misleading markup.

## 4. WhatsApp: no app

Built into the theme: `snippets/mg-whatsapp-button.liquid`, controlled in Theme settings → MG Car Audio: business details (show button, number `353870344355`, pre-filled message). The quote form and the product fitting card also open WhatsApp with the customer's details pre-filled. **Confirm with MG** that 087 034 4355 is the WhatsApp number.

## 5. Optional: quote form with a photo upload

Shopify's built-in contact form can't take file uploads, so the theme's quote form sends people to WhatsApp for the dash photo. If MG wants uploads on the website itself:

| App | Rating | Free plan | Paid |
|---|---|---|---|
| **Hulk Contact Form Builder** · https://apps.shopify.com/form-builder-by-hulkapps | 4.8 (2,018) · Built for Shopify | 1 form, 50 submissions, **file upload (unlimited storage)**, email notifications, captcha | Pro $12.90/mo, Pro+ $24.90/mo |
| Powerful Contact Form Builder · https://apps.shopify.com/powerful-form-builder | 4.9 (2,517) · Built for Shopify | 1 form, 40 submissions a month, **2 MB file upload limit** | Premium $14.90/mo (30 MB) |

Hulk's free plan fits better: phone photos are often over 2 MB. This would be the fourth app, so only add it if MG asks.

## Not recommended

- A separate WhatsApp chat app: duplicates the theme's button and adds script weight.
- Page builders, pop-up or "trust badge" apps: they hurt speed, and the theme already covers these jobs.
- Fitment or year/make/model apps: they use US vehicle data and don't suit Irish cars. That's the future fitment module (brief §8), not this project.

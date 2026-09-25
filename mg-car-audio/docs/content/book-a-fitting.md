# Page: Book a fitting

| Admin field | Value |
|---|---|
| Title | `Book a Fitting` |
| URL handle | `book-a-fitting` |
| Theme template | `page.book-a-fitting`. The template already shows the hero with the €50 deposit button, the four booking steps, the popular fittings with MG's prices, and a booking FAQ, so the page content is only the deposit terms below. When the booking app is installed (Phase 2), add its booking block or embed to this page |
| SEO title | `Book a Fitting in Dublin 12 \| MG Car Audio` (plain `\|`) |
| SEO description | `Book your CarPlay, Android Auto, screen or audio fitting at MG Car Audio, Dublin 12. A €50 deposit secures your slot and comes off your final bill.` |

Real facts used (from MG's booking page and deposit terms, checked 25 September 2026): €50 deposit taken off the final invoice; non-refundable for no-shows or cancellations with less than 48 hours' notice; free move to a new date with 48 hours' notice; balance paid when the work is done. The template's fitting times are only the ones MG publishes (BMW Android Auto 1 hour, Android radio 1 hour 30, BMW Japan-to-Europe 2 hours). There are no placeholders in the text to paste.

Paste everything below the line into the page editor.

---

## Deposit terms

- A €50 deposit is required to secure your appointment. It confirms your booking, reserves workshop time for your car and lets us have any parts ready.
- The deposit is deducted from your final invoice on the day of your appointment.
- Deposits are non-refundable if you don't attend, or if you cancel with less than 48 hours' notice.
- Need to reschedule? Contact us at least 48 hours before your appointment and we'll move your deposit to a new date.
- The remaining balance is payable once the work has been completed.

Something else in mind? [Get a quote](/pages/get-a-quote) and we'll come back to you with a price and a time.

---

## Notes for Taiwo (don't paste)

**Until a booking app is installed (Phase 1 demo and early Phase 2)**, bookings work like this, with no app:

1. The customer sends their reg and dash photo on WhatsApp (floating button, built into the theme) or uses the quote form at `/pages/get-a-quote`. Quote form emails go to the store's sender email (Settings → Notifications → Sender email).
2. MG replies with a price and a suggested slot.
3. The customer pays the €50 deposit at `/products/booking-deposit`. It's a normal product, so the order shows in **Orders**; MG writes the agreed date and time in the order's notes or timeline.
4. On the day, MG takes the balance in the workshop. On a live store, MG can also use Shopify POS or a draft order.

In a client transfer store, test the deposit with the Bogus Gateway (see `docs/SETUP.md` §2.4). Real payments only work once the store has been transferred and MG has set up Shopify Payments.

**Before the demo:** if MG wants to promise a reply time (for example "We'll usually reply the same working day"), add it to the hero intro in the theme editor. It's left out until he confirms it.

**If you use the Default page template instead** (no `page.book-a-fitting`), paste the steps and a price table as well: BMW Apple CarPlay €350, BMW Android Auto iDrive 7 €299 (about 1 hour), Android radio fitting €150 (about 1 hour 30, you supply the radio), BMW iDrive 7 video in motion €149, BMW Japan-to-Europe €450 (about 2 hours), reverse camera supplied and fitted from €399. MG doesn't publish a fitting time for BMW CarPlay or video in motion, so don't add one.

**When the booking app goes in (Phase 2)**: see `docs/APPS.md`. Attach the app's calendar to the installation products (their product type is `Installation`) and to this page, set the deposit to €50 in the app, and change the template's step 3 ("Pay the €50 deposit") to "Pick a time in the calendar below and pay your €50 deposit online".

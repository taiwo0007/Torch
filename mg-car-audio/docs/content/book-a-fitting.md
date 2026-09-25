# Page: Book a fitting

| Admin field | Value |
|---|---|
| Title | `Book a Fitting` |
| URL handle | `book-a-fitting` |
| Theme template | Default page (`page`) for Phase 1. When the booking app is installed (Phase 2), add its booking block or embed to this page |
| SEO title | `Book a Fitting in Dublin 12 \| MG Car Audio` (plain `\|`) |
| SEO description | `Book your CarPlay, Android Auto, screen or audio fitting at MG Car Audio, Dublin 12. A €50 deposit secures your slot and comes off your final bill.` |

Real facts used (from MG's booking page and deposit terms, checked 25 September 2026): €50 deposit taken off the final invoice; non-refundable for no-shows or cancellations with less than 48 hours' notice; free move to a new date with 48 hours' notice; balance paid when the work is done; the fitting times and prices in the table. The only placeholder is the reply-time promise, marked below.

Paste everything below the line into the page editor.

---

## Book your fitting in four easy steps

### 1. Tell us about your car

Send us your reg and a photo of your dash on WhatsApp, or fill in our [quote form](/pages/get-a-quote). Tell us what you'd like: CarPlay, Android Auto, a bigger screen, better sound or a reversing camera.

### 2. Get your fitted price

We'll confirm exactly what suits your car and give you a fixed fitted price, so there are no surprises on the day.

### 3. Secure your slot with a €50 deposit

Pay a [€50 booking deposit](/products/booking-deposit) online and we'll confirm your date and time. The deposit comes off your final bill.

### 4. Drive in, drive away

Bring your car to our Dublin 12 workshop. Most fittings take one to two hours, and we test everything with you before you leave. The balance is paid when the work is complete.

## Popular fittings and how long they take

| Service | Time | Price |
|---|---|---|
| [BMW Apple CarPlay installation](/products/carplay-installation-bmw) | About 1 hour | €350 |
| [BMW Android Auto installation (iDrive 7)](/products/android-auto-installation-bmw-id7) | About 1 hour | €299 |
| [Android radio fitting](/products/android-radio-installation) (you supply the radio) | About 1 hour 30 minutes | €150 |
| [BMW iDrive 7 video in motion](/products/bmw-idrive7-video-in-motion) | About 1 hour | €149 |
| [BMW Japan-to-Europe conversion](/products/bmw-japan-to-europe-conversion) | About 2 hours | €450 |
| [Reverse camera, supplied and fitted](/products/reverse-camera-installation) | Ask us | From €399 |

Something else? [Get a quote](/pages/get-a-quote) and we'll come back to you with a price and a time.

## Deposit terms

- A €50 deposit is required to secure your appointment. It confirms your booking, reserves workshop time for your car and lets us have any parts ready.
- The deposit is deducted from your final invoice on the day of your appointment.
- Deposits are non-refundable if you don't attend, or if you cancel with less than 48 hours' notice.
- Need to reschedule? Contact us at least 48 hours before your appointment and we'll move your deposit to a new date.
- The remaining balance is payable once the work has been completed.

## Rather talk to us?

Call **087 034 4355** or message us on WhatsApp. We'll usually reply the same working day. *(PLACEHOLDER: confirm MG's usual reply time, or delete this sentence.)*

**MG Car Audio**, Unit 3, Ballymount Business Centre, Ballymount Road Lower, Dublin 12, D12 YX27
Monday to Friday 9:30am to 7pm · Saturday 11am to 7pm · Sunday by appointment

---

## Notes for Taiwo (don't paste)

**Until a booking app is installed (Phase 1 demo and early Phase 2)**, bookings work like this, with no app:

1. The customer sends their reg and dash photo on WhatsApp (floating button, built into the theme) or uses the quote form at `/pages/get-a-quote`. Quote form emails go to the store's sender email (Settings → Notifications → Sender email).
2. MG replies with a price and a suggested slot.
3. The customer pays the €50 deposit at `/products/booking-deposit`. It's a normal product, so the order shows in **Orders**; MG writes the agreed date and time in the order's notes or timeline.
4. On the day, MG takes the balance in the workshop. On a live store, MG can also use Shopify POS or a draft order.

In a client transfer store, test the deposit with the Bogus Gateway (see `docs/SETUP.md` §2.4). Real payments only work once the store has been transferred and MG has set up Shopify Payments.

**When the booking app goes in (Phase 2)**: see `docs/APPS.md`. Attach the app's calendar to the installation products (their product type is `Installation`) and to this page, set the deposit to €50 in the app, and update step 3 above to "Pick a time in the calendar below and pay your €50 deposit online".

# Page: Services

| Admin field | Value |
|---|---|
| Title | `Our Services` |
| URL handle | `services` (the home page services grid's "View all services" button links here) |
| Theme template | `page.services`. The template shows a hero, the eight "popular services" cards with MG's prices, then this page content, how it works and a WhatsApp call to action |
| SEO title | `Car Audio, CarPlay & Screen Fitting Services in Dublin \| MG Car Audio` (plain `\|`) |
| SEO description | `CarPlay and Android Auto, Android radios, screen upgrades, speakers, subwoofers, dashcams, reverse cameras, repairs and import conversions in Dublin 12.` |

Every service from the brief (§2), plus the ones on MG's booking page. **Real prices** come from MG's booking page, service pages and shop (checked 25 September 2026). Services with no published MG price use the obvious "From €X" pattern in the text to paste; the full list of what to confirm is in the notes at the end (and in `docs/SETUP.md` Appendix A).

**Phase 1:** speakers, subwoofers, amplifiers and dashcams have no products yet (their collections are empty), so their links below open the quote form with the service pre-selected. In Phase 2, once those collections have products, change the links back to `/collections/speakers`, `/collections/subwoofers`, `/collections/amplifiers` and `/collections/dashcams`.

Paste everything below the line into the page editor. Make the service names **Heading 3**.

---

## Everything we fit, all under one roof

From wireless CarPlay on your factory screen to a full sound upgrade, every job is done in-house at our Dublin 12 workshop with a factory-style finish. Not sure what you need? Send us your reg and a photo of your dash on WhatsApp.

## Smartphone and screens

### Apple CarPlay and Android Auto installation

Wired or wireless CarPlay and Android Auto, on your factory screen or a new one. BMW Apple CarPlay **€350**, BMW Android Auto on iDrive 7 **€299**.
[Find out more](/pages/carplay-installation)

### Screen upgrades for BMW, Mercedes-Benz, Audi and VW

OEM-style widescreen Android displays with CarPlay and Android Auto built in. From €X fitted.
[Shop screen upgrades](/collections/screen-upgrades)

### Android radios

Big-screen Android head units with CarPlay and Android Auto. Fitting **€150** when you supply the radio.
[Shop Android radios](/collections/android-radios) · [Android radio fitting](/products/android-radio-installation)

### Radio upgrades

Replace a tired factory radio with a modern head unit with Bluetooth, USB and CarPlay. From €X fitted.
[Get a quote](/pages/get-a-quote)

### JBL radios

Head units from JBL, one of the brands we trust. From €X fitted.
[Get a quote](/pages/get-a-quote)

### BMW iDrive 7 video in motion

Let passengers watch video on the move on iDrive 7. **€149**. Passenger use only.
[Book it](/products/bmw-idrive7-video-in-motion)

## Sound

### Speaker upgrades

Clearer vocals and tighter bass from quality door speakers, fitted properly. From €X fitted.
[Get a speaker quote](/pages/get-a-quote?service=Speaker%20upgrade)

### Subwoofers

Deep, controlled bass without losing your boot. From €X fitted.
[Get a subwoofer quote](/pages/get-a-quote?service=Subwoofer)

### Amplifiers

More power and less distortion for your speakers and sub. From €X fitted.
[Get an amplifier quote](/pages/get-a-quote?service=Amplifier)

## Cameras and safety

### Reverse camera installation

HD reversing cameras supplied and fitted to your factory or aftermarket screen: Honda **€399**, Volkswagen **€650**, Audi **€699**, BMW **€750**.
[Book a reverse camera](/products/reverse-camera-installation)

### Dashcam installation

Front or front-and-rear dashcams, hard-wired with no trailing cables. From €X fitted.
[Get a dashcam quote](/pages/get-a-quote?service=Dashcam)

## Japanese imports

### Japan-to-Europe conversions

European maps, English menus and the European radio band for imported cars. BMW **€450** (about 2 hours), Mercedes-Benz **€450**, Volkswagen MIB 2012–2018 **€350**.
[BMW](/products/bmw-japan-to-europe-conversion) · [Mercedes-Benz](/products/mercedes-japan-to-europe-conversion) · [Volkswagen](/products/vw-japan-to-europe-conversion)

### Radio frequency conversion (Japan to Europe)

Get every Irish station on an imported Japanese radio. **€150**, about 1 hour.
[Book it](/products/radio-frequency-conversion-japan-to-europe)

## Repairs

### No-sound repair

Speakers gone quiet? We trace the fault, from fuses and wiring to amplifiers, and fix it. Diagnosis from €X.
[Get a quote](/pages/get-a-quote)

### Black-screen repair

Screen stays black or keeps restarting? We diagnose and repair head units and screens. Diagnosis from €X.
[Get a quote](/pages/get-a-quote)

### Radio password and code

Radio asking for a code after a battery change? We'll get it working again. From €X.
[Get a quote](/pages/get-a-quote)

## Ready when you are

A **€50 deposit** secures your slot and comes off your final bill. [Book a fitting](/pages/book-a-fitting) or [get a quote](/pages/get-a-quote).

---

## Notes for Taiwo (don't paste)

**"From €X" placeholders to fill in with MG** (or delete the price and keep the quote link): screen upgrades, radio upgrades, JBL radios, speakers, subwoofers, amplifiers, dashcams, no-sound repair diagnosis, black-screen repair diagnosis, radio code.

**Prices to confirm with MG:** Mercedes-Benz Japan-to-Europe €450, Volkswagen Japan-to-Europe €350 and radio frequency conversion €150. They come from MG's individual service pages, but the build spec lists them as "price on request", and the same prices are on the products in `data/products.csv`.

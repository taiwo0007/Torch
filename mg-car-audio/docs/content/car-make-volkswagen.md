# Car make entry: Volkswagen (Phase 2)

Values for the **Volkswagen** entry of the `car_make` metaobject, its four `faq` entries and its page. Same steps as BMW (`docs/SETUP.md` §7–8, `car-make-bmw.md`).

The entry's `name` is **Volkswagen**, not "VW": the home page car-make tile, the product metafield `custom.car_make` and the `make:Volkswagen` tag all use the full name, and the page's "Shop Volkswagen parts" button filters products by it. The main menu label can still say **VW**.

> **PLACEHOLDERS, confirm with MG before publishing.** MG's current site has no VW CarPlay price, so that line is invented (marked *placeholder*) and matches the placeholder product in `data/products.csv`. Real MG prices used: VW reverse camera €650 supplied and fitted (MG's shop). From MG's VW service page (checked 25 September 2026): VW Japan-to-Europe conversion €350, 2 hours, MIB units in 2012–2018 models only. The build spec lists that conversion as "price on request", so **ask MG to confirm it**.

---

## 1. FAQ entries

### FAQ 1

- **question:** Can you add wireless CarPlay to my Volkswagen?
- **answer:**

```
Yes. Many Volkswagens with an MIB2 screen already have App-Connect, which gives wired Apple CarPlay and Android Auto, or can have it switched on in software. We check your unit first. If it has App-Connect, a plug-in wireless adapter or a wireless interface cuts the cable; if it doesn't, we'll tell you the simplest way to add it.
```

### FAQ 2

- **question:** Which Volkswagen models do you work on?
- **answer:**

```
All the popular ones, including the Golf, Polo, Passat, Tiguan, Touran, T-Roc and the Transporter. Send us your reg and a photo of your screen and we'll confirm what fits your car and the fitted price.
```

### FAQ 3

- **question:** Can you convert my Japanese-import VW to European spec?
- **answer:**

```
Yes, for Volkswagens with an MIB head unit from 2012 to 2018 models. We update the head unit, radio frequencies and navigation maps to European standards, and it takes about two hours. Send us your reg first and we'll confirm your unit.
```

### FAQ 4

- **question:** Can you fit a reversing camera to my VW?
- **answer:**

```
Yes. We supply and fit a reverse camera for Volkswagen for €650, working with your factory or aftermarket screen, with hidden wiring and parking guidelines where supported.
```

---

## 2. The Volkswagen `car_make` entry

| Field (key) | Value |
|---|---|
| `name` | `Volkswagen` |
| `headline` | `Volkswagen CarPlay & Screen Upgrades in Dublin` |
| `intro` | See below |
| `hero_image` | Upload MG's Android Auto dashboard picture: https://static.wixstatic.com/media/c67c38_025ff690eb284fd08df1b0ac249caa62~mv2.png. *Placeholder*: replace with a real photo of a VW fitting when MG has one |
| `systems` | See below |
| `models` | See below |
| `from_price` | `€329` *placeholder* |
| `services` | See below |
| `faqs` | The 4 Volkswagen FAQ entries, in order |
| `seo_title` | `Volkswagen CarPlay & Screen Upgrades in Dublin \| MG Car Audio` (type a plain `\|`) |
| `seo_description` | See below (150 characters) |

### intro

```
Wireless Apple CarPlay and Android Auto for Volkswagen MIB2 screens, reverse cameras and Japan-to-Europe conversions, all fitted at our Dublin 12 workshop.

Your touchscreen, steering wheel buttons and reversing camera keep working wherever possible. Send us your reg and a photo of your dash and we'll confirm the right option, and the price, before you book.
```

### systems

```
RCD 510 / RNS 510
MIB1
MIB2 (Composition / Discover Media)
MIB3
```

### models

```
Golf (Mk7 / 7.5, 2012–2020)
Golf (Mk8, 2020 on)
Polo (AW, 2017 on)
Passat (B8, 2014–2023)
Tiguan (AD1, 2016–2024)
Touran (5T, 2015 on)
T-Roc (A1, 2017 on)
Transporter (T6 / T6.1, 2015 on)
```

### services

```
Wireless CarPlay & Android Auto for MIB2 | From €329 | /products/wireless-carplay-interface-vw-mib2
Reverse camera, supplied and fitted | €650 | /products/reverse-camera-installation
Japanese-to-European conversion (MIB, 2012–2018) | €350 | /products/vw-japan-to-europe-conversion
Plug-and-play wireless CarPlay adapter | From €79 | /products/wireless-carplay-adapter
Android radio fitting | €150 | /products/android-radio-installation
```

"From €329" and "From €79" are *placeholders*. €650 and €150 are MG's real prices; €350 is from MG's service page (confirm).

### seo_description

```
Wireless CarPlay and Android Auto for Volkswagen MIB2, reverse cameras and Japan-to-Europe conversions. Supplied and fitted at our Dublin 12 workshop.
```

---

## 3. The page

| Setting | Value |
|---|---|
| Title | `Volkswagen CarPlay & Screen Upgrades` (first word must be `Volkswagen`) |
| Theme template | `page.car-make` |
| URL handle | `volkswagen-carplay` (the home page car-make tile links here by default) |
| Metafield **Car make** | the **Volkswagen** entry |
| Search engine listing | same title and description as the entry's SEO fields |

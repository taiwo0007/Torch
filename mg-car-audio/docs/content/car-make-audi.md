# Car make entry: Audi (Phase 2)

Values for the **Audi** entry of the `car_make` metaobject, its four `faq` entries and its page. Same steps as BMW (`docs/SETUP.md` §7–8, `car-make-bmw.md`).

> **PLACEHOLDERS, confirm with MG before publishing.** MG's current site has no Audi CarPlay price. Every price marked *placeholder* below is invented for the demo and matches the placeholder products in `data/products.csv`. Real MG prices used here: Audi reverse camera €699 supplied and fitted (MG's shop), Android radio fitting €150 (MG's booking page).

---

## 1. FAQ entries

### FAQ 1

- **question:** Can you add Apple CarPlay to my Audi's MMI screen?
- **answer:**

```
Yes, on most Audis with MMI 3G or MMI 3G+. We fit a wireless CarPlay and Android Auto interface behind the dash, so you keep the original screen, the MMI dial and your steering wheel buttons, and you can switch back to the standard MMI menus at any time.
```

### FAQ 2

- **question:** How do I know which MMI system my Audi has?
- **answer:**

```
Send us a photo of your screen and the MMI controls on WhatsApp, along with your reg, and we'll tell you. As a rough guide, MMI 3G and 3G+ are found on many A4, A5, A6, Q5 and Q7 models from about 2009 to 2016. Older MMI 2G cars and newer MIB-based Audis need a different kit.
```

### FAQ 3

- **question:** Can you fit a reversing camera to my Audi?
- **answer:**

```
Yes. We supply and fit a reverse camera for Audi for €699, connected to your factory MMI screen with hidden wiring and a factory-style finish. It switches on automatically when you select reverse.
```

### FAQ 4

- **question:** Will I lose any of my Audi's original features?
- **answer:**

```
We choose parts that keep your MMI dial, steering wheel buttons, reversing camera and factory audio working wherever possible. If anything can't be kept on your car, we'll tell you before you book, not after.
```

---

## 2. The Audi `car_make` entry

| Field (key) | Value |
|---|---|
| `name` | `Audi` |
| `headline` | `Audi CarPlay & Screen Upgrades in Dublin` |
| `intro` | See below |
| `hero_image` | Upload MG's Audi CarPlay picture: https://static.wixstatic.com/media/c67c38_499cf02703c84716bc97648b5d9f121d~mv2.png (same as theme asset `mg-audi-carplay-screen.webp`) |
| `systems` | See below |
| `models` | See below |
| `from_price` | `€399` *placeholder* |
| `services` | See below |
| `faqs` | The 4 Audi FAQ entries, in order |
| `seo_title` | `Audi CarPlay & Screen Upgrades in Dublin \| MG Car Audio` (type a plain `\|`) |
| `seo_description` | See below (137 characters) |

### intro

```
Add wireless Apple CarPlay and Android Auto to your Audi's MMI screen and keep the factory look, the MMI dial and your steering wheel buttons. We fit MMI 3G and 3G+ cars, reverse cameras and Android screen upgrades at our Dublin 12 workshop.

Send us your reg and a photo of your dash and we'll confirm exactly what suits your Audi, with a fixed fitted price, before you book.
```

### systems

```
MMI 2G
MMI 3G
MMI 3G+
MIB / MIB2
```

### models

```
A1 (8X, 2010–2018)
A3 (8V, 2012–2020)
A4 (B8, 2008–2015)
A4 (B9, 2015–2023)
A5 (8T, 2007–2016)
A6 (C7, 2011–2018)
A7 (4G, 2010–2018)
Q3 (8U, 2011–2018)
Q5 (8R, 2008–2017)
Q7 (4L, 2006–2015)
```

### services

```
Wireless CarPlay & Android Auto for MMI 3G / 3G+ | From €399 | /products/wireless-carplay-interface-audi-mmi-3g
Reverse camera, supplied and fitted | €699 | /products/reverse-camera-installation
Android radio fitting | €150 | /products/android-radio-installation
Widescreen Android display upgrade | | /pages/get-a-quote
Plug-and-play wireless CarPlay adapter | From €79 | /products/wireless-carplay-adapter
```

"From €399" and "From €79" are *placeholders*. €699 and €150 are MG's real prices.

### seo_description

```
Wireless Apple CarPlay and Android Auto for Audi MMI, reverse cameras and Android screens. Supplied and fitted at our Dublin 12 workshop.
```

---

## 3. The page

| Setting | Value |
|---|---|
| Title | `Audi CarPlay & Screen Upgrades` |
| Theme template | `page.car-make` |
| URL handle | `audi-carplay` |
| Metafield **Car make** | the **Audi** entry |
| Search engine listing | same title and description as the entry's SEO fields |
